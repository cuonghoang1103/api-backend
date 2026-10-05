/**
 * CHẾ ĐỘ THƯ GIÃN — màn đang phát toàn cảnh.
 *
 * Phủ kín vùng nội dung (vẫn chừa thanh tiêu đề, thanh trạng thái và thanh
 * phát), nền là chính ảnh bìa làm mờ + quầng sáng thở theo nhịp nhạc. Bên phải
 * là lời chạy theo bài, hoặc bảng âm thanh nền nếu bài chưa có lời.
 *
 * Nó KHÔNG dựng trình phát riêng — vẫn là thẻ <audio> duy nhất ở `player.tsx`,
 * nên mở/đóng màn này không làm nhạc ngắt một nhịp.
 *
 * Quầng sáng đọc `mucNhip()` mỗi khung hình và ghi thẳng vào biến CSS, KHÔNG
 * qua state React: 60 lần setState mỗi giây sẽ dựng lại cả màn này. Khi nguồn
 * không có CORS thì `mucNhip()` trả 0 và quầng sáng chỉ thở đều — không giả nhịp.
 */
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, CloudRain, FileText, Flame, Heart, Moon, Pause, Play, Repeat, Repeat1, Shuffle,
  SkipBack, SkipForward, Sparkles, Waves, Wind,
} from 'lucide-react';
import { useDich } from '../../i18n';
import { AnhBia, useKhongGian } from './dungChung';
import { doiKhongGian, type MaKhongGian } from './khongGian';
import { KhongGianPanel } from './KhongGianPanel';
import { LoiBaiHat } from './LoiBaiHat';
import { clock, useMusicPlayer } from './player';

