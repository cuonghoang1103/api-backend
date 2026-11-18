'use client';

/**
 * Thẻ việc lớn — trung tâm của trang: CuongMini pixel đang gõ máy + bong bóng lời theo chặng kèm thời gian còn lại,
 * thanh % lớn, bậc thang 6 chặng (Tải video → Tách giọng → Nghe & chép lời → Dịch → Lồng tiếng → Ghép video).
 * Xong ⇒ Gấu ăn mừng + nút tải to + xem thử ngay (URL ký sẵn). Lỗi ⇒ Gấu buồn + lỗi rõ + Thử lại.
 */
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, AudioLines, Check, Clock, Download, Ear, FileText, Film, Hourglass, Languages, Link2, Loader2, Mic, Minimize2,
  RotateCcw, Timer, Trash2, Upload, X,
} from 'lucide-react';
import { GauPixel, type EmoGau } from '@/components/chat/claude/GauPixel';
import type { KetQua, Viec } from '@/lib/longTieng';
import { cauNoi, chuDaChay, chuThoiGian, tinhTienDo, type MaChang } from '@/lib/longTiengTienDo';
import { NHAN_KET_QUA, NHAN_TRANG_THAI, kb, nhanNgonNgu, nhanNguon, nhanNhac, ngay, phut, tenViec } from './chung';

const ICON_CHANG: Record<MaChang, typeof Film> = { tai: Download, tach: AudioLines, nghe: Ear, dich: Languages, long: Mic, ghep: Film };

export interface HanhDong {
  dangLam: string | null;
  thuLai: (v: Viec) => void;
  xoa: (v: Viec) => void;
  daTaiVe: (v: Viec) => void;
  thuGon?: (v: Viec) => void;
}

