/**
 * SÂN CHƠI 3D — cửa vào trong app.
 *
 * Trang này KHÔNG chứa game. Nó chỉ có ba việc: cho biết đã tải xong chưa, tải
 * nếu chưa, và mở cửa sổ chơi. Bản thân game chạy trong một `BrowserWindow`
 * riêng ở `app://playground` (xem `main/sanChoi.ts`) — nó chiếm trọn khung
 * hình, tự bắt bàn phím và chuột, nên nhét vào giữa layout có sidebar là chống
 * lại chính nó.
 *
 * ─── Vì sao có bước tải 78 MB ───
 * Bản cài chỉ mang ~12 MB phần mã sân chơi. Thế giới (âm thanh, model,
 * texture) tải một lần vào `userData` rồi chơi offline mãi. Nhét cả 90 MB vào
 * bản cài là +47% dung lượng cho MỌI người dùng, kể cả người chỉ dùng app để
 * ghi chú. Số đo ở `docs/playground-dong-goi-app.md`.
 */
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Download, Loader2, Play, Trash2 } from 'lucide-react';
import type { TienDoTai, TrangThaiSanChoi } from '../../../shared/ipc';

const mb = (b: number) => (b / 1048576).toFixed(0);

export function SanChoiPage() {
  const [tt, setTt] = useState<TrangThaiSanChoi | null>(null);
  const [tienDo, setTienDo] = useState<TienDoTai | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  const doc = useCallback(async () => {
    const bridge = window.cuongthai;
    if (!bridge) return;
    setTt(await bridge.sanChoi.trangThai());
  }, []);

  /**
   * Đọc trạng thái MỘT LẦN lúc gắn, RỒI mới nghe sự kiện — cùng lý do với
   * `useUpdateStatus`: lượt tải có thể đã chạy từ trước khi mở trang này (trạng
   * thái nằm ở main, không ở renderer), và nếu chỉ nghe sự kiện thì giao diện
   * đứng im cho tới nhịp tiến độ kế tiếp.
   */
  useEffect(() => {
    const bridge = window.cuongthai;
    if (!bridge) return;
    void doc();
    return bridge.on('sanChoi:tienDo', (payload) => {
      const t = payload as TienDoTai;
      setTienDo(t.xong ? null : t);
      if (t.xong) {
        setLoi(t.loi ?? null);
        void doc();
      }
    });
  }, [doc]);

  const tai = () => {
    setLoi(null);
    setTienDo({
      daTaiByte: tt?.daCoByte ?? 0,
      tongByte: tt?.tongByte ?? 0,
      soFileXong: 0,
      soFileTong: 0,
      xong: false,
    });
    void window.cuongthai?.sanChoi.tai();
  };

  const choi = async (cheDo: 'sinh-ton' | 'tu-do') => {
    try {
      await window.cuongthai?.sanChoi.mo(cheDo);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    }
  };

  const xoa = async () => {
    await window.cuongthai?.sanChoi.xoa();
    await doc();
  };

  if (!tt) {
    return (
      <div className="ct-page">
        <Loader2 className="ct-spin" size={20} aria-hidden />
      </div>
    );
  }

  return (
    <div className="ct-page">
      <div className="ct-panel">
        <h1>Sân chơi 3D</h1>
        <p className="ct-muted">
          Thế giới lái xe 3D, chạy bằng card đồ hoạ của máy bạn. Chế độ Sinh tồn:
          sóng quái, cửa hàng nâng cấp, quái trùm mỗi 5 sóng.
        </p>

        {/* Bản cài không kèm phần mã ⇒ ai đó quên chạy `npm run dong-goi:san-choi`
            trước khi đóng gói. Nói thẳng, đừng để nó thành "bấm Chơi không có gì
            xảy ra". */}
        {!tt.coPhanMa ? (
          <p className="ct-error">
            <AlertTriangle size={15} aria-hidden /> Bản cài này không kèm sân chơi.
            Dựng lại với <code>npm run dong-goi:san-choi</code>.
          </p>
        ) : (
          <>
            {loi && (
              <p className="ct-error">
                <AlertTriangle size={15} aria-hidden /> {loi}
              </p>
            )}

            {tienDo ? (
              <div className="ct-sc-tiendo">
                <div className="ct-sc-thanh">
                  <div
                    className="ct-sc-day"
                    style={{
                      width: `${
                        tienDo.tongByte > 0
                          ? Math.round((tienDo.daTaiByte / tienDo.tongByte) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="ct-muted">
                  Đang tải thế giới… {mb(tienDo.daTaiByte)}/{mb(tienDo.tongByte)} MB
                  {tienDo.soFileTong > 0 && ` · ${tienDo.soFileXong}/${tienDo.soFileTong} tệp`}
                </p>
                <p className="ct-empty-note">Tải một lần. Lần sau chơi được cả khi mất mạng.</p>
              </div>
            ) : tt.sanSang ? (
              <>
                <div className="ct-actions">
                  <button type="button" className="ct-btn" onClick={() => void choi('sinh-ton')}>
                    <Play size={15} aria-hidden /> Chơi Sinh tồn
                  </button>
                  <button
                    type="button"
                    className="ct-btn ct-btn-ghost"
                    onClick={() => void choi('tu-do')}
                  >
                    Đi dạo tự do
                  </button>
                  <button
                    type="button"
                    className="ct-btn ct-btn-ghost"
                    onClick={() => void xoa()}
                  >
                    <Trash2 size={15} aria-hidden /> Xoá tài nguyên ({mb(tt.tongByte)} MB)
                  </button>
                </div>
                <p className="ct-empty-note">
                  Giữ <strong>F</strong> bắn · <strong>X</strong> tên lửa · <strong>E</strong> xuống
                  xe · <strong>B</strong> mở cửa hàng lúc nghỉ · <strong>C</strong> đổi góc nhìn.
                </p>
              </>
            ) : (
              <>
                <div className="ct-actions">
                  <button type="button" className="ct-btn" onClick={tai}>
                    <Download size={15} aria-hidden /> Tải thế giới ({mb(tt.tongByte)} MB)
                  </button>
                </div>
                <p className="ct-empty-note">
                  {tt.daCoByte > 0
                    ? `Đã có ${mb(tt.daCoByte)} MB — lượt trước dừng giữa chừng, chạy lại sẽ tiếp tục chỗ dở.`
                    : 'Tải một lần, sau đó chơi được cả khi mất mạng.'}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
