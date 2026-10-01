import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q36MacFilteringVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Authorized Client appears (00:50:56:C0:00:08)
  // Step 1: Switch / AP appears
  // Step 2: Corporate LAN Server appears
  // Step 3: Network cables appear
  // Step 4: MAC Whitelist Table displayed
  // Step 5: Ethernet Frame created: Src MAC 00:50:56:C0:00:08
  // Step 6: Frame physically moves: Client -> Switch
  // Step 7: Switch inspects Ingress Source MAC
  // Step 8: Whitelist Match -> Frame forwarded: Switch -> LAN
  // Step 9: Corporate LAN receives & responds
  // Step 10: Rogue Laptop appears (MAC: 70:85:C2:11:22:33)
  // Step 11: Rogue Frame moves: Rogue -> Switch
  // Step 12: Switch evaluates whitelist -> No match -> DROPPED ✕
  // Step 13: Attacker passively sniffs plaintext MAC 00:50:56:C0:00:08
  // Step 14: Attacker spoofs MAC with macchanger
  // Step 15: Spoofed Frame moves: Attacker -> Switch -> Allowed ✕
  // Step 16: Final Security Takeaway: 802.1X EAP-TLS required

  const showSwitch = currentStepIndex >= 1;
  const showLan = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isRoguePhase = currentStepIndex >= 10 && currentStepIndex <= 12;
  const isAttackerPhase = currentStepIndex >= 13;

  // Packet animation coordinates
  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'ETH FRAME';
  let packetSub = '00:50:56:C0:00:08';
  let packetColor = '#0284c7';

  if (currentStepIndex === 5) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'ETH: 00:50:56:C0:00:08';
    packetSub = 'Dst: FF:FF:FF:FF:FF:FF';
  } else if (currentStepIndex === 6) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'ETH: 00:50:56:C0:00:08';
    packetSub = 'In-Transit ➔ Switch';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'INSPECTING MAC';
    packetSub = 'Port Gi0/1 Check';
  } else if (currentStepIndex === 8) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'MATCHED: ALLOWED';
    packetSub = '➔ VLAN 10 LAN';
    packetColor = '#10b981';
  } else if (currentStepIndex === 9) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'LAN RECEIVED ✓';
    packetSub = 'ARP/IP Accepted';
    packetColor = '#10b981';
  } else if (currentStepIndex === 11) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'ETH: 70:85:C2:11:22:33';
    packetSub = 'Rogue Frame ➔ Switch';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 12) {
    showPacket = true;
    packetX = 345;
    packetLabel = 'UNKNOWN MAC ✕';
    packetSub = 'PORT SECURITY DROP';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 15) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'SPOOFED: 00:50:56:C0:00:08';
    packetSub = 'Filter Bypassed ⚠';
    packetColor = '#f59e0b';
  }

  const clientLabel = isAttackerPhase
    ? 'ATTACKER (KALI LINUX)'
    : isRoguePhase
    ? 'ROGUE DEVICE'
    : 'AUTHORIZED LAPTOP';

  const clientMac = isAttackerPhase
    ? currentStepIndex >= 14 ? 'MAC: 00:50:56:C0:00:08 (SPOOFED)' : 'MAC: 00:0C:29:AA:BB:CC'
    : isRoguePhase
    ? 'MAC: 70:85:C2:11:22:33'
    : 'MAC: 00:50:56:C0:00:08';

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 10)">
        <rect
          x="0"
          y="0"
          width="680"
          height="22"
          rx="11"
          fill={isAttackerPhase ? '#fef2f2' : isRoguePhase ? '#fffbeb' : '#eff6ff'}
          stroke={isAttackerPhase ? '#fca5a5' : isRoguePhase ? '#fcd34d' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isAttackerPhase ? '#991b1b' : isRoguePhase ? '#b45309' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isAttackerPhase
            ? 'LIMITATION: ATTACKER SNIFFS CLEARTEXT MAC ➔ SPOOFS IN SOFTWARE ➔ BYPASSES WHITELIST ✕'
            : isRoguePhase
            ? 'ROGUE INTRUDER: SOURCE MAC NOT ON WHITELIST ➔ SWITCH DROPS FRAME (PORT SECURITY) ✕'
            : 'MAC FILTERING LAB: LAYER 2 SOURCE MAC WHITELIST VALIDATION & SPOOFING DEMO'}
        </text>
      </g>

      {/* Connection Cables */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="330" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {currentStepIndex === 6 && <BoldArrow x1="120" y1="75" x2="330" y2="75" color="#0284c7" label="SENDING ETH FRAME" />}
      {currentStepIndex === 8 && <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#10b981" label="WHITELIST PASS ➔ FORWARD" />}
      {currentStepIndex === 11 && <BoldArrow x1="120" y1="75" x2="330" y2="75" color="#ef4444" label="ROGUE FRAME" />}
      {currentStepIndex === 15 && <BoldArrow x1="120" y1="75" x2="330" y2="75" color="#f59e0b" label="SPOOFED FRAME" />}

      {/* Devices */}
      <LaptopNode
        cx={80}
        cy={75}
        label={clientLabel}
        ip={clientMac}
        active
        danger={isRoguePhase || isAttackerPhase}
        success={currentStepIndex >= 8 && currentStepIndex <= 9}
      />

      {showSwitch && (
        <g transform="translate(370, 75)">
          <rect x="-42" y="-28" width="84" height="44" rx="6" fill="#0f172a" stroke={currentStepIndex === 12 ? '#ef4444' : currentStepIndex >= 8 ? '#10b981' : '#0284c7'} strokeWidth={2} />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">SWITCH / AP</text>
          <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">PORT Gi0/1</text>
          <text x="0" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">MAC SECURITY GATE</text>
        </g>
      )}

      {showLan && (
        <ServerNodeSVG cx={650} cy={75} label="CORP LAN SERVER" sub="VLAN 10 (10.0.0.10)" active success={currentStepIndex === 9} />
      )}

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={packetY}
          label={packetLabel}
          sub={packetSub}
          color={packetColor}
          dropped={currentStepIndex === 12}
        />
      )}

      {/* Drop marker */}
      {currentStepIndex === 12 && (
        <g transform="translate(330, 75)">
          <line x1="-15" y1="-15" x2="15" y2="15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="15" y1="-15" x2="-15" y2="15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          LAYER 2 MAC FILTERING ENGINE: WHITELIST INSPECTION &amp; SECURITY ANALYSIS
        </text>

        {/* Left: Switch Port-Security Whitelist */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">SWITCH PORT-SECURITY ALLOWLIST:</text>

          <rect x="8" y="26" width="309" height="20" rx="3" fill="#ffffff" stroke="#e2e8f0" />
          <text x="14" y="39" fill="#64748b" fontSize="7" fontFamily="monospace">Port    Allowed MAC Address     Status     Action</text>

          <rect x="8" y="48" width="309" height="22" rx="3" fill={currentStepIndex >= 7 && currentStepIndex <= 9 || currentStepIndex >= 15 ? '#dcfce7' : '#ffffff'} stroke={currentStepIndex >= 7 && currentStepIndex <= 9 ? '#86efac' : '#e2e8f0'} />
          <text x="14" y="62" fill="#0f172a" fontSize="7.5" fontFamily="monospace">Gi0/1   00:50:56:C0:00:08      ACTIVE     PERMIT ✓</text>

          <rect x="8" y="72" width="309" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
          <text x="14" y="86" fill="#64748b" fontSize="7.5" fontFamily="monospace">Gi0/2   00:50:56:C0:00:09      STATIC     PERMIT ✓</text>

          <rect x="8" y="96" width="309" height="22" rx="3" fill={currentStepIndex === 12 ? '#fee2e2' : '#ffffff'} stroke={currentStepIndex === 12 ? '#fca5a5' : '#e2e8f0'} />
          <text x="14" y="110" fill={currentStepIndex === 12 ? '#991b1b' : '#64748b'} fontSize="7.5" fontFamily="monospace">Default Any Unknown MAC        UNLISTED   DROP ✕</text>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Port Violation Mode: <tspan fill="#0284c7" fontWeight="bold">Restrict / Drop frame</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Spoofing Breakdown */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">ETHERNET FRAME INSPECTION &amp; PROTOCOL ANALYSIS:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="34" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="7" fontFamily="monospace">[LAYER 2 ETHERNET II FRAME HEADER]</text>
            <text x="10" y="27" fill={isRoguePhase ? '#f87171' : isAttackerPhase ? '#fbbf24' : '#38bdf8'} fontSize="7.5" fontFamily="monospace">
              {isAttackerPhase
                ? 'Src MAC: 00:50:56:C0:00:08 (CLONED) ➔ Dst: SWITCH'
                : isRoguePhase
                ? 'Src MAC: 70:85:C2:11:22:33 (UNKNOWN) ➔ Dst: GATEWAY'
                : 'Src MAC: 00:50:56:C0:00:08 (AUTH) ➔ Dst: SERVER'}
            </text>
          </g>

          <g transform="translate(12, 64)">
            <rect x="0" y="0" width="306" height="68" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Key Takeaway &amp; Enterprise Standard:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              • MAC headers travel in unencrypted cleartext across Wi-Fi/LAN.
            </text>
            <text x="10" y="42" fill="#475569" fontSize="7.5">
              • Attackers change MAC in 1 sec: <tspan fill="#b91c1c" fontFamily="monospace">macchanger -m &lt;MAC&gt; eth0</tspan>
            </text>
            <text x="10" y="58" fill="#059669" fontSize="7.5" fontWeight="bold">
              ✔ Solution: IEEE 802.1X (EAP-TLS) PKI Certificate Auth.
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 15
            ? 'RESULT: MAC FILTER BYPASS DEMONSTRATED — 802.1X AUTHENTICATION MANDATORY'
            : currentStepIndex >= 12
            ? 'RESULT: ✕ UNREGISTERED MAC BLOCKED AT INGRESS PORT'
            : currentStepIndex >= 8
            ? 'RESULT: ✓ AUTHORIZED CLIENT PERMITTED TO ACCESS CORP LAN'
            : 'READY — ADVANCE STEP TO TRACE FRAME VALIDATION & SPOOFING VULNERABILITY'}
        </text>
      </g>
    </svg>
  );
};
