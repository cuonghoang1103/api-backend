# Lab 3 · R4 — trên resolver: nó vẫn nhớ NS sai (TTL của ủy quyền 2 ngày) ⇒ xoá vùng + hiểu biết về máy chủ
unbound-control flush_zone labflow.test
unbound-control flush_infra all
