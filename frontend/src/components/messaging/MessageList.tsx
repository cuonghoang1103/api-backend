'use client';

/**
 * Khung tin nhắn của hội thoại đang mở.
 *
 * ─── Cuộn: luật "DÍNH ĐÁY" (14/10/2026) ───
 * Người dùng báo: mở hội thoại ra thì nằm GIỮA đoạn chat, tin mới về cũng
 * không thấy. Ba nguyên nhân chồng nhau trong bản cũ:
 *   1. Đo "có gần đáy không" SAU khi nội dung đã cao lên (`useEffect` theo
 *      `messages.length`) ⇒ một tin cao hơn 120 px (ảnh, đoạn dài) là đủ để
 *      bị coi như "đang đọc tin cũ" và không cuộn.
 *   2. Ảnh/GIF tải xong SAU lần cuộn xuống đáy ⇒ nội dung nở ra, đáy trôi đi.
 *   3. Socket ghi trước một bộ đệm MỘT tin cho hội thoại chưa mở ⇒ khung dựng
 *      với một tin, cuộn "xuống đáy", rồi 50 tin thật đổ vào phía trên.
 *      (Đã vá ở cửa hàng — `applyIncomingMessage` — nhưng luật dưới đây tự nó
 *      cũng chịu được.)
 *
 * Nay giữ một cờ `dinhDay` cập nhật THEO THAO TÁC CỦA NGƯỜI DÙNG (cuộn lên ⇒
 * thôi dính; về sát đáy ⇒ dính lại), và một `ResizeObserver` trên NỘI DUNG:
 * hễ nội dung đổi cỡ (tin mới, ảnh tải xong, phản hồi bật lên) mà đang dính
 * thì kéo về đáy. Mở hội thoại ⇒ dính. Mình gửi tin ⇒ dính. Người kia gửi lúc
 * mình đang đọc tin cũ ⇒ KHÔNG giật xuống, hiện nút "N tin nhắn mới ↓".
 *
 * ─── Bố cục: cụm tin kiểu Messenger ─── xem `nhomTin()` và `MessageBubble`.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import MessageBubble, { resolveUrl } from './MessageBubble';
import AnhLightbox from './AnhLightbox';
import ChuyenTiepModal from './ChuyenTiepModal';
import { chuNhieuTin } from '@/lib/tinNhan/chep';
import { anhCuaTin, nhomTin, type CumTin } from '@/lib/tinNhan/nhom';
import TypingIndicator from './TypingIndicator';
import { AlertCircle, ArrowDown, ChevronDown, Copy, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { MessagingMessage } from '@/lib/api';

/** Cách đáy ≤ chừng này px thì coi như đang ở đáy. */
const NGUONG_DAY = 48;
const KHONG_TIN: MessagingMessage[] = [];

function nhanNgay(d: Date): string {
  if (isToday(d)) return 'Hôm nay';
  if (isYesterday(d)) return 'Hôm qua';
  return format(d, 'EEEE, dd/MM/yyyy', { locale: vi });
}

