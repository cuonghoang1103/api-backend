'use client';

/**
 * /chat — CuongMini Chat, giao diện kiểu Claude.ai (09/11/2026).
 *
 * Bố cục: thanh bên lịch sử (đổi tên / ghim / thư mục / xoá) · cột hội thoại 768px · ô soạn lớn có đính kèm và
 * chọn model ngay trong ô. Bốn model: CuongMini 3.11 (mặc định) · Pro · Pro 2 · Max — ba bậc sau đi cổng Anthropic
 * chính hãng ở backend (`src/services/aiChatChinhHang.ts`), giao diện CHỈ hiện tên CuongMini.
 *
 * Logic luồng SSE giữ nguyên từ bản terminal cũ (khung `connected/model/reasoning/buoc/nguon/figure_fix/done/error`),
 * thêm: Sửa tin người dùng & Tạo lại câu trả lời — cắt hội thoại ở máy + máy chủ (`POST /ai/chat/sessions/:id/cat`)
 * rồi hỏi lại.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronDown, Mic, PanelLeftOpen, Pencil, Pin, SquarePen, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore, getContextualPrompts } from '@/store/chatStore';
import { api, aiApi } from '@/lib/api';
import type { ChatFolder, ChatMessage, ChatSession, NguonWeb } from '@/types';
import { findStaticResponse, getFallbackResponse } from '@/lib/ai-static-responses';
import { useChatModelStore, DEFAULT_CHAT_MODEL_ID, getChatModel } from '@/lib/aiChatModels';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { usePro } from '@/hooks/usePro';
import QuotaIndicator from '@/components/chat/QuotaIndicator';
import VoiceCallOverlay from '@/components/chat/VoiceCallOverlay';
import { CtcSidebar, type SessionRow } from '@/components/chat/claude/CtcSidebar';
import { CtcComposer, type CtcAttach, type CtcComposerHandle } from '@/components/chat/claude/CtcComposer';
import { CtcAssistantMessage, CtcUserMessage } from '@/components/chat/claude/CtcMessage';
import '@/components/chat/claude/claudeChat.css';

const KHOA_THANH_BEN = 'ctc-sidebar-open';
const NGUONG_HOI = 24_000;
const NGUONG_TU_CAT = 90_000;

/** Lý do máy chủ hạ bậc ⇒ câu nói cho người dùng. */
function cauHaBac(reason: unknown, label: string): string {
  const r = String(reason ?? '');
  if (r === 'pro_required') return `${label} dành cho tài khoản Pro — đã trả lời bằng CuongMini 3.11`;
  if (r === 'claude_cham_tran') return `${label} đã chạm hạn mức hôm nay — đã trả lời bằng CuongMini 3.11`;
  if (r === 'claude_khach') return `Đăng nhập để dùng ${label} — đã trả lời bằng CuongMini 3.11`;
  return `${label} đang bận — đã trả lời bằng CuongMini 3.11`;
}

function loiChao(name?: string): string {
  const h = new Date().getHours();
  const buoi = h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  return name ? `${buoi}, ${name}` : `${buoi}`;
}

