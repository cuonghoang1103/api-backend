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

  console.log(`✅ Games seeded (${CATEGORIES.length} categories, ${GAMES.length} games)`);
}
