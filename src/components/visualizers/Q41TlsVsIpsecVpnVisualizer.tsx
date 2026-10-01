import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q41TlsVsIpsecVpnVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const isPartBIpsec = currentStepIndex >= 10;
  const showGateway = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'TLS 1.3';
  let packetSub = 'Port: 443';
  let packetColor = '#0284c7';

  if (currentStepIndex === 4 || currentStepIndex === 5) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'HTTPS BROWSER';
    packetSub = 'GET /vpn-portal:443';
  } else if (currentStepIndex === 6) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'TLS 1.3 SESSION';
    packetSub = '➔ TLS VPN Gateway';
    packetColor = '#0284c7';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'L7 REVERSE PROXY';
    packetSub = '➔ Web App (10.0.0.5)';
    packetColor = '#10b981';
  } else if (currentStepIndex === 8) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'WEB APP SERVING';
    packetSub = 'HTTP 200 OK Return';
    packetColor = '#10b981';
  } else if (currentStepIndex === 14) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'RAW IP PACKET';
    packetSub = 'VoIP / RDP / ICMP';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 15 || currentStepIndex === 16) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'IPSEC ESP TUNNEL';
    packetSub = 'Proto 50 [Encrypted]';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 17 || currentStepIndex === 18) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'ESP DECAPSULATED';
    packetSub = '➔ HQ Server (10.2.0.10)';
    packetColor = '#10b981';
  } else if (currentStepIndex >= 19) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'FULL L3 LINK ✓';
    packetSub = 'Site-to-Site Active';
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
          fill={isPartBIpsec ? '#f5f3ff' : '#eff6ff'}
          stroke={isPartBIpsec ? '#c4b5fd' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPartBIpsec ? '#6d28d9' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPartBIpsec
            ? 'PART B: IPSEC VPN (LAYER 3) — FULL NETWORK-TO-NETWORK EXTENSION VIA ENCRYPTED ESP TUNNEL ✓'
            : 'PART A: TLS/SSL VPN (LAYER 7) — CLIENTLESS BROWSER-BASED APPLICATION PROXY (PORT 443) ✓'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="330" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 6 || currentStepIndex === 16) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color={isPartBIpsec ? '#8b5cf6' : '#0284c7'} label={isPartBIpsec ? 'ESP ENCAPSULATED' : 'TLS 1.3 TUNNEL'} />
      )}
      {(currentStepIndex === 7 || currentStepIndex === 18) && (
        <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#10b981" label={isPartBIpsec ? 'L3 ROUTING' : 'L7 PROXY FORWARD'} />
      )}

      {/* Source Device */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isPartBIpsec ? 'BRANCH ROUTER' : 'REMOTE USER'}
        ip={isPartBIpsec ? 'Site A (10.1.0.0/24)' : 'Web Browser (Clientless)'}
        active
        success={currentStepIndex >= 8}
      />

      {/* Gateway */}
      {showGateway && (
        <g transform="translate(370, 75)">
          <rect
            x="-48"
            y="-30"
            width="96"
            height="46"
            rx="8"
            fill="#0f172a"
            stroke={isPartBIpsec ? '#8b5cf6' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">VPN GATEWAY</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isPartBIpsec ? 'IPsec ESP (L3)' : 'TLS 1.3 / L7'}
          </text>
          <text x="0" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">SECURITY CONCENTRATOR</text>
        </g>
      )}

      {/* Internal Destination */}
      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label={isPartBIpsec ? 'HQ DATA CENTER' : 'INTERNAL WEB APP'}
          sub={isPartBIpsec ? '10.2.0.10 (Entire Subnet)' : 'https://portal.corp (10.0.0.5)'}
          active
          success={currentStepIndex >= 8}
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
          VPN ARCHITECTURE MATRIX: TLS/SSL VPN (L7) VS IPSEC VPN (L3) COMPARISON
        </text>

        {/* Left: Protocol Stack Breakdown */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            {isPartBIpsec ? 'IPSEC LAYER 3 ENCAPSULATION HEADER:' : 'TLS/SSL LAYER 7 HANDSHAKE STACK:'}
          </text>

          {!isPartBIpsec ? (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace">[L4 TCP :443] ➔ [TLS 1.3 RECORD] ➔ [L7 HTTP PAYLOAD]</text>

              <rect x="0" y="24" width="309" height="36" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="38" fill="#0f172a" fontSize="7.5" fontWeight="bold">TLS/SSL Characteristics:</text>
              <text x="10" y="52" fill="#475569" fontSize="7">• Clientless: Works in standard Chrome/Edge/Firefox browser.</text>

              <rect x="0" y="64" width="309" height="36" rx="3" fill="#dcfce7" stroke="#86efac" />
              <text x="10" y="78" fill="#059669" fontSize="7.5" fontWeight="bold">Granular Access Control:</text>
              <text x="10" y="92" fill="#0f172a" fontSize="7">• User only accesses specific web applications, not entire subnet.</text>
            </g>
          ) : (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#a78bfa" fontSize="7" fontFamily="monospace">[NEW IP HDR] ➔ [ESP HDR 50] ➔ [ORIGINAL IP PKT] ➔ [ESP AUTH]</text>

              <rect x="0" y="24" width="309" height="36" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="38" fill="#0f172a" fontSize="7.5" fontWeight="bold">IPsec Characteristics:</text>
              <text x="10" y="52" fill="#475569" fontSize="7">• Layer 3 Network Extension: Supports all protocols (VoIP, RDP, ICMP).</text>

              <rect x="0" y="64" width="309" height="36" rx="3" fill="#f5f3ff" stroke="#c4b5fd" />
              <text x="10" y="78" fill="#6d28d9" fontSize="7.5" fontWeight="bold">Tunnel Topology:</text>
              <text x="10" y="92" fill="#0f172a" fontSize="7">• Site-to-Site (Branch ↔ HQ) or Client-to-Site (AnyConnect agent).</text>
            </g>
          )}

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Transport Mode: <tspan fill={isPartBIpsec ? '#6d28d9' : '#0284c7'} fontWeight="bold">{isPartBIpsec ? 'IP Protocol 50 (ESP) Encapsulation' : 'Standard TCP Port 443'}</tspan>
          </text>
        </g>

        {/* Right: Feature Matrix */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">FEATURE &amp; USE-CASE COMPARISON:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">TLS/SSL VPN (Layer 7):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">✔ Zero client install, easy firewall traversal (port 443).</text>
            <text x="10" y="39" fill="#b91c1c" fontSize="7">✕ Limited to web/TCP apps; poor performance for UDP/VoIP.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">IPsec VPN (Layer 3):</text>
            <text x="10" y="27" fill="#059669" fontSize="7">✔ Full network transparent routing, high performance encryption.</text>
            <text x="10" y="39" fill="#475569" fontSize="7">⚠ Requires client software or dedicated site-to-site hardware.</text>
            <text x="10" y="50" fill="#6d28d9" fontSize="7" fontWeight="bold">✔ Gold standard for Branch Office interconnects.</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 19
            ? 'RESULT: ✓ IPSEC L3 TUNNEL OPERATIONAL — ENTIRE BRANCH SUBNET ROUTED TO HQ'
            : currentStepIndex >= 10
            ? 'PART B: ESTABLISHING IPSEC SITE-TO-SITE LAYER 3 ESP TUNNEL'
            : currentStepIndex >= 8
            ? 'PART A: ✓ TLS/SSL VPN L7 ACCESS COMPLETE VIA HTTPS PORT 443'
            : 'READY — ADVANCE STEP TO TRACE TLS/SSL VS IPSEC VPN SIMULATION'}
        </text>
      </g>
    </svg>
  );
};
