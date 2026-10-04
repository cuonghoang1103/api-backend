/**
 * Content Creator — phần THUẦN của AI (không DB, không mạng) để kiểm bằng test.
 * `creatorAi.service.ts` dựng ngữ cảnh từ DB rồi gọi vào đây.
 *
 * ─── Vì sao có file này (04/10/2026) ───
 * Người dùng sẽ quay TOÀN BỘ khoá Academy + Courses tại /creator. Yêu cầu chốt:
 * chọn/gõ mã môn → chọn bài → AI soạn trọn "gói quay" bám ĐÚNG nội dung bài thật
 * (hook, giới thiệu, lời giảng từng cảnh, góc máy, màn hình, b-roll, tóm tắt,
 * câu hỏi, CTA, mô tả YouTube) để người quay chỉ việc đặt máy và nói.
 *
 * Ba quyết định thiết kế:
 *  1. Gói quay là JSON có cấu trúc, rồi MÃ (không phải model) dựng ra kịch bản
 *     markdown, các cảnh của tab Phân cảnh, mốc chương YouTube. Mốc thời gian do
 *     mã cộng từ thời lượng từng cảnh — model hay cộng sai giây.
 *  2. Chỉ dẫn đạo diễn nằm trong `<!-- … -->`: tab Kịch bản và Teleprompter
 *     (`script-utils.ts` → `stripComments`) đã bỏ qua chú thích khi đếm từ và khi
 *     chạy chữ, nên máy nhắc chỉ hiện ĐÚNG lời cần đọc.
 *  3. Lời dặn "không bịa": bài mỏng thì model phải ghi `[CẦN BỔ SUNG: …]` ngay
 *     trong lời thoại và liệt kê ở `canBoSung` — giao diện hiện cảnh báo đó lên đầu.
 */

/** Số từ nói mỗi phút — CÙNG hằng số với `frontend/src/lib/script-utils.ts`. */
export const TU_MOI_PHUT = 150;

export type NgonNguQuay = 'VI' | 'EN';
export type PhongCachQuay = 'truoc_may' | 'man_hinh' | 'ket_hop';

export const LOAI_CANH = ['HOOK', 'INTRO', 'BODY', 'DEMO', 'MISTAKE', 'RECAP', 'QUIZ', 'CTA', 'OUTRO'] as const;
export type LoaiCanh = (typeof LOAI_CANH)[number];

/** `SCREEN` = quay màn hình (không có người trong khung) — không có trong enum ShotType. */
export const KHUNG_HINH = ['CLOSEUP', 'MEDIUM', 'WIDE', 'POV', 'OVERHEAD', 'SCREEN'] as const;
export type KhungHinh = (typeof KHUNG_HINH)[number];

export interface CanhQuay {
  ten: string;
  loai: LoaiCanh;
  /** Lời thoại đọc NGUYÊN VĂN. */
  loi: string;
  /** Màn hình / slide / sơ đồ đang chiếu. */
  manHinh: string;
  /** Code hiện trên màn hình (nếu có) — lấy đúng từ bài. */
  ma: string;
  gocMay: string;
  khungHinh: KhungHinh;
  broll: string;
  chuTrenManHinh: string;
  giay: number;
  /** Phần nào của bài học cảnh này dựa vào. */
  nguon: string;
}

export interface GoiQuay {
  tieuDe: string[];
  chuThumbnail: string[];
  tomTat: string;
  mucTieu: string[];
  chuanBi: string[];
  thietLap: { boCuc: string; anhSang: string; amThanh: string; manHinh: string };
  canh: CanhQuay[];
  cauHoi: Array<{ hoi: string; dapAn: string }>;
  youtube: { moTa: string; the: string[] };
  canBoSung: string[];
  /** 'mong' = nội dung nguồn ít, gói có chỗ cần người quay bổ sung. */
  doDay: 'du' | 'mong';
}

// ─── Tiện ích ────────────────────────────────────────────────────────────────

function chuoi(v: unknown, tran = 4000): string {
  if (typeof v === 'number') return String(v);
  if (typeof v !== 'string') return '';
  return v.replace(/\r\n/g, '\n').trim().slice(0, tran);
}

function dsChuoi(v: unknown, toiDa = 20, tran = 400): string[] {
  if (!Array.isArray(v)) return typeof v === 'string' && v.trim() ? [chuoi(v, tran)] : [];
  return v.map((x) => chuoi(x, tran)).filter(Boolean).slice(0, toiDa);
}

