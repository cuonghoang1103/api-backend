/**
 * Cloud AWS — Chương 10: Quan sát — CloudWatch (log, chỉ số, cảnh báo, truy vết)
 * (soạn 20/11/2026, agent aws; phiên 32 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   10.1 logs · 10.2 metrics · 10.3 alarms · 10.4 tracing · 10.5 lab-10 · 10.6 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c10/101.sh … 104.sh, lab10/chay.sh:
 *   - API LabFlow thu nhỏ (Node.js 22, app/api.cjs + kho.cjs) tự gửi log JSON (PutLogEvents) và chỉ số (PutMetricData)
 *     tới LocalStack 4.12 (community) qua AWS SDK v3; AWS CLI 2.41.0 (một container sống lâu aws-c10-cli + docker exec);
 *   - cảnh báo CloudWatch ⇒ SNS ⇒ hàng SQS "hộp thư" (đứng thay email/chat) — LocalStack đánh giá cảnh báo thật mỗi chu kỳ;
 *   - truy vết: OpenTelemetry (sdk-node + auto-instrumentations) ⇒ Jaeger 1.65 (đứng thay X-Ray, vì LocalStack community không có X-Ray);
 *   - giá: Price List API AmazonCloudWatch Singapore 11/2026 (~/.rtq-aws/c10/gia).
 * Khác AWS đã ghi rõ trong bài: LocalStack KHÔNG thực thi filter pattern (filter-log-events + metric filter đếm mọi dòng),
 *   Logs Insights chỉ trả @ptr, phân vị p50/p99 và metric math lỗi, bỏ qua datapoints-to-alarm, không có CloudTrail/X-Ray,
 *   không có data protection policy ⇒ phần đó chạy CÙNG logic bằng jq trên chính dữ liệu log thật, hoặc nói lý thuyết + nguồn.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/js() của _chung.mjs.
 */
