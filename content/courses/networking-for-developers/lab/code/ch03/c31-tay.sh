# Ch3 · 3.1 — tự làm việc của resolver: hỏi lần lượt máy chủ gốc ⇒ TLD ⇒ máy chủ của tên miền (+norecurse = "đừng đi hỏi hộ tôi")
dig @192.0.2.10 www.labflow.test +norecurse
dig @192.0.2.20 www.labflow.test +norecurse
dig @203.0.113.53 www.labflow.test +norecurse
