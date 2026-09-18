/**
 * CỐ VẤN TIỀN NONG — AI đọc số liệu THẬT của người dùng rồi khuyên.
 * ─────────────────────────────────────────────────────────────────────
 * Hai đường vào:
 *
 *  · `tomTatCoVan()` — không cần câu hỏi. Dùng cho thẻ "AI quản lí" ở đầu
 *    màn Tiền nong và cho lời nhắc 20h.
 *  · `hoiCoVan(cauHoi)` — người dùng hỏi thẳng ("tháng này tôi tiêu quá tay
 *    chỗ nào?", "nên trả khoản nào trước?").
 *
 * ⚠️ MỌI CON SỐ DO MÃ TÍNH, KHÔNG ĐỂ MODEL TỰ CỘNG. Đây là tiền: một tổng
 * bị model cộng nhầm rồi nói trôi chảy còn tệ hơn hẳn một lỗi hiện ra. Model
 * chỉ được DIỄN GIẢI cái bảng đã tính sẵn — cùng luật với `plan_review`.
 *
 * ⚠️ Thiếu khoá AI thì vẫn TRẢ SỐ LIỆU. Phần đắt giá nhất ở đây là mấy con
 * số (còn bao nhiêu, nợ nào tới hạn, vượt mục tiêu chưa) — chúng do mã tính.
 * Trả rỗng chỉ vì thiếu khoá là vứt đi thứ vẫn dùng được.
 */
import { prisma } from '../../config/database.js';
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { getDashboard } from './dashboard.service.js';
import { layMucTieu, ngayVN } from './nhacNhiem.service.js';

/** Bảng số liệu đã tính sẵn — thứ DUY NHẤT model được nhìn. */
export async function soLieuCoVan(userId: number) {
  const homNay = ngayVN();
  const thang = homNay.slice(0, 7);

  const [bang, mt, noSapToi, chiGanDay] = await Promise.all([
    getDashboard(userId, thang),
    layMucTieu(userId),
    prisma.debtScheduleItem.findMany({
      where: { userId, isPaid: false },
      select: {
        dueDate: true, amountDue: true,
        debt: { select: { lenderName: true, status: true, interestRate: true, interestType: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 12,
    }),
    // 7 ngày gần nhất theo NHÓM — để model nói được "ăn uống đang phình",
    // chứ danh sách 200 khoản lẻ thì nó chỉ đọc được một phần rồi đoán nốt.
    prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId, date: { gte: new Date(new Date(`${homNay}T00:00:00.000Z`).getTime() - 6 * 86400000) } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const tenNhom = new Map(
    (await prisma.expenseCategory.findMany({ where: { userId }, select: { id: true, name: true } }))
      .map((c) => [c.id, c.name]),
  );

  return {
    thang,
    homNay,
    tongSoDu: Number(bang.totalBalance),
    giaTriRong: Number(bang.netWorth),
    tongNoConLai: Number(bang.totalRemainingDebt),
    tongTietKiem: Number(bang.totalSavings),
    tongDauTu: Number(bang.totalAssetValue),
    thuThangNay: Number(bang.incomeThisMonth),
    chiThangNay: Number(bang.expenseThisMonth),
    deDanhThangNay: Number(bang.savingsThisMonth),
    tiLeChiTrenThu: bang.spendingVsIncomePct,
    mucTieu: mt.mucTieu,
    vuotNganSach: bang.budgets
      .filter((b) => b.status !== 'ok')
      .map((b) => ({ nhom: b.category.name, nganSach: Number(b.budget), daTieu: Number(b.used), tiLe: b.ratio })),
    noSapToi: noSapToi
      .filter((k) => k.debt?.status !== 'PAID_OFF')
      .map((k) => ({
        chuNo: k.debt?.lenderName ?? '(không rõ)',
        ngayToiHan: ngayVN(k.dueDate),
        soTien: Number(k.amountDue),
        quaHan: ngayVN(k.dueDate) < homNay,
        laiSuat: Number(k.debt?.interestRate ?? 0),
        kieuLai: k.debt?.interestType ?? null,
      })),
    chi7Ngay: chiGanDay
      .map((g) => ({ nhom: tenNhom.get(g.categoryId) ?? '(chưa phân nhóm)', tong: Number(g._sum?.amount ?? 0), soLan: g._count._all }))
      .sort((a, b) => b.tong - a.tong)
      .slice(0, 8),
    topNhomThangNay: bang.expenseByCategory
      .slice(0, 6)
      .map((e) => ({ nhom: e.category?.name ?? '(chưa phân nhóm)', tong: Number(e.total) })),
  };
}

const LUAT = [
  'Bạn là cố vấn tiền nong, nói TIẾNG VIỆT, thẳng và ngắn.',
  'CHỈ dùng những con số trong bảng đã cho. TUYỆT ĐỐI không tự cộng lại, không ước lượng, không bịa thêm số nào.',
  'Số tiền viết theo kiểu Việt Nam (1.500.000₫).',
  'Ưu tiên theo thứ tự: nợ QUÁ HẠN → nợ tới hạn trong 7 ngày → vượt mục tiêu/ngân sách → chi tiêu đang phình → để dành.',
  'Không khen xã giao, không mở bài, không chúc. Không khuyên chung chung kiểu "hãy tiết kiệm hơn".',
  'Không đưa lời khuyên đầu tư cụ thể (mua/bán mã nào) — bạn không phải chuyên viên tư vấn đầu tư có giấy phép.',
].join('\n');

/** Tóm tắt không cần câu hỏi — cho thẻ "AI quản lí" và lời nhắc 20h. */
export async function tomTatCoVan(userId: number): Promise<{ nhanXet: string | null; so: Awaited<ReturnType<typeof soLieuCoVan>>; lyDo?: string }> {
  const so = await soLieuCoVan(userId);
  if (!isAiAvailable()) return { nhanXet: null, so, lyDo: 'ai_unavailable' };

  const kq = await llmComplete({
    step: 'generation',
    purpose: 'finance_advisor',
    feature: 'chat',
    userId,
    maxTokens: 420,
    system: `${LUAT}\nViết TỐI ĐA 4 gạch đầu dòng, mỗi dòng dưới 24 từ. Nếu mọi thứ đang ổn thì nói đúng một dòng là ổn.`,
    messages: [{ role: 'user', content: `Số liệu tiền nong của tôi (đã tính sẵn):\n${JSON.stringify(so)}` }],
  });
  return { nhanXet: kq?.text?.trim() || null, so };
}

/** Người dùng hỏi thẳng một câu. */
export async function hoiCoVan(userId: number, cauHoi: string): Promise<{ traLoi: string | null; so: Awaited<ReturnType<typeof soLieuCoVan>>; lyDo?: string }> {
  const so = await soLieuCoVan(userId);
  if (!isAiAvailable()) return { traLoi: null, so, lyDo: 'ai_unavailable' };

  const kq = await llmComplete({
    step: 'generation',
    purpose: 'finance_advisor',
    feature: 'chat',
    userId,
    maxTokens: 700,
    system: `${LUAT}\nTrả lời ĐÚNG câu được hỏi, tối đa 6 câu hoặc 6 gạch đầu dòng.\n`
      + 'Nếu bảng số liệu KHÔNG đủ để trả lời thì nói thẳng là chưa có dữ liệu, đừng đoán.',
    messages: [{
      role: 'user',
      content: `Số liệu tiền nong của tôi (đã tính sẵn):\n${JSON.stringify(so)}\n\nCâu hỏi: ${cauHoi}`,
    }],
  });
  return { traLoi: kq?.text?.trim() || null, so };
}
