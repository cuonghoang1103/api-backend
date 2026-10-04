/**
 * Game Library seed — categories + the initial game catalogue.
 *
 * Runs on EVERY deploy (deploy.sh → `npx prisma db seed` → seed.ts → here), so
 * it is strictly create-if-missing: every upsert passes `update: {}`. That
 * matters — an admin who renames a game or swaps its cover in /admin/games must
 * not have those edits reverted by the next deploy.
 *
 * The game list below is migrated 1:1 from the old static GAMES_DATA array in
 * frontend/src/types/games.ts so existing /games/<slug> URLs keep resolving
 * (SEO), plus `love-me` — a standalone HTML game that previously existed only
 * as an orphan redirect and never appeared in the catalogue.
 */
import type { PrismaClient, GameDifficulty, GameStatus, GameKind } from '@prisma/client';

interface CategorySeed {
  slug: string;
  name: string;
  nameVi: string;
  icon: string;
  color: string;
  sortOrder: number;
}

// Icon keys map to lucide-react icons resolved client-side (see the games UI).
const CATEGORIES: CategorySeed[] = [
  { slug: 'iq-logic', name: 'IQ & Logic', nameVi: 'IQ & Logic', icon: 'brain', color: '#5DCAA5', sortOrder: 1 },
  { slug: 'math', name: 'Math', nameVi: 'Toán học', icon: 'calculator', color: '#F5A524', sortOrder: 2 },
  { slug: 'physics', name: 'Physics', nameVi: 'Vật lý', icon: 'atom', color: '#4F9CF9', sortOrder: 3 },
  { slug: 'skill-training', name: 'Skill Training', nameVi: 'Luyện kỹ năng', icon: 'target', color: '#F97066', sortOrder: 4 },
  { slug: 'arcade', name: 'Arcade', nameVi: 'Arcade', icon: 'gamepad-2', color: '#A78BFA', sortOrder: 5 },
  { slug: 'strategy', name: 'Strategy', nameVi: 'Chiến thuật', icon: 'swords', color: '#EC4899', sortOrder: 6 },
  // 05/10/2026 — mục Game của app: luyện trí não sau giờ học.
  { slug: 'memory', name: 'Memory', nameVi: 'Trí nhớ', icon: 'brain', color: '#22D3EE', sortOrder: 0 },
  { slug: 'focus', name: 'Focus', nameVi: 'Tập trung', icon: 'target', color: '#FBBF24', sortOrder: 7 },
  { slug: 'relax', name: 'Relax', nameVi: 'Thư giãn', icon: 'sprout', color: '#34D399', sortOrder: 8 },
  { slug: 'action', name: 'Action', nameVi: 'Hành động', icon: 'zap', color: '#F472B6', sortOrder: 9 },
];

interface GameSeed {
  slug: string;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  longDescription?: string;
  controls: string;
  controlsVi: string;
  categorySlug: string;
  difficulty: GameDifficulty;
  status: GameStatus;
  kind: GameKind;
  componentKey?: string;
  iframeSrc?: string;
  featured: boolean;
  sortOrder: number;
  estimatedTime: string;
  techStack: string[];
  tags: string[];
  coverImage?: string;
}

