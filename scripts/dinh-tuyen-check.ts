/**
 * Việc trong `LLM_LOCAL_PURPOSES` có THẬT SỰ đi máy nhà không?
 *
 * ⚠️ VÌ SAO CẦN: từ 13/08 tới 14/08/2026, `LLM_LOCAL_PURPOSES` trên production
 * khai 6 việc, và đúng MỘT việc (`robot_voice`) thật sự chạy cục bộ. Năm việc
 * kia có chỗ gọi dùng `chatCompletionsUrl()` — hàm LUÔN trả về cổng — nên biến
 * môi trường đó không có tác dụng gì với chúng. Không có gì báo lỗi cả: model
 * vẫn trả lời, tiền vẫn trừ, chỉ là trừ ở nơi lẽ ra không phải trừ. Đọc mã
 * không ra; phải gọi thật rồi nhìn tên model trả về.
 *
 * Kiểm CẢ HAI đường, vì đường chính xanh không chứng minh được gì
 * ([[feedback_fallback_path_is_where_bugs_hide]]):
 *
 *     # 1) máy nhà SỐNG — mong đợi 5/5 "may-nha"
 *     ssh -f -N -L 8100:127.0.0.1:8100 linux-nha
 *     LLM_LOCAL_BASE_URL=http://127.0.0.1:8100 \
 *     LLM_LOCAL_API_KEY=$(ssh linux-nha 'cat ~/llm-server/api-key.txt') \
 *     LLM_LOCAL_PURPOSES=cv_parse,language_bulk,codelab_bulk,exphub_doc,news_bulletin \
 *     npx tsx scripts/dinh-tuyen-check.ts
 *
 *     # 2) máy nhà CHẾT — mong đợi 0/5, KHÔNG cái nào lỗi (phải tụt xuống cổng)
 *     LLM_LOCAL_BASE_URL=http://127.0.0.1:9 LLM_LOCAL_API_KEY=gia-vo \
 *     LLM_LOCAL_PURPOSES=cv_parse,language_bulk npx tsx scripts/dinh-tuyen-check.ts
 *
 * Phép thứ hai từng bắt được một lỗi thật: `continue` trong vòng thử lại vẫn
 * chạy phép tăng biến đếm, nên caller đặt `maxRetries: 0` thì việc đổi sang
 * cổng bị nuốt mất và tính năng chết hẳn khi ở nhà cúp điện.
 *
 * Cần khoá cổng thật trong `.env` để chạy được nhánh đối chứng.
 */
import { llmComplete } from '../src/services/interview/llm/index.js';
import { cvLlmComplete } from '../src/services/cv/llm/index.js';

const HOI = 'Trả lời đúng một từ: thủ đô Việt Nam là gì?';

async function thu(ten: string, chay: () => Promise<{ model: string; text: string }>) {
  const t = Date.now();
  try {
    const r = await chay();
    const nha = r.model.includes('local');
    console.log(
      `${ten.padEnd(18)} ${(nha ? '🏠 may-nha' : '☁️  cong').padEnd(12)} ${String(Date.now() - t).padStart(6)}ms  ${r.model.padEnd(20)} "${r.text.trim().slice(0, 40)}"`,
    );
    return nha;
  } catch (e) {
    console.log(`${ten.padEnd(18)} ❌ ${(e as Error).message.slice(0, 70)}`);
    return false;
  }
}

async function main() {
  console.log('việc'.padEnd(18) + 'nơi'.padEnd(12) + '  thời gian  model' + ' '.repeat(16) + 'trả lời');
  console.log('─'.repeat(110));

  const kq: boolean[] = [];

  // 4 việc đi qua llmComplete. Dùng feature=null để không chạm công tắc
  // LLM_BACKGROUND_ENABLED (đang tắt) — ta đang kiểm ĐỊNH TUYẾN, không phải
  // kiểm công tắc chạy nền.
  for (const [ten, purpose] of [
    ['language_bulk', 'language_bulk'],
    ['codelab_bulk', 'codelab_bulk'],
    ['exphub_doc', 'exphub_doc'],
    ['news_bulletin', 'news_bulletin'],
  ] as const) {
    kq.push(
      await thu(ten, async () => {
        const r = await llmComplete({
          step: 'generation',
          purpose,
          system: 'Bạn trả lời cực ngắn.',
          messages: [{ role: 'user', content: HOI }],
          maxTokens: 30,
          maxRetries: 0,
        });
        return { model: r.model, text: r.text };
      }),
    );
  }

  // cv_parse đi qua cvLlmComplete (đường khác hẳn).
  kq.push(
    await thu('cv_parse', async () => {
      const r = await cvLlmComplete({
        task: 'jd_parse',
        system: 'Bạn trả lời cực ngắn.',
        messages: [{ role: 'user', content: HOI }],
        maxTokens: 30,
        maxRetries: 0,
      });
      return { model: r.model, text: r.text };
    }),
  );

  // Đối chứng: việc KHÔNG có trong danh sách phải đi cổng.
  console.log('\nĐối chứng — việc không nằm trong LLM_LOCAL_PURPOSES:');
  const doiChung = await thu('cv_critique', async () => {
    const r = await cvLlmComplete({
      task: 'critique',
      system: 'x',
      messages: [{ role: 'user', content: HOI }],
      maxTokens: 20,
      maxRetries: 0,
    });
    return { model: r.model, text: r.text };
  });

  const dat = kq.filter(Boolean).length;
  console.log(`\n${dat}/5 việc chạy máy nhà. Đối chứng đi máy nhà: ${doiChung ? 'CÓ ❌ (sai!)' : 'KHÔNG ✅'}`);
  process.exit(dat === 5 && !doiChung ? 0 : 1);
}

void main();
