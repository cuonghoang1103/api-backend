import { useCallback, useEffect, useState } from 'react';
import type { TrangThaiApp } from '../shared/ipc';
import { CaiDatTrang } from './CaiDatTrang';
import { Icon, Robot } from './Hinh';
import { KetNoi } from './KetNoi';
import { ThuVien } from './ThuVien';
import { TrangChu } from './TrangChu';
import { TrinhPhat } from './TrinhPhat';

export type Trang = 'trang-chu' | 'thu-vien' | 'cai-dat';

function trangTuHash(): Trang {
  const h = location.hash.replace(/^#\/?/, '');
  return h === 'thu-vien' || h === 'cai-dat' ? h : 'trang-chu';
}

let henToast: number | undefined;
export function useToast(): [string | null, (s: string) => void] {
  const [chu, datChu] = useState<string | null>(null);
  const bao = useCallback((s: string) => {
    datChu(s);
    window.clearTimeout(henToast);
    henToast = window.setTimeout(() => datChu(null), 4200);
  }, []);
  return [chu, bao];
}

export function App() {
  const [s, datS] = useState<TrangThaiApp | null>(null);
  const [trang, datTrang] = useState<Trang>(trangTuHash());
  const [dangPhat, datDangPhat] = useState<string | null>(null);
  const [toast, baoToast] = useToast();

  useEffect(() => {
    void window.ctlt.layTrangThai().then(datS);
    const bo1 = window.ctlt.onCapNhat(datS);
    const bo2 = window.ctlt.onMoTrinhPhat((id) => { location.hash = '#/thu-vien'; datDangPhat(id); });
    const khiHash = () => datTrang(trangTuHash());
    window.addEventListener('hashchange', khiHash);
    return () => { bo1(); bo2(); window.removeEventListener('hashchange', khiHash); };
  }, []);

  // Giao diện: 'he-thong' ⇒ bỏ data-theme để @media prefers-color-scheme quyết định.
  const giaoDien = s?.caiDat.giaoDien;
  useEffect(() => {
    const r = document.documentElement;
    if (giaoDien === 'sang' || giaoDien === 'toi') r.dataset.theme = giaoDien;
    else if (giaoDien) delete r.dataset.theme;
  }, [giaoDien]);

  useEffect(() => {
    document.documentElement.classList.toggle('mac', s?.heDieuHanh === 'darwin');
  }, [s?.heDieuHanh]);

  if (!s) return null;
  if (!s.daKetNoi) return <KetNoi s={s} />;

  const dangChay = s.viec.filter((v) => v.hienThi.dangChay).length;
  const di = (t: Trang) => { location.hash = `#/${t}`; };

  return (
    <div className="khung">
      <nav className="thanh-ben" aria-label="Điều hướng">
        <div className="thuong-hieu">
          <Robot size={38} />
          <div>
            <b>CT Lồng Tiếng</b>
            <small>Giọng Việt để tự học</small>
          </div>
        </div>
        <button className="muc-dieu-huong" aria-current={trang === 'trang-chu' ? 'page' : undefined} onClick={() => di('trang-chu')}>
          {Icon.micro()} Lồng tiếng {dangChay > 0 && <span className="dem">{dangChay}</span>}
        </button>
        <button className="muc-dieu-huong" aria-current={trang === 'thu-vien' ? 'page' : undefined} onClick={() => di('thu-vien')}>
          {Icon.thuVien()} Thư viện
        </button>
        <button className="muc-dieu-huong" aria-current={trang === 'cai-dat' ? 'page' : undefined} onClick={() => di('cai-dat')}>
          {Icon.caiDat()} Cài đặt
        </button>
        <div className="day">
          Phiên bản {s.phienBan}
          {s.mock && <><br /><span className="mock-nhan">Chế độ thử (mock)</span></>}
        </div>
      </nav>
      <main className="noi-dung">
        <div className="thanh-tren" />
        <div className="cuon">
          {trang === 'trang-chu' && <TrangChu s={s} baoToast={baoToast} moPhat={datDangPhat} />}
          {trang === 'thu-vien' && <ThuVien s={s} moPhat={datDangPhat} />}
          {trang === 'cai-dat' && <CaiDatTrang s={s} baoToast={baoToast} />}
        </div>
        <footer className="chan-trang">
          <Robot size={18} /> Chỉ để tự học trên máy này — đừng đăng lại video của người khác.
        </footer>
      </main>
      {dangPhat && <TrinhPhat mucId={dangPhat} dong={() => datDangPhat(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
