import React from 'react';
import { 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  Copy, 
  Check 
} from 'lucide-react';
import type { QuestionData } from '../types';

interface InterviewAnswerTabProps {
  question: QuestionData;
}

export const InterviewAnswerTab: React.FC<InterviewAnswerTabProps> = ({ question }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Elevator Pitch Box (The 30-Second Interview Response) */}
      <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              The 30-Second Interview Response
            </h3>
            <p className="text-[11px] sm:text-xs text-blue-800 font-medium">
              Deliver this crisp summary first to establish mastery.
            </p>
          </div>
        </div>
        
        <blockquote className="border-l-4 border-blue-600 pl-3 sm:pl-4 py-2 text-xs sm:text-sm md:text-base font-medium text-slate-800 leading-relaxed italic bg-white/80 rounded-r-xl border border-slate-100 shadow-2xs">
          "{question.elevatorPitch}"
        </blockquote>
      </div>

      {/* 2. In-Depth Technical Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Technical Deep Dive
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Step-by-step architectural principles for follow-up questions.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {question.deepDive.map((item, idx) => {
            const parts = item.split('**');
            return (
              <div 
                key={idx} 
                className="flex items-start gap-2.5 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold mt-0.5 shadow-2xs">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {parts.length >= 3 ? (
                    <>
                      <strong className="text-slate-900 font-bold">{parts[1]}</strong>
                      {parts.slice(2).join('')}
                    </>
                  ) : (
                    item
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Real-World Scenario & Common Traps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Real-World Scenario */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
              <Flame className="h-4 w-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-900">
              Real-World Production Scenario
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {question.realWorldScenario}
          </p>
        </div>

        {/* Common Interview Trap */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-amber-900">
              Common Interviewer Trap
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {question.commonTrap}
          </p>
        </div>

      </div>

      {/* 4. CLI Commands / Config Snippets */}
      {question.cliSnippets && question.cliSnippets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-blue-600 shrink-0" />
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Production CLI Commands & Configuration Syntax
            </h4>
          </div>
          <div className="space-y-3">
            {question.cliSnippets.map((snippet, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xs">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200 truncate pr-2">{snippet.label}</span>
                  <button
                    onClick={() => handleCopy(snippet.code, idx)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer shrink-0 active:scale-95"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-[11px] sm:text-xs font-mono text-cyan-300 overflow-x-auto selection:bg-blue-600 selection:text-white">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Key Takeaways Checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
            Key Interview Takeaways
          </h4>
        </div>
        <ul className="space-y-2">
          {question.keyTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
