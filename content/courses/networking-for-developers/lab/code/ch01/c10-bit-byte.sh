# Ch1 · 1.1 bit, byte, hex — máy client
printf 'GET' | xxd
printf 'GET' | xxd -b
printf 'Xin chào' | xxd
python3 -c "print(len('Xin chào'), 'characters,', len('Xin chào'.encode()), 'bytes')"
python3 -c "print((80).to_bytes(2, 'big').hex(), (443).to_bytes(2, 'big').hex(), (50228).to_bytes(2, 'big').hex())"
python3 -c "import sys; print(sys.byteorder)"
python3 -c "import socket; print(socket.htons(80), hex(socket.htons(80)))"
python3 -c "print('10.10.2.10 =', bytes([10, 10, 2, 10]).hex(' '))"
ethtool eth0 | grep -E 'Speed|Duplex'
iperf3 -c 10.10.2.10 -t 2 -f m | grep -E 'sender|receiver'
iperf3 -c 10.10.2.10 -t 2 -f M | grep -E 'sender|receiver'
