import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q11NatTranslationVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Private Host 192.168.1.10
  // Step 1: Packet leaves host
  // Step 2: Packet reaches NAT Gateway
  // Step 3: NAT inspects private source IP: 192.168.1.10:52410
  // Step 4: NAT rewrites source IP to Public 203.0.113.10:40001
  // Step 5: Public packet travels to Internet Web Server
  // Step 6: NAT Mapping Table records inside local <-> inside global translation
  // Step 7: Server responds to public IP 203.0.113.10:40001
  // Step 8: NAT maps response back to Private Device 192.168.1.10:52410

  const isAtNat = currentStepIndex >= 2 && currentStepIndex <= 4;
  const isTranslated = currentStepIndex >= 4;
  const isDeliveredToServer = currentStepIndex >= 5;
  const isReturnTraffic = currentStepIndex >= 7;
  const isBackToHost = currentStepIndex >= 8;

  let packetSrc = isTranslated ? '203.0.113.10' : '192.168.1.10';
  let packetX = 140;
  if (currentStepIndex === 0) packetX = 140;
  else if (currentStepIndex === 1) packetX = 250;
  else if (currentStepIndex >= 2 && currentStepIndex <= 4) packetX = 370;
  else if (currentStepIndex === 5 || currentStepIndex === 6) packetX = 520;
  else if (currentStepIndex === 7) packetX = 520;
  else if (currentStepIndex >= 8) packetX = 140;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Boundary Zones Background */}
      <rect x="30" y="15" width="310" height="115" rx="8" fill="#eff6ff" stroke="#bfdbfe" opacity={0.6} />
      <text x="45" y="32" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">
        PRIVATE RFC 1918 NETWORK (192.168.1.0/24)
      </text>

      <rect x="400" y="15" width="330" height="115" rx="8" fill="#f0fdf4" stroke="#bbf7d0" opacity={0.6} />
      <text x="415" y="32" fill="#15803d" fontSize="9" fontWeight="bold" fontFamily="monospace">
        PUBLIC INTERNET / WAN (203.0.113.0/24)
      </text>

      {/* Network Baseline Line */}
      <line x1="90" y1="80" x2="650" y2="80" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />

      {/* Connection Arrows */}
      {/* Outbound Arrow (Only when currentStepIndex >= 1 and not return traffic) */}
      {currentStepIndex >= 1 && !isReturnTraffic && (
        <>
          <BoldArrow x1={130} y1={80} x2={330} y2={80} color="#2563eb" label="PRIVATE IP" />
          {isTranslated && (
            <BoldArrow x1={410} y1={80} x2={610} y2={80} color="#10b981" label="PUBLIC TRANSLATED IP" />
          )}
        </>
      )}

      {/* Inbound Return Arrow */}
      {isReturnTraffic && (
        <>
          <BoldArrow x1={610} y1={80} x2={410} y2={80} color="#10b981" reverse label="REPLY TO PUBLIC IP" curveOffset={20} />
          {isBackToHost && (
            <BoldArrow x1={330} y1={80} x2={130} y2={80} color="#2563eb" reverse label="TRANSLATED TO PRIVATE IP ✓" curveOffset={20} />
          )}
        </>
      )}

      {/* Device Nodes */}
      <LaptopNode cx={90} cy={80} label="PRIVATE LAPTOP" ip="192.168.1.10" active={currentStepIndex >= 1} success={isBackToHost} />
      
      {/* NAT Router Gateway */}
      <g transform="translate(370, 80)">
        <circle cx="0" cy="-8" r="38" fill={isAtNat ? '#2563eb22' : 'transparent'} />
        <rect x="-30" y="-30" width="60" height="42" rx="6" fill="#0f172a" stroke={isTranslated ? '#10b981' : '#2563eb'} strokeWidth={2.5} />
        <path d="M -16 -10 L 16 -10 M 10 -16 L 16 -10 L 10 -4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 16 -2 L -16 -2 M -10 -8 L -16 -2 L -10 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="0" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">NAT ROUTER</text>
        <text x="0" y="36" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2563eb" fontFamily="monospace">203.0.113.10</text>
      </g>

      <ServerNodeSVG cx={650} cy={80} label="WEB SERVER" sub="198.51.100.2:80" active={isDeliveredToServer} success={isDeliveredToServer} />

      {/* Packet Card (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={packetX}
          cy={34}
          title={isReturnTraffic ? 'REPLY PACKET' : isTranslated ? 'TRANSLATED PACKET' : 'ORIGINAL PACKET'}
          protocol="TCP"
          port={80}
          src={isReturnTraffic ? '198.51.100.2' : packetSrc}
          dst={isReturnTraffic ? (isBackToHost ? '192.168.1.10' : '203.0.113.10') : '198.51.100.2'}
          status={isTranslated ? 'ALLOW' : 'NORMAL'}
          scale={0.8}
        />
      )}

      {/* Lower NAT Mapping Table */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="28" rx="9" fill="#0f172a" />
        <text x="16" y="18" fill="#ffffff" fontSize="10.5" fontWeight="bold">
          NAT (NETWORK ADDRESS TRANSLATION) TRANSLATION TABLE (NAT TABLE)
        </text>
        <line x1="0" y1="28" x2="700" y2="28" stroke="#e2e8f0" strokeWidth="1" />

        {/* Table Columns */}
        <g transform="translate(16, 46)">
          <text x="0" y="0" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">INSIDE LOCAL (PRIVATE)</text>
          <text x="180" y="0" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">INSIDE GLOBAL (PUBLIC)</text>
          <text x="360" y="0" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">OUTSIDE GLOBAL</text>
          <text x="510" y="0" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">STATUS</text>

          {/* Active Row */}
          <rect
            x="-6"
            y="8"
            width="678"
            height="36"
            rx="6"
            fill={isTranslated ? '#ecfdf5' : '#f8fafc'}
            stroke={isTranslated ? '#10b981' : '#e2e8f0'}
            strokeWidth={1.5}
          />
          <text x="4" y="30" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">
            192.168.1.10 :52410
          </text>
          <text x="180" y="30" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">
            203.0.113.10 :40001
          </text>
          <text x="360" y="30" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">
            198.51.100.2 :80
          </text>
          <text x="510" y="30" fill={isTranslated ? '#059669' : '#64748b'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isBackToHost ? '✓ REVERSE MAPPED TO HOST' : isTranslated ? 'TRANSLATED & ACTIVE' : 'CREATING ENTRY...'}
          </text>
        </g>

        {/* Dynamic Educational Commentary */}
        <g transform="translate(16, 120)">
          <rect x="0" y="0" width="668" height="58" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="20" fill="#334155" fontSize="8.5" fontWeight="bold">
            WHY NAT IS ESSENTIAL:
          </text>
          <text x="14" y="36" fill="#64748b" fontSize="8">
            1. IPv4 Address Preservation: Multiple private devices share globally routable public IPs.
          </text>
          <text x="14" y="48" fill="#64748b" fontSize="8">
            2. Perimeter Topology Shielding: External servers only see the public IP (203.0.113.10); internal network layout is hidden.
          </text>
        </g>
      </g>
    </svg>
  );
};
