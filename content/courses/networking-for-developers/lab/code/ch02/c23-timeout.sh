# Ch2 · 2.3 — một ô trong bảng NAT sống được bao lâu khi không có gói nào đi qua (Linux trên router nhà của lab)
sysctl net.netfilter.nf_conntrack_tcp_timeout_established net.netfilter.nf_conntrack_tcp_timeout_time_wait
sysctl net.netfilter.nf_conntrack_udp_timeout net.netfilter.nf_conntrack_udp_timeout_stream
sysctl net.netfilter.nf_conntrack_max
