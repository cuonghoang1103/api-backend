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
  BookOpen, Check, Circle, CircleDot, CircleStop, FileCode2, FilePen, FilePlus2, FolderOpen,
  FolderTree, GitBranch, History, ListChecks, Loader2, NotebookPen, RotateCcw, Search, Send,
  Sparkles, SquareTerminal, Terminal, Undo2, X,
} from 'lucide-react';
import type { AgentInfo, AgentViec, AgentWorkspace, MucNoLuc } from '../../../shared/ipc';
import { useAgent } from './useAgent';
import { LichSu } from './LichSu';
import { ChuAgent } from './markdown';
import { XinPhep, XinPhepLenh } from './XinPhep';

export function AgentMode({
  cuocId,
  info,
  thuMuc,
  datThuMuc,
  napLai,
  datTieuDe,
}: {
  /** Cuộc (tab) mà màn hình này thuộc về. Mọi lời gọi IPC mang id này. */
  cuocId: string;
  info: AgentInfo;
  thuMuc: AgentWorkspace | null;
  datThuMuc: (w: AgentWorkspace) => void;
  napLai: () => void;
  /** Báo tiêu đề lên cha để thanh tab hiện đúng tên việc. */
  datTieuDe?: (t: string) => void;
}) {
  const {
    trangThai, gui, dung, batDauLai, traLoiXinPhep, hoanTac,
    phien, phienDangMo, moPhien, xoaPhien,
  } = useAgent(cuocId, info);
  const [nhap, datNhap] = useState('');
  const [moLichSu, datMoLichSu] = useState(false);
  /** Ảnh đã dán, chờ gửi kèm câu hỏi tới. */
  const [anh, datAnh] = useState<string[]>([]);
  const cuonRef = useRef<HTMLDivElement>(null);

  // Tiêu đề tab = câu hỏi ĐẦU TIÊN, giống cách đặt tên phiên ở main. Một tab
  // tên "Việc mới" mãi mãi thì mở ba tab là không phân biệt được cái nào.
  const cauDau = trangThai.muc.find((m) => m.kieu === 'nguoi');
  useEffect(() => {
    if (cauDau?.kieu === 'nguoi') {
      datTieuDe?.(cauDau.text.slice(0, 40));
    }
  }, [cauDau, datTieuDe]);

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

  const doiMucNoLuc = async (m: MucNoLuc): Promise<void> => {
    await window.cuongthai?.agent.datMucNoLuc(m);
    const w = await window.cuongthai?.agent.getWorkspace();
    if (w) datThuMuc(w);
  };

  const doiCheDoLenh = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.datCheDoLenh(!thuMuc?.choChayLenh);
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
    datAnh([]);
    void gui(text, anh.length ? anh : undefined);
  };

  /**
   * Dán ảnh từ bộ nhớ tạm.
   *
   * Chặn `preventDefault` CHỈ khi thật sự có ảnh — dán chữ phải hoạt động như
   * bình thường. `clipboardData.items` có cả ảnh lẫn phiên bản chữ của cùng một
   * lần chép (ví dụ chép từ Figma), nên phải lọc theo `type` chứ không lấy bừa
   * item đầu.
   */
  const danAnh = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const files = [...(e.clipboardData?.items ?? [])]
      .filter((i) => i.kind === 'file' && /^image\/(png|jpeg|webp|gif)$/.test(i.type))
      .map((i) => i.getAsFile())
      .filter((f): f is File => !!f);
    if (!files.length) return;
    e.preventDefault();

    for (const f of files.slice(0, 3 - anh.length)) {
      // 4MB là trần của máy chủ. Chặn ở đây để người dùng biết NGAY, thay vì
      // gửi đi rồi bị từ chối câm lặng ở tầng dưới.
      if (f.size > 4 * 1024 * 1024) continue;
      const doc = new FileReader();
      doc.onload = () => {
        const url = String(doc.result ?? '');
        if (url.startsWith('data:image/')) datAnh((cu) => (cu.length >= 3 ? cu : [...cu, url]));
      };
      doc.readAsDataURL(f);
    }
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
      {moLichSu && (
        <LichSu
          phien={phien}
          dangMo={phienDangMo}
          onMo={(id) => { void moPhien(id); datMoLichSu(false); }}
          onXoa={(id) => void xoaPhien(id)}
          onDong={() => datMoLichSu(false)}
        />
      )}

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

        {coThuMuc && (
          <button
            type="button"
            className="ct-agent-suanut"
            data-bat={thuMuc?.choChayLenh === true}
            data-lenh="true"
            onClick={() => void doiCheDoLenh()}
            disabled={trangThai.dangChay}
            title={
              thuMuc?.choChayLenh
                ? 'Agent ĐANG chạy được lệnh (mỗi lệnh vẫn phải bạn duyệt). Bấm để tắt.'
                : 'Bật cho agent chạy lệnh — để nó tự chạy test sau khi sửa. Mỗi lệnh hiện nguyên văn để bạn duyệt.'
            }
          >
            <Terminal size={13} aria-hidden />
            {thuMuc?.choChayLenh ? 'Chạy lệnh: BẬT' : 'Chạy lệnh: tắt'}
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

        <ChonMucNoLuc
          muc={thuMuc?.mucNoLuc ?? 'canBang'}
          khoa={trangThai.dangChay}
          onChon={(m) => void doiMucNoLuc(m)}
        />

        {trangThai.hanMuc && <ThanhHanMuc quota={trangThai.hanMuc} soViec={info.soViecConLai} />}

        <button
          type="button"
          className="ct-agent-icon"
          onClick={() => datMoLichSu(true)}
          title={`Việc đã lưu (${phien.length})`}
        >
          <History size={13} aria-hidden />
        </button>

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

      {trangThai.keHoach.length > 0 && <BangKeHoach viec={trangThai.keHoach} />}

      {/* ── Bảng ghi ── */}
      <div className="ct-agent-scroll" ref={cuonRef}>
        {trangThai.muc.length === 0 && <ManHinhTrong coThuMuc={coThuMuc} />}

        {trangThai.muc.map((m, i) => {
          if (m.kieu === 'nguoi') {
            return (
              <div key={i} className="ct-agent-nguoi">
                {m.anh?.length ? (
                  <div className="ct-anh-goi">
                    {m.anh.map((a, k) => <img key={k} src={a} alt={`ảnh ${k + 1}`} />)}
                  </div>
                ) : null}
                {m.text}
              </div>
            );
          }
          if (m.kieu === 'may') {
            return (
              <div key={i} className="ct-agent-may">
                <ChuAgent text={m.text} />
              </div>
            );
          }
          if (m.kieu === 'loi') {
            return (
              <div key={i} className="ct-notice" data-tone={
                m.ma === 'HOAN_TAC' ? 'warn' : m.ma === 'KHOI_PHUC' ? 'info' : 'err'
              }>
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
          if (m.kieu === 'xinPhepLenh') {
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="may" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.lenh}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã chạy' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return <XinPhepLenh key={i} id={m.id} lenh={m.lenh} phanLoai={m.phanLoai} traLoi={traLoiXinPhep} />;
          }
          // Đầu ra lệnh: hiện nguyên văn, KHÔNG dựng bằng innerHTML. Đây là chữ
          // do một tiến trình bất kỳ trên máy in ra, và nó có thể chứa bất cứ gì.
          if (m.kieu === 'lenhRa') return <pre key={i} className="ct-lenh-ra">{m.text}</pre>;
          return (
            <div key={i} className="ct-agent-tool" data-vong={m.vong} data-ten={m.ten}>
              <IconTool ten={m.ten} vong={m.vong} />
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
      {anh.length > 0 && (
        <div className="ct-anh-cho">
          {anh.map((a, i) => (
            <div key={i} className="ct-anh-o">
              <img src={a} alt={`ảnh ${i + 1}`} />
              <button type="button" onClick={() => datAnh((cu) => cu.filter((_, k) => k !== i))} title="Bỏ ảnh này">
                <X size={11} aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="ct-agent-soan">
        <textarea
          className="ct-agent-o"
          rows={2}
          onPaste={danAnh}
          value={nhap}
          placeholder={coThuMuc
            ? `Hỏi về dự án ${thuMuc?.name}… (dán ảnh chụp màn hình được)`
            : 'Chọn thư mục dự án trước, rồi hỏi…'}
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
          {!thuMuc?.choSua && !thuMuc?.choChayLenh
            ? <>Đang <strong>chỉ đọc</strong> — chưa sửa file, chưa chạy lệnh. Không đọc <code>.env</code> và các file khoá.</>
            : thuMuc?.choChayLenh
              // ⚠️ Bật chạy lệnh thì `cat .env` là một lệnh shell, và shell không
              // biết gì về danh sách chặn file. Phải nói thẳng ở đây, vì đây là
              // chỗ duy nhất người dùng nhìn thấy thường trực.
              ? <>Agent {thuMuc?.choSua ? <><strong>sửa được file</strong> và </> : null}<strong>chạy được lệnh</strong> — mỗi việc đều phải bạn duyệt. Lệnh shell <strong>đọc được cả</strong> <code>.env</code>, hãy đọc kỹ trước khi duyệt.</>
              : <>Agent <strong>sửa được file</strong> — mỗi thay đổi phải bạn duyệt. Chưa chạy được lệnh. Không đọc <code>.env</code> và các file khoá.</>}
        </span>
        {trangThai.tienPhien > 0 && <span className="ct-muted">~${trangThai.tienPhien.toFixed(3)} phiên này</span>}
      </div>
    </div>
  );
}

/**
 * Bảng kế hoạch — ghim TRÊN bảng ghi, không cuộn theo.
 *
 * Nó trả lời đúng câu người dùng hỏi trong đầu suốt một việc dài: "còn bao lâu
 * nữa?". Để nó cuộn theo bảng ghi thì sau bước thứ năm nó trôi khỏi màn hình,
 * đúng lúc câu hỏi đó bắt đầu nhức.
 */
function BangKeHoach({ viec }: { viec: AgentViec[] }) {
  const xong = viec.filter((v) => v.trangThai === 'xong').length;
  return (
    <div className="ct-kehoach">
      <div className="ct-kehoach-dau">
        <ListChecks size={13} aria-hidden />
        <span>Kế hoạch</span>
        <span className="ct-kehoach-dem">{xong}/{viec.length}</span>
        <div className="ct-kehoach-thanh">
          <div className="ct-kehoach-day" style={{ width: `${(xong / viec.length) * 100}%` }} />
        </div>
      </div>
      <ul className="ct-kehoach-ds">
        {viec.map((v, i) => (
          <li key={i} data-tt={v.trangThai}>
            {v.trangThai === 'xong'
              ? <Check size={12} aria-hidden />
              : v.trangThai === 'dang'
                ? <CircleDot size={12} aria-hidden className="ct-spin-cham" />
                : <Circle size={12} aria-hidden />}
            <span>{v.ten}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Chọn cấp độ nỗ lực.
 *
 * Nhãn nói bằng SỐ BƯỚC, không bằng tên model. Đây là thứ thật sự đổi — và nói
 * "nhanh/mạnh" theo model sẽ là nói dối: đo được model "nhẹ" chậm gấp 4 ở việc
 * gọi tool. Người dùng chọn ở đây là chọn "đào sâu tới đâu", nên nhãn phải nói
 * đúng điều đó.
 */
function ChonMucNoLuc({
  muc, khoa, onChon,
}: { muc: MucNoLuc; khoa: boolean; onChon: (m: MucNoLuc) => void }) {
  const mucs: Array<{ id: MucNoLuc; nhan: string; mo: string }> = [
    { id: 'nhanh', nhan: 'Nhanh', mo: 'tối đa 8 bước — hỏi nhanh, trả lời sớm' },
    { id: 'canBang', nhan: 'Cân bằng', mo: 'tối đa 30 bước — mặc định' },
    { id: 'ky', nhan: 'Kỹ', mo: 'tối đa 60 bước — đọc rộng, tự chạy test, tốn nhiều hạn mức hơn' },
  ];
  return (
    <div className="ct-noluc" role="group" aria-label="Cấp độ">
      {mucs.map((m) => (
        <button
          key={m.id}
          type="button"
          className="ct-noluc-nut"
          data-chon={m.id === muc}
          disabled={khoa}
          onClick={() => onChon(m.id)}
          title={m.mo}
        >
          {m.nhan}
        </button>
      ))}
    </div>
  );
}

/**
 * Icon riêng cho TỪNG tool.
 *
 * Một icon chung cho mọi tool thì dòng tiến trình chỉ còn phân biệt được bằng
 * cách ĐỌC tên — mà mắt lướt qua mười dòng thì không ai đọc. Hình dạng khác
 * nhau cho phép nhận ra nhịp làm việc (dò → tìm → đọc → sửa → chạy) chỉ bằng
 * liếc, đúng như Claude Code làm.
 */
function IconTool({ ten, vong }: { ten: string; vong: 'may' | 'notes' }) {
  const p = { size: 12, 'aria-hidden': true } as const;
  if (vong === 'notes') return <NotebookPen {...p} />;
  switch (ten) {
    case 'list_dir': return <FolderTree {...p} />;
    case 'glob': return <FolderTree {...p} />;
    case 'grep': return <Search {...p} />;
    case 'read_file': return <FileCode2 {...p} />;
    case 'edit_file': return <FilePen {...p} />;
    case 'create_file': return <FilePlus2 {...p} />;
    case 'run_command': return <SquareTerminal {...p} />;
    case 'git_status':
    case 'git_diff': return <GitBranch {...p} />;
    default: return ten.endsWith('.md') ? <BookOpen {...p} /> : <Terminal {...p} />;
  }
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
