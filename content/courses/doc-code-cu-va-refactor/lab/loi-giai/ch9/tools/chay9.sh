#!/bin/bash
# chay9.sh <pha1|pha2> — Ch9 (sprint 8 ticket): giữ khoá nặng MỘT lần, chạy đỏ-trước/xanh-sau từng ticket, golden master, e2e.
# Log: ~/.rtq-rfc/c9/<nhãn>.log ; tóm tắt: ~/.rtq-rfc/c9/tomtat-<pha>.txt ; worktree tạm: ~/.rtq-rfc/c9/wt/<nhãn>
pha=$1; C=~/.rtq-rfc/c9; W=~/vbg-dp/scratchpad/rfc/work; R=$W/legacy-thu-vien; T=$C/tomtat-$pha.txt
mkdir -p $C/wt; : > $T
source ~/vbg-dp/scratchpad/khoa-nang.sh; gianh_khoa; trap 'nha_khoa' EXIT
echo "giành khoá $(date +%T)" >> $T
docker compose -p rfc-thuvien -f $R/docker-compose.yml -f $W/compose.rfc.yml up -d --wait db >/dev/null 2>&1 || echo "LOI db" >> $T

# wt <nhãn> <ref> [ref-lấy-test tệp…] — worktree tách rời tại ref, chép đè tệp test từ ref khác (để chạy "đỏ trước")
wt() { local n=$1 ref=$2; shift 2; local d=$C/wt/$n
  git -C $R worktree remove --force $d >/dev/null 2>&1; rm -rf $d
  git -C $R worktree add --detach -q $d $ref
  if [ $# -gt 0 ]; then local nguon=$1; shift; (cd $d && git checkout -q $nguon -- "$@"); fi
  echo $d; }
# mv <nhãn> <jdk> <thư mục> <đối số mvn…>
mv_() { local n=$1 j=$2 d=$3; shift 3; local log=$C/$n.log t0=$(date +%s)
  MVN_NET=rfc-thuvien_default ~/vbg-dp/scratchpad/rfc/mvnj.sh $j $d "$@" > $log 2>&1; local rc=$?
  local tong=$(grep -E "Tests run: [0-9]+, Failures: [0-9]+, Errors: [0-9]+, Skipped: [0-9]+$" $log | tail -1 | sed 's/^\[[A-Z]*\] //')
  echo "$n (JDK $j, $(( $(date +%s)-t0 )) s): ${tong:-(khong toi test)} $(grep -oE 'BUILD (SUCCESS|FAILURE)' $log | tail -1)" >> $T
  [ $rc -ne 0 ] && grep -E "^\[ERROR\] (  |Tests run|Failed|.*Rule|.*COMPILATION)|expected:|Detected JDK" $log | head -8 | sed 's/^/    /' >> $T; return 0; }
e2e() { local n=$1 d=$2 g=$(stat -c %g /var/run/docker.sock) t0=$(date +%s)
  MVN_NET=host MVN_EXTRA="-v /var/run/docker.sock:/var/run/docker.sock --group-add $g" ~/vbg-dp/scratchpad/rfc/mvnj.sh 17 $d -B -f e2e/pom.xml test > $C/$n.log 2>&1
  echo "$n (e2e, $(( $(date +%s)-t0 )) s): $(grep -E 'Tests run: [0-9]+, Failures' $C/$n.log | tail -1 | sed 's/^\[[A-Z]*\] //') $(grep -oE 'BUILD (SUCCESS|FAILURE)' $C/$n.log | tail -1)" >> $T
  grep -E "^\[ERROR\]   |expected:" $C/$n.log | head -6 | sed 's/^/    /' >> $T
  docker rmi -f thuvien-e2e >/dev/null 2>&1; }
# golden <nhãn> <thư mục> — dựng web từ thư mục đó, chụp 3 trang, so với golden/ đã commit của chính thư mục đó
golden() { local n=$1 d=$2 t0=$(date +%s)
  docker compose -p rfc-thuvien -f $d/docker-compose.yml -f $W/compose.rfc.yml up -d --build --wait web > $C/$n-dung.log 2>&1 || echo "$n: LOI dung web" >> $T
  local i; for i in $(seq 60); do curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:41880/thuvien/login | grep -q 200 && break; sleep 2; done
  (cd $d && B=http://127.0.0.1:41880/thuvien NAP="docker exec -i rfc-thuvien-db mysql --default-character-set=utf8mb4 -uroot -p123456 thuvien" \
     bash tools/golden.sh $C/$n-ra > /dev/null 2>&1)
  echo "$n (golden, $(( $(date +%s)-t0 )) s): $(cd $d && diff -r golden $C/$n-ra > $C/$n.diff && echo 'GIONG HET' || echo "KHAC $(grep -c '^[<>]' $C/$n.diff) dong")" >> $T
  docker compose -p rfc-thuvien -f $d/docker-compose.yml -f $W/compose.rfc.yml rm -sf web >/dev/null 2>&1; }

if [ "$pha" = pha1 ]; then
  M=src/test/java/com/thuvien
  d=$(wt r41 tv-41^ tv-41 $M/servlet/BookServletMuonSachTest.java);          mv_ r41 17 $d -B -o test -Dtest=BookServletMuonSachTest
  d=$(wt g41 tv-41);                                                          mv_ g41 17 $d -B -o test
  d=$(wt r110 tv-110^ tv-110 $M/servlet/LoginServletCookieTest.java $M/util/TokenUtilDacTaTest.java $M/util/TokenUtilTest.java)
                                                                              mv_ r110 17 $d -B -o test -Dtest='LoginServletCookieTest,TokenUtilDacTaTest,TokenUtilTest'
  d=$(wt g110 tv-110);                                                        mv_ g110 17 $d -B -o test
  d=$(wt g111 tv-111);                                                        mv_ g111 17 $d -B -o test
  d=$(wt r113 tv-113^ tv-113 $M/servlet/BookServletTraSachTest.java);         mv_ r113 17 $d -B -o test -Dtest=BookServletTraSachTest
  d=$(wt g113 tv-113);                                                        mv_ g113 17 $d -B -o test
  d=$(wt g117 tv-117);                                                        mv_ g117 17 $d -B -o test
  d=$(wt r95 tv-95~2 tv-95 $M/servlet/BookServletMuonSachTest.java);          mv_ r95 17 $d -B -o test -Dtest=BookServletMuonSachTest
  d=$(wt g95 tv-95);                                                          mv_ g95 17 $d -B -o test
  d=$(wt g122a tv-122~1);                                                     mv_ g122a 17 $d -B -o test -Dtest=ReaderServletDacTaTest
  d=$(wt g122 tv-122);                                                        mv_ g122 17 $d -B -o test
  d=$(wt g121j17 tv-121);                                                     mv_ g121j17 17 $d -B -o test
  d=$(wt g121 tv-121);                                                        mv_ g121 21 $d -B -o test
  docker run --rm --user $(id -u):$(id -g) -e HOME=/tmp -e TZ=Asia/Ho_Chi_Minh -v $W/legacy-express:/app -w /app node:24-alpine npx jest --runInBand > $C/node95.log 2>&1
  echo "node95 (Node 24, legacy-express ch9): $(grep -E '^Tests:' $C/node95.log)" >> $T
  d=$(wt e2e111r tv-111^ tv-111 e2e/src/test/java/com/thuvien/e2e/MuonSachQuaHttpTest.java); e2e e2e111r $d
  d=$(wt gl117 tv-117);                                                       golden gl117 $d
  d=$(wt glch9 ch9);                                                          golden glch9 $d
elif [ "$pha" = pha1b ]; then
  M=src/test/java/com/thuvien
  d=$(wt r113b tv-113^ tv-113 $M/servlet/BookServletTraSachTest.java);        mv_ r113b 17 $d -B -o test -Dtest=BookServletTraSachTest
  d=$(wt g113b tv-113);                                                       mv_ g113b 17 $d -B -o test
  d=$(wt g117b tv-117);                                                       mv_ g117b 17 $d -B -o test
  golden gl117b $d
elif [ "$pha" = pha2 ]; then
  d=$(wt cuoi ch9)
  mv_ cuoi 21 $d -B -o test
  e2e e2ecuoi $d
  golden glcuoi $d
  (cd $d && MVN_NET=rfc-thuvien_default ~/vbg-dp/scratchpad/rfc/mvnj.sh 21 . -B -q org.apache.maven.plugins:maven-checkstyle-plugin:3.6.0:checkstyle \
     -Dcheckstyle.config.location=tools/checkstyle-du-an.xml -Dcheckstyle.includeTestSourceDirectory=true -Dcheckstyle.consoleOutput=false > $C/cs.log 2>&1
   echo "checkstyle du an: $(grep -c '<error' target/checkstyle-result.xml) vi pham" >> $T)
  (cd $d && MVN_NET=rfc-thuvien_default ~/vbg-dp/scratchpad/rfc/mvnj.sh 21 . -B -q -o pmd:pmd -Dpmd.rulesets=tools/smell-pmd.xml > $C/pmd.log 2>&1
   echo "pmd smell: $(grep -c '<violation' target/pmd.xml 2>/dev/null) vi pham" >> $T)
fi
if [ "$pha" = pha2 ] || [ "$pha" = clone ]; then
  # Thử bàn giao: clone sạch vào thư mục rỗng, làm đúng README (chỉ thêm tệp ghi đè cổng về 127.0.0.1 — máy nhà dùng chung)
  K=$C/clone; rm -rf $K; t0=$(date +%s)
  { echo "\$ git clone -q -b ch9 legacy-thu-vien clone-sach && cd clone-sach"; git clone -q -b ch9 $R $K 2>&1
    cd $K; printf 'services:\n  db:\n    ports: !override\n      - "127.0.0.1:18306:3306"\n  web:\n    ports: !override\n      - "127.0.0.1:18080:8080"\n' > /tmp/rfc-cong.yml
    echo "\$ cp .env.example .env"; cp .env.example .env
    echo "\$ sed -i \"s/^THUVIEN_REMEMBER_KEY=.*/THUVIEN_REMEMBER_KEY=\$(openssl rand -hex 32)/\" .env"; sed -i "s/^THUVIEN_REMEMBER_KEY=.*/THUVIEN_REMEMBER_KEY=$(openssl rand -hex 32)/" .env
    echo "\$ docker compose up -d --build"; t1=$(date +%s)
    docker compose -p rfc-clone -f docker-compose.yml -f /tmp/rfc-cong.yml up -d --build --wait > $C/clone-up.log 2>&1; echo "[exit $?] $(( $(date +%s)-t1 )) s"
    echo "\$ docker compose ps --format '{{.Service}} {{.Status}}'"; docker compose -p rfc-clone ps --format '{{.Service}} {{.Status}}'
    for i in $(seq 60); do curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:18080/thuvien/login | grep -q 200 && break; sleep 2; done
    cj=$(mktemp)
    echo "\$ curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -c cj -d 'username=thuthu&password=123456&remember=on' http://localhost:18080/thuvien/login"
    curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -c $cj -D $C/clone-hdr.txt -d 'username=thuthu&password=123456&remember=on' http://127.0.0.1:18080/thuvien/login
    echo "\$ grep -i set-cookie (header)"; grep -i '^set-cookie' $C/clone-hdr.txt | sed -E 's/(remember=thuthu:)[0-9a-f]{56}/\1…/; s/JSESSIONID=[0-9A-F]+/JSESSIONID=…/'
    echo "\$ curl -s -b cj http://localhost:18080/thuvien/books | grep -o 'THƯ VIỆN\|Sách - Thư viện' | sort | uniq -c"
    curl -s -b $cj http://127.0.0.1:18080/thuvien/books | grep -o 'THƯ VIỆN\|Sách - Thư viện' | sort | uniq -c
    echo "\$ curl -s -o /dev/null -w '%{http_code}' http://localhost:18080/thuvien/books.jsp"; curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18080/thuvien/books.jsp
    echo "\$ curl -s http://localhost:18080/thuvien/khong-co | grep -o 'Apache Tomcat/[0-9.]*'"; curl -s http://127.0.0.1:18080/thuvien/khong-co | grep -o 'Apache Tomcat/[0-9.]*' | head -1
    echo "Tổng từ clone tới trang sách: $(( $(date +%s)-t0 )) s"
    rm -f $cj; docker compose -p rfc-clone down -v --rmi local >/dev/null 2>&1; cd /; } > $C/clone.txt 2>&1
  echo "clone: $(tail -1 $C/clone.txt)" >> $T
fi
echo "xong $(date +%T)" >> $T
