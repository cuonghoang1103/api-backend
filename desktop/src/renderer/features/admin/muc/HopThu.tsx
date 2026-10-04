/**
 * Quản trị · Hộp thư admin — GET /admin/thong-bao (chuaDoc, canXuLy), POST /:id/doc,
 * /:id/xong, /doc-het. Sự kiện hệ thống cần admin biết hoặc phải làm (05/10/2026).
 */
import { useState } from 'react';
import { BellRing, CheckCheck, CircleAlert, Info, ExternalLink, Check } from 'lucide-react';
import { DauMuc, Trong, tgTuongDoi, useTai, useThaoTac } from '../chung';

type TB = { id: number; loai: string; tieuDe: string; noiDung: string | null; duongDan: string | null; mucDo: string; daDoc: boolean; daXuLy: boolean; createdAt: string; nguoi: { id: number; username: string | null; fullName: string | null } | null };

export function HopThu() {
  const [loc, setLoc] = useState<'tat-ca' | 'chua-doc' | 'can-xu-ly'>('can-xu-ly');
  const ds = useTai<{ items: TB[]; chuaDoc: number; canXuLy: number }>('/admin/thong-bao', { limit: 60, chuaDoc: loc === 'chua-doc' ? 1 : undefined, canXuLy: loc === 'can-xu-ly' ? 1 : undefined });
  const lam = useThaoTac();
  const chay = async (duong: string) => { await lam(duong, 'POST'); void ds.taiLai(); };
  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe="Hộp thư admin" moTa="Sự kiện hệ thống: xin khoá AI, đơn hàng, lỗi máy chủ, yêu cầu dự án…" dang={ds.dang} onLamMoi={() => void ds.taiLai()}>
        <button type="button" className="ct-qt-nut-phu" onClick={() => void chay('/admin/thong-bao/doc-het')}><CheckCheck size={15} /> Đọc hết</button>
      </DauMuc>
      <div className="ct-qt-tab ct-qt-tab-rong">
        <button type="button" data-chon={loc === 'can-xu-ly'} onClick={() => setLoc('can-xu-ly')}>Cần xử lý <small>{ds.data?.canXuLy ?? 0}</small></button>
        <button type="button" data-chon={loc === 'chua-doc'} onClick={() => setLoc('chua-doc')}>Chưa đọc <small>{ds.data?.chuaDoc ?? 0}</small></button>
        <button type="button" data-chon={loc === 'tat-ca'} onClick={() => setLoc('tat-ca')}>Tất cả</button>
      </div>
      {ds.loi && <p className="ct-qt-loi">{ds.loi}</p>}
      <div className="ct-qt-hopthu">
        {(ds.data?.items ?? []).map((t, i) => (
          <article key={t.id} className="ct-qt-tb" style={{ ['--i' as string]: i }} data-doc={t.daDoc} data-muc={t.mucDo} data-xong={t.daXuLy}>
            <span className="ct-qt-tb-icon">{t.mucDo === 'can_xu_ly' ? <CircleAlert size={18} /> : t.mucDo === 'quan_trong' ? <BellRing size={18} /> : <Info size={18} />}</span>
            <div className="ct-qt-tb-chu">
              <b>{t.tieuDe}</b>
              {t.noiDung && <p>{t.noiDung}</p>}
              <small>{t.loai} · {tgTuongDoi(t.createdAt)}{t.nguoi && ` · @${t.nguoi.username ?? t.nguoi.id}`}</small>
            </div>
            <div className="ct-qt-tb-nut">
              {t.duongDan && <button type="button" title="Mở trên web" onClick={() => void window.cuongthai?.app.getInfo().then((x) => window.cuongthai?.app.openExternal(`${x.webOrigin}${t.duongDan}`))}><ExternalLink size={15} /></button>}
              {!t.daDoc && <button type="button" title="Đánh dấu đã đọc" onClick={() => void chay(`/admin/thong-bao/${t.id}/doc`)}><Check size={15} /></button>}
              {t.mucDo === 'can_xu_ly' && !t.daXuLy && <button type="button" className="ct-qt-nut" onClick={() => void chay(`/admin/thong-bao/${t.id}/xong`)}>Xong</button>}
            </div>
          </article>
        ))}
        {!ds.dang && (ds.data?.items ?? []).length === 0 && <Trong chu={loc === 'can-xu-ly' ? 'Không còn việc nào phải làm. Tuyệt vời!' : 'Hộp thư trống.'} />}
      </div>
    </div>
  );
}
