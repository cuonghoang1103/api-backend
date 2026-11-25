# 6.2 — ứng dụng văng mỗi khi mở một tệp: tái hiện, tìm báo cáo .ips, đọc cấu trúc, đối chiếu unified log.
printf 'ten=shop\ncong=8080\n' > tot.txt; printf 'ten=shop\ncong=80 80\n' > hong.txt; swiftc -g -o motep motep.swift && echo "dich xong"
./motep tot.txt
./motep hong.txt; echo "exit=$?"
sleep 8; ls -t ~/Library/Logs/DiagnosticReports | grep '^motep' | head -1
F=$(ls -t ~/Library/Logs/DiagnosticReports/motep-*.ips | head -1); head -1 "$F" | jq .
F=$(ls -t ~/Library/Logs/DiagnosticReports/motep-*.ips | head -1); sed 1d "$F" | jq '{procName, procPath, parentProc, responsibleProc, userID, procLaunch, captureTime, exception, termination, faultingThread}'
F=$(ls -t ~/Library/Logs/DiagnosticReports/motep-*.ips | head -1); sed 1d "$F" | jq -r '.threads[.faultingThread].frames[0:4][] | "\(.imageIndex)  \(.symbol)  \(.sourceFile // "")  \(.sourceLine // "")"'
F=$(ls -t ~/Library/Logs/DiagnosticReports/motep-*.ips | head -1); sed 1d "$F" | jq -r '.usedImages[0:3][] | .name'
log show --last 2m --style compact --predicate '(process == "motep" AND NOT eventMessage BEGINSWITH "Retrieve") OR (process == "kernel" AND eventMessage CONTAINS "motep") OR (process == "osanalyticshelper" AND eventMessage BEGINSWITH "Saved")' | cut -c1-190
ls ~/Library/Logs/DiagnosticReports | sed -E 's/.*\.//' | sort | uniq -c
