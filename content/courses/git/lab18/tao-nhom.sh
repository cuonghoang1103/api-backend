#!/usr/bin/env bash
# lab18/tao-nhom.sh — Lab nhiều người giả lập cho Chương 18 "Tai nạn Git thật của nhóm".
#
#   bash tao-nhom.sh                    # liệt kê tai nạn
#   bash tao-nhom.sh <tai-nan>          # dựng nhóm mới + TÁI HIỆN tai nạn, dừng ở chỗ hỏng
#   bash tao-nhom.sh <tai-nan> --sua    # như trên rồi chạy luôn cách SỬA
#   bash tao-nhom.sh tat-ca [--sua]     # chạy lần lượt mọi tai nạn (mỗi cái một nhóm mới) — dùng để tự kiểm
#   LAB18_DIR=/duong/dan bash tao-nhom.sh <tai-nan>   # chọn thư mục (mặc định: thư mục tạm mới, in ra ở cuối)
#
# AN TOÀN (đọc trước khi sửa script):
#  * Mọi thứ nằm trong MỘT thư mục tạm. HOME bị ép sang $LAB/home ⇒ không đọc/ghi ~/.gitconfig, ~/.ssh thật.
#  * Remote là một kho bare cục bộ ($LAB/github.git) — KHÔNG có URL mạng; GIT_SSH_COMMAND=false chặn SSH.
#  * Không gọi curl/gh/ssh. Không push lên GitHub thật. Mọi danh tính (An/Bình/Chi) là giả, mật khẩu trong dự án mẫu là giả.
#  * Chủ ý KHÔNG đặt pull.rebase / push.autoSetupRemote để tái hiện đúng lỗi người mới gặp.
set -uo pipefail

TAI_NAN="taiHien_build taiHien_xung_dot_web_xml taiHien_keo_main_nham taiHien_push_tu_choi taiHien_sua_nham_main taiHien_tu_merge taiHien_hoan_tac_merge"

