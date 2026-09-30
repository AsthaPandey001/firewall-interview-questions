import type { QuestionData } from '../types';

export const QUESTIONS_DATA: QuestionData[] = [
  // 1. What is a firewall, and how does it work?
  {
    id: 1,
    categoryId: 'fundamentals',
    category: 'Firewall Fundamentals',
    title: 'What is a firewall, and how does it work?',
    subtitle: 'Watch packet inspection in real-time as traffic passes through network security boundaries.',
    visualType: 'firewall-flow',
    elevatorPitch:
      'A firewall is a core network security barrier that monitors, filters, and inspects incoming and outgoing network traffic based on an organization’s predetermined security policy. It acts as a gatekeeper between a trusted internal network and untrusted external networks (like the Internet).',
    deepDive: [
      '**5-Tuple Inspection:** Traditional packet-filtering firewalls inspect the 5-tuple: Source IP, Destination IP, Source Port, Destination Port, and Layer 4 Protocol (TCP/UDP/ICMP).',
      '**Directional Policies:** Rules are enforced directionally: Inbound (entering the perimeter) vs. Outbound (originating from inside).',
      '**Action Matrix:** When a packet arrives, the firewall evaluates rules in sequence. Actions include ALLOW (forward packet), DROP (silently discard with no response), or REJECT (discard and send ICMP unreachable / TCP RST).',
      '**Boundary Enforcement:** Firewalls isolate network trust zones (e.g., Internet, DMZ, Corporate LAN, Secure Database VLANs).'
    ],
    realWorldScenario:
      'A database server on 10.0.3.50 received port-scan traffic. The firewall perimeter rule `DENY ANY -> 10.0.3.0/24 port 3306` dropped packets instantly, shielding the MySQL service from brute-force exploitation.',
    commonTrap:
      'Candidates often say firewalls just "block viruses." In an interview, clarify that traditional firewalls operate at Layers 3 & 4 (IP/Port), while Next-Gen Firewalls (NGFW) inspect Layer 7 payload/applications.',
    cliSnippets: [
      {
        label: 'Linux iptables (Drop incoming port 23 Telnet)',
        code: 'iptables -A INPUT -p tcp --dport 23 -j DROP'
      },
      {
        label: 'Cisco ASA ACL',
        code: 'access-list OUTSIDE_IN extended deny tcp any host 10.0.3.50 eq 3306\naccess-group OUTSIDE_IN in interface outside'
      }
    ],
    keyTakeaways: [
      'Acts as a perimeter boundary between trusted and untrusted network zones.',
      'Inspects traffic headers (Source/Dest IP, Ports, Protocol) against ordered rule sets.',
      'Executes ALLOW, DROP (silent), or REJECT (active reset) actions.'
    ],
    quiz: {
      question: 'What is the key difference between DROP and REJECT actions on a firewall?',
      options: [
        'DROP sends an ICMP port unreachable back to sender; REJECT silently ignores.',
        'DROP silently discards the packet without response; REJECT sends an ICMP error or TCP RST.',
        'DROP is for incoming traffic only; REJECT is for outgoing traffic only.',
        'There is no functional difference; they are synonymous.'
      ],
      correctIndex: 1,
      explanation: 'DROP silently discards the packet, which slows down port scanners because the scanner must wait for a timeout. REJECT immediately informs the sender with a TCP RST or ICMP Unreachable message.'
    },
    steps: [
      {
        id: 1,
        label: 'Network Topology Initialized',
        badge: 'Client / FW / Server',
        activeNodes: ['client', 'firewall', 'server'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '203.0.113.50', srcPort: 52410, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'The network perimeter is established with Client (10.0.0.25), Firewall Gateway, and Server (203.0.113.50).',
        interviewTakeaway: 'Firewalls sit as a security barrier between trusted internal clients and untrusted external servers.'
      },
      {
        id: 2,
        label: 'Client Creates Data Packet',
        badge: 'TCP :443 SYN',
        activeNodes: ['client'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '203.0.113.50', srcPort: 52410, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'Client initiates a TCP connection to Server on port 443 (HTTPS) with a SYN packet.',
        interviewTakeaway: 'The packet carries 5-tuple header metadata: Source IP, Dest IP, Source Port, Dest Port, and Protocol.'
      },
      {
        id: 3,
        label: 'Packet Travels to Firewall',
        badge: 'In Transit',
        activeNodes: ['client', 'firewall'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '203.0.113.50', srcPort: 52410, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'The packet is routed across the network towards the perimeter security firewall.',
        interviewTakeaway: 'Network traffic must cross the firewall before reaching the target server.'
      },
      {
        id: 4,
        label: 'Packet Reaches Firewall & Activates',
        badge: 'Ingress Point',
        activeNodes: ['firewall'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '203.0.113.50', srcPort: 52410, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'The packet reaches the firewall ingress interface and stops for policy evaluation.',
        interviewTakeaway: 'Firewalls buffer incoming packets to inspect headers against security rulebases.'
      },
      {
        id: 5,
        label: 'Firewall Inspects 5-Tuple Header',
        badge: 'Deep Extraction',
        activeNodes: ['firewall'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '203.0.113.50', srcPort: 52410, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        decision: 'INSPECT',
        whatIsHappening: 'Firewall extracts Source IP (10.0.0.25), Destination IP (203.0.113.50), Protocol (TCP), and Port (443).',
        interviewTakeaway: 'L3/L4 filtering evaluates 5 key parameters to determine packet legitimacy.'
      },
      {
        id: 6,
        label: 'Firewall Checks Security Rules',
        badge: 'Top-Down ACL',
        activeNodes: ['firewall'],
        activeRuleIndex: 0,
        decision: 'INSPECT',
        whatIsHappening: 'Firewall tests the extracted 5-tuple against its active Access Control List (ACL) from top to bottom.',
        interviewTakeaway: 'Rules are evaluated sequentially in top-down order.'
      },
      {
        id: 7,
        label: 'Matching Rule Found',
        badge: 'Rule #1 Matched',
        activeNodes: ['firewall'],
        activeRuleIndex: 0,
        decision: 'ALLOW',
        ruleMatched: 'Rule 1: ALLOW 10.0.0.0/24 -> 203.0.113.50:443',
        whatIsHappening: 'Rule 1 matches: Source 10.0.0.25 belongs to 10.0.0.0/24 subnet and destination port 443 is permitted.',
        interviewTakeaway: 'First matching rule determines the outcome and halts further rule evaluation.'
      },
      {
        id: 8,
        label: 'Decision: ALLOW',
        badge: 'Permitted ✓',
        activeNodes: ['firewall'],
        decision: 'ALLOW',
        whatIsHappening: 'Firewall issues an ALLOW action, logging session state and opening egress forwarding gate.',
        interviewTakeaway: 'Permitted traffic is queued for egress interface transmission.'
      },
      {
        id: 9,
        label: 'Packet Forwarded to Server',
        badge: 'Delivered',
        activeNodes: ['server'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '203.0.113.50', srcPort: 52410, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        decision: 'ALLOW',
        whatIsHappening: 'The packet leaves firewall and successfully reaches destination server.',
        interviewTakeaway: 'Server receives legitimate packet and initiates SYN-ACK handshake response.'
      },
      {
        id: 10,
        label: 'Complete Process Visualized',
        badge: 'End-to-End Complete',
        activeNodes: ['client', 'firewall', 'server'],
        decision: 'ALLOW',
        whatIsHappening: 'End-to-end visualization complete: PACKET → FIREWALL INSPECTION → RULE MATCH → ALLOWED → SERVER.',
        interviewTakeaway: 'A firewall sits between networks and deterministically evaluates traffic before allowing or blocking it.'
      }
    ]
  },

  // 2. What are the different types of firewalls?
  {
    id: 2,
    categoryId: 'fundamentals',
    category: 'Firewall Fundamentals',
    title: 'What are the different types of firewalls?',
    subtitle: 'Compare Packet Filters, Stateful Firewalls, Application Proxies, and Next-Gen Firewalls.',
    visualType: 'firewall-types',
    elevatorPitch:
      'Firewalls are categorized by the OSI layers at which they operate: 1) Packet-Filtering (Layers 3–4), 2) Stateful Inspection (Layers 3–4 with session tracking), 3) Application Proxy (Layer 7 full proxying), 4) Next-Generation Firewalls (NGFW, Layers 3–7 with deep packet inspection, App-ID, and threat prevention), and 5) Web Application Firewalls (WAF, Layer 7 specialized for HTTP/HTTPS).',
    deepDive: [
      '**Packet Filtering (Stateless):** Evaluates individual packets in isolation based on static header rules. Fastest throughput, but cannot track connection states or prevent spoofing.',
      '**Stateful Inspection:** Maintains a dynamic state table of active connections (TCP handshake state, UDP pseudo-sessions). Automatically allows return traffic for established outbound sessions.',
      '**Application-Level Gateway / Proxy:** Terminates the connection from client, inspects full application payload (HTTP, FTP, SMTP), and establishes a second independent connection to the target server.',
      '**Next-Generation Firewall (NGFW):** Combines stateful inspection with Application Identification (App-ID), Intrusion Prevention (IPS), TLS/SSL decryption, and sandboxing.',
      '**WAF (Web Application Firewall):** Protects web apps against OWASP Top 10 attacks (SQLi, XSS, CSRF) by inspecting HTTP request parameters and payloads.'
    ],
    realWorldScenario:
      'An attacker tunneled command-and-control traffic over TCP port 80. A traditional packet filter permitted it because port 80 was open, but an NGFW flagged the non-HTTP protocol inside port 80 and blocked it.',
    commonTrap:
      'Don’t confuse a WAF with a network firewall. A network firewall controls general network ingress/egress, whereas a WAF inspects HTTP headers, cookies, and SQL/XSS payloads.',
    cliSnippets: [
      {
        label: 'Palo Alto NGFW CLI (Inspect App-ID)',
        code: 'show running security-policy\nshow session all filter application web-browsing'
      },
      {
        label: 'ModSecurity WAF Rule (Block SQL Injection)',
        code: 'SecRule ARGS "@detectSQLi" "id:1001,phase:2,deny,status:403,msg:\'SQL Injection Attempt\'"'
      }
    ],
    keyTakeaways: [
      'Packet Filters inspect headers; Stateful firewalls track TCP/UDP session states.',
      'Proxy firewalls terminate and reconstruct connections at Layer 7.',
      'NGFWs integrate deep packet inspection, App-ID, and integrated IPS.',
      'WAF specializes in HTTP/HTTPS traffic to prevent application exploits.'
    ],
    quiz: {
      question: 'Which type of firewall terminates the client connection and opens an entirely new connection to the destination server?',
      options: [
        'Stateless Packet Filter',
        'Stateful Inspection Firewall',
        'Application Proxy Firewall',
        'Transparent Layer 2 Firewall'
      ],
      correctIndex: 2,
      explanation: 'An Application Proxy Firewall operates as an intermediary: it terminates the client TCP connection, performs full Layer 7 content inspection, and opens a separate connection to the destination server.'
    },
    steps: [
      {
        id: 1,
        label: 'Stateless Packet Filter (L3/L4)',
        badge: 'Layer 3 & 4',
        activeNodes: ['filter-stateless'],
        packetInfo: { srcIp: '10.0.0.5', dstIp: '198.51.100.1', dstPort: 80, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'Inspects IP and Port headers only. Fast but lacks session memory; cannot automatically permit return traffic without static rules.',
        interviewTakeaway: 'Stateless filters evaluate each packet in isolation, requiring explicit two-way rules for bidirectional traffic.'
      },
      {
        id: 2,
        label: 'Stateful Inspection (State Table)',
        badge: 'Session Aware',
        activeNodes: ['filter-stateful'],
        packetInfo: { srcIp: '10.0.0.5', dstIp: '198.51.100.1', dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        stateTable: [{ srcIp: '10.0.0.5', srcPort: 49152, dstIp: '198.51.100.1', dstPort: 443, protocol: 'TCP', state: 'SYN_SENT', timeout: '30s' }],
        whatIsHappening: 'Validates TCP handshake and logs active connection in state table. Inbound return packets matching the table are allowed dynamically.',
        interviewTakeaway: 'Stateful firewalls eliminate the need for opening ephemeral inbound ports manually.'
      },
      {
        id: 3,
        label: 'Application Proxy (L7 Terminator)',
        badge: 'Full Proxy',
        activeNodes: ['filter-proxy'],
        packetInfo: { srcIp: '10.0.0.5', dstIp: '198.51.100.1', dstPort: 80, protocol: 'HTTP', payloadSummary: 'GET /index.html HTTP/1.1' },
        whatIsHappening: 'Terminates the client connection, buffers and sanitizes the application payload, then establishes a second connection to the server.',
        interviewTakeaway: 'Provides maximum isolation and deep payload validation at the cost of processing latency.'
      },
      {
        id: 4,
        label: 'Next-Generation Firewall (NGFW)',
        badge: 'DPI & App-ID',
        activeNodes: ['filter-ngfw'],
        packetInfo: { srcIp: '10.0.0.5', dstIp: '198.51.100.1', dstPort: 443, protocol: 'TLS', payloadSummary: 'App-ID: Salesforce, Threat: Clean' },
        whatIsHappening: 'Performs Deep Packet Inspection (DPI), decrypts TLS, identifies underlying application (App-ID), and scans for malware/CVEs simultaneously.',
        interviewTakeaway: 'NGFWs look past port numbers to identify the actual application and enforce identity-based security policies.'
      }
    ]
  },

  // 3. What is the difference between a stateful and a stateless firewall?
  {
    id: 3,
    categoryId: 'fundamentals',
    category: 'Firewall Fundamentals',
    title: 'What is the difference between a stateful and a stateless firewall?',
    subtitle: 'Understand connection state tables, TCP tracking, and bidirectional rule handling.',
    visualType: 'stateful-stateless',
    elevatorPitch:
      'A stateless firewall inspects each packet independently against static rules without context of prior traffic. A stateful firewall maintains a dynamic state table tracking active connections (e.g., TCP SYN, SYN-ACK, ESTABLISHED). When an internal host initiates an outbound session, the stateful firewall automatically allows the return response traffic.',
    deepDive: [
      '**Stateless Firewall:** Inspects L3/L4 headers per packet. Requires two separate rules for every connection (one for outbound request, one for inbound response on high ephemeral ports 1024–65535). Vulnerable to ACK scan and SYN flood spoofing.',
      '**Stateful Firewall:** Tracks TCP sequence numbers, flags (SYN, ACK, FIN, RST), and timers in a connection table. Return traffic is permitted under the `ESTABLISHED, RELATED` rule.',
      '**State Table Exhaustion (DDoS Risk):** Because stateful firewalls allocate RAM for each active session, high-volume SYN floods can exhaust the state table, causing a Denial of Service.',
      '**Performance Trade-off:** Stateless inspection has lower CPU/memory overhead and higher packet-per-second (pps) forwarding rates, making it ideal for edge ACLs and DDoS mitigation.'
    ],
    realWorldScenario:
      'If you configure an outbound-only rule on a stateless firewall allowing port 80, web browsing fails because the server’s return packets are blocked. On a stateful firewall, outbound HTTP traffic creates a state entry that automatically lets server responses pass through.',
    commonTrap:
      'Never forget UDP and ICMP! While UDP is connectionless, stateful firewalls create "pseudo-state" entries using IP/Port pairs with short inactivity timers (e.g., DNS query on UDP 53 has a 30-second state window for reply).',
    cliSnippets: [
      {
        label: 'Linux conntrack (View active state table)',
        code: 'conntrack -L\n# Output: tcp 6 431999 ESTABLISHED src=192.168.1.100 dst=93.184.216.34 sport=51200 dport=443 [ASSURED]'
      },
      {
        label: 'iptables Stateful Rule (Allow Established)',
        code: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT'
      }
    ],
    keyTakeaways: [
      'Stateless treats every packet in isolation; Stateful maintains a session state table.',
      'Stateful automatically permits return traffic for outbound-initiated sessions.',
      'Stateless requires wide-open ephemeral inbound rules; Stateful is significantly more secure.'
    ],
    quiz: {
      question: 'How does a stateful firewall handle return traffic from a web server when an internal user visits a website?',
      options: [
        'It requires an administrator to manually open inbound port 80/443 permanently.',
        'It inspects the state table, matches the return packet to the established session, and allows it dynamically.',
        'It broadcasts an ARP request to verify the server identity before forwarding.',
        'It automatically converts the packet to stateless mode.'
      ],
      correctIndex: 1,
      explanation: 'A stateful firewall checks its internal state table. Since the outbound request created a session entry, the inbound return packet (SYN-ACK / ACK) is recognized as part of that established conversation and permitted.'
    },
    steps: [
      {
        id: 1,
        label: '1. Stateful: Outbound TCP SYN Request',
        badge: 'Stateful Step 1',
        activeNodes: ['client', 'firewall'],
        packetInfo: { srcIp: '192.168.1.50', dstIp: '142.250.190.46', srcPort: 49820, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'The client initiates a secure connection by sending a TCP SYN packet destined for HTTPS port 443 on the remote server.',
        interviewTakeaway: 'The outbound packet arrives at the stateful firewall carrying a complete 5-tuple header.'
      },
      {
        id: 2,
        label: '2. Stateful: State Table Entry Created',
        badge: 'Stateful Step 2',
        activeNodes: ['firewall'],
        stateTable: [
          { srcIp: '192.168.1.50', srcPort: 49820, dstIp: '142.250.190.46', dstPort: 443, protocol: 'TCP', state: 'SYN_SENT', timeout: '30s' }
        ],
        whatIsHappening: 'The stateful firewall evaluates its outbound policy, permits the packet, and dynamically records a new session entry (SYN_SENT) in RAM.',
        interviewTakeaway: 'Stateful firewalls automatically track connection state, eliminating the need to manually open return ports.'
      },
      {
        id: 3,
        label: '3. Stateful: Server Replies with SYN-ACK',
        badge: 'Stateful Step 3',
        activeNodes: ['server', 'firewall'],
        packetInfo: { srcIp: '142.250.190.46', dstIp: '192.168.1.50', srcPort: 443, dstPort: 49820, protocol: 'TCP', flags: 'SYN-ACK' },
        decision: 'ALLOW',
        stateTable: [
          { srcIp: '192.168.1.50', srcPort: 49820, dstIp: '142.250.190.46', dstPort: 443, protocol: 'TCP', state: 'SYN_RECV', timeout: '30s' }
        ],
        whatIsHappening: 'The remote web server returns a TCP SYN-ACK packet destined for the client ephemeral port 49820.',
        interviewTakeaway: 'Inbound return traffic arrives at the firewall perimeter without any static inbound rule.'
      },
      {
        id: 4,
        label: '4. Stateful: Dynamic Return Traffic Allowed',
        badge: 'Stateful Step 4',
        activeNodes: ['client', 'firewall', 'server'],
        packetInfo: { srcIp: '192.168.1.50', dstIp: '142.250.190.46', srcPort: 49820, dstPort: 443, protocol: 'TCP', flags: 'ACK' },
        decision: 'ALLOW',
        stateTable: [
          { srcIp: '192.168.1.50', srcPort: 49820, dstIp: '142.250.190.46', dstPort: 443, protocol: 'TCP', state: 'ESTABLISHED', timeout: '3600s' }
        ],
        whatIsHappening: 'The firewall checks its state table, matches the return packet to the active session, and dynamically allows it through. Handshake completes as ESTABLISHED.',
        interviewTakeaway: 'Stateful inspection provides robust security because return packets must match an existing outbound session.'
      },
      {
        id: 5,
        label: '5. Stateless: Evaluating Without State Memory',
        badge: 'Stateless Step 1',
        activeNodes: ['client', 'firewall'],
        packetInfo: { srcIp: '192.168.1.50', dstIp: '142.250.190.46', srcPort: 49820, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'Now examine a stateless packet filter. The client sends the exact same TCP SYN packet outbound toward the server.',
        interviewTakeaway: 'Stateless firewalls treat every single packet as an isolated event with zero context of previous traffic.'
      },
      {
        id: 6,
        label: '6. Stateless: Outbound Permitted via Static ACL',
        badge: 'Stateless Step 2',
        activeNodes: ['firewall', 'server'],
        packetInfo: { srcIp: '192.168.1.50', dstIp: '142.250.190.46', srcPort: 49820, dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        decision: 'ALLOW',
        ruleMatched: 'Rule 1: ALLOW Outbound ANY -> Server:443',
        whatIsHappening: 'The stateless firewall checks its static rule table. The outbound packet matches Rule 1 and is forwarded to the server. No state entry is created.',
        interviewTakeaway: 'Because there is no state memory, the firewall has no record that this connection was initiated.'
      },
      {
        id: 7,
        label: '7. Stateless: Server Returns SYN-ACK to Port 49820',
        badge: 'Stateless Step 3',
        activeNodes: ['server', 'firewall'],
        packetInfo: { srcIp: '142.250.190.46', dstIp: '192.168.1.50', srcPort: 443, dstPort: 49820, protocol: 'TCP', flags: 'SYN-ACK' },
        decision: 'DROP',
        whatIsHappening: 'The server replies with SYN-ACK destined for client ephemeral port 49820. The stateless firewall evaluates its static inbound rules from top to bottom.',
        interviewTakeaway: 'Without a state table, the stateless firewall must rely strictly on configured static inbound rules.'
      },
      {
        id: 8,
        label: '8. Stateless: Return Traffic DROPPED (Connection Fails)',
        badge: 'Stateless Step 4',
        activeNodes: ['firewall'],
        packetInfo: { srcIp: '142.250.190.46', dstIp: '192.168.1.50', srcPort: 443, dstPort: 49820, protocol: 'TCP', flags: 'SYN-ACK' },
        decision: 'DROP',
        ruleMatched: 'Default Rule: IMPLICIT DENY (No rule for inbound port 49820)',
        whatIsHappening: 'Because no static rule exists allowing inbound traffic on random port 49820, the stateless firewall DROPS the return packet. Web browsing completely breaks unless wide-open ephemeral ports are permitted!',
        interviewTakeaway: 'Stateless firewalls require opening ports 1024-65535 inbound, exposing internal networks to port scanning and spoofing.'
      }
    ]
  },

  // 4. What is a Next-Generation Firewall (NGFW), and how is it different from a traditional firewall?
  {
    id: 4,
    categoryId: 'fundamentals',
    category: 'Firewall Fundamentals',
    title: 'What is a Next-Generation Firewall (NGFW), and how is it different from a traditional firewall?',
    subtitle: 'Explore Deep Packet Inspection, App-ID, User-ID, TLS Decryption, and Threat Prevention.',
    visualType: 'ngfw-dpi',
    elevatorPitch:
      'A Next-Generation Firewall (NGFW) goes beyond traditional Layer 3/4 port and IP filtering by incorporating Layer 7 Deep Packet Inspection (DPI), Application Identification (App-ID), User Identity awareness (User-ID), integrated Intrusion Prevention (IPS), and SSL/TLS decryption.',
    deepDive: [
      '**App-ID vs Port Blindness:** Traditional firewalls see port 443 and assume HTTPS. An NGFW inspects the payload to distinguish between Salesforce, BitTorrent, SSH-over-HTTPS, or YouTube.',
      '**SSL/TLS Forward Proxy Decryption:** Over 90% of web traffic is encrypted. NGFWs perform man-in-the-middle SSL inspection to scan encrypted payloads for malware and data exfiltration.',
      '**User-ID Integration:** Integrates with Active Directory / LDAP / SAML to bind IP addresses to usernames, enabling policies like "Allow Engineering group SSH access" instead of static IP subnets.',
      '**Threat Prevention & Sandboxing:** Integrates signature-based IPS, Anti-Spyware, URL filtering, and cloud sandboxing (e.g., Palo Alto WildFire, Cisco Talos, Fortinet FortiSandbox) for zero-day malware detection.'
    ],
    realWorldScenario:
      'An employee uses a custom obfuscated SSH client over TCP port 443 to bypass firewall port restrictions. A traditional firewall allows it (port 443 is open). An NGFW detects the SSH protocol signature inside the SSL wrapper and blocks the evasion attempt.',
    commonTrap:
      'Make sure to mention SSL/TLS decryption performance overhead. Decrypting TLS at scale requires dedicated ASIC hardware or coprocessors; without decryption, NGFWs are blind to encrypted threats.',
    cliSnippets: [
      {
        label: 'Palo Alto Security Rule with App-ID',
        code: 'set security rules "Allow-Slack" from Trust to Untrust application slack service application-default action allow'
      },
      {
        label: 'FortiGate Application Sensor',
        code: 'config application list\n  edit "Block-P2P"\n    config entries\n      edit 1\n        set category 6 # Peer-to-Peer\n        set action block'
      }
    ],
    keyTakeaways: [
      'Traditional firewalls inspect L3/L4 (IP/Port); NGFWs inspect L7 (Application/Payload).',
      'App-ID identifies real software regardless of port hopping or tunneling.',
      'Integrates User-ID (Active Directory), TLS decryption, IPS, and Cloud Sandboxing.'
    ],
    quiz: {
      question: 'Why can a traditional port-based firewall fail to block BitTorrent traffic running on TCP port 443?',
      options: [
        'Because BitTorrent uses UDP exclusively.',
        'Because traditional firewalls only check the port number (443) and assume it is legitimate HTTPS.',
        'Because traditional firewalls do not support IPv4.',
        'Because BitTorrent packets cannot be routed over the Internet.'
      ],
      correctIndex: 1,
      explanation: 'Traditional firewalls only inspect Layer 4 port numbers. If port 443 is allowed for web browsing, any application tunneled over port 443 will pass. An NGFW inspects the Layer 7 signature (App-ID) and detects BitTorrent regardless of the port.'
    },
    steps: [
      {
        id: 1,
        label: '1. Traditional FW: Packet Arrives on Port 443',
        badge: 'Traditional Step 1',
        activeNodes: ['client', 'firewall'],
        packetInfo: { srcIp: '10.1.5.22', dstIp: '185.199.108.153', dstPort: 443, protocol: 'TCP', payloadSummary: 'BitTorrent Tunneled in Port 443' },
        whatIsHappening: 'An employee runs an obfuscated BitTorrent client configured to use HTTPS port 443. A traditional firewall evaluates Layer 3/4 headers.',
        interviewTakeaway: 'Traditional firewalls are port-blind and cannot inspect the actual payload content.'
      },
      {
        id: 2,
        label: '2. Traditional FW: Port 443 Allowed (Malware Passes)',
        badge: 'Traditional Step 2',
        activeNodes: ['firewall', 'server'],
        packetInfo: { srcIp: '10.1.5.22', dstIp: '185.199.108.153', dstPort: 443, protocol: 'TCP' },
        decision: 'ALLOW',
        ruleMatched: 'Rule: ALLOW ANY -> ANY TCP 443 (Web Access)',
        whatIsHappening: 'Because port 443 is permitted in the ACL, the traditional firewall permits the BitTorrent stream to pass straight through!',
        interviewTakeaway: 'Port-based filtering creates security blind spots when applications hop ports or tunnel over 80/443.'
      },
      {
        id: 3,
        label: '3. NGFW: Ingress & SSL/TLS Decryption',
        badge: 'NGFW Step 1',
        activeNodes: ['client', 'firewall'],
        packetInfo: { srcIp: '10.1.5.22', dstIp: '185.199.108.153', dstPort: 443, protocol: 'TLS', isEncrypted: true },
        whatIsHappening: 'Now examine a Next-Generation Firewall. The NGFW acts as an SSL forward proxy, decrypting the TLS stream to expose raw payload bytes.',
        interviewTakeaway: 'Over 90% of modern enterprise malware hides in encrypted TLS sessions; decryption is vital.'
      },
      {
        id: 4,
        label: '4. NGFW: Layer 7 App-ID Identifies BitTorrent',
        badge: 'NGFW Step 2',
        activeNodes: ['firewall'],
        packetInfo: { srcIp: '10.1.5.22', dstIp: '185.199.108.153', dstPort: 443, protocol: 'TCP', payloadSummary: 'App-ID Signature: BitTorrent Protocol' },
        decision: 'INSPECT',
        whatIsHappening: 'The NGFW App-ID engine analyzes protocol signatures and identifies the underlying application as BitTorrent, regardless of port 443!',
        interviewTakeaway: 'App-ID classifies the actual application regardless of port number, evasion, or SSL encryption.'
      },
      {
        id: 5,
        label: '5. NGFW: Threat Prevention & Antivirus Scan',
        badge: 'NGFW Step 3',
        activeNodes: ['firewall'],
        packetInfo: { srcIp: '10.1.5.22', dstIp: '185.199.108.153', dstPort: 443, protocol: 'TCP' },
        decision: 'INSPECT',
        ruleMatched: 'IPS Engine: Malicious Torrent File Hash Detected',
        whatIsHappening: 'The integrated IPS / Antivirus stream engine scans the reassembled payload and flags a malicious executable signature.',
        interviewTakeaway: 'NGFWs provide single-pass architecture scanning for malware and CVEs in real-time.'
      },
      {
        id: 6,
        label: '6. NGFW: Threat BLOCKED & User-ID Logged',
        badge: 'NGFW Step 4',
        activeNodes: ['firewall'],
        decision: 'DENY',
        ruleMatched: 'Rule: Block-Unauthorized-P2P (App-ID: bittorrent)',
        whatIsHappening: 'The NGFW drops the packet immediately and logs an application security alert tied to the user identity `jdoe@corp.local`.',
        interviewTakeaway: 'Policy enforcement combines App-ID, User-ID, and Threat Prevention for complete Zero-Trust visibility.'
      }
    ]
  },

  // 5. What is an Access Control List (ACL), and how is it used in a firewall?
  {
    id: 5,
    categoryId: 'acl-rules',
    category: 'ACL & Firewall Rules',
    title: 'What is an Access Control List (ACL), and how is it used in a firewall?',
    subtitle: 'Understand sequential rule matrices, Standard vs Extended ACLs, and interface binding.',
    visualType: 'acl-matrix',
    elevatorPitch:
      'An Access Control List (ACL) is an ordered collection of permit or deny statements applied to a router or firewall interface. It matches packet headers against criteria (Source IP, Destination IP, Protocol, Port numbers) to filter network traffic and control access to network segments.',
    deepDive: [
      '**Standard ACLs (Layer 3 only):** Filter traffic based solely on Source IP address. Placed as close to the destination as possible.',
      '**Extended ACLs (Layers 3 & 4):** Filter traffic based on Source IP, Destination IP, Protocol (TCP/UDP/ICMP), and Port numbers. Placed as close to the source as possible to conserve bandwidth.',
      '**Directional Application:** An ACL must be applied to an interface in a specific direction: `in` (ingress traffic before routing/filtering) or `out` (egress traffic after routing).',
      '**Sequence Numbers & Top-to-Bottom Processing:** ACLs execute strictly in order of sequence numbers (e.g., 10, 20, 30). Processing stops upon the first match.'
    ],
    realWorldScenario:
      'An engineer created an ACL rule allowing SSH from a management jump-box, but placed it at the bottom of the ACL below `deny ip any any`. The jump-box could not connect until the rule was re-sequenced above the deny rule.',
    commonTrap:
      'Remember that standard ACLs should be placed close to the destination (so you do not inadvertently block valid traffic to other destinations), while extended ACLs should be placed close to the source (to drop unwanted traffic early).',
    cliSnippets: [
      {
        label: 'Cisco IOS Extended ACL Example',
        code: 'ip access-list extended SECURE_INBOUND\n 10 permit tcp 10.0.1.0 0.0.0.255 host 192.168.10.5 eq 443\n 20 deny ip any any log\ninterface GigabitEthernet0/1\n ip access-group SECURE_INBOUND in'
      }
    ],
    keyTakeaways: [
      'Standard ACLs filter on Source IP only; Extended ACLs filter on Source, Dest, Protocol, and Ports.',
      'Rules are evaluated sequentially top-to-bottom.',
      'Applied per-interface, per-protocol, per-direction (Inbound / Outbound).'
    ],
    quiz: {
      question: 'Where is the optimal placement for a Cisco Extended ACL in a network topology?',
      options: [
        'As close to the destination host as possible.',
        'As close to the source of the traffic as possible.',
        'Directly on the core backbone router only.',
        'Extended ACLs do not depend on placement.'
      ],
      correctIndex: 1,
      explanation: 'Extended ACLs filter by Source, Destination, and Port. Placing them as close to the source as possible filters out unauthorized packets early, preventing unnecessary traffic from consuming backbone bandwidth.'
    },
    steps: [
      {
        id: 1,
        label: 'Packet Ingress on Interface Gi0/1',
        badge: 'Interface Ingress',
        activeNodes: ['client', 'router-iface'],
        packetInfo: { srcIp: '10.0.1.25', dstIp: '192.168.10.5', dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'Packet arrives at GigabitEthernet0/1 where the `SECURE_INBOUND` ACL is bound in the `in` direction.',
        interviewTakeaway: 'ACLs must be explicitly bound to an interface and direction to take effect.'
      },
      {
        id: 2,
        label: 'Evaluate Rule 10: Source & Dest Match',
        badge: 'Rule 10 (Seq 10)',
        activeNodes: ['acl-evaluator'],
        activeRuleIndex: 0,
        decision: 'ALLOW',
        ruleMatched: '10 permit tcp 10.0.1.0/24 host 192.168.10.5 eq 443',
        whatIsHappening: 'Src 10.0.1.25 matches subnet 10.0.1.0/24, Dest 192.168.10.5 matches host, Port 443 matches. Action: PERMIT.',
        interviewTakeaway: 'Matching is immediate and deterministic. Rule 20 is never evaluated.'
      },
      {
        id: 3,
        label: 'Packet Forwarded to Destination',
        badge: 'Forwarding',
        activeNodes: ['server'],
        packetInfo: { srcIp: '10.0.1.25', dstIp: '192.168.10.5', dstPort: 443, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'Router routes packet out interface Gi0/2 toward destination server 192.168.10.5.',
        interviewTakeaway: 'Successful ACL evaluation allows the routing engine to switch the frame to the egress queue.'
      }
    ]
  },

  // 6. How does a firewall decide whether to allow or deny a packet?
  {
    id: 6,
    categoryId: 'acl-rules',
    category: 'ACL & Firewall Rules',
    title: 'How does a firewall decide whether to allow or deny a packet?',
    subtitle: 'Step through the complete deterministic decision flowchart of a firewall engine.',
    visualType: 'decision-flowchart',
    elevatorPitch:
      'A firewall evaluates a packet through a strict sequence: 1) Existing connection check in state table (if stateful), 2) Security policy inspection (evaluating rules top-to-bottom until first match), 3) Application/Threat inspection (if NGFW), and 4) Default Implicit Deny if no rule matches.',
    deepDive: [
      '**Phase 1 - Sanity & Anti-Spoofing Checks:** Validates IP checksums, drops invalid TCP flag combinations (e.g., Xmas scans with FIN+PSH+URG), and checks Reverse Path Forwarding (uRPF).',
      '**Phase 2 - State Table Lookup:** If the packet belongs to an existing established session, it bypasses rule re-evaluation and is immediately permitted (Fast Path).',
      '**Phase 3 - Rule Evaluation (Slow Path):** For new sessions (e.g. TCP SYN), the rule engine compares packet 5-tuple against ordered security policies.',
      '**Phase 4 - First Match Execution:** The first rule whose criteria (Zone, IP, Port, App) match the packet dictates the action (ALLOW, DROP, REJECT).',
      '**Phase 5 - Implicit Deny Fallback:** If no rule matches after checking the entire list, the packet hits the implicit deny rule and is dropped.'
    ],
    realWorldScenario:
      'During a network benchmark, packet throughput spiked 10x once TCP connections were established because the firewall used hardware-accelerated Fast Path state table matching instead of iterating 500 ACL rules per packet.',
    commonTrap:
      'Candidates often think every single packet in a TCP session goes through the entire rule list. Emphasize that only the initial SYN packet traverses the rule base; subsequent packets hit the state table directly.',
    cliSnippets: [
      {
        label: 'Cisco ASA Packet-Tracer Simulation Tool',
        code: 'packet-tracer input inside tcp 10.0.1.15 50000 203.0.113.10 443 detailed\n# Displays phase-by-phase decision path (Route, NAT, ACL, State)'
      }
    ],
    keyTakeaways: [
      'Established sessions hit the Fast Path state table lookup.',
      'New sessions evaluate the security policy top-to-bottom.',
      'The FIRST matching rule terminates evaluation.',
      'Unmatched packets are silently dropped by the implicit deny rule.'
    ],
    quiz: {
      question: 'What happens to packets of an already established TCP connection on a stateful firewall?',
      options: [
        'They are re-evaluated against the entire security rule list from top to bottom.',
        'They are matched directly in the state table (Fast Path) and forwarded without re-evaluating the full rule set.',
        'They are sent to the Implicit Deny engine.',
        'They are converted into UDP packets for faster processing.'
      ],
      correctIndex: 1,
      explanation: 'Once a connection is established, subsequent packets match the state table entry directly. This Fast Path optimization prevents the firewall from expending CPU cycles re-evaluating the complete rule base for every packet.'
    },
    steps: [
      {
        id: 1,
        label: '1. Ingress & Sanity Checks',
        badge: 'Sanity',
        activeNodes: ['step-ingress'],
        packetInfo: { srcIp: '192.168.1.10', dstIp: '10.0.0.8', dstPort: 80, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'Packet enters ingress buffer. Firewall checks IP checksums, validates header lengths, and checks anti-spoofing filters.',
        interviewTakeaway: 'Malformed packets or spoofed source addresses are dropped before hitting the rule engine.'
      },
      {
        id: 2,
        label: '2. State Table Lookup',
        badge: 'State Table',
        activeNodes: ['step-statetable'],
        decision: 'INSPECT',
        whatIsHappening: 'Firewall queries active session table. Since this is a new SYN packet, no state exists. Flow proceeds to policy engine (Slow Path).',
        interviewTakeaway: 'State lookup distinguishes new connection attempts from existing established streams.'
      },
      {
        id: 3,
        label: '3. Sequential Rule Evaluation',
        badge: 'Top-to-Bottom',
        activeNodes: ['step-rules'],
        activeRuleIndex: 1,
        decision: 'INSPECT',
        whatIsHappening: 'Firewall scans rules 1, 2, 3 in sequence until a match is found. Rule 2 matches Source IP & Port.',
        interviewTakeaway: 'Rules are evaluated strictly in sequence until the first match.'
      },
      {
        id: 4,
        label: '4. Action Execution & State Creation',
        badge: 'Verdict',
        activeNodes: ['step-verdict'],
        decision: 'ALLOW',
        ruleMatched: 'Rule 2: ALLOW 192.168.1.0/24 -> 10.0.0.8:80',
        whatIsHappening: 'ALLOW action executes. Connection is added to state table. Packet is transmitted on egress interface.',
        interviewTakeaway: 'A successful new connection rule match instantiates a state table record for return traffic.'
      }
    ]
  },

  // 7. Why does firewall rule order matter?
  {
    id: 7,
    categoryId: 'acl-rules',
    category: 'ACL & Firewall Rules',
    title: 'Why does firewall rule order matter?',
    subtitle: 'Experience why first-match semantics mean broader rules can shadow specific exceptions.',
    visualType: 'rule-order-demo',
    elevatorPitch:
      'Firewall rule order matters critically because firewalls evaluate rules sequentially from top to bottom and execute the FIRST matching rule. If a broad rule (like `DENY ANY`) is placed above a specific rule (like `ALLOW Admin IP`), the specific rule is shadowed (rendered unreachable) and will never be evaluated.',
    deepDive: [
      '**First-Match Semantics:** The first rule that matches all packet parameters wins. All subsequent rules below it are completely ignored for that packet.',
      '**Rule Shadowing (Dead Rules):** When a preceding general rule matches a superset of traffic covered by a subsequent specific rule, the lower rule is "shadowed" and will never trigger.',
      '**Best Practice Architecture:** Place specific, narrow rules (e.g., individual host IPs, specific ports) at the top of the rule base, and broader network rules or default denies at the bottom.',
      '**Performance Optimization:** Highly utilized rules (like DNS or corporate web proxies) are placed near the top to reduce rule evaluation traversal latency.'
    ],
    realWorldScenario:
      'An administrator intended to block all inbound traffic except for the CEO\'s home IP on port 443. They placed `DENY ANY ANY` at Rule 1 and `ALLOW CEO_IP ANY 443` at Rule 2. The CEO was immediately locked out because Rule 1 caught all packets first.',
    commonTrap:
      'In an interview, clearly use the technical term "Rule Shadowing." Explain that static analysis tools in modern firewalls warn when a newly created rule is shadowed by an existing upper rule.',
    cliSnippets: [
      {
        label: 'Shadowed Rule Example (BROKEN)',
        code: '# Rule 1 catches everything first!\nRule 1: DENY Source: ANY Dest: Server Port: 443\nRule 2: ALLOW Source: 10.0.0.25 Dest: Server Port: 443 (SHADOWED / UNREACHABLE)'
      },
      {
        label: 'Correct Ordered Rule Example (WORKING)',
        code: '# Specific rule evaluated first\nRule 1: ALLOW Source: 10.0.0.25 Dest: Server Port: 443 (MATCHES & ALLOWS)\nRule 2: DENY Source: ANY Dest: Server Port: 443 (CATCHES THE REST)'
      }
    ],
    keyTakeaways: [
      'Evaluation is strictly sequential: Top-to-Bottom.',
      'First matching rule terminates evaluation immediately.',
      'Broad rules placed above specific rules cause Rule Shadowing.',
      'Always place specific host/port exceptions above general subnet rules.'
    ],
    quiz: {
      question: 'What is the consequence of placing "DENY ANY ANY" as Rule #1 on a firewall?',
      options: [
        'All legitimate rules placed below it are shadowed and all network traffic is dropped.',
        'The firewall operates normally because it evaluates all rules before making a decision.',
        'The firewall crashes due to an infinite loop.',
        'Only multicast traffic is blocked.'
      ],
      correctIndex: 0,
      explanation: 'Because firewalls execute the first matching rule, placing "DENY ANY ANY" at the top ensures every packet matches Rule 1 and is dropped. Any permit rules below it are shadowed and dead.'
    },
    steps: [
      {
        id: 1,
        label: 'Order A: Specific Rule on Top',
        badge: 'Correct Order',
        activeNodes: ['sim-order-correct'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '192.168.1.5', dstPort: 443, protocol: 'TCP' },
        activeRuleIndex: 0,
        decision: 'ALLOW',
        ruleMatched: 'Rule 1: ALLOW 10.0.0.25 -> 192.168.1.5:443',
        whatIsHappening: 'Packet matches Rule 1 immediately. Result: ALLOWED. Legitimate admin access is granted.',
        interviewTakeaway: 'Specific exceptions placed at the top take precedence as intended.'
      },
      {
        id: 2,
        label: 'Order B: Broad Rule Dragged to Top',
        badge: 'Reordered',
        activeNodes: ['sim-order-swapped'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '192.168.1.5', dstPort: 443, protocol: 'TCP' },
        activeRuleIndex: 0,
        decision: 'DENY',
        ruleMatched: 'Rule 1 (Swapped): DENY ANY -> 192.168.1.5:443',
        whatIsHappening: 'Same packet arrives, but now matches the broad DENY rule first. Result: DENIED! Specific rule is never reached.',
        interviewTakeaway: 'Reordering rules completely inverts the security decision for the exact same packet.'
      }
    ]
  },

  // 8. What happens when multiple firewall rules match the same packet?
  {
    id: 8,
    categoryId: 'acl-rules',
    category: 'ACL & Firewall Rules',
    title: 'What happens when multiple firewall rules match the same packet?',
    subtitle: 'Learn the first-match rule principle vs routing longest-prefix-match differences.',
    visualType: 'multiple-match-demo',
    elevatorPitch:
      'When multiple firewall rules could potentially match a packet, the firewall does NOT perform cumulative evaluation or select the "most specific" rule. It strictly enforces the FIRST matching rule encountered in top-to-bottom sequence and immediately stops further evaluation.',
    deepDive: [
      '**First Match vs Longest Prefix Match:** In IP routing, routers pick the most specific subnet (Longest Prefix Match / LPM). In firewalls, evaluation is strictly order-dependent (First Match).',
      '**Rule Conflict Scenarios:** If Rule 3 allows subnet `10.0.0.0/16` and Rule 7 denies host `10.0.1.50`, a packet from `10.0.1.50` will be ALLOWED because Rule 3 was evaluated first.',
      '**Security Risk of Overlapping Rules:** Overlapping rules create accidental security holes when administrators assume lower rules will restrict upper permissions.',
      '**Audit & Policy Cleanup:** Regular firewall audits use automated policy optimizers to detect redundant, conflicting, or shadowed overlapping rules.'
    ],
    realWorldScenario:
      'A compliance auditor discovered that a database server was accessible from all branch offices because a legacy rule `ALLOW 10.0.0.0/8 ANY` at Rule 4 matched before a newer lockdown rule `DENY 10.2.0.0/16 DB_SERVER` at Rule 15.',
    commonTrap:
      'Do not confuse firewall matching with route table matching! Route tables select the most specific mask (/32 before /24). Firewalls select the first rule in the list regardless of subnet mask size.',
    cliSnippets: [
      {
        label: 'Overlapping Rules Conflict Example',
        code: 'Rule 3: ALLOW Source 10.0.0.0/8    Dst 172.16.0.10:443  <-- MATCHES 10.0.5.20 FIRST!\n...\nRule 8: DENY  Source 10.0.5.0/24   Dst 172.16.0.10:443  <-- NEVER EVALUATED!'
      }
    ],
    keyTakeaways: [
      'Firewalls use First-Match semantics, NOT most-specific matching.',
      'Evaluation halts immediately upon the first matching rule.',
      'Overlapping rules must be ordered with the most specific rule on top.'
    ],
    quiz: {
      question: 'How does firewall rule evaluation differ from router route-table lookup?',
      options: [
        'Firewalls use Longest Prefix Match; routers use First Match.',
        'Firewalls use First Match in sequence; routers use Longest Prefix Match (most specific destination mask).',
        'Both firewalls and routers use random hashing.',
        'Firewalls evaluate all rules simultaneously and take the average.'
      ],
      correctIndex: 1,
      explanation: 'Routers pick the most specific matching route (longest subnet prefix like /32 over /24). Firewalls evaluate rules sequentially and trigger on the FIRST matching rule regardless of how broad it is.'
    },
    steps: [
      {
        id: 1,
        label: 'Candidate Packet Arrives',
        badge: 'Packet Header',
        activeNodes: ['multi-packet'],
        packetInfo: { srcIp: '10.50.1.10', dstIp: '172.16.0.10', dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'Packet with Source 10.50.1.10 arrives. Both Rule 1 (10.0.0.0/8) and Rule 3 (10.50.1.10/32) could match this IP.',
        interviewTakeaway: 'Multiple rules in the policy list can technically match the same packet header.'
      },
      {
        id: 2,
        label: 'Rule 1 Check (Broad Subnet Match)',
        badge: 'Match & Stop',
        activeNodes: ['multi-rule1'],
        activeRuleIndex: 0,
        decision: 'ALLOW',
        ruleMatched: 'Rule 1: ALLOW 10.0.0.0/8 -> 172.16.0.10:443',
        whatIsHappening: 'Rule 1 matches 10.50.1.10 because it falls within 10.0.0.0/8. Evaluation terminates immediately with ALLOW.',
        interviewTakeaway: 'The firewall does not search ahead for Rule 3. First match terminates rule inspection.'
      }
    ]
  },

  // 9. What is an implicit deny rule, and why is it important?
  {
    id: 9,
    categoryId: 'acl-rules',
    category: 'ACL & Firewall Rules',
    title: 'What is an implicit deny rule, and why is it important?',
    subtitle: 'Learn the Zero Trust principle behind default deny at the end of every security rulebase.',
    visualType: 'implicit-deny',
    elevatorPitch:
      'An implicit deny is an invisible, default rule automatically placed at the very end of every firewall ACL or security policy (`DENY ALL ALL`). If a packet does not match any explicit permit rule in the rulebase, it is automatically dropped. It enforces the fundamental security principle of "Default Deny / Zero Trust".',
    deepDive: [
      '**Whitelisting vs Blacklisting:** Implicit deny ensures a "Whitelisting" (Default Deny) posture where only explicitly permitted traffic is allowed, rather than a dangerous "Blacklisting" (Default Allow) posture.',
      '**Zero Trust Foundation:** In modern Zero Trust Architecture (ZTA), trust is never assumed. Unidentified or unclassified traffic must be rejected by default.',
      '**Explicit Deny Logging:** While the implicit deny silently drops packets without always generating syslogs, network engineers often add an explicit `DENY ANY ANY log` rule at the very bottom to capture drop telemetry for incident detection.'
    ],
    realWorldScenario:
      'An engineer opened ports for a new microservice but forgot to lock down the rest of the subnet. Because the firewall ended in an implicit deny, all unauthorized ports remained completely closed and inaccessible to external scanners.',
    commonTrap:
      'Some firewalls (like AWS Security Groups) do not show the implicit deny rule in the GUI, but it is always active. Contrast Security Groups (implicit deny by default, stateful) with Network ACLs (explicit numbered rules, stateless).',
    cliSnippets: [
      {
        label: 'Explicit Bottom Rule for Logging (Best Practice)',
        code: '# Final rule to record all dropped traffic in SIEM\nRule 9999: DENY Source: ANY Dest: ANY Protocol: ANY Action: DROP LOG'
      }
    ],
    keyTakeaways: [
      'Implicit deny is the default fallback rule at the bottom of every rulebase.',
      'Enforces the Principle of Least Privilege and Zero Trust (Default Deny).',
      'Any packet that fails to match an explicit rule is dropped.'
    ],
    quiz: {
      question: 'Why do security engineers often add an explicit "DENY ANY ANY log" rule at the bottom of an ACL?',
      options: [
        'Because without it, firewalls will allow all unmatched traffic by default.',
        'To generate log telemetry and audit trails for unauthorized or malicious connection attempts.',
        'To speed up CPU processing of previous rules.',
        'To convert the firewall into a stateless bridge.'
      ],
      correctIndex: 1,
      explanation: 'While the implicit deny automatically drops unmatched traffic, adding an explicit rule with the "log" parameter ensures that dropped packets trigger syslog events, helping SOC analysts detect port scans and recon activity.'
    },
    steps: [
      {
        id: 1,
        label: 'Unknown Packet Arrives',
        badge: 'Ingress',
        activeNodes: ['client'],
        packetInfo: { srcIp: '198.51.100.77', dstIp: '10.0.1.20', dstPort: 8443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'Packet on unknown port 8443 arrives at firewall perimeter.',
        interviewTakeaway: 'Traffic arrives that does not match standard public service profiles.'
      },
      {
        id: 2,
        label: 'Rule 1 & Rule 2 Check: NO MATCH',
        badge: 'Scanning',
        activeNodes: ['firewall-scan'],
        activeRuleIndex: 0,
        decision: 'INSPECT',
        whatIsHappening: 'Firewall checks Rule 1 (Port 80) - NO MATCH. Checks Rule 2 (Port 443) - NO MATCH.',
        interviewTakeaway: 'Packet traverses down the rulebase without finding any matching permit statement.'
      },
      {
        id: 3,
        label: 'Hits Implicit Deny: DROPPED',
        badge: 'Implicit Deny',
        activeNodes: ['firewall-drop'],
        activeRuleIndex: 3,
        decision: 'DROP',
        ruleMatched: 'Default Rule: IMPLICIT DENY ALL',
        whatIsHappening: 'Packet reaches end of rulebase. Implicit deny drops the packet silently.',
        interviewTakeaway: 'Default Deny guarantees that forgotten or unspecified ports remain secure.'
      }
    ]
  },

  // 10. Given a set of firewall rules and a packet, can you determine which rule will match and whether the packet will be allowed or denied?
  {
    id: 10,
    categoryId: 'acl-rules',
    category: 'ACL & Firewall Rules',
    title: 'Given a set of firewall rules and a packet, can you determine which rule will match and whether the packet will be allowed or denied?',
    subtitle: 'Interactive packet decision practice: test your ability to trace 5-tuples through live rule sets.',
    visualType: 'scenario-simulator',
    elevatorPitch:
      'To determine whether a packet is allowed or denied: 1) Extract the packet 5-tuple (Src IP, Dst IP, Protocol, Src Port, Dst Port), 2) Iterate through the rule list starting at Rule 1, 3) Check if every criteria in the rule matches the packet, 4) The first rule where all parameters match dictates the ALLOW or DENY outcome, 5) If no rule matches, it falls through to Implicit Deny.',
    deepDive: [
      '**5-Tuple Extraction:** Identify Source IP/Subnet, Destination IP/Subnet, Layer 4 Protocol (TCP/UDP/ICMP), and Destination Port.',
      '**Subnet Mask Evaluation:** Verify if the IP is inside CIDR notation (e.g., 10.0.0.25 is inside `10.0.0.0/24`, but 10.0.1.25 is NOT).',
      '**Port Matching:** Check if the destination port matches the rule (e.g., port 443 HTTPS vs port 80 HTTP).',
      '**Action Execution:** Record the exact rule number and action for interview explanation.'
    ],
    realWorldScenario:
      'In technical interviews, interviewers frequently present a 4-rule table on a whiteboard and give you 3 different packet test cases to evaluate on the spot. Precision and step-by-step vocal reasoning win top marks.',
    commonTrap:
      'Look out for source port vs destination port! Rules typically match Destination Port (e.g., 443). If a rule states "Source Port 443", it will NOT match a client whose ephemeral source port is 51000.',
    cliSnippets: [
      {
        label: 'Interview Whiteboard Scenario Table',
        code: 'Rule 1: ALLOW  Src: 10.0.0.0/24  Dst: Server  Port: 443\nRule 2: DENY   Src: ANY          Dst: Server  Port: 443\nRule 3: ALLOW  Src: ANY          Dst: Server  Port: 80\nDefault: IMPLICIT DENY'
      }
    ],
    keyTakeaways: [
      'Extract the packet 5-tuple accurately.',
      'Check rules sequentially from Rule 1 downward.',
      'Verify CIDR subnet boundaries and destination port numbers.',
      'The first matching rule determines the final verdict.'
    ],
    quiz: {
      question: 'Given: Rule 1: ALLOW 10.0.0.0/24 -> 443; Rule 2: DENY ANY -> 443; Rule 3: ALLOW ANY -> 80. Packet: Src 10.0.1.50, Dst Server, Port 443. What is the result?',
      options: [
        'ALLOWED by Rule 1',
        'DENIED by Rule 2',
        'ALLOWED by Rule 3',
        'DENIED by Implicit Deny'
      ],
      correctIndex: 1,
      explanation: 'Src 10.0.1.50 does not match Rule 1 (10.0.0.0/24 subnet). It moves to Rule 2, which matches ANY source to port 443 with a DENY action. Result: DENIED by Rule 2.'
    },
    steps: [
      {
        id: 1,
        label: 'Packet Test Case 1: 10.0.0.25 on Port 443',
        badge: 'Case 1',
        activeNodes: ['sim-client-1'],
        packetInfo: { srcIp: '10.0.0.25', dstIp: '192.168.1.100', dstPort: 443, protocol: 'TCP' },
        activeRuleIndex: 0,
        decision: 'ALLOW',
        ruleMatched: 'Rule 1: ALLOW 10.0.0.0/24 -> Server:443',
        whatIsHappening: '10.0.0.25 is inside 10.0.0.0/24. Matches Rule 1. Result: ALLOWED ✓.',
        interviewTakeaway: 'Matches Rule 1 first, so processing terminates with ALLOW.'
      },
      {
        id: 2,
        label: 'Packet Test Case 2: 10.0.1.50 on Port 443',
        badge: 'Case 2',
        activeNodes: ['sim-client-2'],
        packetInfo: { srcIp: '10.0.1.50', dstIp: '192.168.1.100', dstPort: 443, protocol: 'TCP' },
        activeRuleIndex: 1,
        decision: 'DENY',
        ruleMatched: 'Rule 2: DENY ANY -> Server:443',
        whatIsHappening: '10.0.1.50 fails Rule 1, matches Rule 2 (DENY ANY on 443). Result: DENIED ✕.',
        interviewTakeaway: 'Fails Rule 1 subnet check; caught by broad Rule 2 deny.'
      },
      {
        id: 3,
        label: 'Packet Test Case 3: 172.16.5.9 on Port 80',
        badge: 'Case 3',
        activeNodes: ['sim-client-3'],
        packetInfo: { srcIp: '172.16.5.9', dstIp: '192.168.1.100', dstPort: 80, protocol: 'TCP' },
        activeRuleIndex: 2,
        decision: 'ALLOW',
        ruleMatched: 'Rule 3: ALLOW ANY -> Server:80',
        whatIsHappening: 'Port is 80 (fails Rules 1 & 2), matches Rule 3 (ALLOW ANY on 80). Result: ALLOWED ✓.',
        interviewTakeaway: 'Port 80 traffic bypasses port 443 rules and matches Rule 3.'
      }
    ]
  },

  // 11. What is NAT, and why is it used in network security?
  {
    id: 11,
    categoryId: 'nat',
    category: 'NAT (Network Address Translation)',
    title: 'What is NAT, and why is it used in network security?',
    subtitle: 'Understand IP address translation, RFC 1918 private subnets, and internal topology shielding.',
    visualType: 'nat-translation',
    elevatorPitch:
      'NAT (Network Address Translation) is a networking method that rewrites source or destination IP addresses (and ports) in packet headers as they traverse a router or firewall. It was primarily developed to conserve IPv4 public address space (RFC 1918) and provides a security benefit by shielding internal IP topologies from the public Internet.',
    deepDive: [
      '**IPv4 Conservation:** Enables thousands of internal private devices (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) to share a single routable public IPv4 address.',
      '**Topology Hiding / Network Obfuscation:** External Internet hosts only see the firewall\'s public IP. Direct inbound connections to internal endpoints are impossible without an explicit state entry or port-forwarding rule.',
      '**NAT Table Tracking:** The NAT gateway maintains a stateful translation table mapping `Internal Private IP:Port` <-> `Public IP:NAT_Port`.',
      '**Security Clarification:** NAT is NOT a substitute for a firewall. NAT translates addresses; firewalls enforce security access policy.'
    ],
    realWorldScenario:
      'In a corporate office with 500 laptops on 192.168.1.0/24, all laptops browse the Internet simultaneously through a single public IP 203.0.113.10 using PAT (NAT Overload).',
    commonTrap:
      'Never claim "NAT is a firewall." While NAT obscures internal IPs, it lacks packet inspection, rule policy controls, and malware detection.',
    cliSnippets: [
      {
        label: 'Linux iptables Source NAT (MASQUERADE)',
        code: 'iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j MASQUERADE'
      },
      {
        label: 'Cisco IOS PAT Configuration',
        code: 'ip nat inside source list 1 interface GigabitEthernet0/0 overload\naccess-list 1 permit 192.168.1.0 0.0.0.255'
      }
    ],
    keyTakeaways: [
      'Translates private RFC 1918 IPs into public routable IPs.',
      'Hides internal network addressing and device topology.',
      'Maintains a translation table mapping internal ports to public NAT ports.',
      'Complements firewalls but does not replace security policy inspection.'
    ],
    quiz: {
      question: 'Which RFC defines the private IPv4 address ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)?',
      options: ['RFC 791', 'RFC 1918', 'RFC 2616', 'RFC 5246'],
      correctIndex: 1,
      explanation: 'RFC 1918 allocates the three standard private IPv4 address blocks for internal networks that are not routable on the public Internet without NAT.'
    },
    steps: [
      {
        id: 1,
        label: 'Private Host Sends Outbound Packet',
        badge: 'Inside Local',
        activeNodes: ['nat-client'],
        packetInfo: { srcIp: '192.168.1.50', dstIp: '93.184.216.34', srcPort: 48210, dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'Internal host 192.168.1.50 sends HTTPS request. Destination is public server 93.184.216.34.',
        interviewTakeaway: 'The packet carries private Inside Local addressing (192.168.1.50:48210).'
      },
      {
        id: 2,
        label: 'NAT Gateway Translates Source IP & Port',
        badge: 'Translation',
        activeNodes: ['nat-router'],
        packetInfo: { srcIp: '203.0.113.8', dstIp: '93.184.216.34', srcPort: 61005, dstPort: 443, protocol: 'TCP' },
        natTable: [
          { insideLocal: '192.168.1.50:48210', insideGlobal: '203.0.113.8:61005', outsideGlobal: '93.184.216.34:443', protocol: 'TCP' }
        ],
        whatIsHappening: 'NAT router rewrites Source IP to 203.0.113.8 and allocates port 61005. Stores mapping in NAT table.',
        interviewTakeaway: 'The NAT table logs the binding so incoming return packets can be mapped back to the private host.'
      },
      {
        id: 3,
        label: 'Server Receives & Replies to Public IP',
        badge: 'Inside Global',
        activeNodes: ['nat-server'],
        packetInfo: { srcIp: '93.184.216.34', dstIp: '203.0.113.8', srcPort: 443, dstPort: 61005, protocol: 'TCP' },
        whatIsHappening: 'Web server sees packet from 203.0.113.8:61005 and sends reply back to that public address.',
        interviewTakeaway: 'The external server has zero visibility into the internal private 192.168.1.50 IP.'
      },
      {
        id: 4,
        label: 'NAT Gateway Reverse-Translates to Host',
        badge: 'De-NAT',
        activeNodes: ['nat-router', 'nat-client'],
        packetInfo: { srcIp: '93.184.216.34', dstIp: '192.168.1.50', srcPort: 443, dstPort: 48210, protocol: 'TCP' },
        whatIsHappening: 'NAT router receives reply on port 61005, looks up NAT table, rewrites Destination to 192.168.1.50:48210, and delivers to laptop.',
        interviewTakeaway: 'Bidirectional translation completes transparently from the user’s perspective.'
      }
    ]
  },

  // 12. What is the difference between Static NAT, Dynamic NAT, PAT, and DNAT?
  {
    id: 12,
    categoryId: 'nat',
    category: 'NAT (Network Address Translation)',
    title: 'What is the difference between Static NAT, Dynamic NAT, PAT, and DNAT?',
    subtitle: 'Compare 1:1 mappings, dynamic IP pools, Port Address Translation (Overload), and Destination Port Forwarding.',
    visualType: 'nat-types',
    elevatorPitch:
      'Static NAT provides a 1-to-1 permanent mapping between a private IP and a public IP (commonly used for web/mail servers). Dynamic NAT maps private IPs to a pool of available public IPs on a first-come, first-served basis. PAT (Port Address Translation / NAT Overload) maps many private IPs to a single public IP using unique Layer 4 port numbers. DNAT (Destination NAT / Port Forwarding) rewrites the destination IP of incoming public packets to route external requests to an internal server.',
    deepDive: [
      '**Static NAT (1:1):** Dedicated public IP for an internal host. Supports both inbound and outbound initiated connections.',
      '**Dynamic NAT (M:N):** Pool of public IPs. When all public IPs in the pool are checked out, additional internal hosts are blocked until an existing session expires.',
      '**PAT (Port Address Translation / NAT Overload):** Maps thousands of private IPs to one public IP by tracking unique 16-bit source ports (up to ~64,000 concurrent sessions per IP). Standard in home routers and enterprise egress.',
      '**DNAT (Destination NAT / Port Forwarding):** External users hit `Public_IP:443`, and the firewall rewrites the Destination IP to internal web server `10.0.2.100:443`.'
    ],
    realWorldScenario:
      'An organization hosts a public web application. They configure DNAT: incoming traffic on `203.0.113.25:443` is translated to internal DMZ server `172.16.10.5:8443`.',
    commonTrap:
      'Remember Cisco terminology: Inside Local (private IP), Inside Global (public IP allocated to inside host), Outside Local (destination IP as seen from inside), Outside Global (real public destination IP).',
    cliSnippets: [
      {
        label: 'Cisco Static NAT (1:1)',
        code: 'ip nat inside source static 192.168.1.10 203.0.113.15'
      },
      {
        label: 'Linux iptables DNAT (Port Forwarding)',
        code: 'iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.0.50:8080'
      }
    ],
    keyTakeaways: [
      'Static NAT: 1 Private IP <-> 1 Public IP (Bi-directional).',
      'Dynamic NAT: Multiple Private IPs <-> Pool of Public IPs (First-come).',
      'PAT (Overload): Many Private IPs <-> 1 Public IP (Uses Port Multiplexing).',
      'DNAT: Rewrites Destination IP (Inbound Web Server Port Forwarding).'
    ],
    quiz: {
      question: 'Which NAT type allows thousands of internal corporate devices to access the Internet using only a single public IPv4 address?',
      options: [
        'Static NAT',
        'Dynamic NAT without overload',
        'PAT (Port Address Translation / NAT Overload)',
        'Carrier-Grade 1:1 NAT'
      ],
      correctIndex: 2,
      explanation: 'PAT (Port Address Translation / NAT Overload) tracks unique Layer 4 port numbers for each outbound session, allowing thousands of devices to share one public IP simultaneously.'
    },
    steps: [
      {
        id: 1,
        label: '1. Static NAT: Permanent 1-to-1 Mapping',
        badge: 'Static NAT (1:1)',
        activeNodes: ['nat-static'],
        packetInfo: { srcIp: '10.0.0.10', dstIp: '198.51.100.2', srcPort: 443, dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'Internal DMZ Server 10.0.0.10 is permanently bound to dedicated Public IP 203.0.113.20. Inbound and outbound connections always map to this single address.',
        interviewTakeaway: 'Static NAT is mandatory for hosting public-facing servers (Web, Mail, DNS) that require predictable inbound routing.'
      },
      {
        id: 2,
        label: '2. Dynamic NAT: Dynamic IP Pool Allocation',
        badge: 'Dynamic NAT (M:N)',
        activeNodes: ['nat-dynamic'],
        packetInfo: { srcIp: '10.0.1.15', dstIp: '198.51.100.2', srcPort: 52100, dstPort: 80, protocol: 'TCP' },
        whatIsHappening: 'Internal host 10.0.1.15 checks out a temporary public IP from a pool of 203.0.113.50-203.0.113.60. When the pool is exhausted, new hosts must wait.',
        interviewTakeaway: 'Dynamic NAT does not conserve addresses well because each active internal host consumes a full public IPv4 address.'
      },
      {
        id: 3,
        label: '3. PAT / NAT Overload: Port Multiplexing',
        badge: 'PAT (Many:1)',
        activeNodes: ['nat-pat'],
        packetInfo: { srcIp: '192.168.1.10', dstIp: '93.184.216.34', srcPort: 5001, dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'Thousands of internal workstations share one public IP (203.0.113.1) by tracking unique 16-bit source ports (e.g., Host A: 61001, Host B: 61002).',
        interviewTakeaway: 'PAT is the standard mechanism in enterprise egress and home routers, supporting up to ~64,000 concurrent sessions per IP.'
      },
      {
        id: 4,
        label: '4. DNAT / Port Forwarding: Inbound Redirection',
        badge: 'Destination NAT',
        activeNodes: ['nat-dnat'],
        packetInfo: { srcIp: '198.51.100.99', dstIp: '203.0.113.50', srcPort: 49200, dstPort: 80, protocol: 'TCP' },
        whatIsHappening: 'External Internet user hits public IP 203.0.113.50 on port 80. Gateway rewrites Destination IP to internal web server 10.0.2.80:8080.',
        interviewTakeaway: 'DNAT exposes internal private services to the public Internet without giving the backend server a public IP.'
      }
    ]
  },

  // 13. How does NAT interact with firewall rules when a packet passes through a firewall?
  {
    id: 13,
    categoryId: 'nat',
    category: 'NAT (Network Address Translation)',
    title: 'How does NAT interact with firewall rules when a packet passes through a firewall?',
    subtitle: 'Master the order of operations: Pre-routing NAT vs Security ACLs vs Post-routing NAT.',
    visualType: 'nat-firewall-order',
    elevatorPitch:
      'The order of operations between NAT and firewall inspection depends on packet direction and vendor architecture. For inbound DNAT traffic, Destination NAT translation typically occurs BEFORE firewall policy evaluation (or firewall policies must match the pre-NAT or post-NAT IP depending on the vendor, e.g., Cisco ASA uses post-NAT real IP, while Palo Alto / Check Point uses pre-NAT destination IP with post-NAT zone). For outbound SNAT, firewall policy is evaluated first on the real source IP, and Source NAT occurs in POSTROUTING before packet egress.',
    deepDive: [
      '**Linux Netfilter / iptables Order:** `PREROUTING (DNAT)` -> `FORWARD (Firewall Filter)` -> `POSTROUTING (SNAT)`.',
      '**Inbound Traffic Flow:** 1) Ingress interface receives packet, 2) DNAT translates destination IP to internal real IP, 3) Security policy checks whether source is permitted to access internal destination real IP, 4) Egress to internal zone.',
      '**Outbound Traffic Flow:** 1) Ingress from internal host, 2) Security policy checks if internal host is allowed outbound, 3) Routing determines egress interface, 4) SNAT/PAT rewrites source IP to public IP.',
      '**Vendor Nuance (Crucial Interview Point):** In Palo Alto Networks, security policies reference the **Original (Pre-NAT) Destination IP** with the **Destination Zone of the Translated (Post-NAT) IP**. In Cisco ASA (version 8.3+), access-lists reference the **Real Internal IP**.'
    ],
    realWorldScenario:
      'An administrator configured DNAT forwarding port 443 to internal server 10.0.1.50, but the firewall blocked traffic because their ACL permitted traffic to the public IP instead of matching the firewall engine’s required post-NAT real IP.',
    commonTrap:
      'Interviewers love asking: "Does the firewall rule match the Public IP or the Private IP?" Always clarify vendor context (Palo Alto vs Cisco ASA vs iptables).',
    cliSnippets: [
      {
        label: 'iptables Order of Operations Hook Flow',
        code: 'Ingress Packet\n  ↓\n[PREROUTING: DNAT]\n  ↓\n[FORWARD: Security Filter Rules]\n  ↓\n[POSTROUTING: SNAT / MASQUERADE]\n  ↓\nEgress Packet'
      }
    ],
    keyTakeaways: [
      'Linux/Netfilter: DNAT happens in PREROUTING; SNAT happens in POSTROUTING.',
      'Firewall filtering occurs in FORWARD between pre-routing and post-routing.',
      'Always verify whether the firewall vendor requires pre-NAT or post-NAT IP in security rules.'
    ],
    quiz: {
      question: 'In Linux Netfilter (iptables), when does Source NAT (SNAT/MASQUERADE) occur for an outbound packet?',
      options: [
        'In the PREROUTING chain before routing and firewall filtering.',
        'In the FORWARD chain alongside ACL rules.',
        'In the POSTROUTING chain after routing decisions and firewall filter permit.',
        'Directly in the network interface card driver.'
      ],
      correctIndex: 2,
      explanation: 'SNAT modifies the source IP address in the POSTROUTING chain, just before the packet leaves the firewall onto the physical wire, after security policy filtering has already permitted the flow.'
    },
    steps: [
      {
        id: 1,
        label: '1. Inbound Ingress on External Interface',
        badge: 'Ingress',
        activeNodes: ['order-ingress'],
        packetInfo: { srcIp: '198.51.100.4', dstIp: '203.0.113.10', dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'Public packet arrives destined for public IP 203.0.113.10 on port 443.',
        interviewTakeaway: 'The packet carries original public source and public destination addresses.'
      },
      {
        id: 2,
        label: '2. Pre-Routing Destination NAT (DNAT)',
        badge: 'DNAT Phase',
        activeNodes: ['order-dnat'],
        packetInfo: { srcIp: '198.51.100.4', dstIp: '10.0.2.50', dstPort: 443, protocol: 'TCP' },
        whatIsHappening: 'DNAT translates destination IP from 203.0.113.10 -> internal real IP 10.0.2.50.',
        interviewTakeaway: 'Destination translation occurs before security policy forwarding evaluation.'
      },
      {
        id: 3,
        label: '3. Firewall Security Policy Check',
        badge: 'ACL Filter',
        activeNodes: ['order-firewall'],
        decision: 'ALLOW',
        ruleMatched: 'Rule: ALLOW Ext_Zone -> DMZ_Zone (10.0.2.50:443)',
        whatIsHappening: 'Firewall evaluates access policy to verify if traffic from untrusted zone is authorized to reach DMZ web server.',
        interviewTakeaway: 'Security policy evaluates routing zone and destination parameters.'
      },
      {
        id: 4,
        label: '4. Egress to Internal DMZ Server',
        badge: 'Delivery',
        activeNodes: ['order-egress'],
        packetInfo: { srcIp: '198.51.100.4', dstIp: '10.0.2.50', dstPort: 443, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'Packet is switched out the DMZ interface and delivered to internal server 10.0.2.50.',
        interviewTakeaway: 'Packet successfully arrives with real internal destination IP.'
      }
    ]
  },

  // 14. What is the difference between IDS and IPS?
  {
    id: 14,
    categoryId: 'ids-ips',
    category: 'IDS / IPS & Threat Detection',
    title: 'What is the difference between IDS and IPS?',
    subtitle: 'Compare passive detection & out-of-band alerts vs active inline blocking and TCP resets.',
    visualType: 'ids-vs-ips',
    elevatorPitch:
      'An IDS (Intrusion Detection System) is a passive, out-of-band monitoring system that inspects a copy of network traffic (via SPAN/TAP ports) and generates alerts when malicious patterns are detected without affecting live traffic flow. An IPS (Intrusion Prevention System) is deployed active and inline ("bump in the wire"), meaning all live traffic flows directly through it, enabling it to actively drop malicious packets, reset TCP sessions, and block attackers in real time.',
    deepDive: [
      '**Deployment Mode:** IDS is Out-of-Band (Passive, TAP/Mirror); IPS is In-Line (Active, inline bridge/routed).',
      '**Action on Detection:** IDS alerts SIEM/SOC; IPS drops packets (`DROP`), sends TCP RST flags to tear down sessions, or triggers dynamic firewall IP bans.',
      '**Failure Mode Risk:** If an IDS crashes, traffic continues uninterrupted (fail-open). If an inline IPS fails, network traffic can be interrupted unless hardware bypass switches (fail-open bypass) are installed.',
      '**False Positive Impact:** A false positive on an IDS creates a nuisance alert for analysts. A false positive on an IPS drops legitimate business transactions (e.g., blocking payroll or customer checkouts).',
      '**Detection Engines:** Both use Signature-based detection (known CVE patterns), Anomaly-based detection (statistical baselines), and Protocol Analysis (RFC violation detection).'
    ],
    realWorldScenario:
      'An attacker launched an Apache Log4j exploit payload. An IDS recorded the event and alerted the SOC 2 minutes later after the server was compromised. An inline IPS inspected the TCP stream in real-time, matched the JNDI lookup signature, and dropped the packet before it touched the web server.',
    commonTrap:
      'Highlight the latency consideration: because an IPS is inline, Deep Packet Inspection adds microsecond latency to all network transactions, requiring dedicated hardware acceleration (ASICs / FPGAs).',
    cliSnippets: [
      {
        label: 'Suricata / Snort IPS Rule (Drop Exploit)',
        code: 'drop tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (msg:"EXPLOIT Log4j JNDI RCE Attempt"; content:"${jndi:"; nocase; sid:2000001; rev:1;)'
      }
    ],
    keyTakeaways: [
      'IDS is passive/out-of-band: Detects & Alerts; cannot block.',
      'IPS is active/inline: Detects & Blocks in real time (drops packets/resets sessions).',
      'IPS introduces inline latency and risk of false-positive drops.',
      'Both use signature, anomaly, and behavioral heuristics.'
    ],
    quiz: {
      question: 'What happens if a passive IDS detects a severe remote code execution exploit in real time?',
      options: [
        'It immediately drops the packet and terminates the TCP connection.',
        'It logs the event and sends an alert to the SIEM/SOC, but cannot prevent the packet from reaching the victim.',
        'It powers off the switch interface.',
        'It re-encrypts the packet.'
      ],
      correctIndex: 1,
      explanation: 'Because an IDS sits out-of-band inspecting a mirrored SPAN/TAP stream, the original packet has already traversed the network to the destination. The IDS can only generate alerts or send asynchronous TCP RST packets after the fact.'
    },
    steps: [
      {
        id: 1,
        label: '1. IDS: Exploit Enters Core Switch',
        badge: 'IDS Step 1',
        activeNodes: ['client', 'switch'],
        packetInfo: { srcIp: '198.51.100.99', dstIp: '10.0.1.10', dstPort: 80, protocol: 'TCP', payloadSummary: 'SQLi Exploit: SELECT * FROM users--' },
        whatIsHappening: 'An external attacker transmits an HTTP packet containing a malicious SQL Injection exploit payload toward the database web server.',
        interviewTakeaway: 'The network switch receives the packet on its external port.'
      },
      {
        id: 2,
        label: '2. IDS: Switch SPAN Port Mirrors Packet',
        badge: 'IDS Step 2',
        activeNodes: ['switch', 'ids'],
        packetInfo: { srcIp: '198.51.100.99', dstIp: '10.0.1.10', dstPort: 80, protocol: 'TCP' },
        whatIsHappening: 'The switch duplicates the packet via a SPAN / TAP mirror port and sends an out-of-band copy to the passive IDS sensor.',
        interviewTakeaway: 'IDS operates out-of-band, meaning original live traffic is never delayed by deep inspection processing.'
      },
      {
        id: 3,
        label: '3. IDS: Threat Detected & SIEM Alert Logged',
        badge: 'IDS Step 3',
        activeNodes: ['ids'],
        decision: 'ALERT',
        ruleMatched: 'IDS Signature: SQL-Injection-Pattern-A',
        whatIsHappening: 'The IDS signature engine detects the SQL injection pattern in the mirrored copy and triggers a Critical Security Alert to the SOC SIEM.',
        interviewTakeaway: 'IDS provides detection and alerting visibility across network boundaries.'
      },
      {
        id: 4,
        label: '4. IDS: Original Malicious Packet Hits Server',
        badge: 'IDS Step 4',
        activeNodes: ['switch', 'server'],
        packetInfo: { srcIp: '198.51.100.99', dstIp: '10.0.1.10', dstPort: 80, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'Because the IDS is out-of-band and cannot block, the original malicious packet continues along its network path and strikes the web server! (Server Compromised)',
        interviewTakeaway: 'Passive IDS cannot prevent attacks in real time; it is strictly a detection and forensic audit tool.'
      },
      {
        id: 5,
        label: '5. IPS: Inline Hardware Deployment',
        badge: 'IPS Step 1',
        activeNodes: ['client', 'ips'],
        packetInfo: { srcIp: '198.51.100.99', dstIp: '10.0.1.10', dstPort: 80, protocol: 'TCP', payloadSummary: 'SQLi Exploit: SELECT * FROM users--' },
        whatIsHappening: 'Now deploy an inline Intrusion Prevention System (IPS). The IPS sits directly in the physical traffic path between switch and servers.',
        interviewTakeaway: 'All production traffic must physically traverse the IPS hardware inspection engine.'
      },
      {
        id: 6,
        label: '6. IPS: Ingress Deep Packet Inspection',
        badge: 'IPS Step 2',
        activeNodes: ['ips'],
        packetInfo: { srcIp: '198.51.100.99', dstIp: '10.0.1.10', dstPort: 80, protocol: 'TCP' },
        decision: 'INSPECT',
        whatIsHappening: 'The attacker sends the same SQL injection payload. The packet enters the IPS ingress interface and is inspected by the protocol & signature ASIC.',
        interviewTakeaway: 'Inline DPI inspects headers and application payload before forwarding frames.'
      },
      {
        id: 7,
        label: '7. IPS: Threat Detected & Packet DROPPED',
        badge: 'IPS Step 3',
        activeNodes: ['ips'],
        decision: 'DROP',
        ruleMatched: 'IPS Policy Action: DROP & RESET',
        whatIsHappening: 'The IPS identifies the CVE signature in real-time and immediately DROPS the packet, terminating the frame on the spot.',
        interviewTakeaway: 'Active inline blocking stops attacks before payloads touch server memory.'
      },
      {
        id: 8,
        label: '8. IPS: TCP Reset Sent & Server Protected',
        badge: 'IPS Step 4',
        activeNodes: ['ips', 'server'],
        decision: 'DROP',
        whatIsHappening: 'The IPS transmits a TCP RST flag to tear down the attacker session. The malicious packet NEVER reaches the server. Target server remains 100% secure!',
        interviewTakeaway: 'IPS provides active, real-time protection against zero-days and known vulnerabilities.'
      }
    ]
  },

  // 15. Where would you place an IDS/IPS in a network, and how does it inspect traffic?
  {
    id: 15,
    categoryId: 'ids-ips',
    category: 'IDS / IPS & Threat Detection',
    title: 'Where would you place an IDS/IPS in a network, and how does it inspect traffic?',
    subtitle: 'Analyze sensor placement at Perimeter, DMZ, Core Backbone, and Host endpoints.',
    visualType: 'ids-placement',
    elevatorPitch:
      'Strategic IDS/IPS placement balances visibility, performance, and threat mitigation. Common locations include: 1) Behind the perimeter firewall (inspecting filtered traffic to catch external exploits that passed firewall ACLs), 2) Inside the DMZ (protecting public-facing web/app servers), 3) At the Core / Distribution layer (detecting lateral movement and insider threats between internal VLANs), and 4) On individual endpoints as Host-based IPS (HIPS/EDR).',
    deepDive: [
      '**Behind Perimeter Firewall (Most Common):** Placing the IPS behind the firewall avoids wasting IPS CPU cycles on volumetric internet noise already dropped by firewall ACLs.',
      '**In Front of Firewall (Pre-Firewall):** Used rarely to capture raw internet attack reconnaissance before firewall filtering.',
      '**DMZ Sensor:** Monitors ingress traffic to web/email servers and detects server compromise before lateral expansion into the corporate LAN.',
      '**Internal Core / East-West Sensor:** Monitors traffic between internal subnets. Essential for detecting ransomware propagation and privileged escalation.',
      '**Inspection Techniques:** 1) Pattern Matching / Signatures (Snort/Suricata rules), 2) Protocol Anomaly Detection (RFC compliance), 3) Heuristic / Machine Learning anomaly baselines.'
    ],
    realWorldScenario:
      'An advanced persistent threat (APT) compromised a workstation via phishing and attempted lateral SMB movement to the finance VLAN. An internal IPS sensor on the core distribution switch detected the PsExec lateral movement signature and blocked the infection.',
    commonTrap:
      'Explain that placing an IPS outside the firewall causes sensor saturation due to millions of internet port scans and DDoS packets. Place it inside the firewall so it inspects clean, pre-filtered traffic.',
    cliSnippets: [
      {
        label: 'Cisco SPAN Port Configuration (for IDS)',
        code: 'monitor session 1 source interface GigabitEthernet0/1 - 4 both\nmonitor session 1 destination interface GigabitEthernet0/24'
      }
    ],
    keyTakeaways: [
      'Behind perimeter firewall: Inspects pre-filtered inbound/outbound traffic.',
      'Inside DMZ: Protects public services and monitors server health.',
      'Internal Core: Detects East-West lateral movement and insider attacks.',
      'Network TAP / SPAN ports provide traffic copies for passive IDS.'
    ],
    quiz: {
      question: 'Why is an IPS typically placed behind the perimeter firewall rather than directly on the raw Internet edge?',
      options: [
        'Because IPS devices cannot handle fiber-optic cables.',
        'To prevent the IPS from being overwhelmed by volumetric noise and port scans already dropped by firewall ACLs.',
        'Because firewalls cannot route packets if placed behind an IPS.',
        'To allow the IPS to run in stateless mode.'
      ],
      correctIndex: 1,
      explanation: 'Firewalls drop high volumes of random internet garbage efficiently at wire speed. Placing the IPS behind the firewall allows the IPS to focus its deep inspection CPU resources on legitimate candidate traffic.'
    },
    steps: [
      {
        id: 1,
        label: 'Perimeter Sensor (Behind Firewall)',
        badge: 'North-South',
        activeNodes: ['place-perimeter'],
        whatIsHappening: 'Inspects North-South traffic that has successfully traversed firewall ACLs. Filters out web application exploits and C2 callbacks.',
        interviewTakeaway: 'Primary defense line against external exploitation attempts.'
      },
      {
        id: 2,
        label: 'DMZ Sensor (Public Services)',
        badge: 'DMZ Layer',
        activeNodes: ['place-dmz'],
        whatIsHappening: 'Monitors traffic entering and leaving DMZ servers. Detects webshell uploads and database exfiltration attempts.',
        interviewTakeaway: 'Guards the perimeter-to-internal pivot point.'
      },
      {
        id: 3,
        label: 'Core / Internal Sensor (East-West)',
        badge: 'East-West',
        activeNodes: ['place-core'],
        whatIsHappening: 'Monitors inter-VLAN internal network traffic. Detects lateral movement (SMB/RDP brute force, ransomware replication).',
        interviewTakeaway: 'Crucial for defense-in-depth against insider threats and post-exploitation spread.'
      }
    ]
  },

  // 16. How would you investigate traffic that is being blocked by an IPS or firewall?
  {
    id: 16,
    categoryId: 'ids-ips',
    category: 'IDS / IPS & Threat Detection',
    title: 'How would you investigate traffic that is being blocked by an IPS or firewall?',
    subtitle: 'Master the 5-step systematic troubleshooting and security triage methodology.',
    visualType: 'troubleshooting-flow',
    elevatorPitch:
      'I follow a structured 5-step triage process: 1) Verify the symptoms and collect connection details (5-tuple: Src/Dst IP, Port, Protocol, Timestamp), 2) Query firewall/IPS logs for drop/reset events and signature IDs, 3) Perform packet captures (tcpdump / Wireshark) at ingress and egress interfaces, 4) Use vendor diagnostic tools (e.g., Cisco `packet-tracer` or Palo Alto `test security-policy-match`), and 5) Determine root cause (misconfigured rule, routing asymmetry, expired certificate, or genuine malicious activity).',
    deepDive: [
      '**Step 1 - Log Analysis:** Inspect Syslog / SIEM. Look for `DENY`, `TEARDOWN`, `TCP-RST`, or specific IPS Signature Rule IDs (e.g., Snort SID / CVE reference).',
      '**Step 2 - Packet Capture (PCAP):** Run `tcpdump -nn -i any host 10.0.1.50 and port 443`. Check if TCP SYN arrives on ingress but no SYN leaves egress (confirms firewall drop).',
      '**Step 3 - Session & State Table Verification:** Check connection tracking tables for state timeouts, TCP window errors, or asymmetric routing drops (e.g., SYN on Interface A, ACK on Interface B).',
      '**Step 4 - Rule Simulation Tools:** Run CLI simulation tools like Cisco `packet-tracer` to simulate the exact packet through the policy pipeline.',
      '**Step 5 - Remediation / Tuning:** If legitimate traffic is blocked by false positive IPS signature, tune the signature or add an exception. If blocked by ACL, correct rule order or add permit statement.'
    ],
    realWorldScenario:
      'A software deployment to production failed. Firewall logs showed drops on port 8443 with message `TCP SYN timeout`. Investigation revealed asymmetric routing: outbound packets went via Firewall A, but return packets returned via Firewall B, which dropped them because it had no state table entry.',
    commonTrap:
      'Never immediately disable firewall rules or IPS signatures without capturing proof! Mention capturing PCAPs and validating signature false-positives before requesting change control modifications.',
    cliSnippets: [
      {
        label: 'tcpdump Command for Live Drop Triage',
        code: 'tcpdump -nn -v -i any "src host 10.0.1.25 and dst port 443"'
      },
      {
        label: 'Palo Alto CLI Security Policy Test',
        code: 'test security-policy-match source 10.0.1.25 destination 192.168.10.5 protocol 6 destination-port 443'
      }
    ],
    keyTakeaways: [
      'Collect 5-tuple: Source IP/Port, Dest IP/Port, Protocol, Timestamp.',
      'Query firewall logs and SIEM for drop counters and signature SIDs.',
      'Use packet captures (PCAPs) to verify ingress vs egress drop points.',
      'Check for asymmetric routing and state table anomalies.'
    ],
    quiz: {
      question: 'Why does asymmetric routing cause stateful firewalls to drop legitimate return network traffic?',
      options: [
        'Because asymmetric routing inverts IP addresses into MAC addresses.',
        'Because the return firewall never saw the initial TCP SYN packet, so it has no state table entry and drops the SYN-ACK as invalid.',
        'Because routers disable TCP checksums on asymmetric links.',
        'Because DNS lookups fail on asymmetric paths.'
      ],
      correctIndex: 1,
      explanation: 'In asymmetric routing, outbound packets leave via Firewall 1 (creating a state entry), but return packets return via Firewall 2. Because Firewall 2 has no record of the initial SYN, it treats the unexpected SYN-ACK/ACK as out-of-state and drops it.'
    },
    steps: [
      {
        id: 1,
        label: '1. Incident Reported: Connection Failing',
        badge: 'Step 1: Symptom',
        activeNodes: ['triage-client'],
        packetInfo: { srcIp: '10.0.1.50', dstIp: '172.16.5.10', dstPort: 443, protocol: 'TCP', flags: 'SYN' },
        whatIsHappening: 'Application team reports database API calls are timing out. 5-tuple details collected.',
        interviewTakeaway: 'Always gather precise 5-tuple and timestamp before investigating.'
      },
      {
        id: 2,
        label: '2. Firewall Log Analysis',
        badge: 'Step 2: Logs',
        activeNodes: ['triage-logs'],
        decision: 'DROP',
        ruleMatched: 'Syslog: %ASA-4-106023: Deny tcp src inside:10.0.1.50/51200 dst dmz:172.16.5.10/443 by access-group "INSIDE_IN"',
        whatIsHappening: 'Syslog query confirms firewall is actively dropping packets at Rule 40 (Explicit Deny).',
        interviewTakeaway: 'Log telemetry confirms whether drops are firewall-driven or host-side.'
      },
      {
        id: 3,
        label: '3. Live PCAP Packet Capture',
        badge: 'Step 3: PCAP',
        activeNodes: ['triage-pcap'],
        whatIsHappening: 'Ingress interface captures TCP SYN; egress interface captures nothing. Confirms drop occurs inside firewall engine.',
        interviewTakeaway: 'Dual-interface PCAP proves packet loss location conclusively.'
      },
      {
        id: 4,
        label: '4. Rule Adjustment & Verification',
        badge: 'Step 4: Resolved',
        activeNodes: ['triage-client', 'triage-server'],
        decision: 'ALLOW',
        ruleMatched: 'Rule 35: ALLOW 10.0.1.50 -> 172.16.5.10:443',
        whatIsHappening: 'Permit rule inserted above deny rule. Packets flow successfully; TCP handshake completes.',
        interviewTakeaway: 'Systematic root-cause remediation restores connectivity safely.'
      }
    ]
  },

  // 17. What is network segmentation, and why is it important for security?
  {
    id: 17,
    categoryId: 'segmentation',
    category: 'Network Segmentation & DMZ',
    title: 'What is network segmentation, and why is it important for security?',
    subtitle: 'Explore multi-tier architecture, DMZs, VLAN isolation, and stopping lateral movement.',
    visualType: 'network-segmentation',
    elevatorPitch:
      'Network segmentation is the practice of dividing a flat network into smaller, isolated subnets or security zones (e.g., DMZ, Corporate Users, Application Tier, Database Tier, PCI/Cardholder zone) separated by firewalls and access controls. It limits the blast radius of security breaches, prevents lateral attacker movement, reduces compliance scope (e.g., PCI-DSS, HIPAA), and enforces the Principle of Least Privilege.',
    deepDive: [
      '**Blast Radius Containment:** In a flat network, compromising one user laptop allows the attacker to port-scan and compromise domain controllers and databases. In a segmented network, firewall rules prevent user VLANs from directly reaching database ports (e.g., 3306/1521).',
      '**DMZ (Demilitarized Zone):** A buffer zone hosting public-facing services (Web, Reverse Proxy). Even if a web server is hacked, firewall rules prevent the DMZ from initiating inbound connections into the internal database zone.',
      '**Micro-segmentation:** Modern software-defined networking (SDN / Zero Trust) enforces granular East-West firewall policies between individual workloads within the same VLAN.',
      '**Compliance Isolation:** Isolating credit card processing systems into a dedicated PCI VLAN dramatically reduces the scope, complexity, and cost of PCI-DSS compliance audits.'
    ],
    realWorldScenario:
      'In the infamous Target breach, attackers gained entry via HVAC vendor credentials on a flat network and moved laterally into point-of-sale (POS) systems. Proper network segmentation isolating the vendor network from the POS payment zone would have stopped the attack entirely.',
    commonTrap:
      'Make sure to mention that VLANs alone are NOT security boundaries. A VLAN only separates broadcast domains; an attacker can hop VLANs if routing/firewall ACLs are not strictly enforced between them.',
    cliSnippets: [
      {
        label: 'Multi-Zone Firewall Policy Architecture',
        code: 'Zone UNTRUST (Internet) -> Zone DMZ (Web Proxy) : ALLOW 443\nZone DMZ (Web Proxy) -> Zone APP_TIER : ALLOW 8080\nZone APP_TIER -> Zone DB_TIER : ALLOW 5432 (Postgres)\nZone UNTRUST -> Zone DB_TIER : BLOCKED (Implicit Deny)'
      }
    ],
    keyTakeaways: [
      'Divides flat networks into isolated trust zones (DMZ, App, DB, Users).',
      'Restricts attacker blast radius and stops lateral malware propagation.',
      'Enforces multi-tier security (Internet -> DMZ -> App -> DB).',
      'Reduces compliance scope for PCI-DSS, HIPAA, and SOC 2.'
    ],
    quiz: {
      question: 'Why should a database server NEVER be placed directly in the DMZ alongside the public web server?',
      options: [
        'Because database servers do not support TCP/IP networking.',
        'Because if the web server is compromised via a web exploit, the attacker would have direct local access to the database server.',
        'Because DMZ switches cannot handle database query bandwidth.',
        'Because databases require public IP addresses.'
      ],
      correctIndex: 1,
      explanation: 'Placing the database in a separate internal tier behind an internal firewall ensures that even if the public web server in the DMZ is compromised, the attacker cannot freely access the raw database without traversing an additional layer of firewall controls.'
    },
    steps: [
      {
        id: 1,
        label: '1. Flat Network: Malware Infection on Workstation',
        badge: 'Flat Network Phase',
        activeNodes: ['zone-workstation'],
        packetInfo: { srcIp: '192.168.1.15', dstIp: '192.168.1.99', dstPort: 445, protocol: 'TCP', payloadSummary: 'Lateral SMB EternalBlue Exploit' },
        whatIsHappening: 'An employee workstation on a flat unsegmented network opens a phishing attachment and gets infected with ransomware.',
        interviewTakeaway: 'Flat networks have zero internal barriers; all devices share the same broadcast and trust domain.'
      },
      {
        id: 2,
        label: '2. Flat Network: Direct Database Compromise (No Firewall)',
        badge: 'Lateral Spread',
        activeNodes: ['zone-workstation', 'zone-db'],
        packetInfo: { srcIp: '192.168.1.15', dstIp: '192.168.1.99', dstPort: 445, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'The ransomware scans the flat subnet and pivots laterally straight into the core financial database server without encountering any firewall!',
        interviewTakeaway: 'Without segmentation, single-endpoint compromise leads directly to full enterprise data breach.'
      },
      {
        id: 3,
        label: '3. Segmented: Perimeter Ingress to DMZ Reverse Proxy',
        badge: 'DMZ Tier',
        activeNodes: ['zone-internet', 'zone-dmz'],
        packetInfo: { srcIp: '198.51.100.22', dstIp: '172.16.1.10', dstPort: 443, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'Now examine a segmented 3-tier architecture. External web traffic terminates at the DMZ Reverse Proxy on HTTPS port 443 only.',
        interviewTakeaway: 'Public internet traffic terminates exclusively inside the DMZ buffer zone.'
      },
      {
        id: 4,
        label: '4. Segmented: DMZ to Application Cluster (Port 8080)',
        badge: 'App Tier',
        activeNodes: ['zone-dmz', 'zone-app'],
        packetInfo: { srcIp: '172.16.1.10', dstIp: '10.0.2.20', dstPort: 8080, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'The DMZ reverse proxy sanitizes requests and forwards them across an internal firewall to the Application Tier on port 8080 only.',
        interviewTakeaway: 'Inter-tier firewall enforces strict port restrictions between DMZ and internal applications.'
      },
      {
        id: 5,
        label: '5. Segmented: App Tier Queries Database Tier (Port 5432)',
        badge: 'DB Tier',
        activeNodes: ['zone-app', 'zone-db'],
        packetInfo: { srcIp: '10.0.2.20', dstIp: '10.0.3.50', dstPort: 5432, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'The backend application queries the isolated database on PostgreSQL port 5432. Direct access from the Internet or DMZ is completely prohibited.',
        interviewTakeaway: 'Database layer is physically and logically separated from untrusted tiers.'
      },
      {
        id: 6,
        label: '6. Segmented: Lateral Movement Pivot BLOCKED ✕',
        badge: 'Blast Radius Contained',
        activeNodes: ['zone-dmz', 'zone-db'],
        packetInfo: { srcIp: '172.16.1.10', dstIp: '10.0.3.50', dstPort: 5432, protocol: 'TCP' },
        decision: 'DENY',
        ruleMatched: 'Rule: DENY DMZ -> DB_VLAN (Implicit Deny)',
        whatIsHappening: 'If an attacker compromises the DMZ web proxy and attempts direct database extraction, the Inter-VLAN Firewall DROPS the packet immediately!',
        interviewTakeaway: 'Segmentation contains breaches to their initial zone, protecting core enterprise databases.'
      }
    ]
  },

  // 18. What is a VPN, and what is the difference between site-to-site and remote-access VPNs?
  {
    id: 18,
    categoryId: 'vpn-ipsec',
    category: 'VPN & IPsec Security',
    title: 'What is a VPN, and what is the difference between site-to-site and remote-access VPNs?',
    subtitle: 'Compare router-to-router encrypted site links vs user client-to-gateway remote tunnels.',
    visualType: 'vpn-architectures',
    elevatorPitch:
      'A VPN (Virtual Private Network) creates an encrypted, authenticated tunnel over an untrusted public network (like the Internet) to securely transmit private corporate data. A Site-to-Site VPN connects two fixed physical network locations (e.g., Head Office to Branch Office) via gateway routers without requiring software on client devices. A Remote-Access VPN connects individual remote employees (via client software like Cisco AnyConnect or GlobalProtect) to the corporate network.',
    deepDive: [
      '**Site-to-Site VPN (Gateway-to-Gateway):** Routers/Firewalls at each site encrypt and encapsulate all inter-office traffic. End hosts on both sides communicate transparently without knowing encryption is occurring.',
      '**Remote-Access VPN (Client-to-Gateway):** Remote workers run software agents that establish an SSL/TLS or IPsec tunnel to a corporate VPN Concentrator / Firewall. The worker receives an internal corporate IP address.',
      '**Full Tunnel vs Split Tunnel:** Full Tunnel routes 100% of the employee\'s traffic (including Netflix and personal browsing) through corporate firewalls. Split Tunnel only routes corporate subnet traffic through the VPN, allowing direct Internet access for public browsing.',
      '**Security Core:** Enforces Confidentiality (Encryption via AES), Integrity (HMAC SHA-256), and Authentication (Certificates / Pre-Shared Keys / MFA).'
    ],
    realWorldScenario:
      'During pandemic work-from-home expansion, a company configured Split-Tunneling on Remote-Access VPNs to prevent video conferencing traffic (Zoom/Teams) from saturating corporate headquarters internet links.',
    commonTrap:
      'Be prepared to explain Split Tunneling trade-offs: Split tunneling saves company bandwidth, but creates a security risk because an infected home laptop connected directly to the Internet could act as a bridge into the corporate network.',
    cliSnippets: [
      {
        label: 'Cisco Site-to-Site IPsec Crypto Map Profile',
        code: 'crypto ipsec transform-set ESP-AES-SHA esp-aes 256 esp-sha256-hmac\ncrypto map VPN-MAP 10 ipsec-isakmp\n set peer 203.0.113.50\n set transform-set ESP-AES-SHA\n match address VPN_TRAFFIC_ACL'
      }
    ],
    keyTakeaways: [
      'VPN provides Confidentiality, Integrity, and Authentication across the Internet.',
      'Site-to-Site connects two permanent locations via gateway firewalls.',
      'Remote-Access connects individual remote employees via client software.',
      'Split tunneling routes only internal traffic; Full tunnel routes all traffic.'
    ],
    quiz: {
      question: 'What is the primary security risk of enabling Split Tunneling on a Remote-Access VPN?',
      options: [
        'It doubles encryption latency on corporate servers.',
        'The remote laptop has concurrent access to the insecure public Internet and internal corporate network, potentially serving as an unmonitored bridge.',
        'It requires dedicated fiber optic lines to each employee home.',
        'Split tunneling does not support AES-256 encryption.'
      ],
      correctIndex: 1,
      explanation: 'With Split Tunneling, the client machine is connected to both the corporate network and the open Internet simultaneously. If the client gets infected via drive-by download, attackers can pivot into the corporate network through the open VPN tunnel.'
    },
    steps: [
      {
        id: 1,
        label: '1. Site-to-Site: Branch Host Sends Local Packet',
        badge: 'Site-to-Site Step 1',
        activeNodes: ['vpn-branch-host', 'vpn-branch-gw'],
        packetInfo: { srcIp: '10.1.0.15', dstIp: '10.2.0.80', dstPort: 445, protocol: 'TCP' },
        whatIsHappening: 'Workstation in Branch Office sends standard unencrypted SMB file request destined for HQ File Server 10.2.0.80.',
        interviewTakeaway: 'End users and applications need zero VPN software installed; the network handles encryption transparently.'
      },
      {
        id: 2,
        label: '2. Site-to-Site: Branch Gateway Encrypts via IPsec ESP',
        badge: 'Site-to-Site Step 2',
        activeNodes: ['vpn-branch-gw', 'vpn-hq-gw'],
        packetInfo: { srcIp: '203.0.113.10', dstIp: '198.51.100.50', protocol: 'ESP', isEncrypted: true, payloadSummary: 'IPsec ESP Encrypted Payload' },
        whatIsHappening: 'Branch gateway router matches traffic against crypto ACL, encapsulates original packet inside IPsec ESP, and tunnels across the public Internet.',
        interviewTakeaway: 'The public Internet only sees encrypted ESP packets traversing between the two public gateway IPs.'
      },
      {
        id: 3,
        label: '3. Site-to-Site: HQ Gateway Decrypts & Delivers to Server',
        badge: 'Site-to-Site Step 3',
        activeNodes: ['vpn-hq-gw', 'vpn-hq-server'],
        packetInfo: { srcIp: '10.1.0.15', dstIp: '10.2.0.80', dstPort: 445, protocol: 'TCP' },
        decision: 'ALLOW',
        whatIsHappening: 'HQ gateway decrypts the ESP packet, verifies HMAC integrity, and forwards original plaintext SMB packet to HQ Data Center Server.',
        interviewTakeaway: 'Data reaches destination securely and transparently across site boundaries.'
      },
      {
        id: 4,
        label: '4. Remote-Access: Employee Laptop Client Handshake',
        badge: 'Remote-Access Step 1',
        activeNodes: ['vpn-client-app', 'vpn-concentrator'],
        packetInfo: { srcIp: '192.168.1.100', dstIp: '203.0.113.1', dstPort: 443, protocol: 'TLS', isEncrypted: true },
        whatIsHappening: 'Remote employee at home opens VPN software (AnyConnect / GlobalProtect) and initiates an SSL/TLS or IPsec handshake with HQ VPN Concentrator.',
        interviewTakeaway: 'Remote-access uses software agents installed directly on the client machine.'
      },
      {
        id: 5,
        label: '5. Remote-Access: MFA Authentication & Virtual IP Lease',
        badge: 'Remote-Access Step 2',
        activeNodes: ['vpn-concentrator'],
        packetInfo: { srcIp: '192.168.1.100', dstIp: '203.0.113.1', dstPort: 443, protocol: 'TLS' },
        whatIsHappening: 'VPN Concentrator validates user credentials and MFA token, assigning virtual internal IP `10.50.0.12` to the remote laptop.',
        interviewTakeaway: 'Virtual IP assignment places the remote endpoint logically inside the corporate network perimeter.'
      },
      {
        id: 6,
        label: '6. Remote-Access: Encrypted Tunnel Data Flow to LAN',
        badge: 'Remote-Access Step 3',
        activeNodes: ['vpn-client-app', 'vpn-concentrator', 'vpn-hq-server'],
        packetInfo: { srcIp: '10.50.0.12', dstIp: '10.2.0.80', dstPort: 443, protocol: 'TLS', isEncrypted: true },
        decision: 'ALLOW',
        whatIsHappening: 'Remote employee sends encrypted packets through the virtual tunnel interface; Concentrator decrypts and delivers to internal corporate intranet.',
        interviewTakeaway: 'Enables secure work-from-anywhere connectivity with enterprise access controls.'
      }
    ]
  },

  // 19. What is IPsec, and how does an IPsec VPN protect network traffic?
  {
    id: 19,
    categoryId: 'vpn-ipsec',
    category: 'VPN & IPsec Security',
    title: 'What is IPsec, and how does an IPsec VPN protect network traffic?',
    subtitle: 'Inspect AH vs ESP, Tunnel vs Transport modes, and IKE Phase 1 / Phase 2 negotiations.',
    visualType: 'ipsec-encapsulation',
    elevatorPitch:
      'IPsec (Internet Protocol Security) is a suite of protocols operating at Layer 3 to provide secure communications over IP networks. It delivers Confidentiality (via ESP encryption), Integrity & Authentication (via HMAC SHA-256), and Anti-Replay protection (via sequence numbers). It operates in two modes: Tunnel Mode (encrypts entire original IP packet and adds a new IP header) and Transport Mode (encrypts only the IP payload while keeping original IP header).',
    deepDive: [
      '**Key Protocols:** 1) **ESP (Encapsulating Security Payload - Protocol 50):** Provides encryption, authentication, and integrity. 2) **AH (Authentication Header - Protocol 51):** Provides authentication and integrity only (no encryption; rarely used). 3) **IKE (Internet Key Exchange - UDP 500/4500):** Negotiates security associations and cryptographic keys.',
      '**IKE Phase 1 (ISAKMP SA):** Authenticates the two peers (PSK or Certificates) and builds a secure management channel (Main Mode or Aggressive Mode in IKEv1; single IKE_SA_INIT in IKEv2).',
      '**IKE Phase 2 (IPsec SA):** Negotiates encryption algorithms (AES-GCM/CBC), hashing (SHA-256), and establishes the unidirectional IPsec security associations (SAs) for user data.',
      '**Tunnel vs Transport Mode:** Tunnel mode is used for Gateway-to-Gateway VPNs (protecting entire private subnets). Transport mode is used for End-to-End host-to-host encryption.'
    ],
    realWorldScenario:
      'When traversing NAT gateways (PAT), IPsec ESP packets (IP Protocol 50 without port numbers) fail. The solution is NAT-Traversal (NAT-T), which encapsulates IPsec ESP packets inside UDP port 4500 so standard NAT routers can translate them.',
    commonTrap:
      'Always remember: AH does NOT provide confidentiality (encryption)! Only ESP provides encryption. Furthermore, AH breaks when traversing NAT because AH authenticates the outer IP header (which NAT modifies).',
    cliSnippets: [
      {
        label: 'Cisco IKEv2 / IPsec Verification Commands',
        code: 'show crypto ikev2 sa\nshow crypto ipsec sa\n# Check for pkts encaps, pkts encrypt, pkts decrypt, and drop counters'
      }
    ],
    keyTakeaways: [
      'ESP (Protocol 50) provides Encryption + Integrity; AH (Protocol 51) provides Integrity only.',
      'Tunnel Mode: Encapsulates entire original IP packet (Standard for VPNs).',
      'Transport Mode: Encapsulates payload only (Host-to-Host).',
      'IKE Phase 1 builds control channel; IKE Phase 2 builds data encryption SAs.'
    ],
    quiz: {
      question: 'Why does IPsec Authentication Header (AH) fail when packets traverse a NAT router?',
      options: [
        'AH does not support IPv4.',
        'AH includes the outer IP header in its integrity hash calculation; when NAT rewrites the IP address, the integrity check fails.',
        'AH requires UDP port 80.',
        'AH is only compatible with satellite links.'
      ],
      correctIndex: 1,
      explanation: 'AH calculates an integrity checksum covering the IP header itself. When a NAT router rewrites the source or destination IP, the receiving peer calculates a mismatching hash and drops the packet.'
    },
    steps: [
      {
        id: 1,
        label: 'Original IP Packet Header',
        badge: 'Unencrypted',
        activeNodes: ['ipsec-orig'],
        packetInfo: { srcIp: '10.0.1.10', dstIp: '10.0.2.20', dstPort: 80, protocol: 'TCP', payloadSummary: 'Confidential ERP Financial Data' },
        whatIsHappening: 'Internal host transmits plaintext packet destined for remote branch office.',
        interviewTakeaway: 'The original packet carries private internal IP addressing and unencrypted payload.'
      },
      {
        id: 2,
        label: 'IPsec Tunnel Mode Encapsulation',
        badge: 'ESP Wrapped',
        activeNodes: ['ipsec-encap'],
        packetInfo: { srcIp: '203.0.113.1', dstIp: '198.51.100.2', protocol: 'ESP', isEncrypted: true, payloadSummary: '[New IP Header] + [ESP Header] + [Encrypted Original Packet] + [ESP Auth]' },
        whatIsHappening: 'Gateway encrypts original packet with AES-256, appends ESP header/trailer, and attaches a new public IP header.',
        interviewTakeaway: 'Original IP header and payload are hidden inside the encrypted ESP payload.'
      },
      {
        id: 3,
        label: 'Decapsulation at Remote Gateway',
        badge: 'Decrypted',
        activeNodes: ['ipsec-decap'],
        packetInfo: { srcIp: '10.0.1.10', dstIp: '10.0.2.20', dstPort: 80, protocol: 'TCP', payloadSummary: 'Confidential ERP Financial Data' },
        whatIsHappening: 'Remote gateway validates HMAC integrity, strips ESP wrapper, decrypts payload, and delivers original packet to destination.',
        interviewTakeaway: 'Integrity verified and data delivered securely.'
      }
    ]
  },

  // 20. What is TLS, and how does the TLS handshake establish a secure connection?
  {
    id: 20,
    categoryId: 'tls',
    category: 'TLS & Cryptographic Handshakes',
    title: 'What is TLS, and how does the TLS handshake establish a secure connection?',
    subtitle: 'Walk through the cryptographic steps of modern TLS 1.3 and TLS 1.2 handshakes.',
    visualType: 'tls-handshake',
    elevatorPitch:
      'TLS (Transport Layer Security) is the cryptographic protocol that secures Internet communications (HTTPS, SMTPS, FTPS) over TCP. The TLS handshake authenticates the server (via X.509 digital certificates signed by a trusted Certificate Authority), establishes a shared secret using asymmetric cryptography (Elliptic Curve Diffie-Hellman Ephemeral / ECDHE), and transitions to fast symmetric encryption (AES-GCM or ChaCha20-Poly1305) for application data transfer.',
    deepDive: [
      '**TLS 1.2 vs TLS 1.3:** TLS 1.2 required 2 full round-trips (2-RTT) for the handshake. Modern TLS 1.3 completes the handshake in a single round-trip (1-RTT) by sending the client Diffie-Hellman key share in the very first `ClientHello` message.',
      '**Zero Round-Trip Resumption (0-RTT):** In TLS 1.3, returning clients can send encrypted application data in their initial message using previously negotiated session tickets.',
      '**Cipher Suites:** Modern cipher suites look like `TLS_AES_256_GCM_SHA384` (specifying symmetric cipher AES-256-GCM and hash algorithm SHA-384).',
      '**Forward Secrecy (PFS):** Ensured by Ephemeral Diffie-Hellman (ECDHE). Even if the server’s long-term private key is stolen in the future, past recorded encrypted sessions cannot be decrypted.'
    ],
    realWorldScenario:
      'A web application was flagged during a penetration test because it supported legacy SSLv3 and TLS 1.0 (vulnerable to POODLE and BEAST attacks). The engineering team disabled TLS 1.0/1.1 and enforced TLS 1.2 and TLS 1.3 with Perfect Forward Secrecy cipher suites.',
    commonTrap:
      'Interviewers will test if you know why we switch from asymmetric to symmetric encryption. Asymmetric encryption (RSA/ECDH) is computationally expensive; it is used ONLY during the handshake to establish a shared session key. High-speed symmetric encryption (AES-GCM) encrypts the actual data stream.',
    cliSnippets: [
      {
        label: 'OpenSSL Handshake Verification Command',
        code: 'openssl s_client -connect example.com:443 -tls1_3'
      },
      {
        label: 'Nginx TLS Hardening Config',
        code: 'ssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;\nssl_prefer_server_ciphers on;'
      }
    ],
    keyTakeaways: [
      'Authenticates server identity via CA-signed X.509 digital certificates.',
      'Uses asymmetric cryptography (ECDHE) to securely agree on a shared secret.',
      'Switches to high-speed symmetric encryption (AES-GCM) for application data.',
      'TLS 1.3 achieves 1-RTT handshake speed and enforces Perfect Forward Secrecy.'
    ],
    quiz: {
      question: 'Why does TLS use asymmetric encryption during the handshake and symmetric encryption for data transfer?',
      options: [
        'Symmetric encryption cannot encrypt text; only asymmetric can.',
        'Asymmetric encryption securely exchanges keys without prior secrets, but is computationally slow; symmetric encryption is fast and efficient for bulk data transfer.',
        'TLS only uses asymmetric encryption for all traffic.',
        'Symmetric encryption is only supported on Linux servers.'
      ],
      correctIndex: 1,
      explanation: 'Asymmetric cryptography solves the key distribution problem over an insecure channel, but is hundreds of times slower than symmetric ciphers. TLS uses asymmetric algorithms (ECDHE) to establish a session key, then switches to fast hardware-accelerated symmetric encryption (AES-GCM).'
    },
    steps: [
      {
        id: 1,
        label: '1. Client Hello + Key Share',
        badge: 'ClientHello',
        activeNodes: ['tls-client', 'tls-server'],
        packetInfo: { srcIp: 'Client', dstIp: 'Server', dstPort: 443, protocol: 'TLS', payloadSummary: 'TLS 1.3, Supported Ciphers, ECDHE Key Share (Client Public Key)' },
        whatIsHappening: 'Client sends TLS version, supported cipher suites, random nonce, and its ephemeral Diffie-Hellman public key share.',
        interviewTakeaway: 'TLS 1.3 combines key exchange guessing in Step 1, cutting handshake latency in half (1-RTT).'
      },
      {
        id: 2,
        label: '2. Server Hello + Certificate + Key Share',
        badge: 'ServerHello',
        activeNodes: ['tls-server', 'tls-client'],
        packetInfo: { srcIp: 'Server', dstIp: 'Client', dstPort: 443, protocol: 'TLS', payloadSummary: 'Server Key Share, X.509 CA Certificate, Encrypted Extensions' },
        whatIsHappening: 'Server selects cipher suite (e.g., TLS_AES_256_GCM_SHA384), sends its public key share and digital certificate.',
        interviewTakeaway: 'Client verifies the server certificate against trusted root Certificate Authorities (CAs).'
      },
      {
        id: 3,
        label: '3. Shared Symmetric Key Computed',
        badge: 'Key Derivation',
        activeNodes: ['tls-client', 'tls-server'],
        whatIsHappening: 'Both client and server use Diffie-Hellman math to compute the exact same Master Secret Key independently without ever transmitting it over the wire.',
        interviewTakeaway: 'Diffie-Hellman enables two parties to derive a shared secret over a public wire without eavesdroppers learning the key.'
      },
      {
        id: 4,
        label: '4. Encrypted Application Data Transfer',
        badge: 'AES-GCM Encrypted',
        activeNodes: ['tls-client', 'tls-server'],
        packetInfo: { srcIp: 'Client', dstIp: 'Server', dstPort: 443, protocol: 'TLS', isEncrypted: true, payloadSummary: 'Encrypted HTTP/2 / HTTP/3 Traffic (AES-256-GCM)' },
        decision: 'ALLOW',
        whatIsHappening: 'Handshake complete! High-speed symmetric AES-256-GCM encryption secures all subsequent web traffic.',
        interviewTakeaway: 'Application data enjoys full Confidentiality, Integrity, and Forward Secrecy.'
      }
    ]
  }
];
