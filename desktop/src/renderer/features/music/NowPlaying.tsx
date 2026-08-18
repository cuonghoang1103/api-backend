/**
 * Màn hình ĐANG PHÁT toàn cảnh — bản của app, lấy ý từ trang now-playing của web.
 *
 * Bốn thẻ: NGHE · LỜI · THÔNG TIN · CHIA SẺ. Nó KHÔNG dựng trình phát riêng —
 * vẫn là thẻ <audio> duy nhất ở `player.tsx`, nên mở/đóng màn này không làm
 * nhạc ngắt một nhịp, và tua ở đây với tua ở thanh dưới là cùng một chỗ.
 *
 * Dải nhịp là TRANG TRÍ, cố ý không phải phổ tần thật: muốn phổ thật phải đưa
 * audio qua Web Audio, mà luồng nhạc khác nguồn gốc với `app://` — làm vậy có
 * thể khiến cả bài phát ra IM LẶNG. (Bàn DJ ở tab Remix thì có phổ THẬT, vì nó
 * nạp nhạc theo đường khác hẳn — xem `RemixDeck.tsx`.)
 */
import { useEffect, useState } from 'react';
import {
  ArrowLeft, Check, Copy, Download, ExternalLink, FileText, Info, ListPlus,
  Music2, Pause, Play, Radio, Repeat, Repeat1, Share2, Shuffle, SkipBack, SkipForward,
} from 'lucide-react';
import { useSession } from '../../auth/session';
import { clock, laBaiYouTube, useMusicPlayer } from './player';
import { layDanhSachPlaylist, themBaiVaoPlaylist, type Playlist } from './playlists';

type The = 'nghe' | 'loi' | 'tin' | 'chia-se';

const WEB = 'https://cuongthai.com/music';