export function demTu(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** `m:ss` */
export function mocGio(giay: number): string {
  const s = Math.max(0, Math.round(giay));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Bóc JSON từ câu trả lời của model: bỏ rào ```json, lấy từ `{` đầu tới `}` cuối.
 * Ném lỗi rõ ràng khi không đọc được — caller quyết định lùi về văn bản thô.
 */
export function bocJson<T = unknown>(text: string): T {
  let s = String(text || '').trim();
  const rao = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (rao && rao[1].includes('{')) s = rao[1].trim();
  const dau = s.indexOf('{');
  const cuoi = s.lastIndexOf('}');
  if (dau < 0 || cuoi <= dau) throw new Error('AI không trả về JSON');
  const than = s.slice(dau, cuoi + 1);
  try {
    return JSON.parse(than) as T;
  } catch {
    // Lỗi hay gặp nhất: dấu phẩy thừa trước `]`/`}`.
    return JSON.parse(than.replace(/,\s*([\]}])/g, '$1')) as T;
  }
}

/** `-->` trong code/lời sẽ đóng chú thích HTML sớm và để lộ chỉ dẫn ra máy nhắc. */
function anToanChuThich(s: string): string {
  return s.replace(/-->/g, '-- >').replace(/<!--/g, '< !--');
}

// ─── Chuẩn hoá gói quay ──────────────────────────────────────────────────────

function chuanLoaiCanh(v: unknown, i: number, tong: number): LoaiCanh {
  const s = String(v ?? '').toUpperCase().trim();
  if ((LOAI_CANH as readonly string[]).includes(s)) return s as LoaiCanh;
  if (i === 0) return 'HOOK';
  if (i === tong - 1) return 'OUTRO';
  return 'BODY';
}

function chuanKhungHinh(v: unknown): KhungHinh {
  const s = String(v ?? '').toUpperCase().trim();
  if ((KHUNG_HINH as readonly string[]).includes(s)) return s as KhungHinh;
  if (/SCREEN|MAN.?HINH|MÀN/.test(s)) return 'SCREEN';
  if (/CLOSE|CẬN|CAN/.test(s)) return 'CLOSEUP';
  if (/WIDE|TOÀN|TOAN/.test(s)) return 'WIDE';
  return 'MEDIUM';
}

/**
 * Đưa JSON thô của model về `GoiQuay` an toàn: mọi trường có kiểu đúng, thời
 * lượng cảnh thiếu thì tính từ số từ, cảnh rỗng bị bỏ. Không còn cảnh nào ⇒ ném.
 */
export function chuanHoaGoi(raw: unknown): GoiQuay {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const canhThô = Array.isArray(o.canh) ? (o.canh as unknown[]) : [];
  const canh: CanhQuay[] = canhThô
    .map((x, i) => {
      const c = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
      const loi = chuoi(c.loi ?? c.loiThoai ?? c.lines, 12_000);
      const giayModel = Number(c.giay ?? c.thoiLuong ?? c.seconds);
      const giayTu = Math.round((demTu(loi) / TU_MOI_PHUT) * 60);
      const giay = Number.isFinite(giayModel) && giayModel > 0
        ? Math.round(Math.max(giayModel, giayTu * 0.6))
        : Math.max(5, giayTu);
      return {
        ten: chuoi(c.ten ?? c.title, 160) || `Cảnh ${i + 1}`,
        loai: chuanLoaiCanh(c.loai ?? c.type, i, canhThô.length),
        loi,
        manHinh: chuoi(c.manHinh, 1500),
        ma: chuoi(c.ma ?? c.code, 6000),
        gocMay: chuoi(c.gocMay, 300),
        khungHinh: chuanKhungHinh(c.khungHinh),
        broll: chuoi(c.broll, 800),
        chuTrenManHinh: chuoi(c.chuTrenManHinh, 400),
        giay: Math.min(giay, 1800),
        nguon: chuoi(c.nguon, 300),
      };
    })
    .filter((c) => c.loi || c.manHinh || c.ma);

  if (canh.length === 0) throw new Error('AI không soạn được cảnh nào');

  const tl = (o.thietLap && typeof o.thietLap === 'object' ? o.thietLap : {}) as Record<string, unknown>;
  const yt = (o.youtube && typeof o.youtube === 'object' ? o.youtube : {}) as Record<string, unknown>;
  const cauHoi = (Array.isArray(o.cauHoi) ? o.cauHoi : [])
    .map((x) => {
      const q = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
      return { hoi: chuoi(q.hoi, 600), dapAn: chuoi(q.dapAn, 600) };
    })
    .filter((q) => q.hoi)
    .slice(0, 10);
  const canBoSung = dsChuoi(o.canBoSung, 20, 400);

  return {
    tieuDe: dsChuoi(o.tieuDe, 8, 120),
    chuThumbnail: dsChuoi(o.chuThumbnail, 8, 60),
    tomTat: chuoi(o.tomTat, 1200),
    mucTieu: dsChuoi(o.mucTieu, 8, 300),
    chuanBi: dsChuoi(o.chuanBi, 15, 300),
    thietLap: {
      boCuc: chuoi(tl.boCuc, 400),
      anhSang: chuoi(tl.anhSang, 400),
      amThanh: chuoi(tl.amThanh, 400),
      manHinh: chuoi(tl.manHinh, 400),
    },
    canh,
    cauHoi,
    youtube: {
      moTa: chuoi(yt.moTa, 4000),
      the: dsChuoi(yt.the, 20, 40).map((t) => t.replace(/^#/, '')),
    },
    canBoSung,
    doDay: o.doDay === 'mong' || canBoSung.length > 0 ? 'mong' : 'du',
  };
}

export function tongGiay(goi: GoiQuay): number {
  return goi.canh.reduce((s, c) => s + c.giay, 0);
}

// ─── Gói → kịch bản / cảnh / YouTube ─────────────────────────────────────────

const NHAN = {
  VI: {
    hook: 'Hook', intro: 'Giới thiệu', body: 'Giảng', demo: 'Demo', mistake: 'Lỗi thường gặp',
    recap: 'Tóm tắt', quiz: 'Câu hỏi nhanh', cta: 'Kêu gọi', outro: 'Kết',
    mucTieu: 'Mục tiêu', chuanBi: 'Chuẩn bị', thietLap: 'Thiết lập', boCuc: 'Bố cục', anhSang: 'Ánh sáng',
    amThanh: 'Âm thanh', manHinh: 'Màn hình', chu: 'Chữ trên màn hình', ma: 'Code trên màn hình',
    nguon: 'Nguồn trong bài', canBoSung: 'CẦN BỔ SUNG trước khi quay', cauHoi: 'Câu hỏi + đáp án',
    goiQuay: 'GÓI QUAY AI', dapAn: 'Đáp án',
  },
  EN: {
    hook: 'Hook', intro: 'Intro', body: 'Teach', demo: 'Demo', mistake: 'Common mistakes',
    recap: 'Recap', quiz: 'Quick check', cta: 'Call to action', outro: 'Outro',
    mucTieu: 'Objectives', chuanBi: 'Prep', thietLap: 'Setup', boCuc: 'Framing', anhSang: 'Lighting',
    amThanh: 'Audio', manHinh: 'Screen', chu: 'On-screen text', ma: 'Code on screen',
    nguon: 'Source in lesson', canBoSung: 'FILL IN before filming', cauHoi: 'Questions + answers',
    goiQuay: 'AI SHOOTING PACKAGE', dapAn: 'Answer',
  },
} as const;

const KHUNG_NHAN: Record<NgonNguQuay, Record<KhungHinh, string>> = {
  VI: { CLOSEUP: 'Cận cảnh', MEDIUM: 'Trung cảnh', WIDE: 'Toàn cảnh', POV: 'Góc nhìn thứ nhất', OVERHEAD: 'Từ trên xuống', SCREEN: 'Quay màn hình' },
  EN: { CLOSEUP: 'Close-up', MEDIUM: 'Medium shot', WIDE: 'Wide shot', POV: 'POV', OVERHEAD: 'Overhead', SCREEN: 'Screen recording' },
};

function nhanLoai(loai: LoaiCanh, lang: NgonNguQuay): string {
  const n = NHAN[lang];
  return ({ HOOK: n.hook, INTRO: n.intro, BODY: n.body, DEMO: n.demo, MISTAKE: n.mistake, RECAP: n.recap, QUIZ: n.quiz, CTA: n.cta, OUTRO: n.outro } as const)[loai];
}

/**
 * Gói → kịch bản markdown cho tab Kịch bản / Teleprompter.
 * Mỗi cảnh là một mục `##` (đúng luật `parseOutline`), chỉ dẫn quay nằm trong
 * chú thích — máy nhắc chỉ chạy lời thoại.
 */
