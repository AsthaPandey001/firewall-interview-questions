import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q25HostVsNetworkFwVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Part A: HOST-BASED FIREWALL (Steps 0-4)
  // Step 1: Laptop appears
  // Step 2: Local Application creates packet
  // Step 3: Local OS Firewall (Windows Defender/iptables) inspects on the same endpoint
  // Step 4: Decision: ALLOW
  // Step 5: Packet leaves laptop NIC - STOP
  //
  // Part B: NETWORK FIREWALL (Steps 5-12)
  // Step 6: Network topology reveals
  // Step 7: Network Firewall appears in transit path
  // Step 8: Destination Server appears
  // Step 9: Packet leaves laptop across cable
  // Step 10: Packet arrives at Network Firewall appliance
  // Step 11: Network Firewall evaluates subnet security rules
  // Step 12: ALLOW verdict -> Packet delivers to Server (Delivered ✓)

  const isNetworkPhase = currentStepIndex >= 5;

  const showNetworkFw = currentStepIndex >= 6;
  const showServer = currentStepIndex >= 7;

  const isHostInspecting = currentStepIndex === 2 || currentStepIndex === 3;
  const isNetworkInspecting = currentStepIndex === 10 || currentStepIndex === 11;
  const isDelivered = currentStepIndex >= 12;

  let packetX = 90;
  if (!isNetworkPhase) {
    if (currentStepIndex === 1 || currentStepIndex === 2) packetX = 90;
    else if (currentStepIndex >= 3) packetX = 140;
  } else {
    if (currentStepIndex === 8) packetX = 90;
    else if (currentStepIndex === 9) packetX = 230;
    else if (currentStepIndex === 10 || currentStepIndex === 11) packetX = 370;
    else if (currentStepIndex >= 12) packetX = 650;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isNetworkPhase ? '#eff6ff' : '#faf5ff'} stroke={isNetworkPhase ? '#93c5fd' : '#c084fc'} />
        <text x="340" y="16" textAnchor="middle" fill={isNetworkPhase ? '#1e40af' : '#6b21a8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isNetworkPhase
            ? 'PART B: NETWORK-BASED FIREWALL (HARDWARE APPLIANCE PROTECTING ENTIRE NETWORK)'
            : 'PART A: HOST-BASED FIREWALL (LOCAL SOFTWARE AGENT PROTECTING SINGLE ENDPOINT)'}
        </text>
      </g>

      {/* Nodes: Client (with local FW) -> Network FW -> Server */}
      <g transform="translate(90, 75)">
        <LaptopNode cx={0} cy={0} label="ENDPOINT" ip="10.0.1.15" active />
        {!isNetworkPhase && (
          <g transform="translate(0, -38)">
            <rect x="-45" y="-10" width="90" height="20" rx="10" fill={isHostInspecting ? '#ecfdf5' : '#f1f5f9'} stroke={isHostInspecting ? '#10b981' : '#64748b'} strokeWidth={1.5} />
            <text x="0" y="3" textAnchor="middle" fill={isHostInspecting ? '#065f46' : '#334155'} fontSize="7" fontWeight="bold" fontFamily="monospace">
              🛡️ OS FIREWALL
            </text>
          </g>
        )}
      </g>

      {showNetworkFw && (
        <FirewallGatewayNode cx={370} cy={75} label="NETWORK FIREWALL" sub="Centralized Perimeter" active success={currentStepIndex >= 11} />
      )}

      {showServer && (
        <ServerNodeSVG cx={650} cy={75} label="DESTINATION SERVER" sub="203.0.113.50:443" active success={isDelivered} />
      )}

      {/* Motion Arrows */}
      {isNetworkPhase && (
        <>
          {currentStepIndex === 9 && (
            <BoldArrow x1={125} y1={75} x2={330} y2={75} color="#2563eb" label="TRANSIT CABLE" />
          )}
          {currentStepIndex >= 12 && (
            <BoldArrow x1={410} y1={75} x2={615} y2={75} color="#10b981" label="PERMITTED TO SERVER ✓" />
          )}
        </>
      )}

      {/* Packet Card */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={packetX}
          cy={28}
          title="APPLICATION DATA"
          protocol="TCP"
          port="443"
          src="10.0.1.15"
          dst="203.0.113.50"
          status={isHostInspecting || isNetworkInspecting ? 'INSPECT' : isDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Comparison Canvas */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          HOST-BASED vs NETWORK-BASED FIREWALL ARCHITECTURAL COMPARISON
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="92" rx="6" fill={!isNetworkPhase ? '#faf5ff' : '#f8fafc'} stroke={!isNetworkPhase ? '#c084fc' : '#cbd5e1'} strokeWidth={!isNetworkPhase ? 2 : 1} />
          <text x="14" y="18" fill="#6b21a8" fontSize="9" fontWeight="bold">HOST-BASED FIREWALL (Software):</text>
          <text x="14" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Location: Installed directly on Host OS (Windows / Linux)</text>
          <text x="14" y="50" fill="#64748b" fontSize="7.5">Visibility: Inspects local process names (e.g. `chrome.exe`, `ssh`)</text>
          <text x="14" y="64" fill="#64748b" fontSize="7.5">Scope: Protects only the single individual machine</text>
          <text x="14" y="78" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Defense: Stops East-West threats on same local switch</text>

          <rect x="345" y="0" width="325" height="92" rx="6" fill={isNetworkPhase ? '#eff6ff' : '#f8fafc'} stroke={isNetworkPhase ? '#93c5fd' : '#cbd5e1'} strokeWidth={isNetworkPhase ? 2 : 1} />
          <text x="359" y="18" fill="#1e40af" fontSize="9" fontWeight="bold">NETWORK FIREWALL (Hardware / VM Appliance):</text>
          <text x="359" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Location: Inline at network perimeter / VLAN boundary</text>
          <text x="359" y="50" fill="#64748b" fontSize="7.5">Visibility: High-throughput 5-tuple, DPI, App-ID, IPS engines</text>
          <text x="359" y="64" fill="#64748b" fontSize="7.5">Scope: Protects entire subnets, branch offices, and data centers</text>
          <text x="359" y="78" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Defense: Centralized control, high wire-speed ASICs</text>
        </g>

        <g transform="translate(16, 136)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            DEFENSE-IN-DEPTH: Host firewalls protect endpoints from peer lateral movement; Network firewalls protect the enterprise perimeter.
          </text>
          <text x="14" y="28" fill="#64748b" fontSize="7.5">
            A secure zero-trust network mandates both layers working in tandem.
          </text>
        </g>
      </g>
    </svg>
  );
};
