/**
 * "DÙNG TRONG VS CODE / CURSOR…" (17/10/2026).
 *
 * Chủ app muốn người dùng app BIẾT AI Code chạy được ngay trong trình soạn
 * code và cài được bằng một cú bấm. Nên nút này nằm trên thanh công cụ AI Code
 * (gom vào "⋯" khi cột hẹp), mở một hộp liệt kê trình soạn đã cài trên máy:
 * trạng thái extension, nút Cài, nút Mở — cộng thẻ CuongMini CLI.
 *
 * Dò máy và chạy CLI đều ở MAIN (`main/ipc/trinhSoan.ts`); ở đây chỉ gửi mã
 * trình soạn trong danh sách trắng.
 */
import { useCallback, useEffect, useState } from 'react';
import { Check, Code2, Copy, ExternalLink, Loader2, RefreshCw, Terminal, X } from 'lucide-react';
import type { MaTrinhSoan, TrinhSoanTinhTrang } from '../../../shared/ipc';
import { useMoRieng } from '../../components/moRieng';
import { useDich } from '../../i18n';
import { useMoTuNgoai } from './moTam';

const WEB_AI_CODE = 'https://cuongthai.com/ai-code';
const LENH_CLI = {
  unix: 'curl -fsSL https://cuongthai.com/cli/install.sh | bash',
  windows: 'irm https://cuongthai.com/cli/install.ps1 | iex',
} as const;

function DongLenh({ lenh }: { lenh: string }) {
  const { dich } = useDich();
  const [daChep, datDaChep] = useState(false);
  return (
    <div className="ct-trinhsoan-lenh">
      <code>{lenh}</code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(lenh).then(() => {
            datDaChep(true);
            setTimeout(() => datDaChep(false), 1400);
          }).catch(() => { /* clipboard bị chặn — vẫn bôi đen chép tay được */ });
        }}
        aria-label={dich('Chép lệnh')}
      >
        {daChep ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
        <span>{daChep ? dich('Đã chép') : dich('Chép')}</span>
      </button>
    </div>
  );
}

