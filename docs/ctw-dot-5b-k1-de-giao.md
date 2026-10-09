# Đề giao (Opus) — CT WORK ĐỢT 5b / K-1: BÌNH LUẬN ĐẦY ĐỦ + VOICE NOTE · 09/10/2026

Repo `/Users/admin/Downloads/api-backend`. Đọc trước:
- `CLAUDE.md`
- `docs/ctw-ke-hoach-tong.md` (dòng 5b)
- `docs/ctw-ra-soat-swr-swt-hop-09-10.md`, các mục K4, K5, K6, K16 cùng bằng chứng và hạ tầng có sẵn
- `docs/ctw-ra-soat-giao-dien-09-10.md` (chuẩn giao diện)

**Luật cứng:**
- KHÔNG commit/push/deploy; KHÔNG git add/stash/checkout/reset. Ngoại lệ duy nhất: `git checkout -- frontend/tsconfig.json` sau `next build`.
- Migration viết tay, dải `20261010010000_*`. Schema chỉ THÊM, gom trong khối `// ── CTW đợt 5b K-1 ──`. FK trỏ vào `work_issues` phải `DEFERRABLE INITIALLY DEFERRED`.
- Đang chạy song song: đợt 4 (UC/BR/RTM/defect/Q&A/Report 7) và 6a (cổng khách, permissions, CI, E2E). Không sửa lớn tệp của hai bên; tệp chung thì chèn tối thiểu và ghi lại.
- KHÔNG sửa `src/services/llm/gateway.ts`, vì K-1 không cần LLM mới.
- Không in token/khoá. Theme `theme-dark`. Đạt AA và có nhãn ARIA (UX-A vừa đưa axe về 0 lỗi — đừng làm lùi).

## Làm
1. **K4 — trả lời theo luồng:** bình luận trả lời một bình luận khác, thu/mở luồng. Thông báo cho người được trả lời. Giữ socket realtime.
2. **K5 — đính kèm tệp ngay trong bình luận:** kéo-thả hoặc chọn tệp. Dùng lại đường upload R2 hiện có của thẻ và quyền xem dự án. Có xem trước ảnh và PDF.
3. **K6 — voice note:**
   - Nút ghi âm trong ô bình luận, dùng lại `frontend/src/components/messaging/useGhiAm.ts`. Phải chạy được trên web, app desktop Electron và Safari.
   - Lưu audio lên R2, có trình phát (độ dài, tua).
   - **Tự phiên âm** bằng STT có sẵn (`transcribeWithGroq` / `checkHeardSpeech` trong `src/services/interview/voice/stt.ts`). Không thêm dịch vụ mới. Phiên âm hiện dưới voice note và tìm kiếm được.
   - Giới hạn độ dài (vd 3 phút) và dung lượng.
   - Không có `GROQ_API_KEY` thì vẫn lưu audio, chỉ bỏ phần phiên âm và ghi rõ trên giao diện.
   - Tôn trọng quyền: khách cổng chỉ nghe được bình luận được chia sẻ.
4. **K16:** làm theo đúng mô tả trong tệp rà soát.
5. **Registry lệnh (3C):**
   - AI đọc được luồng bình luận và phiên âm voice note (`get_issue` trả kèm).
   - Lệnh `comment` hỗ trợ trả lời theo luồng.

## Kiểm
- Viết test unit và `WORK_DB_TEST=1` (luồng, đính kèm, voice, quyền khách cổng; STT dùng giả), thêm vào `npm test`.
- Chạy `npx tsc --noEmit`, `typecheck:seed`, frontend tsc, desktop typecheck.
- `next build --no-lint`, distDir `.next-ctw5k1`, heap 12288. Xong thì xoá thư mục build.
- Quét rules-of-hooks; chạy axe trên trang thẻ.
- Migration diff phải sạch.
- Chạy thật trên trình duyệt local (ghi âm bằng tệp audio giả của Playwright, `--use-file-for-fake-audio-capture`). Chụp ảnh giao diện sáng/tối, 1440 và 390, vào `scratchpad/ctw5k1/`.

Báo lại ngắn bằng tiếng Việt, chỉ khi xong hết: tệp, migration, test, ảnh, rủi ro.
