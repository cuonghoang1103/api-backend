// aiWriteTemplates.ts — Phase 5 home upgrade.
//
// Template-based AI Write starter strings for the post composer.
// No LLM call (zero cost, zero latency, zero PII risk) but the
// output is still contextual: we pick from a bank of openers that
// match the visible UI context (e.g. "ask a question" templates
// vs "share progress" templates).
//
// Picking strategy: weight by what's *useful* not what's uniform.
// We bias toward templates that nudge the user toward longer-form
// content (questions, progress, opinion) since the empty composer
// most often dies at "I don't know what to write".
//
// Each template is a single sentence stub — the user is expected
// to keep typing after it. We deliberately do NOT pad with fake
// paragraphs (that would feel like AI spam).

export interface AiTemplate {
  emoji: string;
  text: string;
  /** Tag so the button label can hint at the category. */
  category: 'share' | 'ask' | 'learn' | 'goal' | 'thought';
}

export const AI_WRITE_TEMPLATES: ReadonlyArray<AiTemplate> = [
  // ─── Share (hôm nay mình…) ─────────────────────────────────
  { emoji: '✨', text: 'Hôm nay mình vừa học được điều thú vị — ', category: 'share' },
  { emoji: '🚀', text: 'Vừa hoàn thành một bước nhỏ: ', category: 'share' },
  { emoji: '📦', text: 'Mình vừa build xong ', category: 'share' },
  { emoji: '🛠️', text: 'Đang đào sâu về ', category: 'share' },

  // ─── Ask (câu hỏi…) ───────────────────────────────────────
  { emoji: '💡', text: 'Câu hỏi cho mọi người: ', category: 'ask' },
  { emoji: '🤔', text: 'Ai từng gặp vụ này chưa — ', category: 'ask' },
  { emoji: '❓', text: 'Mọi người giải quyết sao khi ', category: 'ask' },

  // ─── Learn (đang học…) ───────────────────────────────────
  { emoji: '📚', text: 'Đang học về ', category: 'learn' },
  { emoji: '🧠', text: 'Hôm nay mình nhớ được 3 thứ: ', category: 'learn' },
  { emoji: '🔍', text: 'Vừa đọc xong một bài hay về ', category: 'learn' },

  // ─── Goal (mục tiêu…) ────────────────────────────────────
  { emoji: '🎯', text: 'Mục tiêu tuần này của mình là ', category: 'goal' },
  { emoji: '✅', text: 'Tick ✅ hôm nay: ', category: 'goal' },

  // ─── Thought (suy nghĩ…) ──────────────────────────────────
  { emoji: '💭', text: 'Mình đang nghĩ về ', category: 'thought' },
  { emoji: '🌱', text: 'Một điều nhỏ mình thay đổi gần đây: ', category: 'thought' },
  { emoji: '🪴', text: 'Điều mình muốn cải thiện trong tháng này: ', category: 'thought' },
];

/**
 * Pick a template at random. We avoid returning the same template
 * twice in a row (the user often clicks the button multiple times
 * to compare options) by tracking the last-picked index in a
 * tiny localStorage slot.
 */
const LAST_PICKED_KEY = 'cuongthai:ai-write:last-picked';

export function pickAiTemplate(): AiTemplate {
  if (typeof window === 'undefined') {
    return AI_WRITE_TEMPLATES[0];
  }
  const lastIdxRaw = window.localStorage.getItem(LAST_PICKED_KEY);
  const lastIdx = lastIdxRaw != null ? parseInt(lastIdxRaw, 10) : -1;

  // Pick any index except the last one. If somehow the last index is
  // out of range (template list shrunk), fall back to fully random.
  let nextIdx: number;
  if (Number.isInteger(lastIdx) && lastIdx >= 0 && lastIdx < AI_WRITE_TEMPLATES.length) {
    do {
      nextIdx = Math.floor(Math.random() * AI_WRITE_TEMPLATES.length);
    } while (nextIdx === lastIdx && AI_WRITE_TEMPLATES.length > 1);
  } else {
    nextIdx = Math.floor(Math.random() * AI_WRITE_TEMPLATES.length);
  }

  try {
    window.localStorage.setItem(LAST_PICKED_KEY, String(nextIdx));
  } catch {
    // localStorage disabled — fine, we just won't remember.
  }
  return AI_WRITE_TEMPLATES[nextIdx];
}
