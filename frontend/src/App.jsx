import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  AlertCircle,
  Key,
  Globe2,
  Atom,
  Rocket,
  Compass,
  ArrowUpRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const STORAGE_KEY = 'spaceverse_chat_v2';

const TOPIC_SUGGESTIONS = [
  {
    category: 'PLANET EXPLORER',
    title: "What makes Saturn's rings so special?",
    icon: Globe2,
    gradient: 'from-sky-500/15 to-blue-600/10',
    borderColor: 'border-sky-500/30',
  },
  {
    category: 'COSMIC MYSTERIES',
    title: 'What happens inside a black hole?',
    icon: Atom,
    gradient: 'from-blue-500/15 to-indigo-600/10',
    borderColor: 'border-blue-400/30',
  },
  {
    category: 'DEEP SPACE MISSIONS',
    title: 'Tell me about the James Webb Telescope.',
    icon: Rocket,
    gradient: 'from-cyan-500/15 to-sky-600/10',
    borderColor: 'border-cyan-400/30',
  },
];

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking' });
  const [copiedId, setCopiedId] = useState(null);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const consoleRef = useRef(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to sync chat:', e);
    }
  }, [messages]);

  // Check health
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => setBackendHealth(data))
      .catch((err) =>
        setBackendHealth({ status: 'offline', error: err.message })
      );
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  // Auto-resize input
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleSend = async (textToSend) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setError(null);
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }

    // Scroll console smoothly into view if on mobile/desktop
    if (consoleRef.current && messages.length === 0) {
      consoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json();

      if (!res.ok) {
        const err = new Error(data.error || 'Failed to receive cosmic response.');
        err.details = data.details || data.message || '';
        err.code = data.code || 'API_ERROR';
        throw err;
      }

      const aiMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        model: data.model || 'Gemini 3.8 Flash',
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages([...newHistory, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError({
        message: err.message || 'Could not connect to SPACEVERSE AI.',
        details: err.details || '',
        code: err.code || 'CONNECTION_ERROR',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    if (messages.length === 0 || isLoading) return;
    const history = [...messages];
    if (history[history.length - 1].role === 'assistant') {
      history.pop();
    }
    const lastUser = history[history.length - 1];
    if (!lastUser) return;
    setMessages(history);
    handleSend(lastUser.content);
  };

  const focusInput = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    consoleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#0B1120] text-[#F8FAFC] font-sans overflow-x-hidden selection:bg-sky-500/30 selection:text-white">
      
      {/* Ambient Blue & Black Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft radial blue atmosphere glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[160px] opacity-35"
          style={{ background: 'radial-gradient(circle, #0284C7 0%, #1E3A8A 50%, #0F172A 85%)' }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full blur-[170px] opacity-20"
          style={{ background: 'radial-gradient(circle, #38BDF8 0%, #1E293B 70%)' }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-[650px] h-[650px] rounded-full blur-[180px] opacity-20"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, #0B1120 70%)' }}
        />
      </div>

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 w-full h-16 px-6 sm:px-12 flex items-center justify-end z-40 border-b border-sky-500/10 bg-[#0B1120]/85 backdrop-blur-xl transition-all">
        <button
          onClick={() => {
            handleClear();
            focusInput();
          }}
          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-900 hover:bg-sky-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span>New Chat</span>
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start relative z-10 px-4 sm:px-6 pt-10 pb-16 w-full max-w-6xl mx-auto">
        
        {/* HERO SECTION WITH THE LUMINOUS CELESTIAL ARC */}
        <div className="relative w-full flex flex-col items-center text-center pt-8 pb-12 overflow-visible">
          
          {/* Ethereal Vertical Light Pillars (as seen in the reference image) */}
          <div className="vertical-light-pillars" />

          {/* Central Radial Light Beam */}
          <div className="celestial-light-beam" />

          {/* The Glowing Celestial Dome Arc Curve */}
          <div className="celestial-arc-glow" />

          {/* Floating Subtle Starlight Specks */}
          <div className="absolute top-8 left-1/4 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_#38BDF8] animate-float-particle" />
          <div className="absolute top-20 right-1/4 w-1 h-1 rounded-full bg-sky-200 shadow-[0_0_8px_#7DD3FC] animate-float-particle" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-36 left-1/3 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_10px_#60A5FA] animate-float-particle" style={{ animationDelay: '3s' }} />
          <div className="absolute top-28 right-1/3 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#FFF] animate-float-particle" style={{ animationDelay: '2s' }} />

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162340]/80 border border-sky-400/30 text-[11px] font-medium text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] mb-5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="tracking-wide uppercase font-semibold">SPACEVERSE AI · GEMINI 3.8</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 max-w-3xl leading-[1.12] font-space">
            Explore The Cosmos With{' '}
            <span className="bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
              Cosmic Intelligence
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base text-slate-300/90 max-w-xl mx-auto mb-7 leading-relaxed font-normal">
            A minimal AI-powered space exploration system that transforms astrophysics, planetary science, and cosmic mysteries into clear, glowing, effortless insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={focusInput}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-slate-900 hover:bg-sky-50 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all active:scale-95"
            >
              Ask The Universe
            </button>
            <button
              onClick={() => handleSend("What are the top 3 most mind-bending mysteries in modern astrophysics?")}
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#162340]/80 hover:bg-[#1E2E55] text-slate-200 border border-sky-500/25 hover:border-sky-400/50 transition-all backdrop-blur-md"
            >
              Explore Mysteries
            </button>
          </div>
        </div>

        {/* FLOATING GLOWING DASHBOARD / CHAT CONSOLE */}
        <div
          ref={consoleRef}
          className={`w-full max-w-4xl console-card rounded-2xl overflow-hidden transition-all duration-300 relative z-20 flex flex-col shadow-2xl ${
            isConsoleExpanded ? 'h-[85vh] min-h-[680px]' : 'h-[620px] sm:h-[680px]'
          }`}
        >
          {/* Top Console Bar */}
          <div className="h-12 px-5 bg-[#0F172A]/90 border-b border-sky-500/20 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <div className="h-4 w-[1px] bg-sky-500/20 mx-2" />
              <span className="text-xs font-medium text-slate-300 font-space flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Cosmic Console</span>
              </span>
            </div>

            {/* Status & actions */}
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title={isConsoleExpanded ? 'Collapse' : 'Expand'}
              >
                {isConsoleExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Console Body: Welcome Cards OR Chat Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between">
            {messages.length === 0 ? (
              /* Initial State inside Console */
              <div className="my-auto py-6 flex flex-col items-center">
                <p className="text-xs uppercase tracking-widest text-sky-400 font-semibold mb-2">
                  Select A Space Exploration Inquiry
                </p>
                <h3 className="text-lg sm:text-xl font-space font-semibold text-white mb-6 text-center">
                  What mystery of the cosmos would you like to explore today?
                </h3>

                {/* 3 Suggestion Cards with light blue & black gradients */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl">
                  {TOPIC_SUGGESTIONS.map((topic, idx) => {
                    const Icon = topic.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(topic.title)}
                        className={`group relative p-4 rounded-xl text-left bg-gradient-to-b ${topic.gradient} hover:from-sky-500/25 hover:to-blue-600/20 border ${topic.borderColor} hover:border-sky-400/60 transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5 shadow-sm`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0F172A]/80 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 transition-colors" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300 block mb-1">
                            {topic.category}
                          </span>
                          <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white leading-snug">
                            "{topic.title}"
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Active Chat Stream */
              <div className="space-y-5 pb-4">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  const isLatest = idx === messages.length - 1;

                  if (isUser) {
                    return (
                      <div key={msg.id || idx} className="flex justify-end">
                        <div className="max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600/30 to-sky-600/30 border border-sky-400/40 text-[#F8FAFC] shadow-sm backdrop-blur-md">
                          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id || idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                        <Sparkles className="w-4 h-4" />
                      </div>

                      <div className="flex-1 max-w-[92%] sm:max-w-[88%]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-white font-space">
                            SPACEVERSE
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0F172A] text-sky-300 border border-sky-500/20 font-mono">
                            {msg.model || 'Gemini 3.8 Flash'}
                          </span>
                        </div>

                        <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-[#16223B]/90 border border-sky-500/20 text-[#F8FAFC] shadow-sm backdrop-blur-md">
                          <div className="prose-cosmic text-sm sm:text-base">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          {/* Action footer */}
                          <div className="mt-3.5 pt-2.5 border-t border-sky-500/15 flex items-center justify-between text-xs text-slate-400">
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="flex items-center gap-1.5 hover:text-sky-300 transition-colors py-1"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            {isLatest && !isLoading && (
                              <button
                                onClick={handleRegenerate}
                                className="flex items-center gap-1.5 hover:text-sky-300 transition-colors py-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Regenerate</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading state */}
                {isLoading && (
                  <div className="flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-sm bg-[#16223B]/90 border border-sky-500/20 flex items-center gap-2.5 text-xs text-sky-300">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-400" />
                      <span>Retrieving deep-space astrophysical insights with Gemini...</span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-300">{error.message}</p>
                      {error.details && <p className="text-xs text-red-200/80 mt-1">{error.details}</p>}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Console Bottom Floating Input Bar */}
          <div className="p-4 border-t border-sky-500/15 bg-[#0F172A]/80 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-end gap-2 p-2 rounded-xl bg-[#16223B]/95 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.15)] focus-within:border-sky-400 focus-within:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the universe anything (planets, black holes, NASA discoveries)..."
                rows={1}
                disabled={isLoading}
                className="flex-1 max-h-32 min-h-[42px] py-2 px-3 bg-transparent text-[#F8FAFC] placeholder:text-slate-400/70 focus:outline-none resize-none text-xs sm:text-sm leading-relaxed"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send query"
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                  !input.trim() || isLoading
                    ? 'bg-[#0F172A] text-slate-500 cursor-not-allowed'
                    : 'bg-white text-slate-900 hover:bg-sky-100 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <Send className="w-4 h-4 text-slate-900" />
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
              <span className="hidden sm:inline">SPACEVERSE AI · Scientific verification recommended</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
