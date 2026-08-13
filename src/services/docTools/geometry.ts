/**
 * Dựng HÌNH PHẲNG từ MÔ TẢ CẤU TRÚC — không để model tự đặt toạ độ.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao phải có file này: bảo model "vẽ lại hình bằng SVG" thì nó đặt toạ độ
 * BẰNG MẮT. Đo 13-14/08/2026 trên đề Toán 7, lần nào cũng dính đủ ba lỗi:
 *
 *   • chấm điểm A, B KHÔNG nằm trên giao điểm (lệch 5-20px)
 *   • cung góc treo lơ lửng cạnh đỉnh, không bám hai tia
 *   • nhãn x, y, z, m, n đè lên nét
 *
 * Dặn dò kỹ hơn không chữa được: mỗi tấm ảnh mới là một lần đoán mới.
 *
 * Nên đổi vai: model chỉ mô tả CẤU TRÚC ("đường xy đi qua A và B", "B là giao
 * của xy và mn", "góc tại A giữa tia z và tia y bằng 124°"), còn file này
 * TÍNH:
 *
 *   • giao điểm = nghiệm hệ hai phương trình đường thẳng ⇒ chấm luôn đúng chỗ
 *   • cung góc dựng từ hướng THẬT của hai tia ⇒ không thể lệch
 *   • nhãn đặt lệch theo hướng tia rồi ĐẨY RA cho tới khi không chạm nét nào
 *
 * Phạm vi: đường thẳng / tia / đoạn / góc / điểm — tức hình phẳng THCS. KHÔNG
 * làm hình không gian, đường tròn, đồ thị (những thứ đó cắt từ ảnh gốc).
 */

export interface DiemVao {
  ten: string;
  /** Vị trí GỢI Ý, chuẩn hoá 0..1. Chỉ dùng để bố cục; nếu điểm nằm trên ≥2
   *  đường thì toạ độ thật được TÍNH lại bằng giao điểm. */
  x: number;
  y: number;
}

export interface DuongVao {
  /** Tên các điểm mà đường đi qua (1 hoặc 2 điểm). */
  qua: string[];
  /** Khi chỉ có 1 điểm: hướng của đường, tính bằng độ (0 = sang phải, ngược chiều kim đồng hồ). */
  huongDo?: number;
  /** Nhãn ở hai đầu, ví dụ x ở đầu trái và y ở đầu phải. */
  nhanDau?: string;
  nhanCuoi?: string;
}

export interface GocVao {
  /** Tên điểm làm đỉnh. */
  dinh: string;
  /** Hai nhãn đầu tia tạo thành góc (phải là `nhanDau`/`nhanCuoi` của các đường qua đỉnh). */
  tia: [string, string];
  /** Số đo ghi trên hình. Bỏ trống thì chỉ vẽ cung, không ghi số. */
  do?: number;
  /** Vẽ hai vạch trên cung (ký hiệu góc bằng nhau). */
  vachKep?: boolean;
}

export interface HinhVao {
  diem: DiemVao[];
  duong: DuongVao[];
  goc?: GocVao[];
  rong?: number;
  cao?: number;
}

interface Vec { x: number; y: number }
interface DuongTinh {
  p: Vec;          // một điểm trên đường
  u: Vec;          // vector chỉ phương (đã chuẩn hoá)
  nhanDau?: string;
  nhanCuoi?: string;
  dau: Vec;        // đầu đoạn vẽ (phía nhãn "đầu")
  cuoi: Vec;       // đầu kia
  qua: string[];
}

const LE = 46;          // chừa quanh khung cho nhãn
const BAN_KINH_CUNG = 30;

const tru = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const cong = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const nhan = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
const doDai = (a: Vec): number => Math.hypot(a.x, a.y);
const chuanHoa = (a: Vec): Vec => {
  const d = doDai(a) || 1;
  return { x: a.x / d, y: a.y / d };
};

/** Giao điểm hai đường thẳng (dạng điểm + chỉ phương). null khi song song. */
function giaoDiem(a: DuongTinh, b: DuongTinh): Vec | null {
  const det = a.u.x * -b.u.y - a.u.y * -b.u.x;
  if (Math.abs(det) < 1e-9) return null;
  const r = tru(b.p, a.p);
  const t = (r.x * -b.u.y - r.y * -b.u.x) / det;
  return cong(a.p, nhan(a.u, t));
}

