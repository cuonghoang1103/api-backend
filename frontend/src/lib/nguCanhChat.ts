/**
 * ============================================================
 * NGỮ CẢNH CHO MỘT LƯỢT CHAT — bản WEB
 * ============================================================
 *
 * ⚠️ `POST /api/v1/ai/chat` **KHÔNG nhớ hộ**. Trong `streamChat`
 * (`src/services/ai.service.ts`) mọi chỗ đụng tới `sessionId` đều là GHI;
 * ngữ cảnh model nhận được đến DUY NHẤT từ `sanitizeHistory(context.history)`
 * — tức mảng `history` mà CLIENT gửi lên (`ai.service.ts:1198`).
 *
 * Gửi `sessionId` mà không gửi `history` ⇒ mỗi câu là một cuộc đời mới.
 * Phiên chỉ là nhật ký để hiện lại lịch sử trên màn hình.
 *
 * Người dùng 19/09/2026 báo trợ lý app desktop không nhớ tin nhắn cũ. Ba đường
 * bên app đã vá ở `326d04c3`, luật gom vào `desktop/src/shared/nguCanhChat.ts`.
 * Khung terminal `CyberTerminal` bên web là chỗ CÒN LẠI: nó gửi thân chỉ có
 * `{ message, topK }`, nên hỏi câu thứ hai là model không biết câu đầu.
 *
 * ⚠️ Vì sao cả VIỆC DỰNG THÂN lẫn VÒNG NHỚ nằm ở đây chứ không nằm trong
 * component: lỗi này KHÔNG phải lỗi dựng chuỗi, nó là lỗi THỨ TỰ — chộp ngữ
 * cảnh sau khi đã thêm câu vừa gõ thì câu đó đi lên hai lần. Thứ tự ấy chỉ
 * kiểm được khi nó nằm trong một hàm gọi được từ phép kiểm; để nó trong một
 * `useCallback` thì không phép kiểm nào với tới, và `tsc` thì luôn xanh.
 */

export interface LuotChat {
  vai: 'user' | 'assistant';
  chu: string;
}

/** Số lượt gửi kèm làm ngữ cảnh. Khớp với AI Chat đầy đủ và bản desktop. */
export const SO_LUOT_NGU_CANH = 10;

/**
 * Lịch sử để gửi lên, dạng CHỮ THUẦN.
 *
 * ⚠️ `luot` phải là danh sách TRƯỚC khi thêm lượt người dùng vừa gõ. Thêm
 * trước rồi mới gọi hàm này thì câu vừa gõ nằm cả trong `history` lẫn trong
 * `message`, và model đọc nó hai lần — nó sẽ trả lời như thể bạn hỏi hai lần.
 */
export function lichSuGui(luot: LuotChat[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  return luot
    .filter((l) => l.chu.trim() !== '')
    .slice(-SO_LUOT_NGU_CANH)
    .map((l) => ({ role: l.vai, content: l.chu }));
}

/**
 * Thêm một lượt vào vòng nhớ, cắt bớt phần quá cũ.
 *
 * Giữ gấp đôi `SO_LUOT_NGU_CANH` chứ không đúng bằng: cắt sát mép thì mỗi lần
 * nâng số lượt gửi lên sẽ âm thầm không có tác dụng, vì vòng nhớ đã vứt mất
 * phần đáng lẽ gửi được.
 */
export function themLuot(luot: LuotChat[], moi: LuotChat): LuotChat[] {
  return [...luot, moi].slice(-SO_LUOT_NGU_CANH * 2);
}

// ─── Gọi máy chủ ──────────────────────────────────────────────────────

/** Móc để giao diện bám vào luồng SSE. */
export interface MocLuong {
  /** Chạy MỘT lần, ngay khi máy chủ đã nhận (res.ok) và trước mẩu chữ đầu. */
  onMoDau?: () => void;
  onChunk?: (chu: string) => void;
}

export interface ThamSoGoi extends MocLuong {
  message: string;
  /** Các lượt TRƯỚC lượt đang gửi — xem cảnh báo ở `lichSuGui`. */
  luot: LuotChat[];
  sessionId?: string | undefined;
  token?: string | undefined;
  topK?: number;
}

/**
 * Gửi một lượt và đọc luồng SSE tới hết.
 *
 * Lỗi KẾT NỐI (không `ok`, không có thân) thì NÉM — giao diện cần hiện báo
 * lỗi. Lỗi giữa luồng thì NUỐT và giữ lại phần chữ đã nhận: "Premature close"
 * sau khi đã có chữ là chuyện thường và câu trả lời vẫn dùng được.
 */
export async function goiAiChat(o: ThamSoGoi): Promise<string> {
  const res = await fetch('/api/v1/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(o.token ? { Authorization: `Bearer ${o.token}` } : {}),
    },
    body: JSON.stringify({
      message: o.message,
      topK: o.topK ?? 5,
      history: lichSuGui(o.luot),
      ...(o.sessionId ? { sessionId: o.sessionId } : {}),
    }),
  });

  if (!res.ok || !res.body) throw new Error('API error');
  o.onMoDau?.();

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let dem = '';
  let dayDu = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      dem += decoder.decode(value, { stream: true });
      const dong = dem.split('\n');
      dem = dong.pop() ?? '';
      for (const d of dong) {
        if (!d.startsWith('data: ')) continue;
        const tho = d.slice(6);
        if (!tho) continue;
        let goi: { type?: string; text?: string; error?: string };
        try {
          goi = JSON.parse(tho) as typeof goi;
        } catch {
          continue; // gói JSON vỡ đôi — bỏ qua, mẩu sau sẽ đủ
        }
        if (goi.type === 'chunk' && goi.text) {
          dayDu += goi.text;
          o.onChunk?.(goi.text);
        } else if (goi.type === 'error' && !dayDu.trim()) {
          throw new Error(goi.error || 'Stream error');
        }
      }
    }
  } catch {
    // Luồng đứt — giữ nguyên phần đã nhận.
  }

  return dayDu;
}

