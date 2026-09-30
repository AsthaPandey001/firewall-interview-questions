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

// 1. Realistic Laptop Component with Glowing Screen and Circular Halo
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
    ? 'bg-rose-50/90 ring-8 ring-rose-500/20 border-rose-300 shadow-md scale-105'
    : isSuccess
      ? 'bg-emerald-50/90 ring-8 ring-emerald-500/20 border-emerald-300 shadow-md scale-105'
      : isActive
        ? 'bg-blue-50/90 ring-8 ring-blue-500/20 border-blue-300 shadow-md scale-105'
        : 'bg-slate-50/40 border-slate-200/70 opacity-75 hover:opacity-100';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {/* Active step tooltip badge */}
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-md">
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Glowing Background Frame */}
      <div className={`p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="86" height="66" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Laptop Screen Bezel */}
            <rect x="12" y="8" width="76" height="52" rx="4" fill="#1e293b" stroke={isActive ? '#2563eb' : '#475569'} strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Screen Glass */}
            <rect x="16" y="12" width="68" height="44" rx="2" fill="#0f172a" />
            
            {/* Browser Window Bar on Screen */}
            <rect x="16" y="12" width="68" height="8" fill="#1e293b" />
            <circle cx="21" cy="16" r="1.5" fill="#ef4444" />
            <circle cx="25" cy="16" r="1.5" fill="#f59e0b" />
            <circle cx="29" cy="16" r="1.5" fill="#10b981" />
            <rect x="35" y="14" width="30" height="4" rx="1" fill="#334155" />

            {/* Screen Content - Terminal Lines */}
            <rect x="20" y="24" width="36" height="2.5" rx="1" fill={isActive ? '#38bdf8' : '#64748b'} />
            <rect x="20" y="30" width="48" height="2.5" rx="1" fill={isActive ? '#818cf8' : '#475569'} />
            <rect x="20" y="36" width="28" height="2.5" rx="1" fill={isActive ? '#4ade80' : '#334155'} />

            {/* Screen Camera Dot */}
            <circle cx="50" cy="10" r="1" fill="#64748b" />

            {/* Laptop Base (Hinge & Keyboard) */}
            <path d="M4 64C4 62 6 60 8 60H92C94 60 96 62 96 64L100 72C100 74 98 76 96 76H4C2 76 0 74 0 72L4 64Z" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            
            {/* Laptop Base Notch / Trackpad */}
            <rect x="42" y="60" width="16" height="3" rx="1.5" fill="#1e293b" />
            <rect x="38" y="67" width="24" height="6" rx="1" fill="#1e293b" />

            {/* Active Glow Effect */}
            {isActive && (
              <circle cx="50" cy="34" r="24" fill="#3b82f6" fillOpacity="0.1" />
            )}
          </svg>

          {/* Pulse Dot */}
          {isActive && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
          )}
        </div>
      </div>

      {/* Label & IP Badge */}
      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mt-0.5">
        {ip || sublabel}
      </span>
    </div>
  );
};


// 2. Realistic Rack Switch with Blinking Port LEDs and Circular Halo
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
    ? 'bg-rose-50/90 ring-8 ring-rose-500/20 border-rose-300 shadow-md scale-105'
    : isSuccess
      ? 'bg-emerald-50/90 ring-8 ring-emerald-500/20 border-emerald-300 shadow-md scale-105'
      : isActive
        ? 'bg-blue-50/90 ring-8 ring-blue-500/20 border-blue-300 shadow-md scale-105'
        : 'bg-slate-50/40 border-slate-200/70 opacity-75 hover:opacity-100';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-md">
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Halo */}
      <div className={`p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="86" height="66" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Switch 1U Rack Chassis */}
            <rect x="6" y="24" width="88" height="32" rx="4" fill="#1e293b" stroke={isActive ? '#2563eb' : '#475569'} strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Mounting Ears */}
            <rect x="2" y="26" width="4" height="28" rx="1" fill="#334155" />
            <circle cx="4" cy="30" r="1" fill="#94a3b8" />
            <circle cx="4" cy="50" r="1" fill="#94a3b8" />
            <rect x="94" y="26" width="4" height="28" rx="1" fill="#334155" />
            <circle cx="96" cy="30" r="1" fill="#94a3b8" />
            <circle cx="96" cy="50" r="1" fill="#94a3b8" />

            {/* Front Panel Inset */}
            <rect x="10" y="28" width="80" height="24" rx="2" fill="#0f172a" />

            {/* Power & System LEDs */}
            <circle cx="16" cy="36" r="2" fill="#10b981" />
            <circle cx="16" cy="44" r="1.5" fill={isActive ? '#38bdf8' : '#64748b'} />

            {/* RJ45 Ethernet Ports Row 1 */}
            <rect x="26" y="32" width="8" height="6" rx="1" fill="#334155" />
            <circle cx="30" cy="30" r="1" fill="#10b981" />
            <rect x="38" y="32" width="8" height="6" rx="1" fill="#334155" />
            <circle cx="42" cy="30" r="1" fill={isActive ? '#38bdf8' : '#10b981'} />
            <rect x="50" y="32" width="8" height="6" rx="1" fill="#334155" />
            <circle cx="54" cy="30" r="1" fill="#10b981" />
            <rect x="62" y="32" width="8" height="6" rx="1" fill="#334155" />
            <circle cx="66" cy="30" r="1" fill="#64748b" />
            <rect x="74" y="32" width="8" height="6" rx="1" fill="#334155" />
            <circle cx="78" cy="30" r="1" fill="#64748b" />

            {/* RJ45 Ethernet Ports Row 2 */}
            <rect x="26" y="42" width="8" height="6" rx="1" fill="#334155" />
            <rect x="38" y="42" width="8" height="6" rx="1" fill="#334155" />
            <rect x="50" y="42" width="8" height="6" rx="1" fill="#334155" />
            <rect x="62" y="42" width="8" height="6" rx="1" fill="#334155" />
            <rect x="74" y="42" width="8" height="6" rx="1" fill="#334155" />
          </svg>

          {isActive && (
            <span className="absolute top-4 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
          )}
        </div>
      </div>

      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-0.5">
        {ip || sublabel}
      </span>
    </div>
  );
};

