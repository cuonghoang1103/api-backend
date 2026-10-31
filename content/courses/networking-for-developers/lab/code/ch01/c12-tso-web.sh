# Ch1 · 1.3 — trên máy web (người GỬI phản hồi): xem rồi tắt segmentation offload
ethtool -k eth0 | grep -E '^(tcp-segmentation-offload|generic-segmentation-offload):'
ethtool -K eth0 tso off gso off
ethtool -k eth0 | grep -E '^(tcp-segmentation-offload|generic-segmentation-offload):'
