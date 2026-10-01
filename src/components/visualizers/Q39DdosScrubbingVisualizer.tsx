import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG, PacketCard } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q39DdosScrubbingVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 1: Normal Users stream appears
  // Step 2: Attack Botnet sources appear
  // Step 3: Combined traffic converges toward Cloud Scrubbing Protection Layer
  // Step 4: Scrubbing Center receives multi-gigabit traffic stream
  // Step 5: Normal user traffic identified via behavioral analysis & CAPTCHA/challenge
  // Step 6: Malicious attack traffic identified (UDP Amplification, HTTP Flood)
  // Step 7: Clean legitimate traffic forwarded to Origin Web Server
  // Step 8: Malicious attack packets dropped / blackholed at cloud edge
  // Step 9: Protected Origin Server stays online with zero downtime (100% Availability ✓)

  const showBotnet = currentStepIndex >= 1;
  const showScrubbing = currentStepIndex >= 2;
  const showOrigin = currentStepIndex >= 3;

  const isDdosActive = currentStepIndex >= 3 && currentStepIndex <= 5;
  const isCleanDelivered = currentStepIndex >= 6;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Banner */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="24" rx="12" fill={isCleanDelivered ? '#f0fdf4' : isDdosActive ? '#fef2f2' : '#eff6ff'} stroke={isCleanDelivered ? '#86efac' : isDdosActive ? '#fca5a5' : '#93c5fd'} />
        <text x="340" y="16" textAnchor="middle" fill={isCleanDelivered ? '#047857' : isDdosActive ? '#991b1b' : '#1e40af'} fontSize="9" fontWeight="bold" fontFamily="monospace">
          {isCleanDelivered
            ? 'DDoS SCRUBBED: MALICIOUS VOLUMETRIC NOISE FILTERED AT CLOUD EDGE ➔ CLEAN TRAFFIC DELIVERED ✓'
            : isDdosActive
            ? '500 Gbps VOLUMETRIC DDoS ATTACK CONVERGING ON SCRUBBING CENTER'
            : 'DDoS SCRUBBING ARCHITECTURE & CLOUD TRAFFIC FILTERING'}
        </text>
      </g>

      {/* Nodes: Normal Users & Botnet -> Scrubbing Center -> Origin Server */}
      <g transform="translate(80, 50)">
        <LaptopNode cx={0} cy={0} label="LEGITIMATE USERS" ip="USERS_WAN" active success={isCleanDelivered} />
      </g>

      {showBotnet && (
        <g transform="translate(80, 105)">
          <LaptopNode cx={0} cy={0} label="BOTNET ATTACKERS" ip="100k_BOTS" active danger />
        </g>
      )}

      {showScrubbing && (
        <g transform="translate(370, 75)">
          <rect x="-55" y="-30" width="110" height="48" rx="8" fill="#0f172a" stroke="#8b5cf6" strokeWidth={2} />
          <text x="0" y="-12" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold">CLOUD SCRUBBING</text>
          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">Anycast BGP / WAF</text>
          <text x="0" y="24" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">SCRUBBING</text>
        </g>
      )}

      {showOrigin && (
        <ServerNodeSVG cx={650} cy={75} label="ORIGIN WEB SERVER" sub="10.0.1.50:443" active success={isCleanDelivered} />
      )}

      {/* Arrows */}
      {isDdosActive && (
        <>
          <BoldArrow x1={120} y1={50} x2={310} y2={70} color="#2563eb" label="USER TRAFFIC" />
          <BoldArrow x1={120} y1={105} x2={310} y2={80} color="#ef4444" label="500 Gbps FLOOD" />
        </>
      )}

      {isCleanDelivered && (
        <>
          <BoldArrow x1={430} y1={75} x2={610} y2={75} color="#10b981" label="CLEAN HTTP/2 ✓" />
          <g transform="translate(370, 115)">
            <rect x="-60" y="-10" width="120" height="20" rx="10" fill="#fef2f2" stroke="#ef4444" />
            <text x="0" y="4" textAnchor="middle" fill="#991b1b" fontSize="7" fontWeight="bold" fontFamily="monospace">
              ✕ 495 Gbps DROPPED
            </text>
          </g>
        </>
      )}

      {/* Lower Scrubbing Matrix */}
      <g transform="translate(30, 140)">
        <rect x="0" y="0" width="700" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="26" rx="9" fill="#0f172a" />
        <text x="16" y="17" fill="#ffffff" fontSize="10" fontWeight="bold">
          DDoS MITIGATION ARCHITECTURE (BGP ANYCAST & CLOUD SCRUBBING)
        </text>

        <g transform="translate(16, 36)">
          <rect x="0" y="0" width="325" height="98" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="10" y="16" fill="#1e40af" fontSize="8.5" fontWeight="bold">HOW CLOUD SCRUBBING WORKS:</text>
          <text x="12" y="34" fill="#0f172a" fontSize="7.5">1. BGP Anycast routes traffic to nearest global PoP (dispersing volume).</text>
          <text x="12" y="48" fill="#0f172a" fontSize="7.5">2. Hardware ASICs drop UDP/ICMP amplification floods at line speed.</text>
          <text x="12" y="62" fill="#0f172a" fontSize="7.5">3. Web Application Challenge (JS/Cookie) filters out headless bot clients.</text>
          <text x="12" y="80" fill="#059669" fontSize="7.5" fontWeight="bold">4. Only validated user traffic tunnels via GRE to customer origin.</text>

          <rect x="345" y="0" width="325" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" />
          <text x="355" y="16" fill="#065f46" fontSize="8.5" fontWeight="bold">KEY INTERVIEW CLARIFICATION:</text>
          <text x="359" y="34" fill="#0f172a" fontSize="7.5">Volumetric DDoS (&gt;100 Gbps) CANNOT be mitigated by an on-premise firewall alone because the physical ISP uplink cable will saturate.</text>
          <text x="359" y="58" fill="#0f172a" fontSize="7.5">Upstream Cloud Scrubbing (Cloudflare / AWS Shield / Akamai) is mandatory for volumetric attacks.</text>
          <text x="359" y="80" fill="#059669" fontSize="7.5" fontWeight="bold">On-prem firewalls handle L7 application/slow-rate attacks.</text>
        </g>

        <g transform="translate(16, 142)">
          <rect x="0" y="0" width="668" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" />
          <text x="14" y="15" fill="#1e40af" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            TAKEAWAY: Multi-tiered DDoS defense combines Upstream Cloud Scrubbing for volumetric floods with On-Premises NGFWs/WAFs for Layer 7 attacks.
          </text>
        </g>
      </g>
    </svg>
  );
};
