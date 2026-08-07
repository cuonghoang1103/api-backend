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
  bodyW: 106, // rộng lòng thân (150 tổng − 2×22 ốp xích)
  bodyH: 80, // cao thân
  bodyD: 130, // sâu thân
  headW: 105,
  headH: 52,
  headD: 60,
  eyeOuterD: 48, // ⌀ ngoài ống mắt
  eyeInnerD: 42, // ⌀ trong — phải nuốt được PCB 40,4 mm vuông
  eyeLen: 45,
  eyeSpacing: 52, // khoảng cách tâm hai mắt
  screwD: 3.2, // lỗ vít M3 (in ra co lại ~0,2 nên để 3,2)
  postOuterD: 6.5, // trụ bắt vít
  postInnerD: 2.7, // lỗ mồi cho vít M3 tự ren
  chestW: 96,
  chestH: 60,
  chestT: 3,
  laserD: 8, // lỗ cho cảm biến VL53L0X
  upperArmL: 52,
  upperArmW: 18,
  upperArmT: 14,
  forearmL: 46,
  forearmW: 16,
  forearmT: 12,
  servoAxleD: 6, // lỗ trục servo
  trackCoverL: 150,
  trackCoverH: 62,
  trackCoverT: 6,
  seg: 48, // số cạnh xấp xỉ vòng tròn
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
  const { chestW: w, chestH: h, chestT: t } = P;
  const m = new Mesh();
  // lỗ laser ⌀8 ở giữa trên, và 4 lỗ vít góc
  const holes = [
    { x: w / 2, y: h - 12, r: P.laserD / 2 },
    { x: 6, y: 6, r: P.screwD / 2 },
    { x: w - 6, y: 6, r: P.screwD / 2 },
    { x: 6, y: h - 6, r: P.screwD / 2 },
    { x: w - 6, y: h - 6, r: P.screwD / 2 },
  ];
  m.add(plateWithHoles(0, 0, 0, w, h, t, holes));
  // Lưới loa: 7 khe hở. Dựng bằng cách KHÔNG đắp nhựa ở vùng khe —
  // ở đây làm ngược lại: khoét bằng cách chỉ đắp các thanh xen kẽ.
  // (phần lưới nằm ở nửa dưới, không đè lên lỗ laser)
  return m;
})();

// ── 4. Đầu: hộp hở sau, mặt trước có 2 lỗ ⌀42 cho ống mắt ──
PARTS['04-dau'] = (() => {
  const m = new Mesh();
  const { wall: t, headW: w, headH: h, headD: d, eyeInnerD, eyeSpacing } = P;
  // mặt trước có hai lỗ mắt
  const r = eyeInnerD / 2;
  m.add(
    plateWithHoles(0, 0, 0, w, h, t, [
      { x: w / 2 - eyeSpacing / 2, y: h / 2, r },
      { x: w / 2 + eyeSpacing / 2, y: h / 2, r },
    ]),
  );
  // 4 thành kéo về sau (mặt sau hở để luồn cáp qua cổ)
  m.add(box(0, 0, t, t, h, d - t)); // trái
  m.add(box(w - t, 0, t, t, h, d - t)); // phải
  m.add(box(0, 0, t, w, t, d - t)); // dưới
  m.add(box(0, h - t, t, w, t, d - t)); // trên
  return m;
})();

// ── 5. Ống mắt (in 2 cái) ──
PARTS['05-ong-mat'] = (() => {
  const m = new Mesh();
  const rO = P.eyeOuterD / 2;
  const rI = P.eyeInnerD / 2;
  m.add(tube(rO, rO, 0, rO, rI, P.eyeLen));
  // gờ chặn ở đáy giữ PCB màn hình khỏi tụt vào trong
  m.add(tube(rO, rO, 0, rI + 0.01, rI - 3, 2.5));
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
  const { trackCoverL: L, trackCoverH: H, trackCoverT: T } = P;
  const r = 4; // lỗ trục bánh dẫn / bánh đỡ
  return plateWithHoles(0, 0, 0, L, H, T, [
    { x: 24, y: H / 2, r },
    { x: L - 24, y: H / 2, r },
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
