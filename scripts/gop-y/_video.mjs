/**
 * Ánh xạ một góp ý có MỐC VIDEO (ô góp ý nhanh trong trang học) ⇒ tập video ⇒ câu lời đọc ở đúng thời điểm đó.
 * Dùng bởi scripts/gop-y/keo.mjs. Chỉ chạy được trên máy có kho video (Mac của chủ kênh) — máy khác ⇒ ghi lý do.
 *
 * Nguồn dữ liệu (kho video-bai-giang, KHÔNG thuộc repo này):
 *   <VBG>/src/bai/<id>/kichban.ts         BAI.slugWeb (= slug bài trên web), BAI.slug (= tên thư mục tập), BAI.slugWebThem
 *   <VBG>/public/bai/<id>/thoigian.json   { moDau, tong, canh[{ id, ten, tu, cau[{ id, a, b, hien, doc, nghe }] }] }
 *   <VID>/<khoá>/<chương>/<tập>/thong-tin.json   slugWeb, thoiLuongGiay, r2Goc (ms lúc đẩy R2), boQuaWeb, tron + cacPhan
 *   <VBG>/xuat/gan-chung.json             bài "gắn chung" video của bài khác
 *
 * MỐC: `a`/`b` trong thoigian.json là giây TUYỆT ĐỐI tính từ đầu video đã render — màn mở đầu (`moDau`, logo + tên bài,
 * 4,6 s) đã nằm TRONG đó (Root.tsx: <Sequence from={canh.tu}>, cảnh đầu `tu` = moDau), đuôi KetBai (5,2 s) nằm sau `tong`.
 * Đo 14/11/2026 trên 2.205 tập có cả thong-tin.json lẫn thoigian.json: 2.167 tập |thoiLuongGiay − tong| < 0,5 s ⇒ mốc
 * của player = mốc trong thoigian.json, không cần cộng/trừ gì. ~38 tập lệch 18–70 s = giọng đã làm lại SAU khi render
 * (video trên web còn là bản cũ) ⇒ ghi `canhBao`.
 * Bài nhiều phần trên web là video GHÉP (`xuat/ghep-phan.mts`, thư mục `…-tron`, `cacPhan` theo thứ tự) ⇒ mốc trừ dần
 * thời lượng từng phần để ra phần + mốc trong phần. ⚠ `thoiLuongGiay` của một tập = `tong` của giọng, KHÔNG phải độ
 * dài file: video thật dài hơn ~5,27 s (màn kết KetBai 5,2 s + làm tròn khung). Đo 14/11: ffprobe 844,395 vs 839,107;
 * bản `-tron` (ghép bằng ffprobe) − Σ thoiLuongGiay các phần = 5,267–5,27 s × số phần. Nên mỗi phần cộng đuôi đó.
 *
 * Env: GOP_Y_VBG (mặc định ~/Documents/video-bai-giang) · GOP_Y_VIDEO_GOC (mặc định ~/Videos/CuongThai-KhoaHoc).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const VBG = path.resolve(process.env.GOP_Y_VBG || path.join(os.homedir(), 'Documents/video-bai-giang'));
export const VID = path.resolve(process.env.GOP_Y_VIDEO_GOC || path.join(os.homedir(), 'Videos/CuongThai-KhoaHoc'));

const fmt = (s) => {
  const t = Math.max(0, Math.floor(s));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), x = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`;
};
/** Đuôi sau giọng của mỗi video (màn kết) — dùng khi không suy được từ bản ghép. */
const DUOI_MAC_DINH = 5.267;
const docJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
const laThuMuc = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

let CHI_MUC = null;

