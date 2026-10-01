import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q44ZeroTrustVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Compliant Identity & Managed Device (Steps 0-4)
  // Step 1: Managed Corporate Laptop & User Identity appear
  // Step 2: Zero Trust Policy Decision Point (PDP / PEP) appears
  // Step 3: Protected Internal Application Server appears
  // Step 4: Access request sent to PDP -> Evaluates Identity + MFA + Device Compliance
  // Step 5: Trust Verified -> Dynamic Micro-perimeter Tunnel Created -> App Access Granted ✓
  //
  // Scenario 2: Untrusted / Compromised Context (Steps 5-9)
  // Step 6: Untrusted / Unmanaged Device with stale patch status attempts access
  // Step 7: Request sent to Zero Trust PDP
  // Step 8: Context evaluation flags missing certificate / abnormal geo-location
  // Step 9: Policy Denies -> Explicit DROP ✕ (Perimeter location grants zero default trust)

  const isUntrustedPhase = currentStepIndex >= 5;

  const showPdp = currentStepIndex >= 1;
  const showApp = currentStepIndex >= 2;

  const isCompliantAllowed = currentStepIndex >= 4 && currentStepIndex <= 4;
  const isUntrustedBlocked = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Phase Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isUntrustedPhase ? '#fef2f2' : '#ecfdf5'} stroke={isUntrustedPhase ? '#f87171' : '#34d399'} />
        <text x="340" y="16" textAnchor="middle" fill={isUntrustedPhase ? '#991b1b' : '#065f46'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isUntrustedPhase
            ? 'PHASE 2: UNTRUSTED CONTEXT → CONTINUOUS VERIFICATION FAILED → ACCESS DENIED ✕'
            : 'PHASE 1: MANAGED DEVICE + MFA → EXPLICIT VERIFICATION PASSED → ACCESS GRANTED ✓'}
        </text>
      </g>

      {/* Connection Links */}
      {showPdp && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 330, y: 170 }}
          color={isUntrustedPhase ? (isUntrustedBlocked ? '#ef4444' : '#64748b') : (isCompliantAllowed ? '#10b981' : '#3b82f6')}
          dashed={currentStepIndex < 3}
          label={currentStepIndex >= 3 ? (isUntrustedPhase ? 'Posture Context' : 'MFA + Device Cert') : undefined}
        />
      )}

      {showApp && (
        <BoldArrow
          from={{ x: 450, y: 170 }}
          to={{ x: 620, y: 170 }}
          color={isCompliantAllowed ? '#10b981' : '#94a3b8'}
          dashed={!isCompliantAllowed}
          label={isCompliantAllowed ? 'Microsegment Tunnel' : undefined}
        />
      )}

      {/* Left Node: Client Device */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label={isUntrustedPhase ? 'Unmanaged Device' : 'Managed Corporate Laptop'}
          sublabel={isUntrustedPhase ? 'IP: 192.168.1.99 (Personal/No EDR)' : 'User: Alice (Valid MFA + EDR)'}
          ip={isUntrustedPhase ? 'Post-Compromised LAN' : 'Identity: alice@corp.local'}
        />
      </g>

      {/* Middle Node: Zero Trust Policy Controller (PDP / PEP) */}
      {showPdp && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label="Zero Trust PDP / PEP"
            sublabel="Continuous Risk & Posture Engine"
            status={isUntrustedPhase ? (isUntrustedBlocked ? 'DENIED' : 'EVALUATING') : (isCompliantAllowed ? 'VERIFIED' : 'READY')}
          />
        </g>
      )}

      {/* Right Node: Protected Resource */}
      {showApp && (
        <g transform="translate(620, 120)">
          <ServerNodeSVG
            label="Internal ERP / Payroll"
            sublabel="10.200.5.50:443"
            status={isCompliantAllowed ? 'active' : 'standby'}
          />
          {isCompliantAllowed && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
              <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                AUTHORIZED ✓
              </text>
            </g>
          )}
          {isUntrustedBlocked && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#7f1d1d" />
              <text x="40" y="12" textAnchor="middle" fill="#fecaca" fontSize="8" fontWeight="bold">
                ISOLATED ✕
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
          title="AUTH & POSTURE REQ"
          src="alice@corp.local"
          dst="Zero Trust Controller"
          detail="Cert: Valid | EDR: Active | MFA: Passed"
          type="allow"
        />
      )}

      {currentStepIndex === 4 && (
        <PacketCard
          x={510}
          y={145}
          title="LEAST PRIVILEGE SESSION"
          src="Alice (Token: JTI-883)"
          dst="ERP Application :443"
          detail="Policy: Allowed (Just-In-Time Tunnel)"
          type="allow"
        />
      )}

      {currentStepIndex === 6 && (
        <PacketCard
          x={190}
          y={145}
          title="ACCESS ATTEMPT"
          src="Unknown Client (LAN)"
          dst="Zero Trust Controller"
          detail="Cert: Missing | EDR: Inactive"
          type="deny"
        />
      )}

      {currentStepIndex >= 7 && isUntrustedPhase && (
        <PacketCard
          x={340}
          y={235}
          title={isUntrustedBlocked ? "BLOCKED AT POLICY CONTROLLER" : "EVALUATING TRUST POSTURE"}
          src="192.168.1.99"
          dst="ERP Application"
          detail="Never Trust, Always Verify: Zero Implicit Trust"
          type="deny"
        />
      )}
    </svg>
  );
};
