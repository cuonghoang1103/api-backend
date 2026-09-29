/**
 * 📷 Sách gốc (RIÊNG TƯ) — bước 2: AI xem từng trang sách rồi soạn HƯỚNG DẪN
 * học đúng trang đó (mục của trang, từ mới, ngữ pháp, dịch câu, câu cô hay hỏi).
 * ─────────────────────────────────────────────────────────────────────────
 * Chạy MỘT lần (mỗi trang một tệp JSON, trang đã có thì bỏ qua — chạy lại
 * được sau khi đứt). Kết quả nằm NGOÀI KHO, cạnh ảnh
 * (~/Documents/JPD123/sach-goc-web/huong-dan/p-XXX.json), vì nó chứa chữ chép
 * từ sách; bước 3 (`dekiru-tai-len.mts`) gộp lại, mã hoá và đưa lên R2.
 *
 * Model: việc `doc_ocr` (= gpt-6-sol, model của cổng NHÌN được ảnh thật) qua
 * `visionComplete` — cùng cửa, cùng trần ngân sách với web.
 *
 *   npx tsx scripts/sach-rieng/dekiru-huong-dan.mts [--tu 14] [--den 289] [--song-song 5] [--lam-lai]
 */
import 'dotenv/config';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { visionComplete } from '../../src/services/docTools/vision.js';
import { BAI_CUA_TRANG, POINT_CUA_BAI, type HuongDanTrang } from '../../src/services/sachRieng/dekiru.js';

const arg = (k: string, d?: string) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};
const RA = arg('--ra', path.join(os.homedir(), 'Documents/JPD123/sach-goc-web'))!;
const TU = Number(arg('--tu', '14'));
const DEN = Number(arg('--den', '289'));
const SONG_SONG = Number(arg('--song-song', '5'));
const LAM_LAI = process.argv.includes('--lam-lai');

const SYSTEM = `Bạn là cô giáo tiếng Nhật người Việt, soạn HƯỚNG DẪN HỌC cho MỘT trang sách giáo trình できる日本語 初級 本冊 (môn JPD113/JPD123, FPT). Người học là sinh viên Việt mới bắt đầu, đọc chưa thạo kana.
Bạn được xem ẢNH trang sách. Chỉ nói về những gì CÓ trên trang (không bịa nội dung trang khác). Chữ nhỏ không đọc chắc được thì bỏ qua, đừng đoán.
Trả về DUY NHẤT một đối tượng JSON (không markdown, không \`\`\`), đúng khuôn:
{
 "muc": [{"loai": "...", "ten": "tên mục in trên trang (tiếng Nhật)", "topic": 1}],
 "tinCay": 0.0-1.0,
 "tomTat": "1–2 câu tiếng Việt: trang này là gì, người học làm gì ở đây",
 "mucTieu": "học xong trang này thì nói/làm được gì (tiếng Việt, 1 câu)",
 "tuMoi": [{"w": "từ tiếng Nhật", "ro": "romaji", "vi": "nghĩa"}],
 "nguPhap": [{"point": 1, "mau": "công thức, vd N1 は N2 です", "y": "giải thích ngắn tiếng Việt"}],
 "cau": [{"ja": "câu tiếng Nhật in trên trang", "ro": "romaji", "vi": "dịch tiếng Việt tự nhiên"}],
 "tranh": [{"so": "số/nhãn tranh trên trang hoặc 'lớn'", "moTa": "tranh vẽ gì, ai nói gì — tiếng Việt, 1 câu"}],
 "cachLam": ["từng bước làm phần bài tập trên trang, tiếng Việt"],
 "cauHoiCo": [{"ja": "câu cô hay hỏi về trang này", "ro": "", "vi": "", "traLoi": "câu trả lời mẫu tiếng Nhật", "traLoiRo": "", "traLoiVi": ""}],
 "luuY": ["lỗi người Việt hay mắc / mẹo, tiếng Việt"]
}
Quy tắc:
- "loai" ∈ mo-bai (trang mở đầu bài: số bài, tên bài, できる目標) · hoi-thoai (tranh tình huống + mục tiêu スモールトピック, nghe hội thoại) · yattemiyou (やってみよう) · ittemiyou (言ってみよう) · kiitemiyou (聞いてみよう / もう一度聞こう) · yondemiyou (読んでみよう) · kaitemiyou (書いてみよう) · dekiru (できる！ tự đánh giá / 教室の外へ / 日本語の音) · kotoba (ことば: danh sách từ) · point (ポイント一覧: giải thích ngữ pháp) · hyo (表: bảng chia động từ, số đếm, lịch, gia đình…) · khac. Trang có nhiều mục thì liệt kê theo thứ tự từ trên xuống; "topic" = số スモールトピック (1/2/3) nếu biết, không thì bỏ. Nếu trang không có tiêu đề mục (nối tiếp trang trước) thì dùng mục của trang trước được cho biết.
- Chữ Hán trong "w", "ja", "traLoi", "mau" viết dạng {漢字|かな} cho TỪNG từ có chữ Hán (vd {学生|がくせい}, {日本語|にほんご}); kana/katakana viết thường.
- Romaji Hepburn, tách từ, trợ từ は→wa, へ→e, を→o (vd "watashi wa gakusei desu").
- "tuMoi": từ mới/từ quan trọng XUẤT HIỆN trên trang (tối đa 20; trang ことば thì lấy hết các từ đọc được, tối đa 60).
- "nguPhap": các mẫu ngữ pháp dùng trên trang; "point" = số ポイント (trang có ghi ☞ポイント N thì dùng số đó; không chắc thì bỏ trường point).
- "cau": dịch MỌI câu tiếng Nhật chính trên trang (câu mục tiêu, câu tình huống, câu hội thoại, câu mẫu, câu hỏi bài tập, bài đọc) — tối đa 40, bỏ phần tiếng Anh/Trung/Hàn.
- "cauHoiCo": 2–4 câu giáo viên hay hỏi lớp / giám thị hay hỏi khi thi nói, liên quan trang này, kèm trả lời mẫu ngắn.
- Trang ポイント/表: "nguPhap" liệt kê từng ポイント trên trang (point + mau + giải thích đủ ý), "cau" dịch các câu ví dụ.
- Mảng không có gì thì để [].`;

