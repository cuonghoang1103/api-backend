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

const NBSP_INDENT = '\u00A0'.repeat(8); // 8 non-breaking spaces
const PLAIN_INDENT = ' '.repeat(8);     // 8 regular spaces (code blocks)

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
        const indent = this.editor.isActive('codeBlock') ? PLAIN_INDENT : NBSP_INDENT;
        // insertContent at the caret only — never touches other nodes.
        return this.editor.commands.insertContent(indent);
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
