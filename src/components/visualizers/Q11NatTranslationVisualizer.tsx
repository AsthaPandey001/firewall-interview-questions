import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q11NatTranslationVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Private Client only (192.168.1.10)
  // Step 1: NAT Gateway appears
  // Step 2: Internet Cloud appears
  // Step 3: Remote Server appears (198.51.100.20:443)
  // Step 4: Outbound packet created (192.168.1.10:5001 -> 198.51.100.20:443)
  // Step 5: Outbound packet moves: Client -> NAT
  // Step 6: NAT receives packet (Before Translation)
  // Step 7: NAT Table appears
  // Step 8: SNAT Translation happens: 192.168.1.10:5001 -> 203.0.113.10:5001
  // Step 9: Translated packet moves: NAT -> Internet
  // Step 10: Packet continues: Internet -> Remote Server
  // Step 11: Remote Server receives packet (Request Received ✓)
  // Step 12: Remote Server creates response packet (198.51.100.20:443 -> 203.0.113.10:5001)
  // Step 13: Response moves: Server -> Internet
  // Step 14: Response reaches NAT Gateway
  // Step 15: NAT Table lookup & De-NAT translation (203.0.113.10:5001 -> 192.168.1.10:5001)
  // Step 16: Response packet moves: NAT -> Client
  // Step 17: Client receives response (Full Round-Trip Complete ✓)

  const showClient = true;
  const showNat = currentStepIndex >= 1;
  const showInternet = currentStepIndex >= 2;
  const showServer = currentStepIndex >= 3;

  // Outbound trip flags
  const showOutboundPkt = currentStepIndex >= 4 && currentStepIndex <= 11;
  const isMovingToNat1 = currentStepIndex === 5;
  const isAtNat1 = currentStepIndex >= 6 && currentStepIndex <= 8;
  const showNatTable = currentStepIndex >= 7;
  const isTranslated1 = currentStepIndex >= 8;
  const isMovingToInternet1 = currentStepIndex === 9;
  const isMovingToServer1 = currentStepIndex === 10;
  const isDeliveredToServer = currentStepIndex >= 11;

  // Inbound return trip flags
  const showReturnPkt = currentStepIndex >= 12;
  const isReturnMovingToInternet = currentStepIndex === 13;
  const isReturnAtNat = currentStepIndex >= 14 && currentStepIndex <= 15;
  const isDeNatTranslated = currentStepIndex >= 15;
  const isReturnMovingToClient = currentStepIndex === 16;
  const isBackAtClient = currentStepIndex >= 17;

  // Outbound packet X position
  let pktX = 90;
  if (currentStepIndex === 4) pktX = 90;
  else if (isMovingToNat1) pktX = 230;
  else if (isAtNat1) pktX = 370;
  else if (isMovingToInternet1) pktX = 490;
  else if (isMovingToServer1 || isDeliveredToServer) pktX = 650;

  // Return packet X position
  let returnPktX = 650;
  if (currentStepIndex === 12) returnPktX = 650;
  else if (isReturnMovingToInternet) returnPktX = 490;
  else if (isReturnAtNat) returnPktX = 370;
  else if (isReturnMovingToClient) returnPktX = 230;
  else if (isBackAtClient) returnPktX = 90;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Boundary Zones Background */}
      <rect x="25" y="10" width="320" height="125" rx="8" fill="#eff6ff" stroke="#bfdbfe" opacity={0.6} />
      <text x="40" y="26" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
        PRIVATE RFC 1918 NETWORK (192.168.1.0/24)
      </text>

      <rect x="395" y="10" width="340" height="125" rx="8" fill="#f0fdf4" stroke="#bbf7d0" opacity={0.6} />
      <text x="410" y="26" fill="#15803d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
        PUBLIC INTERNET / WAN (203.0.113.0/24)
      </text>

      {/* Network Baseline Links */}
      {showNat && (
        <line x1="90" y1="80" x2="370" y2="80" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}
      {showServer && (
        <line x1="370" y1="80" x2="650" y2="80" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Outbound Connection Arrows */}
      {isMovingToNat1 && (
        <BoldArrow x1={130} y1={80} x2={330} y2={80} color="#2563eb" label="PRIVATE: 192.168.1.10 →" />
      )}
      {isMovingToInternet1 && (
        <BoldArrow x1={410} y1={80} x2={570} y2={80} color="#10b981" label="TRANSLATED: 203.0.113.10 →" />
      )}
      {isMovingToServer1 && (
        <BoldArrow x1={530} y1={80} x2={610} y2={80} color="#10b981" label="TO SERVER →" />
      )}

      {/* Return Connection Arrows */}
      {isReturnMovingToInternet && (
        <BoldArrow x1={610} y1={80} x2={410} y2={80} color="#10b981" reverse label="REPLY TO 203.0.113.10 ←" curveOffset={18} />
      )}
      {isReturnMovingToClient && (
        <BoldArrow x1={330} y1={80} x2={130} y2={80} color="#2563eb" reverse label="DE-NAT TO 192.168.1.10 ←" curveOffset={18} />
      )}

      {/* Device Nodes */}
      {showClient && (
        <g className="animate-pop-in">
          <LaptopNode 
            cx={90} 
            cy={80} 
            label="PRIVATE CLIENT" 
            ip="192.168.1.10" 
            active={currentStepIndex <= 5 || isBackAtClient} 
            success={isBackAtClient} 
            statusText={isBackAtClient ? 'REPLY RECEIVED ✓' : 'INSIDE LOCAL'}
          />
        </g>
      )}

      {/* NAT Router Gateway */}
      {showNat && (
        <g transform="translate(370, 80)" className="animate-pop-in">
          <circle cx="0" cy="-6" r="38" fill={isAtNat1 || isReturnAtNat ? '#2563eb18' : 'transparent'} />
          <rect x="-30" y="-28" width="60" height="42" rx="6" fill="#0f172a" stroke={isTranslated1 ? '#10b981' : '#2563eb'} strokeWidth={2.5} />
          <path d="M -16 -8 L 16 -8 M 10 -14 L 16 -8 L 10 -2" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 16 0 L -16 0 M -10 -6 L -16 0 L -10 6" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="0" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">NAT GATEWAY</text>
          <text x="0" y="36" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2563eb" fontFamily="monospace">203.0.113.10</text>
        </g>
      )}

      {/* Internet Cloud Node */}
      {showInternet && (
        <g transform="translate(510, 80)" className="animate-pop-in">
          <rect x="-35" y="-12" width="70" height="22" rx="11" fill="#f8fafc" stroke="#94a3b8" />
          <text x="0" y="2" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#475569" fontFamily="sans-serif">
            ☁️ INTERNET
          </text>
        </g>
      )}

      {/* Remote Server Node */}
      {showServer && (
        <g className="animate-pop-in">
          <ServerNodeSVG 
            cx={650} 
            cy={80} 
            label="WEB SERVER" 
            sub="198.51.100.20:443" 
            active={isDeliveredToServer} 
            success={isDeliveredToServer} 
            statusText={isDeliveredToServer ? 'REQUEST RECEIVED ✓' : 'WAITING...'}
          />
        </g>
      )}

      {/* Outbound Packet Card */}
      {showOutboundPkt && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={pktX}
            cy={34}
            title={isTranslated1 ? 'TRANSLATED PACKET' : 'ORIGINAL PACKET'}
            protocol="TCP"
            port="443"
            src={isTranslated1 ? '203.0.113.10:5001' : '192.168.1.10:5001'}
            dst="198.51.100.20:443"
            status={isTranslated1 ? 'ALLOW' : 'NORMAL'}
            scale={0.8}
          />
        </g>
      )}

      {/* Inbound Return Packet Card */}
      {showReturnPkt && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={returnPktX}
            cy={34}
            title={isDeNatTranslated ? 'DE-NATED REPLY' : 'SERVER RESPONSE'}
            protocol="TCP"
            port="443"
            src="198.51.100.20:443"
            dst={isDeNatTranslated ? '192.168.1.10:5001' : '203.0.113.10:5001'}
            status="ALLOW"
            scale={0.8}
          />
        </g>
      )}

      {/* Lower Section: NAT Table (Revealed Step 7+) */}
      {showNatTable ? (
        <g transform="translate(30, 142)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
          <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
            NAT TRANSLATION TABLE (STATEFUL BIDIRECTIONAL SESSION BINDING)
          </text>

          {/* Table Columns */}
          <g transform="translate(16, 42)">
            <text x="0" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">INSIDE LOCAL (PRIVATE)</text>
            <text x="180" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">INSIDE GLOBAL (PUBLIC)</text>
            <text x="360" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">OUTSIDE GLOBAL</text>
            <text x="510" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">MAPPING STATUS</text>

            {/* Active Row */}
            <rect
              x="-6"
              y="8"
              width="678"
              height="36"
              rx="6"
              fill={isBackAtClient ? '#ecfdf5' : isTranslated1 ? '#eff6ff' : '#f8fafc'}
              stroke={isBackAtClient ? '#10b981' : isTranslated1 ? '#3b82f6' : '#e2e8f0'}
              strokeWidth={1.5}
            />
            <text x="4" y="30" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">
              192.168.1.10 :5001
            </text>
            <text x="180" y="30" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">
              203.0.113.10 :5001
            </text>
            <text x="360" y="30" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">
              198.51.100.20 :443
            </text>
            <text x="510" y="30" fill={isBackAtClient ? '#059669' : '#2563eb'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {isBackAtClient 
                ? '✓ ROUND-TRIP COMPLETED' 
                : isDeNatTranslated 
                ? 'DE-NATED TO PRIVATE HOST' 
                : isDeliveredToServer 
                ? 'WAITING SERVER RESPONSE' 
                : 'TRANSLATED & ACTIVE'}
            </text>
          </g>

          {/* Transformation Visualizer Strip */}
          <g transform="translate(16, 110)">
            <rect x="0" y="0" width="668" height="64" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
            <text x="14" y="18" fill="#334155" fontSize="8" fontWeight="bold">
              {currentStepIndex <= 11 ? 'OUTBOUND SNAT TRANSFORMATION:' : 'INBOUND DE-NAT TRANSFORMATION:'}
            </text>

            {currentStepIndex <= 11 ? (
              <text x="14" y="38" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                Private Host (192.168.1.10:5001) ───[ NAT REWRITE ]───→ Public WAN (203.0.113.10:5001) → Server
              </text>
            ) : (
              <text x="14" y="38" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                Server Response ───→ Public (203.0.113.10:5001) ───[ NAT REVERSE ]───→ Private Client (192.168.1.10:5001)
              </text>
            )}

            <text x="14" y="54" fill="#64748b" fontSize="7.5">
              Result: External Internet servers never see the internal 192.168.1.10 address, keeping topology fully shielded.
            </text>
          </g>
        </g>
      ) : (
        <g transform="translate(30, 155)">
          <rect x="0" y="0" width="700" height="150" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="6 6" />
          <text x="350" y="80" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
            {currentStepIndex === 0 && 'STEP 1: Private Client online (192.168.1.10). Click Next to establish NAT Gateway.'}
            {currentStepIndex === 1 && 'STEP 2: NAT Gateway established. Click Next to connect Public Internet WAN.'}
            {currentStepIndex === 2 && 'STEP 3: Internet connected. Click Next to connect Remote Web Server.'}
            {currentStepIndex === 3 && 'STEP 4: Full topology ready. Click Next to create outbound packet.'}
            {currentStepIndex === 4 && 'STEP 5: Outbound packet created. Click Next to transmit to NAT Gateway.'}
            {currentStepIndex === 5 && 'STEP 6: Packet transmitting to NAT Gateway...'}
            {currentStepIndex === 6 && 'STEP 7: NAT Gateway buffering packet. Click Next to view NAT translation table.'}
          </text>
        </g>
      )}
    </svg>
  );
};
