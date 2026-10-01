import React from 'react';
import type { QuestionData } from '../../types';
import { UniversalInteractiveLabEngine } from './UniversalInteractiveLabEngine';

interface UniversalVisualEngineProps {
  question: QuestionData;
  currentStepIndex: number;
  onOpenSandbox?: () => void;
}

export const UniversalVisualEngine: React.FC<UniversalVisualEngineProps> = ({
  question,
  currentStepIndex,
  onOpenSandbox,
}) => {
  return (
    <div className="w-full">
      <UniversalInteractiveLabEngine
        question={question}
        currentStepIndex={currentStepIndex}
        onOpenSandbox={onOpenSandbox}
      />
    </div>
  );
};
