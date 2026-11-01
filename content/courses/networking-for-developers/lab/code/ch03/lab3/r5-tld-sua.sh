# Lab 3 · R5 — trên máy chủ TLD (= nhà đăng ký nhận DS mới): ký lại vùng test với DS hiện tại của labflow.test
cat /dnsz/ds/labflow.test.ds
sed -i 's/2026110103 1800 900/2026110104 1800 900/' /dnsz/src/test.zone
bash /lab/k/moi-truong/dns/ky.sh test && rndc reload test
