/**
 * Trí nhớ đã xuống DB rồi — nó có làm robot chậm đi không?
 *
 * Bản cũ đọc lịch sử từ một `Map` trong RAM (0 ms). Bản mới đọc từ
 * PostgreSQL. Câu hỏi phải trả lời trước khi tin:
 *   1. Đọc 30 lượt từ DB mất bao lâu?
 *   2. Nới 4 → 30 lượt thì lượt nói chậm thêm bao nhiêu?
 *
 * Script TỰ DỌN: thiết bị và hội thoại nó tạo ra đều bị xoá ở cuối, kể cả
 * khi lỗi giữa chừng.
 *
 * Chạy: npx tsx scripts/robot-do-tri-nho-db.ts
 */
import 'dotenv/config';
import { prisma } from '../src/config/database.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY = process.env.LOCAL_LLM_KEY || '';
const VONG = 5;

const SYS =
  'Bạn là Mini-Me, robot của Cường. Tính cách hỗn xược, xưng "tao" gọi "mày". Trả lời NGẮN.';

const trungVi = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

/** Bản sao truy vấn trong `getHistory()` — đo đúng câu lệnh chạy thật. */
async function docLichSu(deviceId: number, soLuot: number, ttlGio: number) {
  const tuLuc = new Date(Date.now() - ttlGio * 3600_000);
  const rows = await prisma.makerConversation.findMany({
    where: { deviceId, createdAt: { gte: tuLuc } },
    orderBy: { id: 'desc' },
    take: soLuot * 2,
    select: { role: true, content: true },
  });
  return rows.reverse().map((r) => ({ role: r.role as 'user' | 'assistant', content: r.content }));
}

async function goiLlm(messages: any[]) {
  const t0 = performance.now();
  let ttft: number | null = null;
  let n = 0;
  const r = await fetch(CUC_BO, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen3.5-9b-local', messages, temperature: 0.7, max_tokens: 120, stream: true }),
  });
  if (!r.ok || !r.body) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 120)}`);
  const rd = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const d = line.slice(5).trim();
      if (d === '[DONE]') continue;
      try {
        const j = JSON.parse(d);
        if (j.choices?.[0]?.delta?.content) { if (ttft === null) ttft = performance.now() - t0; n++; }
      } catch { /* dòng vụn giữa hai gói */ }
    }
  }
  return { ttft: ttft ?? 0, tong: performance.now() - t0, n };
}

let deviceId: number | null = null;

async function donDep() {
  if (deviceId === null) return;
  await prisma.makerConversation.deleteMany({ where: { deviceId } });
  await prisma.makerDevice.delete({ where: { id: deviceId } }).catch(() => {});
  console.log(`\n(đã dọn: xoá thiết bị thử #${deviceId} và toàn bộ hội thoại của nó)`);
}

