import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q6DecisionFlowchartVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Initial resting setup (NO ARROWS)
  // Step 1: Packet travels (Transit Arrow appears)
  // Step 2: Packet reaches firewall
  // Step 3: Firewall extracts 5-tuple
  // Step 4: Rule 1 evaluation begins
  // Step 5: Source match
  // Step 6: Dest match
  // Step 7: Protocol match
  // Step 8: Port match
  // Step 9: Full rule match confirmed
  // Step 10: Action appears: ALLOW
  // Step 11: Packet moves to destination (Forwarded Arrow appears)

  const isDelivered = currentStepIndex >= 11;
  const isAtFw = currentStepIndex >= 2;
  const isExtracted = currentStepIndex >= 3;
  const isRule1 = currentStepIndex >= 4;
  const isSrcMatch = currentStepIndex >= 5;
  const isDstMatch = currentStepIndex >= 6;
  const isProtoMatch = currentStepIndex >= 7;
  const isPortMatch = currentStepIndex >= 8;
  const isRuleMatch = currentStepIndex >= 9;
  const isActionAllow = currentStepIndex >= 10;

  let packetX = 90;
  if (currentStepIndex === 0) packetX = 90;
  else if (currentStepIndex === 1) packetX = 230;
  else if (currentStepIndex >= 2 && currentStepIndex <= 10) packetX = 370;
  else if (currentStepIndex >= 11) packetX = 650;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="90" y1="85" x2="650" y2="85" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="4 4" />

      {/* Top Connection Arrows - ONLY when currentStepIndex >= 1 */}
      {currentStepIndex >= 1 && (
        <BoldArrow x1={135} y1={85} x2={325} y2={85} color="#2563eb" label="TRANSIT" />
      )}
      {isDelivered && (
        <BoldArrow x1={415} y1={85} x2={605} y2={85} color="#10b981" label="DELIVERED ✓" />
      )}

      {/* Devices */}
      <LaptopNode cx={90} cy={85} label="CLIENT" ip="10.0.0.25" active />
      <FirewallGatewayNode cx={370} cy={85} label="FIREWALL" sub="Decision Engine" active={isAtFw} success={isActionAllow} />
      <ServerNodeSVG cx={650} cy={85} label="SERVER" sub="203.0.113.50:443" active success={isDelivered} />

      {/* Packet Card (floats at Y=38) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={packetX}
          cy={38}
          title="PACKET"
          protocol="TCP"
          port="443"
          src="10.0.0.25"
          dst="SERVER"
          status={isActionAllow ? 'ALLOW' : isAtFw ? 'INSPECT' : 'NORMAL'}
          scale={0.8}
        />
      )}

      {/* Complete Decision Flowchart Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          COMPLETE DETERMINISTIC PACKET-DECISION FLOWCHART
        </text>

        {/* 6 Step Boxes in Decision Pipeline */}
        <g transform="translate(14, 36)">
          {[
            { stepNum: '1', title: 'Header Extraction', desc: 'Src/Dst IP, Port, Proto', active: isExtracted, done: isRule1 },
            { stepNum: '2', title: 'Top-Down Rule 1', desc: 'ALLOW 10.0.0.0/24 :443', active: isRule1, done: isSrcMatch },
            { stepNum: '3', title: 'Field Evaluation', desc: 'Src✓ Dst✓ Proto✓ Port✓', active: isSrcMatch, done: isRuleMatch },
            { stepNum: '4', title: 'First Match Stop', desc: 'Rule 1 Criteria Met', active: isRuleMatch, done: isActionAllow },
            { stepNum: '5', title: 'Action Execution', desc: 'ALLOW Action Triggered', active: isActionAllow, done: isDelivered },
            { stepNum: '6', title: 'Forward / Egress', desc: 'Packet Egress to Server', active: isDelivered, done: isDelivered },
          ].map((box, idx) => (
            <g key={box.stepNum} transform={`translate(${idx * 112}, 0)`}>
              <rect
                x="0"
                y="0"
                width="106"
                height="60"
                rx="6"
                fill={box.done ? '#ecfdf5' : box.active ? '#eff6ff' : '#f8fafc'}
                stroke={box.done ? '#10b981' : box.active ? '#3b82f6' : '#cbd5e1'}
                strokeWidth={box.active || box.done ? 2 : 1}
              />
              <rect x="0" y="0" width="106" height="15" rx="5" fill={box.done ? '#10b981' : box.active ? '#3b82f6' : '#cbd5e1'} />
              <text x="53" y="11" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                STEP {box.stepNum}
              </text>
              <text x="53" y="30" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                {box.title}
              </text>
              <text x="53" y="46" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace">
                {box.desc}
              </text>
            </g>
          ))}
        </g>

        {/* Live Field Check Indicators Strip */}
        <g transform="translate(14, 110)">
          <rect x="0" y="0" width="672" height="68" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="12" y="16" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
            CRITERIA MATCH STATUS:
          </text>

          <g transform="translate(12, 26)">
            {[
              { name: '1. SOURCE IP', val: '10.0.0.25 ∈ 10.0.0.0/24', isMatched: isSrcMatch },
              { name: '2. DESTINATION', val: '203.0.113.50', isMatched: isDstMatch },
              { name: '3. PROTOCOL', val: 'TCP', isMatched: isProtoMatch },
              { name: '4. PORT', val: '443 (HTTPS)', isMatched: isPortMatch },
            ].map((field, i) => (
              <g key={field.name} transform={`translate(${i * 162}, 0)`}>
                <rect
                  x="0"
                  y="0"
                  width="154"
                  height="30"
                  rx="4"
                  fill={field.isMatched ? '#dcfce7' : '#ffffff'}
                  stroke={field.isMatched ? '#22c55e' : '#cbd5e1'}
                />
                <text x="8" y="11" fill="#64748b" fontSize="7" fontWeight="bold">{field.name}</text>
                <text x="8" y="23" fill={field.isMatched ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                  {field.val} {field.isMatched && '✓'}
                </text>
              </g>
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
};
