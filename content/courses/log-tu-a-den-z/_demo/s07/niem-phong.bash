# 7.4 — Kiểm toàn vẹn: --verify thường, --verify với khoá niêm phong (FSS), và một byte bị sửa
sudo ls -l /var/log/journal/$(cat /etc/machine-id)/fss
sudo journalctl --rotate
sudo journalctl --verify --verify-key=$(cat ~/fss-key.txt) 2>&1 | grep -E 'system@|system.journal' | tail -n 2
F=$(sudo ls -t /var/log/journal/$(cat /etc/machine-id)/ | grep '^system@' | head -n 1); sudo cp /var/log/journal/$(cat /etc/machine-id)/$F /tmp/sua.journal; sudo chmod 644 /tmp/sua.journal; echo $F
grep -c -a 'order 1[0-9]* failed' /tmp/sua.journal
sudo python3 -c "p = '/tmp/sua.journal'; b = open(p, 'rb').read(); i = b.find(b' failed: database'); print('offset', i); open(p, 'r+b').write(b[:i] + b' passed: database' + b[i + 17:])"
journalctl --file /tmp/sua.journal -g 'passed: database' -n 1 --no-pager
journalctl --verify --file /tmp/sua.journal 2>&1 | tail -n 3
journalctl --verify --verify-key=$(cat ~/fss-key.txt) --file /tmp/sua.journal 2>&1 | tail -n 3
