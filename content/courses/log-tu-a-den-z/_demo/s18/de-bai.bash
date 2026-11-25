# 18.1 — Đề bài: mở bộ dữ liệu, xem có những nguồn nào, mỗi nguồn một dòng mẫu (giải phẫu từng kiểu ghi giờ)
cat su-co18/DE-BAI.txt
cd su-co18 && find . -type f -printf '%s %p\n' | sed -E 's|\./||; s/[0-9a-f]{64}/<id>/g' | sort -k2 | awk '{printf "%9d  %s\n", $1, $2}'
cd su-co18/vps01 && head -n 1 var/log/auth.log.1 && head -n 1 var/log/syslog.1 | cut -c1-120
cd su-co18/vps01 && head -n 1 journal/vps01-journal.json | jq -c '{__REALTIME_TIMESTAMP, SYSLOG_IDENTIFIER, _PID, MESSAGE}'
cd su-co18/vps01 && head -n 1 var/log/nginx/access.log && cut -c1-110 var/log/nginx/error.log
cd su-co18/vps01 && sed -n 2p var/lib/docker/containers/*/*-json.log | cut -c1-230
cd su-co18/vps01 && head -n 3 postgresql/log/postgresql-Tue.csv | cut -c1-200
cd su-co18 && head -n 1 rt01/logread.txt && sed -n 200p rt01/logread.txt
cd su-co18 && head -n 1 pc-dev01/security.jsonl | jq -c '{TimeCreated, Id, RecordId, MachineName, Data: (.Data | {TargetUserName, LogonType, IpAddress})}'
cd su-co18 && wc -l vps01/var/log/auth.log* vps01/var/log/syslog* vps01/journal/*.json vps01/var/log/nginx/*.log rt01/logread.txt pc-dev01/security.jsonl | sed -E 's/[0-9a-f]{64}/<id>/g'
