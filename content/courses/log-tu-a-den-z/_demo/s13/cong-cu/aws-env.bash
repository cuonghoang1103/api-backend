# BASH_ENV cho cloud.bash: "aws" = AWS CLI 2.32.0 (ảnh amazon/aws-cli) gọi vào moto 5.1.18 (giả lập AWS cục bộ) trên mạng lgz-c13a.
# Khoá "lab/lab" là giả — moto không kiểm. Trên tài khoản AWS thật: bỏ --endpoint-url, dùng hồ sơ SSO của công ty.
aws() { docker run --rm -i --network lgz-c13a -e AWS_ACCESS_KEY_ID=lab -e AWS_SECRET_ACCESS_KEY=lab -e AWS_DEFAULT_REGION=ap-southeast-1 amazon/aws-cli:2.32.0 --endpoint-url http://lgz-moto:5000 "$@"; }
