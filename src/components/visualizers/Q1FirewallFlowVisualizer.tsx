import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q1FirewallFlowVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Only Client visible (10.0.0.25)
  // Step 1: Firewall Gateway appears (Security Barrier)
  // Step 2: Destination Server appears (203.0.113.50:443)
  // Step 3: Network cables appear & connect topology
  // Step 4: Client creates TCP SYN packet (5-Tuple generated)
  // Step 5: Packet physically moves: CLIENT -> FIREWALL
  // Step 6: Packet reaches Firewall (Ingress buffer & 5-Tuple extraction)
  // Step 7: Firewall checks ACL security rulebase sequentially
  // Step 8: Rule #1 Match confirmed (ALLOW 10.0.0.0/24 -> 203.0.113.50:443)
  // Step 9: Firewall allows & forwards packet to Server
  // Step 10: Server receives TCP SYN & generates SYN-ACK response
  // Step 11: SYN-ACK returns through Firewall (Stateful match) to Client
  // Step 12: Client receives SYN-ACK: Full TCP session established (COMPLETED ✓)

  const showClient = true;
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;
  const showPacket = currentStepIndex >= 4 && currentStepIndex <= 9;
  const showReturnPacket = currentStepIndex >= 10;

  const isMovingToFw = currentStepIndex === 5;
  const isAtFw = currentStepIndex >= 6 && currentStepIndex <= 8;
  const isInspecting = currentStepIndex >= 6;
  const isRuleChecking = currentStepIndex >= 7;
  const isMatched = currentStepIndex >= 8;
  const isAllowed = currentStepIndex >= 8;
  const isMovingToServer = currentStepIndex === 9;
  const isAtServer = currentStepIndex === 10;
  const isReturnTransit = currentStepIndex === 11;
  const isCompleted = currentStepIndex >= 12;

  // Forward Packet X position
  let packetX = 90;
  if (currentStepIndex <= 4) packetX = 90;
  else if (isMovingToFw) packetX = 230;
  else if (isAtFw) packetX = 370;
  else if (isMovingToServer) packetX = 510;
  else if (currentStepIndex >= 10) packetX = 650;

  // Return Packet X position
  let returnX = 650;
  if (currentStepIndex === 10) returnX = 650;
  else if (currentStepIndex === 11) returnX = 370;
  else if (currentStepIndex >= 12) returnX = 90;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      {showCables && (
        <line x1="90" y1="85" x2="650" y2="85" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {isMovingToFw && (
        <BoldArrow x1={135} y1={85} x2={325} y2={85} color="#2563eb" label="TRANSMITTING →" />
      )}
      {isMovingToServer && (
        <BoldArrow x1={415} y1={85} x2={605} y2={85} color="#10b981" label="FORWARDED →" />
      )}
      {isReturnTransit && (
        <BoldArrow x1={605} y1={85} x2={135} y2={85} color="#8b5cf6" reverse label="← SYN-ACK (STATEFUL RETURN)" />
      )}

      {/* Progressive Device Nodes */}
      {showClient && (
        <g className="animate-pop-in">
          <LaptopNode
            cx={90}
            cy={85}
            label="CLIENT"
            ip="10.0.0.25"
            active={currentStepIndex <= 5 || isCompleted}
            success={isCompleted}
            statusText={isCompleted ? 'ESTABLISHED ✓' : currentStepIndex === 0 ? 'READY' : undefined}
          />
        </g>
      )}

      {showFw && (
        <g className="animate-pop-in">
          <FirewallGatewayNode
            cx={370}
            cy={85}
            label="FIREWALL"
            sub={isAtFw ? 'INSPECTING' : 'Security Gateway'}
            active={isAtFw || isReturnTransit}
            success={isAllowed}
            scannerActive={isAtFw}
          />
        </g>
      )}

      {showServer && (
        <g className="animate-pop-in">
          <ServerNodeSVG
            cx={650}
            cy={85}
            label="SERVER"
            sub="203.0.113.50:443"
            active={isAtServer || (currentStepIndex >= 10 && !isCompleted)}
            success={currentStepIndex >= 10}
            statusText={currentStepIndex >= 10 ? 'ACCEPTED ✓' : 'STANDBY'}
          />
        </g>
      )}

      {/* Forward Packet Card */}
      {showPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={34}
            title={isAllowed ? 'PERMITTED' : 'TCP SYN'}
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="203.0.113.50"
            flags="SYN"
            status={isAllowed ? 'ALLOW' : isInspecting ? 'INSPECT' : 'NORMAL'}
            scale={0.82}
          />
        </g>
      )}

      {/* Return Packet Card */}
      {showReturnPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={returnX}
            cy={34}
            title="SYN-ACK"
            protocol="TCP"
            port="52410"
            src="203.0.113.50"
            dst="10.0.0.25"
            flags="SYN,ACK"
            status="ALLOW"
            scale={0.82}
          />
        </g>
      )}

      {/* Top Banner on Final Step */}
      {isCompleted && (
        <g transform="translate(370, 22)" className="animate-pop-in">
          <rect x="-210" y="-12" width="420" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.8" />
          <text x="0" y="4.5" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="bold" fontFamily="monospace">
            ✓ END-TO-END FLOW: SYN → FW INSPECTED → ALLOWED → SYN-ACK RETURNED
          </text>
        </g>
      )}

      {/* Bottom Panel: Cumulative 5-Tuple Extraction & ACL Rule Evaluation */}
      <g transform="translate(35, 145)">
        <rect x="0" y="0" width="690" height="180" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="690" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
          FIREWALL INSPECTION & RULE EVALUATION ENGINE
        </text>
        <line x1="0" y1="26" x2="690" y2="26" stroke="#e2e8f0" strokeWidth="1" />

        {/* 5-Tuple Extracted Header Badges (Revealed progressively from Step 6) */}
        <g transform="translate(16, 40)">
          <text x="0" y="0" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">
            EXTRACTED 5-TUPLE:
          </text>
          
          <g transform="translate(115, -10)">
            <rect x="0" y="0" width="105" height="20" rx="4" fill={isInspecting ? '#eff6ff' : '#f1f5f9'} stroke={isInspecting ? '#3b82f6' : '#cbd5e1'} />
            <text x="52" y="13" textAnchor="middle" fill={isInspecting ? '#1e40af' : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              SRC: 10.0.0.25
            </text>
          </g>

          <g transform="translate(230, -10)">
            <rect x="0" y="0" width="115" height="20" rx="4" fill={isInspecting ? '#eff6ff' : '#f1f5f9'} stroke={isInspecting ? '#3b82f6' : '#cbd5e1'} />
            <text x="57" y="13" textAnchor="middle" fill={isInspecting ? '#1e40af' : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              DST: 203.0.113.50
            </text>
          </g>

          <g transform="translate(355, -10)">
            <rect x="0" y="0" width="85" height="20" rx="4" fill={isInspecting ? '#eff6ff' : '#f1f5f9'} stroke={isInspecting ? '#3b82f6' : '#cbd5e1'} />
            <text x="42" y="13" textAnchor="middle" fill={isInspecting ? '#1e40af' : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              PROTO: TCP
            </text>
          </g>

          <g transform="translate(450, -10)">
            <rect x="0" y="0" width="80" height="20" rx="4" fill={isInspecting ? '#eff6ff' : '#f1f5f9'} stroke={isInspecting ? '#3b82f6' : '#cbd5e1'} />
            <text x="40" y="13" textAnchor="middle" fill={isInspecting ? '#1e40af' : '#94a3b8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              PORT: :443
            </text>
          </g>

          {isAllowed && (
            <g transform="translate(540, -10)">
              <rect x="0" y="0" width="105" height="20" rx="4" fill="#ecfdf5" stroke="#10b981" />
              <text x="52" y="13" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold" fontFamily="monospace">
                ✓ PERMITTED
              </text>
            </g>
          )}
        </g>

        {/* Live Rule Table */}
        <g transform="translate(16, 75)">
          {/* Table Header */}
          <rect x="0" y="0" width="658" height="18" fill="#f1f5f9" rx="3" />
          <text x="12" y="12" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">RULE</text>
          <text x="55" y="12" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">ACTION</text>
          <text x="125" y="12" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">SOURCE IP</text>
          <text x="245" y="12" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">DESTINATION</text>
          <text x="370" y="12" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">PORT</text>
          <text x="475" y="12" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">STATUS</text>

          {/* Rule 1 (Active Rule) */}
          <rect
            x="0"
            y="22"
            width="658"
            height="26"
            rx="4"
            fill={isMatched ? '#ecfdf5' : isRuleChecking ? '#eff6ff' : '#ffffff'}
            stroke={isMatched ? '#10b981' : isRuleChecking ? '#3b82f6' : '#e2e8f0'}
            strokeWidth={isRuleChecking || isMatched ? 1.5 : 1}
          />
          <text x="12" y="38" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">1</text>
          <text x="55" y="38" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>
          <text x="125" y="38" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">10.0.0.0/24</text>
          <text x="245" y="38" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">203.0.113.50</text>
          <text x="370" y="38" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">TCP:443 (HTTPS)</text>
          <text x="475" y="38" fill={isMatched ? '#059669' : isRuleChecking ? '#2563eb' : '#94a3b8'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isMatched ? 'MATCH FOUND: ALLOW ✓' : isRuleChecking ? 'EVALUATING...' : 'PENDING'}
          </text>

          {/* Rule 2 (Implicit Deny) */}
          <rect x="0" y="52" width="658" height="22" rx="3" fill="#f8fafc" />
          <text x="12" y="66" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">DEF</text>
          <text x="55" y="66" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">DENY</text>
          <text x="125" y="66" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="245" y="66" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="370" y="66" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">ANY</text>
          <text x="475" y="66" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            {isMatched ? 'SKIPPED (First Match Rule Applied)' : 'DEFAULT'}
          </text>
        </g>
      </g>
    </svg>
  );
};
