# 12.4 phần MySQL 8.4 — chạy: MAC=mysql python3 cong-cu/chay-ct.py mysql.bash (sau cong-cu/dung-mysql.bash). Mặc định chạy trong lgz-mysql (root, ~/.my.cnf).
@host docker logs lgz-mysql 2>&1 | grep -E 'ready for connections.*port: 3306' | cut -c1-200
mysql -t -e "SHOW GLOBAL VARIABLES WHERE Variable_name IN ('log_error','log_error_verbosity','slow_query_log','slow_query_log_file','long_query_time','general_log','general_log_file','log_output','log_queries_not_using_indexes','log_timestamps','system_time_zone')"
mysql -uapp -psai-roi -h127.0.0.1 shop -e 'SELECT 1'
@host docker logs lgz-mysql 2>&1 | grep -c 'Access denied'
mysql -e "SET PERSIST log_error_verbosity = 3"
mysql -uapp -psai-roi -h127.0.0.1 shop -e 'SELECT 1'; mysql -ughost -pabc -h127.0.0.1 -e 'SELECT 1'
@host docker logs lgz-mysql 2>&1 | grep 'Access denied' | cut -c1-200
mysql -e "SET GLOBAL slow_query_log = ON; SET GLOBAL long_query_time = 0.2; SET GLOBAL log_queries_not_using_indexes = ON"
mysql -uapp -pApp-Lab-2026 -h127.0.0.1 shop -e "SELECT id, total FROM orders WHERE customer_email = 'khach4242@example.com' LIMIT 3; SELECT SLEEP(0.25); SELECT id FROM orders WHERE id = 4242" 2>&1 | grep -v Warning
F=$(mysql -Nse 'SELECT @@slow_query_log_file'); tail -n 16 $F
command -v mysqldumpslow pt-query-digest || echo 'ảnh mysql:8.4 không kèm mysqldumpslow/pt-query-digest'
F=$(mysql -Nse 'SELECT @@slow_query_log_file'); grep -E '^# Query_time' $F | awk '{print "Query_time=" $3, "Rows_examined=" $9}'
mysql -e "SET GLOBAL general_log = ON"; mysql -uapp -pApp-Lab-2026 -h127.0.0.1 shop -e "SELECT count(*) FROM orders WHERE total > 4000000" 2>&1 | grep -v Warning; mysql -e "SET GLOBAL general_log = OFF"
F=$(mysql -Nse 'SELECT @@general_log_file'); tail -n 6 $F | cut -c1-160
