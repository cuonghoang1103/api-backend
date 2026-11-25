#!/bin/bash
# mot-ngay.sh — giả lập một ngày dùng ứng dụng: mọi chức năng người dùng thấy trên menu (bài 6.1)
B=${B:-http://localhost:18080/thuvien}; cj=$(mktemp)
c() { curl -s -o /dev/null -w "%{http_code} $1\n" -b "$cj" -c "$cj" "${@:2}" "$B/$1"; }
c login
c login -d "username=thuthu&password=sai"
c login -d "username=thuthu&password=123456&remember=on"
c books
c "books?q=java"
c books -d "action=borrow&bookId=1&readerId=2"
c books -d "action=return&loanId=1"
c books -d "action=add&code=X01&title=Sach+moi&author=Lan&quantity=2"
c readers
c readers -d "action=add&name=Minh&type=SV&phone=0900"
c "report?days=1"
c "login?action=logout"
rm -f "$cj"
