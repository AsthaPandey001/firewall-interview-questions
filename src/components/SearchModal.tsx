import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Shield, ArrowRight } from 'lucide-react';
import type { QuestionData } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionData[];
  onSelectQuestion: (id: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSelectQuestion
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = questions.filter(q => {
    const qLower = query.toLowerCase();
    return (
      q.title.toLowerCase().includes(qLower) ||
      q.category.toLowerCase().includes(qLower) ||
      q.elevatorPitch.toLowerCase().includes(qLower) ||
      q.keyTakeaways.some(t => t.toLowerCase().includes(qLower)) ||
      q.id.toString() === query.trim()
    );
  });

  const popularKeywords = ['Firewall', 'NAT', 'VPN', 'TLS', 'ACL', 'IDS vs IPS', 'Rule Order', 'Implicit Deny'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-2.5 sm:px-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-10">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-white">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search questions by topic, keyword, rule, protocol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-700 mr-2 text-xs font-bold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Keyword Pills */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0 mr-1">
            Popular:
          </span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="whitespace-nowrap rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors shadow-2xs cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <Shield className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No questions found matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for NAT, ACL, Stateful, IPsec, or TLS.</p>
            </div>
          ) : (
            results.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(q.id);
                  onClose();
                }}
                className="group w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-blue-200 hover:bg-blue-50/70 text-left transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200 mt-0.5">
                    {q.id < 10 ? `0${q.id}` : q.id}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                      {q.title}
                    </p>
                    <span className="text-xs text-slate-500 font-medium">
                      {q.category}
                    </span>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
          <span>Press ESC to close</span>
          <span>Showing {results.length} of {questions.length} questions</span>
        </div>

      </div>
    </div>
  );
};
