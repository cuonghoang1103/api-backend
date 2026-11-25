#!/bin/bash
# _tao-git-spring.sh <thư mục nguồn lab/legacy-spring-api> <thư mục đích> — dựng repo git 1 commit (mã băm cố định 644975a, như bài 7.2/7.3)
set -e
src=$(cd "$1" && pwd); mkdir -p "$2"; cd "$2"; cp -r "$src"/. .
git init -q -b master; git add -A
GIT_AUTHOR_DATE="2021-09-14T10:00:00+07:00" GIT_COMMITTER_DATE="2021-09-14T10:00:00+07:00" \
  git -c user.name="Pham Minh Khoa" -c user.email=khoa@thuvien.local -c core.autocrlf=false commit -qm "thuvien-api 1.4.0: REST cho app di dong (Spring Boot 2.5)"
git log --oneline
