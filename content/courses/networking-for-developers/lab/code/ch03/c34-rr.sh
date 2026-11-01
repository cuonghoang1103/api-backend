# Ch3 · 3.4 — laptop: thứ tự hai địa chỉ đổi lượt mỗi câu trả lời; mỗi kiểu client chịu máy chết .12 một kiểu — đo thời gian
for i in 1 2 3 4; do dig +short app.labflow.test | tr '\n' ' '; echo; done
for i in 1 2 3 4; do curl -s -o /dev/null -w '%{remote_ip}  connect %{time_connect}s\n' http://app.labflow.test/; done
curl -sv -o /dev/null http://app.labflow.test/ 2>&1 | grep -E 'IPv4:|Trying|Established'
for i in 1 2 3 4; do python3 -c "import socket,time; t=time.time(); s=socket.create_connection(('app.labflow.test',80)); print('python', s.getpeername()[0], 'connected after', round(time.time()-t,3), 's')"; done
python3 -c "import socket; socket.create_connection(('203.0.113.12',80))" 2>&1 | tail -1