import { bash, json, js, out, tl, giai } from './_chung.mjs';
/* ═════ Output THẬT (scratchpad/aws/lab/c10: API LabFlow Node.js 22 + AWS SDK v3 → LocalStack 4.12 (Logs, CloudWatch, SNS, SQS); AWS CLI 2.41.0; OpenTelemetry → Jaeger 1.65) ═════ */
const OUT_101_CHE = out("# Bản sửa: che các khoá nhạy cảm TRƯỚC khi ghi (CHE=1)\n{\"msg\":\"dang nhap\",\"body\":{\"email\":\"sv@example.com\",\"password\":\"[ĐÃ CHE]\"},\"authorization\":\"[ĐÃ CHE]\"}\n# Lớp thứ hai trên AWS: data protection policy của log group (che email, số thẻ…). Trên LocalStack:\n$ aws logs put-data-protection-policy --log-group-identifier /labflow/api --policy-document file:///aws/dp.json\nAn error occurred (InternalFailure) when calling the PutDataProtectionPolicy operation: The put_data_protection_policy action has not been implemented");
const OUT_101_GIA = out("# Cỡ trung bình một dòng log THẬT của API vừa chạy: 201 byte\nyêu cầu/giây · GB nạp/tháng · tiền nạp · lưu 14 ngày · lưu MÃI 1 năm sau\n  10 ·   10.4 GB ·    7.29 USD ·  0.15 USD ·   3.75 USD/tháng\n  50 ·   52.1 GB ·   36.47 USD ·  0.73 USD ·  18.76 USD/tháng\n 200 ·  208.4 GB ·  145.88 USD ·  2.92 USD ·  75.02 USD/tháng\n(2 dòng log mỗi yêu cầu; giá Singapore 11/2026: nạp 0,70 USD/GB, lưu 0,03 USD/GB-tháng)");
const OUT_101_GUI = out("# API LabFlow gửi log JSON lên CloudWatch Logs mỗi giây. Bắn 20 yêu cầu, 4 cái giả lỗi DB:\n$ node tai.cjs 20 0.2\nđã gửi 20 yêu cầu ⇒ 200: 8 · 201: 8 · 503: 4\n$ aws logs describe-log-streams --log-group-name /labflow/api --query 'logStreams[].[logStreamName,storedBytes]' --output text\napi-1\t5039\n$ aws logs get-log-events --log-group-name /labflow/api --log-stream-name api-1 --limit 4 --query 'events[].message' --output text\n{\"ts\":\"2026-11-20T03:50:51.042Z\",\"level\":\"error\",\"msg\":\"connect ETIMEDOUT db:5432\",\"requestId\":\"8b39d1c4-9c06-400a-b1d0-67aae6dc5337\",\"route\":\"GET /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.046Z\",\"level\":\"error\",\"msg\":\"request\",\"requestId\":\"8b39d1c4-9c06-400a-b1d0-67aae6dc5337\",\"route\":\"GET /bookings\",\"status\":503,\"ms\":301,\"user\":\"sv0\",\"headers\":{\"authorization\":\"[ĐÃ CHE]\"}}\n{\"ts\":\"2026-11-20T03:50:51.354Z\",\"level\":\"error\",\"msg\":\"connect ETIMEDOUT db:5432\",\"requestId\":\"d13f20d6-afaf-4453-a33b-d18b4bc2bd26\",\"route\":\"POST /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.355Z\",\"level\":\"error\",\"msg\":\"request\",\"requestId\":\"d13f20d6-afaf-4453-a33b-d18b4bc2bd26\",\"route\":\"POST /bookings\",\"status\":503,\"ms\":301,\"user\":\"sv1\",\"headers\":{\"authorization\":\"[ĐÃ CHE]\"}}");
const OUT_101_INSIGHTS = out("# Logs Insights: đếm theo route + mã trạng thái\n$ aws logs start-query --log-group-name /labflow/api --start-time $(date -d '-15 min' +%s) --end-time $(date +%s) --query-string 'stats count(*) as soLan, avg(ms) as tbMs, max(ms) as maxMs by route, status'\n$ aws logs get-query-results --query-id $QID --query 'results[0]'\n[{\"field\":\"@ptr\",\"value\":\"0\"}]\n# ⚠ LocalStack 4.12 chỉ trả @ptr, không tính stats. Cùng phép tính bằng jq (AWS trả đúng bảng này):\n$ jq -s 'map(select(.msg == \"request\")) | group_by(.route, .status) | map({route: .[0].route, status: .[0].status, soLan: length, tbMs: (map(.ms) | add / length | floor), maxMs: (map(.ms) | max)})' log-api.jsonl\nroute           status  soLan  tbMs  maxMs\nGET /bookings   200     8      13    14\nGET /bookings   503     2      301   301\nPOST /bookings  201     8      13    15\nPOST /bookings  503     2      301   301");
const OUT_101_LO = out("# Bản 'gỡ lỗi cho nhanh': log cả body và header của /login (CHE=0)\n$ TOKEN=cho-giu-token   # chỗ giữ, không phải token thật\n$ curl -X POST localhost:44080/login -H \"authorization: Bearer $TOKEN\" -d '{\"email\":\"sv@example.com\",\"password\":\"mat-khau-thu\"}'\n$ aws logs filter-log-events --log-group-name /labflow/api --log-stream-names api-lo --query 'events[1].message' --output text | jq -c '{msg, body, authorization: .headers.authorization}'\n{\"msg\":\"dang nhap\",\"body\":{\"email\":\"sv@example.com\",\"password\":\"mat-khau-thu\"},\"authorization\":\"Bearer cho-giu-token\"}\n# Ai có quyền logs:GetLogEvents/FilterLogEvents (dev, công cụ giám sát, đối tác) giờ đọc được mật khẩu và token.");
const OUT_101_LOC = out("# Lọc bằng filter pattern JSON: chỉ dòng có status >= 500\n$ aws logs filter-log-events --log-group-name /labflow/api --filter-pattern '{ $.status >= 500 }' --query 'length(events)'\n25\n# ⚠ LocalStack 4.12 KHÔNG thực thi filter pattern: trả về MỌI dòng (25 dòng). Trên AWS thật lệnh trên chỉ trả các dòng 5xx.\n# Cùng điều kiện, chạy bằng jq trên chính các dòng vừa lấy về (đúng kết quả AWS sẽ trả):\n$ jq -c 'select(.status >= 500) | {ts, level, msg, route, status}' log-api.jsonl\n{\"ts\":\"2026-11-20T03:50:51.042Z\",\"level\":\"error\",\"msg\":\"connect ETIMEDOUT db:5432\",\"route\":\"GET /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.046Z\",\"level\":\"error\",\"msg\":\"request\",\"route\":\"GET /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.354Z\",\"level\":\"error\",\"msg\":\"connect ETIMEDOUT db:5432\",\"route\":\"POST /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.355Z\",\"level\":\"error\",\"msg\":\"request\",\"route\":\"POST /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.660Z\",\"level\":\"error\",\"msg\":\"connect ETIMEDOUT db:5432\",\"route\":\"GET /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.660Z\",\"level\":\"error\",\"msg\":\"request\",\"route\":\"GET /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.966Z\",\"level\":\"error\",\"msg\":\"connect ETIMEDOUT db:5432\",\"route\":\"POST /bookings\",\"status\":503}\n{\"ts\":\"2026-11-20T03:50:51.967Z\",\"level\":\"error\",\"msg\":\"request\",\"route\":\"POST /bookings\",\"status\":503}");
const OUT_101_NHOM = out("# Tạo log group. Mặc định: KHÔNG có retentionInDays = giữ MÃI MÃI (và trả tiền lưu mãi mãi)\n$ aws logs create-log-group --log-group-name /labflow/api\n$ aws logs describe-log-groups --log-group-name-prefix /labflow --query 'logGroups[].{ten:logGroupName,giuNgay:retentionInDays}' --output json\n[\n    {\n        \"ten\": \"/labflow/api\",\n        \"giuNgay\": null\n    }\n]\n$ aws logs put-retention-policy --log-group-name /labflow/api --retention-in-days 14\n$ aws logs describe-log-groups --log-group-name-prefix /labflow --query 'logGroups[].{ten:logGroupName,giuNgay:retentionInDays}' --output json\n[\n    {\n        \"ten\": \"/labflow/api\",\n        \"giuNgay\": 14\n    }\n]");
const OUT_102_CARDINALITY = out("# Trước: 4 chỉ số trong namespace LabFlow (2 tên × 2 route).\n# Thêm dimension UserId 'cho dễ tra' rồi chạy 70 yêu cầu của 7 người dùng:\n$ node tai.cjs 70 0\nđã gửi 70 yêu cầu ⇒ 200: 35 · 201: 35\n$ aws cloudwatch list-metrics --namespace LabFlow --query 'length(Metrics)'\n32\n$ aws cloudwatch list-metrics --namespace LabFlow --metric-name DoTre --dimensions Name=UserId --query 'Metrics[].Dimensions[?Name==`UserId`].Value[]' --output text | tr '\\t' '\\n' | sort -u\nsv0 sv1 sv2 sv3 sv4 sv5 sv6 ");
const OUT_102_DASH = out("$ aws cloudwatch put-dashboard --dashboard-name labflow --dashboard-body file:///aws/dash.json\n$ aws cloudwatch list-dashboards --query 'DashboardEntries[].[DashboardName,Size]' --output text\nlabflow\t225\n$ aws cloudwatch get-dashboard --dashboard-name labflow --query DashboardBody --output text | jq -c '.widgets[] | [.type, .properties.title // .properties.markdown, .properties.stat]'\n[\"metric\",\"Độ trễ p99 theo route\",\"p99\"]\n[\"metric\",\"Lỗi 5xx mỗi phút\",\"Sum\"]\n[\"text\",\"Sổ tay xử lý sự cố: xem bài 10.3 — cảnh báo api-5xx\",null]");
const OUT_102_GIA = out("người dùng · chỉ số (2 tên × 2 route × người) · USD/tháng\n      7 ·      28 ·      8.40\n   1000 ·    4000 ·   1200.00\n  10000 ·   40000 ·   6000.00\n 100000 ·  400000 ·  34500.00\nKhông có UserId: 4 chỉ số · 1.20 USD/tháng\n(giá Singapore 11/2026: 0,30 USD/chỉ số-tháng cho 10.000 đầu, 0,10 cho 240.000 tiếp…; 10 chỉ số đầu miễn phí — chưa trừ)");
const OUT_102_PV = out("$ jq -r 'select(.msg==\"request\" and .route==\"GET /bookings\") | .ms' log.jsonl | sort -n > ms.txt\nmẫu: 51 · trung bình: 59.8 ms · p50: 13 ms · p90: 15 ms · p99: 801 ms · max: 802 ms");
const OUT_102_TB = out("# 95 yêu cầu nhanh + 5 yêu cầu chạm phải truy vấn chậm (kho trả sau 800 ms)\n$ node tai.cjs 95 0 /bookings\nđã gửi 95 yêu cầu ⇒ 200: 48 · 201: 47\n$ node tai.cjs 5 0 '/bookings?cham=1'\nđã gửi 5 yêu cầu ⇒ 200: 3 · 201: 2\n$ aws cloudwatch list-metrics --namespace LabFlow --query 'Metrics[].[MetricName,Dimensions[0].Name,Dimensions[0].Value]' --output text\nDoTre\tRoute\tGET /bookings\nDoTre\tRoute\tPOST /bookings\nLoi5xx\tRoute\tGET /bookings\nLoi5xx\tRoute\tPOST /bookings\n$ aws cloudwatch get-metric-statistics --namespace LabFlow --metric-name DoTre --dimensions 'Name=Route,Value=GET /bookings' --start-time 2026-11-20T03:39:55Z --end-time $(date -u -d '+2 min' +%FT%TZ) --period 300 --statistics Average Minimum Maximum SampleCount --query 'Datapoints[0]'\n{\n    \"Timestamp\": \"2026-11-20T03:39:55+00:00\",\n    \"SampleCount\": 51.0,\n    \"Average\": 59.84313725490196,\n    \"Minimum\": 12.0,\n    \"Maximum\": 802.0,\n    \"Unit\": \"Milliseconds\"\n}\n# Thử phân vị p99 ngay trên CloudWatch:\n$ aws cloudwatch get-metric-statistics … --extended-statistics p50 p99\nAn error occurred (InternalError) when calling the GetMetricStatistics operation (reached max retries: 2): exception while calling cloudwatch.GetMetricStatistics: 'NoneTy\n# ⚠ LocalStack 4.12 lỗi với phân vị (AWS thật trả p50/p99). Tính phân vị từ chính các mẫu ms trong log của các yêu cầu GET:");
const OUT_103_DUONGBAO = out("# Đường báo: alarm ⇒ SNS topic ⇒ (email/chat). Ở đây một hàng SQS 'hộp thư' đứng thay email để đọc được thư.\n$ aws sns create-topic --name labflow-canh-bao --query TopicArn --output text\narn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao\n$ aws sns subscribe --topic-arn arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao --protocol sqs --notification-endpoint arn:aws:sqs:ap-southeast-1:000000000000:labflow-hop-thu --attributes RawMessageDelivery=true --query SubscriptionArn --output text\narn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao:fdcb924d-d044-4cda-819c-55207be535a1\n# Cảnh báo: lỗi 5xx của POST /bookings, tổng ≥ 5 trong 1 phút ⇒ ALARM; hết lỗi ⇒ OK. Cả hai chiều đều báo.\n$ aws cloudwatch put-metric-alarm --alarm-name api-5xx --alarm-description 'POST /bookings trả 5xx — xem sổ tay bài 10.3' --namespace LabFlow --metric-name Loi5xx --dimensions 'Name=Route,Value=POST /bookings' --statistic Sum --period 60 --evaluation-periods 1 --threshold 5 --comparison-operator GreaterThanOrEqualToThreshold --treat-missing-data notBreaching --alarm-actions arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao --ok-actions arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao\n10:40:47 trạng thái: api-5xx OK \n# DB 'chết': 20 yêu cầu đều lỗi (10 POST, 10 GET)\n$ node tai.cjs 20 1\nđã gửi 20 yêu cầu ⇒ 503: 20\n10:41:48 trạng thái: api-5xx ALARM \n# Hộp thư nhận được:\n10:40:47 api-5xx: INSUFFICIENT_DATA ⇒ OK — Threshold Crossed: no datapoints were received for 1 period and 1 missing datapoint was treated as [NonBreaching].\n10:41:47 api-5xx: OK ⇒ ALARM — Threshold Crossed\n# DB sống lại: chỉ còn yêu cầu thành công\n$ node tai.cjs 20 0\nđã gửi 20 yêu cầu ⇒ 200: 10 · 201: 10\n10:44:49 trạng thái: api-5xx OK \n# Hộp thư:\n10:40:47 api-5xx: INSUFFICIENT_DATA ⇒ OK — Threshold Crossed: no datapoints were received for 1 period and 1 missing datapoint was treated as [NonBreaching].\n10:41:47 api-5xx: OK ⇒ ALARM — Threshold Crossed\n10:44:47 api-5xx: ALARM ⇒ OK — Threshold Crossed\n$ aws cloudwatch describe-alarm-history --alarm-name api-5xx --history-item-type StateUpdate --query 'AlarmHistoryItems[].HistorySummary' --output text\nAlarm updated from INSUFFICIENT_DATA to OK\tAlarm updated from OK to ALARM\tAlarm updated from ALARM to OK");
const OUT_103_GHEP = out("# Cảnh báo ghép: chỉ báo 'sự cố đặt phòng' khi CẢ lỗi 5xx lẫn trễ cao cùng ALARM\n$ aws cloudwatch put-composite-alarm --alarm-name su-co-dat-phong --alarm-rule 'ALARM(\"api-5xx\") AND ALARM(\"api-cham\")' --alarm-actions arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao\n$ aws cloudwatch describe-alarms --alarm-types CompositeAlarm --query 'CompositeAlarms[].[AlarmName,StateValue,AlarmRule]' --output text\nsu-co-dat-phong\tINSUFFICIENT_DATA\tALARM(\"api-5xx\") AND ALARM(\"api-cham\")");
const OUT_103_MTRONGN = out("# Cảnh báo 'trễ cao' (LocalStack không có phân vị ⇒ dùng Maximum): vượt 500 ms ở 2 trong 3 chu kỳ 60 giây\n$ aws cloudwatch put-metric-alarm --alarm-name api-cham --namespace LabFlow --metric-name DoTre --dimensions 'Name=Route,Value=GET /bookings' --statistic Maximum --period 60 --evaluation-periods 3 --datapoints-to-alarm 2 --threshold 500 --comparison-operator GreaterThanThreshold --treat-missing-data missing --alarm-actions arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao\n10:44:57 phút 1: một yêu cầu chậm (~800 ms)\n10:45:57 sau phút 1: api-cham OK \n10:45:59 phút 2: một yêu cầu chậm (~800 ms)\n10:46:59 sau phút 2: api-cham OK \n10:47:00 phút 3: một yêu cầu chậm (~800 ms)\n10:48:00 sau phút 3: api-cham ALARM \n$ aws cloudwatch describe-alarms --alarm-names api-cham --query 'MetricAlarms[0].[StateValue,StateReason]' --output text\nALARM\tThreshold Crossed");
const OUT_103_THU = out("# Thử đường báo TRƯỚC khi cần (đừng đợi sự cố thật mới biết email sai):\n$ aws cloudwatch set-alarm-state --alarm-name api-5xx --state-value ALARM --state-reason 'Thu duong bao - khong phai su co'\n# Hộp thư:\n10:44:51 api-5xx: OK ⇒ ALARM — Thu duong bao - khong phai su co\n# Cảnh báo hoá đơn: chỉ số AWS/Billing EstimatedCharges chỉ có ở us-east-1 (phải bật 'Receive Billing Alerts')\n$ aws cloudwatch put-metric-alarm --alarm-name hoa-don-20usd --namespace AWS/Billing --metric-name EstimatedCharges --dimensions 'Name=Currency,Value=USD' --statistic Maximum --period 21600 --evaluation-periods 1 --threshold 20 --comparison-operator GreaterThanThreshold\n$ aws cloudwatch describe-alarms --alarm-names hoa-don-20usd --query 'MetricAlarms[].[AlarmName,StateValue,Threshold]' --output text\nhoa-don-20usd\tINSUFFICIENT_DATA\t20.0\n# LocalStack không có dữ liệu hoá đơn ⇒ INSUFFICIENT_DATA mãi. Trên AWS: dùng cùng lúc với AWS Budgets (bài 0.1).");
const OUT_104_HAI = out("# Yêu cầu 1: bình thường. Yêu cầu 2: chạm truy vấn chậm. Mỗi yêu cầu = một trace; mỗi bước = một span.\n$ curl -s -o /dev/null -w '%{time_total}' localhost:44080/bookings\n0.019911 s\n$ curl -s -o /dev/null -w '%{time_total}' 'localhost:44080/bookings?cham=1'\n0.806335 s\n$ curl -s 'localhost:44086/api/services' | jq -c .data\n[\"labflow-kho\",\"labflow-api\"]");
const OUT_104_KIEMTOAN = out("# CloudTrail trên LocalStack bản cộng đồng:\n$ aws cloudtrail lookup-events --max-results 1\nAn error occurred (InternalFailure) when calling the LookupEvents operation: The API for service 'cloudtrail' is either not included in your current license pla\n# AWS Config: API có, nhưng có ghi được lịch sử cấu hình không?\n$ aws configservice put-configuration-recorder --configuration-recorder 'name=default,roleARN=arn:aws:iam::000000000000:role/config-role' --recording-group allSupported=true\n$ aws configservice describe-configuration-recorders --query 'ConfigurationRecorders[].[name,recordingGroup.allSupported]' --output text\ndefault\tTrue\n$ aws configservice put-config-rule --config-rule '{\"ConfigRuleName\":\"s3-cam-doc-cong-khai\",\"Source\":{\"Owner\":\"AWS\",\"SourceIdentifier\":\"S3_BUCKET_PUBLIC_READ_PROHIBITED\"}}'\n$ aws configservice describe-config-rules --query 'ConfigRules[].[ConfigRuleName,Source.SourceIdentifier]' --output text\ns3-cam-doc-cong-khai\tS3_BUCKET_PUBLIC_READ_PROHIBITED");
const OUT_104_NOI = out("# Nối log với trace: dòng log của yêu cầu chậm mang cùng traceId\n$ aws logs filter-log-events --log-group-name /labflow/trace --query 'events[].message' --output json | jq -r '.[]' | jq -c 'select(.traceId == \"b5962bbb3e28afe87e29bbeb3a6192f4\") | {msg, route, ms, traceId}'\n{\"msg\":\"request\",\"route\":\"GET /bookings\",\"ms\":804,\"traceId\":\"b5962bbb3e28afe87e29bbeb3a6192f4\"}\n# Truyền ngữ cảnh: API gửi kèm header W3C traceparent khi gọi kho:\n   GET http://127.0.0.1:44081/phong/A101?cham=1\n   traceparent: 00-b5962bbb3e28afe87e29bbeb3a6192f4-<spanId của span gọi>-01");
const OUT_104_THAC = out("# Trace NHANH (4445f2ccb26c387aa7eb8ca34a5f1abf):\n   0 ms  GET /bookings (server)  [labflow-api]  19 ms\n   0 ms    GET → /phong/A101 (client)  [labflow-api]  17 ms\n   5 ms      GET /phong/A101 (server)  [labflow-kho]  12 ms\n   5 ms        SELECT rooms WHERE id = $1  [labflow-kho]  11 ms\n\n# Trace CHẬM (b5962bbb3e28afe87e29bbeb3a6192f4):\n   0 ms  GET /bookings (server)  [labflow-api]  804 ms\n   0 ms    GET → /phong/A101?cham=1 (client)  [labflow-api]  803 ms\n   2 ms      GET /phong/A101 (server)  [labflow-kho]  801 ms\n   2 ms        SELECT rooms WHERE id = $1  [labflow-kho]  800 ms");
const OUT_105_LAB = out("$ bash truoc.sh   # bản vội\n$ bash cham.sh\n❌ 1. Log group /labflow/api giữ đúng 14 ngày — đang: None\n❌ 2. Log không chứa mật khẩu / token (lộ: 1 dòng, có dòng đăng nhập: 1)\n✅ 3. Mỗi dòng log yêu cầu là JSON và có requestId\n❌ 4. Chỉ số mới chỉ theo Route, không theo UserId (điểm theo user: 1, theo route: 1)\n❌ 5. Cảnh báo labflow-api-5xx: Loi5xx Sum ≥ 5, 60 s, 2 trên 3, thiếu dữ liệu = notBreaching — đang: Loi5xx Sum 1.0 60 1 None None\n❌ 6. Báo cả lúc ALARM lẫn lúc OK về topic labflow-canh-bao\n❌ 7. Thử đường báo: set-alarm-state ALARM ⇒ hộp thư labflow-hop-thu nhận thư ALARM (nhận: 0)\n❌ 8. Dashboard labflow: ≥ 2 widget, có DoTre p99\nĐIỂM: 1/8\n# ⛔ DỪNG ở đây — tự sửa trước khi mở lời giải\n$ bash giai.sh\n$ bash cham.sh\n✅ 1. Log group /labflow/api giữ đúng 14 ngày — đang: 14\n✅ 2. Log không chứa mật khẩu / token (lộ: 0 dòng, có dòng đăng nhập: 1)\n✅ 3. Mỗi dòng log yêu cầu là JSON và có requestId\n✅ 4. Chỉ số mới chỉ theo Route, không theo UserId (điểm theo user: 0, theo route: 1)\n✅ 5. Cảnh báo labflow-api-5xx: Loi5xx Sum ≥ 5, 60 s, 2 trên 3, thiếu dữ liệu = notBreaching — đang: Loi5xx Sum 5.0 60 3 2 notBreaching\n✅ 6. Báo cả lúc ALARM lẫn lúc OK về topic labflow-canh-bao\n✅ 7. Thử đường báo: set-alarm-state ALARM ⇒ hộp thư labflow-hop-thu nhận thư ALARM (nhận: 1)\n✅ 8. Dashboard labflow: ≥ 2 widget, có DoTre p99\nĐIỂM: 8/8\n$ bash don.sh\n$ bash con-gi.sh\ncảnh báo:  0\ndashboard: 0\nlog group: 0\ntopic SNS: 0\nhàng SQS:  0");
const MA_API = js("// api.cjs — API LabFlow thu nhỏ (Chương 10): log JSON có cấu trúc gửi CloudWatch Logs + chỉ số gửi CloudWatch.\n// Biến môi trường: PORT, AWS_ENDPOINT, LOG_GROUP, STREAM, KHO_URL, CHE=1 (che bí mật trong log), DIM_USER=1 (dimension theo user — SAI, để thấy giá).\nconst http = require('node:http');\nconst { randomUUID } = require('node:crypto');\nconst { CloudWatchLogsClient, PutLogEventsCommand, CreateLogStreamCommand } = require('@aws-sdk/client-cloudwatch-logs');\nconst { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');\nconst { trace } = require('@opentelemetry/api');\nconst cfg = { region: 'ap-southeast-1', endpoint: process.env.AWS_ENDPOINT };\nconst logs = new CloudWatchLogsClient(cfg), cw = new CloudWatchClient(cfg);\nconst GROUP = process.env.LOG_GROUP || '/labflow/api', STREAM = process.env.STREAM || 'api-' + process.pid;\nconst CHE = process.env.CHE === '1', DIM_USER = process.env.DIM_USER === '1';\nconst KHO = process.env.KHO_URL || 'http://127.0.0.1:44081';\n\n// ── Log: một dòng JSON mỗi sự kiện; gom lại và gửi PutLogEvents mỗi giây (việc awslogs driver của ECS làm thay bạn) ──\nconst BI_MAT = new Set(['authorization', 'cookie', 'password', 'matKhau', 'token']);\nconst che = (o) => (o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, BI_MAT.has(k) ? '[ĐÃ CHE]' : che(v)])) : o);\nlet hang = [];\nfunction log(level, msg, f = {}) {\n  const sp = trace.getActiveSpan(), traceId = sp && sp.spanContext().traceId;\n  const dong = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...(traceId ? { traceId } : {}), ...(CHE ? che(f) : f) });\n  process.stdout.write(dong + '\\n');\n  hang.push({ timestamp: Date.now(), message: dong });\n}\n// ── Chỉ số: gom theo route, gửi PutMetricData mỗi giây (Values/Counts = nhiều mẫu trong một lần gọi) ──\nlet mau = {};\nfunction ghiChiSo(route, ms, status, user) {\n  const k = DIM_USER ? route + '|' + user : route;\n  (mau[k] ||= { route, user, ms: [], loi: 0 }).ms.push(ms);\n  if (status >= 500) mau[k].loi++;\n}\nasync function xa() {\n  const lo = hang; hang = [];\n  if (lo.length) await logs.send(new PutLogEventsCommand({ logGroupName: GROUP, logStreamName: STREAM, logEvents: lo })).catch((e) => console.error('PutLogEvents', e.name));\n  const m = mau; mau = {};\n  const data = [];\n  for (const { route, user, ms, loi } of Object.values(m)) {\n    const Dimensions = [{ Name: 'Route', Value: route }, ...(DIM_USER ? [{ Name: 'UserId', Value: user }] : [])];\n    data.push({ MetricName: 'DoTre', Unit: 'Milliseconds', Dimensions, Values: ms, Counts: ms.map(() => 1) });\n    data.push({ MetricName: 'Loi5xx', Unit: 'Count', Dimensions, Value: loi });\n  }\n  for (let i = 0; i < data.length; i += 500) await cw.send(new PutMetricDataCommand({ Namespace: 'LabFlow', MetricData: data.slice(i, i + 500) })).catch((e) => console.error('PutMetricData', e.name));\n}\nconst hen = setInterval(xa, 1000);\n\nfunction goiKho(path) {\n  return new Promise((ok, loi) => http.get(KHO + path, (r) => { let b = ''; r.on('data', (c) => (b += c)); r.on('end', () => ok({ status: r.statusCode, body: b })); }).on('error', loi));\n}\nconst docBody = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { try { ok(JSON.parse(b || '{}')); } catch { ok({}); } }); });\n\nconst server = http.createServer(async (req, res) => {\n  if (req.url === '/health') { res.writeHead(200); return res.end('{\"status\":\"UP\"}'); } // kiểm sức khoẻ: không ghi log, không tính chỉ số\n  const t0 = performance.now(), requestId = req.headers['x-request-id'] || randomUUID();\n  const url = new URL(req.url, 'http://x'), route = req.method + ' ' + url.pathname.replace(/\\/\\d+$/, '/:id');\n  const user = req.headers['x-user'] || 'an-danh';\n  let status = 200, body = { ok: true };\n  try {\n    if (url.pathname === '/health') body = { status: 'UP' };\n    else if (url.pathname === '/login' && req.method === 'POST') {\n      const b = await docBody(req);\n      log('info', 'dang nhap', { requestId, route, email: b.email, body: b, headers: req.headers });\n      body = { token: 'chỗ-giữ-token' };\n    } else if (url.pathname.startsWith('/bookings')) {\n      if (req.headers['x-thu-loi'] === '1') { await new Promise((r) => setTimeout(r, 300)); throw Object.assign(new Error('connect ETIMEDOUT db:5432'), { status: 503 }); }\n      const k = await goiKho('/phong/A101' + (url.searchParams.has('cham') ? '?cham=1' : ''));\n      status = req.method === 'POST' ? 201 : 200; body = { phong: JSON.parse(k.body), requestId };\n    } else { status = 404; body = { loi: 'không có' }; }\n  } catch (e) {\n    status = e.status || 500; body = { loi: 'tạm thời không đặt được phòng', requestId };\n    log('error', e.message, { requestId, route, status });\n  }\n  const ms = Math.round(performance.now() - t0);\n  res.writeHead(status, { 'content-type': 'application/json', 'x-request-id': requestId }); res.end(JSON.stringify(body));\n  log(status >= 500 ? 'error' : 'info', 'request', { requestId, route, status, ms, user, ...(url.pathname === '/login' ? {} : { headers: { authorization: req.headers.authorization } }) });\n  ghiChiSo(route, ms, status, user);\n});\n\n(async () => {\n  await logs.send(new CreateLogStreamCommand({ logGroupName: GROUP, logStreamName: STREAM })).catch(() => {});\n  server.listen(+process.env.PORT || 44080, '127.0.0.1', () => log('info', 'san sang', { port: +process.env.PORT || 44080, stream: STREAM }));\n})();\nprocess.on('SIGTERM', async () => { clearInterval(hen); server.close(); await xa(); process.exit(0); });");
const MA_OTEL = js("// otel.cjs — nạp TRƯỚC ứng dụng (node -r ./otel.cjs app.cjs): tự gắn trace cho http, gửi span qua OTLP/HTTP.\n// Trên AWS: cùng mã này gửi tới ADOT Collector / CloudWatch (X-Ray) — chỉ đổi OTEL_EXPORTER_OTLP_ENDPOINT.\nconst { NodeSDK } = require('@opentelemetry/sdk-node');\nconst { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');\nconst { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');\nnew NodeSDK({\n  serviceName: process.env.OTEL_SERVICE_NAME,\n  traceExporter: new OTLPTraceExporter({ url: (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://127.0.0.1:44018') + '/v1/traces' }),\n  instrumentations: [getNodeAutoInstrumentations({ '@opentelemetry/instrumentation-fs': { enabled: false } })],\n}).start();");
const MA_CHAM = bash("#!/bin/bash\n# Bộ chấm lab 10 — 8 phép (cấu hình + hành vi). Chạy: bash cham.sh  (in ĐIỂM x/8)\nsource ~/vbg-dp/scratchpad/aws/lab/c10/chung10.sh; bat_cli10; d=0\nok() { if [ \"$2\" = 1 ]; then echo \"✅ $1\"; d=$((d+1)); else echo \"❌ $1\"; fi; }\nG=/labflow/api; TA=arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao\nR=$(a logs describe-log-groups --log-group-name-prefix $G --query 'logGroups[0].retentionInDays' --output text)\nok \"1. Log group $G giữ đúng 14 ngày — đang: ${R:-?}\" $([ \"$R\" = 14 ] && echo 1)\nM=$RANDOM   # dấu riêng của lần chấm này\ncurl -s -o /dev/null -X POST 127.0.0.1:44080/login -H \"authorization: Bearer cho-giu-cham-$M\" -d \"{\\\"email\\\":\\\"cham-$M@example.com\\\",\\\"password\\\":\\\"mat-khau-cham-$M\\\"}\"\ntai 14 0 >/dev/null; sleep 4\na logs filter-log-events --log-group-name $G --start-time $(( ($(date +%s) - 120) * 1000 )) --query 'events[].message' --output json | jq -r '.[]' > $LAM/cham.jsonl\nLO=$(grep -c -e \"mat-khau-cham-$M\" -e \"cho-giu-cham-$M\" $LAM/cham.jsonl); CO=$(grep '\"dang nhap\"' $LAM/cham.jsonl | grep -c \"cham-$M@example.com\")\nok \"2. Log không chứa mật khẩu / token (lộ: $LO dòng, có dòng đăng nhập: $CO)\" $([ \"$LO\" = 0 ] && [ \"$CO\" -ge 1 ] && echo 1)\nRQ=$(tail -20 $LAM/cham.jsonl | jq -s 'map(select(.msg == \"request\")) | (length > 0 and all(.requestId != null))' 2>/dev/null)\nok \"3. Mỗi dòng log yêu cầu là JSON và có requestId\" $([ \"$RQ\" = true ] && echo 1)\nBD=$(docker inspect -f '{{.State.StartedAt}}' aws-c10-api 2>/dev/null | cut -c1-19)Z; KT=$(date -u -d '+2 min' +%FT%TZ)\ncs() { a cloudwatch get-metric-statistics --namespace LabFlow --metric-name DoTre --dimensions \"$@\" --start-time \"$BD\" --end-time \"$KT\" --period 3600 --statistics SampleCount --query 'length(Datapoints)'; }\nNU=$(cs 'Name=Route,Value=GET /bookings' 'Name=UserId,Value=sv1'); NR=$(cs 'Name=Route,Value=GET /bookings')\nok \"4. Chỉ số mới chỉ theo Route, không theo UserId (điểm theo user: ${NU:-?}, theo route: ${NR:-?})\" $([ \"$NU\" = 0 ] && [ \"${NR:-0}\" -ge 1 ] && echo 1)\nAL=$(a cloudwatch describe-alarms --alarm-names labflow-api-5xx --query 'MetricAlarms[0].[MetricName,Statistic,Threshold,Period,EvaluationPeriods,DatapointsToAlarm,TreatMissingData]' --output text | tr '\\t' ' ')\nok \"5. Cảnh báo labflow-api-5xx: Loi5xx Sum ≥ 5, 60 s, 2 trên 3, thiếu dữ liệu = notBreaching — đang: ${AL:-không có}\" $([ \"$AL\" = \"Loi5xx Sum 5.0 60 3 2 notBreaching\" ] && echo 1)\nAA=$(a cloudwatch describe-alarms --alarm-names labflow-api-5xx --query 'MetricAlarms[0].AlarmActions' --output text); OA=$(a cloudwatch describe-alarms --alarm-names labflow-api-5xx --query 'MetricAlarms[0].OKActions' --output text)\nok \"6. Báo cả lúc ALARM lẫn lúc OK về topic labflow-canh-bao\" $([[ $AA == *$TA* ]] && [[ $OA == *$TA* ]] && echo 1)\nQU=$(a sqs get-queue-url --queue-name labflow-hop-thu --query QueueUrl --output text)\n[ -n \"$QU\" ] && a sqs purge-queue --queue-url \"$QU\"\na cloudwatch set-alarm-state --alarm-name labflow-api-5xx --state-value ALARM --state-reason \"bo cham thu duong bao\"; sleep 3\nTH=$([ -n \"$QU\" ] && a sqs receive-message --queue-url \"$QU\" --max-number-of-messages 10 --wait-time-seconds 5 --query 'Messages[].Body' --output json | jq -r '.[]? | fromjson | .NewStateValue' | grep -c ALARM)\na cloudwatch set-alarm-state --alarm-name labflow-api-5xx --state-value OK --state-reason \"bo cham tra lai\"\nok \"7. Thử đường báo: set-alarm-state ALARM ⇒ hộp thư labflow-hop-thu nhận thư ALARM (nhận: ${TH:-0})\" $([ \"${TH:-0}\" -ge 1 ] && echo 1)\nDB=$(a cloudwatch get-dashboard --dashboard-name labflow --query DashboardBody --output text | jq -r '[(.widgets | length >= 2), any(.widgets[]; .properties.stat == \"p99\" and (.properties.metrics | tostring | test(\"DoTre\")))] | all' 2>/dev/null)\nok \"8. Dashboard labflow: ≥ 2 widget, có DoTre p99\" $([ \"$DB\" = true ] && echo 1)\necho \"ĐIỂM: $d/8\"");
const MA_TRUOC = bash("#!/bin/bash\n# Lab 10 — bản VỘI (cái \"chạy được\" đầu tiên): log giữ mãi, log cả token, chỉ số theo từng user, cảnh báo 1 lỗi là kêu, không ai nhận.\nsource ~/vbg-dp/scratchpad/aws/lab/c10/chung10.sh; bat_cli10\na logs create-log-group --log-group-name /labflow/api\nbat_api -e LOG_GROUP=/labflow/api -e STREAM=api-voi -e CHE=0 -e DIM_USER=1\nTA=$(a sns create-topic --name labflow-canh-bao --query TopicArn --output text)\na cloudwatch put-metric-alarm --alarm-name labflow-api-5xx --namespace LabFlow --metric-name Loi5xx --dimensions \"Name=Route,Value=POST /bookings\" \\\n  --statistic Sum --period 60 --evaluation-periods 1 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold --alarm-actions \"$TA\"\ntai 30 0.1 >/dev/null");
const MA_GIAI = bash("#!/bin/bash\n# Lab 10 — LỜI GIẢI (che kín trong bài web).\nsource ~/vbg-dp/scratchpad/aws/lab/c10/chung10.sh; bat_cli10\n# 1. giữ log 14 ngày\na logs put-retention-policy --log-group-name /labflow/api --retention-in-days 14\n# 2–4. chạy lại API: che bí mật, chỉ số chỉ theo Route (requestId đã có sẵn trong mã)\nbat_api -e LOG_GROUP=/labflow/api -e STREAM=api-2 -e CHE=1 -e DIM_USER=0\n# 5–6. cảnh báo 2 trên 3 phút, ≥ 5 lỗi/phút, thiếu dữ liệu = ổn, báo cả lúc hết sự cố\nTA=$(a sns create-topic --name labflow-canh-bao --query TopicArn --output text)\na cloudwatch put-metric-alarm --alarm-name labflow-api-5xx --alarm-description \"POST /bookings 5xx — sổ tay: kiểm DB, xem log theo requestId\" \\\n  --namespace LabFlow --metric-name Loi5xx --dimensions \"Name=Route,Value=POST /bookings\" --statistic Sum --period 60 \\\n  --evaluation-periods 3 --datapoints-to-alarm 2 --threshold 5 --comparison-operator GreaterThanOrEqualToThreshold \\\n  --treat-missing-data notBreaching --alarm-actions \"$TA\" --ok-actions \"$TA\"\n# 7. có người nhận: hàng labflow-hop-thu (đứng thay email/chat), giao raw\nQU=$(a sqs create-queue --queue-name labflow-hop-thu --query QueueUrl --output text)\nQA=$(a sqs get-queue-attributes --queue-url \"$QU\" --attribute-names QueueArn --query Attributes.QueueArn --output text)\na sns subscribe --topic-arn \"$TA\" --protocol sqs --notification-endpoint \"$QA\" --attributes RawMessageDelivery=true >/dev/null\n# 8. dashboard: p99 độ trễ + lỗi 5xx\ncat > $LAM/dash-lab.json <<'E'\n{\"widgets\":[\n {\"type\":\"metric\",\"x\":0,\"y\":0,\"width\":12,\"height\":6,\"properties\":{\"title\":\"p99 độ trễ\",\"region\":\"ap-southeast-1\",\"stat\":\"p99\",\"period\":60,\"metrics\":[[\"LabFlow\",\"DoTre\",\"Route\",\"GET /bookings\"],[\"LabFlow\",\"DoTre\",\"Route\",\"POST /bookings\"]]}},\n {\"type\":\"metric\",\"x\":12,\"y\":0,\"width\":12,\"height\":6,\"properties\":{\"title\":\"5xx mỗi phút\",\"region\":\"ap-southeast-1\",\"stat\":\"Sum\",\"period\":60,\"metrics\":[[\"LabFlow\",\"Loi5xx\",\"Route\",\"POST /bookings\"]]}}]}\nE\na cloudwatch put-dashboard --dashboard-name labflow --dashboard-body file:///aws/dash-lab.json >/dev/null");
const MA_DON = bash("#!/bin/bash\n# Lab 10 — DỌN: cảnh báo, dashboard, log group, topic, hàng đợi, ứng dụng.\nsource ~/vbg-dp/scratchpad/aws/lab/c10/chung10.sh; bat_cli10\na cloudwatch delete-alarms --alarm-names labflow-api-5xx\na cloudwatch delete-dashboards --dashboard-names labflow\na logs delete-log-group --log-group-name /labflow/api\na sns delete-topic --topic-arn arn:aws:sns:ap-southeast-1:000000000000:labflow-canh-bao\nQU=$(a sqs get-queue-url --queue-name labflow-hop-thu --query QueueUrl --output text); [ -n \"$QU\" ] && a sqs delete-queue --queue-url \"$QU\"\ndocker rm -f aws-c10-api aws-c10-kho >/dev/null 2>&1; true");
const MA_CONGI = bash("#!/bin/bash\n# Lab 10 — còn gì đang tính tiền? (trên AWS: cảnh báo 0,10 USD/tháng mỗi cái, dashboard 3 USD/tháng, log tính theo GB)\nsource ~/vbg-dp/scratchpad/aws/lab/c10/chung10.sh; bat_cli10\necho \"cảnh báo:  $(a cloudwatch describe-alarms --alarm-name-prefix labflow --query 'length(MetricAlarms)')\"\necho \"dashboard: $(a cloudwatch list-dashboards --dashboard-name-prefix labflow --query 'length(DashboardEntries)')\"\necho \"log group: $(a logs describe-log-groups --log-group-name-prefix /labflow --query 'length(logGroups)')\"\necho \"topic SNS: $(a sns list-topics --query 'length(Topics[?contains(TopicArn, `labflow`)])')\"\necho \"hàng SQS:  $(a sqs list-queues --queue-name-prefix labflow --query 'length(QueueUrls || `[]`)')\"");
const GIA_LOG_10 = "7.29";
const GIA_LUU_10 = "0.15";
/* ═════ 10.1 — CloudWatch Logs ═════ */
const MA_LOG = js(`// app/api.cjs (excerpt) — one JSON line per event, batched to CloudWatch Logs every second
const BI_MAT = new Set(['authorization', 'cookie', 'password', 'matKhau', 'token']);
const che = (o) => (o && typeof o === 'object'
  ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, BI_MAT.has(k) ? '[ĐÃ CHE]' : che(v)]))
  : o);
let hang = [];
function log(level, msg, f = {}) {
  const dong = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...(CHE ? che(f) : f) });
  process.stdout.write(dong + '\\n');                 // what "docker logs" / ECS awslogs would ship
  hang.push({ timestamp: Date.now(), message: dong });
}
setInterval(async () => {                              // the job of the awslogs driver / CloudWatch agent
  const lo = hang; hang = [];
  if (lo.length) await logs.send(new PutLogEventsCommand({ logGroupName: GROUP, logStreamName: STREAM, logEvents: lo }));
}, 1000);`);
const MA_INSIGHTS = bash(`# Logs Insights queries you will actually type at work
fields @timestamp, route, status, ms, requestId
| filter status >= 500
| sort @timestamp desc
| limit 20

stats count(*) as soLan, avg(ms) as tbMs, pct(ms, 99) as p99 by route, status

filter requestId = "8c2efb0b-e610-4020-bb9c-2bdeb8492d7e"     # one request, every line it wrote`);
const MA_PATTERN = bash(`ERROR                      # lines containing the word ERROR (case-sensitive)
"db timeout"               # an exact phrase
?ERROR ?WARN               # either word
{ $.status >= 500 }        # JSON field compare — only works if the line IS JSON
{ $.level = "error" && $.route = "POST /bookings" }`);
const L101_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 1</span>
<h2>10.1 — CloudWatch Logs and Logs Insights: where your API's story is written down</h2>
<p class="lead">On a VPS you run <code>docker logs</code> and scroll. That stops working the day you have three containers behind a load balancer, or a Lambda that ran 40,000 times last night, or a container that crashed and took its logs with it. <strong>Amazon CloudWatch Logs</strong> is the place every AWS service — and your own code — writes its lines to, so they survive the machine, can be searched across machines, and can turn into numbers and alarms. This lesson ships real JSON logs from the LabFlow API, searches them, counts them, prices them, and shows the one mistake that turns a log into a data breach.</p>

<h3>The picture: the logbook of a hospital ward</h3>
<p>Every nurse writes what happened, with the time, in one shared book per ward (<strong>log group</strong>); each nurse has her own page (<strong>log stream</strong>); each entry is one line (<strong>log event</strong>). The book is kept for a fixed number of days, then shredded (<strong>retention</strong>). When something goes wrong at 3 a.m., the doctor does not read every page — he searches "bed 12" (<strong>filter</strong>, <strong>Logs Insights</strong>). And nobody writes a patient's bank PIN in the logbook, because many people read it.</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Log group</strong> — one per application/component, e.g. <code>/labflow/api</code>, <code>/aws/lambda/labflow-thumb</code>, <code>/ecs/labflow</code>. Retention, encryption (KMS), permissions and subscriptions are set here.</li>
  <li><strong>Log stream</strong> — one per source: one container task, one Lambda execution environment, one EC2 instance.</li>
  <li><strong>Log event</strong> — a timestamp plus a message of up to 1 MB. Ingestion is billed per GB.</li>
  <li><strong>Retention</strong> — 1 day to 10 years, or <strong>Never expire, which is the default</strong>. Logs nobody will read after two weeks are still billed every month forever.</li>
  <li><strong>Log class</strong> — <em>Standard</em> (everything) or <em>Infrequent Access</em> (about half the ingest price, but no metric filters, no live tail, no subscriptions).</li>
  <li>How lines get in: Lambda and API Gateway write automatically; ECS uses the <code>awslogs</code> log driver; EC2 needs the CloudWatch agent; your code can call <code>PutLogEvents</code> directly — which is what our mini API does, so you can see the mechanism.</li>
