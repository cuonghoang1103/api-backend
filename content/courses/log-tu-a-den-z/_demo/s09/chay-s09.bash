# chay-s09.bash <thư mục làm việc> — chạy lại TOÀN BỘ output Chương 9 (Chrome 150 headless qua Playwright + CDP, Firefox 152, Node 22).
# Cần: google-chrome, firefox, node, jq, curl, openssl; playwright-core + esbuild cài trong thư mục làm việc (npm i playwright-core esbuild).
set -e; W=${1:?thư mục làm việc}; S=$(cd "$(dirname "$0")" && pwd); cd "$W"
bash "$S/lab/dung.bash"; cp "$S"/cong-cu/* .
node server.mjs > server.out 2>&1 & SV=$!; sleep 1
for b in console network har netlog firefox rum lab9-tao lab9; do python3 "${CHAY_PY:-chay.py}" "$S/$b.bash" "$W"; done   # chay.py: mỗi dòng một lệnh, ghi <tệp>.out.txt
kill $SV
mkdir -p "$S/lab9"; cp lab9/lab9.har lab9/api.log lab9/app.log "$S/lab9/"
