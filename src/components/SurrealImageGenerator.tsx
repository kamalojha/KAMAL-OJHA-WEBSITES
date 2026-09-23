import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  Palette,
  Image as ImageIcon,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ImageSize, AspectRatio, SurrealImage } from '../types/dream';
import { generateSurrealImage } from '../services/api';

interface SurrealImageGeneratorProps {
  image?: SurrealImage;
  coreTheme: string;
  suggestedPrompt: string;
  onImageUpdated: (newImage: SurrealImage) => void;
}

const SURREAL_STYLES = [
  { id: 'Daliesque Metaphysical', name: 'Dalí Melts & Infinite Deserts', desc: 'Melting clocks, impossible physics, vast arid horizons' },
  { id: 'Magritte Paradox', name: 'Magritte Subconscious Paradox', desc: 'Floating boulders, daytime clouds in midnight skies, bowler hats' },
  { id: 'De Chirico Arcades', name: 'De Chirico Twilight Shadows', desc: 'Deserted classical piazzas, ominous elongated shadows, trains' },
  { id: 'Remedios Varo Alchemy', name: 'Remedios Varo Occult Alchemy', desc: 'Spinning astrological gears, mystic looms, cloaked travelers' },
  { id: 'Ethereal Dreamcore', name: 'Liminal Dreamcore & Neon Mist', desc: 'Floating doorways, foggy stairways, surreal luminescence' },
];

const IMAGE_SIZES: { value: ImageSize; label: string; desc: string }[] = [
  { value: '1K', label: '1K Resolution', desc: 'Standard High Quality' },
  { value: '2K', label: '2K Resolution', desc: 'Fine Museum Print Detail' },
  { value: '4K', label: '4K Resolution', desc: 'Ultra-High Fidelity Canvas' },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string; iconRatio: string }[] = [
  { value: '1:1', label: 'Square (1:1)', iconRatio: 'w-4 h-4' },
  { value: '16:9', label: 'Cinematic (16:9)', iconRatio: 'w-6 h-3.5' },
  { value: '4:3', label: 'Classic (4:3)', iconRatio: 'w-5 h-4' },
  { value: '3:4', label: 'Portrait (3:4)', iconRatio: 'w-3.5 h-5' },
  { value: '9:16', label: 'Vertical (9:16)', iconRatio: 'w-3 h-5' },
];

export const SurrealImageGenerator: React.FC<SurrealImageGeneratorProps> = ({
  image,
  coreTheme,
  suggestedPrompt,
  onImageUpdated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ImageSize>(image?.imageSize || '2K');
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>(image?.aspectRatio || '1:1');
  const [selectedStyle, setSelectedStyle] = useState<string>(image?.style || 'Daliesque Metaphysical');
  const [customPrompt, setCustomPrompt] = useState<string>(image?.prompt || suggestedPrompt);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setQuotaNotice(null);
    try {
      const result = await generateSurrealImage(
        customPrompt || suggestedPrompt,
        coreTheme,
        selectedSize,
        selectedAspect,
        selectedStyle,
      );
      onImageUpdated(result.image);
      if (result.notice) {
        setQuotaNotice(result.notice);
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!image?.url) return;
    const a = document.createElement('a');
    a.href = image.url;
    a.download = `oneirica-dream-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-900/90 border border-indigo-950/70 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header bar */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Surrealist Dream Manifestation</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif-dream text-slate-100">
            Oneiric Artwork · Model: gemini-3-pro-image-preview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Core theme translation: <span className="text-slate-200 italic">"{coreTheme}"</span>
          </p>
        </div>

        {/* Toggle parameter drawer */}
        <button
          type="button"
          onClick={() => setShowPromptEditor(!showPromptEditor)}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>{showPromptEditor ? 'Hide Manifestation Studio' : 'Configure Canvas & Resolution'}</span>
        </button>
      </div>

      {/* Configuration Drawer */}
      {showPromptEditor && (
        <div className="p-5 sm:p-6 bg-slate-950/70 border-b border-slate-800/80 space-y-5 animate-in fade-in duration-200">
          {/* Image Size Selection (1K, 2K, 4K) as required */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Gemini Image Resolution (Required Affordance: 1K / 2K / 4K):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {IMAGE_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setSelectedSize(size.value)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSize === size.value
                      ? 'bg-indigo-950/70 border-indigo-400/80 text-indigo-100 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-slate-200">{size.label}</span>
                    {selectedSize === size.value && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">{size.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Canvas Aspect Ratio:
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((aspect) => (
                <button
                  key={aspect.value}
                  type="button"
                  onClick={() => setSelectedAspect(aspect.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    selectedAspect === aspect.value
                      ? 'bg-indigo-950/70 border-indigo-400/80 text-indigo-100 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`border border-current rounded-sm ${aspect.iconRatio}`} />
                  <span>{aspect.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Surrealist Movement Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Surrealist Movement Aesthetic:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SURREAL_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedStyle === style.id
                      ? 'bg-indigo-950/70 border-indigo-400/80 text-indigo-100 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200">{style.name}</div>
                  <div className="text-[11px] text-slate-500">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Tweak */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Surreal Imagery Prompt:
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Trigger regenerate */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-semibold rounded-lg text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing with gemini-3-pro-image-preview...' : 'Generate with Selected Resolution'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Image Frame */}
      <div className="p-4 sm:p-6 flex flex-col items-center">
        {image?.url ? (
          <div className="relative group w-full max-w-2xl rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
            <img
              src={image.url}
              alt="Surrealist dream depiction"
              className={`w-full object-cover transition-transform duration-500 ${
                isExpanded ? 'max-h-[85vh] object-contain' : 'max-h-[540px]'
              }`}
            />

            {/* Overlay buttons on hover */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/70 backdrop-blur-md p-1.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Shrink' : 'Expand full canvas'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Download dream artwork"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom info banner */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-amber-400 font-semibold">{image.imageSize}</span>
                <span>·</span>
                <span>{image.aspectRatio}</span>
                <span>·</span>
                <span className="text-indigo-300">{image.style}</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Created with <strong className="text-slate-400">gemini-3-pro-image-preview</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-72 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-950/40">
            <ImageIcon className="w-10 h-10 mb-2 text-indigo-400/40" />
            <p className="text-sm font-medium text-slate-300">Ready to materialize surreal dream canvas</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Translates the unconscious emotional arc into metaphysical imagery using Google Gemini.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGenerating ? 'Synthesizing 2K Surreal Canvas...' : 'Generate Surrealist Artwork'}</span>
            </button>
          </div>
        )}

        {quotaNotice && (
          <div className="mt-3 w-full max-w-2xl p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-300/90 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p>{quotaNotice}</p>
              <p className="text-[11px] text-amber-400/70 mt-0.5">
                Meanwhile, Oneirica generated a high-fidelity atmospheric surreal canvas representing your dream motifs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
