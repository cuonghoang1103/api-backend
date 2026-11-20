/**
 * Cloud AWS — Chương 8: Serverless — Lambda và API Gateway
 * (soạn 20/11/2026, agent aws; phiên 29 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   8.1 lambda · 8.2 api-gateway · 8.3 lambda-java · 8.4 khi-nao · 8.5 lab-8 · 8.6 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c8/81.sh, 81b.sh, 82.sh, 82b.sh, 83-dung.sh, 83.sh, 84.sh, 84-gia.mjs, lab8/chay.sh:
 *   - AWS CLI 2.41.0 → LocalStack 4.12 (community): Lambda chạy THẬT trong container con dựng từ ảnh runtime chính hãng nodejs:22;
 *     API Gateway REST API (HTTP API v2 chỉ có ở bản trả phí của LocalStack), S3 → Lambda;
 *   - ảnh runtime chính hãng public.ecr.aws/lambda/nodejs:22 và java:21 kèm Runtime Interface Emulator (RIE) để đo cold start, --cpus giả lập
 *     "bộ nhớ = CPU" theo tỉ lệ 1.769 MB ⇔ 1 vCPU; Java dựng bằng maven:3.9-eclipse-temurin-21 (Spring Boot 3.5.7, Spring Cloud 2025.0.0);
 *   - giá: Price List API Singapore 11/2026 (~/.rtq-aws/n8).
 * Khác AWS đã ghi rõ trong bài: LocalStack community KHÔNG thực thi Lambda authorizer và reserved concurrency (mọi yêu cầu vẫn 200),
 *   báo Max Memory Used = bộ nhớ cấu hình, có thể dựng môi trường mới ở lần gọi 2; RIE không tách Init Duration (gộp vào lần gọi đầu);
 *   LocalStack không có recursive loop detection; SnapStart không giả lập được.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/js()/java()/xml() của _chung.mjs.
 */
