#!/bin/bash
# chay: tay — Mốc 1: dựng khung repo dự án trong thư mục TẠM bằng Git thật (cấu hình toàn cục tắt, ngày cố định)
# bash content/courses/web-foundations/_demo/_moc/m1/chay.sh  ⇒ _moc/out/m1.out.txt
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
T=$(mktemp -d); cd "$T"
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME="An Nguyen" GIT_AUTHOR_EMAIL="an@example.com" GIT_COMMITTER_NAME="An Nguyen" GIT_COMMITTER_EMAIL="an@example.com"
d() { export GIT_AUTHOR_DATE="2026-11-21T0$1:00:00+07:00" GIT_COMMITTER_DATE="2026-11-21T0$1:00:00+07:00"; }
run() { echo "\$ $*"; eval "$@" 2>&1; echo; }
{
run "mkdir recipe-notebook && cd recipe-notebook && git init -q -b main"
mkdir -p src docs
printf '# Recipe notebook\n\nA small web app to save, search and share cooking recipes.\n\n## Features (planned)\n- [ ] List and search recipes\n- [ ] Add / edit / delete a recipe\n- [ ] Log in to keep private recipes\n\n## Run it\n    npm install\n    npm run dev\n' > README.md
printf 'node_modules/\n.env\ndist/\n.DS_Store\n' > .gitignore
printf 'PORT=3000\nDATABASE_URL=file:./dev.db\n' > .env.example
printf 'PORT=3000\nSESSION_SECRET=only-on-my-machine\n' > .env
printf '{\n  "name": "recipe-notebook",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "npx serve src",\n    "test": "node --test"\n  }\n}\n' > package.json
printf '<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Recipe notebook</title></head>\n<body><h1>Recipe notebook</h1></body>\n</html>\n' > src/index.html
mkdir -p node_modules/some-lib && echo "x" > node_modules/some-lib/index.js
run "git status --short --untracked-files=all"
run "git check-ignore -v .env node_modules/some-lib/index.js"
d 8; run "git add README.md .gitignore .env.example && git commit -q -m 'chore: README, .gitignore and .env.example' && echo committed"
d 9; run "git add package.json && git commit -q -m 'chore: package.json with dev and test scripts' && echo committed"
d 10; run "git add src/index.html && git commit -q -m 'feat: first page skeleton' && echo committed"
run "git status --short"
run "git log --oneline --format='%h %ad %s' --date=format:'%H:%M'"
run "git ls-files"
} > "$HERE/../out/m1.out.txt"
rm -rf "$T"
