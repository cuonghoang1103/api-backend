'use client';
/**
 * Kana practice — "stages" experience.
 * Screen 1 (StagePicker): choose kana groups + stages + question count.
 * → KanaSession runs the quiz → results. Settings persist to localStorage.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { AlphabetGroup } from '@/types/language';
import {
  SectionShell,
  EmptyState,
  CardsSkeleton,
  usePrefersReducedMotion,
} from '@/components/language/primitives';
import {
  STAGE_TYPES,
  toKanaGroups,
  type KanaGroup,
  type PracticeSettings,
  type StageType,
} from '@/components/language/kana/types';
import { StagePicker } from '@/components/language/kana/StagePicker';
import { KanaSession } from '@/components/language/kana/KanaSession';

const STORAGE_KEY = 'kana-practice-settings';
const VALID_COUNTS = new Set([0, 10, 20, 40]);

function defaultGroupIds(groups: KanaGroup[]): number[] {
  const hira = groups.filter((g) => /hiragana|ひらがな/i.test(g.name));
  return (hira.length ? hira : groups).map((g) => g.id);
}

function loadStored(groups: KanaGroup[]): PracticeSettings {
  const fallback: PracticeSettings = {
    groupIds: defaultGroupIds(groups),
    stages: [...STAGE_TYPES],
    count: 20,
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PracticeSettings>;
    const validGroupIds = Array.isArray(parsed.groupIds)
      ? parsed.groupIds.filter((id): id is number => groups.some((g) => g.id === id))
      : [];
    const validStages = Array.isArray(parsed.stages)
      ? parsed.stages.filter((s): s is StageType => (STAGE_TYPES as readonly string[]).includes(s))
      : [];
    return {
      groupIds: validGroupIds.length ? validGroupIds : fallback.groupIds,
      stages: validStages.length ? validStages : fallback.stages,
      count: typeof parsed.count === 'number' && VALID_COUNTS.has(parsed.count) ? parsed.count : fallback.count,
    };
  } catch {
    return fallback;
  }
}

export default function KanaPracticePage() {
  const code = String(useParams().code);
  const reduced = usePrefersReducedMotion();

  const [groups, setGroups] = useState<KanaGroup[] | null>(null);
  const [settings, setSettings] = useState<PracticeSettings | null>(null);
  const [phase, setPhase] = useState<'picker' | 'session'>('picker');

  useEffect(() => {
    let alive = true;
    languageApi
      .alphabet(code)
      .then((res) => {
        if (!alive) return;
        const kg = toKanaGroups(res.data.data ?? ([] as AlphabetGroup[]));
        setGroups(kg);
        setSettings(loadStored(kg));
      })
      .catch(() => {
        if (alive) {
          setGroups([]);
          setSettings(null);
        }
      });
    return () => {
      alive = false;
    };
  }, [code]);

  const updateSettings = (next: PracticeSettings) => {
    setSettings(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private-mode errors */
    }
  };

  return (
    <SectionShell
      code={code}
      title="Luyện tập bảng chữ cái"
      section="Luyện tập"
      icon={<GraduationCap className="text-neon-violet" />}
      right={
        <Link
          href={`/language/${code}/alphabet`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3.5 py-1.5 text-sm font-medium text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-text-primary"
        >
          <ArrowLeft size={15} /> Bảng chữ cái
        </Link>
      }
    >
      {code !== 'ja' ? (
        // The practice engine quizzes kana ↔ romaji typing — EN (IPA) and ZH
        // (pinyin) alphabet entries aren't typeable answers, so gate it to ja.
        <EmptyState
          emoji="🈳"
          title="Luyện tập hiện chỉ hỗ trợ bảng kana tiếng Nhật"
          hint="Với ngôn ngữ này, hãy học qua bảng chữ cái, từ vựng và quiz từ vựng nhé."
        />
      ) : groups === null || settings === null ? (
        groups !== null && groups.length === 0 ? (
          <EmptyState
            emoji="🈳"
            title="Ngôn ngữ này chưa có bảng kana"
            hint="Tính năng luyện tập dành cho các bảng chữ như Hiragana / Katakana."
          />
        ) : (
          <CardsSkeleton count={9} />
        )
      ) : groups.length === 0 ? (
        <EmptyState
          emoji="🈳"
          title="Ngôn ngữ này chưa có bảng kana"
          hint="Tính năng luyện tập dành cho các bảng chữ như Hiragana / Katakana."
        />
      ) : phase === 'picker' ? (
        <StagePicker
          groups={groups}
          settings={settings}
          onChange={updateSettings}
          onStart={() => setPhase('session')}
        />
      ) : (
        <KanaSession
          groups={groups}
          settings={settings}
          onExit={() => setPhase('picker')}
          reduced={reduced}
        />
      )}
    </SectionShell>
  );
}
