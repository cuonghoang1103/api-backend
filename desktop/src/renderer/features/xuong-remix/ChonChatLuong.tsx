/**
 * Chọn CHẤT LƯỢNG cho bản cuối.
 *
 * ─── Vì sao mỗi lựa chọn kèm một câu, không phải chỉ con số ───
 * "320 kbps" không nói cho ai biết nên chọn nó hay không. Câu quyết định là
 * "chuẩn để đi diễn" và "đừng đem đi diễn, hi-hat vỡ rõ". Con số là hệ quả,
 * không phải lý do — bày con số trần ra rồi bắt người dùng tự tra là đẩy việc
 * sang cho họ.
 *
 * ─── Vì sao có nhãn "mất dữ liệu" ───
 * Đây là thứ duy nhất trong bảng KHÔNG lấy lại được. Chọn nhầm 128 kbps để
 * lưu trữ thì sáu tháng sau không có cách nào dựng lại phần đã mất, mà lúc
 * bấm thì hai lựa chọn nhìn giống hệt nhau: cùng một danh sách, cùng một kiểu
 * chữ, chỉ khác con số.
 */
import { useDich } from '../../i18n';
import { CHON_XUAT, timChonXuat } from '../../../shared/dinhDangXuat';

/** Hai nhóm, và cái nhỏ-gọn đứng trước vì đó là thứ chín trên mười lần người
    ta cần. Tên nhóm nói CÔNG DỤNG chứ không nói kỹ thuật: "nén" và "nguyên
    vẹn" là chữ phải tra, "gửi đi và đi diễn" thì không. */
const NHOM = [
  { ten: 'Để gửi đi và đi diễn', mat: true },
  { ten: 'Để lưu trữ và mix tiếp', mat: false },
] as const;

interface Props {
  ma: string;
  onChon: (ma: string) => void;
  /** Độ dài bài, giây — để ước cỡ tệp theo bài THẬT chứ không theo bài 5 phút. */
  giay?: number | undefined;
  tat?: boolean;
}

/** Bảng `mbUocTinh` tính cho bài 5 phút; quy về bài đang mở. */
function coUocTinh(mb: number, giay: number | undefined): string {
  const ti = giay && giay > 0 ? giay / 300 : 1;
  const x = mb * ti;
  return x >= 10 ? `~${Math.round(x)} MB` : `~${x.toFixed(1)} MB`;
}

export function ChonChatLuong({ ma, onChon, giay, tat }: Props) {
  const { dich } = useDich();
  const dangChon = timChonXuat(ma);

  return (
    <div className="ct-xr-cl">
      <div className="ct-xr-cl-dau">
        <span className="ct-xr-nhan">{dich('Chất lượng bản cuối')}</span>
        <span className="ct-xr-cl-nay">
          {dangChon.nhan} · {coUocTinh(dangChon.mbUocTinh, giay)}
        </span>
      </div>

      {/* HAI NHÓM có nhãn, không phải một dải cuộn ngang.
          Bản đầu xếp cả tám lựa chọn thành một hàng cuộn được — và ở bề rộng
          thật của cột này (~550px) thì bốn lựa chọn NGUYÊN VẸN nằm hẳn ngoài
          màn hình. Tức là đúng nhóm người ta đi tìm khi hỏi "chất lượng cao"
          lại là nhóm không nhìn thấy, mà cũng không có gì báo rằng còn nữa. */}
      {NHOM.map((nh) => (
        <div key={nh.ten} className="ct-xr-cl-nhom">
          <span className="ct-xr-cl-nhan">{dich(nh.ten)}</span>
          <div className="ct-xr-cl-hang" role="radiogroup" aria-label={dich(nh.ten)}>
            {CHON_XUAT.filter((m) => m.matDuLieu === nh.mat).map((m) => (
              <button
                key={m.ma}
                type="button"
                role="radio"
                aria-checked={m.ma === ma}
                className="ct-xr-cl-nut"
                data-chon={m.ma === ma ? '1' : undefined}
                data-mat={m.matDuLieu ? '1' : undefined}
                disabled={tat}
                onClick={() => onChon(m.ma)}
                title={dich(m.viSao)}
              >
                <b>{m.nhan}</b>
                <span>{coUocTinh(m.mbUocTinh, giay)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className="ct-xr-cl-vi">
        {dangChon.matDuLieu
          ? <><span className="ct-xr-cl-canh">{dich('có mất dữ liệu')}</span> · {dich(dangChon.viSao)}</>
          : <><span className="ct-xr-cl-nguyen">{dich('nguyên vẹn')}</span> · {dich(dangChon.viSao)}</>}
      </p>
    </div>
  );
}
