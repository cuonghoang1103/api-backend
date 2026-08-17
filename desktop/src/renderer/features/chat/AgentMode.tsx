/**
 * Chế độ Lập trình — agent đọc dự án trên máy người dùng.
 *
 * ─── BA THỨ MÀN HÌNH NÀY BẮT BUỘC PHẢI NÓI RÕ ───
 *
 *  1. AGENT ĐANG ĐƯỢC ĐỌC THƯ MỤC NÀO. Đây là quyền người dùng vừa cấp cho một
 *     mô hình ngôn ngữ, nên nó phải hiện thường trực trên đầu màn hình, không
 *     giấu trong Cài đặt. Không thấy phạm vi quyền = không thật sự đồng ý.
 *
 *  2. CÒN BAO NHIÊU. Nhưng hiện "còn ~15 việc" chứ KHÔNG hiện "còn 3,4 triệu
 *     token" — con số token không nói lên điều gì với người dùng, còn số việc
 *     thì trả lời đúng câu họ đang hỏi trong đầu.
 *
 *  3. NÓ ĐANG LÀM GÌ. Đo được: có tới ~10 giây im lặng giữa lúc bấm gửi và
 *     dòng chữ đầu tiên, vì model đang nghĩ xem gọi tool nào. Con quay phải
 *     bật NGAY, nếu không màn hình đứng im và người dùng tưởng app treo.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Check, CircleStop, FilePen, FolderOpen, Loader2, NotebookPen,
  RotateCcw, Send, Sparkles, Terminal, Undo2, X,
} from 'lucide-react';
import type { AgentInfo, AgentWorkspace } from '../../../shared/ipc';
import { useAgent } from './useAgent';
import { XinPhep } from './XinPhep';

export function AgentMode({
  info,
  thuMuc,
  datThuMuc,
  napLai,
}: {
  info: AgentInfo;
  thuMuc: AgentWorkspace | null;
  datThuMuc: (w: AgentWorkspace) => void;
  napLai: () => void;
}) {
  const { trangThai, gui, dung, batDauLai, traLoiXinPhep, hoanTac } = useAgent(info);
  const [nhap, datNhap] = useState('');
  const cuonRef = useRef<HTMLDivElement>(null);

  // Tự cuộn xuống đáy khi có nội dung mới. Chỉ khi người dùng ĐANG ở gần đáy:
  // kéo lên đọc lại một đoạn cũ rồi bị giật xuống là mất chỗ đang đọc.
  useEffect(() => {
    const el = cuonRef.current;
    if (!el) return;
    const ganDay = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (ganDay) el.scrollTop = el.scrollHeight;
  }, [trangThai.muc, trangThai.dangNghi]);

  const chonThuMuc = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.chooseWorkspace();
    if (w) {
      datThuMuc(w);
      // Main đã xoá hội thoại khi đổi thư mục (bối cảnh cũ không còn đúng);
      // màn hình phải theo, nếu không người dùng nhìn thấy lịch sử của một dự
      // án không còn mở.
      void batDauLai();
    }
  };

  const doiCheDoSua = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.datCheDoSua(!thuMuc?.choSua);
    if (w) datThuMuc(w);
  };

  const boThuMuc = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.clearWorkspace();
    if (w) { datThuMuc(w); void batDauLai(); }
  };

  const guiDi = (): void => {
    const text = nhap.trim();
    if (!text || trangThai.dangChay) return;
    datNhap('');
    void gui(text);
  };

  const phimTrongO = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    // Bộ gõ tiếng Việt/CJK dùng Enter để CHỐT chữ đang gõ. Gửi lúc đó là cắt
    // ngang giữa một từ chưa xong — xem [[feedback_ime_composing_guard]].
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      guiDi();
    }
  };

  // ─── Chưa đủ điều kiện ─────────────────────────────────────
  if (!info.pro) return <MoiNangCap />;
  if (!info.configured) {
    return (
      <div className="ct-empty">
        <h1>Máy chủ chưa bật AI</h1>
        <p>Chế độ Lập trình cần khoá AI ở máy chủ. Hãy thử lại sau.</p>
        <div className="ct-actions">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={napLai}>Thử lại</button>
        </div>
      </div>
    );
  }

  const coThuMuc = Boolean(thuMuc?.path);

  return (
    <div className="ct-agent">
      {/* ── Thanh phạm vi quyền + hạn mức ── */}
      <div className="ct-agent-bar">
        <button
          type="button"
          className="ct-agent-ws"
          onClick={() => void chonThuMuc()}
          title={thuMuc?.path ?? 'Chưa chọn thư mục dự án'}
        >
          <FolderOpen size={14} aria-hidden />
          <span className="ct-agent-ws-name">{thuMuc?.name ?? 'Chọn thư mục dự án…'}</span>
          {thuMuc?.branch && <span className="ct-agent-branch">{thuMuc.branch}</span>}
        </button>

        {coThuMuc && (
          <button type="button" className="ct-agent-icon" onClick={() => void boThuMuc()} title="Thôi cho đọc thư mục này">
            <X size={13} aria-hidden />
          </button>
        )}

        <div className="ct-agent-bar-spacer" />

        {coThuMuc && (
          <button
            type="button"
            className="ct-agent-suanut"
            data-bat={thuMuc?.choSua === true}
            onClick={() => void doiCheDoSua()}
            disabled={trangThai.dangChay}
            title={
              thuMuc?.choSua
                ? 'Agent ĐANG được sửa file (mỗi thay đổi vẫn phải bạn duyệt). Bấm để tắt.'
                : 'Bật cho agent sửa file. Mỗi thay đổi sẽ hiện diff để bạn duyệt trước khi ghi.'
            }
          >
            <FilePen size={13} aria-hidden />
            {thuMuc?.choSua ? 'Cho sửa: BẬT' : 'Cho sửa: tắt'}
          </button>
        )}

        {trangThai.soFileDaSua > 0 && (
          <button
            type="button"
            className="ct-agent-hoantac"
            onClick={() => void hoanTac()}
            title="Trả mọi file agent đã sửa trong việc này về nguyên trạng"
          >
            <Undo2 size={13} aria-hidden />
            Hoàn tác {trangThai.soFileDaSua} file
          </button>
        )}

        {trangThai.hanMuc && <ThanhHanMuc quota={trangThai.hanMuc} soViec={info.soViecConLai} />}

        <button
          type="button"
          className="ct-agent-icon"
          onClick={() => void batDauLai()}
          disabled={trangThai.muc.length === 0}
          title="Bắt đầu việc mới (xoá hội thoại, KHÔNG hoàn lại hạn mức)"
        >
          <RotateCcw size={13} aria-hidden />
        </button>
      </div>

      {/* ── Bảng ghi ── */}
      <div className="ct-agent-scroll" ref={cuonRef}>
        {trangThai.muc.length === 0 && <ManHinhTrong coThuMuc={coThuMuc} />}

        {trangThai.muc.map((m, i) => {
          if (m.kieu === 'nguoi') return <div key={i} className="ct-agent-nguoi">{m.text}</div>;
          if (m.kieu === 'may') return <div key={i} className="ct-agent-may">{m.text}</div>;
          if (m.kieu === 'loi') {
            return (
              <div key={i} className="ct-notice" data-tone={m.ma === 'HOAN_TAC' ? 'warn' : 'err'}>
                <span>{m.text}</span>
              </div>
            );
          }
          if (m.kieu === 'xinPhep') {
            // Đã trả lời rồi thì thu về một dòng dấu vết, không giữ nguyên thẻ
            // to đùng: hội thoại dài mà mỗi lần sửa chiếm nửa màn hình thì cuộn
            // lại đọc mạch suy nghĩ không nổi.
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="may" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.the.duongDan}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã duyệt' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return <XinPhep key={i} the={m.the} traLoi={traLoiXinPhep} />;
          }
          return (
            <div key={i} className="ct-agent-tool" data-vong={m.vong}>
              {m.vong === 'notes' ? <NotebookPen size={12} aria-hidden /> : <Terminal size={12} aria-hidden />}
              <code>{m.ten}</code>
              <span className="ct-agent-tool-tomtat">{m.tomTat}</span>
            </div>
          );
        })}

        {/* Con quay bật từ khung `batDau`, KHÔNG chờ tới chữ đầu tiên. */}
        {trangThai.dangNghi && (
          <div className="ct-agent-nghi">
            <Loader2 size={13} aria-hidden className="ct-spin" />
            <span>Đang đọc và suy nghĩ…</span>
          </div>
        )}
      </div>

      {/* ── Ô nhập ── */}
      <div className="ct-agent-soan">
        <textarea
          className="ct-agent-o"
          rows={2}
          value={nhap}
          placeholder={coThuMuc ? `Hỏi về dự án ${thuMuc?.name}…` : 'Chọn thư mục dự án trước, rồi hỏi…'}
          onChange={(e) => datNhap(e.target.value)}
          onKeyDown={phimTrongO}
          disabled={trangThai.dangChay}
        />
        {trangThai.dangChay ? (
          <button type="button" className="ct-btn ct-agent-dung" onClick={dung}>
            <CircleStop size={14} aria-hidden />
            Dừng
          </button>
        ) : (
          <button type="button" className="ct-btn" onClick={guiDi} disabled={!nhap.trim()}>
            <Send size={14} aria-hidden />
            Gửi
          </button>
        )}
      </div>

      <div className="ct-agent-chan">
        <span>
          {thuMuc?.choSua
            ? <>Agent <strong>sửa được file</strong> — mỗi thay đổi phải bạn duyệt. Chưa chạy được lệnh. Không đọc <code>.env</code> và các file khoá.</>
            : <>Đang <strong>chỉ đọc</strong> — chưa sửa file, chưa chạy lệnh. Không đọc <code>.env</code> và các file khoá.</>}
        </span>
        {trangThai.tienPhien > 0 && <span className="ct-muted">~${trangThai.tienPhien.toFixed(3)} phiên này</span>}
      </div>
    </div>
  );
}

