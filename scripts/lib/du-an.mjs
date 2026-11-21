import { createHash } from 'node:crypto';

/**
 * "Dự án xuyên suốt khoá" — kiểm + chuẩn hoá khối `duAn` của tệp khoá TRƯỚC khi seed (21/11/2026).
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * Hợp đồng: docs/du-an-hop-dong.md (§1 khối `duAn`, §2 cờ bài `mocDuAn` / `dangKyDuAn` / `baoVeDuAn`, §4 cách lưu DB).
 * Dùng chung cho `scripts/course-seed.mjs` (Courses) và `scripts/academy-seed-course.mjs` (Academy).
 *
 * THUẦN — không đụng CSDL, không đọc tệp. Test: `node --test scripts/lib/du-an.test.mjs`.
 *
 * ⚠️ Vì sao kiểm GẮT và báo TO (bài học 21/11/2026): seed từng từ chối `shortDescription > 500` bằng một dòng log lẫn
 * giữa hàng trăm dòng — 5 khoá không lên mà không ai biết. Ở đây:
 *   • lỗi (`loi`) ⇒ KHÔNG ghi spec dự án (giữ bản cũ trong CSDL), seed phần còn lại của khoá vẫn chạy bình thường,
 *     nhưng tiến trình THOÁT MÃ 1 ở cuối ⇒ `report_seed` của deploy.sh in [WARN] cho đúng tệp đó;
 *   • cảnh báo (`canhBao`) ⇒ vẫn ghi, chỉ in ra.
 *
 * Lưu: bảng `course_project_specs` (1:1 với khoá, `noi_dung` jsonb + `van_tay`). Cờ bài KHÔNG thành cột mới của
 * `lessons`: chúng được gom vào `noi_dung.bai` (slug bài ⇒ vai trò) vì frontend đã có slug mọi bài trong khoá —
 * bảng `lessons`/`courses` không đổi một byte, vân tay seed cũ giữ nguyên.
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOP_HOP_LE = new Set(['repo', 'demo', 'anh']);
/** Trần kích thước JSON lưu vào `course_project_specs.noi_dung` — chỉ CẢNH BÁO (một khoá lớn có thể cần hơn). */
export const TRAN_KICH_THUOC_DU_AN = 256 * 1024;

const laChuoi = (v) => typeof v === 'string' && v.trim().length > 0;
const mangChuoi = (v) => Array.isArray(v) && v.every(laChuoi);

/** Mọi bài của spec (sections ở gốc, hoặc trong `course.sections` như vài tệp Academy cũ). */
export function moiBai(spec) {
  const secs = Array.isArray(spec?.sections) ? spec.sections : Array.isArray(spec?.course?.sections) ? spec.course.sections : [];
  const out = [];
  secs.forEach((s, si) => (s?.lessons || []).forEach((l) => out.push({ l, sectionIndex: si, sectionTitle: s?.title ?? '' })));
  return out;
}

/** Khối `duAn` của spec: gốc (hợp đồng) — chấp nhận cả `course.duAn` để agent nội dung đặt nhầm chỗ không bị nuốt. */
export function layDuAn(spec) {
  if (spec && spec.duAn !== undefined) return spec.duAn;
  if (spec?.course && spec.course.duAn !== undefined) return spec.course.duAn;
  return undefined;
}

/**
 * Kiểm `duAn` đối chiếu với bài thật của khoá.
 * @param {object|undefined} duAn
 * @param {Array<{l: object}>} bai — kết quả `moiBai(spec)`; slug bài đã tính sẵn (`l.slug` hoặc `slugTinh`)
 * @param {(l: object) => string} slugCua — cùng luật slugify của seeder
 * @returns {{ coDuAn: boolean, loi: string[], canhBao: string[], duLieu: object|null }}
 */
