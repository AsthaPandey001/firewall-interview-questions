import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q42VpnTunnelSetupVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Site A Gateway (203.0.113.1) appears
  // Step 2: Untrusted Public WAN appears
  // Step 3: Site B Gateway (198.51.100.1) appears
  // Step 4: IKE Phase 1 Negotiation: Diffie-Hellman + PSK establish ISAKMP SA management tunnel
  // Step 5: IKE Phase 2 Negotiation: Negotiate IPsec SAs, AES-256 cipher, and traffic selectors
  // Step 6: Bidirectional IPsec ESP Tunnel establishes
  // Step 7: Site A host creates private packet (10.1.0.10 -> 10.2.0.50)
  // Step 8: Gateway encrypts original packet with AES-256 and attaches public IP header
  // Step 9: Encrypted ESP packet transits across tunnel
  // Step 10: Remote Gateway decrypts and delivers original plaintext to Site B Server (Delivered ✓)

  const showWan = currentStepIndex >= 1;
  const showGwB = currentStepIndex >= 2;
  const isPhase1 = currentStepIndex === 3;
  const isPhase2 = currentStepIndex === 4;
  const isTunnelActive = currentStepIndex >= 5;
  const isEncryptedTransit = currentStepIndex >= 7 && currentStepIndex <= 8;
  const isDelivered = currentStepIndex >= 9;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isTunnelActive ? '#f0fdf4' : '#eff6ff'} stroke={isTunnelActive ? '#86efac' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isTunnelActive ? '#047857' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isTunnelActive
            ? 'IPSEC TUNNEL ESTABLISHED: IKE PHASE 1 (MANAGEMENT SA) + IKE PHASE 2 (DATA ENCRYPTION SA) ACTIVE ✓'
            : isPhase1 || isPhase2
            ? 'IKE SA NEGOTIATION IN PROGRESS (IKE PHASE 1: ISAKMP SA ➔ IKE PHASE 2: IPSEC SA)'
            : 'IPSEC SITE-TO-SITE VPN TUNNEL ESTABLISHMENT'}
        </text>
      </g>

      {/* Nodes: Site A GW <-> Public WAN Tunnel <-> Site B GW */}
      <FirewallGatewayNode cx={120} cy={75} label="SITE A GATEWAY" sub="203.0.113.1" active success={isTunnelActive} />

      {/* Tunnel Visualization */}
      {showWan && (
        <g transform="translate(370, 75)">
          <rect x="-140" y="-18" width="280" height="36" rx="8" fill={isTunnelActive ? '#f3e8ff' : '#f8fafc'} stroke={isTunnelActive ? '#a855f7' : '#cbd5e1'} strokeWidth={2} strokeDasharray={isTunnelActive ? 'none' : '4 4'} />
          <text x="0" y="5" textAnchor="middle" fill={isTunnelActive ? '#6b21a8' : '#64748b'} fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            {isTunnelActive ? '🔒 ENCRYPTED IPSEC ESP TUNNEL (AES-256)' : 'UNTRUSTED PUBLIC WAN'}
          </text>
        </g>
      )}

      {showGwB && (
        <FirewallGatewayNode cx={620} cy={75} label="SITE B GATEWAY" sub="198.51.100.1" active success={isTunnelActive} />
      )}

      {/* Arrows */}
      {(isPhase1 || isPhase2) && (
        <BoldArrow x1={180} y1={75} x2={560} y2={75} color="#8b5cf6" label={isPhase1 ? 'IKEv2 SA INIT (DH SHARE)' : 'IKE AUTH (IPSEC SAs)'} />
      )}

      {isEncryptedTransit && (
        <BoldArrow x1={180} y1={75} x2={560} y2={75} color="#10b981" label="🔒 ESP CIPHERTEXT (PROTO 50)" />
      )}

      {isDelivered && (
        <g transform="translate(620, 75)">
          <rect x="45" y="-12" width="85" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth={1.5} />
          <text x="87" y="4" textAnchor="middle" fill="#065f46" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            DELIVERED ✓
          </text>
        </g>
      )}

      {/* Lower Handshake Phase Dissection */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          IPSEC VPN 2-PHASE TUNNEL NEGOTIATION LIFECYCLE
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill={isPhase1 || isTunnelActive ? '#f0fdf4' : '#eff6ff'} stroke={isPhase1 ? '#86efac' : '#93c5fd'} />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">IKE PHASE 1 (ISAKMP Management Tunnel):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">Purpose: Authenticates peers and creates secure control channel.</text>
          <text x="12" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Authentication: Pre-Shared Key (PSK) or X.509 Certificates.</text>
          <text x="12" y="62" fill="#64748b" fontSize="7">Diffie-Hellman Group: Computes shared secret over UDP 500.</text>
          <text x="12" y="78" fill="#64748b" fontSize="7" fontFamily="monospace">Result: Bi-directional ISAKMP SA established.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill={isPhase2 || isTunnelActive ? '#f0fdf4' : '#eff6ff'} stroke={isPhase2 ? '#86efac' : '#93c5fd'} />
          <text x="355" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">IKE PHASE 2 (IPsec Data Encryption SAs):</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">Purpose: Negotiates encryption transform-sets for user data.</text>
          <text x="359" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Security: ESP AES-256-GCM + SHA-256 Integrity + PFS.</text>
          <text x="359" y="62" fill="#64748b" fontSize="7">Traffic Selectors: Defines interesting traffic subnets (Crypto ACL).</text>
          <text x="359" y="78" fill="#64748b" fontSize="7" fontFamily="monospace">Result: Two unidirectional IPsec SAs (Inbound & Outbound).</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: Phase 1 builds the secure management channel; Phase 2 uses that channel to negotiate the actual IPsec data encryption tunnels.
          </text>
        </g>
      </g>
    </svg>
  );
};
