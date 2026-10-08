/**
 * Trang cửa hàng Flying Pencil (08/10/2026) — kiểu Steam / App Store.
 *
 * Bố cục: khung xem lớn (video highlight tự phát KHÔNG tiếng, vòng lặp; nút bật
 * tiếng / toàn màn hình) + băng chuyền ảnh (nhãn "Cảnh phim" / "Trong game",
 * bấm để phóng to) · cột phải dính: bìa, tên, nhãn, phiên bản, NÚT HÀNH ĐỘNG ·
 * dưới: giới thiệu, tính năng, nhật ký, lộ trình | cấu hình, phím, ghi công.
 *
 * Ảnh/video lớn đến từ `phien_ban.json` (release), không nằm trong bó app.
 * Video chỉ gắn `src` khi khung xem lọt vào màn hình (IntersectionObserver) —
 * mở trang không kéo ngay 30 MB.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Anchor, ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Clapperboard, Crosshair, Expand, Film, Gamepad2,
  HardDrive, Keyboard, Maximize2, Radio, Ship, Sparkles, Tag, Volume2, VolumeX, Waves, X,
} from 'lucide-react';
import type { TroChoiMedia } from '../../../../shared/ipc';
import { useAppState } from '../../../app-state';
import { useDich } from '../../../i18n';
import { FP, chu, coChu } from './duLieu';
import { NutHanhDong } from './NutHanhDong';
import { useCaiGame } from './useCaiGame';
import './flyingPencil.css';

const BIEU_TUONG: Record<string, typeof Anchor> = {
  anchor: Anchor, crosshair: Crosshair, ship: Ship, torpedo: Waves, radio: Radio, sparkles: Sparkles,
};

function NhanNguon({ m, en }: { m: TroChoiMedia; en: boolean }) {
  return (
    <span className="ct-fp-nguon" data-nguon={m.nguon}>
      {m.nguon === 'phim' ? <Film size={11} /> : <Gamepad2 size={11} />}
      {m.nguon === 'phim' ? (en ? 'Cinematic' : 'Cảnh phim') : (en ? 'In-game' : 'Trong game')}
    </span>
  );
}

function KhungVideo({ m, en }: { m: TroChoiMedia; en: boolean }) {
  const v = useRef<HTMLVideoElement>(null);
  const khung = useRef<HTMLDivElement>(null);
  const [thay, setThay] = useState(false);
  const [tieng, setTieng] = useState(false);

  useEffect(() => {
    const el = khung.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) setThay(true);
      const vid = v.current;
      if (!vid) return;
      if (e?.isIntersecting) void vid.play().catch(() => {});
      else vid.pause();
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ct-fp-xem-video" ref={khung}>
      <video
        ref={v}
        src={thay ? m.url : undefined}
        poster={m.nho}
        muted={!tieng}
        loop
        playsInline
        autoPlay
        preload="none"
      />
      <div className="ct-fp-xem-nut">
        <button type="button" onClick={() => setTieng((x) => !x)} aria-label={tieng ? (en ? 'Mute' : 'Tắt tiếng') : (en ? 'Unmute' : 'Bật tiếng')}>
          {tieng ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          type="button"
          onClick={() => { void v.current?.requestFullscreen?.().catch(() => {}); }}
          aria-label={en ? 'Fullscreen' : 'Toàn màn hình'}
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}

function HopPhongTo({ ds, i, datI, dong, en }: {
  ds: TroChoiMedia[]; i: number; datI: (i: number) => void; dong: () => void; en: boolean;
}) {
  const m = ds[i];
  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dong();
      if (e.key === 'ArrowRight') datI((i + 1) % ds.length);
      if (e.key === 'ArrowLeft') datI((i - 1 + ds.length) % ds.length);
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  }, [i, ds.length, datI, dong]);
  if (!m) return null;
  return (
    <div className="ct-fp-phong" role="dialog" aria-modal="true" onClick={dong}>
      <button type="button" className="ct-fp-phong-dong" onClick={dong} aria-label={en ? 'Close' : 'Đóng'}><X size={22} /></button>
      <button type="button" className="ct-fp-phong-mui" data-ben="trai" onClick={(e) => { e.stopPropagation(); datI((i - 1 + ds.length) % ds.length); }} aria-label="Trước"><ChevronLeft size={30} /></button>
      <figure onClick={(e) => e.stopPropagation()}>
        {m.loai === 'video'
          ? <video src={m.url} poster={m.nho} controls autoPlay playsInline />
          : <img src={m.url} alt={m.chu ? chu(m.chu, en ? 'en' : 'vi') : ''} />}
        <figcaption>
          <NhanNguon m={m} en={en} />
          {m.chu && <span>{chu(m.chu, en ? 'en' : 'vi')}</span>}
          <span className="ct-fp-phong-dem">{i + 1} / {ds.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="ct-fp-phong-mui" data-ben="phai" onClick={(e) => { e.stopPropagation(); datI((i + 1) % ds.length); }} aria-label="Sau"><ChevronRight size={30} /></button>
    </div>
  );
}

export default function TrangFlyingPencil() {
  const { navigate } = useAppState();
  const { nn } = useDich();
  const en = nn === 'en';
  const g = useCaiGame(FP.ma);
  const ban = g.tt?.banMoi ?? null;

  const media = useMemo<TroChoiMedia[]>(() => {
    const ds = ban?.media ?? [];
    if (ds.length) return ds;
    return [{ loai: 'anh', url: FP.anhBia, nguon: 'game', chu: { vi: 'USS Arizona trúng bom', en: 'USS Arizona hit' } }];
  }, [ban]);
  const [chon, setChon] = useState(0);
  const [phong, setPhong] = useState<number | null>(null);
  const bang = useRef<HTMLDivElement>(null);
  const m = media[Math.min(chon, media.length - 1)]!;

  const cuon = useCallback((huong: number) => {
    bang.current?.scrollBy({ left: huong * (bang.current.clientWidth * 0.8), behavior: 'smooth' });
  }, []);
  useEffect(() => {
    bang.current?.querySelector<HTMLElement>(`[data-i="${chon}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [chon]);

  const nhatKy = ban?.nhatKy ?? [];

  return (
    <div className="ct-fp">
      <button type="button" className="ct-fp-ve" onClick={() => navigate('/games')}>
        <ArrowLeft size={16} /> {en ? 'All games' : 'Trò chơi'}
      </button>

      <header className="ct-fp-tieuDe">
        <div>
          <h1>{FP.ten}</h1>
          <p>{chu(FP.phuDe, nn)}</p>
        </div>
        <span className="ct-fp-huy-hieu"><Clapperboard size={14} /> {en ? 'Preview — Mission 1' : 'Bản thử — Màn 1'}</span>
      </header>

      <div className="ct-fp-tren">
        <section className="ct-fp-xem">
          <div className="ct-fp-xem-chinh">
            {m.loai === 'video'
              ? <KhungVideo key={m.url} m={m} en={en} />
              : (
                <button type="button" className="ct-fp-xem-anh" onClick={() => setPhong(chon)} aria-label={en ? 'Enlarge' : 'Phóng to'}>
                  <img key={m.url} src={m.url} alt="" />
                  <span className="ct-fp-xem-to"><Expand size={16} /></span>
                </button>
              )}
            <div className="ct-fp-xem-nhan">
              <NhanNguon m={m} en={en} />
              {m.chu && <span>{chu(m.chu, nn)}</span>}
            </div>
          </div>
          <div className="ct-fp-bang-vung">
            <button type="button" className="ct-fp-bang-mui" data-ben="trai" onClick={() => cuon(-1)} aria-label="Trước"><ChevronLeft size={18} /></button>
            <div className="ct-fp-bang" ref={bang}>
              {media.map((x, i) => (
                <button
                  key={x.url}
                  type="button"
                  data-i={i}
                  data-chon={i === chon || undefined}
                  className="ct-fp-nho"
                  onClick={() => setChon(i)}
                  onDoubleClick={() => setPhong(i)}
                >
                  <img src={x.nho ?? (x.loai === 'anh' ? x.url : FP.anhBia)} alt="" loading="lazy" />
                  {x.loai === 'video' && <span className="ct-fp-nho-phat"><Film size={14} /></span>}
                  <NhanNguon m={x} en={en} />
                </button>
              ))}
            </div>
            <button type="button" className="ct-fp-bang-mui" data-ben="phai" onClick={() => cuon(1)} aria-label="Sau"><ChevronRight size={18} /></button>
          </div>
        </section>

        <aside className="ct-fp-ben">
          <img className="ct-fp-bia" src={FP.anhBia} alt="" />
          <p className="ct-fp-khau-hieu">{chu(FP.khauHieu, nn)}</p>
          <p className="ct-fp-mo-ta-ngan">{chu(FP.moTaNgan, nn)}</p>
          <div className="ct-fp-nhan">
            {FP.nhan.map((x) => <span key={x.vi}><Tag size={11} /> {chu(x, nn)}</span>)}
          </div>
          <dl className="ct-fp-thong-so">
            <div><dt><Sparkles size={13} /> {en ? 'Version' : 'Phiên bản'}</dt><dd>{ban?.version ?? '—'}</dd></div>
            <div><dt><CalendarDays size={13} /> {en ? 'Updated' : 'Cập nhật'}</dt><dd>{ban?.ngay ?? '—'}</dd></div>
            <div><dt><HardDrive size={13} /> {en ? 'Download' : 'Dung lượng tải'}</dt><dd>{ban ? coChu(ban.size, nn) : '—'}</dd></div>
            {ban?.sizeGiaiNen ? <div><dt><HardDrive size={13} /> {en ? 'Installed' : 'Sau khi cài'}</dt><dd>{coChu(ban.sizeGiaiNen, nn)}</dd></div> : null}
            <div><dt><Gamepad2 size={13} /> {en ? 'Requires' : 'Yêu cầu'}</dt><dd>{ban?.yeuCau ?? 'macOS 13+, Apple Silicon'}</dd></div>
          </dl>
          <NutHanhDong g={g} nn={nn} lon />
        </aside>
      </div>

      <div className="ct-fp-duoi">
        <div className="ct-fp-cot-chinh">
          <section className="ct-fp-khoi">
            <h2>{en ? 'About this game' : 'Giới thiệu'}</h2>
            {(en ? FP.moTaDai.en : FP.moTaDai.vi).map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            {ban?.ghiChu && <p className="ct-fp-ghi-ban">{chu(ban.ghiChu, nn)}</p>}
          </section>

          <section className="ct-fp-khoi">
            <h2>{en ? 'Highlights' : 'Tính năng nổi bật'}</h2>
            <div className="ct-fp-tinh-nang">
              {FP.tinhNang.map((t, i) => {
                const Icon = BIEU_TUONG[t.bieuTuong] ?? Sparkles;
                return (
                  <article key={t.bieuTuong} style={{ ['--i' as string]: i }}>
                    <span className="ct-fp-tn-icon"><Icon size={20} /></span>
                    <h3>{chu(t.ten, nn)}</h3>
                    <p>{chu(t.chu, nn)}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="ct-fp-khoi">
            <h2>{en ? 'Roadmap' : 'Lộ trình'}</h2>
            <ol className="ct-fp-lo-trinh">
              {FP.loTrinh.map((x) => (
                <li key={x.ten.vi} data-tt={x.trangThai}>
                  <span className="ct-fp-lt-moc" />
                  <div>
                    <h3>
                      {chu(x.ten, nn)}
                      {x.trangThai === 'dang' && <em>{en ? 'Coming soon' : 'Sắp ra mắt'}</em>}
                      {x.trangThai === 'xong' && <em data-xong="">{en ? 'Available' : 'Đã có'}</em>}
                    </h3>
                    <p>{chu(x.chu, nn)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="ct-fp-khoi">
            <h2>{en ? 'Changelog' : 'Nhật ký thay đổi'}</h2>
            {nhatKy.length === 0 && <p className="ct-fp-mo">{en ? 'Release notes load with the release info.' : 'Nhật ký tải cùng thông tin phiên bản.'}</p>}
            {nhatKy.map((k) => (
              <div key={k.version} className="ct-fp-nhat-ky">
                <h3>{k.version} <small>{k.ngay}</small></h3>
                <ul>{(en ? k.en : k.vi).map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            ))}
          </section>
        </div>

        <div className="ct-fp-cot-phu">
          <section className="ct-fp-khoi">
            <h2>{en ? 'System requirements' : 'Yêu cầu cấu hình'}</h2>
            <div className="ct-fp-cau-hinh">
              <div>
                <h3>{en ? 'Minimum' : 'Tối thiểu'}</h3>
                <dl>{FP.cauHinh.toiThieu.map((x) => <div key={x.nhan.vi}><dt>{chu(x.nhan, nn)}</dt><dd>{chu(x.gt, nn)}</dd></div>)}</dl>
              </div>
              <div>
                <h3>{en ? 'Recommended' : 'Khuyên dùng'}</h3>
                <dl>{FP.cauHinh.khuyenDung.map((x) => <div key={x.nhan.vi}><dt>{chu(x.nhan, nn)}</dt><dd>{chu(x.gt, nn)}</dd></div>)}</dl>
              </div>
            </div>
          </section>

          <section className="ct-fp-khoi">
            <h2><Keyboard size={16} /> {en ? 'Controls' : 'Điều khiển'}</h2>
            <table className="ct-fp-phim">
              <tbody>
                {FP.dieuKhien.map((d) => (
                  <tr key={d.vi}>
                    <td>{(en ? d.en : d.phim).map((p) => <kbd key={p}>{p}</kbd>)}</td>
                    <td>{en ? d.viEn : d.vi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="ct-fp-khoi">
            <h2>{en ? 'Credits & licenses' : 'Ghi công & giấy phép'}</h2>
            <p className="ct-fp-mo">{chu(FP.ghiCong, nn)}</p>
          </section>
        </div>
      </div>

      {phong !== null && (
        <HopPhongTo ds={media} i={phong} datI={setPhong} dong={() => setPhong(null)} en={en} />
      )}
    </div>
  );
}
