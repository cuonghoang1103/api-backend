/**
 * Khu "Nổi bật" đầu trang Trò chơi (08/10/2026): băng chuyền tự chạy kiểu
 * cửa hàng — Flying Pencil chiếm khung lớn, kèm Đối kháng realtime; bên phải
 * hai ô nhỏ (Màn 2 Midway sắp ra mắt · vào trang Flying Pencil).
 */
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clapperboard, Swords, Users } from 'lucide-react';
import { useAppState } from '../../../app-state';
import { useDich } from '../../../i18n';
import { FP, chu, coChu } from './duLieu';
import { NutHanhDong } from './NutHanhDong';
import { useCaiGame } from './useCaiGame';
import './flyingPencil.css';

export function KhuNoiBat() {
  const { navigate } = useAppState();
  const { nn } = useDich();
  const en = nn === 'en';
  const g = useCaiGame(FP.ma);
  const [i, setI] = useState(0);
  const [dung, setDung] = useState(false);
  const SO = 2;

  useEffect(() => {
    if (dung) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % SO), 8000);
    return () => clearInterval(id);
  }, [dung]);

  const ban = g.tt?.banMoi;

  return (
    <section className="ct-fp-noi-bat" onPointerEnter={() => setDung(true)} onPointerLeave={() => setDung(false)}>
      <h2 className="ct-fp-nb-tieu-de">{en ? 'Featured' : 'Nổi bật'}</h2>
      <div className="ct-fp-nb-luoi">
        <div className="ct-fp-nb-bang">
          <div className="ct-fp-nb-truot" style={{ transform: `translateX(-${i * 100}%)` }}>
            {/* ── Slide 1: Flying Pencil ── */}
            <article className="ct-fp-nb-the" aria-hidden={i !== 0}>
              <button type="button" className="ct-fp-nb-nen" onClick={() => navigate(FP.duong)} tabIndex={i === 0 ? 0 : -1} aria-label={FP.ten}>
                <img src={FP.anhBia} alt="" />
              </button>
              <div className="ct-fp-nb-chu">
                <span className="ct-fp-huy-hieu"><Clapperboard size={13} /> {en ? 'New · Preview' : 'Mới · Bản thử'}</span>
                <h3>{FP.ten}</h3>
                <p className="ct-fp-nb-phu">{chu(FP.phuDe, nn)}</p>
                <p className="ct-fp-nb-mo-ta">{chu(FP.moTaNgan, nn)}</p>
                <div className="ct-fp-nb-hanh-dong">
                  <NutHanhDong g={g} nn={nn} />
                  <button type="button" className="ct-fp-nut-phu" data-loai="sang" onClick={() => navigate(FP.duong)}>
                    {en ? 'View store page' : 'Xem trang game'} <ChevronRight size={14} />
                  </button>
                </div>
                <p className="ct-fp-nb-meta">
                  macOS · Apple Silicon{ban ? ` · ${coChu(ban.size, nn)} · ${ban.version}` : ''}
                </p>
              </div>
            </article>
            {/* ── Slide 2: Đối kháng ── */}
            <article className="ct-fp-nb-the" data-loai="doi-khang" aria-hidden={i !== 1}>
              <div className="ct-fp-nb-nen ct-fp-nb-nen-mau" aria-hidden="true">
                <span>♟</span><span>♞</span><span>帥</span><span>♠</span><span>✕</span><span>◯</span>
              </div>
              <div className="ct-fp-nb-chu">
                <span className="ct-fp-huy-hieu" data-mau="xanh"><Users size={13} /> {en ? 'Realtime' : 'Chơi cùng người thật'}</span>
                <h3>{en ? 'Head-to-head' : 'Đối kháng'}</h3>
                <p className="ct-fp-nb-phu">{en ? 'Chess · Xiangqi · Tiến lên · Gomoku — with Elo' : 'Cờ vua · Cờ tướng · Tiến lên · Caro — có Elo'}</p>
                <p className="ct-fp-nb-mo-ta">{en ? 'Open a room, invite a friend or get matched, climb the rating table.' : 'Mở phòng, mời bạn hoặc ghép trận ngẫu nhiên, leo bảng xếp hạng Elo.'}</p>
                <div className="ct-fp-nb-hanh-dong">
                  <button type="button" className="ct-fp-nut" data-loai="choi" onClick={() => navigate('/games/doi-khang')} tabIndex={i === 1 ? 0 : -1}>
                    <Swords size={18} /> {en ? 'Enter lobby' : 'Vào sảnh'}
                  </button>
                </div>
              </div>
            </article>
          </div>
          <button type="button" className="ct-fp-nb-mui" data-ben="trai" onClick={() => setI((x) => (x - 1 + SO) % SO)} aria-label="Trước"><ChevronLeft size={20} /></button>
          <button type="button" className="ct-fp-nb-mui" data-ben="phai" onClick={() => setI((x) => (x + 1) % SO)} aria-label="Sau"><ChevronRight size={20} /></button>
          <div className="ct-fp-nb-cham">
            {Array.from({ length: SO }, (_, k) => (
              <button key={k} type="button" data-chon={k === i || undefined} onClick={() => setI(k)} aria-label={`${k + 1}`} />
            ))}
          </div>
        </div>

        <div className="ct-fp-nb-ben">
          <button type="button" className="ct-fp-nb-o" onClick={() => navigate(FP.duong)}>
            <img src={FP.anhMidway} alt="" loading="lazy" />
            <span className="ct-fp-nb-o-chu">
              <em>{en ? 'Coming soon' : 'Sắp ra mắt'}</em>
              <b>{en ? 'Mission 2 — Midway 1942' : 'Màn 2 — Midway 1942'}</b>
              <small>{en ? 'Carrier battle · Flying Pencil' : 'Hải chiến tàu sân bay · Flying Pencil'}</small>
            </span>
          </button>
          <button type="button" className="ct-fp-nb-o" data-loai="doi-khang" onClick={() => navigate('/games/doi-khang')}>
            <span className="ct-fp-nb-o-mau" aria-hidden="true">♞</span>
            <span className="ct-fp-nb-o-chu">
              <em>{en ? 'Live now' : 'Đang mở'}</em>
              <b>{en ? 'Head-to-head lobby' : 'Sảnh đối kháng'}</b>
              <small>{en ? 'Play a friend in real time' : 'Chơi với bạn bè theo thời gian thực'}</small>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
