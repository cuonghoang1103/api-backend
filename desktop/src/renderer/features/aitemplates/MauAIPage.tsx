/**
 * Mẫu AI — kho 1.877 skill/agent/command/MCP… cho Claude Code.
 *
 * ─── Dữ liệu nằm TRONG app, không gọi máy chủ ───
 * Web đọc mười tệp JSON này bằng `import` tĩnh; không có endpoint nào để gọi.
 * Nên app nhúng thẳng cùng những tệp đó qua alias `@` (trỏ vào `frontend/src`,
 * xem `vite.config.ts`): một nguồn duy nhất, không có bản sao nào để lệch, và
 * trang tra cứu được cả khi mất mạng.
 *
 * Hệ quả phải biết: danh mục chỉ mới theo từng bản app. Muốn nó tươi hơn thì
 * phải có endpoint — ghi ra đây để người sau không tưởng đó là thiếu sót.
 *
 * ─── Nội dung thật thì phải ra mạng ───
 * 1.877 tệp SKILL.md là hơn 40 MB, gấp ba mươi lần phần siêu dữ liệu, nên
 * chúng KHÔNG được đóng gói. Bấm vào một mẫu mới tải, và tải qua tiến trình
 * chính vì `connect-src` chặn renderer gọi GitHub — xem `main/ipc/mau.ts`.
 * Không tải được thì trang vẫn dùng bình thường, chỉ khuyết phần nội dung.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check, Copy, ExternalLink, FileCode2, Loader2, Search, Terminal, X,
} from 'lucide-react';
import { TYPES, SOURCE_REPO, prettyName, sourceFilePath } from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import { installRecipe } from '@/lib/ai-templates/install';
import skillsJson from '@/data/ai-templates/skills.json';
import agentsJson from '@/data/ai-templates/agents.json';
import commandsJson from '@/data/ai-templates/commands.json';
import mcpsJson from '@/data/ai-templates/mcps.json';
import settingsJson from '@/data/ai-templates/settings.json';
import hooksJson from '@/data/ai-templates/hooks.json';
import loopsJson from '@/data/ai-templates/loops.json';
import sandboxJson from '@/data/ai-templates/sandbox.json';
import templatesJson from '@/data/ai-templates/templates.json';
import pluginsJson from '@/data/ai-templates/plugins.json';
import type { NoiDungMau } from '@shared/ipc';
import { ChuAgent } from '../chat/markdown';

/** Đúng phần bản ghi trang này đọc tới. */
interface BanGhiMau {
  name: string;
  path: string;
  category: string;
  type: string;
  description: string;
  author: string;
  repo: string;
  version: string;
  license: string;
  keywords: string[];
  installCommand?: string;
  stars?: number;
}

/** Cùng thứ tự với `TYPES` — đối chiếu ngay lúc dựng bảng ở dưới. */
const JSON_THEO_SLUG: Record<string, unknown[]> = {
  skills: skillsJson,
  agents: agentsJson,
  commands: commandsJson,
  mcps: mcpsJson,
  settings: settingsJson,
  hooks: hooksJson,
  loops: loopsJson,
  sandbox: sandboxJson,
  templates: templatesJson,
  plugins: pluginsJson,
};

/**
 * Ghép siêu dữ liệu loại với dữ liệu thật.
 *
 * Dựng ở cấp module: 1.801 bản ghi chỉ được ép kiểu đúng một lần cho cả vòng
 * đời app, thay vì mỗi lần mở trang.
 */
const KHO = TYPES.map((meta) => ({
  meta,
  ds: (JSON_THEO_SLUG[meta.slug] ?? []) as BanGhiMau[],
}));

const TONG = KHO.reduce((n, k) => n + k.ds.length, 0);
const WEB = 'https://cuongthai.com/ai-templates';

/** Trần số thẻ vẽ một lúc. 871 thẻ cùng lúc làm khung hình rơi thấy rõ. */
const TRAN_VE = 120;

