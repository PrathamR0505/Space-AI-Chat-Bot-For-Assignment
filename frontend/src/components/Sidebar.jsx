import { useState } from 'react';
import {
  Orbit,
  Plus,
  Compass,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Telescope,
  Rocket,
  Globe2,
  Atom,
  Info,
} from 'lucide-react';

const EXPLORE_TOPICS = [
  {
    id: 'solar-system',
    title: 'Solar System',
    icon: Globe2,
    color: 'text-[#27C5F5]',
    introQuestion: 'Tell me an overview of our Solar System, the order and unique traits of planets from the Sun, and what lies in the Kuiper Belt.',
  },
  {
    id: 'galaxies',
    title: 'Galaxies',
    icon: Compass,
    color: 'text-[#B78AFF]',
    introQuestion: 'How do galaxies form and evolve, what is the structure of the Milky Way, and what will happen when we collide with Andromeda?',
  },
  {
    id: 'black-holes',
    title: 'Black Holes',
    icon: Atom,
    color: 'text-[#7667FF]',
    introQuestion: 'Explain black holes simply: event horizons, singularities, Hawking radiation, and how supermassive black holes anchor galaxies.',
  },
  {
    id: 'stars-nebulae',
    title: 'Stars & Nebulae',
    icon: Telescope,
    color: 'text-[#FFD166]',
    introQuestion: 'How are stars born inside cosmic nebulae, what are their life cycles, and how are heavy elements forged inside stellar cores?',
  },
  {
    id: 'space-missions',
    title: 'Space Missions',
    icon: Rocket,
    color: 'text-[#FF758F]',
    introQuestion: 'What are humanity’s most historic space exploration missions (Apollo, Voyager, Hubble, James Webb, Artemis), and what are we seeking next?',
  },
];

export default function Sidebar({
  conversations = [],
  activeId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  onClearAll,
  onExploreTopic,
  isOpenMobile,
  onCloseMobile,
  backendStatus = 'online',
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTopicClick = (topic) => {
    onExploreTopic(topic.introQuestion);
    if (isOpenMobile) onCloseMobile();
  };

  const handleConversationClick = (id) => {
    onSelectConversation(id);
    if (isOpenMobile) onCloseMobile();
  };

  const handleNewChatClick = () => {
    onNewChat();
    if (isOpenMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col glass-panel border-r border-space-border/50 bg-[#0A0E20]/95 lg:bg-space-secondary/60 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Top Header & Branding */}
        <div className="flex items-center justify-between p-4 border-b border-space-border/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-cyan flex items-center justify-center text-white shadow-cosmic flex-shrink-0">
              <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-0 rounded-xl border border-white/30" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-space font-bold text-base tracking-wider text-cosmic-gradient">
                  SPACEVERSE
                </span>
                <span className="text-[10px] tracking-widest text-text-muted uppercase">
                  Cosmic AI Engine
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-space-card/80 hover:bg-space-card text-text-secondary hover:text-accent-cyan border border-space-border/40 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-space-card text-text-secondary hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChatClick}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-accent-primary to-[#5A48EA] hover:from-[#8778FF] hover:to-[#6B59F8] text-white font-medium text-sm shadow-cosmic hover:shadow-cosmic-lg transition-all duration-200 active:scale-95 group ${
              isCollapsed ? 'px-0' : ''
            }`}
            title="Start New Cosmic Chat"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            {!isCollapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Explore Space Section */}
          <div>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Explore Space
                </span>
                <Sparkles className="w-3 h-3 text-accent-cyan" />
              </div>
            )}

            <div className="space-y-1">
              {EXPLORE_TOPICS.map((topic) => {
                const IconComponent = topic.icon;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    title={topic.title}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-space-card/80 border border-transparent hover:border-space-border/40 transition-all duration-150 group text-left ${
                      isCollapsed ? 'justify-center px-0' : ''
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${topic.color} group-hover:scale-110 transition-transform`}
                    />
                    {!isCollapsed && <span className="truncate">{topic.title}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Conversations Section */}
          <div>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Recent Explorations
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  {conversations.length}
                </span>
              </div>
            )}

            {conversations.length === 0 ? (
              !isCollapsed && (
                <div className="px-2 py-4 text-center">
                  <MessageSquare className="w-6 h-6 mx-auto mb-1 text-text-muted/40" />
                  <p className="text-xs text-text-muted">No saved chats yet</p>
                </div>
              )
            ) : (
              <div className="space-y-1">
                {conversations.map((convo) => {
                  const isActive = convo.id === activeId;
                  return (
                    <div
                      key={convo.id}
                      onClick={() => handleConversationClick(convo.id)}
                      title={convo.title}
                      className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer text-xs transition-all duration-150 ${
                        isActive
                          ? 'bg-space-card border border-accent-cyan/40 text-text-primary font-medium shadow-card-glass'
                          : 'text-text-secondary hover:text-text-primary hover:bg-space-card/50 border border-transparent'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <MessageSquare
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isActive ? 'text-accent-cyan' : 'text-text-muted group-hover:text-text-secondary'
                        }`}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{convo.title}</span>
                          <button
                            onClick={(e) => onDeleteConversation(convo.id, e)}
                            title="Delete exploration"
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-text-muted transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Clear History & Profile Footer */}
        <div className="p-3 border-t border-space-border/40 space-y-2">
          {conversations.length > 0 && !isCollapsed && (
            <div>
              {showClearConfirm ? (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs">
                  <p className="text-red-200 mb-2 font-medium">Clear all conversations?</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClearAll();
                        setShowClearConfirm(false);
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-medium"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1 bg-space-card hover:bg-space-secondary text-text-secondary rounded-lg text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear conversation history</span>
                </button>
              )}
            </div>
          )}

          {/* User Profile Section */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-space-card/60 border border-space-border/30 ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-primary to-[#27C5F5] flex items-center justify-center text-white text-xs font-bold font-space">
                SP
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-space-dark ${
                  backendStatus === 'online'
                    ? 'bg-emerald-400'
                    : backendStatus === 'missing_api_key'
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
                title={`Status: ${backendStatus}`}
              />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate flex-1">
                <span className="text-xs font-medium text-text-primary truncate">
                  Cosmic Explorer
                </span>
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  {backendStatus === 'online' ? (
                    <span className="text-emerald-400">Gemini Active</span>
                  ) : backendStatus === 'missing_api_key' ? (
                    <span className="text-amber-400">API Key Needed</span>
                  ) : (
                    <span className="text-red-400">Backend Offline</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
