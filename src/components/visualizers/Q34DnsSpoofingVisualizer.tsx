import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q34DnsSpoofingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // SCENARIO 1: DNS CACHE POISONING ATTACK (Steps 0-8)
  // Step 0: Client appears (10.0.1.50)
  // Step 1: Recursive DNS Resolver appears
  // Step 2: Legitimate Server appears (bank.com -> 198.51.100.50)
  // Step 3: Cables drawn
  // Step 4: Client sends DNS Query for bank.com
  // Step 5: Attacker races forged DNS response with guessed TXID (bank.com = 203.0.113.99 Phishing IP)
  // Step 6: Resolver cache POISONED with forged mapping (bank.com -> 203.0.113.99)
  // Step 7: Spoofed answer delivered to Client
  // Step 8: Client connects to Attacker Phishing Server (COMPROMISED ✕) - STOP
  //
  // SCENARIO 2: DNSSEC CRYPTOGRAPHIC VALIDATION (Steps 9-16)
  // Step 9: DNSSEC enabled on DNS Resolver & Domain
  // Step 10: Client resends DNS query for bank.com
  // Step 11: Attacker injects forged response again
  // Step 12: Resolver validates cryptographic RRSIG signature against Root Trust Anchor
  // Step 13: Forged reply lacks valid cryptographic signature -> REJECTED ✕
  // Step 14: Authentic DNSSEC-validated record (198.51.100.50) accepted
  // Step 15: Validated response delivered to Client
  // Step 16: Client securely connects to legitimate banking portal ✓

  const isDnssecPhase = currentStepIndex >= 9;

  const showResolver = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isPoisonedPhase1 = currentStepIndex >= 6 && currentStepIndex <= 8;
  const isDnssecSuccess = currentStepIndex >= 14;

  let packetX = 80;
  if (!isDnssecPhase) {
    if (currentStepIndex === 4) packetX = 80;
    else if (currentStepIndex === 5) packetX = 230;
    else if (currentStepIndex >= 6 && currentStepIndex <= 7) packetX = 370;
    else if (currentStepIndex >= 8) packetX = 660;
  } else {
    if (currentStepIndex === 10) packetX = 80;
    else if (currentStepIndex >= 11 && currentStepIndex <= 13) packetX = 370;
    else if (currentStepIndex >= 14 && currentStepIndex <= 15) packetX = 230;
    else if (currentStepIndex >= 16) packetX = 660;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrows */}
      {!isDnssecPhase && currentStepIndex === 5 && (
        <BoldArrow x1={325} y1={120} x2={370} y2={95} color="#ef4444" label="FORGED DNS REPLY (GUESSED TXID) →" />
      )}
      {!isDnssecPhase && currentStepIndex === 7 && (
        <BoldArrow x1={325} y1={75} x2={115} y2={75} color="#ef4444" label="← SPOOFED IP TO CLIENT" />
      )}
      {!isDnssecPhase && currentStepIndex === 8 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#ef4444" label="TO PHISHING SERVER →" />
      )}

      {isDnssecPhase && currentStepIndex === 15 && (
        <BoldArrow x1={325} y1={75} x2={115} y2={75} color="#10b981" label="← VALIDATED DNSSEC ANSWER" />
      )}
      {isDnssecPhase && currentStepIndex === 16 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#10b981" label="TO LEGITIMATE BANK →" />
      )}

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label="CLIENT"
        ip="10.0.1.50"
        active={!isDnssecPhase ? currentStepIndex <= 5 || currentStepIndex === 8 : currentStepIndex <= 10 || isDnssecSuccess}
      />

      {/* DNS Resolver */}
      {showResolver && (
        <g>
          <rect x="330" y="55" width="80" height="40" rx="6" fill="#0f172a" stroke={isPoisonedPhase1 ? '#ef4444' : isDnssecPhase ? '#22c55e' : '#06b6d4'} strokeWidth="2" />
          <text x="370" y="74" textAnchor="middle" fill={isPoisonedPhase1 ? '#fca5a5' : '#67e8f9'} fontSize="8" fontWeight="bold" fontFamily="monospace">
            DNS RESOLVER
          </text>
          <text x="370" y="86" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
            {isPoisonedPhase1 ? 'CACHE POISONED' : isDnssecPhase ? 'DNSSEC VALIDATING' : 'Recursive Cache'}
          </text>
        </g>
      )}

      {/* Server Node */}
      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label={isPoisonedPhase1 ? 'PHISHING PORTAL' : 'LEGITIMATE BANK'}
          sub={isPoisonedPhase1 ? '203.0.113.99 (Attacker)' : '198.51.100.50 (Official)'}
          active={currentStepIndex === 8 || currentStepIndex >= 16}
          success={isDnssecSuccess}
          statusText={
            isPoisonedPhase1
              ? 'TRICKED ✕'
              : isDnssecSuccess
              ? 'AUTHENTIC ✓'
              : 'bank.com'
          }
        />
      )}

      {/* Packet Card */}
      {((!isDnssecPhase && currentStepIndex >= 4) || (isDnssecPhase && currentStepIndex >= 10)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              !isDnssecPhase
                ? isPoisonedPhase1
                  ? 'POISONED'
                  : 'DNS QUERY'
                : isDnssecSuccess
                ? 'DNSSEC OK ✓'
                : 'DNSSEC QUERY'
            }
            protocol="DNS"
            port="53"
            src={!isDnssecPhase && isPoisonedPhase1 ? 'Attacker (Forged)' : '10.0.1.50'}
            dst={
              !isDnssecPhase
                ? isPoisonedPhase1
                  ? 'bank.com = 203.0.113.99'
                  : 'bank.com'
                : 'bank.com (RRSIG)'
            }
            status={!isDnssecPhase && isPoisonedPhase1 ? 'DENY' : isDnssecSuccess ? 'ALLOW' : 'INSPECT'}
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isDnssecPhase
            ? 'MITIGATION: DNSSEC CRYPTOGRAPHIC RRSIG SIGNATURE VALIDATION'
            : 'DNS CACHE POISONING ATTACK (KAMINSKY FORGED TXID RACE CONDITION)'}
        </text>

        {!isDnssecPhase ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#fef2f2" stroke="#f87171" />
            <text x="12" y="18" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              POISONED DNS RESOLVER CACHE (bank.com → 203.0.113.99):
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Attacker floods resolver with thousands of forged responses guessing the 16-bit Transaction ID (TXID).
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. Forged reply arrives before authoritative server; resolver stores attacker's phishing IP in cache.
            </text>
            <text x="14" y="74" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">
              3. RESULT: Client browser queries bank.com and is silently redirected to attacker phishing site ✕.
            </text>
            <text x="14" y="98" fill="#991b1b" fontSize="7.5" fontWeight="bold">
              Standard DNS has zero authentication; resolvers accept any matching TXID blindly.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f0fdf4" stroke="#86efac" />
            <text x="12" y="18" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              HOW DNSSEC PREVENTS CACHE POISONING:
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Authoritative zone signs resource records using asymmetric cryptographic private keys (RRSIG).
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. Resolver validates digital signature using public keys chained to Root DNS Zone Key Signing Key (KSK).
            </text>
            <text x="14" y="74" fill="#15803d" fontSize="8" fontWeight="bold" fontFamily="monospace">
              3. ACTION: Forged unsigned response is INSTANTLY DISCARDED. Only verified IP (198.51.100.50) is served ✓.
            </text>
            <text x="14" y="98" fill="#15803d" fontSize="7.5" fontWeight="bold">
              DNSSEC guarantees data integrity and origin authenticity across the global Internet.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