export function NowPlaying({ onDong }: { onDong: () => void }) {
  const { dich } = useDich();
  const {
    current, playing, length, shownPosition, position, toggle, step, batDauTua,
    shuffle, setShuffle, repeat, setRepeat, daThich, doiThich, mucNhip, henGio, henGioConLai,
  } = useMusicPlayer();
  const muc = useKhongGian();
  const [ben, setBen] = useState<'loi' | 'kg'>('loi');
  const [gio, setGio] = useState(() => new Date());
  const goc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setGio(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!playing) { goc.current?.style.setProperty('--nhip', '0'); return; }
    let id = 0;
    const chay = () => {
      goc.current?.style.setProperty('--nhip', mucNhip().toFixed(3));
      id = requestAnimationFrame(chay);
    };
    id = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(id);
  }, [playing, mucNhip]);

  if (!current) return null;
  const progress = length > 0 ? Math.min(100, (shownPosition / length) * 100) : 0;
  const thich = daThich.has(current.id);
  const AM: [MaKhongGian, JSX.Element, string][] = [
    ['mua', <CloudRain size={15} aria-hidden key="i" />, dich('Mưa nhẹ')],
    ['song', <Waves size={15} aria-hidden key="i" />, dich('Sóng biển')],
    ['nau', <Wind size={15} aria-hidden key="i" />, dich('Ồn nâu (tập trung)')],
    ['lua', <Flame size={15} aria-hidden key="i" />, dich('Lửa trại')],
  ];

  return (
    <div className="mz-tg" ref={goc} data-phat={playing} role="dialog" aria-label={dich('Chế độ thư giãn')}>
      {current.coverImage && <div className="mz-tg-loang" style={{ backgroundImage: `url(${current.coverImage})` }} aria-hidden />}
      <div className="mz-tg-quang" aria-hidden />

      <header className="mz-tg-dau">
        <button type="button" className="mz-nut mz-nut-trong" onClick={onDong}>
          <ArrowLeft size={14} aria-hidden /> {dich('Quay lại')} <kbd>Esc</kbd>
        </button>
        <span className="mz-tg-gio">
          {gio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {henGio !== null && (
            <span className="mz-tg-hen" title={dich('Hẹn giờ tắt nhạc')}>
              <Moon size={12} aria-hidden />
              {henGio === 'het-bai' ? dich('Hết bài này') : clock(henGioConLai)}
            </span>
          )}
        </span>
        <span className="mz-tg-am">
          {AM.map(([ma, icon, ten]) => (
            <button key={ma} type="button" data-on={muc[ma] > 0} onClick={() => doiKhongGian(ma)} title={ten} aria-label={ten} aria-pressed={muc[ma] > 0}>
              {icon}
            </button>
          ))}
        </span>
      </header>

      <div className="mz-tg-than">
        <div className="mz-tg-trai">
          <div className="mz-tg-bia">
            <AnhBia src={current.coverImage} co={340} ten={current.title} />
          </div>
          <div className="mz-tg-ten-hang">
            <div>
              <h1 className="mz-tg-ten">{current.title}</h1>
              <p className="mz-tg-nghesi">{current.artist || dich('Không rõ nghệ sĩ')}</p>
            </div>
            <button
              type="button"
              className="mz-tim mz-tim-lon"
              data-on={thich}
              onClick={() => void doiThich(current)}
              aria-pressed={thich}
              aria-label={thich ? dich('Bỏ thích') : dich('Thích')}
            >
              <Heart size={20} aria-hidden fill={thich ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mz-tg-tua">
            <input
              type="range"
              className="mz-truot mz-truot-tua"
              min={0}
              max={Math.max(1, Math.floor(length))}
              value={Math.floor(shownPosition)}
              style={{ ['--p' as string]: `${progress}%` }}
              onChange={(e) => batDauTua(Number(e.target.value))}
              aria-label={dich('Tua bài hát')}
            />
            <div className="mz-tg-thoigian"><span>{clock(position)}</span><span>{clock(length)}</span></div>
          </div>

          <div className="mz-tg-nut">
            <button type="button" className="mz-pbtn" data-on={shuffle} onClick={() => setShuffle((s) => !s)} aria-label={dich('Phát ngẫu nhiên')} title={dich('Phát ngẫu nhiên')}>
              <Shuffle size={18} aria-hidden />
            </button>
            <button type="button" className="mz-pbtn" onClick={() => step(-1)} aria-label={dich('Bài trước')} title={dich('Bài trước')}>
              <SkipBack size={22} aria-hidden />
            </button>
            <button type="button" className="mz-pbtn mz-pbtn-to" onClick={toggle} aria-label={playing ? dich('Tạm dừng') : dich('Phát')}>
              {playing ? <Pause size={28} aria-hidden /> : <Play size={28} aria-hidden />}
            </button>
            <button type="button" className="mz-pbtn" onClick={() => step(1)} aria-label={dich('Bài sau')} title={dich('Bài sau')}>
              <SkipForward size={22} aria-hidden />
            </button>
            <button
              type="button"
              className="mz-pbtn"
              data-on={repeat !== 'off'}
              onClick={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))}
              aria-label={dich('Lặp')}
              title={repeat === 'one' ? dich('Lặp một bài') : repeat === 'all' ? dich('Lặp danh sách') : dich('Không lặp')}
            >
              {repeat === 'one' ? <Repeat1 size={18} aria-hidden /> : <Repeat size={18} aria-hidden />}
            </button>
          </div>
        </div>

        <div className="mz-tg-phai">
          <div className="mz-ben-the mz-tg-the" role="tablist">
            <button type="button" role="tab" data-on={ben === 'loi'} aria-selected={ben === 'loi'} onClick={() => setBen('loi')}>
              <FileText size={13} aria-hidden /> {dich('Lời')}
            </button>
            <button type="button" role="tab" data-on={ben === 'kg'} aria-selected={ben === 'kg'} onClick={() => setBen('kg')}>
              <Sparkles size={13} aria-hidden /> {dich('Không gian')}
            </button>
          </div>
          <div className="mz-tg-noi">
            {ben === 'loi' ? <LoiBaiHat lon /> : <KhongGianPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
