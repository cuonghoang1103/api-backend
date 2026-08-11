'use client';

/**
 * ============================================================
 * Tải bản build firmware lên — ngay trên web
 * ============================================================
 *
 * Vì sao có màn này, dù đã có script dòng lệnh làm đúng việc đó:
 *
 * Script bắt người dùng đi copy token phiên đăng nhập từ trình duyệt
 * sang terminal, `export` ra biến môi trường, rồi mới chạy được. Nhưng
 * người đó ĐANG ĐĂNG NHẬP trên chính trang này — trình duyệt đã cầm sẵn
 * phiên làm việc và tự gửi kèm mọi yêu cầu.
 *
 * Nói cách khác: cả màn token kia sinh ra chỉ vì tôi viết công cụ ở
 * nhầm chỗ. Tải lên từ đây thì không có token nào để mà quản lý.
 *
 * Script vẫn giữ, cho ai muốn một lệnh chạy tự động — nhưng đây mới là
 * đường chính.
 */

import { useMemo, useRef, useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFirmware } from '@/lib/maker-lab-api';
import type { MakerFirmwareBuild } from '@/types/maker-lab';

/** "0.2.3-hdr" → "0.2.4-hdr" · "1.4" → "1.5" */
function tangVersion(v: string): string {
  const m = /^(.*?)(\d+)([^0-9]*)$/.exec(v);
  return m ? `${m[1]}${Number(m[2]) + 1}${m[3]}` : `${v}-2`;
}

export function FirmwareUpload({
  projectId,
  builds,
  deviceVersion,
}: {
  projectId: number;
  builds: MakerFirmwareBuild[];
  /** Phiên bản bo đang chạy, để cảnh báo khi trùng. */
  deviceVersion?: string | null;
}) {
  const banMoiNhat = builds[0]?.version ?? null;
  const [version, setVersion] = useState(() =>
    banMoiNhat ? tangVersion(banMoiNhat) : '0.1.0',
  );
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [ketQua, setKetQua] = useState<{ ok: boolean; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trùng phiên bản bo đang chạy = bo sẽ không thấy gì mới để nạp.
  const trungBanDangChay = !!deviceVersion && version.trim() === deviceVersion;

  const canhBao = useMemo(() => {
    if (trungBanDangChay)
      return `Bo đang chạy đúng "${deviceVersion}". Đặt trùng thì nó không thấy bản nào mới để nạp.`;
    if (builds.some((b) => b.version === version.trim()))
      return `Đã có bản "${version.trim()}" trên server. Tải lên sẽ thành hai bản trùng tên.`;
    return null;
  }, [version, builds, deviceVersion, trungBanDangChay]);

  async function tai() {
    if (!file || !version.trim() || dangTai) return;
    setDangTai(true);
    setKetQua(null);
    try {
      const out = await uploadFirmware(projectId, {
        file,
        version: version.trim(),
        releaseNotes: notes.trim() || undefined,
      });
      setKetQua({
        ok: true,
        text: `Đã xuất bản "${out.version}". Giờ sang tab Điều khiển bấm "Cập nhật firmware".`,
      });
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setVersion(tangVersion(version.trim()));
    } catch (e) {
      setKetQua({
        ok: false,
        text:
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (e instanceof Error ? e.message : 'Tải lên thất bại'),
      });
    } finally {
      setDangTai(false);
    }
  }

  return (
    <section
      className="mb-6 rounded-xl border p-4"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <h3
        className="mb-1 flex items-center gap-2 text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        <UploadCloud className="h-4 w-4" /> Xuất bản bản build mới
      </h3>
      <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Build trên máy bằng <code>pio run</code>, rồi kéo file{' '}
        <code>.pio/build/mini-me/firmware.bin</code> vào đây. Server tự băm SHA-256 và cất lên
        R2 — bo sẽ từ chối nạp nếu băm không khớp.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Phiên bản{' '}
            {banMoiNhat && <span className="font-normal">(mới nhất trên server: {banMoiNhat})</span>}
          </label>
          <input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            maxLength={40}
            className="w-full rounded-lg border p-2 text-sm"
            style={{
              borderColor: canhBao ? '#f59e0b' : 'var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            File .bin
          </label>
          <input
            ref={inputRef}
            type="file"
            accept=".bin"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>
      </div>

      <label className="mb-1 mt-3 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        Ghi chú (tuỳ chọn)
      </label>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Sửa gì trong bản này…"
        maxLength={200}
        className="w-full rounded-lg border p-2 text-sm"
        style={{
          borderColor: 'var(--border-color)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
        }}
      />

      {canhBao && (
        <p className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: '#f59e0b' }}>
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {canhBao}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void tai()}
          disabled={!file || !version.trim() || dangTai}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'var(--accent, #6366f1)' }}
        >
          {dangTai ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {dangTai ? 'Đang tải lên…' : 'Xuất bản'}
        </button>
        {file && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {file.name} · {(file.size / 1024).toFixed(0)} KB
          </span>
        )}
      </div>

      {ketQua && (
        <p
          className="mt-3 flex items-start gap-1.5 text-sm"
          style={{ color: ketQua.ok ? '#22c55e' : '#ef4444' }}
        >
          {ketQua.ok ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {ketQua.text}
        </p>
      )}
    </section>
  );
}
