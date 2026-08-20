/**
 * ============================================================
 * LÀM BÀI THI NGAY TRONG APP — cả bốn đường nộp
 * ============================================================
 *
 * MCQ (trắc nghiệm) · CODE (nộp .zip) · WRITE (bài viết) · SPEAK (bài nói).
 *
 * ─── VÌ SAO PHẢI CẨN THẬN HƠN MỌI TRANG KHÁC ───
 * Mọi trang khác trong app, hỏng thì tải lại là xong. Ở đây, hỏng nghĩa là mất
 * 60 phút làm bài của một người, và trong trường hợp xấu là mất luôn một lượt
 * thi. Nên ba chốt dưới đây KHÔNG phải trang trí:
 *
 * 1. **BÀI LÀM GHI XUỐNG ĐĨA SAU MỖI THAY ĐỔI.** Người dùng đóng app, mất
 *    điện, app nổ — mở lại là còn nguyên. Không có nó thì mọi lỗi khác trong
 *    app đều trở thành "mất bài".
 * 2. **ĐỒNG HỒ TÍNH TỪ `expiresAt` CỦA MÁY CHỦ**, không đếm lùi từ một số
 *    trong app. Đếm trong app thì đóng app 10 phút rồi mở lại, đồng hồ vẫn
 *    nguyên trong khi máy chủ đã trừ — và người dùng bị cắt ngang giữa câu.
 * 3. **KHÔNG tự nộp khi hết giờ.** Máy chủ đã tự đánh dấu hết hạn; app tự gửi
 *    thêm một lượt nộp rỗng lúc đó là tự tay xoá bài của họ.
 *
 * ─── Nối lại lượt đang dở, không đốt lượt mới ───
 * `POST /exams/:id/attempts` TRẢ LẠI lượt `IN_PROGRESS` chưa hết hạn
 * (`resumed: true`) thay vì tạo lượt mới — đọc `startAttempt` trong
 * `exam.service.ts`. Nhờ vậy bấm "Vào thi" hai lần không mất gì.
 *
 * ─── Tải file phải TỰ dựng `fetch` ───
 * `api.request()` luôn đặt `Content-Type: application/json` và
 * `JSON.stringify` phần thân, nên nó gửi `FormData` thành chuỗi
 * "[object FormData]" và máy chủ nhận một yêu cầu rỗng. Dùng
 * `baseUrlForForms()` + `authHeaders()` và KHÔNG tự đặt Content-Type —
 * trình duyệt phải tự thêm `boundary` của multipart.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  AlertTriangle, ArrowLeft, CheckCircle2, FileArchive, Loader2, Mic, Square,
  Timer, Trophy, Upload,
} from 'lucide-react';
import { useSession } from '../../auth/session';
import { chuVi } from '../chu';

type DangCau = 'MCQ' | 'CODE' | 'WRITE' | 'SPEAK';

interface Cau {
  id: number;
  kind: DangCau;
  sortOrder: number;
  points: number;
  prompt: string;
  imageUrl?: string | null;
  options?: Array<{ text: string }> | null;
  selectCount: number;
  multiSelect: boolean;
  language?: string | null;
  starterCode?: string | null;
  expectedOutput?: string | null;
  speakingPrompts?: Array<{ text: string }> | null;
}

interface DeLam {
  id: number;
  title: string;
  kind?: string | null;
  peType?: string | null;
  durationMinutes?: number | null;
  totalPoints?: number | null;
  passMark?: number | null;
  questions: Cau[];
}

interface Luot {
  attemptId: number;
  startedAt?: string;
  expiresAt?: string | null;
  resumed?: boolean;
}

interface KetQua {
  attempt: {
    id: number; status: string; score: number | null; maxScore: number | null;
    passed?: boolean | null; timeSpentSeconds?: number | null;
    feedback?: Record<string, unknown>;
  };
  questions?: Array<{ id: number; prompt: string; correctIndexes?: number[]; points?: number }>;
}

/** Bài làm giữ trên đĩa. Khoá theo lượt thi, không theo đề — hai lượt khác nhau
 *  của cùng một đề là hai bài khác nhau. */
