/**
 * CT Language — BÀI HỌC AI THEO CHỦ ĐỀ, phần THUẦN (Đợt E, 14/11/2026). Không CSDL, không mạng.
 *   · trình độ theo ngôn ngữ, danh mục BÀI GỢI Ý (≥ 30 chủ đề mỗi ngôn ngữ),
 *   · lời nhắc model (`nhacBaiAi`) — ép MỘT đối tượng JSON,
 *   · `kiemBaiAi` — kiểm + làm sạch từng trường; thiếu phần cốt lõi ⇒ null (không lưu, không trừ lượt).
 *   npx tsx --test src/services/ctlanguage/baiAiThuan.test.ts
 */
import { romaji } from './tuDienChuan.js';

export type NnBai = 'en' | 'ja' | 'zh';

export const TRINH_DO: Record<NnBai, { ma: string; nhan: string; moTa: string }[]> = {
  zh: [
    { ma: 'hsk1', nhan: 'HSK 1', moTa: 'câu rất ngắn, ~150 từ cơ bản' }, { ma: 'hsk2', nhan: 'HSK 2', moTa: 'giao tiếp đơn giản hằng ngày' },
    { ma: 'hsk3', nhan: 'HSK 3', moTa: 'đời sống, học tập, công việc cơ bản' }, { ma: 'hsk4', nhan: 'HSK 4', moTa: 'bàn luận nhiều chủ đề, câu phức' },
    { ma: 'hsk5', nhan: 'HSK 5', moTa: 'đọc báo, xem phim, diễn đạt trôi chảy' }, { ma: 'hsk6', nhan: 'HSK 6', moTa: 'gần như người bản xứ' },
  ],
  ja: [
    { ma: 'n5', nhan: 'N5', moTa: 'です/ます, câu ngắn, kana + kanji cơ bản' }, { ma: 'n4', nhan: 'N4', moTa: 'thể て, thể thường, đời sống hằng ngày' },
    { ma: 'n3', nhan: 'N3', moTa: 'kính ngữ cơ bản, công việc làm thêm' }, { ma: 'n2', nhan: 'N2', moTa: 'công sở, văn bản, kính ngữ đầy đủ' },
    { ma: 'n1', nhan: 'N1', moTa: 'trình độ cao, sắc thái tinh tế' },
  ],
  en: [
    { ma: 'a1', nhan: 'A1', moTa: 'mới bắt đầu' }, { ma: 'a2', nhan: 'A2', moTa: 'sơ cấp · IELTS ~3.5' },
    { ma: 'b1', nhan: 'B1', moTa: 'trung cấp · IELTS 4.0–5.0' }, { ma: 'b2', nhan: 'B2', moTa: 'trung cao · IELTS 5.5–6.5' },
    { ma: 'c1', nhan: 'C1', moTa: 'cao cấp · IELTS 7.0–8.0' },
  ],
};

export function docTrinhDo(nn: NnBai, v: unknown): string | null {
  const s = String(v ?? '').toLowerCase().replace(/\s+/g, '');
  return TRINH_DO[nn].find((t) => t.ma === s)?.ma ?? null;
}
export const nhanTrinhDo = (nn: NnBai, ma: string) => TRINH_DO[nn].find((t) => t.ma === ma)?.nhan ?? ma.toUpperCase();

// ─── Bài gợi ý (sinh MỘT lần, dùng chung) ───────────────────────────────────────────────────────────────────────
export interface GoiY { ma: string; ten: string; trinhDo: string; nhom: string; bieuTuong: string }

const g = (ma: string, ten: string, trinhDo: string, nhom: string, bieuTuong: string): GoiY => ({ ma, ten, trinhDo, nhom, bieuTuong });
const DS = 'Đời sống', DL = 'Du lịch', CV = 'Công việc', TH = 'Học tập', VH = 'Văn hoá';

