#!/bin/bash
# kiem-dns.sh [domain] [TLD server IP] — DNS health check for one domain, cron-friendly. Prints [OK]/[FAIL] per line, exit code 1 if anything FAILs.
#  1) delegation at the parent: which name servers, which addresses (glue)   2) each name server: does it answer, which serial (all must be equal)
#  3) does the child's NS list match the parent's                             4) DNSSEC: delv checks the whole chain, days left on the signatures
Z=${1:-labflow.test}; TLD=${2:-192.0.2.20}; loi=0
ok() { printf '[OK]   %s\n' "$*"; }; hong() { printf '[FAIL] %s\n' "$*"; loi=1; }
cha=$(dig +noall +authority +additional "$Z" NS @"$TLD" +norecurse)
ns_cha=$(awk '$4 == "NS" { print $5 }' <<< "$cha" | sort | tr '\n' ' ')
ok "delegation at the parent: $ns_cha"
serials=""; ip_dau=""
for ns in $ns_cha; do
  ip=$(awk -v n="$ns" '$1 == n && $4 == "A" { print $5 }' <<< "$cha")
  s=$(dig +short +time=2 +tries=1 SOA "$Z" @"$ip" 2>/dev/null | awk '$3 ~ /^[0-9]+$/ { print $3 }')
  if [ -n "$s" ]; then ok "$ns $ip answers, serial $s"; serials="$serials $s"; ip_dau=${ip_dau:-$ip}; else hong "$ns $ip does not answer"; fi
done
[ "$(tr ' ' '\n' <<< "$serials" | sort -u | grep -c .)" -le 1 ] && ok "all name servers have the same serial" || hong "serials differ:$serials"
ns_con=$(dig +short NS "$Z" @"$ip_dau" | sort | tr '\n' ' ')
[ "$ns_con" = "$ns_cha" ] && ok "child NS = parent NS" || hong "child NS ($ns_con) != parent NS ($ns_cha)"
v=$(delv -a /dnsz/anchor.conf "$Z" SOA 2>&1 | head -1)
[ "$v" = "; fully validated" ] && ok "DNSSEC: fully validated (delv)" || hong "DNSSEC: $v"
het=$(dig +dnssec +noall +answer SOA "$Z" @"$ip_dau" | awk '$4 == "RRSIG" { print $9; exit }')
if [ -n "$het" ]; then
  ngay=$(awk -v a="$(date -u -d "${het:0:8} ${het:8:2}:${het:10:2}:${het:12:2}" +%s)" -v b="$(date -u +%s)" 'BEGIN { printf "%.1f", (a - b) / 86400 }')
  awk -v d="$ngay" 'BEGIN { exit !(d >= 7) }' && ok "signatures expire in $ngay days" || hong "signatures expire in $ngay days (< 7)"
fi
exit $loi
