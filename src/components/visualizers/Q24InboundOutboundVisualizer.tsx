import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q24InboundOutboundVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // PART A: INBOUND SCENARIO (Steps 0-15)
  // Step 0: Internet client appears (203.0.113.88)
  // Step 1: Firewall appears
  // Step 2: Internal server appears (10.0.1.10 / VIP 198.51.100.10)
  // Step 3: Cables drawn
  // Step 4: External client creates HTTPS packet
  // Step 5: Packet moves: INTERNET -> FIREWALL
  // Step 6: Firewall receives packet (INSPECTING)
  // Step 7: Inbound Rule Table appears
  // Step 8: Source check: 203.0.113.88 (Matches ANY ✓)
  // Step 9: Destination check: 198.51.100.10 (Matches Web VIP ✓)
  // Step 10: Port check: :443 (Matches HTTPS ✓)
  // Step 11: Inbound Rule 1 MATCH confirmed
  // Step 12: Action: ALLOW
  // Step 13: Packet moves: FIREWALL -> INTERNAL SERVER
  // Step 14: Server receives packet (ACCEPTED ✓)
  // Step 15: Server response packet automatically returns through state table (INBOUND COMPLETE ✓) - STOP
  //
  // PART B: OUTBOUND SCENARIO (Steps 16-26)
  // Step 16: Internal client appears (10.0.1.50)
  // Step 17: Outbound path cables drawn to Firewall & Internet Server
  // Step 18: Internal client creates outbound packet (10.0.1.50 -> 198.51.100.90:443)
  // Step 19: Packet moves: INTERNAL CLIENT -> FIREWALL
  // Step 20: Outbound Rule Table appears
  // Step 21: Firewall evaluates Outbound policy: ALLOW LAN -> WAN (Port 443)
  // Step 22: Action: ALLOW
  // Step 23: Packet moves: FIREWALL -> INTERNET SERVER
  // Step 24: Internet Server receives packet
  // Step 25: Internet Server sends return response
  // Step 26: Response delivered back to Internal Client (OUTBOUND COMPLETE ✓)

  const isOutboundPhase = currentStepIndex >= 16;

  // Inbound Node Visibility
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showInboundCables = currentStepIndex >= 3 && !isOutboundPhase;

  // Outbound Node Visibility
  const showOutboundCables = currentStepIndex >= 17;

  // Packet Coordinates
  let packetX = 80;
  let returnX = 660;

  if (!isOutboundPhase) {
    if (currentStepIndex === 4) packetX = 80;
    else if (currentStepIndex === 5) packetX = 230;
    else if (currentStepIndex >= 6 && currentStepIndex <= 12) packetX = 370;
    else if (currentStepIndex === 13) packetX = 510;
    else if (currentStepIndex >= 14) packetX = 660;

    if (currentStepIndex === 15) returnX = 230;
  } else {
    if (currentStepIndex === 18) packetX = 80;
    else if (currentStepIndex === 19) packetX = 230;
    else if (currentStepIndex >= 20 && currentStepIndex <= 22) packetX = 370;
    else if (currentStepIndex === 23) packetX = 510;
    else if (currentStepIndex >= 24) packetX = 660;

    if (currentStepIndex === 25) returnX = 370;
    else if (currentStepIndex >= 26) returnX = 80;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {(showInboundCables || showOutboundCables) && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {!isOutboundPhase && currentStepIndex === 5 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#2563eb" label="INBOUND TRANSIT →" />
      )}
      {!isOutboundPhase && currentStepIndex === 13 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="TO INTERNAL SERVER →" />
      )}
      {!isOutboundPhase && currentStepIndex === 15 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#8b5cf6" label="← STATEFUL RETURN (AUTO ALLOWED)" />
      )}

      {isOutboundPhase && currentStepIndex === 19 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#2563eb" label="OUTBOUND EGRESS →" />
      )}
      {isOutboundPhase && currentStepIndex === 23 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="TO INTERNET SERVER →" />
      )}
      {isOutboundPhase && currentStepIndex >= 25 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#8b5cf6" label="← STATEFUL RESPONSE TO CLIENT" />
      )}

      {/* Device Nodes */}
      {/* Left Node */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isOutboundPhase ? 'INTERNAL CLIENT' : 'INTERNET USER'}
        ip={isOutboundPhase ? '10.0.1.50 (LAN)' : '203.0.113.88 (WAN)'}
        active={isOutboundPhase ? currentStepIndex <= 19 || currentStepIndex >= 26 : currentStepIndex <= 5}
        statusText={isOutboundPhase && currentStepIndex >= 26 ? 'DELIVERED ✓' : undefined}
      />

      {/* Middle Firewall */}
      {showFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="PERIMETER FIREWALL"
          sub={isOutboundPhase ? 'Outbound ACL Engine' : 'Inbound ACL Engine'}
          active={
            (!isOutboundPhase && currentStepIndex >= 6 && currentStepIndex <= 12) ||
            (isOutboundPhase && currentStepIndex >= 20 && currentStepIndex <= 22)
          }
          success={(!isOutboundPhase && currentStepIndex >= 12) || (isOutboundPhase && currentStepIndex >= 22)}
        />
      )}

      {/* Right Server Node */}
      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label={isOutboundPhase ? 'INTERNET SERVER' : 'INTERNAL WEB SERVER'}
          sub={isOutboundPhase ? '198.51.100.90:443' : '10.0.1.10 (VIP :443)'}
          active={
            (!isOutboundPhase && currentStepIndex >= 14 && currentStepIndex <= 15) ||
            (isOutboundPhase && currentStepIndex >= 24 && currentStepIndex <= 25)
          }
          success={(!isOutboundPhase && currentStepIndex >= 14) || (isOutboundPhase && currentStepIndex >= 24)}
          statusText={
            (!isOutboundPhase && currentStepIndex >= 14) || (isOutboundPhase && currentStepIndex >= 24)
              ? 'ACCEPTED ✓'
              : 'STANDBY'
          }
        />
      )}

      {/* Forward Packet */}
      {((!isOutboundPhase && currentStepIndex >= 4 && currentStepIndex <= 14) ||
        (isOutboundPhase && currentStepIndex >= 18 && currentStepIndex <= 24)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              (!isOutboundPhase && currentStepIndex >= 12) || (isOutboundPhase && currentStepIndex >= 22)
                ? 'ALLOW ✓'
                : 'HTTPS REQ'
            }
            protocol="TCP"
            port="443"
            src={isOutboundPhase ? '10.0.1.50' : '203.0.113.88'}
            dst={isOutboundPhase ? '198.51.100.90' : '198.51.100.10'}
            status={
              (!isOutboundPhase && currentStepIndex >= 6 && currentStepIndex <= 11) ||
              (isOutboundPhase && currentStepIndex >= 20 && currentStepIndex <= 21)
                ? 'INSPECT'
                : 'ALLOW'
            }
            scale={0.78}
          />
        </g>
      )}

      {/* Return Packet */}
      {((!isOutboundPhase && currentStepIndex === 15) || (isOutboundPhase && currentStepIndex >= 25)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={returnX}
            cy={28}
            title="HTTP 200 / ACK"
            protocol="TCP"
            port="443"
            src={isOutboundPhase ? '198.51.100.90' : '10.0.1.10'}
            dst={isOutboundPhase ? '10.0.1.50' : '203.0.113.88'}
            status="ALLOW"
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isOutboundPhase
            ? 'PART B: OUTBOUND FIREWALL RULES (INTERNAL LAN → EXTERNAL WAN EGRESS)'
            : 'PART A: INBOUND FIREWALL RULES (EXTERNAL WAN → INTERNAL DMZ/SERVER INGRESS)'}
        </text>

        {!isOutboundPhase ? (
          /* Inbound Rule Table */
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">
              INBOUND ACCESS CONTROL LIST (WAN → LAN/DMZ)
            </text>
            <g transform="translate(12, 28)">
              <rect
                x="0"
                y="0"
                width="644"
                height="32"
                rx="4"
                fill={currentStepIndex >= 11 ? '#dcfce7' : '#eff6ff'}
                stroke={currentStepIndex >= 11 ? '#16a34a' : '#3b82f6'}
                strokeWidth={1.5}
              />
              <text x="10" y="20" fill={currentStepIndex >= 11 ? '#15803d' : '#1e40af'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                Inbound #1: ALLOW SRC=ANY DST=198.51.100.10:443 PROTO=TCP {currentStepIndex >= 11 && '→ MATCH: PERMIT ✓'}
              </text>
            </g>
            <text x="14" y="80" fill="#0f172a" fontSize="7.5">
              • Field Verification: Source (203.0.113.88 ✓), Dest (198.51.100.10 ✓), Port (:443 ✓).
            </text>
            <text x="14" y="98" fill="#0f172a" fontSize="7.5">
              • Stateful Return Rule: Reply from internal server is AUTOMATICALLY allowed by state table without needing an outbound rule.
            </text>
            <text x="14" y="118" fill="#15803d" fontSize="7.5" fontWeight="bold">
              INBOUND SUMMARY: Strictly restricts public access to authorized published services (Ports 80/443/VPN).
            </text>
          </g>
        ) : (
          /* Outbound Rule Table */
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#065f46" fontSize="9" fontWeight="bold" fontFamily="monospace">
              OUTBOUND ACCESS CONTROL LIST (LAN → WAN EGRESS)
            </text>
            <g transform="translate(12, 28)">
              <rect
                x="0"
                y="0"
                width="644"
                height="32"
                rx="4"
                fill={currentStepIndex >= 22 ? '#dcfce7' : '#eff6ff'}
                stroke={currentStepIndex >= 22 ? '#16a34a' : '#3b82f6'}
                strokeWidth={1.5}
              />
              <text x="10" y="20" fill={currentStepIndex >= 22 ? '#15803d' : '#1e40af'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                Outbound #10: ALLOW SRC=10.0.1.0/24 DST=ANY:443 PROTO=TCP {currentStepIndex >= 22 && '→ MATCH: PERMIT ✓'}
              </text>
            </g>
            <text x="14" y="80" fill="#0f172a" fontSize="7.5">
              • Policy Inspection: Internal employee requests external web SaaS portal; matches approved outbound web policy.
            </text>
            <text x="14" y="98" fill="#0f172a" fontSize="7.5">
              • Security Goal: Outbound filtering blocks malware command-and-control (C2) and stops data exfiltration.
            </text>
            <text x="14" y="118" fill="#065f46" fontSize="7.5" fontWeight="bold">
              OUTBOUND SUMMARY: Governs employee web access, DNS queries, and software updates heading out to WAN.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
