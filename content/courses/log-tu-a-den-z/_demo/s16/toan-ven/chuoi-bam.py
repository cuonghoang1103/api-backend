#!/usr/bin/env python3
"""chuoi-bam.py — chuỗi băm cho tệp log (mỗi dòng mang băm của chính nó NỐI với băm dòng trước).
  ky  <vào> <ra>   : ghi <ra> = mỗi dòng + " |h=<16 hex>"; in băm ĐẦU CHUỖI cuối cùng (gửi nó RA KHỎI MÁY)
  kiem <tệp> [mốc]: kiểm từng dòng; báo dòng đầu tiên bị sửa/xoá/chèn; nếu có [mốc] thì so với băm cuối đã gửi đi
Sửa một dòng ⇒ băm của nó và MỌI dòng sau đổi. Kẻ có quyền ghi có thể tính lại cả chuỗi — vì thế băm cuối phải nằm ở nơi khác."""
import hashlib, sys

def bam(truoc, dong):
    return hashlib.sha256((truoc + dong).encode()).hexdigest()[:16]

def ky(vao, ra):
    h = "0" * 16
    with open(vao, encoding="utf-8") as f, open(ra, "w", encoding="utf-8") as g:
        for dong in f.read().splitlines():
            h = bam(h, dong); g.write(f"{dong} |h={h}\n")
    print("băm cuối:", h)

def kiem(tep, moc=None):
    h = "0" * 16
    for i, d in enumerate(open(tep, encoding="utf-8").read().splitlines(), 1):
        dong, _, hk = d.rpartition(" |h=")
        h = bam(h, dong)
        if h != hk:
            print(f"✗ dòng {i} không khớp chuỗi: {dong[:70]}"); return 1
    print(f"✓ {i} dòng khớp chuỗi, băm cuối {h}")
    if moc and moc != h:
        print(f"✗ băm cuối KHÁC mốc đã gửi đi ({moc}) ⇒ cả chuỗi đã bị tính lại"); return 1
    return 0

if __name__ == "__main__":
    sys.exit(ky(sys.argv[2], sys.argv[3]) if sys.argv[1] == "ky" else kiem(*sys.argv[2:4]))
