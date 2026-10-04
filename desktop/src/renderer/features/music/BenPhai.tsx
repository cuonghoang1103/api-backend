/**
 * Cột phải của trang Nhạc: bài đang phát + ba thẻ Tiếp theo · Lời · Không gian.
 *
 * Tách khỏi vùng giữa để người đang duyệt thư viện vẫn thấy hàng chờ và lời mà
 * không phải mở một màn khác — kiểu bố cục của mọi app nghe nhạc trên máy tính.
 */
import { useState } from 'react';
import { FileText, Heart, ListMusic, Maximize2, Sparkles, X } from 'lucide-react';
import { useDich } from '../../i18n';
import { AnhBia } from './dungChung';
import { KhongGianPanel } from './KhongGianPanel';
import { LoiBaiHat } from './LoiBaiHat';
import { clock, useMusicPlayer } from './player';

export type TheBenPhai = 'hang' | 'loi' | 'kg';

export function BenPhai({ the, setThe, onMoThuGian }: {
  the: TheBenPhai;
  setThe: (t: TheBenPhai) => void;
  onMoThuGian: () => void;
}) {
  const { dich, dichP } = useDich();
  const { current, playing, daThich, doiThich, tiepTheo, playTrack, boKhoiHang } = useMusicPlayer();
  const [nhieu, setNhieu] = useState(false);
  const thich = current ? daThich.has(current.id) : false;
  const hienHang = nhieu ? tiepTheo.slice(0, 100) : tiepTheo.slice(0, 25);

  return (
    <aside className="mz-ben" aria-label={dich('Đang phát và hàng chờ')}>
      {current ? (
        <div className="mz-ben-dang" data-phat={playing}>
          {current.coverImage && <div className="mz-ben-loang" style={{ backgroundImage: `url(${current.coverImage})` }} aria-hidden />}
          <div className="mz-ben-bia">
            <AnhBia src={current.coverImage} co={248} />
          </div>
          <div className="mz-ben-ten-hang">
            <div className="mz-ben-chu">
              <strong title={current.title}>{current.title}</strong>
              <span>{current.artist || dich('Không rõ nghệ sĩ')}</span>
            </div>
            <button
              type="button"
              className="mz-tim mz-tim-lon"
              data-on={thich}
              onClick={() => void doiThich(current)}
              aria-pressed={thich}
              aria-label={thich ? dich('Bỏ thích') : dich('Thích')}
            >
              <Heart size={18} aria-hidden fill={thich ? 'currentColor' : 'none'} />
            </button>
          </div>
          <button type="button" className="mz-nut mz-nut-mo" onClick={onMoThuGian}>
            <Maximize2 size={14} aria-hidden /> {dich('Chế độ thư giãn')} <kbd>F</kbd>
          </button>
        </div>
      ) : (
        <div className="mz-ben-dang mz-ben-chua">
          <Sparkles size={22} aria-hidden />
          <p>{dich('Chọn một bài để bắt đầu. Hàng chờ, lời và không gian thư giãn sẽ hiện ở đây.')}</p>
        </div>
      )}

      <div className="mz-ben-the" role="tablist">
        {([
          ['hang', dich('Tiếp theo'), <ListMusic size={13} aria-hidden key="i" />],
          ['loi', dich('Lời'), <FileText size={13} aria-hidden key="i" />],
          ['kg', dich('Không gian'), <Sparkles size={13} aria-hidden key="i" />],
        ] as [TheBenPhai, string, JSX.Element][]).map(([ma, nhan, icon]) => (
          <button key={ma} type="button" role="tab" aria-selected={the === ma} data-on={the === ma} onClick={() => setThe(ma)}>
            {icon}{nhan}
          </button>
        ))}
      </div>

      <div className="mz-ben-than">
        {the === 'hang' && (
          tiepTheo.length === 0 ? (
            <p className="mz-trong-nho">{current ? dich('Hết hàng chờ — bài này là bài cuối.') : dich('Hàng chờ đang trống.')}</p>
          ) : (
            <ol className="mz-hang">
              {hienHang.map((t, i) => (
                <li key={`${t.id}-${i}`} className="mz-hang-dong">
                  <button type="button" className="mz-hang-bam" onClick={() => playTrack(t)} title={dich('Phát ngay')}>
                    <AnhBia src={t.coverImage} co={34} />
                    <span className="mz-hang-chu">
                      <span>{t.title}</span>
                      <small>{t.artist || dich('Không rõ nghệ sĩ')} · {clock(t.durationSeconds)}</small>
                    </span>
                  </button>
                  <button type="button" className="mz-nut-nho" onClick={() => boKhoiHang(t.id)} aria-label={dich('Bỏ khỏi hàng chờ')} title={dich('Bỏ khỏi hàng chờ')}>
                    <X size={13} aria-hidden />
                  </button>
                </li>
              ))}
              {tiepTheo.length > hienHang.length && (
                <li>
                  <button type="button" className="mz-linklike" onClick={() => setNhieu(true)}>
                    {dichP('Xem thêm {n} bài', { n: tiepTheo.length - hienHang.length })}
                  </button>
                </li>
              )}
            </ol>
          )
        )}
        {the === 'loi' && <LoiBaiHat choSua />}
        {the === 'kg' && <KhongGianPanel gon />}
      </div>
    </aside>
  );
}