</ul>

<h3>See it running (1): a log group keeps logs forever unless you say otherwise</h3>
${OUT_101_NHOM}
<ul>
  <li><code>giuNgay: null</code> right after creation means <strong>Never expire</strong>. Lambda creates its log group this way the first time it runs, so every function you ever tested still bills storage unless you set retention.</li>
  <li>Pick retention from a reason: 14–30 days for debugging an API; longer only for logs that are evidence (audit, payments), and those often belong in S3 with a lifecycle rule (Lesson 2.5).</li>
  <li>Set it in Terraform (Chapter 11) together with the group, not by hand afterwards — otherwise the first deploy creates a "forever" group again.</li>
</ul>

<h3>See it running (2): the API ships structured JSON lines</h3>
<p>The API writes every request as one JSON object, then sends the batch once a second — exactly what the ECS <code>awslogs</code> driver does with a container's stdout:</p>
${MA_LOG}
${OUT_101_GUI}
<ul>
  <li>Every line has the same fields: <code>ts</code>, <code>level</code>, <code>msg</code>, <code>route</code>, <code>status</code>, <code>ms</code>, and a <strong><code>requestId</code></strong>. The error line and the request line of one failing request share the same <code>requestId</code> — that is how you follow one user's request through the noise.</li>
  <li>Return the <code>requestId</code> to the client too (the API sends it in the <code>x-request-id</code> header and in the error body). When a user reports "booking failed", support asks for that id and you find the exact lines in seconds.</li>
  <li>Why JSON and not free text: CloudWatch (and every log tool) can then filter on <code>status &gt;= 500</code> or average <code>ms</code> without fragile regular expressions. Free text like <em>"booking failed for A101 after 300ms"</em> is pleasant to read and painful to query.</li>
</ul>

<h3>See it running (3): search — filter patterns</h3>
<p>Filter patterns are the quick search built into <code>filter-log-events</code>, metric filters and subscriptions:</p>
${MA_PATTERN}
${OUT_101_LOC}
<ul>
  <li>Honest note about the lab: LocalStack 4.12 accepts the pattern but <strong>ignores it</strong> and returns every line (we also tried Moto: it handles plain words but not JSON patterns). So the same condition is shown with <code>jq</code> over the exact lines we downloaded — that is the result AWS returns.</li>
  <li>Both lines of each failed request match, because both carry <code>status: 503</code>. That is often what you want: the error message and the request summary side by side.</li>
  <li>Patterns are case-sensitive (<code>ERROR</code> does not match <code>error</code>), and a JSON pattern silently matches nothing on a line that is not valid JSON — another reason to log JSON everywhere.</li>
</ul>

<h3>See it running (4): Logs Insights — SQL-like questions over your logs</h3>
${MA_INSIGHTS}
${OUT_101_INSIGHTS}
<ul>
  <li>Logs Insights discovers JSON fields automatically: <code>route</code>, <code>status</code>, <code>ms</code> became columns without any schema.</li>
  <li>The table answers a real question in one line: <em>"failures take 300 ms and successes 13 ms"</em> ⇒ the errors are timeouts to the database, not slow code.</li>
  <li>LocalStack only returns <code>@ptr</code> pointers; the table above is the same aggregation done by <code>jq</code> on the same lines. On AWS you also get <code>pct(ms, 99)</code> (percentiles — Lesson 10.2) and <strong>Live Tail</strong> (watch lines arrive in real time).</li>
  <li>Insights is billed per GB <strong>scanned</strong> (0.007 USD/GB in Singapore): always narrow the time range and the log groups before you run a query on months of data.</li>
</ul>

<h3>The hacker's angle: the log that became a password database</h3>
<p>The quickest debugging trick — "log the whole request" — is also how passwords end up in plain text:</p>
${OUT_101_LO}
${OUT_101_CHE}
<ul>
  <li><strong>Real incident — Facebook, 2019.</strong> Facebook confirmed in March 2019 that internal logs had stored passwords of hundreds of millions of users in plain text for years; KrebsOnSecurity's source estimated 200–600 million accounts, searchable by more than 20,000 employees. In 2024 the Irish Data Protection Commission fined Meta 91 million euros for it. Nobody "hacked" anything: an application simply logged what it received.</li>
  <li>Anyone with <code>logs:GetLogEvents</code> or <code>logs:FilterLogEvents</code> — developers, a monitoring SaaS, a contractor, an attacker holding a leaked key (Lesson 1.7) — reads whatever you logged. Treat a log group as a database that many people can query.</li>
  <li>Defence, in order: (1) never log request bodies or headers wholesale — log chosen fields; (2) redact a deny-list of keys (<code>authorization</code>, <code>cookie</code>, <code>password</code>, <code>token</code>) in the logger itself, as the fixed version does; (3) on AWS add a <strong>data protection policy</strong> to the log group, which detects and masks e-mail addresses, card numbers and keys at ingestion (LocalStack does not implement it — the error above); (4) restrict <code>logs:Unmask</code> and read access with IAM; (5) encrypt the group with a KMS key.</li>
  <li>The token in the log was a placeholder here. In real life, rotate any secret that ever reached a log — deleting the line does not un-read it.</li>
</ul>

<h3>At work: "the booking API failed for a customer at 14:02"</h3>
<p>Ask for the <code>x-request-id</code> from the error page (or the time and the account). Run one Insights query filtered on that <code>requestId</code>; you see the request line, the error line, and — once tracing is on (Lesson 10.4) — the <code>traceId</code> that shows which downstream call was slow. On the cuongthai.com VPS the same question means SSH, <code>docker logs --since</code>, and grep across containers; that is the gap CloudWatch Logs closes.</p>

<h3>Cost — ingestion, not storage, is the bill</h3>
${OUT_101_GIA}
<ul>
  <li>The line size is measured from the real log above. Ingestion (0.70 USD/GB) dwarfs storage (0.03 USD/GB-month, measured after compression, so in practice even less).</li>
  <li>Cheapest log line is the one you do not write: drop health-check lines (our API skips <code>/health</code>), log successful requests at a sample rate if traffic is huge, keep debug level off in production.</li>
  <li>Logs that must exist but are rarely read ⇒ Infrequent Access class, or export to S3.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"How do you find why one request failed in production?"</strong> — Correlation id: every log line carries a <code>requestId</code> returned to the client; structured JSON logs; one Logs Insights query on that id; then the trace for the slow hop.</li>
  <li><strong>"Why structured logging?"</strong> — Machines query fields, not sentences: filter on <code>status</code>, aggregate <code>ms</code>, build metrics from logs without regex.</li>
  <li><strong>"What must never be in logs?"</strong> — Passwords, tokens, session cookies, full card numbers, secrets; personal data only if needed, masked. Redact in the logger, plus data protection policy, plus least-privilege read access.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Write a Logs Insights query that returns, per route, the number of requests and the share of 5xx errors in percent, sorted worst first. Then run the same logic with <code>jq</code> on <code>log-api.jsonl</code> from the lab.</p>
