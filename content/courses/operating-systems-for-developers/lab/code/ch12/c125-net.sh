# @ Chương 12 · bài 12.5 — mạng container bằng tay: netns + veth + bridge + NAT. Container đặc quyền VỨT ĐI: mọi interface,
# @ route, iptables tạo ra nằm trong network namespace RIÊNG của container này — mạng máy chủ không bị đụng.
# @ docker run --rm --label oslab=1 --name os-c125 --hostname oslab --privileged --memory 1g -v "$PWD/ch12":/lab/ch12 -v <scratch>/c12:/opt/c12:ro -w /lab/ch12 os-lab bash -c "phien c125-net.sh 2>&1"
@ apt-get update -qq > /dev/null 2>&1 && apt-get install -y -qq iptables > /dev/null 2>&1
@ mkdir /sys/fs/cgroup/init; for p in $(cat /sys/fs/cgroup/cgroup.procs); do echo $p > /sys/fs/cgroup/init/cgroup.procs 2>/dev/null; done; echo "+memory +cpu +pids" > /sys/fs/cgroup/cgroup.subtree_control
ip -br addr | grep -v NONE; ip route
ip -d link show eth0 | grep -oE 'veth|link-netnsid [0-9]+'
ip netns add c1; ip netns add c2; ip netns list
ip link add br0 type bridge; ip addr add 10.12.0.1/24 dev br0; ip link set br0 up
for n in 1 2; do
  ip link add veth-c$n type veth peer name eth0 netns c$n
  ip link set veth-c$n master br0 up
  ip netns exec c$n ip addr add 10.12.0.$((n+1))/24 dev eth0
  ip netns exec c$n ip link set eth0 up; ip netns exec c$n ip link set lo up
  ip netns exec c$n ip route add default via 10.12.0.1
done
ip -br link show master br0
ip netns exec c1 ip -br addr | grep -v NONE; ip netns exec c1 ip route
ip netns exec c1 ping -c3 -i0.2 10.12.0.3 | tail -2
ip netns exec c2 python3 -m http.server 8000 --bind 10.12.0.3 > /dev/null 2>&1 & SRV=$!
@ for i in $(seq 40); do ip netns exec c1 curl -s -o /dev/null http://10.12.0.3:8000/ && break; sleep 0.25; done
ip netns exec c1 curl -s -o /dev/null -w "HTTP %{http_code} from c2 in %{time_total}s\n" http://10.12.0.3:8000/
bridge fdb show br br0 | grep -v permanent
ip netns exec c1 curl -sS -m 4 -o /dev/null http://example.com; echo "curl exit $?"
cat /proc/sys/net/ipv4/ip_forward
iptables -t nat -A POSTROUTING -s 10.12.0.0/24 ! -o br0 -j MASQUERADE
ip netns exec c1 curl -sS -m 6 -o /dev/null -w "HTTP %{http_code} from %{remote_ip}\n" http://example.com
iptables -t nat -L POSTROUTING -n -v | cut -c1-100
ME=$(hostname -i); echo "this lab box is $ME"
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.12.0.3:8000
iptables -t nat -A OUTPUT -p tcp -d $ME --dport 8080 -j DNAT --to-destination 10.12.0.3:8000
curl -s -o /dev/null -w "HTTP %{http_code} via $ME:8080\n" http://$ME:8080/
ping -c 500 -i 0.002 -q 127.0.0.1 | tail -1
ip netns exec c1 ping -c 500 -i 0.002 -q 10.12.0.3 | tail -1
./mini-container.sh box3 sleep 300 &
sleep 1; P=$(pgrep -f 'sleep 300' | tail -1); echo "box3 = PID $P"
ip link add veth-b3 type veth peer name eth0 netns $P; ip link set veth-b3 master br0 up
grep nameserver /etc/resolv.conf | nsenter -t $P -m sh -c 'cat > /etc/resolv.conf'
nsenter -t $P -n -m sh -c 'ip addr add 10.12.0.4/24 dev eth0; ip link set eth0 up; ip link set lo up; ip route add default via 10.12.0.1; ip -o -4 addr show eth0'
nsenter -t $P --all sh -c 'wget -q -O /dev/null http://10.12.0.3:8000/ && echo "box3 -> c2: ok"; wget -q -O - http://example.com | grep -o "<title>.*</title>"'
kill -KILL $P $SRV; wait; sleep 1; ip -br link show master br0
ip netns del c1; ip netns del c2; ip link del br0; sleep 1; ip -br link | grep -v NONE
