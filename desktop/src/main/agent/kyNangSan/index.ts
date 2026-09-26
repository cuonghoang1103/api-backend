/**
 * ============================================================
 * KỸ NĂNG CÀI SẴN — bản SAO LƯU đóng gói trong app (26/09/2026)
 * ============================================================
 *
 * NGUỒN DUY NHẤT của kỹ năng nằm ở BACKEND: `src/services/agent/kyNangSan/*.md`.
 * Máy chủ phục vụ chúng qua `GET /api/v1/agent/ky-nang` và app tải về mỗi lượt
 * (đệm 10 phút, xem `kyNang.ts`) — nên sửa/thêm kỹ năng chỉ cần DEPLOY BACKEND,
 * không phải phát hành lại app. Người dùng: *"sửa kỹ năng mà phải phát hành lại
 * app"* là điểm yếu thứ hai cần bịt.
 *
 * Bộ ở đây là BẢN SAO lúc dựng app, chỉ dùng khi không tải được từ máy chủ
 * (mất mạng, máy chủ cũ chưa có route). Import thẳng từ thư mục của backend
 * nên không bao giờ có hai bản nội dung phải giữ cho khớp.
 *
 * Nội dung là Markdown (`?raw`), không chép vào chuỗi TypeScript: khối mã trong
 * kỹ năng đầy dấu huyền và `${}`, nhét vào template literal là phải thoát từng
 * ký tự — và một ký tự thoát sai làm hỏng âm thầm.
 */
import deploy from '../../../../../src/services/agent/kyNangSan/deploy.md?raw';
import mayChuSsh from '../../../../../src/services/agent/kyNangSan/may-chu-ssh.md?raw';
import phatHanhApp from '../../../../../src/services/agent/kyNangSan/phat-hanh-app.md?raw';
import lamViecChuan from '../../../../../src/services/agent/kyNangSan/lam-viec-chuan.md?raw';
import database from '../../../../../src/services/agent/kyNangSan/database.md?raw';
import kiemThu from '../../../../../src/services/agent/kyNangSan/kiem-thu.md?raw';
import baoMat from '../../../../../src/services/agent/kyNangSan/bao-mat.md?raw';
import giaoDienWeb from '../../../../../src/services/agent/kyNangSan/giao-dien-web.md?raw';
import gitGithub from '../../../../../src/services/agent/kyNangSan/git-github.md?raw';
import thietKeApi from '../../../../../src/services/agent/kyNangSan/thiet-ke-api.md?raw';
import tinhNangAi from '../../../../../src/services/agent/kyNangSan/tinh-nang-ai.md?raw';
import doAnBaoCao from '../../../../../src/services/agent/kyNangSan/do-an-bao-cao.md?raw';

/** Nội dung thô (có phần đầu YAML) của từng kỹ năng — bản đóng gói. */
export const KY_NANG_SAN_THO: readonly string[] = [
  lamViecChuan, deploy, mayChuSsh, phatHanhApp,
  database, kiemThu, baoMat, giaoDienWeb,
  gitGithub, thietKeApi, tinhNangAi, doAnBaoCao,
];
