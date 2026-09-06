/**
 * Đọc thời khoá biểu dán từ FAP (hoặc gõ tay) thành các dòng để xem trước.
 *
 * ─── Vì sao parser này KHÔNG cố đoán cho bằng được ───
 * Chép một cái bảng HTML ra chữ thuần là việc mất mát: `<br>` trong ô có thể
 * thành xuống dòng, và một ô xuống dòng là cả hàng vỡ cột. Không có cách nào
 * đọc đúng 100% mọi kiểu dán.
 *
 * Nên hợp đồng ở đây là: **đọc được gì trả nấy, đọc không ra thì NÓI RA**,
 * không bao giờ im lặng bỏ. Thứ không suy được thì để `weekday = 0` và màn
 * xem trước bắt người dùng chọn. Chữ trông như buổi học mà không moi được giờ
 * thì rơi vào `boQua` để hiện lên cho người ta thấy. Người dùng sửa trong
 * bảng xem trước rồi mới lưu, nên parser đoán hụt chỉ tốn vài giây, không mất
 * dữ liệu và không tạo ra lịch sai nằm im.
 */

export interface DongLich {
  subject: string;
  classCode: string;
  room: string;
  /** 2..8 (2 = thứ Hai, 8 = Chủ nhật). `0` = chưa rõ, người dùng phải chọn. */
  weekday: number;
  startTime: string;
  endTime: string;
  slot: number | null;
}

export interface KetQuaDoc {
  dong: DongLich[];
  /** Đoạn chữ trông như buổi học nhưng không moi được giờ — hiện cho người dùng. */
  boQua: string[];
}

/** Tên thứ → số 2..8. Nhận cả tiếng Anh của FAP lẫn tiếng Việt gõ tay. */
const TU_THU: Array<[RegExp, number]> = [
  [/\bmon(day)?\b/i, 2], [/\btue(s|sday)?\b/i, 3], [/\bwed(nesday)?\b/i, 4],
  [/\bthu(r|rs|rsday)?\b/i, 5], [/\bfri(day)?\b/i, 6], [/\bsat(urday)?\b/i, 7],
  [/\bsun(day)?\b/i, 8],
  [/th[ứu]\s*2|\bt2\b/i, 2], [/th[ứu]\s*3|\bt3\b/i, 3], [/th[ứu]\s*4|\bt4\b/i, 4],
  [/th[ứu]\s*5|\bt5\b/i, 5], [/th[ứu]\s*6|\bt6\b/i, 6], [/th[ứu]\s*7|\bt7\b/i, 7],
  [/ch[ủu]\s*nh[ậa]t|\bcn\b/i, 8],
];

/** Thứ đầu tiên tìm thấy trong một đoạn chữ, `0` nếu không có. */
function docThu(s: string): number {
  // Duyệt theo VỊ TRÍ chứ không theo thứ tự bảng: "Thứ 5" chứa "5" mà cũng
  // khớp /thu/ của tiếng Anh — cái nào đứng trước trong chuỗi thì thắng.
  let thu = 0;
  let som = Infinity;
  for (const [re, n] of TU_THU) {
    const m = re.exec(s);
    if (m && m.index < som) { som = m.index; thu = n; }
  }
  return thu;
}

