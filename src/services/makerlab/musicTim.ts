/**
 * ============================================================
 * Maker Lab — hiểu lời xin nhạc + chấm điểm bài trong thư viện (15/11/2026)
 * ============================================================
 *
 * Người dùng: "nó giới hạn nhiều quá, nghe được có mấy bài". Bản trước:
 *   - chỉ tìm mục NORMAL (bỏ cả kho REMIX/DJ),
 *   - so `contains` PHÂN BIỆT DẤU — Whisper rớt một dấu là trượt,
 *   - không khớp ⇒ bốc đại MỘT bài ⇒ nhánh tìm YouTube không bao giờ chạy,
 *   - phát một bài rồi im.
 *
 * File này THUẦN (không DB) để test được: nhận cả kho đã nạp sẵn, trả hàng đợi.
 */

export interface BaiTrongKho {
  id: number;
  title: string;
  artist: string;
  url: string;
  durationSeconds: number | null;
  category: string;
  language: string | null;
}

export interface YeuCauNhac {
  /** 'bat-ky' = "bật nhạc đi", không nêu bài/ca sĩ cụ thể. */
  kieu: 'bat-ky' | 'tim';
  tuKhoa: string;
  remix: boolean;
  ngonNgu: 'vi' | 'en' | 'zh' | null;
}

/** Bỏ dấu, hạ chữ, chỉ còn chữ + số + một dấu cách. */
export function chuan(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Chữ đệm trong lời xin nhạc — bỏ trước khi dò (đã bỏ dấu). */
const DEM = new Set([
  'nhac', 'bai', 'hat', 'mo', 'bat', 'cho', 'toi', 'minh', 'tao', 'giup', 'nghe', 'len', 'nao', 'khac', 'gi',
  'day', 'voi', 'cua', 'mot', 'ten', 'thich', 'muon', 'song', 'play', 'music', 'nay', 'kia', 'do', 'duoc',
  'di', 'nhe', 'nha', 'ban', 'vai', 'cac', 'nhung', 'phat', 'playlist', 'dum', 'gium', 'odin', 'oi',
  // ⚠️ KHÔNG bỏ 'anh', 'em', 'ho', 'hay'… — chúng nằm trong tên ca sĩ (Hà Anh Tuấn, Hồ Ngọc Hà).
]);

/** Cụm đệm nhiều chữ — bỏ NGUYÊN CỤM trước khi tách chữ ("bài hát của ca sĩ Đen" ⇒ "den"). */
const CUM_DEM = /\s(bai hat|ca si|nhac si|ban nhac|mot bai|vai bai|may bai|cho toi nghe|cho minh nghe)\s/g;

const BAT_KY = /^(random|any|anything|bat ky|bat cu|gi cung duoc|tuy|gi do|ngau nhien|tuy y)$/;

/**
 * Câu nói có phải XIN BẬT NHẠC không (15/11/2026). Trả từ khoá bài/ca sĩ ('' = bài bất kỳ), null = không phải.
 * Có vì trước đây bật nhạc trông hoàn toàn vào việc model nhớ kèm lệnh `play_music` — log 15/11 20:39–20:41:
 * robot nói "bật bài Baby rồi" bốn lần mà không lần nào gửi lệnh. Giờ server tự bắt câu xin nhạc. THUẦN.
 */
export function khopXinNhac(heard: string): string | null {
  const s = heard.toLowerCase().normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!s || s.length > 200) return null;
  if (/(tắt|dừng|ngừng|thôi|đừng)\s+(bật\s+|mở\s+|phát\s+)?(nhạc|bài)/.test(s)) return null;
  if (/(phần|đoạn|cách|viết)\s+mở bài|mở bài\s+(nên|là|cần|phải|gồm|như|thế|sao|ra sao|hay)/.test(s)) return null;
  if (/bài\s+(học|tập|giảng|kiểm tra|thi|đọc|viết|văn|toán|báo|thơ|này|kia|đó|ấy|trước|sau|số|\d)/.test(s)) return null;
  // Than chưa nghe THẤY nhạc ⇒ bật lại. Phải có "thấy" — "tao không nghe nhạc" là kể chuyện, không phải than.
  if (/(không|chưa|chả|chẳng)\s+nghe\s+thấy\s+(gì\s+)?(nhạc|bài)|nhạc đâu|bật nhạc chưa/.test(s)) return '';
  // Phủ định trước động từ ("đừng mở nhạc", "không muốn nghe nhạc") ⇒ không phải xin.
  if (/(không|chả|chẳng|đừng|khỏi|chưa)\s+(\S+\s+){0,2}(bật|mở|phát|nghe)\b/.test(s)) return null;
  // Động từ rồi NGAY SAU (≤ 4 chữ đệm) là nhạc/bài — "bật đèn lên với, bài này" không còn khớp.
  const m = s.match(/(?:^|[\s,.!?])(bật|mở|phát|play|cho\s+(?:tao|tôi|tui|mình|em|anh)?\s*nghe|muốn\s+nghe|^nghe)\s+((?:(?:cho|tao|tôi|tui|mình|em|anh|một|cái|vài|mấy|đi)\s+){0,4}(?:nhạc|bài hát|bài|bản nhạc|ca khúc|song|music|playlist)\b[^?.!]*)/);
  if (!m) return null;
  let q = m[2];
  // Lấy phần sau chữ "nhạc / bài" — đó là tên bài hoặc ca sĩ.
  q = q.replace(/^.*?(?:bản nhạc|bài hát|ca khúc|nhạc|bài|song|music|playlist)\s*/, '');
  q = q.replace(/^((gì|nào|đó|hay|nữa|của|cho|tao|tôi|tui|mình|nghe|đi|với|đây|kia|nhạc|bài|hát|một|bản)(\s+|$))+/, '');
  q = q.replace(/(\s+(đi|nhé|nha|ấy|đó|với|giùm|giúp|coi|xem|nào|chưa|đi mà|mày|nữa|được không|không|thử|đây|cái|đã))+\s*$/, '');
  q = q.replace(/^(đi|nhé|nha|ấy|chưa|nữa|đây|được không|không|với)$/, '').trim();
  // Lệnh nhanh sẵn có (âm lượng, phát lại, bài tiếp) ⇒ nhường phanXa.khopLenhNhanh.
  if (/^(nhỏ|to|lớn|bé)( lại| lên| hơn)?|^(lại|tiếp|tiếp theo|khác|sau)$/.test(q)) return null;
  return q.slice(0, 80);
}

