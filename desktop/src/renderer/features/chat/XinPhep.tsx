/**
 * THẺ DUYỆT — chỗ duy nhất người dùng chặn được agent trước khi nó ghi đĩa.
 *
 * ─── VÌ SAO CÁI THẺ NÀY PHẢI KHÓ BẤM BỪA ───
 * Cách hỏng của mọi tầng xin phép không phải là bị vượt qua — mà là hỏi nhiều
 * tới mức người dùng bấm "cho phép" theo phản xạ, không đọc. Lúc đó lớp bảo vệ
 * vẫn còn nguyên trên màn hình và đã hết tác dụng hoàn toàn.
 *
 * Ba thứ ở đây chống lại điều đó:
 *  1. Diff hiện SẴN, không phải bấm "xem chi tiết" mới thấy. Thứ phải bấm mới
 *     thấy thì không ai bấm.
 *  2. Diff đã RÚT GỌN quanh chỗ sửa (±3 dòng). Đổi 2 dòng mà hiện 800 dòng thì
 *     người dùng cũng không đọc.
 *  3. "Cho phép cả file này" thay cho "cho phép tất". Sửa mười chỗ trong một
 *     file thì chỉ bấm một lần — nhưng agent chạm sang file khác là hỏi lại.
 *     Đây là chỗ đổi chác giữa phiền và an toàn, và nó nghiêng theo cách người
 *     ta thật sự làm việc: sửa sâu vài file, không rải khắp dự án.
 */
import { Check, CheckCheck, FilePlus2, FilePen, X } from 'lucide-react';
import type { AgentDiff, AgentQuyetDinh } from '../../../shared/ipc';

export interface TheXinPhep {
  id: string;
  ten: string;
  duongDan: string;
  taoMoi: boolean;
  diff: AgentDiff;
}

export function XinPhep({
  the,
  traLoi,
}: {
  the: TheXinPhep;
  traLoi: (id: string, q: AgentQuyetDinh) => void;
}) {
  return (
    <div className="ct-xinphep">
      <div className="ct-xinphep-dau">
        {the.taoMoi ? <FilePlus2 size={14} aria-hidden /> : <FilePen size={14} aria-hidden />}
        <code className="ct-xinphep-duongdan">{the.duongDan}</code>
        <span className="ct-xinphep-dem">
          {the.taoMoi ? 'tạo mới' : <>
            <span className="ct-xinphep-them">+{the.diff.soThem}</span>
            {' '}
            <span className="ct-xinphep-bo">−{the.diff.soBo}</span>
          </>}
        </span>
      </div>

      {the.diff.quaLon && (
        <div className="ct-notice" data-tone="warn" style={{ margin: '0 0 8px' }}>
          <span>Thay đổi quá lớn để so từng dòng — bảng dưới hiện nguyên cả hai bản.</span>
        </div>
      )}

      <div className="ct-diff">
        {the.diff.dong.map((d, i) => {
          // Dòng "…" ngăn cách hai cụm thay đổi: cùng kiểu dữ liệu, cả hai số
          // dòng đều null. Xem `rutGonNguCanh` trong main/agent/diff.ts.
          if (d.loai === 'giu' && d.soCu === null && d.soMoi === null) {
            return <div key={i} className="ct-diff-ngat">⋯</div>;
          }
          return (
            <div key={i} className="ct-diff-dong" data-loai={d.loai}>
              <span className="ct-diff-so">{d.soCu ?? ''}</span>
              <span className="ct-diff-so">{d.soMoi ?? ''}</span>
              <span className="ct-diff-dau">{d.loai === 'them' ? '+' : d.loai === 'bo' ? '−' : ' '}</span>
              {/* `pre-wrap` + text thô: KHÔNG dangerouslySetInnerHTML. Nội dung
                  này đến từ mã nguồn của người dùng, và một file HTML bất kỳ
                  trong dự án sẽ chạy ngay trong renderer nếu dựng bằng innerHTML. */}
              <span className="ct-diff-text">{d.text || ' '}</span>
            </div>
          );
        })}
      </div>

      <div className="ct-xinphep-nut">
        <button type="button" className="ct-btn" onClick={() => traLoi(the.id, 'choPhep')}>
          <Check size={14} aria-hidden />
          Cho phép
        </button>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => traLoi(the.id, 'choPhepCaFile')}>
          <CheckCheck size={14} aria-hidden />
          Cho phép cả file này
        </button>
        <button type="button" className="ct-btn ct-btn-ghost ct-xinphep-tuchoi" onClick={() => traLoi(the.id, 'tuChoi')}>
          <X size={14} aria-hidden />
          Từ chối
        </button>
      </div>
    </div>
  );
}
