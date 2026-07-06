'use client';

// Content manager for a single language — 7 lazily-loaded tabs.
// Each tab is its own component under components/admin/language and
// receives { languageId, code }.

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { languageAdminApi } from '@/lib/language-api';
import type { LanguageOverview } from '@/types/language';
import { unwrap, errMsg } from '@/components/admin/language/shared';
import AlphabetTab from '@/components/admin/language/AlphabetTab';
import VocabTab from '@/components/admin/language/VocabTab';
import GrammarTab from '@/components/admin/language/GrammarTab';
import ListeningTab from '@/components/admin/language/ListeningTab';
import ConversationTab from '@/components/admin/language/ConversationTab';
import ReadingTab from '@/components/admin/language/ReadingTab';
import QnaTab from '@/components/admin/language/QnaTab';

type TabKey = 'alphabet' | 'vocab' | 'grammar' | 'listening' | 'conversation' | 'reading' | 'qna';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'alphabet', label: 'Bảng chữ cái' },
  { key: 'vocab', label: 'Từ vựng' },
  { key: 'grammar', label: 'Ngữ pháp' },
  { key: 'listening', label: 'Nghe' },
  { key: 'conversation', label: 'Giao tiếp' },
  { key: 'reading', label: 'Đọc' },
  { key: 'qna', label: 'Q&A' },
];

export default function AdminLanguageContentPage() {
  const params = useParams<{ code: string }>();
  const code = params.code;
  const [lang, setLang] = useState<LanguageOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('alphabet');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = unwrap(await languageAdminApi.listLanguages());
      const found = (rows as LanguageOverview[]).find((l) => l.code === code) ?? null;
      setLang(found);
      if (!found) toast.error('Không tìm thấy ngôn ngữ');
    } catch (e) {
      toast.error(errMsg(e, 'Không tải được ngôn ngữ'));
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (!lang) {
    return (
      <div className="space-y-4">
        <Link href="/admin/language" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Danh sách ngôn ngữ
        </Link>
        <p className="text-text-muted">Không tìm thấy ngôn ngữ với mã “{code}”.</p>
      </div>
    );
  }

  const languageId = lang.id;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/admin/language" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Danh sách ngôn ngữ
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{lang.flagEmoji}</span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-text-primary">{lang.name}</h1>
            <p className="text-sm text-text-muted">
              {lang.nameEn} · <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-teal-300">{lang.code}</code>
            </p>
          </div>
        </div>
      </div>

      <div role="tablist" className="flex flex-wrap gap-2 border-b border-darkborder pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-neon-violet/20 text-violet-200 ring-1 ring-neon-violet/40'
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'alphabet' && <AlphabetTab languageId={languageId} code={code} />}
        {tab === 'vocab' && <VocabTab languageId={languageId} code={code} />}
        {tab === 'grammar' && <GrammarTab languageId={languageId} code={code} />}
        {tab === 'listening' && <ListeningTab languageId={languageId} code={code} />}
        {tab === 'conversation' && <ConversationTab languageId={languageId} code={code} />}
        {tab === 'reading' && <ReadingTab languageId={languageId} code={code} />}
        {tab === 'qna' && <QnaTab languageId={languageId} code={code} />}
      </div>
    </div>
  );
}
