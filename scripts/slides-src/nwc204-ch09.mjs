/**
 * nwc204-ch09.mjs — NWC204 Chapter 9: Basic Router Configuration
 * (FLM buổi 26–27 lý thuyết + buổi 28–29 Lab 2.1, Cisco Module 10).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 26, 27, 28, 29.
 *   buổi 26: 9.1 Configure Initial Router Settings
 *   buổi 27: 9.2 Configure Interfaces · 9.4 Configure the Default Gateway
 *            · 9.5 Integrate AI Tools (self learning)   ⚠️ bảng gốc NHẢY QUA 9.3
 *   buổi 28–29: Lab 2.1 — Build a Switch and Router Network
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 10: làm đúng những việc ấy trên
 *     Linux (ip addr / ip link / ip route / ip_forward), cách khiến cấu hình
 *     sống sót sau khi khởi động lại, siết SSH trên VPS thật, và dựng lại
 *     Lab 2.1 bằng network namespace của Linux mà không cần Packet Tracer.
 *
 * 26 slide, 23 trong số đó là sơ đồ, SVG, bảng hoặc terminal.
 */
import { CSS, topo, flow, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch09',
  code: 'NWC204',
  title: 'Ch.9 — Basic Router Configuration',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: running-config vs startup-config ─────────────────────────────── */
const CFG = `<svg class="nw-svg" viewBox="0 0 900 235" width="1150" height="300"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Two configurations exist at the same time, and only one of them survives a reboot</text>
  <rect x="30" y="34" width="330" height="100" rx="8" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="195" y="58" font-size="17" text-anchor="middle" fill="#7a4708" font-weight="800">running-config</text>
  <text x="195" y="80" font-size="13" text-anchor="middle" fill="#3c5570">lives in RAM · active RIGHT NOW</text>
  <text x="195" y="100" font-size="13" text-anchor="middle" fill="#3c5570">every command you type lands here</text>
  <text x="195" y="122" font-size="13" text-anchor="middle" fill="#8f2c2c" font-weight="700">LOST on power off</text>
  <rect x="540" y="34" width="330" height="100" rx="8" fill="#eefaf4" stroke="#1f9d6b" stroke-width="2.5"/>
  <text x="705" y="58" font-size="17" text-anchor="middle" fill="#14603f" font-weight="800">startup-config</text>
  <text x="705" y="80" font-size="13" text-anchor="middle" fill="#3c5570">lives in NVRAM · loaded at BOOT</text>
  <text x="705" y="100" font-size="13" text-anchor="middle" fill="#3c5570">unchanged until you copy over it</text>
  <text x="705" y="122" font-size="13" text-anchor="middle" fill="#14603f" font-weight="700">SURVIVES power off</text>
  <g stroke="#1b5fa8" stroke-width="3" fill="none">
    <line x1="366" y1="66" x2="528" y2="66"/><polygon points="528,60 542,66 528,72" fill="#1b5fa8" stroke="none"/>
    <line x1="870" y1="112" x2="890" y2="112"/><line x1="890" y1="112" x2="890" y2="160"/>
    <line x1="890" y1="160" x2="30" y2="160"/><line x1="30" y1="160" x2="30" y2="112"/>
    <polygon points="24,112 30,98 36,112" fill="#1b5fa8" stroke="none"/>
  </g>
  <text x="450" y="52" font-size="13" text-anchor="middle" fill="#1b5fa8" font-weight="800">copy run start</text>
  <text x="450" y="88" font-size="11" text-anchor="middle" fill="#5d7288" font-weight="600">write memory</text>
  <text x="450" y="177" font-size="13" text-anchor="middle" fill="#1b5fa8" font-weight="800">reload — NVRAM overwrites RAM</text>
  <text x="4" y="205" fill="#d94b4b" font-size="14" font-weight="700">Forgetting the copy is the single most common mistake: it works perfectly until the next power cut.</text>
  <text x="4" y="228" fill="#5d7288" font-size="14">It is also the escape hatch: type something catastrophic, do NOT save, reload — it never happened.</text>
</svg>`;

/* ── SVG: interface status / protocol matrix as a decision aid ─────────── */
const IFST = `<svg class="nw-svg" viewBox="0 0 900 230" width="1150" height="294"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">show ip interface brief — the two right-hand columns name the layer that is broken</text>
  <g stroke-width="2.5">
    <rect x="20" y="30" width="205" height="86" rx="6" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="240" y="30" width="205" height="86" rx="6" fill="#fff5d6" stroke="#b4690e"/>
    <rect x="460" y="30" width="205" height="86" rx="6" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="680" y="30" width="200" height="86" rx="6" fill="#f2f7fd" stroke="#6b8199"/>
  </g>
  <g text-anchor="middle">
    <text x="122" y="54" font-size="16" fill="#14603f" font-weight="800">up / up</text>
    <text x="122" y="76" font-size="12" fill="#3c5570">L1 fine, L2 fine</text>
    <text x="122" y="96" font-size="13" fill="#14603f" font-weight="700">WORKING</text>
    <text x="342" y="54" font-size="16" fill="#7a4708" font-weight="800">up / down</text>
    <text x="342" y="74" font-size="12" fill="#3c5570">cable OK, L2 not</text>
    <text x="342" y="92" font-size="12" fill="#3c5570">encapsulation, no</text>
    <text x="342" y="108" font-size="12" fill="#3c5570">clock rate, keepalive</text>
    <text x="562" y="54" font-size="16" fill="#8f2c2c" font-weight="800">down / down</text>
    <text x="562" y="74" font-size="12" fill="#3c5570">no signal at all</text>
    <text x="562" y="92" font-size="12" fill="#3c5570">cable, far end off,</text>
    <text x="562" y="108" font-size="12" fill="#3c5570">wrong port, dead SFP</text>
    <text x="780" y="54" font-size="15" fill="#3c5570" font-weight="800">administratively</text>
    <text x="780" y="72" font-size="15" fill="#3c5570" font-weight="800">down / down</text>
    <text x="780" y="94" font-size="12" fill="#3c5570">somebody typed</text>
    <text x="780" y="110" font-size="13" fill="#1b5fa8" font-weight="700">shutdown</text>
  </g>
  <text x="4" y="146" fill="#1b5fa8" font-size="14" font-weight="700">Column 1 = Status = LAYER 1.   Column 2 = Protocol = LAYER 2.   Read them in that order.</text>
  <text x="4" y="170" fill="#5d7288" font-size="14">"administratively down" is not a fault — it is the factory default. The fix: no shutdown.</text>
  <text x="4" y="192" fill="#5d7288" font-size="14">up/down on a serial link is usually a missing clock rate on the DCE end, or bad encapsulation.</text>
  <text x="4" y="216" fill="#d94b4b" font-size="14" font-weight="700">There is no "down / up". Layer 2 cannot work while layer 1 is dead.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'Basic Router Configuration',
    sub: 'Chapter 9 — Cisco Module 10',
    body: `<div class="cov-meta">Sessions 26–27 (theory) + 28–29 (Lab 2.1) of 60 · CLO3, CLO8, CLO9<br>
      9.1 Configure Initial Router Settings<br>
      9.2 Configure Interfaces · 9.4 Configure the Default Gateway<br>
      Lab 2.1 — Build a Switch and Router Network<br>
      ★ marks material added by cuongthai.com, beyond Cisco Module 10</div>`,
  },

  /* ── 9.1 Initial settings ────────────────────────────────────────────── */
  {
    t: 'What a router is, straight out of the box',
    body: `${CSS}
      ${kv([
        ['Hostname', '<b>Router</b> — identical on every unit shipped, which is how people configure the wrong device'],
        ['Every interface', '<b>administratively down.</b> Nothing forwards until a human says so'],
        ['Passwords', 'none · console access is wide open to anyone holding a cable'],
        ['IP addresses', 'none'],
        ['Routing table', 'empty — not even a default route'],
        ['SSH', 'impossible · there is no crypto key and no domain name yet'],
      ])}
      <div class="box ok">Interfaces shipping <b>down</b> is a safety decision, not an oversight. A router plugged into a live network with a factory configuration could otherwise start forwarding, or start a loop, before anyone had reviewed it.</div>`,
  },

  {
    t: 'The prompt tells you which mode you are in',
    body: `${CSS}
      ${term(`<span class="p">Router&gt;</span>                        <span class="c"># user EXEC — look, do not touch</span>
<span class="p">Router&gt;</span> <span class="k">enable</span>
<span class="p">Router#</span>                        <span class="c"># privileged EXEC — show everything, reload, copy</span>
<span class="p">Router#</span> <span class="k">configure terminal</span>
<span class="p">Router(config)#</span>                <span class="c"># global configuration — change the device</span>
<span class="p">Router(config)#</span> <span class="k">interface</span> g0/0
<span class="p">Router(config-if)#</span>             <span class="c"># interface configuration — change ONE interface</span>
<span class="p">Router(config-if)#</span> <span class="k">exit</span>       <span class="c"># up one level</span>
<span class="p">Router(config)#</span> <span class="k">end</span>            <span class="c"># straight back to privileged EXEC (or Ctrl-Z)</span>`, 'sm')}
      ${kv([
        ['A command rejected here', 'is usually the right command in the <b>wrong mode</b>, not a wrong command'],
        ['<span class="nw-m">do</span> prefix', 'runs an EXEC command from config mode: <span class="nw-m">do show ip int brief</span>'],
        ['Read the prompt first', 'every troubleshooting session that starts by reading the prompt is shorter'],
      ])}`,
  },

  {
    t: 'The initial-settings checklist, in order',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Name the device</b> — so you know which one you are typing into.</span></div>
        <div><span class="n">2</span><span><b>Secure privileged EXEC</b> — <span class="nw-m">enable secret</span>, never <span class="nw-m">enable password</span>.</span></div>
        <div><span class="n">3</span><span><b>Secure the lines</b> — console and VTY, each with a password and <span class="nw-m">login</span>.</span></div>
        <div><span class="n">4</span><span><b>Encrypt the plaintext leftovers</b> — <span class="nw-m">service password-encryption</span>.</span></div>
        <div><span class="n">5</span><span><b>Legal banner</b> — <span class="nw-m">banner motd</span>. In many jurisdictions, no warning means no prosecution.</span></div>
        <div><span class="n">6</span><span><b>Save</b> — <span class="nw-m">copy running-config startup-config</span>.</span></div>
      </div>
      <div class="box warn">Order matters for one reason: step 3 can lock you out. Configure the console <i>last</i> among the access methods, and keep the session open until you have tested from a second window.</div>`,
  },

  {
    t: 'Hostname and banner',
    body: `${CSS}
      ${code(`enable
configure terminal

hostname R1
! the prompt changes immediately — this is how you avoid configuring the wrong box

banner motd #
Authorised access only. Activity is logged.
Disconnect immediately if you are not authorised.
#
! the # is a DELIMITER, chosen by you. Anything until the next # is the banner.
! Never use a character that appears in the text itself.`, 'bash', 'sm')}
      ${kv([
        ['Why the hostname first', 'every later screenshot, log line and prompt carries it · it is free context'],
        ['Why the banner is not decoration', 'it is a legal notice · "welcome" invites, "authorised only" warns'],
        ['⚠️ Never write', '"Welcome" — it has been argued in court as an invitation to connect'],
      ])}`,
  },

  {
    t: 'enable secret, never enable password',
    body: `${CSS}
      <table class="t big2">
        <tr><th>enable password</th><td>Stored in <b>plaintext</b>, or as Cisco "type 7" if <span class="nw-m">service password-encryption</span> is on — and type 7 is a reversible Vigenère cipher that any online tool decodes in under a second. It is obfuscation, not encryption.</td></tr>
        <tr><th>enable secret</th><td>Stored as a <b>one-way hash</b> (MD5 type 5, or scrypt type 9 on modern IOS). Cannot be reversed, only guessed.</td></tr>
        <tr><th>Both configured</th><td><span class="nw-m">enable secret</span> wins and <span class="nw-m">enable password</span> is ignored entirely — which makes it a dangerous decoy left in the config.</td></tr>
      </table>
      ${code(`enable secret Cisco123!        ! hashed — use this
no enable password             ! remove the weak one entirely
service password-encryption    ! type 7 for the leftovers: line passwords`, 'bash', 'sm')}
      <div class="box warn"><b>What <span class="nw-m">service password-encryption</span> is actually for:</b> stopping a password being read over your shoulder or in a screenshot. It is not protection against anyone who obtains the config file.</div>`,
  },

  {
    t: 'Console and VTY lines',
    body: `${CSS}
      ${code(`line console 0
 password Con5ole!
 login                    ! WITHOUT this word, the password is never asked for
 logging synchronous      ! stop log messages interrupting what you are typing
 exec-timeout 10 0        ! log out after 10 minutes idle
 exit

line vty 0 4              ! the 5 virtual terminal lines used by telnet and SSH
 password Vty5ecret!
 login
 transport input ssh      ! SSH ONLY — telnet sends passwords in clear text
 exec-timeout 5 0
 exit`, 'bash', 'sm')}
      ${kv([
        ['Forgetting <span class="nw-m">login</span>', 'the password is configured and never requested — a silent, total failure'],
        ['<span class="nw-m">transport input ssh</span>', 'the one line that makes remote access safe · default on old IOS is <b>all</b>'],
        ['<span class="nw-m">logging synchronous</span>', 'small comfort, large difference · without it a log message lands mid-command'],
      ])}`,
  },

  {
    t: 'SSH properly — five prerequisites, all mandatory',
    body: `${CSS}
      ${code(`hostname R1                          ! 1. not the default "Router"
ip domain-name lab.local             ! 2. needed to build the key's name
crypto key generate rsa modulus 2048 ! 3. the key itself — 2048 minimum
ip ssh version 2                     ! 4. version 1 is broken, refuse it
username admin secret Adm1nPass!     ! 5. SSH needs a USERNAME, not just a password

line vty 0 4
 transport input ssh
 login local                         ! use the username database, not "password"`, 'bash', 'sm')}
      ${kv([
        ['Why hostname and domain first', 'the RSA key is named <span class="nw-m">R1.lab.local</span> · with defaults the command is refused'],
        ['<span class="nw-m">login local</span> vs <span class="nw-m">login</span>', '<b>local</b> uses username + password · plain <b>login</b> uses the line password only'],
        ['Verify', '<span class="nw-m">show ip ssh</span> · <span class="nw-m">show crypto key mypubkey rsa</span>'],
      ])}`,
  },

  {
    t: '★ The same hardening, on your own Linux server',
    body: `${CSS}
      ${term(`<span class="c"># Cisco: username + secret. Linux: a KEY, and no password at all.</span>
<span class="p">$</span> <span class="k">ssh-copy-id</span> admin@your-server          <span class="c"># install your public key first — TEST IT</span>

<span class="c"># /etc/ssh/sshd_config.d/01-no-password.conf</span>
<span class="k">PasswordAuthentication</span> no
<span class="k">KbdInteractiveAuthentication</span> no
<span class="k">PermitRootLogin</span> prohibit-password

<span class="p">$</span> <span class="k">sudo sshd -t</span> <span class="g">&amp;&amp;</span> <span class="k">sudo systemctl reload ssh</span>
<span class="p">$</span> <span class="k">sudo sshd -T</span> | <span class="k">grep</span> ^passwordauthentication
<span class="g">passwordauthentication no</span>   <span class="c"># verify the EFFECTIVE value, not the file you wrote</span>`, 'sm')}
      ${kv([
        ['The parallel is exact', 'Cisco <span class="nw-m">transport input ssh</span> ⇄ Linux disabling password auth'],
        ['★ The <span class="nw-m">01-</span> prefix matters', 'sshd takes the FIRST value it reads and reads <span class="nw-m">*.conf</span> alphabetically'],
        ['★ Verify with <span class="nw-m">sshd -T</span>', 'not with <span class="nw-m">cat</span> — "written" and "in effect" are different claims'],
        ['Keep one session open', 'exactly as on the console line · test from a second window before you close it'],
      ])}`,
  },

  { t: 'running-config and startup-config', body: `${CSS}${CFG}` },

  /* ── 9.2 Interfaces ──────────────────────────────────────────────────── */
  {
    t: '9.2 Configure interfaces — three commands, every time',
    body: `${CSS}
      ${code(`interface GigabitEthernet0/0
 description LAN - Building A floor 2
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit

interface GigabitEthernet0/1
 description WAN - link to R2
 ip address 10.0.0.1 255.255.255.252
 no shutdown
 exit`, 'bash', 'sm')}
      ${kv([
        ['<b>description</b>', 'optional, and the first thing you will wish you had written six months later'],
        ['<b>ip address</b>', 'address AND mask · IOS wants dotted decimal, not /24'],
        ['<b>no shutdown</b>', '<b>the one everybody forgets.</b> Without it the interface stays administratively down'],
        ['/30 on the WAN link', '4 addresses, 2 usable — exactly right for a point-to-point link'],
      ])}`,
  },

  {
    t: 'Why interfaces ship shut, and what it costs you',
    body: `${CSS}
      ${kv([
        ['The reason', 'a router plugged into a live network with a factory config must not start forwarding, or loop, before a human reviews it'],
        ['The cost', 'the single most common beginner fault: address configured, everything correct, nothing works'],
        ['The symptom', '<span class="nw-m">show ip interface brief</span> reads <b>administratively down / down</b>'],
        ['The fix', 'one command — <span class="nw-m">no shutdown</span>'],
        ['⚠️ Switch ports are the opposite', 'they default to <b>enabled</b> · only router interfaces ship shut'],
      ])}
      <div class="box ok">Build the habit now: <b>every</b> interface block ends with <span class="nw-m">no shutdown</span>, even when you think it is already up. It is idempotent — typing it twice costs nothing.</div>`,
  },

  { t: 'Reading show ip interface brief', body: `${CSS}${IFST}` },

  {
    t: 'What the verification actually looks like',
    body: `${CSS}
      ${term(`<span class="p">R1#</span> <span class="k">show ip interface brief</span>
<span class="g">Interface              IP-Address      OK? Method Status                Protocol</span>
<span class="g">GigabitEthernet0/0     192.168.10.1    YES manual up                    up</span>
<span class="r">GigabitEthernet0/1     10.0.0.1        YES manual administratively down down</span>
<span class="g">GigabitEthernet0/2     unassigned      YES unset  down                  down</span>

<span class="c"># g0/0 works. g0/1 is missing "no shutdown". g0/2 has no address and no cable.</span>

<span class="p">R1#</span> <span class="k">show ip route connected</span>
<span class="g">C    192.168.10.0/24 is directly connected, GigabitEthernet0/0</span>
<span class="g">L    192.168.10.1/32 is directly connected, GigabitEthernet0/0</span>
<span class="c"># note: only g0/0 produced routes. A shut interface contributes NOTHING.</span>`, 'sm')}
      <div class="box warn">The second command is the real proof. An interface that is up/up but produced no connected route has no address — and a router only routes for networks it can see.</div>`,
  },

  {
    t: 'Serial and WAN interfaces — the one extra command',
    body: `${CSS}
      ${code(`interface Serial0/0/0
 description WAN link to branch office
 ip address 209.165.200.225 255.255.255.252
 clock rate 128000        ! ONLY on the DCE end — the cable decides which end that is
 no shutdown`, 'bash', 'sm')}
      ${kv([
        ['DCE and DTE', 'the DCE end supplies timing · in a lab the cable marking tells you which is which'],
        ['Find out', '<span class="nw-m">show controllers Serial0/0/0</span> prints DCE or DTE'],
        ['Missing clock rate on the DCE', 'interface reads <b>up / down</b> — layer 1 fine, layer 2 dead'],
        ['★ In real life', 'serial is nearly extinct, but it is on every CCNA exam and every Packet Tracer lab'],
      ])}`,
  },

  /* ── 9.4 Default gateway ─────────────────────────────────────────────── */
  {
    t: '9.4 The default gateway — and who actually needs one',
    body: `${CSS}
      ${topo([
        'nd:PC|192.168.10.10', 'lk:access port|',
        'nd:SW1|192.168.10.2 = SVI', 'lk:trunk or access|',
        'nd.rt:R1|192.168.10.1',
      ])}
      ${kv([
        ['A <b>router</b>', 'needs no default gateway · it HAS a routing table, and its default route is <span class="nw-m">ip route 0.0.0.0 0.0.0.0 …</span>'],
        ['A <b>layer-2 switch</b>', 'is an END DEVICE at layer 3 · it needs one management IP and one default gateway'],
        ['A <b>PC</b>', 'same as the switch — one address, one gateway'],
        ['The command differs', 'switch: <span class="nw-m">ip default-gateway</span> · router: <span class="nw-m">ip route 0.0.0.0 0.0.0.0</span>'],
      ])}
      <div class="box warn">Typing <span class="nw-m">ip default-gateway</span> on a router is accepted and does nothing while IP routing is enabled. This wastes a great deal of lab time.</div>`,
  },

  {
    t: 'Configuring management access on a switch',
    body: `${CSS}
      ${code(`interface vlan 1                        ! the SVI — a virtual layer-3 interface
 ip address 192.168.10.2 255.255.255.0
 no shutdown
 exit

ip default-gateway 192.168.10.1         ! GLOBAL command, not under the interface

! optional but sensible: move management off VLAN 1
interface vlan 99
 ip address 192.168.99.2 255.255.255.0
 no shutdown`, 'bash', 'sm')}
      ${kv([
        ['What the SVI is for', 'management only — SSH to the switch, SNMP, syslog · it does NOT forward user traffic'],
        ['Without the gateway', 'the switch is reachable from its own VLAN and from nowhere else'],
        ['Why move off VLAN 1', 'VLAN 1 is the default everywhere, so it is where attacks land first'],
      ])}`,
  },

  {
    t: '★ The identical three steps, on Linux',
    body: `${CSS}
      ${term(`<span class="c"># Cisco: ip address / no shutdown / ip default-gateway</span>
<span class="c"># Linux: exactly the same three ideas, three commands</span>

<span class="p">$</span> <span class="k">sudo ip addr add</span> 192.168.10.5/24 dev eth0     <span class="c"># 1. address + mask</span>
<span class="p">$</span> <span class="k">sudo ip link set</span> eth0 up                     <span class="c"># 2. "no shutdown"</span>
<span class="p">$</span> <span class="k">sudo ip route add default via</span> 192.168.10.1   <span class="c"># 3. default gateway</span>

<span class="p">$</span> <span class="k">ip -br addr</span> ; <span class="k">ip route</span>                      <span class="c"># = show ip interface brief</span>

<span class="c"># And to make the machine ROUTE, which is what a router does:</span>
<span class="p">$</span> <span class="k">sudo sysctl</span> -w net.ipv4.ip_forward=1`, 'sm')}
      <div class="box ok">Every idea in this chapter exists on both platforms. Once you see that <span class="nw-m">ip link set up</span> <i>is</i> <span class="nw-m">no shutdown</span>, the CCNA material stops being trivia and starts being transferable.</div>`,
  },

  {
    t: '★ Making it survive a reboot — the config, not the command',
    body: `${CSS}
      <table class="t big2">
        <tr><th>Cisco</th><td>The command lands in <b>running-config</b> (RAM). <span class="nw-m">copy running-config startup-config</span> writes it to NVRAM. Skip that and the next reload erases everything you did.</td></tr>
        <tr><th>Linux — the exact same trap</th><td><span class="nw-m">ip addr add</span> lasts until reboot. Persist it in <b>netplan</b> (<span class="nw-m">/etc/netplan/*.yaml</span>, then <span class="nw-m">netplan apply</span>) or <b>NetworkManager</b> (<span class="nw-m">nmcli con mod</span>).</td></tr>
        <tr><th>Linux — ip_forward</th><td><span class="nw-m">sysctl -w</span> is temporary too. Permanent lives in <span class="nw-m">/etc/sysctl.d/99-router.conf</span>.</td></tr>
        <tr><th>The shared lesson</th><td><b>"It works now" and "it will work after a reboot" are two different claims,</b> and only the second one matters at 3 a.m.</td></tr>
      </table>
      <div class="box ok">The Cisco version of this has a silver lining: type something catastrophic, do <b>not</b> save, <span class="nw-m">reload</span>, and the mistake never existed. Learn to use that deliberately.</div>`,
  },

  /* ── Lab 2.1 ─────────────────────────────────────────────────────────── */
  {
    t: 'Lab 2.1 — the topology you are building',
    body: `${CSS}
      ${topo([
        'nd:PC-A|192.168.10.3/24', 'lk:F0/6|',
        'nd:S1|192.168.10.2/24', 'lk:F0/5 ↔ G0/0/0|',
        'nd.rt:R1|192.168.10.1/24',
      ])}
      ${kv([
        ['Network', '192.168.10.0/24 · gateway 192.168.10.1 on R1'],
        ['R1 G0/0/0', '192.168.10.1 — the gateway for everyone on this LAN'],
        ['S1 VLAN 1', '192.168.10.2 — management only, plus <span class="nw-m">ip default-gateway 192.168.10.1</span>'],
        ['PC-A', '192.168.10.3, mask 255.255.255.0, gateway 192.168.10.1'],
        ['Success', 'PC-A pings both · both are reachable by SSH · <span class="nw-m">show ip route</span> on R1 lists the connected network'],
      ])}`,
  },

  {
    t: 'Lab 2.1 — R1, from the first keystroke',
    body: `${CSS}
      <div class="two">
        <div>
          <div class="nh">identity and access</div>
          ${code(`enable
configure terminal
hostname R1
no ip domain-lookup
enable secret class
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 4
 password cisco
 login
 transport input ssh
 exit`, 'bash', 'sm')}
        </div>
        <div>
          <div class="nh">hardening, interface, save</div>
          ${code(`service password-encryption
banner motd # Authorised only. #

interface g0/0/0
 description LAN to S1
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit
end

copy running-config startup-config`, 'bash', 'sm')}
          <div class="box warn" style="font-size:19px"><b>no ip domain-lookup</b> turns a typo into an instant error instead of a 30-second DNS wait.</div>
        </div>
      </div>`,
  },

  {
    t: 'Lab 2.1 — S1, and the one line that differs',
    body: `${CSS}
      <div class="two">
        <div>
          <div class="nh">identical to R1</div>
          ${code(`enable
configure terminal
hostname S1
no ip domain-lookup
enable secret class
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 15
 password cisco
 login
 exit
service password-encryption`, 'bash', 'sm')}
        </div>
        <div>
          <div class="nh">the switch-only part</div>
          ${code(`interface vlan 1
 ip address 192.168.10.2 255.255.255.0
 no shutdown
 exit

ip default-gateway 192.168.10.1
end
copy running-config startup-config`, 'bash', 'sm')}
          ${kv([
            ['<span class="nw-m">vty 0 15</span>', 'a switch has 16 VTY lines, a router 5'],
            ['The SVI', 'management only · it does not forward user traffic'],
            ['<span class="nw-m">ip default-gateway</span>', 'GLOBAL, not under the interface'],
          ])}
        </div>
      </div>`,
  },

  {
    t: 'Lab 2.1 — verify in this order, and stop at the first failure',
    body: `${CSS}
      ${term(`<span class="p">R1#</span> <span class="k">show ip interface brief</span>       <span class="c"># 1. is the interface up/up?</span>
<span class="p">R1#</span> <span class="k">show ip route</span>                  <span class="c"># 2. did a connected route appear?</span>
<span class="p">R1#</span> <span class="k">ping</span> 192.168.10.2               <span class="c"># 3. can R1 reach S1?</span>
<span class="p">S1#</span> <span class="k">show ip interface brief</span>       <span class="c"># 4. is VLAN 1 up/up?</span>
<span class="p">S1#</span> <span class="k">ping</span> 192.168.10.1               <span class="c"># 5. the reverse direction</span>
<span class="p">PC&gt;</span> <span class="k">ipconfig</span>                       <span class="c"># 6. address, mask AND gateway all set?</span>
<span class="p">PC&gt;</span> <span class="k">ping</span> 192.168.10.1               <span class="c"># 7. PC to gateway</span>
<span class="p">PC&gt;</span> <span class="k">arp</span> -a                          <span class="c"># 8. Chapter 8: is the gateway MAC there?</span>`, 'sm')}
      ${kv([
        ['Bottom-up, one layer at a time', 'if step 1 fails, steps 2–8 tell you nothing'],
        ['Step 2 is the one people skip', 'up/up with no connected route means no address was applied'],
        ['Step 8 ties the chapters together', 'no ARP entry for the gateway ⇒ layer 2 never completed'],
      ])}`,
  },

  {
    t: 'Lab 2.1 — what goes wrong, and what it looks like',
    body: `${CSS}
      <table class="t">
        <tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
        <tr><td>administratively down</td><td>forgot <span class="nw-m">no shutdown</span></td><td>the obvious one</td></tr>
        <tr><td>up/up but no connected route</td><td>no IP address applied</td><td>re-enter <span class="nw-m">ip address</span></td></tr>
        <tr><td>PC pings R1, not S1</td><td>SVI shut, or no address on VLAN 1</td><td><span class="nw-m">interface vlan 1</span> + <span class="nw-m">no shutdown</span></td></tr>
        <tr><td>S1 reachable on-LAN only</td><td>missing <span class="nw-m">ip default-gateway</span></td><td>add it globally</td></tr>
        <tr><td>SSH refused</td><td>no RSA key, or <span class="nw-m">login local</span> without a username</td><td>generate key, add username</td></tr>
        <tr><td class="hl">all correct, dead after reload</td><td class="hl">forgot to save</td><td class="hl"><span class="nw-m">copy run start</span></td></tr>
      </table>`,
  },

  {
    t: '★ Lab 2.1 without Packet Tracer, on one Linux machine',
    body: `${CSS}
      ${term(`<span class="c"># Two network namespaces = two "PCs". A bridge = the switch. The host = the router.</span>
<span class="p">$</span> <span class="k">sudo ip netns add</span> pca
<span class="p">$</span> <span class="k">sudo ip link add</span> veth-a type veth peer name veth-a-br
<span class="p">$</span> <span class="k">sudo ip link set</span> veth-a netns pca

<span class="p">$</span> <span class="k">sudo ip link add</span> br-lab type bridge <span class="g">&amp;&amp;</span> <span class="k">sudo ip link set</span> br-lab up
<span class="p">$</span> <span class="k">sudo ip link set</span> veth-a-br master br-lab up
<span class="p">$</span> <span class="k">sudo ip addr add</span> 192.168.10.1/24 dev br-lab     <span class="c"># the "router" interface</span>

<span class="p">$</span> <span class="k">sudo ip netns exec</span> pca ip addr add 192.168.10.3/24 dev veth-a
<span class="p">$</span> <span class="k">sudo ip netns exec</span> pca ip link set veth-a up
<span class="p">$</span> <span class="k">sudo ip netns exec</span> pca ip route add default via 192.168.10.1
<span class="p">$</span> <span class="k">sudo ip netns exec</span> pca ping -c2 192.168.10.1     <span class="c"># same test, real kernel</span>`, 'sm')}
      <div class="box ok">Address, bring up, default route — the same three steps as the Cisco lab, on real networking code. Tear it all down with <span class="nw-m">sudo ip netns del pca</span> and <span class="nw-m">sudo ip link del br-lab</span>.</div>`,
  },

  {
    t: 'Chapter 9 — what you must be able to do',
    body: `${CSS}
      ${kv([
        ['Move', 'between IOS modes and name the mode from the prompt alone'],
        ['Configure', 'hostname, banner, enable secret, console and VTY lines, from memory'],
        ['Explain', 'why <span class="nw-m">enable secret</span> beats <span class="nw-m">enable password</span>, and what type 7 really is'],
        ['Enable', 'SSH with all five prerequisites, and say why each one is required'],
        ['Configure', 'an interface: description, address, <span class="nw-m">no shutdown</span> — and never forget the third'],
        ['Read', 'Status and Protocol as layer 1 and layer 2, and name the fault from the pair'],
        ['Distinguish', '<span class="nw-m">ip default-gateway</span> on a switch from <span class="nw-m">ip route 0.0.0.0 0.0.0.0</span> on a router'],
        ['Build and verify', 'Lab 2.1 bottom-up, stopping at the first failing step'],
        ['★ Do the same', 'on Linux, and make it survive a reboot instead of only working today'],
      ])}`,
  },
];