/** Dựng chỉ mục một lần: slugWeb ⇒ kịch bản, slugWeb ⇒ thong-tin, bài gắn chung ⇒ bài nguồn. */
function chiMuc() {
  if (CHI_MUC) return CHI_MUC;
  const kb = new Map(); // slugWeb ⇒ [{ id, slug }]
  const them = new Map(); // slugWeb phụ (slugWebThem) ⇒ slugWeb nguồn
  const theoSlugTap = new Map(); // BAI.slug ⇒ [{ id, slugWeb }]
  const dirBai = path.join(VBG, 'src/bai');
  if (laThuMuc(dirBai)) {
    for (const id of readdirSync(dirBai)) {
      const f = path.join(dirBai, id, 'kichban.ts');
      if (!existsSync(f)) continue;
      let k = '';
      try { k = readFileSync(f, 'utf8'); } catch { continue; }
      const khoiBai = /export const BAI\s*=\s*\{([\s\S]*?)\n\};/.exec(k)?.[1] ?? k;
      const slugWeb = /slugWeb:\s*['"]([^'"]+)['"]/.exec(khoiBai)?.[1];
      const slug = /\bslug:\s*['"]([^'"]+)['"]/.exec(khoiBai)?.[1] ?? null;
      if (!slugWeb) continue;
      (kb.get(slugWeb) ?? kb.set(slugWeb, []).get(slugWeb)).push({ id, slug });
      if (slug) (theoSlugTap.get(slug) ?? theoSlugTap.set(slug, []).get(slug)).push({ id, slugWeb });
      const th = /slugWebThem:\s*\[([^\]]*)\]/.exec(khoiBai)?.[1];
      if (th) for (const m of th.matchAll(/['"]([^'"]+)['"]/g)) if (!them.has(m[1])) them.set(m[1], slugWeb);
    }
  }
  const tt = new Map(); // slugWeb ⇒ [{ dir, tt }]
  if (laThuMuc(VID)) {
    for (const khoa of readdirSync(VID)) {
      const gk = path.join(VID, khoa);
      if (!laThuMuc(gk)) continue;
      for (const ch of readdirSync(gk)) {
        const gc = path.join(gk, ch);
        if (!laThuMuc(gc)) continue;
        for (const b of readdirSync(gc)) {
          const f = path.join(gc, b, 'thong-tin.json');
          if (!existsSync(f)) continue;
          const j = docJson(f);
          if (!j?.slugWeb) continue;
          (tt.get(j.slugWeb) ?? tt.set(j.slugWeb, []).get(j.slugWeb)).push({ dir: path.join(gc, b), tt: j });
        }
      }
    }
  }
  const ganChung = docJson(path.join(VBG, 'xuat/gan-chung.json')) ?? {};
  CHI_MUC = { kb, them, theoSlugTap, tt, ganChung };
  return CHI_MUC;
}

/** Bài web ⇒ slugWeb mang video (bản thân nó, hoặc bài nguồn khi "gắn chung"). */
function slugWebMangVideo(courseSlug, lessonSlug, ghiChu) {
  const { kb, them, tt, ganChung } = chiMuc();
  if (kb.has(lessonSlug) || tt.has(lessonSlug)) return lessonSlug;
  let nguon = ganChung?.[courseSlug]?.[lessonSlug];
  if (!nguon) for (const [k, v] of Object.entries(ganChung)) if (!k.startsWith('_') && v && typeof v === 'object' && v[lessonSlug]) { nguon = v[lessonSlug]; break; }
  nguon ??= them.get(lessonSlug);
  if (nguon) { ghiChu.push(`bài dùng CHUNG video của bài "${nguon}" (gan-chung / slugWebThem)`); return nguon; }
  return null;
}

/** Tập (id kịch bản) của một phần — khớp slugWeb + BAI.slug; bỏ tập "_…-nguon" nếu còn lựa chọn khác. */
function idCuaPhan(slugWeb, slugTap) {
  const { kb, theoSlugTap } = chiMuc();
  let ung = (kb.get(slugWeb) ?? []).filter((x) => x.slug === slugTap);
  if (!ung.length) ung = (theoSlugTap.get(slugTap) ?? []).map((x) => ({ id: x.id, slug: slugTap }));
  const tot = ung.filter((x) => !x.id.startsWith('_') && existsSync(path.join(VBG, 'public/bai', x.id, 'thoigian.json')));
  return (tot[0] ?? ung.find((x) => existsSync(path.join(VBG, 'public/bai', x.id, 'thoigian.json'))) ?? ung[0])?.id ?? null;
}

const gonCau = (c) => (c ? { id: c.id, a: c.a, b: c.b, moc: `${fmt(c.a)}–${fmt(c.b)}`, canhId: c.canhId, hien: c.hien ?? null, doc: c.doc ?? null, nghe: c.nghe ?? null } : null);

/**
 * @param {{ courseSlug: string, lessonSlug: string | null, giay: number | null, track: 'VI'|'EN'|'YT'|null }} q
 * @returns {object | null} null khi góp ý không có mốc.
 */
