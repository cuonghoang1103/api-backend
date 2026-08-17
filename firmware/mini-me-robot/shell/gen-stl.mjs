#!/usr/bin/env node
/**
 * ============================================================
 * Mini-Me Robot — sinh file STL cho 9 mảnh vỏ
 * ============================================================
 *
 * Dựng bằng các khối nguyên thuỷ (hộp, ống, tấm-có-lỗ) rồi ghép
 * chồng mép nhau. KHÔNG cần phép trừ hình học (CSG): mọi slicer
 * (Cura, PrusaSlicer, Bambu) đều tự hợp nhất các khối chồng nhau
 * trong cùng một file STL. Chỉ riêng LỖ là không hợp nhất được, nên
 * lỗ được dựng trực tiếp bằng hàm `plateWithHoles`.
 *
 * Mọi kích thước tính bằng milimét, khớp với dữ liệu `enclosure`
 * trong prisma/seed.maker-lab.ts. Đổi số ở phần THAM SỐ bên dưới là
 * ra bộ vỏ mới.
 *
 * Chạy: node gen-stl.mjs [thư-mục-xuất]
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// ════════════════════════════════════════════════════════════
// THAM SỐ — đo lại linh kiện thật rồi chỉnh ở đây
// ════════════════════════════════════════════════════════════
const P = {
  wall: 2.4, // độ dày thành (6 đường in với đầu phun 0,4)

  // ── THÂN ─────────────────────────────────────────────
  // ⚠️ To hơn hẳn bản 07/08 (106×80×130). Ba số đo thật ngày 16/08
  // ép phải nới ra, và cái LOA là thủ phạm chính:
  //
  //   loa   ⌀65 × 30 dày   ← bản cũ tính cho ⌀40
  //   pin   92 × 43 × 22 nằm ngang
  //   ngực  màn 3.5" 100 × 55, viền 6 mm nên vùng sáng 88 × 43
  //
  // Mặt trước phải xếp được màn ngực (55) CHỒNG LÊN loa (65) = 120 mm,
  // nên thân cao 130. Chiều sâu: loa 30 + pin 43 + mạch 30 ≈ 103 → 120.
  bodyW: 150, // ngang bằng bề ngang khung TP101 (163) trừ khe hai bên
  bodyH: 130,
  bodyD: 120,

  // ── ĐẦU ──────────────────────────────────────────────
  headW: 130, // đủ cho hai ống ⌀54 cách tâm 62
  headH: 60,
  headD: 56,

  // ── MẮT ──────────────────────────────────────────────
  // ⚠️ BO MÀN MỚI LÀ 38 × 45,5 mm — KHÔNG PHẢI HÌNH VUÔNG.
  //
  // Đây là chỗ bản cũ sai và không ai phát hiện vì chưa in: nó khoét
  // lỗ TRÒN ⌀42 rồi bảo "phải nuốt được PCB". Nhưng một hình chữ nhật
  // 38 × 45,5 có ĐƯỜNG CHÉO 59,3 mm — nó không lọt qua lỗ tròn ⌀42,
  // cũng không lọt ⌀50, mà phải ⌀60 mới lọt. Lỗ ⌀60 thì ống mắt phồng
  // lên ⌀66 và mất hẳn dáng WALL-E.
  //
  // Cách đúng: hốc bên trong hình CHỮ NHẬT (40 × 47,5), vỏ ngoài vẫn
  // TRÒN ⌀54. Chỗ mỏng nhất còn (54−47,5)/2 = 3,25 mm thành — đủ cứng.
  // PCB luồn vào từ phía SAU, không phải chui qua vành trước.
  eyeOuterD: 54,
  eyePocketW: 40, // 38 + 2 dung sai
  eyePocketH: 47.5, // 45,5 + 2
  eyeApertureD: 35, // lỗ nhìn thấy kính ⌀32,4
  eyeBezelT: 5, // vành trước — kính thụt vào tạo chiều sâu ống kính
  eyeLen: 40,
  eyeSpacing: 62, // tâm–tâm: ⌀54 + khe 8

  // ── NGỰC ─────────────────────────────────────────────
  // Màn 3.5" thành tấm ngực, đúng như WALL-E thật (báo mức sạc).
  chestW: 140,
  chestH: 138,
  chestT: 3,
  lcdW: 100, // bo mạch màn 3.5"
  lcdH: 55,
  lcdBorder: 6, // mép bo → vùng kính sáng: 88 × 43
  /**
   * Mép nhựa CHỜM LÊN vùng kính, mỗi phía.
   *
   * ⚠️ Bản trước để 0, tức cửa sổ đúng bằng 88 × 43 — bằng chằn chặn
   * vùng kính. Nghe thì gọn, nhưng nó là DUNG SAI BẰNG KHÔNG: in co
   * 0,3 mm là cắt mất mép ảnh, in nở 0,3 mm là lòi một vệt viền đen
   * chạy dọc cạnh. Máy FDM nào cũng lệch cỡ đó.
   *
   * Chờm 1 mm thì mọi sai số nằm dưới mép nhựa, không ai thấy.
   */
  lcdChonMep: 1, // ⇒ cửa sổ khoét 86 × 41
  spkD: 65, // ⌀ NGOÀI cả vành loa — dùng để chừa chỗ bên trong thân
  // ⚠️ LỖ THOÁT ÂM nhỏ hơn vành loa, và đây là chỗ bản trước sai:
  // khoét đúng ⌀65 thì lỗ chạm cả mép trên lẫn mép dưới dải nhựa,
  // tấm ngực đứt làm đôi. Màng loa chỉ ⌀52, khoét đúng nó là đủ —
  // phần vành 6,5 mm mỗi bên còn lại chính là chỗ bắt vít giữ loa.
  spkHoleD: 52,
  spkDepth: 30,

  // ── PIN ──────────────────────────────────────────────
  batW: 92,
  batD: 43,
  batH: 22,

  screwD: 3.2, // lỗ vít M3 (in ra co ~0,2 nên để 3,2)
  postOuterD: 6.5,
  postInnerD: 2.7,
  laserD: 8, // lỗ cảm biến VL53L0X

  upperArmL: 52,
  upperArmW: 18,
  upperArmT: 14,
  forearmL: 46,
  forearmW: 16,
  forearmT: 12,
  servoAxleD: 6,

  // ── ỐP XÍCH ──────────────────────────────────────────
  // ⚠️ Khung TP101 xích chỉ cao 60 mm, WALL-E cần trông cao gấp đôi.
  // Hai miếng ốp này trùm ra ngoài: bộ truyền động thật nằm thấp và
  // nhẹ (0,47 kg cả bộ), còn PHẦN NHÌN THẤY thì cao và bản rộng.
  // ── Ốp xích, ĐO THẬT trên khung đã lắp 17/08/2026 ──
  //
  // ⚠️ Ba số cũ (195 × 105 × 6) dựa trên MÔ TẢ SHOP nói TP101 là
  // 193 × 163 × 60. Lắp xong đo thật: khung dài **155**, cao **50-60**,
  // bề ngang cả cụm **193-200** (không phải 163 — bánh xích lắp ra
  // ngoài xa hơn tính toán). Ốp cũ sẽ dài hơn khung 4cm.
  trackCoverL: 160, // khung 155 + 2,5mm phủ mỗi đầu
  trackCoverH: 95, // váy che, cao hơn xích (~50) để trông chắc như WALL-E
  trackCoverT: 3, // 6 → 3: bản 6mm ĐẶC tốn ~300g nhựa cho hai tấm ốp
  // Ốp không chạm đất — sát đất là nó cào sàn và vấp mép thảm.
  trackCoverHoDat: 10,
  /**
   * Tâm trục bánh, tính từ MẶT ĐẤT. Bằng bán kính bánh ⌀47.
   *
   * ⚠️ Bản trước đặt lỗ trục ở `y = H/2`. Cách viết đó chỉ đúng khi ốp
   * cao ĐÚNG bằng đường kính bánh; với H = 105 thì lỗ nằm ở 52,5mm,
   * lệch trục thật gần 3cm và tấm ốp không xỏ vào được. Lỗi kiểu này
   * không lộ ra ở bản vẽ, chỉ lộ lúc cầm tấm nhựa trên tay.
   */
  trucCaoTuDat: 23.5,
  /** Trục cách đầu khung. Bánh ⌀47 nằm sát hai đầu ⇒ bằng bán kính. */
  trucCachDau: 23.5,

  seg: 48,
};


