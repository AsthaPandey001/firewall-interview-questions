import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q24InboundOutboundVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: INBOUND (Steps 0-7)
  // Step 1: Internet appears
  // Step 2: Firewall appears
  // Step 3: Internal Web Server appears
  // Step 4: External Client creates HTTPS packet (:443)
  // Step 5: Inbound packet moves: Internet -> Firewall
  // Step 6: Firewall checks INBOUND ACL rule table
  // Step 7: ALLOW verdict
  // Step 8: Packet reaches Internal Web Server (Inbound Delivered ✓) - STOP
  //
  // Scenario 2: OUTBOUND (Steps 8-13)
  // Step 9: Internal Client Workstation appears
  // Step 10: Internal client creates outbound packet (Port 80/443)
  // Step 11: Outbound packet moves: Internal Client -> Firewall
  // Step 12: Firewall checks OUTBOUND ACL rule table
  // Step 13: ALLOW verdict -> Packet reaches Internet (Outbound Delivered ✓)

  const isOutboundPhase = currentStepIndex >= 8;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showInternalClient = currentStepIndex >= 8;

  const isInboundDelivered = currentStepIndex === 7;
  const isOutboundDelivered = currentStepIndex >= 12;

  let packetX = 70;
  if (!isOutboundPhase) {
    if (currentStepIndex === 3) packetX = 70;
    else if (currentStepIndex === 4) packetX = 200;
    else if (currentStepIndex === 5 || currentStepIndex === 6) packetX = 360;
    else if (currentStepIndex >= 7) packetX = 650;
  } else {
    if (currentStepIndex === 8 || currentStepIndex === 9) packetX = 70;
    else if (currentStepIndex === 10) packetX = 200;
    else if (currentStepIndex === 11) packetX = 360;
    else if (currentStepIndex >= 12) packetX = 650;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Direction Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isOutboundPhase ? '#eff6ff' : '#faf5ff'} stroke={isOutboundPhase ? '#93c5fd' : '#c084fc'} />
        <text x="340" y="16" textAnchor="middle" fill={isOutboundPhase ? '#1e40af' : '#6b21a8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isOutboundPhase
            ? 'PHASE 2: OUTBOUND TRAFFIC (INTERNAL LAN ➔ INTERNET WAN) — REGULATES EGRESS BROWSING'
            : 'PHASE 1: INBOUND TRAFFIC (INTERNET WAN ➔ INTERNAL SERVERS) — PROTECTS INCOMING SERVICES'}
        </text>
      </g>

      {/* Nodes: Client -> Firewall -> Target */}
      <LaptopNode
        cx={70}
        cy={75}
        label={isOutboundPhase ? 'INTERNAL CLIENT' : 'EXTERNAL CLIENT'}
        ip={isOutboundPhase ? '10.0.1.25' : '198.51.100.4'}
        active
      />

      {showFw && (
        <FirewallGatewayNode
          cx={360}
          cy={75}
          label="FIREWALL GATEWAY"
          sub={isOutboundPhase ? 'Outbound ACL Filter' : 'Inbound ACL Filter'}
          active
          success={isInboundDelivered || isOutboundDelivered}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label={isOutboundPhase ? 'INTERNET SERVER' : 'INTERNAL WEB SERVER'}
          sub={isOutboundPhase ? '203.0.113.80:443' : '10.0.1.50:443'}
          active
          success={isInboundDelivered || isOutboundDelivered}
        />
      )}

      {/* Arrows */}
      {!isOutboundPhase ? (
        <>
          {currentStepIndex === 4 && (
            <BoldArrow x1={105} y1={75} x2={315} y2={75} color="#8b5cf6" label="INBOUND :443" />
          )}
          {currentStepIndex >= 7 && (
            <BoldArrow x1={405} y1={75} x2={615} y2={75} color="#10b981" label="INBOUND ALLOWED ✓" />
          )}
        </>
      ) : (
        <>
          {currentStepIndex === 10 && (
            <BoldArrow x1={105} y1={75} x2={315} y2={75} color="#2563eb" label="OUTBOUND :443" />
          )}
          {currentStepIndex >= 12 && (
            <BoldArrow x1={405} y1={75} x2={615} y2={75} color="#10b981" label="OUTBOUND ALLOWED ✓" />
          )}
        </>
      )}

      {/* Packet Card */}
      {((!isOutboundPhase && currentStepIndex >= 3) || (isOutboundPhase && currentStepIndex >= 9)) && (
        <PacketCard
          cx={packetX}
          cy={28}
          title={isOutboundPhase ? 'OUTBOUND PACKET' : 'INBOUND PACKET'}
          protocol="TCP"
          port="443"
          src={isOutboundPhase ? '10.0.1.25' : '198.51.100.4'}
          dst={isOutboundPhase ? '203.0.113.80' : '10.0.1.50'}
          status={isInboundDelivered || isOutboundDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Rule Matrix */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          INBOUND vs OUTBOUND FIREWALL POLICY COMPARISON
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="92" rx="6" fill={!isOutboundPhase ? '#faf5ff' : '#f8fafc'} stroke={!isOutboundPhase ? '#c084fc' : '#cbd5e1'} strokeWidth={!isOutboundPhase ? 2 : 1} />
          <text x="14" y="18" fill="#6b21a8" fontSize="9" fontWeight="bold">INBOUND FIREWALL RULES (Outside ➔ Inside):</text>
          <text x="14" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Default Policy: Strict Deny All (Implicit Deny)</text>
          <text x="14" y="50" fill="#64748b" fontSize="7.5">Only specific exposed ports (e.g. 80, 443 to DMZ) are permitted</text>
          <text x="14" y="64" fill="#64748b" fontSize="7.5">Protects internal network from unauthorized incoming connections</text>
          <text x="14" y="78" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Rule: ALLOW ANY ➔ Web_Server:443</text>

          <rect x="345" y="0" width="325" height="92" rx="6" fill={isOutboundPhase ? '#eff6ff' : '#f8fafc'} stroke={isOutboundPhase ? '#93c5fd' : '#cbd5e1'} strokeWidth={isOutboundPhase ? 2 : 1} />
          <text x="359" y="18" fill="#1e40af" fontSize="9" fontWeight="bold">OUTBOUND FIREWALL RULES (Inside ➔ Outside):</text>
          <text x="359" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Controls internal users/servers accessing Internet</text>
          <text x="359" y="50" fill="#64748b" fontSize="7.5">Prevents infected machines from reaching C2 servers or spamming</text>
          <text x="359" y="64" fill="#64748b" fontSize="7.5">Blocks non-standard outbound ports (e.g. blocks outbound SMB :445)</text>
          <text x="359" y="78" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Rule: ALLOW Inside_LAN ➔ WAN (80, 443, 53)</text>
        </g>

        <g transform="translate(16, 136)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: Inbound rules protect servers from outside attack; Outbound (Egress) rules prevent data exfiltration and malware C2 beaconing.
          </text>
          <text x="14" y="28" fill="#64748b" fontSize="7.5">
            Stateful firewalls automatically allow response return traffic for outbound sessions without needing a manual inbound rule.
          </text>
        </g>
      </g>
    </svg>
  );
};
