/**
 * Cloud AWS — Chương 4: Máy chủ EC2 (soạn 19–20/11/2026, agent aws; phiên 22 chạy từ Mac qua ssh).
 * GIỮ title chương theo khung + slug bài khung đang có trên prod:
 *   4.1 ec2 · 4.2 user-data · 4.3 ebs · 4.4 imds · 4.5 gia · 4.6 gpu · 4.7 lab-4 · 4.8 quiz (MỚI).
 * Mọi output chạy THẬT 19/11/2026 bằng scratchpad/aws/lab/c4/chay.sh + lab4/chay.sh:
 *   - AWS CLI 2.41.0 → LocalStack 4.12 (API EC2 giả lập: chỉ CẤU HÌNH, không bật máy ảo);
 *   - container THẬT aws-c4-* (ảnh aws-c4-may:1 = alpine 3 + cloud-init 26.1 + OpenSSH 10.3): SSH bằng khoá, cloud-init NoCloud
 *     chạy user data thật, ổ bền vs tmpfs, IMDS giả lập chính hãng (amazon-ec2-metadata-mock 1.13.0) ở 169.254.169.254 + SSRF;
 *   - giá: Price List on-demand Singapore + trang giá Spot công khai (tải 19/11/2026, ~/.rtq-aws/n4/).
 * Khác AWS đã ghi rõ trong bài: LocalStack lờ dữ liệu launch template khi run-instances; giá Spot của LocalStack là số giả;
 *   LocalStack không có Service Quotas. Khoá trong ví dụ là chỗ giữ (ASIAEXAMPLE0000000NN, wJalr…EXAMPLEKEY).
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/hcl()/js() của _chung.mjs.
 */
