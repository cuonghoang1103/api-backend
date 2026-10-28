# @ Chương 14 · bài 14.8 — trong container lab: docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch14":/lab/ch14 -w /lab/ch14 os-lab bash -c "phien c148-lx.sh 2>&1" > ../out/c148-lx.out.txt
# @ Làm việc trong /tmp (overlay của máy ảo Linux) — KHÔNG trong /lab/ch14, vì thư mục gắn từ Mac vẫn không phân biệt hoa thường.
@ mkdir -p /tmp/w && cp -r cross.cjs cross.py Cross.java Res.java data /tmp/w/ && cd /tmp/w
node cross.cjs
python3 cross.py
java Cross.java
java Res.java 2>&1 | head -2
printf '#!/bin/bash\r\necho "hello from $(uname -s)"\r\n' > crlf.sh; chmod +x crlf.sh; file crlf.sh
./crlf.sh
bash crlf.sh | cat -A
printf 'NAME=prod\r\necho "deploying to [$NAME]"\r\ncd /tmp\r\n' > deploy.sh; bash deploy.sh 2>&1 | cat -A
sed -i 's/\r$//' crlf.sh deploy.sh; file crlf.sh; ./crlf.sh; bash deploy.sh
exec 3> /tmp/app.log; echo busy >&3; rm /tmp/app.log && echo "rm while open: OK"; readlink /proc/$$/fd/3; exec 3>&-
