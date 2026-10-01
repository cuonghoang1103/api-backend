/**
 * course-cover-offline.mjs — dựng ảnh bìa khoá học KHÔNG cần mạng.
 * ─────────────────────────────────────────────────────────────────────────────
 * Bản sinh ảnh gốc (`course-cover.mjs`) kéo logo từ `cdn.simpleicons.org` ngay
 * lúc chạy, rồi đẩy thẳng lên R2. Hai chỗ đó đều là mạng, và mỗi chỗ đều đã
 * từng làm cả mẻ ảnh hỏng. File này bỏ cả hai: đọc logo từ gói `simple-icons`
 * trên đĩa, ghi PNG ra thư mục, không đụng R2. Ai đẩy lên thì đẩy sau —
 * kéo thả trên bảng điều khiển R2 cũng được.
 *
 * Bố cục sao y `course-cover.mjs` để ảnh mới xếp cạnh ảnh cũ không lệch:
 * 1200×675 · logo 232px bên trái · eyebrow 24px · tiêu đề 82px · phụ đề 30px ·
 * gạch chân 132×6 · chữ ký "cuongthai.com" góc dưới · viền màu thương hiệu.
 *
 *   node scripts/course-cover-offline.mjs --out /tmp/bia
 *   node scripts/course-cover-offline.mjs --out /tmp/bia --slug redis
 *   node scripts/course-cover-offline.mjs --out /tmp/bia --icons-dir <đường dẫn>
 *
 * `--icons-dir` mặc định là `scripts/icons/` — 19 logo chép sẵn trong repo.
 * Muốn logo khác thì trỏ sang gói simple-icons:
 *   npm install simple-icons --prefix /tmp/si --no-save
 *   node scripts/course-cover-offline.mjs --out /tmp/bia \
 *     --icons-dir /tmp/si/node_modules/simple-icons/icons
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const OUT = val('--out', '/tmp/bia');
const ONLY = val('--slug', null);
const ICONS = val('--icons-dir', new URL('./icons', import.meta.url).pathname);
const EYEBROW = val('--eyebrow', 'CUONGTHAI COURSE');
const W = 1200, H = 675;

/* Chữ trên ảnh theo đúng mẫu bộ ảnh đã có: tiêu đề là tên khoá (cắt ngắn cho
   vừa khung 82px — trần thực tế ~16 ký tự), phụ đề dạng "Zero → <đích>".
   Hai hex bị ép sang FFFFFF: Next.js #000000 và Socket.IO #010101 vẽ lên nền
   gradient tối thì mất tiêu. */
