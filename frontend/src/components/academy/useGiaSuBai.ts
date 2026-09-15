'use client';

/**
 * ============================================================
 * RUỘT CỦA GIA SƯ BÀI HỌC — không giao diện
 * ============================================================
 *
 * Tách ra từ `CourseTutor.tsx` ngày 15/09/2026, khi gia sư có lối vào thứ hai
 * (con robot nổi ở góc màn hình).
 *
 * ⚠️ VÌ SAO TÁCH CHỨ KHÔNG CHÉP GIAO DIỆN SANG. Người dùng nêu đúng nỗi lo:
 * "chất lượng, chức năng như sơ đồ, hình ảnh, kí hiệu toán học … khi connect
 * nó vẫn giữ nguyên như cũ". Một bản chép sẽ trôi lệch ngay lần sửa kế tiếp —
 * ai đó vá một lỗi ở vỏ này và không biết còn vỏ kia. Và thứ rụng trước sẽ
 * đúng là những thứ tinh vi: hoãn render KaTeX tới khi stream xong, dùng lại
 * `cacheKey` cho bản tiếng Anh, gửi lịch sử RỖNG khi dịch lại.
 *
 * Hook này giữ TOÀN BỘ những thứ đó. Hai vỏ (mục cuối bài, khung robot) chỉ
 * còn việc vẽ. Cùng một mã chạy nên chất lượng không thể khác nhau.
 *
 * Hội thoại nằm ở `giaSuBaiStore`, không nằm trong hook — nên hai vỏ mở cùng
 * lúc trên một bài là CÙNG một mạch, không phải hai cuộc rời.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { khoaGiaSu, useGiaSuBaiStore, type LuotGiaSu } from '@/store/giaSuBaiStore';

/** Câu quiz truyền vào để gia sư biết "câu N" là gì (dùng ở Đề luyện cuối chương). */
export interface TutorQuizItem {
  n: number;
  prompt: string;
  options: string[];
  correctIndexes: number[];
  explanation?: string;
}

/**
 * Gợi ý mở màn — đúng 4 việc học viên cần. Mỗi chip có `key` CỐ ĐỊNH để cache
 * dùng chung: ai bấm cùng chip trên cùng bài đều nhận cùng câu trả lời, tức
 * thì và không tốn thêm một lượt gọi model.
 */
export const GOI_Y_GIA_SU: { key: string; q: string }[] = [
  { key: 'start', q: 'Bài này học gì? Tôi nên bắt đầu từ đâu?' },
  { key: 'exercises', q: 'Cho tôi 3 bài tập luyện + đáp án để tự kiểm tra.' },
  { key: 'prereq', q: 'Kiến thức nền nào cần có trước khi học bài này?' },
  { key: 'hard', q: 'Giảng lại phần khó nhất của bài một cách dễ hiểu.' },
];

function layToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

const toMsg = (t: LuotGiaSu) => ({ role: t.role, content: t.content });

export interface TuyChonHoi {
  english?: boolean;
  showUser?: boolean;
  cacheKey?: string;
  /** Bỏ qua ĐỌC cache nhưng vẫn GHI ĐÈ (nút "Hỏi lại mới"). */
  refresh?: boolean;
  /** Gửi lịch sử RỖNG — xem ghi chú ở `hoiTiengAnh`. */
  noHistory?: boolean;
}

