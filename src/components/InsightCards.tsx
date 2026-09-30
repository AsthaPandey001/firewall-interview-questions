import React from 'react';
import { Lightbulb, Target, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import type { AnimationStep } from '../types';

interface InsightCardsProps {
  currentStep: AnimationStep;
  onOpenQuiz: () => void;
  onOpenSandbox: () => void;
  isRuleSpecificQuestion: boolean;
}

export const InsightCards: React.FC<InsightCardsProps> = ({
  currentStep,
  onOpenQuiz,
  onOpenSandbox,
  isRuleSpecificQuestion
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
      
      {/* What is happening? Card */}
      <div className="relative rounded-2xl border border-blue-100 bg-white p-4 sm:p-5 shadow-xs overflow-hidden flex flex-col justify-between max-w-full">
        <div className="w-full">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              What is happening?
            </h3>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal break-words whitespace-normal">
            {currentStep.whatIsHappening}
          </p>

          {/* Rule Matched Pill if available */}
          {currentStep.ruleMatched && (
            <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-blue-50/70 border border-blue-200/80 px-2.5 py-1.5 text-xs max-w-full overflow-hidden">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="font-mono text-[11px] text-blue-900 font-semibold break-all whitespace-normal">
                {currentStep.ruleMatched}
              </span>
            </div>
          )}
        </div>

        {/* Live Packet Header Pill if available */}
        {currentStep.packetInfo && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-mono max-w-full overflow-hidden break-all">
            <span className="text-slate-500 font-medium text-[11px]">Header:</span>
            <span className="text-blue-700 font-bold">{currentStep.packetInfo.srcIp}</span>
            <span className="text-slate-400">➔</span>
            <span className="text-indigo-700 font-bold">{currentStep.packetInfo.dstIp}:{currentStep.packetInfo.dstPort || 'ANY'}</span>
            <span className="rounded bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[10px] font-bold">
              {currentStep.packetInfo.protocol}
            </span>
            {currentStep.decision && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                currentStep.decision === 'ALLOW' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {currentStep.decision}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Interview Takeaway Card */}
      <div className="relative rounded-2xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-xs flex flex-col justify-between overflow-hidden max-w-full">
        <div className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Interview takeaway
              </h3>
            </div>

            {/* Action CTA pill */}
            {isRuleSpecificQuestion ? (
              <button
                onClick={onOpenSandbox}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <Sparkles className="h-3 w-3" />
                <span>Test in Simulator</span>
              </button>
            ) : (
              <button
                onClick={onOpenQuiz}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span>Predict next step</span>
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium break-words whitespace-normal">
            {currentStep.interviewTakeaway}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
          <span>Explain the journey in order: 5-tuple, rule match, verdict.</span>
          <span className="text-blue-600 font-bold cursor-pointer hover:underline" onClick={onOpenQuiz}>
            Practice challenge →
          </span>
        </div>
      </div>

    </div>
  );
};
