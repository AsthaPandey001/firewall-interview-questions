import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q43SplitTunnelingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const isPartBSplit = currentStepIndex >= 10;
  const showVpnGw = currentStepIndex >= 1;
  const showCorpServer = currentStepIndex >= 2;
  const showInternetDest = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'CORP TRAFFIC';
  let packetSub = '10.10.0.5';
  let packetColor = '#0284c7';

  if (currentStepIndex === 5 || currentStepIndex === 6) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'CORP ERP ➔ VPN';
    packetSub = '10.10.0.5 [Tunneled]';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'ERP SERVING';
    packetSub = 'Full Tunnel Active';
    packetColor = '#10b981';
  } else if (currentStepIndex === 8 || currentStepIndex === 9) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'YOUTUBE ➔ VPN ✕';
    packetSub = 'Full Tunnel Bottleneck';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 12 || currentStepIndex === 13) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'CORP ERP ➔ VPN';
    packetSub = 'Route: 10.10.0.0/16';
    packetColor = '#0284c7';
  } else if (currentStepIndex === 14) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'ERP SERVED ✓';
    packetSub = 'Secure Corporate Path';
    packetColor = '#10b981';
  } else if (currentStepIndex === 15 || currentStepIndex === 16) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'YOUTUBE DIRECT';
    packetSub = 'Route: 0.0.0.0/0 (Home ISP)';
    packetColor = '#10b981';
  } else if (currentStepIndex >= 17) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'DUAL PATH ACTIVE ✓';
    packetSub = 'Bandwidth Optimized';
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
          fill={isPartBSplit ? '#f0fdf4' : '#eff6ff'}
          stroke={isPartBSplit ? '#86efac' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPartBSplit ? '#15803d' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPartBSplit
            ? 'PART B: SPLIT TUNNELING — CORP TRAFFIC IN VPN, PUBLIC INTERNET OFFLOADED TO LOCAL ISP ✓'
            : 'PART A: FULL TUNNELING — 100% OF ENDPOINT TRAFFIC ROUTED THROUGH CORPORATE VPN GATEWAY'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          {/* Top route: VPN to Corp */}
          <line x1="120" y1="55" x2="330" y2="55" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="55" x2="610" y2="55" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,4" />

          {/* Bottom direct internet route */}
          {isPartBSplit && (
            <line x1="120" y1="95" x2="610" y2="95" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />
          )}
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 6 || currentStepIndex === 8 || currentStepIndex === 13) && (
        <BoldArrow x1="120" y1="55" x2="330" y2="55" color={currentStepIndex === 8 ? '#ef4444' : '#0284c7'} label={currentStepIndex === 8 ? 'VIDEO IN VPN ✕' : 'VPN TUNNEL'} />
      )}
      {(currentStepIndex === 15 || currentStepIndex === 16) && (
        <BoldArrow x1="120" y1="95" x2="610" y2="95" color="#10b981" label="DIRECT LOCAL ISP" />
      )}

      {/* Remote Teleworker */}
      <LaptopNode
        cx={80}
        cy={75}
        label="REMOTE WORKER"
        ip="192.168.1.100"
        active
        success={isPartBSplit}
      />

      {/* VPN Gateway */}
      {showVpnGw && (
        <g transform="translate(370, 55)">
          <rect
            x="-44"
            y="-22"
            width="88"
            height="38"
            rx="6"
            fill="#0f172a"
            stroke={currentStepIndex === 8 ? '#ef4444' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">CORP VPN GW</text>
          <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">203.0.113.1</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">
            {currentStepIndex === 8 ? 'CONGESTION ✕' : 'VPN CONCENTRATOR'}
          </text>
        </g>
      )}

      {/* Corporate ERP */}
      {showCorpServer && (
        <ServerNodeSVG
          cx={650}
          cy={55}
          label="CORP ERP SERVER"
          sub="10.10.0.5 (Confidential)"
          active
          success={currentStepIndex === 7 || currentStepIndex === 14}
        />
      )}

      {/* Public Streaming / Internet CDN */}
      {showInternetDest && (
        <ServerNodeSVG
          cx={650}
          cy={105}
          label="PUBLIC YOUTUBE / CDN"
          sub="Public Internet"
          active
          success={currentStepIndex >= 15}
        />
      )}

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={currentStepIndex >= 15 && currentStepIndex <= 16 ? 95 : 55}
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
          ENDPOINT ROUTING TABLE: FULL TUNNELING VS SPLIT TUNNELING POLICY
        </text>

        {/* Left: Client Routing Table */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">CLIENT KERNEL ROUTING TABLE:</text>

          {!isPartBSplit ? (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace">Destination       Gateway        Interface    Mode</text>

              <rect x="0" y="24" width="309" height="24" rx="3" fill="#fee2e2" stroke="#fca5a5" />
              <text x="10" y="40" fill="#991b1b" fontSize="7.5" fontFamily="monospace">0.0.0.0/0         10.10.0.1      tun0 (VPN)   FULL TUNNEL</text>

              <rect x="0" y="52" width="309" height="50" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="66" fill="#0f172a" fontSize="7.5" fontWeight="bold">Full Tunnel Effect:</text>
              <text x="10" y="80" fill="#475569" fontSize="7">• All Zoom, YouTube, and personal traffic enters Corporate VPN.</text>
              <text x="10" y="94" fill="#b91c1c" fontSize="7">• Severe corporate internet pipe saturation and high latency.</text>
            </g>
          ) : (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#4ade80" fontSize="7" fontFamily="monospace">Destination       Gateway        Interface    Path</text>

              <rect x="0" y="24" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
              <text x="10" y="38" fill="#059669" fontSize="7.5" fontFamily="monospace">10.10.0.0/16      10.10.0.1      tun0 (VPN)   SECURE CORP ✓</text>

              <rect x="0" y="48" width="309" height="22" rx="3" fill="#dbeafe" stroke="#93c5fd" />
              <text x="10" y="62" fill="#1e40af" fontSize="7.5" fontFamily="monospace">0.0.0.0/0         192.168.1.1    wlan0 (ISP)  LOCAL DIRECT ✓</text>

              <rect x="0" y="72" width="309" height="34" rx="3" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="10" y="86" fill="#0f172a" fontSize="7" fontWeight="bold">Split Tunneling Effect:</text>
              <text x="10" y="98" fill="#475569" fontSize="6.8">Saves 80%+ corporate VPN bandwidth. Streaming is direct &amp; fast.</text>
            </g>
          )}

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Active Mode: <tspan fill={isPartBSplit ? '#059669' : '#b91c1c'} fontWeight="bold">{isPartBSplit ? 'Split Tunneling (Selective Routing)' : 'Full Tunneling (Default Gateway Override)'}</tspan>
          </text>
        </g>

        {/* Right: Security & Trade-offs */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">SECURITY &amp; PERFORMANCE COMPARISON:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">Full Tunnel Security:</text>
            <text x="10" y="27" fill="#059669" fontSize="7">✔ Corporate NGFW inspects 100% of user traffic.</text>
            <text x="10" y="39" fill="#b91c1c" fontSize="7">✕ High bandwidth costs &amp; user streaming slowdowns.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">Split Tunnel Security:</text>
            <text x="10" y="27" fill="#059669" fontSize="7">✔ Maximum internet performance &amp; zero VPN bottlenecks.</text>
            <text x="10" y="39" fill="#b45309" fontSize="7">⚠ Endpoint direct internet exposure (Requires strong EDR/DNS agent).</text>
            <text x="10" y="50" fill="#0284c7" fontSize="7" fontWeight="bold">✔ Modern Best Practice: Split Tunnel + Cloud SASE / ZTNA.</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 17
            ? 'RESULT: ✓ SPLIT TUNNELING ACTIVE — CORPORATE DATA PROTECTED, INTERNET OFFLOADED'
            : currentStepIndex >= 10
            ? 'PART B: IMPLEMENTING SELECTIVE SPLIT ROUTING TABLE'
            : currentStepIndex >= 8
            ? 'PART A: FULL TUNNELING CREATES CORPORATE BANDWIDTH BOTTLENECK'
            : 'READY — ADVANCE STEP TO TRACE FULL VS SPLIT TUNNELING SIMULATION'}
        </text>
      </g>
    </svg>
  );
};
