'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Award, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { certificatesApi } from '@/lib/api';
import type { Certificate } from '@/types';
import { toast } from 'sonner';

export default function CertificatePage() {
  const params = useParams<{ number: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.number) return;
    certificatesApi.verifyCertificate(params.number)
      .then((res) => setCert(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (notFound || !cert) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-darkcard border border-darkborder flex items-center justify-center">
          <Award className="w-10 h-10 text-text-muted" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Certificate Not Found</h1>
        <p className="text-text-secondary">This certificate number is invalid or does not exist.</p>
      </div>
    );
  }

  const issuedDate = cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen bg-darkbg pt-20 pb-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        {/* Certificate Card */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-neon-violet/30 bg-gradient-to-br from-[#0d0b1e] to-[#1a1040] shadow-2xl shadow-neon-violet/10">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-neon-indigo to-transparent opacity-30" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-neon-violet to-transparent opacity-30" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-neon-indigo to-transparent opacity-20" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-neon-violet to-transparent opacity-20" />

          <div className="relative p-8 md:p-12 text-center space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/20 text-neon-violet text-sm">
                <span className="text-base leading-none">🐼</span> CuongThai Academy
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-primary">
                Certificate of Completion
              </h1>
              <p className="text-text-secondary text-lg">Chứng nhận hoàn thành khóa học</p>
            </div>

            {/* Recipient */}
            <div className="space-y-2 py-6 border-y border-neon-violet/20">
              <p className="text-sm text-text-muted uppercase tracking-[0.2em]">🎉 Congratulations! This is to certify that</p>
              <p className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo to-neon-violet">
                {cert.userName || 'Student'}
              </p>
              <p className="text-sm text-text-muted">has successfully completed the course</p>
            </div>

            {/* Course */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-darkbg/60 border border-darkborder">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-lg font-semibold text-text-primary">{cert.courseTitle}</span>
              </div>
              {cert.courseCode && (
                <p className="text-text-muted">{cert.courseCode}{cert.semesterName ? ` — ${cert.semesterName}` : ''}</p>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              <div className="rounded-xl bg-darkbg/40 border border-darkborder p-4">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Issue Date</p>
                <p className="font-semibold text-text-primary">{issuedDate}</p>
              </div>
              <div className="rounded-xl bg-darkbg/40 border border-darkborder p-4">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Certificate No.</p>
                <p className="font-mono text-sm font-semibold text-neon-violet">{cert.certificateNumber}</p>
              </div>
              <div className="rounded-xl bg-darkbg/40 border border-darkborder p-4 col-span-2 md:col-span-1">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Verified</p>
                <p className="font-semibold text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Authentic</p>
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-neon-indigo/20 to-neon-violet/20 border border-neon-violet/30">
                <Award className="w-8 h-8 text-neon-violet" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">Verified Certificate</p>
                  <p className="text-xs text-text-muted">Issued by CuongThai · cuongthai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium hover:opacity-90 transition"
          >
            <Download className="w-4 h-4" /> In chứng chỉ
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-darkborder text-text-secondary hover:text-text-primary hover:bg-white/5 transition"
          >
            Chia sẻ
          </button>
        </div>

        {/* Verify info */}
        <p className="text-center text-xs text-text-muted mt-4">
          Verify at: cuongthai.com/certificates/{cert.certificateNumber}
        </p>
      </div>

      <style>{`
        @media print {
          body { background: #0d0b1e !important; }
          button { display: none !important; }
          .no-print { display: none !important; }
          .certificate-card { box-shadow: none !important; border: 2px solid #8b5cf6 !important; }
        }
      `}</style>
    </div>
  );
}
