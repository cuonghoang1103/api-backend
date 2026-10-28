'use client';
/** Biểu diễn dữ liệu: chữ → byte (ASCII/Unicode/UTF-8, lỗi font), số thực IEEE-754, màu & điểm ảnh, endianness. */
import { useMemo, useState } from 'react';
import {
  bytesOfU32, charsOf, floatBits, fracToBinarySteps, hexToRgb, mojibake, partsFromBits, rawImageBytes, rgbToHex, utf8Bytes, utf8Decode, fromCodePoints,
  type FloatFmt,
} from './engine/encoding';
import { Explain, Seg, css as s } from '../os-lab/ui';
import { useLabBridge } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { CpuFrame, ReadItem, cc as c, cx, tx, visible, type Lang } from './parts';

type Tab = 'text' | 'mojibake' | 'float' | 'color' | 'endian';
const h2 = (b: number) => b.toString(16).toUpperCase().padStart(2, '0');

/* ── Chữ ─────────────────────────────────────────────────────────────────────────────────── */
function TextTab({ lang }: { lang: Lang }) {
  const [text, setText] = useState('Việt Nam ệ A €😀');
  const [form, setForm] = useState<'NFC' | 'NFD'>('NFC');
  const [sel, setSel] = useState(1);
  const t = text.normalize(form);
  const chars = useMemo(() => charsOf(t).slice(0, 60), [t]);
  const total8 = chars.reduce((n, ch) => n + ch.utf8.length, 0);
  const total16 = chars.reduce((n, ch) => n + 2 * ch.utf16.length, 0);
  const allAscii = chars.every((ch) => ch.ascii);
  const cur = chars[Math.min(sel, chars.length - 1)];
  const cpBits = cur ? cur.cp.toString(2) : '';
  const nb = cur?.utf8.length ?? 1;
  const payloadBits = nb === 1 ? 7 : nb === 2 ? 11 : nb === 3 ? 16 : 21;
  const padded = cpBits.padStart(payloadBits, '0');
  useLabBridge('text', { text, sel, ch: cur?.ch ?? '', cp: cur?.cp ?? 0, nb, total8, chars: chars.length }, {
    text: (x) => { setText(String(x)); setSel(0); }, sel: (x) => setSel(Number(x)), form: (x) => setForm(x as 'NFC' | 'NFD'),
  });
  return (
    <div className={s.stack}>
      <div className={s.bar} data-tour="text-input">
        <span className={s.lbl} style={{ flex: '1 1 260px' }}>{tx(lang, 'Type any text', 'Gõ chữ bất kỳ')}
          <input type="text" value={text} onChange={(e) => { setText(e.target.value); setSel(0); }} style={{ flex: 1, minWidth: 160 }} /></span>
        <Seg label={tx(lang, 'Unicode form', 'Dạng Unicode')} value={form} options={[['NFC', 'NFC (dựng sẵn)'], ['NFD', 'NFD (tách dấu)']]} onChange={setForm} />
      </div>
      <div className={c.read} data-tour="text-counts">
        <ReadItem k={tx(lang, 'characters', 'ký tự (mã điểm)')} v={chars.length} />
        <ReadItem k={tx(lang, 'UTF-8 bytes', 'byte UTF-8')} v={total8} />
        <ReadItem k={tx(lang, 'UTF-16 bytes (Java, JS)', 'byte UTF-16 (Java, JS)')} v={total16} />
        <ReadItem k={tx(lang, 'fits in ASCII?', 'vừa ASCII?')} v={allAscii ? tx(lang, 'yes', 'có') : tx(lang, 'no', 'không')} />
      </div>
      <div className={s.panel} style={{ overflowX: 'auto' }} data-tour="char-table">
        <div className={s.panelTitle}>{tx(lang, 'Each character → code point → UTF-8 bytes (click a row)', 'Mỗi ký tự → mã điểm → byte UTF-8 (bấm một hàng)')}</div>
        <table className={cx(s.tbl, s.compact)}>
          <thead><tr><th>{tx(lang, 'char', 'ký tự')}</th><th>{tx(lang, 'code point', 'mã điểm')}</th><th>UTF-8 ({tx(lang, 'red = length marker, blue = data bits', 'đỏ = dấu độ dài, xanh = bit dữ liệu')})</th><th className={s.num}>{tx(lang, 'bytes', 'byte')}</th></tr></thead>
          <tbody>{chars.map((ch, k) => (
            <tr key={k} className={k === sel ? s.hl : undefined} onClick={() => { labSfx('tap'); setSel(k); }} style={{ cursor: 'pointer' }}>
              <td style={{ fontSize: 18, fontWeight: 700 }}>{ch.ch === ' ' ? '␠' : ch.combining ? `◌${ch.ch}` : ch.ch}</td>
              <td className={s.mono}>{ch.uplus}{ch.combining ? <span className={s.small}> {tx(lang, '(combining)', '(dấu kết hợp)')}</span> : null}</td>
              <td className={s.mono}>{ch.utf8Segs.map((seg, i) => <span key={i} style={{ marginRight: 8, whiteSpace: 'nowrap' }}><span className={c.pre}>{seg[0].bits}</span><span className={c.pay}>{seg[1].bits}</span> <span className={s.small}>{h2(ch.utf8[i])}</span></span>)}</td>
              <td className={cx(s.num, s.mono)}>{ch.utf8.length}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {cur && (
        <Explain tone={nb > 1 ? 'warn' : 'ok'}>
          <b>“{cur.combining ? `◌${cur.ch}` : cur.ch}” = {cur.uplus} = {cur.cp}.</b>{' '}
          {nb === 1 && tx(lang, `It is below 128, so UTF-8 stores it as ONE byte, identical to ASCII (0${padded}).`, `Nó nhỏ hơn 128 nên UTF-8 lưu bằng MỘT byte, y hệt ASCII (0${padded}).`)}
          {nb > 1 && tx(lang,
            `In binary that is ${cpBits} (${cpBits.length} bits) — too big for one byte. UTF-8 picks the ${nb}-byte template, which carries ${payloadBits} data bits: ${nb === 2 ? '110xxxxx 10xxxxxx' : nb === 3 ? '1110xxxx 10xxxxxx 10xxxxxx' : '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx'}. Fill the x's with ${padded} and you get ${cur.utf8.map(h2).join(' ')}. The leading 1s say "this character is ${nb} bytes long"; every continuation byte starts with 10 so a reader can never mistake it for the start of a character.`,
            `Viết nhị phân là ${cpBits} (${cpBits.length} bit) — quá lớn cho một byte. UTF-8 chọn khuôn ${nb} byte, chở được ${payloadBits} bit dữ liệu: ${nb === 2 ? '110xxxxx 10xxxxxx' : nb === 3 ? '1110xxxx 10xxxxxx 10xxxxxx' : '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx'}. Điền ${padded} vào các chữ x là ra ${cur.utf8.map(h2).join(' ')}. Các bit 1 đầu tiên báo "ký tự này dài ${nb} byte"; mọi byte nối tiếp bắt đầu bằng 10 nên trình đọc không bao giờ nhầm nó là đầu một ký tự.`)}
          {form === 'NFD' && ' ' + tx(lang, 'NFD splits Vietnamese letters into base letter + combining marks — same look, different bytes. macOS file names use NFD, so "Việt.txt" typed on Windows may not match. Normalise (NFC) before comparing or hashing strings.', 'NFD tách chữ Việt thành chữ gốc + dấu kết hợp — nhìn y hệt, byte khác. Tên tệp trên macOS dùng NFD, nên "Việt.txt" gõ trên Windows có thể không khớp. Chuẩn hoá (NFC) trước khi so sánh hay băm chuỗi.')}
        </Explain>
      )}
    </div>
  );
}

function MojiTab({ lang }: { lang: Lang }) {
  const [text, setText] = useState('Đường Việt Nam');
  const [rounds, setRounds] = useState(1);
  const [cut, setCut] = useState(false);
  const bytes = utf8Bytes(text);
  const bad = mojibake(text, rounds);
  const cutBytes = bytes.slice(0, Math.max(1, bytes.length - 1));
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.lbl} style={{ flex: '1 1 240px' }}>{tx(lang, 'Text saved as UTF-8', 'Chữ lưu bằng UTF-8')}
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1, minWidth: 150 }} /></span>
        <Seg label={tx(lang, 'Mis-decoded', 'Đọc sai')} value={rounds} options={[[1, tx(lang, 'once', '1 lần')], [2, tx(lang, 'twice', '2 lần')]]} onChange={setRounds} />
      </div>
      <div className={s.panel}>
        <div className={s.panelTitle}>{tx(lang, '1 · The bytes on disk', '1 · Các byte trên đĩa')}</div>
        <div className={s.mono} style={{ wordBreak: 'break-all' }}>{bytes.map(h2).join(' ')}</div>
      </div>
      <div className={s.grid2}>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, '2a · Read as UTF-8 (correct)', '2a · Đọc bằng UTF-8 (đúng)')}</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{text}</div>
        </div>
        <div className={s.panel}>
          <div className={s.panelTitle}>{tx(lang, `2b · Read as Windows-1252 / Latin-1${rounds > 1 ? ' — twice' : ''}`, `2b · Đọc bằng Windows-1252 / Latin-1${rounds > 1 ? ' — hai lần' : ''}`)}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ol-bad)', wordBreak: 'break-all' }}>{visible(bad)}</div>
        </div>
      </div>
      <Explain tone="bad">{tx(lang,
        `Mojibake: nothing is "corrupted" — the bytes are fine, the READER guessed the wrong table. Windows-1252 maps every byte to exactly one character, so each UTF-8 byte of "ệ" (E1 BB 87) becomes its own symbol "á»‡". ${rounds > 1 ? 'Twice = someone saved the garbled text as UTF-8 again and it was mis-read again: the damage compounds. ' : ''}Fix: declare the encoding (<meta charset="utf-8">, Content-Type: text/html; charset=utf-8, JDBC useUnicode/characterEncoding, SQL Server NVARCHAR).`,
        `Lỗi font (mojibake): không có gì "hỏng" — byte vẫn đúng, chỉ là TRÌNH ĐỌC đoán sai bảng mã. Windows-1252 ánh xạ mỗi byte thành đúng một ký tự, nên từng byte UTF-8 của "ệ" (E1 BB 87) thành một ký hiệu riêng "á»‡". ${rounds > 1 ? 'Hai lần = ai đó lưu chữ đã lỗi thành UTF-8 lần nữa rồi lại đọc sai: lỗi chồng lỗi. ' : ''}Cách sửa: khai báo bảng mã (<meta charset="utf-8">, Content-Type: text/html; charset=utf-8, JDBC useUnicode/characterEncoding, SQL Server dùng NVARCHAR).`)}</Explain>
      <div className={s.panel}>
        <label className={s.lbl}><input type="checkbox" checked={cut} onChange={(e) => setCut(e.target.checked)} /> {tx(lang, 'Cut off the last byte (e.g. a string truncated at a byte limit)', 'Cắt mất byte cuối (vd. chuỗi bị cắt theo giới hạn byte)')}</label>
        {cut && <div style={{ marginTop: 6 }}>
          <div className={s.mono}>{cutBytes.map(h2).join(' ')}</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{fromCodePoints(utf8Decode(cutBytes))}</div>
          <div className={s.small}>{tx(lang, 'An incomplete multi-byte sequence decodes to � (U+FFFD). This is why VARCHAR(10) in bytes can chop a Vietnamese word in half.', 'Một chuỗi nhiều byte bị thiếu giải mã thành � (U+FFFD). Vì thế cột VARCHAR(10) tính theo byte có thể cắt đôi một chữ tiếng Việt.')}</div>
        </div>}
      </div>
    </div>
  );
}

