import React, { useState } from 'react';
import type { QuestionData } from '../../types';
import { Smartphone, Monitor } from 'lucide-react';
import { MobileVerticalVisualizer } from './MobileVerticalVisualizer';

// Import all 50 dedicated visualizer components
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

// Questions 21–50
import { Q21RouterVsFirewallVisualizer } from './Q21RouterVsFirewallVisualizer';
import { Q22DmzProtectionVisualizer } from './Q22DmzProtectionVisualizer';
import { Q23DefaultGatewayVisualizer } from './Q23DefaultGatewayVisualizer';
import { Q24InboundOutboundVisualizer } from './Q24InboundOutboundVisualizer';
import { Q25HostVsNetworkFwVisualizer } from './Q25HostVsNetworkFwVisualizer';
import { Q26FirewallLoggingVisualizer } from './Q26FirewallLoggingVisualizer';
import { Q27RuleShadowingVisualizer } from './Q27RuleShadowingVisualizer';
import { Q28RuleOptimizationVisualizer } from './Q28RuleOptimizationVisualizer';
import { Q29DenyByDefaultVisualizer } from './Q29DenyByDefaultVisualizer';
import { Q30EgressFilteringVisualizer } from './Q30EgressFilteringVisualizer';
import { Q31ArpSecurityVisualizer } from './Q31ArpSecurityVisualizer';
import { Q32ArpSpoofingVisualizer } from './Q32ArpSpoofingVisualizer';
import { Q33DnsSecurityVisualizer } from './Q33DnsSecurityVisualizer';
import { Q34DnsSpoofingVisualizer } from './Q34DnsSpoofingVisualizer';
import { Q35DhcpRogueVisualizer } from './Q35DhcpRogueVisualizer';
import { Q36MacFilteringVisualizer } from './Q36MacFilteringVisualizer';
import { Q37PortScanVisualizer } from './Q37PortScanVisualizer';
import { Q38SynFloodVisualizer } from './Q38SynFloodVisualizer';
import { Q39DdosScrubbingVisualizer } from './Q39DdosScrubbingVisualizer';
import { Q40IdsSignatureVsAnomalyVisualizer } from './Q40IdsSignatureVsAnomalyVisualizer';
import { Q41TlsVsIpsecVpnVisualizer } from './Q41TlsVsIpsecVpnVisualizer';
import { Q42VpnTunnelSetupVisualizer } from './Q42VpnTunnelSetupVisualizer';
import { Q43SplitTunnelingVisualizer } from './Q43SplitTunnelingVisualizer';
import { Q44ZeroTrustVisualizer } from './Q44ZeroTrustVisualizer';
import { Q45LeastPrivilegeVisualizer } from './Q45LeastPrivilegeVisualizer';
import { Q46NacAccessVisualizer } from './Q46NacAccessVisualizer';
import { Q47ForwardVsReverseProxyVisualizer } from './Q47ForwardVsReverseProxyVisualizer';
import { Q48WafVsNetworkFwVisualizer } from './Q48WafVsNetworkFwVisualizer';
import { Q49TroubleshootWebsiteVisualizer } from './Q49TroubleshootWebsiteVisualizer';
import { Q50TroubleshootServerVisualizer } from './Q50TroubleshootServerVisualizer';

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
  const [viewOrientation, setViewOrientation] = useState<'auto' | 'vertical' | 'horizontal'>('auto');
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
      case 21:
        return <Q21RouterVsFirewallVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 22:
        return <Q22DmzProtectionVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 23:
        return <Q23DefaultGatewayVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 24:
        return <Q24InboundOutboundVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 25:
        return <Q25HostVsNetworkFwVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 26:
        return <Q26FirewallLoggingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 27:
        return <Q27RuleShadowingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 28:
        return <Q28RuleOptimizationVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 29:
        return <Q29DenyByDefaultVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 30:
        return <Q30EgressFilteringVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 31:
        return <Q31ArpSecurityVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 32:
        return <Q32ArpSpoofingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 33:
        return <Q33DnsSecurityVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 34:
        return <Q34DnsSpoofingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 35:
        return <Q35DhcpRogueVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 36:
        return <Q36MacFilteringVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 37:
        return <Q37PortScanVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 38:
        return <Q38SynFloodVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 39:
        return <Q39DdosScrubbingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 40:
        return <Q40IdsSignatureVsAnomalyVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 41:
        return <Q41TlsVsIpsecVpnVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 42:
        return <Q42VpnTunnelSetupVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 43:
        return <Q43SplitTunnelingVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 44:
        return <Q44ZeroTrustVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 45:
        return <Q45LeastPrivilegeVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 46:
        return <Q46NacAccessVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 47:
        return <Q47ForwardVsReverseProxyVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 48:
        return <Q48WafVsNetworkFwVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 49:
        return <Q49TroubleshootWebsiteVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      case 50:
        return <Q50TroubleshootServerVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
      default:
        return <Q1FirewallFlowVisualizer currentStepIndex={currentStepIndex} step={step} totalSteps={totalSteps} />;
    }
  };

  return (
    <div className="relative w-full bg-white rounded-t-2xl flex flex-col justify-between overflow-hidden min-h-[360px] sm:min-h-[460px]">
      {/* Top Visual Canvas Header Strip (Small step indicator + short label) */}
      <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white select-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-bold font-mono shrink-0">
            <span>STEP {currentStepIndex + 1} / {totalSteps}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
            {step.label}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Orientation Toggle Button */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[10px] font-mono">
            <button
              onClick={() => setViewOrientation('vertical')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                viewOrientation === 'vertical' || viewOrientation === 'auto'
                  ? 'sm:hidden bg-white text-blue-700 font-bold shadow-2xs'
                  : ''
              } ${viewOrientation === 'vertical' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'}`}
              title="Vertical Mobile View"
            >
              <Smartphone className="h-3 w-3" />
              <span>Vertical</span>
            </button>
            <button
              onClick={() => setViewOrientation('horizontal')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                viewOrientation === 'horizontal' || viewOrientation === 'auto'
                  ? 'hidden sm:flex bg-white text-blue-700 font-bold shadow-2xs'
                  : ''
              } ${viewOrientation === 'horizontal' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'}`}
              title="Wide Desktop View"
            >
              <Monitor className="h-3 w-3" />
              <span>Canvas</span>
            </button>
          </div>

          {step.badge && (
            <span className="hidden xs:inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] sm:text-[11px] font-mono font-semibold text-slate-600">
              {step.badge}
            </span>
          )}
        </div>
      </div>

      {/* Main Progressive Visual Stage Canvas */}
      <div className="flex-1 w-full relative p-2 sm:p-4 flex items-center justify-center min-h-[260px] sm:min-h-[340px] bg-slate-50/40 overflow-hidden">
        
        {/* Render Mobile Vertical Visualizer (Default on mobile screens) */}
        <div className={`w-full ${viewOrientation === 'vertical' ? 'block' : viewOrientation === 'horizontal' ? 'hidden' : 'block sm:hidden'}`}>
          <MobileVerticalVisualizer
            question={question}
            currentStepIndex={currentStepIndex}
            step={step}
            totalSteps={totalSteps}
            onOpenSandbox={onOpenSandbox}
          />
        </div>

        {/* Render Wide Desktop Horizontal Visualizer (Default on larger screens) */}
        <div className={`w-full h-full flex items-center justify-center max-w-full ${
          viewOrientation === 'horizontal' ? 'flex' : viewOrientation === 'vertical' ? 'hidden' : 'hidden sm:flex'
        }`}>
          {renderVisualizer()}
        </div>

      </div>
    </div>
  );
};
