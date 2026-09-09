/**
 * ============================================================
 * BỐI CẢNH HÔM NAY — cho trợ lý trả lời "hôm nay tôi làm gì?"
 * ============================================================
 *
 * Gom lịch học, lịch thi và việc cần làm của MỘT người thành một khối chữ
 * ngắn, nhét vào system prompt. Model đọc thẳng từ đó.
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG TOOL-CALLING. Cách "chuẩn sách vở" là cho model tự
 * gọi tool lấy lịch, rồi gọi tiếp lấy việc. Nhưng đó là 3-4 lượt qua lại,
 * mỗi lượt một khoảng chờ — mà bậc Mini được chọn CHÍNH VÌ nó nhanh. Tính
 * sẵn rồi nhét vào là một lượt duy nhất, tốc độ giữ nguyên.
 *
 * ⚠️ KHỐI NÀY ĐI QUA CỔNG LLM BÊN THỨ BA. Nên chỉ có thứ cần để trả lời
 * câu hỏi về lịch và việc. KHÔNG email, KHÔNG thanh toán, KHÔNG nội dung
 * tin nhắn, KHÔNG ghi chú cá nhân. Thêm trường mới vào đây là một quyết
 * định về quyền riêng tư, không phải một tiện ích.
 *
 * ⚠️ "HÔM NAY" DO CLIENT QUYẾT. Container chạy UTC còn người dùng ở +07:
 * tự tính ngày ở máy chủ là 7 tiếng mỗi tối lịch bị lệch sang hôm sau. Máy
 * của người dùng biết chắc bây giờ là mấy giờ; máy chủ thì không.
 */
import { prisma } from '../../config/database.js';

/** 2 = thứ Hai … 8 = Chủ nhật, cùng hệ với `ClassSchedule.weekday`. */
const TEN_THU: Record<number, string> = {
  2: 'thứ Hai', 3: 'thứ Ba', 4: 'thứ Tư', 5: 'thứ Năm',
  6: 'thứ Sáu', 7: 'thứ Bảy', 8: 'Chủ nhật',
};

export function thuTuNgay(iso: string): number {
  // Neo 12:00Z: không múi giờ nào kéo lệch sang ngày khác.
  const d = new Date(`${iso}T12:00:00.000Z`);
  const js = d.getUTCDay();            // 0 = CN … 6 = T7
  return js === 0 ? 8 : js + 1;        // → 2..8
}

function phut(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function ngayVN(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export interface NguonBoiCanh {
  buoiHoc: Array<{ subject: string; classCode: string | null; room: string | null; startTime: string; endTime: string }>;
  lichThi: Array<{ monHoc: string; loai: string; ngay: string; batDau: string; phong: string | null; soBaoDanh: string | null }>;
  viec: Array<{ title: string; done: boolean; priority: number; dueAt: string | null }>;
}

/**
 * Dựng khối chữ. Tách khỏi phần truy vấn để kiểm được mà không cần database.
 *
 * Cố ý NGẮN: mỗi token ở đây là token model phải đọc trước khi mở miệng.
 */
export function dungKhoi(nguon: NguonBoiCanh, homNay: string, gioPhut?: string): string {
  const thu = thuTuNgay(homNay);
  const dong: string[] = [`Hôm nay là ${TEN_THU[thu] ?? '?'}, ngày ${ngayVN(homNay)}${gioPhut ? `, bây giờ ${gioPhut}` : ''}.`];

  if (nguon.buoiHoc.length) {
    const bg = gioPhut ? phut(gioPhut) : null;
    dong.push('Lịch học hôm nay:');
    for (const b of [...nguon.buoiHoc].sort((x, y) => phut(x.startTime) - phut(y.startTime))) {
      const ten = b.classCode ? `${b.classCode} (${b.subject})` : b.subject;
      let trangThai = '';
      if (bg !== null) {
        const bd = phut(b.startTime), kt = phut(b.endTime);
        if (bg < bd) trangThai = ` — còn ${bd - bg} phút nữa vào học`;
        else if (bg < kt) trangThai = ' — ĐANG HỌC';
        else trangThai = ' — đã xong';
      }
      dong.push(`- ${b.startTime}–${b.endTime} ${ten}${b.room ? ` phòng ${b.room}` : ''}${trangThai}`);
    }
  } else {
    dong.push('Hôm nay không có buổi học nào trên thời khoá biểu.');
  }

  if (nguon.lichThi.length) {
    dong.push('Lịch thi sắp tới:');
    for (const t of nguon.lichThi) {
      dong.push(`- ${ngayVN(t.ngay)} ${t.batDau} thi ${t.loai} môn ${t.monHoc}`
        + `${t.phong ? ` phòng ${t.phong}` : ''}${t.soBaoDanh ? `, số báo danh ${t.soBaoDanh}` : ''}`);
    }
  }

  const chuaXong = nguon.viec.filter((v) => !v.done);
  const daXong = nguon.viec.length - chuaXong.length;
  if (chuaXong.length) {
    dong.push(`Việc chưa xong (${chuaXong.length}):`);
    // Ưu tiên cao lên trước — nếu model chỉ kịp nhắc vài việc thì phải là
    // những việc này.
    for (const v of [...chuaXong].sort((a, b) => b.priority - a.priority).slice(0, 12)) {
      dong.push(`- ${v.title}${v.dueAt ? ` (hạn ${v.dueAt})` : ''}`);
    }
  } else if (nguon.viec.length) {
    dong.push('Mọi việc hôm nay đã xong.');
  }
  if (daXong > 0 && chuaXong.length) dong.push(`Đã xong ${daXong} việc.`);

  return dong.join('\n');
}

/** Lấy dữ liệu rồi dựng khối. Trả chuỗi RỖNG khi không có gì để nói. */
export async function boiCanhHomNay(opts: {
  userId: number;
  homNay: string;
  gioPhut?: string;
}): Promise<string> {
  const { userId, homNay } = opts;
  const thu = thuTuNgay(homNay);
  const moc = new Date(`${homNay}T00:00:00.000Z`);
  const sau14 = new Date(moc); sau14.setUTCDate(sau14.getUTCDate() + 14);

  const [buoiHoc, lichThi, viec] = await Promise.all([
    prisma.classSchedule.findMany({
      where: {
        userId,
        weekday: thu,
        // Kỳ đã hết hoặc chưa tới thì không phải lịch của hôm nay.
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: moc } }] },
          { OR: [{ endDate: null }, { endDate: { gte: moc } }] },
        ],
      },
      select: { subject: true, classCode: true, room: true, startTime: true, endTime: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.lichThi.findMany({
      where: { userId, ngay: { gte: moc, lte: sau14 } },
      select: { monHoc: true, loai: true, ngay: true, batDau: true, phong: true, soBaoDanh: true },
      orderBy: [{ ngay: 'asc' }, { batDau: 'asc' }],
      take: 8,
    }),
    prisma.dashboardTask.findMany({
      where: { userId, archivedAt: null, date: homNay },
      select: { title: true, done: true, priority: true, dueAt: true },
      take: 40,
    }),
  ]);

  return dungKhoi(
    {
      buoiHoc,
      lichThi: lichThi.map((t) => ({ ...t, ngay: t.ngay.toISOString().slice(0, 10) })),
      viec: viec.map((v) => ({ ...v, dueAt: v.dueAt ? v.dueAt.toISOString().slice(11, 16) : null })),
    },
    homNay,
    opts.gioPhut,
  );
}
