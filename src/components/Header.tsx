import React from 'react';
import { 
  Search, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'lab' | 'sandbox' | 'cheatsheet';
  setActiveTab: (tab: 'lab' | 'sandbox' | 'cheatsheet') => void;
  completedCount: number;
  totalQuestions: number;
  onOpenSearch: () => void;
  onResetProgress: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Main Navigation Tabs */}
        <div className="flex items-center gap-8 lg:gap-10">
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo (Exact clean styling from screenshot) */}
          <div 
            onClick={() => setActiveTab('lab')}
            className="flex cursor-pointer items-center gap-1"
          >
            <span className="text-xl font-black tracking-tight text-slate-900">
              Net<span className="text-blue-600">Prep</span>
            </span>
          </div>

          {/* Navigation Tabs (Underlined active style from screenshot) */}
          <nav className="hidden md:flex items-center gap-6 h-16">
            <button
              onClick={() => setActiveTab('lab')}
              className={`relative h-full flex items-center text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'lab'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interview Lab
              {activeTab === 'lab' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`relative h-full flex items-center text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Simulator
              {activeTab === 'sandbox' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`relative h-full flex items-center text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'cheatsheet'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cheat Sheet
              {activeTab === 'cheatsheet' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('cheatsheet')}
              className="relative h-full flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Resources
            </button>
          </nav>
        </div>

        {/* Right Side: Search bar, Notification Bell */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Clean Airy Search Input */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3.5 py-1.5 text-xs text-slate-400 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-600 w-44 sm:w-64 md:w-72"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-left">Search questions, topics or keywords...</span>
          </button>

          {/* Notification Bell */}
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
