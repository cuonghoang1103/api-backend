/**
 * Nút hành động kiểu Steam: Tải về → (tiến độ · tốc độ · Huỷ/Tiếp tục) → Chơi
 * · Cập nhật · Gỡ. Dùng ở trang cửa hàng (`lon`) và thẻ Nổi bật (gọn).
 */
import { useState } from 'react';
import { Download, FolderOpen, Loader2, Pause, Play, RefreshCw, ShieldAlert, Trash2 } from 'lucide-react';
import type { CaiGame } from './useCaiGame';
import { coChu } from './duLieu';

const DANG_CHAY = new Set(['tai', 'kiem', 'giaiNen']);

function giay(s: number, nn: string): string {
  if (s < 60) return nn === 'en' ? `${s}s left` : `còn ${s} giây`;
  const p = Math.ceil(s / 60);
  return nn === 'en' ? `${p} min left` : `còn ${p} phút`;
}

export function NutHanhDong({ g, nn, lon = false }: { g: CaiGame; nn: string; lon?: boolean }) {
  const en = nn === 'en';
  const { tt, tienDo } = g;
  const [hoiGo, setHoiGo] = useState(false);
  const [bang, setBang] = useState<string | null>(null);
  const [dangMo, setDangMo] = useState(false);

  if (!g.coCau) {
    return <div className="ct-fp-nut-vung"><button type="button" className="ct-fp-nut" disabled>{en ? 'Desktop app only' : 'Chỉ có trong app desktop'}</button></div>;
  }
  if (!tt) {
    return <div className="ct-fp-nut-vung"><button type="button" className="ct-fp-nut" disabled><Loader2 size={18} className="ct-fp-quay" /> {en ? 'Checking…' : 'Đang kiểm tra…'}</button></div>;
  }

  const dangChay = (tienDo && DANG_CHAY.has(tienDo.buoc)) || tt.dangTai;
  if (dangChay) {
    const tong = tienDo?.tong || tt.banMoi?.size || 0;
    const daCo = tienDo?.daCo ?? tt.daTaiDo;
    const pt = tong > 0 ? Math.min(100, Math.floor((daCo / tong) * 100)) : 0;
    const bps = tienDo?.bps ?? 0;
    const buoc = tienDo?.buoc ?? 'tai';
    const nhan = buoc === 'kiem'
      ? (en ? 'Verifying SHA-256…' : 'Đang kiểm SHA-256…')
      : buoc === 'giaiNen'
        ? (en ? 'Installing…' : 'Đang giải nén & cài…')
        : `${en ? 'Downloading' : 'Đang tải'} ${pt}%`;
    return (
      <div className="ct-fp-nut-vung" data-lon={lon || undefined}>
        <div className="ct-fp-tien-do" role="progressbar" aria-valuenow={pt} aria-valuemin={0} aria-valuemax={100}>
          <div className="ct-fp-tien-do-thanh" style={{ width: `${buoc === 'tai' ? pt : 100}%` }} data-nhip={buoc !== 'tai' || undefined} />
          <span className="ct-fp-tien-do-chu">{nhan}</span>
        </div>
        <div className="ct-fp-tien-do-phu">
          {buoc === 'tai' ? (
            <span>
              {coChu(daCo, nn)} / {coChu(tong, nn)}
              {bps > 0 && <> · {coChu(bps, nn)}/s · {giay(Math.ceil((tong - daCo) / bps), nn)}</>}
            </span>
          ) : <span>{en ? 'Almost there' : 'Sắp xong'}</span>}
          {buoc === 'tai' && (
            <button type="button" className="ct-fp-nut-phu" onClick={() => void g.huy()}>
              <Pause size={14} /> {en ? 'Pause' : 'Tạm dừng'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const loi = g.loi ?? (!tt.banMoi && !tt.daCai ? tt.loiBanMoi : null);
  const hoTro = tt.hoTro;
  const ban = tt.banMoi;

  let chinh: React.ReactNode;
  if (tt.daCai) {
    chinh = (
      <button
        type="button"
        className="ct-fp-nut"
        data-loai="choi"
        disabled={dangMo}
        onClick={async () => {
          setDangMo(true);
          setBang(null);
          const kq = await g.choi();
          setDangMo(false);
          if (!kq.ok) setBang(kq.loi ?? 'macOS');
        }}
      >
        {dangMo ? <Loader2 size={20} className="ct-fp-quay" /> : <Play size={20} fill="currentColor" />} {en ? 'Play' : 'Chơi'}
      </button>
    );
  } else if (!hoTro.ok) {
    chinh = <button type="button" className="ct-fp-nut" disabled>{en ? 'Not available on this Mac' : 'Máy này chưa chơi được'}</button>;
  } else if (!ban) {
    chinh = (
      <button type="button" className="ct-fp-nut" onClick={() => void g.napLai(true)}>
        <RefreshCw size={18} /> {en ? 'Try again' : 'Thử lại'}
      </button>
    );
  } else if (tt.daTaiDo > 0 && tt.daTaiDo < ban.size) {
    const pt = Math.floor((tt.daTaiDo / ban.size) * 100);
    chinh = (
      <button type="button" className="ct-fp-nut" data-loai="tai" onClick={() => void g.tai()}>
        <Download size={20} /> {en ? `Resume (${pt}%)` : `Tải tiếp (${pt}%)`}
      </button>
    );
  } else {
    chinh = (
      <button type="button" className="ct-fp-nut" data-loai="tai" onClick={() => void g.tai()}>
        <Download size={20} /> {en ? 'Download' : 'Tải về'} <small>{coChu(ban.size, nn)}</small>
      </button>
    );
  }

  return (
    <div className="ct-fp-nut-vung" data-lon={lon || undefined}>
      {chinh}
      {tt.daCai && tt.coCapNhat && ban && hoTro.ok && (
        <button type="button" className="ct-fp-nut" data-loai="capNhat" onClick={() => void g.tai()}>
          <RefreshCw size={18} /> {en ? `Update to ${ban.version}` : `Cập nhật lên ${ban.version}`} <small>{coChu(ban.size, nn)}</small>
        </button>
      )}
      {!hoTro.ok && hoTro.lyDo && <p className="ct-fp-ghi" data-loai="canh">{hoTro.lyDo}</p>}
      {loi && <p className="ct-fp-ghi" data-loai="loi">{loi}</p>}
      {bang && (
        <div className="ct-fp-ghi" data-loai="canh">
          <ShieldAlert size={16} />
          <span>
            {en
              ? 'macOS blocked the game (preview builds are not notarized yet). Click “Show in Finder”, right-click Flying Pencil → Open → Open. You only need to do this once.'
              : 'macOS chặn mở game (bản thử chưa được Apple công chứng). Bấm “Mở thư mục”, chuột phải vào Flying Pencil → Mở → Mở. Chỉ cần làm một lần.'}
            {bang !== 'macOS' && <em> ({bang})</em>}
          </span>
        </div>
      )}
      {lon && tt.daCai && (
        <div className="ct-fp-nut-dong">
          <button type="button" className="ct-fp-nut-phu" onClick={() => void g.moThuMuc()}>
            <FolderOpen size={14} /> {en ? 'Show in Finder' : 'Mở thư mục'}
          </button>
          {hoiGo ? (
            <>
              <button type="button" className="ct-fp-nut-phu" data-loai="nguy" onClick={() => { setHoiGo(false); void g.go(); }}>
                <Trash2 size={14} /> {en ? 'Yes, uninstall' : 'Gỡ thật'}
              </button>
              <button type="button" className="ct-fp-nut-phu" onClick={() => setHoiGo(false)}>{en ? 'Cancel' : 'Thôi'}</button>
            </>
          ) : (
            <button type="button" className="ct-fp-nut-phu" onClick={() => setHoiGo(true)}>
              <Trash2 size={14} /> {en ? 'Uninstall' : 'Gỡ cài đặt'}
            </button>
          )}
        </div>
      )}
      {lon && tt.daCai && (
        <p className="ct-fp-ghi-nho">
          {en ? `Installed ${tt.daCai.version} · ${coChu(tt.daCai.dungLuong, nn)}` : `Đã cài ${tt.daCai.version} · ${coChu(tt.daCai.dungLuong, nn)}`}
        </p>
      )}
    </div>
  );
}
