import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q35DhcpRogueVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Phase 1: Legitimate DHCP DORA Process (Steps 0-6)
  // Step 1: Unconfigured Client appears (0.0.0.0)
  // Step 2: Client broadcasts DHCP Discover (UDP :67)
  // Step 3: Legitimate DHCP Server appears
  // Step 4: Server sends DHCP Offer (IP: 192.168.1.50, GW: 192.168.1.1, DNS: 8.8.8.8)
  // Step 5: Client sends DHCP Request
  // Step 6: Server sends DHCP ACK -> Client network configuration active ✓ - STOP
  //
  // Phase 2: Rogue DHCP Attack & Snooping Mitigation (Steps 7-11)
  // Step 7: Rogue DHCP Server appears on switch untrusted port
  // Step 8: New Client broadcasts DHCP Discover
  // Step 9: Rogue DHCP Server races ahead with malicious Gateway & DNS IP
  // Step 10: Client diverted through attacker gateway (MITM)
  // Step 11: Mitigation Demonstration: DHCP Snooping marks untrusted ports & DROPS rogue offers!

  const isRoguePhase = currentStepIndex >= 6;

  const showLegitDhcp = currentStepIndex >= 2;
  const showRogueDhcp = currentStepIndex >= 6;

  const isDiscover = currentStepIndex === 1 || currentStepIndex === 7;
  const isOffer = currentStepIndex === 3 || currentStepIndex === 8;
  const isAck = currentStepIndex === 5;
  const isSnoopingActive = currentStepIndex >= 10;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isSnoopingActive ? '#f0fdf4' : isRoguePhase ? '#fef2f2' : '#eff6ff'} stroke={isSnoopingActive ? '#86efac' : isRoguePhase ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isSnoopingActive ? '#047857' : isRoguePhase ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isSnoopingActive
            ? 'MITIGATION ACTIVE: DHCP SNOOPING MARKS SWITCH PORT UNTRUSTED & BLOCKS ROGUE DHCP OFFERS ✓'
            : isRoguePhase
            ? 'ROGUE DHCP ATTACK: UNAUTHORIZED DHCP SERVER PROVIDES ROGUE GATEWAY ➔ HIJACKS ALL INTERNET TRAFFIC ✕'
            : 'LEGITIMATE DHCP DORA: DISCOVER ➔ OFFER ➔ REQUEST ➔ ACK ➔ CLIENT CONFIGURED (192.168.1.50) ✓'}
        </text>
      </g>

      {/* Nodes: Client <-> Switch/Network <-> DHCP Servers */}
      <LaptopNode cx={80} cy={75} label="NEW CLIENT" ip={isAck ? '192.168.1.50' : '0.0.0.0'} active />

      {showLegitDhcp && (
        <ServerNodeSVG cx={650} cy={75} label="AUTHORIZED DHCP" sub="192.168.1.1:67" active success={!isRoguePhase || isSnoopingActive} />
      )}

      {showRogueDhcp && (
        <g transform="translate(370, 0)">
          <LaptopNode cx={0} cy={0} label="ROGUE DHCP SERVER" ip="192.168.1.99" active danger={!isSnoopingActive} />
        </g>
      )}

      {/* Motion Arrows */}
      {isDiscover && (
        <BoldArrow x1={120} y1={75} x2={610} y2={75} color="#0284c7" label="BROADCAST DISCOVER" />
      )}
      {isOffer && !isRoguePhase && (
        <BoldArrow x1={610} y1={75} x2={120} y2={75} color="#10b981" reverse label="OFFER: 192.168.1.50" />
      )}
      {isAck && (
        <BoldArrow x1={610} y1={75} x2={120} y2={75} color="#10b981" reverse label="ACK: LEASE CONFIRMED ✓" />
      )}
      {isRoguePhase && !isSnoopingActive && currentStepIndex === 8 && (
        <BoldArrow x1={370} y1={25} x2={120} y2={75} color="#ef4444" label="ROGUE OFFER: GW=ATTACKER" />
      )}

      {isSnoopingActive && (
        <g transform="translate(370, 75)">
          <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth={2} />
          <text x="0" y="4" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ✓ SNOOPING BLOCKED ROGUE
          </text>
        </g>
      )}

      {/* Lower DHCP DORA & Snooping Table */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DHCP 4-WAY DORA PROCESS vs ROGUE DHCP SNOOPING DEFENSE
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">DHCP DORA 4-STAGE LIFECYCLE:</text>
          <text x="12" y="32" fill="#0f172a" fontSize="7.5" fontFamily="monospace">1. Discover: Client broadcasts UDP 67 search for DHCP.</text>
          <text x="12" y="46" fill="#0f172a" fontSize="7.5" fontFamily="monospace">2. Offer: Server offers available IP + Subnet Mask.</text>
          <text x="12" y="60" fill="#0f172a" fontSize="7.5" fontFamily="monospace">3. Request: Client requests to accept proposed lease.</text>
          <text x="12" y="74" fill="#059669" fontSize="7.5" fontWeight="bold" fontFamily="monospace">4. Acknowledgment (ACK): Server finalizes lease.</text>
          <text x="12" y="90" fill="#64748b" fontSize="7">Ports: Client uses UDP 68, Server uses UDP 67.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">DHCP SNOOPING SECURITY ARCHITECTURE:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. Trusted Ports: Uplinks connected to authorized DHCP servers.</text>
          <text x="359" y="48" fill="#0f172a" fontSize="7.5">2. Untrusted Ports: All standard user access switch ports.</text>
          <text x="359" y="62" fill="#0f172a" fontSize="7.5">3. Switch DROPS any DHCP Offer / ACK arriving on an untrusted port.</text>
          <text x="359" y="78" fill="#059669" fontSize="7.5" fontWeight="bold">4. Creates DHCP Snooping Binding Table (used by DAI & IP Source Guard).</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: DHCP automates network configuration. DHCP Snooping prevents attackers from establishing rogue gateways or starving IP pools.
          </text>
        </g>
      </g>
    </svg>
  );
};
