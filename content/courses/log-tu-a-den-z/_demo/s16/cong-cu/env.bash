# BASH_ENV cho tệp lệnh Ch16: "node" chạy trong node:22-alpine không mạng (node_modules pino/winston của lab Ch10, chỉ đọc).
NM=${NM:-$HOME/vbg-dp/scratchpad/lgz/chay/node_modules}
node() { docker run --rm -i --network none -e LOG_LEVEL -u "$(id -u):$(id -g)" -e TZ=Asia/Ho_Chi_Minh -v "$PWD":/w -w /w -v "$NM":/w/node_modules:ro node:22-alpine node "$@"; }
java() { docker run --rm -i --network none -u "$(id -u):$(id -g)" -e TZ=Asia/Ho_Chi_Minh -v "$PWD":/w -w /w -v "${C16LIB:-$HOME/.rtq-lgz/c16lib}":/w/lib:ro eclipse-temurin:21-jdk java "$@"; }
# may [-u người] 'lệnh' — chạy lệnh trên "máy chủ" may16 (container lgz-c16-may); mặc định root, -u dev = lập trình viên không thuộc adm.
may() { local u=root; [ "$1" = -u ] && { u=$2; shift 2; }; docker exec -i -u "$u" -w / lgz-c16-may bash -c "{ $*
} 2>&1"; }
# mc … — MinIO Client trong cùng netns với lgz-c16-minio (không mạng ra ngoài); cấu hình mc giữ ở ~/.rtq-lgz/c16mc
mc() { docker run --rm -i --network container:lgz-c16-minio -u "$(id -u):$(id -g)" -e HOME=/h -v "${C16MC:-$HOME/.rtq-lgz/c16mc}":/h -v "$PWD":/w -w /w cgr.dev/chainguard/minio-client:latest "$@"; }
