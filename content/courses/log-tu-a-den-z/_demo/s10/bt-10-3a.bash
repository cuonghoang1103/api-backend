# Lời giải 🧪 10.3 câu 1 — httpd thật: đổi CustomLog common ⇒ combined, graceful, gửi lại ba curl
docker run -d --name lgz-httpd -p 127.0.0.1:41082:80 httpd:2.4-alpine > /dev/null && sleep 2
docker exec lgz-httpd sed -i 's/CustomLog \/proc\/self\/fd\/1 common/CustomLog \/proc\/self\/fd\/1 combined/' /usr/local/apache2/conf/httpd.conf
docker exec lgz-httpd grep -n '^\s*CustomLog' /usr/local/apache2/conf/httpd.conf
docker exec lgz-httpd httpd -k graceful && sleep 2
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41082/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41082/khong-co.html
curl -s -o /dev/null -w '%{http_code}\n' -H 'User-Agent: lab-client/1.0' 'http://127.0.0.1:41082/cgi-bin/test?id=1'
docker logs lgz-httpd 2> /dev/null
docker rm -f lgz-httpd > /dev/null