export function NutTrinhSoan({ cuocId }: { cuocId: string }) {
  const { dich } = useDich();
  const { mo, bat, dong, boc } = useMoRieng('agent:trinhSoan');
  useMoTuNgoai(cuocId, 'trinhSoan', mo, bat);
  const [ds, datDs] = useState<TrinhSoanTinhTrang[] | null>(null);
  const [dangDo, datDangDo] = useState(false);
  /** Mã trình soạn đang cài — mỗi lúc một cái, cài song song làm CLI tranh nhau. */
  const [dangCai, datDangCai] = useState<MaTrinhSoan | null>(null);
  const [tin, datTin] = useState<{ ma: MaTrinhSoan; chu: string; loi?: boolean } | null>(null);

  const doMay = useCallback(async () => {
    datDangDo(true);
    try {
      datDs(await window.cuongthai?.trinhSoan.doMay() ?? []);
    } catch {
      datDs([]);
    } finally {
      datDangDo(false);
    }
  }, []);

  // Dò lại MỖI LẦN MỞ: người dùng hay cài trình soạn rồi quay lại bấm tiếp.
  useEffect(() => { if (mo) void doMay(); }, [mo, doMay]);

  const cai = async (t: TrinhSoanTinhTrang): Promise<void> => {
    datDangCai(t.ma);
    datTin(null);
    try {
      const kq = await window.cuongthai?.trinhSoan.caiExt(t.ma);
      if (!kq) return;
      if (!kq.ok) datTin({ ma: t.ma, chu: kq.loi ?? dich('Cài không thành công.'), loi: true });
      else if (kq.quaDeepLink) datTin({ ma: t.ma, chu: dich('Đã mở trang extension trong trình soạn — bấm Install ở đó.') });
      else datTin({ ma: t.ma, chu: kq.phienBan ? `${dich('Đã cài')} v${kq.phienBan}` : dich('Đã cài xong.') });
      await doMay();
    } catch (e) {
      datTin({ ma: t.ma, chu: e instanceof Error ? e.message : String(e), loi: true });
    } finally {
      datDangCai(null);
    }
  };

  const moTrinhSoan = async (t: TrinhSoanTinhTrang): Promise<void> => {
    const kq = await window.cuongthai?.trinhSoan.mo(t.ma).catch(() => null);
    if (kq && !kq.ok) datTin({ ma: t.ma, chu: kq.loi ?? dich('Không mở được.'), loi: true });
  };

  const laWin = typeof navigator !== 'undefined' && /Windows/i.test(navigator.userAgent);
  const daCai = ds?.filter((t) => t.daCai) ?? [];
  const chuaCai = ds?.filter((t) => !t.daCai) ?? [];

  return (
    <div className="ct-trinhsoan-boc" ref={boc}>
      <button
        type="button"
        className="ct-agent-cong"
        data-phu
        data-nut="trinhsoan"
        onClick={bat}
        aria-haspopup="dialog"
        aria-expanded={mo}
        title={dich('Dùng AI Code ngay trong VS Code, Cursor, Antigravity, Windsurf, VSCodium hoặc terminal')}
      >
        <Code2 size={14} aria-hidden />
        <span className="ct-agent-nhan">{dich('Trong VS Code…')}</span>
      </button>

      {mo && (
        <div className="ct-trinhsoan-phu" onClick={dong}>
          <div
            className="ct-trinhsoan-hop"
            role="dialog"
            aria-modal="true"
            aria-label={dich('Dùng trong VS Code / Cursor…')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ct-trinhsoan-dau">
              <h3>{dich('Dùng AI Code trong trình soạn code')}</h3>
              <button type="button" className="ct-agent-icon" onClick={() => void doMay()} disabled={dangDo}
                title={dich('Dò lại')} aria-label={dich('Dò lại')}>
                <RefreshCw size={13} aria-hidden className={dangDo ? 'ct-spin' : undefined} />
              </button>
              <button type="button" className="ct-agent-icon" onClick={dong} aria-label={dich('Đóng')}>
                <X size={14} aria-hidden />
              </button>
            </div>
            <p className="ct-trinhsoan-gioi">
              {dich('CuongMini Code là AI Code của app nằm một bên trình soạn. Khi app này đang mở, extension tự nối vào app — dùng chung việc, quyền và vé dự phòng. Không có app thì đăng nhập bằng tài khoản cuongthai.com.')}
            </p>

            {ds === null ? (
              <p className="ct-trinhsoan-cho"><Loader2 size={14} aria-hidden className="ct-spin" /> {dich('Đang dò trình soạn trên máy…')}</p>
            ) : (
              <ul className="ct-trinhsoan-ds">
                {[...daCai, ...chuaCai].map((t) => (
                  <li key={t.ma} data-cai={t.daCai}>
                    <span className="ct-trinhsoan-ten">{t.ten}</span>
                    <span className="ct-trinhsoan-tt" data-co={Boolean(t.phienBanExt)}>
                      {!t.daCai
                        ? dich('Chưa cài trình soạn')
                        : t.phienBanExt
                          ? `${dich('Đã cài CuongMini Code')} v${t.phienBanExt}`
                          : t.kiemDuocExt ? dich('Chưa cài extension') : dich('Không kiểm được extension')}
                    </span>
                    <span className="ct-trinhsoan-nut">
                      {t.daCai && (
                        <button type="button" className="ct-agent-cong" onClick={() => void moTrinhSoan(t)}>
                          {dich('Mở')}
                        </button>
                      )}
                      <button
                        type="button"
                        className="ct-agent-cong"
                        data-bat={!t.phienBanExt}
                        disabled={dangCai !== null}
                        onClick={() => void cai(t)}
                        title={t.coCli ? undefined : dich('Mở trang extension trong trình soạn để bấm Install')}
                      >
                        {dangCai === t.ma
                          ? <><Loader2 size={12} aria-hidden className="ct-spin" /> {dich('Đang cài…')}</>
                          : t.phienBanExt ? dich('Cập nhật bản mới') : dich('Cài')}
                      </button>
                    </span>
                    {tin?.ma === t.ma && <p className="ct-trinhsoan-tin" data-loi={tin.loi === true}>{tin.chu}</p>}
                  </li>
                ))}
              </ul>
            )}

            <div className="ct-trinhsoan-cli">
              <p><Terminal size={13} aria-hidden /> <strong>CuongMini CLI</strong> — {dich('AI Code ngay trong terminal')}</p>
              <DongLenh lenh={laWin ? LENH_CLI.windows : LENH_CLI.unix} />
              <p className="ct-trinhsoan-nho">{dich('Cài xong, mở terminal trong thư mục dự án rồi chạy')} <code>cuongmini</code>.</p>
            </div>

            <button
              type="button"
              className="ct-trinhsoan-web"
              onClick={() => void window.cuongthai?.app.openExternal(WEB_AI_CODE)}
            >
              {dich('Hướng dẫn đầy đủ trên cuongthai.com/ai-code')} <ExternalLink size={12} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
