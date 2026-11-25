# 16.4 — kho log bất biến: MinIO (RELEASE.2026-11-16) Object Lock chế độ COMPLIANCE + tài khoản chỉ-được-ghi (cwd = _demo/s16/worm; BASH_ENV=cong-cu/env.bash)
docker run -d --name lgz-c16-minio --network none -e MINIO_ROOT_USER=quan-tri -e MINIO_ROOT_PASSWORD=lab16-chi-o-may-minh cgr.dev/chainguard/minio:latest server /data >/dev/null; sleep 4
mc alias set lab http://127.0.0.1:9000 quan-tri lab16-chi-o-may-minh >/dev/null && mc mb --with-lock lab/log-luu-tru
mc retention set --default COMPLIANCE 30d lab/log-luu-tru
mc admin policy create lab chi-ghi-log chi-ghi.json && mc admin user add lab may16-alloy GhiLog-lab16-xyz >/dev/null && mc admin policy attach lab chi-ghi-log --user may16-alloy | tail -1
mc alias set ghi http://127.0.0.1:9000 may16-alloy GhiLog-lab16-xyz >/dev/null; echo '2026-11-24T09:43:39 may16 sudo: an : 1 incorrect password attempt' > auth-20261124.log; mc cp --json auth-20261124.log ghi/log-luu-tru/may16/ | jq -c "select(.target) | {status, target, size}"
mc cat ghi/log-luu-tru/may16/auth-20261124.log
mc rm ghi/log-luu-tru/may16/auth-20261124.log
mc retention info lab/log-luu-tru/may16/auth-20261124.log
mc rm lab/log-luu-tru/may16/auth-20261124.log; mc ls --versions lab/log-luu-tru/may16/
mc rm --version-id "$(mc ls --json --versions lab/log-luu-tru/may16/ | jq -r 'select(.isDeleteMarker|not) | .versionId')" lab/log-luu-tru/may16/auth-20261124.log
mc retention clear lab/log-luu-tru/may16/auth-20261124.log --version-id "$(mc ls --json --versions lab/log-luu-tru/may16/ | jq -r 'select(.isDeleteMarker|not) | .versionId')"
docker rm -f lgz-c16-minio >/dev/null; rm -f auth-20261124.log
