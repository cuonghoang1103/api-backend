/**
 * ============================================================
 * LỊCH HÔM NAY
 * ============================================================
 *
 * Bảng tuần bên dưới trả lời "tuần này học gì". Khối này trả lời câu người ta
 * hỏi mười lần một ngày: **"giờ tới đi đâu?"** — bằng bảng tuần thì phải tìm
 * cột hôm nay, dò xuống, rồi tự so giờ trong đầu.
 *
 * Nó đứng TRƯỚC bảng tuần và sau việc hôm nay: việc là thứ mình tự đặt ra,
 * lịch học là thứ đã cố định — nhưng "sắp phải đi đâu" thì gấp hơn cả hai.
 *
 * ⚠️ Không tự gọi API. Buổi hôm nay do `LichHoc` lọc sẵn rồi truyền lên (xem
 * `onHomNay`): hai lời gọi cùng một dữ liệu thì hai lần nạp lệch nhau sẽ làm
 * khối này với bảng tuần nói hai chuyện khác nhau.
 */
import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';

import { mauMon, type Buoi } from '@/lib/lich/chung';
import { soConLai, xepHomNay } from './xepLichHomNay';
import { useDich } from '../../i18n';

/** Nhịp đập lại để đếm ngược không đứng hình. Một phút là đủ mịn cho phút. */
const NHIP_MS = 60_000;

/**
 * "còn 1 giờ 35 phút".
 *
 * ⚠️ KHÔNG dùng `moTaKhoang` của `nhacLichRobot`: nó ghép sẵn chuỗi tiếng Việt
 * nên không dịch được — câu ra từ nó sẽ nằm nguyên tiếng Việt giữa giao diện
 * tiếng Anh. Ghép bằng CHỖ THAY để bản dịch đảo được thứ tự.
 */
function cauConLai(phut: number, dichP: (c: string, t: Record<string, string | number>) => string): string {
  const p = Math.max(0, Math.round(phut));
  const g = Math.floor(p / 60);
  const le = p % 60;
  if (g === 0) return dichP('còn {n} phút', { n: le });
  if (le === 0) return dichP('còn {n} giờ', { n: g });
  return dichP('còn {g} giờ {p} phút', { g, p: le });
}

export function LichHomNay({ buoi }: { buoi: Buoi[] }) {
  const { dich, dichP } = useDich();
  /* Đồng hồ riêng: `xepHomNay` phụ thuộc thời gian, mà React không dựng lại
     chỉ vì đồng hồ tường chạy. Không có nhịp này thì "còn 35 phút" đứng yên
     cho tới khi người dùng bấm vào đâu đó. */
  const [nhip, datNhip] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => datNhip(Date.now()), NHIP_MS);
    return () => clearInterval(t);
  }, []);

  const ds = useMemo(() => xepHomNay(buoi, new Date(nhip)), [buoi, nhip]);
  const conLai = soConLai(ds);

  if (ds.length === 0) return null;   // Bảng tuần đã nói "chưa có lịch" rồi.

  return (
    <section className="ct-tq-khoi ct-homnay">
      <div className="ct-tq-khoi-dau">
        {/* KHÔNG gắn biểu tượng vào `h2` này. `.ct-tq-khoi-dau h2` là khối
            chữ 12px viết hoa, không phải flex — một SVG 15px nhét vào sẽ tràn
            lên trên và ĐÈ vào chữ (đo thật, ảnh chụp 14/09). Mấy khối cùng
            vùng ("MỘT NGÀY CỦA BẠN", "ĐI NHANH") cũng đều không có biểu tượng. */}
        <h2>{dich('Lịch hôm nay')}</h2>
        <span className="ct-homnay-dem">
          {conLai > 0
            ? dichP('còn {n} buổi', { n: conLai })
            : dich('đã học xong hôm nay')}
        </span>
        <button
          type="button"
          className="ct-btn ct-btn-ghost ct-homnay-tuan"
          onClick={() => document.querySelector('.ct-lich')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          {dich('Cả tuần')}
        </button>
      </div>

      <ul className="ct-homnay-ds">
        {ds.map((x) => (
          <li key={x.buoi.id} data-trang={x.trangThai} data-ke={x.keTiep}>
            <i className="ct-homnay-cham" aria-hidden
              style={{ background: mauMon(x.buoi.subject, x.buoi.color) }} />
            <span className="ct-homnay-gio">{x.buoi.startTime}<em>{x.buoi.endTime}</em></span>
            <span className="ct-homnay-mon">
              <strong>{x.buoi.classCode || x.buoi.subject}</strong>
              {x.buoi.room && (
                <span className="ct-homnay-phong"><MapPin size={11} aria-hidden />{x.buoi.room}</span>
              )}
            </span>
            <span className="ct-homnay-trang">
              {x.trangThai === 'dang' && dich('đang học')}
              {x.trangThai === 'xong' && dich('đã xong')}
              {/* Đếm ngược CHỈ trên buổi kế tiếp. Ghi "còn 6 giờ" lên buổi
                  cuối ngày là ba dòng số đếm ngược cạnh nhau, và không dòng
                  nào là thứ người dùng sắp phải làm. */}
              {x.trangThai === 'toi' && (x.keTiep ? cauConLai(x.conPhut, dichP) : '')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
