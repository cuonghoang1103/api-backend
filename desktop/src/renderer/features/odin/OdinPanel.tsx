/**
 * Cài đặt → Trợ lý Odin: ngôn ngữ, giọng của từng ngôn ngữ, và nút nghe thử.
 *
 * ⚠️ Danh sách giọng lấy TỪ MÁY CHỦ, không gõ cứng. Máy đọc thêm/bớt giọng là
 * chỗ này tự đúng theo; gõ cứng thì một hôm nào đó người dùng chọn một giọng
 * không còn tồn tại và chỉ nhận được im lặng.
 *
 * Nút nghe thử là bắt buộc chứ không phải trang trí: tên giọng ("Thái Sơn —
 * Nam · Nam · Phong cách kể chuyện") không nói lên nó nghe ra sao, và chọn
 * giọng mà không nghe được trước thì phải thử bằng cách nói chuyện thật với
 * trợ lý — vòng vo và chậm.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Volume2 } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { docThanhTieng, layDanhSachGiong, ngungNoi, phatTieng, type Giong, datTocDoDoc } from './giongNoi';

const CAU_THU: Record<'vi' | 'en', string> = {
  vi: 'Xin chào, mình là Odin. Mình sẽ đọc câu trả lời bằng giọng này.',
  en: 'Hi, I am Odin. I will read answers out loud in this voice.',
};

/**
 * Bảy mức tốc độ người dùng chọn (18/08/2026). CỐ Ý dày ở quanh 1× — đó là
 * vùng người ta thật sự tinh chỉnh; 0,85 và 0,95 nghe khác nhau rõ, còn
 * nhảy thẳng 0,5 → 1 thì không ai dùng khoảng giữa.
 */
const TOC_DO = [0.5, 0.75, 0.85, 0.95, 1, 1.25, 1.5];

