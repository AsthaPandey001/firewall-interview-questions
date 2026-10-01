import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q47ForwardVsReverseProxyVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const isPartBReverse = currentStepIndex >= 12;
  const showProxy = currentStepIndex >= 1;
  const showDestination = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'HTTP REQ';
  let packetSub = 'example.com';
  let packetColor = '#0284c7';

  if (currentStepIndex === 4 || currentStepIndex === 5) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'GET /index.html';
    packetSub = 'Src: 10.0.0.50 (Client)';
  } else if (currentStepIndex === 6 || currentStepIndex === 7) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'FORWARD PROXY MASK';
    packetSub = 'Src: 203.0.113.1 (Proxy IP)';
    packetColor = '#10b981';
  } else if (currentStepIndex === 8) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'PROXY ➔ WEB SERVER';
    packetSub = 'Client IP is Hidden';
    packetColor = '#10b981';
  } else if (currentStepIndex === 9 || currentStepIndex === 10) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'HTTP 200 OK RETURN';
    packetSub = 'Scanned &amp; Delivered';
    packetColor = '#10b981';
  } else if (currentStepIndex === 15 || currentStepIndex === 16) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'HTTPS REQUEST';
    packetSub = 'Dst: app.company.com';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 17 || currentStepIndex === 18) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'SSL TERMINATION &amp; LB';
    packetSub = 'Routing to Backend 2';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 19) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'INTERNAL FORWARD';
    packetSub = '➔ App Server 2 (10.1.0.12)';
    packetColor = '#10b981';
  } else if (currentStepIndex >= 20) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'REVERSE PROXY SERVED';
    packetSub = 'Encrypted Back to Client';
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
          fill={isPartBReverse ? '#f5f3ff' : '#eff6ff'}
          stroke={isPartBReverse ? '#c4b5fd' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPartBReverse ? '#6d28d9' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPartBReverse
            ? 'PART B: REVERSE PROXY — SITS IN FRONT OF WEB SERVERS (SSL OFFLOADING, LOAD BALANCING, WAF) ✓'
            : 'PART A: FORWARD PROXY — SITS IN FRONT OF CLIENTS (ANONYMITY, URL FILTERING, CACHING) ✓'}
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
      {(currentStepIndex === 5 || currentStepIndex === 16) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color={isPartBReverse ? '#8b5cf6' : '#0284c7'} label="CLIENT REQUEST" />
      )}
      {(currentStepIndex === 8 || currentStepIndex === 19) && (
        <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#10b981" label={isPartBReverse ? 'LOAD BALANCED' : 'MASKED FORWARD'} />
      )}

      {/* Client Device */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isPartBReverse ? 'INTERNET CLIENT' : 'INTERNAL CLIENT'}
        ip={isPartBReverse ? 'Public User (Anywhere)' : '10.0.0.50 (LAN Host)'}
        active
        success={currentStepIndex >= 9}
      />

      {/* Proxy Server */}
      {showProxy && (
        <g transform="translate(370, 75)">
          <rect
            x="-48"
            y="-30"
            width="96"
            height="46"
            rx="8"
            fill="#0f172a"
            stroke={isPartBReverse ? '#8b5cf6' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
            {isPartBReverse ? 'REVERSE PROXY' : 'FORWARD PROXY'}
          </text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isPartBReverse ? 'NGINX / HAProxy' : 'Squid / Zscaler'}
          </text>
          <text x="0" y="26" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#0f172a">
            {isPartBReverse ? 'SERVER SHIELD &amp; LB' : 'CLIENT GATEWAY'}
          </text>
        </g>
      )}

      {/* Target Destination */}
      {showDestination && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label={isPartBReverse ? 'BACKEND APP SERVERS' : 'INTERNET WEB SERVER'}
          sub={isPartBReverse ? 'Cluster (10.1.0.11/12)' : 'www.example.com (93.184.216.34)'}
          active
          success={currentStepIndex >= 9}
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
          FORWARD PROXY VS REVERSE PROXY: ARCHITECTURE, TOPOLOGY &amp; SECURITY ROLES
        </text>

        {/* Left: Role Breakdown */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            {isPartBReverse ? 'REVERSE PROXY (PROTECTS SERVERS):' : 'FORWARD PROXY (PROTECTS CLIENTS):'}
          </text>

          {!isPartBReverse ? (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace">Client 10.0.0.50 ➔ Forward Proxy 203.0.113.1 ➔ Web Server</text>

              <rect x="0" y="24" width="309" height="36" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="38" fill="#0f172a" fontSize="7.5" fontWeight="bold">Client Protection &amp; Anonymity:</text>
              <text x="10" y="52" fill="#475569" fontSize="7">• Destination website sees only Proxy IP (Client IP is concealed).</text>

              <rect x="0" y="64" width="309" height="36" rx="3" fill="#dcfce7" stroke="#86efac" />
              <text x="10" y="78" fill="#059669" fontSize="7.5" fontWeight="bold">Enterprise Content Control:</text>
              <text x="10" y="92" fill="#0f172a" fontSize="7">• Enforces corporate URL filtering, DLP, and malware caching.</text>
            </g>
          ) : (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#a78bfa" fontSize="7" fontFamily="monospace">Public Internet ➔ Reverse Proxy (VIP) ➔ Backend Node 1/2</text>

              <rect x="0" y="24" width="309" height="36" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="38" fill="#0f172a" fontSize="7.5" fontWeight="bold">Server Shielding &amp; SSL Offload:</text>
              <text x="10" y="52" fill="#475569" fontSize="7">• Backend IP addresses remain completely hidden from public internet.</text>

              <rect x="0" y="64" width="309" height="36" rx="3" fill="#f5f3ff" stroke="#c4b5fd" />
              <text x="10" y="78" fill="#6d28d9" fontSize="7.5" fontWeight="bold">Load Balancing &amp; Caching:</text>
              <text x="10" y="92" fill="#0f172a" fontSize="7">• Distributes traffic across redundant app servers (Round Robin / Least Conn).</text>
            </g>
          )}

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Deployment: <tspan fill={isPartBReverse ? '#6d28d9' : '#0284c7'} fontWeight="bold">{isPartBReverse ? 'In front of Internal Server Farm' : 'At Client Subnet Perimeter'}</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Summary */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">CORE INTERVIEW MNEMONIC &amp; COMPARISON:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">Forward Proxy (Protects the Client):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">"I know who the client is; the server does not."</text>
            <text x="10" y="39" fill="#0284c7" fontSize="7">Used by companies to filter outbound employee web surfing.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">Reverse Proxy (Protects the Server):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">"I know who the server is; the client does not."</text>
            <text x="10" y="39" fill="#6d28d9" fontSize="7">Used by websites (Cloudflare, NGINX) to handle incoming traffic.</text>
            <text x="10" y="50" fill="#059669" fontSize="7" fontWeight="bold">✔ Provides DDoS defense, SSL termination &amp; caching.</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 20
            ? 'RESULT: ✓ REVERSE PROXY LOAD BALANCED &amp; SERVED RESPONSE BACK TO PUBLIC CLIENT'
            : currentStepIndex >= 12
            ? 'PART B: REVERSE PROXY TERMINATING SSL &amp; LOAD BALANCING APP SERVERS'
            : currentStepIndex >= 9
            ? 'PART A: ✓ FORWARD PROXY MASKED CLIENT IP &amp; DELIVERED WEB RESPONSE'
            : 'READY — ADVANCE STEP TO TRACE FORWARD VS REVERSE PROXY SIMULATION'}
        </text>
      </g>
    </svg>
  );
};
