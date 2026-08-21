import type { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';

// ════════════════════════════════════════════════════════════════
// BÁO HIỆU GỌI THOẠI 1-1
//
// Chỉ chuyển tiếp bản mô tả kết nối (SDP) và đường đi mạng (ICE) giữa hai
// người. TIẾNG NÓI KHÔNG ĐI QUA ĐÂY — nó đi thẳng máy-tới-máy, hoặc qua TURN
// khi không nối thẳng được. Máy chủ chỉ làm nhiệm vụ giới thiệu.
//
// Tự chứa như `registerListenTogether`: phòng riêng, bộ dọn riêng, nên hỏng ở
// đây không kéo theo tin nhắn hay hiện diện.
// ════════════════════════════════════════════════════════════════

/** Một cuộc gọi đang diễn ra. Giữ trong RAM — cuộc gọi sống vài phút, không
 *  đáng đánh đổi một bảng trong cơ sở dữ liệu. */
interface CuocGoi {
  id: string;
  threadId: number;
  nguoiGoi: number;
  nguoiNhan: number;
  batDau: number;
  /** Đã bắt máy chưa — để biết ghi "cuộc gọi nhỡ" hay "đã gọi N phút". */
  daNhan: boolean;
}

/** userId → cuộc gọi họ đang tham gia. Một người CHỈ một cuộc tại một thời
 *  điểm; đây là thứ trả lời câu "người kia có đang bận không". */
const dangGoi = new Map<number, CuocGoi>();

/** Bên nhận không bấm gì trong 45 giây thì tự huỷ. Không có mốc này thì một
 *  cuộc gọi bị bỏ quên giữ người gọi ở màn "đang đổ chuông" vĩnh viễn. */
const HAN_DO_CHUONG_MS = 45_000;
const hanDoChuong = new Map<string, ReturnType<typeof setTimeout>>();

function phong(userId: number): string {
  return `user:${userId}`;
}

/** Người còn lại của cuộc gọi. */
function benKia(c: CuocGoi, toi: number): number {
  return c.nguoiGoi === toi ? c.nguoiNhan : c.nguoiGoi;
}

function donCuocGoi(c: CuocGoi): void {
  dangGoi.delete(c.nguoiGoi);
  dangGoi.delete(c.nguoiNhan);
  const h = hanDoChuong.get(c.id);
  if (h) { clearTimeout(h); hanDoChuong.delete(c.id); }
}

/**
 * Kết thúc một cuộc gọi và báo cho cả hai bên.
 *
 * Gộp mọi đường kết thúc vào MỘT hàm — cúp máy, từ chối, hết giờ đổ chuông,
 * mất kết nối — vì mỗi đường quên dọn một thứ là để lại rác: người dùng "bận"
 * vĩnh viễn và không ai gọi được cho họ nữa.
 */
function ketThuc(io: Server, c: CuocGoi, boi: number | null, lyDo: string): void {
  donCuocGoi(c);
  const giay = c.daNhan ? Math.round((Date.now() - c.batDau) / 1000) : 0;
  for (const uid of [c.nguoiGoi, c.nguoiNhan]) {
    io.to(phong(uid)).emit('call:end', {
      callId: c.id, threadId: c.threadId, boi, lyDo, giay, daNhan: c.daNhan,
    });
  }
  logger.info('cuộc gọi kết thúc', { callId: c.id, lyDo, giay, daNhan: c.daNhan });
  void ghiLichSu(io, c, giay);
}

/** Số giây thành "2 phút 5 giây". */
function doDai(giay: number): string {
  if (giay < 60) return `${giay} giây`;
  const p = Math.floor(giay / 60), g = giay % 60;
  return g ? `${p} phút ${g} giây` : `${p} phút`;
}

/**
 * Ghi cuộc gọi vào dòng thời gian hội thoại.
 *
 * Dùng lại bảng `Message` với `mediaKind = 'call'` thay vì dựng bảng riêng:
 * cuộc gọi thuộc về đúng chỗ nó xảy ra trong mạch trò chuyện, và cách này
 * không cần migration.
 *
 * ⚠️ Ghi cả cuộc gọi NHỠ — đó mới là thứ người ta cần thấy nhất khi mở máy ra.
 */
async function ghiLichSu(io: Server, c: CuocGoi, giay: number): Promise<void> {
  try {
    const noiDung = c.daNhan
      ? `Cuộc gọi thoại · ${doDai(giay)}`
      : 'Cuộc gọi nhỡ';
    const tin = await prisma.message.create({
      data: {
        threadId: c.threadId,
        senderId: c.nguoiGoi,
        content: noiDung,
        mediaKind: 'call',
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true },
        },
      },
    });
    // Đẩy vào phòng hội thoại để hai bên thấy ngay, không phải tải lại.
    io.to(`thread:${c.threadId}`).emit('thread:new-message', {
      threadId: c.threadId, message: tin,
    });
    // Dời hội thoại lên đầu danh sách, như một tin nhắn thường.
    await prisma.messageThread.update({
      where: { id: c.threadId },
      data: { updatedAt: new Date() },
    }).catch(() => {});
  } catch (err) {
    // Ghi hỏng KHÔNG được làm hỏng việc kết thúc cuộc gọi.
    logger.warn('ghi lịch sử cuộc gọi hỏng', { error: (err as Error).message });
  }
}