/** Bỏ dấu để gõ "bao mat" ra "bảo mật" — cùng luật với Nhạc và Ghi chú. */
function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function MauAIPage() {
  const [iKho, setIKho] = useState(0);
  const [tim, setTim] = useState('');
  const [nhomChon, setNhomChon] = useState<string | null>(null);
  const [chon, setChon] = useState<BanGhiMau | null>(null);
  const [veToiDa, setVeToiDa] = useState(TRAN_VE);
  const [daChep, setDaChep] = useState<string | null>(null);

  /* Nội dung tệp: `undefined` = chưa tải xong, `null` = tải hỏng. Hai trạng
     thái đó phải tách nhau, gộp lại thì giao diện không phân biệt được "đang
     quay" với "chịu, mở trên GitHub đi". */
  const [noiDung, setNoiDung] = useState<NoiDungMau | null | undefined>(undefined);

  const kho = KHO[iKho]!;
  const dsRef = useRef<HTMLDivElement | null>(null);

  const nhom = useMemo(() => {
    const dem = new Map<string, number>();
    for (const m of kho.ds) dem.set(m.category, (dem.get(m.category) ?? 0) + 1);
    return [...dem.entries()]
      .map(([slug, so]) => ({ slug, nhan: categoryLabel(slug), so }))
      .sort((a, b) => b.so - a.so || a.nhan.localeCompare(b.nhan, 'vi'));
  }, [kho]);

  const ketQua = useMemo(() => {
    const t = fold(tim.trim());
    return kho.ds.filter((m) => {
      if (nhomChon && m.category !== nhomChon) return false;
      if (!t) return true;
      /* `categoryLabel` PHẢI có trong đống chữ để tìm. Cột bên trái hiện nhãn
         tiếng Việt ("Bảo mật"), nên người dùng gõ đúng chữ mình đang nhìn —
         mà dữ liệu gốc chỉ có slug tiếng Anh ("security"). Đo thật: thiếu dòng
         này thì "bao mat" trả về 0 kết quả trong khi cột trái ghi 44 mục. */
      return fold(
        `${m.name} ${m.description} ${m.category} ${categoryLabel(m.category)} ${m.author} ${(m.keywords ?? []).join(' ')}`,
      ).includes(t);
    });
  }, [kho, tim, nhomChon]);

  /* Đổi loại/lọc/tìm ⇒ về lại trần mặc định và cuộn lên đầu. Giữ nguyên trần
     cũ thì người vừa bấm "xem thêm" ở kho 871 mục sẽ nhận nguyên 871 thẻ của
     kho tiếp theo mà không hề yêu cầu. */
  useEffect(() => {
    setVeToiDa(TRAN_VE);
    if (dsRef.current) dsRef.current.scrollTop = 0;
  }, [iKho, tim, nhomChon]);

  /* Tải nội dung thật của mẫu đang chọn. */
  useEffect(() => {
    if (!chon) return;
    const duong = sourceFilePath(kho.meta, chon.path);
    // Template và Plugin không có tệp nguồn (`contentMode: 'none'`).
    if (!duong) { setNoiDung(null); return; }

    /* Đọc cầu nối ra biến TRƯỚC. Viết `window.cuongthai?.mau.noiDung(...)`
       thì `?.` ngắn mạch CẢ chuỗi khi không có cầu nối — `.then` không bao giờ
       chạy, `noiDung` kẹt ở `undefined`, và giao diện quay vòng vĩnh viễn mà
       không một lỗi nào. Đúng cái hố đã làm `/profile` treo bất tận. */
    const cau = window.cuongthai;
    if (!cau) { setNoiDung(null); return; }

    let huy = false;
    setNoiDung(undefined);
    void cau.mau
      .noiDung(duong)
      .then((kq) => { if (!huy) setNoiDung(kq); })
      .catch(() => { if (!huy) setNoiDung(null); });
    return () => { huy = true; };
  }, [chon, kho.meta]);

  const chep = useCallback((chu: string, id: string) => {
    void navigator.clipboard.writeText(chu).then(() => {
      setDaChep(id);
      setTimeout(() => setDaChep((cu) => (cu === id ? null : cu)), 1800);
    });
  }, []);

  const moNgoai = (url: string) => void window.cuongthai?.app.openExternal(url);

  const congThuc = chon ? installRecipe(chon) : null;

  return (
    <div className="ct-page ct-mau">
      <header className="ct-mau-dau">
        <div>
          <h1>Mẫu AI</h1>
          <p className="ct-muted">
            {TONG.toLocaleString('vi-VN')} mẫu cho Claude Code — tra cứu được cả khi mất mạng.
          </p>
        </div>
        <div className="ct-mau-dau-nut">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(SOURCE_REPO)}>
            <ExternalLink size={14} aria-hidden /> Repo gốc
          </button>
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            onClick={() => moNgoai(`${WEB}/${kho.meta.slug}`)}
          >
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      <div className="ct-mau-loai" role="tablist" aria-label="Loại mẫu">
        {KHO.map((k, i) => (
          <button
            key={k.meta.slug}
            type="button"
            role="tab"
            aria-selected={i === iKho}
            data-active={i === iKho}
            style={{ '--mau-sac': k.meta.color } as React.CSSProperties}
            onClick={() => { setIKho(i); setNhomChon(null); setChon(null); }}
          >
            <span className="ct-mau-cham" aria-hidden />
            {k.meta.label}
            <span className="ct-mau-dem">{k.ds.length}</span>
          </button>
        ))}
      </div>

      <p className="ct-mau-blurb">{kho.meta.blurb}</p>

      <div className="ct-mau-than">
        <aside className="ct-mau-nhom">
          <p className="ct-mau-nhom-nhan">Danh mục</p>
          <button type="button" data-active={nhomChon === null} onClick={() => setNhomChon(null)}>
            Tất cả <span>{kho.ds.length}</span>
          </button>
          {nhom.map((n) => (
            <button
              key={n.slug}
              type="button"
              data-active={nhomChon === n.slug}
              onClick={() => setNhomChon(n.slug)}
              title={n.slug}
            >
              {n.nhan} <span>{n.so}</span>
            </button>
          ))}
        </aside>

        <div className="ct-mau-giua">
          <label className="ct-music-search ct-mau-tim">
            <Search size={14} aria-hidden />
            <input
              value={tim}
              onChange={(e) => setTim(e.target.value)}
              placeholder={`Tìm trong ${kho.ds.length.toLocaleString('vi-VN')} ${kho.meta.label}…`}
              aria-label="Tìm mẫu"
            />
            {tim && (
              <button type="button" className="ct-linklike" onClick={() => setTim('')} aria-label="Xoá tìm kiếm">
                <X size={13} aria-hidden />
              </button>
            )}
          </label>

          <p className="ct-mau-sokq">
            {ketQua.length.toLocaleString('vi-VN')} kết quả
            {nhomChon && (
              <>
                {' · '}
                <button type="button" className="ct-linklike" onClick={() => setNhomChon(null)}>
                  bỏ lọc “{categoryLabel(nhomChon)}”
                </button>
              </>
            )}
          </p>

          <div className="ct-mau-ds" ref={dsRef}>
            {ketQua.length === 0 ? (
              <div className="ct-empty">
                <Search size={26} aria-hidden className="ct-empty-icon" />
                <p>Không mẫu nào khớp “{tim}”.</p>
              </div>
            ) : (
              <>
                {ketQua.slice(0, veToiDa).map((m) => (
                  <button
                    key={`${m.category}/${m.path}`}
                    type="button"
                    className="ct-mau-the"
                    data-current={chon?.path === m.path}
                    style={{ '--mau-sac': kho.meta.color } as React.CSSProperties}
                    onClick={() => setChon(m)}
                  >
                    <span className="ct-mau-the-ten">{prettyName(m.name)}</span>
                    {m.description && <span className="ct-mau-the-mo">{m.description}</span>}
                    <span className="ct-mau-the-chan">
                      <span className="ct-mau-tag">{categoryLabel(m.category)}</span>
                      {m.author && <span className="ct-muted">{m.author}</span>}
                    </span>
                  </button>
                ))}
                {/* Nói thẳng khi còn mục chưa vẽ. Im lặng cắt ở 120 thì người
                    dùng tưởng kho chỉ có ngần ấy. */}
                {ketQua.length > veToiDa && (
                  <button
                    type="button"
                    className="ct-btn ct-btn-ghost ct-mau-them"
                    onClick={() => setVeToiDa((n) => n + TRAN_VE * 2)}
                  >
                    Xem thêm — còn {(ketQua.length - veToiDa).toLocaleString('vi-VN')} mẫu
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {chon && congThuc && (
          <aside className="ct-mau-chitiet">
            <div className="ct-mau-chitiet-dau">
              <span className="ct-mau-cham" style={{ '--mau-sac': kho.meta.color } as React.CSSProperties} aria-hidden />
              <h2>{prettyName(chon.name)}</h2>
              <button type="button" className="ct-trk-action" onClick={() => setChon(null)} aria-label="Đóng">
                <X size={15} aria-hidden />
              </button>
            </div>

            {chon.description && <p className="ct-mau-chitiet-mo">{chon.description}</p>}

            {/* Lệnh cài — thứ người dùng đến trang này để lấy. */}
            <div className="ct-mau-lenh">
              <p className="ct-mau-lenh-nhan">
                {congThuc.kind === 'shell' ? <Terminal size={13} aria-hidden /> : <FileCode2 size={13} aria-hidden />}
                {congThuc.hint}
              </p>
              <pre>{congThuc.lines.join('\n')}</pre>
              <button
                type="button"
                className="ct-btn"
                onClick={() => chep(congThuc.lines.join('\n'), 'lenh')}
              >
                {daChep === 'lenh' ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                {daChep === 'lenh' ? 'Đã chép' : 'Chép lệnh'}
              </button>
            </div>

            <dl className="ct-mau-tin">
              <dt>Danh mục</dt><dd>{categoryLabel(chon.category)}</dd>
              {chon.author && <><dt>Tác giả</dt><dd>{chon.author}</dd></>}
              {chon.version && <><dt>Phiên bản</dt><dd>{chon.version}</dd></>}
              {chon.license && <><dt>Giấy phép</dt><dd>{chon.license}</dd></>}
              {typeof chon.stars === 'number' && <><dt>Sao GitHub</dt><dd>{chon.stars.toLocaleString('vi-VN')}</dd></>}
            </dl>

            {(chon.keywords ?? []).length > 0 && (
              <div className="ct-mau-tu">
                {chon.keywords.slice(0, 12).map((k) => <span key={k}>{k}</span>)}
              </div>
            )}

            {/* Nội dung thật của tệp */}
            <div className="ct-mau-noidung">
              {noiDung === undefined ? (
                <p className="ct-muted ct-mau-dangtai">
                  <Loader2 size={14} aria-hidden className="ct-spin" /> Đang tải nội dung…
                </p>
              ) : noiDung === null ? (
                <p className="ct-muted">
                  {kho.meta.contentMode === 'none'
                    ? 'Loại này không có tệp nguồn riêng — nội dung nằm trong chính gói cài.'
                    : 'Không tải được nội dung (mất mạng hoặc repo gốc đã đổi tệp).'}{' '}
                  <button type="button" className="ct-linklike" onClick={() => moNgoai(SOURCE_REPO)}>
                    Xem trên GitHub
                  </button>
                </p>
              ) : (
                <>
                  <div className="ct-mau-noidung-thanh">
                    <span className="ct-muted">Nội dung tệp</span>
                    <button type="button" className="ct-linklike" onClick={() => chep(noiDung.text, 'tep')}>
                      {daChep === 'tep' ? 'Đã chép' : 'Chép tệp'}
                    </button>
                    <button type="button" className="ct-linklike" onClick={() => moNgoai(noiDung.url)}>
                      GitHub
                    </button>
                  </div>
                  <ChuAgent text={noiDung.text} />
                  {noiDung.catBot && (
                    <p className="ct-muted" style={{ fontSize: 12 }}>
                      Tệp dài, đã cắt bớt phần cuối — mở trên GitHub để xem trọn.
                    </p>
                  )}
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
