#!/bin/bash
# chay: tay — Mốc 10: nhánh tính năng + kho trần đóng vai GitHub + test tái hiện lỗi (node --test), Git 2.51, ngày cố định
# bash content/courses/web-foundations/_demo/_moc/m10/chay.sh  ⇒ _moc/out/m10.out.txt
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
T=$(mktemp -d); cd "$T"
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME="An Nguyen" GIT_AUTHOR_EMAIL="an@example.com" GIT_COMMITTER_NAME="An Nguyen" GIT_COMMITTER_EMAIL="an@example.com"
n=0; d() { n=$((n+1)); export GIT_AUTHOR_DATE="2026-11-22T1$n:00:00+07:00" GIT_COMMITTER_DATE="2026-11-22T1$n:00:00+07:00"; }
run() { echo "\$ $*"; eval "$@" 2>&1; echo; }
git init -q --bare origin.git
git init -q -b main app && cd app && git remote add origin ../origin.git
printf 'export function page(items, n, size) {\n  return items.slice(n * size, n * size + size);   // n starts at 1 in the URL\n}\n' > paging.mjs
d; git add . && git commit -q -m "feat: paging helper" && git push -q -u origin main 2>/dev/null
{
run "git switch -c fix/page-one-skips-items"
printf "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { page } from './paging.mjs';\n\ntest('page 1 shows the first items', () => {\n  assert.deepEqual(page([1, 2, 3, 4, 5, 6], 1, 5), [1, 2, 3, 4, 5]);\n});\ntest('page 2 shows the rest', () => {\n  assert.deepEqual(page([1, 2, 3, 4, 5, 6], 2, 5), [6]);\n});\n" > paging.test.mjs
run "node --test paging.test.mjs | grep -E '^(not ok|ok) [0-9]|^# (pass|fail)'"
d; run "git add paging.test.mjs && git commit -q -m 'test: reproduce #3 (page 1 skips the first items)' && echo committed"
printf 'export function page(items, n, size) {\n  const start = (n - 1) * size;                     // pages in the URL are 1-based\n  return items.slice(start, start + size);\n}\n' > paging.mjs
run "node --test paging.test.mjs | grep -E '^(not ok|ok) [0-9]|^# (pass|fail)'"
d; run "git commit -q -am 'fix: 1-based page numbers (closes #3)' && git push -q -u origin fix/page-one-skips-items 2>&1 | grep -v '^remote' ; echo pushed"
run "git log --oneline main..fix/page-one-skips-items"
run "git switch -q main && git merge -q --no-ff fix/page-one-skips-items -m 'Merge PR #4: fix/page-one-skips-items' && git push -q origin main && git tag v0.2.0 && echo merged"
run "git log --graph --oneline --format='%h %s'"
} > "$HERE/../out/m10.out.txt"
cd / && rm -rf "$T"
