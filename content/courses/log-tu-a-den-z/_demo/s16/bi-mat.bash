# 16.3 — bí mật lọt vào log của API Node (pino 9 + pino-http 10, winston 3) và cách che (cwd = _demo/s16/bi-mat; BASH_ENV=cong-cu/env.bash)
node --version
node app-ro.mjs | jq -c 'select(.msg=="đăng nhập") | {url: .req.url, authorization: .req.headers.authorization, cookie: .req.headers.cookie, body}'
node app-ro.mjs | grep -o 'MatKhau-GIA-123\|sk_test_GIA_TOKEN·VIDU_51a9\|GIA-phien-7f3c\|Bearer [^"]*' | sort | uniq -c
node app-che.mjs | jq -c 'select(.msg=="đăng nhập") | {url: .req.url, authorization: .req.headers.authorization, cookie: .req.headers.cookie, body, userId}'
node app-che.mjs | grep -c 'MatKhau-GIA-123\|sk_test_GIA_TOKEN·VIDU_51a9\|GIA-phien-7f3c\|Bearer '
node winston-che.mjs