export const GOI_Y: Record<NnBai, GoiY[]> = {
  zh: [
    g('lam-quen', 'Chào hỏi và tự giới thiệu', 'hsk1', DS, 'hand.wave.fill'), g('goi-mon', 'Gọi món ở quán ăn', 'hsk1', DS, 'fork.knife'),
    g('ban-moi', 'Làm quen bạn mới ở lớp', 'hsk1', TH, 'person.2.fill'), g('tra-sua', 'Mua trà sữa', 'hsk2', DS, 'cup.and.saucer.fill'),
    g('mac-ca', 'Mặc cả ở chợ', 'hsk2', DS, 'cart.fill'), g('hoi-duong', 'Hỏi đường', 'hsk2', DL, 'map.fill'),
    g('taxi', 'Đi taxi', 'hsk2', DL, 'car.fill'), g('sinh-nhat', 'Mời bạn dự sinh nhật', 'hsk2', DS, 'gift.fill'),
    g('thoi-tiet', 'Nói chuyện thời tiết', 'hsk2', DS, 'cloud.sun.fill'), g('so-thich', 'Kể về sở thích', 'hsk2', DS, 'music.note'),
    g('sieu-thi', 'Đi siêu thị', 'hsk2', DS, 'basket.fill'), g('xem-phim', 'Rủ bạn đi xem phim', 'hsk2', DS, 'film.fill'),
    g('tau-cao-toc', 'Mua vé tàu cao tốc', 'hsk3', DL, 'tram.fill'), g('khach-san', 'Nhận phòng khách sạn', 'hsk3', DL, 'bed.double.fill'),
    g('kham-benh', 'Đi khám bệnh', 'hsk3', DS, 'cross.case.fill'), g('phong-van-xuong', 'Phỏng vấn ở công xưởng', 'hsk3', CV, 'building.2.fill'),
    g('ngay-dau-di-lam', 'Ngày đầu đi làm', 'hsk3', CV, 'briefcase.fill'), g('xin-nghi-phep', 'Xin nghỉ phép', 'hsk3', CV, 'calendar.badge.minus'),
    g('thanh-toan', 'Thanh toán bằng WeChat / Alipay', 'hsk3', DS, 'qrcode'), g('thu-vien', 'Mượn sách ở thư viện', 'hsk3', TH, 'books.vertical.fill'),
    g('dat-ban', 'Gọi điện đặt bàn nhà hàng', 'hsk3', DS, 'phone.fill'), g('tet', 'Chúc Tết Nguyên Đán', 'hsk3', VH, 'sparkles'),
    g('giao-do-an', 'Đặt đồ ăn giao tận nơi', 'hsk3', DS, 'bicycle'), g('tap-gym', 'Đăng ký tập gym', 'hsk3', DS, 'figure.run'),
    g('gui-buu-kien', 'Gửi bưu kiện', 'hsk3', DS, 'shippingbox.fill'), g('san-bay', 'Làm thủ tục ở sân bay', 'hsk3', DL, 'airplane'),
    g('thue-nha', 'Thuê nhà', 'hsk4', DS, 'house.fill'), g('ngan-hang', 'Mở tài khoản ngân hàng', 'hsk4', DS, 'banknote.fill'),
    g('du-hoc', 'Phỏng vấn du học', 'hsk4', TH, 'graduationcap.fill'), g('hop-nhom', 'Họp nhóm ở công ty', 'hsk4', CV, 'person.3.fill'),
    g('bao-mat-do', 'Báo mất đồ', 'hsk4', DS, 'exclamationmark.bubble.fill'), g('khieu-nai', 'Khiếu nại dịch vụ', 'hsk4', DS, 'hand.raised.fill'),
  ],
  ja: [
    g('lam-quen', 'Chào hỏi và tự giới thiệu', 'n5', DS, 'hand.wave.fill'), g('konbini', 'Mua đồ ở konbini', 'n5', DS, 'cart.fill'),
    g('goi-mon', 'Gọi món ở quán Nhật', 'n5', DS, 'fork.knife'), g('hoi-duong', 'Hỏi đường', 'n5', DL, 'map.fill'),
    g('ru-di-choi', 'Rủ bạn đi chơi cuối tuần', 'n5', DS, 'person.2.fill'), g('so-thich', 'Kể về sở thích', 'n5', DS, 'music.note'),
    g('thoi-tiet', 'Nói chuyện thời tiết', 'n5', DS, 'cloud.sun.fill'), g('sieu-thi', 'Đi siêu thị', 'n5', DS, 'basket.fill'),
    g('tau-dien', 'Đi tàu điện và đổi tuyến', 'n4', DL, 'tram.fill'), g('baito', 'Phỏng vấn làm thêm (baito)', 'n4', CV, 'person.badge.clock.fill'),
    g('phong-van-xuong', 'Phỏng vấn ở công xưởng', 'n4', CV, 'building.2.fill'), g('ngay-dau-di-lam', 'Ngày đầu đi làm ở Nhật', 'n4', CV, 'briefcase.fill'),
    g('kham-benh', 'Đi khám bệnh', 'n4', DS, 'cross.case.fill'), g('phan-loai-rac', 'Phân loại rác', 'n4', DS, 'trash.fill'),
    g('khach-san', 'Nhận phòng khách sạn', 'n4', DL, 'bed.double.fill'), g('onsen', 'Đi tắm suối nước nóng (onsen)', 'n4', VH, 'drop.fill'),
    g('mua-quan-ao', 'Mua quần áo', 'n4', DS, 'tshirt.fill'), g('sim-dien-thoai', 'Mua SIM điện thoại', 'n4', DS, 'simcard.fill'),
    g('buu-dien', 'Gửi đồ ở bưu điện', 'n4', DS, 'shippingbox.fill'), g('oshogatsu', 'Năm mới ở Nhật (oshōgatsu)', 'n4', VH, 'sparkles'),
    g('koban', 'Báo mất đồ ở đồn cảnh sát (kōban)', 'n4', DS, 'exclamationmark.bubble.fill'), g('xin-loi-di-muon', 'Xin lỗi khi đi muộn', 'n4', CV, 'clock.badge.exclamationmark.fill'),
    g('hanami', 'Đi ngắm hoa anh đào (hanami)', 'n4', VH, 'leaf.fill'), g('nhau-dong-nghiep', 'Đi ăn uống với đồng nghiệp', 'n4', CV, 'wineglass.fill'),
    g('thue-nha', 'Thuê nhà ở Nhật', 'n3', DS, 'house.fill'), g('ngan-hang', 'Mở tài khoản ngân hàng', 'n3', DS, 'banknote.fill'),
    g('shiyakusho', 'Làm thủ tục ở uỷ ban (shiyakusho)', 'n3', DS, 'building.columns.fill'), g('xin-nghi', 'Xin nghỉ làm', 'n3', CV, 'calendar.badge.minus'),
    g('horenso', 'Báo cáo – liên lạc – trao đổi (hō-ren-sō)', 'n3', CV, 'arrow.triangle.2.circlepath'), g('du-hoc', 'Phỏng vấn du học', 'n3', TH, 'graduationcap.fill'),
    g('nhan-viec', 'Nhận việc và hỏi lại cấp trên', 'n3', CV, 'questionmark.bubble.fill'), g('goi-dien-cong-ty', 'Gọi điện cho công ty bằng kính ngữ', 'n2', CV, 'phone.fill'),
  ],
  en: [
    g('introduce', 'Chào hỏi và tự giới thiệu', 'a1', DS, 'hand.wave.fill'), g('cafe', 'Gọi đồ ở quán cà phê', 'a1', DS, 'cup.and.saucer.fill'),
    g('hobbies', 'Kể về sở thích', 'a1', DS, 'music.note'), g('weather', 'Nói chuyện thời tiết', 'a1', DS, 'cloud.sun.fill'),
    g('directions', 'Hỏi đường', 'a2', DL, 'map.fill'), g('shopping', 'Mua sắm và hỏi giá', 'a2', DS, 'cart.fill'),
    g('hotel', 'Nhận phòng khách sạn', 'a2', DL, 'bed.double.fill'), g('airport', 'Làm thủ tục ở sân bay', 'a2', DL, 'airplane'),
    g('doctor', 'Đi khám bệnh', 'a2', DS, 'cross.case.fill'), g('restaurant', 'Đặt bàn và gọi món ở nhà hàng', 'a2', DS, 'fork.knife'),
    g('small-talk', 'Nói chuyện xã giao', 'a2', DS, 'bubble.left.and.bubble.right.fill'), g('travel-plan', 'Lên kế hoạch du lịch', 'a2', DL, 'suitcase.fill'),
    g('birthday', 'Mời bạn dự sinh nhật', 'a2', DS, 'gift.fill'), g('online-shopping', 'Mua hàng online và đổi trả', 'a2', DS, 'shippingbox.fill'),
    g('lost-item', 'Báo mất đồ', 'a2', DS, 'exclamationmark.bubble.fill'), g('gym', 'Đăng ký tập gym', 'a2', DS, 'figure.run'),
    g('job-interview', 'Phỏng vấn xin việc', 'b1', CV, 'person.crop.rectangle.fill'), g('factory-interview', 'Phỏng vấn ở công xưởng', 'b1', CV, 'building.2.fill'),
    g('first-day', 'Ngày đầu đi làm', 'b1', CV, 'briefcase.fill'), g('meeting', 'Họp nhóm bằng tiếng Anh', 'b1', CV, 'person.3.fill'),
    g('email', 'Viết email công việc', 'b1', CV, 'envelope.fill'), g('complaint', 'Khiếu nại dịch vụ', 'b1', DS, 'hand.raised.fill'),
    g('renting', 'Thuê nhà', 'b1', DS, 'house.fill'), g('bank', 'Mở tài khoản ngân hàng', 'b1', DS, 'banknote.fill'),
    g('phone-call', 'Gọi điện đặt lịch hẹn', 'b1', DS, 'phone.fill'), g('customer-service', 'Chăm sóc khách hàng', 'b1', CV, 'headphones'),
    g('ielts-hometown', 'IELTS Speaking: quê hương', 'b1', TH, 'mic.fill'), g('presentation', 'Thuyết trình trước nhóm', 'b2', CV, 'chart.bar.fill'),
    g('negotiation', 'Đàm phán lương', 'b2', CV, 'dollarsign.circle.fill'), g('ielts-technology', 'IELTS Speaking: công nghệ', 'b2', TH, 'laptopcomputer'),
    g('environment', 'Bàn về môi trường', 'b2', TH, 'leaf.fill'), g('study-abroad', 'Phỏng vấn du học', 'b2', TH, 'graduationcap.fill'),
  ],
};

