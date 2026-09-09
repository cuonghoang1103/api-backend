/**
 * Bộ não của Odin: tâm trạng, nháy mắt, thông báo, và nghe giọng nói.
 *
 * ─── VỀ "HEY ODIN" — đọc trước khi kỳ vọng ───
 *
 * Từ đánh thức luôn-lắng-nghe KHÔNG làm được ở đây, và lý do là kỹ thuật chứ
 * không phải lười:
 *
 *   • Nhận ra "Hey Odin" mà không gửi âm thanh đi đâu đòi hỏi một mô hình dò từ
 *     khoá CHẠY CỤC BỘ (Porcupine, openWakeWord…). Chúng là native module, phải
 *     biên dịch riêng cho từng nền tảng, và Porcupine cần giấy phép thương mại.
 *   • Cách thay thế — mở mic liên tục rồi đẩy hết lên `/api/v1/ai/stt` — vừa
 *     tốn tiền theo từng phút, vừa có nghĩa là micro của người dùng bật 24/7 và
 *     mọi âm thanh trong phòng đi qua máy chủ. Đó là cái giá không nên trả cho
 *     một từ đánh thức.
 *
 * Con robot ESP32 làm được vì nó có phần cứng riêng chạy mô hình dò từ khoá
 * ngay trên chip, không gửi gì đi khi chưa được gọi tên.
 *
 * Ở đây dùng NHẤN-ĐỂ-NÓI: giữ nút (hoặc phím tắt) → thu → thả → gửi một lần lên
 * `POST /api/v1/ai/stt`. Micro chỉ bật đúng lúc người dùng chủ động bấm.
 * Muốn "Hey Odin" thật thì phải thêm mô hình cục bộ — ghi trong docs.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiClient } from '../../api/client';
import { chuChoMayDoc } from './loiNoi';

/**
 * AI Code vừa xong một việc — bắn trong renderer để con robot ăn mừng.
 *
 * Sự kiện của cửa sổ chứ không phải state dùng chung: `OdinDock` và
 * `AgentMode` nằm ở hai nhánh cây React khác nhau và không có tổ tiên chung
 * nào giữ state, nên nối bằng context là phải kéo một provider bọc cả app cho
 * đúng một tín hiệu chạy vài lần mỗi ngày.
 */
export const SU_KIEN_AGENT_XONG = 'ct:agent-xong';

export type OdinMood =
  /** Bình thường, trôi lên xuống. */
  | 'thuong'
  /** Vừa được bấm — nhảy tưng tưng và cười. */
  | 'vui'
  /** Đang chờ phản hồi AI. */
  | 'nghi'
  /** Đang thu tiếng người dùng. */
  | 'nghe'
  /** Có lỗi hoặc mất mạng. */
  | 'lo'
  /** Không có gì xảy ra một lúc lâu. */
  | 'ngu'
  /** Vừa có tin nhắn / thông báo — vẫy tay gọi. */
  | 'vay'
  /** Agent vừa làm xong việc — ăn mừng. */
  | 'mung';

/**
 * Trần chữ cho bong bóng nổi. ~40 từ — đủ cho một câu trả lời nói, và vừa
 * khoảng người ta liếc mắt đọc được mà không phải dừng việc đang làm.
 */
const TRAN_BONG_BONG = 220;

export interface OdinState {
  mood: OdinMood;
  blinking: boolean;
  unread: number;
  listening: boolean;
  /** Câu Odin đang "nói" — hiện trong bong bóng. */
  say: string | null;
  poke: () => void;
  /** Cho Odin nói một câu và nhảy lên mừng. Dùng cho tin đáng chú ý. */
  announce: (message: string) => void;
  /**
   * Nói một câu rồi TỰ TẮT sau `ms`. Dùng cho tin do app tự sinh và lặp lại
   * (đồng hồ đếm ngược tới buổi học) — thứ nói 10 phút một lần mà bong bóng
   * nằm mãi thì chiếm góc màn hình vĩnh viễn.
   *
   * Khác `announce` ở hai điểm, cả hai đều cố ý:
   *  • KHÔNG bóc markdown. Chữ ở đây do app viết, không có markdown — mà bộ
   *    bóc lại ăn mất gạch dưới trong mã lớp: hai mã có `_` trong cùng một câu
   *    ("AI17_A", "BE-2_1") bị coi là một cặp chữ nghiêng, ra "AI17A" và
   *    "BE-21". Người dùng đọc sai phòng học.
   *  • Tự tắt, và CHỈ tắt khi bong bóng vẫn đang là câu đó — người dùng hỏi
   *    robot xen vào thì câu trả lời của họ phải được ở lại.
   */
  announceTam: (message: string, ms?: number) => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  dismissSay: () => void;
}

