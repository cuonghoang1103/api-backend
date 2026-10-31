# Ch2 · 2.3 — docker run -p chính là DNAT (chạy trên máy của bạn; container nginx tạm, nhãn netlab=1)
docker run -d --rm --label netlab=1 --name nfd-pdemo -p 18080:80 net-lab nginx -g 'daemon off;' | cut -c1-12
docker inspect nfd-pdemo -f '{{.NetworkSettings.Networks.bridge.IPAddress}}'
docker run --rm --label netlab=1 --net host --cap-add NET_ADMIN net-lab iptables -t nat -S DOCKER | grep 18080
docker run --rm --label netlab=1 --net host --cap-add NET_ADMIN net-lab iptables -t nat -S POSTROUTING | grep '172.17.0.0/16'
curl -s -o /dev/null -w 'HTTP %{http_code} from 127.0.0.1:18080\n' http://127.0.0.1:18080/
docker exec nfd-pdemo tail -n 1 /var/log/nginx/access.log
docker rm -f nfd-pdemo
