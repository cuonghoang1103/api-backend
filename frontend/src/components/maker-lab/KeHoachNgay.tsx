'use client';

/**
 * Kế hoạch trong ngày — robot nhắc, bạn tích xanh.
 *
 * Hai phần: HÔM NAY (thứ nhìn hằng ngày) và DANH SÁCH (thứ sửa thỉnh
 * thoảng). Đặt hôm nay lên trước vì đó là việc mở trang ra để làm.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Check, Clock, Plus, Trash2, X, RotateCcw, AlarmClock, Pencil, CalendarDays,
} from 'lucide-react';
import {
  listPlans, planToday, createPlan, updatePlan, deletePlan, chotLuot,
  type MakerPlan, type MucHomNay, type TomTatNgay, type MakerPlanKind,
} from '@/lib/maker-lab-api';

const KIEU: Array<{ id: MakerPlanKind; nhan: string }> = [
  { id: 'DAILY', nhan: 'Mỗi ngày' },
  { id: 'WEEKDAYS', nhan: 'Thứ 2 → 6' },
  { id: 'WEEKLY', nhan: 'Chọn thứ' },
  { id: 'ONCE', nhan: 'Một lần' },
];

const TEN_THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

interface Props {
  projectId: number;
  accent: string;
}

export default function KeHoachNgay({ projectId, accent }: Props) {
  const [muc, setMuc] = useState<MucHomNay[]>([]);
  const [tt, setTt] = useState<TomTatNgay>({ tong: 0, xong: 0, conLai: 0, loQua: 0 });
  const [plans, setPlans] = useState<MakerPlan[]>([]);
  const [dangNap, setDangNap] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [mo, setMo] = useState(false);
  const [suaId, setSuaId] = useState<number | null>(null);

  const nap = useCallback(async () => {
    try {
      const [t, p] = await Promise.all([planToday(), listPlans()]);
      setMuc(t.muc);
      setTt(t.tomTat);
      setPlans(p);
      setLoi(null);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Không nạp được kế hoạch');
    } finally {
      setDangNap(false);
    }
  }, []);

  useEffect(() => {
    void nap();
    // Nạp lại mỗi phút: robot có thể vừa nhắc hoặc bạn vừa nói "xong
    // rồi" ngoài phòng, và màn hình này phải theo kịp mà không cần F5.
    const t = setInterval(() => void nap(), 60_000);
    return () => clearInterval(t);
  }, [nap]);

  async function bam(planId: number, kieu: 'xong' | 'bo-qua' | 'hoan' | 'mo-lai') {
    try {
      await chotLuot(planId, kieu);
      await nap();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Thao tác thất bại');
    }
  }

  const dangSua = suaId ? plans.find((p) => p.id === suaId) ?? null : null;

  return (
    <div className="space-y-6">
      {loi && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ background: 'rgba(239,68,68,.12)', color: '#f87171' }}
        >
          {loi}
        </div>
      )}

      {/* ── Hôm nay ── */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3
            className="flex items-center gap-2 text-base font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            <CalendarDays size={18} style={{ color: accent }} /> Hôm nay
          </h3>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>
              <strong style={{ color: accent }}>{tt.xong}</strong>/{tt.tong} xong
            </span>
            {tt.loQua > 0 && <span style={{ color: '#f59e0b' }}>{tt.loQua} lỡ</span>}
          </div>
        </div>

        {tt.tong > 0 && (
          <div
            className="mb-4 h-2 w-full overflow-hidden rounded-full"
            style={{ background: 'var(--border-color)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.round((tt.xong / tt.tong) * 100)}%`, background: accent }}
            />
          </div>
        )}

        {dangNap ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Đang nạp…</p>
        ) : !muc.length ? (
          <p
            className="rounded-xl border border-dashed px-4 py-8 text-center text-sm"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
          >
            Hôm nay chưa có việc nào. Thêm ở dưới, rồi robot sẽ tự nhắc đúng giờ.
          </p>
        ) : (
          <ul className="space-y-2">
            {muc.map((m) => (
              <DongViec key={m.planId} m={m} accent={accent} onBam={bam} />
            ))}
          </ul>
        )}
      </section>

      {/* ── Danh sách kế hoạch ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Tất cả kế hoạch ({plans.length})
          </h3>
          <button
            type="button"
            onClick={() => { setSuaId(null); setMo(true); }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{ background: accent, color: '#0f172a' }}
          >
            <Plus size={15} /> Thêm việc
          </button>
        </div>

        <ul className="space-y-2">
          {plans.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--bg-surface)',
                opacity: p.active ? 1 : 0.5,
              }}
            >
              <span
                className="rounded px-2 py-0.5 font-mono text-sm tabular-nums"
                style={{ background: 'var(--bg-base)', color: accent }}
              >
                {p.gioChu ?? docGioFE(p.gio)}
              </span>
              <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                {p.title}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {nhanKieu(p)}
                {p.nhacTruoc > 0 && ` · nhắc sớm ${p.nhacTruoc}′`}
              </span>
              <button
                type="button"
                aria-label={p.active ? 'Tạm tắt' : 'Bật lại'}
                onClick={() => void updatePlan(p.id, { active: !p.active }).then(nap)}
                className="rounded px-2 py-1 text-xs"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-base)' }}
              >
                {p.active ? 'Đang bật' : 'Đã tắt'}
              </button>
              <button
                type="button"
                aria-label="Sửa"
                onClick={() => { setSuaId(p.id); setMo(true); }}
                style={{ color: 'var(--text-muted)' }}
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                aria-label="Xoá"
                onClick={async () => {
                  if (!window.confirm(`Xoá "${p.title}"? Cả lịch sử làm việc của nó cũng mất.`)) return;
                  await deletePlan(p.id);
                  await nap();
                }}
                style={{ color: '#f87171' }}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {mo && (
        <FormViec
          projectId={projectId}
          accent={accent}
          plan={dangSua}
          onDong={() => setMo(false)}
          onXong={async () => { setMo(false); await nap(); }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════

function DongViec({
  m, accent, onBam,
}: {
  m: MucHomNay;
  accent: string;
  onBam: (planId: number, kieu: 'xong' | 'bo-qua' | 'hoan' | 'mo-lai') => void;
}) {
  const xong = m.state === 'DONE';
  const bo = m.state === 'SKIPPED';
  const lo = m.state === 'MISSED';
  const cho = m.state === 'PENDING'; // tới giờ rồi mà chưa làm

  return (
    <li
      className="flex flex-wrap items-center gap-3 rounded-xl border px-3 py-3"
      style={{
        borderColor: cho ? accent : 'var(--border-color)',
        background: 'var(--bg-surface)',
        opacity: xong || bo ? 0.6 : 1,
      }}
    >
      <button
        type="button"
        aria-label={xong ? 'Bỏ tích' : 'Đánh dấu xong'}
        onClick={() => onBam(m.planId, xong ? 'mo-lai' : 'xong')}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors"
        style={{
          borderColor: xong ? accent : 'var(--border-color)',
          background: xong ? accent : 'transparent',
          color: xong ? '#0f172a' : 'var(--text-muted)',
        }}
      >
        {xong && <Check size={16} strokeWidth={3} />}
      </button>

      <span
        className="rounded px-2 py-0.5 font-mono text-sm tabular-nums"
        style={{ background: 'var(--bg-base)', color: lo ? '#f59e0b' : accent }}
      >
        {m.gioChu}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm"
          style={{
            color: 'var(--text-primary)',
            textDecoration: xong || bo ? 'line-through' : 'none',
          }}
        >
          {m.title}
        </p>
        {m.huongDan && (
          <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-muted)' }}>
            {m.huongDan}
          </p>
        )}
      </div>

      <span className="text-xs" style={{ color: lo ? '#f59e0b' : 'var(--text-muted)' }}>
        {xong ? 'xong' : bo ? 'bỏ qua' : lo ? 'đã lỡ' : cho ? 'đang chờ' : 'chưa tới'}
      </span>

      {!xong && !bo && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Hoãn 10 phút"
            title="Hoãn 10 phút"
            onClick={() => onBam(m.planId, 'hoan')}
            className="rounded p-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <Clock size={15} />
          </button>
          <button
            type="button"
            aria-label="Bỏ qua hôm nay"
            title="Bỏ qua hôm nay"
            onClick={() => onBam(m.planId, 'bo-qua')}
            className="rounded p-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {(xong || bo) && (
        <button
          type="button"
          aria-label="Mở lại"
          title="Bấm nhầm? Mở lại"
          onClick={() => onBam(m.planId, 'mo-lai')}
          className="rounded p-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          <RotateCcw size={15} />
        </button>
      )}
    </li>
  );
}

// ════════════════════════════════════════════════════════════

function FormViec({
  projectId, accent, plan, onDong, onXong,
}: {
  projectId: number;
  accent: string;
  plan: MakerPlan | null;
  onDong: () => void;
  onXong: () => void;
}) {
  const [title, setTitle] = useState(plan?.title ?? '');
  const [gio, setGio] = useState(plan ? docGioFE(plan.gio) : '07:00');
  const [kind, setKind] = useState<MakerPlanKind>(plan?.kind ?? 'DAILY');
  const [thu, setThu] = useState<number[]>(plan?.thu ?? [1, 3, 5]);
  const [ngayMot, setNgayMot] = useState(plan?.ngayMot ?? '');
  const [huongDan, setHuongDan] = useState(plan?.huongDan ?? '');
  const [nhacTruoc, setNhacTruoc] = useState(plan?.nhacTruoc ?? 0);
  const [luu, setLuu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  async function ghi() {
    setLuu(true);
    setLoi(null);
    try {
      const body = {
        title, gio, kind, thu, huongDan, nhacTruoc,
        ngayMot: kind === 'ONCE' ? ngayMot : null,
        projectId,
      };
      if (plan) await updatePlan(plan.id, body);
      else await createPlan(body);
      onXong();
    } catch (e) {
      setLoi(e instanceof Error ? e.message : 'Lưu thất bại');
    } finally {
      setLuu(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: 'rgba(0,0,0,.55)' }}
      onClick={onDong}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-5"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {plan ? 'Sửa việc' : 'Thêm việc mới'}
        </h3>

        <div className="space-y-4">
          <O nhan="Làm gì">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tập thể dục"
              autoFocus
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={o()}
            />
          </O>

          <div className="grid grid-cols-2 gap-4">
            <O nhan="Mấy giờ">
              <input
                type="time"
                value={gio}
                onChange={(e) => setGio(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={o()}
              />
            </O>
            <O nhan={`Nhắc sớm ${nhacTruoc} phút`}>
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={nhacTruoc}
                onChange={(e) => setNhacTruoc(Number(e.target.value))}
                className="mt-3 w-full"
                style={{ accentColor: accent }}
              />
            </O>
          </div>

          <O nhan="Lặp lại">
            <div className="flex flex-wrap gap-2">
              {KIEU.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: kind === k.id ? accent : 'var(--bg-base)',
                    color: kind === k.id ? '#0f172a' : 'var(--text-muted)',
                  }}
                >
                  {k.nhan}
                </button>
              ))}
            </div>
          </O>

          {kind === 'WEEKLY' && (
            <O nhan="Những thứ nào">
              <div className="flex flex-wrap gap-2">
                {TEN_THU.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setThu((cu) => (cu.includes(i) ? cu.filter((x) => x !== i) : [...cu, i].sort()))
                    }
                    className="h-9 w-11 rounded-lg text-xs font-medium"
                    style={{
                      background: thu.includes(i) ? accent : 'var(--bg-base)',
                      color: thu.includes(i) ? '#0f172a' : 'var(--text-muted)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </O>
          )}

          {kind === 'ONCE' && (
            <O nhan="Ngày nào">
              <input
                type="date"
                value={ngayMot}
                onChange={(e) => setNgayMot(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={o()}
              />
            </O>
          )}

          <O nhan="Hướng dẫn (robot đọc lên khi bạn hỏi)">
            <textarea
              value={huongDan}
              onChange={(e) => setHuongDan(e.target.value)}
              rows={3}
              placeholder="Chống đẩy 20 cái rồi plank một phút."
              className="w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none"
              style={o()}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Dưới 180 ký tự thì robot đọc luôn lúc nhắc. Dài hơn thì nó chỉ nói
              &ldquo;cần hướng dẫn thì bảo tôi&rdquo;, và bạn hỏi &ldquo;hướng dẫn đi&rdquo;.
            </p>
          </O>
        </div>

        {loi && (
          <p className="mt-3 text-sm" style={{ color: '#f87171' }}>{loi}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onDong}
            className="rounded-lg px-4 py-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Huỷ
          </button>
          <button
            type="button"
            disabled={luu || !title.trim()}
            onClick={() => void ghi()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40"
            style={{ background: accent, color: '#0f172a' }}
          >
            <AlarmClock size={15} /> {luu ? 'Đang lưu…' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── vụn ───

function O({ nhan, children }: { nhan: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {nhan}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function o() {
  return {
    borderColor: 'var(--border-color)',
    background: 'var(--bg-base)',
    color: 'var(--text-primary)',
  };
}

/** Bản dự phòng khi máy chủ chưa gửi `gioChu`. */
function docGioFE(phut: number): string {
  const p = ((phut % 1440) + 1440) % 1440;
  return `${String(Math.floor(p / 60)).padStart(2, '0')}:${String(p % 60).padStart(2, '0')}`;
}

function nhanKieu(p: MakerPlan): string {
  switch (p.kind) {
    case 'DAILY': return 'mỗi ngày';
    case 'WEEKDAYS': return 'T2–T6';
    case 'WEEKLY': return p.thu.map((i) => TEN_THU[i]).join(' ');
    case 'ONCE': return p.ngayMot ?? 'một lần';
    default: return '';
  }
}
