/**
 * Chương 3 — Windows (1): Event Viewer từ số 0 (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s03/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s03/ trên BỘ EVTX MẪU CÔNG KHAI (17 tệp, log thật của máy Windows thật: omerbenamram/evtx samples +
 * Yamato-Security/hayabusa-sample-evtx — DeepBlueCLI, EVTX-to-MITRE-Attack; tải + kiểm SHA256 bằng _demo/s03/mau/tai-mau.ps1.txt).
 * Máy soạn là Linux và điều phối không cho dựng máy ảo Windows (24/11 17:40) ⇒ đọc .evtx bằng _demo/s03/bin/evtx-rec|evtx-xml|evtx-dau (pyevtx-rs) trong PowerShell 7,
 * container lgz-c03 (ảnh lgz-win-mau:1 = _demo/s03/anh). Chạy lại: bash _demo/s03/cong-cu/ct.bash; cho từng tệp .bash: python3 _demo/s03/cong-cu/chay-mau.py <tệp>; rồi sinh-ma.
 * Lệnh chỉ chạy trên Windows (eventvwr, Get-WinEvent -ListLog, wevtutil, schtasks, perfmon /rel, Get-WindowsUpdateLog…) là KHỐI MÃ cho máy người học, không kèm output giả.
 */
import L31 from './s03/log-3-1-tong-quan.mjs';
import L32 from './s03/log-3-2-doc-su-kien.mjs';
import L33 from './s03/log-3-3-nhanh-ung-dung.mjs';
import L34 from './s03/log-3-4-loc-luu.mjs';
import L35 from './s03/log-3-5-kich-thuoc-luu-tru.mjs';
import L36 from './s03/log-3-6-reliability-monitor.mjs';
import L37 from './s03/log-3-7-log-van-ban.mjs';
import L38 from './s03/log-3-8-lab.mjs';
import L39 from './s03/log-3-9-quiz.mjs';

export default { lessons: [L31, L32, L33, L34, L35, L36, L37, L38, L39] };
