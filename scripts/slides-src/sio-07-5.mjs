/**
 * sio-07-5 — Socket.IO · Chapter 7 · Lesson 7.5 "Group calls: an SFU is a different animal" (deck video + web, 13/11/2026).
 * Bài web: io-7-5-sfu. Output THẬT (scratchpad/sio/demo/n7-5.txt · Chromium 149 · camera giả = video nhiễu 640×360 · trần 1,5 Mbit/s mỗi luồng cho CẢ HAI kiến trúc):
 * nhom: N = 2…5 trang Chromium một phòng. Mesh: mỗi người N-1 kết nối, mã hoá N-1 luồng, LÊN (N-1)×1,5 Mbit/s, CPU Chromium tăng vọt.
 *   SFU thật (mediasoup 3.32.2, prebuilt darwin-arm64): mỗi người 2 kết nối (gửi + nhận), mã hoá 1 luồng, LÊN ~1,5 Mbit/s cố định; server nhận N×, gửi N(N-1)×.
 *   Báo hiệu socket.io cả phòng: vài chục KB. Kho: call.socket.ts 1-1 (dangGoi Map theo user · benKia trả MỘT người) · 0 tệp nhắc mediasoup/livekit/janus/SFU.
 * cai: worker mediasoup 6,98 MB · 116.784 dòng C++ (src + include).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-5:kho": "$ cd ~/api-backend && grep -n \"const dangGoi = \\|function benKia\\|toUserId: number\" src/socket/call.socket.ts\n30:const dangGoi = new Map<number, CuocGoi>();\n42:function benKia(c: CuocGoi, toi: number): number {\n135:  socket.on('call:offer', (p: { threadId: number; toUserId: number; sdp: unknown; coVideo?: boolean }) => {\n$ grep -rlwE \"mediasoup|livekit|janus|SFU\" src/ frontend/src/ package.json | wc -l    # thư viện gọi nhóm trong kho\n       0",
 "n7-5:cai": "$ npm i mediasoup@3 mediasoup-client@3   # đã chạy trước: 44 s, có bản dựng sẵn cho Mac ARM (không phải biên dịch C++)\n$ node -p \"['mediasoup', 'mediasoup-client'].map((p) => p + '@' + require('./node_modules/' + p + '/package.json').version).join('   ')\"\nmediasoup@3.32.2   mediasoup-client@3.26.0\n$ ls -la node_modules/mediasoup/worker/out/Release/mediasoup-worker | awk '{print $5, $9}'\n6976096 node_modules/mediasoup/worker/out/Release/mediasoup-worker\n$ find node_modules/mediasoup/worker/src node_modules/mediasoup/worker/include -name '*.[ch]pp' | xargs cat | wc -l   # mã C++ của worker\n  116784",
 "n7-5:ma": "$ sed -n '/SFU: mediasoup worker/,/server.listen/p' may.ts\n/* ── SFU: mediasoup worker + router; socket.io chở thông số transport/producer/consumer ── */\nconst worker = await mediasoup.createWorker({ rtcMinPort: 19860, rtcMaxPort: 19899, logLevel: 'warn' });\nconst router = await worker.createRouter({ mediaCodecs: [\n  { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },\n  { kind: 'video', mimeType: 'video/VP8', clockRate: 90000 },\n] });\nconst transports = new Map<string, mediasoup.types.WebRtcTransport>();\nconst producers = new Map<string, { p: mediasoup.types.Producer; ai: string }>();\nasync function demSfu() {                                                        // byte server THẬT nhận/gửi trên mọi transport\n  let vao = 0, ra = 0;\n  for (const t of transports.values()) for (const s of await t.getStats()) { vao += s.bytesReceived; ra += s.bytesSent; }\n  return { vao, ra, transports: transports.size, producers: producers.size, baoHieu: bao.vao + bao.ra };\n}\nio.of('/sfu').on('connection', (s) => {\n  const cua: string[] = [];\n  s.on('sfu:join', (ack) => { s.join('phong'); ack({ caps: router.rtpCapabilities, co: [...producers].filter(([, v]) => v.ai !== s.id).map(([id]) => id) }); });\n  s.on('sfu:transport', async (ack) => {\n    const t = await router.createWebRtcTransport({ listenInfos: [{ protocol: 'udp', ip: '127.0.0.1' }], enableUdp: true, initialAvailableOutgoingBitrate: 2_000_000 });\n    transports.set(t.id, t); cua.push(t.id);\n    ack({ id: t.id, iceParameters: t.iceParameters, iceCandidates: t.iceCandidates, dtlsParameters: t.dtlsParameters });\n  });\n  s.on('sfu:connect', async ({ id, dtlsParameters }, ack) => { await transports.get(id)!.connect({ dtlsParameters }); ack(); });\n  s.on('sfu:produce', async ({ id, kind, rtpParameters }, ack) => {\n    const p = await transports.get(id)!.produce({ kind, rtpParameters });\n    producers.set(p.id, { p, ai: s.id }); ack(p.id);\n    s.to('phong').emit('sfu:co-luong-moi', p.id);                              // báo mọi người khác: có luồng mới để nhận\n  });\n  s.on('sfu:consume', async ({ id, producerId, caps }, ack) => {\n    if (!router.canConsume({ producerId, rtpCapabilities: caps })) return ack(null);\n    const c = await transports.get(id)!.consume({ producerId, rtpCapabilities: caps, paused: true });\n    ack({ id: c.id, producerId, kind: c.kind, rtpParameters: c.rtpParameters });\n    s.once(`sfu:resume:${c.id}`, () => void c.resume());\n  });\n  s.on('disconnect', () => { for (const id of cua) { transports.get(id)?.close(); transports.delete(id); }\n    for (const [id, v] of producers) if (v.ai === s.id) producers.delete(id); });\n});\nserver.listen(CONG, () => console.log(`[sfu] nghe :${CONG} · mediasoup ${mediasoup.version} · worker pid ${worker.pid}`));",
 "n7-5:nhom": "$ npx tsx may.ts &   node nhom.mjs 2 3 4 5\nmesh N=2: mỗi người LÊN  1532 kbps · XUỐNG  1532 kbps · 1 kết nối · mã hoá 1 luồng video (49 ms/giây) · CPU Chromium 36% · báo hiệu socket.io cả phòng 28.0 KB\nmesh N=3: mỗi người LÊN  3036 kbps · XUỐNG  3036 kbps · 2 kết nối · mã hoá 2 luồng video (137 ms/giây) · CPU Chromium 94% · báo hiệu socket.io cả phòng 83.7 KB\nmesh N=4: mỗi người LÊN  4579 kbps · XUỐNG  4579 kbps · 3 kết nối · mã hoá 3 luồng video (222 ms/giây) · CPU Chromium 168% · báo hiệu socket.io cả phòng 167.3 KB\nmesh N=5: mỗi người LÊN  6114 kbps · XUỐNG  6114 kbps · 4 kết nối · mã hoá 4 luồng video (289 ms/giây) · CPU Chromium 259% · báo hiệu socket.io cả phòng 278.7 KB\nsfu  N=2: mỗi người LÊN  1527 kbps · XUỐNG  1536 kbps · 2 kết nối · mã hoá 1 luồng video (62 ms/giây) · server nhận 3226 / gửi 3269 kbps · CPU Chromium 38% · báo hiệu socket.io cả phòng 29.0 KB\nsfu  N=3: mỗi người LÊN  1532 kbps · XUỐNG  3082 kbps · 2 kết nối · mã hoá 1 luồng video (58 ms/giây) · server nhận 4863 / gửi 9813 kbps · CPU Chromium 66% · báo hiệu socket.io cả phòng 62.2 KB\nsfu  N=4: mỗi người LÊN  1527 kbps · XUỐNG  4612 kbps · 2 kết nối · mã hoá 1 luồng video (59 ms/giây) · server nhận 6473 / gửi 19560 kbps · CPU Chromium 99% · báo hiệu socket.io cả phòng 108.1 KB\nsfu  N=5: mỗi người LÊN  1527 kbps · XUỐNG  6134 kbps · 2 kết nối · mã hoá 1 luồng video (58 ms/giây) · server nhận 8125 / gửi 32603 kbps · CPU Chromium 135% · báo hiệu socket.io cả phòng 166.4 KB\n$ # log server\n[sfu] nghe :19850 · mediasoup 3.32.2 · worker pid 64107"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tsx, meter, icards, esc, br, seq } from './_sio-chung.mjs';

