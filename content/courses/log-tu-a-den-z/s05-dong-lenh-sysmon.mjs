/**
 * Chương 5 — Windows (3): dòng lệnh, audit policy và Sysmon (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s05/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s05/ trên BỘ EVTX MẪU CÔNG KHAI: 17 tệp Ch3 (/lab/mau), 40 tệp Ch4 (/lab/tc) + 13 tệp Sysmon Ch5 (/lab/sm,
 * Yamato-Security/hayabusa-sample-evtx: EVTX-ATTACK-SAMPLES, EVTX-to-MITRE-Attack; tải + kiểm SHA256 bằng _demo/s05/mau/tai-mau-ch5.ps1.txt — chạy thật 13 OK).
 * Không có máy Windows: Get-WinEvent được thay bằng Get-WinEventMau (_demo/s05/bin/WinEventMau, ~130 dòng PowerShell + evtx-obj) — cùng tên thuộc tính với EventLogRecord,
 * FilterHashtable dịch sang XPath như Get-WinEvent, XPath chấm bằng .NET trên XML thật, từ chối contains()/starts-with() như Event Log. Lệnh chỉ chạy trên Windows (wevtutil, auditpol, Sysmon64, wecutil,
 * Invoke-Command) là khối mã cho máy người học — không kèm output giả. Chạy lại: bash _demo/s05/cong-cu/ct.bash; python3 _demo/s03/cong-cu/chay-mau.py _demo/s05/<tệp>.bash; rồi sinh-ma.
 * Sysmon ID 22 không có trong mẫu công khai (đếm thật = 0) — giảng theo Microsoft Learn, người học tự tạo ở Lab 5/5.6.
 */
import L51 from './s05/log-5-1-get-winevent.mjs';
import L52 from './s05/log-5-2-filterhashtable.mjs';
import L53 from './s05/log-5-3-xpath-xml.mjs';
import L54 from './s05/log-5-4-wevtutil-cmd.mjs';
import L55 from './s05/log-5-5-audit-policy.mjs';
import L56 from './s05/log-5-6-sysmon.mjs';
import L57 from './s05/log-5-7-tu-xa-wef.mjs';
import L58 from './s05/log-5-8-lab.mjs';
import L59 from './s05/log-5-9-quiz.mjs';

export default { lessons: [L51, L52, L53, L54, L55, L56, L57, L58, L59] };
