import React from 'react';

// ─────────────────────────────────────────────────────────
// BOLD ARROW WITH FLOW MARKER
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
      </defs>

      {/* Guide background path line */}
      <path
        d={curveOffset === 0 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={strokeWidth + 1.5}
        strokeLinecap="round"
      />

      {/* Main bold animated line */}
      <path
        d={curveOffset === 0 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
        fill="none"
        stroke={actualColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={`url(#${id})`}
        className={reverse ? 'animate-flow-reverse' : 'animate-flow-forward'}
      />

      {/* Centered label pill */}
      {label && (
        <g transform={`translate(${midX}, ${midY - 12})`}>
          <rect
            x="-44"
            y="-9"
            width="88"
            height="18"
            rx="9"
            fill="#ffffff"
            stroke={actualColor}
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
          />
          <text
            x="0"
            y="3"
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
// VISIBLE COMPACT PACKET CARD
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
      {/* Outer Card */}
      <rect
        x="-46"
        y="-21"
        width="92"
        height="42"
        rx="5"
        fill={c.bg}
        stroke={c.border}
        strokeWidth="1.8"
        style={{ filter: `drop-shadow(0 2px 5px ${c.border}30)` }}
      />
      {/* Top Header Bar */}
      <rect x="-45" y="-20" width="90" height="13" rx="4" fill={c.headerBg} />
      <line x1="-45" y1="-7" x2="45" y2="-7" stroke={c.border} strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Header Label */}
      <text
        x="0"
        y="-11"
        textAnchor="middle"
        fill={c.text}
        fontSize="7"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.4"
      >
        {isEncrypted ? '🔒 ENCRYPTED' : title}
      </text>

      {/* Main Body Info */}
      <text
        x="-38"
        y="4"
        fill="#0f172a"
        fontSize="7"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {protocol} :{port}
      </text>
      {flags && (
        <text
          x="38"
          y="4"
          textAnchor="end"
          fill="#2563eb"
          fontSize="6.5"
          fontWeight="bold"
          fontFamily="monospace"
        >
          [{flags}]
        </text>
      )}

      {/* Source to Dest */}
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fill="#475569"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {src} → {dst}
      </text>

      {/* Decision / Status Tag on Top Right */}
      {status !== 'NORMAL' && (
        <g transform="translate(36, -21)">
          <rect
            x="-14"
            y="-5"
            width="28"
            height="11"
            rx="5.5"
            fill={c.border}
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="6"
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
// DEVICE NODES (SVG)
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
  const glow = danger ? '#ef444420' : success ? '#10b98120' : active ? '#2563eb20' : 'transparent';

  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {active && <circle cx="0" cy="-8" r="36" fill={glow} />}
      {/* Screen */}
      <rect x="-24" y="-30" width="48" height="30" rx="4" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      <rect x="-20" y="-26" width="40" height="22" rx="2" fill="#1e293b" />
      {/* Terminal lines */}
      <rect x="-16" y="-21" width="18" height="2" rx="1" fill={active ? '#38bdf8' : '#475569'} />
      <rect x="-16" y="-16" width="24" height="2" rx="1" fill={active ? '#818cf8' : '#334155'} />
      <rect x="-16" y="-11" width="12" height="2" rx="1" fill={active ? '#4ade80' : '#334155'} />
      {/* Base */}
      <path d="M -28 0 Q -26 -2 -22 -2 L 22 -2 Q 26 -2 28 0 L 26 5 L -26 5 Z" fill="#334155" stroke="#1e293b" strokeWidth="1" />
      {/* Label */}
      <text x="0" y="18" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {ip && (
        <text x="0" y="29" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill={stroke} fontFamily="monospace">
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
  const glow = danger ? '#ef444420' : success ? '#10b98120' : active ? '#2563eb20' : 'transparent';

  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {active && <circle cx="0" cy="-8" r="40" fill={glow} />}
      {/* Security Appliance Box */}
      <rect x="-28" y="-30" width="56" height="38" rx="6" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      {/* Grid lines / vents */}
      <line x1="-20" y1="-22" x2="20" y2="-22" stroke="#334155" strokeWidth="1" />
      <line x1="-20" y1="-16" x2="20" y2="-16" stroke="#334155" strokeWidth="1" />
      {/* Shield icon */}
      <path
        d="M 0 -11 L 10 -6 V 2 C 10 8 0 12 0 12 C 0 12 -10 8 -10 2 V -6 Z"
        fill={danger ? '#dc2626' : success ? '#059669' : active ? '#2563eb' : '#475569'}
        stroke="#ffffff"
        strokeWidth="1.2"
      />
      <path d="M -3 1 L 0 4 L 4 -2" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Scanner effect */}
      {scannerActive && (
        <line x1="-24" y1="-6" x2="24" y2="-6" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" className="animate-pulse" />
      )}
      {/* Port LEDs */}
      <circle cx="18" cy="4" r="1.8" fill={success ? '#10b981' : danger ? '#ef4444' : active ? '#38bdf8' : '#64748b'} />
      <circle cx="12" cy="4" r="1.8" fill="#10b981" />
      {/* Label */}
      <text x="0" y="20" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {sub && (
        <text x="0" y="31" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill={stroke} fontFamily="monospace">
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
  const glow = danger ? '#ef444420' : success ? '#10b98120' : active ? '#2563eb20' : 'transparent';

  return (
    <g transform={`translate(${cx}, ${cy})`} className="select-none">
      {active && <circle cx="0" cy="-8" r="38" fill={glow} />}
      {/* Server Rack Chassis */}
      <rect x="-24" y="-32" width="48" height="42" rx="4" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      {/* 3 Rack Units */}
      {[-26, -15, -4].map((oy, i) => (
        <g key={i}>
          <rect x="-20" y={oy} width="40" height="8" rx="1.5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
          <line x1="-16" y1={oy + 4} x2="0" y2={oy + 4} stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="10" cy={oy + 4} r="1.3" fill={active ? '#22c55e' : '#64748b'} />
          <circle cx="15" cy={oy + 4} r="1.3" fill={active ? '#38bdf8' : '#64748b'} />
        </g>
      ))}
      {/* Label */}
      <text x="0" y="20" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {sub && (
        <text x="0" y="31" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill={stroke} fontFamily="monospace">
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
      {active && <circle cx="0" cy="-8" r="36" fill="#2563eb20" />}
      <circle cx="0" cy="-8" r="22" fill="#0f172a" stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
      {/* Cross arrows */}
      <path d="M -10 -8 L 10 -8 M 6 -12 L 10 -8 L 6 -4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 0 -18 L 0 2 M -4 -14 L 0 -18 L 4 -14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="0" y="22" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
        {label}
      </text>
      {sub && (
        <text x="0" y="33" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill={stroke} fontFamily="monospace">
          {sub}
        </text>
      )}
    </g>
  );
};
