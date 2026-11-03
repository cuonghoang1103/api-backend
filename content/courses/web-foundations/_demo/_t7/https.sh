#!/bin/bash
# chay: tay — Bài 7.5: HTTPS nhìn bằng curl 8.7 (macOS). Gọi mạng thật: example.com, expired.badssl.com, self-signed.badssl.com.
# bash content/courses/web-foundations/_demo/_t7/https.sh
cd "$(dirname "$0")"; mkdir -p out
{
  echo '$ curl -sv https://example.com/ -o /dev/null 2>&1 | grep -E "TLS|SSL|ALPN|subject|issuer|expire|start date"   (lines filtered)'
  curl -sv https://example.com/ -o /dev/null 2>&1 | tr -d '\r' | grep -E 'TLS|SSL|ALPN|subject|issuer|expire|start date' | grep -vE 'TLS header|TLS change|TLS handshake, (Encrypted|Certificate \(1|CERT verify)' | head -16
} > out/https-ok.out.txt
{
  echo '$ curl -sS https://expired.badssl.com/ -o /dev/null; echo "exit code $?"'
  curl -sS https://expired.badssl.com/ -o /dev/null 2>&1; echo "exit code $?"
  echo
  echo '$ curl -sS https://self-signed.badssl.com/ -o /dev/null; echo "exit code $?"'
  curl -sS https://self-signed.badssl.com/ -o /dev/null 2>&1; echo "exit code $?"
} > out/https-bad.out.txt
echo ok
