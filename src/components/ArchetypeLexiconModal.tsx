import React, { useState } from 'react';
import { X, BookOpen, Compass, Shield, Sun, Moon, Flame, Sparkles } from 'lucide-react';

interface ArchetypeLexiconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARCHETYPES_DATA = [
  {
    name: 'The Shadow',
    epithet: 'The Repressed & Unacknowledged Self',
    icon: Moon,
    overview:
      'The Shadow contains all instinctual desires, weaknesses, aggressive impulses, and neglected creative potentials that the conscious ego finds unacceptable or incompatible with social standards.',
    dreamManifestations: [
      'Pursuers, dark figures, menacing intruders, criminals, or untamed beasts.',
      'Figures of the same sex who possess traits you consciously despise or envy.',
      'Hidden basements, subterranean tunnels, murky water, or unlit locked rooms.',
    ],
    jungianQuote: 'Everyone carries a shadow, and the less it is embodied in the individual’s conscious life, the blacker and denser it is.',
    integrationExercise: 'When someone in a dream disturbs you, ask: "Where in my waking life do I deny having this exact impulse?"',
  },
  {
    name: 'The Anima & Animus',
    epithet: 'The Contrasexual Soul Guide',
    icon: Compass,
    overview:
      'The inner opposite: the Anima is the female soul-image in a male psyche, and the Animus is the male spirit-image in a female psyche. They act as psychological bridges between personal ego and the vast collective unconscious.',
    dreamManifestations: [
      'Mysterious lovers, elusive sirens, guides across foreign oceans or mountains.',
      'A wise priestess, an alluring stranger, a poetic wanderer, or an authoritative judge.',
      'Metamorphosing figures that challenge your emotional rigidities.',
    ],
    jungianQuote: 'The Anima is the archetype of life itself.',
    integrationExercise: 'Contemplate what emotional or intuitive capacities you project onto romantic partners instead of developing within yourself.',
  },
  {
    name: 'The Persona',
    epithet: 'The Social Mask & Shield',
    icon: Shield,
    overview:
      'The mask we construct to navigate societal expectations, careers, and social hierarchies. Problems arise when the ego over-identifies with the Persona, forgetting the genuine Self beneath.',
    dreamManifestations: [
      'Being caught naked or inappropriately dressed in public examinations or meetings.',
      'Cracking masks, ill-fitting formal suits, uniforms, or makeup melting off.',
      'Loss of teeth, shedding skin, or speaking without producing sound.',
    ],
    jungianQuote: 'The persona is a complicated system of relations between the individual consciousness and society.',
    integrationExercise: 'Identify which role in waking life you are playing solely to avoid disapproval.',
  },
  {
    name: 'The Self',
    epithet: 'The Transcendent Wholeness',
    icon: Sun,
    overview:
      'The archetype of psychic wholeness, integration, and totality. It represents the center and circumference of the psyche, encompassing both conscious and unconscious.',
    dreamManifestations: [
      'Sacred mandalas, radiant golden spheres, quadripartite geometric temples.',
      'A child endowed with divine insight, a radiant white stag, or an ancient tree bridging sky and earth.',
      'Moments of oceanic peace, unity, or transcendent light.',
    ],
    jungianQuote: 'The Self is not only the centre, but also the whole circumference which embraces both conscious and unconscious.',
    integrationExercise: 'Notice moments of spontaneous stillness in waking life where the need to defend your ego dissolves.',
  },
  {
    name: 'The Trickster',
    epithet: 'The Subverter of Stagnation',
    icon: Sparkles,
    overview:
      'The chaotic catalyst who shatters ego-certainty, rules, and sanctimony. The Trickster humbles rigid plans to force unexpected transformation and evolutionary leaps.',
    dreamManifestations: [
      'Jesters, mischievous animals (coyotes, ravens, monkeys, shapeshifting cats).',
      'Sudden absurd reversals of gravity, comic mishaps, or inverted architectural laws.',
      'A figure mocking your seriousness.',
    ],
    jungianQuote: 'The trickster is a collective shadow figure, a summation of all the inferior traits of character in individuals.',
    integrationExercise: 'Where has your self-importance blinded you to an obvious truth?',
  },
  {
    name: 'The Senex / Wise Old One',
    epithet: 'The Voice of Ancestral Insight',
    icon: Flame,
    overview:
      'The embodiment of wisdom, discernment, tradition, and initiation. Appears when the dreamer is in a moral crossroads or profound spiritual transition.',
    dreamManifestations: [
      'An ancient hermit, a grandfather, a librarian, an alchemist, or an oracle in an observatory.',
      'Bestowing a crucial talisman (key, book, crystal, or cryptic riddle).',
    ],
    jungianQuote: 'The Wise Old Man appears in a situation where insight, understanding, good advice, determination, and foresight are needed.',
    integrationExercise: 'What counsel would your 80-year-old self give to your present dilemmas?',
  },
];

export const ArchetypeLexiconModal: React.FC<ArchetypeLexiconModalProps> = ({ isOpen, onClose }) => {
  const [selectedArchetype, setSelectedArchetype] = useState(ARCHETYPES_DATA[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold font-serif-dream text-slate-100">
                The Jungian Archetype Codex
              </h3>
              <p className="text-xs text-slate-400">
                Foundational primordial patterns of the collective unconscious
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Archetype List */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/50 p-3 overflow-y-auto space-y-1.5 shrink-0">
            {ARCHETYPES_DATA.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedArchetype.name === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedArchetype(item)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-100 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600/30 text-amber-300' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold font-serif-dream block">{item.name}</span>
                    <span className="text-[10px] text-slate-500 truncate block">{item.epithet}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Archetype Details Pane */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedArchetype.epithet}</span>
              </div>
              <h2 className="text-2xl font-bold font-serif-dream text-slate-100">
                {selectedArchetype.name}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedArchetype.overview}
            </p>

            {/* Manifestations in dreams */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                How It Appears in Dreams:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedArchetype.dreamManifestations.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">·</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Carl Jung quote */}
            <div className="border-l-2 border-amber-500/60 pl-4 py-1 italic text-xs text-slate-400">
              "{selectedArchetype.jungianQuote}"
              <span className="block not-italic text-[11px] text-amber-400/80 font-mono mt-1">
                — C.G. Jung
              </span>
            </div>

            {/* Integration inquiry */}
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-indigo-300 uppercase tracking-wider text-[11px]">
                Active Waking Integration:
              </span>
              <p className="text-slate-200">
                {selectedArchetype.integrationExercise}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