const GAMES: GameSeed[] = [
  {
    slug: 'snake-game',
    title: 'Snake Game',
    titleVi: 'Rắn săn mồi',
    description: 'Classic snake game built with HTML5 Canvas.',
    descriptionVi: 'Game rắn săn mồi cổ điển dựng bằng HTML5 Canvas.',
    longDescription:
      'Eat the food to grow your snake. Avoid crashing into walls and your own tail. Each food gives you +1 score. The game speeds up as you grow longer.',
    controls: 'Use Arrow Keys or WASD to move. Press P to pause. Swipe on touch devices.',
    controlsVi: 'Dùng phím mũi tên hoặc WASD để di chuyển. Nhấn P để tạm dừng. Vuốt trên điện thoại.',
    categorySlug: 'arcade',
    difficulty: 'EASY',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'snake',
    featured: true,
    sortOrder: 10,
    estimatedTime: '5-10 min',
    techStack: ['HTML5 Canvas', 'TypeScript', 'CSS3'],
    tags: ['Canvas', 'Retro'],
    coverImage: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80',
  },
  {
    slug: 'memory-card',
    title: 'Memory Card',
    titleVi: 'Lật thẻ trí nhớ',
    description: 'Match pairs of cards to win. Test your memory!',
    descriptionVi: 'Lật và ghép các cặp thẻ giống nhau. Thử thách trí nhớ của bạn!',
    longDescription:
      'Flip cards to find matching pairs. Cards are shuffled randomly each round. Find all pairs in the fewest moves possible.',
    controls: 'Click or tap a card to flip it, then flip another to find its match.',
    controlsVi: 'Bấm vào một thẻ để lật, rồi lật thẻ khác để tìm cặp giống nhau.',
    categorySlug: 'iq-logic',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'memory-card',
    featured: true,
    sortOrder: 20,
    estimatedTime: '3-8 min',
    techStack: ['React', 'Framer Motion', 'TypeScript'],
    tags: ['Animation', 'Logic'],
    coverImage: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1200&q=80',
  },
  {
    slug: 'math-blitz',
    title: 'Math Blitz',
    titleVi: 'Toán tốc chiến',
    description: 'A 60-second mental-math sprint with a streak multiplier.',
    descriptionVi: 'Chạy nước rút toán nhẩm trong 60 giây, có hệ số nhân chuỗi đúng.',
    longDescription:
      'Answer as many arithmetic questions as you can in 60 seconds. Questions get harder as you go, and consecutive correct answers build a streak multiplier.',
    controls: 'Type the answer and press Enter. On mobile, use the on-screen number pad.',
    controlsVi: 'Gõ đáp án rồi nhấn Enter. Trên điện thoại, dùng bàn phím số trên màn hình.',
    categorySlug: 'math',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'math-blitz',
    featured: false,
    sortOrder: 30,
    estimatedTime: '1 min',
    techStack: ['React', 'TypeScript'],
    tags: ['Mental Math', 'Timed'],
  },
  {
    slug: 'projectile-challenge',
    title: 'Projectile Challenge',
    titleVi: 'Thử thách ném xa',
    description: 'Set angle and power to hit the target — real projectile physics.',
    descriptionVi: 'Chỉnh góc và lực để bắn trúng mục tiêu — vật lý ném xiên thật.',
    longDescription:
      'Ten levels of increasing distance and obstacles. Trajectories follow real projectile motion; wind appears at higher levels.',
    controls: 'Drag the angle/power sliders (or use arrow keys) and press Fire.',
    controlsVi: 'Kéo thanh góc/lực (hoặc dùng phím mũi tên) rồi nhấn Bắn.',
    categorySlug: 'physics',
    difficulty: 'HARD',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'projectile',
    featured: false,
    sortOrder: 40,
    estimatedTime: '5-15 min',
    techStack: ['HTML5 Canvas', 'TypeScript'],
    tags: ['Physics', 'Aim'],
  },
  {
    slug: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    titleVi: 'Cờ ca-rô 3x3',
    description: 'Classic X vs O against an unbeatable AI.',
    descriptionVi: 'X và O cổ điển, đấu với AI không thể thắng.',
    longDescription:
      'Get three in a row — horizontally, vertically, or diagonally — to win. The AI uses the minimax algorithm, so a perfect game ends in a draw.',
    controls: 'Click any cell to place your X. The AI responds with O.',
    controlsVi: 'Bấm vào ô bất kỳ để đặt X. AI sẽ đi O.',
    categorySlug: 'strategy',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'tic-tac-toe',
    featured: false,
    sortOrder: 50,
    estimatedTime: '2-5 min',
    techStack: ['React', 'TypeScript', 'Minimax AI'],
    tags: ['AI', 'Classic'],
    coverImage: 'https://images.unsplash.com/photo-1603729363753-d95eb02a9f38?w=1200&q=80',
  },
  {
    // Previously an orphan: /games/love-me only redirected to a static HTML
    // file and the game never appeared in the catalogue. Now a first-class
    // IFRAME game so it is listed, searchable and linkable.
    slug: 'love-me',
    title: 'Love Me',
    titleVi: 'Love Me',
    description: 'A small standalone HTML mini-game.',
    descriptionVi: 'Một mini-game HTML nhỏ độc lập.',
    controls: 'Follow the on-screen instructions.',
    controlsVi: 'Làm theo hướng dẫn hiển thị trong game.',
    categorySlug: 'arcade',
    difficulty: 'EASY',
    status: 'PUBLISHED',
    kind: 'IFRAME',
    iframeSrc: '/games/love-me-game/love-me.html',
    featured: false,
    sortOrder: 60,
    estimatedTime: '2-5 min',
    techStack: ['HTML5', 'CSS3', 'JavaScript'],
    tags: ['Casual'],
  },
  {
    slug: 'block-breaker',
    title: 'Block Breaker',
    titleVi: 'Xếp khối',
    description: 'Stack falling blocks to clear lines.',
    descriptionVi: 'Xếp các khối rơi xuống để phá hàng.',
    longDescription:
      'Rotate and place falling blocks to complete full horizontal lines. Completed lines disappear and earn points.',
    controls: 'Arrow keys to move and rotate. Down arrow drops faster.',
    controlsVi: 'Phím mũi tên để di chuyển và xoay. Mũi tên xuống để rơi nhanh.',
    categorySlug: 'arcade',
    difficulty: 'HARD',
    status: 'COMING_SOON',
    kind: 'REACT',
    featured: false,
    sortOrder: 70,
    estimatedTime: '10-30 min',
    techStack: ['HTML5 Canvas', 'TypeScript'],
    tags: ['Retro', 'Endless'],
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
  },
  {
    slug: 'sudoku',
    title: 'Sudoku',
    titleVi: 'Sudoku',
    description: 'Fill the 9x9 grid so every row, column and 3x3 box has digits 1-9.',
    descriptionVi: 'Điền lưới 9x9 sao cho mỗi hàng, cột và ô 3x3 đều có đủ số 1-9.',
    longDescription:
      'A classic number puzzle. Fill each row, column and 3x3 subgrid with digits 1 through 9 without repeating a number in the same row, column or box.',
    controls: 'Click a cell to select it, then pick a number 1-9. Pencil mode adds notes.',
    controlsVi: 'Bấm vào ô để chọn, rồi chọn số 1-9. Chế độ bút chì để ghi nháp.',
    categorySlug: 'iq-logic',
    difficulty: 'HARD',
    status: 'COMING_SOON',
    kind: 'REACT',
    featured: false,
    sortOrder: 80,
    estimatedTime: '10-30 min',
    techStack: ['React', 'TypeScript'],
    tags: ['Logic', 'Numbers'],
    coverImage: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=1200&q=80',
  },
  /* ── Luyện trí não (05/10/2026) — ảnh bìa vẽ riêng ở public/games/covers/ ── */
  {
    slug: 'day-sang',
    title: 'Glow Sequence',
    titleVi: 'Dãy sáng',
    description: 'Watch the tiles light up, then repeat the order. Trains spatial working memory.',
    descriptionVi: 'Các ô lần lượt sáng — bấm lại đúng thứ tự. Luyện trí nhớ không gian.',
    longDescription:
      'Based on the Corsi block task from cognitive psychology. Sequences grow by one tile every level, the grid grows from 3x3 to 5x5, and every fourth level must be repeated in reverse — the variant that trains working memory rather than passive recall. Your memory span (longest sequence recalled) is shown at the end.',
    controls: 'Click or tap tiles in order. On the 3x3 grid, number keys 1-9 also work.',
    controlsVi: 'Bấm/chạm các ô theo đúng thứ tự. Lưới 3×3 dùng được phím số 1–9.',
    categorySlug: 'memory',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'day-sang',
    featured: true,
    sortOrder: 1,
    estimatedTime: '3-8 min',
    techStack: ['React', 'Web Audio'],
    tags: ['Trí nhớ', 'Corsi', 'Luyện não'],
    coverImage: 'https://cuongthai.com/games/covers/day-sang.svg', // tuyệt đối: app desktop chạy ở app:// nên đường tương đối hỏng
  },  {
    slug: 'n-back',
    title: 'Dual N-Back',
    titleVi: 'N-back kép',
    description: 'Remember what lit up N turns ago — position and letter at once. The most-studied working-memory exercise.',
    descriptionVi: 'Nhớ ô sáng và chữ của N lượt trước — cùng lúc hai kênh. Bài luyện trí nhớ làm việc được nghiên cứu nhiều nhất.',
    longDescription:
      'Dual n-back (Jaeggi, 2008). Each turn a square lights up and a letter is shown and spoken. Press Position when the square matches N turns back, Letter when the letter does. N rises when you score 85% or more in a block and drops below 60%.',
    controls: 'A = position match, L = letter match. Buttons on touch.',
    controlsVi: 'Phím A = trùng vị trí, L = trùng chữ. Màn cảm ứng bấm hai nút lớn.',
    categorySlug: 'memory',
    difficulty: 'HARD',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'n-back',
    featured: true,
    sortOrder: 2,
    estimatedTime: '5-6 min',
    techStack: ['React', 'Speech Synthesis'],
    tags: ['Trí nhớ', 'N-back', 'Luyện não'],
    coverImage: 'https://cuongthai.com/games/covers/n-back.svg',
  },
  {
    slug: 'schulte',
    title: 'Schulte Table',
    titleVi: 'Bảng Schulte',
    description: 'Tap 1 to 25 in order as fast as you can while keeping your eyes on the centre.',
    descriptionVi: 'Bấm các số theo thứ tự tăng dần nhanh nhất có thể, mắt giữ ở giữa bảng.',
    longDescription:
      'A classic attention and peripheral-vision drill used in speed-reading training. Three rounds: 4x4, 5x5, 6x6. Wrong taps add one second.',
    controls: 'Click or tap the numbers in ascending order.',
    controlsVi: 'Bấm/chạm các số theo thứ tự tăng dần.',
    categorySlug: 'focus',
    difficulty: 'EASY',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'schulte',
    featured: false,
    sortOrder: 3,
    estimatedTime: '2-4 min',
    techStack: ['React'],
    tags: ['Tập trung', 'Tốc độ'],
    coverImage: 'https://cuongthai.com/games/covers/schulte.svg',
  },
  {
    slug: 'stroop',
    title: 'Colour Words (Stroop)',
    titleVi: 'Màu chữ (Stroop)',
    description: 'Pick the INK colour, not the word. Then the rule switches.',
    descriptionVi: 'Chọn MÀU MỰC của chữ, không phải nghĩa chữ — rồi luật sẽ đổi.',
    longDescription:
      'The Stroop effect (1935): reading is automatic, so naming the ink colour of a mismatched word trains inhibitory control. Every 12 correct answers the rule flips to the word meaning, training task switching. 60 seconds, streak multipliers.',
    controls: 'Tap a colour or press 1-5.',
    controlsVi: 'Bấm ô màu hoặc phím 1–5.',
    categorySlug: 'focus',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'stroop',
    featured: false,
    sortOrder: 4,
    estimatedTime: '1 min',
    techStack: ['React'],
    tags: ['Tập trung', 'Phản xạ', 'Stroop'],
    coverImage: 'https://cuongthai.com/games/covers/stroop.svg',
  },
  {
    slug: 'ma-tran-iq',
    title: 'IQ Matrices',
    titleVi: 'Ma trận IQ',
    description: 'Find the missing tile by discovering the hidden rules — Raven-style, endlessly generated.',
    descriptionVi: 'Tìm ô còn thiếu bằng cách phát hiện quy luật — kiểu Raven, sinh đề vô hạn.',
    longDescription:
      '3x3 matrices whose rows follow rules on shape, count, colour, fill and rotation (progression, distribution of three, addition, constant). Wrong options differ from the answer in exactly one attribute, so you must find the rule. 12 questions of rising difficulty; the rule is explained after each answer.',
    controls: 'Click one of the six options.',
    controlsVi: 'Bấm một trong sáu đáp án.',
    categorySlug: 'iq-logic',
    difficulty: 'HARD',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'ma-tran-iq',
    featured: false,
    sortOrder: 5,
    estimatedTime: '6-10 min',
    techStack: ['React', 'SVG'],
    tags: ['IQ', 'Logic', 'Suy luận'],
    coverImage: 'https://cuongthai.com/games/covers/ma-tran-iq.svg',
  },
  {
    slug: '2048',
    title: '2048',
    titleVi: '2048',
    description: 'Slide and merge equal tiles to reach 2048 — then beat your record.',
    descriptionVi: 'Trượt và gộp các ô cùng số để lên 2048 — rồi phá kỷ lục.',
    longDescription:
      'The classic sliding-tile strategy game with smooth slide, merge and spawn animations.',
    controls: 'Arrow keys / WASD, or swipe.',
    controlsVi: 'Phím mũi tên / WASD, hoặc vuốt.',
    categorySlug: 'strategy',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: '2048',
    featured: false,
    sortOrder: 6,
    estimatedTime: '5-15 min',
    techStack: ['React'],
    tags: ['Chiến thuật', 'Logic'],
    coverImage: 'https://cuongthai.com/games/covers/2048.svg',
  },
  {
    slug: 'noi-day',
    title: 'Connect Flow',
    titleVi: 'Nối dây',
    description: 'Connect matching dots with pipes that never cross and fill the whole board.',
    descriptionVi: 'Nối các cặp chấm cùng màu, dây không cắt nhau và phải phủ kín bảng.',
    longDescription:
      'Generated from a random Hamiltonian path, so every puzzle is solvable. Five levels from 5x5 to 8x8.',
    controls: 'Drag from a dot to its twin. Drag back to undo.',
    controlsVi: 'Kéo từ một chấm tới chấm cùng màu; kéo lùi để xoá.',
    categorySlug: 'iq-logic',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'noi-day',
    featured: false,
    sortOrder: 7,
    estimatedTime: '4-8 min',
    techStack: ['React', 'SVG'],
    tags: ['Logic', 'Không gian'],
    coverImage: 'https://cuongthai.com/games/covers/noi-day.svg',
  },
  {
    slug: 'khu-vuon',
    title: 'CuongMini Garden',
    titleVi: 'Khu vườn CuongMini',
    description: 'Plant, water and harvest on a little floating island through one relaxing day.',
    descriptionVi: 'Gieo hạt, tưới nước và thu hoạch trên hòn đảo nhỏ suốt một ngày thư giãn.',
    longDescription:
      'A three-minute day from sunrise to sunset: five crops, dry plants stop growing, bugs must be tapped away, and 5% of crops come out golden. Your score is the coins harvested.',
    controls: 'Pick a seed or tool below, then tap a plot.',
    controlsVi: 'Chọn hạt/công cụ bên dưới rồi chạm vào luống.',
    categorySlug: 'relax',
    difficulty: 'EASY',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'khu-vuon',
    featured: true,
    sortOrder: 8,
    estimatedTime: '3 min',
    techStack: ['React', 'SVG'],
    tags: ['Thư giãn', 'Trồng trọt'],
    coverImage: 'https://cuongthai.com/games/covers/khu-vuon.svg',
  },
  {
    slug: 'runner',
    title: 'CuongMini Run',
    titleVi: 'CuongMini chạy',
    description: 'Run, jump and dodge as the CuongMini robot on a 3D sunset highway.',
    descriptionVi: 'Hoá thân robot CuongMini chạy, nhảy, né chướng ngại trên đường 3D hoàng hôn.',
    longDescription:
      'A 3D endless runner built with three.js: three lanes, crystals to dodge, low bars to jump, stars to collect and ever-rising speed. Three lives.',
    controls: 'Left/Right or A/D to switch lanes, Up/W/Space to jump. Swipe on touch.',
    controlsVi: '←/→ hoặc A/D đổi làn, ↑/W/Space nhảy. Màn cảm ứng: vuốt.',
    categorySlug: 'action',
    difficulty: 'MEDIUM',
    status: 'PUBLISHED',
    kind: 'REACT',
    componentKey: 'runner',
    featured: true,
    sortOrder: 9,
    estimatedTime: '2-6 min',
    techStack: ['React', 'three.js', 'WebGL'],
    tags: ['Hành động', '3D'],
    coverImage: 'https://cuongthai.com/games/covers/runner.svg',
  },
];

