# Bổ sung YouTube f1mpExct2Yg (SysTelligence — jq + journalctl, Master JSON Logs in 2026) — chạy thật 25/11/2026 trong container lgz-c07
journalctl -u ssh -n 1 -o json | jq -c 'keys'
journalctl -u ssh -o json | jq -r '[(.__REALTIME_TIMESTAMP | tonumber / 1000000 | todate), ._SYSTEMD_UNIT, .MESSAGE] | @csv' | tail -n 3
journalctl -b -o json | jq -r '[._COMM, .MESSAGE] | @csv' > /tmp/b.csv; echo "thoát $?"; wc -l < /tmp/b.csv
journalctl -b -o json | jq -r '[._COMM, (.MESSAGE | if type == "array" then implode else . end)] | @csv' | grep -c .
journalctl -b -o json | jq -r 'select(.MESSAGE | strings | test("listening|full"; "i")) | .MESSAGE'
