import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q43SplitTunnelingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Corporate Subnet Destination (Steps 0-4)
  // Step 1: Remote Worker on laptop appears with VPN client connected
  // Step 2: Corporate VPN Gateway & Enterprise Intranet appear
  // Step 3: Public Internet Server (YouTube/Netflix) appears
  // Step 4: Worker sends request for internal file server (10.0.5.20)
  // Step 5: Packet routes into encrypted VPN Tunnel -> Corporate Server (Delivered ✓) - STOP
  //
  // Scenario 2: Public Internet Destination (Steps 5-9)
  // Step 6: Worker requests public Internet destination (e.g. YouTube / Personal browsing)
  // Step 7: VPN client checks routing table: Destination is public WAN
  // Step 8: Packet routes directly out local home ISP interface (Bypasses corporate VPN)
  // Step 9: Corporate bandwidth conserved ✓
  // Step 10: Security Tradeoff Highlight: Split tunneling saves WAN bandwidth but creates bridging risk

  const isPublicInternetPhase = currentStepIndex >= 5;

  const showCorporate = currentStepIndex >= 1;
  const showInternet = currentStepIndex >= 2;

  const isCorpDelivered = currentStepIndex >= 3 && currentStepIndex <= 4;
  const isPublicDelivered = currentStepIndex >= 7;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isPublicInternetPhase ? '#eff6ff' : '#faf5ff'} stroke={isPublicInternetPhase ? '#93c5fd' : '#c084fc'} />
        <text x="340" y="16" textAnchor="middle" fill={isPublicInternetPhase ? '#1e40af' : '#6b21a8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isPublicInternetPhase
            ? 'TRAFFIC 2: PUBLIC INTERNET STREAM (YOUTUBE) ➔ ROUTES DIRECTLY VIA LOCAL ISP (BYPASSES VPN)'
            : 'TRAFFIC 1: CORPORATE INTRANET (10.0.5.20) ➔ ROUTES VIA ENCRYPTED VPN TUNNEL TO HQ'}
        </text>
      </g>

      {/* Nodes: Client -> [Corporate VPN / Public Internet] */}
      <LaptopNode cx={80} cy={75} label="REMOTE WORKER" ip="192.168.1.100" active />

      {showCorporate && (
        <g transform="translate(370, 35)">
          <FirewallGatewayNode cx={0} cy={0} label="CORP VPN GW" sub="10.0.5.0/24 Subnet" active={!isPublicInternetPhase} success={isCorpDelivered} />
        </g>
      )}

      {showCorporate && (
        <g transform="translate(650, 35)">
          <ServerNodeSVG cx={0} cy={0} label="CORP INTRANET" sub="10.0.5.20" active={!isPublicInternetPhase} success={isCorpDelivered} />
        </g>
      )}

      {showInternet && (
        <g transform="translate(650, 105)">
          <ServerNodeSVG cx={0} cy={0} label="PUBLIC INTERNET" sub="YouTube / Netflix" active={isPublicInternetPhase} success={isPublicDelivered} />
        </g>
      )}

      {/* Arrows */}
      {!isPublicInternetPhase && currentStepIndex >= 3 && (
        <>
          <BoldArrow x1={120} y1={75} x2={310} y2={35} color="#8b5cf6" label="🔒 VPN TUNNEL" />
          <BoldArrow x1={430} y1={35} x2={590} y2={35} color="#10b981" label="CORP DELIVERED ✓" />
        </>
      )}

      {isPublicInternetPhase && currentStepIndex >= 6 && (
        <BoldArrow x1={120} y1={75} x2={590} y2={105} color="#2563eb" label="DIRECT LOCAL ISP (BYPASSES VPN) ✓" />
      )}

      {/* Lower Comparison Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          SPLIT TUNNELING vs FULL TUNNELING ARCHITECTURAL TRADEOFFS
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">SPLIT TUNNELING (Selective Routing):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">How it works: Only corporate subnets (10.0.0.0/8) enter VPN tunnel.</text>
          <text x="12" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Advantage: Saves massive corporate bandwidth (Zoom/YouTube stay local).</text>
          <text x="12" y="62" fill="#dc2626" fontSize="7.5">Security Risk: Infected laptop connected directly to public Internet can serve as a bridge into corporate network.</text>
          <text x="12" y="80" fill="#64748b" fontSize="7">Popular during remote-work expansions to prevent bandwidth exhaustion.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#faf5ff" stroke="#c084fc" />
          <text x="355" y="16" fill="#6b21a8" fontSize="8.5" fontWeight="bold">FULL TUNNELING (100% Traffic Inspection):</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">How it works: Default route (0.0.0.0/0) forced into corporate tunnel.</text>
          <text x="359" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Advantage: 100% of employee web traffic inspected by NGFW & DLP.</text>
          <text x="359" y="62" fill="#dc2626" fontSize="7.5">Limitation: High HQ Internet bandwidth cost and added latency.</text>
          <text x="359" y="80" fill="#059669" fontSize="7.5" fontWeight="bold">Mandatory for high-security, defense & banking organizations.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: Split tunneling routes corporate traffic through the VPN and public web traffic directly out the local ISP.
          </text>
        </g>
      </g>
    </svg>
  );
};
