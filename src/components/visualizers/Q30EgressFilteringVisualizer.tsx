import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q30EgressFilteringVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // SCENARIO 1: AUTHORIZED OUTBOUND HTTPS (Steps 0-9)
  // Step 0: Internal client appears (10.0.1.50)
  // Step 1: Firewall with Egress Policy appears
  // Step 2: Public Internet Destination appears
  // Step 3: Outbound cables drawn
  // Step 4: Approved HTTPS packet created (10.0.1.50 -> 198.51.100.25:443)
  // Step 5: Packet moves: CLIENT -> FIREWALL
  // Step 6: Firewall inspects Egress policy: ALLOW LAN -> WAN (Port 443)
  // Step 7: Action: ALLOW
  // Step 8: Packet moves: FIREWALL -> INTERNET
  // Step 9: Internet destination receives packet & returns response (SCENARIO 1 COMPLETE ✓) - STOP
  //
  // SCENARIO 2: MALICIOUS C2 REVERSE SHELL ATTEMPT (Steps 10-16)
  // Step 10: Infected internal host generates C2 beacon on unauthorized Port 4444 (10.0.1.50 -> 203.0.113.99:4444)
  // Step 11: Packet moves: INFECTED HOST -> FIREWALL
  // Step 12: Firewall checks Egress policy: Port 4444 is not in approved egress whitelist
  // Step 13: Action: DENY / DROP
  // Step 14: Packet physically stops at Firewall (BLOCKED ✕)
  // Step 15: Security alert logged: "C2 Exfiltration Beacon Blocked"
  // Step 16: Public Internet never receives packet; malware C2 channel severed ✓

  const isMalwareScenario = currentStepIndex >= 10;

  const showFw = currentStepIndex >= 1;
  const showInternet = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isDeliveredScenario1 = currentStepIndex >= 8 && currentStepIndex <= 9;
  const isBlockedScenario2 = currentStepIndex >= 13;

  let packetX = 80;
  if (!isMalwareScenario) {
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
      {!isMalwareScenario && currentStepIndex === 5 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#2563eb" label="OUTBOUND HTTPS →" />
      )}
      {!isMalwareScenario && currentStepIndex === 8 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="TO INTERNET →" />
      )}
      {isMalwareScenario && currentStepIndex === 11 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#ef4444" label="C2 BEACON ATTEMPT →" />
      )}

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isMalwareScenario ? 'INFECTED HOST' : 'INTERNAL CLIENT'}
        ip="10.0.1.50"
        active={!isMalwareScenario ? currentStepIndex <= 5 : currentStepIndex <= 11}
      />

      {showFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="EGRESS FIREWALL"
          sub={isBlockedScenario2 ? 'EGRESS BLOCKED ✕' : 'Egress Policy'}
          active={
            (!isMalwareScenario && currentStepIndex >= 6 && currentStepIndex <= 7) ||
            (isMalwareScenario && currentStepIndex >= 12)
          }
          success={isDeliveredScenario1}
        />
      )}

      {showInternet && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label={isMalwareScenario ? 'ATTACKER C2 SERVER' : 'PUBLIC SAAS SERVER'}
          sub={isMalwareScenario ? '203.0.113.99:4444' : '198.51.100.25:443'}
          active={isDeliveredScenario1}
          success={isDeliveredScenario1}
          statusText={
            isDeliveredScenario1
              ? 'ACCEPTED ✓'
              : isBlockedScenario2
              ? 'ISOLATED (0 PKTS)'
              : 'STANDBY'
          }
        />
      )}

      {/* Packet Card */}
      {((!isMalwareScenario && currentStepIndex >= 4) || (isMalwareScenario && currentStepIndex >= 10)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              !isMalwareScenario
                ? currentStepIndex >= 7
                  ? 'ALLOW ✓'
                  : 'HTTPS REQ'
                : isBlockedScenario2
                ? 'BLOCKED ✕'
                : 'C2 BEACON'
            }
            protocol="TCP"
            port={isMalwareScenario ? '4444' : '443'}
            src="10.0.1.50"
            dst={isMalwareScenario ? '203.0.113.99' : '198.51.100.25'}
            status={
              !isMalwareScenario
                ? currentStepIndex >= 7
                  ? 'ALLOW'
                  : 'NORMAL'
                : isBlockedScenario2
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
          {isMalwareScenario
            ? 'SCENARIO 2: EGRESS FILTERING DROPS MALWARE REVERSE SHELL & C2 BEACON'
            : 'SCENARIO 1: EGRESS POLICY PERMITS AUTHORIZED OUTBOUND WEB TRAFFIC'}
        </text>

        {!isMalwareScenario ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              APPROVED OUTBOUND POLICY (PORT 443):
            </text>
            <g transform="translate(10, 24)">
              <rect x="0" y="0" width="648" height="32" rx="4" fill={currentStepIndex >= 6 ? '#dcfce7' : '#ffffff'} stroke={currentStepIndex >= 6 ? '#16a34a' : '#cbd5e1'} strokeWidth={1.5} />
              <text x="10" y="20" fill={currentStepIndex >= 6 ? '#15803d' : '#0f172a'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                Egress Rule 1: ALLOW SRC=10.0.1.0/24 DST=ANY:443 PROTO=TCP {currentStepIndex >= 6 && '→ MATCH: PERMIT ✓'}
              </text>
            </g>
            <text x="12" y="78" fill="#0f172a" fontSize="7.5">
              • Authorized corporate business traffic flows to public SaaS providers smoothly.
            </text>
            <text x="12" y="96" fill="#0f172a" fontSize="7.5">
              • Stateful inspection logs the outbound session and permits return traffic automatically.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
            <text x="12" y="18" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              UNAUTHORIZED EGRESS ATTEMPT (PORT 4444 REVERSE SHELL):
            </text>
            <text x="12" y="38" fill="#0f172a" fontSize="7.5">
              1. Infected host attempts to establish outbound C2 tunnel to external IP on Port 4444.
            </text>
            <text x="12" y="54" fill="#0f172a" fontSize="7.5">
              2. Firewall evaluates outbound policy: Port 4444 is NOT permitted in the egress whitelist.
            </text>
            <text x="12" y="72" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">
              3. ACTION: EGRESS DROP ✕ (Packet halted at firewall; C2 connection severed).
            </text>
            <text x="12" y="94" fill="#15803d" fontSize="7.5" fontWeight="bold">
              EGRESS IMPORTANCE: Stops data exfiltration, disables ransomware keys, and prevents botnet participation.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