// ════════════════════════════════════════════════════════════
// Bộ dựng lưới tam giác
// ════════════════════════════════════════════════════════════

class Mesh {
  constructor() {
    this.tris = [];
  }
  tri(a, b, c) {
    this.tris.push([a, b, c]);
    return this;
  }
  /** Tứ giác → hai tam giác. Thứ tự đỉnh quyết định hướng pháp tuyến. */
  quad(a, b, c, d) {
    return this.tri(a, b, c).tri(a, c, d);
  }
  add(other) {
    this.tris.push(...other.tris);
    return this;
  }
  get count() {
    return this.tris.length;
  }
}

/** Hộp đặc, gốc ở góc dưới-trái-trước. */
function box(x, y, z, w, h, d) {
  const m = new Mesh();
  const [x0, y0, z0, x1, y1, z1] = [x, y, z, x + w, y + h, z + d];
  const v = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];
  m.quad(v[0], v[3], v[2], v[1]); // đáy (z0)
  m.quad(v[4], v[5], v[6], v[7]); // nóc (z1)
  m.quad(v[0], v[1], v[5], v[4]); // trước (y0)
  m.quad(v[2], v[3], v[7], v[6]); // sau (y1)
  m.quad(v[0], v[4], v[7], v[3]); // trái (x0)
  m.quad(v[1], v[2], v[6], v[5]); // phải (x1)
  return m;
}

/** Ống rỗng dọc trục Z. rInner = 0 cho trụ đặc. */
function tube(cx, cy, z, rOuter, rInner, height, seg = P.seg) {
  const m = new Mesh();
  const z1 = z + height;
  const pt = (r, i, zz) => {
    const a = (i / seg) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), zz];
  };
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    // mặt ngoài
    m.quad(pt(rOuter, i, z), pt(rOuter, j, z), pt(rOuter, j, z1), pt(rOuter, i, z1));
    if (rInner > 0) {
      // mặt trong (pháp tuyến hướng vào tâm → đảo thứ tự)
      m.quad(pt(rInner, i, z1), pt(rInner, j, z1), pt(rInner, j, z), pt(rInner, i, z));
      // hai vành
      m.quad(pt(rInner, i, z), pt(rInner, j, z), pt(rOuter, j, z), pt(rOuter, i, z));
      m.quad(pt(rOuter, i, z1), pt(rOuter, j, z1), pt(rInner, j, z1), pt(rInner, i, z1));
    } else {
      // hai nắp tròn đặc
      m.tri([cx, cy, z], pt(rOuter, j, z), pt(rOuter, i, z));
      m.tri([cx, cy, z1], pt(rOuter, i, z1), pt(rOuter, j, z1));
    }
  }
  return m;
}

