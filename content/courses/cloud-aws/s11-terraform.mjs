/**
 * Cloud AWS — Chương 11: Hạ tầng dưới dạng mã với Terraform
 * (soạn 20/11/2026, agent aws; phiên 33 chạy từ Mac qua ssh).
 * GIỮ title chương + slug bài khung đang có trên prod:
 *   11.1 vi-sao · 11.2 terraform · 11.3 bien-module · 11.4 state · 11.5 lab-11 · 11.6 quiz (MỚI).
 * Mọi output chạy THẬT 20/11/2026 bằng scratchpad/aws/lab/c11/111.sh … 114.sh, lab11/chay.sh:
 *   - Terraform 1.17.2 + provider hashicorp/aws 6.73.0 (+ random 3.x), OpenTofu 1.13.9, AWS CLI 2.41.0,
 *     tất cả trỏ vào LocalStack 4.12 (community) — container sống lâu + docker exec;
 *   - backend S3 có khoá S3 gốc (use_lockfile) chạy trên chính LocalStack.
 * Khác AWS đã ghi rõ trong bài: LocalStack không kiểm IAM, không tính tiền; thời gian apply đo trên máy tải nặng.
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua hcl()/bash()/yml() của _chung.mjs.
 */
import { bash, hcl, yml, out, tl, giai } from './_chung.mjs';
/* ═════ Output THẬT (scratchpad/aws/lab/c11: Terraform 1.17.2 + hashicorp/aws 6.73.0, OpenTofu 1.13.9, AWS CLI 2.41.0 → LocalStack 4.12) ═════ */
const OUT_111_CFN = out("$ aws cloudformation deploy --stack-name labflow-cfn --template-file cfn-anh.yaml\nWaiting for changeset to be created..\nWaiting for stack create/update to complete\nSuccessfully created/updated stack - labflow-cfn\n$ aws cloudformation describe-stacks --stack-name labflow-cfn --query 'Stacks[0].StackStatus' --output text\nCREATE_COMPLETE\n$ aws cloudformation delete-stack --stack-name labflow-cfn\n$ aws s3 ls");
const OUT_111_CON_GI = out("$ aws s3 ls\n2026-11-20 04:27:43 labflow-anh-dev\n2026-11-20 04:27:47 labflow-anh-staging\n$ aws sqs list-queues --query 'QueueUrls[]' --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-thu-tam\thttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dev\thttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-staging\n$ aws dynamodb list-tables --query TableNames --output text\nlabflow-datlich-dev\tlabflow-datlich-staging");
const OUT_111_DON_TAY = out("$ aws s3 rb s3://labflow-anh-dev\nremove_bucket: labflow-anh-dev\n$ aws sqs delete-queue --queue-url http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dev\n$ aws dynamodb delete-table --table-name labflow-datlich-dev --query TableDescription.TableName --output text\nlabflow-datlich-dev\n$ aws s3 rb s3://labflow-anh-staging\nremove_bucket: labflow-anh-staging\n$ aws sqs delete-queue --queue-url http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-staging\n$ aws dynamodb delete-table --table-name labflow-datlich-staging --query TableDescription.TableName --output text\nlabflow-datlich-staging\n# forgot labflow-thu-tam — nobody wrote it down\n$ aws sqs list-queues --query 'QueueUrls[]' --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-thu-tam");
const OUT_111_GIONG = out("setting                dev                staging           \ns3 versioning          Enabled            Enabled           \ns3 block public        True               True              \nsqs visibility (s)     60                 60                \ndynamodb billing       on-demand          on-demand         \ndynamodb key           HASH+RANGE         HASH+RANGE        ");
const OUT_111_LECH = out("setting                dev                staging           \ns3 versioning          Enabled            (off)             \ns3 block public        True               True              \nsqs visibility (s)     60                 30                \ndynamodb billing       on-demand          provisioned 5 RCU \ndynamodb key           HASH+RANGE         HASH              ");
const OUT_111_TAY_DEV = out("# dev — built by hand from the wiki page (9 steps)\n$ aws s3api create-bucket --bucket labflow-anh-dev --create-bucket-configuration LocationConstraint=ap-southeast-1 --output text\nhttp://labflow-anh-dev.s3.localhost.localstack.cloud:44166/\n$ aws s3api put-bucket-versioning --bucket labflow-anh-dev --versioning-configuration Status=Enabled\n$ aws s3api put-public-access-block --bucket labflow-anh-dev --public-access-block-configuration 'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'\n$ aws sqs create-queue --queue-name labflow-viec-dev --attributes VisibilityTimeout=60 --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dev\n$ aws dynamodb create-table --table-name labflow-datlich-dev --billing-mode PAY_PER_REQUEST --attribute-definitions 'AttributeName=pk,AttributeType=S' 'AttributeName=sk,AttributeType=S' --key-schema 'AttributeName=pk,KeyType=HASH' 'AttributeName=sk,KeyType=RANGE' --query TableDescription.TableStatus --output text\nACTIVE");
const OUT_111_TAY_STAGING = out("# staging — built by hand three weeks later, from memory\n$ aws s3api create-bucket --bucket labflow-anh-staging --create-bucket-configuration LocationConstraint=ap-southeast-1 --output text\nhttp://labflow-anh-staging.s3.localhost.localstack.cloud:44166/\n$ aws sqs create-queue --queue-name labflow-viec-staging --attributes VisibilityTimeout=30 --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-staging\n$ aws dynamodb create-table --table-name labflow-datlich-staging --provisioned-throughput 'ReadCapacityUnits=5,WriteCapacityUnits=5' --attribute-definitions 'AttributeName=pk,AttributeType=S' --key-schema 'AttributeName=pk,KeyType=HASH' --query TableDescription.TableStatus --output text\nACTIVE\n$ aws sqs create-queue --queue-name labflow-thu-tam --query QueueUrl --output text\nhttp://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-thu-tam\n# (a test queue 'just for 5 minutes')");
const OUT_111_TF_DON = out("$ terraform workspace select dev && terraform destroy -auto-approve\nDestroy complete! Resources: 5 destroyed.\n$ terraform workspace select staging && terraform destroy -auto-approve\nDestroy complete! Resources: 5 destroyed.\n$ aws s3 ls\n$ aws sqs list-queues --query 'QueueUrls[]' --output text\nNone\n$ aws dynamodb list-tables --query TableNames --output text\n# (empty)");
const OUT_111_TF = out("$ terraform init\n- Installing hashicorp/aws v6.73.0...\n- Installed hashicorp/aws v6.73.0 (signed by HashiCorp)\nTerraform has been successfully initialized!\n$ terraform workspace new dev\nCreated and switched to workspace \"dev\"!\n$ terraform apply -auto-approve\nPlan: 5 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 5 added, 0 changed, 0 destroyed.\n# 34 s\n$ terraform workspace new staging\nCreated and switched to workspace \"staging\"!\n$ terraform apply -auto-approve\nPlan: 5 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 5 added, 0 changed, 0 destroyed.\n# 32 s");
const OUT_111_TOFU = out("$ terraform version\nTerraform v1.17.2\n$ tofu version\nOpenTofu v1.13.9\n$ tofu init && tofu apply -auto-approve\nOpenTofu has been successfully initialized!\n  + loi_chao = (known after apply)\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.\nloi_chao = \"same HCL, two tools\"\n$ terraform init && terraform apply -auto-approve\nTerraform has been successfully initialized!\n  + loi_chao = (known after apply)\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.\nloi_chao = \"same HCL, two tools\"");
const OUT_112_APPLY = out("$ terraform apply plan.tfplan\naws_sqs_queue.chet: Creating...\naws_dynamodb_table.datlich: Creating...\naws_s3_bucket.anh: Creating...\naws_s3_bucket.anh: Creation complete after 0s [id=labflow-anh-112]\naws_dynamodb_table.datlich: Creation complete after 6s [id=labflow-datlich]\naws_sqs_queue.chet: Still creating... [00m10s elapsed]\naws_sqs_queue.chet: Still creating... [00m20s elapsed]\naws_sqs_queue.chet: Creation complete after 25s [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dlq]\naws_sqs_queue.viec: Creating...\naws_sqs_queue.viec: Still creating... [00m10s elapsed]\naws_sqs_queue.viec: Still creating... [00m20s elapsed]\naws_sqs_queue.viec: Creation complete after 25s [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec]\nApply complete! Resources: 4 added, 0 changed, 0 destroyed.\nOutputs:\nhang_doi_url = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\"\ntai_khoan = \"000000000000\"");
const OUT_112_DESTROY = out("$ terraform destroy -auto-approve\naws_dynamodb_table.datlich: Destroying... [id=labflow-datlich]\naws_sqs_queue.viec: Destroying... [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec]\naws_s3_bucket.anh: Destroying... [id=labflow-anh-112]\naws_s3_bucket.anh: Destruction complete after 0s\naws_dynamodb_table.datlich: Destruction complete after 0s\naws_sqs_queue.viec: Destruction complete after 42s\naws_sqs_queue.chet: Destroying... [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dlq]\naws_sqs_queue.chet: Destruction complete after 42s\nDestroy complete! Resources: 4 destroyed.\n$ aws s3 ls\n$ aws sqs list-queues\n$ aws dynamodb list-tables --query TableNames --output text\n# (empty)");
const OUT_112_FMT_VALIDATE = out("$ terraform fmt -check\nnhap.tf\n# exit 3\n$ terraform fmt\nnhap.tf\n$ terraform init\n- Finding hashicorp/aws versions matching \"~> 6.0\"...\n- Installing hashicorp/aws v6.73.0...\n- Installed hashicorp/aws v6.73.0 (signed by HashiCorp)\nTerraform has created a lock file .terraform.lock.hcl to record the provider\nTerraform has been successfully initialized!\n$ terraform validate\nError: Insufficient versioning_configuration blocks\n  on nhap.tf line 5, in resource \"aws_s3_bucket_versioning\" \"nhap\":\n   5: resource \"aws_s3_bucket_versioning\" \"nhap\" {\nAt least 1 \"versioning_configuration\" blocks are required.\nError: Unsupported block type\n  on nhap.tf line 7, in resource \"aws_s3_bucket_versioning\" \"nhap\":\n   7:   versionning_configuration { status = \"Enabled\" }\nBlocks of type \"versionning_configuration\" are not expected here. Did you\nmean \"versioning_configuration\"?");
const OUT_112_KHONG_DOI = out("$ terraform plan\nNo changes. Your infrastructure matches the configuration.\nTerraform has compared your real infrastructure against your configuration\nand found no differences, so no changes are needed.");
const OUT_112_LOCK = out("$ head -12 .terraform.lock.hcl\n# This file is maintained automatically by \"terraform init\".\n# Manual edits may be lost in future updates.\n\nprovider \"registry.terraform.io/hashicorp/aws\" {\n  version     = \"6.73.0\"\n  constraints = \"~> 6.0\"\n  hashes = [\n    \"h1:Jf7FuNLRB9cs3KvwJPMFGmE4C3lvwT/EuvQUo9gdDBc=\",\n    \"zh:0f7403264fbfbcad526a5ddb9553be6ab12dba14e5901d0c2ccabc38d9ccf9a0\",\n    \"zh:26be4e8afc94ef29c98b8219dc49b19ce21a04d3f2b4e5be6116e9526ece0355\",\n    \"zh:2ba661a4a782fba053c411ce4d828dc148d7ed3998d073a28370a559400b1578\",\n    \"zh:2c422d0edd37bf7470c84f1d1f76487f30948768878204a65a18189bf878467a\",\n# ... 17 checksums in total");
const OUT_112_PLAN_FULL = out("$ terraform plan -out=plan.tfplan\ndata.aws_region.nay: Reading...\ndata.aws_caller_identity.toi: Reading...\ndata.aws_region.nay: Read complete after 0s [id=ap-southeast-1]\ndata.aws_caller_identity.toi: Read complete after 0s [id=000000000000]\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  + create\nTerraform will perform the following actions:\n  # aws_dynamodb_table.datlich will be created\n  + resource \"aws_dynamodb_table\" \"datlich\" {\n      + arn              = (known after apply)\n      + billing_mode     = \"PAY_PER_REQUEST\"\n      + hash_key         = \"pk\"\n      + id               = (known after apply)\n      + name             = \"labflow-datlich\"\n      + read_capacity    = (known after apply)\n      + region           = \"ap-southeast-1\"\n      + stream_arn       = (known after apply)\n      + stream_label     = (known after apply)\n      + stream_view_type = (known after apply)\n      + tags_all         = {\n          + \"ManagedBy\" = \"terraform\"\n          + \"Project\"   = \"labflow\"\n        }\n      + write_capacity   = (known after apply)\n      + attribute {\n          + name = \"pk\"\n          + type = \"S\"\n        }\n      + global_secondary_index (known after apply)\n      + global_table_witness (known after apply)\n      + point_in_time_recovery (known after apply)\n      + server_side_encryption (known after apply)\n      + ttl (known after apply)\n      + warm_throughput (known after apply)\n    }\n  # aws_s3_bucket.anh will be created\n  + resource \"aws_s3_bucket\" \"anh\" {\n      + acceleration_status         = (known after apply)\n      + acl                         = (known after apply)\n      + arn                         = (known after apply)\n      + bucket                      = \"labflow-anh-112\"\n      + bucket_domain_name          = (known after apply)\n      + bucket_namespace            = (known after apply)\n      + bucket_prefix               = (known after apply)\n      + bucket_region               = (known after apply)\n      + bucket_regional_domain_name = (known after apply)\n      + force_destroy               = true\n      + hosted_zone_id              = (known after apply)\n      + id                          = (known after apply)\n      + object_lock_enabled         = (known after apply)\n      + policy                      = (known after apply)\n      + region                      = \"ap-southeast-1\"\n      + request_payer               = (known after apply)\n      + tags_all                    = {\n          + \"ManagedBy\" = \"terraform\"\n          + \"Project\"   = \"labflow\"\n        }\n      + website_domain              = (known after apply)\n      + website_endpoint            = (known after apply)\n      + cors_rule (known after apply)\n      + grant (known after apply)\n      + lifecycle_rule (known after apply)\n      + logging (known after apply)\n      + object_lock_configuration (known after apply)\n      + replication_configuration (known after apply)\n      + server_side_encryption_configuration (known after apply)\n      + versioning (known after apply)\n      + website (known after apply)\n    }\n  # aws_sqs_queue.chet will be created\n  + resource \"aws_sqs_queue\" \"chet\" {\n      + arn                               = (known after apply)\n      + content_based_deduplication       = false\n      + deduplication_scope               = (known after apply)\n      + delay_seconds                     = 0\n      + fifo_queue                        = false\n      + fifo_throughput_limit             = (known after apply)\n      + id                                = (known after apply)\n      + kms_data_key_reuse_period_seconds = (known after apply)\n      + max_message_size                  = 262144\n      + message_retention_seconds         = 345600\n      + name                              = \"labflow-viec-dlq\"\n      + name_prefix                       = (known after apply)\n      + policy                            = (known after apply)\n      + receive_wait_time_seconds         = 0\n      + redrive_allow_policy              = (known after apply)\n      + redrive_policy                    = (known after apply)\n      + region                            = \"ap-southeast-1\"\n      + sqs_managed_sse_enabled           = (known after apply)\n      + tags_all                          = {\n          + \"ManagedBy\" = \"terraform\"\n          + \"Project\"   = \"labflow\"\n        }\n      + url                               = (known after apply)\n      + visibility_timeout_seconds        = 30\n    }\n  # aws_sqs_queue.viec will be created\n  + resource \"aws_sqs_queue\" \"viec\" {\n      + arn                               = (known after apply)\n      + content_based_deduplication       = false\n      + deduplication_scope               = (known after apply)\n      + delay_seconds                     = 0\n      + fifo_queue                        = false\n      + fifo_throughput_limit             = (known after apply)\n      + id                                = (known after apply)\n      + kms_data_key_reuse_period_seconds = (known after apply)\n      + max_message_size                  = 262144\n      + message_retention_seconds         = 345600\n      + name                              = \"labflow-viec\"\n      + name_prefix                       = (known after apply)\n      + policy                            = (known after apply)\n      + receive_wait_time_seconds         = 0\n      + redrive_allow_policy              = (known after apply)\n      + redrive_policy                    = (known after apply)\n      + region                            = \"ap-southeast-1\"\n      + sqs_managed_sse_enabled           = (known after apply)\n      + tags_all                          = {\n          + \"ManagedBy\" = \"terraform\"\n          + \"Project\"   = \"labflow\"\n        }\n      + url                               = (known after apply)\n      + visibility_timeout_seconds        = 60\n    }\nPlan: 4 to add, 0 to change, 0 to destroy.\nChanges to Outputs:\n  + hang_doi_url = (known after apply)\n  + tai_khoan    = \"000000000000\"");
const OUT_112_STATE_GRAPH = out("$ terraform state list\ndata.aws_caller_identity.toi\ndata.aws_region.nay\naws_dynamodb_table.datlich\naws_s3_bucket.anh\naws_sqs_queue.chet\naws_sqs_queue.viec\n$ terraform output\nhang_doi_url = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\"\ntai_khoan = \"000000000000\"\n$ terraform graph | grep -- ' -> ' | grep -v provider\n\"aws_sqs_queue.viec\" -> \"aws_sqs_queue.chet\";");
const OUT_112_SUA_TAI_CHO = out("# main.tf: added  tags = { Owner = \"team-backend\" }  to aws_s3_bucket.anh\n$ terraform plan\ndata.aws_caller_identity.toi: Reading...\ndata.aws_region.nay: Reading...\naws_sqs_queue.chet: Refreshing state... [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dlq]\naws_dynamodb_table.datlich: Refreshing state... [id=labflow-datlich]\ndata.aws_region.nay: Read complete after 0s [id=ap-southeast-1]\naws_s3_bucket.anh: Refreshing state... [id=labflow-anh-112]\ndata.aws_caller_identity.toi: Read complete after 0s [id=000000000000]\naws_sqs_queue.viec: Refreshing state... [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec]\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  ~ update in-place\nTerraform will perform the following actions:\n  # aws_s3_bucket.anh will be updated in-place\n  ~ resource \"aws_s3_bucket\" \"anh\" {\n        id                          = \"labflow-anh-112\"\n      ~ tags                        = {\n          + \"Owner\" = \"team-backend\"\n        }\n      ~ tags_all                    = {\n          + \"Owner\"     = \"team-backend\"\n            # (2 unchanged elements hidden)\n        }\n        # (14 unchanged attributes hidden)\n        # (3 unchanged blocks hidden)\n    }\nPlan: 0 to add, 1 to change, 0 to destroy.");
const OUT_112_THAY_MOI = out("# main.tf: queue name \"labflow-viec\" -> \"labflow-viec-v2\"\n$ terraform plan\ndata.aws_region.nay: Reading...\naws_sqs_queue.chet: Refreshing state... [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec-dlq]\naws_dynamodb_table.datlich: Refreshing state... [id=labflow-datlich]\ndata.aws_region.nay: Read complete after 0s [id=ap-southeast-1]\naws_s3_bucket.anh: Refreshing state... [id=labflow-anh-112]\ndata.aws_caller_identity.toi: Reading...\ndata.aws_caller_identity.toi: Read complete after 0s [id=000000000000]\naws_sqs_queue.viec: Refreshing state... [id=http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec]\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  ~ update in-place\n-/+ destroy and then create replacement\nTerraform will perform the following actions:\n  # aws_s3_bucket.anh will be updated in-place\n  ~ resource \"aws_s3_bucket\" \"anh\" {\n        id                          = \"labflow-anh-112\"\n      ~ tags                        = {\n          + \"Owner\" = \"team-backend\"\n        }\n      ~ tags_all                    = {\n          + \"Owner\"     = \"team-backend\"\n            # (2 unchanged elements hidden)\n        }\n        # (14 unchanged attributes hidden)\n        # (3 unchanged blocks hidden)\n    }\n  # aws_sqs_queue.viec must be replaced\n-/+ resource \"aws_sqs_queue\" \"viec\" {\n      ~ arn                               = \"arn:aws:sqs:ap-southeast-1:000000000000:labflow-viec\" -> (known after apply)\n      + deduplication_scope               = (known after apply)\n      + fifo_throughput_limit             = (known after apply)\n      ~ id                                = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\" -> (known after apply)\n      ~ kms_data_key_reuse_period_seconds = 300 -> (known after apply)\n      ~ name                              = \"labflow-viec\" -> \"labflow-viec-v2\" # forces replacement\n      + name_prefix                       = (known after apply)\n      + policy                            = (known after apply)\n      + redrive_allow_policy              = (known after apply)\n      ~ sqs_managed_sse_enabled           = true -> (known after apply)\n      - tags                              = {} -> null\n      ~ url                               = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\" -> (known after apply)\n        # (11 unchanged attributes hidden)\n    }\nPlan: 1 to add, 1 to change, 1 to destroy.\nChanges to Outputs:\n  ~ hang_doi_url = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\" -> (known after apply)");
const OUT_113_BOT_AZ = out("# prod.tfvars: so_az = 3 -> 2\n$ terraform plan -var-file=prod.tfvars -var so_az=2\n  # module.mang.aws_route_table_association.cong_khai[\"ap-southeast-1c\"] will be destroyed\n  # module.mang.aws_subnet.cong_khai[\"ap-southeast-1c\"] will be destroyed\n  # module.mang.aws_subnet.rieng[\"ap-southeast-1c\"] will be destroyed\nPlan: 0 to add, 0 to change, 3 to destroy.");
const OUT_113_CD = out("$ terraform init\nDownloading registry.terraform.io/terraform-aws-modules/vpc/aws 6.8.0 for vpc...\nTerraform has been successfully initialized!\n$ terraform plan\nPlan: 17 to add, 0 to change, 0 to destroy.\n$ terraform apply -auto-approve\nApply complete! Resources: 17 added, 0 changed, 0 destroyed.\n$ terraform state list\nmodule.vpc.aws_default_network_acl.this[0]\nmodule.vpc.aws_default_route_table.default[0]\nmodule.vpc.aws_default_security_group.this[0]\nmodule.vpc.aws_internet_gateway.this[0]\nmodule.vpc.aws_route.public_internet_gateway[0]\nmodule.vpc.aws_route_table.private[0]\nmodule.vpc.aws_route_table.private[1]\nmodule.vpc.aws_route_table.public[0]\nmodule.vpc.aws_route_table_association.private[0]\nmodule.vpc.aws_route_table_association.private[1]\nmodule.vpc.aws_route_table_association.public[0]\nmodule.vpc.aws_route_table_association.public[1]\nmodule.vpc.aws_subnet.private[0]\nmodule.vpc.aws_subnet.private[1]\nmodule.vpc.aws_subnet.public[0]\nmodule.vpc.aws_subnet.public[1]\nmodule.vpc.aws_vpc.this[0]\nDestroy complete! Resources: 17 destroyed.");
const OUT_113_COUNT_TAO = out("Apply complete! Resources: 6 added, 0 changed, 0 destroyed.");
const OUT_113_COUNT = out("# variable \"hang\": [\"anh\", \"email\", \"bao-cao\"]  ->  [\"email\", \"bao-cao\"]\n$ terraform plan -var 'hang=[\"email\",\"bao-cao\"]'\n  # aws_sqs_queue.theo_count[0] must be replaced\n      ~ name                              = \"c-anh\" -> \"c-email\" # forces replacement\n  # aws_sqs_queue.theo_count[1] must be replaced\n      ~ name                              = \"c-email\" -> \"c-bao-cao\" # forces replacement\n  # aws_sqs_queue.theo_count[2] will be destroyed\n  # (because index [2] is out of range for count)\n  # aws_sqs_queue.theo_for_each[\"anh\"] will be destroyed\n  # (because key [\"anh\"] is not in for_each map)\nPlan: 2 to add, 0 to change, 4 to destroy.");
const OUT_113_DEV_PROD = out("$ terraform workspace new dev\nCreated and switched to workspace \"dev\"!\n$ terraform apply -var-file=dev.tfvars -auto-approve\nPlan: 9 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 9 added, 0 changed, 0 destroyed.\n$ terraform output\nsubnet_cong_khai = {\n  \"ap-southeast-1a\" = \"10.10.0.0/24\"\n  \"ap-southeast-1b\" = \"10.10.1.0/24\"\n}\nsubnet_rieng = {\n  \"ap-southeast-1a\" = \"10.10.100.0/24\"\n  \"ap-southeast-1b\" = \"10.10.101.0/24\"\n}\nvpc_id = \"vpc-d7f1a7373ee19e819\"\n$ terraform workspace new prod\nCreated and switched to workspace \"prod\"!\n$ terraform apply -var-file=prod.tfvars -auto-approve\nPlan: 12 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 12 added, 0 changed, 0 destroyed.\n$ terraform output\nsubnet_cong_khai = {\n  \"ap-southeast-1a\" = \"10.20.0.0/24\"\n  \"ap-southeast-1b\" = \"10.20.1.0/24\"\n  \"ap-southeast-1c\" = \"10.20.2.0/24\"\n}\nsubnet_rieng = {\n  \"ap-southeast-1a\" = \"10.20.100.0/24\"\n  \"ap-southeast-1b\" = \"10.20.101.0/24\"\n  \"ap-southeast-1c\" = \"10.20.102.0/24\"\n}\nvpc_id = \"vpc-1068dcf0f42141bbd\"");
const OUT_113_DON = out("$ terraform workspace select prod && terraform destroy -var-file=prod.tfvars -auto-approve\nDestroy complete! Resources: 12 destroyed.\n$ terraform workspace select dev && terraform destroy -var-file=dev.tfvars -auto-approve\nDestroy complete! Resources: 9 destroyed.");
const OUT_113_STATE_LIST = out("$ terraform state list   # (workspace prod)\nmodule.mang.data.aws_availability_zones.co\nmodule.mang.aws_internet_gateway.nay\nmodule.mang.aws_route_table.cong_khai\nmodule.mang.aws_route_table_association.cong_khai[\"ap-southeast-1a\"]\nmodule.mang.aws_route_table_association.cong_khai[\"ap-southeast-1b\"]\nmodule.mang.aws_route_table_association.cong_khai[\"ap-southeast-1c\"]\nmodule.mang.aws_subnet.cong_khai[\"ap-southeast-1a\"]\nmodule.mang.aws_subnet.cong_khai[\"ap-southeast-1b\"]\nmodule.mang.aws_subnet.cong_khai[\"ap-southeast-1c\"]\nmodule.mang.aws_subnet.rieng[\"ap-southeast-1a\"]\nmodule.mang.aws_subnet.rieng[\"ap-southeast-1b\"]\nmodule.mang.aws_subnet.rieng[\"ap-southeast-1c\"]\nmodule.mang.aws_vpc.nay");
const OUT_113_VALIDATION = out("$ terraform init\nInitializing modules...\n- mang in modules/mang\nTerraform has been successfully initialized!\n$ terraform plan -var env=production -var cidr=10.10.0.0/16\nmodule.mang.data.aws_availability_zones.co: Reading...\nmodule.mang.data.aws_availability_zones.co: Read complete after 1s [id=ap-southeast-1]\nPlanning failed. Terraform encountered an error while generating this plan.\nError: Invalid value for variable\n  on variables.tf line 1:\n   1: variable \"env\" {\n    ├────────────────\n    │ var.env is \"production\"\nenv must be \"dev\" or \"prod\".\nThis was checked by the validation rule at variables.tf:4,3-13.\n# exit code: 1\n$ terraform plan\nError: No value for required variable\n  on variables.tf line 1:\n   1: variable \"env\" {\nThe root module input variable \"env\" is not set, and has no default value.\nUse a -var or -var-file command line argument to provide a value for this\nvariable.");
const OUT_113_VPCS = out("$ aws ec2 describe-vpcs --filters 'Name=tag:Project,Values=labflow' --query 'Vpcs[].[CidrBlock,Tags[?Key==`Name`]|[0].Value]' --output text\n10.10.0.0/16\tlabflow-dev\n10.20.0.0/16\tlabflow-prod");
const OUT_114_BACKEND = out("$ aws s3api create-bucket --bucket labflow-tfstate --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\nhttp://labflow-tfstate.s3.localhost.localstack.cloud:44166/\n$ aws s3api put-bucket-versioning --bucket labflow-tfstate --versioning-configuration Status=Enabled\n# added backend.tf (backend \"s3\", use_lockfile = true)\n$ terraform init -migrate-state -force-copy\nSuccessfully configured the backend \"s3\"! Terraform will automatically\nTerraform has been successfully initialized!\n$ aws s3 ls s3://labflow-tfstate --recursive\n2026-11-20 04:25:52       7875 labflow/dev/terraform.tfstate\n$ wc -c terraform.tfstate*\n   0 terraform.tfstate\n7876 terraform.tfstate.backup");
const OUT_114_BI_MAT = out("$ terraform init\n- Installed hashicorp/aws v6.73.0 (signed by HashiCorp)\n- Installed hashicorp/random v3.9.1 (signed by HashiCorp)\nTerraform has been successfully initialized!\n$ terraform apply -auto-approve\nPlan: 6 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 6 added, 0 changed, 0 destroyed.\n$ terraform output\nmat_khau = <sensitive>\n$ ls -l terraform.tfstate\n-rw-r--r--. 9152 terraform.tfstate\n$ grep -E '\"(result|secret_string)\"' terraform.tfstate\n\"secret_string\": \"cuPg…(20 chars, plain text)\",\n\"value\": \"secret_string\"\n\"result\": \"cuPg…(20 chars, plain text)\",\n\"value\": \"result\"");
const OUT_114_CHI_GHI = out("# a-co-dien.tf replaced by b-chi-ghi.tf (ephemeral + secret_string_wo)\n$ terraform apply -auto-approve\n      + secret_string_wo         = (write-only attribute)\nPlan: 5 to add, 0 to change, 0 to destroy.\n$ grep -cE '\"(result|secret_string)\": \"[^\"]' terraform.tfstate\n0\n$ grep -E 'secret_string(_wo)?\"' terraform.tfstate\n\"has_secret_string_wo\": true,\n\"secret_string\": \"\",\n\"secret_string_wo\": null,\n\"value\": \"secret_string\"\n\"value\": \"secret_string_wo\"\n$ aws secretsmanager get-secret-value --secret-id labflow/db --query 'length(SecretString)'\n20");
const OUT_114_DON = out("$ terraform destroy -auto-approve\nDestroy complete! Resources: 6 destroyed.\n$ aws s3 rb s3://labflow-tfstate --force\ndelete: s3://labflow-tfstate/labflow/dev/terraform.tfstate\nremove_bucket failed: s3://labflow-tfstate An error occurred (BucketNotEmpty) when calling the DeleteBucket operation: The bucket you tried to delete is not empty. You must delete all versions …\n# a versioned bucket keeps old versions of the state: delete every version first\ndeleted every version, then bucket labflow-tfstate\n$ aws s3 ls\n$ aws dynamodb list-tables --query TableNames --output text\n$ aws secretsmanager list-secrets --query 'SecretList[].Name' --output text\n# (empty)");
const OUT_114_DRIFT_SUA = out("$ terraform plan\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  ~ update in-place\nTerraform will perform the following actions:\n  # aws_s3_bucket_versioning.anh will be updated in-place\n  ~ resource \"aws_s3_bucket_versioning\" \"anh\" {\n        id                    = \"labflow-anh-114\"\n        # (3 unchanged attributes hidden)\n      ~ versioning_configuration {\n          ~ status     = \"Suspended\" -> \"Enabled\"\n            # (1 unchanged attribute hidden)\n        }\n    }\nPlan: 0 to add, 1 to change, 0 to destroy.\n$ terraform apply -auto-approve\nApply complete! Resources: 0 added, 1 changed, 0 destroyed.\n$ aws s3api get-bucket-versioning --bucket labflow-anh-114 --query Status --output text\nEnabled");
const OUT_114_DRIFT = out("$ aws s3api put-bucket-versioning --bucket labflow-anh-114 --versioning-configuration Status=Suspended\n# (someone 'just tested something' in the console)\n$ terraform plan -refresh-only\nNote: Objects have changed outside of Terraform\nTerraform detected the following changes made outside of Terraform since the\nlast \"terraform apply\" which may have affected this plan:\n  # aws_s3_bucket.anh has changed\n  ~ resource \"aws_s3_bucket\" \"anh\" {\n        id                          = \"labflow-anh-114\"\n        tags                        = {}\n      ~ versioning {\n          ~ enabled    = true -> false\n        }\n    }\n  # aws_s3_bucket_versioning.anh has changed\n  ~ resource \"aws_s3_bucket_versioning\" \"anh\" {\n        id                    = \"labflow-anh-114\"\n      ~ versioning_configuration {\n          ~ status     = \"Enabled\" -> \"Suspended\"\n        }\n    }");
const OUT_114_IMPORT_XONG = out("# cleaned by hand: removed recovery_period_in_days = 0, read/write_capacity = 0, tags_all, region, null lines\n$ terraform plan\n  # (imported from \"labflow-thu-tam\")\nPlan: 1 to import, 0 to add, 1 to change, 0 to destroy.\n$ terraform apply -auto-approve\naws_dynamodb_table.thu_tam: Importing... [id=labflow-thu-tam]\naws_dynamodb_table.thu_tam: Import complete [id=labflow-thu-tam]\nApply complete! Resources: 1 imported, 0 added, 1 changed, 0 destroyed.\n$ terraform state list | grep thu_tam\naws_dynamodb_table.thu_tam");
const OUT_114_IMPORT = out("# a table someone created by hand last month\n$ cat import.tf\nimport {\n  to = aws_dynamodb_table.thu_tam\n  id = \"labflow-thu-tam\"\n}\n$ terraform plan -generate-config-out=thu_tam.tf\naws_dynamodb_table.thu_tam: Preparing import... [id=labflow-thu-tam]\nError: expected point_in_time_recovery.0.recovery_period_in_days to be in the range (1 - 35), got 0\n$ grep -vE '= null|^#' thu_tam.tf\nresource \"aws_dynamodb_table\" \"thu_tam\" {\n  billing_mode                = \"PAY_PER_REQUEST\"\n  deletion_protection_enabled = false\n  hash_key                    = \"pk\"\n  name                        = \"labflow-thu-tam\"\n  read_capacity               = 0\n  region                      = \"ap-southeast-1\"\n  stream_enabled              = false\n  table_class                 = \"STANDARD\"\n  tags                        = {}\n  tags_all                    = {}\n  write_capacity              = 0\n  attribute {\n    name = \"pk\"\n    type = \"S\"\n  }\n  point_in_time_recovery {\n    enabled                 = false\n    recovery_period_in_days = 0\n  }\n  ttl {\n    enabled        = false\n  }\n}");
const OUT_114_KHOA_XONG = out("# terminal A finishes:\nApply complete! Resources: 0 added, 1 changed, 0 destroyed.\n$ aws s3 ls s3://labflow-tfstate --recursive\n2026-11-20 04:26:03       7870 labflow/dev/terraform.tfstate\n$ aws s3api list-object-versions --bucket labflow-tfstate --query 'length(Versions)'\n4");
const OUT_114_KHOA = out("# terminal A: terraform apply -var lan=2   (running, 25 s step)\n$ aws s3 ls s3://labflow-tfstate --recursive\n2026-11-20 04:25:52       7875 labflow/dev/terraform.tfstate\n2026-11-20 04:25:54        224 labflow/dev/terraform.tfstate.tflock\n# terminal B, same moment:\n$ terraform apply -auto-approve -var lan=3\nError: Error acquiring the state lock\nError message: operation error S3: PutObject, https response error\nStatusCode: 412, RequestID: 94930a00-feb6-4bc4-9d67-5e9f55fcd3ae, HostID:\ns9lzHYrFp76ZVxRcpX9+5cjAnEH2ROuNkd2BHfIa6UkFVdtjf5mKR3/eTPFvsiP/XV/VLi31234=,\napi error PreconditionFailed: At least one of the pre-conditions you\nspecified did not hold\nLock Info:\n  ID:        e37e848d-995b-5d45-fd5a-df70b18c28a5\n  Path:      labflow-tfstate/labflow/dev/terraform.tfstate\n  Operation: OperationTypeApply\n  Who:       @lab-machine\n  Version:   1.17.2\n  Created:   2026-11-20 04:25:54.876951984 +0000 UTC\n  Info:");
const OUT_114_MOVED = out("# renamed aws_s3_bucket.anh -> aws_s3_bucket.anh_lab, NO moved block\n$ terraform plan\n  # aws_s3_bucket.anh will be destroyed\n  # aws_s3_bucket.anh_lab will be created\nPlan: 2 to add, 0 to change, 2 to destroy.\n$ cat moved.tf\nmoved {\n  from = aws_s3_bucket.anh\n  to   = aws_s3_bucket.anh_lab\n}\n$ terraform plan\n  # aws_s3_bucket.anh has moved to aws_s3_bucket.anh_lab\nPlan: 0 to add, 0 to change, 0 to destroy.");
const OUT_114_STATE_SHOW = out("$ terraform state show aws_s3_bucket.anh | head -12\n# aws_s3_bucket.anh:\nresource \"aws_s3_bucket\" \"anh\" {\n    acceleration_status         = null\n    arn                         = \"arn:aws:s3:::labflow-anh-114\"\n    bucket                      = \"labflow-anh-114\"\n    bucket_domain_name          = \"labflow-anh-114.s3.amazonaws.com\"\n    bucket_namespace            = \"global\"\n    bucket_prefix               = null\n    bucket_region               = \"ap-southeast-1\"\n    bucket_regional_domain_name = \"labflow-anh-114.s3.ap-southeast-1.amazonaws.com\"\n    force_destroy               = true\n    hosted_zone_id              = \"Z3O0J2DXBE1FTB\"");
const OUT_115_DON = out("$ bash don.sh\nDestroy complete! Resources: 14 destroyed.\ndeleted every version, then bucket labflow-tfstate-lab\n$ bash con-gi.sh\nVPC (not default):  0\nSubnets in them:    0\nS3 buckets:         0\nDynamoDB tables:    0\nTerraform state:    0");
const OUT_115_GIAI = out("$ bash truoc.sh\n$ aws s3api create-bucket --bucket labflow-tfstate-lab --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\nhttp://labflow-tfstate-lab.s3.localhost.localstack.cloud:44166/\n$ aws s3api put-bucket-versioning --bucket labflow-tfstate-lab --versioning-configuration Status=Enabled\n$ terraform init\nSuccessfully configured the backend \"s3\"! Terraform will automatically\nTerraform has been successfully initialized!\n$ terraform apply -var-file=dev.tfvars -auto-approve\nPlan: 14 to add, 0 to change, 0 to destroy.\nApply complete! Resources: 14 added, 0 changed, 0 destroyed.\n$ bash cham.sh\n  ✅ 1 state lives in s3://labflow-tfstate-lab (no local state)\n  ✅ 2 state bucket has versioning\n  ✅ 3 VPC 10.40.0.0/16: 4 subnets in 2 AZs\n  ✅ 4 photo bucket: versioning Enabled, encryption AES256\n  ✅ 5 tags Project=labflow Env=dev\n  ✅ 6 table on-demand, key HASH+RANGE\n  ✅ 7 TTL hetHan + point-in-time recovery\n  ✅ 8 plan shows no changes; env=production is rejected\nScore: 8/8");
const OUT_115_VOI = out("$ terraform init && terraform apply -auto-approve   # hasty version\nTerraform has been successfully initialized!\nApply complete! Resources: 5 added, 0 changed, 0 destroyed.\n$ bash cham.sh\n  ❌ 1 state is not in the S3 backend\n  ❌ 2 state bucket missing or no versioning\n  ❌ 3 VPC has 1 subnet(s) in 1 AZ(s), expected 4 in 2\n  ✅ 4 photo bucket: versioning Enabled, encryption AES256\n  ❌ 5 tags: Project='labflow' Env='None'\n  ❌ 6 table: RCU '5', key 'HASH'\n  ❌ 7 TTL 'DISABLED None', PITR 'DISABLED'\n  ❌ 8 plan exit 0 (want 0), validation missing\nScore: 1/8");
const OUT_112_SUA_TAI_CHO_GON = out("# main.tf: added  tags = { Owner = \"team-backend\" }  to aws_s3_bucket.anh\n$ terraform plan\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  ~ update in-place\nTerraform will perform the following actions:\n  # aws_s3_bucket.anh will be updated in-place\n  ~ resource \"aws_s3_bucket\" \"anh\" {\n        id                          = \"labflow-anh-112\"\n      ~ tags                        = {\n          + \"Owner\" = \"team-backend\"\n        }\n      ~ tags_all                    = {\n          + \"Owner\"     = \"team-backend\"\n            # (2 unchanged elements hidden)\n        }\n        # (14 unchanged attributes hidden)\n        # (3 unchanged blocks hidden)\n    }\nPlan: 0 to add, 1 to change, 0 to destroy.");
const OUT_112_THAY_MOI_GON = out("# main.tf: queue name \"labflow-viec\" -> \"labflow-viec-v2\"\n$ terraform plan\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  ~ update in-place\n-/+ destroy and then create replacement\nTerraform will perform the following actions:\n  # aws_s3_bucket.anh will be updated in-place\n  ~ resource \"aws_s3_bucket\" \"anh\" {\n        id                          = \"labflow-anh-112\"\n      ~ tags                        = {\n          + \"Owner\" = \"team-backend\"\n        }\n      ~ tags_all                    = {\n          + \"Owner\"     = \"team-backend\"\n            # (2 unchanged elements hidden)\n        }\n        # (14 unchanged attributes hidden)\n        # (3 unchanged blocks hidden)\n    }\n  # aws_sqs_queue.viec must be replaced\n-/+ resource \"aws_sqs_queue\" \"viec\" {\n      ~ arn                               = \"arn:aws:sqs:ap-southeast-1:000000000000:labflow-viec\" -> (known after apply)\n      + deduplication_scope               = (known after apply)\n      + fifo_throughput_limit             = (known after apply)\n      ~ id                                = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\" -> (known after apply)\n      ~ kms_data_key_reuse_period_seconds = 300 -> (known after apply)\n      ~ name                              = \"labflow-viec\" -> \"labflow-viec-v2\" # forces replacement\n      + name_prefix                       = (known after apply)\n      + policy                            = (known after apply)\n      + redrive_allow_policy              = (known after apply)\n      ~ sqs_managed_sse_enabled           = true -> (known after apply)\n      - tags                              = {} -> null\n      ~ url                               = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\" -> (known after apply)\n        # (11 unchanged attributes hidden)\n    }\nPlan: 1 to add, 1 to change, 1 to destroy.\nChanges to Outputs:\n  ~ hang_doi_url = \"http://sqs.ap-southeast-1.localhost.localstack.cloud:44166/000000000000/labflow-viec\" -> (known after apply)");
const OUT_112_PLAN_GON = out("$ terraform plan -out=plan.tfplan\nTerraform used the selected providers to generate the following execution\nplan. Resource actions are indicated with the following symbols:\n  + create\nTerraform will perform the following actions:\n  # … aws_dynamodb_table.datlich, aws_s3_bucket.anh, aws_sqs_queue.chet will be created (cut) …\n  # aws_sqs_queue.viec will be created\n  + resource \"aws_sqs_queue\" \"viec\" {\n      + arn                               = (known after apply)\n      + content_based_deduplication       = false\n      + deduplication_scope               = (known after apply)\n      + delay_seconds                     = 0\n      + fifo_queue                        = false\n      + fifo_throughput_limit             = (known after apply)\n      + id                                = (known after apply)\n      + kms_data_key_reuse_period_seconds = (known after apply)\n      + max_message_size                  = 262144\n      + message_retention_seconds         = 345600\n      + name                              = \"labflow-viec\"\n      + name_prefix                       = (known after apply)\n      + policy                            = (known after apply)\n      + receive_wait_time_seconds         = 0\n      + redrive_allow_policy              = (known after apply)\n      + redrive_policy                    = (known after apply)\n      + region                            = \"ap-southeast-1\"\n      + sqs_managed_sse_enabled           = (known after apply)\n      + tags_all                          = {\n          + \"ManagedBy\" = \"terraform\"\n          + \"Project\"   = \"labflow\"\n        }\n      + url                               = (known after apply)\n      + visibility_timeout_seconds        = 60\n    }\nPlan: 4 to add, 0 to change, 0 to destroy.\nChanges to Outputs:\n  + hang_doi_url = (known after apply)\n  + tai_khoan    = \"000000000000\"");
const MA_TF111 = hcl("terraform {\n  required_providers {\n    aws = { source = \"hashicorp/aws\", version = \"~> 6.0\" }\n  }\n}\n\nlocals {\n  env = terraform.workspace # \"dev\" or \"staging\": one file, many environments\n}\n\nresource \"aws_s3_bucket\" \"anh\" {\n  bucket = \"labflow-anh-${local.env}\"\n}\n\nresource \"aws_s3_bucket_versioning\" \"anh\" {\n  bucket = aws_s3_bucket.anh.id\n  versioning_configuration {\n    status = \"Enabled\"\n  }\n}\n\nresource \"aws_s3_bucket_public_access_block\" \"anh\" {\n  bucket                  = aws_s3_bucket.anh.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}\n\nresource \"aws_sqs_queue\" \"viec\" {\n  name                       = \"labflow-viec-${local.env}\"\n  visibility_timeout_seconds = 60\n}\n\nresource \"aws_dynamodb_table\" \"datlich\" {\n  name         = \"labflow-datlich-${local.env}\"\n  billing_mode = \"PAY_PER_REQUEST\"\n  hash_key     = \"pk\"\n  range_key    = \"sk\"\n  attribute {\n    name = \"pk\"\n    type = \"S\"\n  }\n  attribute {\n    name = \"sk\"\n    type = \"S\"\n  }\n}");
const MA_TF111_TOFU = hcl("# No provider needed: terraform_data is built into both Terraform and OpenTofu\nresource \"terraform_data\" \"loi_chao\" {\n  input = \"same HCL, two tools\"\n}\n\noutput \"loi_chao\" {\n  value = terraform_data.loi_chao.output\n}");
const MA_TF112_VERS = hcl("terraform {\n  required_version = \">= 1.10\"\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 6.0\" # any 6.x, never 7.0 by surprise; the exact pick is recorded in .terraform.lock.hcl\n    }\n  }\n}");
const MA_TF112 = hcl("# Data sources READ what already exists; resources CREATE and own things.\ndata \"aws_caller_identity\" \"toi\" {}\ndata \"aws_region\" \"nay\" {}\n\nresource \"aws_s3_bucket\" \"anh\" {\n  bucket        = \"labflow-anh-112\"\n  force_destroy = true # lab only: lets destroy empty the bucket first\n}\n\nresource \"aws_sqs_queue\" \"chet\" {\n  name = \"labflow-viec-dlq\"\n}\n\nresource \"aws_sqs_queue\" \"viec\" {\n  name                       = \"labflow-viec\"\n  visibility_timeout_seconds = 60\n  redrive_policy = jsonencode({\n    deadLetterTargetArn = aws_sqs_queue.chet.arn # this reference IS the dependency\n    maxReceiveCount     = 3\n  })\n}\n\nresource \"aws_dynamodb_table\" \"datlich\" {\n  name         = \"labflow-datlich\"\n  billing_mode = \"PAY_PER_REQUEST\"\n  hash_key     = \"pk\"\n  attribute {\n    name = \"pk\"\n    type = \"S\"\n  }\n}\n\noutput \"tai_khoan\" {\n  value = data.aws_caller_identity.toi.account_id\n}\n\noutput \"hang_doi_url\" {\n  value = aws_sqs_queue.viec.url\n}");
const MA_TF113_MOD_VAR = hcl("variable \"ten\" {\n  description = \"Name prefix, e.g. labflow-dev\"\n  type        = string\n}\n\nvariable \"cidr\" {\n  description = \"VPC CIDR block, e.g. 10.10.0.0/16\"\n  type        = string\n}\n\nvariable \"so_az\" {\n  description = \"How many Availability Zones to spread subnets over\"\n  type        = number\n  default     = 2\n}");
const MA_TF113_MOD = hcl("data \"aws_availability_zones\" \"co\" {\n  state = \"available\"\n}\n\nlocals {\n  azs = slice(data.aws_availability_zones.co.names, 0, var.so_az)\n  # one /24 public + one /24 private per AZ, keyed by AZ name (stable keys => for_each)\n  cong_khai = { for i, az in local.azs : az => cidrsubnet(var.cidr, 8, i) }\n  rieng     = { for i, az in local.azs : az => cidrsubnet(var.cidr, 8, i + 100) }\n}\n\nresource \"aws_vpc\" \"nay\" {\n  cidr_block           = var.cidr\n  enable_dns_hostnames = true\n  tags                 = { Name = var.ten }\n}\n\nresource \"aws_internet_gateway\" \"nay\" {\n  vpc_id = aws_vpc.nay.id\n}\n\nresource \"aws_subnet\" \"cong_khai\" {\n  for_each                = local.cong_khai\n  vpc_id                  = aws_vpc.nay.id\n  availability_zone       = each.key\n  cidr_block              = each.value\n  map_public_ip_on_launch = true\n  tags                    = { Name = \"${var.ten}-public-${each.key}\" }\n}\n\nresource \"aws_subnet\" \"rieng\" {\n  for_each          = local.rieng\n  vpc_id            = aws_vpc.nay.id\n  availability_zone = each.key\n  cidr_block        = each.value\n  tags              = { Name = \"${var.ten}-private-${each.key}\" }\n}\n\nresource \"aws_route_table\" \"cong_khai\" {\n  vpc_id = aws_vpc.nay.id\n  route {\n    cidr_block = \"0.0.0.0/0\"\n    gateway_id = aws_internet_gateway.nay.id\n  }\n}\n\nresource \"aws_route_table_association\" \"cong_khai\" {\n  for_each       = aws_subnet.cong_khai\n  subnet_id      = each.value.id\n  route_table_id = aws_route_table.cong_khai.id\n}");
const MA_TF113_MOD_OUT = hcl("output \"vpc_id\" {\n  value = aws_vpc.nay.id\n}\n\noutput \"subnet_cong_khai\" {\n  value = { for az, s in aws_subnet.cong_khai : az => s.cidr_block }\n}\n\noutput \"subnet_rieng\" {\n  value = { for az, s in aws_subnet.rieng : az => s.cidr_block }\n}");
const MA_TF113_VAR = hcl("variable \"env\" {\n  description = \"Environment name\"\n  type        = string\n  validation {\n    condition     = contains([\"dev\", \"prod\"], var.env)\n    error_message = \"env must be \\\"dev\\\" or \\\"prod\\\".\"\n  }\n}\n\nvariable \"cidr\" {\n  type = string\n}\n\nvariable \"so_az\" {\n  type    = number\n  default = 2\n}");
const MA_TF113 = hcl("locals {\n  ten = \"labflow-${var.env}\"\n}\n\nmodule \"mang\" {\n  source = \"./modules/mang\"\n  ten    = local.ten\n  cidr   = var.cidr\n  so_az  = var.so_az\n}\n\noutput \"vpc_id\" {\n  value = module.mang.vpc_id\n}\n\noutput \"subnet_cong_khai\" {\n  value = module.mang.subnet_cong_khai\n}\n\noutput \"subnet_rieng\" {\n  value = module.mang.subnet_rieng\n}");
const MA_TF113_DEV = hcl("env   = \"dev\"\ncidr  = \"10.10.0.0/16\"\nso_az = 2");
const MA_TF113_PROD = hcl("env   = \"prod\"\ncidr  = \"10.20.0.0/16\"\nso_az = 3");
const MA_TF113_COUNT = hcl("variable \"hang\" {\n  type    = list(string)\n  default = [\"anh\", \"email\", \"bao-cao\"]\n}\n\n# Version A — count: identity = position in the list\nresource \"aws_sqs_queue\" \"theo_count\" {\n  count = length(var.hang)\n  name  = \"c-${var.hang[count.index]}\"\n}\n\n# Version B — for_each: identity = the value itself\nresource \"aws_sqs_queue\" \"theo_for_each\" {\n  for_each = toset(var.hang)\n  name     = \"f-${each.key}\"\n}");
const MA_TF113_CD = hcl("module \"vpc\" {\n  source  = \"terraform-aws-modules/vpc/aws\"\n  version = \"~> 6.0\"\n\n  name            = \"labflow-cd\"\n  cidr            = \"10.30.0.0/16\"\n  azs             = [\"ap-southeast-1a\", \"ap-southeast-1b\"]\n  public_subnets  = [\"10.30.0.0/24\", \"10.30.1.0/24\"]\n  private_subnets = [\"10.30.100.0/24\", \"10.30.101.0/24\"]\n\n  enable_nat_gateway = false # NAT costs ~43 USD/month per gateway (Lesson 3.4)\n}");
const MA_TF114_A = hcl("# Version A — the classic way: the generated password is stored in the state file\nresource \"random_password\" \"db\" {\n  length  = 20\n  special = false\n}\n\nresource \"aws_secretsmanager_secret\" \"db\" {\n  name                    = \"labflow/db\"\n  recovery_window_in_days = 0 # lab only: delete at once on destroy\n}\n\nresource \"aws_secretsmanager_secret_version\" \"db\" {\n  secret_id     = aws_secretsmanager_secret.db.id\n  secret_string = random_password.db.result\n}\n\noutput \"mat_khau\" {\n  value     = random_password.db.result\n  sensitive = true # hides it on screen — NOT in the state\n}");
const MA_TF114_B = hcl("# Version B — Terraform 1.11+: ephemeral value + write-only argument, never written to state\nephemeral \"random_password\" \"db\" {\n  length  = 20\n  special = false\n}\n\nresource \"aws_secretsmanager_secret\" \"db\" {\n  name                    = \"labflow/db\"\n  recovery_window_in_days = 0\n}\n\nresource \"aws_secretsmanager_secret_version\" \"db\" {\n  secret_id                = aws_secretsmanager_secret.db.id\n  secret_string_wo         = ephemeral.random_password.db.result\n  secret_string_wo_version = 1 # bump to 2 to rotate\n}");
const MA_TF114_BACKEND = hcl("terraform {\n  backend \"s3\" {\n    bucket       = \"labflow-tfstate\"\n    key          = \"labflow/dev/terraform.tfstate\"\n    region       = \"ap-southeast-1\"\n    use_lockfile = true # S3-native lock (Terraform 1.10+); no DynamoDB table needed\n\n    # LocalStack only — on AWS delete these five lines and use your normal credentials\n    endpoints                   = { s3 = \"http://127.0.0.1:44166\" }\n    use_path_style              = true\n    skip_credentials_validation = true\n    skip_requesting_account_id  = true\n    access_key                  = \"test\"\n    secret_key                  = \"test\"\n  }\n}");
const MA_PROVIDER = hcl("provider \"aws\" {\n  region                      = \"ap-southeast-1\"\n  access_key                  = \"test\" # LocalStack only. On real AWS: no keys in code (AWS_PROFILE, SSO, OIDC)\n  secret_key                  = \"test\"\n  skip_credentials_validation = true\n  skip_requesting_account_id  = true\n  skip_metadata_api_check     = true\n  s3_use_path_style           = true\n  endpoints {\n    s3             = \"http://127.0.0.1:44166\"\n    dynamodb       = \"http://127.0.0.1:44166\"\n    sqs            = \"http://127.0.0.1:44166\"\n    ec2            = \"http://127.0.0.1:44166\"\n    sts            = \"http://127.0.0.1:44166\"\n    iam            = \"http://127.0.0.1:44166\"\n    secretsmanager = \"http://127.0.0.1:44166\"\n    cloudformation = \"http://127.0.0.1:44166\"\n  }\n  default_tags {\n    tags = { Project = \"labflow\", ManagedBy = \"terraform\" }\n  }\n}");
const MA_L_CHAM = bash("#!/bin/bash\n# Bộ chấm lab 11 — 8 phép, đọc thứ ĐANG TỒN TẠI (AWS CLI) + hành vi của Terraform. Dùng: bash cham.sh <thư mục cấu hình trong W11>\nsource \"$(dirname \"$0\")/../chung11.sh\"; D=${1:-lab}; diem=0\nok() { echo \"  ✅ $1\"; diem=$((diem+1)); }; ko() { echo \"  ❌ $1\"; }\n# 1 state ở S3, không nằm trên máy\nif a s3api head-object --bucket labflow-tfstate-lab --key labflow/lab/terraform.tfstate >/dev/null && ! grep -qs '\"resources\": \\[$' $W11/$D/terraform.tfstate\nthen ok \"1 state lives in s3://labflow-tfstate-lab (no local state)\"; else ko \"1 state is not in the S3 backend\"; fi\n# 2 bucket state bật versioning\n[ \"$(a s3api get-bucket-versioning --bucket labflow-tfstate-lab --query Status --output text)\" = Enabled ] && ok \"2 state bucket has versioning\" || ko \"2 state bucket missing or no versioning\"\n# 3 VPC 10.40.0.0/16 với 4 subnet trên 2 AZ\nV=$(a ec2 describe-vpcs --filters Name=cidr-block-association.cidr-block,Values=10.40.0.0/16 --query 'Vpcs[0].VpcId' --output text)\nif [ -n \"$V\" ] && [ \"$V\" != None ]; then\n  n=$(a ec2 describe-subnets --filters Name=vpc-id,Values=$V --query 'length(Subnets)' --output text)\n  z=$(a ec2 describe-subnets --filters Name=vpc-id,Values=$V --query 'Subnets[].AvailabilityZone' --output text | tr '\\t' '\\n' | sort -u | wc -l)\n  [ \"$n\" = 4 ] && [ \"$z\" = 2 ] && ok \"3 VPC 10.40.0.0/16: 4 subnets in 2 AZs\" || ko \"3 VPC has $n subnet(s) in $z AZ(s), expected 4 in 2\"\nelse ko \"3 no VPC 10.40.0.0/16\"; fi\n# 4 bucket ảnh: versioning + mã hoá\nvs=$(a s3api get-bucket-versioning --bucket labflow-anh-lab --query Status --output text)\nen=$(a s3api get-bucket-encryption --bucket labflow-anh-lab --query 'ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm' --output text)\n[ \"$vs\" = Enabled ] && [ -n \"$en\" ] && ok \"4 photo bucket: versioning $vs, encryption $en\" || ko \"4 photo bucket: versioning '${vs:-?}', encryption '${en:-none}'\"\n# 5 tag Project + Env trên VPC (default_tags)\nt=$( [ -n \"$V\" ] && a ec2 describe-vpcs --vpc-ids $V --query 'Vpcs[0].Tags[?Key==`Env`].Value|[0]' --output text)\np=$( [ -n \"$V\" ] && a ec2 describe-vpcs --vpc-ids $V --query 'Vpcs[0].Tags[?Key==`Project`].Value|[0]' --output text)\n[ \"$t\" = dev ] && [ \"$p\" = labflow ] && ok \"5 tags Project=labflow Env=dev\" || ko \"5 tags: Project='${p:-}' Env='${t:-}'\"\n# 6 bảng: on-demand + khoá hai phần\nr=$(a dynamodb describe-table --table-name labflow-datlich-lab --query 'Table.ProvisionedThroughput.ReadCapacityUnits' --output text)\nk=$(a dynamodb describe-table --table-name labflow-datlich-lab --query 'Table.KeySchema[].KeyType' --output text | tr '\\t' '+')\n[ \"$r\" = 0 ] && [ \"$k\" = HASH+RANGE ] && ok \"6 table on-demand, key HASH+RANGE\" || ko \"6 table: RCU '${r:-?}', key '${k:-?}'\"\n# 7 TTL hetHan + PITR\nttl=$(a dynamodb describe-time-to-live --table-name labflow-datlich-lab --query 'TimeToLiveDescription.[TimeToLiveStatus,AttributeName]' --output text | tr '\\t' ' ')\npitr=$(a dynamodb describe-continuous-backups --table-name labflow-datlich-lab --query 'ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus' --output text)\n[ \"$ttl\" = \"ENABLED hetHan\" ] && [ \"$pitr\" = ENABLED ] && ok \"7 TTL hetHan + point-in-time recovery\" || ko \"7 TTL '${ttl:-none}', PITR '${pitr:-?}'\"\n# 8 plan không đổi gì + validation chặn env sai\ntfx $D plan -detailed-exitcode -var-file=dev.tfvars >/dev/null 2>&1; e1=$?\n[ -f $W11/$D/dev.tfvars ] || { tfx $D plan -detailed-exitcode >/dev/null 2>&1; e1=$?; }\ntfx $D plan -var env=production 2>&1 | grep -q 'env must be' ; e2=$?\n[ $e1 = 0 ] && [ $e2 = 0 ] && ok \"8 plan shows no changes; env=production is rejected\" || ko \"8 plan exit $e1 (want 0), validation $( [ $e2 = 0 ] && echo ok || echo missing)\"\necho \"Score: $diem/8\"");
const MA_L_CHAY = bash("#!/bin/bash\n# Chạy trọn lab 11: bản vội ⇒ chấm ⇒ dọn ⇒ lời giải ⇒ chấm ⇒ dọn ⇒ còn gì. Output ~/.rtq-aws/c11/115-*.txt\nH=$(cd \"$(dirname \"$0\")\" && pwd); source $H/../chung11.sh; dam_bao11 || exit 1; O=$O11\nmoi lab; cp $H/voi/*.tf $W11/lab/; sed 's/Env = var.env, //' $H/provider-lab.tf > $W11/lab/provider.tf\nprintf 'terraform {\\n  required_providers {\\n    aws = { source = \"hashicorp/aws\", version = \"~> 6.0\" }\\n  }\\n}\\n' > $W11/lab/versions.tf\n{ echo \"\\$ terraform init && terraform apply -auto-approve   # hasty version\"; tfx lab init | grep -E \"successfully initialized\"; tfx lab apply -auto-approve | grep -E \"Apply complete|Error\"\n  echo \"\\$ bash cham.sh\"; bash $H/cham.sh lab; } > $O/115-voi.txt\ntfx lab destroy -auto-approve >/dev/null\nmoi lab; cp -r $H/giai/. $W11/lab/; cp $H/provider-lab.tf $W11/lab/provider.tf\n{ echo \"\\$ bash truoc.sh\"; bash $H/truoc.sh\n  echo \"\\$ terraform init\"; tfx lab init | grep -E \"Successfully configured|successfully initialized\"\n  echo \"\\$ terraform apply -var-file=dev.tfvars -auto-approve\"; tfx lab apply -var-file=dev.tfvars -auto-approve | grep -E \"Plan:|Apply complete|Error\"\n  echo \"\\$ bash cham.sh\"; bash $H/cham.sh lab; } > $O/115-giai.txt\n{ echo \"\\$ bash don.sh\"; bash $H/don.sh lab; echo \"\\$ bash con-gi.sh\"; bash $H/con-gi.sh; } > $O/115-don.txt\necho xong-115");
const MA_L_CONGI = bash("#!/bin/bash\n# Còn gì đang tồn tại (và trên AWS thật: đang tính tiền)?\nsource \"$(dirname \"$0\")/../chung11.sh\"\necho \"VPC (not default):  $(a ec2 describe-vpcs --query 'length(Vpcs[?IsDefault==`false`])' --output text)\"\necho \"Subnets in them:    $(a ec2 describe-subnets --query 'length(Subnets[?DefaultForAz==`false`])' --output text)\"\necho \"S3 buckets:         $(a s3api list-buckets --query 'length(Buckets)' --output text)\"\necho \"DynamoDB tables:    $(a dynamodb list-tables --query 'length(TableNames)' --output text)\"\necho \"Terraform state:    $(a s3 ls s3://labflow-tfstate-lab --recursive 2>/dev/null | wc -l)\"");
const MA_L_DON = bash("#!/bin/bash\n# Dọn: destroy theo state, rồi xoá bucket state (cuối cùng — nó giữ \"ai đang tồn tại\").\nsource \"$(dirname \"$0\")/../chung11.sh\"; D=${1:-lab}\ntfx $D destroy -auto-approve -var-file=dev.tfvars | grep -E \"Destroy complete|Error\"\nxoa_bucket_ver labflow-tfstate-lab");
const MA_L_TRUOC = bash("#!/bin/bash\n# Bước mồi (bootstrap): bucket chứa state phải có TRƯỚC khi terraform init dùng nó.\nsource \"$(dirname \"$0\")/../chung11.sh\"\nL s3api create-bucket --bucket labflow-tfstate-lab --create-bucket-configuration LocationConstraint=ap-southeast-1 --query Location --output text\nL s3api put-bucket-versioning --bucket labflow-tfstate-lab --versioning-configuration Status=Enabled");
const MA_VOI_MAIN = hcl("# The hasty version: \"it works on my laptop\"\nresource \"aws_vpc\" \"nay\" {\n  cidr_block = \"10.40.0.0/16\"\n}\n\nresource \"aws_subnet\" \"mot\" {\n  vpc_id     = aws_vpc.nay.id\n  cidr_block = \"10.40.0.0/24\"\n}\n\nresource \"aws_s3_bucket\" \"anh\" {\n  bucket        = \"labflow-anh-lab\"\n  force_destroy = true\n}\n\nresource \"aws_s3_bucket_versioning\" \"anh\" {\n  bucket = aws_s3_bucket.anh.id\n  versioning_configuration {\n    status = \"Enabled\"\n  }\n}\n\nresource \"aws_dynamodb_table\" \"datlich\" {\n  name           = \"labflow-datlich-lab\"\n  read_capacity  = 5\n  write_capacity = 5\n  hash_key       = \"pk\"\n  attribute {\n    name = \"pk\"\n    type = \"S\"\n  }\n}");
const MA_GIAI_BACKEND = hcl("terraform {\n  required_version = \">= 1.10\"\n  required_providers {\n    aws = { source = \"hashicorp/aws\", version = \"~> 6.0\" }\n  }\n  backend \"s3\" {\n    bucket       = \"labflow-tfstate-lab\"\n    key          = \"labflow/lab/terraform.tfstate\"\n    region       = \"ap-southeast-1\"\n    use_lockfile = true\n    # LocalStack only:\n    endpoints                   = { s3 = \"http://127.0.0.1:44166\" }\n    use_path_style              = true\n    skip_credentials_validation = true\n    skip_requesting_account_id  = true\n    access_key                  = \"test\"\n    secret_key                  = \"test\"\n  }\n}");
const MA_GIAI_MAIN = hcl("module \"mang\" {\n  source = \"./modules/mang\"\n  ten    = \"labflow-${var.env}\"\n  cidr   = var.cidr\n  so_az  = 2\n}\n\nresource \"aws_s3_bucket\" \"anh\" {\n  bucket        = \"labflow-anh-lab\"\n  force_destroy = true # lab only\n}\n\nresource \"aws_s3_bucket_versioning\" \"anh\" {\n  bucket = aws_s3_bucket.anh.id\n  versioning_configuration {\n    status = \"Enabled\"\n  }\n}\n\nresource \"aws_s3_bucket_server_side_encryption_configuration\" \"anh\" {\n  bucket = aws_s3_bucket.anh.id\n  rule {\n    apply_server_side_encryption_by_default {\n      sse_algorithm = \"AES256\"\n    }\n  }\n}\n\nresource \"aws_s3_bucket_public_access_block\" \"anh\" {\n  bucket                  = aws_s3_bucket.anh.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}\n\nresource \"aws_dynamodb_table\" \"datlich\" {\n  name         = \"labflow-datlich-lab\"\n  billing_mode = \"PAY_PER_REQUEST\"\n  hash_key     = \"pk\"\n  range_key    = \"sk\"\n  attribute {\n    name = \"pk\"\n    type = \"S\"\n  }\n  attribute {\n    name = \"sk\"\n    type = \"S\"\n  }\n  ttl {\n    attribute_name = \"hetHan\"\n    enabled        = true\n  }\n  point_in_time_recovery {\n    enabled = true\n  }\n}\n\noutput \"vpc_id\" {\n  value = module.mang.vpc_id\n}");
const MA_GIAI_VARIABLES = hcl("variable \"env\" {\n  type = string\n  validation {\n    condition     = contains([\"dev\", \"prod\"], var.env)\n    error_message = \"env must be \\\"dev\\\" or \\\"prod\\\".\"\n  }\n}\n\nvariable \"cidr\" {\n  type    = string\n  default = \"10.40.0.0/16\"\n}");
const MA_PROVIDER_LAB = hcl("provider \"aws\" {\n  region                      = \"ap-southeast-1\"\n  access_key                  = \"test\" # LocalStack only\n  secret_key                  = \"test\"\n  skip_credentials_validation = true\n  skip_requesting_account_id  = true\n  skip_metadata_api_check     = true\n  s3_use_path_style           = true\n  endpoints {\n    s3       = \"http://127.0.0.1:44166\"\n    dynamodb = \"http://127.0.0.1:44166\"\n    ec2      = \"http://127.0.0.1:44166\"\n    sts      = \"http://127.0.0.1:44166\"\n  }\n  default_tags {\n    tags = { Project = \"labflow\", Env = var.env, ManagedBy = \"terraform\" }\n  }\n}");
const MA_CFN = yml("AWSTemplateFormatVersion: \"2010-09-09\"\nResources:\n  Anh:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: labflow-anh-cfn\n      VersioningConfiguration:\n        Status: Enabled");
/* ═════ 11.1 — Vì sao bấm tay không mở rộng được ═════ */
const L111_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 1</span>
<h2>11.1 — Why click-ops does not scale</h2>
<p class="lead">For ten chapters you built things by typing commands or clicking in the console. That is the right way to <em>learn</em> a service, and the wrong way to <em>run</em> one. This lesson builds the same small LabFlow stack twice by hand — once carefully, once "from memory" three weeks later — and measures the difference. Then it builds both with one Terraform file and gets two identical environments. Along the way: what Infrastructure as Code (IaC) really means, how Terraform, OpenTofu, CloudFormation and CDK differ, and two real incidents that started with one person changing one setting by hand.</p>

