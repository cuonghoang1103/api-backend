/**
 * Cloud AWS — Chương 5: Ra Internet — ALB, Auto Scaling, Route 53 + ACM, CloudFront, WAF (soạn 20/11/2026, agent aws; phiên 24 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   5.1 alb · 5.2 auto-scaling · 5.3 route53 · 5.4 cloudfront · 5.5 waf-ddos · 5.6 lab-5 · 5.7 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c5/5N.sh + lab5/chay.sh:
 *   - AWS CLI 2.41.0 → Moto (elbv2, autoscaling, cloudfront, wafv2, acm — LocalStack community KHÔNG có các dịch vụ này)
 *     và LocalStack 4.12 (route53, acm): chỉ là CẤU HÌNH, không có lưu lượng thật;
 *   - lưu lượng THẬT trong Docker (mạng aws-c5-net 10.145.0.0/16): HAProxy 3.0 đóng vai ALB/WAF, container node làm máy đích,
 *     asg.sh làm Auto Scaling group thu nhỏ, CoreDNS 1.12 phục vụ đúng zone chép từ Route 53, nginx 1.27 proxy_cache làm edge của CDN,
 *     openssl ký chứng chỉ bằng CA của lab (vai trò ACM).
 *   - giá: Price List API Singapore 19/11/2026 (~/.rtq-aws/n5/).
 * Khác AWS đã ghi rõ trong bài: Moto nhận ALB một subnet và đặt mọi máy ASG vào một AZ; LocalStack nhận CNAME ở đỉnh zone và cấp
 *   chứng chỉ ACM ngay (AWS thật chờ bản ghi xác thực); CoreDNS weighted xếp lại thứ tự thay vì trả một bản ghi như Route 53.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/hcl()/js() của _chung.mjs.
 */
