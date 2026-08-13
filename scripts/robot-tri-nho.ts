/**
 * Robot NHỚ ĐƯỢC BAO XA?
 *
 * Hai giới hạn khác nhau, hay bị lẫn thành một:
 *   • Giới hạn ỨNG DỤNG — `MAX_HISTORY_TURNS = 4` trong voiceLoop.ts, cộng
 *     `HISTORY_TTL_MS = 30 phút`, và lịch sử nằm trong RAM nên restart
 *     backend là mất sạch. Đây mới là cái đang chặn.
 *   • Giới hạn MODEL — cửa sổ ngữ cảnh. Server cục bộ đang để 32.768 token.
 *
 * Script này đo cái thứ hai: nhồi N lượt hội thoại giả rồi hỏi một chi
 * tiết chôn ở lượt ĐẦU TIÊN. Nhớ hay không là đọc được ngay.
 *
 * Chạy: npx tsx scripts/robot-tri-nho.ts
 */
import 'dotenv/config';
import { chatCompletionsUrl, gatewayKey, modelFor } from '../src/services/llm/gateway.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY_CUC_BO = process.env.LOCAL_LLM_KEY || '';

const SYS =
  'Bạn là Mini-Me, robot của Cường. Tính cách hỗn xược, xưng "tao" gọi "mày". ' +
  'Trả lời NGẮN, một hai câu. Trả lời thẳng bằng chữ thường, không JSON.';

/** Chi tiết cần nhớ, chôn ở lượt đầu tiên. */
const MOC = {
  user: 'Tao tên Cường, con mèo nhà tao tên là Sóc, và mật khẩu wifi nhà tao là ganeshvn2019.',
  bot: 'Ờ nhớ rồi, Cường với con Sóc. Mật khẩu thì tao ghi vào bộ nhớ trong rồi đấy.',
};

/** Lượt nhồi — đủ nhạt để không gợi ý gì về chi tiết cần nhớ. */
const NHOI: Array<[string, string]> = [
  ['Hôm nay trời thế nào', 'Nắng, mà tao có ra ngoài đâu mà biết.'],
  ['Mày ăn cơm chưa', 'Tao chạy điện, mày hỏi câu này lần thứ mấy rồi.'],
  ['Kể chuyện cười đi', 'Chuyện cười nhất là mày hỏi robot kể chuyện cười.'],
  ['Mấy giờ rồi', 'Nhìn điện thoại đi, tay đâu.'],
  ['Mày buồn không', 'Buồn cái gì, tao có cảm xúc đâu mà buồn.'],
  ['Pin còn nhiều không', 'Còn, đủ để cãi mày thêm một lúc.'],
  ['Nhà mình có ai không', 'Cảm biến báo có người đứng trước mặt, chắc là mày.'],
  ['Đèn sáng quá', 'Thì tắt bớt đi, tay mày để làm cảnh à.'],
];

async function goi(dich: 'cu' | 'moi', messages: any[]) {
  const url = dich === 'cu' ? chatCompletionsUrl() : CUC_BO;
  const key = dich === 'cu' ? gatewayKey() : KEY_CUC_BO;
  const model = dich === 'cu' ? modelFor('robot_voice') : 'qwen3.5-9b-local';
  const t0 = Date.now();
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 120 }),
  });
  const j: any = await r.json();
  if (!r.ok) return { text: `❌ HTTP ${r.status}: ${JSON.stringify(j).slice(0, 110)}`, ms: Date.now() - t0 };
  return { text: String(j.choices?.[0]?.message?.content ?? '').trim(), ms: Date.now() - t0 };
}

async function thu(soLuot: number) {
  const messages: any[] = [
    { role: 'system', content: SYS },
    { role: 'user', content: MOC.user },
    { role: 'assistant', content: MOC.bot },
  ];
  for (let i = 0; i < soLuot; i++) {
    const [u, a] = NHOI[i % NHOI.length];
    messages.push({ role: 'user', content: `${u} (lượt ${i + 1})` });
    messages.push({ role: 'assistant', content: a });
  }
  messages.push({ role: 'user', content: 'Con mèo nhà tao tên gì ấy nhỉ, tao quên rồi' });

  const soChu = messages.reduce((s, m) => s + m.content.length, 0);
  console.log(`\n━━ ${soLuot} lượt nhồi   (${soChu} ký tự ≈ ${Math.round(soChu / 3)} token)`);

  for (const dich of ['cu', 'moi'] as const) {
    const r = await goi(dich, messages);
    const nho = /sóc/i.test(r.text);
    const nhan = dich === 'cu' ? `CŨ ` : 'MỚI';
    console.log(`   ${nhan}: ${nho ? '✅ NHỚ' : '❌ QUÊN'}  (${r.ms}ms)  "${r.text.slice(0, 120).replace(/\n/g, ' ')}"`);
  }
}

async function main() {
  if (!KEY_CUC_BO) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }
  console.log('Chi tiết cần nhớ nằm ở LƯỢT ĐẦU: con mèo tên "Sóc".');
  console.log('Ứng dụng hiện chỉ giữ 4 lượt — nên từ mốc 4 trở đi là vượt giới hạn app,');
  console.log('cái đo được ở đây là model CÓ THỂ nhớ tới đâu nếu app cho phép.');

  for (const n of [4, 60, 400, 1000]) await thu(n);

  console.log('\n━━ QUÊN THEO THỜI GIAN (HISTORY_TTL_MS = 30 phút)');
  console.log('   Không đo được bằng script — nhưng luật rõ: im lặng quá 30 phút là');
  console.log('   xoá sạch, và lịch sử nằm trong RAM nên restart backend cũng mất.');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
