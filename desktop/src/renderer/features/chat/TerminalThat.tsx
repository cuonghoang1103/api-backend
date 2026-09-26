/**
 * ============================================================
 * KHUNG TERMINAL THẬT — xterm.js + PTY (26/09/2026)
 * ============================================================
 *
 * Thay "Bảng lệnh" cũ (chạy một lệnh, không PTY — xem `BangLenh.tsx`, nay chỉ
 * còn là đường lùi). Đây là terminal ĐẦY ĐỦ như VS Code: màu, con trỏ, `vim`,
 * `htop`, REPL, và quan trọng nhất — lệnh HỎI-ĐÁP.
 *
 * ─── HAI NGƯỜI, MỘT TERMINAL ───
 * Mỗi tab là một phiên PTY ở tiến trình chính (`main/terminal/phienTerminal.ts`).
 * Agent mở tab bằng `terminal_mo` (có nhãn 🤖), người dùng mở bằng nút +. Cả
 * hai gõ được vào mọi tab: agent qua tool (có thẻ duyệt), người dùng qua bàn
 * phím. Mật khẩu đi theo đường thứ hai — nên khi agent đụng lời hỏi mật khẩu,
 * khung này tự BẬT, tự CHỌN đúng tab, tự FOCUS và hiện dải nhắc.
 *
 * ─── VÌ SAO GIỮ MỌI xterm SỐNG, CHỈ ẨN BẰNG CSS ───
 * Tháo một xterm rồi dựng lại là vẽ lại từ đệm thô: được, nhưng mất vị trí cuộn
 * và nháy một khung. Giữ sống thì đổi tab tức thì. Đệm thô (`pty:demTho`) chỉ
 * dùng lúc MỞ LẠI khung (sau khi người dùng đóng khung rồi mở).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyRound, Plus, SquareTerminal, X, Bot } from 'lucide-react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import type { PhienPty } from '@shared/ipc';
import { useDich } from '../../i18n';

const CAO_MIN = 140;
const CAO_MAX = 720;
const CAO_MAC_DINH = 280;
const KHOA_CAO = 'ct-terminal-cao';

/** Bảng màu khớp giao diện terminal của trang AI (`.ct-ai-term`). */
const THEME = {
  background: '#070a09',
  foreground: '#d5e3dc',
  cursor: '#4ade80',
  cursorAccent: '#070a09',
  selectionBackground: 'rgba(74, 222, 128, 0.3)',
  black: '#0f1413', red: '#f87171', green: '#4ade80', yellow: '#facc15',
  blue: '#60a5fa', magenta: '#c084fc', cyan: '#22d3ee', white: '#d5e3dc',
  brightBlack: '#5f766b', brightRed: '#fca5a5', brightGreen: '#86efac', brightYellow: '#fde047',
  brightBlue: '#93c5fd', brightMagenta: '#d8b4fe', brightCyan: '#67e8f9', brightWhite: '#ffffff',
};

type PhienUi = PhienPty & { choNhap?: 'matKhau' | 'xacNhan' | null };

