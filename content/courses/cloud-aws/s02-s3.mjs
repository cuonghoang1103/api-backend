/**
 * Cloud AWS — Chương 2: Lưu trữ S3 (và R2 bạn đang dùng) (soạn 19/11/2026, agent aws; phiên 17 chạy từ Mac qua ssh).
 * GIỮ title chương theo khung + slug bài đầu aws-2-1-s3. Thứ tự bài theo khung mới (cloud-aws.mjs):
 *   2.1 s3 · 2.2 r2-giao-thuc-s3 · 2.3 quyen · 2.4 presigned · 2.5 phien-ban-vong-doi · 2.6 lo-bucket · 2.7 lab-2 · 2.8 quiz.
 *   (prod khung cũ: Chương 2 là VPC (aws-2-1-vpc…), S3 cũ ở aws-6-1-s3 ⇒ section cũ mồ côi, điều phối gỡ khi deploy.)
 * Mọi output chạy THẬT 19/11/2026 ~13:40 bằng scratchpad/aws/lab/c2/chay.sh (+ lab2/chay.sh): AWS CLI 2.41.0 →
 *   LocalStack 4.12 (S3_SKIP_SIGNATURE_VALIDATION=0: chữ ký, URL ký sẵn, CORS, versioning, lifecycle, GLACIER) và
 *   versitygw 1.11.0 (thực thi bucket policy với yêu cầu ẩn danh, BucketOwnerEnforced, PolicyStatus). Khác AWS đã ghi rõ trong bài:
 *   root versitygw bỏ qua bucket policy; versitygw không có Block Public Access; LocalStack không kiểm IAM và lờ ExpectedBucketOwner.
 *   Hằng OUT_* sinh tự động từ ~/.rtq-aws/c2/2*.txt (~/.rtq-aws/s02/sinh-p0.mjs). Java = minh hoạ, không nằm trong lần chạy đo.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/js()/java() của _chung.mjs.
 */
import { bash, json, js, java, out, tl, giai } from './_chung.mjs';
/* ═════ Output THẬT (19/11/2026 ~13:40 — scratchpad/aws/lab/c2/chay.sh + lab2/chay.sh: AWS CLI 2.41.0 → LocalStack 4.12 kiểm chữ ký / versitygw 1.11.0) ═════ */
const OUT_21_COBAN = out("$ aws s3 mb s3://labflow-anh\nmake_bucket: labflow-anh\n$ aws s3 cp /aws/phong-a1.jpg s3://labflow-anh/uploads/2026/11/phong-a1.jpg\n\rupload: ./phong-a1.jpg to s3://labflow-anh/uploads/2026/11/phong-a1.jpg\n$ aws s3 cp /aws/phong-b2.jpg s3://labflow-anh/uploads/2026/11/phong-b2.jpg\n\rupload: ./phong-b2.jpg to s3://labflow-anh/uploads/2026/11/phong-b2.jpg\n$ aws s3 cp /aws/luong.csv s3://labflow-anh/bi-mat/luong.csv\n\rupload: ./luong.csv to s3://labflow-anh/bi-mat/luong.csv\n$ aws s3 ls s3://labflow-anh/\n                           PRE bi-mat/\n                           PRE uploads/\n$ aws s3 ls s3://labflow-anh/ --recursive\n2026-11-19 06:40:28         22 bi-mat/luong.csv\n2026-11-19 06:40:23         17 uploads/2026/11/phong-a1.jpg\n2026-11-19 06:40:26         17 uploads/2026/11/phong-b2.jpg\n$ aws s3api list-objects-v2 --bucket labflow-anh --prefix uploads/2026/ --delimiter / --query 'CommonPrefixes[].Prefix' --output text\nuploads/2026/11/\n$ aws s3api put-object --bucket labflow-anh --key thu-muc-rong/ --query ETag --output text\n\"d41d8cd98f00b204e9800998ecf8427e\"\n$ aws s3api list-objects-v2 --bucket labflow-anh --query 'Contents[].[Key,Size]' --output text\nbi-mat/luong.csv\t22\nthu-muc-rong/\t0\nuploads/2026/11/phong-a1.jpg\t17\nuploads/2026/11/phong-b2.jpg\t17");
const OUT_21_OBJECT = out("$ aws s3api put-object --bucket labflow-anh --key uploads/2026/11/the-sv.jpg --body /aws/phong-a1.jpg --content-type image/jpeg --metadata nguoi-tai=an-dev,phong=A1 --query ETag --output text\n\"71d813741b0e0321aa406b74be9e89ba\"\n$ aws s3api head-object --bucket labflow-anh --key uploads/2026/11/the-sv.jpg --query '{Size:ContentLength,Type:ContentType,ETag:ETag,SSE:ServerSideEncryption,Meta:Metadata}'\n{\n    \"Size\": 17,\n    \"Type\": \"image/jpeg\",\n    \"ETag\": \"\\\"71d813741b0e0321aa406b74be9e89ba\\\"\",\n    \"SSE\": \"AES256\",\n    \"Meta\": {\n        \"nguoi-tai\": \"an-dev\",\n        \"phong\": \"A1\"\n    }\n}\n$ aws s3 mv s3://labflow-anh/uploads/2026/11/the-sv.jpg s3://labflow-anh/uploads/2026/11/the-sv-an.jpg\n\rmove: s3://labflow-anh/uploads/2026/11/the-sv.jpg to s3://labflow-anh/uploads/2026/11/the-sv-an.jpg\n$ aws s3 cp /aws/video-gioi-thieu.mp4 s3://labflow-anh/video/gioi-thieu.mp4\n\rupload: ./video-gioi-thieu.mp4 to s3://labflow-anh/video/gioi-thieu.mp4\n$ aws s3api head-object --bucket labflow-anh --key video/gioi-thieu.mp4 --query '[ContentLength,ETag]' --output text\n20000000\t\"12aa2a8ccd6df880569ebac49b1b8c8d-3\"\n$ aws s3 mb s3://LabFlow_Anh\nmake_bucket failed: s3://LabFlow_Anh An error occurred (InvalidBucketName) when calling the CreateBucket operation: The specified bucket is not valid.\n$ aws s3 mb s3://labflow-anh\nmake_bucket failed: s3://labflow-anh An error occurred (BucketAlreadyOwnedByYou) when calling the CreateBucket operation: Your previous request to create the named bucket succeeded and you already own it.");
const OUT_22_GIA = out("$ node gia.mjs\nKịch bản          Lưu GB  Ra Internet GB     S3 USD    R2 USD\nLabFlow nhỏ           20              30       0.95      0.71\nKho ảnh vừa          200            2000     237.50      7.05\nVideo công khai     2000           50000    6058.50     48.45");
const OUT_22_MOTMA = out("$ node mot-ma.mjs\nlocalstack server=TwistedWeb/24.3.0\n           uploads/2026/11/phong-a1.jpg (17 B), uploads/2026/11/phong-b2.jpg (17 B), uploads/2026/11/the-sv-an.jpg (17 B), uploads/phong-a2.jpg (12 B)\nversitygw  server=VERSITYGW\n           uploads/phong-a2.jpg (12 B)");
const OUT_22_TRANG = out("$ node trang.mjs\nĐọc 1 lượt : 1000 khoá · IsTruncated = true\nĐi hết trang: 1005 khoá sau 2 lượt gọi");
const OUT_23_MAHOA = out("$ aws s3api get-bucket-encryption --bucket labflow-anh --query 'ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault' --output json\n{\n    \"SSEAlgorithm\": \"AES256\"\n}\n$ aws s3api head-object --bucket labflow-anh --key bi-mat/luong.csv --query ServerSideEncryption --output text\nAES256");
const OUT_23_QUYEN = out("$ S3=http://127.0.0.1:44568      # cổng S3 cục bộ (versitygw) — curl KHÔNG có khoá = người lạ trên Internet\n$ curl -s $S3/labflow-anh/uploads/phong-a1.jpg\nHTTP 403 · AccessDenied\n$ curl -s $S3/labflow-anh?list-type=2\nHTTP 403 · AccessDenied\n$ aws s3api get-bucket-ownership-controls --bucket labflow-anh --query 'OwnershipControls.Rules[0].ObjectOwnership' --output text\nBucketOwnerEnforced\n$ aws s3api put-bucket-acl --bucket labflow-anh --acl public-read\nAn error occurred (AccessControlListNotSupported) when calling the PutBucketAcl operation: The bucket does not allow ACLs.\n$ aws s3api put-bucket-policy --bucket labflow-anh --policy file://cong-khai-anh.json\n$ curl -s $S3/labflow-anh/uploads/phong-a1.jpg\nHTTP 200 · anh phong lab A1\n$ curl -s $S3/labflow-anh/bi-mat/luong.csv\nHTTP 403 · AccessDenied\n$ curl -s $S3/labflow-anh?list-type=2\nHTTP 403 · AccessDenied\n$ aws s3api get-bucket-policy-status --bucket labflow-anh --query PolicyStatus.IsPublic --output text\nTrue");
const OUT_23_SAI = out("$ aws s3api put-bucket-policy --bucket labflow-anh --policy file://sai.json\n$ curl -s $S3/labflow-anh?list-type=2\nHTTP 200 · bi-mat/luong.csv uploads/phong-a1.jpg uploads/phong-a2.jpg\n$ curl -s $S3/labflow-anh/bi-mat/luong.csv\nHTTP 200 · ten,luong ⏎ an,15000000\n$ aws s3api put-bucket-policy --bucket labflow-anh --policy file://chan-bi-mat.json\n$ curl -s $S3/labflow-anh/bi-mat/luong.csv\nHTTP 403 · AccessDenied\n$ curl -s $S3/labflow-anh/uploads/phong-a1.jpg\nHTTP 200 · anh phong lab A1\n$ aws s3api get-object --bucket labflow-anh --key bi-mat/luong.csv /aws/tai-ve.csv --query ContentLength --output text\n22\n$ aws s3api put-public-access-block --bucket labflow-anh --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\nAn error occurred (NotImplemented) when calling the PutPublicAccessBlock operation: A header you provided implies functionality that is not implemented");
const OUT_24_CORS = out("$ curl -si -X OPTIONS …/labflow-anh/uploads/x.jpg -H 'Origin: https://labflow.vn' -H 'Access-Control-Request-Method: PUT'\nHTTP/1.1 403 FORBIDDEN\nAccessForbidden\n$ aws s3api put-bucket-cors --bucket labflow-anh --cors-configuration file:///aws/cors.json\n$ curl -si -X OPTIONS …/labflow-anh/uploads/x.jpg -H 'Origin: https://labflow.vn' -H 'Access-Control-Request-Method: PUT'\nHTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://labflow.vn\nAccess-Control-Allow-Methods: PUT, POST\nAccess-Control-Allow-Headers: content-type\nAccess-Control-Max-Age: 600\n$ curl -si -X OPTIONS …/labflow-anh/uploads/x.jpg -H 'Origin: https://trang-la.example' -H 'Access-Control-Request-Method: PUT'\nHTTP/1.1 403 FORBIDDEN\nAccessForbidden");
const OUT_24_KYPUT = out("$ node ky-put.mjs\n[1] mặc định       : x-amz-checksum-crc32 = AAAAAA==\n[1] WHEN_REQUIRED  : x-amz-checksum-crc32 = null\n[2] ký host: X-Amz-SignedHeaders = host\n      PUT Content-Type: image/jpeg ⇒ 200\n      PUT Content-Type: text/html  ⇒ 200\n[2] ký host+content-type: X-Amz-SignedHeaders = content-type;host\n      PUT Content-Type: image/jpeg ⇒ 200\n      PUT Content-Type: text/html  ⇒ 403 SignatureDoesNotMatch");
const OUT_24_POST = out("$ node post.mjs\nTrường ký sẵn: Content-Type, bucket, X-Amz-Algorithm, X-Amz-Credential, X-Amz-Date, key, Policy, X-Amz-Signature\nPOST anh-nho.jpg    300 KB ⇒ 204\nPOST phim-to.jpg   3072 KB ⇒ 400 EntityTooLarge");
const OUT_24_PRESIGN = out("$ aws s3 presign s3://labflow-anh/uploads/2026/11/phong-a1.jpg --expires-in 5\nhttp://127.0.0.1:44566/labflow-anh/uploads/2026/11/phong-a1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\n  &X-Amz-Credential=test%2F20261119%2Fap-southeast-1%2Fs3%2Faws4_request\n  &X-Amz-Date=20261119T064245Z\n  &X-Amz-Expires=5\n  &X-Amz-SignedHeaders=host\n  &X-Amz-Signature=d050ae504d17f206cf4e73cae03308aa75f493220281b9f7c9c2fd0fed5ef1ff\n$ curl -s \"$URL\"\nanh phong lab A1\n$ curl -s \"${URL/phong-a1/phong-b2}\"   # đổi tên tệp trong URL\nSignatureDoesNotMatch The request signature we calculated does not match the signature you provided. Check your key and signing method.\n$ sleep 7; curl -s \"$URL\"\nCode=AccessDenied Message=Request has expired Expires=2026-11-19T06:42:50.000Z ServerTime=2026-11-19T06:42:53.000Z");
const OUT_25_CUU = out("$ aws s3api delete-object --bucket labflow-tai-lieu --key noi-quy.txt --version-id AaHyi6W4WbdbskYdK.1hqk.TEmkP_f3.\n{\n    \"DeleteMarker\": true,\n    \"VersionId\": \"AaHyi6W4WbdbskYdK.1hqk.TEmkP_f3.\"\n}\n$ aws s3 cp s3://labflow-tai-lieu/noi-quy.txt -\nnoi quy v2 (sua gio mo cua)\n$ aws s3api get-object --bucket labflow-tai-lieu --key noi-quy.txt --version-id AaHyi6W2kaLCOHVcCbsLT26oz1XHNEVC /aws/ban-cu.txt --query VersionId --output text\nAaHyi6W2kaLCOHVcCbsLT26oz1XHNEVC\n$ cat ban-cu.txt\nnoi quy v1");
const OUT_25_PHIENBAN = out("$ aws s3 mb s3://labflow-tai-lieu\nmake_bucket: labflow-tai-lieu\n$ aws s3api put-bucket-versioning --bucket labflow-tai-lieu --versioning-configuration Status=Enabled\n$ aws s3api put-object --bucket labflow-tai-lieu --key noi-quy.txt --body /aws/v1.txt --query VersionId --output text\nAaHyi6W2kaLCOHVcCbsLT26oz1XHNEVC\n$ aws s3api put-object --bucket labflow-tai-lieu --key noi-quy.txt --body /aws/v2.txt --query VersionId --output text\nAaHyi6W3_f5CqFlKWD_PjVqe418Iff03\n$ aws s3 rm s3://labflow-tai-lieu/noi-quy.txt\ndelete: s3://labflow-tai-lieu/noi-quy.txt\n$ aws s3 ls s3://labflow-tai-lieu/\n$ aws s3api list-object-versions --bucket labflow-tai-lieu --query 'Versions[].[VersionId,IsLatest,Size]' --output text\nAaHyi6W3_f5CqFlKWD_PjVqe418Iff03\tFalse\t28\nAaHyi6W2kaLCOHVcCbsLT26oz1XHNEVC\tFalse\t11\n$ aws s3api list-object-versions --bucket labflow-tai-lieu --query 'DeleteMarkers[].[VersionId,IsLatest]' --output text\nAaHyi6W4WbdbskYdK.1hqk.TEmkP_f3.\tTrue");
const OUT_25_VONGDOI = out("$ aws s3api put-bucket-lifecycle-configuration --bucket labflow-anh --lifecycle-configuration file:///aws/vong-doi.json\n{\n    \"TransitionDefaultMinimumObjectSize\": \"all_storage_classes_128K\"\n}\n$ aws s3api get-bucket-lifecycle-configuration --bucket labflow-anh --query 'Rules[].[ID,Status]' --output text\nxoa-tam-sau-1-ngay\tEnabled\nanh-cu-xuong-lanh\tEnabled\n$ aws s3api put-object --bucket labflow-anh --key tam/xem-truoc.jpg --body /aws/phong-a1.jpg --query Expiration --output text\nexpiry-date=\"Sat, 21 Nov 2026 00:00:00 GMT\", rule-id=\"xoa-tam-sau-1-ngay\"\n$ aws s3api put-object --bucket labflow-anh --key luu-tru/2024.zip --body /aws/v1.txt --storage-class GLACIER --query ETag --output text\n\"f10577dd2a83ee2fd53a318b12ac8e74\"\n$ aws s3 cp s3://labflow-anh/luu-tru/2024.zip -\ndownload failed: s3://labflow-anh/luu-tru/2024.zip to - An error occurred (InvalidObjectState) when calling the GetObject operation: The operation is not valid for the object's storage class\n$ aws s3api restore-object --bucket labflow-anh --key luu-tru/2024.zip --restore-request '{\"Days\":1,\"GlacierJobParameters\":{\"Tier\":\"Standard\"}}'\n$ aws s3api head-object --bucket labflow-anh --key luu-tru/2024.zip --query '[StorageClass,Restore]' --output text\nGLACIER\tongoing-request=\"false\", expiry-date=\"Sat, 21 Nov 2026 00:00:00 GMT\"");
const OUT_26_BOHOANG = out("$ aws s3 mb s3://labflow-ban-cai-dat\nmake_bucket: labflow-ban-cai-dat\n$ aws s3 cp /aws/cai.sh s3://labflow-ban-cai-dat/cai.sh\n\rupload: ./cai.sh to s3://labflow-ban-cai-dat/cai.sh\n$ curl -s http://127.0.0.1:44566/labflow-ban-cai-dat/cai.sh | sh      # script cài đặt cũ, chạy hằng đêm\ncai dat LabFlow agent v1.4\n$ aws s3 rb s3://labflow-ban-cai-dat --force\ndelete: s3://labflow-ban-cai-dat/cai.sh\nremove_bucket: labflow-ban-cai-dat\n# … vài tháng sau, NGƯỜI KHÁC tạo bucket trùng tên (tên bucket là toàn cầu, xoá rồi là ai cũng lấy được):\n$ aws s3 mb s3://labflow-ban-cai-dat\nmake_bucket: labflow-ban-cai-dat\n$ aws s3 cp /aws/cai-la.sh s3://labflow-ban-cai-dat/cai.sh\n\rupload: ./cai-la.sh to s3://labflow-ban-cai-dat/cai.sh\n$ curl -s http://127.0.0.1:44566/labflow-ban-cai-dat/cai.sh | sh\n!!! ma cua nguoi la chay tren may ban");
const OUT_26_QUET = out("$ ./quet.sh                      # đoán tên: labflow + hậu tố phổ biến, gửi ẩn danh\nlabflow  ⇒ 404 NoSuchBucket\nlabflow-dev  ⇒ 403 AccessDenied\nlabflow-test  ⇒ 404 NoSuchBucket\nlabflow-backup  ⇒ 200 MỞ: config/.env db/2026-11-18.sql.gz\nlabflow-logs  ⇒ 404 NoSuchBucket\nlabflow-anh  ⇒ 403 AccessDenied\nlabflow-uploads  ⇒ 404 NoSuchBucket\nlabflow-prod  ⇒ 404 NoSuchBucket\n$ curl -s $S3/labflow-backup/config/.env\nHTTP 200 · DB_PASSWORD=Labflow@2026 ⏎ AWS_ACCESS_KEY_ID=AKIAEXAMPLE0000000NN");
const OUT_26_TUKIEM = out("$ AWS=aws ./kiem-bucket.sh labflow-anh uploads/phong-a1.jpg\nliệt kê ẩn danh        : 403 ✓ bị chặn\nđọc ẩn danh uploads/phong-a1.jpg : 200 ✗ CÔNG KHAI\nPolicyStatus.IsPublic  : True\n$ AWS=aws ./kiem-bucket.sh labflow-backup config/.env\nliệt kê ẩn danh        : 200 ✗ AI CŨNG XEM ĐƯỢC DANH SÁCH\nđọc ẩn danh config/.env : 200 ✗ CÔNG KHAI\nPolicyStatus.IsPublic  : True");
const OUT_27_DON = out("$ aws s3api list-object-versions --bucket labflow-anh-an --query '[length(Versions || `[]`), length(DeleteMarkers || `[]`)]' --output text\n1\t0\n$ aws s3api delete-objects --bucket labflow-anh-an --delete file://xoa.json --query 'length(Deleted)'\n1\n$ aws s3 rb s3://labflow-anh-an\nremove_bucket: labflow-anh-an\n$ aws s3api list-buckets --query 'Buckets[].Name' --output text\n(rỗng = không còn bucket nào tính tiền lưu trữ)");
const OUT_27_SAU = out("$ ./loi-giai.sh\nđã dựng labflow-anh-an\n$ ./cham.sh\n✓ Block Public Access bật đủ 4 công tắc\n✓ Versioning = Enabled\n✓ Vòng đời: tam/ hết hạn sau 1 ngày\n✓ Vòng đời: dọn phần tải dở\n✓ CORS: labflow.vn được PUT\n✓ CORS: trang lạ bị từ chối\n✓ Policy có Deny khi không HTTPS\n✓ URL ký PUT khoá content-type\nĐIỂM: 8/8");
const OUT_27_TRUOC = out("$ aws s3 mb s3://labflow-anh-an          # bucket trơn, chưa cấu hình gì\nmake_bucket: labflow-anh-an\n$ ./cham.sh\n✓ Block Public Access bật đủ 4 công tắc\n✗ Versioning = Enabled\n✗ Vòng đời: tam/ hết hạn sau 1 ngày\n✗ Vòng đời: dọn phần tải dở\n✗ CORS: labflow.vn được PUT\n✓ CORS: trang lạ bị từ chối\n✗ Policy có Deny khi không HTTPS\n✓ URL ký PUT khoá content-type\nĐIỂM: 3/8");
const OUT_2X_DON = out("$ aws s3api list-buckets --query 'Buckets[].Name' --output text\nlabflow-anh\tlabflow-ban-cai-dat\tlabflow-nhat-ky\tlabflow-tai-lieu\n$ aws s3 rb s3://labflow-tai-lieu --force\ndelete: s3://labflow-tai-lieu/noi-quy.txt\nremove_bucket failed: s3://labflow-tai-lieu An error occurred (BucketNotEmpty) when calling the DeleteBucket operation: The bucket you tried to delete is not empty. You must delete all versions in the bucket.\n# bucket có versioning: phải xoá MỌI phiên bản + dấu xoá trước\n$ aws s3api list-object-versions --bucket labflow-tai-lieu --query '{Objects: [Versions[], DeleteMarkers[]][][].{Key: Key, VersionId: VersionId}}' --output json\n{\n    \"Objects\": [\n        {\n            \"Key\": \"noi-quy.txt\",\n            \"VersionId\": \"AaHyi6W3_f5CqFlKWD_PjVqe418Iff03\"\n        },\n        {\n            \"Key\": \"noi-quy.txt\",\n            \"VersionId\": \"AaHyi6W2kaLCOHVcCbsLT26oz1XHNEVC\"\n        },\n        {\n            \"Key\": \"noi-quy.txt\",\n            \"VersionId\": \"AaHyi6W5ymfzSyEdWDN0xi.KlMsGjDuC\"\n        }\n    ]\n}\n$ aws s3api delete-objects --bucket labflow-tai-lieu --delete file:///aws/xoa.json --query 'length(Deleted)'\n3\n$ aws s3 rb s3://labflow-tai-lieu\nremove_bucket: labflow-tai-lieu\n$ aws s3 rb s3://labflow-anh --force\nremove_bucket: labflow-anh\n$ aws s3 rb s3://labflow-nhat-ky --force\nremove_bucket: labflow-nhat-ky\n$ aws s3 rb s3://labflow-ban-cai-dat --force\nremove_bucket: labflow-ban-cai-dat\n$ aws s3api list-buckets --query 'Buckets[].Name' --output text");
const MA_CONG_KHAI = json("{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    { \"Sid\": \"AiCungXemAnh\", \"Effect\": \"Allow\", \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::labflow-anh/uploads/*\" }\n  ]\n}");
const MA_SAI = json("{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    { \"Sid\": \"ChoNhanh\", \"Effect\": \"Allow\", \"Principal\": \"*\",\n      \"Action\": [\"s3:GetObject\", \"s3:ListBucket\"],\n      \"Resource\": [\"arn:aws:s3:::labflow-anh\", \"arn:aws:s3:::labflow-anh/*\"] }\n  ]\n}");
const MA_CHAN_BI_MAT = json("{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    { \"Sid\": \"AiCungXemAnh\", \"Effect\": \"Allow\", \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::labflow-anh/uploads/*\" },\n    { \"Sid\": \"KhongAiNgoaiVaoBiMat\", \"Effect\": \"Deny\", \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::labflow-anh/bi-mat/*\" }\n  ]\n}");
const MA_CORS = json("{\n  \"CORSRules\": [\n    { \"AllowedOrigins\": [\"https://labflow.vn\"],\n      \"AllowedMethods\": [\"PUT\", \"POST\"],\n      \"AllowedHeaders\": [\"content-type\"],\n      \"MaxAgeSeconds\": 600 }\n  ]\n}");
const MA_VONG_DOI = json("{\n  \"Rules\": [\n    { \"ID\": \"xoa-tam-sau-1-ngay\", \"Status\": \"Enabled\",\n      \"Filter\": { \"Prefix\": \"tam/\" },\n      \"Expiration\": { \"Days\": 1 },\n      \"AbortIncompleteMultipartUpload\": { \"DaysAfterInitiation\": 1 } },\n    { \"ID\": \"anh-cu-xuong-lanh\", \"Status\": \"Enabled\",\n      \"Filter\": { \"Prefix\": \"uploads/\" },\n      \"Transitions\": [ { \"Days\": 30, \"StorageClass\": \"STANDARD_IA\" },\n                       { \"Days\": 180, \"StorageClass\": \"GLACIER_IR\" } ],\n      \"NoncurrentVersionExpiration\": { \"NoncurrentDays\": 30 } }\n  ]\n}");
const MA_CHI_HTTPS = json("{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    { \"Sid\": \"ChiHttps\", \"Effect\": \"Deny\", \"Principal\": \"*\", \"Action\": \"s3:*\",\n      \"Resource\": [\"arn:aws:s3:::labflow-anh-an\", \"arn:aws:s3:::labflow-anh-an/*\"],\n      \"Condition\": { \"Bool\": { \"aws:SecureTransport\": \"false\" } } }\n  ]\n}");
const MA_VONG_DOI_LAB = json("{\n  \"Rules\": [\n    { \"ID\": \"tam-1-ngay\", \"Status\": \"Enabled\", \"Filter\": { \"Prefix\": \"tam/\" },\n      \"Expiration\": { \"Days\": 1 },\n      \"AbortIncompleteMultipartUpload\": { \"DaysAfterInitiation\": 1 } },\n    { \"ID\": \"ban-cu-30-ngay\", \"Status\": \"Enabled\", \"Filter\": {},\n      \"NoncurrentVersionExpiration\": { \"NoncurrentDays\": 30 } }\n  ]\n}");

