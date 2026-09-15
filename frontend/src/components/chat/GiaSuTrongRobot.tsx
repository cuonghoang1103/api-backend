'use client';

/**
 * ============================================================
 * GIA SƯ BÀI HỌC — bản nằm trong con robot nổi
 * ============================================================
 *
 * Người dùng 15/09/2026: "đang học ở trên nhiều lúc phải lướt xuống dưới để
 * chat … rất là phiền", và "con robot bên dưới kia hiện thì thô nên bạn code
 * và nâng cấp làm sao cho nó hiển thị đúng, đẹp chuyên nghiệp và dễ nhìn".
 *
 * Đây là VỎ THỨ HAI của gia sư. Ruột nằm ở `useGiaSuBai`, dùng chung với mục
 * cuối bài — nên sơ đồ, KaTeX, khối mã, nút "Bản tiếng Anh", nhãn cache đều
 * là cùng một mã chạy, không thể lệch nhau. Xem chú thích đầu hook.
 *
 * ⚠️ VÌ SAO KHÔNG GIỮ NGUYÊN LỐI "TERMINAL" CỦA KHUNG ROBOT. Khung chat của
 * robot vốn dựng cho câu trả lời ngắn về portfolio: chữ mono, xanh lơ trên
 * nền gần đen, bề ngang 390px. Một bài giảng thì có tiêu đề, danh sách nhiều
 * cấp, bảng, công thức và sơ đồ — đổ vào khuôn đó là đúng chữ "thô" người
 * dùng nói. Nên phần THÂN câu trả lời ở đây dùng chữ đọc bình thường và nền
 * dịu, còn phần khung ngoài vẫn giữ nhận diện cũ.
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookMarked, BookOpen, Crown, ImagePlus, Languages, Loader2, MessageCirclePlus, RefreshCw, Send, Sparkles, Trash2, User, X } from 'lucide-react';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { GOI_Y_GIA_SU, useGiaSuBai } from '@/components/academy/useGiaSuBai';
import { useFaqGiaSu } from '@/components/academy/useFaqGiaSu';
import ChonSlide from '@/components/academy/ChonSlide';
import { cauHoiSlide, khoaCacheSlide, type Slide } from '@/components/academy/docSlide';
import type { BaiDangHoc } from '@/store/giaSuBaiStore';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';

export default function GiaSuTrongRobot({ bai, rong }: { bai: BaiDangHoc; rong: boolean }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();
  const {
    turns, question, setQuestion, asking, hoi, hoiTiengAnh, hoiLaiMoi, nhoLaiCauCu,
    anhDan, themAnh, boAnh, danVao,
  } = useGiaSuBai({ lessonId: bai.lessonId });
  const faq = useFaqGiaSu(`/courses/lessons/${bai.lessonId}/ai/asks`, bai.lessonId);
  const oFileRef = useRef<HTMLInputElement>(null);
  const oNhap = useRef<HTMLTextAreaElement>(null);

  const cuoiRef = useRef<HTMLDivElement>(null);

  /* Cuộn xuống theo câu trả lời đang gõ. `turns` đổi ở MỖI mẩu delta nên
     hiệu ứng này chạy liên tục — dùng `auto` chứ không `smooth`: cuộn mượt bị
     gọi lại mỗi 50ms sẽ tự huỷ lẫn nhau và khung đứng im giữa chừng. */
  useEffect(() => {
    cuoiRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
  }, [turns]);

  const ten = bai.lessonTitle || bai.courseTitle || 'bài đang học';

  if (!isAuthed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <BookOpen className="h-8 w-8 text-[#22d3ee]/60" />
        <p className="text-sm text-[#94a3b8]">Đăng nhập để hỏi gia sư riêng cho bài này.</p>
        <Link href="/login" className="rounded-lg bg-[#22d3ee]/15 px-4 py-2 text-sm font-semibold text-[#22d3ee] hover:bg-[#22d3ee]/25">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <Crown className="h-8 w-8 text-amber-400" />
        <p className="text-sm text-[#94a3b8]">Gia sư riêng từng bài là tính năng Pro.</p>
        <Link href="/pro" className="rounded-lg px-4 py-2 text-sm font-bold text-white"
          style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)' }}>
          Nâng cấp Pro
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Thanh ngữ cảnh — người học phải thấy NGAY là robot đang nói về bài nào.
          Thiếu nó thì hỏi "chỗ này khó quá" mà không biết "chỗ này" là bài nào,
          và câu trả lời đúng cũng trông như trả lời nhầm. */}
      <div className="flex items-center gap-2 border-b border-[#22d3ee]/10 bg-[#22d3ee]/5 px-4 py-2">
        <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#22d3ee]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-[#e2e8f0]" title={ten}>{ten}</p>
          {bai.courseCode && (
            <p className="truncate text-[10px] font-mono uppercase tracking-wide text-[#64748b]">
              {bai.courseCode}{bai.courseTitle ? ` · ${bai.courseTitle}` : ''}
            </p>
          )}
        </div>
        {/* Câu hỏi thường gặp — người dùng 15/09/2026: khung robot thiếu đúng
            mục này so với mục gia sư cuối bài. Nó là chỗ đọc lại câu AI đã trả
            lời sẵn, khỏi hỏi lại (mỗi lần hỏi lại là một lượt gọi model). */}
        <button
          type="button"
          onClick={faq.batMo}
          title="Câu hỏi thường gặp của bài này"
          aria-label="Câu hỏi thường gặp"
          className={`flex h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-[11px] font-medium transition-colors ${
            faq.mo ? 'bg-[#22d3ee]/20 text-[#22d3ee]' : 'text-[#64748b] hover:bg-[#22d3ee]/10 hover:text-[#22d3ee]'}`}
        >
          <BookMarked className="h-3.5 w-3.5" />
          {faq.ds?.length ? faq.ds.length : 'Hỏi đáp'}
        </button>
      </div>

      {faq.mo && (
        <div className="max-h-64 overflow-y-auto border-b border-[#22d3ee]/10 bg-[#0a0a0f]">
          {faq.dangTai && !faq.ds ? (
            <p className="px-3 py-4 text-center text-[11px] text-[#64748b]">Đang tải…</p>
          ) : !faq.ds?.length ? (
            <p className="px-3 py-4 text-center text-[11px] text-[#64748b]">
              Chưa ai hỏi gì ở bài này. Câu bạn hỏi sẽ được lưu lại đây cho người sau.
            </p>
          ) : (
            <>
              {faq.ds.map((f) => {
                const dangMo = faq.moMuc === f.id;
                return (
                  <div key={f.id} className="border-b border-[#22d3ee]/10 last:border-b-0">
                    <div className="flex items-start gap-1.5 px-3 py-2">
                      <button type="button" onClick={() => faq.datMoMuc(dangMo ? null : f.id)} className="min-w-0 flex-1 text-left">
                        <span className="block text-[12px] font-medium text-[#e2e8f0]">{f.question}</span>
                        <span className="mt-0.5 block text-[10px] text-[#64748b]">
                          {f.nguoiHoi} · {new Date(f.createdAt).toLocaleDateString('vi-VN')}
                          {f.lang === 'en' && ' · EN'}
                          {!dangMo && ' · bấm để xem'}
                        </span>
                      </button>
                      {/* Chỉ người hỏi mới thấy nút xoá — máy chủ kiểm lại lần
                          nữa, ở đây chỉ là không mời mọc. */}
                      {f.cuaToi && (
                        <button type="button" onClick={() => void faq.xoa(f.id)} aria-label="Xoá câu hỏi này"
                          className="shrink-0 rounded p-1 text-[#64748b] hover:text-[#f87171]">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {dangMo && (
                      <div className="px-3 pb-2.5">
                        <div className="ct-robot-tra text-[13px] leading-relaxed text-[#e6edf3]"
                          style={{ overflowWrap: 'anywhere' }}>
                          <ChatMarkdown content={f.answer} />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            nhoLaiCauCu(f);
                            faq.datMoMuc(null);
                            setTimeout(() => oNhap.current?.focus(), 0);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#22d3ee]/20 px-2.5 py-1.5 text-[11px] font-medium text-[#22d3ee] hover:bg-[#22d3ee]/10"
                        >
                          <MessageCirclePlus className="h-3 w-3" /> Hỏi tiếp từ câu này
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {faq.conNua && (
                <button type="button" onClick={() => void faq.napThem()} disabled={faq.dangTai}
                  className="w-full px-3 py-2 text-center text-[11px] font-medium text-[#64748b] hover:text-[#22d3ee] disabled:opacity-50">
                  {faq.dangTai ? 'Đang tải…' : 'Xem thêm câu cũ hơn'}
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-4 py-3">
        {turns.length === 0 && (
          <div className="pt-2">
            <p className="mb-3 text-[13px] leading-relaxed text-[#94a3b8]">
              Hỏi bất cứ điều gì về bài này — chỗ chưa hiểu, kiến thức nền còn thiếu,
              xin bài tập luyện, hoặc dán bài của bạn nhờ chữa.
            </p>
            {!!bai.slides?.length && (
              <ChonSlide
                toi
                slides={bai.slides}
                khoa={asking}
                onChon={(sl: Slide) => void hoi(cauHoiSlide(sl), { cacheKey: khoaCacheSlide(sl) })}
              />
            )}
            <div className="grid gap-1.5">
              {GOI_Y_GIA_SU.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => void hoi(g.q, { cacheKey: g.key })}
                  disabled={asking}
                  className="rounded-xl border border-[#22d3ee]/15 bg-[#0d1117] px-3 py-2 text-left text-[12.5px] leading-snug
                    text-[#cbd5e1] transition-colors hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/5 disabled:opacity-40"
                >
                  {g.q}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className="flex gap-2">
            <span className="mt-1 shrink-0">
              {t.role === 'user'
                ? <User className="h-3.5 w-3.5 text-[#64748b]" />
                : <Sparkles className="h-3.5 w-3.5 text-[#22d3ee]" />}
            </span>
            <div className="min-w-0 flex-1">
              <div
                className={`rounded-xl px-3 py-2 ${t.role === 'user'
                  ? 'bg-[#1e293b] text-[13px] text-[#e2e8f0]'
                  : 'bg-[#0f172a] text-[13.5px] leading-relaxed text-[#e6edf3]'}`}
                /* ⚠️ `overflow-wrap` + `minWidth:0` cho khối trả lời: một khối
                   mã dài hoặc một URL không có dấu cách sẽ ĐẨY RỘNG cả khung
                   nổi, và người dùng phải cuộn NGANG để đọc bài giảng. */
                style={t.role === 'assistant' ? { overflowWrap: 'anywhere' } : undefined}
              >
                {t.role === 'user'
                  ? (
                    <>
                      {!!t.anh?.length && (
                        <div className="mb-1.5 flex flex-wrap gap-1.5">
                          {t.anh.map((u, k) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={k} src={u} alt="" className="h-16 w-16 rounded-lg border border-[#22d3ee]/20 object-cover" />
                          ))}
                        </div>
                      )}
                      <span className="whitespace-pre-wrap">{t.content}</span>
                    </>
                  )
                  : (t.streaming && !t.content)
                    ? <span className="inline-flex items-center gap-2 text-[#94a3b8]">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang soạn…
                      </span>
                    : (
                      <div className="ct-robot-tra">
                        {/* `renderMath` chỉ bật khi đã gõ xong — KaTeX dựng lại
                            ở mỗi mẩu delta thì vừa giật vừa nhấp nháy công thức
                            dở dang. Giống hệt mục cuối bài. */}
                        <ChatMarkdown content={t.content} renderMath={!t.streaming} />
                        {t.streaming && (
                          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle bg-[#22d3ee]" />
                        )}
                      </div>
                    )}
              </div>

              {t.role === 'assistant' && !t.streaming && (t.cached || t.srcQuestion) && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px] text-[#64748b]">
                  {t.cached && (
                    <span className="rounded-full bg-[#22d3ee]/10 px-1.5 py-0.5 text-[#22d3ee]">⚡ Trả lời có sẵn</span>
                  )}
                  {!t.english && t.srcQuestion && !t.enDone && (
                    <button type="button" onClick={() => hoiTiengAnh(i)} disabled={asking}
                      className="inline-flex items-center gap-1 hover:text-[#22d3ee] disabled:opacity-40">
                      <Languages className="h-3 w-3" /> Bản tiếng Anh
                    </button>
                  )}
                  {t.srcQuestion && (
                    <button type="button" onClick={() => hoiLaiMoi(i)} disabled={asking}
                      className="inline-flex items-center gap-1 hover:text-[#22d3ee] disabled:opacity-40">
                      <RefreshCw className="h-2.5 w-2.5" /> Hỏi lại mới
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={cuoiRef} />
      </div>

      <div className="border-t border-[#22d3ee]/10 bg-[#0d1117]/70 px-3 py-2.5">
        {anhDan.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {anhDan.map((u, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" className="h-14 w-14 rounded-lg border border-[#22d3ee]/25 object-cover" />
                <button
                  type="button"
                  onClick={() => boAnh(i)}
                  aria-label="Bỏ ảnh"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0a0a0f] text-[#94a3b8] ring-1 ring-[#22d3ee]/30 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          {/* Nút chọn ảnh — đường vào thứ hai cạnh Ctrl+V. Máy không có clipboard
              ảnh (hoặc trình duyệt chặn đọc clipboard) thì đây là lối duy nhất. */}
          <input
            ref={oFileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            hidden
            onChange={(e) => {
              const ds = [...(e.target.files ?? [])];
              e.target.value = '';   // chọn lại đúng file đó lần nữa phải được
              if (ds.length) void themAnh(ds);
            }}
          />
          <button
            type="button"
            onClick={() => oFileRef.current?.click()}
            disabled={asking}
            title="Gửi kèm ảnh (hoặc dán thẳng bằng Ctrl+V)"
            aria-label="Gửi kèm ảnh"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#22d3ee]/15 text-[#64748b] transition-colors hover:border-[#22d3ee]/40 hover:text-[#22d3ee] disabled:opacity-35"
          >
            <ImagePlus className="h-4 w-4" />
          </button>
          <textarea
            ref={oNhap}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;   // Enter đang chốt chữ cho bộ gõ tiếng Việt
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void hoi(question); }
            }}
            onPaste={danVao}
            rows={rong ? 2 : 1}
            placeholder="Hỏi về bài này — dán ảnh chụp màn hình cũng được…"
            className="min-w-0 flex-1 resize-none rounded-xl border border-[#22d3ee]/15 bg-[#0a0a0f] px-3 py-2
              text-[13px] text-[#e2e8f0] outline-none placeholder:text-[#475569] focus:border-[#22d3ee]/40"
          />
          <button
            type="button"
            onClick={() => void hoi(question)}
            disabled={asking || (!question.trim() && anhDan.length === 0)}
            aria-label="Hỏi gia sư"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#22d3ee]/15 text-[#22d3ee]
              transition-colors hover:bg-[#22d3ee]/25 disabled:opacity-35"
          >
            {asking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
