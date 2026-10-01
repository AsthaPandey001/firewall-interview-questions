import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q28RuleOptimizationVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // PHASE 1: UNOPTIMIZED BLOATED RULESET (Steps 0-13)
  // Step 0: Client appears (10.0.1.14)
  // Step 1: Firewall appears with 5 individual host rules (10.0.1.10 ... 10.0.1.14)
  // Step 2: Server appears (10.0.5.50:443)
  // Step 3: Cables drawn
  // Step 4: Rules appear individually in unoptimized table
  // Step 5: Packet arrives at Firewall (SRC: 10.0.1.14)
  // Step 6: Rule 1 evaluated: 10.0.1.10 (NO MATCH ✕)
  // Step 7: Rule 2 evaluated: 10.0.1.11 (NO MATCH ✕)
  // Step 8: Rule 3 evaluated: 10.0.1.12 (NO MATCH ✕)
  // Step 9: Rule 4 evaluated: 10.0.1.13 (NO MATCH ✕)
  // Step 10: Rule 5 evaluated: 10.0.1.14 (MATCH: ALLOW ✓)
  // Step 11: Action: ALLOW
  // Step 12: Packet moves: FIREWALL -> SERVER
  // Step 13: Server receives packet (5 evaluation cycles consumed) - STOP
  //
  // PHASE 2: OPTIMIZED SUPERNET CIDR RULESET (Steps 14-20)
  // Step 14: Optimization Engine highlights redundant host IPs
  // Step 15: Consolidation: 5 fragmented rules merged into 1 Supernet CIDR rule (10.0.1.0/24)
  // Step 16: Streamlined 1-Rule Table deployed
  // Step 17: Retransmitted packet arrives at Firewall
  // Step 18: Instant Cycle 1 Match on CIDR supernet rule (ALLOW ✓)
  // Step 19: Packet moves: FIREWALL -> SERVER
  // Step 20: Server receives packet (1 evaluation cycle vs 5 cycles)

  const isOptimizedPhase = currentStepIndex >= 14;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isDeliveredPhase1 = currentStepIndex >= 12 && currentStepIndex <= 13;
  const isDeliveredPhase2 = currentStepIndex >= 20;

  let packetX = 80;
  if (!isOptimizedPhase) {
    if (currentStepIndex <= 4) packetX = 80;
    else if (currentStepIndex >= 5 && currentStepIndex <= 11) packetX = 370;
    else if (currentStepIndex === 12) packetX = 510;
    else if (currentStepIndex >= 13) packetX = 660;
  } else {
    if (currentStepIndex <= 16) packetX = 80;
    else if (currentStepIndex >= 17 && currentStepIndex <= 18) packetX = 370;
    else if (currentStepIndex === 19) packetX = 510;
    else if (currentStepIndex >= 20) packetX = 660;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {!isOptimizedPhase && currentStepIndex === 12 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="CYCLE 5 MATCH →" />
      )}
      {isOptimizedPhase && currentStepIndex === 19 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="FAST 1-CYCLE MATCH →" />
      )}

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT"
        ip="10.0.1.14"
        active={!isOptimizedPhase ? currentStepIndex <= 5 : currentStepIndex <= 17 || isDeliveredPhase2}
        statusText={isDeliveredPhase2 ? 'DELIVERED ✓' : undefined}
      />

      {showFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="FIREWALL"
          sub={isOptimizedPhase ? 'Optimized CIDR' : 'Unoptimized 5 Rules'}
          active={
            (!isOptimizedPhase && currentStepIndex >= 5 && currentStepIndex <= 11) ||
            (isOptimizedPhase && currentStepIndex >= 17 && currentStepIndex <= 18)
          }
          success={isDeliveredPhase1 || isDeliveredPhase2}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="SERVER"
          sub="10.0.5.50:443"
          active={isDeliveredPhase1 || isDeliveredPhase2}
          success={isDeliveredPhase1 || isDeliveredPhase2}
          statusText={isDeliveredPhase1 || isDeliveredPhase2 ? 'ACCEPTED ✓' : 'STANDBY'}
        />
      )}

      {/* Packet Card */}
      {((!isOptimizedPhase && currentStepIndex >= 5) || (isOptimizedPhase && currentStepIndex >= 17)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              (!isOptimizedPhase && currentStepIndex >= 10) || (isOptimizedPhase && currentStepIndex >= 18)
                ? 'ALLOW ✓'
                : 'HTTPS SYN'
            }
            protocol="TCP"
            port="443"
            src="10.0.1.14"
            dst="10.0.5.50"
            status={
              (!isOptimizedPhase && currentStepIndex >= 5 && currentStepIndex <= 9) ||
              (isOptimizedPhase && currentStepIndex === 17)
                ? 'INSPECT'
                : 'ALLOW'
            }
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isOptimizedPhase
            ? 'AFTER OPTIMIZATION: CONSOLIDATED SUPERNET CIDR (1-CYCLE LOOKUP)'
            : 'BEFORE OPTIMIZATION: FRAGMENTED INDIVIDUAL HOST RULES (5 SEQUENTIAL CHECKS)'}
        </text>

        {!isOptimizedPhase ? (
          /* Unoptimized Table */
          <g transform="translate(16, 34)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="135" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="10" y="14" fill="#1e40af" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              SEQUENTIAL EVALUATION CYCLES FOR INCOMING SRC=10.0.1.14:
            </text>

            <g transform="translate(10, 20)">
              {/* Rule 1 */}
              <text x="0" y="14" fill={currentStepIndex === 6 ? '#dc2626' : '#64748b'} fontSize="7.5" fontFamily="monospace">
                Cycle 1: Check Rule 1 (10.0.1.10) {currentStepIndex >= 6 && '→ NO MATCH ✕'}
              </text>
              {/* Rule 2 */}
              <text x="0" y="28" fill={currentStepIndex === 7 ? '#dc2626' : '#64748b'} fontSize="7.5" fontFamily="monospace">
                Cycle 2: Check Rule 2 (10.0.1.11) {currentStepIndex >= 7 && '→ NO MATCH ✕'}
              </text>
              {/* Rule 3 */}
              <text x="0" y="42" fill={currentStepIndex === 8 ? '#dc2626' : '#64748b'} fontSize="7.5" fontFamily="monospace">
                Cycle 3: Check Rule 3 (10.0.1.12) {currentStepIndex >= 8 && '→ NO MATCH ✕'}
              </text>
              {/* Rule 4 */}
              <text x="0" y="56" fill={currentStepIndex === 9 ? '#dc2626' : '#64748b'} fontSize="7.5" fontFamily="monospace">
                Cycle 4: Check Rule 4 (10.0.1.13) {currentStepIndex >= 9 && '→ NO MATCH ✕'}
              </text>
              {/* Rule 5 */}
              <text x="0" y="70" fill={currentStepIndex >= 10 ? '#15803d' : '#64748b'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                Cycle 5: Check Rule 5 (10.0.1.14) {currentStepIndex >= 10 && '→ MATCH: ALLOW ✓ (5 CYCLES CONSUMED)'}
              </text>
            </g>

            <text x="10" y="118" fill="#dc2626" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              INEFFICIENCY: Five separate rules for contiguous IPs inflate ACL size and waste CPU lookup cycles.
            </text>
          </g>
        ) : (
          /* Optimized Table */
          <g transform="translate(16, 34)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="135" rx="4" fill="#f0fdf4" stroke="#86efac" />
            <text x="10" y="16" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              CONSOLIDATED SUPERNET POLICY (CIDR / OBJECT-GROUP):
            </text>

            <g transform="translate(10, 26)">
              <rect x="0" y="0" width="648" height="34" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
              <text x="10" y="21" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                Rule 1 (Consolidated): ALLOW SRC=10.0.1.0/24 DST=10.0.5.50:443 PROTO=TCP {currentStepIndex >= 18 && '→ MATCH: ALLOW ✓ (1 CYCLE)'}
              </text>
            </g>

            <text x="10" y="80" fill="#0f172a" fontSize="7.5">
              • Optimization Benefit 1: Merges 5 fragmented lines into 1 clean subnet CIDR rule.
            </text>
            <text x="10" y="96" fill="#0f172a" fontSize="7.5">
              • Optimization Benefit 2: Immediate 1st-cycle match eliminates unnecessary sequential iterations.
            </text>
            <text x="10" y="118" fill="#15803d" fontSize="7.5" fontWeight="bold">
              OPTIMIZATION SUMMARY: Supernetting, hit-count ordering, and purging dead rules streamlines policy evaluation.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