export function OdinPanel() {
  const { settings, setSetting } = useAppState();
  const { api } = useSession();
  const [giong, setGiong] = useState<Giong[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangThu, setDangThu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  const ngonNgu = (settings.odinNgonNgu === 'en' ? 'en' : 'vi') as 'vi' | 'en';
  const tocDo = typeof settings.odinTocDo === 'number' ? settings.odinTocDo : 1;
  const khoaGiong = ngonNgu === 'en' ? 'odinGiongEn' : 'odinGiongVi';
  const giongDangChon = typeof settings[khoaGiong] === 'string' ? String(settings[khoaGiong]) : '';
  const noiThanhTieng = settings.odinNoiThanhTieng !== false;

  useEffect(() => {
    if (!api) return;
    let con = true;
    void layDanhSachGiong(api)
      .then((ds) => { if (con) setGiong(ds); })
      .catch((e) => { if (con) setLoi(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (con) setDangTai(false); });
    return () => { con = false; };
  }, [api]);

  const theoNgonNgu = useMemo(
    () => giong.filter((g) => (g.lang ?? 'vi').toLowerCase().startsWith(ngonNgu)),
    [giong, ngonNgu],
  );

  const thu = useCallback(async () => {
    if (!api || dangThu) return;
    setDangThu(true);
    setLoi(null);
    try {
      const blob = await docThanhTieng(api, CAU_THU[ngonNgu], giongDangChon || undefined);
      await phatTieng(blob);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : String(e));
    } finally {
      setDangThu(false);
    }
  }, [api, dangThu, ngonNgu, giongDangChon]);

  // Rời trang Cài đặt là im ngay — để câu nghe thử đọc tiếp ở trang khác thì
  // người dùng không hiểu tiếng ở đâu ra và không có nút nào tắt.
  useEffect(() => () => ngungNoi(), []);

  return (
    <section className="ct-section">
      <h2>Trợ lý Odin</h2>

      <dl className="ct-rows">
        <div className="ct-row">
          <dt>Đọc câu trả lời thành tiếng</dt>
          <dd>
            <div className="ct-segmented">
              <button type="button" data-active={noiThanhTieng}
                onClick={() => setSetting('odinNoiThanhTieng', true)}>Bật</button>
              <button type="button" data-active={!noiThanhTieng}
                onClick={() => { setSetting('odinNoiThanhTieng', false); ngungNoi(); }}>Tắt</button>
            </div>
          </dd>
        </div>

        <div className="ct-row">
          <dt>Ngôn ngữ</dt>
          <dd>
            <div className="ct-segmented">
              <button type="button" data-active={ngonNgu === 'vi'}
                onClick={() => setSetting('odinNgonNgu', 'vi')}>Tiếng Việt</button>
              <button type="button" data-active={ngonNgu === 'en'}
                onClick={() => setSetting('odinNgonNgu', 'en')}>English</button>
            </div>
          </dd>
        </div>

        <div className="ct-row">
          <dt>Ngắt lời bằng giọng</dt>
          <dd>
            <label className="ct-congtac">
              <input
                type="checkbox"
                checked={settings.odinCatLoi !== false}
                onChange={(e) => setSetting('odinCatLoi', e.target.checked)}
              />
              <span>{settings.odinCatLoi !== false ? 'Bật' : 'Tắt'}</span>
            </label>
            <p className="ct-ghichu">
              Trong màn nói chuyện, cứ nói chen vào là trợ lý im ngay — không phải
              chạm. Dùng <strong>tai nghe</strong> thì chính xác nhất; loa ngoài mở
              to có thể rò tiếng vào micro làm nó tự ngắt lời chính mình, khi đó
              hãy tắt mục này.
            </p>
          </dd>
        </div>

        <div className="ct-row">
          <dt>Tốc độ đọc</dt>
          <dd>
            <div className="ct-tocdo">
              {TOC_DO.map((v) => (
                <button
                  key={v}
                  type="button"
                  data-active={Math.abs(tocDo - v) < 0.001}
                  onClick={() => { setSetting('odinTocDo', v); datTocDoDoc(v); }}
                  title={v === 1 ? 'Tốc độ gốc' : `${v}× tốc độ gốc`}
                >
                  {v === 1 ? '1×' : `${String(v).replace('.', ',')}×`}
                </button>
              ))}
            </div>
            <p className="ct-ghichu">
              Áp cho mọi giọng, đổi là ăn ngay — không phải đọc lại. Giữ cao độ
              nên chậm lại không thành giọng trầm đục.
            </p>
          </dd>
        </div>

        <div className="ct-row">
          <dt>Giọng {ngonNgu === 'en' ? 'tiếng Anh' : 'tiếng Việt'}</dt>
          <dd style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={giongDangChon}
              disabled={dangTai || theoNgonNgu.length === 0}
              onChange={(e) => setSetting(khoaGiong, e.target.value)}
              aria-label={`Chọn giọng ${ngonNgu === 'en' ? 'tiếng Anh' : 'tiếng Việt'}`}
              style={{ minWidth: 260, padding: '7px 9px', font: 'inherit', fontSize: 13,
                border: '1px solid var(--ct-border)', borderRadius: 'var(--ct-radius-sm)',
                background: 'var(--ct-bg)', color: 'var(--ct-text)' }}
            >
              <option value="">— giọng mặc định của máy chủ —</option>
              {theoNgonNgu.map((g) => (
                <option key={g.id} value={g.id}>{g.label || g.id}</option>
              ))}
            </select>
            <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void thu()} disabled={dangThu || dangTai}>
              {dangThu ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Volume2 size={14} aria-hidden />}
              {dangThu ? 'Đang đọc…' : 'Nghe thử'}
            </button>
          </dd>
        </div>
      </dl>

      {dangTai && <p className="ct-muted">Đang lấy danh sách giọng từ máy chủ…</p>}
      {!dangTai && theoNgonNgu.length === 0 && !loi && (
        <p className="ct-muted">
          Máy chủ chưa có giọng nào cho ngôn ngữ này.
        </p>
      )}
      {loi && (
        <div className="ct-notice" data-tone="err" role="alert">
          <span>{loi}</span>
          <button type="button" className="ct-linklike" onClick={() => setLoi(null)}>Đóng</button>
        </div>
      )}
    </section>
  );
}
