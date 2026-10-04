/**
 * Quản trị · Báo cáo vi phạm (tin nhắn) — GET /admin/reports?status=open|resolved,
 * POST /admin/reports/:id/resolve { resolution }. (05/10/2026)
 */
import { useState } from 'react';
import { Flag, CheckCircle2, MessageSquare } from 'lucide-react';
import { Avt, DauMuc, Trong, tgTuongDoi, useTai, useThaoTac } from '../chung';

type Nguoi = { id: number; username: string; displayName?: string | null; fullName?: string | null; avatarUrl?: string | null } | null;
type BC = {
  id: number; reason: string; category: string | null; createdAt: string; resolvedAt: string | null; resolution: string | null;
  reporter: Nguoi; resolver: Nguoi;
  thread: { id: number; type: string; userA: Nguoi; userB: Nguoi; lastMessage: { content?: string | null } | null } | null;
};
const ten = (n: Nguoi) => n?.displayName || n?.fullName || n?.username || 'Ẩn danh';

export function BaoCao() {
  const [loc, setLoc] = useState<'open' | 'resolved'>('open');
  const ds = useTai<{ rows: BC[] }>('/admin/reports', { status: loc, take: 50 });
  const lam = useThaoTac();
  const [ghiChu, setGhiChu] = useState<Record<number, string>>({});
  const [loi, setLoi] = useState<string | null>(null);
  const xuLy = async (id: number) => {
    const r = await lam(`/admin/reports/${id}/resolve`, 'POST', { resolution: ghiChu[id]?.trim() || 'Đã xem xét' });
    if (!r.ok) setLoi(r.loi); else void ds.taiLai();
  };
  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe="Báo cáo vi phạm" moTa="Người dùng báo cáo cuộc trò chuyện — xem nội dung, ghi kết luận, đánh dấu đã xử lý." dang={ds.dang} onLamMoi={() => void ds.taiLai()}>
        <div className="ct-qt-tab">
          <button type="button" data-chon={loc === 'open'} onClick={() => setLoc('open')}>Đang mở</button>
          <button type="button" data-chon={loc === 'resolved'} onClick={() => setLoc('resolved')}>Đã xử lý</button>
        </div>
      </DauMuc>
      {(ds.loi || loi) && <p className="ct-qt-loi">{ds.loi || loi}</p>}
      <div className="ct-qt-the-ds">
        {(ds.data?.rows ?? []).map((b, i) => (
          <article key={b.id} className="ct-qt-the-bc" style={{ ['--i' as string]: i }} data-xong={!!b.resolvedAt}>
            <div className="ct-qt-bc-dau">
              <span className="ct-qt-bc-icon"><Flag size={16} /></span>
              <div><b>{b.category ?? 'Báo cáo'}</b><small>#{b.id} · {tgTuongDoi(b.createdAt)}</small></div>
              <span className="ct-qt-bc-nguoi"><Avt ten={ten(b.reporter)} anh={b.reporter?.avatarUrl} co={26} /> {ten(b.reporter)} báo cáo</span>
            </div>
            <p className="ct-qt-bc-lydo">“{b.reason}”</p>
            {b.thread && (
              <div className="ct-qt-bc-thread">
                <MessageSquare size={14} /> Cuộc trò chuyện #{b.thread.id}: <b>{ten(b.thread.userA)}</b> ↔ <b>{ten(b.thread.userB)}</b>
                {b.thread.lastMessage?.content && <q>{b.thread.lastMessage.content.slice(0, 160)}</q>}
              </div>
            )}
            {b.resolvedAt ? (
              <p className="ct-qt-ok"><CheckCircle2 size={15} /> {ten(b.resolver)} xử lý {tgTuongDoi(b.resolvedAt)}: {b.resolution}</p>
            ) : (
              <div className="ct-qt-bc-xuly">
                <input value={ghiChu[b.id] ?? ''} onChange={(e) => setGhiChu((g) => ({ ...g, [b.id]: e.target.value }))} placeholder="Kết luận (vd: đã cảnh cáo, không vi phạm…)" />
                <button type="button" className="ct-qt-nut" onClick={() => void xuLy(b.id)}><CheckCircle2 size={15} /> Đã xử lý</button>
              </div>
            )}
          </article>
        ))}
        {!ds.dang && (ds.data?.rows ?? []).length === 0 && <Trong chu={loc === 'open' ? 'Không có báo cáo nào đang mở. Cộng đồng đang yên bình 🌿' : 'Chưa có báo cáo đã xử lý.'} />}
      </div>
    </div>
  );
}