<h3>The picture: cooking from memory vs. a written recipe</h3>
<p>Grandma's soup tastes perfect, but she never measures. When her daughter cooks it from memory, it is "almost the same" — a bit less salt, a different pot, one spice forgotten. Nobody notices until guests complain. A written recipe can be copied, reviewed, corrected, and cooked identically by anyone. <strong>Click-ops</strong> is cooking from memory. <strong>Infrastructure as Code</strong> is the written recipe, kept in git.</p>

<h3>See it running (1): dev, built by hand from the wiki (9 steps)</h3>
<p>A bucket for photos (versioning on, public access blocked), a job queue with a 60-second visibility timeout (Lesson 9.1), and an on-demand bookings table with a two-part key (Lesson 6.4):</p>
${OUT_111_TAY_DEV}

<h3>See it running (2): staging, built by a teammate three weeks later, from memory</h3>
${OUT_111_TAY_STAGING}
<p>Both "worked" — every command succeeded. Now compare what actually exists:</p>
${OUT_111_LECH}
<ul>
  <li><strong>Versioning off</strong> in staging: a bad deploy that overwrites photos there cannot be rolled back, so the restore drill you test in staging proves nothing about prod.</li>
  <li><strong>Visibility 30 s instead of 60 s</strong>: a slow job is delivered twice in staging only — the classic "only happens on staging" bug that eats a day.</li>
  <li><strong>Provisioned 5 RCU, no sort key</strong>: the code that queries bookings by room <em>and</em> time fails in staging, and the table throttles under a load test.</li>
  <li><strong>Block public access is True in both</strong> — not because anyone remembered, but because AWS turns it on for every new bucket since April 2023 (Lesson 2.3). Safe defaults help; they do not cover your own settings.</li>
