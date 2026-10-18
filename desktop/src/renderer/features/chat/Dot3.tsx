/**
 * Giao diện ĐỢT 3 (18/10/2026) của AI Code trong app desktop:
 *   • `TheHoi`     — agent hỏi bằng lựa chọn (`hoi_nguoi_dung`): bấm chuột hoặc phím số.
 *   • `ThePhu`     — khối agent phụ (đọc / GHI trong khu riêng): nhiệm vụ, từng bước, kết quả.
 *   • `DaiHenCho`  — dải trạng thái CHỜ (`cho_doi`) + HẸN (`hen_goi_lai`) có nút huỷ.
 *   • `DongTinPhien` — "📨 Tin từ phiên X" (đọc ở lượt kế).
 * Tất cả là chữ thô (không innerHTML) — nội dung do model / phiên khác viết.
 */
import { useEffect, useState } from 'react';
import { Bot, Check, ChevronDown, ChevronRight, Clock, Mail, Timer, X } from 'lucide-react';
import type { AgentCauHoi, AgentChoView, AgentHenView } from '../../../shared/ipc';
import { useDich } from '../../i18n';

export interface PhuView {
  phuId: string; loaiAgent: string; nhiemVu: string; quyen: 'doc' | 'ghi'; thuMuc?: string;
  buoc: string[]; trangThai: 'dang' | 'xong' | 'loi'; tomTat?: string; tienUsd?: number;
}

export function TheHoi({ id, cauHoi, xong, traLoi }: {
  id: string; cauHoi: AgentCauHoi[]; xong?: string | undefined;
  traLoi: (id: string, tl: Array<{ chon: string[]; khac?: string }> | null) => void;
}) {
  const { dich } = useDich();
  const [chon, datChon] = useState<string[][]>(() => cauHoi.map(() => []));
  const [khac, datKhac] = useState<string[]>(() => cauHoi.map(() => ''));
  const [daGui, datDaGui] = useState(false);
  const gui = (ghiDe?: string[][]): void => {
    if (daGui) return;
    datDaGui(true);
    const c = ghiDe ?? chon;
    traLoi(id, cauHoi.map((_, i) => ({ chon: c[i] ?? [], ...(khac[i]?.trim() ? { khac: khac[i]!.trim() } : {}) })));
  };
  const bam = (i: number, nhan: string): void => {
    const q = cauHoi[i]!;
    const moi = chon.map((x, k) => (k !== i ? x : q.nhieu ? (x.includes(nhan) ? x.filter((y) => y !== nhan) : [...x, nhan]) : [nhan]));
    datChon(moi);
    // Một câu, chọn một ⇒ gửi luôn (như Claude Code).
    if (cauHoi.length === 1 && !q.nhieu && !khac[0]?.trim()) gui(moi);
  };
  // Phím số 1–4 chọn nhanh khi chỉ có một câu.
  useEffect(() => {
    if (xong || daGui || cauHoi.length !== 1) return undefined;
    const nghe = (ev: KeyboardEvent): void => {
      const tg = ev.target as HTMLElement | null;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
      const n = Number(ev.key);
      const q = cauHoi[0]!;
      if (n >= 1 && n <= q.luaChon.length) { ev.preventDefault(); bam(0, q.luaChon[n - 1]!.nhan); }
    };
    window.addEventListener('keydown', nghe);
    return () => window.removeEventListener('keydown', nghe);
  });
  if (xong !== undefined) {
    return (
      <div className="ct-agent-tool" data-vong="may" data-xong="dongY">
        <Check size={12} aria-hidden />
        <code>{dich('Bạn đã trả lời')}</code>
        <span className="ct-agent-tool-tomtat">{xong}</span>
      </div>
    );
  }
  return (
    <div className="ct-xinphep" data-muc="thuong">
      {cauHoi.map((q, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div className="ct-xinphep-dau">
            {q.tieuDe ? <code>{q.tieuDe}</code> : null}
            <span><strong>{q.cauHoi}</strong>{q.nhieu ? ` (${dich('chọn nhiều')})` : ''}</span>
          </div>
          <div className="ct-xinphep-nut" style={{ flexWrap: 'wrap' }}>
            {q.luaChon.map((l, k) => (
              <button
                key={l.nhan} type="button" disabled={daGui}
                className={chon[i]?.includes(l.nhan) ? 'ct-btn' : 'ct-btn ct-btn-ghost'}
                title={l.moTa ?? ''} onClick={() => bam(i, l.nhan)}
              >
                {cauHoi.length === 1 ? `${k + 1}. ` : ''}{l.nhan}
              </button>
            ))}
          </div>
          {q.luaChon.some((l) => l.moTa) && (
            <ul style={{ margin: '4px 0 0', paddingLeft: 18, opacity: 0.8, fontSize: 12 }}>
              {q.luaChon.filter((l) => l.moTa).map((l) => <li key={l.nhan}><strong>{l.nhan}</strong> — {l.moTa}</li>)}
            </ul>
          )}
          <input
            className="ct-input" style={{ marginTop: 6, width: '100%' }} disabled={daGui}
            placeholder={dich('Khác — gõ câu trả lời của bạn…')}
            value={khac[i] ?? ''}
            onChange={(e) => datKhac(khac.map((x, k) => (k === i ? e.target.value : x)))}
            onKeyDown={(e) => { if (e.key === 'Enter') gui(); }}
          />
        </div>
      ))}
      <div className="ct-xinphep-nut">
        <button type="button" className="ct-btn" disabled={daGui} onClick={() => gui()}>
          <Check size={14} aria-hidden /> {dich('Gửi câu trả lời')}
        </button>
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" disabled={daGui} onClick={() => { datDaGui(true); traLoi(id, null); }}>
          <X size={14} aria-hidden /> {dich('Bỏ qua')}
        </button>
      </div>
    </div>
  );
}