export default function ChatPage() {
  const { isAuthenticated: isBackendAuth, user } = useAuthStore();
  const { status } = useSession();
  const { isPro } = usePro();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  const {
    sessions, currentSessionId, messages, isStreaming, suggestedPrompts, limitedMode, contextResetAt,
    setSessions, addSession, removeSession, setCurrentSessionId, addMessage, updateLastAssistantMessage,
    appendAssistantReasoning, datNguonChoLuotCuoi, setContextReset, removePendingMessage, setMessages,
    setStreaming, setRobotEmotion, setSuggestedPrompts, setLimitedMode, clearMessages,
  } = useChatStore();

  // ── Thanh bên: mở sẵn trên màn rộng (nhớ lựa chọn), đóng sẵn trên điện thoại ──
  const [sideOpen, setSideOpen] = useState(false);
  useEffect(() => {
    const hep = window.matchMedia('(max-width: 860px)').matches;
    let nho: string | null = null;
    try { nho = localStorage.getItem(KHOA_THANH_BEN); } catch { /* chế độ riêng tư */ }
    setSideOpen(!hep && nho !== '0');
  }, []);
  const doiThanhBen = useCallback((mo: boolean) => {
    setSideOpen(mo);
    if (!window.matchMedia('(max-width: 860px)').matches) {
      try { localStorage.setItem(KHOA_THANH_BEN, mo ? '1' : '0'); } catch { /* bỏ qua */ }
    }
  }, []);
  const dongNeuHep = useCallback(() => {
    if (window.matchMedia('(max-width: 860px)').matches) setSideOpen(false);
  }, []);

  const keyboardInset = useKeyboardInset();
  const [callOpen, setCallOpen] = useState(false);
  const [buocWeb, datBuocWeb] = useState<Array<{ viec: string; chu: string }>>([]);
  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<CtcComposerHandle>(null);

  const getToken = () => {
    if (typeof document === 'undefined') return '';
    const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
    return m ? decodeURIComponent(m[1]) : '';
  };

  // ─── Thư mục ─────────────────────────────────────────────────
  const [folders, setFolders] = useState<ChatFolder[]>([]);
  const [folderFilter, setFolderFilter] = useState<'all' | 'none' | string>('all');
  const loadFolders = useCallback(async () => {
    try {
      const res = await aiApi.getChatFolders();
      setFolders((res.data?.data as ChatFolder[]) || []);
    } catch { /* phụ trợ — không chặn trang */ }
  }, []);
  useEffect(() => { if (isAuthenticated) void loadFolders(); }, [isAuthenticated, loadFolders]);

  const taoThuMuc = async (ten: string) => {
    try {
      const res = await aiApi.createChatFolder(ten);
      const moi = res.data?.data as ChatFolder;
      setFolders((c) => (c.some((f) => f.id === moi.id) ? c : [moi, ...c]));
      setFolderFilter(moi.id);
    } catch { toast.error('Không tạo được thư mục'); }
  };
  const xoaThuMuc = async (id: string) => {
    try {
      await aiApi.deleteChatFolder(id);
      setFolders((c) => c.filter((f) => f.id !== id));
      if (folderFilter === id) setFolderFilter('all');
      setSessions(useChatStore.getState().sessions.map((s) => (s.folderId === id ? { ...s, folderId: null, folder: null } : s)));
      toast.success('Đã xoá thư mục. Các cuộc bên trong vẫn còn.');
    } catch { toast.error('Không xoá được thư mục'); }
  };
  const chuyenVaoThuMuc = async (sessionId: string, folderId: string | null) => {
    try {
      await aiApi.moveSessionToFolder(sessionId, folderId);
      const tm = folderId ? folders.find((f) => f.id === folderId) ?? null : null;
      setSessions(useChatStore.getState().sessions.map((s) => (s.sessionId === sessionId ? { ...s, folderId, folder: tm } : s)));
      void loadFolders();
    } catch { toast.error('Không chuyển được cuộc trò chuyện'); }
  };

  // ─── Nạp danh sách phiên từ máy chủ, gộp với phiên chỉ có ở máy ──────────
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      if (useChatStore.getState().sessions.length > 0 && !isAuthenticated) return;
      api.get('/ai/chat/sessions').then((res) => {
        // Máy chủ trả `id` (chuỗi sess_…), trang đọc `sessionId` — chuẩn hoá tại cửa vào.
        type PhienTuApi = Omit<ChatSession, 'id'> & { id?: unknown; pinned?: boolean };
        const apiSessions = ((res.data?.data ?? []) as PhienTuApi[])
          .map((s) => ({ ...(s as unknown as ChatSession), sessionId: s.sessionId ?? (typeof s.id === 'string' ? s.id : '') }))
          .filter((s) => !!s.sessionId);
        const persisted = useChatStore.getState().sessions;
        const localOnly = persisted.filter((s) => s.sessionId.startsWith('local_') && !apiSessions.find((a) => a.sessionId === s.sessionId));
        setSessions([...localOnly, ...apiSessions]);
      }).catch(() => {});
    }, 100);
    return () => clearTimeout(t);
  }, [mounted, isAuthenticated, setSessions]);

  const currentMessages = useMemo(
    () => (currentSessionId ? messages[currentSessionId] || [] : []),
    [currentSessionId, messages],
  );
  const currentSession = sessions.find((s) => s.sessionId === currentSessionId) as SessionRow | undefined;

  // ── Cắt mạch khi hội thoại quá dài (đo bằng KÝ TỰ đang gửi lại mỗi lượt) ──
  const [boQuaCatMach, setBoQuaCatMach] = useState(false);
  const mocMach = currentSessionId ? (contextResetAt[currentSessionId] ?? 0) : 0;
  const soKyTu = useMemo(
    () => currentMessages.filter((m) => new Date(m.createdAt).getTime() >= mocMach).reduce((s, m) => s + (m.content?.length ?? 0), 0),
    [currentMessages, mocMach],
  );
  useEffect(() => {
    if (!currentSessionId || isStreaming || soKyTu < NGUONG_TU_CAT) return;
    setContextReset(currentSessionId);
    toast.info('Cuộc trò chuyện đã quá dài nên mình tự bắt đầu mạch mới — tin cũ vẫn còn trên màn hình');
  }, [currentSessionId, isStreaming, soKyTu, setContextReset]);
  useEffect(() => { setBoQuaCatMach(false); }, [currentSessionId]);

  // ── Cuộn: chỉ bám đáy khi người đọc đang ở gần đáy ─────────────────
  // Bám theo KÍCH THƯỚC cột tin (ResizeObserver), không theo lần render: khối code / công thức / sơ đồ dựng trễ
  // làm nội dung cao thêm SAU khi effect đã cuộn — bám theo render là dừng giữa chừng.
  const scrollRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const ganDayRef = useRef(true);
  const [nearBottom, setNearBottomState] = useState(true);
  const setNearBottom = useCallback((v: boolean) => { ganDayRef.current = v; setNearBottomState(v); }, []);
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setNearBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 120);
  }, [setNearBottom]);
  const toBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);
  const coTin = currentMessages.length > 0;
  useEffect(() => {
    const col = colRef.current;
    const el = scrollRef.current;
    if (!col || !el) return;
    setNearBottom(true);
    el.scrollTop = el.scrollHeight;
    const ro = new ResizeObserver(() => { if (ganDayRef.current) el.scrollTop = el.scrollHeight; });
    ro.observe(col);
    return () => ro.disconnect();
  }, [mounted, currentSessionId, coTin, setNearBottom]);

  const fetchHistory = useCallback(async (sessionId: string) => {
    if (sessionId.startsWith('local_')) return;
    try {
      const res = await api.get(`/ai/chat/history/${sessionId}`);
      setMessages(sessionId, res.data.data || []);
    } catch { /* bỏ qua */ }
  }, [setMessages]);

  const chonPhien = useCallback(async (sessionId: string) => {
    if (isStreaming) abortRef.current?.abort();
    setCurrentSessionId(sessionId);
    dongNeuHep();
    await fetchHistory(sessionId);
  }, [isStreaming, setCurrentSessionId, fetchHistory, dongNeuHep]);

  const phienMoi = useCallback(() => {
    if (isStreaming) abortRef.current?.abort();
    setCurrentSessionId(null);
    setSuggestedPrompts(getContextualPrompts(''));
    setRobotEmotion('idle');
    setLimitedMode(false, '');
    dongNeuHep();
    requestAnimationFrame(() => composerRef.current?.focus());
  }, [isStreaming, setCurrentSessionId, setSuggestedPrompts, setRobotEmotion, setLimitedMode, dongNeuHep]);

  const xoaPhien = useCallback(async (sessionId: string) => {
    try {
      if (!sessionId.startsWith('local_')) await api.delete(`/ai/chat/sessions/${sessionId}`);
      removeSession(sessionId);
      clearMessages(sessionId);
      if (useChatStore.getState().currentSessionId === sessionId) setCurrentSessionId(null);
      toast.success('Đã xoá cuộc trò chuyện');
    } catch { toast.error('Không xoá được'); }
  }, [removeSession, clearMessages, setCurrentSessionId]);

  const doiTen = useCallback(async (sessionId: string, title: string) => {
    const cu = useChatStore.getState().sessions;
    setSessions(cu.map((s) => (s.sessionId === sessionId ? { ...s, title } : s)));
    if (sessionId.startsWith('local_')) return;
    try { await api.patch(`/ai/chat/sessions/${sessionId}`, { title }); }
    catch { setSessions(cu); toast.error('Không đổi được tên'); }
  }, [setSessions]);

  const ghimPhien = useCallback(async (sessionId: string, pinned: boolean) => {
    const cu = useChatStore.getState().sessions;
    setSessions(cu.map((s) => (s.sessionId === sessionId ? ({ ...s, pinned } as ChatSession) : s)));
    try { await api.patch(`/ai/chat/sessions/${sessionId}`, { pinned }); }
    catch { setSessions(cu); toast.error('Không ghim được'); }
  }, [setSessions]);

  /**
   * Gửi một lượt hỏi. TRẢ VỀ câu trả lời đã hoàn tất (chế độ GỌI cần chuỗi đó để đọc lên).
   */
  const sendMessage = useCallback(async (
    text: string,
    forceStatic = false,
    attach?: CtcAttach,
    opts?: { voice?: boolean },
  ): Promise<string> => {
    const images = attach?.images;
    const documents = attach?.documents;
    const documentNames = attach?.documentNames;
    const hasAttach = (images?.length ?? 0) > 0 || (documents?.length ?? 0) > 0;
    if ((!text.trim() && !hasAttach) || useChatStore.getState().isStreaming) return '';

    let sessionId = useChatStore.getState().currentSessionId;
    let isNewLocalSession = false;
    const tieuDe = (text.trim() || documentNames?.[0] || 'Ảnh').slice(0, 50);
    if (!sessionId) {
      sessionId = `local_${Date.now()}`;
      addSession({ id: Date.now(), sessionId, title: tieuDe, createdAt: new Date().toISOString() });
      setCurrentSessionId(sessionId);
      isNewLocalSession = true;
    }

    const tempId = Date.now();
    const userMsg: ChatMessage = {
      id: tempId,
      sessionId,
      role: 'user',
      content: text.trim(),
      images: images?.length ? images : undefined,
      documentNames: documentNames?.length ? documentNames : undefined,
      createdAt: new Date().toISOString(),
    };

    // Lịch sử nhiều lượt — chụp TRƯỚC khi thêm tin mới; bỏ phần trước mốc "mạch mới".
    const tatCa = useChatStore.getState().messages[sessionId] || [];
    const moc = useChatStore.getState().contextResetAt[sessionId] ?? 0;
    const historyPayload = tatCa
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
      .filter((m) => new Date(m.createdAt).getTime() >= moc)
      .slice(-10)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    // Lượt sau không đính gì ⇒ tự kèm lại ảnh của lượt có ảnh gần nhất (model chỉ thấy ảnh ở đúng lượt gửi).
    let anhGui = images;
    if ((!images || images.length === 0) && documents == null) {
      const ganDay = tatCa.filter((m) => new Date(m.createdAt).getTime() >= moc).slice(-6);
      const luotCoAnh = [...ganDay].reverse().find((m) => m.role === 'user' && m.images?.length);
      if (luotCoAnh?.images?.length) anhGui = luotCoAnh.images.slice(0, 2);
    }

    addMessage(sessionId, userMsg);
    setRobotEmotion('typing');
    setStreaming(true);
    setSuggestedPrompts([]);
    setNearBottom(true);

    const doiTieuDeLocal = () => {
      const s = useChatStore.getState().sessions.find((x) => x.sessionId === sessionId);
      if (s && (!s.title || s.title === 'New chat')) {
        setSessions(useChatStore.getState().sessions.map((x) => (x.sessionId === sessionId ? { ...x, title: tieuDe } : x)));
      }
    };

    try {
      if (forceStatic || limitedMode) {
        const staticResp = findStaticResponse(text);
        const responseContent = staticResp?.response || getFallbackResponse(text);
        addMessage(sessionId, { id: tempId + 1, sessionId, role: 'assistant', content: '', createdAt: new Date().toISOString() });
        let acc = '';
        for (const w of responseContent.split(/(\s+)/)) {
          await new Promise((r) => setTimeout(r, 5));
          acc += w;
          updateLastAssistantMessage(sessionId, acc);
        }
        if (isNewLocalSession) doiTieuDeLocal();
        setRobotEmotion('idle');
        setStreaming(false);
        return responseContent;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionId || undefined,
          topK: 5,
          model: useChatModelStore.getState().modelId,
          history: historyPayload,
          images: anhGui?.length ? anhGui : undefined,
          documents: documents?.length ? documents : undefined,
          documentNames: documentNames?.length ? documentNames : undefined,
          voice: opts?.voice === true,
        }),
      });
      if (!res.ok) {
        // 429 hết lượt / 401 / 5xx: máy chủ trả JSON có câu giải thích — hiện nó ngay trong hội thoại, không im lặng.
        let loi = `Máy chủ trả lỗi ${res.status}`;
        try {
          const j = await res.json();
          loi = j?.error?.message || j?.message || (typeof j?.error === 'string' ? j.error : loi);
        } catch { /* thân không phải JSON */ }
        addMessage(sessionId, { id: tempId + 1, sessionId, role: 'assistant', content: `> ⚠️ **${loi}**`, createdAt: new Date().toISOString() });
        toast.error(loi);
        setRobotEmotion('sad');
        return '';
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      let assistantContent = '';
      let resolvedSessionId = '';
      let resolvedMessageId: number | undefined;
      const assistantTempId = tempId + 1;
      addMessage(sessionId, { id: assistantTempId, sessionId, role: 'assistant', content: '', createdAt: new Date().toISOString() });

      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        let step: ReadableStreamReadResult<Uint8Array>;
        try { step = await reader.read(); } catch { break; } // bấm Dừng — giữ phần đã chảy
        if (step.done) break;
        buffer += decoder.decode(step.value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const data = JSON.parse(raw);
            if (data.type === 'connected') { if (data.sessionId) resolvedSessionId = data.sessionId; continue; }
            if (data.type === 'model') {
              if (data.fellBack) {
                const requested = getChatModel(data.requested);
                useChatModelStore.getState().setModelId(DEFAULT_CHAT_MODEL_ID);
                toast.info(cauHaBac(data.reason, requested.label));
              }
              continue;
            }
            if (data.type === 'reasoning') { if (data.step) appendAssistantReasoning(sessionId, data.step); continue; }
            if (data.type === 'buoc') { datBuocWeb((c) => [...c, { viec: String(data.viec ?? ''), chu: String(data.chu ?? '') }]); continue; }
            if (data.type === 'nguon') { if (Array.isArray(data.nguon)) datNguonChoLuotCuoi(sessionId, data.nguon as NguonWeb[]); continue; }
            if (data.type === 'figure_fix') {
              if (typeof data.index === 'number' && data.svg) {
                let n = 0;
                assistantContent = assistantContent.replace(/```svg\s*\n[\s\S]*?```/g, (khoi: string) => {
                  const doi = n === data.index;
                  n++;
                  return doi ? '```svg\n' + String(data.svg).trim() + '\n```' : khoi;
                });
                updateLastAssistantMessage(sessionId, assistantContent);
              }
              continue;
            }
            if (data.type === 'done') { if (typeof data.messageId === 'number') resolvedMessageId = data.messageId; continue; }
            if (data.type === 'error') {
              const loi = typeof data.error === 'string' ? data.error : 'Không lấy được câu trả lời';
              if (!assistantContent.trim()) {
                assistantContent = `> ⚠️ **${loi}**\n>\n> Thử nhắn lại, hoặc hỏi ngắn hơn / tách nhỏ đề bài.`;
                updateLastAssistantMessage(sessionId, assistantContent);
              }
              toast.error(loi);
              continue;
            }
            // Bước/kỹ năng không có `text` — chỉ khung chữ mới cộng vào câu trả lời.
            if (data.type && data.type !== 'chunk') continue;
            const chunk = data.text ?? data.content ?? '';
            if (chunk) { assistantContent += chunk; updateLastAssistantMessage(sessionId, assistantContent); }
          } catch { continue; } // khung SSE vỡ — không bao giờ in JSON thô ra màn hình
        }
      }

      if (resolvedMessageId) {
        useChatStore.setState((state) => {
          const msgs = state.messages[sessionId!];
          if (!msgs) return state;
          return { messages: { ...state.messages, [sessionId!]: msgs.map((m) => (m.id === assistantTempId ? { ...m, dbId: resolvedMessageId } : m)) } };
        });
      }

      // Phiên máy (local_) ⇒ chuyển sang phiên thật của máy chủ.
      if (resolvedSessionId && resolvedSessionId !== sessionId) {
        const localMessages = useChatStore.getState().messages[sessionId] || [];
        const cu = useChatStore.getState().sessions.find((s) => s.sessionId === sessionId);
        if (sessionId.startsWith('local_')) removeSession(sessionId);
        const existing = useChatStore.getState().messages[resolvedSessionId] || [];
        if (!useChatStore.getState().sessions.some((s) => s.sessionId === resolvedSessionId)) {
          addSession({ id: Date.now(), sessionId: resolvedSessionId, title: cu?.title && cu.title !== 'New chat' ? cu.title : tieuDe, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
        setCurrentSessionId(resolvedSessionId);
        setMessages(resolvedSessionId, [...existing, ...localMessages]);
        useChatStore.setState((state) => {
          const { [sessionId!]: _bo, ...rest } = state.messages;
          return { messages: rest };
        });
      } else {
        doiTieuDeLocal();
        setSessions(useChatStore.getState().sessions.map((x) => (x.sessionId === sessionId ? { ...x, updatedAt: new Date().toISOString() } : x)));
      }

      const ctx = getContextualPrompts(assistantContent);
      if (ctx.length > 0) setSuggestedPrompts(ctx);
      setRobotEmotion('idle');
      return assistantContent;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return '';
      console.error('Chat error:', err);
      const staticResp = findStaticResponse(text);
      if (staticResp) {
        addMessage(sessionId, { id: tempId + 1, sessionId, role: 'assistant', content: staticResp.response, createdAt: new Date().toISOString() });
        setLimitedMode(true, 'AI unavailable - Using cached answers');
        toast.info('AI tạm thời không phản hồi — đang dùng câu trả lời có sẵn');
      } else {
        toast.error('Không kết nối được tới CuongMini. Thử lại sau giây lát.');
        setRobotEmotion('sad');
        removePendingMessage(sessionId, tempId);
      }
      return '';
    } finally {
      abortRef.current = null;
      setStreaming(false);
      datBuocWeb([]);
    }
  }, [
    addMessage, addSession, appendAssistantReasoning, datNguonChoLuotCuoi, limitedMode, removePendingMessage,
    removeSession, setCurrentSessionId, setLimitedMode, setMessages, setRobotEmotion, setSessions, setStreaming,
    setSuggestedPrompts, updateLastAssistantMessage,
  ]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, [setStreaming]);

  /** Cắt hội thoại từ tin thứ `idx` (cả ở máy chủ) — dùng cho Sửa & Tạo lại. */
  const catTu = useCallback(async (sid: string, idx: number) => {
    const msgs = useChatStore.getState().messages[sid] || [];
    setMessages(sid, msgs.slice(0, idx));
    if (!sid.startsWith('local_')) {
      try { await api.post(`/ai/chat/sessions/${sid}/cat`, { tuChiSo: idx }); } catch { /* máy chủ lỗi: lượt mới vẫn gửi được */ }
    }
  }, [setMessages]);

  const suaTin = useCallback(async (idx: number, text: string) => {
    const sid = useChatStore.getState().currentSessionId;
    if (!sid || isStreaming) return;
    const goc = (useChatStore.getState().messages[sid] || [])[idx];
    await catTu(sid, idx);
    void sendMessage(text, false, goc?.images?.length ? { images: goc.images } : undefined);
  }, [catTu, isStreaming, sendMessage]);

  const taoLai = useCallback(async (idx: number) => {
    const sid = useChatStore.getState().currentSessionId;
    if (!sid || isStreaming) return;
    const msgs = useChatStore.getState().messages[sid] || [];
    let u = idx - 1;
    while (u >= 0 && msgs[u].role !== 'user') u--;
    if (u < 0) return;
    const goc = msgs[u];
    await catTu(sid, u);
    void sendMessage(goc.content, false, goc.images?.length ? { images: goc.images } : undefined);
  }, [catTu, isStreaming, sendMessage]);

  // ── Menu tiêu đề (đổi tên / ghim / xoá) ───────────────────────────
  const [titleMenu, setTitleMenu] = useState(false);
  const [titleEdit, setTitleEdit] = useState<string | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!titleMenu) return;
    const close = (e: MouseEvent) => { if (titleRef.current && !titleRef.current.contains(e.target as Node)) setTitleMenu(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [titleMenu]);

  const userInfo = isAuthenticated && user
    ? { name: user.displayName || user.username || 'Bạn', avatarUrl: user.avatarUrl, isPro }
    : null;
  const tenGoi = user?.displayName?.split(' ').slice(-1)[0] || user?.username;
  const empty = currentMessages.length === 0;
  const lastAiIdx = (() => { for (let i = currentMessages.length - 1; i >= 0; i--) if (currentMessages[i].role === 'assistant') return i; return -1; })();

  const composer = (
    <CtcComposer
      ref={composerRef}
      onSend={(t, a) => { void sendMessage(t, false, a); }}
      onStop={stopStreaming}
      onVoice={() => setCallOpen(true)}
      isStreaming={isStreaming}
      isPro={isPro}
      autoFocus
      placeholder={empty ? 'Hôm nay mình giúp gì được cho bạn?' : 'Trả lời CuongMini…'}
    />
  );

  if (!mounted) {
    return <div className="ctc" aria-busy="true" />;
  }

  return (
    <div className="ctc" style={keyboardInset > 0 ? { height: `calc(100dvh - ${keyboardInset}px)` } : undefined}>
      <CtcSidebar
        open={sideOpen}
        sessions={sessions as SessionRow[]}
        currentId={currentSessionId}
        folders={folders}
        folderFilter={folderFilter}
        onFolderFilter={setFolderFilter}
        onCreateFolder={(t) => void taoThuMuc(t)}
        onDeleteFolder={(id) => void xoaThuMuc(id)}
        onMoveToFolder={(s, f) => void chuyenVaoThuMuc(s, f)}
        onClose={() => doiThanhBen(false)}
        onNew={phienMoi}
        onSelect={(id) => void chonPhien(id)}
        onRename={(id, t) => void doiTen(id, t)}
        onDelete={(id) => void xoaPhien(id)}
        onPin={(id, p) => void ghimPhien(id, p)}
        user={userInfo}
      />
      {sideOpen && <div className="ctc-scrim" onClick={() => setSideOpen(false)} aria-hidden />}

      <main className="ctc-main">
        <header className="ctc-top">
          {!sideOpen && (
            <>
              <button type="button" className="ctc-icon-btn" onClick={() => doiThanhBen(true)} aria-label="Mở thanh bên" title="Mở thanh bên" data-testid="ctc-open-side">
                <PanelLeftOpen size={18} />
              </button>
              <button type="button" className="ctc-icon-btn" onClick={phienMoi} aria-label="Cuộc trò chuyện mới" title="Cuộc trò chuyện mới">
                <SquarePen size={17} />
              </button>
            </>
          )}

          {!empty && currentSession && (
            <div ref={titleRef} style={{ position: 'relative', minWidth: 0 }}>
              {titleEdit !== null ? (
                <input
                  autoFocus
                  className="ctc-row-edit"
                  style={{ minWidth: 240 }}
                  value={titleEdit}
                  maxLength={255}
                  onChange={(e) => setTitleEdit(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === 'Enter') { const t = titleEdit.trim(); setTitleEdit(null); if (t) void doiTen(currentSession.sessionId, t); }
                    if (e.key === 'Escape') setTitleEdit(null);
                  }}
                  onBlur={() => { const t = (titleEdit ?? '').trim(); setTitleEdit(null); if (t && t !== currentSession.title) void doiTen(currentSession.sessionId, t); }}
                  aria-label="Tên cuộc trò chuyện"
                />
              ) : (
                <button type="button" className="ctc-title-btn" onClick={() => setTitleMenu((v) => !v)} title={currentSession.title}>
                  <span>{currentSession.title || 'Cuộc trò chuyện mới'}</span>
                  <ChevronDown size={14} />
                </button>
              )}
              {titleMenu && (
                <div className="ctc-menu" style={{ left: 0, top: 'calc(100% + 4px)' }} role="menu">
                  <button type="button" className="ctc-menu-item" disabled={currentSession.sessionId.startsWith('local_')} onClick={() => { setTitleMenu(false); void ghimPhien(currentSession.sessionId, !currentSession.pinned); }}>
                    <Pin size={15} /> {currentSession.pinned ? 'Bỏ ghim' : 'Ghim'}
                  </button>
                  <button type="button" className="ctc-menu-item" onClick={() => { setTitleMenu(false); setTitleEdit(currentSession.title || ''); }}>
                    <Pencil size={15} /> Đổi tên
                  </button>
                  <div className="ctc-menu-sep" />
                  <button
                    type="button"
                    className="ctc-menu-item"
                    data-danger
                    onClick={() => {
                      setTitleMenu(false);
                      if (window.confirm(`Xoá "${currentSession.title || 'cuộc trò chuyện này'}"? Không khôi phục được.`)) void xoaPhien(currentSession.sessionId);
                    }}
                  >
                    <Trash2 size={15} /> Xoá
                  </button>
                </div>
              )}
            </div>
          )}

          <span className="ctc-top-spacer" />
          {limitedMode && (
            <button type="button" className="ctc-badge" style={{ border: 0, cursor: 'pointer' }} onClick={() => setLimitedMode(false, '')} title="Thử lại AI">
              Chế độ tiết kiệm · thử lại
            </button>
          )}
          <button type="button" className="ctc-icon-btn" onClick={() => setCallOpen(true)} aria-label="Nói chuyện bằng giọng" title="Nói chuyện bằng giọng">
            <Mic size={17} />
          </button>
          <span className="ctc-hide-sm"><QuotaIndicator compact /></span>
        </header>

        {empty ? (
          <div className="ctc-home">
            <div className="ctc-home-hello">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.png" alt="" />
              <h1>{loiChao(tenGoi)}</h1>
            </div>
            <div className="ctc-dock-inner">{composer}</div>
            <div className="ctc-suggest">
              {suggestedPrompts.slice(0, 5).map((p) => (
                <button key={p.id} type="button" onClick={() => void sendMessage(p.prompt)} disabled={isStreaming}>
                  <span aria-hidden>{p.icon}</span> {p.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="ctc-scroll" ref={scrollRef} onScroll={onScroll}>
              <div className="ctc-col" ref={colRef} data-testid="ctc-messages">
                {currentMessages.map((m, i) => (m.role === 'user' ? (
                  <CtcUserMessage key={`${m.id}-${i}`} msg={m} locked={isStreaming} onEdit={(t) => void suaTin(i, t)} />
                ) : (
                  <CtcAssistantMessage
                    key={`${m.id}-${i}`}
                    msg={m}
                    streaming={isStreaming && i === currentMessages.length - 1}
                    isLast={i === lastAiIdx}
                    locked={isStreaming}
                    steps={isStreaming && i === currentMessages.length - 1 ? buocWeb : undefined}
                    onRegenerate={() => void taoLai(i)}
                  />
                )))}
                {!isStreaming && !boQuaCatMach && soKyTu >= NGUONG_HOI && currentSessionId && (
                  <div className="ctc-notice" data-tone="warn">
                    <span style={{ flex: 1 }}>Cuộc này đã dài — mỗi câu hỏi đang gửi lại ~{Math.round(soKyTu / 1000)}k ký tự. Bắt đầu mạch mới để trả lời nhanh và gọn hơn.</span>
                    <button type="button" className="ctc-btn" onClick={() => { setContextReset(currentSessionId); toast.success('Đã bắt đầu mạch mới'); }}>Mạch mới</button>
                    <button type="button" className="ctc-icon-btn" data-sm aria-label="Để sau" onClick={() => setBoQuaCatMach(true)}><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>
            <div className="ctc-dock">
              <div className="ctc-dock-inner">
                {!nearBottom && (
                  <button type="button" className="ctc-to-bottom" onClick={() => { setNearBottom(true); toBottom(); }} aria-label="Cuộn xuống cuối">
                    <ArrowDown size={16} />
                  </button>
                )}
                {composer}
                <div className="ctc-disclaimer">CuongMini có thể nhầm. Hãy kiểm tra lại thông tin quan trọng.</div>
              </div>
            </div>
          </>
        )}
      </main>

      <AnimatePresence>
        {callOpen && (
          <VoiceCallOverlay
            open={callOpen}
            onClose={() => setCallOpen(false)}
            skin="studio"
            onAsk={(text) => sendMessage(text, false, undefined, { voice: true })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
