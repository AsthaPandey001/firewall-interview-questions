import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q20TlsHandshakeVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const isClientHello = currentStepIndex === 1;
  const isServerHello = currentStepIndex === 2;
  const isCertVerified = currentStepIndex >= 3;
  const isChannelSecure = currentStepIndex >= 3;
  const isDataTraveling = currentStepIndex >= 4;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="120" y1="80" x2="640" y2="80" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />

      {/* Nodes: Client <-> Server */}
      <LaptopNode cx={120} cy={80} label="CLIENT BROWSER" ip="192.168.1.100" active={currentStepIndex >= 1} success={isChannelSecure} />
      <ServerNodeSVG cx={640} cy={80} label="HTTPS WEB SERVER" sub="example.com:443" active={currentStepIndex >= 1} success={isChannelSecure} />

      {/* Step 1: ClientHello */}
      {isClientHello && (
        <BoldArrow x1={160} y1={80} x2={590} y2={80} color="#2563eb" label="1. ClientHello (ECDHE KeyShare)" />
      )}

      {/* Step 2: ServerHello */}
      {isServerHello && (
        <BoldArrow x1={590} y1={80} x2={160} y2={80} color="#10b981" reverse label="2. ServerHello (TLS_AES_256_GCM)" curveOffset={20} />
      )}

      {/* Step 3: Verified Certificate Badge */}
      {isCertVerified && (
        <g transform="translate(120, 25)" className="animate-pop-in">
          <rect x="-55" y="-12" width="110" height="24" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ✓ CERT VERIFIED
          </text>
        </g>
      )}

      {/* Secure Channel Tunnel */}
      {isChannelSecure && (
        <g transform="translate(380, 80)">
          <rect x="-170" y="-16" width="340" height="32" rx="16" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 3" />
          <text x="0" y="4.5" textAnchor="middle" fill="#6b21a8" fontSize="9" fontWeight="bold" fontFamily="monospace">
            🔒 TLS 1.3 SECURE ENCRYPTED SESSION ACTIVE
          </text>
        </g>
      )}

      {/* Encrypted Data Traveling */}
      {isDataTraveling && (
        <BoldArrow x1={160} y1={80} x2={590} y2={80} color="#8b5cf6" label="🔒 AES-GCM ENCRYPTED HTTP" />
      )}

      {/* Moving Packet Card on active encrypted steps */}
      {isDataTraveling && (
        <PacketCard
          cx={480}
          cy={30}
          title="APPLICATION DATA"
          protocol="TLS"
          port="443"
          src="CLIENT"
          dst="SERVER"
          isEncrypted={true}
          status="ENCRYPT"
          scale={0.8}
        />
      )}

      {/* Lower Handshake Progression Bar & Cryptographic State */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          TLS 1.3 1-RTT HANDSHAKE STATE MACHINE
        </text>

        {/* 4 Architectural Handshake Pillars */}
        <g transform="translate(16, 38)">
          {[
            { step: '1. CLIENT HELLO', desc: 'Supported Ciphers + ECDHE KeyShare', active: isClientHello, done: currentStepIndex >= 1 },
            { step: '2. SERVER HELLO', desc: 'Selected Cipher + Server KeyShare', active: isServerHello, done: currentStepIndex >= 2 },
            { step: '3. AUTHENTICATION', desc: 'X.509 Certificate Verified by CA', active: currentStepIndex === 2 || currentStepIndex === 3, done: isCertVerified },
            { step: '4. ENCRYPTED DATA', desc: 'AES-256-GCM Symmetric Cipher Active', active: isChannelSecure, done: isDataTraveling },
          ].map((item, i) => (
            <g key={item.step} transform={`translate(${i * 170}, 0)`}>
              <rect
                x="0"
                y="0"
                width="160"
                height="65"
                rx="6"
                fill={item.done ? '#ecfdf5' : item.active ? '#eff6ff' : '#f8fafc'}
                stroke={item.done ? '#10b981' : item.active ? '#3b82f6' : '#cbd5e1'}
                strokeWidth={item.active || item.done ? 2 : 1}
              />
              <rect x="0" y="0" width="160" height="18" rx="5" fill={item.done ? '#10b981' : item.active ? '#3b82f6' : '#cbd5e1'} />
              <text x="80" y="13" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="bold">
                {item.step}
              </text>
              <text x="80" y="38" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                {item.desc.split('+')[0]}
              </text>
              {item.desc.includes('+') && (
                <text x="80" y="52" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">
                  +{item.desc.split('+')[1]}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Summary Footer */}
        <g transform="translate(16, 125)">
          <rect x="0" y="0" width="668" height="50" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="18" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            HANDSHAKE LIFECYCLE: HANDSHAKE (1-RTT) → AUTHENTICATION (X.509) → SECURE SESSION (ECDHE) → ENCRYPTED DATA (AES-GCM).
          </text>
          <text x="14" y="34" fill="#64748b" fontSize="7.5">
            TLS 1.3 reduces the handshake to 1-RTT (Round Trip Time) by sending the client key share in the very first ClientHello message.
          </text>
        </g>
      </g>
    </svg>
  );
};
