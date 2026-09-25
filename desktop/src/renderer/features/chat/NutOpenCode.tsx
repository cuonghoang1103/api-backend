/**
 * ============================================================
 * NÚT "CÀI OPENCODE TERMINAL" — trong AI Code
 * ============================================================
 *
 * Người dùng: *"bấm vào đấy là prompt tự hiện ra và AI Code tự làm install
 * setup, tự lấy key được cấp để setup cho user, hướng dẫn user chỉ việc vào
 * terminal ấn như nào để dùng thôi. Khi được cấp key thì cái nút kia mới sáng
 * lên; chưa có key thì nó chỉ hiện cách dùng và bảo user mua key hoặc xin key."*
 *
 * ⚠️⚠️ KEY KHÔNG BAO GIỜ VÀO PROMPT.
 * Cách hiển nhiên là nhét key vào câu gửi cho agent. Nhưng prompt đi lên CỔNG
 * LLM — key của khách sẽ nằm trong log của bên thứ ba, vĩnh viễn. Nên:
 *   · APP tự ghi `opencode.json` kèm key (IPC `opencode:vietCauHinh`);
 *   · AGENT chỉ lo cài Node/opencode và xác minh — không bao giờ thấy key.
 * Người dùng vẫn chỉ bấm một nút.
 *
 * ⚠️ Prompt CHỈ chứa việc CÒN THIẾU. Bảo agent cài lại Node đã có là tốn lượt
 * gọi và bắt người dùng ngồi chờ một việc không cần làm.
 */
import { useCallback, useEffect, useState } from 'react';
import { useSession } from '../../auth/session';

export interface DonKey {
  id: number;
  status: string;
  key: string | null;
  quotaUsd: number | null;
  source?: string;
  hetHan?: boolean;
}

interface ThongTinKey {
  baseUrl: string;
  models: string[];
  contextToken?: number;
  outputToken?: number;
  isPro?: boolean;
}

interface DoMay {
  heDieuHanh: string;
  node: string | null;
  npm: string | null;
  opencode: string | null;
  daCoCauHinh: boolean;
  duongDanCauHinh: string;
}

/** Trang web để người dùng đi mua / đi xin key. */
const WEB = 'https://cuongthai.com';

/**
 * Bóc phong bì `{ success, data }` MỘT cách chịu được cả hai hình dạng.
 *
 * ⚠️⚠️ `ApiClient.request()` ĐÃ bóc `.data` rồi (`unwrap`:
 * `return (envelope.data ?? envelope)`), nên nó trả về THẲNG mảng. Bóc thêm
 * lần nữa cho ra `undefined`, và `?? []` biến nó thành "không có đơn nào" —
 * nút hiện đúng màn hình mời đi mua key cho người ĐÃ ĐƯỢC DUYỆT, không một
 * dấu hiệu nào. Đã dính hai lần liền (14-15/09/2026).
 *
 * Hàm này tách riêng để BỘ KIỂM CHẠY ĐƯỢC nó. Phép kiểm chỉ đọc chữ trong
 * file thì không bắt được lỗi hình dạng — đó là lý do lần trước nó lọt.
 */
export function bocPhongBi<T>(v: unknown): T | null {
  if (v == null) return null;
  const o = v as { data?: unknown };
  return (o.data !== undefined ? o.data : v) as T;
}

/** Đơn key đang hiệu lực, hay `null`. Tách ra để kiểm thử chạy thật. */
export function timKeyDangDung(thanPhanHoi: unknown): DonKey | null {
  const ds = bocPhongBi<DonKey[]>(thanPhanHoi);
  if (!Array.isArray(ds)) return null;
  return ds.find((d) => d.status === 'APPROVED' && !d.hetHan && d.key) ?? null;
}

/**
 * ⚠️ `gui` đã BỎ (15/09/2026). Việc cài giờ chạy thẳng ở tiến trình chính, nên
 * nút không còn phải nhờ agent — và nhờ vậy nó chạy được cả khi người dùng
 * CHƯA chọn thư mục dự án nào, đúng nhóm người dùng nút này phục vụ.
 * `dangChay` giữ lại: đang có việc chạy thì đừng xen một lần cài vào giữa.
 */
/** Chữ trên nút lúc đang cài, theo bước main báo về. */
function chuTienDo(t: { buoc: string; phanTram?: number } | null): string {
  switch (t?.buoc) {
    case 'tai': return `Đang tải OpenCode… ${t.phanTram ?? 0}%`;
    case 'giai-nen': return 'Đang giải nén…';
    case 'kiem': return 'Đang kiểm tra…';
    case 'path': return 'Đang thêm vào terminal…';
    case 'npm': return 'Đang cài qua npm… (1–2 phút)';
    default: return 'Đang chuẩn bị…';
  }
}

