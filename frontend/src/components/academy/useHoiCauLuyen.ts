'use client';

/**
 * ============================================================
 * RUỘT CỦA "HỎI AI TỪNG CÂU" KHI LUYỆN CHƯƠNG — không giao diện
 * ============================================================
 *
 * Gọi CuongMini (gia sư của Phòng thi) cho MỘT câu đề thật, không cần lượt
 * thi: `POST /exams/practice/questions/:id/ai/ask-stream`. Hội thoại nằm ở
 * `hoiCauLuyenStore`, nên nút robot trên câu và con robot nổi là CÙNG một mạch.
 *
 * Vì sao dùng gia sư Phòng thi chứ không dùng gia sư bài học:
 *  • nó đọc đề + đáp án TỪ CSDL theo questionId — máy khách không phải (và
 *    không thể) gửi đề lên, nên không có chuyện đề bị sửa ở máy khách;
 *  • ngữ cảnh chỉ là MỘT câu thay vì cả nội dung bài (tới 32k ký tự) — mỗi
 *    lượt rẻ hơn hàng chục lần;
 *  • câu trả lời của chip được cache theo câu, dùng chung với Phòng thi: câu
 *    nào đã có người hỏi thì người sau nhận NGAY, không tốn lượt gọi model.
 */

import { useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { api, examApi } from '@/lib/api';
import { useHoiCauLuyenStore, type LuotAI } from '@/store/hoiCauLuyenStore';

export type CheDoHoi =
  | 'hint' | 'translate'
  | 'how_to_solve' | 'why_others_wrong' | 'knowledge' | 'how_to_remember'
  | 'common_mistakes' | 'similar_example' | 'summary_rule'
  | 'free_qa';

/**
 * Chín câu hỏi dựng sẵn cho một câu quiz.
 *
 * ⚠️ `nhan` PHẢI trùng chữ với `MODE_LABEL` ở `examComment.service.ts`: đó là
 * chữ hiện ở bình luận CuongMini trong Phòng thi, và người học đã quen nhãn
 * đó. (Khoá cache ở máy chủ tính theo mode, không theo chữ ở đây — nhưng hai
 * nơi ghi hai nhãn khác nhau cho cùng một câu hỏi thì trông như hai tính năng.)
 *
 * `loDapAn`: câu trả lời sẽ nói thẳng đáp án — gắn nhãn nhỏ khi người học
 * CHƯA làm câu đó, để họ biết trước khi bấm.
 * `chiKhiChuaLam`: chỉ có nghĩa trước khi trả lời (gợi ý thì đã làm rồi còn
 * gợi ý gì).
 */
export const CHE_DO_HOI: { ma: Exclude<CheDoHoi, 'free_qa'>; nhan: string; loDapAn?: boolean; chiKhiChuaLam?: boolean }[] = [
  { ma: 'hint', nhan: 'Gợi ý (chưa lộ đáp án)', chiKhiChuaLam: true },
  { ma: 'translate', nhan: 'Dịch đề sang tiếng Việt' },
  { ma: 'how_to_solve', nhan: 'Câu này làm như nào?', loDapAn: true },
  { ma: 'why_others_wrong', nhan: 'Vì sao các đáp án khác sai?', loDapAn: true },
  { ma: 'knowledge', nhan: 'Câu này kiến thức là gì?' },
  { ma: 'how_to_remember', nhan: 'Câu này nhớ như nào?' },
  { ma: 'common_mistakes', nhan: 'Lỗi hay gặp khi làm câu này?' },
  { ma: 'similar_example', nhan: 'Cho ví dụ tương tự để luyện thêm', loDapAn: true },
  { ma: 'summary_rule', nhan: 'Tóm tắt công thức/quy tắc liên quan' },
];

const NHAN_THEO_MA: Record<string, string> = Object.fromEntries(CHE_DO_HOI.map((c) => [c.ma, c.nhan]));

/** Chip nào hiện cho một câu, theo thứ tự hợp với lúc CHƯA làm / ĐÃ làm. */
export function chipChoCau(daLam: boolean) {
  if (!daLam) return CHE_DO_HOI;
  const uuTien: CheDoHoi[] = ['how_to_solve', 'why_others_wrong', 'knowledge', 'how_to_remember',
    'common_mistakes', 'similar_example', 'summary_rule', 'translate'];
  return uuTien.map((m) => CHE_DO_HOI.find((c) => c.ma === m)!).filter(Boolean);
}

function layToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

/* Một mảng rỗng DÙNG CHUNG làm giá trị mặc định của selector — `?? []` viết
   thẳng trong selector tạo mảng mới mỗi lần, zustand so bằng `Object.is`, và
   component vẽ lại vô tận. Cùng lý do với `RONG` trong `useGiaSuBai`. */
const RONG: LuotAI[] = [];

export function useLuotCua(qid: number | null | undefined): LuotAI[] {
  return useHoiCauLuyenStore((s) => (qid != null ? (s.cuoc[qid] ?? RONG) : RONG));
}

export function useHoiCauLuyen() {
  const datCuoc = useHoiCauLuyenStore((s) => s.datCuoc);
  const dangHoi = useHoiCauLuyenStore((s) => s.dangHoi);
  const datDangHoi = useHoiCauLuyenStore((s) => s.datDangHoi);

  /* Chốt chặn đồng bộ, không đợi React vẽ lại: hai cú bấm trong cùng một
     khung hình đều thấy `dangHoi === null` nếu chỉ đọc state. */
  const dangChay = useRef(false);

  const patch = useCallback((qid: number, i: number, upd: Partial<LuotAI>) => {
    datCuoc(qid, (t) => t.map((x, k) => (k === i ? { ...x, ...upd } : x)));
  }, [datCuoc]);

  const chayStream = useCallback(async (
    qid: number, aIdx: number, body: { mode: CheDoHoi; question?: string; history: { role: string; content: string }[] },
  ) => {
    /* ⚠️ ĐƯỜNG DẪN TUYỆT ĐỐI dựng từ `baseURL` của axios — cùng lý do ở
       `useGiaSuBai`: app desktop dùng lại component này ở origin `app://`,
       một `fetch('/api/v1/…')` tương đối sẽ bay vào hư không. */
    const goc = String(api.defaults.baseURL ?? '').replace(/\/api\/v1\/?$/, '');
    const tok = layToken();
    const res = await fetch(`${goc}/api/v1/exams/practice/questions/${qid}/ai/ask-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(tok ? { Authorization: `Bearer ${tok}` } : {}) },
      body: JSON.stringify(body),
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let acc = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split('\n\n');
      buffer = frames.pop() || '';
      for (const frame of frames) {
        for (const line of frame.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (!raw) continue;
          let evt: { type?: string; text?: string; answer?: string; error?: string; cached?: boolean };
          try { evt = JSON.parse(raw); } catch { continue; }
          if (evt.type === 'delta' && evt.text) {
            acc += evt.text;
            patch(qid, aIdx, { content: acc });
          } else if (evt.type === 'done') {
            // Bản chuẩn cuối — thay hẳn (né lặp nếu stream có retry).
            patch(qid, aIdx, { content: evt.answer ?? acc, streaming: false, cached: !!evt.cached });
            return;
          } else if (evt.type === 'error') {
            /* Lỗi CÓ CHỦ Ý từ máy chủ (chưa Pro, hết hạn mức, câu không tồn
               tại) — đánh dấu để KHÔNG lùi sang POST: lùi thì chỉ nhận lại
               đúng lỗi đó lần nữa, tốn thêm một vòng chờ. */
            const e = new Error(evt.error || 'CuongMini chưa trả lời được.');
            (e as Error & { tuMayChu?: boolean }).tuMayChu = true;
            throw e;
          }
        }
      }
    }
    if (!acc.trim()) throw new Error('empty stream');
    patch(qid, aIdx, { content: acc, streaming: false });
  }, [patch]);

  /**
   * Hỏi CuongMini về câu `qid`.
   * - Chip: `mode` là một trong `CHE_DO_HOI`, bong bóng người dùng hiện NHÃN chip.
   * - Gõ tay: `mode = 'free_qa'` + `text`.
   */
  const hoi = useCallback(async (qid: number, mode: CheDoHoi, text?: string) => {
    const q = (text || '').trim();
    if (mode === 'free_qa' && !q) return;
    /* Hai chốt: `dangChay` (ref) chặn hai cú bấm trong cùng khung hình của
       MỘT lối vào; `dangHoi` (kho) chặn lối vào KIA — mỗi lối vào có hook
       riêng nên ref của lối này không thấy lượt đang chạy của lối kia. */
    if (dangChay.current || useHoiCauLuyenStore.getState().dangHoi != null) return;
    dangChay.current = true;
    datDangHoi(qid);

    const lichSu = (useHoiCauLuyenStore.getState().cuoc[qid] ?? [])
      .filter((t) => !t.streaming && t.content.trim())
      .map((t) => ({ role: t.role, content: t.content }));
    const nhanNguoiDung = mode === 'free_qa' ? q : (NHAN_THEO_MA[mode] ?? q);
    /* Vị trí lượt trợ lý tính NGAY TRONG hàm cập nhật (zustand chạy nó đồng
       bộ), từ đúng mảng sắp ghi — tính từ `lichSu` (đã lọc lượt rỗng) là có
       ngày lệch một ô và delta chảy nhầm vào bong bóng người dùng. */
    let aIdx = -1;
    datCuoc(qid, (t) => {
      const goc = t.filter((x) => !x.streaming);
      aIdx = goc.length + 1;
      return [...goc, { role: 'user', content: nhanNguoiDung }, { role: 'assistant', content: '', streaming: true }];
    });

    const body = { mode, ...(mode === 'free_qa' ? { question: q } : {}), history: lichSu };
    try {
      await chayStream(qid, aIdx, body);
    } catch (loi) {
      const tuMayChu = !!(loi as { tuMayChu?: boolean })?.tuMayChu;
      let thongBao = (loi as Error)?.message || 'CuongMini chưa trả lời được. Thử lại nhé.';
      let xong = false;
      if (!tuMayChu) {
        // SSE hỏng / không hỗ trợ → POST thường, đừng để gia sư chết.
        try {
          const r = await examApi.practiceAiAsk(qid, body);
          patch(qid, aIdx, { content: r.data.data.answer, streaming: false, cached: !!r.data.data.cached });
          xong = true;
        } catch (e: unknown) {
          const status = (e as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
          const tuSV = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
          thongBao = status === 403 ? 'Hỏi CuongMini là tính năng Pro.' : (tuSV || 'CuongMini chưa trả lời được. Thử lại nhé.');
        }
      }
      if (!xong) {
        datCuoc(qid, (t) => t.slice(0, -2)); // gỡ cặp bong bóng hỏng
        toast.error(thongBao);
      }
    } finally {
      dangChay.current = false;
      datDangHoi(null);
    }
  }, [chayStream, datCuoc, datDangHoi, patch]);

  const xoaCuoc = useCallback((qid: number) => datCuoc(qid, () => []), [datCuoc]);

  return { hoi, dangHoi, xoaCuoc };
}
