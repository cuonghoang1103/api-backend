/**
 * Dựng TỪ VỰNG THEO CHỦ ĐỀ CT Language (`content/ctlanguage/chu-de-tu/<nn>/<ma>.json`) — 15/11/2026.
 *
 * Nguồn (không chép giáo trình nào):
 *   1. Bộ từ soạn tay theo CẤP của CuongThai (API công khai `/api/v1/my-language/<nn>/vocab` — mỗi nhóm "HSK2 · Thể thao"
 *      đã mang chủ đề + cấp, mỗi từ có nghĩa Việt, câu ví dụ, pinyin/kana/IPA). Tải một lần, nhớ ở $TMPDIR.
 *   2. Sổ tay chuyên ngành (`content/ctlanguage/so-chuyen-nganh/`) cho CNTT / sân bay / nhà hàng – khách sạn / văn phòng / y tế.
 *   3. 14 chủ đề × 12 từ của đợt C (giữ làm ứng viên ưu tiên).
 *   4. AI (cổng modelapi, `gpt-6-sol`): CHỌN từ đúng chủ đề trong ứng viên + chia mục con + viết nghĩa ngắn, và BỔ SUNG từ
 *      thông dụng còn thiếu. Từ AI bổ sung PHẢI có trong từ điển `ctl_tu` (hoặc bộ từ web) — cách đọc lấy của TỪ ĐIỂN
 *      (AI đọc lệch thì ghi log + dùng bản từ điển), không có thì BỎ. en: cụm từ được nhận khi mọi chữ đều có trong từ vựng.
 * Cấp: theo bộ từ theo cấp (đúng như gói `Resources/CapTu` của app) — không có ⇒ cấp AI ước lượng, ghi `capUoc: true`.
 * Lọc: trùng chữ trong chủ đề, nghĩa rỗng / lẫn chữ Hán, từ nhạy cảm (`locNoiDung`), ảnh không có trên R2.
 *
 *   npx tsx scripts/ctlanguage/sinh-chu-de-tu.mts                     # mọi chủ đề × 3 ngôn ngữ (bỏ qua tệp đã có)
 *   npx tsx scripts/ctlanguage/sinh-chu-de-tu.mts --ghi-de            # dựng lại cả tệp đã có
 *   npx tsx scripts/ctlanguage/sinh-chu-de-tu.mts ja dong-vat         # một ngôn ngữ / một chủ đề
 *   npx tsx scripts/ctlanguage/sinh-chu-de-tu.mts --khong-ai          # chỉ dựng lại từ câu trả lời AI đã nhớ
 * Nhớ tạm: $TMPDIR/ctl-chu-de-nguon (web-<nn>.json, r2-slugs.json, ai/<nn>-<ma>-<lượt>.json). Kiểm sau khi dựng:
 *   npx tsx scripts/ctlanguage-kiem-chu-de-tu.mts
 */
import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { prisma } from '../../src/config/database.js';
import { chatCompletionsUrl, gatewayKeyFor } from '../../src/services/llm/gateway.js';
import { kiemNoiDung } from '../../src/services/locNoiDung.js';
import {
  CAP_CUA, LOAI_TU, NN_CDT, SO_TU_TOI_DA, SO_TU_TOI_THIEU, hienThi, khoaKana, khoaPinyin, khoaTrung, kiemTu,
  type ChuDeDanhMuc, type DanhMucChuDe, type NnCdt, type TuChuDe,
} from '../../src/services/ctlanguage/chuDeTuThuan.js';

const GOC = process.cwd();
const RA = path.join(GOC, 'content', 'ctlanguage', 'chu-de-tu');
const NHO = path.join(process.env.CTL_CHU_DE_NGUON ?? path.join(os.tmpdir(), 'ctl-chu-de-nguon'));
const MODEL = process.env.CTL_CHU_DE_MODEL ?? 'gpt-6-sol';
const doiSo = process.argv.slice(2);
const ghiDe = doiSo.includes('--ghi-de');
const khongAi = doiSo.includes('--khong-ai');
const chiNn = doiSo.filter((x) => (NN_CDT as readonly string[]).includes(x)) as NnCdt[];
const chiMa = doiSo.filter((x) => !x.startsWith('--') && !(NN_CDT as readonly string[]).includes(x));
fs.mkdirSync(path.join(NHO, 'ai'), { recursive: true });

const dm = JSON.parse(fs.readFileSync(path.join(RA, '_chu-de.json'), 'utf8')) as DanhMucChuDe;
const r2 = new Set<string>(JSON.parse(fs.readFileSync(path.join(NHO, 'r2-slugs.json'), 'utf8')));
// Cấp của từng chữ Hán (data/hanzi-levels.json.gz: 1.800 chữ HSK1–6) — SÀN cấp của từ zh: từ chứa chữ HSK5 không thể là
// từ HSK1 (bộ từ web từng xếp 抹布 vào HSK1).
const CAP_CHU = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(GOC, 'data', 'hanzi-levels.json.gz'))).toString('utf8')) as Record<'zh' | 'ja', Record<string, { lv: string }>>;
function sanCap(nn: NnCdt, chu: string): number {
  // Chỉ zh: cấp chữ HSK bám sát cấp từ. ja KHÔNG dùng — cấp kanji ≠ cấp từ (猫 là kanji khó nhưng ねこ là từ N5).
  // Chữ không có trong danh sách 1.800 chữ ⇒ không suy (đừng đoán).
  if (nn !== 'zh') return -1;
  let san = -1;
  for (const ch of chu) {
    const lv = /\p{Script=Han}/u.test(ch) ? CAP_CHU.zh[ch]?.lv : undefined;
    const i = lv ? CAP_CUA.zh.indexOf(lv) : -1;
    if (i > san) san = i;
  }
  return san;
}
const TEN_NN: Record<NnCdt, string> = { ja: 'tiếng Nhật', zh: 'tiếng Trung (giản thể, Trung Quốc đại lục)', en: 'tiếng Anh' };

