import SuggestionCard from './SuggestionCard';
import SpaceFact from './SpaceFact';
import { Sparkles, Telescope, Compass, Rocket, Atom } from 'lucide-react';

const SUGGESTIONS = [
  {
    category: 'PLANET EXPLORER',
    question: "What makes Saturn's rings so special?",
    type: 'planet',
  },
  {
    category: 'COSMIC MYSTERIES',
    question: 'What happens inside a black hole?',
    type: 'blackhole',
  },
  {
    category: 'DEEP SPACE',
    question: 'How many galaxies exist in the universe?',
    type: 'deepspace',
  },
  {
    category: 'SPACE MISSIONS',
    question: 'Tell me about the James Webb Telescope.',
    type: 'mission',
  },
];

const EXPLORE_PILLS = [
  { label: 'The Big Bang Origin', query: 'How did the universe begin with the Big Bang, and what happened in the first three minutes?' },
  { label: 'Exoplanets & Aliens', query: 'Have we found Earth-like exoplanets in habitable zones that could support extraterrestrial life?' },
  { label: 'Dark Matter & Energy', query: 'What is the difference between dark matter and dark energy, and how do we know they exist?' },
  { label: 'Wormhole Physics', query: 'Are wormholes scientifically possible according to Einstein\'s General Theory of Relativity?' },
];

export default function WelcomeScreen({ onSelectSuggestion }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-10 lg:px-16 flex flex-col items-center justify-center max-w-5xl mx-auto w-full relative z-10">
      
      {/* Hero Visual: Celestial Planet & Orbit */}
      <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-accent-primary/40 via-accent-cyan/20 to-accent-purple/30 blur-3xl animate-pulse-glow" />

        {/* Orbit Rings Container */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          {/* Outer Orbit */}
          <div className="absolute inset-0 rounded-full border border-accent-cyan/30 border-dashed animate-orbit-slow" />
          
          {/* Tilted Ellipse Ring */}
          <div 
            className="absolute -inset-4 rounded-full border-2 border-accent-primary/50 transform -rotate-45"
            style={{ borderRadius: '50%', transform: 'rotate(-35deg) scaleY(0.45)' }}
          />

          {/* Central Planet Sphere */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#7667FF] via-[#3B4CC0] to-[#101629] shadow-cosmic-lg flex items-center justify-center overflow-hidden border border-accent-cyan/40">
            {/* Planet Atmosphere Shimmer */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full blur-[2px]" />
            <div className="absolute bottom-1 right-2 w-12 h-6 bg-accent-cyan/30 rounded-full blur-md" />
            <div className="relative z-10 text-white/90">
              <Atom className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse text-accent-cyan" />
            </div>
          </div>

          {/* Orbiting Moon / Satellite */}
          <div className="absolute inset-0 animate-orbit-slow" style={{ animationDuration: '14s' }}>
            <div className="w-3.5 h-3.5 rounded-full bg-accent-cyan shadow-[0_0_10px_#27C5F5] -top-1 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>

      {/* Main Heading & Tagline */}
      <div className="text-center mb-8 sm:mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-space-card/80 border border-space-border/60 text-xs font-medium text-accent-cyan mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
          <span className="tracking-wide uppercase font-semibold">SPACEVERSE AI 2.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 font-space text-cosmic-gradient leading-tight">
          THE UNIVERSE IS WAITING.
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed font-normal">
          Your personal AI guide to the mysteries of space. Ask anything, explore everything.
        </p>
      </div>

      {/* Interactive Suggestion Cards Grid (4 Cards) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
        {SUGGESTIONS.map((item, idx) => (
          <SuggestionCard
            key={idx}
            category={item.category}
            question={item.question}
            type={item.type}
            onClick={onSelectSuggestion}
          />
        ))}
      </div>

      {/* Quick Exploration Pills */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <Telescope className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
            Cosmic Explorations:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXPLORE_PILLS.map((pill, i) => (
            <button
              key={i}
              onClick={() => onSelectSuggestion(pill.query)}
              className="text-xs px-3 py-1.5 rounded-lg bg-space-secondary/70 hover:bg-space-card text-text-secondary hover:text-accent-cyan border border-space-border/40 hover:border-accent-cyan/30 transition-all duration-200"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature 1: Random Space Fact */}
      <div className="w-full">
        <SpaceFact onAskQuestion={onSelectSuggestion} />
      </div>

    </div>
  );
}
