import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q37PortScanVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Attacker appears (198.51.100.99)
  // Step 2: Firewall appears
  // Step 3: Target Server appears
  // Step 4: Attacker initiates Nmap SYN Scan across multiple ports: 21, 22, 23, 25, 80, 443, 3389
  // Step 5: Packets visibly transit one by one toward firewall
  // Step 6: Firewall observes connection rate & multi-port pattern from single source IP
  // Step 7: Detection Indicator: PORT SCAN PATTERN DETECTED (>20 closed ports/sec)
  // Step 8: Dynamic Auto-Shun / Rate-Limiting Policy Activates
  // Step 9: Attacker IP 198.51.100.99 added to Dynamic Blacklist
  // Step 10: Subsequent scan probes blocked at perimeter boundary (✕ BLOCKED AT FW)

  const showFw = currentStepIndex >= 1;
  const showServer = currentStepIndex >= 2;

  const isScanning = currentStepIndex >= 3 && currentStepIndex <= 5;
  const isDetected = currentStepIndex >= 6;
  const isBlocked = currentStepIndex >= 8;

  const ports = ['21', '22', '23', '25', '80', '443', '3389'];
  const activePortIndex = currentStepIndex >= 3 ? Math.min(ports.length - 1, currentStepIndex - 3) : 0;
  const currentPort = ports[activePortIndex];

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isBlocked ? '#fef2f2' : isScanning ? '#fffbeb' : '#eff6ff'} stroke={isBlocked ? '#fca5a5' : isScanning ? '#fcd34d' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isBlocked ? '#991b1b' : isScanning ? '#b45309' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isBlocked
            ? 'PORT SCAN MITIGATED: ATTACKER IP AUTO-SHUNNED & BLACKLISTED AT PERIMETER FIREWALL ✕'
            : isScanning
            ? `PORT SCAN IN PROGRESS: PROBING PORTS 21, 22, 23, 25, 80, 443, 3389 ➔ SCANNER DETECTED!`
            : 'PORT SCANNING DETECTION & THREAT PREVENTION LAB'}
        </text>
      </g>

      {/* Baseline cable */}
      {showServer && (
        <line x1="90" y1="70" x2="650" y2="70" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
      )}

      {/* Nodes: Attacker -> Firewall -> Server */}
      <LaptopNode cx={90} cy={70} label="ATTACKER (NMAP)" ip="198.51.100.99" active danger />

      {showFw && (
        <FirewallGatewayNode cx={370} cy={70} label="FIREWALL / IPS" sub="Scan Rate Analyzer" active success={isBlocked} danger={isScanning && !isBlocked} />
      )}

      {showServer && (
        <ServerNodeSVG cx={650} cy={70} label="INTERNAL SERVER" sub="10.0.1.50" active success={isBlocked} />
      )}

      {/* Dynamic Scan Probe Arrows */}
      {isScanning && !isBlocked && (
        <BoldArrow x1={130} y1={70} x2={330} y2={70} color="#f59e0b" label={`PROBE TCP :${currentPort}`} />
      )}

      {isBlocked && (
        <g transform="translate(370, 70)">
          <line x1="45" y1="-25" x2="45" y2="25" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <rect x="55" y="-12" width="115" height="24" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
          <text x="112" y="4" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="bold" fontFamily="monospace">
            AUTO-SHUN ✕
          </text>
        </g>
      )}

      {/* Packet Card */}
      {currentStepIndex >= 3 && (
        <PacketCard
          cx={isBlocked ? 370 : 250}
          cy={28}
          title={`SYN PROBE :${currentPort}`}
          protocol="TCP"
          port={currentPort}
          src="198.51.100.99"
          dst="10.0.1.50"
          status={isBlocked ? 'DENY' : 'INSPECT'}
          scale={0.78}
        />
      )}

      {/* Lower Port Scan Forensic Dissection Canvas */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          PORT SCANNING DETECTION HEURISTICS & AUTO-SHUN BLACKLISTING
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#fffbeb" stroke="#fcd34d" />
          <text x="10" y="16" fill="#b45309" fontSize="8.5" fontWeight="bold">SCAN DETECTION SIGNALS:</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">1. Sequential Port Sweep: TCP SYN to ports 21, 22, 23, 25, 80.</text>
          <text x="12" y="48" fill="#0f172a" fontSize="7.5">2. High Rate of Half-Open SYNs with zero data payload.</text>
          <text x="12" y="62" fill="#0f172a" fontSize="7.5">3. Rapid TCP RST returns from closed destination ports.</text>
          <text x="12" y="80" fill="#dc2626" fontSize="7" fontWeight="bold">Signature Trigger: &gt;15 distinct ports probed in 1.0s window.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">FIREWALL DEFENSE ACTIONS:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">1. Auto-Shun (Dynamic IP Blacklist): Drops 100% of packets from source IP for 60 minutes.</text>
          <text x="359" y="52" fill="#0f172a" fontSize="7.5">2. Rate-Limiting & Tar-Pitting: Artificially delays TCP response packets by 10s to exhaust attacker scanner threads.</text>
          <text x="359" y="74" fill="#059669" fontSize="7.5" fontWeight="bold">3. SIEM / SOAR Alert generated for SOC investigation.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: Port scanning is the reconnaissance phase of an attack. Detecting and auto-blocking port scans stops attacks before exploits launch.
          </text>
        </g>
      </g>
    </svg>
  );
};
