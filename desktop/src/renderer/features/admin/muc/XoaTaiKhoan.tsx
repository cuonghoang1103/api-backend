/**
 * Quản trị · Yêu cầu xoá tài khoản (Luật BVDLCN) — GET /admin/deletion-requests,
 * POST /:id/approve (ẨN DANH HOÁ — KHÔNG HOÀN TÁC), /:id/reject { reason }. (05/10/2026)
 */
import { useState } from 'react';
import { UserX, ShieldAlert } from 'lucide-react';
import { Avt, DauMuc, Trong, tgTuongDoi, useTai, useThaoTac } from '../chung';

type YC = { id: number; status: string; reason?: string | null; createdAt: string; usernameAtRequest?: string | null; user: { id: number; username: string; email: string; displayName: string | null; avatarUrl: string | null } | null; reviewedBy: { username: string } | null };

export function XoaTaiKhoan() {
  const [loc, setLoc] = useState('PENDING');
  const ds = useTai<{ items: YC[] }>('/admin/deletion-requests', { status: loc, take: 50 });
  const lam = useThaoTac();
  const [xn, setXn] = useState<number | null>(null);
  // Electron KHÔNG có window.prompt (luôn trả null) — lý do từ chối nhập ngay trong thẻ.
  const [tuChoi, setTuChoi] = useState<{ id: number; lyDo: string } | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const chay = async (duong: string, body?: unknown) => { setLoi(null); const r = await lam(duong, 'POST', body); if (!r.ok) setLoi(r.loi); setXn(null); void ds.taiLai(); };
  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe="Yêu cầu xoá tài khoản" moTa="Duyệt là ẨN DANH HOÁ vĩnh viễn — không hoàn tác được. Từ chối cần ghi lý do." dang={ds.dang} onLamMoi={() => void ds.taiLai()}>
        <div className="ct-qt-tab">
          {[['PENDING', 'Chờ duyệt'], ['APPROVED', 'Đã duyệt'], ['REJECTED', 'Từ chối'], ['CANCELLED', 'Đã huỷ']].map(([k, t]) => (
            <button key={k} type="button" data-chon={loc === k} onClick={() => setLoc(k!)}>{t}</button>
          ))}
        </div>
      </DauMuc>
      {(ds.loi || loi) && <p className="ct-qt-loi">{ds.loi || loi}</p>}
      <div className="ct-qt-the-ds">
        {(ds.data?.items ?? []).map((y, i) => (
          <article key={y.id} className="ct-qt-the-bc" style={{ ['--i' as string]: i }}>
            <div className="ct-qt-bc-dau">
              <Avt ten={y.user?.displayName ?? y.user?.username ?? y.usernameAtRequest} anh={y.user?.avatarUrl} co={36} />
              <div><b>{y.user?.displayName || y.user?.username || y.usernameAtRequest}</b><small>@{y.user?.username ?? y.usernameAtRequest} · {y.user?.email} · {tgTuongDoi(y.createdAt)}</small></div>
              <i className="ct-qt-nhan">{y.status}</i>
            </div>
            {y.reason && <p className="ct-qt-bc-lydo">“{y.reason}”</p>}
            {y.status === 'PENDING' && (xn === y.id ? (
              <div className="ct-qt-xoa">
                <p><ShieldAlert size={15} /> Ẩn danh hoá <b>@{y.user?.username}</b> vĩnh viễn?</p>
                <div className="ct-qt-nut-luoi">
                  <button type="button" data-nguyhiem="" onClick={() => void chay(`/admin/deletion-requests/${y.id}/approve`)}><UserX size={15} /> Xác nhận duyệt</button>
                  <button type="button" onClick={() => setXn(null)}>Huỷ</button>
                </div>
              </div>
            ) : (
              <div className="ct-qt-nut-luoi">
                <button type="button" data-nguyhiem="" onClick={() => setXn(y.id)}><UserX size={15} /> Duyệt xoá</button>
                {tuChoi?.id === y.id ? (
                  <form className="ct-qt-bc-xuly" onSubmit={(e) => { e.preventDefault(); if (tuChoi.lyDo.trim()) void chay(`/admin/deletion-requests/${y.id}/reject`, { reason: tuChoi.lyDo.trim() }).then(() => setTuChoi(null)); }}>
                    <input autoFocus value={tuChoi.lyDo} onChange={(e) => setTuChoi({ id: y.id, lyDo: e.target.value })} placeholder="Lý do từ chối (gửi cho người dùng)" />
                    <button type="submit" className="ct-qt-nut" disabled={!tuChoi.lyDo.trim()}>Gửi</button>
                  </form>
                ) : <button type="button" onClick={() => setTuChoi({ id: y.id, lyDo: '' })}>Từ chối</button>}
              </div>
            ))}
          </article>
        ))}
        {!ds.dang && (ds.data?.items ?? []).length === 0 && <Trong chu="Không có yêu cầu nào ở mục này." />}
      </div>
    </div>
  );
}
