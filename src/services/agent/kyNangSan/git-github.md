---
name: git-github
description: Dùng Git/GitHub an toàn — nhánh, commit rõ nghĩa, pull/push, rebase hay merge, giải xung đột (conflict), stash, cherry-pick, cứu commit bằng reflog, .gitignore, LFS, lỡ đẩy key, gh CLI tạo PR/issue/release, xem CI đỏ. Dùng khi người dùng nhắc git, commit, push, nhánh, PR, conflict.
---

# KỸ NĂNG: GIT & GITHUB — làm nhanh mà không bao giờ mất mã

Mục tiêu: lịch sử sạch, đọc được; không mất một dòng mã nào của người dùng hay đồng đội;
mọi thao tác chạy KHÔNG TƯƠNG TÁC (không mở trình soạn thảo, không chờ gõ mật khẩu).

## 0. Luật vàng

1. **Nhìn trước khi làm.** Mọi việc bắt đầu bằng:
   ```bash
   git status -sb && git log --oneline --graph -15 && git remote -v
   ```
   Biết mình đang ở nhánh nào, có thay đổi chưa commit không, đang giữa rebase/merge không.
2. **Không bao giờ để lệnh mở trình soạn thảo hay hỏi mật khẩu** — bạn không trả lời được, lệnh treo tới hết giờ:
   ```bash
   export GIT_TERMINAL_PROMPT=0 GIT_EDITOR=true GH_PROMPT_DISABLED=1
   git commit -m "..."                        # luôn có -m
   git merge --no-edit origin/main
   git -c core.editor=true rebase --continue  # hoặc GIT_EDITOR=true git rebase --continue
   git revert --no-edit <sha>
   git cherry-pick <sha>                       # không xung đột thì không mở editor
   ```
   KHÔNG dùng `git rebase -i`, `git add -p`, `git commit` không `-m` — chúng cần người gõ.
   `Permission denied (publickey)` / `Authentication failed` ⇒ DỪNG, hướng dẫn người dùng `gh auth login`
   hoặc nạp SSH key (họ tự làm), rồi kiểm lại bằng `gh auth status` / `ssh -T git@github.com`.
3. **Thay đổi chưa commit là thứ dễ mất nhất.** Trước bất cứ lệnh nào có thể ghi đè cây làm việc
   (checkout nhánh khác, pull, rebase, reset) mà `git status` còn bẩn ⇒ commit tạm hoặc `stash` trước.
4. **Commit của ai thì người đó quyết.** Không commit/push khi người dùng chưa bảo. Chỉ `git add` đúng file
   mình sửa — KHÔNG `git add -A`/`git add .` mù khi cây làm việc có file lạ (có thể là việc dở của người khác, hoặc `.env`).
5. **Kiểm kết quả, không tin lệnh.** Sau push: `git log --oneline origin/<nhánh>..HEAD` phải rỗng.
   Sau rebase: `git log --oneline --graph -10` đúng hình dạng mong đợi, và build/test vẫn chạy.

## 1. Luồng làm việc theo nhánh

```bash
git fetch --prune origin
git switch main && git pull --ff-only          # --ff-only: không lặng lẽ tạo commit merge
git switch -c feat/dang-nhap-google            # nhánh mới cho MỘT việc
# ... sửa, kiểm ...
git add src/auth/google.ts src/routes/auth.ts
git commit -m "feat(auth): đăng nhập bằng Google"
git push -u origin feat/dang-nhap-google
gh pr create --base main --fill                # --fill lấy tiêu đề/mô tả từ commit
```
Tên nhánh: `feat/...`, `fix/...`, `docs/...`, `chore/...` — chữ thường, gạch nối, không dấu, không khoảng trắng.

