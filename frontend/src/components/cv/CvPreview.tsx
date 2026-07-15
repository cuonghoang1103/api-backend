'use client';

/**
 * CvPreview — live paper preview (W1). "The preview is the hero" (spec): a
 * proper A4-proportioned document that re-renders as the user edits, mirroring
 * the server PDF templates (accent, header layout, section order, DOB rule).
 * Deliberately fixed light "paper" colours in both themes — it previews a
 * printed document, not a UI surface. Shows ORIGINAL content; AI translation
 * happens at export time (a note explains that when EN is selected).
 */
import type { CvProfile, CvItem } from '@/types/cv';
import { resolveTemplateFE } from '@/lib/cv-templates';

const SKILL_CAT_LABEL: Record<string, string> = {
  LANGUAGE: 'Ngôn ngữ', FRAMEWORK: 'Framework', DATABASE: 'Database',
  INFRA: 'Hạ tầng', TOOL: 'Công cụ', PRACTICE: 'Kỹ thuật', SOFT: 'Kỹ năng mềm',
};

const fmtMonth = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
const dateRange = (it: CvItem) => {
  const s = fmtMonth(it.startDate);
  const e = it.isCurrent ? 'nay' : fmtMonth(it.endDate);
  return s && e ? `${s} – ${e}` : s || e || '';
};

