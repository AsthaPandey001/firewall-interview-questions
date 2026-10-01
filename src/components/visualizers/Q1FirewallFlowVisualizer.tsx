import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q1FirewallFlowVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Initial Topology (Only Client, Firewall, Server - NO ARROWS)
  // Step 1: Packet Created at Client
  // Step 2: Packet Travels towards Firewall (Arrow appears)
  // Step 3: Packet Reaches Firewall & Firewall Activates
  // Step 4: Firewall Inspects 5-Tuple Header
  // Step 5: Firewall Evaluates ACL Security Rules
  // Step 6: Matching Rule Found
  // Step 7: Decision: ALLOW
  // Step 8: Packet Travels to Server (Forward Arrow appears)
  // Step 9: Final Complete Visual Summary

  const isClientActive = currentStepIndex >= 0;
  const isPacketCreated = currentStepIndex >= 1;
  const isAtFirewall = currentStepIndex >= 3 && currentStepIndex <= 7;
  const isInspecting = currentStepIndex >= 4;
  const isRuleChecking = currentStepIndex >= 5;
  const isMatched = currentStepIndex >= 6;
  const isAllowed = currentStepIndex >= 7;
  const isDelivered = currentStepIndex >= 8;

  // Packet position coordinates
  let packetX = 90;
  let packetY = 40;
  if (currentStepIndex === 1) { packetX = 140; packetY = 40; }
  else if (currentStepIndex === 2) { packetX = 235; packetY = 40; }
  else if (currentStepIndex >= 3 && currentStepIndex <= 7) { packetX = 370; packetY = 40; }
  else if (currentStepIndex === 8) { packetX = 510; packetY = 40; }
  else if (currentStepIndex >= 9) { packetX = 650; packetY = 40; }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="90" y1="95" x2="650" y2="95" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="4 4" />

      {/* 1. Client to Firewall Flow Arrow (ONLY from Step 2 onwards) */}
      {currentStepIndex >= 2 && (
        <BoldArrow
          x1={135}
          y1={95}
          x2={325}
          y2={95}
          color="#2563eb"
          label={currentStepIndex === 2 ? 'PACKET TRANSIT' : undefined}
        />
      )}

      {/* 2. Firewall to Server Flow Arrow (ONLY from Step 8 onwards) */}
      {currentStepIndex >= 8 && (
        <BoldArrow
          x1={415}
          y1={95}
          x2={605}
          y2={95}
          color="#10b981"
          label="FORWARDED"
        />
      )}

      {/* Device Nodes (Center Y = 95 - Progressive Reveal) */}
      <LaptopNode
        cx={90}
        cy={95}
        label="CLIENT"
        ip="10.0.0.25"
        active={isClientActive}
        success={isDelivered}
      />

      {currentStepIndex >= 2 && (
        <FirewallGatewayNode
          cx={370}
          cy={95}
          label="FIREWALL"
          sub="Security Gateway"
          active={isAtFirewall || currentStepIndex >= 3}
          success={isAllowed}
          scannerActive={currentStepIndex === 3 || currentStepIndex === 4 || currentStepIndex === 5}
        />
      )}

      {currentStepIndex >= 8 && (
        <ServerNodeSVG
          cx={650}
          cy={95}
          label="SERVER"
          sub="203.0.113.50:443"
          active={isDelivered}
          success={isDelivered}
        />
      )}

      {/* Moving Packet Card (Visible physical packet, floats comfortably above at Y=40) */}
      {isPacketCreated && currentStepIndex !== 9 && (
        <PacketCard
          cx={packetX}
          cy={packetY}
          title="DATA PACKET"
          protocol="TCP"
          port="443"
          src="10.0.0.25"
          dst="SERVER"
          flags="SYN"
          status={isAllowed ? 'ALLOW' : isInspecting ? 'INSPECT' : 'NORMAL'}
          scale={0.88}
        />
      )}

      {/* Final Complete Story Banner on Step 9 */}
      {currentStepIndex >= 9 && (
        <g transform="translate(370, 25)" className="animate-pop-in">
          <rect x="-180" y="-13" width="360" height="26" rx="13" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.8" />
          <text x="0" y="4" textAnchor="middle" fill="#065f46" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
            PACKET → FIREWALL INSPECTED → ALLOWED ✓ → DELIVERED
          </text>
        </g>
      )}

      {/* Bottom Panel: Cumulative 5-Tuple Extraction & ACL Rule Evaluation */}
      <g transform="translate(35, 160)">
        <rect x="0" y="0" width="690" height="165" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="690" height="26" rx="9" fill="#f8fafc" />
        <text x="16" y="17" fill="#334155" fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
          FIREWALL INSPECTION & RULE EVALUATION ENGINE
        </text>
        <line x1="0" y1="26" x2="690" y2="26" stroke="#e2e8f0" strokeWidth="1" />

        {/* 5-Tuple Extracted Header Badges (Revealed progressively from Step 4) */}
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
