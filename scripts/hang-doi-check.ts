/**
 * Đo hàng đợi máy nhà bằng LƯỢT GỌI THẬT.
 *
 * Bộ kiểm đơn vị (`src/services/llm/hangDoi.test.ts`) chứng minh logic xếp
 * hàng đúng. Nó KHÔNG chứng minh được thứ quan trọng nhất: robot có thật sự
 * đáp nhanh khi web đang đông hay không. Cái đó phải bắn vào GPU thật.
 *
 *     ssh -f -N -L 8100:127.0.0.1:8100 linux-nha       # mở đường tới máy nhà
 *     LLM_LOCAL_BASE_URL=http://127.0.0.1:8100 \
 *     LLM_LOCAL_API_KEY=<khoá> \
 *     LLM_LOCAL_PURPOSES=robot_voice,cv_parse \
 *     npx tsx scripts/hang-doi-check.ts
 *
 * Đọc kết quả: cột `nơi` là thứ đáng nhìn. `robot_voice` phải luôn `may-nha`
 * và tổng thời gian phải xấp xỉ một lượt chạy đơn (~0,7s). Web bị đẩy sang
 * `cong` là ĐÚNG THIẾT KẾ, không phải lỗi — đó chính là lớp 2 đang làm việc.
 */
import { xinDiemCuoi, chatUrlOf, modelFor, type LlmPurpose } from '../src/services/llm/gateway.js';
import { thongKe } from '../src/services/llm/hangDoi.js';

interface KetQua {
  ten: string;
  noi: string;
  lyDo?: string;
  choMs: number;
  tongMs: number;
  loi?: string;
}

