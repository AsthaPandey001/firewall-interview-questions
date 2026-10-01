import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q45LeastPrivilegeVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showRbac = currentStepIndex >= 1;
  const showResA = currentStepIndex >= 2;
  const showResB = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isScenario2Denied = currentStepIndex >= 10;

  let packetX = -100;
  let packetY = 55;
  let showPacket = false;
  let packetLabel = 'AUTH REQ';
  let packetSub = 'Helpdesk Ticket';
  let packetColor = '#0284c7';

  if (currentStepIndex === 5 || currentStepIndex === 6) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'GET /tickets:443';
    packetSub = 'Role: Helpdesk_Tier1';
  } else if (currentStepIndex === 7) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'RBAC PERMIT ✓';
    packetSub = '➔ Ticketing System';
    packetColor = '#10b981';
  } else if (currentStepIndex === 8 || currentStepIndex === 9) {
    showPacket = true;
    packetX = 650;
    packetLabel = 'TICKETS SERVED ✓';
    packetSub = 'Authorized Access';
    packetColor = '#10b981';
  } else if (currentStepIndex === 10 || currentStepIndex === 11) {
    showPacket = true;
    packetY = 105;
    packetX = 230;
    packetLabel = 'CONNECT SQL:1433';
    packetSub = 'Production DB Query';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 12 || currentStepIndex === 13) {
    showPacket = true;
    packetY = 105;
    packetX = 370;
    packetLabel = 'MISSING PRIVILEGE ✕';
    packetSub = 'Requires DBA_Admin Role';
    packetColor = '#ef4444';
  } else if (currentStepIndex >= 14) {
    showPacket = true;
    packetY = 105;
    packetX = 340;
    packetLabel = 'ACCESS DENIED ✕';
    packetSub = 'Blast Radius Contained';
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
          fill={isScenario2Denied ? '#fef2f2' : '#eff6ff'}
          stroke={isScenario2Denied ? '#fca5a5' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isScenario2Denied ? '#991b1b' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isScenario2Denied
            ? 'LEAST PRIVILEGE ENFORCED: HELPDESK USER DENIED ACCESS TO PRODUCTION SQL DB (PORT 1433) ✕'
            : 'PRINCIPLE OF LEAST PRIVILEGE (PoLP): USERS RECEIVE ONLY EXACT MINIMAL ACCESS NEEDED FOR JOB FUNCTION'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          {/* Upper Cable to Ticketing */}
          <line x1="120" y1="55" x2="330" y2="55" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="55" x2="610" y2="55" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />

          {/* Lower Cable to SQL */}
          <line x1="120" y1="95" x2="330" y2="95" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="95" x2="610" y2="95" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 6 || currentStepIndex === 7) && (
        <BoldArrow x1="120" y1="55" x2="610" y2="55" color="#10b981" label="TICKETING PERMITTED" />
      )}
      {currentStepIndex === 11 && (
        <BoldArrow x1="120" y1="95" x2="330" y2="95" color="#ef4444" label="SQL REQUEST" />
      )}

      {/* Client User */}
      <LaptopNode
        cx={80}
        cy={75}
        label="IT HELPDESK AGENT"
        ip="Role: Helpdesk_Tier1"
        active
        danger={isScenario2Denied}
        success={currentStepIndex >= 7 && !isScenario2Denied}
      />

      {/* RBAC Policy Engine */}
      {showRbac && (
        <g transform="translate(370, 75)">
          <rect
            x="-44"
            y="-25"
            width="88"
            height="42"
            rx="6"
            fill="#0f172a"
            stroke={isScenario2Denied ? '#ef4444' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">RBAC ENGINE</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">IAM / PAM POLICIES</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">AUTHORIZATION GATE</text>
        </g>
      )}

      {/* Resource A: Helpdesk Ticketing */}
      {showResA && (
        <ServerNodeSVG
          cx={650}
          cy={55}
          label="HELPDESK TICKETING"
          sub="Port 443 (Authorized ✓)"
          active
          success={currentStepIndex >= 7 && !isScenario2Denied}
        />
      )}

      {/* Resource B: Production SQL DB */}
      {showResB && (
        <ServerNodeSVG
          cx={650}
          cy={105}
          label="PRODUCTION SQL DB"
          sub="Port 1433 (Admin Only ✕)"
          active
          danger={isScenario2Denied}
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
          dropped={isScenario2Denied && currentStepIndex >= 14}
        />
      )}

      {/* Drop marker */}
      {isScenario2Denied && currentStepIndex >= 14 && (
        <g transform="translate(330, 95)">
          <line x1="-12" y1="-12" x2="12" y2="12" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="12" y1="-12" x2="-12" y2="12" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          ROLE-BASED ACCESS CONTROL (RBAC) MATRIX &amp; PRIVILEGE BOUNDARIES
        </text>

        {/* Left: Role Permission Table */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">ENTERPRISE IAM PERMISSION MATRIX:</text>

          <g transform="translate(8, 24)">
            <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
            <text x="10" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace">Role Name         Target Resource      Port   Permission</text>

            <rect x="0" y="24" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="38" fill="#059669" fontSize="7.5" fontFamily="monospace">Helpdesk_Tier1    Helpdesk Ticketing   443    ALLOW ✓</text>

            <rect x="0" y="48" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="62" fill="#059669" fontSize="7.5" fontFamily="monospace">Helpdesk_Tier1    AD Password Reset    636    ALLOW ✓</text>

            <rect x="0" y="72" width="309" height="24" rx="3" fill={isScenario2Denied ? '#fee2e2' : '#ffffff'} stroke={isScenario2Denied ? '#fca5a5' : '#e2e8f0'} />
            <text x="10" y="88" fill={isScenario2Denied ? '#991b1b' : '#64748b'} fontSize="7.5" fontFamily="monospace">Helpdesk_Tier1    Production SQL DB    1433   DENY ✕ (Missing DBA_Admin)</text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Audit State: <tspan fill={isScenario2Denied ? '#b91c1c' : '#059669'} fontWeight="bold">{isScenario2Denied ? 'Privilege Escalation Attempt Blocked &amp; Logged' : 'Normal Authorized Operations'}</tspan>
          </text>
        </g>

        {/* Right: Security Blast Radius Breakdown */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">BLAST RADIUS REDUCTION PRINCIPLES:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">1. Credential Compromise Containment:</text>
            <text x="10" y="27" fill="#475569" fontSize="7">Even if an attacker phishes the Helpdesk Agent credentials,</text>
            <text x="10" y="39" fill="#059669" fontSize="7">they CANNOT access the production SQL database.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">2. Just-In-Time (JIT) &amp; PAM Elevation:</text>
            <text x="10" y="27" fill="#475569" fontSize="7">• Admins should not have permanent root/DBA privileges.</text>
            <text x="10" y="39" fill="#475569" fontSize="7">• Request temporary elevation via Privileged Access Management (PAM).</text>
            <text x="10" y="50" fill="#0284c7" fontSize="7" fontWeight="bold">✔ Time-bound (e.g., 2 hours) with full session recording.</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 14
            ? 'RESULT: ✓ LEAST PRIVILEGE PREVENTED UNAUTHORIZED SQL ACCESS — ZERO COMPROMISE'
            : currentStepIndex >= 10
            ? 'SCENARIO 2: USER ATTEMPTS UNAUTHORIZED PRODUCTION SQL ACCESS (PORT 1433)'
            : currentStepIndex >= 7
            ? 'SCENARIO 1: ✓ AUTHORIZED ACCESS TO HELPDESK TICKETING GRANTED'
            : 'READY — ADVANCE STEP TO TRACE PRINCIPLE OF LEAST PRIVILEGE ENFORCEMENT'}
        </text>
      </g>
    </svg>
  );
};