/* ═════ 2.1 — Bucket và object ═════ */
const L21_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 1</span>
<h2>2.1 — S3 buckets and objects: storage with no folders</h2>
<p class="lead">Amazon S3 (Simple Storage Service, launched in March 2006) is where most of the Internet keeps its files: user avatars, product photos, invoices, backups, logs, static websites, data lakes. Your backend will almost certainly talk to it — and if you have used cuongthai.com, you already rely on its twin: the site stores every image and video in Cloudflare R2, which speaks exactly the S3 protocol. This lesson builds the right mental model first, because most S3 mistakes come from imagining it is a hard disk.</p>

<h3>The coat-check metaphor</h3>
<p>Think of the coat check in a theatre. You hand over a bag (the <strong>object</strong>), you get a ticket with a number (the <strong>key</strong>), and the bag goes into a cloakroom (the <strong>bucket</strong>). Later you show the ticket and get the whole bag back. You cannot ask the attendant to “change one sock inside the bag” — you take the bag, change it, and hand in a new one. There are no shelves you can name, only ticket numbers; if your tickets look like <code>uploads/2026/11/a1.jpg</code>, that is just a long number with slashes in it.</p>

<h3>Three kinds of storage</h3>
<table>
  <thead><tr><th></th><th>Block (EBS)</th><th>File (EFS)</th><th>Object (S3)</th></tr></thead>
  <tbody>
    <tr><td>Looks like</td><td>A raw disk attached to one machine</td><td>A shared network folder</td><td>A key → value store over HTTP</td></tr>
    <tr><td>You change</td><td>Any byte in place</td><td>Any byte in place</td><td>The whole object (write a new one)</td></tr>
    <tr><td>Reached by</td><td>One EC2 instance (mostly)</td><td>Many machines via NFS</td><td>Anything that can send an HTTPS request</td></tr>
    <tr><td>Typical use</td><td>OS disk, database files</td><td>Shared home dirs, legacy apps</td><td>Uploads, media, backups, logs, static sites</td></tr>
    <tr><td>Size limit</td><td>Volume size you pay for</td><td>Grows automatically</td><td>Practically unlimited; one object up to 48.8 TiB</td></tr>
  </tbody>
</table>
<p>Rule of thumb for a backend developer: <strong>a database stores rows, S3 stores files, and the database row stores the S3 key</strong>. Never put image bytes in PostgreSQL “because it is easier”; never put a database in S3.</p>

<h3>Buckets</h3>
<ul>
  <li><strong>The name is global.</strong> General purpose buckets live in one shared namespace per partition: if anyone in the world owns <code>labflow-anh</code>, you cannot create it. Rules: 3–63 characters, lowercase letters, digits, hyphens and dots, start and end with a letter or digit. Underscores and capitals are rejected (you will see <code>InvalidBucketName</code> below).</li>
  <li><strong>A bucket lives in one region</strong> you choose at creation; its data never leaves that region unless you copy it. Pick the region close to your users (Singapore <code>ap-southeast-1</code> for Vietnam).</li>
  <li><strong>Deleting a bucket frees the name for anyone.</strong> Lesson 2.6 shows why this is a security problem, and AWS now offers an <em>account regional namespace</em>: names ending in <code>-&lt;account-id&gt;-&lt;region&gt;-an</code> that only your account can create.</li>
  <li>A bucket costs nothing by itself; you pay for stored GB, requests and data leaving AWS.</li>
</ul>

<h3>Objects</h3>
<ul>
  <li><strong>Key</strong> — the full name, up to 1,024 bytes of UTF-8, e.g. <code>uploads/2026/11/phong-a1.jpg</code>.</li>
  <li><strong>Data</strong> — the bytes. One PUT carries up to 5 GB; bigger files go through <em>multipart upload</em> (parts of 5 MiB–5 GiB, up to 10,000 parts, object up to 48.8 TiB). AWS recommends multipart from about 100 MB.</li>
  <li><strong>Metadata</strong> — system metadata (<code>Content-Type</code>, <code>Content-Length</code>, encryption) and your own headers <code>x-amz-meta-*</code>. Metadata cannot be edited in place: changing it means copying the object onto itself.</li>
  <li><strong>ETag</strong> — for a simple upload it is the MD5 of the bytes; for a multipart upload it ends in <code>-N</code> (N = number of parts), so it is <em>not</em> an MD5 of the file.</li>
  <li><strong>Storage class</strong> and, when versioning is on, a <strong>version ID</strong> (lesson 2.5).</li>
</ul>

<h3>See it running: bucket, prefixes and the “folder” that is not one</h3>
<p>Every command in this chapter ran for real on 19/11/2026 against LocalStack 4.12 with signature checking switched on (<code>S3_SKIP_SIGNATURE_VALIDATION=0</code>), using the real AWS CLI 2.41.0. The S3 API is identical on AWS; only the endpoint differs.</p>
${OUT_21_COBAN}
<p>Read it slowly:</p>
<ul>
  <li><code>aws s3 ls</code> shows <code>PRE bi-mat/</code> — “PRE” means <em>prefix</em>. S3 computed it by cutting keys at the delimiter <code>/</code>. Nothing called “folder” exists.</li>
  <li><code>list-objects-v2 --prefix uploads/2026/ --delimiter /</code> is exactly what the console does when you “open a folder”: it asks for keys with that prefix and groups the rest.</li>
  <li>The console's “Create folder” button creates a zero-byte object whose key ends in <code>/</code>. Its ETag <code>d41d8cd98f00b204e9800998ecf8427e</code> is the MD5 of nothing — a well-known value worth recognising in logs.</li>
</ul>

<h3>Metadata, ETag, “rename” and the name rules</h3>
${OUT_21_OBJECT}
<ul>
  <li>The object came back with <code>SSE: AES256</code> although we never asked: since 5 January 2023 S3 encrypts every new object at rest by default (SSE-S3). Lesson 2.3 covers the KMS variant.</li>
  <li><code>aws s3 mv</code> printed “move”, but S3 has no rename: the CLI did a <strong>copy + delete</strong>. On a million objects that is two million requests and, for big objects, real time.</li>
  <li>The 20 MB video was cut by the CLI into 8 MB parts (its default threshold and chunk size), so the ETag ends in <code>-3</code>.</li>
  <li><code>LabFlow_Anh</code> failed the naming rules; creating <code>labflow-anh</code> twice told us we already own it. On real AWS, a name owned by <em>someone else</em> returns <code>BucketAlreadyExists</code>.</li>
</ul>

<h3>Consistency and durability — the numbers interviewers expect</h3>
<ul>
  <li><strong>Strong read-after-write consistency</strong> for every PUT, overwrite, DELETE and LIST, since December 2020. Older blog posts that say “eventually consistent” are outdated.</li>
  <li><strong>Durability 99.999999999 % (11 nines)</strong> — data is stored across at least three Availability Zones for the Standard class. Losing data to hardware is practically impossible; losing it to <em>your own delete command</em> is very possible (lesson 2.5).</li>
  <li><strong>Availability 99.99 %</strong> designed for Standard. Durability is “will my bytes survive”, availability is “can I read them right now”.</li>
</ul>

<h3>Two CLIs in one: <code>aws s3</code> and <code>aws s3api</code></h3>
<table>
  <thead><tr><th><code>aws s3</code> (high level)</th><th><code>aws s3api</code> (one call = one API operation)</th></tr></thead>
  <tbody>
    <tr><td><code>cp</code>, <code>mv</code>, <code>sync</code>, <code>rm --recursive</code>, <code>ls</code>, <code>mb</code>, <code>rb --force</code>, <code>presign</code></td><td><code>put-object</code>, <code>get-object</code>, <code>head-object</code>, <code>list-objects-v2</code>, <code>put-bucket-policy</code>, <code>put-bucket-versioning</code>…</td></tr>
    <tr><td>Handles multipart and many files for you</td><td>Every option of the API, exact error names, JSON output for <code>--query</code></td></tr>
    <tr><td>Daily copying and syncing</td><td>Configuration, debugging, scripts that must be precise</td></tr>
  </tbody>
</table>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> Google Photos does not ask where on a disk your picture lives. You get a link and an album label — that is a key and a prefix.</li>
  <li><strong>At work:</strong> design keys before the first upload. A key such as <code>tenant/42/avatars/&lt;uuid&gt;.jpg</code> lets you grant access per tenant with one policy line and delete a customer's data with one prefix. Keys built from the original file name (<code>CV final (2).pdf</code>) leak personal data into URLs and collide.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“Does S3 have folders?”</strong> — No. Keys are flat strings; the console and the <code>--delimiter</code> parameter group them by a separator to look like folders. A “folder” object is just a zero-byte key ending in <code>/</code>.</li>
  <li><strong>“How do you upload a 10 GB file?”</strong> — Multipart upload: parts of 5 MiB–5 GiB uploaded in parallel and retried individually, then completed. The SDK and CLI do it automatically above a threshold. Add a lifecycle rule to abort incomplete uploads, or their parts are billed forever (lesson 2.5).</li>
  <li><strong>“Can I use the ETag to verify the file?”</strong> — Only for single-part uploads, where it equals the MD5. For integrity checks use the checksum headers (CRC32, CRC64NVME, SHA-256) that S3 stores and validates.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Start LocalStack (lesson 0.4) and create a bucket named after you, then try one name with a capital letter.</li>
  <li>Upload three files under two different prefixes and one file larger than 20 MB.</li>
  <li>List with and without <code>--recursive</code>, then with <code>s3api list-objects-v2 --delimiter /</code>.</li>
  <li>Add your own metadata <code>x-amz-meta-owner</code> and read it back with <code>head-object</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show the <code>InvalidBucketName</code> error, an ETag ending in <code>-N</code> on the big file, your custom metadata in <code>head-object</code>, and explain why <code>mv</code> costs two requests.</p>