import { bash, json, hcl, js, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (scratchpad/aws/lab/c5: AWS CLI 2.41.0 → Moto / LocalStack 4.12; Docker thật: HAProxy 3.0, node 22, CoreDNS 1.12.1, nginx 1.27, openssl) ═════ */
const OUT_51_ALB_API = out("$ aws elbv2 create-load-balancer --name labflow-alb --type application --scheme internet-facing --subnets subnet-9cf0d06d9998374dc subnet-bf19306b69dd6803e --security-groups sg-78fa4b5f04f635833 --query 'LoadBalancers[0].[DNSName,Scheme,State.Code]' --output text\nlabflow-alb-1.ap-southeast-1.elb.amazonaws.com\tinternet-facing\tprovisioning\n$ aws elbv2 create-target-group --name tg-api --protocol HTTP --port 3000 --vpc-id vpc-113a79091a8250372 --target-type instance --health-check-path /health --health-check-interval-seconds 15 --healthy-threshold-count 2 --unhealthy-threshold-count 2 --matcher HttpCode=200 --query 'TargetGroups[0].[TargetGroupName,HealthCheckPath,HealthCheckIntervalSeconds,HealthyThresholdCount,UnhealthyThresholdCount]' --output text\ntg-api\t/health\t15\t2\t2\n$ aws elbv2 register-targets --target-group-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-api/4f8e03cd300c724f --targets Id=i-853a94f1fc5d4f5ea Id=i-c30e455c0dfe08047\n$ aws elbv2 create-listener --load-balancer-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:loadbalancer/app/labflow-alb/8aeecbdec797d65e --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-web/9c9494dd2d614b3f --query 'Listeners[0].[Protocol,Port]' --output text\nHTTP\t80\n$ aws elbv2 create-rule --listener-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:listener/app/labflow-alb/8aeecbdec797d65e/43cd360609167479 --priority 10 --conditions 'Field=path-pattern,Values=/api/*' --actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-api/4f8e03cd300c724f --query 'Rules[0].[Priority,Conditions[0].Values[0]]' --output text\n10\t/api/*\n$ aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-api/4f8e03cd300c724f --query 'TargetHealthDescriptions[].[Target.Id,TargetHealth.State]' --output text\ni-853a94f1fc5d4f5ea\thealthy\ni-c30e455c0dfe08047\thealthy");
const OUT_51_ALB_THAT_A = out("# Bốn máy đích (container node) ở hai 'AZ' giả: api-1 (az-a), api-2 (az-b), web-1, admin-1. ALB = HAProxy 3.0 tại 10.145.0.10.\n[khach]$ for i in 1 2 3 4; do curl -s alb/api/phong; done\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n{\"may\":\"api-2\",\"az\":\"az-b\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n{\"may\":\"api-2\",\"az\":\"az-b\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n[khach]$ curl -s alb/\n{\"may\":\"web-1\",\"az\":\"az-a\",\"vai\":\"web\",\"duong\":\"/\",\"xff\":\"10.145.0.100\"}\n[khach]$ curl -s -H \"Host: admin.labflow.example\" alb/\n{\"may\":\"admin-1\",\"az\":\"az-a\",\"vai\":\"admin\",\"duong\":\"/\",\"xff\":\"10.145.0.100\"}");
const OUT_51_ALB_THAT_B = out("# ── Health check: làm hỏng /health của api-2 (tạo /tmp/hong)\n$ docker exec aws-c5-api-2 touch /tmp/hong\n$ trạng thái tg-api (trang stats)\ntg-api   api-1    UP\ntg-api   api-2    DOWN\n[khach]$ for i in 1 2 3 4; do curl -s alb/api/phong; done\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n# ── Cả hai máy api chết ⇒ ALB trả 503\n$ docker exec aws-c5-api-1 touch /tmp/hong\n$ trạng thái tg-api\ntg-api   api-1    DOWN\ntg-api   api-2    DOWN\n[khach]$ curl -s -i alb/api/phong | head -1\nHTTP/1.1 503 Service Unavailable\r\n# ── Chữa xong: xoá /tmp/hong, chờ 2 lần kiểm đạt (rise 2)\n$ docker exec aws-c5-api-1 rm /tmp/hong; docker exec aws-c5-api-2 rm /tmp/hong\n$ trạng thái tg-api\ntg-api   api-1    UP\ntg-api   api-2    UP");
const OUT_51_ALB_THAT_C = out("# ── App thấy IP thật của khách qua X-Forwarded-For (kết nối TCP đến từ ALB 10.145.0.10)\n[khach]$ curl -s alb/api/ai-goi\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/ai-goi\",\"xff\":\"10.145.0.100\"}\n$ docker logs aws-c5-alb | grep '^Server.*is \\(DOWN\\|UP\\)'\nServer tg-api/api-1 ('aws-c5-api-1') is UP/READY (resolves again).\nServer tg-api/api-2 ('aws-c5-api-2') is UP/READY (resolves again).\nServer tg-admin/admin-1 ('aws-c5-admin-1') is UP/READY (resolves again).\nServer tg-web/web-1 ('aws-c5-web-1') is UP/READY (resolves again).\nServer tg-api/api-2 is DOWN, reason: Layer7 wrong status, code: 500, info: \"Internal Server Error\"\nServer tg-api/api-1 is DOWN, reason: Layer7 wrong status, code: 500, info: \"Internal Server Error\"\nServer tg-api/api-1 is UP, reason: Layer7 check passed, code: 200\nServer tg-api/api-2 is UP, reason: Layer7 check passed, code: 200");
const OUT_52_AB = out("Complete requests:      7859\nFailed requests:        0\nRequests per second:    196.31 [#/sec] (mean)\nTime per request:       40.751 [ms] (mean)");
const OUT_52_ASG_API = out("$ aws ec2 create-launch-template --launch-template-name labflow-api --launch-template-data file:///aws/lt.json --query 'LaunchTemplate.[LaunchTemplateName,LatestVersionNumber]' --output text\nlabflow-api\t1\n$ aws autoscaling create-auto-scaling-group --auto-scaling-group-name labflow-asg --launch-template 'LaunchTemplateName=labflow-api,Version=$Latest' --min-size 2 --max-size 4 --desired-capacity 2 --vpc-zone-identifier subnet-821ab81d9d6dcbfac,subnet-844611633cfd4a043 --target-group-arns arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:targetgroup/tg-api/bb6f6b001f9d48c8 --health-check-type ELB --health-check-grace-period 60\n$ aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names labflow-asg --query 'AutoScalingGroups[0].[MinSize,DesiredCapacity,MaxSize,HealthCheckType,length(Instances)]' --output text\n2\t2\t4\tELB\t2\n$ aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names labflow-asg --query 'AutoScalingGroups[0].Instances[].[InstanceId,AvailabilityZone,LifecycleState,HealthStatus]' --output text\ni-1413ebd2e0beeec3d\tap-southeast-1a\tInService\tHealthy\ni-2ad1bc15e2afb7d99\tap-southeast-1a\tInService\tHealthy\n$ aws autoscaling put-scaling-policy --auto-scaling-group-name labflow-asg --policy-name cpu-50 --policy-type TargetTrackingScaling --target-tracking-configuration file:///aws/tt.json\n$ aws autoscaling describe-policies --auto-scaling-group-name labflow-asg --query 'ScalingPolicies[].[PolicyName,PolicyType,TargetTrackingConfiguration.TargetValue]' --output text\ncpu-50\tTargetTrackingScaling\t50.0\n$ aws autoscaling set-desired-capacity --auto-scaling-group-name labflow-asg --desired-capacity 3\n$ aws autoscaling set-instance-health --instance-id i-1413ebd2e0beeec3d --health-status Unhealthy\n$ aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names labflow-asg --query 'AutoScalingGroups[0].Instances[].[InstanceId,AvailabilityZone,HealthStatus]' --output text\ni-1413ebd2e0beeec3d\tap-southeast-1a\tUnhealthy\ni-2ad1bc15e2afb7d99\tap-southeast-1a\tHealthy\ni-64c578c09c23b42b7\tap-southeast-1a\tHealthy");
const OUT_52_ASG_THAT = out("# ASG thu nhỏ: min=2 max=4, mục tiêu 15 request/giây mỗi máy (target tracking), máy app trễ 40 ms/yêu cầu.\n# Giây ~12: bắn tải 40 giây (ab -c 8). Giây ~108: làm hỏng /health của api-1.\n$ bash asg.sh\n02:20:46  rps=0   may=2 desired=2\n02:20:51  rps=0   may=2 desired=2\n02:20:56  rps=118 may=2 desired=4 +api-3(az-a) +api-4(az-b)\n02:21:02  rps=228 may=4 desired=4\n02:21:07  rps=196 may=4 desired=4\n02:21:12  rps=196 may=4 desired=4\n02:21:17  rps=198 may=4 desired=4\n02:21:22  rps=198 may=4 desired=4\n02:21:27  rps=198 may=4 desired=4\n02:21:32  rps=198 may=4 desired=4\n02:21:37  rps=38  may=4 desired=3 (thừa máy, chờ 1/3 vòng mới rút)\n02:21:42  rps=0   may=4 desired=2 (thừa máy, chờ 2/3 vòng mới rút)\n02:21:47  rps=0   may=4 desired=2 -api-3(az-a, drain 3s)\n02:21:55  rps=0   may=3 desired=2 (thừa máy, chờ 1/3 vòng mới rút)\n02:22:00  rps=0   may=3 desired=2 (thừa máy, chờ 2/3 vòng mới rút)\n02:22:05  rps=0   may=3 desired=2 -api-4(az-b, drain 3s)\n02:22:14  rps=0   may=2 desired=2\n02:22:19  rps=0   may=2 desired=2\n02:22:24  rps=0   may=2 desired=2\n02:22:29  rps=0   may=2 desired=2\n02:22:34  rps=0   may=2 desired=2 ✗api-1 hỏng health check ⇒ thay +api-5(az-a)\n02:22:39  rps=0   may=2 desired=2\n02:22:44  rps=0   may=2 desired=2\n02:22:49  rps=0   may=2 desired=2\n02:22:54  rps=0   may=2 desired=2\n02:22:59  rps=0   may=2 desired=2");
const OUT_53_DINH_ZONE = out("# LocalStack đã NHẬN CNAME ở đỉnh zone (Route 53 thật từ chối với InvalidChangeBatch). Sửa đúng cách: xoá CNAME, dùng bản ghi alias A ở đỉnh.\n$ aws route53 change-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --change-batch file:///aws/c6.json --query ChangeInfo.Status --output text\nINSYNC");
const OUT_53_DNS_API = out("$ aws route53 create-hosted-zone --name labflow.example --caller-reference lab53 --query 'DelegationSet.NameServers' --output text\n(hosted zone /hostedzone/TPR1V90LY3ED2126HFHAZI) ⇒ các máy chủ tên Route 53 cấp:\nns-2048.awsdns-64.com\tns-2049.awsdns-65.net\tns-2050.awsdns-66.org\tns-2051.awsdns-67.co.uk\n$ aws route53 change-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --change-batch file:///aws/c1.json --query ChangeInfo.Status --output text\nINSYNC\n$ aws route53 change-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --change-batch file:///aws/c2.json --query ChangeInfo.Status --output text\nINSYNC\n$ aws route53 create-health-check --caller-reference hc53 --health-check-config Type=HTTPS,FullyQualifiedDomainName=api.labflow.example,ResourcePath=/health,RequestInterval=30,FailureThreshold=3 --query 'HealthCheck.[Id,HealthCheckConfig.Type,HealthCheckConfig.ResourcePath]' --output text\ndc348253-e368-4abb-a7ed-73caec049a2f\tHTTPS\t/health\n$ aws route53 change-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --change-batch file:///aws/c3.json --query ChangeInfo.Status --output text\nINSYNC\n$ aws route53 list-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --query 'ResourceRecordSets[].[Name,Type,TTL||`-`,SetIdentifier||`-`,Weight||Failover||`-`]' --output text\nlabflow.example.\tCNAME\t300\t-\t-\nlabflow.example.\tNS\t172800\t-\t-\nlabflow.example.\tSOA\t900\t-\t-\napi.labflow.example.\tA\t-\t-\t-\napp.labflow.example.\tA\t60\tchinh\tPRIMARY\napp.labflow.example.\tA\t60\tdu-phong\tSECONDARY\ncanary.labflow.example.\tA\t5\tban-cu\t90\ncanary.labflow.example.\tA\t5\tban-moi\t10\ntai.labflow.example.\tA\t30\t-\t-\nwww.labflow.example.\tCNAME\t300\t-\t-\n# ── ACM: xin chứng chỉ, kiểm quyền sở hữu bằng bản ghi DNS\n$ aws acm request-certificate --domain-name api.labflow.example --subject-alternative-names www.labflow.example --validation-method DNS --query CertificateArn --output text\narn:aws:acm:ap-southeast-1:000000000000:certificate/e0d34b47-30c1-4500-8756-8af50d4c28b4\n$ aws acm describe-certificate --certificate-arn arn:aws:acm:ap-southeast-1:000000000000:certificate/e0d34b47-30c1-4500-8756-8af50d4c28b4 --query 'Certificate.DomainValidationOptions[0].ResourceRecord.[Name,Type,Value]' --output text\n_d930b28be6c5927595552b219965053e.www.labflow.example.\tCNAME\t_c9edd76ee4a0e2a74388032f3861cc50.ykybfrwcxw.acm-validations.aws.\n$ aws route53 change-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --change-batch file:///aws/c4.json --query ChangeInfo.Status --output text\nINSYNC\n$ aws acm describe-certificate --certificate-arn arn:aws:acm:ap-southeast-1:000000000000:certificate/e0d34b47-30c1-4500-8756-8af50d4c28b4 --query 'Certificate.[Status,Type,RenewalEligibility,KeyAlgorithm]' --output text\nPENDING_VALIDATION\tAMAZON_ISSUED\tINELIGIBLE\tRSA-2048");
const OUT_53_DNS_THAT_A = out("# CoreDNS 10.145.0.53 = máy chủ tên của zone (đúng các bản ghi vừa chép ra từ Route 53). CoreDNS 10.145.0.54 = resolver của nhà mạng (có cache).\n[khach]$ dig +noall +answer @10.145.0.53 labflow.example; dig +noall +answer @10.145.0.53 api.labflow.example\nlabflow.example.\t60\tIN\tA\t10.145.0.10\napi.labflow.example.\t60\tIN\tA\t10.145.0.10\n[khach]$ dig +noall +answer @10.145.0.53 www.labflow.example\nwww.labflow.example.\t300\tIN\tCNAME\tapi.labflow.example.\napi.labflow.example.\t60\tIN\tA\t10.145.0.10\n[khach]$ dig +noall +answer @10.145.0.53 app.labflow.example\napp.labflow.example.\t60\tIN\tA\t10.145.0.10\n[khach]$ dig @10.145.0.53 khong-co.labflow.example | grep -o \"status: [A-Z]*\"\nstatus: NXDOMAIN");
const OUT_53_DNS_THAT_B = out("# ── Weighted 90/10: hỏi 200 lần, đếm bản ghi đứng đầu câu trả lời\n[khach]$ for i in $(seq 200); do dig +short @10.145.0.53 canary.labflow.example | head -1; done | sort | uniq -c\n    173 10.145.1.11\n     27 10.145.1.12\n# ── TTL và 'DNS lan truyền': hỏi qua resolver có cache\n[khach]$ dig +noall +answer tai.labflow.example; sleep 5; dig +noall +answer tai.labflow.example\ntai.labflow.example.\t30\tIN\tA\t10.145.1.50\ntai.labflow.example.\t25\tIN\tA\t10.145.1.50\n$ aws route53 change-resource-record-sets --hosted-zone-id /hostedzone/TPR1V90LY3ED2126HFHAZI --change-batch file:///aws/c5.json --query ChangeInfo.Status --output text\nINSYNC\n[khach]$ dig +short @10.145.0.53 tai.labflow.example; dig +noall +answer tai.labflow.example\n10.145.1.51\ntai.labflow.example.\t21\tIN\tA\t10.145.1.50\n$ sleep 26\n[khach]$ dig +noall +answer tai.labflow.example\ntai.labflow.example.\t30\tIN\tA\t10.145.1.51");
const OUT_53_HTTPS_THAT = out("# 'ALB' 10.145.0.10 có hai listener: :80 chỉ chuyển hướng 301, :443 gắn chứng chỉ api.labflow.example (SAN: www).\n[khach]$ curl -sI http://api.labflow.example/api/phong | grep -iE \"^HTTP|^location\"\nHTTP/1.1 301 Moved Permanently\r\nlocation: https://api.labflow.example/api/phong\r\n[khach]$ curl -sS https://api.labflow.example/api/phong; echo \"mã thoát $?\"\ncurl: (60) SSL certificate OpenSSL verify result: unable to get local issuer certificate (20)\nMore details here: https://curl.se/docs/sslcerts.html\n\ncurl failed to verify the legitimacy of the server and therefore could not\nestablish a secure connection to it. To learn more about this situation and\nhow to fix it, please visit the webpage mentioned above.\nmã thoát 60\n[khach]$ curl -s --cacert /k/ca.pem https://api.labflow.example/api/phong\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n[khach]$ curl -s --cacert /k/ca.pem https://www.labflow.example/api/phong\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n[khach]$ curl -sS --cacert /k/ca.pem https://10.145.0.10/api/phong; echo \"mã thoát $?\"\ncurl: (60) SSL: no alternative certificate subject name matches target IPv4 address '10.145.0.10'\nMore details here: https://curl.se/docs/sslcerts.html\n\ncurl failed to verify the legitimacy of the server and therefore could not\nestablish a secure connection to it. To learn more about this situation and\nhow to fix it, please visit the webpage mentioned above.\nmã thoát 60\n[khach]$ curl -sv --cacert /k/ca.pem https://api.labflow.example/ -o /dev/null 2>&1 | grep -E \"SSL connection|subject:|issuer:|expire date|subjectAltName\"\n* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519MLKEM768 / RSASSA-PSS\n*   subject: CN=api.labflow.example\n*   expire date: Dec  2 19:29:59 2026 GMT\n*   issuer: CN=LabFlow Lab CA\n*   subjectAltName: \"api.labflow.example\" matches cert's \"api.labflow.example\"\n[khach]$ curl -sI --cacert /k/ca.pem https://api.labflow.example/api/phong | grep -i strict\nstrict-transport-security: max-age=31536000\r");
const OUT_54_CDN_API = out("$ aws s3api create-bucket --bucket labflow-static-demo --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\n/labflow-static-demo\n$ aws cloudfront create-origin-access-control --origin-access-control-config file:///aws/oac.json --query 'OriginAccessControl.[Id,OriginAccessControlConfig.SigningProtocol]' --output text\nG9PGC97NR1ZZF\tsigv4\n$ aws cloudfront create-distribution --distribution-config file:///aws/dist.json --query 'Distribution.[Id,DomainName,Status]' --output text\nV1QO9Y95X15IL\ta61pi13utlv94.cloudfront.net\tInProgress\n$ aws s3api put-bucket-policy --bucket labflow-static-demo --policy file:///aws/pol.json\n$ aws s3api get-bucket-policy --bucket labflow-static-demo --query Policy --output text\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"ChiCloudFront\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"cloudfront.amazonaws.com\"},\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::labflow-static-demo/*\",\"Condition\":{\"StringEquals\":{\"AWS:SourceArn\":\"arn:aws:cloudfront::123456789012:distribution/V1QO9Y95X15IL\"}}}]}\n$ aws cloudfront create-invalidation --distribution-id V1QO9Y95X15IL --paths '/static/*' --query 'Invalidation.[Id,Status,InvalidationBatch.Paths.Items[0]]' --output text\nVDUZBPWNM1P3E\tCOMPLETED\t/static/*");
const OUT_54_CDN_THAT_A = out("# edge (nginx proxy_cache) 10.145.0.20 ⇒ origin (node, trễ 300 ms, Cache-Control: public, max-age=10, stale-if-error=60) 10.145.3.10\n[khach]$ for i in 1 2 3; do curl -s -o /dev/null -D - -w '%{http_code} %{time_total}s\\n' edge/static/app.css | grep -iE '^x-cache|^cache-control|s$'; done\ncache-control: public, max-age=10, stale-if-error=60\r\nX-Cache: MISS from edge\r\n200 0.307550s\ncache-control: public, max-age=10, stale-if-error=60\r\nX-Cache: HIT from edge\r\n200 0.000891s\ncache-control: public, max-age=10, stale-if-error=60\r\nX-Cache: HIT from edge\r\n200 0.000926s\n# ── origin chỉ nhận đúng 1 yêu cầu cho 3 lượt tải trên:\n$ docker logs aws-c5-origin\norigin GET /static/app.css #1\n# ── Hỏi thẳng origin (bỏ qua CDN) ⇒ thiếu header bí mật\n[khach]$ curl -s -w '%{http_code} %{time_total}s\\n' http://10.145.3.10:3000/static/app.css\n403 chi nhan qua CDN\n403 0.000734s");
const OUT_54_CDN_THAT_B = out("# ── Khoá cache bỏ query string: ?v=2 vẫn lấy bản cũ trong cache\n[khach]$ curl -s -D - edge/static/app.css?v=2 | grep -iE '^x-cache|ban'\nX-Cache: HIT from edge\r\n/* /static/app.css ban 1 tu origin */\n# ── Hết max-age=10 ⇒ edge hỏi lại origin\n$ sleep 11\n[khach]$ curl -s -o /dev/null -D - -w '%{http_code} %{time_total}s\\n' edge/static/app.css | grep -iE '^x-cache|s$'\nX-Cache: EXPIRED from edge\r\n200 0.303218s\n# ── Đường /api/ không cache: lần nào cũng chạm origin\n[khach]$ for i in 1 2; do curl -s -o /dev/null -D - -w '%{http_code} %{time_total}s\\n' edge/api/phong | grep -iE '^x-cache|s$'; done\nX-Cache: Miss from edge (khong cache)\r\n200 0.302655s\nX-Cache: Miss from edge (khong cache)\r\n200 0.301406s");
const OUT_54_CDN_THAT_C = out("# ── Ra bản mới mà không chờ TTL: 'invalidation' (ở đây xoá thư mục cache của nginx) so với đổi tên tệp\n$ (origin đã lên bản 2)\n[khach]$ curl -s edge/static/app.css\n/* /static/app.css ban 1 tu origin */\n$ docker exec aws-c5-edge sh -c 'rm -rf /cache/*'   # vai trò create-invalidation --paths '/static/*'\n[khach]$ curl -s edge/static/app.css\n/* /static/app.css ban 2 tu origin */\n[khach]$ curl -s edge/static/app.v2.css\n/* /static/app.v2.css ban 2 tu origin */\n# ── Origin sập: bản trong cache đã hết hạn nhưng còn trong cửa sổ stale-if-error=60 ⇒ vẫn phục vụ\n[khach]$ curl -s -o /dev/null edge/static/logo.css; curl -s -o /dev/null edge/static/logo.css\n$ docker stop aws-c5-origin; sleep 11\n[khach]$ curl -s -D - edge/static/logo.css | grep -iE '^HTTP|^x-cache|ban'\nHTTP/1.1 200 OK\r\nX-Cache: STALE from edge\r\n/* /static/logo.css ban 2 tu origin */\n[khach]$ curl -s -D - edge/static/chua-tung-tai.css | grep -iE '^HTTP|^x-cache'\nHTTP/1.1 502 Bad Gateway\r\nX-Cache: MISS from edge\r\n$ docker logs aws-c5-edge | tail -4\n10.145.0.100 \"GET /static/logo.css HTTP/1.1\" 200 cache=MISS\n10.145.0.100 \"GET /static/logo.css HTTP/1.1\" 200 cache=HIT\n10.145.0.100 \"GET /static/logo.css HTTP/1.1\" 200 cache=STALE\n10.145.0.100 \"GET /static/chua-tung-tai.css HTTP/1.1\" 502 cache=MISS");
const OUT_55_WAF_API = out("$ aws wafv2 create-ip-set --name ip-chan --scope REGIONAL --ip-address-version IPV4 --addresses 198.51.100.7/32 --query 'Summary.[Name,Id]' --output text\nip-chan\td3a6d9a1-9db3-4d3d-9a87-b69ea06816c0\n$ aws wafv2 create-web-acl --name labflow-acl --scope REGIONAL --default-action 'Allow={}' --rules file:///aws/rules.json --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=labflow-acl --query 'Summary.[Name,Id]' --output text\nlabflow-acl\t8d1347f1-4dbb-4e7e-8f3f-d9d4793151cf\n$ aws wafv2 get-web-acl --name labflow-acl --scope REGIONAL --id 8d1347f1-4dbb-4e7e-8f3f-d9d4793151cf --query 'WebACL.Rules[].[Priority,Name,keys(Action||OverrideAction)[0]]' --output text\n0\tchan-ip\tBlock\n1\taws-common\tCount\n2\taws-sqli\tNone\n3\tgioi-han-ip\tBlock\n$ aws wafv2 associate-web-acl --web-acl-arn arn:aws:wafv2:ap-southeast-1:123456789012:regional/webacl/labflow-acl/8d1347f1-4dbb-4e7e-8f3f-d9d4793151cf --resource-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:loadbalancer/app/labflow-alb/97d5f2e491fb90fe\n$ aws wafv2 get-web-acl-for-resource --resource-arn arn:aws:elasticloadbalancing:ap-southeast-1:123456789012:loadbalancer/app/labflow-alb/97d5f2e491fb90fe --query WebACL.Name --output text\nlabflow-acl\n$ aws shield describe-subscription\nAn error occurred (ResourceNotFoundException) when calling the DescribeSubscription operation: The subscription does not exist.");
const OUT_55_WAF_THAT_A = out("# ── Bước 1: CHẾ ĐỘ COUNT (chỉ đếm) — mọi thứ vẫn qua, log ghi luật nào khớp\n[ke-tan-cong]$ curl -s -o /dev/null -w \"%{http_code} \" \"alb/api/phong?id=1%27%20OR%201=1--\"; curl -s -o /dev/null -w \"%{http_code} \" -A sqlmap/1.8 alb/api/phong; for i in $(seq 60); do curl -s -o /dev/null -w \"%{http_code}\\n\" alb/api/phong; done | sort | uniq -c\n200 200      60 200\n$ docker logs aws-c5-alb | awk '{print $NF}' | sort | uniq -c\n     18 luat=-\n     42 luat=rate-based\n      1 luat=sqli\n      1 luat=ua-xau");
const OUT_55_WAF_THAT_B = out("# ── Bước 2: CHẾ ĐỘ BLOCK\n[ke-tan-cong]$ curl -s -o /dev/null -w \"%{http_code} \" \"alb/api/phong?id=1%27%20OR%201=1--\"; curl -s -o /dev/null -w \"%{http_code} \" -A sqlmap/1.8 alb/api/phong; for i in $(seq 60); do curl -s -o /dev/null -w \"%{http_code}\\n\" alb/api/phong; done | sort | uniq -c\n403 403      18 200\n     42 429\n# Cùng lúc đó, người dùng thật ở IP khác vẫn vào bình thường:\n[khach]$ curl -s -w \" %{http_code}\\n\" alb/api/phong\n{\"may\":\"api-1\",\"az\":\"az-a\",\"vai\":\"api\",\"duong\":\"/api/phong\",\"xff\":\"10.145.0.100\"}\n 200\n[khach]$ curl -s -o /dev/null -w \"%{http_code}\\n\" \"alb/api/tim?q=O%27Brien\"\n200\n$ docker logs aws-c5-alb | grep -v 'luat=-' | awk '{print $1, $4, $NF}' | sort | uniq -c\n      1 10.145.6.66 403 luat=sqli\n      1 10.145.6.66 403 luat=ua-xau\n     42 10.145.6.66 429 luat=rate-based");
const OUT_55_WAF_THAT_C = out("# ── Hạn chế của rate-based theo IP: kẻ tấn công đổi IP (botnet) — giả lập 5 IP, mỗi IP 15 yêu cầu\n[5 bot]$ for i in $(seq 15); do curl -s -o /dev/null -w '%{http_code}\\n' alb/api/phong; done   # chạy trên cả 5 máy\n     75 200");
const OUT_56_DON1 = out("$ bash don.sh\nđã xoá ASG (kèm máy)\nđã xoá ALB\nđã xoá target group\nđã xoá launch template\nđã xoá labflow-app-sg\nđã xoá labflow-alb-sg\n$ bash con-gi.sh\nALB:          0\nTarget group: 0\nASG:          0\nMáy đang chạy: 0\nWeb ACL:      0\nChứng chỉ ACM: 0 (chứng chỉ công khai miễn phí, nhưng nên dọn)");
const OUT_56_GIAI = out("$ bash giai.sh\nlời giải đã dựng\n$ bash cham.sh\n✓ 1 ALB internet-facing trải ≥ 2 AZ\n✓ 2 Listener 443 HTTPS có chứng chỉ\n✓ 3 Listener 80 chỉ chuyển hướng 301 sang HTTPS\n✓ 4 Target group kiểm /health, đòi mã 200\n✓ 5 ASG min ≥ 2, 2 subnet/AZ, health check ELB, gắn target group\n✓ 6 Có chính sách target tracking\n✓ 7 Máy app chỉ nhận cổng 3000 từ SG của ALB\n✓ 8 WAF gắn vào ALB, có luật rate-based (300/5 phút)\nĐIỂM: 8/8\n$ bash don.sh\nđã xoá web ACL\nđã xoá ASG (kèm máy)\nđã xoá ALB\nđã xoá target group\nđã xoá launch template\nđã xoá labflow-app-sg\nđã xoá labflow-alb-sg\nđã xoá chứng chỉ\n$ bash con-gi.sh\nALB:          0\nTarget group: 0\nASG:          0\nMáy đang chạy: 0\nWeb ACL:      0\nChứng chỉ ACM: 0 (chứng chỉ công khai miễn phí, nhưng nên dọn)");
const OUT_56_TRUOC = out("$ bash truoc.sh\nbản vội đã dựng\n$ bash cham.sh\n✓ 1 ALB internet-facing trải ≥ 2 AZ\n✗ 2 Thiếu listener 443 HTTPS gắn chứng chỉ ACM\n✗ 3 Listener 80 còn phục vụ HTTP thường (cần redirect 301)\n✗ 4 Health check đang là '/\t200' — cần /health + 200\n✗ 5 ASG: min=1 health=EC2 subnet=1 tg=1\n✗ 6 ASG chưa có chính sách co giãn\n✗ 7 SG máy app mở 3000 cho dải IP (cần chỉ từ SG của ALB)\n✗ 8 ALB chưa có web ACL với luật rate-based\nĐIỂM: 1/8");
const MA_ALB = bash("# \"ALB\" bằng HAProxy 3.0: listener :80, luật path/host, 3 target group, health check như ALB (đường /health, 2 lần hỏng ⇒ unhealthy)\nglobal\n  log stdout format raw local0\ndefaults\n  mode http\n  log global\n  option forwardfor\n  timeout connect 2s\n  timeout client 10s\n  timeout server 10s\nresolvers docker\n  nameserver dns 127.0.0.11:53\n  hold valid 1s\nfrontend listener-80\n  bind :80\n  acl host_admin hdr(host) -i admin.labflow.example\n  acl duong_api  path_beg /api/\n  use_backend tg-admin if host_admin\n  use_backend tg-api   if duong_api\n  default_backend tg-web\nbackend tg-api\n  balance roundrobin\n  option httpchk GET /health\n  http-check expect status 200\n  default-server inter 1s fall 2 rise 2\n  server api-1 aws-c5-api-1:3000 check resolvers docker init-addr none\n  server api-2 aws-c5-api-2:3000 check resolvers docker init-addr none\nbackend tg-web\n  balance roundrobin\n  option httpchk GET /health\n  default-server inter 1s fall 2 rise 2\n  server web-1 aws-c5-web-1:3000 check resolvers docker init-addr none\nbackend tg-admin\n  option httpchk GET /health\n  server admin-1 aws-c5-admin-1:3000 check resolvers docker init-addr none\nlisten stats\n  bind :8404\n  stats enable\n  stats uri /stats\n  stats show-legends");
const MA_ASG = bash("# \"Auto Scaling group\" thu nhỏ — chạy THẬT trên Docker (agent aws, Ch.5). Mỗi 5 giây:\n#   1) đo request/giây vào tg-api (bộ đếm stot của HAProxy) ⇒ desired = ceil(rps / MUC_TIEU), kẹp [MIN, MAX]  (target tracking)\n#   2) máy hỏng health check 2 lần liền ⇒ thay máy mới (HealthCheckType=ELB)\n#   3) thiếu máy ⇒ chạy thêm container vào AZ đang ít máy hơn; thừa ⇒ rút khỏi AZ đông nhất, rút \"drain\" 3 giây trước (deregistration delay)\n# HAProxy tự thấy máy mới qua DNS của Docker (alias app-api) — giống ASG tự đăng ký máy vào target group.\nsource ~/vbg-dp/scratchpad/aws/lab/c5/nen.sh\nMIN=${MIN:-2}; MAX=${MAX:-4}; MUC_TIEU=${MUC_TIEU:-15}; VONG=${VONG:-24}; NGHI_THU=${NGHI_THU:-3}\nso=0; truoc=$(curl -s \"127.0.0.1:43804/stats;csv\" | awk -F, '$1==\"tg-api\" && $2==\"BACKEND\"{print $8}'); thua=0\nmay() { docker ps -q --filter name=aws-c5-api- --filter label=asg=labflow; }\ndem_az() { docker ps --filter label=asg=labflow --filter label=az=$1 -q | wc -l; }\nthem() { local az=az-a; [ $(dem_az az-a) -gt $(dem_az az-b) ] && az=az-b; so=$((so+1)); while docker ps -a --format '{{.Names}}' | grep -qx aws-c5-api-$so; do so=$((so+1)); done\n  app api-$so $az app-api \"\" --label asg=labflow -e DELAY=40; echo -n \" +api-$so($az)\"; }\nrut() { local az=az-a; [ $(dem_az az-b) -gt $(dem_az az-a) ] && az=az-b; local c=$(docker ps --filter label=asg=labflow --filter label=az=$az --format '{{.Names}}' | sort -V | tail -1)\n  docker exec $c touch /tmp/hong; sleep 3; docker rm -f $c >/dev/null; echo -n \" -${c#aws-c5-}($az, drain 3s)\"; }\nfor v in $(seq 1 $VONG); do\n  sleep 5\n  csv=$(curl -s \"127.0.0.1:43804/stats;csv\")\n  nay=$(echo \"$csv\" | awk -F, '$1==\"tg-api\" && $2==\"BACKEND\"{print $8}'); rps=$(( (nay-truoc)/5 )); truoc=$nay\n  hong=$(echo \"$csv\" | awk -F, 'NR==1{for(i=1;i<=NF;i++)h[$i]=i;next} $1==\"tg-api\" && $2!=\"BACKEND\" && $(h[\"status\"])==\"DOWN\"{print $(h[\"addr\"])}' | cut -d: -f1)\n  n=$(may | wc -l); d=$(( (rps + MUC_TIEU - 1) / MUC_TIEU )); [ $d -lt $MIN ] && d=$MIN; [ $d -gt $MAX ] && d=$MAX\n  printf '%s  rps=%-3s may=%s desired=%s' \"$(date +%T)\" $rps $n $d\n  for ip in $hong; do c=$(docker ps --filter label=asg=labflow --format '{{.Names}}' | while read x; do [ \"$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $x)\" = \"$ip\" ] && echo $x; done)\n    [ -n \"$c\" ] && { docker rm -f $c >/dev/null; echo -n \" ✗${c#aws-c5-} hỏng health check ⇒ thay\"; n=$((n-1)); }; done\n  if [ $n -lt $d ]; then thua=0; while [ $n -lt $d ]; do them; n=$((n+1)); done\n  elif [ $n -gt $d ]; then thua=$((thua+1)); if [ $thua -ge $NGHI_THU ]; then rut; thua=0; else echo -n \" (thừa máy, chờ $thua/$NGHI_THU vòng mới rút)\"; fi\n  else thua=0; fi\n  echo\ndone");
const MA_EDGE = bash("# \"Edge location\" của CDN = nginx 1.27 có proxy_cache, đứng trước origin (app node trễ 300 ms, như origin ở Singapore nhìn từ xa).\n# Khoá cache = $uri (bỏ query string) — giống chính sách CachingOptimized mặc định của CloudFront.\nproxy_cache_path /cache levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m use_temp_path=off;\nlog_format cdn '$remote_addr \"$request\" $status cache=$upstream_cache_status';\nserver {\n  listen 80;\n  access_log /dev/stdout cdn;\n  location /api/ {\n    proxy_pass http://aws-c5-origin:3000;\n    proxy_set_header X-Origin-Verify \"bi-mat-chi-cdn-biet\";\n    proxy_cache off;\n    add_header X-Cache \"Miss from edge (khong cache)\" always;\n  }\n  location / {\n    proxy_pass http://aws-c5-origin:3000;\n    proxy_set_header X-Origin-Verify \"bi-mat-chi-cdn-biet\";\n    proxy_cache edge;\n    proxy_cache_key $uri;\n    proxy_cache_use_stale error timeout http_500 http_502 http_503;\n    proxy_cache_lock on;\n    add_header X-Cache \"$upstream_cache_status from edge\" always;\n  }\n}");
const MA_WAF = bash("# \"AWS WAF\" thu nhỏ bằng HAProxy 3.0 đặt ở listener của ALB. Bốn luật như một web ACL:\n#   1 ip-chan (IP set) · 2 sqli (chuỗi tấn công SQL trong query) · 3 ua-xau (công cụ quét) · 4 rate-based: > 20 yêu cầu / 10 s mỗi IP\n# CHE_DO=count ⇒ chỉ ghi log (Count) · CHE_DO=block ⇒ chặn (Block: 403; luật rate trả 429 = \"custom response\")\nglobal\n  log stdout format raw local0\ndefaults\n  mode http\n  log global\n  option forwardfor\n  timeout connect 2s\n  timeout client 10s\n  timeout server 10s\nresolvers docker\n  nameserver dns 127.0.0.11:53\nfrontend listener-80\n  bind :80\n  log-format \"%ci %HM %HU %ST luat=%[var(txn.luat)]\"\n  stick-table type ip size 100k expire 30s store http_req_rate(10s)\n  http-request track-sc0 src\n  acl ip_chan src -f /cfg/ip-chan.txt\n  acl sqli    query -m reg -i \"(union(%20|\\+)+select|%27(%20|\\+)*or(%20|\\+)*%271?%27?(%20|\\+)*=|%27(%20|\\+)*or(%20|\\+)+1=1|;(%20)*drop(%20|\\+)+table)\"\n  acl ua_xau  req.hdr(user-agent) -m sub -i sqlmap nikto masscan\n  acl qua_toc sc_http_req_rate(0) gt 20\n  http-request set-var(txn.luat) str(-)\n  http-request set-var(txn.luat) str(ip-chan) if ip_chan\n  http-request set-var(txn.luat) str(sqli) if sqli\n  http-request set-var(txn.luat) str(ua-xau) if ua_xau\n  http-request set-var(txn.luat) str(rate-based) if qua_toc\n  http-request deny deny_status 403 if ip_chan  { env(CHE_DO) -m str block }\n  http-request deny deny_status 403 if sqli     { env(CHE_DO) -m str block }\n  http-request deny deny_status 403 if ua_xau   { env(CHE_DO) -m str block }\n  http-request deny deny_status 429 if qua_toc  { env(CHE_DO) -m str block }\n  default_backend tg-api\nbackend tg-api\n  server api-1 aws-c5-api-1:3000 resolvers docker init-addr none");
const MA_CHAM = bash("# Bộ chấm lab Chương 5 — 8 phép kiểm trên cấu hình (chạy được với AWS thật: bỏ --endpoint-url trong awsm)\nsource ~/vbg-dp/scratchpad/aws/lab/c5/chung5.sh\nd=0; ok() { echo \"✓ $1\"; d=$((d+1)); }; ko() { echo \"✗ $1\"; }\nLB=$(m elbv2 describe-load-balancers --names labflow-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text)\n[ \"$(m elbv2 describe-load-balancers --names labflow-alb --query 'LoadBalancers[0].Scheme' --output text)\" = internet-facing ] && [ \"$(m elbv2 describe-load-balancers --names labflow-alb --query 'length(LoadBalancers[0].AvailabilityZones)' --output text)\" -ge 2 ] \\\n  && ok \"1 ALB internet-facing trải ≥ 2 AZ\" || ko \"1 ALB phải internet-facing và ở ≥ 2 AZ\"\nL443=$(m elbv2 describe-listeners --load-balancer-arn $LB --query 'Listeners[?Port==`443`].[Protocol,length(Certificates)]' --output text)\n[ \"$L443\" = \"HTTPS\t1\" ] && ok \"2 Listener 443 HTTPS có chứng chỉ\" || ko \"2 Thiếu listener 443 HTTPS gắn chứng chỉ ACM\"\nR80=$(m elbv2 describe-listeners --load-balancer-arn $LB --query 'Listeners[?Port==`80`].DefaultActions[0].[Type,RedirectConfig.Protocol,RedirectConfig.StatusCode]' --output text)\n[ \"$R80\" = \"redirect\tHTTPS\tHTTP_301\" ] && ok \"3 Listener 80 chỉ chuyển hướng 301 sang HTTPS\" || ko \"3 Listener 80 còn phục vụ HTTP thường (cần redirect 301)\"\nTG=$(m elbv2 describe-target-groups --names tg-api --query 'TargetGroups[0].[HealthCheckPath,Matcher.HttpCode]' --output text)\n[ \"$TG\" = \"/health\t200\" ] && ok \"4 Target group kiểm /health, đòi mã 200\" || ko \"4 Health check đang là '$TG' — cần /health + 200\"\nA=$(m autoscaling describe-auto-scaling-groups --auto-scaling-group-names labflow-asg --query 'AutoScalingGroups[0].[MinSize,HealthCheckType,VPCZoneIdentifier,length(TargetGroupARNs)]' --output text)\nread mn hc vz ntg <<<\"$A\"; nz=$(echo \"$vz\" | tr ',' '\\n' | grep -c subnet)\n[ \"${mn:-0}\" -ge 2 ] && [ \"$hc\" = ELB ] && [ $nz -ge 2 ] && [ \"${ntg:-0}\" -ge 1 ] && ok \"5 ASG min ≥ 2, 2 subnet/AZ, health check ELB, gắn target group\" || ko \"5 ASG: min=$mn health=$hc subnet=$nz tg=$ntg\"\n[ \"$(m autoscaling describe-policies --auto-scaling-group-name labflow-asg --query 'length(ScalingPolicies[?PolicyType==`TargetTrackingScaling`])' --output text)\" -ge 1 ] 2>/dev/null \\\n  && ok \"6 Có chính sách target tracking\" || ko \"6 ASG chưa có chính sách co giãn\"\nSA=$(m ec2 describe-security-groups --filters Name=group-name,Values=labflow-alb-sg --query 'SecurityGroups[0].GroupId' --output text)\nP=$(m ec2 describe-security-groups --filters Name=group-name,Values=labflow-app-sg --query 'SecurityGroups[0].IpPermissions[?ToPort==`3000`].[length(IpRanges),UserIdGroupPairs[0].GroupId]' --output text)\n[ \"$P\" = \"0\t$SA\" ] && ok \"7 Máy app chỉ nhận cổng 3000 từ SG của ALB\" || ko \"7 SG máy app mở 3000 cho dải IP (cần chỉ từ SG của ALB)\"\nW=$(m wafv2 get-web-acl-for-resource --resource-arn $LB --query 'WebACL.Rules[].Statement.RateBasedStatement.Limit' --output text)\n[ -n \"$W\" ] && [ \"$W\" != None ] && ok \"8 WAF gắn vào ALB, có luật rate-based ($W/5 phút)\" || ko \"8 ALB chưa có web ACL với luật rate-based\"\necho \"ĐIỂM: $d/8\"");
const MA_TRUOC = bash("# Bản \"làm vội\" — chạy được, nhưng sai gần hết những gì production cần\nsource ~/vbg-dp/scratchpad/aws/lab/c5/lab5/tao-mang.sh\nSGA=$(m ec2 create-security-group --group-name labflow-alb-sg --description alb --vpc-id $VPC --query GroupId --output text)\nm ec2 authorize-security-group-ingress --group-id $SGA --protocol tcp --port 80 --cidr 0.0.0.0/0 >/dev/null\nSGP=$(m ec2 create-security-group --group-name labflow-app-sg --description app --vpc-id $VPC --query GroupId --output text)\nm ec2 authorize-security-group-ingress --group-id $SGP --protocol tcp --port 3000 --cidr 0.0.0.0/0 >/dev/null\nLB=$(m elbv2 create-load-balancer --name labflow-alb --scheme internet-facing --subnets $SA $SB --security-groups $SGA --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nTG=$(m elbv2 create-target-group --name tg-api --protocol HTTP --port 3000 --vpc-id $VPC --query 'TargetGroups[0].TargetGroupArn' --output text)\nm elbv2 create-listener --load-balancer-arn $LB --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG >/dev/null\nm ec2 create-launch-template --launch-template-name labflow-api --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI\\\",\\\"InstanceType\\\":\\\"t4g.small\\\",\\\"SecurityGroupIds\\\":[\\\"$SGP\\\"]}\" >/dev/null\nm autoscaling create-auto-scaling-group --auto-scaling-group-name labflow-asg --launch-template LaunchTemplateName=labflow-api --min-size 1 --max-size 1 --vpc-zone-identifier $SA --target-group-arns $TG\necho \"bản vội đã dựng\"");
const MA_GIAI = bash("# LỜI GIẢI — dựng lại đúng từ đầu (chạy sau don.sh)\nsource ~/vbg-dp/scratchpad/aws/lab/c5/lab5/tao-mang.sh\nSGA=$(m ec2 create-security-group --group-name labflow-alb-sg --description 'ALB: 80/443 tu Internet' --vpc-id $VPC --query GroupId --output text)\nfor p in 80 443; do m ec2 authorize-security-group-ingress --group-id $SGA --protocol tcp --port $p --cidr 0.0.0.0/0 >/dev/null; done\nSGP=$(m ec2 create-security-group --group-name labflow-app-sg --description 'App: 3000 chi tu ALB' --vpc-id $VPC --query GroupId --output text)\nm ec2 authorize-security-group-ingress --group-id $SGP --protocol tcp --port 3000 --source-group $SGA >/dev/null\nCERT=$(m acm request-certificate --domain-name api.labflow.example --validation-method DNS --query CertificateArn --output text)\nLB=$(m elbv2 create-load-balancer --name labflow-alb --scheme internet-facing --subnets $SA $SB --security-groups $SGA --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nTG=$(m elbv2 create-target-group --name tg-api --protocol HTTP --port 3000 --vpc-id $VPC --health-check-path /health --matcher HttpCode=200 --healthy-threshold-count 2 --unhealthy-threshold-count 2 --query 'TargetGroups[0].TargetGroupArn' --output text)\nm elbv2 create-listener --load-balancer-arn $LB --protocol HTTPS --port 443 --certificates CertificateArn=$CERT --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 --default-actions Type=forward,TargetGroupArn=$TG >/dev/null\nm elbv2 create-listener --load-balancer-arn $LB --protocol HTTP --port 80 --default-actions 'Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}' >/dev/null\nm ec2 create-launch-template --launch-template-name labflow-api --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI\\\",\\\"InstanceType\\\":\\\"t4g.small\\\",\\\"SecurityGroupIds\\\":[\\\"$SGP\\\"],\\\"MetadataOptions\\\":{\\\"HttpTokens\\\":\\\"required\\\"}}\" >/dev/null\nm autoscaling create-auto-scaling-group --auto-scaling-group-name labflow-asg --launch-template LaunchTemplateName=labflow-api --min-size 2 --max-size 4 --desired-capacity 2 \\\n  --vpc-zone-identifier \"$SA,$SB\" --target-group-arns $TG --health-check-type ELB --health-check-grace-period 120\nm autoscaling put-scaling-policy --auto-scaling-group-name labflow-asg --policy-name req-per-target --policy-type TargetTrackingScaling \\\n  --target-tracking-configuration '{\"PredefinedMetricSpecification\":{\"PredefinedMetricType\":\"ASGAverageCPUUtilization\"},\"TargetValue\":50}' >/dev/null\nACL=$(m wafv2 create-web-acl --name labflow-acl --scope REGIONAL --default-action Allow={} --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=labflow-acl \\\n  --rules '[{\"Name\":\"gioi-han-ip\",\"Priority\":0,\"Statement\":{\"RateBasedStatement\":{\"Limit\":300,\"AggregateKeyType\":\"IP\"}},\"Action\":{\"Block\":{}},\"VisibilityConfig\":{\"SampledRequestsEnabled\":true,\"CloudWatchMetricsEnabled\":true,\"MetricName\":\"gioi-han-ip\"}}]' --query Summary.ARN --output text)\nm wafv2 associate-web-acl --web-acl-arn $ACL --resource-arn $LB\necho \"lời giải đã dựng\"");
const MA_DON = bash("# Dọn theo thứ tự phụ thuộc: WAF → ASG (kéo theo máy) → listener → ALB → target group → launch template → SG → chứng chỉ\nsource ~/vbg-dp/scratchpad/aws/lab/c5/chung5.sh\nLB=$(m elbv2 describe-load-balancers --names labflow-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nID=$(m wafv2 list-web-acls --scope REGIONAL --query 'WebACLs[?Name==`labflow-acl`].Id' --output text)\nif [ -n \"$ID\" ]; then m wafv2 disassociate-web-acl --resource-arn $LB; TK=$(m wafv2 get-web-acl --name labflow-acl --scope REGIONAL --id $ID --query LockToken --output text)\n  m wafv2 delete-web-acl --name labflow-acl --scope REGIONAL --id $ID --lock-token $TK; echo \"đã xoá web ACL\"; fi\nm autoscaling delete-auto-scaling-group --auto-scaling-group-name labflow-asg --force-delete && echo \"đã xoá ASG (kèm máy)\"\nfor l in $(m elbv2 describe-listeners --load-balancer-arn $LB --query 'Listeners[].ListenerArn' --output text); do m elbv2 delete-listener --listener-arn $l; done\nm elbv2 delete-load-balancer --load-balancer-arn $LB && echo \"đã xoá ALB\"\nm elbv2 delete-target-group --target-group-arn $(m elbv2 describe-target-groups --names tg-api --query 'TargetGroups[0].TargetGroupArn' --output text) && echo \"đã xoá target group\"\nm ec2 delete-launch-template --launch-template-name labflow-api >/dev/null && echo \"đã xoá launch template\"\nfor g in labflow-app-sg labflow-alb-sg; do m ec2 delete-security-group --group-id $(m ec2 describe-security-groups --filters Name=group-name,Values=$g --query 'SecurityGroups[0].GroupId' --output text) && echo \"đã xoá $g\"; done\nfor c in $(m acm list-certificates --query 'CertificateSummaryList[].CertificateArn' --output text); do m acm delete-certificate --certificate-arn $c && echo \"đã xoá chứng chỉ\"; done");
const MA_CONGI = bash("# Còn gì đang tính tiền? (Chương 5) — ALB tính theo giờ dù không ai gọi; web ACL tính theo tháng; máy của ASG tính theo giây\nsource ~/vbg-dp/scratchpad/aws/lab/c5/chung5.sh\necho \"ALB:          $(m elbv2 describe-load-balancers --query 'length(LoadBalancers)' --output text)\"\necho \"Target group: $(m elbv2 describe-target-groups --query 'length(TargetGroups)' --output text)\"\necho \"ASG:          $(m autoscaling describe-auto-scaling-groups --query 'length(AutoScalingGroups)' --output text)\"\necho \"Máy đang chạy: $(m ec2 describe-instances --filters Name=instance-state-name,Values=pending,running --query 'length(Reservations[].Instances[])' --output text)\"\necho \"Web ACL:      $(m wafv2 list-web-acls --scope REGIONAL --query 'length(WebACLs)' --output text)\"\necho \"Chứng chỉ ACM: $(m acm list-certificates --query 'length(CertificateSummaryList)' --output text) (chứng chỉ công khai miễn phí, nhưng nên dọn)\"");
/* ═════ 5.1 — Application Load Balancer ═════ */
const L51_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 1</span>
<h2>5.1 — Application Load Balancer: the receptionist in front of your servers</h2>
<p class="lead">Until now every request went straight to one EC2 machine. That machine is a single point of failure: patch it, crash it or lose its AZ and the API is gone. An <strong>Application Load Balancer (ALB)</strong> is a managed reverse proxy that sits in front of many machines, spreads requests across them, routes by path or host name, checks their health every few seconds and stops sending traffic to the sick ones. If you have written an Nginx <code>upstream</code> block, you already know the idea — this lesson maps every Nginx habit to its ALB name, then runs real traffic through a load balancer you can break on purpose.</p>

<h3>The picture: a clinic reception desk</h3>
<p>Patients (requests) never walk into a doctor's room directly. They stop at <strong>reception</strong> (the ALB). Reception has a door for each kind of visit — the <strong>listener</strong> on port 80 or 443. A board of <strong>rules</strong> says “X-ray → floor 2, dentist → floor 3” (path and host routing). Each floor has a list of doctors on duty — the <strong>target group</strong>. Every few minutes a nurse knocks on each door to ask “are you OK?” — the <strong>health check</strong>. A doctor who does not answer twice is taken off the list; patients are sent to the others. When every doctor on a floor is sick, reception says “sorry, come back later” — HTTP <strong>503</strong>.</p>

<h3>Four building blocks</h3>
<table>
  <thead><tr><th>ALB piece</th><th>What it is</th><th>Nginx equivalent</th></tr></thead>
  <tbody>
    <tr><td><strong>Load balancer</strong></td><td>The managed proxy itself; lives in at least two public subnets in two AZs; gets a DNS name, never a fixed IP</td><td>The Nginx process on your VPS</td></tr>
    <tr><td><strong>Listener</strong></td><td>Protocol + port it accepts (HTTP:80, HTTPS:443) and a default action</td><td><code>server { listen 443 ssl; }</code></td></tr>
    <tr><td><strong>Rule</strong></td><td>Condition (path, host, header, method, query, source IP) → action (forward, redirect, fixed response), evaluated by priority</td><td><code>location /api/ { … }</code>, <code>server_name</code></td></tr>
    <tr><td><strong>Target group</strong></td><td>A set of targets (instances, IPs, Lambda) + port + health check settings</td><td><code>upstream api { server …; }</code></td></tr>
  </tbody>
</table>
<p>Two facts that surprise people coming from a VPS. First, an ALB <strong>must</strong> be placed in at least two subnets from two different AZs — AWS refuses a single-AZ ALB, because the whole point is to survive an AZ. Second, it has <strong>no fixed IP</strong>: its nodes scale and move, so you always point DNS at its name (with a Route 53 alias, lesson 5.3), never at an address you copied from <code>dig</code>.</p>

<h3>See it running (1): the ALB API</h3>
<p>The ELBv2 API is not in LocalStack's free edition, so this part ran on Moto, another AWS emulator. It is configuration only — no packets flow. Read it as the order of work on a real account: load balancer → target group with health check → register targets → listener → path rule.</p>
${OUT_51_ALB_API}
<ul>
  <li>The DNS name ends in <code>elb.amazonaws.com</code>; State is <code>provisioning</code> for a minute or two on real AWS before it becomes <code>active</code>.</li>
  <li><strong>Moto differs from AWS here:</strong> it also accepts an ALB with a single subnet. Real AWS rejects that with a validation error — “You must select at least two Availability Zone subnets”.</li>
  <li>The health check is part of the <em>target group</em>, not of the machine: <code>/health</code>, every 15 s, 2 successes to become healthy, 2 failures to become unhealthy. The defaults are gentler (path <code>/</code>, 30 s, 5 to become healthy), which means a broken machine keeps receiving traffic for a full minute — tune it.</li>
  <li>The rule <code>/api/*</code> has priority 10. Lower numbers are evaluated first; the listener's default action catches everything no rule matched.</li>
</ul>

<h3>See it running (2): real traffic through a load balancer</h3>
<p>To watch packets move, HAProxy 3.0 plays the ALB in Docker, with the same three target groups and a health check on <code>/health</code> every second (fall 2, rise 2 — the same thresholds as above, just faster). Four small Node.js containers are the targets; each answers with its name and “AZ”.</p>
${MA_ALB}
${OUT_51_ALB_THAT_A}
<p>Round robin alternates api-1 and api-2. <code>/</code> went to the web group and the <code>Host: admin.labflow.example</code> header went to the admin group — two ALB rules (path and host) on one listener. Now break things:</p>
${OUT_51_ALB_THAT_B}
<ol>
  <li>api-2's <code>/health</code> returns 500. After two failed checks it is <strong>DOWN</strong> and every request lands on api-1 — no user saw an error.</li>
  <li>Both api targets fail ⇒ the load balancer answers <strong>503 Service Unavailable</strong> itself. On AWS, a 503 from the ALB with no target behind it is the first clue in many outages: look at target health before you look at your code.</li>
  <li>After the fix, two passing checks bring each target back to <strong>UP</strong>.</li>
</ol>
${OUT_51_ALB_THAT_C}
<p>The app sees the client's real address in <code>X-Forwarded-For</code>, while the TCP connection comes from the load balancer. An ALB does exactly the same and adds <code>X-Forwarded-Proto</code> and <code>X-Forwarded-Port</code>. In Express write <code>app.set('trust proxy', 1)</code>; in Spring Boot set <code>server.forward-headers-strategy=native</code> — otherwise logs and rate limits see only the ALB.</p>

<h3>Health check: what /health should (not) do</h3>
<ul>
  <li>Return 200 when <em>this process</em> can serve requests. Keep it fast and cheap — it runs every few seconds on every target.</li>
  <li>Do <strong>not</strong> make it fail when a shared dependency (the database) is slow. If every target checks the database and the database hiccups, the ALB marks <em>every</em> target unhealthy at once — you turned a slow database into a full outage. Check deep dependencies in a separate readiness endpoint or in monitoring.</li>
  <li><strong>Deregistration delay</strong> (target group attribute, default 300 s): when a target leaves, the ALB stops sending new requests but lets in-flight ones finish. Lower it (30–60 s) for short API calls so deploys are not slow.</li>
</ul>

<h3>ALB, NLB or something else?</h3>
<table>
  <thead><tr><th></th><th>ALB (layer 7)</th><th>NLB (layer 4)</th></tr></thead>
  <tbody>
    <tr><td>Understands</td><td>HTTP/HTTPS, HTTP/2, gRPC, WebSocket — paths, hosts, headers</td><td>TCP/UDP/TLS — only IPs and ports</td></tr>
    <tr><td>Use for</td><td>Web APIs and sites (LabFlow)</td><td>Raw TCP, very high throughput, static IP per AZ, non-HTTP protocols</td></tr>
    <tr><td>Extras</td><td>Rules, redirects, fixed responses, Cognito/OIDC login, WAF (lesson 5.5)</td><td>Elastic IP per AZ, preserves client IP, PrivateLink</td></tr>
  </tbody>
</table>
<p>Price in Singapore (Price List, 19/11/2026): ALB <strong>0.0252 USD/hour</strong> (~18.4 USD/month even with zero traffic) + <strong>0.008 USD per LCU-hour</strong> (an LCU bundles new connections, active connections, bytes and rule evaluations). A small API rarely uses more than one LCU. Each public ALB node also holds a public IPv4 address, billed at 0.005 USD/hour (lesson 3.2).</p>

<h3>🔓 Hacker's view: two classic load-balancer tricks</h3>
<ul>
  <li><strong>Forged X-Forwarded-For.</strong> An attacker sends <code>X-Forwarded-For: 1.2.3.4</code> themselves. The ALB <em>appends</em> the real address, so the header becomes <code>1.2.3.4, &lt;real IP&gt;</code>. Code that trusts the <em>first</em> value lets anyone bypass IP allow-lists and per-IP rate limits. Trust only the value added by the hop you control (the last one), which is what <code>trust proxy = 1</code> does.</li>
  <li><strong>HTTP request smuggling (desync).</strong> In 2019 James Kettle (PortSwigger) showed that when a proxy and the server behind it disagree on where one request ends (<code>Content-Length</code> vs <code>Transfer-Encoding</code>), an attacker can hide a second request inside the first and poison other users' responses. In August 2020 AWS added <strong>desync mitigation mode</strong> to ALB (default <em>defensive</em>) — leave it on; <em>strictest</em> rejects every ambiguous request.</li>
  <li>Defence in depth: the targets' security group accepts the app port <strong>only from the ALB's security group</strong> (lesson 3.3), so nobody can reach a target directly and skip your rules.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>cuongthai.com today:</strong> one VPS, Nginx in front of the backend and frontend containers, Cloudflare in front of Nginx. The Nginx config is exactly “listener + rules + upstreams”. On AWS the same shape is ALB + two target groups — but spread over two AZs and with health checks Nginx's free edition does not do actively.</li>
  <li>A deploy on a team using ALB: register the new version's targets, wait until they are <em>healthy</em>, then deregister the old ones (deregistration delay lets in-flight requests finish). That is a zero-downtime deploy with no script magic — Chapter 7 (ECS) does it for you.</li>
  <li>First on-call question at work when the API is down: “What does target health say?” — <code>aws elbv2 describe-target-health</code>.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>ALB vs NLB?</strong> — ALB is layer 7: routes on paths/hosts/headers, HTTP features, WAF. NLB is layer 4: TCP/UDP, static IPs, extreme throughput, keeps the client IP. Web API ⇒ ALB.</li>
  <li><strong>Why does an ALB return 503?</strong> — No healthy target in the target group (or no target registered). Check target health and the health check path/port/security group before the code.</li>
  <li><strong>How does the app learn the client IP behind an ALB?</strong> — From <code>X-Forwarded-For</code>, trusting only the hop the ALB added; configure the framework's trust-proxy setting.</li>
  <li><strong>What is deregistration delay?</strong> — Connection draining: time an ALB keeps serving in-flight requests to a target being removed (default 300 s).</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>bash scratchpad/aws/lab/c5/51.sh</code> (or rebuild it from the config above): Docker network, four Node targets, HAProxy as the ALB.</li>
  <li>Add a fourth rule: requests with header <code>X-Beta: 1</code> go to a new target group <code>tg-beta</code> with one container.</li>
  <li>Make <code>/health</code> of the beta target fail and confirm beta requests now get 503 while normal requests still work.</li>
</ol>
<p><strong>Pass when:</strong> <code>curl -H "X-Beta: 1" alb/</code> answers from the beta container, then 503 after you break it, and <code>curl alb/api/phong</code> keeps answering throughout.</p>
${giai('Hint: the HAProxy lines', bash(`
# in frontend listener-80, before the other use_backend lines
acl la_beta req.hdr(x-beta) -m str 1
use_backend tg-beta if la_beta
# new backend
backend tg-beta
  option httpchk GET /health
  default-server inter 1s fall 2 rise 2
  server beta-1 aws-c5-beta-1:3000 check resolvers docker init-addr none
# on AWS the same rule is: aws elbv2 create-rule --priority 5 \\
#   --conditions 'Field=http-header,HttpHeaderConfig={HttpHeaderName=X-Beta,Values=[1]}' \\
#   --actions Type=forward,TargetGroupArn=$TG_BETA`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ALB</span><span class="v">Managed layer-7 load balancer: listeners, rules, target groups, health checks.</span></div>
  <div class="kv"><span class="k">Listener</span><span class="v">Protocol + port the ALB accepts, with a default action.</span></div>
  <div class="kv"><span class="k">Rule</span><span class="v">Condition → action, evaluated by priority (lower first).</span></div>
  <div class="kv"><span class="k">Target group</span><span class="v">Targets + port + health check; what a rule forwards to.</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">Periodic request to each target; thresholds decide healthy/unhealthy.</span></div>
  <div class="kv"><span class="k">Deregistration delay</span><span class="v">Draining time for in-flight requests when a target leaves.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Header carrying the client IP chain; trust only the hop you control.</span></div>
  <div class="kv"><span class="k">LCU</span><span class="v">Load Balancer Capacity Unit — the usage part of the ALB bill.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>ALB = managed reverse proxy over at least two AZs, reached by DNS name, never by IP.</li>
  <li>Listener → rules (path/host/header) → target groups, each with its own health check.</li>
  <li>Unhealthy targets stop receiving traffic; no healthy target ⇒ 503 from the ALB.</li>
  <li>Keep <code>/health</code> cheap and local; tune thresholds and deregistration delay.</li>
  <li>Trust X-Forwarded-For only from your own hop; lock targets to the ALB's security group.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html', '⚖️', 'AWS docs — What is an Application Load Balancer?', 'Components, how routing and health checks work.')}
${tl('https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn', '🕳️', 'PortSwigger — HTTP Desync Attacks (2019)', 'The research behind ALB desync mitigation mode.')}

<h3>Sources</h3>
<ul>
  <li>ALB components: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html</a></li>
  <li>At least two AZ subnets; desync mitigation: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html</a></li>
  <li>Health check settings and defaults: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html</a></li>
  <li>Listener rules: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html</a></li>
  <li>X-Forwarded headers: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html</a></li>
  <li>Deregistration delay: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html</a></li>
  <li>Desync mitigation launch (08/2020): <a href="https://aws.amazon.com/about-aws/whats-new/2020/08/application-and-classic-load-balancers-adding-defense-in-depth-with-introduction-of-desync-mitigation-mode/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2020/08/…desync-mitigation-mode/</a></li>
  <li>ALB pricing: <a href="https://aws.amazon.com/elasticloadbalancing/pricing/" target="_blank" rel="noopener">aws.amazon.com/elasticloadbalancing/pricing/</a></li>
</ul>
</div>
`;
const L51_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 1</span>
<h2>5.1 — Application Load Balancer: quầy lễ tân đứng trước các máy chủ</h2>
<p class="lead">Tới giờ mọi yêu cầu đi thẳng vào một máy EC2. Máy đó là điểm chết duy nhất: vá nó, nó sập, hay mất AZ của nó là API mất theo. <strong>Application Load Balancer (ALB)</strong> là một reverse proxy do AWS vận hành, đứng trước nhiều máy: chia yêu cầu cho các máy, định tuyến theo đường dẫn hay tên miền, hỏi sức khoẻ từng máy vài giây một lần và ngừng gửi việc cho máy ốm. Nếu bạn từng viết khối <code>upstream</code> của Nginx thì bạn đã biết ý tưởng này — bài này đặt từng thói quen Nginx cạnh tên gọi của nó trên ALB, rồi cho lưu lượng thật chạy qua một bộ cân bằng tải mà bạn được cố tình làm hỏng.</p>

<h3>Hình dung: quầy tiếp đón phòng khám</h3>
<p>Bệnh nhân (yêu cầu) không bao giờ tự đi thẳng vào phòng bác sĩ. Họ dừng ở <strong>quầy tiếp đón</strong> (ALB). Quầy có một cửa cho mỗi kiểu khám — <strong>listener</strong> ở cổng 80 hay 443. Một bảng <strong>luật</strong> ghi “chụp X-quang ⇒ tầng 2, nha khoa ⇒ tầng 3” (định tuyến theo đường dẫn và tên miền). Mỗi tầng có danh sách bác sĩ đang trực — <strong>target group</strong>. Vài phút một lần, y tá gõ cửa từng phòng hỏi “ổn không?” — <strong>health check</strong>. Bác sĩ hai lần không trả lời bị gạch khỏi danh sách; bệnh nhân được đưa sang người khác. Khi cả tầng đều ốm, quầy nói “xin lỗi, quay lại sau” — mã HTTP <strong>503</strong>.</p>

<h3>Bốn khối ghép nên ALB</h3>
<table>
  <thead><tr><th>Thành phần ALB</th><th>Là gì</th><th>Tương đương Nginx</th></tr></thead>
  <tbody>
    <tr><td><strong>Load balancer</strong></td><td>Chính cái proxy do AWS vận hành; nằm ở ít nhất hai subnet public thuộc hai AZ; có tên DNS, không bao giờ có IP cố định</td><td>Tiến trình Nginx trên VPS</td></tr>
    <tr><td><strong>Listener</strong></td><td>Giao thức + cổng nó nhận (HTTP:80, HTTPS:443) và hành động mặc định</td><td><code>server { listen 443 ssl; }</code></td></tr>
    <tr><td><strong>Rule (luật)</strong></td><td>Điều kiện (đường dẫn, host, header, phương thức, query, IP nguồn) ⇒ hành động (forward, redirect, trả lời cố định), xét theo độ ưu tiên</td><td><code>location /api/ { … }</code>, <code>server_name</code></td></tr>
    <tr><td><strong>Target group</strong></td><td>Tập máy đích (instance, IP, Lambda) + cổng + cấu hình health check</td><td><code>upstream api { server …; }</code></td></tr>
  </tbody>
</table>
<p>Hai điều làm người quen VPS bất ngờ. Một: ALB <strong>bắt buộc</strong> nằm ở ít nhất hai subnet thuộc hai AZ khác nhau — AWS từ chối ALB một AZ, vì mục đích của nó chính là sống sót khi mất một AZ. Hai: nó <strong>không có IP cố định</strong>: các nút của nó tự co giãn và đổi chỗ, nên DNS luôn trỏ vào tên của nó (bằng bản ghi alias của Route 53, bài 5.3), không bao giờ trỏ vào một địa chỉ bạn chép từ <code>dig</code>.</p>

<h3>Xem chạy thật (1): API của ALB</h3>
<p>API ELBv2 không có trong bản miễn phí của LocalStack, nên phần này chạy trên Moto, một bộ giả lập AWS khác. Đây chỉ là cấu hình — không có gói tin nào chạy. Đọc nó như thứ tự làm việc trên tài khoản thật: load balancer ⇒ target group kèm health check ⇒ đăng ký máy đích ⇒ listener ⇒ luật theo đường dẫn.</p>
${OUT_51_ALB_API}
<ul>
  <li>Tên DNS kết thúc bằng <code>elb.amazonaws.com</code>; trên AWS thật trạng thái là <code>provisioning</code> một hai phút rồi mới thành <code>active</code>.</li>
  <li><strong>Moto khác AWS ở chỗ này:</strong> nó nhận cả ALB chỉ một subnet. AWS thật từ chối bằng lỗi kiểm tra đầu vào — “You must select at least two Availability Zone subnets”.</li>
  <li>Health check thuộc về <em>target group</em>, không thuộc về máy: <code>/health</code>, 15 giây một lần, 2 lần đạt thì healthy, 2 lần hỏng thì unhealthy. Mặc định hiền hơn nhiều (đường <code>/</code>, 30 giây, 5 lần đạt mới healthy) — nghĩa là máy hỏng vẫn nhận việc cả phút. Hãy chỉnh lại.</li>
  <li>Luật <code>/api/*</code> có độ ưu tiên 10. Số nhỏ được xét trước; hành động mặc định của listener hứng mọi thứ không khớp luật nào.</li>
</ul>

<h3>Xem chạy thật (2): lưu lượng thật qua bộ cân bằng tải</h3>
<p>Để thấy gói tin chạy thật, HAProxy 3.0 đóng vai ALB trong Docker, có đúng ba target group và health check <code>/health</code> mỗi giây (fall 2, rise 2 — cùng ngưỡng như trên, chỉ nhanh hơn). Bốn container Node.js nhỏ là máy đích; mỗi máy trả lời tên và “AZ” của nó.</p>
${MA_ALB}
${OUT_51_ALB_THAT_A}
<p>Round robin xen kẽ api-1 và api-2. Đường <code>/</code> sang nhóm web, còn header <code>Host: admin.labflow.example</code> sang nhóm admin — hai luật ALB (theo đường dẫn và theo host) trên cùng một listener. Giờ làm hỏng thử:</p>
${OUT_51_ALB_THAT_B}
<ol>
  <li><code>/health</code> của api-2 trả 500. Sau hai lần kiểm hỏng nó thành <strong>DOWN</strong> và mọi yêu cầu đổ về api-1 — không người dùng nào thấy lỗi.</li>
  <li>Cả hai máy api hỏng ⇒ chính bộ cân bằng tải trả <strong>503 Service Unavailable</strong>. Trên AWS, 503 từ ALB mà phía sau không còn máy khoẻ là manh mối đầu tiên của rất nhiều sự cố: xem sức khoẻ target trước khi xem mã.</li>
  <li>Sửa xong, hai lần kiểm đạt đưa từng máy về <strong>UP</strong>.</li>
</ol>
${OUT_51_ALB_THAT_C}
<p>App thấy địa chỉ thật của khách trong <code>X-Forwarded-For</code>, còn kết nối TCP thì đến từ bộ cân bằng tải. ALB làm y hệt, thêm cả <code>X-Forwarded-Proto</code> và <code>X-Forwarded-Port</code>. Trong Express viết <code>app.set('trust proxy', 1)</code>; trong Spring Boot đặt <code>server.forward-headers-strategy=native</code> — không thì log và bộ giới hạn tần suất chỉ thấy mỗi ALB.</p>

<h3>Health check: /health nên (và không nên) làm gì</h3>
<ul>
  <li>Trả 200 khi <em>chính tiến trình này</em> phục vụ được yêu cầu. Giữ nó nhanh và rẻ — nó chạy vài giây một lần trên mọi máy.</li>
  <li><strong>Đừng</strong> để nó hỏng khi một phụ thuộc dùng chung (cơ sở dữ liệu) chậm. Nếu mọi máy đều hỏi CSDL và CSDL hắt hơi, ALB đánh dấu <em>mọi</em> máy unhealthy cùng lúc — bạn vừa biến một CSDL chậm thành sập toàn bộ. Kiểm phụ thuộc sâu ở một endpoint readiness riêng hoặc ở phần giám sát.</li>
  <li><strong>Deregistration delay</strong> (thuộc tính target group, mặc định 300 giây): khi một máy rời nhóm, ALB ngừng gửi yêu cầu mới nhưng để yêu cầu đang chạy làm nốt. Hạ xuống 30–60 giây cho API gọi ngắn để deploy khỏi chậm.</li>
</ul>

<h3>ALB, NLB hay thứ khác?</h3>
<table>
  <thead><tr><th></th><th>ALB (tầng 7)</th><th>NLB (tầng 4)</th></tr></thead>
  <tbody>
    <tr><td>Hiểu được</td><td>HTTP/HTTPS, HTTP/2, gRPC, WebSocket — đường dẫn, host, header</td><td>TCP/UDP/TLS — chỉ IP và cổng</td></tr>
    <tr><td>Dùng cho</td><td>API và trang web (LabFlow)</td><td>TCP thuần, thông lượng rất lớn, IP tĩnh mỗi AZ, giao thức không phải HTTP</td></tr>
    <tr><td>Thêm</td><td>Luật, redirect, trả lời cố định, đăng nhập Cognito/OIDC, WAF (bài 5.5)</td><td>Elastic IP mỗi AZ, giữ IP khách, PrivateLink</td></tr>
  </tbody>
</table>
<p>Giá ở Singapore (Price List, 19/11/2026): ALB <strong>0,0252 USD/giờ</strong> (~18,4 USD/tháng kể cả khi không ai gọi) + <strong>0,008 USD mỗi LCU-giờ</strong> (LCU gộp kết nối mới, kết nối đang mở, lượng byte và số lần xét luật). API nhỏ hiếm khi dùng quá một LCU. Mỗi nút ALB public còn giữ một địa chỉ IPv4 public, tính 0,005 USD/giờ (bài 3.2).</p>

<h3>🔓 Góc hacker: hai mánh kinh điển với bộ cân bằng tải</h3>
<ul>
  <li><strong>Giả X-Forwarded-For.</strong> Kẻ tấn công tự gửi <code>X-Forwarded-For: 1.2.3.4</code>. ALB <em>nối thêm</em> địa chỉ thật, nên header thành <code>1.2.3.4, &lt;IP thật&gt;</code>. Mã nào tin giá trị <em>đầu tiên</em> là cho bất kỳ ai vượt danh sách IP được phép và giới hạn theo IP. Chỉ tin giá trị do chặng bạn kiểm soát thêm vào (giá trị cuối) — đó chính là việc của <code>trust proxy = 1</code>.</li>
  <li><strong>Buôn lậu yêu cầu HTTP (desync).</strong> Năm 2019, James Kettle (PortSwigger) chỉ ra: khi proxy và máy chủ phía sau hiểu khác nhau chỗ một yêu cầu kết thúc (<code>Content-Length</code> so với <code>Transfer-Encoding</code>), kẻ tấn công giấu được yêu cầu thứ hai trong yêu cầu thứ nhất và đầu độc câu trả lời của người khác. Tháng 8/2020, AWS thêm <strong>desync mitigation mode</strong> cho ALB (mặc định <em>defensive</em>) — cứ để bật; <em>strictest</em> từ chối mọi yêu cầu mập mờ.</li>
  <li>Phòng nhiều lớp: security group của máy đích chỉ nhận cổng app <strong>từ security group của ALB</strong> (bài 3.3), để không ai gọi thẳng vào máy và lách các luật của bạn.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>cuongthai.com hôm nay:</strong> một VPS, Nginx đứng trước container backend và frontend, Cloudflare đứng trước Nginx. Cấu hình Nginx chính là “listener + luật + upstream”. Trên AWS, cùng hình dạng đó là ALB + hai target group — nhưng trải trên hai AZ và có health check chủ động mà bản Nginx miễn phí không làm.</li>
  <li>Một lần deploy ở công ty dùng ALB: đăng ký máy bản mới, chờ chúng <em>healthy</em>, rồi rút máy bản cũ (deregistration delay để yêu cầu đang chạy làm nốt). Đó là deploy không gián đoạn mà không cần script phép thuật nào — Chương 7 (ECS) làm việc này hộ bạn.</li>
  <li>Câu đầu tiên khi trực sự cố lúc API sập: “Target health đang nói gì?” — <code>aws elbv2 describe-target-health</code>.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>ALB khác NLB thế nào?</strong> — ALB ở tầng 7: định tuyến theo đường dẫn/host/header, có tính năng HTTP, có WAF. NLB ở tầng 4: TCP/UDP, IP tĩnh, thông lượng cực lớn, giữ IP khách. API web ⇒ ALB.</li>
  <li><strong>Vì sao ALB trả 503?</strong> — Target group không còn máy khoẻ (hoặc chưa đăng ký máy nào). Kiểm sức khoẻ target, đường/cổng health check và security group trước khi xem mã.</li>
  <li><strong>Đứng sau ALB, app biết IP khách bằng cách nào?</strong> — Từ <code>X-Forwarded-For</code>, chỉ tin chặng do ALB thêm vào; bật thiết lập trust proxy của framework.</li>
  <li><strong>Deregistration delay là gì?</strong> — Rút kết nối êm: thời gian ALB vẫn phục vụ yêu cầu đang chạy của một máy sắp bị rút (mặc định 300 giây).</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>bash scratchpad/aws/lab/c5/51.sh</code> (hoặc tự dựng lại từ cấu hình ở trên): mạng Docker, bốn máy đích Node, HAProxy làm ALB.</li>
  <li>Thêm luật thứ tư: yêu cầu có header <code>X-Beta: 1</code> đi tới target group mới <code>tg-beta</code> gồm một container.</li>
  <li>Làm hỏng <code>/health</code> của máy beta và xác nhận yêu cầu beta giờ nhận 503, còn yêu cầu thường vẫn chạy.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>curl -H "X-Beta: 1" alb/</code> được máy beta trả lời, rồi 503 sau khi bạn làm hỏng nó, và <code>curl alb/api/phong</code> trả lời bình thường suốt quá trình.</p>
${giai('Gợi ý: các dòng HAProxy', bash(`
# trong frontend listener-80, đặt trước các dòng use_backend khác
acl la_beta req.hdr(x-beta) -m str 1
use_backend tg-beta if la_beta
# backend mới
backend tg-beta
  option httpchk GET /health
  default-server inter 1s fall 2 rise 2
  server beta-1 aws-c5-beta-1:3000 check resolvers docker init-addr none
# trên AWS, cùng luật đó là: aws elbv2 create-rule --priority 5 \\
#   --conditions 'Field=http-header,HttpHeaderConfig={HttpHeaderName=X-Beta,Values=[1]}' \\
#   --actions Type=forward,TargetGroupArn=$TG_BETA`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ALB</span><span class="v">Bộ cân bằng tải tầng 7 do AWS vận hành: listener, luật, target group, health check.</span></div>
  <div class="kv"><span class="k">Listener</span><span class="v">Giao thức + cổng ALB nhận, kèm hành động mặc định.</span></div>
  <div class="kv"><span class="k">Rule (luật)</span><span class="v">Điều kiện ⇒ hành động, xét theo độ ưu tiên (số nhỏ trước).</span></div>
  <div class="kv"><span class="k">Target group</span><span class="v">Máy đích + cổng + health check; nơi luật chuyển yêu cầu tới.</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">Yêu cầu định kỳ tới từng máy; ngưỡng quyết định khoẻ/ốm.</span></div>
  <div class="kv"><span class="k">Deregistration delay</span><span class="v">Thời gian rút êm cho yêu cầu đang chạy khi một máy rời nhóm.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Header mang chuỗi IP của khách; chỉ tin chặng bạn kiểm soát.</span></div>
  <div class="kv"><span class="k">LCU</span><span class="v">Load Balancer Capacity Unit — phần tính theo mức dùng trong hoá đơn ALB.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>ALB = reverse proxy do AWS vận hành, trải ít nhất hai AZ, gọi bằng tên DNS, không bao giờ bằng IP.</li>
  <li>Listener ⇒ luật (đường dẫn/host/header) ⇒ target group, mỗi nhóm có health check riêng.</li>
  <li>Máy ốm thôi nhận việc; không còn máy khoẻ ⇒ ALB trả 503.</li>
  <li>Giữ <code>/health</code> rẻ và chỉ kiểm chính mình; chỉnh ngưỡng và deregistration delay.</li>
  <li>Chỉ tin X-Forwarded-For từ chặng của mình; khoá máy đích vào security group của ALB.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html', '⚖️', 'Tài liệu AWS — Application Load Balancer là gì?', 'Các thành phần, cách định tuyến và health check hoạt động.')}
${tl('https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn', '🕳️', 'PortSwigger — HTTP Desync Attacks (2019)', 'Nghiên cứu đứng sau chế độ desync mitigation của ALB.')}

<h3>Nguồn</h3>
<ul>
  <li>Thành phần của ALB: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html</a></li>
  <li>Ít nhất hai subnet hai AZ; desync mitigation: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html</a></li>
  <li>Thiết lập và mặc định của health check: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html</a></li>
  <li>Luật của listener: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-update-rules.html</a></li>
  <li>Header X-Forwarded: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html</a></li>
  <li>Deregistration delay: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html</a></li>
  <li>Ra mắt desync mitigation (08/2020): <a href="https://aws.amazon.com/about-aws/whats-new/2020/08/application-and-classic-load-balancers-adding-defense-in-depth-with-introduction-of-desync-mitigation-mode/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2020/08/…desync-mitigation-mode/</a></li>
  <li>Giá ALB: <a href="https://aws.amazon.com/elasticloadbalancing/pricing/" target="_blank" rel="noopener">aws.amazon.com/elasticloadbalancing/pricing/</a></li>
</ul>
</div>
`;
/* ═════ 5.2 — Auto Scaling group ═════ */
const L52_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 2</span>
<h2>5.2 — Auto Scaling groups: as many machines as the load needs, and never fewer than you promised</h2>
<p class="lead">An ALB spreads traffic across machines; an <strong>Auto Scaling group (ASG)</strong> decides <em>how many</em> machines there are. You give it a launch template (lesson 4.2), a minimum, a maximum and the subnets of two or more AZs. It keeps the count at the <strong>desired capacity</strong>, replaces a machine that fails its health check, spreads machines evenly across AZs, and — with a scaling policy — raises or lowers the desired count as load changes. The service itself is free; you pay for the machines it runs.</p>

<h3>The picture: a supermarket opening checkout lanes</h3>
<p>A supermarket promises at least two checkout lanes open (<strong>minimum</strong>), has six tills in total (<strong>maximum</strong>), and the manager watches the queue (<strong>metric</strong>). Target: about five customers per lane (<strong>target tracking</strong>). Queue grows ⇒ open more lanes quickly. Queue shrinks ⇒ close lanes slowly, after the rush is clearly over, and never close a lane with a customer still paying (<strong>draining</strong>). A cashier who faints is replaced, not mourned (<strong>health replacement</strong>). Lanes are split between both entrances so a blocked door does not stop the shop (<strong>AZ balance</strong>).</p>

<h3>Three numbers and four settings</h3>
<table>
  <thead><tr><th>Setting</th><th>Meaning</th><th>LabFlow choice</th></tr></thead>
  <tbody>
    <tr><td><strong>min / desired / max</strong></td><td>Floor, current goal, ceiling. Max is also your cost cap.</td><td>2 / 2 / 4</td></tr>
    <tr><td><strong>Subnets (VPCZoneIdentifier)</strong></td><td>Private subnets in ≥ 2 AZs; the ASG balances across them</td><td>private-a, private-b</td></tr>
    <tr><td><strong>Health check type</strong></td><td><code>EC2</code> = only “is the VM running”; <code>ELB</code> = also the target group's health check</td><td>ELB</td></tr>
    <tr><td><strong>Health check grace period</strong></td><td>Seconds after launch during which failed checks are ignored (app still booting)</td><td>60–120 s</td></tr>
    <tr><td><strong>Target groups</strong></td><td>New machines register themselves; removed ones deregister (with draining)</td><td>tg-api</td></tr>
    <tr><td><strong>Scaling policy</strong></td><td>How desired changes: target tracking, step, scheduled, predictive</td><td>Target tracking</td></tr>
  </tbody>
</table>
<p>With <code>HealthCheckType=EC2</code> (the default), a machine whose Node process has crashed but whose VM is running counts as healthy forever — the ALB stops sending it traffic but the ASG never replaces it. Behind an ALB, always choose <code>ELB</code>.</p>

<h3>See it running (1): the Auto Scaling API</h3>
${OUT_52_ASG_API}
<ul>
  <li>The launch template carries the AMI, instance type and IMDSv2 — the ASG only says “how many, where”.</li>
  <li>Target tracking on <code>ASGAverageCPUUtilization</code> = 50: AWS creates two CloudWatch alarms for you (one to scale out, one to scale in) and adjusts desired to keep the average near 50%. Other predefined metrics: <code>ALBRequestCountPerTarget</code> (good for APIs), network in/out.</li>
  <li><strong>Moto differs from AWS here:</strong> it placed every instance in AZ <code>1a</code> although two subnets were given, and it left the instance we marked <code>Unhealthy</code> in place. Real AWS balances across AZs and terminates + replaces an unhealthy instance within a few minutes.</li>
</ul>

<h3>See it running (2): a small ASG with real load</h3>
<p>To watch scaling happen, the script below plays the ASG in Docker: every 5 seconds it reads the request rate of the target group from HAProxy, computes desired = ⌈requests per second ÷ 15⌉ clamped to [2, 4], launches containers into the emptier “AZ”, removes surplus ones only after three quiet rounds, drains a machine before removing it, and replaces any machine the load balancer marks DOWN. HAProxy discovers new machines through Docker DNS — the way an ASG registers instances into a target group.</p>
${MA_ASG}
${OUT_52_ASG_THAT}
${OUT_52_AB}
<ol>
  <li><strong>Scale out is fast:</strong> one measurement at 118 req/s was enough to go from 2 to 4 (the maximum — 196 req/s would “want” 14 machines, but max is the ceiling and the cost cap).</li>
  <li><strong>Scale in is slow on purpose:</strong> after the load stopped, the group waited three rounds, removed one machine from the AZ with more machines, waited again, removed the next. Real target tracking does the same: it scales out on 3 one-minute data points but scales in only after 15, so a short dip does not throw away capacity you will need a minute later.</li>
  <li><strong>Draining:</strong> each removed machine first failed its health check on purpose and got 3 seconds for in-flight requests. Result: 7,859 requests, <strong>0 failed</strong>, while machines came and went.</li>
  <li><strong>Self-healing:</strong> when api-1's <code>/health</code> broke, the next round saw it DOWN, removed it and launched api-5 in the same AZ — desired stayed 2.</li>
</ol>

<h3>Which scaling policy?</h3>
<table>
  <thead><tr><th>Policy</th><th>How it works</th><th>Use when</th></tr></thead>
  <tbody>
    <tr><td><strong>Target tracking</strong></td><td>“Keep metric X near value Y” — AWS builds the alarms</td><td>Default choice: CPU 50%, or requests per target</td></tr>
    <tr><td><strong>Step scaling</strong></td><td>Your own alarm + steps (+1 at 70%, +3 at 90%)</td><td>You need different reactions to different severities</td></tr>
    <tr><td><strong>Scheduled</strong></td><td>Set min/desired at fixed times</td><td>Known peaks: lab booking opens at 07:00 every Monday</td></tr>
    <tr><td><strong>Predictive</strong></td><td>Forecasts from 14 days of history and scales in advance</td><td>Regular daily/weekly cycles</td></tr>
  </tbody>
</table>
<p>New machines are not instantly useful: boot + user data + app start can take minutes. Two tools shorten that gap: an AMI with everything pre-installed (bake, do not install at boot — lesson 4.2) and <strong>warm pools</strong> (pre-initialised stopped instances). For rolling out a new launch template version, use <strong>instance refresh</strong> — the ASG replaces machines in batches while keeping a minimum healthy percentage.</p>

<h3>🔓 Hacker's view: autoscaling turns attacks into invoices</h3>
<ul>
  <li><strong>Denial of wallet.</strong> An ASG with a large max happily scales up to absorb a flood of junk requests — the site stays up and the bill explodes. Max is a <em>budget decision</em>, not only a capacity one; pair it with WAF rate limits (lesson 5.5) and the budget alarm from lesson 0.1.</li>
  <li><strong>Stolen keys + launch templates.</strong> Attackers holding leaked keys (EleKtra-Leak, Unit 42, 2023 — lesson 1.7) launch crypto-mining fleets in minutes. A quota and an SCP/permission boundary that forbid <code>ec2:RunInstances</code> for large types outside your ASG role limit the damage.</li>
  <li>Never put secrets in the launch template's user data — anyone with <code>ec2:DescribeLaunchTemplateVersions</code> can read them (lesson 4.2). Use the instance role + Secrets Manager (Chapter 6).</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Pokémon GO, July 2016:</strong> launch traffic reached about 50 times the planned target and 10 times the worst-case estimate (Google Cloud's own write-up). Elastic capacity plus a hard look at limits is what kept it alive — the same two knobs as max + quotas here.</li>
  <li><strong>cuongthai.com</strong> runs on one VPS: more traffic means a bigger VPS, chosen by hand. That is fine at its size. The day one machine is not enough — or a single reboot is not acceptable — the AWS answer is ASG (or ECS service auto scaling, Chapter 7) behind an ALB.</li>
  <li>At work you will hear “scale out” (more machines) vs “scale up” (bigger machine). ASGs do scale out; the app must therefore be <strong>stateless</strong>: sessions in Redis or a JWT, files in S3 — not on the machine's disk.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>Why does my ASG not replace a machine whose app crashed?</strong> — Health check type is EC2; switch to ELB so target-group failures count.</li>
  <li><strong>Why scale in slower than scale out?</strong> — To avoid flapping: removing capacity on a short dip costs you a slow boot when traffic returns.</li>
  <li><strong>What makes an app ready for horizontal scaling?</strong> — No local state: sessions, uploads and caches live outside the machine; any instance can serve any request.</li>
  <li><strong>Target tracking vs step scaling?</strong> — Target tracking keeps one metric near a value with AWS-built alarms; step scaling lets you define your own alarm thresholds and step sizes.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>bash scratchpad/aws/lab/c5/52.sh</code>; read the log of <code>asg.sh</code> line by line and mark every scale-out, scale-in and replacement.</li>
  <li>Change the target from 15 to 60 requests per second per machine (<code>MUC_TIEU=60</code>) and run again. How many machines does the same load need now?</li>
  <li>Change <code>NGHI_THU</code> to 1 and add a second, short burst of load. Count how many machines are created and destroyed — this is “flapping”.</li>
