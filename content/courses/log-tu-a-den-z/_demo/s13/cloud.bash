# 13.4 — log cloud. Phần A: API CloudWatch Logs / CloudTrail thật của AWS CLI 2.32 gọi vào moto 5.1.18 (giả lập AWS chạy cục bộ, mạng lgz-c13a).
# Phần B: đọc bản ghi CloudTrail + VPC Flow Logs MẪU (cloud/tao-mau.py, đúng cấu trúc tài liệu AWS) bằng jq 1.7 / awk. cwd = thư mục làm việc.
# Chạy: BASH_ENV=cong-cu/aws-env.bash python3 chay.py cloud.bash <thư mục>  ("aws" là hàm trong aws-env.bash)
docker network create lgz-c13a >/dev/null; docker run -d --name lgz-moto --network lgz-c13a motoserver/moto:5.1.18 >/dev/null; sleep 3; python3 tao-mau.py mau
aws --version | cut -d" " -f1-2
aws logs create-log-group --log-group-name /lab13/orders && aws logs create-log-stream --log-group-name /lab13/orders --log-stream-name orders-api-7f9c && aws logs describe-log-groups --query 'logGroups[].{group:logGroupName,retention:retentionInDays}' --output table
t=$(date +%s%3N); jq -nc --argjson t "$t" '[{timestamp:$t, message:({level:"info",msg:"order created",orderId:1001,ms:31}|tojson)}, {timestamp:($t+5), message:({level:"error",msg:"db timeout",ms:5003}|tojson)}, {timestamp:($t+9), message:({level:"info",msg:"order created",orderId:1002,ms:27}|tojson)}]' > ev.json; aws logs put-log-events --log-group-name /lab13/orders --log-stream-name orders-api-7f9c --log-events file:///dev/stdin < ev.json --query rejectedLogEventsInfo
aws logs get-log-events --log-group-name /lab13/orders --log-stream-name orders-api-7f9c --query 'events[].[timestamp,message]' --output text
aws logs filter-log-events --log-group-name /lab13/orders --filter-pattern '{ $.level = "error" }' --query 'length(events)'
aws logs filter-log-events --log-group-name /lab13/orders --query 'events[].message' --output json | jq -r '.[] | fromjson | select(.level == "error") | "\(.msg) \(.ms) ms"'
aws logs put-retention-policy --log-group-name /lab13/orders --retention-in-days 14 && aws logs describe-log-groups --query 'logGroups[].{group:logGroupName,retention:retentionInDays}' --output table
aws s3 mb s3://lab13-trail >/dev/null && aws cloudtrail create-trail --name org-trail --s3-bucket-name lab13-trail --query Name --output text && aws cloudtrail start-logging --name org-trail && aws cloudtrail get-trail-status --name org-trail --query '{IsLogging:IsLogging}'
aws cloudtrail stop-logging --name org-trail && aws cloudtrail get-trail-status --name org-trail --query '{IsLogging:IsLogging,StopLoggingTime:StopLoggingTime}'
jq '.Records | length' mau/cloudtrail-20261123.json
jq -c '.Records[0] | {eventTime, eventSource, eventName, user: .userIdentity.userName, sourceIPAddress, result: .responseElements.ConsoleLogin, mfa: .additionalEventData.MFAUsed}' mau/cloudtrail-20261123.json
jq -r '.Records[] | [.eventTime[11:19], .userIdentity.userName, .sourceIPAddress, .eventName, (.errorCode // "-")] | @tsv' mau/cloudtrail-20261123.json | column -t
jq -r '.Records[] | select(.errorCode == "AccessDenied") | .userIdentity.accessKeyId + " " + .sourceIPAddress' mau/cloudtrail-20261123.json | sort | uniq -c
jq -r '.Records[] | select(.eventName | test("^(StopLogging|DeleteTrail|UpdateTrail|PutEventSelectors|DeleteFlowLogs|DeleteLogGroup)$")) | "\(.eventTime) \(.userIdentity.userName) \(.sourceIPAddress) \(.eventName) \(.requestParameters | tostring)"' mau/cloudtrail-20261123.json
jq -c '.Records[] | select(.eventName == "RunInstances") | {eventTime, errorCode, req: .requestParameters}' mau/cloudtrail-20261123.json
jq -r '.Records[] | select(.userIdentity.accessKeyId == "AKIAIOSFODNN7EXAMPLE") | .userAgent' mau/cloudtrail-20261123.json | sort | uniq -c | cut -c1-90
head -3 mau/flow-20261123.log
awk 'NR > 1 {print $13, $7}' mau/flow-20261123.log | sort | uniq -c | sort -rn
awk 'NR > 1 && $13 == "REJECT" {print $4}' mau/flow-20261123.log | sort | uniq -c | sort -rn
awk 'NR > 1 && $13 == "ACCEPT" && $7 == 5432 {printf "%s %s -> %s:%s %s gói %s byte\n", strftime("%H:%M:%S", $11, 1), $4, $5, $7, $9, $10}' mau/flow-20261123.log
awk 'NR > 1 && $14 != "OK"' mau/flow-20261123.log
docker rm -f lgz-moto >/dev/null; docker network rm lgz-c13a >/dev/null; rm -f ev.json; echo "đã dọn"
