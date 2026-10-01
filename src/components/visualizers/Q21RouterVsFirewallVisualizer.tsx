import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, RouterNodeSVG, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q21RouterVsFirewallVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Only Client visible
  // Step 1: Router appears
  // Step 2: Firewall appears
  // Step 3: Server appears
  // Step 4: Network connections appear
  // Step 5: Packet created at Client (SRC: 10.0.0.25, DST: 10.0.0.50, TCP :443)
  // Step 6: Packet moves: CLIENT -> ROUTER
  // Step 7: Router receives packet & performs ROUTE LOOKUP
  // Step 8: Router determines Next Hop -> FIREWALL
  // Step 9: Packet moves: ROUTER -> FIREWALL
  // Step 10: Firewall receives packet (INSPECTING)
  // Step 11: 5-Tuple evaluation (SRC, DST, PORT, PROTO)
  // Step 12: Policy Evaluation
  // Step 13: Firewall decides: ALLOW
  // Step 14: Packet moves: FIREWALL -> SERVER
  // Step 15: Server receives packet (ACCEPTED ✓)
  // Step 16: Server generates HTTP 200 / SYN-ACK Response packet
  // Step 17: Response physically travels back: SERVER -> FIREWALL -> ROUTER -> CLIENT
  // Step 18: Client receives response (COMPLETED ✓) + Core Architectural Comparison

  const showRouter = currentStepIndex >= 1;
  const showFirewall = currentStepIndex >= 2;
  const showServer = currentStepIndex >= 3;
  const showCables = currentStepIndex >= 4;
  const showPacket = currentStepIndex >= 5 && currentStepIndex <= 15;
  const showReturnPacket = currentStepIndex >= 16;

  const isAtRouter = currentStepIndex >= 7 && currentStepIndex <= 8;
  const isAtFirewall = currentStepIndex >= 10 && currentStepIndex <= 13;
  const isAtServer = currentStepIndex === 15 || currentStepIndex === 16;
  const isReturnTransit = currentStepIndex === 17;
  const isCompleted = currentStepIndex >= 18;

  // Forward Packet X position
  let packetX = 80;
  if (currentStepIndex === 5) packetX = 80;
  else if (currentStepIndex === 6) packetX = 170;
  else if (currentStepIndex >= 7 && currentStepIndex <= 8) packetX = 260;
  else if (currentStepIndex === 9) packetX = 355;
  else if (currentStepIndex >= 10 && currentStepIndex <= 13) packetX = 450;
  else if (currentStepIndex === 14) packetX = 555;
  else if (currentStepIndex >= 15) packetX = 660;

  // Return Packet X position
  let returnX = 660;
  if (currentStepIndex === 16) returnX = 660;
  else if (currentStepIndex === 17) returnX = 360;
  else if (currentStepIndex >= 18) returnX = 80;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Cables */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {currentStepIndex === 6 && (
        <BoldArrow x1={115} y1={75} x2={225} y2={75} color="#2563eb" label="TRANSMITTING →" />
      )}
      {currentStepIndex === 9 && (
        <BoldArrow x1={295} y1={75} x2={415} y2={75} color="#0891b2" label="ROUTED →" />
      )}
      {currentStepIndex === 14 && (
        <BoldArrow x1={485} y1={75} x2={625} y2={75} color="#10b981" label="PERMITTED →" />
      )}
      {isReturnTransit && (
        <BoldArrow x1={625} y1={75} x2={115} y2={75} color="#8b5cf6" label="← RETURN REPLY (STATEFUL)" />
      )}

      {/* Device Nodes */}
      <LaptopNode cx={80} cy={75} label="CLIENT" ip="10.0.0.25" active={currentStepIndex <= 6 || isCompleted} statusText={isCompleted ? 'RECEIVED ✓' : undefined} />

      {showRouter && (
        <RouterNodeSVG
          cx={260}
          cy={75}
          label="ROUTER"
          sub={isAtRouter ? 'Route Lookup' : 'Path Engine'}
          active={isAtRouter || (isReturnTransit && returnX <= 260)}
        />
      )}

      {showFirewall && (
        <FirewallGatewayNode
          cx={450}
          cy={75}
          label="FIREWALL"
          sub={isAtFirewall ? 'ACL Inspection' : 'Policy Engine'}
          active={isAtFirewall || (isReturnTransit && returnX <= 450)}
          success={currentStepIndex >= 13}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="SERVER"
          sub="10.0.0.50:443"
          active={isAtServer}
          success={currentStepIndex >= 15}
          statusText={currentStepIndex >= 15 ? 'ACCEPTED ✓' : 'STANDBY'}
        />
      )}

      {/* Forward Packet Card */}
      {showPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={currentStepIndex >= 13 ? 'PERMITTED' : currentStepIndex >= 7 ? 'ROUTED' : 'TCP SYN'}
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="10.0.0.50"
            status={isAtFirewall ? 'INSPECT' : currentStepIndex >= 13 ? 'ALLOW' : 'NORMAL'}
            scale={0.78}
          />
        </g>
      )}

      {/* Return Packet Card */}
      {showReturnPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={returnX}
            cy={28}
            title="HTTP 200 / ACK"
            protocol="TCP"
            port="49152"
            src="10.0.0.50"
            dst="10.0.0.25"
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
          {currentStepIndex >= 7 && currentStepIndex <= 8
            ? 'ROUTER OPERATION: ROUTING TABLE (FIB) LOOKUP → PATH SELECTION'
            : currentStepIndex >= 10 && currentStepIndex <= 13
            ? 'FIREWALL OPERATION: 5-TUPLE STATEFUL SECURITY POLICY EVALUATION'
            : currentStepIndex >= 16
            ? 'FULL ROUND-TRIP COMPLETE: STATEFUL RETURN FLOW TO CLIENT'
            : 'ROUTER (WHERE TRAFFIC GOES) vs FIREWALL (WHETHER TRAFFIC IS ALLOWED)'}
        </text>

        {/* Dynamic Display based on current phase */}
        {currentStepIndex >= 7 && currentStepIndex <= 8 ? (
          /* Router Table View */
          <g transform="translate(16, 40)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="125" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="20" fill="#0369a1" fontSize="9" fontWeight="bold" fontFamily="monospace">
              ROUTING TABLE (FIB) - EVALUATING DESTINATION IP: 10.0.0.50
            </text>
            <g transform="translate(12, 36)">
              <rect x="0" y="0" width="644" height="28" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
              <text x="10" y="18" fill="#0369a1" fontSize="8" fontWeight="bold" fontFamily="monospace">
                MATCH: 10.0.0.0/24 via Interface eth1 (Next-Hop: Firewall 10.0.0.1) ✓
              </text>
            </g>
            <g transform="translate(12, 70)">
              <rect x="0" y="0" width="644" height="24" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="16" fill="#64748b" fontSize="8" fontFamily="monospace">
                DEFAULT: 0.0.0.0/0 via WAN Gateway eth0 (Next-Hop: 203.0.113.1)
              </text>
            </g>
            <text x="12" y="115" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">
              ROUTER DECISION: Forward packet out eth1 towards Firewall. (Does not perform security policy check).
            </text>
          </g>
        ) : currentStepIndex >= 10 && currentStepIndex <= 13 ? (
          /* Firewall ACL Table View */
          <g transform="translate(16, 40)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="125" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="20" fill="#065f46" fontSize="9" fontWeight="bold" fontFamily="monospace">
              FIREWALL SECURITY POLICY RULEBASE - EVALUATING 5-TUPLE
            </text>
            <g transform="translate(12, 34)">
              <rect x="0" y="0" width="644" height="30" rx="4" fill={currentStepIndex >= 12 ? '#dcfce7' : '#eff6ff'} stroke={currentStepIndex >= 12 ? '#16a34a' : '#3b82f6'} strokeWidth="1.5" />
              <text x="10" y="19" fill={currentStepIndex >= 12 ? '#15803d' : '#1e40af'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                Rule 101: ALLOW SRC=10.0.0.0/24 DST=10.0.0.50 PROTO=TCP PORT=443 {currentStepIndex >= 12 && '→ MATCH: ALLOW ✓'}
              </text>
            </g>
            <g transform="translate(12, 70)">
              <rect x="0" y="0" width="644" height="24" rx="4" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="16" fill="#64748b" fontSize="8" fontFamily="monospace">
                Default Deny: DENY ANY ANY ANY (Implicit Deny)
              </text>
            </g>
            <text x="12" y="115" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">
              FIREWALL DECISION: Packet matches permitted rule; state table entry created; forwarded to Server.
            </text>
          </g>
        ) : (
          /* High-level comparison side-by-side */
          <g transform="translate(16, 36)">
            {/* Router Column */}
            <rect x="0" y="0" width="325" height="130" rx="6" fill="#f0f9ff" stroke="#bae6fd" />
            <text x="12" y="18" fill="#0369a1" fontSize="9" fontWeight="bold" fontFamily="monospace">
              ROUTER (Layer 3 Routing Engine)
            </text>
            <text x="12" y="36" fill="#0f172a" fontSize="7.5">1. Mission: Determines WHERE packets travel across networks.</text>
            <text x="12" y="52" fill="#0f172a" fontSize="7.5">2. Metric: Routing Table / FIB (Destination IP lookup).</text>
            <text x="12" y="68" fill="#0f172a" fontSize="7.5">3. Default Policy: Forwards all routable packets by default.</text>
            <text x="12" y="84" fill="#0f172a" fontSize="7.5">4. State: Stateless packet-by-packet forwarding.</text>
            <text x="12" y="104" fill="#0369a1" fontSize="7.5" fontWeight="bold">SUMMARY: Selects the optimal path towards destination.</text>

            {/* Firewall Column */}
            <rect x="345" y="0" width="325" height="130" rx="6" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="357" y="18" fill="#15803d" fontSize="9" fontWeight="bold" fontFamily="monospace">
              FIREWALL (Layer 3-7 Security Gateway)
            </text>
            <text x="357" y="36" fill="#0f172a" fontSize="7.5">1. Mission: Decides WHETHER packets are allowed to pass.</text>
            <text x="357" y="52" fill="#0f172a" fontSize="7.5">2. Metric: Security Policy ACL & 5-Tuple State Table.</text>
            <text x="357" y="68" fill="#0f172a" fontSize="7.5">3. Default Policy: Drops unmatched traffic (Implicit Deny).</text>
            <text x="357" y="84" fill="#0f172a" fontSize="7.5">4. State: Full bidirectional state tracking (TCP/UDP).</text>
            <text x="357" y="104" fill="#15803d" fontSize="7.5" fontWeight="bold">SUMMARY: Enforces organizational security boundaries.</text>
          </g>
        )}
      </g>
    </svg>
  );
};
