/**
 * ============================================================
 * GỢI Ý TÊN FILE — gõ `@` trong ô soạn
 * ============================================================
 *
 * Anh em với `GoiYLenh`, và cố ý giữ CÙNG cách bấm (↑↓ · Enter/Tab · Esc):
 * hai bảng gợi ý trong cùng một ô nhập mà hành xử khác nhau thì người dùng
 * phải nhớ đang ở bảng nào trước khi bấm phím — đó không phải tính năng.
 *
 * Khác ở một điểm quan trọng: `/` chỉ có ở ĐẦU câu, còn `@` nằm giữa dòng.
 * Nên ở đây phải tìm đúng "từ đang gõ" quanh con trỏ rồi chỉ thay đúng đoạn
 * đó — thay cả ô nhập sẽ xoá mất câu người dùng đã viết.
 */
import { useEffect, useMemo, useRef, useState } from 'react';

export interface TokenFile {
  /** Phần dùng để TÌM — đã bỏ phần `:dòng` phía sau. */
  tim: string;
  /** Phần `:10-40` người dùng đã gõ, giữ nguyên khi chèn đường dẫn. */
  duoi: string;
  dau: number;
  cuoi: number;
}

/**
 * Tìm đoạn `@…` mà con trỏ đang nằm trong.
 *
 * Trả `null` khi không có — và những trường hợp "không có" mới là phần đáng
 * kiểm:
 *  • `@` phải đứng đầu dòng hoặc sau khoảng trắng. Không có luật này thì
 *    `user@example.com` và mọi địa chỉ email đều bật bảng gợi ý lên.
 *  • Có khoảng trắng giữa `@` và con trỏ ⇒ họ đã gõ xong, đừng chen vào.
 *
 * Phần `:10-40` được TÁCH RA khỏi chuỗi tìm: gõ `@loop:10-` mà đem cả cụm đi
 * khớp thì không file nào trúng và bảng gợi ý biến mất giữa chừng — đúng lúc
 * người dùng vẫn đang gõ.
 */
export function docTokenFile(chu: string, caret: number): TokenFile | null {
  const truoc = chu.slice(0, caret);
  const i = truoc.lastIndexOf('@');
  if (i < 0) return null;
  const truocDo = i === 0 ? '' : truoc[i - 1]!;
  if (i > 0 && !/\s/.test(truocDo)) return null;
  const giua = truoc.slice(i + 1);
  if (/\s/.test(giua)) return null;
  const cat = giua.indexOf(':');
  return cat < 0
    ? { tim: giua, duoi: '', dau: i, cuoi: caret }
    : { tim: giua.slice(0, cat), duoi: giua.slice(cat), dau: i, cuoi: caret };
}

export function GoiYFile({
  cuocId, token, onChon, onDong,
}: {
  cuocId: string;
  token: TokenFile;
  onChon: (duong: string, token: TokenFile) => void;
  onDong: () => void;
}) {
  const [ds, datDs] = useState<string[]>([]);
  const [chon, datChon] = useState(0);
  const tim = token.tim;

  /*
   * ⚠️ Chống ĐUA KẾT QUẢ. Gõ nhanh thì nhiều lời gọi bay đi cùng lúc và chúng
   * KHÔNG chắc về theo đúng thứ tự — kết quả của `ag` về sau kết quả của
   * `agent` sẽ đè lên, và danh sách hiện ra không khớp thứ đang gõ. Chỉ nhận
   * kết quả của lần gọi MỚI NHẤT.
   */
  const luot = useRef(0);
  useEffect(() => {
    const cua = ++luot.current;
    let con = true;
    void window.cuongthai?.agent.timFile(cuocId, tim)
      .then((r) => { if (con && cua === luot.current) { datDs(r); datChon(0); } })
      .catch(() => { if (con && cua === luot.current) datDs([]); });
    return () => { con = false; };
  }, [cuocId, tim]);

  const hien = useMemo(() => ds.slice(0, 12), [ds]);

  useEffect(() => {
    if (hien.length === 0) return;
    const phim = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowDown') { e.preventDefault(); datChon((c) => (c + 1) % hien.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); datChon((c) => (c - 1 + hien.length) % hien.length); }
      else if (e.key === 'Enter' || e.key === 'Tab') {
        // Chặn Enter vì đúng lý do như bảng lệnh: không chặn thì câu đang gõ dở
        // bay đi làm một lượt hỏi thật, tốn tiền cho một câu chưa viết xong.
        e.preventDefault();
        const d = hien[chon];
        if (d !== undefined) onChon(d, token);
      } else if (e.key === 'Escape') { e.preventDefault(); onDong(); }
    };
    window.addEventListener('keydown', phim, true);
    return () => window.removeEventListener('keydown', phim, true);
  }, [hien, chon, onChon, onDong, token]);

  if (hien.length === 0) return null;

  return (
    <div className="ct-goiy" role="listbox" aria-label="File trong dự án">
      {hien.map((d, i) => {
        /* Thư mục kết thúc bằng `/`. Cắt nó ra trước khi tìm dấu `/` cuối, nếu
           không thì tên hiển thị của mọi thư mục đều thành chuỗi rỗng. */
        const laThuMuc = d.endsWith('/');
        const goc2 = laThuMuc ? d.slice(0, -1) : d;
        const cat = goc2.lastIndexOf('/');
        return (
          <button
            key={d}
            type="button"
            role="option"
            aria-selected={i === chon}
            data-chon={i === chon}
            onMouseEnter={() => datChon(i)}
            onClick={() => onChon(d, token)}
          >
            <code data-thumuc={laThuMuc}>{cat >= 0 ? d.slice(cat + 1) : d}</code>
            {cat >= 0 ? <span className="ct-goiy-duong">{goc2.slice(0, cat)}</span> : null}
          </button>
        );
      })}
      <p className="ct-goiy-chan">↑↓ chọn · Enter hoặc Tab để chèn · Esc để bỏ</p>
    </div>
  );
}
