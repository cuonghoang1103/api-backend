'use client';

/**
 * Lưu vào sổ tay — gắn việc học với Notes.
 *
 * (a) Bôi đen chữ trong nội dung bài (`.rich-content`) → nút nổi
 *     "📝 Lưu vào sổ tay" → đoạn đó vào trang của BÀI NÀY trong
 *     "📘 <tên khoá>" (NoteSubject clientId `khoa:<slug>`, trang clientId
 *     `khoa-bai:<lessonId>` — tự tạo lần đầu, xem ghiNhanh.service.ts).
 *     Bôi đen trong khối code thì lưu thành khối code.
 * (c) Mục nhỏ "Ghi chú của bạn cho bài này": các đoạn đã lưu + link mở /notes.
 *
 * Không làm chậm trang học: khách thì không gắn gì; danh sách đoạn chỉ tải
 * khi mục đó CUỘN TỚI (IntersectionObserver), và tải lại khi đổi bài.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, NotebookPen, ExternalLink } from 'lucide-react';
import { ghiNhanhApi, type DoanDaLuu } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Props {
  courseSlug: string;
  lessonId: number;
}

interface ViTri { top: number; left: number; text: string; laCode: boolean }

const MAX_CHU = 5000;

function vungBaiHoc(node: Node | null): HTMLElement | null {
  const el = node ? (node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement) : null;
  return el?.closest<HTMLElement>('.rich-content') ?? null;
}

export default function LuuVaoSoTay({ courseSlug, lessonId }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [viTri, setViTri] = useState<ViTri | null>(null);
  const [dangLuu, setDangLuu] = useState(false);
  const [ds, setDs] = useState<{ noteId: number | null; doan: DoanDaLuu[] } | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [thay, setThay] = useState(false);
  const [moRong, setMoRong] = useState(false);
  const mucRef = useRef<HTMLElement>(null);

  // ── (a) theo dõi vùng chọn ──────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    let hen: number | undefined;
    const doVungChon = () => {
      window.clearTimeout(hen);
      hen = window.setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) { setViTri(null); return; }
        const range = sel.getRangeAt(0);
        const vung = vungBaiHoc(range.commonAncestorContainer);
        const text = sel.toString().trim();
        if (!vung || !text) { setViTri(null); return; }
        const r = range.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) { setViTri(null); return; }
        const goc = range.commonAncestorContainer;
        const gocEl = goc.nodeType === Node.ELEMENT_NODE ? (goc as HTMLElement) : goc.parentElement;
        const laCode = Boolean(gocEl?.closest('pre'));
        // Màn cảm ứng: menu chọn chữ của hệ điều hành nằm TRÊN vùng chọn —
        // đặt nút xuống dưới để khỏi đè nhau.
        const cham = window.matchMedia?.('(pointer: coarse)').matches;
        const top = cham ? r.bottom + 10 : r.top - 44;
        setViTri({
          top: Math.max(8, Math.min(window.innerHeight - 48, top)),
          left: Math.max(8, Math.min(window.innerWidth - 190, r.left + r.width / 2 - 90)),
          text: text.slice(0, MAX_CHU),
          laCode,
        });
      }, 120);
    };
    const an = () => setViTri(null);
    document.addEventListener('selectionchange', doVungChon);
    window.addEventListener('scroll', an, true);
    window.addEventListener('resize', an);
    return () => {
      window.clearTimeout(hen);
      document.removeEventListener('selectionchange', doVungChon);
      window.removeEventListener('scroll', an, true);
      window.removeEventListener('resize', an);
    };
  }, [isAuthenticated]);

  // ── (c) tải lười danh sách đoạn đã lưu ──────────────────────
  useEffect(() => {
    setDs(null);
    setMoRong(false);
  }, [lessonId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const el = mucRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setThay(true); return; }
    const ob = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setThay(true); ob.disconnect(); }
    }, { rootMargin: '200px' });
    ob.observe(el);
    return () => ob.disconnect();
  }, [isAuthenticated, lessonId]);

  const taiDs = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await ghiNhanhApi.doanCuaBai(courseSlug, lessonId);
      setDs({ noteId: r.data.data.noteId, doan: r.data.data.doan });
    } catch {
      setDs({ noteId: null, doan: [] });
    } finally { setDangTai(false); }
  }, [courseSlug, lessonId]);

  useEffect(() => {
    if (thay && isAuthenticated && ds === null) void taiDs();
  }, [thay, isAuthenticated, ds, taiDs]);

  const luu = useCallback(async () => {
    if (!viTri || dangLuu) return;
    setDangLuu(true);
    try {
      const r = await ghiNhanhApi.luuDoanBaiHoc({ courseSlug, lessonId, text: viTri.text, laCode: viTri.laCode });
      const { noteId, subjectName } = r.data.data;
      toast.success(`Đã lưu vào ${subjectName}`, {
        action: { label: 'Mở', onClick: () => { window.location.href = `/notes?note=${noteId}`; } },
      });
      window.getSelection()?.removeAllRanges();
      setViTri(null);
      void taiDs();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không lưu được vào sổ tay');
    } finally { setDangLuu(false); }
  }, [viTri, dangLuu, courseSlug, lessonId, taiDs]);

  if (!isAuthenticated) return null;

  const doan = ds?.doan ?? [];
  const hien = moRong ? doan : doan.slice(-3);

  return (
    <>
      {viTri && (
        <button
          type="button"
          // mousedown mặc định sẽ XOÁ vùng chọn trước khi click chạy.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => void luu()}
          disabled={dangLuu}
          className="fixed z-[60] flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl hover:bg-violet-500 disabled:opacity-70"
          style={{ top: viTri.top, left: viTri.left }}
        >
          {dangLuu ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span aria-hidden>📝</span>}
          Lưu vào sổ tay
        </button>
      )}

      <section ref={mucRef} className="bg-darkcard border border-darkborder/50 rounded-2xl p-5 mb-8" aria-label="Ghi chú của bạn cho bài này">
        <div className="flex items-center gap-2 mb-3">
          <NotebookPen className="w-5 h-5 text-neon-violet" />
          <h3 className="font-semibold text-text-primary">Ghi chú của bạn cho bài này</h3>
          {ds?.noteId && (
            <a href={`/notes?note=${ds.noteId}`} className="ml-auto inline-flex items-center gap-1 text-xs text-neon-violet hover:underline">
              Mở trong Sổ tay <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        {dangTai && ds === null ? (
          <div className="flex items-center gap-2 text-sm text-text-muted"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : doan.length === 0 ? (
          <p className="text-sm text-text-muted">
            Bôi đen một đoạn trong bài rồi bấm <strong>📝 Lưu vào sổ tay</strong> — đoạn đó vào sổ tay của khoá, kèm tên bài và đường về đây.
          </p>
        ) : (
          <>
            {doan.length > hien.length && (
              <button type="button" onClick={() => setMoRong(true)} className="mb-2 text-xs text-neon-violet hover:underline">
                Xem cả {doan.length} đoạn
              </button>
            )}
            <ul className="space-y-2">
              {hien.map((d, i) => (
                <li key={i} className="rounded-lg border border-darkborder/50 px-3 py-2 text-sm text-text-secondary">
                  {d.laCode
                    ? <pre className="whitespace-pre-wrap break-words font-mono text-xs">{d.text}</pre>
                    : <p className="whitespace-pre-wrap break-words line-clamp-4">{d.text}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