/* ── Số thực ─────────────────────────────────────────────────────────────────────────────── */
function FloatTab({ lang }: { lang: Lang }) {
  const [fmt, setFmt] = useState<FloatFmt>('f32');
  const [input, setInput] = useState('0.1');
  const [bits, setBits] = useState<string | null>(null);
  const x = Number(input.replace(',', '.'));
  const theBits = bits ?? floatBits(Number.isNaN(x) && input.trim().toLowerCase() !== 'nan' ? 0 : x, fmt);
  const p = partsFromBits(theBits, fmt);
  const E = fmt === 'f32' ? 8 : 11, bias = fmt === 'f32' ? 127 : 1023;
  const flip = (k: number) => setBits(theBits.slice(0, k) + (theBits[k] === '1' ? '0' : '1') + theBits.slice(k + 1));
  const frac = /^\s*-?\d*[.,]\d+\s*$/.test(input) && !bits ? fracToBinarySteps('0.' + input.replace(',', '.').split('.')[1], 28) : null;
  const sum = partsFromBits(floatBits(0.1 + 0.2, 'f64'), 'f64'), p3 = partsFromBits(floatBits(0.3, 'f64'), 'f64');
  const pick = (v: string) => { setInput(v); setBits(null); };
  useLabBridge('float', { input, fmt, flipped: bits !== null, exact: p.exact }, { pick: (v) => pick(String(v)), fmt: (v) => { setFmt(v as FloatFmt); setBits(null); }, flip: (k) => flip(Number(k)) });
  return (
    <div className={s.stack}>
      <div className={s.bar} data-tour="float-pick">
        <Seg value={fmt} options={[['f32', 'float (32 bit)'], ['f64', 'double (64 bit)']]} onChange={(f) => { setFmt(f); setBits(null); }} />
        <span className={s.lbl}>{tx(lang, 'Number', 'Số')} <input type="text" value={bits ? String(p.value) : input} onChange={(e) => pick(e.target.value)} style={{ width: 130 }} /></span>
        {['0.1', '0.5', '-2.75', '1', '3.14159', '16777217', '1e-45', 'Infinity', 'NaN'].map((v) => <button type="button" key={v} className={s.btn} onClick={() => pick(v)}>{v}</button>)}
      </div>
      <div className={s.panel} style={{ overflowX: 'auto' }}>
        <div className={s.panelTitle}>{tx(lang, 'The bits (click to flip one)', 'Dãy bit (bấm để lật một bit)')}: <span style={{ color: '#dc2626' }}>{tx(lang, 'sign', 'dấu')}</span> · <span style={{ color: '#059669' }}>{tx(lang, `exponent (${E})`, `số mũ (${E})`)}</span> · <span style={{ color: '#2563eb' }}>{tx(lang, `fraction (${fmt === 'f32' ? 23 : 52})`, `phần định trị (${fmt === 'f32' ? 23 : 52})`)}</span></div>
        <div className={c.fbits} data-tour="float-bits">
          {theBits.split('').map((b, k) => (
            <button type="button" key={k} onClick={() => { labSfx(theBits[k] === '1' ? 'off' : 'on'); flip(k); }} className={cx(c.fb, k === 0 ? c.sgn : k <= E ? c.exp : c.frc, b === '0' && c.zero)} style={{ marginRight: k === 0 || k === E ? 4 : 0 }} aria-label={`bit ${theBits.length - 1 - k}`}>{b}</button>
          ))}
        </div>
      </div>
      <div className={c.read}>
        <ReadItem k={tx(lang, 'sign', 'dấu')} v={`${p.sign} (${p.sign ? '−' : '+'})`} />
        <ReadItem k={tx(lang, 'exponent', 'số mũ')} v={p.kind === 'normal' ? `${p.expRaw} − ${bias} = ${p.exp}` : `${p.expRaw} (${p.kind})`} />
        <ReadItem k={tx(lang, 'scientific form', 'dạng khoa học')} v={<span style={{ fontSize: 13 }}>{p.sci.length > 60 ? p.sci.slice(0, 58) + '…' : p.sci}</span>} />
        <ReadItem k="hex" v={'0x' + BigInt('0b' + theBits).toString(16).toUpperCase().padStart(theBits.length / 4, '0')} />
      </div>
      <div className={s.panel} data-tour="float-exact">
        <div className={s.panelTitle}>{tx(lang, 'What is REALLY stored (exact decimal of these bits)', 'Thứ THỰC SỰ được lưu (giá trị thập phân chính xác của dãy bit)')}</div>
        <div className={s.mono} style={{ wordBreak: 'break-all', fontWeight: 800 }}>{p.exact}</div>
        {!bits && (p.kind === 'normal' || p.kind === 'subnormal') && p.exact !== String(x) && (
          <div className={s.small}>{tx(lang, `${input} cannot be stored exactly: the nearest ${fmt === 'f32' ? 'float' : 'double'} is the number above${fmt === 'f32' ? ` (in JS: Math.fround(${x}))` : ''}.`, `${input} không lưu chính xác được: số ${fmt === 'f32' ? 'float' : 'double'} gần nhất là số ở trên${fmt === 'f32' ? ` (trong JS: Math.fround(${x}))` : ''}.`)}</div>
        )}
      </div>
      {frac && frac.steps.length > 0 && (
        <div className={s.panel} style={{ overflowX: 'auto' }} data-tour="float-why">
          <div className={s.panelTitle}>{tx(lang, 'Why: the fraction in binary (multiply by 2, keep the integer part)', 'Vì sao: phần thập phân sang nhị phân (nhân 2, lấy phần nguyên)')}</div>
          <div className={s.mono} style={{ fontSize: 12, lineHeight: 1.6 }}>
            {frac.steps.slice(0, 10).map((st, k) => <div key={k} style={{ color: frac.repeatsFrom !== null && k >= frac.repeatsFrom ? 'var(--ol-warn)' : undefined }}>{st.x} × 2 = {st.times2} → <b>{st.bit}</b></div>)}
            {frac.steps.length > 10 && <div>…</div>}
          </div>
          <div className={s.small} style={{ marginTop: 4 }}>
            0.{frac.steps.map((st) => st.bit).join('')}{frac.repeatsFrom !== null ? '…' : ''}₂ {frac.repeatsFrom !== null
              ? tx(lang, `— the orange part repeats FOREVER, like 1/3 = 0.333… in decimal. ${fmt === 'f32' ? 23 : 52} bits must cut it somewhere, so it is rounded.`, `— phần màu cam lặp MÃI MÃI, như 1/3 = 0,333… ở hệ 10. ${fmt === 'f32' ? 23 : 52} bit buộc phải cắt ở đâu đó nên bị làm tròn.`)
              : tx(lang, '— finite: this fraction is a sum of powers of ½, so it is stored exactly.', '— hữu hạn: phân số này là tổng các luỹ thừa của ½ nên được lưu chính xác.')}
          </div>
        </div>
      )}
      <div className={s.panel} data-tour="float-sum">
        <div className={s.panelTitle}>0.1 + 0.2 == 0.3 ? ({tx(lang, 'double, like JavaScript / Java / Python', 'double, như JavaScript / Java / Python')})</div>
        <table className={cx(s.tbl, s.compact)}><tbody>
          <tr><td className={s.mono}>0.1</td><td className={s.mono} style={{ wordBreak: 'break-all' }}>{partsFromBits(floatBits(0.1, 'f64'), 'f64').exact}</td></tr>
          <tr><td className={s.mono}>0.2</td><td className={s.mono} style={{ wordBreak: 'break-all' }}>{partsFromBits(floatBits(0.2, 'f64'), 'f64').exact}</td></tr>
          <tr><td className={s.mono}>0.1 + 0.2</td><td className={s.mono} style={{ wordBreak: 'break-all', color: 'var(--ol-bad)' }}>{sum.exact}</td></tr>
          <tr><td className={s.mono}>0.3</td><td className={s.mono} style={{ wordBreak: 'break-all' }}>{p3.exact}</td></tr>
        </tbody></table>
        <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, 'The sum rounds to a different double than 0.3 does (they differ in the last bit), so == is false and it prints 0.30000000000000004. Money: use integers of cents, or BigDecimal / DECIMAL in SQL. Comparing floats: |a − b| < ε.', 'Tổng làm tròn về một double khác với 0.3 (lệch ở bit cuối), nên == ra false và in ra 0.30000000000000004. Tiền: dùng số nguyên (đồng/xu), hoặc BigDecimal / DECIMAL trong SQL. So sánh số thực: |a − b| < ε.')}</div>
      </div>
    </div>
  );
}

