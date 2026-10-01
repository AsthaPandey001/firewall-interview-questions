import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q50TroubleshootServerVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Part A: Internal LAN Test (Steps 0 - 7)
  const isPartA = currentStepIndex <= 7;
  // Part B: External Failure Test (Steps 8 - 20)
  const isPartB = currentStepIndex >= 8 && currentStepIndex <= 20;
  // Part C: Remediation & Success Verification (Steps 21 - 32)
  const isPartC = currentStepIndex >= 21;

  const showFwNat = currentStepIndex >= 10;
  const showCables = currentStepIndex >= 2;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'HTTPS :443';
  let packetSub = '192.168.1.10';
  let packetColor = '#0284c7';

  if (currentStepIndex === 3 || currentStepIndex === 4) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'LAN HTTP GET';
    packetSub = '192.168.1.50 ➔ 192.168.1.10';
    packetColor = '#0284c7';
  } else if (currentStepIndex === 5 || currentStepIndex === 6) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'LAN HTTP 200 OK';
    packetSub = 'Server Responds ✓';
    packetColor = '#10b981';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 80;
    packetLabel = 'LAN ACCESS: OK ✓';
    packetSub = 'Local Connectivity Pass';
    packetColor = '#10b981';
  } else if (currentStepIndex === 12 || currentStepIndex === 13) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'WAN TCP SYN';
    packetSub = 'Dst: 203.0.113.10:443';
    packetColor = '#0284c7';
  } else if (currentStepIndex === 14 || currentStepIndex === 15) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'ACL ALLOWED ✓';
    packetSub = 'Checking DNAT Table...';
    packetColor = '#f59e0b';
  } else if (currentStepIndex >= 16 && currentStepIndex <= 20) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'MISSING DNAT RULE ✕';
    packetSub = 'PACKET DROPPED';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 23 || currentStepIndex === 24) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'WAN TCP SYN (RETEST)';
    packetSub = 'Dst: 203.0.113.10:443';
    packetColor = '#0284c7';
  } else if (currentStepIndex === 25 || currentStepIndex === 26) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'DNAT TRANSLATED ✓';
    packetSub = '203.0.113.10 ➔ 192.168.1.10';
    packetColor = '#10b981';
  } else if (currentStepIndex === 27) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'FORWARDED TO SERVER';
    packetSub = 'Dst: 192.168.1.10:443';
    packetColor = '#10b981';
  } else if (currentStepIndex === 28 || currentStepIndex === 29) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'SYN-ACK RESPONSE';
    packetSub = 'Src: 192.168.1.10:443';
    packetColor = '#10b981';
  } else if (currentStepIndex === 30) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'REVERSE NAT TRANSLATE';
    packetSub = 'Src ➔ 203.0.113.10';
    packetColor = '#10b981';
  } else if (currentStepIndex >= 31) {
    showPacket = true;
    packetX = 80;
    packetLabel = 'HTTP 200 OK VERIFIED ✓';
    packetSub = 'Full WAN Reachability';
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
          fill={isPartC ? '#f0fdf4' : isPartB ? '#fef2f2' : '#eff6ff'}
          stroke={isPartC ? '#86efac' : isPartB ? '#fca5a5' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPartC ? '#15803d' : isPartB ? '#991b1b' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPartC
            ? 'PART C: DNAT RULE REMEDIATION — PORT FORWARDING ACTIVE ➔ 203.0.113.10:443 ➔ 192.168.1.10:443 VERIFIED ✓'
            : isPartB
            ? 'PART B: WAN FAILURE DIAGNOSIS — ACL PERMITS TRAFFIC BUT MISSING DNAT RULE CAUSES TIMEOUT ✕'
            : 'PART A: INTERNAL LAN BASELINE TEST — CONFIRMING SERVER IS LISTENING ON 192.168.1.10:443 ✓'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          {isPartA ? (
            <line x1="120" y1="75" x2="610" y2="75" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />
          ) : (
            <>
              <line x1="120" y1="75" x2="330" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
              <line x1="410" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
            </>
          )}
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 4 || currentStepIndex === 6) && (
        <BoldArrow x1="120" y1="75" x2="610" y2="75" color="#10b981" label="LAN DIRECT ACCESS" />
      )}
      {(currentStepIndex === 12 || currentStepIndex === 23) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color="#0284c7" label="WAN INBOUND :443" />
      )}
      {(currentStepIndex === 27 || currentStepIndex === 28) && (
        <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#10b981" label="DNAT TO SERVER" />
      )}

      {/* Client Device */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isPartA ? 'INTERNAL LAN CLIENT' : 'EXTERNAL WAN CLIENT'}
        ip={isPartA ? '192.168.1.50' : '198.51.100.99'}
        active
        danger={isPartB && currentStepIndex >= 18}
        success={isPartA || isPartC}
      />

      {/* Edge Firewall / NAT Gateway (for Part B & C) */}
      {showFwNat && !isPartA && (
        <g transform="translate(370, 75)">
          <rect
            x="-48"
            y="-30"
            width="96"
            height="46"
            rx="8"
            fill="#0f172a"
            stroke={isPartC ? '#10b981' : isPartB && currentStepIndex >= 16 ? '#ef4444' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">FIREWALL &amp; NAT</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">
            {isPartC ? 'DNAT ACTIVE ✓' : isPartB && currentStepIndex >= 16 ? 'DNAT MISSING ✕' : 'WAN: 203.0.113.10'}
          </text>
          <text x="0" y="26" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#0f172a">EDGE GATEWAY</text>
        </g>
      )}

      {/* Web Server */}
      <ServerNodeSVG
        cx={650}
        cy={75}
        label="INTERNAL WEB SERVER"
        sub="192.168.1.10:443"
        active
        success={isPartA || isPartC}
      />

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={packetY}
          label={packetLabel}
          sub={packetSub}
          color={packetColor}
          dropped={isPartB && currentStepIndex >= 18}
        />
      )}

      {/* Drop marker */}
      {isPartB && currentStepIndex >= 18 && (
        <g transform="translate(370, 75)">
          <line x1="-15" y1="-15" x2="15" y2="15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="15" y1="-15" x2="-15" y2="15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          DIAGNOSTIC TRIAGE MATRIX: INBOUND FIREWALL ACL VS DESTINATION NAT (PORT FORWARDING)
        </text>

        {/* Left: Checkpoint Breakdown */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">DIAGNOSTIC CHECKPOINT STATUS:</text>

          <g transform="translate(8, 24)">
            {/* Check 1: LAN Service */}
            <rect x="0" y="0" width="309" height="20" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="14" fill="#059669" fontSize="7.5" fontFamily="monospace">1. Server Listening on Port 443: PASSED (netstat -tuln ✓)</text>

            {/* Check 2: Inbound ACL */}
            <rect x="0" y="24" width="309" height="20" rx="3" fill={!isPartA ? '#dcfce7' : '#ffffff'} stroke={!isPartA ? '#86efac' : '#e2e8f0'} />
            <text x="10" y="38" fill={!isPartA ? '#059669' : '#64748b'} fontSize="7.5" fontFamily="monospace">
              2. Inbound Security Policy: PERMIT tcp any ➔ 203.0.113.10:443 ✓
            </text>

            {/* Check 3: DNAT */}
            <rect x="0" y="48" width="309" height="22" rx="3" fill={isPartC ? '#dcfce7' : isPartB ? '#fee2e2' : '#ffffff'} stroke={isPartC ? '#86efac' : isPartB ? '#fca5a5' : '#e2e8f0'} />
            <text x="10" y="62" fill={isPartC ? '#059669' : isPartB ? '#991b1b' : '#64748b'} fontSize="7.5" fontFamily="monospace">
              {isPartC
                ? '3. Destination NAT (DNAT): 203.0.113.10:443 ➔ 192.168.1.10:443 [PASSED ✓]'
                : isPartB
                ? '3. Destination NAT (DNAT): NO MAPPING FOUND IN NAT TABLE [FAILED ✕]'
                : '3. Destination NAT (DNAT): Pending WAN Test'}
            </text>

            {/* Check 4: Routing */}
            <rect x="0" y="74" width="309" height="22" rx="3" fill={isPartC ? '#dcfce7' : '#ffffff'} stroke={isPartC ? '#86efac' : '#e2e8f0'} />
            <text x="10" y="88" fill={isPartC ? '#059669' : '#64748b'} fontSize="7.5" fontFamily="monospace">
              {isPartC ? '4. Return Path Default Gateway: 192.168.1.1 [CONFIRMED ✓]' : '4. Return Routing: Default Gateway 192.168.1.1'}
            </text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Root Cause Verdict: <tspan fill={isPartC ? '#059669' : isPartB ? '#b91c1c' : '#0284c7'} fontWeight="bold">{isPartC ? 'DNAT Configured &amp; Verified' : isPartB ? 'Missing DNAT (Port Forwarding) Rule' : 'Internal LAN Baseline Operational'}</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Configuration */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">FIREWALL DNAT (PORT FORWARD) CONFIGURATION:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="42" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="6.8" fontFamily="monospace">[CISCO ASA / PALO ALTO DNAT CONFIGURATION]</text>
            <text x="10" y="26" fill={isPartC ? '#4ade80' : '#f87171'} fontSize="7" fontFamily="monospace">
              {isPartC
                ? 'nat (outside,inside) source any destination static 203.0.113.10 192.168.1.10 service https https'
                : '# ERROR: No translation rule matched packet destined to 203.0.113.10:443'}
            </text>
          </g>

          <g transform="translate(12, 70)">
            <rect x="0" y="0" width="306" height="62" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Triage Methodology Rule:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              1. If LAN works but WAN fails: <tspan fontWeight="bold">Check Inbound ACL + DNAT rule.</tspan>
            </text>
            <text x="10" y="42" fill="#475569" fontSize="7.5">
              2. Both ACL (Permit) AND DNAT (Translate) are required for public access.
            </text>
            <text x="10" y="56" fill="#059669" fontSize="7.5" fontWeight="bold">
              ✔ Retest Confirmed: External client receives HTTP 200 OK!
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 31
            ? 'RESULT: ✓ FULL WAN REACHABILITY RESTORED — DNAT TRANSLATION &amp; HTTP 200 OK VERIFIED'
            : currentStepIndex >= 21
            ? 'PART C: COMMITTING DNAT PORT FORWARDING RULE &amp; RETESTING WAN ACCESS'
            : currentStepIndex >= 16
            ? 'PART B: ✕ WAN ATTEMPT FAILED — FIREWALL ALLOWS PACKET BUT MISSING DNAT DROPS IT'
            : currentStepIndex >= 7
            ? 'PART A: ✓ INTERNAL LAN REACHABILITY CONFIRMED — SERVER PROCESS HEALTHY'
            : 'READY — ADVANCE STEP TO TRACE INTERNAL VS WAN TROUBLESHOOTING SIMULATION'}
        </text>
      </g>
    </svg>
  );
};
