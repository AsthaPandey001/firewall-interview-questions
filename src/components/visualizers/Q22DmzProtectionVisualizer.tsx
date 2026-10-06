import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q22DmzProtectionVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Internet appears
  // Step 1: Firewall appears
  // Step 2: DMZ Zone appears
  // Step 3: Web Server appears in DMZ
  // Step 4: Internal Network Zone appears
  // Step 5: Database appears in Internal Zone
  // Step 6: Network connections drawn
  // Step 7: External Internet Client sends HTTPS Request (203.0.113.45 -> Web VIP 198.51.100.10:443)
  // Step 8: Packet moves: INTERNET -> FIREWALL
  // Step 9: Firewall inspects Inbound Rule: ALLOW WAN -> DMZ Web
  // Step 10: Packet moves: FIREWALL -> WEB SERVER (DMZ)
  // Step 11: Web Server receives request
  // Step 12: Web Server creates backend query (10.0.1.10 -> 10.0.2.100:1433)
  // Step 13: Query moves: WEB SERVER -> INTERNAL FIREWALL BOUNDARY
  // Step 14: Firewall evaluates internal pinhole rule: ALLOW DMZ -> DB (Port 1433 only)
  // Step 15: Query moves: FIREWALL -> DATABASE
  // Step 16: Database processes and replies back to Web Server
  // Step 17: Web Server responds back through Firewall -> External Client (LEGITIMATE FLOW COMPLETE ✓)
  // Step 18: SCENARIO 2 (Malicious Threat): Attacker attempts direct connection to Internal DB (198.51.100.99 -> 10.0.2.100:1433)
  // Step 19: Malicious packet moves: ATTACKER -> FIREWALL
  // Step 20: Firewall checks policy: DIRECT WAN -> INTERNAL DB IS STRICTLY BLOCKED ✕
  // Step 21: Packet halted at Firewall; Database completely untouched (DMZ ISOLATION ENFORCED ✓)

  const showFirewall = currentStepIndex >= 1;
  const showDmzZone = currentStepIndex >= 2;
  const showWebServer = currentStepIndex >= 3;
  const showInternalZone = currentStepIndex >= 4;
  const showDatabase = currentStepIndex >= 5;
  const showCables = currentStepIndex >= 6;

  const isMaliciousPhase = currentStepIndex >= 18;

  // Packet state calculation
  let packetX = 70;
  let packetY = 75;
  let packetTitle = 'HTTPS SYN';
  let packetSrc = '203.0.113.45';
  let packetDst = '198.51.100.10:443';
  let packetProto = 'TCP';
  let packetStatus: 'NORMAL' | 'ALLOW' | 'DENY' | 'INSPECT' = 'NORMAL';

  if (currentStepIndex === 7) {
    packetX = 70;
  } else if (currentStepIndex === 8) {
    packetX = 180;
  } else if (currentStepIndex === 9) {
    packetX = 260;
    packetStatus = 'INSPECT';
  } else if (currentStepIndex === 10) {
    packetX = 350;
    packetStatus = 'ALLOW';
  } else if (currentStepIndex === 11) {
    packetX = 420;
    packetStatus = 'ALLOW';
  } else if (currentStepIndex === 12) {
    packetX = 420;
    packetTitle = 'SQL QUERY';
    packetSrc = '10.0.1.10';
    packetDst = '10.0.2.100:1433';
  } else if (currentStepIndex === 13) {
    packetX = 340;
    packetY = 90;
    packetTitle = 'SQL QUERY';
    packetSrc = '10.0.1.10';
    packetDst = '10.0.2.100:1433';
  } else if (currentStepIndex === 14) {
    packetX = 260;
    packetTitle = 'SQL QUERY';
    packetStatus = 'INSPECT';
  } else if (currentStepIndex === 15) {
    packetX = 550;
    packetY = 90;
    packetTitle = 'SQL QUERY';
    packetStatus = 'ALLOW';
  } else if (currentStepIndex === 16) {
    packetX = 660;
    packetTitle = 'SQL DATA';
    packetStatus = 'ALLOW';
  } else if (currentStepIndex === 17) {
    packetX = 70;
    packetTitle = 'HTTP 200';
    packetStatus = 'ALLOW';
  } else if (currentStepIndex === 18) {
    packetX = 70;
    packetTitle = 'DIRECT EXPLOIT';
    packetSrc = '198.51.100.99';
    packetDst = '10.0.2.100:1433';
    packetStatus = 'DENY';
  } else if (currentStepIndex === 19) {
    packetX = 170;
    packetTitle = 'DIRECT EXPLOIT';
    packetSrc = '198.51.100.99';
    packetDst = '10.0.2.100:1433';
    packetStatus = 'DENY';
  } else if (currentStepIndex >= 20) {
    packetX = 260;
    packetTitle = 'BLOCKED ✕';
    packetSrc = '198.51.100.99';
    packetDst = '10.0.2.100:1433';
    packetStatus = 'DENY';
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Visual DMZ Zone Box */}
      {showDmzZone && (
        <g className="animate-pop-in">
          <rect x="340" y="20" width="160" height="110" rx="8" fill="#fef3c7" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="420" y="34" textAnchor="middle" fill="#b45309" fontSize="8" fontWeight="bold" fontFamily="monospace">
            DMZ BUFFER ZONE (SEC LEVEL 50)
          </text>
        </g>
      )}

      {/* Visual Internal Zone Box */}
      {showInternalZone && (
        <g className="animate-pop-in">
          <rect x="580" y="20" width="160" height="110" rx="8" fill="#dcfce7" fillOpacity="0.4" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="660" y="34" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="bold" fontFamily="monospace">
            INTERNAL LAN ZONE (SEC LEVEL 100)
          </text>
        </g>
      )}

      {/* Connection Cables */}
      {showCables && (
        <>
          <line x1="70" y1="75" x2="260" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="260" y1="75" x2="420" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="420" y1="75" x2="260" y2="105" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="260" y1="105" x2="660" y2="75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 4" />
        </>
      )}

      {/* Moving Arrows */}
      {currentStepIndex === 8 && (
        <BoldArrow x1={100} y1={75} x2={220} y2={75} color="#2563eb" label="WAN INGRESS →" />
      )}
      {currentStepIndex === 10 && (
        <BoldArrow x1={290} y1={75} x2={385} y2={75} color="#10b981" label="TO DMZ →" />
      )}
      {currentStepIndex === 13 && (
        <BoldArrow x1={385} y1={75} x2={290} y2={105} color="#f59e0b" label="PINHOLE REQ" />
      )}
      {currentStepIndex === 15 && (
        <BoldArrow x1={290} y1={105} x2={625} y2={75} color="#10b981" label="TO INTERNAL DB →" />
      )}
      {currentStepIndex === 19 && (
        <BoldArrow x1={100} y1={75} x2={220} y2={75} color="#ef4444" label="ATTACK PROBE →" />
      )}

      {/* Nodes */}
      {/* Node 1: Internet */}
      <g>
        <circle cx={70} cy={75} r={26} fill={isMaliciousPhase ? '#fee2e2' : '#eff6ff'} stroke={isMaliciousPhase ? '#ef4444' : '#3b82f6'} strokeWidth="2" />
        <text x={70} y={72} textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
          {isMaliciousPhase ? 'ATTACKER' : 'INTERNET'}
        </text>
        <text x={70} y={83} textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">
          {isMaliciousPhase ? '198.51.100.99' : 'WAN: Sec 0'}
        </text>
      </g>

      {/* Node 2: Perimeter Firewall */}
      {showFirewall && (
        <FirewallGatewayNode
          cx={260}
          cy={75}
          label="EDGE FIREWALL"
          sub={currentStepIndex >= 20 ? 'DROPPED ✕' : currentStepIndex >= 9 ? 'INSPECTING' : 'Zone Gateway'}
          active={currentStepIndex >= 8 && currentStepIndex <= 21}
          success={currentStepIndex >= 10 && !isMaliciousPhase}
        />
      )}

      {/* Node 3: Web Server in DMZ */}
      {showWebServer && (
        <ServerNodeSVG
          cx={420}
          cy={75}
          label="DMZ WEB SERVER"
          sub="10.0.1.10:443"
          active={currentStepIndex >= 10 && currentStepIndex <= 17}
          success={currentStepIndex >= 11 && currentStepIndex <= 17}
          statusText={currentStepIndex >= 11 && currentStepIndex <= 17 ? 'ACTIVE ✓' : 'STANDBY'}
        />
      )}

      {/* Node 4: Database in Internal Zone */}
      {showDatabase && (
        <ServerNodeSVG
          cx={660}
          cy={75}
          label="INTERNAL DATABASE"
          sub="10.0.2.100:1433"
          active={currentStepIndex >= 15 && currentStepIndex <= 16}
          success={currentStepIndex >= 16 && currentStepIndex <= 17}
          statusText={currentStepIndex >= 20 ? 'PROTECTED ✓' : currentStepIndex >= 16 ? 'QUERIED ✓' : 'ISOLATED'}
        />
      )}

      {/* Packet Card */}
      {currentStepIndex >= 7 && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={26}
            title={packetTitle}
            protocol={packetProto}
            port={packetDst.split(':')[1] || '443'}
            src={packetSrc}
            dst={packetDst}
            status={packetStatus}
            scale={0.75}
          />
        </g>
      )}

      {/* Lower Technical Deep-Dive Panel */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="185" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {isMaliciousPhase
            ? 'DMZ SECURITY POLICY: DIRECT INTERNET → INTERNAL DATABASE STRICTLY FORBIDDEN'
            : currentStepIndex >= 12 && currentStepIndex <= 17
            ? 'DMZ TO INTERNAL PINHOLE: WEB SERVER AUTHORIZED TO QUERY BACKEND SQL DATABASE'
            : 'DEMILITARIZED ZONE (DMZ) PERIMETER SEGMENTATION & ACCESS CONTROL'}
        </text>

        {isMaliciousPhase ? (
          <g transform="translate(16, 36)" className="animate-pop-in">
            <rect x="0" y="0" width="668" height="130" rx="6" fill="#fef2f2" stroke="#f87171" strokeWidth="1.5" />
            <text x="14" y="20" fill="#991b1b" fontSize="9" fontWeight="bold" fontFamily="monospace">
              SECURITY ENFORCEMENT: DIRECT WAN-TO-INTERNAL ACCESS BLOCKED
            </text>
            <text x="14" y="42" fill="#0f172a" fontSize="8">
              1. Attacker (198.51.100.99) attempted direct connection to Internal DB (10.0.2.100:1433).
            </text>
            <text x="14" y="60" fill="#0f172a" fontSize="8">
              2. Perimeter Firewall checks zone boundary rules: WAN (Sec 0) → Internal (Sec 100) Direct Routing = NO ROUTE / IMPLICIT DENY.
            </text>
            <text x="14" y="78" fill="#dc2626" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              3. PACKET DROPPED AT EDGE FIREWALL ✕ (Database server receives 0 packets and remains completely untouched).
            </text>
            <text x="14" y="105" fill="#15803d" fontSize="8" fontWeight="bold">
              CORE PRINCIPLE: Public-facing services sit in the DMZ. Internal databases never accept connections from the Internet.
            </text>
          </g>
        ) : (
          <g transform="translate(16, 36)">
            <rect x="0" y="0" width="325" height="130" rx="6" fill="#fffbeb" stroke="#fcd34d" />
            <text x="12" y="18" fill="#b45309" fontSize="9" fontWeight="bold" fontFamily="monospace">
              DMZ ZONE RULES (Buffer Zone)
            </text>
            <text x="12" y="36" fill="#0f172a" fontSize="7.5">1. Internet → DMZ: ALLOW strictly public ports (80/443).</text>
            <text x="12" y="52" fill="#0f172a" fontSize="7.5">2. DMZ → Internet: ALLOW for return traffic & updates.</text>
            <text x="12" y="68" fill="#0f172a" fontSize="7.5">3. DMZ → Internal: DENY by default (Only specific pinholes allowed).</text>
            <text x="12" y="84" fill="#0f172a" fontSize="7.5">4. Internet → Internal: STRICTLY FORBIDDEN (No direct path).</text>
            <text x="12" y="105" fill="#b45309" fontSize="7.5" fontWeight="bold">Protects corporate assets even if web server is breached.</text>

            <rect x="345" y="0" width="325" height="130" rx="6" fill="#f0fdf4" stroke="#86efac" />
            <text x="357" y="18" fill="#15803d" fontSize="9" fontWeight="bold" fontFamily="monospace">
              MULTI-TIER DEFENSE-IN-DEPTH
            </text>
            <text x="357" y="36" fill="#0f172a" fontSize="7.5">1. Tier 1 (Presentation): Public Web Servers reside in DMZ.</text>
            <text x="357" y="52" fill="#0f172a" fontSize="7.5">2. Tier 2 (Application/DB): Database servers reside in Internal LAN.</text>
            <text x="357" y="68" fill="#0f172a" fontSize="7.5">3. Web server queries DB on restricted port 1433 via firewall.</text>
            <text x="357" y="84" fill="#0f172a" fontSize="7.5">4. Isolation ensures an exploited web server cannot sniff DB traffic.</text>
            <text x="357" y="105" fill="#15803d" fontSize="7.5" fontWeight="bold">Enterprise standard for e-commerce and banking apps.</text>
          </g>
        )}
      </g>
    </svg>
  );
};