async function main() {
  if (!KEY) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }

  // MakerProject không có cột chủ sở hữu — chủ nằm ở MakerDevice.ownerId,
  // trỏ sang User. Lấy user bất kỳ, thiết bị này chỉ sống vài giây.
  const project = await prisma.makerProject.findFirst({ select: { id: true } });
  const user = await prisma.user.findFirst({ select: { id: true } });
  if (!project || !user) { console.error('DB local thiếu MakerProject hoặc User.'); process.exit(1); }

  const dev = await prisma.makerDevice.create({
    data: {
      projectId: project.id,
      ownerId: user.id,
      name: 'THIET-BI-DO-THU',
      deviceKey: `dothu-${process.pid}-${Math.floor(performance.now())}`,
      secretHash: 'khong-dung-den',
    },
    select: { id: true },
  });
  deviceId = dev.id;
  console.log(`Thiết bị thử #${deviceId} (sẽ xoá ở cuối)\n`);

  // Nhồi 60 lượt = 120 dòng.
  const rows: Array<{ deviceId: number; role: string; content: string }> = [];
  for (let i = 1; i <= 60; i++) {
    rows.push({ deviceId: dev.id, role: 'user', content: `Câu hỏi vặt số ${i}, nói chuyện linh tinh cho vui.` });
    rows.push({ deviceId: dev.id, role: 'assistant', content: `Trả lời vặt số ${i}, tao đang bận nhưng vẫn đáp mày.` });
  }
  // Chôn chi tiết cần nhớ ở lượt xa nhất trong tầm 30 lượt (lượt thứ 30
  // tính ngược lên), để phép thử "nhớ" không ăn may nhờ nằm sát cuối.
  rows[rows.length - 60] = { deviceId: dev.id, role: 'user', content: 'Con mèo nhà tao tên là Sóc nhé, nhớ đi.' };
  await prisma.makerConversation.createMany({ data: rows });
  console.log(`Đã ghi ${rows.length} dòng (60 lượt) vào maker_conversations.\n`);

  // ── 1. Đọc từ DB mất bao lâu ──
  console.log('━━ 1. ĐỌC LỊCH SỬ TỪ DATABASE');
  for (const n of [4, 30, 60]) {
    const ms: number[] = [];
    let soDong = 0;
    for (let i = 0; i < VONG; i++) {
      const t = performance.now();
      soDong = (await docLichSu(dev.id, n, 24)).length;
      ms.push(performance.now() - t);
    }
    console.log(`   ${String(n).padStart(2)} lượt → ${soDong} dòng: ${trungVi(ms).toFixed(1)} ms`);
  }

  // ── 2. Cả lượt nói: 4 lượt (cũ) so với 30 lượt (mới) ──
  console.log('\n━━ 2. TRỌN MỘT LƯỢT NÓI — 4 lượt (cũ) vs 30 lượt (mới)');
  for (const n of [4, 30]) {
    const tDb = performance.now();
    const lichSu = await docLichSu(dev.id, n, 24);
    const dbMs = performance.now() - tDb;
    const messages = [{ role: 'system', content: SYS }, ...lichSu, { role: 'user', content: 'Ừ thế à, mày kể tiếp đi' }];
    const soChu = messages.reduce((s, m) => s + m.content.length, 0);
    const rs = [];
    for (let i = 0; i < 3; i++) rs.push(await goiLlm(messages));
    console.log(
      `   ${String(n).padStart(2)} lượt (${soChu} ký tự đề bài): đọc DB ${dbMs.toFixed(1)} ms` +
        ` + chữ đầu ${trungVi(rs.map((r) => r.ttft)).toFixed(0)} ms` +
        ` = ${(dbMs + trungVi(rs.map((r) => r.ttft))).toFixed(0)} ms tới tiếng nói đầu tiên`,
    );
  }

  // ── 3. Nhớ thật không, ở đúng mức 30 lượt ──
  console.log('\n━━ 3. NHỚ THẬT KHÔNG (chi tiết chôn ở lượt thứ 30 tính ngược lên)');
  for (const n of [4, 30]) {
    const lichSu = await docLichSu(dev.id, n, 24);
    const r = await fetch(CUC_BO, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3.5-9b-local',
        messages: [{ role: 'system', content: SYS }, ...lichSu, { role: 'user', content: 'Con mèo nhà tao tên gì ấy nhỉ' }],
        temperature: 0.2, max_tokens: 60,
      }),
    });
    const j: any = await r.json();
    const t = String(j.choices?.[0]?.message?.content ?? '');
    console.log(`   ${String(n).padStart(2)} lượt: ${/sóc/i.test(t) ? '✅ NHỚ' : '❌ QUÊN'}  "${t.slice(0, 90).replace(/\n/g, ' ')}"`);
  }
}

main()
  .catch((e) => { console.error('LỖI:', e.message ?? e); process.exitCode = 1; })
  .finally(async () => { await donDep(); await prisma.$disconnect(); });
