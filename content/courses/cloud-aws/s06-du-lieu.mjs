/**
 * Cloud AWS — Chương 6: Cơ sở dữ liệu và bí mật — RDS, vận hành RDS, Secrets Manager/Parameter Store, DynamoDB, ElastiCache
 * (soạn 20/11/2026, agent aws; phiên 25 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   6.1 rds · 6.2 van-hanh-rds · 6.3 bi-mat · 6.4 dynamodb · 6.5 elasticache · 6.6 lab-6 · 6.7 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c6/6N.sh + lab6/chay.sh:
 *   - AWS CLI 2.41.0 → Moto (rds, elasticache — LocalStack community KHÔNG có) và LocalStack 4.12 (secretsmanager, ssm, dynamodb):
 *     chỉ là CẤU HÌNH, không có máy cơ sở dữ liệu nào chạy sau API;
 *   - phần "thật" chạy trong Docker: PostgreSQL 16 (vai RDS: mạng --internal, TLS bắt buộc, WAL archive, bản đọc streaming,
 *     PITR, promote), Valkey 8 (vai ElastiCache), node 24 + pg 8 + ioredis 5 + @aws-sdk v3 (máy app);
 *   - giá: Price List API Singapore 19–20/11/2026 (~/.rtq-aws/gia, ~/.rtq-aws/n6).
 * Khác AWS đã ghi rõ trong bài: Moto tạo instance "available" ngay (AWS mất vài phút), ghi username "admin" trong bí mật rds!,
 *   bỏ qua --no-publicly-accessible khi restore từ snapshot (lời giải sửa lại bằng modify), trả endpoint ElastiCache vùng use1;
 *   LocalStack trả SecureString chưa giải mã dạng "kms:alias/aws/ssm:<giá trị>" (AWS trả chuỗi mã hoá base64) và Tier = None.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/js()/sql() của _chung.mjs.
 */
