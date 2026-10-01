import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q6DecisionFlowchartVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: ALLOWED PACKET (Steps 0 - 12)
  // Step 0: Client only
  // Step 1: Firewall appears
  // Step 2: Server appears
  // Step 3: Permitted Packet created (Port 443 TCP)
  // Step 4: Packet moves: Client -> Firewall
  // Step 5: Firewall receives & buffers
  // Step 6: 5-tuple extracted
  // Step 7: Rules loaded
  // Step 8: Field-by-field check (Src, Dst, Proto, Port)
  // Step 9: Rule 1 MATCH confirmed
  // Step 10: Action ALLOW executed
  // Step 11: Packet moves: Firewall -> Server
  // Step 12: Server receives packet (Scenario 1 Complete)

  // Scenario 2: DENIED PACKET (Steps 13 - 17)
  // Step 13: Unauthorized packet created (Port 22 SSH)
  // Step 14: Packet moves: Client -> Firewall
  // Step 15: Firewall inspects: No rule matches -> Default Deny
  // Step 16: FIREWALL BLOCKS PACKET. Packet visibly stops at Firewall (Blocked badge appears)
  // Step 17: Final state: Server remains in WAITING / NO PACKET RECEIVED

  const isScenario2 = currentStepIndex >= 13;

  // Topology node visibility
  const showClient = true;
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  // Scenario 1 flags
  const showPkt1 = currentStepIndex >= 3 && currentStepIndex <= 12;
  const isMovingToFw1 = currentStepIndex === 4;
  const isAtFw1 = currentStepIndex >= 5 && currentStepIndex <= 10;
  const isExtracted1 = currentStepIndex >= 6;
  const showRules1 = currentStepIndex >= 7;
  const checkFields1 = currentStepIndex >= 8;
  const isMatch1 = currentStepIndex >= 9;
  const isAllow1 = currentStepIndex >= 10;
  const isMovingToServer1 = currentStepIndex === 11;
  const isDelivered1 = currentStepIndex === 12;

  // Scenario 2 flags
  const showPkt2 = currentStepIndex >= 13;
  const isMovingToFw2 = currentStepIndex === 14;
  const isAtFw2 = currentStepIndex >= 15;
  const isDeny2 = currentStepIndex >= 15;
  const isBlocked2 = currentStepIndex >= 16;
  const isFinalBlocked2 = currentStepIndex >= 17;

  // Packet coordinates
  let packetX = 90;
  let packetY = 36;
  if (!isScenario2) {
    if (currentStepIndex === 3) packetX = 90;
    else if (isMovingToFw1) packetX = 230;
    else if (isAtFw1) packetX = 370;
    else if (isMovingToServer1) packetX = 510;
    else if (isDelivered1) packetX = 650;
  } else {
    if (currentStepIndex === 13) packetX = 90;
    else if (isMovingToFw2) packetX = 230;
    else if (isAtFw2) packetX = 370; // STOPS AT FIREWALL AND NEVER MOVES TO SERVER!
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Links */}
      {showFw && (
        <line x1="90" y1="85" x2="370" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}
      {showServer && (
        <line x1="370" y1="85" x2="650" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Connection Arrows during movement */}
      {isMovingToFw1 && (
        <BoldArrow x1={135} y1={85} x2={325} y2={85} color="#2563eb" label="HTTPS SYN →" />
      )}
      {isMovingToServer1 && (
        <BoldArrow x1={415} y1={85} x2={605} y2={85} color="#10b981" label="FORWARDED →" />
      )}
      {isDelivered1 && (
        <BoldArrow x1={415} y1={85} x2={605} y2={85} color="#10b981" label="DELIVERED ✓" />
      )}

      {isMovingToFw2 && (
        <BoldArrow x1={135} y1={85} x2={325} y2={85} color="#dc2626" label="SSH (UNAUTHORIZED) →" />
      )}

      {/* Blocked Barrier Marker at Egress when Denied */}
      {isBlocked2 && (
        <g transform="translate(415, 85)" className="animate-pop-in">
          <line x1="0" y1="-25" x2="0" y2="25" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <circle cx="0" cy="0" r="14" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">✕</text>
          <text x="0" y="38" textAnchor="middle" fill="#dc2626" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            BLOCKED
          </text>
        </g>
      )}

      {/* Device Nodes */}
      {showClient && (
        <g className="animate-pop-in">
          <LaptopNode 
            cx={90} 
            cy={85} 
            label="CLIENT" 
            ip="10.0.0.25" 
            active={!isScenario2 ? currentStepIndex <= 4 : currentStepIndex <= 14} 
            statusText={isScenario2 ? 'TEST 2: SSH' : 'TEST 1: HTTPS'}
          />
        </g>
      )}

      {showFw && (
        <g className="animate-pop-in">
          <FirewallGatewayNode 
            cx={370} 
            cy={85} 
            label="FIREWALL" 
            sub={isBlocked2 ? 'BLOCKED ✕' : isAtFw1 || isAtFw2 ? 'DECISION ENGINE' : 'Policy Engine'} 
            active={isAtFw1 || isAtFw2} 
            success={isAllow1} 
            isDanger={isBlocked2}
          />
        </g>
      )}

      {showServer && (
        <g className="animate-pop-in">
          <ServerNodeSVG 
            cx={650} 
            cy={85} 
            label="SERVER" 
            sub="203.0.113.50" 
            active={isDelivered1} 
            success={isDelivered1} 
            statusText={isDelivered1 ? 'RECEIVED ✓' : isFinalBlocked2 ? 'NO PACKET RECEIVED' : 'WAITING...'}
          />
        </g>
      )}

      {/* Scenario 1 Packet Card */}
      {showPkt1 && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={packetY}
            title={isDelivered1 ? 'DELIVERED' : isAllow1 ? 'PERMITTED' : 'TCP SYN'}
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="203.0.113.50"
            status={isAllow1 ? 'ALLOW' : isAtFw1 ? 'INSPECT' : 'NORMAL'}
            scale={0.8}
          />
        </g>
      )}

      {/* Scenario 2 Packet Card (SSH Blocked) */}
      {showPkt2 && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={packetY}
            title={isBlocked2 ? 'BLOCKED PACKET' : 'SSH ATTEMPT'}
            protocol="TCP"
            port="22"
            src="10.0.0.25"
            dst="203.0.113.50"
            status={isBlocked2 ? 'DROP' : 'INSPECT'}
            scale={0.8}
          />
        </g>
      )}

      {/* Lower Section: Decision Pipeline / Flowchart */}
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="700" height="180" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        
        {/* Dynamic Header */}
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          {!isScenario2 
            ? 'SCENARIO 1 OF 2: PERMITTED PACKET DECISION FLOW (TCP :443 HTTPS)' 
            : 'SCENARIO 2 OF 2: UNAUTHORIZED PACKET BLOCKED (TCP :22 SSH → DEFAULT DENY)'}
        </text>

        {!isScenario2 ? (
          /* SCENARIO 1 PIPELINE */
          <g transform="translate(14, 38)">
            {/* 6 Step Boxes in Decision Pipeline */}
            {[
              { num: '1', title: 'Header Extraction', desc: 'Src/Dst, Port, Proto', active: isExtracted1, done: showRules1 },
              { num: '2', title: 'Top-Down Rule 1', desc: 'ALLOW 10.0.0.0/24 :443', active: showRules1, done: checkFields1 },
              { num: '3', title: 'Field Evaluation', desc: 'Src✓ Dst✓ Proto✓ Port✓', active: checkFields1, done: isMatch1 },
              { num: '4', title: 'First Match Stop', desc: 'Rule 1 Satisfied', active: isMatch1, done: isAllow1 },
              { num: '5', title: 'ALLOW Action', desc: 'Open Egress Gate', active: isAllow1, done: isDelivered1 },
              { num: '6', title: 'Forward / Egress', desc: 'Delivered to Server', active: isDelivered1, done: isDelivered1 },
            ].map((box, idx) => (
              <g key={box.num} transform={`translate(${idx * 112}, 0)`}>
                <rect
                  x="0"
                  y="0"
                  width="106"
                  height="54"
                  rx="6"
                  fill={box.done ? '#ecfdf5' : box.active ? '#eff6ff' : '#f8fafc'}
                  stroke={box.done ? '#10b981' : box.active ? '#3b82f6' : '#cbd5e1'}
                  strokeWidth={box.active || box.done ? 2 : 1}
                />
                <rect x="0" y="0" width="106" height="14" rx="5" fill={box.done ? '#10b981' : box.active ? '#3b82f6' : '#cbd5e1'} />
                <text x="53" y="10" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                  STEP {box.num}
                </text>
                <text x="53" y="27" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                  {box.title}
                </text>
                <text x="53" y="42" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">
                  {box.desc}
                </text>
              </g>
            ))}

            {/* Criteria Check Bar */}
            <g transform="translate(0, 64)">
              <rect x="0" y="0" width="672" height="60" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
              <text x="12" y="15" fill="#334155" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                SCENARIO 1 EVALUATION:
              </text>
              <g transform="translate(12, 22)">
                {[
                  { name: '1. SOURCE IP', val: '10.0.0.25 ∈ 10.0.0.0/24', ok: checkFields1 },
                  { name: '2. DESTINATION', val: '203.0.113.50', ok: checkFields1 },
                  { name: '3. PROTOCOL', val: 'TCP', ok: checkFields1 },
                  { name: '4. PORT', val: ':443 (HTTPS)', ok: checkFields1 },
                ].map((field, i) => (
                  <g key={field.name} transform={`translate(${i * 162}, 0)`}>
                    <rect
                      x="0"
                      y="0"
                      width="154"
                      height="26"
                      rx="4"
                      fill={field.ok ? '#dcfce7' : '#ffffff'}
                      stroke={field.ok ? '#22c55e' : '#cbd5e1'}
                    />
                    <text x="6" y="10" fill="#64748b" fontSize="6.5" fontWeight="bold">{field.name}</text>
                    <text x="6" y="20" fill={field.ok ? '#15803d' : '#0f172a'} fontSize="7" fontWeight="bold" fontFamily="monospace">
                      {field.val} {field.ok && '✓'}
                    </text>
                  </g>
                ))}
              </g>
            </g>
          </g>
        ) : (
          /* SCENARIO 2 PIPELINE (DENIED PACKET) */
          <g transform="translate(14, 38)">
            {[
              { num: '1', title: 'Port 22 Ingress', desc: 'SSH Packet at FW', active: isAtFw2, done: isDeny2, danger: false },
              { num: '2', title: 'Rule 1 Check', desc: 'ALLOW :443 (NO MATCH)', active: isDeny2, done: isDeny2, danger: false },
              { num: '3', title: 'Rule 2 Check', desc: 'ALLOW :80 (NO MATCH)', active: isDeny2, done: isDeny2, danger: false },
              { num: '4', title: 'Implicit Deny', desc: 'Default Fallback Rule', active: isDeny2, done: isBlocked2, danger: true },
              { num: '5', title: 'DROP Action', desc: 'Packet Blocked at FW', active: isBlocked2, done: isBlocked2, danger: true },
              { num: '6', title: 'Server Isolated', desc: 'No Traffic Received', active: isFinalBlocked2, done: isFinalBlocked2, danger: true },
            ].map((box, idx) => (
              <g key={box.num} transform={`translate(${idx * 112}, 0)`}>
                <rect
                  x="0"
                  y="0"
                  width="106"
                  height="54"
                  rx="6"
                  fill={box.danger && (box.active || box.done) ? '#fef2f2' : box.done ? '#ecfdf5' : box.active ? '#eff6ff' : '#f8fafc'}
                  stroke={box.danger && (box.active || box.done) ? '#ef4444' : box.done ? '#10b981' : box.active ? '#3b82f6' : '#cbd5e1'}
                  strokeWidth={box.active || box.done ? 2 : 1}
                />
                <rect 
                  x="0" 
                  y="0" 
                  width="106" 
                  height="14" 
                  rx="5" 
                  fill={box.danger && (box.active || box.done) ? '#ef4444' : box.done ? '#10b981' : box.active ? '#3b82f6' : '#cbd5e1'} 
                />
                <text x="53" y="10" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                  STEP {box.num}
                </text>
                <text x="53" y="27" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                  {box.title}
                </text>
                <text x="53" y="42" textAnchor="middle" fill={box.danger ? '#dc2626' : '#64748b'} fontSize="6.5" fontFamily="monospace">
                  {box.desc}
                </text>
              </g>
            ))}

            {/* Deny Explanation Box */}
            <g transform="translate(0, 64)">
              <rect x="0" y="0" width="672" height="60" rx="6" fill="#fef2f2" stroke="#fca5a5" />
              <text x="12" y="15" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                ✕ VERDICT: PACKET BLOCKED & DROPPED AT FIREWALL
              </text>
              <text x="12" y="32" fill="#7f1d1d" fontSize="7.5">
                • Reason: Port 22 failed all explicit permit statements and hit the default Implicit Deny rule.
              </text>
              <text x="12" y="46" fill="#7f1d1d" fontSize="7.5">
                • Security Outcome: Packet remains halted at firewall boundary; Destination Server received zero unauthorized traffic.
              </text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};
