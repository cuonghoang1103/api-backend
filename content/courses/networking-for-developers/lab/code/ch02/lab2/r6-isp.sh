# Lab 2 · R6 — chẩn đoán và sửa trên isp
vtysh -c 'show ip bgp' | grep -E 'Network|/'
vtysh -c 'show ip bgp 203.0.113.10'
vtysh -c 'configure terminal' -c 'ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24' -c 'router bgp 64500' -c 'address-family ipv4 unicast' -c 'neighbor 192.0.2.66 prefix-list FROM-ROGUE in' -c 'end'
vtysh -c 'clear bgp ipv4 unicast 192.0.2.66 soft in'
@ sleep 2
vtysh -c 'show ip bgp' | grep -E 'Network|/'