/**
 * Tấm chữ nhật có các lỗ tròn xuyên suốt.
 *
 * Cách làm: chia tấm thành lưới ô sao cho mỗi lỗ nằm gọn giữa một ô
 * riêng. Ô không có lỗ → hộp đặc. Ô có lỗ → "vành vuông-tròn": với
 * mỗi đoạn cung, nối điểm trên vòng tròn ra điểm tương ứng trên biên ô
 * (chiếu tia từ tâm). Cách này tránh hẳn phép trừ hình học mà vẫn cho
 * lỗ tròn thật.
 */
function plateWithHoles(x, y, z, w, h, t, holes, seg = P.seg) {
  const m = new Mesh();
  // Biên chia lưới: mép tấm + hai cạnh ô quanh mỗi lỗ
  const pad = (r) => r * 1.35 + 1.5;
  const xs = new Set([0, w]);
  const ys = new Set([0, h]);
  for (const o of holes) {
    xs.add(Math.max(0, o.x - pad(o.r)));
    xs.add(Math.min(w, o.x + pad(o.r)));
    ys.add(Math.max(0, o.y - pad(o.r)));
    ys.add(Math.min(h, o.y + pad(o.r)));
  }
  const xa = [...xs].sort((a, b) => a - b);
  const ya = [...ys].sort((a, b) => a - b);

  for (let i = 0; i < xa.length - 1; i++) {
    for (let j = 0; j < ya.length - 1; j++) {
      const [cx0, cx1, cy0, cy1] = [xa[i], xa[i + 1], ya[j], ya[j + 1]];
      if (cx1 - cx0 < 1e-6 || cy1 - cy0 < 1e-6) continue;
      const hole = holes.find(
        (o) => o.x > cx0 - 1e-6 && o.x < cx1 + 1e-6 && o.y > cy0 - 1e-6 && o.y < cy1 + 1e-6,
      );
      if (!hole) {
        m.add(box(x + cx0, y + cy0, z, cx1 - cx0, cy1 - cy0, t));
        continue;
      }
      // Ô chứa lỗ: dựng vành giữa biên ô và vòng tròn
      const cx = hole.x;
      const cy = hole.y;
      const r = hole.r;
      /** Chiếu tia góc `a` từ tâm lỗ ra biên ô chữ nhật. */
      const onCell = (a) => {
        const dx = Math.cos(a);
        const dy = Math.sin(a);
        const tx = dx > 0 ? (cx1 - cx) / dx : dx < 0 ? (cx0 - cx) / dx : Infinity;
        const ty = dy > 0 ? (cy1 - cy) / dy : dy < 0 ? (cy0 - cy) / dy : Infinity;
        const tt = Math.min(tx, ty);
        return [x + cx + dx * tt, y + cy + dy * tt];
      };
      for (let s = 0; s < seg; s++) {
        const a0 = (s / seg) * Math.PI * 2;
        const a1 = ((s + 1) / seg) * Math.PI * 2;
        const [ox0, oy0] = onCell(a0);
        const [ox1, oy1] = onCell(a1);
        const ix0 = x + cx + r * Math.cos(a0);
        const iy0 = y + cy + r * Math.sin(a0);
        const ix1 = x + cx + r * Math.cos(a1);
        const iy1 = y + cy + r * Math.sin(a1);
        // mặt trên
        m.quad([ix0, iy0, z + t], [ix1, iy1, z + t], [ox1, oy1, z + t], [ox0, oy0, z + t]);
        // mặt dưới
        m.quad([ox0, oy0, z], [ox1, oy1, z], [ix1, iy1, z], [ix0, iy0, z]);
        // thành lỗ
        m.quad([ix0, iy0, z], [ix1, iy1, z], [ix1, iy1, z + t], [ix0, iy0, z + t]);
        // thành ngoài của ô (chỉ khi đoạn nằm trên một cạnh)
        m.quad([ox1, oy1, z], [ox0, oy0, z], [ox0, oy0, z + t], [ox1, oy1, z + t]);
      }
    }
  }
  return m;
}

// ════════════════════════════════════════════════════════════
// Xuất STL nhị phân
// ════════════════════════════════════════════════════════════

