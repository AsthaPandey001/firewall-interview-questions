import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q3StatefulStatelessVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Initial resting setup (NO ARROWS)
  // Step 1: Both paths send SYN
  // Step 2: Stateless inspects alone vs Stateful starts session
  // Step 3: Stateful Table created (10.0.0.25 -> Server:443 | NEW)
  // Step 4: Server sends SYN-ACK response
  // Step 5: Stateful Firewall updates State: NEW -> ESTABLISHED
  // Step 6: Stateful return traffic accepted vs Stateless blocked
  // Step 7: Visual Comparison Summary

  const isFinalComparison = currentStepIndex >= 7;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {!isFinalComparison ? (
        <>
          {/* ───────────────────────────────────────────────────────── */}
          {/* TOP TRACK: STATELESS FIREWALL (NO MEMORY) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 10)">
            <rect
              x="0"
              y="0"
              width="720"
              height="145"
              rx="8"
              fill="#ffffff"
              stroke={currentStepIndex >= 6 ? '#ef4444' : '#cbd5e1'}
              strokeWidth={currentStepIndex >= 6 ? 2 : 1}
            />
            {/* Header */}
            <rect x="0" y="0" width="720" height="22" rx="7" fill={currentStepIndex >= 6 ? '#fef2f2' : '#f8fafc'} />
            <text x="14" y="15" fill={currentStepIndex >= 6 ? '#991b1b' : '#334155'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              TRACK A: STATELESS FIREWALL (PACKET-BY-PACKET ISOLATED EVALUATION)
            </text>

            {/* Baseline */}
            <line x1="70" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={75} label="Client" ip="10.0.0.25" active />
            <FirewallGatewayNode
              cx={360}
              cy={75}
              label="Stateless FW"
              sub="Static Rules Only"
              active
              danger={currentStepIndex >= 6}
            />
            <ServerNodeSVG cx={650} cy={75} label="Server" sub="203.0.113.50" active />

            {/* Outbound SYN Flow (Steps 1, 2) - ONLY when currentStepIndex >= 1 */}
            {currentStepIndex >= 1 && currentStepIndex <= 2 && (
              <>
                <BoldArrow x1={105} y1={75} x2={315} y2={75} color="#2563eb" label="SYN :443" />
                {currentStepIndex >= 2 && (
                  <BoldArrow x1={405} y1={75} x2={615} y2={75} color="#10b981" label="RULE 1 ALLOW" />
                )}
              </>
            )}

            {/* Return SYN-ACK Flow (Steps 4, 5, 6) */}
            {currentStepIndex >= 4 && currentStepIndex <= 5 && (
              <BoldArrow x1={615} y1={75} x2={405} y2={75} color="#f59e0b" reverse label="SYN-ACK" />
            )}

            {/* Step 6: DROPPED because no state memory */}
            {currentStepIndex === 6 && (
              <>
                <BoldArrow x1={615} y1={75} x2={405} y2={75} color="#ef4444" reverse blocked label="NO STATE TABLE" />
                <g transform="translate(360, 122)">
                  <rect x="-140" y="-8" width="280" height="16" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="3" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                    BLOCKED ✕: Inbound return rejected (No state memory)
                  </text>
                </g>
              </>
            )}
          </g>

          {/* ───────────────────────────────────────────────────────── */}
          {/* BOTTOM TRACK: STATEFUL FIREWALL (SESSION STATE MEMORY) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 165)">
            <rect
              x="0"
              y="0"
              width="720"
              height="165"
              rx="8"
              fill="#ffffff"
              stroke={currentStepIndex >= 5 ? '#10b981' : '#3b82f6'}
              strokeWidth={currentStepIndex >= 5 ? 2 : 1}
            />
            {/* Header */}
            <rect x="0" y="0" width="720" height="22" rx="7" fill={currentStepIndex >= 5 ? '#ecfdf5' : '#eff6ff'} />
            <text x="14" y="15" fill={currentStepIndex >= 5 ? '#065f46' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              TRACK B: STATEFUL FIREWALL (DYNAMIC CONNECTION STATE TABLE)
            </text>

            {/* Baseline */}
            <line x1="70" y1="65" x2="650" y2="65" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={65} label="Client" ip="10.0.0.25" active success={currentStepIndex >= 6} />
            <FirewallGatewayNode
              cx={360}
              cy={65}
              label="Stateful FW"
              sub="Dynamic State RAM"
              active
              success={currentStepIndex >= 3}
            />
            <ServerNodeSVG cx={650} cy={65} label="Server" sub="203.0.113.50" active success={currentStepIndex >= 4} />

            {/* Outbound SYN Flow - ONLY when currentStepIndex >= 1 */}
            {currentStepIndex >= 1 && currentStepIndex <= 3 && (
              <>
                <BoldArrow x1={105} y1={65} x2={315} y2={65} color="#2563eb" label="SYN :443" />
                {currentStepIndex >= 2 && (
                  <BoldArrow x1={405} y1={65} x2={615} y2={65} color="#10b981" label="SYN FORWARD" />
                )}
              </>
            )}

            {/* Return SYN-ACK Flow */}
            {currentStepIndex >= 4 && (
              <>
                <BoldArrow x1={615} y1={65} x2={405} y2={65} color="#10b981" reverse label="SYN-ACK" />
                {currentStepIndex >= 6 && (
                  <BoldArrow x1={315} y1={65} x2={105} y2={65} color="#10b981" reverse label="DELIVERED ✓" />
                )}
              </>
            )}

            {/* Stateful Table Strip at Bottom */}
            <g transform="translate(16, 110)">
              <rect x="0" y="0" width="688" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="12" y="16" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                STATE TABLE:
              </text>
              <text x="95" y="16" fill="#1e293b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                SRC: 10.0.0.25:49152
              </text>
              <text x="240" y="16" fill="#1e293b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                DST: 203.0.113.50:443
              </text>
              <text x="390" y="16" fill="#1e293b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                PROTO: TCP
              </text>
              <text
                x="480"
                y="16"
                fill={currentStepIndex >= 5 ? '#059669' : '#2563eb'}
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STATE: {currentStepIndex >= 5 ? 'ESTABLISHED ✓' : currentStepIndex >= 3 ? 'NEW (SYN_SENT)' : currentStepIndex >= 1 ? 'TRACKING' : 'IDLE'}
              </text>
              <text
                x="620"
                y="16"
                fill={currentStepIndex >= 6 ? '#059669' : '#64748b'}
                fontSize="7.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {currentStepIndex >= 6 ? 'RETURN ALLOWED ✓' : 'READY'}
              </text>
              <text x="12" y="32" fill="#64748b" fontSize="7">
                {currentStepIndex >= 5
                  ? '✓ Stateful connection table matches return packet automatically without opening static inbound ports.'
                  : 'Outbound session logged. Inbound server responses will match this table entry.'}
              </text>
            </g>
          </g>
        </>
      ) : (
        /* Final Comparison Visual */
        <g transform="translate(30, 20)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="300" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="36" rx="11" fill="#0f172a" />
          <text x="24" y="23" fill="#ffffff" fontSize="11" fontWeight="bold">
            STATELESS VS STATEFUL FIREWALL: SUMMARY COMPARISON
          </text>

          {/* Left Box: Stateless */}
          <g transform="translate(24, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#ef4444" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              STATELESS FIREWALL
            </text>

            <g transform="translate(20, 48)">
              <rect x="0" y="0" width="270" height="30" rx="6" fill="#ffffff" stroke="#fca5a5" />
              <text x="135" y="19" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                PACKET → CHECK → DECISION
              </text>

              <text x="0" y="56" fill="#7f1d1d" fontSize="8" fontWeight="bold">• Evaluates packets in isolation (no memory)</text>
              <text x="0" y="74" fill="#7f1d1d" fontSize="8">• Requires explicit 2-way rules for replies</text>
              <text x="0" y="92" fill="#7f1d1d" fontSize="8">• High-port opening creates security hole</text>
              <text x="0" y="110" fill="#7f1d1d" fontSize="8">• Vulnerable to ACK scan & spoofing</text>
              <text x="0" y="132" fill="#059669" fontSize="8" fontWeight="bold">✓ Benefit: Ultra-fast wire speed (ACLs)</text>
            </g>
          </g>

          {/* Right Box: Stateful */}
          <g transform="translate(366, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#ecfdf5" stroke="#34d399" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#10b981" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              STATEFUL FIREWALL
            </text>

            <g transform="translate(20, 48)">
              <rect x="0" y="0" width="270" height="30" rx="6" fill="#ffffff" stroke="#86efac" />
              <text x="135" y="19" textAnchor="middle" fill="#065f46" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                PACKET → CHECK → STATE → DECISION
              </text>

              <text x="0" y="56" fill="#064e3b" fontSize="8" fontWeight="bold">• Tracks TCP handshake (SYN/ACK/FIN)</text>
              <text x="0" y="74" fill="#064e3b" fontSize="8">• Return traffic allowed automatically</text>
              <text x="0" y="92" fill="#064e3b" fontSize="8">• Dynamic state table in firewall RAM</text>
              <text x="0" y="110" fill="#064e3b" fontSize="8">• Sequence number validation against spoofing</text>
              <text x="0" y="132" fill="#d97706" fontSize="8" fontWeight="bold">⚠️ Risk: State table exhaustion (SYN flood)</text>
            </g>
          </g>
        </g>
      )}
    </svg>
  );
};