# ───────────────────────── nền: môi trường cô lập ─────────────────────────
cach_ly() {
  case "$LAB" in
    /*) ;; *) echo "LAB phải là đường dẫn tuyệt đối" >&2; exit 2 ;;
  esac
  mkdir -p "$LAB/home"
  export HOME="$LAB/home" XDG_CONFIG_HOME="$LAB/home/.config"
  export GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL="$LAB/home/.gitconfig"
  export GIT_TERMINAL_PROMPT=0 GIT_EDITOR=true GIT_MERGE_AUTOEDIT=no GIT_PAGER=cat
  export GIT_SSH_COMMAND=false LC_ALL=C LANG=C
  unset SSH_AUTH_SOCK GH_TOKEN GITHUB_TOKEN
  git config --global init.defaultBranch main
  git config --global advice.detachedHead false
}

# in lệnh như người dùng gõ, rồi chạy trong clone của người đó, gộp stderr
#   do_ an git add .
do_() {
  local ai="$1"; shift
  local ten; case "$ai" in an) ten=An;; binh) ten=Binh;; chi) ten=Chi;; *) ten=$ai;; esac
  local a lenh=""
  for a in "$@"; do case "$a" in *[[:space:]\<\>\&\|\;\(\)]*) lenh="$lenh \"$a\"";; *) lenh="$lenh $a";; esac; done
  printf '%s$%s\n' "[$ten] " "$lenh"
  ( cd "$LAB/$ai" && "$@" ) 2>&1 | sed "s#$LAB#<LAB>#g"
  return "${PIPESTATUS[0]}"
}
# như do_ nhưng không chặn khi lệnh lỗi (để thấy thông báo lỗi)
thu_() { do_ "$@" || true; }
ghi_chu() { printf '\n# %s\n' "$*"; }
# ghi tệp (nội dung từ stdin) trong clone của ai
viet() { local ai="$1" f="$2"; mkdir -p "$(dirname "$LAB/$ai/$f")"; cat > "$LAB/$ai/$f"; }
# thêm cuối tệp
them() { local ai="$1" f="$2"; cat >> "$LAB/$ai/$f"; }

# NetBeans/Ant "build": sinh build/, dist/ và viết lại nbproject/private (nội dung phụ thuộc MÁY)
netbeans_build() {
  local ai="$1" may="$2"
  mkdir -p "$LAB/$ai/build/web/WEB-INF/classes/com/nhom/servlet" "$LAB/$ai/dist" "$LAB/$ai/nbproject/private"
  for s in LoginServlet DatLichServlet HomeServlet; do
    [ -f "$LAB/$ai/src/java/com/nhom/servlet/$s.java" ] && printf '\xca\xfe\xba\xbe\x00\x00\x00\x41%s-%s\n' "$s" "$RANDOM" > "$LAB/$ai/build/web/WEB-INF/classes/com/nhom/servlet/$s.class"
  done
  head -c 2048 /dev/urandom > "$LAB/$ai/dist/QuanLyPhongKham.war"
  cat > "$LAB/$ai/nbproject/private/private.properties" <<P
deploy.ant.properties.file=C:\\\\Users\\\\$may\\\\AppData\\\\Roaming\\\\NetBeans\\\\18\\\\tomcat.properties
j2ee.server.instance=tomcat90:home=C:\\\\Users\\\\$may\\\\apache-tomcat-9.0.89
# GIA - chi de minh hoa
tomcat.manager.username=admin
tomcat.manager.password=Tomcat@FPT2026
P
  cat > "$LAB/$ai/nbproject/private/private.xml" <<P
<?xml version="1.0" encoding="UTF-8"?>
<project-private xmlns="http://www.netbeans.org/ns/project-private/1">
    <editor-bookmarks xmlns="http://www.netbeans.org/ns/editor-bookmarks/1" lastBookmarkId="0"/>
    <open-files xmlns="http://www.netbeans.org/ns/projectui-open-files/1"><group><file>file:/C:/Users/$may/QuanLyPhongKham/src/java/com/nhom/servlet/HomeServlet.java</file></group></open-files>
</project-private>
P
}

ghi_nguoi() { # ghi_nguoi <thu muc> <Ten> <email>
  git -C "$LAB/$1" config user.name "$2"; git -C "$LAB/$1" config user.email "$3"
}

# ───────────────────────── dựng nhóm: 1 remote bare + 3 clone ─────────────────────────
lap_nhom() {
  rm -rf "$LAB/github.git" "$LAB/an" "$LAB/binh" "$LAB/chi" "$LAB/khoi"
  git init -q --bare "$LAB/github.git"
  # Kho khởi tạo (do An) — dự án NetBeans Ant tối thiểu, .gitignore THIẾU build/ dist/ nbproject/private/
  git init -q "$LAB/khoi"; ghi_nguoi khoi "An Nguyen" an@example.com
  git -C "$LAB/khoi" remote add origin "$LAB/github.git"
  mkdir -p "$LAB/khoi/src/java/com/nhom/servlet" "$LAB/khoi/web/WEB-INF" "$LAB/khoi/nbproject"
  cat > "$LAB/khoi/.gitignore" <<'G'
*.log
*.tmp
G
  cat > "$LAB/khoi/build.xml" <<'G'
<?xml version="1.0" encoding="UTF-8"?>
<project name="QuanLyPhongKham" default="default" basedir=".">
    <import file="nbproject/build-impl.xml"/>
</project>
G
  cat > "$LAB/khoi/nbproject/project.properties" <<'G'
javac.source=17
javac.target=17
source.encoding=UTF-8
build.dir=build
dist.dir=dist
G
  cat > "$LAB/khoi/web/index.jsp" <<'G'
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<html><body><h1>Phong kham - Dat lich</h1></body></html>
G
  for s in Login Home; do
    cat > "$LAB/khoi/src/java/com/nhom/servlet/${s}Servlet.java" <<G
package com.nhom.servlet;

import jakarta.servlet.http.HttpServlet;

public class ${s}Servlet extends HttpServlet {
    // TODO: xu ly ${s}
}
G
  done
  cat > "$LAB/khoi/web/WEB-INF/web.xml" <<'G'
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="6.0" xmlns="https://jakarta.ee/xml/ns/jakartaee">
    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>com.nhom.servlet.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>
    <servlet>
        <servlet-name>HomeServlet</servlet-name>
        <servlet-class>com.nhom.servlet.HomeServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>HomeServlet</servlet-name>
        <url-pattern>/home</url-pattern>
    </servlet-mapping>
    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>
</web-app>
G
  git -C "$LAB/khoi" add -A >/dev/null
  git -C "$LAB/khoi" commit -q -m "Khoi tao du an NetBeans: Login, Home, web.xml"
  git -C "$LAB/khoi" push -q origin main 2>/dev/null
  git --git-dir="$LAB/github.git" symbolic-ref HEAD refs/heads/main
  rm -rf "$LAB/khoi"
  git clone -q "$LAB/github.git" "$LAB/an"
  git clone -q "$LAB/github.git" "$LAB/binh"
  git clone -q "$LAB/github.git" "$LAB/chi"
  ghi_nguoi an   "An Nguyen"  an@example.com
  ghi_nguoi binh "Binh Tran"  binh@example.com
  ghi_nguoi chi  "Chi Le"     chi@example.com
}

# ───────────────────────── 1. Lỡ commit build/ + nbproject/private/ ─────────────────────────
taiHien_build() {
  ghi_chu "An thêm trang đặt lịch, bấm Build trong NetBeans rồi 'git add .'"
  viet an src/java/com/nhom/servlet/DatLichServlet.java <<'J'
package com.nhom.servlet;

import jakarta.servlet.http.HttpServlet;

public class DatLichServlet extends HttpServlet {
    // dat lich kham
}
J
  netbeans_build an AnNguyen
  do_ an git status --short
  do_ an git add .
  do_ an git commit -m "Them DatLichServlet"
  do_ an git push origin main
  ghi_chu "Bình pull, build trên máy mình (NetBeans viết lại private.properties theo máy Bình)"
  do_ binh git pull
  netbeans_build binh BinhTran
  do_ binh git status --short
  ghi_chu "An sửa tiếp, build lại, add . rồi push lần nữa"
  them an src/java/com/nhom/servlet/DatLichServlet.java <<'J'
// v2: kiem tra gio trong
J
  netbeans_build an AnNguyen
  do_ an git add .
  do_ an git commit -m "DatLichServlet: kiem tra gio trong"
  do_ an git push origin main
  ghi_chu "Bình pull — hỏng:"
  thu_ binh git pull
}
sua_build() {
  ghi_chu "BẪY: thêm vào .gitignore khi tệp ĐÃ được theo dõi thì vô ích — Git vẫn theo dõi chúng"
  them an .gitignore <<'G'
build/
dist/
nbproject/private/
G
  netbeans_build an AnNguyen
  do_ an git status --short
  thu_ an git check-ignore -v build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
  do_ an git check-ignore -v --no-index build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
  ghi_chu "SỬA (An): rút khỏi index (tệp vẫn nằm trên đĩa), commit cùng .gitignore"
  do_ an git rm -r --cached -q build dist nbproject/private
  do_ an git add .gitignore
  do_ an git status --short
  do_ an git commit -m "Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore"
  do_ an git push origin main
  do_ an git status --short
  do_ an git check-ignore -v build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
  do_ an git ls-files build dist nbproject
  ghi_chu "Tệp cũ VẪN nằm trong lịch sử và trên remote:"
  do_ an git log --oneline --all -- nbproject/private/private.properties
  do_ an git log --all --oneline -S Tomcat@FPT2026
  do_ an git grep -n "tomcat.manager.password" HEAD~1 -- nbproject/private/private.properties
  ghi_chu "Bình: pull vẫn vướng thay đổi cục bộ — cất bản build của mình đi rồi pull"
  do_ binh git stash push -q -- build dist nbproject/private
  do_ binh git pull
  do_ binh git stash drop
  do_ binh git status --short
  do_ binh ls
  do_ binh ls nbproject
  ghi_chu "Chi (chưa từng build): pull êm"
  do_ chi git pull
}

# ───────────────────────── 2. Xung đột web.xml + PR để lâu ─────────────────────────
them_servlet_xml() { # them_servlet_xml <ai> <Ten> <url>
  local ai="$1" ten="$2" url="$3" f="$LAB/$1/web/WEB-INF/web.xml"
  # chèn trước <session-config> — đúng chỗ ai cũng chèn
  awk -v t="$ten" -v u="$url" '/<session-config>/ && !d {
    print "    <servlet>"; print "        <servlet-name>" t "Servlet</servlet-name>"; print "        <servlet-class>com.nhom.servlet." t "Servlet</servlet-class>"; print "    </servlet>";
    print "    <servlet-mapping>"; print "        <servlet-name>" t "Servlet</servlet-name>"; print "        <url-pattern>" u "</url-pattern>"; print "    </servlet-mapping>"; d=1 } {print}' "$f" > "$f.new" && mv "$f.new" "$f"
}
taiHien_xung_dot_web_xml() {
  ghi_chu "An và Bình cùng rẽ nhánh từ main; mỗi người thêm một servlet và khai báo vào web.xml"
  do_ an git switch -c feature/dat-lich
  them_servlet_xml an DatLich /dat-lich
  viet an src/java/com/nhom/servlet/DatLichServlet.java <<'J'
package com.nhom.servlet;
public class DatLichServlet extends jakarta.servlet.http.HttpServlet { }
J
  do_ an git add -A; do_ an git commit -m "Them DatLichServlet va khai bao web.xml"
  do_ an git push -u origin feature/dat-lich
  do_ binh git switch -c feature/tra-cuu
  them_servlet_xml binh TraCuu /tra-cuu
  viet binh src/java/com/nhom/servlet/TraCuuServlet.java <<'J'
package com.nhom.servlet;
public class TraCuuServlet extends jakarta.servlet.http.HttpServlet { }
J
  do_ binh git add -A; do_ binh git commit -m "Them TraCuuServlet va khai bao web.xml"
  do_ binh git push -u origin feature/tra-cuu
  ghi_chu "PR của An được duyệt và merge vào main (mô phỏng nút 'Merge pull request' bằng merge --no-ff ở clone của An)"
  do_ an git switch main
  do_ an git merge --no-ff feature/dat-lich -m "Merge pull request #1 from an/dat-lich"
  do_ an git push origin main
  ghi_chu "PR của Bình nằm đó nhiều ngày. Trước khi hỏng, xem trước bằng merge-tree (không đụng cây làm việc):"
  do_ binh git fetch origin
  do_ binh git rev-list --left-right --count feature/tra-cuu...origin/main
  do_ binh git log --oneline feature/tra-cuu..origin/main -- web/WEB-INF/web.xml
  do_ binh git diff --stat feature/tra-cuu...origin/main
  thu_ binh git merge-tree --write-tree --name-only feature/tra-cuu origin/main
  ghi_chu "Bình cập nhật nhánh bằng cách merge main vào:"
  thu_ binh git merge origin/main
  do_ binh git status --short
  do_ binh git diff
}
sua_xung_dot_web_xml() {
  local f="$LAB/binh/web/WEB-INF/web.xml"
  ghi_chu "BẪY: cách 'xoá ba dòng dấu hiệu rồi giữ hết' — Git cắt vùng xung đột GIỮA một thẻ XML, nên kết quả hỏng"
  cp "$f" "$f.xung-dot"
  sed -e '/^<<<<<<< /d' -e '/^=======$/d' -e '/^>>>>>>> /d' "$f" > "$f.new" && mv "$f.new" "$f"
  thu_ binh xmllint --noout web/WEB-INF/web.xml
  ghi_chu "SỬA (Bình): lấy bản main làm gốc, thêm khối servlet của mình vào đúng chỗ, rồi kiểm tra bằng xmllint"
  rm -f "$f.xung-dot"
  git -C "$LAB/binh" show origin/main:web/WEB-INF/web.xml > "$f"
  them_servlet_xml binh TraCuu /tra-cuu
  thu_ binh grep -nE '^(<<<<<<<|=======|>>>>>>>)' web/WEB-INF/web.xml
  do_ binh xmllint --noout web/WEB-INF/web.xml
  do_ binh git add web/WEB-INF/web.xml
  do_ binh git commit -m "Merge main vao feature/tra-cuu: giu ca DatLich va TraCuu trong web.xml"
  do_ binh git push
  do_ binh git grep -n url-pattern -- web/WEB-INF/web.xml
}

# ───────────────────────── 3. Kéo main về nhánh ─────────────────────────
taiHien_keo_main_nham() {
  ghi_chu "An đẩy một thay đổi HomeServlet lên main"
  them an src/java/com/nhom/servlet/HomeServlet.java <<'J'
// An: hien thi ten benh nhan
J
  do_ an git commit -qam "HomeServlet: hien thi ten benh nhan"; do_ an git push origin main
  ghi_chu "Chi đang sửa dở HomeServlet trên nhánh, chưa commit, và gõ 'git pull origin main'"
  do_ chi git switch -c feature/trang-chu
  them chi src/java/com/nhom/servlet/HomeServlet.java <<'J'
// Chi: banner khuyen mai
J
  thu_ chi git pull origin main
  ghi_chu "Còn gõ 'git pull' trơn trên nhánh chưa từng push:"
  thu_ chi git pull
}
sua_keo_main_nham() {
  ghi_chu "SỬA (Chi): commit việc đang làm TRƯỚC, lấy main về bằng fetch, rồi merge main vào nhánh"
  do_ chi git commit -qam "HomeServlet: banner khuyen mai"
  do_ chi git fetch origin
  do_ chi git log --oneline main..origin/main
  thu_ chi git merge origin/main
  ghi_chu "Xung đột cùng chỗ cuối tệp — giữ cả hai dòng"
  sed -i.bak -e '/^<<<<<<< /d' -e '/^=======$/d' -e '/^>>>>>>> /d' "$LAB/chi/src/java/com/nhom/servlet/HomeServlet.java"; rm -f "$LAB/chi/src/java/com/nhom/servlet/HomeServlet.java.bak"
  do_ chi git commit -qam "Merge main vao feature/trang-chu"
  do_ chi git log --oneline --graph
}

# ───────────────────────── 4. Push bị từ chối ─────────────────────────
taiHien_push_tu_choi() {
  ghi_chu "An và Bình cùng sửa trên main, An push trước"
  them an web/index.jsp <<'J'
<!-- An: menu -->
J
  do_ an git commit -qam "index.jsp: them menu"; do_ an git push origin main
  them binh src/java/com/nhom/servlet/LoginServlet.java <<'J'
// Binh: kiem tra mat khau
J
  do_ binh git commit -qam "LoginServlet: kiem tra mat khau"
  thu_ binh git push origin main
  ghi_chu "Bình thử 'git pull' theo lời thông báo:"
  thu_ binh git pull
}
sua_push_tu_choi() {
  ghi_chu "SỬA (Bình): chọn cách hoà nhập MỘT lần — ở đây merge — rồi push"
  do_ binh git pull --no-rebase
  do_ binh git push origin main
  do_ binh git log --oneline --graph
  ghi_chu "Lần sau muốn lịch sử thẳng hàng: git pull --rebase (hoặc git config --global pull.rebase true)"
}

# ───────────────────────── 5. Sửa nhầm trên main ─────────────────────────
taiHien_sua_nham_main() {
  ghi_chu "Chi quên rẽ nhánh, làm 2 commit ngay trên main (chưa push)"
  them chi src/java/com/nhom/servlet/LoginServlet.java <<'J'
// Chi: dang nhap bang email
J
  do_ chi git commit -qam "Login bang email"
  them chi web/index.jsp <<'J'
<!-- Chi: nut dang nhap -->
J
  do_ chi git commit -qam "index: nut dang nhap"
  do_ chi git status -sb
  do_ chi git log --oneline -4
}
sua_sua_nham_main() {
  ghi_chu "SỬA (Chi, CHƯA push): đặt nhánh mới tại đây, đưa main về origin/main, sang nhánh mới"
  do_ chi git branch feature/dang-nhap-email
  do_ chi git reset --hard origin/main
  do_ chi git switch feature/dang-nhap-email
  do_ chi git status -sb
  do_ chi git log --oneline --graph --all --decorate
  sua_sua_nham_main_reflog
}

# ───────────────────────── 6. Tự merge không review (+ rào chắn mô phỏng) ─────────────────────────
taiHien_tu_merge() {
  ghi_chu "Bình tự merge nhánh của mình vào main, không ai xem. Nhánh có lỗi: trùng url-pattern /home"
  do_ binh git switch -c feature/trang-chu-moi
  them_servlet_xml binh TrangChu /home
  do_ binh git commit -qam "Them TrangChuServlet (map /home)"
  do_ binh git switch main
  do_ binh git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi (khong qua PR)"
  do_ binh git push origin main
  ghi_chu "Cả nhóm thấy gì khi nhìn lịch sử main:"
  do_ an git pull
  do_ an git log --first-parent --oneline -3
  do_ an git log --merges --first-parent --format="%h %an: %s" -3
  do_ an grep -c "<url-pattern>/home</url-pattern>" web/WEB-INF/web.xml
}
bat_bao_ve_main() { # MÔ PHỎNG luật 'main được bảo vệ' bằng hook của kho bare — KHÔNG phải thông báo thật của GitHub
  cat > "$LAB/github.git/hooks/pre-receive" <<'H'
#!/bin/sh
while read old new ref; do
  if [ "$ref" = "refs/heads/main" ] && [ -z "$LAB18_QUA_PR" ]; then
    echo "MO PHONG luat bao ve nhanh: main chi nhan thay doi qua pull request." >&2
    exit 1
  fi
done
H
  chmod +x "$LAB/github.git/hooks/pre-receive"
}

# ───────────────────────── 7. Hoàn tác merge ─────────────────────────
taiHien_hoan_tac_merge() { taiHien_tu_merge; }
sua_hoan_tac_merge() {
  ghi_chu "Một commit merge có HAI cha — cha số 1 là phía main, cha số 2 là phía nhánh"
  do_ an git log --merges -1 --format="merge %h  parents: %p"
  do_ an git show --no-patch --format="parent 1 = %h %s" HEAD^1
  do_ an git show --no-patch --format="parent 2 = %h %s" HEAD^2
  ghi_chu "SỬA bước 1 — main đã push, không viết lại lịch sử: revert MERGE commit, chỉ rõ cha số 1 (main)"
  do_ an git revert -m 1 --no-edit HEAD
  do_ an git push origin main
  do_ an git log --oneline --graph --decorate -5
  ghi_chu "Bình muốn đưa lại nhánh của mình — nhưng Git coi các commit của nó ĐÃ nằm trong main:"
  do_ binh git pull -q
  do_ binh git switch main
  do_ binh git merge feature/trang-chu-moi
  ghi_chu "Bình sửa lỗi trên nhánh cũ rồi merge lại NGAY — sai: hai bên sửa chồng nhau"
  do_ binh git switch feature/trang-chu-moi
  awk '/<servlet-name>TrangChuServlet<\/servlet-name>/ {t=1} t && /<url-pattern>\/home</ {sub("/home","/trang-chu"); t=0} {print}' "$LAB/binh/web/WEB-INF/web.xml" > "$LAB/binh/web/WEB-INF/web.xml.new" && mv "$LAB/binh/web/WEB-INF/web.xml.new" "$LAB/binh/web/WEB-INF/web.xml"
  do_ binh git commit -qam "TrangChuServlet: doi url-pattern sang /trang-chu"
  do_ binh git switch main
  thu_ binh git merge feature/trang-chu-moi
  do_ binh git merge --abort
  ghi_chu "SỬA bước 2 — hoàn tác CÁI REVERT (cục bộ, CHƯA push), rồi merge nhánh đã sửa"
  local rev; rev=$(git -C "$LAB/binh" log --format=%h --grep='^Revert "Merge' -1)
  do_ binh git revert --no-edit "$rev"
  do_ binh git merge --no-ff feature/trang-chu-moi -m "Merge lai trang-chu-moi (da sua url-pattern)"
  do_ binh git grep -n url-pattern -- web/WEB-INF/web.xml
  do_ binh git push origin main
  do_ binh git log --oneline --graph -8
}
sua_tu_merge() {
  ghi_chu "SỬA phần QUY TRÌNH — bật luật 'main chỉ nhận qua pull request' (ở đây là MÔ PHỎNG bằng hook của kho bare; trên GitHub là Ruleset/Branch protection)"
  bat_bao_ve_main
  them an web/index.jsp <<'J'
<!-- An: footer -->
J
  do_ an git commit -qam "index.jsp: them footer"
  thu_ an git push origin main
  ghi_chu "An làm đúng cách: nhánh riêng, đẩy nhánh, mở PR"
  do_ an git branch -f feature/footer HEAD
  do_ an git reset -q --hard origin/main
  do_ an git switch feature/footer
  do_ an git push -u origin feature/footer
}

# ───────────────────────── biến thể cho 18.3–18.7 ─────────────────────────
sua_push_tu_choi_rebase() {
  ghi_chu "SỬA kiểu thẳng hàng (Bình): rebase commit của mình lên trên main mới, rồi push"
  do_ binh git pull --rebase
  do_ binh git push origin main
  do_ binh git log --oneline --graph
}
taiHien_push_force() {
  taiHien_push_tu_choi
  ghi_chu "THAM LAM — ĐỪNG LÀM: Bình ép push để 'cho qua lỗi'"
  do_ binh git push --force origin main
  ghi_chu "An chạy fetch: commit 'them menu' của An đã biến khỏi main trên remote"
  do_ an git fetch
  do_ an git status -sb
  do_ an git log --oneline --all
}
taiHien_sua_nham_main_da_push() {
  ghi_chu "Chi làm 2 commit trên main và PUSH luôn (main không có luật bảo vệ)"
  them chi src/java/com/nhom/servlet/LoginServlet.java <<'J'
// Chi: dang nhap bang email
J
  do_ chi git commit -qam "Login bang email"
  them chi web/index.jsp <<'J'
<!-- Chi: nut dang nhap -->
J
  do_ chi git commit -qam "index: nut dang nhap"
  do_ chi git push origin main
  ghi_chu "An pull và nhận luôn việc dở dang của Chi"
  do_ an git pull -q
  do_ an git log --oneline -3
}
sua_sua_nham_main_da_push() {
  ghi_chu "SỬA (Chi, ĐÃ push): giữ việc trên nhánh, rồi REVERT hai commit trên main — không viết lại lịch sử"
  do_ chi git branch feature/dang-nhap-email
  do_ chi git revert --no-edit HEAD~2..HEAD
  do_ chi git push origin main
  do_ chi git log --oneline --graph --all --decorate
  ghi_chu "main trở về nội dung cũ; việc của Chi còn nguyên trên nhánh để mở PR đàng hoàng"
  do_ chi git diff --stat origin/main~4 origin/main
  do_ an git pull -q
  do_ an git log --oneline -5
}
sua_sua_nham_main_reflog() {
  ghi_chu "Lỡ tay reset quá đà? reflog còn giữ vị trí cũ của main"
  do_ chi git reflog -5
  do_ chi git branch cuu-ho 'HEAD@{2}'
  do_ chi git log --oneline -3 cuu-ho
}
taiHien_hoan_tac_merge_chua_push() {
  ghi_chu "Bình merge nhánh có lỗi vào main nhưng CHƯA push"
  do_ binh git switch -c feature/trang-chu-moi
  them_servlet_xml binh TrangChu /home
  do_ binh git commit -qam "Them TrangChuServlet (map /home)"
  do_ binh git switch main
  do_ binh git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi"
  do_ binh git status -sb
}
sua_hoan_tac_merge_chua_push() {
  ghi_chu "SỬA: chưa push thì đưa main về chỗ trước merge (ORIG_HEAD ghi nhớ chỗ đó)"
  do_ binh git reset --hard ORIG_HEAD
  do_ binh git status -sb
  do_ binh git log --oneline --graph --all
}
taiHien_tong_hop() {
  ghi_chu "Đêm trước hạn nộp. An merge PR đặt lịch (có sửa web.xml) vào main và push"
  do_ an git switch -c feature/dat-lich
  them_servlet_xml an DatLich /dat-lich
  do_ an git commit -qam "DatLichServlet + web.xml"
  do_ an git switch main
  do_ an git merge --no-ff feature/dat-lich -m "Merge pull request #1 from an/dat-lich"
  do_ an git push origin main
  ghi_chu "Chi quên rẽ nhánh: làm TraCuu ngay trên main, Build, rồi 'git add .'"
  them_servlet_xml chi TraCuu /tra-cuu
  viet chi src/java/com/nhom/servlet/TraCuuServlet.java <<'J'
package com.nhom.servlet;
public class TraCuuServlet extends jakarta.servlet.http.HttpServlet { }
J
  netbeans_build chi ChiLe
  do_ chi git add .
  do_ chi git commit -qm "Them TraCuuServlet"
  ghi_chu "Chi push — bị từ chối; pull — xung đột:"
  thu_ chi git push origin main
  thu_ chi git pull --no-rebase
  ghi_chu "CHẨN ĐOÁN trước khi sửa bất cứ thứ gì"
  do_ chi git status -sb
  do_ chi git diff --name-only --diff-filter=U
  do_ chi git log --oneline --graph --all
  do_ chi git ls-files build dist nbproject/private
}
sua_tong_hop() {
  ghi_chu "SỬA từng lớp, từ ngoài vào trong. Bước 1: lùi khỏi merge dở — chưa mất gì"
  do_ chi git merge --abort
  do_ chi git status -sb
  ghi_chu "Bước 2: cứu việc trên một nhánh, đưa main về giống remote"
  do_ chi git branch feature/tra-cuu
  do_ chi git reset --hard origin/main
  do_ chi git switch feature/tra-cuu
  ghi_chu "Bước 3: gỡ build/ khỏi nhánh của Chi"
  them chi .gitignore <<'G'
build/
dist/
nbproject/private/
G
  do_ chi git rm -r --cached -q build dist nbproject/private
  do_ chi git add .gitignore
  do_ chi git commit -m "Ngung theo doi build/, dist/, nbproject/private/"
  ghi_chu "Bước 4: đưa main vào nhánh, giải web.xml bằng cách dựng lại + kiểm hợp lệ"
  thu_ chi git merge origin/main
  git -C "$LAB/chi" show origin/main:web/WEB-INF/web.xml > "$LAB/chi/web/WEB-INF/web.xml"
  them_servlet_xml chi TraCuu /tra-cuu
  do_ chi xmllint --noout web/WEB-INF/web.xml
  do_ chi git add web/WEB-INF/web.xml
  do_ chi git commit -m "Merge main vao feature/tra-cuu"
  ghi_chu "Bước 5: push NHÁNH (không phải main), kiểm lại rồi mở PR"
  do_ chi git push -u origin feature/tra-cuu
  do_ chi git ls-files build dist nbproject/private
  do_ chi git log --oneline --graph --all
}

# ───────────────────────── điều phối ─────────────────────────
chay_mot() { # chay_mot <ten> <co_sua>
  local ten="$1" sua="$2"
  lap_nhom
  echo "════ TAI NAN: $ten ════"
  case "$ten" in
    build) taiHien_build; [ "$sua" = 1 ] && sua_build ;;
    xung-dot-web-xml) taiHien_xung_dot_web_xml; [ "$sua" = 1 ] && sua_xung_dot_web_xml ;;
    keo-main-nham) taiHien_keo_main_nham; [ "$sua" = 1 ] && sua_keo_main_nham ;;
    push-tu-choi) taiHien_push_tu_choi; [ "$sua" = 1 ] && sua_push_tu_choi ;;
    sua-nham-main) taiHien_sua_nham_main; [ "$sua" = 1 ] && sua_sua_nham_main ;;
    tu-merge) taiHien_tu_merge; [ "$sua" = 1 ] && sua_tu_merge ;;
    hoan-tac-merge) taiHien_hoan_tac_merge; [ "$sua" = 1 ] && sua_hoan_tac_merge ;;
    push-tu-choi-rebase) taiHien_push_tu_choi; [ "$sua" = 1 ] && sua_push_tu_choi_rebase ;;
    push-force) taiHien_push_force ;;
    sua-nham-main-da-push) taiHien_sua_nham_main_da_push; [ "$sua" = 1 ] && sua_sua_nham_main_da_push ;;
    hoan-tac-merge-chua-push) taiHien_hoan_tac_merge_chua_push; [ "$sua" = 1 ] && sua_hoan_tac_merge_chua_push ;;
    tong-hop) taiHien_tong_hop; [ "$sua" = 1 ] && sua_tong_hop ;;
    *) echo "Tai nan khong co: $ten" >&2; return 2 ;;
  esac
  return 0
}

main() {
  local ten="${1:-}" sua=0
  [ "${2:-}" = "--sua" ] && sua=1
  if [ -z "$ten" ]; then
    sed -n '2,12p' "$0"; echo; echo "Tai nan: build xung-dot-web-xml keo-main-nham push-tu-choi push-tu-choi-rebase push-force sua-nham-main sua-nham-main-da-push tu-merge hoan-tac-merge hoan-tac-merge-chua-push tong-hop"; return 0
  fi
  LAB="${LAB18_DIR:-$(mktemp -d "${TMPDIR:-/tmp}/lab18.XXXXXX")}"
  mkdir -p "$LAB"; LAB="$(cd "$LAB" && pwd)"
  # từ chối chạy bên trong một kho git thật (tránh ghi nhầm)
  if git -C "$LAB" rev-parse --git-dir >/dev/null 2>&1; then echo "LAB nam trong mot kho git: $LAB" >&2; exit 2; fi
  cach_ly
  if [ "$ten" = "tat-ca" ]; then
    for t in build xung-dot-web-xml keo-main-nham push-tu-choi push-tu-choi-rebase push-force sua-nham-main sua-nham-main-da-push tu-merge hoan-tac-merge hoan-tac-merge-chua-push tong-hop; do chay_mot "$t" "$sua"; echo; done
  else
    chay_mot "$ten" "$sua"
  fi
  echo; echo "# Lab nam o: $LAB  (clone: an/ binh/ chi/, remote: github.git/) — xoa bang: rm -rf '$LAB'"
}
main "$@"