export function kichBanTuGoi(goi: GoiQuay, opts: { lang: NgonNguQuay; nguon?: string }): string {
  const n = NHAN[opts.lang];
  const k = KHUNG_NHAN[opts.lang];
  const ra: string[] = [];
  const dau: string[] = [`🎬 ${n.goiQuay}${opts.nguon ? ` · ${opts.nguon}` : ''}`];
  if (goi.canBoSung.length) dau.push(`⚠️ ${n.canBoSung}:\n${goi.canBoSung.map((x) => `  - ${x}`).join('\n')}`);
  if (goi.mucTieu.length) dau.push(`🎯 ${n.mucTieu}:\n${goi.mucTieu.map((x) => `  - ${x}`).join('\n')}`);
  if (goi.chuanBi.length) dau.push(`🧰 ${n.chuanBi}:\n${goi.chuanBi.map((x) => `  - ${x}`).join('\n')}`);
  const tl = goi.thietLap;
  const dongTl = [
    tl.boCuc && `${n.boCuc}: ${tl.boCuc}`,
    tl.anhSang && `${n.anhSang}: ${tl.anhSang}`,
    tl.amThanh && `${n.amThanh}: ${tl.amThanh}`,
    tl.manHinh && `${n.manHinh}: ${tl.manHinh}`,
  ].filter(Boolean);
  if (dongTl.length) dau.push(`📐 ${n.thietLap}:\n${dongTl.map((x) => `  - ${x}`).join('\n')}`);
  ra.push(`<!--\n${anToanChuThich(dau.join('\n\n'))}\n-->`);

  let t = 0;
  goi.canh.forEach((c, i) => {
    const tu = t;
    t += c.giay;
    ra.push('');
    ra.push(`## ${i + 1} · ${nhanLoai(c.loai, opts.lang)} — ${c.ten} (${mocGio(tu)}–${mocGio(t)})`);
    const chiDan = [
      `🎥 ${k[c.khungHinh]}${c.gocMay ? ` · ${c.gocMay}` : ''}`,
      c.manHinh && `🖥 ${n.manHinh}: ${c.manHinh}`,
      c.chuTrenManHinh && `🔤 ${n.chu}: ${c.chuTrenManHinh}`,
      c.broll && `🎞 B-roll: ${c.broll}`,
      c.nguon && `📚 ${n.nguon}: ${c.nguon}`,
    ].filter(Boolean) as string[];
    ra.push(`<!-- ${anToanChuThich(chiDan.join('\n'))} -->`);
    if (c.ma) ra.push(`<!-- 💻 ${n.ma}:\n${anToanChuThich(c.ma)}\n-->`);
    ra.push(c.loi || '…');
  });

  if (goi.cauHoi.length) {
    ra.push('');
    ra.push(`<!-- ❓ ${n.cauHoi}:\n${anToanChuThich(goi.cauHoi.map((q, i) => `${i + 1}. ${q.hoi}\n   → ${n.dapAn}: ${q.dapAn}`).join('\n'))}\n-->`);
  }
  return ra.join('\n').trim() + '\n';
}

