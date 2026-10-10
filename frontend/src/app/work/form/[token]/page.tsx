'use client';

/** /work/form/<token> — CTW đợt 7b (C8): điền form (công khai không cần tài khoản; nội bộ cần đăng nhập). */

import { useParams } from 'next/navigation';
import FormFill from '@/components/work/intake7b/FormFill';

export default function PublicFormPage() {
  const params = useParams<{ token: string }>();
  return <FormFill token={params?.token ?? ''} />;
}
