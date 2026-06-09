'use client';

import { LocaleProvider } from '@/context/LocaleContext';
import { ReactNode } from 'react';

export default function LocaleWrapper({ children }: { children: ReactNode }) {
  // LocaleProvider renders children immediately (loading state is internal to t())
  return <LocaleProvider>{children}</LocaleProvider>;
}
