import { useState } from 'react';
import type { CaiDat, GiaoDien } from '../shared/caiDat';
import { MAY_CHU_MAC_DINH, type NgonNgu, type Nhip } from '../shared/hopDong';
import type { TrangThaiApp } from '../shared/ipc';
import { Icon } from './Hinh';

function CongTac({ bat, doi, nhan }: { bat: boolean; doi: (v: boolean) => void; nhan: string }) {
  return <button role="switch" aria-checked={bat} aria-label={nhan} className="cong-tac" onClick={() => doi(!bat)} />;
}

export function CaiDatTrang({ s, baoToast }: { s: TrangThaiApp; baoToast: (m: string) => void }) {
  const c = s.caiDat;
  const [mayChu, datMayChu] = useState(c.mayChu);
  const luu = async (p: Partial<CaiDat>, bao?: string) => {
    const r = await window.ctlt.luuCaiDat(p);
    if (!r.ok) baoToast(r.loi ?? 'Không lưu được.');
    else if (bao) baoToast(bao);
  };

  return (
    <div className="trang" style={{ maxWidth: 760 }}>
      <h1>Cài đặt</h1>
      <p className="phu">Thay đổi được lưu ngay.</p>

      <section className="the nhom">
        <h2>Lưu video</h2>
        <div className="dong">
          <div className="mo-ta">
            <b>Thư mục tải về</b>
            <small className="chon-duoc">{s.thuMucKetQua}</small>
          </div>
          <button className="nut nho" onClick={() => void window.ctlt.moThuMucTai()}>{Icon.thuMuc(15)} Mở</button>
          <button className="nut nho" onClick={() => void window.ctlt.chonThuMucTai()}>Đổi…</button>
        </div>
        <div className="dong">
          <div className="mo-ta">
            <b>Tự tải kết quả về</b>
            <small>Xong là tải ngay vào thư mục trên, rồi xoá bản trên máy chủ.</small>
          </div>
          <CongTac nhan="Tự tải kết quả về" bat={c.tuTaiVe} doi={(v) => void luu({ tuTaiVe: v })} />
        </div>
      </section>

      <section className="the nhom">
        <h2>Mặc định cho việc mới</h2>
        <div className="dong">
          <div className="mo-ta"><b>Ngôn ngữ gốc</b></div>
          <div className="phan-doan">
            {([['auto', 'Tự nhận'], ['zh', 'Tiếng Trung'], ['en', 'Tiếng Anh']] as Array<[NgonNgu, string]>).map(([k, t]) => (
              <button key={k} aria-pressed={c.ngonNgu === k} onClick={() => void luu({ ngonNgu: k })}>{t}</button>
            ))}
          </div>
        </div>
        <div className="dong">
          <div className="mo-ta"><b>Giữ giọng gốc nhỏ</b><small>Mức giọng gốc trong bản "VI + giọng gốc".</small></div>
          <div className="thanh-truot" style={{ width: 220 }}>
            <input type="range" min={0} max={40} step={5} defaultValue={Math.round(c.goc * 100)} aria-label="Giữ giọng gốc"
              onChange={(e) => void luu({ goc: Number(e.target.value) / 100 })} />
            <output>{Math.round(c.goc * 100)}%</output>
          </div>
        </div>
        <div className="dong">
          <div className="mo-ta"><b>Nhịp đọc</b><small>{c.nhip === 'cho-giong' ? 'Video chờ giọng — đọc thong thả, video tự kéo dài chỗ cần (khuyên dùng).' : 'Tăng tốc giọng — giữ đúng thời lượng video gốc.'}</small></div>
          <div className="phan-doan">
            {([['cho-giong', 'Video chờ giọng'], ['tang-toc', 'Tăng tốc giọng']] as Array<[Nhip, string]>).map(([k, t]) => (
              <button key={k} aria-pressed={c.nhip === k} onClick={() => void luu({ nhip: k })}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="the nhom">
        <h2>Ứng dụng</h2>
        <div className="dong">
          <div className="mo-ta"><b>Chạy cùng máy</b><small>Mở ẩn ở khay khi bật máy để tự tải kết quả và báo xong.</small></div>
          <CongTac nhan="Chạy cùng máy" bat={c.chayCungMay} doi={(v) => void luu({ chayCungMay: v })} />
        </div>
        <div className="dong">
          <div className="mo-ta"><b>Giao diện</b></div>
          <div className="phan-doan">
            {([['he-thong', 'Theo hệ thống'], ['sang', 'Sáng'], ['toi', 'Tối']] as Array<[GiaoDien, string]>).map(([k, t]) => (
              <button key={k} aria-pressed={c.giaoDien === k} onClick={() => void luu({ giaoDien: k })}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="the nhom">
        <h2>Nâng cao</h2>
        <div className="dong">
          <div className="mo-ta">
            <b>Máy chủ</b>
            <small>{s.mock ? 'Chế độ thử đang dùng máy chủ giả trên máy này — giá trị này áp dụng khi chạy thật.' : 'Chỉ đổi khi được hướng dẫn. Mặc định ' + MAY_CHU_MAC_DINH}</small>
          </div>
          <input className="o-nhap" style={{ width: 240, height: 34 }} value={mayChu} onChange={(e) => datMayChu(e.target.value)} spellCheck={false} aria-label="Địa chỉ máy chủ" />
          <button className="nut nho" disabled={mayChu === c.mayChu} onClick={() => void luu({ mayChu }, 'Đã đổi máy chủ.')}>Lưu</button>
          {c.mayChu !== MAY_CHU_MAC_DINH && <button className="nut trong nho" onClick={() => { datMayChu(MAY_CHU_MAC_DINH); void luu({ mayChu: MAY_CHU_MAC_DINH }); }}>Mặc định</button>}
        </div>
      </section>

      <section className="the nhom">
        <h2>Tài khoản</h2>
        <div className="dong">
          <div className="mo-ta">
            <b>Đăng xuất</b>
            <small>Xoá mã kết nối khỏi máy này. Video đã tải về vẫn giữ nguyên.{!s.luuMaDuoc && ' (Máy này không có kho khoá — mã chỉ nằm trong bộ nhớ.)'}</small>
          </div>
          <button className="nut nho nguy" onClick={() => { if (window.confirm('Đăng xuất khỏi CT Lồng Tiếng trên máy này?')) void window.ctlt.dangXuat(); }}>Đăng xuất</button>
        </div>
        <div className="dong">
          <div className="mo-ta"><b>Phiên bản</b><small>CT Lồng Tiếng {s.phienBan}{s.mock ? ' · chế độ thử' : ''}</small></div>
          <button className="nut nho" onClick={() => void window.ctlt.moTrangWeb()}>{Icon.ngoai(15)} Trang web</button>
        </div>
      </section>
    </div>
  );
}
