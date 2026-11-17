import { useState } from 'react';
import type { TrangThaiApp } from '../shared/ipc';
import { Icon, Robot } from './Hinh';

/** Lần đầu mở app: dán mã kết nối `ctlt_…` tạo ở trang web /long-tieng. */
export function KetNoi({ s }: { s: TrangThaiApp }) {
  const [ma, datMa] = useState('');
  const [hien, datHien] = useState(false);
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);

  const gui = async () => {
    datDang(true);
    datLoi(null);
    const r = await window.ctlt.ketNoi(ma);
    datDang(false);
    if (!r.ok) datLoi(r.loi ?? 'Không kết nối được.');
  };

  return (
    <div className="ket-noi">
      <div className="hop the">
        <Robot size={92} vui />
        <h1>Kết nối CT Lồng Tiếng</h1>
        <p className="phu" style={{ margin: 0 }}>App dùng trạm lồng tiếng ở máy nhà qua trang web. Chỉ cần làm một lần.</p>
        <ol>
          <li>Mở trang <b>{s.caiDat.mayChu.replace(/^https?:\/\//, '')}/long-tieng</b> (đăng nhập tài khoản quản trị).</li>
          <li>Bấm <b>"Tạo mã kết nối app"</b> rồi chép mã bắt đầu bằng <code>ctlt_</code>.</li>
          <li>Dán mã vào ô dưới đây.</li>
        </ol>
        <form className="hang" onSubmit={(e) => { e.preventDefault(); void gui(); }}>
          <input
            className="o-nhap"
            type={hien ? 'text' : 'password'}
            placeholder="ctlt_…"
            value={ma}
            onChange={(e) => datMa(e.target.value)}
            autoFocus
            spellCheck={false}
            aria-label="Mã kết nối"
          />
          <button type="button" className="nut trong" onClick={() => datHien(!hien)}>{hien ? 'Ẩn' : 'Hiện'}</button>
          <button className="nut chinh" disabled={dang || !ma.trim()}>{dang ? 'Đang kiểm…' : 'Kết nối'}</button>
        </form>
        {loi && <div className="loi-thanh" role="alert">{loi}</div>}
        <div style={{ marginTop: 16 }}>
          <button className="nut" onClick={() => void window.ctlt.moTrangWeb()}>{Icon.ngoai(16)} Mở trang web để lấy mã</button>
        </div>
        {!s.luuMaDuoc && (
          <div className="canh-bao">
            Máy này chưa có kho khoá hệ thống (trên Linux: cài <code>gnome-keyring</code> hoặc <code>kwallet</code>) nên app
            KHÔNG lưu mã — mỗi lần mở app sẽ phải dán lại.
          </div>
        )}
        {s.mock && <p className="goi-y">Chế độ thử: dán mã bất kỳ dạng <code>ctlt_thu12345</code>. Mã bắt đầu <code>ctlt_sai</code> sẽ bị từ chối.</p>}
      </div>
    </div>
  );
}