async function motLuot(ten: string, purpose: LlmPurpose, hoi: string): Promise<KetQua> {
  const batDau = Date.now();
  const { ep, tra, choMs, lyDo } = await xinDiemCuoi(purpose);
  try {
    // Chỉ gọi thật khi đi máy nhà. Đường ra cổng cần khoá thật và tốn tiền —
    // ở đây ta chỉ cần biết QUYẾT ĐỊNH ĐỊNH TUYẾN là gì.
    if (!ep.local) {
      return { ten, noi: ep.label, lyDo, choMs, tongMs: Date.now() - batDau };
    }
    const res = await fetch(chatUrlOf(ep), {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${ep.key}` },
      body: JSON.stringify({
        model: modelFor(purpose, ep),
        messages: [{ role: 'user', content: hoi }],
        max_tokens: purpose === 'robot_voice' ? 40 : 180,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await res.json();
    return { ten, noi: ep.label, lyDo, choMs, tongMs: Date.now() - batDau };
  } catch (err) {
    return {
      ten,
      noi: ep.label,
      lyDo,
      choMs,
      tongMs: Date.now() - batDau,
      loi: err instanceof Error ? err.message : String(err),
    };
  } finally {
    tra();
  }
}

function bang(rows: KetQua[]): void {
  console.log(
    '\n' +
      'việc'.padEnd(16) +
      'nơi'.padEnd(10) +
      'chờ(ms)'.padStart(9) +
      'tổng(ms)'.padStart(10) +
      '  lý do / lỗi',
  );
  console.log('─'.repeat(72));
  for (const r of rows) {
    console.log(
      r.ten.padEnd(16) +
        r.noi.padEnd(10) +
        String(r.choMs).padStart(9) +
        String(r.tongMs).padStart(10) +
        '  ' +
        (r.loi ? `❌ ${r.loi}` : r.lyDo ?? ''),
    );
  }
}

async function main(): Promise<void> {
  if (!process.env.LLM_LOCAL_BASE_URL || !process.env.LLM_LOCAL_API_KEY) {
    console.error('Thiếu LLM_LOCAL_BASE_URL / LLM_LOCAL_API_KEY — xem phần hướng dẫn đầu file.');
    process.exit(1);
  }

  console.log('Cấu hình:', JSON.stringify(thongKe(), null, 1));

  // ── Vòng 1: chỉ robot, không ai tranh ──
  console.log('\n▶ VÒNG 1 — robot một mình (đây là mốc để so sánh)');
  bang([await motLuot('robot_voice', 'robot_voice', 'Chào bạn, khoẻ không?')]);

  // ── Vòng 2: 4 khách web ập vào CÙNG LÚC với robot ──
  //
  // Đây là đúng kịch bản đáng sợ: web đông, robot vẫn phải đáp ngay.
  console.log('\n▶ VÒNG 2 — 4 khách web + robot, cùng một khoảnh khắc');
  const dong = await Promise.all([
    motLuot('web-1', 'cv_parse', 'Kể một câu chuyện ngắn về con mèo, khoảng 120 từ.'),
    motLuot('web-2', 'cv_parse', 'Kể một câu chuyện ngắn về con chó, khoảng 120 từ.'),
    motLuot('web-3', 'cv_parse', 'Kể một câu chuyện ngắn về con cá, khoảng 120 từ.'),
    motLuot('web-4', 'cv_parse', 'Kể một câu chuyện ngắn về con chim, khoảng 120 từ.'),
    motLuot('robot_voice', 'robot_voice', 'Mấy giờ rồi bạn?'),
  ]);
  bang(dong);

  const robot = dong.find((r) => r.ten === 'robot_voice');
  const raCong = dong.filter((r) => r.noi === 'cong').length;

  // ── Vòng 3: web đông, KHÔNG có robot ──
  //
  // Vòng 2 chứng minh robot luôn thắng, nhưng nó thắng bằng cửa sổ giữ chỗ
  // nên cả 4 khách bị chặn ngay ở cửa — đường xếp hàng chưa hề được chạy.
  // Tắt cửa sổ đó đi mới thấy được lớp 2 làm việc thật: một người vào máy,
  // vài người xếp hàng, phần còn lại tràn sang cổng. Đây mới đúng là câu
  // "nhiều người dùng model một lúc".
  console.log('\n▶ VÒNG 3 — 5 khách web, không có robot (tắt cửa sổ giữ chỗ)');
  const giuCu = process.env.LLM_ROBOT_GIU_MS;
  process.env.LLM_ROBOT_GIU_MS = '0';
  const chiWeb = await Promise.all(
    [1, 2, 3, 4, 5].map((i) =>
      motLuot(`web-${i}`, 'cv_parse', `Kể một câu chuyện ngắn số ${i}, khoảng 120 từ.`),
    ),
  );
  if (giuCu === undefined) delete process.env.LLM_ROBOT_GIU_MS;
  else process.env.LLM_ROBOT_GIU_MS = giuCu;
  bang(chiWeb);
  const wNha = chiWeb.filter((r) => r.noi === 'may-nha').length;
  console.log(
    `→ ${wNha}/5 chạy máy nhà, ${5 - wNha}/5 tràn sang cổng. ` +
      `Chậm nhất ${Math.max(...chiWeb.map((r) => r.tongMs))}ms ` +
      `(không có chốt chặn thì người thứ 5 phải chờ ~16.800ms).`,
  );

  console.log('\n' + '═'.repeat(72));
  console.log(`Robot: ${robot?.noi}, chờ ${robot?.choMs}ms, tổng ${robot?.tongMs}ms`);
  console.log(`Web bị đẩy sang cổng: ${raCong}/4  ← con số này LỚN là đúng thiết kế`);
  console.log('Sau cùng:', JSON.stringify(thongKe(), null, 1));

  // Chốt kiểm: robot phải ở máy nhà và không được chờ lâu.
  const dat = robot?.noi === 'may-nha' && (robot?.choMs ?? 9e9) < 1000;
  console.log(dat ? '\n✅ ĐẠT — robot không bị web làm nghẽn.' : '\n❌ TRƯỢT — robot bị đẩy đi hoặc phải chờ quá lâu.');
  process.exit(dat ? 0 : 1);
}

void main();
