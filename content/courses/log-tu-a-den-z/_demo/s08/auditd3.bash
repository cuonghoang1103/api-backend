sudo ausearch --input-logs -f thu-khi-auditd-tat --format text
sudo journalctl -k -q --no-pager -o cat --since "-10min" | grep -E "kauditd_printk_skb" | head -3
