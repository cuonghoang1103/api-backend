/**
 * nwc204-ch04.mjs — NWC204 Chapter 4: Physical Layer
 * (FLM buổi 11–12 lý thuyết + buổi 13–14 Lab 1.3, Cisco Module 4).
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH; phần giảng song ngữ nằm ở bài học dưới ảnh.
 * Nguồn dàn bài: content/academy/_syllabus-flm/NWC204.json — buổi 11, 12, 13, 14.
 *
 * Người học yêu cầu slide THIÊN VỀ SƠ ĐỒ: 20/23 slide ở đây là sơ đồ, SVG hoặc bảng.
 */
import { CSS, stack, pkt, topo, flow, term, kv, m } from './_nwc-chung.mjs';

export const deck = {
  key: 'nwc204-ch04',
  code: 'NWC204',
  title: 'Ch.4 — Physical Layer',
  sub: 'NWC204 · Computer Networking · cuongthai.com',
};

/* ── SVG: NRZ vs Manchester encoding of the same five bits ───────────────── */
const SIG = `<svg class="nw-svg" viewBox="0 0 700 250" width="880" height="314"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <g stroke="#cfe0f0" stroke-width="1" stroke-dasharray="4 4">
    <line x1="100" y1="20" x2="100" y2="240"/><line x1="200" y1="20" x2="200" y2="240"/>
    <line x1="300" y1="20" x2="300" y2="240"/><line x1="400" y1="20" x2="400" y2="240"/>
    <line x1="500" y1="20" x2="500" y2="240"/><line x1="600" y1="20" x2="600" y2="240"/>
  </g>
  <g fill="#0f2a4a" font-size="20" font-weight="700" text-anchor="middle">
    <text x="150" y="18">1</text><text x="250" y="18">0</text><text x="350" y="18">1</text>
    <text x="450" y="18">1</text><text x="550" y="18">0</text>
  </g>
  <text x="8" y="70" fill="#1b5fa8" font-size="17" font-weight="700">NRZ</text>
  <polyline fill="none" stroke="#1b5fa8" stroke-width="3.5"
    points="100,45 200,45 200,95 300,95 300,45 500,45 500,95 600,95"/>
  <text x="8" y="175" fill="#1f9d6b" font-size="17" font-weight="700">Manchester</text>
  <polyline fill="none" stroke="#1f9d6b" stroke-width="3.5"
    points="100,200 150,200 150,150 250,150 250,200 350,200 350,150 400,150 400,200 450,200 450,150 550,150 550,200 600,200"/>
  <g stroke="#b4690e" stroke-width="2" stroke-dasharray="3 3">
    <line x1="150" y1="140" x2="150" y2="215"/><line x1="250" y1="140" x2="250" y2="215"/>
    <line x1="350" y1="140" x2="350" y2="215"/><line x1="450" y1="140" x2="450" y2="215"/>
    <line x1="550" y1="140" x2="550" y2="215"/>
  </g>
  <text x="350" y="240" fill="#b4690e" font-size="16" text-anchor="middle">a transition in the middle of every bit = the receiver recovers the clock</text>
</svg>`;

/* ── SVG: why twisted pairs cancel interference ──────────────────────────── */
const TWIST = `<svg class="nw-svg" viewBox="0 0 700 200" width="860" height="246"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <text x="8" y="26" fill="#0f2a4a" font-size="16" font-weight="700">Parallel — noise hits the near wire harder</text>
  <g stroke="#d94b4b" stroke-width="2.5">
    <line x1="200" y1="32" x2="200" y2="48"/><line x1="360" y1="32" x2="360" y2="48"/>
    <line x1="520" y1="32" x2="520" y2="48"/>
  </g>
  <text x="545" y="46" fill="#d94b4b" font-size="15" font-weight="700">noise</text>
  <line x1="40" y1="52" x2="660" y2="52" stroke="#1b5fa8" stroke-width="3"/>
  <line x1="40" y1="76" x2="660" y2="76" stroke="#8aa0b6" stroke-width="3"/>
  <text x="8" y="120" fill="#0f2a4a" font-size="16" font-weight="700">Twisted — each wire takes the same noise in turn</text>
  <path d="M40,160 Q70,130 100,160 Q130,190 160,160 Q190,130 220,160 Q250,190 280,160 Q310,130 340,160 Q370,190 400,160 Q430,130 460,160 Q490,190 520,160 Q550,130 580,160 Q610,190 640,160"
    fill="none" stroke="#1b5fa8" stroke-width="3"/>
  <path d="M40,160 Q70,190 100,160 Q130,130 160,160 Q190,190 220,160 Q250,130 280,160 Q310,190 340,160 Q370,130 400,160 Q430,190 460,160 Q490,130 520,160 Q550,190 580,160 Q610,130 640,160"
    fill="none" stroke="#8aa0b6" stroke-width="3"/>
  <text x="350" y="196" fill="#1f9d6b" font-size="15" text-anchor="middle" font-weight="700">equal noise on both wires = the receiver cancels it</text>
</svg>`;

