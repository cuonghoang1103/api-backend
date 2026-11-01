# Lab 3 · R4 — trên máy chủ TLD (= việc nhà đăng ký làm theo phiếu đúng): ủy quyền lại cho ns2, tăng serial, ký lại vùng test
sed -i -e 's/IN NS  ns3.labflow.test./IN NS  ns2.labflow.test./' -e 's/^ns3.labflow.test.     172800  IN A   203.0.113.55/ns2.labflow.test.     172800  IN A   203.0.113.54/' -e 's/2026110102 1800 900/2026110103 1800 900/' /dnsz/src/test.zone
grep -E 'labflow' /dnsz/src/test.zone
bash /lab/k/moi-truong/dns/ky.sh test && rndc reload test
