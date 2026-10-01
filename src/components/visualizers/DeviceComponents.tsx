import React from 'react';
import { Shield } from 'lucide-react';

interface DeviceProps {
  label: string;
  sublabel: string;
  isActive?: boolean;
  isSuccess?: boolean;
  isDanger?: boolean;
  statusText?: string;
  ip?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. ULTRA-REALISTIC DEVELOPER LAPTOP (MacBook Pro / ThinkPad)
// ─────────────────────────────────────────────────────────────
export const RealisticLaptop: React.FC<DeviceProps> = ({
  label,
  sublabel,
  isActive = false,
  isSuccess = false,
  isDanger = false,
  statusText,
  ip
}) => {
  const haloClass = isDanger
    ? 'bg-rose-50/95 ring-8 ring-rose-500/25 border-rose-400 shadow-lg shadow-rose-500/10 scale-105'
    : isSuccess
      ? 'bg-emerald-50/95 ring-8 ring-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-105'
      : isActive
        ? 'bg-blue-50/95 ring-8 ring-blue-500/25 border-blue-400 shadow-lg shadow-blue-500/10 scale-105 animate-hardware-pulse'
        : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {/* Floating Status Pill */}
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-mono font-bold shadow-md ${
            isSuccess ? 'bg-emerald-600' : isDanger ? 'bg-rose-600' : 'bg-blue-600'
          }`}>
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Glowing Aura Frame */}
      <div className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="104" height="80" viewBox="0 0 120 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Metallic Aluminum Bezel Gradient */}
              <linearGradient id="laptopChassis" x1="0" y1="0" x2="120" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              {/* Screen Glass Reflection */}
              <linearGradient id="screenGlass" x1="16" y1="8" x2="104" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              {/* Diagonal Gloss Sheen */}
              <linearGradient id="glassGloss" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Laptop Screen Lid / Metallic Outer Shell */}
            <rect x="14" y="6" width="92" height="60" rx="5" fill="url(#laptopChassis)" stroke={isActive ? '#3b82f6' : '#475569'} strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Screen Bezel Inset */}
            <rect x="18" y="10" width="84" height="52" rx="3" fill="url(#screenGlass)" />
            
            {/* Screen Glass Diagonal Gloss Highlight */}
            <path d="M 18 10 L 80 10 L 40 62 L 18 62 Z" fill="url(#glassGloss)" />

            {/* Window Top Header Bar with Traffic Light Dots */}
            <rect x="18" y="10" width="84" height="8" rx="2" fill="#1e293b" />
            <circle cx="24" cy="14" r="1.5" fill="#ef4444" />
            <circle cx="29" cy="14" r="1.5" fill="#f59e0b" />
            <circle cx="34" cy="14" r="1.5" fill="#10b981" />
            <rect x="42" y="12.5" width="36" height="3" rx="1" fill="#334155" />

            {/* Terminal Code Lines with Syntax Colors */}
            <rect x="23" y="23" width="24" height="2.5" rx="1" fill="#ec4899" />
            <rect x="50" y="23" width="32" height="2.5" rx="1" fill="#38bdf8" />
            
            <rect x="23" y="29" width="46" height="2.5" rx="1" fill="#a855f7" />
            <rect x="72" y="29" width="16" height="2.5" rx="1" fill="#4ade80" />
            
            <rect x="23" y="35" width="30" height="2.5" rx="1" fill="#facc15" />
            <rect x="56" y="35" width="22" height="2.5" rx="1" fill="#38bdf8" />

            <rect x="23" y="41" width="58" height="2.5" rx="1" fill="#64748b" />
            <rect x="23" y="47" width="36" height="2.5" rx="1" fill="#22c55e" />

            {/* Web Camera Aperture Dot */}
            <circle cx="60" cy="8" r="1.2" fill="#0f172a" />
            <circle cx="60" cy="8" r="0.6" fill="#38bdf8" />

            {/* Laptop Base Hinge */}
            <rect x="44" y="66" width="32" height="3" rx="1" fill="#0f172a" />

            {/* Aluminum Unibody Keyboard Base Deck */}
            <path d="M 4 70 C 4 67 7 65 10 65 L 110 65 C 113 65 116 67 116 70 L 120 84 C 120 87 117 89 114 89 L 6 89 C 3 89 0 87 0 84 Z" fill="url(#laptopChassis)" stroke="#1e293b" strokeWidth="1" />
            
            {/* Keyboard Well Inset */}
            <rect x="18" y="68" width="84" height="8" rx="2" fill="#090d16" stroke="#334155" strokeWidth="0.5" />
            
            {/* Trackpad with Chamfered Border */}
            <rect x="46" y="78" width="28" height="8" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />

            {/* Front Lip Grip Groove */}
            <rect x="52" y="87" width="16" height="1.5" rx="0.75" fill="#475569" />

            {/* Active Display Glow */}
            {isActive && (
              <circle cx="60" cy="36" r="28" fill="#3b82f6" fillOpacity="0.12" />
            )}
          </svg>

          {/* Pulse Dot */}
          {isActive && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 shadow-md"></span>
            </span>
          )}
        </div>
      </div>

      {/* Label & IP Badge */}
      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 mt-0.5 shadow-2xs">
        {ip || sublabel}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. ULTRA-REALISTIC ENTERPRISE FIREWALL / SECURITY APPLIANCE
// ─────────────────────────────────────────────────────────────
export const RealisticRouterFirewall: React.FC<DeviceProps> = ({
  label,
  sublabel,
  isActive = false,
  isSuccess = false,
  isDanger = false,
  statusText,
  ip
}) => {
  const haloClass = isDanger
    ? 'bg-rose-50/95 ring-8 ring-rose-500/25 border-rose-400 shadow-lg shadow-rose-500/15 scale-105'
    : isSuccess
      ? 'bg-emerald-50/95 ring-8 ring-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/15 scale-105'
      : isActive
        ? 'bg-blue-50/95 ring-8 ring-blue-500/25 border-blue-400 shadow-lg shadow-blue-500/15 scale-105 animate-hardware-pulse'
        : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300';

  const borderColor = isSuccess ? '#10b981' : isDanger ? '#ef4444' : isActive ? '#3b82f6' : '#334155';
  const badgeColor = isSuccess ? '#059669' : isDanger ? '#dc2626' : '#2563eb';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {/* Floating Verdict or Action Pill */}
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-mono font-bold shadow-md ${
            isSuccess ? 'bg-emerald-600' : isDanger ? 'bg-rose-600' : 'bg-blue-600'
          }`}>
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Glowing Aura Frame */}
      <div className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="108" height="82" viewBox="0 0 120 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Heavy Metal Brushed Chassis */}
              <linearGradient id="fwMetal" x1="0" y1="0" x2="120" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              {/* Front Plate Inset */}
              <linearGradient id="fwPlate" x1="12" y1="16" x2="108" y2="76" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>
              {/* Laser Beam Scanner Gradient */}
              <linearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 1U / 2U Rackmount Security Appliance Chassis */}
            <rect x="8" y="14" width="104" height="64" rx="7" fill="url(#fwMetal)" stroke={borderColor} strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Left Rack Ear Bracket with Hex Screws */}
            <rect x="2" y="20" width="6" height="52" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <circle cx="5" cy="28" r="1.8" fill="#64748b" stroke="#0f172a" strokeWidth="0.8" />
            <circle cx="5" cy="64" r="1.8" fill="#64748b" stroke="#0f172a" strokeWidth="0.8" />

            {/* Right Rack Ear Bracket with Hex Screws */}
            <rect x="112" y="20" width="6" height="52" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <circle cx="115" cy="28" r="1.8" fill="#64748b" stroke="#0f172a" strokeWidth="0.8" />
            <circle cx="115" cy="64" r="1.8" fill="#64748b" stroke="#0f172a" strokeWidth="0.8" />

            {/* Beveled Front Inset Panel */}
            <rect x="14" y="20" width="92" height="52" rx="4" fill="url(#fwPlate)" stroke="#1f2937" strokeWidth="1" />

            {/* Honeycomb Cooling Vents (Top Left) */}
            <line x1="20" y1="26" x2="48" y2="26" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
            <line x1="20" y1="31" x2="48" y2="31" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
            <line x1="20" y1="36" x2="48" y2="36" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

            {/* 3D Security Shield Emblem (Center Core) */}
            <path d="M 60 25 L 75 32 V 46 C 75 56 60 63 60 63 C 60 63 45 56 45 46 V 32 L 60 25 Z" fill={badgeColor} stroke="#ffffff" strokeWidth="2" />
            
            {/* Keyhole / Checkmark core symbol */}
            <path d="M 55 43 L 59 47 L 66 39" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Active Holographic Laser Sweep Scanner Line */}
            {isActive && (
              <g className="animate-pulse">
                <line x1="18" y1="46" x2="102" y2="46" stroke="url(#laserBeam)" strokeWidth="2" />
                <line x1="18" y1="46" x2="102" y2="46" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
              </g>
            )}

            {/* Gigabit RJ45 & SFP+ Fiber Ports (Bottom Right) */}
            <rect x="80" y="26" width="8" height="7" rx="1.5" fill="#1f2937" stroke="#4b5563" strokeWidth="0.8" />
            <circle cx="84" cy="24" r="1.3" fill="#10b981" />
            <rect x="91" y="26" width="8" height="7" rx="1.5" fill="#1f2937" stroke="#4b5563" strokeWidth="0.8" />
            <circle cx="95" cy="24" r="1.3" fill={isActive ? '#38bdf8' : '#64748b'} />
            
            <rect x="80" y="37" width="8" height="7" rx="1.5" fill="#1f2937" stroke="#4b5563" strokeWidth="0.8" />
            <circle cx="84" cy="35" r="1.3" fill="#10b981" />
            <rect x="91" y="37" width="8" height="7" rx="1.5" fill="#1f2937" stroke="#4b5563" strokeWidth="0.8" />
            <circle cx="95" cy="35" r="1.3" fill={isDanger ? '#ef4444' : '#10b981'} />

            {/* Diagnostic Matrix LEDs */}
            <circle cx="22" cy="62" r="1.8" fill="#10b981" />
            <circle cx="28" cy="62" r="1.8" fill={isActive ? '#38bdf8' : '#475569'} />
            <circle cx="34" cy="62" r="1.8" fill={isDanger ? '#ef4444' : '#10b981'} />
            
            {/* LCD Status Display Panel */}
            <rect x="42" y="60" width="36" height="5" rx="1" fill="#020617" stroke="#374151" strokeWidth="0.5" />
            <rect x="44" y="61.5" width="18" height="2" rx="0.5" fill="#38bdf8" />
            <rect x="64" y="61.5" width="10" height="2" rx="0.5" fill="#4ade80" />

            {/* Rubber Mounting Base Feet */}
            <rect x="22" y="78" width="16" height="4" rx="2" fill="#0f172a" />
            <rect x="82" y="78" width="16" height="4" rx="2" fill="#0f172a" />
          </svg>

          {/* Floating Security Shield Badge on Corner */}
          <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md border border-slate-200">
            <Shield className={`h-4 w-4 ${
              isSuccess ? 'text-emerald-600' : isDanger ? 'text-rose-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
      </div>

      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 mt-0.5 shadow-2xs">
        {ip || sublabel}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. ULTRA-REALISTIC DATACENTER BLADE WEB SERVER
// ─────────────────────────────────────────────────────────────
export const RealisticServer: React.FC<DeviceProps> = ({
  label,
  sublabel,
  isActive = false,
  isSuccess = false,
  isDanger = false,
  statusText,
  ip
}) => {
  const haloClass = isDanger
    ? 'bg-rose-50/95 ring-8 ring-rose-500/25 border-rose-400 shadow-lg shadow-rose-500/15 scale-105'
    : isSuccess
      ? 'bg-emerald-50/95 ring-8 ring-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/15 scale-105'
      : isActive
        ? 'bg-emerald-50/95 ring-8 ring-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/15 scale-105 animate-hardware-pulse'
        : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {/* Floating Status Pill */}
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-md">
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Glowing Aura Frame */}
      <div className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="104" height="82" viewBox="0 0 120 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="serverMetal" x1="0" y1="0" x2="120" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Heavy Server Rack Enclosure */}
            <rect x="16" y="8" width="88" height="76" rx="5" fill="url(#serverMetal)" stroke={isActive ? '#10b981' : '#475569'} strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Server Rack Ear Screws */}
            <circle cx="20" cy="14" r="1.5" fill="#64748b" />
            <circle cx="20" cy="78" r="1.5" fill="#64748b" />
            <circle cx="100" cy="14" r="1.5" fill="#64748b" />
            <circle cx="100" cy="78" r="1.5" fill="#64748b" />

            {/* Server Unit Bay 1 (Hot-swap Drive Caddy) */}
            <rect x="22" y="14" width="76" height="20" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="28" cy="24" r="2.2" fill="#10b981" />
            <circle cx="35" cy="24" r="2.2" fill={isActive ? '#38bdf8' : '#10b981'} />
            {/* Drive Latch Handle */}
            <rect x="44" y="20" width="46" height="8" rx="1.5" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            <line x1="50" y1="24" x2="72" y2="24" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="84" cy="24" r="1.5" fill="#10b981" />

            {/* Server Unit Bay 2 (Hot-swap Drive Caddy) */}
            <rect x="22" y="38" width="76" height="20" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="28" cy="48" r="2.2" fill="#10b981" />
            <circle cx="35" cy="48" r="2.2" fill={isActive ? '#10b981' : '#64748b'} />
            {/* Drive Latch Handle */}
            <rect x="44" y="44" width="46" height="8" rx="1.5" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            <line x1="50" y1="48" x2="72" y2="48" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="84" cy="48" r="1.5" fill={isDanger ? '#ef4444' : '#10b981'} />

            {/* Server Unit Bay 3 (Power Supply & Fan Intake) */}
            <rect x="22" y="62" width="76" height="18" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="28" cy="71" r="2.2" fill="#10b981" />
            {/* Fan Intake Mesh Lines */}
            <line x1="44" y1="67" x2="78" y2="67" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
            <line x1="44" y1="74" x2="78" y2="74" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
            <circle cx="86" cy="71" r="2.5" fill="#10b981" />
          </svg>

          {/* Activity Glow Dot */}
          {isActive && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600 shadow-md"></span>
            </span>
          )}
        </div>
      </div>

      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5 shadow-2xs">
        {ip || sublabel}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 4. REALISTIC MANAGED NETWORK SWITCH
// ─────────────────────────────────────────────────────────────
export const RealisticSwitch: React.FC<DeviceProps> = ({
  label,
  sublabel,
  isActive = false,
  isSuccess = false,
  isDanger = false,
  statusText,
  ip
}) => {
  const haloClass = isDanger
    ? 'bg-rose-50/95 ring-8 ring-rose-500/25 border-rose-400 shadow-lg scale-105'
    : isSuccess
      ? 'bg-emerald-50/95 ring-8 ring-emerald-500/25 border-emerald-400 shadow-lg scale-105'
      : isActive
        ? 'bg-blue-50/95 ring-8 ring-blue-500/25 border-blue-400 shadow-lg scale-105'
        : 'bg-slate-50/60 border-slate-200/80';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md">
            {statusText}
          </span>
        </div>
      )}

      <div className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="104" height="80" viewBox="0 0 120 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="24" width="104" height="44" rx="5" fill="#0f172a" stroke={isActive ? '#2563eb' : '#475569'} strokeWidth={isActive ? '2.5' : '1.5'} />
            <rect x="2" y="28" width="6" height="36" rx="1.5" fill="#334155" />
            <rect x="112" y="28" width="6" height="36" rx="1.5" fill="#334155" />
            
            {/* 8 Gigabit RJ45 Ports in Dual Stack */}
            {[20, 32, 44, 56, 68, 80, 92].map((x, i) => (
              <g key={i}>
                <rect x={x} y="32" width="9" height="7" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                <circle cx={x + 4.5} cy="30" r="1.2" fill={i % 2 === 0 ? '#10b981' : '#38bdf8'} />
                <rect x={x} y="43" width="9" height="7" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 mt-0.5">
        {ip || sublabel}
      </span>
    </div>
  );
};
