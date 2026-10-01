import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q29DenyByDefaultVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // SCENARIO A: APPROVED WHITELIST TRAFFIC (Steps 0-9)
  // Step 0: Client appears (10.0.1.25)
  // Step 1: Firewall appears with Whitelist Rules
  // Step 2: Server appears (10.0.5.50)
  // Step 3: Cables drawn
  // Step 4: Client creates HTTPS packet (10.0.1.25 -> 10.0.5.50:443)
  // Step 5: Packet moves: CLIENT -> FIREWALL
  // Step 6: Firewall inspects whitelist: Rule 1 (ALLOW HTTPS) matches ✓
  // Step 7: Action: ALLOW
  // Step 8: Packet moves: FIREWALL -> SERVER
  // Step 9: Server receives packet (ACCEPTED ✓) - STOP
  //
  // SCENARIO B: UNAPPROVED UNMATCHED TRAFFIC (Steps 10-17)
  // Step 10: Client creates SSH packet (10.0.1.25 -> 10.0.5.50:22)
  // Step 11: Packet moves: CLIENT -> FIREWALL
  // Step 12: Firewall checks Rule 1 (HTTPS: No Match ✕)
  // Step 13: Firewall checks Rule 2 (DNS: No Match ✕)
  // Step 14: Packet falls through to bottom of rule list
  // Step 15: IMPLICIT DEFAULT DENY triggers: Action = DENY / DROP
  // Step 16: Packet physically stops at Firewall (BLOCKED ✕)
  // Step 17: Server receives 0 packets (DENY-BY-DEFAULT PROTECTION VERIFIED ✓)

  const isScenarioB = currentStepIndex >= 10;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isDeliveredScenarioA = currentStepIndex >= 8 && currentStepIndex <= 9;
  const isBlockedScenarioB = currentStepIndex >= 15;

  let packetX = 80;
  if (!isScenarioB) {
    if (currentStepIndex <= 4) packetX = 80;
    else if (currentStepIndex === 5) packetX = 230;
    else if (currentStepIndex >= 6 && currentStepIndex <= 7) packetX = 370;
    else if (currentStepIndex === 8) packetX = 510;
    else if (currentStepIndex >= 9) packetX = 660;
  } else {
    if (currentStepIndex === 10) packetX = 80;
    else if (currentStepIndex === 11) packetX = 230;
    else if (currentStepIndex >= 12) packetX = 370;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {!isScenarioB && currentStepIndex === 5 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#2563eb" label="HTTPS SYN →" />
      )}
      {!isScenarioB && currentStepIndex === 8 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="PERMITTED TO SERVER →" />
      )}
      {isScenarioB && currentStepIndex === 11 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#ef4444" label="SSH ATTEMPT →" />
      )}

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT"
        ip="10.0.1.25"
        active={!isScenarioB ? currentStepIndex <= 5 : currentStepIndex <= 11}
      />

      {showFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="FIREWALL"
          sub={isBlockedScenarioB ? 'IMPLICIT DENY ✕' : isScenarioB ? 'EVALUATING' : 'WHITELIST'}
          active={
            (!isScenarioB && currentStepIndex >= 6 && currentStepIndex <= 7) ||
            (isScenarioB && currentStepIndex >= 12)
          }
          success={isDeliveredScenarioA}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="SERVER"
          sub="10.0.5.50"
          active={isDeliveredScenarioA}
          success={isDeliveredScenarioA}
          statusText={
            isDeliveredScenarioA
              ? 'ACCEPTED ✓'
              : isBlockedScenarioB
              ? 'PROTECTED (0 PKTS)'
              : 'STANDBY'
          }
        />
      )}

      {/* Packet Card */}
      {((!isScenarioB && currentStepIndex >= 4) || (isScenarioB && currentStepIndex >= 10)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              !isScenarioB
                ? currentStepIndex >= 7
                  ? 'ALLOW ✓'
                  : 'HTTPS SYN'
                : isBlockedScenarioB
                ? 'BLOCKED ✕'
                : 'SSH SYN'
            }
            protocol="TCP"
            port={isScenarioB ? '22' : '443'}
            src="10.0.1.25"
            dst="10.0.5.50"
            status={
              !isScenarioB
                ? currentStepIndex >= 7
                  ? 'ALLOW'
                  : 'NORMAL'
                : isBlockedScenarioB
                ? 'DENY'
                : 'INSPECT'
            }
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isScenarioB
            ? 'SCENARIO B: UNMATCHED TRAFFIC TRIGGERING IMPLICIT DEFAULT DENY'
            : 'SCENARIO A: APPROVED TRAFFIC MATCHING EXPLICIT WHITELIST RULES'}
        </text>

        {!isScenarioB ? (
          /* Whitelist Allow View */
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              EXPLICIT WHITELIST POLICY:
            </text>

            <g transform="translate(10, 24)">
              <rect
                x="0"
                y="0"
                width="648"
                height="32"
                rx="4"
                fill={currentStepIndex >= 6 ? '#dcfce7' : '#ffffff'}
                stroke={currentStepIndex >= 6 ? '#16a34a' : '#cbd5e1'}
                strokeWidth={1.5}
              />
              <text x="10" y="20" fill={currentStepIndex >= 6 ? '#15803d' : '#0f172a'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                Rule 1: ALLOW SRC=10.0.1.0/24 DST=10.0.5.50:443 PROTO=TCP {currentStepIndex >= 6 && '→ MATCH: PERMIT ✓'}
              </text>
            </g>

            <g transform="translate(10, 62)">
              <rect x="0" y="0" width="648" height="26" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="17" fill="#64748b" fontSize="7.5" fontFamily="monospace">
                Rule 2: ALLOW SRC=10.0.1.0/24 DST=8.8.8.8:53 PROTO=UDP (DNS)
              </text>
            </g>

            <text x="12" y="115" fill="#15803d" fontSize="7.5" fontWeight="bold">
              WHITELIST PRINCIPLE: Only explicitly listed services are allowed through the firewall.
            </text>
          </g>
        ) : (
          /* Implicit Deny View */
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#fef2f2" stroke="#f87171" />
            <text x="12" y="18" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              EVALUATION OF UNKNOWN SSH PACKET (PORT 22):
            </text>

            <text x="14" y="36" fill={currentStepIndex >= 12 ? '#dc2626' : '#64748b'} fontSize="7.5" fontFamily="monospace">
              1. Check Rule 1 (Port 443 HTTPS) → NO MATCH ✕ (Port 22 != 443)
            </text>
            <text x="14" y="52" fill={currentStepIndex >= 13 ? '#dc2626' : '#64748b'} fontSize="7.5" fontFamily="monospace">
              2. Check Rule 2 (Port 53 DNS) → NO MATCH ✕ (Port 22 != 53)
            </text>

            <g transform="translate(10, 62)">
              <rect
                x="0"
                y="0"
                width="648"
                height="32"
                rx="4"
                fill={currentStepIndex >= 15 ? '#fee2e2' : '#ffffff'}
                stroke={currentStepIndex >= 15 ? '#ef4444' : '#cbd5e1'}
                strokeWidth={1.5}
              />
              <text x="10" y="20" fill={currentStepIndex >= 15 ? '#dc2626' : '#64748b'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                [IMPLICIT DENY ALL]: DENY SRC=ANY DST=ANY PROTO=ANY {currentStepIndex >= 15 && '→ TRIGGERED: DROP ✕'}
              </text>
            </g>

            <text x="12" y="116" fill="#991b1b" fontSize="7.5" fontWeight="bold">
              GOLDEN RULE: "Everything not explicitly permitted is strictly forbidden."
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