</ul>

<h3>See it running (3): "what do we still have?" and cleaning up by hand</h3>
${OUT_111_CON_GI}
<p>You have to ask each service separately, in each Region. Then the clean-up — again from memory:</p>
${OUT_111_DON_TAY}
<p>The test queue "just for 5 minutes" survived, because it was never written down anywhere. On a real account that is how a forgotten NAT gateway or GPU instance bills for months (Lessons 0.1 and 4.5).</p>

<h3>See it running (4): the same stack as code — one file, two environments</h3>
${MA_TF111}
<p>The provider block (in <code>provider.tf</code>) points Terraform at LocalStack; Lesson 11.2 explains every line. One file, applied once per <strong>workspace</strong> (dev, then staging):</p>
${OUT_111_TF}
${OUT_111_GIONG}
<p>Identical — because both came from the same text. And clean-up is one command per environment, which removes exactly what Terraform created, in the right order:</p>
${OUT_111_TF_DON}

<h3>What "Infrastructure as Code" really means</h3>
<ul>
  <li><strong>Declarative</strong>: you write the <em>end state</em> ("a bucket with versioning on"), not the steps. The tool works out create/update/delete. Running it twice changes nothing the second time (<strong>idempotent</strong>).</li>
  <li><strong>Plan before apply</strong>: the tool shows a diff — 5 to add, 0 to change, 0 to destroy — before touching anything. That diff is what a reviewer approves.</li>
  <li><strong>In git</strong>: every change has an author, a reason (commit message), a review (pull request) and can be reverted. "Who turned off versioning?" has an answer.</li>
  <li><strong>Reproducible</strong>: a new Region, a new customer, a disaster-recovery copy (Lesson 6.2) is the same code with different variables (Lesson 11.3).</li>
  <li><strong>Checkable by machines</strong>: scanners such as Checkov or Trivy read .tf files and flag "bucket without encryption" or "security group open to 0.0.0.0/0" <em>before</em> it exists.</li>
</ul>

<h3>The tools: Terraform, OpenTofu, CloudFormation, CDK</h3>
<table>
  <tr><th></th><th>Terraform</th><th>OpenTofu</th><th>CloudFormation</th><th>AWS CDK</th></tr>
  <tr><td>Language</td><td>HCL</td><td>HCL (same files)</td><td>YAML / JSON</td><td>TypeScript, Java, Python… → generates CloudFormation</td></tr>
  <tr><td>Clouds</td><td>AWS, GCP, Azure, Cloudflare, GitHub… (providers)</td><td>same providers</td><td>AWS only</td><td>AWS only</td></tr>
  <tr><td>State</td><td>a file you store (S3, Lesson 11.4)</td><td>same, plus optional state encryption</td><td>kept by AWS (the stack)</td><td>kept by AWS</td></tr>
  <tr><td>Licence</td><td>Business Source License since Aug 2023 (HashiCorp, IBM since Feb 2025)</td><td>open source (MPL 2.0), Linux Foundation</td><td>AWS service</td><td>open source (Apache 2.0)</td></tr>
  <tr><td>Good when</td><td>most job ads; multi-cloud; one tool for everything</td><td>you want an open-source licence</td><td>AWS-only shop, no state to manage</td><td>developers who prefer a real language</td></tr>
</table>
<p>CloudFormation for comparison — the same bucket as a YAML template, and AWS keeps the state for you:</p>
${MA_CFN}
${OUT_111_CFN}
<p>OpenTofu was forked from Terraform 1.5 after the 2023 licence change and reads the same HCL. Same file, both tools:</p>
${MA_TF111_TOFU}
${OUT_111_TOFU}
<p>This course uses <strong>Terraform</strong> because that is what most job descriptions ask for; every command works with <code>tofu</code> as well. What you learn — resources, plan, state, modules — transfers to all four tools.</p>

<h3>The hacker's angle: one person, one setting, by hand</h3>
<ul>
  <li><strong>Toyota, May 2023.</strong> Toyota announced that vehicle data of about 2.15 million customers in Japan (vehicle IDs, locations, drive-recorder video) had been publicly accessible in a cloud environment from November 2013 to April 2023 — almost ten years. The reported cause: an employee set the environment to public instead of private, and nothing detected it. Two weeks later Toyota disclosed more exposed data (about 260,000 domestic records, plus dealer files overseas), blaming "insufficient dissemination and enforcement of data handling rules", and promised continuous auditing of cloud settings.</li>
  <li><strong>Knight Capital, 1 August 2012.</strong> A technician deployed new trading code by hand to eight servers and missed one. The old code on server eight woke up and lost more than 460 million USD in about 45 minutes (SEC order 34-70694; Lesson 10.3 told the alarm side of the story).</li>
</ul>
<p>How IaC defends: the setting "public" lives in a file, so it is <strong>reviewed</strong> in a pull request and <strong>scanned</strong> by a policy tool before it exists; every environment is built by the <strong>same</strong> code, so "seven out of eight" cannot happen; and <code>terraform plan</code> run on a schedule shows <strong>drift</strong> — a hand change made in the console (Lesson 11.4). IaC does not stop a reviewer from approving a bad change; it makes the change visible, so someone can.</p>

<h3>At work: "can you give QA a staging that is exactly like prod by Monday?"</h3>
<p>With click-ops the honest answer is "roughly". With IaC: create a new workspace or folder, set <code>env = "staging"</code>, run plan, show the diff in a pull request, apply. Clean-up after the test campaign is <code>terraform destroy</code>, and the bill proves it. That is why job ads for backend/DevOps roles list Terraform next to AWS.</p>

<h3>What IaC does not fix</h3>
<ul>
  <li>Bad architecture written as code is still bad architecture — just reproducible.</li>
  <li>Secrets: putting a password in a .tf file puts it in git and in the state file (Lesson 11.4).</li>
  <li>Hand changes still happen in emergencies; you need a habit of putting them back into code, and drift checks to catch the rest.</li>
  <li>Data: <code>terraform destroy</code> deletes a database the same way it deletes a queue. Guard rails (deletion protection, final snapshot, Lesson 6.2) are your job.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"Why Infrastructure as Code?"</strong> — Reproducible environments, review and history in git, a plan/diff before changes, easy clean-up. Give the staging example: 4 of 5 settings differed when built by hand.</li>
  <li><strong>"Declarative vs imperative?"</strong> — Declarative describes the end state and the tool computes the changes (Terraform, CloudFormation); imperative scripts list steps and break when run twice.</li>
  <li><strong>"Terraform or CloudFormation?"</strong> — CloudFormation: AWS-only, state managed by AWS, new AWS features sometimes first. Terraform/OpenTofu: many providers (Cloudflare, GitHub, Datadog…), large module ecosystem, you manage state. Say which you would pick for LabFlow and why.</li>
  <li><strong>"What is OpenTofu?"</strong> — The open-source fork of Terraform after the August 2023 licence change, under the Linux Foundation; same HCL and workflow.</li>
</ul>

<h3>🧪 Practice (10 minutes)</h3>
<p>List every resource you created by hand in Lessons 9.1–9.5 (queues, topics, rules, buckets, functions). For each, write the one setting that would most likely differ if a teammate rebuilt it from memory.</p>
<p><strong>Done when:</strong> you have at least six resources and six settings, and you can name which chapter-11 feature (variable, module, plan, state) would have prevented each difference.</p>
${giai('Example answers', `<ul><li>SQS labflow-viec: visibility timeout ≥ 6 × Lambda timeout — prevented by one module used for every queue.</li><li>DLQ maxReceiveCount 3 — same module.</li><li>SNS raw message delivery on — code review of the diff.</li><li>EventBridge rule pattern numeric ≥ 30 — plan shows the pattern before apply.</li><li>S3 notification prefix uploads/ (avoids the 8.4 loop) — reviewed in code.</li><li>Lambda reserved concurrency — variable per environment.</li></ul>`)}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Click-ops</b><span>Building infrastructure by hand in the console or with one-off commands.</span></div>
  <div><b>Infrastructure as Code (IaC)</b><span>Describing infrastructure in versioned text files that a tool applies.</span></div>
  <div><b>Declarative</b><span>You state the end result; the tool works out the steps.</span></div>
  <div><b>Idempotent</b><span>Running it again with no changes changes nothing.</span></div>
  <div><b>Drift</b><span>Difference between the code/state and what really exists, usually from hand changes.</span></div>
  <div><b>Workspace</b><span>A separate state for the same configuration (dev, staging…).</span></div>
  <div><b>Stack</b><span>CloudFormation's unit: a template deployed as one group of resources.</span></div>
  <div><b>OpenTofu</b><span>Open-source fork of Terraform (Linux Foundation), same HCL.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Hand-built staging differed from dev in 4 of 5 settings; a forgotten test queue survived clean-up.</li>
  <li>The same stack as code: two identical environments, one-command clean-up.</li>
  <li>IaC = declarative, plan before apply, reviewed in git, reproducible, scannable.</li>
  <li>Terraform/OpenTofu (multi-cloud, you keep state) vs CloudFormation/CDK (AWS-only, AWS keeps state).</li>
  <li>Toyota 2023 and Knight Capital 2012: one hand change, years or minutes of damage.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://developer.hashicorp.com/terraform/tutorials/aws-get-started', '🧭', 'Terraform — Get started on AWS', 'The official step-by-step tutorial track.')}
${tl('https://docs.localstack.cloud/aws/integrations/infrastructure-as-code/terraform/', '🧪', 'LocalStack — Terraform integration', 'How the lab points Terraform at LocalStack.')}

<h3>Sources</h3>
<ul>
  <li>OpenTofu: <a href="https://www.linuxfoundation.org/press/announcing-opentofu" target="_blank" rel="noopener">linuxfoundation.org/press/announcing-opentofu</a> · GA: <a href="https://opentofu.org/blog/opentofu-is-going-ga/" target="_blank" rel="noopener">opentofu.org/blog/opentofu-is-going-ga</a> · docs: <a href="https://opentofu.org/docs/" target="_blank" rel="noopener">opentofu.org/docs</a></li>
  <li>IBM completes acquisition of HashiCorp (27 Feb 2025): <a href="https://newsroom.ibm.com/2025-02-27-ibm-completes-acquisition-of-hashicorp,-creates-comprehensive,-end-to-end-hybrid-cloud-platform" target="_blank" rel="noopener">newsroom.ibm.com</a></li>
  <li>CloudFormation: <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSCloudFormation/…/Welcome.html</a> · CDK: <a href="https://docs.aws.amazon.com/cdk/v2/guide/home.html" target="_blank" rel="noopener">docs.aws.amazon.com/cdk/v2/guide/home.html</a></li>
  <li>terraform_data: <a href="https://developer.hashicorp.com/terraform/language/resources/terraform-data" target="_blank" rel="noopener">developer.hashicorp.com/…/terraform-data</a> · workspaces: <a href="https://developer.hashicorp.com/terraform/language/state/workspaces" target="_blank" rel="noopener">…/state/workspaces</a></li>
  <li>Toyota, May 2023: <a href="https://techcrunch.com/2023/05/12/toyota-japan-exposed-millions-locations-videos/" target="_blank" rel="noopener">techcrunch.com (12 May 2023)</a> · Toyota's follow-up notice (31 May 2023): <a href="https://global.toyota/en/newsroom/corporate/39241625.html" target="_blank" rel="noopener">global.toyota</a></li>
  <li>Knight Capital: <a href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">SEC order 34-70694</a></li>
