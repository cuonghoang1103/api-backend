/**
 * Chương 10 — Log web server và log ứng dụng (soạn chi tiết 24/11/2026). Bài tách ở ./s10/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s10/ (bash _demo/s10/chay-s10.sh <thư mục làm việc>: Lab 10 nginx 1.27 + Node 22/pino,
 * Spring Boot 4.1.1/Logback 1.5, httpd 2.4, Log4j 2.14.1 vs 2.17.1 trong container không mạng), rồi scripts/log-khoa/sinh-ma.mjs.
 */
import L101 from './s10/log-10-1-ma-trang-thai.mjs';
import L102 from './s10/log-10-2-nginx-access-error.mjs';
import L103 from './s10/log-10-3-apache-iis.mjs';
import L104 from './s10/log-10-4-log-node.mjs';
import L105 from './s10/log-10-5-log-spring.mjs';
import L106 from './s10/log-10-6-java-slf4j-cau-hinh.mjs';
import L107 from './s10/log-10-7-java-mdc-json-hieu-nang.mjs';
import L108 from './s10/log-10-8-log-cau-truc.mjs';
import L109 from './s10/log-10-9-tan-cong-web.mjs';
import L1010 from './s10/log-10-10-lab.mjs';
import L1011 from './s10/log-10-11-quiz.mjs';

export default { lessons: [L101, L102, L103, L104, L105, L106, L107, L108, L109, L1010, L1011] };
