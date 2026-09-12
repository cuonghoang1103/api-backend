/**
 * ============================================================
 * XƯỞNG REMIX — trang chính
 * ============================================================
 *
 * Nạp một bài → đo nhịp/tông/độ to → tách bốn stem → mở thư mục kéo thẳng vào
 * FL Studio.
 *
 * ─── Ranh giới với Bàn DJ ───
 * `features/music/RemixDeck.tsx` là khâu PHÁT: hai mâm, crossfader, nghe thử.
 * Trang này là khâu LÀM. Không trang nào làm việc của trang kia, và chỗ nối
 * giữa hai bên là thư mục stem xuất ra.
 *
 * ─── ⚠️ Hai con số KHÔNG được bày ra như sự thật ───
 * Dò nhịp và dò tông đều trả kèm độ tin cậy, và dò tông chỉ đúng khoảng một
 * nửa số lần. Giao diện vì thế luôn hiện độ tin cậy cạnh con số, và khi thấp
 * thì nói thẳng "nên nghe lại" kèm đáp án xếp nhì. Bày một tông sai ra như
 * chắc chắn sẽ khiến người dùng kéo cả bản nhạc sang sai tông rồi mới phát
 * hiện bằng tai — lúc đó đã mất cả buổi.
 *
 * ─── Bố cục ───
 * Theo `BO-CUC.md`: mọi cột có `min-width: 0`, mọi hàng nút `flex-wrap`, đo bề
 * rộng bằng `@container` chứ không `@media`, bảng rộng thì cho cuộn ngang.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AudioWaveform, Download, FolderOpen, Loader2, Music4, Scissors, Trash2, Upload, X,
} from 'lucide-react';
import type {
  BaiDaNap, KetQuaPhanTich, KetQuaTachRa, MucKhoModel, TienDoXuong,
} from '../../../shared/ipc';
import { useDich } from '../../i18n';
import { DUOI_NHAN, giaiMaBai, laTepNhac } from './giaiMa';

/** Bốn stem, theo đúng thứ tự htdemucs trả về. */
const STEM = [
  { ma: 'vocals', nhan: 'Giọng hát', y: 'Thứ bạn cần nhất cho một bản remix' },
  { ma: 'drums', nhan: 'Trống', y: 'Dựng fill và chuyển đoạn' },
  { ma: 'bass', nhan: 'Bass', y: 'Thường bỏ đi, thay bằng bass vinahouse' },
  { ma: 'other', nhan: 'Nhạc nền', y: 'Đàn, kèn, và mọi thứ còn lại' },
] as const;

const DAI_TAM = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

function giayThanhPhut(g: number): string {
  const p = Math.floor(g / 60);
  const s = Math.round(g % 60);
  return `${p}:${String(s).padStart(2, '0')}`;
}

function goiGB(b: number): string {
  return b >= 1e9 ? `${(b / 1e9).toFixed(2)} GB` : `${Math.round(b / 1e6)} MB`;
}

/**
 * Tên tệp tách khỏi đường dẫn đầy đủ.
 *
 * Cắt theo CẢ HAI dấu phân cách. App chạy trên cả Windows, và ở đó đường dẫn
 * main trả về dùng `\` — chỉ tìm `/` thì cả đường dẫn dài ngoằng hiện nguyên
 * lên thẻ, tràn ra ngoài ô.
 */
function tenTep(duong: string | undefined): string {
  if (!duong) return '—';
  const cat = Math.max(duong.lastIndexOf('/'), duong.lastIndexOf('\\'));
  return duong.slice(cat + 1);
}

/** dB có thể là -Infinity khi im lặng — đừng in ra chữ "-Infinity". */
function soDb(v: number | undefined): string {
  return v === undefined || !Number.isFinite(v) ? '—' : v.toFixed(1);
}

/** Nhãn cho độ tin cậy. Ba mức thay vì con số thô: người dùng cần biết có nên tin. */
function mucTin(t: number): { chu: string; mau: 'ok' | 'vua' | 'kem' } {
  if (t >= 0.6) return { chu: 'đáng tin', mau: 'ok' };
  if (t >= 0.3) return { chu: 'tạm', mau: 'vua' };
  return { chu: 'nên nghe lại', mau: 'kem' };
}

