import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q49TroubleshootWebsiteVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: User Laptop appears (10.0.1.20)
  // Step 1: Enterprise Firewall appears
  // Step 2: Target Web Server appears (198.51.100.25:443)
  // Step 3: Diagnostic 1: DNS Resolution Test -> Resolved successfully to 198.51.100.25 ✓
  // Step 4: Diagnostic 2: TCP Handshake -> User sends TCP SYN packet to 198.51.100.25:443
  // Step 5: Packet hits Firewall -> DROPPED by implicit block rule (Traffic Fails) ✕
  // Step 6: Diagnostic 3: Log Inspection -> Firewall Syslog: 'DENY src=10.0.1.20 dst=198.51.100.25:443 rule=Default-Drop'
  // Step 7: Diagnostic 4: Policy Remediation -> Admin modifies security policy to permit HTTPS egress
  // Step 8: Diagnostic 5: Verification -> Packet retransmitted -> Allowed through firewall -> Website reached (HTTP 200 OK) ✓

  const isRemediated = currentStepIndex >= 7;
  const isBlockedPhase = currentStepIndex >= 4 && currentStepIndex <= 6;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isSuccessDelivered = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect
          x="0"
          y="0"
          width="680"
          height="24"
          rx="12"
          fill={isSuccessDelivered ? '#ecfdf5' : isBlockedPhase ? '#fef2f2' : '#eff6ff'}
          stroke={isSuccessDelivered ? '#34d399' : isBlockedPhase ? '#f87171' : '#93c5fd'}
        />
        <text
          x="340"
          y="16"
          textAnchor="middle"
          fill={isSuccessDelivered ? '#065f46' : isBlockedPhase ? '#991b1b' : '#1e40af'}
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isSuccessDelivered
            ? 'STEP 5: REMEDIATION APPLIED → HTTPS PERMITTED → WEBSITE REACHED (HTTP 200 OK) ✓'
            : isBlockedPhase
            ? 'STEP 2 & 3: PACKET DROPPED AT FIREWALL → ANALYZING FIREWALL LOGS (DENY RULE MATCH) ✕'
            : 'FIREWALL TROUBLESHOOTING LAB: DIAGNOSING OUTBOUND HTTP/HTTPS ACCESS FAILURE'}
        </text>
      </g>

      {/* Links */}
      {showFw && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 330, y: 170 }}
          color={isSuccessDelivered ? '#10b981' : isBlockedPhase ? '#ef4444' : '#3b82f6'}
          dashed={currentStepIndex < 3}
          label={currentStepIndex >= 3 ? (currentStepIndex === 3 ? 'DNS Resolution OK' : 'TCP SYN :443') : undefined}
        />
      )}

      {showServer && (
        <BoldArrow
          from={{ x: 450, y: 170 }}
          to={{ x: 620, y: 170 }}
          color={isSuccessDelivered ? '#10b981' : '#94a3b8'}
          dashed={!isSuccessDelivered}
          label={isSuccessDelivered ? 'HTTPS Session Established' : undefined}
        />
      )}

      {/* Client */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label="Troubleshooting Client"
          sublabel="10.0.1.20 (VLAN 10)"
          ip="Target: example.com"
        />
      </g>

      {/* Firewall */}
      {showFw && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label="Enterprise Firewall"
            sublabel={isRemediated ? "Rule: 'Allow-Web-Out' Active" : "Rule: 'Default-Block' Active"}
            status={isSuccessDelivered ? 'PERMIT' : isBlockedPhase ? 'DENIED' : 'READY'}
          />
        </g>
      )}

      {/* Web Server */}
      {showServer && (
        <g transform="translate(620, 120)">
          <ServerNodeSVG
            label="Target Web Server"
            sublabel="198.51.100.25:443"
            status={isSuccessDelivered ? 'active' : 'standby'}
          />
          {isSuccessDelivered && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
              <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                HTTP 200 OK ✓
              </text>
            </g>
          )}
        </g>
      )}

      {/* Packets & Diagnostic Overlays */}
      {currentStepIndex === 3 && (
        <PacketCard
          x={210}
          y={145}
          title="DNS LOOKUP TEST"
          src="10.0.1.20"
          dst="8.8.8.8:53"
          detail="Query: example.com -> A 198.51.100.25 (PASS)"
          type="allow"
        />
      )}

      {currentStepIndex === 4 && (
        <PacketCard
          x={210}
          y={145}
          title="TCP SYN PACKET"
          src="10.0.1.20:54321"
          dst="198.51.100.25:443"
          detail="Flags: [SYN] Outbound Connection"
          type="allow"
        />
      )}

      {currentStepIndex === 5 && (
        <PacketCard
          x={340}
          y={235}
          title="BLOCKED AT FIREWALL"
          src="10.0.1.20"
          dst="198.51.100.25:443"
          detail="Implicit Deny matched (No outbound rule)"
          type="deny"
        />
      )}

      {currentStepIndex === 6 && (
        <g transform="translate(200, 240)">
          <rect x="0" y="0" width="360" height="50" rx="6" fill="#0f172a" stroke="#f87171" strokeWidth="1.5" />
          <text x="12" y="18" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="monospace">
            [FIREWALL SYSLOG - RULE HIT]
          </text>
          <text x="12" y="34" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            action=DROP src=10.0.1.20 dst=198.51.100.25:443 reason=RULE_DEFAULT_DENY
          </text>
        </g>
      )}

      {currentStepIndex === 7 && (
        <g transform="translate(200, 240)">
          <rect x="0" y="0" width="360" height="50" rx="6" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
          <text x="12" y="18" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
            [POLICY REMEDIATION APPLIED]
          </text>
          <text x="12" y="34" fill="#a7f3d0" fontSize="8" fontFamily="monospace">
            rule add: permit src 10.0.1.0/24 dst any port 443 app ssl/web-browsing
          </text>
        </g>
      )}

      {currentStepIndex === 8 && (
        <PacketCard
          x={510}
          y={145}
          title="SESSION ESTABLISHED"
          src="10.0.1.20"
          dst="198.51.100.25:443"
          detail="3-Way Handshake Complete | Data Flowing"
          type="allow"
        />
      )}
    </svg>
  );
};
