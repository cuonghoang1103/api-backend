/**
 * Chương 13 — Container, Kubernetes, CDN và cloud (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s13/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s13/ (bash _demo/s13/chay-s13.bash <thư mục làm việc>: Docker 29 + Compose v5,
 * k3s v1.33.5 trong container, nginx 1.27 + Express 5 sau CDN giả lập, AWS CLI 2.32 vào moto 5.1.18, bản ghi CloudTrail/flow log mẫu),
 * rồi node scratchpad/lgz/cong-cu/sinh-ma.mjs (repo: scripts/log-khoa/sinh-ma.mjs). Tệp lệnh đuôi .bash — chay-demo.py không chạy chúng.
 */
import L131 from './s13/log-13-1-docker-logs.mjs';
import L132 from './s13/log-13-2-kubernetes.mjs';
import L133 from './s13/log-13-3-cdn-proxy.mjs';
import L134 from './s13/log-13-4-cloud.mjs';
import L135 from './s13/log-13-5-lab.mjs';
import L136 from './s13/log-13-6-quiz.mjs';

export default { lessons: [L131, L132, L133, L134, L135, L136] };
