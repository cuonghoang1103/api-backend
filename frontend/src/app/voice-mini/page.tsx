import type { Metadata } from 'next';
import VoiceMiniClient from './VoiceMiniClient';

export const metadata: Metadata = {
  title: 'Voice CuongMini — chuyển văn bản thành giọng nói',
  description:
    'Dán văn bản, chọn giọng, nghe ngay. Máy đọc tiếng Việt chạy trên máy chủ riêng — không hạn mức, không gửi nội dung ra ngoài.',
};

export default function Page() {
  return <VoiceMiniClient />;
}
