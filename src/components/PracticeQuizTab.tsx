import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuestionData } from '../types';

interface PracticeQuizTabProps {
  question: QuestionData;
  onMarkCompleted: (id: number) => void;
  isCompleted: boolean;
}

export const PracticeQuizTab: React.FC<PracticeQuizTabProps> = ({
  question,
  onMarkCompleted,
  isCompleted
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const quiz = question.quiz;
  const isCorrect = selectedOption === quiz.correctIndex;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);

    if (selectedOption === quiz.correctIndex) {
      onMarkCompleted(question.id);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
      
      {/* Quiz Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm">
        
        {/* Quiz Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                Interactive Practice
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Knowledge Check Challenge
              </h3>
            </div>
          </div>

          {isCompleted && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shrink-0">
              <Check className="h-3.5 w-3.5 stroke-[3] text-emerald-600" />
              Completed
            </span>
          )}
        </div>

        {/* Question Text */}
        <p className="text-xs sm:text-base font-semibold text-slate-800 leading-relaxed mb-4 sm:mb-6">
          {quiz.question}
        </p>

        {/* Options List */}
        <div className="space-y-2.5 sm:space-y-3">
          {quiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === quiz.correctIndex;
            
            let buttonStyle = 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100';
            
            if (submitted) {
              if (isCorrectOption) {
                buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500 font-semibold';
              } else {
                buttonStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              buttonStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-semibold ring-1 ring-blue-600';
            }

            return (
              <button
                key={idx}
                onClick={() => !submitted && setSelectedOption(idx)}
                disabled={submitted}
                className={`w-full flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl border text-left transition-all text-xs sm:text-sm cursor-pointer shadow-2xs active:scale-[0.99] ${buttonStyle}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold mt-0.5 border ${
                  submitted && isCorrectOption
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : submitted && isSelected && !isCorrectOption
                    ? 'bg-rose-600 text-white border-rose-600'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
                {submitted && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {submitted && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try Again
            </button>
          )}

          <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Question {question.id} Practice
          </span>
        </div>

        {/* Feedback / Explanation Box */}
        {submitted && (
          <div className={`mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-xl border animate-fadeIn ${
            isCorrect 
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950' 
              : 'border-rose-200 bg-rose-50 text-rose-950'
          }`}>
            <div className="flex items-center gap-2 mb-1.5 font-bold text-xs sm:text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Correct! Outstanding reasoning.</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Incorrect. Review the detailed explanation:</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-6">
              {quiz.explanation}
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
