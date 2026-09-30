import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q9ImplicitDenyVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Packet arrives: SSH :22 (10.0.0.25 -> Server:22)
  // Step 1: Rule 1 (HTTP :80) evaluated -> NO MATCH ✕
  // Step 2: Rule 2 (HTTPS :443) evaluated -> NO MATCH ✕
  // Step 3: Packet falls to the end of the rule table
  // Step 4: DEFAULT / IMPLICIT DENY rule activates
  // Step 5: Packet dropped at firewall with red barrier

  const isAtFw = currentStepIndex >= 0;
  const isRule1Checked = currentStepIndex >= 1;
  const isRule2Checked = currentStepIndex >= 2;
  const isEndOfTable = currentStepIndex >= 3;
  const isImplicitDeny = currentStepIndex >= 4;
  const isDropped = currentStepIndex >= 5;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="90" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="4 4" />

      {/* Traffic Flow Arrow (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <BoldArrow x1={130} y1={75} x2={330} y2={75} color="#2563eb" label="SSH :22" />
      )}

      {/* Dropped at Firewall Barrier */}
      {isDropped && (
        <g transform="translate(370, 75)">
          <line x1="45" y1="-28" x2="45" y2="28" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <rect x="55" y="-12" width="105" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="107" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            DROPPED ✕
          </text>
        </g>
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={75} label="CLIENT" ip="10.0.0.25" active />
      <FirewallGatewayNode cx={370} cy={75} label="FIREWALL" sub="Implicit Deny Gate" active={currentStepIndex >= 1} danger={isDropped} />
      <ServerNodeSVG cx={650} cy={75} label="SERVER" sub="203.0.113.50:22" active danger={isDropped} />

      {/* Packet Card (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={370}
          cy={34}
          title="SSH PACKET"
          protocol="TCP"
          port="22"
          src="10.0.0.25"
          dst="SERVER"
          status={isDropped ? 'DENY' : 'INSPECT'}
          scale={0.8}
        />
      )}

      {/* Rule Table with Implicit Deny at Bottom */}
      <g transform="translate(30, 135)">
        <rect x="0" y="0" width="700" height="195" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          FIREWALL RULEBASE & DEFAULT IMPLICIT DENY BEHAVIOR
        </text>

        {/* Rule 1: HTTP 80 */}
        <g transform="translate(16, 36)">
          <rect
            x="0"
            y="0"
            width="668"
            height="32"
            rx="5"
            fill={isRule1Checked ? '#fef2f2' : '#f8fafc'}
            stroke={isRule1Checked ? '#fca5a5' : '#e2e8f0'}
          />
          <text x="12" y="21" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">#1</text>
          <text x="45" y="21" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">ALLOW</text>
          <text x="120" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="240" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">203.0.113.50</text>
          <text x="370" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">TCP:80 (HTTP)</text>
          <text x="490" y="21" fill={isRule1Checked ? '#dc2626' : '#94a3b8'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isRule1Checked ? 'NO MATCH (Port 22 ≠ 80) ✕' : 'PENDING'}
          </text>
        </g>

        {/* Rule 2: HTTPS 443 */}
        <g transform="translate(16, 74)">
          <rect
            x="0"
            y="0"
            width="668"
            height="32"
            rx="5"
            fill={isRule2Checked ? '#fef2f2' : '#f8fafc'}
            stroke={isRule2Checked ? '#fca5a5' : '#e2e8f0'}
          />
          <text x="12" y="21" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">#2</text>
          <text x="45" y="21" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">ALLOW</text>
          <text x="120" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="240" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">203.0.113.50</text>
          <text x="370" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">TCP:443 (HTTPS)</text>
          <text x="490" y="21" fill={isRule2Checked ? '#dc2626' : '#94a3b8'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isRule2Checked ? 'NO MATCH (Port 22 ≠ 443) ✕' : 'PENDING'}
          </text>
        </g>

        {/* Rule 3: IMPLICIT DENY (BOTTOM OF RULEBASE) */}
        <g transform="translate(16, 114)">
          <rect
            x="0"
            y="0"
            width="668"
            height="38"
            rx="6"
            fill={isImplicitDeny ? '#fef2f2' : '#f8fafc'}
            stroke={isImplicitDeny ? '#ef4444' : '#cbd5e1'}
            strokeWidth={isImplicitDeny ? 2 : 1}
          />
          <text x="12" y="24" fill="#dc2626" fontSize="9" fontWeight="bold" fontFamily="monospace">DEF</text>
          <text x="45" y="24" fill="#dc2626" fontSize="9" fontWeight="bold" fontFamily="monospace">DENY</text>
          <text x="120" y="24" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="240" y="24" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="370" y="24" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ANY (ALL PORTS)</text>
          <text x="490" y="24" fill="#dc2626" fontSize="9" fontWeight="bold" fontFamily="monospace">
            {isImplicitDeny ? 'IMPLICIT DENY TRIGGERED: DROP ✕' : isEndOfTable ? 'REACHED END OF TABLE' : 'UNMATCHED FALLTHROUGH'}
          </text>
        </g>

        {/* Summary Footer */}
        <text x="16" y="178" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          ZERO TRUST FORMULA: NO MATCH → END OF RULEBASE REACHED → DEFAULT IMPLICIT DENY → TRAFFIC BLOCKED.
        </text>
      </g>
    </svg>
  );
};
