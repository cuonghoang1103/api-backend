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

const chuanTen = (s) => String(s ?? '').toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
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
  // Chỉ có cảnh của kịch bản (thoigian.json nằm ở máy dựng khác) ⇒ không có mốc nào để dùng; `dungMuc` căn theo SRT.
  if (tg.chiKichBan) return { khop: false, lyDo: 'chỉ có kịch bản (thoigian.json ở máy dựng khác)' };
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
  /* MỌI video đều có mục lục (17/11/2026): cảnh thật ⇒ gộp thành chương 1–4 phút; không có cảnh nào (video dựng
     trên máy thuê, thiếu thoigian.json lẫn kịch bản khớp) ⇒ chia theo câu, đặt tên từ câu mở đoạn. */
  const nguonPhan = parts.length ? 'canh' : 'cau';
  parts = chiaChuong({ parts, cues, thoiLuong: Number.isFinite(durationSec) ? durationSec : cues.at(-1)?.t });
  return {
    muc: {
      lang: thongTin?.ngonNgu || 'vi',
      source: 'r2',
      track: 'VI',
      videoUrl: thongTin.r2Url,
      ...(Number.isFinite(durationSec) ? { durationSec: tron2(durationSec) } : {}),
      nguonCau,
      nguonPhan,
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

// ════════════════════════════════════════════════════════════════════════════
// MỤC LỤC VIDEO — chương 1–4 phút cho MỌI video (17/11/2026)
// ════════════════════════════════════════════════════════════════════════════
//
// Người dùng: "chia video thành từng phần, từng chủ đề, có phút:giây để bấm vào hỏi đúng phần đó". Trước đây chỉ video
// có `thoigian.json` khớp mới có `parts` (mỗi CẢNH một phần, 20–50 s) — 0/78 bài api-design, 0/114 bài DSA có, vì video
// dựng trên máy thuê để thoigian.json ở máy khác. Hai bước, thuần, KHÔNG gọi model (chạy lại ra đúng từng byte):
//   1. có cảnh ⇒ GỘP cảnh liền nhau thành chương ~75 s–4 phút (tên = tên cảnh có nghĩa);
//   2. không có cảnh ⇒ CHIA theo câu: cắt ở câu chuyển ý ("Tiếp theo…", "Bây giờ…", "Tóm lại…") sau ~75 s, cắt cứng
//      ở 4 phút; tên chương rút từ câu mở đoạn.

/** Tên cảnh không nói gì về nội dung — gộp mà không lấy làm tên chương. */
const TEN_VO_NGHIA = /^(?:bìa|cover|intro|outro|s\d+|c\d+|cảnh \d+|on|mo dau|phần \d+)$/iu;
export const tenCoNghia = (ten) => {
  const t = gon(String(ten ?? '').replace(/^Phần \d+ · /, ''));
  return t && !TEN_VO_NGHIA.test(chuanTen(t)) ? t : '';
};

/** Câu mở một ý mới — chỗ cắt chương tự nhiên. */
const CAU_CHUYEN_Y = new RegExp('^(?:'
  + [
    'tiếp theo', 'tiếp tới', 'kế tiếp', 'bây giờ', 'giờ (?:ta|mình|chúng ta|đến|tới|sang)', 'sang (?:phần|bước|ý)', 'chuyển sang',
    'phần (?:tiếp|thứ|cuối|hai|ba|bốn)', 'bước (?:tiếp|cuối|\\d|một|hai|ba|bốn|năm)', 'đầu tiên', 'thứ (?:nhất|hai|ba|tư|năm)',
    'cuối cùng', 'tóm lại', 'tổng kết', 'để tổng kết', 'câu hỏi', 'câu tự kiểm', 'thử (?:ngay|chạy)', 'chạy thật', 'mình chạy',
    'hãy cùng', 'cùng xem', 'ví dụ', 'một ví dụ', 'thực hành', 'bài tập', 'góc hacker', 'phỏng vấn', 'cái bẫy', 'bẫy',
    'slide (?:này|tiếp|\\d)', 'vậy (?:thì )?(?:làm sao|tại sao|vì sao|cái gì)', 'vì sao', 'tại sao', 'còn (?:một|cái|chuyện)',
    'chuyện thứ', 'điều thứ', 'ý thứ', 'nhưng (?:đợi|khoan|chờ)', 'khoan đã', 'quay lại', 'trước khi',
  ].join('|')
  + ')(?=[\\s,.:!?]|$)', 'iu');

/** Lời đệm đầu câu bỏ đi khi đặt tên chương. */
const DEM_DAU = /^(?:rồi|ok(?:ay)?|được rồi|được|vâng|nào|giờ thì|bây giờ|tiếp theo|tiếp tới|kế tiếp|tiếp|vậy thì|vậy|thế thì|thế|và|nhưng|còn|à|ừ|nhé|đấy|đó|okay)(?:[\s,.:!…-]+)/iu;

/** Rút một TÊN CHƯƠNG ngắn (≤ 8 từ) từ câu mở đoạn. */
export function tenTuCau(cauVi) {
  let s = gon(cauVi);
  for (let i = 0; i < 4 && DEM_DAU.test(s); i++) s = s.replace(DEM_DAU, '');
  // Cắt ở dấu ngắt ý đầu tiên — nhưng chỉ khi phần trước đủ dài để đứng một mình.
  const cat = s.split(/(?<=[.?!])\s|[:;—–]\s?|\s\(/u)[0] ?? s;
  if (cat.split(/\s+/).length >= 3) s = cat;
  s = s.replace(/[.,;:!…]+$/u, '');
  const tu = s.split(/\s+/).filter(Boolean);
  if (tu.length > 8) {
    const phay = s.split(/,\s/u)[0];
    s = phay.split(/\s+/).length >= 3 && phay.split(/\s+/).length <= 8 ? phay : tu.slice(0, 8).join(' ') + '…';
  }
  s = s.slice(0, 70);
  return s ? s[0].toLocaleUpperCase('vi') + s.slice(1) : '';
}

/** Đoạn mở đầu / kết bài nhận ra bằng chữ — tên cố định, dễ nhận hơn câu chào. */
const MO_DAU = /^(?:chào|xin chào|hello|hi\b)|đến với bài|bài trước|hôm nay ta|hôm nay mình/iu;
const KET_BAI = /tóm (?:lại|tắt)|tổng kết|bài sau|hẹn gặp|bài tiếp theo|ba câu tự kiểm|câu tự kiểm/iu;

function tenChuongTuCau(cuesTrong, i, n) {
  const dau = cuesTrong.map((c) => gon(c.vi ?? c.en)).filter(Boolean);
  if (!dau.length) return `Đoạn ${i + 1}`;
  if (i === 0 && dau.slice(0, 2).some((c) => MO_DAU.test(c))) return 'Mở đầu · bài này học gì';
  if (i === n - 1 && n > 1 && dau.slice(0, 3).some((c) => KET_BAI.test(c))) return 'Tóm tắt · bài sau';
  // Câu có ≥ 4 từ đầu tiên — câu quá ngắn ("Rồi.", "Chạy thử nhé.") không làm tên được.
  const cau = dau.find((c) => tenTuCau(c).split(/\s+/).length >= 3) ?? dau[0];
  return tenTuCau(cau) || `Đoạn ${i + 1}`;
}

/** Ngưỡng theo độ dài video: video 1 phút không chia chương 75 s. */
function nguong(thoiLuong) {
  const L = Number(thoiLuong) || 0;
  return { min: Math.min(75, Math.max(25, L / 5)), max: 240 };
}

/**
 * Chia theo câu (video không có cảnh nào). Cắt ở câu CHUYỂN Ý đầu tiên sau `min`; không có thì cắt ở câu đầu tiên sau
 * ~150 s; quá `max` thì cắt cứng. Đoạn cuối ngắn hơn nửa `min` ⇒ gộp vào đoạn trước.
 */
export function chiaTheoCau(cues, thoiLuong) {
  const ds = (cues ?? []).filter((c) => Number.isFinite(Number(c?.t)));
  if (!ds.length) return [];
  const { min, max } = nguong(thoiLuong);
  const muc = Math.min(150, Math.max(min, (Number(thoiLuong) || 0) / 2));
  const nhom = [];
  let dau = 0;
  for (let i = 1; i < ds.length; i++) {
    const daQua = ds[i].t - ds[dau].t;
    const chuyenY = CAU_CHUYEN_Y.test(gon(ds[i].vi ?? ds[i].en));
    if ((daQua >= min && chuyenY) || daQua >= muc && (i + 1 >= ds.length || ds[i + 1].t - ds[dau].t > muc + 30) || daQua >= max) {
      nhom.push([dau, i]);
      dau = i;
    }
  }
  nhom.push([dau, ds.length]);
  const L = Number(thoiLuong);
  const het = (k) => (k < ds.length ? ds[k].t : (Number.isFinite(L) ? L : ds.at(-1).t));
  // Đoạn cuối quá ngắn ⇒ gộp.
  if (nhom.length > 1 && het(nhom.at(-1)[1]) - ds[nhom.at(-1)[0]].t < min / 2) {
    const cuoi = nhom.pop();
    nhom.at(-1)[1] = cuoi[1];
  }
  return nhom.map(([a, b], i) => ({
    t: tron2(ds[a].t),
    den: tron2(het(b)),
    ten: tenChuongTuCau(ds.slice(a, Math.min(b, a + 3)), i, nhom.length),
  }));
}

/**
 * Gộp các CẢNH (đã có mốc) thành chương. Tên = tối đa hai tên cảnh có nghĩa nối bằng " · " (≤ 60 ký tự); nhóm không có
 * tên cảnh nào có nghĩa ⇒ rút tên từ câu mở đoạn. Cảnh dài quá 5 phút ⇒ chia tiếp theo câu.
 */
export function gopCanh(canh, cues, thoiLuong) {
  const ds = [...(canh ?? [])].filter((p) => Number.isFinite(Number(p?.t))).sort((a, b) => a.t - b.t);
  if (!ds.length) return [];
  const L = Number(thoiLuong);
  const { min, max } = nguong(thoiLuong);
  const het = (i) => Number(ds[i].den ?? ds[i + 1]?.t ?? (Number.isFinite(L) ? L : ds[i].t));
  const nhom = [];
  let cur = null;
  ds.forEach((p, i) => {
    const e = het(i);
    if (cur && e - cur.t > max && cur.den - cur.t >= min / 2) { nhom.push(cur); cur = null; }
    if (!cur) cur = { t: Number(p.t), den: e, cac: [p] };
    else { cur.den = e; cur.cac.push(p); }
    if (cur.den - cur.t >= min) { nhom.push(cur); cur = null; }
  });
  if (cur) {
    if (nhom.length && cur.den - cur.t < min / 2) { nhom.at(-1).den = cur.den; nhom.at(-1).cac.push(...cur.cac); }
    else nhom.push(cur);
  }
  const cauTrong = (a, b) => (cues ?? []).filter((c) => c.t >= a - 0.5 && c.t < b);
  const ra = [];
  for (const g of nhom) {
    // Cảnh quá dài (> 5 phút): chia tiếp theo câu cho bấm được.
    const con = g.den - g.t > 300 && cauTrong(g.t, g.den).length > 4 ? chiaTheoCau(cauTrong(g.t, g.den), g.den - g.t) : [];
    if (con.length > 1) {
      con.forEach((c, k) => ra.push({
        t: k === 0 ? g.t : c.t, den: k === con.length - 1 ? g.den : c.den,
        ten: k === 0 ? '' : c.ten, cac: k === 0 ? g.cac : [],
      }));
    } else ra.push({ ...g, ten: '' });
  }
  return ra.map((g, i) => {
    const tenCanh = [...new Set((g.cac ?? []).map((p) => tenCoNghia(p.ten)).filter(Boolean))];
    let ten = g.ten || '';
    if (!ten && tenCanh.length) {
      ten = tenCanh[0];
      if (tenCanh[1] && (ten + ' · ' + tenCanh[1]).length <= 60) ten += ' · ' + tenCanh[1];
    }
    if (!ten) ten = tenChuongTuCau(cauTrong(g.t, g.den).slice(0, 3), i, ra.length);
    // Giữ tiền tố "Phần N · " của bản ghép (đặt trên tên cảnh đầu nhóm).
    const tienTo = /^(Phần \d+ · )/.exec(String(g.cac?.[0]?.ten ?? ''))?.[1] ?? '';
    return { t: tron2(g.t), den: tron2(g.den), ten: (tienTo && !ten.startsWith(tienTo) ? tienTo : '') + ten };
  });
}

/**
 * Mục lục cuối cùng của một video: có cảnh ⇒ gộp cảnh; không ⇒ chia theo câu. Chương đầu luôn bắt đầu ở 0:00 — đoạn
 * hình mở đầu (~5 s trước câu đầu tiên) thuộc về nó, và bấm chương 1 phải về đầu video.
 */
export function chiaChuong({ parts, cues, thoiLuong }) {
  const ra = parts?.length ? gopCanh(parts, cues, thoiLuong) : chiaTheoCau(cues, thoiLuong);
  if (ra[0] && ra[0].t < 15 && !/^Phần \d+ · /.test(ra[0].ten)) ra[0] = { ...ra[0], t: 0 };
  return ra;
}
