import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q48WafVsNetworkFwVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const isPartBWaf = currentStepIndex >= 10;
  const showFirewall = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'SQL INJECTION';
  let packetSub = "' OR '1'='1";
  let packetColor = '#ef4444';

  if (currentStepIndex === 4 || currentStepIndex === 5) {
    showPacket = true;
    packetX = 230;
    packetLabel = "GET /login?u=' OR '1'='1";
    packetSub = 'Port: 443 [HTTPS]';
  } else if (currentStepIndex === 6 || currentStepIndex === 7) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'L3/L4 FW ALLOWS :443';
    packetSub = 'Blind to L7 Payload!';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 8 || currentStepIndex === 9) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'EXPLOIT DELIVERED ✕';
    packetSub = 'Server DB Attacked!';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 13 || currentStepIndex === 14) {
    showPacket = true;
    packetX = 230;
    packetLabel = "GET /login?u=' OR '1'='1";
    packetSub = '➔ WAF L7 Engine';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 15 || currentStepIndex === 16 || currentStepIndex === 17) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'WAF SQLi DETECTED!';
    packetSub = 'OWASP CRS Rule 942100';
    packetColor = '#ef4444';
  } else if (currentStepIndex >= 18) {
    showPacket = true;
    packetX = 330;
    packetLabel = 'HTTP 403 FORBIDDEN ✕';
    packetSub = 'Payload Dropped at WAF';
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
          fill={isPartBWaf ? '#f0fdf4' : '#fef2f2'}
          stroke={isPartBWaf ? '#86efac' : '#fca5a5'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPartBWaf ? '#15803d' : '#991b1b'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPartBWaf
            ? 'PART B: WEB APPLICATION FIREWALL (WAF) — PARSES L7 HTTP/SQLi PAYLOAD ➔ BLOCKS ATTACK (HTTP 403) ✓'
            : 'PART A: L3/L4 NETWORK FIREWALL — BLIND TO L7 PAYLOAD ➔ ALLOWS SQL INJECTION OVER PORT 443 ✕'}
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
      {(currentStepIndex === 5 || currentStepIndex === 14) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color="#ef4444" label="SQLi PAYLOAD" />
      )}
      {(currentStepIndex === 7 || currentStepIndex === 8) && (
        <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#ef4444" label="UNINSPECTED FORWARD" />
      )}

      {/* Client Attacker */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT / ATTACKER"
        ip="Src IP: 198.51.100.50"
        active
        danger
      />

      {/* Firewall / WAF Device */}
      {showFirewall && (
        <g transform="translate(370, 75)">
          <rect
            x="-48"
            y="-30"
            width="96"
            height="46"
            rx="8"
            fill="#0f172a"
            stroke={isPartBWaf ? '#10b981' : '#ef4444'}
            strokeWidth={2}
          />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
            {isPartBWaf ? 'LAYER 7 WAF' : 'L3/L4 FIREWALL'}
          </text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isPartBWaf ? 'MODSECURITY / AWS' : 'STATEFUL L4'}
          </text>
          <text x="0" y="26" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#0f172a">
            {isPartBWaf ? 'APP LAYER SHIELD' : 'PACKET FILTER'}
          </text>
        </g>
      )}

      {/* Web Server */}
      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="WEB SERVER &amp; SQL DB"
          sub={isPartBWaf ? 'Protected by WAF ✓' : 'Vulnerable to SQLi ✕'}
          active
          danger={!isPartBWaf && currentStepIndex >= 8}
          success={isPartBWaf}
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
          dropped={isPartBWaf && currentStepIndex >= 18}
        />
      )}

      {/* Drop marker */}
      {isPartBWaf && currentStepIndex >= 18 && (
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
          LAYER 3/4 PACKET FILTERING VS LAYER 7 APPLICATION PAYLOAD DEEP INSPECTION
        </text>

        {/* Left: Inspection Engine Comparison */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            {isPartBWaf ? 'LAYER 7 WAF INSPECTION MATRIX:' : 'LAYER 3/4 NETWORK FIREWALL MATRIX:'}
          </text>

          {!isPartBWaf ? (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace">Field             Value Checked    Decision</text>

              <rect x="0" y="24" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
              <text x="10" y="38" fill="#059669" fontSize="7.5" fontFamily="monospace">Dst Port: 443     HTTPS Protocol   MATCH RULE (ALLOW ✓)</text>

              <rect x="0" y="48" width="309" height="22" rx="3" fill="#fee2e2" stroke="#fca5a5" />
              <text x="10" y="62" fill="#991b1b" fontSize="7.5" fontFamily="monospace">HTTP Payload      &apos; OR &apos;1&apos;=&apos;1      BLIND (CANNOT INSPECT ✕)</text>

              <rect x="0" y="72" width="309" height="34" rx="3" fill="#fef2f2" stroke="#cbd5e1" />
              <text x="10" y="86" fill="#991b1b" fontSize="7" fontWeight="bold">Security Flaw:</text>
              <text x="10" y="98" fill="#475569" fontSize="6.8">Standard firewalls do not inspect L7 web application logic or SQL queries.</text>
            </g>
          ) : (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
              <text x="10" y="14" fill="#4ade80" fontSize="7" fontFamily="monospace">OWASP CRS Rule    Payload Trigger          Verdict</text>

              <rect x="0" y="24" width="309" height="22" rx="3" fill="#fee2e2" stroke="#fca5a5" />
              <text x="10" y="38" fill="#991b1b" fontSize="7.5" fontFamily="monospace">Rule 942100       SQL Injection (&apos; OR &apos;1&apos;=&apos;1) MATCH (DROP ✕)</text>

              <rect x="0" y="48" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
              <text x="10" y="62" fill="#059669" fontSize="7.5" fontFamily="monospace">HTTP Response     HTTP 403 Forbidden       SENT TO ATTACKER ✓</text>

              <rect x="0" y="72" width="309" height="34" rx="3" fill="#f0fdf4" stroke="#86efac" />
              <text x="10" y="86" fill="#059669" fontSize="7" fontWeight="bold">WAF Protection:</text>
              <text x="10" y="98" fill="#475569" fontSize="6.8">Decodes TLS, parses HTTP headers/body, and blocks OWASP Top 10 exploits.</text>
            </g>
          )}

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Inspection Depth: <tspan fill={isPartBWaf ? '#059669' : '#b91c1c'} fontWeight="bold">{isPartBWaf ? 'Layer 7 (HTTP Methods, Headers, Cookies, SQL Queries)' : 'Layer 3/4 (IP Address, TCP/UDP Port Numbers only)'}</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Summary */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">CORE COMPARISON &amp; DEFENSE IN DEPTH:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">Network Firewall (L3/L4):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">• Controls IP routing, port access, and basic network zones.</text>
            <text x="10" y="39" fill="#b91c1c" fontSize="7">• Does NOT protect against SQLi, XSS, or Command Injection on open ports.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">Web Application Firewall (WAF - L7):</text>
            <text x="10" y="27" fill="#059669" fontSize="7">• Inspects web application logic, HTTP parameters, and API JSON payloads.</text>
            <text x="10" y="39" fill="#059669" fontSize="7">• Mitigates OWASP Top 10 vulnerabilities without patching code.</text>
            <text x="10" y="50" fill="#0284c7" fontSize="7" fontWeight="bold">✔ Enterprise Standard: Deploy BOTH in tandem!</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 18
            ? 'RESULT: ✓ WAF BLOCKED SQLi ATTACK — WEB SERVER &amp; SQL DATABASE REMAIN 100% UNTOUCHED'
            : currentStepIndex >= 10
            ? 'PART B: WAF PARSING LAYER 7 HTTP PAYLOAD FOR SQL INJECTION SIGNATURES'
            : currentStepIndex >= 8
            ? 'PART A: L3/L4 FIREWALL ALLOWED SQL INJECTION BECAUSE PORT 443 WAS PERMITTED'
            : 'READY — ADVANCE STEP TO TRACE NETWORK FIREWALL VS WAF INSPECTION'}
        </text>
      </g>
    </svg>
  );
};
