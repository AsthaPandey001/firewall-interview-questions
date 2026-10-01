import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q8MultipleMatchVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Client only
  // Step 1: Firewall appears
  // Step 2: Server appears
  // Step 3: Packet appears at client (10.0.0.25 -> 203.0.113.50:443 TCP)
  // Step 4: Packet moves: Client -> Firewall
  // Step 5: Firewall buffers and starts inspection
  // Step 6: 3 Competing rules loaded
  // Step 7: Rule 1 evaluated -> MATCH FOUND!
  // Step 8: Immediate evaluation STOP (First Match Principle)
  // Step 9: Rule 2 and Rule 3 visually faded out & never executed
  // Step 10: Action ALLOW executed -> Packet moves Firewall -> Server
  // Step 11: Server receives packet (Delivered ✓)

  const showClient = true;
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showPacket = currentStepIndex >= 3;
  const isMovingToFw = currentStepIndex === 4;
  const isAtFw = currentStepIndex >= 5 && currentStepIndex <= 9;
  const showRules = currentStepIndex >= 6;
  const isMatchedRule1 = currentStepIndex >= 7;
  const isStopped = currentStepIndex >= 8;
  const isFaded = currentStepIndex >= 9;
  const isMovingToServer = currentStepIndex === 10;
  const isDelivered = currentStepIndex >= 11;

  let packetX = 90;
  if (currentStepIndex <= 3) packetX = 90;
  else if (isMovingToFw) packetX = 230;
  else if (isAtFw) packetX = 370;
  else if (isMovingToServer) packetX = 510;
  else if (isDelivered) packetX = 650;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Links */}
      {showFw && (
        <line x1="90" y1="80" x2="370" y2="80" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}
      {showServer && (
        <line x1="370" y1="80" x2="650" y2="80" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Connection Arrows during movement */}
      {isMovingToFw && (
        <BoldArrow x1={135} y1={80} x2={325} y2={80} color="#2563eb" label="TRANSMITTING →" />
      )}
      {isMovingToServer && (
        <BoldArrow x1={415} y1={80} x2={605} y2={80} color="#10b981" label="FORWARDING →" />
      )}
      {isDelivered && (
        <BoldArrow x1={415} y1={80} x2={605} y2={80} color="#10b981" label="DELIVERED ✓" />
      )}

      {/* Nodes */}
      {showClient && (
        <g className="animate-pop-in">
          <LaptopNode cx={90} cy={80} label="CLIENT" ip="10.0.0.25" active={currentStepIndex <= 4} />
        </g>
      )}

      {showFw && (
        <g className="animate-pop-in">
          <FirewallGatewayNode 
            cx={370} 
            cy={80} 
            label="FIREWALL" 
            sub="First Match Engine" 
            active={isAtFw} 
            success={isMatchedRule1} 
          />
        </g>
      )}

      {showServer && (
        <g className="animate-pop-in">
          <ServerNodeSVG 
            cx={650} 
            cy={80} 
            label="SERVER" 
            sub="203.0.113.50:443" 
            active={isDelivered} 
            success={isDelivered} 
            statusText={isDelivered ? 'RECEIVED ✓' : 'WAITING...'}
          />
        </g>
      )}

      {/* Packet Card */}
      {showPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={34}
            title={isDelivered ? 'DELIVERED' : isMatchedRule1 ? 'PERMITTED' : 'CANDIDATE'}
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="203.0.113.50"
            status={isMatchedRule1 ? 'ALLOW' : isAtFw ? 'INSPECT' : 'NORMAL'}
            scale={0.8}
          />
        </g>
      )}

      {/* 3 Competing Rules Table (Revealed at Step 6+) */}
      {showRules ? (
        <g transform="translate(30, 140)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
          <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
            EVALUATING 3 MATCHING RULES (FIRST-MATCH TERMINATION PRINCIPLE)
          </text>

          {/* RULE 1: MATCH & TERMINATE */}
          <g transform="translate(16, 36)">
            <rect
              x="0"
              y="0"
              width="668"
              height="38"
              rx="6"
              fill={isMatchedRule1 ? '#ecfdf5' : '#eff6ff'}
              stroke={isMatchedRule1 ? '#10b981' : '#3b82f6'}
              strokeWidth={2}
            />
            <text x="12" y="24" fill="#0f172a" fontSize="9.5" fontWeight="bold" fontFamily="monospace">#1</text>
            <text x="45" y="24" fill="#059669" fontSize="9.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>
            <text x="120" y="24" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">10.0.0.0/24</text>
            <text x="240" y="24" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">203.0.113.50:443</text>
            <text x="370" y="24" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">TCP</text>
            <text x="460" y="24" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">
              {isStopped ? 'FIRST MATCH WINNER → STOP EVALUATION! ✓' : isMatchedRule1 ? 'MATCH FOUND ✓' : 'EVALUATING...'}
            </text>
          </g>

          {/* RULE 2: WOULD MATCH (DENY), BUT FADED OUT */}
          <g transform="translate(16, 80)" opacity={isFaded ? 0.35 : 0.8}>
            <rect x="0" y="0" width="668" height="32" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray={isFaded ? '4 4' : undefined} />
            <text x="12" y="21" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">#2</text>
            <text x="45" y="21" fill="#dc2626" fontSize="9" fontWeight="bold" fontFamily="monospace">DENY</text>
            <text x="120" y="21" fill="#64748b" fontSize="8.5" fontFamily="monospace">10.0.0.25 (Exact IP)</text>
            <text x="240" y="21" fill="#64748b" fontSize="8.5" fontFamily="monospace">203.0.113.50:443</text>
            <text x="370" y="21" fill="#64748b" fontSize="8.5" fontFamily="monospace">TCP</text>
            <text x="460" y="21" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              {isFaded ? '⚠️ FADED / SKIPPED (Never Evaluated)' : 'Potential Match'}
            </text>
          </g>

          {/* RULE 3: WOULD MATCH (ALLOW), BUT FADED OUT */}
          <g transform="translate(16, 118)" opacity={isFaded ? 0.35 : 0.8}>
            <rect x="0" y="0" width="668" height="32" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray={isFaded ? '4 4' : undefined} />
            <text x="12" y="21" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">#3</text>
            <text x="45" y="21" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">ALLOW</text>
            <text x="120" y="21" fill="#64748b" fontSize="8.5" fontFamily="monospace">ANY</text>
            <text x="240" y="21" fill="#64748b" fontSize="8.5" fontFamily="monospace">203.0.113.50:443</text>
            <text x="370" y="21" fill="#64748b" fontSize="8.5" fontFamily="monospace">TCP</text>
            <text x="460" y="21" fill="#64748b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              {isFaded ? '⚠️ FADED / SKIPPED (Never Evaluated)' : 'Potential Match'}
            </text>
          </g>

          {/* Summary Footer */}
          <text x="16" y="170" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
            RULE OF OPERATION: Firewall evaluation is sequential top-to-bottom. The FIRST matching rule wins and processing stops immediately.
          </text>
        </g>
      ) : (
        <g transform="translate(30, 160)">
          <rect x="0" y="0" width="700" height="150" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="6 6" />
          <text x="350" y="80" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
            {currentStepIndex === 0 && 'STEP 1: Topology initialized at Client. Click Next to establish Firewall.'}
            {currentStepIndex === 1 && 'STEP 2: Firewall online. Click Next to connect Target Server.'}
            {currentStepIndex === 2 && 'STEP 3: Server connected. Click Next to create candidate packet.'}
            {currentStepIndex === 3 && 'STEP 4: Candidate packet created. Click Next to transmit to Firewall.'}
            {currentStepIndex === 4 && 'STEP 5: Packet transmitting to Firewall...'}
            {currentStepIndex === 5 && 'STEP 6: Firewall buffering packet. Click Next to view competing rules.'}
          </text>
        </g>
      )}
    </svg>
  );
};