export type SceneTypeKey = 'OPENING' | 'HOOK' | 'INTRO' | 'BODY' | 'BROLL' | 'CTA' | 'OUTRO';
export type ShotTypeKey = 'CLOSEUP' | 'MEDIUM' | 'WIDE' | 'POV' | 'OVERHEAD';

export interface CanhDb {
  sceneNumber: number;
  sceneType: SceneTypeKey;
  dialogue: string | null;
  voiceover: string | null;
  action: string | null;
  cameraAngle: string | null;
  shotType: ShotTypeKey | null;
  props: string | null;
  brollNotes: string | null;
  editingNotes: string | null;
  durationSeconds: number | null;
  storyboardImageUrl: null;
  order: number;
}

/** Gói → các dòng `Scene` cho tab Phân cảnh / Danh sách cảnh quay. */
export function canhTuGoi(goi: GoiQuay, lang: NgonNguQuay): CanhDb[] {
  const n = NHAN[lang];
  return goi.canh.map((c, i) => {
    const type: SceneTypeKey = c.loai === 'HOOK' ? 'HOOK'
      : c.loai === 'INTRO' ? 'INTRO'
        : c.loai === 'CTA' ? 'CTA'
          : c.loai === 'OUTRO' ? 'OUTRO'
            : 'BODY';
    const manHinh = c.khungHinh === 'SCREEN';
    const ghiChu = [
      c.chuTrenManHinh && `${n.chu}: ${c.chuTrenManHinh}`,
      c.ma && `${n.ma}:\n${c.ma}`,
      c.nguon && `${n.nguon}: ${c.nguon}`,
    ].filter(Boolean).join('\n\n');
    return {
      sceneNumber: i + 1,
      sceneType: type,
      dialogue: manHinh ? null : (c.loi || null),
      voiceover: manHinh ? (c.loi || null) : null,
      action: [c.ten, c.manHinh && `${n.manHinh}: ${c.manHinh}`].filter(Boolean).join(' — ') || null,
      cameraAngle: (c.gocMay || KHUNG_NHAN[lang][c.khungHinh]).slice(0, 200),
      shotType: manHinh ? null : (c.khungHinh as ShotTypeKey),
      props: null,
      brollNotes: c.broll || null,
      editingNotes: ghiChu || null,
      durationSeconds: c.giay,
      storyboardImageUrl: null,
      order: i,
    };
  });
}

/**
 * Mốc chương YouTube tính từ thời lượng cảnh. Luật YouTube: mốc đầu 0:00, mỗi
 * chương ≥ 10 giây — cảnh ngắn hơn gộp vào chương trước.
 */
export function chuongYoutube(goi: GoiQuay, lang: NgonNguQuay): Array<{ moc: string; ten: string }> {
  const ra: Array<{ batDau: number; ten: string; dai: number }> = [];
  const moDauLaHook = goi.canh[0]?.loai === 'HOOK';
  let t = 0;
  for (const c of goi.canh) {
    const cuoi = ra[ra.length - 1];
    if (!cuoi) {
      ra.push({ batDau: t, ten: c.loai === 'HOOK' ? nhanLoai('INTRO', lang) : c.ten, dai: c.giay });
    } else if (cuoi.dai < 10 || c.giay < 10 || (ra.length === 1 && moDauLaHook && c.loai === 'INTRO')) {
      // Hook + giới thiệu là MỘT chương "Giới thiệu"; chương < 10s gộp vào chương trước.
      cuoi.dai += c.giay;
    } else {
      ra.push({ batDau: t, ten: c.ten, dai: c.giay });
    }
    t += c.giay;
  }
  return ra.map((c) => ({ moc: mocGio(c.batDau), ten: c.ten }));
}

/** Chú thích YouTube = mô tả + mốc chương + hashtag. */
export function moTaYoutube(goi: GoiQuay, lang: NgonNguQuay): string {
  const chuong = chuongYoutube(goi, lang);
  const phan = [goi.youtube.moTa];
  if (chuong.length >= 3) phan.push(chuong.map((c) => `${c.moc} ${c.ten}`).join('\n'));
  if (goi.youtube.the.length) phan.push(goi.youtube.the.slice(0, 8).map((x) => `#${x.replace(/\s+/g, '')}`).join(' '));
  return phan.filter(Boolean).join('\n\n');
}

// ─── Lời dặn hệ thống ────────────────────────────────────────────────────────