/** `7:30` → `07:30`. Trả `''` nếu không phải giờ hợp lệ. */
function chuanGio(s: string): string {
  const m = /^(\d{1,2})\s*:\s*(\d{2})$/.exec(s.trim());
  if (!m) return '';
  const h = Number(m[1]);
  const p = Number(m[2]);
  if (h > 23 || p > 59) return '';
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

const RE_GIO = /(\d{1,2}\s*:\s*\d{2})\s*[-–—~]\s*(\d{1,2}\s*:\s*\d{2})/;
const RE_MA = /\b([A-Z]{2,4}\d{3}[A-Za-z]?)\b/;
const RE_PHONG = /(?:\bat\s+|\bph[òo]ng\s+|\br[òo]om\s+)([A-Za-z0-9][A-Za-z0-9.\-_]{1,19})/i;
const RE_SLOT = /\bslot\s*(\d{1,2})\b/i;

/**
 * Moi một buổi học ra khỏi một mẩu chữ. `null` khi không có giờ — không có
 * giờ thì không xếp được vào bảng, và đoán giờ là cách chắc chắn nhất để tạo
 * ra một cái lịch sai mà trông vẫn hợp lý.
 */
function docO(raw: string, thu: number, slot: number | null): DongLich | null {
  const s = raw.replace(/\s+/g, ' ').trim();
  if (!s) return null;
  const g = RE_GIO.exec(s);
  if (!g) return null;
  const batDau = chuanGio(g[1] ?? '');
  const ketThuc = chuanGio(g[2] ?? '');
  if (!batDau || !ketThuc || ketThuc <= batDau) return null;

  const ma = RE_MA.exec(s)?.[1] ?? '';
  const phong = RE_PHONG.exec(s)?.[1] ?? '';
  // Bỏ đuôi "-View Materials", "- Meet URL", "(Not yet)" mà FAP nhét vào ô.
  const ten = ma || s.replace(RE_GIO, '').replace(/[()]/g, '').trim().slice(0, 60);
  if (!ten) return null;

  return {
    subject: ten,
    classCode: '',
    room: phong,
    weekday: thu,
    startTime: batDau,
    endTime: ketThuc,
    slot,
  };
}

/** Chữ có vẻ là một buổi học (có mã môn) nhưng chưa chắc đọc được. */
function trongNhuBuoi(s: string): boolean {
  return RE_MA.test(s) || RE_GIO.test(s);
}

export function docLichFAP(vanBan: string): KetQuaDoc {
  const dong: DongLich[] = [];
  const boQua: string[] = [];
  const text = String(vanBan ?? '').replace(/\r\n?/g, '\n').replace(/ /g, ' ');
  const dongChu = text.split('\n');

  // ─── Có tab thì đây là bảng chép từ trình duyệt: cột = thứ ───
  // Hàng tiêu đề là hàng đầu tiên có từ hai tên thứ trở lên.
  let cotThu: number[] | null = null;
  let dongTieuDe = -1;
  for (let i = 0; i < dongChu.length; i++) {
    const o = (dongChu[i] ?? '').split('\t');
    if (o.length < 2) continue;
    const thu = o.map(docThu);
    if (thu.filter((t) => t > 0).length >= 2) { cotThu = thu; dongTieuDe = i; break; }
  }

  let thuHienTai = 0; // dùng cho kiểu dán theo dòng (mỗi thứ một đoạn)

  for (let i = 0; i < dongChu.length; i++) {
    if (i === dongTieuDe) continue;
    const d = dongChu[i] ?? '';
    if (!d.trim()) continue;
    const mSlot = RE_SLOT.exec(d);
    const slot = mSlot ? Number(mSlot[1]) : null;

    const o = d.split('\t');
    if (cotThu && o.length >= 2) {
      for (let c = 0; c < o.length; c++) {
        const thu = cotThu[c] ?? 0;
        const oC = o[c] ?? '';
        if (!oC.trim()) continue;
        // Ô ở cột không phải thứ (cột nhãn "Slot 1") thì bỏ, không báo thiếu.
        if (thu === 0) continue;
        const b = docO(oC, thu, slot);
        if (b) dong.push(b);
        else if (trongNhuBuoi(oC)) boQua.push(oC.replace(/\s+/g, ' ').trim());
      }
      continue;
    }

    // ─── Không tab: dòng chỉ có tên thứ thì nó là tiêu đề đoạn ───
    const chiCoThu = docThu(d) > 0 && !RE_GIO.test(d) && !RE_MA.test(d);
    if (chiCoThu) { thuHienTai = docThu(d); continue; }

    // Dòng tự nó mang tên thứ (kiểu "MON SWT301 DE-412 7:30-9:50") thì ưu
    // tiên thứ của chính nó; không có thì dùng thứ của đoạn đang đứng.
    const b = docO(d, docThu(d) || thuHienTai, slot);
    if (b) dong.push(b);
    else if (trongNhuBuoi(d)) boQua.push(d.replace(/\s+/g, ' ').trim());
  }

  // Trùng (cùng thứ + cùng giờ + cùng môn) thì giữ một — bảng FAP hay lặp ô.
  const thay = new Set<string>();
  const gon = dong.filter((b) => {
    const k = `${b.weekday}|${b.startTime}|${b.subject}`;
    if (thay.has(k)) return false;
    thay.add(k);
    return true;
  });

  gon.sort((a, b) => (a.weekday - b.weekday) || a.startTime.localeCompare(b.startTime));
  return { dong: gon, boQua };
}
