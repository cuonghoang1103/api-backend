/**
 * ============================================================
 * BỘ NHỚ CỦA AGENT — xem / xoá bài học (26/09/2026)
 * ============================================================
 *
 * Người dùng: *"lỗi nó từng gặp rồi nó không chịu lưu lại học"*. Agent nay tự
 * ghi bài học (`nho_bai_hoc`) vào kho riêng của app (`main/agent/boNho.ts`).
 * Bảng này cho người dùng thấy ĐÚNG những gì agent đã nhớ — và xoá được bài
 * sai: một bài học sai được nạp vào mọi việc sau còn hại hơn không có gì.
 */
import { useCallback, useEffect, useState } from 'react';
import { Brain, RotateCw, Trash2 } from 'lucide-react';
import type { AgentBaiHoc } from '../../../shared/ipc';
import { useMoRieng } from '../../components/moRieng';
import { useDich } from '../../i18n';

const TEN_LOAI: Record<AgentBaiHoc['loai'], string> = {
  loi: 'Lỗi', quy_uoc: 'Quy ước', moi_truong: 'Môi trường', so_thich: 'Sở thích',
};

export function BangBoNho({ cuocId, khoa }: { cuocId: string; khoa: boolean }) {
  const { dich } = useDich();
  const { mo, bat, boc } = useMoRieng('agent:boNho');
  const [ds, datDs] = useState<AgentBaiHoc[]>([]);
  const [moRong, datMoRong] = useState<string | null>(null);

  const nap = useCallback(async () => {
    const r = await window.cuongthai?.agent.boNhoDs(cuocId).catch(() => []);
    datDs(Array.isArray(r) ? r : []);
  }, [cuocId]);

  /* Nạp lại mỗi lần mở + sau mỗi lượt (agent có thể vừa ghi bài mới). */
  useEffect(() => { void nap(); }, [mo, nap]);
  useEffect(() => window.cuongthai?.on('agent:phienDoi', () => { void nap(); }), [nap]);

  const xoa = async (id: string): Promise<void> => {
    await window.cuongthai?.agent.boNhoXoa(cuocId, id);
    await nap();
  };

  return (
    <div className="ct-mcp-boc" ref={boc}>
      <button type="button" className="ct-btn ct-btn-ghost" onClick={bat} disabled={khoa}
        title={dich('Những bài học agent đã tự ghi lại — để lần sau không lặp lại lỗi cũ')}>
        <Brain size={13} aria-hidden /> {dich('Bộ nhớ')}
        {ds.length > 0 && <span className="ct-mcp-dem">{ds.length}</span>}
      </button>
      {mo && (
        <div className="ct-mcp-bang ct-bn-bang">
          <div className="ct-mcp-dau">
            <strong>{dich('Bộ nhớ của agent')}</strong>
            <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho" onClick={() => void nap()}>
              <RotateCw size={12} aria-hidden /> {dich('Nạp lại')}
            </button>
          </div>
          <p className="ct-mcp-chan">
            {dich('Agent tự ghi bài học khi sửa được lỗi khó hoặc khi bạn sửa lưng nó. Mỗi lượt nó chỉ đọc mục lục (rẻ); bài loại Lỗi được app tự chèn khi đúng lỗi đó xuất hiện lại. Lưu trên máy này.')}
          </p>
          {ds.length === 0 ? (
            <p className="ct-mcp-trong">{dich('Chưa có bài học nào. Agent sẽ tự ghi khi gặp và sửa được một lỗi khó.')}</p>
          ) : (
            <ul className="ct-bn-ds">
              {ds.map((b) => (
                <li key={b.id} data-mo={moRong === b.id}>
                  <button type="button" className="ct-bn-dau" onClick={() => datMoRong((c) => (c === b.id ? null : b.id))}>
                    <span className="ct-bn-loai" data-loai={b.loai}>{dich(TEN_LOAI[b.loai])}</span>
                    <span className="ct-bn-ten">{b.tieuDe}</span>
                    <em>{b.phamVi === 'chung' ? dich('mọi dự án') : dich('dự án này')}{b.lanKhop > 0 ? ` · ${b.lanKhop}×` : ''}</em>
                  </button>
                  {moRong === b.id && (
                    <div className="ct-bn-than">
                      {b.dauHieu && <p><b>{dich('Dấu hiệu:')}</b> <code>{b.dauHieu}</code></p>}
                      <p><b>{dich('Vì sao:')}</b> {b.viSao}</p>
                      <p><b>{dich('Áp dụng:')}</b> {b.apDung}</p>
                      <p className="ct-bn-phu">#{b.id} · tạo {b.tao}{b.sua !== b.tao ? ` · sửa ${b.sua}` : ''}</p>
                      <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho" onClick={() => void xoa(b.id)}>
                        <Trash2 size={12} aria-hidden /> {dich('Xoá bài học này')}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