// ─── Lời nhắc model ──────────────────────────────────────────────────────────────────────────────────────────────
const TEN_NN: Record<NnBai, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung (giản thể)' };
const CACH_DOC: Record<NnBai, { tu: string; cau: string }> = {
  zh: { tu: 'pinyin CÓ DẤU THANH, các âm tiết viết liền theo từ (vd "xuéxí")', cau: 'pinyin có dấu thanh của CẢ câu, tách theo từ' },
  ja: { tu: 'hiragana (từ katakana thì ghi katakana)', cau: 'cả câu bằng hiragana, các cụm từ cách nhau MỘT dấu cách' },
  en: { tu: 'IPA kiểu Anh-Mỹ trong dấu /…/', cau: 'để chuỗi rỗng ""' },
};

export function nhacBaiAi(nn: NnBai, trinhDo: string): string {
  const td = TRINH_DO[nn].find((t) => t.ma === trinhDo)!;
  const doc = CACH_DOC[nn];
  return [
    `Bạn là giáo viên ${TEN_NN[nn]} người Việt, soạn MỘT bài học ngắn theo chủ đề cho app CT Language.`,
    `Trình độ người học: ${td.nhan} (${td.moTa}). Từ vựng, mẫu câu, hội thoại PHẢI vừa trình độ này; giải thích bằng tiếng Việt dễ hiểu.`,
    'Bài gồm: 12 từ vựng then chốt của tình huống · 1 hội thoại mẫu 8–10 câu giữa 2 vai · 4 mẫu câu / điểm ngữ pháp dùng trong hội thoại · 6 câu quiz kiểm tra chính bài này.',
    'TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON, không markdown, không chữ nào ngoài JSON, đúng khuôn:',
    '{"tieuDe":"tên bài tiếng Việt, ≤ 60 ký tự","tieuDeGoc":"tên bài bằng ngôn ngữ đang học","moTa":"1–2 câu tiếng Việt: học xong làm được gì",'
      + `"tuVung":[{"chu":"từ","doc":"${doc.tu}","nghia":"nghĩa tiếng Việt ngắn","loai":"danh từ|động từ|tính từ|cụm từ|…","viDu":"câu ví dụ ngắn","viDuDoc":"${doc.cau}","viDuNghia":"dịch tiếng Việt"}],`
      + `"hoiThoai":{"boiCanh":"bối cảnh 1 câu tiếng Việt","vai":[{"ma":"A","ten":"tên vai tiếng Việt"},{"ma":"B","ten":"…"}],"cau":[{"vai":"A","chu":"câu nói","doc":"${doc.cau}","nghia":"dịch tiếng Việt"}]},`
      + `"mauCau":[{"mau":"mẫu câu / cấu trúc","giaiThich":"cách dùng bằng tiếng Việt, 1–2 câu","viDu":"ví dụ","viDuDoc":"${doc.cau}","viDuNghia":"dịch"}],`
      + '"quiz":[{"hoi":"câu hỏi (tiếng Việt, có thể kèm chữ ngoại ngữ)","luaChon":["A","B","C","D"],"dapAn":0,"giaiThich":"vì sao đúng, tiếng Việt, 1 câu"}],'
      + '"goiYNoi":"một câu tiếng Việt gợi ý người học nên luyện nói gì với chủ đề này"}',
    'Quy tắc: "dapAn" là CHỈ SỐ (0–3) của lựa chọn đúng; 4 lựa chọn khác nhau; trộn vị trí đáp án đúng giữa các câu. Không dùng dấu nháy kép trần trong chuỗi (dùng 「」 hoặc nháy đơn).',
    'Nội dung phải lành mạnh, đúng sự thật, hợp mọi lứa tuổi. Nếu chủ đề người học gõ KHÔNG phù hợp (bạo lực, tình dục, thù ghét, phạm pháp) hoặc không phải chủ đề học ngôn ngữ ⇒ trả {"tuChoi":"một câu tiếng Việt giải thích"}.',
  ].join('\n');
}

