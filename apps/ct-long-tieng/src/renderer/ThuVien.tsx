import { useEffect, useMemo, useRef, useState } from 'react';
import type { MucThuVien, TrangThaiApp } from '../shared/ipc';
import { dinhDangDungLuong, dinhDangThoiLuong } from '../shared/tenTep';
import { khopTimKiem } from '../shared/thuVien';
import { Icon, Robot } from './Hinh';

const NHAN_NG: Record<string, string> = { zh: 'ZH → VI', en: 'EN → VI' };

export function ThuVien({ s, moPhat }: { s: TrangThaiApp; moPhat: (id: string) => void }) {
  const [ds, datDs] = useState<MucThuVien[] | null>(null);
  const [tim, datTim] = useState('');
  // Tải lại khi có việc vừa tải về xong (số việc đã tải về đổi).
  const soDaTai = s.viec.filter((v) => v.daTaiVe).length;
  useEffect(() => { void window.ctlt.thuVien().then(datDs); }, [soDaTai, s.caiDat.thuMucTai]);

  const loc = useMemo(() => (ds ?? []).filter((m) => khopTimKiem([m.tieuDe, m.nguon, m.link, m.ngay], tim)), [ds, tim]);

  return (
    <div className="trang">
      <h1>Thư viện</h1>
      <p className="phu chon-duoc">Video đã lồng tiếng trong <b>{s.thuMucKetQua}</b></p>
      <div className="thanh-cong-cu">
        <div className="o-tim">
          {Icon.tim(16)}
          <input className="o-nhap" placeholder="Tìm theo tên, nguồn, ngày…" value={tim} onChange={(e) => datTim(e.target.value)} aria-label="Tìm trong thư viện" />
        </div>
        <span className="goi-y" style={{ margin: 0 }}>{ds ? `${loc.length}/${ds.length} video` : ''}</span>
        <button className="nut" style={{ marginLeft: 'auto' }} onClick={() => void window.ctlt.moThuMucTai()}>{Icon.thuMuc(16)} Mở thư mục</button>
      </div>
      {ds && ds.length === 0 && (
        <div className="trong-rong the">
          <Robot size={72} />
          <div>Chưa có video nào. Video lồng tiếng xong sẽ tự tải về đây.</div>
        </div>
      )}
      {ds && ds.length > 0 && loc.length === 0 && <div className="trong-rong">Không có video nào khớp "{tim}".</div>}
      <div className="luoi">
        {loc.map((m) => <TheMuc key={m.id} m={m} moPhat={moPhat} />)}
      </div>
    </div>
  );
}

/** Ảnh xem trước = khung hình giây thứ 3 của chính video, chỉ nạp khi thẻ cuộn tới (IntersectionObserver). */
function TheMuc({ m, moPhat }: { m: MucThuVien; moPhat: (id: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [thay, datThay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { datThay(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const src = m.vi ?? m.viGoc;
  return (
    <article className="the muc">
      <button ref={ref} className="anh" onClick={() => moPhat(m.id)} aria-label={`Xem ${m.tieuDe}`}>
        {thay && src && <video src={`${src}#t=3`} preload="metadata" muted playsInline />}
        <span className="phat">{Icon.phat(34)}</span>
        {m.ngonNgu && NHAN_NG[m.ngonNgu] && <span className="nhan-ng">{NHAN_NG[m.ngonNgu]}</span>}
        {m.thoiLuong ? <span className="nhan-tg">{dinhDangThoiLuong(m.thoiLuong)}</span> : null}
      </button>
      <div className="than">
        <b title={m.tieuDe}>{m.tieuDe}</b>
        <small>{[m.ngay, m.nguon, dinhDangDungLuong(m.tongDungLuong)].filter(Boolean).join(' · ')}</small>
        <div className="hanh-dong">
          <button className="nut chinh nho" onClick={() => moPhat(m.id)}>{Icon.phat(14)} Xem</button>
          <button className="nut trong nho" onClick={() => void window.ctlt.moThuMucMuc(m.id)}>{Icon.thuMuc(15)} Thư mục</button>
        </div>
      </div>
    </article>
  );
}
