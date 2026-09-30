import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  ShieldAlert
} from 'lucide-react';
import type { QuestionData } from '../types';

interface SidebarProps {
  questions: QuestionData[];
  currentQuestionId: number;
  onSelectQuestion: (id: number) => void;
  completedIds: number[];
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenSandbox: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  questions,
  currentQuestionId,
  onSelectQuestion,
  completedIds,
  mobileOpen,
  setMobileOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = questions.filter(q => {
    return (
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toString().includes(searchQuery)
    );
  });

  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      
      {/* Top Sidebar Header (Matching Reference Screenshot exactly) */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Networking • <span className="text-slate-500 font-medium">{questions.length} Questions</span>
          </h2>
        </div>

        {/* Progress Display */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>{completedCount} / {questions.length} completed</span>
            <span className="text-blue-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search input (Clean, without category pills below) */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Question List (Clean, matching screenshot layout with number, title, status) */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredQuestions.length === 0 ? (
          <div className="p-6 text-center">
            <ShieldAlert className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">No matching questions found.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-blue-600 font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isActive = q.id === currentQuestionId;
            const isCompleted = completedIds.includes(q.id);
            const numStr = q.id < 10 ? `0${q.id}` : `${q.id}`;

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(q.id);
                  setMobileOpen(false);
                }}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/90 border border-blue-200 text-blue-900 font-semibold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* 2-Digit Number */}
                <span className={`text-xs font-mono font-semibold shrink-0 ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {numStr}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className={`text-xs leading-snug line-clamp-2 ${
                    isActive ? 'text-blue-950 font-bold' : 'text-slate-700'
                  }`}>
                    {q.title}
                  </p>
                </div>

                {/* Status Indicator (Checkmark vs Active ring vs Empty circle) */}
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-500 text-white" />
                    </div>
                  ) : isActive ? (
                    <div className="h-4 w-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    </div>
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar with graceful top gap & curved borders */}
      <aside className="hidden lg:block w-80 shrink-0 h-[calc(100vh-5.5rem)] sticky top-20 z-30 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] bg-white overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 rounded-r-2xl overflow-hidden bg-white">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