// ─── Nguồn ứng viên theo chủ đề: tên chủ đề của bộ từ web (phần sau "·") + sổ chuyên ngành ─────────────────────────
const NGUON: Record<string, { web: string[]; scn?: string[] }> = {
  'chao-hoi': { web: ['Chào hỏi & giao tiếp', 'Chào hỏi & Giao tiếp cơ bản', 'Chào hỏi', 'Bản thân, Quốc gia & Ngôn ngữ'] },
  'gia-dinh': { web: ['Gia đình & con người', 'Trường học, Nghề nghiệp & Xưng hô', 'Bạn bè & quan hệ'] },
  'nha-cua': { web: ['Nhà cửa & đồ vật', 'Nhà ở & thuê nhà', 'Nhà ở & đời sống', 'Dịch vụ & sửa chữa'] },
  'do-dung': { web: ['Đồ dùng cá nhân', 'Đồ vật cá nhân & Thiết bị', 'Nhà cửa & đồ vật', 'Học tập & trường lớp'] },
  'nau-an': { web: ['Nhà bếp & nấu ăn', 'Đồ ăn & thức uống', 'Ăn uống'] },
  'an-uong': { web: ['Đồ ăn & thức uống', 'Rau củ & trái cây', 'Ăn uống', 'Ăn uống & đặt đồ', 'Ẩm thực & đặc sản'] },
  'do-uong': { web: ['Đồ ăn & thức uống', 'Ăn uống', 'Nhà hàng & gọi món', 'Ăn uống & đặt đồ'] },
  'mua-sam': { web: ['Mua sắm & tiền bạc', 'Nơi chốn công cộng & Mua sắm', 'Quần áo & phụ kiện'], scn: ['tmdt-logistics'] },
  'quan-ao': { web: ['Quần áo & phụ kiện', 'Đồ dùng cá nhân'] },
  'mau-sac': { web: ['Màu sắc & hình dạng', 'Tính từ mô tả thường gặp'] },
  'co-the': { web: ['Cơ thể & sức khoẻ', 'Y học & sinh học', 'Động từ thông dụng hằng ngày'] },
  'suc-khoe': { web: ['Cơ thể & sức khoẻ', 'Bệnh viện & khám bệnh', 'Sức khỏe & khám bệnh', 'Y học & sinh học'], scn: ['y-te-dieu-duong'] },
  'the-thao': { web: ['Thể thao', 'Sở thích & giải trí'] },
  'so-thich': { web: ['Sở thích & giải trí', 'Sở thích & Giải trí', 'Văn hoá & nghệ thuật', 'Âm nhạc & phim ảnh'] },
  'am-nhac-phim': { web: ['Âm nhạc & phim ảnh', 'Văn hoá & nghệ thuật', 'Sở thích & giải trí'] },
  'cong-so': { web: ['Công việc & nghề nghiệp', 'Công việc & văn phòng', 'Meeting & sync', 'Idioms workplace', 'Kinh tế & kinh doanh'], scn: ['van-phong'] },
  'phong-van': { web: ['Phỏng vấn & xin việc', 'Nghề nghiệp & Phỏng vấn', 'Công việc & nghề nghiệp'] },
  'ngan-hang': { web: ['Ngân hàng & thủ tục', 'Mua sắm & tiền bạc', 'Tài chính & đầu tư', 'Tiền bạc & banking'] },
  'buu-dien': { web: ['Bưu điện & hành chính', 'Dịch vụ & sửa chữa'], scn: ['tmdt-logistics'] },
  'phap-luat': { web: ['Chính trị & pháp luật', 'An toàn & khẩn cấp', 'Xã hội & tin tức', 'Bưu điện & hành chính'] },
  'xa-hoi': { web: ['Chính trị & pháp luật', 'Xã hội & tin tức', 'Kinh tế & kinh doanh', 'Truyền thông & quảng cáo'] },
  'mang-xa-hoi': { web: ['Điện thoại & internet', 'Truyền thông & quảng cáo', 'Xã hội & tin tức'] },
  'cong-nghe': { web: ['Điện thoại & internet', 'Khoa học & công nghệ', 'Đồ vật cá nhân & Thiết bị'] },
  'an-toan': { web: ['An toàn & khẩn cấp', 'Thời tiết & thiên nhiên', 'Bệnh viện & khám bệnh'] },
  'truong-hoc': { web: ['Học tập & trường lớp', 'Trường học, Nghề nghiệp & Xưng hô', 'Giáo dục & nghiên cứu'] },
  'thi-cu': { web: ['Học tập & trường lớp', 'Giáo dục & nghiên cứu'] },
  'lap-trinh': { web: ['Khoa học & công nghệ', 'Lập trình cơ bản', 'OOP & Design Patterns', 'DevOps & Cloud', 'Database & SQL', 'Web & API', 'Frameworks & tools', 'AI / LLM', 'Cloud & infra'], scn: ['cntt'] },
  'khoa-hoc': { web: ['Khoa học & công nghệ', 'Vũ trụ & thiên văn', 'Y học & sinh học', 'Giáo dục & nghiên cứu', 'Môi trường & khí hậu'] },
  'toan-so-dem': { web: ['Số đếm & thời gian', 'Số đếm', 'Màu sắc & hình dạng'] },
  'du-lich': { web: ['Du lịch & khách sạn', 'Đi lại & phương hướng', 'Lịch sử & địa danh'], scn: ['du-lich-san-bay'] },
  'san-bay': { web: ['Du lịch & khách sạn', 'Đi lại & phương hướng', 'Giao thông & phương tiện'], scn: ['du-lich-san-bay'] },
  'khach-san': { web: ['Du lịch & khách sạn', 'Nhà ở & thuê nhà', 'Dịch vụ & sửa chữa'], scn: ['nha-hang-khach-san'] },
  'nha-hang': { web: ['Nhà hàng & gọi món', 'Ăn uống & đặt đồ', 'Đồ ăn & thức uống'], scn: ['nha-hang-khach-san'] },
  'hoi-duong': { web: ['Đi lại & phương hướng', 'Thành phố & địa điểm', 'Nơi chốn công cộng & Mua sắm'] },
  'giao-thong': { web: ['Đi lại & phương hướng', 'Giao thông & phương tiện'] },
  'quoc-gia': { web: ['Lịch sử & địa danh', 'Bản thân, Quốc gia & Ngôn ngữ', 'Thiên nhiên & địa lý', 'Thành phố & địa điểm'] },
  'thoi-gian': { web: ['Số đếm & thời gian', 'Thời gian, Thứ & Lịch trình', 'Ngày tháng & lịch', 'Trạng từ & liên từ'] },
  'ngay-thang': { web: ['Ngày tháng & lịch', 'Ngày tháng, Mùa & Tuổi', 'Thời gian, Thứ & Lịch trình', 'Số đếm & thời gian'] },
  'thoi-tiet': { web: ['Thời tiết & mùa', 'Thời tiết & thiên nhiên', 'Môi trường & khí hậu', 'Ngày tháng, Mùa & Tuổi'] },
  'thien-nhien': { web: ['Thời tiết & thiên nhiên', 'Thiên nhiên & địa lý', 'Biển cả & sông nước', 'Môi trường & khí hậu', 'Nông nghiệp & đồng quê', 'Vũ trụ & thiên văn'] },
  'dong-vat': { web: ['Động vật', 'Côn trùng & sinh vật nhỏ', 'Biển cả & sông nước', 'Nông nghiệp & đồng quê'] },
  'thuc-vat': { web: ['Cây cối & hoa lá', 'Rau củ & trái cây', 'Nông nghiệp & đồng quê'] },
  'cam-xuc': { web: ['Cảm xúc & tính cách', 'Tâm lý & hành vi', 'Tính từ mô tả thường gặp'] },
  'tinh-cach': { web: ['Cảm xúc & tính cách', 'Tâm lý & hành vi', 'Tính từ mô tả thường gặp'] },
  'ngoai-hinh': { web: ['Gia đình & con người', 'Tính từ mô tả thường gặp', 'Cơ thể & sức khoẻ', 'Quần áo & phụ kiện'] },
  'quan-he': { web: ['Bạn bè & quan hệ', 'Gia đình & con người', 'Tâm lý & hành vi'] },
  'nghe-nghiep': { web: ['Nghề nghiệp', 'Công việc & nghề nghiệp', 'Trường học, Nghề nghiệp & Xưng hô', 'Công nghiệp & sản xuất'] },
  'le-hoi': { web: ['Lễ hội & phong tục', 'Văn hoá & nghệ thuật', 'Ngày tháng & lịch'] },
  'am-thuc-dac-trung': { web: ['Ẩm thực & đặc sản', 'Đồ ăn & thức uống', 'Nhà hàng & gọi món', 'Lễ hội & phong tục'] },
};
for (const c of dm.chuDe) if (!NGUON[c.ma]) throw new Error(`thiếu NGUON cho ${c.ma}`);

