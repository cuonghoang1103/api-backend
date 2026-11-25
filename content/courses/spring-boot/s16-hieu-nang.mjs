/**
 * spring-boot/s16-hieu-nang.mjs — Chương 16: Hiệu năng và đo tải — HikariCP, virtual thread, k6 + JFR, so với Node.js (soạn 24–25/11/2026, agent sb).
 * Mọi output là chạy thật trên máy nhà: LabFlow (Spring Boot 4.1.2, HikariCP, Tomcat; Java 21 và Java 25) + PostgreSQL 16 (2 CPU) + Redis 7,
 * k6 2.4.0 đo tải trong cùng network namespace, Node.js 22 + pg 8.23.1 để so sánh. Mã: scratchpad/sb/lab/c16/{labflow, k6, node, t (lệnh đo), lab16 (lời giải + bẫy + bộ chấm)}.
 * Output: ~/.rtq-sb/ch16/o (bản hiển thị ở o/web, lọc bằng lab/c16/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s16/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 16.1 =====
const MA161_K6 = js("// tai.js — một endpoint, hai kiểu tải. Biến: P=đường dẫn, VUS, DUR, RATE (có RATE ⇒ mô hình MỞ: đều RATE request/giây dù server chậm), TO=timeout\nimport http from 'k6/http';\nconst mo = !!__ENV.RATE;\nexport const options = {\n  discardResponseBodies: true,\n  summaryTrendStats: ['avg', 'p(50)', 'p(95)', 'p(99)', 'max'],\n  scenarios: {\n    tai: mo\n      ? { executor: 'constant-arrival-rate', rate: +__ENV.RATE, timeUnit: '1s', duration: __ENV.DUR || '20s',\n          preAllocatedVUs: +(__ENV.VUS || 100), maxVUs: +(__ENV.MAXVUS || 2000) }\n      : { executor: 'constant-vus', vus: +(__ENV.VUS || 50), duration: __ENV.DUR || '20s' },\n  },\n};\nexport default function () {\n  http.get(`http://localhost:${__ENV.PORT || 8080}${__ENV.P}`, { timeout: __ENV.TO || '60s' });\n}\n// in MỘT dòng tóm tắt (bản đầy đủ của k6 ở bài 16.3)\nexport function handleSummary(d) {\n  const t = d.metrics.http_req_duration.values, n = d.metrics.http_reqs.values, f = d.metrics.http_req_failed.values;\n  const rot = d.metrics.dropped_iterations ? `  bỏ lỡ ${d.metrics.dropped_iterations.values.count}` : '';\n  const ms = (x) => (x >= 10 ? x.toFixed(0) : x.toFixed(1)).padStart(5);\n  return { stdout: `${(__ENV.TEN || '').padEnd(18)} ${String(n.count).padStart(6)} req ${n.rate.toFixed(1).padStart(7)} req/s  lỗi ${(f.rate * 100).toFixed(1).padStart(5)}%  p50 ${ms(t['p(50)'])}  p95 ${ms(t['p(95)'])}  p99 ${ms(t['p(99)'])}  max ${ms(t.max)} ms${rot}\\n` };\n}");
const MA161_HAM = bash("# ham.sh — hai hàm gọi k6 và một hàm đọc số đo của Hikari\n# tai <tên> <đường dẫn> [VUS] [DUR] [biến k6 khác…]: một lượt đo tải k6 (mô hình đóng), in một dòng\ntai() { local ten=$1 p=$2 v=${3:-50} d=${4:-15s}; shift $(( $# < 4 ? $# : 4 )); bash $R k6 tai.js -e TEN=\"$ten\" -e P=\"$p\" -e VUS=$v -e DUR=$d \"$@\"; }\n# taimo <tên> <đường dẫn> <RATE/giây> [DUR] : mô hình mở (đều RATE request mỗi giây)\ntaimo() { local ten=$1 p=$2 r=$3 d=${4:-15s}; shift $(( $# < 4 ? $# : 4 )); bash $R k6 tai.js -e TEN=\"$ten\" -e P=\"$p\" -e RATE=$r -e DUR=$d \"$@\"; }\n# hk: số đo Hikari hiện tại (active/idle/pending/max)\nhk() { curl -s $QL/actuator/prometheus | grep -E '^hikaricp_connections_(active|idle|pending|max)\\{' | sed -E 's/\\{[^}]*\\}//' | tr '\\n' ' ' | sed -E 's/hikaricp_connections_//g; s/\\.0 / /g'; echo; }");
const MA161_GIU = java("// demo16/Demo16Controller.java — endpoint đo (chỉ profile c16)\n/** 16.1: giữ MỘT kết nối CSDL trong ms mili-giây (pg_sleep) — mô phỏng truy vấn chậm. */\n@GetMapping(\"/giu\")\nMap<String, Object> giu(@RequestParam(defaultValue = \"200\") int ms) {\n    if (vachNgan == null) { db.sql(\"select pg_sleep(?)\").param(ms / 1000.0).query().singleRow(); return luong(ms); }\n    // … (nhánh vách ngăn ở mục 8)\n}");
const MA161_LOI = java("// shared/XuLyLoi.java — thêm một handler\n/**\n * Chương 16: pool kết nối cạn (Hikari hết connection-timeout) KHÔNG phải lỗi lập trình ⇒ 503 + Retry-After, log MỘT dòng WARN\n * thay vì 500 + stack trace 150 dòng cho mỗi request (đúng lúc server đang quá tải nhất). Tắt bằng labflow.db.ban-503=false để so.\n */\n@ExceptionHandler({CannotGetJdbcConnectionException.class, CannotCreateTransactionException.class})\nResponseEntity<ProblemDetail> ketNoi(Exception e, HttpServletRequest r) {\n    Throwable poolCan = null;\n    for (Throwable t = e; t != null; t = t.getCause()) if (t instanceof SQLTransientConnectionException) poolCan = t;\n    if (poolCan == null || !ban503) return ResponseEntity.internalServerError().body(khongLuongTruoc(e, r));\n    log.warn(\"pool kết nối cạn ở {} {}: {}\", r.getMethod(), r.getRequestURI(), poolCan.getMessage());\n    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).header(HttpHeaders.RETRY_AFTER, \"1\")\n        .body(dem(pd(HttpStatus.SERVICE_UNAVAILABLE, \"DB_BUSY\", \"hệ thống đang quá tải, hãy thử lại sau giây lát\")));\n}");
const MA161_GD = java("// SAI: @Transactional mượn kết nối ở dòng đầu tiên và chỉ trả khi hàm kết thúc\n@Transactional\nString trongGiaoDich(String lab, int ms) {\n    String ten = db.sql(\"select name from labs where code = ?\").param(lab).query(String.class).single();\n    ngoai.goi(ms);                                         // ví dụ: gọi cổng thanh toán / gửi email — kết nối vẫn bị giữ\n    db.sql(\"update labs set name = name where code = ?\").param(lab).update();\n    return ten;\n}\n\n// ĐÚNG: đọc (giao dịch ngắn) → gọi ngoài (không giữ kết nối) → ghi (giao dịch ngắn)\nString ngoaiGiaoDich(String lab, int ms) {\n    String ten = db.sql(\"select name from labs where code = ?\").param(lab).query(String.class).single();\n    ngoai.goi(ms);\n    db.sql(\"update labs set name = name where code = ?\").param(lab).update();\n    return ten;\n}");
const MA161_RORI = java("/** 16.1: mượn kết nối rồi QUÊN trả (không try-with-resources). */\n@GetMapping(\"/ro-ri\")\nMap<String, Object> roRi() throws Exception {\n    Connection c = ds.getConnection();\n    try (var st = c.createStatement(); var rs = st.executeQuery(\"select count(*) from labs\")) { rs.next(); return luong(rs.getLong(1)); }\n    // thiếu c.close() ⇒ kết nối không bao giờ về pool\n}");
const MA161_PROD = props("# ---- Chương 16: pool kết nối cho production (dev giữ mặc định để quan sát được ở bài 16.1) ----\n# 10 kết nối là đủ cho PostgreSQL 2 CPU: pool to hơn chỉ dời hàng đợi vào bên trong CSDL (đo ở 16.1)\nspring.datasource.hikari.maximum-pool-size=${LABFLOW_DB_POOL:10}\n# chờ kết nối tối đa 2 s rồi trả 503 + Retry-After (mặc định 30 s: người dùng treo nửa phút, request dồn đống)\nspring.datasource.hikari.connection-timeout=2000\n# kết nối bị giữ quá 10 s ⇒ log ngăn xếp nơi đã mượn (bắt rò kết nối)\nspring.datasource.hikari.leak-detection-threshold=10000\n# số đo/trace SQL (datasource-micrometer, bài 15.3): giữ span kết nối + câu lệnh, BỎ quan sát từng lần đọc ResultSet (16.3: báo cáo 25.000 dòng 138 → 69 ms)\njdbc.includes=CONNECTION,QUERY");
const MA161_VACH = java("// vách ngăn (bulkhead): endpoint nặng chỉ được dùng tối đa N kết nối cùng lúc; quá thì từ chối NGAY, không xếp hàng giành pool\nif (!vachNgan.tryAcquire()) throw new LoiNghiepVu(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, \"BUSY\", \"chức năng này đang quá tải, thử lại sau\");\ntry { db.sql(\"select pg_sleep(?)\").param(ms / 1000.0).query().singleRow(); return luong(ms); } finally { vachNgan.release(); }");
const OUT161A = out("## 16.1a — Pool mặc định: 10 kết nối. Mỗi request giữ một kết nối 200 ms (truy vấn chậm)\n$ curl -s $QL/actuator/prometheus | grep -E '^hikaricp_connections_(max|min)\\{'\nhikaricp_connections_max{pool=\"HikariPool-1\"} 10.0\nhikaricp_connections_min{pool=\"HikariPool-1\"} 10.0\n\n## Tăng số người dùng cùng lúc: thông lượng đứng yên ở ~50 req/s, chỉ có độ trễ tăng\n$ tai \"10 người\" \"/api/v1/demo16/giu?ms=200\" 10 15s\n10 người              710 req    46.9 req/s  lỗi   0.0%  p50   207  p95   218  p99   519  max   525 ms\n\n$ tai \"20 người\" \"/api/v1/demo16/giu?ms=200\" 20 15s\n20 người              750 req    49.1 req/s  lỗi   0.0%  p50   405  p95   607  p99   615  max   821 ms\n\n$ tai \"50 người\" \"/api/v1/demo16/giu?ms=200\" 50 15s\n50 người              785 req    49.0 req/s  lỗi   0.0%  p50  1012  p95  1823  p99  2624  max  2639 ms\n\n$ tai \"100 người\" \"/api/v1/demo16/giu?ms=200\" 100 15s\n100 người             836 req    49.1 req/s  lỗi   0.0%  p50  2022  p95  3841  p99  3858  max  5690 ms\n\n## Nhìn vào pool khi đang chịu 100 người\n$ tai \"100 người\" \"/api/v1/demo16/giu?ms=200\" 100 15s >/dev/null & K=$!; cho_can; sleep 3; hk; wait $K\nactive 0 idle 10 max 10 pending 0 \n\n## Mỗi request chờ kết nối bao lâu (trung bình và tối đa)\n$ curl -s $QL/actuator/prometheus | grep -E '^hikaricp_connections_acquire_seconds_(count|sum|max)\\{' | sed -E 's/\\{[^}]*\\}//'\nhikaricp_connections_acquire_seconds_count 3938\nhikaricp_connections_acquire_seconds_sum 3639.630970882\nhikaricp_connections_acquire_seconds_max 5.486676705\n\n## connection-timeout mặc định 30 s. Đặt 2 s rồi chạy lại 100 người (bản LabFlow CHƯA xử lý lỗi pool)\n$ tai \"100 người, chờ ≤2s\" \"/api/v1/demo16/giu?ms=200\" 100 15s\n100 người, chờ ≤2s    917 req    54.4 req/s  lỗi  10.8%  p50  2015  p95  2032  p99  2324  max  2348 ms\n\n$ docker logs labflow | grep -m1 -o \"HikariPool-1 - Connection is not available.*\"\nHikariPool-1 - Connection is not available, request timed out after 2001ms (total=10, active=10, idle=0, waiting=87)\n\n$ so labflow_api_errors_total\nlabflow_api_errors_total{code=\"INTERNAL\",status=\"500\"} 99.0\n\n$ echo \"log: $(docker logs labflow | grep -c 'lỗi không lường trước') lần ERROR, tổng $(docker logs labflow 2>&1 | wc -l) dòng\"\nlog: 99 lần ERROR, tổng 15303 dòng\n\n## Sửa: pool cạn ⇒ 503 + Retry-After, log một dòng WARN\n$ tai \"100 người, chờ ≤2s\" \"/api/v1/demo16/giu?ms=200\" 100 15s\n100 người, chờ ≤2s    891 req    52.7 req/s  lỗi   7.2%  p50  2022  p95  2045  p99  2075  max  2125 ms\n\n$ so labflow_api_errors_total\nlabflow_api_errors_total{code=\"DB_BUSY\",status=\"503\"} 64.0\n\n$ echo \"log: $(docker logs labflow | grep -c 'pool kết nối cạn') lần WARN, tổng $(docker logs labflow 2>&1 | wc -l) dòng\"\nlog: 64 lần WARN, tổng 121 dòng\n\n$ docker logs labflow | grep -m1 -o \"WARN.*pool kết nối cạn.*\" | sed -E 's/\\[[^]]*\\] //g'\nWARN 1 --- vn.labflow.shared.XuLyLoi                : pool kết nối cạn ở GET /api/v1/demo16/giu: HikariPool-1 - Connection is not available, request timed out after 2000ms (total=10, active=10, idle=0, waiting=89)\n\n$ tai \"10 người giữ 5s\" \"/api/v1/demo16/giu?ms=5000\" 10 10s >/dev/null & K=$!; cho_can; curl -s -D /tmp/h -o /tmp/b $API/api/v1/demo16/giu; wait $K\n\n$ grep -iE \"^HTTP|^retry-after|^content-type\" /tmp/h; jq -c . /tmp/b\nHTTP/1.1 503 \r\nRetry-After: 1\r\nContent-Type: application/problem+json\r\n{\"detail\":\"hệ thống đang quá tải, hãy thử lại sau giây lát\",\"instance\":\"/api/v1/demo16/giu\",\"status\":503,\"title\":\"Service Unavailable\",\"type\":\"https://labflow.vn/errors/db-busy\",\"code\":\"DB_BUSY\"}\n\n## Trong lúc pool cạn: request thường của người khác (phòng IOT-01 đã nằm trong cache Redis, danh sách phòng thì cần CSDL)\n$ tai \"100 người\" \"/api/v1/demo16/giu?ms=200\" 100 14s >/dev/null & K=$!; cho_can; curl -s -o /dev/null -w 'GET /labs/IOT-01 (cache)  HTTP %{http_code} sau %{time_total}s\\n' $API/api/v1/labs/IOT-01; for i in 1 2 3 4; do curl -s -o /tmp/b -w 'GET /labs (CSDL)          HTTP %{http_code} sau %{time_total}s\\n' $API/api/v1/labs; done; wait $K\nGET /labs/IOT-01 (cache)  HTTP 200 sau 0.027550s\nGET /labs (CSDL)          HTTP 200 sau 1.839040s\nGET /labs (CSDL)          HTTP 200 sau 1.806477s\nGET /labs (CSDL)          HTTP 200 sau 1.810193s\nGET /labs (CSDL)          HTTP 200 sau 1.975069s\n\n$ jq -c . /tmp/b\n{\"items\":[{\"id\":3,\"code\":\"AI-03\",\"name\":\"Lab AI\",\"capacity\":40,\"status\":\"ACTIVE\",\"requiresApproval\":true},{\"id\":4,\"code\":\"HW-04\",\"name\":\"Lab Phần cứng\",\"capacity\":20,\"status\":\"ACTIVE\",\"requiresApproval\":false},{\"id\":1,\"code\":\"IOT-01\",\"name\":\"Lab IoT\",\"capacity\":24,\"status\":\"ACTIVE\",\"requiresApproval\":false},{\"id\":2,\"code\":\"NET-02\",\"name\":\"Lab Mạng\",\"capacity\":30,\"status\":\"ACTIVE\",\"requiresApproval\":false}],\"page\":0,\"size\":20,\"totalItems\":4,\"totalPages\":1}");
const OUT161B = out("## 16.1b — Pool to hơn có nhanh hơn? Truy vấn ăn CPU của PostgreSQL (PostgreSQL có 2 CPU), 100 người gọi liên tục\n$ curl -s \"$API/api/v1/demo16/nang?n=300000\"; echo\n{\"kq\":42857,\"luong\":\"http-nio-8080-exec-1\"}\n\n## Mỗi lượt: đổi maximum-pool-size, xoá thống kê, đo 15 giây, rồi hỏi PostgreSQL: MỖI truy vấn chạy bên trong nó mất bao lâu\n$ for n in 2 4 10 30 100; do lai --spring.datasource.hikari.maximum-pool-size=$n; psql -c \"select pg_stat_statements_reset()\" >/dev/null; tai \"pool $n\" \"/api/v1/demo16/nang?n=300000\" 100 15s; psql -c \"select calls, round(mean_exec_time::numeric,1) as ms_trong_pg from pg_stat_statements where query like '%generate_series%'\" | sed -n 3p; done\npool 2                844 req    49.6 req/s  lỗi   0.0%  p50  2033  p95  2207  p99  4035  max  4278 ms\n   844 |        38.3\npool 4                825 req    48.4 req/s  lỗi   0.0%  p50  2045  p95  2109  p99  3990  max  4098 ms\n   825 |        78.8\npool 10               788 req    46.1 req/s  lỗi   0.0%  p50  2184  p95  2309  p99  4182  max  4213 ms\n   788 |       207.0\npool 30               766 req    45.3 req/s  lỗi   0.0%  p50  2105  p95  3559  p99  4095  max  5480 ms\n   766 |       629.2\npool 100              709 req    45.1 req/s  lỗi   0.0%  p50  1910  p95  4512  p99  5674  max  6004 ms\n   709 |      2032.0");
const OUT161C = out("## 16.1c — Gọi dịch vụ ngoài 300 ms (cổng thanh toán, gửi email…) BÊN TRONG @Transactional, pool 10, 50 người\n$ tai \"trong giao dịch\" \"/api/v1/demo16/trong-gd?ms=300\" 50 15s\ntrong giao dịch       530 req    32.3 req/s  lỗi   0.0%  p50  1519  p95  1554  p99  2742  max  3954 ms\n\n$ tai \"ngoài giao dịch\" \"/api/v1/demo16/ngoai-gd?ms=300\" 50 15s\nngoài giao dịch      2347 req   153.4 req/s  lỗi   0.0%  p50   304  p95   364  p99   845  max  1176 ms\n\n## Lúc chạy \"trong giao dịch\": kết nối bận nhưng PostgreSQL ngồi chơi\n$ tai \"trong giao dịch\" \"/api/v1/demo16/trong-gd?ms=300\" 50 15s >/dev/null & sleep 8; hk; psql -c \"select state, count(*) from pg_stat_activity where usename='labflow' and pid <> pg_backend_pid() group by state order by 1\"; wait $!\nactive 10 idle 0 max 10 pending 40 \n        state        | count \n---------------------+-------\n idle in transaction |    10\n                     |     1\n(2 rows)");
const OUT161D = out("## 16.1d — Rò kết nối: mượn bằng DataSource.getConnection() rồi quên close()\n$ for i in $(seq 12); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' $API/api/v1/demo16/ro-ri); done; echo\n200 200 200 200 200 200 200 200 200 200 500 500 \n\n$ hk\nactive 10 idle 0 max 10 pending 0 \n\n$ curl -s -o /dev/null -w 'GET /labs  HTTP %{http_code} sau %{time_total}s\\n' $API/api/v1/labs\nGET /labs  HTTP 503 sau 2.070451s\n\n## leak-detection-threshold=2000: Hikari ghi lại NƠI đã mượn kết nối mà giữ quá 2 giây\n$ sleep 3; docker logs labflow 2>&1 | grep -m1 -o \"Connection leak detection.*\"; docker logs labflow 2>&1 | grep -m1 \"Apparent connection leak\"; docker logs labflow 2>&1 | grep -m1 \"at vn.labflow\"\nConnection leak detection triggered for org.postgresql.jdbc.PgConnection@6c2e7591 on thread http-nio-8080-exec-1, stack trace follows\njava.lang.Exception: Apparent connection leak detected\n\tat vn.labflow.demo16.Demo16Controller.roRi(Demo16Controller.java:63) ~[classes/:na]");
const OUT161E = out("## 16.1e — Góc hacker: một endpoint công khai chậm 3 giây (vd tìm kiếm LIKE '%…%' trên bảng lớn) + 20 request song song của MỘT người\n$ taimo \"người dùng thật\" \"/api/v1/labs\" 20 10s\nngười dùng thật       201 req    20.1 req/s  lỗi   0.0%  p50    11  p95    32  p99   311  max   408 ms\n\n$ tai \"kẻ tấn công\" \"/api/v1/demo16/giu?ms=3000\" 20 20s >/dev/null & K=$!; cho_can; taimo \"người dùng thật\" \"/api/v1/labs\" 20 10s; curl -s -w '  HTTP %{http_code}\\n' $QL/actuator/health/readiness; wait $K\nngười dùng thật       201 req    16.7 req/s  lỗi  73.6%  p50  2004  p95  2008  p99  2011  max  2044 ms\n{\"status\":\"UP\"}  HTTP 200\n\n## Phòng: statement_timeout ở PostgreSQL (1 s cho mọi câu SQL của ứng dụng web) — câu nào quá 1 s bị huỷ, trả kết nối về pool\n$ psql -c \"select 1\" >/dev/null; curl -s -w '  HTTP %{http_code} sau %{time_total}s\\n' \"$API/api/v1/demo16/giu?ms=3000\"\n{\"detail\":\"truy vấn quá lâu nên đã bị huỷ\",\"instance\":\"/api/v1/demo16/giu\",\"status\":503,\"title\":\"Service Unavailable\",\"type\":\"https://labflow.vn/errors/db-timeout\",\"code\":\"DB_TIMEOUT\"}  HTTP 503 sau 1.166275s\n\n$ tai \"kẻ tấn công\" \"/api/v1/demo16/giu?ms=3000\" 20 20s >/dev/null & K=$!; cho_can 5; taimo \"người dùng thật\" \"/api/v1/labs\" 20 10s; curl -s -w '  HTTP %{http_code}\\n' $QL/actuator/health/readiness; wait $K\nngười dùng thật       200 req    17.5 req/s  lỗi   9.5%  p50  1455  p95  2006  p99  2009  max  2063 ms\n{\"status\":\"UP\"}  HTTP 200\n\n## statement_timeout chưa đủ: 20 kẻ tấn công × 1 s vẫn > 10 kết nối. Thêm vách ngăn: endpoint nặng tối đa 3 kết nối cùng lúc\n$ tai \"kẻ tấn công\" \"/api/v1/demo16/giu?ms=3000\" 20 20s >/dev/null & K=$!; cho_can 3; taimo \"người dùng thật\" \"/api/v1/labs\" 20 10s; curl -s -w '  HTTP %{http_code}\\n' $QL/actuator/health/readiness; wait $K\nngười dùng thật       200 req    20.0 req/s  lỗi   0.0%  p50    44  p95   109  p99   406  max   503 ms\n{\"status\":\"UP\"}  HTTP 200\n\n$ so labflow_api_errors_total\nlabflow_api_errors_total{code=\"BUSY\",status=\"503\"} 29003.0\nlabflow_api_errors_total{code=\"DB_TIMEOUT\",status=\"503\"} 60.0");

const L161_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1 · Performance</span>
<h2>Connection pool sizing with HikariCP</h2>
<p class="lead">7:00 on the first Monday of the semester: booking opens and 300 students press the button within a minute. LabFlow does not crash — it just gets slower and slower, and the log fills with <code>Connection is not available, request timed out</code>. The database is fine. The code is fine. The bottleneck is a number you have never set: <strong>10</strong>, the default size of Spring Boot's connection pool. In this lesson we exhaust that pool on purpose, measure what happens with k6, and learn the three questions every backend engineer asks about a pool: how big, how long to wait, and who is holding a connection without using it.</p>

<h3>Everyday picture first</h3>
<p>A bank branch has 10 counters. Each customer takes 2 minutes. However many people walk in, the branch serves at most 5 customers a minute — the rest take a number and wait. Opening a 50th counter does not help if there are still only 2 tellers behind them who run between counters. And the worst customer is the one who sits at a counter chatting on the phone while the queue grows. Each of those three sentences is a measurement in this lesson.</p>

<h3>1. What the pool is, and why it exists</h3>
<p>Opening a PostgreSQL connection is expensive: TCP, TLS, authentication, and on the server side a whole new <em>process</em> per connection. So Spring Boot opens a fixed set of connections at startup and lends them out: <strong>HikariCP</strong> is the pool Boot uses by default. A request <em>borrows</em> a connection when it needs the database (the first query, or the start of an <code>@Transactional</code> method) and <em>returns</em> it afterwards. Three defaults matter:</p>
<ul>
  <li><code>maximum-pool-size</code> = <strong>10</strong> connections (and <code>minimum-idle</code> = the same 10).</li>
  <li><code>connection-timeout</code> = <strong>30 seconds</strong>: how long a request waits for a free connection before an exception.</li>
  <li><code>leak-detection-threshold</code> = <strong>0</strong> (off).</li>
</ul>

