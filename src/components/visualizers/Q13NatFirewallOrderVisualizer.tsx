import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q13NatFirewallOrderVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Outbound: Client (192.168.1.10) creates packet before translation
  // Step 1: Firewall ACL evaluates packet using ORIGINAL private IP
  // Step 2: Post-Routing NAT translates source IP to Public 203.0.113.10
  // Step 3: Outgoing packet leaves for Internet
  // Step 4: Inbound DNAT: Incoming packet from Internet hits NAT Pre-routing
  // Step 5: NAT translates Destination IP from Public to Private Internal Server IP
  // Step 6: Firewall evaluates Inbound ACL on the TRANSLATED private IP before delivery

  const isInbound = currentStepIndex >= 4;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Direction Badge */}
      <g transform="translate(40, 16)">
        <rect x="0" y="0" width="680" height="26" rx="13" fill={isInbound ? '#faf5ff' : '#eff6ff'} stroke={isInbound ? '#c084fc' : '#93c5fd'} />
        <text x="340" y="17" textAnchor="middle" fill={isInbound ? '#6b21a8' : '#1e40af'} fontSize="9.5" fontWeight="bold" fontFamily="monospace">
          {isInbound
            ? 'INBOUND FLOW: INGRESS → [1. PRE-ROUTING NAT (DEST REWRITE)] → [2. FIREWALL ACL CHECK] → INTERNAL SERVER'
            : 'OUTBOUND FLOW: CLIENT → [1. FIREWALL ACL CHECK (PRIVATE IP)] → [2. POST-ROUTING NAT (SRC REWRITE)] → INTERNET'}
        </text>
      </g>

      {/* Main Continuous Pipeline */}
      <g transform="translate(30, 52)">
        {/* Baseline Line */}
        <line x1="60" y1="70" x2="640" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />

        {/* Nodes in Pipeline: Client -> Firewall Security Gate -> NAT Engine -> Internet */}
        <LaptopNode cx={60} cy={70} label="CLIENT / HOST" ip={isInbound ? '192.168.1.100' : '192.168.1.10'} active />

        {/* Firewall Security Module */}
        <g transform="translate(250, 70)">
          <rect x="-40" y="-30" width="80" height="46" rx="6" fill="#0f172a" stroke="#2563eb" strokeWidth={2} />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">SECURITY ACL</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">POLICY GATE</text>
          <text x="0" y="26" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">FIREWALL</text>
          <text x="0" y="38" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#2563eb" fontFamily="monospace">Rule Evaluation</text>
        </g>

        {/* NAT Engine Module */}
        <g transform="translate(450, 70)">
          <rect x="-40" y="-30" width="80" height="46" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth={2} />
          <text x="0" y="-10" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold">NAT ENGINE</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">IP TRANSLATOR</text>
          <text x="0" y="26" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">NAT ROUTER</text>
          <text x="0" y="38" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#10b981" fontFamily="monospace">Pre/Post Routing</text>
        </g>

        <ServerNodeSVG cx={640} cy={70} label="INTERNET" sub="203.0.113.50" active />

        {/* Dynamic Bold Arrows depending on step (ONLY when currentStepIndex >= 1) */}
        {!isInbound ? (
          <>
            {currentStepIndex >= 1 && (
              <BoldArrow x1={95} y1={70} x2={205} y2={70} color="#2563eb" label="BEFORE NAT" />
            )}
            {currentStepIndex >= 2 && (
              <BoldArrow x1={295} y1={70} x2={405} y2={70} color="#2563eb" label="ALLOWED" />
            )}
            {currentStepIndex >= 3 && (
              <BoldArrow x1={495} y1={70} x2={605} y2={70} color="#10b981" label="AFTER NAT ✓" />
            )}
          </>
        ) : (
          <>
            <BoldArrow x1={605} y1={70} x2={495} y2={70} color="#8b5cf6" reverse label="INBOUND DNAT" />
            {currentStepIndex >= 5 && (
              <BoldArrow x1={405} y1={70} x2={295} y2={70} color="#10b981" reverse label="TRANSLATED IP" />
            )}
            {currentStepIndex >= 6 && (
              <BoldArrow x1={205} y1={70} x2={95} y2={70} color="#10b981" reverse label="ACL PERMITTED ✓" />
            )}
          </>
        )}
      </g>

      {/* Order of Operations Guide Table */}
      <g transform="translate(30, 185)">
        <rect x="0" y="0" width="700" height="140" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          NAT & FIREWALL PACKET FLOW ORDER OF OPERATIONS (CISCO ASA & PALO ALTO ARCHITECTURE)
        </text>

        <g transform="translate(16, 38)">
          <rect x="0" y="0" width="325" height="90" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="12" y="18" fill="#1e40af" fontSize="9" fontWeight="bold">OUTBOUND ORDER (INSIDE → OUTSIDE):</text>
          <text x="12" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">1. Ingress Interface & Routing Lookup</text>
          <text x="12" y="50" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">2. Firewall Security ACL Check (Evaluates Private IP)</text>
          <text x="12" y="64" fill="#0f172a" fontSize="8" fontFamily="monospace">3. Post-Routing Source NAT / PAT Translation</text>
          <text x="12" y="78" fill="#0f172a" fontSize="8" fontFamily="monospace">4. Egress to Outside WAN</text>

          <rect x="345" y="0" width="325" height="90" rx="6" fill="#faf5ff" stroke="#c084fc" />
          <text x="357" y="18" fill="#6b21a8" fontSize="9" fontWeight="bold">INBOUND DNAT ORDER (OUTSIDE → INSIDE):</text>
          <text x="357" y="36" fill="#0f172a" fontSize="8" fontFamily="monospace">1. Ingress Interface & Pre-Routing DNAT Engine</text>
          <text x="357" y="50" fill="#6b21a8" fontSize="8" fontWeight="bold" fontFamily="monospace">2. Destination IP rewritten to Private Server IP</text>
          <text x="357" y="64" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">3. Firewall ACL Check (Evaluates Translated Private IP!)</text>
          <text x="357" y="78" fill="#0f172a" fontSize="8" fontFamily="monospace">4. Egress to Internal Protected Server</text>
        </g>
      </g>
    </svg>
  );
};
