# dung.bash — dựng Lab 9 trong thư mục làm việc hiện tại (chép lab/ vào, build, sinh chứng chỉ tự ký, chạy server nền)
cp -r "$(dirname "$0")"/{server.mjs,src,public} . && mkdir -p logs tls
npx --no-install esbuild src/app.js --bundle --minify --format=iife --sourcemap --sources-content=true --outfile=public/app.min.js --log-level=warning
[ -f tls/key.pem ] || openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=bank.lgz.test" -keyout tls/key.pem -out tls/cert.pem 2>/dev/null
