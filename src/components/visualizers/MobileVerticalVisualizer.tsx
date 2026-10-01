import React from 'react';
import { 
  Laptop, 
  Shield, 
  Server, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  Eye, 
  KeyRound, 
  Activity, 
  Database, 
  Globe,
  Radio,
  Cpu
} from 'lucide-react';
import type { QuestionData, AnimationStep } from '../../types';

interface MobileVerticalVisualizerProps {
  question: QuestionData;
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
  onOpenSandbox?: () => void;
}

export const MobileVerticalVisualizer: React.FC<MobileVerticalVisualizerProps> = ({
  question,
  currentStepIndex,
  step,
  totalSteps
}) => {
  // Compute progress through animation steps (0 to 1)
  const progressRatio = totalSteps > 1 ? currentStepIndex / (totalSteps - 1) : 0;
  
  // Decide packet travel phase: 
  // Phase 0: At source host (Top)
  // Phase 1: In transit to Firewall (Top -> Middle)
  // Phase 2: At Firewall inspection (Middle)
  // Phase 3: Forwarded to Target (Middle -> Bottom) or Dropped
  const isEarly = currentStepIndex <= 1;
  const isAtMiddle = currentStepIndex >= 2 && currentStepIndex <= Math.max(3, totalSteps - 3);
  const isFinal = currentStepIndex >= totalSteps - 2;

  // Determine node icons and labels based on question visualType / data
  const getSourceDetails = () => {
    if (question.visualType.includes('vpn') || question.id === 18) {
      return { icon: Laptop, label: 'Remote Worker', sub: '192.168.1.50 (Home Wi-Fi)' };
    }
    if (question.visualType.includes('tls') || question.id === 20) {
      return { icon: Laptop, label: 'Client Web Browser', sub: '192.168.1.100 :51234' };
    }
    if (question.visualType.includes('ids') || question.id === 14 || question.id === 15) {
      return { icon: Laptop, label: 'External Host', sub: '203.0.113.199' };
    }
    return { 
      icon: Laptop, 
      label: step.sourceNode || 'Client Host', 
      sub: step.packetInfo ? `${step.packetInfo.srcIp}${step.packetInfo.srcPort ? `:${step.packetInfo.srcPort}` : ''}` : '10.0.0.25' 
    };
  };

  const getGatewayDetails = () => {
    if (question.visualType.includes('nat') || question.id === 11 || question.id === 12 || question.id === 13) {
      return { icon: Cpu, label: 'NAT / PAT Gateway', sub: 'Translates IP & Port' };
    }
    if (question.visualType.includes('ngfw') || question.id === 4) {
      return { icon: Shield, label: 'NGFW Deep Inspection Engine', sub: 'App-ID & Content Inspection' };
    }
    if (question.visualType.includes('stateful') || question.id === 3) {
      return { icon: Activity, label: 'Stateful Inspection Engine', sub: 'Dynamic Session State Table' };
    }
    if (question.visualType.includes('ids') || question.id === 14 || question.id === 15) {
      return { icon: Eye, label: 'IPS / IDS Engine', sub: 'Deep Signature & Anomaly Sensor' };
    }
    if (question.visualType.includes('ipsec') || question.visualType.includes('vpn') || question.id === 18 || question.id === 19) {
      return { icon: Lock, label: 'IPsec / VPN Gateway', sub: 'IKE SA & ESP Encapsulation' };
    }
    if (question.visualType.includes('tls') || question.id === 20) {
      return { icon: KeyRound, label: 'TLS 1.3 Handshake Engine', sub: 'ECDHE KeyShare & Cert Verification' };
    }
    return { icon: Shield, label: 'Firewall Gateway', sub: 'Sequential Rule Evaluation' };
  };

  const getTargetDetails = () => {
    if (question.visualType.includes('segmentation') || question.id === 17) {
      return { icon: Database, label: 'Internal Database Host', sub: '10.0.20.5 (Protected Zone)' };
    }
    if (question.visualType.includes('tls') || question.id === 20) {
      return { icon: Server, label: 'HTTPS Web Server', sub: 'example.com :443' };
    }
    return { 
      icon: Server, 
      label: step.targetNode || 'Target Server', 
      sub: step.packetInfo ? `${step.packetInfo.dstIp}${step.packetInfo.dstPort ? `:${step.packetInfo.dstPort}` : ''}` : '203.0.113.50:443' 
    };
  };

  const src = getSourceDetails();
  const gw = getGatewayDetails();
  const tgt = getTargetDetails();

  const SrcIcon = src.icon;
  const GwIcon = gw.icon;
  const TgtIcon = tgt.icon;

  // Decision style
  const isAllowed = step.decision === 'ALLOW' || step.decision === 'TRANSLATE' || step.decision === 'ENCRYPT';
  const isDenied = step.decision === 'DENY' || step.decision === 'DROP';
  const isInspecting = step.decision === 'INSPECT' || (currentStepIndex >= 2 && !isFinal);

  // Packet Badge styling
  const pkt = step.packetInfo || {
    srcIp: '10.0.0.25',
    dstIp: '203.0.113.50',
    srcPort: 52410,
    dstPort: 443,
    protocol: 'TCP' as const,
    flags: 'SYN',
    payloadSummary: 'HTTPS Handshake Request'
  };

  return (
    <div className="w-full flex flex-col items-center py-4 px-3 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 rounded-2xl border border-slate-200/80 shadow-2xs">
      
      {/* Visual Header Mode Indicator */}
      <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Radio className="h-4 w-4 text-blue-600 animate-pulse" />
          <span>Mobile Vertical Flow</span>
        </div>
        <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold border border-blue-200">
          Top-to-Bottom
        </span>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP NODE: SOURCE HOST */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-blue-400 shadow-sm relative z-10 animate-fadeIn">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
          <SrcIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 truncate">{src.label}</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
              ORIGIN
            </span>
          </div>
          <p className="text-[11px] font-mono text-blue-700 font-semibold truncate mt-0.5">{src.sub}</p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CONNECTOR & ANIMATED PACKET 1 (TOP TO MIDDLE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-sm py-5 flex flex-col items-center">
        {/* Vertical Track Line */}
        <div className="w-1 h-14 bg-slate-200 rounded-full relative overflow-hidden">
          <div 
            className="w-full bg-blue-500 rounded-full transition-all duration-500"
            style={{
              height: currentStepIndex >= 1 ? '100%' : '20%',
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
            }}
          />
        </div>

        {/* Floating Downward Packet Card */}
        <div className={`w-full max-w-[280px] my-1 p-2.5 rounded-xl border shadow-md transition-all duration-300 z-10 ${
          isEarly
            ? 'bg-blue-50/95 border-blue-300 ring-2 ring-blue-400/20'
            : isAtMiddle
            ? 'bg-amber-50/95 border-amber-300 ring-2 ring-amber-400/20'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold border-b border-slate-200 pb-1 mb-1">
            <span className="flex items-center gap-1 text-slate-800">
              <ArrowDown className="h-3 w-3 text-blue-600 animate-bounce" />
              PACKET IN TRANSIT
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px]">
              {pkt.protocol} {pkt.flags ? `[${pkt.flags}]` : ''}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
            <div>
              <span className="text-slate-400">SRC: </span>
              <span className="text-slate-700 font-bold">{pkt.srcIp}:{pkt.srcPort || 'any'}</span>
            </div>
            <div>
              <span className="text-slate-400">DST: </span>
              <span className="text-slate-700 font-bold">{pkt.dstIp}:{pkt.dstPort || '443'}</span>
            </div>
          </div>
          {pkt.payloadSummary && (
            <p className="text-[10px] text-slate-500 font-medium truncate mt-1 pt-1 border-t border-slate-100">
              Payload: {pkt.payloadSummary}
            </p>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MIDDLE NODE: INSPECTION / SECURITY GATEWAY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={`w-full max-w-sm rounded-2xl border-2 p-3.5 shadow-md transition-all duration-300 relative z-10 ${
        isAllowed
          ? 'bg-emerald-50/60 border-emerald-400 shadow-emerald-500/10'
          : isDenied
          ? 'bg-rose-50/60 border-rose-400 shadow-rose-500/10'
          : isInspecting
          ? 'bg-blue-50/80 border-blue-500 ring-4 ring-blue-500/15 shadow-blue-500/10'
          : 'bg-white border-slate-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
            isAllowed
              ? 'bg-emerald-600'
              : isDenied
              ? 'bg-rose-600'
              : isInspecting
              ? 'bg-blue-600 animate-pulse'
              : 'bg-slate-700'
          }`}>
            <GwIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900 truncate">{gw.label}</h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isAllowed
                  ? 'bg-emerald-100 text-emerald-800'
                  : isDenied
                  ? 'bg-rose-100 text-rose-800'
                  : isInspecting
                  ? 'bg-blue-100 text-blue-800 animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {step.decision || (isInspecting ? 'INSPECTING' : 'IDLE')}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">{gw.sub}</p>
          </div>
        </div>

        {/* Live Step Action Summary Box */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-700 mb-1">
            <Activity className="h-3.5 w-3.5 text-blue-600" />
            <span>ACTION: {step.label}</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            {step.whatIsHappening}
          </p>
        </div>

        {/* Rule Matched or State Table (if available) */}
        {step.ruleMatched && (
          <div className="mt-2.5 p-2 rounded-lg bg-white border border-slate-200 text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Matched Rule:</span>
            <span className="text-blue-700 font-bold">{step.ruleMatched}</span>
          </div>
        )}

        {/* State Table if available */}
        {step.stateTable && step.stateTable.length > 0 && (
          <div className="mt-2.5 p-2 rounded-lg bg-white border border-slate-200">
            <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
              Active State Table Entry
            </span>
            <div className="text-[10px] font-mono text-slate-700 bg-slate-50 p-1.5 rounded flex justify-between">
              <span>{step.stateTable[0].srcIp}:{step.stateTable[0].srcPort} → {step.stateTable[0].dstIp}:{step.stateTable[0].dstPort}</span>
              <span className="font-bold text-emerald-700">[{step.stateTable[0].state}]</span>
            </div>
          </div>
        )}

        {/* NAT Table if available */}
        {step.natTable && step.natTable.length > 0 && (
          <div className="mt-2.5 p-2 rounded-lg bg-white border border-slate-200">
            <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">
              Active NAT Translation
            </span>
            <div className="text-[10px] font-mono text-slate-700 bg-slate-50 p-1.5 rounded flex justify-between">
              <span>Local: {step.natTable[0].insideLocal}</span>
              <span className="font-bold text-indigo-700">→ Global: {step.natTable[0].insideGlobal}</span>
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CONNECTOR & ANIMATED PACKET 2 (MIDDLE TO BOTTOM) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-sm py-5 flex flex-col items-center">
        {/* Vertical Track Line */}
        <div className="w-1 h-14 bg-slate-200 rounded-full relative overflow-hidden">
          <div 
            className={`w-full rounded-full transition-all duration-500 ${
              isAllowed
                ? 'bg-emerald-500'
                : isDenied
                ? 'bg-rose-500'
                : 'bg-slate-300'
            }`}
            style={{
              height: isFinal || isAllowed ? '100%' : isDenied ? '40%' : '10%',
              boxShadow: isAllowed ? '0 0 8px rgba(16, 185, 129, 0.5)' : undefined
            }}
          />
        </div>

        {/* Verdict Egress Badge */}
        <div className={`w-full max-w-[280px] my-1 p-2 rounded-xl border text-center transition-all duration-300 z-10 ${
          isAllowed
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
            : isDenied
            ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
            : 'bg-white border-slate-200 text-slate-500 text-xs'
        }`}>
          {isAllowed ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>FORWARDED TO TARGET ✓</span>
            </div>
          ) : isDenied ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-rose-800">
              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>PACKET DROPPED AT FIREWALL ✕</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
              <ArrowDown className="h-3.5 w-3.5 animate-bounce text-slate-400" />
              <span>Pending Verdict...</span>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. BOTTOM NODE: TARGET DESTINATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className={`w-full max-w-sm flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 relative z-10 shadow-sm ${
        isAllowed && isFinal
          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400/20'
          : isDenied
          ? 'bg-slate-50 border-slate-200 opacity-60'
          : 'bg-white border-slate-300'
      }`}>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
          isAllowed && isFinal
            ? 'bg-emerald-600 text-white border-emerald-500'
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          <TgtIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 truncate">{tgt.label}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
              isAllowed && isFinal ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              TARGET
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-600 font-semibold truncate mt-0.5">{tgt.sub}</p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERVIEW KEY TAKEAWAY CARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step.interviewTakeaway && (
        <div className="w-full max-w-sm mt-4 p-3 rounded-xl bg-blue-50/90 border border-blue-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-950 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>Interview Answer Point</span>
          </div>
          <p className="text-[11px] text-blue-900 leading-relaxed">
            {step.interviewTakeaway}
          </p>
        </div>
      )}

    </div>
  );
};
