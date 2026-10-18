/**
 * ============================================================
 * CỔNG CLAUDE CHÍNH HÃNG cho AI Code (17/10/2026)
 * ============================================================
 *
 * Hợp đồng: `docs/cong-anthropic-chinh-hang.md` (mục "Việc client").
 *
 *   · `MoCongAnthropic` — ô mật khẩu RIÊNG của cổng này ⇒ main gọi
 *     `POST /agent/cong-anthropic/mo-khoa` bằng phiên của app và giữ vé
 *     (`agentAnthropicVe`). Cùng phong cách với `MoCongDuPhong`.
 *   · `MoiNangCapCong` — thẻ hiện dưới thông báo `CONG_CHINH_HONG_FREE`: cổng
 *     chính hỏng, máy chủ đã TỰ chuyển sang CuongMini Free; người dùng có thể
 *     chọn Claude chính hãng (model cao, mật khẩu riêng) hoặc modelapi (GPT,
 *     mật khẩu dự phòng). Mỗi nút mở đúng ô mật khẩu của cổng đó, rồi chọn model.
 *
 * App chỉ HỎI mật khẩu và GIỮ VÉ; máy chủ quyết định đi đâu. Vé sai/chết ⇒ máy
 * chủ báo `CONG_ANTHROPIC_KHOA`, main tự xoá vé và giao diện hỏi lại ở đây.
 */
import { useState } from 'react';
import { Check, KeyRound, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import type { AgentCongNangCap } from '../../../shared/ipc';
import { useDich } from '../../i18n';
import { MoCongDuPhong } from './CongDuPhong';

/**
 * Ô nhập KHOÁ model CuongMini (18/10/2026: khoá chung hoặc khoá riêng Invisible —
 * máy chủ tự nhận khoá nào). `model` = mã model vừa bấm (máy chủ báo sai nếu khoá
 * không mở được đúng model đó). `daBat === false` ⇒ chỉ báo "Quản trị chưa bật".
 */
export function MoCongAnthropic({ onXong, daBat, model }: { onXong?: () => void; daBat?: boolean; model?: string }) {
  const { dich } = useDich();
  const [matKhau, datMatKhau] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [xong, datXong] = useState(false);

  if (daBat === false) {
    return <p className="ct-duphong-chu">{dich('Quản trị chưa đặt khoá cho model này — hãy thử lại sau.')}</p>;
  }
  if (xong) {
    return (
      <p className="ct-duphong-chu" data-xong="true">
        <Check size={12} aria-hidden /> {dich('Đã mở khoá trên máy này (vé 48 giờ).')}
      </p>
    );
  }

  const gui = async (): Promise<void> => {
    if (dangGui || !matKhau) return;
    datDangGui(true);
    datLoi(null);
    try {
      await window.cuongthai?.agent.moCongAnthropic(matKhau, model);
      datMatKhau('');
      datXong(true);
      onXong?.();
    } catch (e) {
      /* Lỗi qua IPC mang tiền tố "Error invoking remote method…" — chỉ giữ câu của máy chủ. */
      const chu = e instanceof Error ? e.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, '') : '';
      datLoi(chu || dich('Không mở khoá được.'));
    } finally {
      datDangGui(false);
    }
  };

  return (
    <div className="ct-duphong">
      <form className="ct-duphong-hang" onSubmit={(e) => { e.preventDefault(); void gui(); }}>
        <KeyRound size={13} aria-hidden />
        <input
          type="password"
          className="ct-duphong-o"
          placeholder={dich('Khoá CuongMini')}
          autoComplete="off"
          value={matKhau}
          autoFocus
          onChange={(e) => datMatKhau(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
        />
        <button type="submit" className="ct-btn" disabled={dangGui || !matKhau}>
          {dangGui ? dich('Đang kiểm…') : dich('Mở khoá')}
        </button>
      </form>
      {loi && <p className="ct-duphong-loi">{loi}</p>}
    </div>
  );
}

/** Danh sách model của MỘT cổng để chọn sau khi đã mở khoá. */
function ChonModelCong({
  models, onChon, daChon,
}: {
  models: AgentCongNangCap['models'];
  onChon: (id: string) => void;
  daChon: string | null;
}) {
  const { dich } = useDich();
  if (!models.length) return <p className="ct-duphong-chu">{dich('Cổng này chưa có model nào dùng được.')}</p>;
  return (
    <div className="ct-duphong-model" role="radiogroup" aria-label={dich('Chọn model')}>
      {models.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={m.id === daChon}
          data-chon={m.id === daChon}
          disabled={!m.dungDuoc}
          title={m.dungDuoc ? m.mo : dich('Máy chủ chưa cắm khoá cho model này')}
          onClick={() => {
            if (m.dat && !window.confirm(dich('Model này đắt hơn hẳn các model khác. Vẫn chọn?'))) return;
            onChon(m.id);
          }}
        >
          {m.id === daChon ? <Check size={11} aria-hidden /> : <span className="ct-chonmm-o" />}
          <span><strong>{m.ten}</strong><em>{m.mo}</em></span>
        </button>
      ))}
    </div>
  );
}