/** Một ô xterm gắn với một phiên PTY. */
function OTerminal({ phien, hien, focusLan }: { phien: PhienUi; hien: boolean; focusLan: number }) {
  const hopRef = useRef<HTMLDivElement | null>(null);
  const xtRef = useRef<{ t: Terminal; fit: FitAddon } | null>(null);

  useEffect(() => {
    const hop = hopRef.current;
    const b = window.cuongthai?.pty;
    if (!hop || !b) return;
    const t = new Terminal({
      theme: THEME,
      fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace",
      fontSize: 12.5,
      lineHeight: 1.15,
      cursorBlink: true,
      scrollback: 5000,
      allowProposedApi: false,
      // Windows: ConPTY tự xuống dòng — để xterm biết thì chữ không vỡ khi đổi cỡ.
      ...(navigator.userAgent.includes('Windows') ? { windowsPty: { backend: 'conpty' as const } } : {}),
    });
    const fit = new FitAddon();
    t.loadAddon(fit);
    t.open(hop);
    xtRef.current = { t, fit };

    /* Sao chép / dán theo thói quen từng hệ điều hành:
       macOS: ⌘C/⌘V do menu Sửa lo sẵn.
       Windows/Linux: Ctrl+C khi ĐANG CHỌN chữ = chép (không thì gửi ^C như
       terminal thật); Ctrl+Shift+C/V luôn là chép/dán. */
    t.attachCustomKeyEventHandler((e) => {
      if (e.type !== 'keydown') return true;
      const mod = e.ctrlKey && !e.metaKey;
      if (mod && (e.key === 'c' || e.key === 'C') && (e.shiftKey || t.hasSelection())) {
        void navigator.clipboard.writeText(t.getSelection());
        return false;
      }
      if (mod && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
        void navigator.clipboard.readText().then((s) => { if (s) void b.gui(phien.id, s); });
        return false;
      }
      return true;
    });

    const huyGo = t.onData((d) => { void b.gui(phien.id, d); });
    const huyNghe = window.cuongthai?.on('pty:du', (p) => {
      const e = p as { id: string; du: string };
      if (e.id === phien.id) t.write(e.du);
    });
    // Vẽ lại phần đã có (terminal mở từ trước khi khung này dựng).
    void b.demTho(phien.id).then((tho) => { if (tho) t.write(tho); });

    const doCo = (): void => {
      if (!hop.offsetWidth || !hop.offsetHeight) return;
      try {
        fit.fit();
        void b.coLai(phien.id, t.cols, t.rows);
      } catch { /* chưa gắn xong */ }
    };
    const ro = new ResizeObserver(() => doCo());
    ro.observe(hop);
    requestAnimationFrame(doCo);

    return () => {
      ro.disconnect();
      huyGo.dispose();
      huyNghe?.();
      t.dispose();
      xtRef.current = null;
    };
  }, [phien.id]);

  useEffect(() => {
    if (!hien || !xtRef.current) return;
    requestAnimationFrame(() => {
      try { xtRef.current?.fit.fit(); } catch { /* ẩn */ }
      xtRef.current?.t.focus();
    });
  }, [hien, focusLan]);

  return <div className="ct-tt-o" data-hien={hien} ref={hopRef} />;
}

