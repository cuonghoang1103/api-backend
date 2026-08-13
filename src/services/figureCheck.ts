/**
 * Kiểm hình vẽ SVG bằng SỐ, trước khi người học nhìn thấy nó.
 *
 * VÌ SAO KHÔNG "render ra ảnh rồi cho model nhìn": model nhìn ảnh để đọc nội
 * dung thì được, nhưng để phán "điểm E có nằm đúng trên đường tròn không" thì
 * mắt thua phép tính — sai lệch vài pixel là thứ nhìn không ra mà tính thì ra
 * ngay. Đo 13/08/2026: hàm này bắt đúng 21/21 ràng buộc của một bài tiếp tuyến
 * tới sai lệch 0.00, trong vài mili giây và không tốn token nào. Một lượt nhìn
 * ảnh tốn ~4s và một khoản token, mà vẫn không chắc.
 *
 * Hai tầng kiểm:
 *
 *  1. TỰ THÂN — không cần biết đề bài: khung có chứa trọn hình không, nhãn có
 *     đè nhau không, hai điểm khác tên có trùng chỗ không. Đây là ba lỗi đã
 *     gặp thật trên production.
 *  2. THEO ĐỀ — model tự khai các ràng buộc nó tin là đúng (khối ```check),
 *     ta kiểm lại bằng toạ độ đọc từ chính hình nó vẽ. Model khai sai cú pháp
 *     thì bỏ qua dòng đó, không làm hỏng câu trả lời.
 *
 * Trả về danh sách lỗi bằng SỐ CỤ THỂ để lượt sửa biết phải sửa cái gì —
 * "hình sai" thì model chữa mò, "E lệch khỏi đường tròn 23.4 đơn vị" thì nó
 * biết tính lại chỗ nào.
 */

export interface Diem { x: number; y: number }
export interface DuongTron extends Diem { r: number }

export interface KetQuaKiemHinh {
  /** Rỗng = hình đạt. */
  loi: string[];
  /** Điểm đọc được, để log lúc cần soi. */
  diem: Record<string, Diem>;
}

const khoangCach = (a: Diem, b: Diem): number => Math.hypot(a.x - b.x, a.y - b.y);
const tichVoHuong = (a: Diem, b: Diem, c: Diem, d: Diem): number =>
  (b.x - a.x) * (d.x - c.x) + (b.y - a.y) * (d.y - c.y);
const tichCoHuong = (a: Diem, b: Diem, c: Diem): number =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

/** Số trong thuộc tính SVG có thể là `12`, `-3.5`, `1e2`. */
const SO = '-?\\d+(?:\\.\\d+)?(?:e-?\\d+)?';

function thuocTinhSo(the: string, ten: string): number | null {
  const m = new RegExp(`${ten}="(${SO})"`).exec(the);
  return m ? Number(m[1]) : null;
}

/** Mọi cặp toạ độ xuất hiện trong `d="..."` của <path>. */
function toaDoTrongPath(svg: string): Diem[] {
  const ra: Diem[] = [];
  for (const m of svg.matchAll(/\sd="([^"]+)"/g)) {
    const so = m[1].match(new RegExp(SO, 'g')) ?? [];
    for (let i = 0; i + 1 < so.length; i += 2) ra.push({ x: Number(so[i]), y: Number(so[i + 1]) });
  }
  return ra;
}

/**
 * Đọc hình: đường tròn lớn, chấm điểm (đường tròn bán kính nhỏ), nhãn chữ.
 *
 * Ghép nhãn với chấm GẦN NHẤT trong bán kính 30 đơn vị — luật bảo đặt nhãn
 * lệch khỏi nét vẽ 8–14 đơn vị, nên nhãn không bao giờ nằm đúng trên chấm.
 */
