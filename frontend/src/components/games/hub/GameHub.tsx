'use client';

/**
 * Trang chính mục Trò chơi (05/10/2026) — dùng trong app desktop (`/games`) và dùng
 * được cho web. Người dùng dặn: "đẹp và sôi động, có animation… đừng khô khan".
 *
 *  - Đầu trang: nền gradient chuyển động + hình bay, CuongMini 3D vẫy chào (dùng lại
 *    nhân vật Gọi gia sư, tải lười), số liệu sống (số game, lượt chơi).
 *  - Thử thách hôm nay: một game đổi theo ngày (băm ngày → chỉ số), cùng một game cho
 *    mọi người trong ngày để cả nhà đua trên một bảng.
 *  - Lọc theo nhóm (màu riêng mỗi nhóm), thẻ game nghiêng theo chuột + phát sáng,
 *    hiện "kỷ lục của bạn" nếu đã đăng nhập.
 *  - Bảng vàng: người chơi xếp theo tổng kỷ lục đã chuẩn hoá (game.service bangVang).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import TheVaoDoiKhang from '@/components/doiKhang/TheVaoDoiKhang';
import { Trophy, Flame, Sparkles, Play, Clock, Users, Gamepad2, Crown, Medal } from 'lucide-react';
import { gamesApi, type GameDto, type GameCategoryDto, type GameBangVang, type GameStats } from '@/lib/api';
import NhanVat3D, { type CamXuc } from '@/components/sach-hoc/goi/NhanVat3D';
import s from './gameHub.module.css';

const KHO: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
const TEN_NHOM_UU_TIEN = ['memory', 'focus', 'iq-logic', 'strategy', 'relax', 'action', 'math', 'physics', 'arcade', 'skill-training'];

function ngayHomNay() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function bam(chuoi: string) { let h = 0; for (const c of chuoi) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }

function TheGame({ g, kyLuc, i, vi }: { g: GameDto; kyLuc?: number; i: number; vi: boolean }) {
  const mau = g.category.color ?? '#a78bfa';
  // Đọc phần tử qua sự kiện (không dùng ref): Link-shim của app desktop không chuyển ref.
  const nghieng = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const veLai = (e: React.PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
  const choiDuoc = g.status === 'PUBLISHED';
  return (
    <Link
      href={choiDuoc ? `/games/${g.slug}` : '#'}
      className={s.the}
      style={{ ['--m' as string]: mau, ['--i' as string]: i }}
      onPointerMove={nghieng}
      onPointerLeave={veLai}
      data-khoa={!choiDuoc}
      onClick={(e) => { if (!choiDuoc) e.preventDefault(); }}
    >
      <div className={s.anh}>
        {g.coverImage
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={g.coverImage} alt="" loading="lazy" />
          : <div className={s.anhTrong}><Gamepad2 size={42} /></div>}
        <span className={s.nhom}>{vi ? g.category.nameVi ?? g.category.name : g.category.name}</span>
        {g.featured && <span className={s.hot}><Flame size={13} /> Hot</span>}
        {!choiDuoc && <span className={s.sapRa}>{vi ? 'Sắp ra mắt' : 'Coming soon'}</span>}
        <span className={s.nutChoi}><Play size={20} fill="currentColor" /></span>
      </div>
      <div className={s.noiDung}>
        <h3>{vi ? g.titleVi ?? g.title : g.title}</h3>
        <p>{vi ? g.descriptionVi ?? g.description : g.description}</p>
        <div className={s.chan}>
          <span className={s.kho} title={g.difficulty}>{[1, 2, 3].map((k) => <i key={k} data-bat={k <= (KHO[g.difficulty] ?? 1)} />)}</span>
          {g.estimatedTime && <span><Clock size={12} /> {g.estimatedTime}</span>}
          <span><Users size={12} /> {g.playCount}</span>
          {kyLuc != null && kyLuc > 0 && <span className={s.kyLuc}><Trophy size={12} /> {kyLuc.toLocaleString('vi-VN')}</span>}
        </div>
      </div>
      <span className={s.loe} aria-hidden="true" />
    </Link>
  );
}

export default function GameHub({ locale = 'vi' }: { locale?: 'vi' | 'en' }) {
  const vi = locale === 'vi';
  const [games, setGames] = useState<GameDto[] | null>(null);
  const [nhomDs, setNhomDs] = useState<GameCategoryDto[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [bv, setBv] = useState<GameBangVang[]>([]);
  const [kyLuc, setKyLuc] = useState<Record<number, number>>({});
  const [nhom, setNhom] = useState<string>('tat-ca');
  const [loi, setLoi] = useState(false);
  const [cam, setCam] = useState<CamXuc>('chao');
  const mucRef = useRef(0);

  useEffect(() => {
    let con = true;
    Promise.all([gamesApi.list(), gamesApi.categories(), gamesApi.stats()])
      .then(([a, b, c]) => { if (!con) return; setGames(a.data.data); setNhomDs(b.data.data); setStats(c.data.data); })
      .catch(() => { if (con) setLoi(true); });
    gamesApi.bangVang(10).then((r) => con && setBv(r.data.data)).catch(() => {});
    gamesApi.kyLucCuaToi().then((r) => con && setKyLuc(r.data.data)).catch(() => {});
    return () => { con = false; };
  }, []);

  // CuongMini đổi biểu cảm theo nhịp: chào → vui → chờ → tim … cho đầu trang luôn "sống".
  useEffect(() => {
    const vong: CamXuc[] = ['chao', 'vui', 'cho', 'tim', 'kha', 'ngac', 'cho'];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % vong.length; setCam(vong[i]!); }, 2600);
    return () => clearInterval(id);
  }, []);

  const choiDuoc = useMemo(() => (games ?? []).filter((g) => g.status === 'PUBLISHED' && g.kind === 'REACT'), [games]);
  const thuThach = useMemo(() => (choiDuoc.length ? choiDuoc[bam(ngayHomNay()) % choiDuoc.length] : null), [choiDuoc]);
  const nhomCo = useMemo(() => {
    const coGame = new Set((games ?? []).map((g) => g.category.slug));
    return [...nhomDs].filter((n) => coGame.has(n.slug))
      .sort((a, b) => (TEN_NHOM_UU_TIEN.indexOf(a.slug) + 99) % 99 - (TEN_NHOM_UU_TIEN.indexOf(b.slug) + 99) % 99);
  }, [nhomDs, games]);
  const hienThi = useMemo(() => {
    // Chỉ game React (chạy trong khung chung): game IFRAME như love-me không chạy được trong app.
    const ds = (games ?? []).filter((g) => g.kind === 'REACT' && (nhom === 'tat-ca' || g.category.slug === nhom));
    return ds.sort((a, b) => Number(b.status === 'PUBLISHED') - Number(a.status === 'PUBLISHED') || a.sortOrder - b.sortOrder);
  }, [games, nhom]);

  return (
    <div className={s.goc}>
      {/* ── Đầu trang ── */}
      <section className={s.dau}>
        <div className={s.nenDong} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={s.hinhBay} aria-hidden="true">
          {['▲', '●', '■', '✦', '◆', '★', '✚', '◉'].map((c, k) => <span key={k} style={{ ['--k' as string]: k }}>{c}</span>)}
        </div>
        <div className={s.dauChu}>
          <span className={s.nhan}><Sparkles size={14} /> {vi ? 'Giải trí sau giờ học' : 'Play after study'}</span>
          <h1>{vi ? <>Trò chơi <em>luyện não</em></> : <>Brain <em>games</em></>}</h1>
          <p>{vi ? 'Trí nhớ, tập trung, logic, thư giãn và cả hành động 3D — chơi vài ván cho đầu óc tỉnh táo, rồi lên Bảng vàng cùng mọi người.' : 'Memory, focus, logic, relaxing and 3D action — a few rounds to refresh your mind, then climb the Hall of Fame.'}</p>
          <div className={s.soLieu}>
            <span><b>{stats?.games ?? '–'}</b> {vi ? 'trò chơi' : 'games'}</span>
            <span><b>{stats?.totalPlays?.toLocaleString('vi-VN') ?? '–'}</b> {vi ? 'lượt chơi' : 'plays'}</span>
            <span><b>{bv.length || '–'}</b> {vi ? 'người trên Bảng vàng' : 'on the board'}</span>
          </div>
          {thuThach && (
            <Link href={`/games/${thuThach.slug}`} className={s.nutLon}><Play size={18} fill="currentColor" /> {vi ? 'Chơi thử thách hôm nay' : "Play today's challenge"}</Link>
          )}
        </div>
        <div className={s.robot}>
          <NhanVat3D camXuc={cam} mucRef={mucRef} />
        </div>
      </section>

      <TheVaoDoiKhang locale={locale} />

      {/* ── Thử thách hôm nay ── */}
      {thuThach && (
        <Link href={`/games/${thuThach.slug}`} className={s.thuThach} style={{ ['--m' as string]: thuThach.category.color ?? '#f472b6' }}>
          {thuThach.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thuThach.coverImage} alt="" />
          )}
          <div>
            <span className={s.nhanTT}><Flame size={14} /> {vi ? 'Thử thách hôm nay' : "Today's challenge"}</span>
            <h2>{vi ? thuThach.titleVi ?? thuThach.title : thuThach.title}</h2>
            <p>{vi ? thuThach.descriptionVi ?? thuThach.description : thuThach.description}</p>
          </div>
          <span className={s.nutTT}>{vi ? 'Vào chơi' : 'Play'} →</span>
        </Link>
      )}

      <div className={s.than}>
        <div className={s.trai}>
          {/* ── Lọc theo nhóm ── */}
          <div className={s.loc}>
            <button type="button" data-chon={nhom === 'tat-ca'} onClick={() => setNhom('tat-ca')} style={{ ['--m' as string]: '#a78bfa' }}>
              {vi ? 'Tất cả' : 'All'} <small>{games?.length ?? 0}</small>
            </button>
            {nhomCo.map((n) => (
              <button key={n.slug} type="button" data-chon={nhom === n.slug} onClick={() => setNhom(n.slug)} style={{ ['--m' as string]: n.color ?? '#a78bfa' }}>
                {vi ? n.nameVi ?? n.name : n.name} <small>{(games ?? []).filter((g) => g.category.slug === n.slug).length}</small>
              </button>
            ))}
          </div>

          {loi && <p className={s.thongBao}>{vi ? 'Chưa tải được danh sách game — kiểm tra mạng rồi mở lại nhé.' : 'Could not load games.'}</p>}
          {!games && !loi && (
            <div className={s.luoi}>{Array.from({ length: 6 }, (_, k) => <div key={k} className={s.khung} style={{ ['--i' as string]: k }} />)}</div>
          )}
          {games && (
            <div className={s.luoi} key={nhom}>
              {hienThi.map((g, k) => <TheGame key={g.id} g={g} kyLuc={kyLuc[g.id]} i={k} vi={vi} />)}
            </div>
          )}
        </div>

        {/* ── Bảng vàng ── */}
        <aside className={s.bangVang}>
          <h2><Crown size={18} /> {vi ? 'Bảng vàng' : 'Hall of Fame'}</h2>
          <p className={s.bvGhiChu}>{vi ? 'Cộng kỷ lục mọi game (mỗi game tối đa 1000) — giỏi nhiều game mới đứng đầu.' : 'Best scores across all games, 1000 max per game.'}</p>
          {bv.length === 0 ? (
            <p className={s.bvTrong}>{vi ? 'Chưa ai ghi danh — chơi một ván để là người đầu tiên!' : 'Be the first on the board!'}</p>
          ) : (
            <ol>
              {bv.map((x) => (
                <li key={x.userId} data-hang={x.rank}>
                  <span className={s.hang}>{x.rank <= 3 ? <Medal size={18} /> : x.rank}</span>
                  {x.player?.avatarUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={x.player.avatarUrl} alt="" className={s.avt} />
                    : <span className={s.avt}>{(x.player?.name ?? '?').charAt(0).toUpperCase()}</span>}
                  <span className={s.ten}>{x.player?.name ?? (vi ? 'Ẩn danh' : 'Anonymous')}<small>{x.soGame} {vi ? 'game' : 'games'}</small></span>
                  <b>{x.diem.toLocaleString('vi-VN')}</b>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>
    </div>
  );
}
