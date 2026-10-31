# Mục 0 · bài 0.1 — nhìn từ MÁY CỦA BẠN (ngoài container), trong thư mục lab/
docker compose -f moi-truong/compose.yml -p nfd ps --format 'table {{.Name}}\t{{.Image}}\t{{.Status}}'
docker network ls --filter label=netlab=1 --format 'table {{.Name}}\t{{.Driver}}'
docker network inspect nfd-lan --format '{{range .IPAM.Config}}{{.Subnet}} gateway {{.Gateway}}{{end}}'
docker run --rm net-lab tcpdump -i eth0 -c 1 -n
docker run --rm net-lab ip route add 10.9.9.0/24 dev eth0
docker run --rm --cap-add NET_ADMIN net-lab ip route add 10.9.9.0/24 dev eth0
docker exec nfd-client whoami