export function NutOpenCode({ dangChay }: { dangChay: boolean }) {
  const { api } = useSession();
  const [key, setKey] = useState<string | null>(null);
  const [tin, setTin] = useState<ThongTinKey | null>(null);
  const [may, setMay] = useState<DoMay | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [moGiaiThich, setMoGiaiThich] = useState(false);
  const [dangCai, setDangCai] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  /* Báo XONG ngay trong nút, không đẩy sang khung chat: việc này giờ chạy hẳn
     ở tiến trình chính nên chẳng có lượt chat nào để mà đọc kết quả. */
  const [xong, setXong] = useState<string | null>(null);
  /**
   * Hỏi máy chủ HỎNG ≠ người dùng CHƯA CÓ KEY.
   *
   * Trước đây hai trạng thái đó hiện y hệt nhau ("chưa có key, đi mua đi") —
   * nên khi đường dẫn API sai, người dùng đã được duyệt key vẫn bị mời đi mua
   * và không ai biết vì sao. Tách ra để lần sau lỗi tự nói tên nó.
   */
  const [loiTai, setLoiTai] = useState<string | null>(null);
  /** Bước đang chạy khi cài — tải về cỡ 50–60MB nên phải cho người dùng thấy nó đang chạy. */
  const [tienDo, setTienDo] = useState<{ buoc: string; phanTram?: number } | null>(null);

  useEffect(() => window.cuongthai?.on('opencode:tienDo', (p) => {
    setTienDo(p as { buoc: string; phanTram?: number });
  }), []);

  useEffect(() => {
    let huy = false;
    void (async () => {
      try {
        // ⚠️ PHẢI có tiền tố `/api/v1`. `baseUrl` của ApiClient là GỐC tên
        // miền (`https://api.cuongthai.com`), không phải gốc API — mọi nơi
        // khác trong app đều viết đủ đường dẫn. Thiếu nó thì máy chủ trả 404,
        // và vì lời gọi này nuốt lỗi nên nút hiện "chưa có key" y hệt như khi
        // người dùng thật sự chưa có key. Đã dính thật 14/09/2026: người dùng
        // đã được duyệt key mà nút vẫn mời đi mua.
        // ⚠️⚠️ `request()` ĐÃ BÓC `.data` rồi — xem `ApiClient.unwrap`:
        //     return (envelope.data ?? envelope) as T
        // nên nó trả về THẲNG mảng/đối tượng, không phải `{ data: ... }`. Bóc
        // thêm lần nữa (`dons.data`) cho ra `undefined`, và `?? []` biến nó
        // thành "không có đơn nào" — nút hiện đúng màn hình mời đi mua key cho
        // người ĐÃ ĐƯỢC DUYỆT. Đã dính thật hai lần liền, 14-15/09/2026.
        // Quy ước của app: `layDanhSachPlaylist` cũng nhận thẳng mảng.
        const [dons, info, m] = await Promise.all([
          api?.request<DonKey[]>('/api/v1/llm-keys/mine').catch((e: unknown) => {
            setLoiTai(e instanceof Error ? e.message : 'không hỏi được máy chủ');
            return null;
          }) ?? null,
          api?.request<ThongTinKey>('/api/v1/llm-keys/info').catch(() => null) ?? null,
          window.cuongthai?.opencode.doMayNay().catch(() => null) ?? null,
        ]);
        if (huy) return;
        // Chỉ đơn ĐÃ DUYỆT và CÒN HẠN mới có key thật. Backend đã trả `key`
        // null cho đơn hết hạn, nhưng kiểm cả `hetHan` để không phụ thuộc
        // vào đúng một tầng.
        // Phòng xa cho cả hai hình dạng: nếu một ngày `unwrap` đổi cách bóc,
        // nút vẫn chạy thay vì âm thầm bảo người dùng đi mua key.
        const co = timKeyDangDung(dons);
        if (dons !== null && !Array.isArray(bocPhongBi<DonKey[]>(dons))) {
          setLoiTai('máy chủ trả về hình dạng lạ cho danh sách key');
        }
        setKey(co?.key ?? null);
        setTin(bocPhongBi<ThongTinKey>(info));
        setMay(m ?? null);
      } finally {
        if (!huy) setDangTai(false);
      }
    })();
    return () => { huy = true; };
  }, [api]);

  const caiDat = useCallback(async () => {
    if (!key || !tin || dangCai) return;
    setDangCai(true);
    setLoi(null);
    setXong(null);
    try {
      // 1. App tự ghi cấu hình — key dừng lại ở máy này.
      const kq = await window.cuongthai?.opencode.vietCauHinh({
        key,
        baseUrl: tin.baseUrl,
        models: tin.models,
        contextToken: tin.contextToken ?? 180_000,
        outputToken: tin.outputToken ?? 32_000,
      });
      if (!kq?.ok) throw new Error('Không ghi được file cấu hình.');

      /*
       * 2. CÀI THẲNG Ở TIẾN TRÌNH CHÍNH — không nhờ agent nữa.
       *
       * Bản trước gửi một câu dài cho agent để nó tự chạy `npm i -g`. Nhưng
       * agent chỉ có quyền chạy lệnh khi cuộc đó ĐÃ CÓ thư mục dự án, mà
       * người dùng chỉ muốn lấy key để dùng OpenCode ở terminal thì chẳng có
       * dự án nào trong app — bấm nút không cài được gì. Người dùng báo đúng
       * chuyện đó 15/09/2026.
       *
       * Chạy ở main còn đúng hơn về bản chất: cài một công cụ TOÀN CỤC không
       * liên quan dự án nào, không tốn một lượt gọi model, và chạy y hệt nhau
       * mọi lần thay vì phụ thuộc model đoán đúng lệnh.
       */
      const cai = await window.cuongthai?.opencode.cai();

      /* 25/09/2026: không còn nhánh "máy chưa có Node.js, tự cài tay đi" — main
         tải bản chạy sẵn, nên máy mới tinh cũng cài được một lèo. */
      if (!cai?.ok) {
        setLoi(`${cai?.loi ?? 'Không cài được.'}\nKiểm tra kết nối mạng rồi bấm lại nhé.`);
        return;
      }

      /* ⚠️ Nói rõ "mở terminal MỚI": PATH vừa được thêm chỉ có hiệu lực ở cửa
         sổ terminal mở SAU khi cài. Terminal đang mở sẵn gõ `opencode` sẽ báo
         "command not found", và người dùng sẽ tưởng cài hỏng. */
      setXong(`Xong! OpenCode ${cai.phienBan ?? ''} đã sẵn sàng, key đã được cắm vào (${kq.duongDan}).\n`
        + 'Mở một cửa sổ terminal MỚI, vào thư mục dự án của bạn và gõ: opencode');
      /* Nạp lại trạng thái máy để nút đổi sang "đã cài" mà không phải mở lại app. */
      setMay(await window.cuongthai?.opencode.doMayNay() ?? null);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Không cài được.');
    } finally {
      setDangCai(false);
      setTienDo(null);
    }
  }, [key, tin, dangCai]);

  if (dangTai) return null;

  const coKey = Boolean(key);

  return (
    <>
      <button
        type="button"
        onClick={() => (coKey ? void caiDat() : setMoGiaiThich(true))}
        disabled={dangCai || (coKey && dangChay)}
        title={coKey ? 'Cài OpenCode và cắm key của bạn vào' : 'Chưa có key — bấm để xem cách lấy'}
        className={`nut-opencode${coKey ? ' nut-opencode--sang' : ''}`}
      >
        {dangCai
          ? chuTienDo(tienDo)
          : may?.opencode ? 'Cài lại OpenCode Terminal' : 'Cài OpenCode Terminal'}
      </button>

      {/* `white-space: pre-line` để câu lệnh hướng dẫn xuống dòng đúng chỗ —
          gộp một dòng thì người dùng chép nhầm cả câu dẫn vào terminal. */}
      {loi && <p className="nut-opencode__loi" style={{ whiteSpace: 'pre-line' }}>{loi}</p>}
      {xong && <p className="nut-opencode__xong" style={{ whiteSpace: 'pre-line' }}>{xong}</p>}
      {loiTai && !coKey && (
        <p className="nut-opencode__loi">
          Chưa kiểm được key của bạn ({loiTai}). Nút đang tạm khoá — thử mở lại app,
          nếu vẫn vậy thì báo admin.
        </p>
      )}

      {moGiaiThich && (
        <div className="nut-opencode__phu" onClick={() => setMoGiaiThich(false)}>
          <div className="nut-opencode__hop" onClick={(e) => e.stopPropagation()}>
            <h3>CuongMini trên Terminal</h3>
            <p>
              Cài OpenCode lên máy bạn để dùng AI ngay trong terminal — đọc và sửa mã trong dự án
              thật, không cần mở trình duyệt. Cùng một hạn mức với AI Code trong app này.
            </p>
            <p className="nut-opencode__can">Cần một API key mới dùng được. Hai cách lấy:</p>
            <div className="nut-opencode__cach">
              <button type="button" onClick={() => void window.cuongthai?.app.openExternal(`${WEB}/shop`)}>
                Mua key ở gian hàng
              </button>
              <button type="button" onClick={() => void window.cuongthai?.app.openExternal(`${WEB}/llm-key`)}>
                {tin?.isPro ? 'Xin key (bạn đang là Pro)' : 'Xin key — dành cho tài khoản Pro'}
              </button>
            </div>
            <p className="nut-opencode__nho">
              Có key rồi thì quay lại đây, nút sẽ sáng lên và cài giúp bạn chỉ bằng một lần bấm.
            </p>
            <button type="button" className="nut-opencode__dong" onClick={() => setMoGiaiThich(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
