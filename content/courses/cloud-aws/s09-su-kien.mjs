/**
 * Cloud AWS — Chương 9: Hướng sự kiện — SQS, SNS và EventBridge
 * (soạn 20/11/2026, agent aws; phiên 31 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   9.1 sqs · 9.2 sns · 9.3 eventbridge · 9.4 s3-trigger · 9.5 lab-9 · 9.6 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c9/91.sh, 91b.sh, 92.sh, 93.sh, 94.sh, lab9/chay.sh:
 *   - AWS CLI 2.41.0 (một container sống lâu aws-c9-cli + docker exec) → LocalStack 4.12 (community): SQS, SNS, EventBridge,
 *     Scheduler, S3, DynamoDB, Lambda nodejs22.x chạy THẬT trong container con (sharp 0.34 + libvips dựng sẵn linux-x64);
 *   - Node.js 22 + AWS SDK v3 (@aws-sdk/client-sqs, lib-dynamodb) cho consumer idempotent và phép đo long polling;
 *   - giá: Price List API Singapore 11/2026 (~/.rtq-aws/c9/gia).
 * Khác AWS đã ghi rõ trong bài: LocalStack không kiểm IAM/queue policy/topic policy; đăng ký email trả ARN ngay (AWS: pending
 *   confirmation); input transformer lỗi khi chèn trường SỐ (TargetDeliveryFailure) ⇒ template chỉ chèn chuỗi; Scheduler chỉ lưu,
 *   KHÔNG thực thi lịch; URL hàng đợi dạng sqs.<region>.localhost.localstack.cloud:43966.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/js() của _chung.mjs.
 */
import { bash, json, js, out, tl, giai } from './_chung.mjs';
/* ═════ Output THẬT (scratchpad/aws/lab/c9: AWS CLI 2.41.0 → LocalStack 4.12 (SQS, SNS, EventBridge, Scheduler, S3, Lambda nodejs22 + sharp); Node.js 22 + AWS SDK v3) ═════ */
const OUT_91_DLQ = out("$ aws sqs create-queue --queue-name labflow-email-dlq --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-email-dlq\n$ aws sqs create-queue --queue-name labflow-email --attributes file:///aws/thuoc.json --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-email\n$ Q=$(aws sqs get-queue-url --queue-name labflow-email --query QueueUrl --output text)\n$ aws sqs send-message --queue-url $Q --message-body '{\"datPhong\":\"DP-102\",\"email\":\"khong-hop-le\"}' --query MessageId --output text\n7b05debe-ee15-440b-bc26-d970802a16e3\n# Consumer lỗi với tin này (email hỏng) nên KHÔNG xoá — nhận lại 4 lần, mỗi lần cách 3 giây\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\nBody: {\"datPhong\":\"DP-102\",\"email\":\"khong-hop-le\"}   · lần nhận: 1\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\nBody: {\"datPhong\":\"DP-102\",\"email\":\"khong-hop-le\"}   · lần nhận: 2\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\nBody: {\"datPhong\":\"DP-102\",\"email\":\"khong-hop-le\"}   · lần nhận: 3\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\n(không có tin nào)\nhàng chính: 0 tin · DLQ: 1 tin\n$ Q=$(aws sqs get-queue-url --queue-name labflow-email-dlq --query QueueUrl --output text)\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount --visibility-timeout 0\nBody: {\"datPhong\":\"DP-102\",\"email\":\"khong-hop-le\"}   · lần nhận: 4\n# Sửa xong consumer ⇒ đưa tin từ DLQ về hàng gốc (redrive)\n$ aws sqs start-message-move-task --source-arn arn:aws:sqs:ap-southeast-1:000000000000:labflow-email-dlq\n$ aws sqs list-message-move-tasks --source-arn arn:aws:sqs:ap-southeast-1:000000000000:labflow-email-dlq --query 'Results[0].[Status,ApproximateNumberOfMessagesMoved]' --output text\nCOMPLETED\t1\nhàng chính: 1 tin · DLQ: 0 tin");
const OUT_91_FIFO = out("$ aws sqs create-queue --queue-name labflow-datphong.fifo --attributes 'FifoQueue=true,VisibilityTimeout=10' --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-datphong.fifo\n$ Q=$(aws sqs get-queue-url --queue-name labflow-datphong.fifo --query QueueUrl --output text)\n$ aws sqs send-message --queue-url $Q --message-group-id phong-A101 --message-deduplication-id dp-1 --message-body A101:dat-1 --query '[MessageId,SequenceNumber]' --output text\n48f239a7-6cfd-4282-ab01-e995e9b03ed9\t15420161305473974272\n$ aws sqs send-message --queue-url $Q --message-group-id phong-A101 --message-deduplication-id dp-2 --message-body A101:huy-1 --query '[MessageId,SequenceNumber]' --output text\ndbb18a5d-9f16-47e4-8461-e7763ddade8e\t15420161305473974273\n$ aws sqs send-message --queue-url $Q --message-group-id phong-B202 --message-deduplication-id dp-3 --message-body B202:dat-1 --query '[MessageId,SequenceNumber]' --output text\ne66e6f40-092d-4c69-85ce-f389d61e5e19\t15420161305473974274\n$ aws sqs send-message --queue-url $Q --message-group-id phong-A101 --message-deduplication-id dp-1 --message-body A101:dat-1 --query '[MessageId,SequenceNumber]' --output text\n48f239a7-6cfd-4282-ab01-e995e9b03ed9\t15420161305473974275\n# Tin thứ 4 trùng deduplication id dp-1 trong 5 phút ⇒ SQS nhận nhưng KHÔNG giao lần nữa\n# Nhận từng tin một, KHÔNG xoá:\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount MessageGroupId\nBody: A101:dat-1   · lần nhận: 1   · nhóm: phong-A101\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount MessageGroupId\nBody: B202:dat-1   · lần nhận: 1   · nhóm: phong-B202\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount MessageGroupId\n(không có tin nào)\n# Lần 3 rỗng: A101:huy-1 bị GIỮ vì A101:dat-1 cùng nhóm còn đang xử lý. Chờ 11 giây (hết visibility), nhận lô 10 tin:\n$ aws sqs receive-message --queue-url $Q --max-number-of-messages 10 --attribute-names MessageGroupId\nBody: A101:dat-1   · nhóm: phong-A101\nBody: A101:huy-1   · nhóm: phong-A101\nBody: B202:dat-1   · nhóm: phong-B202\n# Cùng nhóm phong-A101: dat-1 LUÔN ra trước huy-1. Đã xoá cả ba tin.");
const OUT_91_HIEN = out("# Hàng đợi standard: visibility timeout 10 giây (mặc định 30), giữ tin 1 ngày (mặc định 4 ngày)\n$ aws sqs create-queue --queue-name labflow-thongbao --attributes 'VisibilityTimeout=10,MessageRetentionPeriod=86400' --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-thongbao\n$ Q=$(aws sqs get-queue-url --queue-name labflow-thongbao --query QueueUrl --output text)\n$ aws sqs send-message --queue-url $Q --message-body '{\"datPhong\":\"DP-101\",\"phong\":\"A101\",\"email\":\"sv@example.com\"}' --query MessageId --output text\n22d7003f-50ef-4412-a461-75eaf29ea527\n# Lần nhận 1 — tin chuyển sang trạng thái 'đang xử lý' (ẩn với người khác 10 giây)\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\nBody: {\"datPhong\":\"DP-101\",\"phong\":\"A101\",\"email\":\"sv@example.com\"}   · lần nhận: 1\n# Nhận lại NGAY — một consumer khác hỏi cùng lúc\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\n(không có tin nào)\n$ aws sqs get-queue-attributes --queue-url $Q --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible --query Attributes --output json\n{\n    \"ApproximateNumberOfMessages\": \"0\",\n    \"ApproximateNumberOfMessagesNotVisible\": \"1\"\n}\n# Chờ 11 giây. Consumer 1 'chết' trước khi gọi delete-message ⇒ tin hiện lại\n$ aws sqs receive-message --queue-url $Q --attribute-names ApproximateReceiveCount\nBody: {\"datPhong\":\"DP-101\",\"phong\":\"A101\",\"email\":\"sv@example.com\"}   · lần nhận: 2\n# Lần này xử lý xong ⇒ xoá bằng ReceiptHandle của LẦN NHẬN NÀY\n$ RH=<ReceiptHandle của lần nhận vừa rồi>\n$ aws sqs delete-message --queue-url $Q --receipt-handle \"$RH\"\n$ aws sqs get-queue-attributes --queue-url $Q --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible --query Attributes --output json\n{\n    \"ApproximateNumberOfMessages\": \"0\",\n    \"ApproximateNumberOfMessagesNotVisible\": \"0\"\n}");
const OUT_91_IDEM = out("$ aws dynamodb create-table --table-name labflow-da-gui --attribute-definitions 'AttributeName=datPhong,AttributeType=S' --key-schema 'AttributeName=datPhong,KeyType=HASH' --billing-mode PAY_PER_REQUEST --query TableDescription.TableStatus --output text\nACTIVE\n$ aws sqs create-queue --queue-name labflow-gui-mail --attributes VisibilityTimeout=10 --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-gui-mail\n$ Q=$(aws sqs get-queue-url --queue-name labflow-gui-mail --query QueueUrl --output text)\n# Cùng một đặt phòng bị gửi 2 lần (SQS standard = at-least-once: chuyện này CÓ xảy ra)\n$ aws sqs send-message --queue-url $Q --message-body '{\"datPhong\":\"DP-103\",\"email\":\"sv@example.com\"}' --query MessageId --output text\nf90d1832-9708-4e7c-ae26-7c8d48be3f12\n$ aws sqs send-message --queue-url $Q --message-body '{\"datPhong\":\"DP-103\",\"email\":\"sv@example.com\"}' --query MessageId --output text\nec5b9615-9853-4ecb-a7cf-9db88f9b5294\n$ aws sqs send-message --queue-url $Q --message-body '{\"datPhong\":\"DP-104\",\"email\":\"gv@example.com\"}' --query MessageId --output text\n3f6f658a-3ca5-4582-b907-6caa2c948344\n$ QUEUE_URL=$Q node consumer.mjs\nDP-103: gửi email xác nhận tới sv@example.com\nDP-103: bỏ qua — đã gửi rồi (tin trùng)\nDP-104: gửi email xác nhận tới gv@example.com\nxử lý 3 tin, hàng đợi đã xoá cả 3\n# chạy lại consumer lần nữa (hàng đã rỗng):\n$ QUEUE_URL=$Q node consumer.mjs\nxử lý 0 tin, hàng đợi đã xoá cả 0");
const OUT_91_POLL = out("$ node poll.mjs\nWaitTimeSeconds=0  ⇒     7 ms, 0 tin\nWaitTimeSeconds=5  ⇒  5006 ms, 0 tin\nWaitTimeSeconds=20 ⇒  2014 ms, 1 tin (tin-toi-o-giay-thu-2)");
const OUT_92_FANOUT = out("$ aws sns create-topic --name labflow-datphong --query TopicArn --output text\narn:aws:sns:ap-southeast-1:000000000000:labflow-datphong\n$ T=arn:aws:sns:ap-southeast-1:000000000000:labflow-datphong\n# Trên AWS: hàng đợi phải có queue policy cho sns.amazonaws.com với aws:SourceArn = topic (LocalStack không kiểm, xem bài)\n$ aws sns subscribe --topic-arn $T --protocol sqs --notification-endpoint arn:aws:sqs:ap-southeast-1:000000000000:labflow-email --query SubscriptionArn --output text\narn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:91f47093-919b-4a80-9d3d-a6833431cdb8\n$ aws sns subscribe --topic-arn $T --protocol sqs --notification-endpoint arn:aws:sqs:ap-southeast-1:000000000000:labflow-hoantien --attributes '{\"RawMessageDelivery\":\"true\",\"FilterPolicy\":\"{\\\"loai\\\":[\\\"huy\\\"]}\"}' --query SubscriptionArn --output text\narn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:e77c6514-9887-4438-9010-aa5cdd98edaa\n$ aws sns subscribe --topic-arn $T --protocol email --notification-endpoint admin@example.com --query SubscriptionArn --output text\narn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:24b55a9b-de84-493a-9116-c9a754ddbdef\n$ aws sns list-subscriptions-by-topic --topic-arn $T --query 'Subscriptions[].[Protocol,Endpoint,SubscriptionArn]' --output text\nsqs\tarn:aws:sqs:ap-southeast-1:000000000000:labflow-email\tarn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:91f47093-919b-4a80-9d3d-a6833431cdb8\nsqs\tarn:aws:sqs:ap-southeast-1:000000000000:labflow-hoantien\tarn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:e77c6514-9887-4438-9010-aa5cdd98edaa\nemail\tadmin@example.com\tarn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:24b55a9b-de84-493a-9116-c9a754ddbdef\n# Phát 2 sự kiện — người gửi KHÔNG biết có bao nhiêu nơi nhận\n$ aws sns publish --topic-arn $T --message '{\"datPhong\":\"DP-201\",\"phong\":\"A101\"}' --message-attributes '{\"loai\":{\"DataType\":\"String\",\"StringValue\":\"dat\"}}' --query MessageId --output text\nff04c15f-fbb5-49ca-8066-13144ee0df26\n$ aws sns publish --topic-arn $T --message '{\"datPhong\":\"DP-202\",\"phong\":\"B202\"}' --message-attributes '{\"loai\":{\"DataType\":\"String\",\"StringValue\":\"huy\"}}' --query MessageId --output text\neffcd749-06b9-4a5b-ad2c-ebb5cd8fdab6\nlabflow-email: 2 tin · labflow-hoantien: 1 tin");
const OUT_92_HINHDANG = out("# labflow-email (không bật raw) — thân tin là PHONG BÌ JSON của SNS:\n$ aws sqs receive-message --queue-url $QE --query 'Messages[0].Body' --output text | jq\n{\n  \"Type\": \"Notification\",\n  \"MessageId\": \"ff04c15f-fbb5-49ca-8066-13144ee0df26\",\n  \"TopicArn\": \"arn:aws:sns:ap-southeast-1:000000000000:labflow-datphong\",\n  \"Message\": \"{\\\"datPhong\\\":\\\"DP-201\\\",\\\"phong\\\":\\\"A101\\\"}\",\n  \"MessageAttributes\": {\n    \"loai\": {\n      \"Type\": \"String\",\n      \"Value\": \"dat\"\n    }\n  },\n  \"Timestamp\": \"2026-11-20T02:53:44.353Z\",\n  \"SignatureVersion\": \"1\"\n}\n# labflow-hoantien (RawMessageDelivery=true + chỉ loai=huy) — thân tin là đúng chuỗi đã publish:\n$ Q=$(aws sqs get-queue-url --queue-name labflow-hoantien --query QueueUrl --output text)\n$ aws sqs receive-message --queue-url $Q --max-number-of-messages 10\nBody: {\"datPhong\":\"DP-202\",\"phong\":\"B202\"}");
const OUT_93_LICH = out("$ aws events put-rule --name don-dat-phong-qua-han --schedule-expression 'rate(1 minute)' --query RuleArn --output text\narn:aws:events:ap-southeast-1:000000000000:rule/don-dat-phong-qua-han\n$ aws events put-targets --rule don-dat-phong-qua-han --targets \"Id=q,Arn=arn:aws:sqs:ap-southeast-1:000000000000:labflow-nhac,Input='{\"viec\":\"don-qua-han\"}'\" --query FailedEntryCount --output text\n0\n# Nhắc DP-301 lúc 2026-11-20T10:04:00 giờ Việt Nam (thử: 1 phút nữa; thật: 30 phút trước giờ vào lab)\n$ aws scheduler create-schedule --name nhac-DP-301 --schedule-expression 'at(2026-11-20T10:04:00)' --schedule-expression-timezone Asia/Ho_Chi_Minh --flexible-time-window Mode=OFF --action-after-completion DELETE --target '{\"Arn\":\"arn:aws:sqs:ap-southeast-1:000000000000:labflow-nhac\",\"RoleArn\":\"arn:aws:iam::000000000000:role/labflow-scheduler-role\",\"Input\":\"{\\\"nhac\\\":\\\"DP-301\\\",\\\"phong\\\":\\\"A101\\\"}\"}' --query ScheduleArn --output text\narn:aws:scheduler:ap-southeast-1:000000000000:schedule/default/nhac-DP-301\n$ aws scheduler get-schedule --name nhac-DP-301 --query '[ScheduleExpression,ScheduleExpressionTimezone,State]' --output text\nat(2026-11-20T10:04:00)\tAsia/Ho_Chi_Minh\tENABLED\n# sau 130 giây:\n$ Q=$(aws sqs get-queue-url --queue-name labflow-nhac --query QueueUrl --output text)\n$ aws sqs receive-message --queue-url $Q --max-number-of-messages 10\nBody: {\"viec\":\"don-qua-han\"}\nBody: {\"viec\":\"don-qua-han\"}\n$ aws scheduler list-schedules --query 'Schedules[].[Name,State]' --output text\nnhac-DP-301\tENABLED\n$ aws events disable-rule --name don-dat-phong-qua-han");
const OUT_93_LUAT = out("$ aws events create-event-bus --name labflow --query EventBusArn --output text\narn:aws:events:ap-southeast-1:000000000000:event-bus/labflow\n$ aws events put-rule --name phong-a-dong-nguoi --event-bus-name labflow --event-pattern file:///aws/mau.json --query RuleArn --output text\narn:aws:events:ap-southeast-1:000000000000:rule/labflow/phong-a-dong-nguoi\n$ aws events put-targets --rule phong-a-dong-nguoi --event-bus-name labflow --targets file:///aws/dich.json --query FailedEntryCount --output text\n0\n# Ba sự kiện: A101/35 người · A102/4 người · B202/40 người\n$ aws events put-events --entries file:///aws/sk.json --query '[FailedEntryCount, length(Entries)]' --output text\n0\t3\n$ Q=$(aws sqs get-queue-url --queue-name labflow-phong-a --query QueueUrl --output text)\n$ aws sqs receive-message --queue-url $Q --max-number-of-messages 10\nBody: {\"datPhong\":\"DP-301\",\"phong\":\"A101\",\"luc\":\"2026-11-20T03:03:22Z\",\"canKyThuatVien\":true}");
const OUT_93_THUMAU = out("$ aws events test-event-pattern --event-pattern file:///aws/mau.json --event file:///aws/thu.json\n{\n    \"Result\": false\n}\n# đổi soNguoi 29 ⇒ 30\n$ aws events test-event-pattern --event-pattern file:///aws/mau.json --event file:///aws/thu.json\n{\n    \"Result\": true\n}");
const OUT_94_ANH = out("$ node tao-anh.mjs anh\nphong-a101.jpg       1048582 byte\nphong-b202.png       5353609 byte\nso-do-tang-3.jpg     6557633 byte\nhong.jpg                  19 byte\nbom.png               119943 byte");
const OUT_94_DLQ = out("# sau thêm 80 giây (2 lần nhận × visibility 60 s):\nlabflow-anh-viec: 0 tin · labflow-anh-dlq: 2 tin\n$ aws sqs receive-message --queue-url $DLQ_URL --max-number-of-messages 10 --query 'Messages[].Body' --output text | jq -r '.Records[0].s3.object.key'\ngoc/hong.jpg\ngoc/bom.png\n$ aws logs filter-log-events --log-group-name /aws/lambda/labflow-thunho --query 'events[].message' --output text | tr '\\t' '\\n' | grep -E '\"(hong|xong)\"' | sort | uniq -c   # messageId rút gọn\n2 {\"hong\":\"<messageId>\",\"loi\":\"Input buffer contains unsupported image format\"}\n2 {\"hong\":\"<messageId>\",\"loi\":\"Input image exceeds pixel limit\"}\n1 {\"xong\":\"goc/phong-a101.jpg\",\"ra\":\"nho/phong-a101.webp\",\"byteVao\":1048582,\"byteRa\":8472}\n1 {\"xong\":\"goc/phong-b202.png\",\"ra\":\"nho/phong-b202.webp\",\"byteVao\":5353609,\"byteRa\":24690}\n1 {\"xong\":\"goc/so-do-tang-3.jpg\",\"ra\":\"nho/so-do-tang-3.webp\",\"byteVao\":6557633,\"byteRa\":506}\n# thời gian mỗi lần gọi (dòng REPORT):\n  Duration: 2.17 ms Billed Duration: 3 ms\n  Duration: 375.22 ms Billed Duration: 376 ms\n  Duration: 32.40 ms Billed Duration: 33 ms");
const OUT_94_DUNG = out("$ aws s3api create-bucket --bucket labflow-anh-goc --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\nhttp://labflow-anh-goc.s3.localhost.localstack.cloud:43966/\n$ aws s3api create-bucket --bucket labflow-anh-nho --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\nhttp://labflow-anh-nho.s3.localhost.localstack.cloud:43966/\n$ aws sqs create-queue --queue-name labflow-anh-dlq --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-anh-dlq\n$ aws sqs create-queue --queue-name labflow-anh-viec --attributes file:///aws/thuoc.json --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:43966/000000000000/labflow-anh-viec\n$ aws s3api put-bucket-notification-configuration --bucket labflow-anh-goc --notification-configuration file:///aws/tb.json\n# gói hàm: 7.5M (index.mjs + sharp + libvips) — dưới trần 50 MB của zip tải thẳng\n$ aws lambda create-function --function-name labflow-thunho --runtime nodejs22.x --architectures x86_64 --handler index.handler --zip-file fileb:///aws/thunho.zip --role arn:aws:iam::000000000000:role/labflow-thunho-role --memory-size 1024 --timeout 30 --environment 'Variables={BUCKET_DICH=labflow-anh-nho}' --query '[FunctionName,CodeSize]' --output text\nlabflow-thunho\t7786975\n$ aws lambda create-event-source-mapping --function-name labflow-thunho --event-source-arn arn:aws:sqs:ap-southeast-1:000000000000:labflow-anh-viec --batch-size 5 --maximum-batching-window-in-seconds 2 --function-response-types ReportBatchItemFailures --query '[State,BatchSize,FunctionResponseTypes[0]]' --output text\nCreating\t5\tReportBatchItemFailures\n$ aws s3 cp --no-progress /aws/anh/phong-a101.jpg s3://labflow-anh-goc/goc/phong-a101.jpg\nupload: anh/phong-a101.jpg to s3://labflow-anh-goc/goc/phong-a101.jpg\n$ aws s3 cp --no-progress /aws/anh/phong-b202.png s3://labflow-anh-goc/goc/phong-b202.png\nupload: anh/phong-b202.png to s3://labflow-anh-goc/goc/phong-b202.png\n$ aws s3 cp --no-progress /aws/anh/so-do-tang-3.jpg s3://labflow-anh-goc/goc/so-do-tang-3.jpg\nupload: anh/so-do-tang-3.jpg to s3://labflow-anh-goc/goc/so-do-tang-3.jpg\n$ aws s3 cp --no-progress /aws/anh/hong.jpg s3://labflow-anh-goc/goc/hong.jpg\nupload: anh/hong.jpg to s3://labflow-anh-goc/goc/hong.jpg\n$ aws s3 cp --no-progress /aws/anh/bom.png s3://labflow-anh-goc/goc/bom.png\nupload: anh/bom.png to s3://labflow-anh-goc/goc/bom.png\n$ aws s3 cp --no-progress /aws/anh/phong-a101.jpg s3://labflow-anh-goc/tam/khong-xu-ly.jpg\nupload: anh/phong-a101.jpg to s3://labflow-anh-goc/tam/khong-xu-ly.jpg");
const OUT_94_KETQUA = out("# sau 45 giây:\n$ aws s3 ls s3://labflow-anh-nho --recursive\n2026-11-20 02:59:17       8472 nho/phong-a101.webp\n2026-11-20 02:59:17      24690 nho/phong-b202.webp\n2026-11-20 02:59:17        506 nho/so-do-tang-3.webp\n$ node xem-nho.mjs nho-ve\nphong-a101.webp    webp 320×240        8472 byte\nphong-b202.webp    webp 320×427       24690 byte\nso-do-tang-3.webp  webp 320×240         506 byte\nlabflow-anh-viec: 0 tin chờ · đang xử lý/ẩn: 2");
const OUT_95_LAB = out("$ bash truoc.sh\nđã dựng bản vội\n$ bash cham.sh\n✅ 1. Có topic labflow-datphong\n❌ 2. labflow-email có DLQ labflow-email-dlq, maxReceiveCount = 3\n❌ 3. VisibilityTimeout ≥ 60 giây (6 × timeout 10 giây của consumer) — đang là 30\n❌ 4. Long polling 20 giây — đang là 0\n❌ 5. Đăng ký labflow-email bật RawMessageDelivery\n❌ 6. Đăng ký labflow-hoantien lọc đúng loai = huy\n❌ 7. Queue policy labflow-email: chỉ sns.amazonaws.com, kèm aws:SourceArn = topic\n❌ 8. Chạy thật: publish 1 dat + 1 huy ⇒ labflow-email nhận 2, labflow-hoantien nhận 1 (đang 2 và 2)\nĐIỂM: 1/8\n$ bash giai.sh\nđã sửa theo lời giải\n$ bash cham.sh\n✅ 1. Có topic labflow-datphong\n✅ 2. labflow-email có DLQ labflow-email-dlq, maxReceiveCount = 3\n✅ 3. VisibilityTimeout ≥ 60 giây (6 × timeout 10 giây của consumer) — đang là 60\n✅ 4. Long polling 20 giây — đang là 20\n✅ 5. Đăng ký labflow-email bật RawMessageDelivery\n✅ 6. Đăng ký labflow-hoantien lọc đúng loai = huy\n✅ 7. Queue policy labflow-email: chỉ sns.amazonaws.com, kèm aws:SourceArn = topic\n✅ 8. Chạy thật: publish 1 dat + 1 huy ⇒ labflow-email nhận 2, labflow-hoantien nhận 1 (đang 2 và 1)\nĐIỂM: 8/8\n$ bash don.sh\n$ aws sns unsubscribe --subscription-arn arn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:c2eab54b-0188-4b04-9232-5102be1b1760\n$ aws sns unsubscribe --subscription-arn arn:aws:sns:ap-southeast-1:000000000000:labflow-datphong:1d9c074a-9504-4cd1-a393-ab7411076481\n$ aws sns delete-topic --topic-arn $T\n# hàng labflow-email\n$ aws sqs delete-queue --queue-url $Q\n# hàng labflow-hoantien\n$ aws sqs delete-queue --queue-url $Q\n# hàng labflow-email-dlq\n$ aws sqs delete-queue --queue-url $Q\n$ bash con-gi.sh\nHàng đợi SQS:      0\nTopic SNS:         0\nĐăng ký SNS:       0\nLuật EventBridge:  0\nLịch Scheduler:    0");
const MA_CONSUMER = js("// Consumer gửi email đặt phòng — IDEMPOTENT: ghi \"đã gửi\" vào DynamoDB với điều kiện chưa tồn tại TRƯỚC khi gửi.\nimport { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from \"@aws-sdk/client-sqs\";\nimport { DynamoDBClient } from \"@aws-sdk/client-dynamodb\";\nimport { DynamoDBDocumentClient, PutCommand } from \"@aws-sdk/lib-dynamodb\";\n\nconst cauHinh = { region: \"ap-southeast-1\", endpoint: \"http://127.0.0.1:43966\" }; // trên AWS: bỏ endpoint\nconst sqs = new SQSClient(cauHinh);\nconst ddb = DynamoDBDocumentClient.from(new DynamoDBClient(cauHinh));\nconst QueueUrl = process.env.QUEUE_URL;\n\nasync function daGuiChua(datPhong) {\n  try {\n    await ddb.send(new PutCommand({\n      TableName: \"labflow-da-gui\",\n      Item: { datPhong, luc: new Date().toISOString() },\n      ConditionExpression: \"attribute_not_exists(datPhong)\",\n    }));\n    return false; // ghi được ⇒ lần đầu\n  } catch (e) {\n    if (e.name === \"ConditionalCheckFailedException\") return true;\n    throw e;\n  }\n}\n\nconst { Messages = [] } = await sqs.send(new ReceiveMessageCommand({ QueueUrl, MaxNumberOfMessages: 10, WaitTimeSeconds: 2 }));\nfor (const m of Messages) {\n  const { datPhong, email } = JSON.parse(m.Body);\n  if (await daGuiChua(datPhong)) console.log(`${datPhong}: bỏ qua — đã gửi rồi (tin trùng)`);\n  else console.log(`${datPhong}: gửi email xác nhận tới ${email}`);\n  await sqs.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: m.ReceiptHandle }));\n}\nconsole.log(`xử lý ${Messages.length} tin, hàng đợi đã xoá cả ${Messages.length}`);");
const MA_THUNHO = js("// Lambda tạo ảnh thu nhỏ: SQS (chứa sự kiện S3) ⇒ đọc ảnh gốc ⇒ sharp ⇒ ghi WebP 320 px sang BUCKET KHÁC (không tự kích hoạt lại).\nimport { S3Client, GetObjectCommand, PutObjectCommand } from \"@aws-sdk/client-s3\";\nimport sharp from \"sharp\";\n\nconst s3 = new S3Client({}); // tạo một lần mỗi môi trường, dùng lại ở lần gọi ấm\nconst DICH = process.env.BUCKET_DICH;\n\nexport const handler = async (event) => {\n  const hong = [];\n  for (const tin of event.Records) { // mỗi phần tử là MỘT tin SQS\n    try {\n      const s3ev = JSON.parse(tin.body);\n      for (const r of s3ev.Records ?? []) { // tin s3:TestEvent không có Records\n        const bucket = r.s3.bucket.name;\n        const key = decodeURIComponent(r.s3.object.key.replace(/\\+/g, \" \"));\n        const goc = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));\n        const vao = Buffer.from(await goc.Body.transformToByteArray());\n        const ra = await sharp(vao, { limitInputPixels: 25_000_000 }) // chặn \"bom giải nén\"\n          .rotate()\n          .resize({ width: 320, withoutEnlargement: true })\n          .webp({ quality: 80 })\n          .toBuffer();\n        const keyRa = key.replace(/^goc\\//, \"nho/\").replace(/\\.[^./]+$/, \".webp\");\n        await s3.send(new PutObjectCommand({ Bucket: DICH, Key: keyRa, Body: ra, ContentType: \"image/webp\" }));\n        console.log(JSON.stringify({ xong: key, ra: keyRa, byteVao: vao.length, byteRa: ra.length }));\n      }\n    } catch (e) {\n      console.log(JSON.stringify({ hong: tin.messageId, loi: e.message }));\n      hong.push({ itemIdentifier: tin.messageId }); // CHỈ tin này quay lại hàng đợi\n    }\n  }\n  return { batchItemFailures: hong };\n};");
const MA_CHAM = bash("#!/bin/bash\n# Bộ chấm lab 9 — 8 phép. Chạy: bash cham.sh  (in ĐIỂM x/8)\nsource ~/vbg-dp/scratchpad/aws/lab/c9/chung9.sh; bat_cli9\nT=arn:aws:sns:ap-southeast-1:000000000000:labflow-datphong; d=0\nok() { if [ \"$2\" = 1 ]; then echo \"✅ $1\"; d=$((d+1)); else echo \"❌ $1\"; fi; }\nQE=$(quurl labflow-email); QH=$(quurl labflow-hoantien)\ntt() { a sqs get-queue-attributes --queue-url \"$QE\" --attribute-names All --query \"Attributes.$1\" --output text; }\nsub() { a sns list-subscriptions-by-topic --topic-arn $T --query \"Subscriptions[?ends_with(Endpoint, \\`:$1\\`)].SubscriptionArn | [0]\" --output text; }\nsa() { [ -n \"$1\" ] && [ \"$1\" != None ] && a sns get-subscription-attributes --subscription-arn \"$1\" --query \"Attributes.$2\" --output text; }\nok \"1. Có topic labflow-datphong\" $(a sns get-topic-attributes --topic-arn $T >/dev/null && echo 1)\nRP=$(tt RedrivePolicy)\nok \"2. labflow-email có DLQ labflow-email-dlq, maxReceiveCount = 3\" $(echo \"$RP\" | grep -q 'labflow-email-dlq' && echo \"$RP\" | grep -Eq '\"maxReceiveCount\": ?\"?3\"?' && echo 1)\nV=$(tt VisibilityTimeout); ok \"3. VisibilityTimeout ≥ 60 giây (6 × timeout 10 giây của consumer) — đang là ${V:-?}\" $([ \"${V:-0}\" -ge 60 ] 2>/dev/null && echo 1)\nW=$(tt ReceiveMessageWaitTimeSeconds); ok \"4. Long polling 20 giây — đang là ${W:-?}\" $([ \"$W\" = 20 ] && echo 1)\nSE=$(sub labflow-email); SH=$(sub labflow-hoantien)\nok \"5. Đăng ký labflow-email bật RawMessageDelivery\" $([ \"$(sa \"$SE\" RawMessageDelivery)\" = true ] && echo 1)\nFP=$(sa \"$SH\" FilterPolicy | tr -d ' \\n'); ok \"6. Đăng ký labflow-hoantien lọc đúng loai = huy\" $([ \"$FP\" = '{\"loai\":[\"huy\"]}' ] && echo 1)\nP=$(tt Policy); ok \"7. Queue policy labflow-email: chỉ sns.amazonaws.com, kèm aws:SourceArn = topic\" $(echo \"$P\" | grep -q 'sns.amazonaws.com' && echo \"$P\" | grep -q \"aws:SourceArn\" && echo \"$P\" | grep -q \"$T\" && echo 1)\nfor u in \"$QE\" \"$QH\"; do [ -n \"$u\" ] && a sqs purge-queue --queue-url \"$u\"; done; sleep 1\na sns publish --topic-arn $T --message '{\"datPhong\":\"DP-901\"}' --message-attributes '{\"loai\":{\"DataType\":\"String\",\"StringValue\":\"dat\"}}' >/dev/null\na sns publish --topic-arn $T --message '{\"datPhong\":\"DP-902\"}' --message-attributes '{\"loai\":{\"DataType\":\"String\",\"StringValue\":\"huy\"}}' >/dev/null\nsleep 2; NE=$(dem labflow-email); NH=$(dem labflow-hoantien)\nok \"8. Chạy thật: publish 1 dat + 1 huy ⇒ labflow-email nhận 2, labflow-hoantien nhận 1 (đang ${NE:-?} và ${NH:-?})\" $([ \"$NE\" = 2 ] && [ \"$NH\" = 1 ] && echo 1)\necho \"ĐIỂM: $d/8\"");
const MA_TRUOC = bash("#!/bin/bash\n# Bản \"làm vội\": topic + 2 hàng đợi mặc định, đăng ký trần — chạy được, nhưng sai ở mọi chỗ quan trọng\nsource ~/vbg-dp/scratchpad/aws/lab/c9/chung9.sh; bat_cli9\nT=$(a sns create-topic --name labflow-datphong --query TopicArn --output text)\nfor n in labflow-email labflow-hoantien; do a sqs create-queue --queue-name $n >/dev/null\n  a sns subscribe --topic-arn $T --protocol sqs --notification-endpoint \"$(quarn $n)\" >/dev/null; done\necho \"đã dựng bản vội\"");
const MA_GIAI = bash("#!/bin/bash\n# LỜI GIẢI lab 9 — đọc sau khi đã tự làm\nsource ~/vbg-dp/scratchpad/aws/lab/c9/chung9.sh; bat_cli9\nT=$(a sns create-topic --name labflow-datphong --query TopicArn --output text)\na sqs create-queue --queue-name labflow-email-dlq --attributes MessageRetentionPeriod=1209600 >/dev/null\nDLQ=$(quarn labflow-email-dlq); QE=$(quurl labflow-email); EARN=$(quarn labflow-email)\ncat > \"$LAM/chinh-sach.json\" <<J\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"sns.amazonaws.com\"},\"Action\":\"sqs:SendMessage\",\"Resource\":\"$EARN\",\"Condition\":{\"ArnEquals\":{\"aws:SourceArn\":\"$T\"}}}]}\nJ\njq -n --arg dlq \"$DLQ\" --rawfile p \"$LAM/chinh-sach.json\" '{VisibilityTimeout:\"60\",ReceiveMessageWaitTimeSeconds:\"20\",\n  RedrivePolicy:({deadLetterTargetArn:$dlq,maxReceiveCount:\"3\"}|tojson), Policy:($p|rtrimstr(\"\\n\"))}' > \"$LAM/thuoc-email.json\"\na sqs set-queue-attributes --queue-url \"$QE\" --attributes file:///aws/thuoc-email.json\nSE=$(a sns list-subscriptions-by-topic --topic-arn $T --query \"Subscriptions[?ends_with(Endpoint, \\`:labflow-email\\`)].SubscriptionArn | [0]\" --output text)\na sns set-subscription-attributes --subscription-arn \"$SE\" --attribute-name RawMessageDelivery --attribute-value true\nSH=$(a sns list-subscriptions-by-topic --topic-arn $T --query \"Subscriptions[?ends_with(Endpoint, \\`:labflow-hoantien\\`)].SubscriptionArn | [0]\" --output text)\na sns set-subscription-attributes --subscription-arn \"$SH\" --attribute-name FilterPolicy --attribute-value '{\"loai\":[\"huy\"]}'\necho \"đã sửa theo lời giải\"");
const MA_DON = bash("#!/bin/bash\n# Dọn lab 9 — đăng ký ⇒ topic ⇒ hàng đợi (kể cả DLQ) ⇒ luật/lịch EventBridge nếu có\nsource ~/vbg-dp/scratchpad/aws/lab/c9/chung9.sh; bat_cli9\nfor s in $(a sns list-subscriptions --query \"Subscriptions[].SubscriptionArn\" --output text); do L sns unsubscribe --subscription-arn $s; done\nfor t in $(a sns list-topics --query \"Topics[].TopicArn\" --output text); do L sns delete-topic --topic-arn $t; done\nfor u in $(a sqs list-queues --query \"QueueUrls[]\" --output text); do echo \"# hàng ${u##*/}\"; L sqs delete-queue --queue-url $u; done\nfor r in $(a events list-rules --query \"Rules[].Name\" --output text); do a events remove-targets --rule $r --ids q >/dev/null; L events delete-rule --name $r; done\nfor s in $(a scheduler list-schedules --query \"Schedules[].Name\" --output text); do L scheduler delete-schedule --name $s; done");
const MA_CONGI = bash("#!/bin/bash\n# Còn gì đang tính tiền? (Chương 9) — mỗi dòng phải là 0\nsource ~/vbg-dp/scratchpad/aws/lab/c9/chung9.sh; bat_cli9\necho \"Hàng đợi SQS:      $(a sqs list-queues --query \"length(QueueUrls || \\`[]\\`)\" --output text)\"\necho \"Topic SNS:         $(a sns list-topics --query \"length(Topics)\" --output text)\"\necho \"Đăng ký SNS:       $(a sns list-subscriptions --query \"length(Subscriptions)\" --output text)\"\necho \"Luật EventBridge:  $(a events list-rules --query \"length(Rules)\" --output text)\"\necho \"Lịch Scheduler:    $(a scheduler list-schedules --query \"length(Schedules)\" --output text)\"");

