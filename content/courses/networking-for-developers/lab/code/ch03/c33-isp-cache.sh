# Ch3 · 3.3 — bên trong resolver nhà mạng: cache đang giữ gì cho labflow.test, và đếm trúng/trượt cache
unbound-control dump_cache | grep -E '^api\.labflow\.test\.[[:space:]]+[0-9]+[[:space:]]+IN[[:space:]]+A'
unbound-control stats_noreset | grep -E '^total\.num\.(queries|cachehits|cachemiss)='
