/**
 * QUẢN TRỊ trong app desktop (05/10/2026) — chỉ tài khoản có vai trò admin.
 *
 * Người dùng: "làm trang quản trị trên app… quản lí full như trên web, nhưng giao diện
 * bạn làm, đẹp + đầy đủ… đừng như giao diện trên web". Web có 53 trang quản trị; làm lại
 * theo ĐỢT. Đợt 1 (mục native): Tổng quan · Người dùng · Báo cáo vi phạm · Yêu cầu xoá ·
 * Hộp thư admin. Các mục còn lại nằm ở "Các mục khác" — mở trên web cho tới khi tới lượt.
 *
 * MFA: tài khoản admin đã bật MFA ⇒ thao tác cần token có `mfaAt`. adminApi.goi() tự bật
 * hộp XacMinhMfa khi máy chủ đòi; chip trên đầu cho biết còn hiệu lực bao lâu.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, Flag, UserX, BellRing, Grid3x3, ShieldCheck, ShieldAlert, ExternalLink, Lock, Gamepad2,
} from 'lucide-react';
import { useSession } from '../../auth/session';
import { useAppState } from '../../app-state';
import { XacMinhMfa } from './XacMinhMfa';
import { TongQuan } from './muc/TongQuan';
import { NguoiDung } from './muc/NguoiDung';
import { BaoCao } from './muc/BaoCao';
import { HopThu } from './muc/HopThu';
import { XoaTaiKhoan } from './muc/XoaTaiKhoan';
import { MucKhac } from './muc/MucKhac';
import { TroChoiQT } from './muc/TroChoiQT';
import './quanTri.css';

type Muc = { k: string; ten: string; icon: ReactNode; nhom: string };
const MUC: Muc[] = [
  { k: 'tong-quan', ten: 'Tổng quan', icon: <LayoutDashboard size={17} />, nhom: '' },
  { k: 'nguoi-dung', ten: 'Người dùng', icon: <Users size={17} />, nhom: 'Người dùng & an toàn' },
  { k: 'bao-cao', ten: 'Báo cáo vi phạm', icon: <Flag size={17} />, nhom: 'Người dùng & an toàn' },
  { k: 'yeu-cau-xoa', ten: 'Yêu cầu xoá', icon: <UserX size={17} />, nhom: 'Người dùng & an toàn' },
  { k: 'hop-thu', ten: 'Hộp thư admin', icon: <BellRing size={17} />, nhom: 'Vận hành' },
  { k: 'tro-choi', ten: 'Trò chơi', icon: <Gamepad2 size={17} />, nhom: 'Nội dung' },
  { k: 'muc-khac', ten: 'Các mục khác', icon: <Grid3x3 size={17} />, nhom: 'Khác' },
];

/** Đọc `mfaAt` (giây) trong JWT đang dùng — chỉ để HIỂN THỊ chip, không dùng để quyết quyền. */
function mfaConLai(headers: Record<string, string>): number | null {
  const tok = (headers.Authorization ?? headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  const phan = tok.split('.')[1];
  if (!phan) return null;
  try {
    const j = JSON.parse(atob(phan.replace(/-/g, '+').replace(/_/g, '/'))) as { mfaAt?: number };
    if (!j.mfaAt) return null;
    return j.mfaAt + 12 * 3600 - Date.now() / 1000;
  } catch { return null; }
}

export function QuanTriPage() {
  const { user, api } = useSession();
  const { route, navigate } = useAppState();
  const muc = /^\/quan-tri\/([^/?#]+)/.exec(route)?.[1] ?? 'tong-quan';
  const diToi = (k: string) => navigate(`/quan-tri/${k}`);
  const [nhip, setNhip] = useState(0);
  useEffect(() => { const t = setInterval(() => setNhip((x) => x + 1), 30_000); return () => clearInterval(t); }, []);
  const conLai = useMemo(() => (api ? mfaConLai(api.authHeaders()) : null), [api, nhip, muc]); // eslint-disable-line react-hooks/exhaustive-deps
  const laAdmin = (user?.roles ?? []).some((r) => /^(ROLE_)?ADMIN$/i.test(r)) || /^(ROLE_)?ADMIN$/i.test(user?.role ?? '');

  if (!laAdmin) {
    return (
      <div className="ct-qt-khoa">
        <Lock size={36} />
        <h1>Khu vực quản trị</h1>
        <p>Chỉ tài khoản quản trị viên mới mở được trang này.</p>
      </div>
    );
  }

  const nhom = [...new Set(MUC.map((m) => m.nhom))];
  return (
    <div className="ct-qt">
      <nav className="ct-qt-nav" aria-label="Mục quản trị">
        <div className="ct-qt-nav-dau">
          <span className="ct-qt-logo"><ShieldCheck size={18} /></span>
          <div><b>Quản trị</b><small>CuongThai</small></div>
        </div>
        {nhom.map((n) => (
          <div key={n} className="ct-qt-nav-nhom">
            {n && <p>{n}</p>}
            {MUC.filter((m) => m.nhom === n).map((m) => (
              <button key={m.k} type="button" data-chon={muc === m.k} onClick={() => diToi(m.k)}>{m.icon}<span>{m.ten}</span></button>
            ))}
          </div>
        ))}
        <div className="ct-qt-mfa-chip" data-ok={conLai != null && conLai > 0}>
          {conLai != null && conLai > 0 ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
          {conLai != null && conLai > 0
            ? <span>Đã xác minh · còn {Math.floor(conLai / 3600)}h{String(Math.floor((conLai % 3600) / 60)).padStart(2, '0')}</span>
            : <span>Chưa xác minh MFA — sẽ hỏi mã khi cần</span>}
        </div>
        <button type="button" className="ct-qt-nav-web" onClick={() => void window.cuongthai?.app.getInfo().then((x) => window.cuongthai?.app.openExternal(`${x.webOrigin}/admin`))}>
          <ExternalLink size={14} /> Mở trang quản trị web
        </button>
      </nav>
      <main className="ct-qt-noi">
        {muc === 'nguoi-dung' ? <NguoiDung />
          : muc === 'bao-cao' ? <BaoCao />
            : muc === 'yeu-cau-xoa' ? <XoaTaiKhoan />
              : muc === 'hop-thu' ? <HopThu />
                : muc === 'tro-choi' ? <TroChoiQT />
                : muc === 'muc-khac' ? <MucKhac />
                  : <TongQuan diToi={diToi} />}
      </main>
      <XacMinhMfa />
    </div>
  );
}
