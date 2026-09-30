import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q14IdsVsIpsVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Same SQLi Exploit packet sent by Attacker towards both systems
  // Step 1: Deep packet inspection scanning signatures on both
  // Step 2: IDS detects attack -> Generates SIEM Alert -> BUT Out-of-band packet CONTINUES to Server! Server compromised ⚠️
  // Step 3: IPS detects attack -> Sits INLINE -> Drops packet instantly & sends TCP RST! Server 100% PROTECTED ✓
  // Step 4: Full Visual Comparison

  const isFinalComparison = currentStepIndex >= 4;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {!isFinalComparison ? (
        <>
          {/* ───────────────────────────────────────────────────────── */}
          {/* TOP TRACK: IDS (PASSIVE OUT-OF-BAND SENSOR) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 10)">
            <rect
              x="0"
              y="0"
              width="720"
              height="150"
              rx="8"
              fill="#ffffff"
              stroke={currentStepIndex >= 2 ? '#f59e0b' : '#cbd5e1'}
              strokeWidth={currentStepIndex >= 2 ? 2 : 1}
            />
            {/* Header */}
            <rect x="0" y="0" width="720" height="24" rx="7" fill={currentStepIndex >= 2 ? '#fef3c7' : '#f8fafc'} />
            <text x="14" y="16" fill={currentStepIndex >= 2 ? '#b45309' : '#334155'} fontSize="9.5" fontWeight="bold" fontFamily="monospace">
              TRACK A: IDS (INTRUSION DETECTION SYSTEM) — PASSIVE OUT-OF-BAND SPAN TAP (DETECT & ALERT ONLY)
            </text>

            <line x1="70" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={75} label="Attacker" ip="198.51.100.99" active danger />
            
            {/* Switch with SPAN Tap */}
            <g transform="translate(270, 75)">
              <rect x="-24" y="-18" width="48" height="24" rx="4" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
              <text x="0" y="-3" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">SWITCH</text>
              <text x="0" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">Core Switch</text>
              <text x="0" y="33" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#2563eb" fontFamily="monospace">SPAN Port</text>
            </g>

            {/* IDS Sensor Box Above */}
            <g transform="translate(430, 75)">
              <rect x="-36" y="-28" width="72" height="38" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth={2} />
              <text x="0" y="-10" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">IDS SENSOR</text>
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">Passive Tap</text>
              <text x="0" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">IDS SENSOR</text>
              <text x="0" y="35" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">SIEM Alert Log</text>
            </g>

            <ServerNodeSVG cx={650} cy={75} label="Target DB" sub="COMPROMISED ⚠️" active danger={currentStepIndex >= 2} />

            {/* Ingress packet (Only when currentStepIndex >= 1) */}
            {currentStepIndex >= 1 && (
              <>
                <BoldArrow x1={105} y1={75} x2={240} y2={75} color="#ef4444" label="SQLi EXPLOIT" />
                <path d="M 270 55 Q 350 25 390 55" fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
              </>
            )}

            {/* Packet continues to server in IDS */}
            {currentStepIndex >= 2 && (
              <>
                <BoldArrow x1={300} y1={75} x2={615} y2={75} color="#ef4444" label="EXPLOIT REACHES SERVER!" />
                <g transform="translate(430, 22)">
                  <rect x="-55" y="-9" width="110" height="18" rx="9" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#b45309" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    SIEM ALERT SENT ⚠️
                  </text>
                </g>
                <g transform="translate(650, 125)">
                  <rect x="-120" y="-9" width="240" height="18" rx="9" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    CANNOT BLOCK: Out-of-band (Attack succeeds)
                  </text>
                </g>
              </>
            )}
          </g>

          {/* ───────────────────────────────────────────────────────── */}
          {/* BOTTOM TRACK: IPS (ACTIVE INLINE PREVENTION ENGINE) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 170)">
            <rect
              x="0"
              y="0"
              width="720"
              height="160"
              rx="8"
              fill="#ffffff"
              stroke={currentStepIndex >= 3 ? '#10b981' : '#3b82f6'}
              strokeWidth={currentStepIndex >= 3 ? 2 : 1}
            />
            {/* Header */}
            <rect x="0" y="0" width="720" height="24" rx="7" fill={currentStepIndex >= 3 ? '#ecfdf5' : '#eff6ff'} />
            <text x="14" y="16" fill={currentStepIndex >= 3 ? '#065f46' : '#1e40af'} fontSize="9.5" fontWeight="bold" fontFamily="monospace">
              TRACK B: IPS (INTRUSION PREVENTION SYSTEM) — ACTIVE INLINE INSPECTION (INSTANT BLOCK & DROP)
            </text>

            <line x1="70" y1="70" x2="650" y2="70" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={70} label="Attacker" ip="198.51.100.99" active danger={currentStepIndex >= 1} />
            <FirewallGatewayNode
              cx={360}
              cy={70}
              label="INLINE IPS"
              sub="Signature Engine"
              active={currentStepIndex >= 1}
              success={currentStepIndex >= 3}
              scannerActive={currentStepIndex === 1}
            />
            <ServerNodeSVG cx={650} cy={70} label="Target DB" sub={currentStepIndex >= 3 ? 'PROTECTED ✓' : 'Database'} active success={currentStepIndex >= 3} />

            {/* Ingress packet (Only when currentStepIndex >= 1) */}
            {currentStepIndex >= 1 && (
              <BoldArrow x1={105} y1={70} x2={315} y2={70} color="#ef4444" label="SQLi EXPLOIT" />
            )}

            {/* IPS Drops Packet Inline in Step 3 */}
            {currentStepIndex >= 3 && (
              <>
                <g transform="translate(420, 70)">
                  <line x1="0" y1="-25" x2="0" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <rect x="10" y="-12" width="120" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="70" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                    DROPPED & RESET ✕
                  </text>
                </g>

                <BoldArrow x1={315} y1={70} x2={105} y2={70} color="#ef4444" reverse label="TCP RST SENT" curveOffset={20} />
              </>
            )}

            {/* IPS Status Banner */}
            <g transform="translate(16, 115)">
              <rect x="0" y="0" width="688" height="34" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="12" y="21" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                IPS ACTION:
              </text>
              <text x="100" y="21" fill={currentStepIndex >= 3 ? '#059669' : '#1e40af'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                {currentStepIndex >= 3
                  ? '✓ Signature Matched: Malicious SQLi payload dropped immediately before reaching server. TCP RST sent to kill attacker socket.'
                  : 'Inline sensor scanning packets on the wire in real-time.'}
              </text>
            </g>
          </g>
        </>
      ) : (
        /* Final Comparison Matrix */
        <g transform="translate(30, 20)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="300" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="36" rx="11" fill="#0f172a" />
          <text x="24" y="23" fill="#ffffff" fontSize="12" fontWeight="bold">
            IDS (DETECTION) VS IPS (PREVENTION): COMPREHENSIVE ARCHITECTURAL COMPARISON
          </text>

          {/* Left Box: IDS */}
          <g transform="translate(24, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#d97706" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              IDS (INTRUSION DETECTION SYSTEM)
            </text>

            <g transform="translate(20, 44)">
              <text x="0" y="15" fill="#78350f" fontSize="8.5" fontWeight="bold">• Placement: Out-of-band via SPAN / TAP port</text>
              <text x="0" y="35" fill="#78350f" fontSize="8.5">• Mode: Passive monitoring & packet mirroring</text>
              <text x="0" y="55" fill="#78350f" fontSize="8.5">• Action: Generates SIEM Alert / SNMP Trap only</text>
              <text x="0" y="75" fill="#78350f" fontSize="8.5">• Network Latency: ZERO latency added to live traffic</text>
              <text x="0" y="95" fill="#78350f" fontSize="8.5">• Failure Mode: Fail-Open (No traffic disruption)</text>
              <text x="0" y="120" fill="#991b1b" fontSize="8.5" fontWeight="bold">⚠️ Limitation: Cannot stop active attacks</text>
            </g>
          </g>

          {/* Right Box: IPS */}
          <g transform="translate(366, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#059669" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              IPS (INTRUSION PREVENTION SYSTEM)
            </text>

            <g transform="translate(20, 44)">
              <text x="0" y="15" fill="#064e3b" fontSize="8.5" fontWeight="bold">• Placement: Direct INLINE on the traffic wire</text>
              <text x="0" y="35" fill="#064e3b" fontSize="8.5">• Mode: Active inline deep packet inspection</text>
              <text x="0" y="55" fill="#064e3b" fontSize="8.5">• Action: DROPS packet instantly & injects TCP RST</text>
              <text x="0" y="75" fill="#064e3b" fontSize="8.5">• Network Latency: Microsecond processing overhead</text>
              <text x="0" y="95" fill="#064e3b" fontSize="8.5">• Failure Mode: Needs bypass hardware (Bypass Switch)</text>
              <text x="0" y="120" fill="#059669" fontSize="8.5" fontWeight="bold">✓ Benefit: Real-time attack prevention & server defense</text>
            </g>
          </g>
        </g>
      )}
    </svg>
  );
};
