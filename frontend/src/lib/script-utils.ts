// script-utils.ts — parsing and pacing maths for the Script tab.
//
// Split out of ScriptTab.tsx so the Teleprompter can reuse the
// exact same section parsing. When the two disagreed about what
// counts as a section, the teleprompter's progress bar drifted
// from the outline the user had just written.

/**
 * Spoken words per minute, used for every duration estimate in
 * the studio.
 *
 * 150 wpm is the conversational-presentation rate. Audiobook
 * narration sits near 155, and confident lecturing runs a little
 * slower than chat because of pauses for the audience to read
 * code on screen. It is deliberately a single constant rather
 * than a per-user setting: the number's job is to catch a script
 * that is twice as long as its slot, and it does that at any
 * plausible rate.
 */
export const WORDS_PER_MINUTE = 150;

export interface ScriptSection {
  /** Heading text with the leading `##` and whitespace stripped. */
  title: string;
  /** 0-based line index of the heading — used to scroll the
   *  textarea to this section. */
  lineIndex: number;
  /** Character offset of the heading within the full script —
   *  used to place the caret. */
  charIndex: number;
  /** Words in this section's BODY (the heading itself excluded,
   *  since nobody reads "## Intro" aloud). */
  words: number;
  /** Estimated spoken seconds at WORDS_PER_MINUTE. */
  seconds: number;
}

export function countWords(text: string | null | undefined): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Split a script into `##` sections.
 *
 * Only `##` counts — a single `#` is treated as the document
 * title and `###` as a sub-point, so neither clutters the
 * outline. Text before the first `##` belongs to no section and
 * is intentionally not reported: it is almost always a note to
 * self, not spoken content.
 *
 * HTML comments (`<!-- … -->`) are stripped before counting, so
 * the instructional notes built into the templates never inflate
 * the word budget.
 */
export function parseOutline(script: string | null | undefined): ScriptSection[] {
  if (!script) return [];

  const lines = script.split('\n');
  const sections: ScriptSection[] = [];

  // Char offset of the start of each line, so a section can map
  // back to a caret position without re-scanning the string.
  let offset = 0;
  const lineOffsets: number[] = [];
  for (const line of lines) {
    lineOffsets.push(offset);
    offset += line.length + 1; // +1 for the newline
  }

  const headingIdx: number[] = [];
  lines.forEach((line, i) => {
    if (/^##\s+\S/.test(line) && !line.startsWith('###')) headingIdx.push(i);
  });

  headingIdx.forEach((start, n) => {
    const end = n + 1 < headingIdx.length ? headingIdx[n + 1] : lines.length;
    const bodyRaw = lines.slice(start + 1, end).join('\n');
    const body = stripComments(bodyRaw);
    const words = countWords(body);
    sections.push({
      title: lines[start].replace(/^##\s+/, '').trim(),
      lineIndex: start,
      charIndex: lineOffsets[start],
      words,
      seconds: Math.round((words / WORDS_PER_MINUTE) * 60),
    });
  });

  return sections;
}

/** Remove `<!-- … -->` blocks. Template guidance lives in these,
 *  and it is never spoken. */
export function stripComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, ' ');
}

/** Words that fit in `seconds` of speech. */
export function wordBudgetFor(seconds: number): number {
  return Math.round((seconds / 60) * WORDS_PER_MINUTE);
}

/** Spoken seconds for a word count. */
export function secondsForWords(words: number): number {
  return Math.round((words / WORDS_PER_MINUTE) * 60);
}

/** `m:ss`. Used for section timings and the teleprompter clock. */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

/**
 * Everything the Script tab's stats footer and budget meter need,
 * derived in one pass so the two can never disagree.
 *
 * `spokenWords` excludes HTML comments; `words` does not. The
 * footer shows the raw count (what you typed) while the budget
 * uses the spoken count (what the audience hears) — a template
 * full of guidance comments would otherwise look 200 words over
 * budget the moment it was applied.
 */
export function scriptStats(script: string | null | undefined, targetSeconds: number | null) {
  const value = script ?? '';
  const words = countWords(value);
  const spokenWords = countWords(stripComments(value));
  const sections = parseOutline(value);

  const budget = targetSeconds && targetSeconds > 0 ? wordBudgetFor(targetSeconds) : null;

  return {
    words,
    spokenWords,
    lines: value === '' ? 0 : value.split('\n').length,
    chars: value.length,
    /** Estimated runtime of the spoken content. */
    estimatedSeconds: secondsForWords(spokenWords),
    sections,
    budget,
    /** null when no target is set. Positive = over budget. */
    overBy: budget == null ? null : spokenWords - budget,
    /** 0..1+ — drives the budget meter's fill width. */
    budgetRatio: budget == null || budget === 0 ? null : spokenWords / budget,
  };
}
