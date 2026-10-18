/**
 * Phần THUẦN của `phu-de-tu-video-rieng.mjs` — không đọc đĩa, không mạng — để test.
 *
 * Đầu vào của một video (đã render, đã lên R2):
 *   • `thong-tin.json` của thư mục bài (~/Videos/CuongThai-KhoaHoc/<khoá>/<chương>/<bài>/) — có `r2Url`,
 *     `thoiLuongGiay`, và với bản GHÉP (`tron: true`) danh sách `cacPhan`;
 *   • `thoigian.json` của dự án dựng video (public/bai/<id>/) — mốc TỪNG CÂU (`canh[].cau[].a/b`, chữ `hien`)
 *     và các CẢNH (`canh[].ten/tu/den`). Đây là nguồn chính: mốc chính xác tới câu, cảnh là "phần" thật;
 *   • `phude.vi.srt` — dự phòng khi không có/không khớp `thoigian.json` (chỉ có câu, không có phần).
 */

const tron2 = (x) => Math.round(Number(x) * 100) / 100;
const gon = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** "00:01:02,345" → 62.345 */
export function giaySrt(v) {
  const m = /^(\d+):(\d{2}):(\d{2})[,.](\d{1,3})$/.exec(String(v).trim());
  if (!m) return NaN;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, '0')) / 1000;
}

/** Đọc SRT ⇒ [{ a, b, chu }] theo thứ tự thời gian. Khối hỏng thì bỏ, không ném. */
export function docSrt(text) {
  const ra = [];
  for (const khoi of String(text ?? '').replace(/\r/g, '').split(/\n\s*\n/)) {
    const dong = khoi.split('\n').map((d) => d.trim()).filter(Boolean);
    const iMoc = dong.findIndex((d) => d.includes('-->'));
    if (iMoc < 0) continue;
    const [a, b] = dong[iMoc].split('-->').map((x) => giaySrt(x));
    const chu = gon(dong.slice(iMoc + 1).join(' '));
    if (Number.isFinite(a) && chu) ra.push({ a, b: Number.isFinite(b) ? b : a, chu });
  }
  return ra.sort((x, y) => x.a - y.a);
}

/** Câu từ thoigian.json ⇒ [{ t, vi }] (mốc dời thêm `lech` giây — dùng cho bản ghép). */
export function cauTuThoiGian(tg, lech = 0) {
  const ra = [];
  for (const c of tg?.canh ?? []) {
    for (const cau of c?.cau ?? []) {
      const vi = gon(cau?.hien);
      if (!vi || !Number.isFinite(Number(cau?.a))) continue;
      ra.push({ t: tron2(Number(cau.a) + lech), vi });
    }
  }
  return ra.sort((x, y) => x.t - y.t);
}

/** Cảnh từ thoigian.json ⇒ phần [{ t, den, ten }]. */
export function phanTuThoiGian(tg, lech = 0, tienTo = '') {
  const canh = (tg?.canh ?? []).filter((c) => Number.isFinite(Number(c?.tu)));
  return canh.map((c, i) => {
    const den = Number.isFinite(Number(c.den)) ? Number(c.den)
      : Number.isFinite(Number(canh[i + 1]?.tu)) ? Number(canh[i + 1].tu) : Number(tg?.tong);
    return {
      t: tron2(Number(c.tu) + lech),
      ...(Number.isFinite(den) ? { den: tron2(den + lech) } : {}),
      ten: tienTo + (gon(c.ten) || gon(c.id) || `Cảnh ${i + 1}`),
    };
  });
}

/**
 * Câu từ SRT (dự phòng). SRT đã render cắt câu thành mẩu ngắn cho vừa màn hình ("Chào bạn, đến với bài 0.5…:" /
 * "Bắt đầu tại đây, phần một.") — GHÉP lại thành câu: nối mẩu sau vào mẩu trước khi mẩu trước chưa kết thúc bằng
 * dấu chấm câu, hai mẩu sát nhau (< 1,2 s) và câu chưa quá dài. Mốc câu = mốc mẩu đầu.
 */