// 3. Realistic Enterprise Firewall / Security Router Gateway with Circular Halo
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
    ? 'bg-rose-50/90 ring-8 ring-rose-500/20 border-rose-300 shadow-md scale-105'
    : isSuccess
      ? 'bg-emerald-50/90 ring-8 ring-emerald-500/20 border-emerald-300 shadow-md scale-105'
      : isActive
        ? 'bg-blue-50/90 ring-8 ring-blue-500/20 border-blue-300 shadow-md scale-105'
        : 'bg-slate-50/40 border-slate-200/70 opacity-75 hover:opacity-100';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className={`px-2.5 py-0.5 rounded-md text-white text-[10px] font-bold shadow-md ${
            isSuccess ? 'bg-emerald-600' : isDanger ? 'bg-rose-600' : 'bg-blue-600'
          }`}>
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Halo */}
      <div className={`p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="90" height="70" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Security Appliance Housing */}
            <rect x="8" y="16" width="84" height="48" rx="6" fill="#0f172a" stroke={
              isSuccess ? '#10b981' : isDanger ? '#ef4444' : isActive ? '#2563eb' : '#334155'
            } strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Cooling vents on top */}
            <line x1="20" y1="22" x2="40" y2="22" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="26" x2="40" y2="26" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

            {/* Security Shield Emblem on Front Panel */}
            <path d="M50 24L64 30V42C64 50 50 56 50 56C50 56 36 50 36 42V30L50 24Z" fill={
              isSuccess ? '#059669' : isDanger ? '#dc2626' : '#2563eb'
            } stroke="#ffffff" strokeWidth="1.5" />

            {/* Firewall Keyhole / Core checkmark */}
            <path d="M46 40L49 43L55 37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Inspection Scanner Line animation */}
            {isActive && (
              <line x1="14" y1="40" x2="86" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
            )}

            {/* Interface LEDs (WAN / LAN) */}
            <circle cx="78" cy="24" r="2" fill="#10b981" />
            <circle cx="84" cy="24" r="2" fill={isActive ? '#38bdf8' : '#64748b'} />
            <circle cx="78" cy="30" r="2" fill="#10b981" />
            <circle cx="84" cy="30" r="2" fill={isDanger ? '#ef4444' : '#10b981'} />

            {/* Bottom Stand Feet */}
            <rect x="18" y="64" width="12" height="4" rx="2" fill="#334155" />
            <rect x="70" y="64" width="12" height="4" rx="2" fill="#334155" />
          </svg>

          {/* Floating security badge */}
          <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md border border-slate-200">
            <Shield className={`h-4 w-4 ${
              isSuccess ? 'text-emerald-600' : isDanger ? 'text-rose-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
      </div>

      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-0.5">
        {ip || sublabel}
      </span>
    </div>
  );
};

// 4. Realistic Blade Web Server Rack with Circular Halo
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
    ? 'bg-rose-50/90 ring-8 ring-rose-500/20 border-rose-300 shadow-md scale-105'
    : isSuccess
      ? 'bg-emerald-50/90 ring-8 ring-emerald-500/20 border-emerald-300 shadow-md scale-105'
      : isActive
        ? 'bg-emerald-50/90 ring-8 ring-emerald-500/20 border-emerald-300 shadow-md scale-105'
        : 'bg-slate-50/40 border-slate-200/70 opacity-75 hover:opacity-100';

  return (
    <div className="flex flex-col items-center group select-none relative">
      {statusText && (
        <div className="mb-2 animate-bounce z-20">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-md">
            {statusText}
          </span>
        </div>
      )}

      {/* Circular Halo */}
      <div className={`p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${haloClass}`}>
        <div className="relative">
          <svg width="86" height="70" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Tower / Rack Frame */}
            <rect x="14" y="6" width="72" height="68" rx="4" fill="#1e293b" stroke={isActive ? '#059669' : '#475569'} strokeWidth={isActive ? '2.5' : '1.5'} />
            
            {/* Server Bay Unit 1 */}
            <rect x="18" y="10" width="64" height="18" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="25" cy="19" r="2" fill="#10b981" />
            <circle cx="31" cy="19" r="2" fill={isActive ? '#38bdf8' : '#10b981'} />
            <rect x="40" y="16" width="36" height="6" rx="1" fill="#1e293b" />

            {/* Server Bay Unit 2 */}
            <rect x="18" y="31" width="64" height="18" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="25" cy="40" r="2" fill="#10b981" />
            <circle cx="31" cy="40" r="2" fill="#10b981" />
            <rect x="40" y="37" width="36" height="6" rx="1" fill="#1e293b" />

            {/* Server Bay Unit 3 (Power / Storage Bay) */}
            <rect x="18" y="52" width="64" height="18" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <line x1="24" y1="58" x2="50" y2="58" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="64" x2="50" y2="64" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="72" cy="61" r="3" fill="#10b981" />
          </svg>

          {isActive && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
          )}
        </div>
      </div>

      <span className="text-xs font-bold text-slate-900 mt-2">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
        {ip || sublabel}
      </span>
    </div>
  );
};

