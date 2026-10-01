import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q47ForwardVsReverseProxyVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Forward Proxy (Steps 0-4)
  // Step 1: Internal Enterprise Client appears (10.0.1.50)
  // Step 2: Forward Proxy appears (Corporate Gateway 10.0.1.1)
  // Step 3: Public Internet Web Server appears (198.51.100.80)
  // Step 4: Client sends request -> Forward Proxy hides client IP, applies URL filter & cache -> Fetches from Server
  // Step 5: Server responds to Forward Proxy -> Delivered to Client (Client protected from Internet) ✓ - STOP
  //
  // Scenario 2: Reverse Proxy (Steps 5-9)
  // Step 6: External Internet Client appears (203.0.113.15)
  // Step 7: Reverse Proxy / Load Balancer appears (Public IP 198.51.100.10)
  // Step 8: Internal Application Servers appear (10.100.1.10 & 10.100.1.11)
  // Step 9: Internet client requests example.com -> Reverse Proxy terminates TLS, load balances to backend server
  // Step 10: Backend responds to Reverse Proxy -> Reverse Proxy serves client (Servers protected from Internet) ✓

  const isReverseProxyPhase = currentStepIndex >= 5;

  const showProxy = currentStepIndex >= 1;
  const showRightNode = currentStepIndex >= 2;

  const isForwardDelivered = currentStepIndex >= 3 && currentStepIndex <= 4;
  const isReverseDelivered = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isReverseProxyPhase ? '#eff6ff' : '#faf5ff'} stroke={isReverseProxyPhase ? '#93c5fd' : '#c084fc'} />
        <text x="340" y="16" textAnchor="middle" fill={isReverseProxyPhase ? '#1e40af' : '#6b21a8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isReverseProxyPhase
            ? 'PART B: REVERSE PROXY → SITS IN FRONT OF SERVERS (TLS TERMINATION, LOAD BALANCING, PROTECTION)'
            : 'PART A: FORWARD PROXY → SITS IN FRONT OF CLIENTS (URL FILTERING, CACHING, CLIENT IP PRIVACY)'}
        </text>
      </g>

      {/* Links */}
      {showProxy && (
        <BoldArrow
          from={{ x: 130, y: 170 }}
          to={{ x: 330, y: 170 }}
          color={isReverseProxyPhase ? (isReverseDelivered ? '#2563eb' : '#94a3b8') : (isForwardDelivered ? '#9333ea' : '#3b82f6')}
          dashed={currentStepIndex < 3}
          label={currentStepIndex >= 3 ? (isReverseProxyPhase ? 'HTTPS Request' : 'Client HTTP Req') : undefined}
        />
      )}

      {showRightNode && (
        <BoldArrow
          from={{ x: 450, y: 170 }}
          to={{ x: 620, y: 170 }}
          color={isReverseProxyPhase ? (isReverseDelivered ? '#2563eb' : '#94a3b8') : (isForwardDelivered ? '#9333ea' : '#94a3b8')}
          dashed={!isForwardDelivered && !isReverseDelivered}
          label={isReverseProxyPhase ? (isReverseDelivered ? 'Backend Load Balance' : undefined) : (isForwardDelivered ? 'Proxy Egress' : undefined)}
        />
      )}

      {/* Left Node */}
      <g transform="translate(40, 120)">
        <LaptopNode
          label={isReverseProxyPhase ? 'Public Internet Client' : 'Internal LAN Client'}
          sublabel={isReverseProxyPhase ? 'IP: 203.0.113.15 (WAN)' : 'IP: 10.0.1.50 (Private)'}
          ip={isReverseProxyPhase ? 'Browsing example.com' : 'Egress via Proxy'}
        />
      </g>

      {/* Middle Proxy Node */}
      {showProxy && (
        <g transform="translate(330, 110)">
          <FirewallGatewayNode
            label={isReverseProxyPhase ? 'Reverse Proxy / ALB' : 'Forward Proxy Gateway'}
            sublabel={isReverseProxyPhase ? 'Protects Backend Farm' : 'Protects Internal Clients'}
            status={isReverseProxyPhase ? (isReverseDelivered ? 'PERMIT' : 'READY') : (isForwardDelivered ? 'ACTIVE' : 'READY')}
          />
        </g>
      )}

      {/* Right Destination Node */}
      {showRightNode && (
        <g transform="translate(620, 120)">
          <ServerNodeSVG
            label={isReverseProxyPhase ? 'App Backend Farm' : 'Public Web Server'}
            sublabel={isReverseProxyPhase ? '10.100.1.10 (Hidden)' : '198.51.100.80 (External)'}
            status={isReverseProxyPhase ? (isReverseDelivered ? 'active' : 'standby') : (isForwardDelivered ? 'active' : 'standby')}
          />
          {isForwardDelivered && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#581c87" />
              <text x="40" y="12" textAnchor="middle" fill="#f3e8ff" fontSize="8" fontWeight="bold">
                PROXIED OK ✓
              </text>
            </g>
          )}
          {isReverseDelivered && (
            <g transform="translate(0, 75)">
              <rect x="-10" y="0" width="100" height="18" rx="4" fill="#1e3a8a" />
              <text x="40" y="12" textAnchor="middle" fill="#dbeafe" fontSize="8" fontWeight="bold">
                BALANCED OK ✓
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
          title="CLIENT GET REQ"
          src="10.0.1.50"
          dst="Forward Proxy (10.0.1.1)"
          detail="Target: public-site.com/doc"
          type="allow"
        />
      )}

      {currentStepIndex === 4 && (
        <PacketCard
          x={510}
          y={145}
          title="PROXIED REQUEST"
          src="Forward Proxy (WAN IP)"
          dst="198.51.100.80:443"
          detail="Client IP Hidden | Content Cached"
          type="allow"
        />
      )}

      {currentStepIndex === 6 && (
        <PacketCard
          x={190}
          y={145}
          title="INBOUND REQUEST"
          src="203.0.113.15"
          dst="example.com (VIP)"
          detail="Encrypted TLS 1.3 Handshake"
          type="allow"
        />
      )}

      {currentStepIndex >= 7 && isReverseProxyPhase && (
        <PacketCard
          x={490}
          y={145}
          title="REVERSE PROXY ROUTE"
          src="Reverse Proxy (VIP)"
          dst="Backend Node-01 (Private)"
          detail="TLS Terminated | Load Balanced"
          type="allow"
        />
      )}
    </svg>
  );
};
