import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Sparkles,
  Download,
  Trash2,
  BookOpen,
  Filter,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { DreamEntry } from '../types/dream';

interface DreamVaultProps {
  dreams: DreamEntry[];
  currentDreamId: string;
  onSelectDream: (dream: DreamEntry) => void;
  onNewDream: () => void;
  onDeleteDream: (id: string) => void;
}

export const DreamVault: React.FC<DreamVaultProps> = ({
  dreams,
  currentDreamId,
  onSelectDream,
  onNewDream,
  onDeleteDream,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  const filteredDreams = dreams.filter((dream) => {
    const matchesSearch =
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dream.interpretation?.coreTheme || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dream.interpretation?.recognizedArchetypes || []).some((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesMood = selectedMoodFilter === 'all' || dream.wakeMood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  const moods = ['all', ...Array.from(new Set(dreams.map((d) => d.wakeMood)))];

  const exportAllDreams = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dreams, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oneirica-dream-vault-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900/90 border border-indigo-950/70 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Subconscious Archive</span>
          </div>
          <h2 className="text-xl font-bold font-serif-dream text-slate-100">
            The Dream Vault
          </h2>
          <p className="text-xs text-slate-400">
            {dreams.length} recorded dreams with synthesized archetypes and artwork
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewDream}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Dream</span>
          </button>

          <button
            type="button"
            onClick={exportAllDreams}
            className="p-2 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Export Dream Vault (JSON)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dreams by keyword, symbol, archetype..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
          />
        </div>

        {/* Mood Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-500 font-medium shrink-0">Mood:</span>
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMoodFilter(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize shrink-0 transition-colors cursor-pointer ${
                selectedMoodFilter === m
                  ? 'bg-indigo-950 text-indigo-200 border border-indigo-500/50'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Dream Entries List */}
      <div className="space-y-3">
        {filteredDreams.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
            No dreams match your search filter.
          </div>
        ) : (
          filteredDreams.map((dream) => {
            const isSelected = dream.id === currentDreamId;
            return (
              <div
                key={dream.id}
                onClick={() => onSelectDream(dream)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500/60 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/90'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Miniature Image / Icon */}
                  {dream.image?.url ? (
                    <img
                      src={dream.image.url}
                      alt={dream.title}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <Sparkles className="w-5 h-5 opacity-40" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {dream.date}
                      </span>
                      <span>·</span>
                      <span className="text-amber-400/90 font-medium">{dream.wakeMood}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-indigo-400" />
                        Lucidity {dream.lucidity}/5
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-serif-dream text-slate-100 truncate">
                      {dream.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {dream.interpretation?.coreTheme || dream.transcript}
                    </p>

                    {/* Archetype tags */}
                    {dream.interpretation?.recognizedArchetypes && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {dream.interpretation.recognizedArchetypes.map((a, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] text-indigo-300/90 bg-indigo-950/60 border border-indigo-800/40 rounded px-1.5 py-0.5"
                          >
                            <Shield className="w-2.5 h-2.5 text-indigo-400" />
                            {a.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      isSelected
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Viewing' : 'Open'}
                  </span>

                  {dreams.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${dream.title}" from your journal?`)) {
                          onDeleteDream(dream.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Delete dream entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