</ul>
</div>
`;
const L111_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 1</span>
<h2>11.1 — Vì sao bấm tay không mở rộng được</h2>
<p class="lead">Suốt mười chương, bạn dựng mọi thứ bằng cách gõ lệnh hoặc bấm trên console. Đó là cách đúng để <em>học</em> một dịch vụ, và là cách sai để <em>vận hành</em> nó. Bài này dựng cùng một cụm LabFlow nhỏ hai lần bằng tay — một lần cẩn thận, một lần "theo trí nhớ" ba tuần sau — rồi đo xem khác nhau bao nhiêu. Sau đó dựng cả hai bằng một tệp Terraform và được hai môi trường giống hệt. Dọc đường: Infrastructure as Code (IaC — hạ tầng dưới dạng mã) thật sự là gì, Terraform, OpenTofu, CloudFormation và CDK khác nhau ra sao, và hai sự cố thật bắt đầu từ việc một người đổi tay một thiết lập.</p>

<h3>Hình dung: nấu theo trí nhớ và nấu theo công thức viết sẵn</h3>
<p>Nồi canh của bà ngon tuyệt, nhưng bà chẳng bao giờ đong. Con gái nấu lại theo trí nhớ thì "gần giống" — bớt chút muối, khác cái nồi, quên một vị. Không ai để ý cho tới khi khách chê. Một công thức viết ra thì chép được, soát được, sửa được, và ai nấu cũng ra y hệt. <strong>Click-ops</strong> (bấm tay) là nấu theo trí nhớ. <strong>Infrastructure as Code</strong> là công thức viết sẵn, cất trong git.</p>

<h3>Chạy thật (1): môi trường dev, dựng tay theo trang wiki (9 bước)</h3>
<p>Một bucket chứa ảnh (bật versioning, chặn truy cập công khai), một hàng đợi việc với visibility timeout 60 giây (bài 9.1), và một bảng đặt lịch on-demand có khoá hai phần (bài 6.4):</p>
${OUT_111_TAY_DEV}

<h3>Chạy thật (2): staging, đồng nghiệp dựng tay ba tuần sau, theo trí nhớ</h3>
${OUT_111_TAY_STAGING}
<p>Cả hai đều "chạy được" — lệnh nào cũng thành công. Giờ so xem thật sự đang có gì:</p>
${OUT_111_LECH}
<ul>
  <li><strong>Staging tắt versioning</strong>: một lần deploy lỗi ghi đè ảnh ở đó thì không quay lại được, nên buổi diễn tập khôi phục làm trên staging chẳng chứng minh gì cho prod.</li>
  <li><strong>Visibility 30 giây thay vì 60</strong>: việc chạy chậm bị giao hai lần, chỉ ở staging — đúng kiểu lỗi "chỉ bị trên staging" ngốn cả ngày.</li>
  <li><strong>Provisioned 5 RCU, không có sort key</strong>: đoạn mã truy vấn đặt lịch theo phòng <em>và</em> giờ hỏng ở staging, và bảng bị throttle khi chạy thử tải.</li>
  <li><strong>Block public access ở cả hai đều True</strong> — không phải nhờ ai nhớ, mà vì AWS tự bật cho mọi bucket mới từ tháng 4/2023 (bài 2.3). Mặc định an toàn có giúp, nhưng không lo hộ thiết lập của riêng bạn.</li>
</ul>

<h3>Chạy thật (3): "mình còn những gì?" và dọn bằng tay</h3>
${OUT_111_CON_GI}
<p>Phải hỏi từng dịch vụ một, ở từng Region một. Rồi tới dọn — lại theo trí nhớ:</p>
${OUT_111_DON_TAY}
<p>Hàng đợi thử "chỉ 5 phút thôi" vẫn sống, vì chẳng ai ghi nó vào đâu. Trên tài khoản thật, đó chính là cách một NAT gateway hay một máy GPU bị quên tính tiền hàng tháng trời (bài 0.1 và 4.5).</p>

<h3>Chạy thật (4): cùng cụm đó dưới dạng mã — một tệp, hai môi trường</h3>
${MA_TF111}
<p>Khối provider (trong <code>provider.tf</code>) trỏ Terraform vào LocalStack; bài 11.2 giải thích từng dòng. Một tệp, apply một lần cho mỗi <strong>workspace</strong> (dev, rồi staging):</p>
${OUT_111_TF}
${OUT_111_GIONG}
<p>Giống hệt — vì cả hai sinh ra từ cùng một đoạn chữ. Còn dọn là một lệnh cho mỗi môi trường, xoá đúng những gì Terraform đã tạo, theo đúng thứ tự:</p>
${OUT_111_TF_DON}

<h3>"Infrastructure as Code" thật sự nghĩa là gì</h3>
<ul>
  <li><strong>Khai báo (declarative)</strong>: bạn viết <em>trạng thái cuối</em> ("một bucket bật versioning"), không viết các bước. Công cụ tự tính phải tạo, sửa hay xoá gì. Chạy lần hai mà không đổi gì thì không có gì thay đổi (<strong>idempotent</strong>).</li>
  <li><strong>Plan trước khi apply</strong>: công cụ cho xem phần khác biệt — 5 thêm, 0 sửa, 0 xoá — trước khi đụng vào bất cứ thứ gì. Phần khác biệt đó là thứ người duyệt bấm đồng ý.</li>
  <li><strong>Nằm trong git</strong>: mỗi thay đổi có tác giả, có lý do (commit message), có người soát (pull request), và hoàn tác được. Câu "ai đã tắt versioning?" luôn có câu trả lời.</li>
  <li><strong>Tái lập được</strong>: một Region mới, một khách hàng mới, một bản dự phòng thảm hoạ (bài 6.2) là cùng mã đó với biến khác (bài 11.3).</li>
  <li><strong>Máy soát được</strong>: các công cụ quét như Checkov hay Trivy đọc tệp .tf và báo "bucket không mã hoá" hay "security group mở cho 0.0.0.0/0" <em>trước</em> khi nó tồn tại.</li>
</ul>

<h3>Các công cụ: Terraform, OpenTofu, CloudFormation, CDK</h3>
<table>
  <tr><th></th><th>Terraform</th><th>OpenTofu</th><th>CloudFormation</th><th>AWS CDK</th></tr>
  <tr><td>Ngôn ngữ</td><td>HCL</td><td>HCL (cùng tệp)</td><td>YAML / JSON</td><td>TypeScript, Java, Python… → sinh ra CloudFormation</td></tr>
  <tr><td>Cloud</td><td>AWS, GCP, Azure, Cloudflare, GitHub… (qua provider)</td><td>cùng provider</td><td>chỉ AWS</td><td>chỉ AWS</td></tr>
  <tr><td>State</td><td>một tệp bạn tự cất (S3, bài 11.4)</td><td>như Terraform, thêm tuỳ chọn mã hoá state</td><td>AWS giữ (stack)</td><td>AWS giữ</td></tr>
  <tr><td>Giấy phép</td><td>Business Source License từ 8/2023 (HashiCorp, thuộc IBM từ 2/2025)</td><td>mã nguồn mở (MPL 2.0), Linux Foundation</td><td>dịch vụ của AWS</td><td>mã nguồn mở (Apache 2.0)</td></tr>
  <tr><td>Hợp khi</td><td>đa số tin tuyển dụng; nhiều cloud; một công cụ cho mọi thứ</td><td>muốn giấy phép mã nguồn mở</td><td>công ty chỉ dùng AWS, không muốn tự giữ state</td><td>lập trình viên thích ngôn ngữ thật</td></tr>
</table>
<p>CloudFormation để so sánh — cùng cái bucket đó dưới dạng mẫu YAML, và AWS giữ state hộ bạn:</p>
${MA_CFN}
${OUT_111_CFN}
<p>OpenTofu được tách nhánh từ Terraform 1.5 sau lần đổi giấy phép năm 2023 và đọc cùng HCL. Cùng một tệp, cả hai công cụ:</p>
${MA_TF111_TOFU}
${OUT_111_TOFU}
<p>Khoá này dùng <strong>Terraform</strong> vì đó là thứ đa số mô tả công việc yêu cầu; mọi lệnh đều chạy được với <code>tofu</code>. Những gì bạn học — resource, plan, state, module — dùng được cho cả bốn công cụ.</p>

<h3>Góc hacker: một người, một thiết lập, bằng tay</h3>
<ul>
  <li><strong>Toyota, tháng 5/2023.</strong> Toyota công bố dữ liệu xe của khoảng 2,15 triệu khách hàng ở Nhật (mã xe, vị trí, video camera hành trình) đã để truy cập công khai trong một môi trường cloud từ tháng 11/2013 tới tháng 4/2023 — gần mười năm. Nguyên nhân được nêu: một nhân viên đặt môi trường ở chế độ công khai thay vì riêng tư, và không có gì phát hiện ra. Hai tuần sau Toyota công bố thêm dữ liệu bị lộ (khoảng 260.000 bản ghi trong nước, cùng tệp của đại lý ở nước ngoài), nhận lỗi "chưa phổ biến và thực thi đủ quy tắc xử lý dữ liệu", và hứa kiểm tra liên tục thiết lập cloud.</li>
  <li><strong>Knight Capital, 1/8/2012.</strong> Một kỹ thuật viên deploy mã giao dịch mới bằng tay lên tám máy chủ và sót một máy. Mã cũ trên máy thứ tám thức dậy và làm mất hơn 460 triệu USD trong khoảng 45 phút (quyết định SEC 34-70694; bài 10.3 đã kể phía cảnh báo của câu chuyện).</li>
</ul>
<p>IaC phòng thế nào: thiết lập "công khai" nằm trong một tệp, nên được <strong>soát</strong> trong pull request và được công cụ chính sách <strong>quét</strong> trước khi tồn tại; mọi môi trường dựng từ <strong>cùng</strong> một đoạn mã, nên chuyện "bảy trên tám" không xảy ra được; và chạy <code>terraform plan</code> theo lịch sẽ lộ ra <strong>drift</strong> — một thay đổi tay trên console (bài 11.4). IaC không ngăn được người duyệt bấm đồng ý một thay đổi xấu; nó làm thay đổi đó hiện ra, để có người kịp thấy.</p>

<h3>Đi làm: "em dựng cho QA một staging y hệt prod trước thứ Hai được không?"</h3>
<p>Bấm tay thì câu trả lời thật lòng là "na ná thôi". Có IaC: tạo workspace hoặc thư mục mới, đặt <code>env = "staging"</code>, chạy plan, đưa phần khác biệt vào pull request, apply. Dọn sau đợt kiểm thử là <code>terraform destroy</code>, và hoá đơn chứng minh điều đó. Đó là lý do tin tuyển backend/DevOps ghi Terraform ngay cạnh AWS.</p>

<h3>Những gì IaC không chữa được</h3>
<ul>
  <li>Kiến trúc tồi viết thành mã vẫn là kiến trúc tồi — chỉ là tái lập được.</li>
  <li>Bí mật: viết mật khẩu vào tệp .tf là đưa nó vào git và vào tệp state (bài 11.4).</li>
  <li>Lúc khẩn cấp vẫn có người sửa tay; cần thói quen đưa thay đổi đó trở lại mã, và kiểm drift để bắt phần còn lại.</li>
  <li>Dữ liệu: <code>terraform destroy</code> xoá một cơ sở dữ liệu y như xoá một hàng đợi. Rào chắn (deletion protection, snapshot cuối, bài 6.2) là việc của bạn.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Vì sao dùng Infrastructure as Code?"</strong> — Môi trường tái lập được, có người soát và lịch sử trong git, có plan/khác biệt trước khi đổi, dọn dễ. Đưa ví dụ staging: dựng tay thì 4 trên 5 thiết lập lệch.</li>
  <li><strong>"Khai báo khác mệnh lệnh thế nào?"</strong> — Khai báo mô tả trạng thái cuối, công cụ tự tính thay đổi (Terraform, CloudFormation); script mệnh lệnh liệt kê các bước và hỏng khi chạy lần hai.</li>
  <li><strong>"Terraform hay CloudFormation?"</strong> — CloudFormation: chỉ AWS, AWS giữ state, tính năng AWS mới đôi khi có trước. Terraform/OpenTofu: nhiều provider (Cloudflare, GitHub, Datadog…), kho module lớn, tự giữ state. Nói bạn chọn gì cho LabFlow và vì sao.</li>
  <li><strong>"OpenTofu là gì?"</strong> — Nhánh mã nguồn mở của Terraform sau lần đổi giấy phép tháng 8/2023, thuộc Linux Foundation; cùng HCL, cùng cách làm.</li>
</ul>

<h3>🧪 Thực hành (10 phút)</h3>
<p>Liệt kê mọi tài nguyên bạn đã dựng tay trong bài 9.1–9.5 (hàng đợi, topic, luật, bucket, hàm). Với mỗi cái, ghi một thiết lập dễ bị lệch nhất nếu đồng nghiệp dựng lại theo trí nhớ.</p>
<p><strong>Đạt khi:</strong> có ít nhất sáu tài nguyên và sáu thiết lập, và bạn chỉ ra được tính năng nào của chương 11 (biến, module, plan, state) đã chặn được từng chỗ lệch.</p>
${giai('Đáp án mẫu', `<ul><li>SQS labflow-viec: visibility timeout ≥ 6 × timeout của Lambda — chặn bằng một module dùng cho mọi hàng đợi.</li><li>DLQ maxReceiveCount 3 — cùng module đó.</li><li>SNS bật raw message delivery — soát phần khác biệt trong pull request.</li><li>Luật EventBridge numeric ≥ 30 — plan cho thấy pattern trước khi apply.</li><li>Tiền tố uploads/ của thông báo S3 (tránh vòng lặp bài 8.4) — soát trong mã.</li><li>Reserved concurrency của Lambda — biến theo môi trường.</li></ul>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Click-ops</b><span>Dựng hạ tầng bằng tay trên console hoặc bằng lệnh chạy một lần.</span></div>
  <div><b>Infrastructure as Code (IaC)</b><span>Mô tả hạ tầng trong tệp chữ có phiên bản, để công cụ áp vào.</span></div>
  <div><b>Khai báo (declarative)</b><span>Bạn nói kết quả cuối; công cụ tự tìm các bước.</span></div>
  <div><b>Idempotent</b><span>Chạy lại khi không đổi gì thì không có gì thay đổi.</span></div>
  <div><b>Drift</b><span>Chỗ lệch giữa mã/state và thứ đang tồn tại thật, thường do sửa tay.</span></div>
  <div><b>Workspace</b><span>Một state riêng cho cùng một cấu hình (dev, staging…).</span></div>
  <div><b>Stack</b><span>Đơn vị của CloudFormation: một mẫu triển khai thành một nhóm tài nguyên.</span></div>
  <div><b>OpenTofu</b><span>Nhánh mã nguồn mở của Terraform (Linux Foundation), cùng HCL.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Staging dựng tay lệch dev 4 trên 5 thiết lập; một hàng đợi thử bị quên vẫn sống sau khi dọn.</li>
  <li>Cùng cụm đó dưới dạng mã: hai môi trường giống hệt, dọn bằng một lệnh.</li>
  <li>IaC = khai báo, plan trước apply, soát trong git, tái lập được, máy quét được.</li>
  <li>Terraform/OpenTofu (nhiều cloud, tự giữ state) so với CloudFormation/CDK (chỉ AWS, AWS giữ state).</li>
  <li>Toyota 2023 và Knight Capital 2012: một thay đổi tay, thiệt hại kéo dài nhiều năm hoặc diễn ra trong vài chục phút.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://developer.hashicorp.com/terraform/tutorials/aws-get-started', '🧭', 'Terraform — Get started on AWS', 'Chuỗi hướng dẫn chính thức từng bước.')}
${tl('https://docs.localstack.cloud/aws/integrations/infrastructure-as-code/terraform/', '🧪', 'LocalStack — tích hợp Terraform', 'Cách lab trỏ Terraform vào LocalStack.')}

<h3>Nguồn</h3>
<ul>
  <li>OpenTofu: <a href="https://www.linuxfoundation.org/press/announcing-opentofu" target="_blank" rel="noopener">linuxfoundation.org/press/announcing-opentofu</a> · bản chính thức: <a href="https://opentofu.org/blog/opentofu-is-going-ga/" target="_blank" rel="noopener">opentofu.org/blog/opentofu-is-going-ga</a> · tài liệu: <a href="https://opentofu.org/docs/" target="_blank" rel="noopener">opentofu.org/docs</a></li>
  <li>IBM hoàn tất mua HashiCorp (27/2/2025): <a href="https://newsroom.ibm.com/2025-02-27-ibm-completes-acquisition-of-hashicorp,-creates-comprehensive,-end-to-end-hybrid-cloud-platform" target="_blank" rel="noopener">newsroom.ibm.com</a></li>
  <li>CloudFormation: <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSCloudFormation/…/Welcome.html</a> · CDK: <a href="https://docs.aws.amazon.com/cdk/v2/guide/home.html" target="_blank" rel="noopener">docs.aws.amazon.com/cdk/v2/guide/home.html</a></li>
  <li>terraform_data: <a href="https://developer.hashicorp.com/terraform/language/resources/terraform-data" target="_blank" rel="noopener">developer.hashicorp.com/…/terraform-data</a> · workspace: <a href="https://developer.hashicorp.com/terraform/language/state/workspaces" target="_blank" rel="noopener">…/state/workspaces</a></li>
  <li>Toyota, 5/2023: <a href="https://techcrunch.com/2023/05/12/toyota-japan-exposed-millions-locations-videos/" target="_blank" rel="noopener">techcrunch.com (12/5/2023)</a> · thông báo bổ sung của Toyota (31/5/2023): <a href="https://global.toyota/en/newsroom/corporate/39241625.html" target="_blank" rel="noopener">global.toyota</a></li>
  <li>Knight Capital: <a href="https://www.sec.gov/litigation/admin/2013/34-70694.pdf" target="_blank" rel="noopener">quyết định SEC 34-70694</a></li>
</ul>
</div>
`;
/* ═════ 11.2 — Terraform cơ bản: init, plan, apply, destroy ═════ */
const MA_VONG = bash(`terraform fmt              # format every .tf file (CI runs: terraform fmt -check)
terraform init             # download providers + modules, set up the backend, write the lock file
terraform validate         # syntax and types, without calling AWS
terraform plan -out=plan.tfplan   # compare code + state + real world; save the exact diff
terraform apply plan.tfplan       # do exactly what was reviewed, nothing else
terraform output           # values you exported
terraform state list       # what Terraform owns
terraform destroy          # remove everything it owns, in reverse dependency order`);
const MA_XAC_THUC = bash(`# Real AWS: the provider block has NO keys. It finds credentials the same way as the AWS CLI:
export AWS_PROFILE=labflow-dev          # a profile from 'aws configure sso' (Lesson 1.4)
terraform plan
# On EC2/ECS/Lambda: the instance/task role. In GitHub Actions: OIDC (Lesson 1.6, Chapter 12).
# Never: access_key = "AKIA..." in a .tf file — it ends up in git AND in the state file.`);
const L112_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 2</span>
<h2>11.2 — Terraform basics on AWS: init, plan, apply, destroy</h2>
<p class="lead">This lesson takes one small configuration — a photo bucket, a job queue with its dead-letter queue, a bookings table — through the whole Terraform life cycle on LocalStack, and reads every output line by line: what <code>init</code> downloads and pins, why <code>plan</code> says "known after apply", in which order <code>apply</code> creates things, what "forces replacement" means for your data, and how <code>destroy</code> knows what to remove.</p>

<h3>The picture: a building contractor with a blueprint and a quote</h3>
<p>You give the contractor a blueprint (your .tf files). Before touching anything he walks the site and gives you a quote: "add 4 rooms, change 0, demolish 0" (<code>plan</code>). You sign that quote, and he builds exactly that (<code>apply</code> of the saved plan). He keeps a site register of everything he built (the <strong>state</strong>, Lesson 11.4). Change the blueprint later and the next quote lists only the difference. Rename a room that "cannot be renamed" and the quote says <em>demolish and rebuild</em> — read that line before you sign.</p>

<h3>The pieces of a configuration</h3>
${MA_TF112_VERS}
<ul>
  <li><strong>terraform { required_providers }</strong> — which plugins to download and which versions are allowed. <code>~> 6.0</code> means "6.x, never 7.0"; a major version may remove arguments, so you upgrade on purpose.</li>
  <li><strong>provider "aws"</strong> — Region, credentials, endpoints, default tags. Ours points every service at LocalStack:</li>
</ul>
${MA_PROVIDER}
<ul>
  <li><code>access_key = "test"</code> is a LocalStack placeholder. On real AWS the provider block has no keys at all:</li>
</ul>
${MA_XAC_THUC}
<ul>
  <li><strong>default_tags</strong> — every resource gets Project and ManagedBy. In Cost Explorer (Chapter 13) that is how you see what LabFlow costs, and "ManagedBy = terraform" warns colleagues not to edit it by hand.</li>
