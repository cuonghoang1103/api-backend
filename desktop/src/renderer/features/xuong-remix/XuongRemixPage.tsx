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
  AudioWaveform, Check, Download, FolderOpen, Gauge, Layers, Loader2, Music4,
  Scissors, Send, SlidersHorizontal, Sparkles, Trash2, Upload, X,
} from 'lucide-react';
import type {
  BaiDaNap, KetQuaMasterRa, KetQuaPhanTich, KetQuaTachRa, KetQuaTronRa, KetQuaXuatRa,
  MucKhoModel, TienDoXuong, TomTatBanMau,
  CaiDatStemTron as CaiTron,
} from '../../../shared/ipc';
/* Bảng mặc định của bàn trộn đến từ tệp DÙNG CHUNG với main, không chép lại ở
   đây: giao diện phải hiện đúng những con số bộ trộn sẽ dùng. */
import { TRON_MAC_DINH } from '../../../shared/tronMacDinh';
import { useSession } from '../../auth/session';
import { docTraLoi, type TraLoiAi } from './traLoi';
import { KetQuaAmThanh } from './KetQuaAmThanh';
import { BanLamViec } from './BanLamViec';
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

/**
 * Thư mục chứa một tệp — để nút "Mở thư mục" mở đúng THƯ MỤC.
 *
 * `shell.openPath` trên một TỆP thì mở tệp bằng ứng dụng mặc định, không hiện
 * thư mục ra. Nút ghi "Mở thư mục" mà lại bật trình phát nhạc lên là nói một
 * đằng làm một nẻo. Cắt theo cả hai dấu phân cách, cùng lý do như `tenTep`.
 */
