import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  // Default to 'en' (English) — the user can switch via LanguageSwitcher
  const locale = cookieStore.get('locale')?.value || 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
