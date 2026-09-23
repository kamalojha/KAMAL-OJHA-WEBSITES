import React from 'react';
import {
  Compass,
  Eye,
  Sparkles,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Shield,
  Sun,
  Flame,
  Key,
} from 'lucide-react';
import { PsychologicalInterpretation as InterpretationType, DreamSymbol } from '../types/dream';

interface PsychologicalInterpretationProps {
  interpretation: InterpretationType;
  onSelectSymbolForChat: (symbol: DreamSymbol) => void;
  onOpenArchetypeLexicon?: () => void;
}

export const PsychologicalInterpretation: React.FC<PsychologicalInterpretationProps> = ({
  interpretation,
  onSelectSymbolForChat,
  onOpenArchetypeLexicon,
}) => {
  return (
    <div className="space-y-8 bg-slate-900/90 border border-indigo-950/70 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Top Banner: Core Theme & Emotional Tone */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Analytical Psychology & Archetypal Evaluation</span>
          </div>

          {onOpenArchetypeLexicon && (
            <button
              type="button"
              onClick={onOpenArchetypeLexicon}
              className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-100 hover:underline cursor-pointer self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Archetype Codex</span>
            </button>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-serif-dream text-slate-100 leading-snug">
          {interpretation.coreTheme}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Emotional Frequency:</span>
          <span className="text-amber-300/90 italic">{interpretation.emotionalTone}</span>
        </div>
      </div>

      {/* Recognized Jungian Archetypes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h4 className="text-base font-bold font-serif-dream text-slate-200">
              Recognized Archetypes in the Psychic Narrative
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {interpretation.recognizedArchetypes.length} Manifestations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interpretation.recognizedArchetypes.map((arch, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/90 hover:border-indigo-500/40 rounded-xl p-5 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">
                    {arch.tagline}
                  </span>
                  <h5 className="text-base font-bold font-serif-dream text-slate-100 mt-0.5">
                    {arch.name}
                  </h5>
                </div>
                <div className="w-7 h-7 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-0.5">
                  Manifestation in Dream:
                </span>
                <p className="text-xs text-slate-300 italic">
                  "{arch.manifestationInDream}"
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-0.5">
                  Psychological Significance:
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {arch.psychologicalSignificance}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400/80 block mb-0.5">
                  Integration Inquiry:
                </span>
                <p className="text-xs text-amber-200/90 font-medium">
                  {arch.integrationInquiry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Dream Symbols with "Ask Oracle" Trigger */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h4 className="text-base font-bold font-serif-dream text-slate-200">
              Key Dream Symbols & Mythological Resonances
            </h4>
          </div>
          <span className="text-xs text-slate-500">Click any symbol to ask the Oracle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {interpretation.keySymbols.map((symbol) => (
            <div
              key={symbol.id}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold font-serif-dream text-amber-300">
                    {symbol.name}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                </div>

                <p className="text-xs text-slate-400 mb-2.5 leading-relaxed">
                  {symbol.archetypalMeaning}
                </p>

                <p className="text-[11px] text-slate-500 italic mb-3">
                  In dream: "{symbol.contextInDream}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectSymbolForChat(symbol)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-indigo-950 text-indigo-300 hover:text-indigo-100 border border-slate-800 hover:border-indigo-500/40 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Interrogate Symbol</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Jungian Synthesis & Unconscious Compensation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/50 border border-slate-800/90 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400">
            <Eye className="w-4 h-4" />
            <h5 className="text-sm font-bold font-serif-dream text-slate-200">
              Jungian Synthesis & Individuation Path
            </h5>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {interpretation.jungianSynthesis}
          </p>
        </div>

        <div className="bg-slate-950/50 border border-slate-800/90 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-purple-400">
            <Compass className="w-4 h-4" />
            <h5 className="text-sm font-bold font-serif-dream text-slate-200">
              Unconscious Compensation
            </h5>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {interpretation.unconsciousCompensation}
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Archetypal Function:
            </span>
            <p className="text-xs text-slate-400">
              The dream does not duplicate reality; it rebalances what waking ego-consciousness has ignored or suppressed.
            </p>
          </div>
        </div>
      </div>

      {/* Awakening Shadow Work Prompt */}
      <div className="bg-gradient-to-r from-purple-950/50 via-slate-950/70 to-indigo-950/50 border border-purple-500/30 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
          <Flame className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Awakening Shadow Work Inquiry
          </span>
          <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
            "{interpretation.shadowWorkPrompt}"
          </p>
        </div>
      </div>
    </div>
  );
};
