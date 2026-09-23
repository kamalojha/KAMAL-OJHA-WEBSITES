import React, { useState } from 'react';
import { Activity, Eye, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

interface XRaySample {
  id: string;
  name: string;
  type: 'Normal' | 'Bacterial Pneumonia' | 'Viral Pneumonia';
  actualStatus: string;
  confidence: number;
  findings: string;
  camHighlights: string;
  patientData: string;
}

const SAMPLES: XRaySample[] = [
  {
    id: 'sample_normal',
    name: 'Patient #408 — Bilateral Clear',
    type: 'Normal',
    actualStatus: 'Negative / Clear Lungs',
    confidence: 97.4,
    findings: 'No focal consolidation, pneumothorax, or pleural effusion. Diaphragmatic contours are sharp.',
    camHighlights: 'Low activation across all pulmonary zones. Sharp costophrenic angles.',
    patientData: '24y, Routine Pre-Employment Screening',
  },
  {
    id: 'sample_bacterial',
    name: 'Patient #912 — Right Lobar Opacity',
    type: 'Bacterial Pneumonia',
    actualStatus: 'Positive / High Risk Bacterial',
    confidence: 96.2,
    findings: 'Dense focal consolidation in right lower lobe consistent with lobar bacterial infection.',
    camHighlights: 'Intense Grad-CAM gradient concentrated in right lower retrocardiac zone.',
    patientData: '58y, High Fever, Productive Cough, Dyspnea',
  },
  {
    id: 'sample_viral',
    name: 'Patient #234 — Interstitial Infiltrate',
    type: 'Viral Pneumonia',
    actualStatus: 'Positive / Viral Pattern',
    confidence: 91.8,
    findings: 'Diffuse reticular interstitial opacities with bilateral peripheral ground-glass appearance.',
    camHighlights: 'Bilateral mid-to-lower peripheral mantle activations detected.',
    patientData: '33y, Dry Cough, Low Grade Fever, Fatigue',
  },
];

export const XRaySimulator: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<XRaySample>(SAMPLES[1]);
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [isInferencing, setIsInferencing] = useState<boolean>(false);

  const handleSelectSample = (sample: XRaySample) => {
    setIsInferencing(true);
    setSelectedSample(sample);
    setTimeout(() => {
      setIsInferencing(false);
    }, 300);
  };

  const isPositive = selectedSample.type !== 'Normal';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h4 className="text-base font-semibold text-white">Interactive CNN Diagnostic Lab</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the fine-tuned ResNet-50 / Keras model with Grad-CAM explainability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGradCam(!showGradCam)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              showGradCam
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Grad-CAM Heatmap: {showGradCam ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Sample Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelectSample(s)}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              selectedSample.id === s.id
                ? 'bg-blue-950/40 border-blue-500/60 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-xs font-medium text-slate-200 truncate">{s.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
              <span>{s.type}</span>
              <span className="font-mono text-slate-300">{s.confidence}%</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Simulated Chest Radiograph Monitor */}
        <div className="lg:col-span-7 bg-black rounded-lg border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-4 min-h-[300px]">
          {isInferencing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Running CNN inference pass...</span>
            </div>
          ) : (
            <div className="relative w-full max-w-[280px] aspect-[4/5] mx-auto flex items-center justify-center">
              {/* Radiograph SVG Vector Artwork */}
              <svg viewBox="0 0 280 350" className="w-full h-full drop-shadow-md">
                <defs>
                  <radialGradient id="lungField" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stop-color="#141c2b" />
                    <stop offset="60%" stop-color="#0a0e17" />
                    <stop offset="100%" stop-color="#020408" />
                  </radialGradient>
                  <filter id="gradCamGlow">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feColorMatrix
                      type="matrix"
                      values="1 0 0 0 0.9  0 0.3 0 0 0.1  0 0 0.2 0 0  0 0 0 0.8 0"
                    />
                  </filter>
                </defs>

                {/* Thoracic ribcage and spine */}
                <rect width="280" height="350" fill="url(#lungField)" rx="8" />

                {/* Spinal Column */}
                <path d="M 140 20 L 140 330" stroke="#334155" strokeWidth="12" strokeDasharray="8 4" opacity="0.6" />

                {/* Left & Right Clavicles */}
                <path d="M 60 55 Q 140 70 140 85" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M 220 55 Q 140 70 140 85" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />

                {/* Left Ribs */}
                <path d="M 135 110 Q 70 120 50 160" stroke="#334155" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 135 140 Q 65 155 45 200" stroke="#334155" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 135 175 Q 60 195 45 240" stroke="#334155" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 135 210 Q 60 235 50 280" stroke="#334155" strokeWidth="4" fill="none" opacity="0.4" />

                {/* Right Ribs */}
                <path d="M 145 110 Q 210 120 230 160" stroke="#334155" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 145 140 Q 215 155 235 200" stroke="#334155" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 145 175 Q 220 195 235 240" stroke="#334155" strokeWidth="4" fill="none" opacity="0.5" />
                <path d="M 145 210 Q 220 235 230 280" stroke="#334155" strokeWidth="4" fill="none" opacity="0.4" />

                {/* Cardiac Silhouette (Heart) */}
                <path d="M 125 150 C 120 180, 100 230, 150 245 C 175 250, 160 190, 145 150 Z" fill="#1e293b" opacity="0.85" />

                {/* Diaphragmatic Domes */}
                <path d="M 30 290 Q 80 260 135 285" stroke="#475569" strokeWidth="4" fill="none" opacity="0.6" />
                <path d="M 145 285 Q 200 255 250 290" stroke="#475569" strokeWidth="4" fill="none" opacity="0.6" />

                {/* Pathology & Grad-CAM Overlays */}
                {selectedSample.type === 'Bacterial Pneumonia' && (
                  <g>
                    {/* Natural consolidation opacity */}
                    <ellipse cx="190" cy="225" rx="35" ry="25" fill="#94a3b8" opacity="0.4" />
                    <ellipse cx="205" cy="235" rx="20" ry="16" fill="#cbd5e1" opacity="0.45" />

                    {/* Grad-CAM Heatmap Overlay */}
                    {showGradCam && (
                      <g>
                        <ellipse cx="195" cy="225" rx="42" ry="32" fill="#ef4444" opacity="0.4" filter="url(#gradCamGlow)" />
                        <ellipse cx="195" cy="225" rx="24" ry="18" fill="#f59e0b" opacity="0.6" />
                        <circle cx="195" cy="225" r="10" fill="#fef08a" opacity="0.8" />
                      </g>
                    )}
                  </g>
                )}

                {selectedSample.type === 'Viral Pneumonia' && (
                  <g>
                    {/* Diffuse infiltrates */}
                    <path d="M 60 160 Q 90 200 70 240" stroke="#94a3b8" strokeWidth="14" opacity="0.25" strokeLinecap="round" />
                    <path d="M 210 160 Q 185 200 215 240" stroke="#94a3b8" strokeWidth="14" opacity="0.25" strokeLinecap="round" />

                    {/* Grad-CAM Heatmap Overlay */}
                    {showGradCam && (
                      <g>
                        <ellipse cx="75" cy="205" rx="30" ry="40" fill="#f97316" opacity="0.45" filter="url(#gradCamGlow)" />
                        <ellipse cx="205" cy="205" rx="30" ry="40" fill="#f97316" opacity="0.45" filter="url(#gradCamGlow)" />
                        <circle cx="75" cy="205" r="12" fill="#fef08a" opacity="0.7" />
                        <circle cx="205" cy="205" r="12" fill="#fef08a" opacity="0.7" />
                      </g>
                    )}
                  </g>
                )}
              </svg>

              {/* Viewport markers */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400">
                L-AP POSTERIOR
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400">
                CALIBRATED 224x224
              </div>
            </div>
          )}
        </div>

        {/* Telemetry & Model Inference Report */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Model Classification Output
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base font-semibold text-white flex items-center gap-1.5">
                  {isPositive ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                  {selectedSample.actualStatus}
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    isPositive ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedSample.confidence}% Conf.
                </span>
              </div>

              {/* Confidence Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedSample.confidence}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium block">Clinical Radiologist Notes</span>
                <p className="text-slate-300 mt-1 leading-relaxed">{selectedSample.findings}</p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium block">Saliency & Heatmap Localization</span>
                <p className="text-blue-300 mt-1 leading-relaxed">{selectedSample.camHighlights}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Backbone: ResNet50-ImageNet</span>
            <span>AUC-ROC: 0.978</span>
          </div>
        </div>
      </div>
    </div>
  );
};
