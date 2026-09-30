import React from 'react';
import { 
  Search, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

export interface CategoryTab {
  id: string;
  label: string;
  count: number;
}

export const HEADER_CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All Topics', count: 20 },
  { id: 'fundamentals', label: 'Firewall Fundamentals', count: 4 },
  { id: 'acl-rules', label: 'ACL & Rules', count: 6 },
  { id: 'nat', label: 'NAT Translation', count: 3 },
  { id: 'security', label: 'IDS/IPS, VPN & TLS', count: 7 },
];

interface HeaderProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Category Navigation Tabs */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 lg:hidden shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <div 
            onClick={() => onSelectCategory('all')}
            className="flex cursor-pointer items-center gap-1 shrink-0"
          >
            <span className="text-xl font-black tracking-tight text-slate-900">
              Net<span className="text-blue-600">Prep</span>
            </span>
          </div>

          {/* Category Tabs (4-5 categories for filtering) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 h-16 overflow-x-auto no-scrollbar">
            {HEADER_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative h-full flex items-center gap-1.5 px-2.5 text-xs lg:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Search bar, Notification Bell */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Clean Airy Search Input */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3.5 py-1.5 text-xs text-slate-400 transition-all hover:border-slate-300 hover:bg-white hover:text-slate-600 w-36 sm:w-56 md:w-64"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-left">Search questions...</span>
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
