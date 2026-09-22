/**
 * nwc204-ch15.mjs — NWC204 Chapter 15: Network Security Fundamentals
 * (FLM buổi 49–50, Cisco Module 16).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 49 và 50.
 *   buổi 49: 15. Network Security Fundamentals · 15.1 Security Threats and
 *            Vulnerabilities · 15.2 Network Attacks — LO: CLO7, CLO9 · ITU: T
 *   buổi 50: 15.3 Network Attack Mitigation · 15.4 Device Security
 *            · 15.5 Integrate AI Tools for Explaining Concepts (Self Learning)
 *            — LO: CLO7, CLO10 · ITU: T
 *   Tài liệu cả hai buổi: "Module 16: Network Security Fundamentals" — "Read Module 16".
 *
 * ⚠️ Buổi 50 là buổi DUY NHẤT trong cả 60 buổi có CLO10 trong cột LO. Đã nêu ở slide 2.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 16, lấy từ việc vận hành VPS thật
 *     (ghi trong CLAUDE.md mục "Vào VPS khi mạng chặn cổng 22", 18/09/2026):
 *     - siết sshd: PasswordAuthentication no + PermitRootLogin prohibit-password
 *     - BẪY THỨ TỰ drop-in: sshd_config lấy giá trị ĐỌC ĐƯỢC ĐẦU TIÊN, glob *.conf
 *       duyệt theo thứ tự chữ cái ⇒ file 70- nói ngược 50-cloud-init.conf là vô nghĩa
 *     - nghiệm thu bằng `sshd -T | grep ^passwordauthentication`, KHÔNG bằng `cat`
 *     - fail2ban chỉ là lớp giảm ồn, không phải ổ khoá
 *     - đừng publish cổng 5432 của Postgres (nối về Chương 10: 172.18.0.0/16)
 *     - container non-root không bind được cổng &lt;1024
 *
 * ⚠️ KHÔNG viết hướng dẫn tấn công. Mọi mục 15.2 viết từ phía PHÒNG THỦ: nhận ra
 *    và chặn, không đưa công cụ/lệnh để thực hiện lên hệ thống người khác.
 *
 * ⚠️ SVG: viewBox="0 0 900 h" width="1150". Chữ đơn cách rộng 0,602 × font-size
 *    ⇒ font 15 tối đa ~99 ký tự/dòng từ x=4; font 14 → 106; font 13 → 114.
 *    Chữ trong &lt;rect&gt; phải NGẮN HƠN rect, đặt bằng CÔNG THỨC chứ không bằng mắt.
 *
 * 26 slide (1 bìa + 25 nội dung); 20 trong số đó là SVG, bảng, terminal hoặc thẻ.
 */