import { bash, json, hcl, js, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (scratchpad/aws/lab/c4/chay.sh + lab4/chay.sh: AWS CLI 2.41.0 → LocalStack 4.12; container thật aws-c4-*: sshd, cloud-init 26.1, amazon-ec2-metadata-mock 1.13.0) ═════ */
const OUT_41_EC2_A = out("$ aws ec2 describe-instance-types --instance-types t3.micro t4g.micro m7g.large c7g.large g5.xlarge --query 'InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,ProcessorInfo.SupportedArchitectures[0]]' --output text\nc7g.large\t2\t4096\tarm64\ng5.xlarge\t4\t16384\tx86_64\nm7g.large\t2\t8192\tarm64\nt3.micro\t2\t1024\tx86_64\nt4g.micro\t2\t1024\tarm64\n$ aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text\nami-0609186b60570e9c9\n$ ssh-keygen -t ed25519 -N '' -C labflow -f labflow\n256 SHA256:pcOdutkZfi64lSiOLYMCrWrGv4ReNCWR7fMr5y2OY1k labflow (ED25519)\n$ aws ec2 import-key-pair --key-name labflow --public-key-material fileb:///aws/labflow.pub --query '[KeyName,KeyFingerprint]' --output text\nlabflow\t49:7e:17:5f:1f:de:4e:e2:76:84:ef:e3:53:76:25:f7:04:1a:67:c8:d0:70:35:16:d6:b5:18:a1:c8:50:f3:f8\n$ aws ec2 authorize-security-group-ingress --group-id sg-3903c926449751e4d --protocol tcp --port 22 --cidr 203.0.113.10/32 --query 'SecurityGroupRules[0].[IpProtocol,FromPort,CidrIpv4]' --output text\ntcp\t22\t203.0.113.10/32\n$ aws ec2 run-instances --image-id ami-0609186b60570e9c9 --instance-type t3.micro --key-name labflow --security-group-ids sg-3903c926449751e4d --metadata-options HttpTokens=required --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=labflow-1}]' --query 'Instances[0].[InstanceId,State.Name,InstanceType]' --output text\ni-6cfa51054dffe5ca4\tpending\tt3.micro\n$ aws ec2 describe-instances --instance-ids i-6cfa51054dffe5ca4 --query 'Reservations[0].Instances[0].[State.Name,PrivateIpAddress,PublicIpAddress,KeyName,MetadataOptions.HttpTokens]' --output text\nrunning\t10.164.17.179\t54.214.105.229\tlabflow\trequired\n$ aws ec2 modify-instance-attribute --instance-id i-6cfa51054dffe5ca4 --disable-api-termination\n$ aws ec2 terminate-instances --instance-ids i-6cfa51054dffe5ca4\nAn error occurred (OperationNotPermitted) when calling the TerminateInstances operation: The instance 'i-6cfa51054dffe5ca4' may not be terminated. Modify its 'disableApiTermination' instance attribute and try again.\n$ aws ec2 stop-instances --instance-ids i-6cfa51054dffe5ca4 --query 'StoppingInstances[0].[PreviousState.Name,CurrentState.Name]' --output text\nrunning\tstopping\n$ aws ec2 start-instances --instance-ids i-6cfa51054dffe5ca4 --query 'StartingInstances[0].[PreviousState.Name,CurrentState.Name]' --output text\nstopped\tpending\n$ aws ec2 modify-instance-attribute --instance-id i-6cfa51054dffe5ca4 --no-disable-api-termination\n$ aws ec2 terminate-instances --instance-ids i-6cfa51054dffe5ca4 --query 'TerminatingInstances[0].[PreviousState.Name,CurrentState.Name]' --output text\nrunning\tshutting-down");
const OUT_41_EC2_B = out("# ── SSH THẬT: container aws-c4-may (sshd) và aws-c4-laptop (máy bạn), mạng 10.144.1.0/24\n[laptop]$ ssh -i labflow -o BatchMode=yes -o StrictHostKeyChecking=accept-new ec2-user@10.144.1.20 \"whoami; hostname\"\nWarning: Permanently added '10.144.1.20' (ED25519) to the list of known hosts.\r\nec2-user\nip-10-144-1-20\n[laptop]$ ssh -i khoa-khac -o BatchMode=yes ec2-user@10.144.1.20 true\nec2-user@10.144.1.20: Permission denied (publickey,password,keyboard-interactive).\r\n[laptop]$ ssh -i labflow-644 -o BatchMode=yes ec2-user@10.144.1.20 true\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\n@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @\r\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\r\nPermissions 0644 for 'labflow-644' are too open.\r\nIt is required that your private key files are NOT accessible by others.\r\nThis private key will be ignored.\r\nLoad key \"labflow-644\": bad permissions\r\nec2-user@10.144.1.20: Permission denied (publickey,password,keyboard-interactive).\r\n[laptop]$ stat -c \"%A %n\" labflow labflow-644\n-rw------- labflow\n-rw-r--r-- labflow-644\n[may]$ grep -E \"Accepted|Failed|Connection closed\" /var/log/sshd.log | sed -E \"s/port [0-9]+/port …/\" | tail -3\nAccepted publickey for ec2-user from 10.144.1.10 port … ssh2: ED25519 SHA256:pcOdutkZfi64lSiOLYMCrWrGv4ReNCWR7fMr5y2OY1k\r\nConnection closed by authenticating user ec2-user 10.144.1.10 port … [preauth]\r\nConnection closed by authenticating user ec2-user 10.144.1.10 port … [preauth]\r");
const OUT_42_USERDATA = out("# Máy 1 lên lần đầu: cloud-init đọc user data từ nguồn NoCloud (trên EC2 là IMDS) rồi chạy bằng root\n[ud1]$ cloud-init status --long | grep -E \"^(status|detail)\"\nstatus: done\ndetail: DataSourceNoCloud [seed=/var/lib/cloud/seed/nocloud]\n[ud1]$ grep -E \"^\\+ (apk|mkdir|nohup)|labflow-api|Cloud-init v.* finished\" /var/log/cloud-init-output.log | sed -E \"s/ at .*Datasource/ … Datasource/; s/Up [0-9.]+ seconds/Up … seconds/\"\n+ apk add -q --no-cache nodejs\n+ mkdir -p /opt/labflow\n+ nohup node /opt/labflow/server.js\nCloud-init v. 26.1 finished … Datasource DataSourceNoCloud [seed=/var/lib/cloud/seed/nocloud].  Up … seconds\n[ud1]$ cat /var/log/labflow-boot.log | sed -E \"s/[0-9T:-]{19}Z/<giờ UTC>/\"\nuser-data bat dau <giờ UTC>\nuser-data xong\n[ud1]$ curl -s localhost:3000/health; echo\n{\"ok\":true,\"service\":\"labflow-api\"}\n# Khởi động lại máy 1 (cùng instance-id): cloud-init KHÔNG chạy lại user data\n[ud1]$ wc -l < /var/log/labflow-boot.log; ls /var/lib/cloud/instances/\n2\ni-0labflow00000001\n# Máy 2 từ cùng ảnh nhưng instance-id MỚI ⇒ user data chạy lại\n[ud2]$ cat /var/log/labflow-boot.log | sed -E \"s/[0-9T:-]{19}Z/<giờ UTC>/\"; curl -s localhost:3000/health; echo\nuser-data bat dau <giờ UTC>\nuser-data xong\n{\"ok\":true,\"service\":\"labflow-api\"}\n# Máy 3: user data gõ sai tên gói ⇒ máy VẪN chạy, chỉ việc khởi tạo hỏng\n[ud3]$ cloud-init status --long | grep -E \"^status|scripts_user\" | head -3\nstatus: error\n\t- ('scripts_user', RuntimeError('Runparts: 1 failures (part-001) in 1 attempted commands'))\n\t- Failed to run module scripts_user (scripts in /var/lib/cloud/instance/scripts)\n[ud3]$ grep -E \"^\\+ apk|ERROR|nodejss\" /var/log/cloud-init-output.log | head -4\n2026-11-19 16:49:50,105 - stages.py[ERROR]: Unable to render networking. Network config is likely broken: No available network renderers found. Searched through list: ['eni']\n+ apk add -q --no-cache nodejss\nERROR: unable to select packages:\n  nodejss (no such package):\n[ud3]$ cat /var/log/labflow-boot.log; curl -s -m2 localhost:3000/health || echo \"curl: không kết nối được cổng 3000\"\nuser-data bat dau\ncurl: không kết nối được cổng 3000\n# Phía API: user data đi kèm máy (base64), launch template giữ cấu hình để dựng lại\n$ aws ec2 describe-instance-attribute --instance-id i-9937ea4aea168f96f --attribute userData --query UserData.Value --output text | base64 -d | head -3\n#!/bin/bash\n# User data của LabFlow — cloud-init chạy MỘT lần, bằng root, khi máy khởi động lần đầu.\nset -euxo pipefail\n$ aws ec2 create-launch-template --launch-template-name labflow-api --launch-template-data file:///aws/lt.json --query 'LaunchTemplate.[LaunchTemplateName,LatestVersionNumber]' --output text\nlabflow-api\t1\n$ aws ec2 create-launch-template-version --launch-template-name labflow-api --source-version 1 --launch-template-data '{\"InstanceType\":\"t4g.small\"}' --query 'LaunchTemplateVersion.[VersionNumber,LaunchTemplateData.InstanceType]' --output text\n2\tt4g.small\n$ aws ec2 describe-launch-template-versions --launch-template-name labflow-api --query 'LaunchTemplateVersions[].[VersionNumber,LaunchTemplateData.InstanceType,LaunchTemplateData.MetadataOptions.HttpTokens]' --output text\n1\tt3.micro\trequired\n2\tt4g.small\tNone\n# LocalStack 4.12 LỜ dữ liệu template khi run-instances (đo thật bên dưới); AWS thật sẽ cho t4g.small + required\n$ aws ec2 run-instances --launch-template LaunchTemplateName=labflow-api,Version=2 --query 'Instances[0].[InstanceId,InstanceType,MetadataOptions.HttpTokens]' --output text\ni-266d8b6e71459bc00\tm1.small\toptional");
const OUT_43_EBS_A = out("$ aws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type gp3 --query '[VolumeId,VolumeType,Iops,Size]' --output text\nvol-78fbfe8d6fd38cadb\tgp3\t3000\t20\n$ aws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type io2 --iops 6000 --query '[VolumeId,VolumeType,Iops,Size]' --output text\nvol-86d06d3345af7769a\tio2\t6000\t20\n$ aws ec2 attach-volume --volume-id vol-78fbfe8d6fd38cadb --instance-id i-c9319175c0b45edd1 --device /dev/sdf --query '[Device,State]' --output text\n/dev/sdf\tattaching\n$ aws ec2 create-snapshot --volume-id vol-78fbfe8d6fd38cadb --description 'labflow data truoc khi nang cap' --query '[SnapshotId,State,VolumeSize]' --output text\nsnap-6c2e95eac1a29baf8\tpending\t20\n$ aws ec2 terminate-instances --instance-ids i-c9319175c0b45edd1 --query 'TerminatingInstances[0].CurrentState.Name' --output text\nshutting-down\n$ aws ec2 describe-volumes --volume-ids vol-78fbfe8d6fd38cadb --query 'Volumes[0].[VolumeId,State]' --output text\nvol-78fbfe8d6fd38cadb\tavailable\n$ aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[].[VolumeId,VolumeType,Size]' --output text\nvol-78fbfe8d6fd38cadb\tgp3\t20\nvol-86d06d3345af7769a\tio2\t20");
const OUT_43_EBS_B = out("# ── Ổ THẬT: volume Docker bền (giống EBS) vs tmpfs (giống instance store)\n[ebsmay]$ echo \"booking 42\" > /data/db.txt; echo \"cache tạm\" > /scratch/cache.txt; ls /data /scratch\n/data:\ndb.txt\n\n/scratch:\ncache.txt\n$ docker restart aws-c4-ebsmay   # như stop rồi start\n[ebsmay]$ cat /data/db.txt; ls -A /scratch | wc -l\nbooking 42\n0\n$ docker rm -f aws-c4-ebsmay   # như terminate máy; ổ dữ liệu ở lại\n[ebsmay2]$ cat /data/db.txt\nbooking 42\n# ── EFS: một ổ mạng nhiều máy cùng gắn\n[efs1]$ echo \"avatar-7.png\" > /mnt/efs/uploads.txt\n[efs2]$ cat /mnt/efs/uploads.txt\navatar-7.png");
const OUT_43_EBS_C = out("# ── Snapshot tăng dần (mô phỏng khối 1 MiB)\n$ python3 snap.py\nsnap-1: ổ 64 khối · lưu MỚI 64 khối · kho tổng 64 khối\nsnap-2: ổ 64 khối · lưu MỚI 3 khối · kho tổng 67 khối\nsnap-3: ổ 64 khối · lưu MỚI 0 khối · kho tổng 67 khối\nxoá snap-1 ⇒ khối còn cần 64 · khôi phục snap-2 đủ 64/64 khối: True");
const OUT_44_IMDS_A = out("# Trong máy EC2: hỏi IMDS (IMDSv1 — GET thẳng)\n[app]$ curl -s http://169.254.169.254/latest/meta-data/instance-id; echo; curl -s http://169.254.169.254/latest/meta-data/instance-type; echo\ni-0labflow00000001\nt3.micro\n[app]$ curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/; echo\nlabflow-ec2-role\n# Ứng dụng xem trước liên kết hoạt động bình thường\n[hacker]$ curl -s \"http://10.144.1.40:8080/preview?url=http://169.254.169.254/latest/meta-data/local-ipv4\"; echo\n10.144.4.20");
const OUT_44_IMDS_B = out("# Kẻ tấn công từ ngoài: nhờ máy chủ tải IMDS hộ (SSRF)\n[hacker]$ curl -s -m3 http://169.254.169.254/latest/meta-data/ || echo \"từ ngoài: không tới được 169.254.169.254\"\ntừ ngoài: không tới được 169.254.169.254\n[hacker]$ curl -s \"http://10.144.1.40:8080/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/\"; echo\nlabflow-ec2-role\n[hacker]$ curl -s \"http://10.144.1.40:8080/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/labflow-ec2-role\"\n{\n\t\"Code\": \"Success\",\n\t\"LastUpdated\": \"2026-11-19T16:00:00Z\",\n\t\"Type\": \"AWS-HMAC\",\n\t\"AccessKeyId\": \"ASIAEXAMPLE0000000NN\",\n\t\"SecretAccessKey\": \"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\",\n\t\"Token\": \"EXAMPLE-SESSION-TOKEN\",\n\t\"Expiration\": \"2026-11-19T22:00:00Z\"\n}\n# Bật IMDSv2 bắt buộc (HttpTokens=required)\n[hacker]$ curl -s \"http://10.144.1.40:8080/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/\"; echo\nupstream HTTP 401\n# SDK/CLI trong máy thì vẫn chạy: PUT lấy token rồi GET kèm token\n[app]$ TOKEN=$(curl -s -X PUT http://169.254.169.254/latest/api/token -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\"); echo \"token dài ${#TOKEN} ký tự\"; curl -s -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/iam/security-credentials/; echo\ntoken dài 44 ký tự\nlabflow-ec2-role\n[app]$ curl -s -o /dev/null -w \"GET không token: HTTP %{http_code}\\n\" http://169.254.169.254/latest/meta-data/instance-id\nGET không token: HTTP 401");
const OUT_44_IMDS_C = out("# Phía API: bắt IMDSv2 + hop limit 1 cho máy đang chạy, và mặc định cho cả tài khoản\n$ aws ec2 describe-instances --instance-ids i-28c4f0fe2e1871e1e --query 'Reservations[0].Instances[0].MetadataOptions.[HttpTokens,HttpPutResponseHopLimit,HttpEndpoint]' --output text\noptional\t1\tenabled\n$ aws ec2 modify-instance-metadata-options --instance-id i-28c4f0fe2e1871e1e --http-tokens required --http-put-response-hop-limit 1 --query 'InstanceMetadataOptions.[HttpTokens,HttpPutResponseHopLimit]' --output text\nrequired\t1\n$ aws ec2 modify-instance-metadata-defaults --http-tokens required --http-put-response-hop-limit 1\nAn error occurred (InternalFailure) when calling the ModifyInstanceMetadataDefaults operation: The modify_instance_metadata_defaults action has not been implemented");
const OUT_45_GIA_A = out("$ python3 gia.py od-sg.json spot.js\nloại          USD/giờ  USD/tháng  spot/giờ  spot/tháng\nt3.micro       0.0132       9.64    0.0026        1.90\nt4g.micro      0.0106       7.74    0.0063        4.60\nt3.small       0.0264      19.27    0.0078        5.69\nt4g.small      0.0212      15.48    0.0087        6.35\nm7i.large      0.1260      91.98    0.0427       31.17\nm7g.large      0.1020      74.46    0.0398       29.05\nGraviton rẻ hơn: t4g.micro/t3.micro = 0.80 · m7g.large/m7i.large = 0.81\nmáy t4g.small chạy cả tháng: 15.48 + EBS gp3 20 GB 1.92 + IPv4 công khai 3.65 = 21.05 USD\ntính theo giây (tối thiểu 60 s): chạy 90 s t3.micro = 0.000330 USD · chạy 30 s vẫn tính 60 s = 0.000220 USD");
const OUT_45_GIA_B = out("# Cảnh báo thu hồi Spot: máy đọc IMDS mỗi 5 giây (giả lập của AWS)\n[app]$ curl -s -o /dev/null -w \"HTTP %{http_code}\\n\" http://169.254.169.254/latest/meta-data/spot/instance-action\nHTTP 404\n[app]$ curl -s http://169.254.169.254/latest/meta-data/spot/instance-action; echo\n{\n\t\"action\": \"terminate\",\n\t\"time\": \"2026-11-19T16:53:18Z\"\n}\n$ aws ec2 describe-spot-price-history --instance-types t3.micro --product-descriptions Linux/UNIX --max-items 2 --query 'SpotPriceHistory[].[AvailabilityZone,SpotPrice]' --output text\nap-southeast-1a\t0.00001\nap-southeast-1b\t0.00001\nNone");
const OUT_46_GPU = out("$ aws ec2 describe-instance-types --instance-types g4dn.xlarge g5.xlarge g6.xlarge --query 'InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB,GpuInfo.Gpus[0].Name,GpuInfo.Gpus[0].MemoryInfo.SizeInMiB]' --output text\ng4dn.xlarge\t4\t16384\tT4\t16384\ng5.xlarge\t4\t16384\tA10G\t22888\ng6.xlarge\t4\t16384\tL4\t22888\n$ aws service-quotas get-service-quota --service-code ec2 --quota-code L-DB2E81BA\nAn error occurred (InternalFailure) when calling the GetServiceQuota operation: The API for service 'service-quotas' is either not included in your current license plan or has not yet been emulated by LocalStack. Please refer to https://docs.localstack.cloud/references/coverage for more details.\n$ nvidia-smi --query-gpu=name,memory.total --format=csv   # GPU trên máy nhà dựng khoá\nname, memory.total [MiB]\nNVIDIA GeForce RTX 3060, 12288 MiB");
const OUT_47_GIAI = out("$ bash don.sh\nshutting-down\nđã xoá ổ vol-27e3613542ca94cb5\n$ bash giai.sh\nTrue\nlabflow\n3000\n1\ni-225cf57b71c86d2e1\n$ curl -s $API_URL/health\n{\"ok\":true,\"service\":\"labflow-api\"}\n$ bash cham.sh\nPASS 1. key pair labflow kiểu ed25519\nPASS 2. SG labflow-api: chỉ mở tcp 3000, không có cổng 22\nPASS 3. launch template: IMDSv2 bắt buộc, hop limit 1\nPASS 4. launch template có user data khởi động labflow-api\nPASS 5. ổ gốc gp3 + mã hoá EBS mặc định bật cho region\nPASS 6. đúng một máy labflow-api đang chạy, t3.micro hoặc t4g.micro\nPASS 7. không có ổ EBS nằm không (available)\nPASS 8. API trả lời /health\nĐIỂM 8/8\n$ bash don.sh\nshutting-down\nlabflow-api\n$ bash con-gi.sh\n== ap-southeast-1\nMáy đang chạy  : 0\nMáy đang tắt   : 0 (ổ vẫn tính tiền)\nỔ EBS          : 0 (nằm không: 0)\nSnapshot của tôi: 1095\nElastic IP     : 0");
const OUT_47_TRUOC = out("$ bash truoc.sh\nlabflow\ni-ff3107b658b76cbf7\nvol-27e3613542ca94cb5\n$ bash cham.sh\nFAIL 1. key pair labflow kiểu ed25519 (thấy: rsa)\nFAIL 2. SG labflow-api: chỉ mở tcp 3000, không có cổng 22 (thấy: tcp:22:22 tcp:3000:3000)\nFAIL 3. launch template: IMDSv2 bắt buộc, hop limit 1\nFAIL 4. launch template có user data khởi động labflow-api\nFAIL 5. ổ gốc gp3 + mã hoá EBS mặc định bật cho region (mã hoá mặc định: False)\nFAIL 6. đúng một máy labflow-api đang chạy, t3.micro hoặc t4g.micro (thấy: t3.medium)\nFAIL 7. không có ổ EBS nằm không (1 ổ vẫn tính tiền)\nPASS 8. API trả lời /health\nĐIỂM 1/8");
const MA_UD = bash("# User data của LabFlow — cloud-init chạy MỘT lần, bằng root, khi máy khởi động lần đầu.\nset -euxo pipefail\necho \"user-data bat dau $(date -u +%FT%TZ)\" >> /var/log/labflow-boot.log\nif command -v dnf >/dev/null; then dnf install -y nodejs; else apk add -q --no-cache nodejs; fi\nmkdir -p /opt/labflow\ncat > /opt/labflow/server.js <<'JS'\nconst http = require('http');\nhttp.createServer((req, res) => {\n  if (req.url === '/health') {\n    res.writeHead(200, { 'content-type': 'application/json' });\n    return res.end(JSON.stringify({ ok: true, service: 'labflow-api' }));\n  }\n  res.writeHead(404); res.end();\n}).listen(3000, () => console.log('labflow-api listening on 3000'));\nJS\nnohup node /opt/labflow/server.js >> /var/log/labflow-api.log 2>&1 &\necho \"user-data xong\" >> /var/log/labflow-boot.log");
const MA_SSRF = bash("# Ứng dụng \"xem trước liên kết\" CÓ LỖ HỔNG SSRF (chỉ để học): máy chủ tự tải URL người dùng đưa vào.\nimport urllib.request\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\nfrom urllib.parse import urlparse, parse_qs\n\nclass H(BaseHTTPRequestHandler):\n    def do_GET(self):\n        q = parse_qs(urlparse(self.path).query)\n        url = q.get('url', [''])[0]\n        try:\n            with urllib.request.urlopen(url, timeout=5) as r:   # ← không kiểm đích: lỗ hổng nằm ở đây\n                body, code = r.read(), 200\n        except urllib.error.HTTPError as e:\n            body, code = ('upstream HTTP %d' % e.code).encode(), 502\n        self.send_response(code); self.end_headers(); self.wfile.write(body)\n    def log_message(self, *a): pass\n\nHTTPServer(('0.0.0.0', 8080), H).serve_forever()");
const MA_CHAM = bash("# Bộ chấm lab Chương 4 — 8 phép kiểm máy \"labflow-api\" (AWS thật hoặc LocalStack). API_URL = http://<IP>:3000 để kiểm phép 8.\ntype aws >/dev/null 2>&1 || { echo \"cần AWS CLI\"; exit 2; }\nd=0; ok() { echo \"PASS $1\"; d=$((d+1)); }; ko() { echo \"FAIL $1\"; }\nK=$(aws ec2 describe-key-pairs --key-names labflow --query 'KeyPairs[0].KeyType' --output text 2>/dev/null)\n[ \"$K\" = ed25519 ] && ok \"1. key pair labflow kiểu ed25519\" || ko \"1. key pair labflow kiểu ed25519 (thấy: ${K:-không có})\"\nSGQ() { aws ec2 describe-security-groups --filters Name=group-name,Values=labflow-api --query \"$1\" --output text 2>/dev/null; }\nLUAT=$(SGQ 'SecurityGroups[0].IpPermissions[].[IpProtocol,FromPort,ToPort]' | tr '\\t\\n' ': ' | sed 's/ $//')\n[ \"$LUAT\" = \"tcp:3000:3000\" ] && ok \"2. SG labflow-api: chỉ mở tcp 3000, không có cổng 22\" || ko \"2. SG labflow-api: chỉ mở tcp 3000, không có cổng 22 (thấy: ${LUAT:-không có SG})\"\nLT() { aws ec2 describe-launch-template-versions --launch-template-name labflow-api --versions '$Latest' --query \"LaunchTemplateVersions[0].LaunchTemplateData.$1\" --output text 2>/dev/null; }\n[ \"$(LT 'MetadataOptions.[HttpTokens,HttpPutResponseHopLimit]' | tr '\\t' ' ')\" = \"required 1\" ] && ok \"3. launch template: IMDSv2 bắt buộc, hop limit 1\" || ko \"3. launch template: IMDSv2 bắt buộc, hop limit 1\"\nLT UserData | base64 -d 2>/dev/null | grep -q 'labflow-api' && ok \"4. launch template có user data khởi động labflow-api\" || ko \"4. launch template có user data khởi động labflow-api\"\nE=$(aws ec2 get-ebs-encryption-by-default --query EbsEncryptionByDefault --output text)\n[ \"$(LT 'BlockDeviceMappings[0].Ebs.VolumeType')\" = gp3 ] && [ \"$E\" = True ] && ok \"5. ổ gốc gp3 + mã hoá EBS mặc định bật cho region\" || ko \"5. ổ gốc gp3 + mã hoá EBS mặc định bật cho region (mã hoá mặc định: $E)\"\nM=$(aws ec2 describe-instances --filters Name=tag:Name,Values=labflow-api Name=instance-state-name,Values=running --query 'Reservations[].Instances[].InstanceType' --output text)\n[[ \"$M\" =~ ^(t3\\.micro|t4g\\.micro)$ ]] && ok \"6. đúng một máy labflow-api đang chạy, t3.micro hoặc t4g.micro\" || ko \"6. đúng một máy labflow-api đang chạy, t3.micro hoặc t4g.micro (thấy: ${M:-không có})\"\nN=$(aws ec2 describe-volumes --filters Name=status,Values=available --query 'length(Volumes)' --output text)\n[ \"$N\" = 0 ] && ok \"7. không có ổ EBS nằm không (available)\" || ko \"7. không có ổ EBS nằm không ($N ổ vẫn tính tiền)\"\nH=$(curl -s -m 5 \"${API_URL:-http://127.0.0.1:3000}/health\")\ngrep -q '\"ok\":true' <<<\"$H\" && ok \"8. API trả lời /health\" || ko \"8. API trả lời /health (thấy: ${H:-không kết nối được})\"\necho \"ĐIỂM $d/8\"");
const MA_TRUOC = bash("# Bản VỘI (đừng làm theo): mở 22 cho cả Internet, tạo máy thẳng không template, IMDS mặc định, thêm ổ rồi quên.\naws ec2 create-key-pair --key-name labflow --key-type rsa --query KeyName --output text >/dev/null; echo labflow\nSG=$(aws ec2 create-security-group --group-name labflow-api --description 'labflow api' --query GroupId --output text)\naws ec2 authorize-security-group-ingress --group-id $SG --protocol tcp --port 22 --cidr 0.0.0.0/0 >/dev/null\naws ec2 authorize-security-group-ingress --group-id $SG --protocol tcp --port 3000 --cidr 0.0.0.0/0 >/dev/null\naws ec2 run-instances --image-id $AMI --instance-type t3.medium --key-name labflow --security-group-ids $SG \\\n  --user-data file://user-data.sh --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=labflow-api}]' \\\n  --query 'Instances[0].InstanceId' --output text\naws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type gp2 --query VolumeId --output text");
const MA_GIAI = bash("# Lời giải: mã hoá EBS mặc định, khoá ed25519 tự sinh, SG chỉ 3000, launch template (IMDSv2 + user data + ổ gp3 mã hoá), máy chạy từ template.\naws ec2 enable-ebs-encryption-by-default --query EbsEncryptionByDefault --output text   # mọi ổ mới trong region đều mã hoá\nssh-keygen -q -t ed25519 -N '' -C labflow -f labflow\naws ec2 import-key-pair --key-name labflow --public-key-material fileb://labflow.pub --query KeyName --output text\nSG=$(aws ec2 create-security-group --group-name labflow-api --description 'LabFlow API: chi cong 3000' --query GroupId --output text)\naws ec2 authorize-security-group-ingress --group-id $SG --protocol tcp --port 3000 --cidr 0.0.0.0/0 --query 'SecurityGroupRules[0].FromPort' --output text\ncat > lt.json <<JSON\n{\n  \"ImageId\": \"$AMI\",\n  \"InstanceType\": \"t3.micro\",\n  \"KeyName\": \"labflow\",\n  \"SecurityGroupIds\": [\"$SG\"],\n  \"MetadataOptions\": { \"HttpTokens\": \"required\", \"HttpPutResponseHopLimit\": 1 },\n  \"BlockDeviceMappings\": [{ \"DeviceName\": \"/dev/xvda\",\n    \"Ebs\": { \"VolumeSize\": 8, \"VolumeType\": \"gp3\", \"Encrypted\": true, \"DeleteOnTermination\": true } }],\n  \"UserData\": \"$(base64 -w0 user-data.sh)\",\n  \"TagSpecifications\": [{ \"ResourceType\": \"instance\", \"Tags\": [{ \"Key\": \"Name\", \"Value\": \"labflow-api\" }] }]\n}\nJSON\naws ec2 create-launch-template --launch-template-name labflow-api --launch-template-data file://lt.json \\\n  --query 'LaunchTemplate.LatestVersionNumber' --output text\n# AWS thật: chỉ cần --launch-template. LocalStack 4.12 lờ dữ liệu template ⇒ nhắc lại loại máy, IMDS và thẻ (vô hại trên AWS).\naws ec2 run-instances --launch-template LaunchTemplateName=labflow-api --instance-type t3.micro \\\n  --metadata-options HttpTokens=required,HttpPutResponseHopLimit=1 \\\n  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=labflow-api}]' --query 'Instances[0].InstanceId' --output text");
const MA_DON = bash("# Dọn theo thứ tự: máy ⇒ (chờ terminated) ⇒ template ⇒ SG ⇒ key ⇒ ổ nằm không.\nI=$(aws ec2 describe-instances --filters Name=tag:Name,Values=labflow-api Name=instance-state-name,Values=pending,running,stopping,stopped --query 'Reservations[].Instances[].InstanceId' --output text)\n[ -n \"$I\" ] && aws ec2 terminate-instances --instance-ids $I --query 'TerminatingInstances[].CurrentState.Name' --output text && aws ec2 wait instance-terminated --instance-ids $I\naws ec2 delete-launch-template --launch-template-name labflow-api --query 'LaunchTemplate.LaunchTemplateName' --output text 2>/dev/null\nSG=$(aws ec2 describe-security-groups --filters Name=group-name,Values=labflow-api --query 'SecurityGroups[0].GroupId' --output text)\n[ \"$SG\" != None ] && aws ec2 delete-security-group --group-id $SG\naws ec2 delete-key-pair --key-name labflow >/dev/null\nfor v in $(aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[].VolumeId' --output text); do aws ec2 delete-volume --volume-id $v && echo \"đã xoá ổ $v\"; done\ntrue");
const MA_CONGI = bash("# Còn gì của EC2 đang tính tiền? (máy chạy theo giây; ổ EBS + snapshot theo GB-tháng kể cả khi máy đã tắt; IPv4/EIP theo giờ)\nfor R in ${REGIONS:-ap-southeast-1}; do\n  echo \"== $R\"\n  echo \"Máy đang chạy  : $(aws ec2 describe-instances --region $R --filters Name=instance-state-name,Values=pending,running --query 'length(Reservations[].Instances[])' --output text)\"\n  echo \"Máy đang tắt   : $(aws ec2 describe-instances --region $R --filters Name=instance-state-name,Values=stopped --query 'length(Reservations[].Instances[])' --output text) (ổ vẫn tính tiền)\"\n  echo \"Ổ EBS          : $(aws ec2 describe-volumes --region $R --query 'length(Volumes)' --output text) (nằm không: $(aws ec2 describe-volumes --region $R --filters Name=status,Values=available --query 'length(Volumes)' --output text))\"\n  echo \"Snapshot của tôi: $(aws ec2 describe-snapshots --region $R --owner-ids self --query 'length(Snapshots)' --output text)\"\n  echo \"Elastic IP     : $(aws ec2 describe-addresses --region $R --query 'length(Addresses)' --output text)\"\ndone");

/* ═════ 4.1 — Tạo và kết nối EC2 ═════ */
const L41_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 1</span>
<h2>4.1 — Launching and connecting to EC2: a VPS you rent by the second</h2>
<p class="lead">EC2 (Elastic Compute Cloud) is the service that rents you virtual machines. If you have ever rented a VPS, you already know 80% of it: a Linux box with CPU, RAM, a disk and an IP, that you reach over SSH. The other 20% is what makes it “cloud”: you pick the machine size from a catalogue of hundreds, you pay <strong>per second</strong> instead of per month, you can throw the machine away and get an identical one from an image in a minute, and every setting is an API call that a script (or Terraform, Chapter 11) can repeat. This lesson launches one machine end to end — catalogue, image, key, firewall, launch, states — and then makes a real SSH connection, including the two errors everyone meets on day one.</p>

<h3>The hotel picture</h3>
<p>Think of EC2 as a hotel. The <strong>instance type</strong> is the room class (single, suite, penthouse). The <strong>AMI</strong> is the room as prepared before you arrive — furniture and toiletries already in place. The <strong>key pair</strong> is your key card; the hotel keeps only the lock, never a copy of your card. The <strong>security group</strong> (lesson 3.3) is the receptionist who decides who may walk up to your door. <strong>Stop</strong> is leaving for the weekend while the hotel keeps your luggage (the disk) — you still pay for the storage room. <strong>Terminate</strong> is checking out for good.</p>

<h3>Reading an instance type name</h3>
<p><code>m7g.large</code> reads as: family <strong>m</strong> (general purpose), generation <strong>7</strong>, attribute <strong>g</strong> (AWS Graviton, ARM), size <strong>large</strong>. The families you will meet first:</p>
<table>
  <thead><tr><th>Family</th><th>Built for</th><th>Typical first use</th></tr></thead>
  <tbody>
    <tr><td><strong>t</strong> (t3, t4g)</td><td>Burstable: low baseline CPU plus “credits” for short bursts</td><td>Dev servers, small APIs, the Free Tier</td></tr>
    <tr><td><strong>m</strong></td><td>Balanced CPU and memory (1 vCPU : 4 GiB)</td><td>Most production web/API servers</td></tr>
    <tr><td><strong>c</strong></td><td>More CPU per GiB (1 : 2)</td><td>Video encoding, CPU-heavy batch jobs</td></tr>
    <tr><td><strong>r</strong></td><td>More memory per vCPU (1 : 8)</td><td>Caches, in-memory analytics, big JVMs</td></tr>
    <tr><td><strong>g / p</strong></td><td>NVIDIA GPUs</td><td>Machine learning, rendering (lesson 4.6)</td></tr>
  </tbody>
</table>
<p>Letters after the generation: <strong>g</strong> = Graviton (ARM), <strong>i</strong> = Intel, <strong>a</strong> = AMD, <strong>d</strong> = local NVMe disk (instance store, lesson 4.3), <strong>n</strong> = more network bandwidth. One trap with the <strong>t</strong> family: when the CPU credits run out, a t3/t4g in the default <em>unlimited</em> mode keeps running fast and bills you for the extra credits — a busy t3.micro is not a $10 machine.</p>

<h3>See it running: catalogue, image, key, firewall, launch</h3>
<p>Everything below ran for real on 19/11/2026 against LocalStack 4.12 (the EC2 API, not a real VM). Read it top to bottom — it is the order you will do it in on a real account.</p>
${OUT_41_EC2_A}
<ul>
  <li><strong>Never hard-code an AMI ID.</strong> IDs differ per region and change every time Amazon publishes a patched image. The public SSM parameter <code>/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64</code> always points to the latest Amazon Linux 2023 image in your region — scripts and Terraform should read it.</li>
  <li><strong>Make the key yourself, upload only the public half.</strong> <code>ssh-keygen -t ed25519</code> on your laptop, then <code>import-key-pair</code>. The private key never leaves your machine; AWS stores only the public key and shows its fingerprint. (<code>create-key-pair</code> also works, but then the private key travels through an API response and your terminal history.)</li>
  <li>The security group opens <strong>22 only to one address</strong> (<code>203.0.113.10/32</code> is a documentation placeholder — use your own IP). Better still, open no port 22 at all and use Session Manager (lesson 3.6).</li>
  <li><code>--metadata-options HttpTokens=required</code> turns on IMDSv2 from the first second. Lesson 4.4 shows the breach this prevents.</li>
  <li><strong>Termination protection</strong> (<code>disableApiTermination</code>) turned a mistaken terminate into an <code>OperationNotPermitted</code> error. Turn it on for anything you would cry about; you must switch it off before a real terminate.</li>
</ul>

<h3>The life of an instance — and what you pay in each state</h3>
<table>
  <thead><tr><th>State</th><th>Compute billed?</th><th>Disk (EBS) billed?</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>pending → running</td><td>Yes, per second (60 s minimum)</td><td>Yes</td><td>Billing starts when it reaches running</td></tr>
    <tr><td>stopping → stopped</td><td>No</td><td><strong>Yes</strong></td><td>RAM is lost; the automatic public IPv4 is released — you get a new one on start</td></tr>
    <tr><td>start again</td><td>Yes</td><td>Yes</td><td>Usually lands on different physical hardware</td></tr>
    <tr><td>shutting-down → terminated</td><td>No</td><td>Root disk deleted by default; extra disks may survive (lesson 4.3)</td><td>Stays visible for a while as <code>terminated</code>, then disappears</td></tr>
  </tbody>
</table>
<p>The habit to build: a stopped machine is <em>not</em> free, and a terminated one may leave disks behind. Lesson 4.7 ends with a script that lists both.</p>

<h3>See it running: a real SSH connection and the two classic errors</h3>
<p>To feel SSH for real, two containers play the roles: <code>may</code> is the EC2 machine running <code>sshd</code> with the public key in <code>/home/ec2-user/.ssh/authorized_keys</code> (exactly where EC2 puts the key you chose), <code>laptop</code> is you.</p>
${OUT_41_EC2_B}
<ol>
  <li><strong>The right key works</strong>: first connection prints the host-key warning and remembers the machine in <code>known_hosts</code>. The user is <code>ec2-user</code> on Amazon Linux, <code>ubuntu</code> on Ubuntu AMIs — “Permission denied” with the right key is very often just the wrong user name.</li>
  <li><strong>A different key</strong>: <code>Permission denied (publickey)</code>. The server's log shows the failed attempt. If you lost the private key, you cannot recover it — you attach a new key through EC2 Instance Connect or Session Manager instead.</li>
  <li><strong>The right key with loose permissions</strong>: OpenSSH refuses to use a private key that other users can read (<code>-rw-r--r--</code>) and prints <code>UNPROTECTED PRIVATE KEY FILE</code>. Fix with <code>chmod 600</code>.</li>
</ol>

<h3>🔓 Hacker's view: the machine is yours to protect</h3>
<p>Under the <strong>shared responsibility model</strong>, AWS secures the hardware and the hypervisor; everything inside the operating system is yours — patches, open ports, users, keys. In lesson 3.3 you saw Unit 42's honeypots get probed within minutes of appearing on the Internet. An EC2 machine with port 22 open to <code>0.0.0.0/0</code> is in that list from its first minute. Defend in layers: no public port 22 (Session Manager), security groups that name a source, IMDSv2 required, an instance role instead of access keys on disk, and <code>dnf upgrade</code> (or a fresh AMI) on a schedule.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Your VPS vs EC2:</strong> a VPS is a flat monthly price for one fixed box that you look after like a pet. EC2 bills by the second, so a machine that runs two hours a day costs two hours. Teams treat EC2 machines as <em>cattle</em>: if one misbehaves, terminate it and launch a fresh one from the same image and user data (next lesson).</li>
  <li><strong>At work:</strong> on day one you will rarely click “Launch instance”. You will read a launch template or Terraform file someone else wrote. Being able to read <code>m7g.large</code>, an AMI parameter and <code>HttpTokens=required</code> in that file is the actual skill.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“What is the difference between stopping and terminating an instance?”</strong> — Stop keeps the EBS root volume (still billed) and lets you start again, usually on new hardware with a new public IP; terminate deletes the instance and, by default, its root volume.</li>
  <li><strong>“How would you choose between t3, m7g and c7g?”</strong> — t for spiky low-average load (watch credits), m for balanced production web servers, c when CPU is the bottleneck; “g” means Graviton ARM, cheaper if your stack runs on ARM.</li>
  <li><strong>“You lost the private key of a running instance. What now?”</strong> — You cannot download it again. Connect through Session Manager or EC2 Instance Connect and add a new public key to <code>authorized_keys</code>, or stop the instance and fix the key from a rescue machine.</li>
  <li><strong>“Why not hard-code AMI IDs?”</strong> — They are region-specific and change with every patched release; read the SSM public parameter so new machines always start patched.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Start LocalStack (lesson 0.4). Look up the latest Amazon Linux 2023 AMI through the SSM parameter, for both <code>x86_64</code> and <code>arm64</code>.</li>
  <li>Generate an ed25519 key, import its public half as <code>labflow</code>, and compare the fingerprint AWS prints with <code>ssh-keygen -lf</code>.</li>
  <li>Launch a t3.micro with IMDSv2 required and a tag <code>Name=labflow-1</code>. Turn on termination protection and prove a terminate fails. Then stop, start, switch protection off and terminate.</li>
  <li>Write down, for each state you saw, whether compute and disk are billed.</li>
</ol>
<p><strong>Done when:</strong> the terminate with protection on fails with <code>OperationNotPermitted</code>, the final terminate shows <code>running → shutting-down</code>, and your billing notes match the table above.</p>
${giai('Hint: commands', bash(`
aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 --query Parameter.Value --output text
ssh-keygen -t ed25519 -N '' -C labflow -f labflow
aws ec2 import-key-pair --key-name labflow --public-key-material fileb://labflow.pub
aws ec2 run-instances --image-id $AMI --instance-type t3.micro --key-name labflow \\
  --metadata-options HttpTokens=required \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=labflow-1}]'
aws ec2 modify-instance-attribute --instance-id $I --disable-api-termination
aws ec2 terminate-instances --instance-ids $I          # must fail
aws ec2 modify-instance-attribute --instance-id $I --no-disable-api-termination`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EC2 instance</span><span class="v">A virtual machine billed per second while running.</span></div>
  <div class="kv"><span class="k">Instance type</span><span class="v">Size and family: family + generation + attributes + size, e.g. m7g.large.</span></div>
  <div class="kv"><span class="k">AMI</span><span class="v">Amazon Machine Image: the disk image a machine boots from; region-specific ID.</span></div>
  <div class="kv"><span class="k">Key pair</span><span class="v">SSH public key stored by AWS and written to authorized_keys at first boot.</span></div>
  <div class="kv"><span class="k">Burstable (t)</span><span class="v">Low baseline CPU plus credits; unlimited mode bills extra credits.</span></div>
  <div class="kv"><span class="k">Termination protection</span><span class="v">disableApiTermination: blocks terminate until switched off.</span></div>
  <div class="kv"><span class="k">Graviton</span><span class="v">AWS's ARM processors; the “g” in t4g, m7g, c7g.</span></div>
  <div class="kv"><span class="k">Shared responsibility</span><span class="v">AWS secures the cloud; you secure what you run in it — OS, ports, keys.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>EC2 is a VPS with a catalogue, an image system and per-second billing.</li>
  <li>Read instance names as family · generation · attributes · size.</li>
  <li>Take the AMI ID from the SSM public parameter; make SSH keys yourself and import the public half.</li>
  <li>Stopped machines still pay for disks; terminated machines may leave disks behind.</li>
  <li>The OS, ports and keys are your responsibility — open 22 to no one if you can.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html', '🔄', 'AWS docs — Instance state changes', 'Every state, what is billed, what happens to IPs and disks.')}
${tl('https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html', '🏷️', 'AWS docs — Instance type naming conventions', 'Families, generations and attribute letters.')}

<h3>Sources</h3>
<ul>
  <li>Instance state changes: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html</a></li>
  <li>Instance type names: <a href="https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html" target="_blank" rel="noopener">docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html</a></li>
  <li>Burstable performance instances: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html</a></li>
  <li>Public AMI parameters in Parameter Store: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html</a></li>
  <li>Key pairs: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html</a></li>
  <li>Terminate instances: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html</a></li>
  <li>Per-second billing, 60-second minimum: <a href="https://aws.amazon.com/ec2/pricing/on-demand/" target="_blank" rel="noopener">aws.amazon.com/ec2/pricing/on-demand/</a></li>
</ul>
</div>
`;

const L41_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 1</span>
<h2>4.1 — Tạo và kết nối EC2: một VPS thuê theo từng giây</h2>
<p class="lead">EC2 (Elastic Compute Cloud) là dịch vụ cho thuê máy ảo. Nếu bạn từng thuê VPS thì bạn đã biết 80%: một máy Linux có CPU, RAM, ổ đĩa và IP, vào bằng SSH. 20% còn lại làm nên chữ “cloud”: chọn cỡ máy trong danh mục hàng trăm loại, trả tiền <strong>theo giây</strong> thay vì theo tháng, vứt máy đi rồi có ngay một máy giống hệt từ ảnh trong một phút, và mọi thiết lập là một lời gọi API mà script (hay Terraform, Chương 11) lặp lại được. Bài này dựng trọn một máy — danh mục, ảnh, khoá, tường lửa, khởi chạy, các trạng thái — rồi SSH thật vào nó, kèm hai lỗi ai cũng gặp ngày đầu.</p>

<h3>Hình dung: khách sạn</h3>
<p>Coi EC2 như một khách sạn. <strong>Instance type</strong> là hạng phòng (đơn, suite, penthouse). <strong>AMI</strong> là căn phòng đã dọn sẵn trước khi bạn đến — đồ đạc, khăn tắm đủ cả. <strong>Key pair</strong> là thẻ phòng; khách sạn chỉ giữ ổ khoá, không bao giờ giữ bản sao thẻ của bạn. <strong>Security group</strong> (bài 3.3) là lễ tân quyết định ai được lên tới cửa phòng. <strong>Stop</strong> là đi vắng cuối tuần, khách sạn giữ hành lý (ổ đĩa) — bạn vẫn trả tiền kho. <strong>Terminate</strong> là trả phòng hẳn.</p>

<h3>Đọc tên loại máy</h3>
<p><code>m7g.large</code> đọc là: họ <strong>m</strong> (đa dụng), thế hệ <strong>7</strong>, thuộc tính <strong>g</strong> (AWS Graviton, ARM), cỡ <strong>large</strong>. Các họ bạn gặp đầu tiên:</p>
<table>
  <thead><tr><th>Họ</th><th>Làm cho</th><th>Dùng lần đầu thường gặp</th></tr></thead>
  <tbody>
    <tr><td><strong>t</strong> (t3, t4g)</td><td>Bùng nổ: CPU nền thấp cộng “tín dụng” để chạy nhanh từng lúc</td><td>Máy dev, API nhỏ, Free Tier</td></tr>
    <tr><td><strong>m</strong></td><td>CPU và RAM cân đối (1 vCPU : 4 GiB)</td><td>Phần lớn máy web/API production</td></tr>
    <tr><td><strong>c</strong></td><td>Nhiều CPU hơn trên mỗi GiB (1 : 2)</td><td>Mã hoá video, việc nặng CPU</td></tr>
    <tr><td><strong>r</strong></td><td>Nhiều RAM hơn trên mỗi vCPU (1 : 8)</td><td>Bộ đệm, phân tích trong bộ nhớ, JVM lớn</td></tr>
    <tr><td><strong>g / p</strong></td><td>GPU NVIDIA</td><td>Học máy, dựng hình (bài 4.6)</td></tr>
  </tbody>
</table>
<p>Chữ sau số thế hệ: <strong>g</strong> = Graviton (ARM), <strong>i</strong> = Intel, <strong>a</strong> = AMD, <strong>d</strong> = có ổ NVMe gắn liền (instance store, bài 4.3), <strong>n</strong> = băng thông mạng lớn hơn. Một bẫy của họ <strong>t</strong>: khi hết tín dụng CPU, t3/t4g ở chế độ mặc định <em>unlimited</em> vẫn chạy nhanh và tính thêm tiền phần tín dụng vượt — một t3.micro chạy bận liên tục không còn là máy vài đô.</p>

<h3>Xem chạy thật: danh mục, ảnh, khoá, tường lửa, khởi chạy</h3>
<p>Mọi thứ dưới đây chạy thật ngày 19/11/2026 trên LocalStack 4.12 (API EC2, không phải máy ảo thật). Đọc từ trên xuống — đó cũng là thứ tự bạn làm trên tài khoản thật.</p>
${OUT_41_EC2_A}
<ul>
  <li><strong>Đừng bao giờ viết cứng ID của AMI.</strong> ID khác nhau theo region và đổi mỗi lần Amazon ra ảnh vá lỗi. Tham số SSM công khai <code>/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64</code> luôn trỏ tới ảnh Amazon Linux 2023 mới nhất ở region của bạn — script và Terraform nên đọc nó.</li>
  <li><strong>Tự sinh khoá, chỉ tải lên nửa công khai.</strong> <code>ssh-keygen -t ed25519</code> trên máy bạn, rồi <code>import-key-pair</code>. Khoá riêng không rời máy bạn; AWS chỉ giữ khoá công khai và in dấu vân tay của nó. (<code>create-key-pair</code> cũng được, nhưng khi đó khoá riêng đi qua phản hồi API và nằm trong lịch sử terminal.)</li>
  <li>Security group chỉ mở <strong>22 cho đúng một địa chỉ</strong> (<code>203.0.113.10/32</code> là địa chỉ chỗ giữ dành cho tài liệu — hãy dùng IP của bạn). Tốt hơn nữa: không mở 22 cho ai và dùng Session Manager (bài 3.6).</li>
  <li><code>--metadata-options HttpTokens=required</code> bật IMDSv2 ngay từ giây đầu. Bài 4.4 cho thấy vụ rò rỉ mà dòng này ngăn được.</li>
  <li><strong>Chống xoá</strong> (<code>disableApiTermination</code>) biến một lệnh terminate nhầm thành lỗi <code>OperationNotPermitted</code>. Bật cho máy nào mất là bạn khóc; muốn terminate thật thì phải tắt nó trước.</li>
</ul>

<h3>Vòng đời một máy — và trạng thái nào tốn tiền</h3>
<table>
  <thead><tr><th>Trạng thái</th><th>Tính tiền máy?</th><th>Tính tiền ổ (EBS)?</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>pending → running</td><td>Có, theo giây (tối thiểu 60 giây)</td><td>Có</td><td>Bắt đầu tính khi tới running</td></tr>
    <tr><td>stopping → stopped</td><td>Không</td><td><strong>Có</strong></td><td>Mất RAM; IPv4 công khai tự cấp bị thu lại — start lại nhận IP mới</td></tr>
    <tr><td>start lại</td><td>Có</td><td>Có</td><td>Thường chạy trên phần cứng vật lý khác</td></tr>
    <tr><td>shutting-down → terminated</td><td>Không</td><td>Ổ gốc mặc định bị xoá; ổ gắn thêm có thể còn lại (bài 4.3)</td><td>Còn hiện là <code>terminated</code> một lúc rồi biến mất</td></tr>
  </tbody>
</table>
<p>Thói quen cần tập: máy đã stop <em>không</em> miễn phí, máy đã terminate có thể để lại ổ đĩa. Bài 4.7 kết thúc bằng một script liệt kê cả hai.</p>

<h3>Xem chạy thật: SSH thật và hai lỗi kinh điển</h3>
<p>Để cảm nhận SSH thật, hai container đóng vai: <code>may</code> là máy EC2 chạy <code>sshd</code>, khoá công khai nằm trong <code>/home/ec2-user/.ssh/authorized_keys</code> (đúng chỗ EC2 đặt khoá bạn chọn), <code>laptop</code> là bạn.</p>
${OUT_41_EC2_B}
<ol>
  <li><strong>Đúng khoá thì vào được</strong>: lần đầu in cảnh báo khoá máy chủ và ghi máy vào <code>known_hosts</code>. Tên người dùng là <code>ec2-user</code> trên Amazon Linux, <code>ubuntu</code> trên AMI Ubuntu — đúng khoá mà vẫn “Permission denied” thì rất thường chỉ là sai tên người dùng.</li>
  <li><strong>Khoá khác</strong>: <code>Permission denied (publickey)</code>. Nhật ký của máy chủ ghi lại lần thử hỏng. Mất khoá riêng thì không lấy lại được — bạn gắn khoá mới qua EC2 Instance Connect hoặc Session Manager.</li>
  <li><strong>Đúng khoá nhưng quyền tệp lỏng</strong>: OpenSSH từ chối dùng khoá riêng mà người khác đọc được (<code>-rw-r--r--</code>) và in <code>UNPROTECTED PRIVATE KEY FILE</code>. Sửa bằng <code>chmod 600</code>.</li>
</ol>

<h3>🔓 Góc hacker: cái máy là của bạn phải giữ</h3>
<p>Theo <strong>mô hình trách nhiệm chung</strong>, AWS bảo vệ phần cứng và hypervisor; mọi thứ bên trong hệ điều hành là việc của bạn — bản vá, cổng mở, người dùng, khoá. Ở bài 3.3 bạn đã thấy bẫy mồi của Unit 42 bị dò chỉ vài phút sau khi xuất hiện trên Internet. Một máy EC2 mở 22 cho <code>0.0.0.0/0</code> nằm trong danh sách đó từ phút đầu tiên. Phòng nhiều lớp: không mở 22 ra Internet (dùng Session Manager), security group ghi rõ nguồn, IMDSv2 bắt buộc, dùng role cho máy thay vì khoá truy cập nằm trên đĩa, và <code>dnf upgrade</code> (hoặc AMI mới) theo lịch.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>VPS của bạn so với EC2:</strong> VPS là giá tháng cố định cho một máy cố định mà bạn chăm như thú cưng. EC2 tính theo giây, nên máy chạy hai giờ một ngày thì trả hai giờ. Các nhóm coi máy EC2 như <em>đàn gia súc</em>: máy nào trục trặc thì terminate rồi dựng máy mới từ cùng ảnh và cùng user data (bài sau).</li>
  <li><strong>Đi làm:</strong> ngày đầu bạn hiếm khi bấm “Launch instance”. Bạn sẽ đọc một launch template hay tệp Terraform người khác viết. Đọc được <code>m7g.large</code>, tham số AMI và <code>HttpTokens=required</code> trong tệp đó mới là kỹ năng thật.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Stop và terminate một instance khác nhau thế nào?”</strong> — Stop giữ ổ gốc EBS (vẫn tính tiền) và cho start lại, thường trên phần cứng mới với IP công khai mới; terminate xoá instance và mặc định xoá luôn ổ gốc.</li>
  <li><strong>“Chọn giữa t3, m7g và c7g thế nào?”</strong> — t cho tải thấp có lúc vọt (để ý tín dụng), m cho máy web production cân đối, c khi CPU là nút thắt; chữ “g” là Graviton ARM, rẻ hơn nếu phần mềm của bạn chạy được trên ARM.</li>
  <li><strong>“Bạn mất khoá riêng của một máy đang chạy. Làm gì?”</strong> — Không tải lại được. Vào bằng Session Manager hoặc EC2 Instance Connect rồi thêm khoá công khai mới vào <code>authorized_keys</code>, hoặc stop máy và sửa khoá từ một máy cứu hộ.</li>
  <li><strong>“Sao không viết cứng ID AMI?”</strong> — ID khác nhau theo region và đổi theo mỗi bản vá; đọc tham số SSM công khai để máy mới luôn khởi động từ ảnh đã vá.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Bật LocalStack (bài 0.4). Tra AMI Amazon Linux 2023 mới nhất qua tham số SSM, cho cả <code>x86_64</code> và <code>arm64</code>.</li>
  <li>Sinh khoá ed25519, import nửa công khai với tên <code>labflow</code>, so dấu vân tay AWS in ra với <code>ssh-keygen -lf</code>.</li>
  <li>Khởi chạy t3.micro có IMDSv2 bắt buộc và thẻ <code>Name=labflow-1</code>. Bật chống xoá và chứng minh terminate thất bại. Rồi stop, start, tắt chống xoá và terminate.</li>
  <li>Ghi lại: ở mỗi trạng thái bạn thấy, máy và ổ có bị tính tiền không.</li>
</ol>
<p><strong>Đạt khi:</strong> terminate lúc đang chống xoá báo <code>OperationNotPermitted</code>, terminate cuối cùng ra <code>running → shutting-down</code>, và ghi chú tính tiền của bạn khớp bảng ở trên.</p>
${giai('Gợi ý: các lệnh', bash(`
aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 --query Parameter.Value --output text
ssh-keygen -t ed25519 -N '' -C labflow -f labflow
aws ec2 import-key-pair --key-name labflow --public-key-material fileb://labflow.pub
aws ec2 run-instances --image-id $AMI --instance-type t3.micro --key-name labflow \\
  --metadata-options HttpTokens=required \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=labflow-1}]'
aws ec2 modify-instance-attribute --instance-id $I --disable-api-termination
aws ec2 terminate-instances --instance-ids $I          # phải lỗi
aws ec2 modify-instance-attribute --instance-id $I --no-disable-api-termination`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EC2 instance</span><span class="v">Máy ảo tính tiền theo giây khi đang chạy.</span></div>
  <div class="kv"><span class="k">Instance type</span><span class="v">Họ và cỡ máy: họ + thế hệ + thuộc tính + cỡ, ví dụ m7g.large.</span></div>
  <div class="kv"><span class="k">AMI</span><span class="v">Amazon Machine Image: ảnh đĩa để máy khởi động; ID riêng theo region.</span></div>
  <div class="kv"><span class="k">Key pair</span><span class="v">Khoá SSH công khai AWS giữ và ghi vào authorized_keys lúc máy lên lần đầu.</span></div>
  <div class="kv"><span class="k">Burstable (t)</span><span class="v">CPU nền thấp cộng tín dụng; chế độ unlimited tính thêm tiền tín dụng vượt.</span></div>
  <div class="kv"><span class="k">Chống xoá</span><span class="v">disableApiTermination: chặn terminate cho tới khi tắt nó.</span></div>
  <div class="kv"><span class="k">Graviton</span><span class="v">Bộ xử lý ARM của AWS; chữ “g” trong t4g, m7g, c7g.</span></div>
  <div class="kv"><span class="k">Trách nhiệm chung</span><span class="v">AWS giữ an toàn cho cloud; bạn giữ an toàn cho thứ chạy trong đó — hệ điều hành, cổng, khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>EC2 là một VPS có danh mục máy, hệ thống ảnh và tính tiền theo giây.</li>
  <li>Đọc tên máy theo họ · thế hệ · thuộc tính · cỡ.</li>
  <li>Lấy ID AMI từ tham số SSM công khai; tự sinh khoá SSH và chỉ import nửa công khai.</li>
  <li>Máy đã stop vẫn trả tiền ổ; máy đã terminate có thể để lại ổ.</li>
  <li>Hệ điều hành, cổng và khoá là việc của bạn — được thì đừng mở 22 cho ai cả.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html', '🔄', 'Tài liệu AWS — Các trạng thái của instance', 'Từng trạng thái, cái gì bị tính tiền, IP và ổ đĩa ra sao.')}
${tl('https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html', '🏷️', 'Tài liệu AWS — Quy ước đặt tên loại máy', 'Họ, thế hệ và các chữ thuộc tính.')}

<h3>Nguồn</h3>
<ul>
  <li>Các trạng thái instance: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html</a></li>
  <li>Tên loại máy: <a href="https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html" target="_blank" rel="noopener">docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html</a></li>
  <li>Máy bùng nổ (burstable): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html</a></li>
  <li>Tham số AMI công khai trong Parameter Store: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html</a></li>
  <li>Key pair: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html</a></li>
  <li>Terminate instance: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html</a></li>
  <li>Tính theo giây, tối thiểu 60 giây: <a href="https://aws.amazon.com/ec2/pricing/on-demand/" target="_blank" rel="noopener">aws.amazon.com/ec2/pricing/on-demand/</a></li>
</ul>
</div>
`;

/* ═════ 4.2 — User data ═════ */
const L42_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 2</span>
<h2>4.2 — Bootstrapping with user data: from a blank image to a running API</h2>
<p class="lead">A fresh Amazon Linux machine knows nothing about your project. On a VPS you would SSH in and type the setup by hand — once, and then hope you remember it next time. On EC2 you hand the machine a script at launch, called <strong>user data</strong>, and a program called <strong>cloud-init</strong> runs it as root on the first boot. Same script, any number of identical machines, no SSH at all. This lesson runs real cloud-init on a real script that installs Node.js and starts a LabFlow health API — then breaks it on purpose so you learn where the evidence is.</p>

<h3>The picture: the note for the new caretaker</h3>
<p>You hire a caretaker for a new flat and leave a note on the table: “install the water filter, put the plants on the balcony, start the fridge”. The caretaker does it on day one and never again, even if they come back every morning. User data is that note; cloud-init is the caretaker; the <strong>instance ID</strong> is how cloud-init knows whether this is day one.</p>

<h3>How it works</h3>
<ul>
  <li>You pass up to <strong>16 KB</strong> (before base64) with <code>--user-data</code>. EC2 stores it as an instance attribute and serves it to the machine through the metadata service at <code>/latest/user-data</code>.</li>
  <li>On boot, cloud-init reads it. A text starting with <code>#!</code> is run as a script; one starting with <code>#cloud-config</code> is YAML that cloud-init's modules apply (packages, users, files).</li>
  <li>It runs <strong>once per instance</strong>, as <strong>root</strong>, with no terminal. Output goes to <code>/var/log/cloud-init-output.log</code>.</li>
  <li>It runs <em>during</em> boot: the machine shows “running” in the console before your script has finished. A health check, not the instance state, tells you the app is up.</li>
</ul>

<h3>The script</h3>
${MA_UD}
<ul>
  <li><code>set -euxo pipefail</code>: stop at the first error (<code>-e</code>), treat unset variables as errors (<code>-u</code>), print every command (<code>-x</code>) so the log shows exactly where it stopped.</li>
  <li><code>dnf install -y nodejs</code> on Amazon Linux 2023; the lab container is Alpine, hence the <code>apk</code> branch. Same script, two worlds.</li>
  <li><code>nohup … &amp;</code> keeps the demo short. On a real machine write a <strong>systemd unit</strong> instead, so the API restarts after a crash or a reboot — user data will not run again to start it.</li>
</ul>

<h3>See it running: three machines, real cloud-init 26.1</h3>
<p>Each container gets its own NoCloud seed (the same user data plus an instance ID) and runs cloud-init's four boot stages, exactly as an EC2 machine does at first boot.</p>
${OUT_42_USERDATA}
<ol>
  <li><strong>Machine 1:</strong> <code>status: done</code>, the log shows each <code>+</code> command, and <code>/health</code> answers. The API was never touched by hand.</li>
  <li><strong>Reboot machine 1:</strong> cloud-init runs again but the boot log still has 2 lines — the script did <em>not</em> run a second time, because <code>/var/lib/cloud/instances/</code> already holds this instance ID.</li>
  <li><strong>Machine 2</strong> from the same image with a new instance ID runs the script again. That is why one launch template can create a hundred identical servers.</li>
  <li><strong>Machine 3</strong> has a typo (<code>nodejss</code>). The machine is “running”, yet nothing listens on 3000. <code>cloud-init status --long</code> says <code>error</code> in <code>scripts_user</code>, and the output log shows the exact line. (The <code>render networking</code> error appears only because a container has no network renderer — an EC2 machine does not print it.)</li>
  <li><strong>From the API side</strong>, user data is readable back (base64) by anyone with <code>ec2:DescribeInstanceAttribute</code>. A <strong>launch template</strong> stores image, type, IMDS settings and user data under a version number; Auto Scaling (Chapter 5) launches from it.</li>
</ol>
<p><strong>LocalStack differences seen here:</strong> launching from the template returned <code>m1.small</code> / <code>optional</code> — LocalStack 4.12 ignores the template data, and it did not copy <code>--source-version 1</code> into version 2. On AWS, version 2 inherits IMDS <code>required</code> from version 1 and the launch gives <code>t4g.small</code>.</p>

<h3>Debugging checklist when “the machine is up but the app is not”</h3>
<ol>
  <li><code>cloud-init status --long</code> — <code>running</code>, <code>done</code> or <code>error</code>, and which module failed.</li>
  <li><code>sudo tail -50 /var/log/cloud-init-output.log</code> — with <code>set -x</code>, the last <code>+</code> line is where it died.</li>
  <li>Remember the context: root, no <code>HOME</code>-based config, and the network may still be settling when the script starts.</li>
  <li>No SSH? <code>aws ec2 get-console-output --instance-id …</code> shows the boot console, cloud-init lines included.</li>
</ol>

<h3>Bake or bootstrap?</h3>
<table>
  <thead><tr><th></th><th>Bootstrap with user data</th><th>Bake a custom AMI (EC2 Image Builder, Packer)</th></tr></thead>
  <tbody>
    <tr><td>Boot time</td><td>Slower — installs on every new machine</td><td>Fast — software already on the disk</td></tr>
    <tr><td>Change</td><td>Edit a script, new template version</td><td>Rebuild and test an image</td></tr>
    <tr><td>Fits</td><td>Small apps, labs, the last 10% of config</td><td>Auto Scaling that must add capacity in seconds</td></tr>
  </tbody>
</table>
<p>Most teams do both: bake the heavy, slow-changing parts into an image, and let user data do the last few lines (pull the current release, write the environment).</p>

<h3>🔓 Hacker's view: user data is not a safe</h3>
<p>Because user data is “just a setup script”, people paste database passwords and API keys into it. Anyone who can call <code>DescribeInstanceAttribute</code> can read it back, and any process on the machine can read it from the metadata service. Attackers automate this: the open-source AWS exploitation framework <strong>Pacu</strong> (Rhino Security Labs) ships a module, <code>ec2__download_userdata</code>, that downloads user data from every instance and launch template a stolen key can see. Defend: put secrets in Secrets Manager or Parameter Store (Chapter 6) and let the script fetch them through the instance role; restrict <code>ec2:DescribeInstanceAttribute</code>; require IMDSv2 (lesson 4.4).</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Your VPS:</strong> the setup you once typed by hand is exactly what user data replaces. Rebuilding the box becomes “launch a new one”, not an evening of remembering.</li>
  <li><strong>At work:</strong> the classic first incident ticket is “new instances in the Auto Scaling group are unhealthy”. Nine times out of ten the answer is in <code>cloud-init-output.log</code> of one of them.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“When does user data run, and as which user?”</strong> — Once per instance at first boot, as root, through cloud-init; output in <code>/var/log/cloud-init-output.log</code>.</li>
  <li><strong>“Your user data changed but the running machines did not. Why?”</strong> — It only runs at first boot of a new instance ID. Launch new instances (a new template version + instance refresh), do not expect a reboot to apply it.</li>
  <li><strong>“Where should the database password go?”</strong> — Not in user data. In Secrets Manager or Parameter Store, read at boot through the instance role.</li>
  <li><strong>“User data or a custom AMI?”</strong> — User data for small, frequently changing steps; a baked AMI when boot time matters, e.g. scaling out under load.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Build the lab image (<code>tao-anh.sh</code>) and write a NoCloud seed: <code>meta-data</code> with an instance ID, <code>user-data</code> = the script above.</li>
  <li>Run the four cloud-init stages in a container and curl <code>/health</code>.</li>
  <li>Change one letter to break the script, use a new instance ID, and find the failing line using only <code>cloud-init status --long</code> and the output log.</li>
  <li>Create a launch template with the script as base64 <code>UserData</code> and IMDSv2 required; add version 2 with <code>t4g.small</code>.</li>
</ol>
<p><strong>Done when:</strong> the good machine answers <code>{"ok":true,…}</code>, the broken one shows <code>status: error</code> with the exact bad command in the log, and <code>describe-launch-template-versions</code> lists two versions.</p>
${giai('Hint: commands', bash(`
mkdir seed && cp user-data.sh seed/user-data && printf 'instance-id: i-lab1\\n' > seed/meta-data
docker run -d --name aws-c4-ud -v $PWD/seed:/var/lib/cloud/seed/nocloud:ro aws-c4-may:1 sleep infinity
docker exec aws-c4-ud sh -c 'cloud-init init --local; cloud-init init; cloud-init modules --mode config; cloud-init modules --mode final'
docker exec aws-c4-ud sh -c 'cloud-init status --long; curl -s localhost:3000/health'
aws ec2 create-launch-template --launch-template-name labflow-api --launch-template-data file://lt.json`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">User data</span><span class="v">Up to 16 KB passed at launch; a script or cloud-config run at first boot.</span></div>
  <div class="kv"><span class="k">cloud-init</span><span class="v">The program in Linux images that applies user data and metadata at boot.</span></div>
  <div class="kv"><span class="k">#cloud-config</span><span class="v">YAML form of user data handled by cloud-init modules.</span></div>
  <div class="kv"><span class="k">cloud-init-output.log</span><span class="v">Where the script's stdout/stderr lands; first place to look.</span></div>
  <div class="kv"><span class="k">Launch template</span><span class="v">Versioned launch settings (AMI, type, IMDS, user data, disks, tags).</span></div>
  <div class="kv"><span class="k">Bake vs bootstrap</span><span class="v">Pre-install into an AMI vs install at boot with user data.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>User data + cloud-init turn a blank image into your server at first boot, as root, once per instance.</li>
  <li>“Running” is not “ready”: check <code>cloud-init status</code> and a health endpoint.</li>
  <li>Failures leave evidence in <code>cloud-init-output.log</code>; <code>set -x</code> makes it precise.</li>
  <li>Launch templates version the whole recipe; Auto Scaling uses them.</li>
  <li>Never put secrets in user data.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://cloudinit.readthedocs.io/en/latest/explanation/boot.html', '🚀', 'cloud-init docs — Boot stages', 'Local, network, config, final: what runs when.')}
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html', '📋', 'AWS docs — Launch templates', 'Versions, default vs latest, what a template can hold.')}

<h3>Sources</h3>
<ul>
  <li>User data (16 KB, base64, first boot): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html</a></li>
  <li>cloud-init boot stages: <a href="https://cloudinit.readthedocs.io/en/latest/explanation/boot.html" target="_blank" rel="noopener">cloudinit.readthedocs.io/en/latest/explanation/boot.html</a></li>
  <li>cloud-init modules: <a href="https://cloudinit.readthedocs.io/en/latest/reference/modules.html" target="_blank" rel="noopener">cloudinit.readthedocs.io/en/latest/reference/modules.html</a></li>
  <li>Launch templates: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html</a></li>
  <li>EC2 Image Builder: <a href="https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html" target="_blank" rel="noopener">docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html</a></li>
  <li>Pacu module ec2__download_userdata: <a href="https://raw.githubusercontent.com/RhinoSecurityLabs/pacu/master/pacu/modules/ec2__download_userdata/main.py" target="_blank" rel="noopener">github.com/RhinoSecurityLabs/pacu — modules/ec2__download_userdata</a></li>
</ul>
</div>
`;

const L42_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 2</span>
<h2>4.2 — Khởi tạo bằng user data: từ ảnh trống tới API đang chạy</h2>
<p class="lead">Một máy Amazon Linux mới tinh không biết gì về dự án của bạn. Với VPS, bạn SSH vào và gõ tay phần cài đặt — một lần, rồi mong lần sau còn nhớ. Với EC2, bạn đưa cho máy một script lúc khởi chạy, gọi là <strong>user data</strong>, và chương trình <strong>cloud-init</strong> chạy nó bằng root ở lần khởi động đầu tiên. Cùng một script, bao nhiêu máy giống hệt cũng được, không cần SSH. Bài này chạy cloud-init thật với một script thật cài Node.js và bật API kiểm sức khoẻ của LabFlow — rồi cố ý làm hỏng để bạn biết bằng chứng nằm ở đâu.</p>

<h3>Hình dung: tờ dặn người trông nhà mới</h3>
<p>Bạn thuê người trông căn hộ mới và để tờ giấy trên bàn: “lắp máy lọc nước, đưa cây ra ban công, bật tủ lạnh”. Người đó làm đúng ngày đầu và không làm lại, dù sáng nào cũng tới. User data là tờ giấy; cloud-init là người trông nhà; <strong>instance ID</strong> là cách cloud-init biết hôm nay có phải ngày đầu không.</p>

<h3>Cách nó chạy</h3>
<ul>
  <li>Bạn truyền tối đa <strong>16 KB</strong> (trước base64) bằng <code>--user-data</code>. EC2 lưu nó thành thuộc tính của máy và phục vụ cho máy qua dịch vụ metadata ở <code>/latest/user-data</code>.</li>
  <li>Lúc khởi động, cloud-init đọc nó. Văn bản bắt đầu bằng <code>#!</code> được chạy như script; bắt đầu bằng <code>#cloud-config</code> là YAML để các module của cloud-init áp dụng (gói, người dùng, tệp).</li>
  <li>Nó chạy <strong>một lần cho mỗi instance</strong>, bằng <strong>root</strong>, không có terminal. Output ghi vào <code>/var/log/cloud-init-output.log</code>.</li>
  <li>Nó chạy <em>trong lúc</em> khởi động: console đã báo “running” trong khi script của bạn chưa xong. Phải hỏi điểm kiểm sức khoẻ, không nhìn trạng thái máy, mới biết ứng dụng đã lên.</li>
</ul>

<h3>Script</h3>
${MA_UD}
<ul>
  <li><code>set -euxo pipefail</code>: dừng ở lỗi đầu tiên (<code>-e</code>), coi biến chưa đặt là lỗi (<code>-u</code>), in mọi lệnh (<code>-x</code>) để log chỉ đúng chỗ dừng.</li>
  <li><code>dnf install -y nodejs</code> trên Amazon Linux 2023; container lab là Alpine nên có nhánh <code>apk</code>. Cùng một script, hai thế giới.</li>
  <li><code>nohup … &amp;</code> cho demo ngắn gọn. Trên máy thật hãy viết <strong>unit systemd</strong>, để API tự bật lại sau khi sập hay sau reboot — user data sẽ không chạy lại để bật nó.</li>
</ul>

<h3>Xem chạy thật: ba máy, cloud-init 26.1 thật</h3>
<p>Mỗi container có nguồn NoCloud riêng (cùng user data, khác instance ID) và chạy đủ bốn giai đoạn khởi động của cloud-init, đúng như một máy EC2 ở lần khởi động đầu.</p>
${OUT_42_USERDATA}
<ol>
  <li><strong>Máy 1:</strong> <code>status: done</code>, log in từng lệnh có dấu <code>+</code>, và <code>/health</code> trả lời. Không ai chạm tay vào API.</li>
  <li><strong>Khởi động lại máy 1:</strong> cloud-init chạy lại nhưng log khởi động vẫn 2 dòng — script <em>không</em> chạy lần hai, vì <code>/var/lib/cloud/instances/</code> đã có instance ID này.</li>
  <li><strong>Máy 2</strong> từ cùng ảnh, instance ID mới thì script chạy lại. Nhờ vậy một launch template dựng được trăm máy giống nhau.</li>
  <li><strong>Máy 3</strong> gõ sai (<code>nodejss</code>). Máy vẫn “running” mà cổng 3000 không ai nghe. <code>cloud-init status --long</code> báo <code>error</code> ở <code>scripts_user</code>, log output chỉ đúng dòng hỏng. (Lỗi <code>render networking</code> chỉ có vì container không có bộ dựng mạng — máy EC2 không in dòng này.)</li>
  <li><strong>Từ phía API</strong>, ai có quyền <code>ec2:DescribeInstanceAttribute</code> đều đọc lại được user data (base64). <strong>Launch template</strong> lưu ảnh, loại máy, thiết lập IMDS và user data theo số phiên bản; Auto Scaling (Chương 5) dựng máy từ nó.</li>
</ol>
<p><strong>Chỗ LocalStack khác AWS thấy ở đây:</strong> dựng máy từ template ra <code>m1.small</code> / <code>optional</code> — LocalStack 4.12 lờ dữ liệu template, và không chép <code>--source-version 1</code> sang phiên bản 2. Trên AWS, phiên bản 2 thừa hưởng IMDS <code>required</code> của phiên bản 1 và máy dựng ra là <code>t4g.small</code>.</p>

<h3>Bảng kiểm khi “máy lên rồi mà ứng dụng chưa lên”</h3>
<ol>
  <li><code>cloud-init status --long</code> — <code>running</code>, <code>done</code> hay <code>error</code>, và module nào hỏng.</li>
  <li><code>sudo tail -50 /var/log/cloud-init-output.log</code> — có <code>set -x</code> thì dòng <code>+</code> cuối cùng là chỗ chết.</li>
  <li>Nhớ hoàn cảnh: chạy bằng root, không có cấu hình theo <code>HOME</code>, và mạng có thể chưa ổn khi script bắt đầu.</li>
  <li>Không SSH được? <code>aws ec2 get-console-output --instance-id …</code> cho xem console khởi động, có cả dòng của cloud-init.</li>
</ol>

<h3>Đóng sẵn vào ảnh hay cài lúc khởi động?</h3>
<table>
  <thead><tr><th></th><th>Cài lúc khởi động bằng user data</th><th>Đóng AMI riêng (EC2 Image Builder, Packer)</th></tr></thead>
  <tbody>
    <tr><td>Thời gian khởi động</td><td>Chậm hơn — máy mới nào cũng cài lại</td><td>Nhanh — phần mềm đã nằm trên đĩa</td></tr>
    <tr><td>Thay đổi</td><td>Sửa script, ra phiên bản template mới</td><td>Dựng lại và kiểm thử ảnh</td></tr>
    <tr><td>Hợp với</td><td>Ứng dụng nhỏ, lab, 10% cấu hình cuối</td><td>Auto Scaling phải thêm máy trong vài giây</td></tr>
  </tbody>
</table>
<p>Phần lớn các nhóm làm cả hai: đóng phần nặng, ít đổi vào ảnh; để user data làm vài dòng cuối (kéo bản phát hành hiện tại, ghi biến môi trường).</p>

<h3>🔓 Góc hacker: user data không phải két sắt</h3>
<p>Vì user data “chỉ là script cài đặt”, người ta hay dán mật khẩu cơ sở dữ liệu và khoá API vào đó. Ai gọi được <code>DescribeInstanceAttribute</code> đều đọc lại được, và tiến trình nào trên máy cũng đọc được qua dịch vụ metadata. Kẻ tấn công tự động hoá việc này: bộ công cụ khai thác AWS mã nguồn mở <strong>Pacu</strong> (Rhino Security Labs) có sẵn module <code>ec2__download_userdata</code>, tải user data của mọi instance và launch template mà chiếc khoá đánh cắp nhìn thấy. Cách phòng: để bí mật trong Secrets Manager hoặc Parameter Store (Chương 6) và cho script lấy qua role của máy; siết quyền <code>ec2:DescribeInstanceAttribute</code>; bắt IMDSv2 (bài 4.4).</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>VPS của bạn:</strong> phần cài đặt bạn từng gõ tay chính là thứ user data thay thế. Dựng lại máy trở thành “khởi chạy máy mới”, không phải một buổi tối ngồi nhớ lại.</li>
  <li><strong>Đi làm:</strong> phiếu sự cố kinh điển đầu tiên là “máy mới trong Auto Scaling group bị báo không khoẻ”. Chín trên mười lần, câu trả lời nằm trong <code>cloud-init-output.log</code> của một máy trong số đó.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“User data chạy khi nào, bằng người dùng nào?”</strong> — Một lần cho mỗi instance ở lần khởi động đầu, bằng root, qua cloud-init; output ở <code>/var/log/cloud-init-output.log</code>.</li>
  <li><strong>“Bạn sửa user data mà máy đang chạy không đổi gì. Vì sao?”</strong> — Nó chỉ chạy ở lần khởi động đầu của một instance ID mới. Phải dựng máy mới (phiên bản template mới + instance refresh), đừng chờ reboot áp dụng.</li>
  <li><strong>“Mật khẩu cơ sở dữ liệu để đâu?”</strong> — Không để trong user data. Để trong Secrets Manager hoặc Parameter Store, đọc lúc khởi động qua role của máy.</li>
  <li><strong>“User data hay AMI riêng?”</strong> — User data cho bước nhỏ, hay đổi; AMI đóng sẵn khi thời gian khởi động quan trọng, ví dụ thêm máy lúc tải tăng.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Dựng ảnh lab (<code>tao-anh.sh</code>) và viết nguồn NoCloud: <code>meta-data</code> có instance ID, <code>user-data</code> = script ở trên.</li>
  <li>Chạy bốn giai đoạn cloud-init trong container rồi curl <code>/health</code>.</li>
  <li>Sửa một chữ cho script hỏng, dùng instance ID mới, và tìm dòng hỏng chỉ bằng <code>cloud-init status --long</code> và log output.</li>
  <li>Tạo launch template có <code>UserData</code> là script dạng base64 và IMDSv2 bắt buộc; thêm phiên bản 2 với <code>t4g.small</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> máy tốt trả <code>{"ok":true,…}</code>, máy hỏng báo <code>status: error</code> và log có đúng lệnh sai, và <code>describe-launch-template-versions</code> liệt kê hai phiên bản.</p>
${giai('Gợi ý: các lệnh', bash(`
mkdir seed && cp user-data.sh seed/user-data && printf 'instance-id: i-lab1\\n' > seed/meta-data
docker run -d --name aws-c4-ud -v $PWD/seed:/var/lib/cloud/seed/nocloud:ro aws-c4-may:1 sleep infinity
docker exec aws-c4-ud sh -c 'cloud-init init --local; cloud-init init; cloud-init modules --mode config; cloud-init modules --mode final'
docker exec aws-c4-ud sh -c 'cloud-init status --long; curl -s localhost:3000/health'
aws ec2 create-launch-template --launch-template-name labflow-api --launch-template-data file://lt.json`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">User data</span><span class="v">Tối đa 16 KB truyền lúc khởi chạy; script hoặc cloud-config chạy ở lần khởi động đầu.</span></div>
  <div class="kv"><span class="k">cloud-init</span><span class="v">Chương trình trong ảnh Linux, áp dụng user data và metadata lúc khởi động.</span></div>
  <div class="kv"><span class="k">#cloud-config</span><span class="v">Dạng YAML của user data, do các module cloud-init xử lý.</span></div>
  <div class="kv"><span class="k">cloud-init-output.log</span><span class="v">Nơi ghi stdout/stderr của script; chỗ đầu tiên phải xem.</span></div>
  <div class="kv"><span class="k">Launch template</span><span class="v">Thiết lập khởi chạy có phiên bản (AMI, loại máy, IMDS, user data, ổ, thẻ).</span></div>
  <div class="kv"><span class="k">Đóng ảnh vs cài lúc khởi động</span><span class="v">Cài sẵn vào AMI vs cài lúc khởi động bằng user data.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>User data + cloud-init biến ảnh trống thành máy chủ của bạn ở lần khởi động đầu, bằng root, mỗi instance một lần.</li>
  <li>“Running” chưa phải “sẵn sàng”: xem <code>cloud-init status</code> và điểm kiểm sức khoẻ.</li>
  <li>Hỏng thì để lại bằng chứng trong <code>cloud-init-output.log</code>; <code>set -x</code> làm nó chính xác.</li>
  <li>Launch template đánh phiên bản cả công thức; Auto Scaling dùng nó.</li>
  <li>Đừng bao giờ để bí mật trong user data.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://cloudinit.readthedocs.io/en/latest/explanation/boot.html', '🚀', 'Tài liệu cloud-init — Các giai đoạn khởi động', 'Local, network, config, final: cái gì chạy lúc nào.')}
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html', '📋', 'Tài liệu AWS — Launch template', 'Phiên bản, default và latest, template chứa được những gì.')}

<h3>Nguồn</h3>
<ul>
  <li>User data (16 KB, base64, lần khởi động đầu): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html</a></li>
  <li>Các giai đoạn khởi động của cloud-init: <a href="https://cloudinit.readthedocs.io/en/latest/explanation/boot.html" target="_blank" rel="noopener">cloudinit.readthedocs.io/en/latest/explanation/boot.html</a></li>
  <li>Module của cloud-init: <a href="https://cloudinit.readthedocs.io/en/latest/reference/modules.html" target="_blank" rel="noopener">cloudinit.readthedocs.io/en/latest/reference/modules.html</a></li>
  <li>Launch template: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html</a></li>
  <li>EC2 Image Builder: <a href="https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html" target="_blank" rel="noopener">docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html</a></li>
  <li>Module Pacu ec2__download_userdata: <a href="https://raw.githubusercontent.com/RhinoSecurityLabs/pacu/master/pacu/modules/ec2__download_userdata/main.py" target="_blank" rel="noopener">github.com/RhinoSecurityLabs/pacu — modules/ec2__download_userdata</a></li>
</ul>
</div>
`;

/* ═════ 4.3 — EBS, snapshot, instance store ═════ */
const L43_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 3</span>
<h2>4.3 — EBS volumes, snapshots and instance store: which disk survives what</h2>
<p class="lead">On your VPS the disk and the machine are one thing: the box dies, the data dies with it unless you had a backup. On EC2 they are separate products. An <strong>EBS volume</strong> is a network disk that lives on its own, in one Availability Zone, and can be detached from one machine and attached to another. An <strong>instance store</strong> is a fast disk physically inside the host that disappears when the machine stops. A <strong>snapshot</strong> is an incremental backup of an EBS volume kept in S3. This lesson shows, with real output, which of them survives a stop, a terminate and a rebuild — and why a forgotten volume keeps billing you.</p>

<h3>The picture: suitcase, hotel minibar, and the photo album</h3>
<p>EBS is your <strong>suitcase</strong>: you carry it from room to room (machine to machine), but only within the same building (AZ). Instance store is the <strong>minibar</strong>: fast and right there, but emptied the moment you leave the room. A snapshot is a <strong>photo album</strong> of the suitcase's contents; each new page only adds the photos that changed.</p>

<h3>Volume types you will actually choose</h3>
<table>
  <thead><tr><th>Type</th><th>Performance</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td><strong>gp3</strong> (SSD)</td><td>3,000 IOPS and 125 MiB/s included at any size; buy more up to 80,000 IOPS and 2,000 MiB/s</td><td>Default for almost everything: root disks, small databases</td></tr>
    <tr><td>gp2 (older SSD)</td><td>IOPS grow with size (3 per GiB), burst credits</td><td>Legacy — migrate to gp3, usually cheaper</td></tr>
    <tr><td><strong>io2</strong> Block Express</td><td>Provisioned IOPS up to 256,000, sub-millisecond latency</td><td>Large I/O-bound databases that need guaranteed IOPS</td></tr>
    <tr><td>st1 / sc1 (HDD)</td><td>Throughput, not IOPS</td><td>Big sequential data, logs, cold data</td></tr>
  </tbody>
</table>
<p>Price in Singapore (11/2026): gp3 <strong>$0.096 per GB-month</strong>, snapshots <strong>$0.05 per GB-month</strong>. A 20 GB gp3 disk is about $1.92 a month whether the machine runs or not.</p>

<h3>See it running: volumes on the API</h3>
${OUT_43_EBS_A}
<ul>
  <li>gp3 shows its free baseline of 3000 IOPS; io2 shows exactly the 6000 we paid for.</li>
  <li>The volume is attached to a machine in the <strong>same AZ</strong> (<code>ap-southeast-1a</code>). To move data to another AZ you snapshot it and create a new volume from the snapshot there.</li>
  <li>After <code>terminate</code>, the extra volume is <strong>available</strong> — not deleted. Root volumes are deleted on termination by default; volumes you attach later default to <code>DeleteOnTermination=false</code>. The last command is the one to run every month: every <code>available</code> volume is money for nothing.</li>
</ul>

<h3>See it running: what survives a restart and a terminate</h3>
<p>Docker gives a faithful small-scale copy: a named volume behaves like EBS (it outlives the container), <code>tmpfs</code> behaves like instance store (gone on restart), and one volume mounted into two containers behaves like <strong>EFS</strong>, the network file system many machines can share.</p>
${OUT_43_EBS_B}
<ul>
  <li>After the restart, <code>/data/db.txt</code> is still there; <code>/scratch</code> is empty (0 files). Put caches and temporary files on instance store, never the only copy of anything.</li>
  <li>After removing the “machine” completely, a new one mounts the same volume and finds <code>booking 42</code>. That is the EBS promise.</li>
  <li>EBS attaches to one machine at a time (Multi-Attach exists only for io1/io2 and needs a cluster-aware file system). Files that several machines must see — user uploads on a shared server — go to <strong>EFS</strong>, or better, to S3 (Chapter 2).</li>
</ul>

<h3>See it running: why snapshots are cheap</h3>
<p>The first snapshot copies every block written to the volume; later ones store only blocks that changed. Deleting an old snapshot does not break newer ones, because AWS keeps any block a remaining snapshot still needs. This simulation splits a 64 MiB disk into 1 MiB blocks:</p>
${OUT_43_EBS_C}
<p>Change 3 blocks ⇒ the next snapshot costs 3 blocks. Change nothing ⇒ 0. Delete <code>snap-1</code> ⇒ <code>snap-2</code> still restores all 64 blocks. That is why a daily snapshot schedule (Amazon Data Lifecycle Manager or AWS Backup) costs far less than “64 MiB per day”.</p>

<h3>Encryption, resizing and restoring</h3>
<ul>
  <li><strong>Encrypt by default.</strong> <code>aws ec2 enable-ebs-encryption-by-default</code> makes every new volume and snapshot in that region encrypted with KMS, at no extra charge and with no measurable performance cost. The lab in 4.7 checks this.</li>
  <li><strong>Grow without downtime.</strong> <code>modify-volume</code> raises size, IOPS or throughput on a live volume; then grow the partition and file system inside Linux (<code>growpart</code>, <code>xfs_growfs</code>). You cannot shrink.</li>
  <li><strong>Restore</strong> = create a new volume from a snapshot (in any AZ of the region), attach it, mount it. Blocks load lazily on first read, so the first pass is slower.</li>
</ul>

<h3>🔓 Hacker's view: public snapshots</h3>
<p>A snapshot can be shared with another account — or made <strong>public</strong>, readable by every AWS customer. At <strong>DEF CON 2019</strong>, Ben Morris of Bishop Fox presented research on public EBS snapshots: he found application keys, administrator credentials, source code and VPN configurations in snapshots left public by companies including healthcare and tech firms, and estimated up to 1,250 exposures across all regions (TechCrunch, 09/08/2019). A disk image is worse than a leaked bucket: it holds the whole machine — config files, SSH host keys, database files. Defend: enable <strong>block public access for snapshots</strong> in every region you use, encrypt by default (encrypted snapshots cannot be made public), and review shared snapshots with <code>describe-snapshot-attribute</code>.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Your VPS:</strong> the Postgres data directory and uploaded files live on the VPS disk itself. On AWS you would separate them: database on RDS (Chapter 6) with automatic snapshots, uploads on S3 or R2, and the EC2 root disk holding nothing you cannot rebuild from user data.</li>
  <li><strong>At work:</strong> “why is the bill growing while traffic is flat?” — sort volumes by state. Old <code>available</code> volumes and years of manual snapshots are the classic answer.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“EBS vs instance store?”</strong> — EBS is network storage, persists independently of the instance, snapshot-able, one AZ. Instance store is local NVMe on the host: fastest, but lost on stop, hibernate or terminate.</li>
  <li><strong>“How do you move an EBS volume to another AZ?”</strong> — Snapshot it, then create a new volume from the snapshot in the target AZ (or copy the snapshot to another region first).</li>
  <li><strong>“gp2 or gp3?”</strong> — gp3: baseline 3,000 IOPS and 125 MiB/s regardless of size, performance bought separately, usually cheaper per GB.</li>
  <li><strong>“Are EBS snapshots full copies?”</strong> — The first is; later ones are incremental, and deleting an old one keeps blocks newer snapshots need.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>On LocalStack create a 20 GB gp3 volume and a 20 GB io2 volume with 6000 IOPS. Attach the gp3 one to a t3.micro in the same AZ and snapshot it.</li>
  <li>Terminate the machine and list volumes in state <code>available</code>. Delete them.</li>
  <li>With Docker, prove the difference between a named volume and <code>--tmpfs</code> across <code>docker restart</code>.</li>
  <li>Run <code>snap.py</code>, change it to modify 10 blocks, and predict the second snapshot's size before running.</li>
</ol>
<p><strong>Done when:</strong> the available-volume list ends empty, the tmpfs file is gone while the volume file stays, and your prediction for the modified <code>snap.py</code> is exactly “lưu MỚI 10 khối”.</p>
${giai('Hint: commands', bash(`
aws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type gp3
aws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type io2 --iops 6000
aws ec2 attach-volume --volume-id $V --instance-id $I --device /dev/sdf
aws ec2 create-snapshot --volume-id $V --description 'truoc khi nang cap'
aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[].VolumeId' --output text
docker run -d --name t --mount source=ebs,target=/data --tmpfs /scratch alpine sleep infinity`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">EBS volume</span><span class="v">Network block disk in one AZ; persists independently of the instance.</span></div>
  <div class="kv"><span class="k">gp3</span><span class="v">Default SSD: 3,000 IOPS + 125 MiB/s included; more bought separately.</span></div>
  <div class="kv"><span class="k">io2</span><span class="v">Provisioned-IOPS SSD for I/O-bound databases.</span></div>
  <div class="kv"><span class="k">Snapshot</span><span class="v">Incremental point-in-time backup of a volume, stored in S3, regional.</span></div>
  <div class="kv"><span class="k">Instance store</span><span class="v">Local disk on the host; lost on stop, hibernate, terminate.</span></div>
  <div class="kv"><span class="k">EFS</span><span class="v">Managed NFS file system many instances mount at once.</span></div>
  <div class="kv"><span class="k">DeleteOnTermination</span><span class="v">Per-volume flag; true for root by default, false for later attachments.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Machine and disk are separate: EBS outlives the instance, instance store does not.</li>
  <li>gp3 is the default; io2 when IOPS must be guaranteed.</li>
  <li>Snapshots are incremental and cheap; schedule them, and copy across AZ/region from them.</li>
  <li>Encrypt by default and block public snapshot sharing.</li>
  <li>Hunt <code>available</code> volumes and stale snapshots — they bill silently.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html', '💽', 'AWS docs — Amazon EBS volume types', 'Every type with sizes, IOPS and throughput limits.')}
${tl('https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html', '📸', 'AWS docs — How EBS snapshots work', 'Incremental blocks and what deletion keeps.')}

<h3>Sources</h3>
<ul>
  <li>Volume types: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html</a></li>
  <li>gp3 baseline 3,000 IOPS / 125 MiB/s: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html</a></li>
  <li>How snapshots work: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html</a></li>
  <li>Instance store: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html</a></li>
  <li>Modify a volume: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html</a></li>
  <li>Encryption by default: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html</a></li>
  <li>Block public access for snapshots: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/block-public-access-snapshots.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/block-public-access-snapshots.html</a></li>
  <li>Amazon EFS: <a href="https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html" target="_blank" rel="noopener">docs.aws.amazon.com/efs/latest/ug/whatisefs.html</a></li>
  <li>Public EBS snapshots at DEF CON 2019 (TechCrunch, 09/08/2019): <a href="https://techcrunch.com/2019/08/09/aws-ebs-cloud-backups-leak/" target="_blank" rel="noopener">techcrunch.com/2019/08/09/aws-ebs-cloud-backups-leak/</a></li>
  <li>Prices: AWS Price List API, ap-southeast-1, 11/2026 (EBS gp3 $0.096 per GB-month, snapshot $0.05 per GB-month).</li>
</ul>
</div>
`;

const L43_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 3</span>
<h2>4.3 — Ổ EBS, snapshot và instance store: ổ nào sống sót qua chuyện gì</h2>
<p class="lead">Trên VPS của bạn, ổ đĩa và máy là một: máy chết thì dữ liệu chết theo, trừ khi có bản sao lưu. Trên EC2 chúng là hai sản phẩm riêng. <strong>Ổ EBS</strong> là ổ đĩa qua mạng, sống độc lập, nằm trong một Availability Zone, tháo khỏi máy này gắn sang máy khác được. <strong>Instance store</strong> là ổ nhanh nằm ngay trong máy chủ vật lý, biến mất khi máy dừng. <strong>Snapshot</strong> là bản sao lưu tăng dần của ổ EBS, cất trong S3. Bài này cho thấy bằng output thật: ổ nào sống qua stop, qua terminate, qua dựng lại máy — và vì sao một ổ bị quên vẫn tính tiền bạn đều đều.</p>

<h3>Hình dung: va li, tủ lạnh mini và cuốn album</h3>
<p>EBS là <strong>va li</strong> của bạn: xách từ phòng này sang phòng khác (máy này sang máy khác), nhưng chỉ trong cùng một toà (AZ). Instance store là <strong>tủ lạnh mini</strong> trong phòng: nhanh, ngay tầm tay, nhưng bị dọn sạch khi bạn rời phòng. Snapshot là <strong>cuốn album</strong> chụp đồ trong va li; mỗi trang mới chỉ thêm những tấm ảnh đã thay đổi.</p>

<h3>Các loại ổ bạn thật sự sẽ chọn</h3>
<table>
  <thead><tr><th>Loại</th><th>Hiệu năng</th><th>Dùng cho</th></tr></thead>
  <tbody>
    <tr><td><strong>gp3</strong> (SSD)</td><td>Có sẵn 3.000 IOPS và 125 MiB/s ở mọi dung lượng; mua thêm tới 80.000 IOPS và 2.000 MiB/s</td><td>Mặc định cho gần như mọi thứ: ổ gốc, cơ sở dữ liệu nhỏ</td></tr>
    <tr><td>gp2 (SSD đời cũ)</td><td>IOPS tăng theo dung lượng (3 trên mỗi GiB), có tín dụng bùng nổ</td><td>Đời cũ — chuyển sang gp3, thường rẻ hơn</td></tr>
    <tr><td><strong>io2</strong> Block Express</td><td>IOPS đặt trước tới 256.000, độ trễ dưới một mili giây</td><td>Cơ sở dữ liệu lớn nặng I/O cần IOPS bảo đảm</td></tr>
    <tr><td>st1 / sc1 (HDD)</td><td>Thông lượng, không phải IOPS</td><td>Dữ liệu tuần tự lớn, log, dữ liệu lạnh</td></tr>
  </tbody>
</table>
<p>Giá ở Singapore (11/2026): gp3 <strong>0,096 USD mỗi GB-tháng</strong>, snapshot <strong>0,05 USD mỗi GB-tháng</strong>. Một ổ gp3 20 GB tốn khoảng 1,92 USD mỗi tháng, máy chạy hay không cũng vậy.</p>

<h3>Xem chạy thật: ổ đĩa trên API</h3>
${OUT_43_EBS_A}
<ul>
  <li>gp3 có sẵn mức nền 3000 IOPS miễn phí; io2 hiện đúng 6000 IOPS ta đã trả tiền.</li>
  <li>Ổ được gắn vào máy ở <strong>cùng AZ</strong> (<code>ap-southeast-1a</code>). Muốn đưa dữ liệu sang AZ khác thì chụp snapshot rồi tạo ổ mới từ snapshot ở bên đó.</li>
  <li>Sau <code>terminate</code>, ổ gắn thêm ở trạng thái <strong>available</strong> — không bị xoá. Ổ gốc mặc định bị xoá khi terminate; ổ gắn sau mặc định <code>DeleteOnTermination=false</code>. Lệnh cuối là lệnh nên chạy mỗi tháng: ổ <code>available</code> nào cũng là tiền mất không.</li>
</ul>

<h3>Xem chạy thật: cái gì sống qua khởi động lại và terminate</h3>
<p>Docker cho một bản thu nhỏ trung thực: volume có tên giống EBS (sống lâu hơn container), <code>tmpfs</code> giống instance store (mất khi khởi động lại), và một volume gắn vào hai container giống <strong>EFS</strong> — hệ tệp mạng nhiều máy dùng chung.</p>
${OUT_43_EBS_B}
<ul>
  <li>Sau khi khởi động lại, <code>/data/db.txt</code> vẫn còn; <code>/scratch</code> trống (0 tệp). Để bộ đệm và tệp tạm trên instance store, đừng bao giờ để bản duy nhất của thứ gì ở đó.</li>
  <li>Xoá hẳn “máy”, máy mới gắn cùng volume vẫn thấy <code>booking 42</code>. Đó là lời hứa của EBS.</li>
  <li>EBS mỗi lúc chỉ gắn vào một máy (Multi-Attach chỉ có ở io1/io2 và cần hệ tệp biết chạy cụm). Tệp mà nhiều máy cùng phải thấy — như ảnh người dùng tải lên trên một máy chủ chung — để ở <strong>EFS</strong>, hoặc tốt hơn là S3 (Chương 2).</li>
</ul>

<h3>Xem chạy thật: vì sao snapshot rẻ</h3>
<p>Snapshot đầu chép mọi khối đã ghi lên ổ; các lần sau chỉ lưu khối đã đổi. Xoá snapshot cũ không làm hỏng snapshot mới, vì AWS giữ mọi khối mà snapshot còn lại vẫn cần. Mô phỏng này chia ổ 64 MiB thành các khối 1 MiB:</p>
${OUT_43_EBS_C}
<p>Đổi 3 khối ⇒ snapshot sau tốn 3 khối. Không đổi gì ⇒ 0. Xoá <code>snap-1</code> ⇒ <code>snap-2</code> vẫn khôi phục đủ 64 khối. Vì thế lịch snapshot hằng ngày (Amazon Data Lifecycle Manager hoặc AWS Backup) rẻ hơn nhiều so với “64 MiB mỗi ngày”.</p>

<h3>Mã hoá, nới dung lượng và khôi phục</h3>
<ul>
  <li><strong>Mã hoá mặc định.</strong> <code>aws ec2 enable-ebs-encryption-by-default</code> khiến mọi ổ và snapshot mới trong region đó được mã hoá bằng KMS, không tốn thêm tiền và không chậm đi đáng kể. Lab 4.7 kiểm điều này.</li>
  <li><strong>Nới mà không dừng máy.</strong> <code>modify-volume</code> tăng dung lượng, IOPS hay thông lượng của ổ đang chạy; rồi nới phân vùng và hệ tệp trong Linux (<code>growpart</code>, <code>xfs_growfs</code>). Không thu nhỏ được.</li>
  <li><strong>Khôi phục</strong> = tạo ổ mới từ snapshot (ở AZ nào trong region cũng được), gắn vào, mount. Các khối được nạp dần khi đọc lần đầu nên lượt đọc đầu chậm hơn.</li>
</ul>

<h3>🔓 Góc hacker: snapshot công khai</h3>
<p>Snapshot có thể chia sẻ cho tài khoản khác — hoặc đặt <strong>public</strong>, mọi khách hàng AWS đều đọc được. Tại <strong>DEF CON 2019</strong>, Ben Morris của Bishop Fox trình bày nghiên cứu về snapshot EBS công khai: anh tìm thấy khoá ứng dụng, thông tin đăng nhập quản trị, mã nguồn và cấu hình VPN trong các snapshot bị để public của nhiều công ty, có cả cơ sở y tế và công ty công nghệ, và ước tính tới 1.250 trường hợp lộ trên mọi region (TechCrunch, 09/08/2019). Ảnh đĩa còn tệ hơn bucket bị lộ: nó chứa cả cái máy — tệp cấu hình, khoá máy chủ SSH, tệp cơ sở dữ liệu. Cách phòng: bật <strong>chặn truy cập công khai cho snapshot</strong> ở mọi region bạn dùng, mã hoá mặc định (snapshot mã hoá không đặt public được), và soát snapshot đã chia sẻ bằng <code>describe-snapshot-attribute</code>.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>VPS của bạn:</strong> thư mục dữ liệu Postgres và tệp người dùng tải lên nằm ngay trên ổ VPS. Lên AWS bạn sẽ tách ra: cơ sở dữ liệu lên RDS (Chương 6) có snapshot tự động, tệp tải lên vào S3 hay R2, và ổ gốc EC2 không giữ gì mà user data không dựng lại được.</li>
  <li><strong>Đi làm:</strong> “sao hoá đơn tăng mà lượng truy cập không đổi?” — lọc ổ theo trạng thái. Ổ <code>available</code> cũ và snapshot chụp tay nhiều năm là câu trả lời kinh điển.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“EBS khác instance store thế nào?”</strong> — EBS là lưu trữ qua mạng, sống độc lập với máy, chụp snapshot được, nằm trong một AZ. Instance store là NVMe gắn liền máy chủ: nhanh nhất nhưng mất khi stop, hibernate hay terminate.</li>
  <li><strong>“Chuyển một ổ EBS sang AZ khác thế nào?”</strong> — Chụp snapshot, rồi tạo ổ mới từ snapshot ở AZ đích (hoặc chép snapshot sang region khác trước).</li>
  <li><strong>“gp2 hay gp3?”</strong> — gp3: nền 3.000 IOPS và 125 MiB/s ở mọi dung lượng, hiệu năng mua riêng, thường rẻ hơn trên mỗi GB.</li>
  <li><strong>“Snapshot EBS có phải bản sao đầy đủ không?”</strong> — Bản đầu thì có; các bản sau tăng dần, và xoá bản cũ vẫn giữ những khối mà bản mới cần.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên LocalStack tạo một ổ gp3 20 GB và một ổ io2 20 GB 6000 IOPS. Gắn ổ gp3 vào một t3.micro cùng AZ rồi chụp snapshot.</li>
  <li>Terminate máy và liệt kê các ổ ở trạng thái <code>available</code>. Xoá chúng.</li>
  <li>Với Docker, chứng minh khác biệt giữa volume có tên và <code>--tmpfs</code> qua <code>docker restart</code>.</li>
  <li>Chạy <code>snap.py</code>, sửa cho nó đổi 10 khối, và đoán dung lượng snapshot thứ hai trước khi chạy.</li>
</ol>
<p><strong>Đạt khi:</strong> danh sách ổ available cuối cùng trống, tệp trong tmpfs mất còn tệp trong volume ở lại, và bạn đoán đúng “lưu MỚI 10 khối” cho <code>snap.py</code> đã sửa.</p>
${giai('Gợi ý: các lệnh', bash(`
aws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type gp3
aws ec2 create-volume --availability-zone ap-southeast-1a --size 20 --volume-type io2 --iops 6000
aws ec2 attach-volume --volume-id $V --instance-id $I --device /dev/sdf
aws ec2 create-snapshot --volume-id $V --description 'truoc khi nang cap'
aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[].VolumeId' --output text
docker run -d --name t --mount source=ebs,target=/data --tmpfs /scratch alpine sleep infinity`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ổ EBS</span><span class="v">Ổ khối qua mạng trong một AZ; sống độc lập với máy.</span></div>
  <div class="kv"><span class="k">gp3</span><span class="v">SSD mặc định: có sẵn 3.000 IOPS + 125 MiB/s; muốn hơn thì mua thêm.</span></div>
  <div class="kv"><span class="k">io2</span><span class="v">SSD đặt trước IOPS cho cơ sở dữ liệu nặng I/O.</span></div>
  <div class="kv"><span class="k">Snapshot</span><span class="v">Bản sao lưu tăng dần tại một thời điểm, cất trong S3, theo region.</span></div>
  <div class="kv"><span class="k">Instance store</span><span class="v">Ổ gắn liền máy chủ vật lý; mất khi stop, hibernate, terminate.</span></div>
  <div class="kv"><span class="k">EFS</span><span class="v">Hệ tệp NFS có quản lý, nhiều máy cùng gắn.</span></div>
  <div class="kv"><span class="k">DeleteOnTermination</span><span class="v">Cờ của từng ổ; mặc định true với ổ gốc, false với ổ gắn sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Máy và ổ tách rời: EBS sống lâu hơn máy, instance store thì không.</li>
  <li>gp3 là mặc định; io2 khi phải bảo đảm IOPS.</li>
  <li>Snapshot tăng dần và rẻ; đặt lịch, và chép sang AZ/region khác từ snapshot.</li>
  <li>Mã hoá mặc định và chặn chia sẻ snapshot công khai.</li>
  <li>Săn ổ <code>available</code> và snapshot cũ — chúng tính tiền lặng lẽ.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html', '💽', 'Tài liệu AWS — Các loại ổ Amazon EBS', 'Từng loại với giới hạn dung lượng, IOPS, thông lượng.')}
${tl('https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html', '📸', 'Tài liệu AWS — Snapshot EBS hoạt động thế nào', 'Khối tăng dần và cái gì được giữ khi xoá.')}

<h3>Nguồn</h3>
<ul>
  <li>Các loại ổ: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html</a></li>
  <li>gp3 nền 3.000 IOPS / 125 MiB/s: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html</a></li>
  <li>Snapshot hoạt động thế nào: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html</a></li>
  <li>Instance store: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html</a></li>
  <li>Sửa một ổ: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html</a></li>
  <li>Mã hoá mặc định: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html</a></li>
  <li>Chặn truy cập công khai cho snapshot: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/block-public-access-snapshots.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/block-public-access-snapshots.html</a></li>
  <li>Amazon EFS: <a href="https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html" target="_blank" rel="noopener">docs.aws.amazon.com/efs/latest/ug/whatisefs.html</a></li>
  <li>Snapshot EBS công khai tại DEF CON 2019 (TechCrunch, 09/08/2019): <a href="https://techcrunch.com/2019/08/09/aws-ebs-cloud-backups-leak/" target="_blank" rel="noopener">techcrunch.com/2019/08/09/aws-ebs-cloud-backups-leak/</a></li>
  <li>Giá: AWS Price List API, ap-southeast-1, 11/2026 (EBS gp3 0,096 USD mỗi GB-tháng, snapshot 0,05 USD mỗi GB-tháng).</li>
</ul>
</div>
`;

/* ═════ 4.4 — IMDS, IMDSv2 và Capital One ═════ */
const L44_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4</span>
<h2>4.4 — Instance metadata, IMDSv2 and the Capital One breach</h2>
<p class="lead">Every EC2 machine can ask a special address, <code>169.254.169.254</code>, “who am I?” — its instance ID, type, IP, the user data from lesson 4.2, and, if the machine has an IAM role, <strong>temporary credentials for that role</strong>. That last part is what lets your code call S3 without any key on disk (lesson 1.5). It is also the most famous target in cloud security. This lesson reproduces the attack for real — a vulnerable web app, a metadata service, a stolen key — then closes it with one setting.</p>

<h3>The picture: the hotel's internal phone</h3>
<p>Every room has a phone that dials reception directly. Ask “what is my room number?” or “give me a key card for the gym” and reception answers — because the call comes from inside the room, it must be the guest. Now imagine a guest service that “calls any number you type” on your behalf. A stranger in the lobby types reception's number, asks for a key card, and walks off with it. That is <strong>SSRF</strong> against the metadata service.</p>

<h3>What IMDS hands out</h3>
<ul>
  <li><code>/latest/meta-data/</code> — instance ID, type, AMI, private and public IP, security groups, placement.</li>
  <li><code>/latest/user-data</code> — the user data script (lesson 4.2).</li>
  <li><code>/latest/meta-data/iam/security-credentials/&lt;role&gt;</code> — <code>AccessKeyId</code> (starting with <strong>ASIA</strong>, a temporary key), <code>SecretAccessKey</code>, <code>Token</code> and <code>Expiration</code>. SDKs and the CLI fetch and refresh these automatically.</li>
  <li><code>169.254.169.254</code> is a link-local address: it is reachable <strong>only from inside the machine</strong>. Nobody on the Internet can call it directly.</li>
</ul>

<h3>See it running: the metadata service from inside the machine</h3>
<p>The metadata service here is <strong>amazon-ec2-metadata-mock</strong> 1.13.0, AWS's own open-source simulator, placed at exactly <code>169.254.169.254</code> on a Docker network. The credentials are placeholders.</p>
${OUT_44_IMDS_A}
<p>Inside the machine, a plain GET returns everything — that is <strong>IMDSv1</strong>. The “preview” app (a feature many sites have: paste a link, the server fetches it to show a preview) works as designed. Its code:</p>
${MA_SSRF}

<h3>See it running: SSRF, then IMDSv2</h3>
${OUT_44_IMDS_B}
<ol>
  <li>From the attacker's machine, <code>169.254.169.254</code> is unreachable — link-local does its job.</li>
  <li>But the attacker asks the <em>server</em> to fetch it. The server is inside, so IMDS answers: first the role name, then the full credentials. With those three values exported as environment variables, the attacker's own laptop now acts as <code>labflow-ec2-role</code> until the token expires — and can fetch fresh ones as long as the hole is open.</li>
  <li>After switching the service to <strong>IMDSv2 only</strong>, the same SSRF gets <code>401</code>. IMDSv2 requires a session: first a <code>PUT /latest/api/token</code> with a TTL header, then every GET must carry <code>X-aws-ec2-metadata-token</code>. A typical SSRF can only make GET requests with no custom headers, so it cannot complete the dance.</li>
  <li>Legitimate code on the machine — the SDK, the CLI, the curl with a token — keeps working. Turning IMDSv2 on costs you nothing unless your software is very old.</li>
</ol>
<p>Two more protections ride on IMDSv2: the PUT is <strong>refused if it carries an <code>X-Forwarded-For</code> header</strong> (so a misconfigured reverse proxy cannot pass it through), and the token response has an IP <strong>hop limit of 1</strong>, so it dies one router away — a container behind an extra network hop does not receive it unless you raise the limit to 2 on purpose.</p>

<h3>Capital One, 2019 — the real case</h3>
<p>On <strong>19 July 2019</strong>, Capital One determined that an outside individual had obtained data about credit card customers and applicants: about <strong>100 million</strong> people in the US and about <strong>6 million</strong> in Canada, including about 140,000 US Social Security numbers, about 80,000 linked bank account numbers and about 1 million Canadian Social Insurance Numbers. The “configuration vulnerability” had been reported to the bank on 17 July through its responsible disclosure program. According to KrebsOnSecurity's sources, a misconfigured open-source web application firewall (ModSecurity) running on AWS could be tricked into relaying requests to the metadata service — an SSRF — which handed out the credentials of the server's role; that role could list and read S3 buckets holding the data. Every link in that chain is the one you just ran.</p>
<p>AWS released IMDSv2 in <strong>November 2019</strong>, four months later, explicitly as defence in depth against open firewalls, reverse proxies and SSRF.</p>

<h3>Closing it, layer by layer</h3>
<p>From the API side, a machine launched without options starts with <code>optional</code> tokens (IMDSv1 allowed); one call fixes a running machine:</p>
${OUT_44_IMDS_C}
<ol>
  <li><strong>Require IMDSv2</strong> on every instance (<code>--metadata-options HttpTokens=required</code> at launch, <code>modify-instance-metadata-options</code> for running ones) and set it as the account default per region (<code>modify-instance-metadata-defaults</code> — LocalStack 4.12 does not implement it, as the output shows).</li>
  <li><strong>Least privilege for the role</strong> (Chapter 1): the Capital One role could read buckets it never needed. A role that can only <code>s3:GetObject</code> on one prefix makes a stolen key worth little.</li>
  <li><strong>Fix the SSRF</strong>: the preview app should allow only http/https to public addresses and refuse <code>169.254.0.0/16</code>, private ranges and redirects into them.</li>
  <li><strong>Detect</strong>: Amazon GuardDuty raises a finding when instance credentials are used from outside AWS (or from another account) — exactly the “stolen key on a laptop” step.</li>
  <li><strong>Turn IMDS off</strong> (<code>HttpEndpoint=disabled</code>) on machines that never need it.</li>
</ol>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Your VPS:</strong> a VPS has no metadata credentials, so the code reads keys from <code>.env</code>. On AWS the role + IMDS replaces that file — better, as long as IMDSv2 is on and the role is small.</li>
  <li><strong>At work:</strong> security scanners (AWS Security Hub, Prowler, Trivy) flag “EC2 instance does not require IMDSv2” as a high finding. Fixing it is a common first ticket for a new cloud engineer — and now you can explain why it matters.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“What is IMDS and why is it sensitive?”</strong> — The link-local metadata endpoint at 169.254.169.254; it serves the instance role's temporary credentials, so anything that can make the instance call it can steal them.</li>
  <li><strong>“How does IMDSv2 stop SSRF?”</strong> — It needs a PUT to get a session token and a header on every GET; typical SSRF can do neither. PUTs with X-Forwarded-For are refused and the token has hop limit 1.</li>
  <li><strong>“Walk me through the Capital One breach.”</strong> — Misconfigured WAF ⇒ SSRF to IMDS ⇒ role credentials ⇒ over-permissive role lists and reads S3 ⇒ ~106 million records. Fixes: IMDSv2, least privilege, SSRF filtering, GuardDuty.</li>
  <li><strong>“Your container on EC2 can't get credentials after you enforced IMDSv2. Why?”</strong> — The extra network hop: raise the PUT response hop limit to 2, or better, give the task its own role (ECS task role, Chapter 7).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Create a Docker network <code>169.254.169.0/24</code>, run <code>amazon-ec2-metadata-mock</code> at <code>169.254.169.254</code> port 80 with a config whose credentials are placeholders.</li>
  <li>Run <code>ssrf.py</code> on the same network and on a second network, and an attacker container on the second network only.</li>
  <li>Steal the placeholder credentials through <code>/preview?url=…</code>. Restart the mock with <code>--imdsv2</code> and repeat.</li>
  <li>Patch <code>ssrf.py</code> so it refuses any URL whose host resolves into <code>169.254.0.0/16</code> or private ranges, and prove the theft fails even with IMDSv1.</li>
</ol>
<p><strong>Done when:</strong> v1 + unpatched app leaks the JSON, v2 returns <code>upstream HTTP 401</code>, and the patched app refuses the request before fetching anything.</p>
${giai('Hint: commands', bash(`
docker network create --subnet 169.254.169.0/24 aws-c4-imds
docker run -d --name aws-c4-imdsv --network aws-c4-imds --ip 169.254.169.254 \\
  -v $PWD/aemm.json:/aemm.json:ro public.ecr.aws/aws-ec2/amazon-ec2-metadata-mock:v1.13.0 -p 80 -c /aemm.json
curl -s "http://APP:8080/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
# patch: import ipaddress, socket; ip = ipaddress.ip_address(socket.gethostbyname(host))
#        if ip.is_private or ip.is_link_local or ip.is_loopback: refuse`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IMDS</span><span class="v">Instance Metadata Service at 169.254.169.254, reachable only from the instance.</span></div>
  <div class="kv"><span class="k">IMDSv1</span><span class="v">Plain GET requests, no session — vulnerable to SSRF.</span></div>
  <div class="kv"><span class="k">IMDSv2</span><span class="v">PUT for a session token, token header on every GET; HttpTokens=required.</span></div>
  <div class="kv"><span class="k">Hop limit</span><span class="v">IP TTL of the token response; 1 by default, 2 for containers behind a bridge.</span></div>
  <div class="kv"><span class="k">SSRF</span><span class="v">Server-Side Request Forgery: tricking a server into fetching a URL for the attacker.</span></div>
  <div class="kv"><span class="k">ASIA… key</span><span class="v">Prefix of temporary (STS) access keys, such as those from an instance role.</span></div>
  <div class="kv"><span class="k">GuardDuty</span><span class="v">AWS threat detection; flags instance credentials used outside AWS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>IMDS gives the instance its identity and its role's temporary credentials.</li>
  <li>SSRF turns any server that fetches URLs into a credential thief under IMDSv1.</li>
  <li>IMDSv2 (session token, no X-Forwarded-For, hop limit 1) blocks that path at no cost.</li>
  <li>Capital One 2019 = WAF SSRF + IMDS + an over-permissive role.</li>
  <li>Layer it: IMDSv2 required, least-privilege roles, SSRF filtering, GuardDuty.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/', '🛡️', 'AWS Security Blog — Defense in depth with IMDSv2 (19/11/2019)', 'Why the session token, X-Forwarded-For and hop limit were designed.')}
${tl('https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/', '🔍', 'KrebsOnSecurity — What we can learn from the Capital One hack', 'The WAF, the SSRF and the metadata service.')}

<h3>Sources</h3>
<ul>
  <li>Configure the instance metadata service (IMDSv2, 401, hop limit, X-Forwarded-For): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html</a></li>
  <li>AWS Security Blog, 19/11/2019: <a href="https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/" target="_blank" rel="noopener">aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/</a></li>
  <li>Capital One — facts about the 2019 cyber incident: <a href="https://www.capitalone.com/digital/facts2019/" target="_blank" rel="noopener">capitalone.com/digital/facts2019/</a></li>
  <li>KrebsOnSecurity, 08/2019: <a href="https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/" target="_blank" rel="noopener">krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/</a></li>
  <li>GuardDuty finding InstanceCredentialExfiltration: <a href="https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html" target="_blank" rel="noopener">docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html</a></li>
  <li>amazon-ec2-metadata-mock: <a href="https://github.com/aws/amazon-ec2-metadata-mock" target="_blank" rel="noopener">github.com/aws/amazon-ec2-metadata-mock</a></li>
</ul>
</div>
`;

const L44_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4</span>
<h2>4.4 — Instance metadata, IMDSv2 và vụ Capital One</h2>
<p class="lead">Máy EC2 nào cũng hỏi được một địa chỉ đặc biệt, <code>169.254.169.254</code>, câu “tôi là ai?” — instance ID, loại máy, IP, user data của bài 4.2, và nếu máy có IAM role thì cả <strong>thông tin xác thực tạm của role đó</strong>. Phần cuối là thứ cho mã của bạn gọi S3 mà không cần khoá nào trên đĩa (bài 1.5). Nó cũng là mục tiêu nổi tiếng nhất của bảo mật cloud. Bài này dựng lại vụ tấn công bằng đồ thật — một ứng dụng web có lỗ hổng, một dịch vụ metadata, một chiếc khoá bị lấy — rồi đóng nó bằng một thiết lập.</p>

<h3>Hình dung: điện thoại nội bộ của khách sạn</h3>
<p>Phòng nào cũng có điện thoại gọi thẳng lễ tân. Hỏi “phòng tôi số mấy?” hay “cho tôi thẻ vào phòng gym” là lễ tân trả lời — cuộc gọi từ trong phòng thì chắc là khách. Giờ tưởng tượng có dịch vụ “gọi hộ bất kỳ số nào bạn gõ”. Một người lạ ở sảnh gõ số lễ tân, xin thẻ gym, rồi cầm đi. Đó là <strong>SSRF</strong> nhắm vào dịch vụ metadata.</p>

<h3>IMDS phát ra những gì</h3>
<ul>
  <li><code>/latest/meta-data/</code> — instance ID, loại máy, AMI, IP riêng và công khai, security group, vị trí.</li>
  <li><code>/latest/user-data</code> — script user data (bài 4.2).</li>
  <li><code>/latest/meta-data/iam/security-credentials/&lt;role&gt;</code> — <code>AccessKeyId</code> (bắt đầu bằng <strong>ASIA</strong>, khoá tạm), <code>SecretAccessKey</code>, <code>Token</code> và <code>Expiration</code>. SDK và CLI tự lấy và tự làm mới chúng.</li>
  <li><code>169.254.169.254</code> là địa chỉ link-local: <strong>chỉ gọi được từ bên trong máy</strong>. Không ai trên Internet gọi thẳng được.</li>
</ul>

<h3>Xem chạy thật: dịch vụ metadata nhìn từ trong máy</h3>
<p>Dịch vụ metadata ở đây là <strong>amazon-ec2-metadata-mock</strong> 1.13.0, bộ giả lập mã nguồn mở của chính AWS, đặt đúng ở <code>169.254.169.254</code> trên một mạng Docker. Thông tin xác thực là chỗ giữ.</p>
${OUT_44_IMDS_A}
<p>Trong máy, một lệnh GET trần trả về tất cả — đó là <strong>IMDSv1</strong>. Ứng dụng “xem trước liên kết” (tính năng nhiều trang có: dán liên kết, máy chủ tự tải để hiện bản xem trước) chạy đúng thiết kế. Mã của nó:</p>
${MA_SSRF}

<h3>Xem chạy thật: SSRF, rồi IMDSv2</h3>
${OUT_44_IMDS_B}
<ol>
  <li>Từ máy kẻ tấn công, <code>169.254.169.254</code> không với tới được — link-local làm đúng việc của nó.</li>
  <li>Nhưng kẻ tấn công nhờ <em>máy chủ</em> tải hộ. Máy chủ ở bên trong nên IMDS trả lời: trước là tên role, sau là trọn bộ thông tin xác thực. Xuất ba giá trị đó thành biến môi trường là laptop của kẻ tấn công hành động như <code>labflow-ec2-role</code> cho tới khi token hết hạn — và còn lấy được bộ mới chừng nào lỗ hổng còn mở.</li>
  <li>Chuyển dịch vụ sang <strong>chỉ IMDSv2</strong>, cùng lệnh SSRF nhận <code>401</code>. IMDSv2 bắt mở phiên: trước tiên <code>PUT /latest/api/token</code> kèm header TTL, rồi mọi GET phải mang <code>X-aws-ec2-metadata-token</code>. SSRF thông thường chỉ gửi được GET, không thêm header được, nên không đi hết hai bước.</li>
  <li>Mã hợp lệ trên máy — SDK, CLI, curl có token — vẫn chạy. Bật IMDSv2 không tốn gì, trừ khi phần mềm của bạn quá cũ.</li>
</ol>
<p>IMDSv2 còn kèm hai lớp nữa: lệnh PUT <strong>bị từ chối nếu mang header <code>X-Forwarded-For</code></strong> (nên reverse proxy cấu hình sai không chuyển tiếp được), và phản hồi token có <strong>hop limit bằng 1</strong> ở tầng IP, nên chết sau một bước định tuyến — container đứng sau thêm một bước mạng sẽ không nhận được, trừ khi bạn cố ý nâng lên 2.</p>

<h3>Capital One, 2019 — vụ việc thật</h3>
<p>Ngày <strong>19/7/2019</strong>, Capital One xác định một người bên ngoài đã lấy được dữ liệu về khách hàng thẻ tín dụng và người nộp hồ sơ mở thẻ: khoảng <strong>100 triệu</strong> người ở Mỹ và khoảng <strong>6 triệu</strong> ở Canada, trong đó có khoảng 140.000 số an sinh xã hội Mỹ, khoảng 80.000 số tài khoản ngân hàng liên kết và khoảng 1 triệu số bảo hiểm xã hội Canada. “Lỗ hổng cấu hình” được báo cho ngân hàng ngày 17/7 qua chương trình báo lỗi có trách nhiệm. Theo nguồn tin của KrebsOnSecurity, một tường lửa ứng dụng web mã nguồn mở (ModSecurity) chạy trên AWS bị cấu hình sai, có thể bị lừa chuyển tiếp yêu cầu tới dịch vụ metadata — một vụ SSRF — và dịch vụ đó trao thông tin xác thực của role máy chủ; role ấy liệt kê và đọc được các bucket S3 chứa dữ liệu. Từng mắt xích trong chuỗi đó chính là thứ bạn vừa chạy.</p>
<p>AWS ra mắt IMDSv2 vào <strong>tháng 11/2019</strong>, bốn tháng sau, nói rõ là lớp phòng thủ chiều sâu trước tường lửa mở, reverse proxy và SSRF.</p>

<h3>Đóng lại, từng lớp một</h3>
<p>Từ phía API, máy khởi chạy không kèm tuỳ chọn sẽ bắt đầu với token <code>optional</code> (cho phép IMDSv1); một lệnh sửa được máy đang chạy:</p>
${OUT_44_IMDS_C}
<ol>
  <li><strong>Bắt buộc IMDSv2</strong> cho mọi máy (<code>--metadata-options HttpTokens=required</code> lúc khởi chạy, <code>modify-instance-metadata-options</code> cho máy đang chạy) và đặt làm mặc định của tài khoản theo từng region (<code>modify-instance-metadata-defaults</code> — LocalStack 4.12 chưa làm lệnh này, như output cho thấy).</li>
  <li><strong>Quyền tối thiểu cho role</strong> (Chương 1): role của Capital One đọc được những bucket nó không hề cần. Role chỉ được <code>s3:GetObject</code> trên một tiền tố thì khoá bị lấy cũng chẳng đáng bao nhiêu.</li>
  <li><strong>Vá SSRF</strong>: ứng dụng xem trước chỉ nên cho http/https tới địa chỉ công khai và từ chối <code>169.254.0.0/16</code>, các dải riêng, và các lần chuyển hướng dẫn vào đó.</li>
  <li><strong>Phát hiện</strong>: Amazon GuardDuty báo động khi thông tin xác thực của máy được dùng từ bên ngoài AWS (hoặc từ tài khoản khác) — đúng bước “khoá bị lấy nằm trên laptop”.</li>
  <li><strong>Tắt IMDS</strong> (<code>HttpEndpoint=disabled</code>) trên máy không bao giờ cần nó.</li>
</ol>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>VPS của bạn:</strong> VPS không có thông tin xác thực trong metadata, nên mã đọc khoá từ <code>.env</code>. Trên AWS, role + IMDS thay cho tệp đó — tốt hơn, miễn là IMDSv2 bật và role nhỏ.</li>
  <li><strong>Đi làm:</strong> các bộ quét bảo mật (AWS Security Hub, Prowler, Trivy) đánh dấu “máy EC2 không bắt buộc IMDSv2” là phát hiện mức cao. Sửa nó là phiếu việc đầu tiên quen thuộc của kỹ sư cloud mới — và giờ bạn giải thích được vì sao nó quan trọng.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“IMDS là gì và sao nó nhạy cảm?”</strong> — Điểm metadata link-local ở 169.254.169.254; nó phát thông tin xác thực tạm của role, nên thứ gì khiến máy gọi được nó là lấy được khoá.</li>
  <li><strong>“IMDSv2 chặn SSRF thế nào?”</strong> — Cần PUT để lấy token phiên và header ở mọi GET; SSRF thông thường không làm được cả hai. PUT có X-Forwarded-For bị từ chối, token có hop limit 1.</li>
  <li><strong>“Kể lại vụ Capital One.”</strong> — WAF cấu hình sai ⇒ SSRF tới IMDS ⇒ thông tin xác thực của role ⇒ role quá rộng liệt kê và đọc S3 ⇒ khoảng 106 triệu hồ sơ. Cách sửa: IMDSv2, quyền tối thiểu, lọc SSRF, GuardDuty.</li>
  <li><strong>“Container trên EC2 hết lấy được thông tin xác thực sau khi bạn bắt IMDSv2. Vì sao?”</strong> — Thêm một bước mạng: nâng hop limit của phản hồi PUT lên 2, hoặc tốt hơn, cho task một role riêng (ECS task role, Chương 7).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Tạo mạng Docker <code>169.254.169.0/24</code>, chạy <code>amazon-ec2-metadata-mock</code> ở <code>169.254.169.254</code> cổng 80 với cấu hình có thông tin xác thực là chỗ giữ.</li>
  <li>Chạy <code>ssrf.py</code> trên mạng đó và một mạng thứ hai, và một container kẻ tấn công chỉ ở mạng thứ hai.</li>
  <li>Lấy thông tin xác thực chỗ giữ qua <code>/preview?url=…</code>. Khởi động lại mock với <code>--imdsv2</code> và làm lại.</li>
  <li>Vá <code>ssrf.py</code> để từ chối mọi URL có host phân giải vào <code>169.254.0.0/16</code> hoặc dải riêng, rồi chứng minh việc lấy khoá thất bại kể cả với IMDSv1.</li>
</ol>
<p><strong>Đạt khi:</strong> v1 + ứng dụng chưa vá làm lộ JSON, v2 trả <code>upstream HTTP 401</code>, và ứng dụng đã vá từ chối yêu cầu trước khi tải bất cứ thứ gì.</p>
${giai('Gợi ý: các lệnh', bash(`
docker network create --subnet 169.254.169.0/24 aws-c4-imds
docker run -d --name aws-c4-imdsv --network aws-c4-imds --ip 169.254.169.254 \\
  -v $PWD/aemm.json:/aemm.json:ro public.ecr.aws/aws-ec2/amazon-ec2-metadata-mock:v1.13.0 -p 80 -c /aemm.json
curl -s "http://APP:8080/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
# vá: import ipaddress, socket; ip = ipaddress.ip_address(socket.gethostbyname(host))
#     if ip.is_private or ip.is_link_local or ip.is_loopback: từ chối`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IMDS</span><span class="v">Dịch vụ metadata của máy ở 169.254.169.254, chỉ gọi được từ trong máy.</span></div>
  <div class="kv"><span class="k">IMDSv1</span><span class="v">GET trần, không phiên — dễ bị SSRF.</span></div>
  <div class="kv"><span class="k">IMDSv2</span><span class="v">PUT lấy token phiên, header token ở mọi GET; HttpTokens=required.</span></div>
  <div class="kv"><span class="k">Hop limit</span><span class="v">TTL tầng IP của phản hồi token; mặc định 1, nâng 2 cho container sau bridge.</span></div>
  <div class="kv"><span class="k">SSRF</span><span class="v">Server-Side Request Forgery: lừa máy chủ tải một URL hộ kẻ tấn công.</span></div>
  <div class="kv"><span class="k">Khoá ASIA…</span><span class="v">Tiền tố của khoá tạm (STS), như khoá lấy từ role của máy.</span></div>
  <div class="kv"><span class="k">GuardDuty</span><span class="v">Dịch vụ phát hiện mối đe doạ của AWS; báo khi khoá của máy được dùng ngoài AWS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>IMDS cho máy biết danh tính của nó và trao khoá tạm của role.</li>
  <li>Với IMDSv1, máy chủ nào tải URL hộ người dùng cũng có thể thành kẻ trộm khoá qua SSRF.</li>
  <li>IMDSv2 (token phiên, chặn X-Forwarded-For, hop limit 1) chặn đường đó mà không tốn gì.</li>
  <li>Capital One 2019 = SSRF qua WAF + IMDS + role quá rộng.</li>
  <li>Phòng nhiều lớp: bắt buộc IMDSv2, role quyền tối thiểu, lọc SSRF, GuardDuty.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/', '🛡️', 'AWS Security Blog — Phòng thủ chiều sâu với IMDSv2 (19/11/2019)', 'Vì sao có token phiên, chặn X-Forwarded-For và hop limit.')}
${tl('https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/', '🔍', 'KrebsOnSecurity — Bài học từ vụ Capital One', 'WAF, SSRF và dịch vụ metadata.')}

<h3>Nguồn</h3>
<ul>
  <li>Cấu hình dịch vụ metadata (IMDSv2, 401, hop limit, X-Forwarded-For): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html</a></li>
  <li>AWS Security Blog, 19/11/2019: <a href="https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/" target="_blank" rel="noopener">aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/</a></li>
  <li>Capital One — sự thật về sự cố 2019: <a href="https://www.capitalone.com/digital/facts2019/" target="_blank" rel="noopener">capitalone.com/digital/facts2019/</a></li>
  <li>KrebsOnSecurity, 08/2019: <a href="https://krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/" target="_blank" rel="noopener">krebsonsecurity.com/2019/08/what-we-can-learn-from-the-capital-one-hack/</a></li>
  <li>Phát hiện GuardDuty InstanceCredentialExfiltration: <a href="https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html" target="_blank" rel="noopener">docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html</a></li>
  <li>amazon-ec2-metadata-mock: <a href="https://github.com/aws/amazon-ec2-metadata-mock" target="_blank" rel="noopener">github.com/aws/amazon-ec2-metadata-mock</a></li>
</ul>
</div>
`;

/* ═════ 4.5 — Giá máy ═════ */
const L45_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 5</span>
<h2>4.5 — Pricing: on-demand, Spot, Savings Plans and Graviton</h2>
<p class="lead">The same machine can cost four very different prices depending on <em>how</em> you buy it. On-demand is the walk-in rate. Spot is the standby seat — very cheap, but you can be asked to leave with two minutes' notice. Savings Plans and Reserved Instances are a season ticket: cheaper because you promise to use a certain amount for one or three years. And Graviton (ARM) is simply a cheaper chip for the same work. This lesson computes real Singapore prices from AWS's own price files, adds the costs people forget, and catches a real Spot interruption notice.</p>

<h3>The picture: airline seats</h3>
<p>On-demand is buying a ticket at the counter: full price, guaranteed seat. Savings Plans is a frequent-flyer commitment: you promise to fly a certain amount per hour of the year, the airline gives a discount. Spot is a standby seat: dirt cheap if the plane has room, but you can be bumped. Graviton is a newer, more fuel-efficient plane on the same route at a lower fare.</p>

<h3>The four ways to pay</h3>
<table>
  <thead><tr><th>Model</th><th>Discount vs on-demand</th><th>Commitment</th><th>Risk</th><th>Fits</th></tr></thead>
  <tbody>
    <tr><td><strong>On-demand</strong></td><td>—</td><td>None; per second, 60-second minimum (Linux)</td><td>None</td><td>Dev, spiky or unknown load, first months</td></tr>
    <tr><td><strong>Spot</strong></td><td>Up to 90%</td><td>None</td><td>Reclaimed with a 2-minute warning</td><td>Batch, CI runners, rendering, stateless workers in Auto Scaling</td></tr>
    <tr><td><strong>Compute Savings Plans</strong></td><td>Up to 66%</td><td>$/hour for 1 or 3 years, any family/region</td><td>Paying for unused commitment</td><td>Steady baseline you are sure of</td></tr>
    <tr><td><strong>EC2 Instance Savings Plans / Reserved Instances</strong></td><td>Up to 72%</td><td>One family in one region, 1 or 3 years</td><td>Locked to that family</td><td>Long-lived, predictable servers</td></tr>
  </tbody>
</table>

<h3>See it running: what a month really costs in Singapore</h3>
<p>The script reads AWS's public on-demand price file for Asia Pacific (Singapore) and the public Spot price page, both downloaded on 19/11/2026, and multiplies by 730 hours (one month).</p>
${OUT_45_GIA_A}
<ul>
  <li><strong>Graviton is about 20% cheaper</strong> at every size here: t4g.micro is 0.80× t3.micro, m7g.large 0.81× m7i.large. Node.js, Java, Python, PostgreSQL and Docker images with an <code>arm64</code> variant run unchanged; native binaries and old images may not.</li>
  <li><strong>Spot moves.</strong> On this day a t3.micro Spot price was about a fifth of on-demand, a t4g.micro about 60%. Spot prices change with demand per AZ — compare current prices, do not memorise them.</li>
  <li><strong>The machine is not the whole bill.</strong> A t4g.small running all month is $15.48, but the 20 GB gp3 disk adds $1.92 and the public IPv4 address $3.65 (charged since February 2024). That is 21.05 USD, and about 26% of it is not the machine.</li>
  <li><strong>Per-second billing</strong> rewards stopping machines: 90 seconds of t3.micro costs 0.00033 USD; a 30-second run is billed as 60 seconds.</li>
</ul>

<h3>See it running: a real Spot interruption notice</h3>
<p>When AWS needs a Spot machine back, it posts a notice in the metadata service two minutes before acting. A well-behaved worker polls <code>/latest/meta-data/spot/instance-action</code> every few seconds (404 = no notice) and, when it appears, stops taking new jobs, finishes or checkpoints the current one, and deregisters from the load balancer. The AWS metadata simulator produces the same notice:</p>
${OUT_45_GIA_B}
<p>The last command is a LocalStack difference: its Spot price history returns placeholder values (0.00001). Use the console's Spot pricing page or <code>describe-spot-price-history</code> on a real account.</p>

<h3>How to choose — a recipe</h3>
<ol>
  <li>Start <strong>on-demand</strong> and measure for a few weeks (Cost Explorer, CloudWatch CPU).</li>
  <li><strong>Right-size</strong> first: a machine at 5% CPU should shrink before you buy any commitment.</li>
  <li>Move to <strong>Graviton</strong> if your stack builds for <code>arm64</code> — a free 20%.</li>
  <li>Cover the steady baseline with a <strong>Compute Savings Plan</strong>; leave peaks on-demand.</li>
  <li>Put interruptible work (CI, image processing, video rendering, queue workers) on <strong>Spot</strong>, spread over several instance types and AZs.</li>
  <li><strong>Stop</strong> dev machines at night — per-second billing makes it worth it.</li>
</ol>

<h3>🔓 Hacker's view: the bill is an attack surface</h3>
<p>Remember EleKtra-Leak from lesson 1.7: keys leaked on GitHub were used within minutes to launch hundreds of mining machines. The pricing lesson is the defence: an AWS Budgets alert (lesson 0.1) on actual and forecast spend, a <strong>service quota</strong> that keeps your account from launching 400 vCPUs it never needs, and an SCP (Chapter 13) that allows only the instance families you use. A thief can only burn what the account is allowed to launch.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Your VPS:</strong> a fixed monthly VPS is effectively a 1-month commitment with no discount for idle time. EC2 on-demand costs more per hour for the same size, but nothing when stopped; Savings Plans close the gap for always-on servers.</li>
  <li><strong>At work:</strong> FinOps reviews ask three questions: what is idle, what can be smaller, and what is steady enough to commit. You will be asked to show numbers like the table above, not opinions.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“Spot vs on-demand vs Savings Plans?”</strong> — Spot up to 90% off but interruptible with a 2-minute notice; Savings Plans up to 66–72% off for a 1/3-year commitment; on-demand for unknown or spiky load.</li>
  <li><strong>“How does an application survive Spot interruptions?”</strong> — Stateless workers, checkpointing, polling the instance-action notice (or EventBridge), diversified instance types/AZs, Auto Scaling replacing capacity.</li>
  <li><strong>“Why is my bill higher than the instance price × hours?”</strong> — EBS volumes and snapshots, public IPv4 addresses, data transfer out, NAT gateways, t-family unlimited credits.</li>
  <li><strong>“When would you choose Graviton?”</strong> — When the software has arm64 builds: about 20% lower price for comparable instances, less energy.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Download the Singapore on-demand price file and the Spot price page, run <code>gia.py</code>.</li>
  <li>Add <code>c7g.large</code> and <code>c7i.large</code> to the list and compute the Graviton ratio.</li>
  <li>Price a dev machine t4g.small that runs only 9:00–18:00 on weekdays (about 195 hours a month) with a 20 GB gp3 disk and a public IPv4. Compare with running it all month.</li>
  <li>Run the metadata mock with <code>spot --action terminate --mock-delay-sec 5</code> and write a 10-line shell loop that prints “draining” when the notice appears.</li>
</ol>
<p><strong>Done when:</strong> c7g.large/c7i.large comes out around 0.81, your part-time dev machine comes to about 9.70 USD, less than half of the all-month 21.05 (remember disk and IPv4 bill all month), and your loop prints “draining” within 10 seconds of the notice.</p>
${giai('Hint: commands', bash(`
curl -s --compressed -o od-sg.json "https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-ondemand-without-sec-sel/Asia%20Pacific%20(Singapore)/Linux/index.json"
curl -s -o spot.js https://website.spot.ec2.aws.a2z.com/spot.js
python3 gia.py od-sg.json spot.js
# part-time: 0.0212*195 + 20*0.096 + 0.005*730
while sleep 5; do
  c=$(curl -s -o /dev/null -w '%{http_code}' http://169.254.169.254/latest/meta-data/spot/instance-action)
  [ "$c" = 200 ] && { echo draining; break; }
done`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">On-demand</span><span class="v">Pay per second (60 s minimum) with no commitment.</span></div>
  <div class="kv"><span class="k">Spot</span><span class="v">Spare capacity up to 90% off; reclaimed with a 2-minute notice.</span></div>
  <div class="kv"><span class="k">Compute Savings Plans</span><span class="v">$/hour commitment for 1–3 years, any family/region; up to 66% off.</span></div>
  <div class="kv"><span class="k">Reserved Instance</span><span class="v">Commitment to an instance family in a region; up to 72% off.</span></div>
  <div class="kv"><span class="k">Graviton</span><span class="v">AWS ARM CPUs; up to 20% cheaper than comparable x86 instances.</span></div>
  <div class="kv"><span class="k">Right-sizing</span><span class="v">Shrinking instances to measured need before committing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One machine, four prices: on-demand, Spot, Savings Plans, Reserved.</li>
  <li>Graviton is a ~20% discount for arm64-ready software.</li>
  <li>Disks, IPv4 and data transfer belong in every estimate.</li>
  <li>Spot needs software that drains on a 2-minute notice.</li>
  <li>Measure, right-size, then commit — in that order.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://aws.amazon.com/savingsplans/compute-pricing/', '💰', 'AWS — Savings Plans pricing', 'Compute vs EC2 Instance Savings Plans and their discounts.')}
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html', '⚡', 'AWS docs — Spot best practices', 'Diversify, prepare for interruption, use the notice.')}

<h3>Sources</h3>
<ul>
  <li>On-demand pricing, per-second with 60-second minimum: <a href="https://aws.amazon.com/ec2/pricing/on-demand/" target="_blank" rel="noopener">aws.amazon.com/ec2/pricing/on-demand/</a></li>
  <li>Spot, up to 90%: <a href="https://aws.amazon.com/ec2/spot/pricing/" target="_blank" rel="noopener">aws.amazon.com/ec2/spot/pricing/</a></li>
  <li>Spot interruption notices (2 minutes): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html</a></li>
  <li>Savings Plans (66% / 72%): <a href="https://aws.amazon.com/savingsplans/compute-pricing/" target="_blank" rel="noopener">aws.amazon.com/savingsplans/compute-pricing/</a></li>
  <li>Reserved Instances (up to 72%): <a href="https://aws.amazon.com/ec2/pricing/reserved-instances/" target="_blank" rel="noopener">aws.amazon.com/ec2/pricing/reserved-instances/</a></li>
  <li>Graviton (up to 20% less): <a href="https://aws.amazon.com/ec2/graviton/" target="_blank" rel="noopener">aws.amazon.com/ec2/graviton/</a></li>
  <li>Price data: AWS on-demand price file Asia Pacific (Singapore) Linux and the public Spot price page (website.spot.ec2.aws.a2z.com/spot.js), downloaded 19/11/2026; EBS gp3 $0.096/GB-month and public IPv4 $0.005/hour from the AWS Price List API.</li>
</ul>
</div>
`;

const L45_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 5</span>
<h2>4.5 — Giá máy: on-demand, Spot, Savings Plans và Graviton</h2>
<p class="lead">Cùng một máy có thể có bốn mức giá rất khác nhau tuỳ <em>cách</em> bạn mua. On-demand là giá khách vãng lai. Spot là ghế chờ — rất rẻ, nhưng có thể bị mời xuống với hai phút báo trước. Savings Plans và Reserved Instances là vé mùa: rẻ hơn vì bạn hứa dùng một lượng nhất định trong một hoặc ba năm. Còn Graviton (ARM) đơn giản là con chip rẻ hơn cho cùng việc. Bài này tính giá thật ở Singapore từ chính tệp giá của AWS, cộng những khoản người ta hay quên, và bắt một thông báo thu hồi Spot thật.</p>

<h3>Hình dung: ghế máy bay</h3>
<p>On-demand là mua vé tại quầy: giá đủ, chắc chắn có ghế. Savings Plans là cam kết khách hàng thân thiết: bạn hứa bay một lượng nhất định mỗi giờ trong năm, hãng giảm giá. Spot là ghế chờ: rẻ bèo nếu máy bay còn chỗ, nhưng có thể bị đẩy xuống. Graviton là máy bay đời mới tiết kiệm nhiên liệu, cùng tuyến mà vé rẻ hơn.</p>

<h3>Bốn cách trả tiền</h3>
<table>
  <thead><tr><th>Cách</th><th>Giảm so với on-demand</th><th>Cam kết</th><th>Rủi ro</th><th>Hợp với</th></tr></thead>
  <tbody>
    <tr><td><strong>On-demand</strong></td><td>—</td><td>Không; theo giây, tối thiểu 60 giây (Linux)</td><td>Không</td><td>Dev, tải thất thường hoặc chưa biết, mấy tháng đầu</td></tr>
    <tr><td><strong>Spot</strong></td><td>Tới 90%</td><td>Không</td><td>Bị thu hồi với 2 phút báo trước</td><td>Việc theo lô, máy chạy CI, dựng hình, worker không giữ trạng thái trong Auto Scaling</td></tr>
    <tr><td><strong>Compute Savings Plans</strong></td><td>Tới 66%</td><td>USD/giờ trong 1 hoặc 3 năm, họ máy/region nào cũng được</td><td>Trả cho phần cam kết không dùng</td><td>Mức nền ổn định bạn chắc chắn</td></tr>
    <tr><td><strong>EC2 Instance Savings Plans / Reserved Instances</strong></td><td>Tới 72%</td><td>Một họ máy ở một region, 1 hoặc 3 năm</td><td>Bị khoá vào họ máy đó</td><td>Máy chủ sống lâu, dự đoán được</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật: một tháng thật sự tốn bao nhiêu ở Singapore</h3>
<p>Script đọc tệp giá on-demand công khai của AWS cho Asia Pacific (Singapore) và trang giá Spot công khai, cả hai tải về ngày 19/11/2026, rồi nhân với 730 giờ (một tháng).</p>
${OUT_45_GIA_A}
<ul>
  <li><strong>Graviton rẻ hơn khoảng 20%</strong> ở mọi cỡ ở đây: t4g.micro bằng 0,80 lần t3.micro, m7g.large bằng 0,81 lần m7i.large. Node.js, Java, Python, PostgreSQL và ảnh Docker có bản <code>arm64</code> chạy y nguyên; tệp nhị phân biên dịch sẵn và ảnh cũ thì chưa chắc.</li>
  <li><strong>Giá Spot thay đổi.</strong> Hôm đó giá Spot của t3.micro khoảng một phần năm on-demand, của t4g.micro khoảng 60%. Giá Spot đổi theo nhu cầu ở từng AZ — so giá hiện tại, đừng học thuộc.</li>
  <li><strong>Máy không phải toàn bộ hoá đơn.</strong> Một t4g.small chạy cả tháng là 15,48 USD, nhưng ổ gp3 20 GB thêm 1,92 USD và địa chỉ IPv4 công khai thêm 3,65 USD (tính phí từ tháng 2/2024). Tổng 21,05 USD, và khoảng 26% trong đó không phải tiền máy.</li>
  <li><strong>Tính theo giây</strong> thưởng cho việc tắt máy: 90 giây t3.micro tốn 0,00033 USD; chạy 30 giây vẫn tính 60 giây.</li>
</ul>

<h3>Xem chạy thật: một thông báo thu hồi Spot thật</h3>
<p>Khi AWS cần lấy lại máy Spot, nó đăng thông báo trong dịch vụ metadata hai phút trước khi làm. Worker tử tế hỏi <code>/latest/meta-data/spot/instance-action</code> vài giây một lần (404 = chưa có thông báo) và khi thông báo xuất hiện thì ngừng nhận việc mới, làm xong hoặc lưu điểm dừng việc đang làm, rồi rút khỏi load balancer. Bộ giả lập metadata của AWS phát đúng thông báo đó:</p>
${OUT_45_GIA_B}
<p>Lệnh cuối là chỗ LocalStack khác AWS: lịch sử giá Spot của nó trả số giả (0,00001). Hãy dùng trang giá Spot trong console hoặc <code>describe-spot-price-history</code> trên tài khoản thật.</p>

<h3>Chọn thế nào — một công thức</h3>
<ol>
  <li>Bắt đầu bằng <strong>on-demand</strong> và đo vài tuần (Cost Explorer, CPU trên CloudWatch).</li>
  <li><strong>Chỉnh cỡ</strong> trước: máy chạy 5% CPU phải thu nhỏ trước khi mua cam kết nào.</li>
  <li>Chuyển sang <strong>Graviton</strong> nếu phần mềm dựng được cho <code>arm64</code> — 20% miễn phí.</li>
  <li>Phủ mức nền ổn định bằng <strong>Compute Savings Plan</strong>; để phần đỉnh chạy on-demand.</li>
  <li>Đưa việc ngắt được (CI, xử lý ảnh, dựng video, worker đọc hàng đợi) lên <strong>Spot</strong>, trải trên nhiều loại máy và nhiều AZ.</li>
  <li><strong>Stop</strong> máy dev ban đêm — tính theo giây nên đáng làm.</li>
</ol>

<h3>🔓 Góc hacker: hoá đơn cũng là bề mặt tấn công</h3>
<p>Nhớ lại EleKtra-Leak ở bài 1.7: khoá lộ trên GitHub bị dùng trong vài phút để bật hàng trăm máy đào coin. Bài về giá chính là lớp phòng thủ: cảnh báo AWS Budgets (bài 0.1) cho chi phí thực và dự báo, một <strong>service quota</strong> giữ tài khoản không bật nổi 400 vCPU mà nó không bao giờ cần, và một SCP (Chương 13) chỉ cho phép những họ máy bạn dùng. Kẻ trộm chỉ đốt được những gì tài khoản được phép bật.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>VPS của bạn:</strong> VPS giá tháng cố định thực chất là cam kết một tháng, máy ngồi không cũng không được giảm. EC2 on-demand đắt hơn mỗi giờ cho cùng cỡ, nhưng tắt là không tốn; Savings Plans thu hẹp khoảng cách cho máy chạy suốt.</li>
  <li><strong>Đi làm:</strong> buổi soát chi phí (FinOps) hỏi ba câu: cái gì đang ngồi không, cái gì nhỏ lại được, cái gì đủ ổn định để cam kết. Bạn sẽ phải đưa ra con số như bảng ở trên, không phải ý kiến.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Spot, on-demand, Savings Plans khác nhau ra sao?”</strong> — Spot giảm tới 90% nhưng bị ngắt với 2 phút báo trước; Savings Plans giảm tới 66–72% đổi lấy cam kết 1/3 năm; on-demand cho tải chưa biết hoặc thất thường.</li>
  <li><strong>“Ứng dụng sống sót qua việc Spot bị thu hồi thế nào?”</strong> — Worker không giữ trạng thái, lưu điểm dừng, hỏi thông báo instance-action (hoặc EventBridge), đa dạng loại máy/AZ, Auto Scaling bù máy.</li>
  <li><strong>“Sao hoá đơn cao hơn giá máy × số giờ?”</strong> — Ổ EBS và snapshot, IPv4 công khai, dữ liệu đi ra ngoài, NAT gateway, tín dụng unlimited của họ t.</li>
  <li><strong>“Khi nào chọn Graviton?”</strong> — Khi phần mềm có bản arm64: rẻ hơn khoảng 20% so với máy tương đương, tốn ít điện hơn.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Tải tệp giá on-demand Singapore và trang giá Spot, chạy <code>gia.py</code>.</li>
  <li>Thêm <code>c7g.large</code> và <code>c7i.large</code> vào danh sách và tính tỉ lệ Graviton.</li>
  <li>Tính giá một máy dev t4g.small chỉ chạy 9:00–18:00 ngày thường (khoảng 195 giờ mỗi tháng) với ổ gp3 20 GB và một IPv4 công khai. So với chạy cả tháng.</li>
  <li>Chạy mock metadata với <code>spot --action terminate --mock-delay-sec 5</code> và viết vòng lặp shell 10 dòng in “draining” khi thông báo xuất hiện.</li>
</ol>
<p><strong>Đạt khi:</strong> c7g.large/c7i.large ra khoảng 0,81, máy dev chạy giờ hành chính ra khoảng 9,70 USD — chưa tới một nửa con số cả tháng 21,05 (nhớ ổ và IPv4 vẫn tính cả tháng), và vòng lặp in “draining” trong vòng 10 giây sau khi có thông báo.</p>
${giai('Gợi ý: các lệnh', bash(`
curl -s --compressed -o od-sg.json "https://b0.p.awsstatic.com/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-ondemand-without-sec-sel/Asia%20Pacific%20(Singapore)/Linux/index.json"
curl -s -o spot.js https://website.spot.ec2.aws.a2z.com/spot.js
python3 gia.py od-sg.json spot.js
# giờ hành chính: 0.0212*195 + 20*0.096 + 0.005*730
while sleep 5; do
  c=$(curl -s -o /dev/null -w '%{http_code}' http://169.254.169.254/latest/meta-data/spot/instance-action)
  [ "$c" = 200 ] && { echo draining; break; }
done`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">On-demand</span><span class="v">Trả theo giây (tối thiểu 60 giây), không cam kết.</span></div>
  <div class="kv"><span class="k">Spot</span><span class="v">Công suất thừa, giảm tới 90%; bị thu hồi với 2 phút báo trước.</span></div>
  <div class="kv"><span class="k">Compute Savings Plans</span><span class="v">Cam kết USD/giờ trong 1–3 năm, họ máy/region nào cũng được; giảm tới 66%.</span></div>
  <div class="kv"><span class="k">Reserved Instance</span><span class="v">Cam kết một họ máy ở một region; giảm tới 72%.</span></div>
  <div class="kv"><span class="k">Graviton</span><span class="v">CPU ARM của AWS; rẻ hơn tới 20% so với máy x86 tương đương.</span></div>
  <div class="kv"><span class="k">Chỉnh cỡ (right-sizing)</span><span class="v">Thu nhỏ máy theo nhu cầu đo được trước khi cam kết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một máy, bốn giá: on-demand, Spot, Savings Plans, Reserved.</li>
  <li>Graviton là khoản giảm ~20% cho phần mềm đã sẵn arm64.</li>
  <li>Ổ đĩa, IPv4 và dữ liệu đi ra phải nằm trong mọi bản dự toán.</li>
  <li>Spot cần phần mềm biết rút lui trong 2 phút báo trước.</li>
  <li>Đo, chỉnh cỡ, rồi mới cam kết — đúng thứ tự đó.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://aws.amazon.com/savingsplans/compute-pricing/', '💰', 'AWS — Giá Savings Plans', 'Compute và EC2 Instance Savings Plans, mức giảm của từng loại.')}
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html', '⚡', 'Tài liệu AWS — Thực hành tốt với Spot', 'Đa dạng hoá, chuẩn bị cho thu hồi, dùng thông báo.')}

<h3>Nguồn</h3>
<ul>
  <li>Giá on-demand, theo giây tối thiểu 60 giây: <a href="https://aws.amazon.com/ec2/pricing/on-demand/" target="_blank" rel="noopener">aws.amazon.com/ec2/pricing/on-demand/</a></li>
  <li>Spot, giảm tới 90%: <a href="https://aws.amazon.com/ec2/spot/pricing/" target="_blank" rel="noopener">aws.amazon.com/ec2/spot/pricing/</a></li>
  <li>Thông báo thu hồi Spot (2 phút): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html</a></li>
  <li>Savings Plans (66% / 72%): <a href="https://aws.amazon.com/savingsplans/compute-pricing/" target="_blank" rel="noopener">aws.amazon.com/savingsplans/compute-pricing/</a></li>
  <li>Reserved Instances (tới 72%): <a href="https://aws.amazon.com/ec2/pricing/reserved-instances/" target="_blank" rel="noopener">aws.amazon.com/ec2/pricing/reserved-instances/</a></li>
  <li>Graviton (rẻ hơn tới 20%): <a href="https://aws.amazon.com/ec2/graviton/" target="_blank" rel="noopener">aws.amazon.com/ec2/graviton/</a></li>
  <li>Dữ liệu giá: tệp giá on-demand của AWS cho Asia Pacific (Singapore) Linux và trang giá Spot công khai (website.spot.ec2.aws.a2z.com/spot.js), tải ngày 19/11/2026; EBS gp3 0,096 USD/GB-tháng và IPv4 công khai 0,005 USD/giờ từ AWS Price List API.</li>
</ul>
</div>
`;

/* ═════ 4.6 — Máy GPU ═════ */
const L46_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 6</span>
<h2>4.6 — GPU instances: g4dn, g5, g6 versus renting a GPU box</h2>
<p class="lead">Training a model, transcribing audio, generating voices, rendering video: some work wants a GPU. EC2 rents them by the second like any other machine, but GPU machines differ in three ways that catch beginners: they are <strong>expensive per hour</strong>, many regions do not offer every family, and a new account usually has a <strong>quota</strong> too small to launch one at all. This lesson reads the GPU catalogue, prices a real job, and compares the cloud with the other option many developers use — renting a GPU machine by the hour from a marketplace, or using the one under the desk.</p>

<h3>The picture: renting a truck</h3>
<p>You do not buy a truck to move house once. You rent one — by the day from a big rental company (reliable, insured, pricier), or from a neighbour (cheaper, but the brakes are their problem and yours). A GPU is the truck. EC2 is the rental company; a GPU marketplace is the neighbour; the card in your own PC is the bicycle trailer you already own.</p>

<h3>The GPU families you will meet</h3>
<table>
  <thead><tr><th>Family</th><th>GPU</th><th>GPU memory</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td><strong>g4dn</strong></td><td>NVIDIA T4</td><td>16 GB</td><td>Cheapest inference, light training, video transcoding</td></tr>
    <tr><td><strong>g5</strong></td><td>NVIDIA A10G</td><td>24 GB (22 GiB usable in AWS's table)</td><td>Inference of mid-size models, rendering</td></tr>
    <tr><td><strong>g6</strong></td><td>NVIDIA L4</td><td>24 GB</td><td>Efficient inference, video AI; fractional sizes (1/8 GPU)</td></tr>
    <tr><td><strong>g6e</strong></td><td>NVIDIA L40S</td><td>48 GB</td><td>Larger models, generative AI</td></tr>
    <tr><td>p4 / p5</td><td>A100 / H100</td><td>40–80 GB</td><td>Large-scale training — far beyond a student budget</td></tr>
  </tbody>
</table>

<h3>See it running: catalogue, quota and the card you already have</h3>
${OUT_46_GPU}
<ul>
  <li>The catalogue shows each machine's single GPU and its memory. GPU memory decides which model fits; the vCPU count matters less.</li>
  <li><strong>Service Quotas:</strong> GPU instances are limited by a per-region quota counted in <strong>vCPUs</strong> — “Running On-Demand G and VT instances” (code <code>L-DB2E81BA</code>). On a new account it is often too low for even one g5.xlarge (4 vCPUs); you request an increase and wait for approval, sometimes days. LocalStack does not implement Service Quotas, as the error shows — on a real account the same command prints the current value.</li>
  <li>The last line is the GPU of the machine that built this course: an RTX 3060 with 12 GB. For many student-size jobs, a consumer card at home is enough.</li>
</ul>

<h3>Pricing a real job</h3>
<p>Prices from AWS's price files on 19/11/2026. In Singapore the price file lists g4dn (and the ARM-based g5g) but not g5 or g6; those are priced here in US East (N. Virginia).</p>
<table>
  <thead><tr><th>Machine</th><th>Region</th><th>On-demand $/h</th><th>Spot $/h (that day)</th><th>3-hour job, on-demand</th></tr></thead>
  <tbody>
    <tr><td>g4dn.xlarge (T4)</td><td>Singapore</td><td>0.736</td><td>0.236</td><td>2.21</td></tr>
    <tr><td>g4dn.xlarge (T4)</td><td>N. Virginia</td><td>0.526</td><td>0.2204</td><td>1.58</td></tr>
    <tr><td>g5.xlarge (A10G)</td><td>N. Virginia</td><td>1.006</td><td>0.5006</td><td>3.02</td></tr>
    <tr><td>g6.xlarge (L4)</td><td>N. Virginia</td><td>0.8048</td><td>0.105</td><td>2.41</td></tr>
    <tr><td>g6e.xlarge (L40S)</td><td>N. Virginia</td><td>1.861</td><td>—</td><td>5.58</td></tr>
  </tbody>
</table>
<p>Two habits make GPU bills small: <strong>Spot</strong> for anything that can resume from a checkpoint (lesson 4.5), and <strong>stop the machine the minute the job ends</strong> — a forgotten g5.xlarge on-demand is about 734 USD a month. Put the job in user data that ends with <code>shutdown -h now</code> and set <code>--instance-initiated-shutdown-behavior terminate</code>, so the machine deletes itself when done.</p>

<h3>EC2 GPU vs a rented GPU box vs your own card</h3>
<table>
  <thead><tr><th></th><th>EC2 GPU</th><th>GPU marketplace (hourly rental)</th><th>Card at home</th></tr></thead>
  <tbody>
    <tr><td>Price per hour</td><td>Highest (Spot helps)</td><td>Often much lower</td><td>Electricity only, after buying the card</td></tr>
    <tr><td>Reliability</td><td>SLA, same APIs, IAM, VPC</td><td>Varies by host; machines can vanish</td><td>Yours — as reliable as your power and network</td></tr>
    <tr><td>Security</td><td>Your account, encrypted disks, private network</td><td>Someone else's hardware: assume they can see your data</td><td>Physical access is yours</td></tr>
    <tr><td>Fits</td><td>Production inference, regulated data, integration with S3/ECS</td><td>Batch jobs on non-sensitive data</td><td>Learning, experiments, small batch work</td></tr>
  </tbody>
</table>
<p>cuongthai.com itself follows the principle in the last two columns: heavy, non-sensitive batch work (such as rendering lesson videos) runs on a GPU machine rented by the hour or on a home machine, and the rented machine is destroyed when the batch is done. If that work ever handled customer data, EC2 would be the right home.</p>

<h3>🔓 Hacker's view: GPUs are what thieves want</h3>
<p>The most profitable thing to do with a stolen AWS key is to launch the largest machines the account allows and mine cryptocurrency — the EleKtra-Leak campaign in lesson 1.7 did exactly that within minutes of keys appearing on GitHub. Here the small default GPU quota is your friend: keep it at the level you need, alert on any quota increase request you did not make, and restrict instance families with an SCP (Chapter 13). Never paste keys or private data into a machine on a GPU marketplace — the host controls the hardware.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Learning:</strong> start on your own GPU or a free notebook service; move to EC2 when you need a specific GPU, more memory, or integration with the rest of AWS.</li>
  <li><strong>At work:</strong> “we need a GPU” is followed by three questions — how much GPU memory, how many hours per month, and can it be interrupted. Your answer decides between g6 Spot, a Savings Plan, or a managed service (SageMaker, Bedrock).</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“Your g5 launch fails with VcpuLimitExceeded. Why?”</strong> — The account's vCPU quota for G instances in that region is too low; request an increase in Service Quotas.</li>
  <li><strong>“How would you cut the cost of a nightly GPU batch job?”</strong> — Spot with checkpointing, the smallest GPU whose memory fits, a self-terminating machine, and a region where the family is cheaper if data rules allow.</li>
  <li><strong>“g4dn vs g5 vs g6?”</strong> — T4 16 GB cheapest; A10G 24 GB faster for rendering and mid-size models; L4 24 GB efficient inference with fractional sizes.</li>
</ol>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
  <li>On LocalStack list g4dn.xlarge, g5.xlarge and g6.xlarge with GPU name and memory.</li>
  <li>From the price files, compute the monthly cost of a g5.xlarge left running on-demand in N. Virginia, and of the same 3-hour daily job on Spot.</li>
  <li>Write user data that runs a job script and then powers the machine off, and launch it with shutdown behaviour <code>terminate</code>.</li>
</ol>
<p><strong>Done when:</strong> your forgotten-machine figure is about 734 USD and the 3-hour-a-day Spot figure is under 50 USD (3 × 0.5006 × 30 ≈ 45), and your launch command contains <code>--instance-initiated-shutdown-behavior terminate</code>.</p>
${giai('Hint: commands', bash(`
aws ec2 describe-instance-types --instance-types g4dn.xlarge g5.xlarge g6.xlarge \\
  --query 'InstanceTypes[].[InstanceType,GpuInfo.Gpus[0].Name,GpuInfo.Gpus[0].MemoryInfo.SizeInMiB]' --output text
python3 -c "print(1.006*730, 3*0.5006*30)"
printf '#!/bin/bash\\n/opt/job/run.sh\\nshutdown -h now\\n' > job.sh
aws ec2 run-instances --image-id $AMI --instance-type g6.xlarge --user-data file://job.sh \\
  --instance-initiated-shutdown-behavior terminate --instance-market-options MarketType=spot`))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">G family</span><span class="v">EC2 GPU instances for inference and graphics (g4dn, g5, g6, g6e).</span></div>
  <div class="kv"><span class="k">P family</span><span class="v">EC2 GPU instances for large-scale training (p4, p5).</span></div>
  <div class="kv"><span class="k">Service Quotas</span><span class="v">Per-region limits; GPU instances are capped in vCPUs.</span></div>
  <div class="kv"><span class="k">VcpuLimitExceeded</span><span class="v">Launch error when a request would exceed the vCPU quota.</span></div>
  <div class="kv"><span class="k">Shutdown behaviour</span><span class="v">stop or terminate when the OS powers off; terminate makes jobs self-cleaning.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Choose a GPU by memory first: T4 16 GB, A10G/L4 24 GB, L40S 48 GB.</li>
  <li>New accounts need a vCPU quota increase before the first GPU launch.</li>
  <li>Spot + checkpoints + self-terminating machines keep GPU bills small.</li>
  <li>Marketplace GPUs are cheaper but untrusted; keep sensitive data on EC2 or at home.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', '🖥️', 'AWS docs — Accelerated computing instance specifications', 'GPU model and memory for every G and P size.')}
${tl('https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html', '📈', 'AWS docs — Requesting a quota increase', 'How to raise the vCPU quota before your first GPU launch.')}

<h3>Sources</h3>
<ul>
  <li>Accelerated computing specifications (T4 16 GiB, A10G 22 GiB): <a href="https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html" target="_blank" rel="noopener">docs.aws.amazon.com/ec2/latest/instancetypes/ac.html</a></li>
  <li>G6 (NVIDIA L4, 24 GB per GPU, fractional sizes): <a href="https://aws.amazon.com/ec2/instance-types/g6/" target="_blank" rel="noopener">aws.amazon.com/ec2/instance-types/g6/</a></li>
  <li>G5 (A10G, 24 GB per GPU): <a href="https://aws.amazon.com/ec2/instance-types/g5/" target="_blank" rel="noopener">aws.amazon.com/ec2/instance-types/g5/</a></li>
  <li>G4 (T4): <a href="https://aws.amazon.com/ec2/instance-types/g4/" target="_blank" rel="noopener">aws.amazon.com/ec2/instance-types/g4/</a></li>
  <li>EC2 service quotas (vCPU-based limits): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html</a></li>
  <li>Request a quota increase: <a href="https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html" target="_blank" rel="noopener">docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html</a></li>
  <li>Price data: AWS on-demand price files for Asia Pacific (Singapore) and US East (N. Virginia), Linux, and the public Spot price page, downloaded 19/11/2026.</li>
</ul>
</div>
`;

const L46_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 6</span>
<h2>4.6 — Máy GPU: g4dn, g5, g6 so với thuê máy GPU</h2>
<p class="lead">Huấn luyện mô hình, chép lời từ âm thanh, tạo giọng nói, dựng video: có những việc cần GPU. EC2 cho thuê GPU theo giây như mọi máy khác, nhưng máy GPU khác ở ba điểm hay làm người mới vấp: <strong>đắt theo giờ</strong>, nhiều region không có đủ mọi họ máy, và tài khoản mới thường có <strong>hạn mức (quota)</strong> quá nhỏ để bật nổi một máy. Bài này đọc danh mục GPU, tính giá một việc thật, và so cloud với lựa chọn khác mà nhiều lập trình viên dùng — thuê máy GPU theo giờ ở chợ GPU, hoặc dùng chiếc dưới gầm bàn.</p>

<h3>Hình dung: thuê xe tải</h3>
<p>Bạn không mua xe tải để chuyển nhà một lần. Bạn thuê — theo ngày ở hãng cho thuê lớn (chắc chắn, có bảo hiểm, đắt hơn), hoặc của hàng xóm (rẻ hơn, nhưng phanh hỏng là chuyện của họ và của bạn). GPU là chiếc xe tải. EC2 là hãng cho thuê; chợ GPU là hàng xóm; card trong máy tính của bạn là cái rơ-moóc xe đạp bạn đã có sẵn.</p>

<h3>Các họ máy GPU bạn sẽ gặp</h3>
<table>
  <thead><tr><th>Họ</th><th>GPU</th><th>Bộ nhớ GPU</th><th>Dùng điển hình</th></tr></thead>
  <tbody>
    <tr><td><strong>g4dn</strong></td><td>NVIDIA T4</td><td>16 GB</td><td>Suy luận rẻ nhất, huấn luyện nhẹ, chuyển mã video</td></tr>
    <tr><td><strong>g5</strong></td><td>NVIDIA A10G</td><td>24 GB (bảng của AWS ghi 22 GiB dùng được)</td><td>Suy luận mô hình cỡ vừa, dựng hình</td></tr>
    <tr><td><strong>g6</strong></td><td>NVIDIA L4</td><td>24 GB</td><td>Suy luận tiết kiệm, AI cho video; có cỡ chia nhỏ (1/8 GPU)</td></tr>
    <tr><td><strong>g6e</strong></td><td>NVIDIA L40S</td><td>48 GB</td><td>Mô hình lớn hơn, AI tạo sinh</td></tr>
    <tr><td>p4 / p5</td><td>A100 / H100</td><td>40–80 GB</td><td>Huấn luyện quy mô lớn — vượt xa ngân sách sinh viên</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật: danh mục, hạn mức và card bạn đang có</h3>
${OUT_46_GPU}
<ul>
  <li>Danh mục cho thấy GPU duy nhất của mỗi máy và bộ nhớ của nó. Bộ nhớ GPU quyết định mô hình nào vừa; số vCPU ít quan trọng hơn.</li>
  <li><strong>Service Quotas:</strong> máy GPU bị giới hạn bởi hạn mức theo region tính bằng <strong>vCPU</strong> — “Running On-Demand G and VT instances” (mã <code>L-DB2E81BA</code>). Ở tài khoản mới nó thường quá thấp cho cả một g5.xlarge (4 vCPU); bạn gửi yêu cầu nâng và chờ duyệt, có khi vài ngày. LocalStack không làm Service Quotas, như lỗi cho thấy — trên tài khoản thật cùng lệnh in ra giá trị hiện tại.</li>
  <li>Dòng cuối là GPU của chiếc máy dựng khoá học này: RTX 3060 12 GB. Với nhiều việc cỡ sinh viên, card gia dụng ở nhà là đủ.</li>
</ul>

<h3>Tính giá một việc thật</h3>
<p>Giá lấy từ tệp giá của AWS ngày 19/11/2026. Ở Singapore tệp giá có g4dn (và g5g chạy ARM) nhưng không có g5 hay g6; hai họ đó tính theo US East (N. Virginia).</p>
<table>
  <thead><tr><th>Máy</th><th>Region</th><th>On-demand USD/giờ</th><th>Spot USD/giờ (hôm đó)</th><th>Việc 3 giờ, on-demand</th></tr></thead>
  <tbody>
    <tr><td>g4dn.xlarge (T4)</td><td>Singapore</td><td>0,736</td><td>0,236</td><td>2,21</td></tr>
    <tr><td>g4dn.xlarge (T4)</td><td>N. Virginia</td><td>0,526</td><td>0,2204</td><td>1,58</td></tr>
    <tr><td>g5.xlarge (A10G)</td><td>N. Virginia</td><td>1,006</td><td>0,5006</td><td>3,02</td></tr>
    <tr><td>g6.xlarge (L4)</td><td>N. Virginia</td><td>0,8048</td><td>0,105</td><td>2,41</td></tr>
    <tr><td>g6e.xlarge (L40S)</td><td>N. Virginia</td><td>1,861</td><td>—</td><td>5,58</td></tr>
  </tbody>
</table>
<p>Hai thói quen giữ hoá đơn GPU nhỏ: <strong>Spot</strong> cho việc nào tiếp tục được từ điểm lưu (bài 4.5), và <strong>tắt máy ngay phút việc xong</strong> — một g5.xlarge on-demand bị quên tốn khoảng 734 USD mỗi tháng. Đặt việc vào user data kết thúc bằng <code>shutdown -h now</code> và đặt <code>--instance-initiated-shutdown-behavior terminate</code>, để máy tự xoá khi làm xong.</p>

<h3>GPU trên EC2, máy GPU thuê theo giờ, hay card của bạn</h3>
<table>
  <thead><tr><th></th><th>GPU trên EC2</th><th>Chợ GPU (thuê theo giờ)</th><th>Card ở nhà</th></tr></thead>
  <tbody>
    <tr><td>Giá mỗi giờ</td><td>Cao nhất (Spot đỡ được)</td><td>Thường thấp hơn nhiều</td><td>Chỉ tiền điện, sau khi đã mua card</td></tr>
    <tr><td>Độ tin cậy</td><td>Có SLA, cùng API, IAM, VPC</td><td>Tuỳ chủ máy; máy có thể biến mất</td><td>Của bạn — tin cậy như điện và mạng nhà bạn</td></tr>
    <tr><td>Bảo mật</td><td>Tài khoản của bạn, ổ mã hoá, mạng riêng</td><td>Phần cứng của người khác: coi như họ thấy được dữ liệu</td><td>Bạn giữ quyền tiếp cận vật lý</td></tr>
    <tr><td>Hợp với</td><td>Suy luận production, dữ liệu bị quản lý, tích hợp S3/ECS</td><td>Việc theo lô với dữ liệu không nhạy cảm</td><td>Học, thử nghiệm, việc lô nhỏ</td></tr>
  </tbody>
</table>
<p>Chính cuongthai.com làm theo nguyên tắc của hai cột cuối: việc lô nặng, không nhạy cảm (như dựng video bài giảng) chạy trên máy GPU thuê theo giờ hoặc máy ở nhà, và máy thuê bị xoá khi xong đợt. Nếu việc đó có đụng dữ liệu khách hàng, EC2 mới là chỗ đúng.</p>

<h3>🔓 Góc hacker: GPU là thứ kẻ trộm thèm nhất</h3>
<p>Việc sinh lời nhất với một khoá AWS bị đánh cắp là bật những máy to nhất tài khoản cho phép để đào tiền mã hoá — chiến dịch EleKtra-Leak ở bài 1.7 làm đúng như vậy chỉ vài phút sau khi khoá xuất hiện trên GitHub. Ở đây hạn mức GPU mặc định nhỏ lại là bạn: giữ nó ở mức bạn cần, đặt cảnh báo cho mọi yêu cầu nâng hạn mức mà bạn không gửi, và giới hạn họ máy bằng SCP (Chương 13). Đừng bao giờ dán khoá hay dữ liệu riêng vào máy ở chợ GPU — chủ máy nắm phần cứng.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Khi học:</strong> bắt đầu bằng GPU của bạn hoặc dịch vụ notebook miễn phí; chuyển sang EC2 khi cần đúng một loại GPU, nhiều bộ nhớ hơn, hoặc gắn với phần còn lại của AWS.</li>
  <li><strong>Đi làm:</strong> sau câu “mình cần GPU” là ba câu hỏi — cần bao nhiêu bộ nhớ GPU, bao nhiêu giờ mỗi tháng, có ngắt được không. Câu trả lời của bạn quyết định giữa g6 Spot, một Savings Plan, hay dịch vụ có quản lý (SageMaker, Bedrock).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Bật g5 bị lỗi VcpuLimitExceeded. Vì sao?”</strong> — Hạn mức vCPU cho máy G của tài khoản ở region đó quá thấp; gửi yêu cầu nâng trong Service Quotas.</li>
  <li><strong>“Giảm chi phí một việc GPU chạy mỗi đêm thế nào?”</strong> — Spot có điểm lưu, GPU nhỏ nhất mà bộ nhớ vừa, máy tự terminate, và region rẻ hơn nếu quy định dữ liệu cho phép.</li>
  <li><strong>“g4dn, g5, g6 khác nhau ra sao?”</strong> — T4 16 GB rẻ nhất; A10G 24 GB nhanh hơn cho dựng hình và mô hình cỡ vừa; L4 24 GB suy luận tiết kiệm, có cỡ chia nhỏ.</li>
</ol>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên LocalStack liệt kê g4dn.xlarge, g5.xlarge và g6.xlarge kèm tên GPU và bộ nhớ.</li>
  <li>Từ tệp giá, tính tiền một tháng cho g5.xlarge bị quên chạy on-demand ở N. Virginia, và cho cùng việc 3 giờ mỗi ngày chạy Spot.</li>
  <li>Viết user data chạy một script việc rồi tắt máy, và khởi chạy nó với hành vi tắt máy <code>terminate</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> con số máy bị quên khoảng 734 USD và con số Spot 3 giờ mỗi ngày dưới 50 USD (3 × 0,5006 × 30 ≈ 45), và lệnh khởi chạy có <code>--instance-initiated-shutdown-behavior terminate</code>.</p>
${giai('Gợi ý: các lệnh', bash(`
aws ec2 describe-instance-types --instance-types g4dn.xlarge g5.xlarge g6.xlarge \\
  --query 'InstanceTypes[].[InstanceType,GpuInfo.Gpus[0].Name,GpuInfo.Gpus[0].MemoryInfo.SizeInMiB]' --output text
python3 -c "print(1.006*730, 3*0.5006*30)"
printf '#!/bin/bash\\n/opt/job/run.sh\\nshutdown -h now\\n' > job.sh
aws ec2 run-instances --image-id $AMI --instance-type g6.xlarge --user-data file://job.sh \\
  --instance-initiated-shutdown-behavior terminate --instance-market-options MarketType=spot`))}
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Họ G</span><span class="v">Máy GPU của EC2 cho suy luận và đồ hoạ (g4dn, g5, g6, g6e).</span></div>
  <div class="kv"><span class="k">Họ P</span><span class="v">Máy GPU của EC2 cho huấn luyện quy mô lớn (p4, p5).</span></div>
  <div class="kv"><span class="k">Service Quotas</span><span class="v">Giới hạn theo region; máy GPU bị giới hạn theo số vCPU.</span></div>
  <div class="kv"><span class="k">VcpuLimitExceeded</span><span class="v">Lỗi khởi chạy khi yêu cầu vượt hạn mức vCPU.</span></div>
  <div class="kv"><span class="k">Hành vi tắt máy</span><span class="v">stop hoặc terminate khi hệ điều hành tắt nguồn; terminate làm việc tự dọn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chọn GPU theo bộ nhớ trước: T4 16 GB, A10G/L4 24 GB, L40S 48 GB.</li>
  <li>Tài khoản mới phải xin nâng hạn mức vCPU trước lần bật GPU đầu tiên.</li>
  <li>Spot + điểm lưu + máy tự terminate giữ hoá đơn GPU nhỏ.</li>
  <li>GPU ở chợ rẻ hơn nhưng không tin cậy được; dữ liệu nhạy cảm để trên EC2 hoặc ở nhà.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html', '🖥️', 'Tài liệu AWS — Thông số máy tăng tốc', 'Loại GPU và bộ nhớ của mọi cỡ G và P.')}
${tl('https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html', '📈', 'Tài liệu AWS — Yêu cầu nâng hạn mức', 'Cách nâng hạn mức vCPU trước lần bật GPU đầu tiên.')}

<h3>Nguồn</h3>
<ul>
  <li>Thông số máy tăng tốc (T4 16 GiB, A10G 22 GiB): <a href="https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html" target="_blank" rel="noopener">docs.aws.amazon.com/ec2/latest/instancetypes/ac.html</a></li>
  <li>G6 (NVIDIA L4, 24 GB mỗi GPU, cỡ chia nhỏ): <a href="https://aws.amazon.com/ec2/instance-types/g6/" target="_blank" rel="noopener">aws.amazon.com/ec2/instance-types/g6/</a></li>
  <li>G5 (A10G, 24 GB mỗi GPU): <a href="https://aws.amazon.com/ec2/instance-types/g5/" target="_blank" rel="noopener">aws.amazon.com/ec2/instance-types/g5/</a></li>
  <li>G4 (T4): <a href="https://aws.amazon.com/ec2/instance-types/g4/" target="_blank" rel="noopener">aws.amazon.com/ec2/instance-types/g4/</a></li>
  <li>Hạn mức dịch vụ EC2 (giới hạn theo vCPU): <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html</a></li>
  <li>Yêu cầu nâng hạn mức: <a href="https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html" target="_blank" rel="noopener">docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html</a></li>
  <li>Dữ liệu giá: tệp giá on-demand của AWS cho Asia Pacific (Singapore) và US East (N. Virginia), Linux, và trang giá Spot công khai, tải ngày 19/11/2026.</li>
</ul>
</div>
`;

/* ═════ 4.7 — Lab chương 4 ═════ */
const L47_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 7 · Lab</span>
<h2>4.7 — Chapter 4 lab: the LabFlow API on EC2, built to pass a grader</h2>
<p class="lead">Time to put the chapter together. You will launch the LabFlow health API on EC2 the way a careful team would: a key made on your laptop, a security group with one port and no SSH, a launch template that requires IMDSv2 and carries the user data, encrypted gp3 disks, the right instance size — and nothing left billing afterwards. A grader script checks eight things. First you will watch a quick-and-dirty version fail, then fix it yourself before opening the solution.</p>

<h3>The brief</h3>
<ul>
  <li>Key pair <code>labflow</code>, type <strong>ed25519</strong>, generated locally and imported.</li>
  <li>Security group <code>labflow-api</code>: inbound <strong>tcp 3000 only</strong>. No port 22 — use Session Manager if you need a shell.</li>
  <li>Launch template <code>labflow-api</code>: Amazon Linux 2023 AMI from the SSM parameter, t3.micro or t4g.micro, IMDSv2 <strong>required</strong> with hop limit 1, root volume <strong>gp3</strong>, user data = the script from lesson 4.2, tag <code>Name=labflow-api</code>.</li>
  <li>EBS encryption by default <strong>on</strong> for the region.</li>
  <li>Exactly one instance <code>labflow-api</code> running from the template, answering <code>GET /health</code>.</li>
  <li>No unattached (<code>available</code>) volumes.</li>
</ul>

<h3>The grader</h3>
<p>It works against a real account or LocalStack (set <code>AWS_ENDPOINT_URL</code>). <code>API_URL</code> points to the machine's public address, e.g. <code>http://&lt;public-ip&gt;:3000</code>.</p>
${MA_CHAM}

<h3>Run it on the quick-and-dirty version first</h3>
<p>This is what a hurried first attempt looks like: an RSA key created by AWS, port 22 open to the world, a t3.medium “to be safe”, no template, IMDS left optional, and a spare gp2 volume “for later”.</p>
${MA_TRUOC}
${OUT_47_TRUOC}
<p>One point out of eight — and it is the one people check by eye: the API answers. Everything a reviewer or an attacker would look at fails. Rule 1 even shows LocalStack's honesty: the key exists, but it is <code>rsa</code>, not <code>ed25519</code>.</p>

<div class="callout warn"><p><strong>Stop here.</strong> Write your own version and run the grader until it says 8/8. Then compare with the solution.</p></div>

${giai('Solution — AWS CLI (giai.sh) and its run', MA_GIAI + `<p>Two LocalStack 4.12 differences shaped this script, both measured: it <strong>ignores launch template data</strong> on <code>run-instances</code> (so the type, IMDS options and tag are repeated — harmless on AWS), and it <strong>drops <code>Encrypted</code> and <code>DeleteOnTermination</code></strong> from the template's block device mapping — so rule 5 checks the region-wide <em>encryption by default</em> setting, which is the stronger control anyway. In the run below the “machine” is a container running cloud-init on the user data read back from the template, published on port 43300.</p>` + OUT_47_GIAI)}

<h3>Clean up — and prove it</h3>
<p>Order matters: terminate the instance and <strong>wait</strong> for <code>terminated</code>, then delete the template, the security group (it cannot go while an instance uses it), the key, and any <code>available</code> volume. Then ask “what is still billing?”.</p>
${MA_DON}
${MA_CONGI}
<p>In the run above every counter is 0 except “Snapshot của tôi: 1095”: that is LocalStack's preloaded catalogue of AMI snapshots under its fake account, not something you made. On a real account <code>--owner-ids self</code> shows only yours — and it should be 0 after this lab.</p>

<h3>Rubric</h3>
<table>
  <thead><tr><th>#</th><th>Check</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>ed25519 key, imported</td><td>Private key never travels through AWS</td></tr>
    <tr><td>2</td><td>SG: only tcp 3000</td><td>No SSH surface for scanners (lessons 3.3, 3.6)</td></tr>
    <tr><td>3</td><td>IMDSv2 required, hop limit 1</td><td>Blocks the Capital One path (lesson 4.4)</td></tr>
    <tr><td>4</td><td>User data in the template</td><td>Any new machine configures itself (lesson 4.2)</td></tr>
    <tr><td>5</td><td>gp3 + encryption by default</td><td>Right disk type, data encrypted at rest (lesson 4.3)</td></tr>
    <tr><td>6</td><td>One t3/t4g.micro running</td><td>Right-sized, no duplicates (lesson 4.5)</td></tr>
    <tr><td>7</td><td>No available volumes</td><td>Nothing billing for nothing</td></tr>
    <tr><td>8</td><td>/health answers</td><td>It actually works</td></tr>
  </tbody>
</table>

<h3>🎤 Five interview questions for this chapter</h3>
<ol>
  <li><strong>“Design a single EC2 web server securely.”</strong> — Private key never leaves the laptop (or no SSH at all, Session Manager), SG with only the app port (better: only from the load balancer, Chapter 5), IMDSv2, least-privilege instance role, encrypted gp3, user data or AMI for configuration, patching plan.</li>
  <li><strong>“The instance is running but the app does not respond. Your steps?”</strong> — Security group and NACL for the port; <code>cloud-init status</code> and <code>cloud-init-output.log</code>; is the process listening (<code>ss -ltnp</code>); system log via <code>get-console-output</code>.</li>
  <li><strong>“Explain stop vs terminate vs hibernate in cost terms.”</strong> — Stopped: no compute, EBS still billed; terminated: compute gone, root disk deleted by default; hibernate: RAM saved to the encrypted root volume, billed as stopped.</li>
  <li><strong>“How do you make sure a new server is identical to the old one?”</strong> — Launch template version + same AMI parameter + idempotent user data (or a baked AMI); never configure by hand.</li>
  <li><strong>“What would you check in a monthly EC2 cost review?”</strong> — Idle or oversized instances, stopped instances with large volumes, available volumes, old snapshots, public IPv4 count, Spot/Graviton/Savings Plans opportunities.</li>
</ol>

<h3>🧪 Practice — this lab is the practice</h3>
<p><strong>Done when:</strong> your own version scores <strong>ĐIỂM 8/8</strong>, and after cleaning up, <code>con-gi.sh</code> shows 0 running, 0 stopped, 0 volumes and 0 Elastic IPs. On a real account also: 0 snapshots of your own.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Grader (cham.sh)</span><span class="v">Script that turns the brief into 8 objective checks.</span></div>
  <div class="kv"><span class="k">Encryption by default</span><span class="v">Region setting: every new EBS volume and snapshot is encrypted.</span></div>
  <div class="kv"><span class="k">Instance-initiated shutdown</span><span class="v">What happens when the OS powers off: stop or terminate.</span></div>
  <div class="kv"><span class="k">aws ec2 wait</span><span class="v">CLI waiter that blocks until a state is reached (e.g. instance-terminated).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Working is 1/8: a secure, reproducible, cheap server is the other 7.</li>
  <li>The launch template carries the whole recipe: AMI, type, IMDSv2, disk, user data, tags.</li>
  <li>Clean up in dependency order and check what still bills.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html', '📋', 'AWS docs — Launch templates', 'Everything a template can carry, and versions.')}
${tl('https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html', '🖥️', 'AWS docs — Session Manager', 'A shell without port 22 or keys.')}

<h3>Sources</h3>
<ul>
  <li>Launch templates: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html</a></li>
  <li>Session Manager: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html</a></li>
  <li>EBS encryption by default: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html</a></li>
  <li>Instance metadata options: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html</a></li>
  <li>Instance state changes: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html</a></li>
</ul>
</div>
`;

const L47_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 7 · Lab</span>
<h2>4.7 — Lab chương 4: API LabFlow trên EC2, dựng để qua bộ chấm</h2>
<p class="lead">Đến lúc ghép cả chương lại. Bạn sẽ chạy API kiểm sức khoẻ của LabFlow trên EC2 theo cách một nhóm cẩn thận làm: khoá sinh trên laptop, security group một cổng không SSH, launch template bắt IMDSv2 và mang user data, ổ gp3 mã hoá, cỡ máy đúng — và không để lại gì tính tiền sau đó. Một script chấm kiểm tám điều. Trước hết bạn xem một bản làm vội trượt, rồi tự sửa trước khi mở lời giải.</p>

<h3>Đề bài</h3>
<ul>
  <li>Key pair <code>labflow</code>, kiểu <strong>ed25519</strong>, sinh trên máy bạn rồi import.</li>
  <li>Security group <code>labflow-api</code>: chiều vào <strong>chỉ tcp 3000</strong>. Không cổng 22 — cần shell thì dùng Session Manager.</li>
  <li>Launch template <code>labflow-api</code>: AMI Amazon Linux 2023 lấy từ tham số SSM, t3.micro hoặc t4g.micro, IMDSv2 <strong>bắt buộc</strong> với hop limit 1, ổ gốc <strong>gp3</strong>, user data = script của bài 4.2, thẻ <code>Name=labflow-api</code>.</li>
  <li>Mã hoá EBS mặc định <strong>bật</strong> cho region.</li>
  <li>Đúng một máy <code>labflow-api</code> chạy từ template, trả lời <code>GET /health</code>.</li>
  <li>Không có ổ nằm không (<code>available</code>).</li>
</ul>

<h3>Bộ chấm</h3>
<p>Chạy được với tài khoản thật hoặc LocalStack (đặt <code>AWS_ENDPOINT_URL</code>). <code>API_URL</code> trỏ tới địa chỉ công khai của máy, ví dụ <code>http://&lt;ip-công-khai&gt;:3000</code>.</p>
${MA_CHAM}

<h3>Chạy thử trên bản làm vội trước</h3>
<p>Đây là dáng một lần thử vội: khoá RSA do AWS tạo, cổng 22 mở cho cả thế giới, t3.medium “cho chắc”, không template, IMDS để tuỳ chọn, và một ổ gp2 dự phòng “để sau dùng”.</p>
${MA_TRUOC}
${OUT_47_TRUOC}
<p>Một điểm trên tám — và đó là điểm người ta hay nhìn bằng mắt: API trả lời. Mọi thứ người soát hay kẻ tấn công nhìn vào đều trượt. Luật 1 còn cho thấy LocalStack thật thà: khoá có tồn tại, nhưng là <code>rsa</code>, không phải <code>ed25519</code>.</p>

<div class="callout warn"><p><strong>Dừng ở đây.</strong> Tự viết bản của bạn và chạy bộ chấm tới khi ra 8/8. Rồi mới so với lời giải.</p></div>

${giai('Lời giải — AWS CLI (giai.sh) và lần chạy', MA_GIAI + `<p>Hai chỗ khác của LocalStack 4.12 định hình script này, cả hai đều đo thật: nó <strong>lờ dữ liệu launch template</strong> khi <code>run-instances</code> (nên loại máy, tuỳ chọn IMDS và thẻ được nhắc lại — vô hại trên AWS), và nó <strong>làm rơi <code>Encrypted</code> và <code>DeleteOnTermination</code></strong> khỏi khai báo ổ của template — nên luật 5 kiểm thiết lập <em>mã hoá mặc định</em> của cả region, vốn là chốt chặn mạnh hơn. Trong lần chạy dưới, “máy” là một container chạy cloud-init với user data đọc ngược từ template, mở ra ở cổng 43300.</p>` + OUT_47_GIAI)}

<h3>Dọn — và chứng minh</h3>
<p>Thứ tự quan trọng: terminate máy và <strong>chờ</strong> tới <code>terminated</code>, rồi xoá template, security group (không xoá được khi còn máy dùng nó), khoá, và mọi ổ <code>available</code>. Sau đó hỏi “cái gì còn tính tiền?”.</p>
${MA_DON}
${MA_CONGI}
<p>Trong lần chạy ở trên, mọi bộ đếm đều 0 trừ “Snapshot của tôi: 1095”: đó là danh mục snapshot AMI nạp sẵn của LocalStack dưới tài khoản giả của nó, không phải thứ bạn tạo. Trên tài khoản thật, <code>--owner-ids self</code> chỉ hiện snapshot của bạn — và phải là 0 sau lab này.</p>

<h3>Thang chấm</h3>
<table>
  <thead><tr><th>#</th><th>Kiểm</th><th>Vì sao quan trọng</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Khoá ed25519, import</td><td>Khoá riêng không bao giờ đi qua AWS</td></tr>
    <tr><td>2</td><td>SG: chỉ tcp 3000</td><td>Không có bề mặt SSH cho máy quét (bài 3.3, 3.6)</td></tr>
    <tr><td>3</td><td>IMDSv2 bắt buộc, hop limit 1</td><td>Chặn con đường của vụ Capital One (bài 4.4)</td></tr>
    <tr><td>4</td><td>User data trong template</td><td>Máy mới nào cũng tự cấu hình (bài 4.2)</td></tr>
    <tr><td>5</td><td>gp3 + mã hoá mặc định</td><td>Đúng loại ổ, dữ liệu được mã hoá khi nằm yên (bài 4.3)</td></tr>
    <tr><td>6</td><td>Một t3/t4g.micro đang chạy</td><td>Đúng cỡ, không trùng máy (bài 4.5)</td></tr>
    <tr><td>7</td><td>Không ổ available</td><td>Không gì tính tiền vô ích</td></tr>
    <tr><td>8</td><td>/health trả lời</td><td>Nó chạy thật</td></tr>
  </tbody>
</table>

<h3>🎤 Năm câu phỏng vấn của chương này</h3>
<ol>
  <li><strong>“Thiết kế một máy chủ web EC2 an toàn.”</strong> — Khoá riêng không rời laptop (hoặc không SSH luôn, dùng Session Manager), SG chỉ mở cổng ứng dụng (tốt hơn: chỉ từ load balancer, Chương 5), IMDSv2, role của máy quyền tối thiểu, gp3 mã hoá, user data hoặc AMI để cấu hình, kế hoạch vá.</li>
  <li><strong>“Máy đang chạy mà ứng dụng không phản hồi. Các bước của bạn?”</strong> — Security group và NACL cho cổng đó; <code>cloud-init status</code> và <code>cloud-init-output.log</code>; tiến trình có đang nghe không (<code>ss -ltnp</code>); log hệ thống qua <code>get-console-output</code>.</li>
  <li><strong>“Giải thích stop, terminate, hibernate theo góc độ tiền.”</strong> — Stop: không tính máy, EBS vẫn tính; terminate: hết máy, ổ gốc mặc định bị xoá; hibernate: RAM lưu vào ổ gốc đã mã hoá, tính tiền như stop.</li>
  <li><strong>“Làm sao chắc máy mới giống hệt máy cũ?”</strong> — Phiên bản launch template + cùng tham số AMI + user data chạy lại không sinh lỗi (hoặc AMI đóng sẵn); không bao giờ cấu hình bằng tay.</li>
  <li><strong>“Soát chi phí EC2 hằng tháng bạn xem gì?”</strong> — Máy ngồi không hoặc quá cỡ, máy đã stop còn ổ lớn, ổ available, snapshot cũ, số IPv4 công khai, cơ hội Spot/Graviton/Savings Plans.</li>
</ol>

<h3>🧪 Thực hành — chính lab này là bài thực hành</h3>
<p><strong>Đạt khi:</strong> bản của bạn ra <strong>ĐIỂM 8/8</strong>, và sau khi dọn, <code>con-gi.sh</code> báo 0 máy chạy, 0 máy stop, 0 ổ và 0 Elastic IP. Trên tài khoản thật thêm: 0 snapshot của bạn.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bộ chấm (cham.sh)</span><span class="v">Script biến đề bài thành 8 phép kiểm khách quan.</span></div>
  <div class="kv"><span class="k">Mã hoá mặc định</span><span class="v">Thiết lập theo region: mọi ổ EBS và snapshot mới đều được mã hoá.</span></div>
  <div class="kv"><span class="k">Hành vi khi tắt máy</span><span class="v">Điều xảy ra khi hệ điều hành tắt nguồn: stop hoặc terminate.</span></div>
  <div class="kv"><span class="k">aws ec2 wait</span><span class="v">Lệnh chờ của CLI, chặn tới khi đạt trạng thái (ví dụ instance-terminated).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chạy được mới là 1/8: máy chủ an toàn, dựng lại được, rẻ là 7 phần còn lại.</li>
  <li>Launch template mang cả công thức: AMI, loại máy, IMDSv2, ổ, user data, thẻ.</li>
  <li>Dọn theo thứ tự phụ thuộc và kiểm cái gì còn tính tiền.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html', '📋', 'Tài liệu AWS — Launch template', 'Mọi thứ template mang được, và các phiên bản.')}
${tl('https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html', '🖥️', 'Tài liệu AWS — Session Manager', 'Có shell mà không cần cổng 22 hay khoá.')}

<h3>Nguồn</h3>
<ul>
  <li>Launch template: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html</a></li>
  <li>Session Manager: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html</a></li>
  <li>Mã hoá EBS mặc định: <a href="https://docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html" target="_blank" rel="noopener">docs.aws.amazon.com/ebs/latest/userguide/encryption-by-default.html</a></li>
  <li>Tuỳ chọn metadata của máy: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html</a></li>
  <li>Các trạng thái instance: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html</a></li>
</ul>
</div>
`;

/* ═════ 4.8 — Kiểm tra Chương 4 + export ═════ */
const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ4 = [
  Q('In <code>t4g.micro</code>, what does the letter “g” after the generation number mean?|||Trong <code>t4g.micro</code>, chữ “g” sau số thế hệ nghĩa là gì?', [
    'It has a GPU|||Máy có GPU',
    'It runs on AWS Graviton (ARM) processors|||Máy chạy bộ xử lý AWS Graviton (ARM)',
    'It is a general-purpose family|||Đây là họ đa dụng',
    'It has more network bandwidth|||Máy có băng thông mạng lớn hơn',
  ], 1),
  Q('What is the safest way for a script to choose the Amazon Linux 2023 AMI?|||Cách an toàn nhất để script chọn AMI Amazon Linux 2023 là gì?', [
    'Copy the AMI ID from a blog post into the script|||Chép ID AMI từ một bài blog vào script',
    'Use the same AMI ID in every region|||Dùng cùng một ID AMI cho mọi region',
    'Read the public SSM parameter /aws/service/ami-amazon-linux-latest/…|||Đọc tham số SSM công khai /aws/service/ami-amazon-linux-latest/…',
    'Pick the oldest image so nothing changes|||Chọn ảnh cũ nhất cho khỏi thay đổi',
  ], 2),
  Q('Termination protection is on and you run <code>terminate-instances</code>. What happens?|||Đang bật chống xoá mà bạn chạy <code>terminate-instances</code>. Chuyện gì xảy ra?', [
    'OperationNotPermitted — switch disableApiTermination off first|||OperationNotPermitted — phải tắt disableApiTermination trước',
    'The instance stops instead|||Máy bị stop thay vì terminate',
    'It is terminated after a 24-hour delay|||Máy bị terminate sau 24 giờ',
    'The root volume is deleted but the instance stays|||Ổ gốc bị xoá nhưng máy ở lại',
  ], 0),
  Q('An instance is stopped. What are you still billed for?|||Một máy đang ở trạng thái stopped. Bạn vẫn bị tính tiền gì?', [
    'Nothing at all|||Không gì cả',
    'Compute at half price|||Tiền máy với nửa giá',
    'Its EBS volumes (and any Elastic IP)|||Các ổ EBS của nó (và Elastic IP nếu có)',
    'Only data transfer|||Chỉ tiền truyền dữ liệu',
  ], 2),
  Q('When does a user data shell script run by default?|||Mặc định script user data chạy khi nào?', [
    'On every reboot, as ec2-user|||Mỗi lần reboot, bằng ec2-user',
    'Once per instance at first boot, as root, via cloud-init|||Một lần cho mỗi instance ở lần khởi động đầu, bằng root, qua cloud-init',
    'Only when you SSH in for the first time|||Chỉ khi bạn SSH vào lần đầu',
    'Every hour, like cron|||Mỗi giờ, như cron',
  ], 1),
  Q('The instance is “running” but the API from user data is not answering. Where do you look first?|||Máy “running” mà API trong user data không trả lời. Bạn xem đâu trước?', [
    'The EC2 console billing page|||Trang tính tiền trong console EC2',
    'Reboot until it works|||Reboot tới khi chạy',
    'cloud-init status --long and /var/log/cloud-init-output.log|||cloud-init status --long và /var/log/cloud-init-output.log',
    'The AMI description|||Mô tả của AMI',
  ], 2),
  Q('You attached a second EBS volume, then terminated the instance. What happened to that volume?|||Bạn gắn thêm một ổ EBS rồi terminate máy. Ổ đó ra sao?', [
    'It is deleted with the instance|||Bị xoá cùng máy',
    'It becomes available and keeps billing until you delete it|||Thành available và vẫn tính tiền tới khi bạn xoá',
    'It moves to S3 automatically|||Tự chuyển sang S3',
    'It becomes instance store|||Thành instance store',
  ], 1),
  Q('Why does IMDSv2 stop a typical SSRF from stealing role credentials?|||Vì sao IMDSv2 chặn được SSRF thông thường lấy khoá của role?', [
    'It moves the service off 169.254.169.254|||Nó dời dịch vụ khỏi 169.254.169.254',
    'It encrypts the credentials with your password|||Nó mã hoá khoá bằng mật khẩu của bạn',
    'It needs a PUT for a session token and a token header on every GET|||Nó cần PUT để lấy token phiên và header token ở mọi GET',
    'It only answers requests from the AWS console|||Nó chỉ trả lời yêu cầu từ console AWS',
  ], 2),
  Q('How much warning does a Spot instance get before AWS reclaims it?|||Máy Spot được báo trước bao lâu trước khi AWS thu hồi?', [
    'Two minutes, via spot/instance-action in the metadata service|||Hai phút, qua spot/instance-action trong dịch vụ metadata',
    'None|||Không báo',
    'One hour by email|||Một giờ, qua email',
    'Seven days|||Bảy ngày',
  ], 0),
  Q('Your first g5.xlarge launch fails with VcpuLimitExceeded. What is the fix?|||Lần đầu bật g5.xlarge bị lỗi VcpuLimitExceeded. Sửa thế nào?', [
    'Choose a bigger GPU instance|||Chọn máy GPU to hơn',
    'Request a vCPU quota increase for G instances in Service Quotas|||Xin nâng hạn mức vCPU cho máy G trong Service Quotas',
    'Enable IMDSv2|||Bật IMDSv2',
    'Delete your snapshots|||Xoá các snapshot',
  ], 1),
];

export default {
  title: 'Chapter 4 — Compute: EC2|||Chương 4 — Máy chủ: EC2',
  description: 'EC2 như một VPS thuê theo giây: đọc tên loại máy, AMI qua tham số SSM, khoá ed25519 tự sinh, chống xoá, vòng đời và tiền ở từng trạng thái, SSH thật với hai lỗi kinh điển; user data chạy thật bằng cloud-init (một lần mỗi instance, đọc log khi hỏng), launch template; EBS gp3/io2, ổ còn sót sau terminate, snapshot tăng dần, instance store, EFS; IMDS, SSRF và vụ Capital One 2019 dựng lại bằng bộ giả lập của AWS, IMDSv2; giá thật Singapore on-demand/Spot/Savings Plans/Graviton; máy GPU và hạn mức; lab chấm 8 phép.',
  lessons: [
    {
      title: '4.1 — Launching and connecting to EC2|||4.1 — Tạo và kết nối EC2',
      slug: 'aws-4-1-ec2',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Loại máy t/m/c/r/g và cách đọc tên, AMI qua tham số SSM, khoá ed25519 tự sinh rồi import, SG 22 cho một IP, chống xoá, stop/start/terminate và tiền ở từng trạng thái, SSH thật: đúng khoá, sai khoá, UNPROTECTED PRIVATE KEY FILE.',
      content: L41_EN + L41_VI,
    },
    {
      title: '4.2 — Bootstrapping with user data|||4.2 — Khởi tạo bằng user data',
      slug: 'aws-4-2-user-data',
      type: 'LESSON',
      isFreePreview: true,
      description: 'cloud-init chạy user data thật: một lần mỗi instance bằng root, instance ID mới thì chạy lại, gõ sai thì status error và log chỉ đúng dòng; launch template có phiên bản; đóng ảnh hay cài lúc khởi động; bí mật không để trong user data (Pacu).',
      content: L42_EN + L42_VI,
    },
    {
      title: '4.3 — EBS volumes, snapshots and instance store|||4.3 — Ổ EBS, snapshot và instance store',
      slug: 'aws-4-3-ebs',
      type: 'LESSON',
      isFreePreview: true,
      description: 'gp3 vs io2, ổ gắn thêm còn available sau terminate, ổ bền vs tmpfs (thật), EFS dùng chung, snapshot tăng dần 64→3→0 khối, mã hoá mặc định, nới dung lượng, snapshot công khai (DEF CON 2019).',
      content: L43_EN + L43_VI,
    },
    {
      title: '4.4 — Instance metadata, IMDSv2 and the Capital One breach|||4.4 — Instance metadata, IMDSv2 và vụ Capital One',
      slug: 'aws-4-4-imds',
      type: 'LESSON',
      isFreePreview: true,
      description: 'IMDS ở 169.254.169.254 phát khoá tạm của role; dựng lại SSRF lấy khoá bằng bộ giả lập của AWS, bật IMDSv2 ⇒ 401; vụ Capital One 2019; các lớp phòng: IMDSv2, quyền tối thiểu, lọc SSRF, GuardDuty.',
      content: L44_EN + L44_VI,
    },
    {
      title: '4.5 — Pricing: on-demand, Spot, Savings Plans, Graviton|||4.5 — Giá máy: on-demand, Spot, Savings Plans, Graviton',
      slug: 'aws-4-5-gia',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Giá thật Singapore từ tệp giá AWS: tháng máy, Spot, Graviton rẻ ~20%, ổ + IPv4 ngoài tiền máy, tính theo giây; thông báo thu hồi Spot 2 phút (thật từ bộ giả lập); công thức chọn cách trả tiền.',
      content: L45_EN + L45_VI,
    },
    {
      title: '4.6 — GPU instances: g4dn/g5/g6 vs renting a GPU box|||4.6 — Máy GPU: g4dn/g5/g6 so với thuê máy GPU',
      slug: 'aws-4-6-gpu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Họ máy GPU theo bộ nhớ (T4, A10G, L4, L40S), hạn mức vCPU phải xin, tính giá một việc 3 giờ, máy tự terminate khi xong, so EC2 với chợ GPU thuê theo giờ và card ở nhà.',
      content: L46_EN + L46_VI,
    },
    {
      title: '4.7 — Chapter 4 lab + interview questions|||4.7 — Lab chương 4 + câu hỏi phỏng vấn',
      slug: 'aws-4-7-lab-4',
      type: 'LESSON',
      isFreePreview: true,
      description: 'API LabFlow trên EC2 qua bộ chấm 8 phép: bản vội 1/8 ⇒ lời giải 8/8 (khoá ed25519, SG chỉ 3000, launch template IMDSv2 + user data, gp3 + mã hoá mặc định) ⇒ dọn ⇒ kiểm còn gì tính tiền; 5 câu phỏng vấn.',
      content: L47_EN + L47_VI,
    },
    {
      title: '4.8 — Chapter 4 quiz|||4.8 — Kiểm tra Chương 4',
      slug: 'aws-4-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về tên loại máy, AMI qua SSM, chống xoá, tiền khi stop, user data, log cloud-init, ổ còn sót, IMDSv2, thông báo Spot và hạn mức GPU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ4 },
    },
  ],
};