/** Hiểu lời xin nhạc. THUẦN. */
export function hieuYeuCau(query: string): YeuCauNhac {
  let q = ` ${chuan(query)} `;
  const remix = /\s(remix|dj|vinahouse|edm|bay phong|nhac bay|nhac san|quay)\s/.test(q);
  let ngonNgu: YeuCauNhac['ngonNgu'] = null;
  if (/\s(tieng anh|au my|us uk|english|nhac anh|nhac my)\s/.test(q)) ngonNgu = 'en';
  else if (/\s(tieng trung|nhac trung|nhac hoa|tieng hoa|douyin|c pop|chinese)\s/.test(q)) ngonNgu = 'zh';
  else if (/\s(nhac viet|tieng viet|v pop|vpop)\s/.test(q)) ngonNgu = 'vi';
  q = q
    .replace(/\s(remix|dj|vinahouse|edm|bay phong|nhac bay|nhac san|quay)\s/g, ' ')
    .replace(/\s(tieng anh|au my|us uk|english|nhac anh|nhac my|tieng trung|nhac trung|nhac hoa|tieng hoa|douyin|c pop|chinese|nhac viet|tieng viet|v pop|vpop)\s/g, ' ');
  q = q.replace(CUM_DEM, ' ').replace(CUM_DEM, ' ');
  const tu = q.split(/\s+/).filter((w) => w && !DEM.has(w));
  const tuKhoa = tu.join(' ');
  return { kieu: !tuKhoa || BAT_KY.test(tuKhoa) ? 'bat-ky' : 'tim', tuKhoa: BAT_KY.test(tuKhoa) ? '' : tuKhoa, remix, ngonNgu };
}

export interface KetQuaCham { bai: BaiTrongKho; diem: number; theo: 'ten' | 'ca-si' }

