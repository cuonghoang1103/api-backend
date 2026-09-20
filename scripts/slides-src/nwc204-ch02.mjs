/**
 * nwc204-ch02.mjs — NWC204 Chapter 2: Basic Switch and End Device Configuration
 * (FLM buổi 3–6, Cisco Module 2 + Lab 1.1).
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng tiếng Việt nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 3, 4, 5, 6.
 *   buổi 3: 2.1 Cisco IOS Access · 2.2 IOS Navigation · 2.3 The Command Structure · 2.4 Basic Device Configuration
 *   buổi 4: 2.5 Save Configurations · 2.6 Ports and Addresses · 2.7 Configure IP Addressing · 2.8 Verify Connectivity · 2.9 AI Tools
 *   buổi 5–6: Lab 1.1 — Navigate the IOS by Using Tera Term for Console Connectivity ·
 *             Basic Switch and End Device Configuration · Use AI Tools for Configuration and Troubleshooting
 * ⚠️ Ít nhất 60% slide phải là SƠ ĐỒ / BẢNG / kết xuất thật — người học nói thẳng
 *    là slide toàn chữ thì "học rất chán + không hiểu lắm".
 */
import { CSS, stack, pkt, topo, flow, term, code, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch02',
  code: 'NWC204',
  title: 'Ch.2 — Basic Switch and End Device Configuration',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

export const slides = [
  {
    kind: 'cover',
    t: 'Basic Switch and End Device Configuration',
    sub: 'Chapter 2 — Cisco Module 2 + Lab 1.1',
    body: `<div class="cov-meta">Sessions 3–6 of 60 · CLO2, CLO3, CLO9<br>
      IOS access · IOS navigation · command structure · device configuration<br>
      Save configurations · ports and addresses · configure IP · verify connectivity<br>
      Lab 1.1 — Tera Term console, switch and end device, AI-assisted troubleshooting</div>`,
  },

  {
    t: 'A switch out of the box already works — so why configure it?',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|192.168.1.10',
        'lk:Fa0/1',
        'nd:Switch S1|no IP, no password',
        'lk:Fa0/2',
        'nd.cl:PC-B|192.168.1.20',
      ])}
      ${kv([
        ['Works with zero configuration', 'the two PCs can already ping each other — a switch forwards frames by default'],
        ['But you cannot reach the switch', 'no IP address means no SSH, no Telnet, no management at all'],
        ['And anyone who can plug in', 'gets full control through the console port — no password is set'],
        ['And nothing is named', 'twelve identical prompts saying <span class="nw-m">Switch&gt;</span> is how people configure the wrong device'],
      ])}
      <div class="box">Configuration is not what makes a switch forward. It is what makes
      the switch <b>manageable, identifiable and safe</b>.</div>`,
  },

  {
    t: 'Three ways into a Cisco device',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">Console — needs no network</div>
          ${topo(['nd.cl:Laptop|Tera Term', 'lk:rollover<br>cable', 'nd:S1|console port'])}
        </div>
        <div><div class="nh">SSH or Telnet — needs a network</div>
          ${topo(['nd.cl:Laptop|ssh / telnet', 'lk:IP network<br>TCP 22 / 23', 'nd:S1|SVI has an IP'])}
        </div>
      </div>
      <table class="t">
        <tr><th>Access</th><th>Device needs an IP?</th><th>Port</th><th>Encrypted?</th><th>Use it when</th></tr>
        <tr><td class="hl"><b>Console</b></td><td class="hl">No</td><td>—</td><td>n/a — physical</td><td class="hl">First-ever setup, or the network is broken</td></tr>
        <tr><td><b>SSH</b></td><td>Yes</td><td>TCP 22</td><td>Yes</td><td>Everyday remote administration</td></tr>
        <tr><td><b>Telnet</b></td><td>Yes</td><td>TCP 23</td><td class="hl">No — plaintext</td><td>Practically never; lab only</td></tr>
      </table>`,
  },

  {
    t: 'The console connection, in detail',
    body: `${CSS}
      ${kv([
        ['Cable', 'light-blue <b>rollover</b> cable (RJ-45 both ends) into a DB-9 serial adapter, or a USB console cable'],
        ['On the laptop', 'the adapter appears as a COM port (Windows) or <span class="nw-m">/dev/tty.usbserial*</span> (macOS, Linux)'],
        ['Terminal software', 'Tera Term, PuTTY, or <span class="nw-m">screen</span>'],
        ['Settings — memorise these', '<b>9600</b> baud · <b>8</b> data bits · <b>no</b> parity · <b>1</b> stop bit · <b>no</b> flow control'],
      ])}
      ${term(`<span class="c"># macOS / Linux — same console session, no extra software</span>
<span class="p">$</span> ls /dev/tty.usb*
/dev/tty.usbserial-0001
<span class="p">$</span> <span class="k">screen</span> /dev/tty.usbserial-0001 9600
<span class="c"># blank screen? press Enter once — the switch only echoes when it has something to say</span>
Switch&gt;
<span class="c"># leave the session with: Ctrl-A then k</span>`, 'sm')}
      <div class="box warn">Wrong baud rate gives <b>garbage characters</b>, not an error.
      A silent black screen usually means the cable is fine and you simply have not
      pressed Enter.</div>`,
  },

  {
    t: 'SSH and Telnet, as seen on the wire',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">Telnet — TCP 23</div>
          ${flow('Admin PC', 'Switch S1', [
            ['r', 'Username: admin', 'sent as readable text'],
            ['r', 'Password: Cisco123', 'readable in Wireshark'],
          ])}
        </div>
        <div><div class="nh">SSH — TCP 22</div>
          ${flow('Admin PC', 'Switch S1', [
            ['r', 'key exchange', 'session key agreed first'],
            ['r', '9f3a c41e 77b0 …', 'password unreadable'],
          ])}
        </div>
      </div>
      <div class="box warn">Telnet does not "hide" the password — it never encrypts
      anything. Anyone on a shared segment, or on a mirrored switch port, reads it.
      <b>Configure SSH and then remove Telnet</b>, do not merely prefer SSH.</div>
      ${term(`<span class="p">S1(config)#</span> <span class="k">line</span> vty 0 15
<span class="p">S1(config-line)#</span> <span class="k">transport input ssh</span>   <span class="c"># SSH only: Telnet is now refused</span>`, 'sm')}`,
  },

  {
    t: 'The IOS mode tree — position decides permission',
    body: `${CSS}
      ${stack([
        ['&gt;', 'User EXEC — Switch&gt;', 'Look, do not touch. ping, telnet, some show. No configuration.', true],
        ['#', 'Privileged EXEC — Switch#', 'All show commands, copy, reload, debug. Still no configuration.'],
        ['cfg', 'Global config — Switch(config)#', 'Changes that affect the whole device: hostname, secret, banner.'],
        ['line', 'Line config — Switch(config-line)#', 'One access line at a time: console 0, vty 0 15.'],
        ['if', 'Interface config — Switch(config-if)#', 'One interface at a time: Vlan1, Fa0/1, Gi0/1.'],
      ])}
      ${kv([
        ['Going down', '<span class="nw-m">enable</span> → <span class="nw-m">configure terminal</span> → <span class="nw-m">line console 0</span> / <span class="nw-m">interface vlan 1</span>'],
        ['Going up one step', '<span class="nw-m">exit</span>'],
        ['Jumping straight to <b>#</b>', '<span class="nw-m">end</span> or <span class="nw-m">Ctrl-Z</span>'],
        ['Leaving privileged mode', '<span class="nw-m">disable</span> back to <b>&gt;</b>, <span class="nw-m">exit</span> to log out'],
      ])}`,
  },

  {
    t: 'The prompt is your position indicator — read it every time',
    body: `${CSS}
      ${term(`<span class="p">Switch&gt;</span>                              <span class="c"># user EXEC — can look, cannot change</span>
<span class="p">Switch&gt;</span> <span class="k">enable</span>
<span class="p">Switch#</span>                              <span class="c"># privileged EXEC — the # is the power</span>
<span class="p">Switch#</span> <span class="k">configure terminal</span>
<span class="p">Switch(config)#</span> <span class="k">hostname</span> S1
<span class="p">S1(config)#</span>                          <span class="c"># hostname applies the instant you press Enter</span>
<span class="p">S1(config)#</span> <span class="k">line console</span> 0
<span class="p">S1(config-line)#</span>                     <span class="c"># now inside ONE line, not the whole device</span>
<span class="p">S1(config-line)#</span> <span class="k">exit</span>
<span class="p">S1(config)#</span> <span class="k">interface vlan</span> 1
<span class="p">S1(config-if)#</span>                       <span class="c"># now inside ONE interface</span>
<span class="p">S1(config-if)#</span> <span class="k">end</span>
<span class="p">S1#</span>                                  <span class="c"># end jumps all the way out, exit would go one step</span>`, 'sm')}
      <div class="box warn">Getting lost here is the single most common beginner failure.
      Symptom: <span class="nw-m">% Invalid input detected</span> on a command that is
      spelled correctly — you are simply in the wrong mode.</div>`,
  },

  {
    t: 'Getting back out — exit, end, Ctrl-Z, and what each really does',
    body: `${CSS}
      <table class="t big2">
        <tr><th>You type</th><th>From (config-if)# you land in</th><th>Use it for</th></tr>
        <tr><td><b>exit</b></td><td><span class="nw-m">(config)#</span> — one level up</td><td>Finishing one interface, starting the next</td></tr>
        <tr><td class="hl"><b>end</b></td><td class="hl"><span class="nw-m">#</span> — privileged EXEC</td><td>Done configuring; now run show commands</td></tr>
        <tr><td><b>Ctrl-Z</b></td><td><span class="nw-m">#</span> — same as end</td><td>The same thing, one keystroke</td></tr>
        <tr><td><b>Ctrl-C</b></td><td>Stays put, abandons the line you were typing</td><td>Escaping a half-typed command</td></tr>
      </table>
      <div class="box">In user or privileged EXEC, <span class="nw-m">exit</span> means
      <b>log out</b> — not "go up". On a console session that simply returns you to
      <span class="nw-m">Switch&gt;</span>; over SSH it closes the connection.</div>`,
  },

  {
    t: '2.3 — Anatomy of one IOS command',
    body: `${CSS}
      ${pkt([
        ['S1(config-if)#', 'prompt — the mode', '', 1.5],
        ['ip', 'keyword', 'hl', 0.6],
        ['address', 'keyword', 'hl', 1],
        ['192.168.1.2', 'argument — value you choose', 'pay', 1.5],
        ['255.255.255.0', 'argument — value you choose', 'pay', 1.7],
      ])}
      ${kv([
        ['Keyword', 'a fixed word IOS defines. You cannot invent it, and it may be abbreviated.'],
        ['Argument', 'a value you supply. IOS cannot guess it and will not abbreviate it.'],
        ['<b>boldface</b> in documentation', 'type it exactly as shown'],
        ['<i>italics</i> in documentation', 'replace it with your own value'],
        ['[x] / {a | b} / [x {a | b}]', 'optional / required choice / optional choice'],
      ])}
      <p class="note">This is why <span class="nw-m">ip addr 192.168.1.2</span> fails two
      ways at once: the mask argument is missing, and IOS accepts <span class="nw-m">ip
      add</span> only while it is still unambiguous.</p>`,
  },

  {
    t: 'The help that is already inside the device',
    body: `${CSS}
      ${term(`<span class="p">S1#</span> <span class="k">?</span>                       <span class="c"># every command available in THIS mode</span>
<span class="p">S1#</span> <span class="k">sh?</span>
show                                <span class="c"># which commands begin with "sh"</span>
<span class="p">S1#</span> <span class="k">show ?</span>                  <span class="c"># what may follow "show" — note the space before ?</span>
<span class="p">S1#</span> <span class="k">show ip int</span>&lt;Tab&gt;
<span class="p">S1#</span> <span class="k">show ip interface</span>       <span class="c"># Tab completes an unambiguous word</span>

<span class="p">S1#</span> <span class="k">co</span>
<span class="r">% Ambiguous command: "co"</span>       <span class="c"># copy? configure? — add letters</span>
<span class="p">S1#</span> <span class="k">clock set</span>
<span class="r">% Incomplete command.</span>            <span class="c"># right command, missing arguments</span>
<span class="p">S1#</span> <span class="k">shiw run</span>
<span class="r">% Invalid input detected at '^' marker.</span>  <span class="c"># the ^ points at the first bad character</span>`, 'sm')}
      <div class="box ok">Three different errors, three different meanings:
      <b>Ambiguous</b> = too short · <b>Incomplete</b> = missing an argument ·
      <b>Invalid input</b> = wrong word, wrong mode, or a typo. Read which one you got
      before you retype anything.</div>`,
  },

  {
    t: 'Hot keys worth memorising before the Practical Exam',
    body: `${CSS}
      <table class="t">
        <tr><th>Keys</th><th>What it does</th><th>Why it saves you</th></tr>
        <tr><td><b>Tab</b></td><td>Complete the current word</td><td>No typos in long keywords</td></tr>
        <tr><td><b>Up arrow</b> / Ctrl-P</td><td>Previous command</td><td>Re-run a show after a change</td></tr>
        <tr><td><b>Ctrl-A</b> / Ctrl-E</td><td>Start / end of line</td><td>Fixing a long line</td></tr>
        <tr><td><b>Ctrl-W</b> / Ctrl-U</td><td>Delete word / whole line</td><td>Faster than 40 backspaces</td></tr>
        <tr><td class="hl"><b>Ctrl-Shift-6</b></td><td class="hl">Abort a running ping</td><td>A long ping will not stop</td></tr>
        <tr><td><b>Space</b> / Enter</td><td>At <span class="nw-m">--More--</span>: page / line</td><td><span class="nw-m">show run</span> is long</td></tr>
      </table>`,
  },

  {
    t: '2.4 — The first three commands on any new device',
    body: `${CSS}
      ${code(`enable                      # user EXEC -> privileged EXEC
configure terminal          # privileged EXEC -> global config
hostname S1                 # name it NOW, before anything else
no ip domain-lookup         # stop IOS treating a typo as a DNS name to resolve
end                         # back to S1#`, 'bash')}
      <div class="box">Why <span class="nw-m">hostname</span> first: every later command,
      every screenshot and every log line carries that name. Configuring the wrong
      device is a real accident, and it happens on prompts that all say
      <span class="nw-m">Switch&gt;</span>.</div>
      <div class="box warn">Without <span class="nw-m">no ip domain-lookup</span>, a typo
      such as <span class="nw-m">shwo</span> makes IOS try to resolve it as a hostname
      and <b>freezes your session for several seconds</b>. Beginners assume the switch
      has crashed. It has not — press Ctrl-Shift-6.</div>`,
  },

  {
    t: 'Which password guards which door',
    body: `${CSS}
      ${topo([
        'nd.cl:Console cable|line console 0',
        'lk:password<br>console',
        'nd:User EXEC &gt;|the front door',
        'lk:enable<br>secret',
        'nd.rt:Privileged #|full control',
      ])}
      ${topo([
        'nd.cl:SSH client|line vty 0 15',
        'lk:password<br>vty + login',
        'nd:User EXEC &gt;|the same front door',
      ])}
      ${kv([
        ['line console 0 → password', 'guards the physical console only'],
        ['line vty 0 15 → password', 'guards remote sessions only'],
        ['<b>enable secret</b>', 'guards <b>privileged EXEC</b> — every door leads here, so this is the one that matters'],
        ['service password-encryption', 'hides the two plaintext passwords above from a shoulder glance — weak type 7, reversible'],
      ])}
      <div class="box warn">Set a console password but forget
      <span class="nw-m">enable secret</span>, and anybody who gets past the front door
      owns the device. <b>enable secret is not optional.</b></div>`,
  },

  {
    t: 'The whole hardening block, from enable',
    body: `${CSS}
      ${code(`enable
configure terminal
hostname S1
enable secret Cl4ss!2026          # privileged EXEC password, hashed. NOT "enable password"
line console 0                    # the physical console line
 password C0nsole!2026
 login                            # ask for it - without this the password is never used
 exec-timeout 5 0                 # log an idle console session out after 5 minutes
 exit
line vty 0 15                     # the 16 remote sessions
 password Vty!2026
 login
 transport input ssh              # SSH only, refuse Telnet
 exit
service password-encryption       # hide the two plaintext passwords in the config file
banner motd ^Authorised access only. Sessions are logged.^
end
copy running-config startup-config   # NOTHING above survives a reload until this runs`, 'bash', 'sm')}`,
  },

  {
    t: '2.5 — running-config vs startup-config',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">running-config — in RAM</div>
          ${kv([
            ['Lives in', 'RAM — volatile'],
            ['Changes', 'the instant you press Enter'],
            ['Read it with', '<span class="nw-m">show running-config</span>'],
            ['After a power cut', '<b>gone</b>'],
          ])}
        </div>
        <div><div class="nh">startup-config — in NVRAM</div>
          ${kv([
            ['Lives in', 'NVRAM — survives power loss'],
            ['Changes', 'only when you copy to it'],
            ['Read it with', '<span class="nw-m">show startup-config</span>'],
            ['After a reload', '<b>this</b> is loaded into RAM'],
          ])}
        </div>
      </div>
      ${flow('running-config (RAM)', 'startup-config (NVRAM)', [
        ['r', 'copy running-config startup-config', 'save — now it survives'],
        ['l', 'reload', 'boot copies NVRAM back into RAM'],
      ])}
      <div class="box warn">Forget the copy and your two hours of work disappear at the
      next power cut, with <b>no error message at any point</b>. The switch simply comes
      back as <span class="nw-m">Switch&gt;</span>.</div>`,
  },

  {
    t: 'Saving, discarding, and starting over',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><div><b>Save</b> — <span class="nw-m">copy running-config startup-config</span> (or <span class="nw-m">write memory</span>). Answer the filename prompt with Enter.</div></div>
        <div><span class="n">2</span><div><b>Throw away unsaved changes</b> — <span class="nw-m">reload</span> and answer <i>no</i> when asked to save. RAM is refilled from NVRAM.</div></div>
        <div><span class="n">3</span><div><b>Factory-fresh</b> — <span class="nw-m">erase startup-config</span> then <span class="nw-m">reload</span>. NVRAM is emptied first, so nothing comes back.</div></div>
        <div><span class="n">4</span><div><b>Keep a copy off the device</b> — <span class="nw-m">show running-config</span>, capture the terminal log to a text file, or <span class="nw-m">copy running-config tftp:</span>.</div></div>
      </div>
      <table class="t">
        <tr><th>Goal</th><th>Command</th><th>Danger</th></tr>
        <tr><td>Save</td><td><span class="nw-m">copy run start</span></td><td>None</td></tr>
        <tr><td>Undo everything unsaved</td><td><span class="nw-m">reload</span>, say <i>no</i></td><td class="hl">Also drops every session — the link goes down for a minute</td></tr>
        <tr><td>Wipe the device</td><td><span class="nw-m">erase startup-config</span></td><td class="hl">Irreversible unless you saved a text copy first</td></tr>
      </table>`,
  },

  {
    t: '2.6 — What an end device needs before it can talk',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Setting</th><th>Example</th><th>What breaks without it</th></tr>
        <tr><td><b>IP address</b></td><td>192.168.1.10</td><td>Nothing can reach you</td></tr>
        <tr><td><b>Subnet mask</b></td><td>255.255.255.0 (/24)</td><td>Cannot tell local from remote</td></tr>
        <tr><td class="hl"><b>Default gateway</b></td><td class="hl">192.168.1.1</td><td class="hl">Off-network traffic fails</td></tr>
        <tr><td><b>DNS server</b></td><td>1.1.1.1</td><td>Names do not resolve</td></tr>
      </table>
      <div class="box warn">Only the gateway row produces the classic complaint
      <i>"the internet is down"</i>: the LAN still works perfectly, so users blame the
      ISP while the fault is one missing line on their own machine.</div>
      <div class="box"><b>Static</b> = you type all four (servers, routers, switch
      management). <b>DHCP</b> = a server hands out all four (user PCs, phones).</div>`,
  },

  {
    t: 'Why a switch needs an IP address at all',
    body: `${CSS}
      ${topo([
        'nd.cl:Admin PC|192.168.1.10',
        'lk:Fa0/1<br>data frames',
        'nd:Switch S1|SVI Vlan1<br>192.168.1.2',
        'lk:Fa0/2<br>data frames',
        'nd.cl:PC-B|192.168.1.20',
      ])}
      ${kv([
        ['Forwarding frames', 'needs <b>no</b> IP — the switch reads MAC addresses only'],
        ['Being managed', 'needs an IP — SSH, Telnet, SNMP and syslog are all IP traffic'],
        ['Where that IP lives', 'on a <b>switch virtual interface</b> (SVI), normally <span class="nw-m">interface vlan 1</span> — not on a physical port'],
        ['Reaching the switch from another subnet', 'also needs <span class="nw-m">ip default-gateway</span> on the switch'],
      ])}
      <div class="box">A switch port has no IP address. If you try
      <span class="nw-m">interface fa0/1</span> then <span class="nw-m">ip address …</span>
      on a Layer 2 switch, IOS rejects it — and that rejection is the lesson.</div>`,
  },

  {
    t: '2.7 — Give the switch its management address',
    body: `${CSS}
      ${code(`enable
configure terminal
interface vlan 1                      # the SVI: the switch's own presence on the network
 ip address 192.168.1.2 255.255.255.0
 no shutdown                          # an SVI is administratively down until you say this
 exit
ip default-gateway 192.168.1.1        # only needed to manage it from another subnet
end
copy running-config startup-config`, 'bash')}
      ${term(`<span class="p">S1#</span> <span class="k">show ip interface brief</span>
Interface   IP-Address    OK? Method Status                Protocol
<span class="g">Vlan1       192.168.1.2   YES manual up                    up</span>
Fa0/2       unassigned    YES unset  <span class="r">down                  down</span>
Fa0/3       unassigned    YES unset  <span class="r">administratively down  down</span>`, 'sm')}
      <div class="box ok">Vlan1 <b>up / up</b> is the goal. <b>down</b> = nothing plugged in;
      <b>administratively down</b> = somebody typed <span class="nw-m">shutdown</span>.</div>`,
  },

  {
    t: 'The same four settings, on the three host operating systems',
    body: `${CSS}
      ${code(`# Linux — see what you have, then set it (netplan / NetworkManager for permanence)
ip addr show                       # address + mask
ip route show                      # "default via 192.168.1.1" = your gateway
resolvectl status                  # which DNS server is actually in use

# macOS
ipconfig getifaddr en0
netstat -rn | grep default

# Windows — the one command that shows all four at once
ipconfig /all                      # address, mask, gateway, DNS
ipconfig /release && ipconfig /renew   # ask DHCP again`, 'bash')}
      ${kv([
        ['169.254.x.x on Windows', 'DHCP never answered — the PC invented a link-local address. Check the cable and the DHCP server, not the PC.'],
        ['No default route', 'ping works inside the LAN and nothing else does'],
        ['Right address, wrong mask', 'the host misjudges who is local; some destinations work and some do not, apparently at random'],
      ])}`,
  },

  {
    t: '2.8 — The four states of Status / Protocol',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Status / Protocol</th><th>Layer</th><th>What it means</th><th>Do this</th></tr>
        <tr><td class="hl"><b>up / up</b></td><td>L1 + L2</td><td>Healthy and usable</td><td>Nothing</td></tr>
        <tr><td><b>up / down</b></td><td>L1 ok, L2 not</td><td>Signal present, no protocol agreement</td><td>Compare both ends</td></tr>
        <tr><td><b>down / down</b></td><td>L1 fails</td><td>No cable, wrong cable, dead port</td><td>Cable, port, other device</td></tr>
        <tr><td><b>administratively down</b></td><td>Configured off</td><td>Somebody typed <span class="nw-m">shutdown</span></td><td><span class="nw-m">no shutdown</span></td></tr>
      </table>
      <div class="box warn"><b>down</b> and <b>administratively down</b> look identical to a
      user — "the port is dead" — but one is a cable and one is a command. Reading the
      difference is the whole value of this table.</div>`,
  },

  {
    t: 'Reading a ping, character by character',
    body: `${CSS}
      ${term(`<span class="p">S1#</span> <span class="k">ping</span> 192.168.1.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.10, timeout is 2 seconds:
<span class="g">.!!!!</span>
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/2/8 ms`, 'sm')}
      <table class="t big2">
        <tr><th>Output</th><th>Meaning</th></tr>
        <tr><td><span class="nw-m">!!!!!</span></td><td>Five replies — success</td></tr>
        <tr><td class="hl"><span class="nw-m">.!!!!</span></td><td class="hl">First packet lost while ARP resolved the MAC, rest fine — <b>normal, not a fault</b></td></tr>
        <tr><td><span class="nw-m">.....</span></td><td>Timed out. Forward path, return path, or a firewall — ping cannot tell you which</td></tr>
        <tr><td><span class="nw-m">U.U.U</span></td><td>A router replied "destination unreachable" — routing or gateway, not a cable</td></tr>
      </table>`,
  },

  {
    t: 'Lab 1.1 — the topology and the addressing table',
    body: `${CSS}
      ${topo([
        'nd.cl:PC-A|192.168.1.10 /24',
        'lk:UTP<br>to Fa0/6',
        'nd:Switch S1|Vlan1 192.168.1.2 /24',
        'lk:console<br>rollover',
        'nd.cl:PC-A COM1|Tera Term 9600 8N1',
      ])}
      <table class="t">
        <tr><th>Device</th><th>Interface</th><th>IP address</th><th>Mask</th><th>Gateway</th></tr>
        <tr><td>S1</td><td>VLAN 1</td><td>192.168.1.2</td><td>255.255.255.0</td><td>—</td></tr>
        <tr><td>PC-A</td><td>NIC</td><td>192.168.1.10</td><td>255.255.255.0</td><td>—</td></tr>
      </table>
      <div class="box">One PC, two cables to the same switch: the <b>rollover</b> cable to
      the console port carries your commands, the <b>straight-through</b> cable to Fa0/6
      carries the data you will later ping over. Confusing the two is the most common
      first-lab mistake — and the console cable plugged into Fa0/6 gives no error, just
      a dead terminal.</div>`,
  },

  {
    t: 'Lab 1.1 — the order of operations',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><div><b>Cable and open the console.</b> Tera Term → Serial → COM port → 9600 8N1. Press Enter until a prompt appears.</div></div>
        <div><span class="n">2</span><div><b>Start clean.</b> <span class="nw-m">erase startup-config</span>, <span class="nw-m">reload</span>, decline the initial configuration dialog.</div></div>
        <div><span class="n">3</span><div><b>Navigate the modes.</b> <span class="nw-m">enable</span> → <span class="nw-m">configure terminal</span> → <span class="nw-m">line</span> / <span class="nw-m">interface</span>, and back with <span class="nw-m">exit</span> and <span class="nw-m">end</span>.</div></div>
        <div><span class="n">4</span><div><b>Configure.</b> hostname, enable secret, console and vty passwords, banner, then the Vlan1 address.</div></div>
        <div><span class="n">5</span><div><b>Configure PC-A</b> with a static address in the same subnet.</div></div>
        <div><span class="n">6</span><div><b>Verify.</b> <span class="nw-m">show ip interface brief</span>, then ping in <b>both</b> directions.</div></div>
        <div><span class="n">7</span><div><b>Save.</b> <span class="nw-m">copy running-config startup-config</span>, and capture the config to a text file.</div></div>
      </div>
      <div class="box warn">Do step 6 <b>before</b> step 7 but never skip step 7. A lab that
      pings perfectly and was never saved scores the same as one that never worked.</div>`,
  },

  {
    t: 'Lab 1.1 — using AI tools for configuration and troubleshooting',
    body: `${CSS}
      ${flow('You', 'AI assistant', [
        ['r', 'topology + addressing table + exact error text', 'give it the facts, not "it does not work"'],
        ['l', 'suggested commands + reasoning', 'draft only'],
        ['r', 'which show command proves this?', 'force a verifiable claim'],
        ['l', 'expected output', 'write it down before you run it'],
      ])}
      ${kv([
        ['Good prompt', '"S1 Vlan1 is 192.168.1.2/24, PC-A is 192.168.1.10/24, ping fails, <i>show ip int brief</i> says Vlan1 administratively down. What is wrong and which command proves the fix?"'],
        ['Bad prompt', '"my switch does not ping"'],
        ['The rule', 'the device is the authority; the assistant is a hypothesis generator'],
      ])}
      <div class="box warn">Measured failure modes to expect: invented interface names
      (<span class="nw-m">interface vlan1/0</span>), commands from a different platform,
      and confidently wrong subnet boundaries. CLO9 and CLO10 ask you to <b>use</b> AI —
      the grade comes from verifying it.</div>`,
  },

  {
    t: 'Sessions 3–6: the school’s questions, and your self-check',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Question, exactly as FPT wrote it</th><th>Answer it with</th></tr>
        <tr><td><b>CQ1.4</b> (session 3) — What is the Cisco IOS?</td><td>The operating system of the device: a CLI with modes, a running configuration in RAM and a saved one in NVRAM</td></tr>
        <tr><td><b>CQ2.1</b> (session 4) — How to write the correct command in Cisco IOS?</td><td>prompt + keywords + arguments, in the right mode, with <span class="nw-m">?</span> and Tab to confirm</td></tr>
        <tr><td><b>CQ2.2</b> (session 5) — What should we do when implement basic network with switches and end devices?</td><td>Name it, secure it, address it, verify it, save it — in that order</td></tr>
      </table>
      <p class="note">Session 6 is a full session of Lab 1.1 and the syllabus lists
      <b>no</b> question for it — one of eight sessions left blank in that table.</p>
      <div class="box ok">Self-check: from a cold switch, can you reach
      <span class="nw-m">S1#</span>, set a secret, address Vlan1, ping a PC and save,
      <b>without notes</b>?</div>`,
  },
];
