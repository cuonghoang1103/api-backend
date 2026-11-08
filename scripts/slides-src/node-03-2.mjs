/**
 * node-03-2 — Node.js · Chapter 3 · Lesson 3.2 "Buffers: binary data" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s03-*.mjs › nodejs-3-2-buffer. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c3).
 * Bổ sung so với bài web: byteLength từng ký tự (1 · 2 · 3 · 4 byte, emoji dài 2 trong JS), cắt chuỗi vs cắt buffer chạy thật, utf8 vs latin1 chạy thật,
 * StringDecoder trên hai mẩu chạy thật, HMAC webhook trên body thô vs body đã parse chạy thật.
 */
import { lamDeck, two, box, kw, bang, steps, cards, flow, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-03-2', code: 'NODE 3.2', title: 'Buffers: binary data', sub: 'Node.js — from zero to production' };
const hop = (chu, bytes, cut) => {   // ô ký tự trên, ô byte dưới; cut = vị trí vạch cắt (số byte)
  const W = 92, H = 70, x0 = 20;
  let x = x0, s = `<svg viewBox="0 0 1100 260" width="1100" height="260" font-family="Arial">`;
  chu.forEach(([c, n], i) => {
    s += `<rect data-k="kytu" x="${x}" y="20" width="${W * n - 8}" height="${H}" rx="10" fill="${n > 1 ? '#fef3c7' : '#ecfdf5'}" stroke="${n > 1 ? '#d97706' : '#15803d'}" stroke-width="3"/>`;
    s += `<text x="${x + (W * n - 8) / 2}" y="68" text-anchor="middle" font-size="34" font-weight="800" fill="#333">${c === ' ' ? '␣' : c}</text>`;
    for (let k = 0; k < n; k++) {
      const bx = x + k * W, hex = bytes.shift();
      s += `<rect data-k="byte" x="${bx}" y="120" width="${W - 8}" height="${H}" rx="8" fill="#1e1e1e"/>`;
      s += `<text x="${bx + (W - 8) / 2}" y="166" text-anchor="middle" font-size="28" font-family="monospace" fill="#9cdcfe">${hex}</text>`;
    }
    x += W * n;
  });
  if (cut !== undefined) { const cx = x0 + cut * W - 4; s += `<line data-k="cat" x1="${cx}" y1="8" x2="${cx}" y2="210" stroke="#dc2626" stroke-width="6" stroke-dasharray="12 8"/><text x="${cx}" y="240" text-anchor="middle" font-size="24" font-weight="800" fill="#dc2626">cut at byte ${cut}</text>`; }
  return s + '</svg>';
};
const XIN = [['X', 1], ['i', 1], ['n', 1], [' ', 1], ['c', 1], ['h', 1], ['à', 2], ['o', 1]];
const HEX = () => ra('c3/buffer-bytes').match(/as hex\s*: ([0-9a-f]+)/)[1].match(/../g);   // byte thật từ output

export const slides = lamDeck({ chuong: 'Chapter 3 — Core Modules', bai: '3.2' }, [
  { cover: true, t: 'Buffers:<br>binary data', sub: 'A character is not a byte. Cut in the wrong place and text breaks.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>Buffer</b> is, and why Node needs one</li>
<li>Why <b>length</b> and <b>byteLength</b> are different numbers</li>
<li>How cutting bytes <b>breaks Vietnamese text</b>, and the fix</li>
<li>Where Buffers show up: uploads, streams, crypto, <b>webhooks</b></li>
</ul>
${kw('byte', '8 bits: a number from 0 to 255, written as two hex digits (00–ff)')}` },

  { t: 'What a Buffer is', to: true, giua: true, body: `
${box('Definition', 'A <b>Buffer</b> is a fixed-length block of <b>raw bytes</b>, stored outside V8\'s normal heap.', 'lam')}
${flow([{ t: 'file', s: 'disk', mau: '#ea580c' }, { t: 'socket', s: 'network', mau: '#7c3aed' }, { t: 'image', s: 'upload', mau: '#2563eb' }, { t: 'crypto', s: 'hash, sign', mau: '#0f766e' }, { t: 'Buffer', s: 'bytes in Node', mau: '#15803d' }], { w: 1100, h: 130 })}
${box('Why', 'Every time Node touches the outside world, data arrives as <b>bytes</b>, not as text. A Buffer is what holds them until you decide what they mean.', 'xanh')}` },

  { t: 'A character is not a byte', giua: true, body: `${two(js(ma('c3/buffer-bytes'), { sm: true, hl: [5, 6] }), term(ra('c3/buffer-bytes'), { hl: [1, 2, 5] }))}
${hop(XIN, HEX())}` },

  { t: 'UTF-8 uses 1 to 4 bytes per character', giua: true, body: `${runJs(ma('c3/byte-length'), ra('c3/byte-length'), { hlOut: [2, 3, 5, 6] })}
${two(box('So', '<code class="i">str.length</code> counts JavaScript characters; <code class="i">Buffer.byteLength(str)</code> counts bytes. For Vietnamese text they differ.', 'lam'), box('Bonus trap', 'An emoji has <code class="i">length</code> 2: JavaScript strings count UTF-16 units, not real characters.', ''))}` },

  { t: 'Cut in the wrong place, text breaks', to: true, giua: true, body: `${two(js(ma('c3/buffer-cut'), { sm: true }), term(ra('c3/buffer-cut'), { hl: [2] }), 'r64')}
${hop(XIN, HEX(), 7)}
${kw('� (U+FFFD)', 'the replacement character: what a decoder prints for half a character, the real cause of broken text')}` },

  { t: '"First N characters": cut the string', to: true, giua: true, body: `${runJs(ma('c3/truncate'), ra('c3/truncate'), { hl: [4, 5], hlOut: [1, 2], sm: false })}
${two(box('Rule', 'Cut the <b>string</b>, never the buffer. <code class="i">[...str]</code> splits into real characters.', 'xanh'), box('Database too', 'A <code class="i">VARCHAR(100)</code> column counts characters, while some limits count bytes. Know which one you face.', 'lam'))}` },

  { t: 'Same bytes, two encodings', to: true, giua: true, body: `${runJs(ma('c3/latin1'), ra('c3/latin1'), { hlOut: [2, 3], sm: false })}
${box('A Buffer has no encoding', 'It is just numbers until you choose how to read them. Read UTF-8 bytes as <b>latin1</b> and "à" becomes two strange characters: classic "mojibake".', 'do2')}
${kw('encoding', 'the rule that turns bytes into characters (utf8, latin1, base64, hex…)')}` },

  { t: 'Where you meet Buffers in real life', to: true, giua: true, body: cards([
    ['📤 File uploads', 'An uploaded file arrives as a Buffer before you push it to storage.'],
    ['🌊 Stream chunks', 'Every <code class="i">data</code> event of a stream hands you a Buffer (lesson 3.3).'],
    ['🔐 Hashing &amp; crypto', 'Hashes, HMAC signatures and encryption all work on bytes.'],
    ['🪝 Webhook signatures', 'Verified on the <b>exact raw bytes</b> of the body, not on parsed JSON.'],
  ], 2) + box('Rule of thumb', 'Bytes come in at the edges of your app. Decide the encoding <b>once</b>, at the edge, and work with strings inside.', 'xanh') },

  { t: 'Webhooks: sign the raw bytes', giua: true, body: two(js(ma('c3/webhook'), { sm: true, hl: [4, 7] }), cot(term(ra('c3/webhook'), { hl: [3, 4] }), box('Why it fails', 'Parsing then re-serializing changes whitespace and key order: the bytes change and the HMAC never matches. This website verifies payment webhooks on the <b>raw body</b> (Chapter 6).', 'do2')), 'r64') + kw('HMAC', 'a signature made from a secret key + the exact bytes of a message') },

  { t: 'Creating a buffer', to: true, giua: true, body: `${runJs(ma('c3/create'), ra('c3/create'), { hl: [4], hlOut: [3], sm: false })}
${box('Never Buffer.allocUnsafe(n)…', '…unless you overwrite every byte right away. It hands you <b>uncleared memory</b>, which may still hold pieces of other data that went through your process. Use <code class="i">Buffer.alloc</code>.', 'do2')}` },

  { t: 'Chunks: a character split in two', giua: true, body: `${two(js(ma('c3/decoder'), { sm: true, hl: [8, 10] }), term(ra('c3/decoder'), { hl: [2, 3] }), 'r64')}
${box('StringDecoder', 'Holds back an incomplete byte sequence until the next chunk completes it: exactly what a stream of text needs.', 'xanh')}` },

  { t: 'Why a character is not a byte: four facts', to: true, giua: true, body: steps([
    '<b>A Buffer is a fixed array of bytes.</b> Not text: it has no encoding until you choose one.',
    '<b>UTF-8 uses one to four bytes per character.</b> ASCII 1, Vietnamese 2 or 3, emoji 4. So length ≠ byteLength.',
    '<b>Cutting at a byte position can tear a character.</b> That is the "last letter became a question mark" bug.',
    '<b>Use StringDecoder across chunks.</b> It keeps the unfinished bytes for the next chunk.',
  ]) },

  { t: 'Exercise: predict A, B, C', to: true, giua: true, body: two(js(ma('c3/ex-buffer'), { sm: true }), `<div data-k="dapan">${term(ra('c3/ex-buffer'), { title: 'real output' })}</div>`, 'r73') + box('Hint', '"Đ" takes 2 bytes, "à" 2, "ẵ" 3, the space 1. The first 3 bytes are "Đ" plus half of "à".', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why is <code class="i">'Xin chào'.length</code> 8 but its Buffer 9 bytes?</li>
<li>You need the first 100 characters of a description. Buffer or string?</li>
<li>Why does a webhook signature fail after <code class="i">JSON.parse</code> + <code class="i">JSON.stringify</code>?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. "à" takes 2 bytes in UTF-8. &nbsp; 2. The string (<code class="i">[...s].slice(0, 100)</code>). &nbsp; 3. The bytes changed (spaces, key order), so the HMAC differs.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A <b>Buffer</b> = raw bytes, no encoding until you choose</li>
<li>UTF-8: <b>1–4 bytes</b> per character; length ≠ byteLength</li>
<li>Cut <b>strings</b>, not buffers; StringDecoder across chunks</li>
<li>Signatures on <b>raw bytes</b>; <code class="i">Buffer.alloc</code>, not allocUnsafe</li>
</ul>
${box('Next', 'Lesson 3.3 — Streams: the 348 MB experiment.', 'lam')}` },
]);
