'use client';
/** /hoc-tap/mon/[id] — một môn: tỷ lệ trượt + vì sao, trình độ, khoá nền, việc theo tuần. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Plus, Pencil } from 'lucide-react';
import { hocTapApi, MAU_MUC, type ChiTietMon, type ViecGon } from '@/lib/hoc-tap-api';
import { DongHoRuiRo, DongViec, HopThoai, Khung, Nut, The, ThanhTienDo, cx, oNhap } from './ui';
import { ChiTietViec, thongBao } from './ChiTietViec';
import { SoanKeHoach } from './ThietLap';

export default function TrangMon({ id }: { id: number }) {
  const [d, setD] = useState<ChiTietMon | null>(null);
  const [loi, setLoi] = useState('');
  const [moViec, setMoViec] = useState<number | null>(null);
  const [soan, setSoan] = useState(false);
  const [suaTD, setSuaTD] = useState(false);
  const [trinhDo, setTrinhDo] = useState('');
  const [them, setThem] = useState(false);
  const [moi, setMoi] = useState({ tieuDe: '', loai: 'BAI_TAP', thoiLuongPhut: 30, hanChot: '' });
  const [loc, setLoc] = useState<'tat' | 'chua' | 'dat'>('chua');

  const tai = useCallback(async () => {
    try { const x = await hocTapApi.mon(id); setD(x); setTrinhDo(x.mon.trinhDo ?? ''); } catch (e) { setLoi(thongBao(e)); }
  }, [id]);
  useEffect(() => { void tai(); }, [tai]);

  const theoTuan = useMemo(() => {
    const m = new Map<number, ViecGon[]>();
    for (const v of d?.viec ?? []) {
      if (loc === 'chua' && v.trangThai === 'DAT') continue;
      if (loc === 'dat' && v.trangThai !== 'DAT') continue;
      const g: ViecGon = { ...v, maMon: d!.mon.maMon, mau: d!.mon.mau };
      m.set(v.tuan, [...(m.get(v.tuan) ?? []), g]);
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [d, loc]);

  if (!d) return <Khung><p className="py-20 text-center text-sm text-text-muted">{loi || 'Đang tải…'}</p></Khung>;
  const mm = MAU_MUC[d.ruiRo.mucDo];
  const dat = d.viec.filter((v) => v.trangThai === 'DAT');
  const diemTB = dat.length ? (dat.reduce((s, v) => s + (v.diem ?? 0), 0) / dat.length).toFixed(1) : '—';

  return (
    <Khung>
      <Link href="/hoc-tap" className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"><ArrowLeft size={14} /> Tổng quan</Link>

      <The className="mb-5" style={{ borderTop: `5px solid ${d.mon.mau ?? '#6366f1'}`, background: `linear-gradient(135deg, ${mm.nen}, var(--bg-card) 65%)` }}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <DongHoRuiRo tyLe={d.ruiRo.tyLe} mucDo={d.ruiRo.mucDo} />
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="font-heading text-2xl font-black" style={{ color: d.mon.mau ?? undefined }}>{d.mon.maMon}</h1>
              <p className="text-sm text-text-muted">{d.mon.ten} · tuần {d.tuan}/{d.mon.hocKy.soTuan} · mục tiêu: {d.mon.mucTieu || 'qua môn'}</p>
            </div>
            <ThanhTienDo tienDo={d.ruiRo.tienDo} kyVong={d.ruiRo.kyVong} mau={d.mon.mau ?? '#6366f1'} />
            <div className="flex flex-wrap gap-3 text-xs text-text-muted">
              <span><b className="text-text-primary">{dat.length}/{d.viec.length}</b> việc đạt</span>
              <span>tiến độ <b style={{ color: mm.chu }}>{d.ruiRo.tienDo}%</b> / cần {d.ruiRo.kyVong}%</span>
              <span>điểm TB <b className="text-text-primary">{diemTB}</b></span>
              {d.ruiRo.diemLuyenTB !== null && <span>luyện đề TB <b className="text-text-primary">{d.ruiRo.diemLuyenTB}</b></span>}
            </div>
            {d.ruiRo.lyDo.length > 0 && (
              <ul className="space-y-0.5 text-xs" style={{ color: mm.chu }}>{d.ruiRo.lyDo.map((x, i) => <li key={i}>• {x}</li>)}</ul>
            )}
          </div>
        </div>
      </The>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto font-heading text-lg font-bold text-text-primary">Việc theo tuần</h2>
            {(['chua', 'dat', 'tat'] as const).map((k) => (
              <button key={k} onClick={() => setLoc(k)} className={cx('rounded-full px-3 py-1 text-xs font-semibold', loc === k ? 'bg-neon-violet text-white' : 'bg-[var(--bg-card)] text-text-muted')}>
                {k === 'chua' ? 'Chưa xong' : k === 'dat' ? 'Đã đạt' : 'Tất cả'}
              </button>
            ))}
          </div>
          {d.viec.length === 0 && (
            <The className="text-center">
              <p className="text-sm text-text-muted">Môn này chưa có kế hoạch.</p>
              <Nut className="mt-3" onClick={() => setSoan(true)}><Sparkles size={14} /> AI soạn kế hoạch</Nut>
            </The>
          )}
          {theoTuan.map(([tuan, ds]) => (
            <section key={tuan}>
              <div className={cx('mb-1.5 text-xs font-bold uppercase tracking-wider', tuan === d.tuan ? 'text-neon-violet' : tuan < d.tuan ? 'text-text-muted' : 'text-text-primary')}>
                Tuần {tuan}{tuan === d.tuan ? ' · tuần này' : ''}{tuan === d.mon.hocKy.tuanThi ? ' · TUẦN THI' : ''}
              </div>
              <div className="space-y-2">{ds.map((v) => <DongViec key={v.id} v={v} onMo={setMoViec} />)}</div>
            </section>
          ))}
        </div>

        <aside className="space-y-4">
          <The>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">Trình độ bạn tự kể</h3>
              <button onClick={() => setSuaTD((x) => !x)} className="text-text-muted hover:text-text-primary" aria-label="Sửa"><Pencil size={14} /></button>
            </div>
            {suaTD ? (
              <div className="space-y-2">
                <textarea rows={5} className={oNhap} value={trinhDo} onChange={(e) => setTrinhDo(e.target.value)} />
                <Nut className="w-full" onClick={async () => { await hocTapApi.suaMon(id, { trinhDo }); setSuaTD(false); void tai(); }}>Lưu</Nut>
              </div>
            ) : <p className="whitespace-pre-wrap text-sm text-text-muted">{d.mon.trinhDo || 'Chưa kể — AI sẽ coi như bạn đang yếu môn này.'}</p>}
          </The>

          {d.mon.nenTang && d.mon.nenTang.length > 0 && (
            <The>
              <h3 className="mb-2 text-sm font-bold text-text-primary">🧱 Nền tảng cần học</h3>
              <ul className="space-y-1.5 text-sm">{d.mon.nenTang.map((n) => <li key={n.slug}><Link href={`/courses/${n.slug}`} className="font-semibold text-neon-violet hover:underline">{n.ten}</Link>{n.lyDo && <span className="block text-xs text-text-muted">{n.lyDo}</span>}</li>)}</ul>
            </The>
          )}

          <The className="space-y-2">
            {d.mon.courseSlug && <Link href={`/courses/${d.mon.courseSlug}`} className="block rounded-xl bg-neon-violet/10 px-3 py-2 text-sm font-semibold text-neon-violet">📚 Mở khoá {d.mon.maMon} trên Academy</Link>}
            <Nut kieu="phu" className="w-full" onClick={() => setSoan(true)}><Sparkles size={14} /> AI soạn thêm / bù kế hoạch</Nut>
            <Nut kieu="phu" className="w-full" onClick={() => setThem(true)}><Plus size={14} /> Tự thêm việc</Nut>
            <button className="w-full text-xs text-text-muted underline hover:text-red-500" onClick={async () => { if (window.confirm(`Xoá môn ${d.mon.maMon} và toàn bộ việc, điểm của nó?`)) { await hocTapApi.xoaMon(id); window.location.href = '/hoc-tap'; } }}>Xoá môn</button>
          </The>
        </aside>
      </div>

      <ChiTietViec viecId={moViec} onDong={() => setMoViec(null)} onDoi={tai} />
      <SoanKeHoach monId={soan ? id : null} maMon={d.mon.maMon} onDong={() => setSoan(false)} onXong={tai} />
      <HopThoai mo={them} onDong={() => setThem(false)} tieuDe="Tự thêm việc">
        <div className="space-y-3">
          <p className="text-xs text-text-muted">Việc bạn tự thêm vẫn phải nộp bằng chứng cho AI chấm — không tự tích được.</p>
          <input className={oNhap} placeholder="Tên việc" value={moi.tieuDe} onChange={(e) => setMoi({ ...moi, tieuDe: e.target.value })} />
          <div className="grid grid-cols-3 gap-2">
            <select className={oNhap} value={moi.loai} onChange={(e) => setMoi({ ...moi, loai: e.target.value })}>
              {['BAI_HOC', 'BAI_TAP', 'LAB', 'QUIZ', 'PE', 'FE', 'ON_TAP', 'GHI_CHU', 'NEN_TANG'].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <input type="number" className={oNhap} value={moi.thoiLuongPhut} onChange={(e) => setMoi({ ...moi, thoiLuongPhut: Number(e.target.value) || 30 })} title="phút" />
            <input type="date" className={oNhap} value={moi.hanChot} onChange={(e) => setMoi({ ...moi, hanChot: e.target.value })} />
          </div>
          <Nut className="w-full" disabled={!moi.tieuDe.trim() || !moi.hanChot} onClick={async () => {
            try {
              await hocTapApi.themViec(id, [{ tuan: d.tuan, loai: moi.loai, tieuDe: moi.tieuDe.trim(), thoiLuongPhut: moi.thoiLuongPhut, hanChot: moi.hanChot }]);
              setThem(false); setMoi({ tieuDe: '', loai: 'BAI_TAP', thoiLuongPhut: 30, hanChot: '' }); void tai();
            } catch (e) { setLoi(thongBao(e)); }
          }}>Thêm</Nut>
          {loi && <p className="text-sm text-red-500">{loi}</p>}
        </div>
      </HopThoai>
    </Khung>
  );
}