export async function seedGames(prisma: PrismaClient): Promise<void> {
  // ── Categories ────────────────────────────────────────────
  for (const c of CATEGORIES) {
    await prisma.gameCategory.upsert({
      where: { slug: c.slug },
      update: {}, // never clobber admin edits on re-deploy
      create: {
        slug: c.slug,
        name: c.name,
        nameVi: c.nameVi,
        icon: c.icon,
        color: c.color,
        sortOrder: c.sortOrder,
      },
    });
  }

  const categories = await prisma.gameCategory.findMany({ select: { id: true, slug: true } });
  const catId = new Map(categories.map((c) => [c.slug, c.id]));

  // ── Games ─────────────────────────────────────────────────
  for (const g of GAMES) {
    const categoryId = catId.get(g.categorySlug);
    if (!categoryId) {
      console.warn(`⚠️  game "${g.slug}": unknown category "${g.categorySlug}" — skipped`);
      continue;
    }
    await prisma.game.upsert({
      where: { slug: g.slug },
      update: {}, // create-if-missing only
      create: {
        slug: g.slug,
        title: g.title,
        titleVi: g.titleVi,
        description: g.description,
        descriptionVi: g.descriptionVi,
        longDescription: g.longDescription ?? null,
        controls: g.controls,
        controlsVi: g.controlsVi,
        categoryId,
        difficulty: g.difficulty,
        status: g.status,
        kind: g.kind,
        componentKey: g.componentKey ?? null,
        iframeSrc: g.iframeSrc ?? null,
        featured: g.featured,
        sortOrder: g.sortOrder,
        estimatedTime: g.estimatedTime,
        techStack: g.techStack,
        tags: g.tags,
        coverImage: g.coverImage ?? null,
      },
    });
  }

  // Kích hoạt game từng là COMING_SOON khi nay đã có component (05/10/2026: Sudoku).
  // CHỈ đụng dòng còn nguyên như seed gốc (chưa có componentKey) — admin đã chỉnh thì thôi.
  const KICH_HOAT: Record<string, { componentKey: string; coverImage: string }> = {
    sudoku: { componentKey: 'sudoku', coverImage: 'https://cuongthai.com/games/covers/sudoku.svg' },
  };
  for (const [slug, v] of Object.entries(KICH_HOAT)) {
    await prisma.game.updateMany({
      where: { slug, status: 'COMING_SOON', componentKey: null },
      data: { status: 'PUBLISHED', componentKey: v.componentKey, coverImage: v.coverImage, sortOrder: 5 },
    });
  }

  console.log(`✅ Games seeded (${CATEGORIES.length} categories, ${GAMES.length} games)`);
}
