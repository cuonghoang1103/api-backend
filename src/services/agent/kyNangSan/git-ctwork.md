---
name: git-ctwork
description: Git cho NHÓM làm dự án CT Work: kiểm nhánh sau/trước GitHub, nhánh theo thẻ (feature/NT-24-…), không commit lên main, commit có key thẻ, rebase hay merge, mở PR rồi nối PR với thẻ, giải xung đột từng bước.
---

# KỸ NĂNG: GIT THEO LUỒNG NHÓM CT WORK

Dùng khi người dùng làm dự án NHÓM có trên CT Work (thư mục gắn dự án, hoặc remote khớp `project_repos`), và khi họ hỏi:
"pull code mới", "tạo nhánh cho thẻ NT-24", "commit thế nào", "mở PR", "bị conflict", "nhóm dùng git sao cho chuẩn".
Kỹ năng `git-github` có phần chi tiết hơn về lệnh git; ở đây là LUỒNG NHÓM và cách dùng đúng công cụ có sẵn.

## 0. Luật không đổi

- **Không commit, không đẩy thẳng lên `main`/`master`/`develop` của repo nhóm.** `git_commit`/`git_day` tự chặn; đừng lách bằng `run_command git commit`.
- **Không bao giờ `--force`** lên nhánh chung; không `reset --hard`, `checkout -- .`, `clean -fd`, `stash drop` khi người dùng chưa đồng ý rõ ràng — đó là những lệnh vứt mã.
- Mọi lệnh ĐỔI trạng thái repo (pull, rebase, merge, switch, commit, push) đều qua thẻ duyệt — nói trước sẽ chạy gì và vì sao.
- Chỉ thêm đúng file mình sửa (`git_commit` đã dùng index riêng). Không bao giờ commit `.env`, khoá, file build.
- Dùng công cụ có sẵn, đừng chép lại: `git_status`, `git_diff`, `git_commit`, `git_day`, `tao_pr`, `github_ket_noi`, `cai_cong_cu`;
  CT Work: `project_repos`, `get_issue`, `my_work`, `transition`, `comment`, `request_review`, `issue_web_link_add`, `code_read`.

## 1. Biết mình đang ở đâu (luôn làm trước)

```bash
git status -sb
git fetch --prune --quiet origin
git rev-list --left-right --count HEAD...@{u}          # "A B": A = mình đi TRƯỚC (chưa đẩy), B = mình đi SAU (chưa kéo)
git rev-list --left-right --count HEAD...origin/main   # nhánh tính năng thiếu bao nhiêu commit mới của main
git remote -v
```
- Người dùng có thể tự gõ `/dong-bo` (CLI/app/VS Code): nó fetch, đếm, so remote với repo dự án và HỎI pull an toàn (fast-forward).
- Gọi `project_repos` (dự án đang gắn) và so với `git remote -v` (bỏ `.git`, coi `git@github.com:a/b` = `https://github.com/a/b`).
  Không khớp ⇒ nói rõ "thư mục này không phải repo của dự án" và đề nghị `git clone <cloneHttps>` vào thư mục mới — đừng làm tiếp trên nhầm repo.
- Đang dở rebase/merge (`git status` báo "rebase in progress" / "You have unmerged paths") ⇒ xử lý cái đó trước (mục 6).

## 2. Kéo bản mới về — an toàn

| Tình huống | Làm |
|---|---|
| Chỉ đi SAU, không có commit riêng | `git merge --ff-only @{u}` (= pull fast-forward). Thay đổi chưa commit được giữ; đụng file đang sửa thì git từ chối — không mất gì |
| Đi sau VÀ đi trước (phân kỳ), commit của mình CHƯA đẩy | `git rebase @{u}` — lịch sử thẳng, sau đó đẩy bình thường, KHÔNG cần ép |
| Phân kỳ trên nhánh nhiều người cùng đẩy | `git merge --no-edit @{u}` |
| Có thay đổi đang sửa mà cần rebase/merge | hỏi người dùng: commit dở (`wip(NT-24): …`) hay `git stash push -u -m "…"` — rồi mới làm |

KHÔNG `git pull` trần khi chưa biết cấu hình `pull.rebase` của máy — nói rõ mình chọn ff/rebase/merge.

## 3. Nhánh theo thẻ

Tên nhánh: `<loại>/<KEY>-<số>-<mô-tả-ngắn>` — chữ thường không dấu, gạch nối, ≤ 60 ký tự:
- Story/Task ⇒ `feature/NT-24-login-form` · Bug ⇒ `fix/NT-31-sai-tong-tien` · tài liệu ⇒ `docs/NT-40-readme` · cấu hình ⇒ `chore/NT-12-ci`.
- Lấy tiêu đề + loại thẻ bằng `get_issue`. Luôn tách từ bản MỚI NHẤT của nhánh mặc định:
  ```bash
  git fetch origin
  git switch -c feature/NT-24-login-form origin/main
  ```
