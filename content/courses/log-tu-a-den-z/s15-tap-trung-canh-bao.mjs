/**
 * Chương 15 — Gom log tập trung và cảnh báo (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s15/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s15/ (bash _demo/s15/chay-s15.bash <thư mục làm việc>, ~35 phút:
 * Loki 3.7.10 + Alloy 1.22.0 + Grafana 13.2.6 + ntfy 2.38.1 + "máy Linux" systemd/sshd; Elasticsearch/Kibana/Filebeat 9.5.7 + KQL qua Chrome headless;
 * TLS hai chiều với OpenSSL 3), rồi node scratchpad/lgz/cong-cu/sinh-ma.mjs (repo: scripts/log-khoa/sinh-ma.mjs). Tệp lệnh đuôi .bash — chay-demo.py không chạy chúng.
 */
import L151 from './s15/log-15-1-vi-sao-tap-trung.mjs';
import L152 from './s15/log-15-2-loki-grafana.mjs';
import L153 from './s15/log-15-3-elk.mjs';
import L154 from './s15/log-15-4-windows-ve-trung-tam.mjs';
import L155 from './s15/log-15-5-canh-bao.mjs';
import L156 from './s15/log-15-6-lab.mjs';
import L157 from './s15/log-15-7-quiz.mjs';

export default { lessons: [L151, L152, L153, L154, L155, L156, L157] };