export function registerCallSignaling(io: Server, socket: Socket, user: { id: number }): void {
  /** Kiểm quyền: chỉ người THUỘC hội thoại mới được gọi trong đó.
   *
   *  Dùng chính tư cách thành viên phòng làm bằng chứng — lúc kết nối,
   *  `messaging.socket.ts` đã tự cho vào phòng mọi hội thoại của người này sau
   *  khi hỏi cơ sở dữ liệu. Nên không cần hỏi lại mỗi lượt trao ICE (một cuộc
   *  gọi có hàng chục lượt), mà vẫn không hở: người lạ không ở trong phòng. */
  const trongHoiThoai = (threadId: unknown): threadId is number =>
    typeof threadId === 'number'
    && Number.isInteger(threadId)
    && threadId > 0
    && socket.rooms.has(`thread:${threadId}`);

  // ── Bắt đầu gọi ─────────────────────────────────────────────────
  socket.on('call:offer', (p: { threadId: number; toUserId: number; sdp: unknown }) => {
    if (!p || !trongHoiThoai(p.threadId)) return;
    if (typeof p.toUserId !== 'number' || p.toUserId === user.id) return;
    if (!p.sdp) return;

    // Chính mình đang bận — bấm gọi hai lần, hoặc mở hai tab.
    if (dangGoi.has(user.id)) {
      socket.emit('call:busy', { threadId: p.threadId, ai: 'toi' });
      return;
    }
    // Người kia đang bận cuộc khác. Nói rõ ngay thay vì để đổ chuông vô vọng.
    if (dangGoi.has(p.toUserId)) {
      socket.emit('call:busy', { threadId: p.threadId, ai: 'ho' });
      return;
    }

    const c: CuocGoi = {
      // `randomUUID` có sẵn trong Node 22 — không cần thư viện.
      id: crypto.randomUUID(),
      threadId: p.threadId,
      nguoiGoi: user.id,
      nguoiNhan: p.toUserId,
      batDau: Date.now(),
      daNhan: false,
    };
    dangGoi.set(user.id, c);
    dangGoi.set(p.toUserId, c);

    // ⚠️ BÁO MÃ CHO NGƯỜI GỌI NGAY LẬP TỨC.
    //
    // Máy chủ sinh `callId`, nhưng người gọi cần nó để gửi ứng viên ICE —
    // mà ICE bắt đầu bay ra NGAY sau `createOffer`, tức trước khi bên kia
    // bắt máy nhiều giây. Không có mã thì client vứt sạch số ứng viên đó, và
    // cuộc gọi nối được về mặt báo hiệu nhưng KHÔNG BAO GIỜ có tiếng.
    //
    // Triệu chứng đúng như người dùng gặp 21/08/2026: bên nhận đếm 0:38 còn
    // bên gọi vẫn "Đang gọi…", cả hai im lặng.
    socket.emit('call:ringing', { callId: c.id, threadId: c.threadId });

    hanDoChuong.set(c.id, setTimeout(() => {
      // Vẫn còn trong bảng nghĩa là chưa ai bắt máy.
      if (dangGoi.get(c.nguoiGoi)?.id === c.id) ketThuc(io, c, null, 'khong-tra-loi');
    }, HAN_DO_CHUONG_MS));

    // Gửi vào phòng CÁ NHÂN của người nhận, không phải phòng hội thoại: họ
    // phải đổ chuông kể cả khi đang ở màn hình khác.
    //
    // Kèm TÊN người gọi: bên nhận có thể đang mở một hội thoại khác, nên
    // không tra ra tên từ dữ liệu họ đang có. Một truy vấn cho mỗi cuộc gọi
    // là không đáng kể — khác hẳn nếu làm thế ở mỗi lượt trao ICE.
    void (async () => {
      const nguoi = await prisma.user.findUnique({
        where: { id: user.id },
        select: { displayName: true, fullName: true, username: true, avatarUrl: true },
      }).catch(() => null);
      io.to(phong(p.toUserId)).emit('call:incoming', {
        callId: c.id,
        threadId: c.threadId,
        fromUserId: user.id,
        sdp: p.sdp,
        tenNguoiGoi: nguoi?.displayName?.trim() || nguoi?.fullName?.trim()
          || nguoi?.username?.trim() || 'Người dùng',
        anhNguoiGoi: nguoi?.avatarUrl ?? null,
      });
    })();
    logger.info('cuộc gọi bắt đầu', { callId: c.id, tu: user.id, den: p.toUserId });
  });

  // ── Bắt máy ─────────────────────────────────────────────────────
  socket.on('call:answer', (p: { callId: string; sdp: unknown }) => {
    const c = dangGoi.get(user.id);
    if (!c || !p || c.id !== p.callId || c.nguoiNhan !== user.id || !p.sdp) return;
    c.daNhan = true;
    // Đã bắt máy thì bỏ đồng hồ đổ chuông, không thì 45 giây sau nó cúp giữa
    // cuộc đang nói.
    const h = hanDoChuong.get(c.id);
    if (h) { clearTimeout(h); hanDoChuong.delete(c.id); }
    c.batDau = Date.now();   // tính thời lượng từ lúc BẮT MÁY
    io.to(phong(c.nguoiGoi)).emit('call:answered', { callId: c.id, sdp: p.sdp });
  });

  // ── Trao đổi đường đi mạng ──────────────────────────────────────
  socket.on('call:ice', (p: { callId: string; candidate: unknown }) => {
    const c = dangGoi.get(user.id);
    if (!c || !p || c.id !== p.callId || !p.candidate) return;
    io.to(phong(benKia(c, user.id))).emit('call:ice', {
      callId: c.id, candidate: p.candidate,
    });
  });

  // ── Từ chối / cúp máy ───────────────────────────────────────────
  socket.on('call:reject', (p: { callId: string }) => {
    const c = dangGoi.get(user.id);
    if (!c || !p || c.id !== p.callId) return;
    ketThuc(io, c, user.id, 'tu-choi');
  });

  socket.on('call:end', (p: { callId: string }) => {
    const c = dangGoi.get(user.id);
    if (!c || !p || c.id !== p.callId) return;
    ketThuc(io, c, user.id, 'cup-may');
  });

  // ── Mất kết nối giữa cuộc gọi ───────────────────────────────────
  socket.on('disconnect', () => {
    const c = dangGoi.get(user.id);
    if (!c) return;
    // ⚠️ Chỉ kết thúc khi người này KHÔNG còn socket nào khác. Mở hai tab thì
    // đóng một tab không được cúp máy của tab kia.
    const conSocket = Array.from(io.sockets.sockets.values())
      .some((s) => s.id !== socket.id
                && (s.data.user as { id: number } | undefined)?.id === user.id);
    if (conSocket) return;
    ketThuc(io, c, user.id, 'mat-ket-noi');
  });
}

/** Ai đang bận — dùng cho phần kiểm tra và cho trang quản trị. */
export function soCuocGoiDangChay(): number {
  return new Set(Array.from(dangGoi.values()).map((c) => c.id)).size;
}
