import React, { useState } from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';
import { Play, RotateCcw } from 'lucide-react';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q10ScenarioChallengeVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeCheckRule, setActiveCheckRule] = useState<number | null>(null);

  const scenarios = [
    {
      name: 'Scenario A: Web Browsing',
      src: '10.0.0.45',
      dst: '203.0.113.50',
      port: 443,
      proto: 'TCP',
      matchRule: 1,
      decision: 'ALLOW',
      reason: 'Matches Rule #1 (ALLOW 10.0.0.0/24 -> 443)',
    },
    {
      name: 'Scenario B: Database Query',
      src: '10.0.0.45',
      dst: '203.0.113.50',
      port: 3306,
      proto: 'TCP',
      matchRule: 2,
      decision: 'DENY',
      reason: 'Matches Rule #2 (DENY ANY -> MySQL 3306)',
    },
    {
      name: 'Scenario C: DNS Request',
      src: '10.0.0.45',
      dst: '8.8.8.8',
      port: 53,
      proto: 'UDP',
      matchRule: 3,
      decision: 'ALLOW',
      reason: 'Matches Rule #3 (ALLOW ANY -> DNS 53)',
    },
    {
      name: 'Scenario D: SSH Access',
      src: '192.168.1.99',
      dst: '203.0.113.50',
      port: 22,
      proto: 'TCP',
      matchRule: 4,
      decision: 'DENY',
      reason: 'No rule matches -> Default Implicit Deny drops packet',
    },
  ];

  const activeScenario = scenarios[selectedScenarioIndex];

  const handleSimulate = () => {
    setIsSimulating(true);
    setActiveCheckRule(0);

    setTimeout(() => {
      if (activeScenario.matchRule > 0) {
        setActiveCheckRule(activeScenario.matchRule - 1);
      } else {
        setActiveCheckRule(3); // implicit
      }
    }, 600);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setActiveCheckRule(null);
  };

  const isStepActive = isSimulating || currentStepIndex >= 1;
  const isDelivered = isStepActive && activeScenario.decision === 'ALLOW';
  const isDropped = isStepActive && activeScenario.decision === 'DENY';

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Top Scenario Selector & Simulation Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">SELECT PACKET:</span>
          {scenarios.map((sc, idx) => (
            <button
              key={sc.name}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                handleReset();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedScenarioIndex === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {sc.name.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>SIMULATE EVALUATION</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-700 shadow-2xs cursor-pointer"
            title="Reset simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <svg viewBox="0 0 760 280" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
        {/* Network Baseline Line */}
        <line x1="90" y1="65" x2="650" y2="65" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="4 4" />

        {/* Dynamic Arrow (Only when simulating or step >= 1) */}
        {isStepActive && (
          <BoldArrow x1={130} y1={65} x2={330} y2={65} color="#2563eb" label={`${activeScenario.proto} :${activeScenario.port}`} />
        )}
        {isDelivered && (
          <BoldArrow x1={410} y1={65} x2={610} y2={65} color="#10b981" label="PERMITTED ✓" />
        )}
        {isDropped && (
          <g transform="translate(370, 65)">
            <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <rect x="55" y="-12" width="90" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
            <text x="100" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              BLOCKED ✕
            </text>
          </g>
        )}

        {/* Nodes */}
        <LaptopNode cx={90} cy={65} label="HOST" ip={activeScenario.src} active={isStepActive} />
        <FirewallGatewayNode cx={370} cy={65} label="FIREWALL" sub="Rule Evaluator" active={isStepActive} success={isDelivered} danger={isDropped} />
        <ServerNodeSVG cx={650} cy={65} label="DESTINATION" sub={`${activeScenario.dst}:${activeScenario.port}`} active={isStepActive} success={isDelivered} danger={isDropped} />

        {/* Packet Card (Only when simulating or step >= 1) */}
        {isStepActive && (
          <PacketCard
            cx={isDelivered ? 640 : isDropped ? 370 : 230}
            cy={28}
            title="TEST PACKET"
            protocol={activeScenario.proto}
            port={activeScenario.port}
            src={activeScenario.src}
            dst={activeScenario.dst}
            status={isDelivered ? 'ALLOW' : isDropped ? 'DENY' : 'NORMAL'}
            scale={0.78}
          />
        )}

        {/* Challenge Rule Table */}
        <g transform="translate(30, 115)">
          <rect x="0" y="0" width="700" height="155" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="24" rx="9" fill="#0f172a" />
          <text x="16" y="16" fill="#ffffff" fontSize="9.5" fontWeight="bold">
            FIREWALL RULEBASE (4-TUPLE MATCH ENGINE)
          </text>
          {isSimulating && (
            <text x="440" y="16" fill={isDelivered ? '#4ade80' : '#f87171'} fontSize="9" fontWeight="bold">
              VERDICT: {activeScenario.reason}
            </text>
          )}

          {/* Rule 1: HTTPS */}
          <g transform="translate(16, 32)">
            <rect
              x="0"
              y="0"
              width="668"
              height="25"
              rx="4"
              fill={activeCheckRule === 0 ? (activeScenario.matchRule === 1 ? '#ecfdf5' : '#fef2f2') : '#f8fafc'}
              stroke={activeCheckRule === 0 ? (activeScenario.matchRule === 1 ? '#10b981' : '#fca5a5') : '#e2e8f0'}
            />
            <text x="12" y="17" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">#1</text>
            <text x="45" y="17" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>
            <text x="120" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">10.0.0.0/24</text>
            <text x="240" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="360" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">TCP:443</text>
            <text x="480" y="17" fill={activeCheckRule === 0 ? (activeScenario.matchRule === 1 ? '#059669' : '#dc2626') : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {activeCheckRule === 0 ? (activeScenario.matchRule === 1 ? '✓ MATCH: ALLOW' : '✕ NO MATCH') : 'PENDING'}
            </text>
          </g>

          {/* Rule 2: MySQL DENY */}
          <g transform="translate(16, 60)">
            <rect
              x="0"
              y="0"
              width="668"
              height="25"
              rx="4"
              fill={activeCheckRule === 1 ? (activeScenario.matchRule === 2 ? '#fef2f2' : '#f8fafc') : '#f8fafc'}
              stroke={activeCheckRule === 1 ? (activeScenario.matchRule === 2 ? '#ef4444' : '#e2e8f0') : '#e2e8f0'}
            />
            <text x="12" y="17" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">#2</text>
            <text x="45" y="17" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">DENY</text>
            <text x="120" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="240" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="360" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">TCP:3306</text>
            <text x="480" y="17" fill={activeCheckRule === 1 ? (activeScenario.matchRule === 2 ? '#dc2626' : '#94a3b8') : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {activeCheckRule === 1 ? (activeScenario.matchRule === 2 ? '✕ MATCH: DENIED' : '✕ NO MATCH') : 'PENDING'}
            </text>
          </g>

          {/* Rule 3: DNS ALLOW */}
          <g transform="translate(16, 88)">
            <rect
              x="0"
              y="0"
              width="668"
              height="25"
              rx="4"
              fill={activeCheckRule === 2 ? (activeScenario.matchRule === 3 ? '#ecfdf5' : '#f8fafc') : '#f8fafc'}
              stroke={activeCheckRule === 2 ? (activeScenario.matchRule === 3 ? '#10b981' : '#e2e8f0') : '#e2e8f0'}
            />
            <text x="12" y="17" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">#3</text>
            <text x="45" y="17" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>
            <text x="120" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="240" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">8.8.8.8</text>
            <text x="360" y="17" fill="#0f172a" fontSize="8" fontFamily="monospace">UDP:53</text>
            <text x="480" y="17" fill={activeCheckRule === 2 ? (activeScenario.matchRule === 3 ? '#059669' : '#dc2626') : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {activeCheckRule === 2 ? (activeScenario.matchRule === 3 ? '✓ MATCH: ALLOW' : '✕ NO MATCH') : 'PENDING'}
            </text>
          </g>

          {/* Rule 4: IMPLICIT DENY */}
          <g transform="translate(16, 116)">
            <rect
              x="0"
              y="0"
              width="668"
              height="25"
              rx="4"
              fill={activeCheckRule === 3 ? '#fef2f2' : '#f8fafc'}
              stroke={activeCheckRule === 3 ? '#ef4444' : '#e2e8f0'}
            />
            <text x="12" y="17" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">DEF</text>
            <text x="45" y="17" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">DENY</text>
            <text x="120" y="17" fill="#dc2626" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="240" y="17" fill="#dc2626" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="360" y="17" fill="#dc2626" fontSize="8" fontFamily="monospace">ANY</text>
            <text x="480" y="17" fill={activeCheckRule === 3 ? '#dc2626' : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {activeCheckRule === 3 ? '✕ DEFAULT IMPLICIT DENY TRIGGERED' : 'FALLTHROUGH'}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
