# Ch7 · 7.5 — qua HAI proxy: mỗi proxy THÊM địa chỉ nó thấy vào X-Forwarded-For ⇒ một danh sách "client, proxy1"
# client 10.10.1.10 → proxy1 (web:8090) → proxy2 (api:8091) → node api
curl -s http://10.10.2.10:8090/api/who | python3 -m json.tool
