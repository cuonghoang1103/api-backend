# THÊM cho video lgz-7-1 (ý từ YouTube Eo6DC3m2U7o): MESSAGE_ID và danh sách trường — chạy thật 24/11/2026 trong lgz-c07.
journalctl --fields | wc -l
journalctl -u ssh -g 'Started' -n 1 -o verbose --output-fields=MESSAGE,MESSAGE_ID,UNIT,_PID,_COMM --no-pager
journalctl MESSAGE_ID=39f53479d3a045ac8e11786248231fbf -o short --no-pager | tail -n 3
