# 9.3 — Tệp HAR: ghi, đọc bằng jq, tìm bí mật, làm sạch. har.mjs = Playwright recordHar (HAR 1.2, cùng chuẩn DevTools "Export HAR").
node har.mjs login,me,orders,report shop.har
jq '.log | {version, creator, browser, pages: (.pages | length), entries: (.entries | length)}' shop.har
jq '.log.entries[] | select(.request.url | endswith("/api/me")) | {startedDateTime, time, serverIPAddress, request: {method: .request.method, url: .request.url, headersSize: .request.headersSize}, response: {status: .response.status, statusText: .response.statusText, bodySize: .response.bodySize}, timings}' shop.har
jq -r '.log.entries[] | [.response.status, .request.method, (.time | round), (.request.url | sub("\\?.*"; "?…"))] | @tsv' shop.har
jq -r '.log.entries[] | select(.response.status >= 400 or .response.status <= 0) | [.response.status, (.response._failureText // .response.statusText), .request.url] | @tsv' shop.har
jq -r '[.log.entries[] | {t: (.time | round), u: .request.url}] | sort_by(-.t) | .[0:3][] | "\(.t) ms  \(.u)"' shop.har
jq -r '.log.entries[] | select(.response.status >= 400) | "\(.response.status)  \([.response.headers[] | select(.name | test("x-request-id|www-authenticate"; "i")) | "\(.name)=\(.value)"] | join("  "))  body=\(.response.content.text)"' shop.har
bash tim-bi-mat.bash shop.har
jq '.log.entries |= map(.request.headers |= map(select(.name | test("^(cookie|authorization)$"; "i") | not)) | .response.headers |= map(select(.name | test("^set-cookie$"; "i") | not)) | .request.cookies = [] | .response.cookies = [])' shop.har > shop.sanitized.har; bash tim-bi-mat.bash shop.sanitized.har
jq -f che-har.jq shop.har > shop.sach.har; bash tim-bi-mat.bash shop.sach.har; echo "còn lại: $(bash tim-bi-mat.bash shop.sach.har | wc -l) mẫu"
jq -r '.log.entries[] | select(.request.url | test("/api/(login|search)")) | .request.url, (.request.postData.text // "-"), (.response.content.text // "-")' shop.sach.har
grep -o 'sv\.lab9@example\.com' shop.sach.har | wc -l
