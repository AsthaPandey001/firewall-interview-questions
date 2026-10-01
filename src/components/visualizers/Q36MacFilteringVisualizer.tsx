import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q36MacFilteringVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Client workstation (MAC: 00:11:22:33:44:55) appears
  // Step 2: Switch / Wi-Fi Access Point appears with configured MAC Whitelist
  // Step 3: MAC Whitelist table displayed
  // Step 4: Authorized client attempts connection
  // Step 5: MAC matched in Whitelist -> Connection ALLOWED ✓
  // Step 6: Unauthorized Client (MAC: DE:AD:BE:EF:00:01) attempts connection
  // Step 7: Switch checks whitelist -> No match -> Connection BLOCKED ✕
  // Step 8: Show Limitation: Attacker sniffs authorized MAC over air/LAN
  // Step 9: Attacker spoofs network interface to authorized MAC (00:11:22:33:44:55)
  // Step 10: Switch permits spoofed connection (Limitation Demonstrated!)
  // Step 11: Real Security Recommendation: 802.1X / WPA3-Enterprise certificate authentication

  const showSwitch = currentStepIndex >= 1;
  const showWhitelist = currentStepIndex >= 2;
  const isAuthorizedConnected = currentStepIndex >= 4 && currentStepIndex <= 5;
  const isUnauthorizedBlocked = currentStepIndex >= 6 && currentStepIndex <= 7;
  const isAttackerSpoofing = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isAttackerSpoofing ? '#fef2f2' : '#eff6ff'} stroke={isAttackerSpoofing ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isAttackerSpoofing ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isAttackerSpoofing
            ? 'MAC FILTERING LIMITATION: ATTACKER CLONES AUTHORIZED MAC ➔ BYPASSES FILTER WITHOUT CREDENTIALS ✕'
            : 'MAC FILTERING: BASIC L2 ACCESS CONTROL (ALLOWLIST MATCH ➔ PASS, UNKNOWN MAC ➔ BLOCKED)'}
        </text>
      </g>

      {/* Nodes: Client <-> Switch AP <-> LAN */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isAttackerSpoofing ? 'ATTACKER (SPOOFED)' : isUnauthorizedBlocked ? 'ROGUE DEVICE' : 'AUTHORIZED LAPTOP'}
        ip={isAttackerSpoofing ? 'MAC: 00:11:22:33:44:55' : isUnauthorizedBlocked ? 'MAC: DE:AD:BE:EF:00:01' : 'MAC: 00:11:22:33:44:55'}
        active
        danger={isUnauthorizedBlocked || isAttackerSpoofing}
        success={isAuthorizedConnected}
      />

      {showSwitch && (
        <g transform="translate(370, 75)">
          <rect x="-45" y="-30" width="90" height="46" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth={2} />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">SWITCH / AP</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">MAC FILTER</text>
          <text x="0" y="26" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">ACCESS POINT</text>
        </g>
      )}

      {showSwitch && (
        <ServerNodeSVG cx={650} cy={75} label="CORPORATE LAN" sub="VLAN 10" active success={isAuthorizedConnected} />
      )}

      {/* Connection Arrows & Indicators */}
      {isAuthorizedConnected && (
        <BoldArrow x1={125} y1={75} x2={325} y2={75} color="#10b981" label="WHITELIST MATCH ✓" />
      )}

      {isUnauthorizedBlocked && (
        <g transform="translate(370, 75)">
          <line x1="-35" y1="-25" x2="-35" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <rect x="-120" y="-12" width="80" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="-80" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
            BLOCKED ✕
          </text>
        </g>
      )}

      {isAttackerSpoofing && (
        <BoldArrow x1={125} y1={75} x2={325} y2={75} color="#f59e0b" label="SPOOFED MAC PERMITTED ⚠" />
      )}

      {/* Lower MAC Filtering Analysis Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          MAC ADDRESS FILTERING WHITELIST & SECURITY LIMITATIONS
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">AP MAC WHITELIST TABLE:</text>
          
          <rect x="8" y="24" width="309" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
          <text x="14" y="38" fill="#64748b" fontSize="7" fontFamily="monospace">Allowed Hardware MAC Address       Status</text>

          <rect x="8" y="48" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
          <text x="14" y="62" fill="#065f46" fontSize="7.5" fontWeight="bold" fontFamily="monospace">00:11:22:33:44:55                  PERMIT (Authorized CEO Laptop)</text>

          <rect x="8" y="72" width="309" height="22" rx="3" fill="#fee2e2" stroke="#fca5a5" />
          <text x="14" y="86" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">ALL OTHER MAC ADDRESSES            DENY (Implicit Drop)</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text x="355" y="16" fill="#991b1b" fontSize="8.5" fontWeight="bold">WHY MAC FILTERING IS NOT REAL SECURITY:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. Transmitted in Plaintext: MAC addresses are visible in every 802.11 Wi-Fi & Ethernet frame header.</text>
          <text x="359" y="52" fill="#0f172a" fontSize="7.5">2. Trivial to Spoof: Tools like `macchanger` change client MAC in 1 second.</text>
          <text x="359" y="70" fill="#0f172a" fontSize="7.5">3. High Administrative Overhead: Updating lists for every new device does not scale.</text>
          <text x="359" y="88" fill="#047857" fontSize="7.5" fontWeight="bold">Standard: Use 802.1X EAP-TLS certificate-based authentication instead.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: MAC filtering is an administrative convenience for device inventory, but provides ZERO cryptographic security against attackers.
          </text>
        </g>
      </g>
    </svg>
  );
};
