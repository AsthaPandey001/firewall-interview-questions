import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  BookOpen, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Check 
} from 'lucide-react';
import type { QuestionData } from '../types';
import { StepProgressNav } from './StepProgressNav';
import { UniversalVisualEngine } from './visualizers/UniversalVisualEngine';
import { AnimationControls } from './AnimationControls';
import { InsightCards } from './InsightCards';
import { InterviewAnswerTab } from './InterviewAnswerTab';
import { PracticeQuizTab } from './PracticeQuizTab';
import confetti from 'canvas-confetti';

interface QuestionViewProps {
  question: QuestionData;
  questionIndex: number;
  totalQuestions: number;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onMarkCompleted: (id: number) => void;
  isCompleted: boolean;
  onOpenSandbox: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onPrevQuestion,
  onNextQuestion,
  onMarkCompleted,
  isCompleted,
  onOpenSandbox
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'answer' | 'practice'>('visual');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset step & tab when switching questions
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [question.id]);

  // Autoplay loop timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(1200, 3000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= question.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, question.steps.length]);

  const handleTogglePlay = () => {
    if (!isPlaying && currentStepIndex >= question.steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(question.steps.length - 1, prev + 1));
  };

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleScrub = (stepIndex: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(stepIndex);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?q=${question.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCompleteToggle = () => {
    onMarkCompleted(question.id);
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const currentStep = question.steps[currentStepIndex] || question.steps[0];
  const isRuleQuestion = question.visualType.includes('rule') || question.visualType.includes('scenario') || question.visualType.includes('implicit');

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12 w-full">
      
      {/* Top Breadcrumb & Metadata Header */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
            <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-blue-700">
              {question.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">
              Question {question.id} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end xs:self-auto shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer active:scale-95"
              title="Copy question direct link"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={handleCompleteToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>

        {/* Main Question Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {question.title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">
          {question.subtitle}
        </p>
      </div>

      {/* 3 Main View Tabs: Visual Lesson | Interview Answer | Practice */}
      <div className="flex items-center border-b border-slate-200 gap-1 sm:gap-6 pt-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'visual'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Visual lesson
        </button>

        <button
          onClick={() => setActiveTab('answer')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'answer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal className="h-4 w-4" />
          Interview answer
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'practice'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          Practice quiz
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
        </button>
      </div>

      {/* Tab 1: Visual Lesson View */}
      {activeTab === 'visual' && (
        <div className="space-y-4">
          
          {/* Step Progress Stepper */}
          <StepProgressNav
            steps={question.steps}
            currentStepIndex={currentStepIndex}
            onStepClick={(idx) => {
              setIsPlaying(false);
              setCurrentStepIndex(idx);
            }}
          />

          {/* Interactive Visual Stage Canvas */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <UniversalVisualEngine
              question={question}
              currentStepIndex={currentStepIndex}
              onOpenSandbox={onOpenSandbox}
            />

            {/* Animation Controls Bar */}
            <AnimationControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              onReplay={handleReplay}
              currentStep={currentStepIndex}
              totalSteps={question.steps.length}
              onScrub={handleScrub}
              speed={playbackSpeed}
              onChangeSpeed={setPlaybackSpeed}
            />
          </div>

          {/* Dynamic Insight Cards */}
          <InsightCards
            currentStep={currentStep}
            onOpenQuiz={() => setActiveTab('practice')}
            onOpenSandbox={onOpenSandbox}
            isRuleSpecificQuestion={isRuleQuestion}
          />

        </div>
      )}

      {/* Tab 2: Interview Answer Deep Dive */}
      {activeTab === 'answer' && (
        <InterviewAnswerTab question={question} />
      )}

      {/* Tab 3: Interactive Practice & Quiz */}
      {activeTab === 'practice' && (
        <PracticeQuizTab
          question={question}
          onMarkCompleted={onMarkCompleted}
          isCompleted={isCompleted}
        />
      )}

      {/* Bottom Footer Navigation */}
      <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
        <button
          onClick={onPrevQuestion}
          disabled={questionIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous Question</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className="text-xs font-mono font-bold text-slate-500">
          {question.id} / {totalQuestions}
        </div>

        <button
          onClick={onNextQuestion}
          disabled={questionIndex === totalQuestions - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Next Question</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
