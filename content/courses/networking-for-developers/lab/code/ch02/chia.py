#!/usr/bin/env python3
"""chia.py [--as-given] KHỐI tên=số_máy … — chia một khối địa chỉ thành các subnet cỡ khác nhau (VLSM) đúng cách làm bằng tay
của bài 2.1: xếp nhu cầu từ LỚN tới NHỎ, mỗi nhu cầu lấy prefix nhỏ nhất đủ chỗ (số máy + 2), cấp khối kế tiếp còn trống —
rồi tự kiểm bằng ipaddress (mỗi subnet nằm trong khối, không chồng nhau). --as-given: cấp theo đúng thứ tự gõ (để thấy lỗ hổng).
   python3 chia.py 10.20.0.0/22 iot=300 web=100 db=20 mgmt=10"""
import sys, math, ipaddress

args = sys.argv[1:]
as_given = args[0] == '--as-given'
if as_given: args = args[1:]
block = ipaddress.ip_network(args[0])
needs = [(k, int(v)) for k, v in (a.split('=') for a in args[1:])]
if not as_given: needs.sort(key=lambda x: -x[1])
nxt = int(block.network_address)
end = int(block.broadcast_address) + 1
rows, gaps = [], []
print(f'block {block} = {block.num_addresses} addresses; ' + ('needs in the order given' if as_given else 'needs sorted largest first'))
for name, hosts in needs:
    p = 32 - math.ceil(math.log2(hosts + 2))     # +2: địa chỉ mạng và broadcast không cấp cho máy nào
    size = 2 ** (32 - p)
    start = (nxt + size - 1) // size * size      # khối phải bắt đầu ở bội số của chính cỡ nó
    if start + size > end:
        print(f'✗ {name} needs /{p} ({size} addresses) — no aligned /{p} left in {block}: the plan does not fit')
        sys.exit(1)
    if start > nxt: gaps.append((ipaddress.ip_address(nxt), ipaddress.ip_address(start - 1), start - nxt))
    rows.append((name, hosts, ipaddress.ip_network(f'{ipaddress.ip_address(start)}/{p}')))
    nxt = start + size

nw = max([6] + [len(n) + 1 for n, _, _ in rows])                     # cột tên/địa chỉ nới ra khi tên hay địa chỉ dài
aw = max([13] + [len(str(n.broadcast_address)) + 1 for _, _, n in rows])
sw = max([17] + [len(str(n)) + 1 for _, _, n in rows])
print(f'{"name":<{nw}}{"hosts":>6}  {"subnet":<{sw}}{"first host":<{aw}}{"last host":<{aw}}{"broadcast":<{aw}}{"usable":>6}')
for name, hosts, net in rows:
    print(f'{name:<{nw}}{hosts:>6}  {str(net):<{sw}}{str(net[1]):<{aw}}{str(net[-2]):<{aw}}{str(net.broadcast_address):<{aw}}{net.num_addresses - 2:>6}')
for a, b, n in gaps:
    print(f'gap    {a} - {b}  ({n} addresses skipped to keep the next subnet aligned)')
inside = all(n.subnet_of(block) for _, _, n in rows)
overlap = any(a.overlaps(b) for i, (_, _, a) in enumerate(rows) for (_, _, b) in rows[i + 1:])
used = sum(n.num_addresses for _, _, n in rows)
print(f'check: all inside {block}: {inside} · any overlap: {overlap} · used {used} of {block.num_addresses}' +
      (f', next free {ipaddress.ip_address(nxt)}' if nxt < end else ', block full'))