- Hoặc `/ctwork bat-dau NT-24` (tạo nhánh + chuyển thẻ sang In Progress, có xem trước).
- Người dùng ĐANG sửa trên `main`: `git switch -c feature/NT-24-…` mang theo thay đổi chưa commit sang nhánh mới — an toàn, làm ngay trước khi commit.
- Một thẻ = một nhánh = một PR. Việc ngoài thẻ ⇒ đề nghị tạo thẻ mới (`create_issue`, người dùng duyệt) thay vì nhét vào nhánh đang làm.

## 4. Commit có key thẻ

Conventional Commits + key thẻ trong phạm vi:
```
feat(NT-24): thêm form đăng nhập bằng email

Kiểm định dạng email phía client; lỗi 401 hiện "Sai mật khẩu" thay vì trang trắng.
```
- `feat` tính năng · `fix` sửa lỗi · `docs` · `refactor` · `test` · `chore` · `style` (định dạng, không đổi logic).
- Dòng đầu ≤ 72 ký tự, thể mệnh lệnh; thân nói VÌ SAO. Commit nhỏ, một ý một commit.
- Gọi `git_commit` với `loi_nhan` như trên — tool hiện danh sách file cho người dùng duyệt, loại file bí mật.
- Sau commit, ghi bằng chứng lên thẻ khi người dùng muốn: `comment` (SHA + tóm tắt) và `log_work`.

## 5. Mở PR và nối với thẻ

1. Cập nhật nhánh với main mới nhất (mục 2/7), chạy build + test của dự án — đỏ thì sửa trước.
2. `tao_pr` (tự `git push -u origin <nhánh>` rồi `gh pr create`; KHÔNG ép). Tiêu đề: `feat(NT-24): Form đăng nhập`.
   Thân PR:
   ```markdown
   Thẻ: NT-24 — <link thẻ CT Work>

   ## Đã làm
   - …
   ## Cách kiểm
   1. …
   ## Ảnh / ghi chú
   ```
3. Nối PR với thẻ: `issue_web_link_add` (URL PR) hoặc `comment` có link; chuyển thẻ sang Review bằng `transition` và nhờ trưởng nhóm bằng
   `request_review` — mỗi lệnh ghi đều qua thẻ duyệt.
4. Trưởng nhóm review: `code_read` (`pr`, `pr_files`, `compare`) để đọc diff; CuongMini KHÔNG tự duyệt/merge PR.
5. Sau khi PR được merge: `git switch main && git merge --ff-only origin/main`, rồi xoá nhánh cục bộ `git branch -d feature/NT-24-…`
   (`-d` từ chối nếu chưa merge — đúng như mong muốn) và `git fetch --prune`.

## 6. Giải xung đột — từng bước

```bash
git status                                   # "both modified" = file xung đột
git diff --name-only --diff-filter=U
git -c merge.conflictStyle=zdiff3 checkout --conflict=zdiff3 <file>   # hiện cả BẢN GỐC
```
Với TỪNG khối `<<<<<<< ||||||| ======= >>>>>>>`:
1. Đọc bản gốc (`|||||||`) ⇒ mỗi phía đã đổi GÌ. Xem ý định: `git log --oneline -5 origin/main -- <file>`, `git log -3 -p HEAD -- <file>`.
2. Viết bản giữ ý định của CẢ HAI phía; không chọn bừa một bên. Hai phía đổi cùng logic nghiệp vụ theo hai hướng ⇒ DỪNG, trình bày cho người dùng chọn.
3. Xoá hết dấu, kiểm: `git diff --check` và tìm `^<<<<<<<|^>>>>>>>` trong các file đã sửa.
4. Build + test, rồi `git add <file>` và `git -c core.editor=true rebase --continue` (hoặc `git commit --no-edit` khi merge).
5. Rối ⇒ `git rebase --abort` / `git merge --abort` đưa repo về đúng như trước khi bắt đầu.
- ⚠ Trong REBASE, `--ours` = nhánh đích (main), `--theirs` = commit của BẠN.
- Lockfile (`package-lock.json`…) xung đột ⇒ lấy bản của main rồi chạy lại `npm install`, không sửa tay.

## 7. Rebase hay merge khi cập nhật nhánh tính năng

| Nhánh | Chọn | Vì sao |
|---|---|---|
| Chưa đẩy lên GitHub | `git rebase origin/main` | lịch sử thẳng, PR gọn |
| Đã đẩy / đã mở PR | `git merge --no-edit origin/main` | rebase viết lại commit đã đẩy ⇒ phải đẩy ép — không làm |
| `main`, `develop` | không bao giờ rebase | nhánh chung |

## 8. Gợi ý cho trưởng nhóm (nói khi được hỏi "làm sao cho chuyên nghiệp")

- GitHub → Settings → Branches: bảo vệ `main` (bắt buộc PR + ≥ 1 review + CI xanh, cấm force push).
- Squash and merge + tự xoá nhánh sau khi merge ⇒ `main` mỗi thẻ một commit, đọc lịch sử là ra tiến độ.
- Mỗi sáng: `/dong-bo` (hoặc fetch + pull ff-only) trước khi code; mỗi PR nhỏ (≤ ~400 dòng) để review kịp trong ngày.
- Commit/PR luôn có key thẻ ⇒ CT Work (trang Code / `dev_activity`) nối đúng hoạt động với thẻ, báo cáo đóng góp chính xác.
