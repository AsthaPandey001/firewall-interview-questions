import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q27RuleShadowingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // PHASE 1: SHADOWED MISORDERED ACL (Steps 0-14)
  // Step 0: Client appears (10.0.0.25)
  // Step 1: Firewall appears with Misordered ACL
  // Step 2: Server appears (10.0.5.50:443)
  // Step 3: Cables drawn
  // Step 4: Packet created (10.0.0.25 -> 10.0.5.50:443)
  // Step 5: Packet moves: CLIENT -> FIREWALL
  // Step 6: Firewall receives packet; Rule Table appears
  // Step 7: Rule 1 evaluated (DENY ANY -> SERVER :443)
  // Step 8: Source check: 10.0.0.25 matches ANY ✓
  // Step 9: Destination check: 10.0.5.50 matches Server ✓
  // Step 10: Port check: :443 matches :443 ✓
  // Step 11: RULE 1 FIRST MATCH CONFIRMED (DENY)
  // Step 12: Action: DENY executed
  // Step 13: Packet physically stops at Firewall (BLOCKED ✕)
  // Step 14: Rule 2 highlighted as SHADOWED / UNREACHED (0 Hits) - STOP
  //
  // PHASE 2: REORDERED CORRECT ACL (Steps 15-20)
  // Step 15: Admin reorders ACL: Specific ALLOW moved to Line 1
  // Step 16: Retransmitted packet created at Client
  // Step 17: Packet moves: CLIENT -> FIREWALL
  // Step 18: Reordered Rule 1 matches specific subnet (ALLOW 10.0.0.0/24) ✓
  // Step 19: Packet moves: FIREWALL -> SERVER
  // Step 20: Server receives packet (ACCEPTED ✓) + Specific-First Rule Summary

  const isReorderedPhase = currentStepIndex >= 15;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isBlockedPhase1 = currentStepIndex >= 12 && currentStepIndex <= 14;
  const isDeliveredPhase2 = currentStepIndex >= 20;

  let packetX = 80;
  if (!isReorderedPhase) {
    if (currentStepIndex <= 4) packetX = 80;
    else if (currentStepIndex === 5) packetX = 230;
    else if (currentStepIndex >= 6) packetX = 370;
  } else {
    if (currentStepIndex === 16) packetX = 80;
    else if (currentStepIndex === 17) packetX = 230;
    else if (currentStepIndex === 18) packetX = 370;
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
      {!isReorderedPhase && currentStepIndex === 5 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#ef4444" label="ATTEMPTING HTTPS →" />
      )}
      {isReorderedPhase && currentStepIndex === 17 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#2563eb" label="RETRYING HTTPS →" />
      )}
      {isReorderedPhase && currentStepIndex === 19 && (
        <BoldArrow x1={415} y1={75} x2={615} y2={75} color="#10b981" label="PERMITTED TO SERVER →" />
      )}

      {/* Device Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT"
        ip="10.0.0.25"
        active={!isReorderedPhase ? currentStepIndex <= 5 : currentStepIndex <= 17 || isDeliveredPhase2}
        statusText={isDeliveredPhase2 ? 'CONNECTED ✓' : undefined}
      />

      {showFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="FIREWALL"
          sub={isReorderedPhase ? 'Reordered ACL' : 'Misordered ACL'}
          active={
            (!isReorderedPhase && currentStepIndex >= 6 && currentStepIndex <= 13) ||
            (isReorderedPhase && currentStepIndex >= 18 && currentStepIndex <= 19)
          }
          success={isDeliveredPhase2}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="SERVER"
          sub="10.0.5.50:443"
          active={isDeliveredPhase2}
          success={isDeliveredPhase2}
          statusText={isDeliveredPhase2 ? 'ACCEPTED ✓' : 'STANDBY'}
        />
      )}

      {/* Moving Packet Card */}
      {((!isReorderedPhase && currentStepIndex >= 4) || (isReorderedPhase && currentStepIndex >= 16)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={isBlockedPhase1 ? 'BLOCKED ✕' : isDeliveredPhase2 ? 'PERMITTED' : 'HTTPS SYN'}
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="10.0.5.50"
            status={isBlockedPhase1 ? 'DENY' : isDeliveredPhase2 ? 'ALLOW' : 'NORMAL'}
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Sequential Evaluation Table */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isReorderedPhase
            ? 'CORRECTED SPECIFIC-FIRST ACL (SPECIFIC ALLOW BEFORE BROAD DENY)'
            : 'FIREWALL RULE SHADOWING DEFECT (BROAD DENY PLACED ABOVE SPECIFIC ALLOW)'}
        </text>

        {!isReorderedPhase ? (
          /* Misordered Shadowed View */
          <g transform="translate(16, 36)" className="animate-pop-in">
            {/* Rule 1: Broad DENY */}
            <g transform="translate(0, 0)">
              <rect
                x="0"
                y="0"
                width="668"
                height="38"
                rx="4"
                fill={currentStepIndex >= 11 ? '#fee2e2' : '#eff6ff'}
                stroke={currentStepIndex >= 11 ? '#ef4444' : '#3b82f6'}
                strokeWidth={1.5}
              />
              <text x="10" y="16" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Rule 1 (BROAD): DENY SRC=ANY DST=10.0.5.50:443 PROTO=TCP {currentStepIndex >= 11 && '→ FIRST MATCH: DENY ✕'}
              </text>
              <text x="10" y="30" fill="#64748b" fontSize="7" fontFamily="monospace">
                Checks: Src (10.0.0.25 matches ANY ✓) | Dst (10.0.5.50 ✓) | Port (:443 ✓) → Evaluation STOPS immediately!
              </text>
            </g>

            {/* Rule 2: Specific ALLOW (Shadowed) */}
            <g transform="translate(0, 46)">
              <rect
                x="0"
                y="0"
                width="668"
                height="38"
                rx="4"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                opacity={0.6}
              />
              <text x="10" y="16" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Rule 2 (SPECIFIC): ALLOW SRC=10.0.0.0/24 DST=10.0.5.50:443 PROTO=TCP
              </text>
              <text x="10" y="30" fill="#dc2626" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                STATUS: SHADOWED / UNREACHABLE (0 Hit Count). Rule 1 matches all traffic first.
              </text>
            </g>

            {/* Explanation Note */}
            <g transform="translate(0, 92)">
              <rect x="0" y="0" width="668" height="38" rx="4" fill="#fef2f2" stroke="#f87171" />
              <text x="12" y="16" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                TOP-TO-BOTTOM FIRST MATCH RULE: Firewalls NEVER choose the "most specific rule" automatically.
              </text>
              <text x="12" y="28" fill="#0f172a" fontSize="7">
                Because Rule 1 matched first, evaluation terminated. Rule 2 was completely bypassed.
              </text>
            </g>
          </g>
        ) : (
          /* Reordered Correct View */
          <g transform="translate(16, 36)" className="animate-pop-in">
            {/* Rule 1: Specific ALLOW */}
            <g transform="translate(0, 0)">
              <rect
                x="0"
                y="0"
                width="668"
                height="38"
                rx="4"
                fill={currentStepIndex >= 18 ? '#dcfce7' : '#eff6ff'}
                stroke={currentStepIndex >= 18 ? '#16a34a' : '#3b82f6'}
                strokeWidth={1.5}
              />
              <text x="10" y="16" fill="#15803d" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Rule 1 (SPECIFIC FIRST): ALLOW SRC=10.0.0.0/24 DST=10.0.5.50:443 PROTO=TCP {currentStepIndex >= 18 && '→ MATCH: ALLOW ✓'}
              </text>
              <text x="10" y="30" fill="#0f172a" fontSize="7" fontFamily="monospace">
                Specific subnet matches authorized corporate clients; session state established.
              </text>
            </g>

            {/* Rule 2: Broad Catch-all DENY */}
            <g transform="translate(0, 46)">
              <rect x="0" y="0" width="668" height="38" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
              <text x="10" y="16" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                Rule 2 (BROAD CATCH-ALL): DENY SRC=ANY DST=10.0.5.50:443 PROTO=TCP
              </text>
              <text x="10" y="30" fill="#64748b" fontSize="7" fontFamily="monospace">
                Blocks all other unapproved source subnets safely.
              </text>
            </g>

            {/* Fix Takeaway */}
            <g transform="translate(0, 92)">
              <rect x="0" y="0" width="668" height="38" rx="4" fill="#f0fdf4" stroke="#86efac" />
              <text x="12" y="16" fill="#15803d" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                GOLDEN RULE OF ACL ORDERING: Always place SPECIFIC host & subnet rules ABOVE broad wildcard rules.
              </text>
              <text x="12" y="28" fill="#0f172a" fontSize="7">
                Correct rule ordering eliminates shadowing defects and guarantees intended access.
              </text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};
