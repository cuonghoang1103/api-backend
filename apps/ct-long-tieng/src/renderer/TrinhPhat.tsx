import { useCallback, useEffect, useRef, useState } from 'react';
import type { MucThuVien } from '../shared/ipc';
import { cauTaiThoiDiem, docSrt, type CauPhuDe } from '../shared/srt';
import { Icon } from './Hinh';

const TOC_DO = [0.75, 1, 1.25, 1.5];

/**
 * Trình phát: đổi "Chỉ giọng Việt" ↔ "Giữ giọng gốc" GIỮ NGUYÊN vị trí đang xem (và trạng thái phát/dừng),
 * phụ đề Việt + phụ đề gốc vẽ thành lớp phủ (bật cùng lúc được, toàn màn hình vẫn thấy), tốc độ 0,75–1,5, ±10 s.
 */
export function TrinhPhat({ mucId, dong }: { mucId: string; dong: () => void }) {
  const [m, datM] = useState<MucThuVien | null>(null);
  const [ban, datBan] = useState<'vi' | 'viGoc'>('vi');
  const [pdVi, datPdVi] = useState<CauPhuDe[]>([]);
  const [pdGoc, datPdGoc] = useState<CauPhuDe[]>([]);
  const [batVi, datBatVi] = useState(true);
  const [batGoc, datBatGoc] = useState(false);
  const [toc, datToc] = useState(1);
  const [t, datT] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const khung = useRef<HTMLDivElement>(null);
  const viTriCho = useRef<{ t: number; phat: boolean } | null>(null);

  useEffect(() => {
    void window.ctlt.thuVien().then((ds) => {
      const x = ds.find((d) => d.id === mucId) ?? null;
      datM(x);
      if (x && !x.vi && x.viGoc) datBan('viGoc');
    });
    void window.ctlt.docPhuDe(mucId, 'vi').then((s) => datPdVi(s ? docSrt(s) : []));
    void window.ctlt.docPhuDe(mucId, 'goc').then((s) => datPdGoc(s ? docSrt(s) : []));
  }, [mucId]);

  const doiBan = useCallback((moi: 'vi' | 'viGoc') => {
    const v = video.current;
    if (!m || !m[moi] || moi === ban) return;
    if (v) viTriCho.current = { t: v.currentTime, phat: !v.paused };
    datBan(moi);
  }, [m, ban]);

  const khiNapXong = () => {
    const v = video.current;
    if (!v) return;
    v.playbackRate = toc;
    const cho = viTriCho.current;
    if (cho) {
      v.currentTime = cho.t;
      if (cho.phat) void v.play();
      viTriCho.current = null;
    }
  };

  useEffect(() => { if (video.current) video.current.playbackRate = toc; }, [toc]);

  const tua = (giay: number) => {
    const v = video.current;
    if (v) v.currentTime = Math.max(0, Math.min((v.duration || Infinity) - 0.1, v.currentTime + giay));
  };
  const doiToc = (huong: 1 | -1) => {
    const i = TOC_DO.indexOf(toc);
    datToc(TOC_DO[Math.max(0, Math.min(TOC_DO.length - 1, (i < 0 ? 1 : i) + huong))]);
  };
  const toanManHinh = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void khung.current?.requestFullscreen();
  };

  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const v = video.current;
      const k = e.key;
      let xong = true;
      if (k === ' ' || k === 'k' || k === 'K') { if (v) { if (v.paused) void v.play(); else v.pause(); } }
      else if (k === 'ArrowLeft' || k === 'j' || k === 'J') tua(-10);
      else if (k === 'ArrowRight' || k === 'l' || k === 'L') tua(10);
      else if (k === 'ArrowUp') { if (v) v.volume = Math.min(1, v.volume + 0.1); }
      else if (k === 'ArrowDown') { if (v) v.volume = Math.max(0, v.volume - 0.1); }
      else if (k === 'v' || k === 'V') doiBan(ban === 'vi' ? 'viGoc' : 'vi');
      else if (k === 'c' || k === 'C') datBatVi((x) => !x);
      else if (k === 'o' || k === 'O') datBatGoc((x) => !x);
      else if (k === '[' || k === '<' || k === ',') doiToc(-1);
      else if (k === ']' || k === '>' || k === '.') doiToc(1);
      else if (k === 'f' || k === 'F') toanManHinh();
      else if (k === 'Escape') { if (!document.fullscreenElement) dong(); }
      else xong = false;
      if (xong) e.preventDefault();
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  });

  const src = m ? m[ban] : null;
  const cauVi = batVi ? cauTaiThoiDiem(pdVi, t) : null;
  const cauGoc = batGoc ? cauTaiThoiDiem(pdGoc, t) : null;

  return (
    <div className="trinh-phat-nen" role="dialog" aria-modal="true" aria-label="Trình phát">
      <div className="dau">
        <b>{m?.tieuDe ?? '…'}</b>
        <button className="nut nho" onClick={dong}>{Icon.dong(16)} Đóng <kbd>Esc</kbd></button>
      </div>
      <div className="khung-video" ref={khung} onDoubleClick={toanManHinh}>
        {src && (
          <video
            ref={video}
            key={src}
            src={src}
            controls
            controlsList="nofullscreen nodownload"
            disablePictureInPicture
            autoPlay={!viTriCho.current}
            onLoadedMetadata={khiNapXong}
            onTimeUpdate={(e) => datT(e.currentTarget.currentTime)}
            onSeeked={(e) => datT(e.currentTarget.currentTime)}
          />
        )}
        {m && !src && <div style={{ color: '#a2a8c0' }}>Không tìm thấy tệp video trong thư mục này.</div>}
        <div className="phu-de" aria-live="off">
          {cauGoc && <span className="goc">{cauGoc.chu}</span>}
          {cauVi && <span>{cauVi.chu}</span>}
        </div>
      </div>
      <div className="dieu-khien">
        <div className="phan-doan" role="group" aria-label="Bản tiếng">
          <button aria-pressed={ban === 'vi'} disabled={!m?.vi} onClick={() => doiBan('vi')}>Chỉ giọng Việt</button>
          <button aria-pressed={ban === 'viGoc'} disabled={!m?.viGoc} onClick={() => doiBan('viGoc')}>Giữ giọng gốc</button>
        </div>
        <div className="phan-doan" role="group" aria-label="Phụ đề">
          <button aria-pressed={batVi} disabled={!pdVi.length} onClick={() => datBatVi(!batVi)}>Phụ đề Việt</button>
          <button aria-pressed={batGoc} disabled={!pdGoc.length} onClick={() => datBatGoc(!batGoc)}>Phụ đề gốc</button>
        </div>
        <button className="nut nho" onClick={() => tua(-10)} aria-label="Lùi 10 giây">{Icon.lui10(18)}</button>
        <button className="nut nho" onClick={() => tua(10)} aria-label="Tới 10 giây">{Icon.toi10(18)}</button>
        <select value={toc} onChange={(e) => datToc(Number(e.target.value))} aria-label="Tốc độ">
          {TOC_DO.map((x) => <option key={x} value={x}>{String(x).replace('.', ',')}×</option>)}
        </select>
        <button className="nut nho" onClick={toanManHinh} aria-label="Toàn màn hình">{Icon.toanManHinh(16)}</button>
        <span className="gian" />
        <span className="phim-tat">
          <kbd>Space</kbd> phát/dừng · <kbd>←</kbd><kbd>→</kbd> ±10 s · <kbd>V</kbd> đổi giọng · <kbd>C</kbd>/<kbd>O</kbd> phụ đề · <kbd>[</kbd><kbd>]</kbd> tốc độ · <kbd>F</kbd> toàn màn hình
        </span>
      </div>
    </div>
  );
}
