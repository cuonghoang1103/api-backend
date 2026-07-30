/**
 * Deep Dive #1 — the command line.
 *
 * The prose lives in the sibling `.md` file rather than a template literal in
 * here: the guide is ~70 fenced code blocks, and every backtick in a template
 * literal would need escaping. Markdown in a .md file is also what any editor,
 * diff and reviewer expects to see.
 *
 * Seed it with:
 *   node scripts/deepdive-seed.mjs --file ./content/deepdives/how-to-use-the-command-line-in-linux-and-macos.mjs --dry
 *   node scripts/deepdive-seed.mjs --file ./content/deepdives/how-to-use-the-command-line-in-linux-and-macos.mjs --apply
 *
 * Every command in the body was run before it was written down — on macOS 26
 * (BSD userland) and, for the platform-difference table, inside a
 * debian:bookworm-slim container (GNU userland). If you edit a command here,
 * run it first: several claims in the earlier draft were wrong in ways that
 * only running them revealed (BSD `sed -i`'s error text depends on the
 * filename; `!$` does not work within a single line).
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./how-to-use-the-command-line-in-linux-and-macos.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'how-to-use-the-command-line-in-linux-and-macos',
  title: 'How to Use the Command Line in Linux and macOS',
  summary:
    'A complete beginner-to-competent guide to the shell: paths, permissions, pipes, processes, your shell config, and a backup script with the four lines of ceremony that separate a script that fails loudly from one that fails silently. Every command verified on both macOS (BSD) and Linux (GNU).',
  category: 'DeepDive',
  tags: ['command-line', 'bash', 'zsh', 'macos', 'linux', 'shell-scripting'],
  coverEmoji: '⌨️',
  // Diagrams are self-hosted SVG under frontend/public/deepdives/command-line/
  // because the site's CSP is `img-src 'self' data:` — a remote image is not a
  // broken link, it is a blocked request.
  coverImageUrl: '/deepdives/command-line/anatomy-of-the-prompt.svg',
  readTimeMin: 28,
  isFeatured: true,
  trendingScore: 75,
  status: 'PUBLISHED',
  bodyMdx,
};
