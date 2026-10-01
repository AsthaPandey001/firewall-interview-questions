import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q41TlsVsIpsecVpnVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Part A: SSL/TLS VPN (Steps 0-5)
  // Step 1: Remote Worker on laptop appears
  // Step 2: TLS VPN Gateway appears
  // Step 3: Internal Corporate Web App appears
  // Step 4: User initiates TLS session over TCP Port 443 (Clientless/Agent)
  // Step 5: Encrypted TLS tunnel active; user interacts with specific authorized web app (Delivered ✓) - STOP
  //
  // Part B: IPsec VPN (Steps 6-11)
  // Step 6: Branch Office Network & HQ Data Center topology appear
  // Step 7: IPsec Gateway establishes Layer 3 site tunnel (IKEv2 / ESP Protocol 50)
  // Step 8: Entire subnet (10.1.0.0/24) connected to HQ subnet (10.2.0.0/24)
  // Step 9: IPsec encrypted packet transits WAN tunnel
  // Step 10: Remote Gateway decrypts and forwards packet to internal host
  // Step 11: Summary Comparison: TLS = Application/User Remote Access; IPsec = Network-to-Network L3 Infrastructure

  const isIpsecPhase = currentStepIndex >= 5;

  const showGateway = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isTlsDelivered = currentStepIndex >= 4 && currentStepIndex <= 5;
  const isIpsecDelivered = currentStepIndex >= 9;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isIpsecPhase ? '#eff6ff' : '#faf5ff'} stroke={isIpsecPhase ? '#93c5fd' : '#c084fc'} />
        <text x="340" y="16" textAnchor="middle" fill={isIpsecPhase ? '#1e40af' : '#6b21a8'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isIpsecPhase
            ? 'PART B: IPsec VPN (LAYER 3 NETWORK-TO-NETWORK TUNNELING FOR ALL PROTOCOLS & SUBSETS)'
            : 'PART A: SSL/TLS VPN (LAYER 7 APPLICATION / USER REMOTE ACCESS OVER HTTPS PORT 443)'}
        </text>
      </g>

      {/* Nodes */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isIpsecPhase ? 'BRANCH HOST' : 'REMOTE WORKER'}
        ip={isIpsecPhase ? '10.1.0.15' : '192.168.1.100'}
        active
      />

      {showGateway && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label={isIpsecPhase ? 'IPSEC GATEWAY' : 'SSL/TLS GATEWAY'}
          sub={isIpsecPhase ? 'ESP Protocol 50' : 'HTTPS Port 443'}
          active
          success={isTlsDelivered || isIpsecDelivered}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label={isIpsecPhase ? 'HQ DATA CENTER' : 'INTERNAL WEB APP'}
          sub={isIpsecPhase ? '10.2.0.50' : '10.0.1.80:443'}
          active
          success={isTlsDelivered || isIpsecDelivered}
        />
      )}

      {/* Arrows */}
      {!isIpsecPhase ? (
        <>
          {currentStepIndex >= 3 && (
            <BoldArrow x1={120} y1={75} x2={330} y2={75} color="#8b5cf6" label="🔒 TLS TUNNEL :443" />
          )}
          {isTlsDelivered && (
            <BoldArrow x1={410} y1={75} x2={610} y2={75} color="#10b981" label="APP ACCESS ✓" />
          )}
        </>
      ) : (
        <>
          {currentStepIndex >= 7 && (
            <BoldArrow x1={120} y1={75} x2={330} y2={75} color="#2563eb" label="🔒 IPSEC ESP TUNNEL" />
          )}
          {isIpsecDelivered && (
            <BoldArrow x1={410} y1={75} x2={610} y2={75} color="#10b981" label="L3 ROUTED ✓" />
          )}
        </>
      )}

      {/* Lower Comparison Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          SSL/TLS VPN vs IPsec VPN ARCHITECTURAL COMPARISON
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill={!isIpsecPhase ? '#faf5ff' : '#f8fafc'} stroke={!isIpsecPhase ? '#c084fc' : '#cbd5e1'} strokeWidth={!isIpsecPhase ? 2 : 1} />
          <text x="10" y="16" fill="#6b21a8" fontSize="8.5" fontWeight="bold">SSL / TLS VPN (Application Layer 7):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">Use Case: Remote access for mobile workers / contractors.</text>
          <text x="12" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Clientless: Works in any standard web browser over TCP 443.</text>
          <text x="12" y="62" fill="#64748b" fontSize="7">NAT Traversal: Always traverses NAT/Firewalls without special rules.</text>
          <text x="12" y="76" fill="#64748b" fontSize="7">Granular: Restricts users to specific web apps (least privilege).</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill={isIpsecPhase ? '#eff6ff' : '#f8fafc'} stroke={isIpsecPhase ? '#93c5fd' : '#cbd5e1'} strokeWidth={isIpsecPhase ? 2 : 1} />
          <text x="355" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">IPsec VPN (Network Layer 3):</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">Use Case: Site-to-Site permanent branch & data center links.</text>
          <text x="359" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Protocol Support: Encrypts ALL IP traffic (TCP, UDP, ICMP, Routing).</text>
          <text x="359" y="62" fill="#64748b" fontSize="7">NAT Traversal: Requires NAT-T (UDP 4500) when traversing PAT.</text>
          <text x="359" y="76" fill="#64748b" fontSize="7">Performance: Hardware ASIC acceleration yields multi-gigabit speeds.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: TLS VPN is optimized for user remote access to specific applications; IPsec VPN is optimized for high-performance transparent network-to-network connectivity.
          </text>
        </g>
      </g>
    </svg>
  );
};
