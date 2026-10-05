/**
 * LIBRARY — thư viện sách trong app desktop (05/10/2026), `/books`.
 *
 * Người dùng: "trang tôi hay dùng nhất trên web là Book… đưa vào app, nâng cấp thật
 * đẹp và chuyên nghiệp để tôi và user đọc sách mỗi ngày… full chức năng".
 *
 * Trên web chỉ có kệ sách + trình đọc. Ở đây thêm phần "đọc mỗi ngày": mục tiêu phút
 * đọc trong ngày (vòng tiến độ), chuỗi ngày đọc liên tiếp, biểu đồ 14 ngày, "Đọc tiếp"
 * đúng chỗ dừng (đồng bộ qua máy chủ), lọc Đang đọc / Đã xong / Công nghệ / Kỹ năng.
 * Bìa sách 3D cùng phong cách bìa vải ép nhũ của web.
 */
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Flame, Search, Target, Clock, Library, CheckCircle2, Play, X } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { DocSach } from './DocSach';
import {
  KE_SACH, SERIES_STATS, TAT_CA_SACH, docTuyChon, layTongQuan, logoUrl, luuTuyChon, phut, sachTheoSlug, xoaTienDo,
  type SachMuc, type TienDoSach, type TongQuanDoc,
} from './sachApi';
import './sach.css';

type Loc = 'tat-ca' | 'dang-doc' | 'cong-nghe' | 'ky-nang' | 'da-xong';

function BiaSach({ s, td, onMo, to = false }: { s: SachMuc; td?: TienDoSach | undefined; onMo: () => void; to?: boolean }) {
  const logo = logoUrl(s.vol);
  return (
    <button type="button" className="tv-sach" data-to={to || undefined} style={{ ['--c' as string]: s.color }} onClick={onMo} title={s.title}>
      <span className="tv-sach-trong">
        <span className="tv-gay"><span>{s.vol}</span></span>
        <span className="tv-bia">
          <span className="tv-bia-dau"><span>No. {s.vol}</span><span>CuongThai</span></span>
          <span className="tv-bia-dau-an" aria-hidden>
            {logo ? <span className="tv-logo" style={{ ['--logo' as string]: `url(${logo})` }} /> : <span className="tv-glyph" dangerouslySetInnerHTML={{ __html: s.icon }} />}
          </span>
          <span className="tv-bia-ten">{s.title}</span>
          <span className="tv-bia-meta">{s.chapters} chương · {s.words} chữ</span>
          {td && !td.finishedAt && <span className="tv-bia-vach"><i style={{ width: `${Math.max(3, td.percent)}%` }} /></span>}
          {td?.finishedAt && <span className="tv-bia-xong"><CheckCircle2 size={13} /> Đã đọc xong</span>}
        </span>
      </span>
    </button>
  );
}