import { bash, json, js, java, xml, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (scratchpad/aws/lab/c8: AWS CLI 2.41.0 → LocalStack 4.12 (Lambda trong container con nodejs22); ảnh runtime chính hãng public.ecr.aws/lambda/* + RIE) ═════ */
const OUT_81_CPU = out("# Cùng một hàm băm PBKDF2 200.000 vòng. Trên AWS CPU tỉ lệ với bộ nhớ (1.769 MB ≈ 1 vCPU) — ở đây giả lập bằng --cpus\nbộ nhớ 128 MB (--cpus 0.072) ⇒ {\"ms\":395}\nbộ nhớ 512 MB (--cpus 0.289) ⇒ {\"ms\":95}\nbộ nhớ 1769 MB (--cpus 1.000) ⇒ {\"ms\":35}");
const OUT_81_GOI = out("$ aws lambda invoke --function-name labflow-xinchao --payload file:///aws/su-kien.json --cli-binary-format raw-in-base64-out ra1.json\n200\n$ cat ra1.json   # lần 1\n{\"lanGoi\":1,\"coldStart\":true,\"khoiTao\":\"2026-11-20T00:22:46.928Z\",\"requestId\":\"0a8b4bef-cfce-41e7-87be-b04899600fcb\",\"conLaiMs\":2999,\"boNhoMB\":\"256\",\"phong\":\"A101\",\"bang\":\"labflow-datlich\"}\n$ aws lambda invoke --function-name labflow-xinchao --payload file:///aws/su-kien.json --cli-binary-format raw-in-base64-out ra2.json\n200\n$ cat ra2.json   # lần 2\n{\"lanGoi\":1,\"coldStart\":true,\"khoiTao\":\"2026-11-20T00:23:12.502Z\",\"requestId\":\"f54137f7-50d9-4173-9278-e77f756c840f\",\"conLaiMs\":2999,\"boNhoMB\":\"256\",\"phong\":\"A101\",\"bang\":\"labflow-datlich\"}\n$ aws lambda invoke --function-name labflow-xinchao --payload file:///aws/su-kien.json --cli-binary-format raw-in-base64-out ra3.json\n200\n$ cat ra3.json   # lần 3\n{\"lanGoi\":2,\"coldStart\":false,\"khoiTao\":\"2026-11-20T00:23:12.502Z\",\"requestId\":\"adad1747-2299-4c9d-b765-7e5703c65711\",\"conLaiMs\":2999,\"boNhoMB\":\"256\",\"phong\":\"A101\",\"bang\":\"labflow-datlich\"}");
const OUT_81_LOG = out("$ aws logs tail /aws/lambda/labflow-xinchao\nSTART RequestId: 0a8b4bef-cfce-41e7-87be-b04899600fcb Version: $LATEST\nEND RequestId: 0a8b4bef-cfce-41e7-87be-b04899600fcb\nREPORT RequestId: 0a8b4bef-cfce-41e7-87be-b04899600fcb\tDuration: 2.18 ms\tBilled Duration: 3 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB\nSTART RequestId: f54137f7-50d9-4173-9278-e77f756c840f Version: $LATEST\nEND RequestId: f54137f7-50d9-4173-9278-e77f756c840f\nREPORT RequestId: f54137f7-50d9-4173-9278-e77f756c840f\tDuration: 1.24 ms\tBilled Duration: 2 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB\nSTART RequestId: adad1747-2299-4c9d-b765-7e5703c65711 Version: $LATEST\nEND RequestId: adad1747-2299-4c9d-b765-7e5703c65711\nREPORT RequestId: adad1747-2299-4c9d-b765-7e5703c65711\tDuration: 2.31 ms\tBilled Duration: 3 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB");
const OUT_81_RIE = out("# Ảnh runtime chính hãng của Lambda (cùng runtime chạy trên AWS) + Runtime Interface Emulator, 256 MB\n$ docker run -p 9000:8080 -e AWS_LAMBDA_FUNCTION_MEMORY_SIZE=256 -v ./xinchao:/var/task public.ecr.aws/lambda/nodejs:22 index.handler\n$ curl -XPOST localhost:9000/2015-03-31/functions/function/invocations -d '{\"phong\":\"A101\"}'\n{\"lanGoi\":1,\"coldStart\":true,\"khoiTao\":\"2026-11-20T00:24:56.647Z\",\"requestId\":\"807a6c6f-6e8f-4e74-b00d-15f12b0fd969\",\"conLaiMs\":299926,\"boNhoMB\":\"256\",\"phong\":\"A101\",\"bang\":\"labflow-datlich\"}\n$ curl -XPOST localhost:9000/2015-03-31/functions/function/invocations -d '{\"phong\":\"A101\"}'\n{\"lanGoi\":2,\"coldStart\":false,\"khoiTao\":\"2026-11-20T00:24:56.647Z\",\"requestId\":\"a1b070b0-0cba-4387-82b5-19b3252feb9e\",\"conLaiMs\":300000,\"boNhoMB\":\"256\",\"phong\":\"A101\",\"bang\":\"labflow-datlich\"}\n$ curl -XPOST localhost:9000/2015-03-31/functions/function/invocations -d '{\"phong\":\"A101\"}'\n{\"lanGoi\":3,\"coldStart\":false,\"khoiTao\":\"2026-11-20T00:24:56.647Z\",\"requestId\":\"92081809-d64c-4708-8b44-8d6604814938\",\"conLaiMs\":299998,\"boNhoMB\":\"256\",\"phong\":\"A101\",\"bang\":\"labflow-datlich\"}\n$ docker logs … | grep REPORT\nREPORT RequestId: …\tInit Duration: 0.03 ms\tDuration: 74.84 ms\tBilled Duration: 75 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB\t\nREPORT RequestId: …\tDuration: 0.87 ms\tBilled Duration: 1 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB\t\nREPORT RequestId: …\tDuration: 1.74 ms\tBilled Duration: 2 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB\t\n# Khởi động lại container = môi trường thực thi mới ⇒ cold start lần nữa\n{\"lanGoi\":1,\"coldStart\":true,\"khoiTao\":\"2026-11-20T00:24:58.682Z\",\"requestId\":\"bd24119a-4ca8-47c5-bae0-7ba714de2505\",\"conLaiMs\":299954,\"boNhoMB\":\"256\",\"phong\":\"B202\",\"bang\":\"labflow-datlich\"}\nREPORT RequestId: …\tInit Duration: 0.02 ms\tDuration: 47.32 ms\tBilled Duration: 48 ms\tMemory Size: 256 MB\tMax Memory Used: 256 MB\t");
const OUT_81_TAO = out("# Vai cho hàm: ai được 'đội' vai này? Chỉ dịch vụ Lambda\n$ aws iam create-role --role-name labflow-fn-role --assume-role-policy-document file:///aws/tin-lambda.json --query Role.Arn --output text\narn:aws:iam::000000000000:role/labflow-fn-role\n$ aws iam attach-role-policy --role-name labflow-fn-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole\n# Tạo hàm: runtime + handler (tệp.hàm) + vai + bộ nhớ + timeout + biến môi trường\n$ aws lambda create-function --function-name labflow-xinchao --runtime nodejs22.x --handler index.handler --zip-file fileb:///aws/xinchao.zip --role arn:aws:iam::000000000000:role/labflow-fn-role --memory-size 256 --timeout 3 --environment 'Variables={BANG=labflow-datlich}' --query '[FunctionName,Runtime,MemorySize,Timeout,State]' --output text\nlabflow-xinchao\tnodejs22.x\t256\t3\tPending");
const OUT_81_TIMEOUT = out("$ aws lambda create-function --function-name labflow-cham --runtime nodejs22.x --handler index.handler --zip-file fileb:///aws/cham.zip --role arn:aws:iam::000000000000:role/labflow-fn-role --timeout 3 --query Timeout --output text\n3\n$ aws lambda invoke --function-name labflow-cham ra-cham.json\n200\tUnhandled\n$ cat ra-cham.json\n{\"errorMessage\":\"2026-11-20T00:23:45Z fb69f0eb-e1db-45b6-87cc-d8fc644f02b8 Task timed out after 3.00 seconds\"}");
const OUT_82_CONG = out("# Sự kiện API Gateway gửi cho authorizer: {\"type\":\"TOKEN\",\"authorizationToken\":\"<header Authorization>\",\"methodArn\":\"…/dev/GET/phong/A101\"}\n# 1) không có Bearer ⇒ hàm ném \"Unauthorized\" ⇒ API Gateway trả 401\n{\"errorType\":\"Error\",\"errorMessage\":\"Unauthorized\",\"trace\":[\"Error: Unauthorized\",\"    at Runtime.handler (file:///var/task/index.mjs:7:42)\",\"    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1207:29)\"]}\n# 2) JWT ký bằng khoá giả ⇒ policy Deny ⇒ API Gateway trả 403\n{\"principalId\":\"khach\",\"policyDocument\":{\"Version\":\"2012-10-17\",\"Statement\":[{\"Action\":\"execute-api:Invoke\",\"Effect\":\"Deny\",\"Resource\":\"arn:aws:execute-api:ap-southeast-1:000000000000:otigc86quw/dev/GET/phong/A101\"}]}}\n# 3) JWT đúng chữ ký nhưng đã hết hạn ⇒ Deny\n{\"principalId\":\"sv-an\",\"policyDocument\":{\"Version\":\"2012-10-17\",\"Statement\":[{\"Action\":\"execute-api:Invoke\",\"Effect\":\"Deny\",\"Resource\":\"arn:aws:execute-api:ap-southeast-1:000000000000:otigc86quw/dev/GET/phong/A101\"}]}}\n# 4) JWT đúng ⇒ Allow, principalId = sub ⇒ API Gateway gọi labflow-api và đưa principalId vào requestContext.authorizer\n{\"principalId\":\"sv-an\",\"policyDocument\":{\"Version\":\"2012-10-17\",\"Statement\":[{\"Action\":\"execute-api:Invoke\",\"Effect\":\"Allow\",\"Resource\":\"arn:aws:execute-api:ap-southeast-1:000000000000:otigc86quw/dev/GET/phong/A101\"}]}}");
const OUT_82_DONGTHOI = out("# Reserved concurrency = 1: tối đa MỘT bản labflow-api chạy cùng lúc (cũng là cách 'hãm' một hàm). Gọi 5 yêu cầu đồng thời:\n$ aws lambda put-function-concurrency --function-name labflow-api --reserved-concurrent-executions 1 --query ReservedConcurrentExecutions --output text\n1\n  gọi 4: 200\n  gọi 1: 200\n  gọi 3: 200\n  gọi 5: 200\n  gọi 2: 200");
const OUT_82_GOI = out("# URL trên AWS: https://otigc86quw.execute-api.ap-southeast-1.amazonaws.com/dev — ở LocalStack: http://127.0.0.1:43866/restapis/otigc86quw/dev/_user_request_\n$ curl -s -w ' [%{http_code}]' $URL/phong/A101\n{\"id\":\"A101\",\"ten\":\"Phòng máy A101\",\"soMay\":40,\"mo\":\"07:00–21:00\",\"nguoiHoi\":null} [200]\n$ curl -s -w ' [%{http_code}]' $URL/phong/z999\n{\"loi\":\"Không có phòng Z999\"} [404]");
const OUT_82_JWT = out("# Gắn Lambda authorizer (TOKEN) vào GET /phong/{id}: header Authorization phải mang JWT hợp lệ\n$ aws apigateway create-authorizer --rest-api-id otigc86quw --name kiem-jwt --type TOKEN --identity-source method.request.header.Authorization --authorizer-uri …:function:labflow-cong/invocations --authorizer-result-ttl-in-seconds 300 --query id --output text\n987d86\n$ aws apigateway update-method --rest-api-id otigc86quw --resource-id 2uhwbwosbf --http-method GET --patch-operations 'op=replace,path=/authorizationType,value=CUSTOM' 'op=replace,path=/authorizerId,value=987d86' --query '[authorizationType,authorizerId]' --output text\nCUSTOM\t987d86\n$ aws apigateway create-deployment --rest-api-id otigc86quw --stage-name dev --query id --output text\nyzteepnluh\n# 1) không token\n$ curl -s -w ' [%{http_code}]' $URL/phong/A101\n{\"id\":\"A101\",\"ten\":\"Phòng máy A101\",\"soMay\":40,\"mo\":\"07:00–21:00\",\"nguoiHoi\":null} [200]\n# 2) token ký bằng khoá giả\n$ curl -s -w ' [%{http_code}]' -H 'Authorization: Bearer <jwt-khoa-gia>' $URL/phong/A101\n{\"id\":\"A101\",\"ten\":\"Phòng máy A101\",\"soMay\":40,\"mo\":\"07:00–21:00\",\"nguoiHoi\":null} [200]\n# 3) token đúng (sub = sv-an, hết hạn sau 15 phút)\n$ curl -s -w ' [%{http_code}]' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5…' $URL/phong/A101\n{\"id\":\"A101\",\"ten\":\"Phòng máy A101\",\"soMay\":40,\"mo\":\"07:00–21:00\",\"nguoiHoi\":null} [200]");
const OUT_82_TAO = out("$ aws lambda create-function --function-name labflow-api --runtime nodejs22.x --handler index.handler --zip-file fileb:///aws/api.zip --role arn:aws:iam::000000000000:role/labflow-fn-role --query FunctionArn --output text\narn:aws:lambda:ap-southeast-1:000000000000:function:labflow-api\n$ aws lambda create-function --function-name labflow-cong --runtime nodejs22.x --handler index.handler --zip-file fileb:///aws/cong.zip --role arn:aws:iam::000000000000:role/labflow-fn-role --environment 'Variables={JWT_SECRET=bi-mat-lab-chi-dung-o-may-nay}' --query FunctionArn --output text\narn:aws:lambda:ap-southeast-1:000000000000:function:labflow-cong\n# REST API: tài nguyên /phong/{id}, phương thức GET, tích hợp kiểu AWS_PROXY tới Lambda\n$ aws apigateway create-rest-api --name labflow-api --query id --output text\notigc86quw\n$ aws apigateway create-resource --rest-api-id otigc86quw --parent-id sz8xabml4v --path-part '{id}' --query '[id,path]' --output text\n2uhwbwosbf\t/phong/{id}\n$ aws apigateway put-method --rest-api-id otigc86quw --resource-id 2uhwbwosbf --http-method GET --authorization-type NONE --query httpMethod --output text\nGET\n$ aws apigateway put-integration --rest-api-id otigc86quw --resource-id 2uhwbwosbf --http-method GET --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:000000000000:function:labflow-api/invocations --query type --output text\nAWS_PROXY\n$ aws lambda add-permission --function-name labflow-api --statement-id cho-apigw --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn 'arn:aws:execute-api:ap-southeast-1:000000000000:otigc86quw/*/GET/phong/*' --query Statement --output text\n{\"Sid\": \"cho-apigw\", \"Effect\": \"Allow\", \"Action\": \"lambda:InvokeFunction\", \"Resource\": \"arn:aws:lambda:ap-southeast-1:000000000000:function:labflow-api\", \"Principal\": {\"Service\": \"apigateway.amazonaws.com\"}, \"Condition\": {\"ArnLike\": {\"AWS:SourceArn\": \"arn:aws:execute-api:ap-southeast-1:000000000000:otigc86quw/*/GET/phong/*\"}}}\n$ aws apigateway create-deployment --rest-api-id otigc86quw --stage-name dev --query id --output text\nkrvgegu1qq");
const OUT_83_LANH = out("# Mỗi hàm: khởi động container (= môi trường thực thi mới), gọi 4 lần; dòng 1 = cold start. 1 vCPU, báo 1.769 MB.\n== lanh-node (index.handler)\n{\"lanGoi\":4,\"coldStart\":false,\"khoiTao\":\"2026-11-20T00:33:47.658Z\",\"requestId\":\"5b40acde-6849-4aa5-ae2e-44a2083be1d4\",\"conLaiMs\":299999,\"boNhoMB\":\"1769\",\"phong\":\"A101\"}\n1. REPORT Init Duration: 0.02 ms\tDuration: 66.17 ms\tBilled Duration: 67 ms\n2. REPORT Duration: 1.31 ms\tBilled Duration: 2 ms\n3. REPORT Duration: 0.94 ms\tBilled Duration: 1 ms\n4. REPORT Duration: 1.74 ms\tBilled Duration: 2 ms\n== lanh-java (lab.TraPhong::handleRequest)\n{\"id\":\"A101\",\"ten\":\"Phòng máy A101\",\"java\":\"21.0.13.1+2-LTS\"}\n1. REPORT Init Duration: 0.02 ms\tDuration: 240.71 ms\tBilled Duration: 241 ms\n2. REPORT Duration: 1.86 ms\tBilled Duration: 2 ms\n3. REPORT Duration: 1.59 ms\tBilled Duration: 2 ms\n4. REPORT Duration: 0.81 ms\tBilled Duration: 1 ms\n== lanh-spring (org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest)\n{\"id\":\"A101\",\"framework\":\"Spring Cloud Function\"}\n1. REPORT Init Duration: 0.03 ms\tDuration: 1640.93 ms\tBilled Duration: 1641 ms\n2. REPORT Duration: 2.94 ms\tBilled Duration: 3 ms\n3. REPORT Duration: 1.73 ms\tBilled Duration: 2 ms\n4. REPORT Duration: 3.21 ms\tBilled Duration: 4 ms");
const OUT_84_GIA = out("Giả định: mỗi yêu cầu chạy 50 ms, hàm 256 MB (x86); Fargate 2 task × (0,5 vCPU + 1 GB) + ALB ≈ 69.22 USD/tháng cố định\nyêu cầu/tháng     Lambda+HTTP API  Lambda+REST API  Fargate+ALB\n100,000                      0.17             0.47        69.22\n1,000,000                    1.66             4.66        69.22\n10,000,000                  16.58            46.58        69.22\n30,000,000                  49.75           139.75        69.22\n100,000,000                165.83           465.83        69.22\n300,000,000                497.50          1397.50        69.22\nĐiểm hoà vốn (Lambda + HTTP API = Fargate + ALB): ≈ 41.7 triệu yêu cầu/tháng ≈ 16.1 yêu cầu/giây trung bình\nARM (Graviton) rẻ hơn x86 20% cho phần thời gian chạy.");
const OUT_84_VONGLAP = out("# Ý định: mỗi ảnh tải lên ⇒ tạo ảnh thu nhỏ. Lỗi: ảnh thu nhỏ ghi vào CÙNG bucket, cùng sự kiện ObjectCreated\n$ aws s3api create-bucket --bucket labflow-anh --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\nhttp://labflow-anh.s3.localhost.localstack.cloud:4566/\n$ aws lambda create-function --function-name labflow-thunho --runtime nodejs22.x --handler index.handler --zip-file fileb:///aws/vonglap.zip --role arn:aws:iam::000000000000:role/labflow-fn-role --timeout 10 --query FunctionName --output text\nlabflow-thunho\n$ aws s3api put-bucket-notification-configuration --bucket labflow-anh --notification-configuration file:///aws/tb.json\n$ aws s3 cp --no-progress /aws/anh.jpg s3://labflow-anh/goc/anh.jpg\nupload: ./anh.jpg to s3://labflow-anh/goc/anh.jpg\nsau 15 giây: 388 tệp trong bucket\nsau 30 giây: 1132 tệp trong bucket\nsau 45 giây: 1525 tệp trong bucket\nsau 60 giây: 2150 tệp trong bucket\n# Cắt vòng lặp: gỡ thông báo sự kiện (trên AWS còn nhanh hơn: put-function-concurrency = 0)\n$ aws lambda put-function-concurrency --function-name labflow-thunho --reserved-concurrent-executions 0 --query ReservedConcurrentExecutions --output text\n0\n$ aws s3api put-bucket-notification-configuration --bucket labflow-anh --notification-configuration '{}'\nsau 20 giây nữa: 2266 tệp\nsau 30 giây nữa: 2266 tệp");
const OUT_85_DON = out("$ bash don.sh\n$ aws apigateway delete-rest-api --rest-api-id qrg0qjycpg\n$ aws lambda delete-function --function-name labflow-tra-phong\n{\n    \"StatusCode\": 204\n}\n$ aws logs delete-log-group --log-group-name /aws/lambda/labflow-tra-phong\n$ aws iam delete-role --role-name labflow-fn-role\n$ bash con-gi.sh\nHàm Lambda:      0\nREST API:        0\nLog group Lambda: 0\nVai labflow-*:   0");
const OUT_85_GIAI = out("$ bash giai.sh\n$ aws lambda update-function-configuration --function-name labflow-tra-phong --memory-size 256 --timeout 10 --environment 'Variables={BANG=labflow-datlich}' --query '[MemorySize,Timeout]' --output text\n256\t10\n# Kiến trúc nằm ở mã đã đóng gói ⇒ đổi bằng update-function-code --architectures\n$ aws lambda update-function-code --function-name labflow-tra-phong --zip-file fileb:///aws/tra-phong.zip --architectures arm64 --query 'Architectures[0]' --output text\narm64\n$ aws logs put-retention-policy --log-group-name /aws/lambda/labflow-tra-phong --retention-in-days 14\n$ aws lambda put-function-concurrency --function-name labflow-tra-phong --reserved-concurrent-executions 20 --query ReservedConcurrentExecutions --output text\n20\n# Thu quyền quá rộng, cấp lại chỉ cho đúng API này\n$ aws lambda remove-permission --function-name labflow-tra-phong --statement-id cho-tat-ca\n$ aws lambda add-permission --function-name labflow-tra-phong --statement-id cho-labflow-lab8 --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn 'arn:aws:execute-api:ap-southeast-1:000000000000:qrg0qjycpg/*/GET/phong/*' --query Statement --output text\n{\"Sid\": \"cho-labflow-lab8\", \"Effect\": \"Allow\", \"Action\": \"lambda:InvokeFunction\", \"Resource\": \"arn:aws:lambda:ap-southeast-1:000000000000:function:labflow-tra-phong\", \"Principal\": {\"Service\": \"apigateway.amazonaws.com\"}, \"Condition\": {\"ArnLike\": {\"AWS:SourceArn\": \"arn:aws:execute-api:ap-southeast-1:000000000000:qrg0qjycpg/*/GET/phong/*\"}}}\n$ bash cham.sh\n✓ 1 Hàm labflow-tra-phong chạy nodejs22.x\n✓ 2 Kiến trúc arm64 (Graviton, rẻ hơn ~20%)\n✓ 3 Bộ nhớ 256 MB, timeout 10 s (vừa đủ cho một API)\n✓ 4 Cấu hình qua biến môi trường (BANG=labflow-datlich)\n✓ 5 Log giữ 14 ngày\n✓ 6 Reserved concurrency = 20 (trần cho hoá đơn và cho DB phía sau)\n✓ 7 GET /phong/A101 ⇒ 200, /phong/Z999 ⇒ 404\n✓ 8 Quyền gọi hàm chỉ cho đúng API (có SourceArn)\nĐIỂM: 8/8");
const OUT_85_TRUOC = out("$ bash truoc.sh\nPending\nAPI qrg0qjycpg\n$ bash cham.sh\n✓ 1 Hàm labflow-tra-phong chạy nodejs22.x\n✗ 2 Kiến trúc x86_64 (cần arm64)\n✗ 3 Bộ nhớ 3008 MB, timeout 900 s (cần ≤ 512 MB và ≤ 10 s)\n✗ 4 Thiếu biến môi trường BANG (cấu hình đang nằm cứng trong mã)\n✗ 5 Log giữ: None (None = giữ mãi, tính tiền mãi; cần 14)\n✗ 6 Không giới hạn concurrency (hiện: None)\n✓ 7 GET /phong/A101 ⇒ 200, /phong/Z999 ⇒ 404\n✗ 8 Quyền gọi hàm thiếu SourceArn (API nào của ai cũng gọi được)\nĐIỂM: 2/8");
const MA_XINCHAO = js("// Hàm Lambda đầu tiên của LabFlow: in ra event, context và chứng minh biến ngoài handler sống qua các lần gọi \"ấm\".\nconst khoiTao = new Date().toISOString(); // chạy MỘT lần mỗi môi trường thực thi (lúc cold start)\nlet lanGoi = 0;\nexport const handler = async (event, context) => {\n  lanGoi += 1;\n  return {\n    lanGoi,\n    coldStart: lanGoi === 1,\n    khoiTao,\n    requestId: context.awsRequestId,\n    conLaiMs: context.getRemainingTimeInMillis(),\n    boNhoMB: context.memoryLimitInMB,\n    phong: event.phong ?? null,\n    bang: process.env.BANG,\n  };\n};");
const MA_CHAMFN = js("// Hàm cố tình chạy lâu hơn timeout (3 giây) để xem Lambda cắt ngang ra sao.\nexport const handler = async () => {\n  await new Promise((r) => setTimeout(r, 5000));\n  return { xong: true };\n};");
const MA_TINH = js("// Việc nặng CPU: băm mật khẩu bằng PBKDF2 (giống lúc đăng nhập) — để thấy \"bộ nhớ = CPU\".\nimport { pbkdf2Sync } from \"node:crypto\";\nexport const handler = async () => {\n  const t0 = performance.now();\n  pbkdf2Sync(\"matkhau-lab\", \"muoi\", 200000, 32, \"sha256\");\n  return { ms: Math.round(performance.now() - t0) };\n};");
const MA_API = js("// API tra cứu phòng lab: GET /phong/{id} — dạng \"Lambda proxy\": nhận cả yêu cầu HTTP, trả { statusCode, headers, body }.\nconst PHONG = {\n  A101: { ten: \"Phòng máy A101\", soMay: 40, mo: \"07:00–21:00\" },\n  B202: { ten: \"Phòng mạng B202\", soMay: 24, mo: \"08:00–17:00\" },\n  C303: { ten: \"Phòng IoT C303\", soMay: 16, mo: \"13:00–21:00\" },\n};\nconst tra = (statusCode, du) => ({ statusCode, headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(du) });\nexport const handler = async (event) => {\n  const id = event.pathParameters?.id?.toUpperCase();\n  const p = PHONG[id];\n  if (!p) return tra(404, { loi: `Không có phòng ${id}` });\n  return tra(200, { id, ...p, nguoiHoi: event.requestContext?.authorizer?.principalId ?? null });\n};");
const MA_CONG = js("// Lambda authorizer (kiểu TOKEN): kiểm JWT HS256 trong header Authorization rồi trả policy Allow/Deny cho API Gateway.\nimport { createHmac, timingSafeEqual } from \"node:crypto\";\nconst b64 = (s) => Buffer.from(s, \"base64url\");\nconst policy = (sub, effect, arn) => ({ principalId: sub, policyDocument: { Version: \"2012-10-17\", Statement: [{ Action: \"execute-api:Invoke\", Effect: effect, Resource: arn }] } });\nexport const handler = async (event) => {\n  const [loai, token] = (event.authorizationToken ?? \"\").split(\" \");\n  if (loai !== \"Bearer\" || !token) throw new Error(\"Unauthorized\"); // API Gateway đổi lỗi này thành 401\n  const [h, p, ky] = token.split(\".\");\n  const dung = createHmac(\"sha256\", process.env.JWT_SECRET).update(`${h}.${p}`).digest();\n  if (!ky || b64(ky).length !== dung.length || !timingSafeEqual(b64(ky), dung)) return policy(\"khach\", \"Deny\", event.methodArn); // 403\n  const claims = JSON.parse(b64(p).toString());\n  if (claims.exp * 1000 < Date.now()) return policy(claims.sub, \"Deny\", event.methodArn);\n  return policy(claims.sub, \"Allow\", event.methodArn);\n};");
const MA_TAOJWT = js("// Ký một JWT HS256 cho lab (sub, exp = bây giờ + giây). Dùng: node tao-jwt.mjs <sub> <giây>\nimport { createHmac } from \"node:crypto\";\nconst e = (o) => Buffer.from(JSON.stringify(o)).toString(\"base64url\");\nconst [sub = \"sv-an\", giay = \"900\"] = process.argv.slice(2);\nconst dau = `${e({ alg: \"HS256\", typ: \"JWT\" })}.${e({ sub, exp: Math.floor(Date.now() / 1000) + Number(giay) })}`;\nconsole.log(`${dau}.${createHmac(\"sha256\", process.env.JWT_SECRET).update(dau).digest(\"base64url\")}`);");
const MA_VONGLAP = js("// LỖI CỐ Ý: hàm nghe sự kiện \"có tệp mới\" của bucket, rồi lại GHI một tệp mới vào CHÍNH bucket đó ⇒ tự gọi lại mình mãi.\nimport { S3Client, PutObjectCommand } from \"@aws-sdk/client-s3\";\nconst s3 = new S3Client({ forcePathStyle: true });\nexport const handler = async (event) => {\n  const { bucket, object } = event.Records[0].s3;\n  const the = object.key.match(/^anh-nho\\/(.*)$/)?.[1] ?? object.key;\n  await s3.send(new PutObjectCommand({ Bucket: bucket.name, Key: `anh-nho/${Date.now()}-${the}`.slice(0, 200), Body: \"anh thu nho\" }));\n  return { daGhi: true };\n};");
const MA_GIA = js("// So chi phí tháng API LabFlow: Lambda + HTTP API vs Fargate 2 task sau ALB — giá Price List Singapore 11/2026 (KHÔNG tính Free Tier).\nconst L_REQ = 0.20 / 1e6, L_GBS = 0.0000166667, L_GBS_ARM = 0.0000133334, HTTP = 1.25 / 1e6, REST = 4.25 / 1e6;\nconst FARGATE = 2 * 730 * (0.5 * 0.05056 + 1 * 0.00553), ALB = 0.0252 * 730 + 0.008 * 730; // 2 task 0,5 vCPU/1 GB + ALB (≈1 LCU)\nconst ms = 50, mb = 256;\nconsole.log(`Giả định: mỗi yêu cầu chạy ${ms} ms, hàm ${mb} MB (x86); Fargate 2 task × (0,5 vCPU + 1 GB) + ALB ≈ ${(FARGATE + ALB).toFixed(2)} USD/tháng cố định`);\nconsole.log(\"yêu cầu/tháng\".padEnd(16), \"Lambda+HTTP API\".padStart(16), \"Lambda+REST API\".padStart(16), \"Fargate+ALB\".padStart(12));\nfor (const r of [1e5, 1e6, 1e7, 3e7, 1e8, 3e8]) {\n  const tinh = (r * ms / 1000) * (mb / 1024) * L_GBS + r * L_REQ;\n  console.log(r.toLocaleString(\"en-US\").padEnd(16), (tinh + r * HTTP).toFixed(2).padStart(16), (tinh + r * REST).toFixed(2).padStart(16), (FARGATE + ALB).toFixed(2).padStart(12));\n}\nconst hoaVon = (FARGATE + ALB) / ((ms / 1000) * (mb / 1024) * L_GBS + L_REQ + HTTP);\nconsole.log(`Điểm hoà vốn (Lambda + HTTP API = Fargate + ALB): ≈ ${(hoaVon / 1e6).toFixed(1)} triệu yêu cầu/tháng ≈ ${(hoaVon / 30 / 86400).toFixed(1)} yêu cầu/giây trung bình`);\nconsole.log(`ARM (Graviton) rẻ hơn x86 ${(100 * (1 - L_GBS_ARM / L_GBS)).toFixed(0)}% cho phần thời gian chạy.`);");
const MA_JTHUAN = java("package lab;\n\nimport java.util.Map;\n\n// Hàm Lambda Java \"trần\": không framework. Handler = lab.TraPhong::handleRequest\npublic class TraPhong {\n  private static final Map<String, String> PHONG = Map.of(\"A101\", \"Phòng máy A101\", \"B202\", \"Phòng mạng B202\");\n\n  public Map<String, Object> handleRequest(Map<String, Object> event) {\n    String id = String.valueOf(event.getOrDefault(\"phong\", \"A101\"));\n    return Map.of(\"id\", id, \"ten\", PHONG.getOrDefault(id, \"không có\"), \"java\", Runtime.version().toString());\n  }\n}");
const MA_JSPRING = java("package lab;\n\nimport java.util.Map;\nimport java.util.function.Function;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.context.annotation.Bean;\n\n// Cùng việc, viết bằng Spring Cloud Function: một Bean Function<,>; handler = FunctionInvoker của adapter AWS\n@SpringBootApplication\npublic class UngDung {\n  @Bean\n  public Function<Map<String, Object>, Map<String, Object>> traPhong() {\n    return event -> Map.of(\"id\", String.valueOf(event.getOrDefault(\"phong\", \"A101\")), \"framework\", \"Spring Cloud Function\");\n  }\n}");
const MA_POM = xml("<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd\">\n  <modelVersion>4.0.0</modelVersion>\n  <parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>3.5.7</version></parent>\n  <groupId>lab</groupId><artifactId>tra-phong-spring</artifactId><version>1.0</version>\n  <properties><java.version>21</java.version></properties>\n  <dependencyManagement><dependencies><dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-dependencies</artifactId><version>2025.0.0</version><type>pom</type><scope>import</scope></dependency></dependencies></dependencyManagement>\n  <dependencies>\n    <dependency><groupId>org.springframework.cloud</groupId><artifactId>spring-cloud-function-adapter-aws</artifactId></dependency>\n  </dependencies>\n  <build><plugins><plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-shade-plugin</artifactId>\n    <configuration><createDependencyReducedPom>false</createDependencyReducedPom><shadedArtifactAttached>true</shadedArtifactAttached><shadedClassifierName>aws</shadedClassifierName>\n      <transformers>\n        <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\"><resource>META-INF/spring.handlers</resource></transformer>\n        <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\"><resource>META-INF/spring.schemas</resource></transformer>\n        <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\"><resource>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</resource></transformer>\n        <transformer implementation=\"org.springframework.boot.maven.PropertiesMergingResourceTransformer\"><resource>META-INF/spring.factories</resource></transformer>\n      </transformers></configuration>\n    <dependencies><dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId><version>3.5.7</version></dependency></dependencies>\n    <executions><execution><phase>package</phase><goals><goal>shade</goal></goals></execution></executions>\n  </plugin></plugins></build>\n</project>");
const MA_CHAM = bash("# Bộ chấm lab Chương 8 — 8 phép kiểm (chạy được với AWS thật: bỏ --endpoint-url trong chung8.sh, đổi URL API)\nsource ~/vbg-dp/scratchpad/aws/lab/c8/chung8.sh\nd=0; ok() { echo \"✓ $1\"; d=$((d+1)); }; ko() { echo \"✗ $1\"; }\nFN=labflow-tra-phong\nread rt arch mem to bang <<<\"$(a lambda get-function-configuration --function-name $FN --query \"[Runtime,Architectures[0],MemorySize,Timeout,Environment.Variables.BANG]\" --output text)\"\n[ \"$rt\" = nodejs22.x ] && ok \"1 Hàm $FN chạy nodejs22.x\" || ko \"1 Không có hàm $FN chạy nodejs22.x (runtime: ${rt:-không có})\"\n[ \"$arch\" = arm64 ] && ok \"2 Kiến trúc arm64 (Graviton, rẻ hơn ~20%)\" || ko \"2 Kiến trúc ${arch:-?} (cần arm64)\"\n[ \"${mem:-0}\" -le 512 ] 2>/dev/null && [ \"${to:-0}\" -le 10 ] 2>/dev/null && [ \"${mem:-0}\" -gt 0 ] && ok \"3 Bộ nhớ $mem MB, timeout $to s (vừa đủ cho một API)\" || ko \"3 Bộ nhớ ${mem:-?} MB, timeout ${to:-?} s (cần ≤ 512 MB và ≤ 10 s)\"\n[ -n \"$bang\" ] && [ \"$bang\" != None ] && ok \"4 Cấu hình qua biến môi trường (BANG=$bang)\" || ko \"4 Thiếu biến môi trường BANG (cấu hình đang nằm cứng trong mã)\"\nr=$(a logs describe-log-groups --log-group-name-prefix /aws/lambda/$FN --query \"logGroups[0].retentionInDays\" --output text)\n[ \"$r\" = 14 ] && ok \"5 Log giữ 14 ngày\" || ko \"5 Log giữ: ${r:-None} (None = giữ mãi, tính tiền mãi; cần 14)\"\nc=$(a lambda get-function-concurrency --function-name $FN --query ReservedConcurrentExecutions --output text)\n[ \"${c:-0}\" -ge 1 ] 2>/dev/null && [ \"$c\" -le 50 ] && ok \"6 Reserved concurrency = $c (trần cho hoá đơn và cho DB phía sau)\" || ko \"6 Không giới hạn concurrency (hiện: ${c:-None})\"\nAPI=$(a apigateway get-rest-apis --query \"items[?name==\\`labflow-lab8\\`].id | [0]\" --output text); U=http://127.0.0.1:43866/restapis/$API/dev/_user_request_\ns1=$(curl -s -o /dev/null -w \"%{http_code}\" $U/phong/A101); s2=$(curl -s -o /dev/null -w \"%{http_code}\" $U/phong/Z999)\n[ \"$s1\" = 200 ] && [ \"$s2\" = 404 ] && ok \"7 GET /phong/A101 ⇒ 200, /phong/Z999 ⇒ 404\" || ko \"7 API: A101 ⇒ $s1, Z999 ⇒ $s2 (cần 200 và 404)\"\np=$(a lambda get-policy --function-name $FN --query Policy --output text)\n[[ \"$p\" == *apigateway.amazonaws.com* && \"$p\" == *SourceArn* ]] && ok \"8 Quyền gọi hàm chỉ cho đúng API (có SourceArn)\" || ko \"8 Quyền gọi hàm thiếu SourceArn (API nào của ai cũng gọi được)\"\necho \"ĐIỂM: $d/8\"");
const MA_TRUOC = bash("# Bản \"làm vội cho chạy được\" — điểm xuất phát của lab 8\nsource ~/vbg-dp/scratchpad/aws/lab/c8/chung8.sh; cd \"$LAM\"\ncp ~/vbg-dp/scratchpad/aws/lab/c8/fn/api.mjs index.mjs && zip -q -o tra-phong.zip index.mjs && rm index.mjs\na iam get-role --role-name labflow-fn-role >/dev/null || a iam create-role --role-name labflow-fn-role --assume-role-policy-document \"{\\\"Version\\\":\\\"2012-10-17\\\",\\\"Statement\\\":[{\\\"Effect\\\":\\\"Allow\\\",\\\"Principal\\\":{\\\"Service\\\":\\\"lambda.amazonaws.com\\\"},\\\"Action\\\":\\\"sts:AssumeRole\\\"}]}\" >/dev/null\na lambda create-function --function-name labflow-tra-phong --runtime nodejs22.x --handler index.handler --zip-file fileb:///aws/tra-phong.zip --role arn:aws:iam::000000000000:role/labflow-fn-role --memory-size 3008 --timeout 900 --query State --output text\na lambda wait function-active-v2 --function-name labflow-tra-phong\nAPI=$(a apigateway create-rest-api --name labflow-lab8 --query id --output text); GOC=$(a apigateway get-resources --rest-api-id $API --query \"items[0].id\" --output text)\nP=$(a apigateway create-resource --rest-api-id $API --parent-id $GOC --path-part phong --query id --output text)\nID=$(a apigateway create-resource --rest-api-id $API --parent-id $P --path-part \"{id}\" --query id --output text)\na apigateway put-method --rest-api-id $API --resource-id $ID --http-method GET --authorization-type NONE >/dev/null\na apigateway put-integration --rest-api-id $API --resource-id $ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:000000000000:function:labflow-tra-phong/invocations >/dev/null\na lambda add-permission --function-name labflow-tra-phong --statement-id cho-tat-ca --action lambda:InvokeFunction --principal apigateway.amazonaws.com --query Statement --output text >/dev/null\na apigateway create-deployment --rest-api-id $API --stage-name dev --query id --output text >/dev/null; echo \"API $API\"");
const MA_GIAI = bash("# LỜI GIẢI lab 8 — sửa đúng 8 điểm trên chính hàm và API đang có\nsource ~/vbg-dp/scratchpad/aws/lab/c8/chung8.sh; cd \"$LAM\"\nL lambda update-function-configuration --function-name labflow-tra-phong --memory-size 256 --timeout 10 --environment \"Variables={BANG=labflow-datlich}\" --query \"[MemorySize,Timeout]\" --output text\na lambda wait function-updated-v2 --function-name labflow-tra-phong\necho \"# Kiến trúc nằm ở mã đã đóng gói ⇒ đổi bằng update-function-code --architectures\"\nL lambda update-function-code --function-name labflow-tra-phong --zip-file fileb:///aws/tra-phong.zip --architectures arm64 --query \"Architectures[0]\" --output text\na lambda wait function-updated-v2 --function-name labflow-tra-phong\na lambda invoke --function-name labflow-tra-phong --cli-binary-format raw-in-base64-out --payload \"{}\" /aws/khoi.json >/dev/null  # tạo log group\nL logs put-retention-policy --log-group-name /aws/lambda/labflow-tra-phong --retention-in-days 14\nL lambda put-function-concurrency --function-name labflow-tra-phong --reserved-concurrent-executions 20 --query ReservedConcurrentExecutions --output text\nAPI=$(a apigateway get-rest-apis --query \"items[?name==\\`labflow-lab8\\`].id | [0]\" --output text)\necho \"# Thu quyền quá rộng, cấp lại chỉ cho đúng API này\"\nL lambda remove-permission --function-name labflow-tra-phong --statement-id cho-tat-ca\nL lambda add-permission --function-name labflow-tra-phong --statement-id cho-labflow-lab8 --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn \"arn:aws:execute-api:ap-southeast-1:000000000000:$API/*/GET/phong/*\" --query Statement --output text");
const MA_DON = bash("# Dọn lab 8 — API ⇒ hàm (kèm quyền) ⇒ log group ⇒ vai\nsource ~/vbg-dp/scratchpad/aws/lab/c8/chung8.sh\nfor API in $(a apigateway get-rest-apis --query \"items[].id\" --output text); do L apigateway delete-rest-api --rest-api-id $API; done\nfor f in $(a lambda list-functions --query \"Functions[].FunctionName\" --output text); do L lambda delete-function --function-name $f; done\nfor g in $(a logs describe-log-groups --log-group-name-prefix /aws/lambda/ --query \"logGroups[].logGroupName\" --output text); do L logs delete-log-group --log-group-name $g; done\na iam detach-role-policy --role-name labflow-fn-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole 2>/dev/null\nL iam delete-role --role-name labflow-fn-role");
const MA_CONGI = bash("# Còn gì đang tính tiền? (Chương 8) — mỗi dòng phải là 0\nsource ~/vbg-dp/scratchpad/aws/lab/c8/chung8.sh\necho \"Hàm Lambda:      $(a lambda list-functions --query \"length(Functions)\" --output text)\"\necho \"REST API:        $(a apigateway get-rest-apis --query \"length(items)\" --output text)\"\necho \"Log group Lambda: $(a logs describe-log-groups --log-group-name-prefix /aws/lambda/ --query \"length(logGroups)\" --output text)\"\necho \"Vai labflow-*:   $(a iam list-roles --query \"length(Roles[?starts_with(RoleName, \\`labflow-\\`)])\" --output text)\"");
/* ═════ 8.1 — Lambda ═════ */
const L81_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 1</span>
<h2>8.1 — Lambda functions in Node.js: handler, cold start, and memory that buys CPU</h2>
<p class="lead">Chapters 4–7 kept a server (or a container) running all day, waiting for requests. <strong>AWS Lambda</strong> turns that around: you upload a function, AWS starts it only when an event arrives, and you pay per request and per millisecond it runs. This lesson creates a real function, invokes it, reads its logs, measures a cold start against warm calls with AWS's own runtime image, watches a timeout cut a function off, and shows why "more memory" is how you buy more CPU.</p>

<h3>The picture: a plumber you call per job</h3>
<p>A company can keep a plumber on payroll all day (EC2, Fargate) — paid even when nothing leaks. Or it can call one per job: you pay for the visit and the minutes worked. The first call of the morning takes longer because the plumber has to get dressed, load the van and drive over (<strong>cold start</strong>); if another leak comes while the van is still parked outside, the same plumber walks back in immediately (<strong>warm start</strong>). Two leaks at once? The company sends two plumbers (<strong>concurrency</strong>). And every visit has a hard limit: after 15 minutes the plumber leaves, finished or not.</p>

<h3>The building blocks</h3>
<ul>
  <li><strong>Function</strong> — your code + configuration: runtime (<code>nodejs22.x</code>), handler (<code>index.handler</code> = file <code>index.mjs</code>, exported function <code>handler</code>), memory, timeout, environment variables, an <strong>execution role</strong>.</li>
  <li><strong>Event</strong> — the JSON that triggered the call: an HTTP request from API Gateway, an S3 "object created", an SQS message, a schedule…</li>
  <li><strong>Context</strong> — facts about this call: <code>awsRequestId</code>, <code>getRemainingTimeInMillis()</code>, <code>memoryLimitInMB</code>.</li>
  <li><strong>Execution environment</strong> — a small isolated micro-VM (Firecracker) that runs your code. Code outside the handler runs once per environment (init); the handler runs on every call.</li>
  <li><strong>Execution role</strong> — the IAM role the function assumes. <code>AWSLambdaBasicExecutionRole</code> only allows writing logs; everything else (DynamoDB, S3, Secrets Manager) you add with least privilege (Chapter 1).</li>
</ul>

<h3>See it running (1): a role and a function</h3>
<p>LocalStack 4.12 runs Lambda for real: each function gets a child container built from AWS's official <code>nodejs:22</code> runtime image.</p>
${MA_XINCHAO}
${OUT_81_TAO}
<ul>
  <li>The trust policy says <em>who</em> may assume the role: only <code>lambda.amazonaws.com</code>.</li>
  <li><code>--handler index.handler</code> = file <code>index.mjs</code> inside the zip, export <code>handler</code>. A wrong handler name is the most common "it deployed but every call fails" error.</li>
  <li>State <code>Pending</code>: the function is being prepared; wait for <code>Active</code> (<code>aws lambda wait function-active-v2</code>) before invoking.</li>
  <li>Configuration such as the table name goes in an <strong>environment variable</strong>, not in code. Secrets do not: they go in Secrets Manager (Lesson 6.3).</li>
</ul>

<h3>See it running (2): three invocations, and what survives between them</h3>
${OUT_81_GOI}
<ul>
  <li><code>khoiTao</code> is set by code <em>outside</em> the handler. Call 3 shows the same <code>khoiTao</code> as call 2 and <code>lanGoi: 2</code>: it reused a warm environment, and the module-level counter survived.</li>
  <li>Call 2 landed in a <strong>new</strong> environment (<code>lanGoi: 1</code> again, different <code>khoiTao</code>). LocalStack did that here; on AWS it also happens whenever no warm environment is free — during a burst, after scaling, or after an idle period. So: put expensive setup (SDK clients, DB connections) outside the handler to reuse it, but <strong>never rely</strong> on module state as storage — it is a cache that may vanish.</li>
  <li><code>conLaiMs: 2999</code>: the 3-second timeout, counted down. Long work should check this and stop cleanly.</li>
</ul>

<h3>See it running (3): the logs Lambda writes for you</h3>
${OUT_81_LOG}
<p>Every call writes <code>START</code>, <code>END</code> and <code>REPORT</code> to CloudWatch Logs group <code>/aws/lambda/&lt;function&gt;</code>. <code>REPORT</code> is the line to read: duration, <strong>billed duration</strong> (rounded up to 1 ms), configured memory and memory actually used. <strong>LocalStack differs:</strong> it reports Max Memory Used equal to the configured 256 MB; on AWS that number is the real peak, which is how you right-size memory.</p>

<h3>See it running (4): cold start versus warm, on AWS's own runtime image</h3>
<p>To measure without LocalStack's overhead, the same function ran in <code>public.ecr.aws/lambda/nodejs:22</code> — the image AWS publishes for container-image functions, which includes the <strong>Runtime Interface Emulator</strong> (RIE).</p>
${OUT_81_RIE}
<ul>
  <li>First call after the container starts: about 75 ms. Next calls: 1–2 ms. Restarting the container = a new environment = another cold start (47 ms).</li>
  <li><strong>RIE differs:</strong> it folds initialization into the first call's Duration and prints Init Duration 0.02 ms. On AWS the REPORT line of a cold start has a separate <code>Init Duration</code> (typically 100–300 ms for a small Node.js function; much more for Java — Lesson 8.3), and per the pricing page, initialization code is billed as duration too.</li>
  <li>Cold starts hurt user-facing APIs on rarely used routes; background jobs rarely care. Ways to shrink them: fewer and smaller dependencies, lazy-load what one route needs, Provisioned Concurrency (paid, kept warm), SnapStart (Lesson 8.3).</li>
</ul>

<h3>See it running (5): a timeout cuts the function off</h3>
${MA_CHAMFN}
${OUT_81_TIMEOUT}
<p>The function wanted 5 seconds; the timeout was 3. Lambda stops it and reports <code>Unhandled</code> with "Task timed out after 3.00 seconds" — you still pay for the 3 seconds. The maximum is <strong>15 minutes (900 s)</strong>. Set the timeout just above the slowest normal run: an API behind API Gateway cannot wait longer than API Gateway's own integration timeout anyway (29 s by default).</p>

<h3>See it running (6): memory is also how you buy CPU</h3>
${MA_TINH}
${OUT_81_CPU}
<p>Lambda gives CPU in proportion to memory: <strong>at 1,769 MB a function has the equivalent of one vCPU</strong>. Here the proportion was emulated with Docker's <code>--cpus</code> (128 MB ⇒ 0.072 CPU). Hashing one password took 395 ms at 128 MB, 95 ms at 512 MB, 35 ms at 1,769 MB. Because you pay GB-seconds, the 1,769 MB run costs about 1,769 × 35 ≈ 62,000 MB·ms versus 128 × 395 ≈ 51,000 MB·ms — almost the same money, ten times faster. For CPU-bound code, test several memory sizes before choosing the smallest.</p>

<h3>Limits worth remembering</h3>
<table>
  <tr><th>Item</th><th>Limit</th></tr>
  <tr><td>Memory</td><td>128 MB to 10,240 MB, 1-MB steps (1,769 MB ≈ 1 vCPU)</td></tr>
  <tr><td>Timeout</td><td>up to 900 s (15 minutes)</td></tr>
  <tr><td>Synchronous payload</td><td>6 MB request, 6 MB response</td></tr>
  <tr><td>Zip package</td><td>50 MB zipped upload; 250 MB unzipped including layers. Container image: up to 10 GB</td></tr>
  <tr><td>/tmp</td><td>512 MB to 10,240 MB</td></tr>
  <tr><td>Concurrency</td><td>an account-level quota per Region (1,000 by default; new accounts may start lower) shared by all functions</td></tr>
</table>
<p><strong>Layers</strong> package shared code or dependencies once and attach them to many functions (up to 5 per function). The Node.js runtimes already include AWS SDK v3, so <code>@aws-sdk/client-s3</code> works without bundling — but pin and bundle your own copy for production so a runtime update cannot change your SDK version silently.</p>

<h3>🕵️ Hacker corner: Denonia (2022) and the keys inside a function</h3>
<p>In April 2022 Cado Security described <strong>Denonia</strong>, the first malware built specifically to run inside AWS Lambda: a Go program that mined Monero and hid its traffic with DNS over HTTPS. The likely way in was not a Lambda bug but <strong>stolen AWS credentials</strong> used to deploy it. Inside a function, the temporary credentials of the execution role are environment variables — any code that runs there (a malicious npm package, an injection bug) can read them. Defences: give each function its own <strong>minimal</strong> role; never put secrets in plain environment variables; pin and audit dependencies; alarm on new functions or unusual Lambda spend; and treat the event as untrusted input (OWASP Serverless Top 10: event injection).</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"What is a cold start and how do you reduce it?"</strong> — The first call into a new execution environment pays for download, runtime start and your init code. Reduce it with small packages, lazy loading, more memory (more CPU), Provisioned Concurrency or SnapStart; avoid it mattering by keeping latency-critical paths off rarely called functions.</li>
  <li><strong>"Can a Lambda function keep state between calls?"</strong> — Only as a cache in module scope or /tmp of a warm environment; never as the source of truth. State goes to DynamoDB, S3, RDS, ElastiCache.</li>
  <li><strong>"Your function is slow and CPU-bound. What do you try first?"</strong> — Raise memory and measure: CPU scales with memory, and the bill often stays flat because duration drops.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Create <code>labflow-xinchao</code> as above, invoke it five times quickly, then wait 10 minutes and invoke again. Read the REPORT lines in the log group.</p>
<p><strong>Done when:</strong> you can point to which calls reused an environment (same <code>khoiTao</code>), and you raise the memory of <code>labflow-tinh</code> until doubling it no longer halves the duration.</p>
${giai('Hint: commands', bash(`aws lambda update-function-configuration --function-name labflow-tinh --memory-size 1024
aws lambda wait function-updated-v2 --function-name labflow-tinh
aws lambda invoke --function-name labflow-tinh out.json && cat out.json
aws logs tail /aws/lambda/labflow-tinh --since 5m | grep REPORT`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Handler</b><span>The exported function Lambda calls with (event, context).</span></div>
  <div><b>Execution environment</b><span>An isolated micro-VM running one copy of your function; reused while warm.</span></div>
  <div><b>Cold start</b><span>First call into a new environment: download, start runtime, run init code.</span></div>
  <div><b>Execution role</b><span>IAM role whose temporary credentials the function uses.</span></div>
  <div><b>Concurrency</b><span>How many environments run at the same moment.</span></div>
  <div><b>GB-second</b><span>Billing unit: memory in GB × seconds of duration.</span></div>
  <div><b>Layer</b><span>A zip of shared code/dependencies attached to functions.</span></div>
  <div><b>RIE</b><span>Runtime Interface Emulator: lets AWS's runtime images run locally.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A Lambda function is code + runtime + handler + memory + timeout + role; it runs only when an event arrives.</li>
  <li>Init code runs once per environment; warm calls reuse it — a cache, never storage.</li>
  <li>REPORT lines show duration, billed duration and memory; read them to right-size.</li>
  <li>Cold start ≈ 75 ms vs 1–2 ms warm for this small Node.js function on AWS's runtime image.</li>
  <li>Timeouts cut the function off (max 15 minutes); memory buys CPU (1,769 MB ≈ 1 vCPU).</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html', '🔁', 'AWS — The Lambda execution environment lifecycle', 'Init, invoke, shutdown phases and what is reused.')}
${tl('https://docs.aws.amazon.com/lambda/latest/dg/images-test.html', '🧪', 'AWS — Testing container images locally with RIE', 'Run the official runtime image on your machine.')}

<h3>Sources</h3>
<ul>
  <li>Node.js handler: <a href="https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html</a></li>
  <li>Execution environment: <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html</a></li>
  <li>Memory and CPU (1,769 MB = 1 vCPU): <a href="https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html</a></li>
  <li>Quotas: <a href="https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html</a></li>
  <li>Layers: <a href="https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html</a></li>
  <li>Runtime Interface Emulator: <a href="https://github.com/aws/aws-lambda-runtime-interface-emulator" target="_blank" rel="noopener">github.com/aws/aws-lambda-runtime-interface-emulator</a></li>
  <li>Pricing (init code billed as duration): <a href="https://aws.amazon.com/lambda/pricing/" target="_blank" rel="noopener">aws.amazon.com/lambda/pricing/</a></li>
  <li>Denonia (Cado Security, 2022): <a href="https://www.cadosecurity.com/blog/cado-discovers-denonia-the-first-malware-specifically-targeting-lambda" target="_blank" rel="noopener">cadosecurity.com/blog/cado-discovers-denonia-the-first-malware-specifically-targeting-lambda</a></li>
  <li>OWASP Serverless Top 10: <a href="https://owasp.org/www-project-serverless-top-10/" target="_blank" rel="noopener">owasp.org/www-project-serverless-top-10/</a></li>
</ul>
</div>
`;
const L81_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 1</span>
<h2>8.1 — Hàm Lambda bằng Node.js: handler, cold start, và bộ nhớ là thứ mua được CPU</h2>
<p class="lead">Chương 4–7 giữ một máy chủ (hay một container) chạy cả ngày để chờ yêu cầu. <strong>AWS Lambda</strong> làm ngược lại: bạn tải lên một hàm, AWS chỉ khởi động nó khi có sự kiện tới, và bạn trả tiền theo số yêu cầu và theo từng mili giây hàm chạy. Bài này tạo một hàm thật, gọi nó, đọc log, đo cold start so với các lần gọi ấm bằng chính ảnh runtime của AWS, xem timeout cắt ngang một hàm, và cho thấy vì sao "thêm bộ nhớ" là cách mua thêm CPU.</p>

<h3>Liên tưởng: thợ sửa ống nước gọi theo việc</h3>
<p>Một công ty có thể nuôi một thợ ống nước cả ngày (EC2, Fargate) — trả lương cả khi không có chỗ nào rò. Hoặc gọi thợ theo việc: trả tiền cho mỗi lần tới và số phút làm. Cuộc gọi đầu buổi sáng lâu hơn vì thợ phải thay đồ, chất đồ lên xe, chạy tới (<strong>cold start</strong>); nếu có chỗ rò khác trong lúc xe vẫn đỗ trước cửa, đúng người thợ đó quay vào ngay (<strong>warm start</strong>). Hai chỗ rò cùng lúc? Công ty gửi hai thợ (<strong>concurrency</strong>). Và mỗi lần tới có giới hạn cứng: hết 15 phút là thợ về, xong hay chưa cũng vậy.</p>

<h3>Các khối cơ bản</h3>
<ul>
  <li><strong>Function (hàm)</strong> — mã của bạn + cấu hình: runtime (<code>nodejs22.x</code>), handler (<code>index.handler</code> = tệp <code>index.mjs</code>, hàm export tên <code>handler</code>), bộ nhớ, timeout, biến môi trường, và một <strong>execution role</strong>.</li>
  <li><strong>Event</strong> — JSON đã kích hoạt lần gọi: một yêu cầu HTTP từ API Gateway, một sự kiện "có object mới" của S3, một tin SQS, một lịch hẹn giờ…</li>
  <li><strong>Context</strong> — thông tin về lần gọi này: <code>awsRequestId</code>, <code>getRemainingTimeInMillis()</code>, <code>memoryLimitInMB</code>.</li>
  <li><strong>Execution environment (môi trường thực thi)</strong> — một micro-VM nhỏ, cô lập (Firecracker) chạy mã của bạn. Mã nằm ngoài handler chạy một lần cho mỗi môi trường (giai đoạn init); handler chạy ở mọi lần gọi.</li>
  <li><strong>Execution role</strong> — vai IAM mà hàm đảm nhận. <code>AWSLambdaBasicExecutionRole</code> chỉ cho ghi log; mọi quyền khác (DynamoDB, S3, Secrets Manager) bạn tự thêm theo quyền tối thiểu (Chương 1).</li>
</ul>

<h3>Xem chạy (1): một vai và một hàm</h3>
<p>LocalStack 4.12 chạy Lambda thật: mỗi hàm có một container con dựng từ ảnh runtime chính hãng <code>nodejs:22</code> của AWS.</p>
${MA_XINCHAO}
${OUT_81_TAO}
<ul>
  <li>Trust policy nói <em>ai</em> được đảm nhận vai: chỉ <code>lambda.amazonaws.com</code>.</li>
  <li><code>--handler index.handler</code> = tệp <code>index.mjs</code> trong gói zip, export <code>handler</code>. Sai tên handler là lỗi "deploy được mà lần gọi nào cũng hỏng" hay gặp nhất.</li>
  <li>Trạng thái <code>Pending</code>: hàm đang được chuẩn bị; đợi <code>Active</code> (<code>aws lambda wait function-active-v2</code>) rồi mới gọi.</li>
  <li>Cấu hình như tên bảng nằm trong <strong>biến môi trường</strong>, không nằm trong mã. Bí mật thì không: bí mật vào Secrets Manager (bài 6.3).</li>
</ul>

<h3>Xem chạy (2): ba lần gọi, và thứ gì sống sót giữa chúng</h3>
${OUT_81_GOI}
<ul>
  <li><code>khoiTao</code> do mã <em>ngoài</em> handler đặt. Lần 3 có cùng <code>khoiTao</code> với lần 2 và <code>lanGoi: 2</code>: nó dùng lại một môi trường đang ấm, và biến đếm cấp module vẫn còn.</li>
  <li>Lần 2 rơi vào một môi trường <strong>mới</strong> (<code>lanGoi: 1</code> lần nữa, <code>khoiTao</code> khác). Ở đây là do LocalStack; trên AWS chuyện này cũng xảy ra mỗi khi không còn môi trường ấm nào rảnh — lúc tải dồn, sau khi co giãn, hoặc sau một lúc không ai gọi. Vậy: đặt phần khởi tạo tốn kém (client SDK, kết nối DB) ra ngoài handler để dùng lại, nhưng <strong>đừng bao giờ dựa</strong> vào biến module như chỗ lưu dữ liệu — nó là cache, có thể biến mất.</li>
  <li><code>conLaiMs: 2999</code>: timeout 3 giây đang đếm ngược. Việc dài nên kiểm con số này để dừng gọn.</li>
</ul>

<h3>Xem chạy (3): log mà Lambda tự ghi giúp bạn</h3>
${OUT_81_LOG}
<p>Mỗi lần gọi ghi <code>START</code>, <code>END</code> và <code>REPORT</code> vào log group CloudWatch <code>/aws/lambda/&lt;tên-hàm&gt;</code>. Dòng cần đọc là <code>REPORT</code>: thời gian chạy, <strong>thời gian tính tiền</strong> (làm tròn lên 1 ms), bộ nhớ cấu hình và bộ nhớ thực dùng. <strong>LocalStack khác AWS:</strong> nó báo Max Memory Used bằng đúng 256 MB đã cấu hình; trên AWS đó là đỉnh thật, và là con số để chọn đúng cỡ bộ nhớ.</p>

<h3>Xem chạy (4): cold start so với ấm, trên chính ảnh runtime của AWS</h3>
<p>Để đo mà không dính phần chậm của LocalStack, cùng hàm đó chạy trong <code>public.ecr.aws/lambda/nodejs:22</code> — ảnh AWS phát hành cho hàm dạng container image, có kèm <strong>Runtime Interface Emulator</strong> (RIE).</p>
${OUT_81_RIE}
<ul>
  <li>Lần gọi đầu sau khi container khởi động: khoảng 75 ms. Các lần sau: 1–2 ms. Khởi động lại container = môi trường mới = cold start lần nữa (47 ms).</li>
  <li><strong>RIE khác AWS:</strong> nó gộp phần khởi tạo vào Duration của lần gọi đầu và in Init Duration 0.02 ms. Trên AWS, dòng REPORT của một lần cold start có <code>Init Duration</code> riêng (thường 100–300 ms với một hàm Node.js nhỏ; Java lâu hơn nhiều — bài 8.3), và theo trang giá, mã khởi tạo cũng được tính tiền như thời gian chạy.</li>
  <li>Cold start làm đau các API phục vụ người dùng ở những đường ít ai gọi; việc chạy nền thì hiếm khi để ý. Cách giảm: ít và nhẹ thư viện, chỉ nạp thứ một đường cần khi tới lượt, Provisioned Concurrency (trả tiền để giữ ấm), SnapStart (bài 8.3).</li>
</ul>

<h3>Xem chạy (5): timeout cắt ngang hàm</h3>
${MA_CHAMFN}
${OUT_81_TIMEOUT}
<p>Hàm muốn chạy 5 giây; timeout là 3. Lambda dừng nó và báo <code>Unhandled</code> kèm "Task timed out after 3.00 seconds" — bạn vẫn trả tiền cho 3 giây đó. Tối đa là <strong>15 phút (900 giây)</strong>. Đặt timeout nhỉnh hơn lần chạy chậm nhất bình thường: một API sau API Gateway đằng nào cũng không chờ lâu hơn timeout tích hợp của chính API Gateway (mặc định 29 giây).</p>

<h3>Xem chạy (6): bộ nhớ cũng là cách mua CPU</h3>
${MA_TINH}
${OUT_81_CPU}
<p>Lambda cấp CPU tỉ lệ với bộ nhớ: <strong>ở 1.769 MB, hàm có tương đương một vCPU</strong>. Ở đây tỉ lệ đó được giả lập bằng <code>--cpus</code> của Docker (128 MB ⇒ 0,072 CPU). Băm một mật khẩu mất 395 ms ở 128 MB, 95 ms ở 512 MB, 35 ms ở 1.769 MB. Vì tính tiền theo GB-giây, lần chạy 1.769 MB tốn khoảng 1.769 × 35 ≈ 62.000 MB·ms so với 128 × 395 ≈ 51.000 MB·ms — gần như cùng tiền, mà nhanh gấp mười. Với mã nặng CPU, thử vài mức bộ nhớ trước khi chọn mức nhỏ nhất.</p>

<h3>Giới hạn nên nhớ</h3>
<table>
  <tr><th>Mục</th><th>Giới hạn</th></tr>
  <tr><td>Bộ nhớ</td><td>128 MB tới 10.240 MB, bước 1 MB (1.769 MB ≈ 1 vCPU)</td></tr>
  <tr><td>Timeout</td><td>tối đa 900 giây (15 phút)</td></tr>
  <tr><td>Dữ liệu gọi đồng bộ</td><td>6 MB yêu cầu, 6 MB phản hồi</td></tr>
  <tr><td>Gói zip</td><td>50 MB khi nén lúc tải lên; 250 MB khi giải nén, tính cả layer. Container image: tới 10 GB</td></tr>
  <tr><td>/tmp</td><td>512 MB tới 10.240 MB</td></tr>
  <tr><td>Concurrency</td><td>hạn mức cấp tài khoản theo Region (mặc định 1.000; tài khoản mới có thể thấp hơn), mọi hàm dùng chung</td></tr>
</table>
<p><strong>Layer</strong> đóng gói mã dùng chung hoặc thư viện một lần rồi gắn vào nhiều hàm (tối đa 5 layer mỗi hàm). Runtime Node.js đã có sẵn AWS SDK v3, nên <code>@aws-sdk/client-s3</code> chạy được mà không cần đóng gói — nhưng ở production hãy ghim và đóng gói bản của riêng bạn, để một lần cập nhật runtime không lặng lẽ đổi phiên bản SDK.</p>

<h3>🕵️ Góc hacker: Denonia (2022) và chìa khoá nằm trong hàm</h3>
<p>Tháng 4/2022, Cado Security mô tả <strong>Denonia</strong>, mã độc đầu tiên được viết riêng để chạy bên trong AWS Lambda: một chương trình Go đào Monero và giấu lưu lượng bằng DNS over HTTPS. Đường vào nhiều khả năng không phải lỗi của Lambda mà là <strong>khoá AWS bị đánh cắp</strong> rồi dùng để deploy nó. Bên trong một hàm, khoá tạm của execution role nằm ở biến môi trường — mã nào chạy ở đó (một gói npm độc hại, một lỗi injection) cũng đọc được. Cách phòng: mỗi hàm một vai riêng, <strong>tối thiểu</strong>; không để bí mật trong biến môi trường trần; ghim và soát thư viện; đặt cảnh báo khi có hàm mới hoặc chi phí Lambda bất thường; và coi event là dữ liệu không tin cậy (OWASP Serverless Top 10: event injection).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Cold start là gì, giảm thế nào?"</strong> — Lần gọi đầu vào một môi trường mới phải trả cho tải mã, khởi động runtime và chạy mã init. Giảm bằng gói nhỏ, nạp lười, thêm bộ nhớ (thêm CPU), Provisioned Concurrency hoặc SnapStart; hoặc làm nó bớt quan trọng bằng cách không đặt đường cần độ trễ thấp vào hàm ít được gọi.</li>
  <li><strong>"Hàm Lambda giữ trạng thái giữa các lần gọi được không?"</strong> — Chỉ như cache ở biến module hoặc /tmp của một môi trường đang ấm; không bao giờ là nguồn dữ liệu thật. Trạng thái để ở DynamoDB, S3, RDS, ElastiCache.</li>
  <li><strong>"Hàm của bạn chậm vì nặng CPU. Thử gì trước?"</strong> — Tăng bộ nhớ rồi đo: CPU tăng theo bộ nhớ, và hoá đơn thường giữ nguyên vì thời gian chạy giảm.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Tạo <code>labflow-xinchao</code> như trên, gọi nhanh năm lần, rồi chờ 10 phút và gọi lại. Đọc các dòng REPORT trong log group.</p>
<p><strong>Đạt khi:</strong> bạn chỉ ra được lần gọi nào dùng lại môi trường (cùng <code>khoiTao</code>), và tăng bộ nhớ của <code>labflow-tinh</code> tới khi gấp đôi bộ nhớ không còn làm thời gian chạy giảm một nửa.</p>
${giai('Gợi ý: các lệnh', bash(`aws lambda update-function-configuration --function-name labflow-tinh --memory-size 1024
aws lambda wait function-updated-v2 --function-name labflow-tinh
aws lambda invoke --function-name labflow-tinh out.json && cat out.json
aws logs tail /aws/lambda/labflow-tinh --since 5m | grep REPORT`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Handler</b><span>Hàm được export mà Lambda gọi với (event, context).</span></div>
  <div><b>Execution environment</b><span>Micro-VM cô lập chạy một bản của hàm; được dùng lại khi còn ấm.</span></div>
  <div><b>Cold start</b><span>Lần gọi đầu vào môi trường mới: tải mã, khởi động runtime, chạy mã init.</span></div>
  <div><b>Execution role</b><span>Vai IAM mà hàm dùng khoá tạm của nó.</span></div>
  <div><b>Concurrency</b><span>Số môi trường chạy cùng một thời điểm.</span></div>
  <div><b>GB-giây</b><span>Đơn vị tính tiền: bộ nhớ (GB) × số giây chạy.</span></div>
  <div><b>Layer</b><span>Gói zip mã/thư viện dùng chung gắn vào các hàm.</span></div>
  <div><b>RIE</b><span>Runtime Interface Emulator: cho ảnh runtime của AWS chạy được ở máy bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một hàm Lambda là mã + runtime + handler + bộ nhớ + timeout + vai; nó chỉ chạy khi có sự kiện.</li>
  <li>Mã init chạy một lần mỗi môi trường; lần gọi ấm dùng lại nó — là cache, không phải chỗ lưu.</li>
  <li>Dòng REPORT cho biết thời gian chạy, thời gian tính tiền và bộ nhớ; đọc nó để chọn cỡ.</li>
  <li>Cold start ≈ 75 ms so với 1–2 ms khi ấm, với hàm Node.js nhỏ này trên ảnh runtime của AWS.</li>
  <li>Timeout cắt ngang hàm (tối đa 15 phút); bộ nhớ mua CPU (1.769 MB ≈ 1 vCPU).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html', '🔁', 'AWS — Vòng đời môi trường thực thi Lambda', 'Các giai đoạn init, invoke, shutdown và thứ gì được dùng lại.')}
${tl('https://docs.aws.amazon.com/lambda/latest/dg/images-test.html', '🧪', 'AWS — Thử container image ở máy bằng RIE', 'Chạy ảnh runtime chính hãng trên máy bạn.')}

<h3>Nguồn</h3>
<ul>
  <li>Handler Node.js: <a href="https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html</a></li>
  <li>Môi trường thực thi: <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html</a></li>
  <li>Bộ nhớ và CPU (1.769 MB = 1 vCPU): <a href="https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html</a></li>
  <li>Hạn mức: <a href="https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html</a></li>
  <li>Layer: <a href="https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html</a></li>
  <li>Runtime Interface Emulator: <a href="https://github.com/aws/aws-lambda-runtime-interface-emulator" target="_blank" rel="noopener">github.com/aws/aws-lambda-runtime-interface-emulator</a></li>
  <li>Giá (mã khởi tạo được tính như thời gian chạy): <a href="https://aws.amazon.com/lambda/pricing/" target="_blank" rel="noopener">aws.amazon.com/lambda/pricing/</a></li>
  <li>Denonia (Cado Security, 2022): <a href="https://www.cadosecurity.com/blog/cado-discovers-denonia-the-first-malware-specifically-targeting-lambda" target="_blank" rel="noopener">cadosecurity.com/blog/cado-discovers-denonia-the-first-malware-specifically-targeting-lambda</a></li>
  <li>OWASP Serverless Top 10: <a href="https://owasp.org/www-project-serverless-top-10/" target="_blank" rel="noopener">owasp.org/www-project-serverless-top-10/</a></li>
</ul>
</div>
`;
/* ═════ 8.2 — API Gateway ═════ */
const L82_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 2</span>
<h2>8.2 — HTTP APIs with API Gateway: routes, Lambda proxy, authorizers and throttling</h2>
<p class="lead">A Lambda function has no URL a browser can call by itself in most designs; <strong>Amazon API Gateway</strong> is the front door that turns HTTPS requests into Lambda events and Lambda results back into HTTP responses. This lesson builds <code>GET /phong/{id}</code> for LabFlow, calls it for real, attaches a JWT authorizer — and shows how an emulator that silently skips authorizers can make an unsafe API look safe.</p>

<h3>The picture: the reception desk of an office building</h3>
<p>Visitors do not walk straight into the accounting department. They stop at reception: the receptionist checks the badge (authorizer), looks up which floor handles the request (route), limits how many people go up at once (throttling), and phones the right department (integration). API Gateway is that desk; each Lambda function is a department that never sees a visitor without a badge — if the desk does its job.</p>

<h3>HTTP API or REST API?</h3>
<table>
  <tr><th></th><th>HTTP API (v2)</th><th>REST API (v1)</th></tr>
  <tr><td>Price, Singapore (first tier)</td><td>1.25 USD per million requests</td><td>4.25 USD per million requests</td></tr>
  <tr><td>Lambda / HTTP integrations, CORS, custom domains</td><td>Yes</td><td>Yes</td></tr>
  <tr><td>JWT authorizer (Cognito or any OIDC issuer), Lambda authorizer</td><td>Yes</td><td>Yes</td></tr>
  <tr><td>API keys, usage plans, per-client throttling</td><td>No</td><td>Yes</td></tr>
  <tr><td>Request validation, AWS WAF, private endpoints, caching</td><td>No</td><td>Yes</td></tr>
</table>
<p>AWS's own advice: HTTP APIs are built with fewer features so they can cost less; choose REST APIs when you need API keys, per-client rate limits, request validation, WAF or private endpoints. For LabFlow's public read API, an HTTP API is the default. The lab below uses a REST API only because <strong>LocalStack's free edition does not emulate HTTP APIs</strong> (<code>apigatewayv2</code> answers "not included in your current license plan"); the route, the proxy integration and the permission are the same ideas.</p>

<h3>See it running (1): a route that calls Lambda</h3>
${MA_API}
${OUT_82_TAO}
<ol>
  <li>A resource <code>/phong/{id}</code> with a <code>GET</code> method; <code>{id}</code> becomes <code>event.pathParameters.id</code>.</li>
  <li><code>AWS_PROXY</code> integration ("Lambda proxy"): API Gateway passes the whole request (method, path, headers, query, body) as the event and expects <code>{ statusCode, headers, body }</code> back. The function owns status codes and JSON.</li>
  <li><code>lambda add-permission</code> with a <code>--source-arn</code>: a resource policy on the <em>function</em> allowing API Gateway to invoke it — but only from this API, this method, this path. Without <code>--source-arn</code>, any API Gateway API in any account that knows the function ARN could be pointed at it (Lab 8.5 checks this).</li>
  <li>Nothing is live until a <strong>deployment</strong> to a <strong>stage</strong> (<code>dev</code>). HTTP APIs can auto-deploy to the <code>$default</code> stage.</li>
</ol>

<h3>See it running (2): real HTTP calls</h3>
${OUT_82_GOI}
<p>200 with JSON for a known room, 404 with a Vietnamese error for an unknown one — the status code came from the function, not from API Gateway. On AWS the URL looks like <code>https://&lt;api-id&gt;.execute-api.ap-southeast-1.amazonaws.com/dev/phong/A101</code>; LocalStack serves it under <code>/restapis/&lt;id&gt;/dev/_user_request_/</code>.</p>

<h3>See it running (3): an authorizer that the emulator ignores</h3>
${MA_CONG}
${OUT_82_JWT}
<p>The authorizer was attached and redeployed — and all three calls, including <strong>no token</strong> and a <strong>token signed with an attacker's key</strong>, still returned 200. Not because the code is wrong: <strong>LocalStack's free edition does not enforce authorizers</strong>. This is the most important lesson of the page: a security test that passes on an emulator proves nothing. Security controls must be tested where they run — a staging stage on real AWS, with a test that expects 401 and 403.</p>

<h3>See it running (4): the authorizer itself, called with API Gateway's real event</h3>
<p>The authorizer is just a function. Invoking it directly with the exact <code>TOKEN</code> event API Gateway sends shows its decisions:</p>
${MA_TAOJWT}
${OUT_82_CONG}
<ul>
  <li>No <code>Bearer</code> header ⇒ the function throws <code>"Unauthorized"</code>; API Gateway turns exactly that message into <strong>401</strong>.</li>
  <li>A forged signature or an expired token ⇒ a policy with <code>Deny</code> ⇒ <strong>403</strong>. The signature is compared with <code>timingSafeEqual</code>, so response time does not leak how many bytes matched.</li>
  <li>A valid token ⇒ <code>Allow</code> with <code>principalId = sv-an</code>; API Gateway passes it to <code>labflow-api</code> in <code>requestContext.authorizer</code>.</li>
  <li><code>--authorizer-result-ttl-in-seconds 300</code>: the decision is cached per token for 5 minutes, so the authorizer does not run on every request. A revoked token keeps working until the cache expires — keep tokens short-lived.</li>
  <li>With an HTTP API you usually write no authorizer code at all: a <strong>JWT authorizer</strong> checks issuer, audience, expiry and signature (via the issuer's JWKS) for you — Cognito, Auth0, Keycloak or your own OIDC provider.</li>
</ul>

<h3>Throttling: two layers of brakes</h3>
<ul>
  <li><strong>API Gateway</strong>: per account per Region about 10,000 requests per second with a burst bucket of 5,000 (lower in some newer Regions); you can set lower limits per stage or route. Over the limit the client gets <strong>429 Too Many Requests</strong>. REST APIs add usage plans and API keys for per-client quotas.</li>
  <li><strong>Lambda</strong>: <strong>reserved concurrency</strong> caps how many copies of one function run at once (and guarantees them that capacity). It protects what is behind the function — an RDS instance with 100 connections cannot survive 1,000 concurrent functions each opening a connection.</li>
</ul>
${OUT_82_DONGTHOI}
<p><strong>LocalStack differs again:</strong> with reserved concurrency 1, five simultaneous calls all returned 200; AWS would throttle the extra calls (synchronous callers get <code>TooManyRequestsException</code>, HTTP 429 through API Gateway).</p>

<h3>What it costs</h3>
<p>Singapore, 11/2026: HTTP API 1.25 USD per million requests (first 300 million), REST API 4.25 USD per million (first 333 million), plus Lambda (0.20 USD per million requests + duration). One million LabFlow lookups a month through an HTTP API ≈ 1.25 + 0.20 + a few cents of duration ≈ 1.5 USD. Lesson 8.4 compares this with Fargate.</p>

<h3>🕵️ Hacker corner: Optus, September 2022</h3>
<p>Australian telecom Optus lost data on up to 10 million current and former customers. According to an insider account and statements by Australian officials, the cause was an <strong>API endpoint reachable from the Internet without authentication</strong> that reportedly returned customer records by ID — so the attacker could simply count through the IDs (Optus first described it as a sophisticated attack). Defences that map to this lesson: an authorizer on <strong>every</strong> route with deny by default; IDs that are not guessable; per-client throttling so nobody can enumerate millions of records; an inventory of every API and stage (test APIs left online are classic); alarms on unusual 200 volumes per client.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"HTTP API or REST API?"</strong> — HTTP API by default: cheaper, simpler, built-in JWT authorizer. REST API when you need API keys/usage plans, per-client throttling, request validation, WAF, caching or private endpoints.</li>
  <li><strong>"How do you secure a Lambda-backed API?"</strong> — Authorizer on every route (JWT or Lambda), least-privilege execution role, <code>add-permission</code> scoped with source ARN, throttling and reserved concurrency, WAF for REST APIs, logs and alarms; and test 401/403 on real AWS, not only on an emulator.</li>
  <li><strong>"What does Lambda proxy integration mean?"</strong> — The whole HTTP request becomes the event, and the function returns status code, headers and body itself.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Add <code>GET /phong</code> (list all rooms) to the same API, wired to the same function, and make the function return 200 with the three rooms when <code>pathParameters</code> is missing.</p>
<p><strong>Done when:</strong> <code>curl $URL/phong</code> returns three rooms, <code>/phong/A101</code> still returns one, and you can say which line of <code>lambda add-permission</code> you had to change so the new path is allowed.</p>
${giai('Hint', bash(`# /phong already exists (its id is $P) — add a GET method on it
aws apigateway put-method --rest-api-id $API --resource-id $P --http-method GET --authorization-type NONE
aws apigateway put-integration … --type AWS_PROXY …   # same URI as /phong/{id}
# the old permission allowed GET/phong/* — /phong itself needs …/GET/phong (or GET/phong*)`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Route / resource + method</b><span>A path and HTTP verb that API Gateway accepts.</span></div>
  <div><b>Lambda proxy</b><span>Integration that passes the whole request as the event; function returns the HTTP response.</span></div>
  <div><b>Stage</b><span>A named, deployed version of the API (dev, prod).</span></div>
  <div><b>Authorizer</b><span>JWT check or Lambda function that decides Allow/Deny before the integration runs.</span></div>
  <div><b>Throttling</b><span>Rate limits; over them the client gets 429.</span></div>
  <div><b>Reserved concurrency</b><span>Maximum simultaneous copies of one function.</span></div>
  <div><b>Resource policy (Lambda)</b><span>Who may invoke the function; scope it with SourceArn.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>API Gateway is the front door: route, authorizer, throttling, integration.</li>
  <li>HTTP API (1.25 USD/million) by default; REST API (4.25 USD/million) for API keys, per-client limits, validation, WAF, private endpoints.</li>
  <li>Lambda proxy: the function controls status codes; grant invoke with a source ARN.</li>
  <li>An emulator that skips authorizers turns an open API green — test security on real AWS.</li>
  <li>Two brakes: API Gateway throttling (429) and Lambda reserved concurrency.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html', '🔐', 'AWS — JWT authorizers for HTTP APIs', 'Issuer, audience, scopes — no authorizer code to write.')}
${tl('https://owasp.org/www-project-serverless-top-10/', '🛡️', 'OWASP Serverless Top 10', 'Broken authentication, event injection and other serverless risks.')}

<h3>Sources</h3>
<ul>
  <li>HTTP API vs REST API: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html</a></li>
  <li>Lambda authorizers: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html</a></li>
  <li>JWT authorizers: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html</a></li>
  <li>Quotas (10,000 RPS, burst 5,000): <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/limits.html</a></li>
  <li>Lambda concurrency: <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/api-gateway/pricing/" target="_blank" rel="noopener">aws.amazon.com/api-gateway/pricing/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>Optus data breach (2022): <a href="https://en.wikipedia.org/wiki/2022_Optus_data_breach" target="_blank" rel="noopener">en.wikipedia.org/wiki/2022_Optus_data_breach</a></li>
</ul>
</div>
`;
const L82_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 2</span>
<h2>8.2 — API HTTP với API Gateway: route, Lambda proxy, authorizer và throttling</h2>
<p class="lead">Trong phần lớn thiết kế, hàm Lambda không có sẵn một URL để trình duyệt gọi; <strong>Amazon API Gateway</strong> là cửa trước, biến yêu cầu HTTPS thành sự kiện Lambda và biến kết quả Lambda trở lại thành phản hồi HTTP. Bài này dựng <code>GET /phong/{id}</code> cho LabFlow, gọi thật, gắn authorizer kiểm JWT — và cho thấy một trình giả lập lặng lẽ bỏ qua authorizer có thể khiến một API không an toàn trông như an toàn.</p>

<h3>Liên tưởng: quầy lễ tân của một toà văn phòng</h3>
<p>Khách không đi thẳng vào phòng kế toán. Họ dừng ở lễ tân: lễ tân kiểm thẻ (authorizer), tra xem tầng nào lo việc này (route), giới hạn số người lên cùng lúc (throttling), rồi gọi điện cho đúng phòng (integration). API Gateway là quầy đó; mỗi hàm Lambda là một phòng ban không bao giờ gặp khách không có thẻ — nếu quầy làm đúng việc.</p>

<h3>HTTP API hay REST API?</h3>
<table>
  <tr><th></th><th>HTTP API (v2)</th><th>REST API (v1)</th></tr>
  <tr><td>Giá, Singapore (bậc đầu)</td><td>1,25 USD mỗi triệu yêu cầu</td><td>4,25 USD mỗi triệu yêu cầu</td></tr>
  <tr><td>Tích hợp Lambda / HTTP, CORS, tên miền riêng</td><td>Có</td><td>Có</td></tr>
  <tr><td>JWT authorizer (Cognito hoặc nhà phát hành OIDC bất kỳ), Lambda authorizer</td><td>Có</td><td>Có</td></tr>
  <tr><td>API key, usage plan, throttling theo từng khách</td><td>Không</td><td>Có</td></tr>
  <tr><td>Kiểm tra yêu cầu, AWS WAF, endpoint private, cache</td><td>Không</td><td>Có</td></tr>
</table>
<p>Lời khuyên của chính AWS: HTTP API được làm với ít tính năng hơn để rẻ hơn; chọn REST API khi cần API key, giới hạn tần suất theo từng khách, kiểm tra yêu cầu, WAF hoặc endpoint private. Với API đọc công khai của LabFlow, HTTP API là mặc định. Lab dưới đây dùng REST API chỉ vì <strong>bản miễn phí của LocalStack không giả lập HTTP API</strong> (<code>apigatewayv2</code> trả lời "not included in your current license plan"); route, tích hợp proxy và quyền gọi vẫn là cùng một ý.</p>

<h3>Xem chạy (1): một route gọi Lambda</h3>
${MA_API}
${OUT_82_TAO}
<ol>
  <li>Tài nguyên <code>/phong/{id}</code> với phương thức <code>GET</code>; <code>{id}</code> trở thành <code>event.pathParameters.id</code>.</li>
  <li>Tích hợp <code>AWS_PROXY</code> ("Lambda proxy"): API Gateway chuyển nguyên yêu cầu (phương thức, đường dẫn, header, query, body) thành event và chờ nhận lại <code>{ statusCode, headers, body }</code>. Hàm tự quyết mã trạng thái và JSON.</li>
  <li><code>lambda add-permission</code> kèm <code>--source-arn</code>: một resource policy trên <em>hàm</em>, cho API Gateway gọi nó — nhưng chỉ từ API này, phương thức này, đường dẫn này. Thiếu <code>--source-arn</code>, bất kỳ API Gateway nào ở bất kỳ tài khoản nào biết ARN của hàm cũng có thể trỏ vào nó (lab 8.5 kiểm điều này).</li>
  <li>Chưa có gì chạy cho tới khi <strong>deploy</strong> lên một <strong>stage</strong> (<code>dev</code>). HTTP API có thể tự deploy lên stage <code>$default</code>.</li>
</ol>

<h3>Xem chạy (2): gọi HTTP thật</h3>
${OUT_82_GOI}
<p>200 kèm JSON với phòng có thật, 404 kèm lỗi tiếng Việt với phòng không có — mã trạng thái do hàm trả, không phải do API Gateway. Trên AWS, URL có dạng <code>https://&lt;api-id&gt;.execute-api.ap-southeast-1.amazonaws.com/dev/phong/A101</code>; LocalStack phục vụ dưới <code>/restapis/&lt;id&gt;/dev/_user_request_/</code>.</p>

<h3>Xem chạy (3): authorizer mà trình giả lập bỏ qua</h3>
${MA_CONG}
${OUT_82_JWT}
<p>Authorizer đã được gắn và deploy lại — vậy mà cả ba lần gọi, kể cả <strong>không có token</strong> và <strong>token ký bằng khoá của kẻ giả mạo</strong>, vẫn trả 200. Không phải do mã sai: <strong>bản miễn phí của LocalStack không thực thi authorizer</strong>. Đây là bài học quan trọng nhất của trang này: một phép thử bảo mật xanh trên trình giả lập chẳng chứng minh được gì. Cơ chế bảo mật phải được thử ở nơi nó thật sự chạy — một stage staging trên AWS thật, với phép thử chờ đúng 401 và 403.</p>

<h3>Xem chạy (4): chính authorizer, gọi bằng đúng sự kiện API Gateway gửi</h3>
<p>Authorizer chỉ là một hàm. Gọi thẳng nó với đúng sự kiện <code>TOKEN</code> mà API Gateway gửi sẽ thấy các quyết định của nó:</p>
${MA_TAOJWT}
${OUT_82_CONG}
<ul>
  <li>Không có header <code>Bearer</code> ⇒ hàm ném <code>"Unauthorized"</code>; API Gateway biến đúng thông điệp đó thành <strong>401</strong>.</li>
  <li>Chữ ký giả hoặc token đã hết hạn ⇒ policy <code>Deny</code> ⇒ <strong>403</strong>. Chữ ký được so bằng <code>timingSafeEqual</code>, để thời gian phản hồi không để lộ đã khớp bao nhiêu byte.</li>
  <li>Token hợp lệ ⇒ <code>Allow</code> với <code>principalId = sv-an</code>; API Gateway chuyển nó cho <code>labflow-api</code> trong <code>requestContext.authorizer</code>.</li>
  <li><code>--authorizer-result-ttl-in-seconds 300</code>: quyết định được cache theo từng token trong 5 phút, nên authorizer không chạy ở mọi yêu cầu. Một token bị thu hồi vẫn dùng được tới khi cache hết hạn — hãy để token sống ngắn.</li>
  <li>Với HTTP API, thường bạn không phải viết mã authorizer: một <strong>JWT authorizer</strong> tự kiểm issuer, audience, hạn dùng và chữ ký (qua JWKS của nhà phát hành) — Cognito, Auth0, Keycloak hay nhà cung cấp OIDC của riêng bạn.</li>
</ul>

<h3>Throttling: hai lớp phanh</h3>
<ul>
  <li><strong>API Gateway</strong>: mỗi tài khoản mỗi Region khoảng 10.000 yêu cầu mỗi giây, xô đệm (burst) 5.000 (thấp hơn ở vài Region mới); bạn đặt mức thấp hơn được cho từng stage hoặc route. Vượt mức thì khách nhận <strong>429 Too Many Requests</strong>. REST API có thêm usage plan và API key để chia hạn mức theo từng khách.</li>
  <li><strong>Lambda</strong>: <strong>reserved concurrency</strong> giới hạn số bản của một hàm chạy cùng lúc (và giữ riêng phần sức chứa đó cho nó). Nó bảo vệ thứ nằm sau hàm — một instance RDS 100 kết nối không sống nổi 1.000 hàm chạy đồng thời, mỗi hàm mở một kết nối.</li>
</ul>
${OUT_82_DONGTHOI}
<p><strong>LocalStack lại khác AWS:</strong> với reserved concurrency 1, năm lần gọi đồng thời đều trả 200; AWS sẽ chặn các lần dư (bên gọi đồng bộ nhận <code>TooManyRequestsException</code>, qua API Gateway là HTTP 429).</p>

<h3>Tốn bao nhiêu</h3>
<p>Singapore, 11/2026: HTTP API 1,25 USD mỗi triệu yêu cầu (300 triệu đầu), REST API 4,25 USD mỗi triệu (333 triệu đầu), cộng Lambda (0,20 USD mỗi triệu yêu cầu + thời gian chạy). Một triệu lần tra cứu LabFlow mỗi tháng qua HTTP API ≈ 1,25 + 0,20 + vài xu thời gian chạy ≈ 1,5 USD. Bài 8.4 so con số này với Fargate.</p>

<h3>🕵️ Góc hacker: Optus, tháng 9/2022</h3>
<p>Nhà mạng Úc Optus làm lộ dữ liệu của tới 10 triệu khách hàng hiện tại và cũ. Theo lời một người trong cuộc và phát biểu của giới chức Úc, nguyên nhân là một <strong>endpoint API với tới được từ Internet mà không cần xác thực</strong>, được cho là trả hồ sơ khách theo ID — nên kẻ tấn công chỉ việc đếm lần lượt các ID (ban đầu Optus mô tả đây là một vụ tấn công tinh vi). Cách phòng khớp với bài này: authorizer trên <strong>mọi</strong> route, mặc định từ chối; ID không đoán được; throttling theo từng khách để không ai liệt kê được hàng triệu bản ghi; danh sách mọi API và stage (API thử bỏ quên trên mạng là chuyện kinh điển); cảnh báo khi một khách nhận số phản hồi 200 bất thường.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"HTTP API hay REST API?"</strong> — Mặc định HTTP API: rẻ hơn, đơn giản hơn, có sẵn JWT authorizer. REST API khi cần API key/usage plan, throttling theo khách, kiểm tra yêu cầu, WAF, cache hoặc endpoint private.</li>
  <li><strong>"Bảo vệ một API chạy bằng Lambda thế nào?"</strong> — Authorizer trên mọi route (JWT hoặc Lambda), execution role tối thiểu, <code>add-permission</code> giới hạn bằng source ARN, throttling và reserved concurrency, WAF với REST API, log và cảnh báo; và thử 401/403 trên AWS thật, không chỉ trên trình giả lập.</li>
  <li><strong>"Lambda proxy integration là gì?"</strong> — Nguyên yêu cầu HTTP thành event, và hàm tự trả mã trạng thái, header và body.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Thêm <code>GET /phong</code> (liệt kê mọi phòng) vào cùng API, nối vào cùng hàm, và sửa hàm để trả 200 kèm ba phòng khi không có <code>pathParameters</code>.</p>
<p><strong>Đạt khi:</strong> <code>curl $URL/phong</code> trả ba phòng, <code>/phong/A101</code> vẫn trả một phòng, và bạn nói được phải sửa dòng nào của <code>lambda add-permission</code> để đường mới được phép gọi.</p>
${giai('Gợi ý', bash(`# /phong đã có (id là $P) — thêm phương thức GET lên nó
aws apigateway put-method --rest-api-id $API --resource-id $P --http-method GET --authorization-type NONE
aws apigateway put-integration … --type AWS_PROXY …   # cùng URI với /phong/{id}
# quyền cũ cho GET/phong/* — riêng /phong cần …/GET/phong (hoặc GET/phong*)`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Route / resource + method</b><span>Một đường dẫn và động từ HTTP mà API Gateway nhận.</span></div>
  <div><b>Lambda proxy</b><span>Tích hợp chuyển nguyên yêu cầu thành event; hàm tự trả phản hồi HTTP.</span></div>
  <div><b>Stage</b><span>Một phiên bản API có tên, đã deploy (dev, prod).</span></div>
  <div><b>Authorizer</b><span>Kiểm JWT hoặc hàm Lambda quyết định Allow/Deny trước khi tích hợp chạy.</span></div>
  <div><b>Throttling</b><span>Giới hạn tần suất; vượt thì khách nhận 429.</span></div>
  <div><b>Reserved concurrency</b><span>Số bản tối đa của một hàm chạy cùng lúc.</span></div>
  <div><b>Resource policy (Lambda)</b><span>Ai được gọi hàm; giới hạn bằng SourceArn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>API Gateway là cửa trước: route, authorizer, throttling, integration.</li>
  <li>Mặc định HTTP API (1,25 USD/triệu); REST API (4,25 USD/triệu) khi cần API key, giới hạn theo khách, kiểm tra yêu cầu, WAF, endpoint private.</li>
  <li>Lambda proxy: hàm quyết mã trạng thái; cấp quyền gọi kèm source ARN.</li>
  <li>Trình giả lập bỏ qua authorizer biến một API để ngỏ thành màu xanh — thử bảo mật trên AWS thật.</li>
  <li>Hai lớp phanh: throttling của API Gateway (429) và reserved concurrency của Lambda.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html', '🔐', 'AWS — JWT authorizer cho HTTP API', 'Issuer, audience, scope — không phải viết mã authorizer.')}
${tl('https://owasp.org/www-project-serverless-top-10/', '🛡️', 'OWASP Serverless Top 10', 'Xác thực hỏng, event injection và các rủi ro serverless khác.')}

<h3>Nguồn</h3>
<ul>
  <li>HTTP API và REST API: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html</a></li>
  <li>Lambda authorizer: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html</a></li>
  <li>JWT authorizer: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html</a></li>
  <li>Hạn mức (10.000 RPS, burst 5.000): <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/limits.html</a></li>
  <li>Concurrency của Lambda: <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/api-gateway/pricing/" target="_blank" rel="noopener">aws.amazon.com/api-gateway/pricing/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>Vụ lộ dữ liệu Optus (2022): <a href="https://en.wikipedia.org/wiki/2022_Optus_data_breach" target="_blank" rel="noopener">en.wikipedia.org/wiki/2022_Optus_data_breach</a></li>
</ul>
</div>
`;
/* ═════ 8.3 — Java/Spring + SnapStart ═════ */
const L83_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 3</span>
<h2>8.3 — Lambda with Java/Spring and SnapStart: measuring the cold start you heard about</h2>
<p class="lead">"Java is too slow for Lambda" is half true, and the half that is true is the <strong>cold start</strong>. This lesson measures it instead of repeating it: the same tiny lookup written three ways — Node.js, plain Java 21, and Spring Cloud Function — run on AWS's own runtime images. Then it explains what SnapStart does about the gap, what it breaks if you are careless, and when a Spring developer should simply pick Fargate (Chapter 7) or Node.js instead.</p>

<h3>The picture: opening a restaurant kitchen versus a food stall</h3>
<p>A food stall (Node.js) opens in a minute: lift the shutter, light the stove. A full restaurant kitchen (Java with Spring) takes much longer each morning: start the ventilation (the JVM), lay out every tool (load classes), let the staff warm up their hands (JIT compilation), read the whole recipe book and assign stations (Spring's application context, dependency injection, auto-configuration). Once open, the kitchen serves fast. Lambda's cold start is "opening for the day" — and with spiky traffic Lambda opens new kitchens often.</p>

<h3>The two Java functions</h3>
<p>Plain Java: a class with a method; the handler string is <code>lab.TraPhong::handleRequest</code>. No framework, no dependencies.</p>
${MA_JTHUAN}
<p>Spring Cloud Function: the business logic is a <code>Function</code> bean; AWS calls the adapter's <code>FunctionInvoker</code>, which starts Spring and routes the event to the bean named in <code>spring.cloud.function.definition</code>. Packaged as one shaded jar (the "aws" classifier).</p>
${MA_JSPRING}
${giai('pom.xml (Spring Boot 3.5.7, Spring Cloud 2025.0.0, maven-shade-plugin)', MA_POM)}

<h3>See it running: three cold starts on the official images</h3>
<p>Each function ran in AWS's runtime image (<code>public.ecr.aws/lambda/nodejs:22</code> or <code>java:21</code>, with the Runtime Interface Emulator), limited to one CPU and told it had 1,769 MB — the size at which Lambda gives one full vCPU. Starting the container is a new execution environment, so call 1 is the cold start; calls 2–4 are warm.</p>
${OUT_83_LANH}
<table>
  <tr><th>Function</th><th>Cold call</th><th>Warm calls</th></tr>
  <tr><td>Node.js 22</td><td>66 ms</td><td>1–2 ms</td></tr>
  <tr><td>Plain Java 21</td><td>241 ms</td><td>1–2 ms</td></tr>
  <tr><td>Spring Cloud Function (Spring Boot 3.5)</td><td>1,641 ms</td><td>2–3 ms</td></tr>
</table>
<ul>
  <li>Warm, all three are equally fast. The difference is entirely in starting up — and Spring's startup is about 25 times Node's here.</li>
  <li>At 128 MB (one-fourteenth of a vCPU) the same start-up would take many seconds: Java functions are usually given 1–2 GB for the CPU, not the memory.</li>
  <li>The RIE folds initialization into the first call (Init Duration 0.03 ms). On AWS the REPORT line shows <code>Init Duration</code> separately, and initialization is billed as duration too.</li>
</ul>

<h3>SnapStart: snapshot the opened kitchen</h3>
<p>With <strong>SnapStart</strong>, Lambda runs your initialization once when you <strong>publish a version</strong>, takes a snapshot of the memory and disk of the initialized micro-VM (Firecracker), encrypts and caches it; a cold start then <strong>restores</strong> the snapshot instead of starting the JVM and Spring from zero. AWS describes the result as startup "as low as sub-second", typically with no code changes.</p>
<ul>
  <li>Supported runtimes (managed runtimes, zip or container image): <strong>Java 11 and later, Python 3.12 and later, .NET 8 and later</strong>.</li>
  <li><strong>Price: for Java managed runtimes there is no additional cost.</strong> For Python and .NET you pay for caching the snapshot and for each restore.</li>
  <li>It works on <strong>published versions</strong> (and aliases pointing to them), not on <code>$LATEST</code>: deploy pipelines must publish a version.</li>
  <li><strong>Priming</strong>: to make the snapshot even warmer, run some real code before the snapshot (for example call your handler with a dummy request so classes load and the JIT starts) — through CRaC runtime hooks <code>beforeCheckpoint</code> / <code>afterRestore</code>.</li>
  <li>The emulator cannot do this: SnapStart is a feature of Lambda's micro-VM platform, so there is nothing to measure locally. Measure on AWS with the <code>Restore Duration</code> in the REPORT line.</li>
</ul>

<h3>🕵️ Hacker corner: what a snapshot copies</h3>
<p>A snapshot copies <strong>everything</strong> in memory at that moment into every environment restored from it. If initialization generated a random value — a seed, a UUID prefix, a token, a cryptographic nonce — every restored copy starts with the <strong>same</strong> value. Unique IDs stop being unique; "random" tokens become predictable across instances. AWS's guidance: generate uniqueness after restore (in <code>afterRestore</code> or inside the handler), use <code>SecureRandom</code> correctly, and re-open network connections and refresh credentials after restore because they may have expired while the snapshot sat in cache.</p>
<p>And a real Java incident on Lambda: <strong>Log4Shell (CVE-2021-44228, December 2021)</strong>. Functions that bundled a vulnerable <code>log4j-core</code> could be taken over by a string in any logged field — an HTTP header, a form value. AWS published a security bulletin and hot-patch tooling, but the fix for a Lambda function is the same as everywhere: rebuild with the patched library and redeploy. Your function's dependencies are your attack surface.</p>

<h3>So: Java on Lambda, or not?</h3>
<ul>
  <li><strong>Java on Lambda is fine</strong> for event processing, queues, schedules and APIs with steady traffic — especially with SnapStart and 1–2 GB of memory.</li>
  <li><strong>Pick Node.js (or Python)</strong> for small, spiky, user-facing APIs where every cold start is seen by a person.</li>
  <li><strong>Keep Spring Boot on Fargate</strong> (Chapter 7) when it is a full application: many endpoints, connection pools, scheduled jobs, steady traffic. One container serves thousands of requests; Lambda would start Spring again for every new concurrent environment.</li>
  <li>Other levers: GraalVM native image (Spring Boot native) starts in tens of milliseconds at the price of a slower, trickier build; a slimmer framework; Provisioned Concurrency (paid by the hour).</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"Why is a Java cold start slow and how do you fix it?"</strong> — JVM start, class loading, JIT, framework initialization. SnapStart (free for Java), more memory for CPU, priming, fewer dependencies, native image, or Provisioned Concurrency.</li>
  <li><strong>"What can go wrong with SnapStart?"</strong> — Uniqueness copied from the snapshot (random seeds, IDs), stale connections and credentials after restore; it needs published versions.</li>
  <li><strong>"Spring Boot on Lambda or on ECS?"</strong> — A full Spring application with steady traffic belongs on ECS/Fargate; single functions or event handlers can go to Lambda with SnapStart.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Rebuild the Spring function, then start its container with <code>--cpus 0.25</code> and <code>AWS_LAMBDA_FUNCTION_MEMORY_SIZE=512</code> (the CPU Lambda gives 512 MB is about 0.29 vCPU) and measure the cold call again.</p>
<p><strong>Done when:</strong> you have the cold-call time at 0.25 CPU next to the 1,641 ms at one CPU, and you can explain in one sentence why Java functions are usually given more memory than they "need".</p>
${giai('Hint', bash(`docker run -d --name aws-c8-lanh-spring -p 127.0.0.1:43882:8080 --cpus 0.25 -m 2g \\
  -e MAIN_CLASS=lab.UngDung -e AWS_LAMBDA_FUNCTION_MEMORY_SIZE=512 -v $PWD/spring:/var/task:ro \\
  public.ecr.aws/lambda/java:21 org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest
curl -s -XPOST 127.0.0.1:43882/2015-03-31/functions/function/invocations -d '{"phong":"A101"}'
docker logs aws-c8-lanh-spring 2>&1 | grep 'REPORT R'
docker rm -f aws-c8-lanh-spring`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>JVM start-up</b><span>Starting the Java virtual machine, loading classes, warming the JIT.</span></div>
  <div><b>Spring Cloud Function</b><span>Write business logic as Function beans; adapters run them on Lambda and other platforms.</span></div>
  <div><b>FunctionInvoker</b><span>The AWS adapter's handler that starts Spring and routes events.</span></div>
  <div><b>SnapStart</b><span>Snapshot of an initialized environment, restored on cold start.</span></div>
  <div><b>Priming</b><span>Running code before the snapshot so more is already warm.</span></div>
  <div><b>CRaC hooks</b><span>beforeCheckpoint / afterRestore callbacks around the snapshot.</span></div>
  <div><b>Provisioned Concurrency</b><span>Environments kept initialized all the time, paid per hour.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Measured on AWS's runtime images at 1 vCPU: Node.js 66 ms, plain Java 241 ms, Spring Cloud Function 1,641 ms cold; all 1–3 ms warm.</li>
  <li>SnapStart restores a snapshot of the initialized environment; free for Java, needs published versions.</li>
  <li>Snapshots copy randomness and connections — regenerate them after restore.</li>
  <li>Full Spring applications usually belong on Fargate; small spiky APIs on Node.js Lambda.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html', '📸', 'AWS — Improving startup performance with SnapStart', 'Supported runtimes, pricing, uniqueness, monitoring.')}
${tl('https://docs.spring.io/spring-cloud-function/reference/adapters/aws-intro.html', '🍃', 'Spring — Spring Cloud Function AWS adapter', 'FunctionInvoker, packaging, routing.')}

<h3>Sources</h3>
<ul>
  <li>SnapStart: <a href="https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/snapstart.html</a></li>
  <li>SnapStart runtime hooks for Java: <a href="https://docs.aws.amazon.com/lambda/latest/dg/snapstart-runtime-hooks-java.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/snapstart-runtime-hooks-java.html</a></li>
  <li>Spring Cloud Function on AWS: <a href="https://docs.spring.io/spring-cloud-function/reference/adapters/aws-intro.html" target="_blank" rel="noopener">docs.spring.io/spring-cloud-function/reference/adapters/aws-intro.html</a></li>
  <li>Testing container images locally (RIE): <a href="https://docs.aws.amazon.com/lambda/latest/dg/images-test.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/images-test.html</a></li>
  <li>AWS security bulletin, Log4j (AWS-2021-006): <a href="https://aws.amazon.com/security/security-bulletins/AWS-2021-006/" target="_blank" rel="noopener">aws.amazon.com/security/security-bulletins/AWS-2021-006/</a></li>
</ul>
</div>
`;
const L83_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 3</span>
<h2>8.3 — Lambda bằng Java/Spring và SnapStart: đo cái cold start bạn vẫn nghe kể</h2>
<p class="lead">"Java quá chậm cho Lambda" đúng một nửa, và nửa đúng đó là <strong>cold start</strong>. Bài này đo nó thay vì nhắc lại: cùng một việc tra cứu nhỏ viết theo ba cách — Node.js, Java 21 thuần, và Spring Cloud Function — chạy trên chính ảnh runtime của AWS. Rồi giải thích SnapStart làm gì với khoảng chênh đó, nó làm hỏng gì nếu bạn bất cẩn, và khi nào một lập trình viên Spring nên chọn thẳng Fargate (Chương 7) hoặc Node.js.</p>

<h3>Liên tưởng: mở bếp nhà hàng và mở xe bán đồ ăn</h3>
<p>Một xe bán đồ ăn (Node.js) mở hàng trong một phút: kéo cửa, bật bếp. Một bếp nhà hàng đầy đủ (Java với Spring) mỗi sáng mở lâu hơn nhiều: bật hệ thống hút khói (JVM), bày mọi dụng cụ (nạp class), để đầu bếp làm nóng tay (biên dịch JIT), đọc cả cuốn công thức và phân việc từng vị trí (application context, dependency injection, auto-configuration của Spring). Mở xong thì bếp phục vụ rất nhanh. Cold start của Lambda chính là "mở hàng đầu ngày" — và với lưu lượng gai góc, Lambda phải mở bếp mới khá thường xuyên.</p>

<h3>Hai hàm Java</h3>
<p>Java thuần: một class có một phương thức; chuỗi handler là <code>lab.TraPhong::handleRequest</code>. Không framework, không thư viện.</p>
${MA_JTHUAN}
<p>Spring Cloud Function: logic nghiệp vụ là một bean <code>Function</code>; AWS gọi <code>FunctionInvoker</code> của adapter, nó khởi động Spring rồi chuyển sự kiện tới bean có tên trong <code>spring.cloud.function.definition</code>. Đóng thành một jar "shaded" duy nhất (classifier "aws").</p>
${MA_JSPRING}
${giai('pom.xml (Spring Boot 3.5.7, Spring Cloud 2025.0.0, maven-shade-plugin)', MA_POM)}

<h3>Xem chạy: ba lần cold start trên ảnh chính hãng</h3>
<p>Mỗi hàm chạy trong ảnh runtime của AWS (<code>public.ecr.aws/lambda/nodejs:22</code> hoặc <code>java:21</code>, kèm Runtime Interface Emulator), giới hạn một CPU và được báo là có 1.769 MB — mức mà Lambda cấp trọn một vCPU. Khởi động container là một môi trường thực thi mới, nên lần gọi 1 là cold start; lần 2–4 là ấm.</p>
${OUT_83_LANH}
<table>
  <tr><th>Hàm</th><th>Lần gọi lạnh</th><th>Lần gọi ấm</th></tr>
  <tr><td>Node.js 22</td><td>66 ms</td><td>1–2 ms</td></tr>
  <tr><td>Java 21 thuần</td><td>241 ms</td><td>1–2 ms</td></tr>
  <tr><td>Spring Cloud Function (Spring Boot 3.5)</td><td>1.641 ms</td><td>2–3 ms</td></tr>
</table>
<ul>
  <li>Khi ấm, cả ba nhanh như nhau. Khác biệt nằm trọn ở lúc khởi động — và khởi động của Spring ở đây gấp khoảng 25 lần Node.</li>
  <li>Ở 128 MB (một phần mười bốn vCPU), cùng màn khởi động đó sẽ mất nhiều giây: hàm Java thường được cấp 1–2 GB là vì CPU, không phải vì bộ nhớ.</li>
  <li>RIE gộp phần khởi tạo vào lần gọi đầu (Init Duration 0.03 ms). Trên AWS, dòng REPORT ghi <code>Init Duration</code> riêng, và phần khởi tạo cũng bị tính tiền như thời gian chạy.</li>
</ul>

<h3>SnapStart: chụp ảnh căn bếp đã mở</h3>
<p>Với <strong>SnapStart</strong>, Lambda chạy phần khởi tạo của bạn một lần lúc bạn <strong>publish một version</strong>, chụp snapshot bộ nhớ và ổ đĩa của micro-VM (Firecracker) đã khởi tạo, mã hoá và cache nó; khi cold start, Lambda <strong>khôi phục</strong> snapshot thay vì khởi động JVM và Spring từ đầu. AWS mô tả kết quả là khởi động "có thể dưới một giây", thường không phải sửa mã.</p>
<ul>
  <li>Runtime hỗ trợ (runtime được quản lý, dạng zip hoặc container image): <strong>Java 11 trở lên, Python 3.12 trở lên, .NET 8 trở lên</strong>.</li>
  <li><strong>Giá: với runtime Java được quản lý, không tốn thêm tiền.</strong> Với Python và .NET, bạn trả tiền cache snapshot và mỗi lần khôi phục.</li>
  <li>Nó chạy trên <strong>version đã publish</strong> (và alias trỏ tới version đó), không chạy trên <code>$LATEST</code>: pipeline deploy phải publish version.</li>
  <li><strong>Priming</strong>: để snapshot ấm hơn nữa, chạy một ít mã thật trước khi chụp (ví dụ gọi handler với một yêu cầu giả để class được nạp và JIT bắt đầu) — qua runtime hook CRaC <code>beforeCheckpoint</code> / <code>afterRestore</code>.</li>
  <li>Trình giả lập không làm được việc này: SnapStart là tính năng của nền micro-VM của Lambda, nên ở máy không có gì để đo. Đo trên AWS bằng <code>Restore Duration</code> trong dòng REPORT.</li>
</ul>

<h3>🕵️ Góc hacker: snapshot chép những gì</h3>
<p>Một snapshot chép <strong>mọi thứ</strong> đang nằm trong bộ nhớ lúc chụp vào mọi môi trường được khôi phục từ nó. Nếu phần khởi tạo sinh một giá trị ngẫu nhiên — seed, tiền tố UUID, token, nonce mật mã — mọi bản khôi phục đều bắt đầu với <strong>cùng</strong> giá trị đó. ID duy nhất không còn duy nhất; token "ngẫu nhiên" trở nên đoán được giữa các instance. Hướng dẫn của AWS: sinh tính duy nhất sau khi khôi phục (trong <code>afterRestore</code> hoặc trong handler), dùng <code>SecureRandom</code> đúng cách, và mở lại kết nối mạng, làm mới khoá truy cập sau khi khôi phục vì chúng có thể đã hết hạn trong lúc snapshot nằm trong cache.</p>
<p>Và một sự cố Java thật trên Lambda: <strong>Log4Shell (CVE-2021-44228, tháng 12/2021)</strong>. Hàm nào đóng gói <code>log4j-core</code> bị lỗi có thể bị chiếm chỉ bằng một chuỗi trong bất kỳ trường nào được ghi log — một header HTTP, một giá trị form. AWS ra bản tin bảo mật và công cụ vá nóng, nhưng cách sửa cho một hàm Lambda giống mọi nơi khác: dựng lại với thư viện đã vá rồi deploy lại. Thư viện của hàm chính là bề mặt tấn công của nó.</p>

<h3>Vậy: Java trên Lambda, hay không?</h3>
<ul>
  <li><strong>Java trên Lambda ổn</strong> cho xử lý sự kiện, hàng đợi, lịch chạy và API có lưu lượng đều — nhất là khi có SnapStart và 1–2 GB bộ nhớ.</li>
  <li><strong>Chọn Node.js (hoặc Python)</strong> cho API nhỏ, lưu lượng gai góc, phục vụ người dùng, nơi mỗi lần cold start đều có người nhìn thấy.</li>
  <li><strong>Giữ Spring Boot trên Fargate</strong> (Chương 7) khi nó là một ứng dụng đầy đủ: nhiều endpoint, connection pool, việc định kỳ, lưu lượng đều. Một container phục vụ hàng nghìn yêu cầu; Lambda thì khởi động lại Spring cho mỗi môi trường đồng thời mới.</li>
  <li>Các lựa chọn khác: GraalVM native image (Spring Boot native) khởi động trong vài chục mili giây, đổi lại build chậm và khó hơn; framework gọn hơn; Provisioned Concurrency (trả tiền theo giờ).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Vì sao cold start Java chậm, sửa thế nào?"</strong> — Khởi động JVM, nạp class, JIT, khởi tạo framework. SnapStart (miễn phí với Java), thêm bộ nhớ để có CPU, priming, bớt thư viện, native image, hoặc Provisioned Concurrency.</li>
  <li><strong>"SnapStart có thể gây lỗi gì?"</strong> — Tính duy nhất bị chép từ snapshot (seed ngẫu nhiên, ID), kết nối và khoá truy cập cũ sau khi khôi phục; và nó cần version đã publish.</li>
  <li><strong>"Spring Boot nên chạy trên Lambda hay ECS?"</strong> — Ứng dụng Spring đầy đủ với lưu lượng đều nên ở ECS/Fargate; từng hàm lẻ hay bộ xử lý sự kiện có thể lên Lambda kèm SnapStart.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Dựng lại hàm Spring, rồi khởi động container của nó với <code>--cpus 0.25</code> và <code>AWS_LAMBDA_FUNCTION_MEMORY_SIZE=512</code> (CPU mà Lambda cấp cho 512 MB khoảng 0,29 vCPU) và đo lại lần gọi lạnh.</p>
<p><strong>Đạt khi:</strong> bạn có thời gian lần gọi lạnh ở 0,25 CPU đặt cạnh con số 1.641 ms ở một CPU, và giải thích được trong một câu vì sao hàm Java thường được cấp nhiều bộ nhớ hơn mức nó "cần".</p>
${giai('Gợi ý', bash(`docker run -d --name aws-c8-lanh-spring -p 127.0.0.1:43882:8080 --cpus 0.25 -m 2g \\
  -e MAIN_CLASS=lab.UngDung -e AWS_LAMBDA_FUNCTION_MEMORY_SIZE=512 -v $PWD/spring:/var/task:ro \\
  public.ecr.aws/lambda/java:21 org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest
curl -s -XPOST 127.0.0.1:43882/2015-03-31/functions/function/invocations -d '{"phong":"A101"}'
docker logs aws-c8-lanh-spring 2>&1 | grep 'REPORT R'
docker rm -f aws-c8-lanh-spring`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Khởi động JVM</b><span>Khởi động máy ảo Java, nạp class, làm nóng JIT.</span></div>
  <div><b>Spring Cloud Function</b><span>Viết logic nghiệp vụ thành bean Function; adapter chạy chúng trên Lambda và nền tảng khác.</span></div>
  <div><b>FunctionInvoker</b><span>Handler của adapter AWS, khởi động Spring và chuyển sự kiện.</span></div>
  <div><b>SnapStart</b><span>Snapshot của môi trường đã khởi tạo, được khôi phục khi cold start.</span></div>
  <div><b>Priming</b><span>Chạy mã trước khi chụp để nhiều thứ đã ấm sẵn.</span></div>
  <div><b>CRaC hook</b><span>Callback beforeCheckpoint / afterRestore quanh lúc chụp snapshot.</span></div>
  <div><b>Provisioned Concurrency</b><span>Môi trường luôn được khởi tạo sẵn, trả tiền theo giờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đo trên ảnh runtime của AWS ở 1 vCPU: Node.js 66 ms, Java thuần 241 ms, Spring Cloud Function 1.641 ms khi lạnh; khi ấm đều 1–3 ms.</li>
  <li>SnapStart khôi phục snapshot của môi trường đã khởi tạo; miễn phí với Java, cần version đã publish.</li>
  <li>Snapshot chép cả tính ngẫu nhiên và kết nối — sinh lại chúng sau khi khôi phục.</li>
  <li>Ứng dụng Spring đầy đủ thường thuộc về Fargate; API nhỏ, gai góc thì Lambda Node.js.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html', '📸', 'AWS — Tăng tốc khởi động bằng SnapStart', 'Runtime hỗ trợ, giá, tính duy nhất, giám sát.')}
${tl('https://docs.spring.io/spring-cloud-function/reference/adapters/aws-intro.html', '🍃', 'Spring — Adapter AWS của Spring Cloud Function', 'FunctionInvoker, đóng gói, định tuyến.')}

<h3>Nguồn</h3>
<ul>
  <li>SnapStart: <a href="https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/snapstart.html</a></li>
  <li>Runtime hook SnapStart cho Java: <a href="https://docs.aws.amazon.com/lambda/latest/dg/snapstart-runtime-hooks-java.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/snapstart-runtime-hooks-java.html</a></li>
  <li>Spring Cloud Function trên AWS: <a href="https://docs.spring.io/spring-cloud-function/reference/adapters/aws-intro.html" target="_blank" rel="noopener">docs.spring.io/spring-cloud-function/reference/adapters/aws-intro.html</a></li>
  <li>Thử container image ở máy (RIE): <a href="https://docs.aws.amazon.com/lambda/latest/dg/images-test.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/images-test.html</a></li>
  <li>Bản tin bảo mật AWS về Log4j (AWS-2021-006): <a href="https://aws.amazon.com/security/security-bulletins/AWS-2021-006/" target="_blank" rel="noopener">aws.amazon.com/security/security-bulletins/AWS-2021-006/</a></li>
</ul>
</div>
`;
/* ═════ 8.4 — Khi nào serverless ═════ */
const L84_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 4</span>
<h2>8.4 — When serverless is (not) a good idea: the break-even point and the loop that bills itself</h2>
<p class="lead">Serverless is not cheaper or more expensive in general; it is cheaper <em>at some traffic shapes</em> and dangerous <em>with some bugs</em>. This lesson computes, with real Singapore prices, where Lambda + API Gateway stops being cheaper than Fargate for LabFlow's API, then runs a real infinite loop — a function triggering itself through S3 — to show what "pay per request" means when the requests come from your own bug.</p>

<h3>The picture: taxi or your own car</h3>
<p>If you go out twice a week, a taxi is far cheaper than owning a car: no insurance, no parking, no car sitting idle. If you drive two hours every day, owning wins. Lambda is the taxi — per trip, zero when idle; Fargate/EC2 is the car — a fixed monthly cost, whatever you use. And a taxi meter has one more risk: if someone keeps the meter running all night by mistake, you pay for the whole night.</p>

<h3>See it running (1): the break-even point, with real prices</h3>
${MA_GIA}
${OUT_84_GIA}
<ul>
  <li>Up to a few million requests a month, Lambda + HTTP API costs a few dollars; the two Fargate tasks behind an ALB cost about 69 USD whether anyone calls or not.</li>
  <li>The lines cross around <strong>42 million requests a month — about 16 requests per second on average</strong>, under these assumptions (50 ms, 256 MB, x86). Faster code or ARM (20% cheaper compute) moves the point higher; heavier functions move it lower.</li>
  <li>With a REST API (4.25 USD/million) the crossing comes much earlier, around 15 million requests.</li>
  <li>Not in the table: the <strong>Free Tier</strong> (1 million requests and 400,000 GB-seconds of Lambda each month), the cost of your time to operate servers, CloudWatch Logs (often the surprise on busy functions), and RDS connections (a busy Lambda API usually needs <strong>RDS Proxy</strong>, an extra hourly cost).</li>
</ul>

<h3>See it running (2): a function that calls itself through S3</h3>
<p>The intention: every uploaded photo gets a thumbnail. The bug: the thumbnail is written to the <strong>same bucket</strong>, which fires the same "object created" event, which runs the function again.</p>
${MA_VONGLAP}
${OUT_84_VONGLAP}
<ul>
  <li>One upload, then 388 objects after 15 seconds and 2,150 after a minute — every object is one request, one function run, one PUT and one more event.</li>
  <li>Stopping it: <code>put-function-concurrency 0</code> blocks every new run of the function immediately; removing the bucket notification cuts the trigger. After that the count stays at 2,266.</li>
  <li><strong>LocalStack differs:</strong> it has no recursive loop detection. On AWS, Lambda detects loops between functions and <strong>Amazon SQS, Amazon S3, Amazon SNS and EventBridge custom event buses</strong> (when the function uses a supported AWS SDK version): after about 16 invocations in the same chain it stops the next one and notifies you. Loops through anything else — a DynamoDB stream, an HTTP call to your own API, another queue system — are not detected.</li>
  <li>Prevention: write outputs to a different bucket (or a prefix the notification filter excludes), set reserved concurrency on every event-driven function, and keep the Budget alarm from Section 0 switched on.</li>
</ul>

<h3>🕵️ A real bill: 72,000 USD overnight (2020)</h3>
<p>Not AWS, but the same mechanics. In December 2020 The Register reported how Sudeep Chauhan, founder of the startup Milkie Way, ran a test on Google Cloud — a crawler on Cloud Run whose buggy code kept generating more work for itself — with a <strong>7 USD</strong> billing budget and a free database plan. Within about two hours the bill settled a little short of <strong>72,000 USD</strong>. A budget only sends alerts; it does not stop anything. On AWS the brakes that actually stop spending are: reserved concurrency (a hard cap), recursive loop detection (for the supported services), Budgets actions that can apply a deny policy, and a <strong>kill switch</strong> you have tested — <code>put-function-concurrency 0</code> is one command.</p>

<h3>Good fits and bad fits</h3>
<table>
  <tr><th>Serverless fits well</th><th>Think twice</th></tr>
  <tr><td>Spiky or low traffic: internal tools, webhooks, a student project, nightly jobs</td><td>Steady high traffic (above the break-even point) — containers are cheaper</td></tr>
  <tr><td>Event glue: S3 upload ⇒ resize, SQS message ⇒ process, schedule ⇒ report</td><td>Long work (&gt; 15 minutes), long-lived connections (WebSocket servers, streaming)</td></tr>
  <tr><td>Teams that want no servers to patch and scale-to-zero environments (preview per pull request)</td><td>Latency-critical APIs that cannot tolerate cold starts, unless you pay for Provisioned Concurrency</td></tr>
  <tr><td>Work that parallelizes naturally (1,000 files ⇒ 1,000 invocations)</td><td>Heavy relational access without RDS Proxy; big Spring applications; GPU work</td></tr>
</table>
<p><strong>Lock-in</strong> is real but smaller than it looks if you keep business logic in plain modules and only the handler knows about Lambda events — the same code can then run in an Express server on Fargate. The deeper lock-in is in the glue: IAM, event formats, Step Functions, EventBridge rules.</p>

<h3>A decision path for LabFlow</h3>
<ol>
  <li>How many requests per second on average, and how spiky? Below about 15 per second average with idle nights ⇒ Lambda is cheaper.</li>
  <li>Any request longer than 15 minutes, or long-lived connections? ⇒ containers.</li>
  <li>Does the language start fast (Node.js, Python, Go) or can you use SnapStart? If not, and latency matters ⇒ containers.</li>
  <li>How does it reach the database? PostgreSQL needs RDS Proxy at scale; DynamoDB fits Lambda naturally.</li>
  <li>Who operates it? A small team with no ops time leans serverless.</li>
</ol>
<p>The honest answer for LabFlow: the core booking API (Spring Boot or Express, steady daytime traffic, PostgreSQL) on <strong>Fargate</strong>; event-driven side jobs — thumbnails, e-mail reminders, nightly reports, the audit-log writer — on <strong>Lambda</strong>. Chapter 9 connects them with SQS, SNS and EventBridge.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"When would you not use Lambda?"</strong> — Steady high traffic above the break-even point, work over 15 minutes, long-lived connections, strict latency with slow-starting runtimes, heavy relational access without RDS Proxy.</li>
  <li><strong>"A function is calling itself and the bill is climbing. What do you do in the first minute?"</strong> — Set its reserved concurrency to 0, remove the trigger, then find the loop; afterwards add concurrency limits, separate output locations and budget alarms.</li>
  <li><strong>"Is serverless cheaper?"</strong> — It depends on the traffic shape: compute the break-even with real prices, and include logs, data transfer, RDS Proxy and people's time.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Change <code>84-gia.mjs</code>: ARM prices, 120 ms per request, 512 MB, and a single Fargate task (no high availability) without ALB.</p>
<p><strong>Done when:</strong> you have the new break-even point in requests per second and one sentence on why the single-task comparison is unfair to Fargate (or to Lambda).</p>
${giai('Hint', js(`const ms = 120, mb = 512;                 // heavier function
const L_GBS = 0.0000133334;               // ARM price per GB-second
const FARGATE = 1 * 730 * (0.5 * 0.05056 + 1 * 0.00553), ALB = 0;
// single task: no second AZ ⇒ not comparable in availability; Lambda is multi-AZ by default`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Break-even point</b><span>Traffic at which pay-per-request equals a fixed monthly cost.</span></div>
  <div><b>Recursive loop</b><span>A function whose output triggers itself again.</span></div>
  <div><b>Recursive loop detection</b><span>Lambda stops a chain after about 16 calls through SQS, S3, SNS or EventBridge.</span></div>
  <div><b>Kill switch</b><span>Reserved concurrency 0: no new runs of the function.</span></div>
  <div><b>RDS Proxy</b><span>Connection pool in front of RDS for many short-lived Lambda connections.</span></div>
  <div><b>Lock-in</b><span>Cost of moving away from a provider's services and formats.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>With real Singapore prices, Lambda + HTTP API beats two Fargate tasks + ALB below about 42 million requests a month (~16 per second).</li>
  <li>A function writing to its own trigger made 2,150 objects in a minute; AWS detects such loops only through SQS, S3, SNS and EventBridge.</li>
  <li>Brakes: reserved concurrency, separate outputs, budgets — and a tested kill switch.</li>
  <li>LabFlow: core API on Fargate, event-driven side jobs on Lambda.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html', '🔁', 'AWS — Recursive loop detection', 'Which services and SDKs are covered, and how to respond.')}
${tl('https://www.theregister.com/2020/12/10/google_cloud_over_run/', '💸', 'The Register — 72,000 USD overnight (2020)', 'A runaway Cloud Run test and a budget that only sent alerts.')}

<h3>Sources</h3>
<ul>
  <li>Recursive loop detection: <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html</a></li>
  <li>Lambda pricing and Free Tier: <a href="https://aws.amazon.com/lambda/pricing/" target="_blank" rel="noopener">aws.amazon.com/lambda/pricing/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>API Gateway pricing: <a href="https://aws.amazon.com/api-gateway/pricing/" target="_blank" rel="noopener">aws.amazon.com/api-gateway/pricing/</a></li>
  <li>Lambda concurrency (reserved concurrency): <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html</a></li>
  <li>Milkie Way, 72,000 USD (The Register, 10/12/2020): <a href="https://www.theregister.com/2020/12/10/google_cloud_over_run/" target="_blank" rel="noopener">theregister.com/2020/12/10/google_cloud_over_run/</a></li>
</ul>
</div>
`;
const L84_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 4</span>
<h2>8.4 — Khi nào serverless (không) hợp: điểm hoà vốn và vòng lặp tự tính tiền</h2>
<p class="lead">Serverless không rẻ hơn hay đắt hơn một cách chung chung; nó rẻ hơn <em>với một số dạng lưu lượng</em> và nguy hiểm <em>với một số lỗi</em>. Bài này tính, bằng giá Singapore thật, xem ở mức nào Lambda + API Gateway hết rẻ hơn Fargate cho API của LabFlow, rồi chạy một vòng lặp vô hạn thật — một hàm tự kích hoạt lại chính nó qua S3 — để thấy "trả tiền theo yêu cầu" nghĩa là gì khi yêu cầu đến từ chính lỗi của bạn.</p>

<h3>Liên tưởng: đi taxi hay mua xe</h3>
<p>Nếu tuần ra đường hai lần, đi taxi rẻ hơn hẳn nuôi một chiếc xe: không bảo hiểm, không chỗ đỗ, không xe nằm không. Nếu ngày nào cũng lái hai tiếng, mua xe thắng. Lambda là taxi — tính theo chuyến, không đi thì không mất; Fargate/EC2 là xe riêng — chi phí cố định mỗi tháng, đi hay không cũng vậy. Và đồng hồ taxi có thêm một rủi ro: lỡ để đồng hồ chạy cả đêm, bạn trả tiền cả đêm.</p>

<h3>Xem chạy (1): điểm hoà vốn, bằng giá thật</h3>
${MA_GIA}
${OUT_84_GIA}
<ul>
  <li>Tới vài triệu yêu cầu mỗi tháng, Lambda + HTTP API tốn vài đô; hai task Fargate sau ALB tốn khoảng 69 USD dù có ai gọi hay không.</li>
  <li>Hai đường cắt nhau quanh <strong>42 triệu yêu cầu mỗi tháng — trung bình khoảng 16 yêu cầu mỗi giây</strong>, với giả định này (50 ms, 256 MB, x86). Mã nhanh hơn hoặc ARM (rẻ hơn 20% phần tính toán) đẩy điểm đó lên cao; hàm nặng hơn kéo nó xuống.</li>
  <li>Với REST API (4,25 USD/triệu), điểm cắt tới sớm hơn nhiều, quanh 15 triệu yêu cầu.</li>
  <li>Chưa có trong bảng: <strong>Free Tier</strong> (mỗi tháng 1 triệu yêu cầu và 400.000 GB-giây Lambda), chi phí thời gian của bạn để vận hành máy chủ, CloudWatch Logs (thường là khoản bất ngờ với hàm bận), và kết nối RDS (một API Lambda bận thường cần <strong>RDS Proxy</strong>, thêm một khoản tính theo giờ).</li>
</ul>

<h3>Xem chạy (2): một hàm tự gọi lại chính nó qua S3</h3>
<p>Ý định: mỗi ảnh tải lên có một ảnh thu nhỏ. Lỗi: ảnh thu nhỏ được ghi vào <strong>cùng bucket</strong>, làm bắn đúng sự kiện "có object mới" đó, và hàm lại chạy.</p>
${MA_VONGLAP}
${OUT_84_VONGLAP}
<ul>
  <li>Một lần tải lên, rồi 388 object sau 15 giây và 2.150 sau một phút — mỗi object là một yêu cầu, một lần chạy hàm, một lệnh PUT và thêm một sự kiện.</li>
  <li>Dừng lại: <code>put-function-concurrency 0</code> chặn ngay mọi lần chạy mới của hàm; gỡ thông báo của bucket là cắt nguồn kích hoạt. Sau đó con số đứng yên ở 2.266.</li>
  <li><strong>LocalStack khác AWS:</strong> nó không có recursive loop detection. Trên AWS, Lambda phát hiện vòng lặp giữa các hàm với <strong>Amazon SQS, Amazon S3, Amazon SNS và EventBridge custom event bus</strong> (khi hàm dùng phiên bản AWS SDK được hỗ trợ): sau khoảng 16 lần gọi trong cùng một chuỗi, nó chặn lần kế tiếp và báo cho bạn. Vòng lặp đi qua thứ khác — DynamoDB stream, lời gọi HTTP vào chính API của bạn, một hệ hàng đợi khác — thì không được phát hiện.</li>
  <li>Phòng ngừa: ghi kết quả sang bucket khác (hoặc một tiền tố mà bộ lọc thông báo loại ra), đặt reserved concurrency cho mọi hàm chạy theo sự kiện, và giữ cảnh báo Budget từ Mục 0 luôn bật.</li>
</ul>

<h3>🕵️ Một hoá đơn thật: 72.000 USD qua một đêm (2020)</h3>
<p>Không phải AWS, nhưng cùng một cơ chế. Tháng 12/2020, The Register kể chuyện Sudeep Chauhan, nhà sáng lập startup Milkie Way, chạy thử trên Google Cloud — một trình thu thập trang trên Cloud Run mà mã lỗi cứ tự sinh thêm việc cho chính nó — với ngân sách <strong>7 USD</strong> và gói cơ sở dữ liệu miễn phí. Trong khoảng hai giờ, hoá đơn dừng ở mức gần <strong>72.000 USD</strong>. Ngân sách chỉ gửi cảnh báo; nó không dừng thứ gì cả. Trên AWS, những cái phanh thật sự dừng được chi tiêu là: reserved concurrency (trần cứng), recursive loop detection (với các dịch vụ được hỗ trợ), Budgets action có thể gắn một policy từ chối, và một <strong>công tắc ngắt</strong> bạn đã thử — <code>put-function-concurrency 0</code> chỉ là một lệnh.</p>

<h3>Hợp và không hợp</h3>
<table>
  <tr><th>Serverless rất hợp</th><th>Cân nhắc kỹ</th></tr>
  <tr><td>Lưu lượng gai góc hoặc thấp: công cụ nội bộ, webhook, đồ án sinh viên, việc chạy đêm</td><td>Lưu lượng đều và cao (trên điểm hoà vốn) — container rẻ hơn</td></tr>
  <tr><td>Keo nối sự kiện: S3 tải lên ⇒ thu nhỏ ảnh, tin SQS ⇒ xử lý, lịch ⇒ báo cáo</td><td>Việc dài (&gt; 15 phút), kết nối giữ lâu (máy chủ WebSocket, streaming)</td></tr>
  <tr><td>Nhóm không muốn vá máy chủ, muốn môi trường co về 0 (bản xem trước cho mỗi pull request)</td><td>API cần độ trễ cực thấp, không chịu được cold start, trừ khi trả tiền Provisioned Concurrency</td></tr>
  <tr><td>Việc tự nhiên chia song song được (1.000 tệp ⇒ 1.000 lần gọi)</td><td>Truy cập cơ sở dữ liệu quan hệ nặng mà không có RDS Proxy; ứng dụng Spring lớn; việc cần GPU</td></tr>
</table>
<p><strong>Khoá nhà cung cấp</strong> là có thật, nhưng nhỏ hơn vẻ ngoài nếu bạn giữ logic nghiệp vụ trong module thường và chỉ handler biết về sự kiện Lambda — khi đó cùng mã đó chạy được trong một máy chủ Express trên Fargate. Khoá sâu hơn nằm ở phần keo: IAM, định dạng sự kiện, Step Functions, luật EventBridge.</p>

<h3>Đường quyết định cho LabFlow</h3>
<ol>
  <li>Trung bình bao nhiêu yêu cầu mỗi giây, gai góc cỡ nào? Dưới khoảng 15 yêu cầu mỗi giây trung bình, đêm vắng ⇒ Lambda rẻ hơn.</li>
  <li>Có yêu cầu nào dài hơn 15 phút, hay kết nối giữ lâu? ⇒ container.</li>
  <li>Ngôn ngữ có khởi động nhanh (Node.js, Python, Go) hoặc dùng được SnapStart không? Nếu không, mà độ trễ quan trọng ⇒ container.</li>
  <li>Nó nói chuyện với cơ sở dữ liệu thế nào? PostgreSQL cần RDS Proxy khi lớn; DynamoDB hợp Lambda một cách tự nhiên.</li>
  <li>Ai vận hành? Nhóm nhỏ không có thời gian vận hành nghiêng về serverless.</li>
</ol>
<p>Câu trả lời trung thực cho LabFlow: API đặt lịch cốt lõi (Spring Boot hoặc Express, lưu lượng đều ban ngày, PostgreSQL) chạy trên <strong>Fargate</strong>; các việc phụ chạy theo sự kiện — ảnh thu nhỏ, email nhắc lịch, báo cáo đêm, bộ ghi nhật ký kiểm toán — chạy trên <strong>Lambda</strong>. Chương 9 nối chúng bằng SQS, SNS và EventBridge.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Khi nào bạn không dùng Lambda?"</strong> — Lưu lượng đều và cao trên điểm hoà vốn, việc dài hơn 15 phút, kết nối giữ lâu, yêu cầu độ trễ khắt khe với runtime khởi động chậm, truy cập cơ sở dữ liệu quan hệ nặng mà không có RDS Proxy.</li>
  <li><strong>"Một hàm đang tự gọi lại mình và hoá đơn đang tăng. Phút đầu tiên bạn làm gì?"</strong> — Đặt reserved concurrency của nó về 0, gỡ nguồn kích hoạt, rồi mới tìm vòng lặp; sau đó thêm giới hạn concurrency, tách nơi ghi kết quả và cảnh báo ngân sách.</li>
  <li><strong>"Serverless có rẻ hơn không?"</strong> — Tuỳ dạng lưu lượng: tính điểm hoà vốn bằng giá thật, và tính cả log, truyền dữ liệu, RDS Proxy và thời gian của con người.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Sửa <code>84-gia.mjs</code>: giá ARM, 120 ms mỗi yêu cầu, 512 MB, và chỉ một task Fargate (không sẵn sàng cao) không có ALB.</p>
<p><strong>Đạt khi:</strong> bạn có điểm hoà vốn mới tính bằng yêu cầu mỗi giây, và một câu giải thích vì sao so với một task duy nhất là không công bằng với Fargate (hoặc với Lambda).</p>
${giai('Gợi ý', js(`const ms = 120, mb = 512;                 // hàm nặng hơn
const L_GBS = 0.0000133334;               // giá ARM mỗi GB-giây
const FARGATE = 1 * 730 * (0.5 * 0.05056 + 1 * 0.00553), ALB = 0;
// một task: không có AZ thứ hai ⇒ không ngang nhau về sẵn sàng; Lambda mặc định chạy nhiều AZ`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Điểm hoà vốn</b><span>Mức lưu lượng mà trả theo yêu cầu bằng chi phí cố định hằng tháng.</span></div>
  <div><b>Vòng lặp đệ quy</b><span>Hàm mà kết quả của nó lại kích hoạt chính nó.</span></div>
  <div><b>Recursive loop detection</b><span>Lambda chặn một chuỗi sau khoảng 16 lần gọi qua SQS, S3, SNS hoặc EventBridge.</span></div>
  <div><b>Công tắc ngắt</b><span>Reserved concurrency 0: không còn lần chạy mới nào của hàm.</span></div>
  <div><b>RDS Proxy</b><span>Bể kết nối đứng trước RDS cho rất nhiều kết nối ngắn của Lambda.</span></div>
  <div><b>Khoá nhà cung cấp</b><span>Cái giá phải trả để rời khỏi dịch vụ và định dạng của một nhà cung cấp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Với giá Singapore thật, Lambda + HTTP API rẻ hơn hai task Fargate + ALB khi dưới khoảng 42 triệu yêu cầu mỗi tháng (~16 mỗi giây).</li>
  <li>Một hàm ghi vào chính nguồn kích hoạt của nó tạo 2.150 object trong một phút; AWS chỉ phát hiện vòng lặp kiểu này qua SQS, S3, SNS và EventBridge.</li>
  <li>Phanh: reserved concurrency, tách nơi ghi kết quả, ngân sách — và một công tắc ngắt đã thử.</li>
  <li>LabFlow: API cốt lõi trên Fargate, việc phụ chạy theo sự kiện trên Lambda.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html', '🔁', 'AWS — Phát hiện vòng lặp đệ quy', 'Dịch vụ và SDK nào được hỗ trợ, và cách xử lý.')}
${tl('https://www.theregister.com/2020/12/10/google_cloud_over_run/', '💸', 'The Register — 72.000 USD qua một đêm (2020)', 'Một phép thử Cloud Run mất kiểm soát và ngân sách chỉ biết gửi cảnh báo.')}

<h3>Nguồn</h3>
<ul>
  <li>Phát hiện vòng lặp đệ quy: <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html</a></li>
  <li>Giá Lambda và Free Tier: <a href="https://aws.amazon.com/lambda/pricing/" target="_blank" rel="noopener">aws.amazon.com/lambda/pricing/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>Giá API Gateway: <a href="https://aws.amazon.com/api-gateway/pricing/" target="_blank" rel="noopener">aws.amazon.com/api-gateway/pricing/</a></li>
  <li>Concurrency của Lambda (reserved concurrency): <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html</a></li>
  <li>Milkie Way, 72.000 USD (The Register, 10/12/2020): <a href="https://www.theregister.com/2020/12/10/google_cloud_over_run/" target="_blank" rel="noopener">theregister.com/2020/12/10/google_cloud_over_run/</a></li>
</ul>
</div>
`;
/* ═════ 8.5 — Lab 8 ═════ */
const L85_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab</span>
<h2>8.5 — Chapter 8 lab: LabFlow's room-lookup API on Lambda + API Gateway, from "it answers" to production-safe</h2>
<p class="lead">A teammate shipped <code>GET /phong/{id}</code> in ten minutes: it answers 200 and 404 correctly. It also runs with 3,008 MB and a 15-minute timeout, on x86, with its configuration in the code, logs kept forever, no cap on concurrency, and an invoke permission any API Gateway in the world could use. The grader below finds all of that; your job is to get it to 8/8, then delete everything and prove nothing is left.</p>

<h3>The brief</h3>
<ul>
  <li>Function <code>labflow-tra-phong</code>: <code>nodejs22.x</code> on <strong>arm64</strong>, memory ≤ 512 MB, timeout ≤ 10 s.</li>
  <li>Configuration through an environment variable <code>BANG</code>, not in code.</li>
  <li>Log group <code>/aws/lambda/labflow-tra-phong</code> keeps logs <strong>14 days</strong>.</li>
  <li>Reserved concurrency between 1 and 50.</li>
  <li>API <code>labflow-lab8</code>: <code>GET /phong/A101</code> ⇒ 200, <code>GET /phong/Z999</code> ⇒ 404.</li>
  <li>The function's invoke permission for API Gateway is scoped with a <strong>SourceArn</strong>.</li>
</ul>
<p>Runs on LocalStack 4.12; remove <code>--endpoint-url</code> in <code>chung8.sh</code> and change the API URL, and the same grader checks a real account.</p>

<h3>The grader (8 checks)</h3>
${MA_CHAM}

<h3>Starting point: the rushed version</h3>
${MA_TRUOC}
${OUT_85_TRUOC}
<p>Two out of eight — and both passes are the ones a user would notice. Every failure is invisible until the bill, the incident review or the auditor shows up. Pause here and try it yourself before opening the solution.</p>

${giai('Solution: giai.sh, the grader at 8/8', MA_GIAI + OUT_85_GIAI + `
<ul>
  <li>Memory, timeout and environment variables are configuration: one <code>update-function-configuration</code>. Wait for <code>function-updated-v2</code> before the next change, or the update is rejected as "in progress".</li>
  <li>The architecture belongs to the code package: it changes with <code>update-function-code --architectures arm64</code>. Pure JavaScript runs on arm64 as is; native modules (sharp, bcrypt) must be built for arm64. <strong>LocalStack differs:</strong> it was started with <code>LAMBDA_IGNORE_ARCHITECTURE=1</code> because this x86 machine cannot run the arm64 image — without it, every call after the switch timed out.</li>
  <li>The log group exists only after the first run; <code>put-retention-policy</code> then caps it at 14 days. Without it CloudWatch keeps logs forever and bills storage forever.</li>
  <li>Reserved concurrency 20: a ceiling for the bill and for whatever database the function will talk to.</li>
  <li>The broad permission is removed and re-added with <code>--source-arn …:$API/*/GET/phong/*</code>.</li>
</ul>`)}

<h3>Clean-up and bill check</h3>
${MA_DON}
${MA_CONGI}
${OUT_85_DON}
<ul>
  <li>Order: API ⇒ functions (their permissions go with them) ⇒ log groups (they outlive the function and keep billing) ⇒ role.</li>
  <li>On a real account also check: no function URL left enabled, no CloudWatch alarms or schedules still pointing at the function, every Region you used.</li>
</ul>

<h3>What this API costs per month (Singapore, 11/2026)</h3>
<table>
  <tr><th>Item</th><th>Assumption</th><th>USD/month</th></tr>
  <tr><td>HTTP API</td><td>1 million requests × 1.25 per million</td><td>1.25</td></tr>
  <tr><td>Lambda requests</td><td>1 million × 0.20 per million</td><td>0.20</td></tr>
  <tr><td>Lambda duration (arm64)</td><td>50 ms × 256 MB × 1 million = 12,500 GB-s × 0.0000133334</td><td>0.17</td></tr>
  <tr><td>CloudWatch Logs</td><td>a few lines per call, 14-day retention</td><td>cents to a few USD</td></tr>
  <tr><td><b>Total</b></td><td>before Free Tier</td><td><b>≈ 1.6 + logs</b></td></tr>
</table>
<p>Within the monthly Free Tier (1 million Lambda requests, 400,000 GB-seconds) the Lambda part is 0. Compare: the two Fargate tasks + ALB of Chapter 7 cost about 69 USD a month at any traffic (Lesson 8.4).</p>

<h3>🎤 Five interview questions for this chapter</h3>
<ul>
  <li><strong>"Walk me through a request to a Lambda-backed API."</strong> — DNS ⇒ API Gateway endpoint ⇒ authorizer (JWT/Lambda) ⇒ throttling ⇒ route ⇒ proxy integration invokes the function (cold or warm environment) ⇒ function returns statusCode/body ⇒ API Gateway returns HTTP; logs and metrics to CloudWatch.</li>
  <li><strong>"Your Lambda API is slow on the first request after lunch."</strong> — Cold starts: check Init Duration in REPORT; smaller package, lazy loading, more memory, SnapStart (Java/Python/.NET), Provisioned Concurrency for the critical path.</li>
  <li><strong>"How do you stop a Lambda function from overloading RDS?"</strong> — Reserved concurrency below the connection limit, RDS Proxy, connections created outside the handler and reused, queues (SQS) to smooth bursts.</li>
  <li><strong>"How do you deploy a new version safely?"</strong> — Publish versions, point an alias at them, shift traffic gradually (CodeDeploy linear/canary) with alarms that roll back; never deploy straight to $LATEST in production.</li>
  <li><strong>"Lambda or Fargate for this service?"</strong> — Answer with traffic shape, request duration, start-up time of the runtime, database access and team: compute the break-even point with real prices.</li>
</ul>

<h3>🧪 Practice — this lab is the practice</h3>
<p><strong>Done when:</strong> <code>cham.sh</code> prints <code>ĐIỂM: 8/8</code>, then <code>con-gi.sh</code> prints four zeros. Extra credit: put the eight settings in Terraform (Section 11) and run the grader against it.</p>

<h3>Sources</h3>
<ul>
  <li>Lambda configuration (memory, timeout, architectures): <a href="https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html</a></li>
  <li>Lambda concurrency: <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html</a></li>
  <li>API Gateway and Lambda permissions: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html</a></li>
  <li>Prices: Price List API, Singapore, 20/11/2026 (Lambda, API Gateway).</li>
</ul>
</div>
`;
const L85_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab</span>
<h2>8.5 — Lab chương 8: API tra cứu phòng của LabFlow trên Lambda + API Gateway, từ "trả lời được" tới an toàn cho production</h2>
<p class="lead">Một bạn trong nhóm dựng <code>GET /phong/{id}</code> trong mười phút: nó trả đúng 200 và 404. Nó cũng chạy với 3.008 MB và timeout 15 phút, trên x86, cấu hình nằm trong mã, log giữ mãi mãi, không có trần concurrency, và một quyền gọi hàm mà API Gateway nào trên đời cũng dùng được. Bộ chấm dưới đây tìm ra tất cả; việc của bạn là đưa nó lên 8/8, rồi xoá sạch và chứng minh không còn gì.</p>

<h3>Đề bài</h3>
<ul>
  <li>Hàm <code>labflow-tra-phong</code>: <code>nodejs22.x</code> trên <strong>arm64</strong>, bộ nhớ ≤ 512 MB, timeout ≤ 10 giây.</li>
  <li>Cấu hình qua biến môi trường <code>BANG</code>, không nằm trong mã.</li>
  <li>Log group <code>/aws/lambda/labflow-tra-phong</code> giữ log <strong>14 ngày</strong>.</li>
  <li>Reserved concurrency trong khoảng 1 tới 50.</li>
  <li>API <code>labflow-lab8</code>: <code>GET /phong/A101</code> ⇒ 200, <code>GET /phong/Z999</code> ⇒ 404.</li>
  <li>Quyền gọi hàm cấp cho API Gateway được giới hạn bằng <strong>SourceArn</strong>.</li>
</ul>
<p>Chạy trên LocalStack 4.12; bỏ <code>--endpoint-url</code> trong <code>chung8.sh</code> và đổi URL của API là cùng bộ chấm đó kiểm được tài khoản thật.</p>

<h3>Bộ chấm (8 phép kiểm)</h3>
${MA_CHAM}

<h3>Điểm xuất phát: bản làm vội</h3>
${MA_TRUOC}
${OUT_85_TRUOC}
<p>Hai trên tám — và hai phép qua đều là thứ người dùng nhìn thấy. Mọi phép trượt đều vô hình cho tới khi hoá đơn, buổi rà soát sự cố hay kiểm toán viên xuất hiện. Dừng ở đây và tự làm thử trước khi mở lời giải.</p>

${giai('Lời giải: giai.sh, bộ chấm 8/8', MA_GIAI + OUT_85_GIAI + `
<ul>
  <li>Bộ nhớ, timeout và biến môi trường là cấu hình: một lệnh <code>update-function-configuration</code>. Đợi <code>function-updated-v2</code> rồi mới đổi tiếp, không thì lệnh sau bị từ chối vì "đang cập nhật".</li>
  <li>Kiến trúc thuộc về gói mã: đổi bằng <code>update-function-code --architectures arm64</code>. JavaScript thuần chạy được trên arm64 ngay; module native (sharp, bcrypt) phải được build cho arm64. <strong>LocalStack khác AWS:</strong> nó được khởi động kèm <code>LAMBDA_IGNORE_ARCHITECTURE=1</code> vì máy x86 này không chạy được ảnh arm64 — thiếu cờ đó, mọi lần gọi sau khi đổi kiến trúc đều hết giờ.</li>
  <li>Log group chỉ có sau lần chạy đầu; <code>put-retention-policy</code> rồi giới hạn nó 14 ngày. Không có lệnh này, CloudWatch giữ log mãi mãi và tính tiền lưu trữ mãi mãi.</li>
  <li>Reserved concurrency 20: một trần cho hoá đơn và cho cơ sở dữ liệu mà hàm sẽ nói chuyện cùng.</li>
  <li>Quyền rộng bị gỡ và cấp lại kèm <code>--source-arn …:$API/*/GET/phong/*</code>.</li>
</ul>`)}

<h3>Dọn dẹp và kiểm hoá đơn</h3>
${MA_DON}
${MA_CONGI}
${OUT_85_DON}
<ul>
  <li>Thứ tự: API ⇒ hàm (quyền của hàm đi theo) ⇒ log group (sống lâu hơn hàm và vẫn tính tiền) ⇒ vai.</li>
  <li>Trên tài khoản thật, kiểm thêm: không còn function URL nào đang bật, không còn alarm CloudWatch hay lịch chạy nào trỏ vào hàm, ở mọi Region bạn đã dùng.</li>
</ul>

<h3>API này tốn bao nhiêu mỗi tháng (Singapore, 11/2026)</h3>
<table>
  <tr><th>Hạng mục</th><th>Giả định</th><th>USD/tháng</th></tr>
  <tr><td>HTTP API</td><td>1 triệu yêu cầu × 1,25 mỗi triệu</td><td>1,25</td></tr>
  <tr><td>Yêu cầu Lambda</td><td>1 triệu × 0,20 mỗi triệu</td><td>0,20</td></tr>
  <tr><td>Thời gian chạy Lambda (arm64)</td><td>50 ms × 256 MB × 1 triệu = 12.500 GB-giây × 0,0000133334</td><td>0,17</td></tr>
  <tr><td>CloudWatch Logs</td><td>vài dòng mỗi lần gọi, giữ 14 ngày</td><td>vài xu tới vài USD</td></tr>
  <tr><td><b>Tổng</b></td><td>chưa trừ Free Tier</td><td><b>≈ 1,6 + log</b></td></tr>
</table>
<p>Trong Free Tier hằng tháng (1 triệu yêu cầu Lambda, 400.000 GB-giây), phần Lambda bằng 0. So sánh: hai task Fargate + ALB của Chương 7 tốn khoảng 69 USD mỗi tháng ở mọi mức lưu lượng (bài 8.4).</p>

<h3>🎤 Năm câu phỏng vấn của chương này</h3>
<ul>
  <li><strong>"Kể đường đi của một yêu cầu tới API chạy bằng Lambda."</strong> — DNS ⇒ endpoint API Gateway ⇒ authorizer (JWT/Lambda) ⇒ throttling ⇒ route ⇒ tích hợp proxy gọi hàm (môi trường lạnh hoặc ấm) ⇒ hàm trả statusCode/body ⇒ API Gateway trả HTTP; log và metric về CloudWatch.</li>
  <li><strong>"API Lambda của bạn chậm ở yêu cầu đầu tiên sau giờ nghỉ trưa."</strong> — Cold start: xem Init Duration trong REPORT; gói nhỏ hơn, nạp lười, thêm bộ nhớ, SnapStart (Java/Python/.NET), Provisioned Concurrency cho đường quan trọng.</li>
  <li><strong>"Làm sao để hàm Lambda không đè bẹp RDS?"</strong> — Reserved concurrency dưới giới hạn kết nối, RDS Proxy, tạo kết nối ngoài handler và dùng lại, hàng đợi (SQS) để làm phẳng các đợt dồn.</li>
  <li><strong>"Deploy phiên bản mới an toàn thế nào?"</strong> — Publish version, trỏ alias vào, chuyển lưu lượng từ từ (CodeDeploy linear/canary) với alarm tự quay lui; không bao giờ deploy thẳng vào $LATEST ở production.</li>
  <li><strong>"Dịch vụ này nên chạy Lambda hay Fargate?"</strong> — Trả lời bằng dạng lưu lượng, thời gian mỗi yêu cầu, thời gian khởi động của runtime, cách truy cập cơ sở dữ liệu và đội ngũ: tính điểm hoà vốn bằng giá thật.</li>
</ul>

<h3>🧪 Thực hành — chính lab này là bài thực hành</h3>
<p><strong>Đạt khi:</strong> <code>cham.sh</code> in <code>ĐIỂM: 8/8</code>, rồi <code>con-gi.sh</code> in bốn số 0. Thêm điểm: viết tám thiết lập đó bằng Terraform (Chương 11) rồi chạy bộ chấm trên nó.</p>

<h3>Nguồn</h3>
<ul>
  <li>Cấu hình Lambda (bộ nhớ, timeout, kiến trúc): <a href="https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html</a></li>
  <li>Concurrency của Lambda: <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html" target="_blank" rel="noopener">docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html</a></li>
  <li>API Gateway và quyền gọi Lambda: <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html" target="_blank" rel="noopener">docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html</a></li>
  <li>Giá: Price List API, Singapore, 20/11/2026 (Lambda, API Gateway).</li>
</ul>
</div>
`;

/* ═════ 8.6 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [2, 0, 3, 1, 1, 3, 0, 2, 3, 0];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ8 = [
  Q('A counter declared outside the handler shows 1, 2, 3 on three calls, then 1 again. Why?|||Một biến đếm khai báo ngoài handler cho ra 1, 2, 3 ở ba lần gọi, rồi lại 1. Vì sao?', [
    'Lambda resets module variables every third call|||Lambda xoá biến module sau mỗi ba lần gọi',
    'The fourth call ran in a new execution environment (cold start)|||Lần gọi thứ tư chạy trong một môi trường thực thi mới (cold start)',
    'The handler threw an error|||Handler đã ném lỗi',
    'Environment variables changed|||Biến môi trường đã đổi',
  ], 1),
  Q('At what memory size does a Lambda function get the equivalent of one vCPU?|||Ở mức bộ nhớ nào hàm Lambda có tương đương một vCPU?', [
    '128 MB|||128 MB',
    '1,769 MB|||1.769 MB',
    '3,008 MB|||3.008 MB',
    '10,240 MB|||10.240 MB',
  ], 1),
  Q('A function needs 5 seconds but its timeout is 3. What happens?|||Hàm cần 5 giây nhưng timeout là 3. Chuyện gì xảy ra?', [
    'Lambda extends the timeout automatically|||Lambda tự kéo dài timeout',
    'It is stopped with "Task timed out after 3.00 seconds" and you pay for 3 seconds|||Nó bị dừng với "Task timed out after 3.00 seconds" và bạn trả tiền 3 giây',
    'It finishes, but the response is dropped and nothing is billed|||Nó chạy xong, nhưng phản hồi bị bỏ và không bị tính tiền',
    'It is moved to Fargate|||Nó được chuyển sang Fargate',
  ], 1),
  Q('Which feature does a REST API have that an HTTP API does not?|||Tính năng nào REST API có mà HTTP API không có?', [
    'Lambda proxy integration|||Tích hợp Lambda proxy',
    'API keys with usage plans and per-client throttling|||API key kèm usage plan và throttling theo từng khách',
    'JWT authorizers|||JWT authorizer',
    'Custom domain names|||Tên miền riêng',
  ], 1),
  Q('On LocalStack community, an API with a Lambda authorizer answered 200 without any token. What is the right conclusion?|||Trên LocalStack community, một API có Lambda authorizer trả 200 khi không có token. Kết luận đúng là gì?', [
    'The authorizer code is wrong|||Mã authorizer bị sai',
    'The emulator does not enforce authorizers; test 401/403 on real AWS|||Trình giả lập không thực thi authorizer; phải thử 401/403 trên AWS thật',
    'Authorizers only work with REST APIs|||Authorizer chỉ chạy với REST API',
    'The API is safe because the authorizer is attached|||API an toàn vì authorizer đã được gắn',
  ], 1),
  Q('Why add --source-arn to lambda add-permission for API Gateway?|||Vì sao thêm --source-arn vào lambda add-permission cho API Gateway?', [
    'It makes the function faster|||Để hàm chạy nhanh hơn',
    'So only that API, method and path can invoke the function|||Để chỉ đúng API, phương thức và đường dẫn đó được gọi hàm',
    'It is required to enable CloudWatch Logs|||Nó bắt buộc để bật CloudWatch Logs',
    'It sets the stage name|||Nó đặt tên stage',
  ], 1),
  Q('In the measurement on AWS runtime images at one vCPU, which cold start was longest?|||Trong phép đo trên ảnh runtime của AWS ở một vCPU, cold start nào lâu nhất?', [
    'Node.js 22|||Node.js 22',
    'Spring Cloud Function, about 1.6 seconds|||Spring Cloud Function, khoảng 1,6 giây',
    'Plain Java 21|||Java 21 thuần',
    'All the same|||Đều như nhau',
  ], 1),
  Q('What can go wrong if initialization generates a random token and SnapStart is enabled?|||Điều gì có thể sai nếu phần khởi tạo sinh một token ngẫu nhiên và SnapStart đang bật?', [
    'Nothing, snapshots never contain memory|||Không gì cả, snapshot không chứa bộ nhớ',
    'Every restored environment starts with the same "random" token|||Mọi môi trường khôi phục đều bắt đầu với cùng một token "ngẫu nhiên"',
    'The function can no longer use Java 21|||Hàm không còn dùng được Java 21',
    'SnapStart doubles the price for Java|||SnapStart làm giá Java tăng gấp đôi',
  ], 1),
  Q('A function writes thumbnails into the bucket that triggers it. What stops the spending fastest?|||Một hàm ghi ảnh thu nhỏ vào chính bucket kích hoạt nó. Cách nào dừng chi tiêu nhanh nhất?', [
    'Wait for the Budget e-mail|||Chờ email cảnh báo Budget',
    'Set the function\'s reserved concurrency to 0|||Đặt reserved concurrency của hàm về 0',
    'Increase the timeout|||Tăng timeout',
    'Switch the function to arm64|||Đổi hàm sang arm64',
  ], 1),
  Q('With the lesson\'s assumptions, below roughly how many requests per month is Lambda + HTTP API cheaper than two Fargate tasks + ALB?|||Với giả định của bài, dưới khoảng bao nhiêu yêu cầu mỗi tháng thì Lambda + HTTP API rẻ hơn hai task Fargate + ALB?', [
    '1 million|||1 triệu',
    'About 42 million (≈ 16 per second on average)|||Khoảng 42 triệu (trung bình ≈ 16 mỗi giây)',
    '1 billion|||1 tỷ',
    'Lambda is always cheaper|||Lambda luôn rẻ hơn',
  ], 1),
];

export default {
  title: 'Chapter 8 — Serverless: Lambda and API Gateway|||Chương 8 — Serverless: Lambda và API Gateway',
  description: 'Serverless chạy thật: hàm Lambda Node.js trong LocalStack (handler, context, biến module sống qua lần gọi ấm, log REPORT, timeout 3 giây), cold start đo bằng ảnh runtime chính hãng của AWS (75 ms lạnh vs 1–2 ms ấm), bộ nhớ = CPU (395 ⇒ 35 ms); API Gateway với Lambda proxy, authorizer JWT (giả lập bỏ qua authorizer ⇒ thử bảo mật trên AWS thật), throttling; Java 66/241/1.641 ms (Node/Java/Spring) và SnapStart; điểm hoà vốn với Fargate bằng giá thật, vòng lặp S3 ⇒ Lambda tạo 2.150 tệp/phút; lab chấm 8 phép + giá tháng.',
  lessons: [
    {
      title: '8.1 — Lambda functions in Node.js|||8.1 — Hàm Lambda bằng Node.js',
      slug: 'aws-8-1-lambda',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vai + hàm nodejs22.x trong LocalStack; event, context, mã ngoài handler chạy một lần mỗi môi trường; log START/END/REPORT; cold start 75 ms vs 1–2 ms ấm trên ảnh runtime chính hãng (RIE); timeout 3 giây cắt ngang; bộ nhớ = CPU (128/512/1.769 MB ⇒ 395/95/35 ms); giới hạn, layer; Denonia 2022.',
      content: L81_EN + L81_VI,
    },
    {
      title: '8.2 — HTTP APIs with API Gateway|||8.2 — API HTTP với API Gateway',
      slug: 'aws-8-2-api-gateway',
      type: 'LESSON',
      isFreePreview: true,
      description: 'HTTP API vs REST API (1,25 vs 4,25 USD/triệu); GET /phong/{id} Lambda proxy, add-permission có SourceArn, gọi thật 200/404; LocalStack bỏ qua authorizer ⇒ 200 cả khi không token; gọi thẳng authorizer: Unauthorized/Deny/Allow; throttling 10.000 RPS + reserved concurrency; Optus 2022.',
      content: L82_EN + L82_VI,
    },
    {
      title: '8.3 — Lambda with Java/Spring and SnapStart|||8.3 — Lambda bằng Java/Spring và SnapStart',
      slug: 'aws-8-3-lambda-java',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng việc viết bằng Node.js, Java 21 thuần, Spring Cloud Function; cold start đo trên ảnh runtime AWS ở 1 vCPU: 66 / 241 / 1.641 ms, ấm đều 1–3 ms; SnapStart (Java miễn phí, cần version, priming, CRaC hook), snapshot chép cả tính ngẫu nhiên; Log4Shell 2021; khi nào để Spring Boot trên Fargate.',
      content: L83_EN + L83_VI,
    },
    {
      title: '8.4 — When serverless is (not) a good idea|||8.4 — Khi nào serverless (không) hợp',
      slug: 'aws-8-4-khi-nao',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Điểm hoà vốn Lambda + HTTP API vs Fargate + ALB bằng giá Singapore: ≈ 42 triệu yêu cầu/tháng (~16/giây); vòng lặp S3 ⇒ Lambda ⇒ cùng bucket: 2.150 tệp/phút, công tắc ngắt concurrency 0; recursive loop detection (SQS/S3/SNS/EventBridge); Milkie Way 72.000 USD (2020); bảng hợp/không hợp; đường quyết định cho LabFlow.',
      content: L84_EN + L84_VI,
    },
    {
      title: '8.5 — Chapter 8 lab + interview questions|||8.5 — Lab chương 8 + câu hỏi phỏng vấn',
      slug: 'aws-8-5-lab-8',
      type: 'LESSON',
      isFreePreview: true,
      description: 'API tra cứu phòng labflow-tra-phong: bộ chấm 8 phép (arm64, bộ nhớ/timeout, biến môi trường, log 14 ngày, reserved concurrency, 200/404, SourceArn); bản vội 2/8 ⇒ lời giải 8/8 ⇒ dọn ⇒ bốn số 0; giá tháng ≈ 1,6 USD + log; năm câu phỏng vấn.',
      content: L85_EN + L85_VI,
    },
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
      slug: 'aws-8-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu từ các output đã chạy trong chương 8.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ8 },
    },
  ],
};