/* ═════ 9.1 — SQS ═════ */
const MA_CHINH_SACH_Q = json(`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "sns.amazonaws.com" },
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:ap-southeast-1:111122223333:labflow-email",
    "Condition": { "ArnEquals": { "aws:SourceArn": "arn:aws:sns:ap-southeast-1:111122223333:labflow-datphong" } }
  }]
}`);
const MA_THUOC = json(`{
  "VisibilityTimeout": "2",
  "RedrivePolicy": "{\\"deadLetterTargetArn\\":\\"arn:aws:sqs:ap-southeast-1:000000000000:labflow-email-dlq\\",\\"maxReceiveCount\\":\\"3\\"}"
}`);
const L91_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 1</span>
<h2>9.1 — SQS queues: standard, FIFO, dead-letter, and why your consumer must be idempotent</h2>
<p class="lead">Until now every LabFlow request did all its work before answering. Booking a room also sent the confirmation email — so a slow or broken email provider made booking slow or broken too. <strong>Amazon SQS</strong> (Simple Queue Service) lets the API drop a message in a queue and answer in milliseconds, while a separate worker does the slow part. This lesson runs SQS for real: a message hiding and reappearing, a "poison" message moving to a dead-letter queue and back, FIFO order inside a group, long polling, and a Node.js consumer that sends one email even when the same message arrives twice.</p>

<h3>The picture: order tickets in a restaurant kitchen</h3>
<p>The waiter pins a ticket on the rail and goes back to the tables — he does not stand there while the soup cooks (<strong>producer</strong> and <strong>queue</strong>). A cook takes the ticket; while he works on it, nobody else sees it (<strong>visibility timeout</strong>). When the dish is out he spikes the ticket (<strong>delete</strong>). If the cook faints, after a while the ticket goes back on the rail for another cook — so a dish can occasionally be cooked twice (<strong>at-least-once delivery</strong>). A ticket that fails again and again ("fish we do not have") goes to the manager's tray instead of blocking the rail (<strong>dead-letter queue</strong>).</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Message</strong> — up to 1 MiB of text (JSON usually). Larger payloads go to S3 and the message carries the key. A message stays 4 days by default (1 minute to 14 days: <code>MessageRetentionPeriod</code>).</li>
  <li><strong>Receive does not remove.</strong> <code>ReceiveMessage</code> hides the message for the visibility timeout (default 30 seconds, at most 12 hours) and hands you a <strong>receipt handle</strong>. Only <code>DeleteMessage</code> with that handle removes it.</li>
  <li><strong>Standard queue</strong> — almost unlimited throughput, <em>at-least-once</em> delivery, best-effort order. <strong>FIFO queue</strong> (name ends in <code>.fifo</code>) — order kept inside a <strong>message group</strong>, duplicates removed within a 5-minute window, lower throughput ceiling.</li>
  <li><strong>Dead-letter queue (DLQ)</strong> — a normal queue named in the source queue's <code>RedrivePolicy</code>; after <code>maxReceiveCount</code> receives without delete, SQS moves the message there.</li>
  <li><strong>Long polling</strong> — <code>WaitTimeSeconds</code> 1–20: the call waits until a message arrives instead of answering "empty" at once.</li>
</ul>

