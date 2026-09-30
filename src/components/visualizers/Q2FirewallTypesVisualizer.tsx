import React from 'react';
import type { AnimationStep } from '../../types';
import { BoldArrow, PacketCard, LaptopNode, FirewallGatewayNode, ServerNodeSVG } from './VisualPrimitives';

interface Props {
  currentStepIndex: number;
  step: AnimationStep;
  totalSteps: number;
}

export const Q2FirewallTypesVisualizer: React.FC<Props> = ({ currentStepIndex }) => {
  const mode = currentStepIndex;

  return (
    <svg viewBox="0 0 760 340" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
      {/* Top Paradigm Indicator Strip */}
      <g transform="translate(35, 14)">
        <rect x="0" y="0" width="690" height="28" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        {['1. Packet Filtering', '2. Stateful Inspection', '3. Application Proxy', '4. Next-Gen (NGFW)', '5. Visual Matrix'].map((t, idx) => {
          const isActive = idx === mode;
          return (
            <g key={t} transform={`translate(${12 + idx * 136}, 3)`}>
              <rect
                x="0"
                y="0"
                width="128"
                height="22"
                rx="11"
                fill={isActive ? '#2563eb' : 'transparent'}
              />
              <text
                x="64"
                y="14"
                textAnchor="middle"
                fill={isActive ? '#ffffff' : '#64748b'}
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {t}
              </text>
            </g>
          );
        })}
      </g>

      {/* Main Visual Arena (Steps 0-3: Topology Demonstrating Behavior; Step 4: Comparison Matrix) */}
      {mode <= 3 && (
        <>
          {/* Baseline Connection */}
          <line x1="90" y1="95" x2="650" y2="95" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="4 4" />

          {/* MODE 0: PACKET FILTERING (Resting Topology on Step 1) */}
          {mode === 0 && (
            <>
              <LaptopNode cx={90} cy={95} label="CLIENT" ip="10.0.0.25" active />
              <FirewallGatewayNode cx={370} cy={95} label="PACKET FILTER" sub="Stateless L3/L4" active />
              <ServerNodeSVG cx={650} cy={95} label="SERVER" sub="203.0.113.50:443" active />
            </>
          )}

          {/* MODE 1: STATEFUL FIREWALL */}
          {mode === 1 && (
            <>
              <BoldArrow x1={135} y1={90} x2={325} y2={90} color="#2563eb" label="SYN" />
              <BoldArrow x1={415} y1={90} x2={605} y2={90} color="#2563eb" label="SYN" />
              <BoldArrow x1={605} y1={105} x2={415} y2={105} color="#10b981" reverse label="SYN-ACK" curveOffset={16} />
              <BoldArrow x1={325} y1={105} x2={135} y2={105} color="#10b981" reverse label="SYN-ACK ✓" curveOffset={16} />
              <LaptopNode cx={90} cy={95} label="CLIENT" ip="10.0.0.25" active success />
              <FirewallGatewayNode cx={370} cy={95} label="STATEFUL FW" sub="Session Table" active success />
              <ServerNodeSVG cx={650} cy={95} label="SERVER" sub="203.0.113.50:443" active success />
              <PacketCard cx={510} cy={42} title="HANDSHAKE" protocol="TCP" port="443" src="SERVER" dst="CLIENT" flags="SYN-ACK" status="ALLOW" scale={0.82} />
            </>
          )}

          {/* MODE 2: APPLICATION PROXY */}
          {mode === 2 && (
            <>
              <BoldArrow x1={135} y1={95} x2={325} y2={95} color="#8b5cf6" label="CONN 1 (TERMINATE)" />
              <BoldArrow x1={415} y1={95} x2={605} y2={95} color="#059669" label="CONN 2 (INDEPENDENT)" />
              <LaptopNode cx={90} cy={95} label="CLIENT" ip="10.0.0.25" active />
              <g transform="translate(370, 95)">
                <circle cx="0" cy="-8" r="40" fill="#8b5cf620" />
                <rect x="-30" y="-30" width="60" height="40" rx="6" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2.5" />
                <text x="0" y="-12" textAnchor="middle" fill="#c084fc" fontSize="7.5" fontWeight="bold">L7 PROXY</text>
                <line x1="-22" y1="-6" x2="22" y2="-6" stroke="#334155" strokeWidth="1" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">ISOLATOR</text>
                <text x="0" y="20" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#0f172a">PROXY GATEWAY</text>
                <text x="0" y="31" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#8b5cf6" fontFamily="monospace">Dual Socket Bridge</text>
              </g>
              <ServerNodeSVG cx={650} cy={95} label="SERVER" sub="203.0.113.50:80" active success />
            </>
          )}

          {/* MODE 3: NGFW */}
          {mode === 3 && (
            <>
              <BoldArrow x1={135} y1={95} x2={325} y2={95} color="#2563eb" label="TLS / APP TRAFFIC" />
              <BoldArrow x1={415} y1={95} x2={605} y2={95} color="#10b981" label="CLEAN DATA" />
              <LaptopNode cx={90} cy={95} label="CLIENT (jdoe)" ip="10.0.0.25" active />
              <FirewallGatewayNode cx={370} cy={95} label="NEXT-GEN FW" sub="DPI + App-ID + IPS" active success scannerActive />
              <ServerNodeSVG cx={650} cy={95} label="CLOUD APP" sub="Salesforce.com" active success />
              <PacketCard cx={230} cy={42} title="DPI PAYLOAD" protocol="HTTPS" port="443" src="jdoe@corp" dst="Salesforce" flags="CLEAN" status="ALLOW" scale={0.82} />
            </>
          )}

          {/* Lower Dynamic Inspection Panel */}
          <g transform="translate(35, 160)">
            <rect x="0" y="0" width="690" height="165" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="0" y="0" width="690" height="26" rx="9" fill="#f8fafc" />
            <text x="16" y="17" fill="#334155" fontSize="10.5" fontWeight="bold" fontFamily="sans-serif">
              {mode === 0 && 'PACKET FILTERING INSPECTION STACK (L3/L4 STATIC)'}
              {mode === 1 && 'STATEFUL CONNECTION TABLE (SESSION MEMORY)'}
              {mode === 2 && 'APPLICATION PROXY ARCHITECTURE (TWO INDEPENDENT TCP CONNECTIONS)'}
              {mode === 3 && 'NEXT-GENERATION FIREWALL (NGFW) DEEP PACKET INSPECTION STACK'}
            </text>
            <line x1="0" y1="26" x2="690" y2="26" stroke="#e2e8f0" strokeWidth="1" />

            {/* Mode 0 content */}
            {mode === 0 && (
              <g transform="translate(20, 44)">
                <text x="0" y="0" fill="#475569" fontSize="8.5" fontWeight="bold" fontFamily="monospace">EVALUATED FIELDS:</text>
                <rect x="125" y="-11" width="90" height="20" rx="4" fill="#eff6ff" stroke="#3b82f6" />
                <text x="170" y="3" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="bold" fontFamily="monospace">SRC: 10.0.0.25</text>

                <rect x="225" y="-11" width="105" height="20" rx="4" fill="#eff6ff" stroke="#3b82f6" />
                <text x="277" y="3" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="bold" fontFamily="monospace">DST: 203.0.113.50</text>

                <rect x="340" y="-11" width="85" height="20" rx="4" fill="#eff6ff" stroke="#3b82f6" />
                <text x="382" y="3" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="bold" fontFamily="monospace">PROTO: TCP</text>

                <rect x="435" y="-11" width="80" height="20" rx="4" fill="#eff6ff" stroke="#3b82f6" />
                <text x="475" y="3" textAnchor="middle" fill="#1e40af" fontSize="8" fontWeight="bold" fontFamily="monospace">PORT: :443</text>

                <rect x="525" y="-11" width="120" height="20" rx="4" fill="#fef2f2" stroke="#ef4444" />
                <text x="585" y="3" textAnchor="middle" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">NO SESSION STATE</text>

                <text x="0" y="42" fill="#64748b" fontSize="8.5">
                  Evaluates each packet in total isolation. Cannot track whether a packet is a response to an existing outbound connection.
                </text>
              </g>
            )}

            {/* Mode 1 content */}
            {mode === 1 && (
              <g transform="translate(20, 40)">
                <rect x="0" y="0" width="650" height="20" fill="#f1f5f9" rx="3" />
                <text x="12" y="13" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">SOURCE</text>
                <text x="160" y="13" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">DESTINATION</text>
                <text x="310" y="13" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">PROTOCOL</text>
                <text x="430" y="13" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">STATE</text>
                <text x="540" y="13" fill="#475569" fontSize="7.5" fontWeight="bold" fontFamily="monospace">ACTION</text>

                <rect x="0" y="24" width="650" height="26" rx="4" fill="#ecfdf5" stroke="#10b981" />
                <text x="12" y="41" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">10.0.0.25:49152</text>
                <text x="160" y="41" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">203.0.113.50:443</text>
                <text x="310" y="41" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">TCP</text>
                <text x="430" y="41" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">ESTABLISHED ✓</text>
                <text x="540" y="41" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="monospace">ALLOW RETURN</text>
              </g>
            )}

            {/* Mode 2 content */}
            {mode === 2 && (
              <g transform="translate(20, 42)">
                <rect x="0" y="0" width="310" height="56" rx="6" fill="#faf5ff" stroke="#c084fc" />
                <text x="12" y="20" fill="#6b21a8" fontSize="8.5" fontWeight="bold">CLIENT ↔ PROXY SOCKET</text>
                <text x="12" y="38" fill="#475569" fontSize="7.5" fontFamily="monospace">Terminates client handshake, buffers full payload.</text>

                <rect x="330" y="0" width="310" height="56" rx="6" fill="#ecfdf5" stroke="#34d399" />
                <text x="342" y="20" fill="#065f46" fontSize="8.5" fontWeight="bold">PROXY ↔ SERVER SOCKET</text>
                <text x="342" y="38" fill="#475569" fontSize="7.5" fontFamily="monospace">Re-originates sanitized request. No direct IP path.</text>
              </g>
            )}

            {/* Mode 3 content */}
            {mode === 3 && (
              <g transform="translate(20, 38)">
                <text x="0" y="0" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">NGFW DEEP INSPECTION LAYERS:</text>
                <g transform="translate(0, 10)">
                  {[
                    { label: 'Layer 3/4', val: 'IP:Port Match', color: '#3b82f6' },
                    { label: 'SSL/TLS', val: 'Decrypted Proxy', color: '#8b5cf6' },
                    { label: 'App-ID', val: 'Salesforce CRM', color: '#10b981' },
                    { label: 'User-ID', val: 'jdoe@corp.local', color: '#f59e0b' },
                    { label: 'Threat AV', val: '0 Threats Clean', color: '#065f46' },
                  ].map((item, i) => (
                    <g key={item.label} transform={`translate(${i * 130}, 0)`}>
                      <rect x="0" y="0" width="122" height="42" rx="6" fill="#ffffff" stroke={item.color} strokeWidth="1.5" />
                      <rect x="0" y="0" width="122" height="15" rx="5" fill={item.color} />
                      <text x="61" y="11" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">{item.label}</text>
                      <text x="61" y="31" textAnchor="middle" fill="#0f172a" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{item.val}</text>
                    </g>
                  ))}
                </g>
              </g>
            )}
          </g>
        </>
      )}

      {/* MODE 4: FULL VISUAL COMPARISON MATRIX */}
      {mode === 4 && (
        <g transform="translate(30, 48)" className="animate-pop-in">
          <rect x="0" y="0" width="700" height="275" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="0" y="0" width="700" height="30" rx="9" fill="#0f172a" />
          <text x="20" y="19" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            FIREWALL PARADIGM ARCHITECTURAL COMPARISON MATRIX
          </text>

          {/* Matrix Columns */}
          {[
            { title: 'Packet Filter', osi: 'L3 / L4', state: 'No Memory', depth: 'Headers Only', speed: 'Ultra Fast', risk: 'Spoofing & Blind' },
            { title: 'Stateful Firewall', osi: 'L3 / L4', state: 'Session Table', depth: 'Handshake State', speed: 'High', risk: 'L7 Blind (Port 443)' },
            { title: 'Application Proxy', osi: 'Layer 7', state: 'Dual Sockets', depth: 'Full Payload Buffer', speed: 'Moderate', risk: 'App Support Limit' },
            { title: 'Next-Gen (NGFW)', osi: 'L3 - L7', state: 'State + Context', depth: 'DPI, App-ID, Threat', speed: 'High (ASIC HW)', risk: 'Higher Cost' },
          ].map((col, idx) => (
            <g key={col.title} transform={`translate(${16 + idx * 168}, 38)`}>
              <rect x="0" y="0" width="158" height="225" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
              <rect x="0" y="0" width="158" height="24" rx="5" fill="#1e293b" />
              <text x="79" y="16" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold">{col.title}</text>
              
              <text x="12" y="44" fill="#64748b" fontSize="7.5" fontWeight="bold">OSI LAYER:</text>
              <text x="12" y="58" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">{col.osi}</text>

              <text x="12" y="80" fill="#64748b" fontSize="7.5" fontWeight="bold">STATE TRACKING:</text>
              <text x="12" y="94" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace">{col.state}</text>

              <text x="12" y="116" fill="#64748b" fontSize="7.5" fontWeight="bold">INSPECTION DEPTH:</text>
              <text x="12" y="130" fill="#0f172a" fontSize="7.5" fontWeight="bold">{col.depth}</text>

              <text x="12" y="152" fill="#64748b" fontSize="7.5" fontWeight="bold">THROUGHPUT:</text>
              <text x="12" y="166" fill="#059669" fontSize="8" fontWeight="bold">{col.speed}</text>

              <text x="12" y="195" fill="#991b1b" fontSize="7" fontWeight="bold">{col.risk}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};
