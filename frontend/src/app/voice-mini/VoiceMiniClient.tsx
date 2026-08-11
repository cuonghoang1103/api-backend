'use client';

/**
 * ============================================================
 * Voice CuongMini — dán chữ, ra tiếng
 * ============================================================
 *
 * Bản GỌN theo đúng yêu cầu: ô nhập, chọn giọng, nút tạo, nghe và tải.
 * Chưa có lịch sử, chưa có tải giọng mẫu lên từ đây.
 *
 * Một điều giao diện PHẢI nói thật: máy đọc chạy trên CPU của VPS, sinh
 * một phút tiếng mất khoảng một phút. Giấu chuyện đó đi thì người dùng
 * bấm nút, thấy vòng quay, rồi tưởng treo và bấm lại — mỗi lần bấm là
 * thêm một luồng tranh CPU, và mọi thứ chậm thêm. Nên ước tính hiện
 * ngay từ lúc bấm, và đếm ngược trong lúc chờ.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Play, Download, Mic2, AlertCircle } from 'lucide-react';
import { listVoices, startTts, waitForTts, type MiniVoice } from '@/lib/voice-mini-api';

const MAX_CHARS = 5000;

export default function VoiceMiniClient() {
  const [voices, setVoices] = useState<MiniVoice[]>([]);
  const [voice, setVoice] = useState('');
  const [text, setText] = useState('');
  const [dangChay, setDangChay] = useState(false);
  const [daCho, setDaCho] = useState(0);
  const [uocTinh, setUocTinh] = useState(0);
  const [loi, setLoi] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<{ url: string; giay: number | null; sinhMs: number | null } | null>(null);
  const huy = useRef<AbortController | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const v = await listVoices();
        setVoices(v);
        setVoice(v[0]?.id ?? '');
      } catch {
        setLoi('Máy đọc đang khởi động (lần đầu mất khoảng 45 giây). Tải lại trang sau một lát.');
      }
    })();
  }, []);

  // Thu hồi object URL cũ — không làm thì mỗi lần tạo lại rò thêm vài MB
  // trong tab của người dùng.
  useEffect(() => () => { if (ketQua?.url) URL.revokeObjectURL(ketQua.url); }, [ketQua?.url]);

  const quaDai = text.length > MAX_CHARS;

  const tao = useCallback(async () => {
    if (!text.trim() || quaDai || dangChay) return;
    setLoi(null);
    setKetQua(null);
    setDangChay(true);
    setDaCho(0);
    huy.current = new AbortController();
    try {
      const { jobId, uocTinhGiay } = await startTts(text.trim(), voice || undefined);
      setUocTinh(uocTinhGiay);
      const done = await waitForTts(jobId, setDaCho, huy.current.signal);
      setKetQua({
        url: URL.createObjectURL(done.blob),
        giay: done.audioSeconds,
        sinhMs: done.genMs,
      });
    } catch (e) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (e instanceof Error ? e.message : 'Không tạo được');
      setLoi(msg);
    } finally {
      setDangChay(false);
    }
  }, [text, voice, quaDai, dangChay]);

  const phanTram = useMemo(
    () => (uocTinh > 0 ? Math.min(96, (daCho / uocTinh) * 100) : 0),
    [daCho, uocTinh],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <Mic2 className="h-6 w-6" /> Voice CuongMini
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Dán văn bản, chọn giọng, bấm tạo. Máy đọc chạy ngay trên máy chủ của tôi — không
          gửi chữ của bạn đi đâu cả, và không có hạn mức.
        </p>
      </header>

      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        Văn bản
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Dán hoặc gõ nội dung cần đọc…"
        className="w-full rounded-xl border p-3 text-sm leading-relaxed"
        style={{
          borderColor: quaDai ? '#ef4444' : 'var(--border-color)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
        }}
      />
      <div className="mt-1 flex items-center justify-between text-xs">
        <span style={{ color: quaDai ? '#ef4444' : 'var(--text-muted)' }}>
          {text.length.toLocaleString('vi-VN')} / {MAX_CHARS.toLocaleString('vi-VN')} ký tự
        </span>
        {text.length > 0 && (
          <span style={{ color: 'var(--text-muted)' }}>
            ước chừng {Math.round(text.length / 15)} giây tiếng — và chừng đó thời gian chờ
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Giọng đọc
          </label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full rounded-lg border p-2.5 text-sm"
            style={{
              borderColor: 'var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            {voices.length === 0 && <option value="">Đang tải danh sách giọng…</option>}
            {voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => void tao()}
          disabled={!text.trim() || quaDai || dangChay || voices.length === 0}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'var(--accent, #6366f1)' }}
        >
          {dangChay ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {dangChay ? 'Đang đọc…' : 'Tạo âm thanh'}
        </button>
      </div>

      {dangChay && (
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-secondary)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${phanTram}%`, background: 'var(--accent, #6366f1)' }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Đã chờ {Math.round(daCho)} giây{uocTinh ? ` / ước chừng ${Math.round(uocTinh)} giây` : ''}. Cứ để
            tab này mở, đừng bấm lại — bấm thêm chỉ làm chậm hơn.
          </p>
        </div>
      )}

      {loi && (
        <div
          className="mt-5 flex items-start gap-2 rounded-lg border p-3 text-sm"
          style={{ borderColor: '#ef444455', color: '#ef4444' }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {loi}
        </div>
      )}

      {ketQua && (
        <div
          className="mt-6 rounded-xl border p-4"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
        >
          <audio controls src={ketQua.url} className="w-full" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {ketQua.giay ? `${ketQua.giay} giây tiếng` : ''}
              {ketQua.sinhMs ? ` · sinh trong ${(ketQua.sinhMs / 1000).toFixed(1)} giây` : ''}
            </span>
            <a
              href={ketQua.url}
              download="voice-cuongmini.wav"
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <Download className="h-3.5 w-3.5" /> Tải WAV
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
