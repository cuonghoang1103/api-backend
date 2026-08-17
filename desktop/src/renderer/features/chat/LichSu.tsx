/**
 * Danh sách việc đã lưu.
 *
 * ─── VÌ SAO LÀ TẤM PHỦ CHỨ KHÔNG PHẢI CỘT BÊN ───
 * Cột bên thường trực nghe tiện hơn, nhưng màn hình này đã có ba thứ tranh chỗ:
 * thanh phạm vi quyền, bảng ghi, ô soạn. Thêm một cột nữa thì bảng ghi — thứ
 * người dùng thật sự đọc — teo lại ở mọi lúc, chỉ để phục vụ một thao tác họ
 * làm vài lần một ngày.
 *
 * ─── KHÔNG CÓ XÁC NHẬN KHI XOÁ, VÀ ĐÓ LÀ CÓ CHỦ Ý ───
 * Xoá một phiên không mất gì trên đĩa của người dùng: mã nguồn vẫn nguyên, file
 * đã sửa vẫn sửa. Thứ mất là một bản ghi hội thoại. Hộp thoại "bạn chắc chưa"
 * cho một việc như thế chỉ dạy người ta bấm Đồng ý mà không đọc — rồi tới lúc
 * gặp hộp thoại thật sự quan trọng, họ cũng bấm y như vậy.
 */
import { Clock, FolderOpen, MessagesSquare, Trash2, X } from 'lucide-react';
import type { AgentPhien } from '../../../shared/ipc';

/** "3 phút trước", "hôm qua" — mốc tuyệt đối không giúp người ta nhận ra việc nào. */
function baoLau(luc: number): string {
  const giay = Math.max(0, (Date.now() - luc) / 1000);
  if (giay < 60) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
  if (giay < 172800) return 'hôm qua';
  return new Date(luc).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export function LichSu({
  phien,
  dangMo,
  onMo,
  onXoa,
  onDong,
}: {
  phien: AgentPhien[];
  /** id phiên đang mở — đánh dấu để người dùng biết mình đang ở đâu. */
  dangMo: string | null;
  onMo: (id: string) => void;
  onXoa: (id: string) => void;
  onDong: () => void;
}) {
  return (
    <div className="ct-lichsu-phu" onClick={onDong}>
      {/* Chặn nổi bọt: bấm TRONG bảng không được đóng bảng. */}
      <div className="ct-lichsu" onClick={(e) => e.stopPropagation()}>
        <div className="ct-lichsu-dau">
          <MessagesSquare size={15} aria-hidden />
          <strong>Việc đã lưu</strong>
          <span className="ct-muted-inline">{phien.length}</span>
          <button type="button" className="ct-agent-icon" onClick={onDong} title="Đóng">
            <X size={14} aria-hidden />
          </button>
        </div>

        {phien.length === 0 ? (
          <p className="ct-muted" style={{ padding: '14px 4px', margin: 0 }}>
            Chưa có việc nào được lưu. Mỗi việc bạn hỏi sẽ tự lưu lại sau khi agent chạy xong.
          </p>
        ) : (
          <ul className="ct-lichsu-ds">
            {phien.map((p) => (
              <li key={p.id} className="ct-lichsu-muc" data-dangmo={p.id === dangMo}>
                <button type="button" className="ct-lichsu-mo" onClick={() => onMo(p.id)} title={p.tieuDe}>
                  <span className="ct-lichsu-tieude">{p.tieuDe}</span>
                  <span className="ct-lichsu-meta">
                    {p.duAn && (<><FolderOpen size={11} aria-hidden /> {p.duAn} · </>)}
                    <Clock size={11} aria-hidden /> {baoLau(p.luucLuc)}
                  </span>
                </button>
                <button
                  type="button"
                  className="ct-agent-icon"
                  onClick={() => onXoa(p.id)}
                  title="Xoá việc này khỏi danh sách (không đụng tới mã nguồn)"
                >
                  <Trash2 size={13} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="ct-lichsu-chan">
          Hội thoại lưu trên máy bạn. Mở lại một việc thì agent nhớ tiếp từ đúng chỗ đó —
          nhưng <strong>quyền đã cấp và nút Hoàn tác không khôi phục theo</strong>.
        </p>
      </div>
    </div>
  );
}
