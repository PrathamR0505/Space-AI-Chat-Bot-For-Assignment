import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Orbit, User, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-space-border/50 bg-[#0B0F20]">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-space-secondary/70 border-b border-space-border/30 text-xs text-text-muted">
        <span className="font-mono text-[11px]">{className?.replace('language-', '') || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-cyan transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-xs sm:text-sm font-mono overflow-x-auto text-[#E2E8F8]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function ChatMessage({ message, isLatest, onRegenerate, isStreaming = false }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format time
  const timeFormatted = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 my-4 group animate-fade-in">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] md:max-w-[68%]">
          <div className="p-4 sm:p-4.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-accent-primary/25 to-[#3B4CC0]/30 border border-accent-primary/40 text-[#F5F7FF] shadow-card-glass backdrop-blur-md">
            <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base selection:bg-accent-primary/50">
              {message.content}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1.5 px-1 text-[11px] text-text-muted">
            {timeFormatted && <span>{timeFormatted}</span>}
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-cyan flex items-center justify-center text-white flex-shrink-0 shadow-cosmic border border-white/20">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // AI Assistant Message
  return (
    <div className="flex items-start gap-3 my-5 group">
      {/* AI Avatar */}
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#7667FF] via-[#27C5F5] to-[#B78AFF] flex items-center justify-center text-white flex-shrink-0 shadow-cosmic border border-white/30">
        <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '24s' }} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-cyan border-2 border-space-dark" />
      </div>

      <div className="flex flex-col items-start max-w-[90%] sm:max-w-[85%] md:max-w-[80%] flex-1">
        {/* Author & Model Header */}
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-xs font-semibold tracking-wide text-text-primary flex items-center gap-1.5 font-space">
            SPACEVERSE AI
            <Sparkles className="w-3 h-3 text-accent-cyan" />
          </span>
          {message.model && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-space-secondary text-accent-purple/90 border border-space-border/40 font-mono">
              {message.model}
            </span>
          )}
          {timeFormatted && <span className="text-[11px] text-text-muted">{timeFormatted}</span>}
        </div>

        {/* Message Body with Markdown */}
        <div className="w-full p-4 sm:p-5 rounded-2xl rounded-tl-sm glass-card border border-space-border/60 text-text-primary shadow-card-glass">
          <div className="prose-cosmic text-sm sm:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (inline) {
                    return (
                      <code className="text-accent-cyan bg-space-secondary/90 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{children}</CodeBlock>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Action Bar: Copy & Regenerate */}
          <div className="mt-4 pt-3 border-t border-space-border/30 flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-2">
              {/* Copy Response Button */}
              <button
                onClick={handleCopy}
                aria-label="Copy response"
                title="Copy response to clipboard"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-space-secondary/60 hover:bg-space-secondary text-text-secondary hover:text-accent-cyan border border-space-border/30 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>

              {/* Regenerate Button (if latest) */}
              {isLatest && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  aria-label="Regenerate response"
                  title="Regenerate this response"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-space-secondary/60 hover:bg-space-secondary text-text-secondary hover:text-accent-purple border border-space-border/30 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-xs">Regenerate</span>
                </button>
              )}
            </div>

            <span className="text-[10px] text-text-muted hidden sm:inline">
              Verified astrophysics & space science
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