export default function CvPreview({
  profile, includedItemIds, templateKey, market, photoUrl,
}: {
  profile: CvProfile;
  /** null/empty = include everything */
  includedItemIds?: number[] | null;
  templateKey?: string | null;
  market?: string;
  photoUrl?: string | null;
}) {
  const spec = resolveTemplateFE(templateKey);
  const showDob = spec.showDob && market !== 'INTERNATIONAL';
  const items = includedItemIds && includedItemIds.length > 0
    ? profile.items.filter((i) => includedItemIds.includes(i.id))
    : profile.items;

  const byKind = (k: string) => items.filter((i) => i.kind === k);
  const experiences = byKind('EXPERIENCE');
  const projects = [...byKind('PROJECT'), ...byKind('OPEN_SOURCE')];
  const education = byKind('EDUCATION');
  const others = [...byKind('AWARD'), ...byKind('PUBLICATION'), ...byKind('VOLUNTEER')];

  const skillGroups = Object.keys(SKILL_CAT_LABEL)
    .map((cat) => ({ label: SKILL_CAT_LABEL[cat], names: profile.skills.filter((s) => s.category === cat).map((s) => s.name) }))
    .filter((g) => g.names.length > 0);

  const links = ([
    ['GitHub', profile.links?.github], ['LinkedIn', profile.links?.linkedin],
    ['Portfolio', profile.links?.portfolio], ['Website', profile.links?.website],
  ] as [string, string | undefined][]).filter(([, u]) => !!u);

  const contactBits = [profile.email, profile.phone, profile.location,
    showDob && profile.dateOfBirth ? `NS: ${new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}` : '',
  ].filter(Boolean).join('  •  ');

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mt-4">
      <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: spec.accent }}>{title}</h3>
      <div className="mt-0.5 border-b" style={{ borderColor: spec.id === 'ats' ? '#cccccc' : spec.accent, borderBottomWidth: spec.id === 'technical' ? 2 : 1 }} />
      <div className="mt-2">{children}</div>
    </section>
  );

  const ItemBlock = ({ it }: { it: CvItem }) => (
    <div className="mt-2.5 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[13px] font-bold leading-snug">{it.title}</div>
        {dateRange(it) && <div className="shrink-0 text-[10.5px] text-[#555]">{dateRange(it)}</div>}
      </div>
      {(it.organization || it.location) && (
        <div className="text-[11.5px] text-[#555]">{[it.organization, it.location].filter(Boolean).join(' · ')}</div>
      )}
      {it.gpa && <div className="text-[10.5px] text-[#555]">GPA: {it.gpa}</div>}
      {it.techStack.length > 0 && (
        <div className="text-[10px]" style={{ color: spec.id === 'technical' ? spec.accent : '#555' }}>{it.techStack.join(' · ')}</div>
      )}
      {it.url && <div className="break-all text-[10px]" style={{ color: spec.accent }}>{it.url}</div>}
      {it.bullets.length > 0 && (
        <ul className="mt-1 space-y-0.5 pl-3">
          {it.bullets.map((b) => (
            <li key={b.id} className="list-disc text-[11.5px] leading-snug text-[#1a1a1a]">{b.text}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const eduBlock = education.length > 0 && <Section title="Học vấn">{education.map((it) => <ItemBlock key={it.id} it={it} />)}</Section>;
  const expBlock = experiences.length > 0 && <Section title="Kinh nghiệm làm việc">{experiences.map((it) => <ItemBlock key={it.id} it={it} />)}</Section>;
  const projBlock = projects.length > 0 && <Section title="Dự án">{projects.map((it) => <ItemBlock key={it.id} it={it} />)}</Section>;

  return (
    <div className="mx-auto w-full max-w-[520px] rounded-md border border-[var(--border-color)] bg-white text-[#1a1a1a] shadow-lg" style={{ aspectRatio: 'auto', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div className="min-h-[700px] px-8 py-7" style={{ fontSize: 12 }}>
        {/* Header */}
        <div className={spec.centerHeader ? 'text-center' : ''}>
          <div className={`flex items-start gap-4 ${spec.centerHeader ? 'flex-col items-center' : ''}`}>
            {photoUrl && spec.showDob && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="h-20 w-16 shrink-0 rounded object-cover" />
            )}
            <div className={spec.centerHeader ? 'text-center' : ''}>
              <h2 className="font-bold leading-tight" style={{ fontSize: spec.nameSizePx, color: spec.id === 'senior' ? spec.accent : '#1a1a1a' }}>
                {profile.fullName || 'Họ và tên'}
              </h2>
              {profile.headline && <div className="mt-0.5 text-[13px] text-[#555]">{profile.headline}</div>}
              {contactBits && <div className="mt-1 text-[10.5px] text-[#555]">{contactBits}</div>}
              {links.length > 0 && (
                <div className="mt-0.5 space-y-0">
                  {links.map(([label, url]) => (
                    <div key={label} className="break-all text-[10px]" style={{ color: spec.accent }}>{label}: {url}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {profile.summary && (
          <Section title="Tóm tắt"><p className="text-[11.5px] leading-snug">{profile.summary}</p></Section>
        )}

        {spec.educationEarly ? (<>{eduBlock}{expBlock}{projBlock}</>) : (<>{expBlock}{projBlock}{eduBlock}</>)}

        {skillGroups.length > 0 && (
          <Section title="Kỹ năng">
            {skillGroups.map((g) => (
              <div key={g.label} className="text-[11.5px] leading-snug">
                <span className="font-bold">{g.label}: </span>
                <span className="text-[#555]">{g.names.join(', ')}</span>
              </div>
            ))}
          </Section>
        )}

        {profile.languageSkills.length > 0 && (
          <Section title="Ngoại ngữ">
            {profile.languageSkills.map((l) => (
              <div key={l.id} className="text-[11.5px]">{l.language}{l.proficiency || l.certName ? ` — ${[l.proficiency, l.certName ? `${l.certName} ${l.certScore ?? ''}`.trim() : ''].filter(Boolean).join(' · ')}` : ''}</div>
            ))}
          </Section>
        )}

        {profile.certifications.length > 0 && (
          <Section title="Chứng chỉ">
            {profile.certifications.map((c) => (
              <div key={c.id} className="text-[11.5px]">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</div>
            ))}
          </Section>
        )}

        {others.length > 0 && <Section title="Khác">{others.map((it) => <ItemBlock key={it.id} it={it} />)}</Section>}
      </div>
    </div>
  );
}