export default function MessageList() {
  const threadId = useMessagingStore((s) => s.currentThreadId)!;
  const messages = useMessagingStore((s) => s.messagesByThread[threadId] ?? KHONG_TIN);
  const messagesLoading = useMessagingStore((s) => s.messagesLoading);
  const messageLoadError = useMessagingStore((s) => s.messageLoadError);
  const hasMore = useMessagingStore((s) => !!s.hasMoreByThread[threadId]);
  const typingMap = useMessagingStore((s) => s.typing.byThread[threadId]);
  const myId = useAuthStore((s) => s.user?.id);

  const scrollRef = useRef<HTMLDivElement>(null);
  const noiDungRef = useRef<HTMLDivElement>(null);
  const dinhDay = useRef(true);
  const topTruoc = useRef(0);
  const truocKhiTaiThem = useRef<{ h: number; top: number } | null>(null);
  const tinCuoiTruoc = useRef<{ thread: number; id: number | null; dau: number | null }>({ thread: -1, id: null, dau: null });
  const [soTinMoi, datSoTinMoi] = useState(0);
  const [xaDay, datXaDay] = useState(false);

  const [dangChon, setDangChon] = useState(false);
  const [daChon, setDaChon] = useState<Set<number>>(new Set());
  const [chiSoAnh, datChiSoAnh] = useState<number | null>(null);
  const [tinChuyenTiep, datTinChuyenTiep] = useState<MessagingMessage | null>(null);

  const cuonXuongDay = useCallback((muot = false) => {
    const el = scrollRef.current;
    if (!el) return;
    dinhDay.current = true;
    datSoTinMoi(0);
    datXaDay(false);
    // Xa quá thì NHẢY thẳng: cuộn mượt vài nghìn px mất cả giây, và trong
    // lúc đó tin mới về làm đích trôi đi.
    const cach = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (muot && cach < 1200) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    else el.scrollTop = el.scrollHeight;
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cach = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (cach <= NGUONG_DAY) {
      dinhDay.current = true;
      if (soTinMoi) datSoTinMoi(0);
    } else if (el.scrollTop < topTruoc.current - 2) {
      // Người dùng CUỘN LÊN. Nội dung cao lên thì scrollTop không giảm, nên
      // nhánh này chỉ bắt thao tác thật — không bắt nhầm lúc ảnh đang nở.
      dinhDay.current = false;
    }
    topTruoc.current = el.scrollTop;
    datXaDay(cach > 320);
  };

  // Mở hội thoại (hoặc đổi sang hội thoại khác) ⇒ dính đáy, xoá trạng thái cũ.
  useLayoutEffect(() => {
    dinhDay.current = true;
    datSoTinMoi(0);
    setDangChon(false);
    setDaChon(new Set());
    datChiSoAnh(null);
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [threadId]);

  // Danh sách tin đổi: tin mới ở CUỐI hay tin cũ nạp thêm ở ĐẦU?
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const truoc = tinCuoiTruoc.current;
    const cuoi = messages.length ? messages[messages.length - 1]! : null;
    const dau = messages.length ? messages[0]!.id : null;
    tinCuoiTruoc.current = { thread: threadId, id: cuoi?.id ?? null, dau };
    if (!el) return;

    // Nạp thêm tin cũ: giữ nguyên chỗ đang đọc (Safari không có scroll anchoring).
    if (truocKhiTaiThem.current && truoc.thread === threadId && dau !== truoc.dau) {
      const { h, top } = truocKhiTaiThem.current;
      truocKhiTaiThem.current = null;
      el.scrollTop = top + (el.scrollHeight - h);
      topTruoc.current = el.scrollTop;
      return;
    }
    if (truoc.thread !== threadId || dinhDay.current) {
      el.scrollTop = el.scrollHeight;
      return;
    }
    if (cuoi && cuoi.id !== truoc.id) {
      if (cuoi.senderId === myId) {
        cuonXuongDay(); // mình vừa gửi ⇒ luôn xuống đáy
      } else {
        const idx = truoc.id === null ? -1 : messages.findIndex((m) => m.id === truoc.id);
        const moi = idx >= 0 ? messages.length - 1 - idx : 1;
        datSoTinMoi((n) => n + Math.max(1, moi));
      }
    }
  }, [messages, threadId, myId, cuonXuongDay]);

  // Nội dung hoặc khung đổi cỡ (ảnh tải xong, bàn phím iOS bật lên, …) ⇒ nếu
  // đang dính đáy thì giữ ở đáy.
  useEffect(() => {
    const el = scrollRef.current;
    const nd = noiDungRef.current;
    if (!el || !nd || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (dinhDay.current) {
        el.scrollTop = el.scrollHeight;
        topTruoc.current = el.scrollTop;
      }
    });
    ro.observe(nd);
    ro.observe(el);
    return () => ro.disconnect();
  }, [threadId]);

  // Ảnh trong khung tải xong ⇒ cũng kéo về đáy (lưới đỡ khi ResizeObserver
  // chậm một nhịp; sự kiện `load` không nổi bọt nên bắt ở pha capture).
  useEffect(() => {
    const nd = noiDungRef.current;
    if (!nd) return;
    const onLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement && dinhDay.current) {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }
    };
    nd.addEventListener('load', onLoad, true);
    return () => nd.removeEventListener('load', onLoad, true);
  }, [threadId]);

  const now = Date.now();
  const typingUserIds = Object.entries(typingMap ?? {})
    .filter(([, until]) => until > now)
    .map(([uid]) => Number(uid))
    .filter((uid) => uid !== myId);

  // Nhóm theo NGÀY rồi theo CỤM người gửi.
  const ngay = useMemo(() => {
    const ds: { key: string; nhan: string; cums: CumTin<MessagingMessage>[] }[] = [];
    let cuaNgay: MessagingMessage[] = [];
    let key = '';
    const day = () => {
      if (cuaNgay.length) ds.push({ key, nhan: nhanNgay(new Date(cuaNgay[0]!.createdAt)), cums: nhomTin(cuaNgay, myId) });
    };
    for (const m of messages) {
      const k = format(new Date(m.createdAt), 'yyyy-MM-dd');
      if (k !== key) { day(); key = k; cuaNgay = []; }
      cuaNgay.push(m);
    }
    day();
    return ds;
  }, [messages, myId]);

  const dsAnh = useMemo(() => messages.flatMap((m) => anhCuaTin(m, resolveUrl)), [messages]);

  const moAnh = useCallback((url: string) => {
    const i = dsAnh.findIndex((a) => a.url === url);
    datChiSoAnh(i >= 0 ? i : null);
  }, [dsAnh]);
  const traLoi = useCallback((m: MessagingMessage) => useMessagingStore.getState().setReplyTo(m), []);
  const batChonNhieu = useCallback((id: number) => { setDangChon(true); setDaChon(new Set([id])); }, []);
  const chuyenTiep = useCallback((m: MessagingMessage) => datTinChuyenTiep(m), []);

  const doiChon = (id: number) => setDaChon((c) => {
    const m = new Set(c);
    if (m.has(id)) m.delete(id); else m.add(id);
    return m;
  });

  const chepDaChon = async () => {
    /* Chép theo ĐÚNG thứ tự hiện trên màn hình, không theo thứ tự bấm chọn. */
    const all = messages.filter((m) => daChon.has(m.id));
    const chu = chuNhieuTin(all, (sid) => (sid === myId
      ? 'Bạn'
      : (all.find((m) => m.senderId === sid)?.sender?.displayName
        ?? all.find((m) => m.senderId === sid)?.sender?.username
        ?? 'Người kia')));
    if (chu === '') return;
    await navigator.clipboard.writeText(chu);
    toast.success(`Đã chép ${all.length} tin`);
    setDangChon(false);
    setDaChon(new Set());
  };

  const taiThem = () => {
    const el = scrollRef.current;
    if (el) truocKhiTaiThem.current = { h: el.scrollHeight, top: el.scrollTop };
    void useMessagingStore.getState().loadMoreMessages(threadId);
  };

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        data-testid="message-scroll"
        className="chat-messages-scroll h-full overflow-y-auto px-3 pb-3 pt-2 md:px-4"
        style={{ scrollbarWidth: 'thin', overflowAnchor: 'none' }}
      >
        <div ref={noiDungRef} className="flex min-h-full flex-col justify-end">
          {hasMore && (
            <div className="mb-2 flex justify-center">
              <button
                onClick={taiThem}
                disabled={messagesLoading}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] text-text-secondary transition-colors hover:bg-white/[0.08] disabled:opacity-50"
              >
                {messagesLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Tải thêm tin nhắn cũ'}
              </button>
            </div>
          )}

          {messages.length === 0 && !messagesLoading && !messageLoadError && (
            <div className="flex flex-1 items-center justify-center text-center text-xs text-text-muted">
              Chưa có tin nhắn. Hãy gửi lời chào!
            </div>
          )}

          {messagesLoading && messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            </div>
          )}

          {messageLoadError && !messagesLoading && (
            <div className="m-3 flex flex-col items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-[12px] leading-relaxed text-red-300">{messageLoadError}</p>
              <button
                onClick={() => useMessagingStore.getState().openThread(threadId)}
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-medium text-red-200 transition-colors hover:bg-red-500/20"
              >
                <RefreshCcw className="h-3 w-3" />
                Thử lại
              </button>
            </div>
          )}

          {ngay.map((g) => (
            <div key={g.key}>
              <div className="mb-1 mt-4 flex justify-center">
                <span className="text-[11px] font-medium text-text-muted">{g.nhan}</span>
              </div>
              {g.cums.map((c) => (
                <div key={c.khoa} data-testid="message-group">
                  {c.tins.map(({ tin: m, viTri }) => {
                    const bong = (
                      <MessageBubble
                        message={m}
                        isOwn={c.laCuaToi}
                        viTri={viTri}
                        hienTen={false /* backend chưa có hội thoại nhóm — 1-1 thì tên là thừa */}
                        cheDoChon={dangChon}
                        onReply={dangChon ? undefined : traLoi}
                        onChonNhieu={dangChon ? undefined : batChonNhieu}
                        onMoAnh={dangChon ? undefined : moAnh}
                        onChuyenTiep={dangChon ? undefined : chuyenTiep}
                      />
                    );
                    if (!dangChon) return <div key={m.id}>{bong}</div>;
                    /* Ở chế độ chọn, bấm vào ĐÂU trên hàng cũng chọn. */
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => doiChon(m.id)}
                        className={cn(
                          'block w-full rounded-lg px-1 text-left transition-colors',
                          daChon.has(m.id) ? 'bg-cyan-500/15 ring-1 ring-cyan-400/40' : 'hover:bg-white/[0.04]',
                        )}
                      >
                        {bong}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

          {typingUserIds.length > 0 && <div className="mt-2 pl-9"><TypingIndicator /></div>}
        </div>
      </div>

      {dangChon && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 border-t border-white/10 bg-[#0a0a14]/95 px-3 py-2 backdrop-blur">
          <span className="mr-auto text-[11px] text-text-muted">Đã chọn {daChon.size} tin</span>
          <button
            type="button"
            disabled={daChon.size === 0}
            onClick={() => void chepDaChon()}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-[11px] font-medium text-cyan-200 hover:bg-cyan-500/30 disabled:opacity-40"
          >
            <Copy className="h-3 w-3" /> Chép
          </button>
          <button
            type="button"
            onClick={() => { setDangChon(false); setDaChon(new Set()); }}
            className="rounded-lg px-3 py-1.5 text-[11px] text-text-muted hover:bg-white/10"
          >
            Huỷ
          </button>
        </div>
      )}

      {/* Tin mới tới lúc đang đọc tin cũ — không giật xuống, chỉ báo. */}
      {!dangChon && soTinMoi > 0 && (
        <button
          type="button"
          onClick={() => cuonXuongDay(true)}
          data-testid="new-message-pill"
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-cyan-500 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_6px_20px_rgba(6,182,212,0.45)] transition-transform hover:scale-105"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          {soTinMoi === 1 ? 'Tin nhắn mới' : `${soTinMoi} tin nhắn mới`}
        </button>
      )}
      {!dangChon && soTinMoi === 0 && xaDay && (
        <button
          type="button"
          onClick={() => cuonXuongDay(true)}
          aria-label="Xuống tin nhắn mới nhất"
          data-testid="jump-bottom"
          className="absolute bottom-3 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#20212e] text-text-primary shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform hover:scale-105"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}

      {chiSoAnh !== null && dsAnh.length > 0 && (
        <AnhLightbox ds={dsAnh} chiSo={Math.min(chiSoAnh, dsAnh.length - 1)} onDoi={datChiSoAnh} onDong={() => datChiSoAnh(null)} />
      )}
      {tinChuyenTiep && <ChuyenTiepModal tin={tinChuyenTiep} onDong={() => datTinChuyenTiep(null)} />}
    </div>
  );
}