/* ── SVG: fibre cross-section and a ray bouncing down the core ───────────── */
const FIBRE = `<svg class="nw-svg" viewBox="0 0 700 190" width="900" height="244"
  xmlns="http://www.w3.org/2000/svg" font-family="SF Mono,Menlo,monospace">
  <rect x="130" y="20" width="550" height="150" fill="#f2f7fd" stroke="#6b8199" stroke-width="2.5"/>
  <rect x="130" y="45" width="550" height="100" fill="#eaf3fc" stroke="#1b5fa8" stroke-width="2.5"/>
  <rect x="130" y="80" width="550" height="30" fill="#fff5d6" stroke="#b4690e" stroke-width="2.5"/>
  <text x="122" y="36" font-size="16" text-anchor="end" fill="#5d7288" font-weight="700">jacket</text>
  <text x="122" y="62" font-size="16" text-anchor="end" fill="#1b5fa8" font-weight="700">cladding</text>
  <text x="122" y="100" font-size="16" text-anchor="end" fill="#b4690e" font-weight="700">core</text>
  <polyline fill="none" stroke="#e0952a" stroke-width="3"
    points="130,108 180,82 230,108 280,82 330,108 380,82 430,108 480,82 530,108 580,82 630,108 680,88"/>
  <g fill="#1f9d6b" font-size="15" font-weight="700">
    <text x="405" y="72" text-anchor="middle">light bounces — total internal reflection</text>
    <text x="405" y="136" text-anchor="middle">cladding index is LOWER than the core index</text>
  </g>
  <text x="405" y="165" font-size="15" fill="#5d7288" text-anchor="middle">core ≈ 9 µm single-mode · ≈ 50 or 62.5 µm multimode</text>
</svg>`;

/* dải màu cho bảng T568A/T568B — nền màu + chữ đọc được trên nền đó */
const w = (bg, fg, t) => `<td style="background:${bg};color:${fg};font-weight:700">${t}</td>`;

