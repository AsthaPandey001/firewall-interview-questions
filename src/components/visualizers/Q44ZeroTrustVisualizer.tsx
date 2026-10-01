import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q44ZeroTrustVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showPdp = currentStepIndex >= 1;
  const showPep = currentStepIndex >= 2;
  const showApp = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isPhase2Denied = currentStepIndex >= 14;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'ACCESS REQ';
  let packetSub = 'app.finance.corp';
  let packetColor = '#0284c7';

  if (currentStepIndex === 6 || currentStepIndex === 7) {
    showPacket = true;
    packetX = 180;
    packetLabel = 'AUTH & POSTURE';
    packetSub = 'MFA + EDR Telemetry';
  } else if (currentStepIndex === 8 || currentStepIndex === 9 || currentStepIndex === 10) {
    showPacket = true;
    packetX = 310;
    packetLabel = 'PDP EVALUATING';
    packetSub = 'Context: Healthy ✓';
    packetColor = '#10b981';
  } else if (currentStepIndex === 11 || currentStepIndex === 12) {
    showPacket = true;
    packetX = 460;
    packetLabel = 'JIT MICRO-TUNNEL';
    packetSub = 'PEP Dynamic Grant';
    packetColor = '#10b981';
  } else if (currentStepIndex === 13) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'DB RESPONSE ✓';
    packetSub = 'Authorized Session';
    packetColor = '#10b981';
  } else if (currentStepIndex === 15) {
    showPacket = true;
    packetX = 310;
    packetLabel = 'POSTURE FAILED ✕';
    packetSub = 'No EDR / Unmanaged';
    packetColor = '#ef4444';
  } else if (currentStepIndex >= 16) {
    showPacket = true;
    packetX = 460;
    packetLabel = 'EXPLICIT DENIAL ✕';
    packetSub = 'PEP Drop (Zero Trust)';
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
          fill={isPhase2Denied ? '#fef2f2' : currentStepIndex >= 11 ? '#f0fdf4' : '#eff6ff'}
          stroke={isPhase2Denied ? '#fca5a5' : currentStepIndex >= 11 ? '#86efac' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPhase2Denied ? '#991b1b' : currentStepIndex >= 11 ? '#15803d' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPhase2Denied
            ? 'ZERO TRUST VIOLATION: UNMANAGED ENDPOINT FAILS POSTURE CHECK ➔ EXPLICIT ACCESS DENIAL ✕'
            : currentStepIndex >= 11
            ? 'ZERO TRUST VERIFIED: IDENTITY + MFA + DEVICE HEALTH OK ➔ JUST-IN-TIME MICRO-TUNNEL GRANTED ✓'
            : 'ZERO TRUST (ZTNA) LAB: CONTINUOUS CONTEXT EVALUATION (NEVER TRUST, ALWAYS VERIFY)'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="270" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="350" y1="75" x2="420" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="500" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 6 || currentStepIndex === 14) && (
        <BoldArrow x1="120" y1="75" x2="270" y2="75" color={isPhase2Denied ? '#ef4444' : '#0284c7'} label="ACCESS REQUEST" />
      )}
      {(currentStepIndex === 12 || currentStepIndex === 13) && (
        <BoldArrow x1="500" y1="75" x2="610" y2="75" color="#10b981" label="MICRO-SEGMENT" />
      )}

      {/* Client Laptop */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isPhase2Denied ? 'UNMANAGED DEVICE' : 'MANAGED WORKSTATION'}
        ip={isPhase2Denied ? 'Personal Laptop (No EDR)' : 'Corp Asset (EDR Healthy)'}
        active
        danger={isPhase2Denied}
        success={currentStepIndex >= 11 && !isPhase2Denied}
      />

      {/* Policy Decision Point (PDP) */}
      {showPdp && (
        <g transform="translate(310, 75)">
          <rect
            x="-40"
            y="-25"
            width="80"
            height="40"
            rx="6"
            fill="#0f172a"
            stroke={isPhase2Denied ? '#ef4444' : currentStepIndex >= 8 ? '#10b981' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">PDP ENGINE</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">IDP + POSTURE</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">POLICY DECISION</text>
        </g>
      )}

      {/* Policy Enforcement Point (PEP) */}
      {showPep && (
        <g transform="translate(460, 75)">
          <rect
            x="-40"
            y="-25"
            width="80"
            height="40"
            rx="6"
            fill="#0f172a"
            stroke={isPhase2Denied ? '#ef4444' : currentStepIndex >= 11 ? '#10b981' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">PEP GATEWAY</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">ZTNA EDGE</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">POLICY ENFORCEMENT</text>
        </g>
      )}

      {/* Protected Target App */}
      {showApp && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="FINANCIAL DB"
          sub="Stealth Mode (Zero Inbound)"
          active
          success={currentStepIndex === 13}
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
          dropped={isPhase2Denied && currentStepIndex >= 16}
        />
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          ZTNA CONTEXTUAL EVALUATION ENGINE (NIST SP 800-207 ZERO TRUST PILLARS)
        </text>

        {/* Left: Context Verification Matrix */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">PDP CONTEXT VERIFICATION CRITERIA:</text>

          <g transform="translate(8, 24)">
            {/* Check 1: Identity */}
            <rect x="0" y="0" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="14" fill="#059669" fontSize="7.5" fontFamily="monospace">✔ Identity &amp; MFA: user@corp.com + FIDO2 Key Verified</text>

            {/* Check 2: Device Posture */}
            <rect x="0" y="26" width="309" height="22" rx="3" fill={isPhase2Denied ? '#fee2e2' : '#dcfce7'} stroke={isPhase2Denied ? '#fca5a5' : '#86efac'} />
            <text x="10" y="40" fill={isPhase2Denied ? '#991b1b' : '#059669'} fontSize="7.5" fontFamily="monospace">
              {isPhase2Denied ? '✕ Device Posture: EDR Missing / BitLocker Inactive' : '✔ Device Posture: CrowdStrike Active, OS Patched'}
            </text>

            {/* Check 3: Risk Score */}
            <rect x="0" y="52" width="309" height="22" rx="3" fill={isPhase2Denied ? '#fee2e2' : '#dcfce7'} stroke={isPhase2Denied ? '#fca5a5' : '#86efac'} />
            <text x="10" y="66" fill={isPhase2Denied ? '#991b1b' : '#059669'} fontSize="7.5" fontFamily="monospace">
              {isPhase2Denied ? '✕ Risk Engine: HIGH (Unrecognized Hardware ID)' : '✔ Risk Engine: LOW (Familiar Geo &amp; Behavior)'}
            </text>

            {/* Verdict */}
            <rect x="0" y="78" width="309" height="26" rx="3" fill={isPhase2Denied ? '#fef2f2' : '#f0fdf4'} stroke={isPhase2Denied ? '#ef4444' : '#10b981'} />
            <text x="10" y="94" fill={isPhase2Denied ? '#991b1b' : '#15803d'} fontSize="7.5" fontWeight="bold">
              PDP VERDICT: {isPhase2Denied ? 'EXPLICIT ACCESS DENIAL (DROP)' : 'EPHEMERAL MICRO-TUNNEL PERMITTED'}
            </text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Architecture: <tspan fill="#0284c7" fontWeight="bold">NIST SP 800-207 Zero Trust Reference Model</tspan>
          </text>
        </g>

        {/* Right: Architectural Principles */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">ZERO TRUST CORE FOUNDATIONS:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">1. Never Trust, Always Verify:</text>
            <text x="10" y="27" fill="#475569" fontSize="7">Being inside the corporate office confers 0% implicit trust.</text>
            <text x="10" y="39" fill="#475569" fontSize="7">Every single session is evaluated dynamically.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">2. Application-Level Microsegmentation:</text>
            <text x="10" y="27" fill="#059669" fontSize="7">✔ Users connect only to authorized apps, never the whole network.</text>
            <text x="10" y="39" fill="#059669" fontSize="7">✔ Prevents lateral movement in case of endpoint infection.</text>
            <text x="10" y="50" fill="#0284c7" fontSize="7" fontWeight="bold">✔ Dark Cloud: Apps invisible on public internet.</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 16
            ? 'RESULT: ✓ ZERO TRUST ENFORCED — COMPLIANT ACCESS GRANTED, UNMANAGED DEVICE BLOCKED'
            : currentStepIndex >= 14
            ? 'PHASE 2: UNMANAGED LAPTOP FAILS POSTURE CHECK ➔ ACCESS BLOCKED'
            : currentStepIndex >= 11
            ? 'PHASE 1: MANAGED LAPTOP PASSES CONTEXT EVALUATION ➔ ACCESS GRANTED'
            : 'READY — ADVANCE STEP TO TRACE ZERO TRUST POLICY EVALUATION'}
        </text>
      </g>
    </svg>
  );
};
