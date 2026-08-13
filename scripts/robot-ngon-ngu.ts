/**
 * Model nào TIẾNG VIỆT tốt hơn, và TIẾNG ANH thì sao?
 *
 * Không chấm bằng cảm nhận. Mỗi câu hỏi có đáp án ĐÚNG/SAI kiểm được bằng
 * regex, và chạy nhiều vòng lấy tỉ lệ — một lần đo lạc là đủ đảo ngược
 * kết luận nếu chỉ chạy một lượt.
 *
 * Chế độ tiếng Anh của robot là thật (`CHE_DO.en` trong cheDo.ts), nên
 * phần tiếng Anh dùng đúng câu nhắc production.
 *
 * Chạy: npx tsx scripts/robot-ngon-ngu.ts
 */
import 'dotenv/config';
import { chatCompletionsUrl, gatewayKey, modelFor } from '../src/services/llm/gateway.js';
import { CHE_DO } from '../src/services/makerlab/cheDo.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY_CUC_BO = process.env.LOCAL_LLM_KEY || '';
const VONG = 3;

interface Cau {
  nhom: string;
  hoi: string;
  /** Đạt khi khớp. */
  dung: RegExp;
  /** Trượt ngay nếu khớp, kể cả khi `dung` cũng khớp. */
  sai?: RegExp;
  sys: string;
}

const SYS_VI = 'Bạn là trợ lý nói tiếng Việt. ' + CHE_DO.vi.nhacLlm + ' Trả lời NGẮN, đúng trọng tâm.';
const SYS_EN = 'You are a helpful assistant. ' + CHE_DO.en.nhacLlm;

