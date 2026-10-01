import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q50TroubleshootServerVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Internal LAN Reachability Check (Steps 0-3)
  // Step 1: Internal LAN Client appears (10.0.5.25)
  // Step 2: Internal Application Server appears (10.0.5.100:443)
  // Step 3: Internal Client sends ping/HTTPS request -> Direct LAN route -> Server Responds (INTERNAL TEST: PASS ✓) - STOP
  //
  // Scenario 2: External WAN Inbound Diagnosis & DNAT Remediation (Steps 4-9)
  // Step 4: External Internet User appears (203.0.113.88)
  // Step 5: Perimeter Firewall with NAT Engine appears
  // Step 6: External packet sent to Public IP (198.51.100.50:443) -> Hits Firewall -> DNAT Missing! (PACKET DROPPED ✕)
  // Step 7: Log Analysis shows: Inbound ACL passed, but Destination NAT Rule not defined
  // Step 8: Remediation: Admin adds DNAT Rule (198.51.100.50:443 -> 10.0.5.100:443)
  // Step 9: Inbound request retransmitted -> DNAT translates DST to 10.0.5.100 -> Server responds -> EXTERNAL TEST: PASS ✓

  const isExternalPhase = currentStepIndex >= 4;

  const showInternalLAN = currentStepIndex <= 3;
  const showFirewall = currentStepIndex >= 5;
  const showServer = true;

  const isInternalSuccess = currentStepIndex === 3;
  const isDnatDropped = currentStepIndex === 6;
  const isExternalSuccess = currentStepIndex >= 8;

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
          fill={isExternalSuccess ? '#ecfdf5' : isDnatDropped ? '#fef2f2' : isExternalPhase ? '#eff6ff' : '#f0fdf4'}
          stroke={isExternalSuccess ? '#34d399' : isDnatDropped ? '#f87171' : isExternalPhase ? '#93c5fd' : '#86efac'}
        />
        <text
          x="340"
          y="16"
          textAnchor="middle"
          fill={isExternalSuccess ? '#065f46' : isDnatDropped ? '#991b1b' : isExternalPhase ? '#1e40af' : '#166534'}
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isExternalSuccess
            ? 'STEP 5: DNAT PORT-FORWARD CONFIGURED → PUBLIC IP TRANSLATED TO 10.0.5.100 → FULL ACCESS ✓'
            : isDnatDropped
            ? 'STEP 3: EXTERNAL TEST FAILED → FIREWALL MISSING DESTINATION NAT (DNAT) FOR PORT 443 ✕'
            : isExternalPhase
            ? 'PHASE 2: EXTERNAL INBOUND TROUBLESHOOTING (TESTING PUBLIC IP: 198.51.100.50:443)'
            : 'PHASE 1: INTERNAL LAN REACHABILITY TEST (DIRECT 10.0.5.0/24 SUBNET ACCESS)'}
        </text>
      </g>

      {/* Connection Links */}
      {showInternalLAN && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 620, y: 170 }}
          color={isInternalSuccess ? '#10b981' : '#3b82f6'}
          dashed={currentStepIndex < 2}
          label={currentStepIndex >= 2 ? 'Direct LAN Subnet (10.0.5.0/24)' : undefined}
        />
      )}

      {isExternalPhase && showFirewall && (
        <>
          <BoldArrow
            from={{ x: 130, y: 170 }}
            to={{ x: 330, y: 170 }}
            color={isExternalSuccess ? '#10b981' : isDnatDropped ? '#ef4444' : '#3b82f6'}
            dashed={currentStepIndex < 6}
            label="Inbound WAN (198.51.100.50:443)"
          />
          <BoldArrow
            from={{ x: 450, y: 170 }}
            to={{ x: 620, y: 170 }}
            color={isExternalSuccess ? '#10b981' : '#94a3b8'}
            dashed={!isExternalSuccess}
            label={isExternalSuccess ? 'DNAT Translated -> 10.0.5.100' : 'Internal LAN Path'}
          />
        </>
      )}

      {/* Left Node */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label={isExternalPhase ? 'External WAN Client' : 'Internal LAN Client'}
          sublabel={isExternalPhase ? 'IP: 203.0.113.88 (Internet)' : 'IP: 10.0.5.25 (Private LAN)'}
          ip={isExternalPhase ? 'Target: 198.51.100.50:443' : 'Target: 10.0.5.100:443'}
        />
      </g>

      {/* Middle Firewall Node (External Phase only) */}
      {isExternalPhase && showFirewall && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label="Perimeter Firewall & NAT"
            sublabel={isExternalSuccess ? 'DNAT: 198.51.100.50 -> 10.0.5.100' : 'DNAT: Not Configured'}
            status={isExternalSuccess ? 'PERMIT' : isDnatDropped ? 'DENIED' : 'READY'}
          />
        </g>
      )}

      {/* Right Server Node */}
      {showServer && (
        <g transform="translate(620, 120)">
          <ServerNodeSVG
            label="Internal Web/App Server"
            sublabel="Private IP: 10.0.5.100:443"
            status={isInternalSuccess || isExternalSuccess ? 'active' : 'standby'}
          />
          {(isInternalSuccess || isExternalSuccess) && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
              <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                REACHABLE ✓
              </text>
            </g>
          )}
        </g>
      )}

      {/* Internal Phase Packets */}
      {currentStepIndex === 2 && (
        <PacketCard
          x={370}
          y={145}
          title="INTERNAL LAN PACKET"
          src="10.0.5.25"
          dst="10.0.5.100:443"
          detail="Direct Layer 2 ARP & TCP SYN"
          type="allow"
        />
      )}

      {/* External Phase Packets & Diagnostics */}
      {currentStepIndex === 5 && (
        <PacketCard
          x={210}
          y={145}
          title="EXTERNAL WAN PACKET"
          src="203.0.113.88"
          dst="198.51.100.50:443"
          detail="Request to Public Virtual IP"
          type="allow"
        />
      )}

      {isDnatDropped && (
        <PacketCard
          x={340}
          y={235}
          title="BLOCKED: NO DNAT TRANSLATION"
          src="203.0.113.88"
          dst="198.51.100.50:443"
          detail="No translation rule exists for internal private host"
          type="deny"
        />
      )}

      {currentStepIndex === 7 && (
        <g transform="translate(200, 240)">
          <rect x="0" y="0" width="360" height="50" rx="6" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
          <text x="12" y="18" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
            [DNAT REMEDIATION CONFIGURED]
          </text>
          <text x="12" y="34" fill="#a7f3d0" fontSize="8" fontFamily="monospace">
            nat (outside,inside) static 10.0.5.100 service tcp 443 443
          </text>
        </g>
      )}

      {isExternalSuccess && (
        <PacketCard
          x={510}
          y={145}
          title="DNAT TRANSLATED PACKET"
          src="203.0.113.88"
          dst="10.0.5.100:443"
          detail="Destination translated & Routed to Internal Server"
          type="allow"
        />
      )}
    </svg>
  );
};