export const deck = { key: 'sio-07-5', code: 'SIO 7.5', title: 'Group calls: an SFU is a different animal', sub: 'Chapter 7 · Lesson 7.5' };
const O = (k) => { const v = DU_LIEU[`n7-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const NHOM = O('nhom'), KHO = O('kho'), CAI = O('cai');
const vn = (n) => Number(n).toLocaleString('en-US');
const R = [...NHOM.matchAll(/^(mesh|sfu)\s+N=(\d+): mỗi người LÊN\s+(\d+) kbps · XUỐNG\s+(\d+) kbps · (\d+) kết nối · mã hoá (\d+) luồng video \((\d+) ms\/giây\)(?: · server nhận (\d+) \/ gửi (\d+) kbps)? · CPU Chromium (\d+)% · báo hiệu socket.io cả phòng ([\d.]+) KB/gm)]
  .map((x) => ({ k: x[1], n: +x[2], len: +x[3], xuong: +x[4], pc: +x[5], luong: +x[6], ms: +x[7], vao: +(x[8] ?? 0), ra: +(x[9] ?? 0), cpu: +x[10], kb: +x[11] }));
const MESH = R.filter((r) => r.k === 'mesh'), SFU = R.filter((r) => r.k === 'sfu');
if (MESH.length < 4 || SFU.length < 4) throw new Error('thiếu lượt đo nhom');
const nMax = MESH.at(-1).n, s1 = SFU[0].len;                                      // một luồng ≈ trần 1,5 Mbit/s
const dongCpp = Number(m(/^\s+(\d+)\s*$/m, CAI)[1]), bin = Number(m(/^(\d+) node_modules/m, CAI)[1]);
const coSfu = Number(m(/thư viện gọi nhóm trong kho\n\s+(\d+)/, KHO)[1]);
const mbit = (k) => (k / 1000).toFixed(1);

/** Ba kiến trúc, N = 4: mỗi mũi tên là một luồng video đi trên mạng. */
function baKieu() {
  const W = 1110, H = 300, pw = 350, cx = [175, 555, 935];
  const vong = (x0, y0, r) => [0, 1, 2, 3].map((i) => [x0 + r * Math.cos((Math.PI / 2) * i - Math.PI / 4), y0 + r * Math.sin((Math.PI / 2) * i - Math.PI / 4)]);
  const nguoi = (p, mau) => p.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="#fff" stroke="${mau}" stroke-width="3"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-size="18">👤</text>`).join('');
  const day = (a, b, mau) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${mau}" stroke-width="2.5"/>`;
  const p1 = vong(cx[0], 150, 95), p2 = vong(cx[1], 150, 105), p3 = vong(cx[2], 150, 105);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) s += day(p1[i], p1[j], '#c0392b');
  s += nguoi(p1, '#c0392b') + `<text x="${cx[0]}" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#c0392b">Mesh</text><text x="${cx[0]}" y="285" text-anchor="middle" font-size="16" fill="#475569">each sends N−1 copies</text>`;
  s += p2.map((p) => day(p, [cx[1], 150], '#0e7490')).join('') + `<rect x="${cx[1] - 42}" y="128" width="84" height="44" rx="10" fill="#e0f2fe" stroke="#0e7490" stroke-width="3"/><text x="${cx[1]}" y="157" text-anchor="middle" font-size="18" font-weight="800" fill="#0e7490">SFU</text>`;
  s += nguoi(p2, '#0e7490') + `<text x="${cx[1]}" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#0e7490">SFU</text><text x="${cx[1]}" y="285" text-anchor="middle" font-size="16" fill="#475569">send 1 · server forwards N−1</text>`;
  s += p3.map((p) => day(p, [cx[2], 150], '#7c3aed')).join('') + `<rect x="${cx[2] - 42}" y="128" width="84" height="44" rx="10" fill="#ede9fe" stroke="#7c3aed" stroke-width="3"/><text x="${cx[2]}" y="157" text-anchor="middle" font-size="18" font-weight="800" fill="#7c3aed">MCU</text>`;
  s += nguoi(p3, '#7c3aed') + `<text x="${cx[2]}" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#7c3aed">MCU</text><text x="${cx[2]}" y="285" text-anchor="middle" font-size="16" fill="#475569">server decodes · mixes · re-encodes 1</text>`;
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.5', t: 'Group calls:<br>an SFU is a different animal', sub: 'Mesh vs a real SFU (mediasoup), up to five browsers — upload, server load and CPU, measured',
    en: 'Lesson seven point five: group calls, and why an SFU is a different animal. Mesh against a real SFU, up to five browsers, with upload, server load and CPU measured.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three architectures for group calls: mesh, SFU, MCU</li>
    <li>Mesh measured: upload, connections and encoders grow with every person</li>
    <li>A real SFU measured: upload flat for each person, the N² moves to the server</li>
    <li>socket.io stays the control plane — the SFU is the data plane</li>
    <li>Why you do not write an SFU yourself, and where this repo stands</li></ul>`,
    en: 'Five takeaways: three architectures; mesh measured; a real SFU measured; socket.io as the control plane; and why you do not write an SFU yourself.' },
  { t: 'Three ways to put N people in one call', body: baKieu() + cmp(['', 'Mesh', 'SFU', 'MCU'], [
      ['Each person uploads', 'N−1 streams', '1 stream', '1 stream'],
      ['Each person downloads', 'N−1 streams', 'N−1 streams', '1 mixed stream'],
      ['Server does', 'nothing (signalling only)', 'forwards packets — no decode', 'decodes, mixes, re-encodes'],
      ['Grows like O(N²)', 'the peers\' links + CPU', 'the server\'s bandwidth', 'the server\'s CPU'],
    ], { hl: [0] }),
    en: 'Three ways to put N people in one call. Mesh: everyone sends a copy to everyone. SFU, a selective forwarding unit: everyone sends one stream, the server forwards it without decoding. MCU: the server decodes, mixes and re-encodes one stream for each person.' },
  { t: 'Mesh, measured: every person pays for everyone', body: meter(MESH.map((r) => [`mesh · N = ${r.n}`, r.len, '#c0392b', `${r.pc} conn.`]), { don: 'kbps', nhan: 220, rh: 50, fs: 19 }) +
    two(box('What grows', `Upload per person = (N−1) × one stream: ${MESH.map((r) => vn(r.len)).join(' → ')} kbps. Each copy is encoded separately (${MESH.map((r) => r.ms).join(' → ')} ms of encoding per second), and the ${nMax} tabs together used <b>${MESH.at(-1).cpu}%</b> CPU (${MESH[0].cpu}% at N = 2).`, 'bad'),
      box('Versus the web page', `The page's math is right: with a 1 Mbps stream, N = 4 ⇒ 3 Mbps up. Here one stream is capped at 1.5 Mbit/s for both architectures, so N = 4 ⇒ <b>${mbit(MESH.find((r) => r.n === 4).len)} Mbit/s</b> up. A home uplink of a few Mbit/s gives up around N = 3–4.`, 'info')),
    en: 'Mesh, measured. Each person’s upload is N minus one streams: it climbs with every person, every copy is encoded separately, and CPU climbs with it. The web page’s math holds.' },
  { t: 'SFU, measured: upload stays flat', body: cmp(['N', 'Up / person', 'Down / person', 'Connections', 'Server in', 'Server out'], SFU.map((r) => [String(r.n), `${vn(r.len)} kbps`, `${vn(r.xuong)} kbps`, String(r.pc), `${vn(r.vao)} kbps`, `${vn(r.ra)} kbps`]), { hl: [SFU.length - 1] }) +
    two(box('Where the N² went', `Each person sends <b>one</b> stream and keeps <b>two</b> connections (send + receive) whatever N is. The server receives N streams and sends N(N−1): at N = ${SFU.at(-1).n}, ${vn(SFU.at(-1).vao)} kbps in and ${vn(SFU.at(-1).ra)} kbps out.`, 'ok'),
      box('Versus the formula', `With one stream ≈ ${vn(s1)} kbps, N(N−1) × s at N = ${SFU.at(-1).n} is ${vn(SFU.at(-1).n * (SFU.at(-1).n - 1) * s1)} kbps — the server's measured out is close; the rest is RTCP and probing. The web page's N = 8 example (8 in + 56 out = 64 streams) is the same formula.`, 'info')),
    en: 'SFU, measured. Upload per person stays at one stream and two connections, whatever N is. The server receives N streams and sends N times N minus one. The N squared moved from the peers to the server.' },
  { t: 'Mesh vs SFU, side by side', body: meter([...MESH.map((r) => [`mesh N=${r.n} · ${r.luong} enc.`, r.cpu, '#c0392b']), ...SFU.map((r) => [`SFU N=${r.n} · ${r.luong} enc.`, r.cpu, '#0e7490'])], { don: '% CPU', nhan: 240, rh: 40, fs: 18 }) +
    box('Read it with care', `All ${nMax} browsers ran on one Mac, so CPU is the sum for every tab; on real devices each person carries only their own share. The shape is what matters: mesh multiplies encoders per person, SFU keeps one.`, 'info'),
    en: 'Side by side, CPU of all the tabs on the course machine: mesh climbs fast because every person runs N minus one encoders; the SFU keeps one encoder per person.' },
  { t: 'socket.io is the control plane, the SFU is the data plane', body: two(tsx(`// sfu/may.ts (lab), abbreviated
'sfu:join'      → router.rtpCapabilities
'sfu:transport' → createWebRtcTransport
'sfu:connect'   → connect(dtls)
'sfu:produce'   → produce(rtp)
  ⇒ emit 'sfu:co-luong-moi'
'sfu:consume'   → consume(paused)
'sfu:resume:id' → consumer.resume()`, { fs: 12 }),
      seq(['browser', 'socket.io', 'SFU'], [[0, 1, 'sfu:join → router caps'], [0, 1, 'sfu:transport ×2'], [0, 1, 'sfu:connect (DTLS)'], [0, 1, 'sfu:produce'], [1, 0, 'sfu:co-luong-moi (to others)', '#1f8a3b'], [0, 1, 'sfu:consume → resume'], [0, 2, 'RTP media — never via socket.io', '#0e7490', true]], { w: 600, rh: 42, fs: 15 }), 'r46') +
      box('Measured', `Signalling for the whole room at N = ${SFU.at(-1).n}: <b>${SFU.at(-1).kb} KB</b> over socket.io, once. The media in the same 10 s: about <b>${vn(Math.round((SFU.at(-1).vao + SFU.at(-1).ra) * 10 / 8 / 1000))} MB</b> through the SFU — some 300 times more. Same split as the 1-to-1 call in 7.1.`, 'ok'),
    en: 'socket.io stays the control plane: join, create transports, connect, produce, announce new streams, consume. The SFU is the data plane. Signalling for the whole room was a few dozen kilobytes; the media was megabytes.' },
  { t: 'Do not write an SFU — and where this repo stands', body: two(cmp(['Option', 'What it is'], [
      ['mediasoup', 'Node.js API + C++ worker — used in this lab'], ['LiveKit', 'Go, open source, SDKs, also managed'],
      ['Janus', 'C, plugin-based, around for a decade'], ['Managed (Daily, Twilio…)', 'no infrastructure, per-minute price'],
    ]), box('Measured', `<b>mediasoup ${esc(m(/mediasoup@([\d.]+)/, CAI)[1])}</b> installed with a prebuilt worker for this Mac: a <b>${(bin / 1e6).toFixed(1)} MB</b> binary built from <b>${vn(dongCpp)}</b> lines of C++ (RTP, RTCP, DTLS-SRTP, congestion control). The page says “tens of thousands of lines” — it is over a hundred thousand.`, 'bad')) +
    box('This repo today', `${c('call.socket.ts')} is strictly one-to-one: one ${c('dangGoi')} entry per user, ${c('benKia()')} returns <b>one</b> other person. Files mentioning mediasoup / LiveKit / Janus / SFU: <b>${coSfu}</b>. Adding group calls means adding an SFU — the socket.io part stays the same kind of relay.`, 'info'),
    en: 'Do not write an SFU. mediasoup’s worker alone is over a hundred thousand lines of C++. This repo is one-to-one only; adding group calls means adding mediasoup, LiveKit or a managed service, while socket.io keeps doing signalling.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Mesh', 'everyone sends a copy to everyone — O(N) up per peer'), kw('SFU', 'Selective Forwarding Unit: forwards, never decodes'),
      kw('MCU', 'Multipoint Control Unit: decodes, mixes, re-encodes'), kw('Control plane', 'socket.io: who joins, which streams exist'),
      kw('Data plane', 'RTP media through the SFU'), kw('Producer / consumer', 'one stream sent up / one stream received'),
      kw('Server O(N²)', 'an SFU sends N(N−1) streams'), kw('Peer O(1)', 'one upload per person, whatever N is'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: mesh; SFU; MCU; control plane; data plane; producer and consumer; server cost N squared; and peer cost constant.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Open a mesh room with 2, 3, 4 tabs; read upload per tab in getStats',
      'Run a mediasoup router; join the same tabs through it; compare',
      'Count the socket.io bytes of joining vs the media bytes',
      'Write down the N where mesh stops being acceptable on your uplink',
    ]), box('Keep these', `<ul><li>Mesh: upload and encoders × (N−1)</li><li>SFU: one up, N−1 down, two connections</li><li>The N² moves to the server</li><li>socket.io = control plane, unchanged</li><li>Use mediasoup / LiveKit / managed</li></ul>`, 'info'), ''),
    en: 'Your turn: open a mesh room and read upload per tab; run a mediasoup router and compare; count signalling against media; and write down the N where mesh stops working on your uplink.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — WebRTC signalling with socket.io', bai: '7.5' }, S);
