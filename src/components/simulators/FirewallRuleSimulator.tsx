import React, { useState, useRef, useEffect } from 'react';
import { 
  GripVertical, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Laptop, 
  Server, 
  Info,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FirewallRule, PacketScenario } from '../../types';
import { DEFAULT_FIREWALL_RULES, PRESET_PACKETS } from '../../data/simulatorPresets';
import { evaluatePacketRules } from '../../utils/packetMatcher';
import type { SimulationResult } from '../../utils/packetMatcher';

interface FirewallRuleSimulatorProps {
  initialPacket?: PacketScenario;
  onSimulateComplete?: (result: SimulationResult) => void;
  isStandalone?: boolean;
}

export const FirewallRuleSimulator: React.FC<FirewallRuleSimulatorProps> = ({
  initialPacket,
  onSimulateComplete
}) => {
  const [rules, setRules] = useState<FirewallRule[]>(() => JSON.parse(JSON.stringify(DEFAULT_FIREWALL_RULES)));
  const [selectedPacket, setSelectedPacket] = useState<PacketScenario>(initialPacket || PRESET_PACKETS[0]);
  const [customIp, setCustomIp] = useState(PRESET_PACKETS[0].srcIp);
  const [customPort, setCustomPort] = useState(PRESET_PACKETS[0].port);
  const [customProto, setCustomProto] = useState<'TCP' | 'UDP' | 'ICMP'>(PRESET_PACKETS[0].protocol);

  // Simulation animation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [evaluatingRuleIndex, setEvaluatingRuleIndex] = useState<number | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [packetPositionPercent, setPacketPositionPercent] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasReordered, setHasReordered] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const handleDragStart = (index: number) => {
    if (rules[index].isImplicit) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    if (rules[index].isImplicit) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    if (rules[index].isImplicit) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...rules];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, movedItem);
    
    setRules(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setHasReordered(true);
    setSimulationResult(null);
    setEvaluatingRuleIndex(null);
    setPacketPositionPercent(0);
    setLogs([`⚡ Rule order modified: "${movedItem.name}" moved to position #${index + 1}. Click "Simulate Packet" to test.`]);
  };

  const moveRule = (from: number, to: number) => {
    if (to < 0 || to >= rules.length - 1) return;
    const updated = [...rules];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setRules(updated);
    setHasReordered(true);
    setSimulationResult(null);
  };

  const handleSelectPreset = (p: PacketScenario) => {
    setSelectedPacket(p);
    setCustomIp(p.srcIp);
    setCustomPort(p.port);
    setCustomProto(p.protocol);
    setSimulationResult(null);
    setEvaluatingRuleIndex(null);
    setPacketPositionPercent(0);
    setLogs([`Selected test packet: ${p.name}`]);
  };

  const handleRunSimulation = () => {
    clearAllTimers();
    setIsSimulating(true);
    setSimulationResult(null);
    setEvaluatingRuleIndex(null);
    setPacketPositionPercent(10);
    
    const activePacket: PacketScenario = {
      ...selectedPacket,
      srcIp: customIp,
      port: customPort,
      protocol: customProto
    };

    const result = evaluatePacketRules(activePacket, rules);
    const newLogs: string[] = [
      `🚀 Packet generated: ${activePacket.srcIp} → Server (${activePacket.dstIp}:${activePacket.port}) [${activePacket.protocol}]`,
      `🔍 Ingressing Firewall... Evaluating security rules top-to-bottom:`
    ];
    setLogs(newLogs);

    // Step 1: Packet moves from Client to Firewall
    const t1 = setTimeout(() => {
      setPacketPositionPercent(48);
    }, 400);
    timerRef.current.push(t1);

    // Step 2: Iterate through evaluated rules
    let delay = 900;
    result.steps.forEach((step) => {
      const tRule = setTimeout(() => {
        setEvaluatingRuleIndex(step.ruleIndex);
        setLogs(prev => [
          ...prev,
          `  Checking Rule ${step.ruleIndex + 1} (${step.rule.name}): ${step.reason}`
        ]);
      }, delay);
      timerRef.current.push(tRule);
      delay += 800;
    });

    // Step 3: Match decision & finalize
    const tFinal = setTimeout(() => {
      setEvaluatingRuleIndex(result.matchedRuleIndex);
      setSimulationResult(result);
      setIsSimulating(false);

      if (result.decision === 'ALLOW') {
        setPacketPositionPercent(90);
        setLogs(prev => [
          ...prev,
          `✅ DECISION: ALLOWED by Rule ${result.matchedRuleIndex + 1} ("${result.matchedRule.name}")! Packet forwarded to server.`
        ]);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (e) {}
      } else {
        setPacketPositionPercent(52);
        setLogs(prev => [
          ...prev,
          `❌ DECISION: DENIED by Rule ${result.matchedRuleIndex + 1} ("${result.matchedRule.name}")! Packet dropped at firewall.`
        ]);
      }

      if (onSimulateComplete) {
        onSimulateComplete(result);
      }
    }, delay + 400);
    timerRef.current.push(tFinal);
  };

  const handleResetRules = () => {
    clearAllTimers();
    setRules(JSON.parse(JSON.stringify(DEFAULT_FIREWALL_RULES)));
    setSimulationResult(null);
    setEvaluatingRuleIndex(null);
    setPacketPositionPercent(0);
    setHasReordered(false);
    setLogs(['Rules reset to default baseline configuration.']);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Concept Explainer */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                Live Firewall Rule Reordering Simulator
                <span className="rounded-md bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                  Top-to-Bottom First Match
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Drag rules up/down to observe how rule order deterministically changes the ALLOW/DENY verdict.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
            Reset Rules
          </button>
        </div>
      </div>

      {/* Interactive Topology Visualizer Canvas (Light Theme with Dot Grid) */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm bg-grid-dots min-h-[220px] flex flex-col justify-between">
        
        {/* Top Topology Status Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono text-slate-700 font-bold">
              TRAFFIC FLOW: Source Host ({customIp}) → Firewall → Server (192.168.1.100)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Evaluation:</span>
            <span className="text-blue-600 font-bold">Sequential First Match</span>
          </div>
        </div>

        {/* Nodes & Packet Animation Track */}
        <div className="relative my-8 flex items-center justify-between px-4 sm:px-12">
          
          {/* Connection Line Behind Nodes */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
            <div 
              className={`h-full transition-all duration-700 ${
                simulationResult?.decision === 'ALLOW' 
                  ? 'bg-emerald-500 shadow-sm'
                  : simulationResult?.decision === 'DENY'
                  ? 'bg-rose-500 shadow-sm'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.max(10, packetPositionPercent)}%` }}
            />
          </div>

          {/* Node 1: Client Host */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border-2 border-blue-500 text-blue-600 shadow-md">
              <Laptop className="h-7 w-7" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Source Host</span>
            <span className="text-[11px] font-mono text-blue-600 font-semibold">{customIp}</span>
          </div>

          {/* Node 2: Firewall Inspection Engine */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all shadow-md ${
              evaluatingRuleIndex !== null
                ? 'bg-blue-50 border-blue-600 text-blue-700 scale-110 shadow-blue-500/20'
                : simulationResult?.decision === 'ALLOW'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : simulationResult?.decision === 'DENY'
                ? 'bg-rose-50 border-rose-500 text-rose-700'
                : 'bg-white border-slate-300 text-slate-700'
            }`}>
              <Shield className="h-8 w-8" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Firewall Gateway</span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              {evaluatingRuleIndex !== null ? `Checking Rule #${evaluatingRuleIndex + 1}` : 'Rule Inspector'}
            </span>
          </div>

          {/* Node 3: Target Server */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all shadow-md ${
              simulationResult?.decision === 'ALLOW'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 scale-105'
                : 'bg-white border-slate-300 text-slate-600'
            }`}>
              <Server className="h-7 w-7" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800">Target Server</span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">192.168.1.100:{customPort}</span>
          </div>

          {/* Moving Animated Packet Badge */}
          {isSimulating && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out"
              style={{ left: `${packetPositionPercent}%` }}
            >
              <div className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 shadow-md text-white font-mono text-[10px] font-bold ring-2 ring-blue-300 -translate-x-1/2 -translate-y-8 animate-bounce">
                <span>[{customProto} :{customPort}]</span>
              </div>
            </div>
          )}

        </div>

        {/* Verdict Badge at bottom of canvas */}
        {simulationResult && (
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
            simulationResult.decision === 'ALLOW'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-3">
              {simulationResult.decision === 'ALLOW' ? (
                <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="h-7 w-7 text-rose-600 shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight">
                    VERDICT: {simulationResult.decision === 'ALLOW' ? 'ALLOWED ✓' : 'DENIED ✕'}
                  </span>
                  <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 shadow-2xs">
                    Matched Rule #{simulationResult.matchedRuleIndex + 1}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-0.5 font-medium">
                  {simulationResult.explanation}
                </p>
              </div>
            </div>

            {hasReordered && (
              <div className="rounded-lg bg-white border border-amber-200 px-3 py-1.5 text-xs text-amber-900 font-bold shadow-2xs shrink-0">
                ⚡ Rule order changed the evaluation decision!
              </div>
            )}
          </div>
        )}

      </div>

      {/* Main Controls Split View: Packet Tester Left + Draggable Rules Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Packet Crafting & Presets */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Laptop className="h-4 w-4 text-blue-600" />
              Select or Craft Test Packet
            </h4>

            {/* Presets List */}
            <div className="space-y-2 mb-4">
              {PRESET_PACKETS.map((pkt) => {
                const isSelected = selectedPacket.id === pkt.id && customIp === pkt.srcIp && customPort === pkt.port;
                return (
                  <button
                    key={pkt.id}
                    onClick={() => handleSelectPreset(pkt)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/80 text-blue-950 font-bold ring-1 ring-blue-500/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{pkt.name}</p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Src: <span className="text-blue-700 font-semibold">{pkt.srcIp}</span> | Port: <span className="text-indigo-700 font-semibold">{pkt.port}</span>
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                      {pkt.category}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom 5-tuple input */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Source IP Address
                </label>
                <input
                  type="text"
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="e.g. 10.0.0.25"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Dest Port
                  </label>
                  <input
                    type="number"
                    value={customPort}
                    onChange={(e) => setCustomPort(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    placeholder="443"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Protocol
                  </label>
                  <select
                    value={customProto}
                    onChange={(e) => setCustomProto(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Big Simulate Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              {isSimulating ? 'Simulating Packet Flow...' : 'Simulate Packet'}
            </button>
          </div>

          {/* Real-Time Evaluation Terminal Log */}
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Firewall Evaluation Engine Log
              </span>
              <span className="text-[10px] text-slate-500">Deterministic</span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-[11px]">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">Click "Simulate Packet" to inspect rule evaluation...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className={`leading-relaxed ${
                    log.includes('✅') ? 'text-emerald-400 font-bold' :
                    log.includes('❌') ? 'text-rose-400 font-bold' :
                    log.includes('⚡') ? 'text-amber-300 font-bold' :
                    log.includes('Matched!') ? 'text-cyan-300 font-bold' :
                    'text-slate-300'
                  }`}>
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Draggable Firewall Rules Table */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Firewall Security Rulebase (Draggable)
                </h4>
                <p className="text-xs text-slate-500">
                  Drag rules up or down using the handle to reorder the evaluation sequence.
                </p>
              </div>

              <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] font-mono font-bold text-slate-700">
                {rules.length} Rules Active
              </span>
            </div>

            {/* Rules List */}
            <div className="space-y-2.5">
              {rules.map((rule, idx) => {
                const isBeingEvaluated = evaluatingRuleIndex === idx;
                const isMatched = simulationResult?.matchedRuleIndex === idx;
                const isDragOver = dragOverIndex === idx;
                const isDragging = draggedIndex === idx;

                return (
                  <div
                    key={rule.id}
                    draggable={!rule.isImplicit && !isSimulating}
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    className={`relative flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      rule.isImplicit
                        ? 'bg-slate-50 border-slate-200 border-dashed text-slate-500'
                        : isDragging
                        ? 'opacity-40 border-blue-500 bg-blue-50'
                        : isDragOver
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 scale-[1.02]'
                        : isMatched
                        ? rule.action === 'ALLOW'
                          ? 'border-emerald-500 bg-emerald-50/80 text-slate-900 ring-2 ring-emerald-500/30'
                          : 'border-rose-500 bg-rose-50/80 text-slate-900 ring-2 ring-rose-500/30'
                        : isBeingEvaluated
                        ? 'border-blue-500 bg-blue-50/80 text-slate-900 ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Drag Handle */}
                    {!rule.isImplicit ? (
                      <div 
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                        title="Drag to reorder rule"
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="w-5 shrink-0 text-center text-slate-400 font-bold text-xs">
                        🔒
                      </div>
                    )}

                    {/* Rule Priority Badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {rule.isImplicit ? 'DEFAULT' : `#${idx + 1}`}
                      </span>
                    </div>

                    {/* Action Pill */}
                    <div className="shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-extrabold uppercase tracking-wider ${
                        rule.action === 'ALLOW'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {rule.action}
                      </span>
                    </div>

                    {/* Rule 5-Tuple Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {rule.name}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-600">
                        <span>Src: <strong className="text-slate-900">{rule.srcIp}</strong></span>
                        <span>Dst: <strong className="text-slate-900">{rule.dstIp}</strong></span>
                        <span>Port: <strong className="text-blue-700">{rule.port}</strong></span>
                        <span>Proto: <strong className="text-indigo-700">{rule.protocol}</strong></span>
                      </div>
                    </div>

                    {/* Quick Move Arrows */}
                    {!rule.isImplicit && (
                      <div className="hidden sm:flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => moveRule(idx, idx - 1)}
                          disabled={idx === 0}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveRule(idx, idx + 1)}
                          disabled={idx >= rules.length - 2}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Educational Note Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <strong>Interview Demonstration:</strong> Try moving <em>Rule 2 (DENY ANY 443)</em> above <em>Rule 1 (ALLOW 10.0.0.0/24)</em>. When you simulate packet <code>10.0.0.25:443</code>, the decision immediately changes from <strong>ALLOWED</strong> to <strong>DENIED</strong> because the firewall evaluates rules from top to bottom and terminates at the first match!
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
