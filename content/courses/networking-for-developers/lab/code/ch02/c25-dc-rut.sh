# Ch2 · 2.5 — kiểu Facebook 04/10/2021: DC rút (withdraw) quảng bá dải của chính mình
vtysh -c 'configure terminal' -c 'router bgp 64510' -c 'address-family ipv4 unicast' -c 'no network 203.0.113.0/24' -c 'end'
@ sleep 2
vtysh -c 'show ip bgp neighbors 192.0.2.1 advertised-routes'
