/**
 * Cài đặt → AI ngoại tuyến.
 *
 * Màn hình để người dùng tải AI về chạy thẳng trên máy mình, dùng được khi mất
 * mạng. Ba nguyên tắc, và cả ba đều là quyết định có chủ đích:
 *
 * 1. **Quét máy TRƯỚC, mời sau.** Người dùng không biết máy mình chạy nổi bản
 *    nào, và để họ tải 2,5 GB về rồi mới thất vọng là cách nhanh nhất để họ
 *    không bao giờ thử lại. Máy nào không đủ thì nói thẳng, kèm lý do.
 * 2. **Nói thật về chỗ mình chưa chắc.** Trước khi cài bộ chạy, app mới chỉ
 *    NHÌN tên card màn hình — nó chưa chạy thử nên chưa biết GPU có dùng được
 *    không. Chỗ đó hiện "chưa chắc" chứ không hứa.
 * 3. **Không bao giờ để màn hình trống.** Mọi lỗi đều thành một câu tiếng Việt
 *    ở đúng chỗ nó xảy ra.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Code2, Cpu, Download, HardDrive, Loader2, Play, RefreshCw, Sparkles, Square, Trash2, X } from 'lucide-react';
import type { AiCucBoMa, AiCucBoTienDo, AiCucBoTinhTrang } from '../../../shared/ipc';
import { useDich } from '../../i18n';
import { useAppState } from '../../app-state';

/** "2,5 GB" — dấu phẩy kiểu Việt, không phải dấu chấm. */
function gb(x: number): string {
  return `${x.toFixed(1).replace('.', ',')} GB`;
}

