import React from 'react';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw,
  Gauge
} from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReplay: () => void;
  currentStep: number;
  totalSteps: number;
  onScrub: (stepIndex: number) => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  onReplay,
  currentStep,
  totalSteps,
  onScrub,
  speed,
  onChangeSpeed,
}) => {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/95 border-t border-slate-200 rounded-b-2xl select-none">
      
      {/* 1. Primary Step Controls: [← PREVIOUS] [ NEXT →] [↻ REPLAY] */}
      <div className="flex items-center gap-2">
        {/* Previous Step */}
        <button
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-all shadow-2xs"
          title="Previous Step"
          aria-label="Previous Step"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">PREVIOUS</span>
        </button>

        {/* Next Step (Primary Action) */}
        <button
          onClick={onNextStep}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-all"
          title="Next Step (Advance Animation)"
          aria-label="Next Step"
        >
          <span>NEXT</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* Replay */}
        <button
          onClick={onReplay}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-all shadow-2xs"
          title="Replay from Step 1"
          aria-label="Replay"
        >
          <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden md:inline">REPLAY</span>
        </button>

        {/* Auto-Play Toggle */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isPlaying
              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-xs'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
          }`}
          title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play Sequence'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
          <span className="hidden lg:inline">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>
      </div>

      {/* 2. Small Step Dot & Number Indicator */}
      <div className="flex items-center gap-2.5">
        {/* Dot Stepper */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isFilled = idx <= currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={idx}
                onClick={() => onScrub(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'w-5 bg-blue-600'
                    : isFilled
                    ? 'w-2 bg-blue-400'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Numeric Badge (e.g. 3 / 8) */}
        <span className="px-2.5 py-0.5 rounded-md bg-slate-200/80 text-xs font-mono font-bold text-slate-700">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* 3. Speed Selector */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center bg-white rounded-lg border border-slate-300 px-2 py-0.5 shadow-2xs">
          <Gauge className="h-3.5 w-3.5 text-slate-400 mr-1" />
          <select
            value={speed}
            onChange={(e) => onChangeSpeed(Number(e.target.value))}
            className="bg-transparent text-xs font-mono font-bold text-slate-700 pr-1 py-1 focus:outline-none cursor-pointer"
          >
            {speeds.map((s) => (
              <option key={s} value={s} className="bg-white text-slate-800">
                {s}x
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};
