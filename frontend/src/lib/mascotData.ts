/**
 * My Language — mascot cast, dialogue and casting rules.
 *
 * Pure data + pure functions, no React: the components in
 * components/language/mascot/ render this, and nothing here knows about them.
 *
 * The art is five pandas in different roles (see /public/mascots/). Only Bíp has
 * emotion-specific drawings — bip-sad.png, bip-wow.png — so getMascotImage()
 * falls back to a mascot's single default image and lets motion carry the mood.
 * That is why Bíp does the emotional heavy lifting in pickMascot(): it is the
 * one that can actually change its face.
 */

export type MascotId = 'bip' | 'sensei' | 'zippy' | 'grumpy' | 'sage';

/** 'wow' is kept from the pre-PNG mascots: the hanzi screen fires it on a
 *  first-try clean write, and bip-wow.png exists to serve it. */
export type Emotion = 'happy' | 'cheer' | 'think' | 'sad' | 'wow';

export type Context =
  | 'welcome'   // landing on a page
  | 'lesson'    // explaining / mid-lesson
  | 'correct'   // one right answer
  | 'wrong'     // one wrong answer
  | 'manyWrong' // struggling on a streak of misses
  | 'streak'    // day streak / combo
  | 'levelUp'   // finished a level or crown
  | 'comeback'  // hasn't practised in a while
  | 'done';     // daily goal complete

export interface MascotMeta {
  name: string;
  role: string;
  /** Theme-independent accent for bubbles and rings. */
  color: string;
}

export const MASCOTS: Record<MascotId, MascotMeta> = {
  bip: { name: 'Bíp', role: 'Bạn đồng hành', color: '#f59e0b' },
  sensei: { name: 'Sensei', role: 'Thầy giáo', color: '#8b5cf6' },
  zippy: { name: 'Zippy', role: 'Cổ vũ viên', color: '#22d3ee' },
  grumpy: { name: 'Gấu Lười', role: 'Ngủ quên', color: '#94a3b8' },
  sage: { name: 'Sage', role: 'Bậc thầy', color: '#eab308' },
};

export const MASCOT_IDS = Object.keys(MASCOTS) as MascotId[];

// ─── Dialogue ────────────────────────────────────────────────────
// Written per mascot so each one sounds like itself: Sensei explains, Zippy
// shouts, Sage weighs in rarely, Gấu Lười is half asleep, Bíp is the friend.
const LINES: Record<MascotId, Record<Emotion, string[]>> = {
  bip: {
    happy: ['Học tiếp nào! 🐼', 'Hôm nay học gì đây?', 'Mình sẵn sàng rồi nè!', 'Bắt đầu thôi!'],
    cheer: ['Tuyệt vời! 🎉', 'Giỏi quá đi!', 'Chuẩn không cần chỉnh!', 'Yeahhh, đúng rồi!'],
    think: ['Để mình nghĩ chút…', 'Câu này hơi khó ha?', 'Từ từ, đừng vội nhé.'],
    sad: ['Không sao, thử lại nhé!', 'Suýt đúng rồi, tiếc ghê!', 'Sai một lần, nhớ mười lần!', 'Đừng buồn, mình học tiếp nha!'],
    wow: ['Ối, đúng ngay lần đầu! 😲', 'Wow, bạn nhớ nhanh thật!', 'Không tin nổi luôn!'],
  },
  sensei: {
    happy: ['Bắt đầu bài học nào.', 'Chuẩn bị tinh thần chưa?', 'Học chậm mà chắc nhé.'],
    cheer: ['Rất tốt! Tiến bộ rõ rệt.', 'Đúng rồi đấy, nhớ kỹ nhé.', 'Khá lắm!'],
    think: ['Nhìn kỹ bộ thủ xem nào.', 'Gợi ý: tách chữ ra từng phần.', 'Đọc lại một lượt nữa nhé.', 'Chú ý thứ tự nét.'],
    sad: ['Sai chỗ này là bình thường.', 'Làm lại lần nữa, chậm thôi.', 'Không hiểu chỗ nào, hỏi thầy nhé.'],
    wow: ['Ồ, khá đấy!', 'Nhanh hơn thầy nghĩ.'],
  },
  zippy: {
    happy: ['Lets goooo! ⚡', 'Nào nào, chiến thôi!', 'Năng lượng đầy bình! 🔋'],
    cheer: ['ĐỈNH CỦA CHÓP! 🔥', 'Không cản nổi luôn!', 'Cháy quá cháy! ⚡', 'Bạn ngầu thật đấy!'],
    think: ['Nghĩ nhanh lên nào! 💨', 'Sắp ra rồi, cố lên!'],
    sad: ['Ơ kìa, đứng dậy đi!', 'Thua keo này bày keo khác!', 'Cố lên, sắp được rồi mà!'],
    wow: ['WOOOO! 🤯', 'Cái gì cơ?! Đỉnh vậy!'],
  },
  grumpy: {
    happy: ['Zzz… ơ, bạn quay lại rồi à?', 'Ngáp… học tiếp hả?', 'Mình ngủ quên mất… 😴'],
    cheer: ['Ồ… giỏi đấy. Zzz…', 'Ừ, được… mình ngủ tiếp đây.'],
    think: ['Zzz… nghĩ đi, mình chờ…', 'Ngủ một giấc rồi nghĩ tiếp?'],
    sad: ['Thôi nghỉ chút đi… Zzz', 'Học nhiều quá cũng mệt mà.'],
    wow: ['Ơ?! Tỉnh cả ngủ! 😳'],
  },
  sage: {
    happy: ['Con đường vạn dặm bắt đầu từ một bước.', 'Mỗi ngày một chút, là đủ.'],
    cheer: ['Xuất sắc! Ta tự hào về con. 👑', 'Con đã lên một tầm cao mới! ⭐', 'Công phu đã thành!'],
    think: ['Kiên nhẫn. Chữ khó mới đáng nhớ.', 'Ngẫm kỹ, rồi sẽ thông.'],
    sad: ['Vấp ngã là một phần của đạo.', 'Người giỏi cũng từng sai chỗ này.'],
    wow: ['Hiếm ai làm được vậy! ✨'],
  },
};

