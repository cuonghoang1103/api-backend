/**
 * gen-project-covers.mjs — vẽ ảnh bìa 1200×630 cho MỌI dự án trong
 * content/projects/*.mjs, bằng đúng hệ màu của site.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/gen-project-covers.mjs                     # vẽ hết
 *   node scripts/gen-project-covers.mjs --slug todo-list-app-full-stack
 *   node scripts/gen-project-covers.mjs --out /tmp/covers   # đổi thư mục ra
 *
 * VÌ SAO VẼ CHỨ KHÔNG SINH BẰNG AI
 * Không có khoá sinh ảnh nào trong .env, và với bìa dự án lập trình thì ảnh
 * AI cũng là lựa chọn tệ hơn: nó không đồng bộ với thương hiệu, không đọc
 * được, và 41 tấm sẽ trông như 41 phong cách khác nhau. Bìa vẽ bằng chính
 * token màu của Tailwind config (neon.violet/indigo/cyan/fuchsia trên nền
 * #050314 của AcademyBackground) thì luôn khớp site, và quan trọng hơn —
 * mỗi tấm MANG THÔNG TIN: một dòng "chữ ký kỹ thuật" nói đúng cái ý tưởng
 * trung tâm của dự án đó, nên lưới 41 thẻ đọc lướt được.
 *
 * TÍNH TẤT ĐỊNH
 * Mọi thứ ngẫu nhiên (vị trí sao, góc quỹ đạo, độ nghiêng lưới) đều bắt
 * nguồn từ hash của slug — chạy lại bao nhiêu lần cũng ra đúng tấm ảnh cũ,
 * nên không tạo diff giả và không phải upload lại vô cớ.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content/projects');
const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const ONLY = val('--slug');
const OUT = val('--out') || path.join(ROOT, '.covers');

/* ── Hệ màu: lấy thẳng từ frontend/tailwind.config.ts ────────────────────── */
const NEON = {
  indigo: '#6366f1', violet: '#8b5cf6', fuchsia: '#d946ef', cyan: '#22d3ee',
  green: '#4ade80', emerald: '#10b981', blue: '#3b82f6', orange: '#fb923c',
  pink: '#ec4899', red: '#f43f5e',
};

/* Mỗi nhóm dự án một cặp màu riêng, để nhìn lưới là phân loại được ngay. */
const CATEGORY_THEME = {
  Web:      { a: NEON.violet,  b: NEON.indigo,  label: 'WEB' },
  Backend:  { a: NEON.cyan,    b: NEON.blue,    label: 'BACKEND' },
  Mobile:   { a: NEON.emerald, b: NEON.green,   label: 'MOBILE' },
  AI:       { a: NEON.fuchsia, b: NEON.violet,  label: 'AI' },
  DevOps:   { a: NEON.orange,  b: NEON.pink,    label: 'DEVOPS' },
  Data:     { a: NEON.blue,    b: NEON.cyan,    label: 'DATA' },
  Systems:  { a: NEON.indigo,  b: NEON.violet,  label: 'SYSTEMS' },
  Tooling:  { a: NEON.pink,    b: NEON.fuchsia, label: 'TOOLING' },
};

const LEVEL_LABEL = {
  BEGINNER: 'CƠ BẢN', INTERMEDIATE: 'TRUNG BÌNH',
  ADVANCED: 'NÂNG CAO', EXPERT: 'CHUYÊN SÂU',
};

/**
 * Chữ ký kỹ thuật — MỘT ý tưởng trung tâm của mỗi dự án, viết bằng mã.
 * Đây là thứ khiến tấm bìa có ích chứ không chỉ để trang trí: nhìn lưới
 * /projects là nhớ ra ngay bài nào dạy gì. Giữ ngắn (≲ 34 ký tự) để không
 * phải thu nhỏ chữ.
 */
