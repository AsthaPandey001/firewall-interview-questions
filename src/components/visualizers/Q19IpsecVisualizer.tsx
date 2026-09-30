import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q19IpsecVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Step 1: Original Plaintext Packet created at Site A
  // Step 1: Step 2: Site A IPsec Gateway receives packet and performs IPsec Processing (Security Association SA lookup)
  // Step 2: Step 3: IPsec Encryption with AES-256-GCM (Plaintext -> Ciphertext)
  // Step 3: Step 4: Encrypted ESP Packet enters Tunnel
  // Step 4: Step 5: Packet travels across Untrusted Public Internet inside tunnel
  // Step 5: Step 6: Remote Site B Gateway receives encrypted packet
  // Step 6: Step 7: Site B Gateway decrypts & authenticates ESP payload
  // Step 7: Step 8: Original Plaintext packet reconstructed and delivered to Site B Server (PLAINTEXT -> ENCRYPT -> CIPHERTEXT -> DECRYPT -> PLAINTEXT)

  const isEncrypted = currentStepIndex >= 2 && currentStepIndex <= 5;
  const isDelivered = currentStepIndex >= 7;

  let packetX = 100;
  if (currentStepIndex === 0) packetX = 140;
  else if (currentStepIndex === 1 || currentStepIndex === 2) packetX = 240;
  else if (currentStepIndex === 3) packetX = 330;
  else if (currentStepIndex === 4) packetX = 400;
  else if (currentStepIndex === 5 || currentStepIndex === 6) packetX = 540;
  else if (currentStepIndex >= 7) packetX = 640;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Untrusted Public Internet Zone Area in the middle */}
      <rect x="290" y="25" width="220" height="95" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4 4" />
      <text x="400" y="42" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
        UNTRUSTED PUBLIC INTERNET / WAN
      </text>

      {/* Baseline Network Line */}
      <line x1="80" y1="80" x2="680" y2="80" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />

      {/* Nodes: Site A Client -> IPsec GW A -> Encrypted Tunnel -> IPsec GW B -> Site B Server */}
      <LaptopNode cx={80} cy={80} label="SITE A HOST" ip="10.1.0.10" active />

      <FirewallGatewayNode cx={240} cy={80} label="IPSEC GW A" sub="203.0.113.1" active success={currentStepIndex >= 2} />

      {/* Encrypted Tunnel Path in Middle */}
      <g transform="translate(400, 80)">
        <rect x="-85" y="-14" width="170" height="28" rx="6" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 3" />
        <text x="0" y="4" textAnchor="middle" fill="#7e22ce" fontSize="8" fontWeight="bold" fontFamily="monospace">
          🔒 IPSEC ESP TUNNEL
        </text>
      </g>

      <FirewallGatewayNode cx={560} cy={80} label="IPSEC GW B" sub="198.51.100.1" active success={currentStepIndex >= 6} />

      <ServerNodeSVG cx={680} cy={80} label="SITE B SERVER" sub="10.2.0.50:443" active success={isDelivered} />

      {/* Arrows (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <BoldArrow x1={115} y1={80} x2={195} y2={80} color="#2563eb" label="PLAINTEXT" />
      )}
      {currentStepIndex >= 3 && (
        <BoldArrow x1={285} y1={80} x2={515} y2={80} color="#8b5cf6" label="🔒 ESP CIPHERTEXT" />
      )}
      {isDelivered && (
        <BoldArrow x1={605} y1={80} x2={645} y2={80} color="#10b981" label="PLAINTEXT ✓" />
      )}

      {/* Moving Packet Card (Only when currentStepIndex >= 1) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={packetX}
          cy={30}
          title={isEncrypted ? 'IPSEC ESP PACKET' : 'ORIGINAL DATA'}
          protocol={isEncrypted ? 'ESP' : 'TCP'}
          port={isEncrypted ? '50' : '443'}
          src={isEncrypted ? '203.0.113.1' : '10.1.0.10'}
          dst={isEncrypted ? '198.51.100.1' : '10.2.0.50'}
          isEncrypted={isEncrypted}
          status={isEncrypted ? 'ENCRYPT' : isDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Encapsulation Transformation Pipeline */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          IPSEC TUNNEL MODE PACKET ENCAPSULATION & TRANSFORMATION PIPELINE
        </text>

        {/* Transformation Pipeline Stages */}
        <g transform="translate(16, 38)">
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="150" height="75" rx="6" fill="#eff6ff" stroke="#93c5fd" />
            <text x="75" y="18" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="bold">1. ORIGINAL IP PACKET</text>
            <rect x="8" y="28" width="134" height="18" rx="3" fill="#ffffff" stroke="#cbd5e1" />
            <text x="75" y="41" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontFamily="monospace">Src: 10.1.0.10 | Dst: 10.2.0.50</text>
            <rect x="8" y="48" width="134" height="18" rx="3" fill="#ffffff" stroke="#cbd5e1" />
            <text x="75" y="61" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontFamily="monospace">TCP Payload (Plaintext)</text>
          </g>

          <text x="162" y="42" fill="#8b5cf6" fontSize="14" fontWeight="bold">➔</text>

          <g transform="translate(185, 0)">
            <rect x="0" y="0" width="280" height="75" rx="6" fill="#faf5ff" stroke="#c084fc" strokeWidth={1.5} />
            <text x="140" y="18" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="bold">2. ENCRYPTED IPSEC ESP TUNNEL PACKET</text>
            <rect x="6" y="28" width="65" height="38" rx="3" fill="#3b82f6" />
            <text x="38" y="45" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">NEW IP HDR</text>
            <text x="38" y="58" textAnchor="middle" fill="#ffffff" fontSize="6" fontFamily="monospace">203→198</text>

            <rect x="74" y="28" width="45" height="38" rx="3" fill="#8b5cf6" />
            <text x="96" y="50" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">ESP HDR</text>

            <rect x="122" y="28" width="95" height="38" rx="3" fill="#4c1d95" />
            <text x="169" y="45" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">🔒 ENCRYPTED</text>
            <text x="169" y="58" textAnchor="middle" fill="#c084fc" fontSize="6" fontFamily="monospace">Orig IP + Data</text>

            <rect x="220" y="28" width="54" height="38" rx="3" fill="#a855f7" />
            <text x="247" y="50" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">ESP AUTH</text>
          </g>

          <text x="477" y="42" fill="#10b981" fontSize="14" fontWeight="bold">➔</text>

          <g transform="translate(500, 0)">
            <rect x="0" y="0" width="165" height="75" rx="6" fill="#ecfdf5" stroke="#86efac" />
            <text x="82" y="18" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold">3. RECONSTRUCTED</text>
            <rect x="8" y="28" width="149" height="18" rx="3" fill="#ffffff" stroke="#cbd5e1" />
            <text x="82" y="41" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontFamily="monospace">Src: 10.1.0.10 | Dst: 10.2.0.50</text>
            <rect x="8" y="48" width="149" height="18" rx="3" fill="#ffffff" stroke="#cbd5e1" />
            <text x="82" y="61" textAnchor="middle" fill="#059669" fontSize="7.5" fontFamily="monospace">Decrypted Plaintext ✓</text>
          </g>
        </g>

        {/* Formula Summary */}
        <g transform="translate(16, 130)">
          <rect x="0" y="0" width="668" height="46" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="18" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TRANSFORMATION RULE: PLAINTEXT → IPSEC ENCRYPTION (AES-GCM) → CIPHERTEXT TUNNEL TRANSIT → DECRYPTION → PLAINTEXT DELIVERED.
          </text>
          <text x="14" y="34" fill="#64748b" fontSize="7.5">
            Tunnel Mode wraps the entire original packet (including private IP headers) inside a new public IP header, protecting against traffic analysis.
          </text>
        </g>
      </g>
    </svg>
  );
};
