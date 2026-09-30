import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Search,
  Sparkles
} from 'lucide-react';
import { CHEATSHEET_DATA } from '../data/cheatsheet';

interface CheatSheetModalProps {
  onSelectQuestion?: (id: number) => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredItems = CHEATSHEET_DATA.filter(item => 
    item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.commandsOrSyntax.some(c => c.label.toLowerCase().includes(filterQuery.toLowerCase()) || c.code.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn py-2">
      
      {/* Top Hero Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50/40 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Network Security Interview Cheat Sheet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Speed reference for port numbers, iptables syntax, Wireshark display filters, and 5-tuple interview frameworks.
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter cheat sheet..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Cheat Sheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, catIdx) => (
          <div 
            key={catIdx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                  {item.commandsOrSyntax.length} items
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {item.description}
              </p>

              {/* Commands / Code Blocks */}
              <div className="space-y-2.5">
                {item.commandsOrSyntax.map((cmd, cmdIdx) => {
                  const copyKey = `${catIdx}-${cmdIdx}`;
                  return (
                    <div key={cmdIdx} className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/80 border-b border-slate-200 text-[11px] text-slate-700 font-bold">
                        <span>{cmd.label}</span>
                        <button
                          onClick={() => handleCopy(cmd.code, copyKey)}
                          className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 cursor-pointer font-bold"
                        >
                          {copiedIndex === copyKey ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap font-medium">
                        <code>{cmd.code}</code>
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Tips */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h5 className="text-[11px] font-bold text-amber-800 mb-1 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Interviewer Pro Tip:
              </h5>
              <ul className="space-y-1">
                {item.keyTips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="text-xs text-slate-600 leading-relaxed font-medium">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
