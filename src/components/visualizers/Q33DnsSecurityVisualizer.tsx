import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q33DnsSecurityVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Client appears
  // Step 2: Recursive DNS Server appears
  // Step 3: Web Server (example.com) appears
  // Step 4: Client creates DNS Query: "A record for example.com?"
  // Step 5: Query moves: Client -> DNS Server (UDP :53)
  // Step 6: DNS Server resolves address (93.184.216.34)
  // Step 7: Response moves: DNS Server -> Client
  // Step 8: Client creates HTTPS packet to resolved IP
  // Step 9: Packet delivers to website (Delivered ✓)
  // Step 10: DNS Threat Scenario: Client queries malicious domain / C2 tunneling
  // Step 11: DNS Firewall / Threat Intelligence filter flags malicious query and blocks resolution!

  const showDns = currentStepIndex >= 1;
  const showWeb = currentStepIndex >= 2;

  const isDnsQuery = currentStepIndex === 3 || currentStepIndex === 4;
  const isDnsResponse = currentStepIndex === 5 || currentStepIndex === 6;
  const isWebTransit = currentStepIndex === 7 || currentStepIndex === 8;
  const isDnsThreatBlocked = currentStepIndex >= 10;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isDnsThreatBlocked ? '#fef2f2' : '#eff6ff'} stroke={isDnsThreatBlocked ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isDnsThreatBlocked ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isDnsThreatBlocked
            ? 'DNS SECURITY THREAT: MALICIOUS DOMAIN QUERY / DNS TUNNELING BLOCKED BY DNS FIREWALL ✕'
            : 'DNS RESOLUTION: DOMAIN (example.com) ➔ DNS QUERY :53 ➔ RESOLVED IP ➔ HTTPS SESSION ESTABLISHED ✓'}
        </text>
      </g>

      {/* Nodes: Client <-> DNS Server <-> Web Server */}
      <LaptopNode cx={80} cy={75} label="CLIENT" ip="192.168.1.10" active />

      {showDns && (
        <ServerNodeSVG cx={370} cy={75} label="RECURSIVE DNS" sub="8.8.8.8:53" active success={isDnsResponse} danger={isDnsThreatBlocked} />
      )}

      {showWeb && (
        <ServerNodeSVG cx={650} cy={75} label="WEBSITE (example.com)" sub="93.184.216.34:443" active success={isWebTransit} />
      )}

      {/* Arrows */}
      {isDnsQuery && (
        <BoldArrow x1={120} y1={75} x2={330} y2={75} color="#0284c7" label="QUERY: example.com" />
      )}
      {isDnsResponse && (
        <BoldArrow x1={330} y1={75} x2={120} y2={75} color="#10b981" reverse label="IP: 93.184.216.34" />
      )}
      {isWebTransit && (
        <BoldArrow x1={120} y1={75} x2={610} y2={75} color="#8b5cf6" label="HTTPS GET :443" />
      )}

      {isDnsThreatBlocked && (
        <g transform="translate(370, 75)">
          <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <rect x="55" y="-12" width="115" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="112" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
            DNS SINKHOLE ✕
          </text>
        </g>
      )}

      {/* Lower DNS Security Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DNS SECURITY THREATS & PROTECTIVE CONTROLS
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#fef2f2" stroke="#fca5a5" />
          <text x="10" y="16" fill="#991b1b" fontSize="8.5" fontWeight="bold">TOP DNS THREAT VECTORS:</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">1. DNS Tunneling: Exfiltrating confidential data encoded in DNS queries.</text>
          <text x="12" y="48" fill="#0f172a" fontSize="7.5">2. DNS Amplification DDoS: Using open resolvers to reflect 50x UDP traffic.</text>
          <text x="12" y="62" fill="#0f172a" fontSize="7.5">3. C2 Domain Generation Algorithms (DGA): Malware query floods.</text>
          <text x="12" y="78" fill="#dc2626" fontSize="7" fontWeight="bold">Risk: DNS bypasses basic firewall port filtering because port 53 is open.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">DNS SECURITY SOLUTIONS:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. DNS Sinkholing: Returns loopback IP (127.0.0.1) for malicious domains.</text>
          <text x="359" y="48" fill="#0f172a" fontSize="7.5">2. DNS-over-HTTPS (DoH) & DNS-over-TLS (DoT): Encrypts DNS queries.</text>
          <text x="359" y="62" fill="#0f172a" fontSize="7.5">3. DNSSEC: Cryptographically signs DNS records to prevent spoofing.</text>
          <text x="359" y="78" fill="#059669" fontSize="7.5" fontWeight="bold">4. Next-Gen DNS Firewalls (Cisco Umbrella / Cloudflare Gateway).</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: DNS is the phonebook of the Internet. Protecting DNS with DNSSEC and DNS Firewalls stops malware before IP connections initiate.
          </text>
        </g>
      </g>
    </svg>
  );
};