// ─── Mạch chat: vòng nhớ + gọi, gói chung ─────────────────────────────

export interface MachChat {
  /** Id phiên gửi kèm để máy chủ ghi lại lượt chat vào nhật ký. */
  readonly phien: string;
  /** Hỏi một câu. Trả về câu trả lời đã hoàn tất (rỗng nếu luồng chết câm). */
  hoi(cau: string, moc?: MocLuong): Promise<string>;
  /** Ghi một lượt vào ngữ cảnh mà KHÔNG gọi máy chủ (vd: lời chào tự phát). */
  ghiLuot(vai: 'user' | 'assistant', chu: string): void;
}

export interface TuyChonMach {
  /** Mặc định `tokenTuCookie`. Tiêm vào được để phép kiểm khỏi cần DOM. */
  layToken?: () => string;
  phien?: string;
  topK?: number;
}

/**
 * ⚠️ Hàm này gần như LUÔN trả chuỗi rỗng, và thế là ĐÚNG.
 *
 * `backend_token` là cookie **httpOnly** (xem `frontend/src/middleware.ts`), nên
 * `document.cookie` không đọc được nó. Việc xác thực KHÔNG đi qua header
 * `Authorization` mà đi qua chính cái cookie ấy: `/api/v1/*` là same-origin nên
 * trình duyệt tự đính cookie vào, còn `extractToken` ở máy chủ
 * (`src/middleware/auth.ts:186`) đọc nó ở bước 2 ngay sau header.
 *
 * Giữ lại vì hai chỗ kia (`ChatModal`, `/chat`) cũng làm y hệt, và vì nó vẫn
 * đúng nếu sau này có token đọc được từ JS. ⛔ Đừng "sửa" chỗ này khi thấy
 * header trống — chỗ trống đó không phải nguyên nhân của bất cứ lỗi 401 nào.
 */
function tokenTuCookie(): string {
  if (typeof document === 'undefined') return '';
  const khop = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return khop?.[1] ? decodeURIComponent(khop[1]) : '';
}

function taoIdPhien(): string {
  return `cyber_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Một mạch hội thoại: giữ vòng nhớ và gửi nó đi cùng mỗi câu.
 *
 * Chỗ DUY NHẤT quyết định thứ tự chộp-rồi-thêm. Component chỉ còn việc vẽ.
 */
export function taoMachChat(tuyChon: TuyChonMach = {}): MachChat {
  let luot: LuotChat[] = [];
  const phien = tuyChon.phien ?? taoIdPhien();
  const layToken = tuyChon.layToken ?? tokenTuCookie;
  const topK = tuyChon.topK ?? 5;

  return {
    phien,

    ghiLuot(vai, chu) {
      if (chu.trim()) luot = themLuot(luot, { vai, chu });
    },

    async hoi(cau, moc = {}) {
      const noiDung = cau.trim();

      /* CHỘP ngữ cảnh TRƯỚC khi thêm câu vừa gõ. `themLuot` trả mảng MỚI nên
         `nguCanh` giữ nguyên ảnh chụp cũ, không bị sửa theo. */
      const nguCanh = luot;
      luot = themLuot(luot, { vai: 'user', chu: noiDung });

      let dayDu: string;
      try {
        dayDu = await goiAiChat({
          message: noiDung,
          luot: nguCanh,
          sessionId: phien,
          token: layToken(),
          topK,
          ...moc,
        });
      } catch (loi) {
        /* Lượt hỏng không được để lại câu hỏi MỒ CÔI trong ngữ cảnh: lượt sau
           sẽ mang theo một câu chưa từng có ai trả lời, và model coi sự im
           lặng đó là một phần cuộc trò chuyện. */
        luot = nguCanh;
        throw loi;
      }

      if (dayDu.trim()) luot = themLuot(luot, { vai: 'assistant', chu: dayDu });
      return dayDu;
    },
  };
}
