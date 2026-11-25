#!/usr/bin/env python3
"""tao-mau.py <thư mục> — sinh bản ghi CloudTrail và VPC Flow Logs MẪU cho bài 13.4, đúng cấu trúc trong tài liệu AWS
(CloudTrail record contents; flow log mặc định phiên bản 2). Tất định. Tài khoản 111122223333, khoá AKIAIOSFODNN7EXAMPLE là giá trị
ví dụ chính AWS dùng trong tài liệu; IP thuộc dải tài liệu RFC 5737 / 10.x. KHÔNG phải log thật của ai."""
import json, os, sys, random
out = sys.argv[1]; os.makedirs(out, exist_ok=True); rnd = random.Random(1324)
ACC = "111122223333"
def uid(user, key, kind="IAMUser"):
    return {"type": kind, "principalId": "AIDA" + user.upper().ljust(17, "X")[:17], "arn": f"arn:aws:iam::{ACC}:user/{user}",
            "accountId": ACC, "accessKeyId": key, "userName": user}
def ev(t, user, key, src, name, ip, ua, err=None, ro=True, req=None, resp=None, extra=None):
    r = {"eventVersion": "1.11", "userIdentity": uid(user, key), "eventTime": f"2026-11-23T{t}Z", "eventSource": src, "eventName": name,
         "awsRegion": "ap-southeast-1", "sourceIPAddress": ip, "userAgent": ua, "requestParameters": req, "responseElements": resp,
         "requestID": "%08x-%04x-%04x-%04x-%012x" % tuple(rnd.getrandbits(b) for b in (32, 16, 16, 16, 48)),
         "eventID": "%08x-%04x-%04x-%04x-%012x" % tuple(rnd.getrandbits(b) for b in (32, 16, 16, 16, 48)),
         "readOnly": ro, "eventType": "AwsApiCall", "managementEvent": True, "recipientAccountId": ACC, "eventCategory": "Management"}
    if err: r["errorCode"], r["errorMessage"] = err, f"User: arn:aws:iam::{ACC}:user/{user} is not authorized to perform: {name}"
    if extra: r.update(extra)
    return r
CLI = "aws-cli/2.32.0 md/awscrt#0.27.6 ua/2.1 os/linux#6.8.0 md/arch#x86_64 lang/python#3.13.9"
WEB = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36"
R = []
# người thật, văn phòng 198.51.100.20
R.append(ev("01:58:02", "an", "ASIAEXAMPLEAN0000001", "signin.amazonaws.com", "ConsoleLogin", "198.51.100.20", WEB, ro=False,
            resp={"ConsoleLogin": "Success"}, extra={"additionalEventData": {"MFAUsed": "Yes", "LoginTo": "https://console.aws.amazon.com/"}, "eventType": "AwsConsoleSignIn"}))
R.append(ev("02:03:40", "an", "ASIAEXAMPLEAN0000001", "logs.amazonaws.com", "DescribeLogGroups", "198.51.100.20", WEB))
# khoá CI bị lộ, kẻ lạ 203.0.113.50
K = "AKIAIOSFODNN7EXAMPLE"
R.append(ev("02:41:07", "ci-deploy", K, "sts.amazonaws.com", "GetCallerIdentity", "203.0.113.50", CLI))
R.append(ev("02:41:12", "ci-deploy", K, "s3.amazonaws.com", "ListBuckets", "203.0.113.50", CLI))
for i, n in enumerate(["ListUsers", "ListRoles", "GetAccountAuthorizationDetails", "ListAttachedUserPolicies"]):
    R.append(ev(f"02:41:{20+i*3:02d}", "ci-deploy", K, "iam.amazonaws.com", n, "203.0.113.50", CLI, err="AccessDenied"))
R.append(ev("02:42:05", "ci-deploy", K, "cloudtrail.amazonaws.com", "DescribeTrails", "203.0.113.50", CLI))
R.append(ev("02:42:09", "ci-deploy", K, "cloudtrail.amazonaws.com", "StopLogging", "203.0.113.50", CLI, ro=False,
            req={"name": f"arn:aws:cloudtrail:ap-southeast-1:{ACC}:trail/org-trail"}))
R.append(ev("02:42:31", "ci-deploy", K, "ec2.amazonaws.com", "DeleteFlowLogs", "203.0.113.50", CLI, ro=False, req={"flowLogIds": ["fl-0abc1234def567890"]}))
R.append(ev("02:43:02", "ci-deploy", K, "s3.amazonaws.com", "GetBucketAcl", "203.0.113.50", CLI, req={"bucketName": "shop-backup-prod"}))
R.append(ev("02:43:40", "ci-deploy", K, "ec2.amazonaws.com", "RunInstances", "203.0.113.50", CLI, ro=False, err="Client.UnauthorizedOperation",
            req={"instanceType": "p4d.24xlarge", "minCount": 8}))
R.append(ev("08:12:55", "an", "ASIAEXAMPLEAN0000002", "cloudtrail.amazonaws.com", "StartLogging", "198.51.100.20", WEB, ro=False,
            req={"name": f"arn:aws:cloudtrail:ap-southeast-1:{ACC}:trail/org-trail"}))
json.dump({"Records": R}, open(os.path.join(out, "cloudtrail-20261123.json"), "w"), ensure_ascii=False, indent=1)
# VPC Flow Logs, định dạng mặc định v2:
# version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status
L = []; t0 = 1795399200  # 2026-11-23 02:00:00 UTC
ENI, WEBIP, DBIP = "eni-0a1b2c3d4e5f60718", "10.0.1.15", "10.0.2.30"
for i in range(40):  # khách thật vào 443
    s = t0 + i * 60
    L.append(f"2 {ACC} {ENI} 198.51.100.{rnd.randint(30,99)} {WEBIP} {rnd.randint(40000,65000)} 443 6 {rnd.randint(8,40)} {rnd.randint(3000,90000)} {s} {s+60} ACCEPT OK")
for i in range(60):  # dò SSH từ hai IP lạ, security group chặn
    s = t0 + 300 + i * 20
    src = "203.0.113.50" if i % 3 else "203.0.113.77"
    L.append(f"2 {ACC} {ENI} {src} {WEBIP} {rnd.randint(30000,60000)} 22 6 1 60 {s} {s+60} REJECT OK")
for i in range(6):  # PostgreSQL mở ra Internet — được ACCEPT (cấu hình sai)
    s = t0 + 2400 + i * 30
    L.append(f"2 {ACC} eni-0f9e8d7c6b5a40312 203.0.113.50 {DBIP} {rnd.randint(30000,60000)} 5432 6 {rnd.randint(10,25)} {rnd.randint(1500,9000)} {s} {s+60} ACCEPT OK")
L.append(f"2 {ACC} eni-0f9e8d7c6b5a40312 - - - - - - - {t0+1200} {t0+1260} - NODATA")
L.append(f"2 {ACC} eni-0f9e8d7c6b5a40312 - - - - - - - {t0+1260} {t0+1320} - SKIPDATA")
L.sort(key=lambda x: int(x.split()[10]))
open(os.path.join(out, "flow-20261123.log"), "w").write("version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status\n" + "\n".join(L) + "\n")
print(f"{len(R)} sự kiện CloudTrail, {len(L)} dòng flow log")
