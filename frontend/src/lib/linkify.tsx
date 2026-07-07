import React from 'react';

/**
 * Turn user-generated plain text into React nodes where URLs become
 * clickable <a> links (Facebook-style: blue + underlined, opens in a
 * new tab). Optionally also styles @mentions.
 *
 * Used by every surface that renders user text: feed posts, feed
 * comments, video comments and Messenger messages — so links behave
 * consistently everywhere.
 *
 * Matches:
 *   - http:// and https:// URLs
 *   - bare www. domains (prefixed with https:// on click)
 *   - @mentions (only styled when opts.mentions is true)
 */

// One pass tokenizer: a URL OR an @mention. The URL branch grabs
// everything up to whitespace / '<'; trailing punctuation is trimmed
// afterwards by stripTrailing so "see https://x.com." doesn't eat the
// period. The 'u' flag is required for the \p{L}\p{N} mention class.
const TOKEN_RE = /((?:https?:\/\/|www\.)[^\s<]+)|(@[\p{L}\p{N}_.]{1,30})/giu;

// Trailing chars that are almost never part of a URL.
const TRAILING = /[.,;:!?)\]}'"»…]+$/;

function stripTrailing(url: string): { core: string; trail: string } {
  const m = url.match(TRAILING);
  if (!m) return { core: url, trail: '' };
  let trail = m[0];
  let core = url.slice(0, url.length - trail.length);
  // Keep a closing paren when the URL has an unmatched opening one
  // (e.g. Wikipedia "...(disambiguation)" links).
  const opens = (core.match(/\(/g) ?? []).length;
  const closes = (core.match(/\)/g) ?? []).length;
  if (trail.includes(')') && opens > closes) {
    core += ')';
    trail = trail.replace(')', '');
  }
  return { core, trail };
}

const DEFAULT_LINK_CLASS =
  'font-medium underline decoration-1 underline-offset-2 break-all hover:opacity-80';

export interface LinkifyOptions {
  /** Also visually mark @mentions (feed comments). Default false. */
  mentions?: boolean;
  /** Override link classes (e.g. add `text-white` inside sent chat bubbles). */
  linkClassName?: string;
  /** Inline link style. Defaults to a blue readable on light + dark. */
  linkStyle?: React.CSSProperties;
  /** Class for @mention spans. */
  mentionClassName?: string;
}

export function linkifyToNodes(
  text: string | null | undefined,
  opts: LinkifyOptions = {},
): React.ReactNode[] {
  const raw = text ?? '';
  const {
    mentions = false,
    linkClassName = DEFAULT_LINK_CLASS,
    linkStyle = { color: '#3b82f6' },
    mentionClassName = 'text-violet-300 font-medium',
  } = opts;

  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((m = TOKEN_RE.exec(raw)) !== null) {
    const full = m[0];
    const url = m[1];
    const mention = m[2];

    if (m.index > last) nodes.push(raw.slice(last, m.index));

    if (url) {
      const { core, trail } = stripTrailing(url);
      const href = core.startsWith('http') ? core : `https://${core}`;
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          // Stop the click from bubbling to card/post open handlers.
          onClick={(e) => e.stopPropagation()}
          className={linkClassName}
          style={linkStyle}
        >
          {core}
        </a>,
      );
      if (trail) nodes.push(trail);
    } else if (mention) {
      nodes.push(
        mentions ? (
          <span key={key++} className={mentionClassName}>
            {mention}
          </span>
        ) : (
          mention
        ),
      );
    }

    last = m.index + full.length;
  }

  if (last < raw.length) nodes.push(raw.slice(last));
  return nodes;
}
