'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { Award, Loader2, ExternalLink } from 'lucide-react';
import { certificatesApi } from '@/lib/api';

interface MyCert {
  id: number;
  certificateNumber: string;
  issuedAt?: string | null;
  course?: { id: number; title: string; thumbnailUrl?: string | null };
}

export default function MyCertificatesPage() {
  const router = useRouter();
  const { status } = useSession();
  const { isAuthenticated: isBackendAuth, isLoading: isBackendLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  const [certs, setCerts] = useState<MyCert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    if (!isBackendLoading && status !== 'loading' && !isAuthenticated) {
      router.push('/login?callbackUrl=/certificates/my');
      return;
    }
    if (isAuthenticated) {
      certificatesApi.getMyCertificates()
        .then((res) => setCerts((res.data?.data as MyCert[]) || []))
        .catch(() => setCerts([]))
        .finally(() => setLoading(false));
    }
  }, [mounted, isAuthenticated, isBackendLoading, status, router]);

  if (!mounted || isBackendLoading || status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-heading font-bold text-text-primary flex items-center gap-2 mb-2">
          <Award className="w-7 h-7 text-neon-violet" /> Chứng chỉ của tôi
        </h1>
        <p className="text-text-secondary mb-8">Các chứng chỉ bạn đạt được khi hoàn thành 100% khoá học.</p>

        {certs.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            Chưa có chứng chỉ nào. Hoàn thành 100% một khoá học để nhận chứng chỉ.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certs.map((c) => (
              <Link
                key={c.id}
                href={`/certificates/${c.certificateNumber}`}
                className="group rounded-2xl border border-darkborder bg-darkcard overflow-hidden hover:border-neon-violet/40 transition-colors"
              >
                <div className="aspect-video bg-gradient-to-br from-neon-indigo/20 to-neon-violet/10 flex items-center justify-center relative overflow-hidden">
                  {c.course?.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.course.thumbnailUrl} alt={c.course.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  ) : null}
                  <Award className="w-10 h-10 text-white/90 relative z-10" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-text-primary line-clamp-2">{c.course?.title || 'Khoá học'}</p>
                  <p className="text-xs text-text-muted mt-1 font-mono">{c.certificateNumber}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-text-muted">
                      {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                    <span className="text-xs text-neon-violet inline-flex items-center gap-1 group-hover:underline">
                      Xem <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