export function NowPlaying({ onDong, onDaThemVaoPlaylist }: { onDong: () => void; onDaThemVaoPlaylist: () => void }) {
  const { api } = useSession();
  const {
    current, playing, length, shownPosition, position,
    toggle, step, batDauTua, downloaded,
    shuffle, setShuffle, repeat, setRepeat, tracks,
  } = useMusicPlayer();

  const [the, setThe] = useState<The>('nghe');
  const [loi, setLoi] = useState<string | null>(null);
  const [dangTaiLoi, setDangTaiLoi] = useState(false);
  const [danhSachPl, setDanhSachPl] = useState<Playlist[]>([]);
  const [daChep, setDaChep] = useState(false);
  const [thongBao, setThongBao] = useState<string | null>(null);

  const trackId = current?.id ?? null;

  // Lời bài hát: chỉ hỏi khi người dùng thật sự mở thẻ LỜI. Nạp sẵn cho mọi bài
  // là hàng chục lời gọi mà gần như không ai đọc.
  useEffect(() => {
    if (the !== 'loi' || !api || trackId === null) return;
    let con = true;
    setDangTaiLoi(true);
    setLoi(null);
    void api.request<unknown>(`/api/v1/music/tracks/${trackId}/lyrics`)
      .then((ket) => {
        if (!con) return;
        const o = ket as { content?: string; lyrics?: string; text?: string } | null;
        setLoi(o?.content ?? o?.lyrics ?? o?.text ?? null);
      })
      .catch(() => { if (con) setLoi(null); })
      .finally(() => { if (con) setDangTaiLoi(false); });
    return () => { con = false; };
  }, [the, api, trackId]);

  useEffect(() => {
    if (the !== 'chia-se' || !api) return;
    void layDanhSachPlaylist(api).then(setDanhSachPl).catch(() => setDanhSachPl([]));
  }, [the, api]);

  if (!current) return null;

  const chiSo = tracks.findIndex((t) => t.id === current.id);
  const progress = length > 0 ? Math.min(100, (shownPosition / length) * 100) : 0;
  const daTai = downloaded.has(current.id);

  const chep = (chu: string) => {
    void navigator.clipboard.writeText(chu).then(() => {
      setDaChep(true);
      setTimeout(() => setDaChep(false), 2000);
    });
  };

  const themVao = async (p: Playlist) => {
    if (!api) return;
    try {
      await themBaiVaoPlaylist(api, p.id, current.id);
      setThongBao(`Đã thêm vào “${p.name}”.`);
      onDaThemVaoPlaylist();
      setTimeout(() => setThongBao(null), 2600);
    } catch (e) {
      setThongBao(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="ct-nowfull">
      {current.coverImage && (
        <div className="ct-nowfull-wash" style={{ backgroundImage: `url(${current.coverImage})` }} aria-hidden />
      )}

      <header className="ct-nowfull-top">
        <button type="button" className="ct-nowfull-back" onClick={onDong}>
          <ArrowLeft size={14} aria-hidden /> QUAY LẠI
        </button>
        <span className="ct-nowfull-eyebrow">ĐANG PHÁT</span>
        <nav className="ct-nowfull-tabs">
          {([
            ['nghe', 'NGHE', <Radio size={13} aria-hidden key="i" />],
            ['loi', 'LỜI', <FileText size={13} aria-hidden key="i" />],
            ['tin', 'THÔNG TIN', <Info size={13} aria-hidden key="i" />],
            ['chia-se', 'CHIA SẺ', <Share2 size={13} aria-hidden key="i" />],
          ] as [The, string, JSX.Element][]).map(([ma, nhan, icon]) => (
            <button
              key={ma}
              type="button"
              className={`ct-nowfull-tab${the === ma ? ' is-on' : ''}`}
              onClick={() => setThe(ma)}
            >
              {icon}{nhan}
            </button>
          ))}
        </nav>
      </header>

      <div className="ct-nowfull-body">
        <div className="ct-nowfull-art-wrap">
          {current.coverImage
            ? <img src={current.coverImage} alt="" className="ct-nowfull-art" />
            : <div className="ct-nowfull-art ct-pl-blank"><Music2 size={54} /></div>}
        </div>

        <h1 className="ct-nowfull-title">{current.title}</h1>
        <p className="ct-nowfull-artist">{current.artist || 'Không rõ nghệ sĩ'}</p>
        <p className="ct-nowfull-meta">
          [{chiSo >= 0 ? chiSo + 1 : '—'} / {tracks.length}] · {clock(length || current.durationSeconds)}
        </p>

        {/* ─── Nội dung theo thẻ ─── */}
        {the === 'nghe' && (
          <div className={`ct-nowfull-eq${playing ? ' is-live' : ''}`} aria-hidden>
            {Array.from({ length: 56 }, (_, i) => (
              <span key={i} style={{ animationDelay: `${(i % 11) * 70}ms` }} />
            ))}
          </div>
        )}

        {the === 'loi' && (
          <div className="ct-nowfull-panel">
            {dangTaiLoi && <p className="ct-muted">Đang tải lời…</p>}
            {!dangTaiLoi && loi && <pre className="ct-nowfull-loi">{loi}</pre>}
            {!dangTaiLoi && !loi && (
              <p className="ct-muted">
                Bài này chưa có lời. Thêm lời trên web (trang Nhạc → bài hát → Lời) thì app hiện luôn.
              </p>
            )}
          </div>
        )}

        {the === 'tin' && (
          <div className="ct-nowfull-panel">
            <dl className="ct-nowfull-tin">
              <dt>Tên bài</dt><dd>{current.title}</dd>
              <dt>Nghệ sĩ</dt><dd>{current.artist || 'Không rõ'}</dd>
              <dt>Thời lượng</dt><dd>{clock(length || current.durationSeconds)}</dd>
              <dt>Mã bài</dt><dd>#{current.id}</dd>
              <dt>Nguồn</dt>
              <dd>{laBaiYouTube(current) ? 'YouTube (chưa rút âm thanh)' : 'Máy chủ CuongThai (R2)'}</dd>
              <dt>Ngoại tuyến</dt>
              <dd>{daTai ? <><Download size={12} aria-hidden /> đã tải về máy này</> : 'chưa tải'}</dd>
            </dl>
          </div>
        )}

        {the === 'chia-se' && (
          <div className="ct-nowfull-panel">
            <div className="ct-nowfull-chiase">
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => chep(`${current.title} — ${current.artist ?? ''}`.trim())}>
                {daChep ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                {daChep ? 'Đã chép' : 'Chép tên bài'}
              </button>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void window.cuongthai?.app.openExternal(WEB)}>
                <ExternalLink size={14} aria-hidden /> Mở trang Nhạc trên web
              </button>
            </div>

            <p className="ct-nowfull-tieude">
              <ListPlus size={14} aria-hidden /> Thêm bài này vào playlist
            </p>
            {danhSachPl.length === 0 ? (
              <p className="ct-muted">Chưa có playlist nào. Tạo một cái ở trang Nhạc.</p>
            ) : (
              <div className="ct-nowfull-chiase">
                {danhSachPl.map((p) => (
                  <button key={p.id} type="button" className="ct-btn ct-btn-ghost" onClick={() => void themVao(p)}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            {thongBao && <p className="ct-muted" style={{ marginTop: 10 }}>{thongBao}</p>}
          </div>
        )}

        {/* ─── Tua + điều khiển ─── */}
        <div className="ct-nowfull-seek">
          <input
            type="range"
            className="ct-seek-bar"
            min={0}
            max={Math.max(1, Math.floor(length))}
            value={Math.floor(shownPosition)}
            style={{ ['--ct-progress' as string]: `${progress}%` }}
            onChange={(e) => batDauTua(Number(e.target.value))}
            aria-label="Tua bài hát"
          />
          <div className="ct-nowfull-time">
            <span>{clock(position)}</span>
            <span>{clock(length)}</span>
          </div>
        </div>

        <div className="ct-nowfull-nut">
          <button
            type="button"
            className={`ct-pbtn${shuffle ? ' is-on' : ''}`}
            onClick={() => setShuffle((s) => !s)}
            aria-label="Phát ngẫu nhiên"
          >
            <Shuffle size={18} aria-hidden />
          </button>
          <button type="button" className="ct-pbtn" onClick={() => step(-1)} aria-label="Bài trước">
            <SkipBack size={22} aria-hidden />
          </button>
          <button type="button" className="ct-pbtn ct-pbtn-to" onClick={toggle} aria-label={playing ? 'Tạm dừng' : 'Phát'}>
            {playing ? <Pause size={26} aria-hidden /> : <Play size={26} aria-hidden />}
          </button>
          <button type="button" className="ct-pbtn" onClick={() => step(1)} aria-label="Bài sau">
            <SkipForward size={22} aria-hidden />
          </button>
          <button
            type="button"
            className={`ct-pbtn${repeat !== 'off' ? ' is-on' : ''}`}
            onClick={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))}
            aria-label="Lặp"
          >
            {repeat === 'one' ? <Repeat1 size={18} aria-hidden /> : <Repeat size={18} aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
