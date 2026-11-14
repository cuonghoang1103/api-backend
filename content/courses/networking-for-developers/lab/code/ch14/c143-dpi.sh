# 14.3 · nft-win sau luật DPI: SSH ở 993, SSH ở 443 (sslh), web ở 443 — rồi SSH bọc trong TLS
ssh vps true
ssh -p 443 vps true
curl -sS -m 5 --cacert /ca/ca.pem https://vps.example/
cat >> ~/.ssh/config <<'CFG'
Host vps-tls
  HostName ssh.vps.example
  User sv
  HostKeyAlias vps.example
  ProxyCommand openssl s_client -quiet -verify_return_error -CAfile /ca/ca.pem -connect vps.example:443 -servername %h
CFG
ssh vps-tls 'echo "SSH boc trong TLS: vao duoc $(hostname)"'
