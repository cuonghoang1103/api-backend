# Ch8 · 8.1 — biên nginx (:8080) cache tệp từ origin: lần đầu MISS (đi tới origin), sau đó HIT (phục vụ từ biên).
curl -s -D - -o /dev/null http://10.10.2.10:8080/img/logo.txt | grep -iE "X-Cache|Cache-Control"
curl -s -D - -o /dev/null http://10.10.2.10:8080/img/logo.txt | grep -i X-Cache
curl -s -D - -o /dev/null http://10.10.2.10:8080/img/logo.txt | grep -i X-Cache