/**
 * Lời mời nâng cấp khi máy chủ đã tự sang CuongMini Free.
 *
 * `onChonModelAnthropic` = đổi model của app sang `cl-*` (thiết đặt chung, như
 * menu model). Chọn modelapi thì KHÔNG đổi model của app: tab gửi
 * `congPhu:'modelapi'` + vé/ model dự phòng (`agent:datCongPhu`).
 */
export function MoiNangCapCong({
  cuocId, cacCong, onChonModelAnthropic,
}: {
  cuocId: string;
  cacCong: AgentCongNangCap[];
  onChonModelAnthropic: (id: string) => Promise<void> | void;
}) {
  const { dich } = useDich();
  const [mo, datMo] = useState<'anthropic' | 'modelapi' | null>(null);
  /** Đã mở khoá xong (hoặc vốn không cần mật khẩu) cho cổng đang mở. */
  const [daMo, datDaMo] = useState<Record<string, boolean>>({});
  const [daChon, datDaChon] = useState<{ cong: string; id: string } | null>(null);

  const anthropic = cacCong.find((c) => c.cong === 'anthropic');
  const modelapi = cacCong.find((c) => c.cong === 'modelapi');
  const cong = mo === 'anthropic' ? anthropic : mo === 'modelapi' ? modelapi : undefined;
  const moKhoaXong = (c: AgentCongNangCap | undefined): boolean => !!c && (!c.canMatKhau || daMo[c.cong] === true);

  const chon = async (id: string): Promise<void> => {
    if (mo === 'anthropic') {
      await onChonModelAnthropic(id);
      /* Model `cl-*` đi thẳng cổng chính hãng ⇒ tab không cần "giữ cổng phụ" nữa. */
      await window.cuongthai?.agent.datCongPhu(cuocId, null);
    } else if (mo === 'modelapi') {
      await window.cuongthai?.agent.datCongPhu(cuocId, 'modelapi', id);
    }
    datDaChon({ cong: mo ?? '', id });
  };

  if (daChon) {
    const ten = cong?.models.find((m) => m.id === daChon.id)?.ten ?? daChon.id;
    return (
      <p className="ct-duphong-chu" data-xong="true">
        <Check size={12} aria-hidden /> {dich('Đã chọn')} <strong>{ten}</strong>.{' '}
        {dich('Gửi lại câu hỏi (hoặc gõ "tiếp tục") để làm tiếp.')}
      </p>
    );
  }

  return (
    <div className="ct-moi-nang-cap">
      <div className="ct-duphong-hang">
        {anthropic && (
          <button
            type="button"
            className="ct-btn"
            data-chon={mo === 'anthropic'}
            disabled={!anthropic.daBat}
            title={anthropic.daBat ? undefined : dich('Quản trị chưa bật cổng này')}
            onClick={() => datMo(mo === 'anthropic' ? null : 'anthropic')}
          >
            <Sparkles size={12} aria-hidden /> {dich('Dùng Claude chính hãng (model cao hơn)')}
          </button>
        )}
        {modelapi && (
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            data-chon={mo === 'modelapi'}
            disabled={!modelapi.daBat}
            title={modelapi.daBat ? undefined : dich('Quản trị chưa bật cổng này')}
            onClick={() => datMo(mo === 'modelapi' ? null : 'modelapi')}
          >
            <ShieldCheck size={12} aria-hidden /> {dich('Dùng modelapi (GPT)')}
          </button>
        )}
      </div>

      {cong && !moKhoaXong(cong) && (
        cong.cong === 'anthropic'
          ? <MoCongAnthropic daBat={cong.daBat} onXong={() => datDaMo((d) => ({ ...d, anthropic: true }))} />
          : <MoCongDuPhong onXong={() => datDaMo((d) => ({ ...d, modelapi: true }))} />
      )}
      {cong && moKhoaXong(cong) && (
        <ChonModelCong models={cong.models} daChon={null} onChon={(id) => void chon(id)} />
      )}
    </div>
  );
}

/** Ổ khoá nhỏ cạnh model cao chưa mở khoá — dùng trong menu model. */
export function OKhoa() {
  const { dich } = useDich();
  return <Lock size={11} aria-label={dich('Cần mật khẩu')} className="ct-chonmm-khoa" />;
}
