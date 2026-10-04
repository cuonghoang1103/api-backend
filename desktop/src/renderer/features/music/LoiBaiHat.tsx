/**
 * Lời bài hát — có mốc thời gian thì chạy theo nhạc (karaoke), không thì hiện thường.
 *
 * ⚠️ Bản trước đọc `content`/`lyrics`/`text` — ba trường máy chủ KHÔNG có. Máy
 * chủ trả `{ format, synced: [{t,text}], plain }` (`music-lyrics.service.ts`),
 * nên bài nào có lời cũng hiện "chưa có lời", im lặng. Hình dạng đúng nằm ở
 * `musicApi.ts`.
 *
 * Bấm vào một dòng có mốc thời gian = tua tới đó.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, FileText, PenLine, RotateCcw, Timer, X } from 'lucide-react';
import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';
import { layLoi, type LoiBai } from './musicApi';
import { useMusicPlayer } from './player';

export function LoiBaiHat({ lon = false, choSua = false }: { lon?: boolean; choSua?: boolean }) {
  const { dich } = useDich();
  const { api } = useSession();
  const { current, position, tuaToi } = useMusicPlayer();
  const [loi, setLoi] = useState<LoiBai | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const trackId = current?.id ?? null;
  const khung = useRef<HTMLDivElement>(null);
  const [soan, setSoan] = useState(false);
  const [lanNap, setLanNap] = useState(0);

  useEffect(() => {
    if (!api || trackId === null) { setLoi(null); return; }
    let con = true;
    setDangTai(true);
    setLoi(null);
    void layLoi(api, trackId)
      .then((r) => { if (con) setLoi(r); })
      .catch(() => { if (con) setLoi(null); })
      .finally(() => { if (con) setDangTai(false); });
    return () => { con = false; };
  }, [api, trackId, lanNap]);
  useEffect(() => { setSoan(false); }, [trackId]);

  const dongHienTai = useMemo(() => {
    if (!loi || loi.dong.length === 0) return -1;
    let at = -1;
    for (let i = 0; i < loi.dong.length; i++) {
      if (loi.dong[i]!.t <= position + 0.25) at = i; else break;
    }
    return at;
  }, [loi, position]);

  /* Cuộn dòng đang hát vào GIỮA khung — chỉ cuộn khung lời, không cuộn cả
     trang (`scrollIntoView` sẽ kéo luôn vùng cuộn cha). */
  useEffect(() => {
    const k = khung.current;
    if (!k || dongHienTai < 0) return;
    const el = k.querySelector<HTMLElement>(`[data-i="${dongHienTai}"]`);
    if (!el) return;
    k.scrollTo({ top: el.offsetTop - k.clientHeight / 2 + el.clientHeight / 2, behavior: 'smooth' });
  }, [dongHienTai]);

  if (!current) return <p className="mz-trong-nho">{dich('Chưa phát bài nào.')}</p>;
  if (dangTai) return <p className="mz-trong-nho">{dich('Đang tải lời…')}</p>;
  if (soan) {
    return (
      <SoanLoi
        trackId={current.id}
        banDau={loi?.thuong ?? loi?.dong.map((d) => d.text).join('\n') ?? ''}
        onXong={() => { setSoan(false); setLanNap((n) => n + 1); }}
        onHuy={() => setSoan(false)}
      />
    );
  }
  const nutSoan = choSua && (
    <button type="button" className="mz-nut mz-nut-trong mz-nut-gon mz-loi-sua" onClick={() => setSoan(true)}>
      <PenLine size={13} aria-hidden /> {loi ? dich('Sửa / căn lại lời') : dich('Dán lời & căn thời gian')}
    </button>
  );
  if (!loi) {
    return (
      <div className="mz-trong-nho">
        <FileText size={22} aria-hidden />
        <p>{dich('Bài này chưa có lời.')}{choSua ? ` ${dich('Nếu đây là bài bạn có quyền (tự sáng tác, bản phối của bạn…), dán lời vào rồi bấm theo nhạc để căn từng dòng — app sẽ chạy lời kiểu karaoke.')}` : ''}</p>
        {nutSoan}
      </div>
    );
  }

  if (loi.dong.length === 0) {
    return <div className={`mz-loi${lon ? ' mz-loi-lon' : ''}`} ref={khung}>{nutSoan}<pre className="mz-loi-thuong">{loi.thuong}</pre></div>;
  }

  return (
    <div className={`mz-loi${lon ? ' mz-loi-lon' : ''}`} ref={khung}>
      {nutSoan}
      {loi.dong.map((d, i) => (
        <button
          key={i}
          type="button"
          data-i={i}
          className="mz-loi-dong"
          data-trang={i === dongHienTai ? 'dang' : i < dongHienTai ? 'qua' : 'toi'}
          onClick={() => tuaToi(d.t)}
        >
          {d.text || '♪'}
        </button>
      ))}
    </div>
  );
}

/**
 * Soạn lời + CĂN THỜI GIAN BẰNG TAY (kiểu trình soạn LRC).
 *
 * ⛔ Chỉ cho lời mà NGƯỜI DÙNG có quyền — app không tự trích hay sinh lời bài
 * hát thương mại. Ô xác nhận là bắt buộc trước khi lưu.
 *
 * Căn: bật nhạc, mỗi lần câu nào BẮT ĐẦU hát thì bấm "Đánh dấu" (hoặc Enter khi
 * nút đang chọn) — app ghi đúng giây đang phát cho dòng đó. Không dùng AI hay
 * nhận dạng giọng nói: mốc là do chính người nghe bấm, nên khớp đúng tai họ.
 */
