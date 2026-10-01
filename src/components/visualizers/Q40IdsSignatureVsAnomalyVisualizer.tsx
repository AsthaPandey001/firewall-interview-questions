import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q40IdsSignatureVsAnomalyVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const showIds = currentStepIndex >= 1;
  const showNetwork = currentStepIndex >= 2;
  const showCables = currentStepIndex >= 3;

  const isPartBAnomaly = currentStepIndex >= 9;

  let packetX = -100;
  let packetY = 75;
  let showPacket = false;
  let packetLabel = 'INSPECTING';
  let packetSub = 'Packet Payload';
  let packetColor = '#0284c7';

  if (currentStepIndex === 4) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'EXPLOIT: LOG4J';
    packetSub = '${jndi:ldap://...}';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 5) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'CVE-2021-44228';
    packetSub = '➔ IDS Inspection Engine';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 6 || currentStepIndex === 7) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'SIGNATURE MATCH!';
    packetSub = 'Snort SID: 203432';
    packetColor = '#ef4444';
  } else if (currentStepIndex === 8) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'ALERT ➔ SIEM';
    packetSub = 'Passive Tap Logged';
    packetColor = '#f59e0b';
  } else if (currentStepIndex === 11) {
    showPacket = true;
    packetX = 90;
    packetLabel = 'NORMAL BASELINE';
    packetSub = '50 req/min (Normal)';
    packetColor = '#10b981';
  } else if (currentStepIndex === 12 || currentStepIndex === 13) {
    showPacket = true;
    packetX = 230;
    packetLabel = 'ZERO-DAY TUNNEL';
    packetSub = '500MB DNS Outbound (3 AM)';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex === 14 || currentStepIndex === 15) {
    showPacket = true;
    packetX = 370;
    packetLabel = 'ANOMALY DETECTED!';
    packetSub = 'Z-Score: +4.8σ Drift';
    packetColor = '#8b5cf6';
  } else if (currentStepIndex >= 16) {
    showPacket = true;
    packetX = 510;
    packetLabel = 'HEURISTIC ALERT';
    packetSub = 'Zero-Day Flagged ✓';
    packetColor = '#8b5cf6';
  }

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 10)">
        <rect
          x="0"
          y="0"
          width="680"
          height="22"
          rx="11"
          fill={isPartBAnomaly ? '#f5f3ff' : '#eff6ff'}
          stroke={isPartBAnomaly ? '#c4b5fd' : '#93c5fd'}
        />
        <text
          x="340"
          y="15"
          textAnchor="middle"
          fill={isPartBAnomaly ? '#6d28d9' : '#1e40af'}
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isPartBAnomaly
            ? 'PART B: BEHAVIORAL ANOMALY DETECTION — STATISTICAL DRIFT &amp; ZERO-DAY THREAT DETECTION ✓'
            : 'PART A: SIGNATURE-BASED DETECTION — DETERMINISTIC PATTERN MATCHING AGAINST KNOWN CVEs ✓'}
        </text>
      </g>

      {/* Network Cables */}
      {showCables && (
        <g opacity="0.6">
          <line x1="120" y1="75" x2="330" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="410" y1="75" x2="610" y2="75" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        </g>
      )}

      {/* Transit arrows */}
      {(currentStepIndex === 5 || currentStepIndex === 13) && (
        <BoldArrow x1="120" y1="75" x2="330" y2="75" color={isPartBAnomaly ? '#8b5cf6' : '#ef4444'} label={isPartBAnomaly ? 'ANOMALOUS DATA' : 'EXPLOIT PAYLOAD'} />
      )}
      {(currentStepIndex === 8 || currentStepIndex >= 16) && (
        <BoldArrow x1="410" y1="75" x2="610" y2="75" color="#f59e0b" label="ALERT DISPATCH" />
      )}

      {/* Source Device */}
      <LaptopNode
        cx={80}
        cy={75}
        label={isPartBAnomaly ? 'ANOMALOUS SOURCE' : 'ATTACK SOURCE'}
        ip={isPartBAnomaly ? 'Zero-Day / DNS Tunnel' : 'Known Log4j Payload'}
        active
        danger
      />

      {/* IDS Engine */}
      {showIds && (
        <g transform="translate(370, 75)">
          <rect
            x="-48"
            y="-30"
            width="96"
            height="46"
            rx="8"
            fill="#0f172a"
            stroke={isPartBAnomaly ? '#8b5cf6' : '#ef4444'}
            strokeWidth={2}
          />
          <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">IDS ENGINE</text>
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
            {isPartBAnomaly ? 'BEHAVIORAL ML' : 'SNORT / SURICATA'}
          </text>
          <text x="0" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f172a">INTRUSION DETECTION</text>
        </g>
      )}

      {/* SIEM / Protected Network */}
      {showNetwork && (
        <ServerNodeSVG
          cx={650}
          cy={75}
          label="ENTERPRISE SIEM"
          sub="Splunk / Sentinel Alert Log"
          active
          success={currentStepIndex === 8 || currentStepIndex >= 16}
        />
      )}

      {/* Moving Packet */}
      {showPacket && (
        <PacketCard
          cx={packetX}
          cy={packetY}
          label={packetLabel}
          sub={packetSub}
          color={packetColor}
        />
      )}

      {/* Bottom Technical Breakdown Panel */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="9.5" fontWeight="bold">
          IDS DETECTION MATRIX: SIGNATURE RULE EVALUATION VS STATISTICAL ANOMALY BASELINING
        </text>

        {/* Left: Signature Table vs Anomaly Graph */}
        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="10" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">
            {isPartBAnomaly ? 'BEHAVIORAL BASELINE DEVIATION METRIC:' : 'SNORT CVE SIGNATURE DATABASE MATCH:'}
          </text>

          {!isPartBAnomaly ? (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="20" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="13" fill="#64748b" fontSize="7" fontFamily="monospace">SID     CVE / Threat Pattern           Status    Action</text>

              <rect x="0" y="24" width="309" height="22" rx="3" fill={currentStepIndex >= 6 ? '#fee2e2' : '#ffffff'} stroke={currentStepIndex >= 6 ? '#fca5a5' : '#e2e8f0'} />
              <text x="10" y="38" fill="#0f172a" fontSize="7.5" fontFamily="monospace">203432  Log4j jndi:ldap:// regex       MATCHED   ALERT ⚠</text>

              <rect x="0" y="48" width="309" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="62" fill="#64748b" fontSize="7.5" fontFamily="monospace">201201  EternalBlue SMB MS17-010       NO_MATCH  IGNORE</text>

              <rect x="0" y="72" width="309" height="34" rx="3" fill="#f1f5f9" stroke="#cbd5e1" />
              <text x="10" y="86" fill="#0f172a" fontSize="7" fontWeight="bold">Signature Principle:</text>
              <text x="10" y="98" fill="#475569" fontSize="6.8">Deterministic byte pattern match. Cannot detect unknown Zero-Days.</text>
            </g>
          ) : (
            <g transform="translate(8, 26)">
              <rect x="0" y="0" width="309" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
              <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontFamily="monospace">Baseline (Normal): 50 req/min | Port 53: 20 KB/hr</text>

              <rect x="0" y="26" width="309" height="22" rx="3" fill="#f5f3ff" stroke="#c4b5fd" />
              <text x="10" y="40" fill="#6d28d9" fontSize="7.5" fontFamily="monospace">Observed: 3:00 AM DNS Egress ➔ 500 MB (Z=+4.8σ)</text>

              <rect x="0" y="52" width="309" height="54" rx="3" fill="#fef2f2" stroke="#fca5a5" />
              <text x="10" y="66" fill="#991b1b" fontSize="7.5" fontWeight="bold">ANOMALY ENGINE VERDICT: NOVEL ZERO-DAY DETECTED</text>
              <text x="10" y="80" fill="#475569" fontSize="6.8">• No known CVE signature matched payload.</text>
              <text x="10" y="94" fill="#475569" fontSize="6.8">• Statistical outlier flags covert exfiltration channel.</text>
            </g>
          )}

          <text x="10" y="132" fill="#64748b" fontSize="7.5">
            Engine State: <tspan fill={isPartBAnomaly ? '#6d28d9' : '#b91c1c'} fontWeight="bold">{isPartBAnomaly ? 'ML Statistical Profiler' : 'Static String/Byte Classifier'}</tspan>
          </text>
        </g>

        {/* Right: Technical Comparison & Trade-offs */}
        <g transform="translate(355, 36)">
          <rect x="0" y="0" width="330" height="142" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="12" y="16" fill="#0f172a" fontSize="8.5" fontWeight="bold">DETECTION PARADIGM COMPARISON:</text>

          <g transform="translate(12, 24)">
            <rect x="0" y="0" width="306" height="48" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">1. Signature-Based (Snort/Suricata):</text>
            <text x="10" y="27" fill="#475569" fontSize="7">
              ✔ Near 0% False Positives for known exploits.
            </text>
            <text x="10" y="39" fill="#b91c1c" fontSize="7">
              ✕ 100% Blind to new Zero-Days and polymorphic mutations.
            </text>
          </g>

          <g transform="translate(12, 76)">
            <rect x="0" y="0" width="306" height="56" rx="4" fill="#ffffff" stroke="#e2e8f0" />
            <text x="10" y="14" fill="#0f172a" fontSize="7.5" fontWeight="bold">2. Anomaly-Based (Behavioral ML / UEBA):</text>
            <text x="10" y="27" fill="#059669" fontSize="7">
              ✔ Catches novel Zero-Days and internal data exfiltration.
            </text>
            <text x="10" y="39" fill="#b45309" fontSize="7">
              ⚠ Higher False Positives when legitimate business patterns shift.
            </text>
            <text x="10" y="50" fill="#6d28d9" fontSize="7" fontWeight="bold">
              ✔ Modern NGFW/NDR deploys BOTH in parallel!
            </text>
          </g>
        </g>
      </g>

      {/* Compact Status Indicator */}
      <g transform="translate(40, 324)">
        <text x="340" y="10" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
          {currentStepIndex >= 16
            ? 'RESULT: ✓ HYBRID IDS COMPLETE — KNOWN EXPLOITS CAUGHT VIA SIGNATURES, ZERO-DAYS VIA ANOMALY'
            : currentStepIndex >= 9
            ? 'PART B: EVALUATING STATISTICAL ANOMALY &amp; ZERO-DAY EXFILTRATION'
            : currentStepIndex >= 4
            ? 'PART A: EVALUATING DETERMINISTIC LOG4J CVE SIGNATURE'
            : 'READY — ADVANCE STEP TO TRACE SIGNATURE VS ANOMALY DETECTION'}
        </text>
      </g>
    </svg>
  );
};
