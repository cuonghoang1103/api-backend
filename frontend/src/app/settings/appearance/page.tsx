'use client';

/**
 * /settings/appearance — theme, language, motion.
 *
 * These three controls were scattered: the theme toggle lived in the
 * avatar dropdown, the language switch in the navbar, and reduced motion
 * only honoured the OS-level `prefers-reduced-motion`. This page gathers
 * them without removing the existing shortcuts — both still work and both
 * write through the same providers, so they stay in step with this page.
 */

import { Monitor, Moon, Sun, Languages, Sparkles, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLocaleContext } from '@/context/LocaleContext';
import { usePreferencesStore } from '@/store/preferencesStore';
import {
  SettingsPage, SettingsCard, SettingsRow, Toggle, SyncBadge,
} from '@/components/settings/primitives';
import { cn } from '@/lib/utils';

function OptionCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative flex flex-1 items-start gap-3 rounded-xl border p-4 text-left transition-colors',
      )}
      style={{
        background: active ? 'rgba(139,92,246,0.08)' : 'var(--bg-surface)',
        borderColor: active ? 'rgba(139,92,246,0.5)' : 'var(--border-color)',
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: active ? 'rgba(139,92,246,0.18)' : 'var(--bg-card)',
          color: active ? '#8b5cf6' : 'var(--text-secondary)',
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      </div>
      {active && <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#8b5cf6' }} />}
    </button>
  );
}

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocaleContext();

  const reduceMotion = usePreferencesStore((s) => s.reduceMotion);
  const setReduceMotion = usePreferencesStore((s) => s.setReduceMotion);
  const syncStatus = usePreferencesStore((s) => s.syncStatus);

  return (
    <SettingsPage
      title="Giao diện"
      description="Chế độ màu, ngôn ngữ hiển thị và mức độ chuyển động của hiệu ứng."
      action={<SyncBadge status={syncStatus} />}
    >
      <SettingsCard
        title="Chế độ màu"
        description="Áp dụng cho toàn bộ trang web và được lưu theo tài khoản của bạn."
        icon={<Monitor className="h-4 w-4" />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <OptionCard
            active={theme === 'light'}
            onClick={() => setTheme('light')}
            icon={<Sun className="h-4 w-4" />}
            title="Sáng"
            subtitle="Nền trắng, hợp khi làm việc ban ngày"
          />
          <OptionCard
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
            icon={<Moon className="h-4 w-4" />}
            title="Tối"
            subtitle="Nền tối, dịu mắt khi dùng buổi đêm"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Ngôn ngữ"
        description="Ngôn ngữ của giao diện. Nội dung bài viết vẫn giữ nguyên ngôn ngữ gốc của tác giả."
        icon={<Languages className="h-4 w-4" />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <OptionCard
            active={locale === 'vi'}
            onClick={() => setLocale('vi')}
            icon={<span className="text-base">🇻🇳</span>}
            title="Tiếng Việt"
            subtitle="Ngôn ngữ mặc định của trang"
          />
          <OptionCard
            active={locale === 'en'}
            onClick={() => setLocale('en')}
            icon={<span className="text-base">🇬🇧</span>}
            title="English"
            subtitle="Interface in English"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Chuyển động" icon={<Sparkles className="h-4 w-4" />}>
        <SettingsRow
          label="Giảm chuyển động"
          description="Tắt gần như toàn bộ hiệu ứng chuyển cảnh và animation trên trang. Hữu ích nếu bạn thấy chóng mặt hoặc muốn máy chạy nhẹ hơn. Nếu hệ điều hành của bạn đã bật 'giảm chuyển động', trang web tự tôn trọng cài đặt đó dù công tắc này đang tắt."
          control={
            <Toggle
              checked={reduceMotion}
              onChange={setReduceMotion}
              label="Giảm chuyển động"
            />
          }
        />
      </SettingsCard>
    </SettingsPage>
  );
}
