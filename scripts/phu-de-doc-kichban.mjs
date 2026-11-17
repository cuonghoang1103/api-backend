#!/usr/bin/env node
/**
 * Tiến trình CON của `phu-de-tu-video-rieng.mjs`: nạp một LÔ `src/bai/<id>/kichban.ts` của dự án dựng video và in ra
 * (mỗi dòng một JSON) `{ id, khoa, chuong, bai, canh }` — chỉ phần cần cho mục lục (tên cảnh + chữ câu, không hình).
 *
 *   node --import tsx scripts/phu-de-doc-kichban.mjs <nguon-dir> <id> <id> …
 *
 * ⚠️ Vì sao tách tiến trình (17/11/2026): Node ≥ 20 chạy hook nạp của tsx ở MỘT LUỒNG RIÊNG với heap mặc định nhỏ, và
 * luồng đó giữ lại mọi tệp đã biên dịch. Nạp vài trăm kịch bản trong một tiến trình là "JavaScript heap out of memory"
 * ở ~430 MB dù đã `--max-old-space-size=8192` (cờ đó chỉ nới heap của luồng chính). Mỗi lô một tiến trình thì bộ nhớ
 * trả lại sau mỗi lô, và một kịch bản hỏng chỉ làm hỏng lô của nó (tiến trình cha thử lại từng tệp).
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [nguon, ...ids] = process.argv.slice(2);
for (const id of ids) {
  try {
    const m = await import(pathToFileURL(path.join(nguon, 'src/bai', id, 'kichban.ts')).href);
    if (!(m.KHOA?.slug && m.CHUONG?.slug && m.BAI?.slug)) continue;
    const canh = Array.isArray(m.CANH)
      ? m.CANH.map((c) => ({
        id: typeof c?.id === 'string' ? c.id : undefined,
        ten: typeof c?.ten === 'string' ? c.ten : undefined,
        cau: (Array.isArray(c?.cau) ? c.cau : []).map((k) => ({ hien: typeof k?.hien === 'string' ? k.hien : '' })),
      }))
      : null;
    process.stdout.write(JSON.stringify({ id, khoa: m.KHOA.slug, chuong: m.CHUONG.slug, bai: m.BAI.slug, canh }) + '\n');
  } catch (e) {
    process.stderr.write(`  ⚠ không nạp được kichban của ${id}: ${String(e?.message ?? e).slice(0, 120)}\n`);
  }
}
