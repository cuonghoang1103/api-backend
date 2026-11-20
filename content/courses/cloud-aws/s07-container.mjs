/**
 * Cloud AWS — Chương 7: Container — ECR và ECS Fargate
 * (soạn 20/11/2026, agent aws; phiên 26 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   7.1 ecr · 7.2 ecs-khai-niem · 7.3 fargate · 7.4 so-sanh · 7.5 lab-7 · 7.6 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c7/7N.sh + 74-gia.mjs + lab7/chay.sh:
 *   - AWS CLI 2.41.0 → Moto (ecr, ecs, elbv2 — LocalStack community KHÔNG có) và LocalStack 4.12 (sts, iam, secretsmanager, logs):
 *     chỉ là CẤU HÌNH, Moto không chạy task nào;
 *   - phần "thật" chạy trong Docker: registry:2 (vai ECR), Trivy 0.76.2 (vai quét ảnh), HAProxy 3.0 (vai ALB, target kiểu ip),
 *     container node 22 (vai task Fargate, giới hạn --cpus/--memory), Fluent Bit 5.2 (vai FireLens/awslogs ⇒ CloudWatch Logs LocalStack),
 *     AWS CLI thật trong task đọc khoá qua 169.254.170.2 (agent GIẢ LẬP cred.js, STS AssumeRole của LocalStack);
 *   - giá: Price List API Singapore 11/2026 (~/.rtq-aws/n7, ~/.rtq-aws/gia).
 * Khác AWS đã ghi rõ trong bài: Moto trả token giả + expiresAt 2015, không chạy task (runningCount 0), không lưu deploymentConfiguration,
 *   lưu taskDefinition đúng chữ đã gửi (AWS trả ARN); agent 169.254.170.2 là bản giả lập; cờ OOMKilled=false trên cgroup v2.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/js() của _chung.mjs.
 */