/** Contexts that always want the same mascot, because only that one fits. */
const CAST: Record<Context, { mascot: MascotId; emotion: Emotion }> = {
  welcome: { mascot: 'bip', emotion: 'happy' },
  lesson: { mascot: 'sensei', emotion: 'think' },
  correct: { mascot: 'bip', emotion: 'cheer' },
  // Bíp is the only mascot with a sad drawing, so it takes the misses: a
  // grinning panda over "sai rồi" reads as mockery.
  wrong: { mascot: 'bip', emotion: 'sad' },
  manyWrong: { mascot: 'sensei', emotion: 'think' },
  streak: { mascot: 'zippy', emotion: 'cheer' },
  levelUp: { mascot: 'sage', emotion: 'cheer' },
  // The art is a panda asleep under a pile of Zzz — perfect for "you've been
  // gone a while", and nowhere else.
  comeback: { mascot: 'grumpy', emotion: 'happy' },
  done: { mascot: 'sage', emotion: 'cheer' },
};

export function pickMascot(context: Context): { mascot: MascotId; emotion: Emotion } {
  return CAST[context] ?? CAST.welcome;
}

/** Stable string → int hash, so the same lesson keeps the same line instead of
 *  reshuffling on every re-render. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * A line for this mascot + emotion.
 *
 * `seed` keeps it deterministic (same seed → same line). Without one it is
 * random, which is fine for one-shot reactions but must not be called during
 * render of a component that re-renders — the text would flicker.
 */
export function getLine(mascot: MascotId, emotion: Emotion, seed?: string | number): string {
  const bank = LINES[mascot]?.[emotion] ?? LINES[mascot]?.happy ?? LINES.bip.happy;
  if (!bank.length) return '';
  const i = seed === undefined
    ? Math.floor(Math.random() * bank.length)
    : (typeof seed === 'number' ? Math.abs(Math.floor(seed)) : hash(seed)) % bank.length;
  return bank[i];
}

/** Only Bíp is drawn per-emotion; everyone else has one image. */
const HAS_EMOTION_ART: Partial<Record<MascotId, Partial<Record<Emotion, string>>>> = {
  bip: { sad: 'bip-sad', wow: 'bip-wow' },
};

export function getMascotImage(mascot: MascotId, emotion: Emotion = 'happy'): string {
  const special = HAS_EMOTION_ART[mascot]?.[emotion];
  return `/mascots/${special ?? mascot}.png`;
}

export function mascotName(mascot: MascotId): string {
  return MASCOTS[mascot]?.name ?? MASCOTS.bip.name;
}

/** Rotates daily so the cast takes turns; seedable for per-lesson stability. */
export function dailyMascot(seed?: string): MascotId {
  const n = seed ? hash(seed) : Math.floor(Date.now() / 86_400_000);
  return MASCOT_IDS[n % MASCOT_IDS.length];
}