interface BaiLam {
  chon: Record<number, number[]>;   // MCQ
  vietMa: Record<number, string>;   // CODE trong đề FE
  luan: Record<number, string>;     // WRITE
}

const RONG: BaiLam = { chon: {}, vietMa: {}, luan: {} };

function khoaLuu(attemptId: number): string {
  return `ct-bai-thi:${attemptId}`;
}

function docDia(attemptId: number): BaiLam {
  try {
    const raw = window.localStorage.getItem(khoaLuu(attemptId));
    if (!raw) return RONG;
    const d = JSON.parse(raw) as Partial<BaiLam>;
    return { chon: d.chon ?? {}, vietMa: d.vietMa ?? {}, luan: d.luan ?? {} };
  } catch {
    return RONG;   // dữ liệu hỏng thì bắt đầu lại, đừng làm nổ cả màn thi
  }
}

/** `mm:ss` hoặc `h:mm:ss`. Âm ⇒ 0, không in số âm cho người đang thi. */
function demNguoc(giay: number): string {
  const s = Math.max(0, Math.floor(giay));
  const h = Math.floor(s / 3600);
  const p = Math.floor((s % 3600) / 60);
  const g = s % 60;
  return h > 0
    ? `${h}:${String(p).padStart(2, '0')}:${String(g).padStart(2, '0')}`
    : `${p}:${String(g).padStart(2, '0')}`;
}