**Commit nhỏ, rõ nghĩa — Conventional Commits:**
```
<loại>(<phạm vi>): <mô tả ngắn, thể mệnh lệnh>

<thân: VÌ SAO đổi, không phải đổi gì — diff đã nói đổi gì>
```
Loại: `feat` (tính năng) · `fix` (sửa lỗi) · `docs` · `refactor` (không đổi hành vi) · `test` · `chore` (cấu hình, phụ thuộc)
· `perf` · `ci` · `build`. Thay đổi phá vỡ tương thích: `feat!:` hoặc dòng `BREAKING CHANGE:` trong thân.
Một commit = một ý. Sửa lỗi + đổi định dạng cả file ⇒ hai commit. Commit nhiều dòng không cần editor:
```bash
git commit -m "fix(cart): không cho số lượng âm" -m "Trước đây nhập -1 làm tổng tiền âm và vẫn thanh toán được."
```

## 2. Đồng bộ an toàn

- **Luôn `fetch` trước khi quyết.** `git fetch` không đụng vào cây làm việc; xem chênh lệch rồi mới chọn:
  ```bash
  git fetch origin
  git log --oneline HEAD..origin/main    # họ có mà mình chưa có
  git log --oneline origin/main..HEAD    # mình có mà họ chưa có
  ```
- Nhánh cá nhân chưa ai dùng chung ⇒ `git pull --rebase` (lịch sử thẳng). Nhánh nhiều người cùng đẩy ⇒ `git pull --no-rebase --no-edit`.
- `push` bị từ chối (`rejected ... fetch first` / `non-fast-forward`) ⇒ **KHÔNG** `--force`. Làm: `git pull --rebase`, giải xung đột nếu có, kiểm, rồi `push` lại.

### Rebase hay merge?
| Tình huống | Chọn |
|---|---|
| Cập nhật nhánh CỦA MÌNH, chưa push hoặc chỉ mình dùng | `git rebase origin/main` |
| Nhánh đã có người khác kéo về / đang làm chung | `git merge --no-edit origin/main` |
| Gộp PR vào `main` | theo quy ước repo — thường "Squash and merge" |
| Nhánh chính (`main`, `develop`) | **không bao giờ rebase** |

Sau khi rebase nhánh đã push (của riêng mình): `git push --force-with-lease` — nó từ chối nếu trên remote có commit
mình chưa thấy. Không bao giờ `--force` trần, không bao giờ force lên nhánh chung.

## 3. Giải xung đột — từng bước, không chọn bừa

```bash
git status                                     # "both modified" = file đang xung đột
git diff --name-only --diff-filter=U           # chỉ danh sách file xung đột
git config merge.conflictStyle zdiff3          # hiện cả BẢN GỐC chung (git ≥ 2.35; cũ hơn dùng diff3)
git checkout --conflict=zdiff3 src/cart.ts     # dựng lại dấu xung đột của một file theo kiểu có bản gốc
```
Với TỪNG khối `<<<<<<< ... ||||||| ... ======= ... >>>>>>>`:
1. Đọc BẢN GỐC (`|||||||`) — nó cho biết mỗi phía đã đổi GÌ so với gốc.
2. Đọc lịch sử để hiểu Ý ĐỊNH mỗi phía: `git log --oneline -5 origin/main -- src/cart.ts` và `git log -5 -p HEAD -- src/cart.ts`.
3. Viết bản giữ Ý ĐỊNH của cả hai (thường là cả hai thay đổi, ghép đúng thứ tự) — không phải chọn một bên cho xong.
4. Xoá hết dấu; kiểm không sót: `git diff --check` và `grep -rn '^<<<<<<<\|^>>>>>>>' src/`.
5. Chạy build/test RỒI mới `git add <file>` và `git -c core.editor=true rebase --continue` (hoặc `git commit --no-edit` khi merge).

⚠️ **Trong REBASE, "ours" và "theirs" bị đảo:** `--ours` = nhánh bạn đang rebase LÊN (main),
`--theirs` = commit của BẠN. Chỉ dùng `git checkout --ours/--theirs <file>` khi chắc chắn cả file thuộc về một phía.