import { bash, json, js, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (scratchpad/aws/lab/c7: AWS CLI 2.41.0 → Moto / LocalStack 4.12; Docker thật: registry:2, Trivy, HAProxy 3.0, Fluent Bit, node 22) ═════ */
const OUT_71_ECR_API = out("$ aws ecr create-repository --repository-name labflow-api --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=KMS --query 'repository.[repositoryUri,imageTagMutability,imageScanningConfiguration.scanOnPush,encryptionConfiguration.encryptionType]' --output text\n123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/labflow-api\tIMMUTABLE\tTrue\tKMS\n# Luật vòng đời: ảnh không tag quá 7 ngày ⇒ xoá; ảnh tag v* chỉ giữ 10 bản mới nhất\n$ aws ecr put-lifecycle-policy --repository-name labflow-api --lifecycle-policy-text file:///aws/vong-doi.json --query repositoryName --output text\nlabflow-api\n$ aws ecr get-lifecycle-policy --repository-name labflow-api --query lifecyclePolicyText --output text\n{\"rules\":[{\"rulePriority\":1,\"description\":\"untagged > 7 days\",\"selection\":{\"tagStatus\":\"untagged\",\"countType\":\"sinceImagePushed\",\"countUnit\":\"days\",\"c …\n# Token đăng nhập Docker: hết hạn sau 12 giờ trên AWS\n$ aws ecr get-authorization-token --query 'authorizationData[0].[proxyEndpoint,expiresAt]' --output text\nhttps://123456789012.dkr.ecr.ap-southeast-1.amazonaws.com\t2015-01-01T00:00:00+00:00");
const OUT_71_ECR_LOGIN = out("# Trên AWS: aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <id>.dkr.ecr.ap-southeast-1.amazonaws.com\n# Ở lab: registry:2 (127.0.0.1:43750) vai ECR, token 64 ký tự nằm trong ecr-token.txt\n$ docker push 127.0.0.1:43750/labflow-api:v1     # chưa đăng nhập\npush access denied, repository does not exist or may require authorization: authorization failed: no basic auth credentials\n$ cat ecr-token.txt | docker login --username AWS --password-stdin 127.0.0.1:43750\nWARNING! Your credentials are stored unencrypted in '/home/Cuong03dx/.rtq-aws/c7/docker-cfg/config.json'.\nConfigure a credential helper to remove this warning. See\nhttps://docs.docker.com/go/credential-store/\nLogin Succeeded\n$ cat ~/.docker/config.json      # token nằm ở đây, chỉ là base64\n{\"auths\": {\"127.0.0.1:43750\": {\"auth\": \"QVdTOmVSZWlBSjdVajZidWE3\\u2026\"}}}\n$ echo <auth> | base64 -d | cut -c1-12\nAWS:eReiAJ7U…");
const OUT_71_ECR_THAT = out("$ cat Dockerfile\nFROM node:22-alpine\nARG BAN=1\nENV NODE_ENV=production BAN=$BAN\nWORKDIR /app\nCOPY app.js .\nUSER node\nEXPOSE 8080\nCMD [\"node\", \"app.js\"]\n$ docker build -t labflow-api:v1 --build-arg BAN=1 .\n=> sha256:7c18b4758fc8adb863b444fa34b38a43e4ad27428007fa250254a4fd1d31daba\n$ docker image ls labflow-api\nREPOSITORY    TAG       SIZE\nlabflow-api   v1        238MB\n$ docker run --rm labflow-api:v1 id\nuid=1000(node) gid=1000(node) groups=1000(node),1000(node)\n$ docker tag labflow-api:v1 127.0.0.1:43750/labflow-api:v1 && docker push 127.0.0.1:43750/labflow-api:v1\n881fc932939e: Pushed\n87aaee1f6667: Pushed\nv1: digest: sha256:7c18b4758fc8adb863b444fa34b38a43e4ad27428007fa250254a4fd1d31daba size: 856\n$ curl -s -u AWS:$TOKEN http://127.0.0.1:43750/v2/labflow-api/tags/list\n{\"name\":\"labflow-api\",\"tags\":[\"v1\"]}\n\n# ── Tag MUTABLE: ai đó build lại và đẩy ĐÈ đúng tag v1 ──\n$ docker build -t 127.0.0.1:43750/labflow-api:v1 --build-arg BAN=2 . && docker push 127.0.0.1:43750/labflow-api:v1\nv1: digest: sha256:dbe0d859a13485d9044ff065baba738783b6f345af3823f44f6ecb4b72671a94 size: 856\n$ docker run --rm --pull always 127.0.0.1:43750/labflow-api:v1 node -e 'console.log(\"BAN=\"+process.env.BAN)'\nBAN=2\n$ docker run --rm 127.0.0.1:43750/labflow-api@sha256:7c18b4758fc8… node -e 'console.log(\"BAN=\"+process.env.BAN)'\nBAN=1\n# digest cũ sha256:7c18b4758fc8… vẫn kéo được bản 1; tag v1 giờ trỏ sha256:dbe0d859a134… (bản 2)\n$ docker logout 127.0.0.1:43750\nRemoving login credentials for 127.0.0.1:43750");
const OUT_71_QUET_A = out("$ trivy --version\nVersion: 0.76.2\n$ trivy image --input node_16-alpine.tar --scanners vuln --severity HIGH,CRITICAL --quiet\n/w/node_16-alpine.tar (alpine 3.18.3)                        alpine: 6 lỗ hổng HIGH/CRITICAL\nNode.js                                                      node-pkg: 36 lỗ hổng HIGH/CRITICAL\nTổng: 42 (CRITICAL: 1  HIGH: 41 )\n  CRITICAL tar            CVE-2026-59873       cài 6.1.11     sửa ở 7.5.19\n  HIGH     brace-expansio CVE-2026-102276      cài 1.1.11     sửa ở 5.0.10, 3.0.7, 2.1.5, 1.\n  HIGH     brace-expansio CVE-2026-102278      cài 1.1.11     sửa ở 5.0.11, 3.0.8, 2.1.6, 1.\n  HIGH     brace-expansio CVE-2026-13149       cài 1.1.11     sửa ở 5.0.7, 1.1.16, 2.1.2\n  HIGH     brace-expansio CVE-2026-14257       cài 1.1.11     sửa ở 5.0.8, 3.0.3, 2.1.3, 1.1\n$ trivy image --input labflow-api_v1.tar --scanners vuln --severity HIGH,CRITICAL --quiet\n/w/labflow-api_v1.tar (alpine 3.24.4)                        alpine: 0 lỗ hổng HIGH/CRITICAL\nNode.js                                                      node-pkg: 10 lỗ hổng HIGH/CRITICAL\nTổng: 10 (CRITICAL: 0  HIGH: 10 )\n  HIGH     brace-expansio CVE-2026-102276      cài 2.0.2      sửa ở 5.0.10, 3.0.7, 2.1.5, 1.\n  HIGH     brace-expansio CVE-2026-102278      cài 2.0.2      sửa ở 5.0.11, 3.0.8, 2.1.6, 1.\n  HIGH     brace-expansio CVE-2026-13149       cài 2.0.2      sửa ở 5.0.7, 1.1.16, 2.1.2\n  HIGH     brace-expansio CVE-2026-14257       cài 2.0.2      sửa ở 5.0.8, 3.0.3, 2.1.3, 1.1\n  HIGH     brace-expansio CVE-2026-69152       cài 2.0.2      sửa ở 1.1.18, 2.1.4, 3.0.6, 5.");
const OUT_71_QUET_B = out("$ cat Dockerfile.voi\nFROM node:22-alpine\nWORKDIR /app\nCOPY .env app.js ./\nRUN rm .env\nUSER node\nCMD [\"node\",\"app.js\"]\n$ trivy image --input labflow-api_voi.tar --scanners secret --quiet\n/app/.env: CRITICAL aws-secret-access-key — AWS Secret Access Key\n  lớp: sha256:ed657a381e22…  tạo bởi: COPY .env app.js ./ # buildkit\n  dòng 3: AWS_SECRET_ACCESS_KEY=****************************************\nTổng bí mật tìm thấy: 1");
const OUT_72_ECS_API = out("$ aws ecs create-cluster --cluster-name labflow --capacity-providers FARGATE FARGATE_SPOT --query 'cluster.[clusterName,status]' --output text\nlabflow\tACTIVE\n$ cat td.json   # task definition = bản docker-compose của ECS (rút gọn ở bài)\n$ aws ecs register-task-definition --cli-input-json file:///aws/td.json --query 'taskDefinition.[family,revision,networkMode,cpu,memory,status]' --output text\nlabflow-api\t1\tawsvpc\t256\t512\tACTIVE\n$ aws ecs describe-task-definition --task-definition labflow-api --query 'taskDefinition.[executionRoleArn,taskRoleArn]' --output text\narn:aws:iam::123456789012:role/labflow-exec\tarn:aws:iam::123456789012:role/labflow-task\n# Sửa một dòng (đổi ảnh v1 ⇒ v2) = ĐĂNG KÝ revision mới; revision cũ không bao giờ bị sửa\n$ aws ecs register-task-definition --cli-input-json file:///aws/td.json --query 'taskDefinition.[family,revision]' --output text\nlabflow-api\t2\n$ aws ecs list-task-definitions --family-prefix labflow-api --query taskDefinitionArns --output text\narn:aws:ecs:ap-southeast-1:123456789012:task-definition/labflow-api:1\tarn:aws:ecs:ap-southeast-1:123456789012:task-definition/labflow-api:2\n$ aws ecs create-service --cluster labflow --service-name labflow-api --task-definition labflow-api:1 --desired-count 2 --launch-type FARGATE --network-configuration 'awsvpcConfiguration={subnets=[subnet-1cdf98fb105773d26,subnet-c7acf3e33c62cd5ee],securityGroups=[sg-025bb7ae703793082],assignPublicIp=DISABLED}' --query 'service.[serviceName,taskDefinition,desiredCount,runningCount,launchType]' --output text\nlabflow-api\tarn:aws:ecs:ap-southeast-1:123456789012:task-definition/labflow-api:1\t2\t0\tFARGATE\n$ aws ecs describe-services --cluster labflow --services labflow-api --query 'services[0].[status,desiredCount,runningCount,pendingCount]' --output text\nACTIVE\t2\t0\t2");
const OUT_72_ROLE_A = out("# Trust policy: chỉ dịch vụ ecs-tasks.amazonaws.com được 'đeo' role này\n$ aws iam create-role --role-name labflow-task --assume-role-policy-document file:///aws/tin.json --query Role.Arn --output text\narn:aws:iam::000000000000:role/labflow-task\n$ aws iam attach-role-policy --role-name labflow-task --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess\n# Agent (phía AWS) gọi STS AssumeRole thay cho task, rồi phát khoá TẠM qua 169.254.170.2");
const OUT_72_ROLE_B = out("[task]$ env | grep AWS_ | sort      # KHÔNG có khoá nào trong biến môi trường\nAWS_CONTAINER_CREDENTIALS_RELATIVE_URI=/v2/credentials/ab459eb9…\nAWS_DEFAULT_REGION=ap-southeast-1\nAWS_PAGER=\n[task]$ aws configure list\naccess_key : ****************KC3E     : container-role   :\nsecret_key : ****************UpnV     : container-role   :\nregion     : ap-southeast-1           : env              : ['AWS_REGION', 'AWS_DEFAULT_REGION']\n[task]$ aws sts get-caller-identity --endpoint-url http://10.147.0.10:4566 --query Arn --output text\narn:aws:sts::000000000000:assumed-role/labflow-task/ab459eb9\n[task]$ aws s3 ls --endpoint-url http://10.147.0.10:4566 && echo 'S3: gọi được (role có AmazonS3ReadOnlyAccess)'\nS3: gọi được (role có AmazonS3ReadOnlyAccess)\n# Góc hacker: SSRF chỉ biết địa chỉ 169.254.170.2 mà KHÔNG biết GUID ⇒ 404; đọc được biến môi trường (lỗi đọc tệp /proc/self/environ…) ⇒ lấy được khoá tạm\n[task]$ curl -s http://169.254.170.2/v2/credentials/\n{\"code\":\"NotFound\"}\n[task]$ curl -s http://169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI\n{\"RoleArn\": \"arn:aws:iam::000000000000:role/labflow-task\", \"AccessKeyId\": \"LSIAQAAAAAAAEZ4LKC3E\", \"SecretAccessKey\": \"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\", \"Token\": \"FQoGZXIvYXdz…\", \"Expiration\": \"2026-11-19T21:53:32.307032+00:00\"}\n$ docker logs aws-c7-agent    # nhật ký của agent\nagent: GET /v2/credentials/ab459eb9… ⇒ 200\nagent: GET /v2/credentials/ab459eb9… ⇒ 200\nagent: GET /v2/credentials/ab459eb9… ⇒ 200\nagent: GET /v2/credentials/ ⇒ 404\nagent: GET /v2/credentials/ab459eb9… ⇒ 200");
const OUT_72_SCHEDULER = out("# Bộ lập lịch thu nhỏ: mỗi giây so running với desiredCount=2, thiếu thì chạy task mới (task = docker run --cpus 0.25 --memory 512m)\n03:53:16 (service labflow-api) running=0 < desired=2 ⇒ has started 1 tasks: (task 9419451a)\n03:53:17 (service labflow-api) running=1 < desired=2 ⇒ has started 1 tasks: (task a301f5f3)\n$ docker ps --filter label=svc=labflow-api --format '{{.Names}} {{.Status}}'\naws-c7-task-a301f5f3 Up 2 seconds\naws-c7-task-9419451a Up 3 seconds\n$ docker stats --no-stream --format '{{.Name}} cpu={{.CPUPerc}} mem={{.MemUsage}}'\naws-c7-task-a301f5f3 cpu=0.00% mem=9.555MiB / 512MiB\naws-c7-task-9419451a cpu=0.00% mem=9.562MiB / 512MiB\naws-c7-task-a301f5f3  ip=10.147.0.3  (awsvpc: mỗi task một IP riêng)\naws-c7-task-9419451a  ip=10.147.0.2  (awsvpc: mỗi task một IP riêng)\n$ docker kill aws-c7-task-a301f5f3     # một task chết (máy hỏng, lỗi app…)\n03:53:21 task a301f5f3 STOPPED\n03:53:21 (service labflow-api) running=1 < desired=2 ⇒ has started 1 tasks: (task bef6e2ab)\n$ docker ps --filter label=svc=labflow-api --format '{{.Names}} {{.Status}}'\naws-c7-task-bef6e2ab Up 3 seconds\naws-c7-task-9419451a Up 8 seconds\n\n# Task đòi nhiều bộ nhớ hơn giới hạn task definition (memory=128): Linux giết tiến trình\n$ docker run --memory 128m aws-c7-api:v1 node -e 'const a=[]; for(;;) a.push(Buffer.alloc(16e6,1))'\n$ docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' aws-c7-oom\nOOMKilled=false ExitCode=137");
const OUT_73_API = out("# Fargate dùng awsvpc ⇒ target group PHẢI là kiểu ip (không phải instance)\n$ aws elbv2 create-target-group --name tg-labflow-api --protocol HTTP --port 8080 --vpc-id vpc-57a8761ca5984da1a --target-type ip --health-check-path /health --query 'TargetGroups[0].[TargetGroupName,TargetType,HealthCheckPath]' --output text\ntg-labflow-api\tip\t/health\n$ aws ecs create-service --cluster labflow --service-name labflow-api --task-definition labflow-api --desired-count 2 --launch-type FARGATE --network-configuration 'awsvpcConfiguration={subnets=[subnet-d0b411e761c191f00,subnet-4ec08c47f42cbea96],securityGroups=[sg-053e3eef470290251],assignPublicIp=DISABLED}' --load-balancers 'targetGroupArn=arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-labflow-api/9301489c77186e60,containerName=api,containerPort=8080' --health-check-grace-period-seconds 30 --query 'service.[serviceName,desiredCount,loadBalancers[0].containerName,loadBalancers[0].containerPort,healthCheckGracePeriodSeconds]' --output text\nlabflow-api\t2\tapi\t8080\tNone\n$ aws ecs update-service --cluster labflow --service labflow-api --force-new-deployment --query 'service.deployments[].[status,taskDefinition]' --output text\nPRIMARY\tarn:aws:ecs:ap-southeast-1:123456789012:task-definition/labflow-api:1");
const OUT_73_LOG = out("$ aws logs describe-log-streams --log-group-name /ecs/labflow-api --query 'logStreams[].logStreamName' --output text\necs/api/485fad\necs/api/5eabc5\necs/api/667125\necs/api/a068cd\necs/api/aa1d39\necs/api/abdee4\necs/api/b9af91\necs/api/e28a19\n$ aws logs tail /ecs/labflow-api --since 10m | grep -E 'SIGTERM|listening' | head -6\n2026-11-19T21:02:44.000000+00:00 ecs/api/e28a19 {\"t\":\"2026-11-19T21:02:44.696Z\",\"ban\":\"1\",\"task\":\"a43e3a77c10b\",\"msg\":\"listening :8080\",\"user\":\"node\"}\n2026-11-19T21:02:45.000000+00:00 ecs/api/abdee4 {\"t\":\"2026-11-19T21:02:45.946Z\",\"ban\":\"1\",\"task\":\"ee14821d285c\",\"msg\":\"listening :8080\",\"user\":\"node\"}\n2026-11-19T21:02:51.000000+00:00 ecs/api/5eabc5 {\"t\":\"2026-11-19T21:02:51.476Z\",\"ban\":\"2\",\"task\":\"656fb3256155\",\"msg\":\"listening :8080\",\"user\":\"node\"}\n2026-11-19T21:02:52.000000+00:00 ecs/api/485fad {\"t\":\"2026-11-19T21:02:52.489Z\",\"ban\":\"2\",\"task\":\"46bfe40f8f02\",\"msg\":\"listening :8080\",\"user\":\"node\"}\n2026-11-19T21:02:57.000000+00:00 ecs/api/e28a19 {\"t\":\"2026-11-19T21:02:57.520Z\",\"ban\":\"1\",\"task\":\"a43e3a77c10b\",\"msg\":\"SIGTERM ⇒ đóng gọn\"}\n2026-11-19T21:03:00.000000+00:00 ecs/api/abdee4 {\"t\":\"2026-11-19T21:03:00.658Z\",\"ban\":\"1\",\"task\":\"ee14821d285c\",\"msg\":\"SIGTERM ⇒ đóng gọn\"}\n$ aws logs filter-log-events --log-group-name /ecs/labflow-api --query 'length(events)'\n874");
const OUT_73_TRIEN_KHAI_A = out("$ aws secretsmanager create-secret --name labflow/prod/db --secret-string '<mật khẩu v1>'\n# ── Service chạy bản v1, desiredCount=2 ──\n04:02:44 (service labflow-api) has started 1 tasks: (task e28a19, bản v1, ip 10.147.0.4) ⇒ registered targets in tg-labflow-api\n04:02:45 (service labflow-api) has started 1 tasks: (task abdee4, bản v1, ip 10.147.0.5) ⇒ registered targets in tg-labflow-api\n04:02:45 target e28a19 healthy (2 lần /health = 200)\n04:02:48 target abdee4 healthy (2 lần /health = 200)\n$ curl -s localhost:43780/info\n{\"ban\":\"1\",\"user\":\"node\",\"db_password\":\"có (26 ký tự, sha256 83ac7f7b)\"}\n# ── Cập nhật v1 ⇒ v2 (minimumHealthyPercent=100, maximumPercent=200) dưới tải liên tục ──\n04:02:51 (service labflow-api) has started 1 tasks: (task 5eabc5, bản v2, ip 10.147.0.6) ⇒ registered targets in tg-labflow-api\n04:02:52 (service labflow-api) has started 1 tasks: (task 485fad, bản v2, ip 10.147.0.7) ⇒ registered targets in tg-labflow-api\n04:02:53 target 5eabc5 healthy\n04:02:54 target 485fad healthy\n04:02:54 4 task đang chạy (200 %) — giờ mới rút bản cũ\n04:02:54 (service labflow-api) deregistered 1 targets: e28a19 — draining 3 s\n04:02:57 (service labflow-api) has stopped 1 running tasks: (task e28a19)\n04:02:57 (service labflow-api) deregistered 1 targets: abdee4 — draining 3 s\n04:03:00 (service labflow-api) has stopped 1 running tasks: (task abdee4)\n04:03:00 (service labflow-api) has reached a steady state.\n  tải: 281 yêu cầu · mã {'200': 281} · theo bản {'v1': 140, 'v2': 141} · lỗi (khác 200): 0");
const OUT_73_TRIEN_KHAI_B = out("# ── Xoay mật khẩu DB trong Secrets Manager ──\n$ aws secretsmanager put-secret-value --secret-id labflow/prod/db --secret-string '<mật khẩu v2>'\n$ curl -s localhost:43780/info      # task đang chạy KHÔNG tự thấy mật khẩu mới\n{\"ban\":\"2\",\"user\":\"node\",\"db_password\":\"có (26 ký tự, sha256 83ac7f7b)\"}\n$ aws ecs update-service --cluster labflow --service labflow-api --force-new-deployment\n04:03:03 (service labflow-api) has started 1 tasks: (task b9af91, bản v2, ip 10.147.0.4) ⇒ registered targets in tg-labflow-api\n04:03:04 (service labflow-api) has started 1 tasks: (task 667125, bản v2, ip 10.147.0.5) ⇒ registered targets in tg-labflow-api\n04:03:04 target b9af91 healthy\n04:03:06 target 667125 healthy\n04:03:06 (service labflow-api) deregistered 1 targets: 5eabc5 — draining 3 s\n04:03:09 (service labflow-api) has stopped 1 running tasks: (task 5eabc5)\n04:03:09 (service labflow-api) deregistered 1 targets: 485fad — draining 3 s\n04:03:12 (service labflow-api) has stopped 1 running tasks: (task 485fad)\n$ curl -s localhost:43780/info\n{\"ban\":\"2\",\"user\":\"node\",\"db_password\":\"có (26 ký tự, sha256 6ba5327b)\"}\n  tải: 247 yêu cầu · mã {'200': 247} · theo bản {'v2': 247} · lỗi (khác 200): 0");
const OUT_73_TRIEN_KHAI_C = out("# ── Cập nhật lên v3 — bản có lỗi: /health trả 500 ──\n04:03:15 (service labflow-api) has started 1 tasks: (task fcc06a, bản v3, ip 10.147.0.6) ⇒ registered targets in tg-labflow-api\n04:03:19 (service labflow-api) task fcc06a failed ELB health checks in (target-group tg-labflow-api) ⇒ stopped [1/3]\n04:03:20 (service labflow-api) has started 1 tasks: (task aa1d39, bản v3, ip 10.147.0.6) ⇒ registered targets in tg-labflow-api\n04:03:24 (service labflow-api) task aa1d39 failed ELB health checks in (target-group tg-labflow-api) ⇒ stopped [2/3]\n04:03:26 (service labflow-api) has started 1 tasks: (task a068cd, bản v3, ip 10.147.0.6) ⇒ registered targets in tg-labflow-api\n04:03:30 (service labflow-api) task a068cd failed ELB health checks in (target-group tg-labflow-api) ⇒ stopped [3/3]\n04:03:30 (service labflow-api) deployment failed: tasks failed to start. Circuit breaker ⇒ rolling back to labflow-api v2\n$ curl -s localhost:43780/info\n{\"ban\":\"2\",\"user\":\"node\",\"db_password\":\"có (26 ký tự, sha256 6ba5327b)\"}\n  tải: 330 yêu cầu · mã {'200': 330} · theo bản {'v2': 330} · lỗi (khác 200): 0");
const OUT_74_GIA = out("Giá Singapore (Price List API): Fargate x86 0.05056/vCPU-giờ + 0.00553/GB-giờ · ARM 0.04045 + 0.00442 · EKS 0.1/cụm-giờ (hỗ trợ mở rộng 0.5) · t4g.small 0.0212/giờ · ALB 0.0252/giờ\n— Phần chạy API (2 bản để chịu lỗi một AZ), CHƯA tính ALB/NAT/RDS —\nFargate x86: 2 task × 0,25 vCPU / 0,5 GB       22.49 USD/tháng  \nFargate ARM (Graviton): 2 task × 0,25 / 0,5    17.99 USD/tháng  rẻ hơn 20 %\nFargate x86: 2 task × 0,5 vCPU / 1 GB          44.98 USD/tháng  \nEC2 t4g.small × 2 (2 vCPU / 2 GB mỗi máy)      30.95 USD/tháng  tự vá OS, tự lo Docker\nECS trên EC2: cùng 2 máy t4g.small             30.95 USD/tháng  ECS không thu thêm; máy vẫn của bạn\nEKS: riêng phần điều khiển (control plane)     73.00 USD/tháng  CHƯA có máy chạy pod nào\nEKS khi phiên bản Kubernetes hết hỗ trợ chuẩn  438.00 USD/tháng  0.1 + 0.5 mỗi giờ; chuẩn 14 tháng rồi mở rộng 12 tháng\nALB đứng trước (giờ chạy, chưa LCU)            18.40 USD/tháng  cả Fargate lẫn EC2 đều cần");
const OUT_75_DON = out("$ bash don.sh\n$ aws ecs update-service --cluster labflow --service labflow-api --desired-count 0 --query service.desiredCount --output text\n0\n$ aws ecs delete-service --cluster labflow --service labflow-api --force --query service.status --output text\nINACTIVE\n$ aws ecs deregister-task-definition --task-definition arn:aws:ecs:ap-southeast-1:123456789012:task-definition/labflow-api:1 --query 'taskDefinition.[revision,status]' --output text\n1\tINACTIVE\n$ aws ecs deregister-task-definition --task-definition arn:aws:ecs:ap-southeast-1:123456789012:task-definition/labflow-api:2 --query 'taskDefinition.[revision,status]' --output text\n2\tINACTIVE\n$ aws ecs delete-cluster --cluster labflow --query cluster.status --output text\nINACTIVE\n$ aws ecr delete-repository --repository-name labflow-api --force --query repository.repositoryName --output text\nlabflow-api\n$ bash con-gi.sh\ncluster ACTIVE:  0\nservice ACTIVE:  0\ntask def ACTIVE: 0\nrepository ECR:  0");
const OUT_75_GIAI = out("$ bash giai.sh\n$ aws ecr put-image-tag-mutability --repository-name labflow-api --image-tag-mutability IMMUTABLE --query imageTagMutability --output text\nIMMUTABLE\n$ aws ecr put-image-scanning-configuration --repository-name labflow-api --image-scanning-configuration scanOnPush=true --query imageScanningConfiguration --output text\nTrue\n$ aws ecr put-lifecycle-policy --repository-name labflow-api --lifecycle-policy-text file:///aws/vong-doi.json --query repositoryName --output text\nlabflow-api\n$ aws ecs register-task-definition --cli-input-json file:///aws/td-giai.json --query 'taskDefinition.[family,revision]' --output text\nlabflow-api\t2\n$ aws ecs update-service --cluster labflow --service labflow-api --task-definition labflow-api:2 --desired-count 2 --network-configuration 'awsvpcConfiguration={subnets=[subnet-1eea827eee2956449,subnet-1de91b6170ee64fad],securityGroups=[sg-11c6f30e769c100e1],assignPublicIp=DISABLED}' --query 'service.[taskDefinition,desiredCount]' --output text\nlabflow-api:2\t2\n$ bash cham.sh\n✓ 1. ECR: tag bất biến (IMMUTABLE)\n✓ 2. ECR: quét lỗ hổng khi đẩy (scanOnPush)\n✓ 3. ECR: có luật vòng đời dọn ảnh không tag\n✓ 4. Task definition: mật khẩu đi qua secrets (valueFrom), không nằm trong environment\n✓ 5. Tách execution role và task role (labflow-exec / labflow-task)\n✓ 6. Log đi CloudWatch (awslogs)\n✓ 7. Service: task không IP công khai, desiredCount=2\n✓ 8. Service chạy revision mới nhất (labflow-api:2)\nĐIỂM: 8/8");
const OUT_75_TRUOC = out("$ bash truoc.sh\nđã dựng: repo labflow-api, cluster labflow, task definition labflow-api:1, service labflow-api\n$ bash cham.sh\n✗ 1. ECR: tag còn ghi đè được (MUTABLE)\n✗ 2. ECR: chưa bật scanOnPush\n✗ 3. ECR: chưa có luật vòng đời\n✗ 4. Task definition: bí mật nằm trần trong environment (DB_PASSWORD)\n✗ 5. Execution role và task role trùng hoặc thiếu (labflow-admin / labflow-admin)\n✗ 6. Không có logConfiguration ⇒ task chết là mất log\n✗ 7. Service: assignPublicIp=ENABLED, desiredCount=1 (cần DISABLED và ≥ 2)\n✓ 8. Service chạy revision mới nhất (labflow-api:1)\nĐIỂM: 1/8");
const MA_APP = js("// LabFlow API thu nhỏ cho Chương 7 (ECR + ECS). Chỉ dùng thư viện có sẵn của Node. Cổng 8080.\n// BAN = phiên bản ảnh; HONG=1 ⇒ /health trả 500 (bản lỗi); DB_PASSWORD do \"ECS agent\" bơm vào từ Secrets Manager.\nconst http = require('http'), os = require('os'), crypto = require('crypto');\nconst BAN = process.env.BAN || '1', HONG = process.env.HONG === '1';\nconst log = (o) => console.log(JSON.stringify({ t: new Date().toISOString(), ban: BAN, task: os.hostname(), ...o }));\nconst pw = process.env.DB_PASSWORD || '';\nhttp.createServer((q, r) => {\n  const u = new URL(q.url, 'http://x');\n  if (u.pathname === '/health') { r.writeHead(HONG ? 500 : 200); return r.end(HONG ? 'hong\\n' : 'ok\\n'); }\n  if (u.pathname === '/info') {\n    r.writeHead(200, { 'content-type': 'application/json' });\n    return r.end(JSON.stringify({ ban: BAN, user: os.userInfo().username,\n      db_password: pw ? `có (${pw.length} ký tự, sha256 ${crypto.createHash('sha256').update(pw).digest('hex').slice(0, 8)})` : 'KHÔNG có' }) + '\\n');\n  }\n  if (u.pathname === '/api/rooms') {\n    log({ msg: 'GET /api/rooms', status: 200 });\n    r.writeHead(200, { 'content-type': 'application/json' });\n    return r.end(JSON.stringify({ ban: BAN, task: os.hostname(), rooms: ['LAB-A', 'LAB-B'] }) + '\\n');\n  }\n  log({ msg: `${q.method} ${u.pathname}`, status: 404 }); r.writeHead(404); r.end('404\\n');\n}).listen(8080, () => log({ msg: 'listening :8080', user: os.userInfo().username }));\nprocess.on('SIGTERM', () => { log({ msg: 'SIGTERM ⇒ đóng gọn' }); process.exit(0); });");
const MA_CRED = js("// \"ECS agent\" GIẢ LẬP phần cấp khoá cho task role: nghe 169.254.170.2:80, chỉ trả khoá ở đúng đường /v2/credentials/<GUID>\n// (GUID ngẫu nhiên, ECS bơm vào biến AWS_CONTAINER_CREDENTIALS_RELATIVE_URI của task). Khoá lấy từ STS AssumeRole (LocalStack) lúc dựng.\nconst http = require('http'), fs = require('fs');\nconst DUONG = '/v2/credentials/' + process.env.GUID;\nhttp.createServer((q, r) => {\n  const ok = q.url === DUONG;\n  console.log(`agent: GET ${q.url} ⇒ ${ok ? 200 : 404}`);\n  if (!ok) { r.writeHead(404); return r.end('{\"code\":\"NotFound\"}\\n'); }\n  r.writeHead(200, { 'content-type': 'application/json' });\n  r.end(fs.readFileSync('/creds.json'));\n}).listen(80);");
const MA_DOCKERFILE = bash("FROM node:22-alpine\nARG BAN=1\nENV NODE_ENV=production BAN=$BAN\nWORKDIR /app\nCOPY app.js .\nUSER node\nEXPOSE 8080\nCMD [\"node\", \"app.js\"]");
const MA_CHAM = bash("# Bộ chấm 8 phép cho Lab 7 (ECR + ECS). In ✓/✗ từng phép và ĐIỂM n/8.\nsource ~/vbg-dp/scratchpad/aws/lab/c7/chung7.sh\nd=0; ok() { echo \"✓ $1\"; d=$((d+1)); }; ko() { echo \"✗ $1\"; }\nR=$(m ecr describe-repositories --repository-names labflow-api --query 'repositories[0].[imageTagMutability,imageScanningConfiguration.scanOnPush]' --output text)\n[ \"$(echo \"$R\" | cut -f1)\" = IMMUTABLE ] && ok \"1. ECR: tag bất biến (IMMUTABLE)\" || ko \"1. ECR: tag còn ghi đè được ($(echo \"$R\" | cut -f1))\"\n[ \"$(echo \"$R\" | cut -f2)\" = True ] && ok \"2. ECR: quét lỗ hổng khi đẩy (scanOnPush)\" || ko \"2. ECR: chưa bật scanOnPush\"\nm ecr get-lifecycle-policy --repository-name labflow-api --query lifecyclePolicyText --output text | grep -q untagged && ok \"3. ECR: có luật vòng đời dọn ảnh không tag\" || ko \"3. ECR: chưa có luật vòng đời\"\nTD=$(m ecs describe-task-definition --task-definition labflow-api --query taskDefinition --output json)\necho \"$TD\" > $LAM/td-hien.json\npython3 - $LAM/td-hien.json <<'P' > $LAM/td-kq.txt\nimport json,sys,re\nt=json.load(open(sys.argv[1])); c=t[\"containerDefinitions\"][0]\nlo=[e[\"name\"] for e in c.get(\"environment\",[]) if re.search(r\"PASS|SECRET|TOKEN|KEY\",e[\"name\"],re.I)]\nprint(\"4\", \"ok\" if (not lo and c.get(\"secrets\")) else \"ko\", \",\".join(lo) or \"-\")\ne,r=t.get(\"executionRoleArn\"),t.get(\"taskRoleArn\"); print(\"5\", \"ok\" if (e and r and e!=r) else \"ko\", (e or \"-\").split(\"/\")[-1]+\" / \"+(r or \"-\").split(\"/\")[-1])\nlg=(c.get(\"logConfiguration\") or {}).get(\"logDriver\"); print(\"6\", \"ok\" if lg in (\"awslogs\",\"awsfirelens\") else \"ko\", lg or \"-\")\nprint(\"R\", t[\"taskDefinitionArn\"])\nP\nread _ k4 v4 < <(grep '^4' $LAM/td-kq.txt); read _ k5 v5 < <(grep '^5' $LAM/td-kq.txt); read _ k6 v6 < <(grep '^6' $LAM/td-kq.txt); MOI=$(grep '^R' $LAM/td-kq.txt | cut -d' ' -f2)\n[ $k4 = ok ] && ok \"4. Task definition: mật khẩu đi qua secrets (valueFrom), không nằm trong environment\" || ko \"4. Task definition: bí mật nằm trần trong environment ($v4)\"\n[ $k5 = ok ] && ok \"5. Tách execution role và task role ($v5)\" || ko \"5. Execution role và task role trùng hoặc thiếu ($v5)\"\n[ $k6 = ok ] && ok \"6. Log đi CloudWatch ($v6)\" || ko \"6. Không có logConfiguration ⇒ task chết là mất log\"\nS=$(m ecs describe-services --cluster labflow --services labflow-api --query 'services[0].[networkConfiguration.awsvpcConfiguration.assignPublicIp,desiredCount,taskDefinition]' --output text)\nread IP DC TDS <<< \"$S\"\n[ \"$IP\" = DISABLED ] && [ \"$DC\" -ge 2 ] && ok \"7. Service: task không IP công khai, desiredCount=$DC\" || ko \"7. Service: assignPublicIp=$IP, desiredCount=$DC (cần DISABLED và ≥ 2)\"\n[ \"${TDS##*/}\" = \"${MOI##*/}\" ] && ok \"8. Service chạy revision mới nhất (${MOI##*/})\" || ko \"8. Service vẫn chạy ${TDS##*/}, revision mới nhất là ${MOI##*/}\"\necho \"ĐIỂM: $d/8\"");
const MA_TRUOC = bash("# Bản \"làm vội\" của đồng đội: chạy được, nhưng sai 8 chỗ. (Moto; bỏ --endpoint-url trong chung7.sh là chạy với tài khoản thật)\nsource ~/vbg-dp/scratchpad/aws/lab/c7/chung7.sh\nVPC=$(m ec2 describe-vpcs --query 'Vpcs[0].VpcId' --output text)\nSA=$(m ec2 create-subnet --vpc-id $VPC --cidr-block 172.31.96.0/24 --availability-zone ap-southeast-1a --query Subnet.SubnetId --output text)\nSG=$(m ec2 create-security-group --group-name labflow-task --description 'ECS task' --vpc-id $VPC --query GroupId --output text)\nm ecr create-repository --repository-name labflow-api >/dev/null\nm ecs create-cluster --cluster-name labflow >/dev/null\ncat > $LAM/td-voi.json <<'J'\n{\"family\":\"labflow-api\",\"networkMode\":\"awsvpc\",\"requiresCompatibilities\":[\"FARGATE\"],\"cpu\":\"256\",\"memory\":\"512\",\n \"executionRoleArn\":\"arn:aws:iam::123456789012:role/labflow-admin\",\"taskRoleArn\":\"arn:aws:iam::123456789012:role/labflow-admin\",\n \"containerDefinitions\":[{\"name\":\"api\",\"image\":\"123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/labflow-api:latest\",\"essential\":true,\"cpu\":256,\"memory\":512,\n  \"portMappings\":[{\"containerPort\":8080}],\n  \"environment\":[{\"name\":\"NODE_ENV\",\"value\":\"production\"},{\"name\":\"DB_PASSWORD\",\"value\":\"Labflow@2026\"}]}]}\nJ\nm ecs register-task-definition --cli-input-json file:///aws/td-voi.json >/dev/null\nm ecs create-service --cluster labflow --service-name labflow-api --task-definition labflow-api:1 --desired-count 1 --launch-type FARGATE \\\n  --network-configuration \"awsvpcConfiguration={subnets=[$SA],securityGroups=[$SG],assignPublicIp=ENABLED}\" >/dev/null\necho \"$SA $SG\" > $LAM/mang.txt\necho \"đã dựng: repo labflow-api, cluster labflow, task definition labflow-api:1, service labflow-api\"");
const MA_GIAI = bash("# Lời giải Lab 7 — sửa tại chỗ, không xoá dựng lại.\nsource ~/vbg-dp/scratchpad/aws/lab/c7/chung7.sh\nread SA SG < $LAM/mang.txt\nVPC=$(m ec2 describe-vpcs --query 'Vpcs[0].VpcId' --output text)\nSB=$(m ec2 create-subnet --vpc-id $VPC --cidr-block 172.31.98.0/24 --availability-zone ap-southeast-1b --query Subnet.SubnetId --output text)\nM ecr put-image-tag-mutability --repository-name labflow-api --image-tag-mutability IMMUTABLE --query imageTagMutability --output text\nM ecr put-image-scanning-configuration --repository-name labflow-api --image-scanning-configuration scanOnPush=true --query imageScanningConfiguration --output text\ncat > $LAM/vong-doi.json <<'J'\n{\"rules\":[{\"rulePriority\":1,\"description\":\"untagged > 7 days\",\"selection\":{\"tagStatus\":\"untagged\",\"countType\":\"sinceImagePushed\",\"countUnit\":\"days\",\"countNumber\":7},\"action\":{\"type\":\"expire\"}}]}\nJ\nM ecr put-lifecycle-policy --repository-name labflow-api --lifecycle-policy-text file:///aws/vong-doi.json --query repositoryName --output text\ncat > $LAM/td-giai.json <<'J'\n{\"family\":\"labflow-api\",\"networkMode\":\"awsvpc\",\"requiresCompatibilities\":[\"FARGATE\"],\"cpu\":\"256\",\"memory\":\"512\",\n \"executionRoleArn\":\"arn:aws:iam::123456789012:role/labflow-exec\",\"taskRoleArn\":\"arn:aws:iam::123456789012:role/labflow-task\",\n \"containerDefinitions\":[{\"name\":\"api\",\"image\":\"123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/labflow-api:v1\",\"essential\":true,\"cpu\":256,\"memory\":512,\n  \"portMappings\":[{\"containerPort\":8080}],\n  \"environment\":[{\"name\":\"NODE_ENV\",\"value\":\"production\"}],\n  \"secrets\":[{\"name\":\"DB_PASSWORD\",\"valueFrom\":\"arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:labflow/prod/db\"}],\n  \"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"/ecs/labflow-api\",\"awslogs-region\":\"ap-southeast-1\",\"awslogs-stream-prefix\":\"api\"}}}]}\nJ\nM ecs register-task-definition --cli-input-json file:///aws/td-giai.json --query 'taskDefinition.[family,revision]' --output text\nREV=$(m ecs describe-task-definition --task-definition labflow-api --query taskDefinition.revision --output text)\n# Ghi RÕ số revision vừa đăng ký (AWS nhận cả tên family trần, Moto thì không — ghi rõ vẫn là thói quen tốt)\nM ecs update-service --cluster labflow --service labflow-api --task-definition labflow-api:$REV --desired-count 2 --network-configuration \"awsvpcConfiguration={subnets=[$SA,$SB],securityGroups=[$SG],assignPublicIp=DISABLED}\" --query 'service.[taskDefinition,desiredCount]' --output text");
const MA_DON = bash("# Dọn Lab 7: service ⇒ task definition ⇒ cluster ⇒ repository (ảnh đi theo --force)\nsource ~/vbg-dp/scratchpad/aws/lab/c7/chung7.sh\nM ecs update-service --cluster labflow --service labflow-api --desired-count 0 --query service.desiredCount --output text\nM ecs delete-service --cluster labflow --service labflow-api --force --query service.status --output text\nfor a in $(m ecs list-task-definitions --family-prefix labflow-api --query taskDefinitionArns --output text); do\n  M ecs deregister-task-definition --task-definition \"$a\" --query 'taskDefinition.[revision,status]' --output text; done\nM ecs delete-cluster --cluster labflow --query cluster.status --output text\nM ecr delete-repository --repository-name labflow-api --force --query repository.repositoryName --output text");
const MA_CONGI = bash("# Còn gì đang tính tiền / còn sót? (cluster, service, task definition ACTIVE, repository ECR)\nsource ~/vbg-dp/scratchpad/aws/lab/c7/chung7.sh\necho \"cluster ACTIVE:  $(m ecs describe-clusters --clusters labflow --query \"length(clusters[?status=='ACTIVE'])\")\"\necho \"service ACTIVE:  $(m ecs describe-services --cluster labflow --services labflow-api --query \"length(services[?status=='ACTIVE'])\" 2>/dev/null || echo 0)\"\necho \"task def ACTIVE: $(m ecs list-task-definitions --status ACTIVE --query 'length(taskDefinitionArns)')\"\necho \"repository ECR:  $(m ecr describe-repositories --query 'length(repositories)')\"");
/* ═════ 7.1 — ECR ═════ */
const L71_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 1</span>
<h2>7.1 — ECR: your private image registry, and why a tag is not a version</h2>
<p class="lead">Chapters 4–6 put your API on a machine you manage. From here on the unit you ship is a <strong>container image</strong>, and every image needs a home that the runtime can pull from. On AWS that home is <strong>Amazon ECR</strong> (Elastic Container Registry). This lesson creates a repository the safe way, logs Docker in with a short-lived token, pushes a real image to a real registry, then shows — with a running container — how an overwritten tag silently changes what you deploy, and how a scanner finds a password you thought you deleted.</p>

<h3>The picture: a warehouse with numbered pallets</h3>
<p>Think of a warehouse. Each pallet gets a <strong>serial number burned into the wood</strong> when it is packed — that is the image <strong>digest</strong> (<code>sha256:…</code>), computed from the content, impossible to change without changing the content. The paper <strong>label</strong> stuck on the side — <code>v1</code>, <code>latest</code> — is the <strong>tag</strong>. Anyone with access can peel a label off and stick it on another pallet. ECR is the warehouse: it has a gate (IAM + login token), a rule book for throwing away old pallets (lifecycle policy), an inspector at the door (image scanning), and an optional rule that a label, once stuck, can never be moved (<strong>tag immutability</strong>).</p>

<h3>Five building blocks</h3>
<ul>
  <li><strong>Registry</strong> — one per account per Region: <code>&lt;account-id&gt;.dkr.ecr.ap-southeast-1.amazonaws.com</code>.</li>
  <li><strong>Repository</strong> — one per application image, e.g. <code>labflow-api</code>. Permissions, scanning, immutability and lifecycle are set per repository.</li>
  <li><strong>Image</strong> — identified by its digest; it may carry zero, one or many tags. An image with no tag is <em>untagged</em> (usually the old image whose tag moved away).</li>
  <li><strong>Authorization token</strong> — <code>aws ecr get-login-password</code> turns your IAM identity into a Docker password valid for <strong>12 hours</strong>. Nothing long-lived is stored for the registry itself.</li>
  <li><strong>Lifecycle policy</strong> — rules that expire images by age or count, so the repository (and the bill: storage is per GB-month) does not grow forever.</li>
</ul>

<h3>See it running (1): a repository with the safe switches on</h3>
<p>LocalStack's free edition has no ECR, so this ran on <strong>Moto</strong> — configuration only, there is no registry behind it.</p>
${OUT_71_ECR_API}
<ul>
  <li><code>IMMUTABLE</code>: pushing an existing tag with different content fails with <code>ImageTagAlreadyExistsException</code>. There is also <code>IMMUTABLE_WITH_EXCLUSION</code>, which keeps everything immutable except tags matching a filter you name (for example <code>dev-*</code>).</li>
  <li><code>scanOnPush True</code>: every pushed image is scanned. <strong>Basic scanning</strong> (free) checks operating-system packages with AWS's own engine; <strong>enhanced scanning</strong> (Amazon Inspector, paid) also checks language packages (npm, Maven…) and keeps re-scanning when new CVEs are published.</li>
  <li><code>KMS</code>: images are always encrypted at rest; KMS lets you use your own key and audit its use in CloudTrail.</li>
  <li>Two lifecycle rules: untagged images older than 7 days go away; only the 10 newest <code>v*</code> releases are kept. Without rule 1, every CI build that moves <code>latest</code> leaves an orphan behind.</li>
  <li><strong>Moto differs:</strong> the token's <code>expiresAt</code> is a fixed date in 2015. On AWS it is 12 hours after the call.</li>
</ul>

<h3>See it running (2): login, push, and the digest</h3>
<p>To push real bytes, <code>registry:2</code> — the open-source registry that speaks the same Docker Registry HTTP API as ECR — plays ECR on port 43750, with a 64-character token as password, user <code>AWS</code> exactly like ECR.</p>
${OUT_71_ECR_LOGIN}
<ol>
  <li>Without login, the push is refused: a private registry is private.</li>
  <li><code>docker login</code> succeeds — and Docker warns that the credential is stored <strong>unencrypted</strong>. Decoding the <code>auth</code> field gives <code>AWS:&lt;token&gt;</code>. Whoever copies that file can push and pull as you until the token expires. On ECR that is at most 12 hours; on registries with long-lived passwords it is forever. A credential helper (<code>amazon-ecr-credential-helper</code>) avoids the file altogether.</li>
</ol>
<p>The image is the small LabFlow API used in the whole chapter:</p>
${MA_DOCKERFILE}
${OUT_71_ECR_THAT}
<ul>
  <li><code>id</code> prints <code>uid=1000(node)</code>: the process does not run as root (the <code>USER node</code> line). If an attacker breaks the app, they land as an unprivileged user.</li>
  <li>The push prints the <strong>digest</strong>. That digest is what you should deploy.</li>
  <li>Then someone rebuilt the image with <code>BAN=2</code> and pushed it <strong>to the same tag</strong>. The registry accepted it silently (this repository is mutable). Pulling <code>:v1</code> now runs version 2 — the same tag means different code yesterday and today. Pulling <code>@sha256:7c18…</code> still runs version 1, because a digest cannot lie.</li>
</ul>
<p>Rule for production: <strong>repositories immutable, deployments by digest</strong> (or by a tag that is unique per build, such as the Git commit SHA). Then "what is running" always has one answer, and rollback means pointing back at an old digest that still exists.</p>

<h3>See it running (3): the inspector at the door</h3>
<p>ECR's enhanced scanning is Amazon Inspector, which only runs on a real account. <strong>Trivy</strong> (open source, the same family of checks) scanned two images: the end-of-life <code>node:16-alpine</code> and our image on <code>node:22-alpine</code>.</p>
${OUT_71_QUET_A}
<ul>
  <li>The old base has 42 HIGH/CRITICAL findings, including vulnerable OS packages (Alpine 3.18). The current base has 0 in the OS — every remaining finding is in <strong>npm's own bundled packages</strong> (<code>brace-expansion</code>…), which the app never uses at runtime. Fix: a multi-stage build that copies only <code>node</code> and your files, or a distroless/"slim" runtime image without npm.</li>
  <li>A scan report is a to-do list, not a verdict. Read which package, whether a fix exists, and whether that code path even runs. That reading is a skill interviewers like to probe.</li>
</ul>
${OUT_71_QUET_B}
<p>The <code>.env</code> file was deleted in the next layer, yet the secret scanner found the AWS secret key <strong>in the layer created by COPY</strong>. An image is a stack of tar files; <code>RUN rm</code> only adds a layer that hides the file — the bytes are still shipped to everyone who can pull the image (lesson 6.3 showed the same with <code>docker history</code>). Secrets go in at runtime (lesson 7.3), never into a build.</p>

<h3>ECR vs the GHCR that cuongthai.com uses</h3>
<table>
  <thead><tr><th></th><th>GitHub Container Registry (what cuongthai.com uses today)</th><th>Amazon ECR</th></tr></thead>
  <tbody>
    <tr><td>Login</td><td>GitHub token (often long-lived)</td><td>IAM identity ⇒ 12-hour token; from GitHub Actions via OIDC (lesson 1.6), no stored key</td></tr>
    <tr><td>Pull from AWS (ECS/EC2)</td><td>Leaves AWS over the Internet; needs a stored GitHub token</td><td>Stays in the Region; the task execution role pulls; private subnets can use VPC endpoints (Chapter 3.4)</td></tr>
    <tr><td>Scanning</td><td>Via GitHub Advanced Security / Dependabot</td><td>Basic (OS, free) or enhanced (Inspector, paid)</td></tr>
    <tr><td>Clean-up</td><td>Retention scripts / actions</td><td>Lifecycle policy built in</td></tr>
    <tr><td>Price</td><td>Free for public, quota for private</td><td>Storage per GB-month + data transfer out of the Region</td></tr>
  </tbody>
</table>
<p>The principle behind cuongthai.com's own pipeline is the same: build once on a build machine, push to a registry tagged with the commit, and have the server only <em>pull and swap</em>. Moving to AWS changes the registry's name, not the idea.</p>

<h3>Hacker's corner: registries are a supply chain</h3>
<ul>
  <li><strong>Docker Hub, April 2019</strong>: unauthorized access to a database exposed data of about 190,000 accounts, including GitHub/Bitbucket tokens used for automated builds. Tokens for build systems are keys to your source and your images — keep them short-lived and scoped.</li>
  <li><strong>Sysdig, 2022</strong>: of more than 250,000 Linux images analysed on Docker Hub, 1,652 were malicious. Crypto-miners were the most common; <strong>embedded secrets in layers</strong> came second. Typosquatting names imitate popular images. Pull base images only from official/verified publishers, pin them by digest, and scan.</li>
  <li><strong>xz Utils, March 2024 (CVE-2024-3094)</strong>: a backdoor was slipped into a compression library and reached development versions of some Linux distributions before an engineer noticed. A pinned digest plus scanning would not detect a brand-new backdoor on day one, but it gives you a precise list of which images contained the bad version once it is known.</li>
</ul>
<p>Defence summary: private repositories, immutable tags, deploy by digest, scan on push, minimal base images, non-root user, no secrets in layers, and IAM policies that let CI <em>push</em> to one repository and runtimes only <em>pull</em>.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
  <li><strong>"Tag or digest — what do you deploy, and why?"</strong> — A digest; it is content-addressed and cannot be moved. Tags are labels; with immutable tags a unique tag per build is acceptable.</li>
  <li><strong>"How does Docker log in to ECR without a stored password?"</strong> — <code>aws ecr get-login-password</code> exchanges the caller's IAM credentials for a 12-hour token; in CI the IAM credentials come from OIDC.</li>
  <li><strong>"I deleted the .env in my Dockerfile — is it safe?"</strong> — No; the earlier layer still contains it. Rebuild without it, rotate the secret, and inject secrets at runtime.</li>
  <li><strong>"Basic vs enhanced scanning?"</strong> — Basic: OS packages, on push or manual, free. Enhanced: Amazon Inspector, OS + language packages, continuous re-scan, paid.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<p>Using <code>scratchpad/aws/lab/c7/71.sh</code> as a model, rewrite the Dockerfile as a <strong>multi-stage</strong> build whose final stage has no npm, push it to the lab registry, and scan it with Trivy.</p>
<p><strong>Pass when</strong>: Trivy reports fewer HIGH/CRITICAL findings than <code>labflow-api:v1</code> (10), <code>docker run … id</code> still shows a non-root user, and you can start the container <strong>by digest</strong>.</p>
${giai('Hint: one way to drop npm', bash(`
FROM node:22-alpine AS chay
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn-*
WORKDIR /app
COPY app.js .
USER node
CMD ["node", "app.js"]
# or: copy /usr/local/bin/node into a distroless/static base in a second stage`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ECR</span><span class="v">Managed private Docker/OCI registry, one per account per Region.</span></div>
  <div class="kv"><span class="k">Repository</span><span class="v">Holds the images of one application; scanning, immutability and lifecycle are set here.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v">sha256 of the image manifest; content-addressed, cannot be changed.</span></div>
  <div class="kv"><span class="k">Tag</span><span class="v">A movable label pointing to a digest, unless the repository is IMMUTABLE.</span></div>
  <div class="kv"><span class="k">Lifecycle policy</span><span class="v">Rules that expire images by age or count.</span></div>
  <div class="kv"><span class="k">Enhanced scanning</span><span class="v">Amazon Inspector scanning of OS and language packages, continuously.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>ECR = private registry with IAM login (12-hour token), scanning, immutability and lifecycle.</li>
  <li>A tag can be overwritten silently; a digest cannot. Immutable repositories, deploy by digest.</li>
  <li>Old base images carry dozens of known CVEs; scan on push and keep the runtime image minimal.</li>
  <li>Deleting a file in a later layer does not remove it from the image.</li>
  <li>Same idea as cuongthai.com's registry today: build once, push, the server only pulls.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html', '🏷️', 'AWS docs — Preventing image tags from being overwritten', 'IMMUTABLE, exclusion filters and the exact error.')}
${tl('https://sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/', '🕵️', 'Sysdig — Malicious images on Docker Hub (2022)', '1,652 malicious images out of 250,000 analysed: miners, embedded secrets, typosquatting.')}

<h3>Sources</h3>
<ul>
  <li>ECR registry authentication (12-hour token): <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html</a></li>
  <li>Tag immutability: <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html</a></li>
  <li>Image scanning (basic, enhanced): <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html</a></li>
  <li>Lifecycle policies: <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html</a></li>
  <li>Container image best practices for ECS: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-considerations.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/container-considerations.html</a></li>
  <li>Docker build best practices: <a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">docs.docker.com/build/building/best-practices/</a></li>
  <li>Trivy: <a href="https://trivy.dev/" target="_blank" rel="noopener">trivy.dev</a></li>
  <li>Docker Hub breach (April 2019): <a href="https://www.zdnet.com/article/docker-hub-hack-exposed-data-of-190000-users/" target="_blank" rel="noopener">zdnet.com/article/docker-hub-hack-exposed-data-of-190000-users/</a></li>
  <li>Sysdig, malicious Docker Hub images (2022): <a href="https://sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/" target="_blank" rel="noopener">sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/</a></li>
  <li>CVE-2024-3094 (xz Utils): <a href="https://nvd.nist.gov/vuln/detail/CVE-2024-3094" target="_blank" rel="noopener">nvd.nist.gov/vuln/detail/CVE-2024-3094</a></li>
</ul>
</div>
`;
const L71_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 1</span>
<h2>7.1 — ECR: kho ảnh riêng, và vì sao tag không phải là phiên bản</h2>
<p class="lead">Chương 4–6 đặt API lên một máy bạn tự quản. Từ đây thứ bạn giao đi là một <strong>ảnh container</strong>, và ảnh nào cũng cần một chỗ ở để nơi chạy kéo về. Trên AWS chỗ ở đó là <strong>Amazon ECR</strong> (Elastic Container Registry). Bài này tạo repository đúng cách, cho Docker đăng nhập bằng token ngắn hạn, đẩy một ảnh thật lên một registry thật, rồi cho bạn thấy — bằng container đang chạy — một tag bị ghi đè lặng lẽ đổi thứ bạn deploy ra sao, và bộ quét tìm thấy mật khẩu mà bạn tưởng đã xoá như thế nào.</p>

<h3>Liên tưởng: nhà kho với những pallet đánh số</h3>
<p>Hình dung một nhà kho. Mỗi pallet được <strong>khắc số sê-ri vào gỗ</strong> lúc đóng hàng — đó là <strong>digest</strong> của ảnh (<code>sha256:…</code>), tính từ nội dung, không đổi được nếu không đổi nội dung. Còn <strong>nhãn giấy</strong> dán bên hông — <code>v1</code>, <code>latest</code> — là <strong>tag</strong>. Ai có quyền vào kho cũng bóc nhãn ra dán sang pallet khác được. ECR là nhà kho đó: có cổng (IAM + token đăng nhập), có sổ quy định vứt pallet cũ (lifecycle policy), có người kiểm hàng ở cửa (quét ảnh), và có thể bật luật "nhãn đã dán thì không bao giờ được chuyển" (<strong>tag bất biến</strong>).</p>

<h3>Năm khối cơ bản</h3>
<ul>
  <li><strong>Registry</strong> — mỗi tài khoản mỗi Region một cái: <code>&lt;account-id&gt;.dkr.ecr.ap-southeast-1.amazonaws.com</code>.</li>
  <li><strong>Repository</strong> — mỗi ảnh ứng dụng một cái, ví dụ <code>labflow-api</code>. Quyền, quét, bất biến và vòng đời đặt theo từng repository.</li>
  <li><strong>Image</strong> — định danh bằng digest; có thể mang không, một hay nhiều tag. Ảnh không còn tag nào là <em>untagged</em> (thường là ảnh cũ vừa bị tag "dời" đi chỗ khác).</li>
  <li><strong>Authorization token</strong> — <code>aws ecr get-login-password</code> đổi danh tính IAM của bạn thành một mật khẩu Docker sống <strong>12 giờ</strong>. Không có mật khẩu dài hạn nào cho registry.</li>
  <li><strong>Lifecycle policy</strong> — luật cho ảnh hết hạn theo tuổi hoặc theo số lượng, để repository (và hoá đơn: lưu trữ tính theo GB-tháng) không phình mãi.</li>
</ul>

<h3>Xem chạy thật (1): repository bật đủ công tắc an toàn</h3>
<p>Bản miễn phí của LocalStack không có ECR, nên phần này chạy trên <strong>Moto</strong> — chỉ là cấu hình, phía sau không có registry nào.</p>
${OUT_71_ECR_API}
<ul>
  <li><code>IMMUTABLE</code>: đẩy một tag đã có với nội dung khác sẽ hỏng với lỗi <code>ImageTagAlreadyExistsException</code>. Còn có chế độ <code>IMMUTABLE_WITH_EXCLUSION</code>: mọi tag bất biến trừ các tag khớp bộ lọc bạn khai (ví dụ <code>dev-*</code>).</li>
  <li><code>scanOnPush True</code>: ảnh nào đẩy lên cũng được quét. <strong>Basic scanning</strong> (miễn phí) quét gói của hệ điều hành bằng bộ máy riêng của AWS; <strong>enhanced scanning</strong> (Amazon Inspector, trả tiền) quét thêm gói của ngôn ngữ (npm, Maven…) và quét lại liên tục khi có CVE mới.</li>
  <li><code>KMS</code>: ảnh lúc nào cũng được mã hoá khi lưu; KMS cho bạn dùng khoá riêng và soát việc dùng khoá trong CloudTrail.</li>
  <li>Hai luật vòng đời: ảnh không tag quá 7 ngày thì xoá; chỉ giữ 10 bản <code>v*</code> mới nhất. Thiếu luật 1, mỗi lần CI dời tag <code>latest</code> lại để lại một ảnh mồ côi.</li>
  <li><strong>Moto khác AWS:</strong> <code>expiresAt</code> của token là một ngày cố định năm 2015. Trên AWS nó là 12 giờ sau lúc gọi.</li>
</ul>

<h3>Xem chạy thật (2): đăng nhập, đẩy ảnh, và digest</h3>
<p>Để đẩy byte thật, <code>registry:2</code> — registry mã nguồn mở nói cùng giao thức Docker Registry HTTP API với ECR — đóng vai ECR ở cổng 43750, mật khẩu là một token 64 ký tự, user <code>AWS</code> y như ECR.</p>
${OUT_71_ECR_LOGIN}
<ol>
  <li>Chưa đăng nhập thì bị từ chối đẩy: registry riêng là riêng.</li>
  <li><code>docker login</code> thành công — và Docker cảnh báo thông tin đăng nhập được lưu <strong>không mã hoá</strong>. Giải mã trường <code>auth</code> ra <code>AWS:&lt;token&gt;</code>. Ai chép được tệp đó là đẩy/kéo được dưới tên bạn tới khi token hết hạn. Với ECR là tối đa 12 giờ; với registry dùng mật khẩu dài hạn thì là mãi mãi. Credential helper (<code>amazon-ecr-credential-helper</code>) giúp bỏ hẳn tệp đó.</li>
</ol>
<p>Ảnh dùng suốt chương là API LabFlow thu nhỏ:</p>
${MA_DOCKERFILE}
${OUT_71_ECR_THAT}
<ul>
  <li><code>id</code> in <code>uid=1000(node)</code>: tiến trình không chạy bằng root (dòng <code>USER node</code>). Kẻ tấn công phá được ứng dụng cũng chỉ đứng ở một user không đặc quyền.</li>
  <li>Lệnh push in ra <strong>digest</strong>. Digest đó mới là thứ bạn nên deploy.</li>
  <li>Rồi có người build lại ảnh với <code>BAN=2</code> và đẩy <strong>đè đúng tag cũ</strong>. Registry nhận im lặng (repository này cho ghi đè). Kéo <code>:v1</code> giờ chạy bản 2 — cùng một tag mà hôm qua với hôm nay là hai bộ mã khác nhau. Kéo <code>@sha256:7c18…</code> vẫn chạy bản 1, vì digest không nói dối được.</li>
</ul>
<p>Luật cho production: <strong>repository bất biến, deploy theo digest</strong> (hoặc theo tag duy nhất cho mỗi lần build, như mã SHA của commit Git). Khi đó câu hỏi "đang chạy cái gì" chỉ có một đáp án, và rollback chỉ là trỏ lại một digest cũ vẫn còn đó.</p>

<h3>Xem chạy thật (3): người kiểm hàng ở cửa</h3>
<p>Enhanced scanning của ECR là Amazon Inspector, chỉ chạy trên tài khoản thật. <strong>Trivy</strong> (mã nguồn mở, cùng loại phép kiểm) quét hai ảnh: <code>node:16-alpine</code> đã hết hỗ trợ và ảnh của ta trên <code>node:22-alpine</code>.</p>
${OUT_71_QUET_A}
<ul>
  <li>Nền cũ có 42 lỗ hổng HIGH/CRITICAL, gồm cả gói hệ điều hành dính lỗi (Alpine 3.18). Nền hiện hành có 0 ở hệ điều hành — mọi lỗ hổng còn lại nằm trong <strong>chính các gói npm đi kèm</strong> (<code>brace-expansion</code>…), thứ ứng dụng không hề dùng lúc chạy. Cách sửa: build nhiều tầng (multi-stage) chỉ chép <code>node</code> và tệp của bạn, hoặc dùng ảnh chạy kiểu distroless/"slim" không có npm.</li>
  <li>Báo cáo quét là danh sách việc cần làm, không phải bản án. Đọc xem gói nào, đã có bản sửa chưa, đoạn mã đó có chạy không. Kỹ năng đọc này phỏng vấn viên rất hay dò.</li>
</ul>
${OUT_71_QUET_B}
<p>Tệp <code>.env</code> đã bị xoá ở lớp kế tiếp, vậy mà bộ quét bí mật vẫn tìm thấy khoá bí mật AWS <strong>trong lớp do lệnh COPY tạo</strong>. Ảnh là một chồng tệp tar; <code>RUN rm</code> chỉ thêm một lớp che tệp đi — byte vẫn được giao cho mọi người kéo được ảnh (bài 6.3 đã thấy điều này bằng <code>docker history</code>). Bí mật đưa vào lúc chạy (bài 7.3), không bao giờ đưa vào lúc build.</p>

<h3>ECR so với GHCR mà cuongthai.com đang dùng</h3>
<table>
  <thead><tr><th></th><th>GitHub Container Registry (cuongthai.com dùng hiện nay)</th><th>Amazon ECR</th></tr></thead>
  <tbody>
    <tr><td>Đăng nhập</td><td>Token GitHub (thường dài hạn)</td><td>Danh tính IAM ⇒ token 12 giờ; từ GitHub Actions qua OIDC (bài 1.6), không lưu khoá</td></tr>
    <tr><td>Kéo về từ AWS (ECS/EC2)</td><td>Ra Internet khỏi AWS; cần lưu token GitHub</td><td>Ở trong Region; execution role của task kéo; subnet private dùng VPC endpoint được (Chương 3.4)</td></tr>
    <tr><td>Quét</td><td>Qua GitHub Advanced Security / Dependabot</td><td>Basic (hệ điều hành, miễn phí) hoặc enhanced (Inspector, trả tiền)</td></tr>
    <tr><td>Dọn ảnh cũ</td><td>Script / action giữ bản</td><td>Lifecycle policy có sẵn</td></tr>
    <tr><td>Giá</td><td>Miễn phí cho ảnh công khai, có hạn mức cho ảnh riêng</td><td>Lưu trữ theo GB-tháng + phí truyền dữ liệu ra khỏi Region</td></tr>
  </tbody>
</table>
<p>Nguyên tắc trong quy trình của chính cuongthai.com cũng vậy: build một lần trên máy build, đẩy lên registry với tag theo commit, máy chủ chỉ <em>kéo về và tráo</em>. Lên AWS chỉ đổi tên registry, không đổi ý tưởng.</p>

<h3>Góc hacker: registry là một chuỗi cung ứng</h3>
<ul>
  <li><strong>Docker Hub, tháng 4/2019</strong>: một cơ sở dữ liệu bị truy cập trái phép làm lộ dữ liệu khoảng 190.000 tài khoản, gồm cả token GitHub/Bitbucket dùng cho build tự động. Token của hệ thống build là chìa khoá vào mã nguồn và ảnh của bạn — giữ chúng ngắn hạn và hẹp quyền.</li>
  <li><strong>Sysdig, 2022</strong>: trong hơn 250.000 ảnh Linux được phân tích trên Docker Hub có 1.652 ảnh độc hại. Ảnh đào tiền ảo nhiều nhất; <strong>bí mật nằm sẵn trong lớp ảnh</strong> đứng thứ hai. Có ảnh đặt tên nhái (typosquatting) ảnh nổi tiếng. Chỉ kéo ảnh nền từ nhà phát hành chính thức/đã xác minh, ghim theo digest, và quét.</li>
  <li><strong>xz Utils, tháng 3/2024 (CVE-2024-3094)</strong>: một cửa hậu được cài vào thư viện nén và đã lọt vào bản đang phát triển của vài bản phân phối Linux trước khi một kỹ sư phát hiện. Ghim digest + quét không bắt được cửa hậu mới tinh ngay ngày đầu, nhưng cho bạn danh sách chính xác ảnh nào chứa bản xấu ngay khi nó được công bố.</li>
</ul>
<p>Tóm lại cách phòng: repository riêng, tag bất biến, deploy theo digest, quét khi đẩy, ảnh nền tối giản, user không phải root, không bí mật trong lớp ảnh, và policy IAM cho CI chỉ <em>đẩy</em> vào một repository còn nơi chạy chỉ được <em>kéo</em>.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Deploy theo tag hay digest, vì sao?"</strong> — Digest; nó định danh theo nội dung, không dời được. Tag là nhãn; nếu tag bất biến thì một tag duy nhất cho mỗi lần build cũng được.</li>
  <li><strong>"Docker đăng nhập ECR thế nào mà không lưu mật khẩu?"</strong> — <code>aws ecr get-login-password</code> đổi thông tin xác thực IAM của người gọi thành token 12 giờ; trong CI thông tin IAM đến từ OIDC.</li>
  <li><strong>"Em đã xoá .env trong Dockerfile rồi, an toàn chưa?"</strong> — Chưa; lớp trước vẫn chứa nó. Build lại không có tệp đó, xoay bí mật, và bơm bí mật lúc chạy.</li>
  <li><strong>"Basic và enhanced scanning khác gì?"</strong> — Basic: gói hệ điều hành, quét khi đẩy hoặc bấm tay, miễn phí. Enhanced: Amazon Inspector, hệ điều hành + gói ngôn ngữ, quét lại liên tục, trả tiền.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Lấy <code>scratchpad/aws/lab/c7/71.sh</code> làm mẫu, viết lại Dockerfile thành build <strong>nhiều tầng</strong> mà tầng cuối không còn npm, đẩy lên registry của lab, rồi quét bằng Trivy.</p>
<p><strong>Đạt khi</strong>: Trivy báo ít lỗ hổng HIGH/CRITICAL hơn <code>labflow-api:v1</code> (10), <code>docker run … id</code> vẫn là user không phải root, và bạn chạy được container <strong>theo digest</strong>.</p>
${giai('Gợi ý: một cách bỏ npm', bash(`
FROM node:22-alpine AS chay
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn-*
WORKDIR /app
COPY app.js .
USER node
CMD ["node", "app.js"]
# hoặc: chép /usr/local/bin/node sang một nền distroless/static ở tầng thứ hai`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ECR</span><span class="v">Registry ảnh Docker/OCI riêng, có quản lý, mỗi tài khoản mỗi Region một cái.</span></div>
  <div class="kv"><span class="k">Repository</span><span class="v">Chứa ảnh của một ứng dụng; quét, bất biến và vòng đời đặt ở đây.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v">sha256 của manifest ảnh; định danh theo nội dung, không đổi được.</span></div>
  <div class="kv"><span class="k">Tag</span><span class="v">Nhãn dời được, trỏ tới một digest — trừ khi repository là IMMUTABLE.</span></div>
  <div class="kv"><span class="k">Lifecycle policy</span><span class="v">Luật cho ảnh hết hạn theo tuổi hoặc số lượng.</span></div>
  <div class="kv"><span class="k">Enhanced scanning</span><span class="v">Amazon Inspector quét liên tục gói hệ điều hành và gói ngôn ngữ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>ECR = registry riêng, đăng nhập bằng IAM (token 12 giờ), có quét, bất biến và vòng đời.</li>
  <li>Tag có thể bị ghi đè im lặng; digest thì không. Repository bất biến, deploy theo digest.</li>
  <li>Ảnh nền cũ mang hàng chục CVE đã biết; quét khi đẩy và giữ ảnh chạy tối giản.</li>
  <li>Xoá tệp ở lớp sau không gỡ nó khỏi ảnh.</li>
  <li>Cùng ý tưởng với registry của cuongthai.com hôm nay: build một lần, đẩy lên, máy chủ chỉ kéo về.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html', '🏷️', 'Tài liệu AWS — Chặn ghi đè tag ảnh', 'IMMUTABLE, bộ lọc ngoại lệ và đúng thông báo lỗi.')}
${tl('https://sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/', '🕵️', 'Sysdig — Ảnh độc hại trên Docker Hub (2022)', '1.652 ảnh độc hại trong 250.000 ảnh: đào coin, bí mật trong lớp, tên nhái.')}

<h3>Nguồn</h3>
<ul>
  <li>Xác thực registry ECR (token 12 giờ): <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html</a></li>
  <li>Tag bất biến: <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html</a></li>
  <li>Quét ảnh (basic, enhanced): <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html</a></li>
  <li>Lifecycle policy: <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html</a></li>
  <li>Thực hành tốt cho ảnh chạy trên ECS: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-considerations.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/container-considerations.html</a></li>
  <li>Thực hành tốt khi build Docker: <a href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">docs.docker.com/build/building/best-practices/</a></li>
  <li>Trivy: <a href="https://trivy.dev/" target="_blank" rel="noopener">trivy.dev</a></li>
  <li>Sự cố Docker Hub (4/2019): <a href="https://www.zdnet.com/article/docker-hub-hack-exposed-data-of-190000-users/" target="_blank" rel="noopener">zdnet.com/article/docker-hub-hack-exposed-data-of-190000-users/</a></li>
  <li>Sysdig, ảnh độc hại trên Docker Hub (2022): <a href="https://sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/" target="_blank" rel="noopener">sysdig.com/blog/analysis-of-supply-chain-attacks-through-public-docker-images/</a></li>
  <li>CVE-2024-3094 (xz Utils): <a href="https://nvd.nist.gov/vuln/detail/CVE-2024-3094" target="_blank" rel="noopener">nvd.nist.gov/vuln/detail/CVE-2024-3094</a></li>
</ul>
</div>
`;
/* ═════ 7.2 — Khái niệm ECS ═════ */
const TD_JSON = json(`
{
  "family": "labflow-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256", "memory": "512",
  "runtimePlatform": { "cpuArchitecture": "ARM64", "operatingSystemFamily": "LINUX" },
  "executionRoleArn": "arn:aws:iam::123456789012:role/labflow-exec",
  "taskRoleArn": "arn:aws:iam::123456789012:role/labflow-task",
  "containerDefinitions": [{
    "name": "api",
    "image": "123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/labflow-api:v1",
    "essential": true,
    "portMappings": [{ "containerPort": 8080, "protocol": "tcp" }],
    "environment": [{ "name": "NODE_ENV", "value": "production" }],
    "secrets": [{ "name": "DB_PASSWORD",
                  "valueFrom": "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:labflow/prod/db" }],
    "logConfiguration": { "logDriver": "awslogs", "options": {
      "awslogs-group": "/ecs/labflow-api", "awslogs-region": "ap-southeast-1", "awslogs-stream-prefix": "api" } },
    "healthCheck": { "command": ["CMD-SHELL", "wget -qO- http://localhost:8080/health || exit 1"],
                     "interval": 10, "timeout": 3, "retries": 3, "startPeriod": 10 }
  }]
}`);
const L72_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 2</span>
<h2>7.2 — ECS concepts: cluster, task definition, task, service — and the two roles everyone mixes up</h2>
<p class="lead">You already run containers with <code>docker run</code> and <code>docker compose</code>. <strong>Amazon ECS</strong> (Elastic Container Service) answers the questions those tools leave to you on a VPS: which machine runs the container, who restarts it when it dies, how many copies should exist, where its logs and secrets come from, and what AWS permissions the code inside gets. This lesson names the four objects, runs a tiny scheduler for real to feel what "service" means, kills a task on purpose, and watches a task get AWS credentials with no key anywhere in its environment.</p>

<h3>The picture: a restaurant kitchen</h3>
<ul>
  <li><strong>Task definition</strong> = the <strong>recipe card</strong>: ingredients (image), portion size (CPU, memory), how to plate it (ports, logs), which supplier key it needs (secrets). Recipe cards are versioned: changing one line prints a new card (revision), the old one stays in the binder.</li>
  <li><strong>Task</strong> = one <strong>dish being cooked</strong> from a card. It can burn (crash) at any time.</li>
  <li><strong>Service</strong> = the <strong>head chef's order</strong>: "always keep 2 of this dish on the pass". If one burns, the chef starts another without being asked.</li>
  <li><strong>Cluster</strong> = the <strong>kitchen</strong>, a namespace where services and tasks live.</li>
  <li><strong>Fargate</strong> = renting a fully staffed cooking station <em>per dish</em>: you never see the stove. <strong>EC2 launch type</strong> = you bring and maintain your own stoves (EC2 instances) and ECS only decides which stove cooks what.</li>
</ul>

<h3>See it running (1): the objects through the API</h3>
<p>This ran on Moto (LocalStack's free edition has no ECS). The task definition, shortened only by whitespace:</p>
${TD_JSON}
${OUT_72_ECS_API}
<ul>
  <li>The cluster offers two capacity providers: <code>FARGATE</code> and <code>FARGATE_SPOT</code> (spare capacity, cheaper, can be reclaimed with a two-minute warning — the same idea as EC2 Spot in lesson 4.5).</li>
  <li>Changing the image from <code>v1</code> to <code>v2</code> did not edit revision 1; it created <strong>revision 2</strong>. Revisions are immutable, which is exactly what makes rollback trivial: point the service back at <code>labflow-api:1</code>.</li>
  <li><strong>Moto differs:</strong> it records the service (<code>desiredCount 2</code>, <code>pendingCount 2</code>) but never runs a container, so <code>runningCount</code> stays 0. On AWS the two tasks reach <code>RUNNING</code> in roughly a minute.</li>
</ul>

<h3>docker compose ↔ task definition</h3>
<table>
  <thead><tr><th>docker-compose.yml (VPS)</th><th>Task definition (ECS)</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td><code>image:</code></td><td><code>image</code></td><td>Point at ECR, ideally by digest</td></tr>
    <tr><td><code>ports: "8080:8080"</code></td><td><code>portMappings.containerPort</code></td><td>With awsvpc there is no host port to map — the task has its own IP</td></tr>
    <tr><td><code>environment:</code></td><td><code>environment</code></td><td>Only non-secret values</td></tr>
    <tr><td><code>env_file: .env</code> with passwords</td><td><code>secrets[].valueFrom</code></td><td>ECS reads Secrets Manager / Parameter Store at start (lesson 7.3)</td></tr>
    <tr><td><code>deploy.resources.limits</code></td><td><code>cpu</code>, <code>memory</code></td><td>On Fargate these are what you pay for</td></tr>
    <tr><td><code>healthcheck:</code></td><td><code>healthCheck</code></td><td>Plus the load balancer's own health check</td></tr>
    <tr><td><code>logging: driver</code></td><td><code>logConfiguration</code></td><td><code>awslogs</code> or FireLens</td></tr>
    <tr><td><code>restart: unless-stopped</code> + <code>replicas</code></td><td>The <strong>service</strong>, not the task definition</td><td>Desired count, placement across AZs</td></tr>
    <tr><td>(nothing — the host's credentials)</td><td><code>taskRoleArn</code></td><td>Per-task AWS permissions</td></tr>
  </tbody>
</table>

<h3>See it running (2): what a service does, for real</h3>
<p>A twenty-line scheduler on Docker keeps <code>desiredCount=2</code>: every second it counts running tasks and starts one if any is missing. Each task is a container with the task definition's limits (<code>--cpus 0.25 --memory 512m</code>) and its own IP — what Fargate's <code>awsvpc</code> mode gives every task (an elastic network interface in your subnet).</p>
${OUT_72_SCHEDULER}
<ul>
  <li>Killing a task did not need a human: within a second the service noticed <code>running=1 &lt; desired=2</code> and started a replacement — with a <strong>new name and a new IP</strong>. Never hard-code a task's address; the load balancer's target group (lesson 7.3) or service discovery tracks them.</li>
  <li>Memory is a hard wall. The task that kept allocating was killed with exit code <strong>137</strong> (128 + signal 9, SIGKILL). On ECS the stopped reason reads <code>OutOfMemoryError: Container killed due to memory usage</code>. <strong>Lab differs:</strong> Docker on this machine (cgroup v2) reported <code>OOMKilled=false</code> although the kernel killed the process; trust the exit code.</li>
  <li>For Spring Boot, give the JVM a share of the task's memory instead of its default guess: <code>JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75</code>, and size the task at least 1 GB. Fargate sizes come in fixed pairs (0.25 vCPU: 0.5–2 GB; 0.5 vCPU: 1–4 GB; 1 vCPU: 2–8 GB…).</li>
</ul>

<h3>Two roles, two jobs</h3>
<table>
  <thead><tr><th></th><th>Task <strong>execution</strong> role</th><th><strong>Task</strong> role</th></tr></thead>
  <tbody>
    <tr><td>Used by</td><td>ECS itself (the agent), <em>before and around</em> your container</td><td>Your code, <em>inside</em> the container</td></tr>
    <tr><td>Typical permissions</td><td>Pull from ECR, read the secrets named in <code>secrets</code>, write to CloudWatch Logs</td><td>What the app needs: one S3 bucket, one SQS queue, one DynamoDB table</td></tr>
    <tr><td>Missing it gives</td><td>Task stuck in PENDING / <code>CannotPullContainerError</code> / secret errors</td><td><code>AccessDenied</code> from your SDK calls</td></tr>
  </tbody>
</table>
<p>Merging them into one "admin" role is the most common mistake in student task definitions (lab 7.5 grades it): the app would inherit the right to read every secret and pull every image.</p>

<h3>See it running (3): credentials with no key in sight</h3>
<p>How does code in a task get AWS credentials? ECS injects one environment variable, <code>AWS_CONTAINER_CREDENTIALS_RELATIVE_URI</code>, containing a random GUID path. Every AWS SDK and the CLI know to call <code>http://169.254.170.2</code> + that path and receive <strong>temporary</strong> credentials of the task role. Here the agent side is <strong>simulated</strong> (a 12-line server that serves credentials obtained from LocalStack's STS AssumeRole); the client side is the real AWS CLI 2.41.0, unmodified.</p>
${MA_CRED}
${OUT_72_ROLE_A}
${OUT_72_ROLE_B}
<ol>
  <li>No <code>AWS_ACCESS_KEY_ID</code> anywhere; <code>aws configure list</code> says the source is <code>container-role</code>.</li>
  <li>The identity is <code>assumed-role/labflow-task/…</code> — a temporary session, which on AWS expires and is refreshed automatically.</li>
  <li>An SSRF that only knows the IP gets <code>404</code>: the GUID is the gate. But any bug that lets an attacker read the process environment (a path traversal to <code>/proc/self/environ</code>, a debug page that dumps <code>env</code>) hands them the path, and then the keys. Treat the environment as sensitive and keep the task role small.</li>
</ol>

<h3>Hacker's corner: Tesla's Kubernetes console, 2018</h3>
<p>In February 2018 researchers at RedLock found that Tesla's Kubernetes administration console was reachable from the Internet <strong>without a password</strong>. Inside one of the pods sat <strong>AWS credentials</strong> for a broader Tesla AWS environment. Attackers had already used them to run crypto-mining, hiding behind a CDN and keeping CPU usage low to avoid alerts. Two lessons map directly to ECS: never put long-lived keys in containers (use the task role), and never expose the orchestrator's control plane (ECS's is the AWS API, protected by IAM — keep it that way: no wildcard <code>ecs:*</code> for humans or CI).</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
  <li><strong>"Task definition vs task vs service?"</strong> — Versioned recipe; one running instance; the controller that keeps N instances running (and registers them with a load balancer).</li>
  <li><strong>"Execution role vs task role?"</strong> — Execution role: ECS pulls the image, fetches secrets, ships logs. Task role: what your code may call.</li>
  <li><strong>"Your task restarts every few minutes with exit code 137. What do you check?"</strong> — Memory: the container hit the task/container memory limit. Check the stopped reason, memory metrics, and JVM/Node heap settings.</li>
  <li><strong>"Fargate or EC2 launch type?"</strong> — Fargate: no servers to patch, pay per task size, slower to start, no GPUs/daemons. EC2: cheaper at steady high use, any instance type, but you patch and scale the hosts (lesson 7.4).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<p>Write a task definition for the <strong>Spring Boot</strong> version of the LabFlow API: 0.5 vCPU / 1 GB, ARM64, health check on <code>/actuator/health</code>, the DB password from Secrets Manager, the JVM limited to 75 % of memory, logs to <code>/ecs/labflow-spring</code>. Register it on Moto with <code>scratchpad/aws/lab/c7/72.sh</code> as a model.</p>
<p><strong>Pass when</strong>: <code>register-task-definition</code> returns a revision, <code>describe-task-definition</code> shows separate execution and task roles, and no environment variable name contains PASSWORD, SECRET or KEY.</p>
${giai('Hint: the container part', json(`
{"name":"api","image":"<account>.dkr.ecr.ap-southeast-1.amazonaws.com/labflow-spring:1.4.2","essential":true,"cpu":512,"memory":1024,
 "portMappings":[{"containerPort":8080}],
 "environment":[{"name":"JAVA_TOOL_OPTIONS","value":"-XX:MaxRAMPercentage=75"},{"name":"SPRING_PROFILES_ACTIVE","value":"prod"}],
 "secrets":[{"name":"SPRING_DATASOURCE_PASSWORD","valueFrom":"arn:aws:secretsmanager:ap-southeast-1:<account>:secret:labflow/prod/db"}],
 "healthCheck":{"command":["CMD-SHELL","curl -fs http://localhost:8080/actuator/health || exit 1"],"startPeriod":60},
 "logConfiguration":{"logDriver":"awslogs","options":{"awslogs-group":"/ecs/labflow-spring","awslogs-region":"ap-southeast-1","awslogs-stream-prefix":"api"}}}`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cluster</span><span class="v">Logical group for services and tasks.</span></div>
  <div class="kv"><span class="k">Task definition</span><span class="v">Versioned JSON recipe: image, CPU/memory, ports, env, secrets, logs, roles.</span></div>
  <div class="kv"><span class="k">Task</span><span class="v">One running instance of a task definition.</span></div>
  <div class="kv"><span class="k">Service</span><span class="v">Keeps desiredCount tasks running, replaces failed ones, registers them with a load balancer.</span></div>
  <div class="kv"><span class="k">awsvpc</span><span class="v">Network mode where each task gets its own network interface and private IP.</span></div>
  <div class="kv"><span class="k">Execution role / task role</span><span class="v">ECS's permissions around the container / your code's permissions inside it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Task definition = recipe (immutable revisions), task = one run, service = keeps N running, cluster = namespace.</li>
  <li>The service replaces dead tasks on its own; tasks get new IPs, so nothing should hard-code them.</li>
  <li>CPU and memory are hard limits and, on Fargate, the bill; exit 137 means memory.</li>
  <li>Two roles: execution (ECS pulls, reads secrets, writes logs) and task (your code).</li>
  <li>Code gets temporary credentials from 169.254.170.2 via a GUID path — no keys in the image or environment.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html', '🔑', 'AWS docs — Amazon ECS task IAM role', 'How credentials reach the container and how to scope them.')}
${tl('https://www.wired.com/story/cryptojacking-tesla-amazon-cloud/', '🕵️', 'Wired — Tesla cloud cryptojacking (2018)', 'An unprotected Kubernetes console and AWS keys inside a pod.')}

<h3>Sources</h3>
<ul>
  <li>Task IAM role: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html</a></li>
  <li>Task execution IAM role: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html</a></li>
  <li>awsvpc network mode: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking-awsvpc.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking-awsvpc.html</a></li>
  <li>Fargate CPU/memory combinations: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html</a></li>
  <li>Fargate capacity providers (FARGATE, FARGATE_SPOT): <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html</a></li>
  <li>Stopped task error messages (OutOfMemoryError): <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/stopped-task-error-codes.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/stopped-task-error-codes.html</a></li>
  <li>Task metadata endpoint v4 on Fargate: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4-fargate.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4-fargate.html</a></li>
  <li>Tesla cryptojacking (Wired, 2018): <a href="https://www.wired.com/story/cryptojacking-tesla-amazon-cloud/" target="_blank" rel="noopener">wired.com/story/cryptojacking-tesla-amazon-cloud/</a></li>
</ul>
</div>
`;
const L72_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 2</span>
<h2>7.2 — Khái niệm ECS: cluster, task definition, task, service — và hai role ai cũng nhầm</h2>
<p class="lead">Bạn đã chạy container bằng <code>docker run</code> và <code>docker compose</code>. <strong>Amazon ECS</strong> (Elastic Container Service) trả lời những câu mà trên VPS bạn phải tự lo: máy nào chạy container, ai khởi động lại khi nó chết, cần bao nhiêu bản, log và bí mật lấy từ đâu, và mã bên trong được quyền gì trên AWS. Bài này gọi tên bốn đối tượng, chạy thật một bộ lập lịch tí hon để cảm được "service" là gì, cố ý giết một task, và xem một task nhận khoá AWS mà không có khoá nào trong biến môi trường.</p>

<h3>Liên tưởng: bếp nhà hàng</h3>
<ul>
  <li><strong>Task definition</strong> = <strong>tờ công thức</strong>: nguyên liệu (ảnh), khẩu phần (CPU, bộ nhớ), cách bày (cổng, log), cần chìa khoá kho nào (bí mật). Công thức có số phiên bản: sửa một dòng là in tờ mới (revision), tờ cũ vẫn nằm trong bìa hồ sơ.</li>
  <li><strong>Task</strong> = <strong>một món đang nấu</strong> theo tờ công thức. Nó có thể cháy (sập) bất cứ lúc nào.</li>
  <li><strong>Service</strong> = <strong>lệnh của bếp trưởng</strong>: "luôn có 2 đĩa món này trên quầy". Một đĩa cháy, bếp trưởng tự nấu đĩa khác, không cần ai nhắc.</li>
  <li><strong>Cluster</strong> = <strong>gian bếp</strong>, không gian chứa service và task.</li>
  <li><strong>Fargate</strong> = thuê nguyên một trạm nấu có sẵn người <em>cho từng món</em>: bạn không bao giờ thấy cái bếp. <strong>Kiểu chạy EC2</strong> = bạn mang bếp riêng (máy EC2) tới và tự bảo trì, ECS chỉ chia món nào nấu ở bếp nào.</li>
</ul>

<h3>Xem chạy thật (1): các đối tượng qua API</h3>
<p>Phần này chạy trên Moto (bản miễn phí của LocalStack không có ECS). Task definition, chỉ gọn lại khoảng trắng:</p>
${TD_JSON}
${OUT_72_ECS_API}
<ul>
  <li>Cluster có hai capacity provider: <code>FARGATE</code> và <code>FARGATE_SPOT</code> (công suất dư, rẻ hơn, có thể bị lấy lại sau cảnh báo hai phút — cùng ý tưởng với EC2 Spot ở bài 4.5).</li>
  <li>Đổi ảnh từ <code>v1</code> sang <code>v2</code> không sửa revision 1 mà tạo <strong>revision 2</strong>. Revision bất biến — chính điều này làm rollback dễ như bỡn: trỏ service về <code>labflow-api:1</code>.</li>
  <li><strong>Moto khác AWS:</strong> nó ghi nhận service (<code>desiredCount 2</code>, <code>pendingCount 2</code>) nhưng không chạy container nào, nên <code>runningCount</code> mãi là 0. Trên AWS hai task lên <code>RUNNING</code> sau khoảng một phút.</li>
</ul>

<h3>docker compose ↔ task definition</h3>
<table>
  <thead><tr><th>docker-compose.yml (VPS)</th><th>Task definition (ECS)</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td><code>image:</code></td><td><code>image</code></td><td>Trỏ vào ECR, tốt nhất theo digest</td></tr>
    <tr><td><code>ports: "8080:8080"</code></td><td><code>portMappings.containerPort</code></td><td>Với awsvpc không có cổng máy chủ để ánh xạ — task có IP riêng</td></tr>
    <tr><td><code>environment:</code></td><td><code>environment</code></td><td>Chỉ giá trị không bí mật</td></tr>
    <tr><td><code>env_file: .env</code> chứa mật khẩu</td><td><code>secrets[].valueFrom</code></td><td>ECS đọc Secrets Manager / Parameter Store lúc khởi động (bài 7.3)</td></tr>
    <tr><td><code>deploy.resources.limits</code></td><td><code>cpu</code>, <code>memory</code></td><td>Trên Fargate đây chính là thứ bạn trả tiền</td></tr>
    <tr><td><code>healthcheck:</code></td><td><code>healthCheck</code></td><td>Cộng thêm health check riêng của load balancer</td></tr>
    <tr><td><code>logging: driver</code></td><td><code>logConfiguration</code></td><td><code>awslogs</code> hoặc FireLens</td></tr>
    <tr><td><code>restart: unless-stopped</code> + <code>replicas</code></td><td><strong>Service</strong>, không phải task definition</td><td>Số bản mong muốn, rải qua các AZ</td></tr>
    <tr><td>(không có — dùng khoá của máy chủ)</td><td><code>taskRoleArn</code></td><td>Quyền AWS riêng cho từng task</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật (2): service làm gì, chạy thật</h3>
<p>Một bộ lập lịch hai mươi dòng trên Docker giữ <code>desiredCount=2</code>: mỗi giây đếm task đang chạy, thiếu thì chạy thêm. Mỗi task là một container mang đúng giới hạn của task definition (<code>--cpus 0.25 --memory 512m</code>) và có IP riêng — đúng thứ chế độ <code>awsvpc</code> của Fargate cho mỗi task (một card mạng ảo trong subnet của bạn).</p>
${OUT_72_SCHEDULER}
<ul>
  <li>Giết một task không cần ai ra tay: chưa tới một giây service đã thấy <code>running=1 &lt; desired=2</code> và chạy bản thay — với <strong>tên mới và IP mới</strong>. Đừng bao giờ viết cứng địa chỉ của task; target group của load balancer (bài 7.3) hoặc service discovery lo việc theo dõi.</li>
  <li>Bộ nhớ là bức tường cứng. Task cứ xin thêm bộ nhớ bị giết với mã thoát <strong>137</strong> (128 + tín hiệu 9, SIGKILL). Trên ECS lý do dừng ghi <code>OutOfMemoryError: Container killed due to memory usage</code>. <strong>Lab khác AWS:</strong> Docker trên máy này (cgroup v2) báo <code>OOMKilled=false</code> dù nhân Linux đã giết tiến trình; hãy tin mã thoát.</li>
  <li>Với Spring Boot, chia cho JVM một phần bộ nhớ của task thay vì để nó tự đoán: <code>JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75</code>, và cho task ít nhất 1 GB. Cỡ Fargate đi theo cặp cố định (0,25 vCPU: 0,5–2 GB; 0,5 vCPU: 1–4 GB; 1 vCPU: 2–8 GB…).</li>
</ul>

<h3>Hai role, hai việc</h3>
<table>
  <thead><tr><th></th><th>Task <strong>execution</strong> role</th><th><strong>Task</strong> role</th></tr></thead>
  <tbody>
    <tr><td>Ai dùng</td><td>Chính ECS (agent), <em>trước và quanh</em> container của bạn</td><td>Mã của bạn, <em>bên trong</em> container</td></tr>
    <tr><td>Quyền điển hình</td><td>Kéo ảnh từ ECR, đọc các bí mật khai trong <code>secrets</code>, ghi CloudWatch Logs</td><td>Đúng thứ ứng dụng cần: một bucket S3, một hàng đợi SQS, một bảng DynamoDB</td></tr>
    <tr><td>Thiếu thì gặp</td><td>Task kẹt PENDING / <code>CannotPullContainerError</code> / lỗi bí mật</td><td><code>AccessDenied</code> từ lời gọi SDK của bạn</td></tr>
  </tbody>
</table>
<p>Gộp hai thứ thành một role "admin" là lỗi hay gặp nhất trong task definition của sinh viên (lab 7.5 có chấm): ứng dụng sẽ thừa hưởng quyền đọc mọi bí mật và kéo mọi ảnh.</p>

<h3>Xem chạy thật (3): có khoá mà không thấy khoá đâu</h3>
<p>Mã trong task lấy khoá AWS bằng cách nào? ECS bơm đúng một biến môi trường, <code>AWS_CONTAINER_CREDENTIALS_RELATIVE_URI</code>, chứa một đường dẫn có GUID ngẫu nhiên. Mọi AWS SDK và CLI đều biết gọi <code>http://169.254.170.2</code> + đường đó để nhận khoá <strong>tạm</strong> của task role. Ở đây phía agent là <strong>giả lập</strong> (máy chủ 12 dòng phát khoá lấy từ STS AssumeRole của LocalStack); phía khách là AWS CLI 2.41.0 thật, không sửa gì.</p>
${MA_CRED}
${OUT_72_ROLE_A}
${OUT_72_ROLE_B}
<ol>
  <li>Không có <code>AWS_ACCESS_KEY_ID</code> ở đâu cả; <code>aws configure list</code> báo nguồn là <code>container-role</code>.</li>
  <li>Danh tính là <code>assumed-role/labflow-task/…</code> — một phiên tạm, trên AWS tự hết hạn và tự làm mới.</li>
  <li>SSRF chỉ biết địa chỉ IP thì nhận <code>404</code>: GUID là cánh cổng. Nhưng bất kỳ lỗi nào cho kẻ tấn công đọc biến môi trường của tiến trình (đi lạc đường dẫn tới <code>/proc/self/environ</code>, trang gỡ lỗi in ra <code>env</code>) là trao luôn đường dẫn, rồi trao khoá. Coi biến môi trường là thứ nhạy cảm và giữ task role thật hẹp.</li>
</ol>

<h3>Góc hacker: bảng điều khiển Kubernetes của Tesla, 2018</h3>
<p>Tháng 2/2018 các nhà nghiên cứu của RedLock phát hiện bảng quản trị Kubernetes của Tesla mở ra Internet <strong>không cần mật khẩu</strong>. Trong một pod có sẵn <strong>khoá AWS</strong> của một môi trường AWS rộng hơn của Tesla. Kẻ tấn công đã dùng khoá đó để đào tiền ảo, nấp sau một CDN và giữ mức dùng CPU thấp để không bị báo động. Hai bài học áp thẳng vào ECS: không bao giờ để khoá dài hạn trong container (dùng task role), và không bao giờ để lộ phần điều khiển của bộ điều phối (của ECS là API AWS, được IAM bảo vệ — giữ nguyên như vậy: không cấp <code>ecs:*</code> tràn lan cho người hay CI).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Task definition, task, service khác nhau thế nào?"</strong> — Công thức có phiên bản; một bản đang chạy; bộ điều khiển giữ N bản luôn chạy (và đăng ký chúng vào load balancer).</li>
  <li><strong>"Execution role khác task role?"</strong> — Execution role: ECS kéo ảnh, lấy bí mật, gửi log. Task role: mã của bạn được gọi gì.</li>
  <li><strong>"Task cứ vài phút lại khởi động lại với mã 137. Em kiểm gì?"</strong> — Bộ nhớ: container chạm giới hạn bộ nhớ của task/container. Xem lý do dừng, chỉ số bộ nhớ, và cấu hình heap của JVM/Node.</li>
  <li><strong>"Fargate hay kiểu chạy EC2?"</strong> — Fargate: không có máy để vá, trả theo cỡ task, khởi động chậm hơn, không GPU/không daemon. EC2: rẻ hơn khi tải cao đều đặn, chọn được mọi loại máy, nhưng bạn vá và co giãn máy (bài 7.4).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Viết task definition cho bản <strong>Spring Boot</strong> của API LabFlow: 0,5 vCPU / 1 GB, ARM64, health check ở <code>/actuator/health</code>, mật khẩu DB lấy từ Secrets Manager, JVM giới hạn 75 % bộ nhớ, log về <code>/ecs/labflow-spring</code>. Đăng ký lên Moto, lấy <code>scratchpad/aws/lab/c7/72.sh</code> làm mẫu.</p>
<p><strong>Đạt khi</strong>: <code>register-task-definition</code> trả về một revision, <code>describe-task-definition</code> có execution role và task role tách riêng, và không biến môi trường nào có tên chứa PASSWORD, SECRET hay KEY.</p>
${giai('Gợi ý: phần container', json(`
{"name":"api","image":"<account>.dkr.ecr.ap-southeast-1.amazonaws.com/labflow-spring:1.4.2","essential":true,"cpu":512,"memory":1024,
 "portMappings":[{"containerPort":8080}],
 "environment":[{"name":"JAVA_TOOL_OPTIONS","value":"-XX:MaxRAMPercentage=75"},{"name":"SPRING_PROFILES_ACTIVE","value":"prod"}],
 "secrets":[{"name":"SPRING_DATASOURCE_PASSWORD","valueFrom":"arn:aws:secretsmanager:ap-southeast-1:<account>:secret:labflow/prod/db"}],
 "healthCheck":{"command":["CMD-SHELL","curl -fs http://localhost:8080/actuator/health || exit 1"],"startPeriod":60},
 "logConfiguration":{"logDriver":"awslogs","options":{"awslogs-group":"/ecs/labflow-spring","awslogs-region":"ap-southeast-1","awslogs-stream-prefix":"api"}}}`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cluster</span><span class="v">Nhóm logic chứa service và task.</span></div>
  <div class="kv"><span class="k">Task definition</span><span class="v">Công thức JSON có phiên bản: ảnh, CPU/bộ nhớ, cổng, biến môi trường, bí mật, log, role.</span></div>
  <div class="kv"><span class="k">Task</span><span class="v">Một bản đang chạy của task definition.</span></div>
  <div class="kv"><span class="k">Service</span><span class="v">Giữ đủ desiredCount task, thay task hỏng, đăng ký chúng vào load balancer.</span></div>
  <div class="kv"><span class="k">awsvpc</span><span class="v">Chế độ mạng cho mỗi task một card mạng và IP riêng.</span></div>
  <div class="kv"><span class="k">Execution role / task role</span><span class="v">Quyền của ECS quanh container / quyền của mã bạn bên trong nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Task definition = công thức (revision bất biến), task = một lần chạy, service = giữ N bản, cluster = không gian chứa.</li>
  <li>Service tự thay task chết; task mới có IP mới, nên không gì được viết cứng địa chỉ.</li>
  <li>CPU và bộ nhớ là giới hạn cứng và, trên Fargate, là hoá đơn; mã 137 nghĩa là hết bộ nhớ.</li>
  <li>Hai role: execution (ECS kéo ảnh, đọc bí mật, ghi log) và task (mã của bạn).</li>
  <li>Mã lấy khoá tạm từ 169.254.170.2 qua đường dẫn có GUID — không khoá nào trong ảnh hay biến môi trường.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html', '🔑', 'Tài liệu AWS — Task IAM role của ECS', 'Khoá đến container bằng đường nào và thu hẹp quyền ra sao.')}
${tl('https://www.wired.com/story/cryptojacking-tesla-amazon-cloud/', '🕵️', 'Wired — Tesla bị đào coin trên cloud (2018)', 'Bảng Kubernetes không mật khẩu và khoá AWS nằm trong pod.')}

<h3>Nguồn</h3>
<ul>
  <li>Task IAM role: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html</a></li>
  <li>Task execution IAM role: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html</a></li>
  <li>Chế độ mạng awsvpc: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking-awsvpc.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking-awsvpc.html</a></li>
  <li>Các cặp CPU/bộ nhớ của Fargate: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html</a></li>
  <li>Capacity provider của Fargate (FARGATE, FARGATE_SPOT): <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html</a></li>
  <li>Thông báo lỗi khi task dừng (OutOfMemoryError): <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/stopped-task-error-codes.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/stopped-task-error-codes.html</a></li>
  <li>Task metadata endpoint v4 trên Fargate: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4-fargate.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4-fargate.html</a></li>
  <li>Tesla bị đào coin (Wired, 2018): <a href="https://www.wired.com/story/cryptojacking-tesla-amazon-cloud/" target="_blank" rel="noopener">wired.com/story/cryptojacking-tesla-amazon-cloud/</a></li>
</ul>
</div>
`;
/* ═════ 7.3 — Fargate sau ALB ═════ */
const L73_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 3</span>
<h2>7.3 — Running an API on Fargate behind an ALB: zero-downtime deploys, secrets, logs and a safety net</h2>
<p class="lead">This is the lesson where Chapters 3, 5, 6 and 7 meet: tasks in private subnets, an Application Load Balancer in front, the database password from Secrets Manager, logs in CloudWatch. Then the part that matters every day at work — <strong>shipping a new version while users keep clicking</strong>. Everything below ran for real under continuous load: a rolling update with zero failed requests, a password rotation that running tasks do <em>not</em> notice, and a broken release that the deployment circuit breaker rolls back before a single user sees it.</p>

<h3>The picture: shift change in a coffee shop</h3>
<p>The cashier (ALB) hands each order to a barista on the list (target group). At shift change you do not close the shop. The new baristas arrive first and must make one good coffee each (health check) before they are put on the list. Only then are the old ones taken off the list; they finish the cup in their hands (connection draining) and leave (SIGTERM). If a new barista cannot make coffee three times in a row, the manager cancels the shift change and the old team simply stays (circuit breaker rollback).</p>

<h3>The architecture</h3>
<ul>
  <li><strong>ALB</strong> in two <em>public</em> subnets, security group open on 443 to the world (Chapter 5.1).</li>
  <li><strong>Target group of type <code>ip</code></strong>: with <code>awsvpc</code> every task has its own IP, so targets are IPs, not instances. ECS registers and deregisters them for you.</li>
  <li><strong>Tasks</strong> in two <em>private</em> subnets, <code>assignPublicIp=DISABLED</code>; their security group accepts 8080 <strong>only from the ALB's security group</strong>.</li>
  <li>To pull from ECR and read secrets, private tasks need a way out: a NAT gateway, or cheaper and tighter, VPC endpoints for <code>ecr.api</code>, <code>ecr.dkr</code>, S3 (gateway — image layers live in S3), <code>logs</code> and <code>secretsmanager</code> (Chapter 3.4).</li>
  <li><strong>RDS</strong> accepts 5432 only from the tasks' security group (Chapter 6.1).</li>
</ul>

<h3>See it running (1): wiring the service to the load balancer</h3>
${OUT_73_API}
<ul>
  <li><code>--target-type ip</code> is mandatory for Fargate; an <code>instance</code> target group is rejected when you attach it.</li>
  <li><code>--load-balancers</code> names the container and port the ALB should send traffic to. <code>--health-check-grace-period-seconds 30</code> tells ECS to ignore failing ALB health checks for the first 30 s while the app boots (Spring Boot needs it; JVM start-up can take 20–40 s).</li>
  <li><code>--force-new-deployment</code> starts a new deployment with the same task definition — used after a secret changes (below). <strong>Moto differs:</strong> it does not echo <code>healthCheckGracePeriodSeconds</code> back (<code>None</code>) and never runs tasks.</li>
</ul>

<h3>See it running (2): a rolling update under load</h3>
<p>The real run: HAProxy plays the ALB (target group of IPs, health check <code>GET /health</code> every second, healthy after 2 passes), each task is a container with its own IP, a client sends a request every 40 ms the whole time, and the "ECS" side follows the default rolling settings <code>minimumHealthyPercent=100</code>, <code>maximumPercent=200</code>.</p>
${OUT_73_TRIEN_KHAI_A}
<ol>
  <li>A new target is registered but receives <strong>no traffic until it passes its health checks</strong> — an ALB target starts in the <code>initial</code> state.</li>
  <li><code>maximumPercent=200</code> allows 4 tasks during the deploy; <code>minimumHealthyPercent=100</code> forbids dropping below 2 healthy. So ECS starts the new ones first and stops the old ones only after.</li>
  <li>Old targets are <strong>deregistered first, then drained</strong>: the ALB stops sending new requests but lets in-flight ones finish (deregistration delay — 300 s by default on AWS, 3 s here). Then ECS sends <strong>SIGTERM</strong>; the app logs a clean shutdown. If the app ignored SIGTERM, ECS would SIGKILL it after <code>stopTimeout</code> (30 s by default).</li>
  <li>Result: 281 requests, all 200, some answered by v1 and some by v2 — <strong>zero failed requests</strong>. That is what "zero-downtime deploy" means, measured.</li>
</ol>

<h3>Secrets: read once, at start</h3>
<p>The task definition's <code>secrets</code> entry (lesson 7.2) makes the <em>execution role</em> read Secrets Manager when the task starts and put the value in the container's environment. The app's <code>/info</code> shows a hash of the value, never the value.</p>
${OUT_73_TRIEN_KHAI_B}
<ul>
  <li>After the password was changed in Secrets Manager, the running tasks still had the <strong>old</strong> value (hash <code>83ac7f7b</code>). ECS does not push secret changes into running containers.</li>
  <li><code>--force-new-deployment</code> replaced the tasks with the same image; the new ones read the new value (<code>6ba5327b</code>). Again 0 failed requests.</li>
  <li>So a rotation needs an order of operations: the database accepts both old and new password for a while (the AWSPREVIOUS/AWSCURRENT labels in lesson 6.3), you redeploy, then the old one is removed. Alternatively the app reads Secrets Manager itself with a cache, as in lesson 6.3, and reconnects on an authentication error.</li>
</ul>

<h3>See it running (3): a broken release and the circuit breaker</h3>
<p>Version 3 has a bug: <code>/health</code> returns 500. The deployment circuit breaker is on with rollback.</p>
${OUT_73_TRIEN_KHAI_C}
<ul>
  <li>Each v3 task failed the ALB health checks and was stopped; ECS kept trying. The failure threshold is <strong>50 % of desiredCount, clamped between 3 and 200</strong> — for 2 tasks that is 3 failures.</li>
  <li>After the third failure the deployment was marked failed and rolled back to the last completed one (v2). v3 never reached the target list, so it received <strong>zero</strong> user requests; 330 requests, all 200.</li>
  <li>Without the circuit breaker, ECS would retry the broken version forever while the old tasks keep serving — safe for users, but your pipeline would sit "in progress" for hours and nobody gets an alarm. Turn it on, and alert on <code>FAILED</code> deployments (Chapter 10).</li>
</ul>

<h3>Logs: where stdout goes</h3>
<p>A container on Fargate has no disk you can SSH into. Whatever the app writes to stdout is the log. With the <code>awslogs</code> driver ECS ships it to a CloudWatch Logs group; with <strong>FireLens</strong> a Fluent Bit side-car routes it anywhere (CloudWatch, S3, OpenSearch, a third-party service). Here Fluent Bit played that router and wrote into LocalStack's CloudWatch Logs:</p>
${OUT_73_LOG}
<ul>
  <li>One log stream per task (<code>ecs/api/&lt;task id&gt;</code>), so the logs of a task that crashed and was replaced are still there — the reason lab 7.5 fails a task definition with no <code>logConfiguration</code>.</li>
  <li>JSON lines (<code>{"t":…,"ban":…,"task":…}</code>) are searchable with CloudWatch Logs Insights (Chapter 10).</li>
  <li>A new log group keeps data <strong>forever</strong> by default, and storage is billed. Set a retention (for example 30 days) when you create it.</li>
</ul>

<h3>Hacker's corner — or rather, outage corner: 19 July 2024</h3>
<p>On 19 July 2024 a faulty content update for CrowdStrike's Falcon sensor was pushed to Windows machines worldwide at once. Microsoft estimated <strong>8.5 million</strong> devices crashed; airlines, hospitals and banks stopped. CrowdStrike's post-incident report promised exactly what this lesson practises: <strong>staggered deployment</strong> (canary first, then gradually wider), health monitoring between stages, and the ability to stop and roll back. Rolling updates, health checks and a circuit breaker are the small, everyday version of that discipline. For bigger risk, ECS also supports blue/green deployments with AWS CodeDeploy: the new version gets a test listener and a share of traffic before the full switch.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
  <li><strong>"How do you deploy without downtime on ECS?"</strong> — Rolling update with minimumHealthyPercent=100 and maximumPercent=200, ALB health checks, a deregistration delay for draining, and an app that handles SIGTERM.</li>
  <li><strong>"Why target type ip?"</strong> — Fargate tasks use awsvpc, each with its own ENI and IP; there is no instance to register.</li>
  <li><strong>"We rotated the DB password and nothing changed. Why?"</strong> — ECS injects secrets only when a task starts; force a new deployment (and keep the old password valid until it completes).</li>
  <li><strong>"What does the deployment circuit breaker do?"</strong> — Counts failed tasks of a deployment (threshold 50 % of desired, min 3, max 200), marks it failed and optionally rolls back to the last completed deployment.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<p>Copy <code>scratchpad/aws/lab/c7/73.sh</code> and change the rolling update to <code>minimumHealthyPercent=50</code>, <code>maximumPercent=100</code>: stop one old task, start one new, wait until healthy, then the second.</p>
<p><strong>Pass when</strong>: the load counter still shows 0 failed requests, there are never more than 2 tasks at once, and you can explain in two sentences when you would choose 50/100 over 100/200 (hint: capacity limits, cost, or a database that cannot take double connections).</p>
${giai('Hint: the loop', bash(`
for k in $(ls $KD); do          # old slots
  rut $k                         # drain + SIGTERM one old task
  m=$(chay_task 2 2>&3)          # start one new
  cho_khoe $m || { echo "new task unhealthy - stop and roll back"; break; }
done`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Target type ip</span><span class="v">Target group whose targets are IP addresses — required for Fargate/awsvpc.</span></div>
  <div class="kv"><span class="k">minimumHealthyPercent / maximumPercent</span><span class="v">Lower and upper bound of running tasks during a rolling deployment, as % of desiredCount.</span></div>
  <div class="kv"><span class="k">Health check grace period</span><span class="v">Seconds ECS ignores failing load balancer health checks after a task starts.</span></div>
  <div class="kv"><span class="k">Deregistration delay</span><span class="v">Time the ALB keeps in-flight requests on a target being removed (draining).</span></div>
  <div class="kv"><span class="k">Deployment circuit breaker</span><span class="v">Fails a deployment after too many failed tasks and can roll back automatically.</span></div>
  <div class="kv"><span class="k">FireLens</span><span class="v">Log routing for ECS with a Fluent Bit (or Fluentd) side-car container.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Public ALB ⇒ target group (ip) ⇒ tasks in private subnets ⇒ RDS; security groups chain by group, not by IP.</li>
  <li>Rolling 100/200 + health checks + draining + SIGTERM handling = deploys with zero failed requests (measured).</li>
  <li>Secrets are read at task start; rotate, then force a new deployment.</li>
  <li>The circuit breaker stops a broken release after 3+ failed tasks and rolls back.</li>
  <li>stdout is the log: awslogs or FireLens, one stream per task, set a retention.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html', '🧯', 'AWS docs — How the deployment circuit breaker detects failures', 'Stages, thresholds and rollback rules.')}
${tl('https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/', '🚨', 'CrowdStrike — Preliminary post-incident review (2024)', 'What went wrong and the staggered-deployment changes that followed.')}

<h3>Sources</h3>
<ul>
  <li>Rolling deployments (minimum/maximum percent): <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html</a></li>
  <li>Deployment circuit breaker: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html</a></li>
  <li>Passing secrets to containers: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html</a></li>
  <li>FireLens log routing: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html</a></li>
  <li>Fluent Bit CloudWatch output: <a href="https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch" target="_blank" rel="noopener">docs.fluentbit.io/manual/pipeline/outputs/cloudwatch</a></li>
  <li>Fargate security considerations: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html</a></li>
  <li>Microsoft on the CrowdStrike outage (8.5 million devices): <a href="https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/" target="_blank" rel="noopener">blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/</a></li>
  <li>CrowdStrike preliminary post-incident review: <a href="https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/" target="_blank" rel="noopener">crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/</a></li>
</ul>
</div>
`;
const L73_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 3</span>
<h2>7.3 — Chạy API trên Fargate sau ALB: deploy không gián đoạn, bí mật, log và lưới an toàn</h2>
<p class="lead">Đây là bài mà Chương 3, 5, 6 và 7 gặp nhau: task trong subnet private, Application Load Balancer đứng trước, mật khẩu DB lấy từ Secrets Manager, log về CloudWatch. Rồi tới phần ngày nào đi làm cũng gặp — <strong>đưa bản mới lên trong khi người dùng vẫn đang bấm</strong>. Mọi thứ dưới đây chạy thật dưới tải liên tục: cập nhật cuốn chiếu với 0 yêu cầu lỗi, một lần xoay mật khẩu mà task đang chạy <em>không</em> hề biết, và một bản lỗi bị circuit breaker kéo lùi trước khi người dùng nào thấy.</p>

<h3>Liên tưởng: đổi ca ở quán cà phê</h3>
<p>Thu ngân (ALB) chia mỗi đơn cho một barista trong danh sách (target group). Tới giờ đổi ca, quán không đóng cửa. Barista ca mới tới trước và phải pha được một ly ngon (health check) mới được ghi vào danh sách. Chỉ sau đó người ca cũ mới bị gạch tên; họ pha nốt ly đang cầm (connection draining) rồi về (SIGTERM). Nếu barista mới pha hỏng ba lần liền, quản lý huỷ đổi ca và ca cũ cứ thế làm tiếp (circuit breaker rollback).</p>

<h3>Kiến trúc</h3>
<ul>
  <li><strong>ALB</strong> ở hai subnet <em>public</em>, security group mở 443 cho cả thế giới (Chương 5.1).</li>
  <li><strong>Target group kiểu <code>ip</code></strong>: với <code>awsvpc</code> mỗi task có IP riêng, nên đích là IP chứ không phải máy. ECS tự đăng ký và huỷ đăng ký giúp bạn.</li>
  <li><strong>Task</strong> ở hai subnet <em>private</em>, <code>assignPublicIp=DISABLED</code>; security group của task chỉ nhận cổng 8080 <strong>từ security group của ALB</strong>.</li>
  <li>Để kéo ảnh từ ECR và đọc bí mật, task private cần đường ra: một NAT gateway, hoặc rẻ hơn và chặt hơn, các VPC endpoint cho <code>ecr.api</code>, <code>ecr.dkr</code>, S3 (kiểu gateway — các lớp ảnh nằm trong S3), <code>logs</code> và <code>secretsmanager</code> (Chương 3.4).</li>
  <li><strong>RDS</strong> chỉ nhận 5432 từ security group của task (Chương 6.1).</li>
</ul>

<h3>Xem chạy thật (1): nối service với load balancer</h3>
${OUT_73_API}
<ul>
  <li><code>--target-type ip</code> là bắt buộc với Fargate; target group kiểu <code>instance</code> bị từ chối khi gắn vào service.</li>
  <li><code>--load-balancers</code> chỉ ra container và cổng mà ALB gửi tới. <code>--health-check-grace-period-seconds 30</code> bảo ECS bỏ qua health check hỏng của ALB trong 30 giây đầu khi ứng dụng đang khởi động (Spring Boot cần cái này; JVM có thể mất 20–40 giây mới lên).</li>
  <li><code>--force-new-deployment</code> mở một lượt deploy mới với cùng task definition — dùng sau khi đổi bí mật (bên dưới). <strong>Moto khác AWS:</strong> nó không trả lại <code>healthCheckGracePeriodSeconds</code> (<code>None</code>) và không chạy task nào.</li>
</ul>

<h3>Xem chạy thật (2): cập nhật cuốn chiếu dưới tải</h3>
<p>Phần chạy thật: HAProxy đóng vai ALB (target group theo IP, health check <code>GET /health</code> mỗi giây, đạt 2 lần mới healthy), mỗi task là một container có IP riêng, một máy khách gửi yêu cầu mỗi 40 ms suốt thời gian chạy, và phía "ECS" làm đúng thiết lập cuốn chiếu mặc định <code>minimumHealthyPercent=100</code>, <code>maximumPercent=200</code>.</p>
${OUT_73_TRIEN_KHAI_A}
<ol>
  <li>Đích mới được đăng ký nhưng <strong>không nhận yêu cầu nào cho tới khi qua health check</strong> — đích của ALB bắt đầu ở trạng thái <code>initial</code>.</li>
  <li><code>maximumPercent=200</code> cho phép 4 task trong lúc deploy; <code>minimumHealthyPercent=100</code> cấm tụt dưới 2 task khoẻ. Nên ECS chạy bản mới trước, rồi mới dừng bản cũ.</li>
  <li>Đích cũ bị <strong>huỷ đăng ký trước, rồi mới xả</strong>: ALB thôi gửi yêu cầu mới nhưng để yêu cầu đang dở chạy xong (deregistration delay — mặc định 300 giây trên AWS, ở đây 3 giây). Sau đó ECS gửi <strong>SIGTERM</strong>; ứng dụng ghi log đóng gọn. Nếu ứng dụng lờ SIGTERM, ECS sẽ SIGKILL sau <code>stopTimeout</code> (mặc định 30 giây).</li>
  <li>Kết quả: 281 yêu cầu, tất cả 200, một phần do v1 trả lời, một phần do v2 — <strong>không yêu cầu nào lỗi</strong>. "Deploy không gián đoạn" là như vậy, có số đo hẳn hoi.</li>
</ol>

<h3>Bí mật: đọc một lần, lúc khởi động</h3>
<p>Mục <code>secrets</code> của task definition (bài 7.2) khiến <em>execution role</em> đọc Secrets Manager lúc task khởi động rồi đặt giá trị vào biến môi trường của container. Trang <code>/info</code> của ứng dụng chỉ in mã băm của giá trị, không bao giờ in giá trị.</p>
${OUT_73_TRIEN_KHAI_B}
<ul>
  <li>Sau khi đổi mật khẩu trong Secrets Manager, task đang chạy vẫn giữ giá trị <strong>cũ</strong> (băm <code>83ac7f7b</code>). ECS không đẩy thay đổi bí mật vào container đang chạy.</li>
  <li><code>--force-new-deployment</code> thay task bằng cùng ảnh; task mới đọc giá trị mới (<code>6ba5327b</code>). Lại 0 yêu cầu lỗi.</li>
  <li>Vậy xoay mật khẩu cần đúng thứ tự: cơ sở dữ liệu chấp nhận cả mật khẩu cũ lẫn mới một thời gian (nhãn AWSPREVIOUS/AWSCURRENT ở bài 6.3), bạn deploy lại, rồi mới bỏ mật khẩu cũ. Hoặc ứng dụng tự đọc Secrets Manager có cache như bài 6.3, gặp lỗi xác thực thì đọc lại và nối lại.</li>
</ul>

<h3>Xem chạy thật (3): bản lỗi và circuit breaker</h3>
<p>Bản 3 có lỗi: <code>/health</code> trả 500. Circuit breaker của deploy đang bật kèm rollback.</p>
${OUT_73_TRIEN_KHAI_C}
<ul>
  <li>Mỗi task v3 trượt health check của ALB và bị dừng; ECS cứ thử lại. Ngưỡng hỏng là <strong>50 % của desiredCount, kẹp trong khoảng 3 tới 200</strong> — với 2 task là 3 lần hỏng.</li>
  <li>Sau lần hỏng thứ ba, lượt deploy bị đánh dấu thất bại và kéo lùi về lượt hoàn tất gần nhất (v2). v3 chưa bao giờ vào danh sách đích, nên nhận <strong>0</strong> yêu cầu của người dùng; 330 yêu cầu, tất cả 200.</li>
  <li>Không có circuit breaker, ECS sẽ thử bản lỗi mãi trong khi task cũ vẫn phục vụ — người dùng vẫn an toàn, nhưng pipeline của bạn treo "đang chạy" hàng giờ và không ai nhận cảnh báo. Hãy bật nó, và đặt cảnh báo khi deploy <code>FAILED</code> (Chương 10).</li>
</ul>

<h3>Log: stdout đi về đâu</h3>
<p>Container trên Fargate không có ổ đĩa nào để bạn SSH vào. Thứ ứng dụng in ra stdout chính là log. Với driver <code>awslogs</code>, ECS gửi nó về một log group của CloudWatch Logs; với <strong>FireLens</strong>, một container phụ Fluent Bit chuyển nó đi bất cứ đâu (CloudWatch, S3, OpenSearch, dịch vụ bên thứ ba). Ở đây Fluent Bit đóng vai bộ chuyển đó và ghi vào CloudWatch Logs của LocalStack:</p>
${OUT_73_LOG}
<ul>
  <li>Mỗi task một log stream (<code>ecs/api/&lt;mã task&gt;</code>), nên log của task đã sập và bị thay vẫn còn đó — lý do lab 7.5 đánh trượt task definition không có <code>logConfiguration</code>.</li>
  <li>Log dạng dòng JSON (<code>{"t":…,"ban":…,"task":…}</code>) tìm được bằng CloudWatch Logs Insights (Chương 10).</li>
  <li>Log group mới mặc định giữ dữ liệu <strong>mãi mãi</strong>, và lưu trữ thì tính tiền. Đặt thời hạn giữ (ví dụ 30 ngày) ngay khi tạo.</li>
</ul>

<h3>Góc hacker — đúng hơn là góc sự cố: ngày 19/7/2024</h3>
<p>Ngày 19/7/2024 một bản cập nhật nội dung lỗi của cảm biến Falcon (CrowdStrike) được đẩy tới máy Windows trên toàn thế giới cùng một lúc. Microsoft ước tính <strong>8,5 triệu</strong> thiết bị bị sập; hãng bay, bệnh viện, ngân hàng ngưng trệ. Báo cáo sau sự cố của CrowdStrike hứa đúng thứ bài này đang tập: <strong>deploy so le</strong> (canary trước, rồi mở rộng dần), theo dõi sức khoẻ giữa các bước, và khả năng dừng lại để rollback. Cập nhật cuốn chiếu, health check và circuit breaker là phiên bản nhỏ, hằng ngày của kỷ luật đó. Với rủi ro lớn hơn, ECS còn hỗ trợ deploy blue/green qua AWS CodeDeploy: bản mới có listener thử và một phần lưu lượng trước khi chuyển hẳn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Deploy không gián đoạn trên ECS thế nào?"</strong> — Cập nhật cuốn chiếu với minimumHealthyPercent=100 và maximumPercent=200, health check của ALB, deregistration delay để xả, và ứng dụng xử lý SIGTERM.</li>
  <li><strong>"Sao phải dùng target type ip?"</strong> — Task Fargate dùng awsvpc, mỗi task có card mạng và IP riêng; không có máy nào để đăng ký.</li>
  <li><strong>"Bọn anh đã xoay mật khẩu DB mà không thấy gì thay đổi. Vì sao?"</strong> — ECS chỉ bơm bí mật lúc task khởi động; phải force new deployment (và giữ mật khẩu cũ còn hiệu lực tới khi deploy xong).</li>
  <li><strong>"Deployment circuit breaker làm gì?"</strong> — Đếm task hỏng của một lượt deploy (ngưỡng 50 % desired, tối thiểu 3, tối đa 200), đánh dấu thất bại và có thể tự rollback về lượt hoàn tất gần nhất.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<p>Chép <code>scratchpad/aws/lab/c7/73.sh</code> và đổi cách cập nhật thành <code>minimumHealthyPercent=50</code>, <code>maximumPercent=100</code>: dừng một task cũ, chạy một task mới, chờ khoẻ, rồi tới task thứ hai.</p>
<p><strong>Đạt khi</strong>: bộ đếm tải vẫn báo 0 yêu cầu lỗi, không lúc nào có quá 2 task, và bạn giải thích được trong hai câu khi nào chọn 50/100 thay vì 100/200 (gợi ý: giới hạn công suất, chi phí, hoặc cơ sở dữ liệu không chịu nổi gấp đôi số kết nối).</p>
${giai('Gợi ý: vòng lặp', bash(`
for k in $(ls $KD); do          # các khe cũ
  rut $k                         # xả + SIGTERM một task cũ
  m=$(chay_task 2 2>&3)          # chạy một task mới
  cho_khoe $m || { echo "task mới không khoẻ - dừng và rollback"; break; }
done`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Target type ip</span><span class="v">Target group có đích là địa chỉ IP — bắt buộc với Fargate/awsvpc.</span></div>
  <div class="kv"><span class="k">minimumHealthyPercent / maximumPercent</span><span class="v">Cận dưới và cận trên số task chạy trong lúc cập nhật cuốn chiếu, tính theo % desiredCount.</span></div>
  <div class="kv"><span class="k">Health check grace period</span><span class="v">Số giây ECS bỏ qua health check hỏng của load balancer sau khi task khởi động.</span></div>
  <div class="kv"><span class="k">Deregistration delay</span><span class="v">Thời gian ALB giữ các yêu cầu đang dở trên đích sắp bị gỡ (xả).</span></div>
  <div class="kv"><span class="k">Deployment circuit breaker</span><span class="v">Đánh hỏng lượt deploy khi có quá nhiều task hỏng, có thể tự rollback.</span></div>
  <div class="kv"><span class="k">FireLens</span><span class="v">Chuyển log của ECS bằng một container phụ Fluent Bit (hoặc Fluentd).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>ALB public ⇒ target group (ip) ⇒ task trong subnet private ⇒ RDS; security group nối nhau theo nhóm, không theo IP.</li>
  <li>Cuốn chiếu 100/200 + health check + xả + xử lý SIGTERM = deploy với 0 yêu cầu lỗi (đã đo).</li>
  <li>Bí mật được đọc lúc task khởi động; xoay xong thì force new deployment.</li>
  <li>Circuit breaker chặn bản lỗi sau từ 3 task hỏng và tự rollback.</li>
  <li>stdout chính là log: awslogs hoặc FireLens, mỗi task một stream, nhớ đặt thời hạn giữ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html', '🧯', 'Tài liệu AWS — Circuit breaker phát hiện lỗi deploy ra sao', 'Các giai đoạn, ngưỡng và luật rollback.')}
${tl('https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/', '🚨', 'CrowdStrike — Báo cáo sơ bộ sau sự cố (2024)', 'Điều gì đã sai và những thay đổi deploy so le sau đó.')}

<h3>Nguồn</h3>
<ul>
  <li>Deploy cuốn chiếu (minimum/maximum percent): <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html</a></li>
  <li>Deployment circuit breaker: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html</a></li>
  <li>Truyền bí mật vào container: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html</a></li>
  <li>Chuyển log bằng FireLens: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html</a></li>
  <li>Đầu ra CloudWatch của Fluent Bit: <a href="https://docs.fluentbit.io/manual/pipeline/outputs/cloudwatch" target="_blank" rel="noopener">docs.fluentbit.io/manual/pipeline/outputs/cloudwatch</a></li>
  <li>Lưu ý bảo mật khi dùng Fargate: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-security-considerations.html</a></li>
  <li>Microsoft về sự cố CrowdStrike (8,5 triệu thiết bị): <a href="https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/" target="_blank" rel="noopener">blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/</a></li>
  <li>Báo cáo sơ bộ sau sự cố của CrowdStrike: <a href="https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/" target="_blank" rel="noopener">crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/</a></li>
</ul>
</div>
`;
/* ═════ 7.4 — So sánh ═════ */
const L74_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 4</span>
<h2>7.4 — Choosing where containers run: EC2, ECS on EC2, Fargate, EKS, and what replaced App Runner</h2>
<p class="lead">AWS offers several ways to run the same image, and job descriptions name them all: "experience with ECS/EKS", "Kubernetes a plus". This lesson puts them side by side with prices pulled from the AWS Price List API for Singapore, says what each one makes <em>you</em> responsible for, and gives a decision path you can defend in an interview. It also records a change many tutorials miss: <strong>App Runner no longer accepts new customers</strong>.</p>

<h3>The picture: getting around a city</h3>
<ul>
  <li><strong>EC2 + Docker</strong> = your own car: cheapest per kilometre if you drive a lot, but you do the oil changes (OS patches), insurance and parking.</li>
  <li><strong>ECS on EC2</strong> = your own fleet of cars with a dispatcher who decides which car takes which trip. You still maintain the cars.</li>
  <li><strong>ECS on Fargate</strong> = a car with driver, billed by the minute for the size of car you ordered. You never touch an engine.</li>
  <li><strong>EKS</strong> = joining a big international fleet company (Kubernetes): standard rules everywhere, huge ecosystem, but a monthly membership fee and a rule book to keep up with.</li>
  <li><strong>Lambda</strong> (Chapter 8) = the bus: you pay per ride, it comes when called, but it runs on its routes and has a time limit.</li>
</ul>

<h3>Side by side</h3>
<table>
  <thead><tr><th></th><th>EC2 + Docker</th><th>ECS on EC2</th><th>ECS on Fargate</th><th>EKS</th></tr></thead>
  <tbody>
    <tr><td>You manage</td><td>OS, Docker, restarts, scaling, deploys</td><td>OS and capacity of the hosts</td><td>Only the task definition and service</td><td>Kubernetes version upgrades, nodes (unless Fargate/Auto Mode), add-ons</td></tr>
    <tr><td>Unit of billing</td><td>Instance-hours</td><td>Instance-hours (ECS itself is free)</td><td>vCPU-hours + GB-hours of each task</td><td>0.10 USD/cluster-hour + nodes</td></tr>
    <tr><td>Start-up of a new copy</td><td>Minutes (new instance)</td><td>Seconds if a host has room</td><td>Tens of seconds to a minute</td><td>Seconds if a node has room</td></tr>
    <tr><td>GPUs, daemons, special kernels</td><td>Yes</td><td>Yes</td><td>No GPUs, no privileged containers</td><td>Yes (on EC2 nodes)</td></tr>
    <tr><td>Portability</td><td>Anywhere Docker runs</td><td>AWS-specific API</td><td>AWS-specific API</td><td>Kubernetes manifests run on any cloud</td></tr>
    <tr><td>Fits</td><td>One small app, learning, full control</td><td>Steady high load, cost-tuned teams</td><td>Most web APIs and workers of small/medium teams</td><td>Many teams/services, existing Kubernetes skills, multi-cloud</td></tr>
  </tbody>
</table>

<h3>See it running: what a month costs</h3>
<p>The same small LabFlow API, two copies for availability, prices from the Price List API (Singapore, November 2026), computed by <code>scratchpad/aws/lab/c7/74-gia.mjs</code>:</p>
${OUT_74_GIA}
<ul>
  <li>For two small tasks, <strong>Fargate is cheaper than two EC2 instances</strong> (22.49 vs 30.95 USD) because you pay for 0.25 vCPU instead of 2. ARM (Graviton) saves another 20 %.</li>
  <li>The comparison flips when tasks get big and busy: double the task size (44.98 USD) and EC2 wins — and with Savings Plans (lesson 4.5) by more. Fargate's premium buys you not patching, not packing tasks onto hosts, and per-task isolation.</li>
  <li><strong>EKS costs 73 USD a month before a single pod runs</strong> — more than the whole Fargate API. And a cluster left on an old Kubernetes version past its 14 months of standard support moves to extended support: 0.60 USD/hour, 438 USD a month. Kubernetes is a commitment to upgrade regularly.</li>
  <li>Not in the table but always present: the ALB (18.40 USD + LCU), NAT gateway or VPC endpoints for private tasks, the database, logs. For a student project, Chapter 0's Budgets alarm still applies.</li>
</ul>

<h3>App Runner is closed to new customers — use ECS Express Mode</h3>
<p>Older tutorials recommend <strong>AWS App Runner</strong> as the "just give it an image" option. As of November 2026 its documentation states that App Runner <strong>is no longer open to new customers</strong>; existing customers keep using it, but no new features are planned. AWS recommends <strong>Amazon ECS Express Mode</strong> instead: you provide a container image, a task execution role and an infrastructure role, and ECS creates and wires the rest (Fargate service, Application Load Balancer, scaling, logs). There is no extra charge for Express Mode itself; you pay for the Fargate tasks, the ALB, logs and data transfer it creates. Everything you learned in 7.2–7.3 is what Express Mode builds for you — which is why you learn it by hand first.</p>
<p>Two more names you will meet: <strong>ECS Managed Instances</strong> (AWS manages the EC2 hosts of an ECS cluster for a per-instance management fee — the middle ground between EC2 and Fargate) and <strong>EKS Auto Mode</strong> (AWS manages the worker nodes of an EKS cluster).</p>

<h3>A decision path you can defend</h3>
<ol>
  <li>Is it short, event-driven and under 15 minutes per run? Look at <strong>Lambda</strong> (Chapter 8).</li>
  <li>Is it a web API or worker in a container, small or medium team, on AWS only? <strong>ECS on Fargate</strong> (or Express Mode to start).</li>
  <li>Is the load high and steady, or do you need GPUs, special instance types or daemons? <strong>ECS on EC2</strong> (or Managed Instances).</li>
  <li>Do several teams already speak Kubernetes, need its ecosystem (Helm, operators, service mesh) or run on more than one cloud? <strong>EKS</strong> — and budget people-time for upgrades.</li>
  <li>One small app, learning, or the cheapest possible bill? <strong>One VPS or EC2 with Docker</strong>, exactly what cuongthai.com does today. Moving later is mostly writing a task definition, because the image is already the unit.</li>
</ol>

<h3>Real-world note: what employers in Vietnam ask</h3>
<p>Job posts for backend roles at outsourcing companies and banks commonly list "Docker, Kubernetes, AWS (ECS/EKS)". Kubernetes knowledge transfers across clouds, so it appears often; ECS appears in teams that are AWS-only and small. If you can explain the trade-off above with numbers — 73 USD for an empty EKS control plane, ~22 USD for two Fargate tasks — you will stand out more than by listing tools.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
  <li><strong>"ECS or EKS for a new project?"</strong> — Depends on team and portability: ECS is simpler and has no control-plane fee; EKS when Kubernetes skills/ecosystem or multi-cloud matter. Mention the 0.10 USD/hour control plane and upgrade cadence.</li>
  <li><strong>"When is Fargate more expensive than EC2?"</strong> — Large, steadily busy tasks; EC2 with Savings Plans and good bin-packing wins. Fargate wins for small or spiky services and saves operations time.</li>
  <li><strong>"Can Fargate run GPU workloads?"</strong> — No; use ECS/EKS on GPU EC2 instances (lesson 4.6).</li>
  <li><strong>"What would you use instead of App Runner today?"</strong> — ECS Express Mode, per AWS's own recommendation, or a plain Fargate service.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<p>Edit <code>74-gia.mjs</code> to price the <strong>Spring Boot</strong> version: 2 tasks of 0.5 vCPU / 1 GB on ARM, plus the ALB, plus an RDS db.t4g.micro (0.025 USD/hour, lesson 6.1). Compare with one t4g.small EC2 running everything with Docker Compose.</p>
<p><strong>Pass when</strong>: your script prints both monthly totals and one sentence on what the extra money buys (availability across AZs, managed database, no OS patching).</p>
${giai('Hint: the numbers', bash(`
# Fargate ARM 2 × (0.5 × 0.04045 + 1 × 0.00442) × 730 ≈ 35.98
# ALB 0.0252 × 730 ≈ 18.40   ·   RDS 0.025 × 730 ≈ 18.25 (+ storage)
# ⇒ ≈ 72.6 USD/month  vs  one t4g.small 0.0212 × 730 ≈ 15.48 USD/month (single machine, single AZ)`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Launch type / capacity provider</span><span class="v">Where tasks run: FARGATE, FARGATE_SPOT, EC2 (Auto Scaling group), Managed Instances.</span></div>
  <div class="kv"><span class="k">EKS</span><span class="v">Managed Kubernetes control plane; 0.10 USD/cluster-hour under standard support.</span></div>
  <div class="kv"><span class="k">Extended support</span><span class="v">12 more months on an old Kubernetes version at 0.60 USD/cluster-hour.</span></div>
  <div class="kv"><span class="k">ECS Express Mode</span><span class="v">ECS creates the Fargate service, ALB and scaling from an image and two roles; AWS's suggested replacement for App Runner.</span></div>
  <div class="kv"><span class="k">Bin-packing</span><span class="v">Fitting many tasks onto few EC2 hosts to use them fully — your job on EC2, AWS's on Fargate.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Same image, five homes: EC2, ECS on EC2, Fargate, EKS, Lambda — they differ in who patches and how you pay.</li>
  <li>Small services: Fargate (~22 USD for two tiny tasks) beats two EC2 instances; big steady ones: EC2 wins.</li>
  <li>EKS starts at 73 USD/month for the control plane alone and requires regular upgrades.</li>
  <li>App Runner is closed to new customers; AWS points to ECS Express Mode.</li>
  <li>A VPS with Docker remains a valid answer for one small app; the image makes moving later cheap.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html', '⚡', 'AWS docs — Amazon ECS Express Mode', 'What it creates from an image and two roles, and how it is priced.')}
${tl('https://aws.amazon.com/eks/pricing/', '☸️', 'Amazon EKS pricing', 'Standard vs extended support and node options.')}

<h3>Sources</h3>
<ul>
  <li>Price List API (AmazonECS, AmazonEKS, Singapore), retrieved November 2026 — <code>~/.rtq-aws/n7</code>.</li>
  <li>AWS Fargate pricing: <a href="https://aws.amazon.com/fargate/pricing/" target="_blank" rel="noopener">aws.amazon.com/fargate/pricing/</a></li>
  <li>Amazon EKS pricing (standard 14 months, extended 12 months, 0.60 USD/hour): <a href="https://aws.amazon.com/eks/pricing/" target="_blank" rel="noopener">aws.amazon.com/eks/pricing/</a></li>
  <li>What is Amazon EKS: <a href="https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html" target="_blank" rel="noopener">docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html</a></li>
  <li>App Runner availability change: <a href="https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html" target="_blank" rel="noopener">docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html</a></li>
  <li>Amazon ECS Express Mode: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html</a></li>
  <li>ECS Managed Instances: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html</a></li>
  <li>Kubernetes overview: <a href="https://kubernetes.io/docs/concepts/overview/" target="_blank" rel="noopener">kubernetes.io/docs/concepts/overview/</a></li>
</ul>
</div>
`;
const L74_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 4</span>
<h2>7.4 — Chọn nơi chạy container: EC2, ECS trên EC2, Fargate, EKS, và thứ đã thay App Runner</h2>
<p class="lead">AWS có nhiều cách chạy cùng một ảnh, và tin tuyển dụng gọi tên đủ cả: "có kinh nghiệm ECS/EKS", "biết Kubernetes là lợi thế". Bài này đặt chúng cạnh nhau với giá kéo từ Price List API của AWS cho Singapore, nói rõ mỗi cách bắt <em>bạn</em> chịu trách nhiệm phần nào, và đưa ra một đường quyết định bảo vệ được khi phỏng vấn. Bài cũng ghi lại một thay đổi nhiều hướng dẫn bỏ sót: <strong>App Runner không nhận khách hàng mới nữa</strong>.</p>

<h3>Liên tưởng: đi lại trong thành phố</h3>
<ul>
  <li><strong>EC2 + Docker</strong> = xe riêng: đi nhiều thì rẻ nhất mỗi cây số, nhưng bạn tự thay dầu (vá hệ điều hành), tự mua bảo hiểm, tự tìm chỗ đỗ.</li>
  <li><strong>ECS trên EC2</strong> = đội xe riêng có người điều phối quyết định xe nào chạy chuyến nào. Xe thì bạn vẫn tự bảo dưỡng.</li>
  <li><strong>ECS trên Fargate</strong> = xe có tài xế, tính tiền theo phút theo cỡ xe bạn gọi. Bạn không bao giờ chạm vào máy.</li>
  <li><strong>EKS</strong> = gia nhập một hãng xe quốc tế lớn (Kubernetes): luật chung ở mọi nơi, hệ sinh thái khổng lồ, nhưng có phí thành viên hằng tháng và một cuốn luật phải theo kịp.</li>
  <li><strong>Lambda</strong> (Chương 8) = xe buýt: trả theo lượt, gọi là tới, nhưng chạy theo tuyến và có giới hạn thời gian.</li>
</ul>

<h3>Đặt cạnh nhau</h3>
<table>
  <thead><tr><th></th><th>EC2 + Docker</th><th>ECS trên EC2</th><th>ECS trên Fargate</th><th>EKS</th></tr></thead>
  <tbody>
    <tr><td>Bạn tự lo</td><td>Hệ điều hành, Docker, khởi động lại, co giãn, deploy</td><td>Hệ điều hành và công suất của các máy</td><td>Chỉ task definition và service</td><td>Nâng phiên bản Kubernetes, node (trừ khi dùng Fargate/Auto Mode), add-on</td></tr>
    <tr><td>Đơn vị tính tiền</td><td>Giờ máy</td><td>Giờ máy (ECS miễn phí)</td><td>vCPU-giờ + GB-giờ của từng task</td><td>0,10 USD/cụm-giờ + node</td></tr>
    <tr><td>Thêm một bản mới mất</td><td>Vài phút (máy mới)</td><td>Vài giây nếu máy còn chỗ</td><td>Vài chục giây tới một phút</td><td>Vài giây nếu node còn chỗ</td></tr>
    <tr><td>GPU, daemon, nhân đặc biệt</td><td>Có</td><td>Có</td><td>Không GPU, không container đặc quyền</td><td>Có (trên node EC2)</td></tr>
    <tr><td>Mang đi nơi khác</td><td>Chỗ nào chạy Docker cũng được</td><td>API riêng của AWS</td><td>API riêng của AWS</td><td>Manifest Kubernetes chạy trên mọi cloud</td></tr>
    <tr><td>Hợp với</td><td>Một ứng dụng nhỏ, đang học, muốn toàn quyền</td><td>Tải cao đều đặn, đội tối ưu chi phí</td><td>Phần lớn API web và worker của đội nhỏ/vừa</td><td>Nhiều đội/nhiều service, đã có kỹ năng Kubernetes, đa cloud</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật: một tháng tốn bao nhiêu</h3>
<p>Vẫn API LabFlow nhỏ, hai bản để chịu lỗi, giá lấy từ Price List API (Singapore, tháng 11/2026), tính bằng <code>scratchpad/aws/lab/c7/74-gia.mjs</code>:</p>
${OUT_74_GIA}
<ul>
  <li>Với hai task nhỏ, <strong>Fargate rẻ hơn hai máy EC2</strong> (22,49 so với 30,95 USD) vì bạn trả cho 0,25 vCPU chứ không phải 2. ARM (Graviton) bớt thêm 20 %.</li>
  <li>Bảng đảo chiều khi task to và bận: nhân đôi cỡ task (44,98 USD) là EC2 thắng — có Savings Plans (bài 4.5) thì thắng xa hơn. Phần trả thêm cho Fargate mua về việc không phải vá máy, không phải xếp task lên máy, và mỗi task cách ly riêng.</li>
  <li><strong>EKS tốn 73 USD mỗi tháng trước khi chạy pod nào</strong> — nhiều hơn cả nguyên API trên Fargate. Và một cụm để nằm ở phiên bản Kubernetes cũ quá 14 tháng hỗ trợ chuẩn sẽ sang hỗ trợ mở rộng: 0,60 USD/giờ, 438 USD/tháng. Dùng Kubernetes là cam kết nâng cấp đều đặn.</li>
  <li>Không có trong bảng nhưng luôn có mặt: ALB (18,40 USD + LCU), NAT gateway hoặc VPC endpoint cho task private, cơ sở dữ liệu, log. Với dự án sinh viên, cảnh báo Budgets ở Mục 0 vẫn là thứ đầu tiên.</li>
</ul>

<h3>App Runner đã đóng với khách mới — dùng ECS Express Mode</h3>
<p>Các hướng dẫn cũ hay giới thiệu <strong>AWS App Runner</strong> là lựa chọn "đưa ảnh là chạy". Tính tới tháng 11/2026, tài liệu của nó ghi App Runner <strong>không còn nhận khách hàng mới</strong>; khách cũ vẫn dùng bình thường nhưng sẽ không có tính năng mới. AWS khuyên dùng <strong>Amazon ECS Express Mode</strong>: bạn đưa một ảnh container, một task execution role và một infrastructure role, ECS tự tạo và nối phần còn lại (service Fargate, Application Load Balancer, co giãn, log). Express Mode không thu thêm phí; bạn trả cho task Fargate, ALB, log và truyền dữ liệu mà nó tạo ra. Mọi thứ học ở 7.2–7.3 chính là thứ Express Mode dựng giúp bạn — vì thế phải tự tay học trước.</p>
<p>Hai cái tên nữa bạn sẽ gặp: <strong>ECS Managed Instances</strong> (AWS quản các máy EC2 của cụm ECS, thu phí quản lý theo giờ máy — điểm giữa của EC2 và Fargate) và <strong>EKS Auto Mode</strong> (AWS quản các node của cụm EKS).</p>

<h3>Đường quyết định bảo vệ được</h3>
<ol>
  <li>Việc ngắn, chạy theo sự kiện, dưới 15 phút một lần? Xem <strong>Lambda</strong> (Chương 8).</li>
  <li>API web hoặc worker trong container, đội nhỏ/vừa, chỉ dùng AWS? <strong>ECS trên Fargate</strong> (hoặc Express Mode để bắt đầu).</li>
  <li>Tải cao và đều, hay cần GPU, loại máy đặc biệt, daemon? <strong>ECS trên EC2</strong> (hoặc Managed Instances).</li>
  <li>Nhiều đội đã nói tiếng Kubernetes, cần hệ sinh thái của nó (Helm, operator, service mesh) hoặc chạy trên nhiều cloud? <strong>EKS</strong> — và dành thời gian người cho việc nâng cấp.</li>
  <li>Một ứng dụng nhỏ, đang học, hoặc muốn hoá đơn rẻ nhất? <strong>Một VPS hoặc EC2 chạy Docker</strong>, đúng như cuongthai.com đang làm. Sau này chuyển đi chủ yếu chỉ là viết task definition, vì ảnh đã là đơn vị giao hàng.</li>
</ol>

<h3>Chuyện đi làm: nhà tuyển dụng ở Việt Nam hỏi gì</h3>
<p>Tin tuyển backend ở các công ty outsourcing và ngân hàng thường ghi "Docker, Kubernetes, AWS (ECS/EKS)". Kiến thức Kubernetes mang được qua mọi cloud nên xuất hiện nhiều; ECS hay gặp ở đội nhỏ chỉ dùng AWS. Nếu bạn giải thích được đánh đổi ở trên bằng con số — 73 USD cho một control plane EKS trống, khoảng 22 USD cho hai task Fargate — bạn sẽ nổi bật hơn là liệt kê tên công cụ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Dự án mới thì ECS hay EKS?"</strong> — Tuỳ đội và nhu cầu mang đi: ECS đơn giản hơn, không phí control plane; EKS khi cần kỹ năng/hệ sinh thái Kubernetes hoặc đa cloud. Nhắc 0,10 USD/giờ cho control plane và nhịp nâng cấp.</li>
  <li><strong>"Khi nào Fargate đắt hơn EC2?"</strong> — Task to và bận đều; EC2 có Savings Plans và xếp task khéo sẽ thắng. Fargate thắng với service nhỏ hoặc tải dồn cục, và tiết kiệm công vận hành.</li>
  <li><strong>"Fargate chạy việc GPU được không?"</strong> — Không; dùng ECS/EKS trên máy EC2 có GPU (bài 4.6).</li>
  <li><strong>"Hôm nay em dùng gì thay App Runner?"</strong> — ECS Express Mode, theo đúng khuyến nghị của AWS, hoặc một service Fargate thường.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Sửa <code>74-gia.mjs</code> để tính giá bản <strong>Spring Boot</strong>: 2 task 0,5 vCPU / 1 GB trên ARM, cộng ALB, cộng RDS db.t4g.micro (0,025 USD/giờ, bài 6.1). So với một máy EC2 t4g.small chạy tất cả bằng Docker Compose.</p>
<p><strong>Đạt khi</strong>: script in được cả hai tổng tiền tháng và một câu nói số tiền chênh mua được gì (chịu lỗi qua nhiều AZ, cơ sở dữ liệu có quản lý, không phải vá hệ điều hành).</p>
${giai('Gợi ý: các con số', bash(`
# Fargate ARM 2 × (0.5 × 0.04045 + 1 × 0.00442) × 730 ≈ 35.98
# ALB 0.0252 × 730 ≈ 18.40   ·   RDS 0.025 × 730 ≈ 18.25 (+ lưu trữ)
# ⇒ ≈ 72.6 USD/tháng  so với  một t4g.small 0.0212 × 730 ≈ 15.48 USD/tháng (một máy, một AZ)`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Launch type / capacity provider</span><span class="v">Nơi task chạy: FARGATE, FARGATE_SPOT, EC2 (Auto Scaling group), Managed Instances.</span></div>
  <div class="kv"><span class="k">EKS</span><span class="v">Control plane Kubernetes có quản lý; 0,10 USD/cụm-giờ khi còn hỗ trợ chuẩn.</span></div>
  <div class="kv"><span class="k">Extended support</span><span class="v">Thêm 12 tháng ở phiên bản Kubernetes cũ với giá 0,60 USD/cụm-giờ.</span></div>
  <div class="kv"><span class="k">ECS Express Mode</span><span class="v">ECS tự tạo service Fargate, ALB, co giãn từ một ảnh và hai role; AWS gợi ý thay App Runner.</span></div>
  <div class="kv"><span class="k">Bin-packing</span><span class="v">Xếp nhiều task lên ít máy EC2 cho đầy — việc của bạn trên EC2, của AWS trên Fargate.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cùng một ảnh, năm nơi ở: EC2, ECS trên EC2, Fargate, EKS, Lambda — khác nhau ở chỗ ai vá máy và trả tiền kiểu gì.</li>
  <li>Service nhỏ: Fargate (~22 USD cho hai task tí hon) thắng hai máy EC2; service to và bận đều: EC2 thắng.</li>
  <li>EKS khởi điểm 73 USD/tháng chỉ cho control plane và đòi nâng cấp đều đặn.</li>
  <li>App Runner đóng với khách mới; AWS chỉ sang ECS Express Mode.</li>
  <li>Một VPS chạy Docker vẫn là câu trả lời đúng cho một ứng dụng nhỏ; nhờ ảnh mà sau này chuyển đi rẻ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html', '⚡', 'Tài liệu AWS — Amazon ECS Express Mode', 'Nó tạo gì từ một ảnh và hai role, và tính tiền ra sao.')}
${tl('https://aws.amazon.com/eks/pricing/', '☸️', 'Bảng giá Amazon EKS', 'Hỗ trợ chuẩn và mở rộng, các lựa chọn node.')}

<h3>Nguồn</h3>
<ul>
  <li>Price List API (AmazonECS, AmazonEKS, Singapore), lấy tháng 11/2026 — <code>~/.rtq-aws/n7</code>.</li>
  <li>Giá AWS Fargate: <a href="https://aws.amazon.com/fargate/pricing/" target="_blank" rel="noopener">aws.amazon.com/fargate/pricing/</a></li>
  <li>Giá Amazon EKS (chuẩn 14 tháng, mở rộng 12 tháng, 0,60 USD/giờ): <a href="https://aws.amazon.com/eks/pricing/" target="_blank" rel="noopener">aws.amazon.com/eks/pricing/</a></li>
  <li>Amazon EKS là gì: <a href="https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html" target="_blank" rel="noopener">docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html</a></li>
  <li>Thay đổi về App Runner: <a href="https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html" target="_blank" rel="noopener">docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html</a></li>
  <li>Amazon ECS Express Mode: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html</a></li>
  <li>ECS Managed Instances: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/ManagedInstances.html</a></li>
  <li>Tổng quan Kubernetes: <a href="https://kubernetes.io/docs/concepts/overview/" target="_blank" rel="noopener">kubernetes.io/docs/concepts/overview/</a></li>
</ul>
</div>
`;
/* ═════ 7.5 — Lab chương 7 ═════ */
const L75_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab</span>
<h2>7.5 — Chapter 7 lab: LabFlow's container setup, from "it runs" to production-safe</h2>
<p class="lead">A teammate shipped LabFlow to ECS in an afternoon. It runs. But the repository lets anyone overwrite a tag and never scans, the database password sits in plain text in the task definition, one "admin" role does everything, there are no logs, the only task has a public IP, and nobody is sure which revision is live. Your job: bring it to 8/8 on the grader <strong>in place</strong> (no deleting and recreating the service), then clean up and prove nothing is left.</p>

<h3>The brief</h3>
<ul>
  <li>ECR <code>labflow-api</code>: tags immutable, scan on push, a lifecycle rule that expires untagged images.</li>
  <li>Task definition <code>labflow-api</code>: the DB password through <code>secrets</code> (Secrets Manager), separate execution and task roles, logs to CloudWatch.</li>
  <li>Service <code>labflow-api</code>: no public IP, at least 2 tasks across two subnets, running the newest revision.</li>
  <li>Runs against Moto (ECR, ECS, EC2). Remove <code>--endpoint-url</code> in <code>chung7.sh</code> and the same scripts grade a real account.</li>
</ul>

<h3>The grader (8 checks)</h3>
${MA_CHAM}

<h3>Starting point: the hurried version</h3>
${MA_TRUOC}
${OUT_75_TRUOC}
<p>One out of eight — and the one that passes only passes because there has been a single revision so far. <strong>Stop the video here and try it yourself.</strong> One trap: registering a new task definition revision changes nothing until the service is told to use it.</p>

${giai('Solution: giai.sh, the grader at 8/8', MA_GIAI + OUT_75_GIAI + `
<ol>
  <li>Repository settings change in place: <code>put-image-tag-mutability</code>, <code>put-image-scanning-configuration</code>, <code>put-lifecycle-policy</code>. Images already pushed are not re-scanned automatically — run a manual scan or push again.</li>
  <li>A task definition is never edited: register revision 2 with <code>secrets</code>, two roles and <code>logConfiguration</code>. Then the password that sat in revision 1 must be treated as leaked: anyone with <code>ecs:DescribeTaskDefinition</code> could read it. <strong>Rotate it</strong>, and deregister revision 1.</li>
  <li><code>update-service</code> moves the service to revision 2, sets 2 tasks and the private network configuration in one call; ECS rolls the tasks as in lesson 7.3.</li>
  <li><strong>Moto differs:</strong> AWS accepts a bare family name (<code>labflow-api</code>) and resolves it to the latest ACTIVE revision; Moto stores the text as sent. The solution names the revision explicitly (<code>labflow-api:2</code>), which is also the better habit — your pipeline should know exactly which revision it deployed.</li>
  <li>The execution role needs <code>secretsmanager:GetSecretValue</code> on that one secret (plus <code>kms:Decrypt</code> if it uses a customer key) — otherwise the new tasks fail to start with a secrets error and the circuit breaker rolls back.</li>
</ol>`)}

<h3>Clean-up and the "is anything still billing?" check</h3>
${MA_DON}
${MA_CONGI}
${OUT_75_DON}
<p>Order matters: scale the service to 0 and delete it, deregister task definitions, delete the cluster, then the repository with <code>--force</code> (it deletes the images inside). Four zeros. On a real account also check: the ALB and target group, NAT gateway or VPC endpoints, the CloudWatch log group, and the secret — each of these bills on its own.</p>

<h3>What this costs on a real account (Singapore, per month)</h3>
<table>
  <thead><tr><th>Item</th><th>Price</th><th>Month</th></tr></thead>
  <tbody>
    <tr><td>2 Fargate tasks ARM, 0.25 vCPU / 0.5 GB</td><td>0.04045/vCPU-h + 0.00442/GB-h</td><td>≈ 17.99 USD</td></tr>
    <tr><td>ALB (hours only)</td><td>0.0252/h</td><td>≈ 18.40 USD</td></tr>
    <tr><td>ECR storage, ~300 MB of images</td><td>0.10/GB-month</td><td>≈ 0.03 USD</td></tr>
    <tr><td>Secrets Manager, 1 secret</td><td>0.40/secret-month</td><td>0.40 USD</td></tr>
    <tr><td>CloudWatch Logs</td><td>per GB ingested + stored</td><td>cents at this size</td></tr>
    <tr><td>NAT gateway (if used instead of endpoints)</td><td>0.059/h + 0.059/GB</td><td>≈ 43 USD + data</td></tr>
  </tbody>
</table>
<p>The NAT gateway can cost more than the application. For a lab, run for an hour and clean up the same day; for a real project, compare it with VPC endpoints (Chapter 3.4).</p>

<h3>🎤 Interview questions for this chapter</h3>
<ol>
  <li><strong>"Walk me through deploying a new version on ECS."</strong> — CI builds the image, pushes it to ECR with a unique tag, registers a new task definition revision pointing at the digest, updates the service; rolling update with health checks; circuit breaker rolls back on failure.</li>
  <li><strong>"A password was committed into a task definition. What do you do?"</strong> — Treat it as leaked: rotate it, move it to Secrets Manager referenced by <code>valueFrom</code>, register a new revision, deregister the old one, and restrict <code>ecs:DescribeTaskDefinition</code>.</li>
  <li><strong>"Why two IAM roles per task?"</strong> — Least privilege: ECS needs to pull and read secrets; the app needs its own resources. One role would give the app every secret.</li>
  <li><strong>"Tasks are stuck in PENDING then stop with CannotPullContainerError. Causes?"</strong> — No route from private subnets to ECR (no NAT/endpoints), execution role missing ECR permissions, wrong image URI or tag, or an architecture mismatch (ARM64 task, x86-only image).</li>
  <li><strong>"Why not run the database in a container on Fargate too?"</strong> — Fargate tasks are disposable; storage must outlive them. Use RDS (Chapter 6) or at least EFS with backups; keep the database out of the replaceable layer.</li>
</ol>

<h3>🧪 Practice — this lab is the practice</h3>
<p><strong>Pass when</strong>: <code>cham.sh</code> prints <code>ĐIỂM: 8/8</code>, then <code>con-gi.sh</code> prints four zeros. Extra credit: add a ninth check that fails if the image is referenced by a tag instead of a digest, then fix the task definition to pass it.</p>

<h3>Sources</h3>
<ul>
  <li>Task execution role permissions for secrets: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html</a></li>
  <li>Passing secrets with valueFrom: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html</a></li>
  <li>ECR tag immutability and scanning: <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html</a></li>
  <li>Prices: Price List API, Singapore, November 2026 (Fargate, ECR, Secrets Manager, ALB, NAT).</li>
</ul>
</div>
`;
const L75_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab</span>
<h2>7.5 — Lab chương 7: phần container của LabFlow, từ "chạy được" tới an toàn cho production</h2>
<p class="lead">Một bạn cùng nhóm đưa LabFlow lên ECS trong một buổi chiều. Nó chạy. Nhưng repository cho bất kỳ ai ghi đè tag và không bao giờ quét, mật khẩu DB nằm trần trong task definition, một role "admin" làm mọi việc, không có log, task duy nhất mang IP công khai, và không ai chắc revision nào đang chạy. Việc của bạn: đưa nó lên 8/8 ở bộ chấm <strong>bằng cách sửa tại chỗ</strong> (không xoá rồi tạo lại service), rồi dọn dẹp và chứng minh không còn gì sót lại.</p>

<h3>Đề bài</h3>
<ul>
  <li>ECR <code>labflow-api</code>: tag bất biến, quét khi đẩy, có luật vòng đời xoá ảnh không tag.</li>
  <li>Task definition <code>labflow-api</code>: mật khẩu DB đi qua <code>secrets</code> (Secrets Manager), execution role và task role tách riêng, log về CloudWatch.</li>
  <li>Service <code>labflow-api</code>: không IP công khai, ít nhất 2 task trên hai subnet, chạy revision mới nhất.</li>
  <li>Chạy trên Moto (ECR, ECS, EC2). Bỏ <code>--endpoint-url</code> trong <code>chung7.sh</code> là cùng bộ script chấm được tài khoản thật.</li>
</ul>

<h3>Bộ chấm (8 phép)</h3>
${MA_CHAM}

<h3>Điểm xuất phát: bản làm vội</h3>
${MA_TRUOC}
${OUT_75_TRUOC}
<p>Một trên tám — và phép đạt được chỉ đạt vì tới giờ mới có đúng một revision. <strong>Dừng video ở đây và tự làm thử.</strong> Có một cái bẫy: đăng ký revision task definition mới chẳng thay đổi gì cho tới khi bạn bảo service dùng nó.</p>

${giai('Lời giải: giai.sh, bộ chấm 8/8', MA_GIAI + OUT_75_GIAI + `
<ol>
  <li>Thiết lập của repository sửa tại chỗ được: <code>put-image-tag-mutability</code>, <code>put-image-scanning-configuration</code>, <code>put-lifecycle-policy</code>. Ảnh đã đẩy từ trước không tự được quét lại — chạy quét tay hoặc đẩy lại.</li>
  <li>Task definition không bao giờ bị sửa: đăng ký revision 2 có <code>secrets</code>, hai role và <code>logConfiguration</code>. Rồi mật khẩu từng nằm ở revision 1 phải coi như đã lộ: ai có quyền <code>ecs:DescribeTaskDefinition</code> đều đọc được. <strong>Xoay nó</strong>, và deregister revision 1.</li>
  <li><code>update-service</code> chuyển service sang revision 2, đặt 2 task và cấu hình mạng private trong một lệnh; ECS thay task cuốn chiếu như bài 7.3.</li>
  <li><strong>Moto khác AWS:</strong> AWS nhận tên family trần (<code>labflow-api</code>) và tự hiểu là revision ACTIVE mới nhất; Moto lưu nguyên chữ đã gửi. Lời giải ghi rõ revision (<code>labflow-api:2</code>), và đó cũng là thói quen tốt hơn — pipeline của bạn phải biết chính xác nó đã deploy revision nào.</li>
  <li>Execution role cần <code>secretsmanager:GetSecretValue</code> trên đúng bí mật đó (cộng <code>kms:Decrypt</code> nếu bí mật dùng khoá riêng) — thiếu là task mới không khởi động được vì lỗi bí mật và circuit breaker sẽ rollback.</li>
</ol>`)}

<h3>Dọn dẹp và phép kiểm "còn gì đang tính tiền?"</h3>
${MA_DON}
${MA_CONGI}
${OUT_75_DON}
<p>Thứ tự quan trọng: hạ service về 0 rồi xoá, deregister task definition, xoá cluster, rồi xoá repository với <code>--force</code> (xoá luôn ảnh bên trong). Bốn số 0. Trên tài khoản thật kiểm thêm: ALB và target group, NAT gateway hoặc VPC endpoint, log group CloudWatch, và bí mật — mỗi thứ tính tiền riêng.</p>

<h3>Trên tài khoản thật tốn bao nhiêu (Singapore, mỗi tháng)</h3>
<table>
  <thead><tr><th>Khoản</th><th>Giá</th><th>Tháng</th></tr></thead>
  <tbody>
    <tr><td>2 task Fargate ARM, 0,25 vCPU / 0,5 GB</td><td>0,04045/vCPU-giờ + 0,00442/GB-giờ</td><td>≈ 17,99 USD</td></tr>
    <tr><td>ALB (chỉ tiền giờ)</td><td>0,0252/giờ</td><td>≈ 18,40 USD</td></tr>
    <tr><td>Lưu ảnh ECR, khoảng 300 MB</td><td>0,10/GB-tháng</td><td>≈ 0,03 USD</td></tr>
    <tr><td>Secrets Manager, 1 bí mật</td><td>0,40/bí mật-tháng</td><td>0,40 USD</td></tr>
    <tr><td>CloudWatch Logs</td><td>theo GB nạp + lưu</td><td>vài xu ở cỡ này</td></tr>
    <tr><td>NAT gateway (nếu dùng thay endpoint)</td><td>0,059/giờ + 0,059/GB</td><td>≈ 43 USD + dữ liệu</td></tr>
  </tbody>
</table>
<p>NAT gateway có thể đắt hơn cả ứng dụng. Làm lab thì chạy một giờ và dọn ngay trong ngày; dự án thật thì so với VPC endpoint (Chương 3.4).</p>

<h3>🎤 Câu phỏng vấn của chương</h3>
<ol>
  <li><strong>"Kể cách em deploy một bản mới trên ECS."</strong> — CI build ảnh, đẩy lên ECR với tag duy nhất, đăng ký revision task definition mới trỏ vào digest, cập nhật service; thay cuốn chiếu có health check; circuit breaker rollback khi hỏng.</li>
  <li><strong>"Lỡ để mật khẩu trong task definition. Em làm gì?"</strong> — Coi như đã lộ: xoay mật khẩu, chuyển sang Secrets Manager tham chiếu bằng <code>valueFrom</code>, đăng ký revision mới, deregister revision cũ, và siết quyền <code>ecs:DescribeTaskDefinition</code>.</li>
  <li><strong>"Sao mỗi task cần hai IAM role?"</strong> — Quyền tối thiểu: ECS cần kéo ảnh và đọc bí mật; ứng dụng cần tài nguyên riêng của nó. Gộp một role là trao cho ứng dụng mọi bí mật.</li>
  <li><strong>"Task kẹt ở PENDING rồi dừng với CannotPullContainerError. Nguyên nhân?"</strong> — Subnet private không có đường tới ECR (thiếu NAT/endpoint), execution role thiếu quyền ECR, sai URI hoặc tag ảnh, hoặc lệch kiến trúc (task ARM64, ảnh chỉ có x86).</li>
  <li><strong>"Sao không chạy luôn cơ sở dữ liệu trong container trên Fargate?"</strong> — Task Fargate là đồ dùng một lần; dữ liệu phải sống lâu hơn nó. Dùng RDS (Chương 6) hoặc ít nhất EFS có sao lưu; để cơ sở dữ liệu ngoài lớp có thể thay thế.</li>
</ol>

<h3>🧪 Thực hành — chính lab này là bài thực hành</h3>
<p><strong>Đạt khi</strong>: <code>cham.sh</code> in <code>ĐIỂM: 8/8</code>, rồi <code>con-gi.sh</code> in bốn số 0. Thêm điểm: viết phép kiểm thứ chín đánh trượt khi ảnh được tham chiếu bằng tag thay vì digest, rồi sửa task definition để qua nó.</p>

<h3>Nguồn</h3>
<ul>
  <li>Quyền của execution role để đọc bí mật: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html</a></li>
  <li>Truyền bí mật bằng valueFrom: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html</a></li>
  <li>Tag bất biến và quét ảnh ECR: <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html</a></li>
  <li>Giá: Price List API, Singapore, tháng 11/2026 (Fargate, ECR, Secrets Manager, ALB, NAT).</li>
</ul>
</div>
`;

/* ═════ 7.6 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [3, 1, 0, 2, 2, 0, 3, 1, 2, 0];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ7 = [
  Q('Someone pushed a new image to the existing tag v1 in a MUTABLE repository. What does a task pulling :v1 now run?|||Có người đẩy ảnh mới vào đúng tag v1 của một repository MUTABLE. Task kéo :v1 bây giờ chạy gì?', [
    'The old image — tags never move|||Ảnh cũ — tag không bao giờ dời',
    'The new image; only pulling by the old digest still gets the old one|||Ảnh mới; chỉ kéo theo digest cũ mới ra ảnh cũ',
    'Nothing — the push fails with ImageTagAlreadyExistsException|||Không gì cả — lệnh đẩy hỏng với ImageTagAlreadyExistsException',
    'Both images, chosen at random|||Cả hai ảnh, chọn ngẫu nhiên',
  ], 1),
  Q('A Dockerfile does COPY .env then RUN rm .env. Is the secret in the pushed image?|||Dockerfile có COPY .env rồi RUN rm .env. Bí mật còn trong ảnh đã đẩy không?', [
    'No, rm deletes it before the push|||Không, rm đã xoá trước khi đẩy',
    'Yes, it stays in the layer created by COPY|||Có, nó nằm lại trong lớp do COPY tạo',
    'Only if the repository is MUTABLE|||Chỉ khi repository là MUTABLE',
    'Only on ARM64 images|||Chỉ với ảnh ARM64',
  ], 1),
  Q('How long is the Docker password from aws ecr get-login-password valid?|||Mật khẩu Docker lấy từ aws ecr get-login-password dùng được bao lâu?', [
    'Until you rotate your access key|||Tới khi bạn xoay khoá truy cập',
    '12 hours|||12 giờ',
    '15 minutes|||15 phút',
    '90 days|||90 ngày',
  ], 1),
  Q('Which role does ECS use to pull the image from ECR and read the secrets listed in the task definition?|||ECS dùng role nào để kéo ảnh từ ECR và đọc các bí mật khai trong task definition?', [
    'The task role|||Task role',
    'The task execution role|||Task execution role',
    'The ECS service-linked role only|||Chỉ service-linked role của ECS',
    'The IAM user who ran update-service|||IAM user đã chạy update-service',
  ], 1),
  Q('Code inside a Fargate task calls AWS with no keys in its environment. Where do its credentials come from?|||Mã trong một task Fargate gọi AWS mà biến môi trường không có khoá nào. Khoá đến từ đâu?', [
    'From the EC2 instance profile of the host|||Từ instance profile của máy chủ EC2 bên dưới',
    'From 169.254.170.2 plus the GUID path in AWS_CONTAINER_CREDENTIALS_RELATIVE_URI|||Từ 169.254.170.2 cộng đường dẫn có GUID trong AWS_CONTAINER_CREDENTIALS_RELATIVE_URI',
    'From ~/.aws/credentials baked into the image|||Từ ~/.aws/credentials đóng sẵn trong ảnh',
    'From the ALB|||Từ ALB',
  ], 1),
  Q('A task keeps stopping with exit code 137. The most likely cause?|||Một task cứ dừng với mã thoát 137. Nguyên nhân khả dĩ nhất?', [
    'The image tag is immutable|||Tag ảnh đang bất biến',
    'It ran out of its memory limit and was killed|||Nó vượt giới hạn bộ nhớ và bị giết',
    'The security group blocks port 8080|||Security group chặn cổng 8080',
    'The log group has no retention|||Log group chưa đặt thời hạn giữ',
  ], 1),
  Q('With desiredCount 2, minimumHealthyPercent 100 and maximumPercent 200, what does a rolling update do first?|||Với desiredCount 2, minimumHealthyPercent 100 và maximumPercent 200, cập nhật cuốn chiếu làm gì trước?', [
    'Stops both old tasks, then starts new ones|||Dừng cả hai task cũ, rồi mới chạy task mới',
    'Starts new tasks, waits until they are healthy, then drains and stops the old ones|||Chạy task mới, chờ khoẻ, rồi mới xả và dừng task cũ',
    'Stops one old task, then starts one new task|||Dừng một task cũ, rồi chạy một task mới',
    'Creates a new cluster|||Tạo một cluster mới',
  ], 1),
  Q('You changed the DB password in Secrets Manager. Running ECS tasks still use the old one. What fixes it?|||Bạn đổi mật khẩu DB trong Secrets Manager. Task ECS đang chạy vẫn dùng mật khẩu cũ. Cách sửa?', [
    'Wait 5 minutes — ECS refreshes secrets automatically|||Chờ 5 phút — ECS tự làm mới bí mật',
    'Force a new deployment so new tasks read the secret at start|||Force new deployment để task mới đọc bí mật lúc khởi động',
    'Restart the ALB|||Khởi động lại ALB',
    'Make the repository IMMUTABLE|||Đặt repository thành IMMUTABLE',
  ], 1),
  Q('For desiredCount 2, after how many failed tasks does the default deployment circuit breaker fail the deployment?|||Với desiredCount 2, circuit breaker mặc định đánh hỏng lượt deploy sau bao nhiêu task hỏng?', [
    '1|||1',
    '3 (50 % of desired, but at least 3)|||3 (50 % desired, nhưng tối thiểu 3)',
    '2|||2',
    'Never — it retries forever|||Không bao giờ — thử lại mãi',
  ], 1),
  Q('Which is true in November 2026?|||Điều nào đúng vào tháng 11/2026?', [
    'EKS has no control-plane charge|||EKS không thu phí control plane',
    'App Runner is closed to new customers; AWS recommends ECS Express Mode|||App Runner đóng với khách mới; AWS khuyên dùng ECS Express Mode',
    'Fargate supports GPU tasks|||Fargate chạy được task GPU',
    'Fargate is always cheaper than EC2|||Fargate luôn rẻ hơn EC2',
  ], 1),
];

export default {
  title: 'Chapter 7 — Containers: ECR and ECS Fargate|||Chương 7 — Container: ECR và ECS Fargate',
  description: 'Container trên AWS, chạy thật bằng Docker: ECR (registry:2 vai ECR, đăng nhập token, digest vs tag bị ghi đè, Trivy quét lỗ hổng + bí mật trong lớp ảnh), khái niệm ECS (task definition ↔ docker compose, service tự thay task chết, OOM 137, execution role vs task role, khoá tạm qua 169.254.170.2), Fargate sau ALB (cuốn chiếu 0 yêu cầu lỗi dưới tải, xoay bí mật + force new deployment, circuit breaker rollback bản lỗi, log qua Fluent Bit), chọn EC2/ECS/Fargate/EKS bằng giá thật (App Runner đã đóng ⇒ ECS Express Mode); lab chấm 8 phép + bảng giá tháng.',
  lessons: [
    {
      title: '7.1 — ECR: your private image registry|||7.1 — ECR: kho ảnh riêng',
      slug: 'aws-7-1-ecr',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Repository IMMUTABLE + scanOnPush + KMS + lifecycle; registry:2 thật vai ECR: chưa đăng nhập bị từ chối, token trong config.json, push ra digest, tag v1 bị đẩy đè ⇒ chạy bản 2, digest cũ vẫn bản 1; Trivy: node:16-alpine 42 lỗ hổng vs 10, .env đã rm vẫn bị tìm thấy; so với GHCR; Docker Hub 2019, Sysdig 2022, xz 2024.',
      content: L71_EN + L71_VI,
    },
    {
      title: '7.2 — ECS concepts: cluster, task definition, service|||7.2 — Khái niệm ECS: cluster, task definition, service',
      slug: 'aws-7-2-ecs-khai-niem',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cluster, task definition (revision bất biến), task, service; bảng docker compose ↔ task definition; bộ lập lịch thật giữ 2 task, giết một ⇒ thay trong 1 giây, IP mới; OOM mã 137; execution role vs task role; khoá tạm qua 169.254.170.2 (AWS CLI thật, agent giả lập), SSRF thiếu GUID ⇒ 404; Tesla 2018.',
      content: L72_EN + L72_VI,
    },
    {
      title: '7.3 — Running an API on Fargate behind an ALB|||7.3 — Chạy API trên Fargate sau ALB',
      slug: 'aws-7-3-fargate',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kiến trúc ALB public ⇒ target group ip ⇒ task private ⇒ RDS; cuốn chiếu 100/200 dưới tải: 281 yêu cầu 0 lỗi; xoay bí mật: task cũ vẫn giá trị cũ ⇒ force new deployment; bản v3 lỗi health ⇒ 3 task hỏng ⇒ circuit breaker rollback, 0 yêu cầu tới v3; log Fluent Bit ⇒ CloudWatch Logs; CrowdStrike 19/7/2024.',
      content: L73_EN + L73_VI,
    },
    {
      title: '7.4 — Choosing: EC2 vs ECS vs EKS vs App Runner|||7.4 — Chọn: EC2 vs ECS vs EKS vs App Runner',
      slug: 'aws-7-4-so-sanh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng EC2 / ECS trên EC2 / Fargate / EKS; giá tháng thật (Singapore): 2 task Fargate 22,49 USD, ARM 17,99, 2 × t4g.small 30,95, control plane EKS 73 (hỗ trợ mở rộng 438); App Runner đóng với khách mới ⇒ ECS Express Mode; Managed Instances, EKS Auto Mode; đường quyết định.',
      content: L74_EN + L74_VI,
    },
    {
      title: '7.5 — Chapter 7 lab + interview questions|||7.5 — Lab chương 7 + câu hỏi phỏng vấn',
      slug: 'aws-7-5-lab-7',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phần container của LabFlow qua bộ chấm 8 phép: bản vội 1/8 ⇒ lời giải 8/8 (ECR bất biến + quét + vòng đời, mật khẩu qua secrets, tách hai role, log, service private 2 task, revision mới nhất) ⇒ dọn ⇒ kiểm còn gì tính tiền; bảng giá tháng; 5 câu phỏng vấn.',
      content: L75_EN + L75_VI,
    },
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'aws-7-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về tag vs digest, bí mật trong lớp ảnh, token ECR, execution role vs task role, khoá qua 169.254.170.2, mã 137, cuốn chiếu 100/200, xoay bí mật, ngưỡng circuit breaker và App Runner.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ7 },
    },
  ],
};
