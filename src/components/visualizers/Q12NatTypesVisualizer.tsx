import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q12NatTypesVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // 4 Sequential Stages:
  // Stage 0: STATIC NAT (Steps 0 - 3)
  // Stage 1: DYNAMIC NAT (Steps 4 - 7)
  // Stage 2: PAT / OVERLOAD (Steps 8 - 11)
  // Stage 3: DNAT / PORT FORWARDING (Steps 12 - 15)

  let stage = 0;
  if (currentStepIndex >= 4 && currentStepIndex <= 7) stage = 1;
  else if (currentStepIndex >= 8 && currentStepIndex <= 11) stage = 2;
  else if (currentStepIndex >= 12) stage = 3;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Mode Selector Header Bar */}
      <g transform="translate(40, 10)">
        <rect x="0" y="0" width="680" height="26" rx="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        {['1. Static NAT (1:1)', '2. Dynamic NAT (Pool)', '3. PAT / Overload (Ports)', '4. DNAT (Port Forwarding)'].map((t, idx) => {
          const isActive = idx === stage;
          return (
            <g key={t} transform={`translate(${10 + idx * 168}, 2)`}>
              <rect
                x="0"
                y="0"
                width="160"
                height="22"
                rx="11"
                fill={isActive ? '#2563eb' : 'transparent'}
              />
              <text
                x="80"
                y="14"
                textAnchor="middle"
                fill={isActive ? '#ffffff' : '#64748b'}
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {t}
              </text>
            </g>
          );
        })}
      </g>

      {/* Main Stage Canvas */}
      <g transform="translate(30, 44)">
        <rect x="0" y="0" width="700" height="285" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="0" y="0" width="700" height="28" rx="9" fill="#0f172a" />
        <text x="16" y="18" fill="#ffffff" fontSize="10" fontWeight="bold">
          {stage === 0 && 'PART 1 OF 4 — STATIC NAT: FIXED 1-TO-1 PERMANENT ADDRESS MAPPING'}
          {stage === 1 && 'PART 2 OF 4 — DYNAMIC NAT: PUBLIC IP POOL ALLOCATION (FIRST-COME FIRST-SERVED)'}
          {stage === 2 && 'PART 3 OF 4 — PAT (PORT ADDRESS TRANSLATION): MANY PRIVATE IPS TO 1 PUBLIC IP + UNIQUE PORTS'}
          {stage === 3 && 'PART 4 OF 4 — DNAT (DESTINATION NAT): INBOUND PUBLIC IP/PORT REDIRECTED TO INTERNAL SERVER'}
        </text>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STAGE 0: STATIC NAT (Steps 0 - 3) */}
        {/* ───────────────────────────────────────────────────────────── */}
        {stage === 0 && (
          <g transform="translate(20, 38)" className="animate-pop-in">
            {/* Devices */}
            <LaptopNode cx={70} cy={45} label="INTERNAL HOST" ip="10.0.0.10" active />
            
            {currentStepIndex >= 1 && (
              <g transform="translate(330, 45)" className="animate-pop-in">
                <rect x="-45" y="-28" width="90" height="44" rx="6" fill="#0f172a" stroke="#2563eb" strokeWidth="2" />
                <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">STATIC 1:1</text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">FIXED MAP</text>
              </g>
            )}

            {currentStepIndex >= 1 && (
              <ServerNodeSVG cx={590} cy={45} label="INTERNET SERVER" sub="198.51.100.2:443" active={currentStepIndex >= 3} success={currentStepIndex >= 3} />
            )}

            {/* In-flight arrows */}
            {currentStepIndex === 2 && (
              <BoldArrow x1={110} y1={45} x2={280} y2={45} color="#2563eb" label="SRC: 10.0.0.10" />
            )}
            {currentStepIndex >= 3 && (
              <BoldArrow x1={380} y1={45} x2={540} y2={45} color="#10b981" label="TRANSLATED: 203.0.113.20 ✓" />
            )}

            {/* Static Table */}
            <g transform="translate(20, 105)">
              <rect x="0" y="0" width="620" height="120" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
              <rect x="0" y="0" width="620" height="22" fill="#f1f5f9" rx="5" />
              <text x="14" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">INSIDE LOCAL (FIXED PRIVATE)</text>
              <text x="240" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">INSIDE GLOBAL (FIXED PUBLIC)</text>
              <text x="460" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">MAPPING RATIO</text>

              <rect x="6" y="28" width="608" height="28" rx="4" fill={currentStepIndex >= 2 ? '#eff6ff' : '#ffffff'} stroke={currentStepIndex >= 2 ? '#3b82f6' : '#cbd5e1'} />
              <text x="14" y="46" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">10.0.0.10</text>
              <text x="240" y="46" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">203.0.113.20 (Dedicated)</text>
              <text x="460" y="46" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">1 : 1 (Permanent)</text>

              <g transform="translate(10, 68)">
                <rect x="0" y="0" width="600" height="42" rx="4" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="18" fill="#334155" fontSize="8" fontWeight="bold">KEY INTERVIEW TAKEAWAY:</text>
                <text x="12" y="32" fill="#64748b" fontSize="7.5">
                  Static NAT provides a permanent 1-to-1 IP mapping. Inbound and outbound connections always resolve to this single public IP.
                </text>
              </g>
            </g>
          </g>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STAGE 1: DYNAMIC NAT (Steps 4 - 7) */}
        {/* ───────────────────────────────────────────────────────────── */}
        {stage === 1 && (
          <g transform="translate(20, 38)" className="animate-pop-in">
            <LaptopNode cx={70} cy={45} label="PRIVATE HOST" ip="10.0.1.15" active />
            
            <g transform="translate(330, 45)">
              <rect x="-45" y="-28" width="90" height="44" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-8" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">IP POOL</text>
              <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">ALLOCATOR</text>
            </g>

            <ServerNodeSVG cx={590} cy={45} label="INTERNET SERVER" sub="198.51.100.2:80" active={currentStepIndex >= 7} success={currentStepIndex >= 7} />

            {currentStepIndex === 5 && (
              <BoldArrow x1={110} y1={45} x2={280} y2={45} color="#2563eb" label="REQUESTS IP →" />
            )}
            {currentStepIndex >= 6 && (
              <BoldArrow x1={380} y1={45} x2={540} y2={45} color="#10b981" label="ASSIGNED: 203.0.113.51 ✓" />
            )}

            {/* Dynamic Pool Status Table */}
            <g transform="translate(20, 105)">
              <rect x="0" y="0" width="620" height="120" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
              <text x="14" y="18" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
                PUBLIC IP POOL STATUS (203.0.113.50 - 203.0.113.53):
              </text>
              
              <g transform="translate(14, 28)">
                {[
                  { ip: '203.0.113.50', status: 'IN USE (Host 1)', busy: true },
                  { ip: '203.0.113.51', status: currentStepIndex >= 6 ? 'ALLOCATED (10.0.1.15)' : 'AVAILABLE', busy: currentStepIndex >= 6 },
                  { ip: '203.0.113.52', status: 'AVAILABLE', busy: false },
                  { ip: '203.0.113.53', status: 'AVAILABLE', busy: false },
                ].map((p, i) => (
                  <g key={p.ip} transform={`translate(${i * 148}, 0)`}>
                    <rect x="0" y="0" width="140" height="32" rx="4" fill={p.busy ? '#fef2f2' : '#ecfdf5'} stroke={p.busy ? '#fca5a5' : '#86efac'} />
                    <text x="70" y="13" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{p.ip}</text>
                    <text x="70" y="25" textAnchor="middle" fill={p.busy ? '#dc2626' : '#15803d'} fontSize="7" fontWeight="bold">{p.status}</text>
                  </g>
                ))}
              </g>

              <g transform="translate(10, 68)">
                <rect x="0" y="0" width="600" height="42" rx="4" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="18" fill="#334155" fontSize="8" fontWeight="bold">KEY INTERVIEW TAKEAWAY:</text>
                <text x="12" y="32" fill="#64748b" fontSize="7.5">
                  Dynamic NAT assigns public IPs on a first-come, first-served basis. When the pool is exhausted, additional hosts are blocked until an active session terminates.
                </text>
              </g>
            </g>
          </g>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STAGE 2: PAT / OVERLOAD (Steps 8 - 11) */}
        {/* ───────────────────────────────────────────────────────────── */}
        {stage === 2 && (
          <g transform="translate(20, 38)" className="animate-pop-in">
            {/* 3 Private Hosts sharing ONE public IP */}
            <g transform="translate(20, 0)">
              {[
                { ip: '192.168.1.10:5001', y: 0, color: '#3b82f6', active: true },
                { ip: '192.168.1.11:5002', y: 32, color: '#8b5cf6', active: currentStepIndex >= 9 },
                { ip: '192.168.1.12:5003', y: 64, color: '#10b981', active: currentStepIndex >= 9 },
              ].map((h) => (
                <g key={h.ip} transform={`translate(0, ${h.y})`}>
                  <rect x="0" y="0" width="140" height="24" rx="4" fill="#ffffff" stroke={h.color} strokeWidth={1.5} />
                  <text x="70" y="16" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{h.ip}</text>
                  <path d="M 140 12 L 270 45" stroke={h.color} strokeWidth="1.5" strokeDasharray="3 3" />
                </g>
              ))}
            </g>

            {/* PAT Gateway */}
            <g transform="translate(330, 45)">
              <rect x="-45" y="-28" width="90" height="44" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="0" y="-8" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold">PAT / OVERLOAD</text>
              <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">PORT MULTIPLEX</text>
            </g>

            <BoldArrow x1={380} y1={45} x2={540} y2={45} color="#10b981" label="1 PUBLIC IP + PORTS →" />
            <ServerNodeSVG cx={590} cy={45} label="INTERNET" sub="203.0.113.1" active success />

            {/* PAT Table */}
            <g transform="translate(20, 105)">
              <rect x="0" y="0" width="620" height="120" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
              <text x="14" y="16" fill="#334155" fontSize="8" fontWeight="bold" fontFamily="monospace">
                PAT (MANY-TO-ONE) OVERLOAD PORT MULTIPLEX TABLE:
              </text>
              
              <g transform="translate(14, 26)">
                <text x="0" y="12" fill="#1e40af" fontSize="7.5" fontFamily="monospace">192.168.1.10:5001 ──→ 203.0.113.1:61001 (Unique Source Port Assigned)</text>
                <text x="0" y="26" fill="#6b21a8" fontSize="7.5" fontFamily="monospace">192.168.1.11:5002 ──→ 203.0.113.1:61002 (Unique Source Port Assigned)</text>
                <text x="0" y="40" fill="#065f46" fontSize="7.5" fontFamily="monospace">192.168.1.12:5003 ──→ 203.0.113.1:61003 (Unique Source Port Assigned)</text>
              </g>

              <g transform="translate(10, 72)">
                <rect x="0" y="0" width="600" height="38" rx="4" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="16" fill="#334155" fontSize="8" fontWeight="bold">KEY INTERVIEW TAKEAWAY:</text>
                <text x="12" y="28" fill="#64748b" fontSize="7.5">
                  PAT tracks unique 16-bit Layer 4 source ports, allowing up to ~64,000 concurrent sessions on a single public IP.
                </text>
              </g>
            </g>
          </g>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STAGE 3: DNAT / PORT FORWARDING (Steps 12 - 15) */}
        {/* ───────────────────────────────────────────────────────────── */}
        {stage === 3 && (
          <g transform="translate(20, 38)" className="animate-pop-in">
            <ServerNodeSVG cx={70} cy={45} label="PUBLIC CLIENT" sub="198.51.100.99" active />
            <BoldArrow x1={110} y1={45} x2={280} y2={45} color="#2563eb" label="DST: 203.0.113.50:80 →" />

            {/* DNAT Gateway */}
            <g transform="translate(330, 45)">
              <rect x="-45" y="-28" width="90" height="44" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
              <text x="0" y="-8" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold">DNAT ENGINE</text>
              <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">DEST REWRITE</text>
            </g>

            <BoldArrow x1={380} y1={45} x2={540} y2={45} color="#10b981" label="DST REWRITTEN TO 10.0.2.80 →" />
            <ServerNodeSVG cx={590} cy={45} label="INTERNAL SERVER" sub="10.0.2.80:8080" active success />

            {/* DNAT Table */}
            <g transform="translate(20, 105)">
              <rect x="0" y="0" width="620" height="120" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
              <rect x="0" y="0" width="620" height="22" fill="#f1f5f9" rx="5" />
              <text x="14" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">INCOMING PUBLIC DST IP/PORT</text>
              <text x="250" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">TRANSLATED INTERNAL DESTINATION</text>
              <text x="500" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">ACTION</text>

              <rect x="6" y="28" width="608" height="28" rx="4" fill="#faf5ff" stroke="#d8b4fe" />
              <text x="14" y="46" fill="#6b21a8" fontSize="9" fontWeight="bold" fontFamily="monospace">203.0.113.50 :80 (Public IP)</text>
              <text x="250" y="46" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">10.0.2.80 :8080 (Private Server)</text>
              <text x="500" y="46" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">Port Forwarded ✓</text>

              <g transform="translate(10, 68)">
                <rect x="0" y="0" width="600" height="42" rx="4" fill="#ffffff" stroke="#e2e8f0" />
                <text x="12" y="18" fill="#334155" fontSize="8" fontWeight="bold">KEY INTERVIEW TAKEAWAY:</text>
                <text x="12" y="32" fill="#64748b" fontSize="7.5">
                  DNAT (Destination NAT / Port Forwarding) exposes internal private services to the public Internet without giving backend servers public IP addresses.
                </text>
              </g>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
};