Rối quá / làm sai ⇒ quay về như chưa bắt đầu: `git rebase --abort` · `git merge --abort` · `git cherry-pick --abort`.
Hai phía sửa cùng logic nghiệp vụ theo hai hướng khác nhau ⇒ DỪNG, trình bày cả hai cho người dùng chọn.

**Lockfile xung đột** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`) — KHÔNG sửa tay. Lấy bản của main rồi sinh lại:
```bash
git checkout origin/main -- package-lock.json   # khi đang merge/rebase lên main
npm install                                      # thêm lại phụ thuộc của nhánh mình theo package.json đã giải
git add package-lock.json
```
`package.json` thì phải giải bằng tay trước (giữ phụ thuộc của cả hai phía), lockfile sinh sau.

## 4. Các công cụ hằng ngày

```bash
git stash push -u -m "dở: form đăng ký"   # -u gồm cả file mới chưa track
git stash list
git stash pop                              # xung đột khi pop ⇒ stash VẪN còn, giải xong mới `git stash drop`
git cherry-pick -x <sha>                   # chép một commit sửa lỗi sang nhánh khác; -x ghi nguồn
git commit --amend --no-edit               # thêm file quên vào commit CUỐI (chỉ khi CHƯA push)
git reset --soft HEAD~1                    # gỡ commit cuối, giữ nguyên thay đổi đã stage
git restore --staged <file>                # bỏ stage, giữ nội dung
git revert --no-edit <sha>                 # huỷ commit ĐÃ push bằng commit ngược — cách đúng trên nhánh chung
git log -S "tenHam" --oneline              # commit nào thêm/xoá chuỗi này
git blame -L 40,60 src/cart.ts             # ai sửa dòng 40–60, commit nào
git bisect start; git bisect bad; git bisect good <sha-cu>   # tìm commit gây lỗi bằng chia đôi
git bisect run npm test                    # tự chạy test ở mỗi bước; xong: git bisect reset
```

## 5. Khôi phục khi lỡ tay — `reflog` là lưới an toàn

Commit gần như không bao giờ mất thật: `reflog` ghi mọi vị trí HEAD từng đứng (giữ ~90 ngày).
```bash
git reflog -20                         # tìm dòng ngay TRƯỚC thao tác lỡ tay, ví dụ HEAD@{3}
git branch cuu-ho HEAD@{3}             # neo lại bằng nhánh mới — an toàn, không ghi đè gì
git log --oneline cuu-ho -5            # kiểm đúng thứ cần cứu rồi mới merge/cherry-pick về
```
- Lỡ `reset --hard` mất commit ⇒ như trên.
- Lỡ xoá nhánh ⇒ `git reflog` tìm sha cuối của nó, `git branch <ten> <sha>`.
- Rebase hỏng ⇒ `git reflog` tìm `rebase (start)`, dòng ngay dưới nó là trạng thái trước rebase.
- Thay đổi CHƯA từng commit/stash mà bị `reset --hard`/`checkout --` ⇒ git không cứu được. Vì vậy mới có luật vàng số 3.
- Stash lỡ `drop` ⇒ `git fsck --no-reflog | grep 'dangling commit'` rồi `git show <sha>` để tìm.

## 6. `.gitignore`, `.gitattributes`, file lớn

`.gitignore` tối thiểu cho web fullstack:
```gitignore
node_modules/
dist/
build/
.next/
target/
__pycache__/
*.pyc
.venv/
.env
.env.*
!.env.example
*.log
.DS_Store
.idea/
.vscode/*
!.vscode/extensions.json
```
File ĐÃ được track thì thêm vào `.gitignore` không có tác dụng ⇒ `git rm --cached <file>` rồi commit.
Hỏi "vì sao file này bị bỏ qua": `git check-ignore -v <file>`.

**Windows ↔ Mac/Linux (CRLF/LF)** — diff toàn file dù không sửa gì, script `.sh` lỗi `bad interpreter: /bin/bash^M`:
```gitattributes
* text=auto eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf
*.png binary
*.jpg binary
```
Thêm `.gitattributes` rồi chuẩn hoá một lần: `git add --renormalize . && git commit -m "chore: chuẩn hoá xuống dòng LF"`.

**File lớn** (GitHub từ chối file > 100MB, cảnh báo > 50MB): không commit dataset, model AI, video, file build.
Bắt buộc phải có trong repo ⇒ Git LFS:
```bash
git lfs install
git lfs track "*.psd" "*.onnx"
git add .gitattributes && git commit -m "chore: dùng LFS cho file lớn"
```
File lớn đã nằm trong lịch sử ⇒ `git lfs migrate import --include="*.onnx"` VIẾT LẠI lịch sử ⇒ hỏi trước (mục 8).
Push bị từ chối vì file lớn ở commit cũ ⇒ xoá file hiện tại chưa đủ; phải gỡ khỏi commit đó (chưa push thì `reset --soft` rồi commit lại).

## 7. Lỡ commit bí mật (API key, mật khẩu DB, `.env`)

Thứ tự QUAN TRỌNG — key đã lên GitHub coi như đã lộ (bot quét repo công khai trong vài phút):
1. **Xoay key NGAY** — người dùng vào trang nhà cung cấp thu hồi key cũ, tạo key mới. Đây là bước duy nhất thật sự bảo vệ họ.
2. Gỡ khỏi mã hiện tại: đưa vào `.env` (đã ignore), `git rm --cached .env`, commit.
3. Xoá khỏi LỊCH SỬ — viết lại lịch sử, phải force-push, mọi người phải clone lại ⇒ **HỎI TRƯỚC**, rồi:
   ```bash
   # cài: pip install git-filter-repo   (hoặc brew install git-filter-repo)
   git clone --mirror <url> repo-sach.git && cd repo-sach.git
   git filter-repo --invert-paths --path .env
   # thay chuỗi bí mật trong mọi file: tạo thay.txt chứa dòng  KEY_CU==>***REMOVED***
   git filter-repo --replace-text ../thay.txt
   ```
   Commit chưa push ⇒ đơn giản hơn nhiều: `git reset --soft HEAD~1`, bỏ file, commit lại.
4. Kiểm lại: `git log --all -p -S "<vài ký tự đầu của key>" | head` phải rỗng. Có `gitleaks` thì chạy `gitleaks detect`.

## 8. GitHub CLI (`gh`) — không tương tác

```bash
gh auth status
gh repo create ten-du-an --private --source=. --push       # tạo repo từ thư mục hiện tại
gh pr create --base main --title "feat(auth): đăng nhập Google" --body-file mo-ta-pr.md
gh pr list --state open
gh pr view 42 --comments
gh pr diff 42
gh pr checks 42                                            # CI của PR
gh pr checkout 42                                          # kéo nhánh PR về để chạy thử
gh pr review 42 --comment -b "..."                         # hoặc --approve / --request-changes -b "..."
gh pr merge 42 --squash --delete-branch                    # luôn nêu rõ kiểu merge, không để nó hỏi
gh issue create --title "Lỗi giỏ hàng âm" --body "Các bước tái hiện: ..." --label bug
gh release create v1.2.0 --generate-notes --title "v1.2.0"
gh run list --limit 5
gh run view <run-id> --log-failed                          # CHỈ log của bước hỏng — đọc cái này trước
gh run watch <run-id> --exit-status                        # chờ tới khi xong, trả mã lỗi nếu đỏ
```
Không dùng `--web`/`gh browse` (mở trình duyệt, không có ai xem). Mô tả PR dài ⇒ viết ra file rồi `--body-file`.

**CI đỏ:** `gh run view <id> --log-failed` → tìm dòng lỗi ĐẦU TIÊN (không phải dòng cuối) → tái hiện ở máy bằng đúng lệnh
của bước đó → sửa → push. `git show --stat <sha>` để xem commit có chạm vào phần bị đỏ không trước khi nhận lỗi về mình.

**Review một PR:** đọc mô tả + `gh pr diff`; kéo về chạy (`gh pr checkout`, build, test); soi: logic sai, thiếu kiểm quyền,
bí mật trong diff, file không liên quan, thiếu test. Góp ý cụ thể theo dòng, phân rõ "bắt buộc sửa" với "gợi ý".

**Bảo vệ nhánh chính** (người dùng bật trên web: Settings → Rules/Branches): cấm push thẳng, bắt PR + CI xanh + ≥1 review,
cấm force-push và xoá nhánh. Kiểm hiện trạng: `gh api repos/{owner}/{repo}/branches/main/protection` (404 = chưa bật).

## 9. Bẫy đã gặp thật

- **Detached HEAD** (`HEAD detached at ...`) sau `git checkout <sha>`/tag: commit ở đây sẽ "mồ côi" khi chuyển nhánh.
  Muốn giữ ⇒ `git switch -c <ten-nhanh>` NGAY. Lỡ rời đi ⇒ `git reflog`.
- **Lệnh treo không ra gì** = đang chờ editor/mật khẩu/pager. Dùng các biến ở luật vàng 2; log dài thêm `--no-pager`
  (`git --no-pager log -20`) hoặc `| head`.
- **"Đã push" nhưng không lên:** push nhầm nhánh hoặc chưa có upstream. Kiểm `git branch -vv` và `git log origin/<nhánh>..HEAD`.
- **`git pull` tạo commit merge lạ** trên main ⇒ lẽ ra là `--ff-only`. Chưa push thì `git reset --hard ORIG_HEAD` (hỏi trước, xem mục 10).
- **Xoá file khỏi `.gitignore` không làm file biến mất khỏi repo** — và ngược lại, thêm vào `.gitignore` không gỡ file đã track.
- **Clone trên Windows đường dẫn quá dài** / tên file khác hoa-thường (`Header.tsx` vs `header.tsx`) — macOS/Windows không phân biệt,
  Linux/CI có. Đổi tên chỉ khác hoa-thường: `git mv header.tsx Header.tsx`.
- **Submodule trống sau clone** ⇒ `git submodule update --init --recursive`.
- **Hai phiên cùng làm một repo** — trước khi commit, `git status` lại: file lạ không phải của mình thì KHÔNG add.

## 10. Việc KHÔNG tự làm khi chưa được đồng ý

Nói rõ sẽ mất gì, đưa lệnh, chờ người dùng gật:
- `git push --force` / `--force-with-lease` lên nhánh chung (`main`, `develop`, nhánh đồng đội đang dùng).
- `git reset --hard`, `git checkout -- .`, `git restore .`, `git clean -fd` — xoá vĩnh viễn thay đổi chưa commit.
  Luôn chạy `git clean -nd` (xem thử) và `git stash` trước nếu người dùng đồng ý.
- Viết lại lịch sử đã push: rebase, amend, `filter-repo`, `lfs migrate`.
- Xoá nhánh của người khác (local hay remote), `gh repo delete`, đóng PR/issue của người khác.
- Merge PR vào nhánh chính, tạo release/tag công khai, đổi quyền/bảo vệ nhánh của repo.

## 11. Báo cáo cuối

Nhánh hiện tại, các commit đã tạo (`git log --oneline` đoạn liên quan), đã push chưa và tới đâu
(`origin/<nhánh>` khớp HEAD chưa), link PR/CI nếu có, xung đột nào đã giải và theo hướng nào, việc còn chờ người dùng
(xoay key, bật bảo vệ nhánh, duyệt PR).