<h3>See it running (1): a message hides, then comes back</h3>
<p>All commands run against LocalStack 4.12. The queue URL is stored in <code>$Q</code> (on AWS it looks like <code>https://sqs.ap-southeast-1.amazonaws.com/&lt;account&gt;/labflow-thongbao</code>).</p>
${OUT_91_HIEN}
<ul>
  <li>The second receive got nothing: the message was <code>NotVisible: 1</code> — taken, not gone.</li>
  <li>Consumer 1 never deleted it, so after the 10-second timeout it came back with <strong>receive count 2</strong>. That is the whole safety net of SQS: a worker can crash at any line and the work is not lost.</li>
  <li>The price of that safety net: if consumer 1 had actually sent the email and crashed just <em>before</em> <code>delete-message</code>, the email goes out twice. Hold that thought for part (5).</li>
  <li>Pick the timeout from the real work: longer than the slowest normal processing time. Too short ⇒ duplicates; too long ⇒ a crashed message waits a long time before anyone retries it.</li>
</ul>

<h3>See it running (2): a poison message goes to the DLQ — and comes back after the fix</h3>
<p>The source queue gets a <code>RedrivePolicy</code> (a JSON string inside the attributes) pointing at the DLQ — file <code>thuoc.json</code>:</p>
${MA_THUOC}
${OUT_91_DLQ}
<ul>
  <li>The message had an invalid email; the consumer failed on it every time. After the 3rd receive (<code>maxReceiveCount: 3</code>) the next receive found nothing — SQS had moved it to <code>labflow-email-dlq</code>.</li>
  <li>Without a DLQ this message would loop until retention expires (4 days), costing a receive every time and hiding real failures. With a DLQ the main queue stays clean and the bad message waits for a human.</li>
  <li>The DLQ must be the <strong>same type</strong> (standard ⇒ standard, FIFO ⇒ FIFO), and its retention should be longer than the source queue's — for standard queues the age of a message is counted from the original enqueue, not from the move.</li>
  <li><strong>Redrive</strong> (<code>start-message-move-task</code>, or "Start DLQ redrive" in the console) moves messages back once the bug is fixed. Put a CloudWatch alarm on the DLQ's <code>ApproximateNumberOfMessagesVisible &gt; 0</code> (Chapter 10) — a DLQ nobody watches is a bin.</li>
</ul>

<h3>See it running (3): FIFO — order inside a group, duplicates removed</h3>
${OUT_91_FIFO}
<ul>
  <li>The 4th send reused deduplication id <code>dp-1</code>. SQS answered success (LocalStack even returned the original <code>MessageId</code>) but never delivered it a second time — that is what "exactly-once processing" in FIFO means: duplicates <em>sent within 5 minutes</em> are dropped.</li>
  <li>The third single receive was empty although <code>A101:huy-1</code> was waiting: while a message of group <code>phong-A101</code> is in flight, the group is locked. Group <code>phong-B202</code> was not blocked. So groups give you parallelism; order holds only <em>inside</em> one group.</li>
  <li>Choose the group id as "the thing whose order matters": one room, one user, one order — never one constant for the whole app (that makes FIFO single-threaded).</li>
  <li>FIFO does not save you from your own crash after side effects: dedup is about the <em>send</em> side. The consumer still needs idempotency.</li>
</ul>

<h3>See it running (4): short polling versus long polling</h3>
${OUT_91_POLL}
<ul>
  <li>Measured with the SDK (no CLI start-up time): short polling answered in 7 ms, empty; long polling waited 5,006 ms for the 5-second case, and in the 20-second case returned after 2,014 ms — the moment the message sent at second 2 arrived.</li>
  <li>Short polling answers immediately, even when empty — a worker looping on it makes thousands of empty, billed requests a day.</li>
  <li>Long polling waited the full 5 seconds when nothing came, and returned as soon as a message arrived in the 20-second case. Fewer requests, lower latency. Set <code>ReceiveMessageWaitTimeSeconds=20</code> on the queue and every consumer gets it.</li>
</ul>

<h3>See it running (5): a Node.js consumer that is idempotent</h3>
<p>Standard queues deliver <em>at least once</em>. Here the same booking DP-103 was sent twice, as happens after a producer retry or a consumer crash. The consumer records "email sent for DP-103" in DynamoDB with a <strong>conditional write</strong> (Lesson 6.4) <em>before</em> sending:</p>
${MA_CONSUMER}
${OUT_91_IDEM}
<ul>
  <li>Two copies of DP-103, one email. The second write failed with <code>ConditionalCheckFailedException</code> ⇒ "already sent" ⇒ just delete the message.</li>
  <li>The key is a <strong>business id</strong> (the booking id), not the SQS <code>MessageId</code> — a producer retry creates a new MessageId for the same booking.</li>
  <li>Order of steps decides what can go wrong: record-then-send can lose an email if the process dies between the two (fix: store a status and resend "PENDING" ones); send-then-record can send twice. Pick consciously, write it down.</li>
  <li>AWS SDKs retry failed calls with exponential backoff and jitter by default; your own retries should too.</li>
</ul>

<h3>Real incident: retries that made an outage worse (AWS, 7 December 2021)</h3>
<p>In AWS's own summary of the us-east-1 outage, an automated scaling activity caused a surge of connections on the internal network; clients timing out retried, "resulting in even more connection attempts and retries", and the congestion persisted for hours. Retries without limits and without backoff turn a small failure into a big one. For queues the defences are the ones you just ran: a visibility timeout that fits the work, a <code>maxReceiveCount</code> so a message cannot retry forever, a DLQ with an alarm, and backoff with jitter in your own code.</p>

<h3>The hacker's angle: who is allowed to write into your queue?</h3>
<ul>
  <li>A queue policy with <code>"Principal": "*"</code> and <code>sqs:SendMessage</code> lets anyone on the internet put messages in. A consumer that trusts the body then sends emails, creates bookings or refunds money for an attacker.</li>
  <li>Allow exactly the sender you mean — here only SNS, and only from <em>your</em> topic (<code>aws:SourceArn</code>; the account id below is a placeholder):</li>
</ul>
${MA_CHINH_SACH_Q}
<ul>
  <li>Still validate every message in the consumer (schema, ids exist, amounts in range): the queue is an input, like an HTTP request.</li>
  <li>Do not put secrets or full personal data in messages — anyone with <code>sqs:ReceiveMessage</code> can read them. Keep server-side encryption on (SSE-SQS or SSE-KMS).</li>
  <li><strong>LocalStack differs:</strong> it does not check IAM or queue policies at all, so a wrong policy still "works" here. Test policies on real AWS.</li>
</ul>

<h3>At work: "users got the confirmation email twice"</h3>
<p>A typical first ticket. Do not "fix" it by raising the visibility timeout until it goes away. Look in the logs for the receive count of the duplicated message (2 ⇒ redelivery after a timeout or crash), check the timeout against the real processing time, and make the consumer idempotent on the booking id. Then the bug cannot come back, whatever SQS does.</p>

<h3>Cost</h3>
<p>Singapore, November 2026: the first 1 million requests per month are free, then 0.40 USD per million for standard and 0.50 USD per million for FIFO. Every 64 KB chunk of a message counts as one request, and a receive that returns nothing still counts — another reason for long polling.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"What happens if a consumer crashes while processing a message?"</strong> — Nothing is lost: the message was only hidden. After the visibility timeout it becomes visible again and another consumer receives it, with a higher receive count. That is also why processing must be idempotent.</li>
  <li><strong>"Standard or FIFO?"</strong> — Standard by default (throughput, cost). FIFO when the order of events for the same entity matters and duplicates on the send side must be removed; choose the group id per entity.</li>
  <li><strong>"Why a dead-letter queue?"</strong> — To stop a poison message from retrying forever and hiding real work; you alarm on it, inspect, fix and redrive.</li>
  <li><strong>"How do you make a consumer idempotent?"</strong> — A business key plus a conditional write (or a unique constraint) before the side effect; on duplicate, skip and delete.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Create <code>labflow-thu.fifo</code> with <code>ContentBasedDeduplication=true</code>. Send the same body twice <em>without</em> a deduplication id, then a different body, all in group <code>g1</code>.</p>
<p><strong>Done when:</strong> one receive of up to 10 messages returns exactly two messages, in the order sent, and you can explain where the deduplication id came from.</p>
${giai('Hint', bash(`aws sqs create-queue --queue-name labflow-thu.fifo --attributes FifoQueue=true,ContentBasedDeduplication=true
Q=$(aws sqs get-queue-url --queue-name labflow-thu.fifo --query QueueUrl --output text)
aws sqs send-message --queue-url $Q --message-group-id g1 --message-body "mot"
aws sqs send-message --queue-url $Q --message-group-id g1 --message-body "mot"   # same body ⇒ same SHA-256 ⇒ dropped
aws sqs send-message --queue-url $Q --message-group-id g1 --message-body "hai"
aws sqs receive-message --queue-url $Q --max-number-of-messages 10 --query "Messages[].Body"`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Producer / consumer</b><span>Who sends messages / who receives and processes them.</span></div>
  <div><b>Visibility timeout</b><span>How long a received message stays hidden before it is handed out again.</span></div>
  <div><b>Receipt handle</b><span>Token from one receive; needed to delete or extend that message.</span></div>
  <div><b>At-least-once</b><span>Every message is delivered, sometimes more than once.</span></div>
  <div><b>Idempotent</b><span>Doing it twice has the same effect as doing it once.</span></div>
  <div><b>Message group</b><span>FIFO unit of ordering; one in-flight message per group.</span></div>
  <div><b>Deduplication id</b><span>FIFO: same id within 5 minutes ⇒ delivered once.</span></div>
  <div><b>DLQ / redrive</b><span>Queue for failed messages / moving them back after a fix.</span></div>
  <div><b>Long polling</b><span>Receive waits up to 20 s for a message instead of returning empty.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A queue decouples the fast part (accept the booking) from the slow part (send the email).</li>
  <li>Receive hides, delete removes; a crash means redelivery with a higher receive count.</li>
  <li>maxReceiveCount + DLQ + alarm stop poison messages; redrive after the fix.</li>
  <li>FIFO keeps order inside a group and drops duplicate sends within 5 minutes.</li>
  <li>Long polling 20 s; consumers idempotent on a business key.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', '🔁', "Amazon Builders' Library — Timeouts, retries and backoff with jitter", 'How Amazon itself retries without making outages worse.')}
${tl('https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/', '🔑', "Amazon Builders' Library — Making retries safe with idempotent APIs", 'Client request tokens and the semantics of "done twice".')}

<h3>Sources</h3>
<ul>
  <li>Visibility timeout: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-visibility-timeout.html</a></li>
  <li>At-least-once delivery: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/standard-queues-at-least-once-delivery.html</a></li>
  <li>Dead-letter queues: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-dead-letter-queues.html</a> · redrive: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue-redrive.html" target="_blank" rel="noopener">…/sqs-configure-dead-letter-queue-redrive.html</a></li>
  <li>FIFO queues: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-fifo-queues.html</a> · exactly-once (5-minute window): <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html" target="_blank" rel="noopener">…/FIFO-queues-exactly-once-processing.html</a></li>
  <li>Short and long polling: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-short-and-long-polling.html</a></li>
  <li>Message quotas (1 MiB, 4 days, 14 days): <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/quotas-messages.html</a></li>
  <li>Queue policy examples: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-examples-of-sqs-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-basic-examples-of-sqs-policies.html</a> · encryption: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html" target="_blank" rel="noopener">…/sqs-server-side-encryption.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/sqs/pricing/" target="_blank" rel="noopener">aws.amazon.com/sqs/pricing/</a></li>
  <li>AWS us-east-1 event summary, 7 December 2021: <a href="https://aws.amazon.com/message/12721/" target="_blank" rel="noopener">aws.amazon.com/message/12721/</a></li>
</ul>
</div>
`;
const L91_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 1</span>
<h2>9.1 — Hàng đợi SQS: standard, FIFO, dead-letter, và vì sao consumer phải idempotent</h2>
<p class="lead">Tới giờ mọi yêu cầu của LabFlow đều làm xong hết việc rồi mới trả lời. Đặt phòng thì gửi luôn email xác nhận — nên nhà cung cấp email chậm hay hỏng là việc đặt phòng cũng chậm hay hỏng theo. <strong>Amazon SQS</strong> (Simple Queue Service) cho API thả một tin vào hàng đợi rồi trả lời trong vài mili giây, còn một worker riêng làm phần chậm. Bài này chạy SQS thật: một tin ẩn đi rồi hiện lại, một tin "độc" chuyển sang hàng dead-letter rồi được đưa về, thứ tự FIFO trong một nhóm, long polling, và một consumer Node.js chỉ gửi một email kể cả khi cùng một tin tới hai lần.</p>

<h3>Hình dung: phiếu gọi món trong bếp nhà hàng</h3>
<p>Người phục vụ ghim phiếu lên thanh treo rồi quay ra bàn — không đứng chờ nồi canh chín (<strong>producer</strong> và <strong>hàng đợi</strong>). Một đầu bếp gỡ phiếu xuống; trong lúc anh ấy nấu, không ai khác thấy phiếu đó (<strong>visibility timeout</strong>). Món ra xong, anh ấy xiên phiếu bỏ đi (<strong>delete</strong>). Nếu đầu bếp ngất, một lúc sau phiếu tự về lại thanh treo cho người khác — nên thỉnh thoảng một món bị nấu hai lần (<strong>giao ít nhất một lần</strong>). Phiếu nào hỏng mãi ("cá hết rồi") thì vào khay của quản lý thay vì chặn cả thanh treo (<strong>dead-letter queue</strong>).</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Tin (message)</strong> — tối đa 1 MiB chữ (thường là JSON). Dữ liệu lớn hơn thì cất ở S3, tin chỉ mang khoá. Tin được giữ mặc định 4 ngày (1 phút tới 14 ngày: <code>MessageRetentionPeriod</code>).</li>
  <li><strong>Nhận không phải là lấy đi.</strong> <code>ReceiveMessage</code> chỉ giấu tin trong khoảng visibility timeout (mặc định 30 giây, tối đa 12 giờ) và đưa bạn một <strong>receipt handle</strong>. Chỉ <code>DeleteMessage</code> với đúng handle đó mới xoá tin.</li>
  <li><strong>Hàng standard</strong> — thông lượng gần như không giới hạn, giao <em>ít nhất một lần</em>, thứ tự chỉ "cố gắng". <strong>Hàng FIFO</strong> (tên kết thúc bằng <code>.fifo</code>) — giữ thứ tự trong một <strong>nhóm tin (message group)</strong>, bỏ tin trùng trong cửa sổ 5 phút, trần thông lượng thấp hơn.</li>
  <li><strong>Dead-letter queue (DLQ)</strong> — một hàng đợi bình thường được khai trong <code>RedrivePolicy</code> của hàng gốc; sau <code>maxReceiveCount</code> lần nhận mà không xoá, SQS chuyển tin sang đó.</li>
  <li><strong>Long polling</strong> — <code>WaitTimeSeconds</code> 1–20: lệnh nhận chờ tới khi có tin thay vì trả "rỗng" ngay.</li>
</ul>

<h3>Chạy thật (1): tin ẩn đi rồi quay lại</h3>
<p>Mọi lệnh chạy với LocalStack 4.12. URL hàng đợi cất trong <code>$Q</code> (trên AWS nó có dạng <code>https://sqs.ap-southeast-1.amazonaws.com/&lt;tài-khoản&gt;/labflow-thongbao</code>).</p>
${OUT_91_HIEN}
<ul>
  <li>Lần nhận thứ hai không được gì: tin đang <code>NotVisible: 1</code> — đã có người cầm, chưa mất.</li>
  <li>Consumer 1 không bao giờ xoá, nên hết 10 giây tin quay lại với <strong>số lần nhận 2</strong>. Đó là toàn bộ tấm lưới an toàn của SQS: worker chết ở dòng nào thì việc cũng không mất.</li>
  <li>Cái giá của tấm lưới: nếu consumer 1 đã gửi email thật rồi mới chết ngay <em>trước</em> <code>delete-message</code>, email sẽ đi hai lần. Giữ ý này cho phần (5).</li>
  <li>Chọn timeout theo việc thật: dài hơn thời gian xử lý bình thường chậm nhất. Ngắn quá ⇒ trùng; dài quá ⇒ tin của worker đã chết phải chờ rất lâu mới có người làm lại.</li>
</ul>

<h3>Chạy thật (2): tin độc vào DLQ — và quay về sau khi sửa</h3>
<p>Hàng gốc được gắn <code>RedrivePolicy</code> (một chuỗi JSON nằm trong thuộc tính) trỏ tới DLQ — tệp <code>thuoc.json</code>:</p>
${MA_THUOC}
${OUT_91_DLQ}
<ul>
  <li>Tin mang email không hợp lệ; lần nào consumer cũng lỗi. Sau lần nhận thứ 3 (<code>maxReceiveCount: 3</code>) lần nhận kế tiếp không thấy gì — SQS đã chuyển tin sang <code>labflow-email-dlq</code>.</li>
  <li>Không có DLQ thì tin này quay vòng tới khi hết hạn giữ (4 ngày), lần nào cũng tốn một lượt nhận và che lấp lỗi thật. Có DLQ thì hàng chính sạch, tin hỏng nằm chờ người xem.</li>
  <li>DLQ phải <strong>cùng loại</strong> (standard ⇒ standard, FIFO ⇒ FIFO), và thời gian giữ nên dài hơn hàng gốc — với hàng standard, tuổi của tin tính từ lúc vào hàng gốc, không tính từ lúc bị chuyển.</li>
  <li><strong>Redrive</strong> (<code>start-message-move-task</code>, hay nút "Start DLQ redrive" trên console) đưa tin về sau khi đã sửa lỗi. Đặt cảnh báo CloudWatch cho DLQ khi <code>ApproximateNumberOfMessagesVisible &gt; 0</code> (Chương 10) — DLQ không ai canh thì chỉ là thùng rác.</li>
</ul>

<h3>Chạy thật (3): FIFO — thứ tự trong nhóm, bỏ tin trùng</h3>
${OUT_91_FIFO}
<ul>
  <li>Lần gửi thứ 4 dùng lại deduplication id <code>dp-1</code>. SQS báo thành công (LocalStack còn trả đúng <code>MessageId</code> của tin gốc) nhưng không giao lần hai — "exactly-once processing" của FIFO nghĩa là vậy: tin trùng <em>được gửi trong vòng 5 phút</em> bị bỏ.</li>
  <li>Lần nhận lẻ thứ ba rỗng dù <code>A101:huy-1</code> đang chờ: khi nhóm <code>phong-A101</code> còn một tin đang xử lý, cả nhóm bị khoá. Nhóm <code>phong-B202</code> không bị chặn. Vậy nhóm cho bạn chạy song song; thứ tự chỉ đúng <em>bên trong</em> một nhóm.</li>
  <li>Chọn group id là "thứ cần đúng thứ tự": một phòng, một người dùng, một đơn — đừng bao giờ là một hằng số cho cả ứng dụng (FIFO thành một luồng duy nhất).</li>
  <li>FIFO không cứu bạn khỏi chính lỗi chết sau khi đã gây tác dụng: chống trùng là ở phía <em>gửi</em>. Consumer vẫn phải idempotent.</li>
</ul>

<h3>Chạy thật (4): short polling và long polling</h3>
${OUT_91_POLL}
<ul>
  <li>Đo bằng SDK (không tính thời gian khởi động CLI): short polling trả lời sau 7 ms, rỗng; long polling chờ 5.006 ms với trường hợp 5 giây, và với 20 giây thì về sau 2.014 ms — đúng lúc tin gửi ở giây thứ 2 tới.</li>
  <li>Short polling trả lời ngay cả khi rỗng — worker vòng lặp kiểu này tạo hàng nghìn yêu cầu rỗng mỗi ngày, yêu cầu nào cũng tính tiền.</li>
  <li>Long polling chờ đủ 5 giây khi không có gì, và về ngay khi có tin tới trong trường hợp 20 giây. Ít yêu cầu hơn, độ trễ thấp hơn. Đặt <code>ReceiveMessageWaitTimeSeconds=20</code> trên hàng đợi là mọi consumer đều được hưởng.</li>
</ul>

<h3>Chạy thật (5): consumer Node.js idempotent</h3>
<p>Hàng standard giao <em>ít nhất một lần</em>. Ở đây cùng đặt phòng DP-103 bị gửi hai lần, giống chuyện xảy ra khi producer thử lại hay consumer chết giữa chừng. Consumer ghi "đã gửi email cho DP-103" vào DynamoDB bằng <strong>ghi có điều kiện</strong> (Bài 6.4) <em>trước khi</em> gửi:</p>
${MA_CONSUMER}
${OUT_91_IDEM}
<ul>
  <li>Hai bản DP-103, một email. Lần ghi thứ hai lỗi <code>ConditionalCheckFailedException</code> ⇒ "đã gửi rồi" ⇒ chỉ xoá tin.</li>
  <li>Khoá là <strong>mã nghiệp vụ</strong> (mã đặt phòng), không phải <code>MessageId</code> của SQS — producer thử lại sẽ sinh MessageId mới cho cùng một đặt phòng.</li>
  <li>Thứ tự các bước quyết định cái gì có thể hỏng: ghi trước rồi gửi thì có thể mất email nếu tiến trình chết giữa hai bước (cách sửa: lưu trạng thái và gửi lại các bản "PENDING"); gửi trước rồi ghi thì có thể gửi hai lần. Chọn có chủ ý, và ghi lại.</li>
  <li>AWS SDK mặc định tự thử lại lệnh lỗi với backoff luỹ thừa và jitter; vòng thử lại của chính bạn cũng nên như vậy.</li>
</ul>

<h3>Sự cố thật: thử lại làm sự cố tệ hơn (AWS, 7/12/2021)</h3>
<p>Trong bản tóm tắt chính thức về sự cố us-east-1, một hoạt động tự mở rộng gây ra cơn bão kết nối trên mạng nội bộ; các client bị quá thời gian liền thử lại, "dẫn tới còn nhiều lần kết nối và thử lại hơn nữa", và tắc nghẽn kéo dài nhiều giờ. Thử lại không giới hạn và không giãn cách biến một lỗi nhỏ thành lỗi lớn. Với hàng đợi, cách phòng chính là những thứ bạn vừa chạy: visibility timeout khớp với việc, <code>maxReceiveCount</code> để tin không thử lại mãi, DLQ có cảnh báo, và backoff có jitter trong mã của bạn.</p>

<h3>Góc hacker: ai được phép ghi vào hàng đợi của bạn?</h3>
<ul>
  <li>Queue policy có <code>"Principal": "*"</code> cùng <code>sqs:SendMessage</code> cho bất kỳ ai trên internet bỏ tin vào. Consumer nào tin vào thân tin sẽ gửi email, tạo đặt phòng hay hoàn tiền hộ kẻ tấn công.</li>
  <li>Chỉ cho đúng bên gửi bạn muốn — ở đây chỉ SNS, và chỉ từ topic <em>của bạn</em> (<code>aws:SourceArn</code>; số tài khoản dưới đây là chỗ giữ):</li>
</ul>
${MA_CHINH_SACH_Q}
<ul>
  <li>Consumer vẫn phải kiểm mọi tin (đúng lược đồ, mã có tồn tại, số tiền trong khoảng hợp lệ): hàng đợi là một đầu vào, giống một yêu cầu HTTP.</li>
  <li>Đừng để bí mật hay đầy đủ dữ liệu cá nhân trong tin — ai có <code>sqs:ReceiveMessage</code> cũng đọc được. Giữ mã hoá phía máy chủ (SSE-SQS hoặc SSE-KMS).</li>
  <li><strong>LocalStack khác AWS:</strong> nó hoàn toàn không kiểm IAM hay queue policy, nên policy sai ở đây vẫn "chạy". Thử policy trên AWS thật.</li>
</ul>

<h3>Đi làm: "người dùng nhận email xác nhận hai lần"</h3>
<p>Một ticket kinh điển của người mới. Đừng "sửa" bằng cách tăng visibility timeout cho tới khi hết thấy. Tìm trong log số lần nhận của tin bị trùng (2 ⇒ giao lại sau timeout hoặc sau khi worker chết), so timeout với thời gian xử lý thật, rồi làm consumer idempotent theo mã đặt phòng. Khi đó lỗi không thể quay lại, dù SQS có làm gì.</p>

<h3>Chi phí</h3>
<p>Singapore, tháng 11/2026: 1 triệu yêu cầu đầu tiên mỗi tháng miễn phí, sau đó 0,40 USD mỗi triệu với hàng standard và 0,50 USD mỗi triệu với FIFO. Mỗi khúc 64 KB của một tin tính là một yêu cầu, và lần nhận trả về rỗng vẫn tính — thêm một lý do dùng long polling.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Consumer chết khi đang xử lý tin thì sao?"</strong> — Không mất gì: tin chỉ bị giấu. Hết visibility timeout nó hiện lại và consumer khác nhận được, với số lần nhận cao hơn. Cũng vì thế mà xử lý phải idempotent.</li>
  <li><strong>"Standard hay FIFO?"</strong> — Mặc định standard (thông lượng, giá). FIFO khi thứ tự sự kiện của cùng một thực thể quan trọng và cần bỏ tin trùng phía gửi; chọn group id theo thực thể.</li>
  <li><strong>"Dead-letter queue để làm gì?"</strong> — Chặn tin độc thử lại mãi và che lấp việc thật; đặt cảnh báo, xem, sửa rồi redrive.</li>
  <li><strong>"Làm consumer idempotent thế nào?"</strong> — Một khoá nghiệp vụ cộng ghi có điều kiện (hoặc ràng buộc unique) trước khi gây tác dụng; trùng thì bỏ qua và xoá tin.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Tạo <code>labflow-thu.fifo</code> với <code>ContentBasedDeduplication=true</code>. Gửi cùng một thân tin hai lần <em>không</em> kèm deduplication id, rồi một thân khác, tất cả trong nhóm <code>g1</code>.</p>
<p><strong>Đạt khi:</strong> một lần nhận tối đa 10 tin trả về đúng hai tin, đúng thứ tự đã gửi, và bạn giải thích được deduplication id từ đâu ra.</p>
${giai('Gợi ý', bash(`aws sqs create-queue --queue-name labflow-thu.fifo --attributes FifoQueue=true,ContentBasedDeduplication=true
Q=$(aws sqs get-queue-url --queue-name labflow-thu.fifo --query QueueUrl --output text)
aws sqs send-message --queue-url $Q --message-group-id g1 --message-body "mot"
aws sqs send-message --queue-url $Q --message-group-id g1 --message-body "mot"   # cùng thân ⇒ cùng SHA-256 ⇒ bị bỏ
aws sqs send-message --queue-url $Q --message-group-id g1 --message-body "hai"
aws sqs receive-message --queue-url $Q --max-number-of-messages 10 --query "Messages[].Body"`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Producer / consumer</b><span>Bên gửi tin / bên nhận và xử lý tin.</span></div>
  <div><b>Visibility timeout</b><span>Tin đã nhận bị giấu bao lâu trước khi được giao lại.</span></div>
  <div><b>Receipt handle</b><span>Thẻ của một lần nhận; cần để xoá hay gia hạn tin đó.</span></div>
  <div><b>At-least-once</b><span>Tin nào cũng được giao, đôi khi hơn một lần.</span></div>
  <div><b>Idempotent</b><span>Làm hai lần cũng có tác dụng như làm một lần.</span></div>
  <div><b>Message group</b><span>Đơn vị thứ tự của FIFO; mỗi nhóm một tin đang xử lý.</span></div>
  <div><b>Deduplication id</b><span>FIFO: cùng id trong 5 phút ⇒ chỉ giao một lần.</span></div>
  <div><b>DLQ / redrive</b><span>Hàng cho tin hỏng / đưa tin về sau khi sửa.</span></div>
  <div><b>Long polling</b><span>Lệnh nhận chờ tới 20 giây thay vì trả rỗng ngay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Hàng đợi tách phần nhanh (nhận đặt phòng) khỏi phần chậm (gửi email).</li>
  <li>Nhận là giấu, xoá mới mất; worker chết ⇒ tin được giao lại với số lần nhận cao hơn.</li>
  <li>maxReceiveCount + DLQ + cảnh báo chặn tin độc; redrive sau khi sửa.</li>
  <li>FIFO giữ thứ tự trong nhóm và bỏ tin gửi trùng trong 5 phút.</li>
  <li>Long polling 20 giây; consumer idempotent theo khoá nghiệp vụ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', '🔁', "Amazon Builders' Library — Timeout, thử lại và backoff có jitter", 'Amazon tự thử lại thế nào để không làm sự cố tệ hơn.')}
${tl('https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/', '🔑', "Amazon Builders' Library — Thử lại an toàn với API idempotent", 'Client request token và ý nghĩa của "làm hai lần".')}

<h3>Nguồn</h3>
<ul>
  <li>Visibility timeout: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-visibility-timeout.html</a></li>
  <li>Giao ít nhất một lần: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/standard-queues-at-least-once-delivery.html</a></li>
  <li>Dead-letter queue: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-dead-letter-queues.html</a> · redrive: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue-redrive.html" target="_blank" rel="noopener">…/sqs-configure-dead-letter-queue-redrive.html</a></li>
  <li>Hàng FIFO: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-fifo-queues.html</a> · exactly-once (cửa sổ 5 phút): <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html" target="_blank" rel="noopener">…/FIFO-queues-exactly-once-processing.html</a></li>
  <li>Short và long polling: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-short-and-long-polling.html</a></li>
  <li>Giới hạn tin (1 MiB, 4 ngày, 14 ngày): <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/quotas-messages.html</a></li>
  <li>Ví dụ queue policy: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-examples-of-sqs-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/…/sqs-basic-examples-of-sqs-policies.html</a> · mã hoá: <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html" target="_blank" rel="noopener">…/sqs-server-side-encryption.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/sqs/pricing/" target="_blank" rel="noopener">aws.amazon.com/sqs/pricing/</a></li>
  <li>Tóm tắt sự cố AWS us-east-1, 7/12/2021: <a href="https://aws.amazon.com/message/12721/" target="_blank" rel="noopener">aws.amazon.com/message/12721/</a></li>
</ul>
</div>
`;

/* ═════ 9.2 — SNS ═════ */
const MA_LOC_BODY = json(`{
  "phong": [{ "prefix": "A" }],
  "soNguoi": [{ "numeric": [">=", 30] }]
}`);
const L92_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 2</span>
<h2>9.2 — SNS: one event, many receivers (fan-out), filters, and the SMS bill nobody expected</h2>
<p class="lead">When a booking is created, three parts of LabFlow care: the email worker, the statistics job, and — for cancellations — the refund service. If the API sends to each of them itself, every new receiver means changing and redeploying the API. <strong>Amazon SNS</strong> (Simple Notification Service) turns that around: the API publishes <em>once</em> to a <strong>topic</strong>, and every subscriber gets its own copy. This lesson builds the classic <strong>SNS → SQS fan-out</strong> for real, filters by message attribute, compares the SNS envelope with raw delivery, and looks at email and SMS — including how SMS became a fraud target.</p>

<h3>The picture: the class announcement group</h3>
<p>The class monitor does not call forty classmates one by one; she posts once in the class group (<strong>topic</strong>). Everyone in the group gets it (<strong>subscriptions</strong>). Someone who only wants exam news mutes the rest (<strong>filter policy</strong>). And the monitor does not need to know who joined yesterday — the sender and the receivers are decoupled. The difference from SQS: the group does not keep a pile of messages for you to take later. If you need that, each member puts what they receive into their own inbox — an <strong>SQS queue per subscriber</strong>.</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Topic</strong> — a named channel with an ARN. Publishers call <code>sns:Publish</code>; they never see the subscriber list.</li>
  <li><strong>Subscription</strong> — topic + protocol + endpoint: <code>sqs</code>, <code>lambda</code>, <code>http/https</code>, <code>email</code>, <code>sms</code>, mobile push, Firehose. Email and HTTP subscriptions must be <strong>confirmed</strong> by the receiver.</li>
  <li><strong>Fan-out</strong> — SNS → several SQS queues. SNS pushes and forgets; each queue stores its copy until its own consumer is ready, retries, and has its own DLQ. This is the pattern you will use most.</li>
  <li><strong>Filter policy</strong> — set on a subscription; only matching messages are delivered (by message attributes, or by the JSON body with <code>FilterPolicyScope=MessageBody</code>). Filtered-out messages are simply not delivered.</li>
  <li><strong>Raw message delivery</strong> — deliver the published string as is, instead of wrapping it in SNS's JSON envelope.</li>
  <li><strong>FIFO topics</strong> (<code>.fifo</code>) — ordered, deduplicated, can only deliver to SQS FIFO queues.</li>
</ul>

<h3>See it running (1): one topic, two queues, one email subscription</h3>
${OUT_92_FANOUT}
<ul>
  <li>Two publishes produced <strong>2</strong> messages in <code>labflow-email</code> (no filter) and <strong>1</strong> in <code>labflow-hoantien</code> (filter <code>loai = huy</code>). The publisher did not change; the routing lives in the subscriptions.</li>
  <li>Adding a fourth receiver tomorrow (say, a Lambda that updates a dashboard) is one <code>sns subscribe</code> — the API is not touched.</li>
  <li><strong>LocalStack differs (1):</strong> on AWS, the queue must have a <strong>queue policy</strong> allowing <code>sns.amazonaws.com</code> to <code>sqs:SendMessage</code>, restricted with <code>aws:SourceArn</code> to this topic (the policy from Lesson 9.1). Without it, AWS silently drops the deliveries — the most common "SNS publishes OK but my queue stays empty" bug. LocalStack does not check policies, so it delivered anyway.</li>
  <li><strong>LocalStack differs (2):</strong> the email subscription came back with a full ARN. On AWS <code>subscribe</code> answers <code>pending confirmation</code>, and nothing is sent until the address owner clicks the link in the confirmation email.</li>
</ul>

<h3>See it running (2): the SNS envelope versus raw delivery</h3>
${OUT_92_HINHDANG}
<ul>
  <li>Without raw delivery, your consumer gets SNS's JSON: <code>Type</code>, <code>MessageId</code>, <code>TopicArn</code>, the real payload as a <em>string</em> in <code>Message</code>, attributes, timestamp, signature fields. The consumer must parse twice (<code>JSON.parse(JSON.parse(body).Message)</code>).</li>
  <li>With <code>RawMessageDelivery=true</code>, the body is exactly what was published. Choose one per subscription and write the consumer for it — mixing them is a classic "undefined" bug.</li>
  <li>The envelope is useful for HTTP endpoints: they should verify the signature (<code>SignatureVersion</code>, signing certificate) so nobody can post fake "SNS" messages to your webhook.</li>
</ul>

<h3>Filters on the body</h3>
<p>Attributes are cheap to filter on, but publishers must remember to set them. With <code>FilterPolicyScope=MessageBody</code> the same operators work on the JSON payload itself — for example "rooms starting with A and at least 30 people":</p>
${MA_LOC_BODY}
<p>The same matching language (prefix, numeric ranges, anything-but, exists) is used by EventBridge in the next lesson.</p>

<h3>What happens when a subscriber is down</h3>
<ul>
  <li>SNS stores nothing for later reading. For SQS and Lambda subscribers it retries a long time (AWS documents up to 100,015 attempts over 23 days); for HTTP endpoints the delivery policy is much shorter and configurable.</li>
  <li>Give important subscriptions their own <strong>DLQ</strong> (a <code>RedrivePolicy</code> on the subscription) so that undeliverable messages land somewhere you can see.</li>
  <li>That is why fan-out goes to queues: a queue can absorb hours of consumer downtime; an HTTP endpoint cannot.</li>
</ul>

<h3>Compared with a Telegram bot on a VPS</h3>
<p>A small VPS often sends alerts by calling a chat bot's HTTP API directly from a script: simple, but each script knows the bot token, and if the bot API is down the alert is lost. On AWS the usual shape is <strong>CloudWatch alarm → SNS topic → email / chat / a Lambda that calls your bot</strong> (Chapter 10). The alarm only knows the topic; who gets notified is a subscription you can change without touching the alarm.</p>

<h3>Real incident: SMS pumping — "60 million USD a year" (Twitter, 2023)</h3>
<p>In February 2023, as Twitter limited SMS two-factor codes to paying users, Elon Musk said the company was being scammed for about 60 million USD a year of fake 2FA SMS: bots requested codes to premium numbers, and the operators of those numbers shared the revenue (his claim; the figure was not independently verified). The pattern is called <strong>SMS pumping</strong> or artificially inflated traffic, and any "send me a code" form can be its target.</p>
<ul>
  <li>Never let an anonymous request trigger an SMS freely: rate-limit per phone number, per IP and globally; add a CAPTCHA on sign-up; allow only the countries you serve.</li>
  <li>New AWS accounts are in the <strong>SMS sandbox</strong> with a spending quota of 1 USD per month — leave a low quota and a CloudWatch alarm on spend when you leave the sandbox.</li>
  <li>Prefer email or an authenticator app for OTP where you can; SMS is the expensive, abusable channel.</li>
</ul>

<h3>The hacker's angle: who can subscribe to your topic?</h3>
<p>A topic policy that allows <code>sns:Subscribe</code> to <code>"*"</code> lets anyone attach their own HTTPS endpoint or queue and receive every booking event — names, emails, rooms. Allow publish and subscribe only to the roles and services you mean, keep personal data out of event payloads (send the booking id; let consumers fetch details with their own permissions), and turn on encryption (SSE with KMS) for topics that carry anything sensitive.</p>

<h3>Cost</h3>
<p>Singapore, November 2026: the first 1 million SNS requests per month are free, then 0.50 USD per million publishes. Email notifications: 1,000 free, then 2.00 USD per 100,000; HTTP/HTTPS: 0.06 USD per 100,000 after the free tier. Deliveries to SQS have no separate line in the price list — you pay the SQS requests on the queue side. SMS is priced per country and is by far the most expensive channel.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"SNS or SQS?"</strong> — Not either/or. SQS is a buffer one consumer group pulls from; SNS pushes one message to many subscribers. Together: SNS fan-out into one SQS queue per consumer, each with its own retries and DLQ.</li>
  <li><strong>"SNS publishes successfully but the queue is empty. Why?"</strong> — Usually the queue policy does not allow <code>sns.amazonaws.com</code> (or the SourceArn is wrong), the subscription filter does not match, or the queue uses a KMS key SNS may not use.</li>
  <li><strong>"How do you route only some events to a consumer?"</strong> — A filter policy on that subscription (attributes or body), not an if in the consumer — the message is then never delivered or paid for there.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Change the <code>labflow-hoantien</code> subscription to filter on the <em>body</em>: deliver only messages whose <code>phong</code> starts with <code>B</code>. Publish two bookings (A101 and B202) without any message attributes.</p>
<p><strong>Done when:</strong> <code>labflow-hoantien</code> receives exactly the B202 message, and you can say which two subscription attributes you changed.</p>
${giai('Hint', bash(`S=$(aws sns list-subscriptions-by-topic --topic-arn $T --query "Subscriptions[?ends_with(Endpoint, ':labflow-hoantien')].SubscriptionArn | [0]" --output text)
aws sns set-subscription-attributes --subscription-arn $S --attribute-name FilterPolicyScope --attribute-value MessageBody
aws sns set-subscription-attributes --subscription-arn $S --attribute-name FilterPolicy --attribute-value '{"phong":[{"prefix":"B"}]}'
aws sns publish --topic-arn $T --message '{"datPhong":"DP-211","phong":"A101"}'
aws sns publish --topic-arn $T --message '{"datPhong":"DP-212","phong":"B202"}'`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Topic</b><span>Named channel; publishers send once, SNS copies to every subscription.</span></div>
  <div><b>Subscription</b><span>Topic + protocol + endpoint (+ filter, raw delivery, DLQ).</span></div>
  <div><b>Fan-out</b><span>One message to many receivers, usually one SQS queue each.</span></div>
  <div><b>Filter policy</b><span>Matching rules on attributes or body; non-matching messages are not delivered.</span></div>
  <div><b>Raw delivery</b><span>Deliver the published string without the SNS JSON envelope.</span></div>
  <div><b>SMS sandbox</b><span>Default state of a new account: verified numbers only, 1 USD/month quota.</span></div>
  <div><b>SMS pumping</b><span>Fraud: bots trigger SMS to premium numbers to share the revenue.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>SNS pushes one published message to every subscription; the publisher does not know the receivers.</li>
  <li>SNS → SQS fan-out gives each consumer its own buffer, retries and DLQ.</li>
  <li>On AWS the queue needs a policy for sns.amazonaws.com + aws:SourceArn (LocalStack does not check).</li>
  <li>Filter in the subscription; decide envelope or raw per subscription.</li>
  <li>SMS: rate limits, country allow-list, low spend quota — SMS pumping is real.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html', '🔎', 'AWS — Amazon SNS message filtering', 'Attribute and body filters, every operator, and their limits.')}
${tl('https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html', '🔁', 'AWS — Amazon SNS message delivery retries', 'Retry phases per protocol and how to add a subscription DLQ.')}

<h3>Sources</h3>
<ul>
  <li>Fan-out to SQS: <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html</a> · queue policy for SNS: <a href="https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html" target="_blank" rel="noopener">…/subscribe-sqs-queue-to-sns-topic.html</a></li>
  <li>Message filtering: <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html</a></li>
  <li>Raw message delivery: <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html</a></li>
  <li>Delivery retries (100,015 attempts over 23 days): <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html</a></li>
  <li>SMS sandbox spending quota (1 USD/month): <a href="https://docs.aws.amazon.com/sms-voice/latest/userguide/awssupport-spend-threshold.html" target="_blank" rel="noopener">docs.aws.amazon.com/sms-voice/latest/userguide/awssupport-spend-threshold.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/sns/pricing/" target="_blank" rel="noopener">aws.amazon.com/sns/pricing/</a></li>
  <li>Twitter and SMS pumping (Commsrisk, 2023): <a href="https://commsrisk.com/elon-musk-says-twitter-lost-60mn-a-year-because-390-telcos-used-bot-accounts-to-pump-a2p-sms/" target="_blank" rel="noopener">commsrisk.com/elon-musk-says-twitter-lost-60mn-a-year-because-390-telcos-used-bot-accounts-to-pump-a2p-sms/</a></li>
</ul>
</div>
`;
const L92_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 2</span>
<h2>9.2 — SNS: một sự kiện, nhiều nơi nhận (fan-out), bộ lọc, và hoá đơn SMS không ai ngờ</h2>
<p class="lead">Khi một đặt phòng được tạo, ba phần của LabFlow cùng quan tâm: worker gửi email, việc thống kê, và — với lượt huỷ — dịch vụ hoàn tiền. Nếu API tự gửi cho từng nơi, mỗi nơi nhận mới là một lần sửa và deploy lại API. <strong>Amazon SNS</strong> (Simple Notification Service) làm ngược lại: API phát <em>một lần</em> lên một <strong>topic</strong>, mọi nơi đăng ký đều nhận một bản riêng. Bài này dựng thật mô hình kinh điển <strong>SNS → SQS fan-out</strong>, lọc theo thuộc tính tin, so phong bì SNS với raw delivery, và xem email, SMS — kể cả chuyện SMS thành mồi của gian lận.</p>

<h3>Hình dung: nhóm thông báo của lớp</h3>
<p>Lớp trưởng không gọi từng người trong bốn mươi bạn; bạn ấy đăng một lần vào nhóm lớp (<strong>topic</strong>). Ai trong nhóm cũng nhận được (<strong>subscription</strong>). Bạn nào chỉ muốn tin về lịch thi thì tắt phần còn lại (<strong>filter policy</strong>). Và lớp trưởng không cần biết hôm qua ai mới vào nhóm — bên gửi và bên nhận tách rời nhau. Khác SQS: nhóm không giữ một chồng tin để bạn lấy sau. Cần vậy thì mỗi thành viên bỏ tin nhận được vào hộp thư riêng — <strong>mỗi bên nhận một hàng SQS</strong>.</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Topic</strong> — một kênh có tên, có ARN. Bên phát gọi <code>sns:Publish</code>; không bao giờ thấy danh sách bên nhận.</li>
  <li><strong>Subscription</strong> — topic + giao thức + điểm nhận: <code>sqs</code>, <code>lambda</code>, <code>http/https</code>, <code>email</code>, <code>sms</code>, mobile push, Firehose. Đăng ký email và HTTP phải được bên nhận <strong>xác nhận</strong>.</li>
  <li><strong>Fan-out</strong> — SNS → nhiều hàng SQS. SNS đẩy đi rồi thôi; mỗi hàng giữ bản của mình tới khi consumer của nó sẵn sàng, tự thử lại, có DLQ riêng. Đây là mô hình bạn sẽ dùng nhiều nhất.</li>
  <li><strong>Filter policy</strong> — đặt trên từng subscription; chỉ tin khớp mới được giao (theo thuộc tính tin, hoặc theo thân JSON với <code>FilterPolicyScope=MessageBody</code>). Tin bị lọc đơn giản là không được giao.</li>
  <li><strong>Raw message delivery</strong> — giao đúng chuỗi đã phát, không bọc trong phong bì JSON của SNS.</li>
  <li><strong>Topic FIFO</strong> (<code>.fifo</code>) — có thứ tự, bỏ trùng, chỉ giao được tới hàng SQS FIFO.</li>
</ul>

<h3>Chạy thật (1): một topic, hai hàng đợi, một đăng ký email</h3>
${OUT_92_FANOUT}
<ul>
  <li>Hai lần phát cho ra <strong>2</strong> tin trong <code>labflow-email</code> (không lọc) và <strong>1</strong> tin trong <code>labflow-hoantien</code> (lọc <code>loai = huy</code>). Bên phát không đổi gì; việc định tuyến nằm ở các subscription.</li>
  <li>Mai thêm bên nhận thứ tư (ví dụ một Lambda cập nhật dashboard) chỉ là một lệnh <code>sns subscribe</code> — không đụng tới API.</li>
  <li><strong>LocalStack khác AWS (1):</strong> trên AWS, hàng đợi phải có <strong>queue policy</strong> cho phép <code>sns.amazonaws.com</code> gọi <code>sqs:SendMessage</code>, giới hạn bằng <code>aws:SourceArn</code> là topic này (policy ở Bài 9.1). Thiếu nó, AWS lặng lẽ bỏ các lượt giao — lỗi "SNS phát OK mà hàng đợi vẫn rỗng" hay gặp nhất. LocalStack không kiểm policy nên vẫn giao.</li>
  <li><strong>LocalStack khác AWS (2):</strong> đăng ký email trả về luôn ARN đầy đủ. Trên AWS <code>subscribe</code> trả <code>pending confirmation</code>, và không gửi gì cho tới khi chủ địa chỉ bấm liên kết trong email xác nhận.</li>
</ul>

<h3>Chạy thật (2): phong bì SNS và raw delivery</h3>
${OUT_92_HINHDANG}
<ul>
  <li>Không bật raw, consumer nhận JSON của SNS: <code>Type</code>, <code>MessageId</code>, <code>TopicArn</code>, nội dung thật là một <em>chuỗi</em> trong <code>Message</code>, thuộc tính, mốc giờ, các trường chữ ký. Consumer phải parse hai lần (<code>JSON.parse(JSON.parse(body).Message)</code>).</li>
  <li>Có <code>RawMessageDelivery=true</code>, thân tin đúng là thứ đã phát. Mỗi subscription chọn một kiểu và viết consumer cho đúng kiểu đó — trộn hai kiểu là lỗi "undefined" kinh điển.</li>
  <li>Phong bì có ích cho điểm nhận HTTP: chúng nên kiểm chữ ký (<code>SignatureVersion</code>, chứng chỉ ký) để không ai gửi được tin "SNS" giả vào webhook của bạn.</li>
</ul>

<h3>Lọc theo thân tin</h3>
<p>Lọc theo thuộc tính thì rẻ, nhưng bên phát phải nhớ đặt thuộc tính. Với <code>FilterPolicyScope=MessageBody</code>, cùng các toán tử đó áp lên chính nội dung JSON — ví dụ "phòng bắt đầu bằng A và từ 30 người":</p>
${MA_LOC_BODY}
<p>Cùng ngôn ngữ khớp mẫu này (prefix, khoảng số, anything-but, exists) được EventBridge dùng ở bài sau.</p>

<h3>Bên nhận đang hỏng thì sao</h3>
<ul>
  <li>SNS không cất gì để đọc sau. Với bên nhận SQS và Lambda nó thử lại rất lâu (AWS ghi tới 100.015 lần trong 23 ngày); với điểm nhận HTTP, chính sách giao ngắn hơn nhiều và chỉnh được.</li>
  <li>Cho các subscription quan trọng một <strong>DLQ</strong> riêng (<code>RedrivePolicy</code> trên subscription) để tin không giao được rơi vào chỗ bạn nhìn thấy.</li>
  <li>Vì thế fan-out đi vào hàng đợi: hàng đợi chịu được hàng giờ consumer ngừng chạy; điểm nhận HTTP thì không.</li>
</ul>

<h3>So với bot Telegram trên VPS</h3>
<p>Một VPS nhỏ hay gửi cảnh báo bằng cách cho script gọi thẳng API HTTP của bot chat: đơn giản, nhưng script nào cũng biết token của bot, và API bot hỏng thì cảnh báo mất. Trên AWS hình thường gặp là <strong>CloudWatch alarm → topic SNS → email / chat / một Lambda gọi bot của bạn</strong> (Chương 10). Alarm chỉ biết topic; ai được báo là một subscription bạn đổi được mà không đụng tới alarm.</p>

<h3>Sự cố thật: SMS pumping — "60 triệu USD mỗi năm" (Twitter, 2023)</h3>
<p>Tháng 2/2023, khi Twitter giới hạn mã 2FA qua SMS cho người trả phí, Elon Musk nói công ty bị lừa khoảng 60 triệu USD mỗi năm vì SMS 2FA giả: bot xin mã gửi tới các số đầu cao, và nhà mạng sở hữu các số đó chia doanh thu (đây là lời ông ấy; con số chưa được kiểm chứng độc lập). Kiểu này gọi là <strong>SMS pumping</strong> hay lưu lượng bị thổi phồng, và mọi form "gửi mã cho tôi" đều có thể thành mục tiêu.</p>
<ul>
  <li>Đừng bao giờ để một yêu cầu ẩn danh tự do kích hoạt SMS: giới hạn tần suất theo số điện thoại, theo IP và toàn hệ thống; thêm CAPTCHA ở bước đăng ký; chỉ cho các quốc gia bạn phục vụ.</li>
  <li>Tài khoản AWS mới nằm trong <strong>SMS sandbox</strong> với hạn mức chi 1 USD mỗi tháng — khi ra khỏi sandbox vẫn giữ hạn mức thấp và cảnh báo CloudWatch theo mức chi.</li>
  <li>Ưu tiên email hoặc ứng dụng xác thực cho OTP khi được; SMS là kênh đắt và dễ bị lạm dụng.</li>
</ul>

<h3>Góc hacker: ai được đăng ký vào topic của bạn?</h3>
<p>Topic policy cho phép <code>sns:Subscribe</code> với <code>"*"</code> để bất kỳ ai gắn điểm nhận HTTPS hay hàng đợi của họ vào và nhận mọi sự kiện đặt phòng — tên, email, phòng. Chỉ cho phép phát và đăng ký với đúng các role và dịch vụ bạn muốn, giữ dữ liệu cá nhân ngoài nội dung sự kiện (gửi mã đặt phòng; để consumer tự lấy chi tiết bằng quyền của nó), và bật mã hoá (SSE với KMS) cho topic mang thứ nhạy cảm.</p>

<h3>Chi phí</h3>
<p>Singapore, tháng 11/2026: 1 triệu yêu cầu SNS đầu tiên mỗi tháng miễn phí, sau đó 0,50 USD mỗi triệu lần phát. Thông báo email: 1.000 miễn phí, sau đó 2,00 USD mỗi 100.000; HTTP/HTTPS: 0,06 USD mỗi 100.000 sau phần miễn phí. Lượt giao tới SQS không có dòng riêng trong bảng giá — bạn trả các yêu cầu SQS ở phía hàng đợi. SMS tính theo từng quốc gia và là kênh đắt nhất, cách rất xa.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"SNS hay SQS?"</strong> — Không phải chọn một. SQS là bộ đệm cho một nhóm consumer kéo về; SNS đẩy một tin tới nhiều bên nhận. Kết hợp: SNS fan-out vào mỗi consumer một hàng SQS, hàng nào cũng có thử lại và DLQ riêng.</li>
  <li><strong>"SNS phát thành công mà hàng đợi rỗng. Vì sao?"</strong> — Thường do queue policy không cho <code>sns.amazonaws.com</code> (hoặc SourceArn sai), bộ lọc của subscription không khớp, hoặc hàng đợi dùng khoá KMS mà SNS không được dùng.</li>
  <li><strong>"Làm sao chỉ đưa một số sự kiện tới một consumer?"</strong> — Filter policy trên subscription đó (thuộc tính hoặc thân tin), không phải câu if trong consumer — tin khi đó không bao giờ được giao và không tốn tiền ở đó.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Đổi subscription <code>labflow-hoantien</code> sang lọc theo <em>thân tin</em>: chỉ giao tin có <code>phong</code> bắt đầu bằng <code>B</code>. Phát hai đặt phòng (A101 và B202) không kèm thuộc tính nào.</p>
<p><strong>Đạt khi:</strong> <code>labflow-hoantien</code> nhận đúng tin B202, và bạn nói được đã đổi hai thuộc tính nào của subscription.</p>
${giai('Gợi ý', bash(`S=$(aws sns list-subscriptions-by-topic --topic-arn $T --query "Subscriptions[?ends_with(Endpoint, ':labflow-hoantien')].SubscriptionArn | [0]" --output text)
aws sns set-subscription-attributes --subscription-arn $S --attribute-name FilterPolicyScope --attribute-value MessageBody
aws sns set-subscription-attributes --subscription-arn $S --attribute-name FilterPolicy --attribute-value '{"phong":[{"prefix":"B"}]}'
aws sns publish --topic-arn $T --message '{"datPhong":"DP-211","phong":"A101"}'
aws sns publish --topic-arn $T --message '{"datPhong":"DP-212","phong":"B202"}'`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Topic</b><span>Kênh có tên; bên phát gửi một lần, SNS chép cho mọi subscription.</span></div>
  <div><b>Subscription</b><span>Topic + giao thức + điểm nhận (+ bộ lọc, raw delivery, DLQ).</span></div>
  <div><b>Fan-out</b><span>Một tin tới nhiều bên nhận, thường mỗi bên một hàng SQS.</span></div>
  <div><b>Filter policy</b><span>Luật khớp trên thuộc tính hoặc thân tin; tin không khớp không được giao.</span></div>
  <div><b>Raw delivery</b><span>Giao đúng chuỗi đã phát, không có phong bì JSON của SNS.</span></div>
  <div><b>SMS sandbox</b><span>Trạng thái mặc định của tài khoản mới: chỉ số đã xác minh, hạn mức 1 USD/tháng.</span></div>
  <div><b>SMS pumping</b><span>Gian lận: bot kích hoạt SMS tới số đầu cao để chia doanh thu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>SNS đẩy một tin đã phát tới mọi subscription; bên phát không biết bên nhận.</li>
  <li>SNS → SQS fan-out cho mỗi consumer bộ đệm, thử lại và DLQ riêng.</li>
  <li>Trên AWS, hàng đợi cần policy cho sns.amazonaws.com + aws:SourceArn (LocalStack không kiểm).</li>
  <li>Lọc ở subscription; mỗi subscription chọn phong bì hay raw.</li>
  <li>SMS: giới hạn tần suất, danh sách quốc gia, hạn mức chi thấp — SMS pumping là chuyện thật.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html', '🔎', 'AWS — Lọc tin trong Amazon SNS', 'Bộ lọc thuộc tính và thân tin, mọi toán tử và giới hạn.')}
${tl('https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html', '🔁', 'AWS — Thử lại khi giao tin của Amazon SNS', 'Các pha thử lại theo giao thức và cách thêm DLQ cho subscription.')}

<h3>Nguồn</h3>
<ul>
  <li>Fan-out tới SQS: <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html</a> · queue policy cho SNS: <a href="https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html" target="_blank" rel="noopener">…/subscribe-sqs-queue-to-sns-topic.html</a></li>
  <li>Lọc tin: <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html</a></li>
  <li>Raw message delivery: <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html</a></li>
  <li>Thử lại khi giao (100.015 lần trong 23 ngày): <a href="https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html</a></li>
  <li>Hạn mức chi SMS sandbox (1 USD/tháng): <a href="https://docs.aws.amazon.com/sms-voice/latest/userguide/awssupport-spend-threshold.html" target="_blank" rel="noopener">docs.aws.amazon.com/sms-voice/latest/userguide/awssupport-spend-threshold.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/sns/pricing/" target="_blank" rel="noopener">aws.amazon.com/sns/pricing/</a></li>
  <li>Twitter và SMS pumping (Commsrisk, 2023): <a href="https://commsrisk.com/elon-musk-says-twitter-lost-60mn-a-year-because-390-telcos-used-bot-accounts-to-pump-a2p-sms/" target="_blank" rel="noopener">commsrisk.com/elon-musk-says-twitter-lost-60mn-a-year-because-390-telcos-used-bot-accounts-to-pump-a2p-sms/</a></li>
</ul>
</div>
`;

/* ═════ 9.3 — EventBridge ═════ */
const MA_MAU = json(`{
  "source": ["labflow.datlich"],
  "detail-type": ["DatPhongTao"],
  "detail": {
    "phong": [{ "prefix": "A" }],
    "soNguoi": [{ "numeric": [">=", 30] }]
  }
}`);
const MA_SUKIEN = json(`{
  "version": "0",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "DatPhongTao",
  "source": "labflow.datlich",
  "account": "111122223333",
  "time": "2026-11-20T02:50:00Z",
  "region": "ap-southeast-1",
  "resources": [],
  "detail": { "datPhong": "DP-301", "phong": "A101", "soNguoi": 35 }
}`);
const L93_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 3</span>
<h2>9.3 — EventBridge: route events by their content, and replace cron with schedules</h2>
<p class="lead">SNS sends every message to every subscriber (unless a filter says no). <strong>Amazon EventBridge</strong> is built around <strong>rules</strong>: each event is matched against patterns on its content, and only matching rules forward it to their targets. The same bus also receives events from AWS itself (an EC2 instance stopped, an ECS task failed, an object created in S3), and its sibling <strong>EventBridge Scheduler</strong> runs one-time and recurring jobs with a real time zone. This lesson routes LabFlow booking events by room and size, tests a pattern without sending anything, and compares a recurring rule with a one-time reminder schedule.</p>

<h3>The picture: the sorting centre of a post office</h3>
<p>Letters (events) arrive on one belt (<strong>event bus</strong>). The centre does not copy every letter to every town: sorting rules read the envelope — "postcode starts with 70 ⇒ Saigon truck", "registered and heavier than 2 kg ⇒ counter 3" (<strong>rules with patterns</strong>). One letter can match several rules; a letter that matches none is simply not delivered anywhere. And the centre also has a calendar on the wall: "every Monday 07:00 send the report", "on 25 November at 08:30 remind room A101" (<strong>schedules</strong>).</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Event</strong> — JSON with a fixed envelope (<code>source</code>, <code>detail-type</code>, <code>time</code>, <code>account</code>, <code>region</code>, <code>resources</code>) and your own data in <code>detail</code>.</li>
  <li><strong>Event bus</strong> — the <em>default</em> bus receives AWS service events; create a <strong>custom bus</strong> (here <code>labflow</code>) for your application's events.</li>
  <li><strong>Rule</strong> — an event pattern (or a schedule) plus up to <strong>5 targets</strong>: SQS, Lambda, SNS, Step Functions, ECS tasks, another bus, an HTTP API destination…</li>
  <li><strong>Input transformer</strong> — pick fields from the event and build the message the target receives.</li>
  <li><strong>Retries</strong> — if a target fails, EventBridge retries for 24 hours and up to 185 times with backoff and jitter; give the target a <strong>DLQ</strong> to keep what still fails. <strong>Archive and replay</strong> keeps events so you can re-send them after a bug fix.</li>
  <li><strong>EventBridge Scheduler</strong> — schedules as separate resources: <code>at(...)</code> once, <code>rate(...)</code>, <code>cron(...)</code>, each with its own time zone, a flexible window, retries and a DLQ.</li>
</ul>

<h3>See it running (1): a custom bus, one rule, three events</h3>
<p>The pattern: events from <code>labflow.datlich</code>, type <code>DatPhongTao</code>, room starting with A, <strong>at least 30 people</strong> (big groups need a technician on site):</p>
${MA_MAU}
${OUT_93_LUAT}
<ul>
  <li>Three events went in; only <strong>DP-301</strong> (A101, 35 people) reached the queue. A102 failed the numeric test (4 &lt; 30), B202 failed the prefix test. The publisher did not decide any of this.</li>
  <li>The input transformer built a small JSON object from <code>detail.datPhong</code>, <code>detail.phong</code> and <code>time</code>, plus a fixed field <code>canKyThuatVien: true</code> — the consumer gets exactly what it needs and does not have to know the event envelope.</li>
  <li>An event arrives with this shape (your fields only in <code>detail</code>):</li>
</ul>
${MA_SUKIEN}
<ul>
  <li><strong>LocalStack differs:</strong> LocalStack 4.12 fails to insert a <em>numeric</em> field into an input template (log: <code>TargetDeliveryFailure … expected str instance, int found</code>); AWS does it fine. That is why the template here inserts only string fields.</li>
  <li><code>put-events</code> answered <code>FailedEntryCount 0</code> for all three, including the two that matched nothing: "accepted by the bus" is not "delivered somewhere". On AWS the bus metric <code>MatchedEvents</code> and the rule metrics <code>TriggeredRules</code> / <code>FailedInvocations</code> tell you what really happened.</li>
</ul>

<h3>See it running (2): test a pattern without sending an event</h3>
${OUT_93_THUMAU}
<p>29 people ⇒ <code>false</code>, 30 ⇒ <code>true</code>: the boundary is inclusive because the pattern says <code>&gt;=</code>. <code>test-event-pattern</code> is how you unit-test routing — keep a few sample events next to the rule (in Terraform, Chapter 11) and run them in CI, so a typo in a pattern does not silently stop all reminders.</p>

<h3>See it running (3): a recurring rule and a one-time schedule</h3>
${OUT_93_LICH}
<ul>
  <li>The rule <code>rate(1 minute)</code> put a "clean up expired bookings" message in the queue every minute — the cloud version of a crontab line.</li>
  <li>The Scheduler entry <code>at(...)</code> with <code>Asia/Ho_Chi_Minh</code> is the right tool for "remind this booking 30 minutes before": one schedule per booking, its own time zone, and <code>--action-after-completion DELETE</code> so it removes itself after firing.</li>
  <li><strong>LocalStack differs:</strong> the community edition stores Scheduler schedules (create, get, list work) but <strong>does not execute them</strong> — no reminder reached the queue and the schedule is still listed. On AWS the message arrives at that minute and the schedule is deleted. Test the firing itself on real AWS (a schedule a few minutes ahead costs nothing in practice).</li>
  <li>Rule schedules run in <strong>UTC</strong> only; Scheduler handles time zones and daylight saving. A cron "every day 07:00" written in UTC fires at 14:00 in Vietnam — a classic first-week mistake.</li>
</ul>

<h3>SNS, SQS or EventBridge?</h3>
<table>
  <thead><tr><th></th><th>SQS</th><th>SNS</th><th>EventBridge</th></tr></thead>
  <tbody>
    <tr><td>Model</td><td>queue: consumers pull</td><td>topic: push to subscribers</td><td>bus: rules route by content</td></tr>
    <tr><td>Stores messages</td><td>yes (up to 14 days)</td><td>no</td><td>only with an archive</td></tr>
    <tr><td>Filtering</td><td>—</td><td>filter policy per subscription</td><td>event pattern per rule</td></tr>
    <tr><td>AWS service events</td><td>—</td><td>some</td><td>yes, on the default bus</td></tr>
    <tr><td>Schedules</td><td>delay up to 15 minutes</td><td>—</td><td>rules (UTC) + Scheduler</td></tr>
    <tr><td>Price (Singapore)</td><td>0.40 USD / million requests</td><td>0.50 USD / million publishes</td><td>1.00 USD / million custom events</td></tr>
  </tbody>
</table>
<p>In practice they combine: EventBridge or SNS decides <em>who</em> gets an event, an SQS queue in front of each consumer absorbs bursts and retries.</p>

<h3>Real incident: when the event service itself was late (AWS, 25 November 2020)</h3>
<p>During the Kinesis Data Streams event in us-east-1, AWS's summary says CloudWatch Events and EventBridge "experienced increased API errors and delays in event processing" starting at 5:15 AM PST; because ECS and EKS use EventBridge for internal workflows, even provisioning of clusters and tasks was delayed. Managed does not mean "never late". Design consumers so that a late or duplicated event is harmless (idempotent, check the current state before acting), and keep a periodic reconciliation job for anything critical — for example a daily scan for bookings whose reminder was never sent.</p>

<h3>The hacker's angle: schedules as a hiding place</h3>
<p>An attacker who obtains admin rights can leave a quiet rule or schedule behind — every hour, invoke a function that re-creates their access key. Deleting the key then does not end the incident. During any incident response, list rules on every bus and every schedule in every Region, and check CloudTrail for <code>PutRule</code>, <code>PutTargets</code> and <code>CreateSchedule</code> by unknown principals. Day to day: only deployment roles may create rules and schedules, and the role a schedule assumes (<code>RoleArn</code>) gets the one permission it needs — here <code>sqs:SendMessage</code> on one queue.</p>

<h3>At work: "move the cron jobs off the VPS"</h3>
<p>A crontab runs in the server's clock and dies silently with the server; nobody notices a job that did not run. Moving it: one Scheduler schedule per job with an explicit time zone, a target that is a queue or a function, retries plus a DLQ, and an alarm on the DLQ (Chapter 10). Then "did the 07:00 report run?" has an answer in metrics.</p>

<h3>Cost</h3>
<p>Singapore, November 2026: custom events 1.00 USD per million; events from AWS services on the default bus are free. Scheduler: the first 14 million invocations per month are free, then 1.25 USD per million. Archives are billed per GB processed and stored.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"EventBridge or SNS?"</strong> — SNS for simple, high-throughput fan-out to known subscribers; EventBridge for content-based routing, AWS and SaaS events, schemas, archive/replay and many independent consumers owned by different teams.</li>
  <li><strong>"How do you run a job every day at 7 a.m. Vietnam time on AWS?"</strong> — An EventBridge Scheduler schedule <code>cron(0 7 * * ? *)</code> with time zone <code>Asia/Ho_Chi_Minh</code>, targeting a queue or Lambda, with retries and a DLQ.</li>
  <li><strong>"What happens if the target is down?"</strong> — EventBridge retries up to 24 hours / 185 attempts with backoff; configure a DLQ on the target, and use archive/replay to resend after a fix.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Add a second rule on the <code>labflow</code> bus: events of type <code>DatPhongHuy</code> for any room <em>except</em> those starting with <code>LAB-TEST</code>, sent to a new queue <code>labflow-huy</code>. Prove it with <code>test-event-pattern</code> before sending real events.</p>
<p><strong>Done when:</strong> <code>test-event-pattern</code> returns <code>true</code> for room <code>B202</code> and <code>false</code> for <code>LAB-TEST-1</code>, and after two real <code>put-events</code> the queue holds exactly one message.</p>
${giai('Hint', json(`{
  "source": ["labflow.datlich"],
  "detail-type": ["DatPhongHuy"],
  "detail": { "phong": [{ "anything-but": { "prefix": "LAB-TEST" } }] }
}`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Event bus</b><span>Where events arrive; default (AWS services) or custom (your app).</span></div>
  <div><b>Event pattern</b><span>JSON that an event must match: exact values, prefix, numeric, anything-but, exists.</span></div>
  <div><b>Rule / target</b><span>Pattern or schedule + up to 5 destinations.</span></div>
  <div><b>Input transformer</b><span>Builds the target's message from fields of the event.</span></div>
  <div><b>Archive / replay</b><span>Keep events and send them again later.</span></div>
  <div><b>EventBridge Scheduler</b><span>One-time, rate and cron schedules with time zones, retries and DLQ.</span></div>
  <div><b>Reconciliation job</b><span>Periodic check that fixes what late or lost events missed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Events go to a bus; rules match their content and forward to up to 5 targets.</li>
  <li>Accepted by put-events ≠ delivered: watch MatchedEvents and FailedInvocations.</li>
  <li>Unit-test patterns with test-event-pattern; boundaries matter (29 vs 30).</li>
  <li>Scheduler for one-time and time-zoned jobs; rule schedules are UTC.</li>
  <li>LocalStack routes rules and runs rate rules, but does not fire Scheduler schedules.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern-operators.html', '🧩', 'AWS — Comparison operators in event patterns', 'Prefix, suffix, numeric, anything-but, exists, wildcard — with examples.')}
${tl('https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html', '⏰', 'AWS — Schedule types in EventBridge Scheduler', 'One-time, rate and cron schedules, time zones and daylight saving.')}

<h3>Sources</h3>
<ul>
  <li>Event patterns: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html</a> · operators: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern-operators.html" target="_blank" rel="noopener">…/eb-create-pattern-operators.html</a></li>
  <li>Input transformation: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-transform-target-input.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-transform-target-input.html</a></li>
  <li>Retry policy (24 hours, 185 attempts) and DLQ: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html</a></li>
  <li>Quotas (5 targets per rule): <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html</a> · archive and replay: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html" target="_blank" rel="noopener">…/eb-archive.html</a></li>
  <li>EventBridge Scheduler: <a href="https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html" target="_blank" rel="noopener">docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html</a> · schedule types: <a href="https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html" target="_blank" rel="noopener">…/schedule-types.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/eventbridge/pricing/" target="_blank" rel="noopener">aws.amazon.com/eventbridge/pricing/</a></li>
  <li>AWS Kinesis event summary, us-east-1, 25 November 2020: <a href="https://aws.amazon.com/message/11201/" target="_blank" rel="noopener">aws.amazon.com/message/11201/</a></li>
</ul>
</div>
`;
const L93_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 3</span>
<h2>9.3 — EventBridge: định tuyến sự kiện theo nội dung, và thay cron bằng lịch</h2>
<p class="lead">SNS gửi mọi tin tới mọi bên đăng ký (trừ khi bộ lọc chặn). <strong>Amazon EventBridge</strong> xây quanh các <strong>luật (rule)</strong>: mỗi sự kiện được so với các mẫu trên nội dung của nó, và chỉ luật nào khớp mới chuyển nó tới đích của luật đó. Cùng một bus còn nhận sự kiện từ chính AWS (một máy EC2 dừng, một task ECS lỗi, một object được tạo trong S3), và người anh em <strong>EventBridge Scheduler</strong> chạy việc một lần hay định kỳ theo đúng múi giờ. Bài này định tuyến sự kiện đặt phòng LabFlow theo phòng và số người, thử một mẫu mà không gửi gì, và so một luật định kỳ với một lịch nhắc một lần.</p>

<h3>Hình dung: trung tâm chia thư của bưu điện</h3>
<p>Thư (sự kiện) đổ về trên một băng chuyền (<strong>event bus</strong>). Trung tâm không chép mọi lá thư cho mọi tỉnh: các luật phân loại đọc phong bì — "mã bưu chính bắt đầu bằng 70 ⇒ xe đi Sài Gòn", "thư bảo đảm nặng hơn 2 kg ⇒ quầy 3" (<strong>luật có mẫu</strong>). Một lá thư có thể khớp nhiều luật; thư không khớp luật nào thì không được giao đi đâu cả. Và trung tâm còn treo một cuốn lịch: "thứ Hai nào 07:00 cũng gửi báo cáo", "ngày 25/11 lúc 08:30 nhắc phòng A101" (<strong>lịch</strong>).</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Sự kiện (event)</strong> — JSON có phong bì cố định (<code>source</code>, <code>detail-type</code>, <code>time</code>, <code>account</code>, <code>region</code>, <code>resources</code>) và dữ liệu của bạn nằm trong <code>detail</code>.</li>
  <li><strong>Event bus</strong> — bus <em>default</em> nhận sự kiện của các dịch vụ AWS; tạo <strong>bus riêng</strong> (ở đây <code>labflow</code>) cho sự kiện của ứng dụng.</li>
  <li><strong>Luật (rule)</strong> — một mẫu sự kiện (hoặc một lịch) cùng tối đa <strong>5 đích</strong>: SQS, Lambda, SNS, Step Functions, task ECS, một bus khác, một API destination HTTP…</li>
  <li><strong>Input transformer</strong> — nhặt các trường trong sự kiện và dựng nên tin mà đích nhận.</li>
  <li><strong>Thử lại</strong> — đích lỗi thì EventBridge thử lại trong 24 giờ, tối đa 185 lần, có backoff và jitter; cho đích một <strong>DLQ</strong> để giữ những gì vẫn lỗi. <strong>Archive và replay</strong> giữ sự kiện để gửi lại sau khi sửa lỗi.</li>
  <li><strong>EventBridge Scheduler</strong> — lịch là tài nguyên riêng: <code>at(...)</code> một lần, <code>rate(...)</code>, <code>cron(...)</code>, mỗi lịch có múi giờ riêng, cửa sổ linh hoạt, thử lại và DLQ.</li>
</ul>

<h3>Chạy thật (1): bus riêng, một luật, ba sự kiện</h3>
<p>Mẫu: sự kiện từ <code>labflow.datlich</code>, loại <code>DatPhongTao</code>, phòng bắt đầu bằng A, <strong>từ 30 người trở lên</strong> (nhóm đông cần kỹ thuật viên có mặt):</p>
${MA_MAU}
${OUT_93_LUAT}
<ul>
  <li>Ba sự kiện vào; chỉ <strong>DP-301</strong> (A101, 35 người) tới hàng đợi. A102 trượt phép so số (4 &lt; 30), B202 trượt phép prefix. Bên phát không quyết định gì trong chuyện này.</li>
  <li>Input transformer dựng một object JSON nhỏ từ <code>detail.datPhong</code>, <code>detail.phong</code> và <code>time</code>, thêm một trường cố định <code>canKyThuatVien: true</code> — consumer nhận đúng thứ nó cần, không phải biết phong bì sự kiện.</li>
  <li>Một sự kiện tới có hình dạng như sau (trường của bạn chỉ nằm trong <code>detail</code>):</li>
</ul>
${MA_SUKIEN}
<ul>
  <li><strong>LocalStack khác AWS:</strong> LocalStack 4.12 lỗi khi chèn một trường <em>kiểu số</em> vào input template (log: <code>TargetDeliveryFailure … expected str instance, int found</code>); AWS làm bình thường. Vì thế template ở đây chỉ chèn các trường chuỗi.</li>
  <li><code>put-events</code> trả <code>FailedEntryCount 0</code> cho cả ba, kể cả hai sự kiện không khớp gì: "bus đã nhận" không có nghĩa là "đã giao tới đâu đó". Trên AWS, chỉ số <code>MatchedEvents</code> của bus và <code>TriggeredRules</code> / <code>FailedInvocations</code> của luật cho biết chuyện thật.</li>
</ul>

<h3>Chạy thật (2): thử mẫu mà không gửi sự kiện</h3>
${OUT_93_THUMAU}
<p>29 người ⇒ <code>false</code>, 30 ⇒ <code>true</code>: biên được tính vào vì mẫu ghi <code>&gt;=</code>. <code>test-event-pattern</code> là cách viết unit test cho việc định tuyến — giữ vài sự kiện mẫu cạnh luật (trong Terraform, Chương 11) và chạy chúng trong CI, để một lỗi gõ trong mẫu không lặng lẽ làm tắt mọi lời nhắc.</p>

<h3>Chạy thật (3): luật định kỳ và lịch một lần</h3>
${OUT_93_LICH}
<ul>
  <li>Luật <code>rate(1 minute)</code> bỏ vào hàng đợi tin "dọn các đặt phòng quá hạn" mỗi phút — bản đám mây của một dòng crontab.</li>
  <li>Lịch Scheduler <code>at(...)</code> với <code>Asia/Ho_Chi_Minh</code> là công cụ đúng cho "nhắc đặt phòng này trước 30 phút": mỗi đặt phòng một lịch, múi giờ riêng, và <code>--action-after-completion DELETE</code> để lịch tự xoá sau khi chạy.</li>
  <li><strong>LocalStack khác AWS:</strong> bản community có lưu lịch Scheduler (create, get, list đều chạy) nhưng <strong>không thực thi</strong> — không lời nhắc nào tới hàng đợi và lịch vẫn còn trong danh sách. Trên AWS tin tới đúng phút đó và lịch bị xoá. Hãy thử việc kích hoạt trên AWS thật (một lịch đặt vài phút tới gần như không tốn gì).</li>
  <li>Lịch của luật chỉ chạy theo <strong>UTC</strong>; Scheduler lo múi giờ và giờ mùa hè. Một cron "07:00 hằng ngày" viết theo UTC sẽ chạy lúc 14:00 giờ Việt Nam — lỗi kinh điển tuần đầu đi làm.</li>
</ul>

<h3>SNS, SQS hay EventBridge?</h3>
<table>
  <thead><tr><th></th><th>SQS</th><th>SNS</th><th>EventBridge</th></tr></thead>
  <tbody>
    <tr><td>Mô hình</td><td>hàng đợi: consumer kéo về</td><td>topic: đẩy tới bên đăng ký</td><td>bus: luật định tuyến theo nội dung</td></tr>
    <tr><td>Giữ tin</td><td>có (tới 14 ngày)</td><td>không</td><td>chỉ khi có archive</td></tr>
    <tr><td>Lọc</td><td>—</td><td>filter policy từng subscription</td><td>mẫu sự kiện từng luật</td></tr>
    <tr><td>Sự kiện dịch vụ AWS</td><td>—</td><td>một số</td><td>có, trên bus default</td></tr>
    <tr><td>Lịch</td><td>trễ tối đa 15 phút</td><td>—</td><td>luật (UTC) + Scheduler</td></tr>
    <tr><td>Giá (Singapore)</td><td>0,40 USD / triệu yêu cầu</td><td>0,50 USD / triệu lần phát</td><td>1,00 USD / triệu sự kiện riêng</td></tr>
  </tbody>
</table>
<p>Trong thực tế chúng đi cùng nhau: EventBridge hay SNS quyết định <em>ai</em> nhận sự kiện, một hàng SQS đứng trước mỗi consumer để đỡ đợt tăng đột biến và thử lại.</p>

<h3>Sự cố thật: khi chính dịch vụ sự kiện bị chậm (AWS, 25/11/2020)</h3>
<p>Trong sự cố Kinesis Data Streams ở us-east-1, bản tóm tắt của AWS ghi CloudWatch Events và EventBridge "gặp lỗi API tăng và độ trễ trong xử lý sự kiện" từ 5:15 sáng giờ PST; vì ECS và EKS dùng EventBridge cho luồng việc nội bộ, cả việc dựng cluster và task cũng bị trễ. Dịch vụ được quản lý không có nghĩa là "không bao giờ trễ". Thiết kế consumer sao cho sự kiện tới muộn hay bị trùng đều vô hại (idempotent, kiểm trạng thái hiện tại trước khi làm), và giữ một việc đối soát định kỳ cho thứ quan trọng — ví dụ mỗi ngày quét các đặt phòng chưa từng được nhắc.</p>

<h3>Góc hacker: lịch là chỗ ẩn nấp</h3>
<p>Kẻ tấn công có quyền admin có thể để lại một luật hay một lịch lặng lẽ — mỗi giờ gọi một hàm tạo lại khoá truy cập của họ. Xoá khoá khi đó không chấm dứt sự cố. Trong mọi lần ứng cứu sự cố, liệt kê luật trên mọi bus và mọi lịch ở mọi Region, và tìm trong CloudTrail các lệnh <code>PutRule</code>, <code>PutTargets</code>, <code>CreateSchedule</code> do chủ thể lạ gọi. Hằng ngày: chỉ role deploy được tạo luật và lịch, và role mà lịch dùng (<code>RoleArn</code>) chỉ có đúng một quyền cần — ở đây là <code>sqs:SendMessage</code> trên một hàng đợi.</p>

<h3>Đi làm: "chuyển các cron job khỏi VPS"</h3>
<p>Crontab chạy theo đồng hồ của máy chủ và chết lặng lẽ cùng máy chủ; không ai để ý một việc đã không chạy. Khi chuyển: mỗi việc một lịch Scheduler có múi giờ rõ ràng, đích là một hàng đợi hay một hàm, có thử lại và DLQ, và cảnh báo trên DLQ (Chương 10). Khi đó câu hỏi "báo cáo 07:00 đã chạy chưa?" có câu trả lời trong chỉ số.</p>

<h3>Chi phí</h3>
<p>Singapore, tháng 11/2026: sự kiện riêng 1,00 USD mỗi triệu; sự kiện của dịch vụ AWS trên bus default miễn phí. Scheduler: 14 triệu lần gọi đầu mỗi tháng miễn phí, sau đó 1,25 USD mỗi triệu. Archive tính theo GB xử lý và lưu trữ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"EventBridge hay SNS?"</strong> — SNS cho fan-out đơn giản, thông lượng cao tới những bên nhận đã biết; EventBridge cho định tuyến theo nội dung, sự kiện của AWS và SaaS, schema, archive/replay và nhiều consumer độc lập do nhiều nhóm khác nhau sở hữu.</li>
  <li><strong>"Chạy một việc lúc 7 giờ sáng giờ Việt Nam mỗi ngày trên AWS thế nào?"</strong> — Một lịch EventBridge Scheduler <code>cron(0 7 * * ? *)</code> với múi giờ <code>Asia/Ho_Chi_Minh</code>, đích là hàng đợi hay Lambda, có thử lại và DLQ.</li>
  <li><strong>"Đích đang hỏng thì sao?"</strong> — EventBridge thử lại tới 24 giờ / 185 lần có backoff; cấu hình DLQ cho đích, và dùng archive/replay để gửi lại sau khi sửa.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Thêm luật thứ hai trên bus <code>labflow</code>: sự kiện loại <code>DatPhongHuy</code> cho mọi phòng <em>trừ</em> những phòng bắt đầu bằng <code>LAB-TEST</code>, gửi tới hàng mới <code>labflow-huy</code>. Chứng minh bằng <code>test-event-pattern</code> trước khi gửi sự kiện thật.</p>
<p><strong>Đạt khi:</strong> <code>test-event-pattern</code> trả <code>true</code> với phòng <code>B202</code> và <code>false</code> với <code>LAB-TEST-1</code>, và sau hai lần <code>put-events</code> thật hàng đợi có đúng một tin.</p>
${giai('Gợi ý', json(`{
  "source": ["labflow.datlich"],
  "detail-type": ["DatPhongHuy"],
  "detail": { "phong": [{ "anything-but": { "prefix": "LAB-TEST" } }] }
}`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Event bus</b><span>Nơi sự kiện đổ về; default (dịch vụ AWS) hoặc riêng (ứng dụng của bạn).</span></div>
  <div><b>Event pattern</b><span>JSON sự kiện phải khớp: giá trị đúng, prefix, so số, anything-but, exists.</span></div>
  <div><b>Rule / target</b><span>Mẫu hoặc lịch + tối đa 5 đích.</span></div>
  <div><b>Input transformer</b><span>Dựng tin cho đích từ các trường của sự kiện.</span></div>
  <div><b>Archive / replay</b><span>Giữ sự kiện và gửi lại sau.</span></div>
  <div><b>EventBridge Scheduler</b><span>Lịch một lần, rate và cron có múi giờ, thử lại và DLQ.</span></div>
  <div><b>Việc đối soát</b><span>Kiểm tra định kỳ để bù những gì sự kiện trễ hay mất bỏ sót.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sự kiện vào một bus; luật khớp nội dung và chuyển tới tối đa 5 đích.</li>
  <li>put-events nhận ≠ đã giao: theo dõi MatchedEvents và FailedInvocations.</li>
  <li>Unit test mẫu bằng test-event-pattern; biên rất quan trọng (29 với 30).</li>
  <li>Scheduler cho việc một lần và có múi giờ; lịch của luật chạy theo UTC.</li>
  <li>LocalStack định tuyến luật và chạy luật rate, nhưng không kích hoạt lịch Scheduler.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern-operators.html', '🧩', 'AWS — Toán tử so sánh trong event pattern', 'Prefix, suffix, so số, anything-but, exists, wildcard — kèm ví dụ.')}
${tl('https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html', '⏰', 'AWS — Các kiểu lịch trong EventBridge Scheduler', 'Lịch một lần, rate và cron, múi giờ và giờ mùa hè.')}

<h3>Nguồn</h3>
<ul>
  <li>Event pattern: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html</a> · toán tử: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern-operators.html" target="_blank" rel="noopener">…/eb-create-pattern-operators.html</a></li>
  <li>Biến đổi đầu vào: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-transform-target-input.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-transform-target-input.html</a></li>
  <li>Chính sách thử lại (24 giờ, 185 lần) và DLQ: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html</a></li>
  <li>Hạn mức (5 đích mỗi luật): <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html" target="_blank" rel="noopener">docs.aws.amazon.com/eventbridge/latest/userguide/eb-quota.html</a> · archive và replay: <a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html" target="_blank" rel="noopener">…/eb-archive.html</a></li>
  <li>EventBridge Scheduler: <a href="https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html" target="_blank" rel="noopener">docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html</a> · kiểu lịch: <a href="https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html" target="_blank" rel="noopener">…/schedule-types.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/eventbridge/pricing/" target="_blank" rel="noopener">aws.amazon.com/eventbridge/pricing/</a></li>
  <li>Tóm tắt sự cố Kinesis của AWS, us-east-1, 25/11/2020: <a href="https://aws.amazon.com/message/11201/" target="_blank" rel="noopener">aws.amazon.com/message/11201/</a></li>
</ul>
</div>
`;

/* ═════ 9.4 — S3 → SQS → Lambda ═════ */
const MA_QUYEN_THUNHO = json(`{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::labflow-anh-goc/goc/*" },
    { "Effect": "Allow", "Action": "s3:PutObject", "Resource": "arn:aws:s3:::labflow-anh-nho/nho/*" },
    { "Effect": "Allow",
      "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
      "Resource": "arn:aws:sqs:ap-southeast-1:111122223333:labflow-anh-viec" }
  ]
}`);
const L94_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 4</span>
<h2>9.4 — Triggers: an S3 → SQS → Lambda pipeline that makes thumbnails (and survives bad images)</h2>
<p class="lead">Lab managers upload photos of each room; the booking page needs small thumbnails. Resizing inside the upload request makes uploads slow and fragile. Instead, S3 announces "object created", a queue holds the work, and a Lambda function with the <strong>sharp</strong> library writes a 320-pixel WebP to another bucket. This lesson runs the whole pipeline for real — including a corrupt file and a 6000 × 6000 "image bomb" that end in a dead-letter queue instead of crashing anything — and shows how not to repeat the infinite loop from Lesson 8.4.</p>

<h3>The picture: the photo shop's drop box</h3>
<p>Customers drop rolls of film into a box by the door and leave (<strong>upload to S3</strong>). Each roll gets a ticket on the board (<strong>event in a queue</strong>). Workers in the back take a few tickets at a time (<strong>batch</strong>) and put prints in a <em>different</em> tray (<strong>another bucket</strong>) — if they put prints back into the drop box, they would develop their own prints forever. A roll that cannot be developed goes to the manager after two tries (<strong>DLQ</strong>), and nobody tries to print a poster the size of a building (<strong>pixel limit</strong>).</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>S3 event notifications</strong> — on <code>s3:ObjectCreated:*</code>, <code>s3:ObjectRemoved:*</code>…, filtered by key <strong>prefix/suffix</strong>, sent to SQS, SNS, Lambda — or all events to <strong>EventBridge</strong> (then filter with rules, Lesson 9.3). Delivery is at least once and not ordered.</li>
  <li><strong>Why a queue in the middle</strong> — S3 → Lambda directly is an <em>asynchronous</em> invoke: a couple of retries, then the event goes to an on-failure destination or is lost. S3 → SQS → Lambda gives you a buffer, a visible backlog, controlled concurrency, retries per message and a DLQ.</li>
  <li><strong>Event source mapping</strong> — Lambda polls the queue for you: <strong>batch size</strong>, <strong>batching window</strong>, and with <code>ReportBatchItemFailures</code> the function returns only the failed message ids, so one bad image does not make the four good ones run again.</li>
  <li><strong>Visibility timeout ≥ 6 × function timeout</strong> (AWS's recommendation) — otherwise a slow batch reappears while it is still running.</li>
  <li><strong>Native modules</strong> — sharp ships a compiled libvips; the package must match Lambda's OS and CPU (<code>linux</code>, <code>x64</code> or <code>arm64</code>, glibc). Installing on a Mac and zipping is the classic "works locally, crashes in Lambda" mistake.</li>
</ul>

<h3>The function</h3>
${MA_THUNHO}
<ul>
  <li>The SDK client is created outside the handler (reused while warm, Lesson 8.1).</li>
  <li>Each SQS record carries an S3 event as a JSON string; S3 also sends an <code>s3:TestEvent</code> without <code>Records</code> when you configure the notification — skip it.</li>
  <li>Object keys arrive URL-encoded (a space becomes <code>+</code>): decode before <code>GetObject</code>, or files with spaces fail with NoSuchKey.</li>
  <li><code>limitInputPixels: 25_000_000</code> refuses anything above 25 megapixels before decoding it.</li>
  <li>Output goes to <code>labflow-anh-nho</code>, a different bucket, so the function can never trigger itself.</li>
</ul>

<h3>See it running (1): build the pipeline and upload five files</h3>
${OUT_94_ANH}
${OUT_94_DUNG}
<ul>
  <li>The notification only covers prefix <code>goc/</code>: the upload to <code>tam/</code> starts nothing.</li>
  <li><code>hong.jpg</code> is text with an image name; <code>bom.png</code> is 6000 × 6000 = 36 million pixels of white that compresses to a small file — small on disk, huge in memory once decoded.</li>
</ul>

<h3>See it running (2): the thumbnails</h3>
${OUT_94_KETQUA}

<h3>See it running (3): the bad files end in the DLQ</h3>
${OUT_94_DLQ}
<ul>
  <li>The three real photos became WebP thumbnails 320 pixels wide in one pass. The two bad files failed, were reported in <code>batchItemFailures</code>, came back after the visibility timeout, failed again, and after <code>maxReceiveCount: 2</code> moved to <code>labflow-anh-dlq</code>.</li>
  <li>The log tells the two failures apart: an unsupported format versus a pixel limit. Alarm on the DLQ; a human decides whether to tell the uploader or to raise the limit.</li>
  <li><strong>LocalStack differs:</strong> on AWS you would also see <code>Init Duration</code> on the first REPORT line and the real <code>Max Memory Used</code> — that is how you size memory for image work. LocalStack's IAM is not enforced, so the narrow policy below is not tested here.</li>
</ul>

<h3>The loop, again: why output goes to another bucket</h3>
<p>In Lesson 8.4 a function writing thumbnails into the same bucket created 2,150 objects in a minute. Here the protection is structural: the trigger listens on <code>labflow-anh-goc/goc/</code>, the function writes to <code>labflow-anh-nho/nho/</code>, and the execution role cannot write to the source bucket at all. AWS's recursive loop detection (for SQS, S3, SNS and EventBridge custom buses) stops runaway loops after about 16 rounds — a seat belt, not a design.</p>

<h3>Least privilege for the function</h3>
${MA_QUYEN_THUNHO}
<p>Read only originals, write only thumbnails, consume only its queue (account id is a placeholder). If the function is ever compromised through a malicious image, this is all the attacker gets.</p>

<h3>Real incident: ImageTragick (ImageMagick, 2016)</h3>
<p>In May 2016 a set of vulnerabilities in ImageMagick — the most common image library on web servers — was published as "ImageTragick". CVE-2016-3714 allowed remote code execution through crafted image files: any site that resized user uploads with ImageMagick could run an attacker's commands just by processing a picture. Defences that still apply:</p>
<ul>
  <li>Check the file's real type by its magic bytes, not by its name or <code>Content-Type</code>; accept only the formats you need.</li>
  <li>Limit pixels, file size and processing time (<code>limitInputPixels</code>, S3 upload size in presigned POST conditions — Lesson 2.4 — and the function timeout).</li>
  <li>Process untrusted files in an isolated, short-lived worker with a minimal role — which is exactly what a Lambda function behind a queue is.</li>
  <li>Keep image libraries updated; subscribe to their security advisories.</li>
</ul>

<h3>At work: "I uploaded a photo but the thumbnail never appeared"</h3>
<p>Walk the pipeline in order: did the object land under the right prefix (the filter is case-sensitive)? Did a message arrive in the queue (metric <code>NumberOfMessagesSent</code>)? Is the event source mapping <code>Enabled</code>? What do the function's logs say for that key? Is the message in the DLQ? Each hop has its own evidence; guessing is slower than reading.</p>

<h3>Cost for 10,000 photos a month</h3>
<p>Lambda at 1,024 MB took 375 ms here for a batch of five files; even at half a second per photo, 10,000 photos are about 5,000 GB-seconds — inside the free 400,000 GB-seconds. SQS and S3 requests are a few tens of thousands — cents at most. Storage of thumbnails is tiny. The real costs in image pipelines are storing originals and data transfer when users download them (CloudFront, Lesson 5.4).</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"S3 → Lambda directly, or through SQS?"</strong> — Through SQS when you need buffering, controlled concurrency, visible backlog, per-message retries and a DLQ; direct is fine for light, fast work where an occasional loss is acceptable.</li>
  <li><strong>"One message in a batch of ten fails. What happens?"</strong> — Without partial batch response, the whole batch becomes visible again and nine good messages are processed twice. With <code>ReportBatchItemFailures</code>, only the failed one returns.</li>
  <li><strong>"How do you avoid an infinite trigger loop?"</strong> — Write output to another bucket (or a prefix not covered by the trigger), keep the role unable to write to the source, and rely on recursive loop detection only as a last resort.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Add a suffix filter so only <code>.jpg</code>, <code>.jpeg</code> and <code>.png</code> under <code>goc/</code> start the pipeline (S3 allows one prefix and one suffix per rule — so you need several rules).</p>
<p><strong>Done when:</strong> uploading <code>goc/ghi-chu.txt</code> produces no message in <code>labflow-anh-viec</code>, while <code>goc/phong-c303.png</code> still produces a thumbnail.</p>
${giai('Hint', json(`{"QueueConfigurations": [
  {"QueueArn": "<queue-arn>", "Events": ["s3:ObjectCreated:*"],
   "Filter": {"Key": {"FilterRules": [{"Name": "prefix", "Value": "goc/"}, {"Name": "suffix", "Value": ".jpg"}]}}},
  {"QueueArn": "<queue-arn>", "Events": ["s3:ObjectCreated:*"],
   "Filter": {"Key": {"FilterRules": [{"Name": "prefix", "Value": "goc/"}, {"Name": "suffix", "Value": ".png"}]}}}
]}`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Event notification</b><span>S3 message on object created/removed, filtered by prefix/suffix.</span></div>
  <div><b>Event source mapping</b><span>Lambda's poller for SQS: batch size, window, concurrency.</span></div>
  <div><b>Partial batch response</b><span>Return only failed message ids (ReportBatchItemFailures).</span></div>
  <div><b>Native module</b><span>Package with compiled code; must match Lambda's OS/CPU.</span></div>
  <div><b>Image bomb</b><span>Small file that decodes into a huge image to exhaust memory.</span></div>
  <div><b>Magic bytes</b><span>First bytes of a file that reveal its real format.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>S3 → SQS → Lambda: buffer, retries per message, DLQ, controlled concurrency.</li>
  <li>Visibility timeout ≥ 6 × function timeout; report partial batch failures.</li>
  <li>Trigger on originals, write elsewhere, role cannot write to the source.</li>
  <li>Treat images as hostile input: type check, pixel limit, isolated worker.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html', '🧯', 'AWS — Handling errors for an SQS event source in Lambda', 'Partial batch responses, retries and DLQ together.')}
${tl('https://sharp.pixelplumbing.com/api-constructor', '🖼', 'sharp — constructor options', 'limitInputPixels, failOn, sequentialRead and other safety options.')}

<h3>Sources</h3>
<ul>
  <li>S3 event notifications: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html</a> · S3 → EventBridge: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html" target="_blank" rel="noopener">…/EventBridge.html</a></li>
  <li>Lambda with SQS: <a href="https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/with-sqs.html</a> · error handling: <a href="https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html" target="_blank" rel="noopener">…/services-sqs-errorhandling.html</a></li>
  <li>Recursive loop detection: <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html</a></li>
  <li>sharp constructor (limitInputPixels): <a href="https://sharp.pixelplumbing.com/api-constructor" target="_blank" rel="noopener">sharp.pixelplumbing.com/api-constructor</a></li>
  <li>ImageTragick: <a href="https://imagetragick.com/" target="_blank" rel="noopener">imagetragick.com</a> · CVE-2016-3714: <a href="https://nvd.nist.gov/vuln/detail/CVE-2016-3714" target="_blank" rel="noopener">nvd.nist.gov/vuln/detail/CVE-2016-3714</a></li>
</ul>
</div>
`;
const L94_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 4</span>
<h2>9.4 — Kích hoạt: đường ống S3 → SQS → Lambda tạo ảnh thu nhỏ (và sống sót trước ảnh xấu)</h2>
<p class="lead">Người quản lý phòng lab tải ảnh từng phòng lên; trang đặt phòng cần ảnh thu nhỏ. Đổi cỡ ảnh ngay trong yêu cầu tải lên làm việc tải lên chậm và dễ hỏng. Thay vào đó, S3 báo "object đã được tạo", một hàng đợi giữ việc, và một hàm Lambda dùng thư viện <strong>sharp</strong> ghi ảnh WebP rộng 320 pixel sang một bucket khác. Bài này chạy thật cả đường ống — kể cả một tệp hỏng và một "quả bom ảnh" 6000 × 6000 kết thúc trong dead-letter queue thay vì làm sập thứ gì — và chỉ cách không lặp lại vòng lặp vô hạn của Bài 8.4.</p>

<h3>Hình dung: hộp gửi phim của tiệm ảnh</h3>
<p>Khách thả cuộn phim vào hộp cạnh cửa rồi đi (<strong>tải lên S3</strong>). Mỗi cuộn có một phiếu trên bảng (<strong>sự kiện trong hàng đợi</strong>). Thợ phía sau lấy vài phiếu một lần (<strong>lô</strong>) và để ảnh in ra vào một khay <em>khác</em> (<strong>bucket khác</strong>) — nếu để ảnh in lại vào hộp gửi, họ sẽ rửa chính ảnh của mình mãi mãi. Cuộn nào không rửa được thì sau hai lần thử chuyển cho quản lý (<strong>DLQ</strong>), và không ai cố in một tấm áp phích to bằng toà nhà (<strong>giới hạn số pixel</strong>).</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Thông báo sự kiện S3</strong> — khi <code>s3:ObjectCreated:*</code>, <code>s3:ObjectRemoved:*</code>…, lọc theo <strong>prefix/suffix</strong> của khoá, gửi tới SQS, SNS, Lambda — hoặc gửi mọi sự kiện sang <strong>EventBridge</strong> (rồi lọc bằng luật, Bài 9.3). Giao ít nhất một lần và không theo thứ tự.</li>
  <li><strong>Vì sao có hàng đợi ở giữa</strong> — S3 → Lambda trực tiếp là gọi <em>bất đồng bộ</em>: vài lần thử lại, rồi sự kiện đi tới đích khi lỗi (on-failure destination) hoặc mất. S3 → SQS → Lambda cho bạn bộ đệm, tồn đọng nhìn thấy được, kiểm soát số chạy song song, thử lại theo từng tin và DLQ.</li>
  <li><strong>Event source mapping</strong> — Lambda tự hỏi hàng đợi thay bạn: <strong>batch size</strong>, <strong>batching window</strong>, và với <code>ReportBatchItemFailures</code> hàm chỉ trả về mã các tin lỗi, nên một ảnh hỏng không làm bốn ảnh tốt chạy lại.</li>
  <li><strong>Visibility timeout ≥ 6 × timeout của hàm</strong> (khuyến nghị của AWS) — không thì một lô chạy chậm sẽ hiện lại trong khi nó vẫn đang chạy.</li>
  <li><strong>Mô-đun native</strong> — sharp kèm libvips đã biên dịch; gói phải khớp hệ điều hành và CPU của Lambda (<code>linux</code>, <code>x64</code> hoặc <code>arm64</code>, glibc). Cài trên Mac rồi nén lại là lỗi kinh điển "máy mình chạy, lên Lambda thì sập".</li>
</ul>

<h3>Hàm</h3>
${MA_THUNHO}
<ul>
  <li>Client SDK tạo ngoài handler (dùng lại khi còn ấm, Bài 8.1).</li>
  <li>Mỗi bản ghi SQS mang một sự kiện S3 dạng chuỗi JSON; S3 còn gửi một <code>s3:TestEvent</code> không có <code>Records</code> lúc bạn cấu hình thông báo — bỏ qua nó.</li>
  <li>Khoá object tới ở dạng mã hoá URL (dấu cách thành <code>+</code>): giải mã trước khi <code>GetObject</code>, không thì tệp có dấu cách lỗi NoSuchKey.</li>
  <li><code>limitInputPixels: 25_000_000</code> từ chối mọi thứ trên 25 megapixel trước khi giải mã.</li>
  <li>Đầu ra vào <code>labflow-anh-nho</code>, một bucket khác, nên hàm không bao giờ tự kích hoạt chính nó.</li>
</ul>

<h3>Chạy thật (1): dựng đường ống và tải lên năm tệp</h3>
${OUT_94_ANH}
${OUT_94_DUNG}
<ul>
  <li>Thông báo chỉ phủ prefix <code>goc/</code>: tệp tải vào <code>tam/</code> không khởi động gì.</li>
  <li><code>hong.jpg</code> là chữ mang tên ảnh; <code>bom.png</code> là 6000 × 6000 = 36 triệu pixel trắng nén thành một tệp nhỏ — nhỏ trên đĩa, khổng lồ trong bộ nhớ khi giải mã.</li>
</ul>

<h3>Chạy thật (2): các ảnh thu nhỏ</h3>
${OUT_94_KETQUA}

<h3>Chạy thật (3): tệp xấu kết thúc trong DLQ</h3>
${OUT_94_DLQ}
<ul>
  <li>Ba ảnh thật thành ảnh WebP rộng 320 pixel trong một lượt. Hai tệp xấu lỗi, được báo trong <code>batchItemFailures</code>, quay lại sau visibility timeout, lỗi lần nữa, và sau <code>maxReceiveCount: 2</code> chuyển sang <code>labflow-anh-dlq</code>.</li>
  <li>Log phân biệt được hai kiểu lỗi: định dạng không hỗ trợ và vượt giới hạn pixel. Đặt cảnh báo trên DLQ; một người quyết định báo lại cho người tải lên hay nâng giới hạn.</li>
  <li><strong>LocalStack khác AWS:</strong> trên AWS bạn còn thấy <code>Init Duration</code> ở dòng REPORT đầu và <code>Max Memory Used</code> thật — đó là cách chọn bộ nhớ cho việc xử lý ảnh. IAM của LocalStack không được thực thi, nên policy hẹp dưới đây không được thử ở đây.</li>
</ul>

<h3>Lại vòng lặp: vì sao đầu ra vào bucket khác</h3>
<p>Ở Bài 8.4, một hàm ghi ảnh thu nhỏ vào cùng bucket đã tạo 2.150 object trong một phút. Ở đây cách phòng nằm ở cấu trúc: kích hoạt nghe trên <code>labflow-anh-goc/goc/</code>, hàm ghi vào <code>labflow-anh-nho/nho/</code>, và role của hàm hoàn toàn không ghi được vào bucket nguồn. Cơ chế phát hiện vòng lặp đệ quy của AWS (cho SQS, S3, SNS và bus EventBridge riêng) chặn vòng lặp sau khoảng 16 vòng — là dây an toàn, không phải thiết kế.</p>

<h3>Quyền tối thiểu cho hàm</h3>
${MA_QUYEN_THUNHO}
<p>Chỉ đọc ảnh gốc, chỉ ghi ảnh thu nhỏ, chỉ tiêu thụ hàng đợi của nó (số tài khoản là chỗ giữ). Nếu hàm bị chiếm qua một ảnh độc, kẻ tấn công chỉ có chừng ấy.</p>

<h3>Sự cố thật: ImageTragick (ImageMagick, 2016)</h3>
<p>Tháng 5/2016, một loạt lỗ hổng trong ImageMagick — thư viện ảnh phổ biến nhất trên máy chủ web — được công bố với tên "ImageTragick". CVE-2016-3714 cho phép thực thi mã từ xa qua tệp ảnh được chế tác: trang nào đổi cỡ ảnh người dùng tải lên bằng ImageMagick đều có thể chạy lệnh của kẻ tấn công chỉ vì xử lý một tấm ảnh. Những cách phòng vẫn còn nguyên giá trị:</p>
<ul>
  <li>Kiểm loại thật của tệp bằng các byte đầu (magic bytes), không theo tên hay <code>Content-Type</code>; chỉ nhận định dạng bạn cần.</li>
  <li>Giới hạn số pixel, cỡ tệp và thời gian xử lý (<code>limitInputPixels</code>, cỡ tải lên trong điều kiện của presigned POST — Bài 2.4 — và timeout của hàm).</li>
  <li>Xử lý tệp không tin cậy trong một worker tách biệt, sống ngắn, quyền tối thiểu — đúng là một hàm Lambda đứng sau hàng đợi.</li>
  <li>Cập nhật thư viện ảnh; theo dõi thông báo bảo mật của chúng.</li>
</ul>

<h3>Đi làm: "em tải ảnh lên rồi mà không thấy ảnh thu nhỏ"</h3>
<p>Đi dọc đường ống theo thứ tự: object có nằm đúng prefix không (bộ lọc phân biệt hoa thường)? Có tin vào hàng đợi không (chỉ số <code>NumberOfMessagesSent</code>)? Event source mapping có <code>Enabled</code> không? Log của hàm nói gì về khoá đó? Tin có nằm trong DLQ không? Mỗi chặng có bằng chứng riêng; đoán chậm hơn đọc.</p>

<h3>Chi phí cho 10.000 ảnh mỗi tháng</h3>
<p>Lambda 1.024 MB ở đây mất 375 ms cho một lô năm tệp; kể cả nửa giây mỗi ảnh thì 10.000 ảnh cũng chỉ khoảng 5.000 GB-giây — nằm trong 400.000 GB-giây miễn phí. Yêu cầu SQS và S3 vài chục nghìn — nhiều lắm vài xu. Lưu ảnh thu nhỏ rất nhỏ. Chi phí thật của đường ống ảnh là lưu ảnh gốc và truyền dữ liệu khi người dùng tải về (CloudFront, Bài 5.4).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"S3 → Lambda trực tiếp hay qua SQS?"</strong> — Qua SQS khi cần bộ đệm, kiểm soát số chạy song song, tồn đọng nhìn thấy được, thử lại theo từng tin và DLQ; trực tiếp ổn cho việc nhẹ, nhanh mà thỉnh thoảng mất một sự kiện vẫn chấp nhận được.</li>
  <li><strong>"Một tin trong lô mười bị lỗi. Chuyện gì xảy ra?"</strong> — Không có partial batch response thì cả lô hiện lại và chín tin tốt bị xử lý hai lần. Có <code>ReportBatchItemFailures</code> thì chỉ tin lỗi quay lại.</li>
  <li><strong>"Tránh vòng lặp kích hoạt vô hạn thế nào?"</strong> — Ghi đầu ra sang bucket khác (hoặc prefix không thuộc kích hoạt), giữ role không ghi được vào nguồn, và chỉ coi phát hiện vòng lặp đệ quy là phương án cuối.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Thêm bộ lọc suffix để chỉ <code>.jpg</code>, <code>.jpeg</code> và <code>.png</code> dưới <code>goc/</code> mới khởi động đường ống (S3 cho một prefix và một suffix mỗi luật — nên bạn cần vài luật).</p>
<p><strong>Đạt khi:</strong> tải <code>goc/ghi-chu.txt</code> lên không sinh tin nào trong <code>labflow-anh-viec</code>, còn <code>goc/phong-c303.png</code> vẫn ra ảnh thu nhỏ.</p>
${giai('Gợi ý', json(`{"QueueConfigurations": [
  {"QueueArn": "<queue-arn>", "Events": ["s3:ObjectCreated:*"],
   "Filter": {"Key": {"FilterRules": [{"Name": "prefix", "Value": "goc/"}, {"Name": "suffix", "Value": ".jpg"}]}}},
  {"QueueArn": "<queue-arn>", "Events": ["s3:ObjectCreated:*"],
   "Filter": {"Key": {"FilterRules": [{"Name": "prefix", "Value": "goc/"}, {"Name": "suffix", "Value": ".png"}]}}}
]}`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Event notification</b><span>Tin của S3 khi object được tạo/xoá, lọc theo prefix/suffix.</span></div>
  <div><b>Event source mapping</b><span>Bộ hỏi hàng SQS của Lambda: batch size, window, số chạy song song.</span></div>
  <div><b>Partial batch response</b><span>Chỉ trả mã các tin lỗi (ReportBatchItemFailures).</span></div>
  <div><b>Mô-đun native</b><span>Gói có mã đã biên dịch; phải khớp hệ điều hành/CPU của Lambda.</span></div>
  <div><b>Bom ảnh</b><span>Tệp nhỏ giải mã thành ảnh khổng lồ để vắt cạn bộ nhớ.</span></div>
  <div><b>Magic bytes</b><span>Các byte đầu của tệp cho biết định dạng thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>S3 → SQS → Lambda: bộ đệm, thử lại theo từng tin, DLQ, kiểm soát số chạy song song.</li>
  <li>Visibility timeout ≥ 6 × timeout của hàm; báo lỗi theo từng tin trong lô.</li>
  <li>Kích hoạt trên ảnh gốc, ghi chỗ khác, role không ghi được vào nguồn.</li>
  <li>Coi ảnh là đầu vào thù địch: kiểm loại, giới hạn pixel, worker tách biệt.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html', '🧯', 'AWS — Xử lý lỗi cho nguồn sự kiện SQS trong Lambda', 'Partial batch response, thử lại và DLQ đi cùng nhau.')}
${tl('https://sharp.pixelplumbing.com/api-constructor', '🖼', 'sharp — tuỳ chọn khởi tạo', 'limitInputPixels, failOn, sequentialRead và các tuỳ chọn an toàn khác.')}

<h3>Nguồn</h3>
<ul>
  <li>Thông báo sự kiện S3: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html</a> · S3 → EventBridge: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html" target="_blank" rel="noopener">…/EventBridge.html</a></li>
  <li>Lambda với SQS: <a href="https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/with-sqs.html</a> · xử lý lỗi: <a href="https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html" target="_blank" rel="noopener">…/services-sqs-errorhandling.html</a></li>
  <li>Phát hiện vòng lặp đệ quy: <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html</a></li>
  <li>Khởi tạo sharp (limitInputPixels): <a href="https://sharp.pixelplumbing.com/api-constructor" target="_blank" rel="noopener">sharp.pixelplumbing.com/api-constructor</a></li>
  <li>ImageTragick: <a href="https://imagetragick.com/" target="_blank" rel="noopener">imagetragick.com</a> · CVE-2016-3714: <a href="https://nvd.nist.gov/vuln/detail/CVE-2016-3714" target="_blank" rel="noopener">nvd.nist.gov/vuln/detail/CVE-2016-3714</a></li>
</ul>
</div>
`;

/* ═════ 9.5 — Lab 9 ═════ */
const L95_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab</span>
<h2>9.5 — Chapter 9 lab: the booking notification pipeline for LabFlow + interview questions</h2>
<p class="lead">You build the event pipeline LabFlow will really use: the API publishes one event per booking, SNS fans it out, one queue feeds the email worker, another feeds the refund service only for cancellations. A grader checks 8 properties — configuration <em>and</em> behaviour. A hasty version that "works" scores 1/8; your job is 8/8, then clean up to zero.</p>

<h3>The assignment</h3>
<ul>
  <li>Topic <code>labflow-datphong</code>. Each event carries the message attribute <code>loai</code> = <code>dat</code> (booked) or <code>huy</code> (cancelled).</li>
  <li>Queue <code>labflow-email</code> receives every event, <strong>raw</strong> (the consumer parses the body once). Its consumer has a 10-second timeout.</li>
  <li>Queue <code>labflow-hoantien</code> receives <strong>only</strong> <code>loai = huy</code>.</li>
  <li>A failing email message must not retry forever: after 3 receives it goes to <code>labflow-email-dlq</code>.</li>
  <li>Workers must not spin on empty receives, and on AWS only <em>this</em> topic may write into <code>labflow-email</code>.</li>
</ul>

<h3>The grader — 8 checks</h3>
<table>
  <thead><tr><th>#</th><th>Check</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Topic exists</td><td>the one place the API publishes to</td></tr>
    <tr><td>2</td><td>DLQ <code>labflow-email-dlq</code>, <code>maxReceiveCount = 3</code></td><td>poison messages stop (Lesson 9.1)</td></tr>
    <tr><td>3</td><td><code>VisibilityTimeout ≥ 60</code> s</td><td>6 × the consumer timeout ⇒ no duplicates from slow runs</td></tr>
    <tr><td>4</td><td>Long polling 20 s</td><td>no billed empty receives</td></tr>
    <tr><td>5</td><td>Email subscription raw</td><td>consumer reads the body as published</td></tr>
    <tr><td>6</td><td>Refund subscription filter <code>{"loai":["huy"]}</code></td><td>routing in SNS, not an if in code</td></tr>
    <tr><td>7</td><td>Queue policy: <code>sns.amazonaws.com</code> + <code>aws:SourceArn</code> = topic</td><td>without it AWS drops deliveries; with <code>*</code> anyone can write</td></tr>
    <tr><td>8</td><td>Publish 1 <code>dat</code> + 1 <code>huy</code> ⇒ email gets 2, refund gets 1</td><td>behaviour, not only configuration</td></tr>
  </tbody>
</table>
${MA_CHAM}
<p><strong>LocalStack differs:</strong> it does not enforce queue policies, so check 7 can only read the policy text. On real AWS, the honest test is behavioural: remove the policy, publish, and watch the queue stay empty.</p>

<h3>Step 1 — the hasty version, graded</h3>
${MA_TRUOC}
<p>It runs, messages flow, and in a demo it would look fine. Run the grader on it (the output is below, with the solution). <strong>STOP here and fix it yourself</strong> — every failing line tells you which attribute is missing.</p>

<h3>Step 2 — your fix, then the solution</h3>
${giai('Solution (open after you tried): giai.sh + both grader runs', MA_GIAI + OUT_95_LAB)}

<h3>Step 3 — clean up, and prove nothing is left</h3>
${MA_DON}
${MA_CONGI}
<p>Every line must be 0. On AWS, idle SNS topics and SQS queues cost nothing — but a forgotten <strong>worker polling an empty queue</strong> does (short polling: thousands of billed requests a day), and so does a forgotten Scheduler schedule firing a Lambda every minute.</p>

<h3>What it would cost</h3>
<p>Singapore prices, November 2026. At 20,000 bookings a month everything stays inside the free tiers (1 million SNS requests, 1 million SQS requests) ⇒ about 0 USD. At 10 million bookings a month, about 10% cancellations:</p>
<table>
  <thead><tr><th>Item</th><th>Volume</th><th>≈ USD / month</th></tr></thead>
  <tbody>
    <tr><td>SNS publishes</td><td>10 million − 1 million free</td><td>4.50</td></tr>
    <tr><td>SQS: deliver + receive + delete, both queues</td><td>≈ 33 million − 1 million free</td><td>12.80</td></tr>
    <tr><td>Long-polling receives while idle</td><td>2 workers × 3 per minute</td><td>≈ 0.10</td></tr>
    <tr><td><strong>Total</strong></td><td></td><td><strong>≈ 17.40</strong></td></tr>
  </tbody>
</table>
<p>The expensive part of a notification system is never the queue; it is the email or SMS provider behind it — and, with SMS, fraud (Lesson 9.2).</p>

<h3>🎤 Interviewers will ask (distributed systems)</h3>
<ul>
  <li><strong>"Design booking notifications that survive a traffic spike and an email-provider outage."</strong> — The API writes the booking and publishes one event; SNS fans out to one SQS queue per consumer; workers scale on queue depth; the email worker retries with backoff, failed messages land in a DLQ with an alarm; the provider can be down for hours without losing anything.</li>
  <li><strong>"Can you guarantee exactly-once delivery?"</strong> — Not end to end. SQS standard is at-least-once, FIFO deduplicates sends within 5 minutes, but a crash between the side effect and the delete still repeats work. You get <em>effectively once</em> by making consumers idempotent on a business key.</li>
  <li><strong>"The cancel event arrives before the create event. What now?"</strong> — With standard queues that can happen. Options: a FIFO queue with the booking id as group id; or carry a version/timestamp and let the consumer ignore anything older than the stored state; or have the consumer read the current state from the database instead of trusting the event.</li>
  <li><strong>"The API saved the booking but crashed before publishing. How do you avoid losing the event?"</strong> — The <strong>transactional outbox</strong>: write the booking and an "outbox" row in the same database transaction; a separate process publishes outbox rows and marks them sent (at-least-once, so consumers stay idempotent).</li>
  <li><strong>"How do you know the pipeline is unhealthy?"</strong> — Alarms on DLQ depth &gt; 0, on <code>ApproximateAgeOfOldestMessage</code> (work is waiting too long), on consumer errors, and on SNS <code>NumberOfNotificationsFailed</code>. Queue length alone is normal during a spike; <em>age</em> is the signal.</li>
</ul>

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Rubric / grader</b><span>Automated checks of configuration and behaviour.</span></div>
  <div><b>Effectively once</b><span>At-least-once delivery + idempotent processing.</span></div>
  <div><b>Transactional outbox</b><span>Save state and the event to publish in one transaction; publish later.</span></div>
  <div><b>Age of oldest message</b><span>How long the oldest message has waited — the real backlog signal.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Hasty pipeline: 1/8. Fixed: DLQ, visibility 60 s, long polling, raw, filter, policy ⇒ 8/8.</li>
  <li>Behaviour checks catch what configuration checks cannot.</li>
  <li>LocalStack cannot prove a queue policy; test that on AWS by behaviour.</li>
  <li>Clean up: subscriptions, topics, queues, rules, schedules ⇒ all 0.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Lambda/SQS visibility timeout = 6 × function timeout: <a href="https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/with-sqs.html</a></li>
  <li>SNS → SQS with a queue policy: <a href="https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html</a></li>
  <li>SQS and SNS pricing: <a href="https://aws.amazon.com/sqs/pricing/" target="_blank" rel="noopener">aws.amazon.com/sqs/pricing/</a> · <a href="https://aws.amazon.com/sns/pricing/" target="_blank" rel="noopener">aws.amazon.com/sns/pricing/</a></li>
  <li>Transactional outbox (AWS Prescriptive Guidance): <a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html" target="_blank" rel="noopener">docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html</a></li>
</ul>
</div>
`;
const L95_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab</span>
<h2>9.5 — Lab chương 9: đường ống thông báo đặt phòng của LabFlow + câu hỏi phỏng vấn</h2>
<p class="lead">Bạn dựng đúng đường ống sự kiện LabFlow sẽ dùng thật: API phát một sự kiện cho mỗi đặt phòng, SNS phát tán, một hàng đợi nuôi worker gửi email, một hàng khác nuôi dịch vụ hoàn tiền chỉ với lượt huỷ. Bộ chấm kiểm 8 tính chất — cấu hình <em>và</em> hành vi. Một bản làm vội "chạy được" chỉ đạt 1/8; việc của bạn là 8/8, rồi dọn về số 0.</p>

<h3>Đề bài</h3>
<ul>
  <li>Topic <code>labflow-datphong</code>. Mỗi sự kiện mang thuộc tính tin <code>loai</code> = <code>dat</code> (đặt) hoặc <code>huy</code> (huỷ).</li>
  <li>Hàng <code>labflow-email</code> nhận mọi sự kiện, dạng <strong>raw</strong> (consumer chỉ parse thân tin một lần). Consumer của nó có timeout 10 giây.</li>
  <li>Hàng <code>labflow-hoantien</code> <strong>chỉ</strong> nhận <code>loai = huy</code>.</li>
  <li>Tin email bị lỗi không được thử lại mãi: sau 3 lần nhận phải sang <code>labflow-email-dlq</code>.</li>
  <li>Worker không được quay vòng nhận rỗng, và trên AWS chỉ <em>topic này</em> được ghi vào <code>labflow-email</code>.</li>
</ul>

<h3>Bộ chấm — 8 phép</h3>
<table>
  <thead><tr><th>#</th><th>Phép kiểm</th><th>Vì sao quan trọng</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Có topic</td><td>chỗ duy nhất API phát tới</td></tr>
    <tr><td>2</td><td>DLQ <code>labflow-email-dlq</code>, <code>maxReceiveCount = 3</code></td><td>tin độc dừng lại (Bài 9.1)</td></tr>
    <tr><td>3</td><td><code>VisibilityTimeout ≥ 60</code> giây</td><td>6 × timeout của consumer ⇒ chạy chậm không sinh trùng</td></tr>
    <tr><td>4</td><td>Long polling 20 giây</td><td>không trả tiền cho lần nhận rỗng</td></tr>
    <tr><td>5</td><td>Subscription email dạng raw</td><td>consumer đọc thân tin đúng như khi phát</td></tr>
    <tr><td>6</td><td>Subscription hoàn tiền lọc <code>{"loai":["huy"]}</code></td><td>định tuyến ở SNS, không phải câu if trong mã</td></tr>
    <tr><td>7</td><td>Queue policy: <code>sns.amazonaws.com</code> + <code>aws:SourceArn</code> = topic</td><td>thiếu thì AWS bỏ lượt giao; để <code>*</code> thì ai cũng ghi được</td></tr>
    <tr><td>8</td><td>Phát 1 <code>dat</code> + 1 <code>huy</code> ⇒ email nhận 2, hoàn tiền nhận 1</td><td>hành vi, không chỉ cấu hình</td></tr>
  </tbody>
</table>
${MA_CHAM}
<p><strong>LocalStack khác AWS:</strong> nó không thực thi queue policy, nên phép 7 chỉ đọc được chữ của policy. Trên AWS thật, cách kiểm trung thực là theo hành vi: gỡ policy, phát tin, và nhìn hàng đợi vẫn rỗng.</p>

<h3>Bước 1 — bản làm vội, chấm điểm</h3>
${MA_TRUOC}
<p>Nó chạy, tin vẫn chảy, và trong buổi demo trông vẫn ổn. Chạy bộ chấm trên nó (output ở dưới, cùng lời giải). <strong>DỪNG ở đây và tự sửa</strong> — mỗi dòng trượt cho bạn biết thiếu thuộc tính nào.</p>

<h3>Bước 2 — bạn tự sửa, rồi xem lời giải</h3>
${giai('Lời giải (mở sau khi đã tự làm): giai.sh + hai lần chấm', MA_GIAI + OUT_95_LAB)}

<h3>Bước 3 — dọn, và chứng minh không còn gì</h3>
${MA_DON}
${MA_CONGI}
<p>Mọi dòng phải là 0. Trên AWS, topic SNS và hàng SQS để không thì không tốn tiền — nhưng một <strong>worker bị quên đang hỏi một hàng rỗng</strong> thì có (short polling: hàng nghìn yêu cầu tính tiền mỗi ngày), và một lịch Scheduler bị quên gọi Lambda mỗi phút cũng vậy.</p>

<h3>Tốn bao nhiêu</h3>
<p>Giá Singapore, tháng 11/2026. Với 20.000 đặt phòng mỗi tháng, mọi thứ nằm trong phần miễn phí (1 triệu yêu cầu SNS, 1 triệu yêu cầu SQS) ⇒ khoảng 0 USD. Với 10 triệu đặt phòng mỗi tháng, khoảng 10% bị huỷ:</p>
<table>
  <thead><tr><th>Khoản</th><th>Lượng</th><th>≈ USD / tháng</th></tr></thead>
  <tbody>
    <tr><td>Lần phát SNS</td><td>10 triệu − 1 triệu miễn phí</td><td>4,50</td></tr>
    <tr><td>SQS: giao + nhận + xoá, cả hai hàng</td><td>≈ 33 triệu − 1 triệu miễn phí</td><td>12,80</td></tr>
    <tr><td>Lần nhận long polling lúc rảnh</td><td>2 worker × 3 lần mỗi phút</td><td>≈ 0,10</td></tr>
    <tr><td><strong>Tổng</strong></td><td></td><td><strong>≈ 17,40</strong></td></tr>
  </tbody>
</table>
<p>Phần đắt của một hệ thống thông báo không bao giờ là hàng đợi; đó là nhà cung cấp email hay SMS phía sau — và với SMS, là gian lận (Bài 9.2).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi (hệ phân tán)</h3>
<ul>
  <li><strong>"Thiết kế thông báo đặt phòng chịu được đợt tăng tải và lúc nhà cung cấp email sập."</strong> — API ghi đặt phòng rồi phát một sự kiện; SNS phát tán vào mỗi consumer một hàng SQS; worker co giãn theo độ dài hàng; worker email thử lại có backoff, tin hỏng vào DLQ có cảnh báo; nhà cung cấp sập hàng giờ cũng không mất gì.</li>
  <li><strong>"Có bảo đảm được giao đúng một lần không?"</strong> — Không, nếu tính trọn đầu cuối. SQS standard giao ít nhất một lần, FIFO bỏ lượt gửi trùng trong 5 phút, nhưng chết giữa lúc đã gây tác dụng và lúc xoá tin vẫn làm lặp việc. Bạn đạt <em>hiệu quả như một lần</em> bằng cách làm consumer idempotent theo khoá nghiệp vụ.</li>
  <li><strong>"Sự kiện huỷ tới trước sự kiện tạo. Làm sao?"</strong> — Với hàng standard chuyện đó có thể xảy ra. Các cách: hàng FIFO với mã đặt phòng làm group id; hoặc mang theo phiên bản/mốc giờ và để consumer bỏ qua thứ cũ hơn trạng thái đã lưu; hoặc để consumer đọc trạng thái hiện tại trong cơ sở dữ liệu thay vì tin vào sự kiện.</li>
  <li><strong>"API đã lưu đặt phòng nhưng chết trước khi phát. Làm sao không mất sự kiện?"</strong> — <strong>Transactional outbox</strong>: ghi đặt phòng và một dòng "outbox" trong cùng một transaction cơ sở dữ liệu; một tiến trình riêng phát các dòng outbox rồi đánh dấu đã gửi (ít nhất một lần, nên consumer vẫn phải idempotent).</li>
  <li><strong>"Làm sao biết đường ống đang ốm?"</strong> — Cảnh báo khi DLQ &gt; 0, khi <code>ApproximateAgeOfOldestMessage</code> cao (việc chờ quá lâu), khi consumer lỗi, và khi SNS <code>NumberOfNotificationsFailed</code> tăng. Hàng dài lúc tăng tải là bình thường; <em>tuổi</em> của tin mới là tín hiệu.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Rubric / bộ chấm</b><span>Các phép kiểm tự động trên cấu hình và hành vi.</span></div>
  <div><b>Hiệu quả như một lần</b><span>Giao ít nhất một lần + xử lý idempotent.</span></div>
  <div><b>Transactional outbox</b><span>Lưu trạng thái và sự kiện cần phát trong một transaction; phát sau.</span></div>
  <div><b>Tuổi của tin cũ nhất</b><span>Tin cũ nhất đã chờ bao lâu — tín hiệu tồn đọng thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đường ống làm vội: 1/8. Sửa: DLQ, visibility 60 giây, long polling, raw, bộ lọc, policy ⇒ 8/8.</li>
  <li>Phép kiểm hành vi bắt được thứ phép kiểm cấu hình không bắt được.</li>
  <li>LocalStack không chứng minh được queue policy; thử điều đó trên AWS bằng hành vi.</li>
  <li>Dọn: subscription, topic, hàng đợi, luật, lịch ⇒ tất cả về 0.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Visibility timeout của hàng nguồn Lambda = 6 × timeout hàm: <a href="https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/with-sqs.html</a></li>
  <li>SNS → SQS kèm queue policy: <a href="https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html" target="_blank" rel="noopener">docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html</a></li>
  <li>Giá SQS và SNS: <a href="https://aws.amazon.com/sqs/pricing/" target="_blank" rel="noopener">aws.amazon.com/sqs/pricing/</a> · <a href="https://aws.amazon.com/sns/pricing/" target="_blank" rel="noopener">aws.amazon.com/sns/pricing/</a></li>
  <li>Transactional outbox (AWS Prescriptive Guidance): <a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html" target="_blank" rel="noopener">docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html</a></li>
</ul>
</div>
`;

/* ═════ 9.6 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [1, 3, 0, 2, 3, 0, 2, 1, 0, 3];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ9 = [
  Q('Right after receiving a message, a second receive on the same queue returns nothing. Why?|||Ngay sau khi nhận một tin, lần nhận thứ hai trên cùng hàng đợi không được gì. Vì sao?', [
    'Receiving deleted the message|||Lệnh nhận đã xoá tin',
    'The message is hidden for the visibility timeout; it is not deleted until DeleteMessage|||Tin bị giấu trong khoảng visibility timeout; chỉ DeleteMessage mới xoá',
    'Standard queues deliver each message only once|||Hàng standard chỉ giao mỗi tin một lần',
    'Long polling was not enabled|||Chưa bật long polling',
  ], 1),
  Q('A queue has maxReceiveCount = 3. A message fails three times and is never deleted. What happens next?|||Một hàng có maxReceiveCount = 3. Một tin lỗi ba lần và không bao giờ được xoá. Chuyện gì xảy ra tiếp?', [
    'It stays in the queue until the 4-day retention ends|||Nó nằm trong hàng tới khi hết hạn giữ 4 ngày',
    'SQS moves it to the dead-letter queue|||SQS chuyển nó sang dead-letter queue',
    'SQS deletes it and sends an email|||SQS xoá nó và gửi email',
    'The queue stops delivering all messages|||Hàng đợi ngừng giao mọi tin',
  ], 1),
  Q('In a FIFO queue you send a message with the same deduplication id twice within 5 minutes. Result?|||Trong hàng FIFO bạn gửi một tin cùng deduplication id hai lần trong 5 phút. Kết quả?', [
    'The second send fails with an error|||Lần gửi thứ hai báo lỗi',
    'The second send succeeds but the message is delivered only once|||Lần gửi thứ hai báo thành công nhưng tin chỉ được giao một lần',
    'Both are delivered, in order|||Cả hai được giao, đúng thứ tự',
    'The queue turns into a standard queue|||Hàng đợi chuyển thành hàng standard',
  ], 1),
  Q('FIFO: a message of group phong-A101 is in flight. Another A101 message is waiting. A receive returns only a B202 message. Why?|||FIFO: một tin của nhóm phong-A101 đang xử lý. Một tin A101 khác đang chờ. Lệnh nhận chỉ trả tin B202. Vì sao?', [
    'B202 has higher priority|||B202 được ưu tiên hơn',
    'A group with an in-flight message is locked, to keep order inside the group|||Nhóm đang có tin xử lý bị khoá để giữ thứ tự trong nhóm',
    'The A101 message was deduplicated|||Tin A101 đã bị bỏ vì trùng',
    'Receive returns messages at random|||Lệnh nhận trả tin ngẫu nhiên',
  ], 1),
  Q('The same booking DP-103 arrives twice in a standard queue. What makes the consumer send only one email?|||Cùng đặt phòng DP-103 tới hai lần trong hàng standard. Điều gì khiến consumer chỉ gửi một email?', [
    'Using the SQS MessageId as the key|||Dùng MessageId của SQS làm khoá',
    'A conditional write keyed on the booking id before sending|||Ghi có điều kiện theo mã đặt phòng trước khi gửi',
    'A longer visibility timeout|||Visibility timeout dài hơn',
    'Switching to short polling|||Chuyển sang short polling',
  ], 1),
  Q('On AWS, SNS publishes succeed but the subscribed SQS queue stays empty. Most likely cause?|||Trên AWS, SNS phát thành công nhưng hàng SQS đã đăng ký vẫn rỗng. Nguyên nhân hay gặp nhất?', [
    'SNS needs raw delivery to reach SQS|||SNS cần bật raw delivery mới tới được SQS',
    'The queue policy does not allow sns.amazonaws.com (with the topic as aws:SourceArn)|||Queue policy không cho sns.amazonaws.com (với aws:SourceArn là topic)',
    'The queue is a standard queue|||Hàng đợi là hàng standard',
    'Long polling is enabled|||Đang bật long polling',
  ], 1),
  Q('Without raw message delivery, where is the published payload in the SQS message body?|||Không bật raw message delivery, nội dung đã phát nằm ở đâu trong thân tin SQS?', [
    'In MessageAttributes|||Trong MessageAttributes',
    'As a string in the "Message" field of the SNS JSON envelope|||Là một chuỗi trong trường "Message" của phong bì JSON của SNS',
    'In the receipt handle|||Trong receipt handle',
    'It is dropped; only metadata arrives|||Bị bỏ; chỉ siêu dữ liệu tới nơi',
  ], 1),
  Q('Pattern: phong prefix "A" and soNguoi numeric >= 30. Which event matches?|||Mẫu: phong prefix "A" và soNguoi số >= 30. Sự kiện nào khớp?', [
    'B202 with 40 people|||B202 với 40 người',
    'A101 with 30 people|||A101 với 30 người',
    'A102 with 29 people|||A102 với 29 người',
    'Any event, because put-events returned FailedEntryCount 0|||Mọi sự kiện, vì put-events trả FailedEntryCount 0',
  ], 1),
  Q('You need "every day at 07:00 Vietnam time". Which is the right tool?|||Bạn cần "07:00 hằng ngày theo giờ Việt Nam". Công cụ nào đúng?', [
    'An EventBridge rule cron, which always uses the local time of the Region|||Luật EventBridge dạng cron, luôn dùng giờ địa phương của Region',
    'An EventBridge Scheduler schedule with time zone Asia/Ho_Chi_Minh|||Một lịch EventBridge Scheduler với múi giờ Asia/Ho_Chi_Minh',
    'An SQS message with DelaySeconds = 86400|||Một tin SQS với DelaySeconds = 86400',
    'An SNS topic with a filter policy|||Một topic SNS có filter policy',
  ], 1),
  Q('An SQS-triggered Lambda processes a batch of 5; one image is corrupt. With ReportBatchItemFailures, what is retried?|||Một Lambda kích hoạt bởi SQS xử lý lô 5 tin; một ảnh bị hỏng. Có ReportBatchItemFailures thì cái gì được thử lại?', [
    'The whole batch of 5|||Cả lô 5 tin',
    'Only the message the function reported in batchItemFailures|||Chỉ tin mà hàm báo trong batchItemFailures',
    'Nothing; failed messages are deleted|||Không gì cả; tin lỗi bị xoá',
    'The S3 object is uploaded again|||Object S3 được tải lên lại',
  ], 1),
];

export default {
  title: 'Chapter 9 — Event-driven: SQS, SNS and EventBridge|||Chương 9 — Hướng sự kiện: SQS, SNS và EventBridge',
  description: 'Hướng sự kiện chạy thật trên LocalStack: hàng SQS (visibility timeout — tin ẩn rồi hiện lại với số lần nhận 2, DLQ sau 3 lần + redrive, FIFO giữ thứ tự trong nhóm và bỏ tin trùng 5 phút, long polling đo bằng SDK, consumer Node.js idempotent bằng ghi có điều kiện DynamoDB); SNS fan-out vào hai hàng (lọc theo thuộc tính, phong bì vs raw, queue policy SourceArn, SMS pumping 2023); EventBridge (mẫu prefix + so số, input transformer, test-event-pattern 29/30, luật rate, Scheduler có múi giờ); S3 ⇒ SQS ⇒ Lambda sharp tạo ảnh thu nhỏ, ảnh hỏng/bom ⇒ DLQ; lab chấm 8 phép + giá tháng.',
  lessons: [
    {
      title: '9.1 — SQS queues: standard, FIFO and dead-letter|||9.1 — Hàng đợi SQS: standard, FIFO và dead-letter',
      slug: 'aws-9-1-sqs',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Visibility timeout chạy thật (nhận lại ngay ⇒ rỗng, 11 giây sau ⇒ lần nhận 2), DLQ sau maxReceiveCount 3 + redrive về hàng gốc, FIFO: deduplication id trong 5 phút, khoá nhóm khi có tin đang xử lý, long polling vs short polling; consumer Node.js idempotent (ghi có điều kiện DynamoDB theo mã đặt phòng); queue policy SourceArn; bão thử lại AWS 7/12/2021; giá 0,40/0,50 USD mỗi triệu.',
      content: L91_EN + L91_VI,
    },
    {
      title: '9.2 — SNS fan-out and notifications|||9.2 — SNS phát tán và thông báo',
      slug: 'aws-9-2-sns',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Topic + 2 hàng SQS + đăng ký email: 2 lần phát ⇒ email 2 tin, hoàn tiền 1 tin (filter loai = huy); phong bì JSON của SNS vs raw delivery; queue policy sns.amazonaws.com + aws:SourceArn (LocalStack không kiểm); lọc theo thân tin; thử lại 100.015 lần/23 ngày + DLQ subscription; so với bot Telegram; SMS pumping Twitter 2023, SMS sandbox 1 USD/tháng.',
      content: L92_EN + L92_VI,
    },
    {
      title: '9.3 — EventBridge: event bus and schedules|||9.3 — EventBridge: bus sự kiện và lịch',
      slug: 'aws-9-3-eventbridge',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bus riêng labflow, luật prefix A + soNguoi >= 30: 3 sự kiện vào, 1 tới hàng đợi; input transformer; test-event-pattern 29 ⇒ false, 30 ⇒ true; luật rate(1 minute); Scheduler at() múi giờ Asia/Ho_Chi_Minh tự xoá sau khi chạy (LocalStack không thực thi); bảng SQS/SNS/EventBridge; sự cố Kinesis 25/11/2020; lịch làm chỗ ẩn của kẻ tấn công.',
      content: L93_EN + L93_VI,
    },
    {
      title: '9.4 — Triggers: S3 → Lambda image pipeline|||9.4 — Kích hoạt: S3 → Lambda xử lý ảnh',
      slug: 'aws-9-4-s3-trigger',
      type: 'LESSON',
      isFreePreview: true,
      description: 'S3 ⇒ SQS ⇒ Lambda (sharp) tạo ảnh WebP 320 px chạy thật: lọc prefix goc/, ghi sang bucket khác để không tự kích hoạt; event source mapping lô 5 + ReportBatchItemFailures; tệp hỏng và ảnh 6000×6000 (chặn bằng limitInputPixels) ⇒ 2 lần nhận ⇒ DLQ; đóng gói thư viện native; ImageTragick 2016; giá cho 10.000 ảnh/tháng.',
      content: L94_EN + L94_VI,
    },
    {
      title: '9.5 — Chapter 9 lab + interview questions|||9.5 — Lab chương 9 + câu hỏi phỏng vấn',
      slug: 'aws-9-5-lab-9',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đường ống thông báo đặt phòng LabFlow: topic + hàng email (raw, DLQ 3, visibility 60, long polling 20, queue policy) + hàng hoàn tiền (lọc huy); bộ chấm 8 phép (cấu hình + hành vi); bản vội 1/8 ⇒ lời giải 8/8 ⇒ dọn ⇒ năm số 0; giá ≈ 17 USD/tháng ở 10 triệu đặt phòng; năm câu phỏng vấn hệ phân tán (exactly-once, thứ tự, outbox).',
      content: L95_EN + L95_VI,
    },
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
      slug: 'aws-9-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu từ các output đã chạy trong chương 9.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ9 },
    },
  ],
};