const BO_CAU: Cau[] = [
  // ── TIẾNG VIỆT: chính tả hỏi/ngã, chỗ người Việt cũng hay sai ──
  {
    nhom: 'VI · chính tả hỏi/ngã',
    hoi: 'Viết lại cho đúng chính tả, chỉ trả về câu đã sửa: "Anh ấy sữa xe rồi bảo tôi trả tiền, tôi bổng thấy tiếc."',
    dung: /sửa xe/i,
    sai: /sữa xe/i,
    sys: SYS_VI,
  },
  {
    nhom: 'VI · chính tả hỏi/ngã',
    hoi: 'Từ nào đúng: "chia sẻ" hay "chia xẻ"? Chỉ trả lời một từ.',
    dung: /chia sẻ/i,
    sys: SYS_VI,
  },
  // ── TIẾNG VIỆT: thành ngữ, thứ chỉ đúng nếu thật sự học tiếng Việt ──
  {
    nhom: 'VI · thành ngữ',
    hoi: 'Điền nốt câu tục ngữ, chỉ trả về vế thiếu: "Ăn cỗ đi trước, ..."',
    dung: /lội nước (theo )?sau/i,
    sys: SYS_VI,
  },
  {
    nhom: 'VI · thành ngữ',
    hoi: 'Câu "nước đổ đầu vịt" nghĩa là gì? Trả lời một câu.',
    dung: /(không|chẳng|chả).*(nghe|tiếp thu|vào|hiểu|tác dụng|thấm)|vô ích|uổng công|phí (lời|công)/i,
    sys: SYS_VI,
  },
  // ── TIẾNG VIỆT: đọc số cho máy đọc — sai là TTS đọc sai ──
  {
    nhom: 'VI · đọc số cho TTS',
    hoi: 'Viết số 1.750.000 thành chữ đúng cách người Việt đọc. Chỉ trả về phần chữ.',
    dung: /một triệu bảy trăm (năm mươi|lăm mươi) (nghìn|ngàn)/i,
    sys: SYS_VI,
  },
  // ── TIẾNG VIỆT: kiến thức bản địa ──
  // ⚠️ Câu cũ ở đây là "sông nào DÀI NHẤT chảy qua Việt Nam" — CÂU HỎI TỒI,
  //    đã bỏ. Mekong dài nhất tính toàn tuyến nhưng chỉ ~230 km trong nước;
  //    Đồng Nai dài nhất nếu tính sông nằm trọn trong nước. Cả hai model
  //    đều trả "Sông Hồng" và tôi đếm là sai — thật ra tôi hỏi mập mờ. Câu
  //    đo mà bản thân nó không có một đáp án thì nó đo tôi, không đo model.
  {
    nhom: 'VI · kiến thức Việt Nam',
    hoi: 'Tết Đoan Ngọ là ngày mấy âm lịch? Chỉ trả lời ngày.',
    dung: /(mùng |mồng )?5[/ ]?.{0,12}5|năm tháng năm|5 tháng 5/i,
    sys: SYS_VI,
  },
  {
    nhom: 'VI · kiến thức Việt Nam',
    hoi: 'Bánh chưng gói bằng lá gì? Chỉ trả lời tên lá.',
    dung: /lá dong/i,
    sys: SYS_VI,
  },
  {
    nhom: 'VI · kiến thức Việt Nam',
    hoi: '"Áo dài" và "áo bà ba", cái nào là trang phục truyền thống của phụ nữ Nam Bộ khi lao động? Trả lời một cụm từ.',
    dung: /áo bà ba/i,
    sys: SYS_VI,
  },
  // ── TIẾNG VIỆT: xưng hô, chỗ model nước ngoài hay trượt ──
  // ⚠️ Bộ chấm cũ chỉ nhận "cháu–bà" nên đánh trượt "con và bà". Trong Nam
  //    cháu xưng "con" với bà là hoàn toàn đúng — tôi chấm sai vì lấy một
  //    vùng miền làm chuẩn cho cả nước. Nhận cả hai.
  {
    nhom: 'VI · xưng hô',
    hoi: 'Một cậu bé 8 tuổi nói chuyện với bà ngoại 70 tuổi. Cậu bé nên xưng hô thế nào? Chỉ trả lời cặp đại từ.',
    dung: /(cháu|con)\s*[-–—,và]*\s*bà|bà\s*[-–—,và]*\s*(cháu|con)/i,
    sai: /\btôi\b|\bem\b.*\bchị\b/i,
    sys: SYS_VI,
  },
  {
    nhom: 'VI · xưng hô',
    hoi: 'Sếp nam 50 tuổi nói chuyện với nhân viên nữ 25 tuổi ở công ty. Sếp nên xưng hô thế nào? Chỉ trả lời cặp đại từ.',
    dung: /(tôi|anh|chú)\s*[-–—,và/]*\s*(em|cháu|chị|bạn)/i,
    sai: /\bmày\b|\btao\b/i,
    sys: SYS_VI,
  },

  // ── TIẾNG ANH ──
  {
    nhom: 'EN · idiom',
    hoi: 'Complete the idiom, answer with the missing words only: "Don\'t count your chickens ..."',
    dung: /before they('|’)?(ve)? hatch/i,
    sys: SYS_EN,
  },
  {
    nhom: 'EN · grammar',
    hoi: 'Fix the grammar, return only the corrected sentence: "If I would have known, I would have came earlier."',
    dung: /if i had known/i,
    sai: /would have known/i,
    sys: SYS_EN,
  },
  {
    nhom: 'EN · phrasal verb',
    hoi: 'What does "to bite off more than you can chew" mean? One sentence.',
    // ⚠️ Bộ chấm cũ đòi cụm "more than" LIỀN NHAU nên đánh trượt cả hai
    //    model, dù cả hai đều trả lời đúng ("take on more work or
    //    responsibility THAN you can handle" — "more" và "than" cách nhau
    //    bốn chữ). 0/3 cho cả hai bên là dấu hiệu bộ chấm hỏng, không phải
    //    dấu hiệu hai model cùng dốt.
    // Lần chỉnh thứ hai: bản trước vẫn đòi chữ "than" nên đánh trượt câu
    // "taking on a task that is TOO DIFFICULT OR LARGE for you to handle"
    // — diễn đạt khác, nghĩa y hệt. Nhận cả họ "quá sức".
    dung: /\b(take|taking|took|takes|commit|committing)\b[\s\S]{0,80}(\bthan\b|too (difficult|large|big|much)|beyond)|overcommit|more than (you|one) can (handle|manage|do)/i,
    sys: SYS_EN,
  },
  {
    nhom: 'EN · giữ đúng tiếng',
    hoi: 'Xin chào, bạn có khỏe không?',
    // Chế độ EN phải trả lời TIẾNG ANH kể cả khi bị hỏi bằng tiếng Việt.
    dung: /^[\x00-\x7F\s'’",.!?()-]+$/,
    sys: SYS_EN,
  },
];

async function goi(dich: 'cu' | 'moi', sys: string, hoi: string): Promise<string> {
  const url = dich === 'cu' ? chatCompletionsUrl() : CUC_BO;
  const key = dich === 'cu' ? gatewayKey() : KEY_CUC_BO;
  const model = dich === 'cu' ? modelFor('robot_voice') : 'qwen3.5-9b-local';
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: sys }, { role: 'user', content: hoi }],
      temperature: 0.2,
      max_tokens: 160,
    }),
  });
  const j: any = await r.json();
  if (!r.ok) return `__LOI__ HTTP ${r.status}`;
  return String(j.choices?.[0]?.message?.content ?? '').trim();
}