function toStl(mesh, name) {
  const n = mesh.count;
  const buf = Buffer.alloc(84 + n * 50);
  buf.write(`Mini-Me Robot - ${name} - mm`.slice(0, 79).padEnd(80, ' '), 0, 80, 'ascii');
  buf.writeUInt32LE(n, 80);
  let off = 84;
  for (const [a, b, c] of mesh.tris) {
    // pháp tuyến theo quy tắc bàn tay phải
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    let nx = u[1] * v[2] - u[2] * v[1];
    let ny = u[2] * v[0] - u[0] * v[2];
    let nz = u[0] * v[1] - u[1] * v[0];
    const len = Math.hypot(nx, ny, nz) || 1;
    buf.writeFloatLE(nx / len, off);
    buf.writeFloatLE(ny / len, off + 4);
    buf.writeFloatLE(nz / len, off + 8);
    off += 12;
    for (const p of [a, b, c]) {
      buf.writeFloatLE(p[0], off);
      buf.writeFloatLE(p[1], off + 4);
      buf.writeFloatLE(p[2], off + 8);
      off += 12;
    }
    buf.writeUInt16LE(0, off);
    off += 2;
  }
  return buf;
}

// ════════════════════════════════════════════════════════════
// 9 MẢNH VỎ
// ════════════════════════════════════════════════════════════


const PARTS = {};

// ── 1. Thân: đáy + 3 thành (hở nóc và hở mặt sau) + 4 trụ bắt vít ──
PARTS['01-than'] = (() => {
  const m = new Mesh();
  const { wall: t, bodyW: w, bodyH: h, bodyD: d } = P;
  m.add(box(0, 0, 0, w, d, t)); // đáy
  m.add(box(0, 0, 0, t, d, h)); // thành trái
  m.add(box(w - t, 0, 0, t, d, h)); // thành phải
  m.add(box(0, 0, 0, w, t, h)); // thành trước
  // 4 trụ bắt nắp sau (mặt sau để hở làm cửa bảo trì)
  const pr = P.postOuterD / 2;
  const ir = P.postInnerD / 2;
  for (const [px, pz] of [
    [pr + t, pr + t],
    [w - pr - t, pr + t],
    [pr + t, h - pr - t],
    [w - pr - t, h - pr - t],
  ]) {
    // trụ nằm dọc trục Y (hướng vào trong từ mặt sau)
    const c = tube(0, 0, 0, pr, ir, 14);
    // xoay 90° quanh X: (x,y,z) → (x, z, -y) rồi tịnh tiến
    for (const tri of c.tris) {
      m.tri(
        ...tri.map(([vx, vy, vz]) => [vx + px, d - vz, vy + pz]),
      );
    }
  }
  return m;
})();

// ── 2. Nắp sau: tấm phẳng + 4 lỗ vít ──
PARTS['02-nap-sau'] = (() => {
  const { wall: t, bodyW: w, bodyH: h } = P;
  const r = P.screwD / 2;
  const inset = P.postOuterD / 2 + t;
  return plateWithHoles(0, 0, 0, w, h, 3, [
    { x: inset, y: inset, r },
    { x: w - inset, y: inset, r },
    { x: inset, y: h - inset, r },
    { x: w - inset, y: h - inset, r },
  ]);
})();

// ── 3. Tấm ngực: lỗ laser + lưới loa (khe dài) + 4 lỗ vít ──
PARTS['03-tam-nguc'] = (() => {
  const { chestW: W, chestH: H, chestT: t, lcdW, lcdH, lcdBorder, spkD, screwD } = P;
  const m = new Mesh();

  // Cửa sổ màn 3.5": chỉ hở VÙNG KÍNH SÁNG, không hở cả bo mạch.
  // Đo được: bo 100 × 55, viền 6 mm mỗi phía ⇒ vùng sáng 88 × 43.
  // Hở đúng vùng sáng thì mép nhựa che luôn viền bo — nhìn liền khối,
  // và giữ được bo mạch khỏi tụt ra ngoài.
  // VÙNG KÍNH SÁNG — chỗ ảnh thật sự hiện ra. Không đổi, và mọi thứ
  // khác (trụ bắt vít, dải trên) neo vào nó.
  const kinhW = lcdW - 2 * lcdBorder;  // 88
  const kinhH = lcdH - 2 * lcdBorder;  // 43
  const kinhX = (W - kinhW) / 2;
  const kinhY = H - 12 - kinhH;        // chừa 12 mm mép trên

  // CỬA SỔ KHOÉT — nhỏ hơn vùng kính `lcdChonMep` mỗi phía.
  //
  // ⚠️ Thu vào TỪ TÂM chứ không đổi công thức `winY = H - 12 - winH`.
  // Viết kiểu kia thì cửa sổ nhỏ đi làm mép trên tụt xuống, kéo theo
  // cả bo màn và bốn trụ bắt vít dịch 1 mm — tức là sửa một thứ thẩm
  // mỹ lại làm lệch bốn lỗ vít đã khoan sẵn trên bo.
  const cm = P.lcdChonMep;
  const winW = kinhW - 2 * cm;         // 86
  const winH = kinhH - 2 * cm;         // 41
  const winX = kinhX + cm;
  const winY = kinhY + cm;

  // Loa ⌀65 nằm dưới màn, giữa tấm.
  const spkR = P.spkHoleD / 2;
  const spkCx = W / 2;
  // Neo vào `kinhY` chứ không `winY`: loa là chi tiết VẬT LÝ có bốn trụ
  // bắt vít, không được xê dịch chỉ vì cửa sổ thu nhỏ 1 mm.
  const spkCy = kinhY / 2;
  // Chốt chặn: lỗ loa phải chừa ít nhất 8 mm nhựa mỗi phía, nếu không
  // dải dưới đứt. Sai ở đây chỉ lộ ra khi đã in xong và cầm trên tay.
  if (spkCy - spkR < 8 || spkCy + spkR > winY - 8)
    throw new Error(
      `Lỗ loa ⌀${P.spkHoleD} không vừa dải dưới cao ${winY.toFixed(0)}mm — ` +
      `nới chestH hoặc thu spkHoleD`);

  // ⚠️ DỰNG BẰNG BỐN DẢI QUANH CỬA SỔ, không khoét lỗ chữ nhật.
  // `plateWithHoles` chỉ làm được lỗ TRÒN. Ghép bốn dải cho ra đúng
  // cùng kết quả mà không cần thêm phép trừ hình học.
  //
  // Dải DƯỚI chứa lỗ loa và 4 lỗ vít, nên nó dùng plateWithHoles;
  // ba dải kia là hộp đặc.
  m.add(plateWithHoles(0, 0, 0, W, winY, t, [
    { x: spkCx, y: spkCy, r: spkR },
    { x: 7, y: 7, r: screwD / 2 },
    { x: W - 7, y: 7, r: screwD / 2 },
  ]));
  m.add(box(0, winY + winH, 0, W, H - winY - winH, t));      // dải trên
  m.add(box(0, winY, 0, winX, winH, t));                      // dải trái
  m.add(box(winX + winW, winY, 0, W - winX - winW, winH, t)); // dải phải

  // Bốn trụ bắt loa, đặt trên vành 6,5 mm quanh màng.
  for (const a of [45, 135, 225, 315]) {
    const r = spkR + 5;
    m.add(tube(spkCx + r * Math.cos(a * Math.PI / 180),
               spkCy + r * Math.sin(a * Math.PI / 180),
               t, P.postOuterD / 2, P.postInnerD / 2, 4));
  }

  // Bốn trụ bắt màn 3.5" — bo 100 × 55, lỗ ở bốn góc thụt vào 3 mm.
  const px = [(W - lcdW) / 2 + 3, (W + lcdW) / 2 - 3];
  // `kinhY`, KHÔNG `winY` — bốn lỗ vít này đã khoan sẵn trên bo màn.
  // Neo vào cửa sổ thì mỗi lần chỉnh `lcdChonMep` là bốn trụ chạy theo,
  // và bo không lắp vào được nữa.
  const py = [kinhY - lcdBorder + 3, kinhY - lcdBorder + lcdH - 3];
  for (const x of px)
    for (const y of py)
      m.add(tube(x, y, t, P.postOuterD / 2, P.postInnerD / 2, 4));

  return m;
})();

