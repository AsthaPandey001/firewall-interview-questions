import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, RouterNodeSVG, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q21RouterVsFirewallVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1 (idx 0): Client appears
  // Step 2 (idx 1): Router appears
  // Step 3 (idx 2): Firewall appears
  // Step 4 (idx 3): Server appears
  // Step 5 (idx 4): Network cables connect
  // Step 6 (idx 5): Packet created at Client (10.0.0.25 -> 10.0.0.50:443)
  // Step 7 (idx 6): Packet moves: Client -> Router
  // Step 8 (idx 7): Router makes Routing Decision (Next hop: Firewall)
  // Step 9 (idx 8): Packet moves: Router -> Firewall
  // Step 10 (idx 9): Firewall inspects 5-tuple against policy
  // Step 11 (idx 10): Firewall decides: ALLOW
  // Step 12 (idx 11): Packet moves: Firewall -> Server
  // Step 13 (idx 12): Server receives packet (RECEIVED ✓) + Comparison Summary

  const showRouter = currentStepIndex >= 1;
  const showFirewall = currentStepIndex >= 2;
  const showServer = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;

  const isRoutingDecision = currentStepIndex === 7;
  const isFwInspection = currentStepIndex === 9 || currentStepIndex === 10;
  const isDelivered = currentStepIndex >= 12;

  let packetX = 80;
  if (currentStepIndex === 5) packetX = 80;
  else if (currentStepIndex === 6) packetX = 180;
  else if (currentStepIndex === 7) packetX = 260;
  else if (currentStepIndex === 8) packetX = 350;
  else if (currentStepIndex === 9 || currentStepIndex === 10) packetX = 450;
  else if (currentStepIndex === 11) packetX = 550;
  else if (currentStepIndex >= 12) packetX = 660;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network baseline cable */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes: Client -> Router -> Firewall -> Server */}
      <LaptopNode cx={80} cy={75} label="CLIENT" ip="10.0.0.25" active />

      {showRouter && (
        <RouterNodeSVG cx={260} cy={75} label="ROUTER" sub="Routing Table Engine" active={currentStepIndex >= 6 && currentStepIndex <= 8} />
      )}

      {showFirewall && (
        <FirewallGatewayNode cx={450} cy={75} label="FIREWALL" sub="Security Policy ACL" active={currentStepIndex >= 8 && currentStepIndex <= 11} success={currentStepIndex >= 10} />
      )}

      {showServer && (
        <ServerNodeSVG cx={660} cy={75} label="SERVER" sub="10.0.0.50:443" active success={isDelivered} />
      )}

      {/* Dynamic Moving Arrows */}
      {currentStepIndex === 6 && (
        <BoldArrow x1={115} y1={75} x2={225} y2={75} color="#2563eb" label="L3 IP PACKET" />
      )}
      {currentStepIndex === 8 && (
        <BoldArrow x1={295} y1={75} x2={415} y2={75} color="#0891b2" label="FORWARDED" />
      )}
      {currentStepIndex === 11 && (
        <BoldArrow x1={485} y1={75} x2={625} y2={75} color="#10b981" label="PERMITTED ✓" />
      )}

      {/* Moving Packet Card */}
      {currentStepIndex >= 5 && (
        <PacketCard
          cx={packetX}
          cy={28}
          title="TCP PACKET"
          protocol="TCP"
          port="443"
          src="10.0.0.25"
          dst="10.0.0.50"
          status={isFwInspection ? 'INSPECT' : isDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Comparison Canvas */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          ROUTER (PATH SELECTION) vs FIREWALL (SECURITY POLICY ENFORCEMENT)
        </text>

        {/* 2 Comparative Columns */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="92" rx="6" fill={isRoutingDecision ? '#f0fdf4' : '#eff6ff'} stroke={isRoutingDecision ? '#86efac' : '#93c5fd'} strokeWidth={isRoutingDecision ? 2 : 1} />
          <text x="14" y="18" fill="#1e40af" fontSize="9" fontWeight="bold">ROUTER (Layer 3 Routing):</text>
          <text x="14" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Role: Finds path & forwards traffic (WHERE)</text>
          <text x="14" y="50" fill="#64748b" fontSize="7.5">Consults Routing Table (RIB/FIB) using Dest IP</text>
          <text x="14" y="64" fill="#64748b" fontSize="7.5">Does not track session state or inspect Layer 7</text>
          <text x="14" y="78" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Decision: Route to Next-Hop Interface</text>

          <rect x="345" y="0" width="325" height="92" rx="6" fill={isFwInspection ? '#f0fdf4' : '#faf5ff'} stroke={isFwInspection ? '#86efac' : '#c084fc'} strokeWidth={isFwInspection ? 2 : 1} />
          <text x="359" y="18" fill="#6b21a8" fontSize="9" fontWeight="bold">FIREWALL (Layer 3–7 Security):</text>
          <text x="359" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Role: Filters & controls traffic (WHETHER)</text>
          <text x="359" y="50" fill="#64748b" fontSize="7.5">Consults Security Policies, ACLs & State Table</text>
          <text x="359" y="64" fill="#64748b" fontSize="7.5">Inspects 5-Tuple, App-ID, IPS signatures & payloads</text>
          <text x="359" y="78" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Decision: ALLOW / DROP / REJECT</text>
        </g>

        {/* Bottom Formula Banner */}
        <g transform="translate(16, 136)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: A Router determines WHERE packets travel; a Firewall determines WHETHER packets are permitted.
          </text>
          <text x="14" y="28" fill="#64748b" fontSize="7.5">
            Modern enterprise networks deploy Routers at the boundary for BGP/OSPF transit and Firewalls inline for stateful policy inspection.
          </text>
        </g>
      </g>
    </svg>
  );
};