export function anhXaMoc({ courseSlug, lessonSlug, giay, track }) {
  if (giay == null) return null;
  const khong = (lyDo, them = {}) => ({ timThay: false, lyDo, ...them });
  if (track === 'YT') return khong('Mốc trên track YT = video YouTube tuyển chọn của tác giả khác — không có lời đọc của kênh để ánh xạ. Mở bài xem tại mốc đó.');
  if (track === 'EN') return khong('Track EN: chưa có bản lồng tiếng Anh nào gắn thoigian.json — kiểm tay tại mốc đó.');
  if (!lessonSlug) return khong('Góp ý không gắn bài (hoặc bài đã bị xoá) — không biết tập nào.');
  if (!laThuMuc(path.join(VBG, 'src/bai'))) return khong(`Không thấy kho video-bai-giang ở ${VBG} (đặt GOP_Y_VBG) — chỉ ánh xạ được trên máy có kho video.`);

  const ghiChu = [];
  const canhBao = [];
  const sw = slugWebMangVideo(courseSlug, lessonSlug, ghiChu);
  if (!sw) return khong(`Không có tập video nào mang slugWeb "${lessonSlug}" (kichban.ts) — bài chưa có video của kênh, hoặc video đang là YouTube tuyển chọn.`);

  // Danh sách phần theo đúng thứ tự trên video web.
  const { kb, tt } = chiMuc();
  const tts = tt.get(sw) ?? [];
  const tron = tts.find((x) => x.tt.tron && Array.isArray(x.tt.cacPhan));
  let phan = [];
  let r2Goc = null;
  let duoi = DUOI_MAC_DINH;
  if (tron) {
    r2Goc = tron.tt.r2Goc ?? null;
    phan = tron.tt.cacPhan.map((ten) => {
      const j = docJson(path.join(path.dirname(tron.dir), ten, 'thong-tin.json'));
      return { slugTap: ten, thoiLuong: j?.thoiLuongGiay ?? null, ttDir: path.join(path.dirname(tron.dir), ten) };
    });
    // Bản ghép đo bằng ffprobe ⇒ suy đúng đuôi của từng phần từ chính nó.
    const tongPhan = phan.reduce((a, x) => (a == null || x.thoiLuong == null ? null : a + x.thoiLuong), 0);
    if (tongPhan != null && typeof tron.tt.thoiLuongGiay === 'number') {
      const d = (tron.tt.thoiLuongGiay - tongPhan) / phan.length;
      if (d > 0 && d < 15) duoi = d;
    }
    ghiChu.push(`video web là bản GHÉP ${phan.length} phần (${path.basename(tron.dir)}), mỗi phần + ${duoi.toFixed(2)} s màn kết`);
  } else {
    const don = tts.filter((x) => !x.tt.boQuaWeb && !x.tt.tron);
    if (don.length) {
      const x = don.find((d) => d.tt.r2Url) ?? don[0];
      r2Goc = x.tt.r2Goc ?? null;
      phan = [{ slugTap: x.tt.slug ?? path.basename(x.dir), thoiLuong: x.tt.thoiLuongGiay ?? null, ttDir: x.dir }];
    } else {
      const ung = (kb.get(sw) ?? []).filter((x) => !x.id.startsWith('_') && x.slug);
      if (!ung.length) return khong(`slugWeb "${sw}" không có thong-tin.json lẫn kịch bản dùng được.`);
      ung.sort((p, q) => p.slug.localeCompare(q.slug));
      phan = ung.map((x) => ({ slugTap: x.slug, thoiLuong: null, ttDir: null }));
      ghiChu.push(
        ung.length > 1
          ? `không có thong-tin.json trên máy (video đã chuyển máy khác?) — GIẢ ĐỊNH web phát bản ghép ${ung.length} phần theo thứ tự slug`
          : 'không có thong-tin.json trên máy (video đã chuyển máy khác?) — không kiểm được thời lượng / ngày đẩy R2',
      );
    }
  }

  // Đọc thoigian.json của từng phần (cần `tong` khi thiếu thời lượng thật).
  for (const p of phan) {
    p.id = idCuaPhan(sw, p.slugTap);
    p.tepTG = p.id ? path.join(VBG, 'public/bai', p.id, 'thoigian.json') : null;
    p.tg = p.tepTG && existsSync(p.tepTG) ? docJson(p.tepTG) : null;
    const giong = p.thoiLuong ?? p.tg?.tong ?? null;
    p.dai = giong == null ? null : giong + duoi; // + màn kết (KetBai) — xem đầu tệp
  }

  // Phần chứa mốc.
  let lech = 0;
  let chon = null;
  for (let i = 0; i < phan.length; i++) {
    const p = phan[i];
    if (p.dai == null) { if (i === phan.length - 1 || phan.length === 1) { chon = { p, i }; break; } return khong(`Thiếu thời lượng phần ${i + 1} (${p.slugTap}) — không cộng dồn được mốc.`); }
    if (giay < lech + p.dai || i === phan.length - 1) { chon = { p, i }; break; }
    lech += p.dai;
  }
  const { p, i: soPhan } = chon;
  if (!p.id) return khong(`Không tìm thấy kịch bản cho tập "${p.slugTap}" (slugWeb ${sw}).`, { ghiChu });
  if (!p.tg) return khong(`Tập ${p.id} chưa có thoigian.json (chưa làm giọng?) — ${p.tepTG}`, { tap: p.id, ghiChu });

  const tg = p.tg;
  const t = giay - lech;

  // Cảnh báo lệch giữa video trên web và thoigian.json hiện tại.
  if (p.thoiLuong != null && Math.abs(p.thoiLuong - tg.tong) > 2) {
    canhBao.push(`thời lượng video ${p.thoiLuong.toFixed(1)} s ≠ thoigian.json ${tg.tong.toFixed(1)} s — giọng đã làm lại sau lần render này? Mốc có thể lệch.`);
  }
  if (r2Goc && p.tepTG) {
    const mt = statSync(p.tepTG).mtimeMs;
    if (mt > r2Goc + 60_000) canhBao.push(`thoigian.json sửa lúc ${new Date(mt).toISOString().slice(0, 16)}, SAU lần đẩy R2 ${new Date(r2Goc).toISOString().slice(0, 16)} — video người học xem có thể là bản giọng cũ.`);
  }

  const cauPhang = [];
  for (const c of tg.canh ?? []) for (const x of c.cau ?? []) cauPhang.push({ ...x, canhId: c.id, canhTen: c.ten });
  cauPhang.sort((x, y) => x.a - y.a);
  if (!cauPhang.length) return khong(`thoigian.json của ${p.id} không có câu nào.`, { tap: p.id });

  let viTri;
  let k;
  if (t < (tg.moDau ?? 0) || t < cauPhang[0].a) {
    viTri = t < (tg.moDau ?? 0) ? 'mo-dau' : 'truoc-cau-dau';
    k = 0;
  } else if (t > tg.tong) {
    viTri = 'man-ket';
    k = cauPhang.length - 1;
  } else {
    k = cauPhang.findIndex((c) => c.a <= t && t <= c.b);
    if (k >= 0) viTri = 'trong-cau';
    else {
      // Khoảng lặng giữa hai câu (nghỉ / hình chạy) ⇒ câu VỪA đọc xong — người học thường bấm ngay sau chỗ vấp.
      k = cauPhang.reduce((acc, c, idx) => (c.a <= t ? idx : acc), 0);
      viTri = 'giua-cau';
    }
  }
  const c = cauPhang[k];
  const MO_TA = {
    'mo-dau': 'màn mở đầu (logo + tên bài, chưa có giọng)',
    'truoc-cau-dau': 'ngay trước câu đầu',
    'trong-cau': 'đang đọc câu này',
    'giua-cau': 'khoảng lặng sau câu này',
    'man-ket': 'màn kết (sau giọng)',
  };
  return {
    timThay: true,
    tap: p.id,
    ...(phan.length > 1 ? { phan: soPhan + 1, tongPhan: phan.length, lechPhanGiay: +lech.toFixed(3) } : {}),
    giayTrongTap: +t.toFixed(2),
    mocTrongTap: fmt(t),
    viTri,
    viTriMoTa: MO_TA[viTri],
    canhId: c.canhId,
    canhTen: c.canhTen,
    cauId: c.id,
    cau: gonCau(c),
    truoc: gonCau(cauPhang[k - 1]),
    sau: gonCau(cauPhang[k + 1]),
    tepKichBan: path.join(VBG, 'src/bai', p.id, 'kichban.ts'),
    tepThoiGian: p.tepTG,
    ...(p.ttDir ? { thuMucTap: p.ttDir } : {}),
    ...(canhBao.length ? { canhBao } : {}),
    ...(ghiChu.length ? { ghiChu } : {}),
  };
}

export const dinhDangMoc = fmt;
