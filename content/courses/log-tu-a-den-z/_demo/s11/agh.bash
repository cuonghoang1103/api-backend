# 11.2 — AdGuard Home v1.0.0 (máy chặn quảng cáo/DNS cho cả nhà, cùng họ với Pi-hole): cài không cần giao diện, chặn hai tên, đọc query log (JSON) bằng API + jq.
# Chạy trên máy thật: python3 ../s10/cong-cu/chay.py agh.bash "$PWD" — container lgz-agh, cổng 127.0.0.1:41153 (DNS) và 41130 (web). Dọn: docker rm -f lgz-agh
docker run -d --name lgz-agh --label lgz=1 -p 127.0.0.1:41153:53/udp -p 127.0.0.1:41130:3000 adguard/adguardhome:v1.0.0 | cut -c1-12
sleep 4; curl -s -X POST -H 'Content-Type: application/json' -d '{"web":{"ip":"0.0.0.0","port":3000},"dns":{"ip":"0.0.0.0","port":53},"username":"an","password":"LabAdguard-11"}' http://127.0.0.1:41130/control/install/configure; echo
sleep 3; MK='LabAdguard-11'; curl -s -u an:$MK -X POST -H 'Content-Type: application/json' -d '{"rules":["||quang-cao.example^","||theo-doi.example^"]}' http://127.0.0.1:41130/control/filtering/set_rules; echo "đã thêm 2 luật chặn"
for n in vnexpress.net quang-cao.example theo-doi.example vnexpress.net; do echo "$n → $(dig @127.0.0.1 -p 41153 +short $n A | head -n 1)"; done
curl -s -u an:$MK 'http://127.0.0.1:41130/control/querylog?limit=1' | jq '.data[0]'
curl -s -u an:$MK 'http://127.0.0.1:41130/control/querylog?limit=20' | jq -r '.data[] | select(.question.type=="A") | [.time[11:19], .client, .question.name, .reason, (.cached|tostring), (.answer[0].value // "-")] | @tsv'
curl -s -u an:$MK 'http://127.0.0.1:41130/control/querylog?response_status=blocked' | jq -r '.data[].question.name' | sort | uniq -c
docker exec lgz-agh ls -l /opt/adguardhome/work/data/; docker restart lgz-agh >/dev/null; sleep 3; docker exec lgz-agh sh -c 'wc -l /opt/adguardhome/work/data/querylog.json; head -c 330 /opt/adguardhome/work/data/querylog.json'; echo
docker rm -f lgz-agh >/dev/null && echo "đã dọn lgz-agh"