const MUC_TIEU: Record<string, number> = { 'mau-sac': 75, 'ngoai-hinh': 75, 'buu-dien': 80, 'mang-xa-hoi': 85, 'do-uong': 80, 'hoi-duong': 80 };
const TOI_DA_UNG_VIEN = 320;

// ─── Bộ từ web ─────────────────────────────────────────────────────────────────────────────────────────────────────
interface UngVien { chu: string; doc: string; nghia: string; cap?: string; viDu?: string; viDuNghia?: string; viDuDoc?: string; nguon: 'web' | 'scn' | 'cu'; uuTien: number }
type WebTu = { categoryId: number; word: string; meaningVi: string; exampleSentence?: string | null; exampleMeaning?: string | null; pronunciations?: { type: string; value: string }[] };
type WebNhom = { id: number; name: string; level: string | null };

const LV: Record<NnCdt, Record<string, string>> = {
  zh: Object.fromEntries(CAP_CUA.zh.map((c) => [c, c])),
  ja: { N5: 'N5', N4: 'N4', N3: 'N3', N2: 'N2', N1: 'N1', JPD113: 'N5' },
  en: Object.fromEntries(CAP_CUA.en.map((c) => [c, c])),
};
const capSo = (nn: NnCdt, c?: string) => (c ? CAP_CUA[nn].indexOf(c) : 99);

async function taiWeb(nn: NnCdt): Promise<{ cats: WebNhom[]; words: WebTu[] }> {
  const tep = path.join(NHO, `web-${nn}.json`);
  if (fs.existsSync(tep)) return JSON.parse(fs.readFileSync(tep, 'utf8'));
  const B = 'https://cuongthai.com/api/v1/my-language';
  const j = async (u: string) => {
    for (let k = 0; k < 4; k++) {
      try { const r = await fetch(u, { headers: { 'User-Agent': 'ctl-build-script' } }); if (r.ok) return await r.json(); } catch { /* thử lại */ }
      await new Promise((r) => setTimeout(r, 1500));
    }
    throw new Error(`Không tải được ${u}`);
  };
  const cats = (await j(`${B}/${nn}/vocab/categories`)).data as WebNhom[];
  const words: WebTu[] = [];
  for (let page = 1; ; page++) {
    const d = await j(`${B}/${nn}/vocab?limit=100&page=${page}`);
    words.push(...d.data);
    if (page >= d.pagination.totalPages) break;
  }
  fs.writeFileSync(tep, JSON.stringify({ cats, words }));
  return { cats, words };
}