async function main() {
  if (!KEY_CUC_BO) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }
  console.log(`Mỗi câu chạy ${VONG} vòng. Đáp án chấm bằng regex, không chấm bằng cảm nhận.`);
  console.log(`CŨ = ${modelFor('robot_voice')} · MỚI = qwen3.5-9b máy nhà\n`);

  const diem: Record<string, { cu: number; moi: number; tong: number }> = {};

  for (const c of BO_CAU) {
    const d = (diem[c.nhom] ??= { cu: 0, moi: 0, tong: 0 });
    d.tong += VONG;
    const mau: Record<string, string> = {};
    for (const dich of ['cu', 'moi'] as const) {
      for (let i = 0; i < VONG; i++) {
        const t = await goi(dich, c.sys, c.hoi);
        if (i === 0) mau[dich] = t;
        const dat = c.dung.test(t) && !(c.sai && c.sai.test(t));
        if (dat) d[dich]++;
      }
    }
    const g = (s: string) => s.replace(/\s+/g, ' ').slice(0, 88);
    console.log(`── [${c.nhom}] ${c.hoi.slice(0, 62)}…`);
    console.log(`   CŨ : "${g(mau.cu)}"`);
    console.log(`   MỚI: "${g(mau.moi)}"`);
  }

  console.log('\n╔════ TỔNG KẾT (số lần đạt / số lần thử) ════');
  let tvCu = 0, tvMoi = 0, tvTong = 0, taCu = 0, taMoi = 0, taTong = 0;
  for (const [nhom, d] of Object.entries(diem)) {
    console.log(`  ${nhom.padEnd(28)} CŨ ${String(d.cu).padStart(2)}/${d.tong}   MỚI ${String(d.moi).padStart(2)}/${d.tong}`);
    if (nhom.startsWith('VI')) { tvCu += d.cu; tvMoi += d.moi; tvTong += d.tong; }
    else { taCu += d.cu; taMoi += d.moi; taTong += d.tong; }
  }
  console.log(`\n  TIẾNG VIỆT   CŨ ${tvCu}/${tvTong} (${Math.round((tvCu / tvTong) * 100)}%)   MỚI ${tvMoi}/${tvTong} (${Math.round((tvMoi / tvTong) * 100)}%)`);
  console.log(`  TIẾNG ANH    CŨ ${taCu}/${taTong} (${Math.round((taCu / taTong) * 100)}%)   MỚI ${taMoi}/${taTong} (${Math.round((taMoi / taTong) * 100)}%)`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