/** "1,2 MB/s" hoặc rỗng khi chưa đo được. */
function tocDo(bps: number): string {
  if (bps <= 0) return '';
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(1).replace('.', ',')} MB/s`;
  return `${Math.round(bps / 1e3)} KB/s`;
}

export function AiNgoaiTuyen() {
  const { dich } = useDich();
  const { settings, setSetting, layThamSo, lanDieuHuong } = useAppState();
  /* Mở từ dải "Mất mạng — chưa có AI ngoại tuyến" của AI Code/Chat ⇒ cuộn
     thẳng tới đây. Cài đặt là một trang dài; bắt người đang mất mạng tự lần
     tìm mục này là thêm một bước vào đúng lúc họ đang bực nhất. */
  const khung = useRef<HTMLElement | null>(null);
  const [canCuon, datCanCuon] = useState(false);
  useEffect(() => {
    if (layThamSo('muc') === 'ai-ngoai-tuyen') datCanCuon(true);
  }, [lanDieuHuong, layThamSo]);
  /* Mặc định BẬT cả hai — người đã tải model về là người muốn dùng nó. */
  const choChay = settings.aiCucBoBat !== false;
  const tuDong = settings.aiCucBoTuDong !== false;
  const [dangQuet, datDangQuet] = useState(false);
  const [tt, setTt] = useState<AiCucBoTinhTrang | null>(null);
  const [tienDo, setTienDo] = useState<AiCucBoTienDo | null>(null);
  const [loi, setLoi] = useState('');
  const [dangLam, setDangLam] = useState<AiCucBoMa | 'chung' | null>(null);
  /** Giữ để tránh gọi `setState` sau khi component đã rời màn hình. */
  const conSong = useRef(true);

  const nap = useCallback(async () => {
    const r = await window.cuongthai?.aiCucBo.tinhTrang();
    if (r && conSong.current) setTt(r);
  }, []);

  useEffect(() => {
    conSong.current = true;
    void nap();
    /* Tiến độ chảy qua sự kiện chứ không qua giá trị trả về: tải 2,5 GB là
       việc nhiều phút, không ai chờ một Promise lâu như thế mà không thấy gì. */
    /* `on()` giao `unknown` — đúng vậy, vì nó là ranh giới giữa hai tiến trình
       và bên kia có thể gửi bất cứ gì. Ép kiểu ở ĐÂY, ngay chỗ nhận. */
    const bo = window.cuongthai?.on('aiCucBo:tienDo', (goi) => {
      const t = goi as AiCucBoTienDo;
      if (!conSong.current || !t) return;
      setTienDo(t);
      if (t.xong) {
        setTienDo(null);
        setDangLam(null);
        if (!t.xong.ok) setLoi(t.xong.loi ?? dich('Không cài được.'));
        void nap();
      }
    });
    return () => { conSong.current = false; bo?.(); };
  }, [nap, dich]);

  /* Cuộn khi ĐÃ có nội dung — cuộn lúc còn "Đang xem cấu hình máy…" thì
     khung còn thấp, nạp xong nó dài ra và mục tiêu trôi khỏi tầm nhìn. */
  useEffect(() => {
    if (!canCuon || !tt) return;
    datCanCuon(false);
    requestAnimationFrame(() => khung.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [canCuon, tt]);

  const tai = async (ma: AiCucBoMa) => {
    setLoi('');
    setDangLam(ma);
    setTienDo({ viec: dich('Đang chuẩn bị…'), phanTram: 0, bps: 0 });
    const r = await window.cuongthai?.aiCucBo.cai(ma);
    if (r && !r.ok) { setLoi(r.loi ?? ''); setDangLam(null); setTienDo(null); }
  };

  const huy = async () => {
    await window.cuongthai?.aiCucBo.huyCai();
    setTienDo(null);
    setDangLam(null);
    void nap();
  };

  /** Quét lại máy — nút "Kiểm tra máy". */
  const quetLai = async () => {
    datDangQuet(true);
    setLoi('');
    await nap();
    /* Giữ vòng quay ít nhất nửa giây: quét xong trong 40ms thì nút chỉ nháy
       một cái và người dùng không biết nó đã chạy hay chưa bấm trúng. */
    setTimeout(() => datDangQuet(false), 500);
  };

  const bat = async (ma: AiCucBoMa) => {
    setLoi('');
    setDangLam(ma);
    const r = await window.cuongthai?.aiCucBo.bat(ma, true);
    if (r && !r.ok) setLoi(r.loi ?? '');
    setDangLam(null);
    void nap();
  };

  const tat = async () => {
    setDangLam('chung');
    await window.cuongthai?.aiCucBo.tat();
    setDangLam(null);
    void nap();
  };

  const xoa = async (ma: AiCucBoMa) => {
    setLoi('');
    setDangLam(ma);
    const r = await window.cuongthai?.aiCucBo.xoa(ma);
    if (r && !r.ok) setLoi(r.loi ?? '');
    setDangLam(null);
    void nap();
  };

  /** Gạt công tắc chính. Tắt thì DỪNG máy chủ ngay để trả RAM. */
  const gatChinh = async (bat_: boolean) => {
    setSetting('aiCucBoBat', bat_);
    if (!bat_) {
      await window.cuongthai?.aiCucBo.tat();
      void nap();
    }
  };

  if (!tt) {
    return (
      <section className="ct-section">
        <h2>{dich('AI ngoại tuyến')}</h2>
        <p className="ct-field-help">{dich('Đang xem cấu hình máy…')}</p>
      </section>
    );
  }

  const { may, khuyen, khuyenCode } = tt;
  const dangTai = tienDo !== null;
  /** Bản hợp máy nhất — thứ người dùng thật sự cần biết. */
  const nenDung = khuyen.nen ? tt.kho.find((m) => m.ma === khuyen.nen) : undefined;

  /** Một hàng model — dùng cho cả danh sách chat lẫn danh sách AI Code. */
  const hang = (m: AiCucBoTinhTrang['kho'][number], duoc: boolean, laNen: boolean, ghiChu?: string) => {
    const coRoi = tt.daCo.includes(m.ma);
    const chay = tt.dangChay === m.ma;
    const ban = dangTai || dangLam !== null || !choChay;
    return (
      <div key={m.ma} className="ct-field" style={{ alignItems: 'flex-start', opacity: duoc || coRoi ? 1 : 0.55 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ct-field-label">
            {m.ten}
            {laNen && <span className="ct-the" style={{ marginLeft: 8 }}>{dich('Hợp máy bạn')}</span>}
            {chay && <span className="ct-the" style={{ marginLeft: 8 }}>{dich('Đang chạy')}</span>}
            {ghiChu && <span className="ct-the" data-tone="warn" style={{ marginLeft: 8 }}>{ghiChu}</span>}
          </div>
          <div className="ct-field-help">{m.moTa}</div>
          <div className="ct-field-help" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {dich('Tải về')} {gb(m.gb)} · {dich('cần')} {gb(m.ramGb)} {dich('bộ nhớ khi chạy')}
          </div>
          {!duoc && !coRoi && (
            <div className="ct-field-help">{dich('Máy này chưa đủ cho bản đó.')}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          {!coRoi && (
            <button type="button" className="ct-btn" disabled={ban || !duoc} onClick={() => void tai(m.ma)}>
              <Download size={14} /> {dich('Tải')}
            </button>
          )}
          {coRoi && !chay && (
            <button type="button" className="ct-btn" disabled={ban} onClick={() => void bat(m.ma)}>
              {dangLam === m.ma ? <Loader2 size={14} className="ct-spin" /> : <Play size={14} />}
              {' '}{dich('Bật')}
            </button>
          )}
          {chay && (
            <button type="button" className="ct-btn" disabled={ban} onClick={() => void tat()}>
              <Square size={14} /> {dich('Tắt')}
            </button>
          )}
          {coRoi && (
            <button type="button" className="ct-btn ct-btn-ghost" disabled={ban}
              onClick={() => void xoa(m.ma)}
              title={dich('Xoá khỏi máy')} aria-label={dich('Xoá khỏi máy')}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };
  const modelCode = tt.kho.filter((m) => m.code);
  const nenCode = khuyenCode.nen ? tt.kho.find((m) => m.ma === khuyenCode.nen) : undefined;
  const mucMay = khuyenCode.muc === 'manh' ? dich('Máy mạnh') : khuyenCode.muc === 'vua' ? dich('Máy trung bình') : dich('Máy yếu cho AI Code');

  return (
    <section className="ct-section" id="ai-ngoai-tuyen" ref={khung}>
      <h2>{dich('AI ngoại tuyến')}</h2>
      <p className="ct-field-help">
        {dich('Tải AI về chạy thẳng trên máy bạn. Mất mạng vẫn hỏi được, và câu hỏi không rời khỏi máy. Đổi lại, nó trả lời kém hơn bản trên mạng.')}
      </p>

      {/* ── Hai công tắc ────────────────────────────────── */}
      <div className="ct-field" style={{ marginTop: 14 }}>
        <div>
          <div className="ct-field-label">{dich('Cho phép chạy AI trên máy')}</div>
          <div className="ct-field-help">
            {dich('Tắt thì dừng ngay và trả lại bộ nhớ. File đã tải vẫn giữ nguyên, bật lại là dùng được.')}
          </div>
        </div>
        <label className="ct-switch">
          <input type="checkbox" checked={choChay}
            onChange={(e) => void gatChinh(e.target.checked)} />
          <span />
        </label>
      </div>

      <div className="ct-field" style={{ opacity: choChay ? 1 : 0.5 }}>
        <div>
          <div className="ct-field-label">{dich('Mất mạng thì tự dùng AI trên máy')}</div>
          <div className="ct-field-help">
            {dich('Tắt thì lúc mất mạng app báo lỗi như cũ thay vì tự trả lời bằng bản yếu hơn.')}
          </div>
        </div>
        <label className="ct-switch">
          <input type="checkbox" checked={tuDong} disabled={!choChay}
            onChange={(e) => setSetting('aiCucBoTuDong', e.target.checked)} />
          <span />
        </label>
      </div>

      {/* ── Máy này ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, marginBottom: 4 }}>
        <span className="ct-field-label" style={{ flex: 1 }}>{dich('Máy của bạn')}</span>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void quetLai()}
          disabled={dangQuet}>
          {dangQuet ? <Loader2 size={14} className="ct-spin" /> : <RefreshCw size={14} />}
          {' '}{dich('Kiểm tra máy')}
        </button>
      </div>
      <div className="ct-rows">
        <div className="ct-row">
          <dt><HardDrive size={14} style={{ verticalAlign: -2, marginRight: 6 }} />{dich('Bộ nhớ (RAM)')}</dt>
          <dd>{may.ramGb > 0 ? gb(may.ramGb) : '—'}</dd>
        </div>
        <div className="ct-row">
          <dt>{dich('Đĩa còn trống')}</dt>
          {/* `-1` = chưa đo được (hệ không cho hỏi), KHÁC hẳn "còn 0 GB". Gộp
              hai thứ đó chính là lỗi đã khoá sạch nút tải của mọi người dùng. */}
          <dd>{may.diaGb > 0 ? gb(may.diaGb) : dich('chưa đọc được')}</dd>
        </div>
        <div className="ct-row">
          <dt><Cpu size={14} style={{ verticalAlign: -2, marginRight: 6 }} />{dich('Tăng tốc bằng GPU')}</dt>
          <dd>
            {may.coGpu ? (may.tenGpu || dich('Có')) : dich('Chưa thấy')}
            {/* Nói thật chỗ mình chưa chắc. Trước khi cài bộ chạy, app mới chỉ
                đọc TÊN card — chưa chạy thử nên chưa biết dùng được không. */}
            {!may.chacChan && (
              <span className="ct-field-help" style={{ marginLeft: 8 }}>
                {dich('(chưa chạy thử nên chưa chắc)')}
              </span>
            )}
          </dd>
        </div>
      </div>

      {/* Khuyến nghị đặt NỔI BẬT, không trộn vào chữ phụ: đây là câu trả lời
          cho câu hỏi duy nhất người dùng có lúc này — "máy tôi nên tải bản
          nào". Chôn nó trong một dòng xám là bắt họ tự đoán. */}
      <div style={{
        marginTop: 12,
        padding: '12px 14px',
        borderRadius: 10,
        border: '1px solid var(--ct-line, #e5e7eb)',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
      >
        <Sparkles size={16} style={{ flexShrink: 0, marginTop: 2, opacity: 0.8 }} />
        <div style={{ flex: 1 }}>
          {nenDung && (
            <div className="ct-field-label" style={{ marginBottom: 2 }}>
              {dich('Nên dùng:')} {nenDung.ten} · {gb(nenDung.gb)}
            </div>
          )}
          <div className="ct-field-help" style={{ margin: 0 }}>{khuyen.vi}</div>
          {nenDung && !tt.daCo.includes(nenDung.ma) && !dangTai && (
            <button type="button" className="ct-btn" style={{ marginTop: 10 }}
              disabled={!choChay || dangLam !== null}
              onClick={() => void tai(nenDung.ma)}>
              <Download size={14} /> {dich('Tải bản này')}
            </button>
          )}
        </div>
      </div>

      {/* ── Thanh tiến độ ───────────────────────────────── */}
      {dangTai && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Loader2 size={14} className="ct-spin" />
            <span style={{ flex: 1, fontSize: 13 }}>{tienDo.viec}</span>
            <span style={{ fontSize: 12, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
              {tienDo.phanTram}% {tocDo(tienDo.bps)}
            </span>
            <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void huy()}
              title={dich('Dừng tải')} aria-label={dich('Dừng tải')}>
              <X size={14} />
            </button>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--ct-line, #e5e7eb)' }}>
            <div style={{
              height: '100%',
              borderRadius: 3,
              width: `${Math.min(100, Math.max(0, tienDo.phanTram))}%`,
              background: 'var(--ct-accent, #2563eb)',
              transition: 'width .3s',
            }}
            />
          </div>
          <p className="ct-field-help" style={{ marginTop: 6 }}>
            {dich('Dừng giữa chừng cũng không mất phần đã tải — bấm tải lại là chạy tiếp.')}
          </p>
        </div>
      )}

      {loi && <p className="ct-loi" style={{ marginTop: 12 }}>{loi}</p>}

      {/* ── Các bản cho CHAT ────────────────────────────── */}
      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        {tt.kho.filter((m) => m.ma !== 'code').map((m) => hang(m, khuyen.choPhep.includes(m.ma), khuyen.nen === m.ma))}
      </div>

      {/* ── AI CODE NGOẠI TUYẾN (03/10/2026) ─────────────────
          Mục riêng vì câu hỏi riêng: "máy tôi có chạy được AI Code khi mất
          mạng không, bản nào, vì sao". Agent nạp lại cả hội thoại MỖI bước nên
          ngưỡng cao hơn chat nhiều — máy chạy chat tốt chưa chắc chạy nổi agent. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 22 }}>
        <Code2 size={16} aria-hidden />
        <span className="ct-field-label" style={{ flex: 1 }}>{dich('AI Code ngoại tuyến')}</span>
        <span className="ct-the" data-tone={khuyenCode.muc === 'yeu' ? 'warn' : undefined}>{mucMay}</span>
      </div>
      <p className="ct-field-help" style={{ marginTop: 4 }}>
        {dich('Mất mạng thì AI Code tự chạy bằng model trên máy: đọc mã, sửa file, chạy lệnh — vẫn qua đúng các bước duyệt như khi có mạng. Có mạng lại sẽ hỏi quay về AI máy chủ.')}
      </p>
      <div style={{
        marginTop: 8, padding: '12px 14px', borderRadius: 10,
        border: '1px solid var(--ct-line, #e5e7eb)', display: 'flex', gap: 10, alignItems: 'flex-start',
      }}
      >
        <Sparkles size={16} style={{ flexShrink: 0, marginTop: 2, opacity: 0.8 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {nenCode && (
            <div className="ct-field-label" style={{ marginBottom: 2 }}>
              {dich('Nên dùng:')} {nenCode.ten} · {gb(nenCode.gb)}
            </div>
          )}
          <div className="ct-field-help" style={{ margin: 0 }}>{khuyenCode.vi}</div>
          {typeof may.vramGb === 'number' && may.vramGb > 0 && may.nenTang !== 'darwin' && (
            <div className="ct-field-help" style={{ margin: '4px 0 0' }}>
              {dich('VRAM đo được:')} {gb(may.vramGb)}{tt.boChayCuda ? ` · ${dich('đang dùng bộ chạy CUDA')}` : ''}
            </div>
          )}
          {nenCode && !tt.daCo.includes(nenCode.ma) && !dangTai && (
            <button type="button" className="ct-btn" style={{ marginTop: 10 }}
              disabled={!choChay || dangLam !== null}
              onClick={() => void tai(nenCode.ma)}>
              <Download size={14} /> {dich('Tải bản này cho AI Code')}
            </button>
          )}
        </div>
      </div>
      {khuyenCode.muc !== 'yeu' && (
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {modelCode.map((m) => hang(
            m,
            khuyenCode.choPhep.includes(m.ma),
            khuyenCode.nen === m.ma,
            m.code?.nhan === 'chỉ việc nhỏ' ? dich('chỉ việc nhỏ') : undefined,
          ))}
        </div>
      )}

      <p className="ct-field-help" style={{ marginTop: 14 }}>
        {dich('Khi có mạng, app vẫn tự dùng bản trên mạng vì nó trả lời tốt hơn. AI trên máy là lưới đỡ lúc mất kết nối.')}
        {' '}
        {/* Mở bằng trình duyệt HỆ THỐNG, không mở trong app: trang hướng dẫn là
            nội dung web thường, và nhét nó vào cửa sổ app chỉ tạo thêm một chỗ
            người dùng bị kẹt không biết bấm gì để quay lại. */}
        <a
          href="https://cuongthai.com/huong-dan/ai-ngoai-tuyen"
          onClick={(e) => {
            e.preventDefault();
            void window.cuongthai?.app.openExternal('https://cuongthai.com/huong-dan/ai-ngoai-tuyen');
          }}
        >
          {dich('Xem hướng dẫn đầy đủ')}
        </a>
      </p>
    </section>
  );
}
