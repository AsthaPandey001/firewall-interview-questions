import { useState, useEffect } from 'react';
import { QUESTIONS_DATA } from './data/questions';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuestionView } from './components/QuestionView';
import { RuleSimulatorSandbox } from './components/RuleSimulatorSandbox';
import { CheatSheetModal } from './components/CheatSheetModal';
import { SearchModal } from './components/SearchModal';
import confetti from 'canvas-confetti';

export function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) {
      const parsed = parseInt(qParam, 10);
      if (parsed >= 1 && parsed <= QUESTIONS_DATA.length) return parsed;
    }
    return 1;
  });

  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('netsec_completed_ids');
      return stored ? JSON.parse(stored) : [1];
    } catch {
      return [1];
    }
  });

  const [activeNavTab, setActiveNavTab] = useState<'lab' | 'sandbox' | 'cheatsheet'>('lab');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync completed IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('netsec_completed_ids', JSON.stringify(completedIds));
    } catch (e) {}
  }, [completedIds]);

  // Sync URL query param without full page reload
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', currentQuestionId.toString());
    window.history.replaceState({}, '', url.toString());
  }, [currentQuestionId]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectQuestion = (id: number) => {
    setCurrentQuestionId(id);
    setActiveNavTab('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkCompleted = (id: number) => {
    setCompletedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      const updated = [...prev, id];
      if (updated.length === QUESTIONS_DATA.length) {
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 }
          });
        } catch (e) {}
      }
      return updated;
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all question completion progress?')) {
      setCompletedIds([]);
    }
  };

  const currentQuestionIndex = QUESTIONS_DATA.findIndex((q) => q.id === currentQuestionId);
  const currentQuestion = QUESTIONS_DATA[currentQuestionIndex] || QUESTIONS_DATA[0];

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      handleSelectQuestion(QUESTIONS_DATA[currentQuestionIndex - 1].id);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS_DATA.length - 1) {
      handleSelectQuestion(QUESTIONS_DATA[currentQuestionIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Global Header */}
      <Header
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        completedCount={completedIds.length}
        totalQuestions={QUESTIONS_DATA.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onResetProgress={handleResetProgress}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* 2. Main Body Layout (Spacious left alignment with top gap and curved elements) */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 px-3 sm:px-5 lg:px-6 py-4 gap-6">
        
        {/* Left Sidebar (Pushed nicely to the left with top space and curved corners) */}
        <Sidebar
          questions={QUESTIONS_DATA}
          currentQuestionId={currentQuestionId}
          onSelectQuestion={handleSelectQuestion}
          completedIds={completedIds}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          onOpenSandbox={() => setActiveNavTab('sandbox')}
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 min-w-0">
          {activeNavTab === 'lab' && (
            <QuestionView
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={QUESTIONS_DATA.length}
              onPrevQuestion={handlePrevQuestion}
              onNextQuestion={handleNextQuestion}
              onMarkCompleted={handleMarkCompleted}
              isCompleted={completedIds.includes(currentQuestion.id)}
              onOpenSandbox={() => setActiveNavTab('sandbox')}
            />
          )}

          {activeNavTab === 'sandbox' && (
            <RuleSimulatorSandbox
              onBackToLab={() => setActiveNavTab('lab')}
              onSelectQuestion={handleSelectQuestion}
            />
          )}

          {activeNavTab === 'cheatsheet' && (
            <CheatSheetModal
              onSelectQuestion={handleSelectQuestion}
            />
          )}
        </main>

      </div>

      {/* 3. Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={QUESTIONS_DATA}
        onSelectQuestion={handleSelectQuestion}
      />

    </div>
  );
}

export default App;
