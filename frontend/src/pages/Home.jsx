import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import SpaceBackground from '../components/SpaceBackground';
import { Menu, Orbit, Sparkles, AlertTriangle, Key } from 'lucide-react';

export default function Home() {
  const {
    conversations,
    activeId,
    currentConversation,
    messages,
    isLoading,
    error,
    backendHealth,
    sendMessage,
    regenerateLastResponse,
    startNewChat,
    selectConversation,
    deleteConversation,
    clearAllConversations,
    clearCurrentMessages,
  } = useChat();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-space-dark text-text-primary">
      {/* Immersive Deep-Space Background with Canvas Stars & Particles */}
      <SpaceBackground />

      {/* Collapsible / Mobile Drawer Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onNewChat={startNewChat}
        onClearAll={clearAllConversations}
        onExploreTopic={sendMessage}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        backendStatus={backendHealth?.geminiStatus || backendHealth?.status}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Backend Missing Key Notification (Banner if key missing) */}
        {backendHealth?.geminiStatus === 'missing_api_key' && (
          <div className="bg-amber-950/60 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Gemini API Key Required:</strong> To enable live cosmic responses, add your{' '}
                <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">GEMINI_API_KEY</code>{' '}
                to <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">backend/.env</code>.
              </span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-amber-300 hover:text-white font-medium ml-2 whitespace-nowrap"
            >
              Get Gemini API Key →
            </a>
          </div>
        )}

        {hasMessages ? (
          <ChatWindow
            conversation={currentConversation}
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={sendMessage}
            onRegenerate={regenerateLastResponse}
            onClearChat={clearCurrentMessages}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Mobile Header when in Welcome Mode */}
            <header className="lg:hidden h-14 px-4 flex items-center justify-between glass-panel border-b border-space-border/40 bg-space-dark/60 backdrop-blur-md flex-shrink-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open navigation menu"
                className="p-2 rounded-lg bg-space-card text-text-secondary hover:text-white border border-space-border/40"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4 text-accent-cyan" />
                <span className="font-space font-bold text-sm text-cosmic-gradient">
                  SPACEVERSE
                </span>
              </div>
              <div className="w-8" />
            </header>

            {/* Welcome Screen with Hero, Cards & Space Fact */}
            <WelcomeScreen onSelectSuggestion={sendMessage} />

            {/* Bottom Chat Input */}
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
