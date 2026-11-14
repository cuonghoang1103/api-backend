/**
 * SOÁT NỘI DUNG đề thi thử CT Language bằng máy (15/11/2026) — những lỗi `kiemDe` (khuôn) không thấy:
 * giải thích kết luận ngược đáp án, kịch bản nghe lẫn chữ lạ / ký hiệu vai, câu hỏi nghe không khớp chữ trên màn,
 * đáp án điền không có trong bài, đáp án dồn một vị trí, câu trùng giữa các đề, `tu` không xuất hiện trong câu,
 * pinyin / cách đọc kana trong giải thích lệch từ điển (`--tu-dien`, cần CSDL local có bảng `ctl_tu`).
 *
 *   npx tsx scripts/ctlanguage-soat-de-thi.mts                 # mọi đề
 *   npx tsx scripts/ctlanguage-soat-de-thi.mts hsk4-de-1 --tu-dien
 *
 * Mức: ✗ LỖI (gần như chắc chắn sai ⇒ exit 1) · ! NGHI (người soát xem lại; không làm đỏ). Máy KHÔNG thay người soát:
 * "chỉ một đáp án đúng", độ tự nhiên của câu, bẫy có công bằng không… vẫn phải đọc.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chuanHoaDapAn, kiemCap, kiemDe, type CauNghe, type CauThi, type DeThi, type NhomCau, type PhanThi } from '../src/services/ctlanguage/thiThuan.js';

const thuMuc = path.join(process.cwd(), 'content', 'ctlanguage', 'de-thi');
const doiSo = process.argv.slice(2);
const dungTuDien = doiSo.includes('--tu-dien');
const chi = doiSo.filter((a) => !a.startsWith('--'));

type Muc = 'loi' | 'nghi';
const baoCao: Array<{ de: string; cau: string; muc: Muc; loai: string; chu: string }> = [];
const bao = (de: string, cau: string, muc: Muc, loai: string, chu: string) => baoCao.push({ de, cau, muc, loai, chu });

const CJK = /[㐀-鿿]/;
const KANA = /[぀-ヿ]/;
const VIET = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const PINYIN_THANH = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;

function kiemNghe(de: DeThi, o: string, ds: CauNghe[] | undefined) {
  for (const n of ds ?? []) {
    const t = n.t;
    if (/^\s*(男|女|男的|女的|A|B|M|F|W|Man|Woman|男の人|女の人)\s*[:：]/.test(t)) bao(de.id, o, 'loi', 'nghe-ky-hieu-vai', `lời nghe mở đầu bằng ký hiệu vai: "${t.slice(0, 30)}"`);
    if (de.nn === 'en') {
      if (CJK.test(t) || KANA.test(t) || /[ăâêôơưđ\u0300-\u0323]/i.test(t.normalize('NFD').replace(/[eac]\u0301|[ae]\u0300|n\u0303|[ou]\u0308/gi, ''))) bao(de.id, o, 'loi', 'nghe-chu-la', `lời nghe tiếng Anh lẫn chữ khác: "${t.slice(0, 40)}"`);
    } else {
      if (VIET.test(t) || PINYIN_THANH.test(t)) bao(de.id, o, 'loi', 'nghe-chu-la', `lời nghe lẫn tiếng Việt / pinyin: "${t.slice(0, 40)}"`);
      const latin = t.match(/[A-Za-z]{2,}/g)?.filter((w) => !/^(CD|DVD|OK|ATM|PC|SNS|JR|IT|AI|TV|QR|APP|Wi|Fi|WiFi|KTV|HSK|JLPT|CuongMini)$/i.test(w));
      if (latin?.length) bao(de.id, o, 'nghi', 'nghe-chu-latin', `lời nghe có chữ Latin (TTS đọc lạ): ${latin.slice(0, 4).join(', ')}`);
      if (de.nn === 'zh' && KANA.test(t)) bao(de.id, o, 'loi', 'nghe-chu-la', `lời nghe tiếng Trung lẫn kana: "${t.slice(0, 30)}"`);
      if (!CJK.test(t) && !KANA.test(t) && !/^\d/.test(t)) bao(de.id, o, 'nghi', 'nghe-khong-co-chu', `lời nghe không có chữ ${de.nn}: "${t.slice(0, 30)}"`);
    }
    if (/[（(][^）)]*[)）]/.test(t) && de.nn !== 'en') bao(de.id, o, 'nghi', 'nghe-ngoac', `lời nghe có ngoặc đơn (TTS đọc cả phần trong ngoặc): "${t.slice(0, 40)}"`);
  }
}

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

/** Kết luận ở CUỐI giải thích ("⇒ Sai", "→ True", "⇒ đáp án B"). */
function ketLuanCuoi(g: string): string | null {
  const m = g.match(/(?:⇒|=>|→)\s*([^⇒→]{1,40}?)[\s.。!！)）"”]*$/);
  return m ? m[1]!.trim() : null;
}

function kiemCau(de: DeThi, p: PhanThi, g: NhomCau, c: CauThi) {
  const o = c.id;
  const nghe = c.nghe ?? g.nghe;
  const loiNghe = (nghe ?? []).map((n) => n.t).join(' ');
  const tatCaChu = [c.de ?? '', ...(c.luaChon ?? []), loiNghe, g.doan ?? '', c.giaiThich, c.mau ?? '', ...(c.manh ?? []), ...(Array.isArray(c.dapAn) ? c.dapAn : [])].join(' ');

  if (c.nghe) kiemNghe(de, o, c.nghe);

  // Giải thích không được còn chỗ soạn dở.
  if (/TODO|\?\?\?|xxx|lorem/i.test(c.giaiThich)) bao(de.id, o, 'loi', 'giai-thich-do', 'giải thích còn chữ soạn dở');
  if (!VIET.test(c.giaiThich)) bao(de.id, o, 'nghi', 'giai-thich-khong-viet', 'giải thích không có tiếng Việt');

  if (c.kieu === 'chon' && Array.isArray(c.luaChon) && typeof c.dapAn === 'number') {
    const lc = c.luaChon;
    const dung = lc[c.dapAn] ?? '';
    const kl = ketLuanCuoi(c.giaiThich);
    // Đúng/Sai · True/False/Not Given · Yes/No/Not Given: kết luận cuối giải thích phải trùng đáp án.
    const nhan = lc.map((x) => boDau(x.trim()));
    if (kl && nhan.every((x) => ['dung', 'sai', 'true', 'false', 'not given', 'yes', 'no'].includes(x))) {
      const k = boDau(kl).replace(/[^a-z ]/g, '').trim();
      const i = nhan.findIndex((x) => k === x || k.startsWith(`${x} `) || k.endsWith(` ${x}`));
      if (i >= 0 && i !== c.dapAn) bao(de.id, o, 'loi', 'giai-thich-nguoc', `giải thích kết luận "${kl}" nhưng đáp án là "${dung}"`);
    } else if (kl) {
      // Kết luận cuối trùng NGUYÊN VĂN một phương án sai.
      const k = chuanHoaDapAn(kl);
      const i = lc.findIndex((x) => chuanHoaDapAn(x) === k);
      if (k && i >= 0 && i !== c.dapAn) bao(de.id, o, 'loi', 'giai-thich-nguoc', `giải thích kết luận "${kl}" nhưng đáp án là "${dung}"`);
    }
    // "đáp án B" / "chọn C" trong giải thích lệch chỉ số.
    const chuCai = c.giaiThich.match(/(?:đáp án(?: đúng)?(?: là)?|chọn)\s+([A-J])\b(?!\s*[–-]\s*[A-J])/);
    if (chuCai && lc.every((x) => !/^[A-J]$/.test(x.trim())) && 'ABCDEFGHIJ'.indexOf(chuCai[1]!) !== c.dapAn) {
      bao(de.id, o, 'nghi', 'giai-thich-chu-cai', `giải thích nói "${chuCai[0]}" nhưng đáp án ở vị trí ${'ABCDEFGHIJ'[c.dapAn]}`);
    }
    // Hai phương án giống nhau sau khi bỏ dấu câu / khoảng trắng.
    const chuan = lc.map(chuanHoaDapAn);
    if (new Set(chuan).size !== chuan.length) bao(de.id, o, 'loi', 'lua-chon-trung', 'hai lựa chọn giống nhau sau khi bỏ dấu câu');
    // Câu nghe có câu hỏi đọc to (HSK / JLPT): chữ trên màn phải khớp một câu trong lời nghe.
    if (p.kyNang === 'nghe' && nghe && c.de && de.nn !== 'en' && (CJK.test(c.de) || KANA.test(c.de)) && !c.de.includes('★') && !VIET.test(c.de)) {
      const d = chuanHoaDapAn(c.de);
      if (!nghe.some((n) => chuanHoaDapAn(n.t).includes(d))) bao(de.id, o, de.nn === 'zh' ? 'loi' : 'nghi', 'cau-hoi-lech-loi-nghe', `câu hỏi trên màn "${c.de.slice(0, 30)}" không có trong lời nghe`);
    }
    // 即時応答 / 発話表現: lựa chọn "1/2/3" ⇒ lời nghe phải có đủ các câu đánh số.
    if (lc.every((x) => /^\d$/.test(x.trim())) && nghe) {
      for (const x of lc) if (!nghe.some((n) => n.t.trim().startsWith(x.trim()))) bao(de.id, o, 'loi', 'thieu-cau-danh-so', `lời nghe thiếu câu số ${x}`);
    }
    // Sắp mảnh ★ (JLPT 文の組み立て): giải thích phải nêu ★ = đúng phương án.
    const sao = c.giaiThich.match(/★\s*(?:=|là|:)\s*([^\s.,。、()（）]+)/);
    if (sao && c.de?.includes('★') && chuanHoaDapAn(sao[1]!) !== chuanHoaDapAn(dung) && !chuanHoaDapAn(sao[1]!).startsWith(chuanHoaDapAn(dung))) {
      bao(de.id, o, 'loi', 'sao-lech', `giải thích ghi ★ = ${sao[1]} nhưng đáp án là "${dung}"`);
    }
    // 文の組み立て: câu hoàn chỉnh trong giải thích phải dùng đủ 4 mảnh, và mảnh ★ đứng đúng vị trí ★ của đề.
    if (c.de?.includes('★') && lc.length === 4 && de.nn === 'ja') {
      const g2 = chuanHoaDapAn(c.giaiThich);
      for (const x of lc) if (!g2.includes(chuanHoaDapAn(x))) bao(de.id, o, 'nghi', 'manh-vang', `giải thích không nhắc mảnh "${x}"`);
    }
  }

  if (c.kieu === 'dien' && Array.isArray(c.dapAn)) {
    // IELTS: đáp án điền phải có NGUYÊN VĂN trong lời nghe / bài đọc.
    if (de.nn === 'en') {
      const nguon = boDau(p.kyNang === 'nghe' ? loiNghe : g.doan ?? '');
      if (nguon && !c.dapAn.some((d) => nguon.includes(boDau(d)))) bao(de.id, o, 'loi', 'dien-khong-co-trong-bai', `đáp án "${c.dapAn[0]}" không có nguyên văn trong ${p.kyNang === 'nghe' ? 'lời nghe' : 'bài đọc'}`);
      if (!c.de?.includes('___') && !/\(\d+\)|\[\[/.test(c.de ?? '')) bao(de.id, o, 'nghi', 'dien-thieu-cho-trong', 'đề câu điền không có chỗ trống ___');
    } else {
      if (!c.de?.includes('___')) bao(de.id, o, 'nghi', 'dien-thieu-cho-trong', 'đề câu điền không có chỗ trống ___');
      if (!c.dapAn.some((d) => c.giaiThich.includes(d))) bao(de.id, o, 'nghi', 'giai-thich-thieu-dap-an', `giải thích không nhắc đáp án "${c.dapAn[0]}"`);
    }
  }

  if (c.kieu === 'sapXep' && Array.isArray(c.dapAn)) {
    if (!c.dapAn.some((d) => chuanHoaDapAn(c.giaiThich).includes(chuanHoaDapAn(d)))) bao(de.id, o, 'nghi', 'giai-thich-thieu-dap-an', 'giải thích không chép lại câu đúng');
  }

  for (const t of c.tu ?? []) {
    const loi = t.replace(/[〜～…\s()（）]/g, '');
    // Tiếng Nhật: `tu` ở dạng từ điển còn câu thì chia ⇒ chỉ so GỐC (bỏ đuôi biến đổi). Tiếng Anh: tên ngữ pháp không nằm trong câu.
    const manh = loi.split(/[·\/]/).filter(Boolean).map((m) => (de.nn === 'ja' ? m.slice(0, Math.max(1, Math.min(2, m.length - 1))) : m));
    if (de.nn === 'en' && /\s|…/.test(t)) continue;
    if (manh.length && !manh.some((m) => chuanHoaDapAn(tatCaChu).includes(chuanHoaDapAn(m)))) bao(de.id, o, 'nghi', 'tu-khong-co-trong-cau', `từ then chốt "${t}" không xuất hiện trong câu / giải thích`);
  }
}

function kiemPhanBo(de: DeThi) {
  for (const p of de.phan) {
    for (const [gi, g] of p.nhom.entries()) {
      if (g.nghe) kiemNghe(de, `${p.id}/nhóm ${gi + 1}`, g.nghe);
      const chon = g.cau.filter((c) => c.kieu === 'chon' && typeof c.dapAn === 'number');
      if (chon.length < 5) continue;
      const soLc = Math.max(...chon.map((c) => c.luaChon!.length));
      const dem = new Map<number, number>();
      let chuoi = 1, daiNhat = 1;
      chon.forEach((c, i) => {
        dem.set(c.dapAn as number, (dem.get(c.dapAn as number) ?? 0) + 1);
        if (i > 0 && chon[i - 1]!.dapAn === c.dapAn) { chuoi++; daiNhat = Math.max(daiNhat, chuoi); } else chuoi = 1;
      });
      const nhieuNhat = Math.max(...dem.values());
      if (soLc >= 3 && nhieuNhat / chon.length > 0.55) bao(de.id, `${p.id}/nhóm ${gi + 1}`, 'nghi', 'dap-an-don-vi-tri', `${nhieuNhat}/${chon.length} đáp án cùng một vị trí`);
      if (daiNhat >= 5) bao(de.id, `${p.id}/nhóm ${gi + 1}`, 'nghi', 'dap-an-don-vi-tri', `${daiNhat} câu liền nhau cùng một vị trí đáp án`);
    }
  }
}

// ─── Từ điển (tuỳ chọn): pinyin / kana trong giải thích ────────
const BO_THANH: Record<string, [string, number]> = {};
for (const [goc, ds] of Object.entries({ a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ' })) [...ds].forEach((ch, i) => { BO_THANH[ch] = [goc, i + 1]; });
const khongThanh = (s: string) => [...s.toLowerCase()].map((ch) => BO_THANH[ch]?.[0] ?? ch).join('').replace(/[\s'’\-·]/g, '').replace(/v/g, 'ü');

const LA_PINYIN = /^(?:(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(?:iang|iong|uang|ian|iao|uai|uan|üan|ang|eng|ing|ong|ai|an|ao|ei|en|er|ia|ie|in|iu|ou|ua|ue|ui|un|uo|üe|ün|a|e|i|o|u|ü)r?)+$/;
function khoangCach(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length]![b.length]!;
}

async function kiemTuDien(cacDe: DeThi[]) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    for (const de of cacDe) {
      if (de.nn === 'en') continue;
      const cap: Array<{ o: string; chu: string; doc: string }> = [];
      for (const p of de.phan) for (const g of p.nhom) for (const c of g.cau) {
        const re = de.nn === 'zh'
          ? /([㐀-鿿]{1,6})\s*[（(]([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü' ]{1,40})[)）]/g
          : /([㐀-鿿々][㐀-鿿々぀-ゟ]{0,7})\s*[（(]([぀-ゟー]{1,16})[)）]/g;
        // Tiếng Trung: chỉ nhận ngoặc có DẤU THANH (ngoặc không dấu thường là nghĩa tiếng Việt: "高 (cao)").
        for (const m of c.giaiThich.matchAll(re)) if (de.nn !== 'zh' || (PINYIN_THANH.test(m[2]!) && !/[ăâêôơưđ]/i.test(m[2]!))) cap.push({ o: c.id, chu: m[1]!, doc: m[2]!.trim() });
      }
      const chu = [...new Set(cap.map((x) => x.chu))];
      const ds = chu.length ? await prisma.ctlTu.findMany({ where: { nn: de.nn, chu: { in: chu } }, select: { chu: true, doc: true } }) : [];
      const theo = new Map<string, string[]>();
      for (const d of ds) if (d.doc) theo.set(d.chu, [...(theo.get(d.chu) ?? []), d.doc]);
      for (const x of cap) {
        const co = theo.get(x.chu);
        if (!co?.length) continue; // dạng chia / cụm không có mục từ ⇒ không kết luận
        if (de.nn === 'zh') {
          const a = khongThanh(x.doc);
          if (!co.some((d) => khongThanh(d) === a || khongThanh(d).replace(/r$/, '') === a.replace(/r$/, ''))) {
            // Ngoặc là NGHĨA tiếng Việt có dấu trùng dấu thanh ("饭店 (nhà hàng)") ⇒ không phải pinyin: bỏ qua.
            if (!LA_PINYIN.test(a)) continue;
            // Lệch ≤ 2 chữ cái so với từ điển = gõ nhầm pinyin (lỗi); lệch xa = nhiều khả năng là nghĩa tiếng Việt (nghi).
            const gan = co.some((d) => khoangCach(khongThanh(d), a) <= 2);
            bao(de.id, x.o, gan ? 'loi' : 'nghi', 'pinyin-lech', `${x.chu} (${x.doc}) — từ điển: ${[...new Set(co)].slice(0, 3).join(' / ')}`);
          } else if (!/[一不]/.test(x.chu)) {
            // Thanh điệu: khác MỌI mục từ, không tính chỗ từ điển / giải thích để thanh nhẹ.
            const thanh = (s: string) => [...s.toLowerCase()].filter((ch) => /[aeiouü]/.test(BO_THANH[ch]?.[0] ?? ch)).map((ch) => BO_THANH[ch]?.[1] ?? 0);
            const ta = thanh(x.doc);
            const khop = co.some((d) => { const tb = thanh(d); return tb.length === ta.length && tb.every((t, i) => t === ta[i] || t === 0 || ta[i] === 0); });
            if (!khop) bao(de.id, x.o, 'nghi', 'thanh-dieu-lech', `${x.chu} (${x.doc}) — từ điển: ${[...new Set(co)].slice(0, 3).join(' / ')}`);
          }
        } else {
          const hira = (s: string) => s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
          if (!co.some((d) => hira(d) === hira(x.doc))) bao(de.id, x.o, 'nghi', 'cach-doc-lech', `${x.chu} (${x.doc}) — từ điển: ${[...new Set(co)].slice(0, 4).join(' / ')}`);
        }
      }
    }
  } finally { await prisma.$disconnect(); }
}

// ─── Chạy ─────────────────────────────────────────────────────
const tep = fs.readdirSync(thuMuc).filter((f) => f.endsWith('.json')).sort();
const tatCa: DeThi[] = [];
for (const f of tep) {
  try { tatCa.push(JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8')) as DeThi); }
  catch (e) { console.error(`✗ ${f}: JSON hỏng — ${(e as Error).message}`); process.exitCode = 1; }
}
const xet = tatCa.filter((d) => !chi.length || chi.includes(d.id));
let soCau = 0;
for (const de of xet) {
  for (const l of [...kiemDe(de), ...kiemCap(de)]) bao(de.id, '-', 'loi', 'khuon', l);
  kiemPhanBo(de);
  for (const p of de.phan) for (const g of p.nhom) for (const c of g.cau) { soCau++; kiemCau(de, p, g, c); }
}

// Câu trùng giữa MỌI đề (kể cả đề không nằm trong danh sách đang xét): cùng đề bài + cùng lời nghe.
const daThay = new Map<string, string>();
for (const de of tatCa) for (const p of de.phan) for (const g of p.nhom) for (const c of g.cau) {
  const khoa = chuanHoaDapAn([c.de ?? '', (c.nghe ?? []).map((n) => n.t).join(''), (c.manh ?? []).slice().sort().join(''), (c.luaChon ?? []).slice().sort().join('')].join('|'));
  if (khoa.length < 12 || /^(hinhnao|nghecaunoi|sapxep|tinhhuong)/.test(boDau(khoa)) && !(c.nghe ?? c.manh)) continue;
  if (c.kieu === 'chon' && !c.nghe && (c.de ?? '').length < 12) continue; // "[1]", "A", từ đơn của 用法…
  const truoc = daThay.get(khoa);
  const day = `${de.id}#${c.id}`;
  if (truoc && (xet.includes(de) || xet.some((d) => truoc.startsWith(`${d.id}#`)))) bao(de.id, c.id, truoc.startsWith(`${de.id}#`) ? 'loi' : 'nghi', 'cau-trung', `trùng với ${truoc}`);
  else if (!truoc) daThay.set(khoa, day);
}

if (dungTuDien) {
  try { await kiemTuDien(xet); }
  catch (e) { console.error(`(bỏ qua --tu-dien: ${(e as Error).message.split('\n')[0]})`); }
}

const theoDe = new Map<string, typeof baoCao>();
for (const b of baoCao) theoDe.set(b.de, [...(theoDe.get(b.de) ?? []), b]);
for (const [de, ds] of theoDe) {
  console.log(`\n${de} — ${ds.filter((d) => d.muc === 'loi').length} lỗi · ${ds.filter((d) => d.muc === 'nghi').length} nghi`);
  for (const d of ds) console.log(`  ${d.muc === 'loi' ? '✗' : '!'} câu ${d.cau} [${d.loai}] ${d.chu}`);
}
const loi = baoCao.filter((b) => b.muc === 'loi').length;
const theoLoai = new Map<string, number>();
for (const b of baoCao) theoLoai.set(b.loai, (theoLoai.get(b.loai) ?? 0) + 1);
console.log(`\n${xet.length} đề · ${soCau} câu · ${loi} lỗi · ${baoCao.length - loi} nghi${dungTuDien ? ' (có đối chiếu từ điển)' : ''}`);
if (theoLoai.size) console.log([...theoLoai].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
if (loi) process.exit(1);