/* ── Màu & điểm ảnh ─────────────────────────────────────────────────────────────────────── */
const PAL = ['#000000', '#FFFFFF', '#E53935', '#43A047', '#1E88E5', '#FDD835', '#FB8C00', '#8E24AA'];
function ColorTab({ lang }: { lang: Lang }) {
  const [rgb, setRgb] = useState({ r: 218, g: 37, b: 29 });
  const [grid, setGrid] = useState<number[]>(() => {
    const g = Array(64).fill(1);
    // lá cờ nhỏ: nền đỏ, ngôi sao vàng giản lược
    for (let i = 0; i < 64; i++) g[i] = 2;
    [19, 20, 26, 27, 28, 29, 34, 35, 36, 37, 42, 45, 27].forEach((i) => { g[i] = 5; });
    return g;
  });
  const [brush, setBrush] = useState(5);
  const hexStr = rgbToHex(rgb);
  useLabBridge('color', { r: rgb.r, g: rgb.g, b: rgb.b, hex: hexStr }, { rgb: (v) => { const [r, g, b] = v as number[]; setRgb({ r, g, b }); } });
  return (
    <div className={s.stack}>
      <div className={s.grid2}>
        <div className={s.panel} data-tour="pixel">
          <div className={s.panelTitle}>{tx(lang, 'One pixel = 3 bytes: red, green, blue', 'Một điểm ảnh = 3 byte: đỏ, lục, lam')}</div>
          {(['r', 'g', 'b'] as const).map((k) => (
            <div key={k} className={s.lbl} style={{ display: 'flex', margin: '4px 0' }}>
              <b style={{ width: 14, color: k === 'r' ? '#dc2626' : k === 'g' ? '#16a34a' : '#2563eb' }}>{k.toUpperCase()}</b>
              <input type="range" min={0} max={255} value={rgb[k]} onChange={(e) => setRgb({ ...rgb, [k]: Number(e.target.value) })} style={{ flex: 1 }} />
              <span className={s.mono} style={{ width: 120 }}>{rgb[k]} = {rgb[k].toString(2).padStart(8, '0')}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
            <span style={{ width: 54, height: 54, borderRadius: 10, background: hexStr, border: '1px solid var(--ol-border)' }} />
            <div>
              <div className={s.mono} style={{ fontSize: 18, fontWeight: 800 }}>{hexStr}</div>
              <input type="text" defaultValue="" placeholder="#DA251D" style={{ width: 100 }} onChange={(e) => { const v = hexToRgb(e.target.value); if (v) setRgb(v); }} />
            </div>
          </div>
          <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, 'The CSS colour #DA251D is just three bytes written in hex: DA = 218 red, 25 = 37 green, 1D = 29 blue. 256³ ≈ 16.7 million colours.', 'Màu CSS #DA251D chỉ là ba byte viết bằng hex: DA = 218 đỏ, 25 = 37 lục, 1D = 29 lam. 256³ ≈ 16,7 triệu màu.')}</div>
        </div>
        <div className={s.panel} data-tour="image">
          <div className={s.panelTitle}>{tx(lang, 'An 8 × 8 image (click to paint)', 'Ảnh 8 × 8 (bấm để tô)')}</div>
          <div className={s.bar} style={{ margin: '0 0 6px' }}>
            {PAL.map((col, k) => <button type="button" key={col} onClick={() => setBrush(k)} aria-label={col} style={{ width: 24, height: 24, borderRadius: 6, background: col, border: `3px solid ${brush === k ? 'var(--ol-accent)' : 'var(--ol-border)'}`, cursor: 'pointer' }} />)}
          </div>
          <div className={c.pixels} style={{ gridTemplateColumns: 'repeat(8, auto)' }}>
            {grid.map((v, i) => <button type="button" key={i} className={c.px} style={{ background: PAL[v] }} aria-label={`pixel ${i}`} onClick={() => { labSfx('pop'); setGrid(grid.map((x, j) => (j === i ? brush : x))); }} />)}
          </div>
          <div className={s.small} style={{ marginTop: 6 }}>{tx(lang, 'Row 1 in memory:', 'Hàng 1 trong bộ nhớ:')}</div>
          <div className={s.mono} style={{ fontSize: 11, wordBreak: 'break-all' }}>{grid.slice(0, 8).map((v) => PAL[v].slice(1).match(/../g)!.join(' ')).join(' · ')}</div>
        </div>
      </div>
      <Explain>{tx(lang,
        `This image is 8 × 8 × 3 = ${rawImageBytes(8, 8)} bytes. A Full HD photo is 1920 × 1080 × 3 = ${rawImageBytes(1920, 1080).toLocaleString('en')} bytes ≈ 5.9 MiB raw — PNG/JPEG compress that, but in memory (and on the GPU) it is exactly this grid of numbers.`,
        `Ảnh này là 8 × 8 × 3 = ${rawImageBytes(8, 8)} byte. Một ảnh Full HD là 1920 × 1080 × 3 = ${rawImageBytes(1920, 1080).toLocaleString('vi')} byte ≈ 5,9 MiB khi chưa nén — PNG/JPEG nén lại, nhưng trong RAM (và trên GPU) nó đúng là lưới số này.`)}</Explain>
    </div>
  );
}

/* ── Endianness ──────────────────────────────────────────────────────────────────────────── */
function EndianTab({ lang }: { lang: Lang }) {
  const [v, setV] = useState('12345678');
  const u = (parseInt(v.replace(/^0x/i, ''), 16) >>> 0) || 0;
  const machineLE = typeof Uint8Array !== 'undefined' && new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
  const row = (little: boolean) => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {bytesOfU32(u, little).map((b, k) => (
        <div key={k} className={c.byte}><span className={c.s}>0x{(0x1000 + k).toString(16).toUpperCase()}</span><span className={c.b}>{h2(b)}</span></div>
      ))}
    </div>
  );
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.lbl}>{tx(lang, '32-bit value (hex)', 'Giá trị 32 bit (hex)')} 0x<input type="text" value={v} maxLength={8} onChange={(e) => setV(e.target.value.replace(/[^0-9a-f]/gi, ''))} style={{ width: 110 }} /></span>
        <span className={s.small}>= {u.toLocaleString('en')}</span>
      </div>
      <div className={s.grid2}>
        <div className={s.panel}><div className={s.panelTitle}>{tx(lang, 'Big-endian (most significant byte first): network order, Java class files', 'Big-endian (byte cao trước): thứ tự mạng, tệp class Java')}</div>{row(false)}</div>
        <div className={s.panel}><div className={s.panelTitle}>{tx(lang, 'Little-endian (least significant byte first): x86-64, ARM, RISC-V', 'Little-endian (byte thấp trước): x86-64, ARM, RISC-V')}</div>{row(true)}</div>
      </div>
      <Explain>{tx(lang,
        `A 4-byte number occupies addresses 0x1000–0x1003; the two conventions disagree on which end goes first. Your browser runs on a ${machineLE ? 'LITTLE' : 'BIG'}-endian CPU. When you read a hex dump of x86 or ARM memory (in a debugger, in reverse engineering) multi-byte numbers look "reversed": 78 56 34 12 means 0x12345678. Network protocols send big-endian, which is why C has htonl().`,
        `Một số 4 byte chiếm địa chỉ 0x1000–0x1003; hai quy ước khác nhau ở chỗ đầu nào đi trước. Trình duyệt của bạn chạy trên CPU ${machineLE ? 'LITTLE' : 'BIG'}-endian. Khi đọc hex dump bộ nhớ x86 hay ARM (trong debugger, khi dịch ngược) số nhiều byte trông "bị đảo": 78 56 34 12 nghĩa là 0x12345678. Giao thức mạng gửi big-endian, vì thế C có hàm htonl().`)}</Explain>
    </div>
  );
}

