'use client';

/**
 * ============================================================
 * Maker Lab — sửa tính cách và giọng nói của robot
 * ============================================================
 *
 * Persona là thứ bạn sẽ chỉnh nhiều lần nhất trong cả dự án, vì "hỗn
 * vừa đủ" không phải con số mà là cảm giác — phải nghe rồi mới biết
 * quá tay hay còn nhạt. Trước khi có màn này, sửa một câu đùa phải đi
 * qua sửa code, commit, và một lần deploy hai mươi phút.
 *
 * Hai điều màn này cố tình làm rõ:
 *
 * 1. **Mẫu đối thoại quan trọng hơn ô prompt.** Bảo model "hãy hỗn"
 *    thì được một model đang DIỄN cảnh hỗn; cho nó xem sáu câu thật
 *    thì nó bắt chước nhịp và kiểu đùa. Nên khu mẫu nằm ngay dưới,
 *    không giấu trong phần nâng cao.
 *
 * 2. **Giọng nào thật sự dùng được.** Danh sách nhà cung cấp ghi
 *    thẳng cái nào đang chạy và cái nào cần khoá — chọn nhầm một nhà
 *    chưa có khoá thì robot im, mà lỗi đó chỉ hiện trong log server.
 */

import { useEffect, useState } from 'react';
import { Mic2, Plus, Trash2, Save, Volume2, Loader2, AlertTriangle } from 'lucide-react';
import { updatePersona, sayOnDevice } from '@/lib/maker-lab-api';
import { listVoices } from '@/lib/voice-mini-api';
import type { MakerPersona, MakerDevice } from '@/types/maker-lab';

interface VoiceOption {
  provider: string;
  label: string;
  voices: Array<{ id: string; label: string }>;
  /** Có chạy được ngay không, và nếu không thì thiếu gì. */
  status: 'ok' | 'need-key' | 'down';
  note: string;
}

/**
 * Trạng thái đo THẬT ngày 10/08/2026, không phải chép từ tài liệu:
 *   google  → đang chạy, đây là giọng robot đang dùng
 *   edge    → Microsoft trả 403 từ 07/08 (đòi token Sec-MS-GEC)
 *   openai  → tài khoản hết credit ("no credits remaining")
 *   modelapi.vn KHÔNG bán TTS: /v1/audio/speech trả 503
 *              "No available channel for model gpt-4o-mini-tts"
 */
