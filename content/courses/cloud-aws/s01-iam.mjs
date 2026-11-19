/**
 * Cloud AWS — Chương 1: Danh tính và quyền truy cập (IAM) (soạn 19/11/2026, agent aws trên máy nhà).
 * GIỮ title chương + slug bài đầu aws-1-1-khai-niem (seeder neo chương bằng slug bài đầu). Thứ tự bài theo khung mới (cloud-aws.mjs):
 *   1.1 khai-niem · 1.2 doc-policy · 1.3 toi-thieu · 1.4 khoa · 1.5 role-sts · 1.6 oidc · 1.7 lo-khoa · 1.8 lab-1 · 1.9 quiz.
 *   (prod khung cũ có aws-1-2-toi-thieu, aws-1-3-khoa, aws-1-4-oidc ⇒ mồ côi, điều phối gỡ khi deploy.)
 * Mọi output chạy THẬT 19/11/2026 bằng scratchpad/aws/lab/c1/chay.sh: AWS CLI 2.41.0 → Moto (motoserver/moto) BẬT KIỂM QUYỀN
 *   (MOTO_IAM_LOAD_MANAGED_POLICIES=true + POST /moto-api/reset-auth "0"). Moto kiểm Allow/Deny theo Action+Resource, deny tường minh,
 *   trust policy khi AssumeRole, khoá tạm STS, khoá đã xoá. Moto KHÔNG kiểm Condition, permission boundary, khoá Inactive; không có
 *   policy simulator, CloudTrail lookup ⇒ bài ghi rõ "trên tài khoản thật" ở các chỗ đó. khop-sub.mjs = minh hoạ luật so chuỗi.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/yml()/hcl()/js() của _chung.mjs.
 */