<h3>2. Measuring a pool running dry</h3>
<p>The tool is <strong>k6</strong> (Grafana's load tester): you write a small JavaScript file, it plays many virtual users (VUs). Here every VU calls an endpoint, waits for the answer, and calls again ("closed model" — lesson 16.3 explains why that matters). The script and the two helper functions used throughout the chapter:</p>
${MA161_K6}
${MA161_HAM}
<p>The endpoint under test borrows one connection and keeps it for 200 ms — a slow query, nothing else:</p>
${MA161_GIU}
<p>Now 10, 20, 50 and 100 users, 15 seconds each, the default pool of 10:</p>
${OUT161A}
<p>Read the first four k6 lines from left to right and you have the whole theory:</p>
<ul>
  <li><strong>Throughput never moves</strong>: ~47–49 requests/second whether there are 10 or 100 users. That is simply 10 connections ÷ 0.2 s = 50 per second — the pool is the ceiling.</li>
  <li><strong>Only latency grows</strong>: p50 goes 207 → 405 → ~1,000 → ~2,000 ms. With 100 users and 50 served per second, each user waits about 100 ÷ 50 = 2 seconds. This is <strong>Little's law</strong> (users in the system = throughput × time in the system), and it lets you predict latency on paper before you run anything.</li>
  <li>Hikari's own numbers during the 100-user run: <code>active 9–10, idle 0–1, pending 90</code> — 90 requests are standing in Hikari's queue. <code>hikaricp_connections_acquire_seconds</code> says the average wait for a connection was ~0.9 s and the worst over 5 s.</li>
</ul>

<h3>3. How long should a request wait? 30 seconds is too long</h3>
<p>With the default 30-second timeout no request fails — they just hang. A user staring at a spinner for 30 seconds presses F5, which creates a <em>new</em> request at the back of the same queue. Lesson 15.1 already set <code>connection-timeout=2000</code>; here is what that does under 100 users — and how badly LabFlow handled it at first:</p>
<ul>
  <li>About 10 % of requests fail after exactly 2 s with Hikari's message <code>Connection is not available, request timed out after 2000ms (total=10, active=10, idle=0, waiting=88)</code>. That one line tells you the pool size, how many are in use, and how many are waiting.</li>
  <li>LabFlow's catch-all handler (Chapter 5) answered those with <strong>500 INTERNAL</strong> and logged a full stack trace each time: <strong>15,303 log lines</strong> in 15 seconds — the log disk fills up at the exact moment the server is busiest, and the alert says "bug" when the truth is "overloaded".</li>
</ul>
<p>A full pool is not a programming error. It is "come back in a second". So LabFlow gets one more handler:</p>
${MA161_LOI}
<p>Same load again: the errors are now <code>labflow_api_errors_total{code="DB_BUSY",status="503"}</code>, each is a single WARN line (121 lines in total instead of 15,303), and the client receives <code>503</code> with <code>Retry-After: 1</code> — the frontend from Chapter 12 can show "busy, retrying…" instead of a red error. The last block shows the other users during the overload: a lab already in Redis (Chapter 13) answers in under 30 ms, but anything that needs the database waits ~1.8–2 s like everyone else.</p>
<p><strong>Rule of thumb</strong>: <code>connection-timeout</code> should be a bit shorter than the time your user (or the load balancer in front of you) is willing to wait — usually 1–3 seconds for an API.</p>

<h3>4. Is a bigger pool faster? Measure it</h3>
<p>The instinct is "raise it to 100". Here PostgreSQL gets 2 CPUs and the endpoint runs a query that is pure CPU work inside PostgreSQL (no waiting). 100 users, pool 2, 4, 10, 30 and 100, and after each run we ask PostgreSQL (<code>pg_stat_statements</code>) how long one query took <em>inside the database</em>:</p>
${OUT161B}
<ul>
  <li>Throughput: 49.6 → 48.4 → 46.1 → 45.3 → 45.1 req/s. A bigger pool made it <em>slightly worse</em>.</li>
  <li>Time inside PostgreSQL per query: 38 ms → 79 → 207 → 629 → <strong>2,032 ms</strong>. With 2 CPUs, only 2 queries really run at once; the other 98 connections take turns on the CPUs and every query stretches. The queue did not disappear — it moved from Hikari (where it is visible and cheap) into PostgreSQL (where it costs memory, locks and context switches).</li>
  <li>p95 is no better either: 2.2 s with pool 2 and 4.5 s with pool 100 — the slow tail got worse.</li>
</ul>
<p>This is the result the HikariCP authors describe in "About Pool Sizing", and the PostgreSQL wiki gives the starting formula: <strong>connections ≈ (CPU cores × 2) + number of disks</strong>. For a small PostgreSQL that is 5–10 — the default is not an accident. The pool size belongs to the <em>database</em>, not to the number of users. And when you run 4 instances of LabFlow, that is 4 × 10 = 40 connections hitting the same PostgreSQL (<code>max_connections</code> defaults to 100).</p>

<h3>5. Holding a connection while doing nothing</h3>
<p>The most common pool killer in real projects is not a slow query, but a connection kept while the code waits for something else. Here, a "payment" or "send e-mail" call of 300 ms inside a <code>@Transactional</code> method:</p>
${MA161_GD}
${OUT161C}
<p>Same work, same pool: 32 req/s inside the transaction versus 153 req/s outside — almost 5×. During the bad run PostgreSQL shows 10 connections in state <code>idle in transaction</code>: borrowed, holding a transaction open, and doing nothing. The fix is about shape, not tuning: short transaction → external call → short transaction (and if both writes must be consistent, the outbox from lesson 14.4).</p>
<p>The same trap has a Spring-specific name: <strong>Open Session in View</strong>. <code>spring.jpa.open-in-view</code> is <code>true</code> by default, which keeps a connection for the whole web request, including JSON rendering and any slow call after the query. Boot prints a warning about it at startup; LabFlow set it to <code>false</code> in Chapter 6. Check it on day one of any project.</p>

<h3>6. A connection that never comes back: leaks</h3>
<p>Borrowing with <code>DataSource.getConnection()</code> and forgetting <code>close()</code>:</p>
${MA161_RORI}
${OUT161D}
<p>Ten calls succeed, the eleventh fails, and from then on <em>every</em> endpoint that needs the database fails — a leak is a slow-motion outage. <code>leak-detection-threshold=2000</code> makes Hikari log the stack trace of <em>where</em> the connection was borrowed if it is held longer than 2 s: <code>Demo16Controller.roRi(Demo16Controller.java:63)</code>. In Spring code you rarely call <code>getConnection()</code> yourself — use <code>JdbcClient</code>, repositories or try-with-resources — but leaks also come from libraries and from streams (<code>Stream&lt;Entity&gt;</code> from a repository that is never closed).</p>
<p>The production block LabFlow adds in <code>application-prod.properties</code> (dev keeps the defaults so you can see the problems above):</p>
${MA161_PROD}

<h3>7. What to watch on the dashboard</h3>
<ul>
  <li><code>hikaricp_connections_pending</code> &gt; 0 for more than a minute: requests are queuing for connections — alert.</li>
  <li><code>hikaricp_connections_acquire_seconds</code> (time to get a connection) and <code>hikaricp_connections_usage_seconds</code> (how long each is held) — the second one finds "idle in transaction" code.</li>
  <li><code>hikaricp_connections_timeout_total</code>: number of timeouts — should be 0.</li>
  <li>On the PostgreSQL side: <code>pg_stat_activity</code> grouped by <code>state</code>; many <code>idle in transaction</code> = connections held without work.</li>
</ul>

<h3>🕵️ Hacker corner — Slowloris (2009): occupy the pool, not the bandwidth</h3>
<p>In 2009 Robert "RSnake" Hansen published <strong>Slowloris</strong>, a tool that takes down Apache web servers from a single laptop: it opens many connections and sends the request headers very slowly, so every server thread waits forever. It was used that year against Iranian government websites. No flood of traffic — just holding a limited resource. A slow, public endpoint does the same thing to your connection pool: each attacker request holds one connection for seconds.</p>
${OUT161E}
<ul>
  <li>Without protection: 20 parallel requests from one "user" to an endpoint that takes 3 s make <strong>72 %</strong> of real users fail (2 s timeout).</li>
  <li><strong>statement_timeout</strong> (here 1 s, passed to PostgreSQL through the JDBC <code>options</code>) kills long queries and returns the connection: failures drop to 12 % — better, but 20 attackers × 1 s still exceed 10 connections.</li>
  <li><strong>Bulkhead</strong> (vách ngăn): the heavy endpoint may use at most 3 connections at once; above that it refuses immediately with 503 instead of queuing for the shared pool:</li>
</ul>
${MA161_VACH}
<p>Defence in layers: a timeout on every SQL statement (in production set it per database role: <code>alter role labflow_web set statement_timeout = '5s'</code>, and run migrations with another role so index builds are not killed), a concurrency limit on expensive endpoints, rate limiting per user (Chapter 13), and authentication before anything expensive. In libraries: Resilience4j <code>@Bulkhead</code>.</p>

<h3>Compared with Node.js</h3>
<p>node-postgres has the same idea: <code>new Pool({ max: 10 })</code> — also 10 by default. One dangerous difference: <code>connectionTimeoutMillis</code> defaults to <strong>0 = wait forever</strong>, so a Node service with a full pool hangs instead of failing (Hikari at least gives up after 30 s). Node also borrows per query unless you open a transaction with <code>pool.connect()</code> — and forgetting <code>client.release()</code> is exactly the leak in section 6. In both worlds the pool size belongs to the database, and the formula above applies.</p>

<h3>At work</h3>
<ul>
  <li>"The API is slow at 7 am" tickets are pool tickets more often than code tickets. First look at <code>hikaricp_connections_pending</code> and <code>pg_stat_activity</code>, then at code.</li>
  <li>When someone proposes "maximum-pool-size=200", ask for a measurement with the database's CPU count — and multiply by the number of instances.</li>
  <li>For SWP391: LabFlow runs one instance against one PostgreSQL. Keep 10, set the 2-second timeout and the 503 handler, and never call an external service (e-mail, payment) inside <code>@Transactional</code>.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Your pool has 10 connections and each request holds one for 200 ms. What is the maximum throughput, and what happens with 100 users?"</strong> — 10 ÷ 0.2 = 50 per second; with 100 users each waits about 100 ÷ 50 = 2 s (Little's law). More users only add latency.</li>
  <li><strong>"Would you increase the pool to 100?"</strong> — Not without measuring: measured on 2 CPUs, throughput stayed ~45–50 req/s and each query took 2 s inside PostgreSQL instead of 38 ms. Start from (cores × 2) + disks; count all instances against <code>max_connections</code>.</li>
  <li><strong>"Requests fail with 'Connection is not available'. What do you check?"</strong> — Who holds connections (pending/active, <code>idle in transaction</code>), slow queries, external calls inside transactions, open-in-view, leaks (<code>leak-detection-threshold</code>). Return 503 with Retry-After, not 500.</li>
  <li><strong>"What is a bulkhead?"</strong> — Limiting the share of a shared resource one feature can use, so one slow endpoint cannot starve the others; with a statement timeout and rate limiting it stops pool-exhaustion attacks.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<ol>
  <li>An endpoint holds a connection for 50 ms, the pool has 10 connections, and you expect 300 requests per second at peak. Will it keep up? What p50 latency do you expect with 400 concurrent users?</li>
  <li>A teammate's <code>@Transactional</code> method saves a booking, then calls an SMTP server (1–5 s), then saves an e-mail log. Rewrite it in prose so the pool is not held during SMTP, without losing the e-mail if the app crashes.</li>
  <li>Production has 3 LabFlow instances, each with pool 30, and PostgreSQL has <code>max_connections=100</code>. Something is wrong — what, and what do you change?</li>
</ol>
${giai('Show answers', `<p>1. Maximum 10 ÷ 0.05 = 200 per second &lt; 300 ⇒ no; requests queue. With 400 users served at 200 per second, each waits about 400 ÷ 200 = 2 s. Fix the 50 ms first (index, cache), not the pool.</p><p>2. Transaction 1: save the booking and an outbox row. Commit (connection returned). A worker reads the outbox and calls SMTP outside any transaction, then in a short transaction marks the row sent and saves the log. A crash before sending leaves the outbox row, so the e-mail is retried (lesson 14.4).</p><p>3. 3 × 30 = 90 connections plus migrations, admin tools and monitoring — close to 100, and far more than the CPUs can run. Use ~10 per instance (30 in total), or put PgBouncer in front if instances scale out.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Connection pool</strong> — a fixed set of open database connections that requests borrow and return.</li>
  <li><strong>HikariCP</strong> — Spring Boot's default JDBC pool.</li>
  <li><strong>connection-timeout</strong> — how long a request waits for a free connection.</li>
  <li><strong>Little's law</strong> — items in the system = throughput × time in the system.</li>
  <li><strong>idle in transaction</strong> — a PostgreSQL connection with an open transaction that is not running anything.</li>
  <li><strong>Open Session in View</strong> — keeping the persistence context (and its connection) open for the whole web request.</li>
  <li><strong>Connection leak</strong> — a borrowed connection that is never returned.</li>
  <li><strong>statement_timeout</strong> — PostgreSQL setting that cancels a statement running longer than the limit.</li>
  <li><strong>Bulkhead</strong> — a limit on how much of a shared resource one feature may use.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>The pool is a ceiling: 10 connections × 200 ms ⇒ 50 req/s whatever the number of users; more users only add latency (Little's law).</li>
  <li>Bigger is not faster: on 2 CPUs, pool 100 gave the same throughput and 2-second queries inside PostgreSQL. Size the pool for the database.</li>
  <li>Wait 1–3 s, then answer 503 + Retry-After with one log line — not 500 with 15,000 lines.</li>
  <li>Never hold a connection while waiting for something else; catch leaks with leak detection; protect slow endpoints with statement timeouts and bulkheads.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing', '🏊', 'HikariCP — About Pool Sizing', 'why smaller pools are faster, the (cores × 2) + disks formula')}
${tl('https://grafana.com/docs/k6/latest/', '📈', 'Grafana k6 documentation', 'scripts, executors, thresholds')}

<h3>Sources</h3>
<ul>
  <li>HikariCP wiki — About Pool Sizing; PostgreSQL wiki — Number Of Database Connections.</li>
  <li>R. Hansen, Slowloris HTTP DoS (2009); reports of its use against Iranian government sites during the 2009 protests.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Java 21, HikariCP) + PostgreSQL 16 (2 CPUs) + Redis 7 + k6 2.4.0 on the course build machine, 24/11/2026. The machine was also rendering video at the time, so absolute numbers vary by ±10 %; the ratios do not.</li>
</ul>
</div>
`;

const L161_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1 · Hiệu năng</span>
<h2>Kích thước pool kết nối với HikariCP</h2>
<p class="lead">7 giờ sáng thứ Hai đầu học kỳ: mở đặt phòng, 300 sinh viên bấm nút trong vòng một phút. LabFlow không sập — nó chỉ chậm dần, chậm dần, và log đầy dòng <code>Connection is not available, request timed out</code>. CSDL vẫn khoẻ. Mã vẫn đúng. Nút thắt là một con số bạn chưa bao giờ đặt: <strong>10</strong>, kích thước mặc định của pool kết nối trong Spring Boot. Bài này cố tình làm cạn pool đó, đo bằng k6 xem chuyện gì xảy ra, và học ba câu hỏi mà kỹ sư backend nào cũng hỏi về pool: to bao nhiêu, chờ bao lâu, và ai đang giữ kết nối mà không dùng.</p>

<h3>Đời thường trước đã</h3>
<p>Một chi nhánh ngân hàng có 10 quầy. Mỗi khách mất 2 phút. Bao nhiêu người bước vào thì chi nhánh cũng chỉ phục vụ tối đa 5 khách mỗi phút — số còn lại bốc số và chờ. Mở thêm quầy thứ 50 chẳng giúp gì nếu phía sau vẫn chỉ có 2 giao dịch viên chạy qua chạy lại giữa các quầy. Còn khách tệ nhất là người ngồi ở quầy nói chuyện điện thoại trong khi hàng dài thêm. Mỗi câu trong ba câu đó là một phép đo trong bài này.</p>

<h3>1. Pool là gì, vì sao phải có</h3>
<p>Mở một kết nối PostgreSQL rất tốn: TCP, TLS, xác thực, và phía server sinh hẳn một <em>tiến trình</em> mới cho mỗi kết nối. Vì vậy Spring Boot mở sẵn một số kết nối cố định lúc khởi động rồi cho mượn: <strong>HikariCP</strong> là pool Boot dùng mặc định. Request <em>mượn</em> một kết nối khi cần CSDL (câu truy vấn đầu tiên, hoặc lúc vào một hàm <code>@Transactional</code>) và <em>trả</em> lại khi xong. Ba giá trị mặc định cần nhớ:</p>
<ul>
  <li><code>maximum-pool-size</code> = <strong>10</strong> kết nối (và <code>minimum-idle</code> cũng bằng 10).</li>
  <li><code>connection-timeout</code> = <strong>30 giây</strong>: một request chờ kết nối rảnh bao lâu trước khi ném exception.</li>
  <li><code>leak-detection-threshold</code> = <strong>0</strong> (tắt).</li>
</ul>

<h3>2. Đo một pool cạn</h3>
<p>Công cụ là <strong>k6</strong> (công cụ đo tải của Grafana): bạn viết một tệp JavaScript nhỏ, nó đóng vai nhiều người dùng ảo (VU). Ở đây mỗi VU gọi một endpoint, chờ trả lời, rồi gọi tiếp ("mô hình đóng" — bài 16.3 giải thích vì sao điều này quan trọng). Kịch bản và các hàm phụ dùng suốt chương:</p>
${MA161_K6}
${MA161_HAM}
<p>Endpoint được đo mượn một kết nối và giữ nó 200 ms — một truy vấn chậm, không làm gì khác:</p>
${MA161_GIU}
<p>Giờ là 10, 20, 50 và 100 người dùng, mỗi lượt 15 giây, pool mặc định 10:</p>
${OUT161A}
<p>Đọc bốn dòng k6 đầu từ trái sang phải là có cả lý thuyết:</p>
<ul>
  <li><strong>Thông lượng không nhúc nhích</strong>: khoảng 47–49 request/giây dù 10 hay 100 người. Đơn giản là 10 kết nối ÷ 0,2 giây = 50 mỗi giây — pool là cái trần.</li>
  <li><strong>Chỉ độ trễ tăng</strong>: p50 đi 207 → 405 → khoảng 1.000 → khoảng 2.000 ms. 100 người mà mỗi giây phục vụ 50, thì mỗi người chờ chừng 100 ÷ 50 = 2 giây. Đó là <strong>định luật Little</strong> (số người trong hệ thống = thông lượng × thời gian ở trong hệ thống), và nó cho bạn đoán độ trễ trên giấy trước khi chạy gì cả.</li>
  <li>Số đo của chính Hikari trong lượt 100 người: <code>active 9–10, idle 0–1, pending 90</code> — 90 request đang đứng trong hàng đợi của Hikari. <code>hikaricp_connections_acquire_seconds</code> cho biết trung bình chờ khoảng 0,9 giây mới có kết nối, lâu nhất hơn 5 giây.</li>
</ul>

<h3>3. Request nên chờ bao lâu? 30 giây là quá lâu</h3>
<p>Với timeout mặc định 30 giây, không request nào lỗi — chúng chỉ treo. Người dùng nhìn vòng xoay 30 giây sẽ bấm F5, tức là thêm một request <em>mới</em> vào cuối chính hàng đó. Bài 15.1 đã đặt <code>connection-timeout=2000</code>; đây là điều nó làm dưới 100 người dùng — và ban đầu LabFlow xử lý tệ thế nào:</p>
<ul>
  <li>Khoảng 10 % request hỏng sau đúng 2 giây với thông báo của Hikari <code>Connection is not available, request timed out after 2000ms (total=10, active=10, idle=0, waiting=88)</code>. Một dòng đó cho biết kích thước pool, số đang dùng, số đang chờ.</li>
  <li>Handler bắt-tất-cả của LabFlow (Chương 5) trả các lỗi đó là <strong>500 INTERNAL</strong> và ghi cả stack trace mỗi lần: <strong>15.303 dòng log</strong> trong 15 giây — ổ log đầy đúng lúc server bận nhất, còn cảnh báo thì nói "có bug" trong khi sự thật là "quá tải".</li>
</ul>
<p>Pool đầy không phải lỗi lập trình. Nó là "một giây nữa quay lại nhé". Nên LabFlow có thêm một handler:</p>
${MA161_LOI}
<p>Cùng tải lần nữa: lỗi giờ là <code>labflow_api_errors_total{code="DB_BUSY",status="503"}</code>, mỗi lỗi một dòng WARN (tổng 121 dòng thay vì 15.303), và client nhận <code>503</code> kèm <code>Retry-After: 1</code> — frontend Chương 12 có thể hiện "đang bận, thử lại…" thay vì lỗi đỏ. Khối cuối cho thấy những người dùng khác trong lúc quá tải: phòng đã nằm trong Redis (Chương 13) trả lời dưới 30 ms, còn thứ gì cần CSDL thì chờ chừng 1,8–2 giây như mọi người.</p>
<p><strong>Luật kinh nghiệm</strong>: <code>connection-timeout</code> nên ngắn hơn một chút so với thời gian người dùng (hoặc load balancer phía trước) chịu chờ — thường 1–3 giây với API.</p>

<h3>4. Pool to hơn có nhanh hơn? Đo đi</h3>
<p>Phản xạ đầu tiên là "nâng lên 100". Ở đây PostgreSQL có 2 CPU và endpoint chạy một truy vấn thuần CPU bên trong PostgreSQL (không chờ gì). 100 người dùng, pool 2, 4, 10, 30 và 100; sau mỗi lượt hỏi PostgreSQL (<code>pg_stat_statements</code>) một truy vấn mất bao lâu <em>bên trong CSDL</em>:</p>
${OUT161B}
<ul>
  <li>Thông lượng: 49,6 → 48,4 → 46,1 → 45,3 → 45,1 req/s. Pool to hơn còn làm nó <em>tệ hơn một chút</em>.</li>
  <li>Thời gian một truy vấn bên trong PostgreSQL: 38 ms → 79 → 207 → 629 → <strong>2.032 ms</strong>. Có 2 CPU thì thật sự chỉ 2 truy vấn chạy cùng lúc; 98 kết nối còn lại thay phiên nhau trên CPU và truy vấn nào cũng bị kéo dài. Hàng đợi không biến mất — nó chỉ dời từ Hikari (nơi nhìn thấy được và rẻ) vào trong PostgreSQL (nơi tốn bộ nhớ, khoá và chuyển ngữ cảnh).</li>
  <li>p95 cũng không khá hơn: 2,2 giây với pool 2 và 4,5 giây với pool 100 — phần đuôi chậm còn tệ thêm.</li>
</ul>
<p>Đây đúng là kết quả tác giả HikariCP mô tả trong "About Pool Sizing", còn wiki PostgreSQL cho công thức khởi đầu: <strong>số kết nối ≈ (số nhân CPU × 2) + số ổ đĩa</strong>. Với một PostgreSQL nhỏ, con số đó là 5–10 — mặc định 10 không phải ngẫu nhiên. Kích thước pool thuộc về <em>CSDL</em>, không thuộc về số người dùng. Và khi chạy 4 instance LabFlow, đó là 4 × 10 = 40 kết nối vào cùng một PostgreSQL (<code>max_connections</code> mặc định là 100).</p>

<h3>5. Giữ kết nối mà không làm gì</h3>
<p>Thủ phạm làm cạn pool hay gặp nhất ở dự án thật không phải truy vấn chậm, mà là giữ kết nối trong lúc mã chờ việc khác. Ở đây là một lời gọi "thanh toán" hay "gửi email" 300 ms nằm trong hàm <code>@Transactional</code>:</p>
${MA161_GD}
${OUT161C}
<p>Cùng việc, cùng pool: 32 req/s khi gọi trong giao dịch, so với 153 req/s khi gọi ngoài — gần gấp 5. Trong lượt chạy tệ, PostgreSQL thấy 10 kết nối ở trạng thái <code>idle in transaction</code>: đã mượn, đang mở giao dịch, và không làm gì cả. Cách sửa là đổi hình dạng mã, không phải chỉnh số: giao dịch ngắn → gọi ngoài → giao dịch ngắn (và nếu hai lần ghi phải nhất quán thì dùng outbox của bài 14.4).</p>
<p>Cái bẫy này còn có tên riêng trong Spring: <strong>Open Session in View</strong>. <code>spring.jpa.open-in-view</code> mặc định là <code>true</code>, giữ một kết nối suốt cả request web, kể cả lúc dựng JSON và mọi lời gọi chậm sau truy vấn. Boot in cảnh báo về nó lúc khởi động; LabFlow đã đặt <code>false</code> từ Chương 6. Kiểm nó ngay ngày đầu ở bất kỳ dự án nào.</p>

<h3>6. Kết nối đi không về: rò kết nối</h3>
<p>Mượn bằng <code>DataSource.getConnection()</code> rồi quên <code>close()</code>:</p>
${MA161_RORI}
${OUT161D}
<p>Mười lần gọi thành công, lần thứ mười một hỏng, và từ đó <em>mọi</em> endpoint cần CSDL đều hỏng — rò kết nối là một sự cố sập hệ thống quay chậm. <code>leak-detection-threshold=2000</code> khiến Hikari ghi stack trace của <em>nơi</em> đã mượn kết nối nếu nó bị giữ quá 2 giây: <code>Demo16Controller.roRi(Demo16Controller.java:63)</code>. Trong mã Spring bạn hiếm khi tự gọi <code>getConnection()</code> — dùng <code>JdbcClient</code>, repository hoặc try-with-resources — nhưng rò còn đến từ thư viện và từ stream (<code>Stream&lt;Entity&gt;</code> lấy từ repository mà không đóng).</p>
<p>Khối cấu hình production LabFlow thêm vào <code>application-prod.properties</code> (dev giữ mặc định để bạn thấy được các vấn đề ở trên):</p>
${MA161_PROD}

<h3>7. Nhìn gì trên bảng điều khiển</h3>
<ul>
  <li><code>hikaricp_connections_pending</code> &gt; 0 quá một phút: request đang xếp hàng chờ kết nối — báo động.</li>
  <li><code>hikaricp_connections_acquire_seconds</code> (thời gian lấy được kết nối) và <code>hikaricp_connections_usage_seconds</code> (mỗi kết nối bị giữ bao lâu) — cái thứ hai tìm ra mã kiểu "idle in transaction".</li>
  <li><code>hikaricp_connections_timeout_total</code>: số lần hết giờ chờ — phải bằng 0.</li>
  <li>Phía PostgreSQL: <code>pg_stat_activity</code> nhóm theo <code>state</code>; nhiều <code>idle in transaction</code> = kết nối bị giữ mà không làm việc.</li>
</ul>

<h3>🕵️ Góc hacker — Slowloris (2009): chiếm pool, không cần chiếm băng thông</h3>
<p>Năm 2009 Robert "RSnake" Hansen công bố <strong>Slowloris</strong>, một công cụ hạ gục web server Apache chỉ từ một máy xách tay: nó mở nhiều kết nối và gửi header request thật chậm, nên mọi luồng của server chờ mãi. Cùng năm đó nó được dùng nhắm vào các trang web của chính phủ Iran. Không cần lũ lưu lượng — chỉ cần giữ một tài nguyên có hạn. Một endpoint công khai mà chậm làm đúng điều đó với pool kết nối của bạn: mỗi request của kẻ tấn công giữ một kết nối hàng giây.</p>
${OUT161E}
<ul>
  <li>Không phòng gì: 20 request song song của một "người dùng" vào endpoint mất 3 giây làm <strong>72 %</strong> request của người dùng thật hỏng (timeout 2 giây).</li>
  <li><strong>statement_timeout</strong> (ở đây 1 giây, truyền vào PostgreSQL qua tham số JDBC <code>options</code>) huỷ truy vấn dài và trả kết nối về pool: lỗi giảm còn 12 % — khá hơn, nhưng 20 kẻ tấn công × 1 giây vẫn vượt 10 kết nối.</li>
  <li><strong>Vách ngăn</strong> (bulkhead): endpoint nặng chỉ được dùng tối đa 3 kết nối cùng lúc; quá thì từ chối NGAY bằng 503 thay vì xếp hàng giành pool chung:</li>
</ul>
${MA161_VACH}
<p>Phòng thủ nhiều lớp: giới hạn thời gian cho mọi câu SQL (ở production đặt theo vai trò CSDL: <code>alter role labflow_web set statement_timeout = '5s'</code>, và chạy migration bằng vai trò khác để lệnh tạo chỉ mục không bị huỷ), giới hạn đồng thời cho endpoint đắt, giới hạn tần suất theo người dùng (Chương 13), và xác thực trước mọi việc đắt. Thư viện có sẵn: <code>@Bulkhead</code> của Resilience4j.</p>

<h3>So với Node.js</h3>
<p>node-postgres có cùng ý tưởng: <code>new Pool({ max: 10 })</code> — mặc định cũng 10. Một khác biệt nguy hiểm: <code>connectionTimeoutMillis</code> mặc định là <strong>0 = chờ mãi mãi</strong>, nên dịch vụ Node có pool đầy sẽ treo chứ không báo lỗi (Hikari ít ra bỏ cuộc sau 30 giây). Node cũng mượn kết nối theo từng truy vấn, trừ khi bạn mở giao dịch bằng <code>pool.connect()</code> — và quên <code>client.release()</code> chính là kiểu rò ở mục 6. Ở cả hai thế giới, kích thước pool thuộc về CSDL, và công thức ở trên vẫn đúng.</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Phiếu việc "7 giờ sáng API chậm" là chuyện pool thường xuyên hơn chuyện mã. Nhìn <code>hikaricp_connections_pending</code> và <code>pg_stat_activity</code> trước, rồi mới đọc mã.</li>
  <li>Khi ai đó đề xuất "maximum-pool-size=200", hãy xin một phép đo kèm số CPU của CSDL — và nhân với số instance.</li>
  <li>Với SWP391: LabFlow chạy một instance với một PostgreSQL. Giữ 10, đặt timeout 2 giây và handler 503, và không bao giờ gọi dịch vụ ngoài (email, thanh toán) bên trong <code>@Transactional</code>.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Pool có 10 kết nối, mỗi request giữ một kết nối 200 ms. Thông lượng tối đa là bao nhiêu, 100 người dùng thì sao?"</strong> — 10 ÷ 0,2 = 50 mỗi giây; với 100 người mỗi người chờ chừng 100 ÷ 50 = 2 giây (định luật Little). Thêm người chỉ thêm độ trễ.</li>
  <li><strong>"Bạn có nâng pool lên 100 không?"</strong> — Không khi chưa đo: đo trên 2 CPU, thông lượng vẫn 45–50 req/s còn mỗi truy vấn mất 2 giây trong PostgreSQL thay vì 38 ms. Bắt đầu từ (số nhân × 2) + số đĩa; cộng mọi instance rồi so với <code>max_connections</code>.</li>
  <li><strong>"Request hỏng với 'Connection is not available'. Bạn kiểm gì?"</strong> — Ai đang giữ kết nối (pending/active, <code>idle in transaction</code>), truy vấn chậm, gọi ngoài trong giao dịch, open-in-view, rò (<code>leak-detection-threshold</code>). Trả 503 kèm Retry-After, không phải 500.</li>
  <li><strong>"Bulkhead là gì?"</strong> — Giới hạn phần tài nguyên dùng chung mà một chức năng được chiếm, để một endpoint chậm không bỏ đói các endpoint khác; cùng với timeout câu SQL và giới hạn tần suất, nó chặn được kiểu tấn công làm cạn pool.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<ol>
  <li>Một endpoint giữ kết nối 50 ms, pool 10 kết nối, giờ cao điểm dự kiến 300 request mỗi giây. Có theo kịp không? Với 400 người dùng đồng thời, p50 khoảng bao nhiêu?</li>
  <li>Hàm <code>@Transactional</code> của bạn cùng nhóm lưu lượt đặt, rồi gọi server SMTP (1–5 giây), rồi lưu nhật ký email. Viết lại bằng lời sao cho pool không bị giữ trong lúc gọi SMTP, mà ứng dụng sập cũng không mất email.</li>
  <li>Production có 3 instance LabFlow, mỗi cái pool 30, PostgreSQL có <code>max_connections=100</code>. Có gì sai, và bạn đổi gì?</li>
</ol>
${giai('Xem đáp án', `<p>1. Tối đa 10 ÷ 0,05 = 200 mỗi giây &lt; 300 ⇒ không; request xếp hàng. 400 người được phục vụ 200 mỗi giây thì mỗi người chờ chừng 400 ÷ 200 = 2 giây. Sửa 50 ms trước (chỉ mục, cache), đừng sửa pool.</p><p>2. Giao dịch 1: lưu lượt đặt và một dòng outbox. Commit (kết nối được trả). Một worker đọc outbox, gọi SMTP ngoài mọi giao dịch, rồi trong một giao dịch ngắn đánh dấu đã gửi và lưu nhật ký. Sập trước khi gửi thì dòng outbox còn đó nên email được gửi lại (bài 14.4).</p><p>3. 3 × 30 = 90 kết nối, cộng migration, công cụ quản trị và giám sát — sát 100, và nhiều hơn hẳn số việc CPU chạy nổi. Dùng khoảng 10 mỗi instance (tổng 30), hoặc đặt PgBouncer phía trước nếu số instance tăng.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Pool kết nối</strong> — tập kết nối CSDL mở sẵn, request mượn rồi trả.</li>
  <li><strong>HikariCP</strong> — pool JDBC mặc định của Spring Boot.</li>
  <li><strong>connection-timeout</strong> — thời gian request chờ một kết nối rảnh.</li>
  <li><strong>Định luật Little</strong> — số việc trong hệ thống = thông lượng × thời gian ở trong hệ thống.</li>
  <li><strong>idle in transaction</strong> — kết nối PostgreSQL đang mở giao dịch mà không chạy gì.</li>
  <li><strong>Open Session in View</strong> — giữ persistence context (và kết nối của nó) suốt cả request web.</li>
  <li><strong>Rò kết nối</strong> — kết nối đã mượn mà không bao giờ trả.</li>
  <li><strong>statement_timeout</strong> — thiết lập của PostgreSQL huỷ câu lệnh chạy quá giới hạn.</li>
  <li><strong>Vách ngăn (bulkhead)</strong> — giới hạn phần tài nguyên dùng chung mà một chức năng được dùng.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Pool là cái trần: 10 kết nối × 200 ms ⇒ 50 req/s bất kể bao nhiêu người; thêm người chỉ thêm độ trễ (định luật Little).</li>
  <li>To hơn không nhanh hơn: trên 2 CPU, pool 100 cho cùng thông lượng và truy vấn 2 giây bên trong PostgreSQL. Đặt kích thước pool theo CSDL.</li>
  <li>Chờ 1–3 giây rồi trả 503 + Retry-After kèm một dòng log — không phải 500 với 15.000 dòng.</li>
  <li>Đừng bao giờ giữ kết nối trong lúc chờ việc khác; bắt rò bằng leak detection; bảo vệ endpoint chậm bằng statement timeout và vách ngăn.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing', '🏊', 'HikariCP — About Pool Sizing', 'vì sao pool nhỏ lại nhanh hơn, công thức (số nhân × 2) + số đĩa')}
${tl('https://grafana.com/docs/k6/latest/', '📈', 'Tài liệu Grafana k6', 'kịch bản, executor, threshold')}

<h3>Nguồn</h3>
<ul>
  <li>HikariCP wiki — About Pool Sizing; PostgreSQL wiki — Number Of Database Connections.</li>
  <li>R. Hansen, Slowloris HTTP DoS (2009); các bài báo về việc nó được dùng nhắm vào trang web chính phủ Iran trong các cuộc biểu tình năm 2009.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Java 21, HikariCP) + PostgreSQL 16 (2 CPU) + Redis 7 + k6 2.4.0 trên máy dựng bài, 24/11/2026. Lúc đo máy đang render video song song, nên con số tuyệt đối dao động khoảng ±10 %; tỉ lệ thì không đổi.</li>
</ul>
</div>
`;

// ===== Bài 16.2 =====
const MA162_CHO = java("/** 16.2: chờ I/O ms mili-giây (giả gọi HTTP sang dịch vụ khác) — không dùng CSDL. */\n@GetMapping(\"/cho\")\nMap<String, Object> cho(@RequestParam(defaultValue = \"300\") int ms) throws InterruptedException {\n    Thread.sleep(ms);\n    return luong(ms);\n}\n\n/** 16.2: cũng chờ ms, nhưng bên trong synchronized ⇒ Java 21 GHIM virtual thread vào luồng mang (carrier). */\n@GetMapping(\"/ghim\")\nMap<String, Object> ghim(@RequestParam(defaultValue = \"300\") int ms) throws InterruptedException {\n    Object khoa = new Object();               // mỗi request một khoá riêng: KHÔNG có tranh chấp nào\n    synchronized (khoa) { Thread.sleep(ms); }\n    return luong(ms);\n}");
const MA162_LUONG = java("private static Map<String, Object> luong(Object kq) {\n    Thread t = Thread.currentThread();\n    return Map.of(\"kq\", kq, \"luong\", t.isVirtual() ? \"virtual\" : t.getName());\n}");
const MA162_BAM = java("/** 16.2 / 16.4: việc CPU thuần — kiểm một mật khẩu bằng BCrypt cost 10. */\n@GetMapping(\"/bam\")\nMap<String, Object> bam() { return luong(bcrypt.matches(\"mat-khau-mau\", hashMau)); }");
const OUT162A = out("## 16.2a — Mỗi request chờ I/O 300 ms (gọi dịch vụ khác), không đụng CSDL. Tomcat mặc định: tối đa 200 luồng\n$ curl -s \"$API/api/v1/demo16/cho?ms=10\"; echo\n{\"kq\":10,\"luong\":\"http-nio-8080-exec-1\"}\n\n$ for v in 100 200 400 1000; do tai \"platform $v người\" \"/api/v1/demo16/cho?ms=300\" $v 15s; done\nplatform 100 người   4982 req   325.8 req/s  lỗi   0.0%  p50   302  p95   308  p99   395  max   492 ms\nplatform 200 người  10000 req   656.3 req/s  lỗi   0.0%  p50   301  p95   312  p99   324  max   345 ms\nplatform 400 người  10200 req   659.5 req/s  lỗi   0.0%  p50   602  p95   623  p99   841  max   891 ms\nplatform 1000 người  10798 req   658.6 req/s  lỗi   0.0%  p50  1507  p95  1720  p99  1758  max  1779 ms\n\n$ tai \"platform 1000\" \"/api/v1/demo16/cho?ms=300\" 1000 15s >/dev/null & K=$!; sleep 8; so jvm_threads_live_threads; docker stats --no-stream --format 'bộ nhớ app: {{.MemUsage}}' labflow; wait $K\njvm_threads_live_threads 237.0\nbộ nhớ app: 642.1MiB / 1GiB\n\n## Bật virtual thread: MỘT dòng cấu hình spring.threads.virtual.enabled=true\n$ curl -s \"$API/api/v1/demo16/cho?ms=10\"; echo\n{\"kq\":10,\"luong\":\"virtual\"}\n\n$ for v in 100 200 400 1000 2000; do tai \"virtual $v người\" \"/api/v1/demo16/cho?ms=300\" $v 15s; done\nvirtual 100 người    4972 req   325.0 req/s  lỗi   0.0%  p50   302  p95   310  p99   395  max   490 ms\nvirtual 200 người   10000 req   654.3 req/s  lỗi   0.0%  p50   302  p95   315  p99   331  max   348 ms\nvirtual 400 người   19588 req  1280.2 req/s  lỗi   0.0%  p50   302  p95   325  p99   354  max   551 ms\nvirtual 1000 người  39474 req  2588.1 req/s  lỗi   0.0%  p50   336  p95   587  p99   711  max   978 ms\nvirtual 2000 người  41424 req  2657.7 req/s  lỗi   0.0%  p50   753  p95   959  p99   986  max  1022 ms\n\n$ tai \"virtual 2000\" \"/api/v1/demo16/cho?ms=300\" 2000 15s >/dev/null & K=$!; sleep 8; so jvm_threads_live_threads; docker stats --no-stream --format 'bộ nhớ app: {{.MemUsage}}' labflow; wait $K\njvm_threads_live_threads 33.0\nbộ nhớ app: 939.9MiB / 1GiB");
const OUT162B = out("## 16.2b — Virtual thread + CSDL: 200 người, mỗi request giữ một kết nối 200 ms, pool vẫn 10\n$ tai \"virtual + CSDL\" \"/api/v1/demo16/giu?ms=200\" 200 15s\nvirtual + CSDL       1695 req    98.6 req/s  lỗi  52.2%  p50  2023  p95  2410  p99  2580  max  2749 ms\n\n$ so labflow_api_errors_total\nlabflow_api_errors_total{code=\"DB_BUSY\",status=\"503\"} 884.0");
const OUT162C = out("## 16.2c — Ghim (pinning): cùng chờ 300 ms, nhưng bên trong một khối synchronized. Java 21, virtual thread bật, app có 2 CPU\n$ docker exec labflow java -version 2>&1 | head -1\nopenjdk version \"21.0.12.1\" 2026-08-18 LTS\n\n$ tai \"Java 21 /cho\" \"/api/v1/demo16/cho?ms=300\" 100 15s\nJava 21 /cho         4920 req   321.6 req/s  lỗi   0.0%  p50   302  p95   312  p99   524  max   604 ms\n\n$ tai \"Java 21 /ghim\" \"/api/v1/demo16/ghim?ms=300\" 100 15s\nJava 21 /ghim         198 req     6.6 req/s  lỗi   0.0%  p50 15055  p95 16266  p99 16275  max 16282 ms\n\n$ docker logs labflow 2>&1 | grep -m2 -E \"reason:MONITOR|<== monitors\"\nVirtualThread[#3759,tomcat-handler-3719]/runnable@ForkJoinPool-1-worker-2 reason:MONITOR\n    vn.labflow.demo16.Demo16Controller.ghim(Demo16Controller.java:79) <== monitors:1\n\n## Java 25: từ Java 24 (JEP 491) synchronized không còn ghim virtual thread\n$ docker exec labflow java -version 2>&1 | head -1\nopenjdk version \"25.0.5.1\" 2026-11-17 LTS\n\n$ tai \"Java 25 /ghim\" \"/api/v1/demo16/ghim?ms=300\" 100 15s\nJava 25 /ghim        4900 req   320.8 req/s  lỗi   0.0%  p50   302  p95   313  p99   564  max   663 ms");
const OUT162D = out("## 16.2d — Việc CPU thuần (kiểm mật khẩu BCrypt cost 10), 50 người: virtual thread không làm CPU nhanh hơn\n$ tai \"platform bcrypt\" \"/api/v1/demo16/bam\" 50 15s\nplatform bcrypt       468 req    29.5 req/s  lỗi   0.0%  p50  1774  p95  2698  p99  3073  max  3207 ms\n\n$ tai \"virtual bcrypt\" \"/api/v1/demo16/bam\" 50 15s\nvirtual bcrypt        482 req    29.0 req/s  lỗi   0.0%  p50    68  p95 11082  p99 13438  max 13865 ms\n\n$ tai \"virtual bcrypt (lần 2)\" \"/api/v1/demo16/bam\" 50 15s\nvirtual bcrypt (lần 2)    505 req    30.5 req/s  lỗi   0.0%  p50    65  p95 11334  p99 12680  max 13094 ms");

const L162_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2 · Performance</span>
<h2>Virtual threads in a Spring Boot server</h2>
<p class="lead">LabFlow does not only talk to PostgreSQL. It calls the school's single sign-on, sends e-mail, maybe asks a payment gateway — and each of those calls makes a thread sit and wait. Tomcat has 200 threads. What happens to user number 201? Java 21 brought <strong>virtual threads</strong>, and Spring Boot turns them on with one line. In this lesson we measure how far that line takes you (4× the throughput on the same 2 CPUs), and the three places it does not help or makes things worse: the database pool, a <code>synchronized</code> block on Java 21, and pure CPU work.</p>

<h3>Everyday picture first</h3>
<p>A restaurant with 200 waiters, where each waiter takes an order and then <em>stands by the kitchen door</em> until that dish is ready. 200 tables at most, however small the dishes. Virtual threads are a different rule: a waiter hands the order to the kitchen and goes to serve another table; when the dish is ready, whoever is free brings it out. Same kitchen, same 2 cooks — but the waiters stop being the limit. If the kitchen itself is the bottleneck (CPU work), no rule about waiters will help.</p>

<h3>1. Thread per request, and why 200</h3>
<p>Spring MVC on Tomcat runs each request on one thread from start to end. The code is simple to read — call the database, wait, call the next service, wait — because waiting is just a method that blocks. The cost: a <strong>platform thread</strong> is an operating-system thread with its own stack (1 MB reserved by default) and an OS context switch every time it waits, so Tomcat caps the pool at <code>server.tomcat.threads.max=200</code>. With requests that mostly wait, 200 threads is the ceiling — the same shape as the connection pool in 16.1.</p>
<p>The endpoints used in this lesson — each returns the name of the thread that served it:</p>
${MA162_LUONG}
${MA162_CHO}

<h3>2. Measuring: 300 ms of waiting, 100 to 2,000 users</h3>
${OUT162A}
<ul>
  <li><strong>Platform threads</strong>: 100 users ⇒ 326 req/s, 200 ⇒ 656, then <strong>stuck at ~659</strong> for 400 and 1,000 users while p50 rises to 602 ms and 1,507 ms. 200 threads ÷ 0.3 s = 666 per second — Little's law again; the other users wait in Tomcat's accept queue.</li>
  <li><strong>Virtual threads</strong> (one line: <code>spring.threads.virtual.enabled=true</code>): 400 users ⇒ 1,280 req/s, 1,000 ⇒ 2,588, 2,000 ⇒ 2,658 with p50 753 ms. Four times the throughput on the same 2 CPUs, and the endpoint code did not change. The limit is now the CPU spent on HTTP parsing, JSON and the load generator.</li>
  <li>The JVM sees 237 platform threads in the first case and only 33 in the second: virtual threads are not OS threads (that metric does not count them). They are Java objects scheduled on a few <strong>carrier</strong> threads (one per CPU); when a virtual thread blocks on I/O or <code>sleep</code>, it is <em>unmounted</em> and the carrier runs another one.</li>
  <li>Memory was <em>higher</em> with virtual threads (940 MiB vs 642 MiB): 2,000 requests in flight at once means 2,000 sets of request objects plus their stacks, now stored in the heap. Virtual threads make waiting cheap, not free.</li>
</ul>
<p>What the property switches on in Boot 4: Tomcat's request executor, <code>@Async</code> / <code>SimpleAsyncTaskExecutor</code>, <code>@Scheduled</code> and several clients. It needs Java 21+. You keep writing ordinary blocking code — no <code>Mono</code>, no callbacks — which is the whole point compared with WebFlux.</p>

<h3>3. Virtual threads do not create database connections</h3>
<p>The same 200 users on the endpoint from 16.1 that holds a connection for 200 ms, with virtual threads on:</p>
${OUT162B}
<p>98.6 requests per second reached the server, but <strong>52 % failed</strong> with 503 DB_BUSY: still only 10 connections ⇒ at most 50 successful requests per second. Tomcat's 200 threads used to be an accidental limit protecting everything behind it; virtual threads remove it, so <em>every</em> limited resource — the pool, an external API with its own rate limit, a file handle budget — must now be protected explicitly: the pool timeout and 503 from 16.1, a <code>Semaphore</code>/bulkhead, rate limiting. Never "pool" virtual threads to limit them; limit the resource.</p>

<h3>4. Pinning: <code>synchronized</code> on Java 21</h3>
<p>Same 300 ms wait, but inside a <code>synchronized</code> block — on a lock object created per request, so there is no contention at all:</p>
${OUT162C}
<ul>
  <li>Java 21: <strong>6.6 req/s</strong>, p50 15.1 s, versus 322 req/s for the same wait without <code>synchronized</code>. A virtual thread that blocks while holding a monitor cannot unmount: it is <strong>pinned</strong> to its carrier, and there are only 2 carriers (2 CPUs) ⇒ 2 requests at a time ⇒ 2 ÷ 0.3 = 6.7 per second.</li>
  <li><code>-Djdk.tracePinnedThreads=short</code> prints the culprit: <code>Demo16Controller.ghim(...) &lt;== monitors:1</code>. In production use the JFR event <code>jdk.VirtualThreadPinned</code>.</li>
  <li>Java 25 (the next LTS, September 2025): <strong>321 req/s</strong> with the identical class files. <strong>JEP 491</strong> (Java 24) lets virtual threads unmount inside <code>synchronized</code>. Pinning still happens through native code (JNI) frames.</li>
</ul>
<p>On Java 21 the rule is: no blocking I/O while holding <code>synchronized</code> — use <code>ReentrantLock</code>. Libraries had the same problem; the PostgreSQL JDBC driver and Tomcat replaced much of their <code>synchronized</code> code with locks during 2023–2024 for exactly this reason, so keep drivers up to date. If your team can choose, run virtual threads on Java 25.</p>

<h3>5. CPU work: virtual threads do not add CPUs</h3>
<p>BCrypt with cost 10 (the way LabFlow stores passwords) is pure CPU, about 70 ms per check. 50 users:</p>
${MA162_BAM}
${OUT162D}
<ul>
  <li>Throughput is the same (~29–30 req/s): 2 CPUs ÷ ~70 ms. Nothing waits, so there is nothing to unmount.</li>
  <li>The latency <em>distribution</em> is different. Platform threads: the OS time-slices all 50 fairly, so everyone waits about the same (p50 1.8 s, p95 2.7 s). Virtual threads: the scheduler is <strong>not preemptive</strong> — a virtual thread runs until it blocks or ends — so some requests finish in 65–68 ms while others wait over 11 s — in both runs. For CPU-heavy endpoints, platform threads (or a bounded executor) give fairer latency.</li>
</ul>
<p>The general rule: virtual threads help when threads spend most of their time <em>waiting</em> (HTTP calls, database, files) and you have more concurrent requests than ~200. They do nothing for CPU, they do not enlarge pools, and on Java 21 they punish <code>synchronized</code> + I/O.</p>

<h3>6. Habits that change</h3>
<ul>
  <li><strong>ThreadLocal as a cache</strong> (e.g. one <code>SimpleDateFormat</code> per thread) made sense with 200 long-lived threads; with one virtual thread per request it creates an object per request and never reuses it. Use immutable, thread-safe objects (<code>DateTimeFormatter</code>) instead.</li>
  <li><strong>Do not pool virtual threads</strong>: create one per task (<code>Executors.newVirtualThreadPerTaskExecutor()</code>); limit the resource, not the thread.</li>
  <li><strong>Request context</strong> still uses thread locals (MDC, SecurityContext, transactions) — that keeps working because one request still runs on one virtual thread.</li>
</ul>

<h3>🕵️ Hacker corner — HTTP/2 Rapid Reset (CVE-2023-44487, October 2023)</h3>
<p>In August–October 2023 attackers used a new trick against HTTP/2 servers: open a stream, cancel it immediately, repeat — thousands of times per connection. The server starts work for every stream it then throws away. Google reported a peak of 398 million requests per second, Cloudflare and AWS similar records. Almost every HTTP/2 server was affected, including Apache Tomcat (fixed in 10.1.14, 9.0.81, 8.5.94). The lesson for this chapter: a server's capacity is whatever limits you set — if you remove the natural limit (200 threads) without adding explicit ones, an attacker decides how much work you do.</p>
<ul>
  <li>Keep Tomcat (and Spring Boot, which manages its version) up to date; this CVE was fixed by an upgrade, not by your code.</li>
  <li>Put a reverse proxy/CDN in front for HTTP/2 from the Internet; limit concurrent streams and connections (<code>server.tomcat.max-connections</code>, default 8,192).</li>
  <li>With virtual threads on, add the explicit limits from 16.1: pool timeout, bulkheads, rate limiting per user.</li>
</ul>

<h3>Compared with Node.js</h3>
<p>Node.js had "waiting is cheap" from the start: one event loop, non-blocking I/O, and <code>await</code> to keep code readable. Virtual threads give Java the same economics while keeping the blocking style — no <code>async</code> colouring every function up the call stack. The weakness is shared too: CPU work blocks Node's single event loop completely (lesson 16.4 measures it), and it monopolises a carrier in Java. Before virtual threads, Java's answer was reactive programming (Spring WebFlux, Project Reactor): high throughput, but a different programming model and painful stack traces; for most new CRUD services, MVC + virtual threads is now the simpler choice.</p>

<h3>At work</h3>
<ul>
  <li>Before enabling virtual threads, check the Java version (21 or 25?), search for <code>synchronized</code> around I/O, and run with the JFR pinning event for a day in staging.</li>
  <li>Enable it when the service mostly waits on other services and handles hundreds of concurrent requests (gateways, BFFs, aggregators). For a CRUD API with one database and 10 connections, the pool is the limit and virtual threads change little.</li>
  <li>For SWP391 LabFlow on Java 21: platform threads are fine; if you deploy on Java 25, turning them on is safe and costs one line.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is a virtual thread, and when does it help?"</strong> — A thread managed by the JVM, mounted on a few carrier threads and unmounted when it blocks; it helps I/O-bound workloads with high concurrency. Measured: 659 → 2,658 req/s for a 300 ms wait on 2 CPUs.</li>
  <li><strong>"Will virtual threads make my slow database faster?"</strong> — No: the pool still has 10 connections; with 200 users 52 % failed with DB_BUSY. They move the bottleneck to the next limited resource.</li>
  <li><strong>"What is pinning?"</strong> — A virtual thread that cannot unmount (blocking inside <code>synchronized</code> on Java 21, or in native code) holds its carrier; measured 322 → 6.6 req/s. Fix: <code>ReentrantLock</code>, or Java 24+ (JEP 491).</li>
  <li><strong>"Virtual threads vs WebFlux vs Node.js?"</strong> — All three make waiting cheap. WebFlux and Node use callbacks/async style; virtual threads keep blocking code. None helps CPU-bound work.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<ol>
  <li>An endpoint calls the school SSO (150 ms) and then reads one row from PostgreSQL (5 ms). Peak: 1,500 concurrent users. Estimate the throughput with 200 platform threads and with virtual threads (pool 10). Which limit do you hit in each case?</li>
  <li>A teammate wraps a <code>RestClient</code> call in <code>synchronized (this)</code> "to avoid duplicate requests". What happens on Java 21 with virtual threads on, and what do you write instead?</li>
  <li>Why does turning on virtual threads not change the p95 of the BCrypt login endpoint for the better?</li>
</ol>
${giai('Show answers', `<p>1. Platform: 200 ÷ 0.155 s ≈ 1,290 per second, then threads are the limit. Virtual: threads are no longer a limit; the database part holds a connection 5 ms ⇒ 10 ÷ 0.005 = 2,000 per second, so the CPU or the SSO's own rate limit will bind first. Measure the SSO limit before promising anything.</p><p>2. Every virtual thread inside that block is pinned for the whole HTTP call; with 2 carriers only 2 calls run at once in the whole application, and every other request on those carriers stalls too. Use a <code>ReentrantLock</code> (or better, an idempotency key / a per-key lock) and upgrade to Java 25 when possible.</p><p>3. BCrypt is CPU work; there is no waiting to overlap. Throughput stays at CPUs ÷ 70 ms, and because the virtual-thread scheduler is not preemptive, the tail gets worse (p95 over 11 s in both our runs).</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Platform thread</strong> — a Java thread backed one-to-one by an operating-system thread.</li>
  <li><strong>Virtual thread</strong> — a lightweight thread scheduled by the JVM on carrier threads (Java 21, JEP 444).</li>
  <li><strong>Carrier thread</strong> — a platform thread that runs (mounts) virtual threads; by default one per CPU.</li>
  <li><strong>Mount / unmount</strong> — attaching a virtual thread to a carrier / detaching it when it blocks.</li>
  <li><strong>Pinning</strong> — a virtual thread that cannot unmount while blocked and holds its carrier.</li>
  <li><strong>Preemptive scheduling</strong> — the scheduler can interrupt a running thread to give others a turn (OS threads yes, virtual threads no).</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Tomcat's 200 platform threads cap I/O-bound throughput at threads ÷ wait time; virtual threads removed that cap: 659 → 2,658 req/s with one property.</li>
  <li>They do not add database connections (52 % 503 with pool 10) and do not add CPU (BCrypt the same, with a worse tail).</li>
  <li>On Java 21, blocking inside <code>synchronized</code> pins the carrier (6.6 req/s); Java 24+ fixed it (321 req/s on Java 25).</li>
  <li>Removing an accidental limit means adding deliberate ones: pool timeouts, bulkheads, rate limits, an up-to-date server.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://openjdk.org/jeps/444', '🧵', 'JEP 444 — Virtual Threads', 'the design, mounting, pinning, what not to do')}
${tl('https://openjdk.org/jeps/491', '🔓', 'JEP 491 — Synchronize Virtual Threads without Pinning', 'Java 24: synchronized no longer pins')}
${tl('https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html', '🍃', 'Spring Boot — Task execution and virtual threads', 'what spring.threads.virtual.enabled changes')}

<h3>Sources</h3>
<ul>
  <li>OpenJDK JEP 444 (Java 21), JEP 491 (Java 24).</li>
  <li>CVE-2023-44487 (HTTP/2 Rapid Reset); Google Cloud blog, October 2023 (398 million requests per second); Apache Tomcat security advisories for 10.1.14 / 9.0.81 / 8.5.94.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Tomcat, Java 21.0.12.1 and Java 25.0.5.1) on 2 CPUs / 1 GB + PostgreSQL 16 + k6 2.4.0 on the course build machine, 24/11/2026.</li>
</ul>
</div>
`;

const L162_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2 · Hiệu năng</span>
<h2>Virtual thread trong server Spring Boot</h2>
<p class="lead">LabFlow không chỉ nói chuyện với PostgreSQL. Nó gọi hệ thống đăng nhập một lần của trường, gửi email, có khi hỏi cổng thanh toán — và mỗi lời gọi đó bắt một luồng ngồi chờ. Tomcat có 200 luồng. Người dùng thứ 201 thì sao? Java 21 mang tới <strong>virtual thread</strong>, và Spring Boot bật nó bằng một dòng. Bài này đo xem dòng đó đưa bạn đi được bao xa (gấp 4 thông lượng trên cùng 2 CPU), và ba chỗ nó không giúp hoặc còn làm tệ hơn: pool CSDL, khối <code>synchronized</code> trên Java 21, và việc thuần CPU.</p>

<h3>Đời thường trước đã</h3>
<p>Một nhà hàng có 200 bồi bàn, mỗi người nhận order xong thì <em>đứng ở cửa bếp</em> chờ tới khi món đó xong. Tối đa 200 bàn, món nhỏ cỡ nào cũng vậy. Virtual thread là một luật khác: bồi bàn đưa order cho bếp rồi đi phục vụ bàn khác; món xong thì ai rảnh mang ra. Cùng cái bếp, cùng 2 đầu bếp — nhưng bồi bàn thôi là giới hạn. Còn nếu chính cái bếp là nút thắt (việc CPU) thì luật nào về bồi bàn cũng vô ích.</p>

<h3>1. Mỗi request một luồng, và vì sao là 200</h3>
<p>Spring MVC trên Tomcat chạy mỗi request trên một luồng từ đầu đến cuối. Mã dễ đọc — gọi CSDL, chờ, gọi dịch vụ kế, chờ — vì chờ chỉ là một hàm chặn. Cái giá: một <strong>platform thread</strong> là một luồng của hệ điều hành, có ngăn xếp riêng (mặc định giữ chỗ 1 MB) và mỗi lần chờ là một lần hệ điều hành chuyển ngữ cảnh, nên Tomcat chặn trần ở <code>server.tomcat.threads.max=200</code>. Với request phần lớn thời gian là chờ, 200 luồng là cái trần — cùng hình dạng với pool kết nối ở bài 16.1.</p>
<p>Các endpoint dùng trong bài — mỗi cái trả tên luồng đã phục vụ nó:</p>
${MA162_LUONG}
${MA162_CHO}

<h3>2. Đo: chờ 300 ms, từ 100 đến 2.000 người dùng</h3>
${OUT162A}
<ul>
  <li><strong>Platform thread</strong>: 100 người ⇒ 326 req/s, 200 ⇒ 656, rồi <strong>kẹt ở khoảng 659</strong> với 400 và 1.000 người, trong khi p50 tăng lên 602 ms và 1.507 ms. 200 luồng ÷ 0,3 giây = 666 mỗi giây — lại là định luật Little; những người còn lại chờ trong hàng nhận kết nối của Tomcat.</li>
  <li><strong>Virtual thread</strong> (một dòng: <code>spring.threads.virtual.enabled=true</code>): 400 người ⇒ 1.280 req/s, 1.000 ⇒ 2.588, 2.000 ⇒ 2.658 với p50 753 ms. Gấp 4 thông lượng trên cùng 2 CPU, mã endpoint không đổi một dòng. Giới hạn giờ là CPU dành cho đọc HTTP, dựng JSON và chính công cụ đo tải.</li>
  <li>JVM thấy 237 platform thread ở trường hợp đầu và chỉ 33 ở trường hợp sau: virtual thread không phải luồng hệ điều hành (số đo đó không đếm chúng). Chúng là đối tượng Java được xếp lịch chạy trên vài luồng <strong>mang</strong> (carrier, mỗi CPU một cái); khi một virtual thread chặn vì I/O hay <code>sleep</code>, nó được <em>gỡ</em> (unmount) ra và luồng mang chạy cái khác.</li>
  <li>Bộ nhớ <em>cao hơn</em> khi dùng virtual thread (940 MiB so với 642 MiB): 2.000 request đang xử lý cùng lúc là 2.000 bộ đối tượng request cộng ngăn xếp của chúng, giờ nằm trong heap. Virtual thread làm việc chờ trở nên rẻ, chứ không miễn phí.</li>
</ul>
<p>Thuộc tính đó bật gì trong Boot 4: bộ thực thi request của Tomcat, <code>@Async</code> / <code>SimpleAsyncTaskExecutor</code>, <code>@Scheduled</code> và một số client. Cần Java 21 trở lên. Bạn vẫn viết mã chặn bình thường — không <code>Mono</code>, không callback — đó chính là điểm hơn so với WebFlux.</p>

<h3>3. Virtual thread không đẻ ra kết nối CSDL</h3>
<p>Vẫn 200 người dùng, vào endpoint giữ kết nối 200 ms của bài 16.1, bật virtual thread:</p>
${OUT162B}
<p>98,6 request mỗi giây tới được server, nhưng <strong>52 % hỏng</strong> với 503 DB_BUSY: vẫn chỉ có 10 kết nối ⇒ tối đa 50 request thành công mỗi giây. 200 luồng của Tomcat trước đây là một giới hạn tình cờ che chắn mọi thứ phía sau; virtual thread gỡ nó đi, nên <em>mọi</em> tài nguyên có hạn — pool, API bên ngoài có giới hạn tần suất riêng, số tệp được mở — giờ phải được bảo vệ một cách tường minh: timeout pool và 503 của bài 16.1, <code>Semaphore</code>/vách ngăn, giới hạn tần suất. Đừng bao giờ "gom pool" virtual thread để giới hạn chúng; hãy giới hạn tài nguyên.</p>

<h3>4. Ghim (pinning): <code>synchronized</code> trên Java 21</h3>
<p>Vẫn chờ 300 ms, nhưng bên trong một khối <code>synchronized</code> — trên một đối tượng khoá tạo mới cho mỗi request, nên hoàn toàn không có tranh chấp:</p>
${OUT162C}
<ul>
  <li>Java 21: <strong>6,6 req/s</strong>, p50 15,1 giây, so với 322 req/s cho cùng việc chờ mà không có <code>synchronized</code>. Virtual thread chặn trong lúc giữ monitor thì không gỡ ra được: nó bị <strong>ghim</strong> vào luồng mang, mà chỉ có 2 luồng mang (2 CPU) ⇒ 2 request một lúc ⇒ 2 ÷ 0,3 = 6,7 mỗi giây.</li>
  <li><code>-Djdk.tracePinnedThreads=short</code> chỉ ra thủ phạm: <code>Demo16Controller.ghim(...) &lt;== monitors:1</code>. Ở production dùng sự kiện JFR <code>jdk.VirtualThreadPinned</code>.</li>
  <li>Java 25 (bản LTS tiếp theo, tháng 9/2025): <strong>321 req/s</strong> với đúng các tệp class đó. <strong>JEP 491</strong> (Java 24) cho virtual thread gỡ ra được ngay trong <code>synchronized</code>. Việc ghim vẫn xảy ra qua khung mã native (JNI).</li>
</ul>
<p>Trên Java 21 luật là: không I/O chặn trong lúc giữ <code>synchronized</code> — dùng <code>ReentrantLock</code>. Thư viện cũng gặp đúng chuyện này; driver JDBC của PostgreSQL và Tomcat đã thay phần lớn <code>synchronized</code> bằng lock trong 2023–2024 chính vì lý do đó, nên hãy giữ driver ở bản mới. Nếu nhóm được chọn, hãy chạy virtual thread trên Java 25.</p>

<h3>5. Việc CPU: virtual thread không thêm CPU</h3>
<p>BCrypt cost 10 (cách LabFlow lưu mật khẩu) là việc thuần CPU, khoảng 70 ms mỗi lần kiểm. 50 người dùng:</p>
${MA162_BAM}
${OUT162D}
<ul>
  <li>Thông lượng như nhau (khoảng 29–30 req/s): 2 CPU ÷ khoảng 70 ms. Không có gì phải chờ, nên chẳng có gì để gỡ ra.</li>
  <li>Khác ở <em>phân phối</em> độ trễ. Platform thread: hệ điều hành chia lát thời gian công bằng cho cả 50, ai cũng chờ gần như nhau (p50 1,8 giây, p95 2,7 giây). Virtual thread: bộ xếp lịch <strong>không giành quyền</strong> (non-preemptive) — virtual thread chạy tới khi chặn hoặc xong — nên có request xong trong 65–68 ms còn có request chờ hơn 11 giây — ở cả hai lượt đo. Với endpoint nặng CPU, platform thread (hoặc một executor có giới hạn) cho độ trễ công bằng hơn.</li>
</ul>
<p>Luật chung: virtual thread giúp khi luồng dành phần lớn thời gian để <em>chờ</em> (gọi HTTP, CSDL, tệp) và số request đồng thời nhiều hơn khoảng 200. Nó không làm gì cho CPU, không nới rộng pool, và trên Java 21 nó phạt <code>synchronized</code> + I/O.</p>

<h3>6. Thói quen phải đổi</h3>
<ul>
  <li><strong>ThreadLocal làm cache</strong> (vd mỗi luồng một <code>SimpleDateFormat</code>) hợp lý với 200 luồng sống lâu; với mỗi request một virtual thread, nó tạo một đối tượng cho mỗi request rồi không bao giờ dùng lại. Thay bằng đối tượng bất biến, an toàn đa luồng (<code>DateTimeFormatter</code>).</li>
  <li><strong>Đừng gom pool virtual thread</strong>: mỗi việc một cái (<code>Executors.newVirtualThreadPerTaskExecutor()</code>); giới hạn tài nguyên, không giới hạn luồng.</li>
  <li><strong>Ngữ cảnh request</strong> vẫn dùng thread local (MDC, SecurityContext, giao dịch) — vẫn chạy đúng vì một request vẫn nằm trên một virtual thread.</li>
</ul>

<h3>🕵️ Góc hacker — HTTP/2 Rapid Reset (CVE-2023-44487, tháng 10/2023)</h3>
<p>Từ tháng 8 đến tháng 10/2023 kẻ tấn công dùng một mẹo mới với server HTTP/2: mở một stream, huỷ ngay, lặp lại — hàng nghìn lần trên mỗi kết nối. Server bắt đầu làm việc cho mỗi stream rồi vứt đi. Google báo đỉnh 398 triệu request mỗi giây, Cloudflare và AWS cũng ghi kỷ lục tương tự. Gần như mọi server HTTP/2 đều dính, kể cả Apache Tomcat (sửa ở 10.1.14, 9.0.81, 8.5.94). Bài học cho chương này: sức chứa của server là bất cứ giới hạn nào bạn đặt — gỡ giới hạn tự nhiên (200 luồng) mà không thêm giới hạn tường minh thì kẻ tấn công quyết định bạn làm bao nhiêu việc.</p>
<ul>
  <li>Giữ Tomcat (và Spring Boot, thứ quản lý phiên bản của nó) luôn mới; CVE này được sửa bằng nâng cấp, không phải bằng mã của bạn.</li>
  <li>Đặt reverse proxy/CDN phía trước cho HTTP/2 từ Internet; giới hạn số stream và kết nối đồng thời (<code>server.tomcat.max-connections</code>, mặc định 8.192).</li>
  <li>Đã bật virtual thread thì thêm các giới hạn tường minh của bài 16.1: timeout pool, vách ngăn, giới hạn tần suất theo người dùng.</li>
</ul>

<h3>So với Node.js</h3>
<p>Node.js có "chờ thì rẻ" ngay từ đầu: một event loop, I/O không chặn, và <code>await</code> để mã dễ đọc. Virtual thread cho Java cùng bài toán kinh tế đó mà vẫn giữ kiểu viết chặn — không phải tô <code>async</code> lên mọi hàm dọc ngăn xếp lời gọi. Điểm yếu cũng chung: việc CPU chặn đứng event loop duy nhất của Node (bài 16.4 đo), và chiếm trọn một luồng mang ở Java. Trước virtual thread, câu trả lời của Java là lập trình reactive (Spring WebFlux, Project Reactor): thông lượng cao nhưng mô hình lập trình khác hẳn và stack trace rất khó đọc; với phần lớn dịch vụ CRUD mới, MVC + virtual thread giờ là lựa chọn đơn giản hơn.</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Trước khi bật virtual thread: kiểm phiên bản Java (21 hay 25?), tìm <code>synchronized</code> bao quanh I/O, và chạy kèm sự kiện JFR về ghim một ngày trên staging.</li>
  <li>Bật khi dịch vụ chủ yếu chờ dịch vụ khác và xử lý hàng trăm request đồng thời (gateway, BFF, dịch vụ gom dữ liệu). Với API CRUD một CSDL, 10 kết nối, pool mới là giới hạn và virtual thread đổi rất ít.</li>
  <li>Với LabFlow của SWP391 trên Java 21: platform thread là đủ; nếu triển khai trên Java 25, bật lên là an toàn và chỉ tốn một dòng.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Virtual thread là gì, khi nào nó giúp?"</strong> — Luồng do JVM quản lý, gắn lên vài luồng mang và được gỡ ra khi chặn; giúp tải nặng I/O với độ đồng thời cao. Đã đo: 659 → 2.658 req/s cho việc chờ 300 ms trên 2 CPU.</li>
  <li><strong>"Virtual thread có làm CSDL chậm của tôi nhanh hơn không?"</strong> — Không: pool vẫn 10 kết nối; 200 người dùng thì 52 % hỏng vì DB_BUSY. Nó dời nút thắt sang tài nguyên có hạn tiếp theo.</li>
  <li><strong>"Ghim (pinning) là gì?"</strong> — Virtual thread không gỡ ra được (chặn trong <code>synchronized</code> trên Java 21, hoặc trong mã native) giữ luôn luồng mang; đo được 322 → 6,6 req/s. Sửa: <code>ReentrantLock</code>, hoặc Java 24+ (JEP 491).</li>
  <li><strong>"Virtual thread vs WebFlux vs Node.js?"</strong> — Cả ba làm việc chờ trở nên rẻ. WebFlux và Node dùng kiểu callback/async; virtual thread giữ mã chặn. Không cái nào giúp việc nặng CPU.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<ol>
  <li>Một endpoint gọi SSO của trường (150 ms) rồi đọc một dòng PostgreSQL (5 ms). Cao điểm: 1.500 người dùng đồng thời. Ước lượng thông lượng với 200 platform thread và với virtual thread (pool 10). Mỗi trường hợp chạm giới hạn nào?</li>
  <li>Bạn cùng nhóm bọc một lời gọi <code>RestClient</code> trong <code>synchronized (this)</code> "cho khỏi gửi trùng". Trên Java 21 có bật virtual thread thì chuyện gì xảy ra, và bạn viết gì thay?</li>
  <li>Vì sao bật virtual thread không làm p95 của endpoint đăng nhập BCrypt tốt lên?</li>
</ol>
${giai('Xem đáp án', `<p>1. Platform: 200 ÷ 0,155 giây ≈ 1.290 mỗi giây, rồi luồng là giới hạn. Virtual: luồng hết là giới hạn; phần CSDL giữ kết nối 5 ms ⇒ 10 ÷ 0,005 = 2.000 mỗi giây, nên CPU hoặc giới hạn tần suất của chính SSO sẽ chặn trước. Đo giới hạn của SSO trước khi hứa hẹn gì.</p><p>2. Mọi virtual thread đi vào khối đó bị ghim suốt lời gọi HTTP; có 2 luồng mang thì cả ứng dụng chỉ chạy được 2 lời gọi một lúc, và mọi request khác trên các luồng mang đó cũng đứng theo. Dùng <code>ReentrantLock</code> (hoặc tốt hơn, khoá idempotency / khoá theo từng khoá nghiệp vụ) và nâng lên Java 25 khi có thể.</p><p>3. BCrypt là việc CPU; không có gì chờ để chồng lên nhau. Thông lượng vẫn là số CPU ÷ 70 ms, và vì bộ xếp lịch virtual thread không giành quyền nên phần đuôi còn tệ hơn (p95 hơn 11 giây ở cả hai lượt đo của chúng ta).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Platform thread</strong> — luồng Java ứng một-một với một luồng của hệ điều hành.</li>
  <li><strong>Virtual thread</strong> — luồng nhẹ do JVM xếp lịch trên các luồng mang (Java 21, JEP 444).</li>
  <li><strong>Luồng mang (carrier thread)</strong> — platform thread chạy (gắn) các virtual thread; mặc định mỗi CPU một cái.</li>
  <li><strong>Gắn / gỡ (mount / unmount)</strong> — đưa virtual thread lên luồng mang / tách nó ra khi nó chặn.</li>
  <li><strong>Ghim (pinning)</strong> — virtual thread bị chặn mà không gỡ ra được, giữ luôn luồng mang.</li>
  <li><strong>Xếp lịch giành quyền (preemptive)</strong> — bộ xếp lịch có thể ngắt luồng đang chạy để nhường lượt (luồng hệ điều hành có, virtual thread không).</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>200 platform thread của Tomcat chặn trần thông lượng việc I/O ở mức số luồng ÷ thời gian chờ; virtual thread gỡ trần đó: 659 → 2.658 req/s chỉ với một thuộc tính.</li>
  <li>Nó không thêm kết nối CSDL (52 % trả 503 với pool 10) và không thêm CPU (BCrypt như cũ, phần đuôi tệ hơn).</li>
  <li>Trên Java 21, chặn bên trong <code>synchronized</code> ghim luồng mang (6,6 req/s); Java 24+ đã sửa (321 req/s trên Java 25).</li>
  <li>Gỡ một giới hạn tình cờ nghĩa là phải thêm giới hạn có chủ đích: timeout pool, vách ngăn, giới hạn tần suất, server luôn cập nhật.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://openjdk.org/jeps/444', '🧵', 'JEP 444 — Virtual Threads', 'thiết kế, gắn/gỡ, ghim, những điều không nên làm')}
${tl('https://openjdk.org/jeps/491', '🔓', 'JEP 491 — Synchronize Virtual Threads without Pinning', 'Java 24: synchronized không còn ghim')}
${tl('https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html', '🍃', 'Spring Boot — Task execution và virtual thread', 'spring.threads.virtual.enabled đổi những gì')}

<h3>Nguồn</h3>
<ul>
  <li>OpenJDK JEP 444 (Java 21), JEP 491 (Java 24).</li>
  <li>CVE-2023-44487 (HTTP/2 Rapid Reset); blog Google Cloud, tháng 10/2023 (398 triệu request mỗi giây); thông báo bảo mật Apache Tomcat cho 10.1.14 / 9.0.81 / 8.5.94.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Tomcat, Java 21.0.12.1 và Java 25.0.5.1) trên 2 CPU / 1 GB + PostgreSQL 16 + k6 2.4.0 trên máy dựng bài, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 16.3 =====
const MA163_K6 = js("// labflow.js — kịch bản đo tải \"giống người dùng thật\" cho LabFlow: đăng nhập trước, rồi trộn 3 loại request đọc.\n// Chạy: k6 run -e RATE=100 labflow.js   (RATE = số lượt mỗi giây ở pha giữ; mô hình MỞ)\nimport http from 'k6/http';\nimport { check } from 'k6';\n\nconst API = `http://localhost:${__ENV.PORT || 8080}/api/v1`;\nconst LABS = ['IOT-01', 'NET-02', 'AI-03', 'HW-04'];\nconst RATE = +(__ENV.RATE || 100);\n\nexport const options = {\n  scenarios: {\n    doc: {\n      executor: 'ramping-arrival-rate', startRate: 0, timeUnit: '1s', preAllocatedVUs: 50, maxVUs: 500,\n      stages: [ { target: RATE, duration: '10s' },     // làm nóng: tăng dần\n                { target: RATE, duration: __ENV.GIU || '30s' } ],  // giữ đều\n    },\n  },\n  thresholds: {                        // \"hợp đồng\" hiệu năng: trượt ⇒ k6 thoát mã khác 0 ⇒ CI đỏ\n    http_req_failed: ['rate<0.01'],\n    'http_req_duration{loai:lich}': ['p(95)<200'],\n    'http_req_duration{loai:cua-toi}': ['p(95)<200'],\n    checks: ['rate>0.99'],\n  },\n  summaryTrendStats: ['avg', 'p(50)', 'p(95)', 'p(99)', 'max'],\n};\n\n// setup() chạy MỘT lần trước khi đo: tạo 20 tài khoản và lấy token (đăng nhập không nằm trong phép đo)\nexport function setup() {\n  const tokens = [];\n  for (let i = 0; i < 20; i++) {\n    const email = `k6-${i}@fpt.edu.vn`, body = { email, password: __ENV.MK, fullName: `K6 ${i}` };\n    http.post(`${API}/auth/register`, JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });\n    const r = http.post(`${API}/auth/login`, JSON.stringify({ email, password: __ENV.MK }), { headers: { 'Content-Type': 'application/json' } });\n    tokens.push(r.json('accessToken'));\n  }\n  return { tokens };\n}\n\nexport default function ({ tokens }) {\n  const auth = { headers: { Authorization: `Bearer ${tokens[__VU % tokens.length]}` } };\n  const lab = LABS[Math.floor(Math.random() * LABS.length)];\n  const ngay = new Date(Date.UTC(2021, 0, 1) + Math.floor(Math.random() * 1600) * 86400000).toISOString().slice(0, 10);\n  const x = Math.random();\n  let r;\n  if (x < 0.2) r = http.get(`${API}/labs`, Object.assign({ tags: { loai: 'labs' } }, auth));\n  else if (x < 0.8) r = http.get(`${API}/bookings/schedule?lab=${lab}&date=${ngay}`, Object.assign({ tags: { loai: 'lich' } }, auth));\n  else r = http.get(`${API}/bookings/mine?size=20`, Object.assign({ tags: { loai: 'cua-toi' } }, auth));\n  check(r, { 'trả 200': (res) => res.status === 200 });\n}");
const MA163_DUNG = js("// dung.js — cùng một endpoint, cùng một lần \"đứng hình\" 3 giây của server, đo bằng HAI mô hình tải.\n// MO=1: mô hình MỞ (constant-arrival-rate, như người dùng thật: ai đến cứ đến). Không có MO: mô hình ĐÓNG (10 VU gửi-chờ-gửi).\nimport http from 'k6/http';\nexport const options = {\n  discardResponseBodies: true,\n  summaryTrendStats: ['avg', 'p(50)', 'p(95)', 'p(99)', 'max'],\n  scenarios: { s: __ENV.MO\n    ? { executor: 'constant-arrival-rate', rate: 200, timeUnit: '1s', duration: '20s', preAllocatedVUs: 50, maxVUs: 1000 }\n    : { executor: 'constant-vus', vus: 10, duration: '20s' } },\n};\nexport default function () { http.get('http://localhost:8080/api/v1/demo16/cho?ms=50'); }");
const MA163_BC = java("// demo16/BaoCao.java — báo cáo phút sử dụng theo tháng (labflow.d16.bao-cao=cham|nhanh)\nKetQua tao(String lab) {\n    List<Dong> ds = db.sql(\"\"\"\n            select b.start_at, b.end_at, b.purpose from bookings b join labs l on l.id = b.lab_id\n            where l.code = ? and b.status = 'CONFIRMED' order by b.start_at\"\"\")\n        .param(lab).query(Dong.class).list();\n    Map<String, Integer> phut = new TreeMap<>();\n    int doAn = 0;\n    for (Dong d : ds) {\n        String thang; boolean laDoAn;\n        if (nhanh) {\n            thang = d.startAt().format(THANG);                                        // formatter dựng sẵn\n            laDoAn = DO_AN.matcher(d.purpose()).matches();                            // Pattern biên dịch MỘT lần\n        } else {\n            thang = d.startAt().format(DateTimeFormatter.ofPattern(\"yyyy-MM\"));      // dựng formatter mỗi dòng\n            laDoAn = d.purpose().matches(\"(?i).*\\\\b(do an|đồ án|swp|capstone)\\\\b.*\"); // String.matches = Pattern.compile mỗi dòng\n        }\n        int p = (int) java.time.Duration.between(d.startAt(), d.endAt()).toMinutes();\n        phut.merge(nhanh ? thang : String.format(\"%s\", thang), p, Integer::sum);     // String.format thừa\n        if (laDoAn) doAn++;\n    }\n    return new KetQua(lab, ds.size(), phut, doAn);\n}");
const MA163_RE = java("/**\n * 16.3 góc hacker: \"lọc\" ô mục đích bằng một regex kiểu luật WAF (chặn chuỗi có dạng a=b). Java 9+ đã tự chữa kiểu lồng (a+)+,\n * nhưng .* nối tiếp .* vẫn là backtracking đa thức: n ký tự ⇒ cỡ n² bước — đúng loại regex làm sập Cloudflare 02/07/2019.\n */\nprivate static final java.util.regex.Pattern LOC = java.util.regex.Pattern.compile(\".*(?:.*=.*)\");\n@PostMapping(\"/kiem-muc-dich\")\nMap<String, Object> kiemMucDich(@RequestBody Map<String, String> b) {\n    String s = b.getOrDefault(\"purpose\", \"\");\n    long t0 = System.nanoTime();\n    boolean nghi = LOC.matcher(s).matches();\n    return Map.of(\"doDai\", s.length(), \"nghiNgo\", nghi, \"ms\", (System.nanoTime() - t0) / 1_000_000);\n}");
const OUT163A = out("## 16.3a — Kịch bản đo tải giống người dùng thật (labflow.js): 20 tài khoản, trộn 3 loại request đọc, tăng dần lên 200 lượt/giây rồi giữ 30 giây\n$ k6 run labflow.js -e RATE=200 -e MK=\"$MAT_KHAU_SV\" | grep -vE \"^\\s*$\" ; echo \"mã thoát của k6: ${PIPESTATUS[0]}\"\n  █ THRESHOLDS \n    checks\n    ✓ 'rate>0.99' rate=100.00%\n    http_req_duration{loai:cua-toi}\n    ✓ 'p(95)<200' p(95)=11.03ms\n    http_req_duration{loai:lich}\n    ✓ 'p(95)<200' p(95)=29.68ms\n    http_req_failed\n    ✓ 'rate<0.01' rate=0.28%\n  █ TOTAL RESULTS \n    checks_total.......: 6999    167.279539/s\n    checks_succeeded...: 100.00% 6999 out of 6999\n    checks_failed......: 0.00%   0 out of 6999\n    ✓ trả 200\n    HTTP\n    http_req_duration..............: avg=13.71ms p(50)=12.69ms p(95)=27.23ms p(99)=84.81ms max=465.84ms\n      { expected_response:true }...: avg=13.7ms  p(50)=12.71ms p(95)=27.23ms p(99)=84.67ms max=465.84ms\n      { loai:cua-toi }.............: avg=5.72ms  p(50)=3.07ms  p(95)=11.03ms p(99)=51.94ms max=246.97ms\n      { loai:lich }................: avg=18.84ms p(50)=15.44ms p(95)=29.68ms p(99)=92.37ms max=465.84ms\n    http_req_failed................: 0.28%  20 out of 7039\n    http_reqs......................: 7039   168.235558/s\n    EXECUTION\n    iteration_duration.............: avg=13.73ms p(50)=12.88ms p(95)=26.99ms p(99)=83.01ms max=466.28ms\n    iterations.....................: 6999   167.279539/s\n    vus............................: 3      min=0          max=7 \n    vus_max........................: 50     min=50         max=50\n    NETWORK\n    data_received..................: 5.4 MB 130 kB/s\n    data_sent......................: 2.4 MB 57 kB/s\nmã thoát của k6: 0");
const OUT163B = out("## 16.3b — Truy vấn nào ăn thời gian CSDL? pg_stat_statements (bật sẵn trong PostgreSQL của lab)\n$ k6 run labflow.js -e RATE=200 -e GIU=20s -e MK=\"$MAT_KHAU_SV\" | grep -E \"✗|✓|http_req_duration\\{loai|http_reqs\\.|^\\s+(http_req_failed)\" ; true\n    ✓ 'rate>0.99' rate=100.00%\n    http_req_duration{loai:cua-toi}\n    ✓ 'p(95)<200' p(95)=4.68ms\n    http_req_duration{loai:lich}\n    ✓ 'p(95)<200' p(95)=21.55ms\n    http_req_failed\n    ✓ 'rate<0.01' rate=0.39%\n    ✓ trả 200\n    http_req_failed................: 0.39%  20 out of 5040\n    http_reqs......................: 5040   160.906491/s\n\n$ psql -c \"select calls, round(mean_exec_time::numeric,2) as tb_ms, round(total_exec_time::numeric) as tong_ms, left(regexp_replace(query, '\\s+', ' ', 'g'), 90) as cau from pg_stat_statements where query not like '%pg_stat%' order by total_exec_time desc limit 4\"\n calls | tb_ms | tong_ms |                                            cau                                             \n-------+-------+---------+--------------------------------------------------------------------------------------------\n  3005 | 10.93 |   32845 | select b1_0.id,b1_0.end_at,b1_0.idempotency_key,b1_0.lab_id,b1_0.owner_id,b1_0.purpose,b1_\n  5000 |  0.01 |      43 | BEGIN READ ONLY\n   987 |  0.04 |      36 | select l1_0.id,l1_0.building,l1_0.capacity,l1_0.code,l1_0.name,l1_0.requires_approval,l1_0\n  1008 |  0.02 |      21 | select b1_0.id,b1_0.end_at,b1_0.idempotency_key,b1_0.lab_id,b1_0.owner_id,b1_0.purpose,b1_\n(4 rows)\n\n## Kế hoạch thực thi của câu \"lịch trong ngày\"\n$ psql -c \"explain (analyze, buffers, costs off) select * from bookings b where b.lab_id = 1 and b.status in ('PENDING','CONFIRMED') and b.start_at < '2023-05-11' and b.end_at > '2023-05-10' order by b.start_at\"\n                                                                                                              QUERY PLAN                                                                                                               \n---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n Gather Merge (actual time=12.243..15.449 rows=5 loops=1)\n   Workers Planned: 2\n   Workers Launched: 2\n   Buffers: shared hit=3547\n   ->  Sort (actual time=10.042..10.043 rows=2 loops=3)\n         Sort Key: start_at\n         Sort Method: quicksort  Memory: 25kB\n         Buffers: shared hit=3547\n         ->  Parallel Seq Scan on bookings b (actual time=4.175..9.992 rows=2 loops=3)\n               Filter: (((status)::text = ANY ('{PENDING,CONFIRMED}'::text[])) AND (start_at < '2023-05-11 00:00:00'::timestamp without time zone) AND (end_at > '2023-05-10 00:00:00'::timestamp without time zone) AND (lab_id = 1))\n               Rows Removed by Filter: 66665\n               Buffers: shared hit=3473\n Execution Time: 15.476 ms\n(18 rows)\n\n## Thêm chỉ mục (lab_id, start_at) và một cận dưới: lượt đặt dài tối đa 240 phút (BR-04) ⇒ start_at >= đầu ngày − 4 giờ\n$ psql -c \"create index bookings_lab_start on bookings (lab_id, start_at)\" \nCREATE INDEX\n\n$ psql -c \"explain (analyze, costs off) select * from bookings b where b.lab_id = 1 and b.status in ('PENDING','CONFIRMED') and b.start_at < '2023-05-11' and b.end_at > '2023-05-10' order by b.start_at\" | grep -E \"Scan|Rows Removed|Execution\"\n   ->  Bitmap Heap Scan on bookings b (actual time=2.209..2.547 rows=5 loops=1)\n         Rows Removed by Filter: 6872\n         ->  Bitmap Index Scan on bookings_lab_start (actual time=0.491..0.491 rows=6877 loops=1)\n Execution Time: 2.600 ms\n\n$ psql -c \"explain (analyze, costs off) select * from bookings b where b.lab_id = 1 and b.status in ('PENDING','CONFIRMED') and b.start_at >= timestamp '2023-05-10' - interval '240 minute' and b.start_at < '2023-05-11' and b.end_at > '2023-05-10' order by b.start_at\" | grep -E \"Scan|Index Cond|Rows Removed|Execution\"\n Index Scan using bookings_lab_start on bookings b (actual time=0.039..0.050 rows=5 loops=1)\n   Index Cond: ((lab_id = 1) AND (start_at >= '2023-05-09 20:00:00'::timestamp without time zone) AND (start_at < '2023-05-11 00:00:00'::timestamp without time zone))\n   Rows Removed by Filter: 4\n Execution Time: 0.068 ms\n\n## Đo lại cùng kịch bản khi đã có chỉ mục\n$ k6 run labflow.js -e RATE=200 -e GIU=20s -e MK=\"$MAT_KHAU_SV\" | grep -E \"✗|✓|http_req_duration\\{loai|http_reqs\\.|^\\s+(http_req_failed)\" ; true\n    ✓ 'rate>0.99' rate=100.00%\n    http_req_duration{loai:cua-toi}\n    ✓ 'p(95)<200' p(95)=3.59ms\n    http_req_duration{loai:lich}\n    ✓ 'p(95)<200' p(95)=7.32ms\n    http_req_failed\n    ✓ 'rate<0.01' rate=0.39%\n    ✓ trả 200\n    http_req_failed................: 0.39%  20 out of 5039\n    http_reqs......................: 5039   160.782332/s\n\n$ psql -c \"select calls, round(mean_exec_time::numeric,2) as tb_ms, round(total_exec_time::numeric) as tong_ms, left(regexp_replace(query, '\\s+', ' ', 'g'), 60) as cau from pg_stat_statements where query not like '%pg_stat%' order by total_exec_time desc limit 2\"\n calls | tb_ms | tong_ms |                             cau                              \n-------+-------+---------+--------------------------------------------------------------\n  2963 |  1.76 |    5219 | select b1_0.id,b1_0.end_at,b1_0.idempotency_key,b1_0.lab_id,\n  4999 |  0.01 |      41 | BEGIN READ ONLY\n(2 rows)");
const OUT163C = out("## 16.3c — Báo cáo sử dụng phòng theo tháng (25.000 lượt của một phòng): đo với 4 lượt/giây\n$ taimo \"báo cáo\" \"/api/v1/demo16/bao-cao?lab=IOT-01\" 4 20s\nbáo cáo                81 req     4.0 req/s  lỗi   0.0%  p50   190  p95   417  p99   534  max   563 ms\n\n$ curl -s \"$API/api/v1/demo16/bao-cao?lab=IOT-01\" | jq -c '{lab, luot, luotDoAn, thang: (.phutTheoThang | length)}'\n{\"lab\":\"IOT-01\",\"luot\":25001,\"luotDoAn\":8333,\"thang\":206}\n\n## Ghi Java Flight Recorder 20 giây trong lúc chịu tải — JFR có sẵn trong JDK, chi phí khoảng 1–2 %\n$ taimo \"\" \"/api/v1/demo16/bao-cao?lab=IOT-01\" 4 24s >/dev/null & K=$!; sleep 2; docker exec labflow jcmd 1 JFR.start name=bc settings=profile duration=20s filename=/jfr/bao-cao.jfr; wait $K; sleep 2\n\n$ jfr view hot-methods /jfr/bao-cao.jfr | head -16\n\n                                          Java Methods that Executes the Most\n\nMethod                                                                                                  Samples Percent\n------------------------------------------------------------------------------------------------------- ------- -------\njava.lang.String.hashCode()                                                                                  39   6.91%\norg.springframework.aop.framework.JdkDynamicAopProxy.invoke(Object, Method, Object[])                        38   6.74%\nnet.ttddyy.observation.tracing.DataSourceObservationListener.afterMethod(MethodExecutionContext)             24   4.26%\njava.util.regex.Pattern.atom()                                                                               23   4.08%\nnet.ttddyy.observation.boot.SpringJdbcProxyFactory.lambda$createProxy$0(...)                                 20   3.55%\njava.util.regex.Pattern$CharPropertyGreedy.match(Matcher, int, CharSequence)                                 20   3.55%\njava.lang.AbstractStringBuilder.ensureCapacityInternal(int)                                                  17   3.01%\nnet.ttddyy.dsproxy.proxy.ProxyLogicSupport.proceedMethodExecution(...)                                       17   3.01%\njava.lang.CharacterData00.getType(int)                                                                       16   2.84%\njava.util.HashMap.getNode(Object)                                                                            15   2.66%\njava.util.regex.Pattern.sequence(Pattern$Node)                                                               11   1.95%\n\n## Hai dòng đầu là gì? Hỏi JFR ngăn xếp đầy đủ của mẫu nóng nhất\n$ docker exec labflow sh -c 'jfr print --events jdk.ExecutionSample --stack-depth 30 /jfr/bao-cao.jfr' | awk '/HashMap.getNode/{f=1} f&&/line:/{print; n++} n==14{exit}' | sed -E 's/^\\s+//'\njava.util.HashMap.getNode(Object) line: 587\njava.util.HashMap.get(Object) line: 564\norg.springframework.core.convert.TypeDescriptor.valueOf(Class) line: 579\norg.springframework.core.convert.TypeDescriptor.forObject(Object) line: 562\norg.springframework.core.convert.ConversionService.convert(Object, TypeDescriptor) line: 90\norg.springframework.jdbc.core.SimplePropertyRowMapper.mapRow(ResultSet, int) line: 143\norg.springframework.jdbc.core.RowMapperResultSetExtractor.extractData(ResultSet) line: 110\norg.springframework.jdbc.core.RowMapperResultSetExtractor.extractData(ResultSet) line: 62\norg.springframework.jdbc.core.JdbcTemplate.lambda$query$0(PreparedStatementSetter, ResultSetExtractor, PreparedStatement) line: 739\norg.springframework.jdbc.core.JdbcTemplate.execute(PreparedStatementCreator, PreparedStatementCallback, boolean) line: 670\norg.springframework.jdbc.core.JdbcTemplate.query(PreparedStatementCreator, PreparedStatementSetter, ResultSetExtractor) line: 732\norg.springframework.jdbc.core.JdbcTemplate.query(String, PreparedStatementSetter, ResultSetExtractor) line: 757\norg.springframework.jdbc.core.JdbcTemplate.query(String, RowMapper, Object[]) line: 825\norg.springframework.jdbc.core.simple.DefaultJdbcClient$DefaultStatementSpec$IndexedParamMappedQuerySpec.list() line: 390\n\n## Sửa đúng ba dòng JFR chỉ ra (Pattern và formatter dựng MỘT lần, bỏ String.format) rồi đo lại\n$ taimo \"báo cáo (đã sửa)\" \"/api/v1/demo16/bao-cao?lab=IOT-01\" 4 20s\nbáo cáo (đã sửa)       81 req     4.0 req/s  lỗi   0.0%  p50   138  p95   333  p99   350  max   362 ms\n\n$ curl -s \"$API/api/v1/demo16/bao-cao?lab=IOT-01\" | jq -c '{lab, luot, luotDoAn, thang: (.phutTheoThang | length)}'\n{\"lab\":\"IOT-01\",\"luot\":25001,\"luotDoAn\":8333,\"thang\":206}\n\n$ taimo \"\" \"/api/v1/demo16/bao-cao?lab=IOT-01\" 4 24s >/dev/null & K=$!; sleep 2; docker exec labflow jcmd 1 JFR.start name=bc settings=profile duration=20s filename=/jfr/bao-cao2.jfr; wait $K; sleep 2\n\n$ jfr view hot-methods /jfr/bao-cao2.jfr | head -12\n\n                                          Java Methods that Executes the Most\n\nMethod                                                                                                  Samples Percent\n------------------------------------------------------------------------------------------------------- ------- -------\njava.util.HashMap.getNode(Object)                                                                            58  13.62%\njava.util.concurrent.ConcurrentHashMap.get(Object)                                                           43  10.09%\njava.util.regex.Pattern$GroupHead.match(Matcher, int, CharSequence)                                          39   9.15%\nnet.ttddyy.dsproxy.proxy.ProxyLogicSupport.proceedMethodExecution(...)                                       29   6.81%\nnet.ttddyy.observation.tracing.DataSourceObservationListener.afterMethod(MethodExecutionContext)             26   6.10%\norg.springframework.aop.framework.JdkDynamicAopProxy.invoke(Object, Method, Object[])                        25   5.87%\njava.util.regex.Pattern$CharPropertyGreedy.match(Matcher, int, CharSequence)                                 22   5.16%\n\n## Thủ phạm bất ngờ: datasource-micrometer (Chương 15) quan sát TỪNG lần đọc ResultSet. Chỉ giữ quan sát kết nối + câu lệnh\n$ taimo \"báo cáo (sửa + bỏ quan sát FETCH)\" \"/api/v1/demo16/bao-cao?lab=IOT-01\" 4 20s\nbáo cáo (sửa + bỏ quan sát FETCH)     81 req     4.0 req/s  lỗi   0.0%  p50    69  p95    94  p99   106  max   122 ms");
const OUT163D = out("## 16.3d — Góc hacker: ô \"mục đích\" được lọc bằng regex .*(?:.*=.*) (chặn chuỗi dạng a=b) — gửi chuỗi KHÔNG có dấu = và dài dần\n$ for n in 1000 5000 10000 20000 40000; do head -c $n /dev/zero | tr '\\0' x | jq -Rc '{purpose: .}' | curl -s -H \"$J\" -d @- $API/api/v1/demo16/kiem-muc-dich; echo; done\n{\"doDai\":1000,\"ms\":7,\"nghiNgo\":false}\n{\"doDai\":5000,\"ms\":153,\"nghiNgo\":false}\n{\"doDai\":10000,\"ms\":656,\"nghiNgo\":false}\n{\"doDai\":20000,\"ms\":2098,\"nghiNgo\":false}\n{\"doDai\":40000,\"ms\":9613,\"nghiNgo\":false}\n\n## Bốn request độc 40.000 ký tự cùng lúc (mỗi cái 40 KB): hai CPU của app bận hết, người khác thì sao?\n$ head -c 40000 /dev/zero | tr '\\0' x | jq -Rc '{purpose: .}' > /tmp/doc.json\n\n$ for i in 1 2 3 4; do curl -s -o /dev/null -m 120 -H \"$J\" -d @/tmp/doc.json $API/api/v1/demo16/kiem-muc-dich & P=\"$P $!\"; done; sleep 3; curl -s -o /dev/null -w 'GET /labs/IOT-01 (cache) trong lúc đó: HTTP %{http_code} sau %{time_total}s\\n' $API/api/v1/labs/IOT-01; docker stats --no-stream --format 'CPU của app: {{.CPUPerc}}' labflow; wait $P\nGET /labs/IOT-01 (cache) trong lúc đó: HTTP 200 sau 1.163490s\nCPU của app: 199.55%");
const OUT163E = out("## 16.3e — Làm nóng (JIT): endpoint một truy vấn nhỏ, vừa khởi động xong đo ngay, rồi đo lại cùng tải lần nữa\n$ taimo \"lượt 1 (máy lạnh)\" \"/api/v1/demo16/db\" 50 10s\nlượt 1 (máy lạnh)     501 req    50.1 req/s  lỗi   0.0%  p50   3.6  p95    11  p99    73  max   170 ms\n\n$ taimo \"lượt 2\" \"/api/v1/demo16/db\" 50 10s\nlượt 2                501 req    50.1 req/s  lỗi   0.0%  p50   2.4  p95   5.3  p99   8.1  max    17 ms\n\n$ taimo \"lượt 3\" \"/api/v1/demo16/db\" 50 10s\nlượt 3                500 req    50.0 req/s  lỗi   0.0%  p50   2.0  p95   4.2  p99   5.7  max    11 ms");
const OUT163F = out("## 16.3f — Cùng endpoint 50 ms, cùng một lần server \"đứng hình\" 3 giây (docker pause — giống GC dừng cả thế giới hay máy ảo bị chiếm CPU)\n$ k6 run dung.js & K=$!; sleep 9; docker pause labflow >/dev/null; sleep 3; docker unpause labflow >/dev/null; wait $K\nmô hình ĐÓNG (10 VU)     3251 req  avg    61  p50    52  p95    56  p99    62  max  3090 ms\n\n$ k6 run dung.js -e MO=1 & K=$!; sleep 9; docker pause labflow >/dev/null; sleep 3; docker unpause labflow >/dev/null; wait $K\nmô hình MỞ  (200 req/s)  3715 req  avg   156  p50    51  p95    56  p99  2973  max  3101 ms");

const L163_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3 · Performance</span>
<h2>Load testing and profiling</h2>
<p class="lead">"It feels slow" is not a bug report, and "I added a cache, it feels faster" is not a fix. This lesson is the method professionals use: write a load test that behaves like real users, read p50/p95/p99 instead of an average, avoid the two classic measurement mistakes (coordinated omission and a cold JVM), then find the bottleneck with tools instead of guesses — <code>pg_stat_statements</code> + <code>EXPLAIN</code> for the database and <strong>Java Flight Recorder</strong> for the JVM. On LabFlow the profiler finds a cost nobody suspected, and a regex in an input filter does to LabFlow what one regex did to Cloudflare in 2019.</p>

<h3>Everyday picture first</h3>
<p>You want to know how fast a coffee shop serves. Method A: you stand in line, order, wait, then get back in line — ten friends doing the same. If the barista disappears for 3 minutes, your ten friends wait once, and you record ten slow orders out of hundreds. Method B: you stand outside and note every customer who arrives — 3 per second, as on a normal morning — and how long each one waits. The 3-minute pause now shows up in hundreds of customers. Method A is what most load tools do by default. Method B is what your users experience.</p>

<h3>1. A load test that looks like users</h3>
${MA163_K6}
<ul>
  <li><code>setup()</code> runs once: 20 accounts, 20 tokens — login is not part of what we measure.</li>
  <li><strong>Executor</strong> <code>ramping-arrival-rate</code>: a fixed number of <em>iterations per second</em> (open model, section 3), ramping up for 10 s to warm up, then 30 s steady.</li>
  <li>A <strong>mix</strong> of requests with tags (<code>loai</code>) so each type gets its own percentiles — the dashboard of Chapter 15 groups by endpoint too.</li>
  <li><strong>Thresholds</strong> are the performance contract: if p95 of the schedule exceeds 200 ms or more than 1 % fail, k6 exits with code 99 and the CI job is red. Performance becomes a test, not an opinion.</li>
</ul>
${OUT163A}
<p>All four thresholds pass at 168 requests/second: schedule p95 29.7 ms, "my bookings" p95 11 ms, exit code 0. The 20 "failed" requests (0.28 %) are the 20 <code>register</code> calls in <code>setup()</code> that got 409 because the accounts already existed from a previous run — read failures before trusting the rest. <code>avg</code> is printed but never used for decisions (lesson 15.2).</p>

<h3>2. Two measurement mistakes that hide problems</h3>
<p><strong>Coordinated omission.</strong> The same 50 ms endpoint, the same 3-second freeze of the server (<code>docker pause</code> — like a stop-the-world GC pause or a noisy neighbour on a VM), measured with the two models:</p>
${MA163_DUNG}
${OUT163F}
<ul>
  <li>Closed model (10 VUs send-wait-send): p99 <strong>62 ms</strong>. During the freeze the 10 VUs simply stopped sending, so only 10 requests were slow; the tool <em>coordinated</em> with the server and <em>omitted</em> the requests real users would have sent. It also sent fewer requests (3,251).</li>
  <li>Open model (200 requests/second no matter what): p99 <strong>2,973 ms</strong>. Every user who arrived during the freeze is counted.</li>
</ul>
<p>Gil Tene named this "coordinated omission". <code>wrk</code>, <code>ab</code> and k6's VU executors are closed; use arrival-rate executors (k6) or <code>wrk2</code> when the question is "what do users see".</p>
<p><strong>A cold JVM.</strong> Java starts interpreting bytecode and compiles hot methods with the JIT while it runs:</p>
${OUT163E}
<p>Same load three times right after startup: p99 73 → 8.1 → 5.7 ms, max 170 → 17 → 11 ms. Never compare the first run of version A with the third run of version B; warm up (the 10-second ramp in <code>labflow.js</code>) or discard the first minute.</p>

<h3>3. Finding the database bottleneck: pg_stat_statements + EXPLAIN</h3>
<p>Double the rate to 200 per second and ask PostgreSQL which statements cost the most <em>in total</em>:</p>
${OUT163B}
<ul>
  <li>The schedule query (<code>select b1_0.id, …</code>, the first line) costs 32.8 s of database time in 20 s of test — 10.9 ms each × 3,005 calls. Everything else is noise. Sort by <code>total_exec_time</code>, not by the slowest single query: a 10 ms query called 3,000 times matters more than a 2 s report called once.</li>
  <li><code>EXPLAIN (ANALYZE, BUFFERS)</code>: <strong>Parallel Seq Scan</strong> on 200,000 rows, 66,665 removed per worker, to return 5. No index covers <code>lab_id</code> + <code>start_at</code> (the exclusion constraint of Chapter 7 uses a GiST index on a <code>tsrange</code> expression, which this query shape cannot use).</li>
  <li>Index <code>(lab_id, start_at)</code>: bitmap index scan, still 6,872 rows removed — <code>start_at &lt; end of day</code> matches every older booking of that lab. 15.5 → 2.6 ms.</li>
  <li>Plus a lower bound from a business rule — a booking lasts at most 240 minutes (BR-04), so it must start after <code>day − 4 hours</code>: a tight index range, 4 rows removed, <strong>0.068 ms</strong>. Business rules are performance tools.</li>
  <li>The same k6 run with the index: schedule p95 21.6 → 7.3 ms, and the query's mean inside PostgreSQL 10.9 → 1.8 ms.</li>
</ul>

<h3>4. Finding the JVM bottleneck: Java Flight Recorder</h3>
<p>A monthly usage report for one lab (25,000 bookings) takes ~170 ms. The code looks innocent; it has three classic mistakes that are easy to spot once you know them:</p>
${MA163_BC}
<p><strong>JFR</strong> is built into the JDK: it samples what every thread is executing ~every 10–20 ms, with ~1–2 % overhead, so it can run in production. Start it on the running app with <code>jcmd &lt;pid&gt; JFR.start duration=20s filename=…</code> while the load test runs, then read it with the <code>jfr</code> tool (or JDK Mission Control):</p>
${OUT163C}
<ul>
  <li>The planned culprits are there — <code>Pattern.atom</code>, <code>Pattern.sequence</code> (compiling the regex for every row), <code>CharPropertyGreedy.match</code> — but they are not at the top.</li>
  <li>The top is <code>String.hashCode</code>, <code>HashMap.getNode</code>, <code>JdkDynamicAopProxy.invoke</code> and two classes from <code>net.ttddyy</code>: that is <strong>datasource-micrometer</strong>, the library added in lesson 15.3 for SQL spans. It wraps the <code>ResultSet</code> in a proxy and creates an observation for every <code>next()</code>/<code>getXxx()</code> — 25,000 rows × 3 columns. The full stack of the hottest sample also shows <code>SimplePropertyRowMapper</code> converting each column through <code>TypeDescriptor</code> lookups.</li>
  <li>Fixing the three "obvious" lines: p50 170 → 138 ms. Keeping SQL observation but not per-row FETCH events (<code>jdbc.includes=CONNECTION,QUERY</code>): p50 <strong>69 ms</strong>, p95 365 → 94 ms. The biggest win came from a line nobody would have suspected without a profiler.</li>
</ul>
<p>LabFlow now sets <code>jdbc.includes=CONNECTION,QUERY</code> in production: the trace still shows every statement and its time, just not every row. A <strong>flame graph</strong> draws the same samples as stacked boxes (width = share of CPU); the course uses a 60-line script (<code>t/lua.py</code>) that converts <code>jfr print --json</code> into an SVG, and async-profiler and IntelliJ's profiler draw it directly.</p>

<h3>5. A checklist for an honest measurement</h3>
<ul>
  <li>Load generator on its own CPUs (here a separate container with its own 2–3 CPUs) — otherwise you measure k6 fighting your app.</li>
  <li>Realistic data volume: the schedule query was 0.1 ms on 4 bookings and 11 ms on 200,000. Seed production-sized data.</li>
  <li>Warm up, use an open model, read p95/p99 and errors, run each version at least twice.</li>
  <li>Change one thing at a time and write down the environment (CPU, versions, data size). The numbers in this chapter were measured while the build machine was also rendering videos — absolute numbers vary ±10 %, comparisons made back-to-back hold.</li>
</ul>

<h3>🕵️ Hacker corner — Cloudflare, 2 July 2019: one regex, 27 minutes, the whole network</h3>
<p>Cloudflare deployed a new WAF rule containing <code>.*(?:.*=.*)</code>. On every request the regex engine backtracked: for a string of n characters without a match, the nested <code>.*</code> try ~n² positions. CPUs on every edge server went to 100 % and Cloudflare-served sites returned 502 for 27 minutes. (Stack Overflow had a 34-minute outage on 20 July 2016 for the same family of reasons: a whitespace-trimming regex on one long post.) The same pattern in a LabFlow input filter:</p>
${MA163_RE}
${OUT163D}
<ul>
  <li>Quadratic: 1,000 characters 7 ms, 10,000 → 656 ms, 40,000 → <strong>9.6 s</strong> for <em>one</em> request of 40 KB.</li>
  <li>Four such requests occupy both CPUs (199.6 %), and an unrelated cached endpoint takes 1.16 s instead of a few ms.</li>
  <li>Good news, measured on Java 21: the textbook exponential patterns <code>(a+)+</code>, <code>(a|a)+</code> run in 0 ms on 26 characters — Java 9+ memoises those loops. Polynomial patterns like Cloudflare's are still dangerous, and <code>java.util.regex</code> has no timeout.</li>
</ul>
<p>Defence: limit input size before any regex (<code>@Size(max = 200)</code> on <code>purpose</code>, request body limits), avoid <code>.*</code> next to <code>.*</code>, prefer simple string checks, use a linear-time engine (RE2/J) for user-supplied or complex patterns, and keep a CPU profile handy: JFR would show <code>java.util.regex.Pattern$…</code> at the top within seconds.</p>

<h3>Compared with Node.js</h3>
<p>The tools change, the method does not: <code>autocannon</code> (closed model, like wrk), k6 works the same against Express; <code>node --cpu-prof</code>, <code>clinic flame</code> or Chrome DevTools for flame graphs; <code>pg_stat_statements</code> is identical. Two Node-specific points: a slow regex or JSON parse blocks the <em>only</em> event loop, so ReDoS hurts Node even more (lesson 16.4 measures a blocked event loop); and V8 also warms up (Ignition → TurboFan), so the cold-start rule applies.</p>

<h3>At work</h3>
<ul>
  <li>Performance tickets get a number before and after: "p95 of GET /schedule at 200 req/s on staging data: 29.7 ms → 7.3 ms". Without that line, the change is an opinion.</li>
  <li>Keep a k6 script with thresholds in the repository and run it nightly or before releases; a failing threshold is a regression caught before users see it.</li>
  <li>Turn on <code>pg_stat_statements</code> in every PostgreSQL you own; it is the first query of any database investigation.</li>
  <li>Record JFR on staging under load at least once per release; keep the recordings to compare.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you load test an API?"</strong> — Realistic scenario and data, open-model arrival rate, warm-up, thresholds on p95/p99 and errors, load generator separate from the system, run twice; read the database and the JVM during the test.</li>
  <li><strong>"What is coordinated omission?"</strong> — A closed-model tool stops sending while the server stalls, so it omits the requests users would have sent; measured p99 62 ms vs 2,973 ms for the same 3 s pause.</li>
  <li><strong>"An endpoint is slow. How do you find out why?"</strong> — Trace/metrics to see where time goes; <code>pg_stat_statements</code> sorted by total time + <code>EXPLAIN ANALYZE</code> for SQL; JFR (or async-profiler) for CPU in the JVM. Measure the fix.</li>
  <li><strong>"What is ReDoS?"</strong> — Regex backtracking that grows exponentially or polynomially with input length; Cloudflare 2019. Limit input, avoid nested/adjacent quantifiers, use linear-time engines.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<ol>
  <li>Change <code>labflow.js</code> so that 5 % of iterations create a booking (with an <code>Idempotency-Key</code>), and add a threshold for its p95. What problem do you hit with 20 accounts and the rate limiter of Chapter 13, and how do you design around it?</li>
  <li>The schedule query still uses <code>start_at &lt; :to and end_at &gt; :from</code>. Write the JPQL with the extra lower bound from BR-04 and the Flyway migration for the index.</li>
  <li>JFR shows 40 % of samples in <code>com.fasterxml.jackson…</code> for <code>GET /bookings/mine?size=100</code>. List two possible causes and how you would confirm each.</li>
</ol>
${giai('Show answers', `<p>1. Each account may book only 5 times per minute (HTTP 429), so at 200 iterations/second the 5 % of writes need far more accounts: create hundreds in <code>setup()</code> (or disable the limiter with a test profile and say so in the report). Also use free time slots per iteration or the exclusion constraint returns 409 — check the status explicitly.</p><p>2. <code>where b.labId = :lab and b.status in ('PENDING','CONFIRMED') and b.startAt &gt;= :tuSom and b.startAt &lt; :to and b.endAt &gt; :from</code> with <code>tuSom = from.minusMinutes(240)</code>; migration <code>create index bookings_lab_start on bookings (lab_id, start_at)</code> (on a big production table: <code>create index concurrently</code> in its own non-transactional migration).</p><p>3. Serialising too much (size=100 with large nested objects, or lazy relations being loaded during serialisation — check the SQL count per request), or a new <code>ObjectMapper</code> per request (check allocation and <code>jfr view allocation-by-class</code>). Confirm with a smaller page and with the trace's SQL spans.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Load test</strong> — running a realistic, controlled workload to measure latency, throughput and errors.</li>
  <li><strong>Open / closed model</strong> — requests arrive at a fixed rate / each virtual user waits for its answer before sending again.</li>
  <li><strong>Coordinated omission</strong> — a measurement error where the load generator slows down with the server and hides stalls.</li>
  <li><strong>Threshold</strong> — a pass/fail condition on a k6 metric; failure makes k6 exit non-zero.</li>
  <li><strong>JIT warm-up</strong> — the period while the JVM compiles hot code; early measurements are slower.</li>
  <li><strong>pg_stat_statements</strong> — PostgreSQL extension that aggregates time and calls per normalised statement.</li>
  <li><strong>JFR (Java Flight Recorder)</strong> — low-overhead event and sampling recorder built into the JDK.</li>
  <li><strong>Flame graph</strong> — visualisation of sampled stacks; width = share of samples.</li>
  <li><strong>ReDoS</strong> — denial of service through regex backtracking.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Write the test like users behave: realistic data, open model, warm-up, thresholds that fail CI.</li>
  <li>Closed-model tools and a cold JVM both lie: p99 62 ms vs 2,973 ms for the same pause; p99 73 ms vs 5.7 ms before and after warm-up.</li>
  <li>Find, don't guess: <code>pg_stat_statements</code> + <code>EXPLAIN</code> found a sequential scan (10.9 → 1.8 ms with an index, 0.07 ms with a business-rule bound); JFR found a tracing proxy costing half of a report (170 → 69 ms).</li>
  <li>A regex is code that can run for seconds: limit input, avoid adjacent <code>.*</code>, profile.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/', '📈', 'k6 — Open and closed models', 'why arrival-rate executors avoid coordinated omission')}
${tl('https://docs.oracle.com/en/java/javase/21/jfapi/', '🛩', 'JDK Flight Recorder API guide', 'events, jcmd, the jfr tool')}
${tl('https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/', '☁️', 'Cloudflare — Details of the outage on July 2, 2019', 'the regex, the backtracking, the fixes')}

<h3>Sources</h3>
<ul>
  <li>Cloudflare blog, "Details of the Cloudflare outage on July 2, 2019"; Stack Exchange status post-mortem, 20 July 2016.</li>
  <li>G. Tene, "How NOT to Measure Latency" (talk) — coordinated omission.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Java 21, datasource-micrometer 2.3.1) + PostgreSQL 16 (2 CPUs, 200,000 bookings) + k6 2.4.0 on the course build machine, 24–25/11/2026.</li>
</ul>
</div>
`;

const L163_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3 · Hiệu năng</span>
<h2>Đo tải và profiling</h2>
<p class="lead">"Em thấy nó chậm" không phải báo lỗi, còn "em thêm cache, thấy nhanh hơn" không phải cách sửa. Bài này là phương pháp người làm nghề dùng: viết bài đo tải cư xử như người dùng thật, đọc p50/p95/p99 thay vì trung bình, tránh hai lỗi đo kinh điển (coordinated omission và JVM còn lạnh), rồi tìm nút thắt bằng công cụ thay vì đoán — <code>pg_stat_statements</code> + <code>EXPLAIN</code> cho CSDL và <strong>Java Flight Recorder</strong> cho JVM. Trên LabFlow, profiler tìm ra một chi phí không ai ngờ tới, và một regex trong bộ lọc đầu vào làm với LabFlow đúng điều một regex đã làm với Cloudflare năm 2019.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn muốn biết một quán cà phê phục vụ nhanh cỡ nào. Cách A: bạn xếp hàng, gọi món, chờ, rồi xếp hàng lại — mười người bạn cũng làm y vậy. Nếu nhân viên pha chế biến mất 3 phút, mười người bạn của bạn chờ đúng một lần, và bạn ghi được mười đơn chậm trong hàng trăm đơn. Cách B: bạn đứng ngoài cửa ghi lại mọi khách bước vào — 3 người mỗi giây, như một buổi sáng bình thường — và mỗi người chờ bao lâu. Lần ngừng 3 phút giờ hiện ra ở hàng trăm khách. Cách A là thứ phần lớn công cụ đo tải làm mặc định. Cách B là thứ người dùng của bạn trải qua.</p>

<h3>1. Bài đo tải giống người dùng</h3>
${MA163_K6}
<ul>
  <li><code>setup()</code> chạy một lần: 20 tài khoản, 20 token — đăng nhập không nằm trong phần được đo.</li>
  <li><strong>Executor</strong> <code>ramping-arrival-rate</code>: số <em>lượt mỗi giây</em> cố định (mô hình mở, mục 2), tăng dần 10 giây để làm nóng, rồi giữ đều 30 giây.</li>
  <li>Một <strong>hỗn hợp</strong> request có gắn nhãn (<code>loai</code>) để mỗi loại có percentile riêng — bảng điều khiển Chương 15 cũng nhóm theo endpoint.</li>
  <li><strong>Threshold</strong> là hợp đồng hiệu năng: p95 của lịch vượt 200 ms hoặc hỏng hơn 1 % thì k6 thoát mã 99 và job CI đỏ. Hiệu năng thành một bài test, không còn là ý kiến.</li>
</ul>
${OUT163A}
<p>Cả bốn threshold đạt ở 168 request/giây: p95 của lịch 29,7 ms, "lượt của tôi" p95 11 ms, mã thoát 0. 20 request "hỏng" (0,28 %) là 20 lệnh <code>register</code> trong <code>setup()</code> nhận 409 vì tài khoản đã có từ lượt chạy trước — đọc phần lỗi trước khi tin phần còn lại. <code>avg</code> được in ra nhưng không bao giờ dùng để quyết định (bài 15.2).</p>

<h3>2. Hai lỗi đo che mất vấn đề</h3>
<p><strong>Coordinated omission.</strong> Cùng endpoint 50 ms, cùng một lần server đứng hình 3 giây (<code>docker pause</code> — giống GC dừng cả thế giới hay máy ảo bị hàng xóm chiếm CPU), đo bằng hai mô hình:</p>
${MA163_DUNG}
${OUT163F}
<ul>
  <li>Mô hình đóng (10 VU gửi–chờ–gửi): p99 <strong>62 ms</strong>. Trong lúc đứng hình, 10 VU đơn giản là ngừng gửi, nên chỉ 10 request chậm; công cụ đã <em>phối hợp</em> với server và <em>bỏ sót</em> những request người dùng thật lẽ ra đã gửi. Nó cũng gửi ít request hơn (3.251).</li>
  <li>Mô hình mở (200 request/giây dù gì đi nữa): p99 <strong>2.973 ms</strong>. Mọi người dùng tới trong lúc đứng hình đều được tính.</li>
</ul>
<p>Gil Tene đặt tên cho hiện tượng này là "coordinated omission". <code>wrk</code>, <code>ab</code> và các executor theo VU của k6 là mô hình đóng; dùng executor theo tốc độ đến (k6) hoặc <code>wrk2</code> khi câu hỏi là "người dùng thấy gì".</p>
<p><strong>JVM còn lạnh.</strong> Java bắt đầu bằng cách thông dịch bytecode và biên dịch các hàm nóng bằng JIT trong lúc chạy:</p>
${OUT163E}
<p>Cùng tải ba lần ngay sau khi khởi động: p99 73 → 8,1 → 5,7 ms, max 170 → 17 → 11 ms. Đừng bao giờ so lượt đầu của bản A với lượt ba của bản B; hãy làm nóng (10 giây tăng dần trong <code>labflow.js</code>) hoặc bỏ phút đầu.</p>

<h3>3. Tìm nút thắt ở CSDL: pg_stat_statements + EXPLAIN</h3>
<p>Nâng tốc độ lên gấp đôi, 200 mỗi giây, và hỏi PostgreSQL câu lệnh nào tốn nhiều <em>tổng thời gian</em> nhất:</p>
${OUT163B}
<ul>
  <li>Câu lấy lịch (<code>select b1_0.id, …</code>, dòng đầu) tốn 32,8 giây thời gian CSDL trong 20 giây đo — 10,9 ms mỗi lần × 3.005 lần. Mọi thứ khác chỉ là nhiễu. Sắp theo <code>total_exec_time</code>, không theo câu chậm nhất: câu 10 ms gọi 3.000 lần quan trọng hơn báo cáo 2 giây gọi một lần.</li>
  <li><code>EXPLAIN (ANALYZE, BUFFERS)</code>: <strong>Parallel Seq Scan</strong> trên 200.000 dòng, mỗi worker loại 66.665 dòng, để trả về 5. Không chỉ mục nào phủ <code>lab_id</code> + <code>start_at</code> (ràng buộc loại trừ ở Chương 7 dùng chỉ mục GiST trên biểu thức <code>tsrange</code>, kiểu câu này không dùng được).</li>
  <li>Chỉ mục <code>(lab_id, start_at)</code>: bitmap index scan, vẫn loại 6.872 dòng — <code>start_at &lt; cuối ngày</code> khớp mọi lượt cũ hơn của phòng đó. 15,5 → 2,6 ms.</li>
  <li>Thêm một cận dưới lấy từ quy tắc nghiệp vụ — một lượt đặt dài tối đa 240 phút (BR-04), nên nó phải bắt đầu sau <code>ngày − 4 giờ</code>: khoảng chỉ mục hẹp, loại 4 dòng, <strong>0,068 ms</strong>. Quy tắc nghiệp vụ cũng là công cụ hiệu năng.</li>
  <li>Cùng lượt k6 khi có chỉ mục: p95 của lịch 21,6 → 7,3 ms, thời gian trung bình của câu đó trong PostgreSQL 10,9 → 1,8 ms.</li>
</ul>

<h3>4. Tìm nút thắt trong JVM: Java Flight Recorder</h3>
<p>Báo cáo sử dụng theo tháng của một phòng (25.000 lượt đặt) mất khoảng 170 ms. Mã trông vô hại; nó có ba lỗi kinh điển, biết rồi thì dễ thấy:</p>
${MA163_BC}
<p><strong>JFR</strong> có sẵn trong JDK: cứ khoảng 10–20 ms nó lấy mẫu xem mỗi luồng đang chạy gì, chi phí khoảng 1–2 %, nên chạy được cả ở production. Bật nó trên ứng dụng đang chạy bằng <code>jcmd &lt;pid&gt; JFR.start duration=20s filename=…</code> trong lúc bài đo tải chạy, rồi đọc bằng công cụ <code>jfr</code> (hoặc JDK Mission Control):</p>
${OUT163C}
<ul>
  <li>Các thủ phạm đã đoán có mặt — <code>Pattern.atom</code>, <code>Pattern.sequence</code> (biên dịch regex cho mỗi dòng), <code>CharPropertyGreedy.match</code> — nhưng không đứng đầu.</li>
  <li>Đứng đầu là <code>String.hashCode</code>, <code>HashMap.getNode</code>, <code>JdkDynamicAopProxy.invoke</code> và hai lớp của <code>net.ttddyy</code>: đó là <strong>datasource-micrometer</strong>, thư viện thêm ở bài 15.3 để có span SQL. Nó bọc <code>ResultSet</code> trong một proxy và tạo một observation cho mỗi lần <code>next()</code>/<code>getXxx()</code> — 25.000 dòng × 3 cột. Ngăn xếp đầy đủ của mẫu nóng nhất còn cho thấy <code>SimplePropertyRowMapper</code> đổi kiểu từng cột qua tra cứu <code>TypeDescriptor</code>.</li>
  <li>Sửa ba dòng "hiển nhiên": p50 170 → 138 ms. Giữ quan sát câu SQL nhưng bỏ sự kiện FETCH theo từng dòng (<code>jdbc.includes=CONNECTION,QUERY</code>): p50 <strong>69 ms</strong>, p95 365 → 94 ms. Chiến thắng lớn nhất đến từ một dòng mà không có profiler thì không ai nghi.</li>
</ul>
<p>LabFlow từ giờ đặt <code>jdbc.includes=CONNECTION,QUERY</code> ở production: trace vẫn thấy từng câu lệnh và thời gian của nó, chỉ không thấy từng dòng. <strong>Flame graph</strong> vẽ chính các mẫu đó thành những hộp chồng lên nhau (chiều ngang = phần CPU); khoá dùng một script 60 dòng (<code>t/lua.py</code>) chuyển <code>jfr print --json</code> thành SVG, còn async-profiler và profiler của IntelliJ vẽ được trực tiếp.</p>

<h3>5. Danh sách kiểm cho một phép đo trung thực</h3>
<ul>
  <li>Máy tạo tải có CPU riêng (ở đây là một container riêng với 2–3 CPU riêng) — nếu không, bạn đang đo k6 giành CPU với ứng dụng.</li>
  <li>Khối lượng dữ liệu thật: câu lấy lịch mất 0,1 ms với 4 lượt đặt và 11 ms với 200.000. Hãy nạp dữ liệu cỡ production.</li>
  <li>Làm nóng, dùng mô hình mở, đọc p95/p99 và lỗi, mỗi phiên bản chạy ít nhất hai lần.</li>
  <li>Mỗi lần đổi một thứ và ghi lại môi trường (CPU, phiên bản, cỡ dữ liệu). Các con số trong chương này được đo khi máy dựng bài còn đang render video — con số tuyệt đối dao động ±10 %, còn phép so chạy liền nhau thì giữ nguyên.</li>
</ul>

<h3>🕵️ Góc hacker — Cloudflare, 2/7/2019: một regex, 27 phút, cả mạng lưới</h3>
<p>Cloudflare triển khai một luật WAF mới chứa <code>.*(?:.*=.*)</code>. Ở mỗi request, bộ máy regex quay lui: với chuỗi n ký tự không khớp, các <code>.*</code> lồng nhau thử khoảng n² vị trí. CPU của mọi server biên lên 100 % và các trang đi qua Cloudflare trả 502 trong 27 phút. (Stack Overflow từng sập 34 phút ngày 20/7/2016 vì cùng họ nguyên nhân: một regex cắt khoảng trắng gặp một bài viết dài.) Cùng mẫu đó trong bộ lọc đầu vào của LabFlow:</p>
${MA163_RE}
${OUT163D}
<ul>
  <li>Bậc hai: 1.000 ký tự 7 ms, 10.000 → 656 ms, 40.000 → <strong>9,6 giây</strong> cho <em>một</em> request 40 KB.</li>
  <li>Bốn request như vậy chiếm trọn hai CPU (199,6 %), và một endpoint có cache chẳng liên quan mất 1,16 giây thay vì vài ms.</li>
  <li>Tin tốt, đo trên Java 21: các mẫu hàm mũ trong sách giáo khoa <code>(a+)+</code>, <code>(a|a)+</code> chạy 0 ms với 26 ký tự — Java 9+ ghi nhớ các vòng lặp đó. Mẫu đa thức như của Cloudflare vẫn nguy hiểm, và <code>java.util.regex</code> không có timeout.</li>
</ul>
<p>Phòng: giới hạn kích thước đầu vào trước mọi regex (<code>@Size(max = 200)</code> cho <code>purpose</code>, giới hạn thân request), tránh <code>.*</code> đứng cạnh <code>.*</code>, ưu tiên kiểm chuỗi đơn giản, dùng bộ máy thời gian tuyến tính (RE2/J) cho mẫu do người dùng nhập hoặc mẫu phức tạp, và luôn có sẵn cách lấy profile CPU: JFR sẽ cho thấy <code>java.util.regex.Pattern$…</code> đứng đầu chỉ sau vài giây.</p>

<h3>So với Node.js</h3>
<p>Công cụ đổi, phương pháp thì không: <code>autocannon</code> (mô hình đóng, như wrk), k6 dùng y vậy với Express; <code>node --cpu-prof</code>, <code>clinic flame</code> hoặc Chrome DevTools cho flame graph; <code>pg_stat_statements</code> giống hệt. Hai điểm riêng của Node: regex chậm hay parse JSON chậm chặn <em>event loop duy nhất</em>, nên ReDoS còn đau hơn với Node (bài 16.4 đo một event loop bị chặn); và V8 cũng cần làm nóng (Ignition → TurboFan), nên luật "máy lạnh" vẫn áp dụng.</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Phiếu việc hiệu năng có con số trước và sau: "p95 của GET /schedule ở 200 req/s trên dữ liệu staging: 29,7 ms → 7,3 ms". Thiếu dòng đó thì thay đổi chỉ là ý kiến.</li>
  <li>Giữ một script k6 có threshold trong repo và chạy hằng đêm hoặc trước mỗi lần phát hành; threshold trượt là một lần tụt hiệu năng bị bắt trước khi người dùng thấy.</li>
  <li>Bật <code>pg_stat_statements</code> ở mọi PostgreSQL bạn quản lý; đó là câu truy vấn đầu tiên của mọi cuộc điều tra CSDL.</li>
  <li>Ghi JFR trên staging khi có tải ít nhất một lần mỗi đợt phát hành; giữ bản ghi để so.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Bạn đo tải một API thế nào?"</strong> — Kịch bản và dữ liệu thật, tốc độ đến theo mô hình mở, làm nóng, threshold trên p95/p99 và lỗi, máy tạo tải tách khỏi hệ thống, chạy hai lần; đọc CSDL và JVM trong lúc đo.</li>
  <li><strong>"Coordinated omission là gì?"</strong> — Công cụ mô hình đóng ngừng gửi khi server khựng, nên bỏ sót những request người dùng lẽ ra đã gửi; đo được p99 62 ms so với 2.973 ms cho cùng một lần dừng 3 giây.</li>
  <li><strong>"Một endpoint chậm. Bạn tìm nguyên nhân thế nào?"</strong> — Trace/số đo để thấy thời gian đi đâu; <code>pg_stat_statements</code> sắp theo tổng thời gian + <code>EXPLAIN ANALYZE</code> cho SQL; JFR (hoặc async-profiler) cho CPU trong JVM. Đo lại sau khi sửa.</li>
  <li><strong>"ReDoS là gì?"</strong> — Regex quay lui tăng theo hàm mũ hoặc đa thức với độ dài đầu vào; Cloudflare 2019. Giới hạn đầu vào, tránh lượng từ lồng/đứng cạnh nhau, dùng bộ máy tuyến tính.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<ol>
  <li>Sửa <code>labflow.js</code> để 5 % số lượt tạo một lượt đặt (có <code>Idempotency-Key</code>), và thêm threshold cho p95 của nó. Với 20 tài khoản và bộ giới hạn tần suất của Chương 13 bạn gặp vấn đề gì, và thiết kế vòng qua thế nào?</li>
  <li>Câu lấy lịch vẫn dùng <code>start_at &lt; :to and end_at &gt; :from</code>. Viết JPQL có thêm cận dưới từ BR-04 và migration Flyway cho chỉ mục.</li>
  <li>JFR cho thấy 40 % mẫu nằm trong <code>com.fasterxml.jackson…</code> ở <code>GET /bookings/mine?size=100</code>. Nêu hai nguyên nhân có thể và cách bạn xác nhận từng cái.</li>
</ol>
${giai('Xem đáp án', `<p>1. Mỗi tài khoản chỉ được đặt 5 lần mỗi phút (HTTP 429), nên ở 200 lượt/giây, 5 % lượt ghi cần nhiều tài khoản hơn hẳn: tạo hàng trăm tài khoản trong <code>setup()</code> (hoặc tắt bộ giới hạn bằng profile đo và ghi rõ trong báo cáo). Mỗi lượt cũng phải dùng khung giờ trống, nếu không ràng buộc loại trừ trả 409 — hãy kiểm mã trạng thái rõ ràng.</p><p>2. <code>where b.labId = :lab and b.status in ('PENDING','CONFIRMED') and b.startAt &gt;= :tuSom and b.startAt &lt; :to and b.endAt &gt; :from</code> với <code>tuSom = from.minusMinutes(240)</code>; migration <code>create index bookings_lab_start on bookings (lab_id, start_at)</code> (với bảng lớn ở production: <code>create index concurrently</code> trong một migration riêng không giao dịch).</p><p>3. Dựng JSON quá nhiều (size=100 với đối tượng lồng lớn, hoặc quan hệ lazy bị nạp trong lúc dựng JSON — kiểm số câu SQL mỗi request), hoặc tạo <code>ObjectMapper</code> mới mỗi request (kiểm cấp phát bằng <code>jfr view allocation-by-class</code>). Xác nhận bằng trang nhỏ hơn và bằng các span SQL trong trace.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Đo tải (load test)</strong> — chạy một tải có kiểm soát, giống thật, để đo độ trễ, thông lượng và lỗi.</li>
  <li><strong>Mô hình mở / đóng</strong> — request đến theo tốc độ cố định / mỗi người dùng ảo chờ trả lời rồi mới gửi tiếp.</li>
  <li><strong>Coordinated omission</strong> — lỗi đo khi máy tạo tải chậm lại cùng server và che mất các lần khựng.</li>
  <li><strong>Threshold</strong> — điều kiện đạt/trượt trên một số đo của k6; trượt thì k6 thoát mã khác 0.</li>
  <li><strong>Làm nóng JIT</strong> — khoảng thời gian JVM biên dịch mã nóng; số đo lúc đầu chậm hơn.</li>
  <li><strong>pg_stat_statements</strong> — extension của PostgreSQL gom thời gian và số lần gọi theo từng câu lệnh đã chuẩn hoá.</li>
  <li><strong>JFR (Java Flight Recorder)</strong> — bộ ghi sự kiện và lấy mẫu chi phí thấp có sẵn trong JDK.</li>
  <li><strong>Flame graph</strong> — hình vẽ các ngăn xếp được lấy mẫu; chiều ngang = tỉ lệ mẫu.</li>
  <li><strong>ReDoS</strong> — từ chối dịch vụ bằng cách bắt regex quay lui.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Viết bài đo như người dùng cư xử: dữ liệu thật, mô hình mở, làm nóng, threshold làm CI đỏ.</li>
  <li>Công cụ mô hình đóng và JVM lạnh đều nói dối: p99 62 ms so với 2.973 ms cho cùng một lần dừng; p99 73 ms so với 5,7 ms trước và sau làm nóng.</li>
  <li>Tìm, đừng đoán: <code>pg_stat_statements</code> + <code>EXPLAIN</code> tìm ra một lần quét tuần tự (10,9 → 1,8 ms nhờ chỉ mục, 0,07 ms nhờ cận từ quy tắc nghiệp vụ); JFR tìm ra một proxy tracing ngốn nửa thời gian của báo cáo (170 → 69 ms).</li>
  <li>Regex là mã có thể chạy hàng giây: giới hạn đầu vào, tránh <code>.*</code> đứng cạnh nhau, đo profile.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/', '📈', 'k6 — Mô hình mở và đóng', 'vì sao executor theo tốc độ đến tránh được coordinated omission')}
${tl('https://docs.oracle.com/en/java/javase/21/jfapi/', '🛩', 'Hướng dẫn JDK Flight Recorder API', 'sự kiện, jcmd, công cụ jfr')}
${tl('https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/', '☁️', 'Cloudflare — Chi tiết sự cố ngày 2/7/2019', 'regex, quay lui, cách họ sửa')}

<h3>Nguồn</h3>
<ul>
  <li>Blog Cloudflare, "Details of the Cloudflare outage on July 2, 2019"; bài phân tích sự cố của Stack Exchange, 20/7/2016.</li>
  <li>G. Tene, "How NOT to Measure Latency" (bài nói) — coordinated omission.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Java 21, datasource-micrometer 2.3.1) + PostgreSQL 16 (2 CPU, 200.000 lượt đặt) + k6 2.4.0 trên máy dựng bài, 24–25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 16.4 =====
const MA164_NODE = js("// server.mjs — CÙNG bốn endpoint như Demo16Controller (Spring), viết bằng Node.js thuần (node:http + pg), để so dưới cùng tải, cùng máy.\nimport http from 'node:http';\nimport { pbkdf2, pbkdf2Sync } from 'node:crypto';\nimport pg from 'pg';\n\nconst pool = new pg.Pool({ host: '127.0.0.1', user: 'labflow', database: 'labflow', password: process.env.LABFLOW_DB_PASSWORD, max: 10 });\nconst json = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };\nconst MUOI = Buffer.from('labflow-muoi');\n\nconst server = http.createServer(async (req, res) => {\n  const u = new URL(req.url, 'http://x');\n  try {\n    switch (u.pathname) {\n      case '/api/v1/demo16/cho': {          // chờ I/O: không chặn event loop\n        const ms = +(u.searchParams.get('ms') || 300);\n        await new Promise((r) => setTimeout(r, ms));\n        return json(res, 200, { kq: ms });\n      }\n      case '/api/v1/demo16/db': {           // một truy vấn nhỏ qua pool 10 kết nối\n        const r = await pool.query('select id, code, name from labs order by code');\n        return json(res, 200, { kq: r.rows.length });\n      }\n      case '/api/v1/demo16/cpu': {          // PBKDF2-SHA256 100.000 vòng — ĐỒNG BỘ: chạy ngay trên event loop\n        const k = pbkdf2Sync('mat-khau-mau', MUOI, 100_000, 32, 'sha256');\n        return json(res, 200, { kq: k.length });\n      }\n      case '/api/v1/demo16/cpu-async': {    // cùng việc, BẤT ĐỒNG BỘ: đẩy sang thread pool của libuv (mặc định 4 luồng)\n        const k = await new Promise((ok, loi) => pbkdf2('mat-khau-mau', MUOI, 100_000, 32, 'sha256', (e, x) => (e ? loi(e) : ok(x))));\n        return json(res, 200, { kq: k.length });\n      }\n      default: return json(res, 404, { code: 'NOT_FOUND' });\n    }\n  } catch (e) { return json(res, 500, { code: 'INTERNAL' }); }\n});\nserver.listen(+(process.env.PORT || 8090), () => console.log(`node ${process.version} nghe cổng ${server.address().port} sau ${Math.round(performance.now())} ms`));");
const MA164_CUM = js("// cum.mjs — chạy server.mjs trên NHIỀU tiến trình (node:cluster): mỗi CPU một event loop, cùng nghe một cổng.\nimport cluster from 'node:cluster';\nconst N = +(process.env.SO_TIEN_TRINH || 2);\nif (cluster.isPrimary) { for (let i = 0; i < N; i++) cluster.fork(); }\nelse await import('./server.mjs');");
const MA164_TRAN = java("/** Spring Boot trần: CÙNG bốn endpoint như node/server.mjs, không filter bảo mật, không số đo, không tracing. */\n@SpringBootApplication\n@RestController\npublic class TranApplication {\n    private static final byte[] MUOI = \"labflow-muoi\".getBytes();\n    private final JdbcClient db;\n    TranApplication(JdbcClient db) { this.db = db; }\n\n    @GetMapping(\"/api/v1/demo16/cho\")\n    Map<String, Object> cho(@RequestParam(defaultValue = \"300\") int ms) throws InterruptedException { Thread.sleep(ms); return Map.of(\"kq\", ms); }\n\n    @GetMapping(\"/api/v1/demo16/db\")\n    Map<String, Object> db() { return Map.of(\"kq\", db.sql(\"select id, code, name from labs order by code\").query().listOfRows().size()); }\n\n    @GetMapping(\"/api/v1/demo16/cpu\")\n    Map<String, Object> cpu() throws Exception {\n        var k = SecretKeyFactory.getInstance(\"PBKDF2WithHmacSHA256\").generateSecret(new PBEKeySpec(\"mat-khau-mau\".toCharArray(), MUOI, 100_000, 256)).getEncoded();\n        return Map.of(\"kq\", k.length);\n    }\n\n    public static void main(String[] args) { SpringApplication.run(TranApplication.class, args); }\n}");
const OUT164A = out("## 16.4a — Cùng máy, cùng 2 CPU / 1 GB mỗi bên: khởi động và bộ nhớ lúc nghỉ (LabFlow đầy đủ vs Node thuần 4 endpoint)\n$ docker logs labflow | grep -o \"Started LabflowApplication in .*\"\nStarted LabflowApplication in 11.28 seconds (process running for 11.572)\n\n$ docker logs labflow-node 2>&1 | head -1\nnode v22.23.5 nghe cổng 8090 sau 150 ms\n\n$ docker stats --no-stream --format '{{.Name}}: {{.MemUsage}}' labflow labflow-node | sed 's/labflow/spring/; s/labflow-node/node/'\nspring: 461.8MiB / 1GiB\nnode: 106.8MiB / 1GiB\n\n## 16.4b — Chờ I/O 50 ms (gọi dịch vụ khác), 1000 người cùng lúc\n$ tai \"Spring platform\" \"/api/v1/demo16/cho?ms=50\" 1000 15s\nSpring platform     31153 req  2035.0 req/s  lỗi   0.0%  p50   418  p95  1110  p99  1469  max  2488 ms\n\n$ tai \"Node\" \"/api/v1/demo16/cho?ms=50\" 1000 15s -e PORT=8090\nNode               238057 req 15812.2 req/s  lỗi   0.0%  p50    57  p95   100  p99   130  max   625 ms\n\n$ tai \"Spring virtual\" \"/api/v1/demo16/cho?ms=50\" 1000 15s\nSpring virtual      37426 req  2453.9 req/s  lỗi   0.0%  p50   299  p95   799  p99  1573  max  2103 ms\n\n## 16.4c — Một truy vấn nhỏ qua pool 10 kết nối, 100 người\n$ tai \"Spring virtual\" \"/api/v1/demo16/db\" 100 15s\nSpring virtual      68757 req  4580.5 req/s  lỗi   0.0%  p50    12  p95    74  p99   152  max  1080 ms\n\n$ tai \"Node\" \"/api/v1/demo16/db\" 100 15s -e PORT=8090\nNode               183019 req 12196.5 req/s  lỗi   0.0%  p50   7.4  p95    13  p99    21  max   314 ms\n\n$ docker stats --no-stream --format '{{.Name}}: {{.MemUsage}}' labflow labflow-node | sed 's/labflow/spring/; s/labflow-node/node/'\nspring: 905.1MiB / 1GiB\nnode: 47.02MiB / 1GiB\n\n## 16.4d — Việc CPU: PBKDF2-SHA256 100.000 vòng, 20 người\n$ tai \"Spring\" \"/api/v1/demo16/cpu\" 20 15s\nSpring               1085 req    71.0 req/s  lỗi   0.0%  p50   274  p95   619  p99   754  max   832 ms\n\n$ tai \"Node đồng bộ\" \"/api/v1/demo16/cpu\" 20 15s -e PORT=8090\nNode đồng bộ         1005 req    65.7 req/s  lỗi   0.0%  p50   282  p95   375  p99   626  max   699 ms\n\n$ tai \"Node bất đồng bộ\" \"/api/v1/demo16/cpu-async\" 20 15s -e PORT=8090\nNode bất đồng bộ     1648 req   108.6 req/s  lỗi   0.0%  p50   191  p95   204  p99   251  max   264 ms\n\n## 16.4e — Đang có 20 người làm việc CPU: người thứ 21 chỉ hỏi /cho?ms=50 (10 lượt/giây) thì chờ bao lâu?\n$ tai \"\" \"/api/v1/demo16/cpu\" 20 20s >/dev/null & K=$!; sleep 4; taimo \"Spring: /cho\" \"/api/v1/demo16/cho?ms=50\" 10 10s; wait $K\nSpring: /cho          101 req     9.7 req/s  lỗi   0.0%  p50   487  p95   670  p99   699  max   711 ms\n\n$ tai \"\" \"/api/v1/demo16/cpu\" 20 20s -e PORT=8090 >/dev/null & K=$!; sleep 4; taimo \"Node: /cho\" \"/api/v1/demo16/cho?ms=50\" 10 10s -e PORT=8090; wait $K\nNode: /cho            101 req     6.2 req/s  lỗi   0.0%  p50  8315  p95 11214  p99 11513  max 11563 ms\n\n$ tai \"\" \"/api/v1/demo16/cpu-async\" 20 20s -e PORT=8090 >/dev/null & K=$!; sleep 4; taimo \"Node async: /cho\" \"/api/v1/demo16/cho?ms=50\" 10 10s -e PORT=8090; wait $K\nNode async: /cho      101 req    10.0 req/s  lỗi   0.0%  p50    50  p95    71  p99   118  max   118 ms\n\n## 16.4f — Node dùng hết 2 CPU: node:cluster 2 tiến trình\n$ tai \"Node cluster ×2\" \"/api/v1/demo16/cpu\" 20 15s -e PORT=8090\nNode cluster ×2      1865 req   123.0 req/s  lỗi   0.0%  p50   150  p95   269  p99   344  max   976 ms\n\n$ tai \"Node cluster ×2\" \"/api/v1/demo16/db\" 100 15s -e PORT=8090\nNode cluster ×2    355234 req 23679.6 req/s  lỗi   0.0%  p50   3.4  p95   9.3  p99    17  max   201 ms\n\n$ docker stats --no-stream --format '{{.Name}}: {{.MemUsage}}' labflow-node | sed 's/labflow-node/node cluster ×2/'\nnode cluster ×2: 65.14MiB / 1GiB");
const OUT164G = out("## 16.4g — Công bằng hơn: Spring Boot TRẦN (chỉ web + JDBC, cùng 4 endpoint như Node) ở cổng 8090, cùng 2 CPU / 1 GB\n$ docker logs labflow-node 2>&1 | grep -o \"Started TranApplication in .*\"\nStarted TranApplication in 1.623 seconds (process running for 2.546)\n\n$ docker stats --no-stream --format 'bộ nhớ lúc nghỉ: {{.MemUsage}}' labflow-node\nbộ nhớ lúc nghỉ: 126.7MiB / 1GiB\n\n$ tai \"Spring trần virtual\" \"/api/v1/demo16/cho?ms=50\" 1000 15s -e PORT=8090\nSpring trần virtual 126569 req  8398.5 req/s  lỗi   0.0%  p50    83  p95   270  p99   381  max   946 ms\n\n$ tai \"Spring trần virtual\" \"/api/v1/demo16/db\" 100 15s -e PORT=8090\nSpring trần virtual 359754 req 23981.5 req/s  lỗi   0.0%  p50   3.2  p95   9.9  p99    17  max   155 ms\n\n$ tai \"Spring trần\" \"/api/v1/demo16/cpu\" 20 15s -e PORT=8090\nSpring trần          1028 req    67.3 req/s  lỗi   0.0%  p50    32  p95  1010  p99  1366  max  1560 ms\n\n$ docker stats --no-stream --format 'bộ nhớ sau tải: {{.MemUsage}}' labflow-node\nbộ nhớ sau tải: 479.1MiB / 1GiB");

const L164_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4 · Performance</span>
<h2>Spring Boot vs Node.js under load</h2>
<p class="lead">"Node is faster than Java" and "Java is faster than Node" are both said in interviews with great confidence and no numbers. Here are the numbers: the same four endpoints written in Spring Boot and in Node.js, on the same machine, each with 2 CPUs and 1 GB, measured with the same k6 scripts — waiting on I/O, a small database query, CPU work, and what happens to other users while CPU work runs. Plus the comparison almost nobody makes: full LabFlow versus a bare Spring Boot app, to see how much of the difference is the language and how much is the middleware you added.</p>

<h3>Everyday picture first</h3>
<p>Comparing a motorbike with a car by saying "which is faster" makes no sense until you say: on which road, carrying what. A motorbike wins in a traffic jam; a car wins carrying six people on the highway; and a car full of luggage and roof boxes is slower than the same car empty. This lesson measures several roads — and weighs the luggage.</p>

<h3>1. The contestants</h3>
<p>Node.js 22, plain <code>node:http</code> + <code>pg</code> (pool 10), no framework:</p>
${MA164_NODE}
<p>The same endpoints in LabFlow (<code>Demo16Controller</code>, behind the whole LabFlow stack: two security filter chains, request-id filter, metrics with histograms, tracing, the datasource proxy of Chapter 15) and in a <strong>bare</strong> Spring Boot app with only <code>spring-boot-starter-webmvc</code> and <code>spring-boot-starter-jdbc</code>:</p>
${MA164_TRAN}
<p>Each server: its own container, 2 CPUs, 1 GB, the same PostgreSQL, the same k6 (on 3 separate CPUs).</p>

<h3>2. Full LabFlow vs plain Node</h3>
${OUT164A}

<h3>3. Bare Spring Boot</h3>
${OUT164G}

<h3>4. Reading the results</h3>
<table>
<thead><tr><th></th><th>LabFlow (full)</th><th>Spring Boot bare</th><th>Node 1 process</th><th>Node cluster ×2</th></tr></thead>
<tbody>
<tr><td>Startup</td><td>11.3 s</td><td>1.6 s</td><td>0.15 s</td><td>—</td></tr>
<tr><td>Memory at rest</td><td>462 MiB</td><td>127 MiB</td><td>107 MiB</td><td>—</td></tr>
<tr><td>Wait 50 ms, 1,000 users</td><td>2,035 (platform) / 2,454 (virtual) req/s</td><td>8,399 req/s (virtual)</td><td>15,812 req/s</td><td>—</td></tr>
<tr><td>Small query, pool 10, 100 users</td><td>4,581 req/s</td><td>23,982 req/s</td><td>12,197 req/s</td><td>23,680 req/s</td></tr>
<tr><td>PBKDF2 100,000 rounds, 20 users</td><td>71 req/s</td><td>67 req/s</td><td>66 (sync) / 109 (async) req/s</td><td>123 req/s</td></tr>
<tr><td>Memory after load</td><td>905 MiB</td><td>479 MiB</td><td>47 MiB</td><td>65 MiB</td></tr>
</tbody>
</table>
<ul>
  <li><strong>Pure waiting</strong>: Node is the clear winner (15,812 vs 8,399 for bare Spring with virtual threads). An event loop that only parks a timer is about as cheap as a server can be. At this rate k6 itself is close to its limit, so the real gap may be larger.</li>
  <li><strong>A database query</strong>: bare Spring Boot does twice as much as single-process Node (23,982 vs 12,197) — because the JVM uses <em>both</em> CPUs for JSON, HTTP and the driver, while Node's JavaScript runs on one. With <code>node:cluster</code> and 2 processes, Node catches up (23,680). Compare equal CPU usage, not equal process counts.</li>
  <li><strong>CPU work</strong>: Java's PBKDF2 (pure Java) is slower per call than Node's, which calls OpenSSL in C; Node async uses libuv's 4 worker threads and wins (109 and 123 vs ~70). Language speed matters less than "who does the work in native code".</li>
  <li><strong>The luggage</strong>: full LabFlow is 4–5× slower than bare Spring Boot on trivial endpoints and needs 7× longer to start. That is the price of security filters, histograms, tracing and SQL observation on every request. On a real endpoint that spends 20 ms in the database, the same overhead is a few percent; on a 1 ms endpoint it dominates. Measure your stack before blaming the language.</li>
  <li><strong>Memory</strong>: the JVM takes what it is allowed (heap up to 60 % of the container here) and keeps it; Node stays small. Several JVM services on a small VPS is the case where this matters most.</li>
</ul>

<h3>5. The real difference: what CPU work does to everyone else</h3>
<p>Section 16.4e of the output: 20 users run the CPU endpoint, and a 21st user only asks for <code>/cho?ms=50</code>, 10 times per second.</p>
<ul>
  <li>Spring: p50 <strong>487 ms</strong> — slower (the CPUs are shared fairly between threads), but every request is served.</li>
  <li>Node with <code>pbkdf2Sync</code>: p50 <strong>8,315 ms</strong>, p95 11.2 s for a request that needs 50 ms. While one synchronous call runs, the only event loop serves no one — not the timer, not health checks, not other users.</li>
  <li>Node with async <code>pbkdf2</code>: p50 <strong>50 ms</strong>. The work moved to the libuv thread pool and the event loop stayed free.</li>
</ul>
<p>This is the interview answer in one measurement: Node is excellent at I/O concurrency as long as nothing blocks the event loop; anything CPU-heavy (hashing, image processing, big JSON, a bad regex from 16.3) must go to worker threads or another process. Java's thread model degrades more gracefully under mixed CPU + I/O load.</p>
${MA164_CUM}

<h3>6. Startup, memory, and native images</h3>
<ul>
  <li><strong>Startup</strong> matters for serverless, autoscaling and CLI tools: Node 0.15 s, bare Spring 1.6 s, full LabFlow 11.3 s (the build machine was loaded; on a quiet laptop LabFlow starts in ~4–5 s). For a long-running API behind a load balancer it hardly matters.</li>
  <li><strong>GraalVM native image</strong> compiles the Spring app ahead of time into a native executable: startup in tens of milliseconds and much less memory, at the cost of long builds (minutes, several GB of RAM), no JIT peak performance and reflection configuration. Spring Boot supports it (<code>spring-boot:build-image -Pnative</code>). It was not measured in this course: building it needs more memory than the build machine's limits allow per container.</li>
  <li><strong>Class Data Sharing / AOT cache</strong> (Java 21 CDS, Java 24+ <code>-XX:AOTCache</code>) cuts JVM startup without changing the programming model — a cheaper first step than native images.</li>
</ul>

<h3>🕵️ Hacker corner — blocking the event loop on purpose</h3>
<p>Section 5 is also an attack: an attacker who finds one endpoint that does synchronous CPU work in Node can freeze the whole process with a handful of requests — the same family as the 2019 Cloudflare regex. Real Node advisories describe exactly this: ReDoS bugs in popular npm packages (for example <code>ms</code>, <code>moment</code>, <code>ua-parser-js</code> had ReDoS fixes over the years) turned a single crafted header or string into a blocked event loop. Defence on both platforms: limit input size, keep CPU work off request threads (worker threads, a queue — Chapter 14), monitor event-loop lag in Node (<code>perf_hooks.monitorEventLoopDelay</code>) and CPU per endpoint in Java (JFR).</p>

<h3>Compared with Node.js — when to choose which</h3>
<ul>
  <li><strong>Choose Node.js</strong> for I/O-heavy services, BFFs, real-time (WebSocket), when the team is JavaScript-first, and when startup/memory per instance matter.</li>
  <li><strong>Choose Spring Boot</strong> for large business domains with many rules and transactions, strong typing across a big team, mature integrations (JPA, Security, batch, messaging), and mixed CPU + I/O workloads.</li>
  <li>Either way, the bottleneck you measured in 16.1–16.3 was the database pool, a missing index and middleware — not the language.</li>
</ul>

<h3>At work</h3>
<ul>
  <li>When someone proposes rewriting a service "because Node/Java is faster", ask for this kind of measurement on the real endpoint with the real middleware.</li>
  <li>In Vietnam, banks, insurers and large enterprises run mostly Java/Spring; startups and product companies use Node.js heavily — knowing both, with numbers, is what this roadmap is for.</li>
  <li>For SWP391 LabFlow: Spring Boot, one instance, pool 10 — performance will be limited by your queries long before the framework.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Is Node.js faster than Java?"</strong> — Depends on the workload: measured, Node wins pure waiting (15.8k vs 8.4k req/s), bare Spring wins a DB query against one Node process (24k vs 12k) and ties with a 2-process cluster; for CPU work the native implementation matters more than the language.</li>
  <li><strong>"What happens if you do CPU work in an Express handler?"</strong> — It blocks the single event loop; measured: a 50 ms request waited 8.3 s. Use worker threads/async native APIs or move the work to a queue.</li>
  <li><strong>"How does Node use multiple cores?"</strong> — <code>node:cluster</code>, several processes behind a load balancer (PM2, Kubernetes replicas), worker threads for CPU tasks.</li>
  <li><strong>"Why is our Spring service slow on trivial endpoints?"</strong> — Measure the middleware: in LabFlow, security + metrics + tracing cost 4–5× on 1 ms endpoints; check histograms, per-row SQL observation, logging.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<ol>
  <li>Run the bare Spring app with platform threads instead of virtual threads on <code>/cho?ms=50</code> with 1,000 users. Predict the throughput from 16.2 before measuring.</li>
  <li>Change <code>/cpu</code> in Node to use <code>worker_threads</code> explicitly (a pool of 2). Which numbers in the table change, and which test shows it best?</li>
  <li>Which LabFlow features would you switch off first to close the gap with the bare app, and which would you never switch off?</li>
</ol>
${giai('Show answers', `<p>1. 200 threads ÷ 0.05 s = at most 4,000 per second, minus CPU overhead — so roughly the LabFlow platform figure scaled by the lighter stack; the virtual-thread run is not limited by threads.</p><p>2. CPU throughput stays bounded by 2 CPUs (~110–120 req/s), but the event-loop-blocking test (section 5) changes from seconds to ~50 ms, like the async version.</p><p>3. First: histogram buckets on every metric that nobody graphs, per-row SQL observation (already done in 16.3), DEBUG logging, trace sampling at 100 %. Never: authentication/authorisation, input validation, error handling — they are why the API is safe; measure their cost, then optimise them rather than remove them.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Event loop</strong> — Node's single thread that runs JavaScript callbacks; blocking it blocks every request.</li>
  <li><strong>libuv thread pool</strong> — Node's worker threads (4 by default) for file, DNS, crypto and compression work.</li>
  <li><strong>node:cluster</strong> — runs several Node processes sharing one port, one per CPU.</li>
  <li><strong>Middleware overhead</strong> — cost added to every request by filters, metrics, tracing and logging.</li>
  <li><strong>GraalVM native image</strong> — ahead-of-time compiled Java application: fast startup, low memory, long builds.</li>
  <li><strong>CDS / AOT cache</strong> — JVM archives of loaded classes that shorten startup.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Same machine, same limits: Node wins pure I/O waiting; bare Spring wins a DB query against one Node process and ties with two; CPU work depends on native code.</li>
  <li>Node's weakness is blocking the event loop: 50 ms became 8.3 s with synchronous CPU work, 50 ms with the async API.</li>
  <li>Full LabFlow was 4–5× slower than bare Spring Boot on trivial endpoints — measure the stack, not the language.</li>
  <li>Startup and memory favour Node (0.15 s, ~50–100 MiB); native images and AOT caches narrow the gap for Java.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop', '🟩', "Node.js — Don't Block the Event Loop", 'the official guide, including ReDoS and JSON')}
${tl('https://docs.spring.io/spring-boot/reference/packaging/native-image/index.html', '🍃', 'Spring Boot — GraalVM native images', 'how native images work with Spring')}

<h3>Sources</h3>
<ul>
  <li>Node.js documentation — Don't Block the Event Loop; GitHub advisory database (ReDoS advisories for npm packages).</li>
  <li>All outputs: LabFlow and a bare Spring Boot 4.1.2 app (Java 21), Node.js 22 + pg 8.23.1, PostgreSQL 16, k6 2.4.0, each server in a 2-CPU / 1 GB container on the course build machine, 24–25/11/2026.</li>
</ul>
</div>
`;

const L164_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4 · Hiệu năng</span>
<h2>Spring Boot vs Node.js dưới tải</h2>
<p class="lead">"Node nhanh hơn Java" và "Java nhanh hơn Node" đều được nói rất tự tin trong phỏng vấn mà không kèm con số nào. Đây là con số: cùng bốn endpoint viết bằng Spring Boot và bằng Node.js, cùng máy, mỗi bên 2 CPU và 1 GB, đo bằng cùng các script k6 — chờ I/O, một truy vấn CSDL nhỏ, việc CPU, và chuyện gì xảy ra với người dùng khác khi việc CPU đang chạy. Thêm một phép so gần như không ai làm: LabFlow đầy đủ với một ứng dụng Spring Boot trần, để biết bao nhiêu phần chênh lệch là do ngôn ngữ, bao nhiêu là do các lớp middleware bạn tự thêm vào.</p>

<h3>Đời thường trước đã</h3>
<p>So xe máy với ô tô bằng câu "cái nào nhanh hơn" là vô nghĩa cho tới khi bạn nói rõ: trên đường nào, chở gì. Xe máy thắng khi kẹt xe; ô tô thắng khi chở sáu người trên cao tốc; và một chiếc ô tô chất đầy hành lý, thêm thùng trên nóc thì chậm hơn chính nó lúc trống. Bài này đo trên nhiều loại đường — và cân cả hành lý.</p>

<h3>1. Các bên tham gia</h3>
<p>Node.js 22, <code>node:http</code> thuần + <code>pg</code> (pool 10), không framework:</p>
${MA164_NODE}
<p>Cùng các endpoint đó trong LabFlow (<code>Demo16Controller</code>, đứng sau toàn bộ LabFlow: hai chuỗi filter bảo mật, filter mã request, số đo có histogram, tracing, proxy datasource của Chương 15) và trong một ứng dụng Spring Boot <strong>trần</strong> chỉ có <code>spring-boot-starter-webmvc</code> và <code>spring-boot-starter-jdbc</code>:</p>
${MA164_TRAN}
<p>Mỗi server: container riêng, 2 CPU, 1 GB, cùng PostgreSQL, cùng k6 (chạy trên 3 CPU riêng).</p>

<h3>2. LabFlow đầy đủ vs Node thuần</h3>
${OUT164A}

<h3>3. Spring Boot trần</h3>
${OUT164G}

<h3>4. Đọc kết quả</h3>
<table>
<thead><tr><th></th><th>LabFlow (đầy đủ)</th><th>Spring Boot trần</th><th>Node 1 tiến trình</th><th>Node cluster ×2</th></tr></thead>
<tbody>
<tr><td>Khởi động</td><td>11,3 giây</td><td>1,6 giây</td><td>0,15 giây</td><td>—</td></tr>
<tr><td>Bộ nhớ lúc nghỉ</td><td>462 MiB</td><td>127 MiB</td><td>107 MiB</td><td>—</td></tr>
<tr><td>Chờ 50 ms, 1.000 người</td><td>2.035 (platform) / 2.454 (virtual) req/s</td><td>8.399 req/s (virtual)</td><td>15.812 req/s</td><td>—</td></tr>
<tr><td>Truy vấn nhỏ, pool 10, 100 người</td><td>4.581 req/s</td><td>23.982 req/s</td><td>12.197 req/s</td><td>23.680 req/s</td></tr>
<tr><td>PBKDF2 100.000 vòng, 20 người</td><td>71 req/s</td><td>67 req/s</td><td>66 (đồng bộ) / 109 (bất đồng bộ) req/s</td><td>123 req/s</td></tr>
<tr><td>Bộ nhớ sau tải</td><td>905 MiB</td><td>479 MiB</td><td>47 MiB</td><td>65 MiB</td></tr>
</tbody>
</table>
<ul>
  <li><strong>Chờ thuần tuý</strong>: Node thắng rõ (15.812 so với 8.399 của Spring trần có virtual thread). Một event loop chỉ việc đặt hẹn giờ là thứ rẻ nhất một server có thể làm. Ở tốc độ này chính k6 cũng gần chạm giới hạn, nên khoảng cách thật có thể còn lớn hơn.</li>
  <li><strong>Một truy vấn CSDL</strong>: Spring Boot trần làm gấp đôi Node một tiến trình (23.982 so với 12.197) — vì JVM dùng <em>cả hai</em> CPU cho JSON, HTTP và driver, còn JavaScript của Node chạy trên một. Với <code>node:cluster</code> 2 tiến trình, Node đuổi kịp (23.680). Hãy so cùng mức dùng CPU, đừng so cùng số tiến trình.</li>
  <li><strong>Việc CPU</strong>: PBKDF2 của Java (Java thuần) chậm hơn mỗi lần gọi so với của Node, vốn gọi OpenSSL viết bằng C; Node bất đồng bộ dùng 4 luồng worker của libuv và thắng (109 và 123 so với khoảng 70). Tốc độ ngôn ngữ ít quan trọng hơn "ai làm việc đó bằng mã native".</li>
  <li><strong>Hành lý</strong>: LabFlow đầy đủ chậm hơn Spring Boot trần 4–5 lần ở endpoint đơn giản và khởi động lâu gấp 7. Đó là cái giá của filter bảo mật, histogram, tracing và quan sát SQL trên mỗi request. Với endpoint thật mất 20 ms trong CSDL, cùng phần chi phí đó chỉ còn vài phần trăm; với endpoint 1 ms thì nó áp đảo. Đo cả ngăn xếp của bạn trước khi đổ lỗi cho ngôn ngữ.</li>
  <li><strong>Bộ nhớ</strong>: JVM lấy hết phần được phép (ở đây heap tới 60 % container) và giữ lại; Node thì nhỏ gọn. Chạy nhiều dịch vụ JVM trên một VPS nhỏ là lúc chuyện này quan trọng nhất.</li>
</ul>

<h3>5. Khác biệt thật sự: việc CPU làm gì với mọi người khác</h3>
<p>Phần 16.4e của output: 20 người chạy endpoint CPU, và người thứ 21 chỉ hỏi <code>/cho?ms=50</code>, 10 lần mỗi giây.</p>
<ul>
  <li>Spring: p50 <strong>487 ms</strong> — chậm hơn (CPU được chia công bằng giữa các luồng), nhưng request nào cũng được phục vụ.</li>
  <li>Node với <code>pbkdf2Sync</code>: p50 <strong>8.315 ms</strong>, p95 11,2 giây cho một request chỉ cần 50 ms. Trong lúc một lời gọi đồng bộ chạy, event loop duy nhất không phục vụ ai cả — không hẹn giờ, không health check, không người dùng nào khác.</li>
  <li>Node với <code>pbkdf2</code> bất đồng bộ: p50 <strong>50 ms</strong>. Việc đã chuyển sang thread pool của libuv và event loop được rảnh.</li>
</ul>
<p>Đây là câu trả lời phỏng vấn gói trong một phép đo: Node rất giỏi xử lý I/O đồng thời, miễn là không có gì chặn event loop; mọi thứ nặng CPU (băm, xử lý ảnh, JSON lớn, regex tệ ở bài 16.3) phải chuyển sang worker thread hoặc tiến trình khác. Mô hình luồng của Java xuống cấp nhẹ nhàng hơn khi tải trộn CPU + I/O.</p>
${MA164_CUM}

<h3>6. Khởi động, bộ nhớ, và native image</h3>
<ul>
  <li><strong>Khởi động</strong> quan trọng với serverless, tự co giãn và công cụ dòng lệnh: Node 0,15 giây, Spring trần 1,6 giây, LabFlow đầy đủ 11,3 giây (máy dựng bài đang tải nặng; trên laptop rảnh LabFlow khởi động khoảng 4–5 giây). Với API chạy lâu dài sau load balancer thì gần như không đáng kể.</li>
  <li><strong>GraalVM native image</strong> biên dịch trước ứng dụng Spring thành tệp chạy native: khởi động vài chục mili giây và tốn ít bộ nhớ hơn nhiều, đổi lại build lâu (vài phút, vài GB RAM), mất hiệu năng đỉnh của JIT và phải khai báo reflection. Spring Boot hỗ trợ (<code>spring-boot:build-image -Pnative</code>). Khoá chưa đo phần này: build nó cần nhiều bộ nhớ hơn giới hạn mỗi container của máy dựng bài.</li>
  <li><strong>Class Data Sharing / AOT cache</strong> (CDS của Java 21, <code>-XX:AOTCache</code> từ Java 24) rút ngắn khởi động JVM mà không đổi mô hình lập trình — bước đầu rẻ hơn native image.</li>
</ul>

<h3>🕵️ Góc hacker — cố tình chặn event loop</h3>
<p>Mục 5 cũng là một kiểu tấn công: kẻ tấn công tìm được một endpoint làm việc CPU đồng bộ trong Node là có thể làm đứng cả tiến trình chỉ với vài request — cùng họ với regex của Cloudflare năm 2019. Các cảnh báo bảo mật thật của hệ sinh thái Node mô tả đúng chuyện này: lỗi ReDoS trong các gói npm phổ biến (ví dụ <code>ms</code>, <code>moment</code>, <code>ua-parser-js</code> từng có bản vá ReDoS qua các năm) biến một header hay một chuỗi được dựng khéo thành một event loop bị chặn. Phòng thủ ở cả hai nền tảng: giới hạn kích thước đầu vào, đưa việc CPU ra khỏi luồng xử lý request (worker thread, hàng đợi — Chương 14), theo dõi độ trễ event loop ở Node (<code>perf_hooks.monitorEventLoopDelay</code>) và CPU theo endpoint ở Java (JFR).</p>

<h3>So với Node.js — khi nào chọn cái nào</h3>
<ul>
  <li><strong>Chọn Node.js</strong> cho dịch vụ nặng I/O, BFF, thời gian thực (WebSocket), khi nhóm thạo JavaScript, và khi thời gian khởi động/bộ nhớ mỗi instance là quan trọng.</li>
  <li><strong>Chọn Spring Boot</strong> cho miền nghiệp vụ lớn nhiều quy tắc và giao dịch, kiểu chặt chẽ trong nhóm đông người, tích hợp trưởng thành (JPA, Security, batch, messaging), và tải trộn CPU + I/O.</li>
  <li>Dù chọn gì, nút thắt bạn đã đo ở 16.1–16.3 là pool CSDL, thiếu chỉ mục và middleware — không phải ngôn ngữ.</li>
</ul>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Khi ai đó đề xuất viết lại một dịch vụ "vì Node/Java nhanh hơn", hãy xin kiểu phép đo này trên endpoint thật với middleware thật.</li>
  <li>Ở Việt Nam, ngân hàng, bảo hiểm và doanh nghiệp lớn chạy chủ yếu Java/Spring; startup và công ty sản phẩm dùng Node.js rất nhiều — biết cả hai, kèm con số, là mục tiêu của lộ trình này.</li>
  <li>Với LabFlow của SWP391: Spring Boot, một instance, pool 10 — hiệu năng sẽ bị giới hạn bởi truy vấn của bạn từ lâu trước khi tới framework.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Node.js có nhanh hơn Java không?"</strong> — Tuỳ tải: đã đo, Node thắng chờ thuần tuý (15,8 nghìn so với 8,4 nghìn req/s), Spring trần thắng truy vấn CSDL trước một tiến trình Node (24 nghìn so với 12 nghìn) và hoà với cluster 2 tiến trình; với việc CPU, cách cài đặt native quan trọng hơn ngôn ngữ.</li>
  <li><strong>"Làm việc CPU trong handler Express thì sao?"</strong> — Nó chặn event loop duy nhất; đo được: request 50 ms phải chờ 8,3 giây. Dùng worker thread/API native bất đồng bộ hoặc đẩy việc sang hàng đợi.</li>
  <li><strong>"Node dùng nhiều nhân CPU thế nào?"</strong> — <code>node:cluster</code>, nhiều tiến trình sau load balancer (PM2, replica Kubernetes), worker thread cho việc CPU.</li>
  <li><strong>"Sao dịch vụ Spring của mình chậm ở endpoint đơn giản?"</strong> — Đo middleware: ở LabFlow, bảo mật + số đo + tracing tốn gấp 4–5 lần trên endpoint 1 ms; kiểm histogram, quan sát SQL theo dòng, log.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<ol>
  <li>Chạy ứng dụng Spring trần bằng platform thread thay vì virtual thread, đo <code>/cho?ms=50</code> với 1.000 người. Đoán thông lượng theo bài 16.2 trước khi đo.</li>
  <li>Sửa <code>/cpu</code> trong Node để dùng <code>worker_threads</code> tường minh (pool 2 luồng). Con số nào trong bảng đổi, và phép thử nào cho thấy rõ nhất?</li>
  <li>Bạn sẽ tắt tính năng nào của LabFlow trước tiên để thu hẹp khoảng cách với bản trần, và tính năng nào không bao giờ tắt?</li>
</ol>
${giai('Xem đáp án', `<p>1. 200 luồng ÷ 0,05 giây = tối đa 4.000 mỗi giây, trừ đi chi phí CPU — lượt virtual thread thì không bị luồng giới hạn.</p><p>2. Thông lượng CPU vẫn bị chặn bởi 2 CPU (khoảng 110–120 req/s), nhưng phép thử chặn event loop (mục 5) đổi từ vài giây xuống khoảng 50 ms, giống bản bất đồng bộ.</p><p>3. Trước tiên: bucket histogram cho những số đo không ai vẽ biểu đồ, quan sát SQL theo từng dòng (đã làm ở 16.3), log DEBUG, lấy mẫu trace 100 %. Không bao giờ: xác thực/phân quyền, kiểm tra đầu vào, xử lý lỗi — chúng là lý do API an toàn; hãy đo chi phí của chúng rồi tối ưu, đừng gỡ bỏ.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Event loop</strong> — luồng duy nhất của Node chạy các callback JavaScript; chặn nó là chặn mọi request.</li>
  <li><strong>Thread pool của libuv</strong> — các luồng worker của Node (mặc định 4) cho việc tệp, DNS, mã hoá, nén.</li>
  <li><strong>node:cluster</strong> — chạy nhiều tiến trình Node cùng chia một cổng, mỗi CPU một cái.</li>
  <li><strong>Chi phí middleware</strong> — phần chi phí mà filter, số đo, tracing và log cộng vào mỗi request.</li>
  <li><strong>GraalVM native image</strong> — ứng dụng Java được biên dịch trước: khởi động nhanh, ít bộ nhớ, build lâu.</li>
  <li><strong>CDS / AOT cache</strong> — kho lưu sẵn các lớp đã nạp của JVM để rút ngắn khởi động.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cùng máy, cùng giới hạn: Node thắng chờ I/O thuần; Spring trần thắng truy vấn CSDL trước một tiến trình Node và hoà với hai; việc CPU phụ thuộc mã native.</li>
  <li>Điểm yếu của Node là chặn event loop: 50 ms thành 8,3 giây với việc CPU đồng bộ, còn 50 ms với API bất đồng bộ.</li>
  <li>LabFlow đầy đủ chậm hơn Spring Boot trần 4–5 lần ở endpoint đơn giản — đo cả ngăn xếp, đừng chỉ đo ngôn ngữ.</li>
  <li>Khởi động và bộ nhớ nghiêng về Node (0,15 giây, khoảng 50–100 MiB); native image và AOT cache thu hẹp khoảng cách cho Java.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop', '🟩', "Node.js — Don't Block the Event Loop", 'hướng dẫn chính thức, có cả ReDoS và JSON')}
${tl('https://docs.spring.io/spring-boot/reference/packaging/native-image/index.html', '🍃', 'Spring Boot — GraalVM native image', 'native image chạy với Spring thế nào')}

<h3>Nguồn</h3>
<ul>
  <li>Tài liệu Node.js — Don't Block the Event Loop; cơ sở dữ liệu cảnh báo bảo mật của GitHub (các cảnh báo ReDoS cho gói npm).</li>
  <li>Mọi output: LabFlow và một ứng dụng Spring Boot 4.1.2 trần (Java 21), Node.js 22 + pg 8.23.1, PostgreSQL 16, k6 2.4.0, mỗi server trong một container 2 CPU / 1 GB trên máy dựng bài, 24–25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 16.5 =====
const MA165_CHAM = bash("#!/bin/bash\n# cham.sh <thư mục dự án> — chấm Lab 16 \"Tối ưu màn Chờ duyệt có số đo trước/sau\". 10 mục ĐẠT/TRƯỢT trên dữ liệu cỡ trường\n# (2.000 sinh viên, 200.000 lượt đặt) với PostgreSQL 16 + Redis 7 + k6 THẬT trong netns sb-c16-cham-net.\n# Cổng: API 127.0.0.1:41865 (8080 trong netns), quản trị 41866 (8081). Mật khẩu sinh lúc chấm, không in ra.\nset -u\nSRC=$(realpath \"$1\"); W=/tmp/cham/$(basename \"$SRC\")-$$; MVN=./mvn.sh   # Maven 3.9 + JDK 21 trong container; L=.\nA=http://127.0.0.1:41865; Q=http://127.0.0.1:41866; J='Content-Type: application/json'\nMKDB=$(openssl rand -hex 8); JWT=$(openssl rand -hex 32); MKQL=ql-$(openssl rand -hex 8); MKSV=sv-$(openssl rand -hex 8)\nN=sb-c16-cham; diem=0; muc() { if [ \"$2\" = 1 ]; then diem=$((diem+1)); echo \"Mục $1: ĐẠT   — $3\"; else echo \"Mục $1: TRƯỢT — $3\"; fi; }\ndon() { docker rm -f $N-app $N-pg $N-redis $N-net >/dev/null 2>&1; rm -rf \"$W\"; }\ntrap don EXIT\nrm -rf \"$W\"; mkdir -p \"$W\"; cp -r \"$SRC\"/pom.xml \"$SRC\"/src \"$W\"/\n# dữ liệu cỡ trường: bộ chấm tự thêm migration riêng (không nằm trong dự án của bạn)\nmkdir -p \"$W/src/main/resources/db/cham\"; cp $L/labflow/src/main/resources/db/c16/*.sql \"$W/src/main/resources/db/cham/\"\nbash $MVN \"$W\" -B -q -DskipTests compile dependency:copy-dependencies -DoutputDirectory=target/dep -DincludeScope=runtime > \"$W/build.log\" 2>&1 \\\n  || { echo \"BIÊN DỊCH HỎNG:\"; grep -E 'ERROR.*\\.java' \"$W/build.log\" | head -5; echo \"Điểm: 0/10\"; exit 1; }\ndocker rm -f $N-app $N-pg $N-redis $N-net >/dev/null 2>&1\ndocker run -d --name $N-net --memory 64m -p 127.0.0.1:41865:8080 -p 127.0.0.1:41866:8081 --entrypoint sleep postgres:16 infinity >/dev/null\ndocker run -d --name $N-pg --network container:$N-net --memory 2g --memory-swap 2g --cpus 2 -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=\"$MKDB\" -e POSTGRES_DB=labflow \\\n  postgres:16 -c shared_preload_libraries=pg_stat_statements >/dev/null\ndocker run -d --name $N-redis --network container:$N-net --memory 256m --memory-swap 256m --cpus 0.5 redis:7-alpine redis-server --save \"\" >/dev/null\nfor i in $(seq 60); do docker exec $N-pg pg_isready -h 127.0.0.1 -U labflow -q 2>/dev/null && break; sleep 1; done; sleep 2\ndocker exec $N-pg psql -q -U labflow -d labflow -c \"create extension pg_stat_statements\" >/dev/null\nLOC=classpath:db/migration/identity,classpath:db/migration/catalog,classpath:db/migration/booking,classpath:db/migration/notification,classpath:db/migration/shared,classpath:db/dev,classpath:db/cham\ndocker run -d --name $N-app --network container:$N-net --memory 1g --memory-swap 1g --cpus 2 --user $(id -u):$(id -g) -e HOME=/tmp -e TZ=UTC \\\n  -e LABFLOW_DB_PASSWORD=\"$MKDB\" -e LABFLOW_JWT_SECRET=\"$JWT\" -e LABFLOW_MANAGER_PASSWORD=\"$MKQL\" -e SPRING_PROFILES_ACTIVE=dev \\\n  -e SPRING_FLYWAY_LOCATIONS=$LOC -e LABFLOW_MANAGEMENT_PORT=8081 -e MANAGEMENT_SERVER_PORT=8081 \\\n  -v \"$W\":/w -w /w --entrypoint \"\" maven:3.9-eclipse-temurin-21 java -XX:MaxRAMPercentage=60 -cp \"target/classes:target/dep/*\" vn.labflow.LabflowApplication >/dev/null\nfor i in $(seq 180); do docker logs $N-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in|APPLICATION FAILED|Application run failed' && break; sleep 1; done\ndocker logs $N-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in' || { echo \"ỨNG DỤNG KHÔNG LÊN:\"; docker logs $N-app 2>&1 | grep -vE '^\\s+at ' | tail -8; echo \"Điểm: 0/10\"; exit 1; }\nps() { docker exec $N-pg psql -qtA -U labflow -d labflow -c \"$1\" 2>/dev/null; }\nma() { curl -s -o /dev/null -m ${3:-20} -w '%{http_code}' \"${@:4}\" \"$1$2\"; }\ndk() { curl -s -o /dev/null -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"fullName\\\":\\\"Sinh Vien Cham\\\",\\\"password\\\":\\\"$MKSV\\\"}\" $A/api/v1/auth/register; }\ntok() { curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"$2\\\"}\" $A/api/v1/auth/login | jq -r '.accessToken // empty'; }\nk6() { docker run --rm --network container:$N-net --cpus 2 --memory 512m --memory-swap 512m --user $(id -u):$(id -g) -v $L/k6:/k6:ro,z -e K6_NO_USAGE_REPORT=true grafana/k6:2.4.0 run -q --no-color \"$@\" 2>/dev/null | tail -1; }\ndk an@fpt.edu.vn; TA=$(tok an@fpt.edu.vn $MKSV); TQ=$(tok manager@fpt.edu.vn $MKQL); HQ=\"Authorization: Bearer $TQ\"\nP=/api/v1/bookings/pending\n# tham chiếu tính thẳng bằng SQL: id|tên|phút trong tuần của lượt đó\nref() { ps \"with p as (select b.id, b.owner_id, b.start_at, date_trunc('week', b.start_at) tuan from bookings b join labs l on l.id = b.lab_id\n  where l.code = '$1' and b.status = 'PENDING' order by b.start_at, b.id limit $3 offset $(($2 * $3)))\n  select p.id || '|' || a.full_name || '|' || (select coalesce(sum(extract(epoch from (x.end_at - x.start_at)) / 60), 0)::bigint from bookings x\n  where x.owner_id = p.owner_id and x.status in ('PENDING','CONFIRMED') and x.start_at >= p.tuan and x.start_at < p.tuan + interval '7 day')\n  from p join accounts a on a.id = p.owner_id order by p.start_at, p.id\"; }\napi() { curl -s -m 30 -H \"$HQ\" \"$A$P?lab=$1&page=$2&size=$3\" | jq -r '.items[] | \"\\(.id)|\\(.ownerName)|\\(.weekMinutes)\"' 2>/dev/null; }\ncurl -s -o /dev/null -m 60 -H \"$HQ\" \"$A$P?lab=AI-03\"   # một lượt làm nóng (JIT, cache phòng)\n\n# 1. đúng quyền\nm=$(ma $A \"$P?lab=AI-03\" 60 -H \"$HQ\"); s=$(ma $A \"$P?lab=AI-03\" 60 -H \"Authorization: Bearer $TA\"); x=$(ma $A \"$P?lab=KHONG-CO\" 60 -H \"$HQ\")\nok=0; [ \"$m$s$x\" = 200403404 ] && ok=1\nmuc 1 $ok \"MANAGER $m, sinh viên $s, phòng không tồn tại $x\"\n\n# 2 + 3. đúng dữ liệu, đúng phân trang, đúng tổng\nok=0; d=$(diff <(ref AI-03 0 20) <(api AI-03 0 20) | grep -c '^[<>]'); [ \"$d\" = 0 ] && [ -n \"$(ref AI-03 0 20)\" ] && ok=1\nsl=$(curl -s -H \"$HQ\" \"$A$P?lab=AI-03&size=1\" | jq -r '.items[0].slot'); [[ \"$sl\" =~ ^[0-9]{2}/[0-9]{2}/[0-9]{4}\\ [0-9]{2}:[0-9]{2}–[0-9]{2}:[0-9]{2}$ ]] || ok=0\nmuc 2 $ok \"trang 0 (20 dòng) của AI-03 khớp SQL tham chiếu: $d dòng lệch; slot dạng \\\"$sl\\\"\"\nok=0; d=$(diff <(ref NET-02 7 50) <(api NET-02 7 50) | grep -c '^[<>]'); t=$(curl -s -m 30 -H \"$HQ\" \"$A$P?lab=NET-02&page=7&size=50\" | jq -r .totalItems)\ntc=$(ps \"select count(*) from bookings b join labs l on l.id = b.lab_id where l.code = 'NET-02' and b.status = 'PENDING'\"); [ \"$d\" = 0 ] && [ \"$t\" = \"$tc\" ] && ok=1\nmuc 3 $ok \"trang 7 (50 dòng) của NET-02: $d dòng lệch; totalItems $t (CSDL: $tc)\"\n\n# 4. trần kích thước trang\na=$(ma $A \"$P?lab=AI-03&size=1000\" 60 -H \"$HQ\"); b=$(ma $A \"$P?lab=AI-03&size=100\" 60 -H \"$HQ\")\nok=0; [ \"$a$b\" = 400200 ] && ok=1\nmuc 4 $ok \"size=1000 ⇒ $a, size=100 ⇒ $b\"\n\n# 5. số câu SQL mỗi request\nps \"select pg_stat_statements_reset()\" >/dev/null\nfor p in $(seq 1 20); do curl -s -o /dev/null -m 30 -H \"$HQ\" \"$A$P?lab=HW-04&page=$p&size=20\"; done\nc=$(ps \"select coalesce(sum(calls),0) from pg_stat_statements where (query ilike '%bookings%' or query ilike '%accounts%' or query ilike '%labs%') and query not ilike '%pg_stat%'\")\nok=0; [ $((c / 20)) -le 5 ] && ok=1\nmuc 5 $ok \"20 request ⇒ $c câu SQL ($((c / 20)) câu mỗi request; tối đa 5)\"\n\n# 6 + 7. tải mở 30 lượt/giây trong 20 giây, readiness trong lúc tải\n( for i in $(seq 20); do printf '%s\\n' $(ma $Q /actuator/health/readiness 2); sleep 1; done ) > \"$W/ready.txt\" &\nRP=$!\nread n loi p50 p95 mx bo <<<\"$(k6 -e TOKEN=\"$TQ\" -e RATE=30 -e DUR=20s /k6/cho-duyet.js)\"\nwait $RP; rd=$(grep -vc '^200$' \"$W/ready.txt\")\nok=0; [ -n \"${p95:-}\" ] && [ \"$p95\" -lt 200 ] && ok=1\nmuc 6 $ok \"tải mở 30 lượt/giây × 20 giây: ${n:-?} request, p50 ${p50:-?} ms, p95 ${p95:-?} ms (cần < 200), max ${mx:-?} ms\"\nok=0; [ \"${loi:-x}\" = 0.0 ] && [ \"${bo:-1}\" = 0 ] && [ \"$rd\" = 0 ] && ok=1\nmuc 7 $ok \"trong lúc tải: lỗi ${loi:-?}%, bỏ lỡ ${bo:-?} lượt, readiness khác 200: $rd/20 lần\"\n\n# 8. không \"tối ưu\" bằng cách phình pool\nmx=$(curl -s $Q/actuator/prometheus | grep -E '^hikaricp_connections_max\\{' | awk '{print int($NF)}' | head -1)\nok=0; [ -n \"$mx\" ] && [ \"$mx\" -le 20 ] && ok=1\nmuc 8 $ok \"hikaricp_connections_max = ${mx:-?} (tối đa 20)\"\n\n# 9. lượt đặt mới hiện NGAY trong danh sách chờ duyệt\nt0=$(curl -s -m 30 -H \"$HQ\" \"$A$P?lab=AI-03&size=20\" | jq -r .totalItems); NG=$(date -d '+3 day' +%F); id=\nfor h in 08 09 10 11 12 13 14 15 16 17 18 19; do\n  r=$(curl -s -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-cham16-$h\" -d \"{\\\"labCode\\\":\\\"AI-03\\\",\\\"startAt\\\":\\\"${NG}T$h:00\\\",\\\"endAt\\\":\\\"${NG}T$h:30\\\",\\\"purpose\\\":\\\"cham lab 16\\\"}\" $A/api/v1/bookings)\n  id=$(echo \"$r\" | jq -r 'select(.status == \"PENDING\") | .id' 2>/dev/null); [ -n \"$id\" ] && break; done\nvt=$(ps \"select count(*) from bookings b join labs l on l.id = b.lab_id where l.code = 'AI-03' and b.status = 'PENDING' and (b.start_at, b.id) < (select start_at, id from bookings where id = ${id:-0})\")\npg=$((vt / 20)); t1=$(curl -s -m 30 -H \"$HQ\" \"$A$P?lab=AI-03&size=20\" | jq -r .totalItems)\nco=$(curl -s -m 30 -H \"$HQ\" \"$A$P?lab=AI-03&page=$pg&size=20\" | jq --arg id \"${id:-0}\" '[.items[] | select((.id|tostring) == $id)] | length')\nok=0; [ -n \"$id\" ] && [ \"$t1\" = $((t0 + 1)) ] && [ \"$co\" = 1 ] && ok=1\nmuc 9 $ok \"đặt lượt #${id:-?} (PENDING) ⇒ totalItems $t0 → $t1, có mặt ở trang $pg: $co\"\n\n# 10. lượt vừa được duyệt biến mất NGAY\nv=$(curl -s -H \"$HQ\" $A/api/v1/bookings/${id:-0} | jq -r .version)\nc=$(curl -s -o /dev/null -w '%{http_code}' -H \"$HQ\" -H \"$J\" -d \"{\\\"version\\\":${v:-0}}\" $A/api/v1/bookings/${id:-0}/approve)\nt2=$(curl -s -m 30 -H \"$HQ\" \"$A$P?lab=AI-03&size=20\" | jq -r .totalItems)\nco=$(curl -s -m 30 -H \"$HQ\" \"$A$P?lab=AI-03&page=$pg&size=20\" | jq --arg id \"${id:-0}\" '[.items[] | select((.id|tostring) == $id)] | length')\nok=0; [ \"$c\" = 200 ] && [ \"$t2\" = \"$t0\" ] && [ \"$co\" = 0 ] && ok=1\nmuc 10 $ok \"duyệt lượt #${id:-?} ($c) ⇒ totalItems $t1 → $t2, còn ở trang $pg: $co\"\n\necho \"Điểm: $diem/10\"");
const MA165_STARTER = java("/** Bản \"chạy được trên máy em\" của một thành viên nhóm: đúng dữ liệu, nhưng thử với 200.000 lượt đặt thì… */\n@Service\n@Transactional(readOnly = true)\nclass ChoDuyetService {\n    private final BookingRepository bookings;\n    private final LabCatalog catalog;\n    private final DanhBa danhBa;\n    ChoDuyetService(BookingRepository bookings, LabCatalog catalog, DanhBa danhBa) { this.bookings = bookings; this.catalog = catalog; this.danhBa = danhBa; }\n\n    BookingController.Trang<ChoDuyetView> choDuyet(String labCode, int page, int size) {\n        LabInfo lab = catalog.timTheoMa(labCode).orElseThrow(() -> LoiNghiepVu.khongThay(\"phòng \" + labCode));\n        List<Booking> loc = bookings.findAll().stream()\n            .filter(b -> b.getLabId() == lab.id() && b.getStatus() == Booking.Status.PENDING)\n            .sorted(Comparator.comparing(Booking::getStartAt).thenComparing(Booking::getId))\n            .toList();\n        List<ChoDuyetView> items = loc.stream().skip((long) page * size).limit(size).map(b -> {\n            LocalDate thu2 = b.getStartAt().toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));\n            long phut = bookings.phutTrongTuan(b.getOwnerId(), thu2.atStartOfDay(), thu2.plusWeeks(1).atStartOfDay());\n            DateTimeFormatter f = DateTimeFormatter.ofPattern(\"dd/MM/yyyy HH:mm\");\n            String slot = b.getStartAt().format(f) + \"–\" + b.getEndAt().format(DateTimeFormatter.ofPattern(\"HH:mm\"));\n            return new ChoDuyetView(b.getId(), danhBa.ten(b.getOwnerId()), b.getStartAt(), b.getEndAt(), slot, b.getPurpose(), phut);\n        }).toList();\n        return new BookingController.Trang<>(items, page, size, loc.size(), (int) Math.ceil(loc.size() / (double) size));\n    }\n}");
const MA165_K6 = js("// cho-duyet.js — tải MỞ lên màn \"Chờ duyệt\": RATE lượt/giây, phòng và trang ngẫu nhiên, token MANAGER truyền qua -e TOKEN\nimport http from 'k6/http';\nconst LABS = ['IOT-01', 'NET-02', 'AI-03', 'HW-04'];\nexport const options = {\n  discardResponseBodies: true, summaryTrendStats: ['avg', 'p(50)', 'p(95)', 'p(99)', 'max'],\n  scenarios: { s: { executor: 'constant-arrival-rate', rate: +(__ENV.RATE || 30), timeUnit: '1s', duration: __ENV.DUR || '20s', preAllocatedVUs: 50, maxVUs: 300 } },\n};\nexport default function () {\n  const lab = LABS[Math.floor(Math.random() * 4)], page = Math.floor(Math.random() * 30);\n  http.get(`http://localhost:8080/api/v1/bookings/pending?lab=${lab}&page=${page}&size=20`, { headers: { Authorization: `Bearer ${__ENV.TOKEN}` }, timeout: '10s' });\n}\nexport function handleSummary(d) {\n  const t = d.metrics.http_req_duration.values, n = d.metrics.http_reqs.values, f = d.metrics.http_req_failed.values;\n  const bo = d.metrics.dropped_iterations ? d.metrics.dropped_iterations.values.count : 0;\n  return { stdout: `${n.count} ${(f.rate * 100).toFixed(1)} ${t['p(50)'].toFixed(0)} ${t['p(95)'].toFixed(0)} ${t.max.toFixed(0)} ${bo}\\n` };\n}");
const MA165_GIAI_SV = java("/** Lời giải: 3 câu SQL mỗi trang bất kể kích thước trang (trang + tổng, tên, số phút), phân trang trong CSDL, chỉ mục đúng cột. */\n@Service\n@Transactional(readOnly = true)\nclass ChoDuyetService {\n    private static final DateTimeFormatter NGAY_GIO = DateTimeFormatter.ofPattern(\"dd/MM/yyyy HH:mm\");\n    private static final DateTimeFormatter GIO = DateTimeFormatter.ofPattern(\"HH:mm\");\n    record Dong(long id, long ownerId, LocalDateTime startAt, LocalDateTime endAt, String purpose, long tong) { }\n    record PhutTuan(long ownerId, LocalDateTime startAt, LocalDateTime endAt) { }\n\n    private final JdbcClient db;\n    private final LabCatalog catalog;\n    private final DanhBa danhBa;\n    ChoDuyetService(JdbcClient db, LabCatalog catalog, DanhBa danhBa) { this.db = db; this.catalog = catalog; this.danhBa = danhBa; }\n\n    BookingController.Trang<ChoDuyetView> choDuyet(String labCode, int page, int size) {\n        LabInfo lab = catalog.timTheoMa(labCode).orElseThrow(() -> LoiNghiepVu.khongThay(\"phòng \" + labCode));   // cache Redis (Ch.13)\n        // (1) một trang + tổng số dòng trong CÙNG một câu; chỉ mục (lab_id, start_at, id) where status = 'PENDING'\n        List<Dong> trang = db.sql(\"\"\"\n                select id, owner_id, start_at, end_at, purpose, count(*) over () as tong from bookings\n                where lab_id = :lab and status = 'PENDING' order by start_at, id limit :size offset :off\"\"\")\n            .param(\"lab\", lab.id()).param(\"size\", size).param(\"off\", (long) page * size).query(Dong.class).list();\n        long tong = trang.isEmpty() ? demRieng(lab.id()) : trang.getFirst().tong();\n        if (trang.isEmpty()) return new BookingController.Trang<>(List.of(), page, size, tong, (int) Math.ceil(tong / (double) size));\n        // (2) tên của mọi người đặt trong trang: một câu \"where id in (…)\"\n        Set<Long> owners = trang.stream().map(Dong::ownerId).collect(Collectors.toSet());\n        Map<Long, String> ten = danhBa.ten(owners);\n        // (3) số phút đã giữ theo (người, tuần): một câu cho mọi người trong trang, cộng dồn trong Java\n        LocalDateTime tu = thu2(trang.getFirst().startAt()), den = thu2(trang.getLast().startAt()).plusWeeks(1);\n        Map<String, Long> phut = new HashMap<>();\n        db.sql(\"\"\"\n                select owner_id, start_at, end_at from bookings\n                where owner_id in (:owners) and status in ('PENDING', 'CONFIRMED') and start_at >= :tu and start_at < :den\"\"\")\n            .param(\"owners\", owners).param(\"tu\", tu).param(\"den\", den).query(PhutTuan.class).list()\n            .forEach(p -> phut.merge(p.ownerId() + \"@\" + thu2(p.startAt()), java.time.Duration.between(p.startAt(), p.endAt()).toMinutes(), Long::sum));\n        List<ChoDuyetView> items = trang.stream().map(d -> new ChoDuyetView(d.id(), ten.getOrDefault(d.ownerId(), \"(đã xoá)\"), d.startAt(), d.endAt(),\n                d.startAt().format(NGAY_GIO) + \"–\" + d.endAt().format(GIO), d.purpose(), phut.getOrDefault(d.ownerId() + \"@\" + thu2(d.startAt()), 0L)))\n            .toList();\n        return new BookingController.Trang<>(items, page, size, tong, (int) Math.ceil(tong / (double) size));\n    }\n\n    private long demRieng(long lab) {   // trang vượt quá cuối danh sách: vẫn trả đúng tổng\n        return db.sql(\"select count(*) from bookings where lab_id = ? and status = 'PENDING'\").param(lab).query(Long.class).single();\n    }\n    private static LocalDateTime thu2(LocalDateTime t) {\n        return t.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();\n    }\n}");
const MA165_GIAI_DB = sql("-- Lab 16: chỉ mục cho màn \"Chờ duyệt\" (lọc lab_id + PENDING, sắp theo start_at, id) và cho câu số phút theo người + tuần\ncreate index bookings_cho_duyet on bookings (lab_id, start_at, id) where status = 'PENDING';\ncreate index bookings_owner_hieu_luc on bookings (owner_id, start_at) include (end_at) where status in ('PENDING', 'CONFIRMED');");
const MA165_GIAI_DB2 = java("public Map<Long, String> ten(Collection<Long> accountIds) {\n    Map<Long, String> m = new HashMap<>();\n    if (accountIds.isEmpty()) return m;\n    for (Account a : accounts.findAllById(accountIds)) m.put(a.getId(), a.getFullName());   // where id in (…)\n    return m;\n}");
const OUT165S = out("$ bash lab16/lam.sh starter && bash lab16/cham.sh /tmp/lab/starter\nMục 1: ĐẠT   — MANAGER 200, sinh viên 403, phòng không tồn tại 404\nMục 2: ĐẠT   — trang 0 (20 dòng) của AI-03 khớp SQL tham chiếu: 0 dòng lệch; slot dạng \"01/01/2021 16:00–16:59\"\nMục 3: ĐẠT   — trang 7 (50 dòng) của NET-02: 0 dòng lệch; totalItems 8333 (CSDL: 8333)\nMục 4: TRƯỢT — size=1000 ⇒ 200, size=100 ⇒ 200\nMục 5: TRƯỢT — 20 request ⇒ 7032 câu SQL (351 câu mỗi request; tối đa 5)\nMục 6: TRƯỢT — tải mở 30 lượt/giây × 20 giây: 413 request, p50 0 ms, p95 10001 ms (cần < 200), max 10002 ms\nMục 7: TRƯỢT — trong lúc tải: lỗi 100.0%, bỏ lỡ 188 lượt, readiness khác 200: 6/20 lần\nMục 8: TRƯỢT — hikaricp_connections_max = ? (tối đa 20)\nMục 9: TRƯỢT — đặt lượt #? (PENDING) ⇒ totalItems  → , có mặt ở trang 0: \nMục 10: TRƯỢT — duyệt lượt #? (000) ⇒ totalItems  → , còn ở trang 0: \nĐiểm: 3/10");
const OUT165G = out("$ bash lab16/lam.sh giai && bash lab16/cham.sh /tmp/lab/giai\nMục 1: ĐẠT   — MANAGER 200, sinh viên 403, phòng không tồn tại 404\nMục 2: ĐẠT   — trang 0 (20 dòng) của AI-03 khớp SQL tham chiếu: 0 dòng lệch; slot dạng \"01/01/2021 16:00–16:59\"\nMục 3: ĐẠT   — trang 7 (50 dòng) của NET-02: 0 dòng lệch; totalItems 8333 (CSDL: 8333)\nMục 4: ĐẠT   — size=1000 ⇒ 400, size=100 ⇒ 200\nMục 5: ĐẠT   — 20 request ⇒ 61 câu SQL (3 câu mỗi request; tối đa 5)\nMục 6: ĐẠT   — tải mở 30 lượt/giây × 20 giây: 601 request, p50 24 ms, p95 52 ms (cần < 200), max 158 ms\nMục 7: ĐẠT   — trong lúc tải: lỗi 0.0%, bỏ lỡ 0 lượt, readiness khác 200: 0/20 lần\nMục 8: ĐẠT   — hikaricp_connections_max = 10 (tối đa 20)\nMục 9: ĐẠT   — đặt lượt #200001 (PENDING) ⇒ totalItems 8333 → 8334, có mặt ở trang 143: 1\nMục 10: ĐẠT   — duyệt lượt #200001 (200) ⇒ totalItems 8334 → 8333, còn ở trang 143: 0\nĐiểm: 10/10");
const OUT165B = out("$ bash lab16/lam.sh bay && bash lab16/cham.sh /tmp/lab/bay\nMục 1: ĐẠT   — MANAGER 200, sinh viên 403, phòng không tồn tại 404\nMục 2: ĐẠT   — trang 0 (20 dòng) của AI-03 khớp SQL tham chiếu: 0 dòng lệch; slot dạng \"01/01/2021 16:00–16:59\"\nMục 3: ĐẠT   — trang 7 (50 dòng) của NET-02: 0 dòng lệch; totalItems 8333 (CSDL: 8333)\nMục 4: ĐẠT   — size=1000 ⇒ 400, size=100 ⇒ 200\nMục 5: ĐẠT   — 20 request ⇒ 61 câu SQL (3 câu mỗi request; tối đa 5)\nMục 6: ĐẠT   — tải mở 30 lượt/giây × 20 giây: 601 request, p50 9 ms, p95 39 ms (cần < 200), max 310 ms\nMục 7: ĐẠT   — trong lúc tải: lỗi 0.0%, bỏ lỡ 0 lượt, readiness khác 200: 0/20 lần\nMục 8: ĐẠT   — hikaricp_connections_max = 10 (tối đa 20)\nMục 9: TRƯỢT — đặt lượt #200001 (PENDING) ⇒ totalItems 8333 → 8333, có mặt ở trang 143: 1\nMục 10: TRƯỢT — duyệt lượt #200001 (200) ⇒ totalItems 8333 → 8333, còn ở trang 143: 1\nĐiểm: 8/10");
const OUT165M = out("$ curl -s -o /dev/null -w \"%{http_code} %{time_total}s\\n\" -H \"Authorization: Bearer $TOKEN_QL\" \"localhost:8080/api/v1/bookings/pending?lab=HW-04&page=3&size=20\"\n200 8.427453s\n$ psql -c \"select calls, left(query, 110) from pg_stat_statements order by calls desc\"\n20|select coalesce(sum(extract(epoch from b1_0.end_at-b1_0.start_at)/60),0) from bookings b1_0 where b1_0.owner_i\n20|select a1_0.id,a1_0.email,a1_0.full_name,a1_0.password_hash,a1_0.role from accounts a1_0 where a1_0.id=$1\n1|select b1_0.id,b1_0.end_at,b1_0.idempotency_key,b1_0.lab_id,b1_0.owner_id,b1_0.purpose,b1_0.reject_reason,b1_0\n1|select l1_0.id,l1_0.building,l1_0.capacity,l1_0.code,l1_0.name,l1_0.requires_approval,l1_0.status from labs l1\n1|BEGIN READ ONLY");

const L165_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.5 · Lab</span>
<h2>Chapter 16 lab + interview questions</h2>
<p class="lead">Two weeks before the semester, a teammate merges the "Pending approval" screen for lab managers: a list of PENDING bookings of one lab, with the student's name, the slot, and how many minutes that student already holds in the same week (rule BR-05). On his laptop, with the few dozen bookings of the dev seed, it feels instant. On a database the size of a real campus — 2,000 students, 200,000 bookings — one request takes <strong>8.4 seconds</strong>, and 30 managers refreshing the page bring the whole of LabFlow down, health checks included. Your task: make that endpoint fast <em>without</em> changing its answer, prove it with numbers before and after, and do not "fix" it with the two shortcuts every team tries first — a bigger pool and a cache.</p>

<h3>The starting point</h3>
<p>LabFlow at the end of Chapter 15 plus the teammate's code: <code>GET /api/v1/bookings/pending?lab=AI-03&amp;page=0&amp;size=20</code> (role MANAGER). The data is correct — the grader compares it row by row with a reference SQL query — and that is exactly what makes it a good lab: every optimisation must keep the same output.</p>
${MA165_STARTER}
<p>Read it the way lesson 16.3 taught: count the round trips. One <code>findAll()</code> that loads all 200,000 bookings into memory to keep 20 of them, then <em>two</em> queries per row of the page — the week's minutes and the owner's name. Measured on one request with the statistics reset just before:</p>
${OUT165M}
<p>42 statements and 8.4 s for one page. Notice also the second line: to show a <em>name</em>, the code loads the whole account row, password hash included. Over-fetching is a performance problem and a data-exposure habit at the same time.</p>

<h3>Requirements (what the grader checks)</h3>
<ol>
  <li><strong>Access</strong>: MANAGER ⇒ 200, a student ⇒ 403, an unknown lab ⇒ 404.</li>
  <li><strong>Same data, first page</strong>: page 0 (20 rows) of <code>AI-03</code> equals the reference SQL row by row — <code>id</code>, <code>ownerName</code>, <code>weekMinutes</code> — and <code>slot</code> keeps the format <code>dd/MM/yyyy HH:mm–HH:mm</code>.</li>
  <li><strong>Same data, deep page</strong>: page 7 with <code>size=50</code> of <code>NET-02</code> equals the reference, and <code>totalItems</code> equals the count in the database.</li>
  <li><strong>Bounded page size</strong>: <code>size=1000</code> ⇒ 400 (ProblemDetail of Chapter 5), <code>size=100</code> ⇒ 200.</li>
  <li><strong>At most 5 SQL statements per request</strong>, counted by <code>pg_stat_statements</code> over 20 requests — whatever the page size.</li>
  <li><strong>Latency under open load</strong>: 30 requests/second for 20 s (random lab, random page 0–29) ⇒ p95 &lt; 200 ms.</li>
  <li><strong>Nobody else suffers</strong>: during that load, 0 % errors, 0 dropped iterations, and readiness on port 8081 answers 200 all 20 times.</li>
  <li><strong>No inflated pool</strong>: <code>hikaricp_connections_max</code> ≤ 20 (lesson 16.1: the pool size belongs to the database).</li>
  <li><strong>Fresh after a booking</strong>: a student books a slot ⇒ <code>totalItems</code> grows by 1 immediately and the booking is on its page.</li>
  <li><strong>Fresh after an approval</strong>: the manager approves it ⇒ <code>totalItems</code> goes back and the booking is gone from its page immediately.</li>
</ol>
<p>Items 9 and 10 are there on purpose: they are what a cache breaks.</p>

<h3>The load script</h3>
<p>An <em>open</em> model (lesson 16.3): 30 arrivals per second whatever the server does, so a slow server cannot hide its slowness by slowing the test down. The last line prints six numbers for the grader: requests, % failed, p50, p95, max, dropped iterations.</p>
${MA165_K6}

<h3>The grader</h3>
<p>It copies your project, compiles it in a JDK 21 container, starts PostgreSQL 16 (2 CPUs, with <code>pg_stat_statements</code>), Redis 7 and your app (2 CPUs, 1 GB) in one network namespace, seeds a campus-sized dataset through its own migration (not part of your project), and runs k6 in a separate container. Passwords and the JWT key are generated per run and never printed. About 4 minutes per run:</p>
${MA165_CHAM}

<h3>Results on the course machine</h3>
<p>The numbers below were measured while the build machine was also rendering videos, so absolute values move between runs (the official solution scored p95 36 ms in one run and 52 ms in another). Compare versions, not single numbers.</p>
${OUT165S}
<p>The starter is correct (items 1–3) and nothing else. No page-size cap. Item 5 shows 351 statements per request: the grader counts every statement that touches the three tables during the whole window of its 20 requests, and with the starter that window lasts minutes; the clean measurement for one request is the 42 above. Under 30 requests/second every request hits k6's 10-second timeout (p95 10,001 ms), 100 % fail, readiness stops answering — the slow endpoint took the health check down with it — and after the load the app no longer answers the grader at all (the <code>?</code> of items 8–10): each starter request pulls 200,000 entities into a 1 GB container.</p>
${OUT165G}
<p>The official solution: 3 statements per request (61 for 20 requests — the extra one is the first lookup of lab HW-04, before it lands in the Redis cache of Chapter 13), p95 52 ms at 30 requests/second, no errors, readiness always 200 — with the <strong>default pool of 10</strong>. Nothing was tuned; the work was removed.</p>
${OUT165B}
<p>The trap version is the official solution plus one annotation — "let's cache it too, even faster":</p>
<pre><code>@Cacheable(cacheNames = "cho-duyet", key = "#labCode + ':' + #page + ':' + #size")</code></pre>
<p>p50 drops from 24 to 9 ms, and items 9 and 10 fail. Page 0 sits in Redis for 10 minutes, so <code>totalItems</code> stays 8,333 after a new booking. Page 143 was not cached yet, so the new booking does show there; then the grader approves it — and now page 143 <em>is</em> cached, so the approved booking stays on the manager's list. A manager tries to approve it again, or worse, believes a slot is still waiting. This is lesson 13.3 in one line: a cache without an invalidation plan is a bug with good latency. Here the cache was also unnecessary — 52 ms was already four times under the target.</p>

<h3>Hints (before you open the solution)</h3>
<ul>
  <li>Measure first: <code>pg_stat_statements</code> sorted by <code>calls</code> and by <code>total_exec_time</code>, then <code>EXPLAIN (ANALYZE, BUFFERS)</code> on the query you write (16.3).</li>
  <li>Filtering, sorting and paging belong in the database. So does counting.</li>
  <li>"One query per row" becomes "one query per page": collect the ids of the page, ask once with <code>in (…)</code>. The <code>identity</code> module may get a new method in its public API; do not read the <code>accounts</code> table from the <code>booking</code> module (Chapter 18's module rules).</li>
  <li>The week's minutes for 20 rows: one query for all owners of the page over the range of weeks the page covers, summed in Java.</li>
  <li>An index must match the <code>where</code> + <code>order by</code> of your query; a partial index (<code>where status = 'PENDING'</code>) stays small.</li>
  <li>Write the before/after report as you go (template below), one change at a time.</li>
</ul>

<h3>The before/after report (what you hand in with the code)</h3>
<table>
<thead><tr><th></th><th>Before (starter)</th><th>After (solution)</th></tr></thead>
<tbody>
<tr><td>Environment</td><td colspan="2">App 2 CPU / 1 GB, PostgreSQL 16 2 CPU, k6 in its own container; 2,000 students, 200,000 bookings; machine under background load</td></tr>
<tr><td>One request, cold statistics</td><td>42 statements, 8.4 s</td><td>3 statements</td></tr>
<tr><td>30 req/s × 20 s</td><td>p95 10,001 ms (timeout), 100 % errors</td><td>p50 24 ms, p95 52 ms, 0 % errors</td></tr>
<tr><td>Readiness during load</td><td>6/20 not 200</td><td>20/20 OK</td></tr>
<tr><td>Pool</td><td>10</td><td>10 (unchanged)</td></tr>
<tr><td>What changed</td><td colspan="2">Paging + count in SQL, partial index, names by batch, week minutes by batch, page-size cap</td></tr>
</tbody>
</table>
<p>A report like this is what a tech lead wants in the pull request: the environment, the load model, percentiles and errors, and what changed. "Feels faster" does not go in it.</p>

<h3>🕵️ Hacker corner — an unbounded <code>size</code> is a denial of service you ship yourself</h3>
<p>Without item 4, anyone with a MANAGER account (or a stolen token) sends <code>size=1000000</code> and the server builds a million-row response — the starter did that even with <code>size=20</code>. OWASP lists this as <strong>API4:2023 Unrestricted Resource Consumption</strong> in its API Security Top 10: page sizes, upload sizes, number of ids in a batch, query depth. Every one of them needs a server-side maximum, a 400 above it, and a timeout under it. The same reasoning applies to the "export all" button someone will ask for next: make it a background job (Chapter 14), not a giant page.</p>

${giai('Show the official solution (try first!)', `<p>Four changes. The migration — a partial index that matches <code>where lab_id = ? and status = 'PENDING' order by start_at, id</code> exactly, and a covering index for the week-minutes query:</p>
${MA165_GIAI_DB}
<p>A batch method in the public API of <code>identity</code> (<code>DanhBa</code>), so <code>booking</code> still never reads <code>accounts</code> directly — one <code>where id in (…)</code> for the whole page:</p>
${MA165_GIAI_DB2}
<p>The service: (1) one query returns the page <em>and</em> the total via <code>count(*) over ()</code>, with a separate count only when the page is past the end; (2) the names in one call; (3) the minutes of every owner in the page over the weeks the page covers, in one query, summed per (owner, Monday) in Java. Three statements whatever <code>size</code> is:</p>
${MA165_GIAI_SV}
<p>The controller adds the cap: <code>@RequestParam(defaultValue = "20") @Min(1) @Max(100) int size</code> and <code>@Min(0)</code> on <code>page</code>. Spring MVC's method validation turns a violation into <code>HandlerMethodValidationException</code>, which the <code>XuLyLoi</code> handler of Chapter 5 already answers with a 400 ProblemDetail.</p>
<p>What the solution deliberately does <em>not</em> do: change the pool (item 8), add a cache (items 9–10), or switch on virtual threads — the endpoint now spends a few milliseconds in the database, so there is nothing left to wait for.</p>`)}

<h3>🎤 Chapter 16 — what the interviewer will ask</h3>
<ol>
  <li><strong>"The API gets slow when many users come, but the database looks healthy. What do you check first?"</strong> — The connection pool: <code>hikaricp_connections_pending</code> and acquire time. Little's law predicts it: 10 connections × 200 ms = 50 req/s, more users only add waiting. Then look for connections held without work (<code>idle in transaction</code>, Open Session in View) and set a short <code>connection-timeout</code> that answers 503 + <code>Retry-After</code> instead of 500.</li>
  <li><strong>"How big should the pool be? Why not 100?"</strong> — Sized for the database, not the users: roughly (cores × 2) + disks. Measured on 2 CPUs: pool 100 gave slightly <em>lower</em> throughput and 2,032 ms per query inside PostgreSQL versus 38 ms with pool 2. And instances × pool must stay under <code>max_connections</code>.</li>
  <li><strong>"When do virtual threads help, and when not?"</strong> — When threads mostly wait on I/O and concurrency exceeds the ~200 Tomcat threads: 659 → 2,658 req/s with one property. They add no connections (52 % 503 with pool 10), no CPU (BCrypt unchanged, worse tail), and on Java 21 blocking inside <code>synchronized</code> pins the carrier (6.6 req/s; fixed in Java 24+).</li>
  <li><strong>"How do you load-test honestly?"</strong> — Open model (closed model showed p99 62 ms for a 3-second freeze, open model 2,973 ms), warm-up, production-sized data, p95/p99 and errors, thresholds that fail CI, load generator on its own CPUs, one change at a time. Then find the bottleneck with <code>pg_stat_statements</code> + <code>EXPLAIN</code> and JFR instead of guessing.</li>
  <li><strong>"Spring Boot or Node.js — which is faster?"</strong> — Depends on the road: Node won pure waiting, bare Spring won a DB query against one Node process (two Node processes tied), CPU work depends on native code. Node's weak spot is blocking the event loop (a 50 ms request became 8.3 s); and full LabFlow was 4–5× slower than bare Spring on trivial endpoints — measure the stack, not the language.</li>
</ol>

<h3>Where to go deeper</h3>
<table>
<thead><tr><th>Course</th><th>For what in this chapter</th></tr></thead>
<tbody>
<tr><td><a href="/courses/postgresql">PostgreSQL</a></td><td>Indexes, partial and covering indexes, <code>EXPLAIN</code>, <code>pg_stat_statements</code>, <code>max_connections</code> — the database side of 16.1, 16.3 and this lab</td></tr>
<tr><td><a href="/courses/performance-load-testing">Performance &amp; load testing</a></td><td>k6 in depth: scenarios, thresholds in CI, soak and spike tests</td></tr>
<tr><td><a href="/courses/observability-monitoring">Observability &amp; monitoring</a></td><td>Dashboards and alerts for the Hikari and latency metrics of 16.1</td></tr>
<tr><td><a href="/courses/redis">Redis</a></td><td>Caching with an invalidation plan — what the trap version lacked</td></tr>
<tr><td><a href="/courses/nodejs/learn">Node.js</a></td><td>The event loop and worker threads behind the comparison of 16.4</td></tr>
</tbody>
</table>

<h3>📌 Summary</h3>
<ul>
  <li>Ten checks turn "make it faster" into something measurable: the same data, a bounded request, few statements, p95 under open load, nobody else hurt, no inflated pool, no stale cache.</li>
  <li>Starter 3/10 (8.4 s and 42 statements for one page), official solution 10/10 (3 statements, p95 52 ms, pool untouched), cache trap 8/10 (faster and wrong).</li>
  <li>Chapter 16 in one line: measure under realistic load, find the bottleneck with tools, remove work before adding resources — and prove it with before/after numbers.</li>
</ul>
</div>
`;

const L165_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.5 · Lab</span>
<h2>Lab chương 16 + câu hỏi phỏng vấn</h2>
<p class="lead">Hai tuần trước học kỳ, một bạn trong nhóm gộp vào màn hình "Chờ duyệt" cho quản lý phòng lab: danh sách các lượt PENDING của một phòng, kèm tên sinh viên, khung giờ, và tuần đó sinh viên ấy đã giữ bao nhiêu phút (quy tắc BR-05). Trên máy bạn ấy, với vài chục lượt đặt của dữ liệu dev, nó hiện ra tức thì. Trên CSDL cỡ một trường thật — 2.000 sinh viên, 200.000 lượt đặt — một request mất <strong>8,4 giây</strong>, và 30 quản lý cùng bấm tải lại là kéo sập cả LabFlow, kể cả health check. Nhiệm vụ: làm endpoint đó nhanh mà <em>không</em> đổi câu trả lời, chứng minh bằng số đo trước/sau, và không "sửa" bằng hai lối tắt nhóm nào cũng thử trước — phình pool và thêm cache.</p>

<h3>Điểm xuất phát</h3>
<p>LabFlow cuối Chương 15 cộng mã của bạn cùng nhóm: <code>GET /api/v1/bookings/pending?lab=AI-03&amp;page=0&amp;size=20</code> (vai trò MANAGER). Dữ liệu đúng — bộ chấm so từng dòng với một câu SQL tham chiếu — và chính vì thế đây là bài lab tốt: mọi lần tối ưu phải giữ nguyên kết quả.</p>
${MA165_STARTER}
<p>Đọc theo cách bài 16.3 đã dạy: đếm số lượt đi về CSDL. Một <code>findAll()</code> nạp cả 200.000 lượt đặt vào bộ nhớ để giữ lại 20, rồi <em>hai</em> câu cho mỗi dòng của trang — số phút trong tuần và tên người đặt. Đo trên đúng một request, sổ thống kê vừa đặt lại ngay trước đó:</p>
${OUT165M}
<p>42 câu SQL và 8,4 giây cho một trang. Để ý cả dòng thứ hai: chỉ để hiện một cái <em>tên</em>, mã nạp nguyên dòng tài khoản, có cả giá trị băm mật khẩu. Lấy thừa dữ liệu vừa là vấn đề hiệu năng, vừa là thói quen làm lộ dữ liệu.</p>

<h3>Yêu cầu (thứ bộ chấm kiểm)</h3>
<ol>
  <li><strong>Quyền</strong>: MANAGER ⇒ 200, sinh viên ⇒ 403, phòng không tồn tại ⇒ 404.</li>
  <li><strong>Đúng dữ liệu, trang đầu</strong>: trang 0 (20 dòng) của <code>AI-03</code> khớp từng dòng với SQL tham chiếu — <code>id</code>, <code>ownerName</code>, <code>weekMinutes</code> — và <code>slot</code> giữ dạng <code>dd/MM/yyyy HH:mm–HH:mm</code>.</li>
  <li><strong>Đúng dữ liệu, trang sâu</strong>: trang 7 với <code>size=50</code> của <code>NET-02</code> khớp tham chiếu, và <code>totalItems</code> bằng số đếm trong CSDL.</li>
  <li><strong>Trần kích thước trang</strong>: <code>size=1000</code> ⇒ 400 (ProblemDetail của Chương 5), <code>size=100</code> ⇒ 200.</li>
  <li><strong>Tối đa 5 câu SQL mỗi request</strong>, đếm bằng <code>pg_stat_statements</code> qua 20 request — kích thước trang bao nhiêu cũng vậy.</li>
  <li><strong>Độ trễ dưới tải mở</strong>: 30 request/giây trong 20 giây (phòng ngẫu nhiên, trang ngẫu nhiên 0–29) ⇒ p95 &lt; 200 ms.</li>
  <li><strong>Không ai khác bị vạ lây</strong>: trong lúc tải, 0 % lỗi, 0 lượt bị bỏ lỡ, và readiness ở cổng 8081 trả 200 đủ 20 lần.</li>
  <li><strong>Không phình pool</strong>: <code>hikaricp_connections_max</code> ≤ 20 (bài 16.1: kích thước pool thuộc về CSDL).</li>
  <li><strong>Mới ngay sau khi đặt</strong>: sinh viên đặt một khung giờ ⇒ <code>totalItems</code> tăng 1 ngay lập tức và lượt đó có mặt ở trang của nó.</li>
  <li><strong>Mới ngay sau khi duyệt</strong>: quản lý duyệt lượt đó ⇒ <code>totalItems</code> trở lại như cũ và lượt đó biến mất khỏi trang ngay lập tức.</li>
</ol>
<p>Mục 9 và 10 được đặt vào có chủ ý: đó là thứ một cái cache làm hỏng.</p>

<h3>Kịch bản tải</h3>
<p>Mô hình <em>mở</em> (bài 16.3): 30 lượt đến mỗi giây dù server làm gì, nên server chậm không thể giấu sự chậm bằng cách kéo chậm luôn bài đo. Dòng cuối in sáu con số cho bộ chấm: số request, % lỗi, p50, p95, max, số lượt bị bỏ lỡ.</p>
${MA165_K6}

<h3>Bộ chấm</h3>
<p>Nó chép dự án của bạn, biên dịch trong container JDK 21, khởi động PostgreSQL 16 (2 CPU, có <code>pg_stat_statements</code>), Redis 7 và ứng dụng của bạn (2 CPU, 1 GB) trong cùng một network namespace, nạp bộ dữ liệu cỡ một trường bằng migration riêng của nó (không nằm trong dự án của bạn), và chạy k6 trong một container riêng. Mật khẩu và khoá JWT sinh mới mỗi lượt và không bao giờ in ra. Khoảng 4 phút một lượt:</p>
${MA165_CHAM}

<h3>Kết quả trên máy dựng bài</h3>
<p>Các con số dưới đây đo khi máy dựng bài đang render video song song, nên giá trị tuyệt đối xê dịch giữa các lượt (lời giải chính thức được p95 36 ms ở một lượt và 52 ms ở lượt khác). Hãy so các phiên bản với nhau, đừng so một con số đứng riêng.</p>
${OUT165S}
<p>Bản khởi đầu đúng (mục 1–3) và chỉ có vậy. Không có trần kích thước trang. Mục 5 ra 351 câu mỗi request: bộ chấm đếm mọi câu chạm ba bảng trong suốt khoảng thời gian 20 request của nó, mà với bản khởi đầu khoảng đó kéo dài vài phút; con số sạch cho một request là 42 câu ở trên. Dưới 30 request/giây, request nào cũng chạm thời hạn 10 giây của k6 (p95 10.001 ms), 100 % lỗi, readiness thôi trả lời — endpoint chậm kéo cả health check chết theo — và sau đợt tải ứng dụng không còn trả lời bộ chấm nữa (dấu <code>?</code> ở mục 8–10): mỗi request của bản khởi đầu kéo 200.000 entity vào một container 1 GB.</p>
${OUT165G}
<p>Lời giải chính thức: 3 câu mỗi request (61 câu cho 20 request — câu dư là lần tra phòng HW-04 đầu tiên, trước khi nó vào cache Redis của Chương 13), p95 52 ms ở 30 request/giây, không lỗi, readiness luôn 200 — với <strong>pool mặc định 10</strong>. Không chỉnh thông số nào; việc thừa đã bị bỏ đi.</p>
${OUT165B}
<p>Bản bẫy là lời giải chính thức thêm đúng một annotation — "cache luôn cho nhanh hơn nữa":</p>
<pre><code>@Cacheable(cacheNames = "cho-duyet", key = "#labCode + ':' + #page + ':' + #size")</code></pre>
<p>p50 giảm từ 24 xuống 9 ms, còn mục 9 và 10 trượt. Trang 0 nằm trong Redis 10 phút, nên <code>totalItems</code> đứng yên 8.333 sau một lượt đặt mới. Trang 143 chưa được cache, nên lượt mới vẫn hiện ở đó; rồi bộ chấm duyệt nó — và lúc này trang 143 <em>đã</em> nằm trong cache, nên lượt đã duyệt vẫn ở lại trong danh sách của quản lý. Quản lý bấm duyệt nó thêm lần nữa, hoặc tệ hơn, tưởng một khung giờ vẫn đang chờ. Đây là bài 13.3 gói trong một dòng: cache không có kế hoạch xoá là một lỗi có độ trễ đẹp. Ở đây cache còn thừa — 52 ms đã thấp hơn mục tiêu bốn lần.</p>

<h3>Gợi ý (trước khi mở lời giải)</h3>
<ul>
  <li>Đo trước: <code>pg_stat_statements</code> sắp theo <code>calls</code> và theo <code>total_exec_time</code>, rồi <code>EXPLAIN (ANALYZE, BUFFERS)</code> câu bạn viết (16.3).</li>
  <li>Lọc, sắp xếp và phân trang là việc của CSDL. Đếm cũng vậy.</li>
  <li>"Một câu cho mỗi dòng" thành "một câu cho mỗi trang": gom id của trang, hỏi một lần bằng <code>in (…)</code>. Module <code>identity</code> được thêm phương thức vào API công khai; không đọc bảng <code>accounts</code> từ module <code>booking</code> (luật module của Chương 18).</li>
  <li>Số phút trong tuần cho 20 dòng: một câu cho mọi người đặt trong trang, trên khoảng các tuần mà trang trải qua, cộng dồn trong Java.</li>
  <li>Chỉ mục phải khớp <code>where</code> + <code>order by</code> của câu truy vấn; chỉ mục một phần (<code>where status = 'PENDING'</code>) giữ được nhỏ.</li>
  <li>Viết báo cáo trước/sau trong lúc làm (mẫu bên dưới), mỗi lần đổi một thứ.</li>
</ul>

<h3>Báo cáo trước/sau (nộp kèm mã)</h3>
<table>
<thead><tr><th></th><th>Trước (khởi đầu)</th><th>Sau (lời giải)</th></tr></thead>
<tbody>
<tr><td>Môi trường</td><td colspan="2">Ứng dụng 2 CPU / 1 GB, PostgreSQL 16 2 CPU, k6 trong container riêng; 2.000 sinh viên, 200.000 lượt đặt; máy có tải nền</td></tr>
<tr><td>Một request, sổ thống kê vừa đặt lại</td><td>42 câu, 8,4 giây</td><td>3 câu</td></tr>
<tr><td>30 request/giây × 20 giây</td><td>p95 10.001 ms (hết thời hạn), 100 % lỗi</td><td>p50 24 ms, p95 52 ms, 0 % lỗi</td></tr>
<tr><td>Readiness trong lúc tải</td><td>6/20 lần không phải 200</td><td>20/20 lần OK</td></tr>
<tr><td>Pool</td><td>10</td><td>10 (không đổi)</td></tr>
<tr><td>Đã đổi gì</td><td colspan="2">Phân trang + đếm trong SQL, chỉ mục một phần, tra tên theo lô, số phút theo lô, trần kích thước trang</td></tr>
</tbody>
</table>
<p>Một bản báo cáo như thế là thứ trưởng nhóm kỹ thuật muốn thấy trong pull request: môi trường, mô hình tải, phân vị và lỗi, và đã đổi gì. Câu "cảm giác nhanh hơn" không có chỗ trong đó.</p>

<h3>🕵️ Góc hacker — <code>size</code> không có trần là một vụ từ chối dịch vụ bạn tự giao kèm</h3>
<p>Thiếu mục 4, ai có một tài khoản MANAGER (hoặc một token bị đánh cắp) gửi <code>size=1000000</code> là server dựng một câu trả lời triệu dòng — bản khởi đầu làm đúng như vậy ngay cả với <code>size=20</code>. OWASP xếp lỗi này là <strong>API4:2023 Unrestricted Resource Consumption</strong> trong API Security Top 10: kích thước trang, kích thước tệp tải lên, số id trong một lô, độ sâu truy vấn. Thứ nào cũng cần một mức tối đa ở server, trả 400 khi vượt, và một thời hạn bên dưới. Cùng lập luận đó áp cho nút "xuất tất cả" mà sắp có người xin: hãy làm nó thành việc nền (Chương 14), đừng làm một trang khổng lồ.</p>

${giai('Xem lời giải chính thức (tự làm trước!)', `<p>Bốn thay đổi. Migration — một chỉ mục một phần khớp đúng <code>where lab_id = ? and status = 'PENDING' order by start_at, id</code>, và một chỉ mục phủ cho câu số phút trong tuần:</p>
${MA165_GIAI_DB}
<p>Một phương thức theo lô trong API công khai của <code>identity</code> (<code>DanhBa</code>), để <code>booking</code> vẫn không bao giờ đọc thẳng <code>accounts</code> — một câu <code>where id in (…)</code> cho cả trang:</p>
${MA165_GIAI_DB2}
<p>Service: (1) một câu trả về cả trang <em>lẫn</em> tổng nhờ <code>count(*) over ()</code>, chỉ đếm riêng khi trang đã vượt quá cuối danh sách; (2) tên của cả trang trong một lần gọi; (3) số phút của mọi người đặt trong trang, trên các tuần mà trang trải qua, trong một câu, cộng theo (người, thứ Hai) trong Java. Ba câu SQL dù <code>size</code> là bao nhiêu:</p>
${MA165_GIAI_SV}
<p>Controller thêm trần: <code>@RequestParam(defaultValue = "20") @Min(1) @Max(100) int size</code> và <code>@Min(0)</code> cho <code>page</code>. Kiểm tra cấp phương thức của Spring MVC biến vi phạm thành <code>HandlerMethodValidationException</code>, mà handler <code>XuLyLoi</code> của Chương 5 đã trả thành ProblemDetail 400.</p>
<p>Những thứ lời giải cố ý <em>không</em> làm: đổi pool (mục 8), thêm cache (mục 9–10), hay bật virtual thread — endpoint giờ chỉ ở trong CSDL vài mili giây, chẳng còn gì để chờ.</p>`)}

<h3>🎤 Chương 16 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"API chậm khi đông người, nhưng CSDL trông vẫn khoẻ. Bạn kiểm gì đầu tiên?"</strong> — Pool kết nối: <code>hikaricp_connections_pending</code> và thời gian lấy kết nối. Định luật Little đoán trước được: 10 kết nối × 200 ms = 50 request/giây, thêm người chỉ thêm chờ. Rồi tìm kết nối bị giữ mà không làm gì (<code>idle in transaction</code>, Open Session in View), và đặt <code>connection-timeout</code> ngắn, trả 503 + <code>Retry-After</code> thay vì 500.</li>
  <li><strong>"Pool nên bao nhiêu? Sao không để 100?"</strong> — Tính theo CSDL, không theo số người dùng: khoảng (số nhân × 2) + số đĩa. Đã đo trên 2 CPU: pool 100 cho thông lượng hơi <em>thấp hơn</em>, mỗi câu mất 2.032 ms bên trong PostgreSQL so với 38 ms khi pool 2. Và số instance × pool phải nằm dưới <code>max_connections</code>.</li>
  <li><strong>"Virtual thread giúp khi nào, không giúp khi nào?"</strong> — Khi luồng chủ yếu chờ I/O và số request đồng thời vượt ~200 luồng Tomcat: 659 → 2.658 request/giây với một dòng cấu hình. Nó không thêm kết nối (52 % 503 với pool 10), không thêm CPU (BCrypt không đổi, đuôi tệ hơn), và trên Java 21 chặn bên trong <code>synchronized</code> sẽ ghim luồng mang (6,6 request/giây; Java 24+ đã sửa).</li>
  <li><strong>"Bạn đo tải thế nào cho trung thực?"</strong> — Mô hình mở (mô hình đóng cho p99 62 ms với một lần đứng hình 3 giây, mô hình mở 2.973 ms), làm nóng, dữ liệu cỡ thật, p95/p99 và lỗi, ngưỡng làm đỏ CI, máy phát tải có CPU riêng, mỗi lần đổi một thứ. Rồi tìm điểm nghẽn bằng <code>pg_stat_statements</code> + <code>EXPLAIN</code> và JFR, không đoán.</li>
  <li><strong>"Spring Boot hay Node.js nhanh hơn?"</strong> — Tuỳ con đường: Node thắng khi chỉ chờ, Spring trần thắng truy vấn CSDL so với một tiến trình Node (hai tiến trình Node thì hoà), việc CPU tuỳ ai chạy mã native. Điểm yếu của Node là chặn event loop (request 50 ms thành 8,3 giây); còn LabFlow đầy đủ chậm hơn Spring trần 4–5 lần ở endpoint đơn giản — đo cả ngăn xếp, đừng chỉ đo ngôn ngữ.</li>
</ol>

<h3>Học sâu hơn ở khoá khác</h3>
<table>
<thead><tr><th>Khoá</th><th>Dùng cho phần nào của chương này</th></tr></thead>
<tbody>
<tr><td><a href="/courses/postgresql">PostgreSQL</a></td><td>Chỉ mục, chỉ mục một phần và chỉ mục phủ, <code>EXPLAIN</code>, <code>pg_stat_statements</code>, <code>max_connections</code> — phía CSDL của 16.1, 16.3 và bài lab này</td></tr>
<tr><td><a href="/courses/performance-load-testing">Hiệu năng &amp; đo tải</a></td><td>k6 chuyên sâu: kịch bản, ngưỡng trong CI, đo tải dài và đo tải đột biến</td></tr>
<tr><td><a href="/courses/observability-monitoring">Quan sát &amp; giám sát</a></td><td>Bảng điều khiển và cảnh báo cho số đo Hikari và độ trễ của 16.1</td></tr>
<tr><td><a href="/courses/redis">Redis</a></td><td>Cache có kế hoạch xoá — thứ bản bẫy thiếu</td></tr>
<tr><td><a href="/courses/nodejs/learn">Node.js</a></td><td>Event loop và worker thread đứng sau phép so sánh của 16.4</td></tr>
</tbody>
</table>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mười mục kiểm biến câu "làm cho nhanh hơn" thành thứ đo được: cùng dữ liệu, request có giới hạn, ít câu SQL, p95 dưới tải mở, không ai vạ lây, không phình pool, không cache cũ.</li>
  <li>Khởi đầu 3/10 (8,4 giây và 42 câu cho một trang), lời giải chính thức 10/10 (3 câu, p95 52 ms, pool giữ nguyên), bẫy cache 8/10 (nhanh hơn và sai).</li>
  <li>Chương 16 trong một dòng: đo dưới tải giống thật, tìm điểm nghẽn bằng công cụ, bỏ việc thừa trước khi thêm tài nguyên — và chứng minh bằng số đo trước/sau.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ16 = [
  Q('Default pool of 10, an endpoint that holds a connection for 200 ms, 100 users. What did k6 show?|||Pool mặc định 10, một endpoint giữ kết nối 200 ms, 100 người dùng. k6 cho thấy gì?', [
    'About 500 req/s: more users, more throughput|||Khoảng 500 request/giây: nhiều người hơn thì thông lượng cao hơn',
    'About 50 req/s whatever the number of users, p50 around 2 s — only latency grew|||Khoảng 50 request/giây dù bao nhiêu người, p50 khoảng 2 giây — chỉ độ trễ tăng',
    'Errors right away: Hikari refuses the 11th user|||Lỗi ngay: Hikari từ chối người thứ 11',
    'About 50 req/s with 10 users, then the server crashed|||Khoảng 50 request/giây với 10 người, rồi server sập',
  ], 1),
  Q('connection-timeout=2000 under overload. What did LabFlow answer at first, and after the fix?|||connection-timeout=2000 khi quá tải. Ban đầu LabFlow trả gì, sau khi sửa trả gì?', [
    '500 INTERNAL with 15,303 log lines; then 503 DB_BUSY + Retry-After with 121 WARN lines|||500 INTERNAL kèm 15.303 dòng log; rồi 503 DB_BUSY + Retry-After với 121 dòng WARN',
    '200 after waiting 30 s; then 200 after 2 s|||200 sau 30 giây chờ; rồi 200 sau 2 giây',
    '429 both times|||Cả hai lần đều 429',
    '504 from Tomcat; then 500|||504 từ Tomcat; rồi 500',
  ], 0),
  Q('PostgreSQL has 2 CPUs. The pool goes from 2 to 100 under 100 users. What happened?|||PostgreSQL có 2 CPU. Pool tăng từ 2 lên 100 với 100 người dùng. Chuyện gì xảy ra?', [
    'Throughput grew about 50×|||Thông lượng tăng khoảng 50 lần',
    'Nothing changed at all|||Không có gì thay đổi',
    'Throughput slightly dropped and each query took 2,032 ms inside PostgreSQL instead of 38 ms|||Thông lượng hơi giảm và mỗi câu mất 2.032 ms bên trong PostgreSQL thay vì 38 ms',
    'PostgreSQL refused connections above 10|||PostgreSQL từ chối kết nối trên 10',
  ], 2),
  Q('A 300 ms external call is moved out of a @Transactional method. What changed, and what did pg_stat_activity show before?|||Một lời gọi bên ngoài 300 ms được đưa ra khỏi phương thức @Transactional. Điều gì thay đổi, và trước đó pg_stat_activity cho thấy gì?', [
    'Nothing: the call does not use the database|||Không gì: lời gọi đó không dùng CSDL',
    '32 → 153 req/s; before, 10 connections were "idle in transaction"|||32 → 153 request/giây; trước đó 10 kết nối ở trạng thái "idle in transaction"',
    '153 → 32 req/s; transactions must be long|||153 → 32 request/giây; giao dịch phải dài',
    'It deadlocked before|||Trước đó bị deadlock',
  ], 1),
  Q('An endpoint waits 300 ms on I/O. What did spring.threads.virtual.enabled=true change?|||Một endpoint chờ I/O 300 ms. spring.threads.virtual.enabled=true thay đổi gì?', [
    'Nothing: Tomcat still has 200 threads|||Không gì: Tomcat vẫn có 200 luồng',
    'It halved the latency of every request|||Nó giảm nửa độ trễ của mọi request',
    'It needed WebFlux code|||Nó cần viết mã WebFlux',
    'From a ceiling of ~659 req/s to 2,658 req/s on the same 2 CPUs, same code|||Từ trần ~659 request/giây lên 2.658 request/giây trên cùng 2 CPU, cùng mã',
  ], 3),
  Q('Virtual threads on Java 21, a 300 ms wait inside synchronized (no contention). Result?|||Virtual thread trên Java 21, chờ 300 ms bên trong synchronized (không tranh chấp). Kết quả?', [
    '6.6 req/s: the virtual thread is pinned to one of 2 carriers; Java 25 gave 321 req/s|||6,6 request/giây: virtual thread bị ghim vào một trong 2 luồng mang; Java 25 cho 321 request/giây',
    'The same as without synchronized|||Như khi không có synchronized',
    'A deadlock|||Một deadlock',
    'Faster: synchronized is optimised for virtual threads in Java 21|||Nhanh hơn: synchronized được tối ưu cho virtual thread từ Java 21',
  ], 0),
  Q('The server freezes for 3 seconds during a test. Closed model (10 VUs) vs open model (200 req/s): p99?|||Server đứng hình 3 giây trong lúc đo. Mô hình đóng (10 VU) so với mô hình mở (200 request/giây): p99?', [
    'Both about 3 s|||Cả hai khoảng 3 giây',
    'Closed 62 ms, open 2,973 ms — the closed tool stopped sending during the freeze|||Đóng 62 ms, mở 2.973 ms — công cụ đóng ngừng gửi trong lúc đứng hình',
    'Closed 2,973 ms, open 62 ms|||Đóng 2.973 ms, mở 62 ms',
    'Neither saw anything|||Không cái nào thấy gì',
  ], 1),
  Q('JFR on the monthly report (25,000 rows, ~170 ms). What was the biggest cost?|||JFR trên báo cáo tháng (25.000 dòng, ~170 ms). Chi phí lớn nhất là gì?', [
    'Compiling the regex for every row|||Biên dịch regex cho mỗi dòng',
    'Garbage collection|||Thu gom rác',
    'The datasource-micrometer proxy observing every row; jdbc.includes=CONNECTION,QUERY gave p50 69 ms|||Proxy datasource-micrometer quan sát từng dòng; jdbc.includes=CONNECTION,QUERY cho p50 69 ms',
    'The network to PostgreSQL|||Mạng tới PostgreSQL',
  ], 2),
  Q('Node.js: 20 users run pbkdf2Sync while a 21st asks for a 50 ms endpoint. Its p50?|||Node.js: 20 người chạy pbkdf2Sync trong khi người thứ 21 gọi một endpoint 50 ms. p50 của người đó?', [
    '50 ms: Node is asynchronous|||50 ms: Node bất đồng bộ',
    '487 ms, like Spring|||487 ms, như Spring',
    'The request is rejected|||Request bị từ chối',
    '8,315 ms — the only event loop was blocked; with async pbkdf2 it was 50 ms|||8.315 ms — event loop duy nhất bị chặn; với pbkdf2 bất đồng bộ thì 50 ms',
  ], 3),
  Q('Lab 16: the trap version adds @Cacheable on the whole "Pending" page. What did the grader catch?|||Lab 16: bản bẫy thêm @Cacheable cho cả trang "Chờ duyệt". Bộ chấm bắt được gì?', [
    'Nothing: it scored 10/10 and was faster|||Không gì: được 10/10 và nhanh hơn',
    'p95 above 200 ms|||p95 trên 200 ms',
    'A new booking did not change totalItems, and an approved booking stayed on the list — 8/10|||Lượt mới đặt không làm đổi totalItems, lượt đã duyệt vẫn nằm trong danh sách — 8/10',
    'Redis ran out of memory|||Redis hết bộ nhớ',
  ], 2),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `16.${n} — ${en}|||16.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 16 — Performance and load testing|||Chương 16 — Hiệu năng và đo tải',
  description: 'Đo trước khi tối ưu, đo thật bằng k6 trên LabFlow với PostgreSQL 200.000 lượt đặt, mỗi bên 2 CPU (máy có tải nền — so tương đối): pool HikariCP cạn (định luật Little, timeout 2 giây ⇒ 503, pool 100 chậm hơn, giữ kết nối khi chờ, rò kết nối, Slowloris); virtual thread 659 → 2.658 request/giây và ba chỗ không giúp; mô hình mở, coordinated omission, pg_stat_statements + EXPLAIN, JFR, regex Cloudflare 2019; so với Node.js; lab có bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-16-1-hikari-pool', 'Connection pool sizing with HikariCP', 'Kích thước pool kết nối với HikariCP',
      'Pool 10 kết nối là trần: 10 đến 100 người vẫn ~50 request/giây, chỉ độ trễ tăng (định luật Little); timeout 30 giây mặc định so với 2 giây, 500 kèm 15.303 dòng log thành 503 DB_BUSY + Retry-After; pool 2 → 100 trên PostgreSQL 2 CPU chậm hơn (38 → 2.032 ms mỗi câu); gọi ngoài 300 ms trong giao dịch 32 so với 153 request/giây; rò kết nối và leak detection; Slowloris 2009.',
      L161_EN + L161_VI),
    L(2, 'sb-16-2-virtual-threads-tomcat', 'Virtual threads in a Spring Boot server', 'Virtual thread trong server Spring Boot',
      'Tomcat 200 luồng nền tảng chặn ở ~659 request/giây khi chờ 300 ms; một dòng spring.threads.virtual.enabled ⇒ 2.658 request/giây trên cùng 2 CPU; không thêm kết nối CSDL (52 % 503 với pool 10), không thêm CPU (BCrypt, đuôi tệ hơn), synchronized trên Java 21 ghim luồng (6,6 request/giây, Java 25 là 321); thói quen ThreadLocal cần đổi; HTTP/2 Rapid Reset (CVE-2023-44487).',
      L162_EN + L162_VI),
    L(3, 'sb-16-3-do-tai', 'Load testing and profiling', 'Đo tải và profiling',
      'Kịch bản k6 giống người dùng (dữ liệu thật, mô hình mở, làm nóng, ngưỡng làm đỏ CI); coordinated omission (p99 62 ms so với 2.973 ms cho cùng một lần đứng hình) và JVM lạnh; pg_stat_statements + EXPLAIN tìm quét tuần tự (10,9 → 1,8 ms, 0,068 ms nhờ quy tắc nghiệp vụ); JFR tìm ra proxy tracing ngốn nửa báo cáo (170 → 69 ms); flame graph; regex làm sập Cloudflare 2019.',
      L163_EN + L163_VI),
    L(4, 'sb-16-4-spring-vs-node', 'Spring Boot vs Node.js under load', 'Spring Boot vs Node.js dưới tải',
      'Cùng bốn endpoint, mỗi server 2 CPU / 1 GB, cùng k6: Node thắng khi chỉ chờ, Spring trần gấp đôi một tiến trình Node ở truy vấn CSDL (hai tiến trình thì hoà), việc CPU tuỳ mã native; chặn event loop biến request 50 ms thành 8,3 giây; LabFlow đầy đủ chậm hơn Spring trần 4–5 lần; khởi động, bộ nhớ, GraalVM native và AOT cache.',
      L164_EN + L164_VI),
    L(5, 'sb-16-5-lab-16', 'Chapter 16 lab + interview questions', 'Lab chương 16 + câu hỏi phỏng vấn',
      'Tối ưu màn "Chờ duyệt" của quản lý phòng có số đo trước/sau, bộ chấm 10 mục trên 200.000 lượt đặt với PostgreSQL, Redis và k6 thật: đúng dữ liệu, trần size, ≤ 5 câu SQL mỗi request, p95 < 200 ms dưới tải mở, readiness không vạ lây, không phình pool, không cache cũ. Khởi đầu 3/10 (42 câu, 8,4 giây một trang), lời giải 10/10 (ẩn), bẫy @Cacheable 8/10. Năm câu phỏng vấn của chương.',
      L165_EN + L165_VI),
    {
      title: '16.6 — Chapter 16 quiz|||16.6 — Kiểm tra chương 16',
      slug: 'sb-16-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã đo thật trong chương: pool là trần, timeout và 503, pool lớn hơn chậm hơn, giữ kết nối khi chờ, virtual thread khi chờ I/O, ghim luồng trên Java 21, coordinated omission, JFR tìm proxy tracing, chặn event loop Node, cache làm sai màn Chờ duyệt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that was measured in this chapter — a pool that capped throughput, a bigger pool that made things slower, one property that quadrupled throughput, a synchronized block that nearly stopped it, a test tool that hid a freeze, and a cache that made a page fast and wrong.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã đo thật trong chương — một pool làm trần thông lượng, một pool lớn hơn lại chậm hơn, một dòng cấu hình nhân bốn thông lượng, một khối synchronized suýt làm nó dừng hẳn, một công cụ đo giấu mất lần đứng hình, và một cái cache làm trang vừa nhanh vừa sai.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ16 },
    },
  ],
};
