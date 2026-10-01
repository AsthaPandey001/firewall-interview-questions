import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q38SynFloodVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Attacker appears
  // Step 2: Firewall / Server appears with TCP State Table
  // Step 3: Attacker sends initial TCP SYN packet
  // Step 4: Server sends SYN-ACK and allocates memory for half-open connection
  // Step 5: Attacker transmits flood of spoofed SYN packets without sending ACKs
  // Step 6: Server half-open connection table reaches near exhaustion (DDoS risk!)
  // Step 7: Firewall SYN Flood Protection activates (SYN Cookies / TCP Intercept)
  // Step 8: Firewall intercepts SYNs and encodes sequence numbers into cryptographic SYN Cookies
  // Step 9: Zero server RAM allocated until valid client ACK arrives; spoofed SYNs safely neutralized ✓

  const showServer = currentStepIndex >= 1;
  const isFloodActive = currentStepIndex >= 4 && currentStepIndex <= 6;
  const isSynCookiesActive = currentStepIndex >= 7;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isSynCookiesActive ? '#f0fdf4' : isFloodActive ? '#fef2f2' : '#eff6ff'} stroke={isSynCookiesActive ? '#86efac' : isFloodActive ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isSynCookiesActive ? '#047857' : isFloodActive ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isSynCookiesActive
            ? 'SYN COOKIES ACTIVATED: STATELESS CRYPTOGRAPHIC SEQUENCE NUMBERS NEUTRALIZE SYN FLOOD DDoS ✓'
            : isFloodActive
            ? 'SYN FLOOD ATTACK IN PROGRESS: THOUSANDS OF HALF-OPEN SYN_RECV CONNECTIONS EXHAUSTING RAM ✕'
            : 'TCP 3-WAY HANDSHAKE & SYN FLOOD ATTACK MECHANICS'}
        </text>
      </g>

      {/* Baseline cable */}
      {showServer && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={70} label="BOTNET ATTACKER" ip="SPOOFED_IPS" active danger />

      <FirewallGatewayNode cx={370} cy={70} label="FIREWALL" sub={isSynCookiesActive ? 'SYN Proxy / Cookie Engine' : 'TCP Connection Tracker'} active success={isSynCookiesActive} danger={isFloodActive} />

      {showServer && (
        <ServerNodeSVG cx={650} cy={70} label="WEB SERVER" sub="10.0.1.50:443" active success={isSynCookiesActive} danger={isFloodActive} />
      )}

      {/* Flood Arrows */}
      {isFloodActive && (
        <g>
          <BoldArrow x1={130} y1={60} x2={330} y2={60} color="#ef4444" label="SYN FLOOD 1" />
          <BoldArrow x1={130} y1={75} x2={330} y2={75} color="#ef4444" label="SYN FLOOD 2" />
          <BoldArrow x1={130} y1={90} x2={330} y2={90} color="#ef4444" label="SYN FLOOD 3" />
        </g>
      )}

      {isSynCookiesActive && (
        <g transform="translate(370, 70)">
          <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth={2} />
          <text x="0" y="4" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold" fontFamily="monospace">
            🍪 SYN COOKIE ACTIVE
          </text>
        </g>
      )}

      {/* Lower State Table Breakdown Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          TCP HALF-OPEN STATE TABLE EXHAUSTION vs SYN COOKIE MITIGATION
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill={isFloodActive ? '#fee2e2' : '#f8fafc'} stroke={isFloodActive ? '#fca5a5' : '#cbd5e1'} />
          <text x="10" y="16" fill={isFloodActive ? '#991b1b' : '#0f172a'} fontSize="8.5" fontWeight="bold">SERVER STATE TABLE (Without Protection):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7" fontFamily="monospace">198.51.100.1:49101 ➔ 10.0.1.50:443 [SYN_RECV - Waiting ACK]</text>
          <text x="12" y="48" fill="#0f172a" fontSize="7" fontFamily="monospace">198.51.100.2:49102 ➔ 10.0.1.50:443 [SYN_RECV - Waiting ACK]</text>
          <text x="12" y="62" fill="#0f172a" fontSize="7" fontFamily="monospace">198.51.100.3:49103 ➔ 10.0.1.50:443 [SYN_RECV - Waiting ACK]</text>
          <text x="12" y="80" fill="#dc2626" fontSize="7.5" fontWeight="bold">Buffer Utilization: 99.8% (Legitimate users dropped!)</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill={isSynCookiesActive ? '#f0fdf4' : '#f8fafc'} stroke={isSynCookiesActive ? '#86efac' : '#cbd5e1'} />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">SYN COOKIES DEFENSE (Stateless Handshake):</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. Firewall does NOT allocate memory buffers on receiving SYN.</text>
          <text x="359" y="48" fill="#0f172a" fontSize="7.5">2. Encodes connection metadata into initial Sequence Number (Cookie).</text>
          <text x="359" y="62" fill="#0f172a" fontSize="7.5">3. Server only allocates connection memory when client returns valid ACK containing matching cookie.</text>
          <text x="359" y="80" fill="#059669" fontSize="7.5" fontWeight="bold">Result: Server survives infinite SYN flood rates!</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: SYN floods exploit the asymmetry of TCP state allocation. SYN Cookies eliminate state memory until the full 3-way handshake completes.
          </text>
        </g>
      </g>
    </svg>
  );
};