const MAU_JSON = `{
  "tieuDe": ["3–5 tiêu đề video, ≤ 70 ký tự, cụ thể, có từ khoá chính"],
  "chuThumbnail": ["3–5 dòng chữ thumbnail, 2–5 từ, đọc được trong 1 giây"],
  "tomTat": "1–2 câu: video này dạy/kể gì, cho ai",
  "mucTieu": ["Sau video người xem làm được … (bắt đầu bằng động từ)"],
  "chuanBi": ["Thứ cần mở/sẵn sàng trước khi bấm máy: slide nào, file code nào, trang web nào, đạo cụ"],
  "thietLap": {
    "boCuc": "vị trí người trong khung, khoảng cách máy, chỗ chừa cho slide/code",
    "anhSang": "đèn chính/phụ/viền, hướng, nhiệt độ màu",
    "amThanh": "mic, khoảng cách, lưu ý tiếng ồn",
    "manHinh": "độ phân giải quay màn hình, cỡ chữ editor/terminal, theme, ẩn thông báo"
  },
  "canh": [
    {
      "ten": "tên ngắn của cảnh",
      "loai": "HOOK | INTRO | BODY | DEMO | MISTAKE | RECAP | QUIZ | CTA | OUTRO",
      "loi": "LỜI THOẠI ĐỌC NGUYÊN VĂN — văn nói, câu ngắn, không markdown",
      "manHinh": "đang chiếu gì: slide/hình/sơ đồ/terminal/trình duyệt — nói rõ nội dung",
      "ma": "đoạn code hiện trên màn hình (chỉ khi cảnh có code; chép đúng từ nguồn), không thì \\"\\"",
      "gocMay": "chỉ dẫn quay cụ thể: cỡ cảnh, góc, chuyển động, ánh mắt, tay",
      "khungHinh": "CLOSEUP | MEDIUM | WIDE | POV | OVERHEAD | SCREEN",
      "broll": "cảnh chèn gợi ý (hoặc \\"\\")",
      "chuTrenManHinh": "chữ/tiêu đề phụ hiện lên (≤ 8 từ) hoặc \\"\\"",
      "giay": 45,
      "nguon": "dựa vào phần nào của nguồn (tên mục/ý)"
    }
  ],
  "cauHoi": [{ "hoi": "câu hỏi kiểm tra nhanh", "dapAn": "đáp án + giải thích 1 câu" }],
  "youtube": { "moTa": "mô tả YouTube 3–6 câu, có từ khoá, KHÔNG ghi mốc thời gian (hệ thống tự thêm)", "the": ["10–15 thẻ, không dấu #"] },
  "canBoSung": ["chỗ nguồn thiếu mà video cần — người quay phải tự bổ sung"],
  "doDay": "du | mong"
}`;

const QUY_TAC_CHUNG = `
QUY TẮC VIẾT LỜI THOẠI ("loi")
- Là VĂN NÓI để đọc nguyên văn trước máy: câu ngắn (thường ≤ 20 từ), nhịp tự nhiên, có câu hỏi tu từ, có chuyển ý ("Vậy thì…", "Giờ mình thử…").
- Không markdown, không gạch đầu dòng, không emoji, không đọc ký hiệu code từng ký tự — nói ý nghĩa của code.
- Câu đầu tiên của video KHÔNG chào hỏi ("Xin chào các bạn, hôm nay…" bị cấm). Vào thẳng vấn đề.
- Hook (10–20 giây đầu): một câu hỏi, một nghịch lý, một lỗi thật hay một kết quả bất ngờ — rút từ chính nội dung — cho người xem lý do ở lại.
- Thuật ngữ tiếng Anh giữ nguyên; lần đầu nhắc thì giải nghĩa ngắn gọn.
- Đổi khung hình/màn hình mỗi 30–60 giây để giữ nhịp; cảnh dài thì tách.

QUY TẮC CHỈ DẪN QUAY
- "gocMay" phải làm được ngay: ví dụ "Trung cảnh ngang ngực, máy ngang tầm mắt, người lệch trái 1/3 để chừa chỗ chèn slide bên phải, nhìn thẳng ống kính".
- Cảnh quay màn hình dùng khungHinh "SCREEN" và nói rõ phóng to vùng nào, con trỏ chỉ vào đâu.
- "giay" ≈ số từ của "loi" ÷ 150 × 60, cộng thời gian thao tác/đợi chạy code nếu có.
- Tổng thời lượng các cảnh xấp xỉ thời lượng mục tiêu (lệch ≤ 15%).

ĐẦU RA
- Trả về MỘT đối tượng JSON hợp lệ, đúng mẫu dưới đây, không thêm chữ nào ngoài JSON, không bọc trong \`\`\`.
- Mẫu:
${MAU_JSON}`;

function dongNgonNgu(lang: NgonNguQuay): string {
  return lang === 'EN'
    ? 'NGÔN NGỮ VIDEO: TIẾNG ANH. Viết "loi", "chuTrenManHinh", "tieuDe", "chuThumbnail", "youtube" bằng tiếng Anh tự nhiên (giọng giảng viên, rõ ràng, không học thuật khô). Các trường chỉ dẫn quay ("gocMay", "manHinh", "broll", "chuanBi", "thietLap", "canBoSung", "nguon") viết bằng TIẾNG VIỆT cho người quay đọc.'
    : 'NGÔN NGỮ VIDEO: TIẾNG VIỆT. Xưng "mình" – gọi "bạn", giọng thân thiện như anh/chị khoá trên giảng lại cho đàn em, chuyên nghiệp, không sến.';
}

