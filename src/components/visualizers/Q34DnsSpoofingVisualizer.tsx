import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q34DnsSpoofingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Client appears
  // Step 2: DNS Resolver appears
  // Step 3: Legitimate Bank Server appears (bank.com -> 104.22.15.1)
  // Step 4: Client sends DNS query for "bank.com"
  // Step 5: Malicious Attacker appears and races ahead of authoritative server
  // Step 6: Attacker injects forged DNS response with fake IP (6.6.6.6 - Phishing Site)
  // Step 7: DNS Cache poisoned with fake IP!
  // Step 8: Client sends HTTPS request & credentials to Fake Phishing Server (Compromised!)
  // Step 9: Side-by-side comparison: Legitimate Resolution vs Spoofed Cache Manipulation
  // Step 10: Mitigation Demonstration: DNSSEC digital signatures reject forged responses

  const showResolver = currentStepIndex >= 1;
  const showBank = currentStepIndex >= 2;
  const showAttacker = currentStepIndex >= 4;

  const isDnsQuery = currentStepIndex === 3;
  const isSpoofing = currentStepIndex === 5 || currentStepIndex === 6;
  const isPhishingVictim = currentStepIndex === 7;
  const isDnssecMitigated = currentStepIndex >= 9;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isDnssecMitigated ? '#f0fdf4' : '#fef2f2'} stroke={isDnssecMitigated ? '#86efac' : '#fca5a5'} />
        <text x="340" y="16" textAnchor="middle" fill={isDnssecMitigated ? '#047857' : '#991b1b'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isDnssecMitigated
            ? 'DNSSEC DEFENSE: CRYPTOGRAPHIC RRSIG SIGNATURE VALIDATION REJECTS FORGED DNS RESPONSES ✓'
            : 'DNS CACHE POISONING: ATTACKER INJECTS FAKE IP (6.6.6.6) ➔ USER DIVERTED TO PHISHING BANK SITE ✕'}
        </text>
      </g>

      {/* Nodes */}
      <LaptopNode cx={80} cy={75} label="CLIENT BROWSER" ip="192.168.1.10" active />

      {showResolver && (
        <ServerNodeSVG cx={370} cy={75} label="DNS RESOLVER" sub="Cache Poison Target" active danger={isSpoofing} success={isDnssecMitigated} />
      )}

      {showBank && (
        <ServerNodeSVG cx={650} cy={75} label="LEGITIMATE BANK" sub="104.22.15.1" active success={!isPhishingVictim} />
      )}

      {showAttacker && (
        <g transform="translate(370, 0)">
          <LaptopNode cx={0} cy={0} label="DNS SPOOFER" ip="6.6.6.6" active danger={!isDnssecMitigated} />
        </g>
      )}

      {/* Arrows */}
      {isDnsQuery && (
        <BoldArrow x1={120} y1={75} x2={330} y2={75} color="#0284c7" label="QUERY: bank.com" />
      )}
      {isSpoofing && (
        <BoldArrow x1={370} y1={25} x2={370} y2={50} color="#ef4444" label="FORGED IP: 6.6.6.6" />
      )}
      {isPhishingVictim && (
        <BoldArrow x1={120} y1={75} x2={370} y2={25} color="#ef4444" label="LOGIN SENT TO FAKE BANK ✕" />
      )}

      {isDnssecMitigated && (
        <g transform="translate(370, 75)">
          <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth={2} />
          <text x="0" y="4" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ✓ DNSSEC SIGNATURE VALID
          </text>
        </g>
      )}

      {/* Lower DNSSEC Comparison Box */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DNS CACHE POISONING ANATOMY & DNSSEC VALIDATION MECHANISM
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text x="10" y="16" fill="#991b1b" fontSize="8.5" fontWeight="bold">HOW DNS CACHE POISONING WORKS (Kaminsky Attack):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">1. Attacker floods resolver with guesses of 16-bit Transaction ID.</text>
          <text x="12" y="48" fill="#0f172a" fontSize="7.5">2. Forged reply arrives before the real authoritative server responds.</text>
          <text x="12" y="62" fill="#0f172a" fontSize="7.5">3. Resolver stores fake record (TTL: 86400s) and serves it to all users.</text>
          <text x="12" y="80" fill="#dc2626" fontSize="7" fontWeight="bold">Result: Massive stealth credential theft without browser SSL warnings.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">HOW DNSSEC PREVENTS SPOOFING:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. Cryptographic Signatures (RRSIG): Zone signed with private key.</text>
          <text x="359" y="48" fill="#0f172a" fontSize="7.5">2. Chain of Trust (DS records): Validated up to Root DNS Zone (.).</text>
          <text x="359" y="62" fill="#0f172a" fontSize="7.5">3. If forged response lacks valid cryptographic signature, resolver drops it.</text>
          <text x="359" y="80" fill="#059669" fontSize="7.5" fontWeight="bold">4. Source port randomization + 0x20 encoding as secondary defenses.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: DNS Spoofing redirects legitimate users to fake IP addresses. DNSSEC provides cryptographic proof of origin and data integrity.
          </text>
        </g>
      </g>
    </svg>
  );
};
