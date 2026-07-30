/**
 * Deep Dive #2 — the event loop, callbacks, promises, async/await.
 *
 * Prose lives in the sibling `.md` (same reason as Deep Dive #1: dozens of
 * fenced code blocks, and every backtick in a template literal would need
 * escaping).
 *
 * Every output block in the body is real output from a real run — Node 22.21
 * on macOS, plus a WebKit browser for the browser-only parts. Two runs
 * contradicted the draft and changed what the article says:
 *   1. `process.nextTick` vs `Promise.then` ordering FLIPS between CommonJS
 *      and ESM (the module body of an .mjs is itself a promise job). Almost
 *      every article on this topic states the nextTick-first rule unqualified.
 *   2. Measuring timers in a hidden tab is worthless — requestAnimationFrame
 *      never fires at all and setTimeout gaps blow out to 700ms. A paragraph
 *      about MessageChannel vs setTimeout was cut because the numbers behind
 *      it came from a hidden tab.
 * If you edit a code block, RUN it again — the surrounding prose quotes
 * specific millisecond numbers from these exact snippets.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./the-event-loop-callbacks-promises-and-async-await.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'the-event-loop-callbacks-promises-and-async-await',
  title: 'The Event Loop, Callbacks, Promises and Async/Await',
  summary:
    'How JavaScript stays responsive on one thread — the call stack, who does the waiting, tasks versus microtasks, and what await actually does. With every ordering claim run rather than asserted, including the one that flips between CommonJS and ES modules.',
  category: 'DeepDive',
  tags: ['javascript', 'event-loop', 'async-await', 'promises', 'nodejs', 'performance'],
  coverEmoji: '🔄',
  coverImageUrl: '/deepdives/event-loop/one-turn.svg',
  readTimeMin: 26,
  isFeatured: false,
  trendingScore: 72,
  status: 'PUBLISHED',
  bodyMdx,
};
