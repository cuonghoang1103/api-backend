/**
 * Dự án xuyên suốt SWR302 — ClinicCare (phòng khám gia đình Minh An). Dùng chung cho các mốc swr302-N-project-cliniccare-*.
 * Một câu chuyện duy nhất ⇒ mọi mốc (tầm nhìn → khai thác → use case → mô hình → SRS → thay đổi/truy vết → ưu tiên) nhất quán.
 * Kèm phongVan(): "Interview corner" — câu hỏi phỏng vấn BA/SE thật, chấm trắc nghiệm, giải thích song ngữ.
 */
import { tracNghiem } from './_bai.mjs';

export const TEN = 'ClinicCare';

export const BOI_CANH = {
  en: `<p><b>Minh An Family Clinic</b> has 3 doctors, 2 receptionists, 1 pharmacist and a clinic manager. Today patients phone the reception desk to book: about <b>120 calls a day</b>, many unanswered at peak time, and <b>15% of appointments are no-shows</b>. The owner wants <b>ClinicCare</b>, a web and mobile system, live within 6 months.</p>
<ul>
<li><b>Patients</b> register, book an appointment with a chosen doctor in a free 15-minute slot, cancel it, pay the visit fee online, and read their prescriptions.</li>
<li><b>Doctors</b> publish their working slots, see the day’s appointment list, record visit notes and write e-prescriptions.</li>
<li><b>Receptionists</b> check patients in, book on behalf of patients who still phone, and mark no-shows.</li>
<li>The <b>pharmacist</b> receives e-prescriptions and marks them dispensed.</li>
<li>The <b>clinic manager</b> sets services and fees and reads monthly reports.</li>
<li>External systems: the <b>VNPay payment gateway</b> (charges, confirms and refunds), the <b>SMS gateway</b> (delivers the reminder sent 24 hours before each appointment), and the <b>National e-Prescription System</b>, to which every prescription must be sent by law and which returns a prescription code.</li>
</ul>
<p><b>Business rules.</b> BR-01 an appointment can be cancelled free of charge up to 2 hours before it starts · BR-02 a patient with 3 no-shows in the last 90 days must prepay when booking · BR-03 a patient may hold at most 2 future appointments · BR-04 visit fee = service fee + 10% VAT · BR-05 a slot lasts 15 minutes.</p>
<p><b>Not in release 1:</b> video consultation, insurance e-claims, a loyalty programme, integration with the lab machines.</p>`,
  vi: `<p><b>Phòng khám gia đình Minh An</b> có 3 bác sĩ, 2 lễ tân, 1 dược sĩ và một quản lý. Hiện bệnh nhân gọi điện tới lễ tân để đặt lịch: khoảng <b>120 cuộc/ngày</b>, giờ cao điểm nhiều cuộc không ai nghe, và <b>15% lịch hẹn bị bỏ (no-show)</b>. Chủ phòng khám muốn <b>ClinicCare</b> — hệ thống web và di động — chạy trong 6 tháng.</p>
<ul><li><b>Bệnh nhân</b> đăng ký, đặt lịch với bác sĩ chọn trong slot 15 phút còn trống, huỷ lịch, trả phí khám trực tuyến, xem đơn thuốc.</li><li><b>Bác sĩ</b> công bố slot làm việc, xem danh sách hẹn trong ngày, ghi chú khám và kê đơn điện tử.</li><li><b>Lễ tân</b> làm thủ tục check-in, đặt lịch thay người gọi điện, đánh dấu no-show.</li><li><b>Dược sĩ</b> nhận đơn điện tử và đánh dấu đã phát thuốc.</li><li><b>Quản lý</b> đặt dịch vụ và phí, xem báo cáo tháng.</li><li>Hệ thống ngoài: <b>cổng thanh toán VNPay</b> (thu, xác nhận, hoàn tiền), <b>SMS gateway</b> (gửi nhắc lịch trước 24 giờ), <b>Hệ thống Đơn thuốc Quốc gia</b> (luật bắt buộc gửi mọi đơn, trả về mã đơn).</li></ul>
<p><b>Luật nghiệp vụ.</b> BR-01 huỷ miễn phí tới trước 2 giờ · BR-02 bệnh nhân có 3 lần no-show trong 90 ngày phải trả trước khi đặt · BR-03 tối đa 2 lịch hẹn tương lai mỗi bệnh nhân · BR-04 phí khám = phí dịch vụ + 10% VAT · BR-05 mỗi slot 15 phút.</p>
<p><b>Ngoài bản 1:</b> khám qua video, bảo hiểm điện tử, chương trình khách hàng thân thiết, kết nối máy xét nghiệm.</p>`,
};

/** Actor/thực thể ngoài dùng chung (khop = regex trên tên đã chuẩn hoá). */
export const A = {
  patient: { ten: 'Patient', khop: ['patient'] },
  doctor: { ten: 'Doctor', khop: ['doctor|physician'] },
  recep: { ten: 'Receptionist', khop: ['reception|front desk'] },
  pharm: { ten: 'Pharmacist', khop: ['pharmac'] },
  manager: { ten: 'Clinic Manager', khop: ['manager|owner|admin'] },
  pay: { ten: 'VNPay Payment Gateway', khop: ['vnpay|payment'] },
  sms: { ten: 'SMS Gateway', khop: ['sms|message|notif'] },
  nep: { ten: 'National e-Prescription System', khop: ['national|e prescription system|eprescription|ministry|e health'] },
};

/** Interview corner: câu hỏi phỏng vấn BA/SE (cau theo dạng tracNghiem). */
export function phongVan({ moc, cau, khaiNiem, thuatNgu = [] }) {
  return tracNghiem({
    tieuDe: `Interview corner — ${moc}`,
    doKho: 'MEDIUM', phut: 8,
    moTa: {
      en: '<p><b>Interview corner.</b> Questions that interviewers for business analyst, junior software engineer and QA positions really ask about this part of the project. Choose the answer a strong candidate would give; read the explanation — it is what you would say out loud.</p>',
      vi: '<p><b>Góc phỏng vấn.</b> Câu hỏi nhà tuyển dụng BA, kỹ sư phần mềm junior và QA thật sự hỏi về phần này của dự án. Chọn câu trả lời của một ứng viên giỏi; đọc phần giải thích — đó là điều bạn sẽ nói thành lời.</p>',
    },
    cau,
    goiY: ['Câu trả lời tốt gắn với tình huống cụ thể của dự án, không đọc định nghĩa suông.', 'Nhà tuyển dụng muốn nghe lý do (vì sao), không chỉ cái gì.'],
    loiHayGap: ['Trả lời bằng định nghĩa thuộc lòng, không ví dụ.', 'Chọn đáp án nghe "kỹ thuật" nhất thay vì đáp án đúng nghiệp vụ.'],
    giaiThich: `<p>Answers: ${cau.map((c) => c.dap).join(' · ')}.</p>`,
    thuatNgu,
    khaiNiem,
  });
}
