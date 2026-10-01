import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q26FirewallLoggingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Client appears (192.168.1.50)
  // Step 1: Firewall appears
  // Step 2: Server appears (10.0.5.100)
  // Step 3: Cables drawn
  // Step 4: Client generates unauthorized packet (192.168.1.50 -> 10.0.5.100:23 Telnet)
  // Step 5: Packet moves: CLIENT -> FIREWALL
  // Step 6: Firewall receives packet (INSPECTING)
  // Step 7: Firewall evaluates Rulebase: Rule 405 (Block Insecure Telnet) matches
  // Step 8: Action: DENY
  // Step 9: Packet physically stops at Firewall (BLOCKED ✕)
  // Step 10: Firewall Syslog Engine generates structured log record
  // Step 11: Syslog record fields appear
  // Step 12: Highlight Source IP: 192.168.1.50
  // Step 13: Highlight Destination IP: 10.0.5.100
  // Step 14: Highlight Port: :23 (Telnet)
  // Step 15: Highlight Action: DENY / DROP
  // Step 16: Highlight Rule Match: Rule_Block_Telnet_405
  // Step 17: Complete Forensic Link: TRAFFIC -> BLOCK -> LOG -> RULE -> REASON ✓

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isBlocked = currentStepIndex >= 8;
  const showLog = currentStepIndex >= 10;

  let packetX = 80;
  if (currentStepIndex === 4) packetX = 80;
  else if (currentStepIndex === 5) packetX = 230;
  else if (currentStepIndex >= 6) packetX = 370;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Cables */}
      {showCables && (
        <line x1="80" y1="75" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Movement Arrow */}
      {currentStepIndex === 5 && (
        <BoldArrow x1={115} y1={75} x2={325} y2={75} color="#ef4444" label="TELNET ATTEMPT →" />
      )}

      {/* Nodes */}
      <LaptopNode cx={80} cy={75} label="CLIENT" ip="192.168.1.50" active={currentStepIndex <= 5} />

      {showFw && (
        <FirewallGatewayNode
          cx={370}
          cy={75}
          label="FIREWALL"
          sub={isBlocked ? 'DROPPED ✕' : currentStepIndex >= 6 ? 'INSPECTING' : 'Syslog Engine'}
          active={currentStepIndex >= 5}
          success={false}
        />
      )}

      {showServer && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="TARGET SERVER"
          sub="10.0.5.100:23"
          active={false}
          success={false}
          statusText="UNREACHED (SECURE)"
        />
      )}

      {/* Blocked Packet */}
      {currentStepIndex >= 4 && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={28}
            title={isBlocked ? 'BLOCKED ✕' : 'TELNET SYN'}
            protocol="TCP"
            port="23"
            src="192.168.1.50"
            dst="10.0.5.100"
            status={isBlocked ? 'DENY' : currentStepIndex >= 6 ? 'INSPECT' : 'NORMAL'}
            scale={0.78}
          />
        </g>
      )}

      {/* Lower Forensic Syslog Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          FIREWALL FORENSIC SYSLOG AUDIT & 5-TUPLE LOG ANALYSIS
        </text>

        {showLog ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            {/* Raw Syslog Box */}
            <rect x="0" y="0" width="668" height="34" rx="4" fill="#0f172a" />
            <text x="12" y="21" fill="#f87171" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              Oct 01 14:00:05 fw01 %ASA-4-106023: Deny tcp src trust:192.168.1.50/49152 dst dmz:10.0.5.100/23 by access-group "Block_Telnet_405"
            </text>

            {/* Field Breakdown Matrix */}
            <g transform="translate(0, 44)">
              {/* Field 1: Source IP */}
              <rect x="0" y="0" width="125" height="38" rx="4" fill={currentStepIndex === 12 ? '#fee2e2' : '#f8fafc'} stroke={currentStepIndex === 12 ? '#ef4444' : '#e2e8f0'} strokeWidth={currentStepIndex === 12 ? 2 : 1} />
              <text x="10" y="14" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">SOURCE IP</text>
              <text x="10" y="28" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">192.168.1.50 {currentStepIndex === 12 && '🔍'}</text>

              {/* Field 2: Dest IP */}
              <rect x="135" y="0" width="125" height="38" rx="4" fill={currentStepIndex === 13 ? '#fee2e2' : '#f8fafc'} stroke={currentStepIndex === 13 ? '#ef4444' : '#e2e8f0'} strokeWidth={currentStepIndex === 13 ? 2 : 1} />
              <text x="10" y="14" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">DESTINATION IP</text>
              <text x="10" y="28" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">10.0.5.100 {currentStepIndex === 13 && '🔍'}</text>

              {/* Field 3: Port / Protocol */}
              <rect x="270" y="0" width="125" height="38" rx="4" fill={currentStepIndex === 14 ? '#fee2e2' : '#f8fafc'} stroke={currentStepIndex === 14 ? '#ef4444' : '#e2e8f0'} strokeWidth={currentStepIndex === 14 ? 2 : 1} />
              <text x="10" y="14" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">PORT / PROTO</text>
              <text x="10" y="28" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">TCP :23 (Telnet) {currentStepIndex === 14 && '🔍'}</text>

              {/* Field 4: Action */}
              <rect x="405" y="0" width="125" height="38" rx="4" fill={currentStepIndex === 15 ? '#fee2e2' : '#f8fafc'} stroke={currentStepIndex === 15 ? '#ef4444' : '#e2e8f0'} strokeWidth={currentStepIndex === 15 ? 2 : 1} />
              <text x="10" y="14" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">ACTION</text>
              <text x="10" y="28" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">DENY / DROP {currentStepIndex === 15 && '✕'}</text>

              {/* Field 5: Rule Match */}
              <rect x="540" y="0" width="128" height="38" rx="4" fill={currentStepIndex === 16 ? '#dcfce7' : '#f8fafc'} stroke={currentStepIndex === 16 ? '#16a34a' : '#e2e8f0'} strokeWidth={currentStepIndex === 16 ? 2 : 1} />
              <text x="10" y="14" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">RULE MATCHED</text>
              <text x="10" y="28" fill="#15803d" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Rule_Telnet_405 {currentStepIndex === 16 && '✓'}</text>
            </g>

            {/* Forensic Takeaway */}
            <g transform="translate(0, 92)">
              <rect x="0" y="0" width="668" height="38" rx="4" fill="#eff6ff" stroke="#93c5fd" />
              <text x="12" y="16" fill="#1e40af" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                FORENSIC TRAIL: TRAFFIC ATTEMPT → SECURITY POLICY BLOCK → AUDIT LOG GENERATED → SIEM INVESTIGATION
              </text>
              <text x="12" y="28" fill="#0f172a" fontSize="7">
                Firewall logs prove non-compliance, isolate unauthorized endpoints, and provide legal audit evidence.
              </text>
            </g>
          </g>
        ) : (
          <g transform="translate(16, 40)">
            <rect x="0" y="0" width="668" height="120" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="14" y="24" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">
              Awaiting Traffic Transmission & Security Policy Drop...
            </text>
            <text x="14" y="48" fill="#0f172a" fontSize="8">
              1. Client sends cleartext Telnet connection attempt on restricted Port 23.
            </text>
            <text x="14" y="68" fill="#0f172a" fontSize="8">
              2. Firewall evaluates policy and halts packet at ingress interface.
            </text>
            <text x="14" y="88" fill="#0f172a" fontSize="8">
              3. Structured CEF / Syslog engine generates real-time telemetry event.
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
