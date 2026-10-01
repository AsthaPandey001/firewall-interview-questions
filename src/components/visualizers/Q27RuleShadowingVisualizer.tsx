import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q27RuleShadowingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: SHADOWED ORDER (Steps 0-7)
  // Step 1: Client appears (10.0.0.25)
  // Step 2: Firewall appears with Misconfigured Rulebase (Rule 1: DENY ANY -> :443, Rule 2: ALLOW 10.0.0.0/24 -> :443)
  // Step 3: Server appears
  // Step 4: Packet moves toward firewall
  // Step 5: Rule 1 matches first (DENY ANY)
  // Step 6: Verdict: DENIED ✕
  // Step 7: Packet stops at firewall. Rule 2 is highlighted as SHADOWED!
  //
  // Scenario 2: CORRECTED ORDER (Steps 8-12)
  // Step 8: Reorder Rulebase (Rule 1: Specific ALLOW, Rule 2: General DENY)
  // Step 9: Client sends same packet (10.0.0.25:443)
  // Step 10: Packet moves to firewall
  // Step 11: Corrected Rule 1 matches: ALLOWED ✓
  // Step 12: Packet delivers to Server (Delivered ✓)

  const isCorrectedPhase = currentStepIndex >= 7;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isShadowedDrop = currentStepIndex >= 5 && currentStepIndex <= 6;
  const isCorrectedAllowed = currentStepIndex >= 10;
  const isDelivered = currentStepIndex >= 11;

  let packetX = 90;
  if (!isCorrectedPhase) {
    if (currentStepIndex === 3) packetX = 220;
    else if (currentStepIndex >= 4) packetX = 370;
  } else {
    if (currentStepIndex === 8) packetX = 90;
    else if (currentStepIndex === 9) packetX = 220;
    else if (currentStepIndex === 10) packetX = 370;
    else if (currentStepIndex >= 11) packetX = 650;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isCorrectedPhase ? '#f0fdf4' : '#fef2f2'} stroke={isCorrectedPhase ? '#86efac' : '#fca5a5'} />
        <text x="340" y="16" textAnchor="middle" fill={isCorrectedPhase ? '#047857' : '#991b1b'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isCorrectedPhase
            ? 'CORRECTED ORDER: SPECIFIC ALLOW RULE #1 PLACED ABOVE GENERAL DENY RULE #2 (SHADOWING RESOLVED ✓)'
            : 'SHADOWED FLAW: BROAD DENY RULE #1 PREVENTS SPECIFIC ALLOW RULE #2 FROM EVER BEING REACHED!'}
        </text>
      </g>

      {/* Baseline cable */}
      {showServer && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={70} label="CLIENT" ip="10.0.0.25" active />

      {showFw && (
        <FirewallGatewayNode cx={370} cy={70} label="FIREWALL" sub={isCorrectedPhase ? 'Correct Rule Order' : 'Shadowed Rule Order'} active success={isCorrectedAllowed} danger={isShadowedDrop} />
      )}

      {showServer && (
        <ServerNodeSVG cx={650} cy={70} label="SERVER" sub="10.0.0.50:443" active success={isDelivered} />
      )}

      {/* Motion Arrows */}
      {!isCorrectedPhase ? (
        <>
          {currentStepIndex === 3 && (
            <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#2563eb" label="HTTPS :443" />
          )}
          {isShadowedDrop && (
            <g transform="translate(370, 70)">
              <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <rect x="55" y="-12" width="90" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="100" y="4" textAnchor="middle" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                SHADOWED ✕
              </text>
            </g>
          )}
        </>
      ) : (
        <>
          {currentStepIndex === 9 && (
            <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#2563eb" label="RETEST :443" />
          )}
          {currentStepIndex >= 11 && (
            <BoldArrow x1={410} y1={70} x2={615} y2={70} color="#10b981" label="ALLOWED TO SERVER ✓" />
          )}
        </>
      )}

      {/* Packet Card */}
      {currentStepIndex >= 3 && (
        <PacketCard
          cx={packetX}
          cy={28}
          title="TCP SYN"
          protocol="TCP"
          port="443"
          src="10.0.0.25"
          dst="10.0.0.50"
          status={isShadowedDrop ? 'DENY' : isCorrectedAllowed ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Rule Order Comparison Table */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          RULE SHADOWING MECHANISM & RESOLUTION TABLE
        </text>

        {/* 2 Rulebase Configurations */}
        <g transform="translate(16, 36)">
          {/* Flawed Shadowed Table */}
          <rect x="0" y="0" width="325" height="98" rx="6" fill={!isCorrectedPhase ? '#fef2f2' : '#f8fafc'} stroke={!isCorrectedPhase ? '#fca5a5' : '#cbd5e1'} strokeWidth={!isCorrectedPhase ? 2 : 1} />
          <text x="10" y="16" fill="#991b1b" fontSize="8.5" fontWeight="bold">FLAWED ORDER (RULE #2 IS SHADOWED):</text>
          
          <rect x="8" y="24" width="309" height="28" rx="4" fill={!isCorrectedPhase ? '#fee2e2' : '#ffffff'} stroke="#fca5a5" />
          <text x="14" y="38" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule 1: DENY ANY ➔ Server:443</text>
          <text x="14" y="48" fill="#dc2626" fontSize="7">Catches 10.0.0.25 and drops immediately!</text>

          <rect x="8" y="56" width="309" height="32" rx="4" fill={!isCorrectedPhase ? '#f1f5f9' : '#ffffff'} stroke="#cbd5e1" strokeDasharray="3 2" />
          <text x="14" y="70" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule 2: ALLOW 10.0.0.0/24 ➔ Server:443 [SHADOWED]</text>
          <text x="14" y="82" fill="#ef4444" fontSize="6.5" fontWeight="bold">⚠ DEAD CODE: NEVER REACHED</text>

          {/* Corrected Order Table */}
          <rect x="345" y="0" width="325" height="98" rx="6" fill={isCorrectedPhase ? '#f0fdf4' : '#f8fafc'} stroke={isCorrectedPhase ? '#86efac' : '#cbd5e1'} strokeWidth={isCorrectedPhase ? 2 : 1} />
          <text x="355" y="16" fill="#047857" fontSize="8.5" fontWeight="bold">CORRECTED ORDER (SPECIFIC FIRST):</text>

          <rect x="353" y="24" width="309" height="28" rx="4" fill={isCorrectedPhase ? '#dcfce7' : '#ffffff'} stroke="#86efac" />
          <text x="359" y="38" fill="#065f46" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule 1: ALLOW 10.0.0.0/24 ➔ Server:443 [MATCHED ✓]</text>
          <text x="359" y="48" fill="#059669" fontSize="7">Specific authorized subnet permitted first.</text>

          <rect x="353" y="56" width="309" height="32" rx="4" fill={isCorrectedPhase ? '#f8fafc' : '#ffffff'} stroke="#cbd5e1" />
          <text x="359" y="70" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule 2: DENY ANY ➔ Server:443</text>
          <text x="359" y="82" fill="#64748b" fontSize="6.5">Catches all remaining unauthorized traffic.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            GOLDEN RULE OF FIREWALL ACLs: ALWAYS PLACE SPECIFIC RULES ABOVE BROAD / GENERAL RULES.
          </text>
          <text x="14" y="28" fill="#64748b" fontSize="7.5">
            Because firewalls stop evaluating rules upon the FIRST match, broad deny rules placed higher up render all subsequent overlapping permit rules useless.
          </text>
        </g>
      </g>
    </svg>
  );
};