const VOICES: VoiceOption[] = [
  {
    // Đứng ĐẦU danh sách vì nó là đường duy nhất cho giọng của chính
    // chủ nhân, và là đường nhanh nhất — đo 12/08/2026 qua đường hầm từ
    // VPS về máy để bàn: 1,03 giây cho 4,8 giây tiếng (RTF 0,187),
    // nhanh gấp 10 lần chính dịch vụ đó chạy trên VPS.
    provider: 'cuongmini',
    label: 'Voice CuongMini ⭐ giọng NHÂN BẢN của bạn',
    // Để rỗng — danh sách nạp động từ dịch vụ, xem `giongTuDung` bên
    // dưới. Viết cứng ở đây là sai về nguyên tắc: giọng nhân bản do
    // người dùng tự đặt tên lúc tải mẫu lên, mã nguồn không thể biết
    // trước, và bản trước quên hẳn chuyện đó nên giọng vừa tạo xong
    // không hiện ra chỗ nào để chọn.
    voices: [],
    status: 'ok',
    note: 'Chạy trên máy tính riêng của bạn, không tốn tiền, không hạn mức. Nhân bản giọng ở trang /voice-mini rồi chọn tên giọng ở đây. ⚠️ Tắt máy đó thì robot vẫn nói được nhưng rơi về giọng Google mặc định.',
  },
  {
    provider: 'fptai',
    label: 'FPT.AI ⭐ không cần thẻ quốc tế',
    voices: [
      { id: 'leminh', label: 'Lê Minh — nam, miền Bắc' },
      { id: 'giahuy', label: 'Gia Huy — nam, miền Trung' },
      { id: 'minhquang', label: 'Minh Quang — nam, miền Nam' },
      { id: 'banmai', label: 'Ban Mai — nữ, miền Bắc' },
      { id: 'thuminh', label: 'Thu Minh — nữ, miền Bắc' },
      { id: 'myan', label: 'Mỹ An — nữ, miền Trung' },
      { id: 'lannhi', label: 'Lan Nhi — nữ, miền Nam' },
      { id: 'linhsan', label: 'Linh San — nữ, miền Nam' },
    ],
    status: 'need-key',
    note: 'Giọng Việt do người Việt làm, đủ ba miền, nhận cả tốc độ đọc. Đăng ký ở console.fpt.ai chỉ cần email + số điện thoại Việt Nam — KHÔNG cần thẻ quốc tế, khác hẳn Google và ElevenLabs. Chậm hơn Google chừng nửa giây vì nó trả URL rồi mới sinh file. Cần FPTAI_API_KEY.',
  },
  {
    provider: 'gcloud',
    label: 'Google Cloud TTS ⭐ khuyên dùng',
    voices: [
      { id: 'vi-VN-Wavenet-D', label: 'WaveNet D — nam' },
      { id: 'vi-VN-Wavenet-B', label: 'WaveNet B — nam' },
      { id: 'vi-VN-Wavenet-A', label: 'WaveNet A — nữ' },
      { id: 'vi-VN-Wavenet-C', label: 'WaveNet C — nữ' },
      { id: 'vi-VN-Standard-D', label: 'Standard D — nam (nhẹ hơn)' },
      { id: 'vi-VN-Standard-A', label: 'Standard A — nữ (nhẹ hơn)' },
      { id: 'vi-VN-Neural2-D', label: 'Neural2 D — nam (hạn 1M/tháng)' },
      { id: 'vi-VN-Neural2-A', label: 'Neural2 A — nữ (hạn 1M/tháng)' },
    ],
    status: 'need-key',
    note: '4 TRIỆU ký tự miễn phí mỗi tháng ≈ 33.000 lượt robot nói ≈ 1.100 lượt/ngày — thực tế là vô hạn. Gấp 33 lần ElevenLabs gói 22 $, mà không mất đồng nào. Bốn giọng Việt nam/nữ. Cần GOOGLE_TTS_API_KEY.',
  },
  {
    provider: 'google',
    label: 'Google translate_tts (đang dùng)',
    voices: [{ id: 'vi', label: 'Tiếng Việt — giọng duy nhất' }],
    status: 'ok',
    note: 'Cửa sau miễn phí, không cần khoá — nhưng đúng một giọng máy móc, không chỉnh được, và Google có thể chặn bất cứ lúc nào.',
  },
  {
    provider: 'edge',
    label: 'Microsoft Edge (miễn phí)',
    voices: [
      { id: 'vi-VN-NamMinhNeural', label: 'Nam Minh — nam' },
      { id: 'vi-VN-HoaiMyNeural', label: 'Hoài My — nữ' },
    ],
    status: 'down',
    note: 'Giọng Việt hay nhất trong nhóm miễn phí, NHƯNG Microsoft trả 403 từ 07/08/2026 — cần token Sec-MS-GEC. Chọn vào thì robot sẽ im.',
  },
  {
    provider: 'openai',
    label: 'OpenAI (trả tiền)',
    voices: [
      { id: 'onyx', label: 'Onyx — nam, trầm' },
      { id: 'nova', label: 'Nova — nữ, sáng' },
      { id: 'echo', label: 'Echo — nam, trung tính' },
      { id: 'fable', label: 'Fable — kể chuyện' },
      { id: 'alloy', label: 'Alloy — trung tính' },
      { id: 'shimmer', label: 'Shimmer — nữ, mềm' },
    ],
    status: 'need-key',
    note: 'Tài khoản OpenAI đang HẾT CREDIT. Nạp tiền vào openai.com là dùng được ngay — cổng modelapi.vn không bán TTS nên 500 $ ở đó không mua được giọng.',
  },
  {
    provider: 'elevenlabs',
    label: 'ElevenLabs (nhân bản giọng CỦA BẠN)',
    voices: [],
    status: 'need-key',
    note: 'Thu 3 phút giọng bạn, tạo voice trên elevenlabs.io, rồi dán voice id vào ô dưới. Đây là con đường duy nhất để robot nói bằng chính giọng bạn. Cần ELEVENLABS_API_KEY trong .env của VPS.',
  },
];

const STATUS_STYLE: Record<VoiceOption['status'], { dot: string; text: string }> = {
  ok: { dot: 'bg-emerald-500', text: 'đang chạy' },
  down: { dot: 'bg-red-500', text: 'đang hỏng' },
  'need-key': { dot: 'bg-amber-500', text: 'cần khoá' },
};

