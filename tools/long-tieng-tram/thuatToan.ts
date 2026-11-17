/**
 * Trạm CT Lồng Tiếng — phần THUẦN (không đụng tệp/mạng/tiến trình) để test được: tách đoạn Whisper dài, gộp câu, tách câu Việt dài
 * trước khi đọc, chấm điểm bản đọc (so chữ Whisper nghe lại), kiểm độ dài khả nghi, và KẾ HOẠCH thời gian (nhịp cho-giong / tang-toc).
 *   Test: npx tsx --test tools/long-tieng-tram/thuatToan.test.ts
 */

// ─── Đoạn lời gốc (Whisper) ────────────────────────────────────────────────

export interface Tu { a: number; b: number; t: string }
export interface Doan { a: number; b: number; t: string; w?: Tu[] }
export interface Cau { i: number; a: number; b: number; src: string }

/** Dấu kết thúc câu/vế (Trung + Anh + Việt). */
const DAU_CAU = /[。！？.!?；;：:…]["'”’)）\]]*$/u;
const DAU_PHAY = /[，,、]["'”’)）\]]*$/u;
const noi = (lang: string, a: string, b: string) => (lang === 'zh' ? a + b : `${a} ${b}`).replace(/\s+/g, ' ').trim();

/**
 * Đoạn Whisper dài hơn `tran` giây ⇒ tách. LỖI THẬT 18/11: Whisper trả MỘT đoạn 23,5 s ⇒ câu dịch 314 ký tự ⇒ F5 đọc vỡ giọng.
 * Có mốc từng từ: cắt sau từ mang dấu câu khi đoạn đã ≥ 2,5 s; chạm trần mà chưa gặp dấu ⇒ cắt ở dấu câu gần nhất, không có thì ở
 * khoảng lặng giữa hai từ dài nhất. Không có mốc từ: tách chữ theo dấu câu, chia thời gian theo số ký tự.
 */
export function tachDoanDai(d: Doan, lang: string, tran = 8): Doan[] {
  if (d.b - d.a <= tran) return [{ a: d.a, b: d.b, t: d.t }];
  const w = (d.w ?? []).filter((x) => x.t.trim());
  if (w.length >= 2) {
    const ra: Doan[] = [];
    let cur: Tu[] = [];
    const xa = (ds: Tu[]) => { if (ds.length) ra.push({ a: ds[0]!.a, b: ds.at(-1)!.b, t: ds.map((x) => x.t).join(lang === 'zh' ? '' : ' ').replace(/\s+/g, ' ').trim() }); };
    for (const x of w) {
      if (cur.length && x.b - cur[0]!.a > tran) {
        // chọn chỗ cắt trong `cur`
        let k = -1;
        for (let j = cur.length - 1; j >= 0; j--) if ((DAU_CAU.test(cur[j]!.t.trim()) || DAU_PHAY.test(cur[j]!.t.trim())) && cur[j]!.b - cur[0]!.a >= 1.5) { k = j; break; }
        if (k < 0) {
          let gap = -1;
          for (let j = Math.floor(cur.length / 3); j < cur.length - 1; j++) { const g = cur[j + 1]!.a - cur[j]!.b; if (g > gap) { gap = g; k = j; } }
          if (k < 0) k = cur.length - 1;
        }
        xa(cur.slice(0, k + 1));
        cur = cur.slice(k + 1);
      }
      cur.push(x);
      if (DAU_CAU.test(x.t.trim()) && x.b - cur[0]!.a >= 2.5) { xa(cur); cur = []; }
    }
    xa(cur);
    return ra;
  }
  // Không mốc từ: tách theo dấu câu rồi dồn thành mẩu ≤ tran giây (thời gian chia theo số ký tự).
  const manh = d.t.split(/(?<=[。！？.!?；;，,、])/u).map((s) => s.trim()).filter(Boolean);
  if (manh.length < 2) {
    const n = Math.ceil((d.b - d.a) / tran), buoc = Math.ceil(d.t.length / n);
    manh.splice(0, manh.length, ...Array.from({ length: n }, (_, i) => d.t.slice(i * buoc, (i + 1) * buoc)).filter(Boolean));
  }
  const tong = manh.reduce((s, x) => s + x.length, 0) || 1;
  const giayMoiKyTu = (d.b - d.a) / tong;
  const ra: Doan[] = [];
  let a = d.a, cur = '', dai = 0;
  for (const m of manh) {
    if (cur && (dai + m.length) * giayMoiKyTu > tran) { const b = a + dai * giayMoiKyTu; ra.push({ a, b, t: cur }); a = b; cur = ''; dai = 0; }
    cur = cur ? noi(lang, cur, m) : m; dai += m.length;
  }
  if (cur) ra.push({ a, b: d.b, t: cur });
  return ra;
}

/** Gộp đoạn ngắn thành câu (khe ≤ 0,35 s, câu ≤ tran giây, đoạn trước chưa hết câu) — như bản mẫu, trần 9 s ⇒ 8 s. */
export function gopCau(doan: Doan[], lang: string, tran = 8): Cau[] {
  const ra: Cau[] = [];
  for (const s0 of doan) for (const s of tachDoanDai(s0, lang, tran)) {
    const p = ra.at(-1);
    if (p && s.a - p.b <= 0.35 && s.b - p.a <= tran && !DAU_CAU.test(p.src)) { p.b = s.b; p.src = noi(lang, p.src, s.t); }
    else ra.push({ i: ra.length, a: s.a, b: s.b, src: s.t.trim() });
  }
  return ra;
}

/** Khe thời gian của câu i (tới đầu câu sau, chừa 0,15 s), tối thiểu 0,8 s — như bản mẫu. */
export const kheCau = (caus: Cau[], i: number, tongDai: number) => Math.max(0.8, (caus[i + 1]?.a ?? tongDai) - caus[i]!.a - 0.15);

/** Ký tự / giây khe dùng làm "toiDa" cho bản dịch. Bản mẫu 15 ⇒ câu Việt dài hơn khe trung vị 1,07× ⇒ hạ 13. */
export const KY_TU_MOI_GIAY = 13;

// ─── Tách câu Việt dài trước khi đọc ───────────────────────────────────────

export interface Manh { t: string; nghi: number }
/** Lặng ghép giữa hai mẩu — "nhịp C" của video bài giảng (lam-giong.mts): sau . ? ! : ; ⇒ 0,4 s, sau dấu phẩy ⇒ 0,18 s. */
export const NGHI_CAU = 0.4, NGHI_PHAY = 0.18, NGHI_KHAC = 0.12;
const nghiSau = (s: string) => (/[.?!:;…]["'”’)\]]*$/u.test(s.trim()) ? NGHI_CAU : /,["'”’)\]]*$/u.test(s.trim()) ? NGHI_PHAY : NGHI_KHAC);

function donMau(manh: string[], tran: number): string[] {
  const ra: string[] = [];
  let cur = '';
  for (const m of manh) {
    if (cur && (cur + ' ' + m).length > tran) { ra.push(cur); cur = m; } else cur = cur ? `${cur} ${m}` : m;
  }
  if (cur) ra.push(cur);
  return ra;
}

/**
 * Câu Việt > `tran` ký tự ⇒ các mẩu ≤ tran, tách ở ranh câu/vế (. ? ! ; :) trước, rồi dấu phẩy, cuối cùng ở dấu cách gần giữa.
 * F5 đọc câu dài (đo 18/11: 314 ký tự) thì vỡ giọng; câu ≤ 130 ký tự (trung vị lượt chạy thử 109) đọc ổn.
 * `nghi` = lặng chèn SAU mẩu đó khi ghép (mẩu cuối = 0).
 */
export function tachCauViet(s: string, tran = 130): Manh[] {
  const sach = s.replace(/\s+/g, ' ').trim();
  if (!sach) return [];
  if (sach.length <= tran) return [{ t: sach, nghi: 0 }];
  const tachTheo = (x: string, re: RegExp) => x.split(re).map((y) => y.trim()).filter(Boolean);
  let mau: string[] = [];
  for (const cau of donMau(tachTheo(sach, /(?<=[.?!;:…])\s+/u), tran)) {
    if (cau.length <= tran) { mau.push(cau); continue; }
    for (const ve of donMau(tachTheo(cau, /(?<=,)\s+/u), tran)) {
      if (ve.length <= tran) { mau.push(ve); continue; }
      // không dấu nào: cắt ở dấu cách gần giữa, lặp tới khi vừa
      let con = ve;
      while (con.length > tran) {
        const giua = Math.floor(Math.min(con.length / 2, tran));
        let k = con.lastIndexOf(' ', giua);
        if (k < tran / 3) k = con.indexOf(' ', giua);
        if (k <= 0) k = tran;
        mau.push(con.slice(0, k).trim()); con = con.slice(k).trim();
      }
      if (con) mau.push(con);
    }
  }
  mau = mau.filter(Boolean);
  return mau.map((t, i) => ({ t, nghi: i === mau.length - 1 ? 0 : nghiSau(t) }));
}

// ─── Chấm bản đọc ──────────────────────────────────────────────────────────

/** Chuẩn hoá để so: chữ thường, NFC, bỏ dấu câu, gộp khoảng trắng. */
export const chuan = (s: string) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

/** Tỉ lệ ký tự chung theo LCS (như `khop` của lam-giong.mts). */
export function lcsTiLe(x: string, y: string): number {
  if (!x || !y) return 0;
  const m = x.length, n = y.length;
  let prev = new Uint16Array(n + 1), cur = new Uint16Array(n + 1);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) cur[j] = x[i - 1] === y[j - 1] ? prev[j - 1]! + 1 : Math.max(prev[j]!, cur[j - 1]!);
    [prev, cur] = [cur, prev];
  }
  return (2 * prev[n]!) / (m + n);
}

/**
 * Điểm khớp 0..1 giữa chữ Whisper nghe lại và câu định đọc. Khoan dung với số/từ tiếng Anh: so thêm bản BỎ dấu cách ("use state" ≈
 * useState, "package json" ≈ package.json) và bản đã đổi số sang chữ (`docSo`, vd docSoTrongChu của phienAmBai) — lấy điểm cao nhất.
 */
export function diemKhop(nghe: string, mucTieu: string[], docSo?: (s: string) => string): number {
  const ung = [nghe, ...(docSo ? [docSo(nghe)] : [])].map(chuan);
  const muc = mucTieu.flatMap((m) => [m, ...(docSo ? [docSo(m)] : [])]).map(chuan).filter(Boolean);
  let best = 0;
  for (const a of ung) for (const b of muc) {
    best = Math.max(best, lcsTiLe(a, b), lcsTiLe(a.replace(/\s/g, ''), b.replace(/\s/g, '')));
    if (best >= 0.999) return 1;
  }
  return best;
}

/** Số "từ" (âm tiết Việt / từ Latin) của câu — để ước độ dài đọc. */
export const demTu = (s: string) => chuan(s).split(' ').filter(Boolean).length;
/** Nhịp giọng cuong8 ~0,39 s/âm tiết ở tốc độ 0,95 (đo 16/11, lam-giong.mts). */
export const GIAY_MOI_TU = 0.39;
export const NGUONG_DIEM = 0.85;

/** Độ dài bản đọc khả nghi: < 0,25 s/từ (nuốt chữ) hoặc > 3× kỳ vọng (lải nhải/lặng dài). */
export function doDaiKhaNghi(giay: number, text: string): string | null {
  const n = Math.max(1, demTu(text));
  if (giay < 0.25 * n) return `ngắn bất thường (${giay.toFixed(2)} s cho ${n} từ)`;
  if (giay > 3 * GIAY_MOI_TU * n + 1) return `dài bất thường (${giay.toFixed(2)} s cho ${n} từ)`;
  return null;
}

export interface BanDoc { seed: number; diem: number; giay: number; khaNghi: string | null }
/** Bản A tốt hơn bản B? Độ dài hợp lý thắng trước, rồi điểm cao hơn. */
export const totHon = (a: BanDoc, b: BanDoc | undefined) => !b || (!a.khaNghi && !!b.khaNghi) || (!!a.khaNghi === !!b.khaNghi && a.diem > b.diem);
export const datChuan = (b: BanDoc | undefined) => !!b && !b.khaNghi && b.diem >= NGUONG_DIEM;

// ─── Kế hoạch thời gian ────────────────────────────────────────────────────

/** Đoạn nguồn [a,b) chiếu chậm f lần (≤ 2) rồi giữ khung cuối g giây. */
export interface CuaSo { a: number; b: number; f: number; g: number }
export interface DatCau { i: number; batDau: number; tempo: number; giay: number }
export interface KeHoach { dat: DatCau[]; cuaSo: CuaSo[]; tongRa: number; soDocNhanh: number; soTre: number; giayKeoDai: number }

/** Thời điểm nguồn t ⇒ thời điểm trong video ra (sau khi kéo dài các cửa sổ). */
export function banDo(cuaSo: CuaSo[], t: number): number {
  let them = 0;
  for (const w of cuaSo) {
    if (t >= w.b) them += (w.b - w.a) * (w.f - 1) + w.g;
    else if (t > w.a) them += (t - w.a) * (w.f - 1);
  }
  return t + them;
}

const lamTronKhung = (t: number, fps: number) => Math.round(t * fps) / fps;

/**
 * Đặt từng câu Việt (độ dài `giay[i]` đã đọc) lên dòng thời gian.
 *  - `tang-toc` (bản mẫu): đọc nhanh tới 1,3× cho vừa khe; dài nữa thì trễ dồn sang câu sau. Video giữ nguyên.
 *  - `cho-giong`: chỉ nhanh tới 1,08×; còn thiếu thì KÉO DÀI đoạn hình của câu đó (cửa sổ [đầu câu, đầu câu sau)) — chiếu chậm tới 2×,
 *    quá nữa giữ khung cuối. Mốc cửa sổ làm tròn theo khung hình (fps) để ghép từng đoạn không trôi.
 */
export function lapKeHoach(caus: Cau[], giay: number[], tongDai: number, nhip: 'cho-giong' | 'tang-toc', fps = 30): KeHoach {
  const cuaSo: CuaSo[] = [];
  const dat: DatCau[] = [];
  let con = 0, soDocNhanh = 0, soTre = 0;
  const TRAN = nhip === 'tang-toc' ? 1.3 : 1.08;
  for (let i = 0; i < caus.length; i++) {
    const c = caus[i]!;
    const d = giay[i] ?? 0;
    if (d <= 0) continue;
    if (nhip === 'tang-toc') {
      const k = kheCau(caus, i, tongDai);
      const tempo = d > k ? Math.min(TRAN, d / k) : 1;
      if (tempo > 1) soDocNhanh++;
      const bd = Math.max(c.a, con);
      if (bd > c.a + 0.05) soTre++;
      dat.push({ i: c.i, batDau: bd, tempo, giay: d / tempo });
      con = bd + d / tempo + 0.12;
      continue;
    }
    const sau = caus[i + 1]?.a ?? tongDai;
    const batDau = Math.max(banDo(cuaSo, c.a), con);
    const choRa = banDo(cuaSo, sau) - batDau - 0.15;
    const tempo = choRa > 0 && d > choRa ? Math.min(TRAN, d / choRa) : 1;
    if (tempo > 1) soDocNhanh++;
    const dd = d / tempo;
    const can = batDau + dd + 0.15 - banDo(cuaSo, sau);
    if (can > 0.04) {
      const a = lamTronKhung(c.a, fps);
      const b = Math.max(lamTronKhung(sau, fps), a + 1 / fps);
      const L = b - a;
      const ra = Math.ceil((L + can) * fps) / fps;
      const f = Math.min(2, ra / L);
      cuaSo.push({ a, b, f, g: Math.max(0, ra - L * f) });
    }
    if (batDau > banDo(cuaSo, c.a) + 0.05) soTre++;
    dat.push({ i: c.i, batDau, tempo, giay: dd });
    con = batDau + dd + 0.12;
  }
  const tongRa = Math.max(banDo(cuaSo, tongDai), ...dat.map((x) => x.batDau + x.giay + 0.3));
  const giayKeoDai = cuaSo.reduce((s, w) => s + (w.b - w.a) * (w.f - 1) + w.g, 0);
  return { dat, cuaSo, tongRa, soDocNhanh, soTre, giayKeoDai };
}

/** Chia [0, tongDai) thành các đoạn liền nhau: đoạn thường (f=1) xen cửa sổ kéo dài. */
export function chiaDoan(cuaSo: CuaSo[], tongDai: number): CuaSo[] {
  const ra: CuaSo[] = [];
  let t = 0;
  for (const w of [...cuaSo].sort((x, y) => x.a - y.a)) {
    if (w.a > t + 1e-6) ra.push({ a: t, b: w.a, f: 1, g: 0 });
    ra.push(w);
    t = w.b;
  }
  if (tongDai > t + 1e-6) ra.push({ a: t, b: tongDai, f: 1, g: 0 });
  return ra;
}

// ─── Phụ đề + tên tệp ──────────────────────────────────────────────────────

export const mocSrt = (x: number) => {
  const ms = Math.max(0, Math.round(x * 1000));
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
export const dongSrt = (ds: { a: number; b: number; t: string }[]) =>
  ds.map((x, k) => `${k + 1}\n${mocSrt(x.a)} --> ${mocSrt(x.b)}\n${x.t}\n`).join('\n');

/** Tên tệp kết quả an toàn trên Mac/Windows/Linux (giữ tiếng Việt, bỏ / \ : * ? " < > |). */
export const tenAnToan = (s: string) => s.replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150) || 'video';

export function tenKetQua(ten: string, lang: string, goc: number) {
  const t = tenAnToan(ten);
  return {
    vi: `${t} [VI].mp4`,
    'vi-goc': `${t} [VI + giọng gốc ${Math.round(goc * 100)}%].mp4`,
    'srt-vi': `${t}.vi.srt`,
    'srt-goc': `${t}.${lang === 'zh' || lang === 'en' ? lang : lang || 'goc'}.srt`,
    'thong-tin': 'thong-tin.json',
  } as const;
}
