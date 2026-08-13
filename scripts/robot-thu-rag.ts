/**
 * Kho kiến thức của robot có thật sự tra được không.
 *
 * Nạp vài mẩu, hỏi bằng lời nói thường ngày, xem nó rút đúng mẩu không —
 * rồi hỏi thẳng model để xem câu trả lời cuối có dùng dữ kiện đó không.
 * Tự dọn sạch ở cuối.
 *
 * Chạy: npx tsx scripts/robot-thu-rag.ts
 */
import 'dotenv/config';
import { prisma } from '../src/config/database.js';
import { napKienThuc, timKienThuc, xoaKienThuc, demKienThuc, dungDoanKienThuc } from '../src/services/makerlab/kienThuc.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY = process.env.LOCAL_LLM_KEY || '';

const SO =
  `Cường sinh năm 2003, quê Nghệ An, hiện làm lập trình viên backend Node.js và tự dựng cả trang cuongthai.com một mình.

Con robot Mini-Me chạy bo ESP32-S3, hai bánh xe, hai màn hình tròn làm mắt, một loa 3 oát và cảm biến khoảng cách phía trước. Firmware viết bằng C plus plus trên PlatformIO.

Món ăn Cường ăn hoài không chán là bún bò Huế, ăn ở quán bà Tám gần nhà, thường ăn buổi sáng sớm trước khi đi làm. Cường không đụng tới rau mùi.

Máy chủ chạy trên VPS 6 gigabyte RAM, dùng Docker, deploy bằng lệnh bash deploy.sh chứ không phải đẩy code lên GitHub. Cơ sở dữ liệu là PostgreSQL.

Cường mê nhạc Sơn Tùng và nhạc lo-fi lúc code đêm. Ghét nhất là bị gọi điện lúc đang tập trung viết code.`;

async function main() {
  if (!KEY) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }
  const project = await prisma.makerProject.findFirst({ select: { id: true } });
  if (!project) { console.error('DB local không có MakerProject nào.'); process.exit(1); }
  const pid = project.id;

  await xoaKienThuc(pid);
  const soMau = await napKienThuc(pid, SO, 'sổ tay thử');
  console.log(`Đã nạp ${soMau} mẩu vào kho của dự án #${pid} (tổng ${await demKienThuc(pid)}).\n`);

  const cauHoi = [
    'Tao hay ăn món gì ấy nhỉ',
    'Con robot của tao dùng bo gì',
    'Server tao deploy kiểu gì',
    'Tao thích nghe nhạc gì',
    'Hôm nay trời đẹp nhỉ', // KHÔNG dính gì tới kho — phải trả rỗng
  ];

  console.log('━━ 1. TRA KHO (chưa gọi model)');
  for (const h of cauHoi) {
    const t0 = performance.now();
    const mau = await timKienThuc(pid, h, 3);
    const ms = (performance.now() - t0).toFixed(1);
    console.log(`   "${h}"  → ${mau.length} mẩu, ${ms} ms`);
    if (mau[0]) console.log(`       trúng: "${mau[0].noiDung.slice(0, 78)}…"`);
  }

  console.log('\n━━ 2. MODEL CÓ DÙNG DỮ KIỆN ĐÓ KHÔNG');
  for (const h of ['Tao hay ăn món gì ấy nhỉ', 'Server tao deploy kiểu gì']) {
    const mau = await timKienThuc(pid, h, 3);
    const doan = dungDoanKienThuc(mau);
    const r = await fetch(CUC_BO, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3.5-9b-local',
        messages: [
          { role: 'system', content: 'Bạn là robot của Cường, tính cách hỗn xược, xưng "tao". Trả lời NGẮN, bằng chữ thường, không JSON.' },
          ...(doan ? [{ role: 'user' as const, content: doan }] : []),
          { role: 'user', content: h },
        ],
        temperature: 0.5, max_tokens: 150,
      }),
    });
    const j: any = await r.json();
    console.log(`   "${h}"\n      → "${String(j.choices?.[0]?.message?.content ?? '').trim().slice(0, 190).replace(/\n/g, ' ')}"`);
  }

  console.log('\n━━ 3. KHÔNG CÓ KHO thì nó nói gì (đối chứng)');
  const r2 = await fetch(CUC_BO, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3.5-9b-local',
      messages: [
        { role: 'system', content: 'Bạn là robot của Cường, tính cách hỗn xược, xưng "tao". Trả lời NGẮN, bằng chữ thường, không JSON.' },
        { role: 'user', content: 'Tao hay ăn món gì ấy nhỉ' },
      ],
      temperature: 0.5, max_tokens: 150,
    }),
  });
  const j2: any = await r2.json();
  console.log(`   → "${String(j2.choices?.[0]?.message?.content ?? '').trim().slice(0, 190).replace(/\n/g, ' ')}"`);
}

main()
  .catch((e) => { console.error('LỖI:', e.message ?? e); process.exitCode = 1; })
  .finally(async () => {
    const p = await prisma.makerProject.findFirst({ select: { id: true } });
    if (p) console.log(`\n(đã dọn: xoá ${await xoaKienThuc(p.id)} mẩu thử)`);
    await prisma.$disconnect();
  });
