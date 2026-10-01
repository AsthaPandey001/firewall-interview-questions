import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Cpu, 
  Lock, 
  Activity, 
  Eye, 
  KeyRound, 
  Server, 
  Laptop, 
  Radio, 
  Check, 
  Database,
  Search,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import type { QuestionData, AnimationStep } from '../../types';
import { 
  RealisticLaptop, 
  RealisticRouterFirewall, 
  RealisticServer,
  RealisticSwitch 
} from './DeviceComponents';
import { PacketCard, BoldArrow } from './VisualPrimitives';

interface Props {
  question: QuestionData;
  currentStepIndex: number;
  onOpenSandbox?: () => void;
}

export const UniversalInteractiveLabEngine: React.FC<Props> = ({
  question,
  currentStepIndex,
  onOpenSandbox,
}) => {
  const [viewMode, setViewMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const step = question.steps[currentStepIndex] || question.steps[0];
  const totalSteps = question.steps.length;

  // ─────────────────────────────────────────────────────────────
  // 1. DETERMINISTIC PROGRESSIVE REVEAL STATE MACHINE
  // ─────────────────────────────────────────────────────────────
  // Step 0: ONLY Component 1 (Source Device) is rendered.
  // Step 1: First Cable draws + Packet appears at source & transmits.
  // Step 2: Middle Gateway (Firewall/NAT/NGFW/IPS/VPN) materializes.
  // Step 3-4: Inspection, 5-tuple extraction, live rule check, state table.
  // Delivery Step (Final Steps): Forward cable draws + Target Server appears + Packet delivers.

  const showSource = true; // Always visible as initial step
  const showCable1 = currentStepIndex >= 1;
  const showPacket1 = currentStepIndex >= 1;
  const showGateway = currentStepIndex >= 1;
  
  // Is this a comparison question with sequential phases? (e.g. Q3, Q4, Q12, Q14, Q18)
  const isComparison = question.visualType.includes('stateful') || 
                       question.visualType.includes('ngfw') || 
                       question.visualType.includes('ids-vs-ips') || 
                       question.visualType.includes('nat-types') ||
                       question.visualType.includes('vpn');

  const halfSteps = Math.max(3, Math.floor(totalSteps / 2));
  const isProcessB = isComparison && currentStepIndex >= halfSteps;

  // Destination / Server reveals when packet moves past gateway or reaches delivery phase
  const showCable2 = isComparison 
    ? (currentStepIndex >= 2 && currentStepIndex < halfSteps) || (currentStepIndex >= halfSteps + 2)
    : currentStepIndex >= Math.max(2, Math.floor(totalSteps * 0.6));

  const showTarget = isComparison
    ? (currentStepIndex >= 2 && currentStepIndex < halfSteps) || (currentStepIndex >= halfSteps + 2)
    : currentStepIndex >= Math.max(2, Math.floor(totalSteps * 0.6));

  // Decision state
  const isAllowed = step.decision === 'ALLOW' || step.decision === 'TRANSLATE' || step.decision === 'ENCRYPT';
  const isDenied = step.decision === 'DENY' || step.decision === 'DROP';
  const isInspecting = step.decision === 'INSPECT' || (currentStepIndex >= 2 && !isAllowed && !isDenied);
  const isFinalStep = currentStepIndex === totalSteps - 1;

  // Packet data & transformation
  const rawPkt = step.packetInfo || {
    srcIp: '10.0.0.25',
    dstIp: '203.0.113.50',
    srcPort: 52410,
    dstPort: 443,
    protocol: 'TCP' as const,
    flags: 'SYN',
    payloadSummary: 'HTTPS GET /index.html'
  };

  // Dynamic packet transformation (NAT / Encryption / Decryption)
  let activeSrcIp = rawPkt.srcIp;
  let activeDstIp = rawPkt.dstIp;
  let activePort = rawPkt.dstPort || 443;
  let isEncryptedPayload = rawPkt.isEncrypted || false;
  let packetTitle = 'DATA PACKET';

  if (question.visualType.includes('nat') && step.natTable && step.natTable.length > 0 && currentStepIndex >= 3) {
    activeSrcIp = step.natTable[0].insideGlobal;
    packetTitle = 'NAT TRANSLATED PACKET';
  }

  if (question.visualType.includes('vpn') || question.visualType.includes('ipsec') || question.visualType.includes('tls')) {
    if (currentStepIndex >= 2 && currentStepIndex <= totalSteps - 2) {
      isEncryptedPayload = true;
      packetTitle = 'ENCRYPTED ESP TUNNEL PACKET';
    }
  }

  // Device Labels & Subtitles
  const getSourceLabel = () => {
    if (isProcessB && question.visualType.includes('stateful')) return { label: 'Stateful Client Host', ip: '10.0.0.25:52410' };
    if (!isProcessB && question.visualType.includes('stateful')) return { label: 'Stateless Client Host', ip: '10.0.0.25:52410' };
    if (question.visualType.includes('vpn')) return { label: 'Remote Worker Laptop', ip: '192.168.1.50 (Home Wi-Fi)' };
    if (question.visualType.includes('tls')) return { label: 'Client Web Browser', ip: '192.168.1.100 :51234' };
    return { label: step.sourceNode || 'Source Client Host', ip: `${activeSrcIp}:${rawPkt.srcPort || '52410'}` };
  };

  const getGatewayLabel = () => {
    if (question.visualType.includes('stateful')) {
      return isProcessB 
        ? { label: 'Stateful Security Engine', sub: 'Dynamic Session State Table', type: 'stateful' }
        : { label: 'Stateless Packet Filter', sub: 'Isolated Rule Evaluation (No Memory)', type: 'stateless' };
    }
    if (question.visualType.includes('ngfw')) {
      return isProcessB
        ? { label: 'Next-Gen Firewall (NGFW)', sub: 'Layer 7 App-ID & Deep Content Inspection', type: 'ngfw' }
        : { label: 'Traditional L3/L4 Firewall', sub: 'Static 5-Tuple Port Inspection Only', type: 'traditional' };
    }
    if (question.visualType.includes('ids-vs-ips')) {
      return isProcessB
        ? { label: 'Inline IPS Appliance', sub: 'Active Threat Sensor + Real-Time Drop', type: 'ips' }
        : { label: 'Out-of-Band IDS Sensor', sub: 'Passive Tap Monitoring + Alert Log Only', type: 'ids' };
    }
    if (question.visualType.includes('nat')) {
      return { label: 'Enterprise NAT Gateway', sub: 'RFC 1918 PAT Port Translation', type: 'nat' };
    }
    if (question.visualType.includes('vpn') || question.visualType.includes('ipsec')) {
      return { label: 'IPsec VPN Gateway', sub: 'IKE SA & AES-256 ESP Tunnel', type: 'vpn' };
    }
    if (question.visualType.includes('tls')) {
      return { label: 'TLS 1.3 Security Gateway', sub: 'ECDHE KeyShare & Cert Verification', type: 'tls' };
    }
    return { label: 'Firewall Security Gateway', sub: 'Sequential Rule Evaluation Engine', type: 'firewall' };
  };

  const getTargetLabel = () => {
    if (question.visualType.includes('segmentation')) return { label: 'Internal Database Server', ip: '10.0.20.5:3306 (Protected VLAN)' };
    if (question.visualType.includes('tls')) return { label: 'HTTPS Web Server', ip: 'example.com :443' };
    return { label: step.targetNode || 'Target Destination Server', ip: `${activeDstIp}:${activePort}` };
  };

  const srcDevice = getSourceLabel();
  const gwDevice = getGatewayLabel();
  const tgtDevice = getTargetLabel();

  // Desktop horizontal packet positions (x coordinates)
  let desktopPacketX = 100;
  if (currentStepIndex === 1) desktopPacketX = 230;
  else if (currentStepIndex >= 2 && currentStepIndex <= totalSteps - 2) desktopPacketX = 380;
  else if (currentStepIndex >= totalSteps - 1) desktopPacketX = isAllowed ? 650 : 430;

  // Mobile vertical packet positions (% top)
  let mobilePacketTopPercent = 14;
  if (currentStepIndex === 1) mobilePacketTopPercent = 30;
  else if (currentStepIndex >= 2 && currentStepIndex <= totalSteps - 2) mobilePacketTopPercent = 50;
  else if (currentStepIndex >= totalSteps - 1) mobilePacketTopPercent = isAllowed ? 85 : 55;

  return (
    <div className="relative w-full bg-white rounded-t-2xl flex flex-col justify-between overflow-hidden shadow-xs min-h-[460px]">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP HEADER STATUS STRIP */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 pt-3 sm:pt-4 pb-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white select-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-bold font-mono shrink-0">
            <span>STAGE {currentStepIndex + 1} / {totalSteps}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight truncate">
            {step.label}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Comparison Phase Pill */}
          {isComparison && (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              isProcessB 
                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                : 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs'
            }`}>
              {isProcessB ? '▶ PHASE 2: MODERN / ADVANCED' : '▶ PHASE 1: BASELINE'}
            </span>
          )}

          {step.badge && (
            <span className="hidden xs:inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] sm:text-[11px] font-mono font-semibold text-slate-600">
              {step.badge}
            </span>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN NETWORK ANIMATION STAGE CANVAS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full relative p-3 sm:p-6 flex flex-col items-center justify-center bg-slate-50/50 bg-grid-dots overflow-hidden">
        
        {/* ───────────────────────────────────────────────────────────── */}
        {/* DESKTOP / TABLET HORIZONTAL CANVAS (Screen >= sm) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="hidden sm:flex flex-col items-center w-full max-w-4xl py-4 relative">
          
          {/* Top Network Bus Line */}
          <div className="w-full relative flex items-center justify-between px-10 min-h-[160px]">
            
            {/* Cable 1 (Source to Gateway) - Appears Step 1+ */}
            {showCable1 && (
              <div className="absolute left-28 right-1/2 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 z-0 rounded-full overflow-hidden animate-fadeIn">
                <div 
                  className="h-full bg-blue-500 transition-all duration-700 shadow-xs"
                  style={{ width: currentStepIndex >= 1 ? '100%' : '30%' }}
                />
              </div>
            )}

            {/* Cable 2 (Gateway to Server) - Appears on Forwarding Step */}
            {showCable2 && (
              <div className="absolute left-1/2 right-28 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 z-0 rounded-full overflow-hidden animate-fadeIn">
                <div 
                  className={`h-full transition-all duration-700 shadow-xs ${
                    isAllowed ? 'bg-emerald-500' : isDenied ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                  style={{ width: isAllowed || isFinalStep ? '100%' : isDenied ? '40%' : '15%' }}
                />
              </div>
            )}

            {/* 1. NODE 1: SOURCE DEVICE (Always visible at Step 0) */}
            <div className="relative z-10 flex flex-col items-center">
              <RealisticLaptop
                label={srcDevice.label}
                sublabel={srcDevice.ip}
                ip={srcDevice.ip}
                isActive={currentStepIndex <= 1}
                isSuccess={isAllowed && isFinalStep}
                statusText={currentStepIndex === 0 ? 'READY' : currentStepIndex === 1 ? 'TRANSMITTING' : undefined}
              />
            </div>

            {/* 2. NODE 2: GATEWAY / FIREWALL APPLIANCE (Revealed on Step 1+) */}
            <div className="relative z-10 flex flex-col items-center min-w-[120px]">
              {showGateway ? (
                <div className="animate-fadeIn">
                  <RealisticRouterFirewall
                    label={gwDevice.label}
                    sublabel={gwDevice.sub}
                    isActive={isInspecting || (currentStepIndex >= 2 && currentStepIndex <= totalSteps - 2)}
                    isSuccess={isAllowed}
                    isDanger={isDenied}
                    statusText={
                      isAllowed ? 'ALLOWED ✓' :
                      isDenied ? 'DROPPED ✕' :
                      isInspecting ? 'INSPECTING RULES...' :
                      'ONLINE'
                    }
                  />
                </div>
              ) : (
                <div className="h-24 w-28 rounded-2xl border-2 border-dashed border-slate-200/80 flex flex-col items-center justify-center p-2 text-center text-slate-300 select-none">
                  <Shield className="h-6 w-6 mb-1 opacity-40" />
                  <span className="text-[10px] font-mono">Next: Security Gateway</span>
                </div>
              )}
            </div>

            {/* 3. NODE 3: DESTINATION SERVER (Revealed on Forwarding Step) */}
            <div className="relative z-10 flex flex-col items-center min-w-[120px]">
              {showTarget ? (
                <div className="animate-fadeIn">
                  <RealisticServer
                    label={tgtDevice.label}
                    sublabel={tgtDevice.ip}
                    ip={tgtDevice.ip}
                    isActive={isAllowed && isFinalStep}
                    isSuccess={isAllowed && isFinalStep}
                    isDanger={isDenied && isFinalStep}
                    statusText={isAllowed && isFinalStep ? 'DELIVERED ✓' : undefined}
                  />
                </div>
              ) : (
                <div className="h-24 w-28 rounded-2xl border-2 border-dashed border-slate-200/80 flex flex-col items-center justify-center p-2 text-center text-slate-300 select-none">
                  <Server className="h-6 w-6 mb-1 opacity-40" />
                  <span className="text-[10px] font-mono">Target Destination</span>
                </div>
              )}
            </div>

            {/* PHYSICAL MOVING PACKET CARD (Horizontal physical travel) */}
            {showPacket1 && (
              <div 
                className="absolute top-0 z-20 transition-all duration-700 ease-out pointer-events-none"
                style={{ 
                  left: `${desktopPacketX}px`, 
                  transform: 'translate(-50%, -40%)' 
                }}
              >
                <div className="animate-bounce">
                  <PacketCard
                    cx={0}
                    cy={0}
                    title={packetTitle}
                    protocol={rawPkt.protocol}
                    port={activePort}
                    src={activeSrcIp}
                    dst={activeDstIp}
                    flags={rawPkt.flags}
                    isEncrypted={isEncryptedPayload}
                    status={isAllowed ? 'ALLOW' : isDenied ? 'DENY' : isInspecting ? 'INSPECT' : 'NORMAL'}
                    scale={0.92}
                  />
                </div>
              </div>
            )}

          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* BOTTOM CUMULATIVE INSPECTION / POLICY / ACTION DASHBOARD */}
          {/* ───────────────────────────────────────────────────────────── */}
          {currentStepIndex >= 2 && (
            <div className="w-full mt-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs animate-fadeIn">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    GATEWAY INSPECTION & RULE EVALUATION ENGINE
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isAllowed ? 'bg-emerald-100 text-emerald-800' :
                  isDenied ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {step.decision || (isInspecting ? 'INSPECTING 5-TUPLE' : 'EVALUATING')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left 5-Tuple Header Badges */}
                <div className="md:col-span-6 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Extracted 5-Tuple</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-400">SRC:</span>
                      <span className="text-blue-700 font-bold truncate">{activeSrcIp}:{rawPkt.srcPort || '52410'}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-400">DST:</span>
                      <span className="text-indigo-700 font-bold truncate">{activeDstIp}:{activePort}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-400">PROTO:</span>
                      <span className="text-emerald-700 font-bold">{rawPkt.protocol}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-400">FLAGS:</span>
                      <span className="text-amber-700 font-bold">{rawPkt.flags || 'ACK'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action & Policy Outcome */}
                <div className="md:col-span-6 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage Action Explanation</span>
                  <div className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                    isAllowed ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium' :
                    isDenied ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-medium' :
                    'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <p className="font-semibold mb-0.5">{step.label}</p>
                    <p className="text-[11px] text-slate-600">{step.whatIsHappening}</p>
                  </div>
                </div>

              </div>

              {/* State Table if available */}
              {step.stateTable && step.stateTable.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 font-bold">STATE TABLE ENTRY:</span>
                  <span className="text-slate-800 font-bold">
                    {step.stateTable[0].srcIp}:{step.stateTable[0].srcPort} ↔ {step.stateTable[0].dstIp}:{step.stateTable[0].dstPort} [{step.stateTable[0].state}]
                  </span>
                </div>
              )}

              {/* NAT Table if available */}
              {step.natTable && step.natTable.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 font-bold">NAT TRANSLATION TABLE:</span>
                  <span className="text-indigo-700 font-bold">
                    Inside Local: {step.natTable[0].insideLocal} → Inside Global: {step.natTable[0].insideGlobal}
                  </span>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* MOBILE VERTICAL CANVAS (Screen < sm) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex sm:hidden flex-col items-center w-full max-w-sm py-2 relative">
          
          {/* 1. NODE 1: SOURCE LAPTOP (Top) */}
          <div className="relative z-10 flex flex-col items-center animate-fadeIn">
            <RealisticLaptop
              label={srcDevice.label}
              sublabel={srcDevice.ip}
              ip={srcDevice.ip}
              isActive={currentStepIndex <= 1}
              isSuccess={isAllowed && isFinalStep}
              statusText={currentStepIndex === 0 ? 'ORIGIN' : undefined}
            />
          </div>

          {/* Vertical Connector 1 */}
          {showCable1 && (
            <div className="relative w-full py-3 flex flex-col items-center animate-fadeIn">
              <div className="w-1.5 h-12 bg-slate-200 rounded-full relative overflow-hidden">
                <div 
                  className="w-full bg-blue-500 rounded-full transition-all duration-500 shadow-xs"
                  style={{ height: currentStepIndex >= 1 ? '100%' : '30%' }}
                />
              </div>
            </div>
          )}

          {/* 2. NODE 2: GATEWAY / FIREWALL (Middle - Revealed Step 1+) */}
          {showGateway && (
            <div className="relative z-10 flex flex-col items-center w-full max-w-xs animate-fadeIn my-2">
              <RealisticRouterFirewall
                label={gwDevice.label}
                sublabel={gwDevice.sub}
                isActive={isInspecting || (currentStepIndex >= 2 && currentStepIndex <= totalSteps - 2)}
                isSuccess={isAllowed}
                isDanger={isDenied}
                statusText={
                  isAllowed ? 'ALLOWED ✓' :
                  isDenied ? 'DROPPED ✕' :
                  isInspecting ? 'INSPECTING...' :
                  undefined
                }
              />

              {/* Step Action Box on Mobile */}
              <div className="w-full mt-2.5 p-2.5 rounded-xl border bg-white border-slate-200 text-xs shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1 font-mono text-[11px] font-bold text-slate-800">
                  <span>{step.label}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                    isAllowed ? 'bg-emerald-100 text-emerald-800' :
                    isDenied ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {step.decision || (isInspecting ? 'INSPECT' : 'READY')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{step.whatIsHappening}</p>
              </div>
            </div>
          )}

          {/* Vertical Connector 2 */}
          {showCable2 && (
            <div className="relative w-full py-3 flex flex-col items-center animate-fadeIn">
              <div className="w-1.5 h-12 bg-slate-200 rounded-full relative overflow-hidden">
                <div 
                  className={`w-full rounded-full transition-all duration-500 shadow-xs ${
                    isAllowed ? 'bg-emerald-500' : isDenied ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                  style={{ height: isAllowed || isFinalStep ? '100%' : isDenied ? '40%' : '15%' }}
                />
              </div>
            </div>
          )}

          {/* 3. NODE 3: TARGET SERVER (Bottom - Revealed on Forwarding Step) */}
          {showTarget && (
            <div className="relative z-10 flex flex-col items-center animate-fadeIn my-2">
              <RealisticServer
                label={tgtDevice.label}
                sublabel={tgtDevice.ip}
                ip={tgtDevice.ip}
                isActive={isAllowed && isFinalStep}
                isSuccess={isAllowed && isFinalStep}
                isDanger={isDenied && isFinalStep}
                statusText={isAllowed && isFinalStep ? 'DELIVERED ✓' : undefined}
              />
            </div>
          )}

          {/* Physical Moving Packet Card on Mobile */}
          {showPacket1 && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-out pointer-events-none"
              style={{ top: `${mobilePacketTopPercent}%` }}
            >
              <div className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 shadow-lg text-white font-mono text-[10px] font-bold ring-2 ring-blue-300 translate-x-14 animate-bounce">
                <span>↓ [{rawPkt.protocol}:{activePort}]</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
