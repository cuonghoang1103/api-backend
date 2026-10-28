# @ Chương 12 · bài 12.3 — gõ TỪ MÁY CHỦ: lớp ảnh, docker diff, build cache. bash phien-host.sh c123-host.sh > ../../out/c123-host.out.txt 2>&1
# @ Ảnh tự dựng tên os-c123-*, nhãn oslab=1; bản ghi build cache MỚI được xoá đúng theo id ở cuối (không prune chung).
docker image inspect os-lab -f '{{len .RootFS.Layers}} layers'
docker history --format '{{printf "%8s" .Size}}  {{.CreatedBy}}' os-lab | cut -c1-104 | head -14
docker image inspect alpine:latest -f '{{len .RootFS.Layers}} layer  {{index .RootFS.Layers 0}}'
docker run --name os-c123-diff --label oslab=1 os-lab sh -c 'echo hi > /tmp/note; rm /etc/legal; echo "nameserver 1.1.1.1" >> /etc/hosts.allow'
docker diff os-c123-diff
@ docker rm os-c123-diff > /dev/null
docker build -q --label oslab=1 -t os-c123-cache cache-demo > /dev/null; echo "first build done"
docker build --label oslab=1 -t os-c123-cache --progress=plain cache-demo 2>&1 | grep -E '^#[0-9]+ \[[1-9]/|CACHED|DONE [0-9.]+s$' | grep -E '\[[1-9]/|CACHED' | sed -E 's/^#[0-9]+ //'
echo "console.log('v2')" > cache-demo/server.js
docker build --label oslab=1 -t os-c123-cache --progress=plain cache-demo 2>&1 | grep -E '^#[0-9]+ (\[[1-9]/|CACHED|DONE)' | sed -E 's/^#[0-9]+ //' | grep -vE '^DONE 0\.0s$'
echo '{"name":"demo","version":"1.0.1"}' > cache-demo/package.json
docker build --label oslab=1 -t os-c123-cache --progress=plain cache-demo 2>&1 | grep -E '^#[0-9]+ (\[[1-9]/|CACHED|DONE)' | sed -E 's/^#[0-9]+ //' | grep -vE '^DONE 0\.0s$'
docker run --rm --label oslab=1 os-c123-cache
docker system df | grep -E 'TYPE|Build Cache|Images'
@ echo "console.log('v1')" > cache-demo/server.js; echo '{"name":"demo","version":"1.0.0"}' > cache-demo/package.json