function VongMucTieu({ giay, mucTieuPhut, onDoi }: { giay: number; mucTieuPhut: number; onDoi: (p: number) => void }) {
  const [mo, setMo] = useState(false);
  const pt = Math.min(1, giay / 60 / mucTieuPhut);
  const C = 2 * Math.PI * 46;
  return (
    <div className="tv-vong-boc">
      <button type="button" className="tv-vong" onClick={() => setMo((v) => !v)} title="Đổi mục tiêu mỗi ngày">
        <svg viewBox="0 0 108 108" aria-hidden>
          <circle cx="54" cy="54" r="46" className="tv-vong-nen" />
          <circle cx="54" cy="54" r="46" className="tv-vong-chay" data-dat={pt >= 1 || undefined} strokeDasharray={`${pt * C} ${C}`} transform="rotate(-90 54 54)" />
        </svg>
        <span className="tv-vong-chu"><b>{Math.floor(giay / 60)}</b><small>/ {mucTieuPhut} phút</small></span>
      </button>
      <div className="tv-vong-mo">
        <b>{pt >= 1 ? 'Đạt mục tiêu hôm nay 🎯' : 'Mục tiêu hôm nay'}</b>
        <span>{pt >= 1 ? 'Giỏi lắm! Đọc thêm là tiền thưởng.' : `Còn ${Math.max(1, Math.ceil(mucTieuPhut - giay / 60))} phút nữa là đạt.`}</span>
      </div>
      {mo && (
        <div className="tv-chon-muc" onMouseLeave={() => setMo(false)}>
          <small>Mỗi ngày đọc</small>
          {[10, 15, 20, 30, 45, 60].map((p) => (
            <button key={p} type="button" data-chon={p === mucTieuPhut || undefined} onClick={() => { onDoi(p); setMo(false); }}>{p} phút</button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThuVienNha() {
  const { api } = useSession();
  const { navigate, online } = useAppState();
  const [tq, setTq] = useState<TongQuanDoc | null>(null);
  const [loc, setLoc] = useState<Loc>('tat-ca');
  const [tim, setTim] = useState('');
  const [mucTieu, setMucTieu] = useState(() => docTuyChon().mucTieuPhut);

  useEffect(() => {
    if (!api) return;
    let con = true;
    void layTongQuan(api).then((r) => { if (con) setTq(r); }).catch(() => undefined);
    return () => { con = false; };
  }, [api, online]);

  const tienDo = useMemo(() => new Map((tq?.sach ?? []).map((t) => [t.slug, t])), [tq]);
  const dangDoc = useMemo(() => (tq?.sach ?? []).filter((t) => !t.finishedAt && sachTheoSlug(t.slug)), [tq]);
  const daXong = (tq?.sach ?? []).filter((t) => t.finishedAt).length;
  const tiep = dangDoc[0];
  const sachTiep = tiep ? sachTheoSlug(tiep.slug) : undefined;
  const mo = (s: SachMuc | string) => navigate(`/books/${typeof s === 'string' ? s : s.slug}`);
  const doiMucTieu = (p: number) => { setMucTieu(p); luuTuyChon({ ...docTuyChon(), mucTieuPhut: p }); };

  const can = tim.trim().toLowerCase();
  const loc1 = (s: SachMuc) => {
    if (can && !`${s.title} ${s.vol} ${s.ke}`.toLowerCase().includes(can)) return false;
    const td = tienDo.get(s.slug);
    if (loc === 'dang-doc') return !!td && !td.finishedAt;
    if (loc === 'da-xong') return !!td?.finishedAt;
    if (loc === 'cong-nghe') return s.bo === 'cong-nghe';
    if (loc === 'ky-nang') return s.bo === 'ky-nang';
    return true;
  };
  const ke = KE_SACH.map((k) => ({ ...k, sach: k.sach.filter(loc1) })).filter((k) => k.sach.length);
  const tongGiay = (tq?.sach ?? []).reduce((t, s) => t + s.seconds, 0);
  const maxNgay = Math.max(60, ...(tq?.tuan ?? []).map((d) => d.giay));

  return (
    <div className="tv">
      <section className="tv-nha">
        <div className="tv-nha-trai">
          <p className="tv-eyebrow"><Library size={14} /> Library · CuongThai Books</p>
          <h1>Mỗi ngày một chương.</h1>
          <p className="tv-nha-mo">{SERIES_STATS.volumes} cuốn sách viết riêng cho người tự học — công nghệ từ con số 0 tới production, và trọn bộ kỹ năng sống & làm việc. Đọc trên app, dừng ở đâu mở lại đúng chỗ đó.</p>
          <div className="tv-so">
            <span><b>{SERIES_STATS.volumes}</b> cuốn</span>
            <span><b>{SERIES_STATS.chapters}</b> chương</span>
            <span><b>{SERIES_STATS.practice}</b> bài tập</span>
            <span><b>{SERIES_STATS.words}</b> chữ</span>
          </div>
        </div>
        <div className="tv-nha-phai">
          <VongMucTieu giay={tq?.giayHomNay ?? 0} mucTieuPhut={mucTieu} onDoi={doiMucTieu} />
          <div className="tv-chi-so">
            <div><Flame size={16} className="tv-lua" data-chay={(tq?.chuoiNgay ?? 0) > 0 || undefined} /><b>{tq?.chuoiNgay ?? 0}</b><small>ngày liên tiếp</small></div>
            <div><Clock size={16} /><b>{phut(tongGiay)}</b><small>tổng thời gian đọc</small></div>
            <div><CheckCircle2 size={16} /><b>{daXong}</b><small>cuốn đã đọc xong</small></div>
          </div>
          <div className="tv-cot-ngay" aria-label="Phút đọc 14 ngày gần nhất">
            {(tq?.tuan ?? Array.from({ length: 14 }, (_, i) => ({ day: String(i), giay: 0 }))).map((d, i, a) => (
              <span key={d.day} title={`${d.day}: ${Math.round(d.giay / 60)} phút`} data-nay={i === a.length - 1 || undefined} data-dat={d.giay >= mucTieu * 60 || undefined}>
                <i style={{ height: `${Math.max(6, (d.giay / maxNgay) * 100)}%` }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {sachTiep && tiep && (
        <section className="tv-tiep" style={{ ['--c' as string]: sachTiep.color }}>
          <BiaSach s={sachTiep} td={tiep} onMo={() => mo(sachTiep)} to />
          <div className="tv-tiep-chu">
            <p className="tv-eyebrow"><BookOpen size={14} /> Đọc tiếp</p>
            <h2>{sachTiep.title}</h2>
            <p className="tv-tiep-meta">{Math.round(tiep.percent)}% · đã đọc {phut(tiep.seconds)} · lần cuối {new Date(tiep.lastReadAt).toLocaleDateString('vi-VN')}</p>
            <div className="tv-tiep-vach"><i style={{ width: `${Math.max(2, tiep.percent)}%` }} /></div>
            <button type="button" className="tv-nut-chinh" onClick={() => mo(sachTiep)}><Play size={15} fill="currentColor" /> Đọc tiếp</button>
          </div>
          {dangDoc.length > 1 && (
            <div className="tv-tiep-khac">
              <small>Cũng đang đọc</small>
              {dangDoc.slice(1, 5).map((t) => {
                const s = sachTheoSlug(t.slug)!;
                return (
                  <div key={t.slug} className="tv-khac-dong">
                    <button type="button" onClick={() => mo(s)} style={{ ['--c' as string]: s.color }}>
                      <span className="tv-cham" />
                      <span className="tv-khac-ten">{s.title}</span>
                      <span className="tv-khac-pt">{Math.round(t.percent)}%</span>
                    </button>
                    <button type="button" className="tv-bo" title="Bỏ khỏi Đang đọc" onClick={() => { if (api) void xoaTienDo(api, t.slug).then(() => layTongQuan(api)).then(setTq); }}><X size={13} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <div className="tv-cong-cu">
        <div className="tv-tim"><Search size={15} /><input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm sách theo tên, số tập…" />{tim && <button type="button" onClick={() => setTim('')} aria-label="Xoá"><X size={13} /></button>}</div>
        <div className="tv-loc" role="tablist">
          {([['tat-ca', 'Tất cả', TAT_CA_SACH.length], ['dang-doc', 'Đang đọc', dangDoc.length], ['cong-nghe', 'Công nghệ', TAT_CA_SACH.filter((s) => s.bo === 'cong-nghe').length], ['ky-nang', 'Kỹ năng', TAT_CA_SACH.filter((s) => s.bo === 'ky-nang').length], ['da-xong', 'Đã xong', daXong]] as [Loc, string, number][]).map(([k, ten, n]) => (
            <button key={k} type="button" role="tab" aria-selected={loc === k} data-chon={loc === k || undefined} onClick={() => setLoc(k)}>{ten} <small>{n}</small></button>
          ))}
        </div>
      </div>

      {ke.length === 0 ? (
        <p className="tv-trong"><Target size={22} /><br />{loc === 'dang-doc' ? 'Chưa có cuốn nào đang đọc — chọn một cuốn bên dưới để bắt đầu.' : loc === 'da-xong' ? 'Chưa đọc xong cuốn nào. Cuốn đầu tiên luôn là cuốn khó nhất!' : 'Không thấy cuốn nào khớp.'}</p>
      ) : ke.map((k) => (
        <section key={k.ten} className="tv-ke">
          <header><h3>{k.ten}</h3><p>{k.mo}</p><span className="tv-ke-so">{k.sach.length} cuốn</span></header>
          <div className="tv-luoi">
            {k.sach.map((s) => <BiaSach key={s.slug} s={s} td={tienDo.get(s.slug)} onMo={() => mo(s)} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

/** `/books` = thư viện, `/books/<slug>` = trình đọc. */
export function ThuVienSachPage() {
  const { route } = useAppState();
  const slug = /^\/books\/([a-z0-9-]+)/.exec(route)?.[1];
  return slug ? <DocSach key={slug} slug={slug} /> : <ThuVienNha />;
}
