/**
 * /language — vỏ MÁY CHỦ (17/11/2026): dựng dải tải app CT Language (hỏi App Store ở máy chủ, đệm 1 giờ) rồi trao
 * cho phần client `LanguageLanding` (danh sách khoá, học tiếp, Gấu…). Trang trước đây là client thuần.
 */
import DaiQuangBa from '@/components/appsite/DaiQuangBa';
import LanguageLanding from './LanguageLanding';
import { CTLANGUAGE_SITE } from './app/site';

export const revalidate = 3600;

export default function LanguagePage() {
  return (
    <LanguageLanding
      daiApp={
        <DaiQuangBa
          site={CTLANGUAGE_SITE}
          loiMoi="Học mọi lúc trên điện thoại: gọi thoại luyện nói với CuongMini, học qua video, podcast, từ điển viết tay và 5 trò chơi — cùng tài khoản, cùng tiến độ với web."
        />
      }
    />
  );
}