export function TerminalThat({ cuocId, onDong, onCanMo }: {
  cuocId: string;
  onDong: () => void;
  /** Gọi khi agent cần người dùng nhìn vào terminal (mở tab mới / hỏi mật khẩu). */
  onCanMo?: () => void;
}) {
  const { dich } = useDich();
  const [ds, datDs] = useState<PhienUi[]>([]);
  const [dangXem, datDangXem] = useState<string | null>(null);
  const [mayCo, datMayCo] = useState<{ co: boolean; loi: string | null } | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const [focusLan, datFocusLan] = useState(0);
  const [cao, datCao] = useState<number>(() => {
    try {
      const n = Number(localStorage.getItem(KHOA_CAO));
      return Number.isFinite(n) && n >= CAO_MIN && n <= CAO_MAX ? n : CAO_MAC_DINH;
    } catch { return CAO_MAC_DINH; }
  });
  const keo = useRef<{ y: number; cao: number } | null>(null);

  const moMoi = useCallback(async () => {
    const b = window.cuongthai?.pty;
    if (!b) return;
    datLoi(null);
    const r = await b.mo(cuocId, 120, 30);
    if (!r.ok || !r.phien) { datLoi(r.loi ?? 'Không mở được terminal.'); return; }
    const p = r.phien;
    datDs((c) => (c.some((x) => x.id === p.id) ? c : [...c, p]));
    datDangXem(p.id);
  }, [cuocId]);

  // Nạp danh sách phiên sẵn có; chưa có cái nào thì mở một cái cho người dùng.
  useEffect(() => {
    const b = window.cuongthai?.pty;
    if (!b) return;
    void b.mayCo().then(datMayCo);
    void b.ds(cuocId).then((d) => {
      datDs(d);
      const song = d.filter((x) => x.dangChay);
      if (song.length) datDangXem((cu) => cu ?? song[song.length - 1]!.id);
      else void moMoi();
    });
  }, [cuocId, moMoi]);

  // Phiên mở/đóng/thoát/đang hỏi — kể cả phiên AGENT vừa mở.
  useEffect(() => window.cuongthai?.on('pty:trangThai', (p) => {
    const e = p as PhienUi;
    if (e.cuocId !== cuocId) return;
    datDs((c) => {
      const i = c.findIndex((x) => x.id === e.id);
      if (i < 0) return e.dangChay ? [...c, e] : c;
      const moi = [...c];
      moi[i] = { ...moi[i]!, ...e };
      return moi;
    });
    if (e.nguon === 'agent' && e.dangChay && (e.choNhap === 'matKhau' || e.choNhap === undefined)) {
      /* Agent mở tab mới, hoặc đang cần người gõ mật khẩu ⇒ chuyển tới nó và
         đặt con trỏ vào đó — người dùng chỉ việc gõ. */
      datDangXem(e.id);
      datFocusLan((n) => n + 1);
      onCanMo?.();
    }
  }), [cuocId, onCanMo]);

  const dong = async (id: string): Promise<void> => {
    await window.cuongthai?.pty.dong(id);
    datDs((c) => {
      const con = c.filter((x) => x.id !== id);
      if (dangXem === id) datDangXem(con[con.length - 1]?.id ?? null);
      return con;
    });
  };

  // Kéo đổi chiều cao — pointermove trên WINDOW để không đứt khi con trỏ ra khỏi tay nắm.
  useEffect(() => {
    const move = (e: PointerEvent): void => {
      if (!keo.current) return;
      datCao(Math.min(CAO_MAX, Math.max(CAO_MIN, keo.current.cao + (keo.current.y - e.clientY))));
    };
    const up = (): void => {
      if (!keo.current) return;
      keo.current = null;
      try { localStorage.setItem(KHOA_CAO, String(cao)); } catch { /* riêng tư */ }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [cao]);

  const hienTai = ds.find((x) => x.id === dangXem) ?? null;
  const choMatKhau = hienTai?.dangChay && hienTai.choNhap === 'matKhau';

  return (
    <div className="ct-tt" style={{ height: cao }}>
      <div
        className="ct-tt-keo"
        role="separator"
        aria-orientation="horizontal"
        aria-label={dich('Kéo để đổi chiều cao terminal')}
        onPointerDown={(e) => { keo.current = { y: e.clientY, cao }; e.preventDefault(); }}
      />
      <div className="ct-tt-dau">
        <SquareTerminal size={13} aria-hidden />
        <div className="ct-tt-tabs" role="tablist">
          {ds.map((p) => (
            <div key={p.id} className="ct-tt-tab" data-chon={p.id === dangXem} data-song={p.dangChay}>
              <button type="button" role="tab" aria-selected={p.id === dangXem} onClick={() => { datDangXem(p.id); datFocusLan((n) => n + 1); }} title={`${p.tieuDe} — ${p.cwd}`}>
                {p.nguon === 'agent' && <Bot size={11} aria-label="agent" />}
                {p.choNhap === 'matKhau' && p.dangChay && <KeyRound size={11} aria-label={dich('đang chờ mật khẩu')} />}
                <span>{p.tieuDe}</span>
                {!p.dangChay && <em>{p.ma === 0 ? '✓' : `✗${p.ma ?? ''}`}</em>}
              </button>
              <button type="button" className="ct-tt-x" onClick={() => void dong(p.id)} aria-label={dich('Đóng terminal')}>
                <X size={11} />
              </button>
            </div>
          ))}
          <button type="button" className="ct-tt-them" onClick={() => void moMoi()} title={dich('Mở terminal mới')}>
            <Plus size={13} />
          </button>
        </div>
        <button type="button" className="ct-tt-dong" onClick={onDong} title={dich('Ẩn terminal (các phiên vẫn chạy)')}>
          <X size={13} />
        </button>
      </div>

      {choMatKhau && (
        <div className="ct-tt-nhac" role="status">
          <KeyRound size={13} aria-hidden />
          {dich('Terminal đang hỏi mật khẩu — gõ vào đây rồi nhấn Enter. Agent KHÔNG nhìn thấy mật khẩu bạn gõ.')}
        </div>
      )}
      {mayCo && !mayCo.co && (
        <div className="ct-tt-nhac" data-loai="canh">
          {dich('Máy này chưa nạp được terminal đầy đủ (PTY) — đang chạy chế độ đơn giản: gõ lệnh được, nhưng ssh/sudo hỏi mật khẩu sẽ không hiện.')}
        </div>
      )}
      {loi && <div className="ct-tt-nhac" data-loai="loi">{loi}</div>}

      <div className="ct-tt-than">
        {ds.map((p) => (
          <OTerminal key={p.id} phien={p} hien={p.id === dangXem} focusLan={p.id === dangXem ? focusLan : 0} />
        ))}
        {ds.length === 0 && <p className="ct-tt-trong">{dich('Chưa có terminal nào. Bấm + để mở.')}</p>}
      </div>
    </div>
  );
}
