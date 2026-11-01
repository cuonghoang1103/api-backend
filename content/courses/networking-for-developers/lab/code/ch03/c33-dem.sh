# Ch3 · 3.3 — TTL đếm ngược trong cache của resolver; máy chủ tên (authoritative) thì luôn nói nguyên con số
dig +noall +answer api.labflow.test
sleep 5
dig +noall +answer api.labflow.test
dig +noall +answer api.labflow.test @203.0.113.53
