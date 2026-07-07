'use client';
/**
 * My Language — Alphabet (Bảng chữ cái) section page.
 * Professional kana chart: a collapsible accordion with top-level sections
 * (Hiragana / Katakana / Kanji / special marks), each holding selectable
 * sub-tables rendered as a vowel-aligned gojūon grid (KanaGrid).
 * Theme-aware (CSS vars, never `dark:`); neon accents; mobile-first.
 */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Type, Eye, EyeOff, Dumbbell, ChevronDown } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { AlphabetGroup } from '@/types/language';
import {
  SectionShell,
  Chip,
  EmptyState,
  CardsSkeleton,
  usePrefersReducedMotion,
} from '@/components/language/primitives';
import KanaGrid, { type KanaMode } from '@/components/language/kana/KanaGrid';

// ─── Grouping model ──────────────────────────────────────────────
interface ChildGroup {
  group: AlphabetGroup;
  subLabel: string;
  mode: KanaMode;
}
interface ParentSection {
  key: string;
  label: string;
  children: ChildGroup[];
}

/** Which top-level section a DB group belongs to, by name prefix. */
function parentOf(name: string): { key: string; label: string; priority: number } {
  if (name.startsWith('Hiragana')) return { key: 'hiragana', label: 'Hiragana', priority: 0 };
  if (name.startsWith('Katakana')) return { key: 'katakana', label: 'Katakana', priority: 1 };
  if (name.startsWith('Kanji')) return { key: 'kanji', label: 'Kanji', priority: 2 };
  if (name.startsWith('Ký hiệu')) return { key: 'special', label: 'Ký hiệu đặc biệt', priority: 3 };
  // Unknown group (non-JA languages) → its own section, keeps them working.
  return { key: `other:${name}`, label: name, priority: 10 };
}

/** Short chip label: the part after "– " if present, else "Cơ bản". */
function subLabelOf(name: string): string {
  const idx = name.indexOf('– ');
  if (idx >= 0) return name.slice(idx + 2).trim();
  return 'Cơ bản';
}

/** KanaGrid rendering mode for a group. Vowel-aligned gojūon columns are a
 * kana-specific layout — every other language (EN A–Z/IPA, ZH pinyin…) gets
 * the plain wrapped `flat` grid. */
function modeOf(name: string, code: string): KanaMode {
  if (code !== 'ja') return 'flat';
  if (name.includes('ghép') || name.includes('Yōon')) return 'yoon';
  if (name.includes('Ký hiệu') || name.includes('đặc biệt')) return 'flat';
  if (name.startsWith('Kanji')) return 'flat';
  return 'gojuon';
}

function buildSections(groups: AlphabetGroup[], code: string): ParentSection[] {
  const byKey = new Map<string, { section: ParentSection; priority: number }>();
  for (const group of groups) {
    const p = parentOf(group.name);
    let entry = byKey.get(p.key);
    if (!entry) {
      entry = { section: { key: p.key, label: p.label, children: [] }, priority: p.priority };
      byKey.set(p.key, entry);
    }
    entry.section.children.push({
      group,
      subLabel: subLabelOf(group.name),
      mode: modeOf(group.name, code),
    });
  }
  return [...byKey.values()].sort((a, b) => a.priority - b.priority).map((e) => e.section);
}

// ─── Page ────────────────────────────────────────────────────────
export default function AlphabetPage() {
  const code = String(useParams().code);
  const reduced = usePrefersReducedMotion();

  const [groups, setGroups] = useState<AlphabetGroup[] | null>(null);
  const [hideRomaji, setHideRomaji] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Selected sub-board PER section (key → groupId) so several sections can be
  // open — each showing its own board — at the same time. Sections without an
  // entry fall back to their first board, so an opened section always renders.
  const [activeBoard, setActiveBoard] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    languageApi
      .alphabet(code)
      .then((res) => {
        if (!alive) return;
        const data = res.data.data ?? [];
        setGroups(data);
        const sections = buildSections(data, code);
        const first = sections[0];
        if (first) setExpanded(new Set([first.key]));
      })
      .catch(() => {
        if (alive) setGroups([]);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  const sections = useMemo(() => (groups ? buildSections(groups, code) : []), [groups, code]);

  const toggleParent = (section: ParentSection) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(section.key)) next.delete(section.key);
      else next.add(section.key);
      return next;
    });
  };

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      {/* The practice engine is kana↔romaji typing — only meaningful for ja. */}
      {code === 'ja' && (
        <Link
          href={`/language/${code}/alphabet/practice`}
          className="inline-flex items-center gap-1.5 rounded-full bg-neon-gradient px-3.5 py-1.5 text-sm font-semibold text-white shadow-neon transition hover:opacity-95"
        >
          <Dumbbell size={16} /> Luyện tập
        </Link>
      )}
      <button
        type="button"
        onClick={() => setHideRomaji((v) => !v)}
        aria-pressed={hideRomaji}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
          hideRomaji
            ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40'
            : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
        }`}
      >
        {hideRomaji ? <EyeOff size={16} /> : <Eye size={16} />}
        Ẩn phiên âm
      </button>
    </div>
  );

  return (
    <SectionShell code={code} title="Bảng chữ cái" icon={<Type />} section="Bảng chữ cái" right={toolbar}>
      {groups === null ? (
        <CardsSkeleton count={8} />
      ) : sections.length === 0 ? (
        <EmptyState
          emoji="🈳"
          title="Chưa có bảng chữ cái"
          hint="Nội dung bảng chữ cái cho ngôn ngữ này sẽ sớm được thêm."
        />
      ) : (
        <div className="space-y-3">
          {sections.map((section) => {
            const isOpen = expanded.has(section.key);
            const activeChild =
              section.children.find((c) => c.group.id === activeBoard[section.key]) ??
              section.children[0] ??
              null;
            return (
              <div key={section.key} className="card overflow-hidden rounded-2xl p-0">
                <button
                  type="button"
                  onClick={() => toggleParent(section)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--bg-surface)]"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-heading text-lg font-bold text-text-primary">{section.label}</span>
                    <span className="rounded-full bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] font-medium text-text-muted ring-1 ring-[var(--border-color)]">
                      {section.children.length} bảng
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.2 }}
                    className="text-text-muted"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0, pointerEvents: 'none' }}
                      transition={reduced ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="border-t border-[var(--border-color)] px-4 py-4">
                        {section.children.length > 1 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {section.children.map((child) => (
                              <Chip
                                key={child.group.id}
                                active={activeChild?.group.id === child.group.id}
                                onClick={() =>
                                  setActiveBoard((prev) => ({ ...prev, [section.key]: child.group.id }))
                                }
                              >
                                {child.subLabel}
                              </Chip>
                            ))}
                          </div>
                        )}

                        {activeChild ? (
                          <>
                            {activeChild.group.description && (
                              <p className="mb-3 text-sm text-text-muted">{activeChild.group.description}</p>
                            )}
                            <KanaGrid
                              items={activeChild.group.items}
                              hideRomaji={hideRomaji}
                              mode={activeChild.mode}
                              code={code}
                            />
                          </>
                        ) : (
                          <p className="py-6 text-center text-sm text-text-muted">Nhóm này chưa có bảng.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}
