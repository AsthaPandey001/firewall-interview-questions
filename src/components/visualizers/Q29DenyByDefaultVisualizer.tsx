import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q29DenyByDefaultVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Authorized Whitelisted Packet (Steps 0-7)
  // Step 1: Client appears
  // Step 2: Firewall appears with explicit Whitelist Rules (ALLOW HTTPS :443, ALLOW DNS :53)
  // Step 3: Server appears
  // Step 4: Rules loaded
  // Step 5: Client creates HTTPS packet (Port 443)
  // Step 6: Packet moves to firewall
  // Step 7: Rule 1 matches -> ALLOWED ✓
  // Step 8: Packet reaches Server (Delivered ✓) - STOP
  //
  // Scenario 2: Unauthorized Unmatched Packet (Steps 8-12)
  // Step 9: Client creates unauthorized SSH packet (Port 22)
  // Step 10: SSH packet moves to firewall
  // Step 11: Firewall checks rules: No rule matches
  // Step 12: DEFAULT IMPLICIT DENY POLICY ACTIVATES -> Action: DROP
  // Step 13: Packet stops at firewall (✕ BLOCKED AT FW). Server safe!

  const isUnauthorizedPhase = currentStepIndex >= 8;

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isAllowedDelivered = currentStepIndex === 7;
  const isDeniedDrop = currentStepIndex >= 11;

  let packetX = 90;
  if (!isUnauthorizedPhase) {
    if (currentStepIndex === 4) packetX = 90;
    else if (currentStepIndex === 5) packetX = 220;
    else if (currentStepIndex === 6) packetX = 370;
    else if (currentStepIndex >= 7) packetX = 650;
  } else {
    if (currentStepIndex === 8) packetX = 90;
    else if (currentStepIndex === 9) packetX = 220;
    else if (currentStepIndex >= 10) packetX = 370;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isUnauthorizedPhase ? '#fef2f2' : '#f0fdf4'} stroke={isUnauthorizedPhase ? '#fca5a5' : '#86efac'} />
        <text x="340" y="16" textAnchor="middle" fill={isUnauthorizedPhase ? '#991b1b' : '#047857'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isUnauthorizedPhase
            ? 'SCENARIO B: UNMATCHED PORT 22 (SSH) ➔ HITS DEFAULT IMPLICIT DENY POLICY ➔ DROPPED ✕'
            : 'SCENARIO A: EXPLICITLY WHITELISTED PORT 443 (HTTPS) ➔ MATCHES RULE #1 ➔ PERMITTED ✓'}
        </text>
      </g>

      {/* Baseline cable */}
      {showServer && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={70} label={isUnauthorizedPhase ? 'PROBE CLIENT' : 'AUTHORIZED CLIENT'} ip="10.0.1.25" active danger={isUnauthorizedPhase} />

      {showFw && (
        <FirewallGatewayNode cx={370} cy={70} label="FIREWALL" sub="Deny-by-Default Policy" active success={isAllowedDelivered} danger={isDeniedDrop} />
      )}

      {showServer && (
        <ServerNodeSVG cx={650} cy={70} label="SERVER" sub="203.0.113.50" active success={isAllowedDelivered} danger={isDeniedDrop} />
      )}

      {/* Motion Arrows */}
      {!isUnauthorizedPhase ? (
        <>
          {currentStepIndex === 5 && (
            <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#2563eb" label="HTTPS :443" />
          )}
          {currentStepIndex >= 7 && (
            <BoldArrow x1={410} y1={70} x2={615} y2={70} color="#10b981" label="WHITELISTED ✓" />
          )}
        </>
      ) : (
        <>
          {currentStepIndex === 9 && (
            <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#ef4444" label="SSH :22" />
          )}
          {isDeniedDrop && (
            <g transform="translate(370, 70)">
              <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <rect x="55" y="-12" width="105" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="107" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                DEFAULT DENY ✕
              </text>
            </g>
          )}
        </>
      )}

      {/* Packet Card */}
      {((!isUnauthorizedPhase && currentStepIndex >= 4) || (isUnauthorizedPhase && currentStepIndex >= 8)) && (
        <PacketCard
          cx={packetX}
          cy={28}
          title={isUnauthorizedPhase ? 'PORT 22 PROBE' : 'HTTPS REQUEST'}
          protocol="TCP"
          port={isUnauthorizedPhase ? '22' : '443'}
          src="10.0.1.25"
          dst="203.0.113.50"
          status={isDeniedDrop ? 'DENY' : isAllowedDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Whitelist & Default Deny Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DENY-BY-DEFAULT (ZERO TRUST) SECURITY MODEL
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="10" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">EXPLICIT WHITELIST RULES (Authorized Only):</text>
          
          <text x="12" y="34" fill="#065f46" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule 1: ALLOW TCP ANY ➔ Server:443 (HTTPS)</text>
          <text x="12" y="48" fill="#065f46" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule 2: ALLOW UDP ANY ➔ Server:53 (DNS)</text>
          <text x="12" y="66" fill="#64748b" fontSize="7">Principle: Only explicitly necessary business ports are opened.</text>
          <text x="12" y="80" fill="#64748b" fontSize="7">All other 65,533 ports remain completely closed.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text x="355" y="16" fill="#991b1b" fontSize="8.5" fontWeight="bold">DEFAULT IMPLICIT POLICY (Catch-All Drop):</text>

          <rect x="353" y="24" width="309" height="32" rx="4" fill="#fee2e2" stroke="#fca5a5" />
          <text x="359" y="38" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            DEFAULT: DENY IP ANY ANY (Implicit Drop)
          </text>
          <text x="359" y="50" fill="#dc2626" fontSize="7">Silently discards any traffic that failed earlier rules.</text>

          <text x="359" y="74" fill="#64748b" fontSize="7" fontFamily="monospace">Result: Port scans (21, 22, 23, 3389) are dropped instantly.</text>
          <text x="359" y="88" fill="#047857" fontSize="7" fontWeight="bold">Attack surface reduced by 99.9%.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SECURITY AXIOM: That which is not explicitly permitted is forbidden.
          </text>
          <text x="14" y="28" fill="#64748b" fontSize="7.5">
            Never use an Allow-by-Default model (Blacklisting); always implement Deny-by-Default (Whitelisting).
          </text>
        </g>
      </g>
    </svg>
  );
};
