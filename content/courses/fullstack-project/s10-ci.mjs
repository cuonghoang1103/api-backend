/**
 * Chương 10 — CI với GitHub Actions (khoá fullstack-project). Bài ĐÃ SOẠN 25/11/2026 (agent trên Mac tiếp quản fsp); ghép vào
 * khung bằng slug. Thêm bài quiz fp-10-5-quiz (slug mới). Output chạy thật: act 0.2.98 (nektos/act) trên máy nhà, ảnh runner
 * catthehacker/ubuntu:act-24.04, registry cục bộ registry:2 thay cho GHCR, cổng giữ main cục bộ (repo git trần + hook pre-receive).
 * KHÔNG đẩy repo nào lên GitHub; phần ruleset/branch protection dạy theo GitHub Docs (ghi rõ trong bài 10.3).
 */
import B1 from './s10/fp-10-1-ci-co-ban.mjs';
import B2 from './s10/fp-10-2-build-image-ci.mjs';
import B3 from './s10/fp-10-3-bat-buoc-check.mjs';
import B4 from './s10/fp-10-4-checkpoint-10.mjs';
import B5 from './s10/fp-10-5-quiz.mjs';

export default [B1, B2, B3, B4, B5];
