import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q22DmzProtectionVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Internet appears
  // Step 2: Perimeter Firewall appears
  // Step 3: DMZ Zone boundary appears
  // Step 4: Web Server inside DMZ appears
  // Step 5: Internal Network Zone appears
  // Step 6: Internal Database Server appears
  // Step 7: External User sends HTTPS packet to Firewall (Port 443)
  // Step 8: Firewall checks policy: Ext -> DMZ Web: ALLOW
  // Step 9: Packet delivers to DMZ Web Server (DMZ Accessible)
  // Step 10: DMZ Web Server sends backend query (Port 5432) to Internal DB
  // Step 11: Internal query arrives at DB Server (Internal flow OK)
  // Step 12: Attacker attempts direct attack: Internet -> Internal DB (Port 3306/5432)
  // Step 13: Perimeter Firewall DROPS attack: ✕ DIRECT INTERNET ACCESS TO DATABASE BLOCKED!

  const showFw = currentStepIndex >= 1;
  const showDmz = currentStepIndex >= 2;
  const showWebServer = currentStepIndex >= 3;
  const showInternalZone = currentStepIndex >= 4;
  const showDbServer = currentStepIndex >= 5;

  const isExtWebAllowed = currentStepIndex >= 8 && currentStepIndex <= 9;
  const isDbQuery = currentStepIndex >= 10 && currentStepIndex <= 11;
  const isAttackAttempt = currentStepIndex >= 12;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Visual DMZ Buffer Zone Box */}
      {showDmz && (
        <g transform="translate(320, 20)">
          <rect x="0" y="0" width="160" height="110" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />
          <text x="80" y="16" textAnchor="middle" fill="#1d4ed8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            🛡️ DMZ BUFFER ZONE
          </text>
        </g>
      )}

      {/* Visual Internal Network Zone Box */}
      {showInternalZone && (
        <g transform="translate(540, 20)">
          <rect x="0" y="0" width="170" height="110" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
          <text x="85" y="16" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="bold" fontFamily="monospace">
            🔒 INTERNAL SECURE ZONE
          </text>
        </g>
      )}

      {/* Nodes: Internet -> Firewall -> DMZ Web Server -> Internal DB */}
      <LaptopNode cx={70} cy={75} label={isAttackAttempt ? 'ATTACKER' : 'INTERNET USER'} ip={isAttackAttempt ? '198.51.100.99' : 'WAN'} active danger={isAttackAttempt} />

      {showFw && (
        <FirewallGatewayNode cx={230} cy={75} label="PERIMETER FW" sub="DMZ Policy Gate" active success={isExtWebAllowed} danger={isAttackAttempt} />
      )}

      {showWebServer && (
        <ServerNodeSVG cx={400} cy={75} label="DMZ WEB SERVER" sub="10.0.1.10:443" active success={isExtWebAllowed || isDbQuery} />
      )}

      {showDbServer && (
        <ServerNodeSVG cx={625} cy={75} label="DATABASE SERVER" sub="10.0.2.50:5432" active success={isDbQuery} danger={false} />
      )}

      {/* Traffic Arrows */}
      {currentStepIndex === 7 && (
        <BoldArrow x1={105} y1={75} x2={185} y2={75} color="#2563eb" label="HTTPS :443" />
      )}
      {currentStepIndex === 8 && (
        <BoldArrow x1={270} y1={75} x2={355} y2={75} color="#10b981" label="ALLOWED TO DMZ" />
      )}
      {currentStepIndex === 10 && (
        <BoldArrow x1={445} y1={75} x2={580} y2={75} color="#8b5cf6" label="DB QUERY :5432" />
      )}
      {currentStepIndex >= 12 && (
        <g>
          <BoldArrow x1={105} y1={75} x2={185} y2={75} color="#ef4444" label="EXPLOIT :5432" />
          <g transform="translate(230, 75)">
            <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <rect x="55" y="-12" width="95" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
            <text x="102" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
              BLOCKED ✕
            </text>
          </g>
        </g>
      )}

      {/* Lower Architectural Rule & Policy Matrix */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DMZ (DEMILITARIZED ZONE) MULTI-TIER SECURITY ARCHITECTURE
        </text>

        {/* 3 Core Multi-tier Policy Rules */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="216" height="88" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="10" y="16" fill="#1e40af" fontSize="8" fontWeight="bold">1. INTERNET → DMZ</text>
          <text x="10" y="32" fill="#059669" fontSize="7.5" fontWeight="bold">Action: ALLOW :80/:443</text>
          <text x="10" y="48" fill="#64748b" fontSize="7">Public users reach Web Proxy / Nginx reverse proxy in DMZ only.</text>
          <text x="10" y="74" fill="#1e40af" fontSize="7" fontFamily="monospace">Zone: Untrust ➔ DMZ</text>

          <rect x="226" y="0" width="216" height="88" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="10" y="16" fill="#065f46" fontSize="8" fontWeight="bold">2. DMZ → INTERNAL DB</text>
          <text x="10" y="32" fill="#059669" fontSize="7.5" fontWeight="bold">Action: ALLOW :5432</text>
          <text x="10" y="48" fill="#64748b" fontSize="7">Web server queries DB over internal firewall. No direct route.</text>
          <text x="10" y="74" fill="#065f46" fontSize="7" fontFamily="monospace">Zone: DMZ ➔ Internal</text>

          <rect x="452" y="0" width="216" height="88" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text x="10" y="16" fill="#991b1b" fontSize="8" fontWeight="bold">3. INTERNET → INTERNAL DB</text>
          <text x="10" y="32" fill="#dc2626" fontSize="7.5" fontWeight="bold">Action: STRICT DENY ✕</text>
          <text x="10" y="48" fill="#64748b" fontSize="7">Direct access prohibited. Database never exposed to WAN.</text>
          <text x="10" y="74" fill="#991b1b" fontSize="7" fontFamily="monospace">Implicit Deny Enforced</text>
        </g>

        <g transform="translate(16, 134)">
          <rect x="0" y="0" width="668" height="40" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            CRUCIAL INTERVIEW TAKEAWAY: A DMZ acts as a buffer zone preventing compromised web servers from compromising internal databases.
          </text>
          <text x="14" y="29" fill="#64748b" fontSize="7.5">
            Even if an attacker gains root on the DMZ web server, firewall rules strictly prohibit the DMZ from initiating inbound connections into the LAN.
          </text>
        </g>
      </g>
    </svg>
  );
};
