import React, { useState } from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q7RuleOrderVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Allow manual interactive toggling of rule order
  const [isSwapped, setIsSwapped] = useState(false);

  // In the step sequence:
  // Steps 0-3 represent the DEFAULT order (Rule 1 ALLOW on top -> packet is ALLOWED)
  // Steps 4-7 represent the SWAPPED order (Rule 2 DENY on top -> packet is DENIED)
  const isSecondPhase = currentStepIndex >= 4 || isSwapped;
  const isDenied = isSecondPhase;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Interactive Switcher Bar at top */}
      <div className="flex items-center justify-between px-6 py-2 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">RULE ORDER EXPERIMENT:</span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            isDenied ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          }`}>
            {isDenied ? 'Order B: DENY ANY First → Result: BLOCKED' : 'Order A: ALLOW 10.0.0.0/24 First → Result: PERMITTED'}
          </span>
        </div>

        <button
          onClick={() => setIsSwapped(!isSwapped)}
          className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 shadow-2xs cursor-pointer transition-all"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-blue-600" />
          <span>{isSwapped ? 'Reset Order (Allow First)' : 'Swap Rule Order (Deny First)'}</span>
        </button>
      </div>

      <svg viewBox="0 0 760 300" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
        {/* Network Baseline Line */}
        <line x1="90" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="4 4" />

        {/* Traffic Flow Arrow (Only on step >= 1 or if swapped) */}
        {(currentStepIndex >= 1 || isSwapped) && (
          <BoldArrow x1={130} y1={75} x2={330} y2={75} color="#2563eb" label="10.0.0.25 :443" />
        )}

        {(currentStepIndex >= 1 || isSwapped) && (
          !isDenied ? (
            <BoldArrow x1={410} y1={75} x2={610} y2={75} color="#10b981" label="ALLOWED ✓" />
          ) : (
            <g transform="translate(370, 75)">
              <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <rect x="55" y="-12" width="90" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="100" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                DENY ✕
              </text>
            </g>
          )
        )}

        {/* Nodes */}
        <LaptopNode cx={90} cy={75} label="CLIENT" ip="10.0.0.25" active />
        <FirewallGatewayNode cx={370} cy={75} label="FIREWALL" sub="Order Evaluator" active success={(currentStepIndex >= 1 || isSwapped) && !isDenied} danger={(currentStepIndex >= 1 || isSwapped) && isDenied} />
        <ServerNodeSVG cx={650} cy={75} label="SERVER" sub="203.0.113.50:443" active success={(currentStepIndex >= 1 || isSwapped) && !isDenied} danger={(currentStepIndex >= 1 || isSwapped) && isDenied} />

        {/* Packet Card (Only on step >= 1 or if swapped) */}
        {(currentStepIndex >= 1 || isSwapped) && (
          <PacketCard
            cx={!isDenied ? 640 : 370}
            cy={34}
            title="PACKET"
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="SERVER"
            status={!isDenied ? 'ALLOW' : 'DENY'}
            scale={0.8}
          />
        )}

        {/* Live Reorderable Rule Table */}
        <g transform="translate(40, 140)">
          <rect x="0" y="0" width="680" height="145" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="680" height="26" rx="9" fill="#0f172a" />
          <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
            ACTIVE FIREWALL ACCESS LIST (FIRST-MATCH WINS)
          </text>
          <text x="490" y="17" fill="#38bdf8" fontSize="8.5" fontWeight="bold">
            {isDenied ? '⚡ Shadowing Bug in Effect' : '✓ Correct Specific-to-Broad Order'}
          </text>

          {/* Top Rule Position 1 */}
          <g transform="translate(16, 36)">
            <rect
              x="0"
              y="0"
              width="648"
              height="34"
              rx="6"
              fill={!isDenied ? '#ecfdf5' : '#fef2f2'}
              stroke={!isDenied ? '#10b981' : '#ef4444'}
              strokeWidth={2}
            />
            <text x="12" y="21" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">
              #1
            </text>
            <text x="45" y="21" fill={!isDenied ? '#059669' : '#dc2626'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              {!isDenied ? 'ALLOW' : 'DENY'}
            </text>
            <text x="120" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              {!isDenied ? '10.0.0.0/24' : 'ANY'}
            </text>
            <text x="240" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              203.0.113.50:443
            </text>
            <text x="380" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              TCP
            </text>
            <text x="470" y="21" fill={!isDenied ? '#059669' : '#dc2626'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              {!isDenied ? 'FIRST MATCH: ALLOW ✓' : 'FIRST MATCH: DENY ✕'}
            </text>
          </g>

          {/* Bottom Rule Position 2 (Shadowed / Skipped) */}
          <g transform="translate(16, 78)">
            <rect x="0" y="0" width="648" height="30" rx="4" fill="#f8fafc" stroke="#e2e8f0" opacity={0.6} />
            <text x="12" y="19" fill="#94a3b8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              #2
            </text>
            <text x="45" y="19" fill="#94a3b8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              {!isDenied ? 'DENY' : 'ALLOW'}
            </text>
            <text x="120" y="19" fill="#94a3b8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              {!isDenied ? 'ANY' : '10.0.0.0/24'}
            </text>
            <text x="240" y="19" fill="#94a3b8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              203.0.113.50:443
            </text>
            <text x="380" y="19" fill="#94a3b8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              TCP
            </text>
            <text x="470" y="19" fill="#94a3b8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              {isDenied ? '⚠️ SHADOWED (Never Reached!)' : 'SKIPPED (First Match Met)'}
            </text>
          </g>

          {/* Educational Formula Footer */}
          <g transform="translate(16, 118)">
            <text x="0" y="14" fill="#334155" fontSize="9" fontWeight="bold" fontFamily="monospace">
              TAKEAWAY: SAME PACKET (10.0.0.25) + DIFFERENT RULE ORDER = COMPLETELY OPPOSITE DECISION!
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
