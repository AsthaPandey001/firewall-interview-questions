import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q49TroubleshootWebsiteVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showDns = currentStepIndex >= 1;
  const showFw = currentStepIndex >= 2;
  const showServer = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isDnsPhase = currentStepIndex >= 5 && currentStepIndex <= 9;
  const isDropPhase = currentStepIndex >= 10 && currentStepIndex <= 14;
  const isSyslogPhase = currentStepIndex >= 15 && currentStepIndex <= 17;
  const isRuleFixPhase = currentStepIndex >= 18 && currentStepIndex <= 19;
  const isSuccessPhase = currentStepIndex >= 20;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'DNS QUERY';
  let packetSub = 'www.partner.com';
  let packetColor = '#0284c7';

  if (currentStepIndex === 6 || currentStepIndex === 7) {
    showPacket = true;
    packetX = 160;
    packetLabel = 'DNS QUERY :53';
    packetSub = 'partner-portal.com';
  } else if (currentStepIndex === 8 || currentStepIndex === 9) {
    showPacket = true;
    packetX = 160;
    packetLabel = 'A RECORD: 203.0.113.80';
    packetSub = 'DNS Resolved ✓';
    packetColor = '#10b981';
  } else if (currentStepIndex === 10 || currentStepIndex === 11) {
    showPacket = true;
    packetX = 340;
    packetLabel = 'TCP SYN :443';
    packetSub = 'Dst: 203.0.113.80';
    packetColor = '#0284c7';
  } else if (currentStepIndex === 12 || currentStepIndex === 13 || currentStepIndex === 14) {
    showPacket = true;
    packetX = 400;
    packetLabel = 'FIREWALL DROP ✕';
    packetSub = 'Implicit Deny Rule';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 20 || currentStepIndex === 21) {
    showPacket = true;
    packetX = 340;
    packetLabel = 'TCP SYN (RETRY)';
    packetSub = 'Rule Matched (ALLOW)';
    packetColor = '#10b981';
  } else if (currentStepIndex === 22 || currentStepIndex === 23) {
    showPacket = true;
    packetX = 540;
    packetLabel = 'SYN-ACK RESPONSE';
    packetSub = 'Server Connected';
    packetColor = '#10b981';
  } else if (currentStepIndex >= 24) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'HTTP 200 OK ✓';
    packetSub = 'Website Rendered';
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
          fill={isSuccessPhase ? '#f0fdf4' : isDropPhase || isSyslogPhase ? '#fef2f2' : '#eff6ff'}
          stroke={isSuccessPhase ? '#86efac' : isDropPhase || isSyslogPhase ? '#fca5a5' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isSuccessPhase ? '#15803d' : isDropPhase || isSyslogPhase ? '#991b1b' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isSuccessPhase
            ? 'PHASE 5: RETEST SUCCESSFUL — POLICY RULE FIXED ➔ TCP HANDSHAKE &amp; HTTP 200 OK VERIFIED ✓'
            : isSyslogPhase || isRuleFixPhase
            ? 'PHASE 3 &amp; 4: SYSLOG INVESTIGATION REVEALS IMPLICIT DROP ➔ COMMITTING OUTBOUND ALLOW RULE'
            : isDropPhase
            ? 'PHASE 2: TCP SYN BLOCKED AT FIREWALL (IMPLICIT DENY) ➔ CONNECTION TIMEOUT ✕'
            : isDnsPhase
            ? 'PHASE 1: DNS RESOLUTION VERIFIED (partner-portal.com ➔ 203.0.113.80) ✓'
            : 'WEBSITE TROUBLESHOOTING LAB: END-TO-END 5-STAGE DIAGNOSTIC SIMULATION'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="200" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="280" y1="75" x2="400" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="480" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 6 || currentStepIndex === 8) && (
        <BoldArrow x1="120" y1="75" x2="200" y2="75" color={currentStepIndex === 8 ? '#10b981' : '#0284c7'} label="DNS :53" />
      )}
      {(currentStepIndex === 10 || currentStepIndex === 11 || currentStepIndex === 20) && (
        <BoldArrow x1="120" y1="75" x2="400" y2="75" color={currentStepIndex === 20 ? '#10b981' : '#0284c7'} label="TCP SYN :443" />
      )}
      {(currentStepIndex === 22 || currentStepIndex === 24) && (
        <BoldArrow x1="480" y1="75" x2="610" y2="75" color="#10b981" label="HTTP 200 OK" />
      )}

      {/* User Laptop */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT LAPTOP"
        ip="10.0.0.25"
        active
        danger={isDropPhase}
        success={isSuccessPhase}
      />

      {/* DNS Server */}
      {showDns && (
        <g transform="translate(240, 75)">
          <rect
            x="-35"
            y="-25"
            width="70"
            height="40"
            rx="6"
            fill="#0f172a"
            stroke={currentStepIndex >= 8 ? '#10b981' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">DNS SERVER</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">10.0.0.2</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">RESOLVER</text>
        </g>
      )}

      {/* Edge Firewall */}
      {showFw && (
        <g transform="translate(440, 75)">
          <rect
            x="-40"
            y="-25"
            width="80"
            height="40"
            rx="6"
            fill="#0f172a"
            stroke={isDropPhase ? '#ef4444' : isSuccessPhase ? '#10b981' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">EDGE FIREWALL</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">10.0.0.1</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">SECURITY POLICY</text>
        </g>
      )}

      {/* External Partner Web Server */}
      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="PARTNER PORTAL"
          sub="203.0.113.80:443"
          active
          success={isSuccessPhase}
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
          dropped={isDropPhase && currentStepIndex >= 13}
        />
      )}

      {/* Drop marker */}
      {isDropPhase && currentStepIndex >= 13 && (
        <g transform="translate(400, 75)">
          <line x1="-15" y1="-15" x2="15" y2="15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="15" y1="-15" x2="-15" y2="15" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          LIVE TROUBLESHOOTING CONSOLE: 5-STAGE NETWORK &amp; FIREWALL DIAGNOSTICS
        </text>

        {/* Left: 5-Stage Diagnostic Checklist */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">STAGE-BY-STAGE DIAGNOSTIC PIPELINE:</text>

          <g transform="translate(8, 24)">
            {/* Stage 1: DNS */}
            <rect x="0" y="0" width="309" height="20" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="14" fill="#059669" fontSize="7.5" fontFamily="monospace">1. DNS Resolution: partner-portal.com ➔ 203.0.113.80 [PASSED ✓]</text>

            {/* Stage 2: Routing / L3 */}
            <rect x="0" y="24" width="309" height="20" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="38" fill="#059669" fontSize="7.5" fontFamily="monospace">2. IP Route Lookup: Default route to 10.0.0.1 [PASSED ✓]</text>

            {/* Stage 3: Firewall Policy */}
            <rect x="0" y="48" width="309" height="22" rx="3" fill={isSuccessPhase || isRuleFixPhase ? '#dcfce7' : '#fee2e2'} stroke={isSuccessPhase || isRuleFixPhase ? '#86efac' : '#fca5a5'} />
            <text x="10" y="62" fill={isSuccessPhase || isRuleFixPhase ? '#059669' : '#991b1b'} fontSize="7.5" fontFamily="monospace">
              {isSuccessPhase || isRuleFixPhase
                ? '3. Firewall Rule: ALLOW LAN ➔ 203.0.113.80:443 [FIXED ✓]'
                : '3. Firewall Rule: Implicit Deny Policy Drop [FAILED ✕]'}
            </text>

            {/* Stage 4: TCP Handshake */}
            <rect x="0" y="74" width="309" height="22" rx="3" fill={isSuccessPhase ? '#dcfce7' : '#ffffff'} stroke={isSuccessPhase ? '#86efac' : '#e2e8f0'} />
            <text x="10" y="88" fill={isSuccessPhase ? '#059669' : '#64748b'} fontSize="7.5" fontFamily="monospace">
              {isSuccessPhase ? '4. TCP 3-Way Handshake: SYN ➔ SYN-ACK ➔ ESTABLISHED [PASSED ✓]' : '4. TCP Handshake: SYN_SENT (Awaiting SYN-ACK)'}
            </text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Diagnostic Status: <tspan fill={isSuccessPhase ? '#059669' : '#b91c1c'} fontWeight="bold">{isSuccessPhase ? 'All 5 Network Layers Verified Operational' : 'Hanging on Layer 4 TCP Session Establishment'}</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Syslog Viewer */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">FIREWALL SYSLOG &amp; REMEDIATION CONSOLE:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="42" rx="4" fill="#0f172a" />
            <text x="10" y="14" fill="#94a3b8" fontSize="6.8" fontFamily="monospace">[EDGE FIREWALL LIVE TRAFFIC SYSLOG]</text>
            <text x="10" y="26" fill={isSuccessPhase ? '#4ade80' : '#f87171'} fontSize="7" fontFamily="monospace">
              {isSuccessPhase
                ? '%FW-6-302013: Built outbound TCP conn 8912 for LAN:10.0.0.25 to WAN:203.0.113.80:443 (Rule_Allow_Partner)'
                : '%FW-3-106015: Deny TCP (no-match) from 10.0.0.25/51200 to 203.0.113.80/443 on interface inside'}
            </text>
          </g>

          <g transform="translate(12, 70)">
            <rect x="0" y="0" width="306" height="62" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="8" fontWeight="bold">Engineering Remediation Applied:</text>
            <text x="10" y="28" fill="#475569" fontSize="7.5">
              • Added security policy: <tspan fill="#059669" fontFamily="monospace">access-list OUTBOUND permit tcp any host 203.0.113.80 eq 443</tspan>
            </text>
            <text x="10" y="44" fill="#059669" fontSize="7.5" fontWeight="bold">
              ✔ Retest Confirmed: HTTP/1.1 200 OK received, 0 packet loss.
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 24
            ? 'RESULT: ✓ END-TO-END REACHABILITY RESTORED — DNS OK, FW RULE FIXED, HTTP 200 OK'
            : currentStepIndex >= 18
            ? 'PHASE 4: COMMITTING FIREWALL OUTBOUND PERMIT RULE FOR 203.0.113.80:443'
            : currentStepIndex >= 12
            ? 'PHASE 2: FIREWALL SYSLOG CONFIRMS IMPLICIT DENY DROP ON PORT 443'
            : currentStepIndex >= 8
            ? 'PHASE 1: DNS RESOLUTION CONFIRMED 203.0.113.80'
            : 'READY — ADVANCE STEP TO TRACE STEP-BY-STEP WEBSITE ACCESS DIAGNOSIS'}
        </text>
      </g>
    </svg>
  );
};
