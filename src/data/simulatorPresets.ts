import type { FirewallRule, PacketScenario } from '../types';

export const DEFAULT_FIREWALL_RULES: FirewallRule[] = [
  {
    id: 'rule-1',
    name: 'Rule 1: Allow Internal HTTPS',
    action: 'ALLOW',
    srcIp: '10.0.0.0/24',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: '443',
    description: 'Allow subnet 10.0.0.0/24 to access Server HTTPS'
  },
  {
    id: 'rule-2',
    name: 'Rule 2: Deny All Public HTTPS',
    action: 'DENY',
    srcIp: 'ANY',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: '443',
    description: 'Block all other incoming HTTPS traffic to Server'
  },
  {
    id: 'rule-3',
    name: 'Rule 3: Allow Public HTTP Web',
    action: 'ALLOW',
    srcIp: 'ANY',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: '80',
    description: 'Allow public unencrypted HTTP web visitors'
  },
  {
    id: 'rule-implicit',
    name: 'Default: Implicit Deny All',
    action: 'DENY',
    srcIp: 'ANY',
    dstIp: 'ANY',
    protocol: 'ANY',
    port: 'ANY',
    description: 'Catch-all default rule dropping any unmatched packet',
    isImplicit: true
  }
];

export const PRESET_PACKETS: PacketScenario[] = [
  {
    id: 'pkt-1',
    name: 'Internal User (10.0.0.25 on Port 443)',
    srcIp: '10.0.0.25',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: 443,
    payload: 'GET /secure-portal HTTP/1.1',
    category: 'Internal Service'
  },
  {
    id: 'pkt-2',
    name: 'External Visitor (198.51.100.42 on Port 443)',
    srcIp: '198.51.100.42',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: 443,
    payload: 'GET /login HTTP/1.1',
    category: 'Blocked Subnet'
  },
  {
    id: 'pkt-3',
    name: 'Public Visitor (198.51.100.99 on Port 80)',
    srcIp: '198.51.100.99',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: 80,
    payload: 'GET /index.html HTTP/1.1',
    category: 'Legitimate Web'
  },
  {
    id: 'pkt-4',
    name: 'SSH Probe on Port 22 (10.0.0.50)',
    srcIp: '10.0.0.50',
    dstIp: '192.168.1.100',
    protocol: 'TCP',
    port: 22,
    payload: 'SSH-2.0-OpenSSH_8.9',
    category: 'Attack Traffic'
  }
];
