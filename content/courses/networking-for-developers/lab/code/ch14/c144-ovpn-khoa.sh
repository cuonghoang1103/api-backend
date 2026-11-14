# 14.4 · nft-win: kế hoạch B — OpenVPN chạy TCP. Khoá + chứng chỉ tự ký của laptop; máy chủ chỉ cần dấu vân tay của nó
mkdir -p /etc/openvpn/lab; cd /etc/openvpn/lab
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -days 30 -subj /CN=laptop -keyout client.key -out client.crt 2>/dev/null
openssl x509 -in client.crt -noout -fingerprint -sha256 | cut -d= -f2 | tee client.fp
