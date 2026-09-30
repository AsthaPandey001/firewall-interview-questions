import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q17SegmentationVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Show 4 Isolated Security Zones (Internet, DMZ, App Tier, Database)
  // Step 1: Normal allowed 3-tier communication: Web Proxy -> App Server -> Database
  // Step 2: Unauthorized Direct Path: Internet -> Database directly (RED BLOCKED ✕)
  // Step 3: Legitimate authorized path: App -> Database on Port 5432 (GREEN ALLOWED ✓)
  // Step 4: Attacker compromises DMZ host and tries lateral movement pivot directly to Database (RED BLOCKED ✕)
  // Step 5: Final Segmentation Architecture Summary

  const isNormalFlow = currentStepIndex === 1;
  const isDirectAttackBlocked = currentStepIndex === 2;
  const isLegitimateAppToDb = currentStepIndex === 3;
  const isLateralPivotBlocked = currentStepIndex === 4;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* 4 Security Zone Background Panels */}
      {/* ZONE 1: PUBLIC INTERNET */}
      <g transform="translate(15, 15)">
        <rect x="0" y="0" width="165" height="185" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
        <rect x="0" y="0" width="165" height="24" rx="7" fill="#ef4444" />
        <text x="82" y="16" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">ZONE 1: UNTRUSTED WAN</text>
        <LaptopNode cx={82} cy={95} label="INTERNET" ip="198.51.100.1" active danger={isDirectAttackBlocked} />
      </g>

      {/* ZONE 2: DMZ (PUBLIC WEB / PROXY) */}
      <g transform="translate(195, 15)">
        <rect x="0" y="0" width="170" height="185" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="0" y="0" width="170" height="24" rx="7" fill="#3b82f6" />
        <text x="85" y="16" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">ZONE 2: DMZ (WEB PROXY)</text>
        <ServerNodeSVG cx={85} cy={95} label="DMZ NGINX" sub="172.16.1.10:443" active danger={isLateralPivotBlocked} />
      </g>

      {/* ZONE 3: APP TIER */}
      <g transform="translate(380, 15)">
        <rect x="0" y="0" width="170" height="185" rx="8" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.5" />
        <rect x="0" y="0" width="170" height="24" rx="7" fill="#8b5cf6" />
        <text x="85" y="16" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">ZONE 3: APP CLUSTER</text>
        <ServerNodeSVG cx={85} cy={95} label="APP LOGIC" sub="10.0.2.20:8080" active success={isLegitimateAppToDb} />
      </g>

      {/* ZONE 4: SECURE ISOLATED DATABASE */}
      <g transform="translate(565, 15)">
        <rect x="0" y="0" width="180" height="185" rx="8" fill="#ecfdf5" stroke="#86efac" strokeWidth="1.5" />
        <rect x="0" y="0" width="180" height="24" rx="7" fill="#10b981" />
        <text x="90" y="16" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">ZONE 4: ISOLATED DB</text>
        <ServerNodeSVG cx={90} cy={95} label="DATABASE" sub="10.0.3.50 (VLAN 30)" active success />
      </g>

      {/* Inter-Zone Micro-Segmentation Firewalls (Shields on Zone Borders) */}
      <g transform="translate(180, 110)">
        <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
        <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">FW1</text>
      </g>

      <g transform="translate(372, 110)">
        <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
        <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">FW2</text>
      </g>

      <g transform="translate(557, 110)">
        <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
        <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">FW3</text>
      </g>

      {/* Dynamic Path Flows */}
      {/* Normal 3-tier legitimate flow */}
      {isNormalFlow && (
        <>
          <BoldArrow x1={140} y1={110} x2={230} y2={110} color="#3b82f6" label="HTTPS :443" />
          <BoldArrow x1={330} y1={110} x2={415} y2={110} color="#8b5cf6" label="API :8080" />
          <BoldArrow x1={515} y1={110} x2={605} y2={110} color="#10b981" label="SQL :5432" />
        </>
      )}

      {/* Direct Internet -> Database Attack (BLOCKED BY BOUNDARY FW) */}
      {isDirectAttackBlocked && (
        <>
          <path d="M 97 140 Q 375 20 655 140" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="6 4" />
          <g transform="translate(375, 45)">
            <rect x="-110" y="-12" width="220" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              DIRECT ACCESS BLOCKED ✕ (NO ROUTE)
            </text>
          </g>
        </>
      )}

      {/* Legitimate App to DB */}
      {isLegitimateAppToDb && (
        <BoldArrow x1={515} y1={110} x2={605} y2={110} color="#10b981" label="DB PORT 5432 ALLOWED ✓" />
      )}

      {/* Lateral Movement Attempt from Compromised DMZ host */}
      {isLateralPivotBlocked && (
        <>
          <path d="M 280 140 Q 460 170 610 140" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="6 4" />
          <g transform="translate(460, 160)">
            <rect x="-120" y="-12" width="240" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              LATERAL PIVOT DROPPED ✕ (VLAN ACL)
            </text>
          </g>
        </>
      )}

      {/* Lower Security Principle Breakdown */}
      <g transform="translate(15, 210)">
        <rect x="0" y="0" width="730" height="120" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="730" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          NETWORK SEGMENTATION & DEFENSE-IN-DEPTH SECURITY ARCHITECTURE
        </text>

        <g transform="translate(16, 36)">
          <text x="0" y="15" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            1. Blast Radius Containment:
          </text>
          <text x="175" y="15" fill="#475569" fontSize="8">
            If a public DMZ web server is compromised, strict inter-VLAN ACLs prevent attackers from pivoting directly into the database tier.
          </text>

          <text x="0" y="35" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            2. Least Privilege Boundaries:
          </text>
          <text x="175" y="35" fill="#475569" fontSize="8">
            Only the App tier (10.0.2.0/24) has an explicit rule allowing port 5432 to the database. All other subnets are implicitly dropped.
          </text>

          <text x="0" y="55" fill="#059669" fontSize="8.5" fontWeight="bold">
            3. Regulatory Compliance:
          </text>
          <text x="175" y="55" fill="#475569" fontSize="8">
            PCI-DSS and HIPAA mandate complete isolation of Cardholder / Patient Data Environments (CDE) from public-facing infrastructure.
          </text>
        </g>
      </g>
    </svg>
  );
};
