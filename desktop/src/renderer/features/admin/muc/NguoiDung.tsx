/**
 * Quản trị · Người dùng (05/10/2026). Nguồn: GET /admin/users (page từ 0, size, keyword,
 * provider), PATCH toggle-locked / toggle-enabled / toggle-music-access / roles,
 * POST /admin/pro/grant|revoke, DELETE /admin/users/:id.
 */
import { useEffect, useState } from 'react';
import { Search, Lock, Unlock, Ban, CheckCircle2, Crown, Music, ShieldCheck, Trash2, X, ChevronLeft, ChevronRight, Mail, Calendar } from 'lucide-react';
import { Avt, DauMuc, Trong, tgTuongDoi, useTai, useThaoTac } from '../chung';

type ND = {
  id: number; username: string; email: string; fullName: string | null; displayName: string | null; avatarUrl: string | null;
  enabled: boolean; accountNonLocked: boolean; emailVerified: boolean; musicAccess: boolean; provider: string | null; createdAt: string; roles: string[];
};
const NHA_CC: Record<string, { ten: string; mau: string }> = {
  credentials: { ten: 'Mật khẩu', mau: '#94a3b8' }, google: { ten: 'Google', mau: '#ea4335' }, github: { ten: 'GitHub', mau: '#e2e8f0' },
  apple: { ten: 'Apple', mau: '#f5f5f7' }, facebook: { ten: 'Facebook', mau: '#1877f2' },
};
const tenVaiTro = (r: string) => r.replace(/^ROLE_/i, '').toLowerCase();

export function NguoiDung() {
  const [tuKhoa, setTuKhoa] = useState('');
  const [tim, setTim] = useState('');
  const [nhaCC, setNhaCC] = useState('all');
  const [trang, setTrang] = useState(0);
  const [chon, setChon] = useState<ND | null>(null);
  useEffect(() => { const t = setTimeout(() => { setTim(tuKhoa.trim()); setTrang(0); }, 350); return () => clearTimeout(t); }, [tuKhoa]);
  const ds = useTai<ND[]>('/admin/users', { page: trang, size: 20, keyword: tim, provider: nhaCC });
  const tong = ds.pagination?.total ?? 0;
  const soTrang = ds.pagination?.totalPages ?? 1;

  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe="Người dùng" moTa={`${tong.toLocaleString('vi-VN')} tài khoản — tìm, khoá, cấp Pro, đổi quyền.`} dang={ds.dang} onLamMoi={() => void ds.taiLai()} />
      <div className="ct-qt-loc">
        <label className="ct-qt-tim"><Search size={15} /><input value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} placeholder="Tìm theo tên đăng nhập hoặc email…" /></label>
        <div className="ct-qt-tab">
          {[['all', 'Tất cả'], ['credentials', 'Mật khẩu'], ['google', 'Google'], ['github', 'GitHub'], ['apple', 'Apple'], ['facebook', 'Facebook']].map(([k, t]) => (
            <button key={k} type="button" data-chon={nhaCC === k} onClick={() => { setNhaCC(k!); setTrang(0); }}>{t}</button>
          ))}
        </div>
      </div>
      {ds.loi && <p className="ct-qt-loi">{ds.loi}</p>}
      <div className="ct-qt-bang">
        <div className="ct-qt-bang-dau ct-qt-nd-cot"><span>Người dùng</span><span>Đăng nhập</span><span>Vai trò</span><span>Trạng thái</span><span>Tham gia</span></div>
        {(ds.data ?? []).map((u, i) => (
          <button key={u.id} type="button" className="ct-qt-bang-dong ct-qt-nd-cot" style={{ ['--i' as string]: i }} onClick={() => setChon(u)} data-chon={chon?.id === u.id}>
            <span className="ct-qt-nd-ten">
              <Avt ten={u.displayName ?? u.fullName ?? u.username} anh={u.avatarUrl} />
              <span><b>{u.displayName || u.fullName || u.username}</b><small>@{u.username} · {u.email}</small></span>
            </span>
            <span><i className="ct-qt-nhan" style={{ ['--m' as string]: NHA_CC[u.provider ?? 'credentials']?.mau ?? '#94a3b8' }}>{NHA_CC[u.provider ?? 'credentials']?.ten ?? u.provider}</i></span>
            <span className="ct-qt-vaitro">{u.roles.map((r) => <i key={r} className="ct-qt-nhan" data-vt={tenVaiTro(r)}>{tenVaiTro(r)}</i>)}</span>
            <span className="ct-qt-trangthai">
              {!u.enabled ? <i className="ct-qt-cham" data-m="do">Vô hiệu</i> : !u.accountNonLocked ? <i className="ct-qt-cham" data-m="cam">Bị khoá</i> : <i className="ct-qt-cham" data-m="xanh">Hoạt động</i>}
              {u.emailVerified && <i className="ct-qt-cham" data-m="lam">Đã xác minh</i>}
            </span>
            <span className="ct-qt-mo">{tgTuongDoi(u.createdAt)}</span>
          </button>
        ))}
        {!ds.dang && (ds.data ?? []).length === 0 && <Trong chu={tim ? `Không ai khớp “${tim}”.` : 'Chưa có người dùng.'} />}
      </div>
      <div className="ct-qt-phantrang">
        <button type="button" disabled={trang === 0} onClick={() => setTrang((t) => t - 1)}><ChevronLeft size={16} /> Trước</button>
        <span>Trang {trang + 1} / {Math.max(1, soTrang)}</span>
        <button type="button" disabled={trang + 1 >= soTrang} onClick={() => setTrang((t) => t + 1)}>Sau <ChevronRight size={16} /></button>
      </div>
      {chon && <ChiTietND u={chon} dong={() => setChon(null)} capNhat={(m) => { setChon(m); void ds.taiLai(); }} />}
    </div>
  );
}

