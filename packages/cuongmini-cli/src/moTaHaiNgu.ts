/**
 * Bản TIẾNG ANH của các câu trả lời lệnh `/` mà `ct-lenh` (của app) chỉ dựng
 * bằng tiếng Việt: /usage, /context, /status, /doctor, /rewind, /resume.
 * Hình dạng dữ liệu y như bản app — dữ liệu chung, chỉ khác lời.
 * Không import `ct-lenh` (để test nạp được không cần alias).
 */
export interface UsageEn { daDung: number; tran: number; conLai: number; phanTram: number; hoiLucNao: string | null; giaHan?: number; tranGoc?: number; soGio?: number; hoiHetLuc?: string | null; coKeyGiaHan?: boolean; tienNgay?: { phanTram: number; catViecNen: boolean; dungHet: boolean } | null }

const so = (n: number): string => n.toLocaleString('en-US');
const gio = (iso: string | null | undefined): string | null => (iso ? new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null);
const thanh = (p: number, o = 20): string => { const d = Math.max(0, Math.min(o, Math.round((p / 100) * o))); return `\`${'█'.repeat(d)}${'░'.repeat(o - d)}\``; };
const k = (n: number): string => `${Math.round(n / 1000)}k`;

export function usageEn(u: UsageEn, tokenMoiViec = 141_000): string {
  const d = [
    `**${u.soGio ?? 5}-hour usage** ${thanh(u.phanTram)} ${u.phanTram}%`, '',
    `- Used: **${so(u.daDung)}** / ${so(u.tran)} tokens`,
    `- Left: **${so(u.conLai)}** tokens ≈ ${Math.floor(u.conLai / tokenMoiViec)} tasks`,
  ];
  if (u.giaHan && u.giaHan > 0) d.push(`- Includes key extension: +${so(u.giaHan)} (base cap ${so(u.tranGoc ?? u.tran - u.giaHan)})`);
  const h = gio(u.hoiLucNao);
  const het = gio(u.hoiHetLuc);
  d.push(h ? `- Starts resetting around **${h}**${het ? ` · fully reset at ${het}` : ''}` : '- Nothing used in this window yet.');
  if (u.tienNgay) d.push(u.tienNgay.dungHet ? `- Server daily spend cap: **reached** (${u.tienNgay.phanTram}%) — AI paused until 00:00.` : `- Server daily spend cap: ${u.tienNgay.phanTram}%${u.tienNgay.catViecNen ? ' · background jobs cut' : ''}`);
  d.push(`- Extension key: ${u.coKeyGiaHan ? '**available** — enter it in the app/web when you run out' : 'not enabled (no key set by the admin)'}`);
  return d.join('\n');
}

export interface NguCanhEn { deBai: number; lichSu: number; ketQuaTool: number; soAnh: number; byteAnh: number; tong: number; soTin: number; soLuot: number; tongGui: number; tomTat: { soTinDaGop: number; luc: number } | null }

export function nguCanhEn(ct: NguCanhEn, tran: number, soLuotDaBo: number): string {
  const p = Math.min(100, Math.round((ct.tongGui / Math.max(1, tran)) * 100));
  const phan = (ten: string, n: number): string => `| ${ten} | ${k(n)} | ${ct.tong ? Math.round((n / ct.tong) * 100) : 0}% |`;
  return [
    `**Context** ${thanh(p)} ${k(ct.tongGui)} / ${k(tran)} chars (${p}%)`, '',
    '| Part | Chars | Share |', '|---|---|---|',
    phan('Prompt', ct.deBai), phan('Q&A history', ct.lichSu), phan('Tool results + args', ct.ketQuaTool),
    `| Images | ${ct.soAnh} · ${(ct.byteAnh / 1_048_576).toFixed(1)} MB | — |`, '',
    `- ${ct.soLuot} turns · ${ct.soTin} protocol messages`,
    ct.tomTat ? `- Compacted: first ${ct.tomTat.soTinDaGop} messages replaced by a summary. Sent: ${k(ct.tongGui)} instead of ${k(ct.tong)}.` : '- No summary yet — run `/compact` to shrink older turns.',
    soLuotDaBo > 0 ? `- ⚠ The server trimmed the **${soLuotDaBo}** oldest turns last time (with a summary).` : '- The server has not trimmed any turns.',
  ].join('\n');
}

export function trangThaiEn(t: { phienBan: string; duAn: string | null; duongDan: string | null; nhanh: string | null; model: string; muc: string; cheDo: string; tomTat: boolean }): string {
  return [
    '**Status**', '',
    `- Version: **${t.phienBan}**`,
    '- Gateway: main (CuongMini)',
    `- Model: ${t.model} · effort ${t.muc} · mode ${t.cheDo}`,
    t.duAn ? `- Project: \`${t.duAn}\`${t.duongDan ? ` — ${t.duongDan}` : ''}` : '- Project: no folder open',
    `- Git branch: ${t.nhanh ? `\`${t.nhanh}\`` : '—'}`,
    t.tomTat ? '- Conversation is compacted' : '',
  ].filter(Boolean).join('\n');
}

export function chanDoanEn(ds: ReadonlyArray<{ ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string }>): string {
  const dau = { ok: '✓', canh: '⚠', loi: '✗' };
  const loi = ds.filter((m) => m.muc === 'loi').length;
  const canh = ds.filter((m) => m.muc === 'canh').length;
  return [`**Diagnostics** — ${loi ? `${loi} error${loi > 1 ? 's' : ''}` : 'no errors'}${canh ? ` · ${canh} warning${canh > 1 ? 's' : ''}` : ''}`, '', ...ds.map((m) => `- ${dau[m.muc]} **${m.ten}**: ${m.chiTiet}`)].join('\n');
}

export function dsCauHoiEn(ds: ReadonlyArray<{ k: number; text: string }>): string {
  if (!ds.length) return 'This task has no questions to go back to yet.';
  return '**Go back to which question?** Type `/rewind <n>` — the conversation is cut from there and files the agent changed after it are reverted.\n\n'
    + ds.slice(-15).map((c) => `${c.k}. ${c.text.replace(/\s+/g, ' ').slice(0, 90)}${c.text.length > 90 ? '…' : ''}`).join('\n');
}

export function dsPhienEn(ds: ReadonlyArray<{ tieuDe: string; duAn: string | null; luucLuc: number; ghim?: boolean }>): string {
  if (!ds.length) return 'No matching tasks.';
  return '**Saved tasks** — type `/resume <n>` to open one here:\n\n'
    + ds.map((p, i) => `${i + 1}. ${p.ghim ? '📌 ' : ''}${p.tieuDe || 'Untitled task'}${p.duAn ? ` · \`${p.duAn}\`` : ''} · ${new Date(p.luucLuc).toLocaleDateString('en-US')}`).join('\n');
}
