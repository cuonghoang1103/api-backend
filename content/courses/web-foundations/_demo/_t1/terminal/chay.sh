#!/bin/bash
# chay: tay — Bài 1.1: terminal thật (bash, môi trường sạch env -i) trong một "thư mục nhà" tạm. Đường dẫn tạm in thành /Users/lan.
# Ghi out/*.out.txt. bash content/courses/web-foundations/_demo/_t1/terminal/chay.sh
set -u
cd "$(dirname "$0")"
OUT="$(pwd)/out"
NODEDIR="$HOME/.nvm/versions/node/v22.23.3/bin"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
H="$T/lan"; mkdir -p "$H"
# một phiên: mỗi dòng của tệp kịch bản được in "$ lệnh" rồi chạy trong CÙNG một shell (cd giữ nguyên giữa các lệnh)
phien() {  # phien <tên-output> <<'KICHBAN'  — mỗi phiên bắt đầu ở một "nhà" mới có sẵn cây projects/
  local script="$T/script.sh"
  rm -rf "$H"; mkdir -p "$H/projects/shop/src" "$H/projects/blog"
  touch "$H/projects/notes.txt" "$H/projects/shop/index.html" "$H/projects/shop/src/app.js"
  { echo 'cd "$HOME"'
    while IFS= read -r line; do
      if [[ "$line" == '#'* ]]; then printf 'echo %q\n' "$line"; continue; fi
      printf '__s=$?; echo %q; (exit $__s)\n' "\$ $line"        # in lệnh mà KHÔNG làm mất $? của lệnh trước
      printf '%s\n' "${line//\/Users\/lan/\$HOME}"            # hiện /Users/lan, chạy trong thư mục tạm
    done
  } > "$script"
  env -i HOME="$H" PATH="$NODEDIR:/usr/bin:/bin" LANG=en_US.UTF-8 /bin/bash --norc --noprofile "$script" 2>&1 \
    | sed -e "s#$script: line [0-9]*: #bash: #" -e "s#$H#/Users/lan#g" -e "s#$NODEDIR#/Users/lan/.nvm/versions/node/v22.23.3/bin#g" > "$OUT/$1.out.txt"
}
phien navigate <<'K'
pwd
ls
ls projects
cd projects/shop
pwd
ls -F
cd src
pwd
cd ..
pwd
cd ../..
pwd
K

phien paths <<'K'
cd projects/shop/src
pwd
ls ../index.html
ls /Users/lan/projects/notes.txt
ls ../../notes.txt
ls notes.txt
cd ~
pwd
cd projects/blog
cd ../shop
pwd
cd -
K

phien files <<'K'
mkdir site
cd site
echo "<h1>Hello</h1>" > index.html
cat index.html
echo "<p>Second line</p>" >> index.html
cat index.html
cp index.html about.html
mv about.html contact.html
ls
mkdir old
mv contact.html old/
ls old
rmdir old
rm -r old
ls
K

phien spaces <<'K'
mkdir my project
ls
mkdir "my project"
ls
cd my project
pwd
cd ..
cd "my project"
pwd
K

phien globs <<'K'
mkdir demo && cd demo
touch a.js b.js c.css notes.txt
echo *.js
ls *.css
ls *.py
echo $?
ls -1 | wc -l
ls -1 | grep js
K

phien errors <<'K'
nodee -v
echo $?
node -v
echo $?
which node
cat missing.txt
echo $?
mkdir projects
echo $?
K

phien hidden <<'K'
cd projects/shop
touch .env .gitignore
ls
ls -a
ls -A
K

phien pipes <<'K'
cd projects
printf "apple\nbanana\napple\ncherry\napple\n" > fruits.txt
cat fruits.txt | sort
sort fruits.txt | uniq -c
sort fruits.txt | uniq -c | sort -r | head -1
grep -n apple fruits.txt
grep -c apple fruits.txt > count.txt
cat count.txt
K

phien search <<'K'
echo "<h1>Shop</h1>" > projects/shop/index.html
echo "console.log('shop ready');" > projects/shop/src/app.js
echo "TODO: write the about page" > projects/notes.txt
find projects -name "*.js"
find projects -type f
grep -rn "shop" projects
grep -rl TODO .
K