</ol>
<p><strong>Pass when:</strong> you can explain from the log why desired was 4 (not 14), why scale-in waited, and how many launches the short burst caused with <code>NGHI_THU=1</code>.</p>
${giai('Hint: the arithmetic', bash(`
# desired = ceil(rps / MUC_TIEU), then clamp to [MIN, MAX]
# 196 req/s, MUC_TIEU=15  ⇒ ceil(13.07) = 14 ⇒ clamp ⇒ 4
# 196 req/s, MUC_TIEU=60  ⇒ ceil(3.27)  = 4  ⇒ 4
# 118 req/s, MUC_TIEU=60  ⇒ ceil(1.97)  = 2  ⇒ 2  (the first round would not scale)
MUC_TIEU=60 VONG=26 bash scratchpad/aws/lab/c5/asg.sh`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Auto Scaling group</span><span class="v">Keeps N instances from a launch template across AZs; replaces unhealthy ones.</span></div>
  <div class="kv"><span class="k">Desired capacity</span><span class="v">How many instances the group aims for right now, between min and max.</span></div>
  <div class="kv"><span class="k">Target tracking</span><span class="v">Policy that keeps a metric near a target value using AWS-made alarms.</span></div>
  <div class="kv"><span class="k">Health check type ELB</span><span class="v">Counts the target group's health check, not only the VM state.</span></div>
  <div class="kv"><span class="k">Grace period</span><span class="v">Time after launch when failed health checks are ignored.</span></div>
  <div class="kv"><span class="k">Instance refresh</span><span class="v">Rolling replacement of instances with a new launch template version.</span></div>
  <div class="kv"><span class="k">Warm pool</span><span class="v">Pre-initialised stopped instances that join faster than fresh ones.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">No user data kept on the machine — the precondition for scaling out.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>ASG = launch template + min/desired/max + subnets in ≥ 2 AZs; the service is free, machines are not.</li>
  <li>Behind an ALB use health check type ELB and a grace period.</li>
  <li>Target tracking is the default policy; scale out fast, scale in slow.</li>
  <li>Max is your cost cap — combine it with WAF and budgets.</li>
  <li>Only stateless apps scale out cleanly.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html', '📈', 'AWS docs — Target tracking scaling policies', 'How the alarms are built and why scale-in is conservative.')}
${tl('https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud', '🎮', 'Google Cloud — Bringing Pokémon GO to life (2016)', 'A launch at 50× the planned traffic.')}

<h3>Sources</h3>
<ul>
  <li>What is EC2 Auto Scaling: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html</a></li>
  <li>Target tracking: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html</a></li>
  <li>Health checks (EC2 vs ELB): <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html</a></li>
  <li>Grace period: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-check-grace-period.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-check-grace-period.html</a></li>
  <li>Termination policies: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html</a></li>
  <li>Warm pools: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html</a></li>
  <li>Instance refresh: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html</a></li>
  <li>Pokémon GO on Google Cloud: <a href="https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud" target="_blank" rel="noopener">cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud</a></li>
</ul>
</div>
`;
const L52_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 2</span>
<h2>5.2 — Auto Scaling group: đủ máy theo tải, và không bao giờ ít hơn mức đã hứa</h2>
<p class="lead">ALB chia lưu lượng cho các máy; <strong>Auto Scaling group (ASG)</strong> quyết định có <em>bao nhiêu</em> máy. Bạn đưa nó một launch template (bài 4.2), một mức tối thiểu, một mức tối đa và các subnet thuộc hai AZ trở lên. Nó giữ số máy đúng bằng <strong>desired capacity</strong>, thay máy trượt health check, chia đều máy giữa các AZ, và — khi có chính sách co giãn — tự nâng hạ con số desired theo tải. Bản thân dịch vụ miễn phí; bạn trả tiền cho các máy nó chạy.</p>

<h3>Hình dung: siêu thị mở thêm quầy thu ngân</h3>
<p>Siêu thị hứa luôn mở ít nhất hai quầy (<strong>tối thiểu</strong>), có tổng cộng sáu máy tính tiền (<strong>tối đa</strong>), và quản lý nhìn hàng người xếp (<strong>chỉ số</strong>). Mục tiêu: khoảng năm khách mỗi quầy (<strong>target tracking</strong>). Hàng dài ra ⇒ mở thêm quầy thật nhanh. Hàng ngắn lại ⇒ đóng quầy từ từ, khi chắc chắn đã hết giờ cao điểm, và không bao giờ đóng quầy đang có khách trả tiền dở (<strong>rút êm</strong>). Thu ngân ngất thì thay người khác vào (<strong>thay máy hỏng</strong>). Quầy chia đều cho cả hai cửa để một cửa tắc không làm cả siêu thị đứng (<strong>cân bằng AZ</strong>).</p>

<h3>Ba con số và bốn thiết lập</h3>
<table>
  <thead><tr><th>Thiết lập</th><th>Ý nghĩa</th><th>LabFlow chọn</th></tr></thead>
  <tbody>
    <tr><td><strong>min / desired / max</strong></td><td>Sàn, mục tiêu hiện tại, trần. Max cũng là trần chi phí của bạn.</td><td>2 / 2 / 4</td></tr>
    <tr><td><strong>Subnet (VPCZoneIdentifier)</strong></td><td>Subnet private ở ≥ 2 AZ; ASG chia đều máy giữa chúng</td><td>private-a, private-b</td></tr>
    <tr><td><strong>Health check type</strong></td><td><code>EC2</code> = chỉ hỏi “máy ảo còn chạy không”; <code>ELB</code> = tính cả health check của target group</td><td>ELB</td></tr>
    <tr><td><strong>Health check grace period</strong></td><td>Số giây sau khi máy lên mà kết quả kiểm hỏng bị bỏ qua (app còn đang khởi động)</td><td>60–120 giây</td></tr>
    <tr><td><strong>Target group</strong></td><td>Máy mới tự đăng ký; máy bị rút tự huỷ đăng ký (có rút êm)</td><td>tg-api</td></tr>
    <tr><td><strong>Chính sách co giãn</strong></td><td>Cách desired thay đổi: target tracking, step, theo lịch, dự đoán</td><td>Target tracking</td></tr>
  </tbody>
</table>
<p>Với <code>HealthCheckType=EC2</code> (mặc định), một máy mà tiến trình Node đã chết nhưng máy ảo vẫn chạy được coi là khoẻ mãi mãi — ALB thôi gửi việc cho nó nhưng ASG không bao giờ thay nó. Đứng sau ALB thì luôn chọn <code>ELB</code>.</p>

<h3>Xem chạy thật (1): API của Auto Scaling</h3>
${OUT_52_ASG_API}
<ul>
  <li>Launch template mang AMI, loại máy và IMDSv2 — ASG chỉ nói “bao nhiêu máy, đặt ở đâu”.</li>
  <li>Target tracking theo <code>ASGAverageCPUUtilization</code> = 50: AWS tự tạo hai alarm CloudWatch (một để thêm máy, một để bớt máy) và chỉnh desired để CPU trung bình quanh 50%. Chỉ số dựng sẵn khác: <code>ALBRequestCountPerTarget</code> (hợp với API), lưu lượng mạng vào/ra.</li>
  <li><strong>Moto khác AWS ở chỗ này:</strong> nó đặt mọi máy vào AZ <code>1a</code> dù đã đưa hai subnet, và để nguyên máy bị đánh dấu <code>Unhealthy</code>. AWS thật chia đều giữa các AZ, và terminate + thay máy unhealthy trong vài phút.</li>
</ul>

<h3>Xem chạy thật (2): một ASG thu nhỏ dưới tải thật</h3>
<p>Để thấy co giãn diễn ra, script dưới đây đóng vai ASG trong Docker: cứ 5 giây nó đọc tốc độ yêu cầu vào target group từ HAProxy, tính desired = ⌈số yêu cầu mỗi giây ÷ 15⌉ rồi kẹp vào [2, 4], chạy thêm container vào “AZ” đang ít máy hơn, chỉ rút máy thừa sau ba vòng yên ắng, cho máy rút êm trước khi xoá, và thay mọi máy bị bộ cân bằng tải đánh dấu DOWN. HAProxy tự thấy máy mới qua DNS của Docker — giống cách ASG đăng ký máy vào target group.</p>
${MA_ASG}
${OUT_52_ASG_THAT}
${OUT_52_AB}
<ol>
  <li><strong>Thêm máy thì nhanh:</strong> chỉ một lần đo 118 yêu cầu/giây là đủ đi từ 2 lên 4 (mức tối đa — 196 yêu cầu/giây “muốn” 14 máy, nhưng max là trần, và cũng là trần chi phí).</li>
  <li><strong>Bớt máy thì cố tình chậm:</strong> tải dừng rồi, nhóm vẫn chờ ba vòng, rút một máy ở AZ đang đông hơn, chờ tiếp, rút máy kế. Target tracking thật cũng vậy: thêm máy sau 3 điểm dữ liệu một phút, nhưng chỉ bớt máy sau 15 điểm, để một lúc vắng ngắn không vứt đi công suất mà một phút sau bạn lại cần.</li>
  <li><strong>Rút êm:</strong> mỗi máy bị rút trước hết cố tình trượt health check và có 3 giây cho yêu cầu đang chạy. Kết quả: 7.859 yêu cầu, <strong>0 lỗi</strong>, trong khi máy liên tục đến rồi đi.</li>
  <li><strong>Tự chữa lành:</strong> khi <code>/health</code> của api-1 hỏng, vòng kế thấy nó DOWN, xoá nó và chạy api-5 trong cùng AZ — desired vẫn là 2.</li>
</ol>

<h3>Chọn chính sách co giãn nào?</h3>
<table>
  <thead><tr><th>Chính sách</th><th>Hoạt động thế nào</th><th>Dùng khi</th></tr></thead>
  <tbody>
    <tr><td><strong>Target tracking</strong></td><td>“Giữ chỉ số X quanh giá trị Y” — AWS tự dựng alarm</td><td>Lựa chọn mặc định: CPU 50%, hoặc số yêu cầu mỗi máy</td></tr>
    <tr><td><strong>Step scaling</strong></td><td>Alarm của bạn + các bậc (+1 máy ở 70%, +3 máy ở 90%)</td><td>Cần phản ứng khác nhau cho từng mức nghiêm trọng</td></tr>
    <tr><td><strong>Theo lịch</strong></td><td>Đặt min/desired vào giờ cố định</td><td>Cao điểm biết trước: mở đặt phòng lab lúc 07:00 mỗi thứ Hai</td></tr>
    <tr><td><strong>Dự đoán</strong></td><td>Dự báo từ 14 ngày lịch sử và thêm máy trước</td><td>Chu kỳ ngày/tuần đều đặn</td></tr>
  </tbody>
</table>
<p>Máy mới không dùng được ngay: khởi động + user data + chạy app có thể mất vài phút. Hai công cụ rút ngắn khoảng đó: AMI đóng sẵn mọi thứ (đóng ảnh, đừng cài lúc khởi động — bài 4.2) và <strong>warm pool</strong> (máy khởi tạo sẵn đang stop). Để thay sang phiên bản launch template mới, dùng <strong>instance refresh</strong> — ASG thay máy theo từng đợt mà vẫn giữ tỷ lệ máy khoẻ tối thiểu.</p>

<h3>🔓 Góc hacker: co giãn tự động biến tấn công thành hoá đơn</h3>
<ul>
  <li><strong>Denial of wallet (tấn công vào ví).</strong> ASG có max lớn sẽ vui vẻ thêm máy để hứng một trận lũ yêu cầu rác — web vẫn sống còn hoá đơn thì nổ. Max là <em>quyết định ngân sách</em>, không chỉ là chuyện công suất; đi kèm giới hạn tần suất của WAF (bài 5.5) và cảnh báo ngân sách ở bài 0.1.</li>
  <li><strong>Khoá bị lộ + launch template.</strong> Kẻ cầm khoá bị lộ (EleKtra-Leak, Unit 42, 2023 — bài 1.7) dựng cả đàn máy đào coin trong vài phút. Hạn mức (quota) và SCP/permission boundary cấm <code>ec2:RunInstances</code> loại máy lớn ngoài role của ASG sẽ giới hạn thiệt hại.</li>
  <li>Đừng bao giờ để bí mật trong user data của launch template — ai có <code>ec2:DescribeLaunchTemplateVersions</code> cũng đọc được (bài 4.2). Dùng role của máy + Secrets Manager (Chương 6).</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Pokémon GO, tháng 7/2016:</strong> lưu lượng ngày ra mắt lên khoảng 50 lần mức dự tính và 10 lần kịch bản xấu nhất (theo bài viết của chính Google Cloud). Công suất co giãn cộng việc soát kỹ các giới hạn là thứ giữ nó sống — đúng hai núm vặn max + quota ở đây.</li>
  <li><strong>cuongthai.com</strong> chạy trên một VPS: nhiều người dùng hơn nghĩa là chọn tay một VPS to hơn. Ở quy mô hiện tại như vậy là hợp lý. Đến ngày một máy không đủ — hoặc không chấp nhận được dù chỉ một lần khởi động lại — câu trả lời trên AWS là ASG (hoặc co giãn service của ECS, Chương 7) đứng sau ALB.</li>
  <li>Đi làm bạn sẽ nghe “scale out” (thêm máy) và “scale up” (máy to hơn). ASG là scale out; nên app phải <strong>stateless</strong>: phiên đăng nhập nằm ở Redis hoặc JWT, tệp nằm ở S3 — không nằm trên ổ đĩa của máy.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>Vì sao ASG không thay cái máy mà app đã chết?</strong> — Health check type đang là EC2; đổi sang ELB để kết quả trượt của target group được tính.</li>
  <li><strong>Vì sao bớt máy chậm hơn thêm máy?</strong> — Để tránh dao động: bớt công suất vì một lúc vắng ngắn thì lúc tải quay lại bạn phải chờ máy khởi động chậm.</li>
  <li><strong>App cần gì để co giãn ngang được?</strong> — Không giữ trạng thái tại chỗ: phiên, tệp tải lên và cache nằm ngoài máy; máy nào cũng phục vụ được mọi yêu cầu.</li>
  <li><strong>Target tracking khác step scaling thế nào?</strong> — Target tracking giữ một chỉ số quanh một giá trị bằng alarm AWS dựng sẵn; step scaling để bạn tự định ngưỡng alarm và độ lớn từng bậc.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>bash scratchpad/aws/lab/c5/52.sh</code>; đọc log của <code>asg.sh</code> từng dòng, đánh dấu mọi lần thêm máy, bớt máy và thay máy.</li>
  <li>Đổi mục tiêu từ 15 thành 60 yêu cầu/giây mỗi máy (<code>MUC_TIEU=60</code>) rồi chạy lại. Cùng mức tải đó giờ cần mấy máy?</li>
  <li>Đổi <code>NGHI_THU</code> thành 1 và thêm một đợt tải ngắn thứ hai. Đếm số máy được tạo rồi bị xoá — đó chính là “dao động”.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được từ log vì sao desired là 4 (không phải 14), vì sao bớt máy phải chờ, và đợt tải ngắn gây ra bao nhiêu lần tạo máy khi <code>NGHI_THU=1</code>.</p>
${giai('Gợi ý: phép tính', bash(`
# desired = ceil(rps / MUC_TIEU), rồi kẹp vào [MIN, MAX]
# 196 yêu cầu/giây, MUC_TIEU=15 ⇒ ceil(13,07) = 14 ⇒ kẹp ⇒ 4
# 196 yêu cầu/giây, MUC_TIEU=60 ⇒ ceil(3,27)  = 4  ⇒ 4
# 118 yêu cầu/giây, MUC_TIEU=60 ⇒ ceil(1,97)  = 2  ⇒ 2  (vòng đầu chưa thêm máy)
MUC_TIEU=60 VONG=26 bash scratchpad/aws/lab/c5/asg.sh`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Auto Scaling group</span><span class="v">Giữ N máy từ một launch template trải trên các AZ; thay máy ốm.</span></div>
  <div class="kv"><span class="k">Desired capacity</span><span class="v">Số máy nhóm đang nhắm tới lúc này, nằm giữa min và max.</span></div>
  <div class="kv"><span class="k">Target tracking</span><span class="v">Chính sách giữ một chỉ số quanh giá trị mục tiêu bằng alarm AWS dựng sẵn.</span></div>
  <div class="kv"><span class="k">Health check type ELB</span><span class="v">Tính cả health check của target group, không chỉ trạng thái máy ảo.</span></div>
  <div class="kv"><span class="k">Grace period</span><span class="v">Khoảng thời gian sau khi máy lên mà kết quả kiểm hỏng bị bỏ qua.</span></div>
  <div class="kv"><span class="k">Instance refresh</span><span class="v">Thay máy theo từng đợt sang phiên bản launch template mới.</span></div>
  <div class="kv"><span class="k">Warm pool</span><span class="v">Máy khởi tạo sẵn đang stop, vào nhóm nhanh hơn máy mới tinh.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">Không giữ dữ liệu người dùng trên máy — điều kiện để co giãn ngang.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>ASG = launch template + min/desired/max + subnet ở ≥ 2 AZ; dịch vụ miễn phí, máy thì không.</li>
  <li>Đứng sau ALB thì dùng health check type ELB và grace period.</li>
  <li>Target tracking là chính sách mặc định; thêm máy nhanh, bớt máy chậm.</li>
  <li>Max là trần chi phí — đi kèm WAF và cảnh báo ngân sách.</li>
  <li>Chỉ app stateless mới co giãn ngang gọn gàng.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html', '📈', 'Tài liệu AWS — Chính sách target tracking', 'Alarm được dựng thế nào và vì sao bớt máy thận trọng.')}
${tl('https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud', '🎮', 'Google Cloud — Đưa Pokémon GO vào đời thật (2016)', 'Ngày ra mắt với lưu lượng gấp 50 lần dự tính.')}

<h3>Nguồn</h3>
<ul>
  <li>EC2 Auto Scaling là gì: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html</a></li>
  <li>Target tracking: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html</a></li>
  <li>Health check (EC2 so với ELB): <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html</a></li>
  <li>Grace period: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-check-grace-period.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-check-grace-period.html</a></li>
  <li>Chính sách chọn máy để terminate: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-termination-policies.html</a></li>
  <li>Warm pool: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html</a></li>
  <li>Instance refresh: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html</a></li>
  <li>Pokémon GO trên Google Cloud: <a href="https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud" target="_blank" rel="noopener">cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud</a></li>
</ul>
</div>
`;
/* ═════ 5.3 — Route 53 và ACM ═════ */
const L53_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 3</span>
<h2>5.3 — Route 53 and ACM: a name people can type, and the padlock in front of it</h2>
<p class="lead">Users do not type <code>labflow-alb-1.ap-southeast-1.elb.amazonaws.com</code>. They type <code>api.labflow.example</code>, and two things must happen: <strong>DNS</strong> turns that name into the load balancer's addresses, and a <strong>TLS certificate</strong> proves to the browser that the server really is <code>api.labflow.example</code>. On AWS, <strong>Route 53</strong> is the DNS service (hosted zones, records, routing policies, health checks) and <strong>ACM</strong> (AWS Certificate Manager) issues and renews certificates for free when they are used on ALB or CloudFront. This lesson configures both, then asks a real DNS server and opens a real HTTPS connection.</p>

<h3>The picture: the phone book and the ID card</h3>
<p>DNS is the <strong>phone book</strong>: you look up a name and get a number. The <strong>hosted zone</strong> is your own page in that book; the <strong>name servers</strong> are the publishers who print it; the <strong>TTL</strong> is how long people may keep a photocopy before checking the book again. The certificate is the <strong>ID card</strong> the server shows at the door: the name on it must match the name you asked for, and it must be issued by an authority your browser trusts. ACM is the office that issues the card — after checking that you own the address by asking you to put a specific note in your phone-book page (<strong>DNS validation</strong>).</p>

<h3>Record types you will actually use</h3>
<table>
  <thead><tr><th>Type</th><th>Points to</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td><strong>A / AAAA</strong></td><td>IPv4 / IPv6 address</td><td>For machines with fixed IPs (rare on AWS)</td></tr>
    <tr><td><strong>CNAME</strong></td><td>Another name</td><td>Not allowed at the zone apex (<code>labflow.example</code> itself), not alongside other records of the same name</td></tr>
    <tr><td><strong>Alias</strong> (Route 53 only)</td><td>An AWS resource: ALB, CloudFront, S3 website, another record</td><td>Answers as A/AAAA, works at the apex, follows the resource's changing IPs, queries to AWS resources are free</td></tr>
    <tr><td><strong>MX / TXT</strong></td><td>Mail servers / free text</td><td>Email (SPF, DKIM), domain verification</td></tr>
    <tr><td><strong>NS / SOA</strong></td><td>The zone's name servers / zone metadata</td><td>Created with the zone — do not delete</td></tr>
  </tbody>
</table>

<h3>See it running (1): Route 53 and ACM API</h3>
<p>This ran on LocalStack 4.12 (both services are in its free edition). It builds a zone with an alias to the ALB, a CNAME, a record with a short TTL, a 90/10 weighted pair for a canary release, a failover pair with a health check, and a certificate validated through DNS.</p>
${OUT_53_DNS_API}
${OUT_53_DINH_ZONE}
<ul>
  <li>The zone comes with four name servers in four top-level domains (<code>.com .net .org .co.uk</code>) — if one TLD has trouble, the others still answer. At your registrar you set exactly these four as the domain's NS.</li>
  <li><strong>LocalStack differs from AWS here twice.</strong> It accepted a CNAME at the apex <code>labflow.example</code>; real Route 53 rejects that change batch (<code>InvalidChangeBatch</code>) because the DNS standard forbids a CNAME next to the NS and SOA records every apex has. The fix shown — delete it, create an <strong>alias A</strong> at the apex — is the real answer. And it issued the certificate instantly; real ACM stays <code>PENDING_VALIDATION</code> until it sees the CNAME record (usually minutes) and only then becomes <code>ISSUED</code>.</li>
  <li>Keep the ACM validation CNAME in the zone forever: ACM renews the certificate automatically before it expires, and renewal re-checks that record.</li>
</ul>

<h3>See it running (2): asking a real DNS server</h3>
<p>The records were copied out of Route 53 (<code>list-resource-record-sets</code>) into a zone file served by CoreDNS 1.12 — the authoritative server — and a second CoreDNS plays your ISP's caching resolver. Alias records become plain A records pointing at the “ALB”, exactly what Route 53 answers.</p>
${OUT_53_DNS_THAT_A}
<ul>
  <li>The apex alias and <code>api</code> both answer <strong>A 10.145.0.10</strong> — users never see that an alias exists. <code>www</code> is a CNAME, so the answer contains two steps.</li>
  <li><code>app</code> (failover) returns the primary. When its health check fails, Route 53 answers with the secondary — CoreDNS has no health checks, so the lab shows only the primary.</li>
  <li>A name that does not exist gets <strong>NXDOMAIN</strong> — the classic “typo in the hostname” error message.</li>
</ul>
${OUT_53_DNS_THAT_B}
<ol>
  <li><strong>Weighted 90/10:</strong> 173 vs 27 out of 200 — roughly 90/10 (87/13 on this run). That is a canary release by DNS: 10% of new resolutions go to the new version. (CoreDNS reorders the answer; Route 53 returns one record per query — same effect.)</li>
  <li><strong>TTL counts down</strong> at the resolver: 30, then 25 five seconds later.</li>
  <li><strong>“DNS propagation” is just caching:</strong> right after the change, the authoritative server already said <code>10.145.1.51</code>, but the resolver kept <code>10.145.1.50</code> for the rest of its TTL (21 s left), then switched. Before a planned migration, lower the TTL a day ahead; raise it again afterwards.</li>
</ol>

<h3>See it running (3): HTTPS with a certificate</h3>
<p>The “ALB” now has two listeners: port 80 only redirects, port 443 terminates TLS with a certificate for <code>api.labflow.example</code> (+ <code>www</code> as a subject alternative name). A lab CA signed it with <code>openssl</code> — ACM does the same job with Amazon's CA, which every browser already trusts.</p>
${OUT_53_HTTPS_THAT}
<ol>
  <li>HTTP gets <strong>301</strong> to the same URL with <code>https://</code> — on an ALB: listener 80 with a <code>redirect</code> action.</li>
  <li>Without trusting the issuer, curl refuses (exit 60). With ACM this never happens to users, because Amazon's root CA is in every browser — it only happens when someone uses a self-signed certificate.</li>
  <li>Both names on the certificate work; the raw IP fails with “no alternative certificate subject name matches” — certificates are bound to <strong>names</strong>, which is one more reason to always use DNS.</li>
  <li>The connection uses TLS 1.3; the response carries <code>Strict-Transport-Security</code> so browsers refuse plain HTTP for a year.</li>
</ol>

<h3>ACM in practice</h3>
<ul>
  <li><strong>Free</strong> public certificates for services integrated with ACM (ALB, CloudFront, API Gateway). Private key never leaves AWS — you cannot copy it to a VPS. Since June 2025 ACM can also issue <em>exportable</em> public certificates for use anywhere, for a fee.</li>
  <li><strong>Region matters:</strong> the certificate must be in the same region as the ALB; for CloudFront it must be in <code>us-east-1</code>.</li>
  <li><strong>Auto-renewal</strong> works as long as the validation CNAME stays and the certificate is in use. An expired certificate is one of the most common self-inflicted outages in the industry — ACM removes that whole class of incident.</li>
</ul>
<p>Prices (Price List): hosted zone 0.50 USD/month (first 25), standard queries 0.40 USD per million, queries to alias records pointing at AWS resources free, health check of an AWS endpoint 0.50 USD/month.</p>

<h3>🔓 Hacker's view: when DNS itself is the target</h3>
<ul>
  <li><strong>BGP hijack of Route 53 (24 April 2018).</strong> Attackers announced Amazon's DNS address ranges from another network for about two hours. Some resolvers asked the fake servers, which answered <code>myetherwallet.com</code> with a phishing site; users who clicked through the certificate warning lost cryptocurrency. Lessons: never click through a certificate warning; DNSSEC and RPKI exist to make such hijacks detectable.</li>
  <li><strong>DDoS on Route 53 (22 October 2019).</strong> For several hours a flood against Route 53's name servers made some lookups fail — sites were up, but users could not find them. DNS is part of your availability.</li>
  <li><strong>Dangling DNS / subdomain takeover.</strong> You delete an S3 website bucket or a CloudFront distribution but leave the CNAME. Someone creates a resource with the same name and now serves content on your subdomain, with your cookies' domain. Delete DNS records <em>together with</em> the resources (Terraform does this naturally), and prefer alias records, which fail closed.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>cuongthai.com</strong> keeps its DNS at Cloudflare, and its media sub-domain only works because of records living there. Moving the name servers without first rebuilding every record would take that sub-domain dark — DNS changes deserve a checklist and a TTL plan, whoever hosts them.</li>
  <li>“DNS propagation takes 48 hours” is a myth that hides a real fact: old answers live as long as their TTL (and the parent zone's NS TTL, often 2 days). Plan with TTLs, not with prayers.</li>
  <li>At work, a new environment usually gets <code>api.staging.company.com</code>: a hosted zone per environment, an ACM certificate per name, an alias per load balancer — all in Terraform (Chapter 11).</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>Alias vs CNAME?</strong> — Alias is Route 53-specific, works at the zone apex, points to AWS resources, answers as A/AAAA and is free to query; CNAME points to any name but not at the apex.</li>
  <li><strong>Name three Route 53 routing policies.</strong> — Simple, weighted (canary), latency, failover (with health checks), geolocation, geoproximity, multivalue, IP-based.</li>
  <li><strong>How does ACM prove you own the domain?</strong> — DNS validation: a CNAME it gives you must appear in your zone; keep it for auto-renewal.</li>
  <li><strong>We changed the record but some users still hit the old server — why?</strong> — Resolvers cache the old answer until its TTL expires; lower TTL before planned changes.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>bash scratchpad/aws/lab/c5/53.sh</code>.</li>
  <li>Change the canary weights to 50/50 with <code>change-resource-record-sets</code>, re-export the zone and count 200 answers again.</li>
  <li>Issue a second certificate for <code>admin.labflow.example</code> only and show the error curl gives when you call <code>https://admin.labflow.example</code> while the ALB still presents the old certificate.</li>
</ol>
<p><strong>Pass when:</strong> the counts are close to 100/100, and you can read the exact curl error that proves the certificate name does not match.</p>
${giai('Hint: weights and a name that is not on the certificate', bash(`
# UPSERT both weighted records with Weight 50 (same SetIdentifier as before)
aws route53 change-resource-record-sets --hosted-zone-id $ZI --change-batch file://w50.json
# admin is not in the certificate's SAN list:
curl -sS --cacert ca.pem --resolve admin.labflow.example:443:10.145.0.10 https://admin.labflow.example/
# curl: (60) SSL: no alternative certificate subject name matches target host name 'admin.labflow.example'`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hosted zone</span><span class="v">Your set of DNS records for one domain in Route 53, with its own name servers.</span></div>
  <div class="kv"><span class="k">Alias record</span><span class="v">Route 53 record pointing to an AWS resource; allowed at the apex.</span></div>
  <div class="kv"><span class="k">Zone apex</span><span class="v">The bare domain (labflow.example) — no CNAME allowed there.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Seconds a resolver may cache an answer.</span></div>
  <div class="kv"><span class="k">Routing policy</span><span class="v">How Route 53 chooses among records: weighted, latency, failover…</span></div>
  <div class="kv"><span class="k">ACM</span><span class="v">AWS Certificate Manager: free public certificates for ALB/CloudFront, renewed automatically.</span></div>
  <div class="kv"><span class="k">DNS validation</span><span class="v">Proving domain ownership by publishing a CNAME ACM gives you.</span></div>
  <div class="kv"><span class="k">SAN</span><span class="v">Subject alternative names: every host name a certificate is valid for.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Route 53 hosts your zone; set its four NS at the registrar.</li>
  <li>Use alias records for ALB/CloudFront, including at the apex.</li>
  <li>Weighted, failover and latency policies turn DNS into a traffic tool; TTL decides how fast changes reach users.</li>
  <li>ACM gives free, auto-renewed certificates — keep the validation CNAME; CloudFront needs us-east-1.</li>
  <li>Port 80 only redirects; HSTS keeps browsers on HTTPS.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html', '🧭', 'AWS docs — Choosing a routing policy', 'Simple, weighted, latency, failover, geolocation and more.')}
${tl('https://blog.cloudflare.com/bgp-leaks-and-crypto-currencies/', '🛰️', 'Cloudflare — BGP leaks and cryptocurrencies (2018)', 'How Route 53 address space was hijacked for two hours.')}

<h3>Sources</h3>
<ul>
  <li>What is Route 53: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html</a></li>
  <li>Alias vs non-alias, zone apex: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html</a></li>
  <li>Routing policies: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html</a></li>
  <li>DNS failover: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html</a></li>
  <li>Record types: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html</a></li>
  <li>ACM overview, DNS validation, managed renewal: <a href="https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html" target="_blank" rel="noopener">docs.aws.amazon.com/acm/latest/userguide/acm-overview.html</a> · <a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" target="_blank" rel="noopener">dns-validation.html</a> · <a href="https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html" target="_blank" rel="noopener">managed-renewal.html</a></li>
  <li>Exportable public certificates (06/2025): <a href="https://aws.amazon.com/about-aws/whats-new/2025/06/aws-certificate-manager-public-certificates-use-anywhere/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2025/06/aws-certificate-manager-public-certificates-use-anywhere/</a></li>
  <li>Route 53 / ACM pricing: <a href="https://aws.amazon.com/route53/pricing/" target="_blank" rel="noopener">aws.amazon.com/route53/pricing/</a> · <a href="https://aws.amazon.com/certificate-manager/pricing/" target="_blank" rel="noopener">aws.amazon.com/certificate-manager/pricing/</a></li>
  <li>BGP hijack 2018: <a href="https://blog.cloudflare.com/bgp-leaks-and-crypto-currencies/" target="_blank" rel="noopener">blog.cloudflare.com/bgp-leaks-and-crypto-currencies/</a></li>
  <li>Route 53 DDoS 2019: <a href="https://www.theregister.com/2019/10/22/aws_dns_ddos/" target="_blank" rel="noopener">theregister.com/2019/10/22/aws_dns_ddos/</a></li>
  <li>CoreDNS loadbalance (weighted): <a href="https://coredns.io/plugins/loadbalance/" target="_blank" rel="noopener">coredns.io/plugins/loadbalance/</a></li>
</ul>
</div>
`;
const L53_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 3</span>
<h2>5.3 — Route 53 và ACM: một cái tên người dùng gõ được, và ổ khoá đứng trước nó</h2>
<p class="lead">Người dùng không gõ <code>labflow-alb-1.ap-southeast-1.elb.amazonaws.com</code>. Họ gõ <code>api.labflow.example</code>, và hai việc phải xảy ra: <strong>DNS</strong> đổi cái tên đó thành địa chỉ của bộ cân bằng tải, và một <strong>chứng chỉ TLS</strong> chứng minh với trình duyệt rằng máy chủ đúng là <code>api.labflow.example</code>. Trên AWS, <strong>Route 53</strong> là dịch vụ DNS (hosted zone, bản ghi, chính sách định tuyến, health check) còn <strong>ACM</strong> (AWS Certificate Manager) cấp và gia hạn chứng chỉ miễn phí khi dùng trên ALB hay CloudFront. Bài này cấu hình cả hai, rồi hỏi một máy chủ DNS thật và mở một kết nối HTTPS thật.</p>

<h3>Hình dung: danh bạ điện thoại và căn cước</h3>
<p>DNS là <strong>danh bạ</strong>: tra một cái tên, nhận một con số. <strong>Hosted zone</strong> là trang riêng của bạn trong danh bạ; <strong>name server</strong> là nhà in danh bạ; <strong>TTL</strong> là người ta được giữ bản photo bao lâu trước khi phải tra lại. Chứng chỉ là <strong>căn cước</strong> máy chủ đưa ra ở cửa: tên trên đó phải khớp tên bạn hỏi, và phải do cơ quan mà trình duyệt tin cấp. ACM là cơ quan cấp căn cước — sau khi kiểm bạn đúng là chủ địa chỉ bằng cách bảo bạn ghi một dòng đặc biệt vào trang danh bạ của mình (<strong>xác thực qua DNS</strong>).</p>

<h3>Các loại bản ghi bạn sẽ thật sự dùng</h3>
<table>
  <thead><tr><th>Loại</th><th>Trỏ tới</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td><strong>A / AAAA</strong></td><td>Địa chỉ IPv4 / IPv6</td><td>Cho máy có IP cố định (hiếm trên AWS)</td></tr>
    <tr><td><strong>CNAME</strong></td><td>Một tên khác</td><td>Không được đặt ở đỉnh zone (chính <code>labflow.example</code>), không được đứng cùng bản ghi khác trùng tên</td></tr>
    <tr><td><strong>Alias</strong> (chỉ Route 53 có)</td><td>Một tài nguyên AWS: ALB, CloudFront, S3 website, bản ghi khác</td><td>Trả lời dưới dạng A/AAAA, đặt được ở đỉnh, tự theo IP thay đổi của tài nguyên, truy vấn tới tài nguyên AWS miễn phí</td></tr>
    <tr><td><strong>MX / TXT</strong></td><td>Máy chủ thư / chữ tự do</td><td>Email (SPF, DKIM), xác minh tên miền</td></tr>
    <tr><td><strong>NS / SOA</strong></td><td>Name server của zone / thông tin của zone</td><td>Tạo sẵn cùng zone — đừng xoá</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật (1): API của Route 53 và ACM</h3>
<p>Phần này chạy trên LocalStack 4.12 (cả hai dịch vụ có trong bản miễn phí). Nó dựng một zone gồm alias tới ALB, một CNAME, một bản ghi TTL ngắn, cặp weighted 90/10 cho bản canary, cặp failover có health check, và một chứng chỉ xác thực qua DNS.</p>
${OUT_53_DNS_API}
${OUT_53_DINH_ZONE}
<ul>
  <li>Zone đi kèm bốn name server ở bốn tên miền cấp cao (<code>.com .net .org .co.uk</code>) — một tên miền cấp cao trục trặc thì ba cái kia vẫn trả lời. Ở nhà đăng ký tên miền, bạn khai đúng bốn cái này làm NS của tên miền.</li>
  <li><strong>LocalStack khác AWS hai chỗ ở đây.</strong> Nó nhận CNAME ở đỉnh <code>labflow.example</code>; Route 53 thật từ chối cả lô thay đổi đó (<code>InvalidChangeBatch</code>) vì chuẩn DNS cấm CNAME đứng cạnh bản ghi NS và SOA mà đỉnh zone nào cũng có. Cách sửa trong bài — xoá nó, tạo <strong>alias A</strong> ở đỉnh — là đáp án thật. Và nó cấp chứng chỉ ngay lập tức; ACM thật nằm ở <code>PENDING_VALIDATION</code> cho tới khi thấy bản ghi CNAME (thường vài phút) rồi mới thành <code>ISSUED</code>.</li>
  <li>Giữ CNAME xác thực của ACM trong zone mãi mãi: ACM tự gia hạn chứng chỉ trước khi hết hạn, và lần gia hạn kiểm lại đúng bản ghi đó.</li>
</ul>

<h3>Xem chạy thật (2): hỏi một máy chủ DNS thật</h3>
<p>Các bản ghi được chép ra khỏi Route 53 (<code>list-resource-record-sets</code>) thành tệp zone cho CoreDNS 1.12 phục vụ — máy chủ có thẩm quyền — còn một CoreDNS thứ hai đóng vai resolver có cache của nhà mạng. Bản ghi alias thành bản ghi A thường trỏ tới “ALB”, đúng như cách Route 53 trả lời.</p>
${OUT_53_DNS_THAT_A}
<ul>
  <li>Alias ở đỉnh và <code>api</code> đều trả <strong>A 10.145.0.10</strong> — người dùng không bao giờ thấy alias tồn tại. <code>www</code> là CNAME nên câu trả lời có hai bước.</li>
  <li><code>app</code> (failover) trả bản chính. Khi health check của nó hỏng, Route 53 trả bản dự phòng — CoreDNS không có health check nên lab chỉ thấy bản chính.</li>
  <li>Tên không tồn tại nhận <strong>NXDOMAIN</strong> — thông báo lỗi kinh điển của “gõ nhầm tên máy”.</li>
</ul>
${OUT_53_DNS_THAT_B}
<ol>
  <li><strong>Weighted 90/10:</strong> 173 so với 27 trên 200 lần — xấp xỉ 90/10 (lần chạy này 87/13). Đó là phát hành canary bằng DNS: 10% lượt phân giải mới đi tới bản mới. (CoreDNS xếp lại thứ tự câu trả lời; Route 53 trả một bản ghi mỗi lần hỏi — hiệu quả như nhau.)</li>
  <li><strong>TTL đếm ngược</strong> ở resolver: 30, năm giây sau còn 25.</li>
  <li><strong>“DNS lan truyền” thực chất chỉ là cache:</strong> ngay sau khi sửa, máy chủ có thẩm quyền đã nói <code>10.145.1.51</code>, nhưng resolver vẫn giữ <code>10.145.1.50</code> cho hết TTL còn lại (21 giây), rồi mới đổi. Trước một lần chuyển máy có kế hoạch, hạ TTL từ hôm trước; xong việc thì nâng lại.</li>
</ol>

<h3>Xem chạy thật (3): HTTPS có chứng chỉ</h3>
<p>“ALB” giờ có hai listener: cổng 80 chỉ chuyển hướng, cổng 443 giải mã TLS bằng chứng chỉ cho <code>api.labflow.example</code> (+ <code>www</code> làm tên thay thế). Một CA của lab ký nó bằng <code>openssl</code> — ACM làm đúng việc đó bằng CA của Amazon, thứ mọi trình duyệt đã tin sẵn.</p>
${OUT_53_HTTPS_THAT}
<ol>
  <li>HTTP nhận <strong>301</strong> sang đúng URL đó với <code>https://</code> — trên ALB: listener 80 với hành động <code>redirect</code>.</li>
  <li>Chưa tin bên cấp thì curl từ chối (mã thoát 60). Với ACM, người dùng không bao giờ gặp cảnh này vì CA gốc của Amazon có sẵn trong mọi trình duyệt — chỉ gặp khi ai đó dùng chứng chỉ tự ký.</li>
  <li>Cả hai tên trên chứng chỉ đều chạy; gọi bằng IP trần thì lỗi “no alternative certificate subject name matches” — chứng chỉ gắn với <strong>tên</strong>, thêm một lý do để luôn dùng DNS.</li>
  <li>Kết nối dùng TLS 1.3; câu trả lời mang <code>Strict-Transport-Security</code> để trình duyệt từ chối HTTP thường trong một năm.</li>
</ol>

<h3>ACM khi làm thật</h3>
<ul>
  <li>Chứng chỉ công khai <strong>miễn phí</strong> cho các dịch vụ tích hợp với ACM (ALB, CloudFront, API Gateway). Khoá riêng không bao giờ rời AWS — bạn không chép được nó sang VPS. Từ tháng 6/2025, ACM còn cấp được chứng chỉ công khai <em>xuất ra được</em> để dùng ở bất cứ đâu, có tính phí.</li>
  <li><strong>Region quan trọng:</strong> chứng chỉ phải cùng region với ALB; với CloudFront thì phải ở <code>us-east-1</code>.</li>
  <li><strong>Tự gia hạn</strong> chạy được chừng nào CNAME xác thực còn đó và chứng chỉ đang được dùng. Chứng chỉ hết hạn là một trong những kiểu sự cố tự gây ra phổ biến nhất ngành — ACM xoá sổ cả nhóm sự cố đó.</li>
</ul>
<p>Giá (Price List): hosted zone 0,50 USD/tháng (25 zone đầu), truy vấn thường 0,40 USD mỗi triệu, truy vấn tới bản ghi alias trỏ vào tài nguyên AWS miễn phí, health check tới endpoint AWS 0,50 USD/tháng.</p>

<h3>🔓 Góc hacker: khi chính DNS là mục tiêu</h3>
<ul>
  <li><strong>Chiếm BGP của Route 53 (24/4/2018).</strong> Kẻ tấn công quảng bá dải địa chỉ DNS của Amazon từ một mạng khác trong khoảng hai giờ. Một số resolver hỏi nhầm máy chủ giả, và máy chủ giả trả <code>myetherwallet.com</code> về một trang lừa đảo; ai bấm bỏ qua cảnh báo chứng chỉ thì mất tiền mã hoá. Bài học: không bao giờ bấm bỏ qua cảnh báo chứng chỉ; DNSSEC và RPKI sinh ra để phát hiện được kiểu chiếm này.</li>
  <li><strong>DDoS vào Route 53 (22/10/2019).</strong> Trong nhiều giờ, một trận lũ nhắm vào name server của Route 53 làm một số lượt tra cứu thất bại — web vẫn sống, nhưng người dùng không tìm thấy nó. DNS là một phần độ sẵn sàng của bạn.</li>
  <li><strong>DNS treo / chiếm tên miền con.</strong> Bạn xoá bucket S3 website hay distribution CloudFront nhưng để quên CNAME. Ai đó tạo tài nguyên trùng tên và giờ phát nội dung trên tên miền con của bạn, dưới miền cookie của bạn. Xoá bản ghi DNS <em>cùng lúc</em> với tài nguyên (Terraform tự làm vậy), và ưu tiên bản ghi alias, loại này hỏng thì đóng lại chứ không trỏ bậy.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>cuongthai.com</strong> để DNS ở Cloudflare, và tên miền con media chỉ chạy được nhờ các bản ghi nằm ở đó. Chuyển name server mà không dựng lại đủ mọi bản ghi trước thì tên miền con đó tắt ngay — thay đổi DNS cần danh sách kiểm và kế hoạch TTL, dù ai đang giữ DNS.</li>
  <li>“DNS lan truyền mất 48 giờ” là một huyền thoại che một sự thật: câu trả lời cũ sống bằng đúng TTL của nó (và TTL của bản ghi NS ở zone cha, thường 2 ngày). Lên kế hoạch bằng TTL, đừng bằng cầu nguyện.</li>
  <li>Đi làm, một môi trường mới thường có <code>api.staging.company.com</code>: mỗi môi trường một hosted zone, mỗi tên một chứng chỉ ACM, mỗi bộ cân bằng tải một alias — tất cả viết bằng Terraform (Chương 11).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>Alias khác CNAME thế nào?</strong> — Alias là của riêng Route 53, đặt được ở đỉnh zone, trỏ vào tài nguyên AWS, trả lời dạng A/AAAA và truy vấn miễn phí; CNAME trỏ tới tên bất kỳ nhưng không đặt được ở đỉnh.</li>
  <li><strong>Kể ba chính sách định tuyến của Route 53.</strong> — Simple, weighted (canary), latency, failover (kèm health check), geolocation, geoproximity, multivalue, IP-based.</li>
  <li><strong>ACM kiểm bạn sở hữu tên miền bằng cách nào?</strong> — Xác thực DNS: một CNAME nó đưa phải xuất hiện trong zone của bạn; giữ nó để tự gia hạn.</li>
  <li><strong>Đã sửa bản ghi mà vài người dùng vẫn vào máy cũ — vì sao?</strong> — Resolver cache câu trả lời cũ cho tới hết TTL; hạ TTL trước những thay đổi có kế hoạch.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>bash scratchpad/aws/lab/c5/53.sh</code>.</li>
  <li>Đổi trọng số canary thành 50/50 bằng <code>change-resource-record-sets</code>, xuất lại zone và đếm lại 200 câu trả lời.</li>
  <li>Xin chứng chỉ thứ hai chỉ cho <code>admin.labflow.example</code> và cho thấy lỗi curl báo khi gọi <code>https://admin.labflow.example</code> trong lúc ALB vẫn đưa chứng chỉ cũ.</li>
</ol>
<p><strong>Đạt khi:</strong> số đếm sát 100/100, và bạn đọc được đúng dòng lỗi curl chứng minh tên trên chứng chỉ không khớp.</p>
${giai('Gợi ý: trọng số và một tên không có trên chứng chỉ', bash(`
# UPSERT cả hai bản ghi weighted với Weight 50 (giữ SetIdentifier như cũ)
aws route53 change-resource-record-sets --hosted-zone-id $ZI --change-batch file://w50.json
# admin không có trong danh sách SAN của chứng chỉ:
curl -sS --cacert ca.pem --resolve admin.labflow.example:443:10.145.0.10 https://admin.labflow.example/
# curl: (60) SSL: no alternative certificate subject name matches target host name 'admin.labflow.example'`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hosted zone</span><span class="v">Bộ bản ghi DNS của một tên miền trong Route 53, có name server riêng.</span></div>
  <div class="kv"><span class="k">Bản ghi alias</span><span class="v">Bản ghi Route 53 trỏ vào tài nguyên AWS; đặt được ở đỉnh zone.</span></div>
  <div class="kv"><span class="k">Đỉnh zone (apex)</span><span class="v">Tên miền trần (labflow.example) — không được đặt CNAME ở đó.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Số giây resolver được cache một câu trả lời.</span></div>
  <div class="kv"><span class="k">Chính sách định tuyến</span><span class="v">Cách Route 53 chọn giữa các bản ghi: weighted, latency, failover…</span></div>
  <div class="kv"><span class="k">ACM</span><span class="v">AWS Certificate Manager: chứng chỉ công khai miễn phí cho ALB/CloudFront, tự gia hạn.</span></div>
  <div class="kv"><span class="k">Xác thực DNS</span><span class="v">Chứng minh sở hữu tên miền bằng cách đăng một CNAME do ACM đưa.</span></div>
  <div class="kv"><span class="k">SAN</span><span class="v">Subject alternative names: mọi tên máy mà chứng chỉ có hiệu lực.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Route 53 giữ zone của bạn; khai bốn NS của nó ở nhà đăng ký tên miền.</li>
  <li>Dùng bản ghi alias cho ALB/CloudFront, kể cả ở đỉnh zone.</li>
  <li>Weighted, failover, latency biến DNS thành công cụ điều phối lưu lượng; TTL quyết định thay đổi tới người dùng nhanh đến đâu.</li>
  <li>ACM cho chứng chỉ miễn phí, tự gia hạn — giữ CNAME xác thực; CloudFront cần us-east-1.</li>
  <li>Cổng 80 chỉ chuyển hướng; HSTS giữ trình duyệt ở HTTPS.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html', '🧭', 'Tài liệu AWS — Chọn chính sách định tuyến', 'Simple, weighted, latency, failover, geolocation và hơn nữa.')}
${tl('https://blog.cloudflare.com/bgp-leaks-and-crypto-currencies/', '🛰️', 'Cloudflare — BGP leaks and cryptocurrencies (2018)', 'Dải địa chỉ của Route 53 bị chiếm hai giờ như thế nào.')}

<h3>Nguồn</h3>
<ul>
  <li>Route 53 là gì: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html</a></li>
  <li>Alias và không alias, đỉnh zone: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html</a></li>
  <li>Chính sách định tuyến: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html</a></li>
  <li>DNS failover: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html</a></li>
  <li>Các loại bản ghi: <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html" target="_blank" rel="noopener">docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html</a></li>
  <li>ACM tổng quan, xác thực DNS, tự gia hạn: <a href="https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html" target="_blank" rel="noopener">docs.aws.amazon.com/acm/latest/userguide/acm-overview.html</a> · <a href="https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html" target="_blank" rel="noopener">dns-validation.html</a> · <a href="https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html" target="_blank" rel="noopener">managed-renewal.html</a></li>
  <li>Chứng chỉ công khai xuất ra được (06/2025): <a href="https://aws.amazon.com/about-aws/whats-new/2025/06/aws-certificate-manager-public-certificates-use-anywhere/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2025/06/aws-certificate-manager-public-certificates-use-anywhere/</a></li>
  <li>Giá Route 53 / ACM: <a href="https://aws.amazon.com/route53/pricing/" target="_blank" rel="noopener">aws.amazon.com/route53/pricing/</a> · <a href="https://aws.amazon.com/certificate-manager/pricing/" target="_blank" rel="noopener">aws.amazon.com/certificate-manager/pricing/</a></li>
  <li>Chiếm BGP 2018: <a href="https://blog.cloudflare.com/bgp-leaks-and-crypto-currencies/" target="_blank" rel="noopener">blog.cloudflare.com/bgp-leaks-and-crypto-currencies/</a></li>
  <li>DDoS Route 53 năm 2019: <a href="https://www.theregister.com/2019/10/22/aws_dns_ddos/" target="_blank" rel="noopener">theregister.com/2019/10/22/aws_dns_ddos/</a></li>
  <li>CoreDNS loadbalance (weighted): <a href="https://coredns.io/plugins/loadbalance/" target="_blank" rel="noopener">coredns.io/plugins/loadbalance/</a></li>
</ul>
</div>
`;
/* ═════ 5.4 — CloudFront ═════ */
const L54_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 4</span>
<h2>5.4 — CloudFront: a copy of your files a few milliseconds from every user</h2>
<p class="lead">Your ALB and machines live in one region. A user in Hanoi talking to Singapore pays a round trip of tens of milliseconds for every file; a user in Europe pays far more. A <strong>CDN</strong> (content delivery network) keeps copies of your responses in hundreds of <strong>edge locations</strong> near users, so repeat requests never travel to your <strong>origin</strong>. CloudFront is AWS's CDN; cuongthai.com uses Cloudflare for the same job. This lesson runs a real edge cache in front of a slow origin and shows the five behaviours you must understand before you put a CDN in front of anything: hit/miss, TTL, cache key, invalidation and serving stale content when the origin is down.</p>

<h3>The picture: convenience stores and the central warehouse</h3>
<p>A chain keeps its stock in one <strong>central warehouse</strong> (the origin). Each neighbourhood has a small <strong>store</strong> (edge location). The first customer asking for a product waits while the store orders it from the warehouse (<strong>MISS</strong>); the next ten customers get it from the shelf at once (<strong>HIT</strong>). Fresh milk carries a use-by date (<strong>TTL</strong>, from <code>Cache-Control: max-age</code>). When the recipe changes, head office either tells every store to throw the old stock away (<strong>invalidation</strong>) or simply ships the new product under a new barcode (<strong>versioned file name</strong>). And personal parcels — your bank statement — are never put on the shelf (<strong>do not cache private API responses</strong>).</p>

<h3>How a CloudFront distribution is put together</h3>
<table>
  <thead><tr><th>Piece</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><strong>Distribution</strong></td><td>One CDN configuration with a name like <code>d111111abcdef8.cloudfront.net</code>; your domain points to it with a Route 53 alias</td></tr>
    <tr><td><strong>Origin</strong></td><td>Where misses go: an S3 bucket, an ALB, any HTTP server</td></tr>
    <tr><td><strong>Cache behavior</strong></td><td>Per path pattern (<code>/static/*</code>, <code>/api/*</code>): which origin, which cache policy, HTTP→HTTPS, allowed methods</td></tr>
    <tr><td><strong>Cache policy</strong></td><td>TTLs and the <strong>cache key</strong> (which headers, cookies, query strings make two requests “different”). <code>CachingOptimized</code> ignores query strings and cookies; <code>CachingDisabled</code> for APIs</td></tr>
    <tr><td><strong>Origin access control (OAC)</strong></td><td>CloudFront signs requests to a private S3 bucket; the bucket policy accepts only this distribution</td></tr>
  </tbody>
</table>

<h3>See it running (1): the CloudFront API</h3>
<p>CloudFront is not in LocalStack's free edition; this ran on Moto (configuration only). The pattern — private bucket + OAC + bucket policy bound to one distribution — is the standard way to serve static files from S3.</p>
${OUT_54_CDN_API}
<ul>
  <li>The bucket stays private (Block Public Access on, lesson 2.3). The policy allows <code>s3:GetObject</code> only to the CloudFront service <em>and only</em> when <code>AWS:SourceArn</code> is your distribution — another customer's distribution cannot read your bucket.</li>
  <li>A new distribution is <code>InProgress</code> while it is pushed to every edge — on real AWS that takes minutes; later changes too.</li>
  <li><code>ViewerProtocolPolicy=redirect-to-https</code>: plain HTTP gets a redirect. The certificate for your own domain on CloudFront must be requested in ACM in <strong>us-east-1</strong>, whatever region your app runs in.</li>
  <li>The invalidation <code>/static/*</code> counts as one path. The first 1,000 invalidation paths per month are free.</li>
</ul>

<h3>See it running (2): a real edge cache</h3>
<p>nginx 1.27 with <code>proxy_cache</code> plays one edge location. The origin is the Node app, made 300 ms slow on purpose (an origin far away), answering static files with <code>Cache-Control: public, max-age=10, stale-if-error=60</code>. The cache key is the path only — like CloudFront's <code>CachingOptimized</code>.</p>
${MA_EDGE}
${OUT_54_CDN_THAT_A}
<ol>
  <li><strong>MISS then HIT:</strong> the first request took 0.31 s (origin), the next two under 1 ms (edge). The origin log proves it received one request for three downloads — that is the whole economics of a CDN: less origin load, less origin egress.</li>
  <li><strong>The origin refuses direct requests</strong> (403): only the edge knows the secret header. For an ALB origin, CloudFront does the same with a custom origin header plus the AWS-managed prefix list of CloudFront addresses in the ALB's security group; for S3 it is OAC. Without this, attackers find your origin and skip the CDN and its WAF.</li>
</ol>
${OUT_54_CDN_THAT_B}
<ol start="3">
  <li><strong>Cache key without the query string:</strong> <code>?v=2</code> still returned version 1 from cache. Cache busting with <code>?v=</code> only works if the query string is part of the cache key — or use a new file name.</li>
  <li><strong>TTL:</strong> after 10 s the copy is <code>EXPIRED</code>; the edge asked the origin again (0.30 s).</li>
  <li><strong>APIs are not cached:</strong> every <code>/api/</code> call reached the origin. On CloudFront: a separate behavior for <code>/api/*</code> with <code>CachingDisabled</code> and all headers/cookies forwarded.</li>
</ol>
${OUT_54_CDN_THAT_C}
<ol start="6">
  <li><strong>Invalidation vs new file name:</strong> after the origin shipped version 2, the edge kept serving version 1 until the cache was cleared (the role of <code>create-invalidation</code>). <code>app.v2.css</code> was correct at once. Front-end build tools put a content hash in every file name for exactly this reason — invalidation is then only for HTML.</li>
  <li><strong>Origin down, users still served:</strong> the origin was stopped; <code>logo.css</code>, already expired, was served as <code>STALE</code> thanks to <code>stale-if-error=60</code>. A file the edge had never seen got <strong>502</strong>. CloudFront supports <code>stale-if-error</code> and <code>stale-while-revalidate</code> the same way (since 2023).</li>
</ol>

<h3>What to cache — and what never</h3>
<table>
  <thead><tr><th>Content</th><th>Cache?</th><th>Header from origin</th></tr></thead>
  <tbody>
    <tr><td>JS/CSS/images with a hash in the name</td><td>Yes, long</td><td><code>public, max-age=31536000, immutable</code></td></tr>
    <tr><td>HTML pages</td><td>Short or revalidate</td><td><code>public, max-age=60</code> or <code>no-cache</code></td></tr>
    <tr><td>Public API lists (lab rooms)</td><td>Maybe, seconds</td><td><code>public, max-age=5</code></td></tr>
    <tr><td>Anything per user (profile, bookings, tokens)</td><td><strong>Never</strong></td><td><code>private, no-store</code></td></tr>
  </tbody>
</table>
<p>Price: the free tier includes 1 TB of data out and 10 million requests per month; beyond that you pay per GB by region of the viewer. Since November 2025 CloudFront also sells flat-rate monthly plans bundled with WAF and DDoS protection (the Pro plan is 15 USD/month) — closer to how Cloudflare sells.</p>

<h3>🔓 Hacker's view: the cache that served someone else's account</h3>
<ul>
  <li><strong>Web Cache Deception (Omer Gil, 2017).</strong> A site cached everything ending in <code>.css</code>. The attacker sent a victim the link <code>/myaccount/x.css</code>; the server ignored the fake suffix and returned the victim's account page, and the CDN cached it as a “stylesheet”. The attacker then opened the same URL and read the victim's data from the cache. Demonstrated on PayPal. Defence: cache by the <em>origin's</em> <code>Cache-Control</code>, send <code>private, no-store</code> on every personal response, and never configure a CDN to ignore origin headers for whole path patterns.</li>
  <li><strong>Origin bypass.</strong> If the origin answers anyone, attackers find its address (old DNS records, certificate logs) and attack it directly, skipping CDN and WAF. Lock the origin: OAC for S3, secret header + CloudFront prefix list for ALBs.</li>
  <li><strong>A proxy can silently erase your cache headers.</strong> A real lesson from the team behind this course: a framework set long cache headers for a folder of large 3D assets, but the reverse proxy in front replaced every <code>Cache-Control</code> with <code>no-store</code> — the setting “never worked a single day”. Always check the header the user actually receives with <code>curl -I</code>.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>cuongthai.com:</strong> Cloudflare stands in front of the site, and media (images, videos) is served from R2 through its own sub-domain — a CDN in front of an object store, the same shape as CloudFront + S3 + OAC.</li>
  <li>In job interviews “how do you make a site fast for users far away?” almost always expects: CDN for static files, correct Cache-Control, hashed file names, and keeping the API uncached.</li>
  <li>Deploy checklist with a CDN: upload new hashed assets first, then the HTML, then invalidate only <code>/index.html</code> — never the other way round, or users get HTML pointing to files that do not exist yet.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>What is a cache key and why does it matter?</strong> — The parts of a request that make a cached copy unique (path, chosen headers, cookies, query strings). Too small ⇒ users get the wrong content; too large ⇒ almost no hits.</li>
  <li><strong>How do you serve a private S3 bucket through CloudFront?</strong> — Origin access control: CloudFront signs requests; the bucket policy allows only that distribution (<code>AWS:SourceArn</code>); Block Public Access stays on.</li>
  <li><strong>Invalidation or versioned file names?</strong> — Versioned (hashed) names for assets; invalidation only for the few entry files like HTML.</li>
  <li><strong>Why must the CloudFront certificate be in us-east-1?</strong> — CloudFront is a global service whose certificates are managed from N. Virginia; ACM certificates in other regions cannot be attached.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>bash scratchpad/aws/lab/c5/54.sh</code> and read the edge log: count MISS, HIT, EXPIRED, STALE.</li>
  <li>Change the cache key to include the query string (<code>proxy_cache_key $uri$is_args$args;</code>), restart the edge and show that <code>?v=2</code> is now a MISS.</li>
  <li>Make the origin send <code>Cache-Control: no-store</code> for <code>/static/</code> (env <code>CC</code>) and show that the edge never stores it.</li>
</ol>
<p><strong>Pass when:</strong> you can predict, before running each <code>curl</code>, whether it will be HIT, MISS, EXPIRED or STALE — and you are right every time.</p>
${giai('Hint: two changes', bash(`
# edge.conf — cache key with query string
proxy_cache_key $uri$is_args$args;
docker restart aws-c5-edge
# origin that forbids caching
docker rm -f aws-c5-origin
docker run -d --name aws-c5-origin --network aws-c5-net --ip 10.145.3.10 -e TEN=origin \\
  -e DELAY=300 -e SECRET=bi-mat-chi-cdn-biet -e CC="no-store" \\
  -v $PWD/app.js:/app.js:ro node:22-bookworm-slim node /app.js
# expected: X-Cache: MISS every time`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CDN / edge location</span><span class="v">Network of caches near users; each keeps copies of responses.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">The real source behind the CDN: S3, ALB, any HTTP server.</span></div>
  <div class="kv"><span class="k">HIT / MISS / EXPIRED / STALE</span><span class="v">Served from cache / fetched from origin / refetched after TTL / old copy served because the origin failed.</span></div>
  <div class="kv"><span class="k">Cache key</span><span class="v">Request parts that make a cached object unique.</span></div>
  <div class="kv"><span class="k">TTL / max-age</span><span class="v">How long a copy counts as fresh.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">Order to drop cached copies by path before their TTL ends.</span></div>
  <div class="kv"><span class="k">OAC</span><span class="v">Origin access control: CloudFront signs requests to a private S3 bucket.</span></div>
  <div class="kv"><span class="k">Web Cache Deception</span><span class="v">Tricking a cache into storing a victim's private page under a static-looking URL.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A CDN answers repeat requests from the edge: faster for users, lighter for the origin.</li>
  <li>The origin decides with Cache-Control; the cache key decides what counts as “the same”.</li>
  <li>Hash asset names; invalidate only entry files.</li>
  <li>Never cache personal responses; lock the origin so nobody can skip the CDN.</li>
  <li>stale-if-error lets the edge keep serving while the origin is down.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html', '⏱️', 'AWS docs — How long content stays in the cache', 'TTL, Cache-Control, stale-while-revalidate and stale-if-error.')}
${tl('https://omergil.blogspot.com/2017/02/web-cache-deception-attack.html', '🕵️', 'Omer Gil — Web Cache Deception Attack (2017)', 'The original write-up, with the PayPal case.')}

<h3>Sources</h3>
<ul>
  <li>What is CloudFront: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html</a></li>
  <li>Origin access control for S3: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html</a></li>
  <li>Managed cache policies: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html</a></li>
  <li>Expiration, stale-if-error: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html</a></li>
  <li>stale-while-revalidate / stale-if-error launch (05/2023): <a href="https://aws.amazon.com/about-aws/whats-new/2023/05/amazon-cloudfront-stale-while-revalidate-stale-if-error-cache-control-directives/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2023/05/…stale-if-error…/</a></li>
  <li>Invalidation and the 1,000 free paths: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PayingForInvalidation.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PayingForInvalidation.html</a></li>
  <li>Certificates in us-east-1: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html</a></li>
  <li>Restricting access to an ALB origin: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html</a></li>
  <li>Flat-rate plans (11/2025): <a href="https://aws.amazon.com/about-aws/whats-new/2025/11/aws-flat-rate-pricing-plans/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2025/11/aws-flat-rate-pricing-plans/</a></li>
  <li>CloudFront pricing: <a href="https://aws.amazon.com/cloudfront/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudfront/pricing/</a></li>
  <li>Web Cache Deception: <a href="https://omergil.blogspot.com/2017/02/web-cache-deception-attack.html" target="_blank" rel="noopener">omergil.blogspot.com/2017/02/web-cache-deception-attack.html</a></li>
  <li>nginx proxy_cache: <a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache" target="_blank" rel="noopener">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache</a></li>
</ul>
</div>
`;
const L54_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 4</span>
<h2>5.4 — CloudFront: bản sao tệp của bạn đặt cách mọi người dùng vài mili giây</h2>
<p class="lead">ALB và các máy của bạn nằm ở một region. Người dùng ở Hà Nội gọi sang Singapore tốn một vòng đi về vài chục mili giây cho mỗi tệp; người ở châu Âu tốn hơn nhiều. <strong>CDN</strong> (mạng phân phối nội dung) giữ bản sao câu trả lời của bạn ở hàng trăm <strong>edge location</strong> gần người dùng, nên yêu cầu lặp lại không bao giờ phải đi tới <strong>origin</strong>. CloudFront là CDN của AWS; cuongthai.com dùng Cloudflare cho cùng việc đó. Bài này chạy một edge cache thật trước một origin chậm và cho thấy năm hành vi bạn phải hiểu trước khi đặt CDN trước bất cứ thứ gì: hit/miss, TTL, khoá cache, invalidation và phục vụ bản cũ khi origin sập.</p>

<h3>Hình dung: chuỗi cửa hàng tiện lợi và kho tổng</h3>
<p>Một chuỗi cửa hàng để hàng ở <strong>kho tổng</strong> (origin). Mỗi khu phố có một <strong>cửa hàng nhỏ</strong> (edge location). Khách đầu tiên hỏi một món phải chờ cửa hàng đặt từ kho (<strong>MISS</strong>); mười khách sau lấy ngay trên kệ (<strong>HIT</strong>). Sữa tươi có hạn dùng (<strong>TTL</strong>, lấy từ <code>Cache-Control: max-age</code>). Khi đổi công thức, văn phòng chính hoặc bảo mọi cửa hàng bỏ hàng cũ (<strong>invalidation</strong>), hoặc đơn giản là ra sản phẩm mới với mã vạch mới (<strong>tên tệp có phiên bản</strong>). Còn bưu kiện cá nhân — sao kê ngân hàng của bạn — không bao giờ được bày lên kệ (<strong>không cache câu trả lời API riêng tư</strong>).</p>

<h3>Một distribution CloudFront gồm những gì</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Làm gì</th></tr></thead>
  <tbody>
    <tr><td><strong>Distribution</strong></td><td>Một cấu hình CDN có tên dạng <code>d111111abcdef8.cloudfront.net</code>; tên miền của bạn trỏ vào nó bằng alias của Route 53</td></tr>
    <tr><td><strong>Origin</strong></td><td>Nơi các lần MISS tìm tới: bucket S3, ALB, máy chủ HTTP bất kỳ</td></tr>
    <tr><td><strong>Cache behavior</strong></td><td>Theo mẫu đường dẫn (<code>/static/*</code>, <code>/api/*</code>): origin nào, cache policy nào, HTTP ⇒ HTTPS, phương thức nào được phép</td></tr>
    <tr><td><strong>Cache policy</strong></td><td>TTL và <strong>khoá cache</strong> (header, cookie, query string nào làm hai yêu cầu “khác nhau”). <code>CachingOptimized</code> bỏ qua query string và cookie; <code>CachingDisabled</code> cho API</td></tr>
    <tr><td><strong>Origin access control (OAC)</strong></td><td>CloudFront ký yêu cầu gửi tới bucket S3 riêng tư; bucket policy chỉ nhận đúng distribution này</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật (1): API của CloudFront</h3>
<p>CloudFront không có trong bản miễn phí của LocalStack; phần này chạy trên Moto (chỉ cấu hình). Khuôn mẫu — bucket riêng tư + OAC + bucket policy gắn với một distribution — là cách chuẩn để phục vụ tệp tĩnh từ S3.</p>
${OUT_54_CDN_API}
<ul>
  <li>Bucket vẫn riêng tư (Block Public Access bật, bài 2.3). Policy chỉ cho dịch vụ CloudFront <code>s3:GetObject</code> <em>và chỉ khi</em> <code>AWS:SourceArn</code> là distribution của bạn — distribution của khách hàng khác không đọc được bucket của bạn.</li>
  <li>Distribution mới ở trạng thái <code>InProgress</code> trong lúc được đẩy ra mọi edge — trên AWS thật mất vài phút; mỗi lần sửa cũng vậy.</li>
  <li><code>ViewerProtocolPolicy=redirect-to-https</code>: HTTP thường bị chuyển hướng. Chứng chỉ cho tên miền riêng trên CloudFront phải xin ở ACM vùng <strong>us-east-1</strong>, dù app của bạn chạy ở region nào.</li>
  <li>Invalidation <code>/static/*</code> chỉ tính là một đường. 1.000 đường invalidation đầu tiên mỗi tháng miễn phí.</li>
</ul>

<h3>Xem chạy thật (2): một edge cache thật</h3>
<p>nginx 1.27 với <code>proxy_cache</code> đóng vai một edge location. Origin là app Node, cố tình chậm 300 ms (một origin ở xa), trả tệp tĩnh kèm <code>Cache-Control: public, max-age=10, stale-if-error=60</code>. Khoá cache chỉ là đường dẫn — giống <code>CachingOptimized</code> của CloudFront.</p>
${MA_EDGE}
${OUT_54_CDN_THAT_A}
<ol>
  <li><strong>MISS rồi HIT:</strong> lần đầu mất 0,31 giây (đi tới origin), hai lần sau dưới 1 ms (ở edge). Log của origin chứng minh nó chỉ nhận một yêu cầu cho ba lần tải — toàn bộ bài toán kinh tế của CDN nằm ở đây: origin đỡ tải, origin đỡ tiền dữ liệu ra.</li>
  <li><strong>Origin từ chối yêu cầu đi thẳng</strong> (403): chỉ edge biết header bí mật. Với origin là ALB, CloudFront làm y hệt bằng header tuỳ chỉnh cộng danh sách dải địa chỉ CloudFront do AWS quản lý (prefix list) trong security group của ALB; với S3 thì là OAC. Không làm vậy, kẻ tấn công tìm ra origin rồi đi vòng qua CDN và cả WAF của nó.</li>
</ol>
${OUT_54_CDN_THAT_B}
<ol start="3">
  <li><strong>Khoá cache không gồm query string:</strong> <code>?v=2</code> vẫn trả bản 1 từ cache. Kiểu “phá cache” bằng <code>?v=</code> chỉ chạy khi query string nằm trong khoá cache — hoặc dùng tên tệp mới.</li>
  <li><strong>TTL:</strong> sau 10 giây bản sao <code>EXPIRED</code>; edge hỏi lại origin (0,30 giây).</li>
  <li><strong>API không được cache:</strong> mọi lời gọi <code>/api/</code> đều tới origin. Trên CloudFront: một behavior riêng cho <code>/api/*</code> dùng <code>CachingDisabled</code> và chuyển đủ header/cookie.</li>
</ol>
${OUT_54_CDN_THAT_C}
<ol start="6">
  <li><strong>Invalidation so với tên tệp mới:</strong> origin đã lên bản 2, edge vẫn trả bản 1 cho tới khi cache bị xoá (vai trò của <code>create-invalidation</code>). <code>app.v2.css</code> đúng ngay lập tức. Công cụ build front-end gắn mã băm nội dung vào mọi tên tệp chính vì lý do này — invalidation khi đó chỉ còn dành cho HTML.</li>
  <li><strong>Origin sập, người dùng vẫn được phục vụ:</strong> origin đã bị dừng; <code>logo.css</code> dù hết hạn vẫn được trả dạng <code>STALE</code> nhờ <code>stale-if-error=60</code>. Tệp edge chưa từng thấy thì nhận <strong>502</strong>. CloudFront hỗ trợ <code>stale-if-error</code> và <code>stale-while-revalidate</code> theo đúng cách đó (từ 2023).</li>
</ol>

<h3>Cache gì — và cái gì không bao giờ</h3>
<table>
  <thead><tr><th>Nội dung</th><th>Cache?</th><th>Header origin gửi</th></tr></thead>
  <tbody>
    <tr><td>JS/CSS/ảnh có mã băm trong tên</td><td>Có, thật lâu</td><td><code>public, max-age=31536000, immutable</code></td></tr>
    <tr><td>Trang HTML</td><td>Ngắn hoặc hỏi lại</td><td><code>public, max-age=60</code> hoặc <code>no-cache</code></td></tr>
    <tr><td>API danh sách công khai (phòng lab)</td><td>Có thể, vài giây</td><td><code>public, max-age=5</code></td></tr>
    <tr><td>Mọi thứ theo từng người (hồ sơ, lịch đặt, token)</td><td><strong>Không bao giờ</strong></td><td><code>private, no-store</code></td></tr>
  </tbody>
</table>
<p>Giá: free tier gồm 1 TB dữ liệu ra và 10 triệu yêu cầu mỗi tháng; vượt thì trả theo GB tuỳ vùng của người xem. Từ tháng 11/2025, CloudFront còn bán gói giá cố định theo tháng kèm WAF và chống DDoS (gói Pro 15 USD/tháng) — gần với cách Cloudflare bán hàng.</p>

<h3>🔓 Góc hacker: cái cache trả tài khoản của người khác</h3>
<ul>
  <li><strong>Web Cache Deception (Omer Gil, 2017).</strong> Một trang cache mọi thứ kết thúc bằng <code>.css</code>. Kẻ tấn công gửi nạn nhân liên kết <code>/myaccount/x.css</code>; máy chủ lờ cái đuôi giả và trả trang tài khoản của nạn nhân, CDN cache nó như một “tệp CSS”. Kẻ tấn công mở đúng URL đó và đọc dữ liệu nạn nhân ngay từ cache. Đã được trình diễn trên PayPal. Cách phòng: cache theo <code>Cache-Control</code> của <em>origin</em>, gửi <code>private, no-store</code> cho mọi câu trả lời cá nhân, và đừng bao giờ cấu hình CDN lờ header của origin cho cả một mẫu đường dẫn.</li>
  <li><strong>Đi vòng origin.</strong> Origin trả lời bất kỳ ai thì kẻ tấn công tìm ra địa chỉ của nó (bản ghi DNS cũ, nhật ký chứng chỉ) và đánh thẳng vào, bỏ qua CDN lẫn WAF. Khoá origin lại: OAC cho S3, header bí mật + prefix list CloudFront cho ALB.</li>
  <li><strong>Một proxy có thể âm thầm xoá header cache của bạn.</strong> Bài học thật của chính đội làm khoá học này: framework đặt header cache dài cho cả thư mục tài nguyên 3D nặng, nhưng reverse proxy đứng trước thay mọi <code>Cache-Control</code> bằng <code>no-store</code> — thiết lập đó “chưa từng có hiệu lực ngày nào”. Luôn kiểm header người dùng thực sự nhận được bằng <code>curl -I</code>.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>cuongthai.com:</strong> Cloudflare đứng trước web, còn media (ảnh, video) đi từ R2 qua một tên miền con riêng — một CDN đứng trước một kho object, cùng hình dạng với CloudFront + S3 + OAC.</li>
  <li>Phỏng vấn hỏi “làm sao cho web nhanh với người dùng ở xa?” gần như luôn chờ câu: CDN cho tệp tĩnh, Cache-Control đúng, tên tệp có mã băm, và không cache API.</li>
  <li>Thứ tự deploy khi có CDN: đẩy tài nguyên mã băm mới trước, rồi HTML, rồi chỉ invalidate <code>/index.html</code> — làm ngược lại là người dùng nhận HTML trỏ tới tệp chưa tồn tại.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>Khoá cache là gì, vì sao quan trọng?</strong> — Những phần của yêu cầu làm một bản sao trong cache là duy nhất (đường dẫn, header, cookie, query string được chọn). Quá ít ⇒ người dùng nhận sai nội dung; quá nhiều ⇒ gần như không bao giờ HIT.</li>
  <li><strong>Phục vụ một bucket S3 riêng tư qua CloudFront thế nào?</strong> — Origin access control: CloudFront ký yêu cầu; bucket policy chỉ cho đúng distribution đó (<code>AWS:SourceArn</code>); Block Public Access vẫn bật.</li>
  <li><strong>Invalidation hay tên tệp có phiên bản?</strong> — Tên có mã băm cho tài nguyên; invalidation chỉ cho vài tệp vào cửa như HTML.</li>
  <li><strong>Vì sao chứng chỉ của CloudFront phải ở us-east-1?</strong> — CloudFront là dịch vụ toàn cầu, chứng chỉ của nó được quản lý từ N. Virginia; chứng chỉ ACM ở region khác không gắn được.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>bash scratchpad/aws/lab/c5/54.sh</code> và đọc log của edge: đếm MISS, HIT, EXPIRED, STALE.</li>
  <li>Đổi khoá cache để gồm cả query string (<code>proxy_cache_key $uri$is_args$args;</code>), khởi động lại edge và chứng minh <code>?v=2</code> giờ là MISS.</li>
  <li>Cho origin gửi <code>Cache-Control: no-store</code> cho <code>/static/</code> (biến môi trường <code>CC</code>) và chứng minh edge không bao giờ lưu nó.</li>
</ol>
<p><strong>Đạt khi:</strong> trước mỗi lệnh <code>curl</code>, bạn đoán được nó sẽ HIT, MISS, EXPIRED hay STALE — và đoán đúng mọi lần.</p>
${giai('Gợi ý: hai thay đổi', bash(`
# edge.conf — khoá cache gồm query string
proxy_cache_key $uri$is_args$args;
docker restart aws-c5-edge
# origin cấm cache
docker rm -f aws-c5-origin
docker run -d --name aws-c5-origin --network aws-c5-net --ip 10.145.3.10 -e TEN=origin \\
  -e DELAY=300 -e SECRET=bi-mat-chi-cdn-biet -e CC="no-store" \\
  -v $PWD/app.js:/app.js:ro node:22-bookworm-slim node /app.js
# kết quả mong đợi: X-Cache: MISS mọi lần`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CDN / edge location</span><span class="v">Mạng các bộ đệm gần người dùng; mỗi nơi giữ bản sao câu trả lời.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">Nguồn thật đứng sau CDN: S3, ALB, máy chủ HTTP bất kỳ.</span></div>
  <div class="kv"><span class="k">HIT / MISS / EXPIRED / STALE</span><span class="v">Lấy từ cache / lấy từ origin / lấy lại sau TTL / trả bản cũ vì origin hỏng.</span></div>
  <div class="kv"><span class="k">Khoá cache</span><span class="v">Các phần của yêu cầu làm một bản sao trong cache là duy nhất.</span></div>
  <div class="kv"><span class="k">TTL / max-age</span><span class="v">Bản sao được coi là còn tươi trong bao lâu.</span></div>
  <div class="kv"><span class="k">Invalidation</span><span class="v">Lệnh bỏ bản sao theo đường dẫn trước khi hết TTL.</span></div>
  <div class="kv"><span class="k">OAC</span><span class="v">Origin access control: CloudFront ký yêu cầu tới bucket S3 riêng tư.</span></div>
  <div class="kv"><span class="k">Web Cache Deception</span><span class="v">Lừa cache lưu trang riêng tư của nạn nhân dưới một URL trông như tệp tĩnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>CDN trả lời yêu cầu lặp lại từ edge: nhanh hơn cho người dùng, nhẹ hơn cho origin.</li>
  <li>Origin quyết định bằng Cache-Control; khoá cache quyết định thế nào là “cùng một thứ”.</li>
  <li>Gắn mã băm vào tên tài nguyên; chỉ invalidate tệp vào cửa.</li>
  <li>Không bao giờ cache câu trả lời cá nhân; khoá origin để không ai đi vòng CDN.</li>
  <li>stale-if-error cho edge tiếp tục phục vụ khi origin sập.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html', '⏱️', 'Tài liệu AWS — Nội dung ở trong cache bao lâu', 'TTL, Cache-Control, stale-while-revalidate và stale-if-error.')}
${tl('https://omergil.blogspot.com/2017/02/web-cache-deception-attack.html', '🕵️', 'Omer Gil — Web Cache Deception Attack (2017)', 'Bài viết gốc, có trường hợp PayPal.')}

<h3>Nguồn</h3>
<ul>
  <li>CloudFront là gì: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html</a></li>
  <li>Origin access control cho S3: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html</a></li>
  <li>Cache policy dựng sẵn: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html</a></li>
  <li>Hết hạn, stale-if-error: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html</a></li>
  <li>Ra mắt stale-while-revalidate / stale-if-error (05/2023): <a href="https://aws.amazon.com/about-aws/whats-new/2023/05/amazon-cloudfront-stale-while-revalidate-stale-if-error-cache-control-directives/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2023/05/…stale-if-error…/</a></li>
  <li>Invalidation và 1.000 đường miễn phí: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PayingForInvalidation.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PayingForInvalidation.html</a></li>
  <li>Chứng chỉ ở us-east-1: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html</a></li>
  <li>Hạn chế truy cập vào origin ALB: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html</a></li>
  <li>Gói giá cố định (11/2025): <a href="https://aws.amazon.com/about-aws/whats-new/2025/11/aws-flat-rate-pricing-plans/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2025/11/aws-flat-rate-pricing-plans/</a></li>
  <li>Giá CloudFront: <a href="https://aws.amazon.com/cloudfront/pricing/" target="_blank" rel="noopener">aws.amazon.com/cloudfront/pricing/</a></li>
  <li>Web Cache Deception: <a href="https://omergil.blogspot.com/2017/02/web-cache-deception-attack.html" target="_blank" rel="noopener">omergil.blogspot.com/2017/02/web-cache-deception-attack.html</a></li>
  <li>nginx proxy_cache: <a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache" target="_blank" rel="noopener">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache</a></li>
</ul>
</div>
`;
/* ═════ 5.5 — WAF, Shield và DDoS ═════ */
const L55_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5</span>
<h2>5.5 — WAF, Shield and DDoS: filtering bad requests before they reach your code</h2>
<p class="lead">Once your API has a public name, it is scanned within minutes: SQL injection probes, vulnerability scanners, credential stuffing, and occasionally a flood meant to knock it over. <strong>AWS WAF</strong> (web application firewall) inspects HTTP requests at the ALB, CloudFront or API Gateway and allows, blocks, counts or challenges them by rules. <strong>AWS Shield</strong> protects against volumetric DDoS at the network layers — the Standard tier is on for every customer at no cost. This lesson builds a web ACL through the API, then runs WAF-style rules for real: first in count mode, then blocking an attacker while a normal user keeps working, and finally shows the attack a per-IP limit cannot stop.</p>

<h3>The picture: the security guard at the building gate</h3>
<p>A building has a guard at the gate (WAF) with a <strong>list of rules</strong> checked in order. A banned list of faces (<strong>IP set</strong>). Anyone carrying a crowbar is turned away (<strong>managed rules</strong> for known attack patterns like SQL injection). Someone walking in and out 30 times a minute is stopped for a while (<strong>rate-based rule</strong>). On the first day the new guard only <strong>writes down</strong> who he would have stopped (<strong>count mode</strong>), so the manager can check he is not turning away real tenants. And when a whole crowd blocks the street (a DDoS), that is the city's job — the road authority (<strong>Shield</strong>) clears it before it reaches the gate.</p>

<h3>How a web ACL is built</h3>
<table>
  <thead><tr><th>Piece</th><th>What it is</th></tr></thead>
  <tbody>
    <tr><td><strong>Web ACL</strong></td><td>The rule list attached to an ALB, CloudFront distribution, API Gateway stage…; has a <strong>default action</strong> (Allow for public APIs)</td></tr>
    <tr><td><strong>Rule</strong></td><td>Statement (match) + action (Allow, Block, Count, CAPTCHA, Challenge), evaluated by priority; first terminating match wins</td></tr>
    <tr><td><strong>Managed rule group</strong></td><td>Rules maintained by AWS or vendors: <code>AWSManagedRulesCommonRuleSet</code> (OWASP-style), <code>SQLiRuleSet</code>, <code>KnownBadInputsRuleSet</code>, <code>AmazonIpReputationList</code>, Bot Control (paid)</td></tr>
    <tr><td><strong>Rate-based rule</strong></td><td>Counts requests per key (IP by default, or header, path…) over a sliding window and blocks keys above the limit</td></tr>
    <tr><td><strong>Logs + sampled requests</strong></td><td>What matched which rule — the only way to tune without breaking real users</td></tr>
  </tbody>
</table>

<h3>See it running (1): the WAF API</h3>
<p>AWS WAF (wafv2) ran on Moto — configuration only.</p>
${OUT_55_WAF_API}
<ul>
  <li>Priority 0 blocks one IP set; priority 1 adds the common rule group in <strong>Count</strong> (override action) — observe first; priority 2 adds the SQL injection group as-is (<code>None</code> = use the group's own actions, which block); priority 3 is a rate-based rule: more than 300 requests in 5 minutes from one IP ⇒ block with a <strong>custom 429</strong> response.</li>
  <li><code>associate-web-acl</code> attaches it to the ALB. <code>--scope REGIONAL</code> is for ALB/API Gateway; a web ACL for CloudFront uses <code>--scope CLOUDFRONT</code> and lives in us-east-1.</li>
  <li><code>describe-subscription</code> fails: this account has no <strong>Shield Advanced</strong>. Shield Standard needs no subscription — it is always on.</li>
</ul>

<h3>See it running (2): WAF rules on real traffic</h3>
<p>HAProxy plays the WAF on the ALB with four rules like the web ACL above: an IP set, a SQL injection pattern, a scanner user agent, and a rate limit of 20 requests per 10 seconds per IP (small numbers so the lab is fast). The attacker is <code>10.145.6.66</code>; a normal user is <code>10.145.0.100</code>.</p>
${MA_WAF}
${OUT_55_WAF_THAT_A}
<p><strong>Count mode:</strong> everything returned 200, but the log shows which rule <em>would</em> have fired: 1 SQL injection, 1 scanner, 42 rate-limit hits. Always start new rules like this for a few days on real traffic.</p>
${OUT_55_WAF_THAT_B}
<ol>
  <li><strong>Block mode:</strong> the SQL injection and the <code>sqlmap</code> user agent got <strong>403</strong>. Of the 60 rapid requests, the first 18 passed and the rest got <strong>429</strong> once the attacker crossed 20 requests in 10 seconds.</li>
  <li>The normal user, at the same moment, got 200 — the limit is per IP. A real name like <code>O'Brien</code> in a search query also passed: the pattern looks for injection <em>shapes</em> (<code>' OR 1=1</code>), not for any apostrophe. Over-broad rules that block real names are the most common WAF mistake; count mode is how you find them.</li>
  <li>The log tells you who was blocked by which rule — on AWS: WAF logs to CloudWatch Logs/S3/Firehose and sampled requests in the console.</li>
</ol>
${OUT_55_WAF_THAT_C}
<p><strong>The limit of per-IP limits:</strong> five machines sending 15 requests each — 75 requests, the same volume that got the single attacker throttled — all passed, because no single IP crossed the threshold. Real botnets use thousands of IPs. That is why serious protection layers several signals: IP reputation lists, Bot Control/CAPTCHA challenges, limits on expensive endpoints (login, search) keyed by other things than IP, caching at CloudFront so floods hit the edge, and Shield for the network layers.</p>

<h3>Shield Standard vs Shield Advanced</h3>
<table>
  <thead><tr><th></th><th>Shield Standard</th><th>Shield Advanced</th></tr></thead>
  <tbody>
    <tr><td>Price</td><td>Free, automatic for everyone</td><td>3,000 USD/month per organisation, 1-year commitment, + data transfer fees</td></tr>
    <tr><td>Protects</td><td>Layer 3/4 floods (SYN, UDP reflection) against all AWS edge and regional services</td><td>+ application-layer detection, the AWS Shield Response Team, cost protection for scaling caused by an attack, WAF included for protected resources</td></tr>
    <tr><td>Who buys it</td><td>Everyone has it</td><td>Banks, games, e-commerce with a real DDoS risk</td></tr>
  </tbody>
</table>
<p>WAF price in Singapore (Price List): <strong>5 USD per web ACL per month</strong> + <strong>1 USD per rule</strong> + <strong>0.60 USD per million requests</strong> inspected; managed groups such as Bot Control cost extra. The lab's ACL with 4 rules ≈ 9 USD/month before traffic.</p>

<h3>🔓 Hacker's view: three DDoS attacks with names and dates</h3>
<ul>
  <li><strong>GitHub, 28 February 2018 — 1.35 Tbps.</strong> Attackers spoofed GitHub's address in tiny requests to memcached servers left open on UDP port 11211; each request triggered a reply up to tens of thousands of times bigger (reflection + amplification). GitHub moved traffic to its DDoS provider and was back within minutes. Lesson: never expose UDP services to the Internet (memcached, DNS resolvers, CLDAP) — you become the weapon.</li>
  <li><strong>AWS Shield, February 2020 — 2.3 Tbps.</strong> AWS reported mitigating the largest DDoS it had seen, a CLDAP reflection attack against one customer, causing three days of elevated threat for its team — the customer stayed online. That is Shield Standard/Advanced doing the city's job.</li>
  <li><strong>HTTP/2 Rapid Reset, August 2023 (CVE-2023-44487).</strong> A new layer-7 technique: open an HTTP/2 stream and cancel it immediately, millions of times per second. AWS saw more than 155 million requests per second against CloudFront and mitigated it within minutes; Google and Cloudflare saw the same campaign. Layer-7 floods are why WAF rate rules and edge caching matter even with Shield.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>cuongthai.com</strong> sits behind Cloudflare, which plays the Shield + WAF role in front of the VPS; the VPS firewall only needs to accept web traffic from the CDN. On AWS the same pattern is CloudFront + WAF + Shield, with the ALB accepting only CloudFront.</li>
  <li>Login and OTP endpoints deserve their own tighter rate limit (per IP <em>and</em> per account): credential stuffing tries thousands of leaked passwords slowly from many IPs.</li>
  <li>A team rolling out WAF at work: managed groups in Count for a week, read the logs with the product team, exclude the false positives, then switch to Block — and keep an alarm on the blocked-request metric.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>WAF vs security group?</strong> — Security groups filter by IP/port at layers 3–4 and cannot see HTTP; WAF reads requests (path, headers, body, query) at layer 7.</li>
  <li><strong>Shield Standard vs Advanced?</strong> — Standard: free, automatic network-layer protection. Advanced: paid, adds layer-7 detection, a response team and cost protection.</li>
  <li><strong>How do you add WAF rules without blocking real users?</strong> — Start in Count mode, read logs/sampled requests, add exclusions, then Block; monitor blocked counts.</li>
  <li><strong>Why is a per-IP rate limit not enough against a DDoS?</strong> — Botnets spread requests across many IPs below the limit; combine reputation lists, bot challenges, caching and Shield.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>bash scratchpad/aws/lab/c5/55.sh</code>.</li>
  <li>Add a rule that only limits <code>/api/dang-nhap</code> (login) to 5 requests per 10 s per IP, while other paths keep the general limit.</li>
  <li>Add the botnet IP range <code>10.145.6.0/24</code> to the IP set and show the five bots are now blocked.</li>
</ol>
<p><strong>Pass when:</strong> the sixth login request within 10 s gets 429 while <code>/api/phong</code> still answers 200, and all 75 bot requests get 403 after the IP-set change.</p>
${giai('Hint: two more rules', bash(`
# in frontend listener-80 (HAProxy); on AWS: a rate-based rule with a scope-down statement on the URI path
acl dang_nhap path_beg /api/dang-nhap
http-request track-sc1 src table st_login if dang_nhap
http-request deny deny_status 429 if dang_nhap { sc_http_req_rate(1,st_login) gt 5 }
backend st_login
  stick-table type ip size 100k expire 30s store http_req_rate(10s)
# IP set
echo 10.145.6.0/24 >> ip-chan.txt   # then restart the WAF container`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AWS WAF</span><span class="v">Layer-7 firewall in front of ALB, CloudFront, API Gateway.</span></div>
  <div class="kv"><span class="k">Web ACL</span><span class="v">Ordered rule list + default action attached to a resource.</span></div>
  <div class="kv"><span class="k">Managed rule group</span><span class="v">Rules maintained by AWS or a vendor for known attacks.</span></div>
  <div class="kv"><span class="k">Rate-based rule</span><span class="v">Blocks a key (IP, header…) that exceeds a request count in a window.</span></div>
  <div class="kv"><span class="k">Count mode</span><span class="v">Rule matches are logged but not enforced — for tuning.</span></div>
  <div class="kv"><span class="k">Shield Standard / Advanced</span><span class="v">Free automatic network-layer DDoS protection / paid tier with response team and cost protection.</span></div>
  <div class="kv"><span class="k">Reflection / amplification</span><span class="v">Spoofed small requests to open servers that send big replies to the victim.</span></div>
  <div class="kv"><span class="k">Denial of wallet</span><span class="v">An attack that succeeds by making you pay, not by taking you down.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>WAF reads HTTP; security groups do not — use both.</li>
  <li>Web ACL = IP sets + managed groups + rate rules, evaluated by priority.</li>
  <li>New rules: Count first, then Block, with logs.</li>
  <li>Per-IP limits stop one attacker, not a botnet — layer reputation, challenges, caching and Shield.</li>
  <li>Shield Standard is free and always on; Advanced is a business decision.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html', '🛡️', 'AWS whitepaper — Best practices for DDoS resiliency', 'Layered design: edge, WAF, Shield, scaling.')}
${tl('https://aws.amazon.com/blogs/security/how-aws-protects-customers-from-ddos-events/', '🌊', 'AWS Security Blog — How AWS protects customers from DDoS events', 'The HTTP/2 Rapid Reset event of 2023 from AWS’s side.')}

<h3>Sources</h3>
<ul>
  <li>AWS WAF guide: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html</a></li>
  <li>Rate-based rules: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html</a></li>
  <li>Managed rule groups: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html</a></li>
  <li>AWS Shield: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/waf/pricing/" target="_blank" rel="noopener">aws.amazon.com/waf/pricing/</a> · <a href="https://aws.amazon.com/shield/pricing/" target="_blank" rel="noopener">aws.amazon.com/shield/pricing/</a></li>
  <li>GitHub 2018: <a href="https://github.blog/news-insights/company-news/ddos-incident-report/" target="_blank" rel="noopener">github.blog/news-insights/company-news/ddos-incident-report/</a></li>
  <li>AWS 2.3 Tbps (2020): <a href="https://www.zdnet.com/article/aws-said-it-mitigated-a-2-3-tbps-ddos-attack-the-largest-ever/" target="_blank" rel="noopener">zdnet.com/article/aws-said-it-mitigated-a-2-3-tbps-ddos-attack-the-largest-ever/</a></li>
  <li>HTTP/2 Rapid Reset: <a href="https://aws.amazon.com/security/security-bulletins/AWS-2023-011/" target="_blank" rel="noopener">aws.amazon.com/security/security-bulletins/AWS-2023-011/</a> · <a href="https://aws.amazon.com/blogs/security/how-aws-protects-customers-from-ddos-events/" target="_blank" rel="noopener">aws.amazon.com/blogs/security/how-aws-protects-customers-from-ddos-events/</a></li>
  <li>DDoS resiliency whitepaper: <a href="https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html</a></li>
  <li>HAProxy configuration manual: <a href="https://www.haproxy.com/documentation/haproxy-configuration-manual/latest/" target="_blank" rel="noopener">haproxy.com/documentation/haproxy-configuration-manual/latest/</a></li>
</ul>
</div>
`;
const L55_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5</span>
<h2>5.5 — WAF, Shield và DDoS: lọc yêu cầu xấu trước khi chúng chạm tới mã của bạn</h2>
<p class="lead">API vừa có tên công khai là vài phút sau đã bị quét: dò SQL injection, máy quét lỗ hổng, thử mật khẩu hàng loạt, và đôi khi một trận lũ nhằm đánh sập nó. <strong>AWS WAF</strong> (tường lửa ứng dụng web) đọc từng yêu cầu HTTP ở ALB, CloudFront hay API Gateway và cho qua, chặn, đếm hoặc thử thách chúng theo luật. <strong>AWS Shield</strong> chống DDoS kiểu “lấy thịt đè người” ở các tầng mạng — bản Standard luôn bật cho mọi khách hàng, không mất tiền. Bài này dựng một web ACL bằng API, rồi chạy thật các luật kiểu WAF: trước ở chế độ đếm, sau chặn kẻ tấn công trong khi người dùng thường vẫn làm việc, và cuối cùng là kiểu tấn công mà giới hạn theo IP không chặn nổi.</p>

<h3>Hình dung: bảo vệ ở cổng toà nhà</h3>
<p>Toà nhà có bảo vệ ở cổng (WAF) cầm một <strong>danh sách luật</strong> xét theo thứ tự. Danh sách mặt người bị cấm (<strong>IP set</strong>). Ai cầm xà beng thì mời về (<strong>managed rule</strong> cho kiểu tấn công đã biết như SQL injection). Ai ra vào 30 lần một phút thì bị giữ lại một lúc (<strong>rate-based rule</strong>). Ngày đầu, bảo vệ mới chỉ <strong>ghi lại</strong> những người anh ta định chặn (<strong>chế độ Count</strong>), để quản lý kiểm xem có chặn nhầm cư dân thật không. Còn khi cả đám đông chặn kín con đường (DDoS) thì đó là việc của thành phố — cơ quan giao thông (<strong>Shield</strong>) dẹp đường trước khi đám đông tới cổng.</p>

<h3>Một web ACL gồm những gì</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Là gì</th></tr></thead>
  <tbody>
    <tr><td><strong>Web ACL</strong></td><td>Danh sách luật gắn vào ALB, distribution CloudFront, stage API Gateway…; có <strong>hành động mặc định</strong> (Allow cho API công khai)</td></tr>
    <tr><td><strong>Rule (luật)</strong></td><td>Điều kiện khớp + hành động (Allow, Block, Count, CAPTCHA, Challenge), xét theo độ ưu tiên; luật kết thúc đầu tiên khớp sẽ quyết định</td></tr>
    <tr><td><strong>Managed rule group</strong></td><td>Luật do AWS hay nhà cung cấp bảo trì: <code>AWSManagedRulesCommonRuleSet</code> (kiểu OWASP), <code>SQLiRuleSet</code>, <code>KnownBadInputsRuleSet</code>, <code>AmazonIpReputationList</code>, Bot Control (trả thêm)</td></tr>
    <tr><td><strong>Rate-based rule</strong></td><td>Đếm yêu cầu theo khoá (mặc định IP, hoặc header, đường dẫn…) trong cửa sổ trượt và chặn khoá vượt ngưỡng</td></tr>
    <tr><td><strong>Log + yêu cầu mẫu</strong></td><td>Yêu cầu nào khớp luật nào — cách duy nhất để tinh chỉnh mà không chặn nhầm người thật</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật (1): API của WAF</h3>
<p>AWS WAF (wafv2) chạy trên Moto — chỉ là cấu hình.</p>
${OUT_55_WAF_API}
<ul>
  <li>Ưu tiên 0 chặn một IP set; ưu tiên 1 thêm nhóm luật chung ở chế độ <strong>Count</strong> (override action) — quan sát trước; ưu tiên 2 thêm nhóm chống SQL injection để nguyên (<code>None</code> = dùng hành động của chính nhóm, tức là chặn); ưu tiên 3 là luật rate-based: hơn 300 yêu cầu trong 5 phút từ một IP ⇒ chặn kèm câu trả lời <strong>429 tuỳ chỉnh</strong>.</li>
  <li><code>associate-web-acl</code> gắn nó vào ALB. <code>--scope REGIONAL</code> dành cho ALB/API Gateway; web ACL cho CloudFront dùng <code>--scope CLOUDFRONT</code> và nằm ở us-east-1.</li>
  <li><code>describe-subscription</code> báo lỗi: tài khoản này không có <strong>Shield Advanced</strong>. Shield Standard không cần đăng ký — nó luôn bật.</li>
</ul>

<h3>Xem chạy thật (2): luật WAF trên lưu lượng thật</h3>
<p>HAProxy đóng vai WAF ở ALB với bốn luật giống web ACL ở trên: một IP set, một mẫu SQL injection, một user agent của máy quét, và giới hạn 20 yêu cầu mỗi 10 giây mỗi IP (số nhỏ để lab chạy nhanh). Kẻ tấn công là <code>10.145.6.66</code>; người dùng bình thường là <code>10.145.0.100</code>.</p>
${MA_WAF}
${OUT_55_WAF_THAT_A}
<p><strong>Chế độ Count:</strong> mọi thứ đều trả 200, nhưng log cho thấy luật nào <em>lẽ ra</em> đã chặn: 1 lần SQL injection, 1 lần máy quét, 42 lần vượt tần suất. Luật mới luôn nên chạy kiểu này vài ngày trên lưu lượng thật.</p>
${OUT_55_WAF_THAT_B}
<ol>
  <li><strong>Chế độ Block:</strong> SQL injection và user agent <code>sqlmap</code> nhận <strong>403</strong>. Trong 60 yêu cầu dồn dập, 18 cái đầu qua được, phần còn lại nhận <strong>429</strong> khi kẻ tấn công vượt 20 yêu cầu trong 10 giây.</li>
  <li>Người dùng bình thường, cùng lúc đó, nhận 200 — giới hạn tính theo từng IP. Một cái tên thật như <code>O'Brien</code> trong câu tìm kiếm cũng qua: mẫu luật tìm <em>hình dạng</em> của injection (<code>' OR 1=1</code>), không chặn mọi dấu nháy. Luật quá rộng chặn nhầm tên người thật là lỗi WAF phổ biến nhất; chế độ Count là cách để tìm ra chúng.</li>
  <li>Log cho biết ai bị chặn bởi luật nào — trên AWS: log WAF đổ về CloudWatch Logs/S3/Firehose, và có yêu cầu mẫu trong console.</li>
</ol>
${OUT_55_WAF_THAT_C}
<p><strong>Giới hạn của giới hạn theo IP:</strong> năm máy, mỗi máy 15 yêu cầu — tổng 75 yêu cầu, đúng khối lượng đã khiến kẻ tấn công đơn lẻ bị chặn — đều lọt hết, vì không IP nào vượt ngưỡng. Botnet thật dùng hàng nghìn IP. Vì thế bảo vệ nghiêm túc phải chồng nhiều tín hiệu: danh sách IP xấu, thử thách Bot Control/CAPTCHA, giới hạn riêng cho endpoint tốn kém (đăng nhập, tìm kiếm) theo khoá khác ngoài IP, cache ở CloudFront để lũ đập vào edge, và Shield cho các tầng mạng.</p>

<h3>Shield Standard so với Shield Advanced</h3>
<table>
  <thead><tr><th></th><th>Shield Standard</th><th>Shield Advanced</th></tr></thead>
  <tbody>
    <tr><td>Giá</td><td>Miễn phí, tự động cho mọi người</td><td>3.000 USD/tháng mỗi tổ chức, cam kết 1 năm, + phí dữ liệu</td></tr>
    <tr><td>Bảo vệ</td><td>Lũ ở tầng 3/4 (SYN, phản xạ UDP) cho mọi dịch vụ edge và regional của AWS</td><td>+ phát hiện ở tầng ứng dụng, đội AWS Shield Response Team, bảo vệ chi phí khi bị tấn công làm co giãn tốn tiền, WAF đi kèm cho tài nguyên được bảo vệ</td></tr>
    <tr><td>Ai mua</td><td>Ai cũng có sẵn</td><td>Ngân hàng, game, thương mại điện tử có rủi ro DDoS thật</td></tr>
  </tbody>
</table>
<p>Giá WAF ở Singapore (Price List): <strong>5 USD mỗi web ACL mỗi tháng</strong> + <strong>1 USD mỗi luật</strong> + <strong>0,60 USD mỗi triệu yêu cầu</strong> được kiểm; nhóm như Bot Control tính thêm. Web ACL 4 luật của lab ≈ 9 USD/tháng khi chưa có lưu lượng.</p>

<h3>🔓 Góc hacker: ba trận DDoS có tên và ngày tháng</h3>
<ul>
  <li><strong>GitHub, 28/2/2018 — 1,35 Tbps.</strong> Kẻ tấn công giả địa chỉ của GitHub trong những yêu cầu tí hon gửi tới các máy memcached để hở cổng UDP 11211; mỗi yêu cầu kéo theo một câu trả lời to hơn tới hàng chục nghìn lần (phản xạ + khuếch đại). GitHub chuyển lưu lượng sang nhà cung cấp chống DDoS và trở lại sau vài phút. Bài học: đừng bao giờ để dịch vụ UDP hở ra Internet (memcached, DNS resolver, CLDAP) — bạn sẽ thành vũ khí.</li>
  <li><strong>AWS Shield, tháng 2/2020 — 2,3 Tbps.</strong> AWS báo đã chặn trận DDoS lớn nhất họ từng thấy, kiểu phản xạ CLDAP nhắm vào một khách hàng, khiến đội của họ ở mức báo động cao ba ngày — khách hàng vẫn sống. Đó là Shield làm đúng “việc của thành phố”.</li>
  <li><strong>HTTP/2 Rapid Reset, tháng 8/2023 (CVE-2023-44487).</strong> Một kỹ thuật tầng 7 mới: mở một luồng HTTP/2 rồi huỷ ngay, hàng triệu lần mỗi giây. AWS thấy hơn 155 triệu yêu cầu mỗi giây nhắm vào CloudFront và chặn được trong vài phút; Google và Cloudflare cũng gặp cùng chiến dịch. Lũ tầng 7 là lý do luật tần suất của WAF và cache ở edge vẫn quan trọng dù đã có Shield.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>cuongthai.com</strong> đứng sau Cloudflare, thứ đóng vai Shield + WAF trước VPS; tường lửa của VPS chỉ cần nhận lưu lượng web từ CDN. Trên AWS, cùng khuôn đó là CloudFront + WAF + Shield, còn ALB chỉ nhận từ CloudFront.</li>
  <li>Endpoint đăng nhập và OTP xứng đáng có giới hạn riêng chặt hơn (theo IP <em>và</em> theo tài khoản): tấn công nhồi thông tin đăng nhập thử hàng nghìn mật khẩu bị lộ, chậm rãi, từ rất nhiều IP.</li>
  <li>Một đội bật WAF ở công ty: các nhóm luật managed để Count một tuần, đọc log cùng đội sản phẩm, loại trừ các ca chặn nhầm, rồi mới chuyển sang Block — và giữ một alarm trên chỉ số số yêu cầu bị chặn.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>WAF khác security group thế nào?</strong> — Security group lọc theo IP/cổng ở tầng 3–4 và không nhìn thấy HTTP; WAF đọc yêu cầu (đường dẫn, header, body, query) ở tầng 7.</li>
  <li><strong>Shield Standard khác Advanced thế nào?</strong> — Standard: miễn phí, tự bảo vệ tầng mạng. Advanced: trả phí, thêm phát hiện tầng 7, đội phản ứng và bảo vệ chi phí.</li>
  <li><strong>Thêm luật WAF mà không chặn nhầm người dùng thật bằng cách nào?</strong> — Chạy Count trước, đọc log/yêu cầu mẫu, thêm ngoại lệ, rồi Block; theo dõi số bị chặn.</li>
  <li><strong>Vì sao giới hạn tần suất theo IP không đủ chống DDoS?</strong> — Botnet rải yêu cầu qua nhiều IP dưới ngưỡng; phải kết hợp danh sách IP xấu, thử thách bot, cache và Shield.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>bash scratchpad/aws/lab/c5/55.sh</code>.</li>
  <li>Thêm một luật chỉ giới hạn <code>/api/dang-nhap</code> ở 5 yêu cầu mỗi 10 giây mỗi IP, các đường khác giữ giới hạn chung.</li>
  <li>Thêm dải IP của botnet <code>10.145.6.0/24</code> vào IP set và chứng minh năm bot giờ bị chặn.</li>
</ol>
<p><strong>Đạt khi:</strong> yêu cầu đăng nhập thứ sáu trong 10 giây nhận 429 trong khi <code>/api/phong</code> vẫn trả 200, và cả 75 yêu cầu của bot nhận 403 sau khi sửa IP set.</p>
${giai('Gợi ý: thêm hai luật', bash(`
# trong frontend listener-80 (HAProxy); trên AWS: luật rate-based kèm scope-down statement theo đường dẫn URI
acl dang_nhap path_beg /api/dang-nhap
http-request track-sc1 src table st_login if dang_nhap
http-request deny deny_status 429 if dang_nhap { sc_http_req_rate(1,st_login) gt 5 }
backend st_login
  stick-table type ip size 100k expire 30s store http_req_rate(10s)
# IP set
echo 10.145.6.0/24 >> ip-chan.txt   # rồi khởi động lại container WAF`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AWS WAF</span><span class="v">Tường lửa tầng 7 đứng trước ALB, CloudFront, API Gateway.</span></div>
  <div class="kv"><span class="k">Web ACL</span><span class="v">Danh sách luật có thứ tự + hành động mặc định, gắn vào một tài nguyên.</span></div>
  <div class="kv"><span class="k">Managed rule group</span><span class="v">Nhóm luật do AWS hay nhà cung cấp bảo trì cho các kiểu tấn công đã biết.</span></div>
  <div class="kv"><span class="k">Rate-based rule</span><span class="v">Chặn một khoá (IP, header…) vượt số yêu cầu trong một cửa sổ thời gian.</span></div>
  <div class="kv"><span class="k">Chế độ Count</span><span class="v">Ghi log khi khớp luật nhưng không thi hành — để tinh chỉnh.</span></div>
  <div class="kv"><span class="k">Shield Standard / Advanced</span><span class="v">Chống DDoS tầng mạng miễn phí, tự động / bản trả phí có đội phản ứng và bảo vệ chi phí.</span></div>
  <div class="kv"><span class="k">Phản xạ / khuếch đại</span><span class="v">Gửi yêu cầu nhỏ giả địa chỉ tới máy chủ hở, để chúng dội câu trả lời to về nạn nhân.</span></div>
  <div class="kv"><span class="k">Denial of wallet</span><span class="v">Tấn công thành công bằng cách bắt bạn trả tiền, không cần làm sập.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>WAF đọc HTTP; security group thì không — dùng cả hai.</li>
  <li>Web ACL = IP set + nhóm luật managed + luật tần suất, xét theo độ ưu tiên.</li>
  <li>Luật mới: Count trước, Block sau, luôn có log.</li>
  <li>Giới hạn theo IP chặn được một kẻ tấn công, không chặn được botnet — chồng thêm danh sách IP xấu, thử thách, cache và Shield.</li>
  <li>Shield Standard miễn phí và luôn bật; Advanced là quyết định kinh doanh.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html', '🛡️', 'Whitepaper AWS — Thực hành tốt để chống chịu DDoS', 'Thiết kế nhiều lớp: edge, WAF, Shield, co giãn.')}
${tl('https://aws.amazon.com/blogs/security/how-aws-protects-customers-from-ddos-events/', '🌊', 'AWS Security Blog — AWS bảo vệ khách hàng trước DDoS thế nào', 'Sự kiện HTTP/2 Rapid Reset năm 2023 nhìn từ phía AWS.')}

<h3>Nguồn</h3>
<ul>
  <li>Hướng dẫn AWS WAF: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html</a></li>
  <li>Luật rate-based: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html</a></li>
  <li>Nhóm luật managed: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html</a></li>
  <li>AWS Shield: <a href="https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html" target="_blank" rel="noopener">docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/waf/pricing/" target="_blank" rel="noopener">aws.amazon.com/waf/pricing/</a> · <a href="https://aws.amazon.com/shield/pricing/" target="_blank" rel="noopener">aws.amazon.com/shield/pricing/</a></li>
  <li>GitHub 2018: <a href="https://github.blog/news-insights/company-news/ddos-incident-report/" target="_blank" rel="noopener">github.blog/news-insights/company-news/ddos-incident-report/</a></li>
  <li>AWS 2,3 Tbps (2020): <a href="https://www.zdnet.com/article/aws-said-it-mitigated-a-2-3-tbps-ddos-attack-the-largest-ever/" target="_blank" rel="noopener">zdnet.com/article/aws-said-it-mitigated-a-2-3-tbps-ddos-attack-the-largest-ever/</a></li>
  <li>HTTP/2 Rapid Reset: <a href="https://aws.amazon.com/security/security-bulletins/AWS-2023-011/" target="_blank" rel="noopener">aws.amazon.com/security/security-bulletins/AWS-2023-011/</a> · <a href="https://aws.amazon.com/blogs/security/how-aws-protects-customers-from-ddos-events/" target="_blank" rel="noopener">aws.amazon.com/blogs/security/how-aws-protects-customers-from-ddos-events/</a></li>
  <li>Whitepaper chống chịu DDoS: <a href="https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html</a></li>
  <li>Sổ tay cấu hình HAProxy: <a href="https://www.haproxy.com/documentation/haproxy-configuration-manual/latest/" target="_blank" rel="noopener">haproxy.com/documentation/haproxy-configuration-manual/latest/</a></li>
</ul>
</div>
`;
/* ═════ 5.6 — Lab chương 5 ═════ */
const L56_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 6</span>
<h2>5.6 — Chapter 5 lab: put the LabFlow API on the Internet the production way</h2>
<p class="lead">You now have every piece of a public web tier: ALB, Auto Scaling, Route 53, ACM, CloudFront and WAF. This lab asks you to assemble the core of it for the LabFlow booking API and prove it with a grader of 8 objective checks — the same checks a senior engineer would run in a design review. Then you price it, tear it down and prove nothing is left billing.</p>

<h3>The brief</h3>
<ol>
  <li>An <strong>internet-facing ALB</strong> <code>labflow-alb</code> in two subnets in two AZs.</li>
  <li>A listener on <strong>443 HTTPS</strong> with an ACM certificate for <code>api.labflow.example</code> and a modern TLS policy.</li>
  <li>The listener on <strong>80</strong> only redirects to HTTPS with a 301.</li>
  <li>Target group <code>tg-api</code> on port 3000 whose health check calls <code>/health</code> and expects 200.</li>
  <li>An <strong>Auto Scaling group</strong> <code>labflow-asg</code>: min 2, max 4, subnets in two AZs, health check type ELB, attached to <code>tg-api</code>, launch template with IMDSv2.</li>
  <li>A <strong>target tracking</strong> scaling policy.</li>
  <li>The app's security group <code>labflow-app-sg</code> accepts port 3000 <strong>only from the ALB's security group</strong> <code>labflow-alb-sg</code>.</li>
  <li>A <strong>WAF web ACL</strong> attached to the ALB with at least one rate-based rule.</li>
</ol>

<h3>The grader</h3>
<p>Every check reads configuration through the AWS CLI, so it works unchanged on a real account (remove the emulator endpoint). It ran here against Moto.</p>
${MA_CHAM}

<h3>Run it on the quick-and-dirty version first</h3>
<p>This is what a first attempt under deadline usually looks like — it “works”: the ALB answers on port 80 and forwards to one machine.</p>
${MA_TRUOC}
${OUT_56_TRUOC}
<p>One check out of eight. Read the failures as a reviewer would: no HTTPS at all; HTTP serves the app instead of redirecting; the health check calls <code>/</code>, which can be 200 while the API is broken; a single machine in a single AZ with EC2 health checks — one crash and it is down until someone notices; no scaling; port 3000 open to the whole Internet, so anyone can skip the ALB (and its WAF); no WAF.</p>
${OUT_56_DON1}

<div class="callout warn"><p><strong>Stop here.</strong> Write your own version and run the grader until it says 8/8. Then compare with the solution below.</p></div>

${giai('Solution: giai.sh, the grader at 8/8, clean-up and the bill check', MA_GIAI + OUT_56_GIAI + MA_DON + MA_CONGI)}

<h3>Clean up — and prove it</h3>
<p>Order matters, because resources depend on each other: detach and delete the web ACL → delete the ASG with <code>--force-delete</code> (it terminates its instances) → listeners → load balancer → target group → launch template → security groups (app first, because it references the ALB's group) → certificate. Then <code>con-gi.sh</code> lists what could still bill: an ALB costs money every hour <em>even with zero traffic</em>, and a forgotten ASG with min 2 recreates machines you terminate by hand.</p>

<h3>What would this cost?</h3>
<table>
  <thead><tr><th>Item (Singapore, 730 h/month)</th><th>USD/month</th></tr></thead>
  <tbody>
    <tr><td>ALB 0.0252/h</td><td>18.40</td></tr>
    <tr><td>ALB usage ≈ 1 LCU × 0.008/h</td><td>5.84</td></tr>
    <tr><td>2 × t4g.small 0.0212/h</td><td>30.95</td></tr>
    <tr><td>2 × 8 GB gp3 0.096/GB</td><td>1.54</td></tr>
    <tr><td>ALB public IPv4, 2 × 0.005/h</td><td>7.30</td></tr>
    <tr><td>WAF: 1 web ACL + 1 rule (+0.60 per million requests)</td><td>6.00</td></tr>
    <tr><td>Route 53 hosted zone; ACM certificate</td><td>0.50; 0</td></tr>
    <tr><td><strong>Total without NAT</strong></td><td><strong>≈ 70.5</strong></td></tr>
    <tr><td>+ 1 NAT gateway so private machines reach the Internet, 0.059/h (+0.059/GB)</td><td>+ 43.07</td></tr>
  </tbody>
</table>
<p>About 70–115 USD/month for a highly available tier that survives an AZ, a crashed machine and a traffic spike. A single VPS costs a fraction of that and survives none of the three. That is the honest trade-off: you pay AWS for availability and for not doing the operations work yourself. For learning, build it, grade it and delete it the same day.</p>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Level</th><th>What it looks like</th></tr></thead>
  <tbody>
    <tr><td>Not yet</td><td>Grader below 6/8, or anything left after clean-up</td></tr>
    <tr><td>Pass</td><td>8/8, clean-up returns all zeros, you can explain each check</td></tr>
    <tr><td>Good</td><td>+ a Route 53 alias for <code>api.labflow.example</code> to the ALB, and the real-traffic labs of 5.1–5.5 re-run with your own changes</td></tr>
    <tr><td>Excellent</td><td>+ the same stack in Terraform (preview of Chapter 11) and a written one-page design note: what fails if an AZ goes down, and what it costs per month</td></tr>
  </tbody>
</table>

<h3>🎤 Five interview questions for this chapter</h3>
<ol>
  <li><strong>Design a highly available web tier on AWS.</strong> — Route 53 alias → (CloudFront + WAF) → ALB in two public subnets → ASG in two private subnets (min 2, ELB health checks, target tracking) → database in private subnets (Chapter 6). Stateless app; HTTPS with ACM; SG chaining.</li>
  <li><strong>ALB returns 502, 503 or 504 — what does each mean?</strong> — 502: the target closed the connection or sent an invalid response (app crashed mid-request, wrong port/protocol). 503: no healthy target. 504: the target did not answer within the idle timeout (slow query, deadlock).</li>
  <li><strong>How do you deploy a new version with no downtime?</strong> — New launch template version + ASG instance refresh (or ECS rolling/blue-green): new targets become healthy before old ones are drained; deregistration delay lets in-flight requests finish.</li>
  <li><strong>We put CloudFront in front but attackers still hit the ALB directly. Fix it.</strong> — Allow only CloudFront's managed prefix list in the ALB security group and require a secret custom header in an ALB rule (or use VPC origins); WAF on CloudFront.</li>
  <li><strong>The site is slow for users in Europe; the API runs in Singapore. Options?</strong> — CloudFront for static content and cacheable GETs, correct Cache-Control; latency-based Route 53 routing to a second region only if the data model allows it; measure first.</li>
</ol>

<h3>🧪 Practice — this lab is the practice</h3>
<p>Do it twice: once with the CLI as above, once later in Terraform (Chapter 11). The grader does not care which tool you use — that is the point of grading configuration, not commands.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Grader (cham.sh)</span><span class="v">Script that turns the brief into 8 objective checks.</span></div>
  <div class="kv"><span class="k">SG chaining</span><span class="v">A security group rule whose source is another security group, not an IP range.</span></div>
  <div class="kv"><span class="k">Redirect action</span><span class="v">ALB listener action answering 301/302 to another protocol, host or path.</span></div>
  <div class="kv"><span class="k">TLS security policy</span><span class="v">The protocols and ciphers an HTTPS listener accepts (e.g. TLS 1.3 + 1.2).</span></div>
  <div class="kv"><span class="k">force-delete</span><span class="v">Deletes an ASG together with its instances.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The production web tier is a checklist: 2 AZs, HTTPS + redirect, real health checks, ASG with ELB checks and a policy, SG chaining, WAF.</li>
  <li>A grader turns “looks fine” into 8 yes/no answers.</li>
  <li>Clean up in dependency order and prove it — an idle ALB still bills.</li>
  <li>High availability costs money every hour; know the number before you build.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html', '🔐', 'AWS docs — Listeners, redirects and TLS policies', 'Everything a listener can do.')}
${tl('https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html', '🔄', 'AWS docs — Instance refresh', 'Rolling a new launch template version without downtime.')}

<h3>Sources</h3>
<ul>
  <li>ALB listeners and redirect actions: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html</a></li>
  <li>Auto Scaling health checks: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html</a></li>
  <li>Restricting an ALB to CloudFront: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html</a></li>
  <li>Prices: <a href="https://aws.amazon.com/elasticloadbalancing/pricing/" target="_blank" rel="noopener">aws.amazon.com/elasticloadbalancing/pricing/</a> · <a href="https://aws.amazon.com/waf/pricing/" target="_blank" rel="noopener">aws.amazon.com/waf/pricing/</a> · <a href="https://aws.amazon.com/route53/pricing/" target="_blank" rel="noopener">aws.amazon.com/route53/pricing/</a></li>
</ul>
</div>
`;
const L56_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 6</span>
<h2>5.6 — Lab chương 5: đưa API LabFlow ra Internet theo kiểu production</h2>
<p class="lead">Giờ bạn đã có mọi mảnh của một tầng web công khai: ALB, Auto Scaling, Route 53, ACM, CloudFront và WAF. Lab này yêu cầu bạn lắp phần lõi của nó cho API đặt lịch LabFlow và chứng minh bằng một bộ chấm 8 phép kiểm khách quan — đúng những phép kiểm một kỹ sư lâu năm sẽ chạy trong buổi duyệt thiết kế. Rồi bạn tính giá, dỡ bỏ và chứng minh không còn gì đang tính tiền.</p>

<h3>Đề bài</h3>
<ol>
  <li>Một <strong>ALB internet-facing</strong> tên <code>labflow-alb</code> ở hai subnet thuộc hai AZ.</li>
  <li>Một listener ở <strong>443 HTTPS</strong> gắn chứng chỉ ACM cho <code>api.labflow.example</code> và chính sách TLS hiện đại.</li>
  <li>Listener ở <strong>80</strong> chỉ chuyển hướng 301 sang HTTPS.</li>
  <li>Target group <code>tg-api</code> cổng 3000, health check gọi <code>/health</code> và đòi mã 200.</li>
  <li>Một <strong>Auto Scaling group</strong> <code>labflow-asg</code>: min 2, max 4, subnet ở hai AZ, health check type ELB, gắn vào <code>tg-api</code>, launch template bật IMDSv2.</li>
  <li>Một chính sách co giãn <strong>target tracking</strong>.</li>
  <li>Security group của app <code>labflow-app-sg</code> chỉ nhận cổng 3000 <strong>từ security group của ALB</strong> <code>labflow-alb-sg</code>.</li>
  <li>Một <strong>web ACL của WAF</strong> gắn vào ALB, có ít nhất một luật rate-based.</li>
</ol>

<h3>Bộ chấm</h3>
<p>Mỗi phép kiểm đọc cấu hình qua AWS CLI, nên chạy được nguyên vẹn trên tài khoản thật (bỏ endpoint của bộ giả lập). Ở đây nó chạy trên Moto.</p>
${MA_CHAM}

<h3>Chạy thử trên bản làm vội trước</h3>
<p>Đây là dáng vẻ thường gặp của lần thử đầu tiên khi bị dí hạn — nó “chạy được”: ALB trả lời ở cổng 80 và chuyển tới một máy.</p>
${MA_TRUOC}
${OUT_56_TRUOC}
<p>Một trên tám. Đọc các phép trượt như người duyệt thiết kế: không có HTTPS; HTTP phục vụ luôn app thay vì chuyển hướng; health check gọi <code>/</code>, thứ có thể trả 200 trong khi API đã hỏng; một máy, một AZ, health check kiểu EC2 — sập một lần là chết tới khi có người để ý; không co giãn; cổng 3000 mở cho cả Internet, nên ai cũng đi vòng được ALB (và WAF của nó); không có WAF.</p>
${OUT_56_DON1}

<div class="callout warn"><p><strong>Dừng ở đây.</strong> Tự viết bản của bạn và chạy bộ chấm tới khi ra 8/8. Rồi mới so với lời giải bên dưới.</p></div>

${giai('Lời giải: giai.sh, bộ chấm 8/8, dọn và kiểm hoá đơn', MA_GIAI + OUT_56_GIAI + MA_DON + MA_CONGI)}

<h3>Dọn — và chứng minh</h3>
<p>Thứ tự quan trọng, vì tài nguyên phụ thuộc lẫn nhau: gỡ và xoá web ACL ⇒ xoá ASG với <code>--force-delete</code> (nó terminate luôn các máy) ⇒ listener ⇒ load balancer ⇒ target group ⇒ launch template ⇒ security group (của app trước, vì nó tham chiếu nhóm của ALB) ⇒ chứng chỉ. Rồi <code>con-gi.sh</code> liệt kê thứ còn có thể tính tiền: ALB tốn tiền mỗi giờ <em>kể cả khi không có lưu lượng</em>, và một ASG bị bỏ quên với min 2 sẽ dựng lại những máy bạn terminate bằng tay.</p>

<h3>Cái này tốn bao nhiêu?</h3>
<table>
  <thead><tr><th>Hạng mục (Singapore, 730 giờ/tháng)</th><th>USD/tháng</th></tr></thead>
  <tbody>
    <tr><td>ALB 0,0252/giờ</td><td>18,40</td></tr>
    <tr><td>Mức dùng ALB ≈ 1 LCU × 0,008/giờ</td><td>5,84</td></tr>
    <tr><td>2 × t4g.small 0,0212/giờ</td><td>30,95</td></tr>
    <tr><td>2 × 8 GB gp3 0,096/GB</td><td>1,54</td></tr>
    <tr><td>IPv4 public của ALB, 2 × 0,005/giờ</td><td>7,30</td></tr>
    <tr><td>WAF: 1 web ACL + 1 luật (+0,60 mỗi triệu yêu cầu)</td><td>6,00</td></tr>
    <tr><td>Hosted zone Route 53; chứng chỉ ACM</td><td>0,50; 0</td></tr>
    <tr><td><strong>Tổng khi không có NAT</strong></td><td><strong>≈ 70,5</strong></td></tr>
    <tr><td>+ 1 NAT gateway để máy private ra được Internet, 0,059/giờ (+0,059/GB)</td><td>+ 43,07</td></tr>
  </tbody>
</table>
<p>Khoảng 70–115 USD/tháng cho một tầng web sẵn sàng cao, sống sót khi mất một AZ, khi một máy sập và khi lưu lượng tăng vọt. Một VPS đơn lẻ tốn một phần nhỏ số đó và không sống sót được cái nào trong ba. Đó là sự đánh đổi thật: bạn trả AWS cho độ sẵn sàng và cho việc không phải tự làm phần vận hành. Để học, hãy dựng, chấm và xoá ngay trong ngày.</p>

<h3>Thang chấm</h3>
<table>
  <thead><tr><th>Mức</th><th>Trông như thế nào</th></tr></thead>
  <tbody>
    <tr><td>Chưa đạt</td><td>Bộ chấm dưới 6/8, hoặc còn sót tài nguyên sau khi dọn</td></tr>
    <tr><td>Đạt</td><td>8/8, dọn xong mọi dòng về 0, giải thích được từng phép kiểm</td></tr>
    <tr><td>Khá</td><td>+ bản ghi alias Route 53 cho <code>api.labflow.example</code> trỏ vào ALB, và chạy lại các lab lưu lượng thật của 5.1–5.5 với thay đổi của chính bạn</td></tr>
    <tr><td>Giỏi</td><td>+ cùng hệ thống đó viết bằng Terraform (xem trước Chương 11) và một trang ghi chú thiết kế: mất một AZ thì hỏng gì, và mỗi tháng tốn bao nhiêu</td></tr>
  </tbody>
</table>

<h3>🎤 Năm câu phỏng vấn của chương này</h3>
<ol>
  <li><strong>Thiết kế một tầng web sẵn sàng cao trên AWS.</strong> — Alias Route 53 ⇒ (CloudFront + WAF) ⇒ ALB ở hai subnet public ⇒ ASG ở hai subnet private (min 2, health check ELB, target tracking) ⇒ cơ sở dữ liệu ở subnet private (Chương 6). App stateless; HTTPS bằng ACM; SG nối chuỗi.</li>
  <li><strong>ALB trả 502, 503 hay 504 — mỗi mã nghĩa là gì?</strong> — 502: máy đích đóng kết nối hoặc gửi câu trả lời hỏng (app sập giữa chừng, sai cổng/giao thức). 503: không còn máy khoẻ. 504: máy đích không trả lời trong thời gian chờ (truy vấn chậm, deadlock).</li>
  <li><strong>Deploy bản mới không gián đoạn thế nào?</strong> — Phiên bản launch template mới + instance refresh của ASG (hoặc rolling/blue-green của ECS): máy mới khoẻ rồi máy cũ mới được rút êm; deregistration delay để yêu cầu đang chạy làm nốt.</li>
  <li><strong>Đã đặt CloudFront phía trước mà kẻ tấn công vẫn đánh thẳng vào ALB. Sửa thế nào?</strong> — Security group của ALB chỉ cho prefix list của CloudFront và bắt một header bí mật trong luật ALB (hoặc dùng VPC origin); WAF đặt ở CloudFront.</li>
  <li><strong>Web chậm với người dùng ở châu Âu, API chạy ở Singapore. Có những cách nào?</strong> — CloudFront cho nội dung tĩnh và GET cache được, Cache-Control đúng; định tuyến Route 53 theo độ trễ sang region thứ hai chỉ khi mô hình dữ liệu cho phép; đo trước đã.</li>
</ol>

<h3>🧪 Thực hành — chính lab này là bài thực hành</h3>
<p>Làm hai lần: một lần bằng CLI như trên, một lần sau bằng Terraform (Chương 11). Bộ chấm không quan tâm bạn dùng công cụ gì — đó chính là lý do chấm cấu hình chứ không chấm câu lệnh.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bộ chấm (cham.sh)</span><span class="v">Script biến đề bài thành 8 phép kiểm khách quan.</span></div>
  <div class="kv"><span class="k">SG nối chuỗi</span><span class="v">Luật security group có nguồn là một security group khác, không phải dải IP.</span></div>
  <div class="kv"><span class="k">Hành động redirect</span><span class="v">Hành động của listener ALB trả 301/302 sang giao thức, host hay đường dẫn khác.</span></div>
  <div class="kv"><span class="k">Chính sách TLS</span><span class="v">Các giao thức và bộ mã hoá mà listener HTTPS chấp nhận (ví dụ TLS 1.3 + 1.2).</span></div>
  <div class="kv"><span class="k">force-delete</span><span class="v">Xoá ASG cùng toàn bộ máy của nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Tầng web production là một danh sách kiểm: 2 AZ, HTTPS + chuyển hướng, health check thật, ASG kiểm kiểu ELB và có chính sách, SG nối chuỗi, WAF.</li>
  <li>Bộ chấm biến “trông ổn” thành 8 câu trả lời có/không.</li>
  <li>Dọn theo thứ tự phụ thuộc và chứng minh — ALB không ai gọi vẫn tính tiền.</li>
  <li>Sẵn sàng cao tốn tiền mỗi giờ; biết con số trước khi dựng.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html', '🔐', 'Tài liệu AWS — Listener, redirect và chính sách TLS', 'Mọi thứ một listener làm được.')}
${tl('https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html', '🔄', 'Tài liệu AWS — Instance refresh', 'Thay sang phiên bản launch template mới mà không gián đoạn.')}

<h3>Nguồn</h3>
<ul>
  <li>Listener và hành động redirect của ALB: <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html" target="_blank" rel="noopener">docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html</a></li>
  <li>Health check của Auto Scaling: <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html" target="_blank" rel="noopener">docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html</a></li>
  <li>Chỉ cho CloudFront gọi ALB: <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/elasticloadbalancing/pricing/" target="_blank" rel="noopener">aws.amazon.com/elasticloadbalancing/pricing/</a> · <a href="https://aws.amazon.com/waf/pricing/" target="_blank" rel="noopener">aws.amazon.com/waf/pricing/</a> · <a href="https://aws.amazon.com/route53/pricing/" target="_blank" rel="noopener">aws.amazon.com/route53/pricing/</a></li>
</ul>
</div>
`;
/* ═════ 5.7 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [1, 3, 0, 2, 1, 0, 3, 2, 0, 3];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ5 = [
  Q('Both targets in tg-api fail their health check. What does the ALB answer?|||Cả hai máy trong tg-api trượt health check. ALB trả lời gì?', [
    '502 Bad Gateway|||502 Bad Gateway',
    '503 Service Unavailable|||503 Service Unavailable',
    'It keeps sending traffic to the less broken one|||Vẫn gửi cho máy đỡ hỏng hơn',
    '404 Not Found|||404 Not Found',
  ], 1),
  Q('Why must an ALB be placed in at least two subnets?|||Vì sao ALB phải đặt ở ít nhất hai subnet?', [
    'To get two public IPs for the same price|||Để có hai IP public cùng giá',
    'Two subnets in two different AZs, so it survives an AZ failure|||Hai subnet ở hai AZ khác nhau, để sống sót khi mất một AZ',
    'One subnet for HTTP, one for HTTPS|||Một subnet cho HTTP, một cho HTTPS',
    'It is only a Moto requirement|||Đó chỉ là yêu cầu của Moto',
  ], 1),
  Q('An attacker sends "X-Forwarded-For: 1.2.3.4". Which value should your app trust as the client IP behind one ALB?|||Kẻ tấn công gửi "X-Forwarded-For: 1.2.3.4". Đứng sau một ALB, app nên tin giá trị nào là IP khách?', [
    'The first value, 1.2.3.4|||Giá trị đầu, 1.2.3.4',
    'The last value, added by the ALB|||Giá trị cuối, do ALB thêm vào',
    'Any value, they are all equal|||Giá trị nào cũng được',
    'The ALB address 10.145.0.10|||Địa chỉ ALB 10.145.0.10',
  ], 1),
  Q('Your app process crashed but the VM still runs. The ASG never replaces it. Most likely cause?|||Tiến trình app chết nhưng máy ảo vẫn chạy. ASG không bao giờ thay nó. Nguyên nhân khả dĩ nhất?', [
    'Max size is too small|||Max quá nhỏ',
    'The health check type is EC2 instead of ELB|||Health check type là EC2 thay vì ELB',
    'Target tracking is set to 50%|||Target tracking đặt 50%',
    'The launch template uses IMDSv2|||Launch template bật IMDSv2',
  ], 1),
  Q('In the asg.sh run, 196 requests/s with a target of 15 per machine gave desired = 4. Why not 14?|||Trong lần chạy asg.sh, 196 yêu cầu/giây với mục tiêu 15 mỗi máy cho desired = 4. Vì sao không phải 14?', [
    'Because of the cooldown|||Vì thời gian nghỉ',
    'Because max = 4 caps it — max is also the cost cap|||Vì max = 4 chặn lại — max cũng là trần chi phí',
    'Because only two AZs exist|||Vì chỉ có hai AZ',
    'Because HAProxy limits connections|||Vì HAProxy giới hạn kết nối',
  ], 1),
  Q('Where can a CNAME NOT be placed?|||CNAME KHÔNG được đặt ở đâu?', [
    'At www.labflow.example|||Ở www.labflow.example',
    'At the zone apex labflow.example — use an alias record there|||Ở đỉnh zone labflow.example — ở đó dùng bản ghi alias',
    'In a private hosted zone|||Trong hosted zone private',
    'For an ACM validation record|||Cho bản ghi xác thực ACM',
  ], 1),
  Q('You changed an A record with TTL 30. Right after the change the resolver still answers the old IP. What happens next?|||Bạn sửa một bản ghi A có TTL 30. Ngay sau đó resolver vẫn trả IP cũ. Chuyện gì xảy ra tiếp?', [
    'It keeps the old IP for 48 hours|||Giữ IP cũ 48 giờ',
    'It switches to the new IP when the cached answer\'s TTL runs out|||Đổi sang IP mới khi TTL của câu trả lời trong cache hết',
    'You must invalidate the DNS cache in Route 53|||Phải invalidate cache DNS trong Route 53',
    'Route 53 rejects the change until the TTL ends|||Route 53 từ chối thay đổi tới khi hết TTL',
  ], 1),
  Q('You use an ACM certificate on CloudFront. Which region must the certificate be in?|||Bạn dùng chứng chỉ ACM trên CloudFront. Chứng chỉ phải ở region nào?', [
    'The region of your ALB|||Region của ALB',
    'us-east-1 (N. Virginia)|||us-east-1 (N. Virginia)',
    'Any region — CloudFront is global|||Region nào cũng được — CloudFront là toàn cầu',
    'ap-southeast-1, closest to Vietnam|||ap-southeast-1, gần Việt Nam nhất',
  ], 1),
  Q('In the edge-cache lab, the origin shipped version 2 but app.css still showed version 1. Which fix also avoids the problem next time?|||Trong lab edge cache, origin đã lên bản 2 mà app.css vẫn hiện bản 1. Cách sửa nào còn tránh được lần sau?', [
    'Lower max-age to 0 for everything|||Hạ max-age về 0 cho mọi thứ',
    'Put a content hash in asset file names; invalidate only HTML|||Gắn mã băm nội dung vào tên tệp tài nguyên; chỉ invalidate HTML',
    'Add ?v=2 while the cache key ignores query strings|||Thêm ?v=2 trong khi khoá cache bỏ qua query string',
    'Restart the origin|||Khởi động lại origin',
  ], 1),
  Q('Five bots each sent 15 requests and all 75 passed the per-IP rate limit of 20 per 10 s. What does this show?|||Năm bot mỗi con gửi 15 yêu cầu và cả 75 lọt qua giới hạn 20 yêu cầu/10 giây theo IP. Điều này cho thấy gì?', [
    'The rate rule was in Count mode|||Luật tần suất đang ở chế độ Count',
    'Per-IP limits do not stop distributed attacks; layer reputation lists, bot challenges, caching and Shield|||Giới hạn theo IP không chặn được tấn công phân tán; phải chồng danh sách IP xấu, thử thách bot, cache và Shield',
    'WAF cannot inspect HTTP|||WAF không đọc được HTTP',
    'Shield Advanced is required for any rate limit|||Muốn giới hạn tần suất phải có Shield Advanced',
  ], 1),
];

export default {
  title: 'Chapter 5 — Going public: load balancers, scaling, DNS and CDN|||Chương 5 — Ra Internet: load balancer, co giãn, DNS và CDN',
  description: 'Tầng web công khai trên AWS, chạy thật bằng Docker: ALB (listener, luật path/host, target group, health check, 503, X-Forwarded-For, desync), Auto Scaling group (target tracking, thêm nhanh bớt chậm, rút êm, thay máy hỏng — 7.859 yêu cầu 0 lỗi), Route 53 (alias ở đỉnh zone, weighted, failover, TTL và “lan truyền”) + ACM (xác thực DNS, HTTPS, chuyển hướng 301), CloudFront (HIT/MISS, khoá cache, invalidation, OAC, stale-if-error), WAF và Shield (Count ⇒ Block, giới hạn tần suất, botnet, ba trận DDoS có tên); lab chấm 8 phép + bảng giá tháng.',
  lessons: [
    {
      title: '5.1 — Application Load Balancer|||5.1 — Application Load Balancer',
      slug: 'aws-5-1-alb',
      type: 'LESSON',
      isFreePreview: true,
      description: 'ALB như quầy tiếp đón: listener, luật theo đường dẫn/host, target group, health check; lưu lượng thật qua HAProxy — round robin, máy hỏng bị loại, 503 khi hết máy khoẻ, X-Forwarded-For; ALB so với NLB; góc hacker giả XFF và desync.',
      content: L51_EN + L51_VI,
    },
    {
      title: '5.2 — Auto Scaling groups|||5.2 — Auto Scaling group',
      slug: 'aws-5-2-auto-scaling',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Min/desired/max, health check ELB, target tracking; ASG thu nhỏ chạy thật dưới tải: 2 ⇒ 4 ⇒ 2 máy, rút êm, tự thay máy hỏng, 0 yêu cầu lỗi; chính sách co giãn; denial of wallet.',
      content: L52_EN + L52_VI,
    },
    {
      title: '5.3 — Route 53 and ACM certificates|||5.3 — Route 53 và chứng chỉ ACM',
      slug: 'aws-5-3-route53',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hosted zone, alias ở đỉnh zone, weighted/failover; hỏi DNS thật bằng dig (CoreDNS phục vụ zone chép từ Route 53): TTL đếm ngược, “lan truyền” là cache; ACM xác thực DNS, HTTPS thật: 301, lỗi chứng chỉ, SAN, HSTS; chiếm BGP 2018, DDoS Route 53 2019.',
      content: L53_EN + L53_VI,
    },
    {
      title: '5.4 — CloudFront CDN|||5.4 — CDN CloudFront',
      slug: 'aws-5-4-cloudfront',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Distribution, origin, cache behavior, OAC cho S3; edge cache thật: MISS 0,3 s ⇒ HIT 1 ms, khoá cache bỏ query string, TTL, invalidation so với tên tệp có mã băm, STALE khi origin sập; Web Cache Deception 2017.',
      content: L54_EN + L54_VI,
    },
    {
      title: '5.5 — WAF, Shield and DDoS on AWS|||5.5 — WAF, Shield và DDoS trên AWS',
      slug: 'aws-5-5-waf-ddos',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Web ACL: IP set, nhóm luật managed, luật rate-based; chạy thật Count ⇒ Block (403/429) trong khi người dùng thường vẫn vào, botnet 5 IP lọt giới hạn theo IP; Shield Standard/Advanced; GitHub 2018, AWS 2,3 Tbps 2020, HTTP/2 Rapid Reset 2023.',
      content: L55_EN + L55_VI,
    },
    {
      title: '5.6 — Chapter 5 lab + interview questions|||5.6 — Lab chương 5 + câu hỏi phỏng vấn',
      slug: 'aws-5-6-lab-5',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tầng web LabFlow qua bộ chấm 8 phép: bản vội 1/8 ⇒ lời giải 8/8 (ALB 2 AZ, HTTPS + 301, /health, ASG ELB + target tracking, SG nối chuỗi, WAF) ⇒ dọn ⇒ kiểm còn gì tính tiền; bảng giá tháng; 5 câu phỏng vấn.',
      content: L56_EN + L56_VI,
    },
    {
      title: '5.7 — Chapter 5 quiz|||5.7 — Kiểm tra Chương 5',
      slug: 'aws-5-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về 503, ALB hai AZ, X-Forwarded-For, health check ELB, max của ASG, CNAME ở đỉnh zone, TTL, chứng chỉ CloudFront, invalidation và giới hạn tần suất theo IP.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ5 },
    },
  ],
};
