/**
 * Tổng quan quản trị — số liệu, việc cần xử lý, sức khoẻ máy chủ (05/10/2026).
 * Nguồn: GET /admin/stats/overview, /admin/reports/stats, /admin/deletion-requests/stats,
 * /admin/thong-bao/dem.
 */
import { Users, Activity, FileText, MessageSquare, FolderKanban, Flag, UserX, BellRing, Server, Database, Cloud, Clock, ArrowRight } from 'lucide-react';
import { useSession } from '../../../auth/session';
import { DauMuc, TheSo, VongDo, dungLuong, useTai } from '../chung';

type TongQuanDl = {
  totalUsers: number; totalPosts: number; totalProjects: number; totalMessages: number; activeSessions: number; totalViews: number;
  uptimeFormatted: string;
  system: {
    host: { memPercent: number; memUsedBytes: number; memTotalBytes: number; loadPercent: number; cores: number; load1: number };
    disk?: { percent?: number; usedBytes?: number; totalBytes?: number } | null;
    r2?: { objectCount: number; totalBytes: number } | null;
    dbSizeBytes?: number | null;
    redisMemoryBytes?: number | null;
  };
};

export function TongQuan({ diToi }: { diToi: (muc: string) => void }) {
  const { user } = useSession();
  const tq = useTai<TongQuanDl>('/admin/stats/overview');
  const bc = useTai<{ open: number; resolved24h: number; total: number }>('/admin/reports/stats');
  const xoa = useTai<Record<string, number>>('/admin/deletion-requests/stats');
  const hop = useTai<{ chuaDoc?: number; canXuLy?: number }>('/admin/thong-bao/dem');
  const d = tq.data;
  const gio = new Date().getHours();
  const chao = gio < 11 ? 'Chào buổi sáng' : gio < 14 ? 'Chào buổi trưa' : gio < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const lamMoi = () => { void tq.taiLai(); void bc.taiLai(); void xoa.taiLai(); void hop.taiLai(); };
  const choXoa = xoa.data?.PENDING ?? xoa.data?.pending ?? 0;
  const viec = [
    { muc: 'bao-cao', icon: <Flag size={18} />, mau: '#f43f5e', so: bc.data?.open ?? 0, nhan: 'Báo cáo vi phạm đang mở' },
    { muc: 'yeu-cau-xoa', icon: <UserX size={18} />, mau: '#f59e0b', so: choXoa, nhan: 'Yêu cầu xoá tài khoản chờ duyệt' },
    { muc: 'hop-thu', icon: <BellRing size={18} />, mau: '#22d3ee', so: hop.data?.canXuLy ?? 0, nhan: 'Việc cần xử lý trong hộp thư' },
  ];
  const disk = d?.system.disk;
  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe={`${chao}, ${user?.fullName ?? user?.username ?? 'quản trị viên'} 👋`} moTa="Toàn cảnh CuongThai lúc này — số liệu, việc chờ bạn và sức khoẻ máy chủ." dang={tq.dang} onLamMoi={lamMoi} />
      {tq.loi && <p className="ct-qt-loi">{tq.loi}</p>}

      <div className="ct-qt-luoi-so">
        <TheSo i={0} nhan="Người dùng" so={d?.totalUsers?.toLocaleString('vi-VN') ?? '—'} icon={<Users size={18} />} mau="#a78bfa" />
        <TheSo i={1} nhan="Hoạt động 24 giờ" so={d?.activeSessions?.toLocaleString('vi-VN') ?? '—'} icon={<Activity size={18} />} mau="#22c55e" phu={d ? `${Math.round((d.activeSessions / Math.max(1, d.totalUsers)) * 100)}% người dùng` : undefined} />
        <TheSo i={2} nhan="Bài viết" so={d?.totalPosts?.toLocaleString('vi-VN') ?? '—'} icon={<FileText size={18} />} mau="#f472b6" phu={d ? `${d.totalViews.toLocaleString('vi-VN')} lượt xem` : undefined} />
        <TheSo i={3} nhan="Tin nhắn AI" so={d?.totalMessages?.toLocaleString('vi-VN') ?? '—'} icon={<MessageSquare size={18} />} mau="#22d3ee" />
        <TheSo i={4} nhan="Dự án" so={d?.totalProjects?.toLocaleString('vi-VN') ?? '—'} icon={<FolderKanban size={18} />} mau="#f59e0b" />
      </div>

      <div className="ct-qt-2cot">
        <section className="ct-qt-khoi">
          <h2>Việc cần xử lý</h2>
          <div className="ct-qt-viec">
            {viec.map((v) => (
              <button key={v.muc} type="button" className="ct-qt-viec-dong" style={{ ['--m' as string]: v.mau }} onClick={() => diToi(v.muc)} data-co={v.so > 0}>
                <span className="ct-qt-viec-icon">{v.icon}</span>
                <span className="ct-qt-viec-chu">{v.nhan}</span>
                <b>{v.so}</b>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          {bc.data && <p className="ct-qt-ghichu">Đã xử lý {bc.data.resolved24h} báo cáo trong 24 giờ qua · tổng {bc.data.total}.</p>}
        </section>

        <section className="ct-qt-khoi">
          <h2><Server size={17} /> Sức khoẻ máy chủ</h2>
          {d ? (
            <>
              <div className="ct-qt-vong-hang">
                <VongDo phanTram={d.system.host.memPercent} nhan="RAM" phu={`${dungLuong(d.system.host.memUsedBytes)} / ${dungLuong(d.system.host.memTotalBytes)}`} />
                <VongDo phanTram={d.system.host.loadPercent} nhan="CPU" phu={`tải ${d.system.host.load1} · ${d.system.host.cores} nhân`} />
                {disk?.percent != null && <VongDo phanTram={disk.percent} nhan="Đĩa" phu={`${dungLuong(disk.usedBytes)} / ${dungLuong(disk.totalBytes)}`} />}
              </div>
              <ul className="ct-qt-thongso">
                <li><Clock size={15} /> Chạy liên tục <b>{d.uptimeFormatted}</b></li>
                <li><Database size={15} /> CSDL <b>{dungLuong(d.system.dbSizeBytes)}</b>{d.system.redisMemoryBytes != null && <> · Redis <b>{dungLuong(d.system.redisMemoryBytes)}</b></>}</li>
                {d.system.r2 && <li><Cloud size={15} /> R2 <b>{dungLuong(d.system.r2.totalBytes)}</b> · {d.system.r2.objectCount.toLocaleString('vi-VN')} tệp</li>}
              </ul>
            </>
          ) : <p className="ct-qt-ghichu">{tq.dang ? 'Đang đo…' : 'Chưa có số liệu.'}</p>}
        </section>
      </div>
    </div>
  );
}
