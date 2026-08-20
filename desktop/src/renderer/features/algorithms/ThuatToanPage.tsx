/**
 * Thuật toán — DÙNG LẠI nguyên `AlgorithmVisualizer` của web.
 *
 * Đo thật 20/08/2026: 12 tệp, 3.239 dòng, và **không dính Next.js một chỗ nào**
 * — không link, không image, không navigation, không dynamic. Nó là React
 * thuần cộng canvas, nên chạy ở đây y như trên web.
 *
 * Không có API nào: mã thuật toán chạy ngay trong trình duyệt của người dùng.
 * Nghĩa là trang này dùng được cả khi MẤT MẠNG — đúng thứ app desktop nên hơn
 * một tab trình duyệt.
 */
import { TrangWebDon } from '../web/TrangWeb';

const nap = () => import('@/components/algorithms/AlgorithmVisualizer');

export function ThuatToanPage() {
  return <TrangWebDon nap={nap} ten="Thuật toán" />;
}
