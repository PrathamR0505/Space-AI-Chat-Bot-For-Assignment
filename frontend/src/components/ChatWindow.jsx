import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Menu, Trash2, AlertCircle, Sparkles, Loader2, Key } from 'lucide-react';

export default function ChatWindow({
  conversation,
  messages = [],
  isLoading,
  error,
  onSendMessage,
  onRegenerate,
  onClearChat,
  onOpenMobileSidebar,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  const title = conversation?.title || 'Cosmic Exploration';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      {/* Top Header Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between glass-panel border-b border-space-border/40 bg-space-dark/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onOpenMobileSidebar}
            aria-label="Open sidebar"
            className="lg:hidden p-2 rounded-lg bg-space-card text-text-secondary hover:text-white border border-space-border/40"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="font-space font-semibold text-sm sm:text-base text-text-primary truncate max-w-[200px] sm:max-w-md">
              {title}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-space-card text-[11px] text-accent-cyan border border-space-border/40">
              <Sparkles className="w-3 h-3" />
              <span>Gemini 2.5</span>
            </span>
          </div>
        </div>

        {/* Clear Current Chat Button */}
        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-red-400 bg-space-card/60 hover:bg-red-500/10 border border-space-border/40 transition-colors"
            title="Clear this conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </header>

      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 lg:px-20 py-6 space-y-4">
        {messages.map((message, idx) => {
          const isLatest = idx === messages.length - 1;
          return (
            <ChatMessage
              key={message.id || idx}
              message={message}
              isLatest={isLatest}
              onRegenerate={onRegenerate}
            />
          );
        })}

        {/* AI Typing / Loading State Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 my-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-cyan flex items-center justify-center text-white flex-shrink-0 shadow-cosmic border border-white/20">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            </div>

            <div className="p-4 rounded-2xl rounded-tl-sm glass-card border border-space-border/60 max-w-[80%]">
              <div className="flex items-center gap-2 text-xs text-accent-cyan">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span className="font-space">Scanning deep space signals...</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 my-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm shadow-card-glass">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-red-300">{error.message}</p>
                {error.details && <p className="text-xs text-red-200/80">{error.details}</p>}
                {error.code === 'API_KEY_MISSING' && (
                  <div className="mt-2.5 pt-2 border-t border-red-500/20 text-xs text-text-primary bg-space-card/60 p-2.5 rounded-lg flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      Add your <code>GEMINI_API_KEY</code> into <code>backend/.env</code> and restart the backend server.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Chat Input */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
