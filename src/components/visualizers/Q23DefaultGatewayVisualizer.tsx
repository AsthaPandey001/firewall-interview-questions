import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, RouterNodeSVG, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q23DefaultGatewayVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Laptop appears
  // Step 2: Local subnet boundary appears
  // Step 3: Default Gateway Router appears
  // Step 4: Firewall appears
  // Step 5: Internet appears
  // Step 6: Create packet for remote destination (8.8.8.8)
  // Step 7: Laptop checks routing table: destination is outside local subnet
  // Step 8: Packet moves: Laptop -> Default Gateway
  // Step 9: Gateway forwards packet
  // Step 10: Packet moves: Gateway -> Firewall
  // Step 11: Firewall checks packet 5-tuple
  // Step 12: Firewall decides: ALLOW
  // Step 13: Packet moves toward Internet (DELIVERED ✓)
  // Step 14: Contrast: Local communication (ARP/direct) vs Remote communication (Default Gateway -> Firewall)

  const showSubnet = currentStepIndex >= 1;
  const showGateway = currentStepIndex >= 2;
  const showFw = currentStepIndex >= 3;
  const showInternet = currentStepIndex >= 4;

  const isDelivered = currentStepIndex >= 12;

  let packetX = 80;
  if (currentStepIndex === 5 || currentStepIndex === 6) packetX = 80;
  else if (currentStepIndex === 7) packetX = 170;
  else if (currentStepIndex === 8) packetX = 260;
  else if (currentStepIndex === 9) packetX = 360;
  else if (currentStepIndex === 10 || currentStepIndex === 11) packetX = 460;
  else if (currentStepIndex === 12) packetX = 560;
  else if (currentStepIndex >= 13) packetX = 660;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Subnet Box */}
      {showSubnet && (
        <g transform="translate(30, 20)">
          <rect x="0" y="0" width="300" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
          <text x="150" y="16" textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            LOCAL SUBNET: 192.168.1.0/24
          </text>
        </g>
      )}

      {/* Nodes: Laptop -> Default Gateway -> Firewall -> Internet */}
      <LaptopNode cx={80} cy={75} label="LAPTOP" ip="192.168.1.15" active />

      {showGateway && (
        <RouterNodeSVG cx={260} cy={75} label="DEFAULT GATEWAY" sub="192.168.1.1" active={currentStepIndex >= 7 && currentStepIndex <= 9} />
      )}

      {showFw && (
        <FirewallGatewayNode cx={460} cy={75} label="FIREWALL" sub="Perimeter Inspection" active={currentStepIndex >= 9 && currentStepIndex <= 12} success={currentStepIndex >= 11} />
      )}

      {showInternet && (
        <ServerNodeSVG cx={660} cy={75} label="INTERNET (DNS)" sub="8.8.8.8:53" active success={isDelivered} />
      )}

      {/* Motion Arrows */}
      {currentStepIndex === 7 && (
        <BoldArrow x1={115} y1={75} x2={225} y2={75} color="#2563eb" label="OFF-SUBNET PKT" />
      )}
      {currentStepIndex === 9 && (
        <BoldArrow x1={295} y1={75} x2={425} y2={75} color="#0891b2" label="TO PERIMETER" />
      )}
      {currentStepIndex === 12 && (
        <BoldArrow x1={495} y1={75} x2={625} y2={75} color="#10b981" label="ALLOWED OUT ✓" />
      )}

      {/* Packet Card */}
      {currentStepIndex >= 5 && (
        <PacketCard
          cx={packetX}
          cy={28}
          title="DNS QUERY"
          protocol="UDP"
          port="53"
          src="192.168.1.15"
          dst="8.8.8.8"
          status={currentStepIndex >= 11 ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Operations Matrix */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DEFAULT GATEWAY vs FIREWALL TRAFFIC HANDLING
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="92" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="18" fill="#1e40af" fontSize="9" fontWeight="bold">LOCAL vs REMOTE ROUTING DECISION:</text>
          <text x="14" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">1. Local Host (e.g. 192.168.1.50):</text>
          <text x="14" y="48" fill="#64748b" fontSize="7.5">Same subnet ➔ Resolved directly via ARP without Default Gateway.</text>
          <text x="14" y="64" fill="#0f172a" fontSize="8" fontFamily="monospace">2. Remote Host (e.g. 8.8.8.8):</text>
          <text x="14" y="76" fill="#64748b" fontSize="7.5">Different subnet ➔ Sent to Default Gateway (192.168.1.1) for routing.</text>

          <rect x="345" y="0" width="325" height="92" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="359" y="18" fill="#065f46" fontSize="9" fontWeight="bold">DEFAULT GATEWAY & FIREWALL INTERACTION:</text>
          <text x="359" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">Step 1: Router routes packet out the default interface.</text>
          <text x="359" y="50" fill="#0f172a" fontSize="8" fontFamily="monospace">Step 2: Firewall inspects packet headers against security rules.</text>
          <text x="359" y="64" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">Step 3: If permitted, Firewall performs NAT and egresses packet.</text>
          <text x="359" y="78" fill="#64748b" fontSize="7.5">In many setups, the Firewall itself acts as the Default Gateway.</text>
        </g>

        <g transform="translate(16, 136)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: A Default Gateway provides an exit route for non-local traffic; the Firewall determines if that exit is authorized.
          </text>
          <text x="14" y="28" fill="#64748b" fontSize="7.5">
            Without a correct default gateway, a client cannot reach the firewall to access the Internet.
          </text>
        </g>
      </g>
    </svg>
  );
};
