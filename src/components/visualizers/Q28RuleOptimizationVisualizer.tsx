import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q28RuleOptimizationVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Unoptimized rulebase with redundant/overlapping rules appears
  // Step 2: Packet arrives at firewall
  // Step 3: Multiple redundant rule checks occur sequentially
  // Step 4: Redundant rules highlighted
  // Step 5: Optimization engine consolidates rules (CIDR aggregation & dead rule pruning)
  // Step 6: Optimized streamlined rule table generated
  // Step 7: Same packet arrives and hits Rule #1 immediately on Fast Path
  // Step 8: Clean delivery to Server (Optimized Delivery ✓)

  const isOptimizedPhase = currentStepIndex >= 4;

  const showServer = currentStepIndex >= 1;
  const isEvaluatingUnoptimized = currentStepIndex === 2 || currentStepIndex === 3;
  const isEvaluatingOptimized = currentStepIndex === 6;
  const isDelivered = currentStepIndex >= 7;

  let packetX = 90;
  if (!isOptimizedPhase) {
    if (currentStepIndex === 1) packetX = 220;
    else if (currentStepIndex >= 2) packetX = 370;
  } else {
    if (currentStepIndex === 5) packetX = 90;
    else if (currentStepIndex === 6) packetX = 370;
    else if (currentStepIndex >= 7) packetX = 650;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isOptimizedPhase ? '#f0fdf4' : '#eff6ff'} stroke={isOptimizedPhase ? '#86efac' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isOptimizedPhase ? '#047857' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isOptimizedPhase
            ? 'OPTIMIZED RULEBASE: CONSOLIDATED CIDR BLOCKS & PRUNED REDUNDANCIES (FAST-PATH MATCH ✓)'
            : 'UNOPTIMIZED RULEBASE: 5 OVERLAPPING & REDUNDANT RULES WASTING INSPECTION CPU CYCLES'}
        </text>
      </g>

      {/* Baseline cable */}
      {showServer && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={70} label="CLIENT" ip="10.0.1.15" active />

      <FirewallGatewayNode
        cx={370}
        cy={70}
        label="FIREWALL ENGINE"
        sub={isOptimizedPhase ? 'Optimized Fast Path' : 'Unoptimized Slow Iteration'}
        active
        success={isDelivered}
      />

      {showServer && (
        <ServerNodeSVG cx={650} cy={70} label="SERVER" sub="203.0.113.50:443" active success={isDelivered} />
      )}

      {/* Motion Arrows */}
      {!isOptimizedPhase ? (
        currentStepIndex === 1 && (
          <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#2563eb" label="PACKET INGRESS" />
        )
      ) : (
        currentStepIndex >= 7 && (
          <BoldArrow x1={410} y1={70} x2={615} y2={70} color="#10b981" label="FAST FORWARDED ✓" />
        )
      )}

      {/* Packet Card */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={packetX}
          cy={28}
          title="HTTPS REQUEST"
          protocol="TCP"
          port="443"
          src="10.0.1.15"
          dst="203.0.113.50"
          status={isEvaluatingUnoptimized || isEvaluatingOptimized ? 'INSPECT' : isDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Optimization Comparison Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          FIREWALL RULE OPTIMIZATION & RULEBASE CONSOLIDATION
        </text>

        <g transform="translate(16, 36)">
          {/* Before: Unoptimized Table */}
          <rect x="0" y="0" width="325" height="100" rx="6" fill={!isOptimizedPhase ? '#eff6ff' : '#f8fafc'} stroke={!isOptimizedPhase ? '#93c5fd' : '#cbd5e1'} strokeWidth={!isOptimizedPhase ? 2 : 1} />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">BEFORE: 4 FRAGMENTED RULES (High Overhead)</text>
          
          <text x="12" y="32" fill="#0f172a" fontSize="7" fontFamily="monospace">Rule 1: ALLOW 10.0.1.0/25 ➔ Server:443</text>
          <text x="12" y="46" fill="#0f172a" fontSize="7" fontFamily="monospace">Rule 2: ALLOW 10.0.1.128/25 ➔ Server:443 [Overlaps R1]</text>
          <text x="12" y="60" fill="#991b1b" fontSize="7" fontFamily="monospace">Rule 3: ALLOW 10.0.1.15/32 ➔ Server:443 [Redundant Host]</text>
          <text x="12" y="74" fill="#64748b" fontSize="7" fontFamily="monospace">Rule 4: ALLOW 192.168.99.0/24 ➔ Server:80 [Unused Legacy]</text>
          <text x="12" y="90" fill="#ef4444" fontSize="7" fontWeight="bold">Evaluation Cost: 4 rule lookups per packet</text>

          {/* After: Consolidated Table */}
          <rect x="345" y="0" width="325" height="100" rx="6" fill={isOptimizedPhase ? '#f0fdf4' : '#f8fafc'} stroke={isOptimizedPhase ? '#86efac' : '#cbd5e1'} strokeWidth={isOptimizedPhase ? 2 : 1} />
          <text x="355" y="16" fill="#047857" fontSize="8.5" fontWeight="bold">AFTER: 1 CONSOLIDATED SUPERNET RULE (Streamlined)</text>

          <rect x="353" y="24" width="309" height="36" rx="4" fill={isOptimizedPhase ? '#dcfce7' : '#ffffff'} stroke="#86efac" />
          <text x="359" y="38" fill="#065f46" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            Rule 1: ALLOW 10.0.1.0/24 ➔ Server:443 [SUPERNET]
          </text>
          <text x="359" y="52" fill="#059669" fontSize="7">Aggregates R1 + R2 + R3 into a single /24 subnet match.</text>

          <text x="359" y="76" fill="#64748b" fontSize="7" fontFamily="monospace">Pruned: Removed unused Rule 4 (Zero hit count in 90 days)</text>
          <text x="359" y="90" fill="#059669" fontSize="7" fontWeight="bold">Evaluation Cost: 1 single lookup (Immediate Match ✓)</text>
        </g>

        <g transform="translate(16, 144)">
          <rect x="0" y="0" width="668" height="36" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            OPTIMIZATION STRATEGY: 1) Aggregate overlapping CIDR subnets, 2) Prune zero-hit rules, 3) Place highest-hit rules near top of ACL.
          </text>
        </g>
      </g>
    </svg>
  );
};
