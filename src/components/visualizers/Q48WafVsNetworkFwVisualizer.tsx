import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q48WafVsNetworkFwVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Network Firewall Layer 3/4 Inspection (Steps 0-4)
  // Step 1: Client appears
  // Step 2: Network Firewall (L3/L4) appears
  // Step 3: Web Server appears
  // Step 4: Client sends packet with HTTP payload to port 443 -> Network FW checks IP + Port 443 (ALLOW)
  // Step 5: Network FW passes packet (L3/L4 cannot inspect SQLi payload) -> Delivered to server - STOP
  //
  // Scenario 2: Web Application Firewall (WAF Layer 7) (Steps 5-9)
  // Step 6: Malicious Client sends HTTP SQL Injection payload: GET /search?q=' OR 1=1--
  // Step 7: WAF appears in front of Web Server
  // Step 8: WAF inspects HTTP headers, parameters, and decodes application payload
  // Step 9: WAF matches OWASP SQLi rule -> Emits HTTP 403 Forbidden -> BLOCKED ✕

  const isWafPhase = currentStepIndex >= 5;

  const showInspectionDevice = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isL3Allowed = currentStepIndex >= 3 && currentStepIndex <= 4;
  const isWafBlocked = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isWafPhase ? '#fef2f2' : '#eff6ff'} stroke={isWafPhase ? '#f87171' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isWafPhase ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isWafPhase
            ? 'PART B: WAF (LAYER 7) → DECODES HTTP/HTTPS PAYLOAD → BLOCKS SQL INJECTION / OWASP TOP 10 ✕'
            : 'PART A: NETWORK FIREWALL (LAYER 3/4) → CHECKS ONLY IP & PORT → PASSES TRAFFIC TO PORT 443 ✓'}
        </text>
      </g>

      {/* Links */}
      {showInspectionDevice && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 330, y: 170 }}
          color={isWafPhase ? (isWafBlocked ? '#ef4444' : '#64748b') : (isL3Allowed ? '#3b82f6' : '#94a3b8')}
          dashed={currentStepIndex < 3}
          label={currentStepIndex >= 3 ? (isWafPhase ? "GET /search?q=' OR 1=1" : 'TCP SYN / Port 443') : undefined}
        />
      )}

      {showServer && (
        <BoldArrow
          from={{ x: 450, y: 170 }}
          to={{ x: 620, y: 170 }}
          color={isWafPhase ? '#ef4444' : (isL3Allowed ? '#10b981' : '#94a3b8')}
          dashed={isWafPhase || !isL3Allowed}
          label={isWafPhase ? (isWafBlocked ? '✕ Request Dropped (HTTP 403)' : undefined) : (isL3Allowed ? 'Port 443 Allowed' : undefined)}
        />
      )}

      {/* Client */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label={isWafPhase ? 'Attacker / Bad Client' : 'Standard Web User'}
          sublabel={isWafPhase ? 'Payload: SQL Injection' : 'Legitimate User'}
          ip={isWafPhase ? 'IP: 198.51.100.99' : 'IP: 192.168.1.50'}
        />
      </g>

      {/* Device: Network FW vs WAF */}
      {showInspectionDevice && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label={isWafPhase ? 'WAF (Layer 7)' : 'Network Firewall (L3/L4)'}
            sublabel={isWafPhase ? 'OWASP / ModSecurity Engine' : 'Stateful Packet Filter'}
            status={isWafPhase ? (isWafBlocked ? 'DENIED' : 'INSPECTING') : (isL3Allowed ? 'PERMIT' : 'READY')}
          />
        </g>
      )}

      {/* Server */}
      {showServer && (
        <g transform="translate(620, 120)">
          <ServerNodeSVG
            label="Corporate Web Server"
            sublabel="eCommerce App (Port 443)"
            status={isWafPhase ? (isWafBlocked ? 'active' : 'standby') : (isL3Allowed ? 'active' : 'standby')}
          />
          {isL3Allowed && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
              <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                DELIVERED ✓
              </text>
            </g>
          )}
          {isWafBlocked && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
              <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                PROTECTED ✓
              </text>
            </g>
          )}
        </g>
      )}

      {/* Packets */}
      {currentStepIndex === 3 && (
        <PacketCard
          x={210}
          y={145}
          title="L3/L4 PACKET"
          src="192.168.1.50"
          dst="Web Server :443"
          detail="Layer 4 Check: Port 443 -> Match Allow"
          type="allow"
        />
      )}

      {currentStepIndex === 4 && (
        <PacketCard
          x={510}
          y={145}
          title="DELIVERED (BLIND L7)"
          src="192.168.1.50"
          dst="Web Server"
          detail="Network FW does not parse HTTP payload"
          type="allow"
        />
      )}

      {currentStepIndex === 6 && (
        <PacketCard
          x={190}
          y={145}
          title="L7 HTTP PAYLOAD"
          src="198.51.100.99"
          dst="Web Server :443"
          detail="URI: /search?q=' UNION SELECT..."
          type="deny"
        />
      )}

      {currentStepIndex >= 7 && isWafPhase && (
        <PacketCard
          x={340}
          y={235}
          title={isWafBlocked ? "WAF BLOCKS SQLi (403 FORBIDDEN)" : "INSPECTING HTTP REQUEST BODY"}
          src="198.51.100.99"
          dst="Corporate Web Server"
          detail="OWASP Signature 942100 Matched"
          type="deny"
        />
      )}
    </svg>
  );
};