export function XuongRemixPage() {
  const { dich } = useDich();
  const cau = window.cuongthai;

  const [bai, setBai] = useState<BaiDaNap | null>(null);
  const [pt, setPt] = useState<KetQuaPhanTich | null>(null);
  const [kho, setKho] = useState<MucKhoModel[]>([]);
  const [maModel, setMaModel] = useState('htdemucs-4stem');
  const [dangNap, setDangNap] = useState(false);
  const [dangTach, setDangTach] = useState(false);
  const [dangTai, setDangTai] = useState<string | null>(null);
  const [tienDo, setTienDo] = useState<TienDoXuong | null>(null);
  const [ketQua, setKetQua] = useState<KetQuaTachRa | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [keo, setKeo] = useState(false);
  const oTep = useRef<HTMLInputElement>(null);

  const napKho = useCallback(async () => {
    if (!cau) return;
    try {
      /* Chốt HÌNH DẠNG chứ không tin kiểu.
         `MucKhoModel[]` chỉ là lời hứa lúc biên dịch. Lúc chạy, đầu kia có thể
         là một bản main cũ hơn (app đang cập nhật dở) hay một cầu giả — và khi
         đó `kho.find` ném TypeError làm TRẮNG cả trang, không phải hỏng một ô.
         Đúng lỗi mà `npm run do:bo-cuc` bắt được ở bản đầu của tệp này. */
      const ds = await cau.xuongRemix.khoModel();
      setKho(Array.isArray(ds) ? ds : []);
    } catch (e) {
      setLoi((e as Error).message);
    }
  }, [cau]);

  useEffect(() => { void napKho(); }, [napKho]);

  /* Gắn listener tiến độ MỘT LẦN cho cả trang, không gắn lúc bấm nút: `tach()`
     không trả về cho tới khi xong, nên gắn sau khi gọi là bỏ lỡ toàn bộ. */
  useEffect(() => {
    if (!cau) return undefined;
    return cau.on('xuongRemix:tienDo', (p) => setTienDo(p as TienDoXuong));
  }, [cau]);

  const nap = useCallback(async (tep: File) => {
    if (!cau) return;
    setLoi(null);
    setKetQua(null);
    setPt(null);
    setDangNap(true);
    try {
      const g = await giaiMaBai(tep);
      const b = await cau.xuongRemix.napBai(tep.name, g.mau, g.soKenh, g.tanSoMau);
      if (!b?.id) throw new Error(dich('Không nạp được bài — main không trả về phiên nào.'));
      setBai(b);
      // Cùng lý do với `napKho`: thiếu `do` hay `ghep` thì đừng dựng nửa vời rồi
      // ném giữa chừng — bỏ hẳn phần phân tích, các phần khác vẫn dùng được.
      const kq = await cau.xuongRemix.phanTich(b.id);
      setPt(kq?.do && Array.isArray(kq.ghep) ? kq : null);
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangNap(false);
    }
  }, [cau]);

  const tach = useCallback(async () => {
    if (!cau || !bai) return;
    setLoi(null);
    setDangTach(true);
    setTienDo(null);
    try {
      setKetQua(await cau.xuongRemix.tach(bai.id, maModel));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangTach(false);
      setTienDo(null);
    }
  }, [cau, bai, maModel]);

  const taiModel = useCallback(async (ma: string) => {
    if (!cau) return;
    setLoi(null);
    setDangTai(ma);
    try {
      await cau.xuongRemix.taiModel(ma);
      await napKho();
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangTai(null);
      setTienDo(null);
    }
  }, [cau, napKho]);

  const dongBai = useCallback(async () => {
    if (cau && bai) await cau.xuongRemix.dongBai(bai.id).catch(() => undefined);
    setBai(null);
    setPt(null);
    setKetQua(null);
    setLoi(null);
  }, [cau, bai]);

  const modelDangChon = kho.find((m) => m.ma === maModel);
  const sanSang = modelDangChon?.coRoi === true;

  if (!cau) {
    return (
      <div className="ct-page">
        <div className="ct-empty">
          <Music4 className="ct-empty-icon" aria-hidden />
          <h1>{dich('Xưởng Remix chỉ chạy trong app desktop')}</h1>
          <p>{dich('Trang này cần đọc ghi tệp trên máy, thứ mà trình duyệt không cho phép.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page ct-xr">
      <header className="ct-page-head">
        <div className="ct-page-head-chu">
          <h1>{dich('Xưởng Remix')}</h1>
          <p className="ct-muted">
            {dich('Tách giọng, đo nhịp và tông, chấm bài — rồi kéo thẳng sang FL Studio.')}
          </p>
        </div>
      </header>

      {loi && (
        <div className="ct-xr-loi" role="alert">
          <span>{loi}</span>
          <button type="button" className="ct-btn-ghost ct-xr-x" onClick={() => setLoi(null)}
            aria-label={dich('Đóng')}>
            <X size={14} aria-hidden />
          </button>
        </div>
      )}

      {/* ── Model ─────────────────────────────────────────── */}
      <section className="ct-panel ct-xr-model" aria-label={dich('Model tách stem')}>
        <h2 className="ct-xr-nhan">{dich('Model tách stem')}</h2>
        <div className="ct-xr-kho">
          {kho.map((m) => (
            /* Nút nằm NGOÀI <label>. Trình duyệt không chuyển tiếp cú bấm từ
               một <button> sang ô radio của label, nên lồng vào vẫn chạy đúng
               — nhưng đọc mã thì không thấy được điều đó, và người sửa sau sẽ
               phải tra lại quy tắc. Tách ra thì không còn gì để tra. */
            <div key={m.ma} className="ct-xr-model-o" data-chon={m.ma === maModel}>
              <label className="ct-xr-model-nhan" htmlFor={`model-${m.ma}`}>
                <input
                  type="radio"
                  name="model-xuong-remix"
                  id={`model-${m.ma}`}
                  value={m.ma}
                  checked={m.ma === maModel}
                  onChange={() => setMaModel(m.ma)}
                />
                <span className="ct-xr-model-chu">
                  <b>{m.ten}</b>
                  <span className="ct-muted">{m.moTa}</span>
                  <span className="ct-xr-model-so">
                    {m.coRoi
                      ? `${dich('đã tải')} · ${goiGB(m.byteThat)}`
                      : `${dich('chưa tải')} · ${goiGB(m.byte)}`}
                  </span>
                </span>
              </label>
              {!m.coRoi && (
                <button
                  type="button"
                  className="ct-btn ct-btn-ghost"
                  disabled={dangTai !== null}
                  onClick={() => void taiModel(m.ma)}
                >
                  {dangTai === m.ma
                    ? <Loader2 size={14} className="ct-xoay" aria-hidden />
                    : <Download size={14} aria-hidden />}
                  {dangTai === m.ma ? dich('taimodel|Đang tải…') : dich('Tải về')}
                </button>
              )}
              {m.coRoi && (
                <button
                  type="button"
                  className="ct-btn-ghost ct-xr-x"
                  title={dich('Xoá model để lấy lại đĩa')}
                  onClick={() => void cau.xuongRemix.xoaModel(m.ma).then(napKho)}
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              )}
            </div>
          ))}
        </div>

        {dangTai && tienDo?.viec === 'taiModel' && (
          <div className="ct-xr-thanh" role="progressbar"
            aria-valuenow={Math.round((tienDo.xong / Math.max(1, tienDo.tong)) * 100)}
            aria-valuemin={0} aria-valuemax={100}>
            <div className="ct-xr-thanh-day"
              style={{ width: `${Math.min(100, (tienDo.xong / Math.max(1, tienDo.tong)) * 100)}%` }} />
            <span className="ct-xr-thanh-chu">
              {goiGB(tienDo.xong)} / {goiGB(tienDo.tong)}
            </span>
          </div>
        )}
      </section>

      {/* ── Nạp bài ───────────────────────────────────────── */}
      {!bai && (
        <section
          className="ct-panel ct-xr-tha"
          data-keo={keo}
          onDragOver={(e) => { e.preventDefault(); setKeo(true); }}
          onDragLeave={() => setKeo(false)}
          onDrop={(e) => {
            e.preventDefault();
            setKeo(false);
            const f = e.dataTransfer.files[0];
            if (f && laTepNhac(f.name)) void nap(f);
            else if (f) setLoi(dich('Không đọc được định dạng này. Thử mp3, m4a, wav hay flac.'));
          }}
        >
          <Upload size={28} aria-hidden />
          <p><b>{dich('Kéo một bài nhạc vào đây')}</b></p>
          <p className="ct-muted">{dich('mp3 · m4a · wav · flac · ogg — bài nào cũng được')}</p>
          <div className="ct-actions">
            <button type="button" className="ct-btn" disabled={dangNap}
              onClick={() => oTep.current?.click()}>
              {dangNap ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Music4 size={14} aria-hidden />}
              {dangNap ? dich('Đang đọc bài…') : dich('Chọn tệp')}
            </button>
          </div>
          <input
            ref={oTep}
            id="xuong-remix-tep"
            type="file"
            accept={DUOI_NHAN.map((d) => `.${d}`).join(',')}
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void nap(f);
              e.target.value = '';
            }}
          />
        </section>
      )}

      {/* ── Bài đang mở ───────────────────────────────────── */}
      {bai && (
        <section className="ct-panel ct-xr-bai" aria-label={dich('Bài đang mở')}>
          <div className="ct-xr-bai-dau">
            <div className="ct-xr-bai-ten">
              <AudioWaveform size={16} aria-hidden />
              <b title={bai.ten}>{bai.ten}</b>
              <span className="ct-muted">
                {giayThanhPhut(bai.giay)} · {bai.soKenh === 1 ? 'mono' : 'stereo'}
              </span>
            </div>
            <button type="button" className="ct-btn-ghost ct-xr-x" onClick={() => void dongBai()}
              title={dich('Đóng bài và xoá tệp tạm')}>
              <X size={14} aria-hidden />
            </button>
          </div>

          {pt && (
            <>
              <div className="ct-xr-luoi">
                <div className="ct-xr-o">
                  <span className="ct-xr-o-nhan">{dich('Nhịp')}</span>
                  <span className="ct-xr-o-so">{pt.bpm || '—'}<small>BPM</small></span>
                  <span className="ct-xr-tin" data-muc={mucTin(pt.bpmTinCay).mau}>
                    {dich(mucTin(pt.bpmTinCay).chu)}
                  </span>
                </div>

                <div className="ct-xr-o">
                  <span className="ct-xr-o-nhan">{dich('Tông')}</span>
                  <span className="ct-xr-o-so">{pt.tong}<small>{pt.tongCamelot}</small></span>
                  <span className="ct-xr-tin" data-muc={mucTin(pt.tongTinCay).mau}>
                    {dich(mucTin(pt.tongTinCay).chu)}
                  </span>
                </div>

                <div className="ct-xr-o">
                  <span className="ct-xr-o-nhan">{dich('Độ to')}</span>
                  <span className="ct-xr-o-so">{soDb(pt.do.lufs)}<small>LUFS</small></span>
                  <span className="ct-muted ct-xr-o-phu">
                    {dich('đỉnh thật')} {soDb(pt.do.dinhThat)} dBTP
                  </span>
                </div>

                <div className="ct-xr-o">
                  <span className="ct-xr-o-nhan">{dich('Dải động')}</span>
                  <span className="ct-xr-o-so">{soDb(pt.do.daiDong)}<small>LU</small></span>
                  <span className="ct-muted ct-xr-o-phu">
                    {dich('rộng stereo')} {(pt.do.rongStereo * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {pt.tongTinCay < 0.3 && pt.tongNhi && (
                <p className="ct-xr-ngo">
                  {dich('Máy không chắc về tông. Đáp án xếp nhì là')} <b>{pt.tongNhi}</b>
                  {dich(' — hai tông này dùng chung bộ nốt nên thuật toán hay nhầm. Nghe thử trước khi kéo cả bài theo.')}
                </p>
              )}

              {pt.ghep.length > 0 && (
                <div className="ct-xr-ghep">
                  <span className="ct-xr-nhan">{dich('Ghép hoà âm được với')}</span>
                  <div className="ct-xr-chip-hang">
                    {pt.ghep.map((g) => (
                      <span key={g.ma} className="ct-xr-chip" title={g.vi}>{g.ma}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="ct-xr-pho" aria-label={dich('Phổ tần theo dải quãng tám')}>
                <span className="ct-xr-nhan">{dich('Phổ tần')}</span>
                <div className="ct-xr-cot-hang">
                  {DAI_TAM.map((f) => {
                    const v = pt.do.dai[f];
                    // Dải đọc được của nhạc: −80 dB (im) tới 0 dB (đầy).
                    const cao = v === undefined || !Number.isFinite(v)
                      ? 0 : Math.max(0, Math.min(100, ((v + 80) / 80) * 100));
                    return (
                      <div key={f} className="ct-xr-cot" title={`${soDb(v)} dB`}>
                        <div className="ct-xr-cot-day" style={{ height: `${cao}%` }} />
                        <span>{f >= 1000 ? `${f / 1000}k` : f}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Tách ─────────────────────────────────────── */}
          <div className="ct-actions">
            <button type="button" className="ct-btn" disabled={dangTach || !sanSang} onClick={() => void tach()}>
              {dangTach ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Scissors size={14} aria-hidden />}
              {dangTach ? dich('Đang tách…') : dich('Tách 4 stem')}
            </button>
            {dangTach && (
              <button type="button" className="ct-btn-ghost"
                onClick={() => void cau.xuongRemix.huyTach(bai.id)}>
                {dich('Huỷ')}
              </button>
            )}
            {ketQua && (
              <button type="button" className="ct-btn-ghost"
                onClick={() => void cau.xuongRemix.moThuMuc(ketQua.thuMuc)}>
                <FolderOpen size={14} aria-hidden />
                {dich('Mở thư mục')}
              </button>
            )}
          </div>

          {!sanSang && (
            <p className="ct-muted ct-xr-nhac">
              {dich('Phải tải model trước khi tách. Chọn một model ở trên rồi bấm Tải về.')}
            </p>
          )}

          {dangTach && tienDo?.viec === 'tach' && (
            <div className="ct-xr-thanh" role="progressbar"
              aria-valuenow={Math.round((tienDo.xong / Math.max(1, tienDo.tong)) * 100)}
              aria-valuemin={0} aria-valuemax={100}>
              <div className="ct-xr-thanh-day"
                style={{ width: `${(tienDo.xong / Math.max(1, tienDo.tong)) * 100}%` }} />
              <span className="ct-xr-thanh-chu">
                {dich('khúc')} {tienDo.xong}/{tienDo.tong}
              </span>
            </div>
          )}

          {ketQua && (
            <div className="ct-xr-stem">
              {STEM.map((s) => {
                /* Tên tệp lấy từ KẾT QUẢ THẬT, không ghép `${s.ma}.wav`. Ghép
                   tay là cách mọi nút tải của trang /download từng 404 suốt từ
                   bản 0.3.0 — cùng một lỗi, chỉ khác chỗ. */
                const duong = ketQua.tep[s.ma];
                return (
                  <div key={s.ma} className="ct-xr-stem-o">
                    <b>{dich(s.nhan)}</b>
                    <span className="ct-muted">{dich(s.y)}</span>
                    <code>{tenTep(duong)}</code>
                  </div>
                );
              })}
              <p className="ct-muted ct-xr-nhac">
                {dich('Xong trong')} {ketQua.giay.toFixed(0)}s. {dich('Tệp WAV 32-bit float — kéo thẳng vào FL Studio được.')}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