const SIGNATURE = {
  'ai-chatbot-platform-multi-tenant':      'WHERE tenant_id = $1',
  'ai-operating-system-multi-agent':       'plan → call → verify → retry',
  'ai-recruitment-screening':              'decided_by NOT NULL',
  'ai-study-assistant':                    'ORDER BY embedding <=> $q',
  'android-native-app-kotlin':             'ProcessDeath → SavedState',
  'banking-system-core-banking':           'balance = SUM(ledger)',
  'blog-platform-markdown-based':          'export const revalidate = 60',
  'clinic-appointment-booking-system':     'WHERE id=? AND version=0',
  'cloud-native-data-platform':            'immutable files + manifest',
  'cloud-storage-system-s3-like':          'k=6 data + m=3 parity',
  'code-collaboration-platform':           'one container per session',
  'cuonghoang-dev-portal':                 'bash deploy.sh → prod',
  'devops-kubernetes-platform':            'desired state → reconcile',
  'distributed-database-postgres-like':    'Raft quorum = ⌊n/2⌋ + 1',
  'distributed-message-broker-kafka-like': 'append-only log + offset',
  'distributed-ml-training-platform':      'all-reduce gradients',
  'distributed-search-engine':             'inverted index + BM25',
  'dotnet-enterprise-api':                 'valid_from / valid_to',
  'e-commerce-platform-multi-vendor':      'WHERE stock >= qty',
  'e-learning-mini-platform':              '@@unique([quizId, userId])',
  'event-driven-microservices-uber-like':  'INSERT outbox IN tx',
  'event-ticketing-system':                'SET key NX PX 120000',
  'flutter-cross-platform-app':            'Skia draws every pixel',
  'gym-membership-app':                    'WHERE seats_left > 0',
  'helpdesk-ticketing-api':                "WHERE status = 'OPEN'",
  'homestay-booking-api':                  'EXCLUDE USING gist (&&)',
  'ios-native-app-swift':                  '@MainActor + async/await',
  'job-board-platform-linkedin-like':      'ts_rank() + privacy in WHERE',
  'learning-management-system':            'HLS + signed URL, TTL 5m',
  'library-management-system':             'UNIQUE WHERE returned_at IS NULL',
  'llm-code-generation-platform':          'tree-sitter AST + repo map',
  'real-time-chat-app-1-1':                'socket.join(roomId)',
  'realtime-analytics-platform':           'HyperLogLog COUNT DISTINCT',
  'realtime-collaboration-figma-like':     'CRDT: merge, never lock',
  'restaurant-reservation-app':            'FOR UPDATE SKIP LOCKED',
  'saas-project-management-trello':        'SELECT ... FOR UPDATE',
  'social-media-platform-twitter-like':    'ON CONFLICT DO NOTHING',
  'todo-list-app-full-stack':              'where: { id, userId }',
  'url-shortener-voi-analytics':           'base62(id) + Redis cache',
  'video-streaming-platform-netflix-like': 'ABR by buffer, not bandwidth',
  'weather-dashboard-public-api':          'open → half-open → closed',
};

