import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, RouterNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q32ArpSpoofingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // SCENARIO 1: ARP CACHE POISONING ATTACK (Steps 0-9)
  // Step 0: Victim Client appears (192.168.1.50)
  // Step 1: Default Gateway appears (192.168.1.1 / MAC 00:11:22)
  // Step 2: Attacker machine appears on same LAN
  // Step 3: Cables drawn
  // Step 4: Attacker transmits forged gratuitous ARP (192.168.1.1 is at ATTACKER_MAC 66:66:66)
  // Step 5: Forged ARP reaches Victim Client
  // Step 6: Victim Client accepts forged ARP: ARP table POISONED (192.168.1.1 -> 66:66:66)
  // Step 7: Victim Client generates outbound banking packet
  // Step 8: Packet hijacked: Routes physically to ATTACKER instead of Gateway
  // Step 9: Attacker sniffs & logs credentials (MITM ACTIVE ✕) - STOP
  //
  // SCENARIO 2: PREVENTION VIA DYNAMIC ARP INSPECTION (DAI) (Steps 10-15)
  // Step 10: DAI & DHCP Snooping enabled on managed switch
  // Step 11: Attacker attempts to send next forged ARP packet
  // Step 12: Switch intercepts ARP frame on untrusted port
  // Step 13: Switch validates frame against DHCP Snooping Binding Database: MISMATCH!
  // Step 14: Switch DROPS forged ARP frame and err-disables attacker port (ATTACK BLOCKED ✓)
  // Step 15: Clean traffic resumes directly to legitimate Default Gateway ✓

  const isDaiPhase = currentStepIndex >= 10;

  const showGateway = currentStepIndex >= 1;
  const showAttacker = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isPoisoned = currentStepIndex >= 6 && currentStepIndex <= 9;
  const isDaiBlocked = currentStepIndex >= 14;

  let packetX = 80;
  let packetY = 75;

  if (!isDaiPhase) {
    if (currentStepIndex === 4) { packetX = 370; packetY = 220; }
    else if (currentStepIndex === 5) { packetX = 180; packetY = 140; }
    else if (currentStepIndex === 7) { packetX = 80; packetY = 75; }
    else if (currentStepIndex >= 8) { packetX = 370; packetY = 220; }
  } else {
    if (currentStepIndex === 11) { packetX = 370; packetY = 220; }
    else if (currentStepIndex >= 12 && currentStepIndex <= 14) { packetX = 370; packetY = 120; }
    else if (currentStepIndex >= 15) { packetX = 660; packetY = 75; }
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <>
          <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="80" y1="75" x2="370" y2="220" stroke="#fca5a5" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="370" y1="220" x2="660" y2="75" stroke="#fca5a5" strokeWidth="2" strokeDasharray="3 3" />
        </>
      )}

      {/* Movement Arrows */}
      {!isDaiPhase && currentStepIndex === 5 && (
        <BoldArrow x1={330} y1={200} x2={120} y2={100} color="#ef4444" label="FORGED GRATUITOUS ARP →" />
      )}
      {!isDaiPhase && currentStepIndex === 8 && (
        <BoldArrow x1={120} y1={100} x2={330} y2={200} color="#ef4444" label="HIJACKED TRAFFIC →" />
      )}
      {isDaiPhase && currentStepIndex === 15 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#10b981" label="CLEAN PATH TO GATEWAY →" />
      )}

      {/* Nodes */}
      {/* 1. Victim Client */}
      <LaptopNode
        cx={80}
        cy={75}
        label="VICTIM CLIENT"
        ip="192.168.1.50"
        active={currentStepIndex <= 5 || currentStepIndex === 7 || isDaiBlocked}
        statusText={isPoisoned ? 'CACHE POISONED ✕' : undefined}
      />

      {/* 2. Default Gateway */}
      {showGateway && (
        <RouterNodeSVG
          cx={660}
          cy={75}
          label="DEFAULT GATEWAY"
          sub="192.168.1.1 (MAC 00:11:22)"
          active={currentStepIndex >= 15}
        />
      )}

      {/* 3. Attacker Node */}
      {showAttacker && (
        <g transform="translate(370, 220)">
          <rect x="-40" y="-20" width="80" height="40" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="-3" textAnchor="middle" fill="#fee2e2" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ATTACKER
          </text>
          <text x="0" y="10" textAnchor="middle" fill="#fca5a5" fontSize="6.5" fontFamily="monospace">
            MAC: 66:66:66
          </text>
        </g>
      )}

      {/* Packet Card */}
      {((!isDaiPhase && (currentStepIndex === 4 || currentStepIndex === 5 || currentStepIndex >= 7)) ||
        (isDaiPhase && currentStepIndex >= 11)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={packetY - 45}
            title={
              !isDaiPhase
                ? currentStepIndex <= 5
                  ? 'SPOOFED ARP'
                  : 'HIJACKED DATA'
                : isDaiBlocked
                ? 'DAI DROPPED ✕'
                : 'FORGED ARP'
            }
            protocol={!isDaiPhase && currentStepIndex >= 7 ? 'HTTPS' : 'ARP'}
            port={!isDaiPhase && currentStepIndex >= 7 ? '443' : 'Layer 2'}
            src={!isDaiPhase && currentStepIndex >= 7 ? '192.168.1.50' : '192.168.1.1 (Forged)'}
            dst={!isDaiPhase && currentStepIndex >= 7 ? 'Attacker (66:66)' : '192.168.1.50'}
            status={!isDaiPhase ? 'DENY' : isDaiBlocked ? 'DENY' : 'INSPECT'}
            scale={0.76}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isDaiPhase
            ? 'MITIGATION: DYNAMIC ARP INSPECTION (DAI) & DHCP SNOOPING'
            : 'ARP SPOOFING / POISONING ATTACK (MAN-IN-THE-MIDDLE HIJACKING)'}
        </text>

        {!isDaiPhase ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#fef2f2" stroke="#f87171" />
            <text x="12" y="18" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              POISONED ARP CACHE ON VICTIM HOST:
            </text>
            <g transform="translate(10, 24)">
              <rect x="0" y="0" width="648" height="30" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="10" y="19" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                POISONED ENTRY: 192.168.1.1 (Gateway) → ATTACKER MAC (66:66:66:66) ✕
              </text>
            </g>
            <text x="12" y="78" fill="#0f172a" fontSize="7.5">
              • Result: Victim sends all gateway traffic to the attacker. Attacker sniffs passwords and forwards traffic.
            </text>
            <text x="12" y="96" fill="#dc2626" fontSize="7.5" fontWeight="bold">
              • Attack Impact: Complete confidentiality breach, session hijacking, and DNS spoofing capability.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f0fdf4" stroke="#86efac" />
            <text x="12" y="18" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              HOW DYNAMIC ARP INSPECTION (DAI) PREVENTS SPOOFING:
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Edge switch builds a trusted DHCP Snooping database binding valid IP + MAC + Switchport.
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. Switch intercepts ARP replies on untrusted user ports and compares against binding database.
            </text>
            <text x="14" y="74" fill="#15803d" fontSize="8" fontWeight="bold" fontFamily="monospace">
              3. ACTION: Mismatched ARP reply is DROPPED at switchport (Attacker port disabled) ✓.
            </text>
            <text x="14" y="98" fill="#15803d" fontSize="7.5" fontWeight="bold">
              SUMMARY: DAI + DHCP Snooping provides complete Layer 2 enterprise immunity against ARP poisoning.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