// ── 4. Đầu: hộp hở sau, mặt trước có 2 lỗ ⌀42 cho ống mắt ──
PARTS['04-dau'] = (() => {
  const m = new Mesh();
  const { wall: t, headW: w, headH: h, headD: d, eyeApertureD,
          eyeSpacing, eyePocketW, eyePocketH } = P;
  const r = eyeApertureD / 2;
  const cx = [w / 2 - eyeSpacing / 2, w / 2 + eyeSpacing / 2];

  // Mặt trước: hai lỗ ⌀35 để lộ kính. Ống mắt úp CHỒNG lên từ ngoài,
  // bo màn nằm PHẲNG ở mặt trong — xem chú thích ở mảnh 05.
  m.add(plateWithHoles(0, 0, 0, w, h, t, cx.map((x) => ({ x, y: h / 2, r }))));

  // Bốn vấu giữ bo màn, đặt ở góc hốc 40 × 47,5. Giữ bằng vấu chứ
  // không bằng vít: bo màn mỗi lô một kiểu lỗ, mà vấu thì lô nào cũng
  // ôm được.
  const a = eyePocketW / 2, b = eyePocketH / 2, vt = 4;
  for (const x of cx)
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        m.add(box(x + sx * a - (sx > 0 ? 0 : vt), h / 2 + sy * b - (sy > 0 ? 0 : vt),
                  t, vt, vt, 4.5));

  // Bốn thành kéo về sau, mặt sau hở để luồn cáp qua cổ
  m.add(box(0, 0, t, t, h, d - t));
  m.add(box(w - t, 0, t, t, h, d - t));
  m.add(box(0, 0, t, w, t, d - t));
  m.add(box(0, h - t, t, w, t, d - t));
  return m;
})();

PARTS['05-ong-mat'] = (() => {
  const m = new Mesh();
  const { eyeOuterD, eyeApertureD, eyeLen } = P;
  const rO = eyeOuterD / 2;

  // ⚠️ BO MÀN KHÔNG NẰM TRONG ỐNG — nó bắt vào MẶT TRƯỚC CỦA ĐẦU,
  // còn ống này chỉ là cái vành trang trí úp ra ngoài.
  //
  // Bản trước cho PCB nằm trong ống, và chết ở hình học: bo màn
  // 38 × 45,5 cần hốc chữ nhật 40 × 47,5, mà nửa đường chéo của hốc
  // đó là 31 mm — LỚN HƠN bán kính ống 27 mm. Bốn góc hốc chọc thủng
  // thành ống, lưới tự cắt nhau. Muốn hốc lọt thì ống phải phồng lên
  // ⌀64, mất dáng.
  //
  // Số đo bắt được lỗi này, ảnh dựng thì KHÔNG — nhìn ảnh vẫn thấy
  // một cái ống bình thường. Đo trước khi tin mắt.
  //
  // Tách ra thì cả hai vấn đề tan: ống là vành khuyên thuần (in dễ,
  // không cần đỡ), còn PCB nằm phẳng sau mặt đầu, giữ bằng bốn vấu.
  m.add(tube(rO, rO, 0, rO, eyeApertureD / 2, 4));          // vành trước
  m.add(tube(rO, rO, 4, rO, eyeOuterD / 2 - 4, eyeLen - 4)); // thân ống
  return m;
})();

