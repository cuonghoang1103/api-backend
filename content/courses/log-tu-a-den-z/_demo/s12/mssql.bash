# 12.4 phần SQL Server 2022 — chạy: MAC=mssql python3 cong-cu/chay-ct.py mssql.bash (sau cong-cu/dung-mssql.bash). Chạy trong lgz-mssql.
# sqlcmd = /opt/mssql-tools18/bin/sqlcmd (-C tin chứng chỉ tự ký, -I bật QUOTED_IDENTIFIER).
@host docker logs lgz-mssql 2>&1 | grep -E 'Microsoft SQL Server 2022|Logging SQL Server messages in file' | cut -c1-160
ls -l /var/opt/mssql/log/ | grep -iE 'errorlog|\.xel' | head -5
export PATH=$PATH:/opt/mssql-tools18/bin; sqlcmd -C -S 127.0.0.1 -U app -P sai-roi -Q 'SELECT 1'
export PATH=$PATH:/opt/mssql-tools18/bin; sqlcmd -C -S 127.0.0.1 -U khongco -P abc -Q 'SELECT 1'
export PATH=$PATH:/opt/mssql-tools18/bin; sqlcmd -C -S 127.0.0.1 -U app -P 'App-Lab-2026!' -d shopp -Q 'SELECT 1'
export PATH=$PATH:/opt/mssql-tools18/bin; sqlcmd -C -S 127.0.0.1 -U intern -P 'Intern-Lab-2026!' -Q 'SELECT 1'
!sleep 2
grep -A1 -E 'Error: 18(456|470)' /var/opt/mssql/log/errorlog | grep -v '^--' | cut -c1-200
grep -oE 'Error: 18[0-9]+, Severity: 14, State: [0-9]+' /var/opt/mssql/log/errorlog | sort | uniq -c
export PATH=$PATH:/opt/mssql-tools18/bin; sqlcmd -C -I -S 127.0.0.1 -U sa -P 'Sa-Lab-2026!' -W -s ' | ' -Q "SET NOCOUNT ON; DECLARE @t TABLE (LogDate datetime, ProcessInfo nvarchar(50), Text nvarchar(max)); INSERT @t EXEC sp_readerrorlog 0, 1, N'Login failed'; SELECT CONVERT(char(19), LogDate, 120) AS LogDate, ProcessInfo, LEFT(Text, 110) AS Text FROM @t"
export PATH=$PATH:/opt/mssql-tools18/bin; sqlcmd -C -I -S 127.0.0.1 -U sa -P 'Sa-Lab-2026!' -W -Q "SET NOCOUNT ON; SELECT name, CASE WHEN is_disabled = 1 THEN 'disabled' ELSE 'enabled' END AS trang_thai FROM sys.server_principals WHERE name IN ('app','intern')"