export default function DataSim({ lang = 'vi', preset }: { lang?: Lang; preset?: string }) {
  const ALL: Tab[] = ['text', 'mojibake', 'float', 'color', 'endian'];
  const [tab, setTab] = useState<Tab>(ALL.includes(preset as Tab) ? (preset as Tab) : 'text');
  useLabBridge('data', { tab }, { tab: (x) => setTab(x as Tab) });
  const TABS: Array<[Tab, string, string]> = [
    ['text', 'Text → bytes', 'Chữ → byte'], ['mojibake', 'Mojibake', 'Lỗi font'], ['float', 'Real numbers (IEEE-754)', 'Số thực (IEEE-754)'],
    ['color', 'Colours & images', 'Màu & ảnh'], ['endian', 'Byte order', 'Thứ tự byte'],
  ];
  return (
    <CpuFrame lang={lang} title={tx(lang, 'Data representation', 'Biểu diễn dữ liệu')} sub={tx(lang, 'Text, real numbers and pictures are all just bytes', 'Chữ, số thực và hình ảnh đều chỉ là byte')}>
      <div className={s.tabs} role="tablist" data-tour="tabs">
        {TABS.map(([k, en, vi]) => <button type="button" role="tab" aria-selected={tab === k} key={k} className={cx(s.tab, tab === k && s.on)} onClick={() => setTab(k)}>{tx(lang, en, vi)}</button>)}
      </div>
      {tab === 'text' && <TextTab lang={lang} />}
      {tab === 'mojibake' && <MojiTab lang={lang} />}
      {tab === 'float' && <FloatTab lang={lang} />}
      {tab === 'color' && <ColorTab lang={lang} />}
      {tab === 'endian' && <EndianTab lang={lang} />}
    </CpuFrame>
  );
}