/** Lời dặn hệ thống cho gói quay BÀI GIẢNG — bám nội dung khoá học thật. */
export function heThongGoiBaiGiang(lang: NgonNguQuay): string {
  return `Bạn là biên kịch kiêm đạo diễn video giáo dục chuyên nghiệp (chuẩn kênh YouTube giáo dục hàng đầu), đồng thời là giảng viên dạy chính môn học này. Nhiệm vụ: biến NỘI DUNG BÀI HỌC THẬT do người dùng cung cấp thành một GÓI QUAY hoàn chỉnh — người dạy chỉ việc đặt máy, mở đúng màn hình và đọc lời thoại.

NGUYÊN TẮC SỐ 1 — BÁM ĐÚNG NGUỒN
- Mọi định nghĩa, công thức, con số, tên thuật toán, câu lệnh, đoạn code, ví dụ phải lấy từ phần "NỘI DUNG BÀI" (và quiz của bài). Được diễn giải cho dễ hiểu, thêm so sánh đời thường, câu chuyển ý — nhưng KHÔNG thêm kiến thức, số liệu, tên phiên bản, sự kiện mà nguồn không có.
- Giữ ĐÚNG thứ tự logic của bài. Phủ HẾT các ý chính của bài — không bỏ phần khó, không giảng hời hợt; đi sâu như một buổi dạy thật: vì sao, cách hoạt động, ví dụ từng bước, lỗi hay gặp, mẹo nhớ.
- Code trong "ma" chép đúng từ bài (có thể rút gọn phần lặp, ghi "// …"). Bài có ví dụ chạy được thì phải có cảnh DEMO đi qua từng bước và nói kết quả mong đợi.
- Nối mạch: nhắc ngắn bài trước (nếu có) ở phần giới thiệu, và giới thiệu bài sau ở CTA/kết.
- Nguồn mỏng hoặc thiếu thứ video cần (không có ví dụ, không có code, chỉ có tiêu đề…): vẫn soạn khung đầy đủ, nhưng viết "[CẦN BỔ SUNG: …]" ngay trong lời thoại chỗ thiếu, liệt kê vào "canBoSung" và đặt "doDay": "mong". Tuyệt đối không bịa để lấp chỗ trống.
- "cauHoi": ưu tiên lấy từ QUIZ CỦA BÀI (nếu có); không có thì tự đặt câu hỏi kiểm tra đúng nội dung bài.
- Cấu trúc gợi ý: HOOK → INTRO (bài này làm được gì, cần biết gì trước) → các cảnh BODY/DEMO theo từng ý của bài → MISTAKE (nếu bài có/ngầm có) → RECAP → QUIZ → CTA (bài tập + bài sau) → OUTRO.

${dongNgonNgu(lang)}
${QUY_TAC_CHUNG}`;
}

/** Lời dặn hệ thống cho gói quay Ý TƯỞNG TỰ DO (vlog, short, quảng bá…). */
export function heThongGoiYTuong(lang: NgonNguQuay): string {
  return `Bạn là biên kịch kiêm đạo diễn video chuyên nghiệp cho một nhà sáng tạo nội dung công nghệ/giáo dục người Việt (vlog, video ngắn, hướng dẫn, review, quảng bá khoá học). Người dùng chỉ mô tả ý tưởng; bạn biến nó thành GÓI QUAY hoàn chỉnh — người quay chỉ việc đặt máy và nói.

NGUYÊN TẮC
- Bám ý tưởng và góc tiếp cận người dùng chọn. Được sáng tạo về cách kể, nhịp, hình ảnh, ví dụ.
- KHÔNG bịa số liệu, giá, thống kê, trích dẫn, tên người thật. Chỗ cần số liệu/thông tin cụ thể mà người dùng chưa đưa: viết "[CẦN BỔ SUNG: …]" trong lời thoại và liệt kê vào "canBoSung".
- Vlog: có tuyến cảm xúc (mở – vấn đề – hành trình – cao trào – bài học), cảnh quay ngoài trời/đời thường cụ thể, âm thanh hiện trường. Video ngắn (≤ 60 giây): khung dọc 9:16, hook 1–2 giây đầu, mỗi cảnh 2–6 giây, chữ trên màn hình lớn.
- Cấu trúc linh hoạt theo định dạng, nhưng luôn có HOOK đầu và CTA/OUTRO cuối; "cauHoi" có thể rỗng.

${dongNgonNgu(lang)}
${QUY_TAC_CHUNG}`;
}

export interface YeuCauQuay {
  lang: NgonNguQuay;
  /** Thời lượng mục tiêu, phút. */
  phut: number;
  phongCach: PhongCachQuay;
  ghiChu?: string;
}

const PHONG_CACH: Record<PhongCachQuay, string> = {
  truoc_may: 'Giảng TRƯỚC MÁY là chính (người trong khung, chèn slide/hình bên cạnh), chỉ quay màn hình khi demo code.',
  man_hinh: 'QUAY MÀN HÌNH là chính (slide/code/terminal), giọng đọc lồng; người chỉ xuất hiện ở hook, giới thiệu và kết (khung nhỏ hoặc trung cảnh).',
  ket_hop: 'KẾT HỢP: mở/kết và các đoạn giải thích khái niệm quay trước máy; phần chi tiết, sơ đồ, code thì quay màn hình.',
};

