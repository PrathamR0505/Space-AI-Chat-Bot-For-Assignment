import { useState } from 'react';
import { Sparkles, RefreshCw, Compass } from 'lucide-react';

const SPACE_FACTS = [
  {
    topic: 'Venusian Days',
    fact: 'A day on Venus is longer than a year on Venus! It takes 243 Earth days to rotate once on its axis, but only 225 Earth days to complete an orbit around the Sun.',
    question: 'Why is a day on Venus longer than its year, and why does it rotate backward?',
  },
  {
    topic: 'Neutron Stars',
    fact: 'Neutron stars can spin at a mind-boggling rate of up to 700 times per second! A single sugar-cube-sized amount of neutron star matter would weigh around a billion tons on Earth.',
    question: 'How are neutron stars formed, and why are they so incredibly dense?',
  },
  {
    topic: 'Silent Cosmos',
    fact: 'Space is completely silent. Sound needs a medium like air or water to travel through. Because space is a near-perfect vacuum, no sound can be heard across interplanetary voids.',
    question: 'If space is a vacuum with no sound, how do scientists record "sounds" from planets and black holes?',
  },
  {
    topic: 'Solar Mass',
    fact: 'Our Sun accounts for approximately 99.86% of all the mass in the entire Solar System. Jupiter and Saturn make up most of the remaining 0.14%.',
    question: 'How did the Sun acquire 99.86% of the solar system mass, and what will happen when it runs out of fuel?',
  },
  {
    topic: 'The Giant Mountain',
    fact: 'Olympus Mons on Mars is the largest volcano in the Solar System. Standing nearly 22 km (13.6 miles) high, it is roughly three times taller than Mount Everest!',
    question: 'Tell me about Olympus Mons on Mars and why Martian volcanoes grow so much larger than Earth volcanoes.',
  },
  {
    topic: 'Cosmic Water Reservoir',
    fact: 'Astronomers discovered a massive cloud of water vapor around a quasar 12 billion light-years away, holding 140 trillion times more water than all of Earth’s oceans combined.',
    question: 'What is the massive 140-trillion-ocean water reservoir found in deep space quasars?',
  },
  {
    topic: 'Footprints on the Moon',
    fact: 'Because the Moon has no atmosphere, wind, or liquid water to erode the soil, Apollo astronaut footprints will likely stay intact for at least 100 million years.',
    question: 'Why do footprints on the Moon last for millions of years, and what space weathering does occur?',
  },
  {
    topic: 'Diamond Rain',
    fact: 'Extreme atmospheric pressures on icy giants Neptune and Uranus can compress carbon atoms into solid diamonds that literally precipitate and rain down toward their cores.',
    question: 'Is it true that it rains diamonds on Neptune and Uranus? Explain the scientific theory behind it.',
  },
  {
    topic: 'Interstellar Voyager',
    fact: 'Launched in 1977, Voyager 1 is now over 15 billion miles (24 billion km) away in interstellar space, carrying the Golden Record with sounds and images of Earth.',
    question: 'Where is Voyager 1 right now, what is on the Golden Record, and how is it still transmitting data?',
  },
  {
    topic: 'Cosmic Microwave Background',
    fact: 'About 1% of the static noise on old analog television sets between channels was caused by the afterglow radiation of the Big Bang itself.',
    question: 'What is the Cosmic Microwave Background radiation and what does it tell us about the origin of the universe?',
  },
  {
    topic: 'Saturn\'s Hexagon',
    fact: 'Saturn’s north pole is home to a permanent, swirling hexagonal storm larger than two Earths across, with sides each extending about 14,500 km.',
    question: 'What creates the mysterious hexagonal storm at Saturn’s north pole?',
  },
  {
    topic: 'Rogue Planets',
    fact: 'Billions of "rogue planets" wander the Milky Way completely unattached to any star, roaming the dark voids of space alone.',
    question: 'What are rogue planets, how were they ejected from star systems, and could they harbor subsurface life?',
  },
];

export default function SpaceFact({ onAskQuestion }) {
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * SPACE_FACTS.length)
  );
  const [isRotating, setIsRotating] = useState(false);

  const handleNextFact = () => {
    setIsRotating(true);
    setTimeout(() => {
      setFactIndex((prev) => (prev + 1) % SPACE_FACTS.length);
      setIsRotating(false);
    }, 250);
  };

  const current = SPACE_FACTS[factIndex];

  return (
    <div className="relative glass-card rounded-2xl p-4 sm:p-5 border border-space-border/60 overflow-hidden group">
      {/* Background glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-accent-cyan/15 transition-all duration-500" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center text-accent-cyan">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-accent-purple">
            Cosmic Fact of the Moment
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-space-secondary text-text-secondary border border-space-border/40 hidden sm:inline-block">
            {current.topic}
          </span>
        </div>

        <button
          onClick={handleNextFact}
          aria-label="Get another space fact"
          title="Discover another fact"
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-cyan px-2.5 py-1 rounded-lg bg-space-secondary/60 hover:bg-space-secondary border border-space-border/40 transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isRotating ? 'rotate-180 text-accent-cyan' : ''
            }`}
          />
          <span className="hidden sm:inline">Shuffle</span>
        </button>
      </div>

      <p className="text-sm text-text-primary/95 leading-relaxed relative z-10 font-normal">
        "{current.fact}"
      </p>

      {onAskQuestion && (
        <div className="mt-3 pt-3 border-t border-space-border/30 flex justify-end relative z-10">
          <button
            onClick={() => onAskQuestion(current.question)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-cyan hover:text-white transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore this mystery</span>
            <span className="text-accent-purple">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
