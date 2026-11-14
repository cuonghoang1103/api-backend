# 14.6 · máy nhà (nft-nha): một dịch vụ muốn khoe ra Internet (kiểu NAS / camera / đồ án)
mkdir -p /tmp/nas && echo "NAS o nha: anh gia dinh, do an" > /tmp/nas/index.html
@ setsid python3 -m http.server 80 --directory /tmp/nas > /dev/null 2>&1 < /dev/null &
@ sleep 1
curl -s http://192.168.1.10/
