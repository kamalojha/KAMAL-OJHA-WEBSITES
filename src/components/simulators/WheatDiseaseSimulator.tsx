import React, { useState } from 'react';
import { Sprout, ShieldCheck, AlertTriangle, Crosshair } from 'lucide-react';

interface LeafSample {
  id: string;
  name: string;
  condition: string;
  severity: 'None' | 'Moderate' | 'Critical';
  confidence: number;
  symptoms: string;
  agronomicAction: string;
  lesionCount: number;
}

const LEAF_SAMPLES: LeafSample[] = [
  {
    id: 'wheat_healthy',
    name: 'Sample #A1 — Healthy Foliage',
    condition: 'Triticum aestivum (Healthy)',
    severity: 'None',
    confidence: 98.6,
    symptoms: 'Uniform dark green pigmentation, robust cuticle layer, no fungal pustules or necrosis detected.',
    agronomicAction: 'Standard nitrogen nutrient monitoring. No fungicide required.',
    lesionCount: 0,
  },
  {
    id: 'wheat_rust',
    name: 'Sample #B4 — Stripe Rust (Yellow Rust)',
    condition: 'Puccinia striiformis f. sp. tritici',
    severity: 'Critical',
    confidence: 95.8,
    symptoms: 'Linear yellow-orange uredinial pustules arranged in parallel stripes along leaf veins.',
    agronomicAction: 'Immediate triazole-based systemic fungicide application; quarantine infected field quadrant.',
    lesionCount: 14,
  },
  {
    id: 'wheat_septoria',
    name: 'Sample #C7 — Septoria Leaf Blotch',
    condition: 'Zymoseptoria tritici',
    severity: 'Moderate',
    confidence: 92.4,
    symptoms: 'Irregular brown necrotic lesions containing minute black fungal pycnidia fruiting bodies.',
    agronomicAction: 'Apply foliar strobilurin/SDHI treatment within 72 hours to prevent canopy spread.',
    lesionCount: 8,
  },
];

export const WheatDiseaseSimulator: React.FC = () => {
  const [selected, setSelected] = useState<LeafSample>(LEAF_SAMPLES[1]);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-amber-400" />
            <h4 className="text-base font-semibold text-white">Crop Vision Diagnostic Inspector</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time foliar pathology identification with OpenCV & CNN inference
          </p>
        </div>

        <button
          onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
            showBoundingBoxes
              ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          Lesion Bounding Boxes: {showBoundingBoxes ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Sample Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        {LEAF_SAMPLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              selected.id === s.id
                ? 'bg-amber-950/40 border-amber-500/60 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-xs font-medium text-slate-200 truncate">{s.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
              <span>{s.severity === 'None' ? 'Healthy' : s.severity}</span>
              <span className="font-mono text-slate-300">{s.confidence}%</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Leaf Inspection Stage */}
        <div className="lg:col-span-7 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center p-4 min-h-[280px]">
          <svg viewBox="0 0 400 240" className="w-full max-w-[360px] h-auto drop-shadow-md">
            <defs>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#14532d" />
                <stop offset="50%" stop-color="#166534" />
                <stop offset="100%" stop-color="#15803d" />
              </linearGradient>
            </defs>

            {/* Field backdrop grid */}
            <rect width="400" height="240" fill="#050a06" rx="8" />

            {/* Central Wheat Blade Path */}
            <path
              d="M 30 180 C 100 150, 200 110, 370 70 C 320 120, 220 180, 70 210 Z"
              fill="url(#leafGrad)"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
            {/* Central Leaf Vein */}
            <path d="M 45 195 Q 200 135 365 72" stroke="#4ade80" strokeWidth="2" fill="none" opacity="0.7" />

            {/* Fungal Pathologies */}
            {selected.id === 'wheat_rust' && (
              <g>
                {/* Yellow Rust Stripes */}
                <path d="M 120 165 L 180 145" stroke="#f59e0b" strokeWidth="4" strokeDasharray="3 3" />
                <path d="M 140 158 L 220 132" stroke="#eab308" strokeWidth="5" strokeDasharray="4 2" />
                <path d="M 210 132 L 280 110" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="3 3" />
                <path d="M 240 122 L 310 98" stroke="#d97706" strokeWidth="4" strokeDasharray="4 2" />

                {/* Bounding Boxes */}
                {showBoundingBoxes && (
                  <g stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245, 158, 11, 0.15)">
                    <rect x="130" y="140" width="70" height="35" rx="3" />
                    <text x="132" y="136" fill="#fef08a" fontSize="10" fontFamily="monospace">
                      Rust: 0.96
                    </text>

                    <rect x="225" y="105" width="85" height="32" rx="3" />
                    <text x="227" y="101" fill="#fef08a" fontSize="10" fontFamily="monospace">
                      Rust: 0.94
                    </text>
                  </g>
                )}
              </g>
            )}

            {selected.id === 'wheat_septoria' && (
              <g>
                {/* Septoria Necrotic Lesions */}
                <ellipse cx="160" cy="160" rx="18" ry="9" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                <circle cx="158" cy="160" r="1.5" fill="#000000" />
                <circle cx="163" cy="158" r="1.5" fill="#000000" />

                <ellipse cx="260" cy="120" rx="22" ry="11" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                <circle cx="255" cy="118" r="1.5" fill="#000000" />
                <circle cx="264" cy="122" r="1.5" fill="#000000" />

                {showBoundingBoxes && (
                  <g stroke="#ef4444" strokeWidth="1.5" fill="rgba(239, 68, 68, 0.15)">
                    <rect x="135" y="145" width="50" height="30" rx="3" />
                    <text x="137" y="141" fill="#fca5a5" fontSize="10" fontFamily="monospace">
                      Septoria: 0.92
                    </text>

                    <rect x="232" y="102" width="60" height="36" rx="3" />
                    <text x="234" y="98" fill="#fca5a5" fontSize="10" fontFamily="monospace">
                      Septoria: 0.93
                    </text>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Inference Report */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Foliar Disease Classification
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  {selected.severity === 'None' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  {selected.condition}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {selected.confidence}%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium block">Pathology Markers</span>
                <p className="text-slate-300 mt-1 leading-relaxed">{selected.symptoms}</p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <span className="text-amber-400/90 font-medium block">Actionable Agronomic Protocol</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{selected.agronomicAction}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Color Space: HSV & LAB</span>
            <span>Lesions Detected: {selected.lesionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