export function TheViec({ v, taiLen, eta, now, lan, hd }: {
  v: Viec; taiLen?: number; eta: number | null; now: number; lan: number; hd: HanhDong;
}) {
  const tien = tinhTienDo(v);
  const dangTaiLen = taiLen != null;
  const pha = dangTaiLen ? 'tai-len' : tien.pha;
  const tienHien = dangTaiLen ? { ...tien, pha: 'tai-len' as const } : tien;
  const cau = cauNoi(tienHien, lan, eta, taiLen ?? null);
  const nhan = NHAN_TRANG_THAI[v.trangThai];
  const chay = pha === 'chay' || pha === 'tai-len' || pha === 'xep-hang';
  const daChay = (now - Date.parse(v.tao)) / 1000;
  const tg = chuThoiGian(eta);
  const nguon = v.url ? nhanNguon(v.url) : null;
  const pct = dangTaiLen ? taiLen : tien.tong;

  const linhVat = pha === 'chay' || pha === 'tai-len'
    ? <GauPixel mode="desk" state="thinking" size={112} title="CuongMini đang làm" />
    : <GauPixel emotion={(pha === 'xong' ? 'celebrate' : pha === 'loi' ? 'sad' : pha === 'huy' ? 'lonely' : 'think') as EmoGau} size={118}
        title={pha === 'xong' ? 'CuongMini ăn mừng' : pha === 'loi' ? 'CuongMini lo lắng' : 'CuongMini đang chờ'} />;

  return (
    <article className="lt-card lt-job lt-pop" data-pha={pha}>
      <div className="lt-job-top">
        <div className="min-w-0 flex-1">
          <h3 className="lt-job-title">{tenViec(v)}</h3>
          <div className="lt-meta">
            {v.url ? (
              <span><Link2 /> <a href={v.url} target="_blank" rel="noreferrer">{nguon ?? 'link gốc'}</a></span>
            ) : v.tep ? <span><Upload /> {kb(v.tep.kichThuoc)}</span> : null}
            <span><Clock /> {ngay(v.tao)}</span>
            <span>{nhanNgonNgu(v.lang)}</span>
            <span>{v.nhip === 'cho-giong' ? 'Giữ nhịp tự nhiên' : 'Giữ độ dài'}</span>
            <span>{nhanNhac(v.nhacNen.loai)}</span>
            <span>{v.banRa === 'vi' ? 'Chỉ giọng Việt' : v.banRa === 'vi-goc' ? `Chỉ song ngữ (${Math.round(v.goc * 100)}%)` : `2 video (giọng gốc ${Math.round(v.goc * 100)}%)`}</span>
            {v.thoiLuong ? <span><Film /> {phut(v.thoiLuong)}</span> : null}
          </div>
        </div>
        <span className="lt-pill" style={{ color: nhan.mau }} data-song={chay ? '1' : undefined}>
          <i aria-hidden /> {dangTaiLen ? 'Đang tải lên' : nhan.chu}
        </span>
      </div>

      <div className="lt-job-body">
        <div className="lt-job-mascot">{linhVat}</div>
        <div className="min-w-0">
          <p className="lt-bubble" aria-live="polite"><span key={cau} className="lt-bubble-msg">{cau}</span></p>
          {(pha === 'chay' || pha === 'tai-len') && (
            <>
              <div className="lt-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ">
                <i style={{ width: `${Math.max(2, pct)}%` }} />
              </div>
              <div className="lt-bar-row">
                <span className="lt-pct">{pct}%</span>
                <span><Timer /> Đã chạy {chuDaChay(daChay)}</span>
                <span><Hourglass /> {pha === 'tai-len' ? 'Đang tải tệp lên kho' : tg ? `Còn ${tg}` : 'Đang ước lượng…'}</span>
              </div>
              {v.buoc && pha === 'chay' && <p className="lt-detail">Trạm báo: {v.buoc}</p>}
            </>
          )}
          {pha === 'xep-hang' && <p className="lt-detail">{v.buoc ?? 'Chờ trạm nhận việc'} · đã chờ {chuDaChay(daChay)}</p>}
          {pha === 'xong' && v.buoc && <p className="lt-detail">Tổng kết: {v.buoc}</p>}
        </div>
      </div>

      {pha !== 'huy' && (
        <ol className="lt-steps" aria-label="Các bước">
          {tien.chang.map((c) => {
            const Icon = c.trangThai === 'xong' ? Check : c.trangThai === 'loi' ? X : ICON_CHANG[c.ma];
            return (
              <li key={c.ma} className="lt-stepi" data-tt={c.trangThai} aria-current={c.trangThai === 'dang' ? 'step' : undefined}>
                <span className="lt-dot"><Icon aria-hidden /></span>
                <b>{c.ten}</b>
                <small>
                  {c.trangThai === 'xong' ? 'Xong' : c.trangThai === 'loi' ? 'Bị lỗi' : c.trangThai === 'dang'
                    ? (dangTaiLen ? `Tải lên ${taiLen}%` : c.phanTram > 0 ? `Đang làm · ${c.phanTram}%` : 'Đang làm')
                    : c.phu}
                </small>
              </li>
            );
          })}
        </ol>
      )}

      {pha === 'loi' && v.loi && (
        <div className="lt-err" role="alert">
          <AlertTriangle aria-hidden />
          <div className="min-w-0">
            <b>Việc dừng lại vì lỗi</b>
            <pre>{v.loi}</pre>
          </div>
        </div>
      )}

      {pha === 'xong' && <KetQuaViec v={v} hd={hd} />}

      <div className="lt-actions">
        {pha === 'loi' && (
          <button type="button" className="lt-btn lt-btn-primary" disabled={hd.dangLam === v.id} onClick={() => hd.thuLai(v)}>
            {hd.dangLam === v.id ? <Loader2 className="lt-spin" /> : <RotateCcw />} Thử lại
          </button>
        )}
        {hd.thuGon && (pha === 'xong' || pha === 'loi') && (
          <button type="button" className="lt-btn" onClick={() => hd.thuGon!(v)}><Minimize2 /> Cất vào lịch sử</button>
        )}
        <button type="button" className="lt-btn lt-btn-danger" disabled={hd.dangLam === v.id || dangTaiLen} onClick={() => hd.xoa(v)}>
          <Trash2 /> {chay ? 'Huỷ việc' : 'Xoá'}
        </button>
      </div>
    </article>
  );
}

