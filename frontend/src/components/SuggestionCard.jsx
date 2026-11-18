import { Orbit, Compass, Globe, Rocket, ArrowUpRight } from 'lucide-react';

const ICON_MAP = {
  planet: Orbit,
  blackhole: Compass,
  deepspace: Globe,
  mission: Rocket,
};

const COLOR_MAP = {
  planet: {
    bg: 'from-[#7667FF]/20 to-[#27C5F5]/10',
    border: 'group-hover:border-accent-cyan/50',
    iconColor: 'text-[#27C5F5]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(39,197,245,0.25)]',
  },
  blackhole: {
    bg: 'from-[#B78AFF]/20 to-[#7667FF]/10',
    border: 'group-hover:border-accent-purple/50',
    iconColor: 'text-[#B78AFF]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(183,138,255,0.25)]',
  },
  deepspace: {
    bg: 'from-[#27C5F5]/20 to-[#7667FF]/10',
    border: 'group-hover:border-accent-primary/50',
    iconColor: 'text-[#7667FF]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(118,103,255,0.25)]',
  },
  mission: {
    bg: 'from-[#FF9E7D]/20 to-[#7667FF]/10',
    border: 'group-hover:border-[#FF9E7D]/50',
    iconColor: 'text-[#FF9E7D]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(255,158,125,0.25)]',
  },
};

export default function SuggestionCard({ category, question, type = 'planet', onClick }) {
  const IconComponent = ICON_MAP[type] || Orbit;
  const styling = COLOR_MAP[type] || COLOR_MAP.planet;

  return (
    <button
      onClick={() => onClick(question)}
      className={`group relative text-left w-full p-4 sm:p-5 rounded-2xl glass-card border border-space-border/50 bg-gradient-to-br ${styling.bg} ${styling.border} ${styling.glow} transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-space-secondary/90 border border-space-border/60 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <IconComponent className={`w-5 h-5 ${styling.iconColor}`} />
          </div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-text-secondary group-hover:text-text-primary transition-colors">
            {category}
          </span>
        </div>
        <div className="w-7 h-7 rounded-full bg-space-secondary/50 border border-space-border/40 flex items-center justify-center text-text-muted group-hover:text-accent-cyan group-hover:bg-accent-cyan/10 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      <p className="text-sm font-medium text-text-primary group-hover:text-white transition-colors leading-snug">
        "{question}"
      </p>
    </button>
  );
}
