# Ch3 · 3.3 — laptop: máy chủ tên đã có tên mới, nhưng resolver vẫn trả NXDOMAIN cho tới khi hết TTL âm
dig +short new.labflow.test @203.0.113.53
dig new.labflow.test | grep -E 'status|SOA'
