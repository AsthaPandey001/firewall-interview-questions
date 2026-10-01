import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q45LeastPrivilegeVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Authorized Resource under Least Privilege (Steps 0-4)
  // Step 1: User / Support Tier-1 Technician appears
  // Step 2: RBAC Policy Enforcement Firewall appears
  // Step 3: Helpdesk Ticketing Web Server & Core SQL DB appear
  // Step 4: User requests Ticketing System (TCP 443) -> Rule Match: Role=Helpdesk -> ALLOWED ✓
  // Step 5: User successfully accesses Ticketing portal - STOP
  //
  // Scenario 2: Unauthorized High-Privilege Resource Attempt (Steps 5-9)
  // Step 6: User attempts to connect to Production SQL Database (Port 1433 / 22 SSH)
  // Step 7: Packet reaches Firewall
  // Step 8: RBAC evaluation: Role=Helpdesk has no SQL/Admin entitlement
  // Step 9: Firewall DENIES & logs unauthorized access attempt ✕

  const isUnauthorizedPhase = currentStepIndex >= 5;

  const showFw = currentStepIndex >= 1;
  const showServers = currentStepIndex >= 2;

  const isTicketAllowed = currentStepIndex >= 3 && currentStepIndex <= 4;
  const isDbBlocked = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isUnauthorizedPhase ? '#fef2f2' : '#ecfdf5'} stroke={isUnauthorizedPhase ? '#f87171' : '#34d399'} />
        <text x="340" y="16" textAnchor="middle" fill={isUnauthorizedPhase ? '#991b1b' : '#065f46'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isUnauthorizedPhase
            ? 'ATTEMPT 2: SENSITIVE PROD DB ACCESS (TCP 1433) → NO ENTITLEMENT → BLOCKED ✕'
            : 'ATTEMPT 1: ASSIGNED HELPDESK PORTAL (HTTPS 443) → ROLE MATCH → ALLOWED ✓'}
        </text>
      </g>

      {/* Links */}
      {showFw && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 330, y: 170 }}
          color={isUnauthorizedPhase ? (isDbBlocked ? '#ef4444' : '#64748b') : (isTicketAllowed ? '#10b981' : '#3b82f6')}
          dashed={currentStepIndex < 3}
          label={currentStepIndex >= 3 ? (isUnauthorizedPhase ? 'DST: SQL DB (1433)' : 'DST: Helpdesk (443)') : undefined}
        />
      )}

      {showServers && (
        <>
          <BoldArrow
            from={{ x: 450, y: 150 }}
            to={{ x: 620, y: 110 }}
            color={isTicketAllowed ? '#10b981' : '#94a3b8'}
            dashed={!isTicketAllowed}
            label={isTicketAllowed ? 'Allowed HTTPS' : undefined}
          />
          <BoldArrow
            from={{ x: 450, y: 190 }}
            to={{ x: 620, y: 240 }}
            color={isDbBlocked ? '#ef4444' : '#94a3b8'}
            dashed={true}
            label={isDbBlocked ? '✕ Access Dropped' : 'Restricted Admin Path'}
          />
        </>
      )}

      {/* Client */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label="Helpdesk Analyst"
          sublabel="Role: Tier-1 Support"
          ip="IP: 10.10.20.45"
        />
      </g>

      {/* Policy Firewall */}
      {showFw && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label="RBAC Policy Firewall"
            sublabel="Least Privilege Matrix"
            status={isUnauthorizedPhase ? (isDbBlocked ? 'DENIED' : 'CHECKING') : (isTicketAllowed ? 'PERMIT' : 'READY')}
          />
        </g>
      )}

      {/* Servers */}
      {showServers && (
        <>
          <g transform="translate(620, 70)">
            <ServerNodeSVG
              label="Helpdesk Ticketing"
              sublabel="10.20.10.10:443"
              status={isTicketAllowed ? 'active' : 'standby'}
            />
            {isTicketAllowed && (
              <g transform="translate(0, 70)">
                <rect x="-10" y="0" width="100" height="18" rx="4" fill="#065f46" />
                <text x="40" y="12" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
                  PERMITTED ✓
                </text>
              </g>
            )}
          </g>

          <g transform="translate(620, 200)">
            <ServerNodeSVG
              label="Prod SQL Database"
              sublabel="10.50.1.100:1433"
              status={isDbBlocked ? 'threat' : 'standby'}
            />
            {isDbBlocked && (
              <g transform="translate(0, 70)">
                <rect x="-10" y="0" width="100" height="18" rx="4" fill="#7f1d1d" />
                <text x="40" y="12" textAnchor="middle" fill="#fecaca" fontSize="8" fontWeight="bold">
                  FORBIDDEN ✕
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
          title="REQUEST: HELPDESK"
          src="10.10.20.45 (Tier-1)"
          dst="10.20.10.10:443"
          detail="Role Entitlement: Helpdesk Allowed"
          type="allow"
        />
      )}

      {currentStepIndex === 4 && (
        <PacketCard
          x={510}
          y={95}
          title="DELIVERED TO APP"
          src="Tier-1 Analyst"
          dst="Ticketing Portal"
          detail="Session Established Successfully"
          type="allow"
        />
      )}

      {currentStepIndex === 6 && (
        <PacketCard
          x={190}
          y={145}
          title="REQUEST: PROD DB"
          src="10.10.20.45 (Tier-1)"
          dst="10.50.1.100:1433"
          detail="Target: Restricted Admin Asset"
          type="deny"
        />
      )}

      {currentStepIndex >= 7 && isUnauthorizedPhase && (
        <PacketCard
          x={340}
          y={235}
          title={isDbBlocked ? "DENIED BY LEAST PRIVILEGE RULE" : "EVALUATING ENTITLEMENTS"}
          src="Tier-1 Analyst"
          dst="Prod DB (1433)"
          detail="Policy Violation: User lacks DBA role"
          type="deny"
        />
      )}
    </svg>
  );
};
