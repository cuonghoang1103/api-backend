/**
 * ============================================================
 * NÚT "CÀI CUONGMINI CLI" — trong AI Code (thay nút OpenCode, 17/10/2026)
 * ============================================================
 *
 * Người dùng: *"thay nút Cài CuongMini trên OpenCode thành setup CuongMini CLI …
 * từ một máy mới mua về chưa cài gì, tự kiểm tra và cài full để user chỉ việc
 * vào cmd, iTerm, terminal gõ `cuongmini` là dùng"*.
 *
 * Một lần bấm: main chạy trình cài chính thức (tự tải Node nếu thiếu, tạo lệnh,
 * thêm PATH) ⇒ đăng nhập CLI sẵn bằng tài khoản app ⇒ kiểm `cuongmini --version`
 * ⇒ mời mở Terminal ngay ở thư mục dự án. Xem `main/ipc/cuongminiCli.ts`.
 *
 * Quyền DÙNG (khác quyền CÀI): Pro hoặc có key terminal còn hạn — máy chủ chốt
 * (`agent.routes.ts › duocDungAiCode`). Cài thì ai cũng cài được; chưa đủ quyền
 * thì hộp nói rõ cách lấy, thay vì để người ta cài xong rồi mới bị chặn.
 */
import { useCallback, useEffect, useState } from 'react';
import { useSession } from '../../auth/session';

const WEB = 'https://cuongthai.com';

interface DoMay {
  heDieuHanh: string;
  duongLenh: string;
  phienBan: string | null;
  daDangNhap: boolean;
  terminal: string;
}

type Buoc = 'tai' | 'cai' | 'dangNhap' | 'kiem';
const BUOC: Array<[Buoc, string]> = [
  ['tai', 'Tải trình cài chính thức'],
  ['cai', 'Cài Node (nếu máy chưa có) + CuongMini CLI + thêm lệnh vào PATH'],
  ['dangNhap', 'Đăng nhập CLI bằng tài khoản của app'],
  ['kiem', 'Kiểm lệnh cuongmini chạy được'],
];

const LENH_CAI = {
  posix: 'curl -fsSL https://cuongthai.com/cli/install.sh | bash',
  win: 'irm https://cuongthai.com/cli/install.ps1 | iex',
};

