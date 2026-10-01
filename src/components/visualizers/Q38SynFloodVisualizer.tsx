import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q38SynFloodVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isAttackPhase = currentStepIndex >= 7 && currentStepIndex <= 11;
  const isSynCookiePhase = currentStepIndex >= 12;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'TCP SYN';
  let packetSub = 'Seq=1000';
  let packetColor = '#0284c7';

  if (currentStepIndex === 4) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'TCP SYN';
    packetSub = 'Seq=1000 (Norm Client)';
  } else if (currentStepIndex === 5) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'SYN-ACK RETURN';
    packetSub = 'Seq=5000 Ack=1001';
    packetColor = '#10b981';
  } else if (currentStepIndex === 6) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'ESTABLISHED ✓';
    packetSub = 'Handshake Complete';
    packetColor = '#10b981';
  } else if (currentStepIndex === 8 || currentStepIndex === 9) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'SYN FLOOD (SPOOFED)';
    packetSub = 'Millions of fake IPs';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 10) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'QUEUE 100% FULL';
    packetSub = 'RAM Exhaustion (DoS)';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 11) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'LEGIT CLIENT DROPPED';
    packetSub = 'No Queue Slots Left ✕';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 14 || currentStepIndex === 15) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'SYN COOKIE ISN';
    packetSub = 'Crypto Stateless Hash';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 16 || currentStepIndex === 17) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'ACK + COOKIE MATCH ✓';
    packetSub = 'Stateless Handshake OK';
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
          fill={isSynCookiePhase ? '#f5f3ff' : isAttackPhase ? '#fef2f2' : '#eff6ff'}
          stroke={isSynCookiePhase ? '#c4b5fd' : isAttackPhase ? '#fca5a5' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isSynCookiePhase ? '#6d28d9' : isAttackPhase ? '#991b1b' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isSynCookiePhase
            ? 'SYN COOKIE DEFENSE ACTIVE: STATELESS CRYPTOGRAPHIC ISN ENCODING ➔ TCB MEMORY PROTECTED ✓'
            : isAttackPhase
            ? 'SYN FLOOD ATTACK: SPOOFED HALF-OPEN CONNECTIONS FILL SYN BACKLOG QUEUE (DoS) ✕'
            : 'TCP 3-WAY HANDSHAKE & SYN FLOOD MITIGATION LAB'}
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
      {(currentStepIndex === 4 || currentStepIndex === 8 || currentStepIndex === 16) && (
        <BoldArrow x1="120" y1="75" x2="610" y2="75" color={currentStepIndex === 8 ? '#ef4444' : '#0284c7'} label={currentStepIndex === 8 ? 'SYN FLOOD' : 'TCP SYN'} />
      )}
      {currentStepIndex === 5 && (
        <BoldArrow x1="610" y1="75" x2="120" y2="75" color="#10b981" label="SYN-ACK" />
      )}

      {/* Devices */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isAttackPhase ? 'BOTNET / ATTACKER' : 'LEGIT CLIENT'}
        ip={isAttackPhase ? 'Spoofed Source IPs' : '192.168.1.50'}
        active
        danger={isAttackPhase}
        success={currentStepIndex === 6 || isSynCookiePhase}
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
            stroke={isSynCookiePhase ? '#8b5cf6' : isAttackPhase ? '#ef4444' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">SECURITY GATEWAY</text>
          <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isSynCookiePhase ? 'SYN COOKIES' : 'SYN PROXY'}
          </text>
          <text x="0" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">FIREWALL / TCP STACK</text>
        </g>
      )}

      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="WEB SERVER"
          sub={isAttackPhase ? 'BACKLOG 100% (CRASH)' : isSynCookiePhase ? 'STATELESS MODE ✓' : 'PORT 80 (ONLINE)'}
          active
          danger={currentStepIndex === 10 || currentStepIndex === 11}
          success={isSynCookiePhase || currentStepIndex === 6}
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
          dropped={currentStepIndex === 11}
        />
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          TCP CONNECTION STATE &amp; SYN QUEUE BACKLOG MONITOR
        </text>

        {/* Left: Server TCP SYN Backlog Queue Visualization */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">SERVER SYN-RCVD BACKLOG SLOTS (TCB POOL):</text>

          <g transform="translate(8, 26)">
            {/* Slot 1 */}
            <rect x="0" y="0" width="70" height="40" rx="4" fill={isAttackPhase ? '#fee2e2' : currentStepIndex >= 4 ? '#dcfce7' : '#ffffff'} stroke={isAttackPhase ? '#ef4444' : '#cbd5e1'} />
            <text x="35" y="15" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">Slot 1</text>
            <text x="35" y="28" textAnchor="middle" fill={isAttackPhase ? '#b91c1c' : '#059669'} fontSize="6.5" fontFamily="monospace">
              {isAttackPhase ? 'SYN_RCVD' : currentStepIndex >= 4 ? 'ESTABLISHED' : 'EMPTY'}
            </text>

            {/* Slot 2 */}
            <rect x="76" y="0" width="70" height="40" rx="4" fill={isAttackPhase ? '#fee2e2' : '#ffffff'} stroke={isAttackPhase ? '#ef4444' : '#cbd5e1'} />
            <text x="111" y="15" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">Slot 2</text>
            <text x="111" y="28" textAnchor="middle" fill={isAttackPhase ? '#b91c1c' : '#64748b'} fontSize="6.5" fontFamily="monospace">
              {isAttackPhase ? 'SYN_RCVD' : 'EMPTY'}
            </text>

            {/* Slot 3 */}
            <rect x="152" y="0" width="70" height="40" rx="4" fill={isAttackPhase ? '#fee2e2' : '#ffffff'} stroke={isAttackPhase ? '#ef4444' : '#cbd5e1'} />
            <text x="187" y="15" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">Slot 3</text>
            <text x="187" y="28" textAnchor="middle" fill={isAttackPhase ? '#b91c1c' : '#64748b'} fontSize="6.5" fontFamily="monospace">
              {isAttackPhase ? 'SYN_RCVD' : 'EMPTY'}
            </text>

            {/* Slot 4 */}
            <rect x="228" y="0" width="78" height="40" rx="4" fill={isAttackPhase ? '#fee2e2' : '#ffffff'} stroke={isAttackPhase ? '#ef4444' : '#cbd5e1'} />
            <text x="267" y="15" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">Slot 4 (Overflow)</text>
            <text x="267" y="28" textAnchor="middle" fill={isAttackPhase ? '#b91c1c' : '#64748b'} fontSize="6.5" fontFamily="monospace">
              {isAttackPhase ? 'EXHAUSTED' : 'EMPTY'}
            </text>
          </g>

          <g transform="translate(8, 74)">
            <rect x="0" y="0" width="306" height="58" rx="4" fill={isSynCookiePhase ? '#f5f3ff' : '#ffffff'} stroke={isSynCookiePhase ? '#8b5cf6' : '#e2e8f0'} />
            <text x="10" y="14" fill={isSynCookiePhase ? '#6d28d9' : '#0f172a'} fontSize="7.5" fontWeight="bold">
              {isSynCookiePhase ? '✔ SYN COOKIES ACTIVE (KERNEL BYPASS):' : 'SYN BACKLOG QUEUE STATUS:'}
            </text>
            <text x="10" y="28" fill="#475569" fontSize="7">
              {isSynCookiePhase
                ? '• No memory allocated in RAM upon SYN reception.'
                : isAttackPhase
                ? '• 100% backlog pool consumed by spoofed unreachable hosts.'
                : '• Normal TCP handshake allocating 280 bytes per TCB.'}
            </text>
            <text x="10" y="44" fill={isSynCookiePhase ? '#6d28d9' : isAttackPhase ? '#b91c1c' : '#059669'} fontSize="7" fontFamily="monospace">
              {isSynCookiePhase
                ? 'ISN = SHA256(SrcIP, DstIP, SrcPort, DstPort, Secret, MSS)'
                : isAttackPhase
                ? 'Queue = 1024/1024 (100% FULL ➔ DROP LEGIT SYN)'
                : 'Queue = 1/1024 (0.1% normal capacity)'}
            </text>
          </g>
        </g>

        {/* Right: Technical Inspector & Defense Mechanics */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">SYN FLOOD MITIGATION ARCHITECTURE:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="34" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="7" fontFamily="monospace">[LINUX KERNEL DEFENSE PARAMETER]</text>
            <text x="10" y="27" fill={isSynCookiePhase ? '#a78bfa' : '#38bdf8'} fontSize="7.5" fontFamily="monospace">
              sysctl -w net.ipv4.tcp_syncookies = 1
            </text>
          </g>

          <g transform="translate(12, 64)">
            <rect x="0" y="0" width="306" height="68" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Core Interview Principles:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              1. <tspan fontWeight="bold">SYN Flood Goal:</tspan> Exhaust RAM TCB half-open queue table.
            </text>
            <text x="10" y="42" fill="#475569" fontSize="7.5">
              2. <tspan fontWeight="bold">SYN Cookies:</tspan> Server responds statelessly without allocating RAM.
            </text>
            <text x="10" y="58" fill="#059669" fontSize="7.5" fontWeight="bold">
              3. <tspan fontWeight="bold">SYN Proxy (Firewall):</tspan> Firewall completes handshake before passing to server.
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 16
            ? 'RESULT: ✓ SYN FLOOD NEUTRALIZED VIA SYN COOKIES — SERVER REMAINS 100% OPERATIONAL'
            : currentStepIndex >= 10
            ? 'ALERT: ✕ SYN BACKLOG QUEUE EXHAUSTED BY SPOOFED HALF-OPEN CONNECTIONS'
            : currentStepIndex >= 4
            ? 'STANDARD: TCP 3-WAY HANDSHAKE (SYN ➔ SYN-ACK ➔ ACK)'
            : 'READY — ADVANCE STEP TO SIMULATE SYN FLOOD & SYN COOKIE DEFENSE'}
        </text>
      </g>
    </svg>
  );
};