import { bash, json, js, sql, props, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (scratchpad/aws/lab/c6: AWS CLI 2.41.0 → Moto / LocalStack 4.12; Docker thật: PostgreSQL 16, Valkey 8, node 24) ═════ */
const OUT_61_RDS_API = out("# Hai subnet PRIVATE ở hai AZ (route table không có đường ra Internet Gateway — Chương 3)\n$ aws rds create-db-subnet-group --db-subnet-group-name labflow-db-private --db-subnet-group-description 'private subnets, 2 AZ' --subnet-ids subnet-d5f3d7201c2efa347 subnet-422f1b5c98dba8b47 --query 'DBSubnetGroup.Subnets[].SubnetAvailabilityZone.Name' --output text\nap-southeast-1a\tap-southeast-1b\n# Security group của DB: chỉ nhận 5432 từ security group của app (không có dải IP nào)\n$ aws ec2 authorize-security-group-ingress --group-id sg-e63c366e29b8f2ffd --protocol tcp --port 5432 --source-group sg-19f549164c9ae533e --query 'SecurityGroupRules[0].[IpProtocol,FromPort,ReferencedGroupInfo.GroupId]' --output text\ntcp\t5432\tsg-19f549164c9ae533e\n# Parameter group = postgresql.conf của RDS (không SSH vào máy DB được)\n$ aws rds create-db-parameter-group --db-parameter-group-name labflow-pg16 --db-parameter-group-family postgres16 --description 'LabFlow PostgreSQL 16' --query 'DBParameterGroup.[DBParameterGroupName,DBParameterGroupFamily]' --output text\nlabflow-pg16\tpostgres16\n$ aws rds modify-db-parameter-group --db-parameter-group-name labflow-pg16 --parameters 'ParameterName=log_min_duration_statement,ParameterValue=500,ApplyMethod=immediate' 'ParameterName=rds.force_ssl,ParameterValue=1,ApplyMethod=pending-reboot' --query DBParameterGroupName --output text\nlabflow-pg16\n# Tạo instance: private, mã hoá, mật khẩu chủ do Secrets Manager giữ (không gõ mật khẩu nào)\n$ aws rds create-db-instance --db-instance-identifier labflow-db --engine postgres --engine-version 16.4 --db-instance-class db.t4g.micro --allocated-storage 20 --storage-type gp3 --master-username labflow --manage-master-user-password --db-name labflow --db-subnet-group-name labflow-db-private --vpc-security-group-ids sg-e63c366e29b8f2ffd --db-parameter-group-name labflow-pg16 --no-publicly-accessible --storage-encrypted --backup-retention-period 7 --query 'DBInstance.[DBInstanceIdentifier,DBInstanceClass,Engine,EngineVersion,DBInstanceStatus]' --output text\nlabflow-db\tdb.t4g.micro\tpostgres\t16.4\tavailable\n$ aws rds describe-db-instances --db-instance-identifier labflow-db --query 'DBInstances[0].[Endpoint.Address,Endpoint.Port,PubliclyAccessible,StorageEncrypted,MasterUserSecret.SecretStatus]' --output text\nlabflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\t5432\tFalse\tTrue\tactive\n# Bí mật RDS tự tạo (tên bắt đầu bằng rds!) — mật khẩu đã che\n$ aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:rds!db-2f3fff0c-b291-4b9b-8353-da2b6b141dba… --query SecretString --output text\n{\"username\": \"admin\", \"password\": \"••••••••(đã che)\"}\n# Thử tạo bản CÔNG KHAI, không mã hoá, giữ sao lưu 0 ngày — API vẫn nhận: an toàn là việc của bạn\n$ aws rds create-db-instance --db-instance-identifier labflow-db-voi --engine postgres --db-instance-class db.t4g.micro --allocated-storage 20 --master-username labflow --master-user-password LabFlow-lab-only --publicly-accessible --backup-retention-period 0 --query 'DBInstance.[DBInstanceIdentifier,PubliclyAccessible,StorageEncrypted,BackupRetentionPeriod]' --output text\nlabflow-db-voi\tTrue\tFalse\t0");
const OUT_61_RDS_THAT_A = out("# Ba máy: rds (chỉ ở mạng private 10.146.10.0/24, --internal = không đường ra Internet), app (public + private), ngoai (chỉ public — vai laptop/Internet)\n[ngoai]$ psql 'host=10.146.10.20 user=labflow dbname=labflow connect_timeout=3' -c 'select 1'; echo \"mã thoát $?\"\npsql: error: connection to server at \"10.146.10.20\", port 5432 failed: timeout expired\nmã thoát 2\n# Từ máy app: không TLS ⇒ bị chặn (giống rds.force_ssl=1)\n[app]$ PGPASSWORD=$DB_PASSWORD psql 'host=aws-c6-rds user=labflow dbname=labflow sslmode=disable' -c 'select 1'\npsql: error: connection to server at \"aws-c6-rds\" (10.146.10.20), port 5432 failed: FATAL:  pg_hba.conf rejects connection for host \"10.146.10.10\", user \"labflow\", database \"labflow\", no encryption\n# TLS + kiểm chứng chỉ và tên máy (verify-full)\n[app]$ PGPASSWORD=$DB_PASSWORD psql 'host=aws-c6-rds user=labflow dbname=labflow sslmode=verify-full sslrootcert=/app/ca.crt' -Atc \"select version(); select ssl, version, cipher from pg_stat_ssl where pid = pg_backend_pid()\"\nPostgreSQL 16.16 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit\nt|TLSv1.3|TLS_AES_256_GCM_SHA384");
const OUT_61_RDS_THAT_B = out("# Node.js (pg 8): có CA ⇒ OK; quên CA ⇒ chứng chỉ không tin được\n[app]$ node 61-ket-noi.mjs\nkết nối OK: {\n  nguoi_dung: 'labflow',\n  may_chu: '10.146.10.20',\n  ssl: true,\n  tls: 'TLSv1.3'\n}\n[app]$ node 61-ket-noi.mjs khong-ca\nLỖI: unable to verify the first certificate; if the root CA is installed locally, try running Node.js with --use-system-ca\n# Truy vấn chậm hơn 500 ms ⇒ vào log (log_min_duration_statement — trên RDS đặt trong parameter group)\n[app]$ PGPASSWORD=$DB_PASSWORD psql 'host=aws-c6-rds user=labflow dbname=labflow sslmode=require' -Atc 'select pg_sleep(0.2)' -c 'select pg_sleep(0.7)' >/dev/null; echo xong\nxong\n[may-chu-db]$ docker logs aws-c6-rds 2>&1 | grep duration\nLOG:  duration: 701.867 ms  statement: select pg_sleep(0.7)\n# Ở đây labflow là superuser; trên RDS người dùng chủ chỉ có vai rds_superuser\n[app]$ PGPASSWORD=$DB_PASSWORD psql 'host=aws-c6-rds user=labflow dbname=labflow sslmode=require' -Atc \"select rolname, rolsuper from pg_roles where rolname = current_user\"\nlabflow|t");
const OUT_62_BAN_DOC_THAT = out("[chinh]$ psql -c \"insert into bookings(phong,khung_gio,nguoi) values ('A101','T2 10:00','binh'),('B202','T3 08:00','chi'),('B202','T3 10:00','dung') returning id\"\n2\n3\n4\nINSERT 0 3\n[doc]$ psql -c \"select count(*) as so_dat_lich, pg_is_in_recovery() as la_ban_doc from bookings\"\n4|t\n[chinh]$ psql -c \"select application_name, state, sync_state, coalesce(replay_lag::text,'0') as tre from pg_stat_replication\"\nwalreceiver|streaming|async|00:00:00.005917\n[doc]$ psql -c \"insert into bookings(phong,khung_gio,nguoi) values ('C303','T4 08:00','em')\"\nERROR:  cannot execute INSERT in a read-only transaction");
const OUT_62_CHUYEN_DU_PHONG_THAT = out("# 5. 'Mất AZ': máy chính chết. Đẩy bản đọc lên làm máy chính (RDS Multi-AZ tự làm bước này + đổi DNS)\n$ docker stop aws-c6-chinh\naws-c6-chinh đã dừng\n[doc]$ psql -c \"select pg_promote(wait => true)\"\nt\n# promote mất 0.19 giây\n[doc]$ psql -c \"select pg_is_in_recovery() as con_la_ban_doc\"\nf\n[doc]$ psql -c \"create table bookings_moi(id int); insert into bookings_moi values (1); select 'ghi được' \"\nCREATE TABLE\nINSERT 0 1\nghi được");
const OUT_62_PITR_THAT = out("# 4. Point-in-time restore: base backup + phát lại WAL tới đúng mốc '2026-11-19 20:01:38.415019+00' ⇒ máy MỚI\n[pitr]$ cat $PGDATA/postgresql.auto.conf | tail -3\nrestore_command = 'cp /archive/%f %p'\nrecovery_target_time = '2026-11-19 20:01:38.415019+00'\nrecovery_target_action = 'promote'\n[pitr]$ docker logs aws-c6-pitr | grep -E 'recovery|timeline|ready'\nLOG:  database system is ready to accept read-only connections\nLOG:  recovery stopping before commit of transaction 745, time 2026-11-19 20:01:41.501789+00\nLOG:  selected new timeline ID: 2\nLOG:  archive recovery complete\nLOG:  database system is ready to accept connections\n[pitr]$ psql -c \"select id, phong, khung_gio, nguoi from bookings order by id\"\n1|A101|T2 08:00|an\n2|A101|T2 10:00|binh\n3|B202|T3 08:00|chi\n4|B202|T3 10:00|dung");
const OUT_62_SAO_LUU_THAT = out("# 1. Base backup (vai snapshot tự động hằng đêm) + WAL đẩy dần vào kho lưu trữ (vai 'transaction logs' RDS đẩy lên S3 mỗi 5 phút)\n[sao-luu]$ pg_basebackup -h aws-c6-chinh -U labflow -D /base -X stream\nbase backup xong: 46.0M\n# 2. Bản đọc (read replica) nhận WAL qua streaming\n[doc]$ pg_basebackup -h aws-c6-chinh -U labflow -D $PGDATA -X stream -R -C -S slot_doc\npostgresql.auto.conf\nstandby.signal");
const OUT_62_VAN_HANH_API = out("# Sao lưu tự động: giữ 7 ngày, chạy lúc 18:00–18:30 UTC (= 01:00–01:30 giờ Việt Nam)\n$ aws rds describe-db-instances --db-instance-identifier labflow-db --query 'DBInstances[0].[BackupRetentionPeriod,PreferredBackupWindow,MultiAZ]' --output text\n7\t18:00-18:30\tFalse\n# Snapshot thủ công trước khi migrate — sống tới khi bạn xoá (kể cả khi xoá instance)\n$ aws rds create-db-snapshot --db-instance-identifier labflow-db --db-snapshot-identifier labflow-truoc-migrate-v42 --query 'DBSnapshot.[DBSnapshotIdentifier,SnapshotType,Status,Encrypted]' --output text\nlabflow-truoc-migrate-v42\tmanual\tavailable\tTrue\n# Point-in-time restore: LUÔN ra instance MỚI, endpoint MỚI — app phải đổi chỗ trỏ\n$ aws rds restore-db-instance-to-point-in-time --source-db-instance-identifier labflow-db --target-db-instance-identifier labflow-db-0915 --restore-time 2026-11-20T02:15:00Z --db-instance-class db.t4g.micro --query 'DBInstance.[DBInstanceIdentifier,Endpoint.Address]' --output text\nlabflow-db-0915\tlabflow-db-0915.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\n# Read replica: bản đọc bất đồng bộ, có endpoint riêng\n$ aws rds create-db-instance-read-replica --db-instance-identifier labflow-db-doc --source-db-instance-identifier labflow-db --query 'DBInstance.[DBInstanceIdentifier,ReadReplicaSourceDBInstanceIdentifier,Endpoint.Address]' --output text\nlabflow-db-doc\tlabflow-db\tlabflow-db-doc.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\n# Multi-AZ: bản chờ đồng bộ ở AZ khác, KHÔNG đọc được, cùng một endpoint\n$ aws rds modify-db-instance --db-instance-identifier labflow-db --multi-az --apply-immediately --query 'DBInstance.[MultiAZ,Endpoint.Address]' --output text\nTrue\tlabflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\n# Diễn tập chuyển dự phòng (trên AWS: DNS của endpoint đổi sang bản chờ, thường 60–120 giây)\n$ aws rds reboot-db-instance --db-instance-identifier labflow-db --force-failover --query 'DBInstance.[DBInstanceIdentifier,DBInstanceStatus]' --output text\nlabflow-db\tavailable\n$ aws rds describe-db-snapshots --db-instance-identifier labflow-db --query 'DBSnapshots[].[DBSnapshotIdentifier,SnapshotType]' --output text\nrds:labflow-db-2026-11-19-20-00\tautomated\nlabflow-truoc-migrate-v42\tmanual");
const OUT_62_XOA_NHAM_THAT = out("# 3. Lỡ tay chạy lệnh dọn dẹp trên production\n# (mốc 'còn tốt' ghi lại ngay trước đó: 2026-11-19 20:01:38.415019+00)\n[chinh]$ psql -c \"drop table bookings\"\nDROP TABLE\n# Bản đọc chép LUÔN lỗi — replica/Multi-AZ không phải sao lưu\n[doc]$ psql -c \"select count(*) from bookings\"\nERROR:  relation \"bookings\" does not exist\nLINE 1: select count(*) from bookings\n                             ^\n[chinh]$ psql -c \"select archived_count, last_archived_wal from pg_stat_archiver\"\n8|000000010000000000000006");
const OUT_63_ANH_LO_THAT = out("$ cat Dockerfile\nFROM alpine:3\nENV DB_PASSWORD=LabFlow-lab-only\nCOPY .env /app/.env\nRUN echo \"đã dùng .env lúc build\" && rm /app/.env\nCMD [\"sh\", \"-c\", \"echo app chạy\"]\n# Ảnh đã đẩy lên registry. Ai kéo được ảnh là đọc được:\n$ docker inspect --format '{{json .Config.Env}}' aws-c6-lo:1\n[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\",\"DB_PASSWORD=LabFlow-lab-only\"]\n$ docker history --no-trunc --format '{{.CreatedBy}}' aws-c6-lo:1 | grep -i password\nENV DB_PASSWORD=LabFlow-lab-only\n# .env đã 'rm' ở lớp sau — nhìn từ container thì mất thật:\n$ docker run --rm aws-c6-lo:1 ls /app\n(thư mục trống)\n# …nhưng lớp COPY vẫn nằm nguyên trong ảnh:\n$ docker save aws-c6-lo:1 -o anh.tar && tar -xf anh.tar && for b in blobs/sha256/*; do tar -xOf $b app/.env 2>/dev/null; done\nJWT_SECRET=chuoi-bi-mat-cua-lab");
const OUT_63_BI_MAT_API_A = out("# Bí mật dạng JSON — một bí mật cho cả bộ thông tin kết nối\n$ aws secretsmanager create-secret --name labflow/prod/db --description 'LabFlow app DB user' --secret-string '{\"username\":\"labflow_app\",\"password\":\"LabFlow-lab-only\",\"host\":\"labflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\",\"port\":5432,\"dbname\":\"labflow\"}' --query '[Name,VersionId]' --output text\nlabflow/prod/db\tbc94e5d7-b3e2-43a6-80d7-27f6a2977aa6\n$ aws secretsmanager get-secret-value --secret-id labflow/prod/db --query '[VersionStages[0],SecretString]' --output text\nAWSCURRENT\t{\"username\":\"labflow_app\",\"password\":\"LabFlow-lab-only\",\"host\":\"labflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\",\"port\":5432,\"dbname\":\"labflow\"}\n# Xoay = ghi phiên bản mới; nhãn AWSCURRENT chuyển sang bản mới, bản cũ thành AWSPREVIOUS\n$ aws secretsmanager put-secret-value --secret-id labflow/prod/db --secret-string '{\"username\":\"labflow_app\",\"password\":\"LabFlow-lab-v2\",\"host\":\"labflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\",\"port\":5432,\"dbname\":\"labflow\"}' --query VersionStages --output text\nAWSCURRENT\n$ aws secretsmanager list-secret-version-ids --secret-id labflow/prod/db --query 'Versions[].[VersionStages[0],CreatedDate]' --output text\nAWSCURRENT\t2026-11-19T20:03:41+00:00\nAWSPREVIOUS\t2026-11-19T20:03:31+00:00");
const OUT_63_BI_MAT_API_B = out("# Parameter Store: cấu hình thường (String) và bí mật nhỏ (SecureString, mã hoá bằng KMS)\n$ aws ssm put-parameter --name /labflow/prod/db/host --type String --value labflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com --query '[Version,Tier]' --output text\n1\tNone\n$ aws ssm put-parameter --name /labflow/prod/jwt-secret --type SecureString --value chuoi-bi-mat-cua-lab --query '[Version,Tier]' --output text\n1\tNone\n$ aws ssm get-parameter --name /labflow/prod/jwt-secret --query 'Parameter.[Type,Value]' --output text\nSecureString\tkms:alias/aws/ssm:chuoi-bi-mat-cua-lab\n$ aws ssm get-parameter --name /labflow/prod/jwt-secret --with-decryption --query 'Parameter.[Type,Value]' --output text\nSecureString\tchuoi-bi-mat-cua-lab\n$ aws ssm get-parameters-by-path --path /labflow/prod --recursive --query 'Parameters[].[Name,Type]' --output text\n/labflow/prod/db/host\tString\n/labflow/prod/jwt-secret\tSecureString\n# Xoá bí mật có 'thời gian ân hạn' (7–30 ngày) — xoá nhầm vẫn cứu được\n$ aws secretsmanager delete-secret --secret-id labflow/prod/cu --recovery-window-in-days 7 --query '[Name,DeletionDate]' --output text\nlabflow/prod/cu\t2026-11-26T20:04:15.230616+00:00\n$ aws secretsmanager get-secret-value --secret-id labflow/prod/cu\nAn error occurred (InvalidRequestException) when calling the GetSecretValue operation: You can't perform this operation on the secret because it was marked for deletion.\n$ aws secretsmanager restore-secret --secret-id labflow/prod/cu --query Name --output text\nlabflow/prod/cu");
const OUT_63_XOAY_THAT = out("$ node 63-xoay.mjs\n1) { nguoi_dung: 'labflow_app' } | số lần gọi Secrets Manager: 1\n2) { ok: 1 } | số lần gọi Secrets Manager: 1\n-- đã xoay: DB và Secrets Manager mang mật khẩu mới; app vẫn giữ bản cũ trong cache\n   ↳ lỗi 28P01: password authentication failed for user \"labflow_app\" ⇒ đọc lại bí mật, thử lại\n3) { nguoi_dung: 'labflow_app' } | số lần gọi Secrets Manager: 2\n4) { ok: 1 } | số lần gọi Secrets Manager: 2");
const OUT_64_DDB_API_A = out("# Khoá = partition key (pk) + sort key (sk). Chỉ khai báo thuộc tính DÙNG LÀM KHOÁ; còn lại tự do từng item\n$ aws dynamodb create-table --table-name labflow-datlich --attribute-definitions 'AttributeName=pk,AttributeType=S' 'AttributeName=sk,AttributeType=S' 'AttributeName=nguoi,AttributeType=S' --key-schema 'AttributeName=pk,KeyType=HASH' 'AttributeName=sk,KeyType=RANGE' --global-secondary-indexes 'IndexName=theo-nguoi,KeySchema=[{AttributeName=nguoi,KeyType=HASH},{AttributeName=sk,KeyType=RANGE}],Projection={ProjectionType=ALL}' --billing-mode PAY_PER_REQUEST --query 'TableDescription.[TableStatus,BillingModeSummary.BillingMode]' --output text\nACTIVE\tPAY_PER_REQUEST\n# Đặt lịch = ghi CÓ ĐIỀU KIỆN: chỉ ghi nếu khung giờ đó chưa có ai\n$ aws dynamodb put-item --table-name labflow-datlich --item file:///aws/datlich.json --condition-expression 'attribute_not_exists(pk)' --return-consumed-capacity TOTAL --query ConsumedCapacity.CapacityUnits --output text\n2.0\n# Người thứ hai đặt đúng khung đó:\n$ aws dynamodb put-item --table-name labflow-datlich --item '{\"pk\":{\"S\":\"LAB#A101\"},\"sk\":{\"S\":\"SLOT#2026-11-24T08\"},\"nguoi\":{\"S\":\"USER#binh\"}}' --condition-expression 'attribute_not_exists(pk)'\nAn error occurred (ConditionalCheckFailedException) when calling the PutItem operation: The conditional request failed");
const OUT_64_DDB_API_B = out("# Mẫu truy cập 1: lịch phòng A101 trong tháng 11 — query theo khoá, đọc đúng 3 item\n$ aws dynamodb query --table-name labflow-datlich --key-condition-expression 'pk = :p AND begins_with(sk, :t)' --expression-attribute-values '{\":p\":{\"S\":\"LAB#A101\"},\":t\":{\"S\":\"SLOT#2026-11\"}}' --return-consumed-capacity TOTAL --query '[Items[].[sk.S,nguoi.S],Count,ScannedCount]' --output text\n3\t3\nSLOT#2026-11-24T08\tUSER#an\nSLOT#2026-11-24T10\tUSER#binh\nSLOT#2026-11-25T08\tUSER#an\n# Mẫu truy cập 2: lịch của bạn 'an' — đi qua GSI theo-nguoi\n$ aws dynamodb query --table-name labflow-datlich --index-name theo-nguoi --key-condition-expression 'nguoi = :n' --expression-attribute-values '{\":n\":{\"S\":\"USER#an\"}}' --query 'Items[].[pk.S,sk.S]' --output text\nLAB#A101\tSLOT#2026-11-24T08\nLAB#B202\tSLOT#2026-11-24T10\nLAB#A101\tSLOT#2026-11-25T08");
const OUT_64_DDB_API_C = out("# Hỏi theo thứ KHÔNG phải khoá (môn học) bằng query ⇒ bị từ chối\n$ aws dynamodb query --table-name labflow-datlich --key-condition-expression 'monHoc = :m' --expression-attribute-values '{\":m\":{\"S\":\"SWP391\"}}'\nAn error occurred (ValidationException) when calling the Query operation: Query condition missed key schema element\n# …nên người ta dùng scan + filter: đọc CẢ BẢNG rồi mới lọc (tính tiền theo ScannedCount)\n$ aws dynamodb scan --table-name labflow-datlich --filter-expression 'monHoc = :m' --expression-attribute-values '{\":m\":{\"S\":\"SWP391\"}}' --return-consumed-capacity TOTAL --query '[Count,ScannedCount,ConsumedCapacity.CapacityUnits]' --output text\n1\t6\t0.5\n# Một item tối đa 400 KB\n$ aws dynamodb put-item --table-name labflow-datlich --item file:///aws/to.json\nAn error occurred (ValidationException) when calling the PutItem operation: Item size has exceeded the maximum allowed size\n# TTL: item tự biến mất sau mốc hetHan (giây Unix) — hợp cho phiên đăng nhập, mã OTP, nhật ký tạm\n$ aws dynamodb update-time-to-live --table-name labflow-datlich --time-to-live-specification 'Enabled=true,AttributeName=hetHan' --query TimeToLiveSpecification --output text\nhetHan\tTrue");
const OUT_64_DUA_THAT = out("$ node 64-dua.mjs   # 20 yêu cầu đặt cùng phòng C303, cùng khung 13:00, gửi đồng thời\nngười thắng: ✓ sv01\nđếm: { 'thắng': 1, ConditionalCheckFailedException: 19 }");
const OUT_65_CACHE_API = out("$ aws elasticache create-cache-subnet-group --cache-subnet-group-name labflow-cache-private --cache-subnet-group-description 'private, 2 AZ' --subnet-ids subnet-18808a0ddf61681b7 subnet-226d7b1452e34588a --query 'CacheSubnetGroup.[CacheSubnetGroupName,length(Subnets)]' --output text\nlabflow-cache-private\t2\n# Replication group: 1 nút chính + 1 bản sao ở AZ khác, tự chuyển dự phòng, mã hoá đường truyền + lưu trữ, có AUTH\n$ aws elasticache create-replication-group --replication-group-id labflow-cache --replication-group-description 'LabFlow cache' --engine valkey --engine-version 8.0 --cache-node-type cache.t4g.micro --num-node-groups 1 --replicas-per-node-group 1 --automatic-failover-enabled --multi-az-enabled --cache-subnet-group-name labflow-cache-private --transit-encryption-enabled --at-rest-encryption-enabled --auth-token cache-lab-only-0001 --query 'ReplicationGroup.[ReplicationGroupId,Status,AutomaticFailover,MultiAZ,TransitEncryptionEnabled,AtRestEncryptionEnabled,AuthTokenEnabled]' --output text\nlabflow-cache\tavailable\tenabled\tenabled\tTrue\tTrue\tTrue\n$ aws elasticache describe-replication-groups --replication-group-id labflow-cache --query 'ReplicationGroups[0].NodeGroups[0].[PrimaryEndpoint.Address,ReaderEndpoint.Address]' --output text\nmaster.labflow-cache.c0r9x8.use1.cache.amazonaws.com\tNone");
const OUT_65_CACHE_THAT = out("$ node 65-cache.mjs\n1) lần đầu                         { nguon: 'MISS', ms: '356.7', soDong: 40 }\n2) gọi lại                         { nguon: 'HIT ', ms: '1.0', soDong: 40 }\n3) gọi lại                         { nguon: 'HIT ', ms: '0.2', soDong: 40 }\n   TTL còn lại của lich:A101 = 5 giây\n-- có người đặt thêm ⇒ ghi DB rồi XOÁ khoá cache\n4) sau khi ghi                     { nguon: 'MISS', ms: '302.2', soDong: 41 }\n5) gọi lại                         { nguon: 'HIT ', ms: '0.1', soDong: 41 }\n6) sau 6 giây (TTL hết hạn)        { nguon: 'MISS', ms: '302.0', soDong: 41 }");
const OUT_65_MO_THAT = out("# Cache 'cho nhanh': không mật khẩu, protected-mode tắt, nằm ở mạng public. Máy lạ ở cùng mạng/Internet:\n[ngoai]$ valkey-cli -h 10.146.1.50 KEYS 'phien:*'\nphien:7f3a\nphien:91bc\n[ngoai]$ valkey-cli -h 10.146.1.50 GET phien:7f3a\n{\"user\":\"an\",\"role\":\"ADMIN\",\"token\":\"eyJhbGciOi...(lab)\"}\n# Mánh cũ của sâu đào coin: đổi thư mục lưu để ghi tệp tuỳ ý lên máy chủ — Valkey 8 chặn sẵn:\n[ngoai]$ valkey-cli -h 10.146.1.50 CONFIG SET dir /root/.ssh\nERR CONFIG SET failed (possibly related to argument 'dir') - can't set protected config\n\n# Nhưng xoá sạch thì vẫn làm được (đăng xuất mọi người dùng):\n[ngoai]$ valkey-cli -h 10.146.1.50 FLUSHALL; valkey-cli -h 10.146.1.50 DBSIZE\nOK\n0\n# Cache đúng cách: chỉ ở mạng private + có mật khẩu (ElastiCache: subnet private, SG chỉ nhận từ app, AUTH/RBAC + TLS)\n[ngoai]$ valkey-cli -h aws-c6-cache PING\nCould not connect to Valkey at aws-c6-cache:6379: Name does not resolve\n[app]$ valkey-cli -h aws-c6-cache PING\nNOAUTH Authentication required.\n\n[app]$ valkey-cli -h aws-c6-cache --no-auth-warning -a $CACHE_PW PING\nPONG");
const OUT_66_DON = out("$ bash don.sh\n$ aws rds modify-db-instance --db-instance-identifier labflow-db --no-deletion-protection --apply-immediately --query DBInstance.DeletionProtection --output text\nFalse\n$ aws rds delete-db-instance --db-instance-identifier labflow-db --skip-final-snapshot --query DBInstance.DBInstanceStatus --output text\ndeleting\n$ aws rds delete-db-snapshot --db-snapshot-identifier labflow-chua-mahoa --query DBSnapshot.Status --output text\navailable\n$ aws rds delete-db-snapshot --db-snapshot-identifier labflow-mahoa --query DBSnapshot.Status --output text\navailable\n$ aws rds delete-db-snapshot --db-snapshot-identifier labflow-db-cuoi --query DBSnapshot.Status --output text\navailable\n$ aws secretsmanager delete-secret --secret-id labflow/prod/db --force-delete-without-recovery --query Name --output text\nlabflow/prod/db\n$ aws ssm delete-parameters --names /labflow/prod/jwt-secret --query DeletedParameters --output text\n/labflow/prod/jwt-secret\n$ aws dynamodb delete-table --table-name labflow-audit --query TableDescription.TableStatus --output text\nACTIVE\n$ bash con-gi.sh\nRDS instance:        0\nRDS snapshot thủ công: 0\nSecrets (labflow/):   0\nTham số /labflow:     0\nBảng DynamoDB:        0");
const OUT_66_GIAI = out("$ bash giai.sh\n# Thử bật mã hoá tại chỗ:\nUnknown options: --storage-encrypted\n# ⇒ đi đường vòng: snapshot → copy-db-snapshot có khoá KMS → restore → đổi tên\n$ aws rds create-db-snapshot --db-instance-identifier labflow-db --db-snapshot-identifier labflow-chua-mahoa --query DBSnapshot.Encrypted --output text\nFalse\n$ aws rds copy-db-snapshot --source-db-snapshot-identifier labflow-chua-mahoa --target-db-snapshot-identifier labflow-mahoa --kms-key-id alias/aws/rds --query DBSnapshot.Encrypted --output text\nTrue\n$ aws rds restore-db-instance-from-db-snapshot --db-instance-identifier labflow-db-v2 --db-snapshot-identifier labflow-mahoa --db-instance-class db.t4g.micro --no-publicly-accessible --deletion-protection --query DBInstance.StorageEncrypted --output text\nTrue\n$ aws rds modify-db-instance --db-instance-identifier labflow-db-v2 --no-publicly-accessible --manage-master-user-password --backup-retention-period 7 --apply-immediately --query 'DBInstance.[PubliclyAccessible,BackupRetentionPeriod]' --output text\nFalse\t7\n$ aws rds delete-db-instance --db-instance-identifier labflow-db --final-db-snapshot-identifier labflow-db-cuoi --query DBInstance.DBInstanceStatus --output text\ndeleting\n$ aws rds modify-db-instance --db-instance-identifier labflow-db-v2 --new-db-instance-identifier labflow-db --apply-immediately --query DBInstance.DBInstanceIdentifier --output text\nlabflow-db\n# Bí mật của app\n$ aws secretsmanager create-secret --name labflow/prod/db --secret-string '{\"username\":\"labflow_app\",\"password\":\"LabFlow-lab-v2\",\"host\":\"labflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\",\"port\":5432,\"dbname\":\"labflow\"}' --query Name --output text\nlabflow/prod/db\n$ aws ssm put-parameter --name /labflow/prod/jwt-secret --type SecureString --value chuoi-bi-mat-cua-lab --overwrite --query Version --output text\n2\n# Bảng nhật ký\n$ aws dynamodb update-table --table-name labflow-audit --billing-mode PAY_PER_REQUEST --query TableDescription.BillingModeSummary.BillingMode --output text\nPAY_PER_REQUEST\n$ aws dynamodb update-continuous-backups --table-name labflow-audit --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true --query ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus --output text\nENABLED\n$ aws dynamodb update-time-to-live --table-name labflow-audit --time-to-live-specification 'Enabled=true,AttributeName=hetHan' --query TimeToLiveSpecification.Enabled --output text\nTrue\n$ bash cham.sh\n✓ 1 RDS không công khai (PubliclyAccessible = False)\n✓ 2 Ổ lưu trữ RDS được mã hoá\n✓ 3 Giữ sao lưu tự động ≥ 7 ngày (7)\n✓ 4 Bật chống xoá (deletion protection)\n✓ 5 Mật khẩu chủ do Secrets Manager giữ\n✓ 6 Bí mật app: labflow/prod/db trong Secrets Manager + JWT là SecureString\n✓ 7 labflow-audit: on-demand + PITR\n✓ 8 TTL bật trên thuộc tính hetHan\nĐIỂM: 8/8");
const OUT_66_TRUOC = out("$ bash truoc.sh\navailable\n1\nACTIVE\n$ bash cham.sh\n✗ 1 RDS đang công khai ra Internet\n✗ 2 RDS chưa mã hoá lưu trữ\n✗ 3 Sao lưu tự động chỉ giữ 1 ngày (cần ≥ 7)\n✗ 4 Chưa bật chống xoá\n✗ 5 Mật khẩu chủ gõ tay, không nằm trong Secrets Manager\n✗ 6 Bí mật app: secret='thiếu' jwt='String' (cần secret + SecureString)\n✗ 7 labflow-audit: billing=None pitr=DISABLED (cần PAY_PER_REQUEST + ENABLED)\n✗ 8 TTL chưa bật (hiện: DISABLED\tNone)\nĐIỂM: 0/8");
const MA_KET_NOI = js("// Kết nối kiểu ứng dụng Node.js tới RDS: bắt buộc TLS và kiểm chứng chỉ bằng CA (trên AWS: global-bundle.pem của RDS)\nimport pg from 'pg';\nimport fs from 'node:fs';\nconst coCA = process.argv[2] !== 'khong-ca';\nconst c = new pg.Client({\n  host: 'aws-c6-rds', port: 5432, user: 'labflow', database: 'labflow', password: process.env.DB_PASSWORD,\n  ssl: coCA ? { ca: fs.readFileSync('/app/ca.crt', 'utf8'), rejectUnauthorized: true } : { rejectUnauthorized: true },\n});\ntry {\n  await c.connect();\n  const r = await c.query(\"select current_user as nguoi_dung, inet_server_addr() as may_chu, s.ssl, s.version as tls from pg_stat_ssl s where s.pid = pg_backend_pid()\");\n  console.log('kết nối OK:', r.rows[0]);\n} catch (e) { console.log('LỖI:', e.message); }\nawait c.end().catch(() => {});");
const MA_XOAY = js("// App đọc mật khẩu DB từ Secrets Manager (cache 5 phút). Gặp lỗi sai mật khẩu ⇒ đọc lại bí mật MỘT lần rồi thử lại.\nimport pg from 'pg';\nimport { SecretsManagerClient, GetSecretValueCommand, PutSecretValueCommand } from '@aws-sdk/client-secrets-manager';\nconst sm = new SecretsManagerClient({ endpoint: 'http://127.0.0.1:43666', region: 'ap-southeast-1', credentials: { accessKeyId: 'test', secretAccessKey: 'test' } });\nconst ID = 'labflow/prod/db';\nlet cache = null, soLanGoi = 0;\nasync function biMat(lamMoi = false) {\n  if (cache && !lamMoi && Date.now() - cache.luc < 5 * 60_000) return cache.v;\n  soLanGoi++;\n  const r = await sm.send(new GetSecretValueCommand({ SecretId: ID }));\n  cache = { v: JSON.parse(r.SecretString), luc: Date.now() };\n  return cache.v;\n}\nasync function truyVan(sql) {\n  for (const lan of [1, 2]) {\n    const s = await biMat(lan === 2);\n    const c = new pg.Client({ host: s.host, port: s.port, user: s.username, password: s.password, database: s.dbname });\n    try { await c.connect(); return (await c.query(sql)).rows[0]; }\n    catch (e) { if (e.code === '28P01' && lan === 1) { console.log(`   ↳ lỗi ${e.code}: ${e.message} ⇒ đọc lại bí mật, thử lại`); continue; } throw e; }\n    finally { await c.end().catch(() => {}); }\n  }\n}\nconsole.log('1)', await truyVan('select current_user as nguoi_dung'), '| số lần gọi Secrets Manager:', soLanGoi);\nconsole.log('2)', await truyVan('select 1 as ok'), '| số lần gọi Secrets Manager:', soLanGoi);\n// Vai hàm xoay (trên AWS là Lambda xoay do RDS/Secrets Manager quản): đổi mật khẩu trên DB rồi ghi phiên bản mới\nconst admin = new pg.Client({ host: '127.0.0.1', port: 43632, user: 'labflow', password: process.env.ADMIN_PW, database: 'labflow' });\nawait admin.connect(); await admin.query(\"alter role labflow_app password 'LabFlow-lab-v2'\"); await admin.end();\nawait sm.send(new PutSecretValueCommand({ SecretId: ID, SecretString: JSON.stringify({ ...cache.v, password: 'LabFlow-lab-v2' }) }));\nconsole.log('-- đã xoay: DB và Secrets Manager mang mật khẩu mới; app vẫn giữ bản cũ trong cache');\nconsole.log('3)', await truyVan('select current_user as nguoi_dung'), '| số lần gọi Secrets Manager:', soLanGoi);\nconsole.log('4)', await truyVan('select 1 as ok'), '| số lần gọi Secrets Manager:', soLanGoi);");
const MA_DUA = js("import { DynamoDBClient } from '@aws-sdk/client-dynamodb';\nimport { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';\nconst ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ endpoint: 'http://127.0.0.1:43666', region: 'ap-southeast-1', credentials: { accessKeyId: 'test', secretAccessKey: 'test' } }));\nconst datLich = (nguoi) => ddb.send(new PutCommand({\n  TableName: 'labflow-datlich',\n  Item: { pk: 'LAB#C303', sk: 'SLOT#2026-11-27T13', nguoi: `USER#${nguoi}` },\n  ConditionExpression: 'attribute_not_exists(pk)',\n})).then(() => `✓ ${nguoi}`, (e) => e.name);\nconst kq = await Promise.all(Array.from({ length: 20 }, (_, i) => datLich(`sv${String(i + 1).padStart(2, '0')}`)));\nconst dem = kq.reduce((m, k) => ((m[k.startsWith('✓') ? 'thắng' : k] = (m[k.startsWith('✓') ? 'thắng' : k] || 0) + 1), m), {});\nconsole.log('người thắng:', kq.filter((k) => k.startsWith('✓')).join(', '));\nconsole.log('đếm:', dem);");
const MA_CACHE = js("// Cache-aside: đọc cache trước; trượt thì hỏi PostgreSQL (truy vấn báo cáo chậm ~300 ms) rồi cất vào cache với TTL.\nimport pg from 'pg';\nimport Redis from 'ioredis';\nconst db = new pg.Pool({ host: 'aws-c6-rds', user: 'labflow', password: process.env.DB_PASSWORD, database: 'labflow' });\nconst cache = new Redis({ host: 'aws-c6-cache', password: process.env.CACHE_PW });\nconst TTL = 5; // giây — bài thật thường 60–300 s\nasync function lichPhong(phong) {\n  const t0 = performance.now(), khoa = `lich:${phong}`;\n  const daCo = await cache.get(khoa);\n  if (daCo) return { nguon: 'HIT ', ms: (performance.now() - t0).toFixed(1), soDong: JSON.parse(daCo).length };\n  const { rows } = await db.query('with cham as (select pg_sleep(0.3)) select b.id, b.khung_gio, b.nguoi from bookings b, cham where b.phong = $1', [phong]);\n  await cache.set(khoa, JSON.stringify(rows), 'EX', TTL);\n  return { nguon: 'MISS', ms: (performance.now() - t0).toFixed(1), soDong: rows.length };\n}\nconst in_ = async (nhan) => console.log(nhan.padEnd(34), await lichPhong('A101'));\nawait in_('1) lần đầu');\nawait in_('2) gọi lại');\nawait in_('3) gọi lại');\nconsole.log('   TTL còn lại của lich:A101 =', await cache.ttl('lich:A101'), 'giây');\nawait db.query(\"insert into bookings(phong,khung_gio,nguoi) values ('A101','khung 41','sv41')\");\nawait cache.del('lich:A101');\nconsole.log('-- có người đặt thêm ⇒ ghi DB rồi XOÁ khoá cache');\nawait in_('4) sau khi ghi');\nawait in_('5) gọi lại');\nawait new Promise((r) => setTimeout(r, (TTL + 1) * 1000));\nawait in_(`6) sau ${TTL + 1} giây (TTL hết hạn)`);\nawait cache.quit(); await db.end();");
const MA_CHAM = bash("# Bộ chấm lab Chương 6 — 8 phép kiểm trên cấu hình (chạy được với AWS thật: bỏ --endpoint-url trong awsm/awsl)\nsource ~/vbg-dp/scratchpad/aws/lab/c6/chung6.sh\nd=0; ok() { echo \"✓ $1\"; d=$((d+1)); }; ko() { echo \"✗ $1\"; }\nR=$(m rds describe-db-instances --db-instance-identifier labflow-db --query 'DBInstances[0].[PubliclyAccessible,StorageEncrypted,BackupRetentionPeriod,DeletionProtection,MasterUserSecret.SecretArn]' --output text)\nread pub enc ret del sec <<<\"$R\"\n[ \"$pub\" = False ] && ok \"1 RDS không công khai (PubliclyAccessible = False)\" || ko \"1 RDS đang công khai ra Internet\"\n[ \"$enc\" = True ] && ok \"2 Ổ lưu trữ RDS được mã hoá\" || ko \"2 RDS chưa mã hoá lưu trữ\"\n[ \"${ret:-0}\" -ge 7 ] 2>/dev/null && ok \"3 Giữ sao lưu tự động ≥ 7 ngày ($ret)\" || ko \"3 Sao lưu tự động chỉ giữ ${ret:-?} ngày (cần ≥ 7)\"\n[ \"$del\" = True ] && ok \"4 Bật chống xoá (deletion protection)\" || ko \"4 Chưa bật chống xoá\"\n[[ \"$sec\" == arn:aws:secretsmanager:* ]] && ok \"5 Mật khẩu chủ do Secrets Manager giữ\" || ko \"5 Mật khẩu chủ gõ tay, không nằm trong Secrets Manager\"\nJ=$(a ssm get-parameter --name /labflow/prod/jwt-secret --query Parameter.Type --output text)\nS=$(a secretsmanager describe-secret --secret-id labflow/prod/db --query Name --output text)\n[ \"$J\" = SecureString ] && [ \"$S\" = labflow/prod/db ] && ok \"6 Bí mật app: labflow/prod/db trong Secrets Manager + JWT là SecureString\" || ko \"6 Bí mật app: secret='${S:-thiếu}' jwt='${J:-thiếu}' (cần secret + SecureString)\"\nB=$(a dynamodb describe-table --table-name labflow-audit --query 'Table.BillingModeSummary.BillingMode' --output text)\nP=$(a dynamodb describe-continuous-backups --table-name labflow-audit --query 'ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus' --output text)\n[ \"$B\" = PAY_PER_REQUEST ] && [ \"$P\" = ENABLED ] && ok \"7 labflow-audit: on-demand + PITR\" || ko \"7 labflow-audit: billing=$B pitr=$P (cần PAY_PER_REQUEST + ENABLED)\"\nT=$(a dynamodb describe-time-to-live --table-name labflow-audit --query 'TimeToLiveDescription.[TimeToLiveStatus,AttributeName]' --output text)\n[[ \"$T\" == ENABL*hetHan ]] && ok \"8 TTL bật trên thuộc tính hetHan\" || ko \"8 TTL chưa bật (hiện: ${T:-không có})\"\necho \"ĐIỂM: $d/8\"");
const MA_TRUOC = bash("# Bản \"làm vội cho chạy được\" — điểm xuất phát của lab\nsource ~/vbg-dp/scratchpad/aws/lab/c6/chung6.sh\nm rds create-db-instance --db-instance-identifier labflow-db --engine postgres --engine-version 16.4 --db-instance-class db.t4g.micro --allocated-storage 20 --master-username labflow --master-user-password LabFlow-lab-only --publicly-accessible --backup-retention-period 1 --query 'DBInstance.DBInstanceStatus' --output text\na ssm put-parameter --name /labflow/prod/jwt-secret --type String --value chuoi-bi-mat-cua-lab --query Version --output text\na dynamodb create-table --table-name labflow-audit --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --query TableDescription.TableStatus --output text");
const MA_GIAI = bash("# LỜI GIẢI lab 6 — sửa đúng 8 điểm; mã hoá RDS KHÔNG bật tại chỗ được ⇒ snapshot → chép có KMS → khôi phục → đổi tên\nsource ~/vbg-dp/scratchpad/aws/lab/c6/chung6.sh\necho \"# Thử bật mã hoá tại chỗ:\"\nM rds modify-db-instance --db-instance-identifier labflow-db --storage-encrypted 2>&1 | tail -1\necho \"# ⇒ đi đường vòng: snapshot → copy-db-snapshot có khoá KMS → restore → đổi tên\"\nM rds create-db-snapshot --db-instance-identifier labflow-db --db-snapshot-identifier labflow-chua-mahoa --query 'DBSnapshot.Encrypted' --output text\nM rds copy-db-snapshot --source-db-snapshot-identifier labflow-chua-mahoa --target-db-snapshot-identifier labflow-mahoa --kms-key-id alias/aws/rds --query 'DBSnapshot.Encrypted' --output text\nM rds restore-db-instance-from-db-snapshot --db-instance-identifier labflow-db-v2 --db-snapshot-identifier labflow-mahoa --db-instance-class db.t4g.micro --no-publicly-accessible --deletion-protection --query 'DBInstance.StorageEncrypted' --output text\nM rds modify-db-instance --db-instance-identifier labflow-db-v2 --no-publicly-accessible --manage-master-user-password --backup-retention-period 7 --apply-immediately --query 'DBInstance.[PubliclyAccessible,BackupRetentionPeriod]' --output text\nM rds delete-db-instance --db-instance-identifier labflow-db --final-db-snapshot-identifier labflow-db-cuoi --query DBInstance.DBInstanceStatus --output text\nM rds modify-db-instance --db-instance-identifier labflow-db-v2 --new-db-instance-identifier labflow-db --apply-immediately --query DBInstance.DBInstanceIdentifier --output text\necho \"# Bí mật của app\"\nL secretsmanager create-secret --name labflow/prod/db --secret-string '{\"username\":\"labflow_app\",\"password\":\"LabFlow-lab-v2\",\"host\":\"labflow-db.aaaaaaaaaa.ap-southeast-1.rds.amazonaws.com\",\"port\":5432,\"dbname\":\"labflow\"}' --query Name --output text\nL ssm put-parameter --name /labflow/prod/jwt-secret --type SecureString --value chuoi-bi-mat-cua-lab --overwrite --query Version --output text\necho \"# Bảng nhật ký\"\nL dynamodb update-table --table-name labflow-audit --billing-mode PAY_PER_REQUEST --query 'TableDescription.BillingModeSummary.BillingMode' --output text\nL dynamodb update-continuous-backups --table-name labflow-audit --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true --query 'ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus' --output text\nL dynamodb update-time-to-live --table-name labflow-audit --time-to-live-specification Enabled=true,AttributeName=hetHan --query 'TimeToLiveSpecification.Enabled' --output text");
const MA_DON = bash("# Dọn lab 6 — thứ tự: tắt chống xoá ⇒ xoá instance ⇒ xoá snapshot THỦ CÔNG (không tự mất) ⇒ bí mật ⇒ tham số ⇒ bảng\nsource ~/vbg-dp/scratchpad/aws/lab/c6/chung6.sh\nfor db in $(m rds describe-db-instances --query 'DBInstances[].DBInstanceIdentifier' --output text); do\n  M rds modify-db-instance --db-instance-identifier $db --no-deletion-protection --apply-immediately --query DBInstance.DeletionProtection --output text\n  M rds delete-db-instance --db-instance-identifier $db --skip-final-snapshot --query DBInstance.DBInstanceStatus --output text\ndone\nfor s in $(m rds describe-db-snapshots --snapshot-type manual --query 'DBSnapshots[].DBSnapshotIdentifier' --output text); do\n  M rds delete-db-snapshot --db-snapshot-identifier $s --query DBSnapshot.Status --output text\ndone\nL secretsmanager delete-secret --secret-id labflow/prod/db --force-delete-without-recovery --query Name --output text\nL ssm delete-parameters --names /labflow/prod/jwt-secret --query DeletedParameters --output text\nL dynamodb delete-table --table-name labflow-audit --query TableDescription.TableStatus --output text");
const MA_CONGI = bash("# Còn gì đang tính tiền? (Chương 6) — mỗi dòng phải là 0\nsource ~/vbg-dp/scratchpad/aws/lab/c6/chung6.sh\necho \"RDS instance:        $(m rds describe-db-instances --query 'length(DBInstances)' --output text)\"\necho \"RDS snapshot thủ công: $(m rds describe-db-snapshots --snapshot-type manual --query 'length(DBSnapshots)' --output text)\"\necho \"Secrets (labflow/):   $(a secretsmanager list-secrets --filters Key=name,Values=labflow/ --query 'length(SecretList)' --output text)\"\necho \"Tham số /labflow:     $(a ssm get-parameters-by-path --path /labflow --recursive --query 'length(Parameters)' --output text)\"\necho \"Bảng DynamoDB:        $(a dynamodb list-tables --query 'length(TableNames)' --output text)\"");

/* ═════ 6.1 — RDS for PostgreSQL ═════ */
const L61_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 1</span>
<h2>6.1 — RDS for PostgreSQL: a database you rent, not a server you babysit</h2>
<p class="lead">On a VPS, PostgreSQL is one more container next to your app: you pick the version, write <code>postgresql.conf</code>, run backups with a cron job and hope the disk never dies. <strong>Amazon RDS</strong> runs the same PostgreSQL engine for you — hardware, operating system, minor-version patches, automated backups, failover — and gives you an <strong>endpoint</strong> to connect to. You still own the schema, the queries, the users and every security switch. This lesson builds an RDS instance the safe way (private subnets, encrypted, no typed password), then runs a real PostgreSQL behind a private network with forced TLS so you can see exactly what those switches do to a connection.</p>

<h3>The picture: a serviced apartment</h3>
<p>Running Postgres on your own VPS is owning a house: you fix the roof, the plumbing and the lock. RDS is a <strong>serviced apartment</strong>. Building management (AWS) repairs the pipes at night (patch window), keeps a copy of your keys in the safe (automated backups), and moves you to an identical flat next door if yours floods (Multi-AZ failover, lesson 6.2). But what you put in the rooms, who you give a key to and whether you leave the door open — that is still you. AWS calls this the <strong>shared responsibility model</strong>.</p>

<table>
  <thead><tr><th>AWS does (managed)</th><th>You still do</th></tr></thead>
  <tbody>
    <tr><td>Hardware, OS, PostgreSQL install</td><td>Choose engine version, instance class, storage size</td></tr>
    <tr><td>Minor-version patching in a maintenance window</td><td>Test and schedule major upgrades (16 → 17)</td></tr>
    <tr><td>Automated daily snapshot + transaction logs every 5 minutes</td><td>Set retention, test restores, take manual snapshots before risky changes</td></tr>
    <tr><td>Standby + automatic failover (if you pay for Multi-AZ)</td><td>Decide if you need it; make the app reconnect</td></tr>
    <tr><td>Encryption at rest with KMS (one flag at creation)</td><td>Turn it on — it cannot be switched on later in place</td></tr>
    <tr><td>Metrics in CloudWatch</td><td>Schema, indexes, slow queries, connection pooling, users and grants</td></tr>
  </tbody>
</table>
<p>What you <strong>lose</strong>: SSH into the database host, <code>ALTER SYSTEM</code>, a real superuser and arbitrary extensions. The master user gets the <code>rds_superuser</code> role, not <code>SUPERUSER</code>; settings live in a <strong>parameter group</strong>; only extensions on the RDS supported list can be installed.</p>

<h3>Six building blocks</h3>
<ul>
  <li><strong>DB subnet group</strong> — the subnets RDS may place the database in. Use <em>private</em> subnets in at least two AZs (Chapter 3): no route to the Internet Gateway.</li>
  <li><strong>Security group</strong> — port 5432 open only to the app's security group, never to an IP range like <code>0.0.0.0/0</code>.</li>
  <li><strong>Parameter group</strong> — RDS's <code>postgresql.conf</code>. Some parameters apply immediately, others need a reboot (<code>pending-reboot</code>).</li>
  <li><strong>Instance class + storage</strong> — <code>db.t4g.micro</code> (2 vCPU burstable, 1 GiB) is the cheapest; storage is gp3, billed per GB-month whether you use it or not.</li>
  <li><strong>Endpoint</strong> — a DNS name such as <code>labflow-db.xxxx.ap-southeast-1.rds.amazonaws.com:5432</code>. It never changes on failover, so the app only knows the name.</li>
  <li><strong>Master credentials</strong> — with <code>--manage-master-user-password</code> RDS generates the password and stores it in Secrets Manager (lesson 6.3). Nobody types it, nobody pastes it into Slack.</li>
</ul>

<h3>See it running (1): creating RDS the safe way</h3>
<p>LocalStack's free edition has no RDS, so this ran on <strong>Moto</strong>, another AWS emulator — configuration only, there is no database behind it. Read it as the order of work on a real account.</p>
${OUT_61_RDS_API}
<ul>
  <li>The subnet group spans <code>ap-southeast-1a</code> and <code>ap-southeast-1b</code>; the security group rule references a <em>group</em>, not an IP.</li>
  <li><code>rds.force_ssl=1</code> is <code>pending-reboot</code>: it takes effect after the next reboot. On RDS for PostgreSQL 15 and later it is already 1 by default.</li>
  <li>The endpoint answers on 5432, <code>PubliclyAccessible False</code>, <code>StorageEncrypted True</code>, and the master secret is <code>active</code>. <strong>Moto differs:</strong> it shows <code>available</code> at once (real AWS needs several minutes in <code>creating</code>) and writes username <code>admin</code> into the secret; AWS writes the master username you chose.</li>
  <li>The last command matters most: the API happily created a <strong>public, unencrypted</strong> instance with <strong>zero days of backups</strong>. AWS gives you the switches; nothing forces you to flip them. The lab (6.6) turns this into a graded checklist.</li>
</ul>

<h3>See it running (2): private network and forced TLS, for real</h3>
<p>To see packets, a real PostgreSQL 16 plays RDS in Docker. It lives only on an <code>--internal</code> network (10.146.10.0/24 — no way out, like a private subnet) and its <code>pg_hba.conf</code> rejects every connection without encryption, which is what <code>rds.force_ssl=1</code> does. Three machines: <code>rds</code>, <code>app</code> (in both networks, like an EC2/ECS task in the VPC) and <code>ngoai</code> (only on the public network — your laptop on the Internet).</p>
${OUT_61_RDS_THAT_A}
<ol>
  <li>From outside, the connection does not even get refused — it <strong>times out</strong>. There is no route. That is what “private subnet + security group” feels like from the Internet, and it is why you cannot point a desktop SQL client at a private RDS without a bastion, SSM port forwarding or a VPN (Chapter 3.6).</li>
  <li>From the app, <code>sslmode=disable</code> is rejected by the server: “no encryption”.</li>
  <li><code>sslmode=verify-full</code> checks the certificate chain <em>and</em> that the host name matches. The session runs TLS 1.3. On AWS the CA is the RDS <strong>global bundle</strong> (<code>global-bundle.pem</code>), downloaded once and shipped with the app.</li>
</ol>

<h3>Connecting from Node.js and Spring Boot</h3>
${MA_KET_NOI}
${OUT_61_RDS_THAT_B}
<ul>
  <li>With the CA the driver reports <code>ssl: true</code>, TLSv1.3. Without it, <code>rejectUnauthorized: true</code> refuses a certificate it cannot trace to a trusted root. The tempting “fix” <code>rejectUnauthorized: false</code> keeps encryption but accepts <em>any</em> certificate — a man in the middle included. Ship the CA instead.</li>
  <li>The 0.2 s query was not logged, the 0.7 s one was: <code>log_min_duration_statement=500</code>. On RDS you set it in the parameter group and read the log in the console or CloudWatch Logs.</li>
  <li>Here <code>labflow</code> is a real superuser (<code>t</code>). On RDS the same query returns <code>f</code> — the master user only has <code>rds_superuser</code>.</li>
</ul>
<p>Spring Boot needs nothing special — the PostgreSQL JDBC driver understands the same <code>sslmode</code>:</p>
${props(`
spring.datasource.url=jdbc:postgresql://labflow-db.xxxx.ap-southeast-1.rds.amazonaws.com:5432/labflow?sslmode=verify-full&sslrootcert=/etc/ssl/rds/global-bundle.pem
spring.datasource.username=labflow_app
# password: injected from Secrets Manager at runtime (lesson 6.3) — never in this file
spring.datasource.hikari.maximum-pool-size=10`)}

<h3>RDS or PostgreSQL in Docker on a VPS?</h3>
<table>
  <thead><tr><th></th><th>Postgres in Docker on a VPS</th><th>RDS db.t4g.micro (Singapore)</th></tr></thead>
  <tbody>
    <tr><td>Monthly price</td><td>Part of the VPS you already pay for</td><td>0.025 USD/h ≈ 18.25 USD + 20 GB gp3 × 0.138 = 2.76 USD ⇒ ~21 USD (Multi-AZ: 0.051 USD/h ≈ 37 USD)</td></tr>
    <tr><td>Backups</td><td>Your script, your cron, your restore test</td><td>Automatic, point-in-time to any second in the retention window</td></tr>
    <tr><td>Disk dies / host dies</td><td>Restore from your last dump by hand</td><td>Multi-AZ: automatic failover; single-AZ: restore from snapshot</td></tr>
    <tr><td>Control</td><td>Full: any extension, any setting, SSH</td><td>Parameter group, supported extensions, no host access</td></tr>
    <tr><td>Shares CPU/RAM/disk with the app</td><td>Yes — a full disk can stop both</td><td>No — separate instance, storage can autoscale</td></tr>
  </tbody>
</table>
<p>For a student project or one small VPS, Postgres in Docker is a fine, honest choice — as long as backups are real and tested. When a team, an SLA or customer data appears, paying ~21 USD a month so that backups and failover are someone else's 3 a.m. problem is usually the cheaper option.</p>

<h3>Hacker's corner: databases leaked without breaking anything</h3>
<p>Attackers rarely “hack” a database. They <strong>find</strong> one. Two patterns keep repeating:</p>
<ul>
  <li><strong>Public snapshots.</strong> In November 2022 Mitiga's research team reported finding <em>hundreds</em> of RDS snapshots exposed every month — shared as “public” so any AWS account could restore them — many full of personal data. No password was needed: restore the snapshot in your own account and read it.</li>
  <li><strong>Publicly accessible instances</strong> with 5432 open to <code>0.0.0.0/0</code>, found by Internet-wide scanners within hours and brute-forced with common passwords.</li>
</ul>
<p>Prevention is four switches, all shown above: <code>--no-publicly-accessible</code>, a security group that references only the app's group, <code>--storage-encrypted</code> (an encrypted snapshot cannot be made public at all), and a password nobody typed (<code>--manage-master-user-password</code>). In a company, AWS Config managed rules such as <code>rds-instance-public-access-check</code> and <code>rds-snapshots-public-prohibited</code> catch the mistake within minutes.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>“What does ‘managed’ mean for RDS — what is still your job?”</strong> — AWS: hardware, OS, patching, backups, failover mechanics. Me: schema, indexes, queries, users and grants, parameter tuning, choosing Multi-AZ/retention/encryption, network access, cost.</li>
  <li><strong>“How does your app reach a database in a private subnet?”</strong> — The app runs in the same VPC; the DB security group allows 5432 only from the app's security group; the app uses the endpoint DNS name with TLS verify-full. Humans use SSM port forwarding or a bastion, never a public DB.</li>
  <li><strong>“Can you enable encryption on an existing RDS instance?”</strong> — Not in place. Snapshot → copy the snapshot with a KMS key → restore a new instance → switch the app. That is exactly the lab in 6.6.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Using <code>scratchpad/aws/lab/c6/61.sh</code> as a model: add a second role <code>labflow_ro</code> that can only <code>SELECT</code>, connect with it from the app container using <code>verify-full</code>, and show that an <code>INSERT</code> fails. Then remove the CA path and record the exact error.</p>
<p><strong>Pass when</strong>: you have three captured outputs — a successful SELECT as <code>labflow_ro</code>, a <code>permission denied</code> on INSERT, and the certificate error without the CA.</p>
${giai('Hint: the SQL', sql(`
create role labflow_ro login password 'doi-mat-khau-nay';
grant connect on database labflow to labflow_ro;
grant usage on schema public to labflow_ro;
grant select on all tables in schema public to labflow_ro;
alter default privileges in schema public grant select on tables to labflow_ro;`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RDS</span><span class="v">Managed relational database service: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Db2.</span></div>
  <div class="kv"><span class="k">DB subnet group</span><span class="v">Subnets (≥ 2 AZs) where RDS may place the instance and its standby.</span></div>
  <div class="kv"><span class="k">Parameter group</span><span class="v">The postgresql.conf of RDS; static parameters need a reboot.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">Stable DNS name + port of the instance; survives failover.</span></div>
  <div class="kv"><span class="k">rds.force_ssl</span><span class="v">Rejects unencrypted connections; default 1 from PostgreSQL 15 on RDS.</span></div>
  <div class="kv"><span class="k">rds_superuser</span><span class="v">The strongest role you get on RDS — not a real SUPERUSER.</span></div>
  <div class="kv"><span class="k">verify-full</span><span class="v">TLS mode that checks the CA chain and the host name.</span></div>
  <div class="kv"><span class="k">Shared responsibility</span><span class="v">AWS secures the cloud; you secure what you put and configure in it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>RDS = PostgreSQL without the server chores; you still own data, access and settings.</li>
  <li>Private subnet group in two AZs, security group from the app's group, no public access.</li>
  <li>Encryption at rest is decided at creation; the master password lives in Secrets Manager.</li>
  <li>Connect with TLS <code>verify-full</code> and the RDS CA bundle — never <code>rejectUnauthorized: false</code>.</li>
  <li>The API accepts unsafe settings: safety comes from your checklist, not from defaults.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html', '🐘', 'AWS docs — What is Amazon RDS?', 'DB instances, classes, storage, endpoints and the shared responsibility split.')}
${tl('https://www.mitiga.io/blog/how-mitiga-found-pii-in-exposed-amazon-rds-snapshots', '🕵️', 'Mitiga — PII in exposed Amazon RDS snapshots (2022)', 'How public snapshots leak whole databases without any break-in.')}

<h3>Sources</h3>
<ul>
  <li>What is RDS: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html</a></li>
  <li>RDS in a VPC, DB subnet groups: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html</a></li>
  <li>Parameter groups: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html</a></li>
  <li>SSL with RDS for PostgreSQL, rds.force_ssl default: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html</a></li>
  <li>Certificate bundles: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html</a></li>
  <li>Master password in Secrets Manager: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html</a></li>
  <li>rds_superuser and roles: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.html</a></li>
  <li>Encryption at rest: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html</a></li>
  <li>node-postgres SSL: <a href="https://node-postgres.com/features/ssl" target="_blank" rel="noopener">node-postgres.com/features/ssl</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/rds/postgresql/pricing/" target="_blank" rel="noopener">aws.amazon.com/rds/postgresql/pricing/</a> (Price List API, Singapore, 19/11/2026)</li>
  <li>Mitiga research (15/11/2022): <a href="https://www.mitiga.io/blog/how-mitiga-found-pii-in-exposed-amazon-rds-snapshots" target="_blank" rel="noopener">mitiga.io/blog/how-mitiga-found-pii-in-exposed-amazon-rds-snapshots</a></li>
</ul>
</div>
`;
const L61_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 1</span>
<h2>6.1 — RDS cho PostgreSQL: thuê một cơ sở dữ liệu, không phải trông một cái máy chủ</h2>
<p class="lead">Trên VPS, PostgreSQL chỉ là thêm một container cạnh app: bạn tự chọn phiên bản, tự viết <code>postgresql.conf</code>, tự sao lưu bằng cron và cầu cho ổ đĩa đừng hỏng. <strong>Amazon RDS</strong> chạy đúng engine PostgreSQL đó thay bạn — phần cứng, hệ điều hành, vá phiên bản nhỏ, sao lưu tự động, chuyển dự phòng — và đưa bạn một <strong>endpoint</strong> để kết nối. Bạn vẫn giữ schema, câu truy vấn, người dùng và mọi công tắc bảo mật. Bài này dựng một instance RDS đúng cách (subnet private, mã hoá, không gõ mật khẩu nào), rồi chạy một PostgreSQL thật sau mạng private có ép TLS để bạn thấy tận mắt từng công tắc đó làm gì với một kết nối.</p>

<h3>Hình dung: căn hộ dịch vụ</h3>
<p>Tự chạy Postgres trên VPS giống sở hữu một căn nhà: mái dột, ống nước, ổ khoá đều tự lo. RDS là <strong>căn hộ dịch vụ</strong>. Ban quản lý toà nhà (AWS) sửa ống nước ban đêm (khung giờ bảo trì), giữ một bản sao chìa khoá trong két (sao lưu tự động), và chuyển bạn sang căn y hệt bên cạnh nếu căn của bạn bị ngập (chuyển dự phòng Multi-AZ, bài 6.2). Nhưng để gì trong phòng, đưa chìa cho ai, có để cửa mở hay không — vẫn là việc của bạn. AWS gọi đó là <strong>mô hình trách nhiệm chung</strong> (shared responsibility).</p>

<table>
  <thead><tr><th>AWS làm (managed)</th><th>Bạn vẫn phải làm</th></tr></thead>
  <tbody>
    <tr><td>Phần cứng, hệ điều hành, cài PostgreSQL</td><td>Chọn phiên bản engine, cỡ instance, dung lượng ổ</td></tr>
    <tr><td>Vá phiên bản nhỏ trong khung bảo trì</td><td>Thử và lên lịch nâng phiên bản lớn (16 ⇒ 17)</td></tr>
    <tr><td>Snapshot tự động hằng ngày + đẩy transaction log mỗi 5 phút</td><td>Đặt số ngày giữ, diễn tập khôi phục, chụp snapshot tay trước thay đổi rủi ro</td></tr>
    <tr><td>Bản chờ + tự chuyển dự phòng (nếu trả tiền Multi-AZ)</td><td>Quyết định có cần không; làm app tự kết nối lại</td></tr>
    <tr><td>Mã hoá lưu trữ bằng KMS (một cờ lúc tạo)</td><td>Bật nó — sau này không bật tại chỗ được nữa</td></tr>
    <tr><td>Số đo trong CloudWatch</td><td>Schema, index, truy vấn chậm, connection pool, người dùng và quyền</td></tr>
  </tbody>
</table>
<p>Cái bạn <strong>mất</strong>: SSH vào máy chạy cơ sở dữ liệu, lệnh <code>ALTER SYSTEM</code>, một superuser thật và quyền cài extension tuỳ ý. Người dùng chủ chỉ được vai <code>rds_superuser</code>, không phải <code>SUPERUSER</code>; cấu hình nằm trong <strong>parameter group</strong>; chỉ cài được extension nằm trong danh sách RDS hỗ trợ.</p>

<h3>Sáu khối dựng</h3>
<ul>
  <li><strong>DB subnet group</strong> — các subnet RDS được phép đặt cơ sở dữ liệu vào. Dùng subnet <em>private</em> ở ít nhất hai AZ (Chương 3): không có đường tới Internet Gateway.</li>
  <li><strong>Security group</strong> — cổng 5432 chỉ mở cho security group của app, không bao giờ cho một dải IP như <code>0.0.0.0/0</code>.</li>
  <li><strong>Parameter group</strong> — <code>postgresql.conf</code> của RDS. Có tham số áp dụng ngay, có tham số phải khởi động lại (<code>pending-reboot</code>).</li>
  <li><strong>Lớp instance + ổ lưu trữ</strong> — <code>db.t4g.micro</code> (2 vCPU loại burstable, 1 GiB) rẻ nhất; ổ gp3 tính theo GB-tháng dù bạn dùng hay chưa.</li>
  <li><strong>Endpoint</strong> — một tên DNS như <code>labflow-db.xxxx.ap-southeast-1.rds.amazonaws.com:5432</code>. Chuyển dự phòng cũng không đổi tên này, nên app chỉ cần biết tên.</li>
  <li><strong>Thông tin đăng nhập chủ</strong> — với <code>--manage-master-user-password</code>, RDS tự sinh mật khẩu và cất vào Secrets Manager (bài 6.3). Không ai gõ nó, không ai dán nó vào nhóm chat.</li>
</ul>

<h3>Xem chạy (1): tạo RDS đúng cách</h3>
<p>LocalStack bản miễn phí không có RDS, nên phần này chạy trên <strong>Moto</strong> — một bộ giả lập AWS khác — chỉ là cấu hình, phía sau không có cơ sở dữ liệu nào. Đọc nó như thứ tự công việc trên tài khoản thật.</p>
${OUT_61_RDS_API}
<ul>
  <li>Subnet group trải hai AZ <code>ap-southeast-1a</code> và <code>ap-southeast-1b</code>; luật của security group trỏ tới một <em>group</em>, không trỏ tới IP.</li>
  <li><code>rds.force_ssl=1</code> ở trạng thái <code>pending-reboot</code>: có hiệu lực sau lần khởi động lại kế tiếp. Với RDS for PostgreSQL 15 trở lên, giá trị mặc định đã là 1.</li>
  <li>Endpoint nghe cổng 5432, <code>PubliclyAccessible False</code>, <code>StorageEncrypted True</code>, bí mật chủ ở trạng thái <code>active</code>. <strong>Moto khác AWS:</strong> nó báo <code>available</code> ngay (AWS thật nằm ở <code>creating</code> vài phút) và ghi username <code>admin</code> vào bí mật; AWS ghi đúng tên người dùng chủ bạn chọn.</li>
  <li>Lệnh cuối mới quan trọng nhất: API vui vẻ tạo một instance <strong>công khai, không mã hoá</strong>, giữ sao lưu <strong>0 ngày</strong>. AWS đưa bạn công tắc; không có gì ép bạn bật chúng. Lab 6.6 biến điều này thành một bảng kiểm có chấm điểm.</li>
</ul>

<h3>Xem chạy (2): mạng private và ép TLS, chạy thật</h3>
<p>Để thấy gói tin, một PostgreSQL 16 thật đóng vai RDS trong Docker. Nó chỉ nằm trong một mạng <code>--internal</code> (10.146.10.0/24 — không có đường ra, giống subnet private) và <code>pg_hba.conf</code> từ chối mọi kết nối không mã hoá, đúng việc <code>rds.force_ssl=1</code> làm. Ba máy: <code>rds</code>, <code>app</code> (ở cả hai mạng, như một máy EC2/task ECS trong VPC) và <code>ngoai</code> (chỉ ở mạng public — laptop của bạn ngoài Internet).</p>
${OUT_61_RDS_THAT_A}
<ol>
  <li>Từ ngoài vào, kết nối thậm chí không bị từ chối — nó <strong>hết giờ chờ</strong> (timeout). Không có đường nào. Đó là cảm giác “subnet private + security group” khi nhìn từ Internet, và là lý do bạn không thể trỏ phần mềm SQL trên máy tính thẳng vào một RDS private: phải qua bastion, chuyển cổng SSM hoặc VPN (Chương 3.6).</li>
  <li>Từ app, <code>sslmode=disable</code> bị máy chủ từ chối: “no encryption”.</li>
  <li><code>sslmode=verify-full</code> kiểm chuỗi chứng chỉ <em>và</em> kiểm tên máy có khớp không. Phiên chạy TLS 1.3. Trên AWS, CA là <strong>global bundle</strong> của RDS (<code>global-bundle.pem</code>), tải một lần rồi đóng gói cùng app.</li>
</ol>

<h3>Kết nối từ Node.js và Spring Boot</h3>
${MA_KET_NOI}
${OUT_61_RDS_THAT_B}
<ul>
  <li>Có CA, driver báo <code>ssl: true</code>, TLSv1.3. Thiếu CA, <code>rejectUnauthorized: true</code> từ chối chứng chỉ không truy được về gốc tin cậy. “Cách chữa” hấp dẫn <code>rejectUnauthorized: false</code> vẫn mã hoá nhưng nhận <em>bất kỳ</em> chứng chỉ nào — kể cả của kẻ đứng giữa. Hãy đóng gói CA thay vì tắt kiểm tra.</li>
  <li>Truy vấn 0,2 giây không vào log, truy vấn 0,7 giây thì có: <code>log_min_duration_statement=500</code>. Trên RDS bạn đặt nó trong parameter group và đọc log ở console hoặc CloudWatch Logs.</li>
  <li>Ở đây <code>labflow</code> là superuser thật (<code>t</code>). Trên RDS, cùng câu truy vấn trả <code>f</code> — người dùng chủ chỉ có <code>rds_superuser</code>.</li>
</ul>
<p>Spring Boot không cần gì đặc biệt — driver JDBC của PostgreSQL hiểu đúng <code>sslmode</code> đó:</p>
${props(`
spring.datasource.url=jdbc:postgresql://labflow-db.xxxx.ap-southeast-1.rds.amazonaws.com:5432/labflow?sslmode=verify-full&sslrootcert=/etc/ssl/rds/global-bundle.pem
spring.datasource.username=labflow_app
# mật khẩu: lấy từ Secrets Manager lúc chạy (bài 6.3) — không bao giờ nằm trong tệp này
spring.datasource.hikari.maximum-pool-size=10`)}

<h3>RDS hay PostgreSQL trong Docker trên VPS?</h3>
<table>
  <thead><tr><th></th><th>Postgres trong Docker trên VPS</th><th>RDS db.t4g.micro (Singapore)</th></tr></thead>
  <tbody>
    <tr><td>Giá tháng</td><td>Nằm trong tiền VPS bạn đã trả</td><td>0,025 USD/giờ ≈ 18,25 USD + 20 GB gp3 × 0,138 = 2,76 USD ⇒ ~21 USD (Multi-AZ: 0,051 USD/giờ ≈ 37 USD)</td></tr>
    <tr><td>Sao lưu</td><td>Script của bạn, cron của bạn, tự diễn tập khôi phục</td><td>Tự động, khôi phục tới từng giây trong khoảng giữ</td></tr>
    <tr><td>Hỏng ổ / hỏng máy</td><td>Tự tay khôi phục từ bản dump gần nhất</td><td>Multi-AZ: tự chuyển dự phòng; một AZ: khôi phục từ snapshot</td></tr>
    <tr><td>Quyền kiểm soát</td><td>Toàn quyền: extension nào, cấu hình nào cũng được, có SSH</td><td>Parameter group, extension được hỗ trợ, không vào máy được</td></tr>
    <tr><td>Chung CPU/RAM/ổ với app</td><td>Có — đầy ổ là dừng cả hai</td><td>Không — instance riêng, ổ có thể tự nới</td></tr>
  </tbody>
</table>
<p>Với đồ án sinh viên hay một VPS nhỏ, Postgres trong Docker là lựa chọn ổn và trung thực — miễn là sao lưu có thật và đã thử khôi phục. Khi có cả nhóm, có cam kết thời gian chạy (SLA) hay dữ liệu khách hàng, trả ~21 USD mỗi tháng để sao lưu và chuyển dự phòng thành chuyện 3 giờ sáng của người khác thường lại là phương án rẻ hơn.</p>

<h3>Góc hacker: lộ cả cơ sở dữ liệu mà không cần phá gì</h3>
<p>Kẻ tấn công hiếm khi “hack” một cơ sở dữ liệu. Họ <strong>tìm thấy</strong> nó. Hai kiểu cứ lặp lại:</p>
<ul>
  <li><strong>Snapshot công khai.</strong> Tháng 11/2022, nhóm nghiên cứu Mitiga công bố họ tìm thấy <em>hàng trăm</em> snapshot RDS bị lộ mỗi tháng — chia sẻ ở chế độ “public” nên tài khoản AWS nào cũng khôi phục được — nhiều cái đầy dữ liệu cá nhân. Không cần mật khẩu: khôi phục snapshot vào tài khoản của mình rồi đọc.</li>
  <li><strong>Instance công khai</strong> mở 5432 cho <code>0.0.0.0/0</code>, bị máy quét toàn Internet tìm ra trong vài giờ rồi dò mật khẩu phổ biến.</li>
</ul>
<p>Cách phòng là bốn công tắc, đều đã thấy ở trên: <code>--no-publicly-accessible</code>, security group chỉ trỏ tới group của app, <code>--storage-encrypted</code> (snapshot mã hoá thì không thể chia sẻ công khai), và một mật khẩu không ai gõ (<code>--manage-master-user-password</code>). Trong công ty, các luật AWS Config có sẵn như <code>rds-instance-public-access-check</code> và <code>rds-snapshots-public-prohibited</code> bắt lỗi này trong vài phút.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>“‘Managed’ ở RDS nghĩa là gì — việc gì vẫn là của bạn?”</strong> — AWS lo phần cứng, hệ điều hành, vá lỗi, sao lưu, cơ chế chuyển dự phòng. Tôi lo schema, index, truy vấn, người dùng và quyền, chỉnh tham số, chọn Multi-AZ/số ngày giữ/mã hoá, đường mạng vào DB và chi phí.</li>
  <li><strong>“App của bạn vào cơ sở dữ liệu nằm trong subnet private bằng cách nào?”</strong> — App chạy trong cùng VPC; security group của DB chỉ mở 5432 cho security group của app; app dùng tên DNS của endpoint với TLS verify-full. Người vào bằng chuyển cổng SSM hoặc bastion, không bao giờ để DB công khai.</li>
  <li><strong>“Bật mã hoá cho một instance RDS đang chạy được không?”</strong> — Không bật tại chỗ được. Chụp snapshot ⇒ chép snapshot kèm khoá KMS ⇒ khôi phục ra instance mới ⇒ chuyển app sang. Đúng là lab ở bài 6.6.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Lấy <code>scratchpad/aws/lab/c6/61.sh</code> làm mẫu: thêm vai thứ hai <code>labflow_ro</code> chỉ được <code>SELECT</code>, kết nối bằng vai đó từ container app với <code>verify-full</code>, và cho thấy lệnh <code>INSERT</code> thất bại. Sau đó bỏ đường dẫn CA và ghi lại đúng thông báo lỗi.</p>
<p><strong>Đạt khi</strong>: bạn có ba output chụp lại — một SELECT thành công bằng <code>labflow_ro</code>, một lỗi <code>permission denied</code> khi INSERT, và lỗi chứng chỉ khi thiếu CA.</p>
${giai('Gợi ý: câu SQL', sql(`
create role labflow_ro login password 'doi-mat-khau-nay';
grant connect on database labflow to labflow_ro;
grant usage on schema public to labflow_ro;
grant select on all tables in schema public to labflow_ro;
alter default privileges in schema public grant select on tables to labflow_ro;`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RDS</span><span class="v">Dịch vụ cơ sở dữ liệu quan hệ được quản lý: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Db2.</span></div>
  <div class="kv"><span class="k">DB subnet group</span><span class="v">Các subnet (≥ 2 AZ) RDS được đặt instance và bản chờ vào.</span></div>
  <div class="kv"><span class="k">Parameter group</span><span class="v">postgresql.conf của RDS; tham số tĩnh cần khởi động lại.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">Tên DNS + cổng cố định của instance; giữ nguyên qua chuyển dự phòng.</span></div>
  <div class="kv"><span class="k">rds.force_ssl</span><span class="v">Từ chối kết nối không mã hoá; mặc định 1 từ PostgreSQL 15 trên RDS.</span></div>
  <div class="kv"><span class="k">rds_superuser</span><span class="v">Vai mạnh nhất bạn có trên RDS — không phải SUPERUSER thật.</span></div>
  <div class="kv"><span class="k">verify-full</span><span class="v">Chế độ TLS kiểm chuỗi CA và kiểm tên máy.</span></div>
  <div class="kv"><span class="k">Trách nhiệm chung</span><span class="v">AWS bảo vệ đám mây; bạn bảo vệ thứ bạn đặt và cấu hình trong đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>RDS = PostgreSQL không phải lo việc máy chủ; dữ liệu, quyền truy cập và cấu hình vẫn là của bạn.</li>
  <li>Subnet group private ở hai AZ, security group chỉ nhận từ group của app, không truy cập công khai.</li>
  <li>Mã hoá lưu trữ quyết định lúc tạo; mật khẩu chủ nằm trong Secrets Manager.</li>
  <li>Kết nối bằng TLS <code>verify-full</code> và bộ CA của RDS — không bao giờ <code>rejectUnauthorized: false</code>.</li>
  <li>API nhận cả cấu hình nguy hiểm: an toàn đến từ bảng kiểm của bạn, không đến từ mặc định.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html', '🐘', 'Tài liệu AWS — Amazon RDS là gì?', 'Instance, lớp máy, ổ lưu trữ, endpoint và phần chia trách nhiệm.')}
${tl('https://www.mitiga.io/blog/how-mitiga-found-pii-in-exposed-amazon-rds-snapshots', '🕵️', 'Mitiga — Dữ liệu cá nhân trong snapshot RDS bị lộ (2022)', 'Snapshot công khai làm lộ cả cơ sở dữ liệu mà không cần đột nhập.')}

<h3>Nguồn</h3>
<ul>
  <li>RDS là gì: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html</a></li>
  <li>RDS trong VPC, DB subnet group: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html</a></li>
  <li>Parameter group: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html</a></li>
  <li>SSL với RDS for PostgreSQL, mặc định rds.force_ssl: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.SSL.html</a></li>
  <li>Bộ chứng chỉ: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html</a></li>
  <li>Mật khẩu chủ trong Secrets Manager: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html</a></li>
  <li>rds_superuser và các vai: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.html</a></li>
  <li>Mã hoá lưu trữ: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html</a></li>
  <li>SSL của node-postgres: <a href="https://node-postgres.com/features/ssl" target="_blank" rel="noopener">node-postgres.com/features/ssl</a></li>
  <li>Giá: <a href="https://aws.amazon.com/rds/postgresql/pricing/" target="_blank" rel="noopener">aws.amazon.com/rds/postgresql/pricing/</a> (Price List API, Singapore, 19/11/2026)</li>
  <li>Nghiên cứu Mitiga (15/11/2022): <a href="https://www.mitiga.io/blog/how-mitiga-found-pii-in-exposed-amazon-rds-snapshots" target="_blank" rel="noopener">mitiga.io/blog/how-mitiga-found-pii-in-exposed-amazon-rds-snapshots</a></li>
</ul>
</div>
`;

/* ═════ 6.2 — Backups, Multi-AZ and read replicas ═════ */
const L62_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 2</span>
<h2>6.2 — Backups, Multi-AZ and read replicas: four tools, four different disasters</h2>
<p class="lead">“We have a replica, so we have a backup” is one of the most expensive sentences in operations. RDS gives you four tools — automated backups with point-in-time restore, manual snapshots, Multi-AZ and read replicas — and each one protects against a <em>different</em> kind of disaster. This lesson runs all four ideas on a real PostgreSQL: a streaming replica that faithfully copies an accidental <code>DROP TABLE</code>, a point-in-time restore that brings the table back to the exact second before it, and a promotion that turns a replica into the new primary when the old one “loses its AZ”.</p>

<h3>The picture: a notebook, a nightly photo and a diary</h3>
<p>Imagine the database as a notebook. Every night someone <strong>photographs every page</strong> (the daily snapshot). During the day a clerk writes <strong>every single change</strong> into a diary (the write-ahead log, WAL). If the notebook burns at 09:41, you take last night's photo and <strong>replay the diary up to 09:40:59</strong> — that is point-in-time recovery. A second notebook kept up to date in another building (a replica) is great if the first building burns down, but useless if someone tears out a page: the clerk copies the tearing too.</p>

<h3>Two numbers to agree on first: RPO and RTO</h3>
<ul>
  <li><strong>RPO</strong> (Recovery Point Objective) — how much <em>data</em> you may lose, measured in time. “RPO 5 minutes” = after a disaster at most the last 5 minutes are gone.</li>
  <li><strong>RTO</strong> (Recovery Time Objective) — how long you may be <em>down</em>. “RTO 1 hour” = service back within an hour.</li>
</ul>
<p>Every tool below is a trade between these two numbers and money. Ask the business owner for them before you choose — in an interview, saying “it depends on RPO/RTO” and then giving numbers is the senior answer.</p>

<table>
  <thead><tr><th>Tool</th><th>Protects against</th><th>Does NOT protect against</th><th>Typical RPO / RTO</th></tr></thead>
  <tbody>
    <tr><td><strong>Automated backups + PITR</strong> (retention 1–35 days)</td><td>Bad deploy, <code>DROP</code>/<code>DELETE</code> by mistake, corruption</td><td>Losing the whole Region</td><td>RPO ≈ 5 min (logs uploaded every 5 minutes) · RTO = time to restore a new instance (often tens of minutes)</td></tr>
    <tr><td><strong>Manual snapshot</strong></td><td>“Before migration v42” safety net; survives deleting the instance; copy to another Region/account</td><td>Changes after the snapshot</td><td>RPO = age of the snapshot</td></tr>
    <tr><td><strong>Multi-AZ</strong> (synchronous standby)</td><td>Host failure, AZ outage, patching downtime</td><td>Your own mistakes — the standby applies them too</td><td>RPO 0 · failover typically 60–120 s (Multi-AZ DB cluster with two readable standbys: typically under 35 s)</td></tr>
    <tr><td><strong>Read replica</strong> (asynchronous)</td><td>Read load; cross-Region copy for disaster recovery (promote manually)</td><td>Mistakes; it lags a little</td><td>RPO = replication lag · RTO = time to promote + repoint the app</td></tr>
  </tbody>
</table>

<h3>See it running (1): the API</h3>
${OUT_62_VAN_HANH_API}
<ul>
  <li>The backup window is in <strong>UTC</strong>: 18:00–18:30 UTC is 01:00–01:30 in Vietnam — pick a quiet hour.</li>
  <li>Point-in-time restore never rewinds the existing instance. It <strong>creates a new one</strong> with a new endpoint (<code>labflow-db-0915</code>). Plan the switch: change the app's configuration (or rename instances) after you have checked the data.</li>
  <li>The replica gets its <strong>own</strong> endpoint; the app must send reads there deliberately. Multi-AZ keeps the <strong>same</strong> endpoint and the standby cannot be read at all.</li>
  <li><code>reboot --force-failover</code> is how you rehearse a failover. Do it in staging and measure how long your app takes to reconnect — that, not the 60 seconds, is your real RTO.</li>
  <li><code>describe-db-snapshots</code> lists the automated <code>rds:labflow-db-…</code> next to your manual one. Automated snapshots disappear with the retention window (and, by default, with the instance); manual ones stay — and stay on the bill — until you delete them.</li>
</ul>

<h3>See it running (2): base backup, WAL archive and a replica — real PostgreSQL</h3>
<p>RDS hides the mechanics, but they are plain PostgreSQL. Here a primary archives every WAL segment to a shared volume (RDS sends them to S3), <code>pg_basebackup</code> takes the “nightly photo”, and a second server starts as a streaming replica.</p>
${OUT_62_SAO_LUU_THAT}
${OUT_62_BAN_DOC_THAT}
<ul>
  <li>Three bookings inserted on the primary appear on the replica within a second; <code>pg_stat_replication</code> shows <code>streaming</code>, <code>async</code> and a replay lag of about 6 ms.</li>
  <li>Writing to the replica fails: <code>cannot execute INSERT in a read-only transaction</code>. If your ORM sends writes to the reader endpoint, this is the error you will see in production.</li>
</ul>

<h3>See it running (3): the accident</h3>
${OUT_62_XOA_NHAM_THAT}
<p>The replica dropped the table too, within a second. Replication is <em>not</em> a backup: it copies mistakes as faithfully as data. What saves us is the archive — eight WAL segments already copied away, including the one that contains the <code>DROP</code>.</p>

<h3>See it running (4): point-in-time restore to the second before</h3>
${OUT_62_PITR_THAT}
<ol>
  <li>A new server starts from the base backup with three settings: where to fetch WAL from, the target time, and “promote when you get there”.</li>
  <li>The log says it all: <code>recovery stopping before commit of transaction 745</code> — that transaction was the <code>DROP</code>, three seconds after our target. A new timeline (2) starts, and the server accepts writes.</li>
  <li>All four bookings are back. On RDS this whole page is one command: <code>restore-db-instance-to-point-in-time --restore-time …</code>. Then you either point the app at the new instance or copy the lost table back into the old one with <code>pg_dump -t bookings</code>.</li>
</ol>

<h3>See it running (5): losing an AZ — promote the replica</h3>
${OUT_62_CHUYEN_DU_PHONG_THAT}
<p>Promotion itself took a fraction of a second; the replica is now a normal read-write primary. On RDS Multi-AZ the slow parts are <em>detecting</em> the failure and flipping the endpoint's DNS to the standby — that is why AWS quotes 60–120 seconds. Your app must survive that window: retry with backoff, keep the DNS TTL low (do not cache the IP), and let the connection pool drop broken connections.</p>

<h3>Real incident: GitLab.com, 31 January 2017</h3>
<p>While fixing replication lag, an engineer wiped the data directory to re-sync the secondary — on the <strong>primary</strong>, in the wrong terminal. Then the team discovered that the backups they believed in did not work as expected. GitLab restored from an LVM snapshot taken by hand about <strong>6 hours</strong> earlier; by their own estimate about 5,000 projects, 5,000 comments and 700 new user accounts created in that window were lost. Their public postmortem is required reading. Lessons that map directly onto RDS:</p>
<ul>
  <li>A backup you have never restored is a hope, not a backup. Schedule a monthly “restore to a new instance and run checks” drill.</li>
  <li>Replicas and backups solve different problems; you need both.</li>
  <li>Make the dangerous target visually different (prompt colours, separate accounts for prod) and require deletion protection on production databases.</li>
</ul>

<h3>Cost notes (Singapore, 11/2026)</h3>
<ul>
  <li>Backup storage up to the size of your provisioned storage is free; beyond that 0.095 USD/GB-month.</li>
  <li>Multi-AZ roughly doubles the instance price: <code>db.t4g.micro</code> 0.025 ⇒ 0.051 USD/h.</li>
  <li>A read replica is a full instance billed like any other (plus cross-Region data transfer if it lives in another Region).</li>
  <li>Old manual snapshots are the most common forgotten line on an RDS bill.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>“Multi-AZ or read replica — what is the difference?”</strong> — Multi-AZ: synchronous standby for availability, not readable, same endpoint, automatic failover. Read replica: asynchronous copy for read scaling or cross-Region DR, readable, own endpoint, manual promotion. Neither protects against a bad <code>DELETE</code>.</li>
  <li><strong>“Someone dropped a table at 14:03. What do you do?”</strong> — Stop writes if needed, PITR to 14:02:59 into a new instance, verify, then either switch the app or copy the table back; write a postmortem; add guardrails.</li>
  <li><strong>“What are RPO and RTO for your design?”</strong> — Give numbers: PITR RPO ≈ 5 minutes; Multi-AZ RPO 0 and RTO ~1–2 minutes plus app reconnect time.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Rerun <code>scratchpad/aws/lab/c6/62.sh</code>, but before the <code>DROP</code> create a named restore point with <code>select pg_create_restore_point('truoc-don-dep')</code>, and restore with <code>recovery_target_name</code> instead of a time.</p>
<p><strong>Pass when</strong>: the restored server's log shows <code>recovery stopping at restore point "truoc-don-dep"</code> and <code>bookings</code> has 4 rows.</p>
${giai('Hint: the three recovery settings', bash(`
restore_command = 'cp /archive/%f %p'
recovery_target_name = 'truoc-don-dep'
recovery_target_action = 'promote'
# + an empty file recovery.signal in the data directory`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RPO / RTO</span><span class="v">Data you may lose / time you may be down.</span></div>
  <div class="kv"><span class="k">PITR</span><span class="v">Point-in-time recovery: snapshot + replayed logs up to a chosen second; always a new instance.</span></div>
  <div class="kv"><span class="k">WAL</span><span class="v">Write-ahead log: PostgreSQL's diary of every change.</span></div>
  <div class="kv"><span class="k">Backup window</span><span class="v">Daily 30-minute slot (UTC) for the automated snapshot.</span></div>
  <div class="kv"><span class="k">Multi-AZ</span><span class="v">Synchronous standby in another AZ; automatic failover; not readable.</span></div>
  <div class="kv"><span class="k">Read replica</span><span class="v">Asynchronous readable copy with its own endpoint; can be promoted.</span></div>
  <div class="kv"><span class="k">Promote</span><span class="v">Turn a replica into an independent read-write primary.</span></div>
  <div class="kv"><span class="k">Replication lag</span><span class="v">How far an async replica is behind the primary.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Backups/PITR fix mistakes; Multi-AZ fixes hardware and AZ loss; replicas scale reads and support DR.</li>
  <li>Replicas copy <code>DROP TABLE</code> within a second — they are not backups.</li>
  <li>PITR = base backup + WAL replay to a timestamp; on RDS one command, always into a new instance.</li>
  <li>Failover is fast on the database side; your app's reconnect logic decides the real downtime.</li>
  <li>Test restores regularly and delete snapshots you no longer need.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/', '📉', 'GitLab — Postmortem of database outage of January 31 (2017)', 'Wrong server, failed backups, 6-hour-old snapshot: the classic.')}
${tl('https://www.postgresql.org/docs/16/continuous-archiving.html', '📼', 'PostgreSQL 16 — Continuous archiving and PITR', 'The mechanics RDS runs for you: base backups, WAL archive, recovery targets.')}

<h3>Sources</h3>
<ul>
  <li>Automated backups: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html</a></li>
  <li>Point-in-time restore, logs every five minutes: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html</a></li>
  <li>Multi-AZ with one standby: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html</a></li>
  <li>Failover times 60–120 s: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html</a></li>
  <li>Multi-AZ DB cluster, under 35 s: <a href="https://aws.amazon.com/rds/features/multi-az/" target="_blank" rel="noopener">aws.amazon.com/rds/features/multi-az/</a></li>
  <li>Read replicas: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html</a></li>
  <li>PostgreSQL continuous archiving: <a href="https://www.postgresql.org/docs/16/continuous-archiving.html" target="_blank" rel="noopener">postgresql.org/docs/16/continuous-archiving.html</a></li>
  <li>GitLab postmortem: <a href="https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/</a></li>
  <li>Pricing (backup storage, Multi-AZ): <a href="https://aws.amazon.com/rds/postgresql/pricing/" target="_blank" rel="noopener">aws.amazon.com/rds/postgresql/pricing/</a></li>
</ul>
</div>
`;
const L62_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 2</span>
<h2>6.2 — Sao lưu, Multi-AZ và bản đọc: bốn công cụ cho bốn kiểu thảm hoạ khác nhau</h2>
<p class="lead">“Mình có bản sao rồi nên coi như có sao lưu” là một trong những câu đắt giá nhất trong nghề vận hành. RDS đưa bạn bốn công cụ — sao lưu tự động kèm khôi phục theo thời điểm, snapshot thủ công, Multi-AZ và read replica — và mỗi cái chống một kiểu thảm hoạ <em>khác nhau</em>. Bài này chạy cả bốn ý tưởng trên PostgreSQL thật: một bản đọc streaming chép trung thành cả lệnh <code>DROP TABLE</code> lỡ tay, một lần khôi phục theo thời điểm đưa bảng trở về đúng giây trước đó, và một lần promote biến bản đọc thành máy chính mới khi máy cũ “mất AZ”.</p>

<h3>Hình dung: cuốn sổ, ảnh chụp mỗi đêm và cuốn nhật ký</h3>
<p>Coi cơ sở dữ liệu như một cuốn sổ. Mỗi đêm có người <strong>chụp ảnh từng trang</strong> (snapshot hằng ngày). Ban ngày, một thư ký ghi <strong>từng thay đổi một</strong> vào cuốn nhật ký (write-ahead log, WAL). Nếu cuốn sổ cháy lúc 09:41, bạn lấy ảnh đêm qua rồi <strong>chép lại nhật ký tới 09:40:59</strong> — đó là khôi phục theo thời điểm. Một cuốn sổ thứ hai được cập nhật liên tục ở toà nhà khác (bản đọc) rất có ích nếu toà thứ nhất cháy, nhưng vô dụng nếu ai đó xé một trang: người thư ký chép luôn cả việc xé trang.</p>

<h3>Hai con số phải thống nhất trước: RPO và RTO</h3>
<ul>
  <li><strong>RPO</strong> (Recovery Point Objective) — được phép mất bao nhiêu <em>dữ liệu</em>, đo bằng thời gian. “RPO 5 phút” = sau sự cố, mất tối đa 5 phút cuối.</li>
  <li><strong>RTO</strong> (Recovery Time Objective) — được phép <em>ngừng chạy</em> bao lâu. “RTO 1 giờ” = dịch vụ quay lại trong vòng một giờ.</li>
</ul>
<p>Mỗi công cụ bên dưới là một phép đổi giữa hai con số này và tiền. Hãy hỏi người phụ trách nghiệp vụ hai con số đó trước khi chọn — trong phỏng vấn, nói “tuỳ RPO/RTO” rồi đưa ra con số cụ thể là câu trả lời của người có kinh nghiệm.</p>

<table>
  <thead><tr><th>Công cụ</th><th>Chống được</th><th>KHÔNG chống được</th><th>RPO / RTO thường gặp</th></tr></thead>
  <tbody>
    <tr><td><strong>Sao lưu tự động + PITR</strong> (giữ 1–35 ngày)</td><td>Deploy hỏng, <code>DROP</code>/<code>DELETE</code> nhầm, dữ liệu hư</td><td>Mất cả Region</td><td>RPO ≈ 5 phút (log đẩy lên mỗi 5 phút) · RTO = thời gian dựng instance mới (thường vài chục phút)</td></tr>
    <tr><td><strong>Snapshot thủ công</strong></td><td>Lưới an toàn “trước migration v42”; còn sau khi xoá instance; chép sang Region/tài khoản khác</td><td>Thay đổi sau lúc chụp</td><td>RPO = tuổi của snapshot</td></tr>
    <tr><td><strong>Multi-AZ</strong> (bản chờ đồng bộ)</td><td>Hỏng máy chủ, sự cố AZ, ngừng máy lúc vá</td><td>Lỗi của chính bạn — bản chờ cũng áp dụng y hệt</td><td>RPO 0 · chuyển dự phòng thường 60–120 giây (Multi-AZ DB cluster có hai bản chờ đọc được: thường dưới 35 giây)</td></tr>
    <tr><td><strong>Read replica</strong> (bất đồng bộ)</td><td>Tải đọc; bản sao khác Region để khắc phục thảm hoạ (promote bằng tay)</td><td>Lỗi thao tác; luôn trễ một chút</td><td>RPO = độ trễ sao chép · RTO = thời gian promote + đổi chỗ trỏ của app</td></tr>
  </tbody>
</table>

<h3>Xem chạy (1): API</h3>
${OUT_62_VAN_HANH_API}
<ul>
  <li>Khung sao lưu tính theo <strong>UTC</strong>: 18:00–18:30 UTC là 01:00–01:30 giờ Việt Nam — chọn giờ vắng người dùng.</li>
  <li>Khôi phục theo thời điểm không bao giờ tua ngược instance đang chạy. Nó <strong>tạo instance mới</strong> với endpoint mới (<code>labflow-db-0915</code>). Lên kế hoạch chuyển: đổi cấu hình của app (hoặc đổi tên instance) sau khi đã kiểm dữ liệu.</li>
  <li>Bản đọc có endpoint <strong>riêng</strong>; app phải chủ động gửi truy vấn đọc sang đó. Multi-AZ giữ <strong>cùng</strong> endpoint và bản chờ hoàn toàn không đọc được.</li>
  <li><code>reboot --force-failover</code> là cách diễn tập chuyển dự phòng. Làm ở môi trường staging và đo xem app mất bao lâu để kết nối lại — con số đó, không phải 60 giây, mới là RTO thật của bạn.</li>
  <li><code>describe-db-snapshots</code> liệt kê snapshot tự động <code>rds:labflow-db-…</code> cạnh snapshot thủ công. Snapshot tự động hết hạn theo số ngày giữ (và mặc định mất theo instance khi xoá); snapshot thủ công thì ở lại — và ở lại trên hoá đơn — tới khi bạn xoá.</li>
</ul>

<h3>Xem chạy (2): base backup, kho WAL và bản đọc — PostgreSQL thật</h3>
<p>RDS giấu cơ chế đi, nhưng bên dưới là PostgreSQL bình thường. Ở đây máy chính đẩy từng đoạn WAL vào một volume chung (RDS đẩy lên S3), <code>pg_basebackup</code> chụp “ảnh đêm qua”, và một máy thứ hai khởi động làm bản đọc streaming.</p>
${OUT_62_SAO_LUU_THAT}
${OUT_62_BAN_DOC_THAT}
<ul>
  <li>Ba lượt đặt lịch ghi vào máy chính hiện ra ở bản đọc trong chưa tới một giây; <code>pg_stat_replication</code> báo <code>streaming</code>, <code>async</code> và độ trễ phát lại khoảng 6 ms.</li>
  <li>Ghi vào bản đọc thì lỗi: <code>cannot execute INSERT in a read-only transaction</code>. Nếu ORM của bạn gửi lệnh ghi sang reader endpoint, đây là lỗi bạn sẽ gặp trên production.</li>
</ul>

<h3>Xem chạy (3): tai nạn</h3>
${OUT_62_XOA_NHAM_THAT}
<p>Bản đọc cũng mất bảng, chỉ trong một giây. Sao chép <em>không phải</em> sao lưu: nó chép lỗi trung thành y như chép dữ liệu. Thứ cứu chúng ta là kho lưu trữ — tám đoạn WAL đã được chép đi, gồm cả đoạn chứa lệnh <code>DROP</code>.</p>

<h3>Xem chạy (4): khôi phục về đúng giây trước đó</h3>
${OUT_62_PITR_THAT}
<ol>
  <li>Một máy mới khởi động từ base backup với ba thiết lập: lấy WAL ở đâu, mốc thời gian đích, và “tới nơi thì promote”.</li>
  <li>Log nói hết: <code>recovery stopping before commit of transaction 745</code> — giao dịch đó chính là lệnh <code>DROP</code>, ba giây sau mốc của ta. Một timeline mới (2) bắt đầu, và máy nhận ghi.</li>
  <li>Đủ bốn lượt đặt lịch đã trở lại. Trên RDS, cả trang này là một lệnh: <code>restore-db-instance-to-point-in-time --restore-time …</code>. Sau đó hoặc trỏ app sang instance mới, hoặc chép bảng bị mất về instance cũ bằng <code>pg_dump -t bookings</code>.</li>
</ol>

<h3>Xem chạy (5): mất một AZ — promote bản đọc</h3>
${OUT_62_CHUYEN_DU_PHONG_THAT}
<p>Bản thân lệnh promote chỉ mất một phần giây; bản đọc giờ là máy chính đọc-ghi bình thường. Với RDS Multi-AZ, phần chậm là <em>phát hiện</em> sự cố và đổi DNS của endpoint sang bản chờ — vì thế AWS nói 60–120 giây. App của bạn phải sống sót qua khoảng đó: thử lại có giãn cách, để TTL DNS thấp (đừng nhớ cứng IP), và để connection pool bỏ các kết nối đã gãy.</p>

<h3>Sự cố thật: GitLab.com, 31/01/2017</h3>
<p>Trong lúc xử lý độ trễ sao chép, một kỹ sư xoá thư mục dữ liệu để đồng bộ lại máy phụ — nhưng gõ trên máy <strong>chính</strong>, ở nhầm cửa sổ terminal. Rồi cả nhóm phát hiện các bản sao lưu họ tin tưởng không chạy như họ nghĩ. GitLab phải khôi phục từ một snapshot LVM chụp tay khoảng <strong>6 giờ</strong> trước đó; theo chính ước tính của họ, khoảng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới tạo trong khoảng đó bị mất. Bản postmortem công khai của họ là bài phải đọc. Bài học áp thẳng vào RDS:</p>
<ul>
  <li>Bản sao lưu chưa từng khôi phục thử chỉ là niềm hy vọng, chưa phải sao lưu. Lên lịch diễn tập hằng tháng: “khôi phục ra instance mới rồi chạy bộ kiểm”.</li>
  <li>Bản sao chép và bản sao lưu giải hai bài toán khác nhau; bạn cần cả hai.</li>
  <li>Làm cho môi trường nguy hiểm trông khác hẳn (màu dấu nhắc, tài khoản prod riêng) và bắt buộc bật chống xoá cho cơ sở dữ liệu production.</li>
</ul>

<h3>Ghi chú chi phí (Singapore, 11/2026)</h3>
<ul>
  <li>Ổ chứa sao lưu miễn phí tới đúng dung lượng ổ bạn đã cấp; vượt thì 0,095 USD/GB-tháng.</li>
  <li>Multi-AZ gần như gấp đôi giá instance: <code>db.t4g.micro</code> 0,025 ⇒ 0,051 USD/giờ.</li>
  <li>Read replica là một instance đầy đủ, tính tiền như mọi instance khác (cộng tiền truyền dữ liệu nếu nằm ở Region khác).</li>
  <li>Snapshot thủ công cũ là dòng hay bị quên nhất trên hoá đơn RDS.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>“Multi-AZ và read replica khác nhau thế nào?”</strong> — Multi-AZ: bản chờ đồng bộ để giữ dịch vụ chạy, không đọc được, cùng endpoint, tự chuyển dự phòng. Read replica: bản sao bất đồng bộ để chia tải đọc hoặc khắc phục thảm hoạ khác Region, đọc được, endpoint riêng, promote bằng tay. Cả hai đều không cứu được một lệnh <code>DELETE</code> sai.</li>
  <li><strong>“Ai đó xoá một bảng lúc 14:03. Bạn làm gì?”</strong> — Chặn ghi nếu cần, PITR về 14:02:59 ra instance mới, kiểm dữ liệu, rồi hoặc chuyển app sang, hoặc chép bảng về; viết postmortem; thêm rào chắn.</li>
  <li><strong>“RPO và RTO của thiết kế bạn là bao nhiêu?”</strong> — Đưa con số: PITR có RPO ≈ 5 phút; Multi-AZ có RPO 0 và RTO khoảng 1–2 phút cộng thời gian app kết nối lại.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Chạy lại <code>scratchpad/aws/lab/c6/62.sh</code>, nhưng trước lệnh <code>DROP</code> hãy tạo một điểm khôi phục có tên bằng <code>select pg_create_restore_point('truoc-don-dep')</code>, rồi khôi phục bằng <code>recovery_target_name</code> thay cho mốc thời gian.</p>
<p><strong>Đạt khi</strong>: log của máy khôi phục có dòng <code>recovery stopping at restore point "truoc-don-dep"</code> và bảng <code>bookings</code> có 4 dòng.</p>
${giai('Gợi ý: ba thiết lập khôi phục', bash(`
restore_command = 'cp /archive/%f %p'
recovery_target_name = 'truoc-don-dep'
recovery_target_action = 'promote'
# + một tệp rỗng recovery.signal trong thư mục dữ liệu`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RPO / RTO</span><span class="v">Lượng dữ liệu được phép mất / thời gian được phép ngừng.</span></div>
  <div class="kv"><span class="k">PITR</span><span class="v">Khôi phục theo thời điểm: snapshot + phát lại log tới một giây đã chọn; luôn ra instance mới.</span></div>
  <div class="kv"><span class="k">WAL</span><span class="v">Write-ahead log: cuốn nhật ký ghi mọi thay đổi của PostgreSQL.</span></div>
  <div class="kv"><span class="k">Backup window</span><span class="v">Khung 30 phút mỗi ngày (UTC) để chụp snapshot tự động.</span></div>
  <div class="kv"><span class="k">Multi-AZ</span><span class="v">Bản chờ đồng bộ ở AZ khác; tự chuyển dự phòng; không đọc được.</span></div>
  <div class="kv"><span class="k">Read replica</span><span class="v">Bản sao bất đồng bộ đọc được, có endpoint riêng; promote được.</span></div>
  <div class="kv"><span class="k">Promote</span><span class="v">Biến bản đọc thành máy chính đọc-ghi độc lập.</span></div>
  <div class="kv"><span class="k">Replication lag</span><span class="v">Bản sao bất đồng bộ đang chậm hơn máy chính bao xa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sao lưu/PITR sửa lỗi thao tác; Multi-AZ chống hỏng máy và mất AZ; bản đọc chia tải đọc và hỗ trợ khắc phục thảm hoạ.</li>
  <li>Bản đọc chép <code>DROP TABLE</code> chỉ trong một giây — nó không phải bản sao lưu.</li>
  <li>PITR = base backup + phát lại WAL tới một mốc thời gian; trên RDS là một lệnh, luôn ra instance mới.</li>
  <li>Phía cơ sở dữ liệu chuyển dự phòng rất nhanh; cách app kết nối lại mới quyết định thời gian ngừng thật.</li>
  <li>Diễn tập khôi phục đều đặn và xoá snapshot không còn cần.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/', '📉', 'GitLab — Postmortem sự cố cơ sở dữ liệu ngày 31/01 (2017)', 'Nhầm máy, sao lưu hỏng, snapshot 6 giờ tuổi: chuyện kinh điển.')}
${tl('https://www.postgresql.org/docs/16/continuous-archiving.html', '📼', 'PostgreSQL 16 — Lưu trữ liên tục và PITR', 'Cơ chế RDS chạy thay bạn: base backup, kho WAL, mốc khôi phục.')}

<h3>Nguồn</h3>
<ul>
  <li>Sao lưu tự động: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html</a></li>
  <li>Khôi phục theo thời điểm, log mỗi năm phút: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html</a></li>
  <li>Multi-AZ một bản chờ: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html</a></li>
  <li>Thời gian chuyển dự phòng 60–120 giây: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html</a></li>
  <li>Multi-AZ DB cluster, dưới 35 giây: <a href="https://aws.amazon.com/rds/features/multi-az/" target="_blank" rel="noopener">aws.amazon.com/rds/features/multi-az/</a></li>
  <li>Read replica: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html</a></li>
  <li>Lưu trữ liên tục của PostgreSQL: <a href="https://www.postgresql.org/docs/16/continuous-archiving.html" target="_blank" rel="noopener">postgresql.org/docs/16/continuous-archiving.html</a></li>
  <li>Postmortem của GitLab: <a href="https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/" target="_blank" rel="noopener">about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/</a></li>
  <li>Giá (ổ sao lưu, Multi-AZ): <a href="https://aws.amazon.com/rds/postgresql/pricing/" target="_blank" rel="noopener">aws.amazon.com/rds/postgresql/pricing/</a></li>
</ul>
</div>
`;

/* ═════ 6.3 — Secrets Manager and Parameter Store ═════ */
const L63_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 3</span>
<h2>6.3 — Secrets Manager and Parameter Store: passwords that live in a safe, not in your image</h2>
<p class="lead">A database password has to exist somewhere the app can read it. The usual places — a <code>.env</code> file committed “just once”, an <code>ENV</code> line in the Dockerfile, a value pasted into CI logs — are exactly where attackers look first. AWS gives you two safes: <strong>Secrets Manager</strong> (made for secrets, with rotation) and <strong>SSM Parameter Store</strong> (configuration, with an encrypted <code>SecureString</code> type). This lesson first proves, on a real image, why a secret baked into Docker is public to anyone who can pull it; then stores LabFlow's secrets properly and rotates a real PostgreSQL password while the app keeps running.</p>

<h3>The picture: a bank safe with a visitor log</h3>
<p>A password on a sticky note under the keyboard works — until someone else sits at the desk. A bank safe is different in three ways: only named people may open it (IAM), every opening is written in a log (CloudTrail), and the combination can be changed on a schedule without telling every customer (rotation). That is the whole idea of a secrets service.</p>

<h3>See it running (1): a password baked into an image</h3>
${OUT_63_ANH_LO_THAT}
<ol>
  <li><code>ENV DB_PASSWORD=…</code> is stored in the image <strong>configuration</strong>: <code>docker inspect</code> prints it, <code>docker history</code> prints the line that set it. Anyone with pull access — a contractor, a leaked registry token, a public repository by mistake — reads it in one command.</li>
  <li>The <code>.env</code> file was deleted in a later layer, and inside a running container it is truly gone. But an image is a stack of layers; the <code>COPY</code> layer still contains the file. Unpacking the image (<code>docker save</code> + <code>tar</code>) prints the JWT secret.</li>
  <li>Correct patterns: <strong>runtime</strong> secrets are injected when the container starts (ECS <code>secrets</code>, Kubernetes secrets, or the app reads Secrets Manager itself); <strong>build-time</strong> secrets (a private npm token) use BuildKit's <code>RUN --mount=type=secret</code>, which never writes them into a layer; and <code>.env*</code> goes into both <code>.gitignore</code> and <code>.dockerignore</code>.</li>
</ol>

<h3>Real incident: Codecov, January–April 2021</h3>
<p>Codecov's own security update states that an attacker gained access “because of an error in Codecov's Docker image creation process that allowed the actor to extract the credential” used to modify their Bash Uploader script. From 31 January 2021 the altered script could quietly send what customers' CI pipelines held — environment variables, tokens, keys — to a third-party server; Codecov's public update is dated 15 April 2021, two and a half months later, and notes that customers who compared the script's checksum before running it were not affected. One credential extracted from one image became a supply-chain attack on thousands of pipelines. Prevention: no long-lived credentials in images, short-lived roles for CI (Chapter 1.6, OIDC), and verifying checksums of scripts you pipe into a shell.</p>

<h3>Two safes: which one?</h3>
<table>
  <thead><tr><th></th><th>Secrets Manager</th><th>Parameter Store</th></tr></thead>
  <tbody>
    <tr><td>Made for</td><td>Secrets: DB credentials, API keys, OAuth client secrets</td><td>Configuration (<code>String</code>, <code>StringList</code>) and small secrets (<code>SecureString</code>)</td></tr>
    <tr><td>Rotation</td><td>Built in: managed rotation for RDS, or a rotation Lambda</td><td>None — you build it yourself</td></tr>
    <tr><td>Versions</td><td>Staging labels <code>AWSCURRENT</code>, <code>AWSPREVIOUS</code>, <code>AWSPENDING</code></td><td>Numbered versions + labels</td></tr>
    <tr><td>Encryption</td><td>Always, with KMS</td><td>Only <code>SecureString</code>, with KMS (<code>aws/ssm</code> or your key)</td></tr>
    <tr><td>Price (Singapore, 11/2026)</td><td>0.40 USD per secret per month + 0.05 USD per 10,000 API calls</td><td>Standard tier free; advanced 0.05 USD per parameter per month; higher throughput 0.05 USD per 10,000 calls</td></tr>
    <tr><td>Good default</td><td>Database credentials (rotation pays for itself)</td><td>Hostnames, feature flags, JWT signing secret if you rotate it by redeploying</td></tr>
  </tbody>
</table>
<p>A common, cheap layout for LabFlow: one secret <code>labflow/prod/db</code> (JSON: username, password, host, port, dbname) in Secrets Manager; everything else under <code>/labflow/prod/…</code> in Parameter Store. Name by environment first (<code>prod</code>, <code>staging</code>) so one IAM policy line can grant “everything for prod” and nothing else.</p>

<h3>See it running (2): Secrets Manager on LocalStack</h3>
${OUT_63_BI_MAT_API_A}
<ul>
  <li>One secret holds the whole connection as JSON — the app reads one value and parses it.</li>
  <li><code>put-secret-value</code> creates a new version and moves the <code>AWSCURRENT</code> label to it; the old version becomes <code>AWSPREVIOUS</code>. Readers that ask for “current” switch instantly; a rollback is “move the label back”.</li>
</ul>

<h3>See it running (3): Parameter Store</h3>
${OUT_63_BI_MAT_API_B}
<ul>
  <li>Without <code>--with-decryption</code> a <code>SecureString</code> is not readable. <strong>LocalStack differs:</strong> it shows <code>kms:alias/aws/ssm:</code> followed by the plain value; real AWS returns a base64 ciphertext. LocalStack also prints Tier <code>None</code> where AWS prints <code>Standard</code>.</li>
  <li><code>get-parameters-by-path --recursive</code> loads a whole environment in one call — that is how many apps read their configuration at start-up.</li>
  <li>Deleting a secret starts a <strong>recovery window</strong> (7–30 days, default 30). During it the secret cannot be read — the app breaks loudly — but <code>restore-secret</code> brings it back. <code>--force-delete-without-recovery</code> skips the window; keep that for labs.</li>
</ul>

<h3>See it running (4): read with a cache, rotate for real</h3>
<p>The app below reads the secret once and keeps it for five minutes (calling Secrets Manager on every request costs money and adds latency). If PostgreSQL answers “wrong password” (<code>28P01</code>), it re-reads the secret <em>once</em> and retries. In the middle, a rotation function — the job of the rotation Lambda on AWS — changes the password on the database and writes a new secret version.</p>
${MA_XOAY}
${OUT_63_XOAY_THAT}
<ul>
  <li>Calls 1–2 hit the cache: one API call for two queries.</li>
  <li>After rotation, the cached password is wrong; call 3 fails with <code>28P01</code>, refreshes once (API call 2) and succeeds. Call 4 uses the new cache. No restart, no outage.</li>
  <li>A real rotation Lambda runs four steps — <code>createSecret</code> (new value as <code>AWSPENDING</code>), <code>setSecret</code> (change it in the database), <code>testSecret</code> (log in with it), <code>finishSecret</code> (move <code>AWSCURRENT</code>). For RDS master passwords managed by RDS (lesson 6.1) AWS does all of this for you, every 7 days by default.</li>
  <li>For zero failed logins at all, use the <strong>alternating users</strong> strategy: two database users, rotation changes the one not in use and then flips the secret.</li>
</ul>

<h3>Reading secrets from ECS and Lambda</h3>
<p>On ECS (Chapter 7) you do not write code for it: the task definition maps a secret, or one JSON key of it, to an environment variable, and the <strong>task execution role</strong> must be allowed to read it.</p>
${json(`
"secrets": [
  { "name": "DB_PASSWORD",
    "valueFrom": "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:labflow/prod/db-AbCdEf:password::" },
  { "name": "JWT_SECRET",
    "valueFrom": "arn:aws:ssm:ap-southeast-1:123456789012:parameter/labflow/prod/jwt-secret" }
]`)}
<p>Catch: values are injected when the task <em>starts</em>. After a rotation, running tasks keep the old value until they are replaced — so either restart the service after rotation or read the secret in code with a cache, as above. Lambda functions usually read in code (outside the handler, cached) or through the AWS Parameters and Secrets Lambda Extension.</p>
<p>The app's role should read <em>only</em> its own secrets:</p>
${json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:labflow/prod/db-*" },
    { "Effect": "Allow", "Action": ["ssm:GetParameter", "ssm:GetParametersByPath"],
      "Resource": "arn:aws:ssm:ap-southeast-1:123456789012:parameter/labflow/prod/*" }
  ]
}`)}
<p>The <code>-*</code> after the secret name matters: Secrets Manager adds six random characters to every ARN. If you encrypt with your own KMS key, the role also needs <code>kms:Decrypt</code> on that key.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>“Secrets Manager or Parameter Store?”</strong> — Secrets Manager for credentials that should rotate (built-in rotation, 0.40 USD/secret/month); Parameter Store for configuration and secrets you rotate by redeploying (standard tier free).</li>
  <li><strong>“How do you rotate a DB password without downtime?”</strong> — Versioned secret with staging labels; app caches but refreshes on auth failure; or alternating users; RDS managed rotation for the master user.</li>
  <li><strong>“Why not put the password in the Dockerfile and keep the image private?”</strong> — Private is not secret: registry tokens leak, images get copied, layers keep deleted files. Codecov 2021 started exactly there.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<p>Change <code>63-xoay.mjs</code>: cache for 3 seconds instead of 5 minutes, call <code>truyVan</code> five times with a 1-second pause, and print the API call count each time.</p>
<p><strong>Pass when</strong>: the count increases only after each 3-second expiry (for example 1, 1, 1, 2, 2), and you can explain how cache length trades cost against how fast a rotation is picked up.</p>
${giai('Hint', js(`
const TTL_MS = 3_000;
if (cache && !lamMoi && Date.now() - cache.luc < TTL_MS) return cache.v;
// …
for (let i = 1; i <= 5; i++) {
  console.log(i, await truyVan('select 1 as ok'), soLanGoi);
  await new Promise((r) => setTimeout(r, 1000));
}`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Secrets Manager</span><span class="v">Encrypted secret store with versions, staging labels and rotation.</span></div>
  <div class="kv"><span class="k">Parameter Store</span><span class="v">SSM's hierarchical key-value store for configuration and SecureString.</span></div>
  <div class="kv"><span class="k">SecureString</span><span class="v">Parameter encrypted with KMS; read with --with-decryption.</span></div>
  <div class="kv"><span class="k">Staging label</span><span class="v">AWSCURRENT / AWSPREVIOUS / AWSPENDING point to secret versions.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Scheduled password change: create, set, test, finish.</span></div>
  <div class="kv"><span class="k">Recovery window</span><span class="v">7–30 days during which a deleted secret can be restored.</span></div>
  <div class="kv"><span class="k">Task execution role</span><span class="v">Role ECS uses to pull images and fetch secrets for a task.</span></div>
  <div class="kv"><span class="k">BuildKit secret mount</span><span class="v">Build-time secret available to one RUN step, never stored in a layer.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Secrets never go into code, images, git or CI logs; deleted files survive in image layers.</li>
  <li>Secrets Manager for credentials with rotation; Parameter Store for config and simple secrets.</li>
  <li>Versions + labels make rotation and rollback a label move.</li>
  <li>Apps cache secrets and refresh once on authentication failure.</li>
  <li>Least privilege: each app reads only its own path; watch the random ARN suffix.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html', '🔄', 'AWS docs — Rotate Secrets Manager secrets', 'Managed rotation, rotation Lambda steps, single vs alternating users.')}
${tl('https://about.codecov.io/security-update/', '🧪', 'Codecov — Security update (2021)', 'How one credential extracted from a Docker image became a supply-chain attack.')}

<h3>Sources</h3>
<ul>
  <li>What is Secrets Manager: <a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" target="_blank" rel="noopener">docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html</a></li>
  <li>Rotation: <a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html</a></li>
  <li>Parameter Store: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html</a></li>
  <li>Standard vs advanced parameters: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html</a></li>
  <li>ECS secrets: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/secrets-manager/pricing/" target="_blank" rel="noopener">aws.amazon.com/secrets-manager/pricing/</a> (Price List API, Singapore, 19–20/11/2026)</li>
  <li>Codecov security update: <a href="https://about.codecov.io/security-update/" target="_blank" rel="noopener">about.codecov.io/security-update/</a></li>
</ul>
</div>
`;
const L63_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 3</span>
<h2>6.3 — Secrets Manager và Parameter Store: mật khẩu nằm trong két, không nằm trong ảnh Docker</h2>
<p class="lead">Mật khẩu cơ sở dữ liệu phải nằm ở đâu đó để app đọc được. Những chỗ quen tay — tệp <code>.env</code> lỡ commit “một lần thôi”, dòng <code>ENV</code> trong Dockerfile, giá trị lỡ in ra log CI — lại chính là nơi kẻ tấn công tìm đầu tiên. AWS cho bạn hai cái két: <strong>Secrets Manager</strong> (sinh ra cho bí mật, có xoay mật khẩu) và <strong>SSM Parameter Store</strong> (cấu hình, có kiểu mã hoá <code>SecureString</code>). Bài này trước hết chứng minh trên một ảnh thật vì sao bí mật nướng vào Docker là công khai với bất kỳ ai kéo được ảnh; sau đó cất bí mật của LabFlow đúng chỗ và xoay một mật khẩu PostgreSQL thật trong khi app vẫn chạy.</p>

<h3>Hình dung: két ngân hàng có sổ ghi người mở</h3>
<p>Mật khẩu ghi trên tờ giấy dán dưới bàn phím vẫn dùng được — tới khi người khác ngồi vào bàn. Két ngân hàng khác ở ba điểm: chỉ người có tên mới được mở (IAM), mỗi lần mở đều ghi vào sổ (CloudTrail), và mã két đổi được theo lịch mà không phải báo từng khách (xoay mật khẩu). Đó là toàn bộ ý tưởng của một dịch vụ giữ bí mật.</p>

<h3>Xem chạy (1): mật khẩu nướng vào ảnh</h3>
${OUT_63_ANH_LO_THAT}
<ol>
  <li><code>ENV DB_PASSWORD=…</code> được lưu trong <strong>cấu hình</strong> của ảnh: <code>docker inspect</code> in ra nó, <code>docker history</code> in ra dòng đã đặt nó. Ai có quyền kéo ảnh — người làm thuê, một token registry bị lộ, một kho lỡ để công khai — đọc được chỉ bằng một lệnh.</li>
  <li>Tệp <code>.env</code> đã bị xoá ở lớp sau, và trong container đang chạy nó mất thật. Nhưng ảnh là một chồng lớp; lớp <code>COPY</code> vẫn chứa tệp đó. Bung ảnh ra (<code>docker save</code> + <code>tar</code>) là in được bí mật JWT.</li>
  <li>Cách đúng: bí mật <strong>lúc chạy</strong> được bơm vào khi container khởi động (mục <code>secrets</code> của ECS, secret của Kubernetes, hoặc app tự đọc Secrets Manager); bí mật <strong>lúc build</strong> (token npm riêng) dùng <code>RUN --mount=type=secret</code> của BuildKit, không bao giờ ghi vào lớp nào; và <code>.env*</code> phải có trong cả <code>.gitignore</code> lẫn <code>.dockerignore</code>.</li>
</ol>

<h3>Sự cố thật: Codecov, tháng 1–4/2021</h3>
<p>Thông báo bảo mật của chính Codecov ghi rằng kẻ tấn công vào được “vì một lỗi trong quy trình tạo ảnh Docker của Codecov, cho phép kẻ đó trích ra thông tin xác thực” dùng để sửa script Bash Uploader. Từ 31/01/2021, script bị sửa có thể lặng lẽ gửi những gì pipeline CI của khách đang giữ — biến môi trường, token, khoá — tới máy chủ của bên thứ ba; thông báo công khai của Codecov đề ngày 15/04/2021, tức hai tháng rưỡi sau, và ghi rằng khách nào so mã băm (checksum) của script trước khi chạy thì không bị ảnh hưởng. Một thông tin xác thực trích ra từ một ảnh đã thành cuộc tấn công chuỗi cung ứng vào hàng nghìn pipeline. Cách phòng: không để thông tin xác thực dài hạn trong ảnh, CI dùng vai tạm thời (Chương 1.6, OIDC), và kiểm mã băm của mọi script bạn đổ thẳng vào shell.</p>

<h3>Hai cái két: chọn cái nào?</h3>
<table>
  <thead><tr><th></th><th>Secrets Manager</th><th>Parameter Store</th></tr></thead>
  <tbody>
    <tr><td>Sinh ra cho</td><td>Bí mật: thông tin đăng nhập DB, khoá API, client secret OAuth</td><td>Cấu hình (<code>String</code>, <code>StringList</code>) và bí mật nhỏ (<code>SecureString</code>)</td></tr>
    <tr><td>Xoay mật khẩu</td><td>Có sẵn: xoay do RDS quản lý, hoặc một hàm Lambda xoay</td><td>Không — tự xây</td></tr>
    <tr><td>Phiên bản</td><td>Nhãn <code>AWSCURRENT</code>, <code>AWSPREVIOUS</code>, <code>AWSPENDING</code></td><td>Phiên bản đánh số + nhãn</td></tr>
    <tr><td>Mã hoá</td><td>Luôn luôn, bằng KMS</td><td>Chỉ <code>SecureString</code>, bằng KMS (<code>aws/ssm</code> hoặc khoá của bạn)</td></tr>
    <tr><td>Giá (Singapore, 11/2026)</td><td>0,40 USD mỗi bí mật mỗi tháng + 0,05 USD mỗi 10.000 lần gọi API</td><td>Bậc standard miễn phí; advanced 0,05 USD mỗi tham số mỗi tháng; thông lượng cao 0,05 USD mỗi 10.000 lần gọi</td></tr>
    <tr><td>Mặc định hợp lý</td><td>Thông tin đăng nhập DB (xoay mật khẩu đáng tiền)</td><td>Tên máy, cờ tính năng, khoá ký JWT nếu bạn xoay nó bằng cách deploy lại</td></tr>
  </tbody>
</table>
<p>Một cách bố trí rẻ và phổ biến cho LabFlow: một bí mật <code>labflow/prod/db</code> (JSON: username, password, host, port, dbname) trong Secrets Manager; mọi thứ còn lại nằm dưới <code>/labflow/prod/…</code> trong Parameter Store. Đặt tên theo môi trường trước (<code>prod</code>, <code>staging</code>) để một dòng policy IAM cấp được “mọi thứ của prod” và không gì khác.</p>

<h3>Xem chạy (2): Secrets Manager trên LocalStack</h3>
${OUT_63_BI_MAT_API_A}
<ul>
  <li>Một bí mật giữ cả bộ kết nối dạng JSON — app đọc một giá trị rồi tách ra.</li>
  <li><code>put-secret-value</code> tạo phiên bản mới và chuyển nhãn <code>AWSCURRENT</code> sang nó; bản cũ thành <code>AWSPREVIOUS</code>. Ai đọc bản “current” đổi ngay lập tức; quay lui chỉ là “chuyển nhãn về”.</li>
</ul>

<h3>Xem chạy (3): Parameter Store</h3>
${OUT_63_BI_MAT_API_B}
<ul>
  <li>Thiếu <code>--with-decryption</code> thì <code>SecureString</code> không đọc được. <strong>LocalStack khác AWS:</strong> nó in <code>kms:alias/aws/ssm:</code> rồi tới giá trị gốc; AWS thật trả một chuỗi mã hoá base64. LocalStack còn in Tier <code>None</code> ở chỗ AWS in <code>Standard</code>.</li>
  <li><code>get-parameters-by-path --recursive</code> nạp cả một môi trường trong một lần gọi — nhiều app đọc cấu hình lúc khởi động đúng như vậy.</li>
  <li>Xoá bí mật sẽ bắt đầu một <strong>khoảng ân hạn</strong> (7–30 ngày, mặc định 30). Trong khoảng đó bí mật không đọc được — app hỏng rõ ràng, dễ thấy — nhưng <code>restore-secret</code> lấy lại được. <code>--force-delete-without-recovery</code> bỏ qua khoảng ân hạn; chỉ dùng cho lab.</li>
</ul>

<h3>Xem chạy (4): đọc có cache, xoay mật khẩu thật</h3>
<p>App bên dưới đọc bí mật một lần rồi giữ trong năm phút (gọi Secrets Manager ở mọi yêu cầu vừa tốn tiền vừa chậm thêm). Nếu PostgreSQL trả “sai mật khẩu” (<code>28P01</code>), nó đọc lại bí mật <em>một</em> lần rồi thử lại. Ở giữa, một hàm xoay — việc của Lambda xoay trên AWS — đổi mật khẩu trên cơ sở dữ liệu rồi ghi phiên bản bí mật mới.</p>
${MA_XOAY}
${OUT_63_XOAY_THAT}
<ul>
  <li>Lượt 1–2 dùng cache: một lần gọi API cho hai truy vấn.</li>
  <li>Sau khi xoay, mật khẩu trong cache đã sai; lượt 3 lỗi <code>28P01</code>, đọc lại một lần (lần gọi API thứ 2) rồi thành công. Lượt 4 dùng cache mới. Không khởi động lại, không gián đoạn.</li>
  <li>Một Lambda xoay thật chạy bốn bước — <code>createSecret</code> (giá trị mới mang nhãn <code>AWSPENDING</code>), <code>setSecret</code> (đổi trong cơ sở dữ liệu), <code>testSecret</code> (thử đăng nhập bằng nó), <code>finishSecret</code> (chuyển nhãn <code>AWSCURRENT</code>). Với mật khẩu chủ do RDS quản lý (bài 6.1), AWS làm hết cho bạn, mặc định bảy ngày một lần.</li>
  <li>Muốn không có lần đăng nhập hỏng nào, dùng chiến lược <strong>luân phiên hai người dùng</strong> (alternating users): hai người dùng DB, mỗi lần xoay đổi mật khẩu người đang không dùng rồi mới lật bí mật sang.</li>
</ul>

<h3>Đọc bí mật từ ECS và Lambda</h3>
<p>Trên ECS (Chương 7) bạn không phải viết mã: task definition gắn một bí mật, hoặc một khoá JSON trong bí mật, vào biến môi trường, và <strong>task execution role</strong> phải được phép đọc nó.</p>
${json(`
"secrets": [
  { "name": "DB_PASSWORD",
    "valueFrom": "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:labflow/prod/db-AbCdEf:password::" },
  { "name": "JWT_SECRET",
    "valueFrom": "arn:aws:ssm:ap-southeast-1:123456789012:parameter/labflow/prod/jwt-secret" }
]`)}
<p>Cái bẫy: giá trị được bơm vào lúc task <em>khởi động</em>. Sau khi xoay, các task đang chạy vẫn giữ giá trị cũ tới khi bị thay — nên hoặc khởi động lại service sau khi xoay, hoặc đọc bí mật trong mã có cache như trên. Hàm Lambda thường đọc trong mã (ngoài handler, có cache) hoặc qua AWS Parameters and Secrets Lambda Extension.</p>
<p>Vai của app chỉ nên đọc <em>đúng</em> bí mật của mình:</p>
${json(`
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:ap-southeast-1:123456789012:secret:labflow/prod/db-*" },
    { "Effect": "Allow", "Action": ["ssm:GetParameter", "ssm:GetParametersByPath"],
      "Resource": "arn:aws:ssm:ap-southeast-1:123456789012:parameter/labflow/prod/*" }
  ]
}`)}
<p>Đuôi <code>-*</code> sau tên bí mật là quan trọng: Secrets Manager gắn sáu ký tự ngẫu nhiên vào cuối mọi ARN. Nếu mã hoá bằng khoá KMS của riêng bạn, vai đó còn cần <code>kms:Decrypt</code> trên khoá ấy.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>“Secrets Manager hay Parameter Store?”</strong> — Secrets Manager cho thông tin đăng nhập cần xoay (xoay có sẵn, 0,40 USD/bí mật/tháng); Parameter Store cho cấu hình và bí mật xoay bằng cách deploy lại (bậc standard miễn phí).</li>
  <li><strong>“Xoay mật khẩu DB mà không gián đoạn bằng cách nào?”</strong> — Bí mật có phiên bản và nhãn; app có cache nhưng đọc lại khi đăng nhập hỏng; hoặc luân phiên hai người dùng; dùng xoay do RDS quản lý cho người dùng chủ.</li>
  <li><strong>“Sao không để mật khẩu trong Dockerfile rồi giữ ảnh ở chế độ riêng tư?”</strong> — Riêng tư không có nghĩa là bí mật: token registry bị lộ, ảnh bị chép đi, lớp ảnh giữ cả tệp đã xoá. Codecov 2021 bắt đầu đúng từ đó.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Sửa <code>63-xoay.mjs</code>: cache 3 giây thay vì 5 phút, gọi <code>truyVan</code> năm lần, mỗi lần cách 1 giây, và in số lần gọi API sau mỗi lần.</p>
<p><strong>Đạt khi</strong>: số lần gọi chỉ tăng sau mỗi lần cache 3 giây hết hạn (ví dụ 1, 1, 1, 2, 2), và bạn giải thích được độ dài cache đánh đổi giữa chi phí và tốc độ nhận mật khẩu mới sau khi xoay.</p>
${giai('Gợi ý', js(`
const TTL_MS = 3_000;
if (cache && !lamMoi && Date.now() - cache.luc < TTL_MS) return cache.v;
// …
for (let i = 1; i <= 5; i++) {
  console.log(i, await truyVan('select 1 as ok'), soLanGoi);
  await new Promise((r) => setTimeout(r, 1000));
}`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Secrets Manager</span><span class="v">Kho bí mật mã hoá, có phiên bản, nhãn và xoay mật khẩu.</span></div>
  <div class="kv"><span class="k">Parameter Store</span><span class="v">Kho khoá-giá trị phân cấp của SSM cho cấu hình và SecureString.</span></div>
  <div class="kv"><span class="k">SecureString</span><span class="v">Tham số mã hoá bằng KMS; đọc bằng --with-decryption.</span></div>
  <div class="kv"><span class="k">Nhãn phiên bản</span><span class="v">AWSCURRENT / AWSPREVIOUS / AWSPENDING trỏ tới các phiên bản bí mật.</span></div>
  <div class="kv"><span class="k">Xoay mật khẩu</span><span class="v">Đổi mật khẩu theo lịch: tạo, đặt, thử, chốt.</span></div>
  <div class="kv"><span class="k">Khoảng ân hạn</span><span class="v">7–30 ngày trong đó bí mật đã xoá còn khôi phục được.</span></div>
  <div class="kv"><span class="k">Task execution role</span><span class="v">Vai ECS dùng để kéo ảnh và lấy bí mật cho một task.</span></div>
  <div class="kv"><span class="k">BuildKit secret mount</span><span class="v">Bí mật lúc build chỉ có trong một bước RUN, không lưu vào lớp nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bí mật không bao giờ vào mã, ảnh, git hay log CI; tệp đã xoá vẫn sống trong các lớp ảnh.</li>
  <li>Secrets Manager cho thông tin đăng nhập cần xoay; Parameter Store cho cấu hình và bí mật đơn giản.</li>
  <li>Phiên bản + nhãn biến việc xoay và quay lui thành một lần chuyển nhãn.</li>
  <li>App cache bí mật và đọc lại một lần khi đăng nhập hỏng.</li>
  <li>Quyền tối thiểu: mỗi app chỉ đọc đường của mình; nhớ đuôi ngẫu nhiên của ARN.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html', '🔄', 'Tài liệu AWS — Xoay bí mật Secrets Manager', 'Xoay do dịch vụ quản lý, các bước của Lambda xoay, một người dùng hay luân phiên.')}
${tl('https://about.codecov.io/security-update/', '🧪', 'Codecov — Thông báo bảo mật (2021)', 'Một thông tin xác thực trích từ ảnh Docker thành tấn công chuỗi cung ứng.')}

<h3>Nguồn</h3>
<ul>
  <li>Secrets Manager là gì: <a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" target="_blank" rel="noopener">docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html</a></li>
  <li>Xoay bí mật: <a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html</a></li>
  <li>Parameter Store: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html</a></li>
  <li>Tham số standard và advanced: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html</a></li>
  <li>Bí mật trong ECS: <a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html</a></li>
  <li>Giá: <a href="https://aws.amazon.com/secrets-manager/pricing/" target="_blank" rel="noopener">aws.amazon.com/secrets-manager/pricing/</a> (Price List API, Singapore, 19–20/11/2026)</li>
  <li>Thông báo bảo mật của Codecov: <a href="https://about.codecov.io/security-update/" target="_blank" rel="noopener">about.codecov.io/security-update/</a></li>
</ul>
</div>
`;

/* ═════ 6.4 — DynamoDB ═════ */
const L64_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 4</span>
<h2>6.4 — DynamoDB: key-value at any scale, if you design for the questions first</h2>
<p class="lead">PostgreSQL lets you design tables first and invent queries later — joins and indexes will cope. <strong>DynamoDB</strong> turns that around. It is a serverless key-value and document database that answers in single-digit milliseconds whether the table holds a thousand items or a billion, with no server, no connection pool and no patching. The price: it only answers questions you planned for in the <strong>key</strong>. This lesson designs LabFlow's booking table from its access patterns, runs every query type on the DynamoDB engine inside LocalStack, and then lets 20 clients race for the same lab slot to show how one conditional write prevents double booking.</p>

<h3>The picture: a filing cabinet</h3>
<p>A table is a cabinet. The <strong>partition key</strong> picks the drawer (“room A101”); inside the drawer, folders are kept in order by the <strong>sort key</strong> (“slot 2026-11-24 08:00”). “Show A101's bookings for November” = open one drawer and read a range of folders: fast and cheap. “Show every booking for subject SWP391” = open <em>every</em> drawer and read every folder: that is a <strong>scan</strong>, slow and billed for everything it reads. If that question matters, you add a second, differently sorted copy of the cabinet: a <strong>global secondary index</strong>.</p>

<h3>Core pieces</h3>
<ul>
  <li><strong>Item</strong> — one record (max 400 KB), a set of attributes. Items in the same table may have different attributes; only the key attributes are declared.</li>
  <li><strong>Primary key</strong> — partition key alone, or partition key + sort key. DynamoDB hashes the partition key to choose a physical partition, so a key with many distinct values spreads load; one very busy key (“every booking today”) becomes a <strong>hot partition</strong>.</li>
  <li><strong>Query</strong> — exactly one partition key value, optional condition on the sort key (<code>=</code>, <code>&lt;</code>, <code>between</code>, <code>begins_with</code>). <strong>Scan</strong> — read the whole table, then filter.</li>
  <li><strong>GSI</strong> — another partition/sort key over the same items, kept up to date asynchronously; every write to the table also writes the index (and costs for it).</li>
</ul>

<h3>Design from access patterns</h3>
<table>
  <thead><tr><th>LabFlow needs to…</th><th>Key design</th><th>Operation</th></tr></thead>
  <tbody>
    <tr><td>Show a room's bookings for a day/month</td><td><code>pk = LAB#A101</code>, <code>sk = SLOT#2026-11-24T08</code></td><td>Query <code>pk = …</code> and <code>begins_with(sk, 'SLOT#2026-11')</code></td></tr>
    <tr><td>Show one student's bookings</td><td>GSI <code>theo-nguoi</code>: <code>nguoi = USER#an</code>, sort by <code>sk</code></td><td>Query on the index</td></tr>
    <tr><td>Never book the same slot twice</td><td>The slot <em>is</em> the key</td><td>Put with <code>attribute_not_exists(pk)</code></td></tr>
  </tbody>
</table>
<p>Prefixes like <code>LAB#</code> and <code>USER#</code> are a convention from single-table design: several entity types can share one table without key collisions.</p>

<h3>See it running (1): create the table, book with a condition</h3>
${OUT_64_DDB_API_A}
<ul>
  <li>Only <code>pk</code>, <code>sk</code> and the index key <code>nguoi</code> are declared. <code>monHoc</code> appears on one item and nowhere in the schema.</li>
  <li><code>PAY_PER_REQUEST</code> = on-demand capacity: no capacity planning, billed per request.</li>
  <li>The first booking costs <strong>2.0</strong> write units: 1 for the table + 1 for the GSI copy. Every index you add multiplies write cost.</li>
  <li>The second student gets <code>ConditionalCheckFailedException</code>: the check and the write happen atomically on the server, so there is no gap for a race.</li>
</ul>

<h3>See it running (2): queries that use the key</h3>
${OUT_64_DDB_API_B}
<p><code>Count 3 / ScannedCount 3</code>: DynamoDB read exactly the three items it returned. The GSI answers the second pattern (“an's bookings” across rooms) without touching other drawers.</p>

<h3>See it running (3): questions the key cannot answer</h3>
${OUT_64_DDB_API_C}
<ul>
  <li>Query on a non-key attribute is refused: <code>Query condition missed key schema element</code>. There is no planner that silently does a full scan for you, as PostgreSQL would.</li>
  <li>The scan returned <code>Count 1</code> but read <code>ScannedCount 6</code>; you pay for the 6. On a table with ten million items, a scan per request is the classic surprise bill.</li>
  <li>An item over 400 KB is rejected. Store big blobs (attachments, images) in S3 and keep the S3 key in the item.</li>
  <li>TTL deletes expired items in the background, for free (typically within a few days of expiry — do not rely on exact timing; filter expired items in reads).</li>
</ul>

<h3>See it running (4): 20 students, one slot, same instant</h3>
${MA_DUA}
${OUT_64_DUA_THAT}
<p>Exactly one write wins; nineteen get <code>ConditionalCheckFailedException</code> and the app shows “slot already taken”. In PostgreSQL the same guarantee comes from a <code>UNIQUE (phong, khung_gio)</code> constraint; without either, a “check then insert” in application code double-books under load.</p>

<h3>Capacity and price (Singapore, 11/2026)</h3>
<ul>
  <li>1 <strong>write request unit</strong> = one write of up to 1 KB; 1 <strong>read request unit</strong> = one strongly consistent read up to 4 KB (eventually consistent reads cost half — the 0.5 you saw).</li>
  <li>On-demand: 0.71 USD per million writes, 0.1425 USD per million reads. Storage: first 25 GB-month free, then 0.285 USD/GB-month. Point-in-time recovery: 0.228 USD/GB-month.</li>
  <li>Provisioned capacity (with auto scaling) is cheaper for steady, predictable traffic; on-demand fits spiky or new workloads.</li>
</ul>

<h3>DynamoDB or PostgreSQL?</h3>
<table>
  <thead><tr><th>Choose DynamoDB when…</th><th>Stay with PostgreSQL (RDS) when…</th></tr></thead>
  <tbody>
    <tr><td>Access patterns are known and key-based (sessions, carts, device state, audit logs, idempotency keys)</td><td>Questions change often; you need ad-hoc reports and joins</td></tr>
    <tr><td>Traffic is huge or extremely spiky; you want no servers or connections to manage</td><td>Data is relational with many constraints and transactions across tables</td></tr>
    <tr><td>Serverless backends (Lambda) where connection pools hurt</td><td>The team knows SQL and the data fits comfortably on one instance</td></tr>
  </tbody>
</table>
<p>For LabFlow the honest answer is: PostgreSQL for the core booking domain (reports, joins with users and courses), DynamoDB for a high-volume, key-based side table such as the audit log — exactly what the lab in 6.6 builds.</p>

<h3>Real incident and a security switch</h3>
<p><strong>20 October 2025, us-east-1.</strong> AWS's own summary: a latent race condition in DynamoDB's DNS management automation left an <strong>empty DNS record</strong> for the regional endpoint <code>dynamodb.us-east-1.amazonaws.com</code>, and the automation failed to repair it. The database itself was healthy, but nobody could find it — and many other AWS services that depend on DynamoDB failed with it for hours. Lessons: design for a Region being unavailable when your business needs it (Global Tables replicate across Regions), and never treat “managed” as “cannot fail”.</p>
<p><strong>Multi-tenant safety:</strong> IAM can restrict which partition keys a caller may touch. With the condition key <code>dynamodb:LeadingKeys</code>, a user's temporary credentials can only read items whose partition key equals their own ID — the database enforces tenant isolation even if application code has a bug.</p>
${json(`
{ "Effect": "Allow",
  "Action": ["dynamodb:GetItem", "dynamodb:Query"],
  "Resource": "arn:aws:dynamodb:ap-southeast-1:123456789012:table/labflow-thongbao",
  "Condition": { "ForAllValues:StringEquals": { "dynamodb:LeadingKeys": ["\${cognito-identity.amazonaws.com:sub}"] } } }`)}

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>“How do you design a DynamoDB table?”</strong> — List access patterns first, choose partition/sort keys so each pattern is a Query, add GSIs only for remaining patterns, avoid hot keys, and never rely on Scan in a request path.</li>
  <li><strong>“How do you stop two users booking the same slot?”</strong> — Make the slot the key and write with <code>attribute_not_exists</code> (or a transaction for multi-item rules). In SQL: a unique constraint.</li>
  <li><strong>“Query vs Scan?”</strong> — Query reads one partition by key; Scan reads everything and filters after — you pay for what is scanned, not what is returned.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Add a third access pattern: “all bookings on 2026-11-24 across all rooms”. Design a second GSI (hint: a key that holds the date) and query it. Then explain why a partition key equal to the date can become a hot partition on exam week.</p>
<p><strong>Pass when</strong>: your query returns the 3 bookings of 24/11 with <code>ScannedCount</code> equal to <code>Count</code>, and you can name one way to spread a hot date key (for example adding a shard suffix <code>NGAY#2026-11-24#3</code>).</p>
${giai('Hint: the index', bash(`
aws dynamodb update-table --table-name labflow-datlich \\
  --attribute-definitions AttributeName=ngay,AttributeType=S \\
  --global-secondary-index-updates '[{"Create":{"IndexName":"theo-ngay","KeySchema":[{"AttributeName":"ngay","KeyType":"HASH"},{"AttributeName":"pk","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}}]'
# then write ngay = "NGAY#2026-11-24" on each booking and query the index`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Partition key</span><span class="v">Hashed to pick the physical partition; every Query needs one exact value.</span></div>
  <div class="kv"><span class="k">Sort key</span><span class="v">Orders items inside a partition; supports ranges and begins_with.</span></div>
  <div class="kv"><span class="k">GSI</span><span class="v">Index with its own keys; async; adds write cost.</span></div>
  <div class="kv"><span class="k">Condition expression</span><span class="v">Server-side check evaluated atomically with the write.</span></div>
  <div class="kv"><span class="k">On-demand</span><span class="v">PAY_PER_REQUEST billing, no capacity planning.</span></div>
  <div class="kv"><span class="k">RRU / WRU</span><span class="v">Read (4 KB) / write (1 KB) request units.</span></div>
  <div class="kv"><span class="k">Hot partition</span><span class="v">One key receiving a disproportionate share of traffic.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Attribute with an expiry time; items deleted in the background.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>DynamoDB answers planned questions fast at any scale; it does not invent query plans.</li>
  <li>Design keys from access patterns; Query by key, add GSIs sparingly, avoid Scan.</li>
  <li>Conditional writes make “book once” atomic — 1 winner out of 20 concurrent requests.</li>
  <li>Items ≤ 400 KB; big data goes to S3. TTL cleans up expired items for free.</li>
  <li>Use it next to PostgreSQL for key-based, high-volume data, not instead of it by default.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html', '🗄️', 'AWS docs — NoSQL design for DynamoDB', 'Access patterns first, keys, single-table design.')}
${tl('https://aws.amazon.com/message/101925/', '🌩️', 'AWS — Summary of the us-east-1 disruption (October 2025)', 'How an empty DNS record took DynamoDB, and much of a Region, offline.')}

<h3>Sources</h3>
<ul>
  <li>Core components: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html</a></li>
  <li>NoSQL design: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html</a></li>
  <li>Condition expressions: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html</a></li>
  <li>Global secondary indexes: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html</a></li>
  <li>Capacity modes: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html</a></li>
  <li>Read/write units: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html</a></li>
  <li>TTL: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html</a></li>
  <li>Quotas (400 KB item): <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html</a></li>
  <li>Fine-grained access (LeadingKeys): <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html</a></li>
  <li>On-demand pricing: <a href="https://aws.amazon.com/dynamodb/pricing/on-demand/" target="_blank" rel="noopener">aws.amazon.com/dynamodb/pricing/on-demand/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>us-east-1 event summary: <a href="https://aws.amazon.com/message/101925/" target="_blank" rel="noopener">aws.amazon.com/message/101925/</a></li>
</ul>
</div>
`;
const L64_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 4</span>
<h2>6.4 — DynamoDB: key-value ở mọi quy mô, nếu bạn thiết kế theo câu hỏi trước</h2>
<p class="lead">PostgreSQL cho bạn thiết kế bảng trước rồi nghĩ ra truy vấn sau — join và index sẽ xoay xở. <strong>DynamoDB</strong> làm ngược lại. Nó là cơ sở dữ liệu key-value và tài liệu kiểu serverless, trả lời trong vài mili giây dù bảng có một nghìn hay một tỷ item, không máy chủ, không connection pool, không phải vá. Cái giá: nó chỉ trả lời những câu hỏi bạn đã tính trước trong <strong>khoá</strong>. Bài này thiết kế bảng đặt lịch của LabFlow từ các mẫu truy cập, chạy mọi kiểu truy vấn trên engine DynamoDB bên trong LocalStack, rồi cho 20 người cùng giành một khung giờ phòng lab để thấy một lệnh ghi có điều kiện chặn đặt trùng ra sao.</p>

<h3>Hình dung: tủ hồ sơ</h3>
<p>Một bảng là một cái tủ. <strong>Partition key</strong> chọn ngăn kéo (“phòng A101”); trong ngăn, các bìa hồ sơ xếp theo thứ tự của <strong>sort key</strong> (“khung 2026-11-24 08:00”). “Cho xem lịch A101 tháng 11” = mở một ngăn và đọc một đoạn bìa liền nhau: nhanh và rẻ. “Cho xem mọi lượt đặt của môn SWP391” = mở <em>mọi</em> ngăn và đọc từng bìa: đó là <strong>scan</strong>, chậm và tính tiền cho mọi thứ nó đọc. Nếu câu hỏi đó quan trọng, bạn thêm một bản sao thứ hai của tủ, xếp theo cách khác: một <strong>global secondary index</strong> (GSI).</p>

<h3>Các mảnh cốt lõi</h3>
<ul>
  <li><strong>Item</strong> — một bản ghi (tối đa 400 KB), là tập các thuộc tính. Các item trong cùng bảng có thể có thuộc tính khác nhau; chỉ thuộc tính làm khoá mới phải khai báo.</li>
  <li><strong>Khoá chính</strong> — chỉ partition key, hoặc partition key + sort key. DynamoDB băm partition key để chọn phân vùng vật lý, nên khoá có nhiều giá trị khác nhau thì tải trải đều; một khoá quá bận (“mọi lượt đặt hôm nay”) thành <strong>phân vùng nóng</strong> (hot partition).</li>
  <li><strong>Query</strong> — đúng một giá trị partition key, kèm điều kiện tuỳ chọn trên sort key (<code>=</code>, <code>&lt;</code>, <code>between</code>, <code>begins_with</code>). <strong>Scan</strong> — đọc cả bảng rồi mới lọc.</li>
  <li><strong>GSI</strong> — một cặp partition/sort key khác trên cùng các item, cập nhật bất đồng bộ; mỗi lần ghi vào bảng cũng ghi vào index (và tính tiền cho nó).</li>
</ul>

<h3>Thiết kế từ mẫu truy cập</h3>
<table>
  <thead><tr><th>LabFlow cần…</th><th>Thiết kế khoá</th><th>Thao tác</th></tr></thead>
  <tbody>
    <tr><td>Xem lịch một phòng theo ngày/tháng</td><td><code>pk = LAB#A101</code>, <code>sk = SLOT#2026-11-24T08</code></td><td>Query <code>pk = …</code> và <code>begins_with(sk, 'SLOT#2026-11')</code></td></tr>
    <tr><td>Xem lịch của một sinh viên</td><td>GSI <code>theo-nguoi</code>: <code>nguoi = USER#an</code>, xếp theo <code>sk</code></td><td>Query trên index</td></tr>
    <tr><td>Không bao giờ đặt trùng một khung</td><td>Khung giờ <em>chính là</em> khoá</td><td>Put kèm <code>attribute_not_exists(pk)</code></td></tr>
  </tbody>
</table>
<p>Tiền tố như <code>LAB#</code> và <code>USER#</code> là quy ước của thiết kế một bảng (single-table design): nhiều loại thực thể dùng chung một bảng mà khoá không đụng nhau.</p>

<h3>Xem chạy (1): tạo bảng, đặt lịch có điều kiện</h3>
${OUT_64_DDB_API_A}
<ul>
  <li>Chỉ khai báo <code>pk</code>, <code>sk</code> và khoá index <code>nguoi</code>. <code>monHoc</code> có trên một item mà không có trong schema nào.</li>
  <li><code>PAY_PER_REQUEST</code> = dung lượng on-demand: không phải tính trước công suất, trả tiền theo yêu cầu.</li>
  <li>Lượt đặt đầu tốn <strong>2.0</strong> đơn vị ghi: 1 cho bảng + 1 cho bản sao trong GSI. Thêm index nào là nhân thêm chi phí ghi.</li>
  <li>Sinh viên thứ hai nhận <code>ConditionalCheckFailedException</code>: phép kiểm và lệnh ghi xảy ra nguyên tử trên máy chủ, nên không có khe hở cho chạy đua.</li>
</ul>

<h3>Xem chạy (2): truy vấn dùng khoá</h3>
${OUT_64_DDB_API_B}
<p><code>Count 3 / ScannedCount 3</code>: DynamoDB đọc đúng ba item nó trả về. GSI trả lời mẫu thứ hai (“lịch của an” qua nhiều phòng) mà không đụng tới ngăn kéo khác.</p>

<h3>Xem chạy (3): câu hỏi mà khoá không trả lời được</h3>
${OUT_64_DDB_API_C}
<ul>
  <li>Query theo thuộc tính không phải khoá bị từ chối: <code>Query condition missed key schema element</code>. Không có bộ lập kế hoạch nào lặng lẽ quét toàn bảng giúp bạn như PostgreSQL.</li>
  <li>Scan trả <code>Count 1</code> nhưng đã đọc <code>ScannedCount 6</code>; bạn trả tiền cho 6. Với bảng mười triệu item, mỗi yêu cầu một lần scan là kiểu hoá đơn bất ngờ kinh điển.</li>
  <li>Item quá 400 KB bị từ chối. Dữ liệu lớn (tệp đính kèm, ảnh) để ở S3, item chỉ giữ khoá S3.</li>
  <li>TTL xoá item hết hạn ở chế độ nền, miễn phí (thường trong vòng vài ngày sau mốc hết hạn — đừng dựa vào thời điểm chính xác; khi đọc vẫn lọc item đã hết hạn).</li>
</ul>

<h3>Xem chạy (4): 20 sinh viên, một khung giờ, cùng một khoảnh khắc</h3>
${MA_DUA}
${OUT_64_DUA_THAT}
<p>Đúng một lệnh ghi thắng; mười chín lệnh nhận <code>ConditionalCheckFailedException</code> và app báo “khung giờ đã có người đặt”. Trong PostgreSQL, bảo đảm tương tự đến từ ràng buộc <code>UNIQUE (phong, khung_gio)</code>; thiếu cả hai, kiểu “kiểm tra rồi mới chèn” trong mã ứng dụng sẽ đặt trùng khi tải cao.</p>

<h3>Công suất và giá (Singapore, 11/2026)</h3>
<ul>
  <li>1 <strong>đơn vị ghi</strong> (WRU) = một lần ghi tới 1 KB; 1 <strong>đơn vị đọc</strong> (RRU) = một lần đọc nhất quán mạnh tới 4 KB (đọc nhất quán cuối cùng tốn một nửa — con số 0.5 bạn vừa thấy).</li>
  <li>On-demand: 0,71 USD mỗi triệu lần ghi, 0,1425 USD mỗi triệu lần đọc. Lưu trữ: 25 GB-tháng đầu miễn phí, sau đó 0,285 USD/GB-tháng. Khôi phục theo thời điểm: 0,228 USD/GB-tháng.</li>
  <li>Dung lượng provisioned (kèm auto scaling) rẻ hơn cho lưu lượng đều, dự đoán được; on-demand hợp với lưu lượng gai góc hoặc hệ mới.</li>
</ul>

<h3>DynamoDB hay PostgreSQL?</h3>
<table>
  <thead><tr><th>Chọn DynamoDB khi…</th><th>Ở lại PostgreSQL (RDS) khi…</th></tr></thead>
  <tbody>
    <tr><td>Mẫu truy cập đã biết và dựa trên khoá (phiên, giỏ hàng, trạng thái thiết bị, nhật ký kiểm toán, khoá idempotency)</td><td>Câu hỏi thay đổi thường xuyên; cần báo cáo tuỳ biến và join</td></tr>
    <tr><td>Lưu lượng rất lớn hoặc tăng vọt thất thường; không muốn quản máy chủ hay kết nối</td><td>Dữ liệu có quan hệ, nhiều ràng buộc và giao dịch qua nhiều bảng</td></tr>
    <tr><td>Backend serverless (Lambda), nơi connection pool gây khó</td><td>Nhóm thạo SQL và dữ liệu vừa vặn trên một instance</td></tr>
  </tbody>
</table>
<p>Với LabFlow, câu trả lời trung thực là: PostgreSQL cho miền đặt lịch cốt lõi (báo cáo, join với người dùng và môn học), DynamoDB cho một bảng phụ lưu lượng lớn, truy cập theo khoá như nhật ký kiểm toán — đúng thứ lab 6.6 dựng.</p>

<h3>Sự cố thật và một công tắc bảo mật</h3>
<p><strong>20/10/2025, us-east-1.</strong> Bản tóm tắt của chính AWS: một điều kiện chạy đua tiềm ẩn trong hệ tự động quản lý DNS của DynamoDB để lại một <strong>bản ghi DNS rỗng</strong> cho endpoint vùng <code>dynamodb.us-east-1.amazonaws.com</code>, và hệ tự động không sửa lại được. Bản thân cơ sở dữ liệu vẫn khoẻ, nhưng không ai tìm thấy nó — và nhiều dịch vụ AWS khác phụ thuộc DynamoDB cũng hỏng theo suốt nhiều giờ. Bài học: thiết kế cho trường hợp cả Region không dùng được khi nghiệp vụ cần (Global Tables sao chép qua nhiều Region), và đừng bao giờ coi “managed” là “không thể hỏng”.</p>
<p><strong>An toàn nhiều khách thuê (multi-tenant):</strong> IAM giới hạn được partition key nào một người gọi được chạm tới. Với khoá điều kiện <code>dynamodb:LeadingKeys</code>, thông tin xác thực tạm thời của một người dùng chỉ đọc được item có partition key bằng ID của chính họ — cơ sở dữ liệu tự cách ly khách thuê kể cả khi mã ứng dụng có lỗi.</p>
${json(`
{ "Effect": "Allow",
  "Action": ["dynamodb:GetItem", "dynamodb:Query"],
  "Resource": "arn:aws:dynamodb:ap-southeast-1:123456789012:table/labflow-thongbao",
  "Condition": { "ForAllValues:StringEquals": { "dynamodb:LeadingKeys": ["\${cognito-identity.amazonaws.com:sub}"] } } }`)}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>“Bạn thiết kế bảng DynamoDB thế nào?”</strong> — Liệt kê mẫu truy cập trước, chọn partition/sort key để mỗi mẫu là một Query, chỉ thêm GSI cho mẫu còn lại, tránh khoá nóng, và không bao giờ dựa vào Scan trên đường xử lý yêu cầu.</li>
  <li><strong>“Làm sao chặn hai người đặt cùng một khung giờ?”</strong> — Lấy khung giờ làm khoá và ghi kèm <code>attribute_not_exists</code> (hoặc transaction nếu luật trải nhiều item). Trong SQL: ràng buộc unique.</li>
  <li><strong>“Query khác Scan thế nào?”</strong> — Query đọc một phân vùng theo khoá; Scan đọc tất cả rồi mới lọc — bạn trả tiền cho phần đã quét, không phải phần trả về.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Thêm mẫu truy cập thứ ba: “mọi lượt đặt ngày 2026-11-24 ở mọi phòng”. Thiết kế GSI thứ hai (gợi ý: một khoá chứa ngày) rồi query nó. Sau đó giải thích vì sao partition key bằng ngày có thể thành phân vùng nóng vào tuần thi.</p>
<p><strong>Đạt khi</strong>: truy vấn trả về 3 lượt đặt của ngày 24/11 với <code>ScannedCount</code> bằng <code>Count</code>, và bạn nêu được một cách rải khoá ngày nóng (ví dụ thêm hậu tố phân mảnh <code>NGAY#2026-11-24#3</code>).</p>
${giai('Gợi ý: index', bash(`
aws dynamodb update-table --table-name labflow-datlich \\
  --attribute-definitions AttributeName=ngay,AttributeType=S \\
  --global-secondary-index-updates '[{"Create":{"IndexName":"theo-ngay","KeySchema":[{"AttributeName":"ngay","KeyType":"HASH"},{"AttributeName":"pk","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}}]'
# rồi ghi ngay = "NGAY#2026-11-24" vào từng lượt đặt và query index đó`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Partition key</span><span class="v">Được băm để chọn phân vùng vật lý; mọi Query cần đúng một giá trị.</span></div>
  <div class="kv"><span class="k">Sort key</span><span class="v">Xếp thứ tự item trong một phân vùng; hỗ trợ khoảng và begins_with.</span></div>
  <div class="kv"><span class="k">GSI</span><span class="v">Index có khoá riêng; bất đồng bộ; tốn thêm chi phí ghi.</span></div>
  <div class="kv"><span class="k">Condition expression</span><span class="v">Phép kiểm phía máy chủ, chạy nguyên tử cùng lệnh ghi.</span></div>
  <div class="kv"><span class="k">On-demand</span><span class="v">Tính tiền PAY_PER_REQUEST, không phải tính trước công suất.</span></div>
  <div class="kv"><span class="k">RRU / WRU</span><span class="v">Đơn vị đọc (4 KB) / ghi (1 KB).</span></div>
  <div class="kv"><span class="k">Phân vùng nóng</span><span class="v">Một khoá nhận phần lưu lượng quá lớn so với các khoá khác.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Thuộc tính chứa mốc hết hạn; item bị xoá ở chế độ nền.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>DynamoDB trả lời nhanh những câu hỏi đã tính trước, ở mọi quy mô; nó không tự nghĩ ra kế hoạch truy vấn.</li>
  <li>Thiết kế khoá từ mẫu truy cập; Query theo khoá, thêm GSI dè sẻn, tránh Scan.</li>
  <li>Ghi có điều kiện làm “đặt đúng một lần” thành nguyên tử — 1 người thắng trên 20 yêu cầu đồng thời.</li>
  <li>Item ≤ 400 KB; dữ liệu lớn để ở S3. TTL dọn item hết hạn miễn phí.</li>
  <li>Dùng nó bên cạnh PostgreSQL cho dữ liệu lớn, truy cập theo khoá — không mặc định thay PostgreSQL.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html', '🗄️', 'Tài liệu AWS — Thiết kế NoSQL cho DynamoDB', 'Mẫu truy cập trước, khoá, thiết kế một bảng.')}
${tl('https://aws.amazon.com/message/101925/', '🌩️', 'AWS — Tóm tắt sự cố us-east-1 (10/2025)', 'Một bản ghi DNS rỗng làm DynamoDB, và cả một phần lớn Region, ngừng chạy.')}

<h3>Nguồn</h3>
<ul>
  <li>Thành phần cốt lõi: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html</a></li>
  <li>Thiết kế NoSQL: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html</a></li>
  <li>Condition expression: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html</a></li>
  <li>Global secondary index: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html</a></li>
  <li>Chế độ công suất: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html</a></li>
  <li>Đơn vị đọc/ghi: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html</a></li>
  <li>TTL: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html</a></li>
  <li>Hạn mức (item 400 KB): <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html</a></li>
  <li>Phân quyền chi tiết (LeadingKeys): <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html</a></li>
  <li>Giá on-demand: <a href="https://aws.amazon.com/dynamodb/pricing/on-demand/" target="_blank" rel="noopener">aws.amazon.com/dynamodb/pricing/on-demand/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>Tóm tắt sự cố us-east-1: <a href="https://aws.amazon.com/message/101925/" target="_blank" rel="noopener">aws.amazon.com/message/101925/</a></li>
</ul>
</div>
`;

/* ═════ 6.5 — ElastiCache and choosing a database ═════ */
const L65_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 5</span>
<h2>6.5 — ElastiCache and choosing a database: memory in front of the disk</h2>
<p class="lead">Some questions are asked thousands of times a minute and change rarely: “what is A101's schedule this week?”. Asking PostgreSQL every time wastes its CPU and your users' time. A <strong>cache</strong> keeps the answer in memory, a few hundred microseconds away. <strong>Amazon ElastiCache</strong> runs Valkey, Redis OSS or Memcached for you, inside your VPC, with replicas and failover. This lesson measures cache-aside on real Valkey and PostgreSQL (357 ms ⇒ 0.5 ms), shows what an exposed cache gives an attacker, and ends with the table every architecture interview and the SAA exam expect you to know: which AWS database for which job.</p>

<h3>The picture: the front desk keeps copies</h3>
<p>Students keep asking the lab front desk for this week's A101 schedule. The first time, the clerk walks to the archive (database), prints it, and keeps a copy on the desk with a sticky note “valid until 10:00” (TTL). Everyone else gets the copy instantly. When someone books a new slot, the clerk throws the copy away (invalidation); the next person triggers a fresh print.</p>

<h3>Valkey, Redis OSS, Memcached</h3>
<ul>
  <li><strong>Valkey</strong> — the open-source fork that continued from Redis 7.2.4 after Redis Inc. changed its license in 2024, hosted by the Linux Foundation. Same protocol and commands; ioredis, Jedis and Spring Data Redis work unchanged. On ElastiCache it is also the cheapest engine.</li>
  <li><strong>Redis OSS</strong> — still offered; same features, higher price on ElastiCache.</li>
  <li><strong>Memcached</strong> — plain multi-threaded key-value cache: no replication, no persistence, no data structures. Choose it only for a simple, disposable cache.</li>
</ul>
<p>Beyond caching, Valkey/Redis data structures power sessions, rate-limit counters (<code>INCR</code> + <code>EXPIRE</code>), leaderboards (sorted sets), short-lived locks and pub/sub.</p>

<h3>See it running (1): an ElastiCache replication group (API)</h3>
<p>Moto again stands in for the ElastiCache API — configuration only.</p>
${OUT_65_CACHE_API}
<ul>
  <li>The cache subnet group uses the same private subnets as the database. ElastiCache has no “publicly accessible” switch: it is reachable only from inside the VPC.</li>
  <li>One primary + one replica in another AZ, automatic failover and Multi-AZ on; encryption in transit (TLS) and at rest; an AUTH token (or, better, RBAC users) required.</li>
  <li>The app writes to the <strong>primary endpoint</strong> and may read from the <strong>reader endpoint</strong>. <strong>Moto differs:</strong> it builds the endpoint name with <code>use1</code> and returns no reader endpoint; real AWS returns both, named after your Region.</li>
  <li><strong>ElastiCache Serverless</strong> skips choosing node sizes: you pay per GB-hour stored and per million ECPUs (units of work). Moto cannot emulate it, so it is not shown.</li>
</ul>

<h3>See it running (2): cache-aside on real Valkey + PostgreSQL</h3>
${MA_CACHE}
${OUT_65_CACHE_THAT}
<ol>
  <li>First call: <strong>MISS</strong> — 357 ms, the full report query (the <code>pg_sleep(0.3)</code> stands in for a heavy join).</li>
  <li>Calls 2–3: <strong>HIT</strong> — 0.5 ms and 0.3 ms, roughly a thousand times faster, and PostgreSQL did no work.</li>
  <li>A new booking is written to the database <em>and the cache key is deleted</em>. The next call misses and sees 41 rows — fresh data.</li>
  <li>Without any write, the 5-second TTL expires and call 6 misses again. TTL is the safety net for every invalidation you forgot.</li>
</ol>
<p>This is <strong>cache-aside</strong> (lazy loading): the app checks the cache, falls back to the database, then fills the cache. Its sibling <strong>write-through</strong> updates the cache on every write — fresher, but it caches data nobody reads. Two traps to know:</p>
<ul>
  <li><strong>Stale data</strong> — always delete (or update) the key in the same code path that writes the database, and keep a TTL.</li>
  <li><strong>Stampede</strong> — a popular key expires and 500 requests all miss at once, hitting the database together. Cures: random jitter on TTL, a short lock so one request refills while others wait, or serving the stale value while refreshing.</li>
</ul>

<h3>See it running (3): a cache left open</h3>
${OUT_65_MO_THAT}
<ul>
  <li>No password, protected mode off, on a public network: any host lists the session keys and reads an admin session token. That is account takeover without touching the app.</li>
  <li>The old worm trick — <code>CONFIG SET dir</code> to write files such as SSH keys onto the server — is blocked by modern Valkey/Redis (<em>protected config</em>). Older versions did not block it.</li>
  <li><code>FLUSHALL</code> still works: every user is logged out in one command.</li>
  <li>The right setup answers from outside with “does not resolve”, and from the app with <code>NOAUTH</code> until it authenticates.</li>
</ul>

<h3>Real incident: P2PInfect, July 2023</h3>
<p>Unit 42 (Palo Alto Networks) reported a new peer-to-peer worm, written in Rust, that infected Redis servers by exploiting a Lua sandbox escape (CVE-2022-0543). In two weeks they observed over 307,000 Redis systems communicating publicly, of which 934 might be vulnerable. Every exposed cache is a foothold. ElastiCache closes the usual doors by design — VPC only, security groups, TLS, AUTH/RBAC, managed patching — as long as you do not reopen them with a proxy or a self-managed Redis on a public EC2.</p>

<h3>Choosing a database on AWS</h3>
<table>
  <thead><tr><th>Need</th><th>Service</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Relational data, joins, transactions, a known engine</td><td><strong>RDS</strong> (PostgreSQL, MySQL…)</td><td>Familiar SQL, managed backups/failover, cheapest relational option</td></tr>
    <tr><td>Relational, high availability and read scale beyond RDS</td><td><strong>Aurora</strong> (PostgreSQL/MySQL-compatible)</td><td>Storage replicated six ways across three AZs, up to 15 replicas, fast failover; Serverless v2 scales capacity</td></tr>
    <tr><td>Key-value at any scale, serverless, predictable patterns</td><td><strong>DynamoDB</strong></td><td>Single-digit ms, no servers/connections, Global Tables</td></tr>
    <tr><td>Microsecond reads, sessions, counters, leaderboards</td><td><strong>ElastiCache</strong> (Valkey/Redis OSS/Memcached)</td><td>In-memory; sits in front of a database, not instead of it</td></tr>
    <tr><td>Full-text search, log analytics</td><td>OpenSearch Service</td><td>Inverted indexes, aggregations</td></tr>
    <tr><td>Data warehouse, analytics over large history</td><td>Redshift (or Athena over S3)</td><td>Columnar storage, SQL analytics</td></tr>
  </tbody>
</table>
<p>Exam-style signals: “reduce read load on RDS for repeated queries” ⇒ ElastiCache; “millions of requests per second, key-value, serverless” ⇒ DynamoDB; “MySQL-compatible, highest availability, 15 read replicas” ⇒ Aurora; “session state for a stateless web tier” ⇒ ElastiCache or DynamoDB; “microsecond reads for DynamoDB” ⇒ DAX.</p>

<h3>Price (Singapore, 11/2026)</h3>
<ul>
  <li><code>cache.t4g.micro</code>: Valkey 0.0192 USD/h (≈ 14 USD/month), Redis OSS 0.024 USD/h. A primary + replica doubles it.</li>
  <li>Serverless Valkey: 0.101 USD per GB-hour of data + 0.0027 USD per million ECPUs.</li>
  <li>Before buying a cache, check the query: an index or a better query often removes the need.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>“How do you keep cache and database consistent?”</strong> — Cache-aside with delete-on-write in the same code path, a TTL as a safety net, and accept a short staleness window; for strict consistency read the database.</li>
  <li><strong>“What is a cache stampede and how do you prevent it?”</strong> — Many misses on one expired hot key at once; prevent with TTL jitter, a single-flight lock or stale-while-revalidate.</li>
  <li><strong>“RDS, Aurora, DynamoDB or ElastiCache for…?”</strong> — Answer with the access pattern, consistency needs, scale and cost, then name the service.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>Reproduce a stampede: delete <code>lich:A101</code>, then fire 50 concurrent <code>lichPhong('A101')</code> calls with <code>Promise.all</code> and count how many reached PostgreSQL. Then add an in-process “single flight” (one shared promise per key) and count again.</p>
<p><strong>Pass when</strong>: without the fix PostgreSQL is hit many times (up to 50); with it exactly once, and you can explain why a per-process fix is not enough with 10 app instances (hint: a short Valkey lock with <code>SET key value NX PX 3000</code>).</p>
${giai('Hint: single flight', js(`
const dangChay = new Map();
function lichPhongMotLan(phong) {
  if (!dangChay.has(phong)) {
    dangChay.set(phong, lichPhong(phong).finally(() => dangChay.delete(phong)));
  }
  return dangChay.get(phong);
}`))}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ElastiCache</span><span class="v">Managed in-memory cache: Valkey, Redis OSS, Memcached; VPC only.</span></div>
  <div class="kv"><span class="k">Valkey</span><span class="v">Linux Foundation fork of Redis 7.2.4; same protocol.</span></div>
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Read cache, on miss read DB and fill cache (lazy loading).</span></div>
  <div class="kv"><span class="k">Write-through</span><span class="v">Update the cache on every database write.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Expiry time of a key; the net that catches stale data.</span></div>
  <div class="kv"><span class="k">Stampede</span><span class="v">Many simultaneous misses on one expired hot key.</span></div>
  <div class="kv"><span class="k">Replication group</span><span class="v">Primary + replicas with automatic failover and endpoints.</span></div>
  <div class="kv"><span class="k">Aurora</span><span class="v">AWS's cloud-native MySQL/PostgreSQL-compatible engine.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A cache answers repeated reads from memory: 357 ms ⇒ 0.5 ms in this lab.</li>
  <li>Cache-aside + delete-on-write + TTL; watch for stampedes on hot keys.</li>
  <li>ElastiCache lives inside the VPC with TLS and AUTH/RBAC; never expose a cache.</li>
  <li>Valkey is the cheapest ElastiCache engine and a drop-in for Redis clients.</li>
  <li>Choose the database by access pattern: RDS/Aurora relational, DynamoDB key-value, ElastiCache in front.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html', '⚡', 'AWS whitepaper — Caching patterns', 'Cache-aside, write-through, TTL and stampede handling.')}
${tl('https://unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/', '🪱', 'Unit 42 — P2PInfect worm targets Redis (2023)', 'How exposed Redis servers become a botnet.')}

<h3>Sources</h3>
<ul>
  <li>What is ElastiCache: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html</a></li>
  <li>Caching strategies: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html</a></li>
  <li>Caching patterns whitepaper: <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html" target="_blank" rel="noopener">docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html</a></li>
  <li>AUTH: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth.html</a></li>
  <li>In-transit encryption: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption.html</a></li>
  <li>Aurora overview: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html</a></li>
  <li>Valkey: <a href="https://valkey.io/" target="_blank" rel="noopener">valkey.io</a> · Linux Foundation announcement: <a href="https://www.linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community" target="_blank" rel="noopener">linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community</a></li>
  <li>Pricing: <a href="https://aws.amazon.com/elasticache/pricing/" target="_blank" rel="noopener">aws.amazon.com/elasticache/pricing/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>P2PInfect (19/07/2023): <a href="https://unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/" target="_blank" rel="noopener">unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/</a></li>
</ul>
</div>
`;
const L65_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 5</span>
<h2>6.5 — ElastiCache và chọn cơ sở dữ liệu: bộ nhớ đứng trước ổ đĩa</h2>
<p class="lead">Có những câu hỏi được hỏi hàng nghìn lần mỗi phút mà hiếm khi đổi: “tuần này lịch phòng A101 thế nào?”. Lần nào cũng hỏi PostgreSQL là phí CPU của nó và phí thời gian của người dùng. <strong>Cache</strong> giữ sẵn câu trả lời trong bộ nhớ, cách vài trăm micro giây. <strong>Amazon ElastiCache</strong> chạy Valkey, Redis OSS hoặc Memcached thay bạn, bên trong VPC, có bản sao và chuyển dự phòng. Bài này đo cache-aside trên Valkey và PostgreSQL thật (357 ms ⇒ 0,5 ms), cho thấy một cache để hở đưa kẻ tấn công những gì, và kết thúc bằng bảng mà mọi buổi phỏng vấn kiến trúc lẫn đề SAA đều chờ bạn thuộc: dịch vụ cơ sở dữ liệu nào của AWS cho việc nào.</p>

<h3>Hình dung: quầy lễ tân giữ sẵn bản in</h3>
<p>Sinh viên cứ hỏi quầy lễ tân phòng lab về lịch A101 tuần này. Lần đầu, nhân viên xuống kho lưu trữ (cơ sở dữ liệu), in ra, rồi để một bản trên quầy kèm tờ giấy nhớ “dùng tới 10:00” (TTL). Ai tới sau cũng nhận bản đó ngay. Khi có người đặt thêm khung giờ, nhân viên bỏ bản in cũ đi (vô hiệu hoá); người kế tiếp sẽ khiến nhân viên in bản mới.</p>

<h3>Valkey, Redis OSS, Memcached</h3>
<ul>
  <li><strong>Valkey</strong> — bản rẽ nhánh mã nguồn mở, đi tiếp từ Redis 7.2.4 sau khi Redis Inc. đổi giấy phép năm 2024, do Linux Foundation bảo trợ. Cùng giao thức và lệnh; ioredis, Jedis, Spring Data Redis dùng nguyên không sửa. Trên ElastiCache nó còn là engine rẻ nhất.</li>
  <li><strong>Redis OSS</strong> — vẫn có; cùng tính năng, giá trên ElastiCache cao hơn.</li>
  <li><strong>Memcached</strong> — cache key-value đơn giản, đa luồng: không sao chép, không lưu xuống đĩa, không có cấu trúc dữ liệu. Chỉ chọn khi cần một cache đơn giản, mất cũng không sao.</li>
</ul>
<p>Ngoài cache, các cấu trúc dữ liệu của Valkey/Redis còn dùng cho phiên đăng nhập, bộ đếm giới hạn tần suất (<code>INCR</code> + <code>EXPIRE</code>), bảng xếp hạng (sorted set), khoá ngắn hạn và pub/sub.</p>

<h3>Xem chạy (1): một replication group ElastiCache (API)</h3>
<p>Moto lại đứng thay API của ElastiCache — chỉ là cấu hình.</p>
${OUT_65_CACHE_API}
<ul>
  <li>Cache subnet group dùng đúng các subnet private của cơ sở dữ liệu. ElastiCache không có công tắc “truy cập công khai”: chỉ với tới được từ bên trong VPC.</li>
  <li>Một nút chính + một bản sao ở AZ khác, bật tự chuyển dự phòng và Multi-AZ; mã hoá đường truyền (TLS) và mã hoá lưu trữ; bắt buộc AUTH token (hoặc tốt hơn là người dùng RBAC).</li>
  <li>App ghi vào <strong>primary endpoint</strong> và có thể đọc ở <strong>reader endpoint</strong>. <strong>Moto khác AWS:</strong> nó dựng tên endpoint với <code>use1</code> và không trả reader endpoint; AWS thật trả cả hai, đặt tên theo Region của bạn.</li>
  <li><strong>ElastiCache Serverless</strong> bỏ qua bước chọn cỡ nút: trả tiền theo GB-giờ dữ liệu và theo triệu ECPU (đơn vị công việc). Moto chưa giả lập được nên không có ở đây.</li>
</ul>

<h3>Xem chạy (2): cache-aside trên Valkey + PostgreSQL thật</h3>
${MA_CACHE}
${OUT_65_CACHE_THAT}
<ol>
  <li>Lần gọi đầu: <strong>MISS</strong> — 357 ms, chạy trọn truy vấn báo cáo (<code>pg_sleep(0.3)</code> đứng thay cho một phép join nặng).</li>
  <li>Lần 2–3: <strong>HIT</strong> — 0,5 ms và 0,3 ms, nhanh hơn chừng một nghìn lần, và PostgreSQL không phải làm gì.</li>
  <li>Một lượt đặt mới được ghi vào cơ sở dữ liệu <em>và khoá cache bị xoá</em>. Lần gọi kế tiếp trượt cache và thấy 41 dòng — dữ liệu mới.</li>
  <li>Không có lệnh ghi nào, TTL 5 giây hết hạn và lần 6 lại trượt. TTL là tấm lưới đỡ mọi lần vô hiệu hoá bạn lỡ quên.</li>
</ol>
<p>Đây là <strong>cache-aside</strong> (lazy loading): app hỏi cache trước, trượt thì hỏi cơ sở dữ liệu rồi điền vào cache. Người anh em <strong>write-through</strong> cập nhật cache ở mọi lần ghi — tươi hơn, nhưng cache cả những thứ không ai đọc. Hai cái bẫy cần biết:</p>
<ul>
  <li><strong>Dữ liệu cũ</strong> — luôn xoá (hoặc cập nhật) khoá ngay trong đoạn mã ghi cơ sở dữ liệu, và luôn đặt TTL.</li>
  <li><strong>Dồn ứ (stampede)</strong> — một khoá phổ biến hết hạn và 500 yêu cầu cùng trượt một lúc, cùng đổ vào cơ sở dữ liệu. Cách chữa: cộng ngẫu nhiên vào TTL (jitter), một khoá ngắn để chỉ một yêu cầu đi lấy lại còn lại chờ, hoặc trả giá trị cũ trong lúc làm mới.</li>
</ul>

<h3>Xem chạy (3): một cache để hở</h3>
${OUT_65_MO_THAT}
<ul>
  <li>Không mật khẩu, tắt protected mode, nằm ở mạng public: máy nào cũng liệt kê được khoá phiên và đọc token phiên của admin. Đó là chiếm tài khoản mà không cần đụng tới app.</li>
  <li>Mánh cũ của sâu mạng — <code>CONFIG SET dir</code> để ghi tệp như khoá SSH lên máy chủ — bị Valkey/Redis đời mới chặn (<em>protected config</em>). Phiên bản cũ thì không chặn.</li>
  <li><code>FLUSHALL</code> thì vẫn chạy: mọi người dùng bị đăng xuất chỉ bằng một lệnh.</li>
  <li>Cách dựng đúng thì từ ngoài trả “không phân giải được tên”, còn từ app trả <code>NOAUTH</code> cho tới khi xác thực.</li>
</ul>

<h3>Sự cố thật: P2PInfect, tháng 7/2023</h3>
<p>Unit 42 (Palo Alto Networks) công bố một loại sâu mạng ngang hàng mới, viết bằng Rust, lây vào máy chủ Redis bằng cách khai thác lỗ thoát sandbox Lua (CVE-2022-0543). Trong hai tuần họ thấy hơn 307.000 hệ thống Redis giao tiếp công khai, trong đó 934 hệ có thể bị lây. Mỗi cache để hở là một chỗ đặt chân. ElastiCache đóng sẵn các cửa quen thuộc — chỉ trong VPC, security group, TLS, AUTH/RBAC, được vá bởi AWS — miễn là bạn đừng tự mở lại bằng một proxy hay một Redis tự dựng trên EC2 công khai.</p>

<h3>Chọn cơ sở dữ liệu trên AWS</h3>
<table>
  <thead><tr><th>Nhu cầu</th><th>Dịch vụ</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td>Dữ liệu quan hệ, join, giao dịch, engine quen thuộc</td><td><strong>RDS</strong> (PostgreSQL, MySQL…)</td><td>SQL quen thuộc, sao lưu/chuyển dự phòng được quản lý, phương án quan hệ rẻ nhất</td></tr>
    <tr><td>Quan hệ, cần sẵn sàng cao và mở rộng đọc vượt RDS</td><td><strong>Aurora</strong> (tương thích PostgreSQL/MySQL)</td><td>Ổ lưu trữ nhân sáu bản qua ba AZ, tới 15 bản đọc, chuyển dự phòng nhanh; Serverless v2 tự co giãn công suất</td></tr>
    <tr><td>Key-value ở mọi quy mô, serverless, mẫu truy cập biết trước</td><td><strong>DynamoDB</strong></td><td>Vài mili giây, không máy chủ/kết nối, Global Tables</td></tr>
    <tr><td>Đọc micro giây, phiên, bộ đếm, bảng xếp hạng</td><td><strong>ElastiCache</strong> (Valkey/Redis OSS/Memcached)</td><td>Trong bộ nhớ; đứng trước cơ sở dữ liệu, không thay nó</td></tr>
    <tr><td>Tìm kiếm toàn văn, phân tích log</td><td>OpenSearch Service</td><td>Chỉ mục đảo, phép gộp</td></tr>
    <tr><td>Kho dữ liệu, phân tích lịch sử lớn</td><td>Redshift (hoặc Athena trên S3)</td><td>Lưu theo cột, phân tích bằng SQL</td></tr>
  </tbody>
</table>
<p>Tín hiệu trong đề thi: “giảm tải đọc cho RDS với truy vấn lặp lại” ⇒ ElastiCache; “hàng triệu yêu cầu mỗi giây, key-value, serverless” ⇒ DynamoDB; “tương thích MySQL, sẵn sàng cao nhất, 15 bản đọc” ⇒ Aurora; “trạng thái phiên cho tầng web không trạng thái” ⇒ ElastiCache hoặc DynamoDB; “đọc micro giây cho DynamoDB” ⇒ DAX.</p>

<h3>Giá (Singapore, 11/2026)</h3>
<ul>
  <li><code>cache.t4g.micro</code>: Valkey 0,0192 USD/giờ (≈ 14 USD/tháng), Redis OSS 0,024 USD/giờ. Một nút chính + một bản sao thì gấp đôi.</li>
  <li>Valkey serverless: 0,101 USD mỗi GB-giờ dữ liệu + 0,0027 USD mỗi triệu ECPU.</li>
  <li>Trước khi mua cache, xem lại câu truy vấn: một index hay một truy vấn tốt hơn thường đã đủ.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>“Giữ cache và cơ sở dữ liệu nhất quán thế nào?”</strong> — Cache-aside, xoá khoá ngay trong đoạn mã ghi, TTL làm lưới đỡ, và chấp nhận một khoảng ngắn dữ liệu cũ; cần nhất quán tuyệt đối thì đọc thẳng cơ sở dữ liệu.</li>
  <li><strong>“Cache stampede là gì, phòng thế nào?”</strong> — Rất nhiều lần trượt cùng lúc trên một khoá nóng vừa hết hạn; phòng bằng jitter cho TTL, khoá single-flight hoặc trả bản cũ trong lúc làm mới.</li>
  <li><strong>“RDS, Aurora, DynamoDB hay ElastiCache cho việc…?”</strong> — Trả lời bằng mẫu truy cập, yêu cầu nhất quán, quy mô và chi phí, rồi mới gọi tên dịch vụ.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Tái hiện dồn ứ: xoá <code>lich:A101</code>, rồi bắn 50 lời gọi <code>lichPhong('A101')</code> đồng thời bằng <code>Promise.all</code> và đếm bao nhiêu lần chạm tới PostgreSQL. Sau đó thêm “single flight” trong tiến trình (một promise dùng chung cho mỗi khoá) và đếm lại.</p>
<p><strong>Đạt khi</strong>: chưa sửa thì PostgreSQL bị hỏi nhiều lần (tới 50); sửa rồi thì đúng một lần, và bạn giải thích được vì sao sửa trong một tiến trình là chưa đủ khi có 10 instance app (gợi ý: một khoá ngắn trên Valkey bằng <code>SET key value NX PX 3000</code>).</p>
${giai('Gợi ý: single flight', js(`
const dangChay = new Map();
function lichPhongMotLan(phong) {
  if (!dangChay.has(phong)) {
    dangChay.set(phong, lichPhong(phong).finally(() => dangChay.delete(phong)));
  }
  return dangChay.get(phong);
}`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ElastiCache</span><span class="v">Cache trong bộ nhớ được quản lý: Valkey, Redis OSS, Memcached; chỉ trong VPC.</span></div>
  <div class="kv"><span class="k">Valkey</span><span class="v">Bản rẽ nhánh Redis 7.2.4 do Linux Foundation bảo trợ; cùng giao thức.</span></div>
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Đọc cache, trượt thì đọc DB rồi điền cache (lazy loading).</span></div>
  <div class="kv"><span class="k">Write-through</span><span class="v">Cập nhật cache ở mọi lần ghi cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">Thời hạn của một khoá; lưới đỡ dữ liệu cũ.</span></div>
  <div class="kv"><span class="k">Stampede</span><span class="v">Rất nhiều lần trượt đồng thời trên một khoá nóng vừa hết hạn.</span></div>
  <div class="kv"><span class="k">Replication group</span><span class="v">Nút chính + bản sao, tự chuyển dự phòng, có các endpoint.</span></div>
  <div class="kv"><span class="k">Aurora</span><span class="v">Engine đám mây của AWS, tương thích MySQL/PostgreSQL.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cache trả lời các lần đọc lặp lại từ bộ nhớ: 357 ms ⇒ 0,5 ms trong lab này.</li>
  <li>Cache-aside + xoá khoá khi ghi + TTL; coi chừng dồn ứ ở khoá nóng.</li>
  <li>ElastiCache nằm trong VPC, có TLS và AUTH/RBAC; không bao giờ để cache hở.</li>
  <li>Valkey là engine rẻ nhất của ElastiCache và thay thẳng được cho client Redis.</li>
  <li>Chọn cơ sở dữ liệu theo mẫu truy cập: RDS/Aurora cho quan hệ, DynamoDB cho key-value, ElastiCache đứng trước.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html', '⚡', 'Whitepaper AWS — Các mẫu cache', 'Cache-aside, write-through, TTL và xử lý dồn ứ.')}
${tl('https://unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/', '🪱', 'Unit 42 — Sâu P2PInfect nhắm vào Redis (2023)', 'Máy chủ Redis để hở thành botnet như thế nào.')}

<h3>Nguồn</h3>
<ul>
  <li>ElastiCache là gì: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html</a></li>
  <li>Chiến lược cache: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html</a></li>
  <li>Whitepaper các mẫu cache: <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html" target="_blank" rel="noopener">docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html</a></li>
  <li>AUTH: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth.html</a></li>
  <li>Mã hoá đường truyền: <a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption.html</a></li>
  <li>Tổng quan Aurora: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html</a></li>
  <li>Valkey: <a href="https://valkey.io/" target="_blank" rel="noopener">valkey.io</a> · Thông báo của Linux Foundation: <a href="https://www.linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community" target="_blank" rel="noopener">linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community</a></li>
  <li>Giá: <a href="https://aws.amazon.com/elasticache/pricing/" target="_blank" rel="noopener">aws.amazon.com/elasticache/pricing/</a> (Price List API, Singapore, 20/11/2026)</li>
  <li>P2PInfect (19/07/2023): <a href="https://unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/" target="_blank" rel="noopener">unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/</a></li>
</ul>
</div>
`;

/* ═════ 6.6 — Lab chương 6 ═════ */
const L66_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab</span>
<h2>6.6 — Chapter 6 lab: LabFlow's data tier, from “it works” to production-safe</h2>
<p class="lead">A teammate set up LabFlow's data tier in a hurry: the PostgreSQL instance is public and unencrypted, keeps one day of backups, has no deletion protection and a master password typed into a terminal; the JWT secret is a plain String parameter; the audit-log table has fixed capacity, no point-in-time recovery and no expiry. Your job: bring it to 8/8 on the grader without losing the database, then clean up and prove nothing is left on the bill.</p>

<h3>The brief</h3>
<ul>
  <li>RDS <code>labflow-db</code>: not publicly accessible, storage encrypted, automated backups kept ≥ 7 days, deletion protection on, master password managed by Secrets Manager.</li>
  <li>App secrets: <code>labflow/prod/db</code> in Secrets Manager; <code>/labflow/prod/jwt-secret</code> as a <code>SecureString</code>.</li>
  <li>DynamoDB <code>labflow-audit</code>: on-demand, point-in-time recovery on, TTL on attribute <code>hetHan</code>.</li>
  <li>Runs against Moto (RDS) + LocalStack (Secrets Manager, SSM, DynamoDB). Remove <code>--endpoint-url</code> in <code>chung6.sh</code> and the same scripts grade a real account.</li>
</ul>

<h3>The grader (8 checks)</h3>
${MA_CHAM}

<h3>Starting point: the hurried version</h3>
${MA_TRUOC}
${OUT_66_TRUOC}
<p>Zero out of eight. Every line is a real mistake seen in student projects and in real companies. <strong>Stop the video here and try it yourself</strong> — one trap is waiting: one of the eight settings cannot be changed on an existing instance.</p>

${giai('Solution: giai.sh, the grader at 8/8', MA_GIAI + OUT_66_GIAI + `
<ol>
  <li><strong>Encryption cannot be switched on in place</strong>: the CLI does not even have a <code>--storage-encrypted</code> option for <code>modify-db-instance</code>. The path is snapshot ⇒ <code>copy-db-snapshot --kms-key-id</code> (the copy is encrypted) ⇒ <code>restore-db-instance-from-db-snapshot</code> ⇒ delete the old instance with a final snapshot ⇒ rename the new one to <code>labflow-db</code> so the endpoint name the app uses comes back. On a real database, stop writes (or plan a short maintenance window) between the snapshot and the switch.</li>
  <li><strong>Moto differs:</strong> it ignored <code>--no-publicly-accessible</code> on restore, so the solution sets it again with <code>modify-db-instance</code>. On AWS the restore flag works; the extra modify is harmless.</li>
  <li><code>--manage-master-user-password</code> on modify moves the master password into Secrets Manager; nobody needs to know it again.</li>
  <li><code>put-parameter --overwrite --type SecureString</code> replaces the plain parameter (version 2).</li>
  <li>DynamoDB switches billing mode in place; PITR and TTL are one call each.</li>
</ol>`)}

<h3>Clean-up and the bill check</h3>
${MA_DON}
${MA_CONGI}
${OUT_66_DON}
<ul>
  <li>Order matters: deletion protection off ⇒ delete instances ⇒ delete <strong>manual</strong> snapshots (including the final one) — they never expire on their own ⇒ secrets ⇒ parameters ⇒ tables.</li>
  <li>On a real account a secret deleted without <code>--force-delete-without-recovery</code> is still billed during its recovery window. RDS-managed master secrets are deleted together with the instance.</li>
  <li>Every line of <code>con-gi.sh</code> must be 0 — check it in every Region you used.</li>
</ul>

<h3>What this tier costs per month (Singapore, 11/2026)</h3>
<table>
  <thead><tr><th>Item</th><th>Assumption</th><th>USD/month</th></tr></thead>
  <tbody>
    <tr><td>RDS db.t4g.micro Single-AZ</td><td>730 h × 0.025</td><td>18.25</td></tr>
    <tr><td>RDS gp3 storage</td><td>20 GB × 0.138</td><td>2.76</td></tr>
    <tr><td>Automated backups</td><td>≤ 20 GB (free up to provisioned size)</td><td>0</td></tr>
    <tr><td>Secrets Manager</td><td>1 secret + ~86,400 calls (10 tasks, 5-minute cache)</td><td>0.40 + 0.43</td></tr>
    <tr><td>Parameter Store</td><td>Standard parameters</td><td>0</td></tr>
    <tr><td>DynamoDB audit log</td><td>1 million writes, &lt; 25 GB, PITR on ~1 GB</td><td>0.71 + 0.23</td></tr>
    <tr><td><strong>Total</strong></td><td></td><td><strong>≈ 22.8</strong></td></tr>
    <tr><td>Optional: Multi-AZ</td><td>0.051 instead of 0.025 per hour (+ storage for the standby)</td><td>+ ~19 or more</td></tr>
    <tr><td>Optional: ElastiCache Valkey t4g.micro</td><td>730 h × 0.0192</td><td>+ 14.02</td></tr>
  </tbody>
</table>
<p>New accounts on the Free plan spend credits on this (Mục 0). Either way, run <code>don.sh</code> and <code>con-gi.sh</code> the same day.</p>

<h3>🎤 Five interview questions from this chapter</h3>
<ol>
  <li><strong>“Your RDS instance is unencrypted. Fix it.”</strong> — Not in place: snapshot ⇒ encrypted copy with KMS ⇒ restore ⇒ switch the app (rename or new endpoint) ⇒ delete the old instance after a final snapshot. Plan the write freeze.</li>
  <li><strong>“How does the app get the DB password?”</strong> — From Secrets Manager at runtime via its IAM role (ECS <code>secrets</code> or SDK with a cache); never in code, images or env files; rotated automatically.</li>
  <li><strong>“A table was dropped 10 minutes ago.”</strong> — PITR to the second before into a new instance, verify, copy the table back or switch; replicas will not help, they already dropped it.</li>
  <li><strong>“Where would you store LabFlow's audit log and why?”</strong> — DynamoDB on-demand: append-only, key-based reads (by user or room + time), TTL to expire old entries, no load on the main PostgreSQL.</li>
  <li><strong>“Why keep deletion protection and a final snapshot?”</strong> — One wrong command or Terraform plan can delete production; protection blocks it, the final snapshot is the last way back.</li>
</ol>

<h3>🧪 Practice — this lab is the practice</h3>
<p><strong>Pass when</strong>: <code>cham.sh</code> prints <code>ĐIỂM: 8/8</code>, then <code>con-gi.sh</code> prints five zeros. Bonus: write the same eight settings in Terraform (Chapter 11 will come back to it) and run the grader against it.</p>

<h3>Sources</h3>
<ul>
  <li>Encrypting an unencrypted DB instance (copy snapshot with KMS): <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html</a></li>
  <li>RDS master password in Secrets Manager: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html</a></li>
  <li>DynamoDB capacity modes: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html</a></li>
  <li>Prices: Price List API, Singapore, 19–20/11/2026 (RDS, Secrets Manager, DynamoDB, ElastiCache).</li>
</ul>
</div>
`;
const L66_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab</span>
<h2>6.6 — Lab chương 6: tầng dữ liệu của LabFlow, từ “chạy được” tới an toàn cho production</h2>
<p class="lead">Một bạn trong nhóm dựng vội tầng dữ liệu của LabFlow: instance PostgreSQL để công khai và không mã hoá, giữ sao lưu một ngày, không bật chống xoá, mật khẩu chủ gõ thẳng trong terminal; bí mật JWT là một tham số String thường; bảng nhật ký kiểm toán dùng công suất cố định, không có khôi phục theo thời điểm, không có hạn xoá. Việc của bạn: đưa nó lên 8/8 trên bộ chấm mà không mất cơ sở dữ liệu, rồi dọn sạch và chứng minh không còn gì trên hoá đơn.</p>

<h3>Đề bài</h3>
<ul>
  <li>RDS <code>labflow-db</code>: không truy cập công khai, ổ lưu trữ mã hoá, giữ sao lưu tự động ≥ 7 ngày, bật chống xoá, mật khẩu chủ do Secrets Manager quản lý.</li>
  <li>Bí mật của app: <code>labflow/prod/db</code> trong Secrets Manager; <code>/labflow/prod/jwt-secret</code> là <code>SecureString</code>.</li>
  <li>DynamoDB <code>labflow-audit</code>: on-demand, bật khôi phục theo thời điểm, TTL trên thuộc tính <code>hetHan</code>.</li>
  <li>Chạy trên Moto (RDS) + LocalStack (Secrets Manager, SSM, DynamoDB). Bỏ <code>--endpoint-url</code> trong <code>chung6.sh</code> là cùng bộ script đó chấm được tài khoản thật.</li>
</ul>

<h3>Bộ chấm (8 phép kiểm)</h3>
${MA_CHAM}

<h3>Điểm xuất phát: bản làm vội</h3>
${MA_TRUOC}
${OUT_66_TRUOC}
<p>Không trên tám. Dòng nào cũng là lỗi thật đã gặp trong đồ án sinh viên lẫn ở công ty thật. <strong>Dừng video ở đây và tự làm thử</strong> — có một cái bẫy đang chờ: một trong tám thiết lập không đổi được trên instance đang chạy.</p>

${giai('Lời giải: giai.sh, bộ chấm 8/8', MA_GIAI + OUT_66_GIAI + `
<ol>
  <li><strong>Mã hoá không bật tại chỗ được</strong>: CLI thậm chí không có tuỳ chọn <code>--storage-encrypted</code> cho <code>modify-db-instance</code>. Đường đi là snapshot ⇒ <code>copy-db-snapshot --kms-key-id</code> (bản chép được mã hoá) ⇒ <code>restore-db-instance-from-db-snapshot</code> ⇒ xoá instance cũ kèm snapshot cuối ⇒ đổi tên instance mới thành <code>labflow-db</code> để app lấy lại đúng tên endpoint cũ. Với cơ sở dữ liệu thật, phải chặn ghi (hoặc lên một khung bảo trì ngắn) giữa lúc chụp snapshot và lúc chuyển.</li>
  <li><strong>Moto khác AWS:</strong> nó bỏ qua <code>--no-publicly-accessible</code> khi restore, nên lời giải đặt lại bằng <code>modify-db-instance</code>. Trên AWS cờ đó của restore có tác dụng; lệnh modify thêm vào cũng vô hại.</li>
  <li><code>--manage-master-user-password</code> ở lệnh modify chuyển mật khẩu chủ vào Secrets Manager; từ đó không ai cần biết nó nữa.</li>
  <li><code>put-parameter --overwrite --type SecureString</code> thay tham số thường (phiên bản 2).</li>
  <li>DynamoDB đổi chế độ tính tiền tại chỗ; PITR và TTL mỗi thứ một lệnh.</li>
</ol>`)}

<h3>Dọn dẹp và kiểm hoá đơn</h3>
${MA_DON}
${MA_CONGI}
${OUT_66_DON}
<ul>
  <li>Thứ tự quan trọng: tắt chống xoá ⇒ xoá instance ⇒ xoá snapshot <strong>thủ công</strong> (kể cả snapshot cuối) — chúng không bao giờ tự hết hạn ⇒ bí mật ⇒ tham số ⇒ bảng.</li>
  <li>Trên tài khoản thật, bí mật xoá mà không có <code>--force-delete-without-recovery</code> vẫn bị tính tiền trong khoảng ân hạn. Bí mật chủ do RDS quản lý bị xoá cùng instance.</li>
  <li>Mọi dòng của <code>con-gi.sh</code> phải là 0 — kiểm ở mọi Region bạn đã dùng.</li>
</ul>

<h3>Tầng này tốn bao nhiêu mỗi tháng (Singapore, 11/2026)</h3>
<table>
  <thead><tr><th>Hạng mục</th><th>Giả định</th><th>USD/tháng</th></tr></thead>
  <tbody>
    <tr><td>RDS db.t4g.micro một AZ</td><td>730 giờ × 0,025</td><td>18,25</td></tr>
    <tr><td>Ổ gp3 của RDS</td><td>20 GB × 0,138</td><td>2,76</td></tr>
    <tr><td>Sao lưu tự động</td><td>≤ 20 GB (miễn phí tới dung lượng đã cấp)</td><td>0</td></tr>
    <tr><td>Secrets Manager</td><td>1 bí mật + ~86.400 lần gọi (10 task, cache 5 phút)</td><td>0,40 + 0,43</td></tr>
    <tr><td>Parameter Store</td><td>Tham số standard</td><td>0</td></tr>
    <tr><td>DynamoDB nhật ký kiểm toán</td><td>1 triệu lần ghi, &lt; 25 GB, PITR trên ~1 GB</td><td>0,71 + 0,23</td></tr>
    <tr><td><strong>Tổng</strong></td><td></td><td><strong>≈ 22,8</strong></td></tr>
    <tr><td>Tuỳ chọn: Multi-AZ</td><td>0,051 thay vì 0,025 mỗi giờ (+ ổ cho bản chờ)</td><td>+ ~19 trở lên</td></tr>
    <tr><td>Tuỳ chọn: ElastiCache Valkey t4g.micro</td><td>730 giờ × 0,0192</td><td>+ 14,02</td></tr>
  </tbody>
</table>
<p>Tài khoản mới dùng gói Free plan sẽ trừ vào tín dụng (Mục 0). Dù thế nào, chạy <code>don.sh</code> và <code>con-gi.sh</code> ngay trong ngày.</p>

<h3>🎤 Năm câu phỏng vấn của chương này</h3>
<ol>
  <li><strong>“Instance RDS của bạn chưa mã hoá. Sửa đi.”</strong> — Không sửa tại chỗ được: snapshot ⇒ bản chép mã hoá bằng KMS ⇒ restore ⇒ chuyển app (đổi tên hoặc endpoint mới) ⇒ xoá instance cũ sau khi chụp snapshot cuối. Lên kế hoạch chặn ghi.</li>
  <li><strong>“App lấy mật khẩu DB bằng cách nào?”</strong> — Từ Secrets Manager lúc chạy, qua vai IAM của app (mục <code>secrets</code> của ECS hoặc SDK có cache); không bao giờ nằm trong mã, ảnh hay tệp env; được xoay tự động.</li>
  <li><strong>“Một bảng vừa bị xoá 10 phút trước.”</strong> — PITR về giây trước đó ra instance mới, kiểm dữ liệu, chép bảng về hoặc chuyển hẳn sang; bản đọc không cứu được, nó đã xoá theo rồi.</li>
  <li><strong>“Bạn để nhật ký kiểm toán của LabFlow ở đâu, vì sao?”</strong> — DynamoDB on-demand: chỉ ghi nối thêm, đọc theo khoá (theo người hoặc phòng + thời gian), TTL để tự xoá bản cũ, không đè tải lên PostgreSQL chính.</li>
  <li><strong>“Sao phải bật chống xoá và giữ snapshot cuối?”</strong> — Một lệnh sai hay một plan Terraform sai có thể xoá production; chống xoá chặn nó lại, snapshot cuối là đường lui cuối cùng.</li>
</ol>

<h3>🧪 Thực hành — chính lab này là bài thực hành</h3>
<p><strong>Đạt khi</strong>: <code>cham.sh</code> in <code>ĐIỂM: 8/8</code>, rồi <code>con-gi.sh</code> in năm số 0. Thêm điểm: viết tám thiết lập đó bằng Terraform (Chương 11 sẽ quay lại) rồi chạy bộ chấm trên nó.</p>

<h3>Nguồn</h3>
<ul>
  <li>Mã hoá một instance chưa mã hoá (chép snapshot kèm KMS): <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html</a></li>
  <li>Mật khẩu chủ RDS trong Secrets Manager: <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html</a></li>
  <li>Chế độ công suất DynamoDB: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html</a></li>
  <li>Giá: Price List API, Singapore, 19–20/11/2026 (RDS, Secrets Manager, DynamoDB, ElastiCache).</li>
</ul>
</div>
`;

/* ═════ 6.7 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [2, 0, 3, 1, 3, 0, 2, 1, 0, 2];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ6 = [
  Q('From a laptop on the Internet, psql to an RDS instance in a private subnet. What happens?|||Từ laptop ngoài Internet, chạy psql tới một RDS trong subnet private. Chuyện gì xảy ra?', [
    'Password authentication failed|||Báo sai mật khẩu',
    'The connection times out — there is no route|||Kết nối hết giờ chờ — không có đường nào',
    'It works if sslmode=require|||Chạy được nếu sslmode=require',
    'RDS answers 403 Forbidden|||RDS trả 403 Forbidden',
  ], 1),
  Q('How do you encrypt an existing unencrypted RDS instance?|||Mã hoá một instance RDS đang chạy chưa mã hoá bằng cách nào?', [
    'modify-db-instance --storage-encrypted|||modify-db-instance --storage-encrypted',
    'Snapshot, copy the snapshot with a KMS key, restore a new instance, switch the app|||Snapshot, chép snapshot kèm khoá KMS, restore ra instance mới, chuyển app',
    'Reboot with rds.force_ssl=1|||Khởi động lại với rds.force_ssl=1',
    'It is impossible; you must dump and reload by hand|||Không thể; phải dump rồi nạp lại bằng tay',
  ], 1),
  Q('Someone ran DROP TABLE bookings on the primary. Which tool brings the table back?|||Có người chạy DROP TABLE bookings trên máy chính. Công cụ nào lấy lại được bảng?', [
    'The read replica|||Bản đọc (read replica)',
    'Point-in-time restore to the second before the DROP|||Khôi phục theo thời điểm về giây trước lệnh DROP',
    'The Multi-AZ standby|||Bản chờ Multi-AZ',
    'Rebooting with --force-failover|||Khởi động lại với --force-failover',
  ], 1),
  Q('Which statement about Multi-AZ (one standby) is true?|||Câu nào đúng về Multi-AZ (một bản chờ)?', [
    'The standby can serve read queries|||Bản chờ phục vụ được truy vấn đọc',
    'Synchronous standby, same endpoint, automatic failover typically 60–120 s|||Bản chờ đồng bộ, cùng endpoint, tự chuyển dự phòng thường 60–120 giây',
    'It replaces automated backups|||Nó thay thế sao lưu tự động',
    'It has its own endpoint for the app|||Nó có endpoint riêng cho app',
  ], 1),
  Q('A Dockerfile has COPY .env then RUN rm .env. Is the secret gone from the image?|||Dockerfile có COPY .env rồi RUN rm .env. Bí mật đã biến khỏi ảnh chưa?', [
    'Yes, rm deletes it everywhere|||Rồi, rm xoá nó khỏi mọi nơi',
    'No, the COPY layer still contains the file|||Chưa, lớp COPY vẫn chứa tệp đó',
    'Only if the image is public|||Chỉ khi ảnh để công khai',
    'Yes, if BuildKit is used|||Rồi, nếu dùng BuildKit',
  ], 1),
  Q('After put-secret-value, which label points to the old version?|||Sau put-secret-value, nhãn nào trỏ tới phiên bản cũ?', [
    'AWSCURRENT|||AWSCURRENT',
    'AWSPREVIOUS|||AWSPREVIOUS',
    'AWSPENDING|||AWSPENDING',
    'The old version is deleted|||Phiên bản cũ bị xoá',
  ], 1),
  Q('You need DB credentials rotated automatically. Which service?|||Cần thông tin đăng nhập DB được xoay tự động. Dùng dịch vụ nào?', [
    'Parameter Store String|||Parameter Store String',
    'Secrets Manager|||Secrets Manager',
    'An encrypted environment variable in the task definition|||Biến môi trường mã hoá trong task definition',
    'S3 with SSE-KMS|||S3 với SSE-KMS',
  ], 1),
  Q('20 clients put the same booking with attribute_not_exists(pk) at the same instant. Result?|||20 client cùng ghi một lượt đặt với attribute_not_exists(pk) cùng lúc. Kết quả?', [
    'All 20 succeed; the last write wins|||Cả 20 thành công; lần ghi cuối thắng',
    'Exactly one succeeds; 19 get ConditionalCheckFailedException|||Đúng một thành công; 19 nhận ConditionalCheckFailedException',
    'All fail with a throttling error|||Tất cả lỗi vì bị bóp băng thông',
    'It depends on the client clock|||Tuỳ đồng hồ của client',
  ], 1),
  Q('A scan with a filter returns Count 1, ScannedCount 6. What are you billed for?|||Một lần scan có filter trả Count 1, ScannedCount 6. Bạn bị tính tiền cho gì?', [
    'The 1 item returned|||1 item trả về',
    'The 6 items read|||6 item đã đọc',
    'Nothing, scans are free|||Không gì, scan miễn phí',
    'Only the filter expression|||Chỉ biểu thức filter',
  ], 1),
  Q('"Reduce repeated read load on RDS, answers in under a millisecond." Best fit?|||"Giảm tải đọc lặp lại trên RDS, trả lời dưới một mili giây." Hợp nhất là gì?', [
    'A second Multi-AZ standby|||Thêm một bản chờ Multi-AZ',
    'ElastiCache (Valkey) with cache-aside|||ElastiCache (Valkey) với cache-aside',
    'DynamoDB Global Tables|||DynamoDB Global Tables',
    'A bigger gp3 volume|||Ổ gp3 lớn hơn',
  ], 1),
];

export default {
  title: 'Chapter 6 — Databases and secrets|||Chương 6 — Cơ sở dữ liệu và bí mật',
  description: 'Tầng dữ liệu trên AWS, chạy thật bằng Docker: RDS PostgreSQL trong subnet private (ép TLS, verify-full, parameter group, mật khẩu chủ trong Secrets Manager), vận hành (WAL + base backup, bản đọc chép cả DROP TABLE, PITR về đúng giây trước đó, promote khi mất AZ, RPO/RTO), bí mật (ảnh Docker lộ mật khẩu, Secrets Manager + Parameter Store, xoay mật khẩu thật không gián đoạn), DynamoDB (thiết kế theo mẫu truy cập, ghi có điều kiện: 20 người giành 1 khung ⇒ 1 thắng), ElastiCache Valkey (357 ms ⇒ 0,5 ms, cache để hở) + bảng chọn cơ sở dữ liệu; lab chấm 8 phép + bảng giá tháng.',
  lessons: [
    {
      title: '6.1 — RDS for PostgreSQL|||6.1 — RDS cho PostgreSQL',
      slug: 'aws-6-1-rds',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Managed nghĩa là gì; subnet group private 2 AZ, security group, parameter group, mật khẩu chủ trong Secrets Manager; PostgreSQL 16 thật sau mạng private: ngoài vào timeout, không TLS bị chặn, verify-full, Node.js có/thiếu CA, log truy vấn chậm; so với Postgres trong Docker trên VPS; snapshot RDS công khai (Mitiga 2022).',
      content: L61_EN + L61_VI,
    },
    {
      title: '6.2 — Backups, Multi-AZ and read replicas|||6.2 — Sao lưu, Multi-AZ và bản đọc',
      slug: 'aws-6-2-van-hanh-rds',
      type: 'LESSON',
      isFreePreview: true,
      description: 'RPO/RTO; bốn công cụ cho bốn kiểu thảm hoạ; chạy thật: WAL archive + base backup, bản đọc streaming (ghi bị chặn), DROP TABLE lỡ tay chép sang bản đọc, PITR dừng đúng trước giao dịch xoá, promote khi mất AZ; GitLab 31/01/2017; chi phí snapshot.',
      content: L62_EN + L62_VI,
    },
    {
      title: '6.3 — Secrets Manager and Parameter Store|||6.3 — Secrets Manager và Parameter Store',
      slug: 'aws-6-3-bi-mat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mật khẩu nướng trong ảnh Docker lộ qua inspect/history/lớp ảnh (chạy thật); Codecov 2021; Secrets Manager (phiên bản, nhãn, ân hạn) vs Parameter Store (SecureString); app Node.js đọc bí mật có cache và sống qua lần xoay mật khẩu thật; ECS secrets, policy quyền tối thiểu, giá.',
      content: L63_EN + L63_VI,
    },
    {
      title: '6.4 — DynamoDB: key-value at any scale|||6.4 — DynamoDB: key-value ở mọi quy mô',
      slug: 'aws-6-4-dynamodb',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Partition/sort key, GSI, thiết kế bảng đặt lịch theo mẫu truy cập; ghi có điều kiện chặn đặt trùng (20 yêu cầu đồng thời ⇒ 1 thắng), query vs scan (1/6), item 400 KB, TTL, on-demand và giá; khi nào chọn thay Postgres; sự cố DNS DynamoDB us-east-1 10/2025; LeadingKeys.',
      content: L64_EN + L64_VI,
    },
    {
      title: '6.5 — ElastiCache and choosing a database|||6.5 — ElastiCache và chọn cơ sở dữ liệu',
      slug: 'aws-6-5-elasticache',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Valkey/Redis OSS/Memcached; replication group; cache-aside thật trên Valkey + PostgreSQL: MISS 357 ms ⇒ HIT 0,5 ms, xoá khoá khi ghi, TTL, dồn ứ; cache để hở bị đọc phiên + FLUSHALL; P2PInfect 2023; bảng chọn RDS/Aurora/DynamoDB/ElastiCache + tín hiệu đề thi.',
      content: L65_EN + L65_VI,
    },
    {
      title: '6.6 — Chapter 6 lab + interview questions|||6.6 — Lab chương 6 + câu hỏi phỏng vấn',
      slug: 'aws-6-6-lab-6',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tầng dữ liệu LabFlow qua bộ chấm 8 phép: bản vội 0/8 ⇒ lời giải 8/8 (RDS private, mã hoá bằng snapshot ⇒ chép KMS ⇒ restore ⇒ đổi tên, sao lưu 7 ngày, chống xoá, mật khẩu chủ trong Secrets Manager, SecureString, DynamoDB on-demand + PITR + TTL) ⇒ dọn ⇒ kiểm còn gì tính tiền; bảng giá tháng; 5 câu phỏng vấn.',
      content: L66_EN + L66_VI,
    },
    {
      title: '6.7 — Chapter 6 quiz|||6.7 — Kiểm tra Chương 6',
      slug: 'aws-6-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về RDS private, mã hoá instance có sẵn, PITR vs bản đọc, Multi-AZ, lớp ảnh Docker giữ bí mật, nhãn AWSPREVIOUS, xoay mật khẩu, ghi có điều kiện, chi phí scan và ElastiCache.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ6 },
    },
  ],
};