// ─── Kiểm output ─────────────────────────────────────────────────────────────────────────────────────────────────
const s = (v: unknown, tran: number) => (typeof v === 'string' ? v : v == null ? '' : String(v)).replace(/\s+/g, ' ').trim().slice(0, tran);
const ds = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)) : []);

export interface TuBai { id?: number; chu: string; doc: string; romaji?: string; hanViet?: string | null; nghia: string; loai: string; viDu: string; viDuDoc: string; viDuRomaji?: string; viDuNghia: string }
export interface CauHoiThoai { vai: string; chu: string; doc: string; romaji?: string; nghia: string }
export interface MauCau { mau: string; giaiThich: string; viDu: string; viDuDoc: string; viDuRomaji?: string; viDuNghia: string }
export interface CauQuiz { hoi: string; luaChon: string[]; dapAn: number; giaiThich: string }
export interface NoiDungBaiAi {
  tieuDe: string; tieuDeGoc: string; moTa: string;
  tuVung: TuBai[];
  hoiThoai: { boiCanh: string; vai: { ma: string; ten: string }[]; cau: CauHoiThoai[] };
  mauCau: MauCau[];
  quiz: CauQuiz[];
  goiYNoi: string;
}

export const TOI_THIEU = { tuVung: 10, cau: 4, mauCau: 3, quiz: 5 } as const;
export const TOI_DA = { tuVung: 15, cau: 14, mauCau: 5, quiz: 8 } as const;