export function kiemDuAn(duAn, bai, slugCua) {
  const loi = [];
  const canhBao = [];
  const baiCoCo = { moc: [], dangKy: [], baoVe: [] };
  const slugBai = new Map(); // slug ⇒ bài
  for (const { l } of bai) {
    const s = slugCua(l);
    if (s) {
      if (slugBai.has(s)) canhBao.push(`slug bài "${s}" xuất hiện nhiều lần trong tệp — bài sau đè bài trước khi dò cờ dự án`);
      slugBai.set(s, l);
    }
    if (l.mocDuAn !== undefined && l.mocDuAn !== null && l.mocDuAn !== false) baiCoCo.moc.push({ slug: s, so: l.mocDuAn, l });
    if (l.dangKyDuAn === true) baiCoCo.dangKy.push(s);
    if (l.baoVeDuAn === true) baiCoCo.baoVe.push(s);
  }
  const coCo = baiCoCo.moc.length + baiCoCo.dangKy.length + baiCoCo.baoVe.length > 0;

  if (duAn === undefined || duAn === null) {
    if (coCo) {
      const ds = [...baiCoCo.dangKy, ...baiCoCo.moc.map((m) => m.slug), ...baiCoCo.baoVe].slice(0, 6).join(', ');
      loi.push(`có bài gắn cờ dự án (${ds}) nhưng tệp KHÔNG có khối \`duAn\` — thêm \`duAn\` ở gốc default export (docs/du-an-hop-dong.md §1)`);
    }
    return { coDuAn: false, loi, canhBao, duLieu: null };
  }
  if (typeof duAn !== 'object' || Array.isArray(duAn)) {
    loi.push('`duAn` phải là một object');
    return { coDuAn: true, loi, canhBao, duLieu: null };
  }

  if (duAn.version !== 1) canhBao.push(`duAn.version = ${JSON.stringify(duAn.version)} — hợp đồng hiện là 1`);
  if (!laChuoi(duAn.gioiThieu)) loi.push('duAn.gioiThieu trống — cần "Học xong khoá này bạn làm được gì" (EN|||VI)');

  /* ── Mốc ─────────────────────────────────────────────────────────── */
  const moc = Array.isArray(duAn.moc) ? duAn.moc : null;
  const soMoc = new Set();
  const slugMoc = new Set();
  if (!moc || moc.length === 0) loi.push('duAn.moc phải là mảng ≥ 1 mốc');
  (moc || []).forEach((m, i) => {
    const nhan = `duAn.moc[${i}]`;
    if (!m || typeof m !== 'object') { loi.push(`${nhan} không phải object`); return; }
    if (!Number.isInteger(m.so) || m.so < 1) loi.push(`${nhan}.so phải là số nguyên ≥ 1 (đang ${JSON.stringify(m.so)})`);
    else if (soMoc.has(m.so)) loi.push(`${nhan}.so = ${m.so} bị trùng`);
    else soMoc.add(m.so);
    if (i > 0 && Number.isInteger(m.so) && Number.isInteger(moc[i - 1]?.so) && m.so <= moc[i - 1].so) {
      loi.push(`${nhan}.so = ${m.so} không tăng dần (mốc trước là ${moc[i - 1].so}) — xếp mốc theo thứ tự học`);
    }
    if (!laChuoi(m.slug) || !SLUG_RE.test(m.slug)) loi.push(`${nhan}.slug "${m.slug}" không hợp lệ ([a-z0-9-])`);
    else if (slugMoc.has(m.slug)) loi.push(`${nhan}.slug "${m.slug}" bị trùng`);
    else {
      slugMoc.add(m.slug);
      const b = slugBai.get(m.slug);
      if (!b) loi.push(`${nhan}.slug "${m.slug}" KHÔNG khớp bài nào trong sections — cần một bài EXERCISE slug đó, \`mocDuAn: ${m.so}\``);
      else if (b.mocDuAn !== m.so) loi.push(`bài "${m.slug}" có mocDuAn = ${JSON.stringify(b.mocDuAn)} nhưng duAn.moc[${i}].so = ${m.so}`);
    }
    if (!laChuoi(m.ten)) loi.push(`${nhan}.ten trống`);
    if (!mangChuoi(m.yeuCau) || m.yeuCau.length === 0) loi.push(`${nhan}.yeuCau phải là mảng chuỗi ≥ 1`);
    if (!mangChuoi(m.datKhi) || m.datKhi.length === 0) loi.push(`${nhan}.datKhi phải là mảng chuỗi ≥ 1 (tiêu chí kiểm được)`);
    for (const k of ['nangCao', 'goiY']) {
      if (m[k] !== undefined && !mangChuoi(m[k])) loi.push(`${nhan}.${k} phải là mảng chuỗi`);
    }
    if (m.nop !== undefined) {
      if (!Array.isArray(m.nop) || m.nop.some((x) => !NOP_HOP_LE.has(x))) loi.push(`${nhan}.nop chỉ nhận 'repo' | 'demo' | 'anh'`);
    }
  });
  for (const b of baiCoCo.moc) {
    if (!Number.isInteger(b.so)) loi.push(`bài "${b.slug}" có mocDuAn = ${JSON.stringify(b.so)} — phải là số mốc (1, 2, …)`);
    else if (!slugMoc.has(b.slug)) loi.push(`bài "${b.slug}" có mocDuAn = ${b.so} nhưng không có trong duAn.moc (slug mốc phải trùng slug bài)`);
    if (b.l.type && String(b.l.type).toUpperCase() !== 'EXERCISE') canhBao.push(`bài mốc "${b.slug}" có type ${b.l.type} — hợp đồng là EXERCISE`);
  }

  /* ── Đề tài ──────────────────────────────────────────────────────── */
  const deTai = Array.isArray(duAn.deTai) ? duAn.deTai : null;
  if (!deTai || deTai.length < 5) loi.push(`duAn.deTai cần ≥ 5 đề tài gợi ý (đang ${deTai ? deTai.length : 0})`);
  const slugDeTai = new Set();
  (deTai || []).forEach((d, i) => {
    const nhan = `duAn.deTai[${i}]`;
    if (!d || typeof d !== 'object') { loi.push(`${nhan} không phải object`); return; }
    if (!laChuoi(d.slug) || !SLUG_RE.test(d.slug) || d.slug.length > 80) loi.push(`${nhan}.slug "${d.slug}" không hợp lệ ([a-z0-9-], ≤ 80)`);
    else if (slugDeTai.has(d.slug)) loi.push(`${nhan}.slug "${d.slug}" bị trùng`);
    else slugDeTai.add(d.slug);
    if (!laChuoi(d.ten)) loi.push(`${nhan}.ten trống`);
    if (!laChuoi(d.moTa)) loi.push(`${nhan}.moTa trống`);
    if (![1, 2, 3].includes(d.doKho)) loi.push(`${nhan}.doKho phải là 1 | 2 | 3 (đang ${JSON.stringify(d.doKho)})`);
    if (!mangChuoi(d.tinhNang) || d.tinhNang.length < 3) loi.push(`${nhan}.tinhNang cần mảng ≥ 3 tính năng`);
    else if (d.tinhNang.length < 6 || d.tinhNang.length > 12) canhBao.push(`${nhan}.tinhNang có ${d.tinhNang.length} mục — hợp đồng khuyên 6–12`);
    if (d.banDoChuong !== undefined) {
      if (!Array.isArray(d.banDoChuong)) loi.push(`${nhan}.banDoChuong phải là mảng [{ moc, dung }]`);
      else d.banDoChuong.forEach((x, k) => {
        if (!x || !Number.isInteger(x.moc) || !laChuoi(x.dung)) loi.push(`${nhan}.banDoChuong[${k}] cần { moc: số, dung: chuỗi }`);
        else if (soMoc.size && !soMoc.has(x.moc)) loi.push(`${nhan}.banDoChuong[${k}].moc = ${x.moc} không có trong duAn.moc`);
      });
    } else canhBao.push(`${nhan} chưa có banDoChuong (mốc nào xây phần nào)`);
    if (d.thamKhaoThat !== undefined && !mangChuoi(d.thamKhaoThat)) loi.push(`${nhan}.thamKhaoThat phải là mảng chuỗi`);
    if (d.anh != null && !(typeof d.anh === 'string' && /^https:\/\//.test(d.anh))) loi.push(`${nhan}.anh phải là URL https:// hoặc null`);
  });

  /* ── Đề tài tự chọn ──────────────────────────────────────────────── */
  if (!duAn.tuChon || !mangChuoi(duAn.tuChon.yeuCauToiThieu) || duAn.tuChon.yeuCauToiThieu.length === 0) {
    loi.push('duAn.tuChon.yeuCauToiThieu cần mảng ≥ 1 tiêu chí — AI dùng nó để duyệt đề tài tự chọn');
  } else if (duAn.tuChon.goiYQuyMo !== undefined && !laChuoi(duAn.tuChon.goiYQuyMo)) {
    loi.push('duAn.tuChon.goiYQuyMo phải là chuỗi');
  }

  /* ── Bảo vệ ──────────────────────────────────────────────────────── */
  const bv = duAn.baoVe;
  if (!bv || typeof bv !== 'object') loi.push('duAn.baoVe thiếu (rubric + cauHoiMau + chuanBi)');
  else {
    if (!Array.isArray(bv.rubric) || bv.rubric.length === 0) loi.push('duAn.baoVe.rubric cần ≥ 1 tiêu chí');
    else {
      let tong = 0;
      bv.rubric.forEach((r, i) => {
        if (!r || !laChuoi(r.tieuChi)) loi.push(`duAn.baoVe.rubric[${i}].tieuChi trống`);
        if (!(typeof r?.diem === 'number' && r.diem > 0)) loi.push(`duAn.baoVe.rubric[${i}].diem phải là số > 0`);
        else tong += r.diem;
      });
      if (Math.abs(tong - 10) > 1e-6) loi.push(`tổng điểm rubric = ${tong} — phải đúng 10`);
    }
    if (!mangChuoi(bv.cauHoiMau) || bv.cauHoiMau.length < 5) loi.push('duAn.baoVe.cauHoiMau cần ≥ 5 câu (hợp đồng: ≥ 15)');
    else if (bv.cauHoiMau.length < 15) canhBao.push(`duAn.baoVe.cauHoiMau có ${bv.cauHoiMau.length} câu — hợp đồng là ≥ 15`);
    if (!mangChuoi(bv.chuanBi) || bv.chuanBi.length === 0) loi.push('duAn.baoVe.chuanBi cần checklist ≥ 1 mục');
  }

  /* ── Cờ bài đăng ký / bảo vệ ─────────────────────────────────────── */
  if (baiCoCo.dangKy.length === 0) loi.push('không bài nào có `dangKyDuAn: true` — người học sẽ không có chỗ chọn đề tài (thêm vào bài "Bắt đầu tại đây")');
  if (baiCoCo.baoVe.length === 0) loi.push('không bài nào có `baoVeDuAn: true` — cần một bài "<prefix>-bao-ve-du-an" cuối khoá');
  if (baiCoCo.dangKy.length > 1) canhBao.push(`${baiCoCo.dangKy.length} bài có dangKyDuAn — thường chỉ một`);

  const duLieu = loi.length ? null : {
    version: 1,
    gioiThieu: duAn.gioiThieu,
    deTai: deTai.map((d) => ({
      slug: d.slug, ten: d.ten, moTa: d.moTa, doKho: d.doKho, tinhNang: d.tinhNang,
      banDoChuong: d.banDoChuong ?? [], thamKhaoThat: d.thamKhaoThat ?? [], anh: d.anh ?? null,
    })),
    tuChon: { yeuCauToiThieu: duAn.tuChon.yeuCauToiThieu, goiYQuyMo: duAn.tuChon.goiYQuyMo ?? null },
    moc: moc.map((m) => ({
      so: m.so, slug: m.slug, ten: m.ten, sauChuong: m.sauChuong ?? null,
      yeuCau: m.yeuCau, nangCao: m.nangCao ?? [], datKhi: m.datKhi, goiY: m.goiY ?? [], nop: m.nop ?? ['repo'],
    })),
    baoVe: {
      rubric: bv.rubric.map((r) => ({ tieuChi: r.tieuChi, diem: r.diem, moTa: r.moTa ?? null })),
      cauHoiMau: bv.cauHoiMau,
      chuanBi: bv.chuanBi,
    },
    // Vai trò của bài theo slug — thay cho cột cờ trên `lessons` (docs/du-an-hop-dong.md §4).
    bai: { dangKy: baiCoCo.dangKy, baoVe: baiCoCo.baoVe },
  };
  if (duLieu) {
    const kb = Buffer.byteLength(JSON.stringify(duLieu));
    if (kb > TRAN_KICH_THUOC_DU_AN) canhBao.push(`duAn chuẩn hoá nặng ${Math.round(kb / 1024)} KB (> ${TRAN_KICH_THUOC_DU_AN / 1024} KB) — nội dung dài nên nằm trong bài mốc`);
  }
  return { coDuAn: true, loi, canhBao, duLieu };
}

/** JSON với khoá object SẮP XẾP — `jsonb` của Postgres tự đổi thứ tự khoá, so chuỗi thô là lần nào cũng "khác". */
export function jsonOnDinh(v) {
  if (Array.isArray(v)) return `[${v.map(jsonOnDinh).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => `${JSON.stringify(k)}:${jsonOnDinh(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v ?? null);
}

/** So hai bản `duAn` bỏ qua thứ tự khoá. */
export function giongNhau(cu, moi) {
  return jsonOnDinh(cu ?? null) === jsonOnDinh(moi ?? null);
}

/** Vân tay sha256 của bản chuẩn hoá — cột `course_project_specs.van_tay`. */
export function vanTayDuAn(duLieu) {
  return createHash('sha256').update(jsonOnDinh(duLieu)).digest('hex');
}

/** In kết quả kiểm theo đúng luật dò lỗi của deploy.sh (`✗` ⇒ lỗi, `!` ⇒ cảnh báo). Trả về true nếu có lỗi. */
export function inKetQuaKiem(kq, log = console) {
  for (const c of kq.canhBao) log.warn(`  ! duAn: ${c}`);
  for (const e of kq.loi) log.error(`  ✗ duAn: ${e}`);
  if (kq.loi.length) log.error(`  ✗ duAn: ${kq.loi.length} lỗi ⇒ KHÔNG ghi spec dự án (giữ bản cũ trong CSDL); phần còn lại của khoá vẫn seed; tiến trình sẽ thoát mã 1.`);
  return kq.loi.length > 0;
}
