import React, { useState } from 'react';
import { Network, Cpu, Battery, Radio, RefreshCw } from 'lucide-react';

interface NodeStatus {
  id: string;
  name: string;
  x: number;
  y: number;
  battery: number;
  bufferOccupancy: number; // percentage
  status: 'optimal' | 'congested' | 'depleted';
}

export const NetworkBalanceSimulator: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<'routeA' | 'routeB'>('routeA');
  const [nodeCongestion, setNodeCongestion] = useState<boolean>(false);
  const [packetCount, setPacketCount] = useState<number>(1420);

  const handleInjectTraffic = () => {
    setPacketCount((p) => p + 50);
    // If route A is heavily congested, LARA algorithm switches to Route B automatically
    if (!nodeCongestion) {
      setNodeCongestion(true);
      setTimeout(() => {
        setActiveRoute('routeB');
      }, 600);
    } else {
      setNodeCongestion(false);
      setTimeout(() => {
        setActiveRoute('routeA');
      }, 600);
    }
  };

  const handleResetTopology = () => {
    setActiveRoute('routeA');
    setNodeCongestion(false);
    setPacketCount(1420);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h4 className="text-base font-semibold text-white">LARA Protocol Ad-hoc Routing Simulation</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zone-based energy & buffer load-aware dynamic multipath failover
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInjectTraffic}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-cyan-500/40 bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Inject Spike: {nodeCongestion ? 'Relieve Node #2' : 'Congest Node #2'}
          </button>
          <button
            onClick={handleResetTopology}
            className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg border border-slate-700"
            title="Reset topology"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Network Graph Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        <div className="lg:col-span-8 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center p-4 min-h-[280px]">
          <svg viewBox="0 0 500 240" className="w-full h-auto drop-shadow-md">
            <defs>
              <linearGradient id="activeLink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Links / Edges */}
            {/* Route A Path: Source (60, 120) -> Node A (220, 60) -> Dest (440, 120) */}
            <line
              x1="60"
              y1="120"
              x2="220"
              y2="60"
              stroke={activeRoute === 'routeA' ? '#06b6d4' : '#334155'}
              strokeWidth={activeRoute === 'routeA' ? '3' : '1.5'}
              strokeDasharray={activeRoute === 'routeA' ? '6 4' : 'none'}
              className={activeRoute === 'routeA' ? 'animate-[dash_1s_linear_infinite]' : ''}
            />
            <line
              x1="220"
              y1="60"
              x2="440"
              y2="120"
              stroke={activeRoute === 'routeA' ? '#06b6d4' : '#334155'}
              strokeWidth={activeRoute === 'routeA' ? '3' : '1.5'}
              strokeDasharray={activeRoute === 'routeA' ? '6 4' : 'none'}
            />

            {/* Route B Path: Source (60, 120) -> Node B (220, 180) -> Dest (440, 120) */}
            <line
              x1="60"
              y1="120"
              x2="220"
              y2="180"
              stroke={activeRoute === 'routeB' ? '#10b981' : '#334155'}
              strokeWidth={activeRoute === 'routeB' ? '3' : '1.5'}
              strokeDasharray={activeRoute === 'routeB' ? '6 4' : 'none'}
            />
            <line
              x1="220"
              y1="180"
              x2="440"
              y2="120"
              stroke={activeRoute === 'routeB' ? '#10b981' : '#334155'}
              strokeWidth={activeRoute === 'routeB' ? '3' : '1.5'}
              strokeDasharray={activeRoute === 'routeB' ? '6 4' : 'none'}
            />

            {/* Source Node */}
            <g transform="translate(60, 120)">
              <circle r="24" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                SRC
              </text>
              <text y="38" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                Client #1
              </text>
            </g>

            {/* Node A (Upper Route) */}
            <g transform="translate(220, 60)">
              <circle
                r="24"
                fill={nodeCongestion ? '#450a0a' : '#0f172a'}
                stroke={nodeCongestion ? '#ef4444' : '#06b6d4'}
                strokeWidth="2"
              />
              <text y="4" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                NODE A
              </text>
              <text
                y="38"
                textAnchor="middle"
                fill={nodeCongestion ? '#f87171' : '#94a3b8'}
                fontSize="9"
                fontFamily="monospace"
              >
                {nodeCongestion ? 'Buffer 94% (Full)' : 'Buffer 28%'}
              </text>
            </g>

            {/* Node B (Lower Alternate Route) */}
            <g transform="translate(220, 180)">
              <circle
                r="24"
                fill={activeRoute === 'routeB' ? '#064e3b' : '#0f172a'}
                stroke={activeRoute === 'routeB' ? '#10b981' : '#475569'}
                strokeWidth="2"
              />
              <text y="4" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                NODE B
              </text>
              <text y="38" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                Buffer 16% (Idle)
              </text>
            </g>

            {/* Destination Node */}
            <g transform="translate(440, 120)">
              <circle r="24" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                SINK
              </text>
              <text y="38" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                Gateway Node
              </text>
            </g>
          </svg>
        </div>

        {/* Real-time Protocol Telemetry */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Active Protocol State
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  {activeRoute === 'routeA' ? 'Primary Path (Node A)' : 'Dynamic Failover (Node B)'}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Cost Metric:{' '}
                <span className="font-mono text-cyan-300">
                  {activeRoute === 'routeA' ? '0.34 (Optimal)' : '0.22 (Rerouted via LARA)'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium block">Load-Aware Routing Algorithm (LARA)</span>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Evaluates queue length, transmission rate, and battery drain rate before dispatching datagrams.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Packet Delivery Ratio</span>
                  <span className="font-mono text-emerald-400 font-bold">98.2%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 mt-1.5">
                  <span>Simulated Packets</span>
                  <span className="font-mono text-cyan-300 font-bold">{packetCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Protocol: Ad-hoc LARA</span>
            <span>Energy Saved: +28%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
