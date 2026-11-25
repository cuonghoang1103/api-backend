# 6.2 — Console › Log Reports: /var/log còn lại gì, tệp nén, install.log, thư mục báo cáo.
ls /var/log | tr '\n' ' ' | fold -w 150; echo
wc -l /var/log/system.log /var/log/install.log
awk '{print $5}' /var/log/system.log | sed -E 's/\[[0-9]+\]:?//' | sort | uniq -c | sort -nr | head -4
tail -n 3 /var/log/system.log
zcat /var/log/system.log.0.gz | head -2
gzcat /var/log/system.log.0.gz | head -2
grep -E 'Installed "' /var/log/install.log | tail -4 | cut -c1-150
ls /Library/Logs/DiagnosticReports | sed -E 's/.*\.//' | sort | uniq -c
