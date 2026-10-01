import React, { useEffect, useRef } from 'react';
import { 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Radio, 
  Activity,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Flame
} from 'lucide-react';
import type { QuestionData, AnimationStep } from '../../types';
import { 
  RealisticLaptop, 
  RealisticRouterFirewall, 
  RealisticServer,
} from './DeviceComponents';

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
  // Viewport camera / auto-follow refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const packet1Ref = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const packet2Ref = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Progressive visibility thresholds based on currentStepIndex:
  // Step 0: ONLY Source Host is visible
  // Step 1+: Packet 1 & Gateway appear
  // Later steps: Delivery connector & Target Server appear
  const showSource = true;
  const showPacket1 = currentStepIndex >= 1;
  const showGateway = currentStepIndex >= 1;
  const showPacket2 = currentStepIndex >= 2 && currentStepIndex >= Math.floor(totalSteps * 0.45);
  const showTarget = currentStepIndex >= 2 && currentStepIndex >= Math.floor(totalSteps * 0.55);

  const isEarly = currentStepIndex <= 1;
  const isAtMiddle = currentStepIndex >= 2 && currentStepIndex < totalSteps - 2;
  const isFinal = currentStepIndex >= totalSteps - 2;

  // Decision states
  const isAllowed = step.decision === 'ALLOW' || step.decision === 'TRANSLATE' || step.decision === 'ENCRYPT';
  const isDenied = step.decision === 'DENY' || step.decision === 'DROP';
  const isInspecting = step.decision === 'INSPECT' || (currentStepIndex >= 2 && !isFinal && !isDenied);

  // Threat detection detection (for Q14/Q15/malware/denied packets)
  const isThreatOrMalware = 
    isDenied || 
    question.id === 14 || 
    question.id === 15 || 
    step.label.toLowerCase().includes('malicious') || 
    step.label.toLowerCase().includes('threat') || 
    step.label.toLowerCase().includes('unauthorized') ||
    step.label.toLowerCase().includes('ssh');

  // Source host props
  const srcIp = step.packetInfo ? `${step.packetInfo.srcIp}${step.packetInfo.srcPort ? `:${step.packetInfo.srcPort}` : ''}` : '10.0.0.25:52410';
  const srcLabel = step.sourceNode || (question.visualType.includes('vpn') ? 'Remote Client' : 'Source Client');

  // Target host props
  const dstIp = step.packetInfo ? `${step.packetInfo.dstIp}${step.packetInfo.dstPort ? `:${step.packetInfo.dstPort}` : ''}` : '203.0.113.50:443';
  const dstLabel = step.targetNode || (question.visualType.includes('segmentation') ? 'Database Server' : 'Target Server');

  // Gateway label & subtitle
  const getGatewayInfo = () => {
    if (question.visualType.includes('nat') || question.id === 11 || question.id === 12 || question.id === 13) {
      return { label: 'NAT Gateway', sub: 'IP & Port Translation' };
    }
    if (question.visualType.includes('ngfw') || question.id === 4) {
      return { label: 'NGFW Inspection', sub: 'L7 App-ID & DPI' };
    }
    if (question.visualType.includes('stateful') || question.id === 3) {
      return { label: 'Stateful Firewall', sub: 'Session State Table' };
    }
    if (question.visualType.includes('ids') || question.id === 14 || question.id === 15) {
      return { label: 'IPS / IDS Engine', sub: 'Signature & Anomaly Sensor' };
    }
    if (question.visualType.includes('ipsec') || question.visualType.includes('vpn') || question.id === 18 || question.id === 19) {
      return { label: 'IPsec Gateway', sub: 'VPN Tunnel Encapsulation' };
    }
    if (question.visualType.includes('tls') || question.id === 20) {
      return { label: 'TLS Decryptor', sub: 'Session Key Negotiation' };
    }
    return { label: 'Firewall Gateway', sub: 'Security Rule Engine' };
  };

  const gw = getGatewayInfo();

  // Packet data
  const pkt = step.packetInfo || {
    srcIp: '10.0.0.25',
    dstIp: '203.0.113.50',
    srcPort: 52410,
    dstPort: 443,
    protocol: 'TCP' as const,
    flags: 'SYN',
    payloadSummary: 'HTTPS Request Payload'
  };

  // Smooth camera auto-follow: center current active node without causing top reset on manual scroll
  useEffect(() => {
    let targetElement: HTMLDivElement | null = null;

    if (currentStepIndex === 0) {
      targetElement = sourceRef.current;
    } else if (currentStepIndex === 1) {
      targetElement = packet1Ref.current;
    } else if (currentStepIndex >= 2 && currentStepIndex < totalSteps - 2) {
      targetElement = gatewayRef.current;
    } else if (currentStepIndex >= totalSteps - 2) {
      targetElement = isDenied ? gatewayRef.current : targetRef.current || gatewayRef.current;
    }

    if (targetElement && containerRef.current) {
      // Calculate relative offset within container for smooth focus
      const container = containerRef.current;
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;
      const containerHeight = container.clientHeight;

      const targetScroll = Math.max(0, elementTop - containerHeight / 3);
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [currentStepIndex, isDenied, totalSteps]);

  return (
    <div 
      ref={containerRef}
      className="w-full flex flex-col items-center py-4 px-2 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/90 rounded-2xl border border-slate-200/90 shadow-2xs min-h-[420px] max-h-[620px] overflow-y-auto no-scrollbar relative"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* STICKY CURRENT STEP INDICATOR PILL (Always visible on scroll) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 w-full flex items-center justify-between pb-2 mb-3 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Radio className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span className="text-[11px] truncate max-w-[170px]">
            {isDenied ? 'PACKET BLOCKED' : isAllowed && isFinal ? 'DELIVERED TO TARGET' : isInspecting ? 'INSPECTING RULES' : 'TRANSMITTING'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold border border-blue-200">
            Step {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. COMPONENT 1: SOURCE HOST (Step 0+) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div ref={sourceRef} className="relative z-10 flex flex-col items-center animate-fadeIn">
        <RealisticLaptop
          label={srcLabel}
          sublabel={srcIp}
          ip={srcIp}
          isActive={isEarly}
          isSuccess={isAllowed && isFinal}
          statusText={isEarly ? 'STEP 1: ORIGIN' : undefined}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. COMPONENT 2: CONNECTOR & PACKET IN FLIGHT (Step 1+) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPacket1 && (
        <div ref={packet1Ref} className="relative w-full max-w-xs py-2 flex flex-col items-center animate-fadeIn">
          {/* Vertical Cable Line */}
          <div className="w-1.5 h-10 bg-slate-200 rounded-full relative overflow-hidden">
            <div 
              className={`w-full rounded-full transition-all duration-500 ${
                isThreatOrMalware ? 'bg-rose-500 shadow-sm' : 'bg-blue-500 shadow-sm'
              }`}
              style={{
                height: currentStepIndex >= 1 ? '100%' : '30%',
                boxShadow: isThreatOrMalware ? '0 0 10px rgba(239, 68, 68, 0.6)' : '0 0 10px rgba(59, 130, 246, 0.6)'
              }}
            />
          </div>

          {/* Floating Downward Packet Card */}
          <div className={`w-full max-w-[270px] my-1 p-2.5 rounded-xl border shadow-md transition-all duration-300 z-20 ${
            isThreatOrMalware
              ? 'bg-rose-50/95 border-rose-400 ring-2 ring-rose-400/20'
              : isEarly
              ? 'bg-blue-50/95 border-blue-400 ring-2 ring-blue-400/20'
              : isAtMiddle
              ? 'bg-amber-50/95 border-amber-400 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold border-b border-slate-200/80 pb-1 mb-1">
              <span className="flex items-center gap-1 text-slate-800">
                {isThreatOrMalware ? (
                  <>
                    <ShieldAlert className="h-3 w-3 text-rose-600 animate-pulse" />
                    <span className="text-rose-700 font-bold">SUSPICIOUS / INBOUND</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 text-blue-600 animate-bounce" />
                    <span>PACKET IN TRANSIT</span>
                  </>
                )}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-white text-[10px] font-bold ${
                isThreatOrMalware ? 'bg-rose-600' : 'bg-blue-600'
              }`}>
                {pkt.protocol} {pkt.flags ? `[${pkt.flags}]` : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
              <div>
                <span className="text-slate-400">SRC: </span>
                <span className="text-blue-700 font-bold">{pkt.srcIp}:{pkt.srcPort || '52410'}</span>
              </div>
              <div>
                <span className="text-slate-400">DST: </span>
                <span className="text-indigo-700 font-bold">{pkt.dstIp}:{pkt.dstPort || '443'}</span>
              </div>
            </div>

            {pkt.payloadSummary && (
              <p className="text-[10px] text-slate-600 font-medium truncate mt-1 pt-1 border-t border-slate-100">
                Payload: {pkt.payloadSummary}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. COMPONENT 3: FIREWALL / SECURITY GATEWAY (Step 1+) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showGateway && (
        <div ref={gatewayRef} className="relative z-10 flex flex-col items-center w-full max-w-xs animate-fadeIn">
          <RealisticRouterFirewall
            label={gw.label}
            sublabel={gw.sub}
            isActive={isInspecting || isAtMiddle}
            isSuccess={isAllowed}
            isDanger={isDenied}
            statusText={
              isDenied 
                ? '✕ BLOCKED AT FIREWALL' 
                : isAllowed 
                ? 'VERDICT: ALLOWED ✓' 
                : isInspecting 
                ? 'INSPECTING RULES...' 
                : undefined
            }
          />

          {/* Blocked Barrier Indicator (If packet is dropped) */}
          {isDenied && (
            <div className="w-full mt-2 p-2 rounded-xl bg-rose-100/90 border border-rose-300 text-center animate-pop-in">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-rose-800">
                <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>PACKET BLOCKED & HALTED AT FIREWALL</span>
              </div>
              <p className="text-[10px] text-rose-700 mt-0.5">
                Traffic cannot cross the security boundary. Server remains safe.
              </p>
            </div>
          )}

          {/* Live Evaluation & Policy Box attached to Firewall */}
          <div className={`w-full mt-2.5 rounded-xl border p-3 text-xs shadow-xs transition-all ${
            isAllowed
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : isDenied
              ? 'bg-rose-50/80 border-rose-300 text-rose-950'
              : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5">
              <span className="font-mono text-[11px] font-bold flex items-center gap-1 text-slate-800">
                <Activity className="h-3.5 w-3.5 text-blue-600" />
                {step.label}
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isAllowed ? 'bg-emerald-100 text-emerald-800' :
                isDenied ? 'bg-rose-100 text-rose-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {step.decision || (isInspecting ? 'INSPECT' : 'READY')}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              {step.whatIsHappening}
            </p>

            {/* Rule Matched Badge */}
            {step.ruleMatched && (
              <div className="mt-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Matched Rule:</span>
                <span className={`font-bold truncate max-w-[140px] ${isDenied ? 'text-rose-700' : 'text-blue-700'}`}>
                  {step.ruleMatched}
                </span>
              </div>
            )}

            {/* NAT Table if available */}
            {step.natTable && step.natTable.length > 0 && (
              <div className="mt-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono">
                <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[9px] mb-0.5">
                  <span>NAT Translation Entry</span>
                  <span className="text-emerald-700 font-bold">ACTIVE</span>
                </div>
                <p className="text-slate-700 font-semibold truncate">
                  {step.natTable[0].insideLocal} → <span className="text-indigo-700 font-bold">{step.natTable[0].insideGlobal}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. COMPONENT 4: CONNECTOR 2 & VERDICT IN FLIGHT (Step 2+) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPacket2 && (
        <div ref={packet2Ref} className="relative w-full max-w-xs py-2 flex flex-col items-center animate-fadeIn">
          {/* Vertical Cable Line */}
          <div className="w-1.5 h-10 bg-slate-200 rounded-full relative overflow-hidden">
            <div 
              className={`w-full rounded-full transition-all duration-500 ${
                isAllowed
                  ? 'bg-emerald-500 shadow-sm'
                  : isDenied
                  ? 'bg-rose-500 shadow-sm'
                  : 'bg-slate-300'
              }`}
              style={{
                height: isFinal || isAllowed ? '100%' : isDenied ? '20%' : '15%',
                boxShadow: isAllowed ? '0 0 10px rgba(16, 185, 129, 0.6)' : undefined
              }}
            />
          </div>

          {/* Verdict Badge in transit */}
          <div className={`w-full max-w-[270px] my-1 p-2 rounded-xl border text-center transition-all duration-300 z-20 ${
            isAllowed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-sm'
              : isDenied
              ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-sm'
              : 'bg-white border-slate-200 text-slate-500 text-xs'
          }`}>
            {isAllowed ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>FORWARDED TO SERVER ✓</span>
              </div>
            ) : isDenied ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-rose-800">
                <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>BLOCKED — NO EGRESS TRAFFIC ✕</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
                <ArrowDown className="h-3.5 w-3.5 animate-bounce text-slate-400" />
                <span>Verifying Destination Route...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. COMPONENT 5: TARGET DESTINATION SERVER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showTarget && (
        <div ref={targetRef} className="relative z-10 flex flex-col items-center animate-fadeIn">
          <RealisticServer
            label={dstLabel}
            sublabel={dstIp}
            ip={dstIp}
            isActive={isAllowed && isFinal}
            isSuccess={isAllowed && isFinal}
            isDanger={isDenied && isFinal}
            statusText={
              isAllowed && isFinal 
                ? 'DELIVERED TO TARGET ✓' 
                : isDenied 
                ? 'UNREACHABLE / NO PACKET' 
                : 'WAITING...'
            }
          />
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERVIEW KEY TAKEAWAY CARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step.interviewTakeaway && (
        <div className="w-full max-w-xs mt-3 p-3 rounded-xl bg-blue-50/90 border border-blue-200 text-xs animate-fadeIn">
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
