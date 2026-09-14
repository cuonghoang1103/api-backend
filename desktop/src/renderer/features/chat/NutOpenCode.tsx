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

interface DonKey {
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

export function NutOpenCode({ gui, dangChay }: { gui: (chu: string) => void; dangChay: boolean }) {
  const { api } = useSession();
  const [key, setKey] = useState<string | null>(null);
  const [tin, setTin] = useState<ThongTinKey | null>(null);
  const [may, setMay] = useState<DoMay | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [moGiaiThich, setMoGiaiThich] = useState(false);
  const [dangCai, setDangCai] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  useEffect(() => {
    let huy = false;
    void (async () => {
      try {
        // `request` là API công khai duy nhất của ApiClient — không có `.get()`.
        const [dons, info, m] = await Promise.all([
          api?.request<{ data: DonKey[] }>('/llm-keys/mine').catch(() => null) ?? null,
          api?.request<{ data: ThongTinKey }>('/llm-keys/info').catch(() => null) ?? null,
          window.cuongthai?.opencode.doMayNay().catch(() => null) ?? null,
        ]);
        if (huy) return;
        // Chỉ đơn ĐÃ DUYỆT và CÒN HẠN mới có key thật. Backend đã trả `key`
        // null cho đơn hết hạn, nhưng kiểm cả `hetHan` để không phụ thuộc
        // vào đúng một tầng.
        const co = (dons?.data ?? []).find((d: DonKey) => d.status === 'APPROVED' && !d.hetHan && d.key);
        setKey(co?.key ?? null);
        setTin(info?.data ?? null);
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

      // 2. Agent lo phần còn lại. Liệt kê ĐÚNG việc còn thiếu.
      const thieu: string[] = [];
      if (!may?.node) thieu.push('Node.js (chưa có — đây là lý do `npm` báo không tìm thấy lệnh)');
      else if (!may.npm) thieu.push('npm (có node nhưng thiếu npm)');
      if (!may?.opencode) thieu.push('gói `opencode-ai` (cài toàn cục bằng `npm i -g opencode-ai`)');

      const win = (may?.heDieuHanh ?? '') === 'win32';
      const chu = [
        'Hãy cài OpenCode trên máy này giúp tôi, làm từng bước và báo tôi biết khi xong.',
        '',
        `Hệ điều hành: ${may?.heDieuHanh ?? 'không rõ'}.`,
        `Đã có: node=${may?.node ?? 'KHÔNG'}, npm=${may?.npm ?? 'KHÔNG'}, opencode=${may?.opencode ?? 'KHÔNG'}.`,
        '',
        thieu.length
          ? `Việc cần làm — CHỈ những thứ còn thiếu:\n${thieu.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
          : 'Mọi thứ đã có sẵn — chỉ cần xác minh lại và hướng dẫn tôi dùng.',
        '',
        `File cấu hình ĐÃ ĐƯỢC TẠO SẴN tại: ${kq.duongDan}`,
        '⚠️ File đó đã chứa API key của tôi rồi. ĐỪNG mở, ĐỪNG đọc, ĐỪNG in nội dung nó ra —',
        'chỉ cần kiểm tra file có tồn tại là đủ.',
        '',
        win
          ? 'Lưu ý Windows: nếu chưa có Node.js thì cài bằng winget (`winget install OpenJS.NodeJS.LTS`) '
            + 'hoặc tải từ nodejs.org, rồi MỞ LẠI terminal trước khi chạy npm — biến PATH chỉ có hiệu lực ở cửa sổ mới.'
          : 'Nếu chưa có Node.js thì cài bằng trình quản lý gói sẵn có trên máy (brew/apt/dnf).',
        '',
        'Cuối cùng: chạy `opencode --version` để xác minh, rồi hướng dẫn tôi ngắn gọn '
          + 'cách mở terminal, vào thư mục dự án và gõ `opencode` để bắt đầu dùng.',
      ].join('\n');

      gui(chu);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Không cài được.');
    } finally {
      setDangCai(false);
    }
  }, [key, tin, may, gui, dangCai]);

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
        {dangCai ? 'Đang chuẩn bị…' : 'Cài OpenCode Terminal'}
      </button>

      {loi && <p className="nut-opencode__loi">{loi}</p>}

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
