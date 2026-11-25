# Lab 9 — lời giải chạy thật trên lab9/ (lab9.har + api.log + app.log).
jq -r '.log.entries[] | [.response.status, (.response._failureText // ""), (.time | round), .request.method, (.request.url | sub("\\?.*"; "?…"))] | @tsv' lab9/lab9.har
jq -r '.log.entries[] | select(.request.url | endswith("/api/me")) | .request.headers[] | select(.name == "Authorization") | .value' lab9/lab9.har | cut -d. -f2 | base64 -d 2>/dev/null; echo
jq -r '.log.entries[] | select(.request.url | endswith("/api/login")) | .response.content.text | fromjson | .token' lab9/lab9.har | cut -d. -f2 | base64 -d 2>/dev/null; echo
jq -r '.log.entries[] | select(.request.url | endswith("/api/me")) | .response.headers[] | select(.name | test("www-authenticate|x-request-id"; "i")) | "\(.name): \(.value)"' lab9/lab9.har
jq -r '.log.entries[] | select(.request.url | endswith("/api/orders")) | {status: .response.status, loi: .response._failureText, headers: (.response.headers | length)}' lab9/lab9.har
grep '/api/orders' lab9/api.log
jq -c 'select(.path == "/api/orders") | {level, reqId, msg}' lab9/app.log
jq -r '.log.entries[] | select(.request.url | endswith("/api/report")) | "time=\(.time | round) ms  wait=\(.timings.wait | round) ms  status=\(.response.status)  rid=\(.response.headers[] | select(.name == "X-Request-Id") | .value)"' lab9/lab9.har
grep '/api/report' lab9/api.log; jq -r 'select(.path == "/api/report") | .msg' lab9/app.log
grep -c 'token=' lab9/api.log; grep -o '"GET /api/search[^ ]*' lab9/api.log | cut -c1-72
bash tim-bi-mat.bash lab9/lab9.har
jq -f che-har.jq lab9/lab9.har > lab9/lab9.sach.har; bash tim-bi-mat.bash lab9/lab9.sach.har; echo "mẫu bí mật còn lại: $(bash tim-bi-mat.bash lab9/lab9.sach.har | wc -l)"
jq -r '.log.entries[] | select(.request.url | endswith("/api/login")) | .startedDateTime' lab9/lab9.har
