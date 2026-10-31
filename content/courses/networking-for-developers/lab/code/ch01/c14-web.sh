# Ch1 · 1.5 cổng & socket — máy web (nginx) trong lúc client và client2 đang giữ 3 kết nối
ss -tlnp
ss -tanp '( sport = :80 )'
ss -Htan state established '( sport = :80 )' | wc -l