/**
 * Thanh hạn mức.
 *
 * Số VIỆC là con số chính, token nằm trong tooltip. Người dùng hỏi "tôi còn
 * làm được mấy việc nữa", không ai hỏi "tôi còn mấy triệu token".
 */
function ThanhHanMuc({
  quota,
  soViec,
}: {
  quota: { daDung: number; tran: number; phanTram: number; hoiLucNao: string | null };
  soViec: number | null;
}) {
  const trieu = (n: number): string => (n / 1_000_000).toFixed(2);
  const hoi = quota.hoiLucNao
    ? new Date(quota.hoiLucNao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className="ct-agent-hanmuc"
      title={`Đã dùng ${trieu(quota.daDung)}/${trieu(quota.tran)} triệu token trong 5 giờ qua.${hoi ? ` Hạn mức bắt đầu hồi lại từ khoảng ${hoi}.` : ''}`}
    >
      <div className="ct-agent-hanmuc-thanh">
        <div className="ct-agent-hanmuc-day" style={{ width: `${Math.min(100, quota.phanTram)}%` }} data-cao={quota.phanTram >= 80} />
      </div>
      <span className="ct-agent-hanmuc-chu">
        {soViec !== null ? `còn ~${soViec} việc` : `${quota.phanTram}%`}
      </span>
    </div>
  );
}

