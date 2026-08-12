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
import { Loader2, Play, Download, Mic2, AlertCircle, Upload, Sparkles, Trash2, X } from 'lucide-react';
import {
  cloneVoice,
  deleteVoice,
  listVoices,
  startTts,
  waitForTts,
  type MiniVoice,
} from '@/lib/voice-mini-api';

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

  // ── Nhân bản giọng ──
  const [tenGiong, setTenGiong] = useState('');
  const [fileMau, setFileMau] = useState<File | null>(null);
  const [dangNhanBan, setDangNhanBan] = useState(false);
  const [tinNhanBan, setTinNhanBan] = useState<string | null>(null);

  // ── Xoá giọng ──
  const [dangXoa, setDangXoa] = useState<string | null>(null);
  const [hoiXoa, setHoiXoa] = useState<string | null>(null);

  const giongCuaToi = useMemo(() => voices.filter((v) => v.custom), [voices]);

  /**
   * Xoá thật, sau khi người dùng bấm xác nhận.
   *
   * Xoá giọng là KHÔNG lấy lại được: đặc trưng người nói rút từ đoạn thu
   * gốc, mà đoạn thu đó không được giữ lại. Muốn có lại phải tìm đúng
   * file cũ và nhân bản lần nữa. Nên có một bước hỏi, và nút xác nhận
   * ghi rõ tên giọng chứ không phải chỉ "Xoá".
   */
  const xoa = useCallback(
    async (ten: string) => {
      setDangXoa(ten);
      setTinNhanBan(null);
      try {
        await deleteVoice(ten);
        const ds = await listVoices();
        setVoices(ds);
        // Đang chọn đúng giọng vừa xoá thì phải nhảy sang giọng khác,
        // không thì ô chọn trỏ vào chỗ trống và nút tạo báo lỗi khó hiểu.
        setVoice((dang) => (dang === ten ? (ds[0]?.id ?? '') : dang));
        setTinNhanBan(`Đã xoá giọng "${ten}".`);
      } catch (e) {
        setTinNhanBan(
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            (e instanceof Error ? e.message : 'Không xoá được giọng'),
        );
      } finally {
        setDangXoa(null);
        setHoiXoa(null);
      }
    },
    [],
  );

  const nhanBan = useCallback(async () => {
    if (!fileMau || !tenGiong.trim() || dangNhanBan) return;
    setDangNhanBan(true);
    setTinNhanBan(null);
    try {
      const ten = await cloneVoice(tenGiong.trim(), fileMau);
      const ds = await listVoices();
      setVoices(ds);
      setVoice(ten); // chọn luôn giọng vừa tạo — đó là thứ người ta muốn nghe ngay
      setTenGiong('');
      setFileMau(null);
      setTinNhanBan(`Xong. Đã chọn sẵn giọng "${ten}" ở trên, gõ gì đó rồi bấm tạo để nghe thử.`);
    } catch (e) {
      setTinNhanBan(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (e instanceof Error ? e.message : 'Không nhân bản được'),
      );
    } finally {
      setDangNhanBan(false);
    }
  }, [fileMau, tenGiong, dangNhanBan]);

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
    // pt-20 để tránh thanh nav CỐ ĐỊNH cao 64px — `py-10` cũ chỉ chừa
    // 40px nên tiêu đề chui xuống dưới thanh nav, đúng lỗi người dùng
    // thấy. Mọi trang khác trong web đều dùng đúng cặp `pt-20 sm:pt-24`.
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-20 sm:px-6 sm:pt-24">
      <header className="mb-8">
        <h1
          className="flex items-center gap-2.5 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            // ⚠️ KHÔNG viết `var(--accent)18` để mong ra alpha hex — nối
            // chuỗi vào sau var() cho ra một giá trị không hợp lệ, và CSS
            // không hợp lệ thì trình duyệt BỎ QUA IM LẶNG. Ô nền biến mất
            // mà không có lỗi nào ở console.
            style={{ background: 'color-mix(in srgb, var(--accent, #6366f1) 16%, transparent)' }}
          >
            <Mic2 className="h-5 w-5" style={{ color: 'var(--accent, #6366f1)' }} />
          </span>
          Voice CuongMini
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Dán văn bản, chọn giọng, bấm tạo. Máy đọc chạy ngay trên máy chủ của tôi — chữ của bạn
          không đi đâu cả, và không có hạn mức.
        </p>

        {/* Ba con số ĐO THẬT, không phải khẩu hiệu. Người ta tin số hơn tin
            tính từ, và ba con số này là lý do tồn tại của cả trang. */}
        <dl className="mt-5 grid grid-cols-3 gap-3">
          {[
            { n: '0,19×', t: 'thời gian thực', g: 'sinh 5 giây tiếng mất chưa tới 1 giây' },
            { n: '5.000', t: 'ký tự mỗi lượt', g: 'khoảng 5 phút đọc' },
            { n: '0đ', t: 'không hạn mức', g: 'chạy trên máy riêng, không gọi ai' },
          ].map((o) => (
            <div
              key={o.t}
              className="rounded-xl border px-3 py-2.5"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
              title={o.g}
            >
              <dt className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {o.n}
              </dt>
              <dd className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                {o.t}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Thẻ chính. Gom ô nhập, chọn giọng và nút vào một khối có viền:
          trước đây chúng trôi tự do trên nền trang nên mắt không biết đâu
          là một việc, đâu là việc khác. */}
      <section
        className="rounded-2xl border p-4 sm:p-5"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
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
          background: 'var(--bg-secondary)',
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
              background: 'var(--bg-secondary)',
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
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
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

      </section>

      {/* ── Nhân bản giọng ──
          Đặt CUỐI trang, và gập lại sẵn: người vào lần đầu chỉ muốn dán
          chữ nghe thử, bắt họ đi qua một cái form tải file trước là mất
          họ ngay. Ai cần giọng riêng thì cuộn xuống mở ra. */}
      <details className="mt-8 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
        <summary
          className="cursor-pointer p-4 text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Sparkles className="mr-2 inline h-4 w-4" />
          Nhân bản &amp; quản lý giọng của bạn
          {giongCuaToi.length > 0 && (
            <span className="ml-2 font-normal" style={{ color: 'var(--text-muted)' }}>
              — đang có {giongCuaToi.length} giọng, mở ra để xoá bớt
            </span>
          )}
        </summary>
        <div className="border-t p-4" style={{ borderColor: 'var(--border-color)' }}>
          <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tải lên <strong>15–60 giây</strong> giọng bạn đọc, máy sẽ đọc mọi thứ khác bằng giọng
            đó. Đọc bình thường như đang nói chuyện, đừng đọc như đọc diễn văn — và quan trọng
            nhất vẫn là <strong>phòng yên, một micro</strong>.
          </p>
          <p
            className="mb-4 rounded-lg border p-3 text-xs leading-relaxed"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
          >
            <strong>Máy chỉ nghe được 8 giây.</strong> Mô hình VieNeu rút đặc trưng giọng từ tối
            đa 8 giây, dù bạn tải lên bao nhiêu — nên thu 5 phút cũng không giống hơn thu 30 giây.
            Việc web làm giúp bạn là <em>tự tìm 8 giây rõ tiếng nhất</em> trong đoạn bạn tải lên
            (to, đều, không lẫn khoảng lặng) thay vì lấy đại 8 giây đầu. Vì thế cứ thu thoải mái
            rồi để máy chọn; chỉ cần trong đó có ít nhất một quãng bạn nói liền mạch, rõ ràng.
            <br />
            <br />
            Cách này chỉ chép được <em>chất giọng</em>. Ngữ điệu, cách nhấn nhá, giọng vùng miền
            và cảm xúc thì phải huấn luyện riêng — đang làm.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Đặt tên cho giọng
              </label>
              <input
                value={tenGiong}
                onChange={(e) => setTenGiong(e.target.value)}
                placeholder="Ví dụ: Cường"
                maxLength={60}
                className="w-full rounded-lg border p-2.5 text-sm"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                File giọng mẫu
              </label>
              <input
                type="file"
                accept="audio/*,video/*,.wav,.mp3,.m4a,.ogg,.flac,.aac,.opus,.mp4,.mov,.m4v"
                onChange={(e) => setFileMau(e.target.files?.[0] ?? null)}
                className="w-full text-xs"
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => void nhanBan()}
            disabled={!fileMau || !tenGiong.trim() || dangNhanBan}
            className="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ background: 'var(--accent, #6366f1)' }}
          >
            {dangNhanBan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {dangNhanBan ? 'Đang học giọng…' : 'Nhân bản giọng này'}
          </button>

          {dangNhanBan && (
            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Mất khoảng 30–90 giây: máy phải khử nhiễu, cắt gọn rồi rút đặc trưng giọng nói.
            </p>
          )}
          {tinNhanBan && (
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {tinNhanBan}
            </p>
          )}

          {giongCuaToi.length > 0 && (
            <div
              className="mt-6 border-t pt-4"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <h3
                className="mb-1 text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Giọng bạn đã nhân bản ({giongCuaToi.length})
              </h3>
              <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                Xoá là mất hẳn — đoạn thu gốc không được giữ lại, muốn có lại phải
                nhân bản từ đầu. {voices.length - giongCuaToi.length} giọng gốc của
                VieNeu không nằm ở đây vì không xoá được.
              </p>

              <ul className="flex flex-col gap-1.5">
                {giongCuaToi.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    <span
                      className="min-w-0 flex-1 truncate text-sm"
                      style={{ color: 'var(--text-primary)' }}
                      title={v.label}
                    >
                      {v.id}
                      {voice === v.id && (
                        <span className="ml-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          đang chọn
                        </span>
                      )}
                    </span>

                    {hoiXoa === v.id ? (
                      <span className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => void xoa(v.id)}
                          disabled={dangXoa === v.id}
                          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
                          style={{ background: '#dc2626' }}
                        >
                          {dangXoa === v.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Xoá &ldquo;{v.id}&rdquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => setHoiXoa(null)}
                          disabled={dangXoa === v.id}
                          aria-label={`Không xoá giọng ${v.id}`}
                          className="rounded-md border p-1.5 transition disabled:opacity-50"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setHoiXoa(v.id)}
                        aria-label={`Xoá giọng ${v.id}`}
                        className="shrink-0 rounded-md border p-1.5 transition hover:opacity-80"
                        style={{
                          borderColor: 'var(--border-color)',
                          color: '#dc2626',
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