const sach = (s: string | null | undefined) => (s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
const IPA = (s: string | null | undefined) => { const v = sach(s); if (!v) return ''; return v.startsWith('/') ? v : `/${v.replace(/^\[|\]$/g, '')}/`; };
const CJK = /[぀-ヿ㐀-鿿]/;

function docCuaWeb(nn: NnCdt, w: WebTu): string {
  const p = w.pronunciations ?? [];
  if (nn === 'zh') return sach(p.find((x) => x.type === 'pinyin')?.value);
  if (nn === 'ja') return sach(p.find((x) => x.type === 'hiragana' || x.type === 'katakana')?.value);
  return IPA(p.find((x) => x.type === 'IPA')?.value);
}

/** Chữ web bỏ ghi chú trong ngoặc; bỏ mục có "/", ";" (nhiều từ gộp). */
function chuWeb(w: string): string | null {
  const c = sach(w).replace(/\s*[(（].*?[)）]\s*/g, ' ').trim();
  if (!c || /[/／;；|]/.test(c) || c.length > 40) return null;
  return c;
}

// ─── Từ điển ctl_tu ───────────────────────────────────────────────────────────────────────────────────────────────
type MucTD = { chu: string; doc: string | null; nghiaVi: string | null; uuTien: number };
const TD = new Map<string, MucTD[]>();   // "nn\u0000chữ" ⇒ mục (uu_tien giảm dần)
const LEX_EN = new Set<string>();
async function napTuDien(nn: NnCdt, chu: string[]) {
  const can = [...new Set(chu)].filter((c) => !TD.has(`${nn}\u0000${c}`));
  for (let i = 0; i < can.length; i += 2000) {
    const lo = can.slice(i, i + 2000);
    const ds = await prisma.ctlTu.findMany({ where: { nn, chu: { in: lo } }, orderBy: { uuTien: 'desc' }, select: { chu: true, doc: true, nghiaVi: true, uuTien: true } });
    for (const c of lo) TD.set(`${nn}\u0000${c}`, []);
    for (const m of ds) TD.get(`${nn}\u0000${m.chu}`)!.push(m);
  }
}
const tdCua = (nn: NnCdt, chu: string) => TD.get(`${nn}\u0000${chu}`) ?? [];

// ─── Gọi AI (nhớ theo băm câu hỏi) ────────────────────────────────────────────────────────────────────────────────
async function goiAi(khoa: string, system: string, user: string): Promise<unknown> {
  const bam = crypto.createHash('sha1').update(MODEL + system + user).digest('hex').slice(0, 12);
  const tep = path.join(NHO, 'ai', `${khoa}-${bam}.json`);
  if (fs.existsSync(tep)) return JSON.parse(fs.readFileSync(tep, 'utf8'));
  if (khongAi) throw new Error(`chưa có câu trả lời AI nhớ sẵn cho ${khoa}`);
  let loiCuoi = '';
  for (let lan = 0; lan < 3; lan++) {
    try {
      const r = await fetch(chatCompletionsUrl(), {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${gatewayKeyFor(MODEL)}` },
        body: JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], response_format: { type: 'json_object' }, reasoning_effort: 'medium' }),
        signal: AbortSignal.timeout(300_000),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status} ${t.slice(0, 200)}`);
      const nd = JSON.parse(t).choices?.[0]?.message?.content ?? '';
      const v = JSON.parse(String(nd).replace(/^```(?:json)?\s*|\s*```$/g, ''));
      fs.writeFileSync(tep, JSON.stringify(v));
      return v;
    } catch (e) {
      loiCuoi = (e as Error).message;
      await new Promise((r) => setTimeout(r, 3000 * (lan + 1)));
    }
  }
  throw new Error(`AI hỏng (${khoa}): ${loiCuoi}`);
}

const ANH_DS = [...r2].sort().join(' ');

function nhacHe(nn: NnCdt) {
  return `Bạn là biên tập viên từ điển song ngữ, soạn bộ từ vựng theo chủ đề cho NGƯỜI VIỆT học ${TEN_NN[nn]} trong một app học ngôn ngữ.
Ưu tiên từ THÔNG DỤNG, hiện đại, đúng cách người bản ngữ ngày nay nói; không từ cổ, không từ hiếm, không từ tục/nhạy cảm.
Nghĩa tiếng Việt NGẮN (≤ 40 ký tự), đúng nghĩa trong chủ đề, đúng cách người Việt nói; viết thường trừ tên riêng; KHÔNG chèn chữ Hán/kana vào nghĩa.
${nn === 'zh' ? 'Chữ: giản thể. "doc": pinyin CÓ DẤU THANH viết liền theo từ như từ điển (vd "píngguǒ", "duōshao qián"); ü viết là ü. "cap": HSK1–HSK6.' : ''}${nn === 'ja' ? 'Chữ: dạng từ điển như người Nhật thường viết (kanji thông dụng; từ thường viết bằng kana thì để kana; động từ thể từ điển). "doc": hiragana (từ ngoại lai katakana thì ghi đúng katakana). "cap": N5–N1.' : ''}${nn === 'en' ? 'Chữ: dạng gốc, viết thường (trừ tên riêng), tiếng Anh phổ thông (Mỹ/Anh đều được). Không cần "doc". "cap": A1–C2 (CEFR).' : ''}
Chỉ trả về MỘT đối tượng JSON.`;
}

function nhacChon(nn: NnCdt, c: ChuDeDanhMuc, uv: UngVien[], mucTieu: number) {
  const h = hienThi(c, nn);
  return `Chủ đề: "${h.ten}" — ${h.moTa}
Mục con (ghi ĐÚNG tên): ${c.nhom.map((n) => `"${n}"`).join(', ')}

Việc cần làm: dựng bộ khoảng ${mucTieu} từ (tối thiểu ${SO_TU_TOI_THIEU + 8}, tối đa ${Math.min(SO_TU_TOI_DA - 10, mucTieu + 25)}), các mục con tương đối đều (mỗi mục ≥ 8 từ).
1) CHỌN trong DANH SÁCH ỨNG VIÊN (dòng "số|chữ|nghĩa tham khảo") những từ thật sự thuộc chủ đề và người học cần. Mục ★ là từ cũ của app — giữ nếu đúng chủ đề.
   BỎ: từ lạc chủ đề, từ hiếm/cổ, thành ngữ khó, câu dài, mục trùng nghĩa vô ích, nghĩa tham khảo sai. Với mục chọn ghi "i" (số), không ghi "chu".
2) BỔ SUNG từ thông dụng còn thiếu (KHÔNG có trong danh sách) để đủ số lượng và đủ mục con: ghi "chu", ${nn === 'en' ? '' : '"doc", '}"cap", và với khoảng 2/3 số từ bổ sung thì thêm "viDu" (câu ví dụ ngắn, tự nhiên, ≤ 14 ${nn === 'en' ? 'từ' : 'chữ'}) + "viDuNghia" (nghĩa Việt của câu).
Mỗi phần tử: {"i"?: số, "chu"?: "...", ${nn === 'en' ? '' : '"doc"?: "...", '}"nhom": "<mục con>", "loai": "${LOAI_TU.join('|')}", "nghia": "...", "cap"?: "...", "viDu"?: "...", "viDuNghia"?: "...", "anh"?: "<tên hình>"}
"loai": n danh từ · v động từ · adj tính từ · adv phó từ · phr cụm từ/câu · num số · mw lượng từ · pron đại từ · intj thán từ · conj liên từ · prep giới từ · part trợ từ · name tên riêng.
"anh": CHỈ khi trong DANH SÁCH HÌNH có hình vẽ đúng vật/con vật/món/hành động mà từ chỉ (vd từ "chó" → "dog"); không chắc thì bỏ trống. Mỗi hình tối đa 1 từ.
Trả về: {"tu": [ ... ]} — sắp theo mục con, trong mỗi mục từ dễ/thông dụng trước.

DANH SÁCH HÌNH: ${ANH_DS}

DANH SÁCH ỨNG VIÊN:
${uv.map((u, i) => `${i}|${u.nguon === 'cu' ? '★' : ''}${u.chu}|${u.nghia.slice(0, 50)}`).join('\n')}`;
}

function nhacBoSung(nn: NnCdt, c: ChuDeDanhMuc, daCo: string[], boQua: string[], thieu: { nhom: string; can: number }[]) {
  const h = hienThi(c, nn);
  return `Chủ đề: "${h.ten}" — ${h.moTa}
Bộ từ đang THIẾU. Hãy BỔ SUNG từ thông dụng mới cho các mục con: ${thieu.map((t) => `"${t.nhom}" thêm ~${t.can} từ`).join(', ')}.
KHÔNG lặp các từ đã có: ${daCo.join('、')}
KHÔNG dùng các từ này (không có trong từ điển): ${boQua.slice(0, 200).join('、') || '(không)'}
Mỗi phần tử: {"chu": "...", ${nn === 'en' ? '' : '"doc": "...", '}"nhom": "<mục con>", "loai": "${LOAI_TU.join('|')}", "nghia": "...", "cap": "...", "viDu"?: "...", "viDuNghia"?: "...", "anh"?: "<tên hình>"} — khoảng 2/3 số từ có "viDu" + "viDuNghia".
"anh" chỉ chọn trong: ${ANH_DS}
Trả về: {"tu": [ ... ]}`;
}

// ─── Dựng một chủ đề ──────────────────────────────────────────────────────────────────────────────────────────────
type MucAi = { i?: unknown; chu?: unknown; doc?: unknown; nhom?: unknown; loai?: unknown; nghia?: unknown; cap?: unknown; viDu?: unknown; viDuNghia?: unknown; anh?: unknown };
interface BoiCanh {
  nn: NnCdt;
  theoWebTopic: Map<string, UngVien[]>;
  capToanCuc: Map<string, string>;   // chữ ⇒ cấp dễ nhất trong bộ từ web
  webTheoChu: Map<string, UngVien>;  // chữ ⇒ một mục web (đọc + ví dụ)
  scn: Map<string, UngVien[]>;
  cu: Map<string, UngVien[]>;
}

const nhatKy: string[] = [];
const ghiLog = (s: string) => { nhatKy.push(s); };

function chuanNghia(s: unknown): string {
  let v = sach(String(s ?? '')).replace(/^[-–•]\s*/, '').replace(/[.。]+$/, '');
  if (CJK.test(v)) v = v.split(/[,;，；]/).map((x) => x.trim()).filter((x) => x && !CJK.test(x)).join(', ');
  return v.slice(0, 80);
}

function hopLeCap(nn: NnCdt, v: unknown): string | undefined {
  const s = String(v ?? '').toUpperCase().replace(/\s+/g, '').replace(/^JLPT/, '');
  return CAP_CUA[nn].includes(s) ? s : undefined;
}

/** Khoảng cách sửa chuỗi (chọn cách đọc từ điển gần nhất với cách đọc gợi ý). */
function khoangCach(a: string, b: string): number {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let truoc = d[0]; d[0] = i;
    for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, truoc + (a[i - 1] === b[j - 1] ? 0 : 1)); truoc = t; }
  }
  return d[b.length];
}

