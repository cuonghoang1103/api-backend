# Ch3 · 3.2 — từ laptop: hỏi thẳng TỪNG máy chủ tên (bỏ qua cache của resolver)
dig +short @203.0.113.53 api.labflow.test
dig +short @203.0.113.54 api.labflow.test
dig +short @203.0.113.53 labflow.test SOA
dig +short @203.0.113.54 labflow.test SOA
