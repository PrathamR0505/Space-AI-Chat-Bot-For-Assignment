import { useState, useEffect, useCallback } from 'react';
import { sendChatMessage, checkBackendHealth } from '../services/chatService';

const STORAGE_KEY = 'spaceverse_conversations';
const ACTIVE_ID_KEY = 'spaceverse_active_convo_id';

function generateTitle(text) {
  const clean = text.trim().replace(/^["']|["']$/g, '');
  if (clean.length <= 36) return clean;
  return clean.slice(0, 36) + '...';
}

export function useChat() {
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load conversations from localStorage:', e);
      return [];
    }
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_ID_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking' });

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to persist conversations:', e);
    }
  }, [conversations]);

  // Sync active conversation ID
  useEffect(() => {
    try {
      if (activeId) {
        localStorage.setItem(ACTIVE_ID_KEY, activeId);
      } else {
        localStorage.removeItem(ACTIVE_ID_KEY);
      }
    } catch (e) {
      console.error('Failed to persist activeId:', e);
    }
  }, [activeId]);

  // Check backend health on mount
  const refreshBackendHealth = useCallback(async () => {
    const health = await checkBackendHealth();
    setBackendHealth(health);
  }, []);

  useEffect(() => {
    refreshBackendHealth();
  }, [refreshBackendHealth]);

  // Current active conversation
  const currentConversation = conversations.find((c) => c.id === activeId) || null;
  const messages = currentConversation ? currentConversation.messages : [];

  // Start a fresh new chat
  const startNewChat = useCallback(() => {
    setActiveId(null);
    setError(null);
  }, []);

  // Select an existing conversation
  const selectConversation = useCallback((id) => {
    setActiveId(id);
    setError(null);
  }, []);

  // Delete a single conversation
  const deleteConversation = useCallback((id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      return next;
    });
    if (activeId === id) {
      setActiveId(null);
    }
  }, [activeId]);

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_ID_KEY);
  }, []);

  // Clear messages in current conversation
  const clearCurrentMessages = useCallback(() => {
    if (!activeId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [], updatedAt: new Date().toISOString() } : c))
    );
    setError(null);
  }, [activeId]);

  // Send a message
  const sendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim() || isLoading) return;

      const trimmedText = text.trim();
      const userMessage = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        role: 'user',
        content: trimmedText,
        timestamp: new Date().toISOString(),
      };

      setError(null);
      setIsLoading(true);

      let targetConvoId = activeId;
      let updatedHistory = [];

      // Determine or create conversation
      if (!targetConvoId || !conversations.some((c) => c.id === targetConvoId)) {
        targetConvoId = 'convo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        const newConvo = {
          id: targetConvoId,
          title: generateTitle(trimmedText),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [userMessage],
        };
        setConversations((prev) => [newConvo, ...prev]);
        setActiveId(targetConvoId);
        updatedHistory = [userMessage];
      } else {
        const existing = conversations.find((c) => c.id === targetConvoId);
        updatedHistory = [...(existing ? existing.messages : []), userMessage];
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetConvoId
              ? {
                  ...c,
                  messages: updatedHistory,
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      }

      try {
        // Send history to Gemini backend
        const result = await sendChatMessage(updatedHistory);

        const aiMessage = {
          id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
          role: 'assistant',
          content: result.reply,
          model: result.model,
          timestamp: result.timestamp,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetConvoId
              ? {
                  ...c,
                  messages: [...updatedHistory, aiMessage],
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      } catch (err) {
        console.error('Chat error:', err);
        setError({
          message: err.message || 'Cosmic connection failure.',
          details: err.details || '',
          code: err.code || 'UNKNOWN_ERROR',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, conversations, isLoading]
  );

  // Regenerate last AI response
  const regenerateLastResponse = useCallback(async () => {
    if (!activeId || isLoading) return;
    const convo = conversations.find((c) => c.id === activeId);
    if (!convo || convo.messages.length === 0) return;

    // Filter out the last message if it's from the assistant
    let historyToUse = [...convo.messages];
    if (historyToUse[historyToUse.length - 1].role === 'assistant') {
      historyToUse.pop();
    }

    if (historyToUse.length === 0) return;

    setError(null);
    setIsLoading(true);

    // Update conversation with removed assistant response
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: historyToUse } : c))
    );

    try {
      const result = await sendChatMessage(historyToUse);
      const aiMessage = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        role: 'assistant',
        content: result.reply,
        model: result.model,
        timestamp: result.timestamp,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: [...historyToUse, aiMessage],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } catch (err) {
      console.error('Regenerate error:', err);
      setError({
        message: err.message || 'Cosmic connection failure during regeneration.',
        details: err.details || '',
        code: err.code || 'UNKNOWN_ERROR',
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeId, conversations, isLoading]);

  return {
    conversations,
    activeId,
    currentConversation,
    messages,
    isLoading,
    error,
    backendHealth,
    refreshBackendHealth,
    sendMessage,
    regenerateLastResponse,
    startNewChat,
    selectConversation,
    deleteConversation,
    clearAllConversations,
    clearCurrentMessages,
  };
}
