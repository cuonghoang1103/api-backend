#!/usr/bin/env bash
# dung-mssql.bash — SQL Server 2022 (mcr.microsoft.com/mssql/server:2022-latest, bản Developer) cho 12.4. --network none, sqlcmd trong container.
set -euo pipefail
docker rm -f -v lgz-mssql >/dev/null 2>&1 || true
docker run -d --name lgz-mssql --label lgz=c12 --network none --memory 2g --memory-swap 2g --cpus 2 \
  -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='Sa-Lab-2026!' -e MSSQL_PID=Developer -e TZ=Asia/Ho_Chi_Minh mcr.microsoft.com/mssql/server:2022-latest >/dev/null
for i in $(seq 120); do docker logs lgz-mssql 2>&1 | grep -q 'Recovery is complete' && break; sleep 2; done
SQ="/opt/mssql-tools18/bin/sqlcmd -C -I -S 127.0.0.1 -U sa -P Sa-Lab-2026!"
docker exec lgz-mssql $SQ -b -Q "CREATE DATABASE shop; CREATE LOGIN app WITH PASSWORD = 'App-Lab-2026!', DEFAULT_DATABASE = shop, CHECK_POLICY = OFF; CREATE LOGIN intern WITH PASSWORD = 'Intern-Lab-2026!', CHECK_POLICY = OFF; ALTER LOGIN intern DISABLE;" >/dev/null
docker exec lgz-mssql $SQ -b -d shop -Q "CREATE USER app FOR LOGIN app;" >/dev/null
echo "lgz-mssql sẵn sàng"
