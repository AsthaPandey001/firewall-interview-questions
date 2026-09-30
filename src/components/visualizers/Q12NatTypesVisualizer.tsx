import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q12NatTypesVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Static NAT (1:1 Fixed Mapping)
  // Step 1: Dynamic NAT (Public IP Pool Allocation)
  // Step 2: PAT (Port Address Translation / NAT Overload: Many-to-One)
  // Step 3: DNAT (Destination Port Forwarding: Incoming Public to Internal Server)
  // Step 4: 4-Way Visual Summary Comparison

  const mode = currentStepIndex;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Mode Selector Header Bar */}
      <g transform="translate(40, 14)">
        <rect x="0" y="0" width="680" height="28" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        {['1. Static NAT (1:1)', '2. Dynamic NAT (Pool)', '3. PAT / Overload (Ports)', '4. DNAT (Port Forwarding)', '5. 4-Way Matrix'].map((t, idx) => {
          const isActive = idx === mode;
          return (
            <g key={t} transform={`translate(${10 + idx * 135}, 3)`}>
              <rect
                x="0"
                y="0"
                width="128"
                height="22"
                rx="11"
                fill={isActive ? '#2563eb' : 'transparent'}
              />
              <text
                x="64"
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

      {/* Steps 0 to 3: Dedicated Dynamic Diagram */}
      {mode <= 3 && (
        <g transform="translate(30, 52)">
          {/* Main Stage Canvas */}
          <rect x="0" y="0" width="700" height="270" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="30" rx="9" fill="#0f172a" />
          <text x="16" y="19" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            {mode === 0 && 'STATIC NAT: FIXED 1-TO-1 PERMANENT ADDRESS MAPPING'}
            {mode === 1 && 'DYNAMIC NAT: DYNAMIC PUBLIC IP POOL ALLOCATION (FIRST-COME FIRST-SERVE)'}
            {mode === 2 && 'PAT (PORT ADDRESS TRANSLATION): MANY PRIVATE IPS TO ONE PUBLIC IP + UNIQUE PORTS'}
            {mode === 3 && 'DNAT (DESTINATION NAT): INBOUND PUBLIC IP/PORT REDIRECTED TO INTERNAL SERVER'}
          </text>

          {/* MODE 0: STATIC NAT (Resting Topology on Step 1) */}
          {mode === 0 && (
            <g transform="translate(20, 45)">
              <LaptopNode cx={70} cy={50} label="INTERNAL HOST" ip="10.0.1.10" active />
              
              {/* NAT Gateway */}
              <g transform="translate(320, 50)">
                <rect x="-40" y="-30" width="80" height="46" rx="6" fill="#0f172a" stroke="#2563eb" strokeWidth="2" />
                <text x="0" y="-10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">STATIC 1:1</text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontFamily="monospace">FIXED MAP</text>
              </g>

              <ServerNodeSVG cx={580} cy={50} label="INTERNET SERVER" sub="198.51.100.1:443" active />

              {/* Table */}
              <g transform="translate(20, 115)">
                <rect x="0" y="0" width="620" height="90" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
                <rect x="0" y="0" width="620" height="22" fill="#f1f5f9" rx="5" />
                <text x="14" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">INSIDE LOCAL (FIXED PRIVATE)</text>
                <text x="240" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">INSIDE GLOBAL (FIXED PUBLIC)</text>
                <text x="460" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">RATIO</text>

                <rect x="6" y="28" width="608" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
                <text x="14" y="44" fill="#1e40af" fontSize="9" fontWeight="bold" fontFamily="monospace">10.0.1.10</text>
                <text x="240" y="44" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">203.0.113.10 (Dedicated)</text>
                <text x="460" y="44" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="monospace">1 : 1 (Permanent)</text>

                <text x="14" y="74" fill="#64748b" fontSize="8">
                  Use Case: Dedicated web/mail servers hosted internally requiring a static, unchanging public IP address.
                </text>
              </g>
            </g>
          )}

          {/* MODE 1: DYNAMIC NAT */}
          {mode === 1 && (
            <g transform="translate(20, 45)">
              <LaptopNode cx={70} cy={50} label="PRIVATE HOST" ip="10.0.1.25" active />
              <BoldArrow x1={110} y1={50} x2={270} y2={50} color="#2563eb" label="ACQUIRES IP" />
              
              {/* NAT Gateway with Pool */}
              <g transform="translate(320, 50)">
                <rect x="-45" y="-30" width="90" height="46" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="0" y="-10" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">IP POOL</text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">POOL ALLOCATOR</text>
              </g>

              <BoldArrow x1={375} y1={50} x2={530} y2={50} color="#10b981" label="ASSIGNED: 203.0.113.11" />
              <ServerNodeSVG cx={580} cy={50} label="INTERNET SERVER" sub="198.51.100.1:443" active success />

              {/* Pool Table */}
              <g transform="translate(20, 115)">
                <rect x="0" y="0" width="620" height="90" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
                <text x="14" y="20" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">PUBLIC IP POOL STATUS (203.0.113.10 - 203.0.113.15):</text>
                
                <g transform="translate(14, 30)">
                  {[
                    { ip: '203.0.113.10', status: 'IN USE (10.0.1.20)', busy: true },
                    { ip: '203.0.113.11', status: 'ASSIGNED (10.0.1.25)', busy: true },
                    { ip: '203.0.113.12', status: 'AVAILABLE', busy: false },
                    { ip: '203.0.113.13', status: 'AVAILABLE', busy: false },
                  ].map((p, i) => (
                    <g key={p.ip} transform={`translate(${i * 148}, 0)`}>
                      <rect x="0" y="0" width="140" height="32" rx="4" fill={p.busy ? '#fef2f2' : '#ecfdf5'} stroke={p.busy ? '#fca5a5' : '#86efac'} />
                      <text x="70" y="13" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{p.ip}</text>
                      <text x="70" y="25" textAnchor="middle" fill={p.busy ? '#dc2626' : '#15803d'} fontSize="7" fontWeight="bold">{p.status}</text>
                    </g>
                  ))}
                </g>
              </g>
            </g>
          )}

          {/* MODE 2: PAT (PORT ADDRESS TRANSLATION) */}
          {mode === 2 && (
            <g transform="translate(20, 45)">
              {/* 3 Private Hosts sharing ONE public IP */}
              <g transform="translate(30, 0)">
                {[
                  { ip: '192.168.1.10:5001', y: 0, color: '#3b82f6' },
                  { ip: '192.168.1.11:5002', y: 35, color: '#8b5cf6' },
                  { ip: '192.168.1.12:5003', y: 70, color: '#10b981' },
                ].map((h) => (
                  <g key={h.ip} transform={`translate(0, ${h.y})`}>
                    <rect x="0" y="0" width="135" height="26" rx="4" fill="#ffffff" stroke={h.color} strokeWidth="1.5" />
                    <text x="67" y="16" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">{h.ip}</text>
                    <path d="M 135 13 L 260 48" stroke={h.color} strokeWidth="2" strokeDasharray="3 3" />
                  </g>
                ))}
              </g>

              {/* PAT Gateway */}
              <g transform="translate(320, 48)">
                <rect x="-45" y="-30" width="90" height="46" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="0" y="-10" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold">PAT / OVERLOAD</text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">PORT MULTIPLEX</text>
              </g>

              <BoldArrow x1={375} y1={48} x2={520} y2={48} color="#10b981" label="1 PUBLIC IP + PORTS" />
              <ServerNodeSVG cx={570} cy={48} label="INTERNET" sub="Single IP Gateway" active success />

              {/* PAT Table */}
              <g transform="translate(20, 115)">
                <rect x="0" y="0" width="620" height="90" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
                <text x="14" y="16" fill="#334155" fontSize="8.5" fontWeight="bold" fontFamily="monospace">PAT (MANY-TO-ONE) OVERLOAD PORT MAPPINGS:</text>
                
                <g transform="translate(14, 26)">
                  <text x="0" y="14" fill="#1e40af" fontSize="8" fontFamily="monospace">192.168.1.10:5001 ──→ 203.0.113.10:5001 (Unique Port Assigned)</text>
                  <text x="0" y="30" fill="#6b21a8" fontSize="8" fontFamily="monospace">192.168.1.11:5002 ──→ 203.0.113.10:5002 (Unique Port Assigned)</text>
                  <text x="0" y="46" fill="#065f46" fontSize="8" fontFamily="monospace">192.168.1.12:5003 ──→ 203.0.113.10:5003 (Unique Port Assigned)</text>
                </g>
              </g>
            </g>
          )}

          {/* MODE 3: DNAT (DESTINATION NAT) */}
          {mode === 3 && (
            <g transform="translate(20, 45)">
              <ServerNodeSVG cx={70} cy={50} label="PUBLIC CLIENT" sub="198.51.100.5" active />
              <BoldArrow x1={110} y1={50} x2={270} y2={50} color="#2563eb" label="DST: 203.0.113.10:80" />

              {/* DNAT Gateway */}
              <g transform="translate(320, 50)">
                <rect x="-45" y="-30" width="90" height="46" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                <text x="0" y="-10" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold">DNAT ENGINE</text>
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">DEST REWRITE</text>
              </g>

              <BoldArrow x1={375} y1={50} x2={530} y2={50} color="#10b981" label="DST REWRITTEN TO PRIVATE" />
              <ServerNodeSVG cx={580} cy={50} label="INTERNAL WEB SERVER" sub="192.168.1.100:80" active success />

              {/* DNAT Table */}
              <g transform="translate(20, 115)">
                <rect x="0" y="0" width="620" height="90" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
                <rect x="0" y="0" width="620" height="22" fill="#f1f5f9" rx="5" />
                <text x="14" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">INCOMING DESTINATION IP/PORT</text>
                <text x="260" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">TRANSLATED INTERNAL DESTINATION</text>
                <text x="510" y="15" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">ACTION</text>

                <rect x="6" y="28" width="608" height="26" rx="4" fill="#faf5ff" stroke="#d8b4fe" />
                <text x="14" y="44" fill="#6b21a8" fontSize="9" fontWeight="bold" fontFamily="monospace">203.0.113.10 :80 (Public IP)</text>
                <text x="260" y="44" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">192.168.1.100 :80 (Private Server)</text>
                <text x="510" y="44" fill="#0f172a" fontSize="8.5" fontWeight="bold" fontFamily="monospace">Port Forwarded ✓</text>

                <text x="14" y="74" fill="#64748b" fontSize="8">
                  Use Case: Publishing internal web/database servers to the public internet securely through the firewall.
                </text>
              </g>
            </g>
          )}
        </g>
      )}

      {/* MODE 4: FULL 4-WAY COMPARISON MATRIX */}
      {mode === 4 && (
        <g transform="translate(30, 52)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="270" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="30" rx="9" fill="#0f172a" />
          <text x="20" y="19" fill="#ffffff" fontSize="11" fontWeight="bold">
            NAT FLAVORS ARCHITECTURAL COMPARISON (STATIC vs DYNAMIC vs PAT vs DNAT)
          </text>

          {[
            { name: 'Static NAT', formula: '1 Private : 1 Public', alloc: 'Dedicated / Fixed', dir: 'Bidirectional (In/Out)', use: 'Public Servers (Mail/Web)' },
            { name: 'Dynamic NAT', formula: 'N Private : M Public Pool', alloc: 'Dynamic Pool (First-come)', dir: 'Outbound Initiated', use: 'Temporary Egress Subnets' },
            { name: 'PAT / Overload', formula: 'Thousands : 1 Public IP', alloc: 'Port Multiplexing (5-tuple)', dir: 'Outbound Initiated', use: 'Corporate LAN / Homes (99%)' },
            { name: 'DNAT (Port Fwd)', formula: 'Public Port → Private IP', alloc: 'Destination IP/Port Rewrite', dir: 'Inbound Initiated', use: 'Publishing Internal Apps' },
          ].map((item, idx) => (
            <g key={item.name} transform={`translate(${16 + idx * 168}, 40)`}>
              <rect x="0" y="0" width="158" height="215" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
              <rect x="0" y="0" width="158" height="26" rx="7" fill="#1e293b" />
              <text x="79" y="17" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">{item.name}</text>

              <text x="10" y="46" fill="#64748b" fontSize="7.5" fontWeight="bold">MAPPING RATIO:</text>
              <text x="10" y="60" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">{item.formula}</text>

              <text x="10" y="85" fill="#64748b" fontSize="7.5" fontWeight="bold">ALLOCATION:</text>
              <text x="10" y="99" fill="#0f172a" fontSize="8" fontWeight="bold">{item.alloc}</text>

              <text x="10" y="124" fill="#64748b" fontSize="7.5" fontWeight="bold">TRAFFIC INITIATION:</text>
              <text x="10" y="138" fill="#1e40af" fontSize="8" fontWeight="bold">{item.dir}</text>

              <text x="10" y="163" fill="#64748b" fontSize="7.5" fontWeight="bold">PRIMARY USE CASE:</text>
              <text x="10" y="177" fill="#059669" fontSize="8" fontWeight="bold">{item.use}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};
