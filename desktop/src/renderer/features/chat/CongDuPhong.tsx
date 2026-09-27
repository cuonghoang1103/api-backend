/**
 * ============================================================
 * CỔNG DỰ PHÒNG cho AI Code (27/09/2026)
 * ============================================================
 *
 * Người dùng: *"Khi cổng Rambo không hoạt động sẽ hiện ra thông báo: AI
 * CuongMini đang bảo trì, bạn có muốn dùng cổng dự phòng không? Ấn có thì
 * phải nhập mật khẩu (admin tạo) mới được dùng. Ở mục chọn model cũng có
 * 'dùng cổng dự phòng' để ấn vào nhập mật khẩu luôn."*
 *
 * App chỉ HỎI mật khẩu và GIỮ VÉ (thiết đặt `agentDuPhongVe`, gửi kèm mỗi
 * lượt ở `main/agent/loop.ts`). Máy chủ quyết định có dùng vé hay không:
 * rambo khoẻ ⇒ bỏ qua vé, đi rambo — nên không có nút "quay về" nào cả, và
 * để vé nằm đó cũng không tốn tiền.
 *
 *   · `useCongDuPhong`  — đọc `GET /api/v1/agent/du-phong` (+ vé đang giữ)
 *   · `MoCongDuPhong`   — ô mật khẩu → `POST /api/v1/agent/du-phong/mo-khoa`
 */
import { useCallback, useEffect, useState } from 'react';
import { LifeBuoy, KeyRound, Check } from 'lucide-react';
import { useSession } from '../../auth/session';

export interface TrangThaiDuPhong {
  coCongChinh: boolean;
  congChinhDangHong: boolean;
  daBat: boolean;
  coKhoa: boolean;
  model: string;
  ten: string;
  veHopLe: boolean;
  /** Model chọn được ở cổng dự phòng (máy chủ cũ không trả ⇒ không hiện chọn). */
  models?: Array<{ id: string; ten: string; mo: string; dungDuoc: boolean }>;
  macDinh?: string;
}

async function docModelChon(): Promise<string> {
  try {
    const s = await window.cuongthai?.settings.getAll();
    const v = s?.agentDuPhongModel;
    return typeof v === 'string' ? v : '';
  } catch {
    return '';
  }
}

/**
 * Chọn model ở cổng dự phòng: 6 Sol (mặc định) hoặc 6 Astra cho việc khó.
 * Người dùng chốt 27/09/2026 — chỉ hai lựa chọn này, không có Claude (trên
 * modelapi Claude đắt ~14 lần).
 */
export function ChonModelDuPhong({ t }: { t: TrangThaiDuPhong }) {
  const [chon, datChon] = useState('');
  useEffect(() => { void docModelChon().then(datChon); }, []);
  if (!t.models?.length) return null;
  const hienTai = chon || t.macDinh || t.models[0]!.id;
  return (
    <div className="ct-duphong-model" role="radiogroup" aria-label="Model ở cổng dự phòng">
      {t.models.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={m.id === hienTai}
          data-chon={m.id === hienTai}
          disabled={!m.dungDuoc}
          title={m.dungDuoc ? m.mo : 'Máy chủ chưa cắm khoá cho model này'}
          onClick={() => {
            datChon(m.id);
            void window.cuongthai?.settings.set('agentDuPhongModel', m.id);
          }}
        >
          {m.id === hienTai ? <Check size={11} aria-hidden /> : <span className="ct-chonmm-o" />}
          <span><strong>{m.ten}</strong><em>{m.mo}</em></span>
        </button>
      ))}
    </div>
  );
}

async function docVe(): Promise<string> {
  try {
    const s = await window.cuongthai?.settings.getAll();
    const v = s?.agentDuPhongVe;
    return typeof v === 'string' ? v : '';
  } catch {
    return '';
  }
}

export function useCongDuPhong(bat: boolean): { t: TrangThaiDuPhong | null; napLai: () => void } {
  const { api } = useSession();
  const [t, datT] = useState<TrangThaiDuPhong | null>(null);
  const napLai = useCallback(() => {
    if (!api) return;
    void docVe().then((ve) =>
      api.request<TrangThaiDuPhong>(`/api/v1/agent/du-phong${ve ? `?ve=${encodeURIComponent(ve)}` : ''}`)
        .then(datT)
        /* Máy chủ cũ chưa có route ⇒ 404 ⇒ im lặng, không hiện mục dự phòng. */
        .catch(() => datT(null)),
    );
  }, [api]);
  useEffect(() => { if (bat) napLai(); }, [bat, napLai]);
  return { t, napLai };
}

