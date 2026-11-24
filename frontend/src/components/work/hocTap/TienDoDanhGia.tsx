'use client';

/**
 * "Tiến độ & đánh giá" trên CT Work → Học tập & Lịch (24/11/2026): mỗi môn/không gian học một thanh tiến độ + nhãn đúng
 * lịch/chậm + mũi tên xu hướng so với tuần trước + việc quá hạn; tóm tắt tuần (giờ học, ngày học, chuỗi) và lời khuyên.
 * Số liệu: GET /hoc-lieu/tien-do (chỉ dữ liệu của chính người xem). Tiếng Anh xem ở trang nhận xét tuần riêng.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { hocTapApi, type TienDoHoc, type MonTienDo } from '@/lib/hoc-tap-api';
import { The, ThanhTienDo, cx } from '@/components/hoc-tap/ui';

const NHAN: Record<MonTienDo['lich'], { chu: string; lop: string }> = {
  dung_lich: { chu: 'Đúng lịch', lop: 'bg-emerald-500/15 text-emerald-600' },
  cham: { chu: 'Chậm', lop: 'bg-amber-500/15 text-amber-600' },
  cham_nhieu: { chu: 'Chậm nhiều', lop: 'bg-red-500/15 text-red-600' },
  chua_toi_han: { chu: 'Chưa tới hạn', lop: 'bg-[var(--border-color)] text-text-muted' },
};
const NGUON: Record<MonTienDo['nguon'], string> = { ctwork: 'CT Work', hoc_tap: 'Môn học', khoa_hoc: 'Khoá học' };

function MuiTen({ x }: { x: MonTienDo['xuHuong'] }) {
  if (x === 'tang') return <span className="inline-flex items-center gap-0.5 text-emerald-600" title="Tiến bộ so với tuần trước"><TrendingUp size={14} />tiến bộ</span>;
  if (x === 'giam') return <span className="inline-flex items-center gap-0.5 text-red-600" title="Đi xuống so với tuần trước"><TrendingDown size={14} />đi xuống</span>;
  if (x === 'ngang') return <span className="inline-flex items-center gap-0.5 text-text-muted" title="Giữ nhịp"><Minus size={14} />giữ nhịp</span>;
  return null;
}

const laLinkNgoai = (u?: string) => !!u && /^https?:\/\//.test(u);
const duongTrong = (u?: string) => (u ? u.replace(/^https?:\/\/[^/]+/, '') : '#');

export default function TienDoDanhGia() {
  const [d, setD] = useState<TienDoHoc | null>(null);
  const [loi, setLoi] = useState('');
  useEffect(() => { hocTapApi.tienDo().then(setD).catch(() => setLoi('Chưa tải được tiến độ.')); }, []);
  if (loi) return <The className="mb-5"><p className="text-sm text-text-muted">{loi}</p></The>;
  if (!d) return <The className="mb-5"><p className="text-sm text-text-muted">Đang tính tiến độ…</p></The>;

  return (
    <section className="mb-5 space-y-3" aria-label="Tiến độ và đánh giá">
      <h2 className="font-heading text-lg font-bold text-text-primary">Tiến độ &amp; đánh giá</h2>
      <The className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div><p className="text-xs text-text-muted">Giờ học tuần này</p><p className="text-xl font-bold text-text-primary">{d.gioTuanNay.toFixed(1)}<span className="ml-1 text-xs font-normal text-text-muted">tuần trước {d.gioTuanTruoc.toFixed(1)}</span></p></div>
        <div><p className="text-xs text-text-muted">Ngày có học (tuần)</p><p className="text-xl font-bold text-text-primary">{d.ngayHocTuanNay}/7</p></div>
        <div><p className="text-xs text-text-muted">Chuỗi ngày học</p><p className="text-xl font-bold text-text-primary">{d.chuoi} 🔥</p></div>
        <div><p className="text-xs text-text-muted">Điểm thi TB tuần</p><p className="text-xl font-bold text-text-primary">{d.thiTuanNay ?? '—'}{d.thiTuanNay != null ? '%' : ''}<span className="ml-1 text-xs font-normal text-text-muted">trước {d.thiTuanTruoc ?? '—'}{d.thiTuanTruoc != null ? '%' : ''}</span></p></div>
      </The>

      {d.mon.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {d.mon.slice(0, 8).map((m) => (
            <The key={m.ma} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text-primary">{m.ten}</p>
                  <p className="text-xs text-text-muted">{NGUON[m.nguon]} · {m.xong}/{m.tong} · tuần này xong {m.xongTuanNay}{m.sapToi7Ngay ? ` · 7 ngày tới ${m.sapToi7Ngay}` : ''}</p>
                </div>
                <span className={cx('shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold', NHAN[m.lich].lop)}>{NHAN[m.lich].chu}</span>
              </div>
              <ThanhTienDo tienDo={m.phanTram} />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="font-semibold text-text-primary">{m.phanTram}%</span>
                <MuiTen x={m.xuHuong} />
                {m.quaHan > 0 && <span className="text-red-600">Quá hạn {m.quaHan}</span>}
                {m.ruiRoTruot != null && <span className={m.ruiRoTruot >= 50 ? 'text-red-600' : 'text-text-muted'}>Nguy cơ trượt {m.ruiRoTruot}%</span>}
                {m.link && <Link href={duongTrong(m.link)} className="ml-auto text-neon-violet hover:underline">Mở →</Link>}
              </div>
              {(m.viecQuaHan?.length ?? 0) > 0 && (
                <ul className="space-y-0.5 text-xs text-text-muted">
                  {m.viecQuaHan!.slice(0, 3).map((v) => (
                    <li key={v.ten} className="truncate">• {v.link ? <Link href={duongTrong(v.link)} className="hover:underline">{v.ten}</Link> : v.ten} <span className="opacity-70">(hạn {v.han})</span></li>
                  ))}
                </ul>
              )}
            </The>
          ))}
        </div>
      )}

      <The>
        <p className="mb-1 text-sm font-semibold text-text-primary">Nên làm gì tiếp</p>
        <ul className="space-y-1 text-sm text-text-secondary">
          {d.deXuat.slice(0, 6).map((s, i) => {
            const url = s.match(/https?:\/\/\S+/)?.[0];
            const chu = url ? s.replace(url, '').trim() : s;
            return <li key={i}>• {chu} {url && laLinkNgoai(url) && <Link href={duongTrong(url)} className="text-neon-violet hover:underline">mở</Link>}</li>;
          })}
        </ul>
        <p className="mt-2 text-xs text-text-muted">Tiếng Anh: xem <Link href="/language/en/nhan-xet-tuan" className="text-neon-violet hover:underline">nhận xét tuần</Link>.</p>
      </The>
    </section>
  );
}