</ul>
${MA_TF112}
<ul>
  <li><strong>resource</strong> "type" "name" — something Terraform creates and owns. The address is <code>aws_sqs_queue.viec</code>; the name is only for your code, the real queue name is the <code>name</code> argument.</li>
  <li><strong>data</strong> — reads something that already exists (account ID, Region, an AMI, a VPC built by another team). Terraform never changes or deletes it.</li>
  <li><strong>References</strong> such as <code>aws_sqs_queue.chet.arn</code> are how you wire resources together — and every reference is a dependency edge. You almost never write <code>depends_on</code>.</li>
  <li><strong>output</strong> — values you want printed or passed to other code (queue URL for the app's environment variables).</li>
</ul>

<h3>The life cycle in eight commands</h3>
${MA_VONG}

<h3>See it running (1): fmt and validate catch mistakes before AWS is called</h3>
<p>A careless file <code>nhap.tf</code> with wrong indentation and a typo, <code>versionning_configuration</code>:</p>
${OUT_112_FMT_VALIDATE}
<ul>
  <li><code>fmt -check</code> exits with code 3 and names the file — that is what CI uses to fail a pull request with messy formatting. <code>fmt</code> then fixes the indentation, but not the spelling.</li>
  <li><code>validate</code> knows the schema of every resource: it finds the misspelled block, suggests the right name, and notices the required block is missing. No network call, no cost — run it on every save.</li>
</ul>

<h3>See it running (2): init pins the provider — the lock file</h3>
${OUT_112_LOCK}
<ul>
  <li><code>init</code> chose 6.73.0 (the newest allowed by <code>~> 6.0</code>) and wrote <code>.terraform.lock.hcl</code>. <strong>Commit the lock file.</strong> Your teammate and CI then install exactly 6.73.0, not "whatever is newest today".</li>
  <li>The <code>h1:</code>/<code>zh:</code> hashes are checksums of the provider package; init refuses a download that does not match. "(signed by HashiCorp)" means the package signature was verified against HashiCorp's public key.</li>
  <li>Upgrading is deliberate: <code>terraform init -upgrade</code>, read the provider changelog, run plan, commit the new lock file.</li>
  <li>The <code>.terraform/</code> folder (the downloaded binaries, hundreds of MB) is <strong>not</strong> committed — add it to <code>.gitignore</code>, together with <code>*.tfstate*</code> and <code>*.tfvars</code> that hold secrets.</li>
</ul>

<h3>See it running (3): plan — read the quote</h3>
${OUT_112_PLAN_GON}
<ul>
  <li><code>+</code> create, <code>~</code> update in place, <code>-/+</code> destroy then create, <code>-</code> destroy. The last line is the summary a reviewer checks first.</li>
  <li><strong>(known after apply)</strong>: AWS decides these values (ARN, URL). <code>redrive_policy</code> is unknown too, because it contains the ARN of the dead-letter queue, which does not exist yet.</li>
  <li>The plan also shows defaults you did not write: <code>message_retention_seconds = 345600</code> (4 days) and <code>max_message_size = 262144</code>. The provider sends 256 KiB by default, although SQS now accepts messages up to 1 MiB (Lesson 9.1) — if you need more, write it. Reading the plan is how you find such surprises.</li>
  <li><code>-out=plan.tfplan</code> saves this exact diff. Applying the saved file guarantees that what runs is what was reviewed, even if someone pushed a change in between.</li>
</ul>

<h3>See it running (4): apply follows the dependency graph</h3>
${OUT_112_APPLY}
${OUT_112_STATE_GRAPH}
<ul>
  <li>The bucket, the table and the dead-letter queue have no dependency on each other, so they start <strong>in parallel</strong> (up to 10 at a time by default). The main queue starts only after <code>chet</code> is complete, because its redrive policy needs that ARN — the graph shows exactly that one edge.</li>
  <li>Each queue took about 25 s: after creating a queue, the provider waits until SQS reports the attributes consistently. On a busy laptop with LocalStack that wait is the slowest part; on AWS it is similar. Terraform is not slow because of HCL — it is as slow as the APIs it waits for.</li>
  <li>Data sources appear in <code>state list</code> too; they are re-read on every plan.</li>
</ul>

<h3>See it running (5): run it again — nothing to do</h3>
${OUT_112_KHONG_DOI}
<p>This is idempotency in practice. A "No changes" plan is also the check that nobody changed things by hand (Lesson 11.4) — teams run it every night.</p>

<h3>See it running (6): update in place vs. replace</h3>
<p>Add one tag to the bucket:</p>
${OUT_112_SUA_TAI_CHO_GON}
<p>Now rename the queue as well:</p>
${OUT_112_THAY_MOI_GON}
<ul>
  <li>A tag can be changed on a live bucket: <code>~</code>, nothing lost. <code>tags_all</code> merges your tags with <code>default_tags</code>.</li>
  <li>SQS cannot rename a queue, so <code>name … # forces replacement</code> turns into <code>-/+</code>: delete the old queue, create a new one. <strong>Every message still waiting in the old queue is gone</strong>, and the URL your app uses changes. For a database or a bucket, replacement means data loss.</li>
  <li>Defences: read every <code>-/+</code> and every "destroy" in review; <code>lifecycle { prevent_destroy = true }</code> on data resources (plan fails instead of deleting); <code>create_before_destroy</code> when a short overlap is better than a gap; and for a rename only in your code, the <code>moved</code> block of Lesson 11.4.</li>
</ul>

<h3>See it running (7): destroy in reverse order</h3>
${OUT_112_DESTROY}
<p>Exactly the four resources in the state, the main queue before its dead-letter queue (reverse of creation), and the account is empty again. Destroy only knows what is in the state: a resource created by hand next to it is not touched — that is why the clean-up check of every lab still lists all services.</p>

<h3>The hacker's angle: who signed the plugin you just downloaded?</h3>
<p>The AWS provider is a binary of several hundred megabytes that runs on your laptop and in CI with your AWS credentials. In April 2021 the Codecov supply-chain attack (Lesson 6.3) exposed the private GPG key that HashiCorp used to sign the checksums of its release downloads, Terraform providers included (bulletin HCSEC-2021-12). HashiCorp revoked and rotated the key and re-signed releases; Terraform versions released after that trust the new key. The lessons for you:</p>
<ul>
  <li>Install Terraform and providers only from the official registry or your company mirror, never from a random download link.</li>
  <li>Commit <code>.terraform.lock.hcl</code>: a swapped binary with a different checksum fails <code>init</code> loudly instead of running quietly with your credentials.</li>
  <li>Give the CI role only the permissions the plan needs (Lesson 1.3), so a compromised plugin cannot do everything.</li>
</ul>

<h3>At work: reading a teammate's plan in a pull request</h3>
<p>The PR says "add an Owner tag". The plan comment says <code>Plan: 1 to add, 1 to change, 1 to destroy</code>. Stop: a tag never destroys anything. Scroll to the <code>-/+</code> and you find the queue rename hidden in the same commit. Ask for it to be split, or for a migration plan for the messages. That one question is what reviewers are paid for.</p>

<h3>LocalStack vs. AWS in this lesson</h3>
<ul>
  <li>Same provider, same commands, same plan symbols. LocalStack does not check IAM permissions, so a missing permission shows up only on real AWS (an AccessDenied during apply).</li>
  <li>The account ID is the fake 000000000000, and nothing is billed.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"What happens in terraform plan?"</strong> — Refresh: read real resources; compare with the code and the state; print the actions (+ ~ -/+ -) and the summary. Nothing changes.</li>
  <li><strong>"Resource vs data source?"</strong> — A resource is created and owned (destroy deletes it); a data source only reads something that exists.</li>
  <li><strong>"How does Terraform know the order?"</strong> — From references: they form a dependency graph; independent nodes run in parallel, destroy walks it backwards. <code>depends_on</code> only for hidden dependencies.</li>
  <li><strong>"Why commit the lock file?"</strong> — Same provider version and checksums for everyone; upgrades become deliberate, reviewable changes.</li>
  <li><strong>"What does forces replacement mean?"</strong> — The API cannot change that argument in place, so Terraform deletes and recreates — data and IDs are lost unless you guard against it.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>In the lab folder, add an <code>aws_sns_topic</code> named <code>labflow-thong-bao</code> and an <code>aws_sns_topic_subscription</code> that delivers it to the main queue (Lesson 9.2). Run plan, then apply the saved plan.</p>
<p><strong>Done when:</strong> plan says <code>2 to add</code>; the graph shows the subscription depending on both the topic and the queue; a second plan says "No changes"; destroy removes 6 resources.</p>
${giai('Solution', hcl(`resource "aws_sns_topic" "thong_bao" {
  name = "labflow-thong-bao"
}

resource "aws_sns_topic_subscription" "vao_hang" {
  topic_arn = aws_sns_topic.thong_bao.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.viec.arn
}
# On real AWS the queue also needs a queue policy that lets this topic send (Lesson 9.2).`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Provider</b><span>Plugin that talks to one API (aws, random, cloudflare…).</span></div>
  <div><b>Resource</b><span>Something Terraform creates, updates and deletes.</span></div>
  <div><b>Data source</b><span>Read-only lookup of something that already exists.</span></div>
  <div><b>Lock file</b><span>.terraform.lock.hcl: exact provider versions + checksums; commit it.</span></div>
  <div><b>Plan</b><span>The diff between code and reality; can be saved with -out.</span></div>
  <div><b>Forces replacement</b><span>Argument that cannot change in place ⇒ destroy + create.</span></div>
  <div><b>Dependency graph</b><span>Built from references; decides order and parallelism.</span></div>
  <div><b>default_tags</b><span>Tags the provider adds to every resource.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>fmt → init → validate → plan -out → apply the plan → destroy.</li>
  <li>No keys in .tf: profiles, roles, OIDC. Commit the lock file, ignore .terraform/ and state.</li>
  <li>References are dependencies: independent things run in parallel, destroy goes backwards.</li>
  <li>Read the plan: (known after apply), hidden defaults, and above all every -/+.</li>
  <li>A second plan with "No changes" proves the code and the world agree.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://registry.terraform.io/providers/hashicorp/aws/latest/docs', '📖', 'AWS provider documentation', 'Every resource, its arguments, and which ones force replacement.')}
${tl('https://developer.hashicorp.com/terraform/cli/commands/plan', '🔍', 'terraform plan — command reference', 'Refresh modes, -out, -target, -destroy and exit codes.')}

<h3>Sources</h3>
<ul>
  <li>Dependency lock file: <a href="https://developer.hashicorp.com/terraform/language/files/dependency-lock" target="_blank" rel="noopener">developer.hashicorp.com/…/dependency-lock</a> · version constraints: <a href="https://developer.hashicorp.com/terraform/language/expressions/version-constraints" target="_blank" rel="noopener">…/version-constraints</a></li>
  <li>Data sources: <a href="https://developer.hashicorp.com/terraform/language/data-sources" target="_blank" rel="noopener">developer.hashicorp.com/…/data-sources</a></li>
  <li>LocalStack + Terraform: <a href="https://docs.localstack.cloud/aws/integrations/infrastructure-as-code/terraform/" target="_blank" rel="noopener">docs.localstack.cloud</a></li>
  <li>HCSEC-2021-12, Codecov and the HashiCorp GPG key: <a href="https://discuss.hashicorp.com/t/hcsec-2021-12-codecov-security-event-and-hashicorp-gpg-key-exposure/23512" target="_blank" rel="noopener">discuss.hashicorp.com</a></li>
</ul>
</div>
`;
const MA_VONG_VI = bash(`terraform fmt              # định dạng mọi tệp .tf (CI chạy: terraform fmt -check)
terraform init             # tải provider + module, dựng backend, ghi tệp khoá phiên bản
terraform validate         # kiểm cú pháp và kiểu, không gọi AWS
terraform plan -out=plan.tfplan   # so mã + state + thực tế; lưu đúng phần khác biệt
terraform apply plan.tfplan       # làm đúng những gì đã duyệt, không hơn
terraform output           # các giá trị bạn xuất ra
terraform state list       # những gì Terraform đang sở hữu
terraform destroy          # xoá mọi thứ nó sở hữu, ngược thứ tự phụ thuộc`);
const MA_XAC_THUC_VI = bash(`# AWS thật: khối provider KHÔNG có khoá. Nó tìm thông tin xác thực giống hệt AWS CLI:
export AWS_PROFILE=labflow-dev          # profile tạo bằng 'aws configure sso' (bài 1.4)
terraform plan
# Trên EC2/ECS/Lambda: role của máy/task. Trong GitHub Actions: OIDC (bài 1.6, chương 12).
# Không bao giờ: access_key = "AKIA..." trong tệp .tf — nó vào git VÀ vào tệp state.`);
const L112_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 2</span>
<h2>11.2 — Terraform cơ bản trên AWS: init, plan, apply, destroy</h2>
<p class="lead">Bài này đưa một cấu hình nhỏ — một bucket ảnh, một hàng đợi việc kèm dead-letter queue, một bảng đặt lịch — đi trọn vòng đời Terraform trên LocalStack, và đọc từng dòng output: <code>init</code> tải gì và ghim gì, vì sao <code>plan</code> ghi "known after apply", <code>apply</code> tạo theo thứ tự nào, "forces replacement" nghĩa là gì với dữ liệu của bạn, và <code>destroy</code> lấy đâu ra danh sách để xoá.</p>

<h3>Hình dung: nhà thầu xây dựng với bản vẽ và bảng báo giá</h3>
<p>Bạn đưa nhà thầu bản vẽ (các tệp .tf). Trước khi động tay, ông ấy đi xem hiện trường rồi đưa bảng báo giá: "thêm 4 phòng, sửa 0, phá 0" (<code>plan</code>). Bạn ký đúng bảng đó, và ông ấy xây đúng như vậy (<code>apply</code> bản plan đã lưu). Ông ấy giữ một sổ công trình ghi mọi thứ đã xây (<strong>state</strong>, bài 11.4). Sau này sửa bản vẽ thì bảng báo giá mới chỉ liệt kê phần khác. Đổi tên một phòng "không đổi tên được" thì bảng báo giá ghi <em>phá đi xây lại</em> — đọc dòng đó trước khi ký.</p>

<h3>Các mảnh của một cấu hình</h3>
${MA_TF112_VERS}
<ul>
  <li><strong>terraform { required_providers }</strong> — tải plugin nào và cho phép phiên bản nào. <code>~> 6.0</code> nghĩa là "6.x, không bao giờ 7.0"; phiên bản lớn có thể bỏ tham số, nên nâng cấp phải có chủ đích.</li>
  <li><strong>provider "aws"</strong> — Region, thông tin xác thực, endpoint, tag mặc định. Của chúng ta trỏ mọi dịch vụ vào LocalStack:</li>
</ul>
${MA_PROVIDER}
<ul>
  <li><code>access_key = "test"</code> là chỗ giữ của LocalStack. Trên AWS thật, khối provider không có khoá nào:</li>
</ul>
${MA_XAC_THUC_VI}
<ul>
  <li><strong>default_tags</strong> — mọi tài nguyên đều có Project và ManagedBy. Trong Cost Explorer (chương 13) đó là cách bạn thấy LabFlow tốn bao nhiêu, còn "ManagedBy = terraform" nhắc đồng nghiệp đừng sửa tay.</li>
</ul>
${MA_TF112}
<ul>
  <li><strong>resource</strong> "kiểu" "tên" — thứ Terraform tạo ra và sở hữu. Địa chỉ của nó là <code>aws_sqs_queue.viec</code>; cái tên chỉ dùng trong mã, tên hàng đợi thật là tham số <code>name</code>.</li>
  <li><strong>data</strong> — đọc thứ đã có sẵn (mã tài khoản, Region, một AMI, một VPC đội khác dựng). Terraform không bao giờ sửa hay xoá nó.</li>
  <li><strong>Tham chiếu</strong> như <code>aws_sqs_queue.chet.arn</code> là cách nối các tài nguyên với nhau — và mỗi tham chiếu là một cạnh phụ thuộc. Bạn gần như không phải viết <code>depends_on</code>.</li>
  <li><strong>output</strong> — giá trị bạn muốn in ra hoặc chuyển cho mã khác (URL hàng đợi cho biến môi trường của ứng dụng).</li>
</ul>

<h3>Vòng đời trong tám lệnh</h3>
${MA_VONG_VI}

<h3>Chạy thật (1): fmt và validate bắt lỗi trước khi gọi AWS</h3>
<p>Một tệp viết ẩu <code>nhap.tf</code>, thụt lề sai và gõ nhầm <code>versionning_configuration</code>:</p>
${OUT_112_FMT_VALIDATE}
<ul>
  <li><code>fmt -check</code> thoát mã 3 và ghi tên tệp — CI dùng đúng điều này để đánh trượt pull request định dạng lộn xộn. Sau đó <code>fmt</code> sửa thụt lề, nhưng không sửa chính tả.</li>
  <li><code>validate</code> biết lược đồ của mọi tài nguyên: nó thấy khối viết sai, gợi ý tên đúng, và phát hiện khối bắt buộc bị thiếu. Không gọi mạng, không tốn tiền — chạy mỗi lần lưu tệp.</li>
</ul>

<h3>Chạy thật (2): init ghim provider — tệp khoá phiên bản</h3>
${OUT_112_LOCK}
<ul>
  <li><code>init</code> chọn 6.73.0 (bản mới nhất mà <code>~> 6.0</code> cho phép) và ghi <code>.terraform.lock.hcl</code>. <strong>Commit tệp khoá này.</strong> Đồng nghiệp và CI khi đó cài đúng 6.73.0, chứ không phải "bản mới nhất hôm nay".</li>
  <li>Các mã băm <code>h1:</code>/<code>zh:</code> là checksum của gói provider; init từ chối gói tải về không khớp. "(signed by HashiCorp)" nghĩa là chữ ký của gói đã được kiểm bằng khoá công khai của HashiCorp.</li>
  <li>Nâng cấp phải có chủ đích: <code>terraform init -upgrade</code>, đọc changelog của provider, chạy plan, commit tệp khoá mới.</li>
  <li>Thư mục <code>.terraform/</code> (các tệp nhị phân đã tải, cả trăm MB) <strong>không</strong> commit — thêm vào <code>.gitignore</code>, cùng với <code>*.tfstate*</code> và các tệp <code>*.tfvars</code> chứa bí mật.</li>
</ul>

<h3>Chạy thật (3): plan — đọc bảng báo giá</h3>
${OUT_112_PLAN_GON}
<ul>
  <li><code>+</code> tạo, <code>~</code> sửa tại chỗ, <code>-/+</code> xoá rồi tạo lại, <code>-</code> xoá. Dòng cuối là bản tóm tắt người duyệt nhìn đầu tiên.</li>
  <li><strong>(known after apply)</strong>: AWS mới quyết định các giá trị này (ARN, URL). <code>redrive_policy</code> cũng chưa biết, vì nó chứa ARN của dead-letter queue, thứ còn chưa tồn tại.</li>
  <li>Plan còn cho thấy những mặc định bạn không viết: <code>message_retention_seconds = 345600</code> (4 ngày) và <code>max_message_size = 262144</code>. Provider mặc định gửi 256 KiB, dù SQS nay nhận tin tới 1 MiB (bài 9.1) — cần hơn thì phải tự ghi. Đọc plan là cách phát hiện những bất ngờ kiểu này.</li>
  <li><code>-out=plan.tfplan</code> lưu đúng phần khác biệt này. Apply tệp đã lưu bảo đảm thứ chạy chính là thứ đã duyệt, kể cả khi có người đẩy thay đổi chen vào giữa.</li>
</ul>

<h3>Chạy thật (4): apply đi theo đồ thị phụ thuộc</h3>
${OUT_112_APPLY}
${OUT_112_STATE_GRAPH}
<ul>
  <li>Bucket, bảng và dead-letter queue không phụ thuộc nhau, nên chúng bắt đầu <strong>song song</strong> (mặc định tối đa 10 cái một lúc). Hàng đợi chính chỉ bắt đầu sau khi <code>chet</code> xong, vì redrive policy của nó cần ARN đó — đồ thị cho thấy đúng một cạnh ấy.</li>
  <li>Mỗi hàng đợi mất khoảng 25 giây: sau khi tạo hàng đợi, provider đợi tới khi SQS báo các thuộc tính ổn định. Trên laptop bận chạy LocalStack, chờ đợi này là phần chậm nhất; trên AWS cũng tương tự. Terraform không chậm vì HCL — nó chậm đúng bằng các API nó phải đợi.</li>
  <li>Data source cũng có mặt trong <code>state list</code>; chúng được đọc lại ở mỗi lần plan.</li>
</ul>

<h3>Chạy thật (5): chạy lại — không có gì để làm</h3>
${OUT_112_KHONG_DOI}
<p>Đây là idempotent trong thực tế. Một plan "No changes" cũng là phép kiểm không ai sửa tay (bài 11.4) — nhiều đội chạy nó mỗi đêm.</p>

<h3>Chạy thật (6): sửa tại chỗ và thay mới</h3>
<p>Thêm một tag cho bucket:</p>
${OUT_112_SUA_TAI_CHO_GON}
<p>Giờ đổi thêm tên hàng đợi:</p>
${OUT_112_THAY_MOI_GON}
<ul>
  <li>Tag đổi được trên bucket đang chạy: <code>~</code>, không mất gì. <code>tags_all</code> gộp tag của bạn với <code>default_tags</code>.</li>
  <li>SQS không đổi tên hàng đợi được, nên <code>name … # forces replacement</code> biến thành <code>-/+</code>: xoá hàng đợi cũ, tạo hàng đợi mới. <strong>Mọi tin còn chờ trong hàng đợi cũ mất sạch</strong>, và URL ứng dụng đang dùng đổi theo. Với cơ sở dữ liệu hay bucket, thay mới nghĩa là mất dữ liệu.</li>
  <li>Cách phòng: đọc mọi <code>-/+</code> và mọi "destroy" khi duyệt; <code>lifecycle { prevent_destroy = true }</code> cho tài nguyên chứa dữ liệu (plan báo lỗi thay vì xoá); <code>create_before_destroy</code> khi chồng lấn một lúc tốt hơn bị hụt; và khi chỉ đổi tên trong mã thì dùng khối <code>moved</code> ở bài 11.4.</li>
</ul>

<h3>Chạy thật (7): destroy theo thứ tự ngược</h3>
${OUT_112_DESTROY}
<p>Đúng bốn tài nguyên trong state, hàng đợi chính trước dead-letter queue của nó (ngược với lúc tạo), và tài khoản lại trống. Destroy chỉ biết những gì có trong state: một tài nguyên tạo tay nằm cạnh sẽ không bị đụng tới — vì vậy phép kiểm dọn của mọi lab vẫn liệt kê đủ các dịch vụ.</p>

<h3>Góc hacker: ai đã ký cái plugin bạn vừa tải?</h3>
<p>Provider AWS là một tệp nhị phân vài trăm megabyte chạy trên laptop và trong CI, cầm thông tin xác thực AWS của bạn. Tháng 4/2021, vụ tấn công chuỗi cung ứng Codecov (bài 6.3) làm lộ khoá GPG riêng mà HashiCorp dùng để ký checksum của các bản phát hành, gồm cả provider Terraform (bản tin HCSEC-2021-12). HashiCorp thu hồi và thay khoá, ký lại các bản phát hành; các bản Terraform ra sau đó tin khoá mới. Bài học cho bạn:</p>
<ul>
  <li>Chỉ cài Terraform và provider từ registry chính thức hoặc kho nhân bản của công ty, không bao giờ từ một liên kết tải lạ.</li>
  <li>Commit <code>.terraform.lock.hcl</code>: một tệp nhị phân bị tráo, checksum khác, sẽ làm <code>init</code> báo lỗi to thay vì lặng lẽ chạy với thông tin xác thực của bạn.</li>
  <li>Cho role của CI đúng những quyền plan cần (bài 1.3), để plugin bị chiếm cũng không làm được mọi thứ.</li>
</ul>

<h3>Đi làm: đọc plan của đồng nghiệp trong pull request</h3>
<p>PR ghi "thêm tag Owner". Bình luận plan ghi <code>Plan: 1 to add, 1 to change, 1 to destroy</code>. Dừng lại: thêm tag không bao giờ xoá gì. Cuộn tới dòng <code>-/+</code> và bạn thấy việc đổi tên hàng đợi lẫn trong cùng commit. Đề nghị tách ra, hoặc có kế hoạch chuyển tin nhắn. Câu hỏi đó chính là việc người duyệt được trả lương để làm.</p>

<h3>LocalStack khác AWS ở bài này</h3>
<ul>
  <li>Cùng provider, cùng lệnh, cùng ký hiệu plan. LocalStack không kiểm quyền IAM, nên thiếu quyền chỉ lộ ra trên AWS thật (AccessDenied lúc apply).</li>
  <li>Mã tài khoản là 000000000000 giả, và không có gì bị tính tiền.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"terraform plan làm gì?"</strong> — Refresh: đọc tài nguyên thật; so với mã và state; in các hành động (+ ~ -/+ -) và bản tóm tắt. Không thay đổi gì.</li>
  <li><strong>"Resource khác data source thế nào?"</strong> — Resource được tạo và sở hữu (destroy sẽ xoá); data source chỉ đọc thứ đã có.</li>
  <li><strong>"Terraform biết thứ tự bằng cách nào?"</strong> — Từ các tham chiếu: chúng tạo thành đồ thị phụ thuộc; nút độc lập chạy song song, destroy đi ngược lại. <code>depends_on</code> chỉ dành cho phụ thuộc ẩn.</li>
  <li><strong>"Vì sao commit tệp khoá phiên bản?"</strong> — Mọi người cùng phiên bản provider và checksum; nâng cấp thành thay đổi có chủ đích, duyệt được.</li>
  <li><strong>"forces replacement nghĩa là gì?"</strong> — API không đổi tại chỗ tham số đó được, nên Terraform xoá rồi tạo lại — mất dữ liệu và ID nếu bạn không có rào chắn.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Trong thư mục lab, thêm một <code>aws_sns_topic</code> tên <code>labflow-thong-bao</code> và một <code>aws_sns_topic_subscription</code> đẩy nó vào hàng đợi chính (bài 9.2). Chạy plan, rồi apply bản plan đã lưu.</p>
<p><strong>Đạt khi:</strong> plan ghi <code>2 to add</code>; đồ thị cho thấy subscription phụ thuộc cả topic lẫn hàng đợi; plan lần hai ghi "No changes"; destroy xoá 6 tài nguyên.</p>
${giai('Lời giải', hcl(`resource "aws_sns_topic" "thong_bao" {
  name = "labflow-thong-bao"
}

resource "aws_sns_topic_subscription" "vao_hang" {
  topic_arn = aws_sns_topic.thong_bao.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.viec.arn
}
# Trên AWS thật, hàng đợi còn cần queue policy cho phép topic này gửi vào (bài 9.2).`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Provider</b><span>Plugin nói chuyện với một API (aws, random, cloudflare…).</span></div>
  <div><b>Resource</b><span>Thứ Terraform tạo, sửa và xoá.</span></div>
  <div><b>Data source</b><span>Tra cứu chỉ đọc một thứ đã có.</span></div>
  <div><b>Tệp khoá phiên bản</b><span>.terraform.lock.hcl: phiên bản provider chính xác + checksum; phải commit.</span></div>
  <div><b>Plan</b><span>Phần khác biệt giữa mã và thực tế; lưu được bằng -out.</span></div>
  <div><b>Forces replacement</b><span>Tham số không đổi tại chỗ được ⇒ xoá + tạo lại.</span></div>
  <div><b>Đồ thị phụ thuộc</b><span>Dựng từ các tham chiếu; quyết định thứ tự và mức song song.</span></div>
  <div><b>default_tags</b><span>Tag provider tự gắn cho mọi tài nguyên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>fmt → init → validate → plan -out → apply bản plan → destroy.</li>
  <li>Không có khoá trong .tf: profile, role, OIDC. Commit tệp khoá phiên bản, bỏ qua .terraform/ và state.</li>
  <li>Tham chiếu là phụ thuộc: thứ độc lập chạy song song, destroy đi ngược lại.</li>
  <li>Đọc plan: (known after apply), mặc định ẩn, và trên hết là mọi dòng -/+.</li>
  <li>Plan lần hai ghi "No changes" chứng minh mã và thực tế khớp nhau.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://registry.terraform.io/providers/hashicorp/aws/latest/docs', '📖', 'Tài liệu provider AWS', 'Mọi tài nguyên, tham số của nó, và tham số nào buộc thay mới.')}
${tl('https://developer.hashicorp.com/terraform/cli/commands/plan', '🔍', 'terraform plan — tham chiếu lệnh', 'Các chế độ refresh, -out, -target, -destroy và mã thoát.')}

<h3>Nguồn</h3>
<ul>
  <li>Tệp khoá phiên bản: <a href="https://developer.hashicorp.com/terraform/language/files/dependency-lock" target="_blank" rel="noopener">developer.hashicorp.com/…/dependency-lock</a> · ràng buộc phiên bản: <a href="https://developer.hashicorp.com/terraform/language/expressions/version-constraints" target="_blank" rel="noopener">…/version-constraints</a></li>
  <li>Data source: <a href="https://developer.hashicorp.com/terraform/language/data-sources" target="_blank" rel="noopener">developer.hashicorp.com/…/data-sources</a></li>
  <li>LocalStack + Terraform: <a href="https://docs.localstack.cloud/aws/integrations/infrastructure-as-code/terraform/" target="_blank" rel="noopener">docs.localstack.cloud</a></li>
  <li>HCSEC-2021-12, Codecov và khoá GPG của HashiCorp: <a href="https://discuss.hashicorp.com/t/hcsec-2021-12-codecov-security-event-and-hashicorp-gpg-key-exposure/23512" target="_blank" rel="noopener">discuss.hashicorp.com</a></li>
</ul>
</div>
`;
/* ═════ 11.3 — Biến, output và module ═════ */
const MA_CAY = bash(`113/
├── main.tf            # root module: calls ./modules/mang, re-exports its outputs
├── variables.tf       # env (validated), cidr, so_az
├── provider.tf  versions.tf
├── dev.tfvars         # env = "dev",  cidr = 10.10.0.0/16, 2 AZ
├── prod.tfvars        # env = "prod", cidr = 10.20.0.0/16, 3 AZ
└── modules/
    └── mang/          # a reusable VPC: variables.tf · main.tf · outputs.tf`);
const MA_BIEN = bash(`# Where a variable's value comes from — later wins:
#   default in variables.tf  <  terraform.tfvars / *.auto.tfvars  <  -var-file=prod.tfvars  <  -var so_az=2
#   (or the environment: TF_VAR_so_az=2)
terraform plan -var-file=prod.tfvars -var so_az=2`);
const L113_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 3</span>
<h2>11.3 — Variables, outputs and modules</h2>
<p class="lead">One file per environment, copied and edited by hand, is click-ops with extra steps. This lesson turns the network of Chapter 3 (VPC, public and private subnets in several AZs, internet gateway, route table) into a <strong>module</strong>, calls it for dev with 2 AZs and for prod with 3 AZs from the same code, shows how a validation rule stops a wrong value before AWS is called, proves on a real plan why <code>for_each</code> is safer than <code>count</code>, and uses the most popular community VPC module — with the supply-chain care that a downloaded module deserves.</p>

<h3>The picture: a function, called with different arguments</h3>
<p>You already know this from programming. A module is a function: <strong>variables</strong> are its parameters, <strong>outputs</strong> are its return values, <strong>locals</strong> are local variables. <code>module "mang" { … }</code> is a call. Calling it twice with different arguments gives two networks, exactly as <code>taoMang("dev", 2)</code> and <code>taoMang("prod", 3)</code> would.</p>

<h3>The layout</h3>
${MA_CAY}

<h3>The module: inputs, logic, outputs</h3>
${MA_TF113_MOD_VAR}
${MA_TF113_MOD}
${MA_TF113_MOD_OUT}
<ul>
  <li><strong>variable</strong> with <code>type</code> and <code>description</code>; a <code>default</code> makes it optional (<code>so_az = 2</code>).</li>
  <li><strong>locals</strong> compute values once: the list of AZs from a data source, and the subnet ranges with <code>cidrsubnet(var.cidr, 8, i)</code> — /16 plus 8 bits = /24 number i (10.10.0.0/24, 10.10.1.0/24 …); private ones start at 100 so they never overlap.</li>
  <li><strong>for_each</strong> over a map keyed by AZ name: one subnet per key. The key — not a position — is the subnet's identity in the state.</li>
  <li><strong>for expressions</strong> (<code>{ for az, s in … : az => s.cidr_block }</code>) shape the outputs into something readable.</li>
  <li>The module has no provider block: it uses the caller's provider (Region, credentials, default tags). That is what makes it reusable.</li>
</ul>

<h3>The root: one call, values from outside</h3>
${MA_TF113_VAR}
${MA_TF113}
${MA_TF113_DEV}
${MA_TF113_PROD}
${MA_BIEN}

<h3>See it running (1): validation and required variables</h3>
${OUT_113_VALIDATION}
<ul>
  <li>The validation rule rejects "production" with your own message, before any resource is touched. Use it for environment names, CIDR formats, instance sizes you allow, retention days.</li>
  <li>A variable with no default and no value stops the plan: in automation (<code>-input=false</code>) Terraform never guesses.</li>
</ul>

<h3>See it running (2): the same module for dev and prod</h3>
${OUT_113_DEV_PROD}
${OUT_113_VPCS}
<ul>
  <li>dev: 9 resources (VPC, gateway, route table, 2 public + 2 private subnets, 2 route associations); prod: 12, because three AZs. One code path, two sizes.</li>
  <li>Each workspace has its own state, so destroying dev cannot touch prod. Many teams prefer one folder per environment (<code>envs/dev</code>, <code>envs/prod</code>) with separate backends and separate AWS accounts — workspaces are fine for a lab, separate accounts are safer for production.</li>
</ul>
${OUT_113_STATE_LIST}
<p>Inside the state every subnet is addressed by its AZ: <code>module.mang.aws_subnet.cong_khai["ap-southeast-1c"]</code>.</p>

<h3>See it running (3): change one argument, see exactly what moves</h3>
${OUT_113_BOT_AZ}
<p>Going from 3 AZs to 2 removes only the three resources of AZ c. Nothing else is replaced, because every other subnet keeps its key.</p>
${OUT_113_DON}

<h3>See it running (4): count vs for_each — remove the first item</h3>
${MA_TF113_COUNT}
${OUT_113_COUNT}
<ul>
  <li>With <code>count</code>, identity is the <strong>position</strong>. Removing "anh" shifts "email" to index 0 and "bao-cao" to index 1, so Terraform renames queue 0 and queue 1 (SQS cannot rename ⇒ replace) and deletes queue 2. Two queues you never meant to touch are recreated, and their waiting messages are lost.</li>
  <li>With <code>for_each</code>, identity is the <strong>key</strong>. Only <code>f-anh</code> is destroyed.</li>
  <li>Rule of thumb: <code>count</code> for "0 or 1" (a feature switch: <code>count = var.bat_nat ? 1 : 0</code>) or truly identical copies; <code>for_each</code> for anything with a name.</li>
</ul>

<h3>See it running (5): a community module from the registry</h3>
${MA_TF113_CD}
${OUT_113_CD}
<ul>
  <li><code>terraform-aws-modules/vpc/aws</code> is the most used VPC module: subnets, route tables, NAT, VPC endpoints, flow logs, with dozens of switches. A few lines replace our whole module.</li>
  <li><code>version = "~> 6.0"</code> pins the major version; <code>init</code> downloads it into <code>.terraform/modules</code>. Read the module's inputs page before trusting the defaults — NAT is off here on purpose (cost, Lesson 3.4).</li>
  <li>Read the state list: 17 resources for the same 2-AZ network our module built with 9. It also adopts the VPC's default network ACL, route table and security group (<code>aws_default_*</code>) so nobody can quietly use the open defaults; one private route table per AZ is ready for one NAT per AZ.</li>
  <li>Notice <code>public[0]</code>, <code>private[1]</code>: this module uses <code>count</code> internally. Removing the first entry of <code>azs</code> shifts every index — exactly the replacement you saw in (4). Add AZs at the end, never in front.</li>
  <li>Your own module or a community one? Community: fast, well tested, but large and generic. Your own: small, exactly your rules (tags, naming, CIDR plan), and you understand every line in an interview. Many companies wrap a community module in a thin internal one.</li>
</ul>

<h3>The hacker's angle: a module is code someone else can change</h3>
<p>A module from the registry, or from a Git URL, runs inside your plan with your credentials. If its source can change without you noticing, so can your infrastructure. The same pattern hit npm in October 2021: the popular package <strong>ua-parser-js</strong> had three versions (0.7.29, 0.8.0, 1.0.0) published with malicious code; the GitHub advisory GHSA-pjwm-rvh2-c87w tells anyone who installed them to treat the machine as compromised and rotate every secret from another computer. Projects that pinned exact versions were not affected.</p>
<ul>
  <li>Pin module versions (<code>version = "~> 6.0"</code> for registry modules, <code>?ref=v6.8.0</code> or a commit SHA for Git sources). Upgrade on purpose, after reading the changelog and the plan.</li>
  <li>Prefer verified publishers or your company's private registry; read what a module creates (<code>terraform state list</code> after a test apply).</li>
  <li>Run the plan in CI with a role limited to what the code should do, so a malicious module cannot create IAM users or open security groups unnoticed.</li>
</ul>

<h3>At work: "prod needs 3 AZs, dev stays at 2 to save money"</h3>
<p>Without modules this becomes two copies of the network code that drift apart within a month. With the module, the request is one line in <code>prod.tfvars</code> and a plan in the pull request that shows exactly "+3 subnets, +1 association", nothing else. That reviewable diff is the real value of a module.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"variable vs local vs output?"</strong> — variable: input from outside; local: computed once inside; output: value exposed to the caller or printed.</li>
  <li><strong>"count or for_each?"</strong> — for_each for named things (stable keys); count for 0/1 switches. Explain the index-shift replacement you saw.</li>
  <li><strong>"How do you manage dev and prod?"</strong> — Same modules, different variable files, separate state (and ideally separate accounts); promote by applying the same commit to dev, then prod.</li>
  <li><strong>"What do you check before using a community module?"</strong> — Maintainer and downloads, pinned version, inputs and defaults (cost!), what it creates; wrap it if you need house rules.</li>
</ul>

<h3>🧪 Practice (25 minutes)</h3>
<p>Add a variable <code>bat_nat</code> (bool, default false) to the module. When true, create one <code>aws_eip</code>, one <code>aws_nat_gateway</code> in the first public subnet, and a private route table with a default route to it, associated with every private subnet.</p>
<p><strong>Done when:</strong> dev (false) plans the same 9 resources as before; prod with <code>-var bat_nat=true</code> plans 12 + 1 EIP + 1 NAT + 1 route table + 3 associations = 18; flipping back to false plans exactly those 6 to destroy.</p>
${giai('Solution', hcl(`variable "bat_nat" {
  type    = bool
  default = false
}

resource "aws_eip" "nat" {
  count  = var.bat_nat ? 1 : 0          # a 0/1 switch: count is the right tool here
  domain = "vpc"
}

resource "aws_nat_gateway" "nay" {
  count         = var.bat_nat ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = values(aws_subnet.cong_khai)[0].id
}

resource "aws_route_table" "rieng" {
  count  = var.bat_nat ? 1 : 0
  vpc_id = aws_vpc.nay.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nay[0].id
  }
}

resource "aws_route_table_association" "rieng" {
  for_each       = { for az, s in aws_subnet.rieng : az => s.id if var.bat_nat }
  subnet_id      = each.value
  route_table_id = aws_route_table.rieng[0].id
}
# Root: declare the same variable and pass  bat_nat = var.bat_nat  in module "mang". Tested: 9 / 18 to add.`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Module</b><span>A folder of .tf files called with arguments; the root folder is the root module.</span></div>
  <div><b>variable / local / output</b><span>Input / computed value / returned value.</span></div>
  <div><b>.tfvars</b><span>File of variable values, one per environment.</span></div>
  <div><b>validation</b><span>Rule on a variable, checked before planning resources.</span></div>
  <div><b>for_each</b><span>One instance per map key or set member; identity = key.</span></div>
  <div><b>count</b><span>N copies; identity = index (shifts when the list changes).</span></div>
  <div><b>cidrsubnet()</b><span>Carves a smaller range out of a CIDR block.</span></div>
  <div><b>Registry module</b><span>Published module, e.g. terraform-aws-modules/vpc/aws; pin its version.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Modules are functions: variables in, outputs out, no provider inside.</li>
  <li>One module, two tfvars: dev 9 resources, prod 12 — same code, separate state.</li>
  <li>Validation rejects bad values early with your own message.</li>
  <li>for_each keeps identity by key; count by position — removing the first item replaced two queues.</li>
  <li>Community modules save time; pin versions and read what they create (ua-parser-js 2021).</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://developer.hashicorp.com/terraform/language/modules/develop', '🧩', 'Terraform — Creating modules', 'Structure, inputs/outputs, composition and publishing.')}
${tl('https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest', '🌐', 'terraform-aws-modules/vpc', 'Inputs, outputs and examples of the community VPC module.')}

<h3>Sources</h3>
<ul>
  <li>Input variables and validation: <a href="https://developer.hashicorp.com/terraform/language/values/variables" target="_blank" rel="noopener">developer.hashicorp.com/…/variables</a></li>
  <li>count: <a href="https://developer.hashicorp.com/terraform/language/meta-arguments/count" target="_blank" rel="noopener">…/meta-arguments/count</a> · for_each: <a href="https://developer.hashicorp.com/terraform/language/meta-arguments/for_each" target="_blank" rel="noopener">…/meta-arguments/for_each</a></li>
  <li>Workspaces: <a href="https://developer.hashicorp.com/terraform/language/state/workspaces" target="_blank" rel="noopener">developer.hashicorp.com/…/workspaces</a></li>
  <li>ua-parser-js advisory: <a href="https://github.com/advisories/GHSA-pjwm-rvh2-c87w" target="_blank" rel="noopener">github.com/advisories/GHSA-pjwm-rvh2-c87w</a></li>
</ul>
</div>
`;
const MA_CAY_VI = bash(`113/
├── main.tf            # root module: gọi ./modules/mang, xuất lại output của nó
├── variables.tf       # env (có validation), cidr, so_az
├── provider.tf  versions.tf
├── dev.tfvars         # env = "dev",  cidr = 10.10.0.0/16, 2 AZ
├── prod.tfvars        # env = "prod", cidr = 10.20.0.0/16, 3 AZ
└── modules/
    └── mang/          # một VPC dùng lại được: variables.tf · main.tf · outputs.tf`);
const MA_BIEN_VI = bash(`# Giá trị của biến lấy từ đâu — cái sau thắng:
#   default trong variables.tf  <  terraform.tfvars / *.auto.tfvars  <  -var-file=prod.tfvars  <  -var so_az=2
#   (hoặc biến môi trường: TF_VAR_so_az=2)
terraform plan -var-file=prod.tfvars -var so_az=2`);
const L113_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 3</span>
<h2>11.3 — Biến, output và module</h2>
<p class="lead">Mỗi môi trường một tệp, chép ra rồi sửa tay, chỉ là bấm tay thêm vài bước. Bài này biến mạng của chương 3 (VPC, subnet public và private trên nhiều AZ, internet gateway, route table) thành một <strong>module</strong>, gọi nó cho dev với 2 AZ và cho prod với 3 AZ từ cùng một đoạn mã, cho thấy luật validation chặn giá trị sai trước khi gọi AWS, chứng minh trên một plan thật vì sao <code>for_each</code> an toàn hơn <code>count</code>, và dùng module VPC phổ biến nhất của cộng đồng — với sự cẩn thận chuỗi cung ứng mà một module tải về xứng đáng được nhận.</p>

<h3>Hình dung: một hàm, gọi với tham số khác nhau</h3>
<p>Bạn đã biết điều này từ lập trình. Module là một hàm: <strong>variable</strong> là tham số, <strong>output</strong> là giá trị trả về, <strong>locals</strong> là biến cục bộ. <code>module "mang" { … }</code> là một lời gọi. Gọi hai lần với tham số khác nhau thì được hai mạng, y như <code>taoMang("dev", 2)</code> và <code>taoMang("prod", 3)</code>.</p>

<h3>Cách sắp thư mục</h3>
${MA_CAY_VI}

<h3>Module: đầu vào, logic, đầu ra</h3>
${MA_TF113_MOD_VAR}
${MA_TF113_MOD}
${MA_TF113_MOD_OUT}
<ul>
  <li><strong>variable</strong> có <code>type</code> và <code>description</code>; có <code>default</code> thì thành tuỳ chọn (<code>so_az = 2</code>).</li>
  <li><strong>locals</strong> tính giá trị một lần: danh sách AZ lấy từ data source, và dải subnet bằng <code>cidrsubnet(var.cidr, 8, i)</code> — /16 cộng 8 bit = /24 thứ i (10.10.0.0/24, 10.10.1.0/24 …); dải private bắt đầu từ 100 để không bao giờ chồng nhau.</li>
  <li><strong>for_each</strong> trên một map có khoá là tên AZ: mỗi khoá một subnet. Chính khoá — không phải vị trí — là danh tính của subnet trong state.</li>
  <li><strong>Biểu thức for</strong> (<code>{ for az, s in … : az => s.cidr_block }</code>) nặn output thành dạng dễ đọc.</li>
  <li>Module không có khối provider: nó dùng provider của bên gọi (Region, thông tin xác thực, tag mặc định). Nhờ vậy nó mới dùng lại được.</li>
</ul>

<h3>Root: một lời gọi, giá trị lấy từ bên ngoài</h3>
${MA_TF113_VAR}
${MA_TF113}
${MA_TF113_DEV}
${MA_TF113_PROD}
${MA_BIEN_VI}

<h3>Chạy thật (1): validation và biến bắt buộc</h3>
${OUT_113_VALIDATION}
<ul>
  <li>Luật validation từ chối "production" bằng thông báo của chính bạn, trước khi đụng tới bất kỳ tài nguyên nào. Dùng nó cho tên môi trường, định dạng CIDR, cỡ máy được phép, số ngày giữ log.</li>
  <li>Biến không có default và không được truyền giá trị thì plan dừng: khi chạy tự động (<code>-input=false</code>) Terraform không bao giờ đoán.</li>
</ul>

<h3>Chạy thật (2): cùng một module cho dev và prod</h3>
${OUT_113_DEV_PROD}
${OUT_113_VPCS}
<ul>
  <li>dev: 9 tài nguyên (VPC, gateway, route table, 2 subnet public + 2 private, 2 liên kết route); prod: 12, vì ba AZ. Một đường mã, hai kích cỡ.</li>
  <li>Mỗi workspace có state riêng, nên destroy dev không thể đụng prod. Nhiều đội thích mỗi môi trường một thư mục (<code>envs/dev</code>, <code>envs/prod</code>) với backend riêng và tài khoản AWS riêng — workspace ổn cho lab, tài khoản riêng an toàn hơn cho production.</li>
</ul>
${OUT_113_STATE_LIST}
<p>Trong state, mỗi subnet được gọi theo AZ của nó: <code>module.mang.aws_subnet.cong_khai["ap-southeast-1c"]</code>.</p>

<h3>Chạy thật (3): đổi một tham số, thấy đúng cái gì thay đổi</h3>
${OUT_113_BOT_AZ}
<p>Từ 3 AZ xuống 2 chỉ xoá ba tài nguyên của AZ c. Không có gì khác bị thay mới, vì mọi subnet còn lại giữ nguyên khoá.</p>
${OUT_113_DON}

<h3>Chạy thật (4): count và for_each — bỏ phần tử đầu tiên</h3>
${MA_TF113_COUNT}
${OUT_113_COUNT}
<ul>
  <li>Với <code>count</code>, danh tính là <strong>vị trí</strong>. Bỏ "anh" thì "email" dồn lên vị trí 0 và "bao-cao" lên vị trí 1, nên Terraform đổi tên hàng đợi 0 và 1 (SQS không đổi tên được ⇒ thay mới) và xoá hàng đợi 2. Hai hàng đợi bạn chẳng định đụng tới bị tạo lại, tin đang chờ trong đó mất sạch.</li>
  <li>Với <code>for_each</code>, danh tính là <strong>khoá</strong>. Chỉ <code>f-anh</code> bị xoá.</li>
  <li>Kinh nghiệm: <code>count</code> cho "0 hoặc 1" (công tắc tính năng: <code>count = var.bat_nat ? 1 : 0</code>) hoặc các bản sao giống hệt thật sự; <code>for_each</code> cho mọi thứ có tên.</li>
</ul>

<h3>Chạy thật (5): module cộng đồng từ registry</h3>
${MA_TF113_CD}
${OUT_113_CD}
<ul>
  <li><code>terraform-aws-modules/vpc/aws</code> là module VPC được dùng nhiều nhất: subnet, route table, NAT, VPC endpoint, flow log, với hàng chục công tắc. Vài dòng thay được cả module của chúng ta.</li>
  <li><code>version = "~> 6.0"</code> ghim phiên bản lớn; <code>init</code> tải nó vào <code>.terraform/modules</code>. Đọc trang inputs của module trước khi tin các mặc định — ở đây cố ý tắt NAT (chi phí, bài 3.4).</li>
  <li>Đọc state list: 17 tài nguyên cho cùng mạng 2 AZ mà module của chúng ta dựng bằng 9. Nó còn nhận quản network ACL, route table và security group mặc định của VPC (<code>aws_default_*</code>) để không ai lặng lẽ dùng các mặc định đang mở; mỗi AZ một route table private, sẵn cho mỗi AZ một NAT.</li>
  <li>Để ý <code>public[0]</code>, <code>private[1]</code>: bên trong module này dùng <code>count</code>. Bỏ phần tử đầu của <code>azs</code> là dồn mọi vị trí — đúng kiểu thay mới bạn thấy ở (4). Thêm AZ vào cuối, đừng bao giờ chèn vào đầu.</li>
  <li>Module tự viết hay của cộng đồng? Cộng đồng: nhanh, được kiểm kỹ, nhưng to và chung chung. Tự viết: nhỏ, đúng luật nhà (tag, cách đặt tên, quy hoạch CIDR), và bạn hiểu từng dòng khi đi phỏng vấn. Nhiều công ty bọc một module cộng đồng trong một module nội bộ mỏng.</li>
</ul>

<h3>Góc hacker: module là mã người khác có thể sửa</h3>
<p>Một module từ registry, hay từ một URL Git, chạy bên trong plan của bạn với thông tin xác thực của bạn. Nếu nguồn của nó đổi được mà bạn không hay, thì hạ tầng của bạn cũng vậy. Đúng kiểu này đã xảy ra với npm tháng 10/2021: gói phổ biến <strong>ua-parser-js</strong> có ba phiên bản (0.7.29, 0.8.0, 1.0.0) bị phát hành kèm mã độc; khuyến cáo GHSA-pjwm-rvh2-c87w của GitHub yêu cầu ai đã cài chúng coi như máy đã bị chiếm và đổi mọi bí mật từ một máy khác. Dự án nào ghim phiên bản chính xác thì không bị ảnh hưởng.</p>
<ul>
  <li>Ghim phiên bản module (<code>version = "~> 6.0"</code> với module registry, <code>?ref=v6.8.0</code> hoặc mã commit với nguồn Git). Nâng cấp có chủ đích, sau khi đọc changelog và plan.</li>
  <li>Ưu tiên nhà phát hành đã xác minh hoặc registry riêng của công ty; xem module tạo ra những gì (<code>terraform state list</code> sau một lần apply thử).</li>
  <li>Chạy plan trong CI bằng role chỉ đủ quyền cho việc mã cần làm, để module độc không lặng lẽ tạo IAM user hay mở security group được.</li>
</ul>

<h3>Đi làm: "prod cần 3 AZ, dev giữ 2 cho đỡ tốn"</h3>
<p>Không có module, việc này thành hai bản sao mã mạng, lệch nhau trong vòng một tháng. Có module, yêu cầu đó là một dòng trong <code>prod.tfvars</code> và một plan trong pull request cho thấy đúng "+3 subnet, +1 liên kết", không gì khác. Phần khác biệt duyệt được đó mới là giá trị thật của module.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"variable, local, output khác nhau thế nào?"</strong> — variable: đầu vào từ bên ngoài; local: tính một lần bên trong; output: giá trị đưa ra cho bên gọi hoặc in ra.</li>
  <li><strong>"count hay for_each?"</strong> — for_each cho thứ có tên (khoá ổn định); count cho công tắc 0/1. Kể lại chuyện dồn vị trí làm thay mới mà bạn đã thấy.</li>
  <li><strong>"Bạn quản lý dev và prod thế nào?"</strong> — Cùng module, khác tệp biến, state riêng (tốt nhất là tài khoản riêng); đưa lên bằng cách apply cùng một commit cho dev, rồi prod.</li>
  <li><strong>"Kiểm gì trước khi dùng module cộng đồng?"</strong> — Người duy trì và lượt tải, phiên bản ghim, inputs và mặc định (chi phí!), thứ nó tạo ra; cần luật nhà thì bọc lại.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<p>Thêm biến <code>bat_nat</code> (bool, mặc định false) vào module. Khi true, tạo một <code>aws_eip</code>, một <code>aws_nat_gateway</code> ở subnet public đầu tiên, và một route table private có route mặc định trỏ tới nó, gắn cho mọi subnet private.</p>
<p><strong>Đạt khi:</strong> dev (false) plan đúng 9 tài nguyên như cũ; prod với <code>-var bat_nat=true</code> plan 12 + 1 EIP + 1 NAT + 1 route table + 3 liên kết = 18; đổi lại false thì plan đúng 6 cái đó bị xoá.</p>
${giai('Lời giải', hcl(`variable "bat_nat" {
  type    = bool
  default = false
}

resource "aws_eip" "nat" {
  count  = var.bat_nat ? 1 : 0          # công tắc 0/1: đúng chỗ dùng count
  domain = "vpc"
}

resource "aws_nat_gateway" "nay" {
  count         = var.bat_nat ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = values(aws_subnet.cong_khai)[0].id
}

resource "aws_route_table" "rieng" {
  count  = var.bat_nat ? 1 : 0
  vpc_id = aws_vpc.nay.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nay[0].id
  }
}

resource "aws_route_table_association" "rieng" {
  for_each       = { for az, s in aws_subnet.rieng : az => s.id if var.bat_nat }
  subnet_id      = each.value
  route_table_id = aws_route_table.rieng[0].id
}
# Root: khai cùng biến đó và truyền  bat_nat = var.bat_nat  vào module "mang". Đã thử: 9 / 18 to add.`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Module</b><span>Một thư mục tệp .tf được gọi kèm tham số; thư mục gốc là root module.</span></div>
  <div><b>variable / local / output</b><span>Đầu vào / giá trị tính ra / giá trị trả về.</span></div>
  <div><b>.tfvars</b><span>Tệp giá trị biến, mỗi môi trường một tệp.</span></div>
  <div><b>validation</b><span>Luật gắn vào biến, kiểm trước khi plan tài nguyên.</span></div>
  <div><b>for_each</b><span>Mỗi khoá của map hay phần tử của set một bản; danh tính = khoá.</span></div>
  <div><b>count</b><span>N bản sao; danh tính = vị trí (dồn khi danh sách đổi).</span></div>
  <div><b>cidrsubnet()</b><span>Cắt một dải nhỏ hơn từ một khối CIDR.</span></div>
  <div><b>Module registry</b><span>Module đã công bố, ví dụ terraform-aws-modules/vpc/aws; phải ghim phiên bản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Module là hàm: biến vào, output ra, bên trong không có provider.</li>
  <li>Một module, hai tfvars: dev 9 tài nguyên, prod 12 — cùng mã, state riêng.</li>
  <li>Validation chặn giá trị xấu sớm bằng thông báo của chính bạn.</li>
  <li>for_each giữ danh tính theo khoá; count theo vị trí — bỏ phần tử đầu làm thay mới hai hàng đợi.</li>
  <li>Module cộng đồng tiết kiệm thời gian; ghim phiên bản và xem nó tạo gì (ua-parser-js 2021).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://developer.hashicorp.com/terraform/language/modules/develop', '🧩', 'Terraform — Tạo module', 'Cấu trúc, đầu vào/đầu ra, ghép module và công bố.')}
${tl('https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest', '🌐', 'terraform-aws-modules/vpc', 'Inputs, outputs và ví dụ của module VPC cộng đồng.')}

<h3>Nguồn</h3>
<ul>
  <li>Biến đầu vào và validation: <a href="https://developer.hashicorp.com/terraform/language/values/variables" target="_blank" rel="noopener">developer.hashicorp.com/…/variables</a></li>
  <li>count: <a href="https://developer.hashicorp.com/terraform/language/meta-arguments/count" target="_blank" rel="noopener">…/meta-arguments/count</a> · for_each: <a href="https://developer.hashicorp.com/terraform/language/meta-arguments/for_each" target="_blank" rel="noopener">…/meta-arguments/for_each</a></li>
  <li>Workspace: <a href="https://developer.hashicorp.com/terraform/language/state/workspaces" target="_blank" rel="noopener">developer.hashicorp.com/…/workspaces</a></li>
  <li>Khuyến cáo ua-parser-js: <a href="https://github.com/advisories/GHSA-pjwm-rvh2-c87w" target="_blank" rel="noopener">github.com/advisories/GHSA-pjwm-rvh2-c87w</a></li>
</ul>
</div>
`;
/* ═════ 11.4 — State: backend S3, khoá và lệch cấu hình ═════ */
const MA_STATE_LENH = bash(`terraform state list                 # every address Terraform owns
terraform state show aws_s3_bucket.anh   # all attributes stored for one resource
terraform state mv A B               # rename in state (prefer a moved block: it is reviewed in git)
terraform state rm aws_s3_bucket.anh # FORGET it: the bucket stays in AWS, Terraform stops managing it
terraform plan -refresh-only         # only show drift, change nothing
terraform plan -detailed-exitcode    # exit 0 = no changes, 2 = changes, 1 = error (for nightly drift checks)
terraform force-unlock <LOCK_ID>     # last resort, only when you are sure the holder is dead`);
const MA_GITIGNORE = bash(`# .gitignore of every Terraform repo
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
*.tfvars          # if they hold secrets; commit only example.tfvars
crash.log`);
const L114_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 4</span>
<h2>11.4 — State: S3 backend, locking and drift</h2>
<p class="lead">Terraform's memory is one JSON file: the <strong>state</strong>. It maps every address in your code to a real resource ID and stores all its attributes — including passwords. This lesson opens a state file and finds a password in plain text, removes it with Terraform 1.11's write-only arguments, moves the state into an S3 bucket with S3-native locking, makes two people apply at the same moment, catches a hand change in the console, adopts a resource that was created by hand, and renames a resource in code without destroying it.</p>

<h3>The picture: the land registry</h3>
<p>The registry book says plot 12 belongs to family A, with its boundaries. The builder (Terraform) checks it before every job. Lose the book and he no longer knows he built the house — he would try to build it again. Let two clerks write on the same page at the same time and the page is garbage — so the office lets only one clerk hold the book (<strong>lock</strong>). And anyone who can read the book can read whatever is written in it — so it is kept in a locked room (<strong>encrypted, access-controlled backend</strong>).</p>

<h3>What is in the state</h3>
${OUT_114_STATE_SHOW}
<ul>
  <li>For each resource: its address, provider, the real ID, every attribute AWS returned (ARN, domain names, Region…), and dependencies. Plan compares code ⇄ state ⇄ reality using this.</li>
  <li>The state is also a cache: on big accounts it keeps plan fast and keeps track of things that cannot be found by name.</li>
  <li>Never edit it by hand. Use the commands:</li>
</ul>
${MA_STATE_LENH}

<h3>See it running (1): "sensitive" hides the password on screen — not in the state</h3>
${MA_TF114_A}
${OUT_114_BI_MAT}
<ul>
  <li><code>terraform output</code> prints <code>&lt;sensitive&gt;</code>, and plan would print <code>(sensitive value)</code>. But the state file holds the generated password in plain text — twice: in <code>random_password.db</code> and in the secret version. (We cut it to the first 4 characters here; the real file holds all 20.) The extra lines <code>"value": "secret_string"</code> only mark the attribute as sensitive.</li>
  <li>Same for <code>aws_db_instance.password</code>, private keys from <code>tls_private_key</code>, access keys from <code>aws_iam_access_key</code>: whoever can read the state owns them.</li>
</ul>

<h3>See it running (2): ephemeral values + write-only arguments (Terraform 1.11+)</h3>
${MA_TF114_B}
${OUT_114_CHI_GHI}
<ul>
  <li><strong>ephemeral</strong> (Terraform 1.10+) produces a value that exists only during the run; plan shows <code>secret_string_wo = (write-only attribute)</code>.</li>
  <li><strong>Write-only arguments</strong> (<code>_wo</code>, Terraform 1.11+) are sent to AWS and never stored: the state keeps only <code>has_secret_string_wo: true</code>, and Secrets Manager still received a 20-character value.</li>
  <li>Because Terraform no longer remembers the value, it cannot notice a change: you rotate by bumping <code>secret_string_wo_version</code>. For RDS, the simplest option remains <code>manage_master_user_password = true</code> (Lesson 6.3) — AWS creates and rotates the password, Terraform never sees it.</li>
</ul>

<h3>See it running (3): move the state into S3</h3>
${MA_TF114_BACKEND}
${OUT_114_BACKEND}
<ul>
  <li>The state bucket must exist before <code>init</code> can use it — the chicken-and-egg problem. Create it once with the CLI or with a tiny separate "bootstrap" configuration that has local state, and turn on <strong>versioning</strong>, encryption and Block Public Access.</li>
  <li><code>init -migrate-state</code> copied the 7,875-byte state to <code>labflow/dev/terraform.tfstate</code>; the local file is now 0 bytes. Delete the <code>.backup</code> too: it still contains the old state.</li>
  <li>One key per environment or component (<code>labflow/dev/…</code>, <code>labflow/prod/…</code>): a broken apply in one cannot damage the others. Many teams put prod state in a separate account.</li>
</ul>

<h3>See it running (4): two applies at the same moment</h3>
${OUT_114_KHOA}
${OUT_114_KHOA_XONG}
<ul>
  <li>While A runs, a small object <code>terraform.tfstate.tflock</code> sits next to the state. B tries to create the same object with a conditional write ("only if it does not exist"), S3 answers <strong>412 PreconditionFailed</strong>, and Terraform refuses with the lock holder's ID, operation, user, machine (hidden here) and start time.</li>
  <li><code>use_lockfile = true</code> is the S3-native lock added in Terraform 1.10; the older DynamoDB-table lock (<code>dynamodb_table</code>) is deprecated. LocalStack implements the same conditional write, so you see the real mechanism.</li>
  <li>When A finished, the lock object disappeared. Thanks to versioning the bucket now holds 4 versions of the state: if an apply ever writes a broken state, you can restore the previous version instead of losing track of everything.</li>
</ul>

<h3>See it running (5): drift — someone "just tested something" in the console</h3>
${OUT_114_DRIFT}
${OUT_114_DRIFT_SUA}
<ul>
  <li><code>plan -refresh-only</code> only reports what changed outside Terraform. A normal plan then proposes to put it back (<code>"Suspended" -> "Enabled"</code>).</li>
  <li>Two honest choices: revert (apply), or — if the hand change was right — write it into the code so the plan becomes "No changes". Never leave drift standing: the next unrelated apply would silently undo the hand fix.</li>
  <li>Catch drift automatically: a nightly CI job runs <code>plan -detailed-exitcode</code> and alerts on exit code 2. That is exactly the "continuous auditing of cloud settings" Toyota promised in 2023 (Lesson 11.1).</li>
</ul>

<h3>See it running (6): adopt a resource created by hand — import</h3>
${OUT_114_IMPORT}
${OUT_114_IMPORT_XONG}
<ul>
  <li>An <code>import</code> block (Terraform 1.5+) says "this existing thing belongs to that address". With <code>-generate-config-out</code> Terraform even writes the resource block for you.</li>
  <li>The generated config is a <em>draft</em> (Terraform calls it experimental): here it contained <code>recovery_period_in_days = 0</code>, which the provider itself rejects, plus read-only values. Clean it, then plan shows <code>1 to import</code>; the "1 to change" is the default tags being added.</li>
  <li>After import, the table is managed like everything else; the import block can stay (it does nothing twice) or be deleted.</li>
  <li>LocalStack note: we first tried importing an SQS queue. On AWS its import ID is the queue URL; the provider could not parse LocalStack's URL format (http, port 44166), so the demo uses a DynamoDB table, whose ID is its name.</li>
</ul>

<h3>See it running (7): rename in code without destroying — moved</h3>
${OUT_114_MOVED}
<p>Without the block, a pure rename in code means "destroy the bucket and its versioning, create new ones" — with data inside, that is data loss. With <code>moved</code>, the plan changes only the address in the state. Keep the block in the code for a while so every environment and every teammate's state gets the move.</p>

<h3>Clean-up: a versioned state bucket</h3>
${OUT_114_DON}
<p><code>rb --force</code> removes current objects but not old versions, so the bucket refuses to go. Delete every version (and delete marker) first. That stubbornness is the point of versioning — and the reason the state bucket is the last thing you remove.</p>

<h3>The hacker's angle: the state file is a password vault without the vault</h3>
<p>In August 2026 Pentest Partners described an engagement that started from one S3 bucket holding Terraform state files with access controls that were too permissive. A state file contained credentials of an automated GitHub application; those opened a private repository with more secrets; those included an Azure service principal that could read Key Vault; and Key Vault returned AWS access keys with administrator rights in another account. One readable state file, four hops, full control.</p>
<ul>
  <li>State bucket: Block Public Access, encryption (SSE-KMS with a key only the deploy role may use), versioning, a bucket policy that allows only the CI role and a break-glass role.</li>
  <li>Never commit state; add the <code>.gitignore</code> below to every repository.</li>
  <li>Keep secrets out of state: write-only arguments, <code>manage_master_user_password</code>, or let the application read Secrets Manager at runtime (Lesson 6.3).</li>
  <li>If a state file leaks, treat every secret in it as compromised and rotate them.</li>
</ul>
${MA_GITIGNORE}

<h3>At work: "apply is stuck on a lock since yesterday"</h3>
<p>Read the Lock Info: who, which operation, when. Usually a CI job was cancelled mid-apply. Check that the job is really dead (CI history, no running process), then <code>terraform force-unlock &lt;ID&gt;</code>, run plan, and look carefully — a half-finished apply may have created some resources already. Never force-unlock just because you are in a hurry: two applies on one state is how states get corrupted.</p>

<h3>🎤 Interviewers will ask</h3>
<ul>
  <li><strong>"Where do you keep state and why?"</strong> — Remote backend (S3) with versioning, encryption, restricted access and locking; one key per environment; never in git.</li>
  <li><strong>"How does locking work on S3?"</strong> — Terraform 1.10+ writes a .tflock object with a conditional write; a second writer gets 412 and stops. Older setups used a DynamoDB table, now deprecated.</li>
  <li><strong>"Does sensitive = true protect a secret?"</strong> — Only on screen. The value is in the state in plain text; use write-only arguments, ephemeral values or AWS-managed secrets.</li>
  <li><strong>"What is drift and how do you handle it?"</strong> — Reality differs from code/state, usually from hand changes; detect with refresh-only or nightly plans; revert or codify.</li>
  <li><strong>"How do you bring existing resources under Terraform?"</strong> — import blocks (optionally generated config), clean the config, plan until only the import is left.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<p>With the S3 backend from (3): add <code>tags = { Owner = "team-backend" }</code> to the bucket by hand with <code>aws s3api put-bucket-tagging</code> (keep the default tags too), then make the code agree with reality instead of reverting it.</p>
<p><strong>Done when:</strong> <code>plan -refresh-only</code> shows the new tag; after your code change a normal <code>plan -detailed-exitcode</code> exits with 0; the bucket holds one more version of the state than before.</p>
${giai('Solution', bash(`aws s3api put-bucket-tagging --bucket labflow-anh-114 \\
  --tagging 'TagSet=[{Key=Project,Value=labflow},{Key=ManagedBy,Value=terraform},{Key=Owner,Value=team-backend}]'
terraform plan -refresh-only            # shows tags/tags_all changed outside Terraform
# main.tf: add   tags = { Owner = "team-backend" }   to the bucket resource
terraform apply -refresh-only -auto-approve   # record reality in the state (new state version)
terraform plan -detailed-exitcode; echo $?    # 0`))}

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>State</b><span>JSON map from code addresses to real resources and their attributes.</span></div>
  <div><b>Backend</b><span>Where state is stored (local, s3, …); S3 with use_lockfile is the AWS standard.</span></div>
  <div><b>Lock</b><span>Only one run may write the state; S3 conditional write, 412 for the second.</span></div>
  <div><b>Drift</b><span>Reality changed outside Terraform; seen with plan -refresh-only.</span></div>
  <div><b>import block</b><span>Adopt an existing resource into an address; -generate-config-out drafts code.</span></div>
  <div><b>moved block</b><span>Rename an address without destroy/create.</span></div>
  <div><b>ephemeral / write-only</b><span>Values used during a run but never written to state (1.10 / 1.11+).</span></div>
  <div><b>force-unlock</b><span>Removes a stale lock; only when the holder is certainly dead.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The state is a secret: sensitive hides values on screen only; write-only arguments keep them out.</li>
  <li>S3 backend + versioning + encryption + use_lockfile; bootstrap the bucket first, remove it last.</li>
  <li>Second concurrent apply ⇒ 412 PreconditionFailed + Lock Info.</li>
  <li>Drift: refresh-only to see, apply to revert or code to adopt; nightly detailed-exitcode.</li>
  <li>import adopts, moved renames, state rm forgets — none of them deletes.</li>
  <li>One leaked state bucket ⇒ admin keys four hops later (Pentest Partners 2026).</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://developer.hashicorp.com/terraform/language/backend/s3', '🗄️', 'S3 backend', 'Every option: use_lockfile, encryption, workspaces, IAM permissions needed.')}
${tl('https://developer.hashicorp.com/terraform/language/manage-sensitive-data', '🔐', 'Manage sensitive data', 'sensitive, ephemeral values, write-only arguments — when each one helps.')}

<h3>Sources</h3>
<ul>
  <li>Sensitive data in state: <a href="https://developer.hashicorp.com/terraform/language/state/sensitive-data" target="_blank" rel="noopener">developer.hashicorp.com/…/state/sensitive-data</a> · write-only: <a href="https://developer.hashicorp.com/terraform/language/manage-sensitive-data/write-only" target="_blank" rel="noopener">…/write-only</a> · ephemeral: <a href="https://developer.hashicorp.com/terraform/language/manage-sensitive-data/ephemeral" target="_blank" rel="noopener">…/ephemeral</a></li>
  <li>Generating configuration for import: <a href="https://developer.hashicorp.com/terraform/language/import/generating-configuration" target="_blank" rel="noopener">developer.hashicorp.com/…/generating-configuration</a> · refactoring with moved: <a href="https://developer.hashicorp.com/terraform/language/modules/develop/refactoring" target="_blank" rel="noopener">…/refactoring</a></li>
  <li>Refresh-only: <a href="https://developer.hashicorp.com/terraform/tutorials/state/refresh" target="_blank" rel="noopener">developer.hashicorp.com/…/tutorials/state/refresh</a></li>
  <li>Pentest Partners, August 2026: <a href="https://www.pentestpartners.com/security-blog/breaking-the-attack-chain-created-by-exposed-cloud-secrets/" target="_blank" rel="noopener">pentestpartners.com</a></li>
</ul>
</div>
`;
const MA_STATE_LENH_VI = bash(`terraform state list                 # mọi địa chỉ Terraform đang sở hữu
terraform state show aws_s3_bucket.anh   # mọi thuộc tính đã lưu của một tài nguyên
terraform state mv A B               # đổi tên trong state (nên dùng khối moved: được soát trong git)
terraform state rm aws_s3_bucket.anh # QUÊN nó: bucket vẫn ở AWS, Terraform thôi quản lý
terraform plan -refresh-only         # chỉ cho thấy drift, không đổi gì
terraform plan -detailed-exitcode    # thoát 0 = không đổi, 2 = có đổi, 1 = lỗi (cho phép kiểm drift hằng đêm)
terraform force-unlock <LOCK_ID>     # đường cuối, chỉ khi chắc chắn bên giữ khoá đã chết`);
const MA_GITIGNORE_VI = bash(`# .gitignore của mọi kho Terraform
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
*.tfvars          # nếu chứa bí mật; chỉ commit example.tfvars
crash.log`);
const L114_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 4</span>
<h2>11.4 — State: backend S3, khoá và lệch cấu hình</h2>
<p class="lead">Trí nhớ của Terraform là một tệp JSON: <strong>state</strong>. Nó nối mỗi địa chỉ trong mã với một mã tài nguyên thật và lưu mọi thuộc tính — kể cả mật khẩu. Bài này mở một tệp state và tìm thấy mật khẩu ở dạng chữ thường, gỡ nó ra bằng tham số write-only của Terraform 1.11, chuyển state vào một bucket S3 có khoá gốc của S3, cho hai người apply cùng lúc, bắt một thay đổi tay trên console, nhận quản một tài nguyên tạo tay, và đổi tên tài nguyên trong mã mà không phải xoá nó.</p>

<h3>Hình dung: sổ địa chính</h3>
<p>Sổ ghi thửa số 12 thuộc gia đình A, kèm ranh giới. Nhà thầu (Terraform) xem sổ trước mỗi việc. Mất sổ thì ông ấy không còn biết mình đã xây căn nhà — ông ấy sẽ định xây lại. Để hai cán bộ cùng viết lên một trang một lúc thì trang đó hỏng — nên văn phòng chỉ cho một người cầm sổ (<strong>khoá</strong>). Và ai đọc được sổ thì đọc được mọi thứ ghi trong đó — nên sổ cất trong phòng khoá (<strong>backend mã hoá, giới hạn quyền</strong>).</p>

<h3>Trong state có gì</h3>
${OUT_114_STATE_SHOW}
<ul>
  <li>Với mỗi tài nguyên: địa chỉ, provider, mã thật, mọi thuộc tính AWS trả về (ARN, tên miền, Region…), và các phụ thuộc. Plan dựa vào đó để so mã ⇄ state ⇄ thực tế.</li>
  <li>State còn là bộ nhớ đệm: với tài khoản lớn nó giúp plan nhanh, và giữ dấu những thứ không tìm được theo tên.</li>
  <li>Đừng bao giờ sửa tay. Dùng các lệnh:</li>
</ul>
${MA_STATE_LENH_VI}

<h3>Chạy thật (1): "sensitive" giấu mật khẩu trên màn hình — không giấu trong state</h3>
${MA_TF114_A}
${OUT_114_BI_MAT}
<ul>
  <li><code>terraform output</code> in <code>&lt;sensitive&gt;</code>, plan sẽ in <code>(sensitive value)</code>. Nhưng tệp state giữ mật khẩu vừa sinh ở dạng chữ thường — hai lần: trong <code>random_password.db</code> và trong bản secret. (Ở đây cắt chỉ còn 4 ký tự đầu; tệp thật giữ đủ 20.) Mấy dòng <code>"value": "secret_string"</code> chỉ đánh dấu thuộc tính đó là nhạy cảm.</li>
  <li>Tương tự với <code>aws_db_instance.password</code>, khoá riêng sinh bằng <code>tls_private_key</code>, access key từ <code>aws_iam_access_key</code>: ai đọc được state là sở hữu chúng.</li>
</ul>

<h3>Chạy thật (2): giá trị ephemeral + tham số write-only (Terraform 1.11+)</h3>
${MA_TF114_B}
${OUT_114_CHI_GHI}
<ul>
  <li><strong>ephemeral</strong> (Terraform 1.10+) sinh một giá trị chỉ tồn tại trong lúc chạy; plan ghi <code>secret_string_wo = (write-only attribute)</code>.</li>
  <li><strong>Tham số write-only</strong> (<code>_wo</code>, Terraform 1.11+) được gửi lên AWS và không bao giờ được lưu: state chỉ giữ <code>has_secret_string_wo: true</code>, còn Secrets Manager vẫn nhận đủ giá trị 20 ký tự.</li>
  <li>Vì Terraform không còn nhớ giá trị, nó không thấy được thay đổi: muốn xoay thì tăng <code>secret_string_wo_version</code>. Với RDS, cách đơn giản nhất vẫn là <code>manage_master_user_password = true</code> (bài 6.3) — AWS tạo và xoay mật khẩu, Terraform không bao giờ thấy nó.</li>
</ul>

<h3>Chạy thật (3): chuyển state vào S3</h3>
${MA_TF114_BACKEND}
${OUT_114_BACKEND}
<ul>
  <li>Bucket chứa state phải có trước khi <code>init</code> dùng được nó — chuyện con gà quả trứng. Tạo một lần bằng CLI hoặc bằng một cấu hình "bootstrap" nhỏ riêng dùng state cục bộ, và bật <strong>versioning</strong>, mã hoá, Block Public Access.</li>
  <li><code>init -migrate-state</code> đã chép state 7.875 byte sang <code>labflow/dev/terraform.tfstate</code>; tệp cục bộ giờ còn 0 byte. Xoá cả tệp <code>.backup</code>: nó vẫn chứa state cũ.</li>
  <li>Mỗi môi trường hay mỗi thành phần một key (<code>labflow/dev/…</code>, <code>labflow/prod/…</code>): một lần apply hỏng ở chỗ này không làm hỏng chỗ khác. Nhiều đội để state của prod ở một tài khoản riêng.</li>
</ul>

<h3>Chạy thật (4): hai lần apply cùng một lúc</h3>
${OUT_114_KHOA}
${OUT_114_KHOA_XONG}
<ul>
  <li>Trong lúc A chạy, một đối tượng nhỏ <code>terraform.tfstate.tflock</code> nằm cạnh state. B cố tạo đúng đối tượng đó bằng một lệnh ghi có điều kiện ("chỉ khi chưa tồn tại"), S3 trả <strong>412 PreconditionFailed</strong>, và Terraform từ chối kèm mã khoá, thao tác, người dùng, tên máy (đã ẩn ở đây) và giờ bắt đầu của bên đang giữ.</li>
  <li><code>use_lockfile = true</code> là khoá gốc của S3, có từ Terraform 1.10; kiểu khoá cũ bằng bảng DynamoDB (<code>dynamodb_table</code>) đã bị đánh dấu ngừng dùng. LocalStack làm đúng lệnh ghi có điều kiện này, nên bạn thấy đúng cơ chế thật.</li>
  <li>Khi A xong, đối tượng khoá biến mất. Nhờ versioning, bucket giờ giữ 4 phiên bản của state: nếu một lần apply ghi ra state hỏng, bạn khôi phục bản trước thay vì mất dấu mọi thứ.</li>
</ul>

<h3>Chạy thật (5): drift — ai đó "chỉ thử một chút" trên console</h3>
${OUT_114_DRIFT}
${OUT_114_DRIFT_SUA}
<ul>
  <li><code>plan -refresh-only</code> chỉ báo những gì đã đổi bên ngoài Terraform. Plan thường sau đó đề nghị trả lại như cũ (<code>"Suspended" -> "Enabled"</code>).</li>
  <li>Hai lựa chọn trung thực: trả lại (apply), hoặc — nếu thay đổi tay là đúng — viết nó vào mã để plan thành "No changes". Đừng bao giờ để drift nằm đó: lần apply chẳng liên quan kế tiếp sẽ lặng lẽ xoá mất bản sửa tay.</li>
  <li>Bắt drift tự động: một job CI hằng đêm chạy <code>plan -detailed-exitcode</code> và cảnh báo khi mã thoát là 2. Đó chính là "kiểm tra liên tục thiết lập cloud" mà Toyota hứa năm 2023 (bài 11.1).</li>
</ul>

<h3>Chạy thật (6): nhận quản một tài nguyên tạo tay — import</h3>
${OUT_114_IMPORT}
${OUT_114_IMPORT_XONG}
<ul>
  <li>Khối <code>import</code> (Terraform 1.5+) nói "thứ đang tồn tại này thuộc về địa chỉ kia". Với <code>-generate-config-out</code>, Terraform còn tự viết khối resource cho bạn.</li>
  <li>Cấu hình sinh ra chỉ là <em>bản nháp</em> (Terraform gọi là thử nghiệm): ở đây nó chứa <code>recovery_period_in_days = 0</code>, giá trị mà chính provider từ chối, cùng các giá trị chỉ đọc. Dọn đi, rồi plan ghi <code>1 to import</code>; "1 to change" là phần tag mặc định được thêm vào.</li>
  <li>Sau khi import, bảng được quản lý như mọi thứ khác; khối import để lại cũng được (chạy lần hai không làm gì) hoặc xoá đi.</li>
  <li>Ghi chú LocalStack: lúc đầu chúng ta thử import một hàng đợi SQS. Trên AWS, ID import của nó là URL hàng đợi; provider không đọc được dạng URL của LocalStack (http, cổng 44166), nên bản demo dùng bảng DynamoDB, ID chính là tên bảng.</li>
</ul>

<h3>Chạy thật (7): đổi tên trong mã mà không xoá — moved</h3>
${OUT_114_MOVED}
<p>Không có khối này, chỉ đổi tên trong mã cũng thành "xoá bucket và versioning của nó, tạo cái mới" — có dữ liệu bên trong thì đó là mất dữ liệu. Có <code>moved</code>, plan chỉ đổi địa chỉ trong state. Giữ khối đó trong mã một thời gian để mọi môi trường và state của mọi đồng nghiệp đều nhận được việc đổi tên.</p>

<h3>Dọn: bucket state có versioning</h3>
${OUT_114_DON}
<p><code>rb --force</code> xoá các đối tượng hiện tại nhưng không xoá phiên bản cũ, nên bucket không chịu đi. Phải xoá mọi phiên bản (và delete marker) trước. Sự cứng đầu đó chính là ý nghĩa của versioning — và là lý do bucket state là thứ được xoá sau cùng.</p>

<h3>Góc hacker: tệp state là két mật khẩu không có két</h3>
<p>Tháng 8/2026, Pentest Partners kể một đợt kiểm thử bắt đầu từ một bucket S3 chứa tệp state Terraform với quyền truy cập quá rộng. Một tệp state chứa thông tin xác thực của một ứng dụng GitHub tự động; nó mở được một kho riêng chứa thêm bí mật; trong đó có một service principal Azure đọc được Key Vault; và Key Vault trả về access key AWS có quyền quản trị ở một tài khoản khác. Một tệp state đọc được, bốn bước nhảy, toàn quyền.</p>
<ul>
  <li>Bucket state: Block Public Access, mã hoá (SSE-KMS với khoá chỉ role deploy dùng được), versioning, bucket policy chỉ cho role CI và một role khẩn cấp.</li>
  <li>Không bao giờ commit state; thêm <code>.gitignore</code> dưới đây vào mọi kho.</li>
  <li>Giữ bí mật ngoài state: tham số write-only, <code>manage_master_user_password</code>, hoặc để ứng dụng tự đọc Secrets Manager lúc chạy (bài 6.3).</li>
  <li>Lỡ lộ một tệp state thì coi mọi bí mật trong đó đã bị lộ và xoay hết.</li>
</ul>
${MA_GITIGNORE_VI}

<h3>Đi làm: "apply kẹt khoá từ hôm qua tới giờ"</h3>
<p>Đọc Lock Info: ai, thao tác gì, lúc nào. Thường là một job CI bị huỷ giữa chừng lúc apply. Kiểm chắc job đó đã chết thật (lịch sử CI, không còn tiến trình nào chạy), rồi <code>terraform force-unlock &lt;ID&gt;</code>, chạy plan, và nhìn kỹ — một lần apply dở dang có thể đã tạo một phần tài nguyên. Đừng force-unlock chỉ vì đang vội: hai lần apply trên cùng một state là cách state bị hỏng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
  <li><strong>"Bạn để state ở đâu, vì sao?"</strong> — Backend từ xa (S3) có versioning, mã hoá, giới hạn quyền và khoá; mỗi môi trường một key; không bao giờ để trong git.</li>
  <li><strong>"Khoá trên S3 hoạt động thế nào?"</strong> — Terraform 1.10+ ghi một đối tượng .tflock bằng lệnh ghi có điều kiện; người ghi thứ hai nhận 412 và dừng. Cách cũ dùng bảng DynamoDB, nay ngừng khuyến nghị.</li>
  <li><strong>"sensitive = true có bảo vệ được bí mật không?"</strong> — Chỉ trên màn hình. Giá trị vẫn nằm trong state ở dạng chữ thường; dùng tham số write-only, giá trị ephemeral hoặc bí mật do AWS quản lý.</li>
  <li><strong>"Drift là gì, xử lý thế nào?"</strong> — Thực tế khác mã/state, thường do sửa tay; phát hiện bằng refresh-only hoặc plan hằng đêm; trả lại hoặc đưa vào mã.</li>
  <li><strong>"Đưa tài nguyên có sẵn vào Terraform thế nào?"</strong> — Khối import (có thể kèm cấu hình sinh tự động), dọn cấu hình, plan tới khi chỉ còn lại việc import.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Với backend S3 ở (3): thêm tay tag <code>Owner = team-backend</code> cho bucket bằng <code>aws s3api put-bucket-tagging</code> (giữ cả tag mặc định), rồi sửa mã cho khớp thực tế thay vì trả lại.</p>
<p><strong>Đạt khi:</strong> <code>plan -refresh-only</code> cho thấy tag mới; sau khi sửa mã, một <code>plan -detailed-exitcode</code> thường thoát với 0; bucket giữ thêm một phiên bản state so với trước.</p>
${giai('Lời giải', bash(`aws s3api put-bucket-tagging --bucket labflow-anh-114 \\
  --tagging 'TagSet=[{Key=Project,Value=labflow},{Key=ManagedBy,Value=terraform},{Key=Owner,Value=team-backend}]'
terraform plan -refresh-only            # cho thấy tags/tags_all đổi bên ngoài Terraform
# main.tf: thêm   tags = { Owner = "team-backend" }   vào tài nguyên bucket
terraform apply -refresh-only -auto-approve   # ghi thực tế vào state (thêm một phiên bản state)
terraform plan -detailed-exitcode; echo $?    # 0`))}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>State</b><span>Bản đồ JSON từ địa chỉ trong mã tới tài nguyên thật và thuộc tính của chúng.</span></div>
  <div><b>Backend</b><span>Nơi cất state (local, s3, …); S3 kèm use_lockfile là chuẩn trên AWS.</span></div>
  <div><b>Khoá (lock)</b><span>Mỗi lúc chỉ một lần chạy được ghi state; S3 ghi có điều kiện, người thứ hai nhận 412.</span></div>
  <div><b>Drift</b><span>Thực tế bị đổi bên ngoài Terraform; thấy bằng plan -refresh-only.</span></div>
  <div><b>Khối import</b><span>Nhận quản tài nguyên có sẵn vào một địa chỉ; -generate-config-out viết nháp mã.</span></div>
  <div><b>Khối moved</b><span>Đổi tên một địa chỉ mà không xoá/tạo lại.</span></div>
  <div><b>ephemeral / write-only</b><span>Giá trị dùng trong lúc chạy nhưng không bao giờ ghi vào state (1.10 / 1.11+).</span></div>
  <div><b>force-unlock</b><span>Gỡ một khoá treo; chỉ khi chắc chắn bên giữ đã chết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>State là bí mật: sensitive chỉ giấu trên màn hình; tham số write-only mới giữ được bí mật ở ngoài.</li>
  <li>Backend S3 + versioning + mã hoá + use_lockfile; dựng bucket trước, xoá nó sau cùng.</li>
  <li>Lần apply thứ hai chạy chồng ⇒ 412 PreconditionFailed + Lock Info.</li>
  <li>Drift: refresh-only để thấy, apply để trả lại hoặc sửa mã để nhận; detailed-exitcode hằng đêm.</li>
  <li>import nhận quản, moved đổi tên, state rm quên đi — không lệnh nào trong số đó xoá tài nguyên.</li>
  <li>Một bucket state bị lộ ⇒ khoá quản trị sau bốn bước nhảy (Pentest Partners 2026).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://developer.hashicorp.com/terraform/language/backend/s3', '🗄️', 'Backend S3', 'Mọi tuỳ chọn: use_lockfile, mã hoá, workspace, quyền IAM cần có.')}
${tl('https://developer.hashicorp.com/terraform/language/manage-sensitive-data', '🔐', 'Quản lý dữ liệu nhạy cảm', 'sensitive, giá trị ephemeral, tham số write-only — khi nào cái nào giúp được.')}

<h3>Nguồn</h3>
<ul>
  <li>Dữ liệu nhạy cảm trong state: <a href="https://developer.hashicorp.com/terraform/language/state/sensitive-data" target="_blank" rel="noopener">developer.hashicorp.com/…/state/sensitive-data</a> · write-only: <a href="https://developer.hashicorp.com/terraform/language/manage-sensitive-data/write-only" target="_blank" rel="noopener">…/write-only</a> · ephemeral: <a href="https://developer.hashicorp.com/terraform/language/manage-sensitive-data/ephemeral" target="_blank" rel="noopener">…/ephemeral</a></li>
  <li>Sinh cấu hình khi import: <a href="https://developer.hashicorp.com/terraform/language/import/generating-configuration" target="_blank" rel="noopener">developer.hashicorp.com/…/generating-configuration</a> · đổi cấu trúc bằng moved: <a href="https://developer.hashicorp.com/terraform/language/modules/develop/refactoring" target="_blank" rel="noopener">…/refactoring</a></li>
  <li>Refresh-only: <a href="https://developer.hashicorp.com/terraform/tutorials/state/refresh" target="_blank" rel="noopener">developer.hashicorp.com/…/tutorials/state/refresh</a></li>
  <li>Pentest Partners, 8/2026: <a href="https://www.pentestpartners.com/security-blog/breaking-the-attack-chain-created-by-exposed-cloud-secrets/" target="_blank" rel="noopener">pentestpartners.com</a></li>
</ul>
</div>
`;
/* ═════ 11.5 — Lab chương 11 + câu hỏi phỏng vấn ═════ */
const L115_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab</span>
<h2>11.5 — Chapter 11 lab: LabFlow's network, storage and table in Terraform</h2>
<p class="lead">You write the Terraform for LabFlow's dev environment — a two-AZ VPC from your own module, a safe photo bucket, a bookings table with TTL and point-in-time recovery — with the state in S3 behind a lock. A grader checks <strong>what really exists</strong> through the AWS CLI and how Terraform behaves, not how your files look. The hasty version is graded first so you can see what "it works on my laptop" misses.</p>

<h3>The assignment</h3>
<ol>
  <li>State in <code>s3://labflow-tfstate-lab</code>, key <code>labflow/lab/terraform.tfstate</code>, S3-native locking; the state bucket has versioning.</li>
  <li>VPC <code>10.40.0.0/16</code> with one public and one private subnet in each of 2 AZs (reuse the module of Lesson 11.3).</li>
  <li>Photo bucket <code>labflow-anh-lab</code>: versioning on, encryption, Block Public Access.</li>
  <li>Every resource tagged <code>Project = labflow</code> and <code>Env = dev</code> without repeating tags on each resource.</li>
  <li>Table <code>labflow-datlich-lab</code>: on-demand, key <code>pk</code> + <code>sk</code>, TTL on <code>hetHan</code>, point-in-time recovery.</li>
  <li>A variable <code>env</code> that accepts only <code>dev</code> or <code>prod</code>, with a clear error message.</li>
  <li>After apply, a second plan shows no changes.</li>
</ol>
<p>Provider for the lab (LocalStack; on AWS remove the keys and endpoints) — note <code>Env = var.env</code> in the default tags:</p>
${MA_PROVIDER_LAB}

<h3>The grader — 8 checks</h3>
${MA_L_CHAM}
<ul>
  <li>Checks 1–7 ask AWS (here LocalStack) what exists, exactly as an auditor would. Check 8 asks Terraform: <code>plan -detailed-exitcode</code> must exit 0, and <code>env=production</code> must fail with your message — a missing variable also fails, but not with that message, so it does not count.</li>
</ul>

<h3>Step 1 — the hasty version, graded</h3>
${MA_VOI_MAIN}
${OUT_115_VOI}
<ul>
  <li>It applies cleanly, and only one check passes — the one AWS helps with: new buckets are encrypted with SSE-S3 by default (since January 2023), so versioning was the only part the author had to remember.</li>
  <li>Local state, one subnet in an AZ chosen by AWS, a provisioned table without sort key, no TTL, no tags, no guard on <code>env</code>: each is a problem you met in this chapter.</li>
</ul>

<h3>Step 2 — your fix, then the solution</h3>
<p>Try it yourself first. Then open the solution.</p>
${giai('Solution (open after you tried)', `${MA_L_TRUOC}
${MA_GIAI_BACKEND}
${MA_GIAI_VARIABLES}
${MA_GIAI_MAIN}
<p>The module <code>modules/mang</code> is the one from Lesson 11.3, unchanged.</p>
${OUT_115_GIAI}`)}

<h3>Step 3 — clean up, and prove nothing is left</h3>
${MA_L_DON}
${MA_L_CONGI}
${OUT_115_DON}
<p>Destroy first (it needs the state), the state bucket last, with all its versions. Five zeros.</p>

<h3>What it would cost on AWS (Singapore, November 2026)</h3>
<ul>
  <li>VPC, subnets, route tables, internet gateway: free. Terraform itself: free.</li>
  <li>S3 (photos + a few KB of state): 0.025 USD per GB-month — cents at lab size.</li>
  <li>DynamoDB on-demand: pay per request, almost nothing when idle; point-in-time recovery is billed per GB of table size.</li>
  <li>The expensive switch is NAT: one NAT gateway is 0.059 USD per hour ≈ 43 USD per month plus 0.059 USD per GB (Lesson 3.4). That is why the module keeps it behind <code>bat_nat</code>, off in dev.</li>
  <li>Lab done ⇒ <code>bash don.sh</code> and <code>bash con-gi.sh</code>, every time.</li>
</ul>

<h3>🎤 Interviewers will ask (Infrastructure as Code)</h3>
<ul>
  <li><strong>"Walk me through how a Terraform change reaches production."</strong> — Branch, edit, <code>fmt</code>/<code>validate</code>, PR with the plan as a comment, review (especially every destroy/replace), merge, apply the reviewed plan to dev, then the same commit to prod with an approval step (Chapter 12). Never apply from a laptop to prod.</li>
  <li><strong>"What happens if you lose the state?"</strong> — Terraform no longer knows it owns the resources: plan wants to create everything again (name clashes, duplicates). Restore a previous version from the versioned bucket; as a last resort import every resource. That is why the state bucket has versioning and is deleted last.</li>
  <li><strong>"Two engineers apply at the same time?"</strong> — The lock: the second gets "Error acquiring the state lock" with the holder's info. Explain when force-unlock is acceptable.</li>
  <li><strong>"Someone changed a security group in the console during an incident."</strong> — Drift: refresh-only plan shows it; decide revert or codify within the day; nightly detailed-exitcode catches the rest.</li>
  <li><strong>"How do you keep secrets out of Terraform?"</strong> — No keys in providers (roles/OIDC), AWS-managed passwords (manage_master_user_password), write-only arguments, apps read Secrets Manager at runtime; state encrypted and access-controlled anyway.</li>
</ul>

<h3>🗂 Terms</h3>
<div class="kv-grid">
  <div><b>Bootstrap</b><span>Creating the state bucket before the configuration that uses it.</span></div>
  <div><b>-detailed-exitcode</b><span>0 = no changes, 2 = changes, 1 = error: the drift/no-change test.</span></div>
  <div><b>point_in_time_recovery</b><span>DynamoDB continuous backups (restore to any second in the window).</span></div>
  <div><b>ttl</b><span>DynamoDB deletes items whose time attribute is in the past.</span></div>
  <div><b>SSE-S3</b><span>S3-managed encryption, on by default for new objects since 2023.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Graded on reality: hasty 1/8, solution 8/8, clean-up five zeros.</li>
  <li>Module reuse, default tags with a variable, validation, remote state with lock — all in one small config.</li>
  <li>Defaults that save you (S3 encryption, Block Public Access) do not replace the settings only you know (TTL, PITR, keys, tags).</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/introduction.html', '🏗️', 'AWS Prescriptive Guidance — Terraform AWS provider best practices', 'Security, backends, code structure and CI from AWS itself.')}
${tl('https://developer.hashicorp.com/terraform/tutorials/aws-get-started', '🧭', 'Terraform — Get started on AWS', 'Repeat the lab on a real account (Free Tier, then destroy).')}

<h3>Sources</h3>
<ul>
  <li>S3 default encryption for new objects (2023): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/…/default-encryption-faq.html</a></li>
  <li>DynamoDB TTL: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/…/TTL.html</a> · point-in-time recovery: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Point-in-time-recovery.html" target="_blank" rel="noopener">…/Point-in-time-recovery.html</a></li>
  <li>S3 backend: <a href="https://developer.hashicorp.com/terraform/language/backend/s3" target="_blank" rel="noopener">developer.hashicorp.com/…/backend/s3</a></li>
</ul>
</div>
`;
const L115_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab</span>
<h2>11.5 — Lab chương 11: mạng, kho lưu và bảng của LabFlow bằng Terraform</h2>
<p class="lead">Bạn viết Terraform cho môi trường dev của LabFlow — một VPC hai AZ từ module của chính bạn, một bucket ảnh an toàn, một bảng đặt lịch có TTL và point-in-time recovery — với state nằm trong S3 sau một ổ khoá. Bộ chấm kiểm <strong>thứ đang thật sự tồn tại</strong> qua AWS CLI và cách Terraform hành xử, chứ không nhìn tệp của bạn trông ra sao. Bản vội được chấm trước để bạn thấy "máy em chạy được mà" bỏ sót những gì.</p>

<h3>Đề bài</h3>
<ol>
  <li>State ở <code>s3://labflow-tfstate-lab</code>, key <code>labflow/lab/terraform.tfstate</code>, khoá gốc của S3; bucket state bật versioning.</li>
  <li>VPC <code>10.40.0.0/16</code> có một subnet public và một subnet private ở mỗi AZ trong 2 AZ (dùng lại module của bài 11.3).</li>
  <li>Bucket ảnh <code>labflow-anh-lab</code>: bật versioning, mã hoá, Block Public Access.</li>
  <li>Mọi tài nguyên có tag <code>Project = labflow</code> và <code>Env = dev</code> mà không phải lặp tag ở từng tài nguyên.</li>
  <li>Bảng <code>labflow-datlich-lab</code>: on-demand, khoá <code>pk</code> + <code>sk</code>, TTL trên <code>hetHan</code>, point-in-time recovery.</li>
  <li>Biến <code>env</code> chỉ nhận <code>dev</code> hoặc <code>prod</code>, kèm thông báo lỗi rõ ràng.</li>
  <li>Sau apply, plan lần hai không còn thay đổi nào.</li>
</ol>
<p>Provider của lab (LocalStack; trên AWS bỏ khoá và endpoint) — để ý <code>Env = var.env</code> trong tag mặc định:</p>
${MA_PROVIDER_LAB}

<h3>Bộ chấm — 8 phép</h3>
${MA_L_CHAM}
<ul>
  <li>Phép 1–7 hỏi AWS (ở đây là LocalStack) đang có gì, đúng như một người kiểm toán. Phép 8 hỏi Terraform: <code>plan -detailed-exitcode</code> phải thoát 0, và <code>env=production</code> phải hỏng kèm thông báo của bạn — thiếu biến cũng hỏng, nhưng không ra thông báo đó, nên không được tính.</li>
</ul>

<h3>Bước 1 — bản vội, chấm điểm</h3>
${MA_VOI_MAIN}
${OUT_115_VOI}
<ul>
  <li>Nó apply sạch sẽ, và chỉ qua một phép — đúng phép AWS giúp hộ: bucket mới được mã hoá SSE-S3 mặc định (từ tháng 1/2023), nên versioning là phần duy nhất người viết phải tự nhớ.</li>
  <li>State cục bộ, một subnet ở AZ do AWS chọn, bảng provisioned không sort key, không TTL, không tag, không chặn <code>env</code>: mỗi cái là một vấn đề bạn đã gặp trong chương này.</li>
</ul>

<h3>Bước 2 — bạn sửa, rồi xem lời giải</h3>
<p>Tự làm trước đã. Rồi mới mở lời giải.</p>
${giai('Lời giải (mở sau khi đã thử)', `${MA_L_TRUOC}
${MA_GIAI_BACKEND}
${MA_GIAI_VARIABLES}
${MA_GIAI_MAIN}
<p>Module <code>modules/mang</code> chính là module của bài 11.3, giữ nguyên.</p>
${OUT_115_GIAI}`)}

<h3>Bước 3 — dọn, và chứng minh không còn gì</h3>
${MA_L_DON}
${MA_L_CONGI}
${OUT_115_DON}
<p>Destroy trước (nó cần state), bucket state sau cùng, cùng mọi phiên bản của nó. Năm số 0.</p>

<h3>Trên AWS sẽ tốn bao nhiêu (Singapore, tháng 11/2026)</h3>
<ul>
  <li>VPC, subnet, route table, internet gateway: miễn phí. Bản thân Terraform: miễn phí.</li>
  <li>S3 (ảnh + vài KB state): 0,025 USD mỗi GB-tháng — vài xu ở cỡ lab.</li>
  <li>DynamoDB on-demand: trả theo yêu cầu, gần như bằng 0 khi không ai dùng; point-in-time recovery tính theo GB kích thước bảng.</li>
  <li>Công tắc đắt là NAT: một NAT gateway 0,059 USD mỗi giờ ≈ 43 USD mỗi tháng, cộng 0,059 USD mỗi GB (bài 3.4). Vì vậy module giữ nó sau biến <code>bat_nat</code>, tắt ở dev.</li>
  <li>Xong lab ⇒ <code>bash don.sh</code> và <code>bash con-gi.sh</code>, lần nào cũng vậy.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi (Infrastructure as Code)</h3>
<ul>
  <li><strong>"Kể quy trình một thay đổi Terraform đi tới production."</strong> — Tạo nhánh, sửa, <code>fmt</code>/<code>validate</code>, PR kèm plan làm bình luận, soát (nhất là mọi dòng xoá/thay mới), merge, apply bản plan đã soát cho dev, rồi cùng commit đó cho prod qua một bước duyệt (chương 12). Không bao giờ apply từ laptop vào prod.</li>
  <li><strong>"Mất state thì sao?"</strong> — Terraform không còn biết mình sở hữu các tài nguyên: plan muốn tạo lại mọi thứ (trùng tên, nhân đôi). Khôi phục bản trước từ bucket có versioning; đường cuối là import từng tài nguyên. Vì vậy bucket state có versioning và bị xoá sau cùng.</li>
  <li><strong>"Hai kỹ sư apply cùng lúc?"</strong> — Khoá: người thứ hai nhận "Error acquiring the state lock" kèm thông tin bên đang giữ. Giải thích khi nào force-unlock là chấp nhận được.</li>
  <li><strong>"Có người sửa security group trên console lúc xử lý sự cố."</strong> — Drift: plan refresh-only cho thấy nó; trong ngày quyết định trả lại hay đưa vào mã; plan detailed-exitcode hằng đêm bắt phần còn lại.</li>
  <li><strong>"Giữ bí mật ngoài Terraform thế nào?"</strong> — Không có khoá trong provider (role/OIDC), mật khẩu do AWS quản lý (manage_master_user_password), tham số write-only, ứng dụng tự đọc Secrets Manager lúc chạy; và dù vậy state vẫn phải mã hoá, giới hạn quyền.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div><b>Bootstrap</b><span>Tạo bucket state trước cấu hình dùng nó.</span></div>
  <div><b>-detailed-exitcode</b><span>0 = không đổi, 2 = có đổi, 1 = lỗi: phép thử drift/không đổi.</span></div>
  <div><b>point_in_time_recovery</b><span>Sao lưu liên tục của DynamoDB (khôi phục về bất kỳ giây nào trong cửa sổ).</span></div>
  <div><b>ttl</b><span>DynamoDB tự xoá mục có thuộc tính thời gian đã qua.</span></div>
  <div><b>SSE-S3</b><span>Mã hoá do S3 quản lý, mặc định bật cho đối tượng mới từ 2023.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chấm theo thực tế: bản vội 1/8, lời giải 8/8, dọn còn năm số 0.</li>
  <li>Dùng lại module, tag mặc định lấy từ biến, validation, state từ xa có khoá — gói trong một cấu hình nhỏ.</li>
  <li>Mặc định cứu bạn (mã hoá S3, Block Public Access) không thay được những thiết lập chỉ bạn biết (TTL, PITR, khoá, tag).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/introduction.html', '🏗️', 'AWS Prescriptive Guidance — thực hành tốt với provider Terraform AWS', 'Bảo mật, backend, cấu trúc mã và CI, do chính AWS viết.')}
${tl('https://developer.hashicorp.com/terraform/tutorials/aws-get-started', '🧭', 'Terraform — Get started on AWS', 'Làm lại lab trên tài khoản thật (Free Tier, rồi destroy).')}

<h3>Nguồn</h3>
<ul>
  <li>S3 mặc định mã hoá đối tượng mới (2023): <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html" target="_blank" rel="noopener">docs.aws.amazon.com/AmazonS3/…/default-encryption-faq.html</a></li>
  <li>DynamoDB TTL: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html" target="_blank" rel="noopener">docs.aws.amazon.com/amazondynamodb/…/TTL.html</a> · point-in-time recovery: <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Point-in-time-recovery.html" target="_blank" rel="noopener">…/Point-in-time-recovery.html</a></li>
  <li>Backend S3: <a href="https://developer.hashicorp.com/terraform/language/backend/s3" target="_blank" rel="noopener">developer.hashicorp.com/…/backend/s3</a></li>
</ul>
</div>
`;
/* ═════ 11.6 — Quiz + export ═════ */
// Viết đáp án đúng ở vị trí 1 cho dễ soát, rồi đặt lại vị trí theo XEP để đáp án không lộ quy luật.
const XEP = [3, 1, 0, 2, 1, 3, 0, 2, 3, 0];
let qi = 0;
const Q = (question, options, correctIndex) => {
  const t = XEP[qi++ % XEP.length], opts = [...options], [dung] = opts.splice(correctIndex, 1);
  opts.splice(t, 0, dung);
  return { question, options: opts, correctIndex: t, points: 1 };
};
const QUIZ11 = [
  Q('Staging was rebuilt by hand "from memory" and every command succeeded. What did the comparison table show?|||Staging được dựng tay "theo trí nhớ" và lệnh nào cũng thành công. Bảng so sánh cho thấy gì?', [
    'Several settings differed from dev (versioning, visibility timeout, table billing and key)|||Nhiều thiết lập lệch dev (versioning, visibility timeout, kiểu tính tiền và khoá của bảng)',
    'Both environments were identical because the commands succeeded|||Hai môi trường giống hệt vì lệnh đều thành công',
    'Only the bucket name differed|||Chỉ khác tên bucket',
    'Staging had more security than dev|||Staging bảo mật hơn dev',
  ], 0),
  Q('Why was "block public access" True in the hand-built staging bucket too?|||Vì sao "block public access" ở bucket staging dựng tay cũng là True?',
    ['AWS enables it by default for new buckets since April 2023|||AWS tự bật cho bucket mới từ tháng 4/2023',
      'The teammate remembered to set it|||Đồng nghiệp nhớ bật',
      'Terraform set it in the background|||Terraform bật ngầm',
      'LocalStack ignores the setting|||LocalStack bỏ qua thiết lập này',
    ], 0),
  Q('After terraform init you commit .terraform.lock.hcl. What does it guarantee?|||Sau terraform init bạn commit .terraform.lock.hcl. Nó bảo đảm điều gì?', [
    'Everyone and CI install the same provider version, verified by checksums|||Mọi người và CI cài cùng phiên bản provider, kiểm bằng checksum',
    'The state cannot be changed by two people|||State không bị hai người cùng sửa',
    'Terraform will always use the newest provider|||Terraform luôn dùng provider mới nhất',
    'The .terraform folder can be deleted safely|||Có thể xoá thư mục .terraform an toàn',
  ], 0),
  Q('In the plan, redrive_policy of the main queue was "(known after apply)". Why?|||Trong plan, redrive_policy của hàng đợi chính là "(known after apply)". Vì sao?', [
    'It contains the ARN of the dead-letter queue, which does not exist yet|||Nó chứa ARN của dead-letter queue, thứ chưa tồn tại',
    'LocalStack does not support redrive policies|||LocalStack không hỗ trợ redrive policy',
    'The value is sensitive|||Giá trị đó nhạy cảm',
    'The provider forgot to read it|||Provider quên đọc nó',
  ], 0),
  Q('Renaming the SQS queue in code produced "-/+ … forces replacement". What happens on apply?|||Đổi tên hàng đợi SQS trong mã cho ra "-/+ … forces replacement". Apply sẽ làm gì?', [
    'The old queue is deleted and a new one created — waiting messages and the URL are lost|||Hàng đợi cũ bị xoá và tạo cái mới — tin đang chờ và URL mất',
    'The queue is renamed in place, nothing is lost|||Hàng đợi được đổi tên tại chỗ, không mất gì',
    'Terraform refuses to apply|||Terraform từ chối apply',
    'Only the tag changes|||Chỉ tag thay đổi',
  ], 0),
  Q('With count over ["anh","email","bao-cao"], you remove "anh". What did the real plan show?|||Dùng count trên ["anh","email","bao-cao"], bạn bỏ "anh". Plan thật cho thấy gì?', [
    'Queues 0 and 1 replaced (names shift) and queue 2 destroyed|||Hàng đợi 0 và 1 bị thay mới (tên bị dồn) và hàng đợi 2 bị xoá',
    'Only the "anh" queue destroyed|||Chỉ hàng đợi "anh" bị xoá',
    'No changes, because count is stable|||Không đổi gì, vì count ổn định',
    'All three queues destroyed and none created|||Cả ba hàng đợi bị xoá và không tạo cái nào',
  ], 0),
  Q('terraform plan -var env=production failed before any resource was planned. What stopped it?|||terraform plan -var env=production hỏng trước khi plan bất kỳ tài nguyên nào. Cái gì đã chặn nó?', [
    'The validation rule on variable env|||Luật validation của biến env',
    'An AWS permission error|||Lỗi quyền của AWS',
    'The lock on the state|||Khoá của state',
    'The module had no provider|||Module không có provider',
  ], 0),
  Q('output "mat_khau" has sensitive = true. Where can the password still be read?|||output "mat_khau" có sensitive = true. Mật khẩu vẫn đọc được ở đâu?', [
    'In plain text in the state file|||Ở dạng chữ thường trong tệp state',
    'Nowhere: sensitive encrypts it|||Không ở đâu: sensitive mã hoá nó',
    'Only in the plan output|||Chỉ trong output của plan',
    'Only in CloudTrail|||Chỉ trong CloudTrail',
  ], 0),
  Q('A second apply ran while the first held the S3 lock. What did S3 answer?|||Lần apply thứ hai chạy khi lần đầu đang giữ khoá S3. S3 trả lời gì?', [
    '412 PreconditionFailed on the conditional write of the .tflock object|||412 PreconditionFailed cho lệnh ghi có điều kiện đối tượng .tflock',
    '404 NoSuchKey|||404 NoSuchKey',
    '403 AccessDenied|||403 AccessDenied',
    '200 OK, and the second apply overwrote the first|||200 OK, và lần apply thứ hai ghi đè lần đầu',
  ], 0),
  Q('Someone suspended versioning in the console. Which command only reports this, changing nothing?|||Có người tạm dừng versioning trên console. Lệnh nào chỉ báo điều đó mà không đổi gì?', [
    'terraform plan -refresh-only|||terraform plan -refresh-only',
    'terraform apply -auto-approve|||terraform apply -auto-approve',
    'terraform state rm|||terraform state rm',
    'terraform force-unlock|||terraform force-unlock',
  ], 0),
];

export default {
  title: 'Chapter 11 — Infrastructure as code with Terraform|||Chương 11 — Hạ tầng dưới dạng mã với Terraform',
  description: 'Terraform chạy thật trên LocalStack: dựng tay hai môi trường lệch nhau 4/5 thiết lập rồi dựng lại bằng một tệp, so CloudFormation và OpenTofu (Toyota 2023, Knight Capital 2012); vòng đời init/plan/apply/destroy, tệp khoá provider (khoá GPG HashiCorp lộ 2021), đồ thị phụ thuộc, sửa tại chỗ và thay mới; module VPC dùng cho dev/prod, validation, count vs for_each, module cộng đồng (ua-parser-js 2021); state chứa mật khẩu, write-only, backend S3 + khoá 412, drift, import, moved (Pentest Partners 2026); lab chấm 8 phép.',
  lessons: [
    {
      title: '11.1 — Why click-ops does not scale|||11.1 — Vì sao bấm tay không mở rộng được',
      slug: 'aws-11-1-vi-sao',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng tay dev rồi staging theo trí nhớ: lệch 4/5 thiết lập, hàng đợi thử sống sót sau khi dọn; cùng cụm bằng một tệp Terraform cho hai workspace giống hệt, dọn một lệnh; IaC khai báo, plan, git, quét được; bảng Terraform/OpenTofu/CloudFormation/CDK + chạy thử CloudFormation và OpenTofu; Toyota 2023, Knight Capital 2012.',
      content: L111_EN + L111_VI,
    },
    {
      title: '11.2 — Terraform basics on AWS: init, plan, apply, destroy|||11.2 — Terraform cơ bản trên AWS: init, plan, apply, destroy',
      slug: 'aws-11-2-terraform',
      type: 'LESSON',
      isFreePreview: true,
      description: 'required_providers và provider trỏ LocalStack, xác thực không khoá trong mã; resource, data source, output; fmt/validate bắt lỗi; tệp khoá 6.73.0 + checksum; đọc plan (known after apply, mặc định ẩn 256 KiB); apply theo đồ thị, song song; No changes; sửa tại chỗ và forces replacement; destroy ngược thứ tự; khoá GPG HashiCorp lộ qua Codecov 2021.',
      content: L112_EN + L112_VI,
    },
    {
      title: '11.3 — Variables, outputs and modules|||11.3 — Biến, output và module',
      slug: 'aws-11-3-bien-module',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Module mạng tự viết (variables, locals, cidrsubnet, for_each theo AZ, outputs) gọi cho dev 2 AZ (9 tài nguyên) và prod 3 AZ (12); validation chặn env sai; bớt một AZ chỉ xoá 3 thứ; count dồn vị trí làm thay mới 2 hàng đợi so với for_each; module cộng đồng terraform-aws-modules/vpc 6.8.0 (17 tài nguyên); ghim phiên bản, ua-parser-js 2021.',
      content: L113_EN + L113_VI,
    },
    {
      title: '11.4 — State: S3 backend, locking and drift|||11.4 — State: backend S3, khoá và lệch cấu hình',
      slug: 'aws-11-4-state',
      type: 'LESSON',
      isFreePreview: true,
      description: 'State chứa gì; sensitive chỉ giấu trên màn hình — mật khẩu nằm chữ thường trong state; ephemeral + write-only (1.11) gỡ nó ra; backend S3 có versioning, migrate-state; hai apply cùng lúc ⇒ 412 + Lock Info; drift do sửa tay (refresh-only, trả lại); import + sinh cấu hình phải dọn; moved đổi tên không xoá; dọn bucket nhiều phiên bản; Pentest Partners 2026.',
      content: L114_EN + L114_VI,
    },
    {
      title: '11.5 — Chapter 11 lab + interview questions|||11.5 — Lab chương 11 + câu hỏi phỏng vấn',
      slug: 'aws-11-5-lab-11',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Terraform cho dev của LabFlow: state S3 có khoá, VPC 2 AZ từ module, bucket ảnh an toàn, bảng on-demand có TTL + PITR, tag Env từ biến, validation; bộ chấm 8 phép đọc thực tế + hành vi plan; bản vội 1/8 ⇒ lời giải 8/8 ⇒ dọn ⇒ năm số 0; giá tháng (NAT là công tắc đắt); năm câu phỏng vấn IaC.',
      content: L115_EN + L115_VI,
    },
    {
      title: '11.6 — Chapter 11 quiz|||11.6 — Kiểm tra Chương 11',
      slug: 'aws-11-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu từ các output đã chạy trong chương 11.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ11 },
    },
  ],
};
