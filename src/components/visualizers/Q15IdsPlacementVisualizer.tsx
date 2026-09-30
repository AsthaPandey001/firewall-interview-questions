import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, RouterNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q15IdsPlacementVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Complete Network Topology: Internet -> Edge Router -> Perimeter Firewall -> Inline IPS / Sensor -> Core Switch -> Server
  // Step 1: Normal traffic flows smoothly through entire path
  // Step 2: Suspicious traffic introduced from Internet
  // Step 3: Traffic reaches IPS sensor behind firewall
  // Step 4: Signature & Behavior engine inspects payload
  // Step 5: IPS blocks suspicious traffic at sensor; Server stays protected!
  // Step 6: Placement Strategy Summary

  const isSuspicious = currentStepIndex >= 2;
  const isBlocked = currentStepIndex >= 5;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="60" y1="75" x2="680" y2="75" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />

      {/* 5-Stage Network Nodes: Internet -> Router -> Firewall -> IPS Sensor -> Server */}
      <LaptopNode cx={60} cy={75} label={isSuspicious ? 'ATTACKER' : 'INTERNET'} ip={isSuspicious ? '198.51.100.99' : 'WAN'} active danger={isSuspicious} />
      
      <RouterNodeSVG cx={200} cy={75} label="EDGE ROUTER" sub="BGP / NAT" active />

      <FirewallGatewayNode cx={340} cy={75} label="PERIMETER FW" sub="L3/L4 State" active />

      {/* IPS Sensor Node */}
      <g transform="translate(490, 75)">
        <rect x="-35" y="-30" width="70" height="42" rx="6" fill="#0f172a" stroke={isBlocked ? '#ef4444' : '#10b981'} strokeWidth={2.5} />
        <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">INLINE IPS</text>
        <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">DPI SENSOR</text>
        <text x="0" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">IPS SENSOR</text>
        <text x="0" y="36" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#10b981" fontFamily="monospace">Behind Firewall</text>
      </g>

      <ServerNodeSVG cx={660} cy={75} label="INTERNAL SERVER" sub="10.0.3.50:443" active success={!isBlocked} />

      {/* Dynamic Traffic Flow Arrows (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <>
          <BoldArrow x1={95} y1={75} x2={165} y2={75} color={isSuspicious ? '#ef4444' : '#2563eb'} />
          <BoldArrow x1={235} y1={75} x2={305} y2={75} color={isSuspicious ? '#ef4444' : '#2563eb'} />
          <BoldArrow x1={375} y1={75} x2={450} y2={75} color={isSuspicious ? '#ef4444' : '#2563eb'} />

          {!isBlocked ? (
            <BoldArrow x1={530} y1={75} x2={625} y2={75} color="#10b981" label="CLEAN TRAFFIC" />
          ) : (
            <g transform="translate(525, 75)">
              <line x1="15" y1="-25" x2="15" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <rect x="25" y="-12" width="85" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="67" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                BLOCKED ✕
              </text>
            </g>
          )}
        </>
      )}

      {/* Lower Inspection Breakdown & Placement Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          SENSOR PLACEMENT ARCHITECTURE & INSPECTION WORKFLOW
        </text>

        {/* 4 Architectural Placement Locations */}
        <g transform="translate(16, 36)">
          {[
            { zone: '1. Behind Firewall (Best Practice)', role: 'Inspects clean, filtered traffic only; reduces sensor CPU load.', badge: 'Recommended', color: '#10b981' },
            { zone: '2. Outside Perimeter Firewall', role: 'Catches raw attack volume before firewall, but overwhelmed by noise.', badge: 'Noisy', color: '#f59e0b' },
            { zone: '3. Inside DMZ Subnet', role: 'Protects public web & mail servers against zero-day exploit payloads.', badge: 'Critical DMZ', color: '#3b82f6' },
            { zone: '4. Core Internal Switch (SPAN)', role: 'Monitors lateral movement, malware spread, and insider threats.', badge: 'Internal Tap', color: '#8b5cf6' },
          ].map((item, i) => (
            <g key={item.zone} transform={`translate(${i % 2 === 0 ? 0 : 340}, ${Math.floor(i / 2) * 44})`}>
              <rect x="0" y="0" width="328" height="38" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="10" y="15" fill="#0f172a" fontSize="8" fontWeight="bold">{item.zone}</text>
              <text x="10" y="28" fill="#64748b" fontSize="7" fontFamily="monospace">{item.role}</text>
              <g transform="translate(250, 6)">
                <rect x="0" y="0" width="70" height="14" rx="7" fill={item.color} />
                <text x="35" y="10" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">{item.badge}</text>
              </g>
            </g>
          ))}
        </g>

        {/* Workflow Formula Strip */}
        <g transform="translate(16, 132)">
          <rect x="0" y="0" width="668" height="48" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="12" y="18" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            INSPECTION PIPELINE: PACKET → SIGNATURE SCAN / ANOMALY ENGINE → THREAT IDENTIFIED → ACTION (IDS: ALERT | IPS: BLOCK)
          </text>
          <text x="12" y="34" fill="#64748b" fontSize="7.5">
            Placing IPS directly behind the firewall ensures the firewall drops raw volumetric floods first, allowing IPS CPU to focus on deep Layer 7 payloads.
          </text>
        </g>
      </g>
    </svg>
  );
};
