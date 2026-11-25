# 10.3 — Apache httpd 2.4 thật trong container: định dạng "common" mặc định, error log ra stderr
docker run -d --name lgz-httpd -p 127.0.0.1:41082:80 httpd:2.4-alpine > /dev/null && sleep 2
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41082/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:41082/khong-co.html
curl -s -o /dev/null -w '%{http_code}\n' -H 'User-Agent: lab-client/1.0' 'http://127.0.0.1:41082/cgi-bin/test?id=1'
docker logs lgz-httpd 2> /dev/null
docker logs lgz-httpd 2>&1 > /dev/null
docker exec lgz-httpd grep -nE '^\s*(LogFormat|CustomLog|ErrorLog|LogLevel)' /usr/local/apache2/conf/httpd.conf
docker rm -f lgz-httpd > /dev/null
