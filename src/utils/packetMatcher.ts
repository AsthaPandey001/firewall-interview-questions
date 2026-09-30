import type { FirewallRule, PacketScenario } from '../types';

export interface EvaluationStep {
  ruleIndex: number;
  rule: FirewallRule;
  srcMatch: boolean;
  dstMatch: boolean;
  protoMatch: boolean;
  portMatch: boolean;
  isFullMatch: boolean;
  reason: string;
}

export interface SimulationResult {
  matchedRuleIndex: number;
  matchedRule: FirewallRule;
  decision: 'ALLOW' | 'DENY';
  steps: EvaluationStep[];
  explanation: string;
}

// Convert IPv4 string to 32-bit number
function ipToInt(ip: string): number {
  const parts = ip.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return 0;
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

// Check if an IP matches a rule pattern (e.g., 'ANY', '10.0.0.0/24', '192.168.1.100', 'Server')
export function matchesIp(packetIp: string, rulePattern: string, serverIp: string = '192.168.1.100'): boolean {
  const cleanRule = rulePattern.trim();
  if (cleanRule === 'ANY' || cleanRule === '*' || cleanRule === '0.0.0.0/0') return true;
  if (cleanRule.toLowerCase() === 'server' || cleanRule.toLowerCase() === 'host') {
    return packetIp === serverIp;
  }

  // CIDR notation check
  if (cleanRule.includes('/')) {
    const [subnetIp, maskStr] = cleanRule.split('/');
    const maskBits = parseInt(maskStr, 10);
    if (isNaN(maskBits) || maskBits < 0 || maskBits > 32) return false;
    
    const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
    const subnetInt = ipToInt(subnetIp) & mask;
    const packetInt = ipToInt(packetIp) & mask;
    return subnetInt === packetInt;
  }

  // Exact IP match
  return packetIp.trim() === cleanRule;
}

// Check if port matches
export function matchesPort(packetPort: number, rulePort: string): boolean {
  const clean = rulePort.trim().toUpperCase();
  if (clean === 'ANY' || clean === '*') return true;
  const num = parseInt(clean, 10);
  return !isNaN(num) && num === packetPort;
}

// Check if protocol matches
export function matchesProtocol(packetProto: string, ruleProto: string): boolean {
  const clean = ruleProto.trim().toUpperCase();
  if (clean === 'ANY' || clean === '*') return true;
  return clean === packetProto.trim().toUpperCase();
}

// Deterministically evaluate a packet against an ordered list of firewall rules
export function evaluatePacketRules(
  packet: PacketScenario,
  rules: FirewallRule[]
): SimulationResult {
  const steps: EvaluationStep[] = [];
  let matchedIndex = -1;
  let matchedRule: FirewallRule | null = null;

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const srcMatch = matchesIp(packet.srcIp, rule.srcIp);
    const dstMatch = matchesIp(packet.dstIp, rule.dstIp);
    const protoMatch = matchesProtocol(packet.protocol, rule.protocol);
    const portMatch = matchesPort(packet.port, rule.port);

    const isFullMatch = srcMatch && dstMatch && protoMatch && portMatch;

    let reason = '';
    if (isFullMatch) {
      reason = `Matched! (Src: ${srcMatch ? '✓' : '✗'}, Dst: ${dstMatch ? '✓' : '✗'}, Proto: ${protoMatch ? '✓' : '✗'}, Port: ${portMatch ? '✓' : '✗'})`;
    } else {
      const mismatches: string[] = [];
      if (!srcMatch) mismatches.push(`Source ${packet.srcIp} != ${rule.srcIp}`);
      if (!dstMatch) mismatches.push(`Dest ${packet.dstIp} != ${rule.dstIp}`);
      if (!protoMatch) mismatches.push(`Protocol ${packet.protocol} != ${rule.protocol}`);
      if (!portMatch) mismatches.push(`Port ${packet.port} != ${rule.port}`);
      reason = `No Match: ${mismatches.join(', ')}`;
    }

    steps.push({
      ruleIndex: i,
      rule,
      srcMatch,
      dstMatch,
      protoMatch,
      portMatch,
      isFullMatch,
      reason
    });

    if (isFullMatch) {
      matchedIndex = i;
      matchedRule = rule;
      break;
    }
  }

  // Fallback if somehow no rule matched (even without implicit deny)
  if (!matchedRule) {
    matchedRule = {
      id: 'fallback-deny',
      name: 'Default Implicit Deny',
      action: 'DENY',
      srcIp: 'ANY',
      dstIp: 'ANY',
      protocol: 'ANY',
      port: 'ANY',
      description: 'System default drop for unmatched packets'
    };
    matchedIndex = rules.length;
  }

  const decision = matchedRule.action;
  let explanation = '';

  if (matchedRule.isImplicit) {
    explanation = `The packet from ${packet.srcIp} on port ${packet.port} did not match any explicit allow/deny rules, so it was dropped by the final Implicit Deny rule.`;
  } else if (decision === 'ALLOW') {
    explanation = `The packet matched "${matchedRule.name}" (Rule #${matchedIndex + 1}) first, so the firewall ALLOWED the connection.`;
  } else {
    explanation = `The packet matched "${matchedRule.name}" (Rule #${matchedIndex + 1}) first, so the firewall DENIED the connection.`;
  }

  return {
    matchedRuleIndex: matchedIndex,
    matchedRule,
    decision,
    steps,
    explanation
  };
}