import { bash, json, yml, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (Moto có kiểm quyền, 19/11/2026 — scratchpad/aws/lab/c1/chay.sh) ═════ */
const OUT_11_DUNG = out("[quan-tri] $ aws sts get-caller-identity --query Arn --output text\narn:aws:iam::123456789012:user/quan-tri\n[quan-tri] $ aws iam create-group --group-name dev --query Group.Arn --output text\narn:aws:iam::123456789012:group/dev\n[quan-tri] $ aws iam create-user --user-name an-dev --query User.Arn --output text\narn:aws:iam::123456789012:user/an-dev\n[quan-tri] $ aws iam add-user-to-group --group-name dev --user-name an-dev\n[quan-tri] $ aws iam create-policy --policy-name labflow-doc-anh --policy-document file://doc-anh.json --query Policy.Arn --output text\narn:aws:iam::123456789012:policy/labflow-doc-anh\n[quan-tri] $ aws iam attach-group-policy --group-name dev --policy-arn arn:aws:iam::123456789012:policy/labflow-doc-anh\n[quan-tri] $ aws iam create-role --role-name labflow-app --assume-role-policy-document file://tin-ecs.json --query Role.Arn --output text\narn:aws:iam::123456789012:role/labflow-app\n[quan-tri] $ aws iam list-groups-for-user --user-name an-dev --query 'Groups[].GroupName' --output text\ndev\n[quan-tri] $ aws iam list-attached-group-policies --group-name dev --query 'AttachedPolicies[].PolicyArn' --output text\narn:aws:iam::123456789012:policy/labflow-doc-anh");
const OUT_11_DEV = out("[an-dev] $ aws sts get-caller-identity\n{\n    \"UserId\": \"ce6oc1zodsbzo3tqfwbd\",\n    \"Account\": \"123456789012\",\n    \"Arn\": \"arn:aws:iam::123456789012:user/an-dev\"\n}\n[an-dev] $ aws s3 ls s3://labflow-anh --recursive\n2026-11-18 22:46:56         17 bao-cao/thang-10.csv\n2026-11-18 22:46:57         22 bi-mat/luong.csv\n2026-11-18 22:46:55         17 uploads/phong-a1.jpg\n[an-dev] $ aws iam list-users\nAn error occurred (AccessDenied) when calling the ListUsers operation: User: arn:aws:iam::123456789012:user/an-dev is not authorized to perform: iam:ListUsers");
const OUT_12_DANHGIA = out("[quan-tri] $ aws iam create-policy-version --policy-arn arn:aws:iam::123456789012:policy/labflow-doc-anh --policy-document file://doc-anh-tru.json --set-as-default --query PolicyVersion.VersionId --output text\nv2\n[an-dev] $ aws s3 cp s3://labflow-anh/uploads/phong-a1.jpg -\nanh phong lab A1\n[an-dev] $ aws s3 cp s3://labflow-anh/bi-mat/luong.csv -\ndownload failed: s3://labflow-anh/bi-mat/luong.csv to - An error occurred (403) when calling the HeadObject operation: Forbidden\n[an-dev] $ aws s3api get-object --bucket labflow-anh --key bi-mat/luong.csv luong.csv\nAn error occurred (AccessDenied) when calling the GetObject operation: Access Denied\n[an-dev] $ aws s3api put-object --bucket labflow-anh --key uploads/moi.jpg --body a.txt\nAn error occurred (AccessDenied) when calling the PutObject operation: Access Denied\n[an-dev] $ aws s3api delete-object --bucket labflow-anh --key uploads/phong-a1.jpg\nAn error occurred (AccessDenied) when calling the DeleteObject operation: Access Denied");
const OUT_12_SAO = out("[quan-tri] $ aws iam create-user --user-name thuc-tap --query User.Arn --output text\narn:aws:iam::123456789012:user/thuc-tap\n[quan-tri] $ aws iam put-user-policy --user-name thuc-tap --policy-name cho-nhanh --policy-document file://sao.json\n[thuc-tap] $ aws s3 cp s3://labflow-anh/bi-mat/luong.csv -\nten,luong\nan,15000000\n[thuc-tap] $ aws s3 rm s3://labflow-anh/bao-cao/thang-10.csv\ndelete: s3://labflow-anh/bao-cao/thang-10.csv\n[thuc-tap] $ aws s3 ls s3://labflow-anh --recursive\n2026-11-18 22:46:57         22 bi-mat/luong.csv\n2026-11-18 22:46:55         17 uploads/phong-a1.jpg");
const OUT_13_TU0 = out("[bao-cao-bot] $ aws s3 cp s3://labflow-anh/bao-cao/thang-10.csv -\ndownload failed: s3://labflow-anh/bao-cao/thang-10.csv to - An error occurred (403) when calling the HeadObject operation: Forbidden\n[quan-tri] $ aws iam put-user-policy --user-name bao-cao-bot --policy-name doc-bao-cao --policy-document file://bc-2.json\n[bao-cao-bot] $ aws s3 cp s3://labflow-anh/bao-cao/thang-10.csv -\nanh phong lab A1\n[bao-cao-bot] $ aws s3 cp s3://labflow-anh/uploads/phong-a1.jpg -\ndownload failed: s3://labflow-anh/uploads/phong-a1.jpg to - An error occurred (403) when calling the HeadObject operation: Forbidden\n[bao-cao-bot] $ aws s3api put-object --bucket labflow-anh --key bao-cao/sua.csv --body a.txt\nAn error occurred (AccessDenied) when calling the PutObject operation: Access Denied");
const OUT_13_BAOCAO = out("[quan-tri] $ aws iam generate-credential-report --query State --output text\nSTARTED\n[quan-tri] $ aws iam get-credential-report --query Content --output text | base64 -d | cut -d, -f1,9,10,11\nuser,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date\nquan-tri,true,2026-11-18T22:46:59+00:00,2026-11-18T22:47:44+00:00\nan-dev,true,2026-11-18T22:47:12+00:00,2026-11-18T22:47:22+00:00\nthuc-tap,true,2026-11-18T22:47:27+00:00,2026-11-18T22:47:34+00:00\nbao-cao-bot,true,2026-11-18T22:47:34+00:00,2026-11-18T22:47:40+00:00");
const OUT_14_PROFILE = out("$ cat ~/.aws/config\n[profile dev]\nregion = ap-southeast-1\noutput = json\n\n[profile labflow-admin]\nregion = ap-southeast-1\noutput = table\n$ cat ~/.aws/credentials      # (bí mật che bớt khi quay)\n[dev]\naws_access_key_id = AKIA••••••••••••\naws_secret_access_key = MvZT••••••••••••\n\n[labflow-admin]\naws_access_key_id = AKIA••••••••••••\naws_secret_access_key = BU0C••••••••••••\n$ aws configure list --profile dev\nNAME       : VALUE                    : TYPE             : LOCATION\nprofile    : dev                      : manual           : --profile\naccess_key : ****************QXVU     : shared-credentials-file : \nsecret_key : ****************dZl8     : shared-credentials-file : \nregion     : ap-southeast-1           : config-file      : /aws/.aws/config\n$ aws sts get-caller-identity --profile dev --query Arn\n\"arn:aws:iam::123456789012:user/an-dev\"\n$ aws sts get-caller-identity --profile labflow-admin --query Arn --output text\narn:aws:iam::123456789012:user/quan-tri");
const OUT_14_XOAY = out("[quan-tri] $ aws iam list-access-keys --user-name an-dev --query 'AccessKeyMetadata[].[AccessKeyId,Status]' --output text\nAKIAEXAMPLE000000001\tActive\n[quan-tri] $ aws iam create-access-key --user-name an-dev --query 'AccessKey.[AccessKeyId,Status]' --output text\nAKIAEXAMPLE000000002\tActive\n[quan-tri] $ aws iam create-access-key --user-name an-dev --query 'AccessKey.[AccessKeyId,Status]' --output text\nAn error occurred (LimitExceeded) when calling the CreateAccessKey operation: Cannot exceed quota for AccessKeysPerUser: 2\n[quan-tri] $ aws iam update-access-key --user-name an-dev --access-key-id AKIAEXAMPLE000000001 --status Inactive\n[quan-tri] $ aws iam list-access-keys --user-name an-dev --query 'AccessKeyMetadata[].[AccessKeyId,Status]' --output text\nAKIAEXAMPLE000000001\tInactive\nAKIAEXAMPLE000000002\tActive\n[quan-tri] $ aws iam delete-access-key --user-name an-dev --access-key-id AKIAEXAMPLE000000001\n[an-dev] $ aws sts get-caller-identity\nAn error occurred (InvalidClientTokenId) when calling the GetCallerIdentity operation: The security token included in the request is invalid.\n# sửa ~/.aws/credentials sang khoá mới rồi gọi lại\n[an-dev] $ aws sts get-caller-identity --query Arn --output text\narn:aws:iam::123456789012:user/an-dev");
const OUT_15_ASSUME = out("[quan-tri] $ aws iam create-role --role-name doc-bao-cao --assume-role-policy-document file://tin-bc.json --query Role.Arn --output text\narn:aws:iam::123456789012:role/doc-bao-cao\n[quan-tri] $ aws iam attach-role-policy --role-name doc-bao-cao --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess\n[quan-tri] $ aws sts assume-role --role-arn arn:aws:iam::123456789012:role/doc-bao-cao --role-session-name cuong-xem-bao-cao --duration-seconds 900\n{\n    \"Credentials\": {\n        \"AccessKeyId\": \"ASIAEXAMPLE000000001\",\n        \"SecretAccessKey\": \"FhiDZi…\",\n        \"SessionToken\": \"FQoGZXIvYXdzEBYaDX1s… (356 ký tự)\",\n        \"Expiration\": \"2026-11-18T23:03:00.544951+00:00\"\n    },\n    \"AssumedRoleUser\": { \"Arn\": \"arn:aws:sts::123456789012:assumed-role/doc-bao-cao/cuong-xem-bao-cao\" }\n}");
const OUT_15_ROLE = out("[role doc-bao-cao] $ aws sts get-caller-identity --query Arn --output text\narn:aws:sts::123456789012:assumed-role/doc-bao-cao/cuong-xem-bao-cao\n[role doc-bao-cao] $ aws s3 ls s3://labflow-anh/bao-cao/\n2026-11-18 22:47:32         17 thang-10.csv\n[role doc-bao-cao] $ aws s3api put-object --bucket labflow-anh --key bao-cao/sua.csv --body a.txt\nAn error occurred (AccessDenied) when calling the PutObject operation: Access Denied\n[role doc-bao-cao] $ aws iam list-users\nAn error occurred (AccessDenied) when calling the ListUsers operation: User: arn:aws:sts::123456789012:assumed-role/doc-bao-cao/cuong-xem-bao-cao is not authorized to perform: iam:ListUsers");
const OUT_15_TRUST = out("[quan-tri] $ aws iam put-user-policy --user-name bao-cao-bot --policy-name duoc-assume --policy-document file://ar.json\n[bao-cao-bot] $ aws sts assume-role --role-arn arn:aws:iam::123456789012:role/doc-bao-cao --role-session-name bot --query AssumedRoleUser.Arn --output text\nAn error occurred (AccessDenied) when calling the AssumeRole operation: User: arn:aws:iam::123456789012:user/bao-cao-bot is not authorized to perform: sts:AssumeRole\n[quan-tri] $ aws iam update-assume-role-policy --role-name doc-bao-cao --policy-document file://tin-bc2.json\n[bao-cao-bot] $ aws sts assume-role --role-arn arn:aws:iam::123456789012:role/doc-bao-cao --role-session-name bot --query AssumedRoleUser.Arn --output text\narn:aws:sts::123456789012:assumed-role/doc-bao-cao/bot");
const OUT_15_EC2 = out("[quan-tri] $ aws iam create-role --role-name labflow-ec2 --assume-role-policy-document file://tin-ec2.json --query Role.Arn --output text\narn:aws:iam::123456789012:role/labflow-ec2\n[quan-tri] $ aws iam create-instance-profile --instance-profile-name labflow-ec2 --query InstanceProfile.Arn --output text\narn:aws:iam::123456789012:instance-profile/labflow-ec2\n[quan-tri] $ aws iam add-role-to-instance-profile --instance-profile-name labflow-ec2 --role-name labflow-ec2\n[quan-tri] $ aws iam get-instance-profile --instance-profile-name labflow-ec2 --query 'InstanceProfile.Roles[].RoleName' --output text\nlabflow-ec2");
const OUT_16_OIDC = out("[quan-tri] $ aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --query OpenIDConnectProviderArn --output text\narn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com\n[quan-tri] $ aws iam create-role --role-name gha-labflow-deploy --assume-role-policy-document file://tin-gha.json --max-session-duration 3600 --query Role.Arn --output text\narn:aws:iam::123456789012:role/gha-labflow-deploy\n[quan-tri] $ aws iam list-open-id-connect-providers --query 'OpenIDConnectProviderList[].Arn' --output text\narn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com");
const OUT_17_TANCONG = out("# Kẻ tấn công nhặt được khoá của ops-cu (AdministratorAccess) trên một repo công khai\n[ops-cu] $ aws sts get-caller-identity --query Arn --output text\narn:aws:iam::123456789012:user/ops-cu\n[ops-cu] $ aws iam create-user --user-name support-backup --query User.Arn --output text\narn:aws:iam::123456789012:user/support-backup\n[ops-cu] $ aws iam attach-user-policy --user-name support-backup --policy-arn arn:aws:iam::aws:policy/AdministratorAccess\n[ops-cu] $ aws iam create-access-key --user-name support-backup --query AccessKey.AccessKeyId --output text\nAKIAEXAMPLE000000003");
const OUT_17_XOA = out("# Người trực sự cố: vô hiệu rồi xoá khoá lộ\n[quan-tri] $ aws iam update-access-key --user-name ops-cu --access-key-id AKIAEXAMPLE000000004 --status Inactive\n[quan-tri] $ aws iam delete-access-key --user-name ops-cu --access-key-id AKIAEXAMPLE000000004\n[ops-cu] $ aws sts get-caller-identity\nAn error occurred (InvalidClientTokenId) when calling the GetCallerIdentity operation: The security token included in the request is invalid.\n# …nhưng cửa sau vẫn mở:\n[support-backup] $ aws sts get-caller-identity --query Arn --output text\narn:aws:iam::123456789012:user/support-backup");
const OUT_17_SAN = out("# Săn cửa sau: user mới nhất, ai có AdministratorAccess\n[quan-tri] $ aws iam list-users --query 'sort_by(Users,&CreateDate)[-3:].[UserName,CreateDate]' --output text\nbao-cao-bot\t2026-11-18T22:47:33.226244+00:00\nops-cu\t2026-11-18T22:48:20.065100+00:00\nsupport-backup\t2026-11-18T22:48:25.374740+00:00\n[quan-tri] $ aws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess --query 'PolicyUsers[].UserName' --output text\nquan-tri\tops-cu\tsupport-backup\n[quan-tri] $ aws iam delete-access-key --user-name support-backup --access-key-id AKIAEXAMPLE000000003\n[quan-tri] $ aws iam detach-user-policy --user-name support-backup --policy-arn arn:aws:iam::aws:policy/AdministratorAccess\n[quan-tri] $ aws iam delete-user --user-name support-backup\n[support-backup] $ aws sts get-caller-identity\nAn error occurred (InvalidClientTokenId) when calling the GetCallerIdentity operation: The security token included in the request is invalid.");
const OUT_18_MATRAN = out("# Ma trận kiểm quyền (✓ = được, ✗ = AccessDenied)\nan-dev       đọc uploads/phong-a1.jpg           ✓\nan-dev       đọc bi-mat/luong.csv               ✗\nan-dev       ghi uploads/moi.jpg                ✗\nbao-cao-bot  đọc bao-cao/thang-10.csv           ✓\nbao-cao-bot  đọc uploads/phong-a1.jpg           ✗\nbao-cao-bot  liệt kê user IAM                   ✗\nthuc-tap     đọc bi-mat/luong.csv (s3:*)        ✓");
const OUT_18_DON = out("$ bash don-iam.sh   # gỡ policy ⇒ khoá ⇒ user/group/role/instance profile/OIDC\nđã xoá user an-dev\nđã xoá user thuc-tap\nđã xoá user bao-cao-bot\nđã xoá user ops-cu\nđã xoá group dev\nđã xoá policy labflow-doc-anh\nđã xoá instance profile labflow-ec2\nđã xoá role labflow-app\nđã xoá role doc-bao-cao\nđã xoá role labflow-ec2\nđã xoá role gha-labflow-deploy\nđã xoá OIDC provider GitHub\n\n$ bash con-gi-iam.sh   # kiểm còn gì (trừ tài khoản quản trị của chính bạn)\nuser:    \ngroup:   \nrole:    \npolicy:  \nOIDC:    \ninstance profile: \n$ docker ps --filter name=aws- --format '{{.Names}}' | wc -l\n0");
const OUT_16_KHOP = out("$ node khop-sub.mjs\nsub trong token GitHub            A:  B:  C:\npush nhánh main của labflow       ✓   ✓   ✓ \nnhánh thu-nghiem của labflow      ✓   ✓   ✗ \npull request vào labflow          ✓   ✓   ✗ \nrepo khác cùng tài khoản          ✓   ✓   ✗ \nrepo của người lạ                 ✓   ✗   ✗ \n\nA: chỉ aud, quên sub\nB: StringLike repo:cuongthai/*\nC: StringEquals …labflow:ref:refs/heads/main");
const ID = '123456789012';
const MA_DOC_ANH = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "DocAnh", "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetObject"],
      "Resource": ["arn:aws:s3:::labflow-anh", "arn:aws:s3:::labflow-anh/*"] }
  ]
}`);
const MA_TIN_ECS = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow",
      "Principal": { "Service": "ecs-tasks.amazonaws.com" },
      "Action": "sts:AssumeRole" }
  ]
}`);
const MA_DOC_ANH_TRU = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "DocAnh", "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetObject"],
      "Resource": ["arn:aws:s3:::labflow-anh", "arn:aws:s3:::labflow-anh/*"] },
    { "Sid": "CamBiMat", "Effect": "Deny",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::labflow-anh/bi-mat/*" }
  ]
}`);
const MA_SAO = json(`
{ "Version": "2012-10-17",
  "Statement": [ { "Effect": "Allow", "Action": "s3:*", "Resource": "*" } ] }`);
const MA_DIEU_KIEN = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "ChiKhiCoMFA", "Effect": "Allow",
      "Action": "ec2:TerminateInstances", "Resource": "*",
      "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } } },
    { "Sid": "ChiSingapore", "Effect": "Deny",
      "NotAction": ["iam:*", "sts:*", "budgets:*", "cloudfront:*", "route53:*"],
      "Resource": "*",
      "Condition": { "StringNotEquals": { "aws:RequestedRegion": "ap-southeast-1" } } }
  ]
}`);

/* ═══════════════════════════ 1.1 — User, group, role, policy ═══════════════════════════ */
const L11_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1</span>
<h2>1.1 — Users, groups, roles and policies: who can do what in your account</h2>
<p class="lead">Every request that reaches AWS — a console click, a CLI command, a line of SDK code in your Spring Boot or Node.js API — is checked twice: <strong>who are you</strong> (authentication) and <strong>are you allowed to do this, on this resource, right now</strong> (authorization). IAM (Identity and Access Management) is the service that answers both questions. It is free, it is global (not tied to a region), and almost every cloud breach you will read about in this course is, at its core, an IAM mistake.</p>

<h3>The building metaphor</h3>
<p>Picture the office building of a software company. Employees have <strong>personal badges</strong> (IAM users). Badges are grouped by <strong>department</strong> — every developer gets the same doors (IAM groups). A plumber who comes for one afternoon gets a <strong>visitor badge</strong> at reception that stops working in the evening (an IAM role and its temporary credentials). And on every door there is a <strong>rule sheet</strong>: “developers may enter floor 3, nobody enters the server room without a manager” (policies). The building owner has a <strong>master key</strong> that opens everything — that is the root user from lesson 0.1, locked in the safe.</p>

<h3>Principals — the “who”</h3>
<table>
  <thead><tr><th>Principal</th><th>What it is</th><th>Credentials</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td>Root user</td><td>The account owner (sign-up e-mail)</td><td>Password + MFA; never access keys</td><td>The handful of root-only tasks</td></tr>
    <tr><td>IAM user</td><td>A long-lived identity inside one account</td><td>Password and/or <em>long-term</em> access keys (AKIA…)</td><td>Legacy tools, small personal accounts, break-glass</td></tr>
    <tr><td>IAM role</td><td>An identity with permissions but <em>no</em> password or key; someone “assumes” it</td><td><em>Temporary</em> keys from STS (ASIA… + session token), expire in 15 min – 12 h</td><td>Applications on EC2/ECS/Lambda, CI pipelines, humans via SSO, other accounts</td></tr>
    <tr><td>Federated identity</td><td>A person or machine authenticated elsewhere (Google Workspace, Entra ID, GitHub Actions)</td><td>Exchanges an outside token for a role session</td><td>Company SSO, CI without stored keys (lesson 1.6)</td></tr>
    <tr><td>AWS service</td><td>e.g. <code>ecs-tasks.amazonaws.com</code>, <code>lambda.amazonaws.com</code></td><td>Assumes a role you allow it to</td><td>Your container or function calling S3</td></tr>
  </tbody>
</table>
<p>The rule of thumb from AWS's own best-practice list: <strong>humans use federation with temporary credentials; workloads use roles; IAM users with long-term keys are the exception</strong>. You will still meet IAM users everywhere in real companies and in exam questions, so you need to understand both.</p>

<h3>Groups — permissions for many people at once</h3>
<p>A group is a container of users. Attach a policy to the group and every member gets it; remove someone from the group and the permission disappears. Two facts that interviewers and the exam like: <strong>a group is not a principal</strong> (you cannot sign in as a group, and you cannot name a group in the Principal element of a policy), and <strong>groups cannot contain other groups</strong>. A user can belong to up to 10 groups.</p>

<h3>Policies — the “what”</h3>
<p>A policy is a JSON document that says which <strong>actions</strong> are allowed or denied on which <strong>resources</strong>, optionally under <strong>conditions</strong>. Lesson 1.2 reads them line by line. For now, the families:</p>
<ul>
  <li><strong>Identity-based policies</strong> — attached to a user, group or role: “what can this identity do”. They come as <em>AWS managed</em> (written by AWS, e.g. <code>AmazonS3ReadOnlyAccess</code>), <em>customer managed</em> (yours, reusable, versioned) or <em>inline</em> (embedded in one identity, deleted with it).</li>
  <li><strong>Resource-based policies</strong> — attached to a resource: an S3 bucket policy, an SQS queue policy, and the <strong>trust policy</strong> of every role (“who may assume me”). They contain a <code>Principal</code> element.</li>
  <li><strong>Guardrails</strong> — permission boundaries (lesson 1.3), Service Control Policies in AWS Organizations, session policies. They never grant anything; they only cap.</li>
</ul>

<h3>ARN — the address of everything</h3>
<p>Every resource has an Amazon Resource Name. Learn to read it once and policies become much easier:</p>
${bash(`
arn:partition:service:region:account-id:resource
arn:aws:iam::123456789012:user/an-dev            # IAM is global ⇒ region is empty
arn:aws:iam::123456789012:role/labflow-app
arn:aws:sts::123456789012:assumed-role/doc-bao-cao/cuong-xem-bao-cao   # a role SESSION
arn:aws:s3:::labflow-anh                          # S3 bucket names are global ⇒ no region, no account
arn:aws:s3:::labflow-anh/uploads/phong-a1.jpg     # an object inside it
arn:aws:sqs:ap-southeast-1:123456789012:labflow-email   # regional service ⇒ region filled`)}

<h3>See it running: a group, a user, a policy and a role</h3>
<p>Below, an administrator identity (<code>quan-tri</code>) builds the smallest useful structure for the LabFlow project — the lab-room booking API that this course deploys at the end. It runs for real against Moto, an AWS emulator, with permission checking switched on: every call after the setup is evaluated against IAM policies, exactly like AWS would. The policy file and the role's trust policy:</p>
${MA_DOC_ANH}
${MA_TIN_ECS}
${OUT_11_DUNG}
<p>Now the developer <code>an-dev</code> uses their own key. The first call answers “who am I” (the CLI equivalent of <code>whoami</code>); the second is allowed by the group policy; the third is not in any policy, so it is denied:</p>
${OUT_11_DEV}
<p>Notice the error message: it names the principal (<code>user/an-dev</code>) and the exact action (<code>iam:ListUsers</code>). Reading this message carefully is the most useful IAM skill you will build in this chapter — lesson 1.3 turns it into a method.</p>
<div class="callout warn">The role <code>labflow-app</code> has a trust policy but no permission policy yet. A role always has two halves: <strong>trust</strong> (who may become me) and <strong>permissions</strong> (what I may do). Lesson 1.5 shows what happens when one half is missing.</div>

<h3>IAM in the shared responsibility model</h3>
<p>AWS guarantees that IAM evaluates every request correctly, stores credentials safely and is available worldwide. <strong>Everything you put in it is yours</strong>: who gets a user, which policy says <code>"*"</code>, which key sits in a Git repository. In the Capital One breach (2019, lesson 0.8) AWS's IAM worked perfectly — it faithfully allowed a role with far too many S3 permissions to list buckets and copy their data.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> your family Netflix account has profiles (users), a “Kids” profile with restrictions (group + policy) and a one-time code you give a friend for one evening (a role session).</li>
  <li><strong>On your first day at a company:</strong> you will rarely get an IAM user. You get a login to the company SSO (IAM Identity Center), a “Developer” permission set in the dev account and read-only in production. Asking “which permission set do I need?” instead of “give me admin” is a small sentence that makes a good impression.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“What is the difference between an IAM user and an IAM role?”</strong> — A user is a long-lived identity with a password and/or long-term keys. A role has no credentials of its own; a trusted principal assumes it and receives temporary credentials from STS. Applications and CI should use roles.</li>
  <li><strong>“Can you put a group in the Principal of a bucket policy?”</strong> — No. Groups are not principals; you grant the group through an identity-based policy, or name users/roles in the resource policy.</li>
  <li><strong>“Is IAM regional?”</strong> — No, IAM is global: users, roles and policies exist once per account and apply in every region.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>On Moto (lesson 0.4 setup) or a real account, create a group <code>dev</code>, a user <code>ban-dev</code> in it, and a customer managed policy that only allows <code>s3:ListAllMyBuckets</code>.</li>
  <li>Create an access key for <code>ban-dev</code> and call <code>aws sts get-caller-identity</code> and <code>aws s3 ls</code> with it, then <code>aws iam list-users</code>.</li>
  <li>Write down the three ARNs you created and point at the region and account fields.</li>
</ol>
<p><strong>Done when:</strong> <code>get-caller-identity</code> prints <code>user/ban-dev</code>, <code>s3 ls</code> works, <code>iam list-users</code> fails with AccessDenied naming <code>iam:ListUsers</code>, and you can explain why the region field of each ARN is empty.</p>
${giai('Hint: commands', bash(`
aws iam create-group --group-name dev
aws iam create-user --user-name ban-dev
aws iam add-user-to-group --group-name dev --user-name ban-dev
aws iam create-policy --policy-name chi-liet-ke --policy-document file://p.json
aws iam attach-group-policy --group-name dev --policy-arn arn:aws:iam::<account>:policy/chi-liet-ke
aws iam create-access-key --user-name ban-dev     # copy the secret now: it is shown once
# on Moto, start it with -e MOTO_IAM_LOAD_MANAGED_POLICIES=true and switch checks on:
curl -X POST -H 'Content-Type: text/plain' --data-binary 0 http://127.0.0.1:44567/moto-api/reset-auth`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Principal</span><span class="v">The entity making a request: root, IAM user, role session, federated user, AWS service.</span></div>
  <div class="kv"><span class="k">IAM user</span><span class="v">Long-lived identity with password and/or long-term access keys.</span></div>
  <div class="kv"><span class="k">IAM group</span><span class="v">A set of users that share attached policies; not a principal.</span></div>
  <div class="kv"><span class="k">IAM role</span><span class="v">An identity without own credentials; assumed for temporary credentials.</span></div>
  <div class="kv"><span class="k">Trust policy</span><span class="v">The resource-based policy of a role: who may assume it.</span></div>
  <div class="kv"><span class="k">Managed vs inline</span><span class="v">Managed policies are standalone and reusable; inline ones live inside one identity.</span></div>
  <div class="kv"><span class="k">ARN</span><span class="v">arn:partition:service:region:account:resource — the unique name of a resource.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every request: authenticate the principal, then authorize action + resource (+ conditions).</li>
  <li>Users = long-term credentials; roles = temporary credentials; prefer roles and federation.</li>
  <li>Groups gather users; they are not principals and do not nest.</li>
  <li>Identity-based policies say what an identity can do; resource-based ones (bucket policy, trust policy) say who can touch a resource.</li>
  <li>IAM is global and free; what you configure in it is your responsibility.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', '🛡️', 'AWS docs — Security best practices in IAM', 'Federation for humans, roles for workloads, least privilege, MFA.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_arns.html', '🏷️', 'AWS docs — IAM identifiers and ARNs', 'Every ARN format used in IAM policies.')}

<h3>Sources</h3>
<ul>
  <li>IAM best practices: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html</a></li>
  <li>Managed vs inline policies: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html</a></li>
  <li>IAM quotas (10 groups per user, 2 access keys per user, trust policy length…): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html</a></li>
  <li>Moto (AWS emulator) on GitHub: <a href="https://github.com/getmoto/moto" target="_blank" rel="noopener">github.com/getmoto/moto</a></li>
</ul>
</div>
`;

const L11_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1</span>
<h2>1.1 — User, group, role và policy: ai được làm gì trong tài khoản của bạn</h2>
<p class="lead">Mọi request tới AWS — một cú bấm trên console, một lệnh CLI, một dòng mã SDK trong API Spring Boot hay Node.js của bạn — đều bị hỏi hai câu: <strong>bạn là ai</strong> (xác thực) và <strong>bạn có được làm việc này, trên tài nguyên này, ngay lúc này không</strong> (phân quyền). IAM (Identity and Access Management) là dịch vụ trả lời cả hai. Nó miễn phí, nó toàn cầu (không gắn với region), và gần như mọi vụ lộ dữ liệu cloud bạn sẽ gặp trong khoá này, bóc đến lõi, đều là một lỗi IAM.</p>

<h3>Hình ảnh toà nhà</h3>
<p>Hãy hình dung toà nhà văn phòng của một công ty phần mềm. Nhân viên có <strong>thẻ cá nhân</strong> (IAM user). Thẻ được gom theo <strong>phòng ban</strong> — mọi lập trình viên được mở cùng những cánh cửa (IAM group). Anh thợ sửa ống nước tới một buổi chiều nhận <strong>thẻ khách</strong> ở quầy lễ tân, tối là hết hiệu lực (IAM role và thông tin xác thực tạm). Và trên mỗi cánh cửa dán một <strong>tờ nội quy</strong>: “lập trình viên được vào tầng 3, không ai vào phòng máy chủ nếu không có quản lý” (policy). Chủ toà nhà giữ <strong>chìa khoá tổng</strong> mở được mọi cửa — đó là user root ở bài 0.1, cất trong két.</p>

<h3>Principal — “ai”</h3>
<table>
  <thead><tr><th>Principal</th><th>Là gì</th><th>Thông tin xác thực</th><th>Dùng khi</th></tr></thead>
  <tbody>
    <tr><td>User root</td><td>Chủ tài khoản (email đăng ký)</td><td>Mật khẩu + MFA; không bao giờ có access key</td><td>Vài việc chỉ root làm được</td></tr>
    <tr><td>IAM user</td><td>Danh tính sống lâu trong một tài khoản</td><td>Mật khẩu và/hoặc access key <em>dài hạn</em> (AKIA…)</td><td>Công cụ cũ, tài khoản học cá nhân, tài khoản khẩn cấp</td></tr>
    <tr><td>IAM role</td><td>Danh tính có quyền nhưng <em>không</em> có mật khẩu hay khoá; ai đó “nhận vai” (assume)</td><td>Khoá <em>tạm</em> do STS cấp (ASIA… + session token), hết hạn sau 15 phút – 12 giờ</td><td>Ứng dụng trên EC2/ECS/Lambda, pipeline CI, người dùng qua SSO, tài khoản khác</td></tr>
    <tr><td>Danh tính liên kết (federated)</td><td>Người hoặc máy đã đăng nhập ở nơi khác (Google Workspace, Entra ID, GitHub Actions)</td><td>Đổi token bên ngoài lấy một phiên role</td><td>SSO công ty, CI không lưu khoá (bài 1.6)</td></tr>
    <tr><td>Dịch vụ AWS</td><td>ví dụ <code>ecs-tasks.amazonaws.com</code>, <code>lambda.amazonaws.com</code></td><td>Nhận vai role mà bạn cho phép</td><td>Container hay function của bạn gọi S3</td></tr>
  </tbody>
</table>
<p>Quy tắc nhớ nhanh từ chính danh sách best practice của AWS: <strong>con người dùng liên kết với thông tin xác thực tạm; ứng dụng dùng role; IAM user có khoá dài hạn là ngoại lệ</strong>. Bạn vẫn sẽ gặp IAM user khắp nơi ở công ty thật và trong đề thi, nên phải hiểu cả hai.</p>

<h3>Group — quyền cho nhiều người một lúc</h3>
<p>Group là nơi chứa user. Gắn policy vào group thì mọi thành viên được quyền đó; rút ai ra khỏi group là quyền biến mất. Hai sự thật mà người phỏng vấn và đề thi rất thích: <strong>group không phải principal</strong> (không đăng nhập bằng group được, cũng không ghi group vào phần Principal của policy được), và <strong>group không chứa group khác</strong>. Một user thuộc tối đa 10 group.</p>

<h3>Policy — “được làm gì”</h3>
<p>Policy là một tài liệu JSON nói những <strong>hành động</strong> (action) nào được phép hay bị cấm trên những <strong>tài nguyên</strong> (resource) nào, có thể kèm <strong>điều kiện</strong> (condition). Bài 1.2 đọc từng dòng. Giờ chỉ cần biết các họ policy:</p>
<ul>
  <li><strong>Policy theo danh tính (identity-based)</strong> — gắn vào user, group hoặc role: “danh tính này làm được gì”. Có ba loại: <em>AWS managed</em> (AWS viết sẵn, ví dụ <code>AmazonS3ReadOnlyAccess</code>), <em>customer managed</em> (của bạn, dùng lại được, có phiên bản) và <em>inline</em> (nhúng trong đúng một danh tính, xoá danh tính là mất theo).</li>
  <li><strong>Policy theo tài nguyên (resource-based)</strong> — gắn vào tài nguyên: bucket policy của S3, queue policy của SQS, và <strong>trust policy</strong> của mọi role (“ai được nhận vai tôi”). Loại này có phần <code>Principal</code>.</li>
  <li><strong>Rào chắn</strong> — permission boundary (bài 1.3), Service Control Policy trong AWS Organizations, session policy. Chúng không bao giờ cấp quyền; chúng chỉ đặt trần.</li>
</ul>

<h3>ARN — địa chỉ của mọi thứ</h3>
<p>Mỗi tài nguyên có một Amazon Resource Name. Đọc được nó một lần là policy dễ hơn hẳn:</p>
${bash(`
arn:partition:service:region:account-id:resource
arn:aws:iam::123456789012:user/an-dev            # IAM toàn cầu ⇒ ô region bỏ trống
arn:aws:iam::123456789012:role/labflow-app
arn:aws:sts::123456789012:assumed-role/doc-bao-cao/cuong-xem-bao-cao   # một PHIÊN của role
arn:aws:s3:::labflow-anh                          # tên bucket S3 là toàn cầu ⇒ không region, không account
arn:aws:s3:::labflow-anh/uploads/phong-a1.jpg     # một object bên trong
arn:aws:sqs:ap-southeast-1:123456789012:labflow-email   # dịch vụ theo region ⇒ có region`)}

<h3>Xem chạy thật: một group, một user, một policy và một role</h3>
<p>Dưới đây, danh tính quản trị (<code>quan-tri</code>) dựng cấu trúc nhỏ nhất dùng được cho dự án LabFlow — API đặt lịch phòng lab mà cuối khoá ta đưa lên AWS. Lệnh chạy thật trên Moto, một trình giả lập AWS, có BẬT kiểm quyền: mọi lời gọi sau bước dựng nền đều bị đối chiếu với policy IAM, đúng như AWS làm. Tệp policy và trust policy của role:</p>
${MA_DOC_ANH}
${MA_TIN_ECS}
${OUT_11_DUNG}
<p>Giờ lập trình viên <code>an-dev</code> dùng khoá của chính mình. Lời gọi đầu trả lời “tôi là ai” (bản CLI của <code>whoami</code>); lời gọi thứ hai được policy của group cho phép; lời gọi thứ ba không nằm trong policy nào nên bị từ chối:</p>
${OUT_11_DEV}
<p>Để ý thông báo lỗi: nó ghi rõ principal (<code>user/an-dev</code>) và đúng action (<code>iam:ListUsers</code>). Đọc kỹ thông báo này là kỹ năng IAM hữu ích nhất bạn rèn trong chương — bài 1.3 biến nó thành phương pháp.</p>
<div class="callout warn">Role <code>labflow-app</code> đã có trust policy nhưng chưa có policy quyền. Một role luôn có hai nửa: <strong>tin ai</strong> (ai được trở thành tôi) và <strong>quyền gì</strong> (tôi được làm gì). Bài 1.5 cho thấy chuyện gì xảy ra khi thiếu một nửa.</div>

<h3>IAM trong mô hình trách nhiệm chung</h3>
<p>AWS bảo đảm IAM đánh giá đúng mọi request, cất thông tin xác thực an toàn và chạy được khắp thế giới. <strong>Mọi thứ bạn đặt vào nó là của bạn</strong>: ai được tạo user, policy nào ghi <code>"*"</code>, khoá nào nằm trong kho Git. Trong vụ Capital One (2019, bài 0.8), IAM của AWS chạy hoàn hảo — nó trung thành cho phép một role thừa quyền S3 liệt kê bucket và sao chép dữ liệu.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> tài khoản Netflix gia đình có các hồ sơ (user), hồ sơ “Trẻ em” bị giới hạn (group + policy), và mã đăng nhập một lần bạn đưa bạn bè dùng một tối (phiên role).</li>
  <li><strong>Ngày đầu đi làm:</strong> bạn hiếm khi được tạo IAM user. Bạn nhận tài khoản SSO của công ty (IAM Identity Center), permission set “Developer” ở tài khoản dev và chỉ đọc ở production. Hỏi “em cần permission set nào ạ?” thay vì “cho em quyền admin” là một câu nhỏ để lại ấn tượng tốt.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“IAM user khác IAM role thế nào?”</strong> — User là danh tính sống lâu, có mật khẩu và/hoặc khoá dài hạn. Role không có thông tin xác thực riêng; một principal được tin cậy nhận vai và nhận khoá tạm từ STS. Ứng dụng và CI nên dùng role.</li>
  <li><strong>“Ghi một group vào Principal của bucket policy được không?”</strong> — Không. Group không phải principal; cấp cho group bằng policy theo danh tính, hoặc ghi user/role cụ thể vào policy tài nguyên.</li>
  <li><strong>“IAM có theo region không?”</strong> — Không, IAM là toàn cầu: user, role, policy tồn tại một lần cho cả tài khoản và có hiệu lực ở mọi region.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên Moto (dựng như bài 0.4) hoặc tài khoản thật, tạo group <code>dev</code>, user <code>ban-dev</code> trong group, và một customer managed policy chỉ cho <code>s3:ListAllMyBuckets</code>.</li>
  <li>Tạo access key cho <code>ban-dev</code>, dùng nó gọi <code>aws sts get-caller-identity</code> và <code>aws s3 ls</code>, rồi <code>aws iam list-users</code>.</li>
  <li>Ghi lại ba ARN bạn vừa tạo và chỉ ra ô region, ô account.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>get-caller-identity</code> in <code>user/ban-dev</code>, <code>s3 ls</code> chạy được, <code>iam list-users</code> báo AccessDenied có ghi <code>iam:ListUsers</code>, và bạn giải thích được vì sao ô region của từng ARN bỏ trống.</p>
${giai('Gợi ý: các lệnh', bash(`
aws iam create-group --group-name dev
aws iam create-user --user-name ban-dev
aws iam add-user-to-group --group-name dev --user-name ban-dev
aws iam create-policy --policy-name chi-liet-ke --policy-document file://p.json
aws iam attach-group-policy --group-name dev --policy-arn arn:aws:iam::<account>:policy/chi-liet-ke
aws iam create-access-key --user-name ban-dev     # chép secret ngay: chỉ hiện một lần
# trên Moto: chạy với -e MOTO_IAM_LOAD_MANAGED_POLICIES=true rồi bật kiểm quyền:
curl -X POST -H 'Content-Type: text/plain' --data-binary 0 http://127.0.0.1:44567/moto-api/reset-auth`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Principal</span><span class="v">Thực thể gửi request: root, IAM user, phiên role, người dùng liên kết, dịch vụ AWS.</span></div>
  <div class="kv"><span class="k">IAM user</span><span class="v">Danh tính sống lâu, có mật khẩu và/hoặc access key dài hạn.</span></div>
  <div class="kv"><span class="k">IAM group</span><span class="v">Tập user dùng chung policy được gắn; không phải principal.</span></div>
  <div class="kv"><span class="k">IAM role</span><span class="v">Danh tính không có thông tin xác thực riêng; nhận vai để lấy khoá tạm.</span></div>
  <div class="kv"><span class="k">Trust policy</span><span class="v">Policy tài nguyên của role: ai được nhận vai.</span></div>
  <div class="kv"><span class="k">Managed vs inline</span><span class="v">Managed đứng riêng, dùng lại được; inline nằm trong đúng một danh tính.</span></div>
  <div class="kv"><span class="k">ARN</span><span class="v">arn:partition:service:region:account:resource — tên duy nhất của tài nguyên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mỗi request: xác thực principal, rồi phân quyền action + resource (+ điều kiện).</li>
  <li>User = khoá dài hạn; role = khoá tạm; ưu tiên role và liên kết danh tính.</li>
  <li>Group gom user; group không phải principal và không lồng nhau.</li>
  <li>Policy theo danh tính nói danh tính làm được gì; policy theo tài nguyên (bucket policy, trust policy) nói ai được chạm vào tài nguyên.</li>
  <li>IAM toàn cầu và miễn phí; thứ bạn cấu hình trong nó là trách nhiệm của bạn.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', '🛡️', 'AWS docs — Security best practices in IAM', 'Liên kết danh tính cho người, role cho ứng dụng, quyền tối thiểu, MFA.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_arns.html', '🏷️', 'AWS docs — IAM identifiers and ARNs', 'Mọi dạng ARN dùng trong policy IAM.')}

<h3>Nguồn</h3>
<ul>
  <li>IAM best practices: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html</a></li>
  <li>Managed vs inline: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html</a></li>
  <li>Hạn mức IAM (10 group/user, 2 access key/user, độ dài trust policy…): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html</a></li>
  <li>Moto (trình giả lập AWS) trên GitHub: <a href="https://github.com/getmoto/moto" target="_blank" rel="noopener">github.com/getmoto/moto</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.2 — Đọc và viết policy JSON ═══════════════════════════ */
const L12_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 2</span>
<h2>1.2 — Reading and writing IAM policy JSON</h2>
<p class="lead">A policy is fifteen lines of JSON that can either protect a salary file or hand your whole account to a stranger. This lesson reads one element at a time, then shows the three rules AWS uses to decide every request — and proves them with real AccessDenied errors.</p>

<h3>Anatomy of a policy</h3>
${MA_DOC_ANH_TRU}
<table>
  <thead><tr><th>Element</th><th>Meaning</th><th>Watch out</th></tr></thead>
  <tbody>
    <tr><td><code>Version</code></td><td>The policy language version. Always <code>"2012-10-17"</code>.</td><td>Omitting it falls back to an old language where variables like <code>\${aws:username}</code> do not work.</td></tr>
    <tr><td><code>Statement</code></td><td>A list of rules. Each is evaluated on its own.</td><td>Order inside the list does not matter.</td></tr>
    <tr><td><code>Sid</code></td><td>Optional label (“statement ID”).</td><td>Use it — it makes reviews and error hunting faster.</td></tr>
    <tr><td><code>Effect</code></td><td><code>Allow</code> or <code>Deny</code>.</td><td>There is no third value.</td></tr>
    <tr><td><code>Action</code> / <code>NotAction</code></td><td><code>service:Operation</code>, e.g. <code>s3:GetObject</code>; wildcards allowed (<code>s3:Get*</code>).</td><td><code>NotAction</code> with Allow means “everything except…” — usually far more than you think.</td></tr>
    <tr><td><code>Resource</code></td><td>ARNs the statement applies to.</td><td>Bucket-level and object-level actions need <em>different</em> ARNs (below).</td></tr>
    <tr><td><code>Condition</code></td><td>Extra tests on the request context: IP, MFA, region, tags, time…</td><td>All conditions in a statement must be true (AND); values inside one key are OR.</td></tr>
    <tr><td><code>Principal</code></td><td>Only in resource-based policies (bucket policy, trust policy): who the statement is about.</td><td><code>"Principal": "*"</code> in a bucket policy = the whole Internet.</td></tr>
  </tbody>
</table>

<h3>The bucket-versus-object trap</h3>
<p><code>s3:ListBucket</code> is an action on the <strong>bucket</strong> (<code>arn:aws:s3:::labflow-anh</code>); <code>s3:GetObject</code>, <code>s3:PutObject</code> and <code>s3:DeleteObject</code> act on <strong>objects</strong> (<code>arn:aws:s3:::labflow-anh/*</code>). Write only the bucket ARN and downloads fail; write only <code>/*</code> and listing fails. This single mistake produces a large share of the “but I gave it S3 permission!” questions on forums — the Resource line above lists both on purpose.</p>

<h3>Three rules decide every request</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Rule 1</span><span class="lz-t">Default deny</span><span class="lz-d">Everything starts as denied. A brand-new user can do nothing (except things like reading its own identity).</span></div>
  <div class="lz-step"><span class="lz-k">Rule 2</span><span class="lz-t">An explicit Deny always wins</span><span class="lz-d">If any applicable policy says Deny for this action and resource, the answer is Deny — no matter how many Allows exist elsewhere.</span></div>
  <div class="lz-step"><span class="lz-k">Rule 3</span><span class="lz-t">Otherwise you need an Allow</span><span class="lz-d">Some policy (identity-based or resource-based) must Allow it. No Allow ⇒ “implicit deny”.</span></div>
</div>
<p>The full algorithm in the AWS documentation adds more layers — SCPs from AWS Organizations, permission boundaries, session policies, and the different behaviour of resource-based policies across accounts. The rule underneath them is simple: <strong>every layer that exists must allow the request, and none may deny it</strong>. Guardrails only remove permissions, they never add.</p>

<h3>The rules, running for real</h3>
<p>We replace the developer group's policy with the version above (allow reading the bucket, but an explicit Deny on <code>bi-mat/*</code> — the “secret” folder holding a salary file). Policies are versioned: <code>create-policy-version --set-as-default</code> keeps the old version for rollback. Then <code>an-dev</code> tries five things:</p>
${OUT_12_DANHGIA}
<ul>
  <li>The photo: Allow matches, no Deny ⇒ allowed (rule 3).</li>
  <li>The salary file: the Allow matches too, but <code>CamBiMat</code> denies ⇒ denied (rule 2). Note how <code>s3 cp</code> reports <code>403 Forbidden</code> on <code>HeadObject</code> — the high-level command checks the object first — while <code>s3api get-object</code> shows the plain <code>AccessDenied</code>.</li>
  <li>Upload and delete: no statement mentions <code>PutObject</code> or <code>DeleteObject</code> ⇒ implicit deny (rule 1).</li>
</ul>

<h3>Why wildcards are dangerous — a real run</h3>
<p>An intern needs to “upload some test files”. Someone in a hurry attaches this inline policy — it appears in real repositories surprisingly often:</p>
${MA_SAO}
${OUT_12_SAO}
<p>The intern can now read the salary file and delete a report — in <em>every</em> bucket of the account, including the ones of other projects. Nobody meant it; the policy simply said so. Note also that this user's policy has no Deny on <code>bi-mat/*</code>: the Deny we wrote earlier lives in the <em>developer group's</em> policy, and the intern is not in that group. A Deny protects only the identities it is attached to — protecting a resource against everyone is the job of a <strong>resource-based policy</strong> (the bucket policy, Chapter 2).</p>

<h3>Conditions — the fine print</h3>
<p>Conditions turn a policy from “who and what” into “who, what, and under which circumstances”. Two classic examples — require MFA for a destructive action, and refuse any regional request outside Singapore (the guardrail promised in lesson 0.3, which would have stopped crypto-miners spreading across regions):</p>
${MA_DIEU_KIEN}
<p>Useful operators: <code>StringEquals</code>/<code>StringLike</code> (with <code>*</code> and <code>?</code>), <code>IpAddress</code>, <code>Bool</code>, <code>DateLessThan</code>, <code>ArnLike</code>, and the <code>IfExists</code> suffix. Common keys: <code>aws:SourceIp</code>, <code>aws:MultiFactorAuthPresent</code>, <code>aws:RequestedRegion</code>, <code>aws:PrincipalTag/…</code>, <code>s3:prefix</code>. The <code>NotAction</code> list keeps global services such as IAM, STS and CloudFront working — their requests are recorded in us-east-1, so a naive region Deny would break them.</p>
<div class="callout warn">Honest note about the lab: Moto, our emulator, evaluates Allow/Deny by Action and Resource but <strong>ignores Condition blocks</strong>. Test conditions on a real account with the <strong>IAM policy simulator</strong> (console → IAM → Policy simulator, or <code>aws iam simulate-principal-policy</code>) and validate syntax with <strong>IAM Access Analyzer → Validate policy</strong> (<code>aws accessanalyzer validate-policy</code>), which also warns about over-broad statements.</div>

<h3>A habit for reading any policy</h3>
<ol>
  <li>Find every <code>Deny</code> first — they win.</li>
  <li>For each <code>Allow</code>, read Action and Resource together and say the sentence aloud: “allows <em>delete</em> on <em>every object of every bucket</em>”. Any <code>*</code> should make you stop.</li>
  <li>Read the conditions last; ask what happens if the key is missing from the request.</li>
</ol>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“Explicit deny vs implicit deny?”</strong> — Implicit: nothing allowed it (default). Explicit: a statement with Effect Deny matched; it overrides every Allow.</li>
  <li><strong>“Your Lambda has s3:GetObject on arn:aws:s3:::my-bucket and still gets AccessDenied. Why?”</strong> — GetObject is an object action; the resource must be <code>arn:aws:s3:::my-bucket/*</code>.</li>
  <li><strong>“How would you stop anyone from using regions other than Singapore?”</strong> — A Deny with <code>aws:RequestedRegion</code> and <code>NotAction</code> for global services, ideally as an SCP at the organization level so even admins of member accounts cannot bypass it.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write a policy for the LabFlow application: it may upload and read objects only under <code>uploads/</code> of <code>labflow-anh</code>, may list the bucket, and must never delete anything.</li>
  <li>Attach it to a test user on Moto, switch permission checks on, and prove: upload to <code>uploads/x.jpg</code> works, upload to <code>bi-mat/x.csv</code> fails, delete fails.</li>
</ol>
<p><strong>Done when:</strong> your three commands give ✓, ✗, ✗ and you can say which of the three rules produced each answer.</p>
${giai('Show one possible policy', json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "Liet", "Effect": "Allow", "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::labflow-anh" },
    { "Sid": "GhiDocUploads", "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::labflow-anh/uploads/*" },
    { "Sid": "KhongXoa", "Effect": "Deny",
      "Action": ["s3:DeleteObject", "s3:DeleteBucket"], "Resource": "*" }
  ]
}`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Statement</span><span class="v">One rule: Effect + Action + Resource (+ Condition, + Principal in resource policies).</span></div>
  <div class="kv"><span class="k">Implicit deny</span><span class="v">The default answer when no policy allows the request.</span></div>
  <div class="kv"><span class="k">Explicit deny</span><span class="v">A matching Deny statement; overrides any Allow.</span></div>
  <div class="kv"><span class="k">NotAction</span><span class="v">Matches every action except those listed.</span></div>
  <div class="kv"><span class="k">Condition key</span><span class="v">A value from the request context, e.g. aws:SourceIp, aws:RequestedRegion.</span></div>
  <div class="kv"><span class="k">Policy version</span><span class="v">Customer managed policies keep up to 5 versions; one is the default.</span></div>
  <div class="kv"><span class="k">Policy simulator</span><span class="v">AWS tool that evaluates policies against a hypothetical request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Default deny → explicit Deny wins → otherwise an Allow is required.</li>
  <li>Bucket actions use the bucket ARN; object actions use bucket/*.</li>
  <li>A Deny protects only the identities it is attached to; resource policies protect the resource.</li>
  <li>Read Deny first, read Action and Resource together, stop at every *.</li>
  <li>Test conditions with the policy simulator and lint with Access Analyzer.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html', '⚖️', 'AWS docs — Policy evaluation logic', 'The full decision flow, including SCPs, boundaries and cross-account requests.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html', '🔣', 'AWS docs — Condition operators', 'StringLike, IpAddress, Bool, IfExists and the rest.')}

<h3>Sources</h3>
<ul>
  <li>Policy evaluation logic: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html</a></li>
  <li>Testing policies with the IAM policy simulator: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html</a></li>
  <li>Condition operators: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html</a></li>
</ul>
</div>
`;

const L12_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 2</span>
<h2>1.2 — Đọc và viết policy IAM bằng JSON</h2>
<p class="lead">Một policy chỉ mười lăm dòng JSON, nhưng có thể bảo vệ một tệp bảng lương hoặc trao cả tài khoản cho người lạ. Bài này đọc từng phần tử, rồi chỉ ra ba luật AWS dùng để quyết mọi request — và chứng minh bằng lỗi AccessDenied thật.</p>

<h3>Giải phẫu một policy</h3>
${MA_DOC_ANH_TRU}
<table>
  <thead><tr><th>Phần tử</th><th>Ý nghĩa</th><th>Cẩn thận</th></tr></thead>
  <tbody>
    <tr><td><code>Version</code></td><td>Phiên bản ngôn ngữ policy. Luôn là <code>"2012-10-17"</code>.</td><td>Bỏ đi thì rơi về ngôn ngữ cũ, biến như <code>\${aws:username}</code> không chạy.</td></tr>
    <tr><td><code>Statement</code></td><td>Danh sách luật. Mỗi luật được xét riêng.</td><td>Thứ tự trong danh sách không quan trọng.</td></tr>
    <tr><td><code>Sid</code></td><td>Nhãn tuỳ chọn (“statement ID”).</td><td>Nên dùng — duyệt policy và dò lỗi nhanh hơn.</td></tr>
    <tr><td><code>Effect</code></td><td><code>Allow</code> hoặc <code>Deny</code>.</td><td>Không có giá trị thứ ba.</td></tr>
    <tr><td><code>Action</code> / <code>NotAction</code></td><td><code>dịch-vụ:Thao-tác</code>, ví dụ <code>s3:GetObject</code>; được dùng ký tự đại diện (<code>s3:Get*</code>).</td><td><code>NotAction</code> đi với Allow nghĩa là “mọi thứ trừ…” — thường rộng hơn bạn nghĩ rất nhiều.</td></tr>
    <tr><td><code>Resource</code></td><td>Các ARN mà luật áp vào.</td><td>Thao tác cấp bucket và cấp object cần ARN <em>khác nhau</em> (bên dưới).</td></tr>
    <tr><td><code>Condition</code></td><td>Kiểm thêm ngữ cảnh request: IP, MFA, region, tag, thời gian…</td><td>Mọi điều kiện trong một luật phải cùng đúng (VÀ); các giá trị trong một khoá là HOẶC.</td></tr>
    <tr><td><code>Principal</code></td><td>Chỉ có trong policy theo tài nguyên (bucket policy, trust policy): luật nói về ai.</td><td><code>"Principal": "*"</code> trong bucket policy = cả Internet.</td></tr>
  </tbody>
</table>

<h3>Cái bẫy bucket với object</h3>
<p><code>s3:ListBucket</code> là thao tác trên <strong>bucket</strong> (<code>arn:aws:s3:::labflow-anh</code>); <code>s3:GetObject</code>, <code>s3:PutObject</code>, <code>s3:DeleteObject</code> tác động lên <strong>object</strong> (<code>arn:aws:s3:::labflow-anh/*</code>). Chỉ ghi ARN bucket thì tải xuống hỏng; chỉ ghi <code>/*</code> thì liệt kê hỏng. Riêng lỗi này sinh ra rất nhiều câu hỏi kiểu “em cho quyền S3 rồi mà!” trên diễn đàn — dòng Resource ở trên cố ý ghi cả hai.</p>

<h3>Ba luật quyết định mọi request</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Luật 1</span><span class="lz-t">Mặc định từ chối</span><span class="lz-d">Mọi thứ bắt đầu bằng bị từ chối. User mới tinh không làm được gì (trừ vài việc như đọc danh tính của chính mình).</span></div>
  <div class="lz-step"><span class="lz-k">Luật 2</span><span class="lz-t">Deny tường minh luôn thắng</span><span class="lz-d">Chỉ cần một policy liên quan ghi Deny cho action và resource này, câu trả lời là Deny — dù chỗ khác có bao nhiêu Allow.</span></div>
  <div class="lz-step"><span class="lz-k">Luật 3</span><span class="lz-t">Còn lại thì cần một Allow</span><span class="lz-d">Phải có policy (theo danh tính hoặc theo tài nguyên) Allow nó. Không có Allow ⇒ “từ chối ngầm” (implicit deny).</span></div>
</div>
<p>Thuật toán đầy đủ trong tài liệu AWS còn thêm nhiều lớp — SCP của AWS Organizations, permission boundary, session policy, và cách policy tài nguyên hành xử khác khi request đi qua tài khoản khác. Luật nằm bên dưới tất cả rất đơn giản: <strong>mọi lớp đang tồn tại đều phải cho phép, và không lớp nào được cấm</strong>. Rào chắn chỉ bớt quyền, không bao giờ thêm.</p>

<h3>Ba luật, chạy thật</h3>
<p>Ta thay policy của group dev bằng bản ở trên (cho đọc bucket, nhưng Deny tường minh với <code>bi-mat/*</code> — thư mục “bí mật” chứa tệp bảng lương). Policy có phiên bản: <code>create-policy-version --set-as-default</code> giữ bản cũ để quay lui. Rồi <code>an-dev</code> thử năm việc:</p>
${OUT_12_DANHGIA}
<ul>
  <li>Ảnh: khớp Allow, không có Deny ⇒ được (luật 3).</li>
  <li>Tệp lương: cũng khớp Allow, nhưng <code>CamBiMat</code> cấm ⇒ bị từ chối (luật 2). Để ý <code>s3 cp</code> báo <code>403 Forbidden</code> ở <code>HeadObject</code> — lệnh cấp cao hỏi thăm object trước — còn <code>s3api get-object</code> báo thẳng <code>AccessDenied</code>.</li>
  <li>Tải lên và xoá: không luật nào nhắc <code>PutObject</code> hay <code>DeleteObject</code> ⇒ từ chối ngầm (luật 1).</li>
</ul>

<h3>Vì sao ký tự đại diện nguy hiểm — chạy thật</h3>
<p>Bạn thực tập cần “tải vài tệp thử”. Ai đó đang vội gắn policy inline này — nó xuất hiện trong kho mã thật nhiều đến bất ngờ:</p>
${MA_SAO}
${OUT_12_SAO}
<p>Bạn thực tập giờ đọc được bảng lương và xoá được báo cáo — ở <em>mọi</em> bucket của tài khoản, kể cả của dự án khác. Không ai cố ý; policy chỉ nói đúng như thế. Để ý thêm: policy của user này không có Deny với <code>bi-mat/*</code>: luật Deny ta viết lúc nãy nằm trong policy của <em>group dev</em>, mà bạn thực tập không ở group đó. Deny chỉ bảo vệ những danh tính nó được gắn vào — bảo vệ một tài nguyên trước mọi người là việc của <strong>policy theo tài nguyên</strong> (bucket policy, Chương 2).</p>

<h3>Condition — phần chữ nhỏ</h3>
<p>Condition biến policy từ “ai và cái gì” thành “ai, cái gì, trong hoàn cảnh nào”. Hai ví dụ kinh điển — bắt buộc MFA cho thao tác phá huỷ, và từ chối mọi request theo region nằm ngoài Singapore (rào chắn đã hứa ở bài 0.3, thứ lẽ ra chặn được máy đào coin lan sang các region):</p>
${MA_DIEU_KIEN}
<p>Toán tử hay dùng: <code>StringEquals</code>/<code>StringLike</code> (với <code>*</code> và <code>?</code>), <code>IpAddress</code>, <code>Bool</code>, <code>DateLessThan</code>, <code>ArnLike</code>, và hậu tố <code>IfExists</code>. Khoá hay gặp: <code>aws:SourceIp</code>, <code>aws:MultiFactorAuthPresent</code>, <code>aws:RequestedRegion</code>, <code>aws:PrincipalTag/…</code>, <code>s3:prefix</code>. Danh sách <code>NotAction</code> giữ cho dịch vụ toàn cầu như IAM, STS, CloudFront vẫn chạy — request của chúng được ghi ở us-east-1, nên một Deny region ngây thơ sẽ làm hỏng chúng.</p>
<div class="callout warn">Nói thật về phòng lab: Moto, trình giả lập ta dùng, xét Allow/Deny theo Action và Resource nhưng <strong>bỏ qua khối Condition</strong>. Thử điều kiện trên tài khoản thật bằng <strong>IAM policy simulator</strong> (console → IAM → Policy simulator, hoặc <code>aws iam simulate-principal-policy</code>) và kiểm cú pháp bằng <strong>IAM Access Analyzer → Validate policy</strong> (<code>aws accessanalyzer validate-policy</code>), công cụ này còn cảnh báo luật quá rộng.</div>

<h3>Thói quen đọc mọi policy</h3>
<ol>
  <li>Tìm mọi <code>Deny</code> trước — chúng thắng.</li>
  <li>Với mỗi <code>Allow</code>, đọc Action và Resource cùng nhau thành một câu thành tiếng: “cho phép <em>xoá</em> trên <em>mọi object của mọi bucket</em>”. Gặp <code>*</code> là phải dừng lại.</li>
  <li>Đọc điều kiện sau cùng; hỏi xem nếu request thiếu khoá đó thì sao.</li>
</ol>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Deny tường minh khác deny ngầm thế nào?”</strong> — Ngầm: không có gì cho phép (mặc định). Tường minh: một luật Effect Deny khớp; nó đè mọi Allow.</li>
  <li><strong>“Lambda của bạn có s3:GetObject trên arn:aws:s3:::my-bucket mà vẫn AccessDenied. Vì sao?”</strong> — GetObject là thao tác cấp object; resource phải là <code>arn:aws:s3:::my-bucket/*</code>.</li>
  <li><strong>“Làm sao cấm mọi người dùng region khác Singapore?”</strong> — Một Deny với <code>aws:RequestedRegion</code> và <code>NotAction</code> cho dịch vụ toàn cầu, tốt nhất đặt thành SCP ở cấp tổ chức để cả admin của tài khoản thành viên cũng không lách được.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết policy cho ứng dụng LabFlow: chỉ được tải lên và đọc object dưới <code>uploads/</code> của <code>labflow-anh</code>, được liệt kê bucket, và không bao giờ được xoá gì.</li>
  <li>Gắn vào một user thử trên Moto, bật kiểm quyền, chứng minh: tải lên <code>uploads/x.jpg</code> được, tải lên <code>bi-mat/x.csv</code> bị chặn, xoá bị chặn.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lệnh cho ✓, ✗, ✗ và bạn nói được luật nào trong ba luật sinh ra từng kết quả.</p>
${giai('Xem một policy mẫu', json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "Liet", "Effect": "Allow", "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::labflow-anh" },
    { "Sid": "GhiDocUploads", "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::labflow-anh/uploads/*" },
    { "Sid": "KhongXoa", "Effect": "Deny",
      "Action": ["s3:DeleteObject", "s3:DeleteBucket"], "Resource": "*" }
  ]
}`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Statement</span><span class="v">Một luật: Effect + Action + Resource (+ Condition, + Principal ở policy tài nguyên).</span></div>
  <div class="kv"><span class="k">Implicit deny</span><span class="v">Câu trả lời mặc định khi không policy nào cho phép.</span></div>
  <div class="kv"><span class="k">Explicit deny</span><span class="v">Một luật Deny khớp; đè mọi Allow.</span></div>
  <div class="kv"><span class="k">NotAction</span><span class="v">Khớp mọi action trừ những cái được liệt kê.</span></div>
  <div class="kv"><span class="k">Condition key</span><span class="v">Một giá trị trong ngữ cảnh request, ví dụ aws:SourceIp, aws:RequestedRegion.</span></div>
  <div class="kv"><span class="k">Policy version</span><span class="v">Customer managed policy giữ tối đa 5 phiên bản; một bản là mặc định.</span></div>
  <div class="kv"><span class="k">Policy simulator</span><span class="v">Công cụ AWS đánh giá policy với một request giả định.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mặc định từ chối → Deny tường minh thắng → còn lại cần một Allow.</li>
  <li>Thao tác bucket dùng ARN bucket; thao tác object dùng bucket/*.</li>
  <li>Deny chỉ bảo vệ danh tính được gắn; policy tài nguyên bảo vệ tài nguyên.</li>
  <li>Đọc Deny trước, đọc Action với Resource cùng nhau, dừng ở mọi dấu *.</li>
  <li>Thử điều kiện bằng policy simulator, soát cú pháp bằng Access Analyzer.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html', '⚖️', 'AWS docs — Policy evaluation logic', 'Toàn bộ luồng quyết định, gồm SCP, boundary và request khác tài khoản.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html', '🔣', 'AWS docs — Condition operators', 'StringLike, IpAddress, Bool, IfExists và các toán tử khác.')}

<h3>Nguồn</h3>
<ul>
  <li>Policy evaluation logic: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html</a></li>
  <li>Thử policy bằng IAM policy simulator: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html</a></li>
  <li>Condition operators: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.3 — Quyền tối thiểu ═══════════════════════════ */
const MA_BC2 = json(`
{ "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::labflow-anh" },
    { "Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::labflow-anh/bao-cao/*" } ] }`);
const MA_BIEN = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "TranChoMoiRoleDevTao", "Effect": "Allow",
      "Action": ["s3:*", "sqs:*", "logs:*", "dynamodb:*"],
      "Resource": "*" },
    { "Sid": "KhongDuocGoTran", "Effect": "Deny",
      "Action": ["iam:DeleteRolePermissionsBoundary", "iam:PutRolePermissionsBoundary"],
      "Resource": "*" }
  ]
}`);

const L13_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 3</span>
<h2>1.3 — Least privilege in practice</h2>
<p class="lead">“Grant only the permissions required to perform a task” is easy to say and hard to do, because nobody knows the exact list in advance. This lesson gives you a method that works: start from zero, let AWS tell you what is missing, add exactly that — and then use AWS's own tools to remove what was never used. Then we look at what one excessive permission cost a real company in November 2025.</p>

<h3>Blast radius — why “a bit more than needed” is not harmless</h3>
<p>Think of permissions as the <strong>blast radius</strong> of a stolen credential. A key that can read one folder of reports leaks one folder. A key with <code>s3:*</code> leaks every bucket. A key that can change Lambda code can, as we will see, become an administrator. You do not choose whether a credential will one day leak — lessons 0.9 and 1.7 show it happens to careful teams too — but you choose how big the hole is when it does.</p>

<h3>Method: start from zero, read the error, add one line</h3>
<p>A reporting bot must read monthly reports in <code>bao-cao/</code>. We create it with <strong>no</strong> policy, run its job, read the error, and add exactly what the error asked for:</p>
${MA_BC2}
${OUT_13_TU0}
<p>Before: denied (default deny). After adding two statements: the report is readable, a photo in <code>uploads/</code> is not, writing is not. Each AccessDenied message names the missing action — in real AWS it also names the resource, and CloudTrail records the denied call with an <code>errorCode</code> of <code>AccessDenied</code>, which you can search later. This is slower than attaching <code>AmazonS3FullAccess</code>, by about ten minutes. It is also the difference between a leaked report and a leaked company.</p>

<h3>Choosing the kind of policy</h3>
<table>
  <thead><tr><th>Kind</th><th>Good for</th><th>Risk</th></tr></thead>
  <tbody>
    <tr><td>AWS managed — job function (<code>ReadOnlyAccess</code>, <code>PowerUserAccess</code>, <code>AdministratorAccess</code>)</td><td>Humans in a sandbox, a first draft</td><td>Very broad; <code>ReadOnlyAccess</code> can still read every S3 object and many secrets' metadata</td></tr>
    <tr><td>AWS managed — service (<code>AmazonS3ReadOnlyAccess</code>, <code>AmazonSQSFullAccess</code>)</td><td>Quick prototypes</td><td>All resources of that service, every bucket or queue</td></tr>
    <tr><td>Customer managed</td><td>Your applications and teams — scoped to your ARNs, versioned, reusable</td><td>You maintain them</td></tr>
    <tr><td>Inline</td><td>A strict one-to-one link (the permission must die with the identity)</td><td>Hard to audit across many identities</td></tr>
  </tbody>
</table>
<p>A practical rule used by many teams: AWS managed policies for <em>people</em> in non-production accounts; customer managed, resource-scoped policies for <em>workloads</em> everywhere.</p>

<h3>Permission boundaries — a ceiling you can delegate</h3>
<p>Your team lead wants developers to create roles for their own Lambda functions without asking every time — but must not let them create a role with <code>AdministratorAccess</code>. A <strong>permissions boundary</strong> is a managed policy attached to a user or role that sets the <em>maximum</em> it can ever have: the effective permissions are the <strong>intersection</strong> of its identity policies and its boundary. The lead allows <code>iam:CreateRole</code> only on condition that the new role carries this boundary:</p>
${MA_BIEN}
<p>Now even if a developer attaches <code>AdministratorAccess</code> to the new role, the role can only use S3, SQS, CloudWatch Logs and DynamoDB. Boundaries, like SCPs, never grant anything. (Our emulator stores boundaries but does not enforce them, so this part is shown as configuration only — the behaviour is described in the AWS documentation linked below.)</p>

<h3>Removing what was never used</h3>
<ul>
  <li><strong>Credential report</strong> — one CSV for the whole account: every user, whether their password and keys are active, when each key was last rotated and <em>last used</em>. Run for real:</li>
</ul>
${OUT_13_BAOCAO}
<ul>
  <li><strong>Last accessed information</strong> — for any user, group, role or policy, IAM shows which services (and for some services, which actions) were used and when. A role that has not touched DynamoDB in 90 days does not need DynamoDB.</li>
  <li><strong>IAM Access Analyzer policy generation</strong> — choose a role and up to 90 days of CloudTrail history; Access Analyzer writes a policy containing only the actions actually called. You then narrow the resources by hand.</li>
  <li><strong>Unused access findings</strong> — Access Analyzer (a paid analyzer type) continuously lists unused roles, keys, passwords and permissions across the account or organization.</li>
</ul>

<h3>Hacker's view: eight minutes from a test key to administrator (November 2025)</h3>
<p>Sysdig's Threat Research Team described an intrusion it observed on 28 November 2025 (published 3 February 2026):</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0:00</span><span class="lz-t">A test key in a public bucket</span><span class="lz-d">The attacker searched public S3 buckets with AI-tool naming and found valid credentials of an IAM user in a bucket of RAG data.</span></div>
  <div class="lz-step"><span class="lz-k">≈ 0:06</span><span class="lz-t">Excessive but “harmless-looking” permissions</span><span class="lz-d">The user could read and write Lambda: <code>UpdateFunctionCode</code> and <code>UpdateFunctionConfiguration</code>. One existing function ran with an administrative execution role.</span></div>
  <div class="lz-step"><span class="lz-k">≈ 0:08</span><span class="lz-t">Code injection</span><span class="lz-d">The attacker replaced that function's code (raising its timeout from 3 to 30 seconds) so that it created access keys for an admin user — then invoked it.</span></div>
  <div class="lz-step"><span class="lz-k">≈ 0:11</span><span class="lz-t">Backdoor and spending</span><span class="lz-d">An IAM user <code>backdoor-admin</code> with AdministratorAccess; 19 principals used in total; Bedrock models invoked; a <code>p4d.24xlarge</code> GPU instance (32.77 USD/hour) launched.</span></div>
</div>
<p>No AWS bug was involved. The defenses Sysdig lists are least-privilege ones: no long-term keys where roles work; restrict <code>UpdateFunctionCode</code> to specific functions and limit <code>UpdateFunctionConfiguration</code> and <code>iam:PassRole</code>; never give a function an admin execution role; keep buckets private; use SCPs to forbid unneeded models and instance types.</p>

<h3>Real-job link</h3>
<p>In most companies you will request permissions through a ticket: “role X needs <code>sqs:SendMessage</code> on queue Y because feature Z”. Reviewers approve precise requests quickly and reject “give me full access”. Writing the minimal policy yourself, with the ARN, is the fastest way to get what you need.</p>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How do you apply least privilege when you do not know which permissions an app needs?”</strong> — Start with nothing in a dev account, add permissions from AccessDenied errors, then use last-accessed data or Access Analyzer policy generation to trim; scope resources to ARNs.</li>
  <li><strong>“What is a permissions boundary?”</strong> — A managed policy that caps the maximum permissions of a user or role; effective permissions are the intersection with its identity policies. Used to delegate role creation safely.</li>
  <li><strong>“Why is lambda:UpdateFunctionCode a sensitive permission?”</strong> — Whoever can change a function's code can act with that function's execution role; if the role is powerful, it is a privilege-escalation path (as in the 2025 incident).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Create a user with no policy on Moto. Its job: list the bucket and read <code>uploads/*</code>.</li>
  <li>Run the job, read each AccessDenied, add one statement at a time until it works. Count how many rounds you needed.</li>
  <li>Generate a credential report and find which keys were last used today.</li>
</ol>
<p><strong>Done when:</strong> the final policy has exactly two Allow statements with ARNs (no <code>*</code> in Action or Resource except <code>uploads/*</code>), and reading <code>bao-cao/</code> still fails.</p>
${giai('Hint: the two statements', '<p>One <code>s3:ListBucket</code> on <code>arn:aws:s3:::labflow-anh</code>; one <code>s3:GetObject</code> on <code>arn:aws:s3:::labflow-anh/uploads/*</code>. The credential report: <code>aws iam generate-credential-report</code>, then <code>aws iam get-credential-report --query Content --output text | base64 -d</code>.</p>')}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Least privilege</span><span class="v">Grant only the permissions a task needs, on only the resources it touches.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">What an attacker can reach with one stolen credential.</span></div>
  <div class="kv"><span class="k">Permissions boundary</span><span class="v">A managed policy that caps a user's or role's maximum permissions.</span></div>
  <div class="kv"><span class="k">Credential report</span><span class="v">Account-wide CSV of users, passwords, keys, rotation and last use.</span></div>
  <div class="kv"><span class="k">Last accessed information</span><span class="v">Which services/actions an identity actually used, and when.</span></div>
  <div class="kv"><span class="k">Policy generation</span><span class="v">Access Analyzer builds a policy from up to 90 days of CloudTrail activity.</span></div>
  <div class="kv"><span class="k">Privilege escalation</span><span class="v">Using one permission (e.g. UpdateFunctionCode, PassRole) to obtain more.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Permissions decide the blast radius of the leak you cannot fully prevent.</li>
  <li>Start from zero, add from AccessDenied, scope to ARNs.</li>
  <li>AWS managed policies are broad; workloads deserve customer managed policies.</li>
  <li>Boundaries and SCPs cap; they never grant.</li>
  <li>Trim with credential reports, last accessed data and Access Analyzer.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html', '📐', 'AWS docs — Permissions boundaries for IAM entities', 'Effective permissions, delegation examples.')}
${tl('https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes', '🕵️', 'Sysdig — AI-assisted cloud intrusion achieves admin access in 8 minutes', 'The full timeline of the November 2025 incident.')}

<h3>Sources</h3>
<ul>
  <li>Permissions boundaries: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html</a></li>
  <li>Access Analyzer policy generation (up to 90 days of CloudTrail): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html</a></li>
  <li>Credential reports: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html</a></li>
  <li>Sysdig Threat Research Team, 3 Feb 2026: <a href="https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes" target="_blank" rel="noopener">sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes</a></li>
</ul>
</div>
`;

const L13_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 3</span>
<h2>1.3 — Quyền tối thiểu trong thực tế</h2>
<p class="lead">“Chỉ cấp những quyền cần cho công việc” nói thì dễ, làm thì khó, vì không ai biết trước danh sách chính xác. Bài này đưa bạn một phương pháp dùng được: bắt đầu từ số không, để AWS nói còn thiếu gì, thêm đúng cái đó — rồi dùng chính công cụ của AWS gỡ những gì chưa bao giờ dùng. Sau đó ta xem một quyền thừa đã khiến một công ty thật trả giá thế nào vào tháng 11/2025.</p>

<h3>Bán kính vụ nổ — vì sao “dư một chút” không vô hại</h3>
<p>Hãy coi quyền là <strong>bán kính vụ nổ</strong> của một thông tin xác thực bị đánh cắp. Khoá chỉ đọc được một thư mục báo cáo thì lộ một thư mục. Khoá có <code>s3:*</code> thì lộ mọi bucket. Khoá sửa được mã Lambda thì, như ta sắp thấy, có thể thành quản trị viên. Bạn không chọn được chuyện một ngày nào đó khoá bị lộ — bài 0.9 và 1.7 cho thấy đội cẩn thận cũng gặp — nhưng bạn chọn được cái lỗ to cỡ nào khi nó xảy ra.</p>

<h3>Phương pháp: bắt đầu từ 0, đọc lỗi, thêm một dòng</h3>
<p>Một bot báo cáo cần đọc báo cáo tháng trong <code>bao-cao/</code>. Ta tạo nó <strong>không</strong> có policy nào, chạy việc của nó, đọc lỗi, rồi thêm đúng thứ lỗi yêu cầu:</p>
${MA_BC2}
${OUT_13_TU0}
<p>Trước: bị từ chối (mặc định từ chối). Sau khi thêm hai luật: đọc được báo cáo, không đọc được ảnh trong <code>uploads/</code>, không ghi được. Mỗi thông báo AccessDenied nêu tên action còn thiếu — trên AWS thật nó còn nêu cả tài nguyên, và CloudTrail ghi lại lời gọi bị từ chối với <code>errorCode</code> là <code>AccessDenied</code> để bạn tìm lại sau. Cách này chậm hơn gắn <code>AmazonS3FullAccess</code> khoảng mười phút. Nó cũng là khác biệt giữa lộ một bản báo cáo và lộ cả công ty.</p>

<h3>Chọn loại policy</h3>
<table>
  <thead><tr><th>Loại</th><th>Hợp với</th><th>Rủi ro</th></tr></thead>
  <tbody>
    <tr><td>AWS managed — theo chức danh (<code>ReadOnlyAccess</code>, <code>PowerUserAccess</code>, <code>AdministratorAccess</code>)</td><td>Con người trong tài khoản thử nghiệm, bản nháp đầu</td><td>Rất rộng; <code>ReadOnlyAccess</code> vẫn đọc được mọi object S3 và siêu dữ liệu của nhiều bí mật</td></tr>
    <tr><td>AWS managed — theo dịch vụ (<code>AmazonS3ReadOnlyAccess</code>, <code>AmazonSQSFullAccess</code>)</td><td>Làm mẫu nhanh</td><td>Mọi tài nguyên của dịch vụ đó, mọi bucket hay mọi hàng đợi</td></tr>
    <tr><td>Customer managed</td><td>Ứng dụng và nhóm của bạn — giới hạn theo ARN, có phiên bản, dùng lại được</td><td>Bạn phải tự bảo trì</td></tr>
    <tr><td>Inline</td><td>Gắn chặt một–một (quyền phải chết theo danh tính)</td><td>Khó soát khi có nhiều danh tính</td></tr>
  </tbody>
</table>
<p>Một quy tắc thực dụng nhiều nhóm dùng: AWS managed cho <em>con người</em> ở tài khoản không phải production; customer managed, giới hạn theo tài nguyên cho <em>ứng dụng</em> ở mọi nơi.</p>

<h3>Permission boundary — cái trần có thể giao quyền</h3>
<p>Trưởng nhóm muốn lập trình viên tự tạo role cho Lambda của mình mà không phải xin mỗi lần — nhưng không được để họ tạo role có <code>AdministratorAccess</code>. <strong>Permissions boundary</strong> là một managed policy gắn vào user hoặc role, đặt mức quyền <em>tối đa</em> nó có thể có: quyền thực tế là <strong>phần giao</strong> giữa policy danh tính và boundary. Trưởng nhóm chỉ cho <code>iam:CreateRole</code> với điều kiện role mới phải mang boundary này:</p>
${MA_BIEN}
<p>Giờ dù lập trình viên gắn <code>AdministratorAccess</code> vào role mới, role đó cũng chỉ dùng được S3, SQS, CloudWatch Logs và DynamoDB. Boundary, cũng như SCP, không bao giờ cấp quyền. (Trình giả lập của ta lưu boundary nhưng không thi hành, nên phần này chỉ trình bày cấu hình — hành vi theo tài liệu AWS dẫn bên dưới.)</p>

<h3>Gỡ những gì chưa bao giờ dùng</h3>
<ul>
  <li><strong>Credential report</strong> — một tệp CSV cho cả tài khoản: mọi user, mật khẩu và khoá có đang bật không, mỗi khoá xoay lần cuối khi nào và <em>dùng lần cuối</em> khi nào. Chạy thật:</li>
</ul>
${OUT_13_BAOCAO}
<ul>
  <li><strong>Last accessed information</strong> — với mọi user, group, role hay policy, IAM cho biết dịch vụ nào (với vài dịch vụ là cả action nào) đã được dùng và khi nào. Role 90 ngày không chạm DynamoDB thì không cần DynamoDB.</li>
  <li><strong>IAM Access Analyzer sinh policy</strong> — chọn một role và tối đa 90 ngày lịch sử CloudTrail; Access Analyzer viết ra policy chỉ gồm các action thực sự được gọi. Bạn thu hẹp resource bằng tay.</li>
  <li><strong>Unused access findings</strong> — Access Analyzer (loại analyzer tính phí) liên tục liệt kê role, khoá, mật khẩu và quyền không dùng trong tài khoản hoặc cả tổ chức.</li>
</ul>

<h3>Góc hacker: tám phút từ một khoá thử nghiệm tới quản trị viên (11/2025)</h3>
<p>Nhóm nghiên cứu mối đe doạ của Sysdig mô tả một vụ xâm nhập họ quan sát ngày 28/11/2025 (công bố 03/02/2026):</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0:00</span><span class="lz-t">Khoá thử nghiệm trong bucket công khai</span><span class="lz-d">Kẻ tấn công lục các bucket S3 công khai có tên kiểu công cụ AI và thấy thông tin xác thực còn hiệu lực của một IAM user trong bucket dữ liệu RAG.</span></div>
  <div class="lz-step"><span class="lz-k">≈ 0:06</span><span class="lz-t">Quyền thừa nhưng “trông vô hại”</span><span class="lz-d">User đó đọc và ghi được Lambda: <code>UpdateFunctionCode</code> và <code>UpdateFunctionConfiguration</code>. Một function có sẵn chạy với execution role quyền quản trị.</span></div>
  <div class="lz-step"><span class="lz-k">≈ 0:08</span><span class="lz-t">Chèn mã</span><span class="lz-d">Kẻ tấn công thay mã của function đó (nâng thời gian chạy tối đa từ 3 lên 30 giây) để nó tạo access key cho một user quản trị — rồi gọi nó.</span></div>
  <div class="lz-step"><span class="lz-k">≈ 0:11</span><span class="lz-t">Cửa sau và tiêu tiền</span><span class="lz-d">Một IAM user <code>backdoor-admin</code> có AdministratorAccess; tổng cộng 19 principal bị dùng; gọi các mô hình Bedrock; bật một máy GPU <code>p4d.24xlarge</code> (32,77 USD/giờ).</span></div>
</div>
<p>Không có lỗi nào của AWS ở đây. Các cách phòng Sysdig liệt kê đều là quyền tối thiểu: không dùng khoá dài hạn khi role làm được; giới hạn <code>UpdateFunctionCode</code> vào đúng function, hạn chế <code>UpdateFunctionConfiguration</code> và <code>iam:PassRole</code>; không bao giờ cho function execution role quyền quản trị; giữ bucket riêng tư; dùng SCP cấm mô hình và loại máy không cần.</p>

<h3>Liên hệ đi làm</h3>
<p>Ở hầu hết công ty, bạn xin quyền qua ticket: “role X cần <code>sqs:SendMessage</code> trên hàng đợi Y vì tính năng Z”. Người duyệt duyệt nhanh yêu cầu chính xác và trả lại “cho em full quyền”. Tự viết policy tối thiểu, kèm ARN, là cách nhanh nhất để có thứ bạn cần.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Áp dụng quyền tối thiểu thế nào khi không biết ứng dụng cần quyền gì?”</strong> — Bắt đầu từ không có gì ở tài khoản dev, thêm quyền theo lỗi AccessDenied, rồi dùng last-accessed hoặc Access Analyzer sinh policy để cắt bớt; giới hạn resource theo ARN.</li>
  <li><strong>“Permissions boundary là gì?”</strong> — Managed policy đặt trần quyền tối đa cho user hoặc role; quyền thực tế là phần giao với policy danh tính. Dùng để giao quyền tạo role một cách an toàn.</li>
  <li><strong>“Vì sao lambda:UpdateFunctionCode là quyền nhạy cảm?”</strong> — Ai sửa được mã function là hành động được bằng execution role của function đó; role mạnh thì đó là đường leo thang đặc quyền (như vụ 2025).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Tạo một user không có policy trên Moto. Việc của nó: liệt kê bucket và đọc <code>uploads/*</code>.</li>
  <li>Chạy việc đó, đọc từng AccessDenied, thêm từng luật một tới khi chạy được. Đếm xem cần mấy vòng.</li>
  <li>Sinh credential report và tìm khoá nào được dùng lần cuối hôm nay.</li>
</ol>
<p><strong>Đạt khi:</strong> policy cuối có đúng hai luật Allow kèm ARN (không có <code>*</code> trong Action hay Resource ngoài <code>uploads/*</code>), và đọc <code>bao-cao/</code> vẫn bị chặn.</p>
${giai('Gợi ý: hai luật', '<p>Một luật <code>s3:ListBucket</code> trên <code>arn:aws:s3:::labflow-anh</code>; một luật <code>s3:GetObject</code> trên <code>arn:aws:s3:::labflow-anh/uploads/*</code>. Credential report: <code>aws iam generate-credential-report</code>, rồi <code>aws iam get-credential-report --query Content --output text | base64 -d</code>.</p>')}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Least privilege</span><span class="v">Chỉ cấp quyền công việc cần, chỉ trên tài nguyên nó chạm tới.</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">Thứ kẻ tấn công với tới được bằng một thông tin xác thực bị đánh cắp.</span></div>
  <div class="kv"><span class="k">Permissions boundary</span><span class="v">Managed policy đặt trần quyền tối đa của user hoặc role.</span></div>
  <div class="kv"><span class="k">Credential report</span><span class="v">CSV toàn tài khoản: user, mật khẩu, khoá, lần xoay và lần dùng cuối.</span></div>
  <div class="kv"><span class="k">Last accessed information</span><span class="v">Danh tính đã thực sự dùng dịch vụ/action nào, khi nào.</span></div>
  <div class="kv"><span class="k">Policy generation</span><span class="v">Access Analyzer dựng policy từ tối đa 90 ngày hoạt động trong CloudTrail.</span></div>
  <div class="kv"><span class="k">Privilege escalation</span><span class="v">Dùng một quyền (ví dụ UpdateFunctionCode, PassRole) để có thêm quyền.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Quyền quyết định bán kính của vụ lộ mà bạn không ngăn được hoàn toàn.</li>
  <li>Bắt đầu từ 0, thêm theo AccessDenied, giới hạn theo ARN.</li>
  <li>AWS managed policy rộng; ứng dụng xứng đáng có customer managed policy.</li>
  <li>Boundary và SCP đặt trần; không bao giờ cấp quyền.</li>
  <li>Cắt tỉa bằng credential report, last accessed và Access Analyzer.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html', '📐', 'AWS docs — Permissions boundaries for IAM entities', 'Quyền thực tế, ví dụ giao quyền.')}
${tl('https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes', '🕵️', 'Sysdig — AI-assisted cloud intrusion achieves admin access in 8 minutes', 'Toàn bộ dòng thời gian vụ 11/2025.')}

<h3>Nguồn</h3>
<ul>
  <li>Permissions boundaries: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html</a></li>
  <li>Access Analyzer sinh policy (tối đa 90 ngày CloudTrail): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html</a></li>
  <li>Credential report: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html</a></li>
  <li>Sysdig Threat Research Team, 03/02/2026: <a href="https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes" target="_blank" rel="noopener">sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.4 — Khoá truy cập, profile, Identity Center ═══════════════════════════ */
const MA_SSO = bash(`
# ~/.aws/config sau khi chạy: aws configure sso
[sso-session cong-ty]
sso_start_url = https://cong-ty.awsapps.com/start
sso_region = ap-southeast-1
sso_registration_scopes = sso:account:access

[profile labflow-dev]
sso_session = cong-ty
sso_account_id = 111122223333
sso_role_name = Developer
region = ap-southeast-1

# mỗi sáng:
aws sso login --profile labflow-dev      # mở trình duyệt, đăng nhập + MFA
aws s3 ls --profile labflow-dev           # khoá tạm tự làm mới, không có khoá nào nằm trên đĩa lâu dài`);
const MA_GITLEAKS = bash(`
# .gitignore
.env
.aws/
*.pem

# .pre-commit-config.yaml (pre-commit.com) — chặn commit có khoá trước khi nó rời máy
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.30.1
    hooks:
      - id: gitleaks`);

const L14_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 4</span>
<h2>1.4 — Access keys, CLI profiles and IAM Identity Center</h2>
<p class="lead">An access key is a password that never expires, cannot have MFA and works from anywhere in the world. Sometimes you still need one. This lesson shows where keys live on your machine, how to switch between several identities without mixing them up, how to rotate a key without downtime (run for real), and how IAM Identity Center lets you stop keeping long-term keys at all.</p>

<h3>Two halves and two prefixes</h3>
<ul>
  <li><strong>Access key ID</strong> — public-ish identifier. <code>AKIA…</code> = long-term key of an IAM user; <code>ASIA…</code> = temporary key from STS, always accompanied by a <strong>session token</strong>.</li>
  <li><strong>Secret access key</strong> — 40 characters, shown <em>once</em> at creation. AWS never shows it again; if you lose it, you create a new key.</li>
  <li>A user can have at most <strong>two</strong> keys — exactly enough to rotate.</li>
</ul>

<h3>Where the CLI and SDKs look: ~/.aws</h3>
<p>Two plain-text files. <code>config</code> holds settings per profile (region, output format, SSO, roles to assume); <code>credentials</code> holds secrets. Each <code>[name]</code> block is a <strong>profile</strong>, chosen with <code>--profile</code> or the <code>AWS_PROFILE</code> environment variable. The provider chain from lesson 0.4 decides which one wins if several are set. Run for real:</p>
${OUT_14_PROFILE}
<p><code>configure list</code> is the quickest answer to “which credentials am I using right now, and where do they come from?” Make it a reflex before any destructive command — and note that <code>labflow-admin</code> is a different identity with different power in the same terminal.</p>
<div class="callout warn">The <code>credentials</code> file is plain text. Anything that can read your home directory — a malicious npm or PyPI package (lesson 0.4: ctx 2022), a backup uploaded to the wrong place, a screen share — can read the keys. That is the strongest argument for the SSO setup below.</div>

<h3>Rotating a key without downtime — run for real</h3>
<ol>
  <li>Create the second key (the user now has two active keys).</li>
  <li>Deploy the new key everywhere the old one was used.</li>
  <li>Deactivate the old key — reversible, a safety net in case something still uses it.</li>
  <li>Watch <code>get-access-key-last-used</code> / the credential report for a few days.</li>
  <li>Delete the old key.</li>
</ol>
${OUT_14_XOAY}
<p>The third <code>create-access-key</code> fails with <code>LimitExceeded</code>: two keys maximum. After deletion, the old key is rejected with <code>InvalidClientTokenId</code>; after updating the profile, the new key works. (On real AWS an <em>Inactive</em> key is already rejected; the emulator only rejects deleted keys.)</p>

<h3>IAM Identity Center — humans without long-term keys</h3>
<p>IAM Identity Center (formerly AWS SSO) is the recommended way for people to access AWS. You define users once (or connect Google Workspace / Microsoft Entra ID), create <strong>permission sets</strong> (“Developer”, “ReadOnly”) and assign them to accounts. Each login produces <strong>temporary</strong> credentials for a role; nothing long-lived is written to disk:</p>
${MA_SSO}
<p>With Identity Center, the “leaked key in a Git repository” scenario mostly disappears for humans: there is no key to leak, and a stolen session expires within hours. Identity Center is free; in a personal learning account you can enable it in a few minutes.</p>

<h3>Keys and code: rules that hold in every company</h3>
<ul>
  <li>Never put keys in source code, Dockerfiles, or <code>application.yml</code>. Code on AWS uses a <strong>role</strong> (EC2 instance profile, ECS task role, Lambda execution role — lesson 1.5); code on your laptop uses your profile.</li>
  <li>Ignore <code>.env</code> and <code>.aws/</code> in Git and run a secret scanner before each commit:</li>
</ul>
${MA_GITLEAKS}
<ul>
  <li>Secrets that an application needs (database password, API tokens) belong in Secrets Manager or Parameter Store (Chapter 6), not in environment files baked into images.</li>
</ul>

<h3>Hacker's view: LLMjacking (Sysdig, May 2024)</h3>
<p>In May 2024 Sysdig named a new kind of attack: stolen cloud credentials used to run <em>other people's</em> AI models. The keys were taken from a server running a vulnerable Laravel version (CVE-2021-3129) — keys stored where the web application could read them. The attackers first called Bedrock's <code>InvokeModel</code> with a deliberately invalid parameter: a <code>ValidationException</code> meant “this key can use the model”, an <code>AccessDenied</code> meant “no”. They also checked whether prompt logging was enabled. Sysdig estimated a worst case of <strong>over 46,000 USD per day</strong> for the victim. Defenses: no long-term keys on servers (use roles), least privilege (a web server does not need Bedrock), SCPs that block unused services, and logging.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Profiles</strong> are like having two SIM cards in one phone: you must look at which one is active before calling. Many production incidents start with a command meant for dev sent with the prod profile.</li>
  <li><strong>At work</strong>, a common first-week task is “rotate the CI key” or “remove the key from that old Jenkins”. You now know the five steps and why the order matters.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How do you rotate an access key without breaking production?”</strong> — Create a second key, deploy it, deactivate the old one, monitor last-used, then delete. Two keys per user exist precisely for this.</li>
  <li><strong>“What is the difference between AKIA and ASIA keys?”</strong> — AKIA: long-term IAM user key. ASIA: temporary STS credentials that also require a session token and expire.</li>
  <li><strong>“How should developers in your team access AWS?”</strong> — IAM Identity Center with MFA and permission sets per account; no IAM users with long-term keys for humans.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Create two profiles that point to two different users on Moto. Run <code>aws configure list</code> and <code>get-caller-identity</code> for each.</li>
  <li>Rotate the key of one user following the five steps; show that the old key is rejected and the new one works.</li>
  <li>Add a gitleaks pre-commit hook to a test repository and try to commit a file containing a fake AKIA key.</li>
</ol>
<p><strong>Done when:</strong> both profiles print different ARNs, the old key fails with InvalidClientTokenId, and the commit is blocked by gitleaks.</p>
${giai('Hint: the environment variables for a separate config', bash(`
export AWS_CONFIG_FILE=$PWD/.aws/config
export AWS_SHARED_CREDENTIALS_FILE=$PWD/.aws/credentials
aws configure set aws_access_key_id AKIA... --profile hai
aws iam get-access-key-last-used --access-key-id AKIA...   # before deleting the old key`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access key</span><span class="v">Access key ID + secret access key; signs API requests (SigV4).</span></div>
  <div class="kv"><span class="k">AKIA / ASIA</span><span class="v">Prefixes of long-term (IAM user) and temporary (STS) key IDs.</span></div>
  <div class="kv"><span class="k">Profile</span><span class="v">A named set of settings and credentials in ~/.aws, chosen with --profile.</span></div>
  <div class="kv"><span class="k">Key rotation</span><span class="v">Replacing a key: create, deploy, deactivate, verify, delete.</span></div>
  <div class="kv"><span class="k">IAM Identity Center</span><span class="v">AWS single sign-on: users, permission sets, temporary credentials.</span></div>
  <div class="kv"><span class="k">Permission set</span><span class="v">A template of policies Identity Center turns into a role in each assigned account.</span></div>
  <div class="kv"><span class="k">LLMjacking</span><span class="v">Using stolen cloud credentials to run paid AI models at the victim's expense.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Long-term keys never expire and have no MFA — keep as few as possible.</li>
  <li>Profiles separate identities; check <code>configure list</code> before destructive commands.</li>
  <li>Rotate with two keys: create → deploy → deactivate → watch → delete.</li>
  <li>Humans: Identity Center with temporary credentials; workloads: roles.</li>
  <li>Keys never in code or images; scan before every commit.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html', '🔑', 'AWS CLI — Configuring IAM Identity Center authentication', 'aws configure sso, sso-session, token refresh.')}
${tl('https://sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack/', '🤖', 'Sysdig — LLMjacking: stolen cloud credentials used in new AI attack', 'May 2024 original report.')}

<h3>Sources</h3>
<ul>
  <li>Managing access keys: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html</a></li>
  <li>What is IAM Identity Center: <a href="https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html" target="_blank" rel="noopener">docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html</a></li>
  <li>CLI SSO configuration: <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" target="_blank" rel="noopener">docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html</a></li>
  <li>Sysdig, 6 May 2024: <a href="https://sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack/" target="_blank" rel="noopener">sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack</a></li>
</ul>
</div>
`;

const L14_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 4</span>
<h2>1.4 — Khoá truy cập, profile CLI và IAM Identity Center</h2>
<p class="lead">Access key là một mật khẩu không bao giờ hết hạn, không gắn được MFA và dùng được từ bất cứ đâu trên thế giới. Đôi khi bạn vẫn cần nó. Bài này chỉ ra khoá nằm ở đâu trên máy bạn, cách chuyển qua lại nhiều danh tính mà không nhầm, cách xoay khoá không gián đoạn (chạy thật), và cách IAM Identity Center giúp bạn thôi giữ khoá dài hạn.</p>

<h3>Hai nửa và hai tiền tố</h3>
<ul>
  <li><strong>Access key ID</strong> — mã nhận diện, gần như công khai. <code>AKIA…</code> = khoá dài hạn của IAM user; <code>ASIA…</code> = khoá tạm do STS cấp, luôn đi kèm <strong>session token</strong>.</li>
  <li><strong>Secret access key</strong> — 40 ký tự, chỉ hiện <em>một lần</em> lúc tạo. AWS không bao giờ cho xem lại; mất thì tạo khoá mới.</li>
  <li>Một user có tối đa <strong>hai</strong> khoá — vừa đủ để xoay.</li>
</ul>

<h3>Nơi CLI và SDK tìm: ~/.aws</h3>
<p>Hai tệp chữ thường. <code>config</code> chứa thiết lập theo profile (region, định dạng output, SSO, role cần nhận vai); <code>credentials</code> chứa bí mật. Mỗi khối <code>[tên]</code> là một <strong>profile</strong>, chọn bằng <code>--profile</code> hoặc biến môi trường <code>AWS_PROFILE</code>. Chuỗi nguồn khoá ở bài 0.4 quyết định cái nào thắng khi đặt nhiều cái. Chạy thật:</p>
${OUT_14_PROFILE}
<p><code>configure list</code> là câu trả lời nhanh nhất cho “mình đang dùng khoá nào, lấy từ đâu?”. Hãy tập phản xạ chạy nó trước mọi lệnh phá huỷ — và để ý <code>labflow-admin</code> là một danh tính khác, quyền khác, ngay trong cùng cửa sổ terminal.</p>
<div class="callout warn">Tệp <code>credentials</code> là chữ thường. Bất cứ thứ gì đọc được thư mục nhà của bạn — một gói npm hay PyPI độc (bài 0.4: ctx 2022), một bản sao lưu đẩy nhầm chỗ, một lần chia sẻ màn hình — đều đọc được khoá. Đó là lý lẽ mạnh nhất cho cách SSO bên dưới.</div>

<h3>Xoay khoá không gián đoạn — chạy thật</h3>
<ol>
  <li>Tạo khoá thứ hai (user giờ có hai khoá đang bật).</li>
  <li>Triển khai khoá mới ở mọi nơi khoá cũ đang dùng.</li>
  <li>Vô hiệu khoá cũ — đảo ngược được, là lưới an toàn nếu còn chỗ dùng nó.</li>
  <li>Theo dõi <code>get-access-key-last-used</code> / credential report vài ngày.</li>
  <li>Xoá khoá cũ.</li>
</ol>
${OUT_14_XOAY}
<p>Lần <code>create-access-key</code> thứ ba báo <code>LimitExceeded</code>: tối đa hai khoá. Sau khi xoá, khoá cũ bị từ chối với <code>InvalidClientTokenId</code>; sửa profile sang khoá mới thì chạy được. (Trên AWS thật, khoá <em>Inactive</em> đã bị từ chối ngay; trình giả lập chỉ từ chối khoá đã xoá.)</p>

<h3>IAM Identity Center — con người không cần khoá dài hạn</h3>
<p>IAM Identity Center (tên cũ AWS SSO) là cách AWS khuyên dùng cho con người. Bạn khai báo người dùng một lần (hoặc nối Google Workspace / Microsoft Entra ID), tạo <strong>permission set</strong> (“Developer”, “ReadOnly”) rồi gán cho từng tài khoản. Mỗi lần đăng nhập sinh khoá <strong>tạm</strong> cho một role; không có gì sống lâu được ghi xuống đĩa:</p>
${MA_SSO}
<p>Với Identity Center, kịch bản “khoá lộ trong kho Git” gần như biến mất với con người: không có khoá để lộ, và phiên bị đánh cắp sẽ hết hạn sau vài giờ. Identity Center miễn phí; ở tài khoản học cá nhân bạn bật nó trong vài phút.</p>

<h3>Khoá và mã: luật đúng ở mọi công ty</h3>
<ul>
  <li>Không bao giờ để khoá trong mã nguồn, Dockerfile, hay <code>application.yml</code>. Mã chạy trên AWS dùng <strong>role</strong> (instance profile của EC2, task role của ECS, execution role của Lambda — bài 1.5); mã trên máy bạn dùng profile của bạn.</li>
  <li>Cho <code>.env</code> và <code>.aws/</code> vào gitignore và chạy máy quét bí mật trước mỗi commit:</li>
</ul>
${MA_GITLEAKS}
<ul>
  <li>Bí mật ứng dụng cần (mật khẩu cơ sở dữ liệu, token API) thuộc về Secrets Manager hoặc Parameter Store (Chương 6), không phải tệp môi trường nướng sẵn trong image.</li>
</ul>

<h3>Góc hacker: LLMjacking (Sysdig, 05/2024)</h3>
<p>Tháng 5/2024, Sysdig đặt tên cho một kiểu tấn công mới: dùng thông tin xác thực cloud bị đánh cắp để chạy mô hình AI <em>bằng tiền người khác</em>. Khoá bị lấy từ một máy chủ chạy Laravel có lỗ hổng (CVE-2021-3129) — khoá để ở nơi ứng dụng web đọc được. Kẻ tấn công gọi <code>InvokeModel</code> của Bedrock với một tham số cố ý sai: nhận <code>ValidationException</code> nghĩa là “khoá này dùng được mô hình”, nhận <code>AccessDenied</code> nghĩa là “không”. Chúng còn kiểm xem việc ghi log câu lệnh có bật không. Sysdig ước tính trường hợp xấu nhất nạn nhân mất <strong>hơn 46 000 USD mỗi ngày</strong>. Cách phòng: không để khoá dài hạn trên máy chủ (dùng role), quyền tối thiểu (máy chủ web không cần Bedrock), SCP chặn dịch vụ không dùng, và bật log.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Profile</strong> giống điện thoại hai SIM: phải nhìn SIM nào đang bật trước khi gọi. Nhiều sự cố production bắt đầu từ một lệnh định chạy ở dev nhưng gửi đi bằng profile prod.</li>
  <li><strong>Khi đi làm</strong>, việc tuần đầu hay gặp là “xoay khoá CI” hoặc “gỡ khoá khỏi con Jenkins cũ”. Giờ bạn biết năm bước và vì sao thứ tự quan trọng.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Xoay access key thế nào để không làm sập production?”</strong> — Tạo khoá thứ hai, triển khai, vô hiệu khoá cũ, theo dõi lần dùng cuối, rồi xoá. Giới hạn hai khoá mỗi user sinh ra chính là cho việc này.</li>
  <li><strong>“Khoá AKIA khác ASIA thế nào?”</strong> — AKIA: khoá dài hạn của IAM user. ASIA: khoá tạm STS, cần thêm session token và có hạn.</li>
  <li><strong>“Lập trình viên trong nhóm nên truy cập AWS thế nào?”</strong> — IAM Identity Center có MFA, permission set theo từng tài khoản; không tạo IAM user khoá dài hạn cho con người.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Tạo hai profile trỏ tới hai user khác nhau trên Moto. Chạy <code>aws configure list</code> và <code>get-caller-identity</code> cho từng cái.</li>
  <li>Xoay khoá của một user theo năm bước; chứng minh khoá cũ bị từ chối, khoá mới chạy.</li>
  <li>Gắn hook pre-commit gitleaks vào một kho thử và thử commit một tệp chứa khoá AKIA giả.</li>
</ol>
<p><strong>Đạt khi:</strong> hai profile in hai ARN khác nhau, khoá cũ báo InvalidClientTokenId, và gitleaks chặn được commit.</p>
${giai('Gợi ý: biến môi trường cho bộ cấu hình riêng', bash(`
export AWS_CONFIG_FILE=$PWD/.aws/config
export AWS_SHARED_CREDENTIALS_FILE=$PWD/.aws/credentials
aws configure set aws_access_key_id AKIA... --profile hai
aws iam get-access-key-last-used --access-key-id AKIA...   # trước khi xoá khoá cũ`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access key</span><span class="v">Access key ID + secret access key; dùng ký request API (SigV4).</span></div>
  <div class="kv"><span class="k">AKIA / ASIA</span><span class="v">Tiền tố của khoá dài hạn (IAM user) và khoá tạm (STS).</span></div>
  <div class="kv"><span class="k">Profile</span><span class="v">Một bộ thiết lập và khoá có tên trong ~/.aws, chọn bằng --profile.</span></div>
  <div class="kv"><span class="k">Key rotation</span><span class="v">Thay khoá: tạo, triển khai, vô hiệu, kiểm, xoá.</span></div>
  <div class="kv"><span class="k">IAM Identity Center</span><span class="v">Đăng nhập một lần của AWS: người dùng, permission set, khoá tạm.</span></div>
  <div class="kv"><span class="k">Permission set</span><span class="v">Mẫu policy mà Identity Center biến thành role ở mỗi tài khoản được gán.</span></div>
  <div class="kv"><span class="k">LLMjacking</span><span class="v">Dùng khoá cloud bị đánh cắp để chạy mô hình AI tính tiền nạn nhân.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Khoá dài hạn không hết hạn, không có MFA — giữ càng ít càng tốt.</li>
  <li>Profile tách danh tính; xem <code>configure list</code> trước lệnh phá huỷ.</li>
  <li>Xoay bằng hai khoá: tạo → triển khai → vô hiệu → theo dõi → xoá.</li>
  <li>Con người: Identity Center với khoá tạm; ứng dụng: role.</li>
  <li>Khoá không bao giờ ở trong mã hay image; quét trước mỗi commit.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html', '🔑', 'AWS CLI — Configuring IAM Identity Center authentication', 'aws configure sso, sso-session, làm mới token.')}
${tl('https://sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack/', '🤖', 'Sysdig — LLMjacking: stolen cloud credentials used in new AI attack', 'Báo cáo gốc 05/2024.')}

<h3>Nguồn</h3>
<ul>
  <li>Quản lý access key: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html</a></li>
  <li>IAM Identity Center là gì: <a href="https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html" target="_blank" rel="noopener">docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html</a></li>
  <li>Cấu hình SSO cho CLI: <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html" target="_blank" rel="noopener">docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html</a></li>
  <li>Sysdig, 06/05/2024: <a href="https://sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack/" target="_blank" rel="noopener">sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.5 — Role và STS ═══════════════════════════ */
const MA_TIN_BC = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::123456789012:user/quan-tri" },
      "Action": "sts:AssumeRole" }
  ]
}`);
const MA_CROSS = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::999988887777:root" },
      "Action": "sts:AssumeRole",
      "Condition": { "StringEquals": { "sts:ExternalId": "labflow-7f3c91" } } }
  ]
}`);

const L15_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 5</span>
<h2>1.5 — Roles and temporary credentials (STS)</h2>
<p class="lead">Roles are how AWS avoids long-term keys: your application on EC2, your container on ECS, your function on Lambda, your CI pipeline and your colleagues from another account all <em>borrow</em> an identity for a limited time. This lesson takes AssumeRole apart step by step, shows the two policies every role needs, and proves with real calls what happens when one of them is missing.</p>

<h3>The visitor badge</h3>
<p>At reception you show your ID card, the guard checks the visitor list, and you receive a badge that opens specific doors until 6 p.m. Three things happened: <strong>the guard checked whether you are on the list</strong> (the role's <em>trust policy</em>), <strong>the badge opens certain doors</strong> (the role's <em>permission policies</em>), and <strong>it expires</strong> (the <em>session duration</em>). The service at reception is <strong>STS</strong> — AWS Security Token Service.</p>

<h3>AssumeRole step by step — run for real</h3>
<p>The role <code>doc-bao-cao</code> (“read reports”) trusts only the admin user and has the AWS managed <code>AmazonS3ReadOnlyAccess</code> policy:</p>
${MA_TIN_BC}
${OUT_15_ASSUME}
<ol>
  <li><strong>The caller</strong> (<code>quan-tri</code>) signs a request to <code>sts:AssumeRole</code> with its own credentials.</li>
  <li><strong>STS checks two things</strong>: the caller's identity policy allows <code>sts:AssumeRole</code> on this role, <em>and</em> the role's trust policy names the caller. (Inside one account either side can be enough in some cases; across accounts both are required — the safe habit is to write both.)</li>
  <li><strong>STS returns three values</strong>: an <code>ASIA…</code> key ID, a secret, a session token — and an <code>Expiration</code>. We asked for 900 seconds, the minimum; the default is one hour, the maximum is the role's <em>maximum session duration</em> (1–12 hours). A role assumed from another role session (“role chaining”) is limited to one hour.</li>
  <li><strong>The session has its own ARN</strong>: <code>assumed-role/doc-bao-cao/cuong-xem-bao-cao</code>. The session name appears in CloudTrail — set it to a person or a job ID, never to “test”.</li>
</ol>
<p>Using the three temporary values, the session can read but not write, and cannot touch IAM at all:</p>
${OUT_15_ROLE}

<h3>Two halves: trust and permissions — proven</h3>
<p>The reporting bot gets an identity policy allowing <code>sts:AssumeRole</code> on the role, but the role's trust policy does not mention it yet. Then we add it to the trust policy:</p>
${OUT_15_TRUST}
<p>Permission on the caller's side is not enough: the role itself must trust the caller. This is the most common cause of “AccessDenied on AssumeRole” at work. When you debug it, read both documents.</p>

<h3>Roles for AWS services</h3>
<table>
  <thead><tr><th>Where the code runs</th><th>Trust principal</th><th>How the code gets credentials</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>EC2</td><td><code>ec2.amazonaws.com</code></td><td>An <strong>instance profile</strong> wraps the role; the SDK reads temporary keys from the instance metadata service (IMDS)</td><td>4</td></tr>
    <tr><td>ECS Fargate</td><td><code>ecs-tasks.amazonaws.com</code></td><td><strong>Task role</strong> for your code; a separate <strong>execution role</strong> lets ECS pull the image and write logs</td><td>7</td></tr>
    <tr><td>Lambda</td><td><code>lambda.amazonaws.com</code></td><td><strong>Execution role</strong>; keys appear as environment variables inside the function</td><td>8</td></tr>
    <tr><td>GitHub Actions</td><td>OIDC provider (federated)</td><td><code>AssumeRoleWithWebIdentity</code> with a GitHub token</td><td>1.6, 12</td></tr>
  </tbody>
</table>
<p>The EC2 case, created for real — EC2 cannot use a role directly, it needs the instance-profile wrapper:</p>
${OUT_15_EC2}
<p>Your Spring Boot or Node.js code changes nothing: the SDK's default credential chain finds these temporary keys automatically and refreshes them before they expire. That is why “no keys in code” is achievable.</p>
<div class="callout warn">Passing a role to a service needs <code>iam:PassRole</code>. Whoever can pass a powerful role to a new Lambda or EC2 instance can use that role's power — the escalation path from lesson 1.3. Limit PassRole to specific role ARNs.</div>

<h3>Across accounts — and the confused deputy</h3>
<p>Companies split work into many accounts (dev, staging, prod, logging). A role in prod can trust another account; people in the tooling account “switch role” into prod for a session. When the other side is a <em>third-party vendor</em> (a monitoring SaaS, a cost tool), add an <strong>external ID</strong> condition so that a different customer of the same vendor cannot trick the vendor into using your role — the “confused deputy” problem:</p>
${MA_CROSS}

<h3>Revoking sessions that are already out</h3>
<p>Temporary keys cannot be deleted — they simply expire. If a role session is stolen, the console's <em>Revoke active sessions</em> button attaches an inline policy named <code>AWSRevokeOlderSessions</code> that denies everything to sessions issued before that moment (plus about 30 seconds). New sessions still work, so legitimate applications recover by re-assuming the role.</p>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“What is the difference between a trust policy and a permission policy?”</strong> — Trust: a resource policy on the role saying who may assume it. Permission: identity policies saying what the session may do.</li>
  <li><strong>“How does an app on EC2 get AWS credentials without keys in its configuration?”</strong> — Through an instance profile; the SDK fetches temporary role credentials from the instance metadata service and refreshes them.</li>
  <li><strong>“What is an external ID for?”</strong> — Preventing the confused-deputy problem when a third party assumes a role in your account.</li>
  <li><strong>“ECS task role vs execution role?”</strong> — Task role: permissions of your code. Execution role: permissions ECS needs to start the task (pull from ECR, write logs, read secrets for injection).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>On Moto, create a role <code>doc-anh</code> with <code>AmazonS3ReadOnlyAccess</code> and a trust policy for your admin user only.</li>
  <li>Assume it with <code>--duration-seconds 900</code>, export the three values, and prove that reading works and writing fails.</li>
  <li>Make a second user that has <code>sts:AssumeRole</code> but is not in the trust policy; show the AccessDenied, then fix the trust policy.</li>
</ol>
<p><strong>Done when:</strong> <code>get-caller-identity</code> prints an <code>assumed-role/…</code> ARN with your session name, and you can explain which policy blocked the second user.</p>
${giai('Hint: exporting the session', bash(`
read AK SK TK < <(aws sts assume-role --role-arn arn:aws:iam::123456789012:role/doc-anh \\
  --role-session-name ban --duration-seconds 900 \\
  --query 'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]' --output text)
export AWS_ACCESS_KEY_ID=$AK AWS_SECRET_ACCESS_KEY=$SK AWS_SESSION_TOKEN=$TK
aws sts get-caller-identity`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">STS</span><span class="v">Security Token Service: issues temporary credentials (AssumeRole, AssumeRoleWithWebIdentity…).</span></div>
  <div class="kv"><span class="k">Role session</span><span class="v">One use of a role; has its own ARN, session name and expiration.</span></div>
  <div class="kv"><span class="k">Session token</span><span class="v">Third part of temporary credentials; required with ASIA keys.</span></div>
  <div class="kv"><span class="k">Instance profile</span><span class="v">Container that lets an EC2 instance use a role.</span></div>
  <div class="kv"><span class="k">iam:PassRole</span><span class="v">Permission to hand a role to an AWS service.</span></div>
  <div class="kv"><span class="k">External ID</span><span class="v">Shared secret in a cross-account trust policy against the confused deputy.</span></div>
  <div class="kv"><span class="k">Role chaining</span><span class="v">Assuming a role from a role session; capped at one hour.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A role = trust policy (who) + permission policies (what) + session duration.</li>
  <li>STS returns ASIA key + secret + session token + expiration (15 min – 12 h).</li>
  <li>Services use roles through instance profiles, task roles and execution roles; the SDK finds them automatically.</li>
  <li>PassRole is powerful; external IDs protect cross-account roles for vendors.</li>
  <li>Stolen sessions are cut with “Revoke active sessions”.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html', '🎫', 'AWS STS API — AssumeRole', 'DurationSeconds, session tags, MFA, role chaining.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html', '🖥️', 'AWS docs — Using instance profiles', 'How EC2 receives role credentials.')}

<h3>Sources</h3>
<ul>
  <li>AssumeRole (900 s minimum, 1–12 h maximum, chaining 1 h): <a href="https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html" target="_blank" rel="noopener">docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html</a></li>
  <li>Revoking role session permissions (AWSRevokeOlderSessions): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html</a></li>
  <li>Instance profiles: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html</a></li>
  <li>Roles vs resource-based policies across accounts: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_compare-resource-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_compare-resource-policies.html</a></li>
</ul>
</div>
`;

const L15_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 5</span>
<h2>1.5 — Role và thông tin xác thực tạm (STS)</h2>
<p class="lead">Role là cách AWS tránh khoá dài hạn: ứng dụng của bạn trên EC2, container trên ECS, function trên Lambda, pipeline CI và đồng nghiệp ở tài khoản khác đều <em>mượn</em> một danh tính trong thời gian có hạn. Bài này tháo rời AssumeRole từng bước, chỉ ra hai policy mọi role cần, và chứng minh bằng lời gọi thật chuyện gì xảy ra khi thiếu một trong hai.</p>

<h3>Thẻ khách</h3>
<p>Ở quầy lễ tân bạn đưa căn cước, bảo vệ dò danh sách khách, rồi đưa bạn một thẻ mở được vài cửa tới 6 giờ chiều. Có ba việc đã xảy ra: <strong>bảo vệ kiểm bạn có trong danh sách không</strong> (<em>trust policy</em> của role), <strong>thẻ mở được những cửa nhất định</strong> (<em>policy quyền</em> của role), và <strong>thẻ hết hạn</strong> (<em>thời lượng phiên</em>). Dịch vụ ngồi ở quầy lễ tân là <strong>STS</strong> — AWS Security Token Service.</p>

<h3>AssumeRole từng bước — chạy thật</h3>
<p>Role <code>doc-bao-cao</code> chỉ tin user quản trị và có AWS managed policy <code>AmazonS3ReadOnlyAccess</code>:</p>
${MA_TIN_BC}
${OUT_15_ASSUME}
<ol>
  <li><strong>Bên gọi</strong> (<code>quan-tri</code>) ký một request tới <code>sts:AssumeRole</code> bằng khoá của chính mình.</li>
  <li><strong>STS kiểm hai thứ</strong>: policy danh tính của bên gọi cho phép <code>sts:AssumeRole</code> trên role này, <em>và</em> trust policy của role có tên bên gọi. (Trong cùng một tài khoản đôi khi một phía là đủ; khác tài khoản thì bắt buộc cả hai — thói quen an toàn là luôn viết cả hai.)</li>
  <li><strong>STS trả ba giá trị</strong>: mã khoá <code>ASIA…</code>, secret, session token — kèm <code>Expiration</code>. Ta xin 900 giây, mức tối thiểu; mặc định là một giờ, tối đa là <em>maximum session duration</em> của role (1–12 giờ). Nhận vai từ một phiên role khác (“role chaining”) bị giới hạn một giờ.</li>
  <li><strong>Phiên có ARN riêng</strong>: <code>assumed-role/doc-bao-cao/cuong-xem-bao-cao</code>. Tên phiên hiện trong CloudTrail — đặt bằng tên người hoặc mã job, đừng bao giờ là “test”.</li>
</ol>
<p>Dùng ba giá trị tạm, phiên này đọc được nhưng không ghi được, và không chạm được IAM:</p>
${OUT_15_ROLE}

<h3>Hai nửa: tin ai và quyền gì — chứng minh</h3>
<p>Bot báo cáo được policy danh tính cho phép <code>sts:AssumeRole</code> trên role, nhưng trust policy của role chưa nhắc tới nó. Rồi ta thêm nó vào trust policy:</p>
${OUT_15_TRUST}
<p>Có quyền ở phía bên gọi là chưa đủ: chính role phải tin bên gọi. Đây là nguyên nhân phổ biến nhất của “AccessDenied ở AssumeRole” khi đi làm. Lúc dò lỗi, đọc cả hai tài liệu.</p>

<h3>Role cho dịch vụ AWS</h3>
<table>
  <thead><tr><th>Mã chạy ở đâu</th><th>Principal được tin</th><th>Mã lấy khoá thế nào</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>EC2</td><td><code>ec2.amazonaws.com</code></td><td>Một <strong>instance profile</strong> bọc role; SDK đọc khoá tạm từ dịch vụ siêu dữ liệu của máy (IMDS)</td><td>4</td></tr>
    <tr><td>ECS Fargate</td><td><code>ecs-tasks.amazonaws.com</code></td><td><strong>Task role</strong> cho mã của bạn; một <strong>execution role</strong> riêng để ECS kéo image và ghi log</td><td>7</td></tr>
    <tr><td>Lambda</td><td><code>lambda.amazonaws.com</code></td><td><strong>Execution role</strong>; khoá hiện thành biến môi trường trong function</td><td>8</td></tr>
    <tr><td>GitHub Actions</td><td>OIDC provider (liên kết)</td><td><code>AssumeRoleWithWebIdentity</code> bằng token GitHub</td><td>1.6, 12</td></tr>
  </tbody>
</table>
<p>Trường hợp EC2, tạo thật — EC2 không dùng role trực tiếp được, nó cần lớp bọc instance profile:</p>
${OUT_15_EC2}
<p>Mã Spring Boot hay Node.js của bạn không đổi gì: chuỗi nguồn khoá mặc định của SDK tự tìm khoá tạm này và làm mới trước khi hết hạn. Nhờ vậy “không có khoá trong mã” là làm được.</p>
<div class="callout warn">Trao role cho một dịch vụ cần quyền <code>iam:PassRole</code>. Ai trao được một role mạnh cho Lambda hay EC2 mới là dùng được sức mạnh của role đó — chính đường leo thang ở bài 1.3. Giới hạn PassRole vào ARN role cụ thể.</div>

<h3>Khác tài khoản — và “cấp phó bị lừa”</h3>
<p>Công ty chia việc ra nhiều tài khoản (dev, staging, prod, log). Một role ở prod có thể tin một tài khoản khác; người ở tài khoản công cụ “switch role” sang prod trong một phiên. Khi phía bên kia là <em>nhà cung cấp bên thứ ba</em> (dịch vụ giám sát, công cụ chi phí), thêm điều kiện <strong>external ID</strong> để một khách hàng khác của cùng nhà cung cấp không lừa được họ dùng role của bạn — bài toán “confused deputy”:</p>
${MA_CROSS}

<h3>Thu hồi phiên đã phát ra</h3>
<p>Khoá tạm không xoá được — chúng chỉ hết hạn. Nếu một phiên role bị đánh cắp, nút <em>Revoke active sessions</em> trên console gắn một inline policy tên <code>AWSRevokeOlderSessions</code>, cấm mọi thứ với các phiên cấp trước thời điểm đó (cộng khoảng 30 giây). Phiên mới vẫn chạy, nên ứng dụng hợp lệ hồi phục bằng cách nhận vai lại.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Trust policy khác permission policy thế nào?”</strong> — Trust: policy tài nguyên trên role nói ai được nhận vai. Permission: policy danh tính nói phiên được làm gì.</li>
  <li><strong>“Ứng dụng trên EC2 lấy khoá AWS thế nào mà cấu hình không có khoá?”</strong> — Qua instance profile; SDK lấy khoá tạm của role từ dịch vụ siêu dữ liệu của máy và tự làm mới.</li>
  <li><strong>“External ID để làm gì?”</strong> — Chống bài toán confused deputy khi bên thứ ba nhận vai một role trong tài khoản của bạn.</li>
  <li><strong>“Task role khác execution role của ECS thế nào?”</strong> — Task role: quyền của mã bạn viết. Execution role: quyền ECS cần để khởi động task (kéo từ ECR, ghi log, đọc bí mật để nạp vào).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên Moto, tạo role <code>doc-anh</code> có <code>AmazonS3ReadOnlyAccess</code> và trust policy chỉ cho user quản trị của bạn.</li>
  <li>Nhận vai với <code>--duration-seconds 900</code>, export ba giá trị, chứng minh đọc được còn ghi bị chặn.</li>
  <li>Tạo user thứ hai có <code>sts:AssumeRole</code> nhưng không nằm trong trust policy; cho thấy AccessDenied, rồi sửa trust policy.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>get-caller-identity</code> in ARN <code>assumed-role/…</code> có tên phiên của bạn, và bạn giải thích được policy nào chặn user thứ hai.</p>
${giai('Gợi ý: export phiên', bash(`
read AK SK TK < <(aws sts assume-role --role-arn arn:aws:iam::123456789012:role/doc-anh \\
  --role-session-name ban --duration-seconds 900 \\
  --query 'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]' --output text)
export AWS_ACCESS_KEY_ID=$AK AWS_SECRET_ACCESS_KEY=$SK AWS_SESSION_TOKEN=$TK
aws sts get-caller-identity`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">STS</span><span class="v">Security Token Service: cấp khoá tạm (AssumeRole, AssumeRoleWithWebIdentity…).</span></div>
  <div class="kv"><span class="k">Role session</span><span class="v">Một lần dùng role; có ARN, tên phiên và thời điểm hết hạn riêng.</span></div>
  <div class="kv"><span class="k">Session token</span><span class="v">Phần thứ ba của khoá tạm; bắt buộc đi với khoá ASIA.</span></div>
  <div class="kv"><span class="k">Instance profile</span><span class="v">Lớp bọc cho phép máy EC2 dùng một role.</span></div>
  <div class="kv"><span class="k">iam:PassRole</span><span class="v">Quyền trao một role cho dịch vụ AWS.</span></div>
  <div class="kv"><span class="k">External ID</span><span class="v">Bí mật chung trong trust policy khác tài khoản, chống confused deputy.</span></div>
  <div class="kv"><span class="k">Role chaining</span><span class="v">Nhận vai từ một phiên role; tối đa một giờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Role = trust policy (ai) + policy quyền (gì) + thời lượng phiên.</li>
  <li>STS trả khoá ASIA + secret + session token + hạn dùng (15 phút – 12 giờ).</li>
  <li>Dịch vụ dùng role qua instance profile, task role, execution role; SDK tự tìm.</li>
  <li>PassRole rất mạnh; external ID bảo vệ role khác tài khoản cho nhà cung cấp.</li>
  <li>Phiên bị đánh cắp thì cắt bằng “Revoke active sessions”.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html', '🎫', 'AWS STS API — AssumeRole', 'DurationSeconds, session tag, MFA, role chaining.')}
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html', '🖥️', 'AWS docs — Using instance profiles', 'Cách EC2 nhận khoá của role.')}

<h3>Nguồn</h3>
<ul>
  <li>AssumeRole (tối thiểu 900 s, tối đa 1–12 giờ, chaining 1 giờ): <a href="https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html" target="_blank" rel="noopener">docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html</a></li>
  <li>Thu hồi phiên role (AWSRevokeOlderSessions): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html</a></li>
  <li>Instance profile: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html</a></li>
  <li>Role so với policy tài nguyên khi khác tài khoản: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_compare-resource-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_compare-resource-policies.html</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.6 — OIDC GitHub Actions ═══════════════════════════ */
const MA_TIN_GHA = json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:cuongthai/labflow:ref:refs/heads/main"
        }
      } }
  ]
}`);
const MA_GHA = yml(`
name: deploy
on:
  push:
    branches: [main]
permissions:
  id-token: write        # cho phép job xin JWT từ GitHub
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: aws-actions/configure-aws-credentials@v6   # nên ghim theo SHA của bản phát hành
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-labflow-deploy
          aws-region: ap-southeast-1
      - run: aws sts get-caller-identity`);
const MA_JWT = json(`
{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "sts.amazonaws.com",
  "sub": "repo:cuongthai/labflow:ref:refs/heads/main",
  "repository": "cuongthai/labflow",
  "ref": "refs/heads/main",
  "workflow": "deploy",
  "run_id": "…",
  "exp": 1763540000
}`);
const MA_HCL_LOI = bash(`
# Terraform (HCL) — minh hoạ dạng lỗi Datadog Security Labs mô tả năm 2023: HAI khoá cùng tên "StringEquals"
condition = {
  StringEquals = { "token.actions.githubusercontent.com:sub" = "repo:org/repo:ref:refs/heads/main" }
  StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }   # ⇐ khối sau đè khối trước
}
# ⇒ chỉ còn kiểm aud ⇒ MỌI repo GitHub trên thế giới nhận vai được role này`);

const L16_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 6</span>
<h2>1.6 — Roles for machines: OIDC from GitHub Actions</h2>
<p class="lead">The classic way to let a CI pipeline deploy to AWS is to paste an access key into the repository's secrets. That key never expires, and every workflow step — including third-party actions — runs next to it. OpenID Connect (OIDC) removes the key entirely: GitHub proves who the workflow is, AWS hands out a one-hour role session. This lesson builds the AWS side for real, shows the token's contents, and shows the one condition that separates “only my main branch” from “any repository on Earth”.</p>

<h3>Why stored keys in CI are a liability — tj-actions, March 2025</h3>
<p>On 14–15 March 2025 the popular action <code>tj-actions/changed-files</code> was compromised: attackers moved its version tags to a malicious commit that printed the runner's secrets into the workflow logs. GitHub's advisory (CVE-2025-30066) counts more than 23,000 repositories using the action. Any repository that kept a long-term <code>AWS_SECRET_ACCESS_KEY</code> in its secrets had to treat that key as leaked — logs of public repositories are public. With OIDC there is no long-term key to print; at worst a session that expires within the hour.</p>

<h3>The flow</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The job asks GitHub for a token</span><span class="lz-d">Only possible with <code>permissions: id-token: write</code>. GitHub signs a JWT describing exactly this run.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The job calls STS</span><span class="lz-d"><code>AssumeRoleWithWebIdentity</code> with the JWT and the role ARN. No AWS credentials are needed for this call.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">AWS verifies</span><span class="lz-d">Signature against GitHub's public keys (the OIDC provider you registered), then the role's trust policy conditions on <code>aud</code> and <code>sub</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Temporary credentials</span><span class="lz-d">An ASIA key, secret and session token, by default for one hour. Nothing to rotate, nothing to leak for long.</span></div>
</div>
<p>The claims inside a GitHub token (decoded, shortened):</p>
${MA_JWT}

<h3>The AWS side, created for real</h3>
<p>Register GitHub as an identity provider once per account, then create a role whose trust policy names that provider and checks two claims:</p>
${MA_TIN_GHA}
${OUT_16_OIDC}
<p>The workflow that uses it — no secret anywhere:</p>
${MA_GHA}
<p>Honest note: the emulator can store the provider and the role but cannot verify a real GitHub signature, so the full handshake is done on a real account in Chapter 12 (CI/CD to ECS). GitHub's own documentation pins actions by full commit SHA rather than by tag — the tj-actions incident is exactly why.</p>

<h3>The <code>sub</code> condition decides who gets in</h3>
<p>The <code>sub</code> claim encodes the repository and the trigger: <code>repo:OWNER/REPO:ref:refs/heads/BRANCH</code> for pushes, <code>repo:OWNER/REPO:pull_request</code> for pull requests, <code>repo:OWNER/REPO:environment:NAME</code> when the job uses a GitHub environment. Here are five realistic tokens against three trust policies, matched with the same string rules IAM uses (<code>StringEquals</code>, and <code>StringLike</code> with <code>*</code>) — a small illustration script, not AWS itself:</p>
${OUT_16_KHOP}
<ul>
  <li><strong>A</strong> — no <code>sub</code> condition: <em>every</em> GitHub repository in the world can obtain the role. <code>aud</code> is the same value for all AWS customers, so it protects nothing on its own.</li>
  <li><strong>B</strong> — owner wildcard: any branch, any pull request, any repository of the owner. A pull request can run modified workflow code — production credentials for anyone who can open a PR in a repo whose workflow runs on <code>pull_request</code>.</li>
  <li><strong>C</strong> — exact: only pushes to <code>main</code> of <code>labflow</code>. Even better for production: use a GitHub <em>environment</em> with required reviewers and trust <code>…:environment:production</code>.</li>
</ul>
<p><strong>⚠️ New format since 15 July 2026.</strong> GitHub changed the default <code>sub</code> for repositories <em>created after 15 July 2026</em> (and for renamed or transferred ones) to an immutable form with owner and repository IDs: <code>repo:OWNER@OWNER_ID/REPO@REPO_ID:ref:refs/heads/main</code>. The reason: a deleted name can be re-registered by someone else, and the old <code>sub</code> would then match their repository. A brand-new <code>labflow</code> repository therefore gets a <code>sub</code> that policy C <em>does not</em> match — and neither does B. Read the real value before writing the policy (the IDs come from <code>https://api.github.com/repos/OWNER/REPO</code>: <code>owner.id</code> and <code>id</code>), and put that exact string in <code>StringEquals</code>. Older repositories keep the old format unless you opt in.</p>

<h3>Hacker's view: the missing <code>sub</code> (2023) and AWS's guardrail</h3>
<p>In July 2023 Datadog Security Labs collected more than 500 role ARNs from over 275 AWS accounts in public GitHub workflow files and tested which roles any GitHub Action could assume. Among the vulnerable ones was a role of the UK Government Digital Service with push and pull rights on its CodeCommit repositories. The cause was subtle — Terraform code with two keys of the same name:</p>
${MA_HCL_LOI}
<p>GDS fixed it in under 26 hours and found no evidence of exploitation. Since then AWS checks, whenever a trust policy for <code>token.actions.githubusercontent.com</code> is created or updated, that the <code>sub</code> key is present and is not only a wildcard — otherwise the request fails (Datadog dates the block to June 2025). Roles created before that are <em>not</em> fixed automatically: audit old roles. Note also that Terraform still accepts the duplicate key silently (re-checked with Terraform v1.17.2 on 19 Nov 2026: the second <code>StringEquals</code> overwrites the first) — review the generated JSON, not just the HCL.</p>

<h3>Real-job link</h3>
<p>“Move our deploy pipeline from access keys to OIDC” is a very common task for a junior DevOps or backend engineer, and a great story for an interview: you removed a permanent secret, scoped deployments to one branch, and can explain the <code>sub</code> claim.</p>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How does GitHub Actions authenticate to AWS without stored keys?”</strong> — OIDC: the job gets a signed JWT from GitHub, calls AssumeRoleWithWebIdentity, AWS verifies signature and trust-policy conditions, returns temporary credentials.</li>
  <li><strong>“Which condition is essential in that trust policy?”</strong> — <code>token.actions.githubusercontent.com:sub</code> restricted to your repository and branch or environment; <code>aud</code> alone is the same for everyone.</li>
  <li><strong>“Why pin third-party actions by SHA?”</strong> — Tags can be moved to malicious commits (tj-actions, March 2025); a commit SHA cannot.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>On Moto, create the GitHub OIDC provider and a role <code>gha-ban</code> whose trust policy allows only pushes to <code>main</code> of your own repository.</li>
  <li>Write the matching workflow file (do not run it yet — Chapter 12 does).</li>
  <li>Change <code>khop-sub.mjs</code> (or reason on paper) to test a policy that trusts <code>repo:YOU/REPO:environment:production</code>: which of the five tokens pass?</li>
</ol>
<p><strong>Done when:</strong> <code>aws iam get-role --role-name gha-ban</code> shows a trust policy with both <code>aud</code> and an exact <code>sub</code>, and you can say why none of the five tokens passes the environment policy.</p>
${giai('Answer for step 3', '<p>None of the five: their <code>sub</code> values end in <code>ref:refs/heads/…</code> or <code>pull_request</code>. Only a job that declares <code>environment: production</code> receives <code>repo:YOU/REPO:environment:production</code> — and the environment can require a reviewer before the job starts.</p>')}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OIDC</span><span class="v">OpenID Connect: an identity layer on OAuth 2.0; issues signed JWTs.</span></div>
  <div class="kv"><span class="k">OIDC provider (IAM)</span><span class="v">Registration of an outside issuer (e.g. token.actions.githubusercontent.com) in your account.</span></div>
  <div class="kv"><span class="k">JWT claims</span><span class="v">Fields in the token: iss, aud, sub, repository, ref, exp…</span></div>
  <div class="kv"><span class="k">sub</span><span class="v">Subject claim; for GitHub encodes repository + branch/PR/environment.</span></div>
  <div class="kv"><span class="k">AssumeRoleWithWebIdentity</span><span class="v">STS call exchanging an OIDC token for role credentials.</span></div>
  <div class="kv"><span class="k">id-token: write</span><span class="v">Workflow permission required to request the OIDC token.</span></div>
  <div class="kv"><span class="k">Pin by SHA</span><span class="v">Referencing an action by commit hash so it cannot be changed under you.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>OIDC replaces CI access keys with one-hour role sessions.</li>
  <li>Trust policy: Federated principal = the provider; conditions on aud and, above all, sub.</li>
  <li>No sub = any repository on GitHub; owner wildcard = any branch and PR.</li>
  <li>Repositories created after 15 Jul 2026 use <code>repo:OWNER@ID/REPO@ID:…</code> — copy the real sub, do not guess it.</li>
  <li>AWS now refuses new GitHub trust policies without a proper sub; old roles need an audit.</li>
  <li>Pin actions by SHA; prefer GitHub environments with reviewers for production.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws', '🐙', 'GitHub Docs — Configuring OpenID Connect in AWS', 'Provider, trust policy, workflow, sub formats.')}
${tl('https://securitylabs.datadoghq.com/articles/exploring-github-to-aws-keyless-authentication-flaws/', '🔍', 'Datadog Security Labs — GitHub-to-AWS keyless authentication flaws', 'The 2023 research and the UK GDS case.')}

<h3>Sources</h3>
<ul>
  <li>AWS docs — OIDC for GitHub (sub must be present and not only a wildcard): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html</a></li>
  <li>GitHub Docs — OIDC in AWS: <a href="https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws" target="_blank" rel="noopener">docs.github.com/…/oidc-in-aws</a></li>
  <li>Datadog Security Labs, 27 Jul 2023 (updated Jun 2025): <a href="https://securitylabs.datadoghq.com/articles/exploring-github-to-aws-keyless-authentication-flaws/" target="_blank" rel="noopener">securitylabs.datadoghq.com/articles/exploring-github-to-aws-keyless-authentication-flaws</a></li>
  <li>GitHub advisory GHSA-mrrh-fwg8-r2c3 (CVE-2025-30066, tj-actions/changed-files): <a href="https://github.com/advisories/GHSA-mrrh-fwg8-r2c3" target="_blank" rel="noopener">github.com/advisories/GHSA-mrrh-fwg8-r2c3</a></li>
  <li>Wiz — Avoiding mistakes with AWS OIDC integration conditions: <a href="https://wiz.io/blog/avoiding-mistakes-with-aws-oidc-integration-conditions" target="_blank" rel="noopener">wiz.io/blog/avoiding-mistakes-with-aws-oidc-integration-conditions</a></li>
  <li>GitHub Docs — OpenID Connect reference (immutable subject claims, 15 Jul 2026): <a href="https://docs.github.com/en/actions/reference/security/oidc" target="_blank" rel="noopener">docs.github.com/en/actions/reference/security/oidc</a></li>
</ul>
</div>
`;

const L16_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 6</span>
<h2>1.6 — Role cho máy: OIDC từ GitHub Actions</h2>
<p class="lead">Cách cổ điển để pipeline CI deploy lên AWS là dán một access key vào secrets của kho mã. Khoá đó không bao giờ hết hạn, và mọi bước của workflow — kể cả action của bên thứ ba — chạy ngay cạnh nó. OpenID Connect (OIDC) bỏ hẳn khoá: GitHub chứng minh workflow là ai, AWS phát một phiên role một giờ. Bài này dựng phía AWS thật, cho xem bên trong token, và chỉ ra một điều kiện duy nhất phân biệt “chỉ nhánh main của tôi” với “mọi kho mã trên Trái Đất”.</p>

<h3>Vì sao khoá cất trong CI là gánh nợ — tj-actions, 03/2025</h3>
<p>Ngày 14–15/03/2025, action phổ biến <code>tj-actions/changed-files</code> bị chiếm: kẻ tấn công dời các tag phiên bản sang một commit độc, in secrets của máy chạy vào log workflow. Thông báo của GitHub (CVE-2025-30066) tính hơn 23 000 kho mã dùng action này. Kho nào giữ <code>AWS_SECRET_ACCESS_KEY</code> dài hạn trong secrets đều phải coi khoá đó đã lộ — log của kho công khai là công khai. Với OIDC thì không có khoá dài hạn nào để in; tệ nhất là một phiên hết hạn trong vòng một giờ.</p>

<h3>Luồng chạy</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Job xin token từ GitHub</span><span class="lz-d">Chỉ làm được khi có <code>permissions: id-token: write</code>. GitHub ký một JWT mô tả đúng lần chạy này.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Job gọi STS</span><span class="lz-d"><code>AssumeRoleWithWebIdentity</code> với JWT và ARN của role. Lời gọi này không cần khoá AWS nào.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">AWS kiểm</span><span class="lz-d">Chữ ký theo khoá công khai của GitHub (OIDC provider bạn đã đăng ký), rồi điều kiện trong trust policy với <code>aud</code> và <code>sub</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Khoá tạm</span><span class="lz-d">Một khoá ASIA, secret và session token, mặc định một giờ. Không có gì để xoay, không có gì lộ lâu.</span></div>
</div>
<p>Các claim bên trong một token GitHub (đã giải mã, rút gọn):</p>
${MA_JWT}

<h3>Phía AWS, tạo thật</h3>
<p>Đăng ký GitHub làm nhà cung cấp danh tính một lần cho mỗi tài khoản, rồi tạo role có trust policy nêu tên nhà cung cấp đó và kiểm hai claim:</p>
${MA_TIN_GHA}
${OUT_16_OIDC}
<p>Workflow dùng nó — không có secret nào:</p>
${MA_GHA}
<p>Nói thật: trình giả lập lưu được provider và role nhưng không kiểm được chữ ký GitHub thật, nên toàn bộ màn bắt tay làm trên tài khoản thật ở Chương 12 (CI/CD lên ECS). Chính tài liệu GitHub ghim action theo SHA đầy đủ của commit thay vì theo tag — vụ tj-actions là lý do.</p>

<h3>Điều kiện <code>sub</code> quyết định ai được vào</h3>
<p>Claim <code>sub</code> mã hoá kho mã và thứ kích hoạt: <code>repo:CHỦ/KHO:ref:refs/heads/NHÁNH</code> khi push, <code>repo:CHỦ/KHO:pull_request</code> với pull request, <code>repo:CHỦ/KHO:environment:TÊN</code> khi job dùng một environment của GitHub. Dưới đây là năm token sát thực tế đối chiếu với ba trust policy, so bằng đúng luật so chuỗi IAM dùng (<code>StringEquals</code>, và <code>StringLike</code> với <code>*</code>) — một script minh hoạ nhỏ, không phải AWS:</p>
${OUT_16_KHOP}
<ul>
  <li><strong>A</strong> — không có điều kiện <code>sub</code>: <em>mọi</em> kho mã GitHub trên thế giới lấy được role. <code>aud</code> là cùng một giá trị cho mọi khách hàng AWS, tự nó không bảo vệ gì.</li>
  <li><strong>B</strong> — ký tự đại diện theo chủ: mọi nhánh, mọi pull request, mọi kho của chủ đó. Pull request chạy được mã workflow đã sửa — tức là khoá production cho bất kỳ ai mở được PR vào kho có workflow chạy trên <code>pull_request</code>.</li>
  <li><strong>C</strong> — chính xác: chỉ push vào <code>main</code> của <code>labflow</code>. Tốt hơn nữa cho production: dùng <em>environment</em> của GitHub có người duyệt bắt buộc và tin <code>…:environment:production</code>.</li>
</ul>
<p><strong>⚠️ Định dạng mới từ 15/07/2026.</strong> GitHub đổi <code>sub</code> mặc định của các kho <em>tạo sau ngày 15/07/2026</em> (và kho đổi tên hay chuyển chủ) sang dạng bất biến có ID của chủ và của kho: <code>repo:CHỦ@ID_CHỦ/KHO@ID_KHO:ref:refs/heads/main</code>. Lý do: một tên đã xoá có thể bị người khác đăng ký lại, và <code>sub</code> kiểu cũ sẽ khớp luôn kho của họ. Vì vậy kho <code>labflow</code> bạn vừa tạo sẽ có <code>sub</code> mà policy C <em>không</em> khớp — B cũng không. Hãy đọc giá trị thật trước khi viết policy (ID lấy ở <code>https://api.github.com/repos/CHỦ/KHO</code>: <code>owner.id</code> và <code>id</code>) rồi đặt đúng chuỗi đó vào <code>StringEquals</code>. Kho cũ giữ định dạng cũ trừ khi bạn chủ động chuyển.</p>

<h3>Góc hacker: thiếu <code>sub</code> (2023) và rào chắn của AWS</h3>
<p>Tháng 7/2023, Datadog Security Labs gom được hơn 500 ARN role từ hơn 275 tài khoản AWS trong các tệp workflow công khai trên GitHub, rồi thử role nào mọi GitHub Action nhận vai được. Trong số role có lỗ có một role của Cơ quan Dịch vụ số Chính phủ Anh (GDS) với quyền push và pull vào các kho CodeCommit. Nguyên nhân rất khó thấy — mã Terraform có hai khoá trùng tên:</p>
${MA_HCL_LOI}
<p>GDS sửa trong chưa tới 26 giờ và không thấy dấu vết bị khai thác. Từ đó AWS kiểm, mỗi khi trust policy cho <code>token.actions.githubusercontent.com</code> được tạo hay sửa, rằng khoá <code>sub</code> phải có mặt và không chỉ là ký tự đại diện — sai là request thất bại (Datadog ghi mốc chặn là 06/2025). Role tạo trước đó <em>không</em> được tự sửa: hãy soát role cũ. Lưu ý thêm: Terraform vẫn lặng lẽ nhận khoá trùng (kiểm lại bằng Terraform v1.17.2 ngày 19/11/2026: <code>StringEquals</code> thứ hai đè cái thứ nhất) — hãy soát JSON sinh ra, đừng chỉ đọc HCL.</p>

<h3>Liên hệ đi làm</h3>
<p>“Chuyển pipeline deploy từ access key sang OIDC” là việc rất hay giao cho DevOps hay backend mới vào, và là câu chuyện phỏng vấn rất tốt: bạn đã gỡ một bí mật vĩnh viễn, khoanh deploy vào một nhánh, và giải thích được claim <code>sub</code>.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“GitHub Actions xác thực với AWS thế nào mà không cất khoá?”</strong> — OIDC: job lấy JWT có chữ ký từ GitHub, gọi AssumeRoleWithWebIdentity, AWS kiểm chữ ký và điều kiện trust policy, trả khoá tạm.</li>
  <li><strong>“Điều kiện nào bắt buộc trong trust policy đó?”</strong> — <code>token.actions.githubusercontent.com:sub</code> giới hạn vào kho mã và nhánh hoặc environment của bạn; riêng <code>aud</code> thì ai cũng giống nhau.</li>
  <li><strong>“Vì sao ghim action bên thứ ba theo SHA?”</strong> — Tag có thể bị dời sang commit độc (tj-actions, 03/2025); SHA của commit thì không.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên Moto, tạo OIDC provider của GitHub và role <code>gha-ban</code> có trust policy chỉ cho push vào <code>main</code> của kho mã của bạn.</li>
  <li>Viết tệp workflow tương ứng (chưa chạy — Chương 12 sẽ chạy).</li>
  <li>Sửa <code>khop-sub.mjs</code> (hoặc suy luận trên giấy) để thử policy tin <code>repo:BẠN/KHO:environment:production</code>: năm token, cái nào lọt?</li>
</ol>
<p><strong>Đạt khi:</strong> <code>aws iam get-role --role-name gha-ban</code> cho thấy trust policy có cả <code>aud</code> và <code>sub</code> chính xác, và bạn nói được vì sao không token nào trong năm token lọt qua policy environment.</p>
${giai('Đáp án bước 3', '<p>Không cái nào: <code>sub</code> của chúng kết thúc bằng <code>ref:refs/heads/…</code> hoặc <code>pull_request</code>. Chỉ job khai báo <code>environment: production</code> mới nhận <code>repo:BẠN/KHO:environment:production</code> — và environment có thể bắt một người duyệt trước khi job chạy.</p>')}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OIDC</span><span class="v">OpenID Connect: lớp danh tính trên OAuth 2.0; phát JWT có chữ ký.</span></div>
  <div class="kv"><span class="k">OIDC provider (IAM)</span><span class="v">Đăng ký một bên phát token bên ngoài (ví dụ token.actions.githubusercontent.com) trong tài khoản.</span></div>
  <div class="kv"><span class="k">JWT claims</span><span class="v">Các trường trong token: iss, aud, sub, repository, ref, exp…</span></div>
  <div class="kv"><span class="k">sub</span><span class="v">Claim chủ thể; với GitHub mã hoá kho + nhánh/PR/environment.</span></div>
  <div class="kv"><span class="k">AssumeRoleWithWebIdentity</span><span class="v">Lời gọi STS đổi token OIDC lấy khoá của role.</span></div>
  <div class="kv"><span class="k">id-token: write</span><span class="v">Quyền workflow cần để xin token OIDC.</span></div>
  <div class="kv"><span class="k">Pin by SHA</span><span class="v">Gọi action theo mã băm commit để không ai đổi được dưới chân bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>OIDC thay access key của CI bằng phiên role một giờ.</li>
  <li>Trust policy: principal Federated = provider; điều kiện aud và quan trọng nhất là sub.</li>
  <li>Không có sub = mọi kho GitHub; đại diện theo chủ = mọi nhánh và PR.</li>
  <li>Kho tạo sau 15/07/2026 dùng <code>repo:CHỦ@ID/KHO@ID:…</code> — chép sub thật, đừng đoán.</li>
  <li>AWS giờ từ chối trust policy GitHub mới thiếu sub đúng; role cũ cần soát.</li>
  <li>Ghim action theo SHA; production nên dùng environment có người duyệt.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws', '🐙', 'GitHub Docs — Configuring OpenID Connect in AWS', 'Provider, trust policy, workflow, các dạng sub.')}
${tl('https://securitylabs.datadoghq.com/articles/exploring-github-to-aws-keyless-authentication-flaws/', '🔍', 'Datadog Security Labs — GitHub-to-AWS keyless authentication flaws', 'Nghiên cứu 2023 và vụ GDS Anh.')}

<h3>Nguồn</h3>
<ul>
  <li>AWS docs — OIDC cho GitHub (sub phải có và không chỉ là ký tự đại diện): <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html" target="_blank" rel="noopener">docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html</a></li>
  <li>GitHub Docs — OIDC in AWS: <a href="https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws" target="_blank" rel="noopener">docs.github.com/…/oidc-in-aws</a></li>
  <li>Datadog Security Labs, 27/07/2023 (cập nhật 06/2025): <a href="https://securitylabs.datadoghq.com/articles/exploring-github-to-aws-keyless-authentication-flaws/" target="_blank" rel="noopener">securitylabs.datadoghq.com/articles/exploring-github-to-aws-keyless-authentication-flaws</a></li>
  <li>GitHub advisory GHSA-mrrh-fwg8-r2c3 (CVE-2025-30066, tj-actions/changed-files): <a href="https://github.com/advisories/GHSA-mrrh-fwg8-r2c3" target="_blank" rel="noopener">github.com/advisories/GHSA-mrrh-fwg8-r2c3</a></li>
  <li>Wiz — Avoiding mistakes with AWS OIDC integration conditions: <a href="https://wiz.io/blog/avoiding-mistakes-with-aws-oidc-integration-conditions" target="_blank" rel="noopener">wiz.io/blog/avoiding-mistakes-with-aws-oidc-integration-conditions</a></li>
  <li>GitHub Docs — OpenID Connect reference (sub bất biến, 15/07/2026): <a href="https://docs.github.com/en/actions/reference/security/oidc" target="_blank" rel="noopener">docs.github.com/en/actions/reference/security/oidc</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.7 — Góc hacker: khoá lộ, đào coin, CloudTrail ═══════════════════════════ */
const MA_TRAIL = json(`
{
  "eventTime": "2026-11-18T22:44:10Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateUser",
  "awsRegion": "us-east-1",
  "sourceIPAddress": "203.0.113.77",
  "userAgent": "aws-cli/2.41.0 …",
  "userIdentity": {
    "type": "IAMUser",
    "arn": "arn:aws:iam::123456789012:user/ops-cu",
    "accessKeyId": "AKIA…FUOT"
  },
  "requestParameters": { "userName": "support-backup" },
  "errorCode": null
}`);
const MA_TRA = bash(`
# Mọi việc khoá bị lộ đã làm (90 ngày gần nhất, theo từng region):
aws cloudtrail lookup-events --region us-east-1 \\
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA...FUOT \\
  --query 'Events[].[EventTime,EventName,Username]' --output text
# Ai vừa tạo user / khoá / gắn quyền quản trị:
aws cloudtrail lookup-events --region us-east-1 \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=CreateAccessKey`);

const L17_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 7</span>
<h2>1.7 — Hacker's view: leaked keys, crypto-mining and CloudTrail</h2>
<p class="lead">Lesson 0.9 showed how fast a leaked key is found. This lesson is about the next hour: what attackers do with your account, how CloudTrail and GuardDuty let you see it, and the response checklist — including the step most people forget, which we prove with a real run: deleting the leaked key does not close the door the attacker already opened.</p>

<h3>Four real incidents, one pattern</h3>
<table>
  <thead><tr><th>Incident</th><th>How the credential leaked</th><th>What the attacker did</th></tr></thead>
  <tbody>
    <tr><td>Code Spaces, 2014</td><td>Console access to the company's AWS account</td><td>Deleted machines, data <em>and</em> backups in the same account; the company shut down</td></tr>
    <tr><td>EleKtra-Leak, 2023 (Unit 42)</td><td>Keys pushed to public GitHub repositories</td><td>Used within about 5 minutes; launched crypto-mining instances in many regions</td></tr>
    <tr><td>LLMjacking, 2024 (Sysdig)</td><td>Keys read from a vulnerable Laravel server</td><td>Ran paid AI models on Bedrock; worst case &gt; 46,000 USD/day</td></tr>
    <tr><td>8-minute admin, Nov 2025 (Sysdig)</td><td>Test keys in a public S3 bucket</td><td>Lambda code injection → admin; <code>backdoor-admin</code> user; 19 principals; GPU instance</td></tr>
  </tbody>
</table>
<p>The pattern: <strong>discover</strong> (who am I, which regions, which services) → <strong>escalate</strong> (find a path to more permissions) → <strong>persist</strong> (create users, keys, roles they control) → <strong>monetize</strong> (miners, AI models, data theft, ransom) — often within minutes, by automated tools.</p>

<h3>Persistence — run for real</h3>
<p>An old operations user <code>ops-cu</code> with AdministratorAccess has its key in a public repository. The attacker's first minute:</p>
${OUT_17_TANCONG}
<p>The responder sees the alert and does the obvious thing — deactivates and deletes the leaked key:</p>
${OUT_17_XOA}
<p>The leaked key is dead, but <code>support-backup</code> — a name chosen to look boring — still has full admin rights. Real attackers create several such doors (Sysdig counted 19 principals in the 2025 case), take over <em>existing</em> users by adding keys, edit role trust policies, plant Lambda functions. Hunting them:</p>
${OUT_17_SAN}

<h3>CloudTrail — the account's flight recorder</h3>
<p>CloudTrail records every API call: who (<code>userIdentity</code>), what (<code>eventName</code>), from where (<code>sourceIPAddress</code>), with which key, success or <code>errorCode</code>. <strong>Event history</strong> is on by default and free: 90 days of management events per region, searchable in the console or CLI. For longer retention, for data events (S3 object reads) and for all regions in one place, create a <strong>trail</strong> to an S3 bucket — ideally in a separate logging account the attacker cannot reach. The <code>CreateUser</code> call above would look like this (illustration in the documented format — the emulator has no CloudTrail lookup):</p>
${MA_TRAIL}
${MA_TRA}
<p>IAM, STS and other global services record their events in <code>us-east-1</code>; regional events stay in their region — another reason the clean-up sweep of lesson 0.4 walks every region.</p>

<h3>GuardDuty — someone watching the recorder</h3>
<p>Amazon GuardDuty analyses CloudTrail, VPC flow logs and DNS logs and raises findings such as <code>UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS</code> (role credentials of an EC2 instance used from outside AWS — the Capital One pattern), <code>Stealth:IAMUser/CloudTrailLoggingDisabled</code> and <code>CryptoCurrency:EC2/BitcoinTool.B!DNS</code>. New accounts get a 30-day free trial; send findings to e-mail through EventBridge + SNS (Chapter 9).</p>

<h3>Response checklist when a key leaks</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Contain</span><span class="lz-t">Deactivate the key now</span><span class="lz-d">Reversible and immediate. Do not wait to understand everything first. If it was a role session: Revoke active sessions.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Scope</span><span class="lz-t">Read CloudTrail by key ID</span><span class="lz-d">Every region, from the moment of the leak: which calls succeeded?</span></div>
  <div class="lz-step"><span class="lz-k">3 · Hunt</span><span class="lz-t">Find persistence</span><span class="lz-d">New users, access keys on existing users, new roles or changed trust policies, Lambda functions, EC2/GPU instances in every region, new SSH keys and security group rules.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Eradicate</span><span class="lz-t">Delete what is not yours</span><span class="lz-d">Keys → policies → users/roles; terminate instances; rotate every other secret the identity could read (Secrets Manager, SSM, database passwords).</span></div>
  <div class="lz-step"><span class="lz-k">5 · Recover</span><span class="lz-t">Call AWS and fix the cause</span><span class="lz-d">Open a support case (AWS often adjusts charges for proven fraud), remove the key from Git history, move to roles/OIDC, write the post-mortem.</span></div>
</div>
<div class="callout warn">AWS itself scans public GitHub for its keys. When it finds one, it attaches a managed policy of the <code>AWSCompromisedKeyQuarantine</code> family (versions V2–V4 exist in 2026) to the user (blocking many dangerous actions) and e-mails you. That is a safety net, not a fix: the policy does not remove the attacker's other doors.</div>

<h3>Real-life link</h3>
<p>Losing your house key is the same story. Changing the lock on the front door is step 1. But if the thief already came in and copied the key of the back door, or left a window unlatched, the new lock does not help — you walk through every room.</p>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“An access key was pushed to a public repository. What do you do?”</strong> — Deactivate immediately, review CloudTrail for that key in all regions, hunt persistence (users, keys, roles, functions, instances), delete it, rotate other secrets, contact AWS Support, then remove it from history and move to roles/OIDC.</li>
  <li><strong>“What does CloudTrail give you by default?”</strong> — 90 days of management-event history per region at no cost; trails to S3 for longer retention, data events and multi-region collection.</li>
  <li><strong>“Why is deleting the key not enough?”</strong> — Attackers create persistence quickly: other users, keys, roles, or changed trust policies that survive the original key.</li>
</ol>

<h3>🧪 Practice — tabletop (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>On Moto: give one user AdministratorAccess, act as the “attacker” with its key and create two doors (a new user with a key; a new access key on an <em>existing</em> user).</li>
  <li>Switch to the responder: delete the leaked key, then find and remove both doors using only list/describe commands.</li>
  <li>Write your five-line incident timeline (time, action, evidence).</li>
</ol>
<p><strong>Done when:</strong> every attacker credential returns InvalidClientTokenId and <code>list-entities-for-policy</code> on AdministratorAccess shows only your admin.</p>
${giai('Hint: finding a new key on an existing user', bash(`
for u in $(aws iam list-users --query 'Users[].UserName' --output text); do
  aws iam list-access-keys --user-name $u \\
    --query 'AccessKeyMetadata[].[UserName,AccessKeyId,CreateDate]' --output text
done | sort -k3        # newest keys at the bottom`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Persistence</span><span class="v">Extra access an attacker creates so that losing one credential does not lock them out.</span></div>
  <div class="kv"><span class="k">CloudTrail event history</span><span class="v">Free, 90 days of management events per region.</span></div>
  <div class="kv"><span class="k">Trail</span><span class="v">Delivery of CloudTrail events to S3 (and CloudWatch Logs) for retention and analysis.</span></div>
  <div class="kv"><span class="k">GuardDuty</span><span class="v">Managed threat detection over CloudTrail, VPC flow logs and DNS logs.</span></div>
  <div class="kv"><span class="k">Finding</span><span class="v">A GuardDuty alert with a type, severity and affected resource.</span></div>
  <div class="kv"><span class="k">AWSCompromisedKeyQuarantine</span><span class="v">Policy AWS attaches to a user whose key it found exposed.</span></div>
  <div class="kv"><span class="k">Post-mortem</span><span class="v">Blameless write-up of an incident: timeline, cause, fixes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Discover → escalate → persist → monetize, in minutes, by automation.</li>
  <li>Deactivate first; then scope with CloudTrail; then hunt persistence in every region.</li>
  <li>CloudTrail history is free for 90 days; a trail to a separate account keeps evidence safe.</li>
  <li>GuardDuty turns the logs into alerts; route them to people.</li>
  <li>The lasting fix is fewer long-term keys and smaller permissions.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/compromised-credentials.html', '🚨', 'AWS docs — Remediating exposed AWS credentials', 'The official response steps.')}
${tl('https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html', '👁️', 'AWS docs — What is Amazon GuardDuty', 'Data sources, finding types, free trial.')}

<h3>Sources</h3>
<ul>
  <li>CloudTrail event history (90 days, free): <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html" target="_blank" rel="noopener">docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html</a></li>
  <li>GuardDuty IAM finding types: <a href="https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html" target="_blank" rel="noopener">docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html</a></li>
  <li>AWS re:Post — potential account compromise: <a href="https://repost.aws/knowledge-center/potential-account-compromise" target="_blank" rel="noopener">repost.aws/knowledge-center/potential-account-compromise</a></li>
  <li>Sysdig (2024 LLMjacking; 2025 8-minute intrusion): <a href="https://sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack/" target="_blank" rel="noopener">sysdig.com/blog/llmjacking…</a> · <a href="https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes" target="_blank" rel="noopener">sysdig.com/blog/ai-assisted-cloud-intrusion…</a></li>
</ul>
</div>
`;

const L17_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 7</span>
<h2>1.7 — Góc hacker: khoá lộ, đào coin và CloudTrail</h2>
<p class="lead">Bài 0.9 cho thấy khoá lộ bị phát hiện nhanh cỡ nào. Bài này nói về một giờ tiếp theo: kẻ tấn công làm gì với tài khoản của bạn, CloudTrail và GuardDuty giúp bạn nhìn thấy thế nào, và danh sách việc phải làm — kể cả bước hầu hết mọi người quên, được chứng minh bằng chạy thật: xoá khoá lộ không đóng được cánh cửa kẻ tấn công đã mở.</p>

<h3>Bốn vụ thật, một khuôn</h3>
<table>
  <thead><tr><th>Vụ</th><th>Khoá lộ thế nào</th><th>Kẻ tấn công làm gì</th></tr></thead>
  <tbody>
    <tr><td>Code Spaces, 2014</td><td>Quyền vào console của tài khoản AWS công ty</td><td>Xoá máy, dữ liệu <em>và</em> bản sao lưu cùng tài khoản; công ty đóng cửa</td></tr>
    <tr><td>EleKtra-Leak, 2023 (Unit 42)</td><td>Khoá đẩy lên kho GitHub công khai</td><td>Dùng trong khoảng 5 phút; bật máy đào coin ở nhiều region</td></tr>
    <tr><td>LLMjacking, 2024 (Sysdig)</td><td>Khoá đọc từ máy chủ Laravel có lỗ hổng</td><td>Chạy mô hình AI tính tiền trên Bedrock; tệ nhất &gt; 46 000 USD/ngày</td></tr>
    <tr><td>Quản trị trong 8 phút, 11/2025 (Sysdig)</td><td>Khoá thử nghiệm trong bucket S3 công khai</td><td>Chèn mã Lambda → quản trị; user <code>backdoor-admin</code>; 19 principal; máy GPU</td></tr>
  </tbody>
</table>
<p>Khuôn chung: <strong>dò</strong> (tôi là ai, region nào, dịch vụ nào) → <strong>leo thang</strong> (tìm đường tới nhiều quyền hơn) → <strong>bám trụ</strong> (tạo user, khoá, role chúng nắm) → <strong>kiếm tiền</strong> (máy đào, mô hình AI, trộm dữ liệu, tống tiền) — thường trong vài phút, bằng công cụ tự động.</p>

<h3>Bám trụ — chạy thật</h3>
<p>Một user vận hành cũ <code>ops-cu</code> có AdministratorAccess, khoá của nó nằm trong một kho mã công khai. Phút đầu tiên của kẻ tấn công:</p>
${OUT_17_TANCONG}
<p>Người trực thấy cảnh báo và làm việc hiển nhiên — vô hiệu rồi xoá khoá bị lộ:</p>
${OUT_17_XOA}
<p>Khoá lộ đã chết, nhưng <code>support-backup</code> — cái tên chọn cho có vẻ nhàm chán — vẫn đủ quyền quản trị. Kẻ tấn công thật tạo vài cửa như thế (Sysdig đếm được 19 principal trong vụ 2025), chiếm user <em>có sẵn</em> bằng cách thêm khoá, sửa trust policy của role, cài function Lambda. Đi săn chúng:</p>
${OUT_17_SAN}

<h3>CloudTrail — hộp đen của tài khoản</h3>
<p>CloudTrail ghi mọi lời gọi API: ai (<code>userIdentity</code>), làm gì (<code>eventName</code>), từ đâu (<code>sourceIPAddress</code>), bằng khoá nào, thành công hay <code>errorCode</code>. <strong>Event history</strong> bật sẵn và miễn phí: 90 ngày sự kiện quản lý cho mỗi region, tìm được trên console hay CLI. Muốn giữ lâu hơn, muốn có sự kiện dữ liệu (đọc object S3) và gom mọi region một chỗ, tạo một <strong>trail</strong> đổ vào bucket S3 — tốt nhất ở một tài khoản log riêng mà kẻ tấn công không với tới. Lời gọi <code>CreateUser</code> ở trên trông như sau (minh hoạ theo định dạng trong tài liệu — trình giả lập không có tra cứu CloudTrail):</p>
${MA_TRAIL}
${MA_TRA}
<p>IAM, STS và các dịch vụ toàn cầu ghi sự kiện ở <code>us-east-1</code>; sự kiện theo region ở lại region đó — thêm một lý do vòng quét dọn dẹp ở bài 0.4 phải đi qua mọi region.</p>

<h3>GuardDuty — người ngồi xem hộp đen</h3>
<p>Amazon GuardDuty phân tích CloudTrail, VPC flow log và DNS log rồi phát ra finding như <code>UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS</code> (khoá role của máy EC2 bị dùng từ ngoài AWS — đúng khuôn Capital One), <code>Stealth:IAMUser/CloudTrailLoggingDisabled</code> và <code>CryptoCurrency:EC2/BitcoinTool.B!DNS</code>. Tài khoản mới được dùng thử 30 ngày; gửi finding về email qua EventBridge + SNS (Chương 9).</p>

<h3>Danh sách việc khi khoá bị lộ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Khoanh</span><span class="lz-t">Vô hiệu khoá ngay</span><span class="lz-d">Đảo ngược được và có hiệu lực ngay. Đừng đợi hiểu hết rồi mới làm. Nếu là phiên role: Revoke active sessions.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đo</span><span class="lz-t">Đọc CloudTrail theo mã khoá</span><span class="lz-d">Mọi region, từ lúc lộ: lời gọi nào đã thành công?</span></div>
  <div class="lz-step"><span class="lz-k">3 · Săn</span><span class="lz-t">Tìm chỗ bám trụ</span><span class="lz-d">User mới, access key mới trên user cũ, role mới hoặc trust policy bị sửa, function Lambda, máy EC2/GPU ở mọi region, khoá SSH và luật security group mới.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Diệt</span><span class="lz-t">Xoá thứ không phải của bạn</span><span class="lz-d">Khoá → policy → user/role; tắt máy; xoay mọi bí mật khác mà danh tính đó đọc được (Secrets Manager, SSM, mật khẩu cơ sở dữ liệu).</span></div>
  <div class="lz-step"><span class="lz-k">5 · Phục hồi</span><span class="lz-t">Gọi AWS và sửa gốc</span><span class="lz-d">Mở yêu cầu hỗ trợ (AWS thường xem xét điều chỉnh hoá đơn khi chứng minh được gian lận), gỡ khoá khỏi lịch sử Git, chuyển sang role/OIDC, viết post-mortem.</span></div>
</div>
<div class="callout warn">Chính AWS cũng quét GitHub công khai tìm khoá của mình. Thấy một khoá, AWS gắn một managed policy họ <code>AWSCompromisedKeyQuarantine</code> (năm 2026 có các bản V2–V4) vào user (chặn nhiều thao tác nguy hiểm) và gửi thư cho bạn. Đó là lưới an toàn, không phải cách sửa: policy này không gỡ những cửa khác kẻ tấn công đã mở.</div>

<h3>Liên hệ đời thường</h3>
<p>Mất chìa khoá nhà cũng y như vậy. Thay ổ khoá cửa trước là bước 1. Nhưng nếu kẻ trộm đã vào và đánh thêm chìa cửa sau, hay để hờ một cửa sổ, thì ổ khoá mới chẳng giúp gì — bạn phải đi khắp mọi phòng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Một access key bị đẩy lên kho công khai. Bạn làm gì?”</strong> — Vô hiệu ngay, xem CloudTrail theo khoá đó ở mọi region, săn chỗ bám trụ (user, khoá, role, function, máy), xoá khoá, xoay bí mật khác, liên hệ AWS Support, rồi gỡ khỏi lịch sử và chuyển sang role/OIDC.</li>
  <li><strong>“Mặc định CloudTrail cho bạn gì?”</strong> — 90 ngày lịch sử sự kiện quản lý mỗi region, miễn phí; trail đổ vào S3 để giữ lâu, có sự kiện dữ liệu và gom nhiều region.</li>
  <li><strong>“Vì sao xoá khoá là chưa đủ?”</strong> — Kẻ tấn công tạo chỗ bám trụ rất nhanh: user, khoá, role khác, hoặc trust policy bị sửa, sống sót sau khi khoá gốc chết.</li>
</ol>

<h3>🧪 Thực hành — diễn tập trên bàn (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên Moto: cho một user AdministratorAccess, đóng vai “kẻ tấn công” bằng khoá của nó và tạo hai cửa (một user mới có khoá; một access key mới trên một user <em>có sẵn</em>).</li>
  <li>Chuyển sang vai người trực: xoá khoá lộ, rồi tìm và gỡ cả hai cửa chỉ bằng lệnh list/describe.</li>
  <li>Viết dòng thời gian sự cố năm dòng (giờ, việc làm, bằng chứng).</li>
</ol>
<p><strong>Đạt khi:</strong> mọi khoá của kẻ tấn công báo InvalidClientTokenId và <code>list-entities-for-policy</code> với AdministratorAccess chỉ còn user quản trị của bạn.</p>
${giai('Gợi ý: tìm khoá mới trên user có sẵn', bash(`
for u in $(aws iam list-users --query 'Users[].UserName' --output text); do
  aws iam list-access-keys --user-name $u \\
    --query 'AccessKeyMetadata[].[UserName,AccessKeyId,CreateDate]' --output text
done | sort -k3        # khoá mới nhất nằm cuối`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Persistence</span><span class="v">Lối vào phụ kẻ tấn công tạo để mất một khoá không bị khoá ngoài.</span></div>
  <div class="kv"><span class="k">CloudTrail event history</span><span class="v">Miễn phí, 90 ngày sự kiện quản lý mỗi region.</span></div>
  <div class="kv"><span class="k">Trail</span><span class="v">Đổ sự kiện CloudTrail vào S3 (và CloudWatch Logs) để lưu và phân tích.</span></div>
  <div class="kv"><span class="k">GuardDuty</span><span class="v">Dịch vụ phát hiện mối đe doạ trên CloudTrail, VPC flow log, DNS log.</span></div>
  <div class="kv"><span class="k">Finding</span><span class="v">Một cảnh báo GuardDuty có loại, mức nghiêm trọng và tài nguyên bị ảnh hưởng.</span></div>
  <div class="kv"><span class="k">AWSCompromisedKeyQuarantine</span><span class="v">Policy AWS gắn vào user khi phát hiện khoá của nó bị lộ.</span></div>
  <div class="kv"><span class="k">Post-mortem</span><span class="v">Bản tường trình sự cố không đổ lỗi: dòng thời gian, nguyên nhân, cách sửa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Dò → leo thang → bám trụ → kiếm tiền, trong vài phút, bằng công cụ tự động.</li>
  <li>Vô hiệu trước; rồi đo bằng CloudTrail; rồi săn chỗ bám trụ ở mọi region.</li>
  <li>Lịch sử CloudTrail miễn phí 90 ngày; trail sang tài khoản riêng giữ bằng chứng an toàn.</li>
  <li>GuardDuty biến log thành cảnh báo; nhớ chuyển tới người thật.</li>
  <li>Cách sửa lâu dài là ít khoá dài hạn hơn và quyền nhỏ hơn.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/compromised-credentials.html', '🚨', 'AWS docs — Remediating exposed AWS credentials', 'Các bước xử lý chính thức.')}
${tl('https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html', '👁️', 'AWS docs — What is Amazon GuardDuty', 'Nguồn dữ liệu, loại finding, dùng thử miễn phí.')}

<h3>Nguồn</h3>
<ul>
  <li>CloudTrail event history (90 ngày, miễn phí): <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html" target="_blank" rel="noopener">docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html</a></li>
  <li>Loại finding IAM của GuardDuty: <a href="https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html" target="_blank" rel="noopener">docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html</a></li>
  <li>AWS re:Post — tài khoản có thể bị xâm nhập: <a href="https://repost.aws/knowledge-center/potential-account-compromise" target="_blank" rel="noopener">repost.aws/knowledge-center/potential-account-compromise</a></li>
  <li>Sysdig (LLMjacking 2024; vụ 8 phút 2025): <a href="https://sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack/" target="_blank" rel="noopener">sysdig.com/blog/llmjacking…</a> · <a href="https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes" target="_blank" rel="noopener">sysdig.com/blog/ai-assisted-cloud-intrusion…</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 1.8 — Lab chương 1 ═══════════════════════════ */
const MA_LAB_GIAI = bash(`
# 0. Moto có kiểm quyền (ảnh motoserver/moto) + bucket mẫu
docker run -d --name aws-moto -p 127.0.0.1:44567:5000 -e MOTO_IAM_LOAD_MANAGED_POLICIES=true motoserver/moto
alias aws='aws --endpoint-url http://127.0.0.1:44567'
aws s3 mb s3://labflow-anh   # + tải lên uploads/, bao-cao/, bi-mat/
aws iam create-user --user-name quan-tri
aws iam attach-user-policy --user-name quan-tri --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
aws iam create-access-key --user-name quan-tri          # từ giờ dùng khoá này
curl -X POST -H 'Content-Type: text/plain' --data-binary 0 http://127.0.0.1:44567/moto-api/reset-auth

# 1. Nhóm dev: đọc bucket, cấm bi-mat/
aws iam create-group --group-name dev
aws iam create-policy --policy-name labflow-doc-anh --policy-document file://doc-anh-tru.json
aws iam attach-group-policy --group-name dev --policy-arn arn:aws:iam::123456789012:policy/labflow-doc-anh
aws iam create-user --user-name an-dev && aws iam add-user-to-group --group-name dev --user-name an-dev

# 2. Bot báo cáo: chỉ đọc bao-cao/*   (bc-2.json ở bài 1.3)
aws iam create-user --user-name bao-cao-bot
aws iam put-user-policy --user-name bao-cao-bot --policy-name doc-bao-cao --policy-document file://bc-2.json

# 3. Role ứng dụng (ECS) + role deploy (OIDC, chỉ nhánh main)
aws iam create-role --role-name labflow-app --assume-role-policy-document file://tin-ecs.json
aws iam put-role-policy --role-name labflow-app --policy-name uploads --policy-document file://app-uploads.json
aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com
aws iam create-role --role-name gha-labflow-deploy --assume-role-policy-document file://tin-gha.json

# 4. Ma trận kiểm quyền: chạy từng lệnh bằng khoá của từng danh tính, ghi ✓/✗
# 5. Dọn theo thứ tự: khoá → policy (inline, attached, version phụ) → khỏi group → user → group → policy
#    → role khỏi instance profile → instance profile → role → OIDC provider; rồi kiểm còn gì
aws iam list-users --query 'Users[?UserName!=\`quan-tri\`].UserName'
aws iam list-roles --query 'Roles[?!starts_with(Path,\`/aws-service-role/\`)].RoleName'
aws iam list-policies --scope Local --query 'Policies[].PolicyName'
docker rm -f aws-moto`);

const L18_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab</span>
<h2>1.8 — Chapter 1 lab: IAM for the LabFlow team + interview questions</h2>
<p class="lead">You are the first backend engineer of LabFlow, the lab-room booking API. Before any server exists, you design who can do what: developers, a reporting bot, the application itself and the deployment pipeline. You build it with the CLI against an emulator with permission checks on, prove it with a permission matrix, and clean up until nothing is left.</p>

<h3>Requirements</h3>
<table>
  <thead><tr><th>Identity</th><th>Kind</th><th>May</th><th>Must not</th></tr></thead>
  <tbody>
    <tr><td>Developers (<code>an-dev</code>)</td><td>IAM users in group <code>dev</code></td><td>List <code>labflow-anh</code>, read objects</td><td>Read <code>bi-mat/*</code>; write; touch IAM</td></tr>
    <tr><td>Reporting bot</td><td>IAM user (to be replaced by a role in Chapter 8)</td><td>Read <code>bao-cao/*</code></td><td>Read anything else; write</td></tr>
    <tr><td>Application</td><td>Role <code>labflow-app</code> trusted by <code>ecs-tasks.amazonaws.com</code></td><td>Put/Get <code>uploads/*</code></td><td>Delete; read <code>bi-mat/*</code></td></tr>
    <tr><td>Deploy pipeline</td><td>Role <code>gha-labflow-deploy</code> via GitHub OIDC</td><td>Assume only from <code>main</code> of your repository</td><td>Be assumable from any other repository, branch or PR</td></tr>
  </tbody>
</table>

<h3>The permission matrix you must produce</h3>
<p>Run each check with the identity's own key and record ✓ or ✗. Here is the reference run (real, permission checks on):</p>
${OUT_18_MATRAN}
<p>The last line is deliberately left in from lesson 1.2: a user with <code>s3:*</code> still reads the salary file. Your rubric asks you to explain how to protect <code>bi-mat/</code> against <em>every</em> identity — a bucket policy with an explicit Deny, Chapter 2.</p>

<h3>Clean-up and the “anything left?” check</h3>
<p>IAM itself costs nothing, but leftover users with keys and roles with broad trust are exactly the doors of lesson 1.7. Delete in dependency order — keys and policies before users, roles out of instance profiles before deleting them — then verify:</p>
${OUT_18_DON}

<h3>Rubric (100 points)</h3>
<ul>
  <li><strong>25</strong> — every policy scoped to ARNs; no <code>"Action": "*"</code> or <code>"Resource": "*"</code> except where justified in a comment.</li>
  <li><strong>20</strong> — permission matrix complete with at least 8 checks, all results as required.</li>
  <li><strong>15</strong> — role trust policies: ECS service principal for the app; OIDC with exact <code>aud</code> and <code>sub</code> for deploy.</li>
  <li><strong>15</strong> — clean-up script runs twice without errors the second time, and the check prints nothing.</li>
  <li><strong>15</strong> — a short README: which identity is which, why each permission exists, how to rotate the bot's key.</li>
  <li><strong>10</strong> — one paragraph: how you would protect <code>bi-mat/</code> against users outside the group (resource policy) and against region abuse (SCP).</li>
</ul>

<h3>Solution (open only after trying)</h3>
${giai('Show the reference script outline', MA_LAB_GIAI + '<p>The full script used for this course (with every output above) is <code>lab/c1/chay.sh</code> in the course materials: it builds, tests, attacks, hunts and cleans in about four minutes.</p>')}

<h3>🎤 Interview questions for the whole chapter</h3>
<ol>
  <li><strong>“Walk me through how AWS decides whether a request is allowed.”</strong> — Default deny; any explicit Deny wins (including SCPs and boundaries); otherwise an Allow from an identity- or resource-based policy is required, and every guardrail layer must also allow it.</li>
  <li><strong>“Your app on ECS gets AccessDenied writing to S3. How do you debug?”</strong> — Read the error (action + resource); check the <em>task</em> role (not the execution role) has the action on the right ARN (bucket vs bucket/*); check bucket policy Denies, KMS key policy if encrypted, SCPs; use the policy simulator or CloudTrail's errorCode.</li>
  <li><strong>“Why prefer roles over IAM users for applications?”</strong> — No long-term secret to store or leak; credentials rotate automatically; trust is explicit; sessions are traceable by name.</li>
  <li><strong>“How do you give a contractor's company access to one bucket in your account?”</strong> — A role in your account trusting their account with an external ID condition and a narrowly scoped permission policy; or a bucket policy naming their role; never shared users.</li>
  <li><strong>“What would you check in a new company's AWS account in your first week?”</strong> — Root MFA and no root keys; credential report for old keys and unused users; who has AdministratorAccess; GitHub OIDC trust policies with sub; CloudTrail trail and GuardDuty on; budgets.</li>
</ol>
</div>
`;

const L18_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab</span>
<h2>1.8 — Lab chương 1: IAM cho nhóm LabFlow + câu hỏi phỏng vấn</h2>
<p class="lead">Bạn là kỹ sư backend đầu tiên của LabFlow, API đặt lịch phòng lab. Trước khi có máy chủ nào, bạn thiết kế ai được làm gì: lập trình viên, bot báo cáo, chính ứng dụng và pipeline deploy. Bạn dựng bằng CLI trên trình giả lập có bật kiểm quyền, chứng minh bằng ma trận quyền, rồi dọn cho tới khi không còn gì.</p>

<h3>Yêu cầu</h3>
<table>
  <thead><tr><th>Danh tính</th><th>Loại</th><th>Được</th><th>Không được</th></tr></thead>
  <tbody>
    <tr><td>Lập trình viên (<code>an-dev</code>)</td><td>IAM user trong group <code>dev</code></td><td>Liệt kê <code>labflow-anh</code>, đọc object</td><td>Đọc <code>bi-mat/*</code>; ghi; đụng IAM</td></tr>
    <tr><td>Bot báo cáo</td><td>IAM user (Chương 8 sẽ thay bằng role)</td><td>Đọc <code>bao-cao/*</code></td><td>Đọc thứ khác; ghi</td></tr>
    <tr><td>Ứng dụng</td><td>Role <code>labflow-app</code> tin <code>ecs-tasks.amazonaws.com</code></td><td>Put/Get <code>uploads/*</code></td><td>Xoá; đọc <code>bi-mat/*</code></td></tr>
    <tr><td>Pipeline deploy</td><td>Role <code>gha-labflow-deploy</code> qua OIDC GitHub</td><td>Chỉ nhận vai từ <code>main</code> của kho mã của bạn</td><td>Bị nhận vai từ kho, nhánh hay PR khác</td></tr>
  </tbody>
</table>

<h3>Ma trận quyền bạn phải nộp</h3>
<p>Chạy từng phép thử bằng khoá của đúng danh tính và ghi ✓ hoặc ✗. Đây là lần chạy mẫu (thật, có bật kiểm quyền):</p>
${OUT_18_MATRAN}
<p>Dòng cuối được cố ý giữ lại từ bài 1.2: user có <code>s3:*</code> vẫn đọc được bảng lương. Thang chấm yêu cầu bạn giải thích cách bảo vệ <code>bi-mat/</code> trước <em>mọi</em> danh tính — bucket policy có Deny tường minh, Chương 2.</p>

<h3>Dọn dẹp và kiểm “còn gì không?”</h3>
<p>Bản thân IAM không tốn tiền, nhưng user còn khoá và role tin quá rộng sót lại chính là những cánh cửa ở bài 1.7. Xoá theo thứ tự phụ thuộc — khoá và policy trước user, gỡ role khỏi instance profile trước khi xoá — rồi kiểm:</p>
${OUT_18_DON}

<h3>Thang chấm (100 điểm)</h3>
<ul>
  <li><strong>25</strong> — mọi policy giới hạn theo ARN; không có <code>"Action": "*"</code> hay <code>"Resource": "*"</code> trừ chỗ có chú thích lý do.</li>
  <li><strong>20</strong> — ma trận quyền đủ ít nhất 8 phép thử, mọi kết quả đúng yêu cầu.</li>
  <li><strong>15</strong> — trust policy của role: principal dịch vụ ECS cho ứng dụng; OIDC với <code>aud</code> và <code>sub</code> chính xác cho deploy.</li>
  <li><strong>15</strong> — script dọn chạy hai lần, lần hai không lỗi, và lệnh kiểm không in gì.</li>
  <li><strong>15</strong> — README ngắn: danh tính nào là gì, vì sao có từng quyền, cách xoay khoá của bot.</li>
  <li><strong>10</strong> — một đoạn: bạn bảo vệ <code>bi-mat/</code> trước user ngoài group thế nào (policy tài nguyên) và chống lạm dụng region thế nào (SCP).</li>
</ul>

<h3>Lời giải (chỉ mở sau khi đã thử)</h3>
${giai('Xem khung script mẫu', MA_LAB_GIAI + '<p>Script đầy đủ dùng cho khoá này (sinh ra mọi output ở trên) là <code>lab/c1/chay.sh</code> trong tài liệu khoá: dựng, kiểm, tấn công, săn và dọn trong khoảng bốn phút.</p>')}

<h3>🎤 Câu hỏi phỏng vấn cho cả chương</h3>
<ol>
  <li><strong>“Kể lại AWS quyết định một request được phép hay không.”</strong> — Mặc định từ chối; Deny tường minh nào cũng thắng (kể cả SCP và boundary); còn lại cần một Allow từ policy danh tính hoặc tài nguyên, và mọi lớp rào chắn cũng phải cho phép.</li>
  <li><strong>“Ứng dụng trên ECS bị AccessDenied khi ghi S3. Dò thế nào?”</strong> — Đọc lỗi (action + resource); kiểm <em>task</em> role (không phải execution role) có action trên đúng ARN (bucket hay bucket/*); kiểm Deny trong bucket policy, key policy KMS nếu có mã hoá, SCP; dùng policy simulator hoặc errorCode trong CloudTrail.</li>
  <li><strong>“Vì sao ứng dụng nên dùng role thay vì IAM user?”</strong> — Không có bí mật dài hạn để cất hay để lộ; khoá tự xoay; niềm tin được khai báo rõ; phiên lần theo được bằng tên.</li>
  <li><strong>“Cho công ty đối tác truy cập một bucket trong tài khoản bạn thế nào?”</strong> — Một role trong tài khoản bạn tin tài khoản của họ, có điều kiện external ID và policy quyền hẹp; hoặc bucket policy nêu tên role của họ; không bao giờ dùng chung user.</li>
  <li><strong>“Tuần đầu ở công ty mới, bạn kiểm gì trong tài khoản AWS?”</strong> — Root có MFA và không có khoá; credential report tìm khoá cũ, user không dùng; ai có AdministratorAccess; trust policy OIDC GitHub có sub; trail CloudTrail và GuardDuty đã bật; budget.</li>
</ol>
</div>
`;

/* ═══════════════════════════ 1.9 — Quiz ═══════════════════════════ */
const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ1 = [
  Q('A user has an Allow for s3:GetObject on arn:aws:s3:::labflow-anh/* and, through a group, a Deny for s3:GetObject on arn:aws:s3:::labflow-anh/bi-mat/*. Can the user read bi-mat/luong.csv?|||Một user có Allow s3:GetObject trên arn:aws:s3:::labflow-anh/* và, qua group, Deny s3:GetObject trên arn:aws:s3:::labflow-anh/bi-mat/*. User đọc được bi-mat/luong.csv không?', [
    'Yes, the user-level Allow is more specific|||Được, Allow ở cấp user cụ thể hơn',
    'No, an explicit Deny always wins|||Không, Deny tường minh luôn thắng',
    'Only if the user has MFA|||Chỉ khi user có MFA',
    'It depends on the order of statements|||Tuỳ thứ tự các luật',
  ], 1),
  Q('A Lambda function has s3:GetObject on arn:aws:s3:::reports and gets AccessDenied reading reports/jan.csv. What is the most likely fix?|||Một Lambda có s3:GetObject trên arn:aws:s3:::reports và bị AccessDenied khi đọc reports/jan.csv. Cách sửa khả dĩ nhất?', [
    'Add s3:ListBucket|||Thêm s3:ListBucket',
    'Change the resource to arn:aws:s3:::reports/*|||Đổi resource thành arn:aws:s3:::reports/*',
    'Make the bucket public|||Cho bucket công khai',
    'Use the root user|||Dùng user root',
  ], 1),
  Q('Which statement about IAM groups is TRUE?|||Câu nào về IAM group là ĐÚNG?', [
    'A group can be the Principal in a bucket policy|||Group có thể làm Principal trong bucket policy',
    'Groups can contain other groups|||Group chứa được group khác',
    'A group is not a principal; it only gathers users that share policies|||Group không phải principal; nó chỉ gom user dùng chung policy',
    'Each region has its own groups|||Mỗi region có group riêng',
  ], 2),
  Q('A user has sts:AssumeRole on role R in another account, but AssumeRole fails with AccessDenied. What should you check first?|||Một user có sts:AssumeRole trên role R ở tài khoản khác, nhưng AssumeRole báo AccessDenied. Nên kiểm gì trước?', [
    'The role\'s trust policy names the user (or its account)|||Trust policy của role có nêu user (hoặc tài khoản của nó) không',
    'The user\'s password policy|||Chính sách mật khẩu của user',
    'The S3 bucket policy|||Bucket policy của S3',
    'The region of the CLI|||Region của CLI',
  ], 0),
  Q('What does STS return for AssumeRole?|||STS trả gì cho AssumeRole?', [
    'A new IAM user|||Một IAM user mới',
    'An AKIA key that never expires|||Một khoá AKIA không hết hạn',
    'An ASIA key ID, a secret, a session token and an expiration|||Mã khoá ASIA, secret, session token và thời điểm hết hạn',
    'A password for the console only|||Một mật khẩu chỉ cho console',
  ], 2),
  Q('How do you rotate an IAM user\'s access key without downtime?|||Xoay access key của IAM user thế nào để không gián đoạn?', [
    'Delete the key, then create a new one|||Xoá khoá rồi tạo khoá mới',
    'Create a second key, deploy it, deactivate the old one, check last use, delete it|||Tạo khoá thứ hai, triển khai, vô hiệu khoá cũ, kiểm lần dùng cuối, rồi xoá',
    'Change the user\'s console password|||Đổi mật khẩu console của user',
    'Create a third key as a backup|||Tạo khoá thứ ba để dự phòng',
  ], 1),
  Q('A GitHub OIDC trust policy checks only token.actions.githubusercontent.com:aud = sts.amazonaws.com. Who can assume the role?|||Trust policy OIDC GitHub chỉ kiểm token.actions.githubusercontent.com:aud = sts.amazonaws.com. Ai nhận vai được role?', [
    'Only your repository|||Chỉ kho mã của bạn',
    'Only your organization|||Chỉ tổ chức của bạn',
    'Any GitHub Actions workflow in any repository|||Mọi workflow GitHub Actions ở mọi kho mã',
    'Nobody|||Không ai',
  ], 2),
  Q('What does a permissions boundary do?|||Permissions boundary làm gì?', [
    'Grants extra permissions to a role|||Cấp thêm quyền cho role',
    'Sets the maximum permissions a user or role can have|||Đặt mức quyền tối đa user hoặc role có thể có',
    'Encrypts the policy|||Mã hoá policy',
    'Limits the number of API calls|||Giới hạn số lời gọi API',
  ], 1),
  Q('After deleting a leaked admin key, what is the MOST important next step?|||Sau khi xoá một khoá quản trị bị lộ, bước tiếp theo QUAN TRỌNG NHẤT là gì?', [
    'Wait for the bill|||Chờ hoá đơn',
    'Hunt for persistence: new users, keys, roles, functions and instances in every region|||Săn chỗ bám trụ: user, khoá, role, function và máy mới ở mọi region',
    'Change the account e-mail|||Đổi email tài khoản',
    'Disable IAM|||Tắt IAM',
  ], 1),
  Q('Without creating a trail, what does CloudTrail give you?|||Khi chưa tạo trail, CloudTrail cho bạn gì?', [
    'Nothing|||Không gì cả',
    '90 days of management-event history per region, free|||90 ngày lịch sử sự kiện quản lý mỗi region, miễn phí',
    'All S3 object reads forever|||Mọi lần đọc object S3, mãi mãi',
    'Only console logins|||Chỉ lần đăng nhập console',
  ], 1),
];

export default {
  title: 'Chapter 1 — Identity and access (IAM)|||Chương 1 — Danh tính và quyền truy cập (IAM)',
  description: 'User, group, role và policy; đọc policy JSON và ba luật đánh giá (chạy thật có kiểm quyền); quyền tối thiểu, boundary, Access Analyzer; khoá truy cập, profile, xoay khoá, Identity Center; STS và trust policy; OIDC từ GitHub Actions; khoá lộ, cửa sau, CloudTrail, GuardDuty; lab IAM cho LabFlow.',
  lessons: [
    {
      title: '1.1 — Users, groups, roles and policies|||1.1 — User, group, role và policy',
      slug: 'aws-1-1-khai-niem',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Principal, user vs role, group, các họ policy, đọc ARN; dựng group/user/policy/role và thấy AccessDenied thật trên trình giả lập có kiểm quyền.',
      content: L11_EN + L11_VI,
    },
    {
      title: '1.2 — Reading and writing IAM policy JSON|||1.2 — Đọc và viết policy IAM bằng JSON',
      slug: 'aws-1-2-doc-policy',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Version/Statement/Effect/Action/Resource/Condition, bẫy bucket với object, ba luật đánh giá chứng minh bằng chạy thật, s3:* nguy hiểm thế nào, condition MFA và region.',
      content: L12_EN + L12_VI,
    },
    {
      title: '1.3 — Least privilege in practice|||1.3 — Quyền tối thiểu trong thực tế',
      slug: 'aws-1-3-toi-thieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bắt đầu từ 0 và thêm theo AccessDenied (chạy thật), managed vs inline, permission boundary, credential report, Access Analyzer; vụ từ khoá thử nghiệm tới quản trị trong 8 phút (Sysdig 11/2025).',
      content: L13_EN + L13_VI,
    },
    {
      title: '1.4 — Access keys, CLI profiles and IAM Identity Center|||1.4 — Khoá truy cập, profile CLI và IAM Identity Center',
      slug: 'aws-1-4-khoa',
      type: 'LESSON',
      isFreePreview: true,
      description: 'AKIA vs ASIA, ~/.aws/config và credentials, nhiều profile, xoay khoá năm bước (chạy thật), Identity Center thay khoá dài hạn, gitleaks trước commit, LLMjacking 2024.',
      content: L14_EN + L14_VI,
    },
    {
      title: '1.5 — Roles and temporary credentials (STS)|||1.5 — Role và thông tin xác thực tạm (STS)',
      slug: 'aws-1-5-role-sts',
      type: 'LESSON',
      isFreePreview: true,
      description: 'AssumeRole từng bước, trust policy vs policy quyền (chứng minh bằng chạy thật), instance profile, task/execution role, PassRole, external ID, thu hồi phiên.',
      content: L15_EN + L15_VI,
    },
    {
      title: '1.6 — Roles for machines: OIDC from GitHub Actions|||1.6 — Role cho máy: OIDC từ GitHub Actions',
      slug: 'aws-1-6-oidc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao khoá trong CI là gánh nợ (tj-actions 2025), luồng OIDC, claim sub, trust policy chính xác, lỗi thiếu sub (Datadog 2023) và rào chắn của AWS, ghim action theo SHA.',
      content: L16_EN + L16_VI,
    },
    {
      title: '1.7 — Hacker’s view: leaked keys, crypto-mining and CloudTrail|||1.7 — Góc hacker: khoá lộ, đào coin và CloudTrail',
      slug: 'aws-1-7-lo-khoa',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn vụ thật một khuôn, kẻ tấn công cài cửa sau sống sót sau khi xoá khoá (chạy thật), CloudTrail, GuardDuty, danh sách năm bước xử lý.',
      content: L17_EN + L17_VI,
    },
    {
      title: '1.8 — Chapter 1 lab + interview questions|||1.8 — Lab chương 1 + câu hỏi phỏng vấn',
      slug: 'aws-1-8-lab-1',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng IAM cho nhóm LabFlow (dev, bot, ứng dụng, pipeline OIDC), ma trận quyền chạy thật, dọn và kiểm còn gì, thang chấm, lời giải ẩn, năm câu phỏng vấn.',
      content: L18_EN + L18_VI,
    },
    {
      title: '1.9 — Chapter 1 quiz|||1.9 — Kiểm tra Chương 1',
      slug: 'aws-1-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về đánh giá policy, ARN bucket/object, group, trust policy, STS, xoay khoá, OIDC sub, boundary, xử lý khoá lộ và CloudTrail.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from something you saw fail or succeed for real in this chapter. If you miss one, rerun that part of the lab and read the error message again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ thứ bạn đã thấy thất bại hay thành công thật trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại thông báo lỗi.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ1 },
    },
  ],
};
