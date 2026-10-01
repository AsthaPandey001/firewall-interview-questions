import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, RouterNodeSVG, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q23DefaultGatewayVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Laptop appears (192.168.1.50/24)
  // Step 1: Local network switch appears
  // Step 2: Default Gateway router appears (192.168.1.1)
  // Step 3: Perimeter Firewall appears
  // Step 4: Internet appears
  // Step 5: Remote Server appears (198.51.100.20:443)
  // Step 6: Network connection cables drawn
  // Step 7: Laptop creates packet for remote destination (198.51.100.20)
  // Step 8: Laptop evaluates destination subnet: 198.51.100.20 != 192.168.1.0/24 (Remote Target!)
  // Step 9: Laptop resolves Gateway MAC & sends packet: LAPTOP -> DEFAULT GATEWAY
  // Step 10: Gateway receives packet and performs Routing Lookup (Next-hop: Firewall)
  // Step 11: Packet moves: GATEWAY -> FIREWALL
  // Step 12: Firewall inspects 5-tuple and state policy
  // Step 13: Firewall allows packet: ALLOW Egress HTTPS
  // Step 14: Packet moves: FIREWALL -> INTERNET
  // Step 15: Packet moves: INTERNET -> REMOTE SERVER
  // Step 16: Remote Server receives packet (ACCEPTED ✓)
  // Step 17: Remote Server creates HTTP 200 response
  // Step 18: Response returns: SERVER -> INTERNET -> FIREWALL -> GATEWAY -> LAPTOP
  // Step 19: Laptop receives response (ROUND-TRIP COMPLETE ✓) + Core Gateway Takeaways

  const showSwitch = currentStepIndex >= 1;
  const showGateway = currentStepIndex >= 2;
  const showFirewall = currentStepIndex >= 3;
  const showInternet = currentStepIndex >= 4;
  const showServer = currentStepIndex >= 5;
  const showCables = currentStepIndex >= 6;

  const showForwardPacket = currentStepIndex >= 7 && currentStepIndex <= 16;
  const showReturnPacket = currentStepIndex >= 17;

  let packetX = 70;
  if (currentStepIndex === 7 || currentStepIndex === 8) packetX = 70;
  else if (currentStepIndex === 9) packetX = 145;
  else if (currentStepIndex === 10) packetX = 220;
  else if (currentStepIndex === 11) packetX = 300;
  else if (currentStepIndex === 12 || currentStepIndex === 13) packetX = 380;
  else if (currentStepIndex === 14) packetX = 460;
  else if (currentStepIndex === 15) packetX = 570;
  else if (currentStepIndex >= 16) packetX = 670;

  let returnX = 670;
  if (currentStepIndex === 17) returnX = 670;
  else if (currentStepIndex === 18) returnX = 380;
  else if (currentStepIndex >= 19) returnX = 70;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Cables */}
      {showCables && (
        <line x1="70" y1="75" x2="670" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {currentStepIndex === 9 && (
        <BoldArrow x1={95} y1={75} x2={195} y2={75} color="#2563eb" label="TO GATEWAY →" />
      )}
      {currentStepIndex === 11 && (
        <BoldArrow x1={245} y1={75} x2={355} y2={75} color="#0891b2" label="ROUTED →" />
      )}
      {currentStepIndex === 14 && (
        <BoldArrow x1={405} y1={75} x2={515} y2={75} color="#10b981" label="PERMITTED →" />
      )}
      {currentStepIndex === 15 && (
        <BoldArrow x1={545} y1={75} x2={645} y2={75} color="#10b981" label="TO SERVER →" />
      )}
      {currentStepIndex === 18 && (
        <BoldArrow x1={645} y1={75} x2={95} y2={75} color="#8b5cf6" label="← RETURN TRIP TO LAPTOP" />
      )}

      {/* Nodes */}
      {/* 1. Laptop */}
      <LaptopNode
        cx={70}
        cy={75}
        label="LAPTOP"
        ip="192.168.1.50/24"
        active={currentStepIndex <= 9 || currentStepIndex >= 19}
        statusText={currentStepIndex >= 19 ? 'DELIVERED ✓' : undefined}
      />

      {/* 2. Default Gateway Router */}
      {showGateway && (
        <RouterNodeSVG
          cx={220}
          cy={75}
          label="DEFAULT GATEWAY"
          sub="192.168.1.1"
          active={currentStepIndex >= 9 && currentStepIndex <= 11}
        />
      )}

      {/* 3. Perimeter Firewall */}
      {showFirewall && (
        <FirewallGatewayNode
          cx={380}
          cy={75}
          label="FIREWALL"
          sub="Egress Policy"
          active={currentStepIndex >= 11 && currentStepIndex <= 14}
          success={currentStepIndex >= 13}
        />
      )}

      {/* 4. Internet WAN */}
      {showInternet && (
        <g>
          <circle cx={530} cy={75} r={24} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
          <text x={530} y={72} textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
            INTERNET
          </text>
          <text x={530} y={83} textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">
            Public WAN
          </text>
        </g>
      )}

      {/* 5. Remote Server */}
      {showServer && (
        <ServerNodeSVG
          cx={670}
          cy={75}
          label="REMOTE SERVER"
          sub="198.51.100.20:443"
          active={currentStepIndex >= 15 && currentStepIndex <= 17}
          success={currentStepIndex >= 16}
          statusText={currentStepIndex >= 16 ? 'HTTP 200 OK' : 'STANDBY'}
        />
      )}

      {/* Forward Packet */}
      {showForwardPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={currentStepIndex >= 13 ? 'PERMITTED' : currentStepIndex >= 9 ? 'TO GATEWAY' : 'TCP SYN'}
            protocol="TCP"
            port="443"
            src="192.168.1.50"
            dst="198.51.100.20"
            status={currentStepIndex === 12 ? 'INSPECT' : currentStepIndex >= 13 ? 'ALLOW' : 'NORMAL'}
            scale={0.76}
          />
        </g>
      )}

      {/* Return Packet */}
      {showReturnPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={returnX}
            cy={28}
            title="HTTP 200 OK"
            protocol="TCP"
            port="52000"
            src="198.51.100.20"
            dst="192.168.1.50"
            status="ALLOW"
            scale={0.76}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {currentStepIndex === 8
            ? 'STEP 8: HOST SUBNET CALCULATION (BINARY AND OPERATION)'
            : currentStepIndex >= 10 && currentStepIndex <= 11
            ? 'STEP 10: DEFAULT GATEWAY FORWARDS OFF-SUBNET PACKET TO FIREWALL'
            : currentStepIndex >= 12 && currentStepIndex <= 13
            ? 'STEP 12: FIREWALL INSPECTS & PERMITS OUTBOUND EGRESS SESSION'
            : 'DEFAULT GATEWAY & FIREWALL INTERACTION ARCHITECTURE'}
        </text>

        {currentStepIndex === 8 ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="6" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="1.5" />
            <text x="14" y="20" fill="#0369a1" fontSize="9" fontWeight="bold" fontFamily="monospace">
              HOW ENDPOINTS DETERMINE GATEWAY USAGE:
            </text>
            <text x="14" y="42" fill="#0f172a" fontSize="8">
              1. Host IP (192.168.1.50) AND Subnet Mask (255.255.255.0) = Local Subnet: 192.168.1.0/24
            </text>
            <text x="14" y="60" fill="#0f172a" fontSize="8">
              2. Target IP (198.51.100.20) AND Subnet Mask (255.255.255.0) = Target Subnet: 198.51.100.0/24
            </text>
            <text x="14" y="80" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              3. RESULT: Local Subnet != Target Subnet → Destination is REMOTE (Off-Subnet).
            </text>
            <text x="14" y="105" fill="#15803d" fontSize="8" fontWeight="bold">
              Host automatically encapsulates frame with Destination MAC = Default Gateway (192.168.1.1).
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)">
            <rect x="0" y="0" width="325" height="130" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#0369a1" fontSize="9" fontWeight="bold" fontFamily="monospace">
              LOCAL vs REMOTE TRAFFIC
            </text>
            <text x="12" y="36" fill="#0f172a" fontSize="7.5">1. Local Destination (Same Subnet):</text>
            <text x="12" y="50" fill="#64748b" fontSize="7.5">   Direct Layer 2 ARP & switch delivery (Gateway bypassed).</text>
            <text x="12" y="66" fill="#0f172a" fontSize="7.5">2. Remote Destination (Outside Subnet):</text>
            <text x="12" y="80" fill="#64748b" fontSize="7.5">   Host forwards frame to Default Gateway MAC address.</text>
            <text x="12" y="102" fill="#0369a1" fontSize="7.5" fontWeight="bold">Default route (0.0.0.0/0) provides path to the world.</text>

            <rect x="345" y="0" width="325" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" />
            <text x="357" y="18" fill="#15803d" fontSize="9" fontWeight="bold" fontFamily="monospace">
              GATEWAY + FIREWALL TOPOLOGIES
            </text>
            <text x="357" y="36" fill="#0f172a" fontSize="7.5">1. Model A: Firewall IS the Default Gateway (Branch Office).</text>
            <text x="357" y="50" fill="#64748b" fontSize="7.5">   100% of inter-VLAN and WAN traffic inspected immediately.</text>
            <text x="357" y="66" fill="#0f172a" fontSize="7.5">2. Model B: Core Switch Gateway + Firewall Next-Hop.</text>
            <text x="357" y="80" fill="#64748b" fontSize="7.5">   L3 switch handles fast LAN; routes 0.0.0.0/0 to Firewall.</text>
            <text x="357" y="102" fill="#15803d" fontSize="7.5" fontWeight="bold">Both models ensure WAN traffic traverses firewall security.</text>
          </g>
        )}
      </g>
    </svg>
  );
};