/** Romaji cho chuỗi kana tách cụm bằng dấu cách (trợ từ は/へ đứng riêng đọc wa/e). */
export function romajiCau(kana: string): string {
  return kana.split(/\s+/).filter(Boolean).map((c) => (c === 'は' ? 'wa' : c === 'へ' ? 'e' : romaji(c))).join(' ').trim();
}

/** `{tuChoi}` ⇒ trả chuỗi lý do; hình dạng hỏng ⇒ null; ổn ⇒ nội dung đã làm sạch. */
export function kiemBaiAi(tho: unknown, nn: NnBai): NoiDungBaiAi | { tuChoi: string } | null {
  if (!tho || typeof tho !== 'object' || Array.isArray(tho)) return null;
  const o = tho as Record<string, unknown>;
  if (typeof o.tuChoi === 'string' && o.tuChoi.trim()) return { tuChoi: s(o.tuChoi, 300) };
  const daCo = new Set<string>();
  const tuVung: TuBai[] = ds(o.tuVung).map((t) => ({
    chu: s(t.chu, 60), doc: s(t.doc, 120), nghia: s(t.nghia, 160), loai: s(t.loai, 40),
    viDu: s(t.viDu, 240), viDuDoc: nn === 'en' ? '' : s(t.viDuDoc, 400), viDuNghia: s(t.viDuNghia, 240),
  })).filter((t) => t.chu && t.nghia && !daCo.has(t.chu) && daCo.add(t.chu)).slice(0, TOI_DA.tuVung);

  const ht = (o.hoiThoai && typeof o.hoiThoai === 'object' ? o.hoiThoai : {}) as Record<string, unknown>;
  const vai = ds(ht.vai).map((v) => ({ ma: s(v.ma, 4) || 'A', ten: s(v.ten, 40) })).filter((v) => v.ten).slice(0, 4);
  const maVai = new Set(vai.map((v) => v.ma));
  const cau: CauHoiThoai[] = ds(ht.cau).map((c) => ({
    vai: maVai.has(s(c.vai, 4)) ? s(c.vai, 4) : (vai[0]?.ma ?? 'A'), chu: s(c.chu, 300), doc: nn === 'en' ? '' : s(c.doc, 500), nghia: s(c.nghia, 300),
  })).filter((c) => c.chu && c.nghia).slice(0, TOI_DA.cau);

  const mauCau: MauCau[] = ds(o.mauCau).map((m) => ({
    mau: s(m.mau, 120), giaiThich: s(m.giaiThich, 400), viDu: s(m.viDu, 240), viDuDoc: nn === 'en' ? '' : s(m.viDuDoc, 400), viDuNghia: s(m.viDuNghia, 240),
  })).filter((m) => m.mau && m.giaiThich).slice(0, TOI_DA.mauCau);

  const quiz: CauQuiz[] = ds(o.quiz).flatMap((q) => {
    const lc = Array.isArray(q.luaChon) ? q.luaChon.map((x) => s(x, 160)).filter(Boolean) : [];
    const da = Math.floor(Number(q.dapAn));
    const hoi = s(q.hoi, 300);
    if (!hoi || lc.length < 3 || lc.length > 5 || new Set(lc).size !== lc.length || !Number.isInteger(da) || da < 0 || da >= lc.length) return [];
    return [{ hoi, luaChon: lc, dapAn: da, giaiThich: s(q.giaiThich, 300) }];
  }).slice(0, TOI_DA.quiz);

  if (tuVung.length < TOI_THIEU.tuVung || cau.length < TOI_THIEU.cau || vai.length < 2 || mauCau.length < TOI_THIEU.mauCau || quiz.length < TOI_THIEU.quiz) return null;

  if (nn === 'ja') {
    for (const t of tuVung) { t.romaji = romajiCau(t.doc); t.viDuRomaji = t.viDuDoc ? romajiCau(t.viDuDoc) : ''; }
    for (const c of cau) c.romaji = c.doc ? romajiCau(c.doc) : '';
    for (const m of mauCau) m.viDuRomaji = m.viDuDoc ? romajiCau(m.viDuDoc) : '';
  }
  return {
    tieuDe: s(o.tieuDe, 80), tieuDeGoc: s(o.tieuDeGoc, 120), moTa: s(o.moTa, 300),
    tuVung, hoiThoai: { boiCanh: s(ht.boiCanh, 240), vai, cau }, mauCau, quiz, goiYNoi: s(o.goiYNoi, 240),
  };
}

