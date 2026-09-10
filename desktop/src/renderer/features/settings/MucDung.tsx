/**
 * ============================================================
 * MỨC DÙNG — hai ví tiền AI của CHÍNH bạn
 * ============================================================
 *
 * ─── VÌ SAO CẦN Ô NÀY ───
 * Người dùng bị chặn giữa buổi làm việc bởi một câu chỉ nói "ngân sách đã
 * hết", không nói của ai, còn bao nhiêu, bao giờ hồi. Họ không có cách nào tự
 * biết mình đang ở đâu — nên lần chặn nào cũng là một bất ngờ.
 *
 * Ô này trả lời cả bốn câu ấy TRƯỚC khi bị chặn: mảng nào, đã tiêu bao nhiêu
 * trên bao nhiêu, và mấy giờ thì hồi lại.
 *
 * ⚠️ HAI VÍ TÁCH RIÊNG, và phải hiện tách riêng. Gộp thành một con số là quay
 * lại đúng chỗ khó hiểu: người dùng thấy "đã tiêu 90%" mà không biết 90% ấy
 * nằm ở AI Code hay AI Chat, trong khi hai cái chặn nhau độc lập.
 */
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { ApiError } from '../../api/client';
import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';

interface Vi {
  mang: 'code' | 'chat';
  daTieu: number;
  tran: number;
  conLai: number;
  phanTram: number;
  soGio: number;
  canVi: boolean;
  miemTran: boolean;
  hoiLucNao: string | null;
  hoiHetLuc: string | null;
}

/** Dấu riêng cho ca "máy chủ cũ", để chỗ hiện chữ phân biệt được với lỗi thật. */
const MAY_CHU_CU = '\0may-chu-cu';

export function MucDung() {
  const { api } = useSession();
  const { dich, dichP } = useDich();
  const [vi, datVi] = useState<{ code: Vi; chat: Vi } | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const [dangTai, datDangTai] = useState(false);

  const nap = useCallback(async () => {
    if (!api) return;
    datDangTai(true);
    try {
      const r = await api.request<{ code: Vi; chat: Vi }>('/api/v1/ai/usage');
      datVi(r);
      datLoi(null);
    } catch (e) {
      /* ⚠️ 404 KHÔNG phải lỗi của người dùng, và câu máy chủ trả về
         ("Route GET /api/v1/ai/usage not found") thì họ không làm gì được với
         nó. Nó chỉ có một nghĩa: máy chủ đang chạy bản CŨ HƠN app — ví tiền
         riêng chưa lên tới nơi. Ca thật 11/09/2026: hai đường deploy giẫm
         nhau, production bị tráo về ảnh cũ, và ô này phơi nguyên tên route ra
         màn hình người dùng. Nói thẳng chuyện đang xảy ra, và nói nó sẽ tự
         hết — đừng bắt người đọc đi dịch một câu lỗi HTTP. */
      const cu = e instanceof ApiError
        && e.failure.kind === 'rejected'
        && e.failure.status === 404;
      datLoi(cu ? MAY_CHU_CU : (e as Error).message);
    } finally {
      datDangTai(false);
    }
  }, [api]);

  useEffect(() => { void nap(); }, [nap]);

  if (!api) return null;

  return (
    <section className="ct-section">
      <h2>{dich('Mức dùng')}</h2>

      {loi && (
        <div className="ct-notice" data-tone="warn" style={{ margin: '0 0 8px' }}>
          <span>
            {loi === MAY_CHU_CU
              ? dich('Máy chủ đang chạy bản cũ hơn app nên chưa có ô này. Nó sẽ tự hiện sau lần cập nhật máy chủ kế tiếp — bạn không cần làm gì.')
              : `${dich('Không đọc được mức dùng')} — ${loi}`}
          </span>
        </div>
      )}

      {vi && (['code', 'chat'] as const).map((m) => {
        const v = vi[m];
        const ten = m === 'code' ? 'AI Code' : 'AI Chat';
        /* Giờ hồi lấy từ máy chủ dạng ISO. Hiện theo giờ MÁY NGƯỜI DÙNG —
           máy chủ chạy UTC, in giờ của nó ra là lệch 7 tiếng và người dùng
           tưởng hạn mức không bao giờ hồi. */
        const hoi = v.hoiLucNao ? new Date(v.hoiLucNao) : null;
        return (
          <div className="ct-field" key={m}>
            <div>
              <div className="ct-field-label">{ten}</div>
              <div className="ct-field-help">
                {v.miemTran
                  ? dich('Tài khoản quản trị — không bị chặn. Số liệu vẫn được ghi.')
                  : hoi
                    ? dichP('Hạn mức bắt đầu hồi lại từ {gio}.', {
                      gio: hoi.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })
                    : dichP('Ví riêng của bạn, tính trong {n} giờ vừa qua.', { n: v.soGio })}
              </div>
            </div>
            <div className="ct-mucdung">
              <div className="ct-mucdung-thanh" data-can={v.canVi}>
                <div style={{ width: `${Math.min(100, v.phanTram)}%` }} />
              </div>
              <span className="ct-mucdung-so">
                ${v.daTieu.toFixed(2)} / ${v.tran}
              </span>
            </div>
          </div>
        );
      })}

      <div className="ct-actions">
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()} disabled={dangTai}>
          <RefreshCw size={14} aria-hidden className={dangTai ? 'ct-spin' : undefined} />
          {dangTai ? dich('Đang đọc…') : dich('Đọc lại')}
        </button>
      </div>

      <p className="ct-field-help">
        {dichP('Mỗi tài khoản có ví RIÊNG cho từng mảng, tính trượt trong {n} giờ vừa qua — người khác dùng nhiều không ảnh hưởng tới bạn, và AI Code hết không làm AI Chat dừng theo.', { n: vi?.code.soGio ?? 5 })}
      </p>
    </section>
  );
}
