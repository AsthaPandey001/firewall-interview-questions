import React from 'react';

// ─────────────────────────────────────────────────────────
// BOLD ARROW / FIBER OPTIC CABLE WITH FLOW MARKER
// ─────────────────────────────────────────────────────────

interface BoldArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  reverse?: boolean;
  blocked?: boolean;
  label?: string;
  curveOffset?: number;
}

export const BoldArrow: React.FC<BoldArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = '#1e293b',
  strokeWidth = 3,
  dashed = false,
  reverse = false,
  blocked = false,
  label,
  curveOffset = 0,
}) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + curveOffset;
  const actualColor = blocked ? '#ef4444' : color;
  const id = `arrow-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}-${actualColor.replace('#', '')}`;

  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={actualColor} />
        </marker>
        <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={actualColor} floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Guide Cable Shadow */}
      <path
        d={curveOffset === 0 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={strokeWidth + 2.5}
        strokeLinecap="round"
      />

      {/* Main Bold Luminous Cable */}
      <path
        d={curveOffset === 0 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
        fill="none"
        stroke={actualColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={`url(#${id})`}
        filter="url(#cableGlow)"
        className={reverse ? 'animate-flow-reverse' : 'animate-flow-forward'}
      />

      {/* Centered Label Pill with Glass Shadow */}
      {label && (
        <g transform={`translate(${midX}, ${midY - 13})`}>
          <rect
            x="-48"
            y="-10"
            width="96"
            height="20"
            rx="10"
            fill="#ffffff"
            stroke={actualColor}
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.14))' }}
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fill={actualColor}
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// ─────────────────────────────────────────────────────────
// REALISTIC HOLOGRAPHIC DATA PACKET CARD
// ─────────────────────────────────────────────────────────

interface PacketCardProps {
  cx: number;
  cy: number;
  title?: string;
  protocol?: string;
  port?: string | number;
  src?: string;
  dst?: string;
  flags?: string;
  status?: 'ALLOW' | 'DENY' | 'INSPECT' | 'ENCRYPT' | 'DECRYPT' | 'THREAT' | 'NORMAL';
  isEncrypted?: boolean;
  scale?: number;
}

export const PacketCard: React.FC<PacketCardProps> = ({
  cx,
  cy,
  title = 'DATA PACKET',
  protocol = 'TCP',
  port = '443',
  src = '10.0.0.25',
  dst = 'SERVER',
  flags,
  status = 'NORMAL',
  isEncrypted = false,
  scale = 1,
}) => {
  const statusColors = {
    NORMAL: { border: '#2563eb', bg: '#ffffff', headerBg: '#eff6ff', text: '#1e3a8a', badgeBg: '#dbeafe', badgeText: '#1d4ed8' },
    ALLOW: { border: '#10b981', bg: '#ffffff', headerBg: '#ecfdf5', text: '#065f46', badgeBg: '#d1fae5', badgeText: '#047857' },
    DENY: { border: '#ef4444', bg: '#ffffff', headerBg: '#fef2f2', text: '#991b1b', badgeBg: '#fee2e2', badgeText: '#b91c1c' },
    INSPECT: { border: '#f59e0b', bg: '#ffffff', headerBg: '#fef3c7', text: '#92400e', badgeBg: '#fef3c7', badgeText: '#b45309' },
    ENCRYPT: { border: '#8b5cf6', bg: '#ffffff', headerBg: '#faf5ff', text: '#6b21a8', badgeBg: '#f3e8ff', badgeText: '#7e22ce' },
    DECRYPT: { border: '#06b6d4', bg: '#ffffff', headerBg: '#ecfeff', text: '#155e75', badgeBg: '#cffafe', badgeText: '#0e7490' },
    THREAT: { border: '#dc2626', bg: '#ffffff', headerBg: '#fef2f2', text: '#991b1b', badgeBg: '#fee2e2', badgeText: '#991b1b' },
  };

  const c = statusColors[status] || statusColors.NORMAL;

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} className="animate-pop-in select-none">
      {/* Outer Card with Metallic Bevel */}
      <rect
        x="-48"
        y="-22"
        width="96"
        height="44"
        rx="6"
        fill={c.bg}
        stroke={c.border}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 4px 10px ${c.border}40)` }}
      />
      {/* Top Header Bar */}
      <rect x="-47" y="-21" width="94" height="14" rx="5" fill={c.headerBg} />
      <line x1="-47" y1="-7" x2="47" y2="-7" stroke={c.border} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Header Label */}
      <text
        x="0"
        y="-11"
        textAnchor="middle"
        fill={c.text}
        fontSize="7.5"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.4"
      >
        {isEncrypted ? '🔒 ENCRYPTED' : title}
      </text>

      {/* Main Body Info (Protocol & Port) */}
      <text
        x="-40"
        y="4"
        fill="#0f172a"
        fontSize="7.5"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {protocol} :{port}
      </text>
      {flags && (
        <text
          x="40"
          y="4"
          textAnchor="end"
          fill="#2563eb"
          fontSize="7"
          fontWeight="bold"
          fontFamily="monospace"
        >
          [{flags}]
        </text>
      )}

      {/* Source to Dest */}
      <text
        x="0"
        y="15"
        textAnchor="middle"
        fill="#475569"
        fontSize="7"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {src} → {dst}
      </text>

      {/* Decision / Status Tag on Top Right */}
      {status !== 'NORMAL' && (
        <g transform="translate(38, -22)">
          <rect
            x="-16"
            y="-6"
            width="32"
            height="12"
            rx="6"
            fill={c.border}
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="6.5"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {status}
          </text>
        </g>
      )}
    </g>
  );
};

// ─────────────────────────────────────────────────────────
// REALISTIC HARDWARE SVG NODES
// ─────────────────────────────────────────────────────────

export const LaptopNode: React.FC<{
  cx: number;
  cy: number;
  label: string;
  ip?: string;
  active?: boolean;
  success?: boolean;
  danger?: boolean;
}> = ({ cx, cy, label, ip, active, success, danger }) => {
  const stroke = danger ? '#ef4444' : success ? '#10b981' : active ? '#2563eb' : '#64748b';
  const glow = danger ? '#ef444425' : success ? '#10b98125' : active ? '#2563eb25' : 'transparent';

  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {/* Outer Halo */}
      {active && <circle cx="0" cy="-8" r="40" fill={glow} />}
      
      {/* Metallic Laptop Bezel */}
      <rect x="-26" y="-32" width="52" height="34" rx="4" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      
      {/* Screen Glass Inset */}
      <rect x="-22" y="-28" width="44" height="26" rx="2" fill="#020617" />
      
      {/* Code Editor Window Header */}
      <rect x="-22" y="-28" width="44" height="6" rx="1.5" fill="#1e293b" />
      <circle cx="-18" cy="-25" r="1" fill="#ef4444" />
      <circle cx="-15" cy="-25" r="1" fill="#f59e0b" />
      <circle cx="-12" cy="-25" r="1" fill="#10b981" />

      {/* Terminal Syntax Lines */}
      <rect x="-18" y="-19" width="20" height="2" rx="1" fill={active ? '#38bdf8' : '#475569'} />
      <rect x="-18" y="-14" width="28" height="2" rx="1" fill={active ? '#818cf8' : '#334155'} />
      <rect x="-18" y="-9" width="14" height="2" rx="1" fill={active ? '#4ade80' : '#334155'} />

      {/* Aluminum Base & Keyboard Deck */}
      <path d="M -30 2 Q -28 0 -24 0 L 24 0 Q 28 0 30 2 L 28 7 L -28 7 Z" fill="#334155" stroke="#1e293b" strokeWidth="1" />
      <rect x="-8" y="3" width="16" height="3" rx="1" fill="#1e293b" />

      {/* Label & IP Badge */}
      <text x="0" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {ip && (
        <text x="0" y="31" textAnchor="middle" fontSize="8" fontWeight="bold" fill={stroke} fontFamily="monospace">
          {ip}
        </text>
      )}
    </g>
  );
};

export const FirewallGatewayNode: React.FC<{
  cx: number;
  cy: number;
  label?: string;
  sub?: string;
  active?: boolean;
  success?: boolean;
  danger?: boolean;
  scannerActive?: boolean;
}> = ({ cx, cy, label = 'FIREWALL', sub = 'Security Gateway', active, success, danger, scannerActive }) => {
  const stroke = danger ? '#ef4444' : success ? '#10b981' : active ? '#2563eb' : '#475569';
  const glow = danger ? '#ef444425' : success ? '#10b98125' : active ? '#2563eb25' : 'transparent';
  const shieldFill = danger ? '#dc2626' : success ? '#059669' : active ? '#2563eb' : '#475569';

  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {/* Outer Halo */}
      {active && <circle cx="0" cy="-8" r="44" fill={glow} />}
      
      {/* Security Appliance 1U Rack Housing */}
      <rect x="-32" y="-32" width="64" height="42" rx="6" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      
      {/* Rack Ears with Screws */}
      <rect x="-35" y="-28" width="3" height="34" rx="1" fill="#334155" />
      <circle cx="-33.5" cy="-22" r="1" fill="#94a3b8" />
      <circle cx="-33.5" cy="0" r="1" fill="#94a3b8" />
      <rect x="32" y="-28" width="3" height="34" rx="1" fill="#334155" />
      <circle cx="33.5" cy="-22" r="1" fill="#94a3b8" />
      <circle cx="33.5" cy="0" r="1" fill="#94a3b8" />

      {/* Cooling Intake Grid Lines */}
      <line x1="-24" y1="-24" x2="0" y2="-24" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-24" y1="-19" x2="0" y2="-19" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* 3D Security Crest Shield Emblem */}
      <path
        d="M 14 -24 L 24 -19 V -11 C 24 -5 14 -1 14 -1 C 14 -1 4 -5 4 -11 V -19 Z"
        fill={shieldFill}
        stroke="#ffffff"
        strokeWidth="1.3"
      />
      <path d="M 10 -11 L 13 -8 L 19 -14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Holographic Laser Sweep Scanner */}
      {scannerActive && (
        <line x1="-26" y1="-8" x2="26" y2="-8" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" className="animate-pulse" />
      )}

      {/* Interface Port LEDs */}
      <rect x="-24" y="-3" width="7" height="6" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
      <circle cx="-20.5" cy="-5" r="1.2" fill={success ? '#10b981' : danger ? '#ef4444' : '#38bdf8'} />
      <rect x="-14" y="-3" width="7" height="6" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
      <circle cx="-10.5" cy="-5" r="1.2" fill="#10b981" />

      {/* Diagnostic LEDs */}
      <circle cx="16" cy="3" r="1.5" fill="#10b981" />
      <circle cx="22" cy="3" r="1.5" fill={active ? '#38bdf8' : '#64748b'} />

      {/* Label & Subtitle */}
      <text x="0" y="22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {sub && (
        <text x="0" y="33" textAnchor="middle" fontSize="8" fontWeight="bold" fill={stroke} fontFamily="monospace">
          {sub}
        </text>
      )}
    </g>
  );
};

export const ServerNodeSVG: React.FC<{
  cx: number;
  cy: number;
  label?: string;
  sub?: string;
  active?: boolean;
  success?: boolean;
  danger?: boolean;
}> = ({ cx, cy, label = 'SERVER', sub = '203.0.113.50:443', active, success, danger }) => {
  const stroke = danger ? '#ef4444' : success ? '#10b981' : active ? '#2563eb' : '#64748b';
  const glow = danger ? '#ef444425' : success ? '#10b98125' : active ? '#2563eb25' : 'transparent';

  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {/* Outer Halo */}
      {active && <circle cx="0" cy="-8" r="42" fill={glow} />}
      
      {/* Datacenter Server Chassis */}
      <rect x="-26" y="-34" width="52" height="46" rx="5" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      
      {/* 3 Hot-Swap Blade Server Bays */}
      {[-28, -16, -4].map((oy, i) => (
        <g key={i}>
          <rect x="-22" y={oy} width="44" height="9" rx="1.8" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
          <line x1="-18" y1={oy + 4.5} x2="4" y2={oy + 4.5} stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="12" cy={oy + 4.5} r="1.5" fill={active ? '#22c55e' : '#64748b'} />
          <circle cx="17" cy={oy + 4.5} r="1.5" fill={active ? '#38bdf8' : '#64748b'} />
        </g>
      ))}

      {/* Label & Subtitle */}
      <text x="0" y="22" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {sub && (
        <text x="0" y="33" textAnchor="middle" fontSize="8" fontWeight="bold" fill={stroke} fontFamily="monospace">
          {sub}
        </text>
      )}
    </g>
  );
};

export const RouterNodeSVG: React.FC<{
  cx: number;
  cy: number;
  label?: string;
  sub?: string;
  active?: boolean;
}> = ({ cx, cy, label = 'ROUTER', sub = 'Edge Gateway', active }) => {
  const stroke = active ? '#2563eb' : '#64748b';
  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {active && <circle cx="0" cy="-8" r="38" fill="#2563eb25" />}
      <circle cx="0" cy="-8" r="24" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      {/* Cross Routing Arrows */}
      <path d="M -11 -8 L 11 -8 M 7 -12 L 11 -8 L 7 -4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 0 -19 L 0 3 M -4 -15 L 0 -19 L 4 -15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="0" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {sub && (
        <text x="0" y="35" textAnchor="middle" fontSize="8" fontWeight="bold" fill={stroke} fontFamily="monospace">
          {sub}
        </text>
      )}
    </g>
  );
};
