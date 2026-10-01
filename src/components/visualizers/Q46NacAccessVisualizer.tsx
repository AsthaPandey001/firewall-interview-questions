import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q46NacAccessVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showSwitch = currentStepIndex >= 1;
  const showNac = currentStepIndex >= 2;
  const showVlans = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isScenarioBQuarantine = currentStepIndex >= 13;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = '802.1X EAPOL';
  let packetSub = 'EAP-TLS Handshake';
  let packetColor = '#0284c7';

  if (currentStepIndex === 5 || currentStepIndex === 6) {
    showPacket = true;
    packetX = 180;
    packetLabel = 'RADIUS ACCESS-REQ';
    packetSub = 'Identity + Cert';
  } else if (currentStepIndex === 7 || currentStepIndex === 8) {
    showPacket = true;
    packetX = 310;
    packetLabel = 'POSTURE ASSESSMENT';
    packetSub = 'Antivirus + EDR Check';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 9 || currentStepIndex === 10) {
    showPacket = true;
    packetX = 310;
    packetLabel = 'RADIUS ACCEPT: VLAN 10';
    packetSub = 'Tunnel-Group: 10 (Prod)';
    packetColor = '#10b981';
  } else if (currentStepIndex === 11 || currentStepIndex === 12) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'PROD VLAN 10 ACCESS';
    packetSub = 'Authorized Corporate Data';
    packetColor = '#10b981';
  } else if (currentStepIndex === 14 || currentStepIndex === 15) {
    showPacket = true;
    packetX = 310;
    packetLabel = 'POSTURE FAILED ✕';
    packetSub = 'RADIUS ACCEPT: VLAN 99';
    packetColor = '#ef4444';
  } else if (currentStepIndex >= 16) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'QUARANTINE VLAN 99';
    packetSub = 'Remediation Server Only';
    packetColor = '#f59e0b';
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
          fill={isScenarioBQuarantine ? '#fffbeb' : currentStepIndex >= 10 ? '#f0fdf4' : '#eff6ff'}
          stroke={isScenarioBQuarantine ? '#fcd34d' : currentStepIndex >= 10 ? '#86efac' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isScenarioBQuarantine ? '#b45309' : currentStepIndex >= 10 ? '#15803d' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isScenarioBQuarantine
            ? 'NAC POSTURE FAILED: NON-COMPLIANT ENDPOINT ISOLATED IN QUARANTINE VLAN 99 FOR REMEDIATION ⚠'
            : currentStepIndex >= 10
            ? 'NAC POSTURE PASSED: 802.1X CERT VALIDATED ➔ DYNAMIC ASSIGNMENT TO PRODUCTION VLAN 10 ✓'
            : 'NETWORK ACCESS CONTROL (NAC) LAB: IEEE 802.1X AUTHENTICATION &amp; DYNAMIC POSTURE ASSESSMENT'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="210" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="270" y1="75" x2="330" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          {/* Top Cable to Prod VLAN */}
          <line x1="410" y1="55" x2="610" y2="55" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />
          {/* Bottom Cable to Quarantine VLAN */}
          <line x1="410" y1="95" x2="610" y2="95" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 5 || currentStepIndex === 14) && (
        <BoldArrow x1="120" y1="75" x2="210" y2="75" color={isScenarioBQuarantine ? '#ef4444' : '#0284c7'} label="EAPOL" />
      )}
      {(currentStepIndex === 11 || currentStepIndex === 12) && (
        <BoldArrow x1="410" y1="55" x2="610" y2="55" color="#10b981" label="VLAN 10 TRAFFIC" />
      )}
      {currentStepIndex >= 16 && (
        <BoldArrow x1="410" y1="95" x2="610" y2="95" color="#f59e0b" label="VLAN 99 ISOLATED" />
      )}

      {/* Client Laptop */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isScenarioBQuarantine ? 'NON-COMPLIANT LAPTOP' : 'CORPORATE LAPTOP'}
        ip={isScenarioBQuarantine ? 'Stale Antivirus / No Patch' : 'EAP-TLS Cert (Healthy)'}
        active
        danger={isScenarioBQuarantine}
        success={currentStepIndex >= 10 && !isScenarioBQuarantine}
      />

      {/* Switch Authenticator */}
      {showSwitch && (
        <g transform="translate(240, 75)">
          <rect
            x="-30"
            y="-22"
            width="60"
            height="38"
            rx="6"
            fill="#0f172a"
            stroke="#0284c7"
            strokeWidth={2}
          />
          <text x="0" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">SWITCH</text>
          <text x="0" y="7" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">802.1X</text>
          <text x="0" y="22" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#0f172a">AUTHENTICATOR</text>
        </g>
      )}

      {/* NAC Server (ISE / ClearPass) */}
      {showNac && (
        <g transform="translate(370, 75)">
          <rect
            x="-38"
            y="-25"
            width="76"
            height="42"
            rx="6"
            fill="#0f172a"
            stroke={isScenarioBQuarantine ? '#f59e0b' : currentStepIndex >= 10 ? '#10b981' : '#0284c7'}
            strokeWidth={2}
          />
          <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">NAC SERVER</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace">ISE / CLEARPASS</text>
          <text x="0" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">RADIUS / POLICY</text>
        </g>
      )}

      {/* Production VLAN 10 */}
      {showVlans && (
        <ServerNodeSVG
          cx={650}
          cy={55}
          label="PRODUCTION VLAN 10"
          sub="Corporate Core Data"
          active
          success={currentStepIndex >= 10 && !isScenarioBQuarantine}
        />
      )}

      {/* Quarantine VLAN 99 */}
      {showVlans && (
        <ServerNodeSVG
          cx={650}
          cy={105}
          label="QUARANTINE VLAN 99"
          sub="Remediation Patch Server"
          active
          danger={isScenarioBQuarantine}
        />
      )}

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={currentStepIndex >= 16 ? 95 : currentStepIndex >= 11 && currentStepIndex <= 12 ? 55 : 75}
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
          802.1X / RADIUS NAC STATE MACHINE &amp; DYNAMIC VLAN AUTHORIZATION
        </text>

        {/* Left: NAC Policy Evaluation Breakdown */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">RADIUS POLICY ASSESSMENT STAGES:</text>

          <g transform="translate(8, 24)">
            <rect x="0" y="0" width="309" height="20" rx="3" fill="#0f172a" />
            <text x="10" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace">Phase             Result           Assigned Action</text>

            <rect x="0" y="24" width="309" height="22" rx="3" fill="#dcfce7" stroke="#86efac" />
            <text x="10" y="38" fill="#059669" fontSize="7.5" fontFamily="monospace">1. 802.1X EAP-TLS   PASSED ✓         Identity: host/laptop01.corp</text>

            <rect x="0" y="48" width="309" height="22" rx="3" fill={isScenarioBQuarantine ? '#fee2e2' : '#dcfce7'} stroke={isScenarioBQuarantine ? '#fca5a5' : '#86efac'} />
            <text x="10" y="62" fill={isScenarioBQuarantine ? '#991b1b' : '#059669'} fontSize="7.5" fontFamily="monospace">
              {isScenarioBQuarantine ? '2. Posture Check   FAILED ✕         AV Definition &gt; 30 days old' : '2. Posture Check   PASSED ✓         AV Up-to-date &amp; BitLocker ON'}
            </text>

            <rect x="0" y="72" width="309" height="26" rx="3" fill={isScenarioBQuarantine ? '#fffbeb' : '#f0fdf4'} stroke={isScenarioBQuarantine ? '#fcd34d' : '#10b981'} />
            <text x="10" y="88" fill={isScenarioBQuarantine ? '#b45309' : '#15803d'} fontSize="7.5" fontWeight="bold">
              {isScenarioBQuarantine
                ? 'RADIUS VSA: Tunnel-Private-Group-ID = 99 (QUARANTINE)'
                : 'RADIUS VSA: Tunnel-Private-Group-ID = 10 (PRODUCTION)'}
            </text>
          </g>

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Switch Port State: <tspan fill={isScenarioBQuarantine ? '#b45309' : '#059669'} fontWeight="bold">{isScenarioBQuarantine ? 'Port in Remediation Mode (VLAN 99)' : 'Port Unblocked in Production Mode (VLAN 10)'}</tspan>
          </text>
        </g>

        {/* Right: Technical Inspector & Architecture */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">NAC SECURITY TRIAD ARCHITECTURE:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">1. Authentication (Who are you?):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">Validates machine &amp; user credentials via 802.1X (EAP-TLS / PEAP).</text>
            <text x="10" y="39" fill="#059669" fontSize="7">Guarantees device is an authentic corporate asset.</text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">2. Posture Assessment (Are you healthy?):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">• Verifies Antivirus, Firewall, OS Hotfixes, and Disk Encryption.</text>
            <text x="10" y="39" fill="#b45309" fontSize="7">• Failed posture isolates host to Quarantine VLAN 99 for auto-patching.</text>
            <text x="10" y="50" fill="#0284c7" fontSize="7" fontWeight="bold">✔ Prevents infected or unpatched machines from contaminating LAN.</text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 16
            ? 'RESULT: ✓ NAC ENFORCEMENT COMPLETE — HEALTHY ➔ PROD VLAN 10, STALE ➔ QUARANTINE VLAN 99'
            : currentStepIndex >= 13
            ? 'SCENARIO B: POSTURE CHECK FAILS ➔ DYNAMICALLY QUARANTINED TO VLAN 99'
            : currentStepIndex >= 10
            ? 'SCENARIO A: ✓ POSTURE COMPLIANT ➔ ACCESS GRANTED TO PRODUCTION VLAN 10'
            : 'READY — ADVANCE STEP TO TRACE NAC 802.1X &amp; POSTURE ASSESSMENT FLOW'}
        </text>
      </g>
    </svg>
  );
};
