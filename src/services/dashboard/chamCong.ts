/**
 * ============================================================
 * CHẤM ĐIỂM DANH — áp điểm uy tín lên DB
 * ============================================================
 *
 * Phần TÍNH nằm ở `uyTin.ts` (thuần, kiểm được không cần Postgres).
 * Tệp này chỉ lo chuyện ghi: sổ cái, trần cộng theo ngày, và vòng
 * quét việc quá hạn.
 *
 * ─── Vì sao quét LƯỜI, không dùng cron ───
 * Cron là cách hiển nhiên, và nó sai ở đây: nó chạy cho TOÀN BỘ người
 * dùng mỗi phút để phục vụ một nhúm người đang mở app, và nếu container
 * restart đúng lúc thì cả một nhịp quét biến mất mà không ai biết.
 *
 * Quét lười — mỗi lần chính người dùng đó đọc Tổng quan hoặc dò nhắc —
 * cho ra cùng kết quả, rẻ hơn nhiều bậc, và tự lành: bỏ lỡ bao nhiêu
 * nhịp cũng không sao vì `truotLuc` được tính từ MỐC THỜI GIAN chứ
 * không từ "lúc vòng quét chạy". Mở app sau ba ngày vắng thì ba ngày
 * đó được chấm đúng một lượt, đúng kết quả.
 */

import { prisma } from '../../config/database.js';

import {
  mocHetGio, mucCong, mucTru, mucTruTre, thucCong, UY_TIN_DAU,
} from './uyTin.js';

export type LoaiGhi = 'truot' | 'tre' | 'xong' | 'hoan-tac' | 'tay';