export function docHinh(svg: string): {
  diem: Record<string, Diem>;
  duongTron: DuongTron[];
  nhan: Array<Diem & { ten: string }>;
  viewBox: [number, number, number, number] | null;
} {
  const tatCaTron: DuongTron[] = [];
  for (const m of svg.matchAll(/<circle\b[^>]*>/g)) {
    const the = m[0];
    const x = thuocTinhSo(the, 'cx');
    const y = thuocTinhSo(the, 'cy');
    const r = thuocTinhSo(the, 'r');
    if (x !== null && y !== null && r !== null) tatCaTron.push({ x, y, r });
  }
  // Chấm đánh dấu điểm vẽ nhỏ (luật không ép cỡ, thực tế model dùng 2–4).
  const cham = tatCaTron.filter((c) => c.r <= 5);
  const duongTron = tatCaTron.filter((c) => c.r > 5);

  const nhan: Array<Diem & { ten: string }> = [];
  for (const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const x = thuocTinhSo(m[1], 'x');
    const y = thuocTinhSo(m[1], 'y');
    // Chỉ lấy nhãn ĐỈNH: một chữ in hoa, có thể kèm chỉ số (A, B, M₁, O').
    const ten = m[2].replace(/<[^>]*>/g, '').trim();
    if (x !== null && y !== null && /^[A-Z][\d'′₀-₉]?$/.test(ten)) nhan.push({ x, y, ten });
  }

  const diem: Record<string, Diem> = {};
  for (const n of nhan) {
    let gan: Diem | null = null;
    let d = Infinity;
    for (const c of cham) {
      const k = khoangCach(n, c);
      if (k < d) { d = k; gan = c; }
    }
    if (gan && d <= 30) diem[n.ten] = { x: gan.x, y: gan.y };
  }

  const vb = /viewBox="([^"]+)"/.exec(svg);
  const so = vb ? vb[1].trim().split(/[\s,]+/).map(Number) : null;
  const viewBox = so && so.length === 4 && so.every(Number.isFinite)
    ? ([so[0], so[1], so[2], so[3]] as [number, number, number, number])
    : null;

  return { diem, duongTron, nhan, viewBox };
}

/**
 * Khối ràng buộc model tự khai, đặt ngay sau hình:
 *
 *     ```check
 *     on-circle B O      → B nằm trên đường tròn tâm O
 *     perp O B B A       → OB ⊥ BA
 *     collinear B H C    → B, H, C thẳng hàng
 *     midpoint H B C     → H là trung điểm BC
 *     eq-dist O B O C    → OB = OC
 *     ```
 *
 * Dòng nào sai cú pháp hoặc nhắc điểm không có trong hình thì BỎ QUA, không
 * tính là lỗi hình: một dòng khai hỏng không đáng để bắt vẽ lại cả hình.
 */
export function kiemRangBuoc(
  dong: string[],
  diem: Record<string, Diem>,
  duongTron: DuongTron[],
): string[] {
  const loi: string[] = [];
  // Dung sai theo KÍCH THƯỚC hình: hình vẽ trong khung 400 thì 2 đơn vị là
  // sai thật; đặt ngưỡng tuyệt đối sẽ hoặc quá chặt với hình nhỏ hoặc quá
  // lỏng với hình lớn.
  const coHinh = duongTron.length ? Math.max(...duongTron.map((c) => c.r)) : 100;
  const nguong = Math.max(1.5, coHinh * 0.02);

  for (const raw of dong) {
    const t = raw.trim().split(/\s+/);
    if (t.length < 3) continue;
    const [lenh, ...ten] = t;
    const P = ten.map((n) => diem[n]);
    if (P.some((p) => !p)) continue; // nhắc điểm không có trong hình → bỏ qua

    switch (lenh) {
      case 'on-circle': {
        const tam = duongTron.find((c) => diem[ten[1]] && khoangCach(c, diem[ten[1]]) < nguong * 2);
        if (!tam) continue;
        const lech = khoangCach(P[0], tam) - tam.r;
        if (Math.abs(lech) > nguong) loi.push(`${ten[0]} phải nằm trên đường tròn tâm ${ten[1]} nhưng lệch ${lech.toFixed(1)} đơn vị (bán kính ${tam.r}).`);
        break;
      }
      case 'perp': {
        if (P.length < 4) continue;
        const tvh = tichVoHuong(P[0], P[1], P[2], P[3]);
        const chuan = khoangCach(P[0], P[1]) * khoangCach(P[2], P[3]);
        if (chuan > 0 && Math.abs(tvh) / chuan > 0.04) {
          const goc = (Math.acos(Math.max(-1, Math.min(1, tvh / chuan))) * 180) / Math.PI;
          loi.push(`${ten[0]}${ten[1]} phải vuông góc ${ten[2]}${ten[3]} nhưng góc giữa chúng là ${goc.toFixed(1)}°.`);
        }
        break;
      }
      case 'collinear': {
        if (P.length < 3) continue;
        const dt = Math.abs(tichCoHuong(P[0], P[1], P[2]));
        const day = Math.max(khoangCach(P[0], P[1]), khoangCach(P[1], P[2]), 1);
        if (dt / day > nguong) loi.push(`${ten.join(', ')} phải thẳng hàng nhưng ${ten[1]} cách đường ${ten[0]}${ten[2]} tới ${(dt / day).toFixed(1)} đơn vị.`);
        break;
      }
      case 'midpoint': {
        if (P.length < 3) continue;
        const giua = { x: (P[1].x + P[2].x) / 2, y: (P[1].y + P[2].y) / 2 };
        const lech = khoangCach(P[0], giua);
        if (lech > nguong) loi.push(`${ten[0]} phải là trung điểm ${ten[1]}${ten[2]} nhưng lệch ${lech.toFixed(1)} đơn vị.`);
        break;
      }
      case 'eq-dist': {
        if (P.length < 4) continue;
        const a = khoangCach(P[0], P[1]);
        const b = khoangCach(P[2], P[3]);
        if (Math.abs(a - b) > nguong) loi.push(`${ten[0]}${ten[1]} phải bằng ${ten[2]}${ten[3]} nhưng ${a.toFixed(1)} ≠ ${b.toFixed(1)}.`);
        break;
      }
      default:
        break;
    }
  }
  return loi;
}

