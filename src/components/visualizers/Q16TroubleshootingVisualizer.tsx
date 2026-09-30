import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q16TroubleshootingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Packet attempts connection (10.0.0.25 -> Server:22 SSH)
  // Step 1: Firewall blocks connection
  // Step 2: Live syslog entry generated with 5-tuple fields
  // Step 3: Highlight Source IP: 10.0.0.25
  // Step 4: Highlight Dest IP: 203.0.113.50
  // Step 5: Highlight Port: 22 (SSH)
  // Step 6: Trace to matching firewall rule: Rule #104 (DENY SSH)
  // Step 7: Final root cause & diagnostic remediation: Traffic -> Block -> Log -> Rule -> Reason

  const isBlocked = currentStepIndex >= 1;
  const isLogGenerated = currentStepIndex >= 2;
  const highlightSrc = currentStepIndex >= 3;
  const highlightDst = currentStepIndex >= 4;
  const highlightPort = currentStepIndex >= 5;
  const matchRule = currentStepIndex >= 6;
  const finalReason = currentStepIndex >= 7;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />

      {/* Connection Arrows (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#2563eb" label="SSH :22" />
      )}

      {/* Red Dropped Barrier */}
      {isBlocked && (
        <g transform="translate(370, 70)">
          <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <rect x="55" y="-12" width="90" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="100" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            BLOCKED ✕
          </text>
        </g>
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={70} label="CLIENT" ip="10.0.0.25" active />
      <FirewallGatewayNode cx={370} cy={70} label="FIREWALL" sub="Syslog Generator" active={currentStepIndex >= 1} danger={isBlocked} />
      <ServerNodeSVG cx={650} cy={70} label="SERVER" sub="203.0.113.50:22" active danger={isBlocked} />

      {/* Packet Card (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={370}
          cy={28}
          title="SSH PACKET"
          protocol="TCP"
          port="22"
          src="10.0.0.25"
          dst="SERVER"
          status={isBlocked ? 'DENY' : 'INSPECT'}
          scale={0.78}
        />
      )}

      {/* Lower Forensic Troubleshooting Investigation Canvas */}
      <g transform="translate(30, 130)">
        <rect x="0" y="0" width="700" height="200" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          SECURITY FORENSIC TRIAGE PIPELINE (LOG ANALYSIS & ROOT CAUSE)
        </text>

        {/* Live Syslog Terminal Output */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="668" height="52" rx="6" fill="#0f172a" stroke="#334155" />
          <circle cx="14" cy="12" r="3" fill="#ef4444" />
          <circle cx="24" cy="12" r="3" fill="#f59e0b" />
          <circle cx="34" cy="12" r="3" fill="#10b981" />
          <text x="50" y="15" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            /var/log/firewall/traffic.log (REAL-TIME EVENT STREAM)
          </text>

          {isLogGenerated ? (
            <g transform="translate(14, 34)">
              <text x="0" y="0" fill="#94a3b8" fontSize="8" fontFamily="monospace">[14:22:01]</text>
              <text x="75" y="0" fill={highlightSrc ? '#38bdf8' : '#cbd5e1'} fontSize="8" fontWeight={highlightSrc ? 'bold' : 'normal'} fontFamily="monospace">
                SRC=10.0.0.25:49201
              </text>
              <text x="220" y="0" fill={highlightDst ? '#4ade80' : '#cbd5e1'} fontSize="8" fontWeight={highlightDst ? 'bold' : 'normal'} fontFamily="monospace">
                DST=203.0.113.50:22
              </text>
              <text x="375" y="0" fill={highlightPort ? '#fbbf24' : '#cbd5e1'} fontSize="8" fontWeight={highlightPort ? 'bold' : 'normal'} fontFamily="monospace">
                PROTO=TCP PORT=22
              </text>
              <text x="500" y="0" fill="#f87171" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                ACTION=DENY RULE_ID=104
              </text>
            </g>
          ) : (
            <text x="14" y="34" fill="#64748b" fontSize="8" fontFamily="monospace">Waiting for blocked event...</text>
          )}
        </g>

        {/* 5-Step Troubleshooting Process Flow */}
        <g transform="translate(16, 100)">
          {[
            { num: '1', title: 'TRAFFIC', sub: 'Connection Attempt', active: true },
            { num: '2', title: 'BLOCK', sub: 'Firewall Policy Drop', active: isBlocked },
            { num: '3', title: 'LOG', sub: 'Syslog 5-Tuple Generated', active: isLogGenerated },
            { num: '4', title: 'RULE', sub: 'Matched Rule #104', active: matchRule },
            { num: '5', title: 'REASON', sub: 'Unauthorized Subnet', active: finalReason },
          ].map((s, idx) => (
            <g key={s.num} transform={`translate(${idx * 135}, 0)`}>
              <rect
                x="0"
                y="0"
                width="128"
                height="54"
                rx="6"
                fill={s.active ? (idx === 4 ? '#ecfdf5' : '#eff6ff') : '#f8fafc'}
                stroke={s.active ? (idx === 4 ? '#10b981' : '#3b82f6') : '#cbd5e1'}
                strokeWidth={s.active ? 1.5 : 1}
              />
              <rect x="0" y="0" width="128" height="15" rx="5" fill={s.active ? (idx === 4 ? '#10b981' : '#3b82f6') : '#cbd5e1'} />
              <text x="64" y="11" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                STEP {s.num}: {s.title}
              </text>
              <text x="64" y="32" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                {s.sub}
              </text>
            </g>
          ))}
        </g>

        {/* Diagnostic Takeaway */}
        <g transform="translate(16, 166)">
          <text x="0" y="18" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
            DIAGNOSTIC RESOLUTION: Root cause identified via Rule #104. To permit legitimate administrative SSH, update ACL source scope.
          </text>
        </g>
      </g>
    </svg>
  );
};