function ChiTietND({ u, dong, capNhat }: { u: ND; dong: () => void; capNhat: (u: ND) => void }) {
  const lam = useThaoTac();
  const [dang, setDang] = useState<string | null>(null);
  const [bao, setBao] = useState<{ ok: boolean; chu: string } | null>(null);
  const [xacNhanXoa, setXacNhanXoa] = useState('');
  const chay = async (khoa: string, duong: string, method: string, body: unknown, thanhCong: string, sua?: Partial<ND>) => {
    setDang(khoa); setBao(null);
    const r = await lam(duong, method, body);
    setDang(null);
    if (!r.ok) { setBao({ ok: false, chu: r.loi }); return false; }
    setBao({ ok: true, chu: thanhCong });
    if (sua) capNhat({ ...u, ...sua });
    return true;
  };
  const laAdmin = u.roles.some((r) => tenVaiTro(r) === 'admin');
  return (
    <div className="ct-qt-ngan-nen" onClick={dong}>
      <aside className="ct-qt-ngan" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ct-qt-ngan-dong" onClick={dong} aria-label="Đóng"><X size={18} /></button>
        <div className="ct-qt-ngan-dau">
          <Avt ten={u.displayName ?? u.username} anh={u.avatarUrl} co={64} />
          <h2>{u.displayName || u.fullName || u.username}</h2>
          <p>@{u.username} · #{u.id}</p>
          <div className="ct-qt-vaitro">{u.roles.map((r) => <i key={r} className="ct-qt-nhan" data-vt={tenVaiTro(r)}>{tenVaiTro(r)}</i>)}</div>
        </div>
        <ul className="ct-qt-ngan-tt">
          <li><Mail size={15} /> {u.email} {u.emailVerified ? '· đã xác minh' : '· chưa xác minh'}</li>
          <li><Calendar size={15} /> Tham gia {new Date(u.createdAt).toLocaleDateString('vi-VN')}</li>
          <li><ShieldCheck size={15} /> {NHA_CC[u.provider ?? 'credentials']?.ten ?? u.provider}</li>
        </ul>
        {bao && <p className={bao.ok ? 'ct-qt-ok' : 'ct-qt-loi'}>{bao.chu}</p>}
        <h3>Tài khoản</h3>
        <div className="ct-qt-nut-luoi">
          <button type="button" disabled={!!dang} onClick={() => void chay('khoa', `/admin/users/${u.id}/toggle-locked`, 'PATCH', {}, u.accountNonLocked ? 'Đã khoá tài khoản.' : 'Đã mở khoá.', { accountNonLocked: !u.accountNonLocked })}>
            {u.accountNonLocked ? <Lock size={16} /> : <Unlock size={16} />}{u.accountNonLocked ? 'Khoá' : 'Mở khoá'}
          </button>
          <button type="button" disabled={!!dang} onClick={() => void chay('bat', `/admin/users/${u.id}/toggle-enabled`, 'PATCH', {}, u.enabled ? 'Đã vô hiệu hoá.' : 'Đã kích hoạt lại.', { enabled: !u.enabled })}>
            {u.enabled ? <Ban size={16} /> : <CheckCircle2 size={16} />}{u.enabled ? 'Vô hiệu hoá' : 'Kích hoạt'}
          </button>
          <button type="button" disabled={!!dang} onClick={() => void chay('nhac', `/admin/users/${u.id}/toggle-music-access`, 'PATCH', {}, u.musicAccess ? 'Đã tắt quyền nghe nhạc.' : 'Đã bật quyền nghe nhạc.', { musicAccess: !u.musicAccess })}>
            <Music size={16} />{u.musicAccess ? 'Tắt nhạc' : 'Bật nhạc'}
          </button>
          <button type="button" disabled={!!dang} onClick={() => void chay('vt', `/admin/users/${u.id}/roles`, 'PATCH', { roles: laAdmin ? ['user'] : ['user', 'admin'] }, laAdmin ? 'Đã gỡ quyền admin.' : 'Đã cấp quyền admin.', { roles: laAdmin ? ['user'] : ['user', 'admin'] })}>
            <ShieldCheck size={16} />{laAdmin ? 'Gỡ admin' : 'Cấp admin'}
          </button>
        </div>
        <h3><Crown size={15} /> Thành viên Pro</h3>
        <div className="ct-qt-nut-luoi">
          {[[30, '+30 ngày'], [365, '+1 năm'], [null, 'Vĩnh viễn']].map(([so, nhan]) => (
            <button key={String(so)} type="button" disabled={!!dang} onClick={() => void chay(`pro${so}`, '/admin/pro/grant', 'POST', { userId: u.id, durationDays: so }, `Đã cấp Pro ${nhan}.`)}>
              <Crown size={16} />{nhan as string}
            </button>
          ))}
          <button type="button" data-nguyhiem="" disabled={!!dang} onClick={() => void chay('rv', '/admin/pro/revoke', 'POST', { userId: u.id }, 'Đã thu hồi Pro.')}><X size={16} />Thu hồi</button>
        </div>
        <h3 data-nguyhiem="">Vùng nguy hiểm</h3>
        <div className="ct-qt-xoa">
          <p>Xoá vĩnh viễn tài khoản và dữ liệu liên quan. Gõ <b>{u.username}</b> để xác nhận.</p>
          <input value={xacNhanXoa} onChange={(e) => setXacNhanXoa(e.target.value)} placeholder={u.username} />
          <button type="button" data-nguyhiem="" disabled={xacNhanXoa !== u.username || !!dang} onClick={() => void chay('xoa', `/admin/users/${u.id}`, 'DELETE', undefined, 'Đã xoá tài khoản.').then((ok) => { if (ok) dong(); })}>
            <Trash2 size={16} /> Xoá tài khoản
          </button>
        </div>
      </aside>
    </div>
  );
}
