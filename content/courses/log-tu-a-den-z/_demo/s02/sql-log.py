# sql-log.py — nạp access log vào SQLite (có sẵn trong Python) rồi hỏi bằng SQL. Chạy trong thư mục log-lab.
import re, sqlite3
mau = re.compile(r'(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d{3}) (\d+) "[^"]*" "([^"]*)"')
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE req (ip TEXT, t TEXT, method TEXT, url TEXT, status INT, bytes INT, ua TEXT)")
with open("web/access.log", encoding="utf-8") as f:
    rows = [m.groups() for m in map(mau.match, f) if m]
db.executemany("INSERT INTO req VALUES (?,?,?,?,?,?,?)", rows)
def hoi(sql):
    print("sql>", sql)
    for r in db.execute(sql): print("    " + " | ".join(map(str, r)))
hoi("SELECT count(*) FROM req")
hoi("SELECT status, count(*) AS n FROM req GROUP BY status ORDER BY n DESC")
hoi("SELECT substr(t, 13, 5) AS phut, count(*) AS n, sum(status >= 500) AS loi FROM req WHERE t LIKE '20/Nov/2026:14:0%' GROUP BY phut ORDER BY phut")
hoi("SELECT ip, count(*) AS n, min(substr(t, 13, 8)), max(substr(t, 13, 8)) FROM req WHERE status = 401 GROUP BY ip")
