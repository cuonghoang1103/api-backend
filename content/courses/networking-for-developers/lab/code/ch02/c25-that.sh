# Ch2 · 2.5 — Internet THẬT: AS nào quảng bá địa chỉ của cuongthai.com, và RPKI cho phép ai (API công khai RIPEstat, chỉ đọc)
IP=$(dig +short cuongthai.com A | head -1); echo "$IP"
curl -s "https://stat.ripe.net/data/prefix-overview/data.json?resource=$IP" > /tmp/p.json
jq -r '.data | "\(.resource) is announced by AS\(.asns[0].asn) (\(.asns[0].holder))"' /tmp/p.json
PFX=$(jq -r '.data.resource' /tmp/p.json); AS=$(jq -r '.data.asns[0].asn' /tmp/p.json)
rpki() { curl -s "https://stat.ripe.net/data/rpki-validation/data.json?resource=$1&prefix=$2" | jq -r --arg a "$1" --arg p "$2" '"AS\($a) announcing \($p): \(.data.status)"'; }
rpki "$AS" "$PFX"
curl -s "https://stat.ripe.net/data/rpki-validation/data.json?resource=$AS&prefix=$PFX" | jq -r '.data.validating_roas[] | "ROA: origin AS\(.origin), prefix \(.prefix), max length /\(.max_length)"'
rpki 64511 "$PFX"
rpki "$AS" 160.187.1.0/25
