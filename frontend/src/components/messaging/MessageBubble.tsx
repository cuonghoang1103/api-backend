'use client';

/**
 * MỘT tin nhắn trong khung chat — bố cục kiểu Messenger (14/10/2026).
 *
 * ─── Vì sao viết lại ───
 * Bản cũ: mỗi bong bóng tự quyết có vẽ ảnh đại diện không, và ô ảnh đại diện
 * RỘNG 0 khi không vẽ ⇒ bong bóng của người kia thụt ra thụt vào theo từng
 * tin; ảnh đại diện nằm ở tin ĐẦU cụm; dưới MỖI tin có một nút "+" chiếm
 * nguyên một hàng. Người dùng chụp màn hình gửi về, nhiều người phàn nàn.
 *
 * ─── Luật bố cục ───
 *   · Tin đến: một RÃNH TRÁI cố định 28 px cho ảnh đại diện ở MỌI tin ⇒ mọi
 *     bong bóng đến bắt đầu cùng một x. Ảnh chỉ vẽ ở tin CUỐI cụm, đáy ngang
 *     đáy bong bóng.
 *   · Góc bo 18 px; góc "trong" (phía người gửi, giữa hai tin cùng cụm) 4 px.
 *   · Thanh công cụ (😊 · ↩ · ⋮) hiện khi rê chuột / nhấn giữ, đặt TUYỆT ĐỐI
 *     cạnh bong bóng ⇒ không xô lệch bố cục.
 *   · Cảm xúc: viên nhỏ đè góc dưới bong bóng.
 *   · Giờ + dấu đã xem: dưới tin CUỐI cụm; tin nào cũng có giờ đầy đủ ở tooltip.
 */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Trash2, FileText, Download, Check, CheckCheck, Undo2, Reply, Copy, CopyCheck, ImageDown,
  MoreVertical, Smile, Forward, Flag,
} from 'lucide-react';
import type { MessagingMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { linkifyToNodes } from '@/lib/linkify';
import { chuMotTin, chepDuoc } from '@/lib/tinNhan/chep';
import { chepAnhVaoClipboard } from '@/lib/tinNhan/anh';
import { luuAnhVeMay } from '@/lib/tinNhan/luuAnh';
import type { ViTriTrongCum } from '@/lib/tinNhan/nhom';
import { ChipCamXuc, ChonCamXuc } from './ReactionBar';
import PopoverNeo from './PopoverNeo';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.cuongthai.com';

// Ensure attachment URLs are absolute. Old serializer produced relative
// "/uploads/..." paths; new serializer returns full URLs from the storage
// provider. This guard handles both so cached/old messages still render.
export function resolveUrl(url: string): string {
  if (!url) return url;
  if (/^(https?:|blob:|data:)/.test(url)) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

const RECALL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const NHAN_GIU_MS = 450;

/** Góc bo theo vị trí trong cụm. `ben` = phía người gửi (trái: tin đến). */
function gocBo(viTri: ViTriTrongCum, ben: 'trai' | 'phai'): string {
  const L = ben === 'trai';
  switch (viTri) {
    case 'mot': return 'rounded-[18px]';
    case 'dau': return L ? 'rounded-[18px] rounded-bl-[4px]' : 'rounded-[18px] rounded-br-[4px]';
    case 'giua': return L ? 'rounded-[18px] rounded-l-[4px]' : 'rounded-[18px] rounded-r-[4px]';
    case 'cuoi': return L ? 'rounded-[18px] rounded-tl-[4px]' : 'rounded-[18px] rounded-tr-[4px]';
  }
}

function AnhDaiDien({ src, ten }: { src?: string | null; ten: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={ten} className="h-7 w-7 rounded-full object-cover" />
  ) : (
    <div
      className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
    >
      {ten.charAt(0).toUpperCase()}
    </div>
  );
}

function MessageBubble({
  message,
  isOwn,
  viTri = 'mot',
  hienTen = false,
  cheDoChon = false,
  onReply,
  onChonNhieu,
  onMoAnh,
  onChuyenTiep,
}: {
  message: MessagingMessage;
  isOwn: boolean;
  /** Vị trí trong cụm tin liên tiếp của cùng người gửi. */
  viTri?: ViTriTrongCum;
  /** Tên người gửi trên tin đầu cụm — CHỈ hội thoại nhóm (1-1 thì thừa). */
  hienTen?: boolean;
  /** Đang ở chế độ chọn nhiều tin: tắt thanh công cụ. */
  cheDoChon?: boolean;
  onReply?: (message: MessagingMessage) => void;
  onChonNhieu?: (messageId: number) => void;
  onMoAnh?: (url: string) => void;
  onChuyenTiep?: (message: MessagingMessage) => void;
}) {
  const myId = useAuthStore((s) => s.user?.id);
  const roles = useAuthStore((s) => (s.user as { roles?: string[] } | null)?.roles);
  const [moCamXuc, datMoCamXuc] = useState(false);
  const [moMenu, datMoMenu] = useState(false);
  /** Thanh công cụ GHIM hiện (nhấn giữ trên màn cảm ứng, hoặc đang mở popover). */
  const [ghimCongCu, datGhimCongCu] = useState(false);
  const nutCamXuc = useRef<HTMLButtonElement>(null);
  const nutMenu = useRef<HTMLButtonElement>(null);
  const hang = useRef<HTMLDivElement>(null);
  const hengio = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chạm ra ngoài hàng thì gỡ thanh công cụ đã ghim bằng nhấn giữ.
  useEffect(() => {
    if (!ghimCongCu || moCamXuc || moMenu) return;
    const ngoai = (e: Event) => {
      if (!hang.current?.contains(e.target as Node)) datGhimCongCu(false);
    };
    document.addEventListener('pointerdown', ngoai, true);
    return () => document.removeEventListener('pointerdown', ngoai, true);
  }, [ghimCongCu, moCamXuc, moMenu]);

  const dongCamXuc = useCallback(() => { datMoCamXuc(false); datGhimCongCu(false); }, []);
  const dongMenu = useCallback(() => { datMoMenu(false); datGhimCongCu(false); }, []);

  const isAdmin = !!roles?.some((r) => ['admin', 'ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'].includes(r));
  const orderCodeHref = isAdmin ? (code: string) => `/admin/orders?code=${code}` : undefined;

  if (message.recalled || message.deleted) {
    return (
      <div className={cn('my-1 flex', isOwn ? 'justify-end pr-1' : 'justify-start pl-9')}>
        <span className="rounded-[18px] border border-white/10 px-3 py-1.5 text-[12px] italic text-text-muted">
          {message.recalled ? 'Tin nhắn đã thu hồi' : 'Tin nhắn đã được xoá'}
        </span>
      </div>
    );
  }

  const senderName = message.sender?.displayName ?? message.sender?.username ?? 'Người dùng';
  const isOptimistic = message.id < 0;
  const isRead = isOwn && Array.isArray(message.readBy) && message.readBy.length > 0;
  const ageMs = Date.now() - new Date(message.createdAt).getTime();
  const canRecall = isOwn && !isOptimistic && ageMs < RECALL_WINDOW_MS;
  const laCuoiCum = viTri === 'cuoi' || viTri === 'mot';
  const ben: 'trai' | 'phai' = isOwn ? 'phai' : 'trai';
  const bo = gocBo(viTri, ben);

  const anhDinhKem = (message.attachments ?? []).filter((a) => a.mimeType.startsWith('image/'));
  const tepKhac = (message.attachments ?? []).filter((a) => !a.mimeType.startsWith('image/'));
  const gif = message.mediaUrl && message.mediaKind === 'gif' ? message.mediaUrl : null;
  const sticker = message.mediaUrl && message.mediaKind === 'sticker' ? message.mediaUrl : null;
  const coBong = !!message.content || !!message.parentMessage || tepKhac.length > 0 || !!message.postShare;
  const anhDauTien = anhDinhKem[0] ? resolveUrl(anhDinhKem[0].url) : gif;
  const reactions = message.reactions ?? [];
  const coCamXuc = reactions.some((r) => r.count > 0);

  const toggleReaction = (emoji: string) => {
    dongCamXuc();
    if (isOptimistic) return;
    void useMessagingStore.getState().toggleReaction(message.threadId, message.id, emoji);
  };

  const batDauNhanGiu = (e: React.TouchEvent) => {
    if (cheDoChon || e.touches.length !== 1) return;
    hengio.current = setTimeout(() => {
      datGhimCongCu(true);
      try { navigator.vibrate?.(12); } catch { /* không rung được thì thôi */ }
    }, NHAN_GIU_MS);
  };
  const huyNhanGiu = () => { if (hengio.current) { clearTimeout(hengio.current); hengio.current = null; } };

  const thucHien = async (viec: () => Promise<void> | void) => {
    dongMenu();
    try { await viec(); } catch (e) {
      const err = e as { userFriendlyMessage?: string; message?: string };
      toast.error(err?.userFriendlyMessage ?? err?.message ?? 'Không thực hiện được');
    }
  };

  const bongNen = isOwn
    ? { background: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)' }
    : { background: '#2a2b36' };

  const thanhCongCu = !cheDoChon && !isOptimistic && (
    <div
      className={cn(
        'absolute top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 transition-opacity duration-100',
        isOwn ? 'right-full mr-1.5 flex-row-reverse' : 'left-full ml-1.5',
        ghimCongCu || moCamXuc || moMenu
          ? 'opacity-100'
          : 'pointer-events-none opacity-0 group-hover/tin:pointer-events-auto group-hover/tin:opacity-100',
      )}
      data-testid="message-toolbar"
    >
      <button
        ref={nutCamXuc}
        type="button"
        onClick={() => { datMoMenu(false); datMoCamXuc((v) => !v); }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-white/[0.08] hover:text-text-primary"
        aria-label="Thả cảm xúc"
        title="Thả cảm xúc"
      >
        <Smile className="h-[18px] w-[18px]" />
      </button>
      {onReply && (
        <button
          type="button"
          onClick={() => { dongMenu(); onReply(message); }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-white/[0.08] hover:text-text-primary"
          aria-label="Trả lời"
          title="Trả lời"
        >
          <Reply className="h-[18px] w-[18px]" />
        </button>
      )}
      <button
        ref={nutMenu}
        type="button"
        onClick={() => { datMoCamXuc(false); datMoMenu((v) => !v); }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-white/[0.08] hover:text-text-primary"
        aria-label="Tuỳ chọn tin nhắn"
        title="Xem thêm"
        aria-expanded={moMenu}
      >
        <MoreVertical className="h-[18px] w-[18px]" />
      </button>
    </div>
  );

  const mucMenu = 'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-slate-100 hover:bg-white/[0.08]';

  return (
    <div
      ref={hang}
      data-testid="message-row"
      data-message-id={message.id}
      className={cn('group/tin', viTri === 'mot' || viTri === 'dau' ? 'mt-3' : 'mt-[2px]')}
      onTouchStart={batDauNhanGiu}
      onTouchEnd={huyNhanGiu}
      onTouchMove={huyNhanGiu}
      onTouchCancel={huyNhanGiu}
      onContextMenu={(e) => {
        // Nhấn giữ trên màn cảm ứng bắn contextmenu — để thanh công cụ của
        // mình thay menu hệ thống.
        if (ghimCongCu) e.preventDefault();
      }}
    >
     <div className={cn('flex items-end gap-2', isOwn ? 'flex-row-reverse pl-12' : 'pr-12', coCamXuc && 'mb-3')}>
      {/* Rãnh ảnh đại diện CỐ ĐỊNH 28 px — có ở mọi tin đến, kể cả khi trống.
          Ảnh nằm ở tin CUỐI cụm, đáy ngang đáy bong bóng (giờ gửi nằm NGOÀI
          hàng này nên không kéo ảnh xuống thấp hơn bong bóng). */}
      {!isOwn && (
        <div className="w-7 shrink-0 self-end" aria-hidden={!laCuoiCum} data-testid={laCuoiCum ? 'avatar-slot-filled' : 'avatar-slot'}>
          {laCuoiCum && <AnhDaiDien src={message.sender?.avatarUrl} ten={senderName} />}
        </div>
      )}

      <div className={cn('relative flex min-w-0 max-w-[min(70%,560px)] flex-col', isOwn ? 'items-end' : 'items-start')}>
        {hienTen && !isOwn && (viTri === 'dau' || viTri === 'mot') && (
          <span className="mb-0.5 ml-3 text-[11px] font-medium text-text-muted">{senderName}</span>
        )}

        <div className="relative max-w-full">
          <div className={cn('flex max-w-full flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}>
            {coBong && (
              <div
                data-testid="bubble"
                className={cn('max-w-full overflow-hidden text-[14.5px] leading-[1.4]', bo, isOwn ? 'text-white' : 'text-[#e9eaf0]')}
                style={bongNen}
                title={format(new Date(message.createdAt), 'HH:mm · dd/MM/yyyy')}
              >
                {message.parentMessage && (
                  <div className={cn(
                    'mx-2 mt-2 rounded-xl border-l-2 px-2.5 py-1.5 text-[12px] leading-snug',
                    isOwn ? 'border-white/50 bg-black/15 text-white/80' : 'border-cyan-400/70 bg-white/[0.05] text-text-muted',
                  )}>
                    <span className="font-semibold">{message.parentMessage.senderName}</span>
                    <p className="mt-0.5 line-clamp-2 break-words opacity-90">
                      {message.parentMessage.content || '📎 Tệp đính kèm'}
                    </p>
                  </div>
                )}

                {message.content && (
                  <p className="whitespace-pre-wrap break-words px-3 py-[7px]">
                    {linkifyToNodes(
                      message.content,
                      isOwn
                        ? {
                            orderCodeHref,
                            linkClassName: 'font-medium underline decoration-1 underline-offset-2 break-all hover:opacity-80 text-white',
                            linkStyle: undefined,
                          }
                        : { orderCodeHref },
                    )}
                  </p>
                )}

                {tepKhac.length > 0 && (
                  <div className={cn('space-y-1.5 px-2 pb-2', message.content ? '' : 'pt-2')}>
                    {tepKhac.map((a) => {
                      const url = resolveUrl(a.url);
                      /* Tin thoại: nhận ra bằng MIME (Safari `audio/mp4`, Chrome
                         `audio/webm`), `preload="metadata"` để không kéo cả tệp. */
                      if (a.mimeType.startsWith('audio/')) {
                        return <audio key={a.id} src={url} controls preload="metadata" className="h-10 w-[240px] max-w-full" />;
                      }
                      const ext = a.fileName.split('.').pop()?.toUpperCase() ?? '';
                      return (
                        <a
                          key={a.id}
                          href={url}
                          download={a.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn('flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs', isOwn ? 'bg-white/15 hover:bg-white/25' : 'bg-white/[0.06] hover:bg-white/[0.1]')}
                        >
                          <FileText className="h-4 w-4 shrink-0 opacity-80" />
                          <span className="min-w-0 flex-1 truncate">{a.fileName}</span>
                          <span className="text-[10px] opacity-60">{ext}</span>
                          <span className="text-[10px] opacity-70">{formatBytes(a.fileSize)}</span>
                          <Download className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                )}

                {message.postShare && (
                  <a
                    href={`/?post=${message.postShare.postId}`}
                    className={cn('m-2 block overflow-hidden rounded-xl transition-opacity hover:opacity-90', isOwn ? 'bg-white/10' : 'bg-white/[0.05]')}
                  >
                    {message.postShare.mediaThumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveUrl(message.postShare.mediaThumbnail)} alt="" className="h-32 w-full object-cover" loading="lazy" />
                    )}
                    <div className="p-2.5">
                      <p className="mb-1 truncate text-xs font-semibold">
                        {message.postShare.authorDisplay || `@${message.postShare.authorUsername}`}
                      </p>
                      <p className="line-clamp-3 text-xs leading-relaxed opacity-80">
                        {message.postShare.contentPreview || 'Bài viết đã được chia sẻ'}
                      </p>
                      <p className="mt-1.5 text-[10px] opacity-60">Xem bài viết</p>
                    </div>
                  </a>
                )}
              </div>
            )}

            {/* Ảnh / GIF: đứng riêng, không nền bong bóng, bấm mở trình xem ảnh TRONG trang. */}
            {[...anhDinhKem.map((a) => ({ k: `a${a.id}`, url: resolveUrl(a.url), ten: a.fileName })),
              ...(gif ? [{ k: 'gif', url: gif, ten: 'GIF' }] : [])].map((h) => (
              <button
                key={h.k}
                type="button"
                onClick={() => onMoAnh?.(h.url)}
                className={cn('block max-w-[min(280px,100%)] overflow-hidden', coBong ? 'rounded-[18px]' : bo)}
                title={format(new Date(message.createdAt), 'HH:mm · dd/MM/yyyy')}
                aria-label={`Xem ảnh ${h.ten}`}
                data-testid="message-image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.url} alt={h.ten} className="block h-auto max-h-[300px] min-h-[60px] w-auto min-w-[60px] max-w-full bg-white/[0.04] object-cover" />
              </button>
            ))}

            {sticker && (
              // Nhãn dán đứng "trần" như Messenger — không bong bóng, không mở trình xem ảnh.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sticker} alt="Nhãn dán" className="h-28 w-28 object-contain" title={format(new Date(message.createdAt), 'HH:mm · dd/MM/yyyy')} />
            )}
          </div>

          {thanhCongCu}

          {coCamXuc && (
            <div className={cn('absolute -bottom-3 z-[5]', isOwn ? 'left-1' : 'right-1')}>
              <ChipCamXuc reactions={reactions} myUserId={myId} onClick={() => datMoCamXuc(true)} />
            </div>
          )}
        </div>

      </div>
     </div>

      {laCuoiCum && (
        <div
          className={cn(
            'mt-1 flex items-center gap-1 text-[10.5px] text-text-muted',
            isOwn ? 'justify-end pr-1' : 'pl-10',
          )}
        >
          <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
          {isOwn && (isOptimistic
            ? <span title="Đang gửi…">· Đang gửi</span>
            : isRead
              ? <CheckCheck className="h-3.5 w-3.5 text-cyan-300" aria-label="Đã xem" />
              : <Check className="h-3.5 w-3.5" aria-label="Đã gửi" />)}
        </div>
      )}

      <PopoverNeo neo={nutCamXuc} mo={moCamXuc} onDong={dongCamXuc} canh="giua" nhan="Chọn cảm xúc">
        <ChonCamXuc reactions={reactions} myUserId={myId} onChon={toggleReaction} />
      </PopoverNeo>

      <PopoverNeo neo={nutMenu} mo={moMenu} onDong={dongMenu} canh={isOwn ? 'phai' : 'trai'} nhan="Tuỳ chọn tin nhắn">
        <div className="w-56 rounded-2xl border border-white/10 bg-[#1c1d26] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
          {onReply && (
            <button type="button" className={mucMenu} onClick={() => thucHien(() => onReply(message))}>
              <Reply className="h-4 w-4" /> Trả lời
            </button>
          )}
          {onChuyenTiep && (
            <button type="button" className={mucMenu} onClick={() => thucHien(() => onChuyenTiep(message))}>
              <Forward className="h-4 w-4" /> Chuyển tiếp
            </button>
          )}
          {chepDuoc(message) && (
            <button
              type="button"
              className={mucMenu}
              onClick={() => thucHien(async () => {
                await navigator.clipboard.writeText(chuMotTin(message));
                toast.success('Đã sao chép');
              })}
            >
              <Copy className="h-4 w-4" /> Sao chép
            </button>
          )}
          {anhDauTien && (
            <>
              <button
                type="button"
                className={mucMenu}
                onClick={() => thucHien(async () => {
                  await chepAnhVaoClipboard(anhDauTien);
                  toast.success('Đã chép ảnh');
                })}
              >
                <ImageDown className="h-4 w-4" /> Chép ảnh
              </button>
              <button type="button" className={mucMenu} onClick={() => thucHien(() => luuAnhVeMay(anhDauTien))}>
                <Download className="h-4 w-4" /> Lưu ảnh
              </button>
            </>
          )}
          {onChonNhieu && (
            <button type="button" className={mucMenu} onClick={() => thucHien(() => onChonNhieu(message.id))}>
              <CopyCheck className="h-4 w-4" /> Chọn nhiều tin
            </button>
          )}
          <div className="my-1 border-t border-white/[0.08]" />
          {canRecall && (
            <button
              type="button"
              className={cn(mucMenu, 'text-amber-200')}
              onClick={() => thucHien(() => useMessagingStore.getState().recallMessage(message.threadId, message.id))}
            >
              <Undo2 className="h-4 w-4" /> Thu hồi với mọi người
            </button>
          )}
          {isOwn && (
            <button
              type="button"
              className={cn(mucMenu, 'text-red-300')}
              onClick={() => thucHien(() => useMessagingStore.getState().deleteMessage(message.threadId, message.id))}
            >
              <Trash2 className="h-4 w-4" /> Xoá tin nhắn
            </button>
          )}
          {!isOwn && (
            <button
              type="button"
              className={cn(mucMenu, 'text-red-300')}
              onClick={() => thucHien(async () => {
                if (!window.confirm('Báo cáo tin nhắn này với quản trị viên?')) return;
                const trich = (message.content || (gif ? '[GIF]' : anhDauTien ? '[Ảnh]' : '[Tệp]')).slice(0, 300);
                await useMessagingStore.getState().reportThread(message.threadId, {
                  reason: `Báo cáo tin nhắn #${message.id} của ${senderName}: "${trich}"`,
                  category: 'other',
                });
                toast.success('Đã gửi báo cáo. Cảm ơn bạn!');
              })}
            >
              <Flag className="h-4 w-4" /> Báo cáo
            </button>
          )}
        </div>
      </PopoverNeo>
    </div>
  );
}

export default memo(MessageBubble);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