/** Chấm một bài theo từ khoá (đã chuẩn hoá). 0 = không khớp. THUẦN. */
export function chamDiem(bai: BaiTrongKho, tuKhoa: string): KetQuaCham | null {
  if (!tuKhoa) return null;
  const ten = chuan(bai.title);
  const caSi = chuan(bai.artist);
  const k = ` ${tuKhoa} `;
  if (` ${ten} `.includes(k)) return { bai, diem: 100 - Math.min(20, ten.length - tuKhoa.length), theo: 'ten' };
  if (` ${caSi} `.includes(k)) return { bai, diem: 85, theo: 'ca-si' };
  // Khớp từng chữ: phần lớn chữ của lời xin phải có trong tên + ca sĩ (chữ ≥ 2 ký tự).
  const tk = tuKhoa.split(' ').filter((w) => w.length >= 2);
  if (!tk.length) return null;
  const co = new Set([...ten.split(' '), ...caSi.split(' ')]);
  const trung = tk.filter((w) => co.has(w)).length;
  const tiLe = trung / tk.length;
  if (tk.length === 1 ? tk[0].length >= 3 && trung === 1 : tiLe >= 0.6) {
    const trungCaSi = tk.filter((w) => caSi.split(' ').includes(w)).length;
    return { bai, diem: Math.round(40 + 40 * tiLe), theo: trungCaSi >= trung - trungCaSi ? 'ca-si' : 'ten' };
  }
  return null;
}

function tron<T>(a: T[], rnd: () => number): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const TRAN_HANG = 30;

/**
 * Dựng hàng đợi phát. THUẦN (rnd tiêm được cho test).
 *   bất kỳ   ⇒ trộn ngẫu nhiên trong đúng mục (remix / thường) + ngôn ngữ.
 *   ca sĩ    ⇒ toàn bộ bài của ca sĩ đó, trộn.
 *   tên bài  ⇒ bài đó trước, rồi bài khác cùng ca sĩ, rồi bài cùng ngôn ngữ.
 * Rỗng ⇒ không có trong thư viện (nơi gọi đi tìm YouTube).
 */
export function dungHangDoi(kho: BaiTrongKho[], yc: YeuCauNhac, rnd: () => number = Math.random): {
  hang: BaiTrongKho[];
  theo: 'bat-ky' | 'ten' | 'ca-si';
} {
  const dungMuc = (b: BaiTrongKho) => (yc.remix ? b.category === 'REMIX' : b.category !== 'REMIX');
  const dungTieng = (b: BaiTrongKho) => !yc.ngonNgu || b.language === yc.ngonNgu;

  if (yc.kieu === 'bat-ky') {
    let ds = kho.filter((b) => dungMuc(b) && dungTieng(b));
    if (!ds.length) ds = kho.filter(dungMuc);
    return { hang: tron(ds, rnd).slice(0, TRAN_HANG), theo: 'bat-ky' };
  }

  // Tìm cụ thể: KHÔNG lọc mục — "bật Sơn Tùng" phải ra cả bản remix nếu thư viện chỉ có bản đó.
  const xep = kho
    .map((b) => chamDiem(b, yc.tuKhoa))
    .filter((x): x is KetQuaCham => !!x)
    .sort((a, b) => b.diem - a.diem || Number(dungMuc(b.bai)) - Number(dungMuc(a.bai)));
  if (!xep.length) return { hang: [], theo: 'ten' };

  const dau = xep[0];
  if (dau.theo === 'ca-si') {
    const caSi = chuan(dau.bai.artist);
    const cung = xep.filter((x) => x.theo === 'ca-si' && chuan(x.bai.artist) === caSi).map((x) => x.bai);
    return { hang: tron(cung, rnd).slice(0, TRAN_HANG), theo: 'ca-si' };
  }
  const caSi = chuan(dau.bai.artist);
  const cungCaSi = tron(kho.filter((b) => b.id !== dau.bai.id && chuan(b.artist) === caSi), rnd);
  const cungTieng = tron(
    kho.filter((b) => b.id !== dau.bai.id && chuan(b.artist) !== caSi && dungMuc(b) && b.language === dau.bai.language),
    rnd,
  );
  return { hang: [dau.bai, ...cungCaSi, ...cungTieng].slice(0, TRAN_HANG), theo: 'ten' };
}
