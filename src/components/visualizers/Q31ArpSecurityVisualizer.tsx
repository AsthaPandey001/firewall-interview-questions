import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q31ArpSecurityVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Client workstation appears (192.168.1.10)
  // Step 2: Local Switch appears
  // Step 3: Target Server appears (192.168.1.20)
  // Step 4: Client creates ARP Request: "Who has 192.168.1.20? Tell 192.168.1.10"
  // Step 5: Broadcast physically propagates across the LAN switch to all ports
  // Step 6: Target Server responds with unicast ARP Reply: "192.168.1.20 is at AA:BB:CC:DD:EE:01"
  // Step 7: Client updates ARP cache table: 192.168.1.20 -> AA:BB:CC:DD:EE:01
  // Step 8: Security Vulnerability Revealed: Attacker appears on LAN
  // Step 9: Attacker sends forged gratuitous ARP poisoning the cache with fake MAC!
  // Step 10: Client ARP table overwritten with Attacker MAC (Vulnerability demonstrated)

  const showSwitch = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showAttacker = currentStepIndex >= 7;

  const isArpRequest = currentStepIndex === 3 || currentStepIndex === 4;
  const isArpReply = currentStepIndex === 5;
  const isCacheUpdated = currentStepIndex >= 6 && currentStepIndex <= 7;
  const isPoisoned = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isPoisoned ? '#fef2f2' : '#eff6ff'} stroke={isPoisoned ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isPoisoned ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isPoisoned
            ? 'ARP SECURITY FLAW: ARP IS STATELESS & UNENCRYPTED ➔ CLIENT ACCEPTS UNSOLICITED POISONED ARP REPLIES!'
            : 'ARP RESOLUTION: IP 192.168.1.20 ➔ BROADCAST REQUEST ➔ UNICAST REPLY ➔ MAC ADDRESS RESOLVED ✓'}
        </text>
      </g>

      {/* Nodes: Client -> Switch -> Server */}
      <LaptopNode cx={80} cy={75} label="CLIENT WORKSTATION" ip="192.168.1.10" active />

      {/* Switch representation */}
      {showSwitch && (
        <g transform="translate(370, 75)">
          <rect x="-40" y="-28" width="80" height="42" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth={2} />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">L2 SWITCH</text>
          <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">Broadcast Domain</text>
          <text x="0" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">SWITCH</text>
        </g>
      )}

      {showServer && (
        <ServerNodeSVG cx={650} cy={75} label="TARGET SERVER" sub="192.168.1.20" active success={isCacheUpdated} />
      )}

      {/* Attacker node */}
      {showAttacker && (
        <g transform="translate(370, 0)">
          <LaptopNode cx={0} cy={0} label="ATTACKER" ip="192.168.1.99" active danger />
        </g>
      )}

      {/* Motion Arrows */}
      {isArpRequest && (
        <BoldArrow x1={120} y1={75} x2={330} y2={75} color="#0284c7" label="BROADCAST: WHO HAS .20?" />
      )}
      {isArpReply && (
        <BoldArrow x1={610} y1={75} x2={120} y2={75} color="#10b981" reverse label="REPLY: MAC AA:BB:CC:01" />
      )}
      {isPoisoned && (
        <BoldArrow x1={370} y1={25} x2={120} y2={75} color="#ef4444" label="POISON: .20 is AT ATTACKER_MAC" />
      )}

      {/* Lower ARP Table & Forensic Dissection */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          CLIENT ARP CACHE TABLE & SECURITY VULNERABILITY ANALYSIS
        </text>

        <g transform="translate(16, 36)">
          {/* Live ARP Table Box */}
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">CLIENT ARP CACHE (arp -a):</text>
          
          <rect x="8" y="24" width="309" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
          <text x="14" y="38" fill="#64748b" fontSize="7" fontFamily="monospace">Internet Address      Physical Address      Type</text>

          <rect x="8" y="48" width="309" height="42" rx="3" fill={isPoisoned ? '#fee2e2' : isCacheUpdated ? '#dcfce7' : '#ffffff'} stroke={isPoisoned ? '#fca5a5' : '#86efac'} />
          <text x="14" y="64" fill={isPoisoned ? '#991b1b' : '#065f46'} fontSize="8" fontWeight="bold" fontFamily="monospace">
            192.168.1.20          {isPoisoned ? '66:77:88:99:00:FF [POISONED!]' : isCacheUpdated ? 'AA:BB:CC:DD:EE:01' : 'Incomplete...'}  dynamic
          </text>
          <text x="14" y="80" fill={isPoisoned ? '#dc2626' : '#059669'} fontSize="7">
            {isPoisoned ? '⚠ Attacker overwritten legitimate MAC entry!' : isCacheUpdated ? '✓ Verified legitimate hardware mapping' : 'Awaiting resolution'}
          </text>

          {/* Core Vulnerability Explanation */}
          <rect x="345" y="0" width="325" height="98" rx="6" fill={isPoisoned ? '#fef2f2' : '#eff6ff'} stroke={isPoisoned ? '#fca5a5' : '#93c5fd'} />
          <text x="355" y="16" fill={isPoisoned ? '#991b1b' : '#1e40af'} fontSize="8.5" fontWeight="bold">ARP SECURITY FLAWS (RFC 826):</text>
          <text x="355" y="34" fill="#0f172a" fontSize="7.5">1. No Authentication: Any host can send an ARP reply.</text>
          <text x="355" y="48" fill="#0f172a" fontSize="7.5">2. Stateless Trust: Hosts update ARP cache even if no request was sent (Gratuitous ARP).</text>
          <text x="355" y="64" fill="#64748b" fontSize="7">3. Risk: Enables Man-in-the-Middle (MITM), eavesdropping, and session hijacking on local LANs.</text>
          <text x="355" y="82" fill="#059669" fontSize="7.5" fontWeight="bold">Mitigation: Dynamic ARP Inspection (DAI) & DHCP Snooping.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: ARP translates Layer 3 IP to Layer 2 MAC. Because ARP lacks cryptographic authentication, it is vulnerable to ARP Poisoning.
          </text>
        </g>
      </g>
    </svg>
  );
};
