import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q46NacAccessVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Compliant Device (Steps 0-4)
  // Step 1: Corporate Endpoint connects to 802.1X Edge Switch
  // Step 2: NAC / RADIUS Policy Server (Cisco ISE / Aruba ClearPass) appears
  // Step 3: Corporate Production VLAN & Quarantine VLAN appear
  // Step 4: Endpoint sends 802.1X EAP identity -> NAC inspects posture (AV Active, Patch OK)
  // Step 5: Posture Compliant -> Dynamic VLAN Assignment (VLAN 10 Production) -> GRANTED ✓
  //
  // Scenario 2: Non-compliant / BYOD Device (Steps 5-9)
  // Step 6: Non-compliant device connects (Missing AV / Jailbroken)
  // Step 7: NAC evaluates posture check
  // Step 8: Posture failure detected (Antivirus signature outdated > 30 days)
  // Step 9: NAC issues Quarantine VLAN (VLAN 99) -> Redirected to Remediation Server ✕

  const isNonCompliantPhase = currentStepIndex >= 5;

  const showNac = currentStepIndex >= 1;
  const showVlans = currentStepIndex >= 2;

  const isCompliantAllowed = currentStepIndex >= 3 && currentStepIndex <= 4;
  const isQuarantined = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isNonCompliantPhase ? '#fef2f2' : '#ecfdf5'} stroke={isNonCompliantPhase ? '#f87171' : '#34d399'} />
        <text x="340" y="16" textAnchor="middle" fill={isNonCompliantPhase ? '#991b1b' : '#065f46'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isNonCompliantPhase
            ? 'ENDPOINT 2: FAILED POSTURE (NO AV) → QUARANTINED TO VLAN 99 (REMEDIATION) ✕'
            : 'ENDPOINT 1: VALID 802.1X + PASS POSTURE → ASSIGNED TO PRODUCTION VLAN 10 ✓'}
        </text>
      </g>

      {/* Links */}
      {showNac && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 330, y: 170 }}
          color={isNonCompliantPhase ? (isQuarantined ? '#f59e0b' : '#64748b') : (isCompliantAllowed ? '#10b981' : '#3b82f6')}
          dashed={currentStepIndex < 3}
          label={currentStepIndex >= 3 ? '802.1X EAP / Posture' : undefined}
        />
      )}

      {showVlans && (
        <>
          <BoldArrow
            from={{ x: 450, y: 150 }}
            to={{ x: 620, y: 110 }}
            color={isCompliantAllowed ? '#10b981' : '#94a3b8'}
            dashed={!isCompliantAllowed}
            label={isCompliantAllowed ? 'VLAN 10 (Prod Access)' : undefined}
          />
          <BoldArrow
            from={{ x: 450, y: 190 }}
            to={{ x: 620, y: 240 }}
            color={isQuarantined ? '#f59e0b' : '#94a3b8'}
            dashed={!isQuarantined}
            label={isQuarantined ? 'VLAN 99 (Quarantine / Patch)' : undefined}
          />
        </>
      )}

      {/* Endpoint */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label={isNonCompliantPhase ? 'Unmanaged / BYOD' : 'Corporate Laptop'}
          sublabel={isNonCompliantPhase ? 'Posture: AV Disabled' : 'Posture: Healthy & EDR Up'}
          ip={isNonCompliantPhase ? 'MAC: b4:99:ba:01:23' : 'MAC: 00:50:56:c0:00'}
        />
      </g>

      {/* NAC Controller */}
      {showNac && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label="NAC Policy Engine"
            sublabel="802.1X / RADIUS Server"
            status={isNonCompliantPhase ? (isQuarantined ? 'DENIED' : 'CHECKING') : (isCompliantAllowed ? 'PERMIT' : 'READY')}
          />
        </g>
      )}

      {/* VLAN Destinations */}
      {showVlans && (
        <>
          <g transform="translate(620, 70)">
            <ServerNodeSVG
              label="VLAN 10: Production"
              sublabel="Full Intranet Access"
              status={isCompliantAllowed ? 'active' : 'standby'}
            />
            {isCompliantAllowed && (
              <g transform="translate(0, 70)">
                <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
                <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                  CONNECTED ✓
                </text>
              </g>
            )}
          </g>

          <g transform="translate(620, 200)">
            <ServerNodeSVG
              label="VLAN 99: Quarantine"
              sublabel="Patch Server Only"
              status={isQuarantined ? 'threat' : 'standby'}
            />
            {isQuarantined && (
              <g transform="translate(0, 70)">
                <rect x="-10" y="0" width="100" height="18" rx="4" fill="#78350f" />
                <text x="40" y="12" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="bold">
                  ISOLATED ✕
                </text>
              </g>
            )}
          </g>
        </>
      )}

      {/* Packets */}
      {currentStepIndex === 3 && (
        <PacketCard
          x={210}
          y={145}
          title="POSTURE TELEMETRY"
          src="Corporate Endpoint"
          dst="NAC RADIUS Server"
          detail="EAP-TLS Cert: Valid | Patch: 100%"
          type="allow"
        />
      )}

      {currentStepIndex === 4 && (
        <PacketCard
          x={510}
          y={95}
          title="RADIUS ACCESS-ACCEPT"
          src="NAC Engine"
          dst="Switch Port / Prod VLAN"
          detail="Authorize VLAN 10 (Full Intranet)"
          type="allow"
        />
      )}

      {currentStepIndex === 6 && (
        <PacketCard
          x={190}
          y={145}
          title="POSTURE TELEMETRY"
          src="Unmanaged Endpoint"
          dst="NAC RADIUS Server"
          detail="EDR Missing | Antivirus: Stale"
          type="deny"
        />
      )}

      {currentStepIndex >= 7 && isNonCompliantPhase && (
        <PacketCard
          x={340}
          y={235}
          title={isQuarantined ? "ASSIGNED TO QUARANTINE VLAN" : "EVALUATING COMPLIANCE"}
          src="NAC Server"
          dst="VLAN 99 Remediation"
          detail="Restricted to AV update repository"
          type="deny"
        />
      )}
    </svg>
  );
};
