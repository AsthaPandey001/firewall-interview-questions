export interface AnimationStep {
  id: number;
  label: string;
  badge?: string;
  sourceNode?: string;
  targetNode?: string;
  packetInfo?: {
    srcIp: string;
    dstIp: string;
    srcPort?: number | string;
    dstPort?: number | string;
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'TLS' | 'IPsec' | 'HTTP' | 'DNS' | 'ESP';
    flags?: string;
    payloadSummary?: string;
    isEncrypted?: boolean;
    isMalicious?: boolean;
  };
  stateTable?: {
    srcIp: string;
    srcPort: number;
    dstIp: string;
    dstPort: number;
    protocol: string;
    state: string;
    timeout?: string;
  }[];
  natTable?: {
    insideLocal: string;
    insideGlobal: string;
    outsideGlobal: string;
    protocol: string;
  }[];
  activeRuleIndex?: number;
  decision?: 'ALLOW' | 'DENY' | 'DROP' | 'INSPECT' | 'ALERT' | 'TRANSLATE' | 'ENCRYPT';
  ruleMatched?: string;
  activeNodes: string[];
  whatIsHappening: string;
  interviewTakeaway: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CliSnippet {
  label: string;
  code: string;
  lang?: string;
}

export interface QuestionData {
  id: number;
  categoryId: string;
  category: string;
  title: string;
  subtitle: string;
  visualType: 
    | 'firewall-flow'
    | 'firewall-types'
    | 'stateful-stateless'
    | 'ngfw-dpi'
    | 'acl-matrix'
    | 'decision-flowchart'
    | 'rule-order-demo'
    | 'multiple-match-demo'
    | 'implicit-deny'
    | 'scenario-simulator'
    | 'nat-translation'
    | 'nat-types'
    | 'nat-firewall-order'
    | 'ids-vs-ips'
    | 'ids-placement'
    | 'troubleshooting-flow'
    | 'network-segmentation'
    | 'vpn-architectures'
    | 'ipsec-encapsulation'
    | 'tls-handshake';
  elevatorPitch: string;
  deepDive: string[];
  realWorldScenario: string;
  commonTrap: string;
  keyTakeaways: string[];
  cliSnippets?: CliSnippet[];
  quiz: QuizQuestion;
  steps: AnimationStep[];
}

export interface FirewallRule {
  id: string;
  name: string;
  action: 'ALLOW' | 'DENY';
  srcIp: string;
  dstIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  port: string;
  description: string;
  isImplicit?: boolean;
}

export interface PacketScenario {
  id: string;
  name: string;
  srcIp: string;
  dstIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  port: number;
  payload: string;
  category: 'Legitimate Web' | 'Attack Traffic' | 'Internal Service' | 'Blocked Subnet';
}

export interface Category {
  id: string;
  name: string;
  count: number;
  iconName: string;
  color: string;
}
