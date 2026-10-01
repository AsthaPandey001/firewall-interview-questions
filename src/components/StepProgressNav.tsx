import React, { useRef, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import type { AnimationStep } from '../types';

interface StepProgressNavProps {
  steps: AnimationStep[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export const StepProgressNav: React.FC<StepProgressNavProps> = ({
  steps,
  currentStepIndex,
  onStepClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the active step into view, guaranteeing Step 1 is completely visible on start
  useEffect(() => {
    if (currentStepIndex === 0 && containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (activeStepRef.current && containerRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentStepIndex, steps]);

  if (!steps || steps.length <= 1) return null;

  return (
    <div 
      ref={containerRef}
      className="w-full py-2 px-1 sm:px-2 overflow-x-auto no-scrollbar scroll-smooth"
    >
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-max mx-auto px-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div className="flex items-center px-0.5 sm:px-1 shrink-0">
                  <ArrowRight className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors ${
                    isCompleted ? 'text-emerald-500' : isActive ? 'text-blue-500' : 'text-slate-300'
                  }`} />
                </div>
              )}

              <button
                ref={isActive ? activeStepRef : null}
                onClick={() => onStepClick(idx)}
                className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 ring-2 ring-blue-500/20'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
                }`}
                title={`Jump to step ${idx + 1}: ${step.label}`}
              >
                {/* Step Circle / Checkmark */}
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-white text-blue-600'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  {isCompleted ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : idx + 1}
                </span>

                {/* Step Name */}
                <span className="whitespace-nowrap max-w-[130px] sm:max-w-[180px] truncate text-[11px] sm:text-xs">
                  {step.badge || step.label.split(':')[0]}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
