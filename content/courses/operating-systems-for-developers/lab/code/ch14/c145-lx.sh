# @ Chương 14 · bài 14.5 — trong container lab, có thêm thư mục Mac gắn vào /mac (virtiofs):
# @   docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch14":/lab/ch14 -v <thư mục tạm trên Mac>:/mac -w /lab/ch14 os-lab bash -c "phien c145-lx.sh 2>&1" > ../out/c145-lx.out.txt
df -T / | tail -1
mount | grep ' /mac '
cd /tmp && touch Readme.md README.md && ls *.md
cd /mac && touch Readme.md README.md && ls *.md
cd /tmp && getconf PATH_MAX /; getconf NAME_MAX /
head -c 1M /dev/urandom > a; cp --reflink=always a b; echo "exit=$?"
echo hi > f; setfacl -m u:nobody:r f; getfacl -c f
