#!/bin/bash
# chay: tay — chụp output thật cho bài 0.3 (cài đặt máy). Mọi thứ chạy trong thư mục tạm; cấu hình git dùng tệp tạm
# (GIT_CONFIG_GLOBAL) nên KHÔNG đụng ~/.gitconfig của máy. bash content/courses/web-foundations/_demo/_t0/chay-may.sh
set -u
cd "$(dirname "$0")"
NODEBIN="$HOME/.nvm/versions/node/v22.23.3/bin"
export PATH="$NODEBIN:$PATH"
OUT="$PWD/out"; MAY="$PWD/may"
T=$(mktemp -d); cd "$T"
{
  echo '$ node --version'; node --version
  echo '$ npm --version'; npm --version
  echo '$ git --version'; git --version
  echo '$ code --version'; code --version 2>/dev/null | head -1 || echo '(code CLI not on PATH)'
} > "$OUT/versions.out.txt"
{ echo '$ nodee --version'; zsh -c 'nodee --version' 2>&1; echo '$ echo $?'; zsh -c 'nodee --version >/dev/null 2>&1; echo $?'; } > "$OUT/not-found.out.txt"
cp "$MAY/hello.js" . && sed -i '' '1d' hello.js
{ echo '$ node hello.js'; node hello.js; } > "$OUT/hello.out.txt"
mkdir my-first-project && cd my-first-project
{ echo '$ npm init -y'; npm init -y 2>&1 | sed -e "s#/private$T#/Users/linh/code#" -e "s#$T#/Users/linh/code#"; } > "$OUT/npm-init.out.txt"
cd "$T"
export GIT_CONFIG_GLOBAL="$T/gitconfig-demo"
{
  echo '$ git config --global user.name "Linh Nguyen"'; git config --global user.name "Linh Nguyen"
  echo '$ git config --global user.email "linh@example.com"'; git config --global user.email "linh@example.com"
  echo '$ git config --global init.defaultBranch main'; git config --global init.defaultBranch main
  echo '$ git config --global --list'; git config --global --list
} > "$OUT/git-config.out.txt"
unset GIT_CONFIG_GLOBAL
cp "$MAY/kiem-may.mjs" .
{ echo '$ node kiem-may.mjs'; node kiem-may.mjs; } > "$OUT/kiem-may.out.txt"
{ echo '$ node kiem-may.mjs      # on a machine where Git and VS Code are not installed yet'; PATH="$NODEBIN" "$NODEBIN/node" kiem-may.mjs; } > "$OUT/kiem-may-thieu.out.txt"
cd / && rm -rf "$T"
echo ok
