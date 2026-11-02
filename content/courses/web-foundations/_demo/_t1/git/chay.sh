#!/bin/bash
# chay: tay — Bài 1.3: Git 2.51 cục bộ trong thư mục tạm (cấu hình toàn cục bị tắt, ngày cố định ⇒ SHA cố định).
# Ghi out/*.out.txt. bash content/courses/web-foundations/_demo/_t1/git/chay.sh
set -u
cd "$(dirname "$0")"
OUT="$(pwd)/out"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null GIT_AUTHOR_NAME=Lan GIT_AUTHOR_EMAIL=lan@example.com GIT_COMMITTER_NAME=Lan GIT_COMMITTER_EMAIL=lan@example.com
n=0
tick() { n=$((n+1)); local d; d=$(printf '2026-11-01T%02d:00:00+07:00' $((8+n))); export GIT_AUTHOR_DATE="$d" GIT_COMMITTER_DATE="$d"; }
say() { local o='$' a; for a in "$@"; do if [[ "$a" == *[\ \'\(\)#\<\>]* ]]; then o+=" \"$a\""; else o+=" $a"; fi; done; echo "$o"; }
x() { say "$@"; "$@" 2>&1 | sed -e "s#/private$T/#/Users/lan/#g" -e "s#$T/#/Users/lan/#g"; }
sh_() { echo "\$ $1"; eval "$1" 2>&1 | sed -e "s#/private$T/#/Users/lan/#g" -e "s#$T/#/Users/lan/#g"; }     # lệnh có > hoặc | — in nguyên văn rồi chạy

mkdir "$T/shop" && cd "$T/shop"
git config --global init.defaultBranch main 2>/dev/null || true
{
x git init -b main
echo '<h1>My shop</h1>' > index.html
x git status
x git add index.html
x git status --short
tick; x git commit -m "Add home page"
x git log --oneline
} > "$OUT/first-commit.out.txt"

{
sh_ "echo '<p>Opening soon</p>' >> index.html"
x git status --short
x git diff
x git add index.html
x git diff
x git diff --staged
tick; x git commit -m "Add opening message"
sh_ "echo 'body { font-family: sans-serif; }' > style.css"
sh_ "echo '<link rel=\"stylesheet\" href=\"style.css\">' >> index.html"
x git add .
tick; x git commit -m "Add basic styles"
x git log --oneline
x git show --stat HEAD
} > "$OUT/three-areas.out.txt"

{
echo "# 1. undo an edit you have NOT staged"
sh_ "echo 'BROKEN' > index.html"
x git status --short
x git restore index.html
sh_ "head -1 index.html"
echo
echo "# 2. unstage a file (keep the edit)"
sh_ "echo '<footer>(c) 2026</footer>' >> index.html"
x git add index.html
x git restore --staged index.html
x git status --short
x git restore index.html
echo
echo "# 3. undo a COMMIT safely: a new commit that reverses it"
tick; x git revert --no-edit HEAD
x git log --oneline
x git show HEAD~1:style.css
} > "$OUT/undo.out.txt"

{
mkdir -p node_modules/left-pad && echo 'module.exports = 1' > node_modules/left-pad/index.js
echo 'API_KEY=dev-only-123' > .env
echo 'debug' > npm-debug.log
x git status --short
cat > .gitignore <<'GI'
node_modules/
.env
*.log
GI
say cat .gitignore; cat .gitignore
x git status --short
x git check-ignore -v .env npm-debug.log node_modules/left-pad/index.js
x git add .gitignore
tick; x git commit -m "Ignore dependencies, secrets and logs"
} > "$OUT/gitignore.out.txt"

{
mkdir "$T/blog" && cd "$T/blog" && git init -q -b main
echo '# the mistake: .env was committed BEFORE anyone wrote a .gitignore'
echo '<h1>Blog</h1>' > index.html; echo 'API_KEY=dev-only-123' > .env
tick; git add -A; x git commit -m "First version"
sh_ "echo '.env' > .gitignore"
sh_ "echo 'API_KEY=dev-only-456' > .env"
x git status --short
echo "# .gitignore does not stop tracking a file Git already tracks — untrack it:"
x git rm --cached .env
x git add .gitignore
tick; x git commit -m "Stop tracking .env"
sh_ "echo 'API_KEY=dev-only-789' > .env"
x git status --short
echo "# …but the old value is still in history"
x git log --oneline -- .env
x git show HEAD~1:.env
} > "$OUT/env-mistake.out.txt"
cd "$T/shop"

{
x git switch -c feature/contact
sh_ "echo '<a href=\"contact.html\">Contact</a>' >> index.html"
tick; git add index.html; x git commit -m "Link to contact page"
x git log --oneline --graph --all -3
x git switch main
sh_ "grep -c Contact index.html"
x git merge feature/contact
sh_ "grep -c Contact index.html"
x git branch -d feature/contact
x git log --oneline -3
} > "$OUT/branch.out.txt"
