# Ch5 · 5.1 — UDP không bắt tay nên không có kết nối để theo dõi: socket máy chủ ở UNCONN; không hề có TIME-WAIT (bài 4.4)
echo "[UDP] máy chủ echo bind cổng 9999 — một socket UNCONN, sinh ra ngay khi bind, không qua cú bắt tay nào:"
ss -ulnp '( sport = :9999 )'
echo "[TCP] nginx cổng 80 — LISTEN; mỗi kết nối tới đi qua ESTAB rồi TIME-WAIT khi đóng (bài 4.4):"
ss -tlnp '( sport = :80 )'
echo "[UDP] số bản ghi TIME-WAIT của UDP trên máy: $(ss -uan 2>/dev/null | grep -c TIME-WAIT)  (UDP không có trạng thái này)"
