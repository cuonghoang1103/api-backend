/**
 * codelab-create-tracks-batch.mjs — create MANY tracks at once with a per-kind
 * module skeleton, to round out the Code Lab taxonomy professionally.
 * Idempotent by slug; new tracks append after existing ones in their group.
 * Pure data — no LLM. Exercises are filled later by codelab-bulk-gen.
 *
 *   node scripts/codelab-create-tracks-batch.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

function slugify(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
}

// Professional module skeletons by track kind (level auto: first third BEGINNER,
// middle INTERMEDIATE, last ADVANCED).
const SK = {
  LANG: ['Getting Started & Syntax','Variables & Data Types','Operators & Expressions','Control Flow',
         'Functions','Collections & Data Structures','Strings & Text','Error Handling',
         'Object-Oriented Programming','Modules & Packages','Concurrency','File & I/O',
         'Standard Library','Testing','Idioms & Best Practices','Advanced Topics'],
  FRAMEWORK: ['Setup & Project Structure','Core Concepts','Routing','Components & Views','State & Data',
              'Forms & Validation','APIs & Data Fetching','Authentication','Database & Persistence',
              'Middleware & Config','Testing','Performance','Security','Deployment','Advanced Patterns','Real-World Project'],
  DB: ['Getting Started','Data Model & Types','Basic Queries','Filtering & Sorting','Aggregation',
       'Relationships & Joins','Indexing & Performance','Transactions & Consistency','Advanced Queries',
       'Schema Design','Security & Access','Backup & Operations','Scaling','Client & Drivers','Production Patterns'],
  CLOUD: ['Fundamentals & Concepts','Getting Started','Core Services','Configuration & State','Networking',
          'Security & IAM','Storage','Compute','CI/CD Integration','Monitoring & Logging','Cost & Optimization',
          'Infrastructure as Code','Scaling & HA','Troubleshooting','Production Best Practices'],
  GAME: ['Getting Started','The Engine/Toolchain','Rendering Basics','Math for Graphics','Input & Controls',
         'Scenes & Objects','Physics','Animation','Shaders & Materials','Lighting','Audio','UI/HUD',
         'Performance','Assets & Pipeline','Building & Shipping','Advanced Techniques'],
  WEB: ['Fundamentals','How It Works','Core Protocol/Concepts','Setting Up','Requests & Responses',
        'Security','Performance','Debugging & Tools','Real-World Patterns','Advanced Topics'],
  ALGO: ['Foundations & Big-O','Core Techniques','Arrays & Strings','Hashing','Recursion & Backtracking',
         'Sorting & Searching','Trees','Graphs','Dynamic Programming','Greedy','Advanced Data Structures',
         'Problem-Solving Patterns','Practice Sets','Interview Strategy','System-Level Thinking'],
};
const levelOf = (i,n) => i < n/3 ? 'BEGINNER' : i < 2*n/3 ? 'INTERMEDIATE' : 'ADVANCED';

// [group, name, language, color, kind]
const T = [
  // ── Languages ──
  ['languages','C++','cpp','#00599c','LANG'],
  ['languages','C#','csharp','#68217a','LANG'],
  ['languages','PHP','php','#777bb4','LANG'],
  ['languages','Ruby','ruby','#cc342d','LANG'],
  ['languages','Swift','swift','#fa7343','LANG'],
  ['languages','Dart','dart','#0175c2','LANG'],
  ['languages','Scala','scala','#dc322f','LANG'],
  ['languages','R','r','#276dc3','LANG'],
  ['languages','Elixir','elixir','#4b275f','LANG'],
  ['languages','Solidity','solidity','#363636','LANG'],
  // ── Backend ──
  ['backend','Ruby on Rails','ruby','#cc0000','FRAMEWORK'],
  ['backend','Flask','python','#000000','FRAMEWORK'],
  ['backend','Gin (Go)','go','#00add8','FRAMEWORK'],
  ['backend','Axum (Rust)','rust','#dea584','FRAMEWORK'],
  ['backend','Phoenix (Elixir)','elixir','#fd4f00','FRAMEWORK'],
  ['backend','Ktor (Kotlin)','kotlin','#087cfa','FRAMEWORK'],
  ['backend','Fastify','javascript','#202020','FRAMEWORK'],
  ['backend','Deno','typescript','#000000','FRAMEWORK'],
  // ── Frontend ──
  ['frontend','Svelte & SvelteKit','javascript','#ff3e00','FRAMEWORK'],
  ['frontend','Nuxt','typescript','#00dc82','FRAMEWORK'],
  ['frontend','Astro','javascript','#ff5d01','FRAMEWORK'],
  ['frontend','SolidJS','typescript','#2c4f7c','FRAMEWORK'],
  ['frontend','Remix','typescript','#121212','FRAMEWORK'],
  ['frontend','Qwik','typescript','#ac7ef4','FRAMEWORK'],
  ['frontend','Sass & SCSS','css','#cc6699','FRAMEWORK'],
  ['frontend','Bootstrap','html','#7952b3','FRAMEWORK'],
  // ── Database ──
  ['database','SQLite','sql','#003b57','DB'],
  ['database','Apache Cassandra','sql','#1287b1','DB'],
  ['database','Elasticsearch','json','#005571','DB'],
  ['database','Neo4j (Cypher)','cypher','#008cc1','DB'],
  ['database','ClickHouse','sql','#ffcc00','DB'],
  ['database','DynamoDB','json','#4053d6','DB'],
  ['database','Oracle Database','sql','#f80000','DB'],
  ['database','Drizzle ORM','typescript','#c5f74f','DB'],
  ['database','TypeORM','typescript','#fe0902','DB'],
  // ── Mobile ──
  ['mobile','Jetpack Compose','kotlin','#4285f4','FRAMEWORK'],
  ['mobile','Expo','javascript','#000020','FRAMEWORK'],
  ['mobile','Ionic','typescript','#3880ff','FRAMEWORK'],
  ['mobile','.NET MAUI','csharp','#512bd4','FRAMEWORK'],
  ['mobile','Kotlin Multiplatform','kotlin','#7f52ff','FRAMEWORK'],
  // ── DevOps & Cloud ──
  ['devops-cloud','Terraform','hcl','#7b42bc','CLOUD'],
  ['devops-cloud','Ansible','yaml','#ee0000','CLOUD'],
  ['devops-cloud','AWS','text','#ff9900','CLOUD'],
  ['devops-cloud','Google Cloud (GCP)','text','#4285f4','CLOUD'],
  ['devops-cloud','Microsoft Azure','text','#0078d4','CLOUD'],
  ['devops-cloud','GitLab CI/CD','yaml','#fc6d26','CLOUD'],
  ['devops-cloud','Jenkins','groovy','#d24939','CLOUD'],
  ['devops-cloud','Prometheus & Grafana','yaml','#e6522c','CLOUD'],
  ['devops-cloud','Helm','yaml','#0f1689','CLOUD'],
  // ── Algorithms & DS ──
  ['algorithms-ds','System Design','text','#ef4444','WEB'],
  ['algorithms-ds','Competitive Programming','cpp','#f59e0b','ALGO'],
  ['algorithms-ds','Coding Interview Patterns','python','#10b981','ALGO'],
  ['algorithms-ds','Design Patterns','java','#6366f1','ALGO'],
  // ── Game & Graphics ──
  ['game-graphics','Godot','gdscript','#478cbf','GAME'],
  ['game-graphics','Unreal Engine (C++)','cpp','#0e1128','GAME'],
  ['game-graphics','Three.js','javascript','#049ef4','GAME'],
  ['game-graphics','GLSL Shaders','glsl','#5586a4','GAME'],
  ['game-graphics','Vulkan','cpp','#a41e22','GAME'],
  // ── Web & Networking ──
  ['web-networking','Networking Fundamentals','text','#64748b','WEB'],
  ['web-networking','Web Security (OWASP)','text','#dc2626','WEB'],
  ['web-networking','gRPC','protobuf','#4285f4','WEB'],
  ['web-networking','WebRTC','javascript','#333333','WEB'],
  ['web-networking','Web Performance','text','#22c55e','WEB'],
  ['web-networking','WebAssembly','rust','#654ff0','WEB'],
];

let tC=0,mC=0,skip=0;
for (const [gslug,name,lang,color,kind] of T) {
  const group = await prisma.codeGroup.findUnique({ where: { slug: gslug } });
  if (!group) { console.log(`  ! group ${gslug} missing for ${name}`); continue; }
  const tslug = slugify(name);
  let track = await prisma.codeTrack.findUnique({ where: { slug: tslug } });
  if (track) { console.log(`  = ${gslug}/${tslug}`); skip++; continue; }
  const maxT = await prisma.codeTrack.aggregate({ where: { groupId: group.id }, _max: { sortOrder: true } });
  const sortOrder = (maxT._max.sortOrder ?? -1) + 1;
  tC++;
  console.log(`  + ${gslug}/${tslug} [${lang}] ${kind}`);
  if (APPLY) {
    track = await prisma.codeTrack.create({ data: {
      groupId: group.id, name, slug: tslug, language: lang, color,
      level: 'BEGINNER', sortOrder, status: 'DRAFT',
      description: `${name} — professional track (auto-scaffolded, exercises generating).`,
    }});
    const mods = SK[kind];
    for (let i=0;i<mods.length;i++) {
      await prisma.codeModule.create({ data: {
        trackId: track.id, name: mods[i], slug: slugify(mods[i]), level: levelOf(i,mods.length), sortOrder: i,
      }});
      mC++;
    }
  }
}
console.log(`\n[batch] tracks +${tC} (skipped ${skip}), modules +${mC}. ${APPLY?'Done.':'DRY — add --apply.'}`);
await prisma.$disconnect();