/* ── Ngẫu nhiên TẤT ĐỊNH theo slug ───────────────────────────────────────── */
function hash32(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {                       // mulberry32
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Chòm sao + quỹ đạo, sinh theo slug nên mỗi bìa một hình nhưng cùng một họ. */
function motif(seed, a, b) {
  const r = rng(seed);
  const parts = [];

  // ba cung quỹ đạo lệch tâm — nhắc lại AcademyBackground
  for (let i = 0; i < 3; i++) {
    const cx = 880 + r() * 220, cy = 150 + r() * 330;
    const rad = 90 + i * 78 + r() * 40;
    const rot = r() * 360;
    parts.push(
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}"
        fill="none" stroke="${i % 2 ? b : a}" stroke-opacity="${(0.24 - i * 0.05).toFixed(2)}"
        stroke-width="1" stroke-dasharray="4 9" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`,
      // một hành tinh nhỏ trên quỹ đạo
      `<circle cx="${(cx + Math.cos(rot) * rad).toFixed(1)}" cy="${(cy + Math.sin(rot) * rad).toFixed(1)}"
        r="${(2.5 + r() * 2.5).toFixed(1)}" fill="${i % 2 ? b : a}" fill-opacity="0.75"/>`,
    );
  }

  // chòm sao: điểm + cạnh nối những điểm đủ gần
  const pts = Array.from({ length: 15 }, () => ({ x: 760 + r() * 420, y: 60 + r() * 510 }));
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 128) {
        parts.push(`<line x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}"
          x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}"
          stroke="${a}" stroke-opacity="${(0.2 - d / 900).toFixed(3)}" stroke-width="1"/>`);
      }
    }
  }
  for (const p of pts) {
    parts.push(`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}"
      r="${(1 + r() * 2).toFixed(1)}" fill="#ffffff" fill-opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`);
  }

  // Lục giác mờ — cùng hình khối với AcademyBackground. Giữ nó bên PHẢI
  // trục 700px để nửa trái luôn sạch cho tiêu đề và khối chữ ký.
  const hx = 720 + r() * 380, hy = 380 + r() * 170, hs = 46 + r() * 30, ha = r() * Math.PI;
  const hex = Array.from({ length: 6 }, (_, k) => {
    const ang = (k / 6) * Math.PI * 2 + ha;
    return `${(hx + Math.cos(ang) * hs).toFixed(1)},${(hy + Math.sin(ang) * hs).toFixed(1)}`;
  }).join(' ');
  parts.push(`<polygon points="${hex}" fill="none" stroke="${b}" stroke-opacity="0.16" stroke-width="1.2"/>`);

  return parts.join('\n');
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Tách tiêu đề: bỏ phần "(Đồ án thực tập #N)" ra thành nhãn riêng góc phải. */
function splitTitle(title) {
  const m = title.match(/^(.*?)\s*\((Đồ án thực tập #(\d+))\)\s*$/);
  if (m) return { main: m[1], badge: `KỲ 6 · ĐỒ ÁN #${m[3]}` };
  return { main: title, badge: null };
}