// ── 6. Cánh tay trên (in 2 cái): lỗ trục ở hai đầu ──
PARTS['06-canh-tay-tren'] = (() => {
  const { upperArmL: L, upperArmW: W, upperArmT: T, servoAxleD } = P;
  const r = servoAxleD / 2;
  const m = new Mesh();
  // hai má bên, mỗi má là tấm có 2 lỗ trục
  const cheek = () => plateWithHoles(0, 0, 0, W, L, 2.5, [
    { x: W / 2, y: 9, r },
    { x: W / 2, y: L - 9, r },
  ]);
  m.add(cheek());
  for (const tri of cheek().tris) m.tri(...tri.map(([x, y, z]) => [x, y, z + T - 2.5]));
  // hai gân nối, chừa rãnh luồn dây khuỷu ở giữa
  m.add(box(0, 0, 2.5, 2.5, L, T - 5));
  m.add(box(W - 2.5, 0, 2.5, 2.5, L, T - 5));
  return m;
})();

// ── 7. Cẳng tay + bàn (in 2 cái) ──
PARTS['07-cang-tay'] = (() => {
  const { forearmL: L, forearmW: W, forearmT: T, servoAxleD } = P;
  const r = servoAxleD / 2;
  const m = new Mesh();
  const cheek = () => plateWithHoles(0, 0, 0, W, L, 2.5, [{ x: W / 2, y: 8, r }]);
  m.add(cheek());
  for (const tri of cheek().tris) m.tri(...tri.map(([x, y, z]) => [x, y, z + T - 2.5]));
  m.add(box(0, 0, 2.5, 2.5, L, T - 5));
  m.add(box(W - 2.5, 0, 2.5, 2.5, L, T - 5));
  // bàn tay: khối bẹt ở đầu
  m.add(box(-2, L - 4, 0, W + 4, 12, T));
  return m;
})();

// ── 8. Ốp xích (in 2 cái) ──
PARTS['08-op-xich'] = (() => {
  const { trackCoverL: L, trackCoverH: H, trackCoverT: T,
          trackCoverHoDat: hoDat, trucCaoTuDat, trucCachDau } = P;

  // Ốp dài hơn khung ⇒ phủ thừa đều hai đầu.
  const phu = (L - 155) / 2;

  // ⚠️ Lỗ trục tính từ MẶT ĐẤT rồi trừ đi khoảng hở gầm, KHÔNG phải
  // `H / 2` như bản trước. Trục bánh nằm ở 23,5mm so với đất (bán kính
  // bánh ⌀47); mép dưới tấm ốp nằm ở 10mm. Vậy lỗ cách mép dưới tấm
  // 13,5mm. Lấy `H / 2` thì với ốp cao 95 lỗ ra 47,5mm — lệch 34mm và
  // tấm ốp không xỏ vào trục được.
  const yTruc = trucCaoTuDat - hoDat;

  // ⌀16, KHÔNG phải ⌀10.
  //
  // Vị trí trục (23,5mm từ đầu khung) là số tôi SUY RA từ bán kính bánh
  // ⌀47, không phải số đo. Lỗ ⌀10 cho trục ⌀6 chỉ có 2mm dung sai — suy
  // sai 3mm là lỗ không xỏ vào được, và người dùng phải giũa.
  //
  // ⌀16 cho ±5mm. Rộng hơn nhu cầu, nhưng lỗ nằm sát gầm, phần lớn bị
  // bánh xích che, nên không ai thấy. Đây là chỗ chọn CHẮC CHẮN LẮP ĐƯỢC
  // thay vì chọn ĐẸP HƠN MỘT CHÚT — mà lại chỉ đẹp hơn nếu con số suy ra
  // của tôi tình cờ đúng.
  const r = 8;

  return plateWithHoles(0, 0, 0, L, H, T, [
    { x: phu + trucCachDau, y: yTruc, r },
    { x: L - phu - trucCachDau, y: yTruc, r },
  ]);
})();

// ── 9. Giá cổ: ôm 2 servo MG90S vuông góc nhau ──
PARTS['09-gia-co'] = (() => {
  const m = new Mesh();
  // MG90S: 22,8 × 12,2 × 22,5 mm → hốc để dư 0,4 mỗi chiều
  const sw = 23.2;
  const sd = 12.6;
  const t = 2.5;
  // khối chữ L: đế ngang (servo xoay) + vách đứng (servo gật)
  m.add(box(0, 0, 0, sw + 2 * t, sd + 2 * t, t)); // đế
  m.add(box(0, 0, 0, t, sd + 2 * t, 26)); // vách trái
  m.add(box(sw + t, 0, 0, t, sd + 2 * t, 26)); // vách phải
  m.add(box(0, 0, 0, sw + 2 * t, t, 26)); // vách sau
  // tai bắt vít lên trần thân
  m.add(box(-8, 0, 0, 8, sd + 2 * t, t));
  m.add(box(sw + 2 * t, 0, 0, 8, sd + 2 * t, t));
  return m;
})();