export function khoiYeuCau(y: YeuCauQuay): string {
  const tu = Math.round(y.phut * TU_MOI_PHUT);
  return [
    '# YÊU CẦU QUAY',
    `- Ngôn ngữ video: ${y.lang === 'EN' ? 'Tiếng Anh' : 'Tiếng Việt'}`,
    `- Thời lượng mục tiêu: ${y.phut} phút (≈ ${tu} từ lời thoại tổng cộng)`,
    `- Phong cách: ${PHONG_CACH[y.phongCach]}`,
    y.ghiChu?.trim() ? `- Ghi chú của người quay (ưu tiên làm theo): ${y.ghiChu.trim().slice(0, 1500)}` : '',
  ].filter(Boolean).join('\n');
}

/** Thời lượng gợi ý (phút) theo độ dài nội dung nguồn — dùng khi người quay để "Tự động". */
export function phutGoiY(soKyTuNguon: number): number {
  if (soKyTuNguon < 1500) return 5;
  if (soKyTuNguon < 4000) return 8;
  if (soKyTuNguon < 9000) return 12;
  if (soKyTuNguon < 16000) return 15;
  return 20;
}

/** Trần token ra cho gói quay — tính theo thời lượng (GPT tính cả token suy luận). */
export function maxTokenGoi(phut: number): number {
  return Math.min(32_000, Math.max(10_000, Math.round(phut * 1400) + 6000));
}

// ─── Việc nhỏ trong dự án ────────────────────────────────────────────────────

export function heThongViecNho(lang: NgonNguQuay): string {
  return `Bạn là biên kịch video chuyên nghiệp cho một nhà sáng tạo nội dung giáo dục/công nghệ người Việt. Viết sắc, cụ thể, không sáo rỗng, không bịa số liệu. ${lang === 'EN' ? 'Nội dung hướng tới khán giả xem video bằng TIẾNG ANH — viết phần người xem thấy/nghe bằng tiếng Anh.' : 'Viết bằng tiếng Việt tự nhiên.'} Chỉ trả về JSON hợp lệ đúng mẫu được yêu cầu, không thêm chữ nào khác (trừ khi được yêu cầu trả văn bản thường).`;
}

export function deGocYTuong(p: { moTa: string; dinhDang: string; nenTang: string; phut: number; giongDieu?: string; lang: NgonNguQuay }): string {
  return `Ý TƯỞNG CỦA NGƯỜI DÙNG:
"""${p.moTa.slice(0, 4000)}"""

Định dạng mong muốn: ${p.dinhDang}. Nền tảng: ${p.nenTang}. Thời lượng: khoảng ${p.phut} phút.${p.giongDieu ? ` Giọng điệu: ${p.giongDieu}.` : ''}

Đề xuất 5 GÓC TIẾP CẬN khác hẳn nhau cho ý tưởng này (khác về câu chuyện/cấu trúc/cảm xúc, không chỉ khác tiêu đề). Mỗi góc phải quay được bởi một người với máy ảnh/điện thoại + máy tính.
Trả về JSON:
{"goc":[{"tieuDe":"tiêu đề video ≤ 70 ký tự","goc":"góc tiếp cận trong 1–2 câu","hook":"câu mở đầu nguyên văn (≤ 25 từ)","cauTruc":["3–6 nhịp chính của video"],"viSao":"vì sao góc này giữ chân người xem","doKho":"dễ | vừa | khó (công sức quay dựng)"}]}`;
}

export function deGoiYTuong(p: {
  moTa: string; dinhDang: string; nenTang: string; goc?: { tieuDe?: string; goc?: string; hook?: string; cauTruc?: string[] } | null;
  yeuCau: YeuCauQuay;
}): string {
  const g = p.goc;
  return [
    'Ý TƯỞNG CỦA NGƯỜI DÙNG:',
    `"""${p.moTa.slice(0, 6000)}"""`,
    `Định dạng: ${p.dinhDang}. Nền tảng chính: ${p.nenTang}.`,
    g ? `GÓC TIẾP CẬN ĐÃ CHỌN: ${[g.tieuDe, g.goc, g.hook && `Hook gợi ý: ${g.hook}`, g.cauTruc?.length ? `Nhịp: ${g.cauTruc.join(' → ')}` : ''].filter(Boolean).join(' · ')}` : '',
    '',
    khoiYeuCau(p.yeuCau),
    '',
    'Soạn GÓI QUAY hoàn chỉnh theo đúng mẫu JSON.',
  ].filter((x) => x !== '').join('\n');
}

export interface BoiCanhDuAn {
  tieuDe: string;
  khaiNiem?: string | null;
  kichBan?: string | null;
  khoaHoc?: string | null;
  bai?: string | null;
  loai?: string | null;
}