export function useGiaSuBai({ lessonId, quizContext, autoAsk }: {
  lessonId: number;
  quizContext?: TutorQuizItem[];
  /** Câu hỏi bắn đi NGAY khi `key` đổi — nút "Hỏi AI vì sao sai" ở từng câu quiz. */
  autoAsk?: { key: number; text: string } | null;
}) {
  const inQuiz = !!quizContext?.length;
  const khoa = khoaGiaSu(lessonId, inQuiz);

  const turns = useGiaSuBaiStore((s) => s.cuoc[khoa] ?? RONG);
  const datCuoc = useGiaSuBaiStore((s) => s.datCuoc);
  const xoaCuoc = useGiaSuBaiStore((s) => s.xoaCuoc);

  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);

  /*
   * ── Ảnh dán vào câu hỏi ──
   * Người dùng 15/09/2026: "tôi có thể chụp ảnh màn hình paste copy qua đó dán
   * để hỏi những chỗ chi tiết thì càng tốt".
   *
   * Giữ dạng data URL vì đó đúng là thứ route nhận. Ảnh KHÔNG đi vào `turns`:
   * `turns` là hội thoại gửi LÊN ở mọi lượt sau, mà một tấm ảnh trong đó là
   * ~1.500 token nhân với số lượt còn lại. Ảnh chỉ đi kèm ĐÚNG lượt vừa dán.
   */
  const [anhDan, datAnhDan] = useState<string[]>([]);

  /*
   * Đọc `turns` qua REF trong các hàm bất đồng bộ.
   *
   * `ask` chạy dài (stream cả chục giây) và trong lúc đó `turns` đã đổi nhiều
   * lần. Đóng kín (`closure`) giá trị cũ vào là ghi đè mất những lượt vừa tới.
   */
  const turnsRef = useRef<LuotGiaSu[]>(turns);
  turnsRef.current = turns;

  /* Đổi bài ⇒ dọn ô nhập. KHÔNG dọn hội thoại: người học quay lại bài cũ thì
     mạch chat cũ vẫn còn, đó là điều mong đợi chứ không phải rác. */
  useEffect(() => { setQuestion(''); }, [lessonId]);

  /**
   * Nhận file ảnh (từ dán, kéo thả, hay nút chọn) → data URL.
   *
   * ⚠️ CO ẢNH VỀ 1568px TRƯỚC KHI GỬI. Ảnh chụp màn hình Retina là 3456px và
   * ~1,5MB; model co nó về 1568px ở đầu kia rồi mới đọc, nên gửi to hơn chỉ
   * tốn token theo DIỆN TÍCH cho phần bị vứt đi. Đây là cùng con số app
   * desktop dùng ở `DinhKemCode.tsx`.
   */
  const themAnh = useCallback(async (ds: File[]) => {
    const nhan = ds.filter((f) => /^image\/(png|jpeg|webp|gif)$/.test(f.type) && f.size > 0);
    if (!nhan.length) return;
    const ra: string[] = [];
    for (const f of nhan.slice(0, MAX_ANH)) {
      try { ra.push(await coVaDoc(f)); } catch { /* một tấm hỏng không được làm chết cả lượt dán */ }
    }
    if (ra.length) datAnhDan((cu) => [...cu, ...ra].slice(0, MAX_ANH));
  }, []);

  const boAnh = useCallback((i: number) => {
    datAnhDan((cu) => cu.filter((_, k) => k !== i));
  }, []);

  /** Dán: chỉ nuốt sự kiện khi thật sự CÓ ảnh — dán chữ phải chạy như thường. */
  const danVao = useCallback((e: { clipboardData: DataTransfer | null; preventDefault: () => void }) => {
    const ds = [...(e.clipboardData?.items ?? [])]
      .filter((i) => i.kind === 'file')
      .map((i) => i.getAsFile())
      .filter((f): f is File => !!f && f.type.startsWith('image/'));
    if (!ds.length) return;
    e.preventDefault();
    void themAnh(ds);
  }, [themAnh]);

  const patch = useCallback((aIdx: number, upd: Partial<LuotGiaSu>) => {
    datCuoc(khoa, (t) => t.map((x, i) => (i === aIdx ? { ...x, ...upd } : x)));
  }, [datCuoc, khoa]);

  /** SSE: đọc luồng, dồn delta vào lượt trợ lý ở vị trí `aIdx`. Ném lỗi để caller lùi. */
  const chayStream = useCallback(async (
    aIdx: number, q: string, history: LuotGiaSu[], english: boolean, images: string[], cacheKey?: string, refresh?: boolean,
  ) => {
    /*
     * ⚠️ ĐƯỜNG DẪN TUYỆT ĐỐI, dựng từ `baseURL` của axios.
     *
     * Trước đây là `/api/v1/...` trần. Trên web nó trúng proxy Next cùng
     * origin nên chạy. Nhưng gia sư còn được app desktop DÙNG LẠI, mà ở đó
     * origin là `app://cuongthai` — một `fetch` tương đối sẽ bay vào
     * `app://cuongthai/api/v1/...`, không tồn tại, và gia sư hỏng CÂM ở đúng
     * chức năng chính của nó.
     */
    const goc = String(api.defaults.baseURL ?? '').replace(/\/api\/v1\/?$/, '');
    const res = await fetch(`${goc}/api/v1/courses/lessons/${lessonId}/ai/ask-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(layToken() ? { Authorization: `Bearer ${layToken()}` } : {}) },
      body: JSON.stringify({ question: q, history: history.map(toMsg), english, cacheKey, refresh, ...(images.length ? { images } : {}), ...(inQuiz ? { quizContext } : {}) }),
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
            patch(aIdx, { content: acc });
          } else if (evt.type === 'done') {
            // Bản chuẩn cuối — thay hẳn (né lặp nếu stream có retry). cached ⇒ nhãn.
            patch(aIdx, { content: (evt.answer ?? acc), streaming: false, cached: !!evt.cached });
            return;
          } else if (evt.type === 'error') {
            throw new Error(evt.error || 'AI lỗi');
          }
        }
      }
    }
    if (!acc.trim()) throw new Error('empty stream');
    patch(aIdx, { content: acc, streaming: false });
  }, [lessonId, inQuiz, quizContext, patch]);

  /** Hỏi một câu. `showUser:false` + `english:true` là lúc bấm "Bản tiếng Anh". */
  const hoi = useCallback(async (text: string, opts?: TuyChonHoi) => {
    const showUserSom = opts?.showUser !== false;
    /* Chỉ dán ảnh rồi bấm Gửi mà không gõ gì là chuyện RẤT hay xảy ra — tấm
       ảnh đã nói hết ý rồi. Không có câu mặc định thì nút Gửi ăn một cú bấm
       rồi im, không báo gì, và người học tưởng ảnh không gửi được. */
    const q = (text || '').trim()
      || (showUserSom && anhDan.length ? 'Giải thích giúp mình chỗ trong ảnh này (liên hệ với nội dung bài đang học).' : '');
    if (!q || asking) return;
    const english = !!opts?.english;
    const showUser = opts?.showUser !== false;
    const cacheKey = opts?.cacheKey;
    const refresh = !!opts?.refresh;

    setAsking(true);
    /* CHỐT ảnh ngay tại đây rồi dọn ô. Đọc `anhDan` ở trong `catch` (đường lùi
       POST) là đọc phải giá trị đã bị dọn — và ảnh biến mất đúng lúc SSE hỏng,
       tức đúng lúc khó đối chứng nhất. Lượt DỊCH LẠI / HỎI LẠI MỚI thì không
       kèm ảnh: nó dựng lại một câu trả lời cũ, không phải hỏi thêm. */
    const anhGui = showUser ? anhDan : [];
    if (showUser) { setQuestion(''); datAnhDan([]); }

    const history = opts?.noHistory ? [] : turnsRef.current.filter((t) => !t.streaming);
    const aIdx = history.length + (showUser ? 1 : 0); // vị trí lượt trợ lý mới

    datCuoc(khoa, (t) => {
      const base = showUser ? [...t, { role: 'user' as const, content: q, ...(anhGui.length ? { anh: anhGui } : {}) }] : [...t];
      return [...base, {
        role: 'assistant' as const, content: '', streaming: true,
        /* ⚠️ GIỮ `srcQuestion` cả cho lượt tiếng Anh. Để `undefined` thì nút
           "Hỏi lại mới" không hiện trên chính lượt tiếng Anh — tức đúng lượt
           đang giữ mục cache hỏng lại không sinh lại được. */
        english, srcQuestion: q, srcCacheKey: cacheKey,
      }];
    });

    try {
      await chayStream(aIdx, q, history, english, anhGui, cacheKey, refresh);
    } catch {
      // SSE hỏng/không hỗ trợ → POST thường, không để gia sư chết.
      try {
        const r = await api.post<{ success: boolean; data: { answer: string; cached?: boolean } }>(
          `/courses/lessons/${lessonId}/ai/ask`,
          { question: q, history: history.map(toMsg), english, cacheKey, refresh, ...(anhGui.length ? { images: anhGui } : {}), ...(inQuiz ? { quizContext } : {}) },
          { timeout: 240_000 });
        patch(aIdx, { content: r.data.data.answer, streaming: false, cached: !!r.data.data.cached });
      } catch (e: unknown) {
        const status = (e as { response?: { status?: number } })?.response?.status;
        datCuoc(khoa, (t) => t.slice(0, showUser ? -2 : -1)); // gỡ bubble hỏng
        if (showUser) setQuestion(q);
        toast.error(status === 403 ? 'Hỏi AI là tính năng Pro.' : 'AI chưa trả lời được. Thử lại nhé.');
      }
    } finally { setAsking(false); }
  }, [asking, lessonId, inQuiz, quizContext, chayStream, patch, datCuoc, khoa, anhDan]);

  /*
   * ⚠️⚠️ GỬI LỊCH SỬ RỖNG. Đo thật 05/09/2026: gửi kèm lịch sử thì model trả
   * lời "Bạn vừa hỏi lại câu này — tôi đã trả lời ở trên rồi nhé! 😊" — nó đọc
   * ra là hỏi TRÙNG (câu hỏi y hệt vừa nằm trong lịch sử) và đi trả lời chuyện
   * đó thay vì trả lời câu hỏi. Mà đây vốn không phải một lượt hội thoại tiếp
   * theo — nó là DỰNG LẠI một câu trả lời bằng thứ tiếng khác.
   *
   * Dùng lại cùng `cacheKey` ⇒ bản tiếng Anh cũng được cache dưới lang='en'.
   */
  const hoiTiengAnh = useCallback((aIdx: number) => {
    const t = turnsRef.current[aIdx];
    if (!t?.srcQuestion || asking) return;
    patch(aIdx, { enDone: true });
    void hoi(t.srcQuestion, { english: true, showUser: false, cacheKey: t.srcCacheKey, noHistory: true });
  }, [asking, hoi, patch]);

  /*
   * "Hỏi lại mới": sinh câu trả lời tươi VÀ ghi đè cache cho người sau.
   *
   * ⚠️ Bản cũ bỏ luôn `cacheKey` và ghi chú rằng "backend upsert nên cache
   * cũng được làm mới" — SAI: máy chủ chỉ GHI khi có `cacheKey`, nên nó vừa
   * không đọc vừa không ghi, và một mục cache hỏng nằm lại đó vĩnh viễn cho
   * mọi người. Nay giữ `cacheKey` + `refresh:true`: bỏ qua ĐỌC, vẫn GHI ĐÈ.
   */
  const hoiLaiMoi = useCallback((aIdx: number) => {
    const t = turnsRef.current[aIdx];
    if (!t?.srcQuestion || asking) return;
    void hoi(t.srcQuestion, {
      english: !!t.english, showUser: false,
      cacheKey: t.srcCacheKey, refresh: true, noHistory: true,
    });
  }, [asking, hoi]);

  /**
   * Nối một câu hỏi CŨ (từ mục "Câu hỏi thường gặp") vào cuộc đang mở.
   *
   * Người dùng 15/09/2026: *"có thể vào phiên trả lời cũ ấy để hỏi tiếp"*.
   *
   * Cách làm: đẩy đúng cặp hỏi–đáp cũ vào hội thoại như thể nó vừa diễn ra.
   * Từ đó mọi câu hỏi sau tự mang theo nó trong lịch sử, nên gia sư hiểu
   * "chỗ này" là chỗ nào mà người học không phải chép lại gì.
   *
   * ⚠️ `srcQuestion` để RỖNG cho lượt trả lời chép về: nó không phải câu gia
   * sư vừa sinh ra trong phiên này, nên hai nút "Bản tiếng Anh" / "Hỏi lại
   * mới" không được hiện — bấm vào sẽ sinh lại rồi GHI ĐÈ mục cache dùng
   * chung bằng một câu không ai yêu cầu.
   */
  const nhoLaiCauCu = useCallback((m: { question: string; answer: string }) => {
    const q = (m.question || '').trim();
    const a = (m.answer || '').trim();
    if (!q || !a) return;
    datCuoc(khoa, (t) => {
      // Đã nối rồi thì thôi — bấm hai lần không được nhân đôi cả đoạn.
      if (t.some((x) => x.role === 'user' && x.content === q)) return t;
      return [...t, { role: 'user', content: q }, { role: 'assistant', content: a }];
    });
  }, [datCuoc, khoa]);

  /* Nút "Hỏi AI vì sao sai" ở từng câu quiz bắn qua đây. Chỉ chạy khi `key`
     ĐỔI — nếu theo dõi cả `text` thì một lần re-render đổi chuỗi (ví dụ đổi
     ngôn ngữ) sẽ tự hỏi lại, mà mỗi lượt là một lần tính tiền. */
  const autoKey = autoAsk?.key ?? 0;
  const daBan = useRef(0);
  useEffect(() => {
    if (!autoKey || daBan.current === autoKey) return;
    daBan.current = autoKey;
    const t = autoAsk?.text?.trim();
    if (t) void hoi(t);
  }, [autoKey, autoAsk?.text, hoi]);

  return {
    turns, question, setQuestion, asking, inQuiz,
    hoi, hoiTiengAnh, hoiLaiMoi, nhoLaiCauCu,
    anhDan, themAnh, boAnh, danVao, MAX_ANH,
    xoaHoiThoai: useCallback(() => xoaCuoc(khoa), [xoaCuoc, khoa]),
  };
}

/* Một mảng rỗng DÙNG CHUNG làm giá trị mặc định của selector.
   `?? []` viết thẳng trong selector tạo một mảng MỚI mỗi lần chạy, mà zustand
   so bằng `Object.is` — nên component re-render vô tận ở mọi bài chưa có
   hội thoại. Hằng số này khớp chính nó nên vòng lặp không sinh ra. */
const RONG: LuotGiaSu[] = [];


/** Tối đa 3 ảnh mỗi câu hỏi — khớp trần ở route, xem `docAnhDan`. */
export const MAX_ANH = 3;

/**
 * Cạnh dài model co ảnh về trước khi đọc. Gửi to hơn chỉ tốn token theo DIỆN
 * TÍCH cho phần bị vứt đi — ảnh chụp màn hình Retina là 3456px, tức gấp 4,8
 * lần diện tích cần thiết.
 */
const CANH_DAI = 1568;

/** Đọc file ảnh, co nếu quá khổ, trả về data URL. */
async function coVaDoc(f: File): Promise<string> {
  const goc = await new Promise<string>((giai, tuChoi) => {
    const d = new FileReader();
    d.onerror = () => tuChoi(new Error('Không đọc được ảnh.'));
    d.onload = () => giai(String(d.result ?? ''));
    d.readAsDataURL(f);
  });

  const anh = new Image();
  try {
    await new Promise<void>((giai, tuChoi) => {
      anh.onload = () => giai();
      anh.onerror = () => tuChoi(new Error('Ảnh hỏng.'));
      anh.src = goc;
    });
  } catch {
    return goc;  // không đo được kích thước ⇒ cứ gửi nguyên, đừng chặn người dùng
  }

  const canh = Math.max(anh.naturalWidth, anh.naturalHeight);
  if (canh <= CANH_DAI) return goc;

  const ti = CANH_DAI / canh;
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(anh.naturalWidth * ti));
  cv.height = Math.max(1, Math.round(anh.naturalHeight * ti));
  const ctx = cv.getContext('2d');
  if (!ctx) return goc;
  /* Nền TRẮNG trước: JPEG không có kênh trong suốt, thiếu bước này thì mọi
     vùng trong suốt của PNG thành ĐEN và ảnh model đọc khác hẳn bản gốc. */
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(anh, 0, 0, cv.width, cv.height);
  return cv.toDataURL('image/jpeg', 0.85);
}
