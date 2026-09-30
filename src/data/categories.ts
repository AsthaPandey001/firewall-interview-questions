import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'fundamentals',
    name: 'Firewall Fundamentals',
    count: 4,
    iconName: 'Shield',
    color: '#3b82f6',
  },
  {
    id: 'acl-rules',
    name: 'ACL & Firewall Rules',
    count: 6,
    iconName: 'ListFilter',
    color: '#8b5cf6',
  },
  {
    id: 'nat',
    name: 'NAT (Network Address Translation)',
    count: 3,
    iconName: 'ArrowLeftRight',
    color: '#06b6d4',
  },
  {
    id: 'ids-ips',
    name: 'IDS / IPS & Threat Detection',
    count: 3,
    iconName: 'Activity',
    color: '#f59e0b',
  },
  {
    id: 'segmentation',
    name: 'Network Segmentation & DMZ',
    count: 1,
    iconName: 'Layers',
    color: '#10b981',
  },
  {
    id: 'vpn-ipsec',
    name: 'VPN & IPsec Security',
    count: 2,
    iconName: 'Lock',
    color: '#ec4899',
  },
  {
    id: 'tls',
    name: 'TLS & Cryptographic Handshakes',
    count: 1,
    iconName: 'KeyRound',
    color: '#6366f1',
  },
];