import { CSS, term, kv, code, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch15',
  code: 'NWC204',
  title: 'Ch.15 — Network Security',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: where threats come from ──────────────────────────────────────── */
const ORIGIN = `<svg class="nw-svg" viewBox="0 0 900 250" width="1150" height="319"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Module 16 splits threats by ORIGIN, because origin decides which defence can even see them.</text>
  <g stroke-width="2.5">
    <rect x="20" y="30" width="400" height="120" rx="8" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="480" y="30" width="400" height="120" rx="8" fill="#fff8e8" stroke="#b4690e"/>
  </g>
  <text x="220" y="54" text-anchor="middle" font-size="15" font-weight="800" fill="#8f2c2c">EXTERNAL</text>
  <g font-size="13" fill="#3c5570" text-anchor="middle">
    <text x="220" y="78">no account, no foothold yet</text>
    <text x="220" y="100">arrives over Internet, Wi-Fi or VPN</text>
    <text x="220" y="122">must cross the perimeter first</text>
  </g>
  <text x="220" y="142" text-anchor="middle" font-size="13" font-weight="700" fill="#8f2c2c">the firewall is aimed at these</text>
  <text x="680" y="54" text-anchor="middle" font-size="15" font-weight="800" fill="#7a4708">INTERNAL</text>
  <g font-size="13" fill="#3c5570" text-anchor="middle">
    <text x="680" y="78">staff, contractor, guest, lost laptop</text>
    <text x="680" y="100">a stolen credential that still works</text>
    <text x="680" y="122">already inside the perimeter</text>
  </g>
  <text x="680" y="142" text-anchor="middle" font-size="13" font-weight="700" fill="#7a4708">the firewall never sees this traffic</text>
  <text x="4" y="180" fill="#1b5fa8" font-size="15" font-weight="700">A firewall filters what CROSSES it. Two machines on the same LAN never cross it.</text>
  <text x="4" y="204" fill="#25405e" font-size="14">That single sentence is why section 15.4 Device Security exists at all: the last line of defence</text>
  <text x="4" y="224" fill="#25405e" font-size="14">is the device itself, configured so that being on the same network is not enough.</text>
  <text x="4" y="246" fill="#5d7288" font-size="14">★ On one VPS the split collapses: every container is "internal" to the host that runs it.</text>
</svg>`;

/* ── SVG: the three attack families ────────────────────────────────────── */
const FAMILIES = `<svg class="nw-svg" viewBox="0 0 900 244" width="1150" height="312"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">Module 16 sorts attacks into three families. They usually happen in this order.</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="16" y="32" width="262" height="112" rx="9" stroke="#1b5fa8"/>
    <rect x="319" y="32" width="262" height="112" rx="9" stroke="#b4690e"/>
    <rect x="622" y="32" width="262" height="112" rx="9" stroke="#d94b4b"/>
  </g>
  <g stroke="#8aa0b6" stroke-width="2.5" fill="none">
    <line x1="282" y1="88" x2="309" y2="88"/><polygon points="309,82 321,88 309,94" fill="#8aa0b6" stroke="none"/>
    <line x1="585" y1="88" x2="612" y2="88"/><polygon points="612,82 624,88 612,94" fill="#8aa0b6" stroke="none"/>
  </g>
  <text x="147" y="58" text-anchor="middle" font-size="15" font-weight="800" fill="#1b5fa8">RECONNAISSANCE</text>
  <g font-size="12" fill="#3c5570" text-anchor="middle">
    <text x="147" y="82">find what exists and what</text>
    <text x="147" y="102">version it is running</text>
    <text x="147" y="130">nothing is broken yet</text>
  </g>
  <text x="450" y="58" text-anchor="middle" font-size="15" font-weight="800" fill="#7a4708">ACCESS</text>
  <g font-size="12" fill="#3c5570" text-anchor="middle">
    <text x="450" y="82">use what step 1 found to</text>
    <text x="450" y="102">get in: password, trust,</text>
    <text x="450" y="130">on-path, redirection</text>
  </g>
  <text x="753" y="58" text-anchor="middle" font-size="15" font-weight="800" fill="#8f2c2c">DENIAL OF SERVICE</text>
  <g font-size="12" fill="#3c5570" text-anchor="middle">
    <text x="753" y="82">make the resource unusable</text>
    <text x="753" y="102">for the people entitled to it</text>
    <text x="753" y="130">no account needed at all</text>
  </g>
  <text x="4" y="176" fill="#1b5fa8" font-size="15" font-weight="700">Why the order matters to a defender: step 1 is noisy and harmless, step 2 is quiet and fatal.</text>
  <text x="4" y="200" fill="#25405e" font-size="14">Logs full of failed lookups and refused connections are step 1, and step 1 is the only warning</text>
  <text x="4" y="220" fill="#25405e" font-size="14">you get for free. A firewall that silently drops instead of refusing removes even that warning.</text>
  <text x="4" y="240" fill="#5d7288" font-size="14">DoS is the odd one out: it skips both earlier steps, which is why it is the hardest to prevent.</text>
</svg>`;

/* ── SVG: DoS vs DDoS ──────────────────────────────────────────────────── */
const DDOS = `<svg class="nw-svg" viewBox="0 0 900 252" width="1150" height="322"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">DoS and DDoS differ in one thing only: how many sources, and therefore what you can block.</text>
  <text x="4" y="42" fill="#3c5570" font-size="14" font-weight="700">DoS — one source</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="20" y="52" width="96" height="34" rx="6" stroke="#b4690e"/>
    <rect x="330" y="52" width="110" height="34" rx="6" stroke="#1f9d6b"/>
  </g>
  <text x="68" y="74" text-anchor="middle" font-size="12" font-weight="700" fill="#7a4708">1 source</text>
  <text x="385" y="74" text-anchor="middle" font-size="12" font-weight="700" fill="#14603f">service</text>
  <g stroke="#b4690e" stroke-width="2.5" fill="none">
    <line x1="120" y1="69" x2="318" y2="69"/><polygon points="318,63 330,69 318,75" fill="#b4690e" stroke="none"/>
  </g>
  <text x="470" y="74" font-size="13" fill="#14603f" font-weight="700">one address to block — mitigation is easy</text>
  <text x="4" y="114" fill="#8f2c2c" font-size="14" font-weight="700">DDoS — many sources, none of them the attacker</text>
  <g stroke-width="2" fill="#fff" stroke="#d94b4b">
    <rect x="20" y="126" width="84" height="22" rx="4"/>
    <rect x="20" y="152" width="84" height="22" rx="4"/>
    <rect x="20" y="178" width="84" height="22" rx="4"/>
    <rect x="20" y="204" width="84" height="22" rx="4"/>
  </g>
  <g font-size="10" fill="#8f2c2c" text-anchor="middle">
    <text x="62" y="141">infected host</text><text x="62" y="167">infected host</text>
    <text x="62" y="193">infected host</text><text x="62" y="219">... thousands</text>
  </g>
  <g stroke="#d94b4b" stroke-width="2" fill="none">
    <line x1="108" y1="137" x2="326" y2="172"/><line x1="108" y1="163" x2="326" y2="174"/>
    <line x1="108" y1="189" x2="326" y2="178"/><line x1="108" y1="215" x2="326" y2="180"/>
  </g>
  <rect x="330" y="158" width="110" height="34" rx="6" fill="#fff" stroke="#d94b4b" stroke-width="2.5"/>
  <text x="385" y="180" text-anchor="middle" font-size="12" font-weight="700" fill="#8f2c2c">service</text>
  <text x="470" y="166" font-size="13" fill="#8f2c2c" font-weight="700">every source is a real, innocent machine</text>
  <text x="470" y="188" font-size="13" fill="#3c5570">blocking them blocks real users too</text>
  <text x="4" y="248" fill="#1b5fa8" font-size="14" font-weight="700">The defence is capacity and filtering upstream, not a rule on your own box — your link is already full.</text>
</svg>`;

/* ── SVG: defence in depth ─────────────────────────────────────────────── */
const DEPTH = `<svg class="nw-svg" viewBox="0 0 900 268" width="1150" height="342"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">15.3 Defence in depth: no single layer is trusted to hold, so each one assumes the last failed.</text>
  <g stroke-width="2.5">
    <rect x="20" y="30" width="860" height="36" rx="7" fill="#eaf3fc" stroke="#1b5fa8"/>
    <rect x="60" y="72" width="780" height="36" rx="7" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="100" y="114" width="700" height="36" rx="7" fill="#fff8e8" stroke="#b4690e"/>
    <rect x="140" y="156" width="620" height="36" rx="7" fill="#fdeeee" stroke="#d94b4b"/>
  </g>
  <text x="450" y="53" text-anchor="middle" font-size="14" font-weight="700" fill="#0f2a4a">PERIMETER — firewall, VPN, IPS: what may cross the boundary</text>
  <text x="450" y="95" text-anchor="middle" font-size="14" font-weight="700" fill="#14603f">NETWORK — segmentation, ACLs: what may talk to what inside</text>
  <text x="450" y="137" text-anchor="middle" font-size="14" font-weight="700" fill="#7a4708">DEVICE — 15.4 hardening: who may log in, and how</text>
  <text x="450" y="179" text-anchor="middle" font-size="14" font-weight="700" fill="#8f2c2c">DATA — least privilege, backups, encryption at rest</text>
  <text x="4" y="216" fill="#1b5fa8" font-size="15" font-weight="700">Read it downwards as a question: "if the layer above is already bypassed, what still stops this?"</text>
  <text x="4" y="240" fill="#25405e" font-size="14">An answer of "nothing" at any level is the finding. That is the whole exercise, and it is cheap to run.</text>
  <text x="4" y="262" fill="#5d7288" font-size="14">★ A VPS with one public IP has a very thin perimeter layer — so the device layer carries the weight.</text>
</svg>`;

/* ── SVG: the sshd drop-in ordering trap ───────────────────────────────── */
const DROPIN = `<svg class="nw-svg" viewBox="0 0 900 290" width="1150" height="371"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ sshd_config keeps the FIRST value it reads. The include glob walks *.conf in alphabetical order.</text>
  <text x="4" y="42" fill="#8f2c2c" font-size="14" font-weight="700">What was tried first — and it changed nothing</text>
  <g stroke-width="2">
    <rect x="20" y="52" width="430" height="30" rx="5" fill="#fdeeee" stroke="#d94b4b"/>
    <rect x="20" y="88" width="430" height="30" rx="5" fill="#f4f7fa" stroke="#8aa0b6"/>
  </g>
  <text x="32" y="72" font-size="13" font-weight="700" fill="#8f2c2c">50-cloud-init.conf</text>
  <text x="190" y="72" font-size="12" fill="#3c5570">PasswordAuthentication yes</text>
  <text x="32" y="108" font-size="13" font-weight="700" fill="#5d7288">70-no-password.conf</text>
  <text x="190" y="108" font-size="12" fill="#5d7288">PasswordAuthentication no</text>
  <text x="470" y="72" font-size="13" fill="#8f2c2c" font-weight="700">read FIRST, so this one WINS</text>
  <text x="470" y="108" font-size="13" fill="#5d7288">read second — silently ignored</text>
  <text x="4" y="146" fill="#14603f" font-size="14" font-weight="700">What actually works — win the sort, do not argue with it</text>
  <g stroke-width="2">
    <rect x="20" y="156" width="430" height="30" rx="5" fill="#eefaf4" stroke="#1f9d6b"/>
    <rect x="20" y="192" width="430" height="30" rx="5" fill="#f4f7fa" stroke="#8aa0b6"/>
  </g>
  <text x="32" y="176" font-size="13" font-weight="700" fill="#14603f">01-no-password.conf</text>
  <text x="190" y="176" font-size="12" fill="#14603f">PasswordAuthentication no</text>
  <text x="32" y="212" font-size="13" font-weight="700" fill="#5d7288">50-cloud-init.conf</text>
  <text x="190" y="212" font-size="12" fill="#5d7288">PasswordAuthentication yes</text>
  <text x="470" y="176" font-size="13" fill="#14603f" font-weight="700">read FIRST — this one WINS</text>
  <text x="470" y="212" font-size="13" fill="#5d7288">read second — now IT is ignored</text>
  <text x="4" y="248" fill="#1b5fa8" font-size="15" font-weight="700">The tell-tale: PermitRootLogin applied, PasswordAuthentication did not. Half-applied = a clash.</text>
  <text x="4" y="272" fill="#25405e" font-size="14">Nobody else declared PermitRootLogin, so nothing outranked it. Syntax was never the problem.</text>
</svg>`;

/* ── SVG: do not publish the database port ─────────────────────────────── */
const PGPORT = `<svg class="nw-svg" viewBox="0 0 900 266" width="1150" height="340"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="4" y="16" fill="#0f2a4a" font-size="15" font-weight="700">★ Least exposure, made concrete: publishing a container port is a routing decision, not a setting.</text>
  <text x="4" y="42" fill="#8f2c2c" font-size="14" font-weight="700">ports: "5432:5432" — the database is now on the public Internet</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="20" y="54" width="120" height="36" rx="6" stroke="#d94b4b"/>
    <rect x="300" y="54" width="150" height="36" rx="6" stroke="#d94b4b"/>
    <rect x="610" y="54" width="150" height="36" rx="6" stroke="#d94b4b"/>
  </g>
  <g text-anchor="middle" font-size="12" font-weight="700" fill="#8f2c2c">
    <text x="80" y="76">anyone</text><text x="375" y="76">host :5432</text><text x="685" y="76">postgres</text>
  </g>
  <g stroke="#d94b4b" stroke-width="2.5" fill="none">
    <line x1="144" y1="72" x2="288" y2="72"/><polygon points="288,66 300,72 288,78" fill="#d94b4b" stroke="none"/>
    <line x1="454" y1="72" x2="598" y2="72"/><polygon points="598,66 598,78 610,72" fill="#d94b4b" stroke="none"/>
  </g>
  <text x="216" y="66" text-anchor="middle" font-size="11" fill="#8f2c2c">reachable</text>
  <text x="4" y="122" fill="#14603f" font-size="14" font-weight="700">no ports: line — the database exists only on the container network</text>
  <g stroke-width="2.5" fill="#fff">
    <rect x="20" y="134" width="120" height="36" rx="6" stroke="#8aa0b6"/>
    <rect x="300" y="134" width="150" height="36" rx="6" stroke="#1f9d6b"/>
    <rect x="610" y="134" width="150" height="36" rx="6" stroke="#1f9d6b"/>
  </g>
  <g text-anchor="middle" font-size="12" font-weight="700">
    <text x="80" y="156" fill="#5d7288">anyone</text>
    <text x="375" y="156" fill="#14603f">backend container</text>
    <text x="685" y="156" fill="#14603f">postgres</text>
  </g>
  <g stroke="#1f9d6b" stroke-width="2.5" fill="none">
    <line x1="454" y1="152" x2="598" y2="152"/><polygon points="598,146 610,152 598,158" fill="#1f9d6b" stroke="none"/>
  </g>
  <g stroke="#d94b4b" stroke-width="2.5">
    <line x1="150" y1="138" x2="290" y2="166"/><line x1="290" y1="138" x2="150" y2="166"/>
  </g>
  <text x="470" y="146" font-size="11" fill="#14603f">172.18.0.0/16 only</text>
  <text x="4" y="204" fill="#1b5fa8" font-size="15" font-weight="700">Why it holds: 172.16.0.0/12 is RFC 1918 private. No router on the Internet carries a route to it.</text>
  <text x="4" y="228" fill="#25405e" font-size="14">Chapter 10 proved that with the address plan. Here it stops being a fact and becomes a control.</text>
  <text x="4" y="252" fill="#5d7288" font-size="14">A password on the database is the second lock. Not publishing the port is the first one.</text>
</svg>`;

export const slides = [
  {
    kind: 'cover',
    t: 'Network Security Fundamentals',
    sub: 'Chapter 15 — Cisco Module 16',
    body: `<div class="cov-meta">Sessions 49–50 of 60 · CLO7, CLO9, CLO10 · ITU: T<br>
      15.1 Security Threats and Vulnerabilities · 15.2 Network Attacks<br>
      15.3 Network Attack Mitigation · 15.4 Device Security<br>
      15.5 Integrate AI Tools for Explaining Concepts (Self Learning)<br>
      ★ marks material added by cuongthai.com, taken from running a real server</div>`,
  },

  /* ── session 49 ──────────────────────────────────────────────────────── */
  {
    t: 'Two sessions — and the only CLO10 in the whole course',
    body: `${CSS}
      ${kv([
        ['Session 49', '15.1 Security Threats and Vulnerabilities · 15.2 Network Attacks — LO <b>CLO7, CLO9</b>'],
        ['Session 50', '15.3 Mitigation · 15.4 Device Security · 15.5 AI tools — LO <b>CLO7, CLO10</b>'],
        ['CLO7', '"Implement basic security measures by applying device hardening and configuration techniques to protect network devices and communications."'],
        ['Material', 'Cisco <b>Module 16</b>; the listed student task for both sessions is "Read Module 16"'],
      ])}
      <div class="box warn">Session 50 is the <b>only one of all 60 sessions</b> whose LO column names <b>CLO10</b>. Its twin, session 49, names CLO9 instead — one chapter, two different AI outcomes, two days apart. Quoted as published; not corrected here.</div>`,
  },

  { t: '15.1 Where a threat comes from decides what can stop it', body: `${CSS}${ORIGIN}` },

  {
    t: '15.1 Five words that are not synonyms',
    body: `${CSS}
      <table class="t big2"><tbody>
        <tr><th>Asset</th><td>anything worth protecting: data, a service, a device, a reputation</td></tr>
        <tr><th>Vulnerability</th><td>a weakness that exists whether or not anybody knows about it</td></tr>
        <tr><th>Threat</th><td>someone or something that could act on that weakness</td></tr>
        <tr><th>Exploit</th><td>the concrete method that turns the weakness into an entry</td></tr>
        <tr><th>Risk</th><td>likelihood × impact — the only one of the five you can accept on purpose</td></tr>
      </tbody></table>
      <div class="box">Use them precisely and a sentence becomes testable. "The server is vulnerable" cannot be acted on. "Password login is enabled on a host with a public address, and the logs show attempts hourly" names the vulnerability, the threat and the evidence in one line.</div>`,
  },

  {
    t: '15.1 Cisco groups vulnerabilities into three kinds',
    body: `${CSS}
      <table class="t"><thead><tr><th>Category</th><th>Example</th><th>Fixed by</th></tr></thead>
      <tbody>
        <tr><td class="hl">Technological</td><td>a flaw in a protocol or an operating system</td><td>patching, and choosing protocols with authentication</td></tr>
        <tr><td class="hl">Configuration</td><td>default password left in place, unused service left running</td><td>hardening — section 15.4</td></tr>
        <tr><td class="hl">Policy</td><td>no rule for who gets access, or no rule for revoking it</td><td>people and process, not a command</td></tr>
      </tbody></table>
      <div class="box ok">The middle row is the one you can fix today, for free, on every device you own. Most real incidents in small networks start there rather than at an unpatched protocol flaw — which is exactly why the syllabus spends a whole section on device hardening.</div>`,
  },

  {
    t: '15.1 Malware, by what it needs from you',
    body: `${CSS}
      <table class="t"><thead><tr><th>Kind</th><th>How it spreads</th><th>What gives it away</th></tr></thead>
      <tbody>
        <tr><td class="hl">Virus</td><td>attaches to a file; needs a human to run it</td><td>files changed with no reason</td></tr>
        <tr><td class="hl">Worm</td><td><b>spreads by itself</b> over the network, no human needed</td><td>traffic and CPU rising with no user activity</td></tr>
        <tr><td class="hl">Trojan</td><td>arrives disguised as something wanted</td><td>a program that asks for rights it should not need</td></tr>
        <tr><td>Ransomware</td><td>any of the above, then encrypts</td><td>backups are the only answer that works</td></tr>
        <tr><td>Spyware</td><td>installs quietly, reports outwards</td><td>outbound connections nobody asked for</td></tr>
      </tbody></table>
      <div class="box warn">The row that changes how you design a network is <b>worm</b>: it needs no click, so "our users are careful" is not a defence. Segmentation is — a worm can only reach what the network lets it reach.</div>`,
  },

  { t: '15.2 Three families of attack, in the order they happen', body: `${CSS}${FAMILIES}` },

  {
    t: '15.2 Reconnaissance, seen from the defending side',
    body: `${CSS}
      ${kv([
        ['What it is', 'mapping what exists before touching anything — addresses, open ports, versions'],
        ['Why it is legal-looking', 'the same lookups an administrator runs; the tools are ordinary'],
        ['In your logs', 'many refused connections from one source, or one probe each to many ports'],
        ['★ On a public VPS', 'this is constant background noise, not a targeted event'],
        ['What reduces it', 'expose fewer ports; a service that is not reachable cannot be surveyed'],
      ])}
      <div class="box">The school's own question <b>CQ18.2</b> asks which attack type "may involve the use of tools such as nslookup and fping" — the answer is reconnaissance, and the point of the question is that the tools are the <em>diagnostic</em> ones from Chapter 12. A tool is not an attack; using it against something that is not yours is.</div>`,
  },

  {
    t: '15.2 Access attacks — four shapes worth recognising',
    body: `${CSS}
      <table class="t"><thead><tr><th>Shape</th><th>What it abuses</th><th>What removes it</th></tr></thead>
      <tbody>
        <tr><td class="hl">Password</td><td>guessable or reused credentials</td><td>keys instead of passwords; rate limits</td></tr>
        <tr><td class="hl">Trust exploitation</td><td>"inside" hosts trusted by position alone</td><td>authenticate every hop, trust no address</td></tr>
        <tr><td class="hl">Port redirection</td><td>a compromised host used as a stepping stone</td><td>segmentation; least privilege per host</td></tr>
        <tr><td class="hl">On-path</td><td>traffic that can be read or altered in transit</td><td>encryption with verified identity</td></tr>
      </tbody></table>
      <div class="box ok">Every right-hand cell is something you configure once. That is the whole argument of section 15.4: hardening is not a reaction to an attack, it is the state a device should already be in.</div>`,
  },

  { t: '15.2 Denial of service — and why the extra D changes everything', body: `${CSS}${DDOS}` },

  /* ── session 50 ──────────────────────────────────────────────────────── */
  { t: '15.3 Defence in depth — the layer model of mitigation', body: `${CSS}${DEPTH}` },

  {
    t: '15.3 What is being protected: the three properties',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>Confidentiality</b><p>only the intended reader can read it. Broken by on-path attacks and by plaintext protocols.</p></div>
        <div class="card"><b>Integrity</b><p>it arrives unaltered, and you can tell. Broken by spoofing and by unsigned data.</p></div>
        <div class="card"><b>Availability</b><p>it is there when entitled users need it. Broken by DoS — and by your own bad change.</p></div>
      </div>
      <div class="box">Name the property before choosing a control. Encryption buys confidentiality and, with a signature, integrity — it buys <b>no availability at all</b>. A DoS against an encrypted service works exactly as well. Controls are not interchangeable, and matching the wrong one to the wrong property is the most common design error in this chapter.</div>`,
  },

  {
    t: '15.3 The mitigation toolkit Module 16 names',
    body: `${CSS}
      <table class="t"><thead><tr><th>Tool</th><th>Job</th><th>Property it serves</th></tr></thead>
      <tbody>
        <tr><td class="hl">Firewall</td><td>decides what may cross a boundary</td><td>confidentiality, availability</td></tr>
        <tr><td class="hl">VPN</td><td>an encrypted tunnel over an untrusted path</td><td>confidentiality, integrity</td></tr>
        <tr><td>IPS</td><td>inspects traffic and can block a known pattern</td><td>integrity, availability</td></tr>
        <tr><td>ESA / WSA</td><td>filters email and web content</td><td>confidentiality</td></tr>
        <tr><td class="hl">AAA</td><td>authentication, authorization, accounting</td><td>all three, plus an audit trail</td></tr>
      </tbody></table>
      <div class="box ok">The school's <b>CQ18.1</b> and <b>CQ18.3</b> both point at the first row: the tool "designed to protect against unauthorized communications to and from a computer" is the <b>firewall</b>. Note "and from" — outbound filtering is what catches a host that is already compromised.</div>`,
  },

  {
    t: '15.3 Three habits that outrank every appliance',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>Backup</b> — and restore one. An untested backup is a belief, not a control. It is the only defence against ransomware that does not depend on catching anything.</span></div>
        <div><span class="n">2</span><span><b>Update and patch</b> — most exploited vulnerabilities are old and already fixed. Patching converts a technological vulnerability into no vulnerability.</span></div>
        <div><span class="n">3</span><span><b>Authenticate</b> — every device, every service, every hop. Trust by network position is what trust exploitation eats.</span></div>
      </div>
      <div class="box warn">None of the three needs a purchase, and all three outrank the appliance row on the previous slide. A network with an IPS and no tested backup is worse defended than one with backups and no IPS.</div>`,
  },

  {
    t: '15.4 Device security — the hardening checklist',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span>Change every default credential, and remove accounts nobody uses.</span></div>
        <div><span class="n">2</span><span>Turn off services that are not needed — each one is an entrance you are not watching.</span></div>
        <div><span class="n">3</span><span>Replace plaintext management with encrypted: <b>SSH, never Telnet</b>.</span></div>
        <div><span class="n">4</span><span>Restrict who may connect, and from where.</span></div>
        <div><span class="n">5</span><span>Log, keep the logs somewhere else, and read them.</span></div>
        <div><span class="n">6</span><span>Patch the device software on a schedule, not on an incident.</span></div>
      </div>
      <div class="box">This is the list CQ17.1 is asking about — "why basic security measure are necessary on network devices" — even though the school prints that question against session 49, a day before section 15.4 is taught.</div>`,
  },

  {
    t: '15.4 Hardening a Cisco device, from enable onwards',
    body: `${term(`<span class="p">Router&gt;</span> <span class="k">enable</span>
<span class="p">Router#</span> <span class="k">configure terminal</span>
<span class="c">! 1 — a secret for privileged mode, hashed rather than reversible</span>
<span class="p">Router(config)#</span> <span class="k">enable secret</span> &lt;strong-secret&gt;
<span class="c">! 2 — encrypt the remaining plaintext passwords in the running config</span>
<span class="p">Router(config)#</span> <span class="k">service password-encryption</span>
<span class="c">! 3 — a minimum length, so a weak one cannot be typed by accident</span>
<span class="p">Router(config)#</span> <span class="k">security passwords min-length</span> 10
<span class="c">! 4 — lock the console port too; physical access is still access</span>
<span class="p">Router(config)#</span> <span class="k">line console 0</span>
<span class="p">Router(config-line)#</span> <span class="k">password</span> &lt;console-password&gt;
<span class="p">Router(config-line)#</span> <span class="k">login</span>
<span class="p">Router(config-line)#</span> <span class="k">exec-timeout</span> 5 0
<span class="c">! 5 — a banner: no welcome, just notice of authorised use only</span>
<span class="p">Router(config)#</span> <span class="k">banner motd</span> #Authorized access only#`, 'sm')}
      <div class="box">Step 4 is the one people skip. An unlocked console means the hardening above it is decoration for anyone standing in the room.</div>`,
  },

  {
    t: '15.4 SSH instead of Telnet, and proving it took',
    body: `${term(`<span class="c">! Telnet sends the password in cleartext. SSH is not an upgrade, it is the baseline.</span>
<span class="p">Router(config)#</span> <span class="k">hostname</span> R1
<span class="p">R1(config)#</span> <span class="k">ip domain-name</span> example.local
<span class="p">R1(config)#</span> <span class="k">crypto key generate rsa</span> modulus 2048
<span class="p">R1(config)#</span> <span class="k">ip ssh version</span> 2
<span class="p">R1(config)#</span> <span class="k">username</span> admin <span class="k">secret</span> &lt;strong-secret&gt;
<span class="p">R1(config)#</span> <span class="k">line vty 0 4</span>
<span class="p">R1(config-line)#</span> <span class="k">transport input ssh</span>   <span class="c">! ssh ONLY — telnet is now refused</span>
<span class="p">R1(config-line)#</span> <span class="k">login local</span>
<span class="p">R1(config-line)#</span> <span class="k">exec-timeout</span> 5 0

<span class="c">! Verify. Do not trust the config you just typed — ask the device.</span>
<span class="p">R1#</span> <span class="k">show ip ssh</span>
<span class="g">SSH Enabled - version 2.0</span>
<span class="p">R1#</span> <span class="k">show run | section line vty</span>
<span class="g">transport input ssh</span>`, 'sm')}
      <div class="box ok"><b>transport input ssh</b> is the line that matters. Configuring SSH while leaving Telnet permitted changes nothing: an attacker simply uses the door that is still open.</div>`,
  },

  {
    t: '★ The same idea on a Linux server you actually run',
    body: `${CSS}
      ${code(`# /etc/ssh/sshd_config.d/01-no-password.conf
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password`, 'ini', 'sm')}
      ${kv([
        ['Line 1', 'no password may be offered at all — only a key is accepted'],
        ['Line 2', 'closes the keyboard-interactive route, which is a second way to ask for one'],
        ['Line 3', 'root may log in <b>by key</b>, never by password'],
        ['The cost', 'lose the key and there is no password door left to rescue you — enrol a second key first'],
      ])}
      <div class="box warn">This is exactly step 3 of the Cisco checklist, on a different operating system: <b>authenticate with something that cannot be guessed.</b> A password can be brute-forced at whatever rate the network allows; a key cannot.</div>`,
  },

  { t: '★ Why the obvious version of that change does nothing', body: `${CSS}${DROPIN}` },

  {
    t: '★ Verify by asking the daemon, never by reading the file',
    body: `${term(`<span class="p">$</span> <span class="k">sshd -T</span> | <span class="k">grep</span> ^passwordauthentication
<span class="r">passwordauthentication yes</span>        <span class="c"># the 70- file was written, and lost the sort</span>

<span class="c"># rename it so it sorts first, reload, then ask again</span>
<span class="p">$</span> <span class="k">sshd -T</span> | <span class="k">grep</span> ^passwordauthentication
<span class="g">passwordauthentication no</span>         <span class="c"># now it is in force</span>
<span class="p">$</span> <span class="k">sshd -T</span> | <span class="k">grep</span> ^permitrootlogin
<span class="g">permitrootlogin prohibit-password</span>

<span class="c"># last step: prove the old door is shut, from another machine</span>
<span class="p">$</span> ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no user@host
<span class="g">Permission denied (publickey).</span>`, 'sm')}
      <div class="box warn"><b>sshd -T</b> prints the settings in force after every include and every override. <b>cat</b> prints one file's wishes. The command returned 0, the file said the right thing, and the setting was not applied — twice. The general rule, and it is bigger than SSH: <b>"written" and "exit code 0" do not mean "in effect".</b></div>`,
  },

  {
    t: '★ fail2ban is noise reduction, not the lock',
    body: `${CSS}
      ${kv([
        ['What it does', 'reads auth logs, and firewalls an address after N failures in M minutes'],
        ['What that buys', 'smaller logs, less CPU spent refusing — real, and worth having'],
        ['What it does NOT buy', 'protection, once passwords are already disabled: every attempt fails anyway'],
        ['The order that matters', 'keys first, then fail2ban. Never fail2ban instead of keys.'],
        ['The risk of getting it backwards', 'a ban list that makes a password-enabled host feel safe'],
      ])}
      <div class="box">A ban after five failures still permits five guesses per window, forever, from every address on Earth. With <span class="nw-m">PasswordAuthentication no</span> the number of useful guesses is <b>zero</b>, from everywhere, immediately. One of those is a rate limit; the other is a closed door.</div>`,
  },

  { t: '★ Least exposure: do not publish the database port', body: `${CSS}${PGPORT}` },

  {
    t: '★ Least privilege, and the port number that proves it',
    body: `${CSS}
      ${code(`# Dockerfile — stop being root before the application starts
RUN adduser --system --uid 10001 app
USER app
EXPOSE 3000        # not 80: an unprivileged process cannot bind below 1024`, 'bash', 'sm')}
      ${kv([
        ['The rule', 'on Linux, ports 1–1023 may only be bound by a privileged process'],
        ['The consequence', 'a non-root container <b>cannot</b> listen on 80 or 443 — by design'],
        ['The right answer', 'listen high, let the reverse proxy own 443 and forward inwards'],
        ['The wrong answer', 'run the container as root so the number looks tidy'],
      ])}
      <div class="box ok">"Permission denied" when binding port 80 is not a bug to work around. It is least privilege reporting that it is switched on — the same principle as <span class="nw-m">enable secret</span>: hold only the rights the job needs, for as long as it needs them.</div>`,
  },

  {
    t: '15.5 AI tools for this chapter — and one hard limit',
    body: `${CSS}
      <div class="two">
        <div class="box ok"><b>Good use</b><br><span class="note">"Explain why sshd keeps the first value it reads."<br>"What does an on-path attack abuse at layer 2?"<br>"Turn Module 16 into a hardening checklist I can tick."</span></div>
        <div class="box warn"><b>Bad use</b><br><span class="note">Asking for, or accepting, a security change you cannot verify yourself with one command afterwards.</span></div>
      </div>
      <div class="box">Session 50 carries <b>CLO10</b>, which is about using AI to collaborate, design and <em>present</em> — assessed by dialogue. That format is unforgiving of borrowed answers: you are asked why, and then why again. The defence is to run the verification yourself, so the reason you give is one you measured.</div>`,
  },

  {
    t: 'The school\'s question table drifts hardest here',
    body: `${CSS}
      ${kv([
        ['Session 49 → CQ17.1', '"Why basic security measure are necessary on network devices?" — that is <b>15.4</b>, taught in session 50'],
        ['Session 50 → CQ17.2', '"How to detect vulnerabilities ... and technical mitigation?" — that is <b>15.1–15.3</b>, both sessions'],
        ['Session 52 → CQ18.1', 'most effective tool against external threats — the <b>firewall</b>, section 15.3'],
        ['Session 54 → CQ18.3', 'component protecting against unauthorized communications — the <b>firewall</b> again'],
        ['Session 55 → CQ19.1', 'threat that stops authorized users reaching resources — <b>DoS</b>, section 15.2'],
      ])}
      <div class="box warn">Three of this chapter's questions are printed against sessions that teach <b>Chapter 16</b>, and the two printed here point at the wrong half of this chapter. The drift has run about one chapter behind since session 19. Answer them by topic, not by the session number beside them.</div>`,
  },

  {
    t: 'What you can do now, and what comes next',
    body: `${CSS}
      ${kv([
        ['Separate', 'asset, vulnerability, threat, exploit and risk — and say which one you are fixing'],
        ['Classify', 'an attack as reconnaissance, access or denial of service, and say what that rules out'],
        ['Explain', 'why spoofing works at every layer, and why encryption is always an addition'],
        ['Harden', 'a Cisco device from <b>enable</b> onwards, with SSH only on the vty lines'],
        ['Harden', '★ a Linux host: key-only login, and the drop-in named so it wins the sort'],
        ['Verify', '★ with <span class="nw-m">sshd -T</span> and <span class="nw-m">show ip ssh</span> — never by re-reading what you wrote'],
        ['Argue', '★ why fail2ban, an unpublished port and a non-root user are three different controls'],
      ])}
      <div class="box ok">Next: <b>Chapter 16 — Build a Small Network</b> (sessions 54–55, Cisco Module 17). Devices, protocols, scaling, verification and a troubleshooting method — the chapter where everything from Chapters 1 to 15 is assembled into one working design.</div>`,
  },
];