/** Cắt đường vô hạn cho vừa khung vẽ. */
function catTheoKhung(p: Vec, u: Vec, W: number, H: number): [Vec, Vec] {
  const ts: number[] = [];
  const canh: Array<[number, number, number]> = [
    [1, 0, LE], [1, 0, W - LE], [0, 1, LE], [0, 1, H - LE],
  ];
  for (const [nx, ny, c] of canh) {
    const mau = nx * u.x + ny * u.y;
    if (Math.abs(mau) < 1e-9) continue;
    ts.push((c - (nx * p.x + ny * p.y)) / mau);
  }
  ts.sort((a, b) => a - b);
  // Lấy hai giao nằm trong khung
  const trong = ts
    .map((t) => cong(p, nhan(u, t)))
    .filter((q) => q.x >= LE - 1 && q.x <= W - LE + 1 && q.y >= LE - 1 && q.y <= H - LE + 1);
  if (trong.length >= 2) return [trong[0], trong[trong.length - 1]];
  return [cong(p, nhan(u, -400)), cong(p, nhan(u, 400))];
}

/** Khoảng cách từ điểm tới đoạn thẳng — dùng để biết nhãn có chạm nét không. */
function khoangCachToiDoan(q: Vec, a: Vec, b: Vec): number {
  const ab = tru(b, a);
  const t = Math.max(0, Math.min(1, ((q.x - a.x) * ab.x + (q.y - a.y) * ab.y) / (ab.x * ab.x + ab.y * ab.y || 1)));
  return doDai(tru(q, cong(a, nhan(ab, t))));
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Cấu trúc → SVG.
 *
 * Ném lỗi khi mô tả không dựng nổi (thiếu điểm, đường không xác định) — người
 * gọi rơi về cách khác chứ KHÔNG vẽ đại một hình sai.
 */
export function dungHinh(vao: HinhVao): string {
  const W = vao.rong ?? 560;
  const H = vao.cao ?? 380;

  // ── 1. Toạ độ gợi ý của các điểm ─────────────────────────────────────
  const toaDo = new Map<string, Vec>();
  for (const d of vao.diem) {
    if (!Number.isFinite(d.x) || !Number.isFinite(d.y)) throw new Error(`điểm ${d.ten} thiếu toạ độ`);
    toaDo.set(d.ten, { x: LE + d.x * (W - 2 * LE), y: LE + d.y * (H - 2 * LE) });
  }

  // ── 2. Dựng đường ────────────────────────────────────────────────────
  const duongs: DuongTinh[] = [];
  for (const dv of vao.duong) {
    const ten = dv.qua ?? [];
    let p: Vec | undefined;
    let u: Vec | undefined;
    if (ten.length >= 2) {
      const a = toaDo.get(ten[0]);
      const b = toaDo.get(ten[1]);
      if (!a || !b) throw new Error(`đường qua ${ten.join(',')} có điểm chưa khai báo`);
      p = a;
      u = chuanHoa(tru(b, a));
    } else if (ten.length === 1 && Number.isFinite(dv.huongDo)) {
      const a = toaDo.get(ten[0]);
      if (!a) throw new Error(`đường qua ${ten[0]} chưa khai báo điểm`);
      const rad = ((dv.huongDo as number) * Math.PI) / 180;
      p = a;
      // y ngược chiều vì trục y của SVG hướng xuống
      u = { x: Math.cos(rad), y: -Math.sin(rad) };
    } else {
      throw new Error('đường thiếu dữ liệu (cần 2 điểm, hoặc 1 điểm + hướng)');
    }
    const [dau, cuoi] = catTheoKhung(p, u, W, H);
    duongs.push({ p, u, dau, cuoi, nhanDau: dv.nhanDau, nhanCuoi: dv.nhanCuoi, qua: ten });
  }

  // ── 3. TÍNH LẠI điểm nằm trên ≥2 đường = giao điểm thật ───────────────
  // Đây là chỗ chữa lỗi "chấm A, B lệch khỏi giao điểm".
  for (const [ten, cu] of toaDo) {
    const qua = duongs.filter((d) => d.qua.includes(ten));
    if (qua.length < 2) continue;
    const g = giaoDiem(qua[0], qua[1]);
    if (g && Number.isFinite(g.x) && Number.isFinite(g.y) && doDai(tru(g, cu)) < Math.max(W, H)) {
      toaDo.set(ten, g);
    }
  }

  // ── 4. Vẽ ────────────────────────────────────────────────────────────
  const doan: Array<[Vec, Vec]> = duongs.map((d) => [d.dau, d.cuoi]);
  const nhanDaDat: Array<{ q: Vec; r: number }> = [];
  const ra: string[] = [];

  for (const d of duongs) {
    ra.push(`<path d="M ${d.dau.x.toFixed(1)} ${d.dau.y.toFixed(1)} L ${d.cuoi.x.toFixed(1)} ${d.cuoi.y.toFixed(1)}" stroke="#000" stroke-width="1.6" fill="none"/>`);
  }

  /** Đặt nhãn: lệch theo hướng cho trước, ĐẨY RA cho tới khi không chạm nét
   *  nào và không đè nhãn khác. Đây là chỗ chữa lỗi "nhãn trùng đường kẻ". */
  const datNhan = (goc: Vec, huong: Vec, chu: string, nghieng = true): void => {
    const h = chuanHoa(huong);
    const vuongGoc: Vec = { x: -h.y, y: h.x };
    const rongChu = chu.length * 8 + 6;
    for (let buoc = 0; buoc < 14; buoc++) {
      for (const ben of [0, 1, -1]) {
        const q = cong(goc, cong(nhan(h, 14 + buoc * 7), nhan(vuongGoc, ben * (10 + buoc * 3))));
        if (q.x < 8 || q.y < 12 || q.x > W - 8 || q.y > H - 6) continue;
        const cham = doan.some(([a, b]) => khoangCachToiDoan(q, a, b) < Math.max(11, rongChu * 0.32));
        const deNhan = nhanDaDat.some((n) => doDai(tru(n.q, q)) < n.r + rongChu * 0.5 + 6);
        if (!cham && !deNhan) {
          nhanDaDat.push({ q, r: rongChu * 0.5 });
          ra.push(`<text x="${q.x.toFixed(1)}" y="${q.y.toFixed(1)}" font-family="Times New Roman, serif" font-size="17"${nghieng ? ' font-style="italic"' : ''} text-anchor="middle" dominant-baseline="middle">${esc(chu)}</text>`);
          return;
        }
      }
    }
    // Hết chỗ: vẫn phải hiện, đặt xa nhất có thể còn hơn giấu mất nhãn.
    const q = cong(goc, nhan(h, 26));
    ra.push(`<text x="${q.x.toFixed(1)}" y="${q.y.toFixed(1)}" font-family="Times New Roman, serif" font-size="17" text-anchor="middle" dominant-baseline="middle">${esc(chu)}</text>`);
  };

  // Nhãn hai đầu đường, đẩy RA NGOÀI theo chiều của đường
  for (const d of duongs) {
    if (d.nhanDau) datNhan(d.dau, tru(d.dau, d.cuoi), d.nhanDau);
    if (d.nhanCuoi) datNhan(d.cuoi, tru(d.cuoi, d.dau), d.nhanCuoi);
  }

  // ── 5. Cung góc — dựng từ hướng THẬT của hai tia ──────────────────────
  // Ghi lại hướng phân giác của từng góc: tên điểm không được rơi vào đó,
  // nếu không nó nằm LỌT TRONG cung, trông như nhãn của góc chứ không phải
  // tên đỉnh.
  const huongCam = new Map<string, Vec[]>();
  for (const g of vao.goc ?? []) {
    const dinh = toaDo.get(g.dinh);
    if (!dinh) continue;
    const huong = (nhanTia: string): Vec | null => {
      for (const d of duongs) {
        if (d.nhanDau === nhanTia) return chuanHoa(tru(d.dau, dinh));
        if (d.nhanCuoi === nhanTia) return chuanHoa(tru(d.cuoi, dinh));
      }
      return null;
    };
    const u1 = huong(g.tia[0]);
    const u2 = huong(g.tia[1]);
    if (!u1 || !u2) continue;

    const a1 = Math.atan2(u1.y, u1.x);
    const a2 = Math.atan2(u2.y, u2.x);
    let delta = a2 - a1;
    while (delta <= -Math.PI) delta += 2 * Math.PI;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    const lonHon180 = (g.do ?? 0) > 180;
    const quetNguoc = lonHon180 ? delta < 0 : delta > 0;
    const cuoiGoc = quetNguoc ? a1 + Math.abs(delta) : a1 - Math.abs(delta);

    const P1 = cong(dinh, nhan({ x: Math.cos(a1), y: Math.sin(a1) }, BAN_KINH_CUNG));
    const P2 = cong(dinh, nhan({ x: Math.cos(cuoiGoc), y: Math.sin(cuoiGoc) }, BAN_KINH_CUNG));
    const lonCung = Math.abs(delta) > Math.PI ? 1 : 0;
    const chieu = quetNguoc ? 1 : 0;
    ra.push(`<path d="M ${P1.x.toFixed(1)} ${P1.y.toFixed(1)} A ${BAN_KINH_CUNG} ${BAN_KINH_CUNG} 0 ${lonCung} ${chieu} ${P2.x.toFixed(1)} ${P2.y.toFixed(1)}" stroke="#000" stroke-width="1.3" fill="none"/>`);

    const giua = (a1 + cuoiGoc) / 2;
    const dsCam = huongCam.get(g.dinh) ?? [];
    dsCam.push({ x: Math.cos(giua), y: Math.sin(giua) });
    huongCam.set(g.dinh, dsCam);

    if (g.vachKep) {
      const v = { x: Math.cos(giua), y: Math.sin(giua) };
      const vg = { x: -v.y, y: v.x };
      for (const lech of [-3, 3]) {
        const t = cong(dinh, cong(nhan(v, BAN_KINH_CUNG), nhan(vg, lech)));
        const t2 = cong(dinh, cong(nhan(v, BAN_KINH_CUNG + 7), nhan(vg, lech)));
        ra.push(`<path d="M ${t.x.toFixed(1)} ${t.y.toFixed(1)} L ${t2.x.toFixed(1)} ${t2.y.toFixed(1)}" stroke="#000" stroke-width="1.2"/>`);
      }
    }
    if (Number.isFinite(g.do)) {
      datNhan(cong(dinh, nhan({ x: Math.cos(giua), y: Math.sin(giua) }, BAN_KINH_CUNG + 4)),
        { x: Math.cos(giua), y: Math.sin(giua) }, `${g.do}°`, false);
    }
  }

  // ── 6. Chấm điểm + tên điểm (vẽ SAU cùng để nằm trên nét) ─────────────
  for (const [ten, q] of toaDo) {
    ra.push(`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="2.6" fill="#000"/>`);
    // Tên điểm đẩy về phía THOÁNG nhất: thử 16 hướng, chọn hướng xa nét nhất,
    // và LOẠI những hướng chĩa vào lòng cung góc (nếu không, tên đỉnh nằm lọt
    // trong cung, đọc ra thành nhãn của góc).
    const cam = huongCam.get(ten) ?? [];
    let totNhat: Vec = { x: 0, y: -1 };
    let xaNhat = -1;
    for (let k = 0; k < 16; k++) {
      const a = (k * Math.PI) / 8;
      const h: Vec = { x: Math.cos(a), y: Math.sin(a) };
      // cos(60°) = 0.5 → bỏ mọi hướng lệch dưới 60° so với phân giác của góc
      if (cam.some((c) => c.x * h.x + c.y * h.y > 0.5)) continue;
      const thu = cong(q, nhan(h, 20));
      const xa = Math.min(...doan.map(([s, e]) => khoangCachToiDoan(thu, s, e)));
      if (xa > xaNhat) { xaNhat = xa; totNhat = h; }
    }
    datNhan(q, totNhat, ten, false);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${ra.join('')}</svg>`;
}

/** Kiểm nhanh một mô tả có dựng được không (dùng trước khi tin model). */
export function kiemMoTa(vao: unknown): vao is HinhVao {
  const v = vao as HinhVao;
  return !!v && Array.isArray(v.diem) && Array.isArray(v.duong) && v.diem.length > 0 && v.duong.length > 0;
}