interface Props {
  projectId: number;
  persona: MakerPersona | null;
  devices: MakerDevice[];
  accent: string;
}

export default function PersonaEditor({ projectId, persona, devices, accent }: Props) {
  const [prompt, setPrompt] = useState(persona?.systemPrompt ?? '');
  const [provider, setProvider] = useState(persona?.voiceProvider ?? 'google');
  const [voiceId, setVoiceId] = useState(persona?.voiceId ?? '');
  const [temperature, setTemperature] = useState(persona?.temperature ?? 0.9);
  const [maxTokens, setMaxTokens] = useState(persona?.maxTokens ?? 420);
  const [samples, setSamples] = useState<Array<{ user: string; bot: string }>>(
    Array.isArray(persona?.sampleDialogues) && persona.sampleDialogues.length
      ? (persona.sampleDialogues as Array<{ user: string; bot: string }>)
      : [{ user: '', bot: '' }],
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  /**
   * Giọng của dịch vụ tự dựng — NẠP TỪ MÁY CHỦ, không viết cứng.
   *
   * Giọng nhân bản do người dùng tự đặt tên lúc tải mẫu lên, nên mã
   * nguồn không thể biết trước. Bản đầu tiên của thẻ này để mảng rỗng
   * và người dùng báo ngay: nhân bản xong giọng "Trangg" mà trong ô
   * chọn không thấy đâu cả.
   */
  const [giongTuDung, setGiongTuDung] = useState<Array<{ id: string; label: string }>>([]);
  const [dangNapGiong, setDangNapGiong] = useState(false);

  useEffect(() => {
    if (provider !== 'cuongmini' || giongTuDung.length) return;
    setDangNapGiong(true);
    listVoices()
      .then(setGiongTuDung)
      .catch(() => setGiongTuDung([]))
      .finally(() => setDangNapGiong(false));
  }, [provider, giongTuDung.length]);

  const current = VOICES.find((v) => v.provider === provider) ?? VOICES[0];
  const online = devices.find((d) => d.status === 'ONLINE');

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await updatePersona(projectId, {
        systemPrompt: prompt,
        voiceProvider: provider,
        voiceId: voiceId || null,
        temperature,
        maxTokens,
        sampleDialogues: samples.filter((s) => s.user.trim() && s.bot.trim()),
      });
      setMsg({ kind: 'ok', text: 'Đã lưu. Lượt nói tiếp theo dùng ngay bản này — không cần deploy.' });
    } catch (e) {
      setMsg({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Lưu thất bại',
      });
    } finally {
      setSaving(false);
    }
  }

  /** Bắt robot nói một câu để nghe giọng — nhanh hơn nhiều so với đoán. */
  async function hearIt() {
    if (!online) return;
    setTesting(true);
    setMsg(null);
    try {
      await sayOnDevice(online.id, 'Nghe thử giọng đây. Được chưa hay đổi con khác?');
      setMsg({ kind: 'ok', text: `Đã gửi xuống ${online.name}. Nghe ở loa robot.` });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Không gửi được' });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Giọng nói ── */}
      <section>
        <h3
          className="flex items-center gap-2 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Volume2 className="h-5 w-5" style={{ color: accent }} />
          Giọng nói
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VOICES.map((v) => {
            const on = v.provider === provider;
            const st = STATUS_STYLE[v.status];
            return (
              <button
                key={v.provider}
                type="button"
                onClick={() => {
                  setProvider(v.provider);
                  setVoiceId(v.voices[0]?.id ?? '');
                }}
                className="rounded-xl border p-4 text-left transition"
                style={{
                  borderColor: on ? accent : 'var(--border-color)',
                  background: on ? `${accent}12` : 'var(--bg-card)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {v.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                    {st.text}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {v.note}
                </p>
              </button>
            );
          })}
        </div>

        {/* cuongmini: danh sách nạp từ máy chủ nên `current.voices` luôn
            rỗng — phải xét riêng, nếu không ô chọn giọng không bao giờ
            hiện ra. Đúng lỗi người dùng gặp ngày 12/08/2026. */}
        {(current.voices.length > 1 || current.provider === 'cuongmini') && (
          <div className="mt-4">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Chọn giọng
            </label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
            >
              {(current.provider === 'cuongmini' ? giongTuDung : current.voices).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            {current.provider === 'cuongmini' && (
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                {dangNapGiong
                  ? 'Đang lấy danh sách giọng từ máy chủ…'
                  : giongTuDung.length
                    ? `${giongTuDung.length} giọng — nhân bản thêm ở trang /voice-mini`
                    : 'Không lấy được danh sách. Máy tính chạy giọng có thể đang tắt — robot vẫn nói được bằng giọng Google.'}
              </p>
            )}
          </div>
        )}

        {current.provider === 'elevenlabs' && (
          <div className="mt-4">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Voice ID (lấy trên elevenlabs.io)
            </label>
            <input
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              placeholder="ví dụ 21m00Tcm4TlvDq8ikWAM"
              className="mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-sm"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        )}

        {current.status !== 'ok' && (
          <p
            className="mt-3 flex items-start gap-2 rounded-lg p-3 text-xs"
            style={{ background: 'rgba(245,158,11,0.10)', color: 'var(--text-secondary)' }}
          >
            <AlertTriangle className="mt-px h-4 w-4 shrink-0 text-amber-500" />
            Chọn nhà này mà chưa có khoá thì robot sẽ IM, và lỗi chỉ hiện trong log
            server chứ không hiện ở đây. Lưu xong nhớ bấm “Nghe thử” để chắc.
          </p>
        )}
      </section>

      {/* ── Tính cách ── */}
      <section>
        <h3
          className="flex items-center gap-2 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Mic2 className="h-5 w-5" style={{ color: accent }} />
          Tính cách
        </h3>

        <label className="mt-4 block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Lời dặn cho robot
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={12}
          className="mt-1.5 w-full rounded-lg border p-3 font-mono text-xs leading-relaxed"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
          }}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Độ ngẫu hứng: {temperature.toFixed(2)}
            </label>
            <input
              type="range"
              min={0}
              max={1.2}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="mt-2 w-full"
              style={{ accentColor: accent }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Thấp = an toàn và nhạt. Cao = chém gió bay bổng nhưng dễ lạc đề. 0.9 đang hợp.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Độ dài tối đa: {maxTokens} token
            </label>
            <input
              type="range"
              min={120}
              max={800}
              step={20}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="mt-2 w-full"
              style={{ accentColor: accent }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Dài hơn thì TTS lâu hơn, tức bạn chờ lâu hơn trước khi robot mở miệng.
              420 ≈ hai tới bốn câu.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mẫu đối thoại ── */}
      <section>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Mẫu đối thoại
          </h3>
          <button
            type="button"
            onClick={() => setSamples([...samples, { user: '', bot: '' }])}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Plus className="h-4 w-4" /> Thêm
          </button>
        </div>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Đây mới là thứ tạo ra giọng, quan trọng hơn ô lời dặn ở trên. Bảo model
          “hãy hỗn” thì được một model đang <em>diễn</em> cảnh hỗn; cho nó xem vài câu
          thật thì nó bắt chước nhịp và kiểu đùa. Muốn robot nói giống bạn thì điền
          vào đây những câu <strong>bạn</strong> đã từng nói.
        </p>

        <div className="mt-4 space-y-3">
          {samples.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border p-3"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    value={s.user}
                    onChange={(e) => {
                      const n = [...samples];
                      n[i] = { ...n[i], user: e.target.value };
                      setSamples(n);
                    }}
                    placeholder="Người ta nói gì…"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <input
                    value={s.bot}
                    onChange={(e) => {
                      const n = [...samples];
                      n[i] = { ...n[i], bot: e.target.value };
                      setSamples(n);
                    }}
                    placeholder="Robot đáp lại…"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSamples(samples.filter((_, j) => j !== i))}
                  className="rounded-lg p-2 transition hover:bg-red-500/10"
                  aria-label="Xoá mẫu này"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lưu ── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
          style={{ background: accent }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Lưu
        </button>

        <button
          type="button"
          onClick={hearIt}
          disabled={!online || testing}
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition disabled:opacity-50"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          title={online ? `Phát trên ${online.name}` : 'Chưa có robot nào ONLINE'}
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
          Nghe thử trên robot
        </button>

        {msg && (
          <span
            className="text-sm"
            style={{ color: msg.kind === 'ok' ? '#10b981' : '#ef4444' }}
          >
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