${giai('Hint: commands', bash(`
aws s3 mb s3://ten-cua-ban-lab
head -c 20000000 /dev/urandom > big.bin && aws s3 cp big.bin s3://ten-cua-ban-lab/video/big.bin
aws s3api list-objects-v2 --bucket ten-cua-ban-lab --delimiter / --query 'CommonPrefixes[].Prefix'
aws s3api put-object --bucket ten-cua-ban-lab --key a/x.txt --body x.txt --metadata owner=ban
aws s3api head-object --bucket ten-cua-ban-lab --key a/x.txt --query Metadata`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">A container of objects in one region; globally unique name (general purpose).</span></div>
  <div class="kv"><span class="k">Object / key</span><span class="v">Bytes + metadata stored under a full string name (the key).</span></div>
  <div class="kv"><span class="k">Prefix / delimiter</span><span class="v">How S3 groups flat keys so they look like folders.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">Entity tag; MD5 for single-part uploads, “-N” suffix for multipart.</span></div>
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Upload in parts (5 MiB–5 GiB, ≤ 10,000), then complete; needed above 5 GB.</span></div>
  <div class="kv"><span class="k">11 nines</span><span class="v">Designed durability 99.999999999 % across ≥ 3 AZs (Standard).</span></div>
  <div class="kv"><span class="k">Strong consistency</span><span class="v">A read after a successful write always sees that write (since 12/2020).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>S3 is object storage: whole objects behind keys, over HTTPS — not a disk.</li>
  <li>Bucket names are global and freed on delete; a bucket lives in one region.</li>
  <li>Folders are an illusion made from prefixes; “rename” is copy + delete.</li>
  <li>New objects are encrypted by default; reads are strongly consistent; durability is 11 nines.</li>
  <li><code>aws s3</code> for daily copying, <code>aws s3api</code> for precise configuration and debugging.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html', '🏷️', 'AWS docs — General purpose bucket naming rules', 'Every rule behind InvalidBucketName.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html', '🌐', 'AWS docs — Namespaces for general purpose buckets', 'Global namespace vs the new account regional namespace.')}

<h3>Sources</h3>
<ul>
  <li>Naming rules: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html</a></li>
  <li>Bucket namespaces: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html</a></li>
  <li>Multipart limits (48.8 TiB, 10,000 parts, 5 MiB–5 GiB): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html</a></li>
  <li>Strong consistency (01/12/2020): <a href="https://aws.amazon.com/blogs/aws/amazon-s3-update-strong-read-after-write-consistency/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/amazon-s3-update-strong-read-after-write-consistency/</a></li>
  <li>Default encryption (05/01/2023): <a href="https://aws.amazon.com/blogs/aws/amazon-s3-encrypts-new-objects-by-default/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/amazon-s3-encrypts-new-objects-by-default/</a></li>
  <li>Storage classes, durability and availability: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html</a></li>
</ul>
</div>
`;

const L21_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 1</span>
<h2>2.1 — Bucket và object S3: kho lưu trữ không có thư mục</h2>
<p class="lead">Amazon S3 (Simple Storage Service, ra mắt tháng 3/2006) là nơi phần lớn Internet cất tệp: ảnh đại diện, ảnh sản phẩm, hoá đơn, bản sao lưu, log, web tĩnh, kho dữ liệu. Backend của bạn gần như chắc chắn sẽ nói chuyện với nó — và nếu bạn đã dùng cuongthai.com, bạn đang dựa vào “anh em sinh đôi” của nó: web lưu mọi ảnh và video trên Cloudflare R2, thứ nói đúng giao thức S3. Bài này dựng đúng hình dung trước tiên, vì phần lớn lỗi S3 sinh ra từ việc tưởng nó là ổ cứng.</p>

<h3>Hình dung: quầy gửi đồ</h3>
<p>Nghĩ tới quầy gửi đồ ở siêu thị. Bạn đưa một túi đồ (<strong>object</strong>), nhận một tấm vé có số (<strong>key</strong>), túi được cất vào kho (<strong>bucket</strong>). Lúc về, đưa vé là nhận lại cả túi. Bạn không thể nhờ nhân viên “đổi một chiếc tất trong túi” — bạn lấy túi ra, đổi, rồi gửi túi mới. Không có kệ nào được đặt tên, chỉ có số vé; nếu vé của bạn trông như <code>uploads/2026/11/a1.jpg</code> thì đó chỉ là một con số dài có dấu gạch chéo.</p>

<h3>Ba kiểu lưu trữ</h3>
<table>
  <thead><tr><th></th><th>Khối (EBS)</th><th>Tệp (EFS)</th><th>Object (S3)</th></tr></thead>
  <tbody>
    <tr><td>Trông như</td><td>Ổ đĩa thô gắn vào một máy</td><td>Thư mục mạng dùng chung</td><td>Kho khoá → giá trị qua HTTP</td></tr>
    <tr><td>Bạn sửa</td><td>Bất kỳ byte nào tại chỗ</td><td>Bất kỳ byte nào tại chỗ</td><td>Cả object (ghi object mới)</td></tr>
    <tr><td>Ai với tới</td><td>Một máy EC2 (chủ yếu)</td><td>Nhiều máy qua NFS</td><td>Mọi thứ gửi được yêu cầu HTTPS</td></tr>
    <tr><td>Dùng cho</td><td>Ổ hệ điều hành, tệp CSDL</td><td>Thư mục chung, ứng dụng cũ</td><td>Tệp tải lên, media, sao lưu, log, web tĩnh</td></tr>
    <tr><td>Giới hạn cỡ</td><td>Cỡ ổ bạn trả tiền</td><td>Tự lớn dần</td><td>Gần như vô hạn; một object tới 48,8 TiB</td></tr>
  </tbody>
</table>
<p>Luật nhớ cho dev backend: <strong>CSDL lưu dòng, S3 lưu tệp, và dòng trong CSDL lưu key S3</strong>. Đừng nhét byte ảnh vào PostgreSQL “cho tiện”; đừng đặt CSDL lên S3.</p>

<h3>Bucket</h3>
<ul>
  <li><strong>Tên là toàn cầu.</strong> Bucket general purpose nằm chung một không gian tên cho mỗi partition: nếu ai đó trên thế giới đã có <code>labflow-anh</code>, bạn không tạo được. Luật: 3–63 ký tự, chữ thường, số, gạch nối và dấu chấm, đầu và cuối là chữ hoặc số. Gạch dưới và chữ hoa bị từ chối (bạn sẽ thấy <code>InvalidBucketName</code> bên dưới).</li>
  <li><strong>Bucket nằm ở một region</strong> chọn lúc tạo; dữ liệu không rời region đó trừ khi bạn chép đi. Chọn region gần người dùng (Singapore <code>ap-southeast-1</code> cho Việt Nam).</li>
  <li><strong>Xoá bucket là trả tên cho cả thế giới.</strong> Bài 2.6 chỉ ra vì sao đây là lỗ hổng bảo mật, và AWS nay có <em>không gian tên theo tài khoản + region</em>: tên kết thúc bằng <code>-&lt;số-tài-khoản&gt;-&lt;region&gt;-an</code> mà chỉ tài khoản của bạn tạo được.</li>
  <li>Bản thân bucket không tốn tiền; bạn trả theo GB lưu, số request và dữ liệu đi ra khỏi AWS.</li>
</ul>

<h3>Object</h3>
<ul>
  <li><strong>Key</strong> — tên đầy đủ, tối đa 1.024 byte UTF-8, ví dụ <code>uploads/2026/11/phong-a1.jpg</code>.</li>
  <li><strong>Dữ liệu</strong> — các byte. Một lệnh PUT chở tối đa 5 GB; tệp lớn hơn đi qua <em>multipart upload</em> (mỗi phần 5 MiB–5 GiB, tối đa 10.000 phần, object tới 48,8 TiB). AWS khuyên dùng multipart từ khoảng 100 MB.</li>
  <li><strong>Metadata</strong> — metadata hệ thống (<code>Content-Type</code>, <code>Content-Length</code>, mã hoá) và header riêng của bạn <code>x-amz-meta-*</code>. Không sửa metadata tại chỗ được: muốn đổi phải chép object đè lên chính nó.</li>
  <li><strong>ETag</strong> — với tải lên một lượt, nó là MD5 của dữ liệu; với multipart nó có đuôi <code>-N</code> (N = số phần), nên <em>không</em> phải MD5 của tệp.</li>
  <li><strong>Lớp lưu trữ</strong> và, khi bật versioning, <strong>version ID</strong> (bài 2.5).</li>
</ul>

<h3>Xem chạy thật: bucket, tiền tố và “thư mục” không có thật</h3>
<p>Mọi lệnh trong chương này chạy thật ngày 19/11/2026 trên LocalStack 4.12 có bật kiểm chữ ký (<code>S3_SKIP_SIGNATURE_VALIDATION=0</code>), bằng AWS CLI 2.41.0 thật. API S3 giống hệt trên AWS; chỉ khác địa chỉ endpoint.</p>
${OUT_21_COBAN}
<p>Đọc chậm từng dòng:</p>
<ul>
  <li><code>aws s3 ls</code> hiện <code>PRE bi-mat/</code> — “PRE” là <em>prefix</em> (tiền tố). S3 tính ra nó bằng cách cắt key ở dấu phân cách <code>/</code>. Không có thứ gì tên là “thư mục”.</li>
  <li><code>list-objects-v2 --prefix uploads/2026/ --delimiter /</code> chính là việc console làm khi bạn “mở thư mục”: hỏi các key có tiền tố đó rồi gom phần còn lại.</li>
  <li>Nút “Create folder” của console tạo một object 0 byte có key kết thúc bằng <code>/</code>. ETag <code>d41d8cd98f00b204e9800998ecf8427e</code> là MD5 của chuỗi rỗng — một giá trị nên nhận ra khi đọc log.</li>
</ul>

<h3>Metadata, ETag, “đổi tên” và luật đặt tên</h3>
${OUT_21_OBJECT}
<ul>
  <li>Object trả về <code>SSE: AES256</code> dù ta không yêu cầu: từ 05/01/2023 S3 mặc định mã hoá mọi object mới khi lưu (SSE-S3). Bài 2.3 nói về biến thể KMS.</li>
  <li><code>aws s3 mv</code> in chữ “move”, nhưng S3 không có đổi tên: CLI làm <strong>chép + xoá</strong>. Với một triệu object là hai triệu request, và với object lớn là thời gian thật.</li>
  <li>Video 20 MB được CLI cắt thành phần 8 MB (ngưỡng và cỡ phần mặc định), nên ETag có đuôi <code>-3</code>.</li>
  <li><code>LabFlow_Anh</code> trượt luật đặt tên; tạo <code>labflow-anh</code> lần hai thì S3 báo ta đã sở hữu nó. Trên AWS thật, tên do <em>người khác</em> giữ sẽ trả <code>BucketAlreadyExists</code>.</li>
</ul>

<h3>Nhất quán và độ bền — những con số phỏng vấn viên chờ nghe</h3>
<ul>
  <li><strong>Nhất quán mạnh đọc-sau-ghi</strong> cho mọi PUT, ghi đè, DELETE và LIST, từ tháng 12/2020. Bài blog cũ nói “nhất quán cuối cùng” là đã lỗi thời.</li>
  <li><strong>Độ bền 99,999999999 % (11 số 9)</strong> — lớp Standard lưu dữ liệu trên ít nhất ba Availability Zone. Mất dữ liệu vì phần cứng gần như không thể; mất vì <em>chính lệnh xoá của bạn</em> thì rất có thể (bài 2.5).</li>
  <li><strong>Độ sẵn sàng 99,99 %</strong> theo thiết kế cho Standard. Độ bền là “byte của tôi có sống sót không”, độ sẵn sàng là “tôi đọc được ngay lúc này không”.</li>
</ul>

<h3>Hai CLI trong một: <code>aws s3</code> và <code>aws s3api</code></h3>
<table>
  <thead><tr><th><code>aws s3</code> (mức cao)</th><th><code>aws s3api</code> (một lệnh = một thao tác API)</th></tr></thead>
  <tbody>
    <tr><td><code>cp</code>, <code>mv</code>, <code>sync</code>, <code>rm --recursive</code>, <code>ls</code>, <code>mb</code>, <code>rb --force</code>, <code>presign</code></td><td><code>put-object</code>, <code>get-object</code>, <code>head-object</code>, <code>list-objects-v2</code>, <code>put-bucket-policy</code>, <code>put-bucket-versioning</code>…</td></tr>
    <tr><td>Tự lo multipart và nhiều tệp</td><td>Đủ mọi tuỳ chọn của API, tên lỗi chính xác, JSON cho <code>--query</code></td></tr>
    <tr><td>Chép, đồng bộ hằng ngày</td><td>Cấu hình, gỡ lỗi, script cần chính xác</td></tr>
  </tbody>
</table>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> Google Photos không hỏi ảnh của bạn nằm ở đâu trên đĩa. Bạn có một liên kết và một nhãn album — đó là key và tiền tố.</li>
  <li><strong>Đi làm:</strong> thiết kế key trước lần tải lên đầu tiên. Key như <code>tenant/42/avatars/&lt;uuid&gt;.jpg</code> cho phép cấp quyền theo từng khách bằng một dòng policy và xoá dữ liệu một khách bằng một tiền tố. Key dựng từ tên tệp gốc (<code>CV final (2).pdf</code>) làm lộ dữ liệu cá nhân trong URL và dễ trùng nhau.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“S3 có thư mục không?”</strong> — Không. Key là chuỗi phẳng; console và tham số <code>--delimiter</code> gom chúng theo dấu phân cách cho giống thư mục. Object “thư mục” chỉ là key 0 byte kết thúc bằng <code>/</code>.</li>
  <li><strong>“Tải tệp 10 GB lên thế nào?”</strong> — Multipart upload: các phần 5 MiB–5 GiB tải song song, hỏng phần nào thử lại phần đó, rồi “complete”. SDK và CLI tự làm khi vượt ngưỡng. Thêm luật vòng đời huỷ phần tải dở, không thì các phần đó bị tính tiền mãi (bài 2.5).</li>
  <li><strong>“Dùng ETag để kiểm tệp được không?”</strong> — Chỉ với tải lên một lượt, khi nó bằng MD5. Muốn kiểm toàn vẹn thì dùng header checksum (CRC32, CRC64NVME, SHA-256) mà S3 lưu và kiểm.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Bật LocalStack (bài 0.4), tạo một bucket mang tên bạn, rồi thử một tên có chữ hoa.</li>
  <li>Tải ba tệp vào hai tiền tố khác nhau và một tệp lớn hơn 20 MB.</li>
  <li>Liệt kê có và không có <code>--recursive</code>, rồi bằng <code>s3api list-objects-v2 --delimiter /</code>.</li>
  <li>Thêm metadata riêng <code>x-amz-meta-owner</code> và đọc lại bằng <code>head-object</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được lỗi <code>InvalidBucketName</code>, ETag có đuôi <code>-N</code> ở tệp lớn, metadata riêng trong <code>head-object</code>, và giải thích được vì sao <code>mv</code> tốn hai request.</p>
${giai('Gợi ý: các lệnh', bash(`
aws s3 mb s3://ten-cua-ban-lab
head -c 20000000 /dev/urandom > big.bin && aws s3 cp big.bin s3://ten-cua-ban-lab/video/big.bin
aws s3api list-objects-v2 --bucket ten-cua-ban-lab --delimiter / --query 'CommonPrefixes[].Prefix'
aws s3api put-object --bucket ten-cua-ban-lab --key a/x.txt --body x.txt --metadata owner=ban
aws s3api head-object --bucket ten-cua-ban-lab --key a/x.txt --query Metadata`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">Nơi chứa object ở một region; tên duy nhất toàn cầu (general purpose).</span></div>
  <div class="kv"><span class="k">Object / key</span><span class="v">Dữ liệu + metadata lưu dưới một tên chuỗi đầy đủ (key).</span></div>
  <div class="kv"><span class="k">Prefix / delimiter</span><span class="v">Cách S3 gom key phẳng cho trông như thư mục.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">Thẻ phiên bản nội dung; MD5 khi tải một lượt, đuôi “-N” khi multipart.</span></div>
  <div class="kv"><span class="k">Multipart upload</span><span class="v">Tải theo phần (5 MiB–5 GiB, ≤ 10.000) rồi ghép; bắt buộc khi trên 5 GB.</span></div>
  <div class="kv"><span class="k">11 số 9</span><span class="v">Độ bền thiết kế 99,999999999 % trên ≥ 3 AZ (Standard).</span></div>
  <div class="kv"><span class="k">Nhất quán mạnh</span><span class="v">Đọc sau một lần ghi thành công luôn thấy lần ghi đó (từ 12/2020).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>S3 là kho object: nguyên object sau một key, qua HTTPS — không phải ổ đĩa.</li>
  <li>Tên bucket là toàn cầu và được trả lại khi xoá; bucket nằm ở một region.</li>
  <li>Thư mục là ảo giác dựng từ tiền tố; “đổi tên” là chép + xoá.</li>
  <li>Object mới mặc định được mã hoá; đọc nhất quán mạnh; độ bền 11 số 9.</li>
  <li><code>aws s3</code> để chép hằng ngày, <code>aws s3api</code> để cấu hình và gỡ lỗi chính xác.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html', '🏷️', 'AWS docs — Luật đặt tên bucket general purpose', 'Mọi luật đứng sau lỗi InvalidBucketName.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html', '🌐', 'AWS docs — Không gian tên của bucket', 'Không gian tên toàn cầu và không gian tên theo tài khoản + region.')}

<h3>Nguồn</h3>
<ul>
  <li>Luật đặt tên: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html</a></li>
  <li>Không gian tên bucket: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html</a></li>
  <li>Giới hạn multipart (48,8 TiB, 10.000 phần, 5 MiB–5 GiB): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html</a></li>
  <li>Nhất quán mạnh (01/12/2020): <a href="https://aws.amazon.com/blogs/aws/amazon-s3-update-strong-read-after-write-consistency/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/amazon-s3-update-strong-read-after-write-consistency/</a></li>
  <li>Mã hoá mặc định (05/01/2023): <a href="https://aws.amazon.com/blogs/aws/amazon-s3-encrypts-new-objects-by-default/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/amazon-s3-encrypts-new-objects-by-default/</a></li>
  <li>Lớp lưu trữ, độ bền, độ sẵn sàng: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html</a></li>
</ul>
</div>
`;

/* ═════ 2.2 — Giao thức S3, R2, @aws-sdk/client-s3 ═════ */
const MA_MOT_MA = js(`
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// One function, any S3-compatible server
async function luuAnh(s3, bucket, key, noiDung) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: noiDung, ContentType: 'image/jpeg' }));
  const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: 'uploads/' }));
  return r.Contents.map((o) => o.Key + ' (' + o.Size + ' B)');
}

// Only the client changes:
const awsThat = new S3Client({ region: 'ap-southeast-1' });   // keys from the provider chain (role, profile)
const r2 = new S3Client({
  region: 'auto',                                             // R2 ignores it, the SDK requires one
  endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const localstack = new S3Client({
  region: 'ap-southeast-1', endpoint: 'http://127.0.0.1:44566', forcePathStyle: true,
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});`);
const MA_TRANG = js(`
// WRONG: one call returns at most 1000 keys
const motTrang = await s3.send(new ListObjectsV2Command({ Bucket: B }));

// RIGHT: the paginator follows NextContinuationToken until IsTruncated = false
let tong = 0;
for await (const trang of paginateListObjectsV2({ client: s3 }, { Bucket: B })) tong += trang.KeyCount;`);
const MA_JAVA_R2 = java(`
// Spring Boot: AWS SDK for Java v2 — same idea, endpointOverride instead of endpoint
S3Client s3 = S3Client.builder()
    .region(Region.of("auto"))
    .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
    .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(keyId, secret)))
    .build();
s3.putObject(PutObjectRequest.builder().bucket("labflow-anh").key("uploads/a1.jpg")
        .contentType("image/jpeg").build(), RequestBody.fromBytes(bytes));`);
const MA_SIGV4 = bash(`
# What SigV4 signs (simplified)
CanonicalRequest = PUT \\n /labflow-anh/uploads/a1.jpg \\n <query> \\n host:… x-amz-date:… \\n <signed headers> \\n <SHA-256 of body>
StringToSign     = AWS4-HMAC-SHA256 \\n 20261119T064245Z \\n 20261119/ap-southeast-1/s3/aws4_request \\n SHA-256(CanonicalRequest)
SigningKey       = HMAC(HMAC(HMAC(HMAC("AWS4" + secret, "20261119"), "ap-southeast-1"), "s3"), "aws4_request")
Signature        = hex(HMAC(SigningKey, StringToSign))
# The secret never travels. Change one byte of the request ⇒ the server computes a different signature.`);

const L22_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2</span>
<h2>2.2 — The S3 protocol: R2, other S3 servers and @aws-sdk/client-s3</h2>
<p class="lead">S3 is no longer just an Amazon product; its HTTP API became the standard way to talk to object storage. Cloudflare R2, Backblaze B2, DigitalOcean Spaces, Ceph, versitygw and LocalStack all answer the same requests. That is why cuongthai.com stores media in R2 using the official AWS package <code>@aws-sdk/client-s3</code> — and why everything you learn in this chapter transfers to almost any company.</p>

<h3>The ATM-network metaphor</h3>
<p>Your Vietcombank card works in a BIDV ATM because both banks speak the same card network protocol. The machine is different, the fees are different, the bank behind it is different — but the card, the PIN pad and the receipt work the same. The S3 API is that network: the <strong>request format and signature</strong> are shared; the <strong>price list and extra features</strong> belong to each provider.</p>

<h3>What “speaking S3” means</h3>
<ul>
  <li><strong>REST over HTTP</strong>: <code>PUT /bucket/key</code> uploads, <code>GET</code> downloads, <code>HEAD</code> reads metadata, <code>DELETE</code> removes, <code>GET /bucket?list-type=2</code> lists. Errors come back as XML with a <code>&lt;Code&gt;</code> such as <code>NoSuchKey</code> or <code>AccessDenied</code>.</li>
  <li><strong>Two URL styles</strong>: virtual-hosted (<code>https://bucket.s3.ap-southeast-1.amazonaws.com/key</code>, the AWS default) and path-style (<code>https://host/bucket/key</code>, what local servers usually need — hence <code>forcePathStyle: true</code>).</li>
  <li><strong>Signature Version 4 (SigV4)</strong>: every request carries an HMAC-SHA256 signature computed from the method, path, selected headers, the date, a <em>credential scope</em> (date/region/service) and your secret key. The secret itself never leaves your machine.</li>
</ul>
${MA_SIGV4}
<p>You will see the credential scope for real in lesson 2.4: <code>test/20261119/ap-southeast-1/s3/aws4_request</code>. With R2 the region in that scope is <code>auto</code>.</p>

<h3>See it running: one function, two different servers</h3>
<p>LocalStack is written in Python, versitygw in Go; they share no code with each other or with AWS. The same <code>luuAnh()</code> runs against both — only the client configuration changes. On AWS you drop the endpoint; on R2 you point it at <code>&lt;account&gt;.r2.cloudflarestorage.com</code> with region <code>auto</code>.</p>
${MA_MOT_MA}
${OUT_22_MOTMA}
<p>The <code>server</code> header proves two different programs answered. The extra keys on LocalStack are objects uploaded in lesson 2.1.</p>
${MA_JAVA_R2}
<p class="callout">The Java snippet shows the same pattern for the Spring Boot track (AWS SDK for Java v2); it is not part of the measured run above.</p>

<h3>How cuongthai.com really uses it</h3>
<ul>
  <li>The backend file <code>src/config/r2.ts</code> builds one <code>S3Client</code> with <code>region: 'auto'</code> and the R2 endpoint; uploads, deletes, lists and presigned URLs all use the standard commands (<code>PutObjectCommand</code>, <code>DeleteObjectsCommand</code>, <code>getSignedUrl</code>…).</li>
  <li>It sets <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code>. Since early 2025 the AWS SDKs add CRC32 checksums to uploads by default; for presigned URLs that means a checksum of an <em>empty</em> body gets baked into the URL (proved in lesson 2.4). Some S3-compatible providers also handle the new checksums differently. Turning the default down is a deliberate compatibility choice.</li>
  <li>Images are served from the custom domain <code>media.cuongthai.com</code> (Cloudflare in front of R2), not from the API endpoint.</li>
  <li>Tests never touch the real bucket: a <em>storage sandbox</em> is plugged in at <code>getR2Client()</code>, so every <code>send()</code> in tests goes to an in-memory store, and a tripwire fails the test run if anything connects to <code>*.r2.cloudflarestorage.com</code>. That rule exists because test runs once left 98 junk files in the production bucket — a habit worth copying on S3.</li>
</ul>

<h3>The money question: S3 or R2?</h3>
<p>Same workload, three sizes, prices read on 19/11/2026 (S3 Singapore from the AWS Price List API; R2 from Cloudflare's pricing page). Before tax, without free tiers:</p>
${OUT_22_GIA}
<ul>
  <li><strong>Storage</strong> is cheap on both (S3 Standard Singapore 0.025 USD/GB-month, R2 0.015).</li>
  <li><strong>Data leaving AWS to the Internet</strong> is what explodes the bill: about 0.12 USD/GB from Singapore after the first 100 GB each month. R2 charges <strong>nothing for egress</strong>; it charges per request (Class A writes 4.50 USD per million, Class B reads 0.36 USD per million) and gives 10 GB, 1 million Class A and 10 million Class B free each month.</li>
  <li>That is why a media-heavy site such as cuongthai.com sits on R2.</li>
</ul>
<p>When S3 is still the right answer: your compute runs in AWS (traffic from EC2/ECS/Lambda to S3 in the same region is free), you need IAM roles and bucket policies, S3 events into Lambda/SQS/EventBridge, Glacier archive classes, Object Lock, cross-region replication, or Athena queries. Put <strong>CloudFront</strong> in front for public files (Chapter 5) to cut egress cost.</p>

<h3>“Compatible” is not “identical”</h3>
<ul>
  <li>versitygw answered <code>NotImplemented</code> to Block Public Access (lesson 2.3) and has no versioning in its basic file-system backend.</li>
  <li>R2 has no bucket policies or ACLs; access is through R2 API tokens, public buckets or custom domains.</li>
  <li>LocalStack community does not check IAM permissions at all.</li>
</ul>
<p>Before you switch provider, list the S3 features your code uses and test each one against the new endpoint.</p>

<h3>A trap every SDK user meets: 1,000 keys per page</h3>
${MA_TRANG}
${OUT_22_TRANG}
<p>A cleanup job that reads only the first page believes the bucket holds 1,000 objects and silently skips the rest. The paginator follows the continuation token for you.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> USB-C. One plug for many brands, but not every cable carries video — “compatible” always needs a quick test.</li>
  <li><strong>At work:</strong> read the storage client config on your first week. Is the endpoint hard-coded? Is there a sandbox for tests? Are keys in env vars or a role? Those three answers tell you how risky the code is.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How would you migrate from S3 to R2 with minimal code change?”</strong> — Keep the S3 SDK, change endpoint/region/credentials in config, copy data (rclone or R2 Super Slurper), switch reads to the new bucket, then writes; test every S3 feature the code uses because some are not supported.</li>
  <li><strong>“Why does the presigned URL have a region in it?”</strong> — SigV4 derives the signing key from date, region and service; a signature made for one region is invalid in another.</li>
  <li><strong>“What is the biggest S3 cost surprise?”</strong> — Data transfer out to the Internet, then request counts on many small objects. Storage itself rarely dominates.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>In an empty folder: <code>npm i @aws-sdk/client-s3</code>, copy <code>luuAnh()</code> and run it against LocalStack.</li>
  <li>Add a second client for another endpoint you have (another LocalStack port, or an R2 bucket with an API token if you own one) and run the same function.</li>
  <li>Put 1,005 small objects and count them with one <code>ListObjectsV2</code> call, then with the paginator.</li>
</ol>
<p><strong>Done when:</strong> the same function prints the uploaded key on both endpoints and your counter prints 1005 only with the paginator.</p>
${giai('Hint', bash(`
docker run -d --name aws-ls -p 127.0.0.1:44566:4566 localstack/localstack:4.12
npm init -y && npm i @aws-sdk/client-s3
# create the bucket first: aws --endpoint-url http://127.0.0.1:44566 s3 mb s3://labflow-anh
node mot-ma.mjs`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">S3-compatible</span><span class="v">A storage service that accepts the S3 HTTP API and SigV4 signatures.</span></div>
  <div class="kv"><span class="k">SigV4</span><span class="v">AWS Signature Version 4: HMAC-SHA256 over the request with a date/region/service scope.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">The base URL the SDK sends requests to; the only thing that changes between providers.</span></div>
  <div class="kv"><span class="k">Path-style URL</span><span class="v">host/bucket/key; needed by most local and some third-party servers.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Data leaving the provider to the Internet; the main S3 cost driver, free on R2.</span></div>
  <div class="kv"><span class="k">Class A / B</span><span class="v">R2's names for write-type and read-type requests, billed per million.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The S3 API (REST + SigV4) is a de facto standard; R2, LocalStack and others implement it.</li>
  <li>Same SDK code, different endpoint/region/credentials — that is how cuongthai.com uses R2.</li>
  <li>Egress decides the bill: S3 charges for it, R2 does not; S3 wins on AWS integration.</li>
  <li>“Compatible” varies by feature — test what you use.</li>
  <li>Always paginate lists.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html', '✍️', 'AWS docs — Signature Version 4 for API requests', 'How every AWS request is signed.')}
${tl('https://developers.cloudflare.com/r2/api/s3/api/', '🟠', 'Cloudflare docs — R2 S3 API compatibility', 'Which S3 operations R2 implements.')}

<h3>Sources</h3>
<ul>
  <li>R2 pricing (last updated 30/10/2026): <a href="https://developers.cloudflare.com/r2/pricing/" target="_blank" rel="noopener">developers.cloudflare.com/r2/pricing/</a></li>
  <li>S3 pricing: <a href="https://aws.amazon.com/s3/pricing/" target="_blank" rel="noopener">aws.amazon.com/s3/pricing/</a> (numbers taken from the Price List API, ap-southeast-1, 18/11/2026)</li>
  <li>AWS SDK data integrity protections: <a href="https://docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html" target="_blank" rel="noopener">docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html</a></li>
  <li>versitygw: <a href="https://github.com/versity/versitygw" target="_blank" rel="noopener">github.com/versity/versitygw</a> · LocalStack S3: <a href="https://docs.localstack.cloud/aws/services/s3/" target="_blank" rel="noopener">docs.localstack.cloud/aws/services/s3/</a></li>
</ul>
</div>
`;

const L22_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2</span>
<h2>2.2 — Giao thức S3: R2, các máy chủ S3 khác và @aws-sdk/client-s3</h2>
<p class="lead">S3 không còn chỉ là sản phẩm của Amazon; API HTTP của nó đã thành cách chuẩn để nói chuyện với kho object. Cloudflare R2, Backblaze B2, DigitalOcean Spaces, Ceph, versitygw và LocalStack đều trả lời cùng các yêu cầu đó. Vì thế cuongthai.com lưu media trên R2 bằng chính gói chính thức của AWS là <code>@aws-sdk/client-s3</code> — và mọi thứ bạn học ở chương này mang sang được gần như mọi công ty.</p>

<h3>Hình dung: mạng ATM liên ngân hàng</h3>
<p>Thẻ Vietcombank rút được ở cây ATM BIDV vì hai ngân hàng nói cùng giao thức mạng thẻ. Cây máy khác, phí khác, ngân hàng đứng sau khác — nhưng thẻ, bàn phím PIN và biên lai dùng như nhau. API S3 là mạng thẻ đó: <strong>định dạng yêu cầu và chữ ký</strong> là chung; <strong>bảng giá và tính năng thêm</strong> là của từng nhà cung cấp.</p>

<h3>“Nói giao thức S3” nghĩa là gì</h3>
<ul>
  <li><strong>REST trên HTTP</strong>: <code>PUT /bucket/key</code> tải lên, <code>GET</code> tải về, <code>HEAD</code> đọc metadata, <code>DELETE</code> xoá, <code>GET /bucket?list-type=2</code> liệt kê. Lỗi trả về dạng XML có <code>&lt;Code&gt;</code> như <code>NoSuchKey</code> hay <code>AccessDenied</code>.</li>
  <li><strong>Hai kiểu URL</strong>: virtual-hosted (<code>https://bucket.s3.ap-southeast-1.amazonaws.com/key</code>, mặc định của AWS) và path-style (<code>https://host/bucket/key</code>, thứ máy chủ cục bộ thường cần — nên mới có <code>forcePathStyle: true</code>).</li>
  <li><strong>Chữ ký phiên bản 4 (SigV4)</strong>: mỗi yêu cầu mang một chữ ký HMAC-SHA256 tính từ phương thức, đường dẫn, các header được chọn, ngày giờ, một <em>phạm vi khoá</em> (ngày/region/dịch vụ) và secret key của bạn. Bản thân secret không bao giờ rời máy bạn.</li>
</ul>
${MA_SIGV4}
<p>Bạn sẽ thấy phạm vi khoá thật ở bài 2.4: <code>test/20261119/ap-southeast-1/s3/aws4_request</code>. Với R2, region trong phạm vi đó là <code>auto</code>.</p>

<h3>Xem chạy thật: một hàm, hai máy chủ khác hẳn nhau</h3>
<p>LocalStack viết bằng Python, versitygw viết bằng Go; chúng không chung dòng mã nào với nhau hay với AWS. Cùng hàm <code>luuAnh()</code> chạy trên cả hai — chỉ đổi cấu hình client. Trên AWS bạn bỏ endpoint; trên R2 bạn trỏ tới <code>&lt;tài-khoản&gt;.r2.cloudflarestorage.com</code> với region <code>auto</code>.</p>
${MA_MOT_MA}
${OUT_22_MOTMA}
<p>Header <code>server</code> chứng minh hai chương trình khác nhau đã trả lời. Các key thêm ở LocalStack là object tải lên từ bài 2.1.</p>
${MA_JAVA_R2}
<p class="callout">Đoạn Java cho thấy cùng khuôn đó cho nhánh Spring Boot (AWS SDK for Java v2); nó không nằm trong lần chạy đo ở trên.</p>

<h3>cuongthai.com dùng nó thật thế nào</h3>
<ul>
  <li>Tệp backend <code>src/config/r2.ts</code> dựng một <code>S3Client</code> với <code>region: 'auto'</code> và endpoint R2; tải lên, xoá, liệt kê, URL ký sẵn đều dùng lệnh chuẩn (<code>PutObjectCommand</code>, <code>DeleteObjectsCommand</code>, <code>getSignedUrl</code>…).</li>
  <li>Nó đặt <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code>. Từ đầu năm 2025 các SDK AWS mặc định gắn checksum CRC32 vào lượt tải lên; với URL ký sẵn, điều đó nghĩa là checksum của thân <em>rỗng</em> bị đóng cứng vào URL (chứng minh ở bài 2.4). Một số nhà cung cấp tương thích S3 cũng xử lý checksum mới khác nhau. Hạ mặc định xuống là một lựa chọn tương thích có chủ đích.</li>
  <li>Ảnh được phục vụ từ tên miền riêng <code>media.cuongthai.com</code> (Cloudflare đứng trước R2), không phải từ endpoint API.</li>
  <li>Test không bao giờ chạm bucket thật: một <em>storage sandbox</em> cắm ở <code>getR2Client()</code>, nên mọi <code>send()</code> lúc test đi vào kho trong RAM, và một “dây bẫy” đánh đỏ cả bộ test nếu có kết nối tới <code>*.r2.cloudflarestorage.com</code>. Luật đó có vì từng có lượt test để lại 98 tệp rác trong bucket thật — thói quen đáng chép sang S3.</li>
</ul>

<h3>Câu hỏi tiền: S3 hay R2?</h3>
<p>Cùng một khối việc, ba cỡ, giá đọc ngày 19/11/2026 (S3 Singapore lấy từ Price List API của AWS; R2 từ trang giá của Cloudflare). Chưa thuế, chưa tính phần miễn phí:</p>
${OUT_22_GIA}
<ul>
  <li><strong>Lưu trữ</strong> rẻ ở cả hai (S3 Standard Singapore 0,025 USD/GB-tháng, R2 0,015).</li>
  <li><strong>Dữ liệu rời AWS ra Internet</strong> mới là thứ làm hoá đơn nổ tung: khoảng 0,12 USD/GB từ Singapore sau 100 GB đầu mỗi tháng. R2 <strong>không tính phí dữ liệu ra</strong>; nó tính theo request (Class A ghi 4,50 USD mỗi triệu, Class B đọc 0,36 USD mỗi triệu) và cho miễn phí 10 GB, 1 triệu Class A, 10 triệu Class B mỗi tháng.</li>
  <li>Đó là lý do một web nặng media như cuongthai.com đặt ở R2.</li>
</ul>
<p>Khi nào S3 vẫn đúng: máy tính toán của bạn chạy trong AWS (EC2/ECS/Lambda gọi S3 cùng region không mất phí truyền), bạn cần role IAM và bucket policy, sự kiện S3 đẩy vào Lambda/SQS/EventBridge, lớp lưu trữ Glacier, Object Lock, nhân bản sang region khác, hay truy vấn bằng Athena. Đặt <strong>CloudFront</strong> phía trước cho tệp công khai (Chương 5) để giảm phí dữ liệu ra.</p>

<h3>“Tương thích” không phải “giống hệt”</h3>
<ul>
  <li>versitygw trả <code>NotImplemented</code> cho Block Public Access (bài 2.3) và không có versioning ở backend hệ tệp cơ bản.</li>
  <li>R2 không có bucket policy hay ACL; quyền đi qua API token của R2, bucket công khai hoặc tên miền riêng.</li>
  <li>LocalStack bản community hoàn toàn không kiểm quyền IAM.</li>
</ul>
<p>Trước khi đổi nhà cung cấp, liệt kê các tính năng S3 mà mã của bạn dùng và thử từng cái trên endpoint mới.</p>

<h3>Bẫy mọi người dùng SDK đều gặp: 1.000 key mỗi trang</h3>
${MA_TRANG}
${OUT_22_TRANG}
<p>Một job dọn dẹp chỉ đọc trang đầu sẽ tin bucket có 1.000 object và lặng lẽ bỏ sót phần còn lại. Paginator tự đi theo continuation token giúp bạn.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> cổng USB-C. Một kiểu cắm cho nhiều hãng, nhưng không phải cáp nào cũng truyền hình — “tương thích” luôn cần thử nhanh.</li>
  <li><strong>Đi làm:</strong> tuần đầu hãy đọc cấu hình client lưu trữ. Endpoint có bị viết cứng không? Có sandbox cho test không? Khoá nằm trong biến môi trường hay role? Ba câu trả lời đó cho bạn biết mã đang rủi ro tới đâu.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Chuyển từ S3 sang R2 thế nào để sửa ít mã nhất?”</strong> — Giữ SDK S3, đổi endpoint/region/khoá trong cấu hình, chép dữ liệu (rclone hoặc R2 Super Slurper), chuyển phần đọc sang bucket mới rồi tới phần ghi; thử mọi tính năng S3 mã đang dùng vì có cái không được hỗ trợ.</li>
  <li><strong>“Vì sao URL ký sẵn lại chứa region?”</strong> — SigV4 dẫn xuất khoá ký từ ngày, region và dịch vụ; chữ ký làm cho region này không hợp lệ ở region khác.</li>
  <li><strong>“Bất ngờ chi phí lớn nhất của S3 là gì?”</strong> — Dữ liệu đi ra Internet, rồi tới số request trên nhiều object nhỏ. Bản thân dung lượng lưu hiếm khi chiếm phần lớn.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Trong một thư mục trống: <code>npm i @aws-sdk/client-s3</code>, chép hàm <code>luuAnh()</code> và chạy với LocalStack.</li>
  <li>Thêm client thứ hai cho một endpoint khác bạn có (LocalStack ở cổng khác, hoặc bucket R2 với API token nếu bạn có) và chạy cùng hàm.</li>
  <li>Tạo 1.005 object nhỏ rồi đếm bằng một lệnh <code>ListObjectsV2</code>, sau đó bằng paginator.</li>
</ol>
<p><strong>Đạt khi:</strong> cùng một hàm in ra key vừa tải lên ở cả hai endpoint và bộ đếm của bạn chỉ ra 1005 khi dùng paginator.</p>
${giai('Gợi ý', bash(`
docker run -d --name aws-ls -p 127.0.0.1:44566:4566 localstack/localstack:4.12
npm init -y && npm i @aws-sdk/client-s3
# tạo bucket trước: aws --endpoint-url http://127.0.0.1:44566 s3 mb s3://labflow-anh
node mot-ma.mjs`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tương thích S3</span><span class="v">Dịch vụ lưu trữ nhận API HTTP của S3 và chữ ký SigV4.</span></div>
  <div class="kv"><span class="k">SigV4</span><span class="v">Chữ ký AWS phiên bản 4: HMAC-SHA256 trên yêu cầu, có phạm vi ngày/region/dịch vụ.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">URL gốc mà SDK gửi yêu cầu tới; thứ duy nhất đổi giữa các nhà cung cấp.</span></div>
  <div class="kv"><span class="k">URL path-style</span><span class="v">host/bucket/key; máy chủ cục bộ và một số bên thứ ba cần kiểu này.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Dữ liệu rời nhà cung cấp ra Internet; khoản đắt nhất của S3, miễn phí ở R2.</span></div>
  <div class="kv"><span class="k">Class A / B</span><span class="v">Tên R2 đặt cho request kiểu ghi và kiểu đọc, tính theo triệu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>API S3 (REST + SigV4) là chuẩn ngầm; R2, LocalStack và nhiều bên khác làm theo.</li>
  <li>Cùng mã SDK, khác endpoint/region/khoá — đó là cách cuongthai.com dùng R2.</li>
  <li>Phí dữ liệu ra quyết định hoá đơn: S3 tính, R2 không; S3 thắng ở độ gắn kết với AWS.</li>
  <li>“Tương thích” khác nhau theo từng tính năng — thử thứ bạn dùng.</li>
  <li>Luôn phân trang khi liệt kê.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html', '✍️', 'AWS docs — Signature Version 4', 'Mọi yêu cầu AWS được ký thế nào.')}
${tl('https://developers.cloudflare.com/r2/api/s3/api/', '🟠', 'Cloudflare docs — Độ tương thích API S3 của R2', 'R2 làm được những thao tác S3 nào.')}

<h3>Nguồn</h3>
<ul>
  <li>Giá R2 (cập nhật 30/10/2026): <a href="https://developers.cloudflare.com/r2/pricing/" target="_blank" rel="noopener">developers.cloudflare.com/r2/pricing/</a></li>
  <li>Giá S3: <a href="https://aws.amazon.com/s3/pricing/" target="_blank" rel="noopener">aws.amazon.com/s3/pricing/</a> (số lấy từ Price List API, ap-southeast-1, 18/11/2026)</li>
  <li>Bảo vệ toàn vẹn dữ liệu của SDK AWS: <a href="https://docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html" target="_blank" rel="noopener">docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html</a></li>
  <li>versitygw: <a href="https://github.com/versity/versitygw" target="_blank" rel="noopener">github.com/versity/versitygw</a> · LocalStack S3: <a href="https://docs.localstack.cloud/aws/services/s3/" target="_blank" rel="noopener">docs.localstack.cloud/aws/services/s3/</a></li>
</ul>
</div>
`;

/* ═════ 2.3 — Quyền S3 ═════ */
const MA_DENY_DUNG = json(`
{ "Sid": "BiMatChiChoApp", "Effect": "Deny", "Principal": "*",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::labflow-anh/bi-mat/*",
  "Condition": { "StringNotEquals": {
      "aws:PrincipalArn": "arn:aws:iam::123456789012:role/labflow-app" } } }`);

const L23_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 3</span>
<h2>2.3 — S3 permissions: Block Public Access, bucket policies, ACLs and encryption</h2>
<p class="lead">Almost every famous S3 data leak was not a hack of S3. Someone made a bucket readable by “everyone” and a stranger listed it. This lesson shows the four layers that decide who can read an object, proves each one with real requests from an anonymous <code>curl</code>, and ends with the one policy mistake that turns a photo bucket into a payroll leak.</p>

<h3>The apartment-building metaphor</h3>
<ul>
  <li><strong>Block Public Access</strong> is the building's main gate. If it is locked, no apartment can open its door to the street, whatever the owner writes on it.</li>
  <li><strong>The bucket policy</strong> is the notice on the apartment door: “visitors may enter the living room (<code>uploads/</code>), never the bedroom (<code>bi-mat/</code>)”.</li>
  <li><strong>IAM policies</strong> are the personal keys you gave your family (Chapter 1).</li>
  <li><strong>ACLs</strong> are old sticky notes on individual items. Modern buildings have removed them.</li>
</ul>

<h3>How S3 decides</h3>
<ol>
  <li>Any <strong>explicit Deny</strong> anywhere (IAM, bucket policy, SCP, Block Public Access) wins.</li>
  <li><strong>Same account</strong>: an Allow in <em>either</em> the IAM policy or the bucket policy is enough.</li>
  <li><strong>Another account</strong>: it needs an Allow in <em>both</em> — their IAM policy and your bucket policy.</li>
  <li><strong>Anonymous</strong> (no signature at all): only a bucket policy with <code>"Principal": "*"</code> (or a legacy ACL) can allow it — and Block Public Access can veto that.</li>
</ol>

<h3>Block Public Access — four switches</h3>
<table>
  <thead><tr><th>Setting</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><code>BlockPublicAcls</code></td><td>Rejects new public ACLs</td></tr>
    <tr><td><code>IgnorePublicAcls</code></td><td>Ignores public ACLs that already exist</td></tr>
    <tr><td><code>BlockPublicPolicy</code></td><td>Rejects a bucket policy that grants public access</td></tr>
    <tr><td><code>RestrictPublicBuckets</code></td><td>Even if a public policy exists, only AWS services and principals in the account can use it</td></tr>
  </tbody>
</table>
<p>They can be set at organization, account, bucket and access-point level; the strictest one applies. <strong>Since April 2023 every new bucket starts with all four on and ACLs disabled.</strong> To make anything public you must switch them off on purpose — so a public bucket today is a decision, not an accident. For a real account: turn all four on at <em>account</em> level, and serve public files through CloudFront (Chapter 5) instead.</p>

<h3>ACLs and Object Ownership</h3>
<p>ACLs are the 2006 permission system, attached to each object. The default <strong>Object Ownership = BucketOwnerEnforced</strong> disables them: the bucket owner owns every object and only policies count. Trying to set an ACL returns <code>AccessControlListNotSupported</code> — you will see it below. Leave it that way unless a very old tool forces you.</p>

<h3>See it running: what a stranger can read</h3>
<p>LocalStack does not enforce anonymous access, so this part runs on <strong>versitygw 1.11.0</strong>, an open-source S3 gateway that does enforce bucket policies against unsigned requests. <code>curl</code> with no key plays the stranger on the Internet. The policy opens only <code>uploads/*</code> for reading:</p>
${MA_CONG_KHAI}
${OUT_23_QUYEN}
<ul>
  <li>Before the policy: every anonymous request is <code>403 AccessDenied</code>.</li>
  <li>After: <code>uploads/phong-a1.jpg</code> is public, <code>bi-mat/luong.csv</code> still is not, and listing the bucket is still refused because the policy grants <code>s3:GetObject</code>, not <code>s3:ListBucket</code>.</li>
  <li><code>get-bucket-policy-status</code> answers <code>IsPublic: True</code> — the same flag the console shows as an orange “Public” badge.</li>
</ul>

<h3>The mistake that leaks everything</h3>
<p>A teammate is in a hurry: “the images are not showing, just open the bucket”. They paste this:</p>
${MA_SAI}
${OUT_23_SAI}
<ul>
  <li>With <code>s3:ListBucket</code> on the bucket ARN, a stranger gets the full list of keys — including <code>bi-mat/luong.csv</code> — and then downloads the salary file. Listing is what turns “one file is public” into “everything is discoverable”.</li>
  <li>The repair adds an explicit Deny for <code>bi-mat/*</code>, and the stranger is blocked again.</li>
  <li><strong>Careful — a difference with AWS.</strong> The last <code>get-object</code> by the administrator still worked on versitygw because its root account bypasses bucket policies. On AWS, <code>Deny</code> with <code>"Principal": "*"</code> also blocks <em>your own</em> users and your application role. A real policy scopes the Deny with a condition, for example:</li>
</ul>
${MA_DENY_DUNG}
<p>Even better: <strong>do not keep secret files in a bucket that has any public statement</strong>. One bucket for public media, one private bucket for everything else — that is the design the lab of this chapter asks for. And versitygw rejected <code>put-public-access-block</code> with <code>NotImplemented</code>; on AWS and LocalStack that call works and would have blocked the bad policy at the gate (<code>BlockPublicPolicy</code>).</p>

<h3>Encryption at rest and in transit</h3>
${OUT_23_MAHOA}
<table>
  <thead><tr><th>Option</th><th>Who holds the key</th><th>When to choose</th></tr></thead>
  <tbody>
    <tr><td>SSE-S3 (AES256, default since 01/2023)</td><td>S3 fully</td><td>Default; free; protects disks, not permissions</td></tr>
    <tr><td>SSE-KMS</td><td>A KMS key you control (key policy, rotation, CloudTrail log of every use)</td><td>Regulated data; a second gate: the reader also needs <code>kms:Decrypt</code>. Enable <em>S3 Bucket Keys</em> to cut KMS request cost</td></tr>
    <tr><td>DSSE-KMS</td><td>KMS, two layers of encryption</td><td>Rules that demand dual-layer encryption</td></tr>
    <tr><td>SSE-C</td><td>You send the key with every request</td><td>Rare; you must never lose the key</td></tr>
    <tr><td>Client-side</td><td>Your application</td><td>S3 must never see plaintext</td></tr>
  </tbody>
</table>
<p>Important: <strong>SSE-S3 does not stop a public read</strong>. If a policy allows a stranger, S3 decrypts the object for them. SSE-KMS does help: an anonymous caller has no <code>kms:Decrypt</code>. In transit, force HTTPS with a Deny on <code>aws:SecureTransport = false</code> (used in the chapter lab).</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> sharing a Google Drive folder with “anyone with the link” shares every file added later, too. A bucket policy on <code>/*</code> works the same way.</li>
  <li><strong>At work:</strong> in code review, search every policy for <code>"Principal": "*"</code> and for <code>s3:ListBucket</code>. Ask “who outside our account needs this?” If the answer is “the browser”, the right tool is usually a presigned URL (lesson 2.4) or CloudFront, not a public bucket.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“A bucket policy allows Principal * but anonymous reads still get 403. Why?”</strong> — Block Public Access (bucket or account level) ignores or blocks the public policy, or an explicit Deny applies, or the object is SSE-KMS encrypted and the caller has no decrypt permission.</li>
  <li><strong>“IAM policy or bucket policy — which one?”</strong> — Same account: either works; use IAM for “what this role can do”, the bucket policy for rules that must hold for everyone (HTTPS only, deny outside the organization) and for cross-account access, which needs both sides.</li>
  <li><strong>“Is default encryption enough to protect data?”</strong> — It protects against stolen disks, not against wrong permissions. Permissions plus Block Public Access are the real control; SSE-KMS adds a second permission check.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run versitygw locally (<code>docker run -d --name aws-vgw -p 127.0.0.1:44568:7070 -e ROOT_ACCESS_KEY=quantri -e ROOT_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY versity/versitygw posix /tmp</code>) and create a bucket with two prefixes.</li>
  <li>Write a policy that makes only one prefix publicly readable. Prove it with anonymous <code>curl</code>: one 200, one 403, listing 403.</li>
  <li>Add <code>s3:ListBucket</code> by mistake, see what leaks, then fix it.</li>
</ol>
<p><strong>Done when:</strong> you can show the three curl results, explain why listing changed everything, and write the condition that keeps your own app role allowed under a Deny.</p>
${giai('Hint: the anonymous checks', bash(`
S3=http://127.0.0.1:44568
curl -s -o /dev/null -w '%{http_code}\\n' $S3/labflow-anh/uploads/phong-a1.jpg   # 200 after the policy
curl -s -o /dev/null -w '%{http_code}\\n' $S3/labflow-anh/bi-mat/luong.csv       # 403
curl -s -o /dev/null -w '%{http_code}\\n' "$S3/labflow-anh?list-type=2"          # 403 unless ListBucket is granted`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Block Public Access</span><span class="v">Four switches that veto public ACLs and policies; on by default since 04/2023.</span></div>
  <div class="kv"><span class="k">Bucket policy</span><span class="v">Resource-based JSON policy on a bucket; has a Principal; the only way to allow anonymous access.</span></div>
  <div class="kv"><span class="k">Object Ownership</span><span class="v">BucketOwnerEnforced = ACLs disabled, bucket owner owns all objects.</span></div>
  <div class="kv"><span class="k">PolicyStatus.IsPublic</span><span class="v">S3's own verdict on whether the bucket policy makes it public.</span></div>
  <div class="kv"><span class="k">SSE-S3 / SSE-KMS</span><span class="v">Server-side encryption with S3-managed keys / with a KMS key you control.</span></div>
  <div class="kv"><span class="k">aws:SecureTransport</span><span class="v">Condition key, false for plain HTTP; deny it to force TLS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Explicit Deny wins; same account needs one Allow, cross-account needs both, anonymous needs a public policy.</li>
  <li>Block Public Access is the gate — keep all four on at account level.</li>
  <li>ACLs are off by default; leave them off.</li>
  <li><code>s3:ListBucket</code> for Principal * makes every key discoverable.</li>
  <li>A Deny on Principal * blocks your own roles on AWS — scope it with a condition, or separate public and private buckets.</li>
  <li>Encryption at rest is default; it is not a permission.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html', '🚧', 'AWS docs — Blocking public access to your S3 storage', 'The four settings, levels and how “public” is judged.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html', '👤', 'AWS docs — Object Ownership and disabling ACLs', 'Why BucketOwnerEnforced is the default.')}

<h3>Sources</h3>
<ul>
  <li>Block Public Access: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html</a></li>
  <li>New defaults from April 2023: <a href="https://aws.amazon.com/about-aws/whats-new/2023/04/amazon-s3-two-security-best-practices-buckets-default/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2023/04/amazon-s3-two-security-best-practices-buckets-default/</a></li>
  <li>Object Ownership: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html</a></li>
  <li>SSE-KMS and Bucket Keys: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html</a></li>
  <li>Bucket policy examples (HTTPS only, conditions): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html</a></li>
</ul>
</div>
`;

const L23_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 3</span>
<h2>2.3 — Quyền S3: Block Public Access, bucket policy, ACL và mã hoá</h2>
<p class="lead">Gần như mọi vụ lộ dữ liệu S3 nổi tiếng đều không phải S3 bị hack. Ai đó cho “mọi người” đọc một bucket và một người lạ liệt kê được nó. Bài này chỉ ra bốn lớp quyết định ai đọc được một object, chứng minh từng lớp bằng yêu cầu thật từ một lệnh <code>curl</code> ẩn danh, và kết thúc bằng lỗi policy biến bucket ảnh thành vụ lộ bảng lương.</p>

<h3>Hình dung: toà chung cư</h3>
<ul>
  <li><strong>Block Public Access</strong> là cổng chính của toà nhà. Cổng khoá thì không căn hộ nào mở cửa ra phố được, chủ nhà ghi gì lên cửa cũng vậy.</li>
  <li><strong>Bucket policy</strong> là tờ thông báo dán trên cửa căn hộ: “khách được vào phòng khách (<code>uploads/</code>), không bao giờ vào phòng ngủ (<code>bi-mat/</code>)”.</li>
  <li><strong>Policy IAM</strong> là chìa khoá riêng bạn đưa cho người nhà (Chương 1).</li>
  <li><strong>ACL</strong> là giấy nhớ cũ dán trên từng món đồ. Toà nhà hiện đại đã gỡ hết.</li>
</ul>

<h3>S3 quyết định thế nào</h3>
<ol>
  <li>Có <strong>Deny tường minh</strong> ở bất kỳ đâu (IAM, bucket policy, SCP, Block Public Access) thì Deny thắng.</li>
  <li><strong>Cùng tài khoản</strong>: một Allow ở <em>một trong hai</em> — policy IAM hoặc bucket policy — là đủ.</li>
  <li><strong>Tài khoản khác</strong>: cần Allow ở <em>cả hai</em> — policy IAM bên họ và bucket policy bên bạn.</li>
  <li><strong>Ẩn danh</strong> (không có chữ ký): chỉ bucket policy có <code>"Principal": "*"</code> (hoặc ACL kiểu cũ) cho phép được — và Block Public Access có quyền phủ quyết.</li>
</ol>

<h3>Block Public Access — bốn công tắc</h3>
<table>
  <thead><tr><th>Công tắc</th><th>Làm gì</th></tr></thead>
  <tbody>
    <tr><td><code>BlockPublicAcls</code></td><td>Từ chối ACL công khai mới</td></tr>
    <tr><td><code>IgnorePublicAcls</code></td><td>Lờ đi các ACL công khai đang có</td></tr>
    <tr><td><code>BlockPublicPolicy</code></td><td>Từ chối bucket policy cấp quyền công khai</td></tr>
    <tr><td><code>RestrictPublicBuckets</code></td><td>Dù có policy công khai, chỉ dịch vụ AWS và danh tính trong tài khoản dùng được</td></tr>
  </tbody>
</table>
<p>Đặt được ở cấp tổ chức, tài khoản, bucket và access point; mức chặt nhất được áp dụng. <strong>Từ tháng 4/2023 mọi bucket mới khởi đầu với cả bốn công tắc bật và ACL bị tắt.</strong> Muốn công khai thứ gì bạn phải tự tay tắt chúng — nên bucket công khai ngày nay là một quyết định, không phải tai nạn. Với tài khoản thật: bật cả bốn ở cấp <em>tài khoản</em>, và phục vụ tệp công khai qua CloudFront (Chương 5).</p>

<h3>ACL và Object Ownership</h3>
<p>ACL là hệ thống quyền từ 2006, gắn vào từng object. Mặc định <strong>Object Ownership = BucketOwnerEnforced</strong> tắt chúng: chủ bucket sở hữu mọi object và chỉ policy có hiệu lực. Thử đặt ACL sẽ nhận <code>AccessControlListNotSupported</code> — bạn sẽ thấy ngay bên dưới. Cứ để vậy, trừ khi một công cụ rất cũ bắt buộc.</p>

<h3>Xem chạy thật: người lạ đọc được gì</h3>
<p>LocalStack không thực thi quyền ẩn danh, nên phần này chạy trên <strong>versitygw 1.11.0</strong>, một cổng S3 mã nguồn mở CÓ thực thi bucket policy với yêu cầu không ký. <code>curl</code> không có khoá đóng vai người lạ trên Internet. Policy chỉ mở đọc <code>uploads/*</code>:</p>
${MA_CONG_KHAI}
${OUT_23_QUYEN}
<ul>
  <li>Trước khi có policy: mọi yêu cầu ẩn danh đều <code>403 AccessDenied</code>.</li>
  <li>Sau đó: <code>uploads/phong-a1.jpg</code> công khai, <code>bi-mat/luong.csv</code> vẫn không, và liệt kê bucket vẫn bị từ chối vì policy cấp <code>s3:GetObject</code>, không cấp <code>s3:ListBucket</code>.</li>
  <li><code>get-bucket-policy-status</code> trả <code>IsPublic: True</code> — chính cờ mà console hiện thành nhãn cam “Public”.</li>
</ul>

<h3>Lỗi làm lộ tất cả</h3>
<p>Một đồng đội đang vội: “ảnh không hiện, mở bucket ra cho nhanh”. Họ dán đoạn này:</p>
${MA_SAI}
${OUT_23_SAI}
<ul>
  <li>Có <code>s3:ListBucket</code> trên ARN bucket, người lạ lấy được cả danh sách key — gồm <code>bi-mat/luong.csv</code> — rồi tải luôn tệp lương. Quyền liệt kê là thứ biến “một tệp công khai” thành “mọi thứ đều bị dò ra”.</li>
  <li>Bản sửa thêm một Deny tường minh cho <code>bi-mat/*</code>, người lạ lại bị chặn.</li>
  <li><strong>Cẩn thận — khác với AWS.</strong> Lệnh <code>get-object</code> cuối của quản trị viên vẫn chạy trên versitygw vì tài khoản root của nó bỏ qua bucket policy. Trên AWS, <code>Deny</code> với <code>"Principal": "*"</code> chặn cả user <em>của chính bạn</em> và role ứng dụng. Policy thật phải thu hẹp Deny bằng điều kiện, ví dụ:</li>
</ul>
${MA_DENY_DUNG}
<p>Tốt hơn nữa: <strong>đừng để tệp bí mật trong bucket có bất kỳ câu công khai nào</strong>. Một bucket cho media công khai, một bucket riêng tư cho mọi thứ còn lại — đó là thiết kế mà lab chương này yêu cầu. Và versitygw từ chối <code>put-public-access-block</code> với <code>NotImplemented</code>; trên AWS và LocalStack lệnh đó chạy được và đã chặn policy sai ngay từ cổng (<code>BlockPublicPolicy</code>).</p>

<h3>Mã hoá khi lưu và khi truyền</h3>
${OUT_23_MAHOA}
<table>
  <thead><tr><th>Lựa chọn</th><th>Ai giữ khoá</th><th>Khi nào chọn</th></tr></thead>
  <tbody>
    <tr><td>SSE-S3 (AES256, mặc định từ 01/2023)</td><td>S3 lo hết</td><td>Mặc định; miễn phí; bảo vệ ổ đĩa, không thay quyền</td></tr>
    <tr><td>SSE-KMS</td><td>Một khoá KMS bạn kiểm soát (key policy, xoay khoá, CloudTrail ghi mỗi lần dùng)</td><td>Dữ liệu có quy định; thêm một cửa: người đọc còn cần <code>kms:Decrypt</code>. Bật <em>S3 Bucket Keys</em> để giảm phí gọi KMS</td></tr>
    <tr><td>DSSE-KMS</td><td>KMS, mã hoá hai lớp</td><td>Quy định đòi mã hoá hai lớp</td></tr>
    <tr><td>SSE-C</td><td>Bạn gửi khoá theo mỗi yêu cầu</td><td>Hiếm; không bao giờ được mất khoá</td></tr>
    <tr><td>Mã hoá phía client</td><td>Ứng dụng của bạn</td><td>S3 không bao giờ được thấy bản rõ</td></tr>
  </tbody>
</table>
<p>Quan trọng: <strong>SSE-S3 không chặn được việc đọc công khai</strong>. Policy cho người lạ đọc thì S3 giải mã cho họ. SSE-KMS thì có ích: người gọi ẩn danh không có <code>kms:Decrypt</code>. Khi truyền, ép HTTPS bằng Deny với <code>aws:SecureTransport = false</code> (dùng trong lab chương).</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> chia sẻ thư mục Google Drive kiểu “ai có liên kết cũng xem được” là chia sẻ cả mọi tệp thêm vào sau này. Bucket policy trên <code>/*</code> cũng y như vậy.</li>
  <li><strong>Đi làm:</strong> khi review mã, tìm trong mọi policy chuỗi <code>"Principal": "*"</code> và <code>s3:ListBucket</code>. Hỏi “ai ngoài tài khoản cần thứ này?” Nếu câu trả lời là “trình duyệt” thì công cụ đúng thường là URL ký sẵn (bài 2.4) hoặc CloudFront, không phải bucket công khai.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Bucket policy cho Principal * mà đọc ẩn danh vẫn 403. Vì sao?”</strong> — Block Public Access (cấp bucket hoặc tài khoản) đang lờ đi hoặc chặn policy công khai, hoặc có Deny tường minh, hoặc object mã hoá SSE-KMS mà người gọi không có quyền giải mã.</li>
  <li><strong>“Policy IAM hay bucket policy — dùng cái nào?”</strong> — Cùng tài khoản: cái nào cũng được; dùng IAM cho “role này làm được gì”, bucket policy cho luật phải đúng với mọi người (chỉ HTTPS, chặn ngoài tổ chức) và cho truy cập chéo tài khoản, thứ cần cả hai phía.</li>
  <li><strong>“Mã hoá mặc định đã đủ bảo vệ dữ liệu chưa?”</strong> — Nó chống mất ổ đĩa, không chống cấp quyền sai. Quyền cộng Block Public Access mới là chốt thật; SSE-KMS thêm một lần kiểm quyền nữa.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy versitygw ở máy (<code>docker run -d --name aws-vgw -p 127.0.0.1:44568:7070 -e ROOT_ACCESS_KEY=quantri -e ROOT_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY versity/versitygw posix /tmp</code>) và tạo một bucket có hai tiền tố.</li>
  <li>Viết policy chỉ cho đọc công khai một tiền tố. Chứng minh bằng <code>curl</code> ẩn danh: một 200, một 403, liệt kê 403.</li>
  <li>Lỡ tay thêm <code>s3:ListBucket</code>, xem thứ gì bị lộ, rồi sửa.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đưa ra được ba kết quả curl, giải thích được vì sao quyền liệt kê làm thay đổi tất cả, và viết được điều kiện giữ role ứng dụng của mình không bị một Deny chặn.</p>
${giai('Gợi ý: các phép thử ẩn danh', bash(`
S3=http://127.0.0.1:44568
curl -s -o /dev/null -w '%{http_code}\\n' $S3/labflow-anh/uploads/phong-a1.jpg   # 200 sau khi có policy
curl -s -o /dev/null -w '%{http_code}\\n' $S3/labflow-anh/bi-mat/luong.csv       # 403
curl -s -o /dev/null -w '%{http_code}\\n' "$S3/labflow-anh?list-type=2"          # 403 trừ khi cấp ListBucket`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Block Public Access</span><span class="v">Bốn công tắc phủ quyết ACL và policy công khai; mặc định bật từ 04/2023.</span></div>
  <div class="kv"><span class="k">Bucket policy</span><span class="v">Policy JSON gắn vào bucket, có Principal; cách duy nhất để cho phép truy cập ẩn danh.</span></div>
  <div class="kv"><span class="k">Object Ownership</span><span class="v">BucketOwnerEnforced = tắt ACL, chủ bucket sở hữu mọi object.</span></div>
  <div class="kv"><span class="k">PolicyStatus.IsPublic</span><span class="v">Phán quyết của chính S3: bucket policy có làm bucket công khai không.</span></div>
  <div class="kv"><span class="k">SSE-S3 / SSE-KMS</span><span class="v">Mã hoá phía máy chủ bằng khoá S3 quản lý / bằng khoá KMS bạn kiểm soát.</span></div>
  <div class="kv"><span class="k">aws:SecureTransport</span><span class="v">Khoá điều kiện, bằng false khi dùng HTTP thường; Deny nó để ép TLS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Deny tường minh luôn thắng; cùng tài khoản cần một Allow, chéo tài khoản cần cả hai, ẩn danh cần policy công khai.</li>
  <li>Block Public Access là cổng — giữ cả bốn công tắc bật ở cấp tài khoản.</li>
  <li>ACL mặc định tắt; cứ để tắt.</li>
  <li><code>s3:ListBucket</code> cho Principal * làm mọi key bị dò ra.</li>
  <li>Deny cho Principal * chặn cả role của bạn trên AWS — thu hẹp bằng điều kiện, hoặc tách bucket công khai và riêng tư.</li>
  <li>Mã hoá khi lưu là mặc định; nó không phải là quyền.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html', '🚧', 'AWS docs — Chặn truy cập công khai vào S3', 'Bốn công tắc, các cấp và cách S3 xét “công khai”.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html', '👤', 'AWS docs — Object Ownership và tắt ACL', 'Vì sao BucketOwnerEnforced là mặc định.')}

<h3>Nguồn</h3>
<ul>
  <li>Block Public Access: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html</a></li>
  <li>Mặc định mới từ tháng 4/2023: <a href="https://aws.amazon.com/about-aws/whats-new/2023/04/amazon-s3-two-security-best-practices-buckets-default/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2023/04/amazon-s3-two-security-best-practices-buckets-default/</a></li>
  <li>Object Ownership: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html</a></li>
  <li>SSE-KMS và Bucket Keys: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html</a></li>
  <li>Ví dụ bucket policy (chỉ HTTPS, điều kiện): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html</a></li>
</ul>
</div>
`;

/* ═════ 2.4 — URL ký sẵn ═════ */
const MA_KY_TAI_LEN = js(`
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({ region: 'ap-southeast-1', requestChecksumCalculation: 'WHEN_REQUIRED' });
const LOAI_DUOC = { 'image/jpeg': 'jpg', 'image/png': 'png' };

// POST /api/rooms/:id/photos/upload-url   (after auth + "can this user edit room :id?")
export async function kyTaiLen(roomId, contentType) {
  const duoi = LOAI_DUOC[contentType];
  if (!duoi) throw new Error('only JPEG/PNG');                 // allowlist, never trust the client
  const key = 'uploads/rooms/' + roomId + '/' + randomUUID() + '.' + duoi;   // server chooses the key
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: 'labflow-anh', Key: key, ContentType: contentType }),
    { expiresIn: 300, signableHeaders: new Set(['content-type']) });          // 5 minutes, content-type pinned
  return { url, key };
}

// POST /api/rooms/:id/photos/confirm { key } — check the object really exists before saving the key
export async function xacNhan(key) {
  const h = await s3.send(new HeadObjectCommand({ Bucket: 'labflow-anh', Key: key }));
  if (h.ContentLength > 2 * 1024 * 1024) throw new Error('too large');
  return { key, size: h.ContentLength, type: h.ContentType };
}`);
const MA_JAVA_PRESIGN = java(`
// Spring Boot (AWS SDK for Java v2): S3Presigner
try (S3Presigner presigner = S3Presigner.create()) {
    PutObjectRequest put = PutObjectRequest.builder().bucket("labflow-anh").key(key).contentType("image/jpeg").build();
    PresignedPutObjectRequest p = presigner.presignPutObject(r -> r.signatureDuration(Duration.ofMinutes(5)).putObjectRequest(put));
    return p.url().toString();     // content-type is part of the signed headers ⇒ the browser must send the same one
}`);

const L24_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 4</span>
<h2>2.4 — Presigned URLs and direct browser uploads</h2>
<p class="lead">Your bucket is private (lesson 2.3) — so how does a browser show a private photo, or upload a 50 MB file without passing it through your API server? You give it a <strong>presigned URL</strong>: a normal S3 URL plus a SigV4 signature made with <em>your</em> credentials, valid for one object, one method, a few minutes. This lesson runs every property of that URL for real, including two traps that cuongthai.com's own code guards against.</p>

<h3>The cinema-ticket metaphor</h3>
<p>A cinema ticket opens one door (hall 3), for one show (19:30), for whoever holds it. The cashier does not come with you; the usher only checks that the ticket is genuine and not expired. A presigned URL is that ticket: S3 (the usher) checks the signature and the expiry; your API (the cashier) decided who gets a ticket. And like a ticket, <strong>anyone who holds the URL can use it</strong> — it is a bearer token.</p>

<h3>See it running: sign, tamper, expire</h3>
${OUT_24_PRESIGN}
<ul>
  <li>The URL carries everything S3 needs: algorithm, <code>X-Amz-Credential</code> (key ID + scope <code>20261119/ap-southeast-1/s3/aws4_request</code>), date, lifetime (5 s here), the list of signed headers, and the signature. Your secret is not in it.</li>
  <li>Changing one word of the path (<code>phong-a1</code> → <code>phong-b2</code>) gives <code>SignatureDoesNotMatch</code>: the signature covers the path, so a ticket for one object cannot open another.</li>
  <li>Seven seconds later the same URL answers <code>Request has expired</code>.</li>
</ul>

<h3>How long can a URL live?</h3>
<ul>
  <li>Signed with an IAM user's long-term key: up to <strong>7 days</strong> (SigV4 limit). The console allows 1 minute to 12 hours.</li>
  <li>Signed with <strong>temporary credentials</strong> (a role on ECS, Lambda, EC2, or SSO): the URL dies when the session dies, <em>even if you asked for 7 days</em>. A classic production bug: “links in yesterday's e-mail stopped working after an hour”.</li>
  <li>Revoking or deleting the key also kills every URL it signed.</li>
  <li>Choose the shortest lifetime that works: minutes for uploads, minutes to an hour for viewing. Never log full presigned URLs.</li>
</ul>

<h3>Direct upload: the flow</h3>
<ol>
  <li>Browser → API: “I want to add a photo to room A1, type image/jpeg.” The API authenticates the user and checks they may edit that room.</li>
  <li>API chooses the key (<code>uploads/rooms/A1/&lt;uuid&gt;.jpg</code>), signs a PUT for 5 minutes with the content type pinned, returns <code>{ url, key }</code>.</li>
  <li>Browser → S3: <code>PUT url</code> with the file body. Your server never touches the bytes.</li>
  <li>Browser → API: “done, key = …”. The API calls <code>HeadObject</code>, checks size and type, and only then saves the key in PostgreSQL.</li>
</ol>
${MA_KY_TAI_LEN}
${MA_JAVA_PRESIGN}
<p class="callout">The signing call (<code>getSignedUrl</code> with <code>signableHeaders</code>) is the one the chapter lab grader runs for real; the confirm step and the Java version (Spring Boot equivalent) were not part of the measured run.</p>

<h3>Two traps in presigned PUT, proved</h3>
${OUT_24_KYPUT}
<ul>
  <li><strong>Trap 1 — the empty checksum.</strong> Recent AWS SDK v3 versions add checksums by default. When you only <em>sign</em> (no body yet), the SDK bakes the CRC32 of an empty body (<code>AAAAAA==</code>) into the URL; the real upload then fails integrity checks on providers that verify it. <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code> removes it — exactly the line in cuongthai.com's <code>r2.ts</code>.</li>
  <li><strong>Trap 2 — Content-Type is only a hint unless you sign it.</strong> With only <code>host</code> signed, the browser may send <code>text/html</code> and S3 stores an HTML page with a script on your media domain: a stored XSS waiting for a click. Signing <code>content-type</code> (<code>signableHeaders</code>) makes S3 reject the wrong type with <code>SignatureDoesNotMatch</code>. cuongthai.com's upload signer does this, with a comment saying it was verified against a real S3 endpoint.</li>
</ul>

<h3>Limiting file size: presigned POST</h3>
<p>A presigned PUT cannot say “at most 2 MB”. A <strong>presigned POST</strong> carries a signed policy document with conditions:</p>
${OUT_24_POST}
<p>The 3 MB file is refused by S3 itself with <code>EntityTooLarge</code>, before your API sees anything. Use POST when size matters (avatars, CV uploads); keep the <code>HeadObject</code> check anyway — defense in depth.</p>

<h3>CORS: why the browser upload failed at first</h3>
<p>A page on <code>https://labflow.vn</code> calling a different origin (the bucket) triggers a <em>preflight</em> <code>OPTIONS</code> request. Without a CORS rule S3 refuses it, and the browser never sends the PUT.</p>
${MA_CORS}
${OUT_24_CORS}
<p>CORS only instructs browsers; it is <strong>not</strong> a security boundary — <code>curl</code> ignores it. Security comes from the signature and the bucket permissions. Keep <code>AllowedOrigins</code> to your real domains, never <code>*</code> with credentials.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> a Shopee delivery code works once, for one parcel, for a limited time — and whoever has the code can pick it up. Do not paste it in a group chat.</li>
  <li><strong>At work:</strong> “the upload works on localhost but fails in production with a CORS error” is a ticket you will get. Check, in order: the CORS rule's origin, the method, the <code>Content-Type</code> the browser sends vs the one you signed, and the URL's expiry vs the role session.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How do you let users upload large files without overloading the API?”</strong> — Presigned PUT or POST straight to S3; the API only authorizes, chooses the key, signs with a short expiry, then confirms with HeadObject. Multipart presigned URLs for very large files.</li>
  <li><strong>“Our presigned URLs expire after an hour though we set 24 hours. Why?”</strong> — They are signed with temporary role credentials; a URL never outlives the session that signed it. Sign with credentials whose lifetime matches, or shorten the requirement.</li>
  <li><strong>“Is a presigned URL secure?”</strong> — It is a bearer token: secure only if short-lived, scoped to one key and method, sent over HTTPS and not logged. Pin Content-Type, limit size with POST, and validate after upload.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Generate a GET URL with <code>aws s3 presign … --expires-in 30</code>, open it, change one character of the key, then wait for expiry.</li>
  <li>Write a Node.js function that signs a PUT for <code>image/jpeg</code> only, with <code>content-type</code> signed, and prove a <code>text/html</code> PUT gets 403.</li>
  <li>Add a CORS rule for <code>http://localhost:5173</code> and check the preflight with <code>curl -X OPTIONS</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show <code>SignatureDoesNotMatch</code>, <code>Request has expired</code>, a 403 for the HTML upload, and a preflight that returns <code>Access-Control-Allow-Origin</code> only for your origin.</p>
${giai('Hint', bash(`
URL=$(aws s3 presign s3://labflow-anh/uploads/a.jpg --expires-in 30)
curl -s "$URL" | head -c 80
# Node: getSignedUrl(s3, new PutObjectCommand({...ContentType:'image/jpeg'}), { expiresIn: 300, signableHeaders: new Set(['content-type']) })
curl -si -X OPTIONS "$S3/labflow-anh/uploads/x.jpg" -H 'Origin: http://localhost:5173' -H 'Access-Control-Request-Method: PUT' | grep -i access-control`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Presigned URL</span><span class="v">An S3 URL with a SigV4 signature in the query string; grants one operation until it expires.</span></div>
  <div class="kv"><span class="k">X-Amz-Expires</span><span class="v">Lifetime in seconds; capped at 7 days and by the signing session.</span></div>
  <div class="kv"><span class="k">SignedHeaders</span><span class="v">Headers covered by the signature; sign content-type to pin it.</span></div>
  <div class="kv"><span class="k">Presigned POST</span><span class="v">Form upload with a signed policy (content-length-range, starts-with).</span></div>
  <div class="kv"><span class="k">CORS preflight</span><span class="v">Browser OPTIONS request asking if a cross-origin method/header is allowed.</span></div>
  <div class="kv"><span class="k">Bearer token</span><span class="v">Whoever holds it can use it — no extra identity check.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Presigned URLs let browsers use private objects directly; the API decides, S3 verifies.</li>
  <li>They expire with their lifetime <em>or</em> the signing session, whichever is first; 7 days maximum.</li>
  <li>Sign <code>content-type</code>; turn off the empty-body checksum when only signing.</li>
  <li>Use presigned POST to cap size; confirm with HeadObject before saving the key.</li>
  <li>CORS is for browsers, not security.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html', '🎟️', 'AWS docs — Upload and download with presigned URLs', 'Lifetimes per credential type, who can sign.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html', '🌍', 'AWS docs — CORS for S3', 'Rules, preflight and troubleshooting.')}

<h3>Sources</h3>
<ul>
  <li>Presigned URLs: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html</a></li>
  <li>CORS: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html</a></li>
  <li>POST policy conditions: <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html</a></li>
  <li>SDK checksum defaults: <a href="https://docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html" target="_blank" rel="noopener">docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html</a></li>
</ul>
</div>
`;

const L24_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 4</span>
<h2>2.4 — URL ký sẵn và tải lên thẳng từ trình duyệt</h2>
<p class="lead">Bucket của bạn là riêng tư (bài 2.3) — vậy làm sao trình duyệt hiện được một ảnh riêng tư, hay tải lên tệp 50 MB mà không đi qua máy chủ API? Bạn đưa nó một <strong>URL ký sẵn</strong>: một URL S3 bình thường kèm chữ ký SigV4 làm bằng khoá <em>của bạn</em>, dùng cho một object, một phương thức, vài phút. Bài này chạy thật từng tính chất của URL đó, kể cả hai cái bẫy mà chính mã của cuongthai.com đang phòng.</p>

<h3>Hình dung: vé xem phim</h3>
<p>Vé xem phim mở một cửa (phòng 3), một suất (19:30), cho bất kỳ ai cầm nó. Thu ngân không đi theo bạn; người soát vé chỉ kiểm vé thật và chưa quá giờ. URL ký sẵn chính là tấm vé: S3 (người soát vé) kiểm chữ ký và hạn; API của bạn (thu ngân) quyết định ai được vé. Và như vé, <strong>ai cầm URL cũng dùng được</strong> — nó là bearer token.</p>

<h3>Xem chạy thật: ký, sửa, hết hạn</h3>
${OUT_24_PRESIGN}
<ul>
  <li>URL mang đủ thứ S3 cần: thuật toán, <code>X-Amz-Credential</code> (mã khoá + phạm vi <code>20261119/ap-southeast-1/s3/aws4_request</code>), ngày giờ, thời hạn (ở đây 5 giây), danh sách header được ký, và chữ ký. Secret của bạn không nằm trong đó.</li>
  <li>Đổi một chữ trong đường dẫn (<code>phong-a1</code> → <code>phong-b2</code>) nhận <code>SignatureDoesNotMatch</code>: chữ ký bao cả đường dẫn, nên vé của object này không mở được object khác.</li>
  <li>Bảy giây sau, cùng URL đó trả <code>Request has expired</code>.</li>
</ul>

<h3>URL sống được bao lâu?</h3>
<ul>
  <li>Ký bằng khoá dài hạn của IAM user: tối đa <strong>7 ngày</strong> (giới hạn SigV4). Console cho từ 1 phút tới 12 giờ.</li>
  <li>Ký bằng <strong>khoá tạm</strong> (role trên ECS, Lambda, EC2, hay SSO): URL chết khi phiên chết, <em>dù bạn xin 7 ngày</em>. Lỗi kinh điển trên production: “liên kết trong email hôm qua hỏng sau một tiếng”.</li>
  <li>Thu hồi hay xoá khoá cũng giết mọi URL nó đã ký.</li>
  <li>Chọn thời hạn ngắn nhất còn dùng được: vài phút cho tải lên, vài phút tới một giờ cho xem. Đừng bao giờ ghi log nguyên URL ký sẵn.</li>
</ul>

<h3>Tải lên thẳng: luồng đi</h3>
<ol>
  <li>Trình duyệt → API: “tôi muốn thêm ảnh cho phòng A1, loại image/jpeg.” API xác thực người dùng và kiểm họ có quyền sửa phòng đó.</li>
  <li>API chọn key (<code>uploads/rooms/A1/&lt;uuid&gt;.jpg</code>), ký một lệnh PUT 5 phút có khoá cứng content type, trả <code>{ url, key }</code>.</li>
  <li>Trình duyệt → S3: <code>PUT url</code> kèm thân tệp. Máy chủ của bạn không chạm vào byte nào.</li>
  <li>Trình duyệt → API: “xong, key = …”. API gọi <code>HeadObject</code>, kiểm cỡ và loại, rồi mới lưu key vào PostgreSQL.</li>
</ol>
${MA_KY_TAI_LEN}
${MA_JAVA_PRESIGN}
<p class="callout">Lệnh ký (<code>getSignedUrl</code> kèm <code>signableHeaders</code>) chính là lệnh mà bộ chấm lab cuối chương chạy thật; bước xác nhận và bản Java (cách tương đương trong Spring Boot) không nằm trong lần chạy đo.</p>

<h3>Hai bẫy của PUT ký sẵn, chứng minh bằng chạy thật</h3>
${OUT_24_KYPUT}
<ul>
  <li><strong>Bẫy 1 — checksum rỗng.</strong> Các bản AWS SDK v3 gần đây mặc định thêm checksum. Khi bạn chỉ <em>ký</em> (chưa có thân), SDK đóng CRC32 của thân rỗng (<code>AAAAAA==</code>) vào URL; lượt tải thật sau đó trượt kiểm toàn vẹn ở nhà cung cấp có kiểm. <code>requestChecksumCalculation: 'WHEN_REQUIRED'</code> bỏ nó đi — đúng dòng có trong <code>r2.ts</code> của cuongthai.com.</li>
  <li><strong>Bẫy 2 — Content-Type chỉ là gợi ý nếu không ký nó.</strong> Chỉ ký <code>host</code> thì trình duyệt gửi <code>text/html</code> cũng được, và S3 lưu một trang HTML có script trên tên miền media của bạn: một lỗ XSS lưu trữ chờ người bấm. Ký thêm <code>content-type</code> (<code>signableHeaders</code>) làm S3 từ chối loại sai bằng <code>SignatureDoesNotMatch</code>. Hàm ký tải lên của cuongthai.com làm đúng việc này, kèm chú thích đã kiểm trên endpoint S3 thật.</li>
</ul>

<h3>Giới hạn cỡ tệp: POST ký sẵn</h3>
<p>PUT ký sẵn không nói được “tối đa 2 MB”. <strong>POST ký sẵn</strong> mang một văn bản policy đã ký kèm điều kiện:</p>
${OUT_24_POST}
<p>Tệp 3 MB bị chính S3 từ chối với <code>EntityTooLarge</code>, trước khi API của bạn thấy gì. Dùng POST khi cỡ tệp quan trọng (ảnh đại diện, CV); vẫn giữ bước kiểm <code>HeadObject</code> — phòng thủ nhiều lớp.</p>

<h3>CORS: vì sao lần đầu trình duyệt tải lên thất bại</h3>
<p>Một trang trên <code>https://labflow.vn</code> gọi sang origin khác (bucket) sẽ kích hoạt yêu cầu <em>preflight</em> <code>OPTIONS</code>. Không có luật CORS thì S3 từ chối, và trình duyệt không bao giờ gửi lệnh PUT.</p>
${MA_CORS}
${OUT_24_CORS}
<p>CORS chỉ dặn trình duyệt; nó <strong>không</strong> phải ranh giới bảo mật — <code>curl</code> lờ nó đi. Bảo mật đến từ chữ ký và quyền bucket. Giữ <code>AllowedOrigins</code> đúng tên miền thật, đừng bao giờ dùng <code>*</code> kèm thông tin đăng nhập.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> mã nhận hàng Shopee dùng một lần, cho một kiện, có hạn — và ai có mã là nhận được. Đừng dán nó vào nhóm chat.</li>
  <li><strong>Đi làm:</strong> “tải lên chạy ở localhost nhưng production báo lỗi CORS” là ticket bạn sẽ nhận. Kiểm theo thứ tự: origin trong luật CORS, phương thức, <code>Content-Type</code> trình duyệt gửi so với cái bạn ký, và hạn URL so với phiên role.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Cho người dùng tải tệp lớn thế nào để API không quá tải?”</strong> — PUT hoặc POST ký sẵn thẳng lên S3; API chỉ cấp quyền, chọn key, ký hạn ngắn, rồi xác nhận bằng HeadObject. Tệp rất lớn thì dùng URL ký sẵn cho từng phần multipart.</li>
  <li><strong>“URL ký sẵn của chúng tôi hết hạn sau một giờ dù đặt 24 giờ. Vì sao?”</strong> — Chúng được ký bằng khoá tạm của role; URL không bao giờ sống lâu hơn phiên đã ký nó. Ký bằng khoá có thời hạn phù hợp, hoặc rút ngắn yêu cầu.</li>
  <li><strong>“URL ký sẵn có an toàn không?”</strong> — Nó là bearer token: chỉ an toàn khi hạn ngắn, gắn với một key và một phương thức, đi qua HTTPS và không bị ghi log. Khoá cứng Content-Type, giới hạn cỡ bằng POST, và kiểm lại sau khi tải lên.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Tạo URL GET bằng <code>aws s3 presign … --expires-in 30</code>, mở nó, đổi một ký tự của key, rồi chờ hết hạn.</li>
  <li>Viết hàm Node.js ký PUT chỉ cho <code>image/jpeg</code>, có ký <code>content-type</code>, và chứng minh PUT kiểu <code>text/html</code> nhận 403.</li>
  <li>Thêm luật CORS cho <code>http://localhost:5173</code> và kiểm preflight bằng <code>curl -X OPTIONS</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đưa ra được <code>SignatureDoesNotMatch</code>, <code>Request has expired</code>, 403 cho lượt tải HTML, và preflight chỉ trả <code>Access-Control-Allow-Origin</code> cho origin của bạn.</p>
${giai('Gợi ý', bash(`
URL=$(aws s3 presign s3://labflow-anh/uploads/a.jpg --expires-in 30)
curl -s "$URL" | head -c 80
# Node: getSignedUrl(s3, new PutObjectCommand({...ContentType:'image/jpeg'}), { expiresIn: 300, signableHeaders: new Set(['content-type']) })
curl -si -X OPTIONS "$S3/labflow-anh/uploads/x.jpg" -H 'Origin: http://localhost:5173' -H 'Access-Control-Request-Method: PUT' | grep -i access-control`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">URL ký sẵn</span><span class="v">URL S3 có chữ ký SigV4 trong chuỗi truy vấn; cho một thao tác tới khi hết hạn.</span></div>
  <div class="kv"><span class="k">X-Amz-Expires</span><span class="v">Thời hạn tính bằng giây; trần 7 ngày và trần theo phiên đã ký.</span></div>
  <div class="kv"><span class="k">SignedHeaders</span><span class="v">Các header nằm trong chữ ký; ký content-type để khoá cứng nó.</span></div>
  <div class="kv"><span class="k">POST ký sẵn</span><span class="v">Tải lên dạng form với policy đã ký (content-length-range, starts-with).</span></div>
  <div class="kv"><span class="k">CORS preflight</span><span class="v">Yêu cầu OPTIONS của trình duyệt hỏi phương thức/header khác origin có được phép không.</span></div>
  <div class="kv"><span class="k">Bearer token</span><span class="v">Ai cầm cũng dùng được — không kiểm thêm danh tính.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>URL ký sẵn cho trình duyệt dùng thẳng object riêng tư; API quyết định, S3 kiểm.</li>
  <li>Nó hết hạn theo thời hạn <em>hoặc</em> theo phiên đã ký, cái nào tới trước; tối đa 7 ngày.</li>
  <li>Ký <code>content-type</code>; tắt checksum thân rỗng khi chỉ ký.</li>
  <li>Dùng POST ký sẵn để giới hạn cỡ; xác nhận bằng HeadObject trước khi lưu key.</li>
  <li>CORS dành cho trình duyệt, không phải bảo mật.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html', '🎟️', 'AWS docs — Tải lên và tải về bằng URL ký sẵn', 'Thời hạn theo từng loại khoá, ai được ký.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html', '🌍', 'AWS docs — CORS cho S3', 'Luật, preflight và cách gỡ lỗi.')}

<h3>Nguồn</h3>
<ul>
  <li>URL ký sẵn: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html</a></li>
  <li>CORS: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html</a></li>
  <li>Điều kiện của POST policy: <a href="https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html</a></li>
  <li>Checksum mặc định của SDK: <a href="https://docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html" target="_blank" rel="noopener">docs.aws.amazon.com/sdkref/latest/guide/feature-dataintegrity.html</a></li>
</ul>
</div>
`;

/* ═════ 2.5 — Phiên bản, vòng đời, lớp lưu trữ ═════ */
const L25_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 5</span>
<h2>2.5 — Versioning, lifecycle rules and storage classes</h2>
<p class="lead">S3 will not lose your data to a broken disk — 11 nines. It will happily lose it to <code>aws s3 rm</code>, a buggy cleanup job or ransomware with your keys. Versioning is the undo button, lifecycle rules are the cleaner who throws away what you no longer need, and storage classes are the shelves from expensive-and-close to cheap-and-far. Together they decide both your safety and your bill.</p>

<h3>The office-archive metaphor</h3>
<p>A good office keeps every signed version of a contract, not just the latest (versioning). Papers on the desk move to a cabinet after a month, to the basement archive after half a year, and drafts are shredded every Friday (lifecycle). Getting a file from the desk takes a second; from the basement, a clerk has to fetch it — and charges for the trip (storage classes and retrieval).</p>

<h3>See it running: delete, then undo</h3>
${OUT_25_PHIENBAN}
<ul>
  <li>Each PUT of the same key creates a <strong>new version</strong> with its own ID; nothing is overwritten.</li>
  <li><code>aws s3 rm</code> did not delete any data. It added a <strong>delete marker</strong> — a zero-byte “latest version” that makes GET answer 404 and hides the key from <code>ls</code>.</li>
  <li><code>list-object-versions</code> shows the truth: two real versions (28 and 11 bytes) and one marker that is <code>IsLatest</code>.</li>
</ul>
${OUT_25_CUU}
<ul>
  <li>Deleting the <em>marker</em> (by its version ID) brings the latest real version back — v2.</li>
  <li>Any older version can be read with <code>--version-id</code>: v1 is still there.</li>
  <li>To delete data permanently you must delete a specific version ID. That needs <code>s3:DeleteObjectVersion</code> — a permission you can keep away from applications.</li>
</ul>

<h3>Versioning facts that bite</h3>
<ul>
  <li>Three states: <em>unversioned</em> (default), <em>Enabled</em>, <em>Suspended</em>. Once enabled, a bucket can never return to unversioned.</li>
  <li><strong>Every version is billed.</strong> A 100 MB file overwritten every day costs 3 GB a month. Always pair versioning with a rule that expires noncurrent versions.</li>
  <li>A bucket with versions cannot be removed by <code>aws s3 rb --force</code> — it deletes current objects but leaves versions and markers (lesson 2.7 shows the error and the proper cleanup).</li>
  <li>Stronger protection: <strong>MFA Delete</strong> (root + MFA needed to delete versions) and <strong>Object Lock</strong> (WORM: governance or compliance mode, retention periods, legal hold) — the standard answer to ransomware that wants to delete your backups.</li>
</ul>

<h3>Storage classes</h3>
<table>
  <thead><tr><th>Class</th><th>For</th><th>First byte</th><th>Minimum duration / size</th></tr></thead>
  <tbody>
    <tr><td>Standard</td><td>Hot data, accessed often</td><td>milliseconds</td><td>none</td></tr>
    <tr><td>Intelligent-Tiering</td><td>Unknown or changing access</td><td>milliseconds (archive tiers optional)</td><td>none; small monitoring fee per object; &lt; 128 KB stays in frequent tier</td></tr>
    <tr><td>Standard-IA</td><td>Read about once a month</td><td>milliseconds</td><td>30 days, 128 KB; per-GB retrieval fee</td></tr>
    <tr><td>One Zone-IA</td><td>Re-creatable copies</td><td>milliseconds</td><td>30 days, 128 KB; one AZ only</td></tr>
    <tr><td>Glacier Instant Retrieval</td><td>Archive read once a quarter</td><td>milliseconds</td><td>90 days, 128 KB</td></tr>
    <tr><td>Glacier Flexible Retrieval</td><td>Archive, backups</td><td>minutes to hours (restore first)</td><td>90 days</td></tr>
    <tr><td>Glacier Deep Archive</td><td>Compliance records kept for years</td><td>within 12 hours (restore first)</td><td>180 days</td></tr>
    <tr><td>Express One Zone</td><td>Latency-critical, one AZ</td><td>single-digit ms</td><td>none</td></tr>
  </tbody>
</table>
<p>All classes except the One Zone ones store data in at least three AZs. The cheaper the storage, the more you pay to read, and the longer you are billed even if you delete early: an object deleted from Standard-IA after 10 days is billed for 30.</p>

<h3>Lifecycle rules in action</h3>
${MA_VONG_DOI}
${OUT_25_VONGDOI}
<ul>
  <li>The response <code>TransitionDefaultMinimumObjectSize: all_storage_classes_128K</code> is the current default: objects under 128 KB are not transitioned, because the per-object transition fee would cost more than it saves.</li>
  <li>An object uploaded under <code>tam/</code> immediately carries an <code>Expiration</code> header naming the date and the rule — S3 tells you when it will delete it.</li>
  <li><code>AbortIncompleteMultipartUpload</code> removes parts of uploads that never completed. They are invisible in <code>ls</code> but billed; every bucket that receives uploads should have this rule.</li>
  <li>An object in <code>GLACIER</code> cannot be read directly: <code>InvalidObjectState</code>. You request a <code>restore-object</code> (Expedited, Standard or Bulk), wait, then read a temporary copy for the number of days you asked.</li>
</ul>
<p class="callout warn">Lifecycle actions are asynchronous: S3 runs them in the background, usually within a day or two of the date. LocalStack accepted and reported the rules; the actual transitions are best observed on a real account over days, not in a lab session.</p>

<h3>Real story: Code Spaces, 2014</h3>
<p>Code Spaces, a code-hosting company, received an extortion demand from someone who had obtained access to its AWS control panel. When the company tried to lock them out, the attacker deleted machines, EBS snapshots, S3 buckets and backups — all in the same account. The company announced it could not continue (lesson 0.9). Versioning alone would not have saved them: the attacker had the power to delete versions too. What would have: backups replicated to a <strong>separate account</strong> the main credentials cannot touch, Object Lock in compliance mode, and MFA on every human login.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> the phone's “Recently deleted” album keeps photos 30 days — versioning plus a noncurrent-expiration rule.</li>
  <li><strong>At work:</strong> when you inherit a bucket, run <code>get-bucket-versioning</code> and <code>get-bucket-lifecycle-configuration</code> first. Versioning without lifecycle is a growing bill; lifecycle without versioning means one bad script deletes data forever.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“A developer ran <code>aws s3 rm --recursive</code> on production. Can we recover?”</strong> — Yes if versioning was enabled: remove the delete markers (or copy the previous versions back). If not, only from backups or replication.</li>
  <li><strong>“Logs must be kept 7 years and are rarely read. Design the storage.”</strong> — Lifecycle: Standard for 30 days → Standard-IA or Glacier Instant Retrieval → Glacier Deep Archive after 180 days → expire after 7 years; Object Lock compliance if regulators require immutability.</li>
  <li><strong>“Why did our bill grow after enabling versioning?”</strong> — Noncurrent versions and delete markers are stored and billed; add <code>NoncurrentVersionExpiration</code> and clean expired delete markers.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Enable versioning on a bucket, upload the same key three times, delete it, and list versions and markers.</li>
  <li>Restore the latest version by deleting the marker; read the oldest version with <code>--version-id</code>.</li>
  <li>Add a lifecycle rule: <code>tam/</code> expires after 1 day, incomplete uploads aborted after 1 day, noncurrent versions expire after 30 days. Upload into <code>tam/</code> and read the <code>Expiration</code> header.</li>
</ol>
<p><strong>Done when:</strong> you can show a delete marker as <code>IsLatest</code>, the restored content, an old version's content, and an <code>Expiration</code> value with your rule ID.</p>
${giai('Hint', bash(`
aws s3api put-bucket-versioning --bucket b --versioning-configuration Status=Enabled
aws s3api list-object-versions --bucket b --query 'DeleteMarkers[].[Key,VersionId,IsLatest]' --output text
aws s3api delete-object --bucket b --key noi-quy.txt --version-id <ID-of-the-marker>
aws s3api put-object --bucket b --key tam/x.jpg --body x.jpg --query Expiration --output text`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version ID</span><span class="v">Identifier of one stored version of a key in a versioned bucket.</span></div>
  <div class="kv"><span class="k">Delete marker</span><span class="v">Zero-byte latest version created by a delete without version ID; GET returns 404.</span></div>
  <div class="kv"><span class="k">Noncurrent version</span><span class="v">Any version that is not the latest; billed like any object.</span></div>
  <div class="kv"><span class="k">Lifecycle rule</span><span class="v">Filter (prefix/tags/size) + actions: transition, expiration, abort incomplete uploads.</span></div>
  <div class="kv"><span class="k">Minimum storage duration</span><span class="v">Days you are billed for even if you delete earlier (IA 30, Glacier 90, Deep Archive 180).</span></div>
  <div class="kv"><span class="k">Object Lock</span><span class="v">WORM retention (governance/compliance) and legal hold; blocks deletion of versions.</span></div>
  <div class="kv"><span class="k">Restore</span><span class="v">Temporary readable copy of a Glacier Flexible/Deep Archive object.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Versioning turns deletes into delete markers; deleting the marker is “undo”.</li>
  <li>Every version is billed — always add a noncurrent-version expiration rule.</li>
  <li>Lifecycle moves data to cheaper classes, expires temp files and aborts dead multipart uploads.</li>
  <li>Cheaper classes trade price for retrieval fees, minimum durations and slower access.</li>
  <li>Against an attacker with your keys: separate backup account, Object Lock, MFA.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html', '🗑️', 'AWS docs — Working with delete markers', 'What GET, LIST and DELETE do with markers.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html', '🔒', 'AWS docs — S3 Object Lock', 'Governance vs compliance mode, retention, legal hold.')}

<h3>Sources</h3>
<ul>
  <li>Delete markers: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html</a></li>
  <li>Versioning: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html</a></li>
  <li>Storage classes (durations, minimum sizes): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html</a></li>
  <li>Lifecycle transitions and the 128 KB default: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html</a></li>
  <li>Object Lock: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html</a></li>
</ul>
</div>
`;

const L25_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 5</span>
<h2>2.5 — Phiên bản, luật vòng đời và lớp lưu trữ</h2>
<p class="lead">S3 không làm mất dữ liệu vì hỏng ổ — 11 số 9. Nhưng nó vui vẻ để mất dữ liệu vì <code>aws s3 rm</code>, một job dọn dẹp có lỗi, hay mã độc tống tiền cầm khoá của bạn. Versioning là nút hoàn tác, luật vòng đời là người dọn dẹp vứt thứ không còn cần, và lớp lưu trữ là các kệ từ đắt-mà-gần tới rẻ-mà-xa. Cùng nhau chúng quyết định cả độ an toàn lẫn hoá đơn của bạn.</p>

<h3>Hình dung: kho lưu trữ văn phòng</h3>
<p>Văn phòng tốt giữ mọi bản hợp đồng đã ký, không chỉ bản mới nhất (versioning). Giấy tờ trên bàn sau một tháng chuyển vào tủ, sau nửa năm xuống kho tầng hầm, còn bản nháp thì thứ Sáu nào cũng cho vào máy huỷ (vòng đời). Lấy tệp trên bàn mất một giây; dưới tầng hầm phải nhờ nhân viên đi lấy — và tính phí chuyến đi (lớp lưu trữ và phí truy xuất).</p>

<h3>Xem chạy thật: xoá, rồi hoàn tác</h3>
${OUT_25_PHIENBAN}
<ul>
  <li>Mỗi lần PUT cùng một key tạo <strong>phiên bản mới</strong> có ID riêng; không có gì bị ghi đè.</li>
  <li><code>aws s3 rm</code> không xoá chút dữ liệu nào. Nó thêm một <strong>dấu xoá</strong> (delete marker) — một “phiên bản mới nhất” 0 byte làm GET trả 404 và giấu key khỏi <code>ls</code>.</li>
  <li><code>list-object-versions</code> cho thấy sự thật: hai phiên bản thật (28 và 11 byte) và một dấu xoá đang là <code>IsLatest</code>.</li>
</ul>
${OUT_25_CUU}
<ul>
  <li>Xoá chính <em>dấu xoá</em> (theo version ID của nó) đưa phiên bản thật mới nhất trở lại — v2.</li>
  <li>Bản cũ hơn đọc được bằng <code>--version-id</code>: v1 vẫn còn nguyên.</li>
  <li>Muốn xoá vĩnh viễn phải xoá đúng một version ID. Việc đó cần quyền <code>s3:DeleteObjectVersion</code> — quyền bạn có thể giữ ngoài tầm tay ứng dụng.</li>
</ul>

<h3>Những điều về versioning hay làm đau</h3>
<ul>
  <li>Ba trạng thái: <em>chưa bật</em> (mặc định), <em>Enabled</em>, <em>Suspended</em>. Đã bật thì bucket không bao giờ quay lại “chưa bật”.</li>
  <li><strong>Mọi phiên bản đều tính tiền.</strong> Tệp 100 MB ghi đè mỗi ngày là 3 GB mỗi tháng. Luôn đi kèm versioning một luật xoá phiên bản cũ.</li>
  <li>Bucket có phiên bản không gỡ được bằng <code>aws s3 rb --force</code> — lệnh đó xoá object hiện tại nhưng để lại phiên bản và dấu xoá (bài 2.7 cho xem lỗi và cách dọn đúng).</li>
  <li>Bảo vệ mạnh hơn: <strong>MFA Delete</strong> (cần root + MFA mới xoá được phiên bản) và <strong>Object Lock</strong> (WORM: chế độ governance hoặc compliance, thời hạn giữ, legal hold) — câu trả lời chuẩn cho mã độc tống tiền muốn xoá bản sao lưu của bạn.</li>
</ul>

<h3>Lớp lưu trữ</h3>
<table>
  <thead><tr><th>Lớp</th><th>Dùng cho</th><th>Byte đầu tiên</th><th>Thời gian / cỡ tối thiểu</th></tr></thead>
  <tbody>
    <tr><td>Standard</td><td>Dữ liệu nóng, đọc thường xuyên</td><td>mili giây</td><td>không</td></tr>
    <tr><td>Intelligent-Tiering</td><td>Không rõ hoặc hay đổi kiểu truy cập</td><td>mili giây (tầng lưu trữ tuỳ chọn)</td><td>không; phí theo dõi nhỏ mỗi object; &lt; 128 KB ở tầng thường xuyên</td></tr>
    <tr><td>Standard-IA</td><td>Đọc khoảng tháng một lần</td><td>mili giây</td><td>30 ngày, 128 KB; phí truy xuất theo GB</td></tr>
    <tr><td>One Zone-IA</td><td>Bản sao dựng lại được</td><td>mili giây</td><td>30 ngày, 128 KB; chỉ một AZ</td></tr>
    <tr><td>Glacier Instant Retrieval</td><td>Lưu trữ đọc mỗi quý</td><td>mili giây</td><td>90 ngày, 128 KB</td></tr>
    <tr><td>Glacier Flexible Retrieval</td><td>Lưu trữ, sao lưu</td><td>vài phút tới vài giờ (phải khôi phục trước)</td><td>90 ngày</td></tr>
    <tr><td>Glacier Deep Archive</td><td>Hồ sơ tuân thủ giữ nhiều năm</td><td>trong vòng 12 giờ (phải khôi phục trước)</td><td>180 ngày</td></tr>
    <tr><td>Express One Zone</td><td>Cần độ trễ cực thấp, một AZ</td><td>vài mili giây</td><td>không</td></tr>
  </tbody>
</table>
<p>Mọi lớp trừ hai lớp One Zone đều lưu dữ liệu trên ít nhất ba AZ. Lưu càng rẻ thì đọc càng đắt, và bị tính tiền càng lâu dù xoá sớm: object xoá khỏi Standard-IA sau 10 ngày vẫn bị tính 30 ngày.</p>

<h3>Luật vòng đời chạy thật</h3>
${MA_VONG_DOI}
${OUT_25_VONGDOI}
<ul>
  <li>Phản hồi <code>TransitionDefaultMinimumObjectSize: all_storage_classes_128K</code> là mặc định hiện nay: object dưới 128 KB không được chuyển lớp, vì phí chuyển tính theo từng object còn đắt hơn khoản tiết kiệm.</li>
  <li>Object tải vào <code>tam/</code> lập tức mang header <code>Expiration</code> ghi ngày và tên luật — S3 nói trước khi nào nó sẽ xoá.</li>
  <li><code>AbortIncompleteMultipartUpload</code> dọn các phần của lượt tải không bao giờ hoàn tất. Chúng vô hình trong <code>ls</code> nhưng vẫn tính tiền; bucket nào nhận tải lên cũng nên có luật này.</li>
  <li>Object ở lớp <code>GLACIER</code> không đọc thẳng được: <code>InvalidObjectState</code>. Bạn gửi <code>restore-object</code> (Expedited, Standard hoặc Bulk), chờ, rồi đọc bản tạm trong số ngày đã xin.</li>
</ul>
<p class="callout warn">Các hành động vòng đời chạy bất đồng bộ: S3 làm ngầm, thường trong một hai ngày sau mốc. LocalStack đã nhận và báo đúng các luật; việc chuyển lớp thật nên quan sát trên tài khoản thật qua nhiều ngày, không phải trong một buổi lab.</p>

<h3>Chuyện thật: Code Spaces, 2014</h3>
<p>Code Spaces, một công ty lưu trữ mã nguồn, nhận yêu cầu tống tiền từ kẻ đã vào được bảng điều khiển AWS của họ. Khi công ty tìm cách đẩy kẻ đó ra, hắn xoá máy, snapshot EBS, bucket S3 và bản sao lưu — tất cả cùng một tài khoản. Công ty tuyên bố không thể tiếp tục hoạt động (bài 0.9). Chỉ versioning thì không cứu được họ: kẻ tấn công có quyền xoá cả phiên bản. Thứ cứu được: bản sao lưu nhân bản sang <strong>tài khoản riêng</strong> mà khoá chính không chạm tới, Object Lock chế độ compliance, và MFA cho mọi lần đăng nhập của người.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> album “Đã xoá gần đây” của điện thoại giữ ảnh 30 ngày — versioning cộng luật xoá phiên bản cũ.</li>
  <li><strong>Đi làm:</strong> nhận bàn giao một bucket, chạy <code>get-bucket-versioning</code> và <code>get-bucket-lifecycle-configuration</code> trước tiên. Versioning không có vòng đời là hoá đơn cứ phình; vòng đời không có versioning nghĩa là một script hỏng xoá dữ liệu vĩnh viễn.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Một dev lỡ chạy <code>aws s3 rm --recursive</code> trên production. Cứu được không?”</strong> — Được nếu đã bật versioning: gỡ các dấu xoá (hoặc chép phiên bản trước về). Không bật thì chỉ còn bản sao lưu hoặc bản nhân bản.</li>
  <li><strong>“Log phải giữ 7 năm và hiếm khi đọc. Thiết kế lưu trữ đi.”</strong> — Vòng đời: Standard 30 ngày → Standard-IA hoặc Glacier Instant Retrieval → Glacier Deep Archive sau 180 ngày → xoá sau 7 năm; Object Lock compliance nếu cơ quan quản lý đòi bất biến.</li>
  <li><strong>“Vì sao hoá đơn tăng sau khi bật versioning?”</strong> — Phiên bản cũ và dấu xoá vẫn được lưu và tính tiền; thêm <code>NoncurrentVersionExpiration</code> và dọn dấu xoá hết hạn.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Bật versioning cho một bucket, tải cùng một key ba lần, xoá nó, rồi liệt kê phiên bản và dấu xoá.</li>
  <li>Khôi phục phiên bản mới nhất bằng cách xoá dấu xoá; đọc phiên bản cũ nhất bằng <code>--version-id</code>.</li>
  <li>Thêm luật vòng đời: <code>tam/</code> hết hạn sau 1 ngày, huỷ tải dở sau 1 ngày, phiên bản cũ hết hạn sau 30 ngày. Tải vào <code>tam/</code> và đọc header <code>Expiration</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đưa ra được một dấu xoá đang <code>IsLatest</code>, nội dung sau khôi phục, nội dung một phiên bản cũ, và giá trị <code>Expiration</code> có tên luật của bạn.</p>
${giai('Gợi ý', bash(`
aws s3api put-bucket-versioning --bucket b --versioning-configuration Status=Enabled
aws s3api list-object-versions --bucket b --query 'DeleteMarkers[].[Key,VersionId,IsLatest]' --output text
aws s3api delete-object --bucket b --key noi-quy.txt --version-id <ID-cua-dau-xoa>
aws s3api put-object --bucket b --key tam/x.jpg --body x.jpg --query Expiration --output text`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version ID</span><span class="v">Mã định danh của một phiên bản đã lưu của key trong bucket có versioning.</span></div>
  <div class="kv"><span class="k">Delete marker</span><span class="v">Phiên bản mới nhất 0 byte sinh ra khi xoá không kèm version ID; GET trả 404.</span></div>
  <div class="kv"><span class="k">Phiên bản cũ</span><span class="v">Mọi phiên bản không phải mới nhất; tính tiền như object thường.</span></div>
  <div class="kv"><span class="k">Luật vòng đời</span><span class="v">Bộ lọc (tiền tố/tag/cỡ) + hành động: chuyển lớp, hết hạn, huỷ tải dở.</span></div>
  <div class="kv"><span class="k">Thời gian lưu tối thiểu</span><span class="v">Số ngày vẫn bị tính dù xoá sớm (IA 30, Glacier 90, Deep Archive 180).</span></div>
  <div class="kv"><span class="k">Object Lock</span><span class="v">Giữ kiểu WORM (governance/compliance) và legal hold; chặn xoá phiên bản.</span></div>
  <div class="kv"><span class="k">Restore</span><span class="v">Bản tạm đọc được của object Glacier Flexible/Deep Archive.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Versioning biến lệnh xoá thành dấu xoá; xoá dấu xoá là “hoàn tác”.</li>
  <li>Mọi phiên bản đều tính tiền — luôn thêm luật xoá phiên bản cũ.</li>
  <li>Vòng đời chuyển dữ liệu sang lớp rẻ hơn, xoá tệp tạm và huỷ lượt multipart chết.</li>
  <li>Lớp rẻ hơn đổi giá lấy phí truy xuất, thời gian tối thiểu và truy cập chậm hơn.</li>
  <li>Chống kẻ tấn công cầm khoá của bạn: tài khoản sao lưu riêng, Object Lock, MFA.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html', '🗑️', 'AWS docs — Làm việc với delete marker', 'GET, LIST, DELETE làm gì với dấu xoá.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html', '🔒', 'AWS docs — S3 Object Lock', 'Chế độ governance và compliance, thời hạn giữ, legal hold.')}

<h3>Nguồn</h3>
<ul>
  <li>Delete marker: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html</a></li>
  <li>Versioning: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html</a></li>
  <li>Lớp lưu trữ (thời gian, cỡ tối thiểu): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html</a></li>
  <li>Chuyển lớp và mặc định 128 KB: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html</a></li>
  <li>Object Lock: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html</a></li>
</ul>
</div>
`;

/* ═════ 2.6 — Góc hacker: bucket công khai, bucket bỏ hoang ═════ */
const MA_CHU_SO_HUU = bash(`
# Always name the owner you expect: S3 answers 403 if the bucket now belongs to another account
aws s3api get-object --bucket labflow-ban-cai-dat --key cai.sh cai.sh --expected-bucket-owner 123456789012
# SDK: new GetObjectCommand({ Bucket, Key, ExpectedBucketOwner: '123456789012' })`);

const L26_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 6</span>
<h2>2.6 — Hacker’s view: public buckets that leaked millions of records</h2>
<p class="lead">For a decade, “an open S3 bucket” has been one of the most common headlines in data-breach news. Nobody broke encryption; scripts simply asked for bucket names and read what answered. This lesson walks through four real cases, runs the attacker's two techniques against a local lab — guessing names and taking over abandoned buckets — and gives you a five-minute check for your own account.</p>

<h3>Four real cases</h3>
<table>
  <thead><tr><th>When</th><th>Who</th><th>What was exposed</th><th>Root cause</th></tr></thead>
  <tbody>
    <tr><td>06/2017</td><td>Verizon, via vendor NICE Systems (found by UpGuard)</td><td>Names, addresses, account PINs of up to 14 million customers</td><td>A vendor's bucket set to public; notified 13/06, closed 22/06 — nine days later</td></tr>
    <tr><td>09/2017</td><td>Accenture (found by UpGuard on 17/09)</td><td>Four buckets: API data, credentials, certificates, decryption keys; one bucket of 137 GB</td><td>Buckets configured for public download</td></tr>
    <tr><td>02/2022</td><td>Pegasus Airlines' EFB system (found by SafetyDetectives on 28/02)</td><td>~23 million files, ~6.5 TB: flight data, crew PII, plain-text passwords and secret keys in source code</td><td>Misconfigured bucket, no authentication</td></tr>
    <tr><td>02/2025</td><td>watchTowr Labs research</td><td>~150 <em>abandoned</em> bucket names still requested by software updaters, government and CI pipelines: &gt; 8 million requests in 2 months</td><td>Owners deleted buckets that code still referenced; anyone could re-register the names</td></tr>
  </tbody>
</table>
<p>The first three are the same story: data in a bucket, a permission that said “everyone”. The fourth is newer and nastier: the bucket was gone, but the code still trusted the <em>name</em>. watchTowr registered the names, logged who asked (updates, unsigned binaries, VM images, CloudFormation templates…) and handed them to AWS to sinkhole. A real attacker would have served malware instead.</p>

<h3>Technique 1 — guess the name, read the error code</h3>
<p>Bucket names are not secrets. Company name plus common suffixes covers a surprising share. The anonymous response code tells the scanner everything:</p>
<ul>
  <li><code>404 NoSuchBucket</code> — no such name, move on.</li>
  <li><code>403 AccessDenied</code> — the bucket <strong>exists</strong> and is private; note it for later.</li>
  <li><code>200</code> with a key list — jackpot.</li>
</ul>
${OUT_26_QUET}
<p>This ran only against the local versitygw lab. The <code>labflow-backup</code> bucket had a careless policy, and the scanner found a database dump and a <code>.env</code> with a password and an access key (a placeholder here). Real scanners do exactly this at Internet scale, and since 2024 AWS no longer bills owners for unauthorized requests that return errors (the Pocwierz case, lesson 0.9) — but it cannot un-leak what a 200 returned.</p>

<h3>Technique 2 — take over an abandoned bucket</h3>
${OUT_26_BOHOANG}
<p>Step by step: an install script lives in a bucket; machines download and run it every night. The team “cleans up” and deletes the bucket — but forgets one cron job, one README, one Dockerfile. Because names are global and freed on delete, a stranger creates the same name and uploads their own <code>cai.sh</code>. The next night, your machines run the stranger's code. No password was stolen; trust was attached to a name that changed owner.</p>
<p>Defenses, strongest first:</p>
<ul>
  <li><strong>Verify what you download</strong>: pin a checksum or a signature, never <code>curl … | sh</code> from a bucket URL.</li>
  <li><strong>Say who should own the bucket</strong> on every call:</li>
</ul>
${MA_CHU_SO_HUU}
<ul>
  <li><strong>Do not delete buckets that code may still reference</strong>; empty them and keep the name, or search all repos first.</li>
  <li><strong>Use the account regional namespace</strong> (lesson 2.1) for new buckets: names ending in <code>-&lt;account&gt;-&lt;region&gt;-an</code> cannot be created by another account.</li>
</ul>

<h3>Check your own buckets in five minutes</h3>
${OUT_26_TUKIEM}
<ol>
  <li>Account-level Block Public Access: <code>aws s3control get-public-access-block --account-id &lt;id&gt;</code> — all four true.</li>
  <li>For each bucket: <code>get-bucket-policy-status</code> and an anonymous <code>curl</code> on the bucket URL with <code>?list-type=2</code>.</li>
  <li>IAM Access Analyzer for S3 lists buckets shared publicly or with other accounts; Amazon Macie finds personal data inside them.</li>
  <li>Search your repos, CI files and scripts for every bucket name and confirm each one still belongs to you.</li>
</ol>
<p><code>uploads/phong-a1.jpg</code> being public is intended (a public image). <code>labflow-backup</code> listing anonymously is an incident: rotate the leaked password and key <em>now</em>, then close the bucket, then investigate who downloaded what (server access logs or CloudTrail data events, if they were on).</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> a phone number you gave up is reassigned to someone else after a while — and they start receiving your bank's OTP. A deleted bucket name is that phone number.</li>
  <li><strong>At work:</strong> when you decommission anything (bucket, domain, package name), make a checklist: who still points at it? Leaving an empty bucket costs nothing; losing the name can cost the company.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How do attackers find open buckets?”</strong> — They generate likely names and read the anonymous status code (404 none, 403 exists, 200 open), plus names leaked in front-end code, DNS, GitHub and old documentation.</li>
  <li><strong>“What is a bucket takeover and how do you prevent it?”</strong> — Re-registering a deleted bucket name that code still trusts. Prevent with integrity checks on downloads, <code>ExpectedBucketOwner</code>, not deleting referenced buckets, and the account regional namespace.</li>
  <li><strong>“You find a public bucket with a database dump. Your first three steps?”</strong> — Rotate every secret in it, block public access, then use logs to scope who accessed it and report per company policy.</li>
</ol>

<h3>🧪 Practice (15 minutes, local only)</h3>
<div class="callout ok"><ol>
  <li>Never scan anyone else's buckets. On your versitygw lab, create <code>ten-ban-dev</code> (private) and <code>ten-ban-backup</code> (with a wrong public policy).</li>
  <li>Write a tiny scanner like <code>quet.sh</code> and read the three codes.</li>
  <li>Simulate a takeover on LocalStack: delete a bucket and re-create it with a different file, then add <code>--expected-bucket-owner</code> to your download command. Note: LocalStack 4.12 ignores this header (tested 19/11/2026 — a wrong owner still downloads); on AWS a wrong owner gets <code>403 AccessDenied</code>, so test that part on a real account.</li>
</ol>
<p><strong>Done when:</strong> your scanner prints one 404, one 403 and one 200, and you can explain why 403 still leaks information.</p>
${giai('Hint: the scanner loop', bash(`
for hau in "" -dev -backup; do
  b="ten-ban$hau"
  curl -s -o /dev/null -w "$b ⇒ %{http_code}\\n" "$S3/$b?list-type=2"
done`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket enumeration</span><span class="v">Guessing bucket names and reading anonymous response codes.</span></div>
  <div class="kv"><span class="k">Bucket takeover / squatting</span><span class="v">Registering a freed bucket name that someone still trusts.</span></div>
  <div class="kv"><span class="k">ExpectedBucketOwner</span><span class="v">Request parameter/header; S3 refuses if the bucket belongs to another account.</span></div>
  <div class="kv"><span class="k">Sinkhole</span><span class="v">Taking a dangerous name out of circulation so nobody can abuse it.</span></div>
  <div class="kv"><span class="k">IAM Access Analyzer</span><span class="v">Finds resources shared outside your account, including public buckets.</span></div>
  <div class="kv"><span class="k">Amazon Macie</span><span class="v">Scans S3 for personal and sensitive data.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Bucket leaks are configuration mistakes, found by scripts in hours.</li>
  <li>403 means “exists”; names are not secrets.</li>
  <li>Deleting a bucket frees its name for attackers; code that trusts the name can be hijacked.</li>
  <li>Verify downloads, pin the expected owner, keep referenced names, use account-regional names.</li>
  <li>If something leaked: rotate secrets first, then close, then investigate.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/', '🕳️', 'watchTowr Labs — 8 Million Requests Later (02/2025)', 'The abandoned-bucket research, step by step.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html', '🪪', 'AWS docs — Verifying bucket ownership', 'ExpectedBucketOwner on every request.')}

<h3>Sources</h3>
<ul>
  <li>Verizon / NICE Systems (UpGuard): <a href="https://www.upguard.com/labs/data-leaks/verizon-cloud-leak" target="_blank" rel="noopener">upguard.com/labs/data-leaks/verizon-cloud-leak</a></li>
  <li>Accenture (UpGuard): <a href="https://www.upguard.com/labs/data-leaks/cloud-leak-accenture" target="_blank" rel="noopener">upguard.com/labs/data-leaks/cloud-leak-accenture</a></li>
  <li>Pegasus EFB (SafetyDetectives): <a href="https://www.safetydetectives.com/news/pegasus-leak-report/" target="_blank" rel="noopener">safetydetectives.com/news/pegasus-leak-report/</a></li>
  <li>watchTowr, published 04/02/2025: <a href="https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/" target="_blank" rel="noopener">labs.watchtowr.com/8-million-requests-later-…</a></li>
  <li>Bucket namespaces: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html</a></li>
  <li>Bucket owner condition: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html</a></li>
</ul>
</div>
`;

const L26_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 6</span>
<h2>2.6 — Góc hacker: bucket công khai làm lộ hàng triệu bản ghi</h2>
<p class="lead">Suốt một thập kỷ, “một bucket S3 để mở” là một trong những tiêu đề thường gặp nhất trong tin lộ dữ liệu. Không ai phá mã hoá; script chỉ việc hỏi tên bucket và đọc thứ trả lời. Bài này đi qua bốn vụ thật, chạy hai kỹ thuật của kẻ tấn công trên phòng lab cục bộ — đoán tên và chiếm bucket bỏ hoang — rồi đưa bạn một phép kiểm năm phút cho chính tài khoản mình.</p>

<h3>Bốn vụ thật</h3>
<table>
  <thead><tr><th>Khi nào</th><th>Ai</th><th>Lộ gì</th><th>Gốc rễ</th></tr></thead>
  <tbody>
    <tr><td>06/2017</td><td>Verizon, qua nhà cung cấp NICE Systems (UpGuard phát hiện)</td><td>Tên, địa chỉ, mã PIN tài khoản của tới 14 triệu khách</td><td>Bucket của nhà cung cấp để công khai; báo 13/06, đóng 22/06 — chín ngày sau</td></tr>
    <tr><td>09/2017</td><td>Accenture (UpGuard phát hiện ngày 17/09)</td><td>Bốn bucket: dữ liệu API, thông tin đăng nhập, chứng chỉ, khoá giải mã; một bucket 137 GB</td><td>Bucket cấu hình cho tải về công khai</td></tr>
    <tr><td>02/2022</td><td>Hệ thống EFB của Pegasus Airlines (SafetyDetectives phát hiện ngày 28/02)</td><td>~23 triệu tệp, ~6,5 TB: dữ liệu bay, thông tin cá nhân tổ bay, mật khẩu và khoá bí mật viết thẳng trong mã nguồn</td><td>Bucket cấu hình sai, không xác thực</td></tr>
    <tr><td>02/2025</td><td>Nghiên cứu của watchTowr Labs</td><td>~150 tên bucket <em>bỏ hoang</em> vẫn bị trình cập nhật phần mềm, cơ quan chính phủ và pipeline CI gọi tới: hơn 8 triệu request trong 2 tháng</td><td>Chủ cũ xoá bucket mà mã vẫn trỏ tới; ai cũng đăng ký lại được tên</td></tr>
  </tbody>
</table>
<p>Ba vụ đầu là cùng một câu chuyện: dữ liệu trong bucket, một quyền ghi “mọi người”. Vụ thứ tư mới hơn và hiểm hơn: bucket đã mất, nhưng mã vẫn tin vào <em>cái tên</em>. watchTowr đăng ký lại các tên đó, ghi lại ai đang hỏi (bản cập nhật, tệp chạy chưa ký, ảnh máy ảo, mẫu CloudFormation…) rồi giao cho AWS “sinkhole”. Kẻ tấn công thật thì đã trả về mã độc.</p>

<h3>Kỹ thuật 1 — đoán tên, đọc mã lỗi</h3>
<p>Tên bucket không phải bí mật. Tên công ty cộng các hậu tố phổ biến đã trúng một phần đáng kể. Mã phản hồi ẩn danh cho máy quét biết hết:</p>
<ul>
  <li><code>404 NoSuchBucket</code> — không có tên này, đi tiếp.</li>
  <li><code>403 AccessDenied</code> — bucket <strong>có tồn tại</strong> và riêng tư; ghi lại để dò sau.</li>
  <li><code>200</code> kèm danh sách key — trúng lớn.</li>
</ul>
${OUT_26_QUET}
<p>Phép này chỉ chạy vào phòng lab versitygw cục bộ. Bucket <code>labflow-backup</code> có policy cẩu thả, và máy quét tìm ra một bản dump CSDL cùng tệp <code>.env</code> chứa mật khẩu và khoá truy cập (ở đây là khoá giữ chỗ). Máy quét thật làm đúng việc này ở quy mô cả Internet, và từ 2024 AWS không còn tính tiền chủ bucket cho request trái phép trả lỗi (vụ Pocwierz, bài 0.9) — nhưng AWS không thể “thu hồi” thứ một mã 200 đã trả ra.</p>

<h3>Kỹ thuật 2 — chiếm bucket bỏ hoang</h3>
${OUT_26_BOHOANG}
<p>Từng bước: một script cài đặt nằm trong bucket; các máy tải về và chạy nó mỗi đêm. Nhóm “dọn dẹp” và xoá bucket — nhưng quên một cron job, một README, một Dockerfile. Vì tên là toàn cầu và được trả lại khi xoá, một người lạ tạo đúng tên đó và tải lên <code>cai.sh</code> của họ. Đêm sau, máy của bạn chạy mã của người lạ. Không mật khẩu nào bị đánh cắp; niềm tin gắn vào một cái tên đã đổi chủ.</p>
<p>Cách phòng, mạnh nhất trước:</p>
<ul>
  <li><strong>Kiểm thứ bạn tải về</strong>: ghim checksum hoặc chữ ký, không bao giờ <code>curl … | sh</code> từ URL bucket.</li>
  <li><strong>Nói rõ ai phải là chủ bucket</strong> trong mọi lệnh gọi:</li>
</ul>
${MA_CHU_SO_HUU}
<ul>
  <li><strong>Đừng xoá bucket mà mã còn có thể trỏ tới</strong>; làm rỗng và giữ tên, hoặc tìm trong mọi kho mã trước.</li>
  <li><strong>Dùng không gian tên theo tài khoản + region</strong> (bài 2.1) cho bucket mới: tên kết thúc bằng <code>-&lt;tài-khoản&gt;-&lt;region&gt;-an</code> thì tài khoản khác không tạo được.</li>
</ul>

<h3>Kiểm bucket của chính bạn trong năm phút</h3>
${OUT_26_TUKIEM}
<ol>
  <li>Block Public Access cấp tài khoản: <code>aws s3control get-public-access-block --account-id &lt;id&gt;</code> — cả bốn là true.</li>
  <li>Với từng bucket: <code>get-bucket-policy-status</code> và một lệnh <code>curl</code> ẩn danh vào URL bucket kèm <code>?list-type=2</code>.</li>
  <li>IAM Access Analyzer for S3 liệt kê bucket chia sẻ công khai hoặc cho tài khoản khác; Amazon Macie tìm dữ liệu cá nhân bên trong.</li>
  <li>Tìm trong kho mã, tệp CI và script mọi tên bucket và xác nhận từng cái vẫn thuộc về bạn.</li>
</ol>
<p><code>uploads/phong-a1.jpg</code> công khai là có chủ đích (ảnh công khai). <code>labflow-backup</code> bị liệt kê ẩn danh là một sự cố: xoay mật khẩu và khoá bị lộ <em>ngay</em>, rồi đóng bucket, rồi điều tra ai đã tải gì (server access log hoặc CloudTrail data event, nếu đã bật).</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> số điện thoại bạn bỏ đi, sau một thời gian nhà mạng cấp cho người khác — và họ bắt đầu nhận OTP ngân hàng của bạn. Tên bucket đã xoá chính là số điện thoại đó.</li>
  <li><strong>Đi làm:</strong> khi gỡ bỏ bất cứ thứ gì (bucket, tên miền, tên gói), lập danh sách kiểm: ai còn trỏ tới nó? Giữ một bucket rỗng không tốn đồng nào; mất cái tên có thể làm công ty trả giá.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Kẻ tấn công tìm bucket mở thế nào?”</strong> — Sinh tên khả dĩ rồi đọc mã trả về ẩn danh (404 không có, 403 có, 200 mở), cộng với tên lộ trong mã front-end, DNS, GitHub và tài liệu cũ.</li>
  <li><strong>“Chiếm bucket là gì và phòng thế nào?”</strong> — Đăng ký lại tên bucket đã xoá mà mã vẫn tin. Phòng bằng kiểm toàn vẹn khi tải về, <code>ExpectedBucketOwner</code>, không xoá bucket còn được tham chiếu, và không gian tên theo tài khoản + region.</li>
  <li><strong>“Bạn thấy một bucket công khai có bản dump CSDL. Ba bước đầu?”</strong> — Xoay mọi bí mật trong đó, chặn truy cập công khai, rồi dùng log khoanh vùng ai đã truy cập và báo cáo theo quy trình công ty.</li>
</ol>

<h3>🧪 Thực hành (15 phút, chỉ ở máy bạn)</h3>
<div class="callout ok"><ol>
  <li>Không bao giờ quét bucket của người khác. Trên phòng lab versitygw, tạo <code>ten-ban-dev</code> (riêng tư) và <code>ten-ban-backup</code> (có policy công khai sai).</li>
  <li>Viết một máy quét nhỏ như <code>quet.sh</code> và đọc ba mã trả về.</li>
  <li>Mô phỏng chiếm bucket trên LocalStack: xoá một bucket rồi tạo lại với tệp khác, sau đó thêm <code>--expected-bucket-owner</code> vào lệnh tải về. Lưu ý: LocalStack 4.12 lờ header này (thử 19/11/2026 — sai chủ vẫn tải được); trên AWS sai chủ nhận <code>403 AccessDenied</code>, nên phần đó hãy thử trên tài khoản thật.</li>
</ol>
<p><strong>Đạt khi:</strong> máy quét in một 404, một 403 và một 200, và bạn giải thích được vì sao 403 vẫn làm lộ thông tin.</p>
${giai('Gợi ý: vòng lặp quét', bash(`
for hau in "" -dev -backup; do
  b="ten-ban$hau"
  curl -s -o /dev/null -w "$b ⇒ %{http_code}\\n" "$S3/$b?list-type=2"
done`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dò tên bucket</span><span class="v">Đoán tên bucket và đọc mã trả về ẩn danh.</span></div>
  <div class="kv"><span class="k">Chiếm bucket</span><span class="v">Đăng ký một tên bucket đã được trả lại mà ai đó vẫn còn tin.</span></div>
  <div class="kv"><span class="k">ExpectedBucketOwner</span><span class="v">Tham số/header của yêu cầu; S3 từ chối nếu bucket thuộc tài khoản khác.</span></div>
  <div class="kv"><span class="k">Sinkhole</span><span class="v">Rút một cái tên nguy hiểm khỏi lưu hành để không ai lạm dụng được.</span></div>
  <div class="kv"><span class="k">IAM Access Analyzer</span><span class="v">Tìm tài nguyên chia sẻ ra ngoài tài khoản, gồm cả bucket công khai.</span></div>
  <div class="kv"><span class="k">Amazon Macie</span><span class="v">Quét S3 tìm dữ liệu cá nhân và nhạy cảm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Lộ bucket là lỗi cấu hình, bị script tìm ra trong vài giờ.</li>
  <li>403 nghĩa là “có tồn tại”; tên không phải bí mật.</li>
  <li>Xoá bucket là trả tên cho kẻ tấn công; mã tin vào tên có thể bị chiếm.</li>
  <li>Kiểm thứ tải về, ghim chủ bucket mong đợi, giữ tên đang được tham chiếu, dùng tên theo tài khoản + region.</li>
  <li>Nếu đã lộ: xoay bí mật trước, rồi đóng, rồi điều tra.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/', '🕳️', 'watchTowr Labs — 8 Million Requests Later (02/2025)', 'Nghiên cứu bucket bỏ hoang, từng bước.')}
${tl('https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html', '🪪', 'AWS docs — Kiểm chủ sở hữu bucket', 'ExpectedBucketOwner cho mọi yêu cầu.')}

<h3>Nguồn</h3>
<ul>
  <li>Verizon / NICE Systems (UpGuard): <a href="https://www.upguard.com/labs/data-leaks/verizon-cloud-leak" target="_blank" rel="noopener">upguard.com/labs/data-leaks/verizon-cloud-leak</a></li>
  <li>Accenture (UpGuard): <a href="https://www.upguard.com/labs/data-leaks/cloud-leak-accenture" target="_blank" rel="noopener">upguard.com/labs/data-leaks/cloud-leak-accenture</a></li>
  <li>Pegasus EFB (SafetyDetectives): <a href="https://www.safetydetectives.com/news/pegasus-leak-report/" target="_blank" rel="noopener">safetydetectives.com/news/pegasus-leak-report/</a></li>
  <li>watchTowr, công bố 04/02/2025: <a href="https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/" target="_blank" rel="noopener">labs.watchtowr.com/8-million-requests-later-…</a></li>
  <li>Không gian tên bucket: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/gpbucketnamespaces.html</a></li>
  <li>Điều kiện chủ bucket: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-owner-condition.html</a></li>
</ul>
</div>
`;

/* ═════ 2.7 — Lab chương 2 ═════ */
const MA_LAB_GIAI = bash(`
# loi-giai.sh — run with: AWS="aws" B=labflow-anh-<ten> ./loi-giai.sh   (folder holds vong-doi.json, cors.json, chi-https.json)
set -e
$AWS s3api create-bucket --bucket $B --create-bucket-configuration LocationConstraint=ap-southeast-1
$AWS s3api put-public-access-block --bucket $B --public-access-block-configuration \\
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
$AWS s3api put-bucket-versioning --bucket $B --versioning-configuration Status=Enabled
$AWS s3api put-bucket-lifecycle-configuration --bucket $B --lifecycle-configuration file://vong-doi.json
$AWS s3api put-bucket-cors --bucket $B --cors-configuration file://cors.json
$AWS s3api put-bucket-policy --bucket $B --policy file://chi-https.json`);
const MA_DON_PHIEN_BAN = bash(`
# Empty a VERSIONED bucket: every version + every delete marker, then remove it
aws s3api list-object-versions --bucket $B \\
  --query '{Objects: [Versions[], DeleteMarkers[]][][].{Key: Key, VersionId: VersionId}}' --output json > xoa.json
aws s3api delete-objects --bucket $B --delete file://xoa.json      # max 1000 per call — loop for bigger buckets
aws s3 rb s3://$B
# Still billing? Must all be empty:
aws s3api list-buckets --query 'Buckets[].Name' --output text
aws s3api list-multipart-uploads --bucket <any-remaining-bucket>`);

const L27_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 7</span>
<h2>2.7 — Chapter 2 lab: a private photo store for LabFlow + interview questions</h2>
<p class="lead">LabFlow — the lab-room booking API you will deploy at the end of this course — needs room photos and user avatars. Your job: build the bucket the way a senior engineer would on day one, prove every property with a grader that only <em>reads</em> configuration and tests from outside, then tear everything down and prove nothing is still billing.</p>

<h3>The brief</h3>
<ol>
  <li>A bucket <code>labflow-anh-&lt;your-name&gt;</code> in <code>ap-southeast-1</code>, <strong>private</strong>: all four Block Public Access switches on.</li>
  <li><strong>Versioning</strong> on, so a bad script can be undone.</li>
  <li>Lifecycle: objects under <code>tam/</code> expire after 1 day; incomplete multipart uploads are aborted after 1 day; noncurrent versions expire after 30 days.</li>
  <li>CORS: only <code>https://labflow.vn</code> may <code>PUT</code>/<code>POST</code> from a browser; any other origin is refused.</li>
  <li>A bucket policy that <strong>denies every request not made over HTTPS</strong>.</li>
  <li>An API function <code>kyTaiLen(key, contentType)</code> that only accepts JPEG/PNG and returns a 5-minute PUT URL with <code>content-type</code> signed.</li>
</ol>
<p>Everything runs on LocalStack 4.12 with the real AWS CLI; on a real account the same commands work unchanged (drop the endpoint).</p>

<h3>The grader (rubric, 8 checks)</h3>
<p><code>cham.sh</code> never changes anything. It reads the configuration through the API and tests from outside like a browser would:</p>
${OUT_27_TRUOC}
<ul>
  <li>Two checks pass on a brand-new bucket: Block Public Access is on by default (April 2023 rule), and with no CORS rule a foreign origin is refused anyway.</li>
  <li>Check 8 tests your signer: in this recorded run the signer file was already the finished one, so it passed before the bucket was configured. In your copy, start from a signer that signs only <code>host</code> and watch it fail.</li>
  <li><strong>Score to pass: 8/8.</strong> Partial credit is not useful here — each check is one real incident class from this chapter.</li>
</ul>
<p class="callout warn">Stop here if you want to solve it yourself. The solution is below, collapsed.</p>
${giai('Solution (open after trying)', MA_LAB_GIAI + MA_VONG_DOI_LAB + MA_CHI_HTTPS + MA_KY_TAI_LEN + OUT_27_SAU)}

<h3>Clean up — and prove it</h3>
${OUT_2X_DON}
<p>The first <code>rb --force</code> failed with <code>BucketNotEmpty</code>: it removed the current object but not the old versions and the delete marker. The listing shows three version IDs (two versions + one marker); deleting them all lets the bucket go. The lab bucket itself:</p>
${OUT_27_DON}
${MA_DON_PHIEN_BAN}
<p>On a real account also check the next day in Billing → Bills (S3 line) and keep the budget alarm from lesson 0.1 on.</p>

<h3>🎤 Interview questions for this chapter</h3>
<ol>
  <li><strong>“Design file uploads for a web app.”</strong> — Private bucket with Block Public Access; API authorizes and returns a short-lived presigned PUT/POST with content type pinned and size limited; browser uploads directly; API confirms with HeadObject and stores the key; CloudFront or presigned GET for reading; lifecycle for temp files and aborted uploads; versioning for undo.</li>
  <li><strong>“S3 vs EBS vs EFS?”</strong> — Object over HTTP, whole-object writes, unlimited, many readers; block disk for one instance; shared POSIX file system for many instances.</li>
  <li><strong>“Someone made a bucket public by mistake. How do you stop it from happening again?”</strong> — Account-level (or organization-level) Block Public Access, an SCP that denies <code>s3:PutBucketPublicAccessBlock</code> changes, Access Analyzer alerts, and IaC review of every policy containing Principal *.</li>
  <li><strong>“How do you cut an S3 bill?”</strong> — Find the line item first: egress (CloudFront, keep compute in-region), requests (bigger objects, fewer LISTs), storage (lifecycle to IA/Glacier, expire noncurrent versions, abort incomplete uploads, Intelligent-Tiering for unknown patterns).</li>
  <li><strong>“Why does cuongthai.com use R2 while the course teaches S3?”</strong> — Same API and SDK; R2 has zero egress fees, which dominates a media site's bill; S3 is the choice when the rest of the system lives in AWS and needs IAM roles, events, Glacier or Object Lock.</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rubric</span><span class="v">Checks that read configuration and test from outside; never mutate.</span></div>
  <div class="kv"><span class="k">BucketNotEmpty</span><span class="v">DeleteBucket error while any version or delete marker remains.</span></div>
  <div class="kv"><span class="k">list-multipart-uploads</span><span class="v">Shows invisible, billed parts of unfinished uploads.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A production-ready bucket on day one: private, versioned, lifecycle, strict CORS, HTTPS only, signed content type.</li>
  <li>Prove configuration with a read-only grader, not by eye in the console.</li>
  <li>Versioned buckets need all versions and markers deleted before removal.</li>
  <li>Finish every lab by listing what still exists.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Emptying a bucket: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/empty-bucket.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/empty-bucket.html</a></li>
  <li>Block Public Access: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html</a></li>
  <li>Bucket policy examples (aws:SecureTransport): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html</a></li>
</ul>
</div>
`;

const L27_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 7</span>
<h2>2.7 — Lab chương 2: kho ảnh riêng tư cho LabFlow + câu hỏi phỏng vấn</h2>
<p class="lead">LabFlow — API đặt lịch phòng lab mà bạn sẽ deploy cuối khoá — cần ảnh phòng và ảnh đại diện. Việc của bạn: dựng bucket như một kỹ sư lâu năm làm ngay ngày đầu, chứng minh từng tính chất bằng bộ chấm chỉ <em>đọc</em> cấu hình và thử từ bên ngoài, rồi gỡ hết và chứng minh không còn gì tính tiền.</p>

<h3>Đề bài</h3>
<ol>
  <li>Bucket <code>labflow-anh-&lt;tên-bạn&gt;</code> ở <code>ap-southeast-1</code>, <strong>riêng tư</strong>: bật đủ bốn công tắc Block Public Access.</li>
  <li>Bật <strong>versioning</strong>, để script hỏng còn hoàn tác được.</li>
  <li>Vòng đời: object dưới <code>tam/</code> hết hạn sau 1 ngày; lượt multipart dở dang bị huỷ sau 1 ngày; phiên bản cũ hết hạn sau 30 ngày.</li>
  <li>CORS: chỉ <code>https://labflow.vn</code> được <code>PUT</code>/<code>POST</code> từ trình duyệt; origin khác bị từ chối.</li>
  <li>Bucket policy <strong>từ chối mọi yêu cầu không đi qua HTTPS</strong>.</li>
  <li>Hàm API <code>kyTaiLen(key, contentType)</code> chỉ nhận JPEG/PNG và trả URL PUT 5 phút có ký <code>content-type</code>.</li>
</ol>
<p>Mọi thứ chạy trên LocalStack 4.12 bằng AWS CLI thật; trên tài khoản thật các lệnh y nguyên (bỏ endpoint).</p>

<h3>Bộ chấm (thang điểm, 8 phép kiểm)</h3>
<p><code>cham.sh</code> không bao giờ thay đổi gì. Nó đọc cấu hình qua API và thử từ bên ngoài như trình duyệt:</p>
${OUT_27_TRUOC}
<ul>
  <li>Hai phép kiểm đạt ngay với bucket mới tinh: Block Public Access mặc định bật (luật tháng 4/2023), và không có luật CORS thì origin lạ vốn đã bị từ chối.</li>
  <li>Phép 8 kiểm hàm ký của bạn: trong lần chạy ghi lại này, tệp hàm ký đã là bản hoàn chỉnh nên nó đạt trước cả khi cấu hình bucket. Ở bản của bạn, hãy bắt đầu từ hàm ký chỉ ký <code>host</code> và xem nó trượt.</li>
  <li><strong>Điểm đạt: 8/8.</strong> Điểm từng phần không có ích ở đây — mỗi phép kiểm là một loại sự cố thật của chương này.</li>
</ul>
<p class="callout warn">Dừng ở đây nếu bạn muốn tự giải. Lời giải ở dưới, đang gập lại.</p>
${giai('Lời giải (mở sau khi đã thử)', MA_LAB_GIAI + MA_VONG_DOI_LAB + MA_CHI_HTTPS + MA_KY_TAI_LEN + OUT_27_SAU)}

<h3>Dọn dẹp — và chứng minh</h3>
${OUT_2X_DON}
<p>Lệnh <code>rb --force</code> đầu tiên thất bại với <code>BucketNotEmpty</code>: nó xoá object hiện tại nhưng không xoá phiên bản cũ và dấu xoá. Danh sách cho thấy ba version ID (hai phiên bản + một dấu xoá); xoá hết thì bucket mới gỡ được. Bucket của lab:</p>
${OUT_27_DON}
${MA_DON_PHIEN_BAN}
<p>Trên tài khoản thật, hôm sau kiểm thêm ở Billing → Bills (dòng S3) và giữ cảnh báo ngân sách từ bài 0.1.</p>

<h3>🎤 Câu hỏi phỏng vấn của chương</h3>
<ol>
  <li><strong>“Thiết kế chức năng tải tệp cho một web app.”</strong> — Bucket riêng tư có Block Public Access; API cấp quyền và trả URL PUT/POST ký sẵn hạn ngắn, khoá cứng content type, giới hạn cỡ; trình duyệt tải thẳng lên; API xác nhận bằng HeadObject rồi lưu key; đọc qua CloudFront hoặc GET ký sẵn; vòng đời cho tệp tạm và lượt tải dở; versioning để hoàn tác.</li>
  <li><strong>“S3 khác EBS và EFS thế nào?”</strong> — Object qua HTTP, ghi nguyên object, không giới hạn, nhiều người đọc; ổ khối cho một máy; hệ tệp POSIX dùng chung cho nhiều máy.</li>
  <li><strong>“Ai đó lỡ để bucket công khai. Làm sao để không tái diễn?”</strong> — Block Public Access cấp tài khoản (hoặc tổ chức), một SCP chặn đổi <code>s3:PutBucketPublicAccessBlock</code>, cảnh báo của Access Analyzer, và review IaC mọi policy có Principal *.</li>
  <li><strong>“Giảm hoá đơn S3 thế nào?”</strong> — Tìm dòng chi phí trước: dữ liệu ra (CloudFront, giữ máy tính toán cùng region), request (object to hơn, ít LIST hơn), lưu trữ (vòng đời sang IA/Glacier, xoá phiên bản cũ, huỷ tải dở, Intelligent-Tiering khi không rõ kiểu truy cập).</li>
  <li><strong>“Vì sao cuongthai.com dùng R2 mà khoá lại dạy S3?”</strong> — Cùng API và SDK; R2 không tính phí dữ liệu ra, khoản chiếm phần lớn hoá đơn của web nhiều media; S3 là lựa chọn khi phần còn lại của hệ thống ở AWS và cần role IAM, sự kiện, Glacier hay Object Lock.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thang chấm</span><span class="v">Các phép kiểm đọc cấu hình và thử từ ngoài; không bao giờ sửa gì.</span></div>
  <div class="kv"><span class="k">BucketNotEmpty</span><span class="v">Lỗi DeleteBucket khi còn bất kỳ phiên bản hay dấu xoá nào.</span></div>
  <div class="kv"><span class="k">list-multipart-uploads</span><span class="v">Hiện các phần vô hình, vẫn tính tiền, của lượt tải chưa xong.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bucket sẵn sàng production ngay ngày đầu: riêng tư, có phiên bản, có vòng đời, CORS chặt, chỉ HTTPS, ký content type.</li>
  <li>Chứng minh cấu hình bằng bộ chấm chỉ đọc, không phải nhìn bằng mắt trên console.</li>
  <li>Bucket có versioning phải xoá hết phiên bản và dấu xoá trước khi gỡ.</li>
  <li>Kết thúc mỗi lab bằng việc liệt kê thứ còn tồn tại.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Làm rỗng bucket: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/empty-bucket.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/empty-bucket.html</a></li>
  <li>Block Public Access: <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html</a></li>
  <li>Ví dụ bucket policy (aws:SecureTransport): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html</a></li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ2 = [
  Q('In the console you see a folder "uploads/" in a bucket. What is it really?|||Trên console bạn thấy thư mục "uploads/" trong bucket. Thực chất nó là gì?', [
    'A directory object that holds its children|||Một đối tượng thư mục chứa các con',
    'A common prefix of flat keys, grouped by the "/" delimiter|||Tiền tố chung của các key phẳng, gom theo dấu phân cách "/"',
    'A separate bucket linked to the parent|||Một bucket riêng gắn với bucket cha',
    'An EFS mount point|||Một điểm gắn EFS',
  ], 1),
  Q('A 20 MB file uploaded with the CLI has an ETag ending in "-3". Why?|||Tệp 20 MB tải bằng CLI có ETag đuôi "-3". Vì sao?', [
    'The object has three versions|||Object có ba phiên bản',
    'It was a multipart upload in three parts, so the ETag is not the MD5 of the file|||Nó được tải multipart ba phần, nên ETag không phải MD5 của tệp',
    'The upload was retried three times|||Lượt tải được thử lại ba lần',
    'It is stored in three AZs|||Nó được lưu ở ba AZ',
  ], 1),
  Q('Your Node.js code works with AWS S3. What must change to use Cloudflare R2?|||Mã Node.js của bạn chạy với AWS S3. Cần đổi gì để dùng Cloudflare R2?', [
    'Rewrite it with the Cloudflare SDK|||Viết lại bằng SDK của Cloudflare',
    'Only the client config: endpoint, region (auto) and credentials|||Chỉ cấu hình client: endpoint, region (auto) và khoá',
    'Switch from SigV4 to OAuth|||Chuyển từ SigV4 sang OAuth',
    'Nothing; R2 reads AWS credentials directly|||Không gì cả; R2 đọc thẳng khoá AWS',
  ], 1),
  Q('A bucket policy allows s3:GetObject to Principal * on uploads/*, but anonymous requests still get 403. Most likely cause?|||Bucket policy cho Principal * quyền s3:GetObject trên uploads/*, nhưng yêu cầu ẩn danh vẫn 403. Khả năng cao nhất?', [
    'Block Public Access (RestrictPublicBuckets / BlockPublicPolicy) is on|||Block Public Access (RestrictPublicBuckets / BlockPublicPolicy) đang bật',
    'The objects are encrypted with SSE-S3|||Object được mã hoá SSE-S3',
    'Versioning is enabled|||Đã bật versioning',
    'CORS is not configured|||Chưa cấu hình CORS',
  ], 0),
  Q('A teammate grants Principal * the actions s3:GetObject and s3:ListBucket on the bucket and bucket/*. What is the worst consequence?|||Một đồng đội cấp cho Principal * quyền s3:GetObject và s3:ListBucket trên bucket và bucket/*. Hậu quả tệ nhất?', [
    'Strangers can upload files|||Người lạ tải tệp lên được',
    'Strangers can list every key and download any object, including secrets|||Người lạ liệt kê được mọi key và tải mọi object, kể cả bí mật',
    'The bucket gets deleted|||Bucket bị xoá',
    'Only the console shows a warning|||Chỉ là console hiện cảnh báo',
  ], 1),
  Q('Presigned URLs signed by an ECS task role stop working after about an hour, although expiresIn is 24 hours. Why?|||URL ký sẵn do task role ECS ký hỏng sau khoảng một giờ dù expiresIn là 24 giờ. Vì sao?', [
    'S3 caps every URL at one hour|||S3 giới hạn mọi URL ở một giờ',
    'A URL cannot outlive the temporary credentials that signed it|||URL không sống lâu hơn khoá tạm đã ký nó',
    'CORS expired|||CORS hết hạn',
    'The object moved to Glacier|||Object đã chuyển sang Glacier',
  ], 1),
  Q('How do you stop a presigned PUT from storing text/html on your media domain?|||Làm sao để PUT ký sẵn không lưu được text/html lên tên miền media của bạn?', [
    'Set ContentType in the command only|||Chỉ đặt ContentType trong lệnh',
    'Include content-type in the signed headers so another type breaks the signature|||Đưa content-type vào header được ký để loại khác làm hỏng chữ ký',
    'Add a CORS rule|||Thêm luật CORS',
    'Enable SSE-KMS|||Bật SSE-KMS',
  ], 1),
  Q('In a versioned bucket you run "aws s3 rm s3://b/noi-quy.txt". What happens?|||Trong bucket có versioning bạn chạy "aws s3 rm s3://b/noi-quy.txt". Điều gì xảy ra?', [
    'All versions are deleted permanently|||Mọi phiên bản bị xoá vĩnh viễn',
    'A delete marker becomes the latest version; older versions stay and can be restored|||Một dấu xoá thành phiên bản mới nhất; phiên bản cũ còn và khôi phục được',
    'The command fails|||Lệnh thất bại',
    'Only the oldest version is deleted|||Chỉ phiên bản cũ nhất bị xoá',
  ], 1),
  Q('Which lifecycle action prevents paying for parts of uploads that never finished?|||Hành động vòng đời nào tránh trả tiền cho các phần của lượt tải không bao giờ xong?', [
    'NoncurrentVersionExpiration|||NoncurrentVersionExpiration',
    'AbortIncompleteMultipartUpload|||AbortIncompleteMultipartUpload',
    'Transition to GLACIER|||Chuyển sang GLACIER',
    'ExpiredObjectDeleteMarker|||ExpiredObjectDeleteMarker',
  ], 1),
  Q('An installer script is downloaded nightly from a bucket that your team deleted months ago. What is the risk and the best fix?|||Một script cài đặt được tải mỗi đêm từ một bucket mà nhóm bạn đã xoá vài tháng trước. Rủi ro và cách sửa tốt nhất?', [
    'No risk: deleted buckets return 404 forever|||Không rủi ro: bucket đã xoá trả 404 mãi mãi',
    'Anyone can re-create the name and serve code; verify checksums/signatures and use ExpectedBucketOwner|||Ai cũng tạo lại được tên và phát mã; kiểm checksum/chữ ký và dùng ExpectedBucketOwner',
    'AWS blocks re-creating deleted names|||AWS chặn tạo lại tên đã xoá',
    'Only a cost risk from failed requests|||Chỉ là rủi ro chi phí từ request lỗi',
  ], 1),
];

export default {
  title: 'Chapter 2 — Storage: S3 (and the R2 you already use)|||Chương 2 — Lưu trữ: S3 (và R2 bạn đang dùng)',
  description: 'Bucket và object (không có thư mục), giao thức S3 và cách cuongthai.com dùng R2 bằng @aws-sdk/client-s3, chi phí S3 vs R2; Block Public Access, bucket policy, ACL, mã hoá (chạy thật với người lạ ẩn danh); URL ký sẵn, POST giới hạn cỡ, CORS, hai bẫy checksum và content-type; versioning, delete marker, vòng đời, lớp lưu trữ; bucket công khai và bucket bỏ hoang (Verizon 2017, Accenture 2017, Pegasus 2022, watchTowr 2025); lab kho ảnh LabFlow có bộ chấm 8 phép.',
  lessons: [
    {
      title: '2.1 — S3 buckets and objects|||2.1 — Bucket và object S3',
      slug: 'aws-2-1-s3',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Object storage khác ổ đĩa thế nào, tên bucket toàn cầu, key/metadata/ETag/multipart, tiền tố thay thư mục (chạy thật), mv = chép + xoá, nhất quán mạnh, 11 số 9, s3 vs s3api.',
      content: L21_EN + L21_VI,
    },
    {
      title: '2.2 — The S3 protocol: R2, other S3 servers and @aws-sdk/client-s3|||2.2 — Giao thức S3: R2, các máy chủ S3 khác và @aws-sdk/client-s3',
      slug: 'aws-2-2-r2-giao-thuc-s3',
      type: 'LESSON',
      isFreePreview: true,
      description: 'REST + SigV4, một hàm chạy trên hai máy chủ S3 khác nhau (chạy thật), cuongthai.com dùng R2 thế nào, chi phí S3 vs R2 ba kịch bản, tương thích không phải giống hệt, bẫy 1000 key mỗi trang.',
      content: L22_EN + L22_VI,
    },
    {
      title: '2.3 — S3 permissions: Block Public Access, bucket policies, ACLs and encryption|||2.3 — Quyền S3: Block Public Access, bucket policy, ACL và mã hoá',
      slug: 'aws-2-3-quyen',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn lớp quyết định ai đọc được object, curl ẩn danh với policy đúng và policy sai (chạy thật trên versitygw), Deny cho Principal * trên AWS, Object Ownership, SSE-S3/SSE-KMS, chỉ HTTPS.',
      content: L23_EN + L23_VI,
    },
    {
      title: '2.4 — Presigned URLs and direct browser uploads|||2.4 — URL ký sẵn và tải lên thẳng từ trình duyệt',
      slug: 'aws-2-4-presigned',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ký, sửa, hết hạn (chạy thật), thời hạn theo loại khoá, luồng tải lên thẳng, bẫy checksum thân rỗng và content-type không ký, POST giới hạn cỡ, CORS preflight.',
      content: L24_EN + L24_VI,
    },
    {
      title: '2.5 — Versioning, lifecycle rules and storage classes|||2.5 — Phiên bản, luật vòng đời và lớp lưu trữ',
      slug: 'aws-2-5-phien-ban-vong-doi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Delete marker và hoàn tác (chạy thật), versioning tính tiền mọi bản, Object Lock, tám lớp lưu trữ, luật vòng đời và Expiration, Glacier phải restore, Code Spaces 2014.',
      content: L25_EN + L25_VI,
    },
    {
      title: '2.6 — Hacker’s view: public buckets that leaked millions of records|||2.6 — Góc hacker: bucket công khai làm lộ hàng triệu bản ghi',
      slug: 'aws-2-6-lo-bucket',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Verizon 2017, Accenture 2017, Pegasus 2022, watchTowr 2025; đoán tên bucket và chiếm bucket bỏ hoang (chạy thật trong lab cục bộ), ExpectedBucketOwner, tự kiểm bucket trong năm phút.',
      content: L26_EN + L26_VI,
    },
    {
      title: '2.7 — Chapter 2 lab + interview questions|||2.7 — Lab chương 2 + câu hỏi phỏng vấn',
      slug: 'aws-2-7-lab-2',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kho ảnh LabFlow: bucket riêng tư, versioning, vòng đời, CORS, chỉ HTTPS, URL ký khoá content-type; bộ chấm 8 phép 3/8 → 8/8, dọn bucket có phiên bản, năm câu phỏng vấn.',
      content: L27_EN + L27_VI,
    },
    {
      title: '2.8 — Chapter 2 quiz|||2.8 — Kiểm tra Chương 2',
      slug: 'aws-2-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về tiền tố, ETag multipart, đổi sang R2, Block Public Access, ListBucket công khai, hạn URL ký sẵn, ký content-type, delete marker, vòng đời và bucket bỏ hoang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the response again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại phản hồi.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ2 },
    },
  ],
};
