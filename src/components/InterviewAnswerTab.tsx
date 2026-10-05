import React from 'react';
import { 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  Copy, 
  Check,
  ShieldCheck
} from 'lucide-react';
import type { QuestionData, CliSnippet } from '../types';

interface InterviewAnswerTabProps {
  question: QuestionData;
}

// Markdown parser helper for structured Deep Dive rendering
const renderFormattedText = (text: string) => {
  // Replace bold **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-indigo-700 font-semibold">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const dataRows = tableRows.slice(1).filter(r => !r.every(c => c.trim().match(/^:?-+:?$/)));
      elements.push(
        <div key={key} className="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {headers.map((h, i) => (
                  <th key={i} className="p-2.5 font-bold text-slate-800 font-mono uppercase text-[11px]">
                    {renderFormattedText(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-slate-700 text-xs">
                      {renderFormattedText(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table Row detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      const cells = trimmed.slice(1, -1).split('|');
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable(`table-${idx}`);
    }

    // Heading 3: ###
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="text-sm font-extrabold text-slate-900 mt-4 mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>{trimmed.replace('### ', '')}</span>
        </h4>
      );
      return;
    }

    // Heading 4: ####
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h5 key={idx} className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mt-3 mb-1.5 text-indigo-700">
          {trimmed.replace('#### ', '')}
        </h5>
      );
      return;
    }

    // Nested Bullet: "  * " or "    *"
    if (line.startsWith('  * ') || line.startsWith('    * ') || line.startsWith('   * ')) {
      elements.push(
        <div key={idx} className="pl-6 py-1 flex items-start gap-2 text-xs sm:text-sm text-slate-600">
          <span className="h-1 w-1 rounded-full bg-slate-400 mt-2 shrink-0" />
          <span>{renderFormattedText(trimmed.replace(/^\*\s+/, ''))}</span>
        </div>
      );
      return;
    }

    // Main Bullet: "* " or "- "
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      elements.push(
        <div key={idx} className="py-1.5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0 shadow-2xs" />
          <span>{renderFormattedText(trimmed.replace(/^(\*|-)\s+/, ''))}</span>
        </div>
      );
      return;
    }

    // Numbered list: "1. "
    if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <div key={idx} className="py-1.5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold mt-0.5">
            {trimmed.match(/^\d+/)?.[0]}
          </span>
          <span>{renderFormattedText(trimmed.replace(/^\d+\.\s+/, ''))}</span>
        </div>
      );
      return;
    }

    // Regular paragraph
    if (trimmed.length > 0) {
      elements.push(
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1.5">
          {renderFormattedText(trimmed)}
        </p>
      );
    }
  });

  if (inTable) {
    flushTable('table-end');
  }

  return elements;
};

export const InterviewAnswerTab: React.FC<InterviewAnswerTabProps> = ({ question }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Normalize CLI snippets
  const rawSnippets: CliSnippet[] = [];
  if (question.cliSnippets && question.cliSnippets.length > 0) {
    rawSnippets.push(...question.cliSnippets);
  } else if (question.cliSnippet) {
    rawSnippets.push({
      label: 'Production Diagnostic CLI & Config Syntax',
      code: question.cliSnippet
    });
  }

  // Normalize Common Traps
  const commonTrapsList: string[] = [];
  if (Array.isArray(question.commonTraps)) {
    commonTrapsList.push(...question.commonTraps);
  } else if (typeof question.commonTraps === 'string') {
    commonTrapsList.push(question.commonTraps);
  } else if (question.commonTrap) {
    commonTrapsList.push(question.commonTrap);
  }

  // Normalize Key Takeaways
  const takeawaysList: string[] = [];
  if (question.keyTakeaways && question.keyTakeaways.length > 0) {
    takeawaysList.push(...question.keyTakeaways);
  } else {
    // Generate fallback takeaways from animation steps
    question.steps.slice(-3).forEach(s => {
      if (s.interviewTakeaway && !takeawaysList.includes(s.interviewTakeaway)) {
        takeawaysList.push(s.interviewTakeaway);
      }
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Elevator Pitch Box (The 30-Second Interview Response) */}
      <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
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

          {question.difficulty && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider font-mono border ${
              question.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              question.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {question.difficulty}
            </span>
          )}
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

        {Array.isArray(question.deepDive) ? (
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
        ) : (
          <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-200/70">
            {renderMarkdownContent(question.deepDive)}
          </div>
        )}
      </div>

      {/* 3. Real-World Scenario & Common Traps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Real-World Scenario */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
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
        </div>

        {/* Common Interview Trap */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-900">
                Common Interviewer Trap
              </h4>
            </div>
            <div className="space-y-1.5">
              {commonTrapsList.map((trap, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {commonTrapsList.length > 1 && (
                    <span className="text-amber-600 font-bold">•</span>
                  )}
                  <span>{trap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. CLI Commands / Config Snippets */}
      {rawSnippets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-blue-600 shrink-0" />
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Production CLI Commands & Configuration Syntax
            </h4>
          </div>
          <div className="space-y-3">
            {rawSnippets.map((snippet, idx) => (
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
                <pre className="p-3 text-[11px] sm:text-xs font-mono text-cyan-300 overflow-x-auto selection:bg-blue-600 selection:text-white leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Key Takeaways Checklist */}
      {takeawaysList.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Key Interview Takeaways
            </h4>
          </div>
          <ul className="space-y-2">
            {takeawaysList.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
