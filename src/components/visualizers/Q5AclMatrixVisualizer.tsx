import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q5AclMatrixVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Initial resting setup (NO ARROWS)
  // Step 1: Packet arrives at firewall (Ingress Arrow appears)
  // Step 2: Firewall points to ACL rule table
  // Step 3: Rule 1 highlighted
  // Step 4: Check Source IP (10.0.0.25 in 10.0.0.0/24 -> MATCH ✓)
  // Step 5: Check Dest IP (203.0.113.50 -> MATCH ✓)
  // Step 6: Check Protocol (TCP -> MATCH ✓)
  // Step 7: Check Port (443 -> MATCH ✓)
  // Step 8: ALL MATCH FOUND -> Action ALLOW
  // Step 9: Packet delivered to server (Forwarded Arrow appears)

  const isDelivered = currentStepIndex >= 9;
  const isRule1Active = currentStepIndex >= 3;
  const checkSrc = currentStepIndex >= 4;
  const checkDst = currentStepIndex >= 5;
  const checkProto = currentStepIndex >= 6;
  const checkPort = currentStepIndex >= 7;
  const isAllMatch = currentStepIndex >= 8;

  let packetX = 90;
  if (currentStepIndex === 0) packetX = 90;
  else if (currentStepIndex >= 1 && currentStepIndex <= 8) packetX = 370;
  else if (currentStepIndex >= 9) packetX = 650;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Line */}
      <line x1="90" y1="90" x2="650" y2="90" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="4 4" />

      {/* Top Connection Arrows - ONLY when currentStepIndex >= 1 */}
      {currentStepIndex >= 1 && (
        <BoldArrow x1={135} y1={90} x2={325} y2={90} color="#2563eb" label="INGRESS" />
      )}
      {isDelivered && (
        <BoldArrow x1={415} y1={90} x2={605} y2={90} color="#10b981" label="FORWARDED ✓" />
      )}

      {/* Devices */}
      <LaptopNode cx={90} cy={90} label="CLIENT" ip="10.0.0.25" active />
      <FirewallGatewayNode cx={370} cy={90} label="FIREWALL" sub="ACL Engine" active success={isAllMatch} />
      <ServerNodeSVG cx={650} cy={90} label="SERVER" sub="203.0.113.50:443" active success={isDelivered} />

      {/* Packet Card (Y=38, floating safely above device nodes) */}
      {currentStepIndex >= 1 && (
        <PacketCard
          cx={packetX}
          cy={38}
          title="PACKET 5-TUPLE"
          protocol="TCP"
          port="443"
          src="10.0.0.25"
          dst="SERVER"
          status={isAllMatch ? 'ALLOW' : 'INSPECT'}
          scale={0.82}
        />
      )}

      {/* Lower Section: ACL Sequential Evaluation Table */}
      <g transform="translate(30, 150)">
        <rect x="0" y="0" width="700" height="175" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
          ACCESS CONTROL LIST (ACL) FIELD-BY-FIELD EVALUATION
        </text>
        <line x1="0" y1="26" x2="700" y2="26" stroke="#e2e8f0" strokeWidth="1" />

        {/* Table Column Headers */}
        <g transform="translate(16, 44)">
          <text x="0" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">RULE</text>
          <text x="45" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">ACTION</text>
          <text x="110" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">SOURCE IP</text>
          <text x="235" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">DESTINATION</text>
          <text x="360" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">PROTOCOL</text>
          <text x="455" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">PORT</text>
          <text x="545" y="0" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">RESULT</text>
        </g>

        {/* RULE 1: ALLOW 10.0.0.0/24 -> SERVER TCP 443 */}
        <g transform="translate(16, 54)">
          <rect
            x="-4"
            y="0"
            width="676"
            height="34"
            rx="6"
            fill={isAllMatch ? '#ecfdf5' : isRule1Active ? '#eff6ff' : '#f8fafc'}
            stroke={isAllMatch ? '#10b981' : isRule1Active ? '#3b82f6' : '#e2e8f0'}
            strokeWidth={isRule1Active ? 1.5 : 1}
          />
          <text x="4" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">1</text>
          <text x="45" y="21" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>

          {/* Field 1: Source IP */}
          <rect x="105" y="5" width="115" height="24" rx="4" fill={checkSrc ? '#dcfce7' : '#ffffff'} stroke={checkSrc ? '#22c55e' : '#cbd5e1'} />
          <text x="162" y="21" textAnchor="middle" fill={checkSrc ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            10.0.0.0/24 {checkSrc && '✓'}
          </text>

          {/* Field 2: Dest IP */}
          <rect x="230" y="5" width="115" height="24" rx="4" fill={checkDst ? '#dcfce7' : '#ffffff'} stroke={checkDst ? '#22c55e' : '#cbd5e1'} />
          <text x="287" y="21" textAnchor="middle" fill={checkDst ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            203.0.113.50 {checkDst && '✓'}
          </text>

          {/* Field 3: Protocol */}
          <rect x="355" y="5" width="85" height="24" rx="4" fill={checkProto ? '#dcfce7' : '#ffffff'} stroke={checkProto ? '#22c55e' : '#cbd5e1'} />
          <text x="397" y="21" textAnchor="middle" fill={checkProto ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            TCP {checkProto && '✓'}
          </text>

          {/* Field 4: Port */}
          <rect x="450" y="5" width="80" height="24" rx="4" fill={checkPort ? '#dcfce7' : '#ffffff'} stroke={checkPort ? '#22c55e' : '#cbd5e1'} />
          <text x="490" y="21" textAnchor="middle" fill={checkPort ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            :443 {checkPort && '✓'}
          </text>

          {/* Result Column */}
          <text x="545" y="21" fill={isAllMatch ? '#059669' : '#2563eb'} fontSize="8" fontWeight="bold" fontFamily="monospace">
            {isAllMatch ? 'MATCH: ALLOW ✓' : isRule1Active ? 'TESTING...' : 'PENDING'}
          </text>
        </g>

        {/* RULE 2: DENY ANY -> SERVER TCP 443 */}
        <g transform="translate(16, 94)">
          <rect x="-4" y="0" width="676" height="24" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="4" y="16" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">2</text>
          <text x="45" y="16" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">DENY</text>
          <text x="110" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">ANY</text>
          <text x="235" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">203.0.113.50</text>
          <text x="360" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">TCP</text>
          <text x="455" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">:443</text>
          <text x="545" y="16" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{isAllMatch ? 'SKIPPED (First Match)' : 'PENDING'}</text>
        </g>

        {/* RULE 3: ALLOW ANY -> SERVER TCP 80 */}
        <g transform="translate(16, 124)">
          <rect x="-4" y="0" width="676" height="24" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="4" y="16" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">3</text>
          <text x="45" y="16" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">ALLOW</text>
          <text x="110" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">ANY</text>
          <text x="235" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">203.0.113.50</text>
          <text x="360" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">TCP</text>
          <text x="455" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">:80</text>
          <text x="545" y="16" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{isAllMatch ? 'SKIPPED' : 'PENDING'}</text>
        </g>
      </g>
    </svg>
  );
};
