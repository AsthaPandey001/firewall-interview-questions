import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, RouterNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q32ArpSpoofingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Client appears (192.168.1.10)
  // Step 2: Gateway Router appears (192.168.1.1)
  // Step 3: Attacker appears on LAN (192.168.1.99)
  // Step 4: Attacker sends forged gratuitous ARP to Client: "I am Gateway 192.168.1.1"
  // Step 5: Client receives forged mapping; ARP table changes
  // Step 6: Attacker sends forged gratuitous ARP to Gateway: "I am Client 192.168.1.10"
  // Step 7: Client sends outbound traffic destined for Gateway
  // Step 8: Traffic physically diverts to Attacker machine instead of true Gateway! (MITM Eavesdropping)
  // Step 9: Attacker forwards packet to true Gateway (Transparent Interception)
  // Step 10: Mitigation Demonstration: Dynamic ARP Inspection (DAI) & DHCP Snooping drop spoofed ARP

  const showGateway = currentStepIndex >= 1;
  const showAttacker = currentStepIndex >= 2;

  const isPoisoning = currentStepIndex === 3 || currentStepIndex === 5;
  const isTrafficDiverted = currentStepIndex === 7;
  const isIntercepted = currentStepIndex === 8;
  const isMitigated = currentStepIndex >= 9;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isMitigated ? '#f0fdf4' : '#fef2f2'} stroke={isMitigated ? '#86efac' : '#fca5a5'} />
        <text x="340" y="16" textAnchor="middle" fill={isMitigated ? '#047857' : '#991b1b'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isMitigated
            ? 'MITIGATION ACTIVE: DYNAMIC ARP INSPECTION (DAI) VALIDATES BINDINGS & DROPS SPOOFED ARP FRAMES ✓'
            : 'MAN-IN-THE-MIDDLE (MITM): ATTACKER POISONS CLIENT & GATEWAY ARP TABLES ➔ INTERCEPTS ALL TRAFFIC ✕'}
        </text>
      </g>

      {/* Nodes: Client <-> Attacker <-> Gateway */}
      <LaptopNode cx={90} cy={75} label="CLIENT" ip="192.168.1.10" active />

      {showAttacker && (
        <g transform="translate(370, 75)">
          <LaptopNode cx={0} cy={0} label="ATTACKER (MITM)" ip="192.168.1.99" active danger={!isMitigated} />
        </g>
      )}

      {showGateway && (
        <RouterNodeSVG cx={650} cy={75} label="DEFAULT GATEWAY" sub="192.168.1.1" active />
      )}

      {/* Traffic Arrows */}
      {isPoisoning && (
        <>
          <BoldArrow x1={330} y1={75} x2={130} y2={75} color="#ef4444" reverse label="FORGED ARP: I AM GW" />
          <BoldArrow x1={410} y1={75} x2={610} y2={75} color="#ef4444" label="FORGED ARP: I AM CLIENT" />
        </>
      )}

      {isTrafficDiverted && (
        <BoldArrow x1={130} y1={75} x2={330} y2={75} color="#ef4444" label="DIVERTED TO ATTACKER ✕" />
      )}

      {isIntercepted && (
        <BoldArrow x1={410} y1={75} x2={610} y2={75} color="#f59e0b" label="FORWARDED TO GW" />
      )}

      {isMitigated && (
        <g transform="translate(370, 75)">
          <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ✓ DAI BLOCKED SPOOF
          </text>
        </g>
      )}

      {/* Lower Inspection & Defense Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          ARP SPOOFING ATTACK CHAIN & ENTERPRISE DEFENSE (DYNAMIC ARP INSPECTION)
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text x="10" y="16" fill="#991b1b" fontSize="8.5" fontWeight="bold">ATTACK WORKFLOW (MITM):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">1. Attacker broadcasts gratuitous ARP claiming Gateway IP.</text>
          <text x="12" y="48" fill="#0f172a" fontSize="7.5">2. Client updates ARP table: Gateway IP ➔ Attacker MAC.</text>
          <text x="12" y="62" fill="#0f172a" fontSize="7.5">3. All outbound web/credential traffic routes to Attacker.</text>
          <text x="12" y="80" fill="#dc2626" fontSize="7" fontWeight="bold">Result: Full password, cookie, and session theft.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">ENTERPRISE MITIGATION CONTROLS:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. DHCP Snooping: Switch tracks legitimate IP-to-MAC leases.</text>
          <text x="359" y="48" fill="#0f172a" fontSize="7.5">2. Dynamic ARP Inspection (DAI): Intercepts all ARP packets on untrusted switch ports and drops mismatched ARP replies.</text>
          <text x="359" y="78" fill="#059669" fontSize="7.5" fontWeight="bold">3. 802.1X Port Security & Static ARP entries.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: ARP Spoofing enables MITM eavesdropping on local switched networks; DAI + DHCP Snooping stops it at the access switch layer.
          </text>
        </g>
      </g>
    </svg>
  );
};
