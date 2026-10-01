import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q39DdosScrubbingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showScrubCenter = currentStepIndex >= 1;
  const showLegitUsers = currentStepIndex >= 2;
  const showBotnet = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isAttackPhase = currentStepIndex >= 8;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'HTTPS';
  let packetSub = 'Clean Request';
  let packetColor = '#0284c7';

  if (currentStepIndex === 5) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'HTTPS GET';
    packetSub = 'User ➔ Anycast PoP';
  } else if (currentStepIndex === 6) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'CLEAN FILTERED';
    packetSub = 'Passed to Tunnel';
    packetColor = '#10b981';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'ORIGIN SERVING';
    packetSub = 'HTTP 200 OK';
    packetColor = '#10b981';
  } else if (currentStepIndex === 8 || currentStepIndex === 9) {
    showPacket = true;
    packetX = 230;
    packetLabel = '500 Gbps FLOOD';
    packetSub = 'UDP / SYN Wave';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 10 || currentStepIndex === 11) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'DPI FILTERING';
    packetSub = 'BGP Flowspec Drop';
    packetColor = '#f59e0b';
  } else if (currentStepIndex === 12 || currentStepIndex === 13) {
    showPacket = true;
    packetX = 330;
    packetLabel = '99.9% ATTACK DROPPED';
    packetSub = 'Cloud Edge Scrubbed ✕';
    packetColor = '#ef4444';
  } else if (currentStepIndex >= 14 && currentStepIndex <= 17) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'CLEAN PIPE: 15 Mbps';
    packetSub = 'GRE Tunnel to Origin';
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
          fill={isAttackPhase ? '#fef2f2' : '#eff6ff'}
          stroke={isAttackPhase ? '#fca5a5' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isAttackPhase ? '#991b1b' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isAttackPhase
            ? 'DDOS ATTACK (500 Gbps) ABSORBED AT CLOUD ANYCAST EDGE ➔ CLEAN PIPE (15 Mbps) FORWARDED TO ORIGIN ✓'
            : 'DDOS SCRUBBING ARCHITECTURE: CLOUD ANYCAST INGESTION &amp; VOLUMETRIC ATTACK MITIGATION'}
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
      {(currentStepIndex === 5 || currentStepIndex === 8) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color={currentStepIndex === 8 ? '#ef4444' : '#0284c7'} label={currentStepIndex === 8 ? '500 Gbps ATTACK' : 'USER TRAFFIC'} />
      )}
      {(currentStepIndex === 6 || currentStepIndex >= 14) && (
        <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#10b981" label="CLEAN PIPE TUNNEL" />
      )}

      {/* Source Devices */}
      <g transform="translate(80, 75)">
        {showBotnet && isAttackPhase ? (
          <LaptopNode
            cx={0}
            cy={0}
            label="BOTNET (50,000 NODES)"
            ip="UDP Amplification &amp; SYN Flood"
            active
            danger
          />
        ) : showLegitUsers ? (
          <LaptopNode
            cx={0}
            cy={0}
            label="LEGITIMATE USERS"
            ip="Clean Web Browsing (HTTPS)"
            active
            success
          />
        ) : (
          <LaptopNode
            cx={0}
            cy={0}
            label="TRAFFIC CLIENTS"
            ip="Public Internet Hosts"
            active
          />
        )}
      </g>

      {/* Scrubbing Cloud PoP */}
      {showScrubCenter && (
        <g transform="translate(370, 75)">
          <rect
            x="-48"
            y="-30"
            width="96"
            height="46"
            rx="8"
            fill="#0f172a"
            stroke={isAttackPhase ? '#10b981' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">CLOUD SCRUBBING</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isAttackPhase ? 'SCRUBBING 99.9%' : 'ANYCAST POP'}
          </text>
          <text x="0" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">CLOUDFLARE / AKAMAI</text>
        </g>
      )}

      {/* Origin Server */}
      <ServerNodeSVG
        cx={650}
        cy={75}
        label="ORIGIN DATA CENTER"
        sub="CPU: 12% | Bandwidth: 15 Mbps"
        active
        success
      />

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={packetY}
          label={packetLabel}
          sub={packetSub}
          color={packetColor}
          dropped={currentStepIndex === 12 || currentStepIndex === 13}
        />
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          DDoS CLOUD MITIGATION TELEMETRY &amp; BANDWIDTH SCRUBBING METRICS
        </text>

        {/* Left: Volumetric Traffic Analysis */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">ANYCAST SCRUBBING POP TRAFFIC SPLIT:</text>

          <g transform="translate(8, 26)">
            {/* Ingress Bar */}
            <rect x="0" y="0" width="309" height="26" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <rect x="0" y="0" width={isAttackPhase ? '309' : '40'} height="26" rx="4" fill={isAttackPhase ? '#fee2e2' : '#dcfce7'} />
            <text x="10" y="17" fill="#0f172a" fontSize="7.5" fontWeight="bold">
              INGRESS FLOOD: <tspan fill={isAttackPhase ? '#b91c1c' : '#059669'}>{isAttackPhase ? '512.4 Gbps (50k IPs)' : '15.2 Mbps (Normal)'}</tspan>
            </text>

            {/* Dropped Bar */}
            <rect x="0" y="32" width="309" height="26" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <rect x="0" y="32" width={isAttackPhase ? '300' : '0'} height="26" rx="4" fill="#fecaca" />
            <text x="10" y="49" fill="#0f172a" fontSize="7.5" fontWeight="bold">
              ATTACK SCRUBBED: <tspan fill="#b91c1c">{isAttackPhase ? '512.38 Gbps (99.99% DROPPED ✕)' : '0 Gbps'}</tspan>
            </text>

            {/* Clean Egress */}
            <rect x="0" y="64" width="309" height="26" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <rect x="0" y="64" width="60" height="26" rx="4" fill="#bbf7d0" />
            <text x="10" y="81" fill="#0f172a" fontSize="7.5" fontWeight="bold">
              CLEAN PIPE TO ORIGIN: <tspan fill="#059669">15.0 Mbps (GRE Tunnel ✓)</tspan>
            </text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Origin Status: <tspan fill="#059669" fontWeight="bold">100% Uptime | Zero Degradation</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Mitigation Stack */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">MULTI-LAYER CLOUD DEFENSE STACK:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="34" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="7" fontFamily="monospace">[BGP FLOWSPEC AUTOMATED MITIGATION RULE]</text>
            <text x="10" y="27" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">
              match udp dest-port 53,123 rate-limit 0 (Drop Amplification)
            </text>
          </g>

          <g transform="translate(12, 64)">
            <rect x="0" y="0" width="306" height="68" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Key Architectural Concepts:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              • <tspan fontWeight="bold">BGP Anycast Routing:</tspan> Distributes flood across 300+ global PoPs.
            </text>
            <text x="10" y="42" fill="#475569" fontSize="7.5">
              • <tspan fontWeight="bold">DPI &amp; Heuristics:</tspan> Drops malformed, UDP reflection &amp; SYN packets.
            </text>
            <text x="10" y="58" fill="#059669" fontSize="7.5" fontWeight="bold">
              • <tspan fontWeight="bold">Clean-Pipe Tunnel:</tspan> Encapsulates only valid HTTP/S traffic to origin.
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 14
            ? 'RESULT: ✓ ORIGIN SAFE — 500 Gbps FLOOD SCRUBBED AT PERIMETER, CLEAN TRAFFIC DELIVERED'
            : currentStepIndex >= 8
            ? 'CRITICAL: VOLUMETRIC ATTACK WAVE INGESTED BY ANYCAST SCRUBBING POP'
            : currentStepIndex >= 5
            ? 'NORMAL: LEGITIMATE USERS BROWSING ORIGIN THROUGH CLOUD ANYCAST'
            : 'READY — ADVANCE STEP TO TRACE DDOS INGESTION, SCRUBBING & CLEAN PIPE TRANSIT'}
        </text>
      </g>
    </svg>
  );
};
