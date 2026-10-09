/**
 * CTW K-3b — chuyển nội dung trang Docs giữa JSON TipTap và Yjs (thuần, không DB — test bằng `npm test`).
 * Lược đồ: collabSchema.ts (khớp từng thuộc tính với RichEditor chế độ docs).
 */

import { TiptapTransformer } from '@hocuspocus/transformer';
import { updateYFragment } from 'y-prosemirror';
import { Node as PmNode } from '@tiptap/pm/model';
import * as Y from 'yjs';
import { collabExtensions, collabSchema } from './collabSchema.js';
import type { PmJson } from './collabRules.js';

export const EMPTY_DOC: PmJson = { type: 'doc', content: [{ type: 'paragraph' }] };

export function seedDoc(json: unknown, title: string): Y.Doc {
  const doc = TiptapTransformer.toYdoc(normalizeDoc(json), 'default', collabExtensions);
  doc.getMap('metadata').set('title', title);
  return doc;
}

export function docJson(doc: Y.Doc): PmJson {
  const j = TiptapTransformer.fromYdoc(doc, 'default') as PmJson;
  return j && j.type === 'doc' ? j : { ...EMPTY_DOC };
}

export function normalizeDoc(json: unknown): PmJson {
  const d = json as PmJson | null;
  if (!d || typeof d !== 'object' || d.type !== 'doc' || !Array.isArray(d.content) || !d.content.length) return { ...EMPTY_DOC };
  return d;
}

/** Ghi `json` vào fragment bằng DIFF (giữ nguyên danh tính Yjs của khối không đổi ⇒ con trỏ/bản offline không vỡ). */
export function writeJsonInto(doc: Y.Doc, json: unknown) {
  const node = PmNode.fromJSON(collabSchema(), normalizeDoc(json));
  updateYFragment(doc, doc.getXmlFragment('default'), node, { mapping: new Map(), isOMark: new Map() } as never);
}