// ════════════════════════════════════════════════════════════
// Đợt 3 — mấy mảnh NỐI mà bộ 9 mảnh đầu bỏ sót (17/08/2026)
// ════════════════════════════════════════════════════════════
//
// Ba chỗ hở, phát hiện khi soát lại mã SAU khi đã gửi shop in:
//
//   1. `09-gia-co` có "tai bắt vít lên trần thân" — mà `01-than` HỞ NÓC,
//      không có trần nào. → `10-tam-co`
//   2. `06-canh-tay-tren` có lỗ trục vai ⌀6 — nhưng không mảnh nào tạo
//      ra cái trục đó, thành bên thân là tấm phẳng trơn. → `11-khoi-vai`
//   3. Khuỷu KHÔNG mate: cánh tay trên 18×14 không lọt lòng cẳng tay
//      15×7, mà cẳng tay 20×12 cũng không lọt lòng cánh tay 13×9.
//      → `12-khop-khuyu`
//
// ⚠️ NGUYÊN TẮC CHUNG CỦA CẢ ĐỢT NÀY: **KHÔNG khoan lỗ bắt sẵn.**
//
// Vị trí bắt vít lên thân, và lỗ bắt khung pan-tilt, đều để TRỐNG.
// Người dùng áp mảnh vào chỗ mình muốn rồi khoan xuyên cả hai. Như thế
// thì không phụ thuộc vào con số nào của tôi, và không thể lệch — đúng
// bài học từ mảnh `08-op-xich`, nơi tôi tin số của shop và suýt cho in
// một tấm dài hơn khung 4cm.

/** Lòng trong cánh tay trên: 18 − 2×2,5 = 13 (ngang) × 14 − 2×2,5 = 9 (dày). */
const LONG_TAY_TREN = { ngang: 13, day: 9, lo: 9 }; // `lo`: tâm lỗ cách đầu
/** Lòng trong cẳng tay: 20 − 5 = 15 × 12 − 5 = 7. Lỗ cách đầu 8. */
const LONG_CANG_TAY = { ngang: 15, day: 7, lo: 8 };
/** Hở mỗi chiều để mộng trượt vào được, không phải gõ búa. */
const HO_MONG = 0.6;

/**
 * Dựng một cái mộng có lỗ chốt ⌀6 xuyên theo chiều DÀY.
 *
 * ⚠️ `xLo` phải truyền TƯỜNG MINH, không được mặc định bằng `lLong.lo`.
 *
 * Bản đầu tự đặt lỗ ở `lLong.lo` = 9mm tính từ gốc toạ độ mộng. Ở khối
 * vai thì gốc CHÍNH LÀ chân mộng nên ra đúng. Nhưng ở khớp khuỷu, mộng
 * A có gốc ở ĐẦU MÚT (chân nó nằm ở x = sau), nên 9mm tính từ gốc lại
 * thành 6mm tính từ chân — lỗ lệch 3mm và chốt không xỏ qua được cả
 * cánh tay lẫn mộng.
 *
 * Cùng một hàm, hai chỗ dùng, hai hệ quy chiếu ngược nhau. Bắt buộc bên
 * gọi phải tự tính, để không ai lặp lại nhầm lẫn đó.
 */
function mong(lLong, sau, xLo) {
  const w = lLong.ngang - HO_MONG;
  const d = lLong.day - HO_MONG;
  return { w, d, sau, m: plateWithHoles(0, 0, 0, sau, w, d, [{ x: xLo, y: w / 2, r: P.servoAxleD / 2 }]) };
}

// ── 10. Tấm cổ: bắc qua miệng hở nóc thân ──
PARTS['10-tam-co'] = (() => {
  const m = new Mesh();
  const { wall: t, bodyW: W } = P;
  const D = 60;   // sâu (trước–sau), đủ đặt chân khung pan-tilt
  const T = 3;    // dày tấm
  const gan = 15; // gờ thả xuống trong lòng thân, để định vị

  // Tấm nằm ĐÈ LÊN nóc hai thành bên. Rộng đúng bằng thân nên mép
  // ngoài trùng mép thân, nhìn liền khối.
  m.add(box(0, 0, 0, W, D, T));

  // Hai gờ thả xuống, ÁP SÁT MẶT TRONG thành bên. Khoan xuyên từ ngoài
  // vào (thành 2,41mm + gờ 3mm = 5,4mm ăn vít tự ren M3 rất chắc).
  m.add(box(t, 0, -gan, 3, D, gan));
  m.add(box(W - t - 3, 0, -gan, 3, D, gan));
  return m;
})();