/**
 * Kiểm một hình. `tenDiemTrongLoiGiai` là các đỉnh mà phần lời giải đi kèm có
 * nhắc tới — hình thiếu điểm mà chứng minh dùng thì người học không lần theo
 * được, đây là lỗi đã gặp thật.
 */
export function kiemHinh(
  svg: string,
  tenDiemTrongLoiGiai: string[] = [],
  dongRangBuoc: string[] = [],
): KetQuaKiemHinh {
  const loi: string[] = [];
  const { diem, duongTron, nhan, viewBox } = docHinh(svg);

  // ── 1. Khung có chứa trọn hình không ─────────────────────────────
  if (!viewBox) {
    loi.push('Thẻ <svg> thiếu viewBox — bộ lọc an toàn sẽ chặn và hình không hiện ra.');
  } else {
    const [vx, vy, vw, vh] = viewBox;
    const moi: Diem[] = [
      ...toaDoTrongPath(svg),
      ...nhan,
      ...Object.values(diem),
    ];
    for (const the of svg.matchAll(/<(line|rect)\b[^>]*>/g)) {
      for (const a of ['x1', 'x2', 'x', 'cx']) {
        const x = thuocTinhSo(the[0], a);
        const y = thuocTinhSo(the[0], a.replace('x', 'y'));
        if (x !== null && y !== null) moi.push({ x, y });
      }
    }
    // Đường tròn phải lọt cả VÀNH, không chỉ tâm — đây chính là lỗi khung nhỏ
    // hơn hình làm đường tròn bị cắt cụt ở mép.
    for (const c of duongTron) {
      moi.push({ x: c.x - c.r, y: c.y - c.r }, { x: c.x + c.r, y: c.y + c.r });
    }
    const le = 1;
    const tran = moi.filter(
      (p) => p.x < vx - le || p.x > vx + vw + le || p.y < vy - le || p.y > vy + vh + le,
    );
    if (tran.length) {
      const minX = Math.min(...moi.map((p) => p.x));
      const maxX = Math.max(...moi.map((p) => p.x));
      const minY = Math.min(...moi.map((p) => p.y));
      const maxY = Math.max(...moi.map((p) => p.y));
      loi.push(
        `viewBox "${viewBox.join(' ')}" không chứa hết hình (${tran.length} chỗ tràn ra ngoài). `
        + `Hình thật trải từ (${minX.toFixed(0)}, ${minY.toFixed(0)}) tới (${maxX.toFixed(0)}, ${maxY.toFixed(0)}) — `
        + `đặt viewBox "${(minX - 20).toFixed(0)} ${(minY - 20).toFixed(0)} ${(maxX - minX + 40).toFixed(0)} ${(maxY - minY + 40).toFixed(0)}".`,
      );
    }
  }

  // ── 2. Hình có đủ điểm lời giải nhắc tới không ────────────────────
  const thieu = tenDiemTrongLoiGiai.filter((t) => !(t in diem) && !nhan.some((n) => n.ten === t));
  if (thieu.length) {
    loi.push(`Lời giải có nhắc tới ${thieu.join(', ')} nhưng hình không có điểm nào tên như vậy — vẽ bổ sung.`);
  }

  // ── 3. Nhãn đè nhau ──────────────────────────────────────────────
  for (let i = 0; i < nhan.length; i++) {
    for (let j = i + 1; j < nhan.length; j++) {
      const k = khoangCach(nhan[i], nhan[j]);
      if (k < 14) loi.push(`Nhãn ${nhan[i].ten} và ${nhan[j].ten} chỉ cách nhau ${k.toFixed(0)} đơn vị (cần ≥ 14) — chữ sẽ đè lên nhau, đẩy ra hai phía đối nhau.`);
    }
  }

  // ── 4. Hai đỉnh khác tên mà trùng chỗ ────────────────────────────
  const ten = Object.keys(diem);
  for (let i = 0; i < ten.length; i++) {
    for (let j = i + 1; j < ten.length; j++) {
      if (khoangCach(diem[ten[i]], diem[ten[j]]) < 3) {
        loi.push(`${ten[i]} và ${ten[j]} được vẽ trùng chỗ — gần như chắc chắn tính sai toạ độ một trong hai.`);
      }
    }
  }

  // ── 5. Ràng buộc model tự khai ───────────────────────────────────
  loi.push(...kiemRangBuoc(dongRangBuoc, diem, duongTron));

  return { loi, diem };
}

