# @ Chương 14 · bài 14.8 — gõ TỪ MÁY MAC (chương trình của chính mình, ghi trong thư mục tạm), từ lab/code/ch14:
# @   CH14_WORK=<thư mục tạm> bash phien-host.sh c148-mac.sh 2>&1 | CH14_WORK=… bash an-danh.sh > ../../out/c148-mac.out.txt
node cross.cjs
python3 cross.py
java Cross.java
java Res.java
git -C . config core.ignorecase
@ G="$CH14_WORK/case-repo"; rm -rf "$G"; mkdir -p "$G"; cd "$G"
git init -q && git config user.name dev && git config user.email dev@example.com && echo hi > Readme.md && git add . && git commit -qm init && git ls-files
mv Readme.md README.md; ls; git status --short; echo "(git sees no change)"
git mv -f Readme.md README.md; git status --short
@ R="$CH14_WORK/eol-repo"; rm -rf "$R"; mkdir -p "$R"; cd "$R"
git init -q && git config user.name dev && git config user.email dev@example.com && printf '#!/bin/bash\necho ok\n' > run.sh && git add run.sh && git commit -qm init && file run.sh
git config core.autocrlf true; rm run.sh; git checkout -- run.sh; file run.sh
printf '*.sh text eol=lf\n' > .gitattributes; rm run.sh; git checkout -- run.sh; file run.sh
