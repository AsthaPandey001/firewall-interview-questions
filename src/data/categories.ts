import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'fundamentals',
    name: 'Firewall & Routing Architecture',
    count: 7,
    iconName: 'Shield',
    color: '#3b82f6',
  },
  {
    id: 'acl-rules',
    name: 'ACL & Policy Engineering',
    count: 12,
    iconName: 'ListFilter',
    color: '#8b5cf6',
  },
  {
    id: 'nat',
    name: 'NAT & Gateway Translation',
    count: 4,
    iconName: 'ArrowLeftRight',
    color: '#06b6d4',
  },
  {
    id: 'network-services',
    name: 'ARP, DNS, DHCP & MAC Security',
    count: 6,
    iconName: 'Radio',
    color: '#10b981',
  },
  {
    id: 'threats-attacks',
    name: 'DDoS, SYN Floods & IDS/IPS',
    count: 6,
    iconName: 'Activity',
    color: '#f59e0b',
  },
  {
    id: 'vpn-ipsec',
    name: 'VPN, IPsec & TLS Encryption',
    count: 6,
    iconName: 'Lock',
    color: '#ec4899',
  },
  {
    id: 'zero-trust-access',
    name: 'Zero Trust, NAC, Proxies & WAF',
    count: 7,
    iconName: 'Layers',
    color: '#6366f1',
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting & Diagnostics',
    count: 2,
    iconName: 'Terminal',
    color: '#ef4444',
  },
];
