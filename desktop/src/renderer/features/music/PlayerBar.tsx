/**
 * Thanh phát — nằm ở ĐÁY APP, thấy ở mọi trang.
 *
 * Trước đây thanh này nằm trong trang Nhạc, nên rời trang là mất nút tắt: nhạc
 * còn kêu mà không có gì để bấm. Nay nó ở ngoài vùng nội dung, cạnh thanh trạng
 * thái, đúng chỗ Spotify và Apple Music đặt nó — đang đọc Ghi chú vẫn chuyển
 * bài, tua, chỉnh âm lượng được.
 *
 * Không có bài nào thì KHÔNG dựng gì cả (trả `null`), để mọi trang khác giữ
 * nguyên chiều cao như cũ.
 */
import {
  ChevronDown, ChevronUp, Music2, Pause, Play, Repeat, Repeat1, Shuffle,
  SkipBack, SkipForward, Volume1, Volume2, VolumeX,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { clock, useMusicPlayer } from './player';

export function PlayerBar() {
  const { route, navigate, settings, setSetting } = useAppState();
  const {
    current, playing, length, shownPosition,
    toggle, step, batDauTua,
    volume, setVolume, muted, setMuted,
    shuffle, setShuffle, repeat, setRepeat,
  } = useMusicPlayer();

  if (!current) return null;

  const progress = length > 0 ? Math.min(100, (shownPosition / length) * 100) : 0;
  const oTrangNhac = route === '/music';
  const thuGon = settings.playerThuGon === true;

  /* Thu gọn CHỈ đổi phần nhìn — không chạm vào thẻ <audio>, nên nhạc không hề
     ngắt quãng. Và không thu thành ZERO: còn lại một dải mỏng có nút phát, tên
     bài và vạch tiến độ. Ẩn sạch thì nhạc kêu mà không còn gì để bấm, đúng cái
     hỏng vừa sửa hôm nay khi thanh này còn nằm trong trang Nhạc. */
  if (thuGon) {
    return (
      <div className="ct-player" data-thu="true" role="group" aria-label="Điều khiển phát nhạc (đã thu gọn)">
        <span className="ct-player-line" aria-hidden style={{ width: `${progress}%` }} />
        <button
          type="button"
          className="ct-pbtn ct-pbtn-nho"
          onClick={toggle}
          aria-label={playing ? 'Tạm dừng' : 'Phát'}
          title={playing ? 'Tạm dừng' : 'Phát'}
        >
          {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
        </button>
        <button
          type="button"
          className="ct-player-thu-ten"
          onClick={() => { if (!oTrangNhac) navigate('/music'); }}
          title={oTrangNhac ? current.title : `${current.title} — bấm để mở trang Nhạc`}
        >
          {current.title}
          <span className="ct-muted"> · {current.artist || 'Không rõ nghệ sĩ'}</span>
        </button>
        <span className="ct-seek-time">{clock(shownPosition)}</span>
        <button
          type="button"
          className="ct-pbtn ct-pbtn-nho"
          onClick={() => setSetting('playerThuGon', false)}
          aria-label="Mở rộng thanh phát"
          title="Mở rộng thanh phát"
        >
          <ChevronUp size={15} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="ct-player" role="group" aria-label="Điều khiển phát nhạc">
      {/* Bấm vào tên bài để nhảy về trang Nhạc — lối quay lại quen thuộc khi
          đang nghe dở mà đi lang thang chỗ khác. */}
      <button
        type="button"
        className="ct-player-now"
        onClick={() => { if (!oTrangNhac) navigate('/music'); }}
        title={oTrangNhac ? undefined : 'Mở trang Nhạc'}
        style={oTrangNhac ? { cursor: 'default' } : undefined}
      >
        {current.coverImage
          ? <img src={current.coverImage} alt="" className="ct-player-art" />
          : <span className="ct-player-art ct-trk-art-blank"><Music2 size={16} aria-hidden /></span>}
        <span className="ct-player-text">
          <span className="ct-player-title" title={current.title}>{current.title}</span>
          <span className="ct-player-artist">{current.artist || 'Không rõ nghệ sĩ'}</span>
        </span>
      </button>

      <div className="ct-player-mid">
        <div className="ct-player-buttons">
          <button
            type="button"
            className={`ct-pbtn${shuffle ? ' is-on' : ''}`}
            onClick={() => setShuffle((s) => !s)}
            aria-pressed={shuffle}
            aria-label="Phát ngẫu nhiên"
            title="Phát ngẫu nhiên"
          >
            <Shuffle size={15} aria-hidden />
          </button>
          <button type="button" className="ct-pbtn" onClick={() => step(-1)} aria-label="Bài trước" title="Bài trước">
            <SkipBack size={17} aria-hidden />
          </button>
          <button
            type="button"
            className="ct-pbtn ct-pbtn-main"
            onClick={toggle}
            aria-label={playing ? 'Tạm dừng' : 'Phát'}
            title={playing ? 'Tạm dừng (Space)' : 'Phát (Space)'}
          >
            {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
          </button>
          <button type="button" className="ct-pbtn" onClick={() => step(1)} aria-label="Bài sau" title="Bài sau">
            <SkipForward size={17} aria-hidden />
          </button>
          <button
            type="button"
            className={`ct-pbtn${repeat !== 'off' ? ' is-on' : ''}`}
            onClick={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))}
            aria-label={repeat === 'one' ? 'Lặp một bài' : repeat === 'all' ? 'Lặp danh sách' : 'Không lặp'}
            title={repeat === 'one' ? 'Lặp một bài' : repeat === 'all' ? 'Lặp danh sách' : 'Không lặp'}
          >
            {repeat === 'one' ? <Repeat1 size={15} aria-hidden /> : <Repeat size={15} aria-hidden />}
          </button>
        </div>

        <div className="ct-seek">
          <span className="ct-seek-time">{clock(shownPosition)}</span>
          {/* `range` thật chứ không phải div tự vẽ: kéo được bằng bàn phím,
              trình đọc màn hình đọc được, và không phải tự xử lý chuột. */}
          <input
            type="range"
            className="ct-seek-bar"
            min={0}
            max={Math.max(1, Math.floor(length))}
            value={Math.floor(shownPosition)}
            style={{ ['--ct-progress' as string]: `${progress}%` }}
            onChange={(event) => batDauTua(Number(event.target.value))}
            aria-label="Tua bài hát"
          />
          <span className="ct-seek-time">{clock(length)}</span>
        </div>
      </div>

      <div className="ct-player-right">
        <button
          type="button"
          className="ct-pbtn"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
          title={muted ? 'Bật tiếng' : 'Tắt tiếng'}
        >
          {muted || volume === 0 ? <VolumeX size={16} aria-hidden />
            : volume < 0.5 ? <Volume1 size={16} aria-hidden />
              : <Volume2 size={16} aria-hidden />}
        </button>
        <input
          type="range"
          className="ct-vol"
          min={0}
          max={100}
          value={Math.round((muted ? 0 : volume) * 100)}
          style={{ ['--ct-progress' as string]: `${Math.round((muted ? 0 : volume) * 100)}%` }}
          onChange={(event) => { setMuted(false); setVolume(Number(event.target.value) / 100); }}
          aria-label="Âm lượng"
        />
        <button
          type="button"
          className="ct-pbtn"
          onClick={() => setSetting('playerThuGon', true)}
          aria-label="Thu gọn thanh phát"
          title="Thu gọn — nhạc vẫn phát bình thường"
        >
          <ChevronDown size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
