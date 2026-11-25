# Nạp qua BASH_ENV khi chạy các tệp .bash của Chương 15. Trên máy của bạn: cài logcli (hoặc dùng Grafana Explore) — lệnh y hệt.
# Mọi thứ của lab nằm trong netns của lgz-c15-net ⇒ công cụ chạy "bên trong" netns đó.
logcli() { docker run --rm --network container:lgz-c15-net -e LOKI_ADDR=http://127.0.0.1:3100 grafana/logcli:3.7.10 --quiet "$@"; }
# curl trong netns lab (ảnh curl chính thức)
lcurl() { docker run --rm --network container:lgz-c15-net curlimages/curl:8.11.1 -s "$@"; }
# gửi request tới API thử (cổng 3080 trong netns)
goi() { docker exec lgz-c15-api wget -qO- "127.0.0.1:3080$1" >/dev/null 2>&1; true; }
# dò SSH sai mật khẩu n lần vào "máy Linux" (từ chính netns lab ⇒ IP nguồn là 127.0.0.1)
do_ssh() { docker exec lgz-c15-vm sh -c 'printf "#!/bin/sh\necho sai-mat-khau\n" > /tmp/sai && chmod +x /tmp/sai'
  for i in $(seq "$1"); do docker exec -e SSH_ASKPASS=/tmp/sai -e SSH_ASKPASS_REQUIRE=force lgz-c15-vm \
    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o NumberOfPasswordPrompts=1 -o PreferredAuthentications=password "${2:-an}@127.0.0.1" true >/dev/null 2>&1; done; true; }
# trạng thái các luật cảnh báo Grafana (Normal/Pending/Alerting) — in mỗi khi đổi, tới khi luật $1 đạt trạng thái $2 hoặc hết $3 giây
gf() { lcurl -u admin:$GF_SECURITY_ADMIN_PASSWORD "127.0.0.1:3000$1" "${@:2}"; }
trang_thai() { gf /api/prometheus/grafana/api/v1/rules | jq -r '.data.groups[].rules[] | "\(.name)=\(.state)"' | tr '\n' ' '; }
cho_luat() { local cu="" moi t0=$SECONDS; while [ $((SECONDS - t0)) -lt "$3" ]; do
  moi=$(gf /api/prometheus/grafana/api/v1/rules | jq -r --arg n "$1" '.data.groups[].rules[] | select(.name==$n) | .state')
  [ "$moi" != "$cu" ] && { echo "$(date -u +%T)  $1: $moi"; cu=$moi; }; [ "$moi" = "$2" ] && return 0; sleep 3; done; echo "hết $3 s, vẫn $cu"; }
# tin đã tới "điện thoại" (chủ đề ntfy) kể từ mốc .t0
dien_thoai() { lcurl "127.0.0.1:2586/lab15-canh-bao/json?poll=1&since=$(cat .t0)" | jq -r '"\(.time | strftime("%H:%M:%S"))  \(.title)"'; }
