import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q40IdsSignatureVsAnomalyVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Part A: SIGNATURE-BASED IDS (Steps 0-5)
  // Step 1: Traffic stream arrives
  // Step 2: Signature IDS sensor appears with known CVE rules (Snort/Suricata)
  // Step 3: Known exploit packet arrives (e.g. Apache Struts OGNL)
  // Step 4: IDS compares payload byte strings against CVE database
  // Step 5: Exact Signature Match -> CRITICAL SECURITY ALERT generated! - STOP
  //
  // Part B: ANOMALY-BASED IDS (Steps 6-11)
  // Step 6: Anomaly-Based IDS sensor appears with statistical machine-learning baseline
  // Step 7: Zero-day unknown exploit arrives with unusual packet volume / protocol divergence
  // Step 8: Signature engine finds zero matches (Signature Blind!)
  // Step 9: Anomaly engine detects significant statistical deviation (>4 standard deviations from baseline)
  // Step 10: Anomaly Alert generated: "Abnormal traffic profile / Protocol Anomaly Detected!"
  // Step 11: Summary Comparison: Known Patterns vs Behavioral Outliers

  const isAnomalyPhase = currentStepIndex >= 5;

  const isSigAlert = currentStepIndex >= 3 && currentStepIndex <= 4;
  const isAnomalyAlert = currentStepIndex >= 8;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isAnomalyPhase ? '#faf5ff' : '#eff6ff'} stroke={isAnomalyPhase ? '#c084fc' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isAnomalyPhase ? '#6b21a8' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isAnomalyPhase
            ? 'PART B: ANOMALY-BASED IDS (BEHAVIORAL / ML BASELINE DETECTS ZERO-DAY OUTLIERS)'
            : 'PART A: SIGNATURE-BASED IDS (PATTERN MATCHING DETECTS KNOWN CVE SIGNATURES)'}
        </text>
      </g>

      {/* Nodes: Traffic -> IDS Sensor -> SIEM Alert */}
      <LaptopNode
        cx={90}
        cy={75}
        label={isAnomalyPhase ? 'ZERO-DAY ATTACK' : 'KNOWN CVE ATTACK'}
        ip={isAnomalyPhase ? '198.51.100.99' : '198.51.100.22'}
        active
        danger
      />

      <g transform="translate(370, 75)">
        <rect x="-55" y="-30" width="110" height="48" rx="8" fill="#0f172a" stroke={isAnomalyPhase ? '#a855f7' : '#0284c7'} strokeWidth={2} />
        <text x="0" y="-12" textAnchor="middle" fill={isAnomalyPhase ? '#c084fc' : '#38bdf8'} fontSize="8" fontWeight="bold">
          {isAnomalyPhase ? 'ANOMALY SENSOR' : 'SIGNATURE SENSOR'}
        </text>
        <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">
          {isAnomalyPhase ? 'Heuristic Model' : 'Snort / Suricata'}
        </text>
        <text x="0" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">IDS SENSOR</text>
      </g>

      <ServerNodeSVG cx={650} cy={75} label="SOC / SIEM DASHBOARD" sub="Security Event Stream" active success={isSigAlert || isAnomalyAlert} />

      {/* Traffic Arrows */}
      {!isAnomalyPhase ? (
        <>
          {currentStepIndex >= 1 && currentStepIndex <= 2 && (
            <BoldArrow x1={130} y1={75} x2={310} y2={75} color="#ef4444" label="CVE-2017-5638" />
          )}
          {isSigAlert && (
            <BoldArrow x1={430} y1={75} x2={610} y2={75} color="#ef4444" label="🚨 SIGNATURE ALERT" />
          )}
        </>
      ) : (
        <>
          {currentStepIndex >= 6 && currentStepIndex <= 7 && (
            <BoldArrow x1={130} y1={75} x2={310} y2={75} color="#a855f7" label="ZERO-DAY EXPLOIT" />
          )}
          {isAnomalyAlert && (
            <BoldArrow x1={430} y1={75} x2={610} y2={75} color="#a855f7" label="⚠️ ANOMALY ALERT" />
          )}
        </>
      )}

      {/* Lower Comparative Detection Engine Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          SIGNATURE-BASED vs ANOMALY-BASED INTRUSION DETECTION ENGINES
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill={!isAnomalyPhase ? '#eff6ff' : '#f8fafc'} stroke={!isAnomalyPhase ? '#93c5fd' : '#cbd5e1'} strokeWidth={!isAnomalyPhase ? 2 : 1} />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">SIGNATURE-BASED DETECTION (Known Rules):</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">How it works: Matches specific regex string / byte hashes.</text>
          <text x="12" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Advantage: Extremely low false-positive rate; exact CVE match.</text>
          <text x="12" y="62" fill="#dc2626" fontSize="7.5">Limitation: Blind to zero-days, polymorphic code & modified exploits.</text>
          <text x="12" y="80" fill="#64748b" fontSize="7" fontFamily="monospace">Example: Snort SID: 2000001 (Apache Log4j)</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill={isAnomalyPhase ? '#faf5ff' : '#f8fafc'} stroke={isAnomalyPhase ? '#c084fc' : '#cbd5e1'} strokeWidth={isAnomalyPhase ? 2 : 1} />
          <text x="355" y="16" fill="#6b21a8" fontSize="8.5" fontWeight="bold">ANOMALY-BASED DETECTION (Behavioral / ML):</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">How it works: Establishes statistical baseline of normal network flow.</text>
          <text x="359" y="48" fill="#059669" fontSize="7.5" fontWeight="bold">Advantage: Detects novel zero-day exploits & insider data theft.</text>
          <text x="359" y="62" fill="#dc2626" fontSize="7.5">Limitation: Higher false-positive rate during legitimate network spikes.</text>
          <text x="359" y="80" fill="#64748b" fontSize="7" fontFamily="monospace">Example: Alert on 10x spike in outbound ICMP traffic</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            BEST PRACTICE: Modern Next-Gen IPS solutions run hybrid engines (Signatures for fast known CVE blocking + Machine Learning for zero-day anomaly detection).
          </text>
        </g>
      </g>
    </svg>
  );
};
