import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q37PortScanVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;
  const isBlacklisted = currentStepIndex >= 14;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'TCP SYN';
  let packetSub = 'Port: 22';
  let packetColor = '#ef4444';

  if (currentStepIndex === 5) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'TCP SYN :22';
    packetSub = 'SSH Probe';
  } else if (currentStepIndex === 6) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'TCP SYN :22';
    packetSub = '➔ Firewall Ingress';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'INSPECTING :22';
    packetSub = 'Counter: 1 probe';
    packetColor = '#f59e0b';
  } else if (currentStepIndex === 8) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'TCP SYN :80';
    packetSub = 'HTTP Probe';
  } else if (currentStepIndex === 9) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'INSPECTING :80';
    packetSub = 'Counter: 2 probes';
    packetColor = '#f59e0b';
  } else if (currentStepIndex === 10) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'TCP SYN :443';
    packetSub = 'HTTPS Probe';
  } else if (currentStepIndex === 11) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'INSPECTING :443';
    packetSub = 'Counter: 3 probes';
    packetColor = '#f59e0b';
  } else if (currentStepIndex === 12) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'BURST SCAN :21,:23,:25';
    packetSub = 'Rapid Port Probing';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 13) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'THRESHOLD BREACH!';
    packetSub = '>10 syn/sec rate';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 16) {
    showPacket = true;
    packetX = 330;
    packetLabel = 'TCP SYN :3389';
    packetSub = 'AUTO-SHUN DROP ✕';
    packetColor = '#ef4444';
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
          fill={isBlacklisted ? '#fef2f2' : currentStepIndex >= 4 ? '#fffbeb' : '#eff6ff'}
          stroke={isBlacklisted ? '#fca5a5' : currentStepIndex >= 4 ? '#fcd34d' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isBlacklisted ? '#991b1b' : currentStepIndex >= 4 ? '#b45309' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isBlacklisted
            ? 'PORT SCAN DETECTED: FIREWALL AUTO-SHUN BLACKLIST ACTIVATED ➔ ATTACKER IP DROPPED ✕'
            : currentStepIndex >= 4
            ? 'RECONNAISSANCE SCAN IN PROGRESS: ATTACKER PROBING MULTIPLE TCP PORTS SEQUENTIALLY'
            : 'PORT SCAN DETECTION LAB: HEURISTIC RATE-BASED THREAT DETECTION & AUTO-SHUNNING'}
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
      {(currentStepIndex === 6 || currentStepIndex === 8 || currentStepIndex === 10 || currentStepIndex === 12) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color="#ef4444" label="SYN PROBE" />
      )}

      {/* Devices */}
      <LaptopNode
        cx={80}
        cy={75}
        label="ATTACKER (NMAP)"
        ip="198.51.100.50"
        active
        danger
      />

      {showFw && (
        <g transform="translate(370, 75)">
          <rect
            x="-42"
            y="-28"
            width="84"
            height="44"
            rx="6"
            fill="#0f172a"
            stroke={isBlacklisted ? '#ef4444' : currentStepIndex >= 7 ? '#f59e0b' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">FIREWALL / IPS</text>
          <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isBlacklisted ? 'SHUN ACTIVE' : 'SCAN WATCH'}
          </text>
          <text x="0" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">SECURITY GATEWAY</text>
        </g>
      )}

      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="TARGET WEB HOST"
          sub="10.0.0.80 (Protected)"
          active
          success={isBlacklisted}
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
          dropped={currentStepIndex === 16}
        />
      )}

      {/* Drop marker */}
      {currentStepIndex === 16 && (
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
          PORT SCAN DETECTION ENGINE: ANOMALY HEURISTICS &amp; AUTO-SHUN BLACKLIST
        </text>

        {/* Left: Port Scan Heuristic Counter Table */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">SRC IP CONNECTION RATE TRACKER:</text>

          <rect x="8" y="26" width="309" height="20" rx="3" fill="#ffffff" stroke="#e2e8f0" />
          <text x="14" y="39" fill="#64748b" fontSize="7" fontFamily="monospace">Source IP        Distinct Ports/s   Threshold   Threat Level</text>

          <rect
            x="8"
            y="48"
            width="309"
            height="22"
            rx="3"
            fill={isBlacklisted ? '#fee2e2' : currentStepIndex >= 7 ? '#fef3c7' : '#ffffff'}
            stroke={isBlacklisted ? '#fca5a5' : currentStepIndex >= 7 ? '#fde68a' : '#e2e8f0'}
          />
          <text x="14" y="62" fill="#0f172a" fontSize="7.5" fontFamily="monospace">
            198.51.100.50    {currentStepIndex >= 12 ? '42 ports/sec' : currentStepIndex >= 7 ? '3 ports/sec' : '0 ports/sec'}      10/sec      {isBlacklisted ? 'CRITICAL ✕' : currentStepIndex >= 7 ? 'SUSPICIOUS ⚠' : 'NORMAL'}
          </text>

          <rect x="8" y="72" width="309" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
          <text x="14" y="86" fill="#64748b" fontSize="7.5" fontFamily="monospace">192.168.1.100    1 port/min         10/sec      NORMAL ✓</text>

          <rect
            x="8"
            y="98"
            width="309"
            height="36"
            rx="3"
            fill={isBlacklisted ? '#fef2f2' : '#f1f5f9'}
            stroke={isBlacklisted ? '#ef4444' : '#cbd5e1'}
          />
          <text x="14" y="112" fill={isBlacklisted ? '#991b1b' : '#475569'} fontSize="7.5" fontWeight="bold">
            DYNAMIC AUTO-SHUN ACTION:
          </text>
          <text x="14" y="126" fill={isBlacklisted ? '#b91c1c' : '#64748b'} fontSize="7" fontFamily="monospace">
            {isBlacklisted
              ? 'iptables -I INPUT -s 198.51.100.50 -j DROP (Active: 3600s)'
              : 'Status: Monitoring thresholds (SYN Rate & Port Spread)'}
          </text>
        </g>

        {/* Right: Technical Inspector & Defense Mechanics */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">FIREWALL MITIGATION MECHANISMS:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="34" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="7" fontFamily="monospace">[IDS/IPS PORT SCAN DETECTION RULE]</text>
            <text x="10" y="27" fill={isBlacklisted ? '#f87171' : '#38bdf8'} fontSize="7.5" fontFamily="monospace">
              alert tcp any any -&gt; $HOME any (msg:&quot;SCAN SYN&quot;; threshold:type both, count 10, seconds 1;)
            </text>
          </g>

          <g transform="translate(12, 64)">
            <rect x="0" y="0" width="306" height="68" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Interview Takeaway &amp; Defense Techniques:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              • <tspan fontWeight="bold">Rate Limiting:</tspan> Limit new TCP SYNs per source IP.
            </text>
            <text x="10" y="42" fill="#475569" fontSize="7.5">
              • <tspan fontWeight="bold">Auto-Shunning / Fail2Ban:</tspan> Dynamically blacklist offensive IPs.
            </text>
            <text x="10" y="58" fill="#059669" fontSize="7.5" fontWeight="bold">
              • <tspan fontWeight="bold">Port Knocking / Honeypots:</tspan> Trap scanners on decoy ports.
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 16
            ? 'RESULT: ✓ SERVER PROTECTED — ATTACKER ISOLATED AND DROPPED BY FIREWALL AUTO-SHUN'
            : currentStepIndex >= 13
            ? 'ALERT: ⚠ PORT SCAN SIGNATURE DETECTED — TRIGGERING DYNAMIC BLACKLIST'
            : currentStepIndex >= 5
            ? 'ACTIVE: PROBING PORTS 22, 80, 443, 3389'
            : 'READY — ADVANCE STEP TO TRACE PORT SCAN AND AUTO-SHUN MITIGATION'}
        </text>
      </g>
    </svg>
  );
};
