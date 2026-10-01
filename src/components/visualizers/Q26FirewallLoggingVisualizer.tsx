import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q26FirewallLoggingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Client appears
  // Step 2: Firewall appears
  // Step 3: Server appears
  // Step 4: Packet transmitted (Telnet Port 23)
  // Step 5: Firewall blocks packet
  // Step 6: Packet stops (✕ BLOCKED AT FW)
  // Step 7: Firewall generates real-time Syslog entry
  // Step 8: Highlight Timestamp & Source IP (10.0.1.25)
  // Step 9: Highlight Destination IP (203.0.113.50)
  // Step 10: Highlight Destination Port (Port 23 Telnet)
  // Step 11: Highlight Action = DENY (Rule #402)
  // Step 12: Visual correlation from Log -> Rule -> Threat Mitigation

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isBlocked = currentStepIndex >= 4;
  const isLogGenerated = currentStepIndex >= 6;
  const highlightSrc = currentStepIndex >= 7;
  const highlightDst = currentStepIndex >= 8;
  const highlightPort = currentStepIndex >= 9;
  const highlightAction = currentStepIndex >= 10;
  const isResolved = currentStepIndex >= 11;

  let packetX = 90;
  if (currentStepIndex === 3) packetX = 220;
  else if (currentStepIndex >= 4) packetX = 370;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Baseline cable */}
      {showServer && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Connection arrow */}
      {currentStepIndex === 3 && (
        <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#ef4444" label="TELNET :23" />
      )}

      {/* Red Block Barrier */}
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
      <LaptopNode cx={90} cy={70} label="CLIENT" ip="10.0.1.25" active />
      {showFw && (
        <FirewallGatewayNode cx={370} cy={70} label="FIREWALL" sub="Syslog Stream Generator" active danger={isBlocked} />
      )}
      {showServer && (
        <ServerNodeSVG cx={650} cy={70} label="TARGET SERVER" sub="203.0.113.50:23" active danger={isBlocked} />
      )}

      {/* Packet Card */}
      {currentStepIndex >= 3 && (
        <PacketCard
          cx={packetX}
          cy={28}
          title="INSECURE TELNET"
          protocol="TCP"
          port="23"
          src="10.0.1.25"
          dst="SERVER"
          status={isBlocked ? 'DENY' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Syslog Terminal & 5-Tuple Forensic Dissector */}
      <g transform="translate(30, 130)">
        <rect x="0" y="0" width="700" height="200" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          FIREWALL LOGGING PIPELINE & 5-TUPLE FORENSIC DECODER
        </text>

        {/* Real-time Syslog Terminal Box */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="668" height="52" rx="6" fill="#0f172a" stroke="#334155" />
          <circle cx="14" cy="12" r="3" fill="#ef4444" />
          <circle cx="24" cy="12" r="3" fill="#f59e0b" />
          <circle cx="34" cy="12" r="3" fill="#10b981" />
          <text x="50" y="15" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            /var/log/messages (SYSLOG EVENT LOG STREAM)
          </text>

          {isLogGenerated ? (
            <g transform="translate(14, 34)">
              <text x="0" y="0" fill="#94a3b8" fontSize="8" fontFamily="monospace">[15:30:12]</text>
              <text x="75" y="0" fill={highlightSrc ? '#38bdf8' : '#cbd5e1'} fontSize="8" fontWeight={highlightSrc ? 'bold' : 'normal'} fontFamily="monospace">
                SRC=10.0.1.25:51294
              </text>
              <text x="220" y="0" fill={highlightDst ? '#4ade80' : '#cbd5e1'} fontSize="8" fontWeight={highlightDst ? 'bold' : 'normal'} fontFamily="monospace">
                DST=203.0.113.50:23
              </text>
              <text x="375" y="0" fill={highlightPort ? '#fbbf24' : '#cbd5e1'} fontSize="8" fontWeight={highlightPort ? 'bold' : 'normal'} fontFamily="monospace">
                PROTO=TCP PORT=23 (TELNET)
              </text>
              <text x="525" y="0" fill={highlightAction ? '#f87171' : '#cbd5e1'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                ACTION=DENY RULE_ID=402
              </text>
            </g>
          ) : (
            <text x="14" y="34" fill="#64748b" fontSize="8" fontFamily="monospace">Waiting for firewall drop event...</text>
          )}
        </g>

        {/* 5-Step Forensic Process Strip */}
        <g transform="translate(16, 100)">
          {[
            { num: '1', title: 'TRAFFIC', sub: 'Insecure Telnet', active: true },
            { num: '2', title: 'DROP', sub: 'Firewall Intercept', active: isBlocked },
            { num: '3', title: 'SYSLOG', sub: '5-Tuple Generated', active: isLogGenerated },
            { num: '4', title: 'RULE #402', sub: 'Explicit Telnet Deny', active: highlightAction },
            { num: '5', title: 'RESOLVED', sub: 'Use SSH on Port 22', active: isResolved },
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
            FORENSIC LIFECYCLE: TRAFFIC ➔ BLOCK ➔ LOG (5-TUPLE) ➔ INVESTIGATE ➔ RULE MATCH ➔ SECURE REMEDIATION.
          </text>
        </g>
      </g>
    </svg>
  );
};
