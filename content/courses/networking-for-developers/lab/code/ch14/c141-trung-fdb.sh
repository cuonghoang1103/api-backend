# 14.1 · nhìn VÀO switch ảo nft-sv (bridge của Docker, trong mạng của máy ảo Docker — CHỈ ĐỌC): mỗi lần switch đổi ý "MAC 8c:8d:28:4e:7a:12 ở cổng nào" in một dòng
timeout 5 bridge monitor fdb | grep 8c:8d:28:4e:7a:12 > /tmp/fdb.txt; wc -l < /tmp/fdb.txt
head -6 /tmp/fdb.txt
cut -d' ' -f3 /tmp/fdb.txt | sort | uniq -c
