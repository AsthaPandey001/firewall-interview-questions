import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q42VpnTunnelSetupVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showInternet = currentStepIndex >= 1;
  const showGwB = currentStepIndex >= 2;
  const showHosts = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isPhase1Done = currentStepIndex >= 9;
  const isPhase2Done = currentStepIndex >= 13;
  const isDataPlane = currentStepIndex >= 14;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'IKE MSG';
  let packetSub = 'UDP 500';
  let packetColor = '#0284c7';

  if (currentStepIndex === 6) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'IKE P1: PROPOSALS';
    packetSub = 'AES-256 DH-14';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'DH KEY EXCHANGE';
    packetSub = 'Public Keys Traded';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 8) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'PSK AUTHENTICATION';
    packetSub = 'Identity Validated';
    packetColor = '#10b981';
  } else if (currentStepIndex === 11 || currentStepIndex === 12) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'IKE P2: IPSEC SAs';
    packetSub = 'ESP SPI Exchange';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 14) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'PLAINTEXT IP';
    packetSub = '10.1.0.5 ➔ 10.2.0.10';
  } else if (currentStepIndex === 15 || currentStepIndex === 16) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'ESP PROTO 50';
    packetSub = 'AES-GCM-256 [Encrypted]';
    packetColor = '#10b981';
  } else if (currentStepIndex === 17 || currentStepIndex === 18) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'DECRYPTED IP PKT';
    packetSub = 'Delivered to Site B Host';
    packetColor = '#10b981';
  } else if (currentStepIndex === 20) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'ESP REPLY TUNNEL';
    packetSub = '10.2.0.10 ➔ 10.1.0.5';
    packetColor = '#10b981';
  } else if (currentStepIndex >= 21) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'REPLY RECEIVED ✓';
    packetSub = 'Round-Trip Complete';
    packetColor = '#10b981';
  }

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
          fill={isDataPlane ? '#f0fdf4' : isPhase2Done ? '#f5f3ff' : '#eff6ff'}
          stroke={isDataPlane ? '#86efac' : isPhase2Done ? '#c4b5fd' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isDataPlane ? '#15803d' : isPhase2Done ? '#6d28d9' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isDataPlane
            ? 'DATA PLANE ACTIVE: ENCRYPTED ESP (PROTO 50) PACKETS TRANSITING SECURE IPSEC TUNNEL ✓'
            : isPhase2Done
            ? 'IKE PHASE 2 COMPLETE: IPSEC SAs INSTALLED ➔ READY FOR ENCRYPTED TRAFFIC'
            : isPhase1Done
            ? 'IKE PHASE 1 COMPLETE: ISAKMP SA ESTABLISHED ➔ SECURE CONTROL CHANNEL ACTIVE'
            : 'IPSEC VPN TUNNEL ESTABLISHMENT: IKE PHASE 1 (ISAKMP) &amp; IKE PHASE 2 (QUICK MODE)'}
        </text>
      </g>

      {/* Network Cables / Tunnel Pipeline */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="230" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="510" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          {/* Internet Tunnel Pipe */}
          <rect
            x="240"
            y="67"
            width="260"
            height="16"
            rx="8"
            fill={isDataPlane ? '#dcfce7' : isPhase1Done ? '#f3e8ff' : '#f1f5f9'}
            stroke={isDataPlane ? '#10b981' : isPhase1Done ? '#8b5cf6' : '#cbd5e1'}
            strokeWidth={1.5}
          />
          <text x="370" y="78" textAnchor="middle" fill={isDataPlane ? '#15803d' : '#64748b'} fontSize="7" fontWeight="bold">
            {isDataPlane ? '🔒 IPSEC ESP TUNNEL ACTIVE' : isPhase1Done ? '🔒 ISAKMP SA (CONTROL CHANNEL)' : 'PUBLIC INTERNET WAN'}
          </text>
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 6 || currentStepIndex === 16) && (
        <BoldArrow x1="230" y1="75" x2="510" y2="75" color={isDataPlane ? '#10b981' : '#0284c7'} label={isDataPlane ? 'ESP PACKET' : 'IKE MSG'} />
      )}
      {currentStepIndex === 20 && (
        <BoldArrow x1="510" y1="75" x2="230" y2="75" color="#10b981" label="ESP REPLY" />
      )}

      {/* Site A Host */}
      {showHosts && (
        <LaptopNode
          cx={80}
          cy={75}
          label="SITE A HOST"
          ip="10.1.0.5"
          active
          success={isDataPlane}
        />
      )}

      {/* Gateway A (Initiator) */}
      <g transform="translate(210, 75)">
        <rect
          x="-35"
          y="-25"
          width="70"
          height="40"
          rx="6"
          fill="#0f172a"
          stroke={isDataPlane ? '#10b981' : isPhase1Done ? '#8b5cf6' : '#0284c7'}
          strokeWidth={2}
        />
        <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">GATEWAY A</text>
        <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">203.0.113.1</text>
        <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">INITIATOR</text>
      </g>

      {/* Gateway B (Responder) */}
      {showGwB && (
        <g transform="translate(530, 75)">
          <rect
            x="-35"
            y="-25"
            width="70"
            height="40"
            rx="6"
            fill="#0f172a"
            stroke={isDataPlane ? '#10b981' : isPhase1Done ? '#8b5cf6' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">GATEWAY B</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">198.51.100.1</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">RESPONDER</text>
        </g>
      )}

      {/* Site B Host */}
      {showHosts && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="SITE B SERVER"
          sub="10.2.0.10"
          active
          success={isDataPlane}
        />
      )}

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={packetY}
          label={packetLabel}
          sub={packetSub}
          color={packetColor}
        />
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          IKE NEGOTIATION STATE MACHINE &amp; SECURITY ASSOCIATION (SA) DATABASE
        </text>

        {/* Left: IKE Phases Breakdown */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">IKE PROTOCOL STATE MACHINE:</text>

          <g transform="translate(8, 24)">
            {/* Phase 1 Box */}
            <rect x="0" y="0" width="309" height="48" rx="4" fill={isPhase1Done ? '#f5f3ff' : '#ffffff'} stroke={isPhase1Done ? '#8b5cf6' : '#cbd5e1'} />
            <text x="10" y="14" fill={isPhase1Done ? '#6d28d9' : '#0f172a'} fontSize="7.5" fontWeight="bold">
              IKE PHASE 1: ISAKMP SA (UDP 500) {isPhase1Done ? '✔ ESTABLISHED' : '⏳ NEGOTIATING'}
            </text>
            <text x="10" y="27" fill="#475569" fontSize="7">• Cipher: AES-256-CBC | Hash: SHA-256 | DH Group: 14 (2048-bit)</text>
            <text x="10" y="39" fill="#475569" fontSize="7">• Authentication: Pre-Shared Key (PSK) / X.509 PKI Certificate</text>

            {/* Phase 2 Box */}
            <rect x="0" y="54" width="309" height="52" rx="4" fill={isPhase2Done ? '#dcfce7' : '#ffffff'} stroke={isPhase2Done ? '#10b981' : '#cbd5e1'} />
            <text x="10" y="14" fill={isPhase2Done ? '#059669' : '#0f172a'} fontSize="7.5" fontWeight="bold">
              IKE PHASE 2: IPSEC SAs (QUICK MODE) {isPhase2Done ? '✔ INSTALLED' : '⏳ PENDING'}
            </text>
            <text x="10" y="27" fill="#475569" fontSize="7">• Protocol: ESP (Proto 50) | Transform: AES-GCM-256 | Lifetime: 3600s</text>
            <text x="10" y="39" fill="#475569" fontSize="7">• Proxy IDs: 10.1.0.0/24 ⇄ 10.2.0.0/24 | In/Out SPI: 0x7A1F4C9B</text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Tunnel State: <tspan fill={isDataPlane ? '#059669' : '#6d28d9'} fontWeight="bold">{isDataPlane ? 'Bi-Directional Traffic Active (ESP)' : 'Control Channel Negotiated'}</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Packet Structure */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">ESP PACKET ENCAPSULATION &amp; CRYPTO STACK:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="34" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="7" fontFamily="monospace">[IPSEC TUNNEL MODE PACKET FORMAT]</text>
            <text x="10" y="27" fill={isDataPlane ? '#4ade80' : '#38bdf8'} fontSize="7.5" fontFamily="monospace">
              [Outer IP: 203.0.113.1]➔[ESP Hdr: SPI]➔[Encrypted Inner IP: 10.1.0.5]➔[ESP Auth]
            </text>
          </g>

          <g transform="translate(12, 64)">
            <rect x="0" y="0" width="306" height="68" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Key Interview Concepts:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              1. <tspan fontWeight="bold">Phase 1:</tspan> Authenticates peers and creates secure control channel.
            </text>
            <text x="10" y="42" fill="#475569" fontSize="7.5">
              2. <tspan fontWeight="bold">Phase 2:</tspan> Negotiates unidirectional IPsec SAs for user payload.
            </text>
            <text x="10" y="58" fill="#059669" fontSize="7.5" fontWeight="bold">
              3. <tspan fontWeight="bold">Tunnel Mode:</tspan> Encrypts entire original IP packet + inner header.
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 21
            ? 'RESULT: ✓ SITE-TO-SITE IPSEC TUNNEL FULLY OPERATIONAL — ENCRYPTED TRANSIT VERIFIED'
            : currentStepIndex >= 14
            ? 'DATA PLANE: TRANSMITTING ENCRYPTED ESP PACKET ACROSS PUBLIC INTERNET'
            : currentStepIndex >= 9
            ? 'IKE PHASE 2: NEGOTIATING IPSEC SAs &amp; TRAFFIC SELECTORS'
            : currentStepIndex >= 5
            ? 'IKE PHASE 1: DH KEY EXCHANGE &amp; PEER AUTHENTICATION'
            : 'READY — ADVANCE STEP TO TRACE IKE PHASE 1 &amp; PHASE 2 TUNNEL SETUP'}
        </text>
      </g>
    </svg>
  );
};
