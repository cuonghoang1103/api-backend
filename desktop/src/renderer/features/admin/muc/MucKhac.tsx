/**
 * Quản trị · Các mục khác — những trang quản trị web CHƯA được làm lại trong app
 * (05/10/2026, đợt 1). Mỗi thẻ mở đúng trang đó trên web; sẽ chuyển dần vào app theo đợt.
 */
import type { ReactNode } from 'react';
import {
  FileText, Newspaper, Music, Gamepad2, GraduationCap, BookOpen, Languages, Code2, Mic, Bot, BarChart3, ShoppingBag,
  Ticket, Crown, Search, Server, ShieldCheck, Briefcase, Users2, Sticker, Star, FolderGit2, Video, MessageSquareQuote, Sparkles, LayoutTemplate,
} from 'lucide-react';
import { DauMuc } from '../chung';

type The = { ten: string; mo: string; duong: string; icon: ReactNode; mau: string };
const NHOM: { ten: string; the: The[] }[] = [
  { ten: 'Nội dung', the: [
    { ten: 'Bài viết', mo: 'Bài đăng, kiểm duyệt', duong: '/admin/posts', icon: <FileText size={18} />, mau: '#f472b6' },
    { ten: 'Tech Trends', mo: 'Bản tin, AI viết bài', duong: '/admin/tech-trends', icon: <Newspaper size={18} />, mau: '#38bdf8' },
    { ten: 'Exp Hub', mo: 'Đoạn mã kinh nghiệm', duong: '/admin/exp-hub', icon: <Code2 size={18} />, mau: '#22c55e' },
    { ten: 'Dự án', mo: 'Dự án, mốc, tính năng', duong: '/admin/projects', icon: <FolderGit2 size={18} />, mau: '#f59e0b' },
    { ten: 'Repo', mo: 'Kho mã tuyển chọn', duong: '/admin/repos', icon: <FolderGit2 size={18} />, mau: '#a78bfa' },
    { ten: 'Trang chủ', mo: 'Landing, khối hiển thị', duong: '/admin/landing', icon: <LayoutTemplate size={18} />, mau: '#ec4899' },
    { ten: 'Nhãn dán', mo: 'Sticker tin nhắn', duong: '/admin/stickers', icon: <Sticker size={18} />, mau: '#fb923c' },
  ] },
  { ten: 'Học tập', the: [
    { ten: 'Khoá học', mo: 'Khoá, bài, danh mục', duong: '/admin/courses', icon: <BookOpen size={18} />, mau: '#22d3ee' },
    { ten: 'Academy', mo: 'Môn học FPT', duong: '/admin/academy', icon: <GraduationCap size={18} />, mau: '#818cf8' },
    { ten: 'Ngoại ngữ', mo: 'Bài học, phân tích', duong: '/admin/language', icon: <Languages size={18} />, mau: '#34d399' },
    { ten: 'Code Lab', mo: 'Bài lập trình', duong: '/admin/code-lab', icon: <Code2 size={18} />, mau: '#60a5fa' },
    { ten: 'Phỏng vấn', mo: 'Ngân hàng câu hỏi', duong: '/admin/interview', icon: <MessageSquareQuote size={18} />, mau: '#f87171' },
    { ten: 'CV', mo: 'Mẫu CV, thống kê', duong: '/admin/cv', icon: <FileText size={18} />, mau: '#fbbf24' },
    { ten: 'Video', mo: 'Danh mục video', duong: '/admin/video-categories', icon: <Video size={18} />, mau: '#e879f9' },
  ] },
  { ten: 'Giải trí', the: [
    { ten: 'Sửa game chi tiết', mo: 'Mô tả, ảnh bìa, danh mục', duong: '/admin/games', icon: <Gamepad2 size={18} />, mau: '#a78bfa' },
    { ten: 'Nhạc', mo: 'Bài hát, quyền nghe', duong: '/admin/music', icon: <Music size={18} />, mau: '#f472b6' },
    { ten: 'Voice Hub', mo: 'Series giọng đọc', duong: '/admin/voice', icon: <Mic size={18} />, mau: '#2dd4bf' },
  ] },
  { ten: 'Thương mại', the: [
    { ten: 'Thương mại', mo: 'Thanh toán, cổng dự phòng', duong: '/admin/commerce', icon: <ShoppingBag size={18} />, mau: '#22c55e' },
    { ten: 'Đơn hàng', mo: 'Đơn & thanh toán', duong: '/admin/orders', icon: <ShoppingBag size={18} />, mau: '#4ade80' },
    { ten: 'Mã Pro', mo: 'Phát mã, gói Pro', duong: '/admin/pro-codes', icon: <Crown size={18} />, mau: '#facc15' },
    { ten: 'Giảm giá', mo: 'Mã khuyến mãi', duong: '/admin/discounts', icon: <Ticket size={18} />, mau: '#fb7185' },
    { ten: 'CRM', mo: 'Khách hàng studio', duong: '/admin/crm', icon: <Users2 size={18} />, mau: '#38bdf8' },
    { ten: 'Yêu cầu dự án', mo: 'Khách đặt làm', duong: '/admin/project-requests', icon: <Briefcase size={18} />, mau: '#f97316' },
    { ten: 'Đánh giá', mo: 'Review khoá học', duong: '/admin/reviews', icon: <Star size={18} />, mau: '#fde047' },
  ] },
  { ten: 'AI & hệ thống', the: [
    { ten: 'Phân tích AI', mo: 'Chi phí, lượt gọi', duong: '/admin/ai-analytics', icon: <Bot size={18} />, mau: '#c084fc' },
    { ten: 'Tri thức AI', mo: 'Kho tri thức', duong: '/admin/ai-knowledge', icon: <Sparkles size={18} />, mau: '#a78bfa' },
    { ten: 'Phân tích', mo: 'Lưu lượng, hành vi', duong: '/admin/analytics', icon: <BarChart3 size={18} />, mau: '#60a5fa' },
    { ten: 'SEO', mo: 'Thẻ meta, sitemap', duong: '/admin/seo', icon: <Search size={18} />, mau: '#34d399' },
    { ten: 'Hạ tầng', mo: 'VPS, R2, sao lưu', duong: '/admin/ha-tang', icon: <Server size={18} />, mau: '#94a3b8' },
    { ten: 'Bảo mật tài khoản', mo: 'Bật/tắt MFA', duong: '/admin/bao-mat-tai-khoan', icon: <ShieldCheck size={18} />, mau: '#22c55e' },
  ] },
];

const moWeb = (duong: string) => void window.cuongthai?.app.getInfo().then((x) => window.cuongthai?.app.openExternal(`${x.webOrigin}${duong}`));

export function MucKhac() {
  let i = 0;
  return (
    <div className="ct-qt-trang">
      <DauMuc tieuDe="Các mục khác" moTa="Những phần quản trị đang được làm lại cho app theo từng đợt. Tạm thời mở trên web — bấm là tới đúng trang." />
      {NHOM.map((n) => (
        <section key={n.ten} className="ct-qt-mk-nhom">
          <h2>{n.ten}</h2>
          <div className="ct-qt-mk-luoi">
            {n.the.map((t) => (
              <button key={t.duong} type="button" className="ct-qt-mk-the" style={{ ['--m' as string]: t.mau, ['--i' as string]: i++ }} onClick={() => moWeb(t.duong)}>
                <span className="ct-qt-mk-icon">{t.icon}</span>
                <span className="ct-qt-mk-chu"><b>{t.ten}</b><small>{t.mo}</small></span>
                <i className="ct-qt-mk-nhan">Mở web ↗</i>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