async function coSan(f: string) {
  try { return (await stat(f)).size > 0; } catch { return false; }
}

function tachJson(t: string): HuongDanTrang {
  const s = t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1);
  return JSON.parse(s);
}

async function lamTrang(p: number, mucTruoc: string): Promise<HuongDanTrang> {
  const ten = `p-${String(p).padStart(3, '0')}`;
  const ra = path.join(RA, 'huong-dan', `${ten}.json`);
  if (!LAM_LAI && await coSan(ra)) return JSON.parse(await readFile(ra, 'utf8'));
  const img = (await readFile(path.join(RA, 'trang', `${ten}.webp`))).toString('base64');
  const bai = BAI_CUA_TRANG(p);
  const pts = bai.bai ? POINT_CUA_BAI[bai.bai] : null;
  const userText = `Trang ${p} của sách. Thuộc: ${bai.nhan}.`
    + (pts ? ` ポイント của bài này: ${pts[0]}–${pts[1]}.` : '')
    + (mucTruoc ? `\nMục của trang trước: ${mucTruoc}.` : '')
    + '\nSoạn hướng dẫn cho trang này theo đúng khuôn JSON.';
  let loi: unknown;
  for (let lan = 0; lan < 3; lan++) {
    try {
      const kq = await visionComplete({
        system: SYSTEM,
        userText,
        images: [{ data: img, mediaType: 'image/webp' }],
        maxTokens: 9000,
        timeoutMs: 240_000,
      });
      const j = tachJson(kq.text);
      const out: HuongDanTrang = { ...j, trang: p, bai: bai.bai, nguon: { model: kq.model, luc: new Date().toISOString() } };
      await writeFile(ra, JSON.stringify(out, null, 1));
      return out;
    } catch (e) {
      loi = e;
    }
  }
  throw loi;
}

async function main() {
  await mkdir(path.join(RA, 'huong-dan'), { recursive: true });
  // Mỗi "dải" = các trang của một bài, chạy tuần tự (để trang sau biết mục của
  // trang trước); các dải chạy song song.
  const dai = new Map<string, number[]>();
  for (let p = TU; p <= DEN; p++) {
    const k = BAI_CUA_TRANG(p).nhan;
    dai.set(k, [...(dai.get(k) ?? []), p]);
  }
  const hang = [...dai.values()];
  let xong = 0;
  let hong = 0;
  const tong = DEN - TU + 1;
  const tho = async () => {
    for (let ds = hang.shift(); ds; ds = hang.shift()) {
      let truoc = '';
      for (const p of ds) {
        try {
          const h = await lamTrang(p, truoc);
          truoc = (h.muc ?? []).map((m) => `${m.loai}${m.topic ? ` (topic ${m.topic})` : ''} ${m.ten ?? ''}`).slice(-1).join('');
          xong++;
          console.log(`✓ p.${p} [${(h.muc ?? []).map((m) => m.loai).join(',')}] tin cậy ${h.tinCay} — ${xong}/${tong}`);
        } catch (e) {
          hong++;
          console.error(`❌ p.${p}: ${(e as Error).message}`);
        }
      }
    }
  };
  await Promise.all(Array.from({ length: SONG_SONG }, tho));
  console.log(`Xong ${xong}/${tong}, hỏng ${hong}.`);
  process.exit(hong ? 1 : 0);
}

main();
