import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q18VpnArchitecturesVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  // Step 0: Remote Access VPN Scenario: Remote User -> Encrypted SSL/IPsec Client -> Corporate Gateway -> Internal Server
  // Step 1: Encrypted packets traveling inside Remote Access Software Tunnel
  // Step 2: Site-to-Site VPN Scenario: Branch Office Network -> Branch Gateway ======== IPsec Tunnel ======== HQ Gateway -> HQ Core
  // Step 3: Entire subnet-to-subnet traffic encrypted transparently (no software needed on individual hosts)
  // Step 4: Final Comparison: Remote User to Network vs Network to Network

  const isFinalComparison = currentStepIndex >= 4;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {!isFinalComparison ? (
        <>
          {/* ───────────────────────────────────────────────────────── */}
          {/* TOP TRACK: REMOTE ACCESS VPN (USER-TO-GATEWAY SOFTWARE TUNNEL) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 10)">
            <rect x="0" y="0" width="720" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth={1} />
            <rect x="0" y="0" width="720" height="24" rx="7" fill="#faf5ff" />
            <text x="14" y="16" fill="#6b21a8" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
              PART A: REMOTE ACCESS VPN (INDIVIDUAL CLIENT-TO-GATEWAY SOFTWARE TUNNEL)
            </text>

            <line x1="70" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={75} label="Remote Worker" ip="Virtual: 10.50.0.12" active />

            {/* Encrypted Tunnel Rectangle representation */}
            <g transform="translate(250, 75)">
              <rect x="-115" y="-14" width="230" height="28" rx="6" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 3" />
              <text x="0" y="4" textAnchor="middle" fill="#7e22ce" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                🔒 ENCRYPTED TLS / IPSEC TUNNEL
              </text>
            </g>

            <FirewallGatewayNode cx={470} cy={75} label="VPN Concentrator" sub="MFA / RADIUS" active success />
            <ServerNodeSVG cx={650} cy={75} label="Corp Intranet" sub="10.2.0.80" active success />

            {currentStepIndex >= 1 && (
              <>
                <BoldArrow x1={105} y1={75} x2={420} y2={75} color="#8b5cf6" label="🔒 ENCRYPTED" />
                <BoldArrow x1={510} y1={75} x2={615} y2={75} color="#10b981" label="DECRYPTED" />
              </>
            )}
          </g>

          {/* ───────────────────────────────────────────────────────── */}
          {/* BOTTOM TRACK: SITE-TO-SITE VPN (GATEWAY-TO-GATEWAY TUNNEL) */}
          {/* ───────────────────────────────────────────────────────── */}
          <g transform="translate(20, 170)">
            <rect x="0" y="0" width="720" height="160" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth={1} />
            <rect x="0" y="0" width="720" height="24" rx="7" fill="#eff6ff" />
            <text x="14" y="16" fill="#1e40af" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
              PART B: SITE-TO-SITE VPN (PERMANENT GATEWAY-TO-GATEWAY SUBNET INTERCONNECT)
            </text>

            <line x1="70" y1="75" x2="650" y2="75" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

            <LaptopNode cx={70} cy={75} label="Branch Host" ip="10.1.0.15" active />
            <FirewallGatewayNode cx={230} cy={75} label="Branch Gateway" sub="203.0.113.10" active success />

            {/* Permanent Site-to-Site Encrypted Tunnel */}
            <g transform="translate(360, 75)">
              <rect x="-80" y="-14" width="160" height="28" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 3" />
              <text x="0" y="4" textAnchor="middle" fill="#1d4ed8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                🔒 IPSEC ESP TUNNEL
              </text>
            </g>

            <FirewallGatewayNode cx={490} cy={75} label="HQ Gateway" sub="198.51.100.50" active success />
            <ServerNodeSVG cx={650} cy={75} label="HQ Database" sub="10.2.0.80" active success />

            {currentStepIndex >= 3 && (
              <>
                <BoldArrow x1={105} y1={75} x2={185} y2={75} color="#2563eb" label="LAN (Plain)" />
                <BoldArrow x1={275} y1={75} x2={445} y2={75} color="#8b5cf6" label="🔒 IPsec ESP" />
                <BoldArrow x1={535} y1={75} x2={615} y2={75} color="#10b981" label="LAN (Plain)" />
              </>
            )}
          </g>
        </>
      ) : (
        /* Final Comparison Matrix */
        <g transform="translate(30, 20)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="300" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="36" rx="11" fill="#0f172a" />
          <text x="24" y="23" fill="#ffffff" fontSize="12" fontWeight="bold">
            REMOTE-ACCESS VPN VS SITE-TO-SITE VPN: ARCHITECTURAL COMPARISON
          </text>

          {/* Left Box: Remote Access */}
          <g transform="translate(24, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#faf5ff" stroke="#c084fc" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#8b5cf6" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              REMOTE-ACCESS VPN (CLIENT-TO-GATEWAY)
            </text>

            <g transform="translate(20, 44)">
              <text x="0" y="15" fill="#581c87" fontSize="8.5" fontWeight="bold">• Scope: Individual device → Corporate LAN</text>
              <text x="0" y="35" fill="#581c87" fontSize="8.5">• Client Software: Installed on laptop/phone (AnyConnect)</text>
              <text x="0" y="55" fill="#581c87" fontSize="8.5">• IP Addressing: Dynamic virtual IP assigned to adapter</text>
              <text x="0" y="75" fill="#581c87" fontSize="8.5">• Authentication: MFA / Single Sign-On / RADIUS</text>
              <text x="0" y="95" fill="#581c87" fontSize="8.5">• Protocols: OpenVPN, WireGuard, SSL/TLS, IKEv2</text>
              <text x="0" y="120" fill="#6b21a8" fontSize="8.5" fontWeight="bold">✓ Ideal for: Remote workers, traveling employees</text>
            </g>
          </g>

          {/* Right Box: Site-to-Site */}
          <g transform="translate(366, 52)">
            <rect x="0" y="0" width="310" height="230" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
            <rect x="0" y="0" width="310" height="28" rx="7" fill="#2563eb" />
            <text x="155" y="18" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              SITE-TO-SITE VPN (GATEWAY-TO-GATEWAY)
            </text>

            <g transform="translate(20, 44)">
              <text x="0" y="15" fill="#1e3a8a" fontSize="8.5" fontWeight="bold">• Scope: Entire Subnet A ↔ Entire Subnet B</text>
              <text x="0" y="35" fill="#1e3a8a" fontSize="8.5">• Client Software: NONE needed on end-user hosts</text>
              <text x="0" y="55" fill="#1e3a8a" fontSize="8.5">• IP Addressing: Native local subnet IPs retained</text>
              <text x="0" y="75" fill="#1e3a8a" fontSize="8.5">• Authentication: Pre-Shared Key (PSK) or X.509 Certs</text>
              <text x="0" y="95" fill="#1e3a8a" fontSize="8.5">• Protocols: IPsec ESP (Tunnel Mode), GRE over IPsec</text>
              <text x="0" y="120" fill="#1d4ed8" fontSize="8.5" fontWeight="bold">✓ Ideal for: Connecting Branch Offices to HQ Datacenter</text>
            </g>
          </g>
        </g>
      )}
    </svg>
  );
};