export const slides = [
  {
    kind: 'cover',
    t: 'The Physical Layer',
    sub: 'Chapter 4 — Cisco Module 4',
    body: `<div class="cov-meta">Sessions 11–12 (theory) + 13–14 (Lab 1.3) of 60 · CLO4, CLO9<br>
      Purpose · Characteristics · Copper Cabling · UTP<br>
      Fibre-Optic Cabling · Wireless Media<br>
      Lab 1.3 — View Wired and Wireless NIC Information</div>`,
  },

  /* ── 4.1 Purpose ─────────────────────────────────────────────────────── */
  {
    t: 'Where encapsulation finally ends',
    body: `${CSS}
      ${stack([
        ['L4', 'Application', 'data — an HTTP GET'],
        ['L3', 'Transport', 'segment — ports added'],
        ['L2', 'Internet', 'packet — IP addresses added'],
        ['L1', 'Network Access', 'frame, then BITS on the medium', true],
      ])}
      ${kv([
        ['The physical layer', 'turns a finished frame into signals, and back again'],
        ['It carries no addresses', 'it has no idea what a MAC or an IP is'],
        ['It only answers', 'did this bit arrive as a 1 or as a 0?'],
      ])}`,
  },

  {
    t: 'Three components, three failure points',
    body: `${CSS}
      ${topo([
        'nd.cl:NIC|transmits and receives',
        'lk:connector<br>RJ-45, LC, SC',
        'nd:Media|copper · fibre · radio',
        'lk:connector',
        'nd.cl:NIC|the far end',
      ])}
      <div class="grid3">
        <div class="card"><b>NIC</b><p>Encodes bits into signals. Negotiates speed and duplex.</p></div>
        <div class="card"><b>Connector</b><p>Mechanical fit and pin order. The most common physical fault.</p></div>
        <div class="card"><b>Media</b><p>The path itself. Has a hard distance limit.</p></div>
      </div>
      <p class="note">A "link down" is always one of these three. Swap one at a
      time, never two.</p>`,
  },

  {
    t: 'Who standardises Layer 1',
    body: `${CSS}
      <table class="t">
        <tr><th>Body</th><th>Standard</th><th>What it fixes</th></tr>
        <tr><td><b>ISO</b></td><td>ISO/IEC 11801</td><td>Generic structured cabling for buildings</td></tr>
        <tr><td><b>IEEE</b></td><td>802.3 · 802.11</td><td>Ethernet and Wi-Fi: signalling, speeds, frame timing</td></tr>
        <tr><td><b>TIA / EIA</b></td><td class="hl">TIA-568</td><td>UTP categories, RJ-45 pinout, T568A / T568B</td></tr>
        <tr><td><b>ITU-T</b></td><td>G.652, G.651</td><td>Single-mode and multimode optical fibre</td></tr>
        <tr><td><b>ANSI</b></td><td>Fibre Channel</td><td>Storage networking over fibre</td></tr>
      </table>
      <p class="note">Layer 1 is the <b>only</b> layer with a mechanical standard —
      a connector that does not physically fit has no software workaround.</p>`,
  },

  {
    t: 'Four numbers people confuse',
    body: `${CSS}
      ${kv([
        ['Bandwidth', 'the capacity the medium is RATED for — 1 Gbps on Cat 5e'],
        ['Throughput', 'what you actually measure right now — always lower'],
        ['Goodput', 'throughput minus headers and retransmissions — your real files'],
        ['Latency', 'the delay for one bit to make the trip — independent of the others'],
      ])}
      ${flow('Your PC', 'Server', [
        ['r', '1 Gbps rated link', 'bandwidth — a property of the cable and NIC'],
        ['r', '380 Mbps measured', 'throughput — busy switch, half-duplex, distance'],
        ['r', '355 Mbps of file', 'goodput — the rest was TCP and IP headers'],
      ])}
      <div class="box warn">A fast link with high latency still feels slow. Fibre to
      another continent has huge bandwidth and ~150 ms of unavoidable delay.</div>`,
  },

  {
    t: 'Reading the units without being fooled',
    body: `${CSS}
      <table class="t">
        <tr><th>Unit</th><th>Means</th><th>Where you see it</th></tr>
        <tr><td><b>bps</b></td><td>bits per second</td><td>Link speed, ISP contract</td></tr>
        <tr><td><b>Bps</b> (capital B)</td><td>BYTES per second = 8 bps</td><td>Download manager</td></tr>
        <tr><td>kbps / Mbps / Gbps</td><td>thousand / million / billion bps</td><td>NIC, switch port</td></tr>
        <tr><td class="hl">100 Mbps link</td><td class="hl">≈ 12.5 MB/s at best</td><td class="hl">Divide by 8 before you complain</td></tr>
        <tr><td>Latency</td><td>milliseconds, one way or round trip</td><td><span class="nw-m">ping</span> reports round trip</td></tr>
      </table>
      <p class="note">Half of all "the internet is slow" tickets end here: a
      100 Mbps line copying at 12 MB/s is working perfectly.</p>`,
  },

  {
    t: 'Encoding: how a bit becomes a signal',
    body: `${CSS}
      ${SIG}
      <p class="note">NRZ is simple but a long run of identical bits leaves the
      receiver with no edge to synchronise on. Manchester guarantees one edge per
      bit — the cost is twice the signalling rate.</p>`,
  },

  /* ── 4.3 Copper ──────────────────────────────────────────────────────── */
  {
    t: 'Three kinds of copper cable',
    body: `${CSS}
      <table class="t">
        <tr><th>Cable</th><th>Build</th><th>Max length</th><th>Used for</th></tr>
        <tr><td class="hl"><b>UTP</b></td><td>4 twisted pairs, no shield</td><td class="hl">100 m</td><td>Almost every LAN drop</td></tr>
        <tr><td><b>STP</b></td><td>Twisted pairs + foil / braid shield</td><td>100 m</td><td>Factories, near motors</td></tr>
        <tr><td><b>Coaxial</b></td><td>One core + braided shield</td><td>Hundreds of m</td><td>Cable modem, antennas, CCTV</td></tr>
      </table>
      ${kv([
        ['Why 100 m and not 120', 'attenuation plus the timing budget Ethernet needs to detect a collision'],
        ['Shield only works', 'when it is grounded at the right end — an ungrounded shield is an antenna'],
      ])}`,
  },

  {
    t: 'What actually damages a copper signal',
    body: `${CSS}
      <div class="grid3">
        <div class="card"><b>Attenuation</b><p>The signal fades with distance until the receiver can no longer tell 1 from 0.</p></div>
        <div class="card"><b>EMI / RFI</b><p>Motors, fluorescent lights, radios push noise onto the wire from outside.</p></div>
        <div class="card"><b>Crosstalk</b><p>One pair leaks into its neighbour inside the same cable.</p></div>
      </div>
      ${kv([
        ['Symptom you will see', 'the link stays UP but the error counters climb'],
        ['Where to look', 'an interface counter, not a ping — ping only shows total loss'],
        ['The fix order', 'shorten the run · re-terminate the plug · move away from the motor · go fibre'],
      ])}`,
  },

  {
    t: 'Why twisting works at all',
    body: `${CSS}
      ${TWIST}
      <p class="note">The two wires of a pair carry the <b>same signal with opposite
      polarity</b>. Noise hits both equally; the receiver subtracts one from the
      other, the noise cancels and the signal doubles. More twists per metre = a
      higher category.</p>`,
  },

  {
    t: 'UTP categories — what each one buys you',
    body: `${CSS}
      <table class="t">
        <tr><th>Category</th><th>Bandwidth</th><th>Speed</th><th>Reach</th><th>Status</th></tr>
        <tr><td>Cat 3</td><td>16 MHz</td><td>10 Mbps</td><td>100 m</td><td>Telephone only</td></tr>
        <tr><td>Cat 5</td><td>100 MHz</td><td>100 Mbps</td><td>100 m</td><td>Obsolete</td></tr>
        <tr><td class="hl">Cat 5e</td><td>100 MHz</td><td class="hl">1 Gbps</td><td>100 m</td><td>The office minimum</td></tr>
        <tr><td>Cat 6</td><td>250 MHz</td><td>1 Gbps (10 G to 55 m)</td><td>100 m</td><td>Common new build</td></tr>
        <tr><td class="hl">Cat 6a</td><td>500 MHz</td><td class="hl">10 Gbps</td><td>100 m</td><td>Data centre edge</td></tr>
        <tr><td>Cat 7 / 7a</td><td>600 / 1000 MHz</td><td>10 Gbps</td><td>100 m</td><td>Shielded, niche</td></tr>
        <tr><td>Cat 8</td><td>2000 MHz</td><td>25–40 Gbps</td><td>30 m</td><td>Rack to rack only</td></tr>
      </table>`,
  },

  /* ── 4.4 UTP ─────────────────────────────────────────────────────────── */
  {
    t: 'The RJ-45 pinout — eight pins, four pairs',
    body: `${CSS}
      ${pkt([
        ['Pin 1', 'pair 2 +', 'hl'], ['Pin 2', 'pair 2 −', 'hl'],
        ['Pin 3', 'pair 3 +', 'pay'], ['Pin 4', 'pair 1 +', ''],
        ['Pin 5', 'pair 1 −', ''], ['Pin 6', 'pair 3 −', 'pay'],
        ['Pin 7', 'pair 4 +', ''], ['Pin 8', 'pair 4 −', ''],
      ])}
      ${kv([
        ['10/100 Mbps Ethernet', 'uses pins 1-2 and 3-6 only — two pairs'],
        ['1 Gbps and above', 'uses all four pairs, each one bidirectional'],
        ['Note the odd order', 'pair 3 is split across pins 3 and 6, around pair 1'],
      ])}
      <div class="box warn">Wire pins 3 and 6 from different pairs and a 100 Mbps
      link still comes up — then fails under load. The commonest bad crimp there is.</div>`,
  },

  {
    t: 'T568A vs T568B — the colour order',
    body: `${CSS}
      <table class="t" style="font-size:19px">
        <tr><th>Pin</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
        <tr><th>T568A</th>
          ${w('#e8f7ec', '#14532d', 'wh/green')}${w('#1f9d6b', '#fff', 'green')}
          ${w('#fff1e0', '#7a4708', 'wh/orange')}${w('#2b6cb0', '#fff', 'blue')}
          ${w('#e3eefb', '#123a63', 'wh/blue')}${w('#e0952a', '#3a2503', 'orange')}
          ${w('#f0e9e2', '#4a3423', 'wh/brown')}${w('#7a5230', '#fff', 'brown')}</tr>
        <tr><th>T568B</th>
          ${w('#fff1e0', '#7a4708', 'wh/orange')}${w('#e0952a', '#3a2503', 'orange')}
          ${w('#e8f7ec', '#14532d', 'wh/green')}${w('#2b6cb0', '#fff', 'blue')}
          ${w('#e3eefb', '#123a63', 'wh/blue')}${w('#1f9d6b', '#fff', 'green')}
          ${w('#f0e9e2', '#4a3423', 'wh/brown')}${w('#7a5230', '#fff', 'brown')}</tr>
      </table>
      ${kv([
        ['The only difference', 'the green pair and the orange pair swap places — pins 4, 5, 7, 8 are identical'],
        ['Which one to use', 'either — but the SAME one at both ends of a straight-through cable'],
        ['In practice', 'T568B dominates commercial installations; pick one and label the rack'],
      ])}`,
  },

  {
    t: 'Straight-through, crossover, rollover',
    body: `${CSS}
      <table class="t">
        <tr><th>Cable</th><th>End 1 / End 2</th><th>Connects</th></tr>
        <tr><td class="hl"><b>Straight-through</b></td><td>T568B / T568B</td><td>PC↔switch · switch↔router</td></tr>
        <tr><td><b>Crossover</b></td><td>T568A / T568B</td><td>PC↔PC · switch↔switch · router↔router</td></tr>
        <tr><td><b>Rollover</b></td><td>reversed 1–8 / 8–1</td><td>PC serial port ↔ device console port</td></tr>
      </table>
      ${topo([
        'nd.cl:PC|',
        'lk:straight-through<br>different device types',
        'nd:Switch|',
        'lk:crossover<br>same device type',
        'nd:Switch|',
      ])}
      <div class="box ok">Modern gear has <b>Auto-MDIX</b> and fixes the wrong cable
      itself — which is exactly why you must still know the rule for the exam and
      for old equipment that does not.</div>`,
  },

  /* ── 4.5 Fibre ───────────────────────────────────────────────────────── */
  {
    t: 'How light stays inside a glass thread',
    body: `${CSS}
      ${FIBRE}
      <p class="note">Glass, not copper: <b>no electrical noise, no crosstalk, no
      earth loops, no lightning path</b>. The limit is how much light survives the
      distance — and, in multimode, how far apart the paths arrive.</p>`,
  },

  {
    t: 'Single-mode vs multimode',
    body: `${CSS}
      <table class="t">
        <tr><th></th><th>Single-mode (SMF)</th><th>Multimode (MMF)</th></tr>
        <tr><td><b>Core</b></td><td>≈ 9 µm — one path for the light</td><td>≈ 50 or 62.5 µm — many paths</td></tr>
        <tr><td><b>Light source</b></td><td>Laser</td><td>LED or VCSEL</td></tr>
        <tr><td class="hl"><b>Distance</b></td><td class="hl">tens of km, up to ~100 km</td><td class="hl">up to ~550 m at 10 Gbps</td></tr>
        <tr><td><b>Limited by</b></td><td>Attenuation</td><td>Modal dispersion — paths arrive at different times</td></tr>
        <tr><td><b>Jacket colour</b></td><td>Yellow (by convention)</td><td>Orange, aqua, violet</td></tr>
        <tr><td><b>Cost</b></td><td>Higher optics, cheaper per km</td><td>Cheaper optics, shorter reach</td></tr>
      </table>
      <p class="note">"Multimode" means many light paths in one core, not many
      fibres in one cable.</p>`,
  },

  {
    t: 'Connectors and where fibre is used',
    body: `${CSS}
      <div class="two">
        <div><div class="nh">Connectors</div>
          ${kv([
            ['ST', 'bayonet, older multimode'],
            ['SC', 'square push-pull, subscriber'],
            ['LC', 'small, duplex — today’s default in SFP modules'],
            ['Duplex MM', 'two fibres in one clip: one TX, one RX'],
          ])}
        </div>
        <div><div class="nh">Where it is used</div>
          ${kv([
            ['Enterprise backbone', 'floor to floor, building to building'],
            ['Data centre', 'switch to switch, storage'],
            ['FTTH', 'the provider into the home'],
            ['Long-haul', 'submarine and terrestrial'],
          ])}
        </div>
      </div>
      <div class="box warn">Fibre carries light: <b>TX of one end must reach RX of
      the other</b>. A dark link with good optics is a crossed pair nine times out
      of ten — swap the two strands before you replace anything.</div>`,
  },

  {
    t: 'Fibre vs copper, decided on four rows',
    body: `${CSS}
      <table class="t">
        <tr><th></th><th>UTP copper</th><th>Fibre optic</th></tr>
        <tr><td><b>Distance</b></td><td>100 m</td><td class="hl">hundreds of m to 100 km</td></tr>
        <tr><td><b>Bandwidth</b></td><td>1–10 Gbps typical</td><td class="hl">10–100 Gbps and beyond</td></tr>
        <tr><td><b>EMI / RFI</b></td><td>Affected</td><td class="hl">Immune</td></tr>
        <tr><td><b>Electrical hazard</b></td><td>Yes — earth loops, lightning</td><td>None</td></tr>
        <tr><td><b>Cost</b></td><td class="hl">Lowest</td><td>Higher media, tooling and skill</td></tr>
        <tr><td><b>Termination</b></td><td>Crimp in the field, minutes</td><td>Fusion splice, specialist tools</td></tr>
      </table>
      <p class="note">Choose fibre when the run is long, noisy, or between
      buildings. Choose copper for the last 100 m to a desk — it also carries PoE.</p>`,
  },

  /* ── 4.6 Wireless ────────────────────────────────────────────────────── */
  {
    t: 'Wireless standards you will actually meet',
    body: `${CSS}
      <table class="t">
        <tr><th>Standard</th><th>Name</th><th>Band</th><th>Top rate</th></tr>
        <tr><td>802.11a</td><td>—</td><td>5 GHz</td><td>54 Mbps</td></tr>
        <tr><td>802.11b</td><td>—</td><td>2.4 GHz</td><td>11 Mbps</td></tr>
        <tr><td>802.11g</td><td>—</td><td>2.4 GHz</td><td>54 Mbps</td></tr>
        <tr><td>802.11n</td><td>Wi-Fi 4</td><td>2.4 + 5 GHz</td><td>600 Mbps</td></tr>
        <tr><td class="hl">802.11ac</td><td class="hl">Wi-Fi 5</td><td>5 GHz</td><td class="hl">~6.9 Gbps</td></tr>
        <tr><td class="hl">802.11ax</td><td class="hl">Wi-Fi 6 / 6E</td><td>2.4 + 5 + 6 GHz</td><td class="hl">~9.6 Gbps</td></tr>
      </table>
      ${kv([
        ['Bluetooth', 'personal area, device pairing'],
        ['WiMAX (802.16)', 'broadband over a wide area'],
        ['Zigbee (802.15.4)', 'low power, low rate — sensors and IoT'],
      ])}`,
  },

  {
    t: 'What wireless costs you',
    body: `${CSS}
      ${topo([
        'nd.cl:Laptop|',
        'lk:shared air<br>one talker at a time',
        'nd:AP|half duplex',
        'lk:cable<br>full duplex',
        'nd:Switch|',
      ])}
      ${kv([
        ['Shared medium', 'every client on one AP divides the same airtime'],
        ['Half duplex', 'a station cannot send and receive at once — collisions are avoided, not detected'],
        ['Coverage', 'walls, metal and distance cut the rate long before the link drops'],
        ['Interference', 'microwaves, other APs, Bluetooth all sit in 2.4 GHz'],
        ['Security', 'the signal leaves the building — WPA2 or WPA3 is not optional'],
      ])}
      <div class="box warn">"Full bars but slow" is normal: bars show signal
      strength, not free airtime.</div>`,
  },

  {
    t: 'All media on one table',
    body: `${CSS}
      <table class="t" style="font-size:19px">
        <tr><th>Medium</th><th>Max length</th><th>EMI</th><th>Cost</th><th>Typical use</th></tr>
        <tr><td><b>UTP Cat 5e/6</b></td><td>100 m</td><td>Affected</td><td>Lowest</td><td>Desk drop, PoE</td></tr>
        <tr><td><b>STP</b></td><td>100 m</td><td>Resistant</td><td>Low-mid</td><td>Industrial, noisy plant</td></tr>
        <tr><td><b>Coaxial</b></td><td>Hundreds of m</td><td>Resistant</td><td>Mid</td><td>Cable modem, antenna, CCTV</td></tr>
        <tr><td><b>Multimode fibre</b></td><td>~550 m at 10 G</td><td class="hl">Immune</td><td>High</td><td>Campus and data-centre backbone</td></tr>
        <tr><td><b>Single-mode fibre</b></td><td class="hl">up to ~100 km</td><td class="hl">Immune</td><td>Highest</td><td>Between sites, long haul</td></tr>
        <tr><td><b>Wireless 802.11</b></td><td>~30–50 m indoors</td><td>Very affected</td><td>Low</td><td>Mobility, guest access</td></tr>
      </table>`,
  },

  /* ── Lab 1.3, sessions 13–14 ─────────────────────────────────────────── */
  {
    t: 'Lab 1.3 — view wired and wireless NIC information',
    body: `${CSS}
      <div class="steps">
        <div><span class="n">1</span><span><b>4.6.5 Packet Tracer</b> — connect a laptop by cable and by Wi-Fi, compare what each NIC reports</span></div>
        <div><span class="n">2</span><span><b>4.6.6 Lab</b> — on your own machine: list every NIC, its MAC, its speed and its duplex</span></div>
        <div><span class="n">3</span><span><b>Explain out loud</b> — why the wireless NIC shows a rate that changes and the wired one does not</span></div>
      </div>
      ${kv([
        ['Wired NIC reports', 'link speed, duplex, MAC, error counters'],
        ['Wireless NIC reports', 'SSID, channel, band, signal strength (RSSI), negotiated rate'],
        ['Both report', 'a MAC address — and they are different addresses'],
      ])}`,
  },

  {
    t: 'Verify it yourself, on your own machine',
    body: `${CSS}
      ${term(`<span class="c"># Linux — speed, duplex and the physical error counters</span>
<span class="p">$</span> <span class="k">ip</span> -br link              <span class="c"># every NIC and its MAC, one line each</span>
<span class="p">$</span> <span class="k">ethtool</span> eth0             <span class="c"># Speed: 1000Mb/s  Duplex: Full  Link detected: yes</span>
<span class="p">$</span> <span class="k">ip</span> -s link show eth0     <span class="c"># RX/TX errors, dropped, carrier — Layer 1 health</span>

<span class="c"># macOS — the same three facts</span>
<span class="p">$</span> <span class="k">networksetup</span> -listallhardwareports
<span class="p">$</span> <span class="k">ifconfig</span> en0 <span class="p">|</span> grep media  <span class="c"># media: autoselect (1000baseT full-duplex)</span>`, 'sm')}
      <div class="box ok">Errors rising while the link stays up = a cable or
      connector problem, not a configuration problem. <b>Half duplex on one side
      only</b> is the classic cause: you will see late collisions on that port.</div>`,
  },
];