const KHOA = [
  ['nodejs', 'nodedotjs', '5FA04E', 'Node.js', 'Zero → Production'],
  ['nextjs', 'nextdotjs', 'FFFFFF', 'Next.js & React', 'Zero → Production · App Router'],
  ['typescript', 'typescript', '3178C6', 'TypeScript', 'Zero → Mastering the Type System'],
  ['postgresql', 'postgresql', '4169E1', 'PostgreSQL', 'Zero → Production'],
  ['web-foundations', 'html5', 'E34F26', 'Web Foundations', 'HTML · CSS · JavaScript from Zero'],
  ['object-storage', 'cloudflare', 'F38020', 'Object Storage', 'S3 API & Cloudflare R2'],
  ['media-processing', 'ffmpeg', '007808', 'Media Processing', 'Images & Video with Sharp + FFmpeg'],
  ['socket-io', 'socketdotio', 'FFFFFF', 'Socket.IO', 'Real-time Apps from Zero'],
  ['tailwind-css', 'tailwindcss', '06B6D4', 'Tailwind CSS', 'Zero → Design System'],
  ['git', 'git', 'F05032', 'Git & GitHub', 'Zero → Production'],
  ['linux-bash', 'linux', 'FCC624', 'Linux & Bash', 'Zero → Running Your Own Servers'],
  ['docker', 'docker', '2496ED', 'Docker', 'Zero → Production'],
  ['redis', 'redis', 'DC382D', 'Redis', 'Caching, Queues & Rate Limits'],
  ['prisma-orm', 'prisma', '8B9CF6', 'Prisma ORM', 'Schema, Migrations & Queries'],
  ['authentication', 'openid', 'F78C40', 'Authentication', 'Secure Sign-in from Zero'],
  ['nginx', 'nginx', '009639', 'Nginx', 'Reverse Proxy, TLS & Caching'],
  ['deploy-vps', 'ubuntu', 'E95420', 'Deploy to a VPS', 'Zero → Zero-downtime Deploys'],
  ['github-actions', 'githubactions', '2088FF', 'GitHub Actions', 'CI/CD from Zero'],
  ['observability-monitoring', 'grafana', 'F46800', 'Observability', 'Logs → Metrics → Traces'],
  ['kafka', 'apachekafka', 'FFFFFF', 'Apache Kafka', 'Zero → Event Streaming'],
  // 30/09/2026 — 25 khoá khung mới (content/courses/_KE-HOACH-KHOA-MOI-3009.md): bảo mật, vận hành, nền tảng CS, dữ liệu, sản phẩm.
  ['ddos-protection', 'cloudflare', 'F38020', 'DDoS Protection', 'Cloudflare · WAF · Rate Limiting'],
  ['incident-response', 'pagerduty', '06AC38', 'Incident Response', 'Detect → Recover → Postmortem'],
  ['threat-modeling', 'owasp', 'FFFFFF', 'Threat Modeling', 'STRIDE · Secure by Design'],
  ['applied-cryptography', 'gnuprivacyguard', '0093DD', 'Applied Cryptography', 'Hashing · AES · RSA/ECC · TLS 1.3'],
  ['network-security', 'wireguard', 'E0484E', 'Network Security', 'Firewalls · VPN · Zero Trust'],
  ['cloud-container-security', 'kubernetes', '326CE5', 'Cloud & K8s Security', 'IAM · Images · RBAC · Runtime'],
  ['blue-team-siem', 'elastic', '00BFB3', 'Blue Team & SIEM', 'Detection · Forensics'],
  ['devsecops', 'githubactions', '2088FF', 'DevSecOps', 'Security in CI/CD'],
  ['reverse-engineering', 'virustotal', '5B7CFF', 'Reverse Engineering', 'Assembly · Ghidra · Malware'],
  ['privacy-data-law', 'proton', '8B6CFF', 'Privacy & Data Law', 'GDPR · Vietnam Decree 13/2023'],
  ['infrastructure-as-code', 'terraform', '9D6CE0', 'Infrastructure as Code', 'Terraform & Ansible'],
  ['email-infrastructure', 'gmail', 'EA4335', 'Email Infrastructure', 'SPF · DKIM · DMARC · Deliverability'],
  ['performance-load-testing', 'k6', '8F7CFF', 'Load Testing', 'k6 · Profiling · Capacity'],
  ['networking-for-developers', 'wireshark', '3B9AD9', 'Networking for Devs', 'DNS · TCP · TLS · HTTP/3 · CDN'],
  ['operating-systems-for-developers', 'linux', 'FCC624', 'Operating Systems', 'Processes · Memory · Concurrency'],
  ['distributed-systems', 'etcd', '419EDA', 'Distributed Systems', 'CAP · Raft · Replication'],
  ['system-design', 'apachecassandra', '3FA9D6', 'System Design', '1 Server → Millions of Users'],
  ['search-elasticsearch', 'elasticsearch', 'FEC514', 'Search Engines', 'Elasticsearch · OpenSearch · Full-text'],
  ['data-engineering', 'clickhouse', 'FFCC01', 'Data Engineering', 'ETL · ClickHouse · dbt'],
  ['online-payments', 'stripe', '8F87FF', 'Online Payments', 'VNPay · MoMo · Stripe · Webhooks'],
  ['ux-ui-for-developers', 'figma', 'F24E1E', 'UX/UI for Devs', 'Figma · Design Systems · a11y'],
  ['seo-analytics', 'googlesearchconsole', '458CF5', 'SEO & Analytics', 'Search Console · GA4 · Web Vitals'],
  ['solo-product', 'producthunt', 'DA552F', 'Solo Product', 'Idea → Launch → Revenue'],
  // 01/10/2026 — lộ trình 6 nghề (content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md); logo lấy từ gói simple-icons (--icons-dir).
  ['math-for-ml', 'numpy', '4DABCF', 'Math for ML', 'Vectors · Matrices · Calculus · Probability'],
  ['statistics-data-science', 'pandas', 'E70488', 'Statistics & Data Science', 'EDA · Hypothesis Tests · A/B · Causality'],
  ['mlops-llmops', 'mlflow', '0194E2', 'MLOps & LLMOps', 'Serving · Registry · Monitoring · Evals'],
  ['spark-lakehouse', 'apachespark', 'E25A1C', 'Spark & Lakehouse', 'Spark · Delta · Iceberg · Airflow'],
  ['cloud-architecture', 'googlecloud', '4285F4', 'Cloud Architecture', 'Well-Architected · HA/DR · FinOps'],
  ['software-architecture', 'diagramsdotnet', 'F08705', 'Software Architecture', 'DDD · Clean · CQRS · C4 & ADR'],
  ['blockchain-fundamentals', 'bitcoin', 'F7931A', 'Blockchain', 'Bitcoin · Ethereum · EVM from Zero'],
  // 01/10/2026 — vẽ lại 2 ảnh cũ của course-cover.mjs: chữ tràn khung / logo quá tối.
  ['api-design', 'openapiinitiative', '6BA539', 'API Design', 'REST · Errors · Versioning · Idempotency'],
  ['ai-agents', 'anthropic', 'D97757', 'AI Agents', 'Tools · MCP · Memory · Evaluation'],
  ['smart-contracts-solidity', 'solidity', 'FFFFFF', 'Smart Contracts', 'Solidity · Foundry · Audits · DeFi'],
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function veSvg(paths, COLOR, TITLE, SUBTITLE) {
  const LOGO_BOX = 232;
  const LOGO_X = 96, LOGO_Y = (H - LOGO_BOX) / 2 - 12;
  const scale = LOGO_BOX / 24;
  const TX = LOGO_X + LOGO_BOX + 76;
  // Tiêu đề dài hơn ~16 ký tự tràn khung 82px (30/09: "Infrastructure as Code", "Cloud & K8s Security") ⇒ thu nhỏ theo độ dài, sàn 52px.
  const TITLE_SIZE = [...TITLE].length > 16 ? Math.max(52, Math.floor((82 * 16) / [...TITLE].length)) : 82;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="55%" stop-color="#11162a"/>
      <stop offset="100%" stop-color="#0d1220"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.22" cy="0.5" r="0.62">
      <stop offset="0%" stop-color="#${COLOR}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#${COLOR}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.92" cy="0.12" r="0.5">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <g transform="translate(${LOGO_X}, ${LOGO_Y}) scale(${scale})" fill="#${COLOR}">
    ${paths.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <text x="${TX}" y="${H / 2 - 74}" font-family="DejaVu Sans" font-size="24" font-weight="bold"
        fill="#${COLOR}" letter-spacing="4">${esc(EYEBROW)}</text>
  <text x="${TX}" y="${H / 2 + 8}" font-family="DejaVu Sans" font-size="${TITLE_SIZE}" font-weight="bold"
        fill="#f2f5fb">${esc(TITLE)}</text>
  ${SUBTITLE ? `<text x="${TX}" y="${H / 2 + 58}" font-family="DejaVu Sans" font-size="30"
        fill="#9aa4bd">${esc(SUBTITLE)}</text>` : ''}
  <rect x="${TX}" y="${H / 2 + 92}" width="132" height="6" rx="3" fill="#${COLOR}"/>

  <text x="${LOGO_X}" y="${H - 46}" font-family="DejaVu Sans" font-size="22"
        fill="#6b7590">cuongthai.com</text>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#${COLOR}" opacity="0.85"/>
</svg>`;
}

mkdirSync(OUT, { recursive: true });
let ok = 0, loi = 0;
for (const [slug, icon, color, title, subtitle] of KHOA) {
  if (ONLY && ONLY !== slug) continue;
  const p = path.join(ICONS, `${icon}.svg`);
  if (!existsSync(p)) { console.error(`✗ ${slug}: không thấy logo ${p}`); loi++; continue; }
  const paths = [...readFileSync(p, 'utf8').matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) { console.error(`✗ ${slug}: logo không có <path d="…">`); loi++; continue; }
  const png = await sharp(Buffer.from(veSvg(paths, color, title, subtitle)))
    .png({ compressionLevel: 9 }).toBuffer();
  const dich = path.join(OUT, `${slug}.png`);
  writeFileSync(dich, png);
  console.log(`✓ ${slug.padEnd(26)} ${(png.length / 1024).toFixed(1).padStart(6)} KB  → ${dich}`);
  ok++;
}
console.log(`\n${ok} ảnh · ${loi} lỗi · thư mục ${OUT}`);
process.exit(loi > 0 ? 1 : 0);
