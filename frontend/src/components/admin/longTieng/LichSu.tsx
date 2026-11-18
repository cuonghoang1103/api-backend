'use client';

/** Lịch sử việc (mới nhất trước): tìm theo tên/link, lọc trạng thái, tải nhanh, mở xem thử, thử lại, xoá. */
import { useMemo, useState } from 'react';
import { AlertTriangle, Ban, ChevronDown, CircleCheck, Download, History, Loader2, Play, RotateCcw, Search, Trash2 } from 'lucide-react';
import type { TrangThaiViec, Viec } from '@/lib/longTieng';
import { NHAN_KET_QUA, NHAN_TRANG_THAI, ngay, phut, tenViec } from './chung';
import { KetQuaViec, type HanhDong } from './TheViec';

type Loc = 'tat-ca' | 'xong' | 'loi' | 'huy';
const LOC: Array<[Loc, string]> = [['tat-ca', 'Tất cả'], ['xong', 'Xong'], ['loi', 'Lỗi'], ['huy', 'Đã huỷ']];
const BUOC_TRANG = 20;

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

function IconTrangThai({ tt }: { tt: TrangThaiViec }) {
  const mau = NHAN_TRANG_THAI[tt].mau;
  const Icon = tt === 'xong' ? CircleCheck : tt === 'loi' ? AlertTriangle : tt === 'huy' ? Ban : Loader2;
  return (
    <span className="lt-row-icon" style={{ color: mau, background: `color-mix(in srgb, ${mau} 16%, transparent)` }} aria-label={NHAN_TRANG_THAI[tt].chu}>
      <Icon className={tt === 'xong' || tt === 'loi' || tt === 'huy' ? '' : 'lt-spin'} />
    </span>
  );
}

export function LichSu({ viec, hd }: { viec: Viec[]; hd: HanhDong }) {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState<Loc>('tat-ca');
  const [mo, setMo] = useState<string | null>(null);
  const [soHien, setSoHien] = useState(BUOC_TRANG);

  const dem = useMemo(() => ({
    'tat-ca': viec.length,
    xong: viec.filter((v) => v.trangThai === 'xong').length,
    loi: viec.filter((v) => v.trangThai === 'loi').length,
    huy: viec.filter((v) => v.trangThai === 'huy').length,
  }), [viec]);

  const loc2 = useMemo(() => {
    const k = boDau(q.trim());
    return viec.filter((v) => (loc === 'tat-ca' || v.trangThai === loc) && (!k || boDau(`${tenViec(v)} ${v.url ?? ''}`).includes(k)));
  }, [viec, q, loc]);

  return (
    <section className="lt-card">
      <h2 className="lt-h2"><History /> Lịch sử <span className="lt-count">{viec.length}</span></h2>
      <p className="lt-muted mt-1">Kết quả giữ trên kho tối đa 7 ngày, hoặc tới khi bạn bấm “Đã tải đủ”.</p>
      <div className="lt-toolbar">
        <label className="lt-search">
          <Search aria-hidden />
          <input className="lt-input" value={q} onChange={(e) => { setQ(e.target.value); setSoHien(BUOC_TRANG); }} placeholder="Tìm theo tên video hoặc link…" aria-label="Tìm việc" />
        </label>
        <div className="lt-chips" role="group" aria-label="Lọc theo trạng thái">
          {LOC.map(([k, chu]) => (
            <button key={k} type="button" className="lt-chip" aria-pressed={loc === k} onClick={() => { setLoc(k); setSoHien(BUOC_TRANG); }}>
              {chu} <span className="lt-count">{dem[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {!loc2.length ? (
        <p className="lt-muted py-8 text-center">{viec.length ? 'Không có việc nào khớp.' : 'Chưa có việc nào trong lịch sử.'}</p>
      ) : (
        <ul className="lt-rows">
          {loc2.slice(0, soHien).map((v) => {
            const video = v.ketQua.filter((k) => k.url && (k.loai === 'vi' || k.loai === 'vi-goc'));
            const dangMo = mo === v.id;
            return (
              <li key={v.id} className="lt-row">
                <div className="lt-row-main">
                  <IconTrangThai tt={v.trangThai} />
                  <div className="min-w-0 flex-1">
                    <p className="lt-row-name" title={tenViec(v)}>{tenViec(v)}</p>
                    <p className="lt-muted" style={{ margin: 0 }}>
                      {NHAN_TRANG_THAI[v.trangThai].chu} · {ngay(v.tao)}{v.thoiLuong ? ` · ${phut(v.thoiLuong)}` : ''}
                      {v.trangThai === 'xong' && !v.ketQua.some((k) => k.url) ? (v.daTaiVe ? ' · đã tải về' : ' · tệp đã hết hạn') : ''}
                    </p>
                  </div>
                  <div className="lt-row-tools">
                    {video.map((k) => (
                      <a key={k.loai} href={k.url!} download={k.ten} className="lt-btn lt-btn-sm" title={k.ten}>
                        <Download /> {NHAN_KET_QUA[k.loai].ngan}
                      </a>
                    ))}
                    {v.trangThai === 'xong' && v.ketQua.some((k) => k.url) && (
                      <button type="button" className="lt-btn lt-btn-sm" aria-expanded={dangMo} onClick={() => setMo(dangMo ? null : v.id)}>
                        {dangMo ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <Play />} {dangMo ? 'Thu gọn' : 'Xem & tải thêm'}
                      </button>
                    )}
                    {v.trangThai === 'loi' && (
                      <button type="button" className="lt-btn lt-btn-sm lt-btn-primary" disabled={hd.dangLam === v.id} onClick={() => hd.thuLai(v)}>
                        <RotateCcw /> Thử lại
                      </button>
                    )}
                    <button type="button" className="lt-btn lt-btn-sm lt-btn-danger lt-btn-icon" style={{ width: 36 }} disabled={hd.dangLam === v.id}
                      aria-label={`Xoá ${tenViec(v)}`} title="Xoá" onClick={() => hd.xoa(v)}>
                      <Trash2 />
                    </button>
                  </div>
                </div>
                {v.trangThai === 'loi' && v.loi && dangMo === false && (
                  <p className="lt-muted mt-2" style={{ overflowWrap: 'anywhere' }}>Lỗi: {v.loi.length > 220 ? `…${v.loi.slice(-220)}` : v.loi}</p>
                )}
                {dangMo && <KetQuaViec v={v} hd={hd} />}
              </li>
            );
          })}
        </ul>
      )}
      {loc2.length > soHien && (
        <div className="mt-4 flex justify-center">
          <button type="button" className="lt-btn" onClick={() => setSoHien((n) => n + BUOC_TRANG)}>Xem thêm ({loc2.length - soHien})</button>
        </div>
      )}
    </section>
  );
}
