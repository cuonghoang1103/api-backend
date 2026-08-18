/**
 * Trang tải app — vỏ chạy ở MÁY CHỦ.
 *
 * Vì sao không để trình duyệt tự hỏi GitHub như trước:
 *
 *  • API công khai của GitHub cho 60 lượt/giờ TÍNH THEO IP. Cả một văn phòng
 *    dùng chung IP là chạm trần rất nhanh, và khi đó nút tải của mọi người ở đó
 *    đều rơi về trang danh sách bản phát hành.
 *  • Chữ "Phiên bản x.y.z" trong HTML đầu tiên là số DỰ PHÒNG, nên ai nhìn
 *    trang trong khoảnh khắc trước khi JavaScript chạy xong sẽ thấy một con số
 *    cũ. Với người tải app thì đó đúng là thông tin họ cần chính xác nhất.
 *
 * Nay máy chủ hỏi một lần, đệm 5 phút, dùng chung cho mọi người. `revalidate`
 * chứ không phải `no-store`: bản phát hành mới ra thì chậm nhất 5 phút là trang
 * đúng, còn 60 lượt/giờ thì không bao giờ chạm tới.
 *
 * ⚠️ Địa chỉ tải LUÔN lấy từ `browser_download_url` mà GitHub trả về — không
 * bao giờ tự ghép tên file từ một số phiên bản. Ghép tay chính là thứ đã làm
 * mọi nút tải 404 suốt từ bản 0.3.0 tới 18/08/2026.
 */
import DownloadClient, { type ReleaseInfo } from './DownloadClient';

/**
 * Dựng lại trang mỗi 5 phút.
 *
 * Khai báo Ở ĐÂY chứ không chỉ dựa vào `next.revalidate` của lời gọi fetch:
 * ràng buộc ở cấp route thì `next build` in ra được và người sau nhìn thấy
 * ngay, còn nằm lẫn trong một lời gọi thì rất dễ bị sửa mất mà không ai nhận
 * ra — và khi đó trang đóng băng ở phiên bản lúc dựng, đúng cái lỗi vừa vá.
 */
export const revalidate = 300;

const LATEST_API =
  'https://api.github.com/repos/cuonghoang1103/cuongthai-desktop/releases/latest';

async function layBanPhatHanh(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(LATEST_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      tag_name?: string;
      name?: string;
      assets?: { name: string; browser_download_url: string; size: number }[];
    };
    const version = String(json.tag_name ?? json.name ?? '').replace(/^v/, '');
    if (!version) return null;
    // Kèm MỐC LẤY. Client dùng nó để biết trang mình đang xem cũ tới đâu — xem
    // `DownloadClient.tsx`. Không có mốc này thì không cách nào phân biệt một
    // trang vừa dựng với một trang nằm trong bộ đệm đã lâu.
    return { version, assets: json.assets ?? [], layLuc: Date.now() };
  } catch {
    // Máy chủ không hỏi được thì trả null: client sẽ tự thử một lần nữa, và
    // nếu vẫn hỏng thì nút trỏ về trang danh sách bản phát hành. Không bao giờ
    // trỏ vào một địa chỉ đoán mò.
    return null;
  }
}

export default async function DownloadPage() {
  const banPhatHanh = await layBanPhatHanh();
  return <DownloadClient banPhatHanh={banPhatHanh} />;
}