export function NutCuongMiniCli({ dangChay, thuMuc }: { dangChay: boolean; thuMuc?: string | null }) {
  const { api } = useSession();
  const [mo, setMo] = useState(false);
  const [may, setMay] = useState<DoMay | null>(null);
  const [duocDung, setDuocDung] = useState<boolean | null>(null);
  const [dangCai, setDangCai] = useState(false);
  const [buocNay, setBuocNay] = useState<Buoc | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [moLog, setMoLog] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [xong, setXong] = useState<string | null>(null);
  const [daChep, setDaChep] = useState('');

  const napMay = useCallback(async () => {
    setMay(await window.cuongthai?.cli.doMay().catch(() => null) ?? null);
  }, []);

  useEffect(() => { void napMay(); }, [napMay]);

  // Quyền dùng: `/agent/tools` trả `pro` = Pro HOẶC có key terminal (máy chủ quyết).
  useEffect(() => {
    if (!api || !mo) return;
    let huy = false;
    api.request<{ pro?: boolean }>('/api/v1/agent/tools')
      .then((d) => { if (!huy) setDuocDung(d?.pro === true); })
      .catch(() => { if (!huy) setDuocDung(null); });
    return () => { huy = true; };
  }, [api, mo]);

  useEffect(() => window.cuongthai?.on('cli:tienDo', (p) => {
    const t = p as { buoc: Buoc; dong?: string };
    setBuocNay(t.buoc);
    if (t.dong) setLog((l) => [...l.slice(-400), t.dong!]);
  }), []);

  const caiDat = useCallback(async () => {
    if (dangCai) return;
    setDangCai(true);
    setLoi(null);
    setXong(null);
    setLog([]);
    setBuocNay('tai');
    try {
      const kq = await window.cuongthai?.cli.cai();
      if (!kq?.ok) {
        setLoi(`${kq?.loi ?? 'Không cài được.'}\nKiểm tra mạng rồi bấm lại. Vẫn lỗi thì mở "Chi tiết" bên dưới và gửi cho admin.`);
        setMoLog(true);
        return;
      }
      setXong(`CuongMini CLI ${kq.phienBan} đã sẵn sàng${kq.daDangNhap ? ' và đã đăng nhập sẵn' : ''}.`);
      if (!kq.daDangNhap && kq.loiDangNhap) setLoi(`Chưa đăng nhập sẵn được (${kq.loiDangNhap}) — lần đầu gõ cuongmini nó sẽ hỏi đăng nhập.`);
      await napMay();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Không cài được.');
    } finally {
      setDangCai(false);
      setBuocNay(null);
    }
  }, [dangCai, napMay]);

  const moTerminal = useCallback(async () => {
    const r = await window.cuongthai?.cli.moTerminal(thuMuc ?? undefined);
    if (r && !r.ok) setLoi(r.loi ?? 'Không mở được terminal.');
  }, [thuMuc]);

  const chep = (chu: string) => {
    void navigator.clipboard.writeText(chu);
    setDaChep(chu);
    setTimeout(() => setDaChep(''), 1500);
  };

  const daCai = Boolean(may?.phienBan);
  const laWin = may?.heDieuHanh === 'win32';
  const tenTerm = may?.terminal ?? 'Terminal';
  const thuTu = (b: Buoc) => BUOC.findIndex(([x]) => x === b);

  return (
    <>
      <button
        type="button"
        onClick={() => setMo(true)}
        disabled={dangChay && !mo}
        title="Cài CuongMini CLI — AI Code ngay trong terminal, gõ cuongmini là dùng"
        className="nut-opencode nut-opencode--sang nut-cli"
      >
        <span aria-hidden>⌨️</span> {daCai ? `CuongMini CLI ${may?.phienBan}` : 'Cài CuongMini CLI (terminal)'}
      </button>

      {mo && (
        <div className="nut-opencode__phu" onClick={() => !dangCai && setMo(false)}>
          <div className="nut-opencode__hop nut-cli__hop" onClick={(e) => e.stopPropagation()}>
            <h3>⌨️ CuongMini CLI — AI Code ngay trong terminal</h3>
            <p>
              Như <b>Claude Code</b>: mở {laWin ? 'PowerShell / Windows Terminal' : 'Terminal hoặc iTerm'} ở thư mục dự án,
              gõ <code>cuongmini</code> là trò chuyện, đọc và sửa code, chạy lệnh — có bảng kế hoạch, diff màu, lệnh <code>/</code>,
              {' '}<code>@file</code>. Cùng bộ máy, cùng hạn mức với AI Code trong app này.
            </p>

            {duocDung === false && (
              <p className="nut-opencode__loi">
                Tài khoản này chưa dùng được CLI — cần <b>gói Pro</b> hoặc <b>key terminal</b> còn hạn.{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); void window.cuongthai?.app.openExternal(`${WEB}/pro`); }}>Xem gói Pro</a>
                {' · '}
                <a href="#" onClick={(e) => { e.preventDefault(); void window.cuongthai?.app.openExternal(`${WEB}/llm-key`); }}>Xin key</a>
                {' · '}
                <a href="#" onClick={(e) => { e.preventDefault(); void window.cuongthai?.app.openExternal(`${WEB}/shop`); }}>Mua key</a>
                <br />Bạn vẫn cài trước được.
              </p>
            )}

            <ul className="nut-cli__buoc">
              {BUOC.map(([b, ten]) => {
                const tt = xong ? 'xong' : buocNay === null ? (daCai ? 'xong' : 'cho') : thuTu(b) < thuTu(buocNay) ? 'xong' : b === buocNay ? 'dang' : 'cho';
                return (
                  <li key={b} className={`nut-cli__b--${tt}`}>
                    <span>{tt === 'xong' ? '✓' : tt === 'dang' ? '◐' : '○'}</span> {ten}
                  </li>
                );
              })}
            </ul>

            <div className="nut-opencode__cach">
              <button type="button" className="nut-cli__chinh" onClick={() => void caiDat()} disabled={dangCai}>
                {dangCai ? 'Đang cài… (đừng tắt app)' : daCai ? 'Cài lại / cập nhật' : 'Cài đặt tự động'}
              </button>
              {daCai && (
                <button type="button" onClick={() => void moTerminal()} disabled={dangCai}>
                  Mở {tenTerm} và chạy cuongmini{thuMuc ? ' ở dự án này' : ''}
                </button>
              )}
            </div>

            {loi && <p className="nut-opencode__loi" style={{ whiteSpace: 'pre-line' }}>{loi}</p>}
            {xong && (
              <div className="nut-opencode__xong nut-cli__xong">
                <b>✓ {xong}</b>
                <p>Từ giờ chỉ cần: mở một cửa sổ <b>{tenTerm} MỚI</b> → <code>cd</code> vào thư mục dự án → gõ:</p>
                <div className="nut-cli__lenh"><code>cuongmini</code><button type="button" onClick={() => chep('cuongmini')}>{daChep === 'cuongmini' ? 'Đã chép' : 'Chép'}</button></div>
                <p className="nut-opencode__nho">Terminal đang mở sẵn từ trước có thể chưa thấy lệnh — mở cửa sổ mới là được.</p>
              </div>
            )}

            {log.length > 0 && (
              <details open={moLog} onToggle={(e) => setMoLog((e.target as HTMLDetailsElement).open)} className="nut-cli__log">
                <summary>Chi tiết cài đặt ({log.length} dòng)</summary>
                <pre>{log.slice(-120).join('\n')}</pre>
              </details>
            )}

            <div className="nut-cli__tay">
              <p className="nut-opencode__nho">Cài tay trên máy khác ({laWin ? 'PowerShell' : 'Terminal'}):</p>
              <div className="nut-cli__lenh">
                <code>{laWin ? LENH_CAI.win : LENH_CAI.posix}</code>
                <button type="button" onClick={() => chep(laWin ? LENH_CAI.win : LENH_CAI.posix)}>{daChep ? 'Đã chép' : 'Chép'}</button>
              </div>
              <p className="nut-opencode__nho">
                Hướng dẫn đầy đủ (phím tắt, lệnh /, bảng kế hoạch…):{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); void window.cuongthai?.app.openExternal(`${WEB}/cli`); }}>cuongthai.com/cli</a>
              </p>
            </div>

            <button type="button" className="nut-opencode__dong" onClick={() => setMo(false)} disabled={dangCai}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
