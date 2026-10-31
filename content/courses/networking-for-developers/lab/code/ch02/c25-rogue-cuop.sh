# Ch2 · 2.5 — rogue (AS64511) quảng bá một dải CỤ THỂ HƠN của LabFlow, rồi vứt mọi gói tới đó (như Pakistan Telecom 2008)
ip route add blackhole 203.0.113.0/25
vtysh -c 'configure terminal' -c 'router bgp 64511' -c 'address-family ipv4 unicast' -c 'network 203.0.113.0/25' -c 'end'
vtysh -c 'show ip bgp'