/**
 * Cách đọc chuẩn: TỪ ĐIỂN THẮNG. Có mục `ctl_tu` ⇒ chọn cách đọc của từ điển gần cách đọc gợi ý nhất (gợi ý = của bộ từ
 * web / sổ chuyên ngành / AI — bộ từ web từng ghi 失礼します=しつれします, 室友=shǒuyǒu, 化粧水=かせん). Không có mục:
 * `tuNguonTin` (ứng viên web/sổ) ⇒ giữ cách đọc gợi ý; từ AI bổ sung ⇒ null (bỏ từ).
 */
/** Cách đọc sửa tay (từ điển xếp cách đọc hiếm lên trước). */
const DOC_TAY: Partial<Record<NnCdt, Record<string, string>>> = { ja: { 化粧水: 'けしょうすい' } };

function docXacMinh(bc: BoiCanh, chu: string, goiY: string, tuNguonTin = false): string | null {
  const nn = bc.nn;
  const tay = DOC_TAY[nn]?.[chu];
  if (tay) return tay;
  const web = bc.webTheoChu.get(chu);
  const td = tdCua(nn, chu);
  if (nn === 'en') {
    if (goiY && tuNguonTin) return goiY;
    if (web?.doc) return web.doc;
    const m = td.find((x) => x.doc);
    if (m) return IPA(m.doc);
    if (td.length || web || tuNguonTin) return '';
    // Cụm từ: mọi chữ phải có trong từ vựng tiếng Anh.
    const chuCon = chu.toLowerCase().split(/[\s-]+/).filter(Boolean);
    if (chuCon.every((w) => LEX_EN.has(w.replace(/[^a-z']/g, '')))) return '';
    // Tên riêng (nước, thành phố, ngày lễ): viết hoa, chỉ chữ cái — từ điển ctl_tu không chứa tên riêng.
    if (/^[A-Z][A-Za-z'.]*(?:[ -][A-Z][A-Za-z'.]*)*$/.test(chu) && chu.length <= 30) return '';
    return null;
  }
  const khoa = nn === 'ja' ? khoaKana : khoaPinyin;
  let ung: string[];
  if (nn === 'ja') {
    if (/^[ぁ-ゖァ-ヺー・]+$/.test(chu)) return chu;   // toàn kana: đọc = chính nó
    ung = td.map((m) => (m.doc ?? '').replace(/\s+/g, '')).filter((d) => /^[ぁ-ゖァ-ヺー・]+$/.test(d));
  } else {
    const thuong = td.map((m) => m.doc ?? '').filter((d) => d && d === d.toLowerCase());
    ung = thuong.length ? thuong : td.map((m) => m.doc ?? '').filter(Boolean);
  }
  if (!ung.length) {
    if (tuNguonTin && goiY) return goiY;
    if (web?.doc) return web.doc;
    return null;
  }
  if (goiY && ung.some((d) => khoa(d) === khoa(goiY))) return goiY;
  const kg = khoa(goiY);
  // Gần cách đọc gợi ý (đa âm: 拜拜 bàibai) — gợi ý sai quá xa (化粧水=かせん) ⇒ mục ưu tiên cao nhất của từ điển.
  const gan = goiY ? [...ung].sort((x, y) => khoangCach(khoa(x), kg) - khoangCach(khoa(y), kg))[0] : ung[0];
  const tot = khoangCach(khoa(gan), kg) <= Math.max(1, Math.floor(kg.length / 3)) ? gan : ung[0];
  if (goiY) ghiLog(`${nn} đọc lệch: ${chu} "${goiY}" → từ điển "${tot}"`);
  return tot;
}

async function dungChuDe(bc: BoiCanh, c: ChuDeDanhMuc): Promise<TuChuDe[]> {
  const nn = bc.nn;
  const nhomCho = new Set(c.nhom);
  // Ứng viên: từ cũ ★ → sổ chuyên ngành → web (cấp dễ trước).
  const daThay = new Set<string>();
  const uv: UngVien[] = [];
  const them = (u: UngVien) => { const k = khoaTrung(u.chu); if (daThay.has(k)) return; daThay.add(k); uv.push(u); };
  (bc.cu.get(c.ma) ?? []).forEach(them);
  for (const s of NGUON[c.ma].scn ?? []) (bc.scn.get(s) ?? []).forEach(them);
  const web = NGUON[c.ma].web.flatMap((t) => bc.theoWebTopic.get(t) ?? []).sort((a, b) => capSo(nn, a.cap) - capSo(nn, b.cap) || a.uuTien - b.uuTien);
  web.forEach(them);
  const ungVien = uv.slice(0, TOI_DA_UNG_VIEN);
  const mucTieu = MUC_TIEU[c.ma] ?? (nn === 'en' ? 105 : 95);

  const ra: TuChuDe[] = [];
  const daCo = new Set<string>();
  const anhDaDung = new Set<string>();
  const boQua: string[] = [];
  const nhanMuc = (m: MucAi, laBoSung: boolean) => {
    const nhom = typeof m.nhom === 'string' && nhomCho.has(m.nhom.trim()) ? m.nhom.trim() : null;
    if (!nhom) return;
    let chu: string, doc: string, cap: string | undefined, capUoc = false, viDu: string | undefined, viDuNghia: string | undefined;
    const idx = typeof m.i === 'number' ? m.i : typeof m.i === 'string' && /^\d+$/.test(m.i) ? Number(m.i) : null;
    const goc = !laBoSung && idx !== null ? ungVien[idx] : undefined;
    let nghia = chuanNghia(m.nghia);
    if (goc) {
      chu = goc.chu; doc = goc.doc; viDu = goc.viDu; viDuNghia = goc.viDuNghia;
      // Từ cũ ★ / sổ chuyên ngành không có ví dụ ⇒ lấy ví dụ của cùng chữ trong bộ từ web.
      if (!viDu) { const w = bc.webTheoChu.get(chu); if (w?.viDu && w.viDuNghia) { viDu = w.viDu; viDuNghia = w.viDuNghia; } }
      cap = goc.cap ?? bc.capToanCuc.get(chu);
      if (!nghia) nghia = chuanNghia(goc.nghia);
      const d = docXacMinh(bc, chu, doc, true);
      if (d === null || (!d && nn !== 'en')) return;
      doc = d;
    } else {
      chu = sach(String(m.chu ?? ''));
      if (!chu) return;
      const d = docXacMinh(bc, chu, sach(String(m.doc ?? '')));
      if (d === null) { boQua.push(chu); ghiLog(`${nn}/${c.ma}: bỏ "${chu}" — không có trong từ điển`); return; }
      doc = d;
      const w = bc.webTheoChu.get(chu);
      cap = bc.capToanCuc.get(chu);
      if (!cap) { cap = hopLeCap(nn, m.cap); capUoc = !!cap; }
      viDu = sach(String(m.viDu ?? '')) || w?.viDu;
      viDuNghia = sach(String(m.viDuNghia ?? '')) || (viDu === w?.viDu ? w?.viDuNghia : undefined);
      if (!nghia && w) nghia = chuanNghia(w.nghia);
    }
    if (!cap) { cap = hopLeCap(nn, m.cap); capUoc = !!cap; }
    const san = sanCap(nn, chu);
    // Chỉ nâng khi lệch ≥ 2 cấp (lệch 1 cấp là chuyện thường giữa danh sách chữ và danh sách từ).
    if (san >= 0 && (!cap || capSo(nn, cap) + 2 <= san)) { cap = CAP_CUA[nn][san]; capUoc = true; }
    if (nn === 'ja' && /^[ぁ-ゖァ-ヺー・]+$/.test(chu)) doc = chu;   // toàn kana: đọc = chính nó (web từng ghi ぺんぎん cho ペンギン)
    const k = khoaTrung(chu);
    if (daCo.has(k) || !nghia) return;
    const loai = (LOAI_TU as readonly string[]).includes(String(m.loai)) ? (m.loai as TuChuDe['loai']) : undefined;
    let anh = typeof m.anh === 'string' && r2.has(m.anh.trim()) ? m.anh.trim() : undefined;
    if (anh && anhDaDung.has(anh)) anh = undefined;
    const t: TuChuDe = { chu, ...(doc ? { doc } : {}), nghia, ...(loai ? { loai } : {}), ...(cap ? { cap } : {}), ...(capUoc ? { capUoc: true } : {}), nhom };
    if (viDu && viDuNghia && !CJK.test(viDuNghia)) { t.viDu = viDu.slice(0, 200); t.viDuNghia = viDuNghia.slice(0, 300); }
    if (anh) { t.anh = anh; anhDaDung.add(anh); }
    if (kiemNoiDung(`${t.chu} ${t.nghia} ${t.viDu ?? ''} ${t.viDuNghia ?? ''}`).chan) { ghiLog(`${nn}/${c.ma}: bỏ "${chu}" — lọc nội dung`); return; }
    let loi = kiemTu(t, nn, nhomCho);
    if (loi.length && t.viDu) { delete t.viDu; delete t.viDuNghia; loi = kiemTu(t, nn, nhomCho); }
    if (loi.length) { ghiLog(`${nn}/${c.ma}: bỏ "${chu}" — ${loi[0]}`); return; }
    daCo.add(k);
    ra.push(t);
  };

  const tl = (await goiAi(`${nn}-${c.ma}-chon`, nhacHe(nn), nhacChon(nn, c, ungVien, mucTieu))) as { tu?: MucAi[] };
  const dsAi = Array.isArray(tl?.tu) ? tl.tu : [];
  // Từ bổ sung cần tra từ điển trước.
  await napTuDien(nn, dsAi.filter((m) => typeof m.chu === 'string').map((m) => sach(String(m.chu))));
  for (const m of dsAi) nhanMuc(m, typeof m.i !== 'number' && !(typeof m.i === 'string' && /^\d+$/.test(m.i)));

  for (let luot = 1; luot <= 2 && ra.length < SO_TU_TOI_THIEU + 8; luot++) {
    const thieu = c.nhom.map((n) => ({ nhom: n, can: Math.max(0, 14 - ra.filter((t) => t.nhom === n).length) })).filter((x) => x.can > 0);
    const tong = SO_TU_TOI_THIEU + 15 - ra.length;
    if (!thieu.length) thieu.push(...c.nhom.map((n) => ({ nhom: n, can: Math.ceil(tong / c.nhom.length) })));
    const bs = (await goiAi(`${nn}-${c.ma}-bosung${luot}`, nhacHe(nn), nhacBoSung(nn, c, ra.map((t) => t.chu), boQua, thieu))) as { tu?: MucAi[] };
    const ds = Array.isArray(bs?.tu) ? bs.tu : [];
    await napTuDien(nn, ds.filter((m) => typeof m.chu === 'string').map((m) => sach(String(m.chu))));
    for (const m of ds) nhanMuc(m, true);
  }

  // Sắp: theo thứ tự mục con của danh mục, trong mục giữ thứ tự AI (dễ/thông dụng trước).
  const thuTu = new Map(c.nhom.map((n, i) => [n, i]));
  return ra.map((t, i) => ({ t, i })).sort((a, b) => thuTu.get(a.t.nhom)! - thuTu.get(b.t.nhom)! || a.i - b.i).map((x) => x.t).slice(0, SO_TU_TOI_DA);
}

// ─── Chạy ─────────────────────────────────────────────────────────────────────────────────────────────────────────
async function boiCanh(nn: NnCdt): Promise<BoiCanh> {
  const { cats, words } = await taiWeb(nn);
  const catTheoId = new Map(cats.map((c) => [c.id, c]));
  const theoWebTopic = new Map<string, UngVien[]>();
  const capToanCuc = new Map<string, string>();
  const webTheoChu = new Map<string, UngVien>();
  words.forEach((w, i) => {
    const cat = catTheoId.get(w.categoryId);
    if (!cat) return;
    const chu = chuWeb(w.word);
    if (!chu) return;
    const topic = cat.name.includes('·') ? cat.name.split('·').slice(1).join('·').trim() : cat.name.trim();
    const cap = cat.level ? LV[nn][cat.level] : undefined;
    const u: UngVien = {
      chu, doc: docCuaWeb(nn, w), nghia: sach(w.meaningVi), cap,
      viDu: sach(w.exampleSentence) || undefined, viDuNghia: sach(w.exampleMeaning) || undefined, nguon: 'web', uuTien: i,
    };
    if (!u.nghia) return;
    if (!theoWebTopic.has(topic)) theoWebTopic.set(topic, []);
    theoWebTopic.get(topic)!.push(u);
    if (cap && (!capToanCuc.has(chu) || capSo(nn, cap) < capSo(nn, capToanCuc.get(chu)))) capToanCuc.set(chu, cap);
    if (!webTheoChu.has(chu)) webTheoChu.set(chu, u);
  });
  const scn = new Map<string, UngVien[]>();
  const thuMucScn = path.join(GOC, 'content', 'ctlanguage', 'so-chuyen-nganh', nn);
  for (const f of fs.readdirSync(thuMucScn).filter((x) => x.endsWith('.json'))) {
    const b = JSON.parse(fs.readFileSync(path.join(thuMucScn, f), 'utf8')) as { ma: string; tu: { chu: string; doc?: string; nghia: string; viDu?: string; viDuDoc?: string; viDuNghia?: string }[] };
    scn.set(b.ma, b.tu.map((t, i) => ({ chu: t.chu, doc: t.doc ?? '', nghia: t.nghia, viDu: t.viDu, viDuNghia: t.viDuNghia, nguon: 'scn' as const, uuTien: i, cap: capToanCuc.get(t.chu) })));
  }
  const cu = new Map<string, UngVien[]>();
  const tepCu = path.join(NHO, 'cu-14.json');
  if (fs.existsSync(tepCu)) {
    for (const c of JSON.parse(fs.readFileSync(tepCu, 'utf8')) as { ma: string; tu: Record<NnCdt, [string, string, string][]> }[]) {
      cu.set(c.ma, c.tu[nn].map(([chu, doc, nghia], i) => ({ chu, doc: nn === 'en' ? '' : doc, nghia, nguon: 'cu' as const, uuTien: i, cap: capToanCuc.get(chu) })));
    }
  }
  // Từ điển cho mọi ứng viên (đọc của từ cũ / sổ chuyên ngành en).
  await napTuDien(nn, [...webTheoChu.keys(), ...[...scn.values(), ...cu.values()].flat().map((u) => u.chu)]);
  if (nn === 'en' && !LEX_EN.size) {
    for (const r of await prisma.ctlTu.findMany({ where: { nn: 'en' }, select: { chu: true } })) for (const w of r.chu.toLowerCase().split(/[\s-]+/)) LEX_EN.add(w);
    for (const k of webTheoChu.keys()) for (const w of k.toLowerCase().split(/[\s-]+/)) LEX_EN.add(w.replace(/[^a-z']/g, ''));
  }
  return { nn, theoWebTopic, capToanCuc, webTheoChu, scn, cu };
}

async function chayHang<T>(viec: (() => Promise<T>)[], song: number) {
  let i = 0;
  await Promise.all(Array.from({ length: song }, async () => { while (i < viec.length) { const v = viec[i++]; await v(); } }));
}

let hong = 0;
for (const nn of chiNn.length ? chiNn : NN_CDT) {
  const bc = await boiCanh(nn);
  fs.mkdirSync(path.join(RA, nn), { recursive: true });
  const viec = dm.chuDe.filter((c) => !chiMa.length || chiMa.includes(c.ma)).map((c) => async () => {
    const tep = path.join(RA, nn, `${c.ma}.json`);
    if (fs.existsSync(tep) && !ghiDe) return;
    try {
      const tu = await dungChuDe(bc, c);
      if (tu.length < SO_TU_TOI_THIEU) { hong++; console.error(`✗ ${nn}/${c.ma}: chỉ ${tu.length} từ — chưa ghi`); return; }
      fs.writeFileSync(tep, `${JSON.stringify({ ma: c.ma, nn, tu }, null, 0).replace(/\{"chu"/g, '\n    {"chu"').replace(/\]\}$/, '\n  ]}\n')}`);
      console.log(`✓ ${nn}/${c.ma}: ${tu.length} từ · ${tu.filter((t) => t.viDu).length} ví dụ · ${tu.filter((t) => t.anh).length} ảnh · ${tu.filter((t) => t.capUoc).length} cấp ước lượng`);
    } catch (e) { hong++; console.error(`✗ ${nn}/${c.ma}: ${(e as Error).message}`); }
  });
  await chayHang(viec, Number(process.env.CTL_CHU_DE_SONG_SONG ?? 4));
}
const tepNk = path.join(NHO, `nhat-ky-${(chiNn.length ? chiNn : NN_CDT).join('-')}.txt`);
fs.writeFileSync(tepNk, nhatKy.join('\n'));
console.log(`\nNhật ký (${nhatKy.length} dòng): ${tepNk}${hong ? ` · ${hong} chủ đề LỖI` : ''}`);
await prisma.$disconnect();
process.exit(hong ? 1 : 0);
