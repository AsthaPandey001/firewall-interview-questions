import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q25HostVsNetworkFwVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // PART A: HOST-BASED FIREWALL (Steps 0-9)
  // Step 0: Laptop appears
  // Step 1: Local OS Application appears (browser.exe / PID 4092)
  // Step 2: Application creates network socket & packet
  // Step 3: Host Firewall (Windows Defender / iptables) intercepts inside OS kernel
  // Step 4: Host Firewall checks per-process policy: ALLOW browser.exe Outbound on Port 443
  // Step 5: Action: ALLOW
  // Step 6: Packet exits physical NIC and travels across LAN
  // Step 7: Local Server receives packet
  // Step 8: Server creates return response
  // Step 9: Laptop receives response (HOST FIREWALL SCENARIO COMPLETE ✓) - STOP
  //
  // PART B: NETWORK-BASED FIREWALL (Steps 10-22)
  // Step 10: Laptop on User Subnet appears
  // Step 11: Centralized Network Firewall appliance appears at gateway
  // Step 12: Enterprise Datacenter Server appears in Datacenter Zone
  // Step 13: Inter-subnet network cables drawn
  // Step 14: Client generates network packet
  // Step 15: Packet leaves laptop NIC
  // Step 16: Packet travels across LAN switch to Network Firewall
  // Step 17: Network Firewall intercepts packet (ASIC Acceleration & Zone Policy)
  // Step 18: Firewall inspects Layer 3-7 (Zone User-Trust -> Datacenter-Zone)
  // Step 19: Rule Match: ALLOW HTTPS & DPI Clean
  // Step 20: Packet moves: NETWORK FIREWALL -> DATACENTER SERVER
  // Step 21: Server receives packet (ACCEPTED ✓)
  // Step 22: Return response travels back through Network Firewall to Client (ROUND-TRIP COMPLETE ✓)

  const isNetworkPhase = currentStepIndex >= 10;

  // Node Visibilities
  const showApp = currentStepIndex >= 1 && !isNetworkPhase;
  const showServerPartA = currentStepIndex >= 7 && !isNetworkPhase;

  const showNetFw = currentStepIndex >= 11;
  const showDcServer = currentStepIndex >= 12;
  const showNetCables = currentStepIndex >= 13;

  // Coordinates
  let packetX = 80;
  let returnX = 660;

  if (!isNetworkPhase) {
    if (currentStepIndex <= 2) packetX = 80;
    else if (currentStepIndex >= 3 && currentStepIndex <= 5) packetX = 80;
    else if (currentStepIndex === 6) packetX = 370;
    else if (currentStepIndex >= 7) packetX = 660;

    if (currentStepIndex === 8) returnX = 370;
    else if (currentStepIndex >= 9) returnX = 80;
  } else {
    if (currentStepIndex === 14) packetX = 80;
    else if (currentStepIndex === 15) packetX = 140;
    else if (currentStepIndex === 16) packetX = 230;
    else if (currentStepIndex >= 17 && currentStepIndex <= 19) packetX = 370;
    else if (currentStepIndex === 20) packetX = 510;
    else if (currentStepIndex >= 21) packetX = 660;

    if (currentStepIndex === 22) returnX = 80;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {(!isNetworkPhase && currentStepIndex >= 6) && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}
      {showNetCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {!isNetworkPhase && currentStepIndex === 6 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#2563eb" label="TRANSMITTING ACROSS LAN →" />
      )}
      {!isNetworkPhase && currentStepIndex === 8 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#8b5cf6" label="← RETURN REPLY" />
      )}

      {isNetworkPhase && currentStepIndex === 16 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#2563eb" label="TO NETWORK FIREWALL →" />
      )}
      {isNetworkPhase && currentStepIndex === 20 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="PERMITTED TO SERVER →" />
      )}
      {isNetworkPhase && currentStepIndex >= 22 && (
        <BoldArrow x1={615} y1={75} x2={115} y2={75} color="#8b5cf6" label="← STATEFUL RETURN TO CLIENT" />
      )}

      {/* Left Node */}
      <g>
        <LaptopNode
          cx={80}
          cy={75}
          label={isNetworkPhase ? 'CLIENT LAPTOP' : 'HOST OS LAPTOP'}
          ip="10.0.1.25"
          active={!isNetworkPhase ? currentStepIndex <= 6 || currentStepIndex >= 9 : currentStepIndex <= 15 || currentStepIndex >= 22}
          statusText={
            !isNetworkPhase && currentStepIndex >= 3 && currentStepIndex <= 5
              ? 'HOST FW: OK ✓'
              : undefined
          }
        />
        {/* Host OS Firewall Badge inside Host */}
        {!isNetworkPhase && currentStepIndex >= 3 && (
          <g transform="translate(45, 120)" className="animate-pop-in">
            <rect x="0" y="0" width="70" height="18" rx="4" fill="#0f172a" stroke="#3b82f6" />
            <text x="35" y="12" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="bold" fontFamily="monospace">
              OS KERNEL FW
            </text>
          </g>
        )}
      </g>

      {/* Middle Node: Network Firewall (Part B only) */}
      {showNetFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="NETWORK FIREWALL"
          sub={currentStepIndex >= 17 && currentStepIndex <= 19 ? 'Zone Policy & DPI' : 'Hardware Appliance'}
          active={currentStepIndex >= 16 && currentStepIndex <= 20}
          success={currentStepIndex >= 19}
        />
      )}

      {/* Right Server Node */}
      {((!isNetworkPhase && showServerPartA) || (isNetworkPhase && showDcServer)) && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label={isNetworkPhase ? 'DATACENTER SERVER' : 'LOCAL SERVER'}
          sub="10.0.5.100:443"
          active={(!isNetworkPhase && currentStepIndex >= 7) || (isNetworkPhase && currentStepIndex >= 21)}
          success={(!isNetworkPhase && currentStepIndex >= 7) || (isNetworkPhase && currentStepIndex >= 21)}
          statusText={
            (!isNetworkPhase && currentStepIndex >= 7) || (isNetworkPhase && currentStepIndex >= 21)
              ? 'ACCEPTED ✓'
              : 'STANDBY'
          }
        />
      )}

      {/* Forward Packet */}
      {((!isNetworkPhase && currentStepIndex >= 2 && currentStepIndex <= 7) ||
        (isNetworkPhase && currentStepIndex >= 14 && currentStepIndex <= 21)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              (!isNetworkPhase && currentStepIndex >= 5) || (isNetworkPhase && currentStepIndex >= 19)
                ? 'ALLOW ✓'
                : 'HTTPS REQ'
            }
            protocol="TCP"
            port="443"
            src="10.0.1.25"
            dst="10.0.5.100"
            status={
              (!isNetworkPhase && currentStepIndex >= 3 && currentStepIndex <= 4) ||
              (isNetworkPhase && currentStepIndex >= 17 && currentStepIndex <= 18)
                ? 'INSPECT'
                : 'ALLOW'
            }
            scale={0.78}
          />
        </g>
      )}

      {/* Return Packet */}
      {((!isNetworkPhase && currentStepIndex >= 8) || (isNetworkPhase && currentStepIndex >= 22)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={returnX}
            cy={28}
            title="HTTP 200 OK"
            protocol="TCP"
            port="443"
            src="10.0.5.100"
            dst="10.0.1.25"
            status="ALLOW"
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isNetworkPhase
            ? 'PART B: NETWORK-BASED FIREWALL (CENTRALIZED HARDWARE APPLIANCE / PERIMETER GATEWAY)'
            : 'PART A: HOST-BASED FIREWALL (LOCAL OS KERNEL / PROCESS-AWARE FILTERING)'}
        </text>

        {!isNetworkPhase ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">
              HOST FIREWALL ARCHITECTURE (Windows Defender / Linux iptables / macOS PF)
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Location: Installed directly inside the local Operating System kernel on the endpoint.
            </text>
            <text x="14" y="54" fill="#0f172a" fontSize="7.5">
              2. Process Awareness: Knows the exact executable name (\`browser.exe\`), local user ID, and active socket PID.
            </text>
            <text x="14" y="70" fill="#0f172a" fontSize="7.5">
              3. Lateral Movement Defense: Protects against attacks originating from other infected hosts on the same local switch subnet.
            </text>
            <text x="14" y="88" fill="#15803d" fontSize="7.5" fontWeight="bold">
              • Host Rule Match: Outbound process 'browser.exe' permitted on port 443 → Packet exits physical NIC.
            </text>
            <text x="14" y="110" fill="#1e40af" fontSize="7.5" fontWeight="bold">
              SUMMARY: Host firewalls protect individual endpoints from local lateral attacks.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#065f46" fontSize="9" fontWeight="bold" fontFamily="monospace">
              NETWORK FIREWALL ARCHITECTURE (Palo Alto / Fortinet / Cisco Firepower Appliance)
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Location: Dedicated inline hardware appliance positioned at enterprise network/subnet boundaries.
            </text>
            <text x="14" y="54" fill="#0f172a" fontSize="7.5">
              2. Scope & Throughput: Protects thousands of downstream hosts with multi-gigabit ASIC acceleration.
            </text>
            <text x="14" y="70" fill="#0f172a" fontSize="7.5">
              3. Centralized Control: Enforces uniform corporate security policies, zone segmentation, and Deep Packet Inspection (DPI).
            </text>
            <text x="14" y="88" fill="#15803d" fontSize="7.5" fontWeight="bold">
              • Enterprise Policy Match: Zone User-LAN → Datacenter permitted (HTTPS + App-ID verified).
            </text>
            <text x="14" y="110" fill="#065f46" fontSize="7.5" fontWeight="bold">
              DEFENSE-IN-DEPTH: Network firewalls protect the enterprise perimeter; Host firewalls protect against lateral spread.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
