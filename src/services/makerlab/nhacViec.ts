/**
 * ============================================================
 * Vòng nhắc việc — chạy mỗi phút, đọc lời nhắc ra loa robot
 * ============================================================
 *
 * Cắm vào `cron.service.ts` (`* * * * *`). Mỗi nhịp: hỏi `quetToiHan()`
 * xem có việc nào tới giờ, tìm con robot của chủ việc đó, và đọc lên.
 *
 * ── BA ĐIỀU DỄ LÀM SAI, ĐÃ XỬ ──
 *
 * 1. **Robot offline thì lời nhắc KHÔNG được bốc hơi.** `nhacLuc` chỉ
 *    ghi khi loa đã kêu thật. Nói không được ⇒ để nguyên, nhịp sau thử
 *    lại, trong suốt cửa sổ ân xá. Đánh dấu trước rồi nói sau là kiểu
 *    hỏng lặng lẽ nhất: sổ ghi "đã nhắc", tai người dùng thì không.
 *
 * 2. **Nói xong phải MỞ CỬA SỔ THỨC.** Robot vừa gọi tên bạn thì bạn
 *    đáp "xong rồi" ngay, chứ không ai lại đi nói "Odin, xong rồi".
 *    Không mở thì cổng đánh thức nuốt mất câu trả lời, và tính năng
 *    này nghe rất ngu ngay ở lần dùng đầu tiên.
 *
 * 3. **Đây là AI CHẠY NỀN, nhưng KHÔNG tốn tiền LLM.** Câu nhắc ghép
 *    bằng chuỗi, không gọi model. Chỉ TTS. Nên nó không nằm dưới cờ
 *    `LLM_BACKGROUND_ENABLED` — cờ đó để chặn model tự tiêu tiền, còn
 *    cái này người dùng đã tự tay đặt giờ nên im lặng mới là sai.
 */

import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { quetToiHan, dongSoNgayCu, danhDauDaNhac, ghiVuaNhac, docGio } from './keHoach.js';
import { loadPersona } from './persona.js';
import { speakOnce } from './voiceLoop.js';
import { moCong } from './danhThuc.js';

/** Nói xong thì mở tai bao lâu để hứng câu "xong rồi". */
const THUC_SAU_NHAC_GIAY = 90;

/** Ghép câu nhắc. Không gọi LLM — xem lý do 3 ở đầu file. */
function cauNhac(title: string, gio: number, huongDan: string | null, laHoan: boolean): string {
  const dau = laHoan ? 'Nhắc lại nhé' : `${docGio(gio)} rồi`;
  const than = `${dau}, tới giờ ${title}.`;
  // Hướng dẫn ngắn thì đọc luôn cho tiện. Dài thì thôi — người ta đang
  // đứng nghe, và có muốn thì hỏi "hướng dẫn đi" là robot đọc.
  const h = huongDan?.trim();
  if (h && h.length <= 180) return `${than} ${h}`;
  if (h) return `${than} Cần hướng dẫn thì bảo tôi.`;
  return than;
}

/**
 * Một nhịp quét. Trả về số lời nhắc ĐÃ NÓI ĐƯỢC THẬT.
 *
 * Hàm này không bao giờ ném: một lời nhắc hỏng không được phép giết cả
 * vòng cron, nếu không thì một dòng dữ liệu xấu làm câm toàn bộ lịch.
 */
export async function nhipNhacViec(luc: Date = new Date()): Promise<number> {
  let daNoi = 0;

  try {
    const cu = await dongSoNgayCu(luc);
    if (cu) logger.info('MakerLab chốt sổ lượt treo hôm trước', { soLuot: cu });
  } catch (e) {
    logger.warn('MakerLab không chốt được sổ ngày cũ', { err: String(e) });
  }

  let toiHan: Awaited<ReturnType<typeof quetToiHan>>;
  try {
    toiHan = await quetToiHan(luc);
  } catch (e) {
    logger.error('MakerLab quét kế hoạch thất bại', { err: String(e) });
    return 0;
  }
  if (!toiHan.length) return 0;

  for (const { plan, run, laHoan } of toiHan) {
    try {
      // Robot nào của chủ việc này đang cắm điện. Lấy con online gần
      // nhất — người dùng có thể có nhiều bo, nhưng chỉ con đang sống
      // mới nói được.
      const dev = await prisma.makerDevice.findFirst({
        where: { ownerId: plan.ownerId, status: 'ONLINE' },
        orderBy: { lastSeenAt: 'desc' },
        select: { id: true, projectId: true },
      });
      if (!dev) {
        logger.info('MakerLab tới giờ nhưng không có robot online — để nhịp sau', {
          planId: plan.id, title: plan.title,
        });
        continue; // KHÔNG ghi `nhacLuc`: ân xá còn thì còn thử lại
      }

      const persona = await loadPersona(dev.projectId);
      const noiDuoc = await speakOnce(
        persona,
        cauNhac(plan.title, plan.gio, plan.huongDan, laHoan),
        dev.id,
      );
      if (!noiDuoc) {
        logger.info('MakerLab gửi tiếng không xong — để nhịp sau', { planId: plan.id });
        continue;
      }

      await danhDauDaNhac(run.id, luc);
      // "Xong rồi" sắp tới sẽ trỏ vào ĐÚNG lượt này.
      ghiVuaNhac(dev.id, run.id);
      // Và mở tai sẵn, để không phải gọi tên lại — xem lý do 2 đầu file.
      moCong(dev.id, THUC_SAU_NHAC_GIAY);
      daNoi++;

      logger.info('MakerLab đã nhắc việc', {
        planId: plan.id, runId: run.id, deviceId: dev.id, title: plan.title, laHoan,
      });
    } catch (e) {
      logger.error('MakerLab nhắc việc lỗi', { planId: plan.id, err: String(e) });
    }
  }

  return daNoi;
}
