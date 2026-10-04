/**
 * Quản trị · Trò chơi (05/10/2026) — GET /admin/games (+stats), PATCH /admin/games/:id
 * { status, featured }, POST /admin/games/reorder.
 */
import { useState } from 'react';
import { Gamepad2, Star, ArrowUp, ArrowDown, Users, TrendingUp, Eye, Layers } from 'lucide-react';
import { DauMuc, TheSo, Trong, useTai, useThaoTac } from '../chung';

type G = { id: number; slug: string; title: string; titleVi: string | null; status: 'PUBLISHED' | 'DRAFT' | 'COMING_SOON'; featured: boolean; sortOrder: number; playCount: number; coverImage: string | null; componentKey: string | null; category: { nameVi: string | null; name: string; color: string | null } };
type TK = { total: number; published: number; drafts: number; comingSoon: number; playsAll: number; plays7: number; daily: { date: string; plays: number }[] };
const TRANG_THAI: Record<G['status'], { ten: string; mau: string }> = {
  PUBLISHED: { ten: 'Đã xuất bản', mau: '#22c55e' }, DRAFT: { ten: 'Nháp', mau: '#94a3b8' }, COMING_SOON: { ten: 'Sắp ra mắt', mau: '#f59e0b' },
};

function BieuDo({ ds }: { ds: TK['daily'] }) {
  const max = Math.max(1, ...ds.map((d) => d.plays));
  return (
    <div className="ct-qt-bieudo">
      {ds.map((d, i) => (
        <div key={d.date} className="ct-qt-cot" title={`${d.date}: ${d.plays} lượt`} style={{ ['--h' as string]: `${(d.plays / max) * 100}%`, ['--i' as string]: i }}>
          <i />
          <small>{d.date.slice(8)}</small>
        </div>
      ))}
    </div>
  );
}

export function TroChoiQT() {
  const ds = useTai<G[]>('/admin/games', { page: 0, size: 100 });
  const tk = useTai<TK>('/admin/games/stats');
  const lam = useThaoTac();
  const [loi, setLoi] = useState<string | null>(null);
  const games = [...(ds.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const sua = async (id: number, body: Partial<G>) => { setLoi(null); const r = await lam(`/admin/games/${id}`, 'PATCH', body); if (!r.ok) setLoi(r.loi); void ds.taiLai(); };
  const doiCho = async (i: number, j: number) => {
    const a = games[i], b = games[j];
    if (!a || !b) return;
    const r = await lam('/admin/games/reorder', 'POST', { items: [{ id: a.id, sortOrder: b.sortOrder }, { id: b.id, sortOrder: a.sortOrder === b.sortOrder ? a.sortOrder + (j > i ? 1 : -1) : a.sortOrder }] });
    if (!r.ok) setLoi(r.loi);
    void ds.taiLai();
  };
  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe="Trò chơi" moTa="Xuất bản, đánh dấu Hot, sắp xếp thứ tự hiển thị trong mục Trò chơi (web + app)." dang={ds.dang} onLamMoi={() => { void ds.taiLai(); void tk.taiLai(); }} />
      <div className="ct-qt-luoi-so">
        <TheSo i={0} nhan="Tổng số game" so={tk.data?.total ?? '—'} icon={<Layers size={18} />} mau="#a78bfa" phu={tk.data ? `${tk.data.published} xuất bản · ${tk.data.comingSoon} sắp ra` : undefined} />
        <TheSo i={1} nhan="Lượt chơi 7 ngày" so={tk.data?.plays7?.toLocaleString('vi-VN') ?? '—'} icon={<TrendingUp size={18} />} mau="#22c55e" />
        <TheSo i={2} nhan="Tổng lượt chơi" so={tk.data?.playsAll?.toLocaleString('vi-VN') ?? '—'} icon={<Users size={18} />} mau="#22d3ee" />
      </div>
      {tk.data?.daily && (
        <section className="ct-qt-khoi">
          <h2><TrendingUp size={17} /> Lượt chơi 14 ngày</h2>
          <BieuDo ds={tk.data.daily} />
        </section>
      )}
      {(ds.loi || loi) && <p className="ct-qt-loi">{ds.loi || loi}</p>}
      <div className="ct-qt-game-ds">
        {games.map((g, i) => (
          <div key={g.id} className="ct-qt-game" style={{ ['--i' as string]: i, ['--m' as string]: g.category.color ?? '#a78bfa' }}>
            <div className="ct-qt-game-anh">{g.coverImage ? <img src={g.coverImage} alt="" loading="lazy" /> : <Gamepad2 size={22} />}</div>
            <div className="ct-qt-game-chu">
              <b>{g.titleVi ?? g.title}</b>
              <small><i className="ct-qt-nhan" style={{ ['--m' as string]: g.category.color ?? '#a78bfa' }}>{g.category.nameVi ?? g.category.name}</i> /games/{g.slug} · <Eye size={12} /> {g.playCount}</small>
            </div>
            <select className="ct-qt-chon" value={g.status} onChange={(e) => void sua(g.id, { status: e.target.value as G['status'] })} style={{ ['--m' as string]: TRANG_THAI[g.status].mau }}>
              {Object.entries(TRANG_THAI).map(([k, v]) => <option key={k} value={k}>{v.ten}</option>)}
            </select>
            <button type="button" className="ct-qt-sao" data-bat={g.featured} title={g.featured ? 'Bỏ Hot' : 'Đánh dấu Hot'} onClick={() => void sua(g.id, { featured: !g.featured })}><Star size={17} /></button>
            <span className="ct-qt-thutu">
              <button type="button" disabled={i === 0} onClick={() => void doiCho(i, i - 1)} aria-label="Lên"><ArrowUp size={15} /></button>
              <button type="button" disabled={i === games.length - 1} onClick={() => void doiCho(i, i + 1)} aria-label="Xuống"><ArrowDown size={15} /></button>
            </span>
          </div>
        ))}
        {!ds.dang && games.length === 0 && <Trong chu="Chưa có game nào." />}
      </div>
    </div>
  );
}
