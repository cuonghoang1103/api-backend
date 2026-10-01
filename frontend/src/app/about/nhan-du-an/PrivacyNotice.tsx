'use client';

/**
 * Thông báo xử lý dữ liệu cá nhân cho phiếu "Gửi yêu cầu dự án" — theo Luật
 * Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (cùng hiệu
 * lực 01/01/2026; NĐ 356 thay thế NĐ 13/2023/NĐ-CP). Phiên bản 2026-10-01b đổi
 * căn cứ pháp lý + nêu thời hạn xử lý yêu cầu xoá (2 ngày làm việc / 20 ngày).
 *
 * `CONSENT_VERSION` PHẢI khớp `CONSENT_VERSION` ở
 * `src/services/projectRequest.service.ts` — backend lưu phiên bản này kèm thời
 * điểm đồng ý. Sửa nội dung thông báo ⇒ đổi phiên bản ở CẢ HAI chỗ.
 *
 * Thời hạn lưu 12 tháng: user xác nhận 01/10/2026. Backend tự xoá phiếu quá hạn mỗi đêm
 * (`purgeExpiredProjectRequests` trong src/services/projectRequest.service.ts, lịch ở cron.service.ts).
 */
import { STUDIO_EMAIL, T } from '@/components/studio/StudioUI';

export const CONSENT_VERSION = '2026-10-01b';

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
      'Được biết, xem, yêu cầu sửa, yêu cầu xoá dữ liệu, hạn chế xử lý, rút lại sự đồng ý bất cứ lúc nào (việc rút lại không ảnh hưởng tới phần xử lý đã diễn ra trước đó), và khiếu nại. Gửi yêu cầu qua email ở trên, ghi kèm mã phiếu. Với yêu cầu xoá hợp lệ: phản hồi trong 2 ngày làm việc và hoàn tất xoá trong 20 ngày.',
      'To be informed, access, correct, delete, restrict processing, withdraw consent at any time (withdrawal does not affect processing already carried out), and to complain. Send requests to the email above with your request code. For a valid deletion request: we respond within 2 working days and complete deletion within 20 days.',
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
          ? `Under the Law on Personal Data Protection No. 91/2025/QH15 and Decree 356/2025/ND-CP · version ${CONSENT_VERSION}`
          : `Theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP · phiên bản ${CONSENT_VERSION}`}
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