function thuMucCua(duong: string): string {
  const cat = Math.max(duong.lastIndexOf('/'), duong.lastIndexOf('\\'));
  return cat > 0 ? duong.slice(0, cat) : duong;
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
  const { api } = useSession();
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
  const [caiTron, setCaiTron] = useState<Record<string, CaiTron>>(TRON_MAC_DINH);
  const [nenTong, setNenTong] = useState(true);
  const [tronRa, setTronRa] = useState<KetQuaTronRa | null>(null);
  const [dangTron, setDangTron] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [keo, setKeo] = useState(false);
  /* 140 là nhịp của vinahouse — đích mặc định đúng cho gần như mọi lần dùng.
     Nhịp DÒ RA của bài hiện riêng ngay cạnh, để so chứ không để thay. */
  const [bpmDich, setBpmDich] = useState(140);
  const [nuaCung, setNuaCung] = useState(0);
  const [dangXuat, setDangXuat] = useState(false);
  const [xuatRa, setXuatRa] = useState<KetQuaXuatRa | null>(null);
  const [banMau, setBanMau] = useState<TomTatBanMau | null>(null);
  const [dangNapMau, setDangNapMau] = useState(false);
  const [tranDbtp, setTranDbtp] = useState(-1);
  const [dangMaster, setDangMaster] = useState(false);
  const [masterRa, setMasterRa] = useState<KetQuaMasterRa | null>(null);
  const [aiSanSang, setAiSanSang] = useState<boolean | null>(null);
  const [cauHoi, setCauHoi] = useState('');
  const [dangHoi, setDangHoi] = useState(false);
  const [traLoiAi, setTraLoiAi] = useState<TraLoiAi | null>(null);
  const oTep = useRef<HTMLInputElement>(null);
  const oTepMau = useRef<HTMLInputElement>(null);

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

  /* Hỏi máy chủ xem cổng LLM đã cắm khoá chưa.
     Route này CỐ Ý không cần đăng nhập: chặn ở đó thì app chỉ nhận 401 và
     không phân biệt được "chưa đăng nhập" với "máy chủ chưa cắm khoá" — hai
     thứ cần hai câu nhắc khác hẳn nhau. */
  useEffect(() => {
    let con = true;
    void (async () => {
      try {
        const r = await api?.request<{ sanSang?: boolean }>('/api/v1/xuong-remix/trang-thai');
        if (con) setAiSanSang(r?.sanSang === true);
      } catch {
        if (con) setAiSanSang(false);
      }
    })();
    return () => { con = false; };
  }, [api]);

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
    setXuatRa(null);
    setBanMau(null);
    setMasterRa(null);
    setTraLoiAi(null);
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
  }, [cau, dich]);

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

  const chonTepModel = useCallback(async (ma: string) => {
    if (!cau) return;
    setLoi(null);
    try {
      if (await cau.xuongRemix.chonTepModel(ma)) await napKho();
    } catch (e) {
      setLoi((e as Error).message);
    }
  }, [cau, napKho]);

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

  const xuat = useCallback(async () => {
    if (!cau || !bai) return;
    setLoi(null);
    setDangXuat(true);
    try {
      setXuatRa(await cau.xuongRemix.chinhVaXuat(bai.id, bpmDich, nuaCung));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangXuat(false);
    }
  }, [cau, bai, bpmDich, nuaCung]);

  const napMau = useCallback(async (tep: File) => {
    if (!cau || !bai) return;
    setLoi(null);
    setDangNapMau(true);
    setMasterRa(null);
    try {
      const g = await giaiMaBai(tep);
      setBanMau(await cau.xuongRemix.napBanMau(bai.id, tep.name, g.mau, g.soKenh, g.tanSoMau));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangNapMau(false);
    }
  }, [cau, bai]);

  const chayMaster = useCallback(async () => {
    if (!cau || !bai) return;
    setLoi(null);
    setDangMaster(true);
    try {
      setMasterRa(await cau.xuongRemix.master(bai.id, tranDbtp));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangMaster(false);
    }
  }, [cau, bai, tranDbtp]);

  const chayTron = useCallback(async () => {
    if (!cau || !bai) return;
    setLoi(null);
    setDangTron(true);
    try {
      setTronRa(await cau.xuongRemix.tron(
        bai.id,
        caiTron,
        /* Nén tổng nhẹ tay: bản trộn còn đi qua bộ hạn biên ở main, và còn
           được master sau đó. Nén mạnh ở đây là ép hai lần. */
        nenTong ? { nguong: -14, tiLe: 2.5, tanCong: 0.01, nhaRa: 0.12 } : undefined,
      ));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangTron(false);
    }
  }, [cau, bai, caiTron, nenTong]);

  const doiTron = useCallback((ma: string, thay: Partial<CaiTron>) => {
    setCaiTron((cu) => ({ ...cu, [ma]: { ...(cu[ma] ?? TRON_MAC_DINH[ma]!), ...thay } }));
    // Thiết lập đổi thì bản trộn cũ không còn đúng nữa — đừng để nó nằm lại
    // trên màn hình như thể vừa trộn xong.
    setTronRa(null);
  }, []);

  const hoiAi = useCallback(async (tuDo: boolean) => {
    if (!api || !bai || !pt) return;
    setLoi(null);
    setDangHoi(true);
    try {
      const soDo = {
        ten: bai.ten, giay: bai.giay,
        bpm: pt.bpm, bpmTinCay: pt.bpmTinCay,
        tong: pt.tong, tongCamelot: pt.tongCamelot, tongTinCay: pt.tongTinCay,
        lufs: pt.do.lufs, dinhThat: pt.do.dinhThat, daiDong: pt.do.daiDong,
        rongStereo: pt.do.rongStereo, dai: pt.do.dai,
      };
      const tl = docTraLoi(await api.request<unknown>('/api/v1/xuong-remix/kem-cap', {
        method: 'POST',
        body: {
          bai: soDo,
          /* Bản mẫu KHÔNG có nhịp và tông — app chỉ đo mức to và phổ của nó.
             Gửi 0 thì máy chủ tự bỏ dòng đó đi thay vì in "nhịp 0 BPM". */
          ...(banMau ? { banMau: { ...banMau, giay: 0, bpm: 0, bpmTinCay: 0,
                                   tong: '', tongCamelot: '', tongTinCay: 0 } } : {}),
          ...(masterRa ? { chenh: masterRa.chamTruoc } : {}),
          ...(tuDo && cauHoi.trim() ? { cauHoi: cauHoi.trim() } : {}),
        },
      }));
      if (tl) setTraLoiAi(tl);
      else setLoi(dich('Máy chủ trả về câu trả lời rỗng. Thử hỏi lại một câu hẹp hơn.'));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangHoi(false);
    }
  }, [api, bai, pt, banMau, masterRa, cauHoi, dich]);

  const dongBai = useCallback(async () => {
    if (cau && bai) await cau.xuongRemix.dongBai(bai.id).catch(() => undefined);
    setBai(null);
    setPt(null);
    setKetQua(null);
    setTronRa(null);
    setXuatRa(null);
    setBanMau(null);
    setMasterRa(null);
    setTraLoiAi(null);
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
          <button type="button" className="ct-xr-x" onClick={() => setLoi(null)}
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
                    {/* Chưa tải thì con số chỉ là ƯỚC TÍNH — phải nói ra. Bản
                        đầu hiện "166 MB" trơn cạnh "316 MB" đã tải, trông như
                        hai số đo cùng loại, mà một cái là người viết mã gõ vào. */}
                    {m.coRoi
                      ? `${dich('đã tải')} · ${goiGB(m.byteThat)}`
                      : `${dich('chưa tải')} · ~${goiGB(m.byteUocTinh)}`}
                  </span>
                </span>
              </label>
              {!m.coRoi && (
                <div className="ct-xr-model-nut">
                  {/* Chỉ mời tải khi đường tải đã được KIỂM CHỨNG. Model nào
                      chưa có đường tin được thì đừng bày nút Tải về ra rồi để
                      nó trả 404 — thà nói thẳng là phải tự tải. */}
                  {m.coNguonTai && (
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
                  <button
                    type="button"
                    className="ct-btn ct-btn-ghost"
                    disabled={dangTai !== null}
                    onClick={() => void chonTepModel(m.ma)}
                    title={dich('Đã tải sẵn tệp .onnx? Trỏ app vào nó.')}
                  >
                    <FolderOpen size={14} aria-hidden />
                    {dich('Chọn tệp .onnx')}
                  </button>
                </div>
              )}
              {m.coRoi && (
                <button
                  type="button"
                  className="ct-xr-x"
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
            <button type="button" className="ct-xr-x" onClick={() => void dongBai()}
              title={dich('Đóng bài và xoá tệp tạm')}>
              <X size={14} aria-hidden />
            </button>
          </div>

          {/* ── BÀN LÀM VIỆC ──────────────────────────────
              Đặt NGAY dưới tên bài, trên mọi thứ khác: khi làm nhạc thì nghe
              và nhìn dạng sóng là công việc, số đo chỉ là thiết lập. Bản
              trước xếp ngược lại — mở trang ra là một bảng số, và không có
              chỗ nào bấm để nghe. */}
          <BanLamViec
            id={bai.id}
            giay={bai.giay}
            pt={pt}
            tepGoc={bai.duongWav}
            tepStem={ketQua?.tep ?? {}}
          />

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
              <button type="button" className="ct-btn ct-btn-ghost"
                onClick={() => void cau.xuongRemix.huyTach(bai.id)}>
                {dich('Huỷ')}
              </button>
            )}
            {ketQua && (
              <button type="button" className="ct-btn ct-btn-ghost"
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

          {/* ── Chỉnh nhịp & tông, rồi xuất ─────────────── */}
          <div className="ct-xr-chinh">
            <span className="ct-xr-nhan">{dich('Chỉnh nhịp và tông rồi xuất')}</span>
            <div className="ct-xr-dieu-khien">
              <label className="ct-xr-o-nhap" htmlFor="xr-bpm">
                <span>{dich('Nhịp đích')}</span>
                <input
                  id="xr-bpm"
                  type="number"
                  min={40}
                  max={300}
                  step={1}
                  value={bpmDich}
                  onChange={(e) => setBpmDich(Number(e.target.value) || 0)}
                />
                <small>BPM</small>
              </label>

              <label className="ct-xr-o-nhap" htmlFor="xr-tong">
                <span>{dich('Dịch tông')}</span>
                <input
                  id="xr-tong"
                  type="number"
                  min={-12}
                  max={12}
                  step={1}
                  value={nuaCung}
                  onChange={(e) => setNuaCung(Math.max(-12, Math.min(12, Number(e.target.value) || 0)))}
                />
                <small>{dich('nửa cung')}</small>
              </label>

              {pt && pt.bpm > 0 && (
                <span className="ct-muted ct-xr-nhac">
                  <Gauge size={13} aria-hidden />
                  {' '}{dich('bài đang ở')} <b>{pt.bpm}</b> BPM
                  {' · '}{dich('kéo')} <b>{(pt.bpm / Math.max(1, bpmDich)).toFixed(3)}×</b>
                </span>
              )}
            </div>

            <div className="ct-actions">
              <button type="button" className="ct-btn ct-btn-ghost" disabled={dangXuat}
                onClick={() => void xuat()}>
                {dangXuat ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Download size={14} aria-hidden />}
                {dangXuat ? dich('Đang chỉnh…') : dich('Chỉnh và xuất')}
              </button>
              {xuatRa && (
                <button type="button" className="ct-btn ct-btn-ghost"
                  onClick={() => void cau.xuongRemix.moThuMuc(xuatRa.thuMuc)}>
                  <FolderOpen size={14} aria-hidden />
                  {dich('Mở thư mục')}
                </button>
              )}
            </div>

            <p className="ct-muted ct-xr-nhac">
              {ketQua
                ? dich('Sẽ chỉnh cả bốn stem đã tách.')
                : dich('Chưa tách stem thì chỉnh thẳng bản gốc — vẫn dùng được để đánh nối.')}
              {' '}
              {dich('Kèm một tệp MIDI mẫu vinahouse đúng tông của bài.')}
            </p>

            {xuatRa && (
              <div className="ct-xr-xuat-ra">
                {xuatRa.tep.map((t) => <code key={t}>{t}</code>)}
                <span className="ct-muted ct-xr-nhac">
                  {dich('Xong trong')} {xuatRa.giay.toFixed(1)}s
                </span>
              </div>
            )}
          </div>

          {/* ── Master theo bản mẫu ─────────────────────── */}
          <div className="ct-xr-chinh">
            <span className="ct-xr-nhan">{dich('Master theo bản mẫu')}</span>

            <p className="ct-muted ct-xr-nhac">
              {dich('Chọn một bài bạn muốn bản của mình nghe giống. App đo nó rồi ép bài của bạn về đúng mức to, phổ tần và độ rộng stereo của nó.')}
            </p>

            <div className="ct-xr-dieu-khien">
              <button type="button" className="ct-btn ct-btn-ghost" disabled={dangNapMau}
                onClick={() => oTepMau.current?.click()}>
                {dangNapMau ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <SlidersHorizontal size={14} aria-hidden />}
                {banMau ? dich('Đổi bản mẫu') : dich('Chọn bản mẫu')}
              </button>

              <label className="ct-xr-o-nhap" htmlFor="xr-tran">
                <span>{dich('Trần đỉnh')}</span>
                <input
                  id="xr-tran"
                  type="number"
                  min={-24}
                  max={0}
                  step={0.5}
                  value={tranDbtp}
                  onChange={(e) => setTranDbtp(Math.max(-24, Math.min(0, Number(e.target.value) || 0)))}
                />
                <small>dBTP</small>
              </label>

              <button type="button" className="ct-btn" disabled={dangMaster || !banMau}
                onClick={() => void chayMaster()}>
                {dangMaster ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Check size={14} aria-hidden />}
                {dangMaster ? dich('Đang master…') : 'Master'}
              </button>

              {masterRa && (
                <button type="button" className="ct-btn ct-btn-ghost"
                  onClick={() => void cau.xuongRemix.moThuMuc(thuMucCua(masterRa.duong))}>
                  <FolderOpen size={14} aria-hidden />
                  {dich('Mở thư mục')}
                </button>
              )}
            </div>

            <input
              ref={oTepMau}
              id="xuong-remix-tep-mau"
              type="file"
              accept={DUOI_NHAN.map((d) => `.${d}`).join(',')}
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void napMau(f);
                e.target.value = '';
              }}
            />

            {banMau && (
              <p className="ct-muted ct-xr-nhac">
                <b>{banMau.ten}</b>{' — '}
                {soDb(banMau.lufs)} LUFS · {dich('đỉnh thật')} {soDb(banMau.dinhThat)} dBTP
                {' · '}{dich('dải động')} {soDb(banMau.daiDong)} LU
                {' · '}{dich('rộng stereo')} {(banMau.rongStereo * 100).toFixed(0)}%
              </p>
            )}

            {masterRa && (
              <div className="ct-xr-cham">
                <div className="ct-xr-cham-cot">
                  <span className="ct-xr-cham-dau" data-ben="truoc">{dich('Trước khi master')}</span>
                  {masterRa.chamTruoc.length === 0
                    ? <span className="ct-muted">{dich('đã sát bản mẫu')}</span>
                    : masterRa.chamTruoc.map((n) => <span key={n}>{n}</span>)}
                </div>
                <div className="ct-xr-cham-cot">
                  <span className="ct-xr-cham-dau" data-ben="sau">{dich('Sau khi master')}</span>
                  {masterRa.chamSau.length === 0
                    ? <span className="ct-muted">{dich('đã sát bản mẫu')}</span>
                    : masterRa.chamSau.map((n) => <span key={n}>{n}</span>)}
                </div>
                <p className="ct-muted ct-xr-nhac">
                  {soDb(masterRa.lufsTruoc)} → <b>{soDb(masterRa.lufsSau)}</b> LUFS
                  {' · '}{dich('đỉnh thật')} {soDb(masterRa.dinhThatSau)} dBTP
                  {' · '}{masterRa.giay.toFixed(1)}s
                </p>
                <p className="ct-muted ct-xr-nhac">
                  ⚠️ {dich('Đây không thay được tai người. Nó khớp bốn con số; nó không biết bản mix của bạn có đục ở quãng trung hay không.')}
                </p>
                <KetQuaAmThanh duong={masterRa.duong} bpm={pt?.bpm} camelot={pt?.tongCamelot} />
              </div>
            )}
          </div>

          {/* ── AI kèm cặp ──────────────────────────────── */}
          {pt && (
            <div className="ct-xr-chinh">
              <span className="ct-xr-nhan">{dich('AI kèm cặp')}</span>

              {aiSanSang === false ? (
                <p className="ct-muted ct-xr-nhac">
                  {dich('Máy chủ chưa cắm khoá cổng AI, nên phần này tạm nghỉ. Mọi thứ còn lại của Xưởng Remix vẫn chạy bình thường.')}
                </p>
              ) : (
                <>
                  <p className="ct-muted ct-xr-nhac">
                    {dich('AI đọc ĐÚNG bảng số đo ở trên — nó không nghe được bài của bạn. Nên nó giải thích số liệu và chỉ việc cần làm, chứ không nhận xét về giai điệu.')}
                  </p>

                  <div className="ct-xr-dieu-khien">
                    <button type="button" className="ct-btn ct-btn-ghost" disabled={dangHoi}
                      onClick={() => void hoiAi(false)}>
                      {dangHoi ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Sparkles size={14} aria-hidden />}
                      {dich('Mổ xẻ bài này')}
                    </button>
                  </div>

                  <form
                    className="ct-xr-hoi"
                    onSubmit={(e) => { e.preventDefault(); void hoiAi(true); }}
                  >
                    <input
                      id="xr-cau-hoi"
                      type="text"
                      maxLength={500}
                      value={cauHoi}
                      placeholder={dich('Hỏi một câu — ví dụ: làm sao cho drop mạnh hơn?')}
                      onChange={(e) => setCauHoi(e.target.value)}
                      disabled={dangHoi}
                    />
                    <button type="submit" className="ct-btn" disabled={dangHoi || !cauHoi.trim()}>
                      <Send size={14} aria-hidden />
                      {dich('Hỏi')}
                    </button>
                  </form>

                  {traLoiAi && (
                    <div className="ct-xr-tra-loi">
                      <p>{traLoiAi.traLoi}</p>

                      {traLoiAi.biCat && (
                        <p className="ct-xr-ngo">
                          {dich('Câu trả lời bị cắt giữa chừng vì chạm trần độ dài. Hỏi lại một câu hẹp hơn để nhận đủ.')}
                        </p>
                      )}

                      {traLoiAi.soLa.length > 0 && (
                        <p className="ct-xr-ngo">
                          ⚠️ {dich('Những con số này KHÔNG có trong bảng đo:')}{' '}
                          <b>{traLoiAi.soLa.join(', ')}</b>.{' '}
                          {dich('AI có thể đã tự nghĩ ra — đối chiếu lại trước khi làm theo.')}
                        </p>
                      )}

                      <span className="ct-muted ct-xr-nhac">{traLoiAi.model}</span>
                    </div>
                  )}
                </>
              )}
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

          {/* ── Bàn trộn ─────────────────────────────────── */}
          {ketQua && (
            <div className="ct-xr-chinh">
              <span className="ct-xr-nhan">{dich('Trộn lại bốn stem')}</span>
              <p className="ct-muted ct-xr-nhac">
                {dich('Dọn phần trầm rò sang các stem khác, cân lại mức, và ghì cả bài xuống mỗi cú trống cái — nhịp thở đặc trưng của nhạc sàn. Xong là ra một tệp stereo để nghe thử hoặc kéo vào DAW.')}
              </p>

              <div className="ct-xr-tron-bang">
                {STEM.map((st) => {
                  const c = caiTron[st.ma] ?? TRON_MAC_DINH[st.ma]!;
                  return (
                    <div key={st.ma} className={`ct-xr-tron-hang${c.bat ? '' : ' tat'}`}>
                      <label className="ct-xr-tron-ten">
                        <input
                          type="checkbox"
                          checked={c.bat}
                          onChange={(e) => doiTron(st.ma, { bat: e.target.checked })}
                        />
                        <b>{dich(st.nhan)}</b>
                      </label>

                      <label className="ct-xr-tron-num">
                        <span className="ct-muted">{dich('Mức')}</span>
                        <input
                          type="range" min={-24} max={6} step={0.5} value={c.gainDb}
                          disabled={!c.bat}
                          onChange={(e) => doiTron(st.ma, { gainDb: Number(e.target.value) })}
                        />
                        <code>{c.gainDb > 0 ? '+' : ''}{c.gainDb.toFixed(1)} dB</code>
                      </label>

                      <label className="ct-xr-tron-num">
                        <span className="ct-muted">{dich('Chắn trầm')}</span>
                        <input
                          type="range" min={0} max={200} step={10} value={c.chanTramHz}
                          disabled={!c.bat}
                          onChange={(e) => doiTron(st.ma, { chanTramHz: Number(e.target.value) })}
                        />
                        <code>{c.chanTramHz === 0 ? dich('tắt') : `${c.chanTramHz} Hz`}</code>
                      </label>

                      <label className="ct-xr-tron-num">
                        <span className="ct-muted">{dich('Duck theo kick')}</span>
                        <input
                          type="range" min={0} max={100} step={5} value={Math.round(c.duck * 100)}
                          disabled={!c.bat}
                          onChange={(e) => doiTron(st.ma, { duck: Number(e.target.value) / 100 })}
                        />
                        <code>{Math.round(c.duck * 100)}%</code>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="ct-xr-dieu-khien">
                <label className="ct-xr-tron-ten">
                  <input type="checkbox" checked={nenTong}
                    onChange={(e) => { setNenTong(e.target.checked); setTronRa(null); }} />
                  <span>{dich('Nén tổng')}</span>
                </label>
                <button type="button" className="ct-btn" disabled={dangTron}
                  onClick={() => void chayTron()}>
                  {dangTron ? <Loader2 size={14} className="ct-xoay" aria-hidden />
                            : <Layers size={14} aria-hidden />}
                  {dangTron ? dich('Đang trộn…') : dich('Trộn lại')}
                </button>
                <button type="button" className="ct-btn ct-btn-ghost"
                  onClick={() => { setCaiTron(TRON_MAC_DINH); setTronRa(null); }}>
                  {dich('Về mặc định')}
                </button>
              </div>

              {tronRa && (
                <div className="ct-xr-tron-ra">
                  {/* Nguồn của cú duck là thứ PHẢI nói ra: lưới nhịp đều tăm
                      tắp nên nó vẫn thở ở đoạn break không có trống, và người
                      dùng cần biết để tự tắt duck ở đó. */}
                  <p>
                    {tronRa.nguonKick === 'trong'
                      && `${dich('Bám theo')} ${tronRa.soKick} ${dich('cú trống cái dò được trong stem trống.')}`}
                    {tronRa.nguonKick === 'nhip'
                      && `⚠️ ${dich('Không dò ra cú trống nào, nên duck bám theo lưới nhịp — nó sẽ thở đều cả ở đoạn không có trống.')}`}
                    {tronRa.nguonKick === 'khong' && `⚠️ ${dich('Không có gì để duck bám vào.')}`}
                  </p>
                  <p className="ct-muted ct-xr-nhac">
                    {dich('Hồi trong')} {(tronRa.hoiPhuc * 1000).toFixed(0)} ms ·{' '}
                    {dich('độ to')} {tronRa.lufs.toFixed(1)} LUFS ·{' '}
                    {dich('đỉnh thật')} {tronRa.dinhThat.toFixed(1)} dBTP ·{' '}
                    {tronRa.giay.toFixed(1)}s
                  </p>
                  <div className="ct-xr-dieu-khien">
                    <code className="ct-xr-tron-tep">{tenTep(tronRa.duong)}</code>
                    <button type="button" className="ct-btn ct-btn-ghost"
                      onClick={() => void cau.xuongRemix.moThuMuc(thuMucCua(tronRa.duong))}>
                      <FolderOpen size={14} aria-hidden />
                      {dich('Mở thư mục')}
                    </button>
                  </div>
                  <KetQuaAmThanh duong={tronRa.duong} bpm={pt?.bpm} camelot={pt?.tongCamelot} />
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
