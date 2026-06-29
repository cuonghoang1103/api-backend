// TabIndent — notepad-style Tab handling for the note editor.
//
// Goal: pressing Tab inserts a fixed 8-space indent AT THE CARET so the
// user can push text toward the middle of a line, exactly like a plain
// text editor. It must ONLY affect the caret position — never re-indent
// or shift other lines / existing content.
//
// Conflict handling (lists / tasks / tables):
//   Tiptap's StarterKit listItem, TaskItem and Table extensions already
//   bind Tab (indent a list item / move to the next cell). We KEEP that:
//   when the caret is inside a list item, task item or table, this
//   handler returns false so the native behaviour runs. Tab only inserts
//   spaces in ordinary paragraphs / headings / code blocks.
//
// Why non-breaking spaces in prose: `.note-prose p` uses the default
// `white-space: normal`, which collapses runs of regular spaces — so 8
// plain spaces would render as one and produce no visible indent. We
// insert 8 NBSPs in prose (visible, non-collapsing) and 8 regular spaces
// inside code blocks (where <pre> preserves whitespace and NBSP would be
// out of place).

import { Extension } from '@tiptap/core';

const TAB_WIDTH = 8;            // columns per tab stop
const NBSP = '\u00A0';         // prose: regular spaces collapse, NBSP doesn't
const SPACE = ' ';             // code blocks: <pre> preserves plain spaces

export const TabIndent = Extension.create({
  name: 'tabIndent',
  // Run before the list/task Tab bindings so we get first refusal; we
  // return false inside lists/tables to defer to their native handlers.
  priority: 1000,

  addKeyboardShortcuts() {
    const deferToNative = () =>
      this.editor.isActive('listItem') ||
      this.editor.isActive('taskItem') ||
      this.editor.isActive('table');

    return {
      Tab: () => {
        if (deferToNative()) return false;

        // Column-aware Tab: advance to the NEXT tab stop (a multiple of
        // TAB_WIDTH) relative to the caret's current column, instead of
        // always inserting 8 spaces. This makes rows line up — e.g. `from`
        // (col 4) and `to` (col 2) both jump to column 8, so the text that
        // follows them aligns vertically, like Tab in a text/code editor.
        const { state } = this.editor;
        const { from, $from } = state.selection;
        // Text from the start of this text block to the caret; hard breaks
        // render as '\n', so the column is measured from the last line break.
        const before = state.doc.textBetween($from.start(), from, '\n', '\0');
        const lastBreak = before.lastIndexOf('\n');
        const col = before.length - (lastBreak + 1);
        const count = TAB_WIDTH - (col % TAB_WIDTH); // 1..TAB_WIDTH (never 0)

        const ch = this.editor.isActive('codeBlock') ? SPACE : NBSP;
        // insertContent at the caret only — never touches other nodes.
        return this.editor.commands.insertContent(ch.repeat(count));
      },

      'Shift-Tab': () => {
        if (deferToNative()) return false;
        const { state } = this.editor;
        const sel = state.selection;
        if (!sel.empty) return true; // swallow Tab; don't disturb a range
        const { from } = sel;
        const start = sel.$from.start();
        // Look at the text immediately before the caret in this text
        // block and strip up to 8 trailing spaces / NBSPs.
        const before = state.doc.textBetween(start, from, '\n', '\0');
        const match = before.match(/[ \u00A0]{1,8}$/);
        if (!match) return true; // nothing to remove — keep focus in editor
        const len = match[0].length;
        return this.editor.chain().focus().deleteRange({ from: from - len, to: from }).run();
      },
    };
  },
});

export default TabIndent;