/** Câu trạng thái ngắn cho menu model. */
export function moTaDuPhong(t: TrangThaiDuPhong | null): string {
  if (!t) return '';
  if (!t.daBat) return 'Quản trị chưa bật';
  if (!t.coKhoa) return 'Máy chủ chưa cắm khoá cho model dự phòng';
  if (t.veHopLe) {
    return t.congChinhDangHong
      ? `ĐANG DÙNG — ${t.ten}. Cổng chính sống lại là tự quay về`
      : `Đã mở khoá — chỉ dùng khi cổng chính hỏng (${t.ten})`;
  }
  return `${t.ten} · tính phí thật · cần mật khẩu`;
}

/**
 * Hộp mở khoá. `baoTri` = hiện dưới lỗi `RAMBO_BAO_TRI` (có câu hỏi "có muốn
 * dùng không?"); không có thì là bản gọn trong menu model.
 */
export function MoCongDuPhong({ baoTri = false, onXong }: { baoTri?: boolean; onXong?: () => void }) {
  const { api } = useSession();
  const { t, napLai } = useCongDuPhong(true);
  const [moO, datMoO] = useState(!baoTri);
  const [matKhau, datMatKhau] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [xong, datXong] = useState(false);

  const gui = async (): Promise<void> => {
    if (!api || dangGui || !matKhau) return;
    datDangGui(true);
    datLoi(null);
    try {
      const kq = await api.request<{ ve: string; ten: string }>('/api/v1/agent/du-phong/mo-khoa', {
        method: 'POST',
        body: { matKhau },
      });
      await window.cuongthai?.settings.set('agentDuPhongVe', kq.ve);
      datMatKhau('');
      datXong(true);
      napLai();
      onXong?.();
    } catch (e) {
      datLoi(e instanceof Error ? e.message : 'Không mở khoá được.');
    } finally {
      datDangGui(false);
    }
  };

  const tat = async (): Promise<void> => {
    await window.cuongthai?.settings.set('agentDuPhongVe', '');
    datXong(false);
    napLai();
  };

  if (t && !t.daBat) {
    return baoTri
      ? <p className="ct-duphong-chu">Quản trị chưa bật cổng dự phòng — hãy thử lại sau ít phút.</p>
      : null;
  }

  if (xong || t?.veHopLe) {
    return (
      <div className="ct-duphong" data-xong="true">
        <p className="ct-duphong-chu">
          <Check size={12} aria-hidden /> Đã bật cổng dự phòng{t ? ` — ${t.ten}` : ''}.
          {baoTri ? ' Gửi lại câu hỏi (hoặc gõ "tiếp tục") để làm tiếp.' : ''} Cổng chính sống lại là
          tự quay về, không phải chỉnh gì.
        </p>
        {t && <ChonModelDuPhong t={t} />}
        {!baoTri && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void tat()}>
            Thu hồi trên máy này
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="ct-duphong">
      {baoTri && !moO && (
        <>
          <p className="ct-duphong-chu">
            <LifeBuoy size={12} aria-hidden /> Bạn có muốn dùng <strong>cổng dự phòng</strong>
            {t ? ` (${t.ten})` : ''} không? Cổng này <strong>tính phí thật</strong>, chỉ chạy khi cổng chính hỏng.
          </p>
          <div className="ct-duphong-hang">
            <button type="button" className="ct-btn" onClick={() => datMoO(true)}>Có, dùng cổng dự phòng</button>
          </div>
        </>
      )}
      {moO && (
        <form
          className="ct-duphong-hang"
          onSubmit={(e) => { e.preventDefault(); void gui(); }}
        >
          <KeyRound size={13} aria-hidden />
          <input
            type="password"
            className="ct-duphong-o"
            placeholder="Mật khẩu cổng dự phòng"
            autoComplete="off"
            value={matKhau}
            autoFocus
            onChange={(e) => datMatKhau(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button type="submit" className="ct-btn" disabled={dangGui || !matKhau}>
            {dangGui ? 'Đang kiểm…' : 'Mở khoá'}
          </button>
        </form>
      )}
      {loi && <p className="ct-duphong-loi">{loi}</p>}
    </div>
  );
}
