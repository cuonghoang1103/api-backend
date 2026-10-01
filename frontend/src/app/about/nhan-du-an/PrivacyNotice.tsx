'use client';

/**
 * Thông báo xử lý dữ liệu cá nhân cho phiếu "Gửi yêu cầu dự án" — theo Nghị
 * định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (Điều 11: sự đồng ý; Điều 13:
 * thông báo xử lý; Điều 9: quyền của chủ thể dữ liệu).
 *
 * `CONSENT_VERSION` PHẢI khớp `CONSENT_VERSION` ở
 * `src/services/projectRequest.service.ts` — backend lưu phiên bản này kèm thời
 * điểm đồng ý. Sửa nội dung thông báo ⇒ đổi phiên bản ở CẢ HAI chỗ.
 *
 * TODO(người điều phối/user): thời hạn lưu 12 tháng là đề xuất của gói UI —
 * user cần xác nhận; backend hiện CHƯA có việc tự xoá phiếu quá hạn.
 */
import { STUDIO_EMAIL, T } from '@/components/studio/StudioUI';

export const CONSENT_VERSION = '2026-10-01';

type Bi = readonly [string, string];

const ROWS: { k: Bi; v: Bi }[] = [
  {
    k: ['Bên xử lý dữ liệu', 'Data controller'],
    v: [
      `CuongHoang Studio (cuongthai.com), người phụ trách: Cường. Liên hệ: ${STUDIO_EMAIL}.`,
      `CuongHoang Studio (cuongthai.com), responsible person: Cường. Contact: ${STUDIO_EMAIL}.`,
    ],
  },
  {
    k: ['Mục đích', 'Purpose'],
    v: [
      'Chỉ để đánh giá yêu cầu, liên hệ lại với bạn, chuẩn bị đề xuất và — nếu hai bên đồng ý hợp tác — lập hồ sơ dự án. Không dùng cho quảng cáo, không bán hay chia sẻ cho bên thứ ba vì mục đích thương mại.',
      'Only to assess your request, contact you, prepare a proposal and — if both sides agree to work together — set up the project file. Never used for advertising, never sold or shared with third parties for commercial purposes.',
    ],
  },
  {
    k: ['Loại dữ liệu', 'Data collected'],
    v: [
      'Dữ liệu cá nhân cơ bản: họ tên, email, số điện thoại (nếu có), tổ chức, vai trò. Nội dung bạn mô tả về dự án. Dữ liệu kỹ thuật ghi kèm để chống lạm dụng: địa chỉ IP, thông tin trình duyệt, thời điểm gửi và thời điểm đồng ý.',
      'Basic personal data: name, email, phone (optional), organisation, role. The project details you describe. Technical data recorded to prevent abuse: IP address, browser information, submission and consent time.',
    ],
  },
  {
    k: ['Nơi lưu & bảo vệ', 'Storage & protection'],
    v: [
      'Cơ sở dữ liệu của cuongthai.com trên máy chủ do studio quản trị; chỉ tài khoản quản trị xem được. Kết nối được mã hoá (HTTPS).',
      'The cuongthai.com database on a server administered by the studio; only admin accounts can view it. Connections are encrypted (HTTPS).',
    ],
  },
  {
    k: ['Thời gian lưu', 'Retention'],
    v: [
      'Tối đa 12 tháng kể từ lần liên lạc cuối nếu không đi tới hợp đồng. Nếu ký hợp đồng, dữ liệu được lưu theo thời hạn lưu hồ sơ của hợp đồng.',
      'Up to 12 months from the last contact if no contract follows. If a contract is signed, data is kept for the contract’s record-keeping period.',
    ],
  },
  {
    k: ['Quyền của bạn', 'Your rights'],
    v: [
      'Được biết, xem, yêu cầu sửa, yêu cầu xoá dữ liệu, hạn chế xử lý, rút lại sự đồng ý bất cứ lúc nào (việc rút lại không ảnh hưởng tới phần xử lý đã diễn ra trước đó), và khiếu nại. Gửi yêu cầu qua email ở trên, ghi kèm mã phiếu.',
      'To be informed, access, correct, delete, restrict processing, withdraw consent at any time (withdrawal does not affect processing already carried out), and to complain. Send requests to the email above with your request code.',
    ],
  },
];

export default function PrivacyNotice({ lang }: { lang: 'vi' | 'en' }) {
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);
  return (
    <div id="thong-bao-du-lieu" className="scroll-mt-28">
      <p className={T.h3}>
        {lang === 'en' ? 'Personal data notice' : 'Thông báo xử lý dữ liệu cá nhân'}
      </p>
      <p className={`${T.small} mt-1`}>
        {lang === 'en'
          ? `Under Decree 13/2023/ND-CP on personal data protection · version ${CONSENT_VERSION}`
          : `Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân · phiên bản ${CONSENT_VERSION}`}
      </p>
      <dl className="mt-4 space-y-3.5 text-[0.85rem] leading-relaxed">
        {ROWS.map((r) => (
          <div key={r.k[0]}>
            <dt className="font-semibold text-[color:var(--s-ink)]">{p(r.k)}</dt>
            <dd className="mt-0.5 text-[color:var(--s-body)]">{p(r.v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
