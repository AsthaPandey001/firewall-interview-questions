import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q4NgfwDpiVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Initial resting setup (NO ARROWS)
  // Step 1: Same packet enters both (TCP 443 carrying hidden payload)
  // Step 2: Traditional firewall checks IP/Port/Proto -> blindly allows
  // Step 3: NGFW inspects deeper (Layer 7 DPI + SSL Decryption)
  // Step 4: Threat Engine scans payload -> Flags Malware Signature -> BLOCKS packet
  // Step 5: Final Visual Comparison

  const isFinalComparison = currentStepIndex >= 5;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {!isFinalComparison ? (
        <>
          {/* ───────────────────────────────────────────────────────── */}
          {/* TOP TRACK: TRADITIONAL FIREWALL (PORT-BLIND ALLOW) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 10)">
            <rect
              x="0"
              y="0"
              width="720"
              height="145"
              rx="8"
              fill="#ffffff"
              stroke={currentStepIndex >= 2 ? '#f59e0b' : '#cbd5e1'}
              strokeWidth={currentStepIndex >= 2 ? 2 : 1}
            />
            {/* Header */}
            <rect x="0" y="0" width="720" height="22" rx="7" fill={currentStepIndex >= 2 ? '#fef3c7' : '#f8fafc'} />
            <text x="14" y="15" fill={currentStepIndex >= 2 ? '#b45309' : '#334155'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              TRACK A: TRADITIONAL FIREWALL (L3/L4 ONLY: IP & PORT BLIND ALLOW)
            </text>

            <line x1="70" y1="70" x2="650" y2="70" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={70} label="Attacker / Client" ip="10.1.5.22" active />
            <FirewallGatewayNode cx={360} cy={70} label="Traditional FW" sub="Port 443: OPEN" active />
            <ServerNodeSVG cx={650} cy={70} label="Core Server" sub="COMPROMISED ⚠️" active danger={currentStepIndex >= 2} />

            {/* Ingress packet - ONLY when currentStepIndex >= 1 */}
            {currentStepIndex >= 1 && (
              <BoldArrow x1={105} y1={70} x2={315} y2={70} color="#2563eb" label="TCP :443" />
            )}

            {/* Traditional FW permits malware because port is 443 */}
            {currentStepIndex >= 2 && (
              <>
                <BoldArrow x1={405} y1={70} x2={615} y2={70} color="#ef4444" label="MALWARE PASSES" />
                <g transform="translate(360, 120)">
                  <rect x="-140" y="-8" width="280" height="16" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="3" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                    BLIND ALLOW: Port 443 open. Cannot inspect inside TLS!
                  </text>
                </g>
              </>
            )}
          </g>

          {/* ───────────────────────────────────────────────────────── */}
          {/* BOTTOM TRACK: NEXT-GENERATION FIREWALL (DEEP INSPECTION & THREAT BLOCK) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 165)">
            <rect
              x="0"
              y="0"
              width="720"
              height="165"
              rx="8"
              fill="#ffffff"
              stroke={currentStepIndex >= 4 ? '#10b981' : '#3b82f6'}
              strokeWidth={currentStepIndex >= 4 ? 2 : 1}
            />
            {/* Header */}
            <rect x="0" y="0" width="720" height="22" rx="7" fill={currentStepIndex >= 4 ? '#ecfdf5' : '#eff6ff'} />
            <text x="14" y="15" fill={currentStepIndex >= 4 ? '#065f46' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
              TRACK B: NEXT-GEN FIREWALL (SSL DECRYPT + APP-ID + USER CONTEXT + IPS)
            </text>

            <line x1="70" y1="65" x2="650" y2="65" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={65} label="Attacker / Client" ip="10.1.5.22" active />
            <FirewallGatewayNode
              cx={360}
              cy={65}
              label="Next-Gen FW"
              sub="App-ID + IPS Engine"
              active
              success={currentStepIndex >= 4}
              scannerActive={currentStepIndex >= 2 && currentStepIndex <= 3}
            />
            <ServerNodeSVG cx={650} cy={65} label="Core Server" sub="PROTECTED ✓" active success={currentStepIndex >= 4} />

            {/* Ingress packet - ONLY when currentStepIndex >= 1 */}
            {currentStepIndex >= 1 && (
              <BoldArrow x1={105} y1={65} x2={315} y2={65} color="#2563eb" label="TLS 443" />
            )}

            {/* Blocked at Firewall in Step 4 */}
            {currentStepIndex >= 4 && (
              <g transform="translate(420, 65)">
                <line x1="0" y1="-22" x2="0" y2="22" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="10" y="-11" width="105" height="22" rx="11" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
                <text x="62" y="3.5" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  DROPPED ✕
                </text>
              </g>
            )}

            {/* Lower NGFW Deep Inspection Stack Strip */}
            <g transform="translate(16, 110)">
              <rect x="0" y="0" width="688" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="12" y="16" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                NGFW STACK:
              </text>

              <text x="85" y="16" fill="#1e40af" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                [1. IP/Port: 443]
              </text>

              <text x="195" y="16" fill={currentStepIndex >= 2 ? '#6b21a8' : '#94a3b8'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                [2. SSL Decrypted]
              </text>

              <text x="310" y="16" fill={currentStepIndex >= 3 ? '#d97706' : '#94a3b8'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                [3. App-ID: C2 Tunnel]
              </text>

              <text x="445" y="16" fill={currentStepIndex >= 4 ? '#dc2626' : '#94a3b8'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                [4. Threat: Trojan ⚠️]
              </text>

              <text x="580" y="16" fill={currentStepIndex >= 4 ? '#059669' : '#94a3b8'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                [BLOCK ✓]
              </text>

              <text x="12" y="32" fill="#64748b" fontSize="7">
                {currentStepIndex >= 4
                  ? '✓ Next-Gen Firewall looks past TCP port 443, decodes payload, identifies malicious behavior, and blocks the connection.'
                  : 'NGFW inspects application layer, user context, and threat signatures simultaneously.'}
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
            TRADITIONAL FIREWALL VS NEXT-GENERATION FIREWALL (NGFW)
          </text>

          {/* Left Box: Traditional */}
          <g transform="translate(24, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#d97706" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              TRADITIONAL FIREWALL (L3 / L4)
            </text>

            <g transform="translate(20, 44)">
              <text x="0" y="15" fill="#78350f" fontSize="8" fontWeight="bold">• Inspects: Source IP, Dest IP, Port, Protocol</text>
              <text x="0" y="35" fill="#78350f" fontSize="8">• Port-Based Rules (Port 80 = Web, 443 = HTTPS)</text>
              <text x="0" y="55" fill="#78350f" fontSize="8">• Blind to applications tunneling over port 80/443</text>
              <text x="0" y="75" fill="#78350f" fontSize="8">• Cannot inspect inside encrypted SSL/TLS traffic</text>
              <text x="0" y="95" fill="#78350f" fontSize="8">• Requires external, separate IDS/IPS appliances</text>
              <text x="0" y="120" fill="#991b1b" fontSize="8" fontWeight="bold">⚠️ Result: Malware easily bypasses open ports</text>
            </g>
          </g>

          {/* Right Box: NGFW */}
          <g transform="translate(366, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#059669" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">
              NEXT-GENERATION FIREWALL (NGFW)
            </text>

            <g transform="translate(20, 44)">
              <text x="0" y="15" fill="#064e3b" fontSize="8" fontWeight="bold">• Deep Packet Inspection (DPI) Layers 3 through 7</text>
              <text x="0" y="35" fill="#064e3b" fontSize="8">• App-ID: Identifies exact application regardless of port</text>
              <text x="0" y="55" fill="#064e3b" fontSize="8">• User-ID: Enforces policy based on Active Directory user</text>
              <text x="0" y="75" fill="#064e3b" fontSize="8">• SSL/TLS Forward Proxy Decryption & Inspection</text>
              <text x="0" y="95" fill="#064e3b" fontSize="8">• Integrated inline IPS, Anti-Virus, & Sandboxing</text>
              <text x="0" y="120" fill="#059669" fontSize="8" fontWeight="bold">✓ Result: Blocks evasive malware and rogue tunnels</text>
            </g>
          </g>
        </g>
      )}
    </svg>
  );
};
