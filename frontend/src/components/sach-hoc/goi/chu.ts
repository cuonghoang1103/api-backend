/**
 * Chữ giao diện MỚI của phòng CuongMini (19/10/2026) — song ngữ vi/en.
 * Khoá học viết cho người Việt nên mặc định TIẾNG VIỆT; chỉ khi người dùng đã chọn
 * English (cookie `locale=en` của LocaleContext) mới đổi. Không dùng hook ngữ cảnh:
 * app desktop dựng lại component này ngoài LocaleProvider.
 */
export type NgonNguUI = 'vi' | 'en';

export function ngonNguUI(): NgonNguUI {
  if (typeof document === 'undefined') return 'vi';
  return /(?:^|;\s*)locale=en\b/.test(document.cookie) ? 'en' : 'vi';
}

const CHU = {
  tamDung: ['Tạm dừng', 'Pause'],
  tiepTuc: ['Tiếp tục', 'Resume'],
  dangTamDung: ['Đã tạm dừng — bấm Tiếp tục để nói tiếp đúng chỗ', 'Paused — press Resume to carry on where you left off'],
  doiChuDe: ['Đổi chủ đề', 'Change topic'],
  chonNoiDung: ['Chọn nội dung', 'Choose content'],
  tiepBuoiTruoc: ['Tiếp tục buổi trước', 'Continue last session'],
  batDauLai: ['Bắt đầu lại từ đầu', 'Start over'],
  luotDaNoi: ['lượt đã nói', 'turns'],
  cauSo: ['Câu', 'Sentence'],
  chuDeKhac: ['Chủ đề khác', 'Other topics'],
  boCauBai: ['Câu của bài đang mở', 'Sentences from this lesson'],
  boCauCoBan: ['Bộ câu cơ bản', 'Starter set'],
  phuDe: ['Phụ đề tiếng Việt', 'Vietnamese subtitles'],
  tocDo: ['Tốc độ nói', 'Speaking speed'],
  cham: ['Chậm', 'Slow'],
  vua: ['Vừa', 'Normal'],
  nhanh: ['Nhanh', 'Fast'],
  cauCuaBan: ['Bạn nói', 'You said'],
  cauDung: ['Nói thế này tự nhiên hơn', 'More natural'],
  viSao: ['Vì sao', 'Why'],
  luuSoOn: ['Lưu vào sổ ôn', 'Save to review'],
  daLuu: ['Đã lưu ✓', 'Saved ✓'],
  tuMoi: ['Từ mới', 'New words'],
  tongKet: ['Tổng kết buổi luyện', 'Session summary'],
  thoiLuong: ['Thời lượng', 'Duration'],
  banNoi: ['Bạn đã nói', 'You spoke'],
  soLuot: ['Số lượt', 'Turns'],
  soLoi: ['Lỗi được sửa', 'Corrections'],
  diemTb: ['Điểm phát âm TB', 'Avg. pronunciation'],
  chuoiNgay: ['Chuỗi ngày học', 'Day streak'],
  ngay: ['ngày', 'days'],
  uocBand: ['Ước lượng band IELTS', 'Estimate IELTS band'],
  uocTrinhDo: ['Ước lượng trình độ', 'Estimate level'],
  dangCham: ['Đang chấm…', 'Scoring…'],
  uocLuongGhiChu: ['Ước lượng từ bản ghi chữ của buổi này — để định hướng, không phải điểm thi thật.', 'Estimated from this session’s transcript — a guide, not an official score.'],
  dong: ['Đóng phòng', 'Close'],
  oLai: ['Luyện tiếp', 'Keep practising'],
  chuanBi: ['Chuẩn bị', 'Preparation'],
  boQuaChuanBi: ['Nói luôn', 'Start speaking now'],
  dangNoiDai: ['Đang nói — tối đa 2 phút', 'Speaking — up to 2 minutes'],
  theDe: ['Thẻ đề (cue card)', 'Cue card'],
  banNenNoi: ['You should say:', 'You should say:'],
  phanHoiSau: ['phản hồi sau', 'replied in'],
  khen: [['Giỏi quá! 🎉', 'Chuẩn luôn! ✨', 'Tuyệt vời! 🌟', 'Hay lắm! 💜'], ['Brilliant! 🎉', 'Spot on! ✨', 'Amazing! 🌟', 'Lovely! 💜']],
} as const;

type Khoa = keyof typeof CHU;
export function c(k: Exclude<Khoa, 'khen'>, nn: NgonNguUI = ngonNguUI()): string {
  return CHU[k][nn === 'en' ? 1 : 0];
}
export function loiKhen(nn: NgonNguUI = ngonNguUI()): string {
  const ds = CHU.khen[nn === 'en' ? 1 : 0];
  return ds[Math.floor(Math.random() * ds.length)]!;
}
