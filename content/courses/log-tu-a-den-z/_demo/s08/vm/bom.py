# bom.py udp|tcp N — bắn N dòng syslog thẳng tới máy chủ log 10.0.2.2:514, đánh số 1..N để đếm dòng mất
import socket, sys, time
proto, n = sys.argv[1], int(sys.argv[2]); dich = ("10.0.2.2", 514)
ts = time.strftime("%Y-%m-%dT%H:%M:%S+07:00"); t = time.time()
if proto == "udp":
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    for i in range(1, n + 1): s.sendto(f"<166>1 {ts} lab7 bom-udp - - - so {i}".encode(), dich)
else:
    s = socket.create_connection(dich)
    for i in range(1, n + 1): s.sendall(f"<166>1 {ts} lab7 bom-tcp - - - so {i}\n".encode())
    s.close()
print(f"{proto}: gửi {n} dòng trong {time.time() - t:.2f} s")
