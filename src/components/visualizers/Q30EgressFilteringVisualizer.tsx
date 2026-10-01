import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q30EgressFilteringVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Scenario 1: Normal Authorized Outbound HTTPS (Steps 0-7)
  // Step 1: Internal Workstation appears
  // Step 2: Egress Firewall appears
  // Step 3: Internet appears
  // Step 4: Workstation creates HTTPS packet (Port 443)
  // Step 5: Packet moves to firewall
  // Step 6: Outbound rule checked (ALLOW Inside -> WAN 443)
  // Step 7: Packet reaches Internet (Delivered ✓) - STOP
  //
  // Scenario 2: Suspicious Malicious Outbound C2 Traffic (Steps 8-12)
  // Step 8: Compromised Workstation creates C2 Beacon packet (Unauthorized Port 4444 / 25 / C2 IP)
  // Step 9: Malicious packet moves to firewall
  // Step 10: Egress policy flags unauthorized port / untrusted external IP
  // Step 11: Egress Firewall action: DENY & DROP
  // Step 12: Packet stops at firewall (✕ BLOCKED AT FW). C2 connection severed & data exfiltration stopped!

  const isMaliciousPhase = currentStepIndex >= 7;

  const showFw = currentStepIndex >= 1;
  const showInternet = currentStepIndex >= 2;

  const isNormalDelivered = currentStepIndex === 6;
  const isMaliciousBlocked = currentStepIndex >= 10;

  let packetX = 90;
  if (!isMaliciousPhase) {
    if (currentStepIndex === 3) packetX = 90;
    else if (currentStepIndex === 4) packetX = 220;
    else if (currentStepIndex === 5) packetX = 370;
    else if (currentStepIndex >= 6) packetX = 650;
  } else {
    if (currentStepIndex === 7 || currentStepIndex === 8) packetX = 90;
    else if (currentStepIndex === 9) packetX = 220;
    else if (currentStepIndex >= 10) packetX = 370;
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isMaliciousPhase ? '#fef2f2' : '#eff6ff'} stroke={isMaliciousPhase ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isMaliciousPhase ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isMaliciousPhase
            ? 'EGRESS THREAT: MALICIOUS OUTBOUND C2 BEACON (PORT 4444) BLOCKED AT EGRESS BOUNDARY ✕'
            : 'NORMAL EGRESS: LEGITIMATE OUTBOUND HTTPS (PORT 443) PERMITTED OUT TO WAN ✓'}
        </text>
      </g>

      {/* Baseline cable */}
      {showInternet && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes */}
      <LaptopNode cx={90} cy={70} label={isMaliciousPhase ? 'INFECTED CLIENT' : 'INTERNAL CLIENT'} ip="10.0.1.25" active danger={isMaliciousPhase} />

      {showFw && (
        <FirewallGatewayNode cx={370} cy={70} label="EGRESS FIREWALL" sub="Outbound Policy Inspection" active success={isNormalDelivered} danger={isMaliciousBlocked} />
      )}

      {showInternet && (
        <ServerNodeSVG cx={650} cy={70} label={isMaliciousPhase ? 'ATTACKER C2 SERVER' : 'PUBLIC INTERNET'} sub={isMaliciousPhase ? '198.51.100.99:4444' : 'WAN:443'} active danger={isMaliciousPhase} success={isNormalDelivered} />
      )}

      {/* Motion Arrows */}
      {!isMaliciousPhase ? (
        <>
          {currentStepIndex === 4 && (
            <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#2563eb" label="OUTBOUND :443" />
          )}
          {currentStepIndex >= 6 && (
            <BoldArrow x1={410} y1={70} x2={615} y2={70} color="#10b981" label="EGRESS ALLOWED ✓" />
          )}
        </>
      ) : (
        <>
          {currentStepIndex === 9 && (
            <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#ef4444" label="C2 BEACON :4444" />
          )}
          {isMaliciousBlocked && (
            <g transform="translate(370, 70)">
              <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <rect x="55" y="-12" width="115" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="112" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                EGRESS BLOCKED ✕
              </text>
            </g>
          )}
        </>
      )}

      {/* Packet Card */}
      {((!isMaliciousPhase && currentStepIndex >= 3) || (isMaliciousPhase && currentStepIndex >= 8)) && (
        <PacketCard
          cx={packetX}
          cy={28}
          title={isMaliciousPhase ? 'C2 REVERSE SHELL' : 'OUTBOUND WEB'}
          protocol="TCP"
          port={isMaliciousPhase ? '4444' : '443'}
          src="10.0.1.25"
          dst={isMaliciousPhase ? 'C2_SERVER' : 'INTERNET'}
          status={isMaliciousBlocked ? 'DENY' : isNormalDelivered ? 'ALLOW' : 'NORMAL'}
          scale={0.78}
        />
      )}

      {/* Lower Egress Security Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          WHY EGRESS (OUTBOUND) FILTERING IS CRUCIAL FOR ENTERPRISE SECURITY
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">1. PREVENTS DATA EXFILTRATION & C2 CALLS:</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">Most ransomware and trojans infect a host and phone home to C2.</text>
          <text x="12" y="48" fill="#64748b" fontSize="7">By blocking outbound non-standard ports (e.g. 4444, 1337, 6667), the malware cannot receive execution commands or upload stolen data.</text>
          <text x="12" y="78" fill="#059669" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Policy: ALLOW only Ports 80, 443, 53, 123</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">2. BLOCKS SPAM BOTNETS & LATERAL SPILLS:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">Blocks outbound SMTP (Port 25) from general employee laptops.</text>
          <text x="359" y="48" fill="#64748b" fontSize="7">Prevents infected corporate machines from turning into spam relays or participating in distributed DDoS attacks against third parties.</text>
          <text x="359" y="78" fill="#059669" fontSize="7.5" fontWeight="bold" fontFamily="monospace">Blocks: Outbound SMB (445) & Telnet (23)</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="14" y="15" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            SUMMARY: A firewall that only filters Inbound traffic is only doing half its job. Egress filtering contains breaches.
          </text>
        </g>
      </g>
    </svg>
  );
};