// ── 11. Khối vai: bắt vào thành bên thân, tạo trục ⌀6 cho cánh tay ──
PARTS['11-khoi-vai'] = (() => {
  const m = new Mesh();
  const g = mong(LONG_TAY_TREN, 16, LONG_TAY_TREN.lo);  // gốc = CHÂN mộng ⇒ lỗ cách gốc 9
  const deW = 30, deH = 24, deT = 3; // đế áp vào thành thân

  // Mộng chĩa ra ngoài, nằm giữa đế theo cả hai chiều.
  const oy = (deW - g.w) / 2;
  const oz = (deH - g.d) / 2;
  for (const tri of g.m.tris) m.tri(...tri.map(([x, y, z]) => [x + deT, y + oy, z + oz]));

  m.add(box(0, 0, 0, deT, deW, deH)); // đế

  // ⚠️ KHÔNG có gân chống gãy ở chân mộng.
  //
  // Bản đầu có, cỡ `g.w + 4` × `g.d + 4` = 16,4 × 12,4 mm. Bộ kiểm bắt
  // được hai lỗi cùng lúc:
  //
  //  1. Nó TO HƠN lòng cánh tay (13 × 9) nên cánh tay không trượt lên
  //     nổi — gân chặn ngay chỗ cần lắp.
  //  2. Nó chiếm 4mm đầu mộng, đẩy điểm cánh tay tì vào ra xa 4mm, làm
  //     lỗ chốt trên cánh tay lệch 4mm so với lỗ trên mộng.
  //
  // Và nó vốn không cần: mộng là khối PETG ĐẶC 12,4 × 8,4 = 104 mm²
  // tiết diện, thừa chắc cho một cánh tay nhựa 91g.
  //
  // Bỏ gân đi thì ĐẾ trở thành cữ chặn: cánh tay tì vào đế ở X=3, lỗ
  // của nó (cách đầu 9mm) rơi đúng X=12 — trùng khít lỗ trên mộng.
  return m;
})();

// ── 12. Khớp khuỷu: hai mộng khác cỡ, đấu lưng nhau ──
PARTS['12-khop-khuyu'] = (() => {
  const m = new Mesh();
  // Mộng A: gốc toạ độ ở ĐẦU MÚT, chân nằm ở x=15 ⇒ lỗ phải đặt ở
  // 15 − 9 = 6 để nó cách CHÂN đúng 9mm, khớp lỗ trên cánh tay.
  const a = mong(LONG_TAY_TREN, 15, 15 - LONG_TAY_TREN.lo);
  // Mộng B: gốc ở CHÂN (sát khối giữa) ⇒ lỗ cách gốc đúng 8mm.
  const b = mong(LONG_CANG_TAY, 15, LONG_CANG_TAY.lo);
  const giua = 6; // đoạn giữa, cho khuỷu có chỗ gập

  for (const tri of a.m.tris) m.tri(...tri.map(([x, y, z]) => [x, y, z]));
  // Khối giữa lấy cỡ lớn nhất của hai mộng để không có bậc yếu.
  const gw = Math.max(a.w, b.w), gd = Math.max(a.d, b.d);
  m.add(box(a.sau, (gw - gw) / 2, (gd - gd) / 2, giua, gw, gd));
  for (const tri of b.m.tris)
    m.tri(...tri.map(([x, y, z]) => [x + a.sau + giua, y + (gw - b.w) / 2, z + (gd - b.d) / 2]));
  return m;
})();

// ── 13. Chốt ⌀6: xuyên qua khớp, có mũ chặn ──
PARTS['13-chot'] = (() => {
  const m = new Mesh();
  // ⌀5,8 chứ không ⌀6: nhựa in nở ra, đúng 6 là chặt cứng không xoay.
  m.add(tube(6, 6, 0, 2.9, 0, 18));
  m.add(tube(6, 6, 18, 4.5, 0, 2)); // mũ chặn
  return m;
})();

// ── 14. Tấm phôi: vật liệu thô cho mọi thứ phát sinh lúc lắp ──
//
// Không phải mảnh của robot. Là hai tấm PETG 3mm để lúc lắp gặp chỗ cần
// một cái ke, một miếng đệm, một tấm chắn thì có sẵn mà cắt — thay vì
// phải đặt in lần nữa và chờ ship. Cưa tay và khoan được dễ.
PARTS['14-tam-phoi'] = (() => box(0, 0, 0, 80, 60, 3))();


// ════════════════════════════════════════════════════════════

const outDir = process.argv[2] || './stl';
mkdirSync(outDir, { recursive: true });

let totalTris = 0;
const rows = [];
for (const [name, mesh] of Object.entries(PARTS)) {
  const buf = toStl(mesh, name);
  const file = join(outDir, `${name}.stl`);
  writeFileSync(file, buf);
  totalTris += mesh.count;
  // hộp bao để biết có vừa bàn in không
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (const tri of mesh.tris)
    for (const p of tri)
      for (let i = 0; i < 3; i++) {
        if (p[i] < min[i]) min[i] = p[i];
        if (p[i] > max[i]) max[i] = p[i];
      }
  rows.push({
    name,
    tris: mesh.count,
    kb: (buf.length / 1024).toFixed(0),
    size: `${(max[0] - min[0]).toFixed(0)}×${(max[1] - min[1]).toFixed(0)}×${(max[2] - min[2]).toFixed(0)}`,
  });
}

console.log('\nĐã sinh STL — đơn vị milimét\n');
console.log('mảnh'.padEnd(22), 'kích thước'.padEnd(14), 'tam giác'.padEnd(10), 'KB');
console.log('-'.repeat(58));
for (const r of rows) {
  console.log(r.name.padEnd(22), r.size.padEnd(14), String(r.tris).padEnd(10), r.kb);
}
console.log('-'.repeat(58));
console.log(`${rows.length} file · ${totalTris.toLocaleString('vi-VN')} tam giác · thư mục: ${outDir}`);
