/**
 * Bảng "Không gian": âm thanh nền · bộ chỉnh âm · hẹn giờ tắt.
 *
 * Ba thứ biến một danh sách bài hát thành chỗ để THƯ GIÃN. Cả ba đều sống ngoài
 * trang (provider / module), nên bật ở đây rồi đi trang khác vẫn chạy tiếp.
 */
import { CloudRain, Flame, Moon, Sliders, Waves, Wind, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useDich } from '../../i18n';
import { useKhongGian } from './dungChung';
import { datMucKhongGian, doiKhongGian, type MaKhongGian } from './khongGian';
import { GIAY_NHO_DAN, useMusicPlayer, type MaEq } from './player';

export function KhongGianPanel({ gon = false }: { gon?: boolean }) {
  const { dich, dichP } = useDich();
  const muc = useKhongGian();
  const { eq, datEq, eqDuoc, henGio, henGioConLai, datHenGio, current } = useMusicPlayer();

  const AM: { ma: MaKhongGian; ten: string; icon: ReactNode }[] = [
    { ma: 'mua', ten: dich('Mưa nhẹ'), icon: <CloudRain size={16} aria-hidden /> },
    { ma: 'song', ten: dich('Sóng biển'), icon: <Waves size={16} aria-hidden /> },
    { ma: 'nau', ten: dich('Ồn nâu (tập trung)'), icon: <Wind size={16} aria-hidden /> },
    { ma: 'lua', ten: dich('Lửa trại'), icon: <Flame size={16} aria-hidden /> },
  ];
  const EQ: { ma: MaEq; ten: string }[] = [
    { ma: 'phang', ten: dich('Nguyên bản') },
    { ma: 'dem', ten: dich('Dịu tai về đêm') },
    { ma: 'tram', ten: dich('Trầm ấm') },
    { ma: 'giong', ten: dich('Giọng hát rõ') },
    { ma: 'sang', ten: dich('Trong trẻo') },
  ];
  const HEN = [15, 30, 45, 60, 90];

  const chuHen = henGio === 'het-bai'
    ? dich('Nhạc tắt khi hết bài này')
    : dichP('Nhạc tắt sau {t}', { t: `${Math.floor(henGioConLai / 60)}:${String(henGioConLai % 60).padStart(2, '0')}` });

  return (
    <div className="mz-kg" data-gon={gon}>
      <section className="mz-kg-khoi">
        <h4><Wind size={14} aria-hidden /> {dich('Âm thanh nền')}</h4>
        <p className="mz-kg-giai">{dich('Nhiễu đã lọc, sinh ngay trên máy — trộn cùng nhạc hoặc nghe riêng.')}</p>
        <div className="mz-kg-am">
          {AM.map((a) => {
            const v = muc[a.ma];
            return (
              <div key={a.ma} className="mz-kg-dong" data-on={v > 0}>
                <button
                  type="button"
                  className="mz-kg-bat"
                  onClick={() => doiKhongGian(a.ma)}
                  aria-pressed={v > 0}
                  title={v > 0 ? dich('Tắt') : dich('Bật')}
                >
                  {a.icon}
                  <span>{a.ten}</span>
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(v * 100)}
                  onChange={(e) => datMucKhongGian(a.ma, Number(e.target.value) / 100)}
                  className="mz-truot"
                  style={{ ['--p' as string]: `${Math.round(v * 100)}%` }}
                  aria-label={dichP('Âm lượng {ten}', { ten: a.ten })}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mz-kg-khoi">
        <h4><Sliders size={14} aria-hidden /> {dich('Chỉnh âm')}</h4>
        <div className="mz-chip-hang">
          {EQ.map((e) => (
            <button
              key={e.ma}
              type="button"
              className="mz-chip"
              data-on={eq === e.ma}
              onClick={() => datEq(e.ma)}
              disabled={!eqDuoc}
            >
              {e.ten}
            </button>
          ))}
        </div>
        {!eqDuoc && (
          <p className="mz-kg-giai">{dich('Nguồn nhạc này không cho xử lý âm thanh, nên chỉnh âm tạm tắt. Mở lại app là dùng lại được.')}</p>
        )}
        {eqDuoc && !current && <p className="mz-kg-giai">{dich('Áp dụng từ bài phát tiếp theo.')}</p>}
      </section>

      <section className="mz-kg-khoi">
        <h4><Moon size={14} aria-hidden /> {dich('Hẹn giờ tắt nhạc')}</h4>
        <div className="mz-chip-hang">
          {HEN.map((p) => (
            <button
              key={p}
              type="button"
              className="mz-chip"
              data-on={typeof henGio === 'number' && Math.abs(henGioConLai - p * 60) < 60}
              onClick={() => datHenGio(p)}
            >
              {dichP('{n} phút', { n: p })}
            </button>
          ))}
          <button type="button" className="mz-chip" data-on={henGio === 'het-bai'} onClick={() => datHenGio('het-bai')}>
            {dich('Hết bài này')}
          </button>
        </div>
        {henGio !== null ? (
          <div className="mz-kg-hen">
            <Moon size={13} aria-hidden />
            <span>{chuHen}</span>
            <button type="button" className="mz-nut-nho" onClick={() => datHenGio(null)} aria-label={dich('Huỷ hẹn giờ')} title={dich('Huỷ hẹn giờ')}>
              <X size={13} aria-hidden />
            </button>
          </div>
        ) : (
          <p className="mz-kg-giai">{dichP('Nhạc nhỏ dần {n} giây cuối rồi mới dừng — vẫn chạy khi bạn rời trang này.', { n: GIAY_NHO_DAN })}</p>
        )}
      </section>
    </div>
  );
}