/** Nút tải to + xem thử + "đã tải xong". Dùng ở thẻ lớn và khi mở một dòng lịch sử. */
export function KetQuaViec({ v, hd }: { v: Viec; hd: HanhDong }) {
  const co = v.ketQua.filter((k) => k.url);
  if (!co.length) {
    return <p className="lt-detail mt-4">{v.daTaiVe ? 'Bạn đã tải về — tệp trên kho đã xoá.' : 'Tệp kết quả đã hết hạn trên kho (giữ tối đa 7 ngày).'}</p>;
  }
  const video = co.filter((k) => k.loai === 'vi' || k.loai === 'vi-goc');
  const phu = co.filter((k) => k.loai !== 'vi' && k.loai !== 'vi-goc');
  return (
    <>
      <div className="lt-results">
        {video.map((k) => (
          <a key={k.loai} href={k.url!} download={k.ten} className={`lt-dl ${k.loai === 'vi-goc' ? 'lt-dl-alt' : ''}`} title={k.ten}>
            <Download aria-hidden />
            <span className="min-w-0">
              <b>Tải {NHAN_KET_QUA[k.loai].ten.toLowerCase()}</b>
              <small>{k.loai === 'vi' ? '[VI] · chỉ giọng Việt' : `[VI + giọng gốc ${Math.round(v.goc * 100)}%]`} · {kb(k.kichThuoc)}</small>
            </span>
          </a>
        ))}
      </div>
      {phu.length > 0 && (
        <div className="lt-files-sm">
          {phu.map((k) => (
            <a key={k.loai} href={k.url!} download={k.ten} className="lt-btn lt-btn-sm" title={k.ten}>
              <FileText /> {NHAN_KET_QUA[k.loai].ten} <span className="lt-muted">{kb(k.kichThuoc)}</span>
            </a>
          ))}
        </div>
      )}
      {video.length > 0 && <TrinhPhat ds={video} />}
      <div className="lt-actions" style={{ justifyContent: 'flex-start' }}>
        <button type="button" className="lt-btn" disabled={hd.dangLam === v.id} onClick={() => hd.daTaiVe(v)}>
          <Check /> Đã tải đủ — xoá bản trên kho
        </button>
      </div>
    </>
  );
}

const TOC_DO = [0.75, 1, 1.25, 1.5, 2] as const;

/** Xem thử ngay trên web: đổi bản VI ↔ song ngữ GIỮ vị trí đang xem, đổi tốc độ. */
function TrinhPhat({ ds }: { ds: KetQua[] }) {
  const [ban, setBan] = useState(ds[0]!.loai);
  const [toc, setToc] = useState(1);
  const ref = useRef<HTMLVideoElement>(null);
  const viTri = useRef(0);
  const dangPhat = useRef(false);
  const hien = ds.find((k) => k.loai === ban) ?? ds[0]!;

  useEffect(() => { if (ref.current) ref.current.playbackRate = toc; }, [toc]);

  const doiBan = (loai: KetQua['loai']) => {
    const el = ref.current;
    if (el) { viTri.current = el.currentTime; dangPhat.current = !el.paused; }
    setBan(loai);
  };

  return (
    <div className="lt-player">
      <video
        ref={ref}
        key={hien.url!}
        src={hien.url!}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          el.playbackRate = toc;
          if (viTri.current) el.currentTime = viTri.current;
          if (dangPhat.current) void el.play().catch(() => {});
        }}
      />
      <div className="lt-player-bar">
        {ds.length > 1 ? (
          <div className="lt-seg" role="group" aria-label="Bản đang xem">
            {ds.map((k) => (
              <button key={k.loai} type="button" aria-pressed={ban === k.loai} onClick={() => doiBan(k.loai)}>
                {k.loai === 'vi' ? 'Giọng Việt' : 'Song ngữ'}
              </button>
            ))}
          </div>
        ) : <span className="lt-muted">Xem thử: {NHAN_KET_QUA[hien.loai].ten}</span>}
        <div className="lt-seg" role="group" aria-label="Tốc độ">
          {TOC_DO.map((t) => (
            <button key={t} type="button" aria-pressed={toc === t} onClick={() => setToc(t)}>{String(t).replace('.', ',')}×</button>
          ))}
        </div>
      </div>
    </div>
  );
}
