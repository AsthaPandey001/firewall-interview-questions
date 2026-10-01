import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q5AclMatrixVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Only CLIENT / LAPTOP visible
  // Step 1: Firewall appears & cable connected
  // Step 2: Server appears & cable connected
  // Step 3: Packet created at client
  // Step 4: Packet physically moves: CLIENT -> FIREWALL
  // Step 5: Packet arrives at firewall (Held/Inspecting)
  // Step 6: ACL Rule Table appears
  // Step 7: Field-by-field criteria check (Src, Dst, Proto, Port)
  // Step 8: Rule 1 MATCH confirmed
  // Step 9: Action ALLOW executed
  // Step 10: Packet physically moves: FIREWALL -> SERVER
  // Step 11: Server receives packet (Delivered / Accepted)

  const showClient = true;
  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;
  const showPacket = currentStepIndex >= 3;
  const isMovingToFw = currentStepIndex === 4;
  const isAtFw = currentStepIndex >= 5 && currentStepIndex <= 9;
  const showAclTable = currentStepIndex >= 6;
  const checkFields = currentStepIndex >= 7;
  const isRule1Matched = currentStepIndex >= 8;
  const isActionAllow = currentStepIndex >= 9;
  const isMovingToServer = currentStepIndex === 10;
  const isDelivered = currentStepIndex >= 11;

  // Packet coordinates
  let packetX = 90;
  if (currentStepIndex <= 3) {
    packetX = 90;
  } else if (isMovingToFw) {
    packetX = 230;
  } else if (isAtFw) {
    packetX = 370;
  } else if (isMovingToServer) {
    packetX = 510;
  } else if (isDelivered) {
    packetX = 650;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Network Baseline Links (revealed progressively) */}
      {showFw && (
        <line x1="90" y1="85" x2="370" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}
      {showServer && (
        <line x1="370" y1="85" x2="650" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 4" />
      )}

      {/* Top Connection Arrows during movement */}
      {isMovingToFw && (
        <BoldArrow x1={135} y1={85} x2={325} y2={85} color="#2563eb" label="TRANSMITTING →" />
      )}
      {isMovingToServer && (
        <BoldArrow x1={415} y1={85} x2={605} y2={85} color="#10b981" label="FORWARDING →" />
      )}
      {isDelivered && (
        <BoldArrow x1={415} y1={85} x2={605} y2={85} color="#10b981" label="DELIVERED ✓" />
      )}

      {/* Progressive Device Nodes */}
      {showClient && (
        <g className="animate-pop-in">
          <LaptopNode 
            cx={90} 
            cy={85} 
            label="CLIENT" 
            ip="10.0.0.25" 
            active={currentStepIndex <= 4} 
            statusText={currentStepIndex === 0 ? 'READY' : undefined}
          />
        </g>
      )}

      {showFw && (
        <g className="animate-pop-in">
          <FirewallGatewayNode 
            cx={370} 
            cy={85} 
            label="FIREWALL" 
            sub={isAtFw ? 'INSPECTING' : 'ACL Engine'} 
            active={isAtFw} 
            success={isActionAllow} 
          />
        </g>
      )}

      {showServer && (
        <g className="animate-pop-in">
          <ServerNodeSVG 
            cx={650} 
            cy={85} 
            label="SERVER" 
            sub="203.0.113.50:443" 
            active={isDelivered} 
            success={isDelivered} 
            statusText={isDelivered ? 'ACCEPTED ✓' : 'WAITING...'}
          />
        </g>
      )}

      {/* Physical Packet Card */}
      {showPacket && (
        <g className="animate-pop-in transition-all duration-500">
          <PacketCard
            cx={packetX}
            cy={36}
            title={isDelivered ? 'DELIVERED' : isActionAllow ? 'PERMITTED' : 'TCP SYN'}
            protocol="TCP"
            port="443"
            src="10.0.0.25"
            dst="203.0.113.50"
            status={isActionAllow ? 'ALLOW' : isAtFw ? 'INSPECT' : 'NORMAL'}
            scale={0.82}
          />
        </g>
      )}

      {/* Lower Section: ACL Sequential Evaluation Table (Revealed at Step 6+) */}
      {showAclTable ? (
        <g transform="translate(30, 145)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="180" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
          <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            ACCESS CONTROL LIST (ACL) FIELD-BY-FIELD EVALUATION MATRIX
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
              fill={isRule1Matched ? '#ecfdf5' : '#eff6ff'}
              stroke={isRule1Matched ? '#10b981' : '#3b82f6'}
              strokeWidth={1.5}
            />
            <text x="4" y="21" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">1</text>
            <text x="45" y="21" fill="#059669" fontSize="8.5" fontWeight="bold" fontFamily="monospace">ALLOW</text>

            {/* Field 1: Source IP */}
            <rect x="105" y="5" width="115" height="24" rx="4" fill={checkFields ? '#dcfce7' : '#ffffff'} stroke={checkFields ? '#22c55e' : '#cbd5e1'} />
            <text x="162" y="21" textAnchor="middle" fill={checkFields ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              10.0.0.0/24 {checkFields && '✓'}
            </text>

            {/* Field 2: Dest IP */}
            <rect x="230" y="5" width="115" height="24" rx="4" fill={checkFields ? '#dcfce7' : '#ffffff'} stroke={checkFields ? '#22c55e' : '#cbd5e1'} />
            <text x="287" y="21" textAnchor="middle" fill={checkFields ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              203.0.113.50 {checkFields && '✓'}
            </text>

            {/* Field 3: Protocol */}
            <rect x="355" y="5" width="85" height="24" rx="4" fill={checkFields ? '#dcfce7' : '#ffffff'} stroke={checkFields ? '#22c55e' : '#cbd5e1'} />
            <text x="397" y="21" textAnchor="middle" fill={checkFields ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              TCP {checkFields && '✓'}
            </text>

            {/* Field 4: Port */}
            <rect x="450" y="5" width="80" height="24" rx="4" fill={checkFields ? '#dcfce7' : '#ffffff'} stroke={checkFields ? '#22c55e' : '#cbd5e1'} />
            <text x="490" y="21" textAnchor="middle" fill={checkFields ? '#15803d' : '#0f172a'} fontSize="7.5" fontWeight="bold" fontFamily="monospace">
              :443 {checkFields && '✓'}
            </text>

            {/* Result Column */}
            <text x="545" y="21" fill={isRule1Matched ? '#059669' : '#2563eb'} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {isRule1Matched ? 'MATCH: ALLOW ✓' : checkFields ? 'CHECKING...' : 'PENDING'}
            </text>
          </g>

          {/* RULE 2: DENY ANY -> SERVER TCP 443 */}
          <g transform="translate(16, 94)" opacity={isRule1Matched ? 0.35 : 0.8}>
            <rect x="-4" y="0" width="676" height="24" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray={isRule1Matched ? '4 4' : undefined} />
            <text x="4" y="16" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">2</text>
            <text x="45" y="16" fill="#dc2626" fontSize="8" fontWeight="bold" fontFamily="monospace">DENY</text>
            <text x="110" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">ANY</text>
            <text x="235" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">203.0.113.50</text>
            <text x="360" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">TCP</text>
            <text x="455" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">:443</text>
            <text x="545" y="16" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{isRule1Matched ? 'SKIPPED (First Match)' : 'PENDING'}</text>
          </g>

          {/* RULE 3: ALLOW ANY -> SERVER TCP 80 */}
          <g transform="translate(16, 124)" opacity={isRule1Matched ? 0.35 : 0.8}>
            <rect x="-4" y="0" width="676" height="24" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray={isRule1Matched ? '4 4' : undefined} />
            <text x="4" y="16" fill="#64748b" fontSize="8" fontWeight="bold" fontFamily="monospace">3</text>
            <text x="45" y="16" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">ALLOW</text>
            <text x="110" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">ANY</text>
            <text x="235" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">203.0.113.50</text>
            <text x="360" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">TCP</text>
            <text x="455" y="16" fill="#64748b" fontSize="7.5" fontFamily="monospace">:80</text>
            <text x="545" y="16" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">{isRule1Matched ? 'SKIPPED' : 'PENDING'}</text>
          </g>

          {/* Footer Note */}
          <text x="16" y="166" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
            {isDelivered 
              ? 'STATUS: Rule 1 matched all 5-tuple parameters. Packet forwarded and received by Server.' 
              : 'STATUS: Evaluating incoming packet against ordered ACL statement rows.'}
          </text>
        </g>
      ) : (
        <g transform="translate(30, 160)">
          <rect x="0" y="0" width="700" height="150" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeDasharray="6 6" />
          <text x="350" y="80" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
            {currentStepIndex === 0 && 'STEP 1: Topology initialized at Client. Click Next to establish Firewall.'}
            {currentStepIndex === 1 && 'STEP 2: Firewall online. Click Next to connect Target Server.'}
            {currentStepIndex === 2 && 'STEP 3: Server connected. Click Next to create HTTPS packet.'}
            {currentStepIndex === 3 && 'STEP 4: HTTPS Packet created. Click Next to transmit to Firewall.'}
            {currentStepIndex === 4 && 'STEP 5: Packet transmitting to Firewall ingress interface...'}
            {currentStepIndex === 5 && 'STEP 6: Packet buffered at Firewall. Click Next to engage ACL rulebase.'}
          </text>
        </g>
      )}
    </svg>
  );
};
