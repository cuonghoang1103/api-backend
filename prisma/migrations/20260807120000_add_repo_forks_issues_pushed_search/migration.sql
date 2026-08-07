-- GithubRepo: bốn cột mới cho trang /repos.
--
-- forks / open_issues: trang chi tiết trước đây in cứng "0 fork" cho MỌI
-- repo. Backend vẫn luôn fetch hai con số này từ GitHub, chỉ là không có
-- chỗ để lưu.
-- pushed_at: thời điểm commit mới nhất — tín hiệu "repo còn sống không",
-- hữu ích hơn số sao khi quyết định có nên phụ thuộc vào một thư viện.
-- search_blob: bản chuẩn hoá (thường + bỏ dấu) của tên + mô tả + bài đánh
-- giá, để tìm "mau thiet ke" ra được bài viết "mẫu thiết kế" mà không cần
-- extension `unaccent` (extension đó đòi quyền superuser).
ALTER TABLE "github_repos" ADD COLUMN "forks" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "github_repos" ADD COLUMN "open_issues" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "github_repos" ADD COLUMN "pushed_at" TIMESTAMP(3);
ALTER TABLE "github_repos" ADD COLUMN "search_blob" TEXT;
