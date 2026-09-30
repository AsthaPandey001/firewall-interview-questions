import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q8MultipleMatchVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Packet arrives (10.0.0.25 -> Server:443 TCP). Matches Rule 1, Rule 2, and Rule 3!
  // Step 1: Rule 1 evaluated -> MATCH FOUND!
  // Step 2: Immediate evaluation STOP (First Match Principle)
  // Step 3: Action ALLOW executed -> Packet delivered to Server
  // Step 4: Rule 2 and Rule 3 visually faded out & never executed

  const isMatchedRule1 = currentStepIndex >= 1;
  const isStopped = currentStepIndex >= 2;
  const isDelivered = currentStepIndex >= 3;
  const isFaded = currentStepIndex >= 3;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="90" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="4 4" />

      {/* Connection Arrows (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <BoldArrow x1={130} y1={75} x2={330} y2={75} color="#2563eb" label="10.0.0.25 :443" />
      )}
      {isDelivered && (
        <BoldArrow x1={410} y1={75} x2={610} y2={75} color="#10b981" label="FORWARDED ✓" />
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={75} label="CLIENT" ip="10.0.0.25" active />
      <FirewallGatewayNode cx={370} cy={75} label="FIREWALL" sub="First Match Engine" active={currentStepIndex >= 1} success={isMatchedRule1} />
      <ServerNodeSVG cx={650} cy={75} label="SERVER" sub="203.0.113.50:443" active success={isDelivered} />

      {/* Packet Card (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={isDelivered ? 640 : 370}
          cy={34}
          title="PACKET"
          protocol="TCP"
          port="443"
          src="10.0.0.25"
          dst="SERVER"
          status={isMatchedRule1 ? 'ALLOW' : 'INSPECT'}
          scale={0.8}
        />
      )}

      {/* 3 Competing Rules Table */}
      <g transform="translate(30, 135)">
        <rect x="0" y="0" width="700" height="195" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          EVALUATING 3 MATCHING RULES (FIRST-MATCH TERMINATION PRINCIPLE)
        </text>

        {/* RULE 1: MATCH & TERMINATE */}
        <g transform="translate(16, 36)">
          <rect
            x="0"
            y="0"
            width="668"
            height="38"
            rx="6"
            fill={isMatchedRule1 ? '#ecfdf5' : '#eff6ff'}
            stroke={isMatchedRule1 ? '#10b981' : '#3b82f6'}
            strokeWidth={2}
          />
          <text x="12" y="24" fill="#0f172a" fontSize="9.5" fontWeight="bold" fontFamily="monospace">#1</text>
          <text x="45" y="24" fill="#059669" fontSize="9.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>
          <text x="120" y="24" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">10.0.0.0/24</text>
          <text x="240" y="24" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">203.0.113.50:443</text>
          <text x="370" y="24" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">TCP</text>
          <text x="460" y="24" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">
            {isStopped ? 'FIRST MATCH WINNER → STOP EVALUATION! ✓' : isMatchedRule1 ? 'MATCH FOUND ✓' : 'EVALUATING...'}
          </text>
        </g>

        {/* RULE 2: WOULD MATCH (DENY), BUT FADED OUT */}
        <g transform="translate(16, 82)" opacity={isFaded ? 0.35 : 0.8}>
          <rect x="0" y="0" width="668" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray={isFaded ? '4 4' : undefined} />
          <text x="12" y="22" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">#2</text>
          <text x="45" y="22" fill="#dc2626" fontSize="9" fontWeight="bold" fontFamily="monospace">DENY</text>
          <text x="120" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">10.0.0.25 (Exact IP)</text>
          <text x="240" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">203.0.113.50:443</text>
          <text x="370" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">TCP</text>
          <text x="460" y="22" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isFaded ? '⚠️ FADED / SKIPPED (Never Reached)' : 'Potential Match'}
          </text>
        </g>

        {/* RULE 3: WOULD MATCH (ALLOW), BUT FADED OUT */}
        <g transform="translate(16, 124)" opacity={isFaded ? 0.35 : 0.8}>
          <rect x="0" y="0" width="668" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray={isFaded ? '4 4' : undefined} />
          <text x="12" y="22" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">#3</text>
          <text x="45" y="22" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">ALLOW</text>
          <text x="120" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">ANY</text>
          <text x="240" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">203.0.113.50:443</text>
          <text x="370" y="22" fill="#64748b" fontSize="8.5" fontFamily="monospace">TCP</text>
          <text x="460" y="22" fill="#64748b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isFaded ? '⚠️ FADED / SKIPPED (Never Reached)' : 'Potential Match'}
          </text>
        </g>

        {/* Summary Footer */}
        <text x="16" y="180" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          RULE OF OPERATION: Firewall evaluation is sequential top-to-bottom. The FIRST matching rule wins and processing stops immediately.
        </text>
      </g>
    </svg>
  );
};
