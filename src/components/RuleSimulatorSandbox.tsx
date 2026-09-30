import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { FirewallRuleSimulator } from './simulators/FirewallRuleSimulator';

interface RuleSimulatorSandboxProps {
  onBackToLab: () => void;
  onSelectQuestion: (id: number) => void;
}

export const RuleSimulatorSandbox: React.FC<RuleSimulatorSandboxProps> = ({
  onBackToLab,
  onSelectQuestion
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn py-2 pb-12">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLab}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Question Lab
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono font-medium">
            Directly tested in:
          </span>
          <button
            onClick={() => onSelectQuestion(7)}
            className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Q7 (Rule Order)
          </button>
          <button
            onClick={() => onSelectQuestion(10)}
            className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            Q10 (Decision Engine)
          </button>
        </div>
      </div>

      {/* The Standalone Drag-and-Drop Simulator Engine */}
      <FirewallRuleSimulator isStandalone={true} />

    </div>
  );
};
