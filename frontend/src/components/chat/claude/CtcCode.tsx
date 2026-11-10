'use client';

/**
 * CuongMini Code trên web (/chat → Code, 10/11/2026) — bố cục theo claude.ai/code, thương hiệu CuongThai.
 *
 * Web KHÔNG chạy được mã trên máy người dùng: phiên Code ở đây = trò chuyện kỹ năng "Lập trình", có thể gắn một
 * kho GitHub CÔNG KHAI (máy chủ đọc README + cây thư mục — src/services/chatKhoMa.ts) và chọn mức nỗ lực.
 * Muốn AI đọc/sửa mã thật trong máy ⇒ thẻ dẫn sang app CuongMini Desktop / CLI / extension (trang /download, /ai-code).
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Gauge, GitBranch, Github, Loader2, MonitorDown, Star, TerminalSquare, X } from 'lucide-react';
import { api } from '@/lib/api';
import { CuongMiniPanda } from './CuongMiniPanda';

export interface KhoInfo { ten: string; moTa: string | null; nhanh: string; ngonNgu: string | null; sao: number; soMuc: number; url: string }
export type DoKy = 'nhanh' | 'vua' | 'ky';
export const NHAN_DO_KY: Record<DoKy, { ten: string; mota: string }> = {
  nhanh: { ten: 'Nhanh', mota: 'Trả lời gọn, đi thẳng vào mã' },
  vua: { ten: 'Cân bằng', mota: 'Mặc định' },
  ky: { ten: 'Kỹ', mota: 'Xét trường hợp biên, nêu đánh đổi' },
};

function useNgoai(open: boolean, ref: React.RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const f = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', f);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', f); document.removeEventListener('keydown', k); };
  }, [open, ref, close]);
}

/** Nút chọn mức nỗ lực (dưới ô soạn). */
export function EffortPicker({ value, onChange, placement = 'down' }: { value: DoKy; onChange: (d: DoKy) => void; placement?: 'up' | 'down' }) {
  const [mo, setMo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useNgoai(mo, ref, () => setMo(false));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="ctc-below-btn" onClick={() => setMo((v) => !v)} aria-haspopup="menu" aria-expanded={mo} title="Mức nỗ lực">
        <Gauge size={15} /> <span>{NHAN_DO_KY[value].ten}</span> <ChevronDown size={13} />
      </button>
      {mo && (
        <div className="ctc-menu" style={placement === 'down' ? { left: 0, top: 'calc(100% + 6px)', minWidth: 230 } : { left: 0, bottom: 'calc(100% + 6px)', minWidth: 230 }} role="menu">
          <div className="ctc-menu-label">Mức nỗ lực</div>
          {(Object.keys(NHAN_DO_KY) as DoKy[]).map((d) => (
            <button key={d} type="button" className="ctc-menu-item ctc-model-item" onClick={() => { onChange(d); setMo(false); }}>
              <span style={{ minWidth: 0 }}><b>{NHAN_DO_KY[d].ten}</b><small>{NHAN_DO_KY[d].mota}</small></span>
              {value === d && <Check size={15} className="ctc-model-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Nút chọn kho (dưới ô soạn): mở hộp nhập owner/ten-kho. */
export function RepoPicker({ kho, onChange, signedIn, placement = 'down' }: {
  kho: KhoInfo | null; onChange: (k: KhoInfo | null) => void; signedIn: boolean; placement?: 'up' | 'down';
}) {
  const [mo, setMo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useNgoai(mo, ref, () => setMo(false));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="ctc-below-btn" data-on={!!kho} onClick={() => setMo((v) => !v)} aria-haspopup="dialog" aria-expanded={mo} data-testid="ctc-repo-btn">
        <Github size={15} /> <span>{kho ? kho.ten : 'Repo'}</span> <ChevronDown size={13} />
      </button>
      {mo && (
        <div className="ctc-menu ctc-repo-pop" style={placement === 'down' ? { left: 0, top: 'calc(100% + 6px)' } : { left: 0, bottom: 'calc(100% + 6px)' }}>
          <GanKho kho={kho} onChange={(k) => { onChange(k); if (k) setMo(false); }} signedIn={signedIn} gon />
        </div>
      )}
    </div>
  );
}

/** Ô gắn kho GitHub công khai (dùng trong thẻ "Kết nối GitHub" và bộ chọn Repo). */
export function GanKho({ kho, onChange, signedIn, gon }: { kho: KhoInfo | null; onChange: (k: KhoInfo | null) => void; signedIn: boolean; gon?: boolean }) {
  const [ten, setTen] = useState('');
  const [dang, setDang] = useState(false);
  const [loi, setLoi] = useState('');
  const gan = async () => {
    if (!ten.trim()) return;
    setDang(true); setLoi('');
    try {
      const r = await api.get('/ai/chat/kho-ma', { params: { ten: ten.trim() } });
      onChange(r.data.data as KhoInfo);
      setTen('');
    } catch (e) {
      const m = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setLoi(m || 'Không đọc được kho này');
    } finally { setDang(false); }
  };
  if (!signedIn) return <p className="ctc-page-note" style={{ margin: 0 }}>Đăng nhập để gắn kho GitHub vào phiên Code.</p>;
  return (
    <div className="ctc-gan-kho">
      {kho ? (
        <div className="ctc-kho">
          <Github size={18} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <a href={kho.url} target="_blank" rel="noreferrer" className="ctc-kho-ten">{kho.ten}</a>
            {kho.moTa && <div className="ctc-kho-mota">{kho.moTa}</div>}
            <div className="ctc-kho-meta">
              <span><GitBranch size={12} /> {kho.nhanh}</span>
              {kho.ngonNgu && <span>{kho.ngonNgu}</span>}
              <span><Star size={12} /> {kho.sao}</span>
              <span>{kho.soMuc} mục</span>
            </div>
          </div>
          <button type="button" className="ctc-icon-btn" data-sm aria-label="Bỏ kho" onClick={() => onChange(null)}><X size={15} /></button>
        </div>
      ) : (
        <>
          <div className="ctc-gan-row">
            <input
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); void gan(); } }}
              placeholder="owner/ten-kho hoặc link github.com/…"
              aria-label="Kho GitHub"
              autoFocus={gon}
            />
            <button type="button" className="ctc-btn" data-primary disabled={!ten.trim() || dang} onClick={() => void gan()}>
              {dang ? <Loader2 size={14} className="animate-spin" /> : null} Gắn kho
            </button>
          </div>
          {loi && <p className="ctc-gan-loi">{loi}</p>}
          <p className="ctc-page-note" style={{ margin: '8px 0 0' }}>Kho công khai. Kho riêng tư: sắp có.</p>
        </>
      )}
    </div>
  );
}

/** Màn chào của phiên Code mới. `composer` là ô soạn (đã gắn sẵn bộ chọn Repo/mức nỗ lực). */
export function CodeHome({ composer, kho, onKho, signedIn }: {
  composer: React.ReactNode; kho: KhoInfo | null; onKho: (k: KhoInfo | null) => void; signedIn: boolean;
}) {
  return (
    <div className="ctc-home ctc-code-home">
      <div className="ctc-home-hello">
        <CuongMiniPanda size={54} className="ctc-home-panda" />
        <h1>CuongMini <em className="ctc-code-em">Code</em></h1>
      </div>
      <p className="ctc-code-sub">Hỏi, giải thích, review và viết mã. Gắn một kho GitHub để CuongMini hiểu cấu trúc dự án của bạn.</p>
      <div className="ctc-dock-inner">{composer}</div>
      <div className="ctc-code-cards">
        <section className="ctc-code-card">
          <div className="ctc-code-card-head"><span className="ctc-the-ic" data-mau="slate"><Github size={18} /></span><b>Kết nối GitHub</b></div>
          <GanKho kho={kho} onChange={onKho} signedIn={signedIn} />
        </section>
        <section className="ctc-code-card">
          <div className="ctc-code-card-head"><span className="ctc-the-ic" data-mau="violet"><MonitorDown size={18} /></span><b>Lập trình ngay trên máy bạn</b></div>
          <p>Trên web, CuongMini chỉ trò chuyện về mã. Muốn AI đọc, sửa file và chạy lệnh trực tiếp trong dự án của bạn, hãy dùng app CuongMini Desktop hoặc CLI.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link className="ctc-btn" data-primary href="/download"><MonitorDown size={14} /> Tải app Desktop</Link>
            <Link className="ctc-btn" href="/ai-code"><TerminalSquare size={14} /> CLI & extension</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