/** Một hình tìm được trong câu trả lời, kèm chỗ của nó để còn thay lại. */
export interface HinhTrongCauTraLoi {
  /** Thứ tự hình trong câu trả lời, từ 0. */
  thuTu: number;
  svg: string;
  /** Các đỉnh mà đoạn lời giải quanh hình có nhắc tới. */
  diemTrongLoiGiai: string[];
  /** Dòng trong khối ```check ngay sau hình (nếu có). */
  rangBuoc: string[];
}

/**
 * Tách các hình khỏi câu trả lời, kèm ngữ cảnh của từng hình.
 *
 * "Ngữ cảnh" = đoạn văn từ tiêu đề gần nhất phía trên tới hình kế tiếp. Luật
 * đã bảo mỗi câu một hình, nên đoạn đó chính là lời giải của câu ấy.
 */
export function tachHinh(cauTraLoi: string): HinhTrongCauTraLoi[] {
  const ra: HinhTrongCauTraLoi[] = [];
  const re = /```svg\s*\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  let thuTu = 0;
  let dauDoan = 0;

  while ((m = re.exec(cauTraLoi)) !== null) {
    const svg = m[1].trim();
    const truoc = cauTraLoi.slice(dauDoan, m.index);
    // Lùi về tiêu đề gần nhất để không gom lời giải của câu trước.
    const tieuDe = truoc.lastIndexOf('\n#');
    const doan = tieuDe >= 0 ? truoc.slice(tieuDe) : truoc;

    // Đỉnh được nhắc tới.
    //
    // Chỉ nhặt chữ hoa nằm trong CỤM (`AB`, `OH`, `AEH`, `OHED`) hoặc đi ngay
    // sau chữ "điểm". Chữ hoa đứng MỘT MÌNH thường là ký hiệu chứ không phải
    // tên đỉnh — `R` bán kính, `S` diện tích, `V` thể tích. Bản đầu đếm cả
    // chữ đứng một mình và đã báo nhầm "lời giải nhắc tới R nhưng hình không
    // có điểm R" trên một lời giải hoàn toàn đúng.
    const dem = new Map<string, number>();
    for (const g of doan.matchAll(/(?<![A-Za-z])([A-Z]{2,4})(?![A-Za-z])/g)) {
      for (const ch of g[1]) dem.set(ch, (dem.get(ch) ?? 0) + 1);
    }
    for (const g of doan.matchAll(/điểm\s+\$?\\?[a-z]*\{?([A-Z])/g)) {
      dem.set(g[1], (dem.get(g[1]) ?? 0) + 2);
    }
    const diemTrongLoiGiai = [...dem.entries()]
      // Nhắc ≥ 2 lần mới coi là đỉnh — một lần có thể là chữ lạc trong câu văn.
      .filter(([, n]) => n >= 2)
      .map(([t]) => t);

    // Khối ```check ngay sau hình (cho phép vài dòng trống xen giữa).
    const sau = cauTraLoi.slice(re.lastIndex, re.lastIndex + 900);
    const kh = /^\s*```check\s*\n([\s\S]*?)```/.exec(sau);
    const rangBuoc = kh ? kh[1].split('\n').map((s) => s.trim()).filter(Boolean) : [];

    ra.push({ thuTu, svg, diemTrongLoiGiai, rangBuoc });
    thuTu++;
    dauDoan = re.lastIndex;
  }
  return ra;
}

/** Thay hình thứ `thuTu` (từ 0) bằng SVG mới, giữ nguyên phần còn lại. */
export function thayHinh(cauTraLoi: string, thuTu: number, svgMoi: string): string {
  let dem = 0;
  return cauTraLoi.replace(/```svg\s*\n[\s\S]*?```/g, (khoi) => {
    const giu = dem === thuTu;
    dem++;
    return giu ? '```svg\n' + svgMoi.trim() + '\n```' : khoi;
  });
}

/** Gỡ khối ```check khỏi câu trả lời — nó là dữ liệu cho máy, không phải cho người đọc. */
export function goKhoiCheck(cauTraLoi: string): string {
  return cauTraLoi.replace(/\n*```check\s*\n[\s\S]*?```/g, '');
}
