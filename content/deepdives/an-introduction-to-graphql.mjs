/**
 * Deep Dive #3 — GraphQL.
 *
 * Prose in the sibling `.md` (same reason as #1 and #2: dozens of fenced code
 * blocks, and template-literal backticks would all need escaping).
 *
 * Every query, error and count in the body was executed against a real schema
 * with `graphql` 16.14 + `dataloader` 2.2 (installed in a scratch directory —
 * deliberately NOT added to this repo's package.json, since the site itself
 * serves REST and has no GraphQL dependency). The measured claims:
 *   · REST 3 round trips / 3062 bytes vs GraphQL 1 / 478 bytes for one screen
 *   · N+1: 5 author lookups for 5 posts, 1 with a DataLoader
 *   · non-null `profile: Profile!` failing nulls the whole `user`; the same
 *     failure on a nullable field only nulls that field (this is the diagram)
 *   · a 15-line depth-limit validation rule rejecting a 5-deep query
 * If you edit a code block, re-run it — the prose quotes these outputs exactly.
 *
 * The "when not to use it" section says plainly that this site serves ~40
 * modules over REST and that this was the right call. Keep that honesty if you
 * revise the article: an introduction that only sells is what makes readers
 * distrust the rest of it.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./an-introduction-to-graphql.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'an-introduction-to-graphql',
  title: 'An Introduction to GraphQL',
  summary:
    'What GraphQL actually is — a typed contract plus client-chosen response shapes — and what it costs you: resolver trees, the N+1 problem, nullability as a blast radius, and the HTTP caching you give up. With every query run against a real schema, including the numbers.',
  category: 'DeepDive',
  tags: ['graphql', 'api-design', 'rest', 'dataloader', 'backend'],
  coverEmoji: '◈',
  coverImageUrl: '/deepdives/graphql/one-request-many-shapes.svg',
  readTimeMin: 24,
  isFeatured: false,
  trendingScore: 68,
  status: 'PUBLISHED',
  bodyMdx,
};
