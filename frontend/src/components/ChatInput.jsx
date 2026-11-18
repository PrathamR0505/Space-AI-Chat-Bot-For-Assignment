import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, ArrowUp } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading, disabled = false }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = 160;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${Math.max(newHeight, 48)}px`;
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSendDisabled = !input.trim() || isLoading || disabled;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-2 relative z-20">
      {/* Floating Input Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-2 sm:p-2.5 rounded-2xl glass-input border border-space-border/60 shadow-cosmic transition-all duration-300 hover:border-accent-primary/40 focus-within:border-accent-cyan/60 focus-within:shadow-cosmic-cyan"
      >
        {/* Cosmic Icon Indicator */}
        <div className="hidden sm:flex items-center justify-center pl-2 pb-2.5 text-accent-cyan">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the universe anything..."
          rows={1}
          disabled={isLoading || disabled}
          className="flex-1 max-h-40 min-h-[44px] py-2 px-2 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none resize-none text-sm sm:text-base leading-relaxed"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isSendDisabled}
          aria-label="Send message"
          className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
            isSendDisabled
              ? 'bg-space-secondary/60 text-text-muted cursor-not-allowed opacity-50'
              : 'bg-gradient-to-tr from-accent-primary to-accent-cyan text-white shadow-cosmic hover:shadow-cosmic-lg hover:scale-105 active:scale-95'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Footer Disclaimer */}
      <div className="text-center mt-2">
        <p className="text-[11px] text-text-muted/80 tracking-wide">
          SPACEVERSE AI can make mistakes. Verify important scientific information.
        </p>
      </div>
    </div>
  );
}
