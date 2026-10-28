# docker-profile.py — đọc hồ sơ seccomp MẶC ĐỊNH của Docker (default.json trong kho moby) và tóm tắt nó.
import json, sys

p = json.load(open(sys.argv[1]))
print("defaultAction:", p["defaultAction"], " defaultErrnoRet:", p.get("defaultErrnoRet"))
allow = [r for r in p["syscalls"] if r["action"] == "SCMP_ACT_ALLOW"]
plain = {n for r in allow if not r.get("includes") and not r.get("excludes") and not r.get("args") for n in r["names"]}
cond = {n for r in allow for n in r["names"]} - plain
print("allowed for every container:", len(plain), "| allowed only with a capability/arch/argument condition:", len(cond))
for r in p["syscalls"]:
    if "clone3" in r["names"] and r["action"] != "SCMP_ACT_ALLOW":
        print("clone3:", r["action"], "errnoRet", r.get("errnoRet"), "(38 = ENOSYS) unless caps", r.get("excludes", {}).get("caps"))