function SoanLoi({ trackId, banDau, onXong, onHuy }: { trackId: number; banDau: string; onXong: () => void; onHuy: () => void }) {
  const { dich, dichP } = useDich();
  const { api } = useSession();
  const { position, playing, toggle, tuaToi } = useMusicPlayer();
  const [chu, setChu] = useState(banDau);
  const [coQuyen, setCoQuyen] = useState(false);
  const [buoc, setBuoc] = useState<'dan' | 'can'>('dan');
  const [moc, setMoc] = useState<number[]>([]);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const dong = chu.split('\n').map((d) => d.trim()).filter(Boolean);

  const luu = async (dongCoMoc: boolean) => {
    if (!api || !coQuyen) return;
    setDangLuu(true);
    setLoi(null);
    try {
      await api.request(`/api/v1/music/tracks/${trackId}/lyrics`, {
        method: 'PUT',
        body: dongCoMoc
          ? { synced: dong.map((text, i) => ({ t: Math.round((moc[i] ?? 0) * 100) / 100, text })), plain: dong.join('\n') }
          : { plain: dong.join('\n') },
      });
      onXong();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangLuu(false);
    }
  };

  if (buoc === 'can') {
    const i = moc.length;
    return (
      <div className="mz-soan">
        <p className="mz-kg-giai">{dich('Bấm “Đánh dấu” đúng lúc mỗi dòng BẮT ĐẦU được hát. Sai thì lùi một dòng.')}</p>
        <ol className="mz-soan-ds">
          {dong.map((d, k) => (
            <li key={k} data-trang={k < i ? 'qua' : k === i ? 'dang' : 'toi'}>
              <span>{moc[k] !== undefined ? clockLoi(moc[k]!) : '--:--'}</span>{d}
            </li>
          ))}
        </ol>
        <div className="mz-soan-nut">
          {!playing && <button type="button" className="mz-nut mz-nut-gon" onClick={toggle}>{dich('Phát nhạc')}</button>}
          <button
            type="button"
            className="mz-nut mz-nut-chinh mz-nut-gon"
            disabled={i >= dong.length}
            onClick={() => setMoc((m) => [...m, Math.max(m[m.length - 1] ?? 0, position)])}
          >
            <Timer size={13} aria-hidden /> {dichP('Đánh dấu dòng {n}', { n: Math.min(i + 1, dong.length) })}
          </button>
          <button type="button" className="mz-nut mz-nut-gon" disabled={i === 0} onClick={() => { const m = moc.slice(0, -1); setMoc(m); tuaToi(Math.max(0, (m[m.length - 1] ?? 0) - 1)); }}>
            <RotateCcw size={13} aria-hidden /> {dich('Lùi một dòng')}
          </button>
          <button type="button" className="mz-nut mz-nut-gon" disabled={i < dong.length || dangLuu} onClick={() => void luu(true)}>
            <Check size={13} aria-hidden /> {dich('Lưu lời karaoke')}
          </button>
          <button type="button" className="mz-nut-nho" onClick={() => { setBuoc('dan'); setMoc([]); }} aria-label={dich('Quay lại')}><X size={13} aria-hidden /></button>
        </div>
        {loi && <p className="mz-kg-giai mz-loi-do">{loi}</p>}
      </div>
    );
  }

  return (
    <div className="mz-soan">
      <textarea
        value={chu}
        onChange={(e) => setChu(e.target.value)}
        placeholder={dich('Dán lời vào đây — mỗi câu một dòng.')}
        rows={10}
        aria-label={dich('Lời bài hát')}
      />
      <label className="mz-soan-quyen">
        <input type="checkbox" checked={coQuyen} onChange={(e) => setCoQuyen(e.target.checked)} />
        <span>{dich('Tôi có quyền dùng lời này (tự sáng tác, bản phối của tôi, hoặc đã được phép). App không tự lấy lời của bài hát thương mại.')}</span>
      </label>
      <div className="mz-soan-nut">
        <button type="button" className="mz-nut mz-nut-chinh mz-nut-gon" disabled={!coQuyen || dong.length === 0} onClick={() => { setMoc([]); setBuoc('can'); tuaToi(0); }}>
          <Timer size={13} aria-hidden /> {dich('Căn thời gian theo nhạc')}
        </button>
        <button type="button" className="mz-nut mz-nut-gon" disabled={!coQuyen || dong.length === 0 || dangLuu} onClick={() => void luu(false)}>
          {dich('Lưu lời thường')}
        </button>
        <button type="button" className="mz-nut mz-nut-trong mz-nut-gon" onClick={onHuy}>{dich('Huỷ')}</button>
      </div>
      {loi && <p className="mz-kg-giai mz-loi-do">{loi}</p>}
    </div>
  );
}

function clockLoi(g: number): string {
  return `${Math.floor(g / 60)}:${String(Math.floor(g % 60)).padStart(2, '0')}.${String(Math.floor((g % 1) * 10))}`;
}
