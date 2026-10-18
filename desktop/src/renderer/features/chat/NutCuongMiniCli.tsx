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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';

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
  /** cmd.exe không hiểu `irm` ⇒ gọi PowerShell một lần (đúng lệnh trên /cli). */
  cmd: 'powershell -NoProfile -ExecutionPolicy Bypass -c "irm https://cuongthai.com/cli/install.ps1 | iex"',
  /** Git Bash: install.sh tự nhận MSYS và chuyển sang install.ps1 (5ccda538). */
  gitBash: 'curl -fsSL https://cuongthai.com/cli/install.sh | bash',
};

/** Dòng lệnh cài tay — hệ đang chạy lên đầu (máy khác vẫn thấy đủ). */
function dongCaiTay(laWin: boolean): Array<{ id: string; nhan: string; lenh: string }> {
  const win = [
    { id: 'ps', nhan: 'Windows · PowerShell', lenh: LENH_CAI.win },
    { id: 'cmd', nhan: 'Windows · cmd', lenh: LENH_CAI.cmd },
    { id: 'gitbash', nhan: 'Windows · Git Bash', lenh: LENH_CAI.gitBash },
  ];
  const posix = [{ id: 'posix', nhan: 'macOS / Linux · Terminal', lenh: LENH_CAI.posix }];
  return laWin ? [...win, ...posix] : [...posix, ...win];
}

export function NutCuongMiniCli({ dangChay, thuMuc }: { dangChay: boolean; thuMuc?: string | null }) {
  const { api } = useSession();
  const { dich } = useDich();
  const logRef = useRef<HTMLDetailsElement | null>(null);
  /** Vừa cài xong ⇒ nút "Mở terminal" nổi bật (và đã tự mở một lần). */
  const [vuaCaiXong, setVuaCaiXong] = useState(false);
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

  const moTerminal = useCallback(async () => {
    const r = await window.cuongthai?.cli.moTerminal(thuMuc ?? undefined);
    if (r && !r.ok) setLoi(r.loi ?? dich('Không mở được terminal.'));
    return Boolean(r?.ok);
  }, [thuMuc, dich]);

  const xemLog = useCallback(() => {
    setMoLog(true);
    requestAnimationFrame(() => logRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  }, []);

  const caiDat = useCallback(async () => {
    if (dangCai) return;
    setDangCai(true);
    setLoi(null);
    setXong(null);
    setVuaCaiXong(false);
    setLog([]);
    setBuocNay('tai');
    try {
      const kq = await window.cuongthai?.cli.cai();
      if (!kq?.ok) {
        // Câu lỗi THẬT từ main (`loiThat`: dòng ✗ của trình cài / lỗi PowerShell) — không thay bằng câu chung.
        setLoi(kq?.loi?.trim() || dich('Không cài được.'));
        // Main trả cả `log` khi hỏng: trình cài chết trước khi kịp in dòng nào qua tiến độ thì vẫn có log để xem.
        const logMain = kq?.log;
        if (logMain) setLog((l) => (l.length ? l : logMain.split(/\r?\n/).filter((d) => d.trim()).slice(-400)));
        xemLog();
        return;
      }
      setXong(`CuongMini CLI ${kq.phienBan} đã sẵn sàng${kq.daDangNhap ? ' và đã đăng nhập sẵn' : ''}.`);
      if (!kq.daDangNhap && kq.loiDangNhap) setLoi(`Chưa đăng nhập sẵn được (${kq.loiDangNhap}) — lần đầu gõ cuongmini nó sẽ hỏi đăng nhập.`);
      await napMay();
      // Cài xong ⇒ tự mở terminal chạy cuongmini luôn (một lần); nút vẫn nổi bật để mở lại.
      setVuaCaiXong(true);
      await moTerminal();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : dich('Không cài được.'));
    } finally {
      setDangCai(false);
      setBuocNay(null);
    }
  }, [dangCai, napMay, moTerminal, xemLog, dich]);

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
              {daCai && vuaCaiXong && (
                <button type="button" className="nut-cli__chinh" onClick={() => void moTerminal()} disabled={dangCai} autoFocus>
                  ▶ Mở {tenTerm} và chạy cuongmini{thuMuc ? ' ở dự án này' : ''}
                </button>
              )}
              <button type="button" className={vuaCaiXong ? undefined : 'nut-cli__chinh'} onClick={() => void caiDat()} disabled={dangCai}>
                {dangCai ? 'Đang cài… (đừng tắt app)' : daCai ? 'Cài lại / cập nhật' : 'Cài đặt tự động'}
              </button>
              {daCai && !vuaCaiXong && (
                <button type="button" onClick={() => void moTerminal()} disabled={dangCai}>
                  Mở {tenTerm} và chạy cuongmini{thuMuc ? ' ở dự án này' : ''}
                </button>
              )}
            </div>

            {loi && (
              <div className="nut-opencode__loi" role="alert">
                <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{loi}</p>
                {log.length > 0 && (
                  <p style={{ margin: '6px 0 0' }}>
                    <button type="button" onClick={xemLog}>{dich('Xem log')}</button>{' '}
                    <button type="button" onClick={() => chep(`${loi}\n\n${log.slice(-200).join('\n')}`)}>
                      {daChep.startsWith(loi) ? dich('Đã chép') : dich('Chép lỗi + log')}
                    </button>
                  </p>
                )}
              </div>
            )}
            {xong && (
              <div className="nut-opencode__xong nut-cli__xong">
                <b>✓ {xong}</b>
                <p>Từ giờ chỉ cần: mở một cửa sổ <b>{tenTerm} MỚI</b> → <code>cd</code> vào thư mục dự án → gõ:</p>
                <div className="nut-cli__lenh"><code>cuongmini</code><button type="button" onClick={() => chep('cuongmini')}>{daChep === 'cuongmini' ? 'Đã chép' : 'Chép'}</button></div>
                <p className="nut-opencode__nho">Terminal đang mở sẵn từ trước có thể chưa thấy lệnh — mở cửa sổ mới là được.</p>
              </div>
            )}

            {log.length > 0 && (
              <details ref={logRef} open={moLog} onToggle={(e) => setMoLog((e.target as HTMLDetailsElement).open)} className="nut-cli__log">
                <summary>Chi tiết cài đặt ({log.length} dòng)</summary>
                <pre>{log.slice(-120).join('\n')}</pre>
              </details>
            )}

            <div className="nut-cli__tay">
              <p className="nut-opencode__nho">{dich('Cài tay (máy này hoặc máy khác) — chọn đúng cửa sổ lệnh bạn đang dùng:')}</p>
              {dongCaiTay(laWin).map((d) => (
                <div key={d.id}>
                  <p className="nut-opencode__nho" style={{ margin: '6px 0 2px' }}>{d.nhan}</p>
                  <div className="nut-cli__lenh">
                    <code>{d.lenh}</code>
                    <button type="button" onClick={() => chep(d.lenh)}>{daChep === d.lenh ? dich('Đã chép') : dich('Chép')}</button>
                  </div>
                </div>
              ))}
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