export function cauTuSrt(srt) {
  const ra = [];
  let hienTai = null;
  for (const c of docSrt(srt)) {
    const xong = !hienTai || /[.!?…]["'”’)\]]*$/.test(hienTai.vi) || c.a - hienTai.b > 1.2 || hienTai.vi.length > 220;
    if (xong) {
      if (hienTai) ra.push({ t: hienTai.t, vi: hienTai.vi });
      hienTai = { t: tron2(c.a), b: c.b, vi: c.chu };
    } else {
      hienTai.vi += ' ' + c.chu;
      hienTai.b = c.b;
    }
  }
  if (hienTai) ra.push({ t: hienTai.t, vi: hienTai.vi });
  return ra;
}

const chuan = (s) => String(s ?? '').toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/**
 * CĂN CẢNH THEO SRT — khi thoigian.json KHÔNG khớp video đã render (lời đã soạn/đọc lại sau khi render, nên
 * mốc trong tệp là của một bản chưa từng lên web) nhưng tên cảnh và câu mở cảnh vẫn như cũ.
 *
 * Mỗi cảnh: tìm mẩu SRT (đi tới, không lùi) mà câu MỞ CẢNH bắt đầu bằng đúng chữ của mẩu đó. Mốc phần = mốc mẩu
 * SRT — tức mốc của VIDEO THẬT. Cảnh không tìm thấy thì gộp vào phần trước (bỏ đi, không đoán mốc).
 * Dưới `tiLeToiThieu` cảnh khớp ⇒ coi như không căn được, trả [].
 *
 * @param {Array<{tg: object, tienTo: string}>} cacTg  một hay nhiều thoigian.json theo đúng thứ tự trong video
 */
export function canCanhTheoSrt(cacTg, srtCau, thoiLuong, tiLeToiThieu = 0.6) {
  const manh = srtCau.map((c) => ({ a: c.a, k: chuan(c.chu) }));
  const ra = [];
  let tong = 0, j = 0;
  for (const { tg, tienTo } of cacTg) {
    for (const [i, c] of (tg?.canh ?? []).entries()) {
      tong++;
      const mo = (c?.cau ?? []).map((x) => chuan(x?.hien)).find(Boolean);
      if (!mo) continue;
      let k = j;
      for (; k < manh.length; k++) if (manh[k].k && mo.startsWith(manh[k].k)) break;
      if (k >= manh.length) continue;
      ra.push({ t: tron2(manh[k].a), ten: tienTo + (gon(c.ten) || gon(c.id) || `Cảnh ${i + 1}`) });
      j = k + 1;
    }
  }
  if (!tong || ra.length / tong < tiLeToiThieu) return [];
  return ra.map((p, i) => {
    const den = i + 1 < ra.length ? ra[i + 1].t : Number(thoiLuong);
    return { t: p.t, ...(Number.isFinite(den) ? { den: tron2(den) } : {}), ten: p.ten };
  });
}

/**
 * thoigian.json có ĐÚNG là của video đã render không?
 * Video bị dựng lại sau khi soạn lại lời (hay thư mục trỏ nhầm id) thì mốc lệch — đem mốc lệch đi
 * làm nút tua còn tệ hơn không có. Kiểm hai thứ: tổng thời lượng và mốc câu đầu so với SRT đã render kèm.
 */
export function thoiGianKhopVideo(tg, thoiLuongGiay, srtCau, lech = 0) {
  if (!tg || !Array.isArray(tg.canh)) return { khop: false, lyDo: 'không có thoigian.json' };
  if (Number.isFinite(Number(thoiLuongGiay)) && Number.isFinite(Number(tg.tong))
    && Math.abs(Number(tg.tong) - Number(thoiLuongGiay)) > 0.6) {
    return { khop: false, lyDo: `thời lượng lệch (${tg.tong}s ≠ ${thoiLuongGiay}s)` };
  }
  const dau = cauTuThoiGian(tg, lech)[0];
  if (dau && srtCau?.length) {
    const gan = srtCau.find((c) => c.a >= dau.t - 0.6);
    if (!gan || Math.abs(gan.a - dau.t) > 0.3) {
      return { khop: false, lyDo: `câu đầu lệch SRT (${dau.t}s ≠ ${gan?.a ?? '—'}s)` };
    }
  }
  return { khop: true };
}

/**
 * Dựng MỘT mục phụ đề cho một video.
 *
 * @param {object} p
 * @param {object} p.thongTin       thong-tin.json của video
 * @param {string} p.srt            nội dung phude.vi.srt (có thể rỗng)
 * @param {Array<{thoiGian:object|null, thoiLuongGiay:number, thoiLuongVideo?:number}>} p.phan
 *        MỘT phần (video thường) hoặc NHIỀU phần theo đúng thứ tự `cacPhan` (bản ghép `tron`).
 * @returns {{ muc: object|null, canhBao: string[] }}
 */
export function dungMuc({ thongTin, srt, phan }) {
  const canhBao = [];
  const srtCau = docSrt(srt);
  const ghep = phan.length > 1;
  let cues = [], parts = [], lech = 0, dung = true;

  phan.forEach((p, i) => {
    if (!dung) return;
    const k = thoiGianKhopVideo(p.thoiGian, p.thoiLuongGiay, srtCau, lech);
    if (!k.khop) { canhBao.push(`${ghep ? `phần ${i + 1}: ` : ''}${k.lyDo}`); dung = false; return; }
    cues = cues.concat(cauTuThoiGian(p.thoiGian, lech));
    parts = parts.concat(phanTuThoiGian(p.thoiGian, lech, ghep ? `Phần ${i + 1} · ` : ''));
    /* Bản ghép nối các TỆP video.mp4, mà tệp dài hơn `thoiLuongGiay` (thêm khung kết ~5 s) — nên dời mốc theo
       thời lượng THẬT của tệp (ffprobe, `thoiLuongVideo`) như `xuat/ghep-phan.mts` làm; thiếu thì lùi về con số kia. */
    lech += Number(p.thoiLuongVideo) || Number(p.thoiLuongGiay) || Number(p.thoiGian?.tong) || 0;
  });

  let nguonCau = 'thoigian';
  if (!dung || !cues.length) {
    cues = cauTuSrt(srt);
    nguonCau = 'srt';
    if (!cues.length) return { muc: null, canhBao: [...canhBao, 'không có câu nào (thiếu cả thoigian.json lẫn SRT)'] };
    const cacTg = phan.map((p, i) => ({ tg: p.thoiGian, tienTo: ghep ? `Phần ${i + 1} · ` : '' })).filter((x) => x.tg);
    parts = cacTg.length ? canCanhTheoSrt(cacTg, srtCau, thongTin?.thoiLuongGiay) : [];
    canhBao.push(parts.length ? `dùng SRT, các phần căn theo SRT (${parts.length})` : 'dùng SRT (không có các phần)');
  }

  const durationSec = Number(thongTin?.thoiLuongGiay);
  return {
    muc: {
      lang: thongTin?.ngonNgu || 'vi',
      source: 'r2',
      track: 'VI',
      videoUrl: thongTin.r2Url,
      ...(Number.isFinite(durationSec) ? { durationSec: tron2(durationSec) } : {}),
      nguonCau,
      cues,
      parts,
    },
    canhBao,
  };
}

/**
 * Bản đồ r2Url → [{ courseSlug, lessonSlug, track }] từ các tệp content/course-videos/*.mjs.
 * Ánh xạ BẰNG URL (thứ trang học thật sự phát), không đoán theo slug: slugWeb của video có thể khác
 * slug bài (swt-l2-1 ↔ swt301-lab2-labflow-nghiep-vu, b4-ngu-phap ↔ ba bài JPD123…).
 */
export function chiMucUrl(cacBanDo) {
  const ra = new Map();
  for (const m of cacBanDo) {
    for (const [lessonSlug, e] of Object.entries(m?.lessons ?? {})) {
      for (const track of ['VI', 'EN']) {
        const url = e?.[track.toLowerCase()]?.url;
        if (!url) continue;
        if (!ra.has(url)) ra.set(url, []);
        ra.get(url).push({ courseSlug: m.courseSlug, lessonSlug, track });
      }
    }
  }
  return ra;
}

/** Số từ của các câu (để ghi `soTu`). */
export const demTu = (cues) => cues.reduce((n, c) => n + (String(c.vi ?? c.en ?? '').split(/\s+/).filter(Boolean).length), 0);

/**
 * Ghi JSON GỌN mà vẫn đọc được trong diff: mỗi câu/phần một dòng.
 * Không có mốc "sinh lúc" nào — chạy lại trên cùng dữ liệu phải ra ĐÚNG từng byte (không đổi gì thì git không thấy gì).
 */
export function vietJson(tep) {
  const L = [];
  L.push('{');
  L.push(`  "courseSlug": ${JSON.stringify(tep.courseSlug)},`);
  L.push(`  "sinhBoi": ${JSON.stringify(tep.sinhBoi)},`);
  L.push('  "lessons": {');
  const slugs = Object.keys(tep.lessons).sort();
  slugs.forEach((slug, i) => {
    const m = tep.lessons[slug];
    const dau = { ...m };
    delete dau.cues; delete dau.parts;
    const dauJson = JSON.stringify(dau).slice(1, -1);
    L.push(`    ${JSON.stringify(slug)}: {${dauJson},`);
    L.push('      "parts": [' + (m.parts.length ? '\n' + m.parts.map((p) => `        ${JSON.stringify(p)}`).join(',\n') + '\n      ' : '') + '],');
    L.push('      "cues": [' + (m.cues.length ? '\n' + m.cues.map((c) => `        ${JSON.stringify(c)}`).join(',\n') + '\n      ' : '') + ']');
    L.push(`    }${i < slugs.length - 1 ? ',' : ''}`);
  });
  L.push('  }');
  L.push('}');
  return L.join('\n') + '\n';
}
