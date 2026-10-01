import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q31ArpSecurityVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Client appears (192.168.1.10)
  // Step 1: Switch appears
  // Step 2: Target Server appears (192.168.1.20 / MAC AA:BB:CC)
  // Step 3: Cables drawn
  // Step 4: Client prepares IP packet, needs MAC for 192.168.1.20
  // Step 5: Client broadcasts ARP REQUEST ("Who has 192.168.1.20? Tell 192.168.1.10")
  // Step 6: Broadcast moves: CLIENT -> SWITCH
  // Step 7: Switch floods broadcast to all ports
  // Step 8: Server receives broadcast
  // Step 9: Server creates unicast ARP REPLY ("192.168.1.20 is at MAC AA:BB:CC")
  // Step 10: Reply moves: SERVER -> SWITCH -> CLIENT
  // Step 11: Client receives ARP reply
  // Step 12: Client updates local ARP Cache Table (192.168.1.20 -> AA:BB:CC)
  // Step 13: Client creates actual IP data frame with learned MAC
  // Step 14: Frame moves: CLIENT -> SERVER
  // Step 15: Server receives data frame (ACCEPTED ✓)
  // Step 16: Security risk highlighted: Unauthenticated stateless ARP allows cache spoofing

  const showSwitch = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isArpRequest = currentStepIndex >= 5 && currentStepIndex <= 8;
  const isArpReply = currentStepIndex >= 9 && currentStepIndex <= 11;
  const showArpTable = currentStepIndex >= 12;
  const isDataFrame = currentStepIndex >= 13 && currentStepIndex <= 15;
  const isDelivered = currentStepIndex >= 15;

  let packetX = 80;
  if (currentStepIndex === 5) packetX = 80;
  else if (currentStepIndex === 6) packetX = 230;
  else if (currentStepIndex >= 7 && currentStepIndex <= 8) packetX = 510;
  else if (currentStepIndex === 9) packetX = 660;
  else if (currentStepIndex === 10) packetX = 370;
  else if (currentStepIndex === 11) packetX = 80;
  else if (currentStepIndex === 13) packetX = 80;
  else if (currentStepIndex === 14) packetX = 370;
  else if (currentStepIndex >= 15) packetX = 660;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {currentStepIndex === 6 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#eab308" label="BROADCAST (FF:FF:FF:FF) →" />
      )}
      {currentStepIndex === 7 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#eab308" label="FLOODED TO PORTS →" />
      )}
      {currentStepIndex === 10 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#10b981" label="← UNICAST ARP REPLY" />
      )}
      {currentStepIndex === 14 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#2563eb" label="UNICAST DATA FRAME →" />
      )}

      {/* Nodes */}
      <LaptopNode cx={80} cy={75} label="CLIENT" ip="192.168.1.10" active={currentStepIndex <= 6 || currentStepIndex >= 11} />

      {/* Switch Node */}
      {showSwitch && (
        <g>
          <rect x="330" y="55" width="80" height="40" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
          <text x="370" y="74" textAnchor="middle" fill="#60a5fa" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            L2 SWITCH
          </text>
          <text x="370" y="86" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
            VLAN 10 Flooding
          </text>
        </g>
      )}

      {/* Server Node */}
      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="SERVER"
          sub="192.168.1.20"
          active={currentStepIndex >= 8 && currentStepIndex <= 10}
          success={isDelivered}
          statusText={isDelivered ? 'ACCEPTED ✓' : 'MAC: AA:BB:CC'}
        />
      )}

      {/* Packet Card */}
      {(isArpRequest || isArpReply || isDataFrame) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={isArpRequest ? 'ARP REQ' : isArpReply ? 'ARP REPLY' : 'IP FRAME'}
            protocol={isDataFrame ? 'TCP' : 'ARP'}
            port={isDataFrame ? '443' : 'Layer 2'}
            src={isArpReply ? 'AA:BB:CC' : '192.168.1.10'}
            dst={isArpRequest ? 'BROADCAST' : '192.168.1.20'}
            status={isDataFrame ? 'ALLOW' : 'INSPECT'}
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          ADDRESS RESOLUTION PROTOCOL (ARP) COMMUNICATION & CACHE BINDING
        </text>

        {showArpTable ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              CLIENT DYNAMIC ARP CACHE TABLE (IP → MAC MAPPING):
            </text>

            <g transform="translate(10, 24)">
              <rect x="0" y="0" width="648" height="34" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
              <text x="10" y="21" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                Internet Address: 192.168.1.20  |  Physical MAC: AA-BB-CC-11-22-33  |  Type: Dynamic (TTL 1200s) ✓
              </text>
            </g>

            <text x="12" y="80" fill="#0f172a" fontSize="7.5">
              • Communication Flow: 1. Broadcast Request → 2. Unicast Reply → 3. Cache Updated → 4. Data Frames Transmitted.
            </text>
            <text x="12" y="96" fill="#dc2626" fontSize="7.5" fontWeight="bold">
              • SECURITY VULNERABILITY: ARP is stateless and unauthenticated; hosts accept unsolicited spoofed replies blindly.
            </text>
            <text x="12" y="118" fill="#1e40af" fontSize="7.5" fontWeight="bold">
              DEFENSE: Dynamic ARP Inspection (DAI) & DHCP Snooping validate ARP bindings at the switch hardware level.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#fffbeb" stroke="#fcd34d" />
            <text x="12" y="18" fill="#b45309" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              ARP RESOLUTION WORKFLOW (RFC 826):
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Client has destination IP (192.168.1.20), but lacks the physical Layer 2 MAC address.
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. Client broadcasts ARP Request: "Who has 192.168.1.20? Tell 192.168.1.10."
            </text>
            <text x="14" y="74" fill="#0f172a" fontSize="7.5">
              3. Target host responds with unicast ARP Reply containing its hardware MAC address.
            </text>
            <text x="14" y="96" fill="#b45309" fontSize="7.5" fontWeight="bold">
              Enables Ethernet frames to be properly addressed and switched on local LAN segments.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