export function ThePhu({ p }: { p: PhuView }) {
  const { dich } = useDich();
  const [mo, datMo] = useState(false);
  return (
    <div className="ct-agent-tool" data-vong="may" data-xong={p.trangThai === 'xong' ? 'dongY' : p.trangThai === 'loi' ? 'tuChoi' : undefined}
      style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <button type="button" onClick={() => datMo(!mo)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
        {mo ? <ChevronDown size={12} aria-hidden /> : <ChevronRight size={12} aria-hidden />}
        <Bot size={12} aria-hidden />
        <code>{p.quyen === 'ghi' ? dich('Agent phụ GHI') : dich('Agent phụ')}</code>
        <span className="ct-agent-tool-tomtat">
          {p.loaiAgent} · {p.nhiemVu.slice(0, 120)}{p.trangThai === 'dang' ? ` · ${p.buoc.length} ${dich('bước')}…` : ''}
          {p.tienUsd ? ` · ~${p.tienUsd.toFixed(3)} $` : ''}
        </span>
      </button>
      {mo && (
        <div style={{ paddingLeft: 18, fontSize: 12 }}>
          {p.thuMuc ? <div style={{ opacity: 0.75 }}>{dich('Khu riêng')}: <code>{p.thuMuc}</code></div> : null}
          {p.buoc.slice(-60).map((b, i) => <div key={i} style={{ opacity: 0.85 }}>• {b}</div>)}
          {p.tomTat ? <pre className="ct-mcp-args" style={{ whiteSpace: 'pre-wrap' }}>{p.tomTat}</pre> : null}
        </div>
      )}
    </div>
  );
}

function gioPhut(t: number): string {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function DaiHenCho({ cho, hen, huyCho, huyHen }: {
  cho: AgentChoView[]; hen: AgentHenView[];
  huyCho: (id: string, cach: 'boCho' | 'xongNgay') => void;
  huyHen: (id: string) => void;
}) {
  const { dich } = useDich();
  const [, datNhip] = useState(0);
  useEffect(() => {
    if (!cho.length) return undefined;
    const h = setInterval(() => datNhip((x) => x + 1), 1000);
    return () => clearInterval(h);
  }, [cho.length]);
  if (!cho.length && !hen.length) return null;
  return (
    <div className="ct-notice" data-tone="info" style={{ margin: '6px 0', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
      {cho.map((c) => (
        <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Timer size={14} aria-hidden />
          <span style={{ flex: 1 }}>
            {dich('Đang chờ')}: {c.moTa} · {Math.max(0, Math.round((c.hetLuc - Date.now()) / 1000))}s {dich('còn lại')}
          </span>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => huyCho(c.id, 'xongNgay')}>{dich('Tiếp ngay')}</button>
          <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => huyCho(c.id, 'boCho')}>{dich('Bỏ chờ')}</button>
        </div>
      ))}
      {hen.map((h) => (
        <div key={h.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Clock size={14} aria-hidden />
          <span style={{ flex: 1 }}>
            ⏰ {dich('Hẹn quay lại lúc')} {gioPhut(h.luc)}{h.lap ? ` (${dich('lặp mỗi')} ${h.phut}′, ${dich('còn')} ${h.conLai}×)` : ''} — {h.lyDo.slice(0, 160)}
            <span style={{ opacity: 0.65 }}> · {dich('chỉ chạy khi app còn mở')}</span>
          </span>
          <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => huyHen(h.id)}>{dich('Huỷ hẹn')}</button>
        </div>
      ))}
    </div>
  );
}

export function DongTinPhien({ tu, noiDung, luc }: { tu: { id: string; ten: string; noi: string }; noiDung: string; luc: number }) {
  const { dich } = useDich();
  const [mo, datMo] = useState(false);
  return (
    <div className="ct-agent-tool" data-vong="notes" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <button type="button" onClick={() => datMo(!mo)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
        <Mail size={12} aria-hidden />
        <code>📨 {dich('Tin từ phiên')} {tu.ten}</code>
        <span className="ct-agent-tool-tomtat">{gioPhut(luc)} · {tu.noi} · {dich('agent đọc ở lượt kế')}</span>
      </button>
      {mo ? <pre className="ct-mcp-args" style={{ whiteSpace: 'pre-wrap' }}>{noiDung}</pre> : null}
    </div>
  );
}
