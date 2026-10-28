# ocifix.py config.json — chỉnh spec mặc định của `runc spec` cho bài 12.6 (thay vì sửa JSON bằng tay).
import json, sys
f = sys.argv[1]; c = json.load(open(f))
c["process"]["terminal"] = False
c["process"]["args"] = ["sh", "-c", sys.argv[2]]
c["hostname"] = "oci-box"
c["linux"]["resources"] = {"memory": {"limit": 64 << 20, "swap": 64 << 20}, "cpu": {"quota": 50000, "period": 100000}, "pids": {"limit": 32}}
json.dump(c, open(f, "w"), indent=2)
