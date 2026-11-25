#!/usr/bin/env python3
"""evtx-json <tệp.evtx>… — mỗi sự kiện một dòng JSON phẳng: t (UTC), id, kenh, may, rec + mọi trường EventData/UserData.
Giống những gì Get-WinEvent | ForEach { $_.ToXml() } cho bạn trên Windows, nhưng chạy được trên Linux/macOS."""
import sys, json
from evtx import PyEvtxParser

def phang(d, o):
    for k, v in d.items():
        if k == "#attributes":
            continue
        if isinstance(v, dict):
            phang(v, o)
        else:
            o[k] = v

for p in sys.argv[1:]:
    for r in PyEvtxParser(p).records_json():
        ev = json.loads(r["data"])["Event"]
        s = ev["System"]
        eid = s["EventID"]
        o = {"t": s["TimeCreated"]["#attributes"]["SystemTime"],
             "id": eid["#text"] if isinstance(eid, dict) else eid,
             "kenh": s["Channel"], "may": s["Computer"], "rec": s["EventRecordID"]}
        for khoi in ("EventData", "UserData"):
            if isinstance(ev.get(khoi), dict):
                phang(ev[khoi], o)
        print(json.dumps(o, ensure_ascii=False))