function page(spec) {
  const theme = CATEGORY_THEME[spec.category] || CATEGORY_THEME.Web;
  const seed = hash32(spec.slug);
  const { main, badge } = splitTitle(spec.title);
  const sig = SIGNATURE[spec.slug] || (spec.techStack || [])[0] || '';
  const tech = (spec.techStack || []).slice(0, 4);
  // Tiêu đề dài thì thu cỡ chữ — 41 tiêu đề dài rất khác nhau.
  const size = main.length > 46 ? 52 : main.length > 32 ? 62 : 72;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{
    background:#050314;
    font-family:"SF Pro Display",-apple-system,"Helvetica Neue",Arial,sans-serif;
    color:#fff; position:relative;
  }
  .neb{position:absolute;inset:0}
  .neb::before{content:"";position:absolute;width:820px;height:820px;left:-230px;top:-330px;border-radius:50%;
    background:radial-gradient(circle,${theme.a}38 0%,transparent 62%)}
  .neb::after{content:"";position:absolute;width:760px;height:760px;right:-190px;bottom:-330px;border-radius:50%;
    background:radial-gradient(circle,${theme.b}30 0%,transparent 62%)}
  svg.motif{position:absolute;inset:0}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 45%,transparent 38%,rgba(0,0,0,.62) 100%)}
  .frame{position:absolute;inset:26px;border:1px solid rgba(255,255,255,.09);border-radius:22px}
  .edge{position:absolute;left:26px;top:26px;bottom:26px;width:5px;border-radius:22px 0 0 22px;
    background:linear-gradient(180deg,${theme.a},${theme.b})}
  .wrap{position:absolute;inset:26px;padding:52px 60px 46px 66px;display:flex;flex-direction:column}
  .top{display:flex;align-items:center;gap:12px}
  .chip{font-size:16px;font-weight:700;letter-spacing:.16em;padding:8px 16px;border-radius:999px;
    border:1px solid ${theme.a}66;color:${theme.a};background:${theme.a}14}
  .chip.lvl{border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.68);background:rgba(255,255,255,.05);letter-spacing:.12em}
  .badge{margin-left:auto;font-size:15px;font-weight:800;letter-spacing:.2em;color:${theme.b};
    border:1px solid ${theme.b}55;border-radius:10px;padding:8px 15px;background:${theme.b}12}
  /* Gradient theo CHIỀU DỌC chứ không chéo: tiêu đề 1 dòng và 2 dòng đều
     nhận cùng một dải màu, thay vì dòng đầu bị nhuộm còn dòng sau thì không. */
  h1{margin-top:auto;font-size:${size}px;line-height:1.07;font-weight:800;letter-spacing:-.022em;
    max-width:820px;text-wrap:balance;
    background:linear-gradient(180deg,#ffffff 0%,#f2eefe 58%,${theme.a}dd 100%);
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
  .sig{margin-top:26px;display:inline-flex;align-items:center;gap:13px;align-self:flex-start;
    font-family:"JetBrains Mono",Menlo,Consolas,monospace;font-size:23px;font-weight:500;
    color:rgba(255,255,255,.9);background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.12);border-left:3px solid ${theme.a};
    border-radius:11px;padding:15px 22px;max-width:840px}
  .sig i{color:${theme.a};font-style:normal;font-weight:700}
  .bot{margin-top:auto;padding-top:32px;display:flex;align-items:center;gap:11px}
  .tech{font-size:15px;font-weight:600;color:rgba(255,255,255,.6);
    border:1px solid rgba(255,255,255,.13);border-radius:8px;padding:7px 13px;background:rgba(255,255,255,.035)}
  .site{margin-left:auto;display:flex;align-items:center;gap:10px;font-size:17px;font-weight:700;
    letter-spacing:.05em;color:rgba(255,255,255,.5)}
  .dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,${theme.a},${theme.b});
    box-shadow:0 0 13px ${theme.a}}
  </style></head><body>
    <div class="neb"></div>
    <svg class="motif" width="1200" height="630" viewBox="0 0 1200 630">${motif(seed, theme.a, theme.b)}</svg>
    <div class="vig"></div>
    <div class="frame"></div><div class="edge"></div>
    <div class="wrap">
      <div class="top">
        <span class="chip">${esc(theme.label)}</span>
        <span class="chip lvl">${esc(LEVEL_LABEL[spec.difficulty] || spec.difficulty || '')}</span>
        ${badge ? `<span class="badge">${esc(badge)}</span>` : ''}
      </div>
      <h1>${esc(main)}</h1>
      <div class="sig"><i>&gt;_</i>${esc(sig)}</div>
      <div class="bot">
        ${tech.map((t) => `<span class="tech">${esc(t)}</span>`).join('')}
        <span class="site"><span class="dot"></span>cuongthai.com</span>
      </div>
    </div>
  </body></html>`;
}

/* ── Chạy ────────────────────────────────────────────────────────────────── */
const specFiles = fs.readdirSync(CONTENT).filter((f) => f.endsWith('.mjs')).sort();
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const pg = await ctx.newPage();

let n = 0;
for (const f of specFiles) {
  const spec = (await import(path.join(CONTENT, f))).default;
  if (ONLY && spec.slug !== ONLY) continue;
  if (!SIGNATURE[spec.slug]) console.warn(`  ⚠ ${spec.slug}: chưa có chữ ký kỹ thuật, dùng tạm tech đầu tiên`);
  await pg.setContent(page(spec), { waitUntil: 'load' });
  const file = path.join(OUT, `${spec.slug}.png`);
  await pg.screenshot({ path: file, type: 'png' });
  n++;
  console.log(`  ✓ ${spec.slug}.png  ${(fs.statSync(file).size / 1024).toFixed(0)}KB  [${spec.category}]`);
}

await browser.close();
console.log(`\n✓ vẽ xong ${n} ảnh bìa 1200×630 → ${path.relative(ROOT, OUT)}/`);