function ManHinhTrong({ coThuMuc }: { coThuMuc: boolean }) {
  return (
    <div className="ct-agent-trong">
      <Sparkles size={26} aria-hidden className="ct-empty-icon" />
      <h2>{coThuMuc ? 'Hỏi gì về dự án này?' : 'Chọn thư mục dự án để bắt đầu'}</h2>
      {coThuMuc ? (
        <ul className="ct-agent-goiy">
          <li>Giải thích cho tôi luồng xác thực trong dự án này.</li>
          <li>Tôi đang sửa dở gì? Tóm tắt các thay đổi chưa commit.</li>
          <li>Hàm xử lý thanh toán nằm ở đâu, và nó gọi những gì?</li>
          <li>Trong ghi chú của tôi có kế hoạch nào cho dự án này không?</li>
        </ul>
      ) : (
        <p className="ct-muted">
          Agent chỉ đọc được thư mục bạn tự chọn — không đọc chỗ nào khác trên máy.
        </p>
      )}
    </div>
  );
}

/**
 * Lời mời nâng cấp.
 *
 * Đây là màn hình cho người dùng ĐÃ đăng nhập nhưng chưa có Pro, và máy chủ mới
 * là bên quyết định (403 `PRO_REQUIRED`). Màn hình này chỉ hiển thị — không có
 * cờ cục bộ nào ở đây mở khoá được gì, kể cả khi app bị sửa.
 */
function MoiNangCap() {
  const moWeb = (): void => {
    void window.cuongthai?.app
      .getInfo()
      .then((i) => window.cuongthai?.app.openExternal(`${i.webOrigin}/pro`));
  };

  return (
    <div className="ct-empty">
      <Sparkles size={28} aria-hidden className="ct-empty-icon" />
      <h1>Chế độ Lập trình dành cho tài khoản Pro</h1>
      <p>
        Agent mở dự án trên máy bạn, đọc mã, tra cứu ghi chú của bạn và trả lời kèm trích dẫn
        tới đúng dòng. Chế độ Trò chuyện vẫn dùng bình thường.
      </p>
      <div className="ct-actions">
        <button type="button" className="ct-btn" onClick={moWeb}>Xem gói Pro</button>
      </div>
    </div>
  );
}