/** Mọi chữ người dùng sẽ đọc — đưa qua bộ lọc nội dung một lượt. */
export function toanBoChu(b: NoiDungBaiAi): string {
  return [b.tieuDe, b.tieuDeGoc, b.moTa, b.goiYNoi, b.hoiThoai.boiCanh,
    ...b.tuVung.flatMap((t) => [t.chu, t.nghia, t.viDu, t.viDuNghia]),
    ...b.hoiThoai.cau.flatMap((c) => [c.chu, c.nghia]),
    ...b.mauCau.flatMap((m) => [m.mau, m.giaiThich, m.viDu, m.viDuNghia]),
    ...b.quiz.flatMap((q) => [q.hoi, ...q.luaChon, q.giaiThich])].join('\n');
}

/** Tên chủ đề cho màn gọi CuongMini (≤ 160 ký tự — `timChuDe` của phòng trò chuyện cắt ở 160). */
export function tenGoiCuongMini(chuDe: string, b: NoiDungBaiAi): string {
  const tu = b.tuVung.slice(0, 6).map((t) => t.chu).join(', ');
  const goc = `${b.tieuDe || chuDe}${b.tieuDeGoc ? ` (${b.tieuDeGoc})` : ''}`;
  return `${goc} — dùng các từ: ${tu}`.slice(0, 160);
}
