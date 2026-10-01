import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q35DhcpRogueVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // SCENARIO 1: LEGITIMATE DORA 4-WAY HANDSHAKE (Steps 0-7)
  // Step 0: New client appears with no IP (0.0.0.0)
  // Step 1: Client broadcasts DHCP DISCOVER (UDP 67)
  // Step 2: Legitimate DHCP Server appears & sends DHCP OFFER (192.168.1.100)
  // Step 3: Client broadcasts DHCP REQUEST
  // Step 4: DHCP Server responds with DHCP ACK (IP=192.168.1.100, GW=192.168.1.1, DNS=10.0.0.1)
  // Step 5: Client configures IP, Subnet, Gateway, and DNS
  // Step 6: Client sends standard IP packet to Gateway
  // Step 7: Gateway receives packet (DORA COMPLETE ✓) - STOP
  //
  // SCENARIO 2: ROGUE DHCP SERVER & SNOOPING MITIGATION (Steps 8-15)
  // Step 8: Rogue DHCP server appears on untrusted access port
  // Step 9: Next unconfigured client broadcasts DHCP DISCOVER
  // Step 10: Rogue DHCP server races malicious OFFER (Gateway = Attacker IP)
  // Step 11: Switch DHCP Snooping active (Uplink = Trusted, User Access = Untrusted)
  // Step 12: Switch intercepts Rogue DHCP Offer on untrusted access port
  // Step 13: Switch validates trust status: Unauthorized DHCP Offer on Access Port!
  // Step 14: Switch DROPS rogue offer & disables rogue port (ROGUE BLOCKED ✓)
  // Step 15: Legitimate DHCP server provides verified lease to client ✓

  const isRoguePhase = currentStepIndex >= 8;

  const showDhcp = currentStepIndex >= 2;
  const showRogue = currentStepIndex >= 8;
  const showCables = currentStepIndex >= 1;

  const isDoraComplete = currentStepIndex >= 5 && currentStepIndex <= 7;
  const isSnoopingBlocked = currentStepIndex >= 14;

  let packetX = 80;
  if (!isRoguePhase) {
    if (currentStepIndex <= 1) packetX = 80;
    else if (currentStepIndex === 2) packetX = 510;
    else if (currentStepIndex === 3) packetX = 230;
    else if (currentStepIndex === 4) packetX = 510;
    else if (currentStepIndex >= 5 && currentStepIndex <= 6) packetX = 230;
    else if (currentStepIndex >= 7) packetX = 660;
  } else {
    if (currentStepIndex === 9) packetX = 80;
    else if (currentStepIndex >= 10 && currentStepIndex <= 14) packetX = 370;
    else if (currentStepIndex >= 15) packetX = 660;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <>
          <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
          {showRogue && (
            <line x1="80" y1="75" x2="370" y2="220" stroke="#fca5a5" strokeWidth="2" strokeDasharray="3 3" />
          )}
        </>
      )}

      {/* Movement Arrows */}
      {!isRoguePhase && currentStepIndex === 1 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#eab308" label="1. DISCOVER (BROADCAST) →" />
      )}
      {!isRoguePhase && currentStepIndex === 2 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#0891b2" label="← 2. OFFER (192.168.1.100)" />
      )}
      {!isRoguePhase && currentStepIndex === 3 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#eab308" label="3. REQUEST (BROADCAST) →" />
      )}
      {!isRoguePhase && currentStepIndex === 4 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#10b981" label="← 4. ACKNOWLEDGE (LEASE COMMITTED)" />
      )}
      {isRoguePhase && currentStepIndex === 10 && (
        <BoldArrow x1={330} y1={200} x2={120} y2={100} color="#ef4444" label="MALICIOUS ROGUE OFFER →" />
      )}

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT"
        ip={isDoraComplete ? '192.168.1.100' : '0.0.0.0 (Unconfigured)'}
        active={currentStepIndex <= 1 || isDoraComplete || currentStepIndex === 9}
        statusText={isDoraComplete ? 'LEASED ✓' : undefined}
      />

      {/* Legitimate DHCP Server */}
      {showDhcp && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="CORP DHCP SERVER"
          sub="192.168.1.1 (Trusted Port)"
          active={!isRoguePhase || currentStepIndex >= 15}
          success={isDoraComplete || currentStepIndex >= 15}
          statusText={isDoraComplete || currentStepIndex >= 15 ? 'OFFICIAL LEASE' : 'TRUSTED'}
        />
      )}

      {/* Rogue DHCP Server */}
      {showRogue && (
        <g transform="translate(370, 220)">
          <rect x="-45" y="-20" width="90" height="40" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="-3" textAnchor="middle" fill="#fee2e2" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            ROGUE DHCP
          </text>
          <text x="0" y="10" textAnchor="middle" fill="#fca5a5" fontSize="6.5" fontFamily="monospace">
            Untrusted Port
          </text>
        </g>
      )}

      {/* Packet Card */}
      <g className="animate-pop-in transition-all duration-500">
        <PacketCard
          cx={packetX}
          cy={28}
          title={
            !isRoguePhase
              ? currentStepIndex === 1
                ? 'DISCOVER'
                : currentStepIndex === 2
                ? 'OFFER'
                : currentStepIndex === 3
                ? 'REQUEST'
                : currentStepIndex === 4
                ? 'ACK'
                : 'IP PACKET'
              : isSnoopingBlocked
              ? 'SNOOPING DROP ✕'
              : 'ROGUE OFFER'
          }
          protocol="DHCP"
          port="67/68"
          src={!isRoguePhase && (currentStepIndex === 2 || currentStepIndex === 4) ? '192.168.1.1' : '0.0.0.0'}
          dst={!isRoguePhase && (currentStepIndex === 1 || currentStepIndex === 3) ? '255.255.255.255' : 'Client'}
          status={!isRoguePhase ? (isDoraComplete ? 'ALLOW' : 'NORMAL') : isSnoopingBlocked ? 'DENY' : 'INSPECT'}
          scale={0.78}
        />
      </g>

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isRoguePhase
            ? 'DHCP SECURITY: ROGUE DHCP SERVER ATTACK & SWITCH DHCP SNOOPING DEFENSE'
            : 'DYNAMIC HOST CONFIGURATION PROTOCOL (DORA 4-WAY HANDSHAKE)'}
        </text>

        {!isRoguePhase ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              DORA 4-WAY HANDSHAKE (UDP PORTS 67/68):
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. DISCOVER: Client broadcasts (0.0.0.0 → 255.255.255.255) looking for an available DHCP server.
            </text>
            <text x="14" y="54" fill="#0f172a" fontSize="7.5">
              2. OFFER: Official DHCP server offers IP address 192.168.1.100, Subnet Mask, Gateway, and DNS.
            </text>
            <text x="14" y="70" fill="#0f172a" fontSize="7.5">
              3. REQUEST: Client formally requests the offered IP lease.
            </text>
            <text x="14" y="86" fill="#15803d" fontSize="7.5" fontWeight="bold">
              4. ACKNOWLEDGE: Server commits binding to DHCP lease table and confirms configuration ✓.
            </text>
            <text x="14" y="110" fill="#1e40af" fontSize="7.5" fontWeight="bold">
              DORA completes automatic client network bootstrapping without manual IP configuration.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f0fdf4" stroke="#86efac" />
            <text x="12" y="18" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              HOW DHCP SNOOPING DEFENDS AGAINST ROGUE DHCP SERVERS:
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Rogue Risk: Rogue DHCP server gives clients malicious Default Gateway & DNS, hijacking all web traffic (MITM).
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. Switch Snooping Logic: Classifies switch ports into TRUSTED (Server uplinks) and UNTRUSTED (User access).
            </text>
            <text x="14" y="74" fill="#15803d" fontSize="8" fontWeight="bold" fontFamily="monospace">
              3. ACTION: Switch drops DHCP OFFER/ACK packets arriving on untrusted ports (Rogue disabled) ✓.
            </text>
            <text x="14" y="98" fill="#15803d" fontSize="7.5" fontWeight="bold">
              DHCP Snooping guarantees only authorized corporate DHCP servers can assign network configurations.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