export function LamBai({
  examId, tenDe, onThoat,
}: { examId: number; tenDe: string; onThoat: () => void }) {
  const { api } = useSession();

  const [de, setDe] = useState<DeLam | null>(null);
  const [luot, setLuot] = useState<Luot | null>(null);
  const [bai, setBai] = useState<BaiLam>(RONG);
  const [conLai, setConLai] = useState<number | null>(null);
  const [dangNop, setDangNop] = useState(false);
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [zip, setZip] = useState<File | null>(null);
  const batDauRef = useRef<number>(Date.now());

  /* ── Mở đề + mở (hoặc nối lại) lượt thi ───────────────────────────── */
  useEffect(() => {
    if (!api) return;
    let huy = false;
    void (async () => {
      try {
        const d = await api.request<DeLam>(`/api/v1/exams/${examId}/take`);
        if (huy) return;
        setDe(d);
        const l = await api.request<Luot>(`/api/v1/exams/${examId}/attempts`, { method: 'POST' });
        if (huy) return;
        setLuot(l);
        setBai(docDia(l.attemptId));      // khôi phục bài đã làm dở
        batDauRef.current = Date.now();
      } catch (e) {
        if (!huy) setLoi(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => { huy = true; };
  }, [api, examId]);

  /* ── Ghi bài xuống đĩa sau MỖI thay đổi ───────────────────────────── */
  useEffect(() => {
    if (!luot) return;
    try { window.localStorage.setItem(khoaLuu(luot.attemptId), JSON.stringify(bai)); } catch { /* đầy đĩa thì thôi */ }
  }, [bai, luot]);

  /* ── Đồng hồ: tính từ `expiresAt` CỦA MÁY CHỦ ─────────────────────── */
  useEffect(() => {
    if (!luot?.expiresAt) { setConLai(null); return; }
    const het = new Date(luot.expiresAt).getTime();
    const tick = () => setConLai((het - Date.now()) / 1000);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [luot]);

  const daLam = useMemo(() => {
    if (!de) return 0;
    return de.questions.filter((c) => {
      if (c.kind === 'MCQ') return (bai.chon[c.id] ?? []).length > 0;
      if (c.kind === 'WRITE') return (bai.luan[c.id] ?? '').trim().length > 0;
      if (c.kind === 'CODE') return !!zip || (bai.vietMa[c.id] ?? '').trim().length > 0;
      return false;   // SPEAK nộp riêng từng câu, không tính ở đây
    }).length;
  }, [de, bai, zip]);

  const giayDaLam = () => Math.round((Date.now() - batDauRef.current) / 1000);

  /** Tải file lên. `api.request` KHÔNG gửi được FormData — xem đầu file. */
  const guiFile = useCallback(async (duong: string, form: FormData) => {
    if (!api) throw new Error('Chưa có phiên đăng nhập.');
    const r = await fetch(`${api.baseUrlForForms()}${duong}`, {
      method: 'POST',
      headers: api.authHeaders(),   // KHÔNG đặt Content-Type — boundary do trình duyệt thêm
      body: form,
    });
    const j = (await r.json().catch(() => null)) as { data?: KetQua; message?: string } | null;
    if (!r.ok) throw new Error(j?.message ?? `Máy chủ trả ${r.status}`);
    return j?.data as KetQua;
  }, [api]);

  const nop = useCallback(async () => {
    if (!api || !luot || !de || dangNop) return;
    setDangNop(true);
    setLoi(null);
    try {
      let kq: KetQua;
      if (de.kind === 'PE' && de.peType === 'CODE') {
        if (!zip) throw new Error('Chưa chọn file .zip để nộp.');
        const f = new FormData();
        f.append('file', zip);
        f.append('timeSpentSeconds', String(giayDaLam()));
        kq = await guiFile(`/api/v1/exams/attempts/${luot.attemptId}/submit-code`, f);
      } else if (de.kind === 'PE' && de.peType === 'WRITE') {
        kq = await api.request<KetQua>(`/api/v1/exams/attempts/${luot.attemptId}/submit-write`, {
          method: 'POST',
          body: { essays: bai.luan, timeSpentSeconds: giayDaLam() },
        });
      } else {
        /* Mặc định là đường FE — kể cả đề Progress Test trộn vài câu code, vì
           `submit-fe` nhận luôn `codeAnswers`. */
        kq = await api.request<KetQua>(`/api/v1/exams/attempts/${luot.attemptId}/submit-fe`, {
          method: 'POST',
          body: { answers: bai.chon, codeAnswers: bai.vietMa, timeSpentSeconds: giayDaLam() },
        });
      }
      setKetQua(kq);
      /* Nộp XONG mới xoá bản lưu. Xoá trước khi biết máy chủ nhận được hay
         chưa thì một lỗi mạng là mất trắng bài làm. */
      try { window.localStorage.removeItem(khoaLuu(luot.attemptId)); } catch { /* thôi */ }
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangNop(false);
    }
  }, [api, luot, de, bai, zip, dangNop, guiFile]);

  if (ketQua) return <ManKetQua kq={ketQua} tenDe={tenDe} onThoat={onThoat} />;

  if (loi && !de) {
    return (
      <div className="ct-page ct-pt">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onThoat}>
          <ArrowLeft size={14} aria-hidden /> Phòng thi
        </button>
        <div className="ct-empty">
          <AlertTriangle size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
        </div>
      </div>
    );
  }

  if (!de || !luot) {
    return (
      <div className="ct-page ct-pt">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onThoat}>
          <ArrowLeft size={14} aria-hidden /> Phòng thi
        </button>
        <p className="ct-muted"><Loader2 size={14} className="ct-spin" aria-hidden /> Đang mở đề…</p>
      </div>
    );
  }

  const hetGio = conLai !== null && conLai <= 0;
  const sapHet = conLai !== null && conLai > 0 && conLai < 300;
  const laSpeak = de.kind === 'PE' && de.peType === 'SPEAK';

  return (
    <div className="ct-page ct-pt ct-lb">
      {/* Thanh trạng thái DÍNH ĐẦU: đồng hồ và tiến độ phải thấy được ở mọi
          lúc, kể cả khi đã cuộn xuống câu 40. */}
      <div className="ct-lb-thanh">
        <button type="button" className="ct-btn ct-btn-ghost" onClick={onThoat}>
          <ArrowLeft size={14} aria-hidden /> Thoát
        </button>
        <span className="ct-lb-ten">{chuVi(de.title)}</span>
        <span className="ct-lb-tiendo">{daLam}/{de.questions.length} câu</span>
        {conLai !== null && (
          <span className="ct-lb-gio" data-sap={sapHet} data-het={hetGio}>
            <Timer size={14} aria-hidden /> {demNguoc(conLai)}
          </span>
        )}
        <button type="button" className="ct-btn" onClick={() => void nop()} disabled={dangNop || hetGio}>
          {dangNop ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <CheckCircle2 size={14} aria-hidden />}
          {dangNop ? 'Đang nộp…' : 'Nộp bài'}
        </button>
      </div>

      {luot.resumed && (
        <p className="ct-notice" data-tone="warn">
          Đang làm tiếp lượt thi mở dở trước đó — bài đã làm vẫn còn.
        </p>
      )}
      {hetGio && (
        <p className="ct-notice" data-tone="warn">
          Hết giờ. Máy chủ đã khoá lượt này; bài chưa nộp thì không nộp được nữa.
        </p>
      )}
      {loi && <p className="ct-gn-loi">{loi}</p>}

      {/* PE nộp mã: chọn file .zip */}
      {de.kind === 'PE' && de.peType === 'CODE' && (
        <section className="ct-lb-zip">
          <h2><FileArchive size={16} aria-hidden /> Nộp bài bằng file .zip</h2>
          <p className="ct-muted">Nén cả thư mục bài làm rồi chọn file ở đây. Máy chủ giải nén và chấm.</p>
          <label className="ct-btn ct-btn-ghost ct-lb-chonfile">
            <Upload size={14} aria-hidden /> {zip ? zip.name : 'Chọn file .zip'}
            <input
              type="file"
              accept=".zip,application/zip"
              hidden
              onChange={(e) => {
                /* `[...]` NGAY tại đây: `e.target.files` là danh sách SỐNG,
                   React 18 hoãn updater và tới lúc chạy thì nó đã rỗng. */
                const f = [...(e.target.files ?? [])][0] ?? null;
                e.target.value = '';
                setZip(f);
              }}
            />
          </label>
          {zip && <p className="ct-muted">{(zip.size / 1048576).toFixed(1)} MB — bấm “Nộp bài” để gửi.</p>}
        </section>
      )}

      <ol className="ct-lb-ds">
        {de.questions.map((c, i) => (
          <li key={c.id} className="ct-lb-cau">
            <div className="ct-lb-cau-dau">
              <span className="ct-lb-so">Câu {i + 1}</span>
              {!!c.points && <span className="ct-muted">{c.points} điểm</span>}
              {c.multiSelect && <span className="ct-mau-tag">chọn {c.selectCount}</span>}
            </div>
            <div className="ct-lb-de" dangerouslySetInnerHTML={{ __html: sachDe(c.prompt) }} />
            {c.imageUrl && <img className="ct-lb-anh" src={c.imageUrl} alt="" />}

            {c.kind === 'MCQ' && (
              <ul className="ct-lb-dapan">
                {(c.options ?? []).map((o, k) => {
                  const dangChon = (bai.chon[c.id] ?? []).includes(k);
                  return (
                    <li key={k}>
                      <label data-chon={dangChon}>
                        <input
                          type={c.multiSelect ? 'checkbox' : 'radio'}
                          name={`cau-${c.id}`}
                          checked={dangChon}
                          disabled={hetGio}
                          onChange={() => setBai((b) => {
                            const cu = b.chon[c.id] ?? [];
                            const moi = c.multiSelect
                              ? (dangChon ? cu.filter((x) => x !== k) : [...cu, k].sort((a, z) => a - z))
                              : [k];
                            return { ...b, chon: { ...b.chon, [c.id]: moi } };
                          })}
                        />
                        <span>{o.text}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}

            {c.kind === 'WRITE' && (
              <textarea
                className="ct-lb-luan"
                rows={10}
                disabled={hetGio}
                value={bai.luan[c.id] ?? ''}
                placeholder="Viết bài của bạn ở đây…"
                onChange={(e) => setBai((b) => ({ ...b, luan: { ...b.luan, [c.id]: e.target.value } }))}
              />
            )}

            {c.kind === 'CODE' && de.kind !== 'PE' && (
              <textarea
                className="ct-lb-luan ct-lb-ma"
                rows={12}
                disabled={hetGio}
                value={bai.vietMa[c.id] ?? c.starterCode ?? ''}
                placeholder="Viết mã của bạn ở đây…"
                onChange={(e) => setBai((b) => ({ ...b, vietMa: { ...b.vietMa, [c.id]: e.target.value } }))}
              />
            )}

            {c.kind === 'SPEAK' && (
              <CauNoi
                cau={c}
                attemptId={luot.attemptId}
                khoa={hetGio}
                guiFile={guiFile}
                giayDaLam={giayDaLam}
                onXong={setKetQua}
              />
            )}
          </li>
        ))}
      </ol>

      {!laSpeak && (
        <div className="ct-lb-chan">
          <button type="button" className="ct-btn" onClick={() => void nop()} disabled={dangNop || hetGio}>
            {dangNop ? 'Đang nộp…' : `Nộp bài (${daLam}/${de.questions.length})`}
          </button>
          <span className="ct-muted">Nộp rồi không sửa lại được.</span>
        </div>
      )}
    </div>
  );
}

/**
 * Đề bài là HTML do quản trị viên soạn — LỌC trước khi dựng.
 *
 * Trả thẳng chuỗi vào `dangerouslySetInnerHTML` thì một đoạn `<script>` hay
 * `onerror=` lọt vào từ chỗ dán nội dung sẽ chạy trong renderer của app, nơi
 * có `window.cuongthai`. Đề thi tuy do chính admin soạn, nhưng "nguồn đáng tin"
 * không phải lý do để bỏ một bước tốn 5 mili giây.
 */
function sachDe(html: string): string {
  return DOMPurify.sanitize(html ?? '', { USE_PROFILES: { html: true } });
}

/* ── Câu NÓI: ghi âm trong app rồi nộp ───────────────────────────────── */

function CauNoi({
  cau, attemptId, khoa, guiFile, giayDaLam, onXong,
}: {
  cau: Cau;
  attemptId: number;
  khoa: boolean;
  guiFile: (duong: string, form: FormData) => Promise<KetQua>;
  giayDaLam: () => number;
  onXong: (kq: KetQua) => void;
}) {
  const [dangGhi, setDangGhi] = useState(false);
  const [ban, setBan] = useState<Blob[]>([]);
  const [dangNop, setDangNop] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const mieng = useRef<Blob[]>([]);

  const nhacNho = cau.speakingPrompts ?? [];

  const batDau = async () => {
    setLoi(null);
    try {
      /* Quyền micro: app đã cho phép `media` cho chính renderer của mình
         (xem `ALLOWED_PERMISSIONS` trong main/security.ts). Không có dòng đó
         thì lời gọi này bị từ chối im lặng. */
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mieng.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) mieng.current.push(e.data); };
      mr.onstop = () => {
        setBan((b) => [...b, new Blob(mieng.current, { type: 'audio/webm' })]);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mrRef.current = mr;
      setDangGhi(true);
    } catch (e) {
      setLoi(`Không mở được micro: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const dung = () => {
    mrRef.current?.stop();
    mrRef.current = null;
    setDangGhi(false);
  };

  const nopNoi = async () => {
    if (!ban.length || dangNop) return;
    setDangNop(true);
    setLoi(null);
    try {
      const f = new FormData();
      f.append('questionId', String(cau.id));
      f.append('timeSpentSeconds', String(giayDaLam()));
      /* Tối đa 12 file — đúng trần `audioUpload.array('audio', 12)` của máy
         chủ. Gửi hơn thì multer chặn cả yêu cầu, mất luôn phần đã ghi. */
      ban.slice(0, 12).forEach((b, i) => f.append('audio', b, `cau-${cau.id}-${i + 1}.webm`));
      onXong(await guiFile(`/api/v1/exams/attempts/${attemptId}/submit-speak`, f));
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangNop(false);
    }
  };

  return (
    <div className="ct-lb-noi">
      {nhacNho.length > 0 && (
        <ol className="ct-lb-noi-nhac">
          {nhacNho.map((n, i) => <li key={i}>{n.text}</li>)}
        </ol>
      )}

      <div className="ct-lb-noi-nut">
        {!dangGhi ? (
          <button type="button" className="ct-btn" onClick={() => void batDau()} disabled={khoa || ban.length >= 12}>
            <Mic size={14} aria-hidden /> {ban.length ? 'Ghi câu tiếp' : 'Bắt đầu ghi'}
          </button>
        ) : (
          <button type="button" className="ct-btn" data-ghi onClick={dung}>
            <Square size={14} aria-hidden /> Dừng ghi
          </button>
        )}
        <span className="ct-muted">{ban.length}/12 đoạn đã ghi</span>
        {ban.length > 0 && !dangGhi && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => setBan([])} disabled={dangNop}>
            Ghi lại từ đầu
          </button>
        )}
      </div>

      {ban.map((b, i) => (
        <audio key={i} controls src={URL.createObjectURL(b)} className="ct-lb-noi-nghe" />
      ))}

      {loi && <p className="ct-gn-loi">{loi}</p>}

      <button type="button" className="ct-btn" onClick={() => void nopNoi()} disabled={!ban.length || dangNop || khoa}>
        {dangNop ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <CheckCircle2 size={14} aria-hidden />}
        {dangNop ? 'Đang chấm…' : 'Nộp bài nói'}
      </button>
    </div>
  );
}

/* ── Kết quả ─────────────────────────────────────────────────────────── */

function ManKetQua({ kq, tenDe, onThoat }: { kq: KetQua; tenDe: string; onThoat: () => void }) {
  const a = kq.attempt;
  const qua = a.passed === true;
  return (
    <div className="ct-page ct-pt ct-hv-ct">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onThoat}>
        <ArrowLeft size={14} aria-hidden /> Phòng thi
      </button>

      <div className="ct-lb-kq" data-qua={qua}>
        <Trophy size={30} aria-hidden />
        <p className="ct-lb-kq-diem">
          {a.score != null ? a.score : '—'}
          {a.maxScore != null && <span> / {a.maxScore}</span>}
        </p>
        {a.passed != null && <p className="ct-lb-kq-nhan">{qua ? 'ĐẠT' : 'CHƯA ĐẠT'}</p>}
      </div>

      <h1 className="ct-hv-bai-tieude">{chuVi(tenDe)}</h1>
      <dl className="ct-mau-tin">
        <dt>Trạng thái</dt><dd>{a.status}</dd>
        {a.timeSpentSeconds != null && <><dt>Thời gian làm</dt><dd>{Math.round(a.timeSpentSeconds / 60)} phút</dd></>}
      </dl>

      {/* Nhận xét của bộ chấm (PE dùng AI chấm) — hiện nguyên văn, không tóm tắt. */}
      {a.feedback && Object.keys(a.feedback).length > 0 && (
        <section className="ct-lb-nhanxet">
          <h2>Nhận xét</h2>
          <pre>{JSON.stringify(a.feedback, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