function khoiDuAn(d: BoiCanhDuAn, tranKichBan = 24_000): string {
  return [
    `Video: ${d.tieuDe}`,
    d.loai ? `Loại: ${d.loai}` : '',
    d.khoaHoc ? `Khoá học: ${d.khoaHoc}${d.bai ? ` · ${d.bai}` : ''}` : '',
    d.khaiNiem ? `Khái niệm: ${d.khaiNiem.slice(0, 1500)}` : '',
    d.kichBan ? `KỊCH BẢN HIỆN TẠI (chú thích <!-- --> là chỉ dẫn quay, không phải lời thoại):\n"""${d.kichBan.slice(0, tranKichBan)}"""` : '(chưa có kịch bản)',
  ].filter(Boolean).join('\n');
}

export function deHook(d: BoiCanhDuAn): string {
  return `${khoiDuAn(d, 12_000)}

Viết 8 câu HOOK mở đầu (10–20 giây đầu video) khác kiểu nhau: câu hỏi gây tò mò, nghịch lý, lỗi thật người xem hay mắc, kết quả trước – cách làm sau, chuyện kể 1 câu, so sánh bất ngờ, thách thức, lời hứa cụ thể. Hook phải đúng nội dung video, không hứa điều video không có.
Trả về JSON: {"hooks":[{"kieu":"tên kiểu","loi":"lời thoại nguyên văn ≤ 40 từ","chuTrenManHinh":"≤ 6 từ","gocMay":"chỉ dẫn quay ngắn"}]}`;
}

export function deTieuDe(d: BoiCanhDuAn): string {
  return `${khoiDuAn(d, 12_000)}

Viết cho video này:
- 8 tiêu đề YouTube (≤ 70 ký tự, có từ khoá chính ở đầu, cụ thể, không giật tít sai sự thật),
- 6 dòng chữ thumbnail (2–5 từ, đọc được trong 1 giây, bổ sung chứ không lặp tiêu đề),
- mô tả YouTube 4–7 câu (đoạn đầu chứa từ khoá; không ghi mốc thời gian),
- 12–15 thẻ.
Trả về JSON: {"tieuDe":["…"],"thumbnail":["…"],"moTa":"…","the":["…"]}`;
}

export function deShorts(d: BoiCanhDuAn, lang: NgonNguQuay): string {
  return `${khoiDuAn(d, 30_000)}

Cắt từ video dài này ra 3 video NGẮN dọc 9:16 (YouTube Shorts/TikTok/Reels), mỗi video 30–55 giây (≤ 140 từ lời thoại), đứng độc lập được (người xem chưa xem bản dài vẫn hiểu), hook trong 2 giây đầu, kết bằng lời mời xem bản đầy đủ. Chỉ dùng nội dung CÓ trong kịch bản.${lang === 'EN' ? ' Lời thoại bằng tiếng Anh.' : ''}
Trả về JSON: {"shorts":[{"tieuDe":"≤ 60 ký tự","hook":"câu đầu nguyên văn","loi":"toàn bộ lời thoại nguyên văn, văn nói","chuTrenManHinh":["các dòng chữ lớn theo thứ tự"],"canhQuay":"cách quay/cắt dựng ngắn gọn (khung dọc, cận mặt, chèn màn hình…)","giay":45,"lyDo":"vì sao đoạn này hợp làm Shorts"}]}`;
}

export const YEU_CAU_VIET_LAI: Record<string, string> = {
  ngan: 'Rút gọn còn khoảng 60% độ dài, giữ đủ ý chính và mọi thuật ngữ quan trọng.',
  dai: 'Mở rộng và đi sâu hơn khoảng 1,5 lần: thêm giải thích "vì sao", một ví dụ từng bước, một lỗi hay gặp — chỉ dùng kiến thức chuẩn, không bịa số liệu.',
  tu_nhien: 'Viết lại cho tự nhiên như đang nói chuyện trước máy: câu ngắn, nhịp rõ, bỏ từ sách vở.',
  nang_luong: 'Viết lại năng lượng hơn, nhiều nhịp nhấn, câu hỏi tu từ, nhưng vẫn chuyên nghiệp.',
  vi_du: 'Thêm một ví dụ đời thường hoặc phép so sánh dễ nhớ để minh hoạ ý chính.',
  dich_en: 'Dịch sang tiếng Anh tự nhiên (giọng giảng viên), giữ nguyên cấu trúc và chú thích.',
  dich_vi: 'Dịch sang tiếng Việt tự nhiên (giọng giảng viên), giữ nguyên thuật ngữ tiếng Anh cần thiết và chú thích.',
};

export function deVietLai(p: { doan: string; yeuCau: string; boiCanh?: BoiCanhDuAn | null }): string {
  const yc = YEU_CAU_VIET_LAI[p.yeuCau] ?? p.yeuCau;
  return [
    p.boiCanh ? `BỐI CẢNH:\n${khoiDuAn({ ...p.boiCanh, kichBan: null })}` : '',
    'ĐOẠN KỊCH BẢN CẦN VIẾT LẠI (dòng tiêu đề "##" và các chú thích <!-- --> là chỉ dẫn quay — giữ nguyên trừ khi yêu cầu bắt buộc phải đổi):',
    `"""${p.doan.slice(0, 16_000)}"""`,
    `YÊU CẦU: ${yc.slice(0, 1500)}`,
    'Trả về ĐÚNG đoạn đã viết lại dạng văn bản thường (giữ định dạng ## và <!-- --> như bản gốc), không giải thích, không bọc trong ```.',
  ].filter(Boolean).join('\n\n');
}
