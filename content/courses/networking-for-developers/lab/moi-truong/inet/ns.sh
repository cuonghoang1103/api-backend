#!/bin/bash
# ns — máy chủ tên (authoritative) của labflow.test trong DC: labflow.test ⇒ 203.0.113.10 + 2001:db8:d::10.
ip route replace default via 203.0.113.1
ip -6 route replace default via 2001:db8:d::1
exec dnsmasq --keep-in-foreground --no-resolv --no-hosts --listen-address=203.0.113.53 --bind-interfaces \
  --host-record=labflow.test,203.0.113.10,2001:db8:d::10 --host-record=www.labflow.test,203.0.113.10,2001:db8:d::10 --local=/labflow.test/
