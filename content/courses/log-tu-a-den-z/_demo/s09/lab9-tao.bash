# Lab 9 — dựng bộ dữ liệu "người khác gửi": một HAR + trích log máy chủ cùng lượt (request id khớp nhau).
mkdir -p lab9; : > logs/api.log; : > logs/app.log
node har.mjs login,me,orders,report lab9/lab9.har; cp logs/api.log logs/app.log lab9/; wc -l lab9/*