/** YYYY-MM-DD theo giờ VIỆT NAM (+07), không theo UTC của container. */
export function ngayVN(d: Date = new Date()): string {
  return new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

/**
 * Cộng/trừ uy tín và ghi MỘT dòng sổ.
 *
 * Trả về điểm sau khi áp. `delta = 0` vẫn không ghi gì — một dòng sổ
 * "±0" chỉ làm loãng lịch sử.
 *
 * ⚠️ Trần cộng theo ngày áp Ở ĐÂY chứ không ở chỗ gọi: có ba đường
 * khác nhau cùng cộng điểm (tích xong, hoàn tác trượt, chỉnh tay), và
 * để mỗi đường tự nhớ áp trần là để ngỏ đúng ba cơ hội quên.
 */
export async function ghiUyTin(
  userId: number,
  delta: number,
  loai: LoaiGhi,
  lyDo: string,
  taskId?: number | null,
  bayGio: Date = new Date(),
): Promise<{ diem: number; thuc: number }> {
  const homNay = ngayVN(bayGio);

  return prisma.$transaction(async (tx) => {
    const st = await tx.dashboardState.upsert({
      where: { userId },
      create: { userId, uyTin: UY_TIN_DAU },
      update: {},
    });

    /* Bộ đếm cộng trong ngày: sang ngày mới thì về 0. */
    const daCong = st.congNgay === homNay ? st.congTrongNgay : 0;

    /* ⚠️ HOÀN TÁC KHÔNG chịu trần ngày — và đây là lỗi tìm ra bằng cách
       CHẠY, không phải bằng cách đọc.
       Trần sinh ra để chặn CÀY ĐIỂM MỚI. Trả lại điểm đã trừ không phải
       cày. Để trần ăn cả phần hoàn thì `POST /tasks/:id/hoan` sinh ra một
       trạng thái mâu thuẫn hẳn hoi: việc được xoá cờ trượt và `daTruUyTin`
       về null — tức hồ sơ nói "chưa từng bị trừ" — nhưng điểm thì đã mất
       và không đường nào lấy lại.
       Không có đường lạm dụng: muốn hoàn thì trước đó phải bị TRỪ đúng
       ngần ấy, nên tổng cộng không bao giờ dương. */
    const hoanTac = loai === 'hoan-tac';
    const thuc = thucCong(delta, hoanTac, daCong);

    if (thuc === 0) return { diem: st.uyTin, thuc: 0 };

    const diem = st.uyTin + thuc;
    await tx.dashboardState.update({
      where: { userId },
      data: {
        uyTin: diem,
        congNgay: homNay,
        congTrongNgay: thuc > 0 && !hoanTac ? daCong + thuc : daCong,
      },
    });
    await tx.dashboardUyTinLog.create({
      data: { userId, delta: thuc, diemSau: diem, loai, lyDo: lyDo.slice(0, 300), taskId: taskId ?? null },
    });
    return { diem, thuc };
  });
}

export interface KetQuaQuet {
  truot: Array<{ id: number; title: string; tru: number }>;
  diem: number | null;
}

/**
 * Quét việc QUÁ HẠN chưa chấm xong → đánh trượt, trừ điểm, ghi sổ.
 *
 * Idempotent nhờ `truotLuc: null` trong điều kiện lọc: quét lại lần
 * hai không trừ thêm lần nào nữa.
 *
 * ⚠️ Việc KHÔNG có mốc hết giờ thì KHÔNG bao giờ bị đánh trượt. Đây
 * không phải chi tiết nhỏ: gần như toàn bộ việc đang có trong DB đều
 * chưa đặt giờ, và bỏ chốt này là trừ sạch uy tín của mọi người dùng
 * ngay đêm deploy đầu tiên, vì những việc họ tạo từ tháng trước.
 */
export async function quetQuaHan(userId: number, bayGio: Date = new Date()): Promise<KetQuaQuet> {
  const ungVien = await prisma.dashboardTask.findMany({
    where: {
      userId,
      done: false,
      archivedAt: null,
      truotLuc: null,
      /* Lọc thô ở DB cho rẻ; lọc tinh bằng `mocHetGio` ở dưới, vì hạn
         suy ra từ `batDauAt + phutLam` không diễn đạt được bằng WHERE. */
      OR: [{ dueAt: { not: null } }, { batDauAt: { not: null } }],
    },
    take: 200,
    orderBy: { dueAt: 'asc' },
  });

  const truot: KetQuaQuet['truot'] = [];
  let diem: number | null = null;

  for (const t of ungVien) {
    const moc = mocHetGio(t);
    if (!moc || moc.getTime() > bayGio.getTime()) continue;

    const tru = mucTru(t.doKho, t.priority);
    await prisma.dashboardTask.update({
      where: { id: t.id },
      data: { truotLuc: moc, daTruUyTin: tru },
    });
    const kq = await ghiUyTin(userId, -tru, 'truot', `Hết giờ mà chưa tích xong: ${t.title}`, t.id, bayGio);
    diem = kq.diem;
    truot.push({ id: t.id, title: t.title, tru });
  }

  return { truot, diem };
}

export interface KetQuaTich {
  delta: number;
  diem: number | null;
  loai: LoaiGhi | null;
  /** Câu ngắn để giao diện hiện ngay, đã viết sẵn cho người đọc. */
  cau: string | null;
}

/**
 * Người dùng vừa TÍCH XONG một việc. Ba ngả, và chúng khác nhau thật:
 *
 * - đúng hạn        → cộng 1..3
 * - trễ (chưa bị đánh trượt) → trừ một nửa
 * - đã bị đánh trượt rồi     → HOÀN LẠI một nửa số đã trừ
 *
 * Ngả thứ ba là ngả quan trọng nhất về mặt hành vi: không có nó thì
 * một việc đã trượt là việc chết, và người dùng không còn lý do gì để
 * làm nốt nó.
 */
export async function khiTichXong(
  userId: number,
  t: {
    id: number; title: string; doKho: number; priority: number;
    dueAt: Date | null; batDauAt: Date | null; phutLam: number | null;
    truotLuc: Date | null; daTruUyTin: number | null;
  },
  bayGio: Date = new Date(),
): Promise<KetQuaTich> {
  if (t.truotLuc) {
    const daTru = t.daTruUyTin ?? mucTru(t.doKho, t.priority);
    /* Hoàn lại một NỬA số ĐÃ TRỪ — dùng `daTruUyTin` chứ không tính
       lại bằng công thức: công thức có thể đã đổi từ lúc trừ, và khi
       đó hoàn lại sẽ ra một con số không khớp với dòng sổ đã ghi. */
    const hoan = Math.floor(daTru / 2);
    if (hoan <= 0) return { delta: 0, diem: null, loai: null, cau: 'Đã xong (muộn) — không hoàn lại điểm vì mức trừ quá nhỏ.' };
    const kq = await ghiUyTin(userId, hoan, 'hoan-tac', `Làm nốt việc đã trượt: ${t.title}`, t.id, bayGio);
    return { delta: kq.thuc, diem: kq.diem, loai: 'hoan-tac', cau: `Làm nốt việc đã trượt — hoàn lại +${kq.thuc} uy tín.` };
  }

  const moc = mocHetGio(t);
  if (moc && moc.getTime() < bayGio.getTime()) {
    const tru = mucTruTre(t.doKho, t.priority);
    if (tru <= 0) return { delta: 0, diem: null, loai: null, cau: 'Xong muộn — việc nhẹ nên không trừ điểm.' };
    const kq = await ghiUyTin(userId, -tru, 'tre', `Xong muộn: ${t.title}`, t.id, bayGio);
    return { delta: kq.thuc, diem: kq.diem, loai: 'tre', cau: `Xong muộn — trừ ${tru} uy tín (trượt hẳn sẽ trừ ${mucTru(t.doKho, t.priority)}).` };
  }

  const cong = mucCong(t.doKho, t.priority);
  const kq = await ghiUyTin(userId, cong, 'xong', `Xong đúng hạn: ${t.title}`, t.id, bayGio);
  if (kq.thuc === 0) return { delta: 0, diem: kq.diem, loai: null, cau: 'Xong đúng hạn — hôm nay đã chạm trần cộng điểm.' };
  return { delta: kq.thuc, diem: kq.diem, loai: 'xong', cau: `Xong đúng hạn +${kq.thuc} uy tín.` };
}

/**
 * Bỏ tích một việc đã xong.
 *
 * KHÔNG thu lại điểm đã cộng. Nghe có vẻ hở, nhưng đường lạm dụng
 * (tích → bỏ tích → tích lại để cộng nhiều lần) đã bị trần cộng theo
 * ngày chặn rồi. Còn thu lại điểm thì phạt oan ca thật và thường gặp
 * hơn nhiều: bấm nhầm rồi bấm lại.
 */
export async function layUyTin(userId: number): Promise<{ diem: number; so: Array<{
  delta: number; diemSau: number; loai: string; lyDo: string; luc: string;
}> }> {
  const [st, so] = await Promise.all([
    prisma.dashboardState.findUnique({ where: { userId }, select: { uyTin: true } }),
    prisma.dashboardUyTinLog.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' }, take: 50,
    }),
  ]);
  return {
    diem: st?.uyTin ?? UY_TIN_DAU,
    so: so.map((r) => ({
      delta: r.delta, diemSau: r.diemSau, loai: r.loai, lyDo: r.lyDo, luc: r.createdAt.toISOString(),
    })),
  };
}