/** Khoảng nghỉ giữa hai lần nháy mắt. Ngẫu nhiên để không thành nhịp máy móc. */
function nextBlinkDelay(): number {
  return 1800 + Math.random() * 2600;
}

/**
 * Người thật thỉnh thoảng chớp HAI cái liền nhau.
 *
 * Một nhịp chớp đều tăm tắp là thứ mắt nhận ra ngay là máy móc — nó đúng cái
 * "thung lũng kỳ lạ" nho nhỏ khiến con robot trông như một GIF lặp thay vì một
 * nhân vật. Một phần tư số lần là đủ để phá nhịp mà không thành giật mắt.
 */
function chopDoi(): boolean {
  return Math.random() < 0.25;
}

export function useOdin(options: {
  api: ApiClient | null;
  online: boolean;
  enabled: boolean;
  onTranscript: (text: string) => void;
}): OdinState {
  const { api, online, enabled, onTranscript } = options;

  const [mood, setMood] = useState<OdinMood>('thuong');
  const [blinking, setBlinking] = useState(false);
  const [unread, setUnread] = useState(0);
  const [listening, setListening] = useState(false);
  const [say, setSay] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Đặt tâm trạng tạm thời rồi tự quay về bình thường. */
  const moodFor = useCallback((next: OdinMood, ms: number) => {
    if (moodTimer.current) clearTimeout(moodTimer.current);
    setMood(next);
    moodTimer.current = setTimeout(() => setMood('thuong'), ms);
  }, []);

  // ── Nháy mắt ─────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;

    const hen: ReturnType<typeof setTimeout>[] = [];
    const chop = (sau: number, xong?: () => void) => {
      hen.push(setTimeout(() => {
        setBlinking(true);
        hen.push(setTimeout(() => { setBlinking(false); xong?.(); }, 130));
      }, sau));
    };

    const schedule = () => {
      timer = setTimeout(() => {
        // Không nháy khi đang nghe: mắt nhắm giữa lúc người dùng đang nói trông
        // như robot lơ đãng.
        if (chopDoi()) chop(0, () => chop(120, schedule));
        else chop(0, schedule);
      }, nextBlinkDelay());
    };
    schedule();
    return () => { clearTimeout(timer); for (const h of hen) clearTimeout(h); };
  }, [enabled]);

  /**
   * ĂN MỪNG khi AI Code vừa xong một việc.
   *
   * Nghe sự kiện trong renderer chứ không hỏi máy chủ: `AgentMode` nằm cùng
   * tiến trình, và cả điểm của nó là phản ứng NGAY lúc việc xong.
   */
  useEffect(() => {
    if (!enabled) return;
    const nghe = (): void => moodFor('mung', 2600);
    window.addEventListener(SU_KIEN_AGENT_XONG, nghe);
    return () => window.removeEventListener(SU_KIEN_AGENT_XONG, nghe);
  }, [enabled, moodFor]);

  /**
   * NGỦ GÀ khi người dùng bỏ máy một lúc.
   *
   * ⚠️ Mood `'ngu'` đã có CSS và có mắt nhắm từ lâu, nhưng KHÔNG CÓ GÌ bật nó —
   * một tính năng chết nằm im trong mã. Đây là chỗ nối lại.
   *
   * Nghe trên `document` ở pha BẮT (capture): phần lớn sự kiện trong app bị
   * `stopPropagation` ở đâu đó trên đường nổi lên, nên nghe pha nổi thì robot
   * chỉ tỉnh khi người dùng bấm vào chỗ trống.
   */
  useEffect(() => {
    if (!enabled) return;
    let hen: ReturnType<typeof setTimeout>;
    const NGU_SAU = 3 * 60_000;
    const datLai = (): void => {
      clearTimeout(hen);
      // Chỉ đánh thức khi đang NGỦ. Gọi `setMood('thuong')` vô điều kiện là
      // xoá mất mọi tâm trạng khác mỗi lần người dùng động vào chuột.
      setMood((cu) => (cu === 'ngu' ? 'thuong' : cu));
      hen = setTimeout(() => setMood((cu) => (cu === 'thuong' ? 'ngu' : cu)), NGU_SAU);
    };
    const cacSuKien = ['pointermove', 'pointerdown', 'keydown', 'wheel'] as const;
    for (const t of cacSuKien) document.addEventListener(t, datLai, { capture: true, passive: true });
    datLai();
    return () => {
      clearTimeout(hen);
      for (const t of cacSuKien) document.removeEventListener(t, datLai, { capture: true });
    };
  }, [enabled]);

  // ── Mất mạng thì lo ──────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    if (!online) {
      setMood('lo');
      setSay('Mình mất mạng rồi. Bạn cứ làm tiếp, có mạng mình gửi đi sau nhé.');
    } else if (mood === 'lo') {
      setMood('thuong');
      setSay(null);
    }
    // `mood` cố ý không nằm trong deps: thêm vào sẽ thành vòng lặp tự kích hoạt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, enabled]);

  // ── Thông báo thật từ máy chủ ────────────────────────────
  useEffect(() => {
    if (!enabled || !api || !online) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const result = await api.request<{ unreadCount?: number; count?: number }>(
          '/api/v1/social/notifications/unread-count',
        );
        if (cancelled) return;
        const count = result.unreadCount ?? result.count ?? 0;
        setUnread((previous) => {
          // Chỉ reo lên khi có thông báo MỚI, không reo mỗi lần hỏi lại. Robot
          // nhảy nhót mỗi 60 giây là robot bị tắt sau ngày đầu tiên.
          if (count > previous && previous >= 0) {
            // VẪY TAY, khác hẳn nhảy tưng tưng lúc được bấm: cái này là robot
            // GỌI người dùng ("có tin đấy"), cái kia là robot đáp lại họ.
            moodFor('vay', 2200);
          }
          return count;
        });
      } catch {
        // Thông báo hỏng không phải chuyện để làm phiền người dùng.
      }
    };

    void poll();
    const timer = setInterval(() => void poll(), 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [api, online, enabled, moodFor]);

  // ── Bấm vào robot ────────────────────────────────────────
  const poke = useCallback(() => {
    moodFor('vui', 1400);
  }, [moodFor]);

  /**
   * Bong bóng nói của robot.
   *
   * ⚠️ HAI LỚP CHỐNG ĐỠ, và cả hai đều cần thiết.
   *
   * Gốc rễ đã chữa ở chỗ khác: lượt hỏi từ robot nay gửi `voice: true` nên máy
   * chủ trả về 2–4 câu lời nói. Nhưng bong bóng KHÔNG được tin vào điều đó.
   * Ảnh chụp 18/08/2026 cho thấy nó từng hiện nguyên một bài so sánh Spring
   * Boot với Node.js — cả khối ```javascript, cả `**đậm**`, cả `###` — dài
   * gần hết chiều cao màn hình và che mất phần mềm người dùng đang làm việc.
   *
   *  1. BÓC MARKDOWN: bong bóng là chữ thuần, không dựng markdown. Để nguyên
   *     thì người dùng đọc thấy dấu sao và dấu huyền ba cái.
   *  2. CẮT NGẮN: bong bóng nổi trên MỌI cửa sổ. Một câu trả lời dài ở đây
   *     không phải là "nhiều thông tin", nó là một tấm rèm che màn hình. Ai
   *     cần đọc đủ thì mở khung chat — chữ vẫn còn nguyên ở đó.
   */
  const henTam = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announceTam = useCallback(
    (message: string, ms = 14_000) => {
      const sach = message.length > TRAN_BONG_BONG
        ? `${message.slice(0, TRAN_BONG_BONG).trimEnd()}…`
        : message;
      setSay(sach);
      moodFor('vui', 1600);
      if (henTam.current) clearTimeout(henTam.current);
      /* So bằng hàm cập nhật của `setSay` chứ không bằng `ref`: nó đưa GIÁ TRỊ
         ĐANG LƯU vào tay, nên không có chuyện đọc phải bản cũ trong closure —
         và không cần giữ thêm một `ref` phải nhớ đồng bộ. */
      henTam.current = setTimeout(() => {
        setSay((cu) => (cu === sach ? null : cu));
      }, ms);
    },
    [moodFor],
  );

  useEffect(() => () => { if (henTam.current) clearTimeout(henTam.current); }, []);

  const announce = useCallback(
    (message: string) => {
      const sach = chuChoMayDoc(message);
      setSay(sach.length > TRAN_BONG_BONG ? `${sach.slice(0, TRAN_BONG_BONG).trimEnd()}…` : sach);
      moodFor('vui', 1600);
    },
    [moodFor],
  );

  // ── Nhấn-để-nói ──────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (listening || !api) return;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      // Người dùng từ chối quyền, hoặc máy không có micro. Nói rõ thay vì im.
      setMood('lo');
      setSay('Mình không dùng được micro. Kiểm tra quyền truy cập micro giúp mình nhé.');
      return;
    }

    chunks.current = [];
    const media = new MediaRecorder(stream);
    recorder.current = media;

    media.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };

    media.onstop = async () => {
      // Tắt micro NGAY. Không dừng track thì đèn micro của máy vẫn sáng sau khi
      // thu xong — người dùng có mọi lý do để nghĩ app đang nghe lén.
      stream.getTracks().forEach((track) => track.stop());
      setListening(false);

      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      if (blob.size < 1200) {
        setMood('thuong');
        return; // bấm nhầm, chưa kịp nói gì
      }

      setMood('nghi');
      try {
        const form = new FormData();
        form.append('audio', blob, 'odin.webm');

        // Dùng `fetch` thẳng chứ không qua `api.request`: endpoint này nhận
        // multipart, mà `request` luôn đặt Content-Type: application/json và
        // `JSON.stringify` body — làm vậy sẽ gửi lên một chuỗi "[object Blob]".
        const response = await fetch(`${api.baseUrlForForms()}/api/v1/ai/stt`, {
          method: 'POST',
          headers: api.authHeaders(),
          body: form,
          credentials: 'omit',
        });
        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: { text?: string; heard?: boolean };
        };

        if (!response.ok) {
          setMood('lo');
          setSay(
            response.status === 503
              ? 'Máy chủ chưa bật nhận dạng giọng nói.'
              : (payload.message ?? 'Mình nghe không rõ, bạn thử lại nhé.'),
          );
          return;
        }

        const text = payload.data?.text?.trim() ?? '';
        if (!text) {
          setMood('thuong');
          setSay('Mình chưa nghe rõ gì cả. Bạn nói lại giúp mình nhé.');
          return;
        }

        moodFor('vui', 1200);
        onTranscript(text);
      } catch {
        setMood('lo');
        setSay('Không gửi được đoạn ghi âm lên máy chủ.');
      }
    };

    media.start();
    setListening(true);
    setMood('nghe');
    setSay(null);
  }, [api, listening, moodFor, onTranscript]);

  const stopListening = useCallback(() => {
    recorder.current?.state === 'recording' && recorder.current.stop();
  }, []);

  // Dọn dẹp khi rời trang: micro phải tắt kể cả khi component bị tháo giữa chừng.
  useEffect(() => {
    return () => {
      if (recorder.current?.state === 'recording') recorder.current.stop();
      if (moodTimer.current) clearTimeout(moodTimer.current);
    };
  }, []);

  return {
    mood,
    blinking,
    unread,
    listening,
    say,
    poke,
    announce,
    startListening,
    stopListening,
    announceTam,
    dismissSay: () => setSay(null),
  };
}
