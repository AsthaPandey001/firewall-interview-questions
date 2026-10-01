import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q33DnsSecurityVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // SCENARIO 1: LEGITIMATE DNS RESOLUTION & HTTPS FLOW (Steps 0-11)
  // Step 0: Client appears (10.0.1.50)
  // Step 1: Corporate DNS Resolver appears (10.0.0.1:53)
  // Step 2: Target Web Server appears (198.51.100.25:443)
  // Step 3: Cables drawn
  // Step 4: Client creates DNS Query: "What is IP for example.com?" (UDP 53)
  // Step 5: Query moves: CLIENT -> DNS RESOLVER
  // Step 6: DNS Resolver resolves domain recursively and prepares A-record answer
  // Step 7: Response moves: DNS RESOLVER -> CLIENT (example.com = 198.51.100.25)
  // Step 8: Client receives IP address 198.51.100.25
  // Step 9: Client creates HTTPS data packet to 198.51.100.25:443
  // Step 10: Packet moves: CLIENT -> WEB SERVER
  // Step 11: Web Server receives request & returns response (LEGITIMATE DNS FLOW COMPLETE ✓) - STOP
  //
  // SCENARIO 2: MALICIOUS C2 DOMAIN SINKHOLING (Steps 12-16)
  // Step 12: Malware on infected client generates lookup for C2 threat domain (malware-c2-botnet.xyz)
  // Step 13: Query moves: CLIENT -> DNS SECURITY FIREWALL
  // Step 14: DNS Firewall evaluates threat intelligence: High-Risk C2 Domain identified
  // Step 15: Action: Query SINKHOLED / BLOCKED ✕ (Redirected to internal quarantine IP)
  // Step 16: Malware C2 communication prevented; alert sent to SOC ✓

  const isThreatScenario = currentStepIndex >= 12;

  const showDns = currentStepIndex >= 1;
  const showWebServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isDnsQuery = currentStepIndex >= 4 && currentStepIndex <= 6;
  const isDnsReply = currentStepIndex >= 7 && currentStepIndex <= 8;
  const isHttpsFlow = currentStepIndex >= 9 && currentStepIndex <= 11;
  const isSinkholed = currentStepIndex >= 15;

  let packetX = 80;
  if (!isThreatScenario) {
    if (currentStepIndex === 4) packetX = 80;
    else if (currentStepIndex === 5 || currentStepIndex === 6) packetX = 370;
    else if (currentStepIndex === 7) packetX = 230;
    else if (currentStepIndex === 8) packetX = 80;
    else if (currentStepIndex === 9) packetX = 80;
    else if (currentStepIndex === 10) packetX = 370;
    else if (currentStepIndex >= 11) packetX = 660;
  } else {
    if (currentStepIndex === 12) packetX = 80;
    else if (currentStepIndex >= 13) packetX = 370;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <>
          <line x1="80" y1="75" x2="370" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="370" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
          <path d="M 80 75 Q 370 130 660 75" fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" />
        </>
      )}

      {/* Movement Arrows */}
      {!isThreatScenario && currentStepIndex === 5 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#0891b2" label="DNS QUERY (UDP 53) →" />
      )}
      {!isThreatScenario && currentStepIndex === 7 && (
        <BoldArrow x1={325} y1={75} x2={115} y2={75} color="#10b981" label="← DNS RESPONSE (A RECORD)" />
      )}
      {!isThreatScenario && currentStepIndex === 10 && (
        <BoldArrow x1={115} y1={75} x2={615} y2={75} color="#2563eb" label="HTTPS SESSION (TCP 443) →" />
      )}
      {isThreatScenario && currentStepIndex === 13 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#ef4444" label="MALICIOUS C2 LOOKUP →" />
      )}

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isThreatScenario ? 'INFECTED CLIENT' : 'CLIENT'}
        ip="10.0.1.50"
        active={!isThreatScenario ? currentStepIndex <= 5 || currentStepIndex === 8 || currentStepIndex === 9 : currentStepIndex <= 13}
      />

      {/* DNS Resolver */}
      {showDns && (
        <g>
          <rect x="330" y="55" width="80" height="40" rx="6" fill="#0f172a" stroke={isSinkholed ? '#ef4444' : '#06b6d4'} strokeWidth="2" />
          <text x="370" y="74" textAnchor="middle" fill="#67e8f9" fontSize="8" fontWeight="bold" fontFamily="monospace">
            DNS RESOLVER
          </text>
          <text x="370" y="86" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
            {isSinkholed ? 'SINKHOLE ACTIVE' : 'Port 53 (UDP)'}
          </text>
        </g>
      )}

      {/* Target Web Server */}
      {showWebServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="WEB SERVER"
          sub="198.51.100.25:443"
          active={currentStepIndex >= 10 && currentStepIndex <= 11}
          success={currentStepIndex >= 11 && !isThreatScenario}
          statusText={currentStepIndex >= 11 && !isThreatScenario ? 'ACCEPTED ✓' : 'example.com'}
        />
      )}

      {/* Packet Card */}
      {((!isThreatScenario && currentStepIndex >= 4) || (isThreatScenario && currentStepIndex >= 12)) && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={
              !isThreatScenario
                ? isDnsQuery
                  ? 'DNS QUERY'
                  : isDnsReply
                  ? 'DNS ANSWER'
                  : 'HTTPS SYN'
                : isSinkholed
                ? 'SINKHOLED ✕'
                : 'C2 QUERY'
            }
            protocol={isHttpsFlow ? 'TCP' : 'UDP'}
            port={isHttpsFlow ? '443' : '53'}
            src={isDnsReply ? '10.0.0.1' : '10.0.1.50'}
            dst={
              !isThreatScenario
                ? isHttpsFlow
                  ? '198.51.100.25'
                  : 'example.com'
                : 'malware-c2.xyz'
            }
            status={
              !isThreatScenario
                ? isHttpsFlow && currentStepIndex >= 11
                  ? 'ALLOW'
                  : 'NORMAL'
                : isSinkholed
                ? 'DENY'
                : 'INSPECT'
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
          {isThreatScenario
            ? 'DNS SECURITY THREAT MITIGATION: DNS SINKHOLING & DOMAIN FILTERING'
            : 'DOMAIN NAME SYSTEM (DNS) RESOLUTION & APPLICATION SESSION ESTABLISHMENT'}
        </text>

        {!isThreatScenario ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="12" y="18" fill="#0369a1" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              DNS RESOLUTION WORKFLOW (UDP PORT 53):
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Client sends recursive query: "What is IP address for domain 'example.com'?"
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. Corporate Resolver queries Root → TLD → Authoritative servers, caches result, and returns A-Record (198.51.100.25).
            </text>
            <text x="14" y="74" fill="#0f172a" fontSize="7.5">
              3. Client extracts IP and opens TCP 443 socket directly to Web Server.
            </text>
            <text x="14" y="98" fill="#15803d" fontSize="7.5" fontWeight="bold">
              DNS is the critical pre-requisite for virtually all enterprise web and application communications.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="4" fill="#fef2f2" stroke="#f87171" />
            <text x="12" y="18" fill="#991b1b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              DNS THREAT MITIGATION (SINKHOLING MALICIOUS DOMAINS):
            </text>
            <text x="14" y="38" fill="#0f172a" fontSize="7.5">
              1. Infected endpoint attempts to resolve known botnet/ransomware C2 domain (\`malware-c2-botnet.xyz\`).
            </text>
            <text x="14" y="56" fill="#0f172a" fontSize="7.5">
              2. DNS Security Firewall matches domain against threat intelligence feeds.
            </text>
            <text x="14" y="74" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">
              3. ACTION: Query SINKHOLED (Forges response to internal quarantine loopback IP 10.255.255.255) ✕.
            </text>
            <text x="14" y="98" fill="#15803d" fontSize="7.5" fontWeight="bold">
              BENEFIT: Neutralizes malware communication before any TCP connection can form.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