<p><strong>Done when:</strong> your result shows <code>GET /bookings</code> and <code>POST /bookings</code> each with 10 requests and 20% errors for the run above.</p>
${giai('Hint', bash(`stats count(*) as soLan, sum(status >= 500) * 100 / count(*) as phanTramLoi by route
| sort phanTramLoi desc

jq -s 'map(select(.msg == "request")) | group_by(.route)
  | map({route: .[0].route, soLan: length, phanTramLoi: (map(select(.status >= 500)) | length) * 100 / length})' log-api.jsonl`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Log group / stream / event</b><span>Book per app / page per source / one timestamped line.</span></div>
  <div><b>Retention</b><span>How long events are kept; default Never expire.</span></div>
  <div><b>Structured log</b><span>Each line is a JSON object with fixed fields.</span></div>
  <div><b>Correlation id</b><span>An id (requestId) on every line of one request, also returned to the client.</span></div>
  <div><b>Filter pattern</b><span>Quick match syntax: words, phrases, JSON field comparisons.</span></div>
  <div><b>Logs Insights</b><span>Query language over logs: fields, filter, stats, sort; billed per GB scanned.</span></div>
  <div><b>Live Tail</b><span>Watch new log events arrive in real time.</span></div>
  <div><b>Data protection policy</b><span>Detects and masks sensitive data in a log group at ingestion.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Group per app, stream per source; set retention on day one (default is forever).</li>
  <li>Log JSON with a requestId; return the id to the client.</li>
  <li>Filter patterns for quick search, Logs Insights for questions; narrow the time range.</li>
  <li>Never log bodies or auth headers; redact in code, mask with data protection, restrict read access.</li>
  <li>The bill is mostly ingestion: log less, not just keep less.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://aws.amazon.com/builders-library/instrumenting-distributed-systems-for-operational-visibility/', '🔦', "Amazon Builders' Library — Instrumenting distributed systems for operational visibility", 'What Amazon puts in every request log line, and why.')}
${tl('https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html', '🔎', 'CloudWatch Logs Insights query syntax', 'Every command (fields, filter, stats, parse, pattern) with examples.')}

<h3>Sources</h3>
<ul>
  <li>Log groups, streams, retention: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/Working-with-log-groups-and-streams.html</a> · concepts: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html" target="_blank" rel="noopener">…/CloudWatchLogsConcepts.html</a></li>
  <li>Filter pattern syntax: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/FilterAndPatternSyntax.html</a></li>
  <li>Log classes: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/CloudWatch_Logs_Log_Classes.html</a> · Live Tail: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_LiveTail.html" target="_blank" rel="noopener">…/CloudWatchLogs_LiveTail.html</a></li>
  <li>Masking sensitive data: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/mask-sensitive-log-data.html</a></li>
  <li>ECS awslogs driver: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/using_awslogs.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a> (figures above: Price List API, Singapore, November 2026)</li>
  <li>Facebook passwords in logs, 2019: <a href="https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/" target="_blank" rel="noopener">krebsonsecurity.com</a> · <a href="https://about.fb.com/news/2019/03/keeping-passwords-secure/" target="_blank" rel="noopener">about.fb.com</a> · fine 2024: <a href="https://www.dataprotection.ie/en/news-media/press-releases/DPC-announces-91-million-fine-of-Meta" target="_blank" rel="noopener">dataprotection.ie</a></li>
</ul>
</div>
`;
const L101_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 1</span>
<h2>10.1 — CloudWatch Logs và Logs Insights: nơi câu chuyện của API được ghi lại</h2>
<p class="lead">Trên VPS bạn gõ <code>docker logs</code> rồi cuộn. Cách đó hết dùng được vào ngày bạn có ba container sau một load balancer, hay một hàm Lambda chạy 40.000 lần đêm qua, hay một container chết và mang theo log của nó. <strong>Amazon CloudWatch Logs</strong> là nơi mọi dịch vụ AWS — và mã của bạn — ghi từng dòng vào, để log sống lâu hơn cái máy, tìm được xuyên nhiều máy, và biến được thành con số, thành cảnh báo. Bài này gửi log JSON thật từ API LabFlow, tìm trong đó, đếm, tính tiền, và chỉ ra một lỗi khiến log biến thành vụ lộ dữ liệu.</p>

<h3>Hình dung: sổ giao ca của một khoa bệnh viện</h3>
<p>Mỗi y tá ghi việc đã xảy ra, kèm giờ, vào một cuốn sổ chung của khoa (<strong>log group</strong>); mỗi y tá có trang riêng (<strong>log stream</strong>); mỗi mục là một dòng (<strong>log event</strong>). Sổ được giữ một số ngày nhất định rồi huỷ (<strong>retention</strong>). Khi có chuyện lúc 3 giờ sáng, bác sĩ không đọc từng trang — ông tìm "giường 12" (<strong>filter</strong>, <strong>Logs Insights</strong>). Và không ai ghi mã PIN ngân hàng của bệnh nhân vào sổ giao ca, vì rất nhiều người đọc nó.</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Log group</strong> — mỗi ứng dụng/thành phần một nhóm, ví dụ <code>/labflow/api</code>, <code>/aws/lambda/labflow-thumb</code>, <code>/ecs/labflow</code>. Thời gian giữ, mã hoá (KMS), quyền và subscription đặt ở đây.</li>
  <li><strong>Log stream</strong> — mỗi nguồn một luồng: một task container, một môi trường chạy Lambda, một máy EC2.</li>
  <li><strong>Log event</strong> — một mốc giờ cộng một thông điệp tối đa 1 MB. Tiền nạp log tính theo GB.</li>
  <li><strong>Retention</strong> — từ 1 ngày tới 10 năm, hoặc <strong>Never expire — và đó là MẶC ĐỊNH</strong>. Log không ai đọc sau hai tuần vẫn bị tính tiền lưu mỗi tháng, mãi mãi.</li>
  <li><strong>Lớp log</strong> — <em>Standard</em> (đủ mọi tính năng) hoặc <em>Infrequent Access</em> (giá nạp khoảng một nửa, nhưng không có metric filter, live tail, subscription).</li>
  <li>Dòng log vào bằng cách nào: Lambda và API Gateway tự ghi; ECS dùng log driver <code>awslogs</code>; EC2 cần CloudWatch agent; mã của bạn có thể tự gọi <code>PutLogEvents</code> — API thu nhỏ của ta làm đúng như vậy để bạn thấy được cơ chế.</li>
</ul>

<h3>Xem chạy thật (1): log group giữ log mãi mãi nếu bạn không nói gì</h3>
${OUT_101_NHOM}
<ul>
  <li><code>giuNgay: null</code> ngay sau khi tạo nghĩa là <strong>Never expire</strong>. Lambda tự tạo log group theo kiểu này ở lần chạy đầu, nên mọi hàm bạn từng thử vẫn đang tính tiền lưu nếu chưa đặt retention.</li>
  <li>Chọn thời gian giữ theo lý do: 14–30 ngày để gỡ lỗi API; dài hơn chỉ cho log là bằng chứng (kiểm toán, thanh toán) — mà loại đó thường nên nằm ở S3 với luật vòng đời (bài 2.5).</li>
  <li>Đặt retention trong Terraform (Chương 11) cùng lúc tạo nhóm, đừng bấm tay sau — không thì lần deploy đầu lại tạo ra một nhóm "giữ mãi".</li>
</ul>

<h3>Xem chạy thật (2): API gửi đi từng dòng JSON có cấu trúc</h3>
<p>API ghi mỗi yêu cầu thành một đối tượng JSON rồi gửi cả lô mỗi giây — đúng việc log driver <code>awslogs</code> của ECS làm với stdout của container:</p>
${MA_LOG}
${OUT_101_GUI}
<ul>
  <li>Dòng nào cũng có cùng các trường: <code>ts</code>, <code>level</code>, <code>msg</code>, <code>route</code>, <code>status</code>, <code>ms</code>, và một <strong><code>requestId</code></strong>. Dòng lỗi và dòng tóm tắt của cùng một yêu cầu hỏng mang chung <code>requestId</code> — nhờ đó bạn lần theo đúng yêu cầu của một người giữa cả rừng log.</li>
  <li>Trả <code>requestId</code> về cho phía khách nữa (API gửi nó trong header <code>x-request-id</code> và trong thân lỗi). Khi người dùng báo "đặt phòng lỗi", bộ phận hỗ trợ xin mã đó và bạn tìm ra đúng các dòng trong vài giây.</li>
  <li>Vì sao JSON mà không phải chữ tự do: CloudWatch (và mọi công cụ log) lọc được <code>status &gt;= 500</code> hay tính trung bình <code>ms</code> mà không cần biểu thức chính quy dễ gãy. Câu chữ như <em>"booking failed for A101 after 300ms"</em> đọc thì dễ chịu, truy vấn thì khổ.</li>
</ul>

<h3>Xem chạy thật (3): tìm kiếm — filter pattern</h3>
<p>Filter pattern là cú pháp tìm nhanh dùng chung cho <code>filter-log-events</code>, metric filter và subscription:</p>
${MA_PATTERN}
${OUT_101_LOC}
<ul>
  <li>Nói thật về phòng lab: LocalStack 4.12 nhận pattern nhưng <strong>bỏ qua nó</strong> và trả về mọi dòng (đã thử cả Moto: lọc được từ đơn, không lọc được pattern JSON). Vì vậy cùng điều kiện được chạy bằng <code>jq</code> trên đúng các dòng vừa tải về — đó là kết quả AWS sẽ trả.</li>
  <li>Cả hai dòng của mỗi yêu cầu hỏng đều khớp, vì cả hai mang <code>status: 503</code>. Thường đó là điều bạn muốn: thông báo lỗi và dòng tóm tắt nằm cạnh nhau.</li>
  <li>Pattern phân biệt hoa thường (<code>ERROR</code> không khớp <code>error</code>), và pattern JSON lặng lẽ không khớp gì trên dòng không phải JSON hợp lệ — thêm một lý do để log JSON ở mọi nơi.</li>
</ul>

<h3>Xem chạy thật (4): Logs Insights — đặt câu hỏi kiểu SQL cho log</h3>
${MA_INSIGHTS}
${OUT_101_INSIGHTS}
<ul>
  <li>Logs Insights tự nhận ra các trường JSON: <code>route</code>, <code>status</code>, <code>ms</code> thành cột mà không cần khai báo lược đồ.</li>
  <li>Bảng trả lời một câu hỏi thật chỉ bằng một dòng: <em>"yêu cầu hỏng mất 300 ms, yêu cầu tốt 13 ms"</em> ⇒ lỗi là hết giờ chờ cơ sở dữ liệu, không phải mã chạy chậm.</li>
  <li>LocalStack chỉ trả con trỏ <code>@ptr</code>; bảng trên là cùng phép gộp đó do <code>jq</code> tính trên cùng các dòng. Trên AWS bạn còn có <code>pct(ms, 99)</code> (phân vị — bài 10.2) và <strong>Live Tail</strong> (xem dòng log đổ về theo thời gian thực).</li>
  <li>Insights tính tiền theo GB <strong>quét</strong> (0,007 USD/GB ở Singapore): luôn thu hẹp khoảng thời gian và số log group trước khi chạy truy vấn trên nhiều tháng dữ liệu.</li>
</ul>

<h3>Góc hacker: cuốn sổ log trở thành kho mật khẩu</h3>
<p>Mẹo gỡ lỗi nhanh nhất — "log nguyên cả yêu cầu" — cũng chính là đường mật khẩu rơi vào log dạng chữ thường:</p>
${OUT_101_LO}
${OUT_101_CHE}
<ul>
  <li><strong>Sự cố thật — Facebook, 2019.</strong> Tháng 3/2019 Facebook xác nhận log nội bộ đã lưu mật khẩu của hàng trăm triệu người dùng dạng chữ thường trong nhiều năm; nguồn tin của KrebsOnSecurity ước tính 200–600 triệu tài khoản, hơn 20.000 nhân viên tìm kiếm được. Năm 2024 Uỷ ban Bảo vệ Dữ liệu Ireland phạt Meta 91 triệu euro vì chuyện này. Không ai "hack" gì cả: ứng dụng chỉ đơn giản log thứ nó nhận được.</li>
  <li>Ai có quyền <code>logs:GetLogEvents</code> hay <code>logs:FilterLogEvents</code> — lập trình viên, một dịch vụ giám sát bên ngoài, nhà thầu, kẻ tấn công cầm khoá bị lộ (bài 1.7) — đều đọc được mọi thứ bạn đã log. Hãy coi log group như một cơ sở dữ liệu mà nhiều người truy vấn được.</li>
  <li>Cách phòng, theo thứ tự: (1) không bao giờ log nguyên thân yêu cầu hay header — chỉ log trường đã chọn; (2) che một danh sách khoá cấm (<code>authorization</code>, <code>cookie</code>, <code>password</code>, <code>token</code>) ngay trong bộ ghi log, như bản sửa đã làm; (3) trên AWS gắn <strong>data protection policy</strong> cho log group — nó phát hiện và che địa chỉ email, số thẻ, khoá ngay lúc nạp (LocalStack chưa làm — lỗi ở trên); (4) siết quyền đọc và quyền <code>logs:Unmask</code> bằng IAM; (5) mã hoá nhóm bằng khoá KMS.</li>
  <li>Token trong log ở đây là chỗ giữ. Ngoài đời, bí mật nào từng lọt vào log thì phải xoay — xoá dòng log không làm người đã đọc quên được.</li>
</ul>

<h3>Đi làm: "API đặt phòng lỗi với một khách lúc 14:02"</h3>
<p>Xin <code>x-request-id</code> trên trang lỗi (hoặc giờ và tài khoản). Chạy một truy vấn Insights lọc theo <code>requestId</code> đó; bạn thấy dòng yêu cầu, dòng lỗi, và — khi đã bật truy vết (bài 10.4) — <code>traceId</code> chỉ ra lời gọi phía sau nào chậm. Trên VPS của cuongthai.com, cùng câu hỏi ấy nghĩa là SSH vào máy, <code>docker logs --since</code>, rồi grep qua từng container; CloudWatch Logs lấp đúng khoảng trống đó.</p>

<h3>Tiền — nạp log mới là hoá đơn, không phải lưu</h3>
${OUT_101_GIA}
<ul>
  <li>Cỡ dòng đo từ log thật ở trên. Tiền nạp (0,70 USD/GB) lớn hơn hẳn tiền lưu (0,03 USD/GB-tháng, tính sau khi nén, nên thực tế còn ít hơn).</li>
  <li>Dòng log rẻ nhất là dòng bạn không viết: bỏ dòng kiểm sức khoẻ (API của ta bỏ qua <code>/health</code>), lấy mẫu dòng yêu cầu thành công khi lưu lượng rất lớn, tắt mức debug ở production.</li>
  <li>Log phải có nhưng hiếm khi đọc ⇒ lớp Infrequent Access, hoặc xuất sang S3.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Làm sao tìm ra vì sao một yêu cầu lỗi trên production?"</strong> — Mã tương quan: mọi dòng log mang <code>requestId</code> và mã đó được trả về cho khách; log JSON có cấu trúc; một truy vấn Logs Insights theo mã đó; rồi mở trace để thấy chặng chậm.</li>
  <li><strong>"Vì sao log có cấu trúc?"</strong> — Máy truy vấn trường, không truy vấn câu văn: lọc theo <code>status</code>, gộp <code>ms</code>, dựng chỉ số từ log mà không cần regex.</li>
  <li><strong>"Thứ gì không bao giờ được có trong log?"</strong> — Mật khẩu, token, cookie phiên, số thẻ đầy đủ, bí mật; dữ liệu cá nhân chỉ khi cần và phải che. Che trong bộ ghi log, thêm data protection policy, thêm quyền đọc tối thiểu.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Viết một truy vấn Logs Insights trả về, theo từng route, số yêu cầu và tỉ lệ lỗi 5xx tính bằng phần trăm, xếp route tệ nhất lên đầu. Rồi chạy cùng logic bằng <code>jq</code> trên tệp <code>log-api.jsonl</code> của lab.</p>
<p><strong>Đạt khi:</strong> với lượt chạy ở trên, kết quả cho <code>GET /bookings</code> và <code>POST /bookings</code> mỗi route 10 yêu cầu, lỗi 20%.</p>
${giai('Gợi ý', bash(`stats count(*) as soLan, sum(status >= 500) * 100 / count(*) as phanTramLoi by route
| sort phanTramLoi desc

jq -s 'map(select(.msg == "request")) | group_by(.route)
  | map({route: .[0].route, soLan: length, phanTramLoi: (map(select(.status >= 500)) | length) * 100 / length})' log-api.jsonl`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Log group / stream / event</b><span>Sổ cho mỗi ứng dụng / trang cho mỗi nguồn / một dòng có mốc giờ.</span></div>
  <div><b>Retention</b><span>Giữ log bao lâu; mặc định Never expire.</span></div>
  <div><b>Log có cấu trúc</b><span>Mỗi dòng là một đối tượng JSON với các trường cố định.</span></div>
  <div><b>Mã tương quan</b><span>Một mã (requestId) có trên mọi dòng của một yêu cầu, cũng trả về cho khách.</span></div>
  <div><b>Filter pattern</b><span>Cú pháp khớp nhanh: từ, cụm từ, so sánh trường JSON.</span></div>
  <div><b>Logs Insights</b><span>Ngôn ngữ truy vấn log: fields, filter, stats, sort; tính tiền theo GB quét.</span></div>
  <div><b>Live Tail</b><span>Xem dòng log mới đổ về theo thời gian thực.</span></div>
  <div><b>Data protection policy</b><span>Phát hiện và che dữ liệu nhạy cảm của log group ngay lúc nạp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mỗi ứng dụng một group, mỗi nguồn một stream; đặt retention từ ngày đầu (mặc định là mãi mãi).</li>
  <li>Log JSON có requestId; trả mã đó về cho khách.</li>
  <li>Filter pattern để tìm nhanh, Logs Insights để đặt câu hỏi; thu hẹp khoảng thời gian.</li>
  <li>Không log thân yêu cầu hay header xác thực; che trong mã, che bằng data protection, siết quyền đọc.</li>
  <li>Hoá đơn chủ yếu là tiền nạp: log ít đi, không chỉ giữ ngắn đi.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://aws.amazon.com/builders-library/instrumenting-distributed-systems-for-operational-visibility/', '🔦', "Amazon Builders' Library — Instrumenting distributed systems for operational visibility", 'Amazon ghi gì vào mỗi dòng log của một yêu cầu, và vì sao.')}
${tl('https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html', '🔎', 'Cú pháp truy vấn CloudWatch Logs Insights', 'Mọi lệnh (fields, filter, stats, parse, pattern) kèm ví dụ.')}

<h3>Nguồn</h3>
<ul>
  <li>Log group, stream, retention: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/Working-with-log-groups-and-streams.html</a> · khái niệm: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogsConcepts.html" target="_blank" rel="noopener">…/CloudWatchLogsConcepts.html</a></li>
  <li>Cú pháp filter pattern: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/FilterAndPatternSyntax.html</a></li>
  <li>Lớp log: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/CloudWatch_Logs_Log_Classes.html</a> · Live Tail: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatchLogs_LiveTail.html" target="_blank" rel="noopener">…/CloudWatchLogs_LiveTail.html</a></li>
  <li>Che dữ liệu nhạy cảm: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/mask-sensitive-log-data.html</a></li>
  <li>Log driver awslogs của ECS: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/using_awslogs.html</a></li>
  <li>Bảng giá: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a> (số ở trên: Price List API, Singapore, tháng 11/2026)</li>
  <li>Facebook lưu mật khẩu trong log, 2019: <a href="https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/" target="_blank" rel="noopener">krebsonsecurity.com</a> · <a href="https://about.fb.com/news/2019/03/keeping-passwords-secure/" target="_blank" rel="noopener">about.fb.com</a> · án phạt 2024: <a href="https://www.dataprotection.ie/en/news-media/press-releases/DPC-announces-91-million-fine-of-Meta" target="_blank" rel="noopener">dataprotection.ie</a></li>
</ul>
</div>
`;
/* ═════ 10.2 — Metrics ═════ */
const MA_PUT = js(`// app/api.cjs (excerpt) — one PutMetricData call per second, many samples per call
data.push({ MetricName: 'DoTre', Unit: 'Milliseconds',
            Dimensions: [{ Name: 'Route', Value: route }],          // "GET /bookings", never "/bookings/8812"
            Values: ms, Counts: ms.map(() => 1) });                  // up to 150 distinct values per call
data.push({ MetricName: 'Loi5xx', Unit: 'Count', Dimensions: [{ Name: 'Route', Value: route }], Value: loi });
await cw.send(new PutMetricDataCommand({ Namespace: 'LabFlow', MetricData: data }));`);
const MA_EMF = json(`{
  "_aws": {
    "Timestamp": 1795144458302,
    "CloudWatchMetrics": [{ "Namespace": "LabFlow", "Dimensions": [["Route"]],
                            "Metrics": [{ "Name": "DoTre", "Unit": "Milliseconds" }] }]
  },
  "Route": "GET /bookings",
  "DoTre": 13,
  "requestId": "4282f4f2-5515-4389-9034-511db20396eb"
}`);
const L102_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 2</span>
<h2>10.2 — Metrics, custom metrics and dashboards: numbers you can watch</h2>
<p class="lead">Logs tell you what happened to one request. <strong>Metrics</strong> tell you how the whole system is doing, as numbers over time: requests per minute, errors per minute, latency. CloudWatch collects hundreds of them for free from AWS services, and lets you publish your own. This lesson publishes LabFlow's latency and error metrics for real, shows why the average latency lies, how one innocent dimension multiplies the bill, and builds the dashboard you will open every morning.</p>

<h3>The picture: the dashboard of a car</h3>
<p>You do not read the engine's logbook while driving; you glance at a few needles — speed, fuel, temperature. Each needle is a <strong>metric</strong>; the car samples it every moment (<strong>datapoints</strong>), and you see a value over a short window (<strong>period</strong> + <strong>statistic</strong>). The fuel needle of <em>this</em> car is a different metric from the one of your neighbour's car — that difference is a <strong>dimension</strong>.</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Namespace</strong> — a folder: <code>AWS/EC2</code>, <code>AWS/ApplicationELB</code>, <code>AWS/RDS</code>, <code>AWS/Lambda</code>, <code>AWS/SQS</code>… and your own, e.g. <code>LabFlow</code>.</li>
  <li><strong>Metric</strong> = namespace + name + <strong>set of dimensions</strong>. <code>DoTre{Route=GET /bookings}</code> and <code>DoTre{Route=POST /bookings}</code> are two separate metrics, billed separately.</li>
  <li><strong>Datapoint</strong> — a value with a timestamp and unit. You can send many samples in one call (<code>Values</code> + <code>Counts</code>).</li>
  <li><strong>Statistic</strong> over a <strong>period</strong> — <code>Sum</code>, <code>Average</code>, <code>Minimum</code>, <code>Maximum</code>, <code>SampleCount</code>, and percentiles <code>p50</code>, <code>p90</code>, <code>p99</code>.</li>
  <li><strong>Resolution</strong> — standard (1 minute) or high resolution (down to 1 second, costs more). EC2 basic monitoring is every 5 minutes for free; "detailed monitoring" (1 minute) is paid.</li>
  <li><strong>Retention is automatic</strong>: 1-minute data for 15 days, 5-minute for 63 days, 1-hour for 455 days (15 months). You cannot delete a metric; it disappears when no data arrives for 15 months.</li>
</ul>

<h3>Metrics you get for free — and the one you do not</h3>
<table>
  <thead><tr><th>Service</th><th>Watch first</th></tr></thead>
  <tbody>
    <tr><td>ALB</td><td><code>RequestCount</code>, <code>HTTPCode_Target_5XX_Count</code>, <code>TargetResponseTime</code>, <code>HealthyHostCount</code></td></tr>
    <tr><td>ECS / Fargate</td><td><code>CPUUtilization</code>, <code>MemoryUtilization</code> per service</td></tr>
    <tr><td>RDS</td><td><code>CPUUtilization</code>, <code>FreeStorageSpace</code>, <code>DatabaseConnections</code>, <code>ReplicaLag</code></td></tr>
    <tr><td>Lambda</td><td><code>Invocations</code>, <code>Errors</code>, <code>Duration</code>, <code>Throttles</code></td></tr>
    <tr><td>SQS</td><td><code>ApproximateNumberOfMessagesVisible</code>, <code>ApproximateAgeOfOldestMessage</code></td></tr>
    <tr><td>EC2</td><td><code>CPUUtilization</code>, <code>StatusCheckFailed</code> — but <strong>no memory and no disk usage</strong>: those live inside the OS and need the CloudWatch agent</td></tr>
  </tbody>
</table>
<p>A classic exam and interview trap: "the EC2 instance ran out of memory but CloudWatch showed nothing" — because memory is not a default EC2 metric.</p>

<h3>See it running (1): publish latency and errors from the API</h3>
${MA_PUT}
${OUT_102_TB}
<ul>
  <li>95 fast requests and 5 that hit an 800 ms query. The route <code>GET /bookings</code> got 51 samples: <strong>average 59.8 ms, maximum 802 ms</strong>.</li>
  <li>The average describes no real user: almost everybody saw ~13 ms, a few saw 800 ms. Nobody saw 60.</li>
  <li>CloudWatch answers this with percentiles. LocalStack fails on <code>--extended-statistics</code> (the error above); AWS returns p50/p99 normally. So we compute them from the same samples:</li>
</ul>
${OUT_102_PV}
<ul>
  <li><strong>p50 = 13 ms</strong> (the typical user), <strong>p90 = 15 ms</strong>, <strong>p99 = 801 ms</strong> (1 user in 100). If LabFlow serves 50 bookings per minute, one person every two minutes waits almost a second — the average would never tell you.</li>
  <li>Rule: alarm and report on <strong>p99 (or p95) latency</strong>, not the average. Use <code>Maximum</code> only for "did anything ever exceed X".</li>
</ul>

<h3>See it running (2): one dimension too many — the cardinality bill</h3>
${OUT_102_CARDINALITY}
${OUT_102_GIA}
<ul>
  <li>Adding <code>UserId</code> as a dimension turned 4 metrics into 32 for only 7 users: 2 names × 2 routes × 7 users + the original 4. At 10,000 users that is 40,000 metrics — about <strong>6,000 USD per month</strong>, for numbers nobody will chart.</li>
  <li>Dimensions must have a <strong>small, fixed set of values</strong>: route template, status class, region, environment. Per-user, per-request, per-booking ids belong in logs (searchable with Logs Insights), not in metrics.</li>
  <li>That is also why the API normalises <code>/bookings/8812</code> to <code>/bookings/:id</code> before using the path as a dimension.</li>
</ul>

<h3>The hacker's angle: a dimension the attacker controls (scenario)</h3>
<p>Suppose an API used the raw URL path as the <code>Route</code> dimension. Anyone can then request <code>/bookings/1</code>, <code>/bookings/2</code>, … <code>/bookings/100000</code>, and each unique path becomes a new metric at 0.30 USD per month — a "denial of wallet" attack that needs no exploit, just a loop. The same applies to user-agent strings, tenant names typed by users, or error messages used as dimensions. Defence: build dimensions only from an allow-list or a normalised template, cap distinct values in code, and put a budget alarm on CloudWatch spend (Lesson 0.1). This is a constructed scenario to show the mechanism, not a named incident.</p>

<h3>See it running (3): a dashboard as code</h3>
${OUT_102_DASH}
<ul>
  <li>A dashboard is just JSON (<code>put-dashboard</code>): widgets with positions, metrics and statistics. Keep it in the repository and deploy it with Terraform, so it is reviewed like code and recreated with the environment.</li>
  <li>What goes on the first screen — Google's "four golden signals": <strong>latency</strong> (p99), <strong>traffic</strong> (requests/min), <strong>errors</strong> (5xx/min), <strong>saturation</strong> (CPU, memory, DB connections, queue age).</li>
  <li>The text widget links the runbook: whoever opens the dashboard at 3 a.m. should know what to do next.</li>
</ul>

<h3>Embedded Metric Format: metrics written as log lines</h3>
<p>Instead of calling <code>PutMetricData</code>, Lambda and container code can print one JSON line in <strong>Embedded Metric Format</strong>; CloudWatch Logs extracts the metric automatically and keeps the line (with its <code>requestId</code>) searchable:</p>
${MA_EMF}
<p>No extra API calls, no extra latency in the request — and the metric and its context arrive together. LocalStack does not extract EMF, so the lab uses <code>PutMetricData</code>.</p>

<h3>At work: "the dashboard is green but customers say it is slow"</h3>
<p>Check which statistic the latency widget uses. If it shows <code>Average</code>, switch to <code>p99</code> and split by route — usually one route or one dependency is slow for a small share of users. Then jump to logs for that route and time window (Lesson 10.1) and to traces for the slow hop (Lesson 10.4).</p>

<h3>Cost</h3>
<ul>
  <li>Custom metrics: 0.30 USD per metric per month for the first 10,000 (Singapore), cheaper above. Free tier: 10 custom metrics, 3 dashboards, 1 million API requests per month.</li>
  <li>Dashboards: 3 USD each per month beyond the free three. <code>GetMetricData</code>: 0.01 USD per 1,000 metrics requested — a dashboard left open with auto-refresh is not free.</li>
  <li>AWS service metrics (ALB, RDS, Lambda…) at the default resolution: free.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"Why p99 and not average latency?"</strong> — Average mixes fast and slow requests into a number nobody experienced; p99 shows the tail users actually feel (here: average 59.8 ms, typical 13 ms, tail 801 ms).</li>
  <li><strong>"What is a dimension and what should not be one?"</strong> — A name/value pair that makes a separate metric; never high-cardinality values like user id or request id.</li>
  <li><strong>"Where is EC2 memory in CloudWatch?"</strong> — Not there by default; install the CloudWatch agent to publish memory and disk.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Add a third widget to <code>dash.json</code>: traffic — <code>SampleCount</code> of <code>DoTre</code> per route per minute (each request is one sample). Publish it and print the widget titles with <code>get-dashboard</code>.</p>
<p><strong>Done when:</strong> <code>get-dashboard</code> lists four widgets and the new one uses <code>"stat": "SampleCount"</code>.</p>
${giai('Hint', json(`{"type":"metric","x":0,"y":8,"width":24,"height":6,"properties":{"title":"Yêu cầu mỗi phút","region":"ap-southeast-1",
 "stat":"SampleCount","period":60,
 "metrics":[["LabFlow","DoTre","Route","GET /bookings"],["LabFlow","DoTre","Route","POST /bookings"]]}}`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Namespace</b><span>Folder of metrics: AWS/… or your own.</span></div>
  <div><b>Dimension</b><span>Name/value pair; each distinct set is a separate metric.</span></div>
  <div><b>Period / statistic</b><span>Time bucket / how datapoints in it are combined.</span></div>
  <div><b>Percentile (p99)</b><span>99% of samples are at or below this value.</span></div>
  <div><b>Cardinality</b><span>Number of distinct dimension values — drives metric count and cost.</span></div>
  <div><b>High resolution</b><span>Datapoints down to 1 second; costs more.</span></div>
  <div><b>EMF</b><span>Embedded Metric Format: a JSON log line from which CloudWatch extracts metrics.</span></div>
  <div><b>Golden signals</b><span>Latency, traffic, errors, saturation.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A metric is namespace + name + dimensions; every distinct dimension set is billed.</li>
  <li>Report latency as p99, not average.</li>
  <li>Dimensions: low cardinality only; ids go to logs.</li>
  <li>EC2 memory/disk need the CloudWatch agent.</li>
  <li>Dashboards as JSON in the repo; first screen = four golden signals.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://sre.google/sre-book/monitoring-distributed-systems/', '📈', 'Google SRE Book — Monitoring distributed systems', 'The four golden signals, and why the tail matters.')}
${tl('https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html', '🧾', 'CloudWatch Embedded Metric Format', 'Specification and client libraries for Node.js and Java.')}

<h3>Sources</h3>
<ul>
  <li>Concepts (namespace, dimension, resolution, retention): <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/cloudwatch_concepts.html</a></li>
  <li>Statistics and percentiles: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/Statistics-definitions.html</a></li>
  <li>Metrics by AWS service: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/aws-services-cloudwatch-metrics.html</a> · agent metrics (memory, disk): <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html" target="_blank" rel="noopener">…/metrics-collected-by-CloudWatch-agent.html</a></li>
  <li>Dashboards: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/CloudWatch_Dashboards.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a> (Price List API, Singapore, November 2026)</li>
</ul>
</div>
`;
const L102_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 2</span>
<h2>10.2 — Chỉ số, chỉ số tự định nghĩa và dashboard: những con số để canh</h2>
<p class="lead">Log kể chuyện đã xảy ra với một yêu cầu. <strong>Chỉ số (metric)</strong> kể cả hệ thống đang ra sao, bằng con số theo thời gian: số yêu cầu mỗi phút, số lỗi mỗi phút, độ trễ. CloudWatch thu sẵn hàng trăm chỉ số miễn phí từ các dịch vụ AWS, và cho bạn đẩy chỉ số của riêng mình. Bài này đẩy thật chỉ số độ trễ và lỗi của LabFlow, chỉ ra vì sao độ trễ trung bình nói dối, vì sao một dimension vô hại nhân hoá đơn lên nhiều lần, và dựng dashboard bạn sẽ mở mỗi sáng.</p>

<h3>Hình dung: bảng đồng hồ của ô tô</h3>
<p>Lúc lái, bạn không đọc sổ nhật ký động cơ; bạn liếc vài chiếc kim — tốc độ, xăng, nhiệt độ. Mỗi chiếc kim là một <strong>chỉ số</strong>; xe đo nó liên tục (<strong>datapoint</strong>), và bạn thấy một giá trị trong một khoảng ngắn (<strong>period</strong> + <strong>statistic</strong>). Kim xăng của <em>xe này</em> là một chỉ số khác với kim xăng của xe hàng xóm — chỗ khác nhau đó là <strong>dimension</strong>.</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Namespace</strong> — một thư mục: <code>AWS/EC2</code>, <code>AWS/ApplicationELB</code>, <code>AWS/RDS</code>, <code>AWS/Lambda</code>, <code>AWS/SQS</code>… và của riêng bạn, ví dụ <code>LabFlow</code>.</li>
  <li><strong>Chỉ số</strong> = namespace + tên + <strong>bộ dimension</strong>. <code>DoTre{Route=GET /bookings}</code> và <code>DoTre{Route=POST /bookings}</code> là hai chỉ số riêng, tính tiền riêng.</li>
  <li><strong>Datapoint</strong> — một giá trị kèm mốc giờ và đơn vị. Một lần gọi gửi được nhiều mẫu (<code>Values</code> + <code>Counts</code>).</li>
  <li><strong>Statistic</strong> trên một <strong>period</strong> — <code>Sum</code>, <code>Average</code>, <code>Minimum</code>, <code>Maximum</code>, <code>SampleCount</code>, và phân vị <code>p50</code>, <code>p90</code>, <code>p99</code>.</li>
  <li><strong>Độ phân giải</strong> — chuẩn (1 phút) hoặc độ phân giải cao (tới 1 giây, đắt hơn). EC2 giám sát cơ bản 5 phút một lần, miễn phí; "detailed monitoring" (1 phút) mất tiền.</li>
  <li><strong>Thời gian giữ tự động</strong>: dữ liệu 1 phút giữ 15 ngày, 5 phút giữ 63 ngày, 1 giờ giữ 455 ngày (15 tháng). Không xoá được chỉ số; nó tự biến mất khi 15 tháng không có dữ liệu mới.</li>
</ul>

<h3>Chỉ số có sẵn miễn phí — và thứ không có</h3>
<table>
  <thead><tr><th>Dịch vụ</th><th>Canh trước tiên</th></tr></thead>
  <tbody>
    <tr><td>ALB</td><td><code>RequestCount</code>, <code>HTTPCode_Target_5XX_Count</code>, <code>TargetResponseTime</code>, <code>HealthyHostCount</code></td></tr>
    <tr><td>ECS / Fargate</td><td><code>CPUUtilization</code>, <code>MemoryUtilization</code> theo service</td></tr>
    <tr><td>RDS</td><td><code>CPUUtilization</code>, <code>FreeStorageSpace</code>, <code>DatabaseConnections</code>, <code>ReplicaLag</code></td></tr>
    <tr><td>Lambda</td><td><code>Invocations</code>, <code>Errors</code>, <code>Duration</code>, <code>Throttles</code></td></tr>
    <tr><td>SQS</td><td><code>ApproximateNumberOfMessagesVisible</code>, <code>ApproximateAgeOfOldestMessage</code></td></tr>
    <tr><td>EC2</td><td><code>CPUUtilization</code>, <code>StatusCheckFailed</code> — nhưng <strong>không có bộ nhớ và dung lượng đĩa</strong>: chúng nằm trong hệ điều hành, phải cài CloudWatch agent</td></tr>
  </tbody>
</table>
<p>Bẫy kinh điển trong đề thi và phỏng vấn: "máy EC2 hết RAM mà CloudWatch không thấy gì" — vì bộ nhớ không phải chỉ số mặc định của EC2.</p>

<h3>Xem chạy thật (1): đẩy độ trễ và lỗi từ API</h3>
${MA_PUT}
${OUT_102_TB}
<ul>
  <li>95 yêu cầu nhanh và 5 yêu cầu chạm phải truy vấn 800 ms. Route <code>GET /bookings</code> có 51 mẫu: <strong>trung bình 59,8 ms, lớn nhất 802 ms</strong>.</li>
  <li>Con số trung bình không tả ai cả: gần như mọi người thấy ~13 ms, vài người thấy 800 ms. Không ai thấy 60.</li>
  <li>CloudWatch trả lời chuyện này bằng phân vị. LocalStack lỗi với <code>--extended-statistics</code> (lỗi ở trên); AWS trả p50/p99 bình thường. Vì vậy ta tính phân vị từ chính các mẫu đó:</li>
</ul>
${OUT_102_PV}
<ul>
  <li><strong>p50 = 13 ms</strong> (người dùng điển hình), <strong>p90 = 15 ms</strong>, <strong>p99 = 801 ms</strong> (1 người trong 100). Nếu LabFlow nhận 50 lượt đặt phòng mỗi phút, cứ hai phút lại có một người chờ gần một giây — con số trung bình không bao giờ nói cho bạn biết.</li>
  <li>Luật: cảnh báo và báo cáo theo <strong>độ trễ p99 (hoặc p95)</strong>, không theo trung bình. <code>Maximum</code> chỉ dùng cho câu "có lúc nào vượt X không".</li>
</ul>

<h3>Xem chạy thật (2): thừa một dimension — hoá đơn cardinality</h3>
${OUT_102_CARDINALITY}
${OUT_102_GIA}
<ul>
  <li>Thêm dimension <code>UserId</code> biến 4 chỉ số thành 32 chỉ với 7 người dùng: 2 tên × 2 route × 7 người + 4 chỉ số cũ. Với 10.000 người dùng là 40.000 chỉ số — khoảng <strong>6.000 USD mỗi tháng</strong>, cho những con số không ai vẽ biểu đồ.</li>
  <li>Dimension phải có <strong>tập giá trị nhỏ và cố định</strong>: mẫu route, nhóm mã trạng thái, region, môi trường. Mã theo người dùng, theo yêu cầu, theo lượt đặt phòng thuộc về log (tìm bằng Logs Insights), không thuộc về chỉ số.</li>
  <li>Đó cũng là lý do API chuẩn hoá <code>/bookings/8812</code> thành <code>/bookings/:id</code> trước khi dùng đường dẫn làm dimension.</li>
</ul>

<h3>Góc hacker: dimension do kẻ tấn công điều khiển (kịch bản)</h3>
<p>Giả sử một API dùng nguyên đường dẫn URL làm dimension <code>Route</code>. Khi đó ai cũng có thể gọi <code>/bookings/1</code>, <code>/bookings/2</code>, … <code>/bookings/100000</code>, và mỗi đường dẫn khác nhau thành một chỉ số mới giá 0,30 USD mỗi tháng — kiểu tấn công "denial of wallet" không cần lỗ hổng nào, chỉ cần một vòng lặp. Chuyện tương tự xảy ra với chuỗi user-agent, tên tổ chức do người dùng gõ, hay thông báo lỗi bị đem làm dimension. Cách phòng: chỉ dựng dimension từ danh sách cho phép hoặc mẫu đã chuẩn hoá, chặn số giá trị khác nhau ngay trong mã, và đặt cảnh báo ngân sách cho tiền CloudWatch (bài 0.1). Đây là kịch bản dựng ra để thấy cơ chế, không phải một sự cố có tên.</p>

<h3>Xem chạy thật (3): dashboard dưới dạng mã</h3>
${OUT_102_DASH}
<ul>
  <li>Dashboard chỉ là JSON (<code>put-dashboard</code>): các widget có vị trí, chỉ số và statistic. Giữ nó trong kho mã và triển khai bằng Terraform, để nó được review như mã và dựng lại cùng môi trường.</li>
  <li>Màn hình đầu tiên nên có gì — "bốn tín hiệu vàng" của Google: <strong>độ trễ</strong> (p99), <strong>lưu lượng</strong> (yêu cầu/phút), <strong>lỗi</strong> (5xx/phút), <strong>độ bão hoà</strong> (CPU, bộ nhớ, số kết nối DB, tuổi tin trong hàng đợi).</li>
  <li>Widget chữ trỏ tới sổ tay xử lý sự cố: ai mở dashboard lúc 3 giờ sáng cũng phải biết bước tiếp theo.</li>
</ul>

<h3>Embedded Metric Format: chỉ số viết dưới dạng dòng log</h3>
<p>Thay vì gọi <code>PutMetricData</code>, mã chạy trong Lambda và container có thể in một dòng JSON theo <strong>Embedded Metric Format</strong>; CloudWatch Logs tự tách chỉ số ra và vẫn giữ dòng log (kèm <code>requestId</code>) để tìm kiếm:</p>
${MA_EMF}
<p>Không thêm lời gọi API, không thêm độ trễ cho yêu cầu — và chỉ số đến cùng ngữ cảnh của nó. LocalStack không tách EMF, nên lab dùng <code>PutMetricData</code>.</p>

<h3>Đi làm: "dashboard xanh mà khách vẫn kêu chậm"</h3>
<p>Xem widget độ trễ đang dùng statistic nào. Nếu là <code>Average</code>, đổi sang <code>p99</code> và tách theo route — thường chỉ một route hay một dịch vụ phía sau chậm với một phần nhỏ người dùng. Sau đó nhảy sang log của route đó trong đúng khung giờ (bài 10.1) và sang trace để thấy chặng chậm (bài 10.4).</p>

<h3>Tiền</h3>
<ul>
  <li>Chỉ số tự định nghĩa: 0,30 USD mỗi chỉ số mỗi tháng cho 10.000 chỉ số đầu (Singapore), rẻ dần sau đó. Free tier: 10 chỉ số tự định nghĩa, 3 dashboard, 1 triệu yêu cầu API mỗi tháng.</li>
  <li>Dashboard: 3 USD mỗi cái mỗi tháng sau ba cái miễn phí. <code>GetMetricData</code>: 0,01 USD mỗi 1.000 chỉ số được hỏi — dashboard để mở tự làm mới không phải là miễn phí.</li>
  <li>Chỉ số của dịch vụ AWS (ALB, RDS, Lambda…) ở độ phân giải mặc định: miễn phí.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Vì sao dùng p99 mà không dùng độ trễ trung bình?"</strong> — Trung bình trộn yêu cầu nhanh và chậm thành một con số không ai trải qua; p99 cho thấy phần đuôi người dùng thật sự cảm nhận (ở đây: trung bình 59,8 ms, điển hình 13 ms, đuôi 801 ms).</li>
  <li><strong>"Dimension là gì, thứ gì không được làm dimension?"</strong> — Một cặp tên/giá trị tạo ra một chỉ số riêng; không bao giờ dùng giá trị cardinality cao như mã người dùng hay mã yêu cầu.</li>
  <li><strong>"Bộ nhớ EC2 nằm đâu trong CloudWatch?"</strong> — Mặc định không có; cài CloudWatch agent để đẩy bộ nhớ và đĩa.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Thêm widget thứ ba vào <code>dash.json</code>: lưu lượng — <code>SampleCount</code> của <code>DoTre</code> theo từng route mỗi phút (mỗi yêu cầu là một mẫu). Đẩy lên rồi in tiêu đề các widget bằng <code>get-dashboard</code>.</p>
<p><strong>Đạt khi:</strong> <code>get-dashboard</code> liệt kê bốn widget và widget mới dùng <code>"stat": "SampleCount"</code>.</p>
${giai('Gợi ý', json(`{"type":"metric","x":0,"y":8,"width":24,"height":6,"properties":{"title":"Yêu cầu mỗi phút","region":"ap-southeast-1",
 "stat":"SampleCount","period":60,
 "metrics":[["LabFlow","DoTre","Route","GET /bookings"],["LabFlow","DoTre","Route","POST /bookings"]]}}`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Namespace</b><span>Thư mục chỉ số: AWS/… hoặc của bạn.</span></div>
  <div><b>Dimension</b><span>Cặp tên/giá trị; mỗi bộ khác nhau là một chỉ số riêng.</span></div>
  <div><b>Period / statistic</b><span>Khoảng thời gian gom / cách gộp các datapoint trong đó.</span></div>
  <div><b>Phân vị (p99)</b><span>99% số mẫu bằng hoặc nhỏ hơn giá trị này.</span></div>
  <div><b>Cardinality</b><span>Số giá trị dimension khác nhau — quyết định số chỉ số và tiền.</span></div>
  <div><b>Độ phân giải cao</b><span>Datapoint tới mức 1 giây; đắt hơn.</span></div>
  <div><b>EMF</b><span>Embedded Metric Format: dòng log JSON mà CloudWatch tách ra thành chỉ số.</span></div>
  <div><b>Tín hiệu vàng</b><span>Độ trễ, lưu lượng, lỗi, độ bão hoà.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chỉ số = namespace + tên + dimension; mỗi bộ dimension khác nhau đều tính tiền.</li>
  <li>Báo cáo độ trễ bằng p99, không bằng trung bình.</li>
  <li>Dimension: chỉ cardinality thấp; các loại mã để ở log.</li>
  <li>Bộ nhớ/đĩa EC2 cần CloudWatch agent.</li>
  <li>Dashboard là JSON trong kho mã; màn hình đầu = bốn tín hiệu vàng.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://sre.google/sre-book/monitoring-distributed-systems/', '📈', 'Google SRE Book — Monitoring distributed systems', 'Bốn tín hiệu vàng, và vì sao phần đuôi quan trọng.')}
${tl('https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html', '🧾', 'CloudWatch Embedded Metric Format', 'Đặc tả và thư viện cho Node.js, Java.')}

<h3>Nguồn</h3>
<ul>
  <li>Khái niệm (namespace, dimension, độ phân giải, thời gian giữ): <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/cloudwatch_concepts.html</a></li>
  <li>Statistic và phân vị: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Statistics-definitions.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/Statistics-definitions.html</a></li>
  <li>Chỉ số theo dịch vụ AWS: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/aws-services-cloudwatch-metrics.html</a> · chỉ số của agent (bộ nhớ, đĩa): <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html" target="_blank" rel="noopener">…/metrics-collected-by-CloudWatch-agent.html</a></li>
  <li>Dashboard: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/CloudWatch_Dashboards.html</a></li>
  <li>Bảng giá: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a> (Price List API, Singapore, tháng 11/2026)</li>
</ul>
</div>
`;
/* ═════ 10.3 — Alarms ═════ */
const MA_THONGBAO = json(`{
  "AlarmName": "api-5xx",
  "AlarmDescription": "POST /bookings trả 5xx — xem sổ tay bài 10.3",
  "NewStateValue": "ALARM",
  "NewStateReason": "Threshold Crossed: 1 datapoint [10.0 (20/11/26 03:27:00)] was greater than or equal to the threshold (5.0).",
  "OldStateValue": "OK",
  "Trigger": { "MetricName": "Loi5xx", "Namespace": "LabFlow", "Statistic": "SUM", "Period": 60,
               "EvaluationPeriods": 1, "ComparisonOperator": "GreaterThanOrEqualToThreshold", "Threshold": 5.0 }
}`);
const L103_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 3</span>
<h2>10.3 — Alarms that matter, routed to SNS: being woken up for the right reason</h2>
<p class="lead">A dashboard only helps when somebody is looking at it. An <strong>alarm</strong> watches one metric for you and changes state when it crosses a threshold; the state change is published to <strong>SNS</strong>, which delivers it to e-mail, chat or a pager. This lesson runs the full path for real — errors start, the alarm fires, a message arrives, errors stop, the "all clear" arrives — and then the harder part: alarming on what users feel, without crying wolf.</p>

<h3>The picture: a smoke detector, not a thermometer</h3>
<p>A thermometer shows the temperature; you have to look. A smoke detector stays silent until there is smoke, then it shouts — and a good one does not shout every time you make toast. An alarm is the smoke detector: one condition, a delay before deciding (<strong>evaluation periods</strong>), and a loud, routed voice (<strong>actions</strong>). It also needs a test button (<code>set-alarm-state</code>).</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Three states</strong>: <code>OK</code>, <code>ALARM</code>, <code>INSUFFICIENT_DATA</code> (just created, or no datapoints).</li>
  <li><strong>Condition</strong> — metric + statistic + period + comparison + threshold: "<code>Sum</code> of <code>Loi5xx</code> over 60 s ≥ 5".</li>
  <li><strong>M out of N</strong> — <code>evaluation-periods</code> N and <code>datapoints-to-alarm</code> M: "2 of the last 3 minutes were bad". This is the main tool against noise.</li>
  <li><strong>Missing data</strong> — <code>treat-missing-data</code>: <code>missing</code> (default), <code>notBreaching</code> (no data = fine, right for error counts that are only sent when errors exist), <code>breaching</code> (no data = bad, right for a heartbeat), <code>ignore</code>.</li>
  <li><strong>Actions</strong> — per state: <code>alarm-actions</code>, <code>ok-actions</code>, <code>insufficient-data-actions</code>. Targets: SNS topic (most common), Auto Scaling policy (Lesson 5.2), EC2 action (stop/reboot/recover), Systems Manager.</li>
  <li><strong>Composite alarm</strong> — combines alarms with <code>AND</code>/<code>OR</code>/<code>NOT</code>; <strong>anomaly detection</strong> — a learned band instead of a fixed threshold; <strong>billing alarm</strong> — <code>AWS/Billing EstimatedCharges</code>, only in us-east-1.</li>
</ul>

<h3>See it running (1): errors start, the alarm fires, the "all clear" arrives</h3>
<p>An SQS queue <code>labflow-hop-thu</code> stands in for an e-mail inbox, so you can read exactly what SNS delivers:</p>
${OUT_103_DUONGBAO}
<ul>
  <li><strong>Right after creation</strong> the alarm went to <code>OK</code>: no errors yet, and <code>notBreaching</code> treats "no data" as healthy. With the default <code>missing</code> it would sit in <code>INSUFFICIENT_DATA</code>, which people learn to ignore.</li>
  <li>20 failing requests (10 on <code>POST /bookings</code>) ⇒ the next one-minute evaluation saw <code>Sum = 10 ≥ 5</code> ⇒ <code>ALARM</code>, and the topic delivered the message within a second.</li>
  <li>After recovery the alarm returned to <code>OK</code> and <strong>also sent a message</strong>, because the alarm has <code>ok-actions</code>. Without it, the on-call person never knows whether the problem is over.</li>
  <li>Detection is not instant: metric period + evaluation schedule ⇒ about 1–2 minutes here. That delay is part of your recovery time — choose periods accordingly.</li>
</ul>
<p>On AWS the message has this shape — values from this run, reason text in AWS's format (LocalStack's <code>NewStateReason</code> is shorter):</p>
${MA_THONGBAO}

<h3>See it running (2): press the test button</h3>
${OUT_103_THU}
<ul>
  <li><code>set-alarm-state</code> forces a state for one cycle, so the whole delivery path — topic, subscription, e-mail filter, chat webhook — is tested <em>before</em> a real incident. Many teams discover during their first outage that the e-mail went to someone who left.</li>
  <li>The billing alarm is created in <code>us-east-1</code> on the <code>AWS/Billing</code> namespace after you enable "Receive Billing Alerts". It complements AWS Budgets from Lesson 0.1 (Budgets can also forecast; the billing alarm is a plain threshold).</li>
</ul>

<h3>See it running (3): "2 out of 3" — and an honest emulator gap</h3>
${OUT_103_MTRONGN}
<ul>
  <li>One slow request each minute, threshold 500 ms on <code>Maximum</code>. On AWS, <code>datapoints-to-alarm 2</code> would fire after the <strong>second</strong> bad minute. LocalStack stayed <code>OK</code> until the <strong>third</strong>: it ignores <code>datapoints-to-alarm</code> and requires all N. Remember the AWS rule; the lab only shows that evaluation really runs every period.</li>
  <li>In production use <code>p99</code> here (Lesson 10.2), not <code>Maximum</code> — one slow request out of thousands should not page anyone.</li>
</ul>
${OUT_103_GHEP}
<ul>
  <li>A composite alarm pages only when <em>both</em> errors and latency are bad; the two child alarms can stay without actions (or notify a low-priority channel). LocalStack stores the rule but does not evaluate it (<code>INSUFFICIENT_DATA</code>); on AWS it follows its children.</li>
</ul>

<h3>Which alarms are worth having</h3>
<table>
  <thead><tr><th>Alarm on</th><th>Why</th><th>Typical condition</th></tr></thead>
  <tbody>
    <tr><td>5xx rate of the API (ALB <code>HTTPCode_Target_5XX_Count</code> or your metric)</td><td>users are failing</td><td>≥ 1% of requests, 3 of 5 minutes</td></tr>
    <tr><td>p99 latency</td><td>users are waiting</td><td>&gt; 1 s, 3 of 5 minutes</td></tr>
    <tr><td><code>HealthyHostCount</code> &lt; desired</td><td>capacity lost</td><td>&lt; 2 for 2 minutes</td></tr>
    <tr><td>DLQ <code>ApproximateNumberOfMessagesVisible</code> &gt; 0</td><td>work silently lost (Lesson 9.1)</td><td>&gt; 0 for 1 period</td></tr>
    <tr><td>RDS <code>FreeStorageSpace</code></td><td>disk full stops the database</td><td>&lt; 10% of size</td></tr>
    <tr><td>Billing / Budgets</td><td>leaked key, runaway loop</td><td>forecast &gt; budget</td></tr>
  </tbody>
</table>
<p>Prefer symptoms users feel (errors, latency) over causes (CPU 80%). High CPU with happy users is not an emergency; a cause alarm belongs on a dashboard or a low-priority channel.</p>

<h3>Real incident: 97 warnings that nobody read (Knight Capital, 1 August 2012)</h3>
<p>Before the market opened on 1 August 2012, Knight Capital's trading system sent <strong>97 automated e-mails</strong> to a group of staff about an error ("Power Peg disabled"). According to the US SEC's order, those e-mails were not designed as alerts and nobody acted on them. When trading started, a server still running old code sent millions of orders; in about 45 minutes Knight lost more than 460 million USD and needed a rescue. The signals existed; they were just not alarms — no threshold, no owner, no page.</p>
<p>The lesson for your alarms: every alarm must have an <strong>owner</strong>, a <strong>clear text</strong> (what is wrong, link to the runbook), and a <strong>route</strong> someone actually watches. A notification everybody has learned to ignore is worse than none, because it creates the illusion of monitoring.</p>

<h3>The hacker's angle: alarms as a security sensor</h3>
<ul>
  <li>Attackers with a leaked key usually do loud things: hundreds of instances, unusual regions, a sudden bill (Lesson 1.7). A Budgets forecast alert and an anomaly alarm on <code>EstimatedCharges</code> are cheap security sensors.</li>
  <li>Metric filters on CloudTrail logs (Lesson 10.4) can count security events — root login, <code>StopLogging</code>, IAM policy changes — and alarm on any occurrence. AWS Security Hub ships these checks as the "CloudWatch" controls.</li>
  <li>Protect the alarm path itself: an attacker who can <code>cloudwatch:DeleteAlarms</code> or <code>sns:Unsubscribe</code> can switch off your smoke detector first. Keep those permissions out of everyday roles.</li>
</ul>

<h3>At work: from the VPS's Telegram bot to SNS</h3>
<p>On cuongthai.com, deploy scripts and checks send messages to a Telegram bot. On AWS the equivalent is SNS: alarms publish to a topic, and a small Lambda subscribed to it forwards to Telegram or Slack (or AWS Chatbot posts to Slack/Teams without code). The difference: the alarm logic, state and history live in CloudWatch, not in a shell script, and the "all clear" comes for free.</p>

<h3>Cost</h3>
<ul>
  <li>Standard alarm: 0.10 USD per month per metric; high-resolution alarm 0.30 USD; composite alarm 0.50 USD (Singapore). Free tier: 10 alarms.</li>
  <li>SNS e-mail: the first 1,000 per month are free; delivery to SQS/Lambda costs only the requests.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"How do you avoid alert fatigue?"</strong> — Alarm on user-facing symptoms; M-of-N evaluation; sensible missing-data handling; composite alarms to page once; every alarm has an owner and a runbook; review and delete alarms nobody acts on.</li>
  <li><strong>"What is treat-missing-data and when is breaching right?"</strong> — How periods without datapoints count; <code>notBreaching</code> for error counters, <code>breaching</code> for heartbeats where silence means death.</li>
  <li><strong>"How do you know your alerting works?"</strong> — Test it: <code>set-alarm-state</code> in a game day, check the message arrives where on-call looks; alarm on the alerting path's own failures.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Create a heartbeat alarm: the API should publish metric <code>LabFlow/NhipTim</code> (value 1) every minute. If no datapoint arrives for 3 minutes, alarm. Choose the statistic, comparison and missing-data setting yourself.</p>
<p><strong>Done when:</strong> with no heartbeat at all the alarm ends in <code>ALARM</code> (not <code>INSUFFICIENT_DATA</code>), and you can explain why <code>treat-missing-data</code> decides it.</p>
${giai('Hint', bash(`aws cloudwatch put-metric-alarm --alarm-name api-nhip-tim --namespace LabFlow --metric-name NhipTim \\
  --statistic SampleCount --period 60 --evaluation-periods 3 --threshold 1 \\
  --comparison-operator LessThanThreshold --treat-missing-data breaching \\
  --alarm-actions "$TA"
# silence = breaching ⇒ 3 empty minutes count as 3 bad datapoints ⇒ ALARM`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>OK / ALARM / INSUFFICIENT_DATA</b><span>The three alarm states.</span></div>
  <div><b>Evaluation periods (N)</b><span>How many recent periods are considered.</span></div>
  <div><b>Datapoints to alarm (M)</b><span>How many of those N must breach.</span></div>
  <div><b>treat-missing-data</b><span>missing / notBreaching / breaching / ignore.</span></div>
  <div><b>Alarm / OK actions</b><span>What to do on entering each state, usually publish to SNS.</span></div>
  <div><b>Composite alarm</b><span>Rule over other alarms (AND/OR/NOT).</span></div>
  <div><b>Anomaly detection</b><span>Learned expected band instead of a fixed threshold.</span></div>
  <div><b>Runbook</b><span>Written steps for whoever receives the alarm.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Alarm = metric + statistic + period + threshold + M-of-N + missing-data rule + actions.</li>
  <li>Send both ALARM and OK to SNS; test the path with set-alarm-state.</li>
  <li>Alarm on symptoms (errors, p99), page once with composites.</li>
  <li>Owner, clear text, runbook link — or it becomes Knight Capital's 97 e-mails.</li>
  <li>Budget and billing alarms are security sensors too.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://sre.google/sre-book/monitoring-distributed-systems/', '🔔', 'Google SRE Book — Monitoring distributed systems', 'Symptoms vs causes, and rules for pages that deserve a human.')}
${tl('https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html', '📉', 'CloudWatch anomaly detection', 'Alarms on a learned band for metrics with daily patterns.')}

<h3>Sources</h3>
<ul>
  <li>Alarms, M-of-N, missing data: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/AlarmThatSendsEmail.html</a></li>
  <li>Composite alarms: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/Create_Composite_Alarm.html</a></li>
  <li>Billing alarm: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/monitor_estimated_charges_with_cloudwatch.html</a></li>
  <li>Security Hub CloudWatch controls: <a href="https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/cloudwatch-controls.html</a></li>
  <li>Knight Capital — SEC administrative proceeding 34-70694 (2013): <a href="https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">sec.gov/…/34-70694.pdf</a> · overview: <a href="https://en.wikipedia.org/wiki/Knight_Capital_Group" target="_blank" rel="noopener">en.wikipedia.org/wiki/Knight_Capital_Group</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a> (Price List API, Singapore, November 2026)</li>
</ul>
</div>
`;
const L103_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 3</span>
<h2>10.3 — Cảnh báo đáng có, gửi qua SNS: bị đánh thức vì đúng lý do</h2>
<p class="lead">Dashboard chỉ có ích khi có người đang nhìn. <strong>Cảnh báo (alarm)</strong> canh một chỉ số thay bạn và đổi trạng thái khi chỉ số vượt ngưỡng; việc đổi trạng thái được đẩy lên <strong>SNS</strong>, rồi SNS giao tới email, chat hay máy nhắn trực. Bài này chạy thật trọn đường đi — lỗi bắt đầu, cảnh báo nổ, thư tới, hết lỗi, thư "đã ổn" tới — rồi tới phần khó hơn: cảnh báo đúng thứ người dùng cảm nhận, mà không kêu "sói đến" vô cớ.</p>

<h3>Hình dung: chuông báo khói, không phải nhiệt kế</h3>
<p>Nhiệt kế cho biết nhiệt độ; bạn phải tự nhìn. Chuông báo khói im lặng cho tới khi có khói, rồi hét lên — và chuông tốt không hét mỗi lần bạn nướng bánh mì. Cảnh báo chính là chuông báo khói: một điều kiện, một khoảng chờ trước khi kết luận (<strong>evaluation periods</strong>), và một tiếng kêu to được chuyển đúng người (<strong>actions</strong>). Nó cũng cần một nút thử (<code>set-alarm-state</code>).</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Ba trạng thái</strong>: <code>OK</code>, <code>ALARM</code>, <code>INSUFFICIENT_DATA</code> (vừa tạo, hoặc không có datapoint).</li>
  <li><strong>Điều kiện</strong> — chỉ số + statistic + period + phép so sánh + ngưỡng: "<code>Sum</code> của <code>Loi5xx</code> trong 60 giây ≥ 5".</li>
  <li><strong>M trong N</strong> — <code>evaluation-periods</code> là N và <code>datapoints-to-alarm</code> là M: "2 trong 3 phút gần nhất xấu". Đây là công cụ chính chống báo động giả.</li>
  <li><strong>Thiếu dữ liệu</strong> — <code>treat-missing-data</code>: <code>missing</code> (mặc định), <code>notBreaching</code> (không có dữ liệu = ổn, đúng cho bộ đếm lỗi chỉ gửi khi có lỗi), <code>breaching</code> (không có dữ liệu = xấu, đúng cho nhịp tim), <code>ignore</code>.</li>
  <li><strong>Actions</strong> — theo từng trạng thái: <code>alarm-actions</code>, <code>ok-actions</code>, <code>insufficient-data-actions</code>. Đích: SNS topic (hay gặp nhất), chính sách Auto Scaling (bài 5.2), hành động EC2 (dừng/khởi động lại/khôi phục), Systems Manager.</li>
  <li><strong>Cảnh báo ghép (composite)</strong> — ghép các cảnh báo bằng <code>AND</code>/<code>OR</code>/<code>NOT</code>; <strong>anomaly detection</strong> — một dải giá trị học từ lịch sử thay cho ngưỡng cố định; <strong>cảnh báo hoá đơn</strong> — <code>AWS/Billing EstimatedCharges</code>, chỉ có ở us-east-1.</li>
</ul>

<h3>Xem chạy thật (1): lỗi bắt đầu, cảnh báo nổ, thư "đã ổn" tới</h3>
<p>Một hàng SQS <code>labflow-hop-thu</code> đứng thay hộp thư email, để bạn đọc đúng thứ SNS giao:</p>
${OUT_103_DUONGBAO}
<ul>
  <li><strong>Ngay sau khi tạo</strong>, cảnh báo về <code>OK</code>: chưa có lỗi, và <code>notBreaching</code> coi "không có dữ liệu" là khoẻ. Với mặc định <code>missing</code>, nó sẽ nằm mãi ở <code>INSUFFICIENT_DATA</code> — trạng thái mà ai rồi cũng quen bỏ qua.</li>
  <li>20 yêu cầu hỏng (10 cái vào <code>POST /bookings</code>) ⇒ lần đánh giá một phút kế tiếp thấy <code>Sum = 10 ≥ 5</code> ⇒ <code>ALARM</code>, và topic giao thư trong chưa tới một giây.</li>
  <li>Hết lỗi, cảnh báo trở về <code>OK</code> và <strong>cũng gửi thư</strong>, vì cảnh báo có <code>ok-actions</code>. Thiếu nó, người trực không bao giờ biết sự cố đã qua chưa.</li>
  <li>Phát hiện không tức thì: period của chỉ số + lịch đánh giá ⇒ ở đây khoảng 1–2 phút. Độ trễ đó là một phần thời gian khôi phục của bạn — chọn period cho phù hợp.</li>
</ul>
<p>Trên AWS, thư có hình dạng như sau — số của lượt chạy này, câu lý do theo định dạng của AWS (<code>NewStateReason</code> của LocalStack ngắn hơn):</p>
${MA_THONGBAO}

<h3>Xem chạy thật (2): bấm nút thử</h3>
${OUT_103_THU}
<ul>
  <li><code>set-alarm-state</code> ép một trạng thái trong một chu kỳ, nhờ đó cả đường giao — topic, subscription, bộ lọc email, webhook chat — được thử <em>trước</em> sự cố thật. Nhiều đội chỉ phát hiện ở lần sự cố đầu tiên rằng email đang gửi tới một người đã nghỉ việc.</li>
  <li>Cảnh báo hoá đơn tạo ở <code>us-east-1</code> trên namespace <code>AWS/Billing</code> sau khi bật "Receive Billing Alerts". Nó bổ sung cho AWS Budgets ở bài 0.1 (Budgets còn dự báo được; cảnh báo hoá đơn chỉ là một ngưỡng thường).</li>
</ul>

<h3>Xem chạy thật (3): "2 trong 3" — và một chỗ giả lập lệch, nói thật</h3>
${OUT_103_MTRONGN}
<ul>
  <li>Mỗi phút một yêu cầu chậm, ngưỡng 500 ms trên <code>Maximum</code>. Trên AWS, <code>datapoints-to-alarm 2</code> sẽ nổ sau phút xấu <strong>thứ hai</strong>. LocalStack giữ <code>OK</code> tới phút <strong>thứ ba</strong>: nó bỏ qua <code>datapoints-to-alarm</code> và đòi đủ cả N. Hãy nhớ luật của AWS; lab chỉ cho thấy việc đánh giá thật sự chạy mỗi chu kỳ.</li>
  <li>Ở production, chỗ này dùng <code>p99</code> (bài 10.2), không dùng <code>Maximum</code> — một yêu cầu chậm giữa hàng nghìn yêu cầu không đáng gọi ai dậy.</li>
</ul>
${OUT_103_GHEP}
<ul>
  <li>Cảnh báo ghép chỉ gọi người khi <em>cả</em> lỗi lẫn độ trễ cùng xấu; hai cảnh báo con có thể không gắn action (hoặc báo vào kênh ít khẩn). LocalStack lưu luật nhưng không đánh giá (<code>INSUFFICIENT_DATA</code>); trên AWS nó đi theo các cảnh báo con.</li>
</ul>

<h3>Cảnh báo nào đáng có</h3>
<table>
  <thead><tr><th>Cảnh báo theo</th><th>Vì sao</th><th>Điều kiện hay dùng</th></tr></thead>
  <tbody>
    <tr><td>Tỉ lệ 5xx của API (ALB <code>HTTPCode_Target_5XX_Count</code> hoặc chỉ số của bạn)</td><td>người dùng đang thất bại</td><td>≥ 1% số yêu cầu, 3 trong 5 phút</td></tr>
    <tr><td>Độ trễ p99</td><td>người dùng đang phải chờ</td><td>&gt; 1 giây, 3 trong 5 phút</td></tr>
    <tr><td><code>HealthyHostCount</code> thấp hơn mong muốn</td><td>mất năng lực phục vụ</td><td>&lt; 2 trong 2 phút</td></tr>
    <tr><td>DLQ <code>ApproximateNumberOfMessagesVisible</code> &gt; 0</td><td>việc bị mất trong im lặng (bài 9.1)</td><td>&gt; 0 trong 1 chu kỳ</td></tr>
    <tr><td>RDS <code>FreeStorageSpace</code></td><td>đầy đĩa là cơ sở dữ liệu dừng</td><td>&lt; 10% dung lượng</td></tr>
    <tr><td>Hoá đơn / Budgets</td><td>lộ khoá, vòng lặp chạy mất kiểm soát</td><td>dự báo &gt; ngân sách</td></tr>
  </tbody>
</table>
<p>Ưu tiên triệu chứng người dùng cảm nhận (lỗi, độ trễ) hơn nguyên nhân (CPU 80%). CPU cao mà người dùng vẫn vui thì không phải chuyện khẩn; cảnh báo theo nguyên nhân nên nằm trên dashboard hoặc kênh ít khẩn.</p>

<h3>Sự cố thật: 97 lời cảnh báo không ai đọc (Knight Capital, 1/8/2012)</h3>
<p>Trước giờ mở cửa thị trường ngày 1/8/2012, hệ thống giao dịch của Knight Capital gửi <strong>97 email tự động</strong> tới một nhóm nhân viên về một lỗi ("Power Peg disabled"). Theo quyết định của Uỷ ban Chứng khoán Mỹ (SEC), các email đó không được thiết kế làm cảnh báo và không ai hành động. Khi phiên giao dịch bắt đầu, một máy chủ còn chạy mã cũ đã gửi đi hàng triệu lệnh; trong khoảng 45 phút Knight mất hơn 460 triệu USD và phải được cứu. Tín hiệu đã có; chúng chỉ không phải là cảnh báo — không ngưỡng, không người chịu trách nhiệm, không ai bị gọi dậy.</p>
<p>Bài học cho cảnh báo của bạn: cảnh báo nào cũng phải có <strong>người chịu trách nhiệm</strong>, <strong>nội dung rõ ràng</strong> (hỏng gì, liên kết tới sổ tay xử lý), và một <strong>đường giao</strong> có người thật sự canh. Một thông báo mà ai cũng đã quen bỏ qua còn tệ hơn không có, vì nó tạo ảo giác là đang giám sát.</p>

<h3>Góc hacker: cảnh báo làm cảm biến an ninh</h3>
<ul>
  <li>Kẻ cầm khoá bị lộ thường làm việc ồn ào: hàng trăm máy, region lạ, hoá đơn tăng vọt (bài 1.7). Cảnh báo dự báo của Budgets và cảnh báo bất thường trên <code>EstimatedCharges</code> là cảm biến an ninh rẻ tiền.</li>
  <li>Metric filter trên log CloudTrail (bài 10.4) đếm được sự kiện an ninh — root đăng nhập, <code>StopLogging</code>, sửa chính sách IAM — và cảnh báo ngay khi có một lần. AWS Security Hub có sẵn các phép kiểm này trong nhóm control "CloudWatch".</li>
  <li>Bảo vệ chính đường cảnh báo: kẻ có quyền <code>cloudwatch:DeleteAlarms</code> hay <code>sns:Unsubscribe</code> có thể tắt chuông báo khói của bạn trước tiên. Đừng để các quyền đó trong role dùng hằng ngày.</li>
</ul>

<h3>Đi làm: từ bot Telegram của VPS sang SNS</h3>
<p>Ở cuongthai.com, script deploy và các phép kiểm gửi tin vào một bot Telegram. Trên AWS, thứ tương đương là SNS: cảnh báo đẩy lên một topic, và một hàm Lambda nhỏ đăng ký topic đó chuyển tiếp sang Telegram hay Slack (hoặc AWS Chatbot đăng lên Slack/Teams mà không cần viết mã). Khác biệt: logic cảnh báo, trạng thái và lịch sử nằm trong CloudWatch, không nằm trong một script shell, và thư "đã ổn" có sẵn không phải làm thêm.</p>

<h3>Tiền</h3>
<ul>
  <li>Cảnh báo chuẩn: 0,10 USD mỗi tháng cho mỗi chỉ số; cảnh báo độ phân giải cao 0,30 USD; cảnh báo ghép 0,50 USD (Singapore). Free tier: 10 cảnh báo.</li>
  <li>Email SNS: 1.000 thư đầu mỗi tháng miễn phí; giao tới SQS/Lambda chỉ tốn tiền yêu cầu.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Làm sao tránh 'mệt mỏi vì cảnh báo'?"</strong> — Cảnh báo theo triệu chứng người dùng thấy; đánh giá M trong N; xử lý thiếu dữ liệu hợp lý; dùng cảnh báo ghép để chỉ gọi một lần; cảnh báo nào cũng có người chịu trách nhiệm và sổ tay; định kỳ xoá cảnh báo không ai hành động.</li>
  <li><strong>"treat-missing-data là gì, khi nào chọn breaching?"</strong> — Cách tính các chu kỳ không có datapoint; <code>notBreaching</code> cho bộ đếm lỗi, <code>breaching</code> cho nhịp tim — nơi im lặng nghĩa là đã chết.</li>
  <li><strong>"Làm sao biết hệ thống cảnh báo của bạn chạy?"</strong> — Thử nó: <code>set-alarm-state</code> trong một buổi diễn tập, kiểm thư tới đúng chỗ người trực nhìn; cảnh báo cả khi chính đường cảnh báo hỏng.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Tạo cảnh báo nhịp tim: API phải đẩy chỉ số <code>LabFlow/NhipTim</code> (giá trị 1) mỗi phút. Nếu 3 phút không có datapoint nào, phải báo động. Tự chọn statistic, phép so sánh và cách xử lý thiếu dữ liệu.</p>
<p><strong>Đạt khi:</strong> khi hoàn toàn không có nhịp tim, cảnh báo kết thúc ở <code>ALARM</code> (không phải <code>INSUFFICIENT_DATA</code>), và bạn giải thích được vì sao <code>treat-missing-data</code> quyết định chuyện đó.</p>
${giai('Gợi ý', bash(`aws cloudwatch put-metric-alarm --alarm-name api-nhip-tim --namespace LabFlow --metric-name NhipTim \\
  --statistic SampleCount --period 60 --evaluation-periods 3 --threshold 1 \\
  --comparison-operator LessThanThreshold --treat-missing-data breaching \\
  --alarm-actions "$TA"
# im lặng = breaching ⇒ 3 phút trống tính là 3 datapoint xấu ⇒ ALARM`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>OK / ALARM / INSUFFICIENT_DATA</b><span>Ba trạng thái của cảnh báo.</span></div>
  <div><b>Evaluation periods (N)</b><span>Xét bao nhiêu chu kỳ gần nhất.</span></div>
  <div><b>Datapoints to alarm (M)</b><span>Bao nhiêu trong N chu kỳ đó phải vượt ngưỡng.</span></div>
  <div><b>treat-missing-data</b><span>missing / notBreaching / breaching / ignore.</span></div>
  <div><b>Alarm / OK actions</b><span>Việc làm khi vào mỗi trạng thái, thường là đẩy lên SNS.</span></div>
  <div><b>Cảnh báo ghép</b><span>Luật dựa trên các cảnh báo khác (AND/OR/NOT).</span></div>
  <div><b>Anomaly detection</b><span>Dải giá trị kỳ vọng học từ lịch sử thay cho ngưỡng cố định.</span></div>
  <div><b>Runbook</b><span>Sổ tay các bước cho người nhận cảnh báo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cảnh báo = chỉ số + statistic + period + ngưỡng + M trong N + luật thiếu dữ liệu + actions.</li>
  <li>Gửi cả ALARM lẫn OK lên SNS; thử đường giao bằng set-alarm-state.</li>
  <li>Cảnh báo theo triệu chứng (lỗi, p99), gọi một lần bằng cảnh báo ghép.</li>
  <li>Người chịu trách nhiệm, nội dung rõ, liên kết sổ tay — không thì thành 97 email của Knight Capital.</li>
  <li>Cảnh báo ngân sách và hoá đơn cũng là cảm biến an ninh.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://sre.google/sre-book/monitoring-distributed-systems/', '🔔', 'Google SRE Book — Monitoring distributed systems', 'Triệu chứng và nguyên nhân, luật cho những lần gọi người đáng gọi.')}
${tl('https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html', '📉', 'CloudWatch anomaly detection', 'Cảnh báo theo dải học được cho chỉ số có nhịp theo ngày.')}

<h3>Nguồn</h3>
<ul>
  <li>Cảnh báo, M trong N, thiếu dữ liệu: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/AlarmThatSendsEmail.html</a></li>
  <li>Cảnh báo ghép: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/Create_Composite_Alarm.html</a></li>
  <li>Cảnh báo hoá đơn: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/monitor_estimated_charges_with_cloudwatch.html</a></li>
  <li>Control "CloudWatch" của Security Hub: <a href="https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/cloudwatch-controls.html</a></li>
  <li>Knight Capital — quyết định hành chính SEC 34-70694 (2013): <a href="https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">sec.gov/…/34-70694.pdf</a> · tổng quan: <a href="https://en.wikipedia.org/wiki/Knight_Capital_Group" target="_blank" rel="noopener">en.wikipedia.org/wiki/Knight_Capital_Group</a></li>
  <li>Bảng giá: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a> (Price List API, Singapore, tháng 11/2026)</li>
</ul>
</div>
`;
/* ═════ 10.4 — Tracing and auditing ═════ */
const MA_SPAN = js(`// app/kho.cjs (excerpt) — auto-instrumentation creates the HTTP spans; one manual span for the query
const tracer = trace.getTracer('kho');
await tracer.startActiveSpan('SELECT rooms WHERE id = $1', async (span) => {
  span.setAttribute('db.system', 'postgresql');
  span.setAttribute('db.statement', 'SELECT * FROM rooms WHERE id = $1');
  await ngu(cham ? 800 : 12);                       // the slow query of this demo
  span.end();
});`);
const MA_TRAIL = json(`{
  "eventVersion": "1.10",
  "userIdentity": { "type": "IAMUser", "userName": "ci-deploy", "accountId": "111122223333",
                    "accessKeyId": "AKIAIOSFODNN7EXAMPLE" },
  "eventTime": "2026-11-20T03:34:15Z",
  "eventSource": "ec2.amazonaws.com",
  "eventName": "DescribeRegions",
  "awsRegion": "ap-southeast-1",
  "sourceIPAddress": "203.0.113.45",
  "userAgent": "aws-cli/2.41.0",
  "requestParameters": { "allRegions": true },
  "readOnly": true,
  "eventType": "AwsApiCall"
}`);
const L104_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 4</span>
<h2>10.4 — Tracing and auditing: X-Ray/OpenTelemetry, CloudTrail and AWS Config</h2>
<p class="lead">Logs say <em>what</em> happened, metrics say <em>how much</em>. Two questions remain. <strong>"Where did the time go inside this one request?"</strong> — that is <strong>distributed tracing</strong> (AWS X-Ray, built on OpenTelemetry). <strong>"Who changed what in the account, and what did it look like before?"</strong> — that is <strong>CloudTrail</strong> (every API call) and <strong>AWS Config</strong> (every configuration). This lesson traces a real slow request across two services, connects the trace to its log line, then maps the three audit tools that the exams love to mix up.</p>

<h3>The picture: tracking a parcel</h3>
<p>A parcel gets one tracking number (<strong>trace id</strong>). Every hub that touches it scans it: arrived at 08:00, left at 08:40 (<strong>span</strong>: name, start, duration). Hubs pass the number on with the parcel (<strong>context propagation</strong>). When the parcel is late, you do not phone every hub — you open the tracking page and see which hub held it for six hours.</p>

<h3>The building blocks of tracing</h3>
<ul>
  <li><strong>Trace</strong> — the whole journey of one request; <strong>span</strong> — one step (an HTTP call, a query), with a parent, a start time, a duration and attributes.</li>
  <li><strong>Context propagation</strong> — the caller sends the trace id and its span id to the next service in the W3C header <code>traceparent: 00-&lt;trace-id&gt;-&lt;span-id&gt;-01</code>. Lose the header and the trace breaks into pieces.</li>
  <li><strong>Instrumentation</strong> — <em>automatic</em> (HTTP servers/clients, database drivers, AWS SDK calls get spans with no code) plus <em>manual</em> spans for your own important steps.</li>
  <li><strong>Sampling</strong> — keeping every trace is expensive; keep a share (e.g. 5%) plus every error. X-Ray's default rule: the first request each second, then 5%.</li>
  <li><strong>On AWS</strong> — your code uses OpenTelemetry; the <strong>AWS Distro for OpenTelemetry (ADOT)</strong> collector (an ECS sidecar, or built into Lambda with "active tracing") sends spans to <strong>X-Ray</strong>, which draws the trace timeline and a <strong>service map</strong>. CloudWatch Application Signals builds latency/error dashboards per service from the same data.</li>
</ul>

<h3>See it running (1): two requests, one is slow</h3>
<p>LocalStack's free edition has no X-Ray, so the spans go to <strong>Jaeger</strong>, an open-source trace store that speaks the same OpenTelemetry protocol. The application code would not change on AWS — only the exporter's endpoint:</p>
${MA_OTEL}
${MA_SPAN}
${OUT_104_HAI}

<h3>See it running (2): the trace shows where the time went</h3>
${OUT_104_THAC}
<ul>
  <li>Read the slow trace top-down: the API's server span took 804 ms; inside it, its client call to the room service took 803 ms; inside that, <strong>the query took 800 ms</strong>. The API code itself used about 1 ms. Without the trace you would be optimising the wrong service.</li>
  <li>The four spans of each trace came from two processes. They belong together only because the API's HTTP client sent <code>traceparent</code> and the room service's HTTP server read it — both done by auto-instrumentation.</li>
  <li>The fast trace has the same shape with an 11 ms query: the shape is the architecture, the durations are the problem.</li>
</ul>

<h3>See it running (3): from a log line to its trace</h3>
${OUT_104_NOI}
<ul>
  <li>The API's logger adds the active <code>traceId</code> to every line. In CloudWatch, a Logs Insights query for that id finds the log lines, and the X-Ray console opens the trace — logs explain <em>what</em>, the trace explains <em>where</em>.</li>
  <li>Propagate the header through queues too: put <code>traceparent</code> in SQS/SNS message attributes (Chapter 9) so the worker's spans join the same trace.</li>
</ul>

<h3>CloudTrail: who called which API</h3>
<p>Every call to an AWS API — console click, CLI, SDK, another service — becomes a CloudTrail <strong>event</strong>. A real one has this shape (placeholder account, key and documentation IP):</p>
${MA_TRAIL}
<ul>
  <li><strong>Event history</strong>: the last 90 days of <em>management</em> events (create, delete, change, describe), free, per region, in the console and <code>lookup-events</code>.</li>
  <li><strong>Trail</strong>: delivers events to an S3 bucket (and optionally CloudWatch Logs) for as long as you keep them. The first copy of management events is free; <strong>data events</strong> (S3 object reads/writes, Lambda invokes) are opt-in and billed per event.</li>
  <li>Make it trustworthy: an <strong>organization trail</strong> for all accounts and regions, <strong>log file validation</strong> (signed digest files detect deletion or edits), the bucket in a separate log-archive account with Object Lock.</li>
  <li>The lab cannot run it: CloudTrail is not part of LocalStack's free edition —</li>
</ul>
${OUT_104_KIEMTOAN}

<h3>AWS Config: what the configuration was, and whether it was allowed</h3>
<ul>
  <li><strong>Configuration recorder</strong> — records a <em>configuration item</em> every time a supported resource changes: "this security group had port 22 open to 0.0.0.0/0 from 14:02 to 14:31".</li>
  <li><strong>Config rules</strong> — managed checks such as <code>S3_BUCKET_PUBLIC_READ_PROHIBITED</code>, <code>RESTRICTED_INCOMING_TRAFFIC</code>, <code>CLOUD_TRAIL_ENABLED</code>; resources are marked COMPLIANT or NON_COMPLIANT, optionally with automatic remediation.</li>
  <li>LocalStack stored the recorder and the rule above but evaluates nothing; on AWS the rule would list every public bucket within minutes. Config is billed per configuration item recorded and per rule evaluation.</li>
</ul>

<h3>The exam table: five tools that sound alike</h3>
<table>
  <thead><tr><th>Question</th><th>Tool</th></tr></thead>
  <tbody>
    <tr><td>Is the system healthy? CPU, errors, latency, logs</td><td><strong>CloudWatch</strong></td></tr>
    <tr><td>Who deleted the bucket / changed the policy, from which IP?</td><td><strong>CloudTrail</strong></td></tr>
    <tr><td>What did this resource's configuration look like last Tuesday? Is it compliant?</td><td><strong>AWS Config</strong></td></tr>
    <tr><td>Which service made this request slow?</td><td><strong>X-Ray</strong> (OpenTelemetry)</td></tr>
    <tr><td>Which IPs talked to this subnet on which ports?</td><td><strong>VPC Flow Logs</strong> (Lesson 3.6)</td></tr>
  </tbody>
</table>
<p>Amazon GuardDuty sits on top: it reads CloudTrail, VPC Flow Logs and DNS logs and raises findings such as "credentials used from an unusual location".</p>

<h3>Real incident: four minutes, reconstructed from CloudTrail (EleKtra-Leak, 2023)</h3>
<p>Palo Alto Networks' Unit 42 published in October 2023 how a campaign they named EleKtra-Leak found AWS keys leaked in public GitHub repositories <strong>within five minutes</strong> and launched crypto-mining instances — 474 unique miners between 30 August and 6 October 2023. Their timeline comes straight from CloudTrail: AWS applied its quarantine policy (event <code>AttachUserPolicy</code>) at 13:30:22, and four minutes later, at 13:34:15, the attackers started reconnaissance with <code>DescribeRegions</code>.</p>
<ul>
  <li>That is what CloudTrail gives a defender: an exact list of calls, identity, IP and time — the basis for "what did the key do, and what must be cleaned up".</li>
  <li>Attackers know it, so a common step is <code>cloudtrail:StopLogging</code>, <code>DeleteTrail</code> or deleting log groups. Defence: organization trail that member accounts cannot stop, alarms on those event names (Lesson 10.3, Security Hub CloudWatch controls), log archive in a separate account, GuardDuty enabled.</li>
</ul>

<h3>At work: "which one do I open first?"</h3>
<p>User-facing problem ⇒ CloudWatch alarm/dashboard ⇒ logs for the time window ⇒ trace of a slow request. "Something changed" (a deploy, a security group, a policy) ⇒ CloudTrail for who and when, Config for before/after. Security alert ⇒ GuardDuty finding ⇒ CloudTrail for the key's full activity.</p>

<h3>Cost</h3>
<ul>
  <li>X-Ray: traces recorded and retrieved are billed per million beyond a monthly free tier — sampling keeps it small.</li>
  <li>CloudTrail: event history and one trail of management events are free; extra copies and data events are billed per 100,000 events; S3 storage for the trail is yours.</li>
  <li>Config: per configuration item recorded and per rule evaluation — recording every resource type in a busy account is not cheap; record what you need.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"Logs, metrics, traces — what is the difference?"</strong> — Events of one request / numbers over time for the system / the path and timing of one request across services.</li>
  <li><strong>"How does a trace cross from one service to another?"</strong> — Context propagation: the <code>traceparent</code> header (or message attribute) carries trace id and parent span id; instrumentation on both sides reads and writes it.</li>
  <li><strong>"CloudTrail vs Config?"</strong> — CloudTrail records API calls (who did what, when); Config records resource configurations over time and checks them against rules.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Send a request with your own <code>traceparent</code> header (trace id <code>4bf92f3577b34da6a3ce929d0e0e4736</code>, parent <code>00f067aa0ba902b7</code>, flags <code>01</code>) and find that trace in Jaeger's API.</p>
<p><strong>Done when:</strong> <code>curl localhost:44086/api/traces/4bf92f3577b34da6a3ce929d0e0e4736</code> returns spans from both <code>labflow-api</code> and <code>labflow-kho</code>.</p>
${giai('Hint', bash(`curl -s localhost:44080/bookings -H 'traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
sleep 5
curl -s localhost:44086/api/traces/4bf92f3577b34da6a3ce929d0e0e4736 | jq -r '.data[0].processes[].serviceName' | sort -u`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Trace / span</b><span>One request's journey / one timed step in it.</span></div>
  <div><b>traceparent</b><span>W3C header carrying trace id, parent span id, flags.</span></div>
  <div><b>Sampling</b><span>Keeping only a share of traces (plus errors).</span></div>
  <div><b>ADOT</b><span>AWS Distro for OpenTelemetry: collector and SDKs that export to X-Ray/CloudWatch.</span></div>
  <div><b>Service map</b><span>X-Ray's graph of services and their error/latency.</span></div>
  <div><b>CloudTrail event / trail</b><span>Record of one API call / delivery of events to S3/Logs.</span></div>
  <div><b>Data event</b><span>Object-level activity (S3 GetObject, Lambda Invoke) — opt-in, billed.</span></div>
  <div><b>Config rule</b><span>A compliance check on recorded resource configurations.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Traces show where the time went; propagate traceparent across HTTP and queues.</li>
  <li>Put traceId in log lines to jump between logs and traces.</li>
  <li>CloudTrail = who called which API; organization trail, validation, separate archive.</li>
  <li>Config = configuration history + compliance rules.</li>
  <li>Watch for StopLogging/DeleteTrail — blinding you is step one of many attacks.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://opentelemetry.io/docs/concepts/signals/traces/', '🧵', 'OpenTelemetry — Traces', 'Spans, context, propagation, sampling: the vocabulary every vendor now uses.')}
${tl('https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/', '🕵️', 'Unit 42 — EleKtra-Leak (2023)', 'A real attack timeline read from CloudTrail events.')}

<h3>Sources</h3>
<ul>
  <li>X-Ray: <a href="https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html" target="_blank" rel="noopener">docs.aws.amazon.com/xray/…/aws-xray.html</a> · ADOT: <a href="https://aws-otel.github.io/" target="_blank" rel="noopener">aws-otel.github.io</a> · Application Signals: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals.html" target="_blank" rel="noopener">…/CloudWatch-Application-Signals.html</a></li>
  <li>W3C Trace Context: <a href="https://w3c.github.io/trace-context/" target="_blank" rel="noopener">w3c.github.io/trace-context</a> · Jaeger: <a href="https://www.jaegertracing.io/docs/latest/" target="_blank" rel="noopener">jaegertracing.io/docs</a></li>
  <li>CloudTrail: <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html" target="_blank" rel="noopener">docs.aws.amazon.com/awscloudtrail/…/cloudtrail-user-guide.html</a> · event history: <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html" target="_blank" rel="noopener">…/view-cloudtrail-events.html</a> · validation: <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html" target="_blank" rel="noopener">…/cloudtrail-log-file-validation-intro.html</a> · pricing: <a href="https://aws.amazon.com/cloudtrail/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudtrail/pricing/</a></li>
  <li>AWS Config: <a href="https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html" target="_blank" rel="noopener">docs.aws.amazon.com/config/…/WhatIsConfig.html</a> · pricing: <a href="https://aws.amazon.com/config/pricing/" target="_blank" rel="noopener">aws.amazon.com/config/pricing/</a></li>
  <li>EleKtra-Leak, Unit 42 (October 2023): <a href="https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/" target="_blank" rel="noopener">unit42.paloaltonetworks.com</a></li>
</ul>
</div>
`;
const L104_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 4</span>
<h2>10.4 — Truy vết và kiểm toán: X-Ray/OpenTelemetry, CloudTrail và AWS Config</h2>
<p class="lead">Log nói chuyện <em>gì</em> đã xảy ra, chỉ số nói <em>bao nhiêu</em>. Còn hai câu hỏi. <strong>"Thời gian của một yêu cầu đã đi đâu?"</strong> — đó là <strong>truy vết phân tán</strong> (AWS X-Ray, dựng trên OpenTelemetry). <strong>"Ai đã đổi gì trong tài khoản, và trước đó nó trông thế nào?"</strong> — đó là <strong>CloudTrail</strong> (mọi lời gọi API) và <strong>AWS Config</strong> (mọi cấu hình). Bài này truy vết một yêu cầu chậm thật đi qua hai dịch vụ, nối trace với dòng log của nó, rồi vẽ bản đồ ba công cụ kiểm toán mà đề thi rất thích trộn lẫn.</p>

<h3>Hình dung: tra cứu một kiện hàng</h3>
<p>Kiện hàng có một mã vận đơn (<strong>trace id</strong>). Mỗi kho trung chuyển chạm tới nó đều quét: tới lúc 08:00, rời lúc 08:40 (<strong>span</strong>: tên, lúc bắt đầu, độ dài). Kho này chuyển mã cho kho sau cùng với kiện hàng (<strong>truyền ngữ cảnh</strong>). Khi hàng tới trễ, bạn không gọi điện từng kho — bạn mở trang tra cứu và thấy kho nào đã giữ nó sáu tiếng.</p>

<h3>Các khối cơ bản của truy vết</h3>
<ul>
  <li><strong>Trace</strong> — cả hành trình của một yêu cầu; <strong>span</strong> — một bước (một lời gọi HTTP, một truy vấn), có span cha, lúc bắt đầu, độ dài và thuộc tính.</li>
  <li><strong>Truyền ngữ cảnh</strong> — bên gọi gửi trace id và span id của mình sang dịch vụ kế tiếp trong header W3C <code>traceparent: 00-&lt;trace-id&gt;-&lt;span-id&gt;-01</code>. Mất header là trace vỡ thành nhiều mảnh.</li>
  <li><strong>Gắn đo (instrumentation)</strong> — <em>tự động</em> (máy chủ/máy khách HTTP, driver cơ sở dữ liệu, lời gọi AWS SDK tự có span mà không cần viết mã) cộng span <em>thủ công</em> cho các bước quan trọng của riêng bạn.</li>
  <li><strong>Lấy mẫu (sampling)</strong> — giữ mọi trace thì đắt; giữ một phần (ví dụ 5%) cộng mọi lỗi. Luật mặc định của X-Ray: yêu cầu đầu tiên mỗi giây, rồi 5%.</li>
  <li><strong>Trên AWS</strong> — mã của bạn dùng OpenTelemetry; collector <strong>AWS Distro for OpenTelemetry (ADOT)</strong> (một sidecar trong task ECS, hoặc có sẵn trong Lambda khi bật "active tracing") gửi span tới <strong>X-Ray</strong>, nơi vẽ dòng thời gian của trace và một <strong>service map</strong>. CloudWatch Application Signals dựng dashboard độ trễ/lỗi cho từng dịch vụ từ cùng dữ liệu đó.</li>
</ul>

<h3>Xem chạy thật (1): hai yêu cầu, một cái chậm</h3>
<p>Bản miễn phí của LocalStack không có X-Ray, nên span được gửi tới <strong>Jaeger</strong> — một kho trace mã nguồn mở nói cùng giao thức OpenTelemetry. Mã ứng dụng sẽ không đổi gì khi lên AWS — chỉ đổi địa chỉ của exporter:</p>
${MA_OTEL}
${MA_SPAN}
${OUT_104_HAI}

<h3>Xem chạy thật (2): trace chỉ ra thời gian đã đi đâu</h3>
${OUT_104_THAC}
<ul>
  <li>Đọc trace chậm từ trên xuống: span máy chủ của API mất 804 ms; bên trong, lời gọi tới dịch vụ phòng mất 803 ms; bên trong nữa, <strong>truy vấn mất 800 ms</strong>. Mã của chính API chỉ dùng khoảng 1 ms. Không có trace, bạn sẽ đi tối ưu nhầm dịch vụ.</li>
  <li>Bốn span của mỗi trace đến từ hai tiến trình. Chúng thuộc về nhau chỉ vì máy khách HTTP của API đã gửi <code>traceparent</code> và máy chủ HTTP của dịch vụ phòng đã đọc nó — cả hai đều do gắn đo tự động làm.</li>
  <li>Trace nhanh có cùng hình dạng với truy vấn 11 ms: hình dạng là kiến trúc, độ dài mới là vấn đề.</li>
</ul>

<h3>Xem chạy thật (3): từ một dòng log tới trace của nó</h3>
${OUT_104_NOI}
<ul>
  <li>Bộ ghi log của API thêm <code>traceId</code> đang hoạt động vào mọi dòng. Trên CloudWatch, một truy vấn Logs Insights theo mã đó tìm ra các dòng log, còn bảng điều khiển X-Ray mở ra trace — log giải thích <em>cái gì</em>, trace giải thích <em>ở đâu</em>.</li>
  <li>Truyền header cả qua hàng đợi: đặt <code>traceparent</code> vào thuộc tính tin SQS/SNS (Chương 9) để span của worker nhập vào cùng trace.</li>
</ul>

<h3>CloudTrail: ai đã gọi API nào</h3>
<p>Mọi lời gọi tới một API của AWS — bấm trên console, CLI, SDK, dịch vụ khác — đều thành một <strong>sự kiện</strong> CloudTrail. Một sự kiện thật có hình dạng như sau (tài khoản, khoá và IP đều là chỗ giữ trong tài liệu):</p>
${MA_TRAIL}
<ul>
  <li><strong>Event history</strong>: 90 ngày gần nhất của sự kiện <em>quản lý</em> (tạo, xoá, sửa, describe), miễn phí, theo từng region, xem trên console và bằng <code>lookup-events</code>.</li>
  <li><strong>Trail</strong>: giao sự kiện vào một bucket S3 (và tuỳ chọn vào CloudWatch Logs), giữ bao lâu tuỳ bạn. Bản sao đầu tiên của sự kiện quản lý miễn phí; <strong>sự kiện dữ liệu</strong> (đọc/ghi object S3, gọi Lambda) phải bật riêng và tính tiền theo sự kiện.</li>
  <li>Làm cho nó đáng tin: một <strong>organization trail</strong> cho mọi tài khoản và region, <strong>log file validation</strong> (tệp digest có chữ ký phát hiện việc xoá hay sửa), bucket đặt ở một tài khoản lưu trữ log riêng có Object Lock.</li>
  <li>Phòng lab không chạy được phần này: CloudTrail không có trong bản miễn phí của LocalStack —</li>
</ul>
${OUT_104_KIEMTOAN}

<h3>AWS Config: cấu hình đã từng thế nào, và có được phép không</h3>
<ul>
  <li><strong>Configuration recorder</strong> — ghi một <em>configuration item</em> mỗi khi một tài nguyên được hỗ trợ thay đổi: "security group này mở cổng 22 cho 0.0.0.0/0 từ 14:02 tới 14:31".</li>
  <li><strong>Config rule</strong> — các phép kiểm có sẵn như <code>S3_BUCKET_PUBLIC_READ_PROHIBITED</code>, <code>RESTRICTED_INCOMING_TRAFFIC</code>, <code>CLOUD_TRAIL_ENABLED</code>; tài nguyên được đánh dấu COMPLIANT hay NON_COMPLIANT, có thể kèm tự khắc phục.</li>
  <li>LocalStack lưu recorder và rule ở trên nhưng không đánh giá gì; trên AWS rule đó sẽ liệt kê mọi bucket công khai trong vài phút. Config tính tiền theo số configuration item được ghi và số lần đánh giá rule.</li>
</ul>

<h3>Bảng cho đề thi: năm công cụ nghe na ná nhau</h3>
<table>
  <thead><tr><th>Câu hỏi</th><th>Công cụ</th></tr></thead>
  <tbody>
    <tr><td>Hệ thống có khoẻ không? CPU, lỗi, độ trễ, log</td><td><strong>CloudWatch</strong></td></tr>
    <tr><td>Ai đã xoá bucket / sửa policy, từ IP nào?</td><td><strong>CloudTrail</strong></td></tr>
    <tr><td>Thứ Ba tuần trước cấu hình của tài nguyên này ra sao? Có tuân thủ không?</td><td><strong>AWS Config</strong></td></tr>
    <tr><td>Dịch vụ nào làm yêu cầu này chậm?</td><td><strong>X-Ray</strong> (OpenTelemetry)</td></tr>
    <tr><td>IP nào đã nói chuyện với subnet này, qua cổng nào?</td><td><strong>VPC Flow Logs</strong> (bài 3.6)</td></tr>
  </tbody>
</table>
<p>Amazon GuardDuty đứng phía trên: nó đọc CloudTrail, VPC Flow Logs và log DNS rồi đưa ra phát hiện như "thông tin xác thực được dùng từ một nơi bất thường".</p>

<h3>Sự cố thật: bốn phút, dựng lại từ CloudTrail (EleKtra-Leak, 2023)</h3>
<p>Tháng 10/2023, Unit 42 của Palo Alto Networks công bố cách một chiến dịch họ đặt tên EleKtra-Leak tìm thấy khoá AWS lộ trên kho GitHub công khai <strong>trong vòng năm phút</strong> rồi bật máy đào tiền ảo — 474 máy đào khác nhau từ 30/8 tới 6/10/2023. Dòng thời gian của họ lấy thẳng từ CloudTrail: AWS gắn chính sách cách ly (sự kiện <code>AttachUserPolicy</code>) lúc 13:30:22, và bốn phút sau, lúc 13:34:15, kẻ tấn công bắt đầu do thám bằng <code>DescribeRegions</code>.</p>
<ul>
  <li>Đó là thứ CloudTrail cho người phòng thủ: danh sách chính xác các lời gọi, danh tính, IP và thời điểm — nền tảng để trả lời "khoá đó đã làm gì, phải dọn những gì".</li>
  <li>Kẻ tấn công biết điều này, nên một bước hay gặp là <code>cloudtrail:StopLogging</code>, <code>DeleteTrail</code> hay xoá log group. Cách phòng: organization trail mà tài khoản thành viên không dừng được, cảnh báo trên các tên sự kiện đó (bài 10.3, control CloudWatch của Security Hub), lưu log ở tài khoản riêng, bật GuardDuty.</li>
</ul>

<h3>Đi làm: "mở cái nào trước?"</h3>
<p>Sự cố người dùng thấy ⇒ cảnh báo/dashboard CloudWatch ⇒ log trong khung giờ đó ⇒ trace của một yêu cầu chậm. "Có gì đó vừa đổi" (một lần deploy, một security group, một policy) ⇒ CloudTrail để biết ai và khi nào, Config để so trước/sau. Cảnh báo an ninh ⇒ phát hiện của GuardDuty ⇒ CloudTrail để xem toàn bộ hoạt động của khoá.</p>

<h3>Tiền</h3>
<ul>
  <li>X-Ray: trace được ghi và được đọc tính tiền theo triệu, sau phần miễn phí hằng tháng — lấy mẫu giữ con số này nhỏ.</li>
  <li>CloudTrail: event history và một trail sự kiện quản lý là miễn phí; bản sao thêm và sự kiện dữ liệu tính tiền theo mỗi 100.000 sự kiện; tiền lưu S3 của trail do bạn trả.</li>
  <li>Config: theo số configuration item được ghi và số lần đánh giá rule — ghi mọi loại tài nguyên trong một tài khoản bận rộn không hề rẻ; chỉ ghi thứ bạn cần.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Log, chỉ số, trace khác nhau thế nào?"</strong> — Sự kiện của một yêu cầu / con số theo thời gian của cả hệ thống / đường đi và thời gian của một yêu cầu xuyên qua các dịch vụ.</li>
  <li><strong>"Trace đi từ dịch vụ này sang dịch vụ khác bằng cách nào?"</strong> — Truyền ngữ cảnh: header <code>traceparent</code> (hoặc thuộc tính tin) mang trace id và span id cha; gắn đo ở cả hai phía đọc và ghi nó.</li>
  <li><strong>"CloudTrail khác Config thế nào?"</strong> — CloudTrail ghi lời gọi API (ai làm gì, khi nào); Config ghi cấu hình tài nguyên theo thời gian và kiểm chúng theo rule.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Gửi một yêu cầu kèm header <code>traceparent</code> do bạn tự đặt (trace id <code>4bf92f3577b34da6a3ce929d0e0e4736</code>, span cha <code>00f067aa0ba902b7</code>, cờ <code>01</code>) rồi tìm trace đó qua API của Jaeger.</p>
<p><strong>Đạt khi:</strong> <code>curl localhost:44086/api/traces/4bf92f3577b34da6a3ce929d0e0e4736</code> trả về span của cả <code>labflow-api</code> lẫn <code>labflow-kho</code>.</p>
${giai('Gợi ý', bash(`curl -s localhost:44080/bookings -H 'traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
sleep 5
curl -s localhost:44086/api/traces/4bf92f3577b34da6a3ce929d0e0e4736 | jq -r '.data[0].processes[].serviceName' | sort -u`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Trace / span</b><span>Hành trình của một yêu cầu / một bước có đo thời gian trong đó.</span></div>
  <div><b>traceparent</b><span>Header W3C mang trace id, span id cha, cờ.</span></div>
  <div><b>Sampling</b><span>Chỉ giữ một phần trace (cộng các lỗi).</span></div>
  <div><b>ADOT</b><span>AWS Distro for OpenTelemetry: collector và SDK xuất dữ liệu sang X-Ray/CloudWatch.</span></div>
  <div><b>Service map</b><span>Đồ thị dịch vụ của X-Ray kèm lỗi/độ trễ.</span></div>
  <div><b>Sự kiện / trail CloudTrail</b><span>Bản ghi một lời gọi API / việc giao sự kiện vào S3/Logs.</span></div>
  <div><b>Data event</b><span>Hoạt động mức object (S3 GetObject, Lambda Invoke) — phải bật, có tính tiền.</span></div>
  <div><b>Config rule</b><span>Phép kiểm tuân thủ trên cấu hình tài nguyên đã ghi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Trace cho thấy thời gian đi đâu; truyền traceparent qua HTTP và hàng đợi.</li>
  <li>Đặt traceId vào dòng log để nhảy qua lại giữa log và trace.</li>
  <li>CloudTrail = ai gọi API nào; organization trail, validation, lưu trữ riêng.</li>
  <li>Config = lịch sử cấu hình + rule tuân thủ.</li>
  <li>Canh StopLogging/DeleteTrail — làm bạn mù là bước đầu của nhiều cuộc tấn công.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://opentelemetry.io/docs/concepts/signals/traces/', '🧵', 'OpenTelemetry — Traces', 'Span, ngữ cảnh, truyền, lấy mẫu: bộ từ vựng mọi nhà cung cấp đang dùng.')}
${tl('https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/', '🕵️', 'Unit 42 — EleKtra-Leak (2023)', 'Dòng thời gian một vụ tấn công thật đọc từ sự kiện CloudTrail.')}

<h3>Nguồn</h3>
<ul>
  <li>X-Ray: <a href="https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html" target="_blank" rel="noopener">docs.aws.amazon.com/xray/…/aws-xray.html</a> · ADOT: <a href="https://aws-otel.github.io/" target="_blank" rel="noopener">aws-otel.github.io</a> · Application Signals: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals.html" target="_blank" rel="noopener">…/CloudWatch-Application-Signals.html</a></li>
  <li>W3C Trace Context: <a href="https://w3c.github.io/trace-context/" target="_blank" rel="noopener">w3c.github.io/trace-context</a> · Jaeger: <a href="https://www.jaegertracing.io/docs/latest/" target="_blank" rel="noopener">jaegertracing.io/docs</a></li>
  <li>CloudTrail: <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html" target="_blank" rel="noopener">docs.aws.amazon.com/awscloudtrail/…/cloudtrail-user-guide.html</a> · event history: <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html" target="_blank" rel="noopener">…/view-cloudtrail-events.html</a> · validation: <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html" target="_blank" rel="noopener">…/cloudtrail-log-file-validation-intro.html</a> · giá: <a href="https://aws.amazon.com/cloudtrail/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudtrail/pricing/</a></li>
  <li>AWS Config: <a href="https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html" target="_blank" rel="noopener">docs.aws.amazon.com/config/…/WhatIsConfig.html</a> · giá: <a href="https://aws.amazon.com/config/pricing/" target="_blank" rel="noopener">aws.amazon.com/config/pricing/</a></li>
  <li>EleKtra-Leak, Unit 42 (tháng 10/2023): <a href="https://unit42.paloaltonetworks.com/malicious-operations-of-exposed-iam-keys-cryptojacking/" target="_blank" rel="noopener">unit42.paloaltonetworks.com</a></li>
</ul>
</div>
`;
/* ═════ 10.5 — Lab 10 ═════ */
const L105_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lab</span>
<h2>10.5 — Chapter 10 lab: logs, metrics and alarms for the LabFlow API + interview questions</h2>
<p class="lead">You take over a LabFlow API that "has monitoring": logs go to CloudWatch, there is an alarm. A grader checks 8 properties of that monitoring — configuration <em>and</em> behaviour, including whether a password ends up in the logs and whether an alarm actually reaches a human. The hasty setup scores 1/8; your job is 8/8, then clean up to zero.</p>

<h3>The assignment</h3>
<ul>
  <li>Log group <code>/labflow/api</code> keeps logs <strong>14 days</strong>.</li>
  <li>The API (environment variables <code>CHE</code> and <code>DIM_USER</code> of <code>app/api.cjs</code>) must never write passwords or tokens to the log, must write one JSON line with a <code>requestId</code> per request, and must publish metrics per <strong>route only</strong>.</li>
  <li>Alarm <code>labflow-api-5xx</code> on <code>LabFlow/Loi5xx</code> for <code>POST /bookings</code>: <code>Sum ≥ 5</code> per minute, <strong>2 of 3</strong> minutes, missing data = healthy.</li>
  <li>The alarm notifies topic <code>labflow-canh-bao</code> on ALARM <strong>and</strong> on OK; the topic delivers to queue <code>labflow-hop-thu</code> (standing in for the on-call inbox).</li>
  <li>Dashboard <code>labflow</code> with at least two widgets, one of them <code>DoTre</code> at <code>p99</code>.</li>
</ul>
${giai('The API you are given — app/api.cjs', MA_API)}

<h3>The grader — 8 checks</h3>
<table>
  <thead><tr><th>#</th><th>Check</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Retention 14 days</td><td>default is forever, billed forever (Lesson 10.1)</td></tr>
    <tr><td>2</td><td>Grader logs in with a marked password + token ⇒ neither appears in the log</td><td>Facebook 2019</td></tr>
    <tr><td>3</td><td>Every request line is JSON with <code>requestId</code></td><td>find one request in seconds</td></tr>
    <tr><td>4</td><td>Since the API started: datapoints per route, none per <code>UserId</code></td><td>cardinality bill (Lesson 10.2)</td></tr>
    <tr><td>5</td><td>Alarm condition exactly: <code>Loi5xx Sum 5 60 3 2 notBreaching</code></td><td>no crying wolf, no silence on no data</td></tr>
    <tr><td>6</td><td>ALARM and OK actions both point to the topic</td><td>on-call knows when it is over</td></tr>
    <tr><td>7</td><td><code>set-alarm-state ALARM</code> ⇒ a message arrives in <code>labflow-hop-thu</code></td><td>behaviour: the path really delivers</td></tr>
    <tr><td>8</td><td>Dashboard with ≥ 2 widgets, <code>DoTre</code> at <code>p99</code></td><td>the tail, not the average</td></tr>
  </tbody>
</table>
${giai('The grader — lab10/cham.sh', MA_CHAM)}

<h3>Step 1 — the hasty version, graded</h3>
${MA_TRUOC}
<p>Run it, then <code>bash cham.sh</code>. The first part of the output below is what you should see: <strong>1/8</strong>. Only check 3 passes, because the API already writes JSON with a <code>requestId</code>.</p>

<h3>Step 2 — your fix, then the solution</h3>
<p>Stop at the ⛔ line in the output and fix it yourself first: one retention command, restart the API with the right two variables, one <code>put-metric-alarm</code>, one queue + subscription, one dashboard. Then compare with the solution.</p>
${giai('Solution — lab10/giai.sh (open only after you tried)', MA_GIAI)}
${OUT_105_LAB}

<h3>Step 3 — clean up, and prove nothing is left</h3>
${MA_DON}
${MA_CONGI}
<p>Five zeros at the end of the output are the proof. On AWS, alarms (0.10 USD/month each), dashboards beyond three (3 USD/month) and log groups without retention keep costing until deleted.</p>

<h3>What it would cost on AWS (Singapore, November 2026)</h3>
<table>
  <thead><tr><th>Item</th><th>Assumption</th><th>USD / month</th></tr></thead>
  <tbody>
    <tr><td>Log ingestion</td><td>10 requests/s, 2 lines/request, measured line size (Lesson 10.1)</td><td>${GIA_LOG_10}</td></tr>
    <tr><td>Log storage, 14 days</td><td>same volume, before compression</td><td>${GIA_LUU_10}</td></tr>
    <tr><td>Custom metrics</td><td>4 (2 names × 2 routes) — within the free 10</td><td>0.00</td></tr>
    <tr><td>Alarm</td><td>1 standard alarm — within the free 10</td><td>0.00</td></tr>
    <tr><td>Dashboard</td><td>1 — within the free 3</td><td>0.00</td></tr>
    <tr><td>SNS ⇒ SQS</td><td>a few messages</td><td>≈ 0</td></tr>
  </tbody>
</table>
<p>Logs are almost the whole bill. With <code>DIM_USER=1</code> and 10,000 users the metrics alone would be about 6,000 USD/month (Lesson 10.2).</p>

<h3>🎤 Interviewers will ask (operations)</h3>
<ul>
  <li><strong>"You are on call and the 5xx alarm fires. What do you do in the first 10 minutes?"</strong> — Acknowledge; open the dashboard (which routes, since when, latency too?); check recent changes (deploy, CloudTrail); Logs Insights for 5xx lines in the window, pick a <code>requestId</code>, follow its trace; mitigate first (roll back, scale, fail over), investigate after; write the timeline.</li>
  <li><strong>"What are SLI, SLO and error budget?"</strong> — SLI: a measured indicator (share of bookings answered under 1 s without 5xx). SLO: the target (99.5% per 30 days). Error budget: the allowed 0.5%; alarms fire on fast budget burn, not on every error.</li>
  <li><strong>"How do you make sure logs do not leak personal data?"</strong> — Log chosen fields only; redact a deny-list in the logger; data protection policy on the group; least-privilege read; short retention; review log lines in code review like any output.</li>
  <li><strong>"Average or percentile for latency alarms, and why?"</strong> — p99 (or p95): the average hides the tail (59.8 ms average vs 801 ms p99 in Lesson 10.2).</li>
  <li><strong>"Metric filter or publishing metrics from code?"</strong> — Metric filter: no code change, derived from logs you already ship. From code (PutMetricData/EMF): precise units and dimensions, works without parsing. EMF gives both.</li>
</ul>

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>On call</b><span>The person who receives alarms in a time window.</span></div>
  <div><b>Runbook</b><span>Written steps for a specific alarm.</span></div>
  <div><b>SLI / SLO</b><span>Measured indicator / target for it.</span></div>
  <div><b>Error budget</b><span>Allowed failure share under the SLO.</span></div>
  <div><b>Game day</b><span>Planned exercise that triggers alarms to test people and tools.</span></div>
  <div><b>Postmortem</b><span>Blameless write-up after an incident: timeline, cause, fixes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Monitoring is graded by behaviour: no secrets in logs, an alarm that reaches someone.</li>
  <li>Retention, JSON + requestId, route-only dimensions, M-of-N alarm with OK action, p99 dashboard.</li>
  <li>Clean up and prove it with counts.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Alarms: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/AlarmThatSendsEmail.html</a> · dashboards: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html" target="_blank" rel="noopener">…/CloudWatch_Dashboards.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a></li>
  <li>SLOs and error budgets: <a href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">sre.google/sre-book/service-level-objectives</a></li>
</ul>
</div>
`;
const L105_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Lab</span>
<h2>10.5 — Lab chương 10: log, chỉ số và cảnh báo cho API LabFlow + câu hỏi phỏng vấn</h2>
<p class="lead">Bạn nhận bàn giao một API LabFlow "đã có giám sát": log đổ về CloudWatch, có một cảnh báo. Bộ chấm kiểm 8 tính chất của phần giám sát đó — cấu hình <em>và</em> hành vi, kể cả chuyện mật khẩu có rơi vào log không, và cảnh báo có thật sự tới được một con người không. Bản dựng vội được 1/8; việc của bạn là 8/8, rồi dọn về số 0.</p>

<h3>Đề bài</h3>
<ul>
  <li>Log group <code>/labflow/api</code> giữ log <strong>14 ngày</strong>.</li>
  <li>API (biến môi trường <code>CHE</code> và <code>DIM_USER</code> của <code>app/api.cjs</code>) không bao giờ được ghi mật khẩu hay token vào log, phải ghi một dòng JSON có <code>requestId</code> cho mỗi yêu cầu, và chỉ đẩy chỉ số <strong>theo route</strong>.</li>
  <li>Cảnh báo <code>labflow-api-5xx</code> trên <code>LabFlow/Loi5xx</code> của <code>POST /bookings</code>: <code>Sum ≥ 5</code> mỗi phút, <strong>2 trong 3</strong> phút, thiếu dữ liệu = khoẻ.</li>
  <li>Cảnh báo báo về topic <code>labflow-canh-bao</code> lúc ALARM <strong>và</strong> lúc OK; topic giao tới hàng <code>labflow-hop-thu</code> (đứng thay hộp thư của người trực).</li>
  <li>Dashboard <code>labflow</code> có ít nhất hai widget, một widget là <code>DoTre</code> ở <code>p99</code>.</li>
</ul>
${giai('API được giao — app/api.cjs', MA_API)}

<h3>Bộ chấm — 8 phép kiểm</h3>
<table>
  <thead><tr><th>#</th><th>Kiểm</th><th>Vì sao quan trọng</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Giữ log 14 ngày</td><td>mặc định là mãi mãi, tính tiền mãi mãi (bài 10.1)</td></tr>
    <tr><td>2</td><td>Bộ chấm đăng nhập bằng mật khẩu + token có dấu riêng ⇒ không cái nào xuất hiện trong log</td><td>Facebook 2019</td></tr>
    <tr><td>3</td><td>Mọi dòng yêu cầu là JSON có <code>requestId</code></td><td>tìm một yêu cầu trong vài giây</td></tr>
    <tr><td>4</td><td>Kể từ lúc API khởi động: có datapoint theo route, không có cái nào theo <code>UserId</code></td><td>hoá đơn cardinality (bài 10.2)</td></tr>
    <tr><td>5</td><td>Điều kiện cảnh báo đúng hệt: <code>Loi5xx Sum 5 60 3 2 notBreaching</code></td><td>không kêu sói đến, không im lặng khi thiếu dữ liệu</td></tr>
    <tr><td>6</td><td>Action của ALARM và OK đều trỏ về topic</td><td>người trực biết khi nào sự cố đã qua</td></tr>
    <tr><td>7</td><td><code>set-alarm-state ALARM</code> ⇒ có thư tới <code>labflow-hop-thu</code></td><td>hành vi: đường giao thật sự giao</td></tr>
    <tr><td>8</td><td>Dashboard ≥ 2 widget, có <code>DoTre</code> ở <code>p99</code></td><td>phần đuôi, không phải trung bình</td></tr>
  </tbody>
</table>
${giai('Bộ chấm — lab10/cham.sh', MA_CHAM)}

<h3>Bước 1 — bản dựng vội, đem chấm</h3>
${MA_TRUOC}
<p>Chạy nó, rồi <code>bash cham.sh</code>. Phần đầu của output bên dưới là thứ bạn phải thấy: <strong>1/8</strong>. Chỉ phép 3 qua, vì API vốn đã ghi JSON có <code>requestId</code>.</p>

<h3>Bước 2 — bạn tự sửa, rồi mới xem lời giải</h3>
<p>Dừng ở dòng ⛔ trong output và tự sửa trước: một lệnh retention, khởi động lại API với đúng hai biến, một lệnh <code>put-metric-alarm</code>, một hàng đợi + subscription, một dashboard. Sau đó mới so với lời giải.</p>
${giai('Lời giải — lab10/giai.sh (chỉ mở sau khi đã tự làm)', MA_GIAI)}
${OUT_105_LAB}

<h3>Bước 3 — dọn, và chứng minh không còn gì</h3>
${MA_DON}
${MA_CONGI}
<p>Năm số 0 ở cuối output là bằng chứng. Trên AWS, cảnh báo (0,10 USD/tháng mỗi cái), dashboard vượt ba cái (3 USD/tháng) và log group không có retention vẫn tính tiền cho tới khi bị xoá.</p>

<h3>Trên AWS sẽ tốn bao nhiêu (Singapore, tháng 11/2026)</h3>
<table>
  <thead><tr><th>Khoản</th><th>Giả định</th><th>USD / tháng</th></tr></thead>
  <tbody>
    <tr><td>Nạp log</td><td>10 yêu cầu/giây, 2 dòng/yêu cầu, cỡ dòng đo thật (bài 10.1)</td><td>${GIA_LOG_10}</td></tr>
    <tr><td>Lưu log 14 ngày</td><td>cùng khối lượng, chưa tính nén</td><td>${GIA_LUU_10}</td></tr>
    <tr><td>Chỉ số tự định nghĩa</td><td>4 (2 tên × 2 route) — nằm trong 10 cái miễn phí</td><td>0.00</td></tr>
    <tr><td>Cảnh báo</td><td>1 cảnh báo chuẩn — nằm trong 10 cái miễn phí</td><td>0.00</td></tr>
    <tr><td>Dashboard</td><td>1 — nằm trong 3 cái miễn phí</td><td>0.00</td></tr>
    <tr><td>SNS ⇒ SQS</td><td>vài thư</td><td>≈ 0</td></tr>
  </tbody>
</table>
<p>Log gần như là toàn bộ hoá đơn. Với <code>DIM_USER=1</code> và 10.000 người dùng, riêng chỉ số đã khoảng 6.000 USD/tháng (bài 10.2).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi (vận hành)</h3>
<ul>
  <li><strong>"Bạn đang trực và cảnh báo 5xx nổ. Mười phút đầu bạn làm gì?"</strong> — Xác nhận đã nhận; mở dashboard (route nào, từ khi nào, độ trễ có tăng không?); xem thay đổi gần đây (deploy, CloudTrail); Logs Insights tìm dòng 5xx trong khung giờ, chọn một <code>requestId</code>, lần theo trace của nó; giảm thiệt hại trước (quay lui bản cũ, tăng máy, chuyển dự phòng), điều tra sau; ghi lại dòng thời gian.</li>
  <li><strong>"SLI, SLO và error budget là gì?"</strong> — SLI: chỉ báo đo được (tỉ lệ lượt đặt phòng được trả lời dưới 1 giây mà không 5xx). SLO: mục tiêu (99,5% trong 30 ngày). Error budget: phần 0,5% được phép hỏng; cảnh báo nổ khi ngân sách lỗi bị đốt nhanh, không nổ với mỗi lỗi lẻ.</li>
  <li><strong>"Làm sao bảo đảm log không lộ dữ liệu cá nhân?"</strong> — Chỉ log trường đã chọn; che danh sách khoá cấm trong bộ ghi log; data protection policy cho group; quyền đọc tối thiểu; retention ngắn; review dòng log trong code review như mọi output khác.</li>
  <li><strong>"Cảnh báo độ trễ dùng trung bình hay phân vị, vì sao?"</strong> — p99 (hoặc p95): trung bình giấu phần đuôi (bài 10.2: trung bình 59,8 ms, p99 801 ms).</li>
  <li><strong>"Metric filter hay đẩy chỉ số từ mã?"</strong> — Metric filter: không sửa mã, rút ra từ log vốn đã gửi. Từ mã (PutMetricData/EMF): đơn vị và dimension chính xác, không phải phân tích chữ. EMF có cả hai.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Trực (on call)</b><span>Người nhận cảnh báo trong một khung giờ.</span></div>
  <div><b>Runbook</b><span>Sổ tay các bước cho một cảnh báo cụ thể.</span></div>
  <div><b>SLI / SLO</b><span>Chỉ báo đo được / mục tiêu cho chỉ báo đó.</span></div>
  <div><b>Error budget</b><span>Phần hỏng được phép theo SLO.</span></div>
  <div><b>Game day</b><span>Buổi diễn tập có chủ đích, bật cảnh báo để thử người và công cụ.</span></div>
  <div><b>Postmortem</b><span>Bản viết lại sau sự cố, không đổ lỗi: dòng thời gian, nguyên nhân, việc sửa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Giám sát được chấm bằng hành vi: không có bí mật trong log, cảnh báo tới được một người.</li>
  <li>Retention, JSON + requestId, dimension chỉ theo route, cảnh báo M trong N có action OK, dashboard p99.</li>
  <li>Dọn sạch và chứng minh bằng các con số đếm.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Cảnh báo: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/AlarmThatSendsEmail.html</a> · dashboard: <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html" target="_blank" rel="noopener">…/CloudWatch_Dashboards.html</a></li>
  <li>Bảng giá: <a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudwatch/pricing/</a></li>
  <li>SLO và error budget: <a href="https://sre.google/sre-book/service-level-objectives/" target="_blank" rel="noopener">sre.google/sre-book/service-level-objectives</a></li>
</ul>
</div>
`;
/* ═════ 10.6 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [2, 0, 3, 1, 0, 2, 3, 1, 2, 0];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ10 = [
  Q('Right after create-log-group, describe-log-groups shows retentionInDays = null. What does that mean?|||Ngay sau create-log-group, describe-log-groups cho retentionInDays = null. Nghĩa là gì?', [
    'Logs are deleted after 1 day|||Log bị xoá sau 1 ngày',
    'Never expire: logs are kept (and billed) forever until you set retention|||Never expire: log được giữ (và tính tiền) mãi mãi cho tới khi bạn đặt retention',
    'The group is not ready yet|||Nhóm chưa sẵn sàng',
    'Logs are kept 30 days, the default|||Log được giữ 30 ngày theo mặc định',
  ], 1),
  Q('The error line and the request line of one failed request carry the same requestId. What is it for?|||Dòng lỗi và dòng tóm tắt của cùng một yêu cầu hỏng mang chung requestId. Để làm gì?', [
    'It deduplicates log events|||Để loại dòng log trùng',
    'It finds every line of one request (and is returned to the client for support)|||Để tìm mọi dòng của một yêu cầu (và được trả về cho khách để hỗ trợ)',
    'It is required by PutLogEvents|||PutLogEvents bắt buộc phải có',
    'It encrypts the line|||Để mã hoá dòng log',
  ], 1),
  Q('A debug logger wrote the login body, including the password, to CloudWatch Logs. What is the right first fix?|||Một bộ ghi log gỡ lỗi đã ghi thân yêu cầu đăng nhập, kèm mật khẩu, vào CloudWatch Logs. Cách sửa đầu tiên đúng là gì?', [
    'Shorten retention to 1 day|||Giảm retention xuống 1 ngày',
    'Redact sensitive keys in the logger and log chosen fields only (then rotate what leaked)|||Che các khoá nhạy cảm ngay trong bộ ghi log và chỉ log trường đã chọn (rồi xoay thứ đã lộ)',
    'Switch the group to Infrequent Access|||Chuyển nhóm sang Infrequent Access',
    'Use plain text instead of JSON|||Dùng chữ thường thay cho JSON',
  ], 1),
  Q('GET /bookings: average 59.8 ms, p50 13 ms, p99 801 ms. Which statistic should a latency alarm use?|||GET /bookings: trung bình 59,8 ms, p50 13 ms, p99 801 ms. Cảnh báo độ trễ nên dùng statistic nào?', [
    'Average|||Average',
    'p99 (or p95)|||p99 (hoặc p95)',
    'Minimum|||Minimum',
    'SampleCount|||SampleCount',
  ], 1),
  Q('Adding a UserId dimension turned 4 metrics into 32 with only 7 users. Why does this matter?|||Thêm dimension UserId biến 4 chỉ số thành 32 chỉ với 7 người dùng. Vì sao đáng lo?', [
    'Dimensions slow down PutMetricData|||Dimension làm PutMetricData chậm đi',
    'Every distinct dimension set is a separate billed metric — 10,000 users ⇒ thousands of USD per month|||Mỗi bộ dimension khác nhau là một chỉ số tính tiền riêng — 10.000 người dùng ⇒ hàng nghìn USD mỗi tháng',
    'CloudWatch rejects more than 10 metrics|||CloudWatch từ chối quá 10 chỉ số',
    'Percentiles stop working|||Phân vị ngừng hoạt động',
  ], 1),
  Q('An EC2 instance ran out of memory but CloudWatch showed no memory metric. Why?|||Một máy EC2 hết bộ nhớ nhưng CloudWatch không có chỉ số bộ nhớ nào. Vì sao?', [
    'Memory metrics need detailed monitoring|||Chỉ số bộ nhớ cần detailed monitoring',
    'Memory is inside the OS; it needs the CloudWatch agent|||Bộ nhớ nằm trong hệ điều hành; cần CloudWatch agent',
    'Memory is only in the AWS/Billing namespace|||Bộ nhớ chỉ có trong namespace AWS/Billing',
    'The metric was deleted after 15 days|||Chỉ số bị xoá sau 15 ngày',
  ], 1),
  Q('Your API sends Loi5xx only when errors happen. Which treat-missing-data keeps the alarm OK on quiet minutes?|||API chỉ gửi Loi5xx khi có lỗi. Chọn treat-missing-data nào để cảnh báo giữ OK trong những phút yên ắng?', [
    'breaching|||breaching',
    'notBreaching|||notBreaching',
    'missing (default)|||missing (mặc định)',
    'It does not matter|||Không quan trọng',
  ], 1),
  Q('An alarm has alarm-actions to SNS but no ok-actions. What goes wrong?|||Một cảnh báo có alarm-actions tới SNS nhưng không có ok-actions. Có gì không ổn?', [
    'It never fires|||Nó không bao giờ nổ',
    'On-call is paged but never told when the problem is over|||Người trực bị gọi nhưng không bao giờ được báo khi sự cố đã qua',
    'SNS rejects the alarm|||SNS từ chối cảnh báo',
    'It costs twice as much|||Nó tốn gấp đôi tiền',
  ], 1),
  Q('Trace: API server span 804 ms ⊃ client call 803 ms ⊃ room service ⊃ query 800 ms. Where should you optimise?|||Trace: span máy chủ API 804 ms ⊃ lời gọi 803 ms ⊃ dịch vụ phòng ⊃ truy vấn 800 ms. Nên tối ưu ở đâu?', [
    'The API code|||Mã của API',
    'The database query in the room service|||Truy vấn cơ sở dữ liệu trong dịch vụ phòng',
    'The network between the services|||Mạng giữa hai dịch vụ',
    'The logger|||Bộ ghi log',
  ], 1),
  Q('"Who deleted this S3 bucket, and from which IP?" Which service answers?|||"Ai đã xoá bucket S3 này, từ IP nào?" Dịch vụ nào trả lời?', [
    'CloudWatch Metrics|||CloudWatch Metrics',
    'AWS CloudTrail|||AWS CloudTrail',
    'AWS X-Ray|||AWS X-Ray',
    'AWS Config|||AWS Config',
  ], 1),
];

export default {
  title: 'Chapter 10 — Observability: CloudWatch|||Chương 10 — Quan sát: CloudWatch',
  description: 'Quan sát chạy thật: API LabFlow tự gửi log JSON (requestId, che bí mật) và chỉ số lên CloudWatch trên LocalStack; retention mặc định "giữ mãi", filter pattern + Logs Insights (cùng logic bằng jq vì LocalStack chưa thực thi), log lộ mật khẩu (Facebook 2019); độ trễ trung bình 59,8 ms so với p99 801 ms, dimension UserId nhân 4 chỉ số thành 32, dashboard dạng mã; cảnh báo ⇒ SNS ⇒ hộp thư (ALARM rồi OK), nút thử, M trong N, cảnh báo ghép, Knight Capital 2012; trace OpenTelemetry qua hai dịch vụ (truy vấn 800 ms), CloudTrail/Config, EleKtra-Leak 2023; lab chấm 8 phép.',
  lessons: [
    {
      title: '10.1 — CloudWatch Logs and Logs Insights|||10.1 — CloudWatch Logs và Logs Insights',
      slug: 'aws-10-1-logs',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Log group/stream/event, retention mặc định Never expire (đặt 14 ngày); API gửi log JSON có requestId qua PutLogEvents như awslogs driver; filter pattern và Logs Insights (LocalStack bỏ qua pattern ⇒ cùng điều kiện bằng jq); log lộ mật khẩu + token rồi bản che; Facebook 2019 + án phạt 2024; tiền nạp 0,70 USD/GB lấn át tiền lưu.',
      content: L101_EN + L101_VI,
    },
    {
      title: '10.2 — Metrics, custom metrics and dashboards|||10.2 — Chỉ số, chỉ số tự định nghĩa và dashboard',
      slug: 'aws-10-2-metrics',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Namespace, dimension, period, statistic, độ phân giải, thời gian giữ 15 tháng; chỉ số có sẵn của ALB/ECS/RDS/Lambda/SQS và EC2 không có bộ nhớ; đẩy độ trễ thật: trung bình 59,8 ms nhưng p50 13 / p99 801 ms; dimension UserId biến 4 chỉ số thành 32 (10.000 người ≈ 6.000 USD/tháng); denial of wallet; dashboard JSON, bốn tín hiệu vàng, EMF.',
      content: L102_EN + L102_VI,
    },
    {
      title: '10.3 — Alarms that matter, routed to SNS|||10.3 — Cảnh báo đáng có, gửi qua SNS',
      slug: 'aws-10-3-alarms',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba trạng thái, M trong N, treat-missing-data, actions; chạy thật lỗi ⇒ ALARM ⇒ thư SNS ⇒ hết lỗi ⇒ OK; set-alarm-state để thử đường báo; cảnh báo hoá đơn us-east-1; 2 trong 3 (LocalStack đòi đủ 3 — ghi rõ), cảnh báo ghép; bảng cảnh báo đáng có; Knight Capital 2012 với 97 email không ai đọc; cảnh báo làm cảm biến an ninh; bot Telegram ⇒ SNS.',
      content: L103_EN + L103_VI,
    },
    {
      title: '10.4 — Tracing and auditing: X-Ray, CloudTrail, Config|||10.4 — Truy vết và kiểm toán: X-Ray, CloudTrail, Config',
      slug: 'aws-10-4-tracing',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Trace, span, traceparent, sampling, ADOT ⇒ X-Ray; OpenTelemetry chạy thật qua API + dịch vụ phòng vào Jaeger: yêu cầu 0,81 s, truy vấn 800 ms; nối log với trace bằng traceId; CloudTrail (event history 90 ngày, trail, data event, validation), AWS Config (recorder, rule); bảng năm công cụ hay nhầm; EleKtra-Leak 2023 dựng lại từ CloudTrail.',
      content: L104_EN + L104_VI,
    },
    {
      title: '10.5 — Chapter 10 lab + interview questions|||10.5 — Lab chương 10 + câu hỏi phỏng vấn',
      slug: 'aws-10-5-lab-10',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Giám sát cho API LabFlow: retention 14 ngày, log không lộ bí mật, JSON + requestId, chỉ số chỉ theo route, cảnh báo 2 trong 3 có action OK, hộp thư nhận thư thử, dashboard p99; bộ chấm 8 phép (cấu hình + hành vi); bản vội 1/8 ⇒ lời giải 8/8 ⇒ dọn ⇒ năm số 0; giá tháng; năm câu phỏng vấn vận hành (trực sự cố, SLI/SLO/error budget).',
      content: L105_EN + L105_VI,
    },
    {
      title: '10.6 — Chapter 10 quiz|||10.6 — Kiểm tra Chương 10',
      slug: 'aws-10-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu từ các output đã chạy trong chương 10.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ10 },
    },
  ],
};
