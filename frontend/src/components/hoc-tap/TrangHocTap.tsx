'use client';
/**
 * /hoc-tap — Huấn luyện học kỳ. Kế hoạch: docs/hoc-tap-coach-plan.md
 * Tỷ lệ trượt do backend tính (`src/services/hocTap/ruiRo.ts`); trang chỉ hiển thị.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, AlertTriangle, CalendarClock, ChevronRight } from 'lucide-react';
import Markdown from '@/components/markdown/Markdown';
import { hocTapApi, MAU_MUC, type TongQuan } from '@/lib/hoc-tap-api';
import { DongHoRuiRo, DongViec, Khung, Nut, The, ThanhTienDo, cx } from './ui';
import { ChiTietViec, thongBao } from './ChiTietViec';
import { SoanKeHoach, TaoKy, ThemMon } from './ThietLap';

function BieuDo({ diem }: { diem: Array<{ ngay: string; tyLe: number }> }) {
  if (diem.length < 2) return <p className="text-xs text-text-muted">Biểu đồ sẽ có sau vài ngày (mỗi sáng 7h hệ thống chụp lại một lần).</p>;
  const W = 300, H = 70;
  const x = (i: number) => (i / (diem.length - 1)) * W;
  const y = (v: number) => H - (v / 100) * H;
  const d = diem.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.tyLe).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" preserveAspectRatio="none" aria-label="Tỷ lệ trượt theo ngày">
      <line x1="0" x2={W} y1={y(50)} y2={y(50)} stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1" opacity=".5" />
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="rgba(239,68,68,.12)" />
      <path d={d} fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function TrangHocTap() {
  const [tq, setTq] = useState<TongQuan | null>(null);
  const [loi, setLoi] = useState('');
  const [moViec, setMoViec] = useState<number | null>(null);
  const [themMon, setThemMon] = useState(false);
  const [soan, setSoan] = useState<{ id: number; ma: string } | null>(null);
  const [nhanXet, setNhanXet] = useState<string | null>(null);
  const [dangNX, setDangNX] = useState(false);
  const [lichSu, setLichSu] = useState<Array<{ ngay: string; tyLe: number }>>([]);

  const tai = useCallback(async () => {
    try {
      setTq(await hocTapApi.tongQuan());
      const ls = await hocTapApi.lichSu(60).catch(() => []);
      setLichSu(ls.filter((x) => x.monId === null));
    } catch (e) { setLoi(thongBao(e)); }
  }, []);
  useEffect(() => { void tai(); }, [tai]);

  if (!tq) return <Khung><p className="py-20 text-center text-sm text-text-muted">{loi || 'Đang tải…'}</p></Khung>;
  if (!tq.hocKy) return <Khung><TaoKy onXong={tai} /></Khung>;

  const m = MAU_MUC[tq.ruiRoKy.mucDo];
  const baoDong = tq.ruiRoKy.mucDo === 'do';

  return (
    <Khung>
      {/* ── Đầu trang ─────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black text-text-primary sm:text-3xl">🎯 Huấn luyện học kỳ</h1>
          <p className="text-sm text-text-muted">{tq.hocKy.ten} · Tuần <b className="text-text-primary">{tq.tuan}</b>/{tq.hocKy.soTuan} · thi FE tuần {tq.hocKy.tuanThi}</p>
        </div>
        <div className="flex gap-2">
          <Nut kieu="phu" onClick={() => setThemMon(true)}><Plus size={14} /> Thêm môn</Nut>
        </div>
      </div>

      {/* Thanh tuần */}
      <div className="mb-4 grid gap-1" style={{ gridTemplateColumns: `repeat(${tq.hocKy.soTuan}, minmax(0,1fr))` }}>
        {Array.from({ length: tq.hocKy.soTuan }, (_, i) => i + 1).map((t) => (
          <div key={t} className={cx('h-2 rounded-full', t < tq.tuan ? 'bg-neon-violet/40' : t === tq.tuan ? 'bg-neon-violet' : 'bg-[var(--border-color)]', t === tq.hocKy!.tuanThi && 'ring-2 ring-red-500/60')} title={`Tuần ${t}${t === tq.hocKy!.tuanThi ? ' — thi' : ''}`} />
        ))}
      </div>

      {/* ── Báo động ──────────────────────────────────────────── */}
      <The className={cx('mb-5 overflow-hidden', baoDong && 'animate-[pulse_2.2s_ease-in-out_infinite]')} style={{ borderColor: m.vien, background: `linear-gradient(135deg, ${m.nen}, var(--bg-card) 70%)` }}>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <DongHoRuiRo tyLe={tq.ruiRoKy.tyLe} mucDo={tq.ruiRoKy.mucDo} />
          <div className="w-full flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide" style={{ color: m.chu }}>
                {baoDong && <AlertTriangle size={18} />} Tỷ lệ trượt cả kỳ
              </div>
              <p className="text-sm text-text-primary">
                {tq.mon.length === 0 ? 'Chưa có môn nào — thêm môn để bắt đầu đo.'
                  : baoDong ? `Bạn đang có nguy cơ trượt rất cao. Mỗi ngày không làm, con số này tăng lên.`
                  : tq.ruiRoKy.mucDo === 'cam' ? 'Đang chậm đáng kể so với lịch. Bù ngay tuần này.'
                  : tq.ruiRoKy.mucDo === 'vang' ? 'Hơi chậm — giữ nhịp đều mỗi ngày.' : 'Đúng tiến độ. Giữ vững!'}
              </p>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-text-muted"><span>Tiến độ kế hoạch (đã được AI tích)</span><b className="text-text-primary">{tq.tienDoKy ?? 0}%</b></div>
              <ThanhTienDo tienDo={tq.tienDoKy ?? 0} kyVong={Math.round(Math.min(1, (tq.tuanQua ?? 0) / tq.hocKy.tuanThi) * 100)} mau={m.chu} />
              <p className="mt-1 text-[11px] text-text-muted">Vạch đen = đáng lẽ phải xong tới đâu theo lịch.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 font-semibold text-red-500">{tq.quaHan.length} quá hạn</span>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-1 font-semibold text-purple-500">{tq.choCham.length} đang chấm</span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 font-semibold text-blue-500">{tq.homNay.length} việc hôm nay</span>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <BieuDo diem={lichSu} />
            <Nut kieu="phu" className="mt-2 w-full" disabled={dangNX || !tq.mon.length} onClick={async () => {
              setDangNX(true);
              try { setNhanXet((await hocTapApi.nhanXet()).loi); } catch (e) { setNhanXet(`⚠️ ${thongBao(e)}`); } finally { setDangNX(false); }
            }}><Sparkles size={14} /> {dangNX ? 'AI đang xem…' : 'AI huấn luyện viên nhận xét'}</Nut>
          </div>
        </div>
        {nhanXet && <div className="mt-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-sm markdown-body"><Markdown mdx={nhanXet} /></div>}
      </The>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        {/* ── Môn ─────────────────────────────────────────────── */}
        <div className="order-2 space-y-3 lg:order-1">
          <h2 className="font-heading text-lg font-bold text-text-primary">Môn học ({tq.mon.length})</h2>
          {tq.mon.length === 0 && (
            <The className="text-center">
              <p className="text-sm text-text-muted">Thêm từng môn kỳ này. AI sẽ đọc khoá Academy cùng mã môn để soạn kế hoạch.</p>
              <Nut className="mt-3" onClick={() => setThemMon(true)}><Plus size={14} /> Thêm môn đầu tiên</Nut>
            </The>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {tq.mon.map((mon) => {
              const mm = MAU_MUC[mon.ruiRo.mucDo];
              return (
                <The key={mon.id} className="relative flex flex-col gap-3 transition hover:shadow-lg" style={{ borderTop: `4px solid ${mon.mau ?? '#6366f1'}` }}>
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/hoc-tap/mon/${mon.id}`} className="min-w-0">
                      <div className="font-heading text-lg font-black" style={{ color: mon.mau ?? undefined }}>{mon.maMon}</div>
                      <div className="truncate text-xs text-text-muted">{mon.ten}</div>
                    </Link>
                    <DongHoRuiRo tyLe={mon.ruiRo.tyLe} mucDo={mon.ruiRo.mucDo} nho />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[11px] text-text-muted"><span>{mon.datViec}/{mon.tongViec} việc đạt</span><b style={{ color: mm.chu }}>{mon.ruiRo.tienDo}% · cần {mon.ruiRo.kyVong}%</b></div>
                    <ThanhTienDo tienDo={mon.ruiRo.tienDo} kyVong={mon.ruiRo.kyVong} mau={mon.mau ?? '#6366f1'} />
                  </div>
                  {mon.thiSapToi && (
                    <div className={cx('flex items-center gap-1.5 text-xs font-semibold', mon.thiSapToi.conNgay <= 7 ? 'text-red-500' : 'text-text-muted')}>
                      <CalendarClock size={13} /> Thi {mon.thiSapToi.loai} còn {mon.thiSapToi.conNgay} ngày
                    </div>
                  )}
                  {mon.ruiRo.quaHan > 0 && <div className="text-xs font-semibold text-red-500">⚠ {mon.ruiRo.quaHan} việc quá hạn</div>}
                  {mon.tongViec === 0 ? (
                    <Nut onClick={() => setSoan({ id: mon.id, ma: mon.maMon })}><Sparkles size={14} /> AI soạn kế hoạch</Nut>
                  ) : mon.viecKeTiep ? (
                    <button onClick={() => setMoViec(mon.viecKeTiep!.id)} className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-3 py-2 text-left text-xs text-text-primary hover:ring-1 hover:ring-neon-violet/50">
                      <span className="flex-1 truncate">▶ {mon.viecKeTiep.tieuDe}</span><span className="text-text-muted">{mon.viecKeTiep.thoiLuongPhut}′</span>
                    </button>
                  ) : <div className="text-xs font-semibold text-emerald-500">🎉 Đã làm hết việc đang có</div>}
                  <Link href={`/hoc-tap/mon/${mon.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-neon-violet">Chi tiết môn <ChevronRight size={12} /></Link>
                </The>
              );
            })}
          </div>
        </div>

        {/* ── Việc ────────────────────────────────────────────── */}
        <div className="order-1 space-y-4 lg:order-2">
          {tq.quaHan.length > 0 && (
            <section>
              <h2 className="mb-2 flex items-center gap-2 font-heading text-base font-bold text-red-500"><AlertTriangle size={16} /> Quá hạn ({tq.quaHan.length})</h2>
              <div className="space-y-2">{tq.quaHan.slice(0, 8).map((v) => <DongViec key={v.id} v={v} onMo={setMoViec} />)}</div>
            </section>
          )}
          <section>
            <h2 className="mb-2 font-heading text-base font-bold text-text-primary">📌 Làm hôm nay</h2>
            {tq.homNay.length ? <div className="space-y-2">{tq.homNay.map((v) => <DongViec key={v.id} v={v} onMo={setMoViec} />)}</div>
              : <p className="text-sm text-text-muted">Không có việc nào — soạn kế hoạch cho các môn đi.</p>}
          </section>
          {tq.choCham.length > 0 && (
            <section>
              <h2 className="mb-2 font-heading text-base font-bold text-purple-500">⏳ Đang chấm ({tq.choCham.length})</h2>
              <div className="space-y-2">{tq.choCham.map((v) => <DongViec key={v.id} v={v} onMo={setMoViec} />)}</div>
            </section>
          )}
        </div>
      </div>

      <ChiTietViec viecId={moViec} onDong={() => setMoViec(null)} onDoi={tai} />
      <ThemMon mo={themMon} hocKyId={tq.hocKy.id} onDong={() => setThemMon(false)} onXong={(id) => { setThemMon(false); void tai(); const mon = id; setSoan({ id: mon, ma: '' }); }} />
      <SoanKeHoach monId={soan?.id ?? null} maMon={soan?.ma} onDong={() => setSoan(null)} onXong={tai} />
    </Khung>
  );
}
