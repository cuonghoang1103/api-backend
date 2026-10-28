# @ Chương 14 · bài 14.4 — gõ TỪ MÁY MAC (chỉ đọc + một chương trình Python của chính mình, không sudo), từ lab/code/ch14:
# @   CH14_WORK=<thư mục tạm> bash phien-host.sh c144-mac.sh 2>&1 | CH14_WORK=… bash an-danh.sh > ../../out/c144-mac.out.txt
sysctl hw.memsize hw.pagesize
vm_stat
vm_stat | awk -F: '/stored in compressor/{s=$2} /occupied by compressor/{o=$2} END{printf "compressor holds %.1f GiB of data in %.1f GiB of RAM (ratio %.2f)\n", s*16384/2^30, o*16384/2^30, s/o}'
top -l 1 -n 0 -s 0 | grep -E '^PhysMem'
memory_pressure | tail -1
sysctl vm.swapusage
ls /System/Volumes/VM | head -3; ls /System/Volumes/VM | wc -l
python3 an.py 512 4 & P=$!; sleep 2; ps -o pid,rss,vsz,comm -p $P | cut -c1-60
footprint -p $P 2>/dev/null | sed -n '2p;7,8p'
wait $P
