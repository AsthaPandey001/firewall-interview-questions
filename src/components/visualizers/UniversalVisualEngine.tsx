import React from 'react';
import type { QuestionData } from '../../types';

// Import all 20 dedicated visualizer components
import { Q1FirewallFlowVisualizer } from './Q1FirewallFlowVisualizer';
import { Q2FirewallTypesVisualizer } from './Q2FirewallTypesVisualizer';
import { Q3StatefulStatelessVisualizer } from './Q3StatefulStatelessVisualizer';
import { Q4NgfwDpiVisualizer } from './Q4NgfwDpiVisualizer';
import { Q5AclMatrixVisualizer } from './Q5AclMatrixVisualizer';
import { Q6DecisionFlowchartVisualizer } from './Q6DecisionFlowchartVisualizer';
import { Q7RuleOrderVisualizer } from './Q7RuleOrderVisualizer';
import { Q8MultipleMatchVisualizer } from './Q8MultipleMatchVisualizer';
import { Q9ImplicitDenyVisualizer } from './Q9ImplicitDenyVisualizer';
import { Q10ScenarioChallengeVisualizer } from './Q10ScenarioChallengeVisualizer';
import { Q11NatTranslationVisualizer } from './Q11NatTranslationVisualizer';
import { Q12NatTypesVisualizer } from './Q12NatTypesVisualizer';
import { Q13NatFirewallOrderVisualizer } from './Q13NatFirewallOrderVisualizer';
import { Q14IdsVsIpsVisualizer } from './Q14IdsVsIpsVisualizer';
import { Q15IdsPlacementVisualizer } from './Q15IdsPlacementVisualizer';
import { Q16TroubleshootingVisualizer } from './Q16TroubleshootingVisualizer';
import { Q17SegmentationVisualizer } from './Q17SegmentationVisualizer';
import { Q18VpnArchitecturesVisualizer } from './Q18VpnArchitecturesVisualizer';
import { Q19IpsecVisualizer } from './Q19IpsecVisualizer';
import { Q20TlsHandshakeVisualizer } from './Q20TlsHandshakeVisualizer';

interface UniversalVisualEngineProps {
  question: QuestionData;
  currentStepIndex: number;
  onOpenSandbox?: () => void;
}

export const UniversalVisualEngine: React.FC<UniversalVisualEngineProps> = ({
  question,
  currentStepIndex,
}) => {
  const step = question.steps[currentStepIndex] || question.steps[0];
  const totalSteps = question.steps.length;

  const renderVisualizer = () => {
    switch (question.id) {
      case 1:
        return <Q1FirewallFlowVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 2:
        return <Q2FirewallTypesVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 3:
        return <Q3StatefulStatelessVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 4:
        return <Q4NgfwDpiVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 5:
        return <Q5AclMatrixVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 6:
        return <Q6DecisionFlowchartVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 7:
        return <Q7RuleOrderVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 8:
        return <Q8MultipleMatchVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 9:
        return <Q9ImplicitDenyVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 10:
        return <Q10ScenarioChallengeVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 11:
        return <Q11NatTranslationVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 12:
        return <Q12NatTypesVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 13:
        return <Q13NatFirewallOrderVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 14:
        return <Q14IdsVsIpsVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 15:
        return <Q15IdsPlacementVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 16:
        return <Q16TroubleshootingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 17:
        return <Q17SegmentationVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 18:
        return <Q18VpnArchitecturesVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 19:
        return <Q19IpsecVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 20:
        return <Q20TlsHandshakeVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      default:
        return <Q1FirewallFlowVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
    }
  };

  return (
    <div className="relative w-full bg-white rounded-t-2xl flex flex-col justify-between overflow-hidden min-h-[360px] sm:min-h-[460px]">
      {/* Top Visual Canvas Header Strip (Small step indicator + short label) */}
      <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-bold font-mono shrink-0">
            <span>STEP {currentStepIndex + 1} / {totalSteps}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            {step.label}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {step.badge && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] sm:text-[11px] font-mono font-semibold text-slate-600">
              {step.badge}
            </span>
          )}
        </div>
      </div>

      {/* Main Progressive Visual Stage Canvas */}
      <div className="flex-1 w-full relative p-2 sm:p-4 flex items-center justify-center min-h-[260px] sm:min-h-[340px] bg-slate-50/40 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center max-w-full">
          {renderVisualizer()}
        </div>
      </div>
    </div>
  );
};
