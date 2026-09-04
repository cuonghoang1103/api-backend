/**
 * ============================================================
 * BẢNG HOOK & KỸ NĂNG
 * ============================================================
 *
 * Hai thứ này đều cấu hình bằng FILE và chỉ lộ ra khi agent chạy — nên trước
 * bảng này, cách duy nhất để biết mình gõ đúng chưa là hỏi agent một câu thật:
 * trả tiền cho một lượt model để kiểm một dòng JSON.
 *
 * Ba thứ bảng này trả lời, và đều là câu hỏi người ta thật sự hỏi lúc cấu hình:
 *  • "Hook của tôi có được đọc không?" → số hook, và nút chạy thử.
 *  • "Nó đã chạy chưa?" → nhật ký, GỒM CẢ lần đạt mà không in gì. Hook đạt và
 *    im lặng là trạng thái cố ý (xem `hook.ts`), nhưng nó trông y hệt "hook
 *    không hề chạy" — đúng chỗ người ta mắc kẹt lâu nhất.
 *  • "Model thấy kỹ năng nào?" → danh sách ĐÚNG NHƯ nó nhận, không phải thứ
 *    tôi đoán từ tên thư mục.
 */
import { useCallback, useEffect, useState } from 'react';
import { FileCode2, Play, RotateCw } from 'lucide-react';
import { useMoRieng } from '../../components/moRieng';
import type { AgentHookNhatKy } from '../../../shared/ipc';

const MOC: Array<{ ma: 'truocTool' | 'sauTool' | 'xongLuot'; ten: string }> = [
  { ma: 'sauTool', ten: 'Sau tool' },
  { ma: 'truocTool', ten: 'Trước tool' },
  { ma: 'xongLuot', ten: 'Xong lượt' },
];

function gio(luc: number): string {
  return new Date(luc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function BangHook({ cuocId, khoa }: { cuocId: string; khoa: boolean }) {
  const { mo, bat, boc } = useMoRieng('agent:hook');
  const [soHook, datSoHook] = useState<number | null>(null);
  const [nhatKy, datNhatKy] = useState<AgentHookNhatKy[]>([]);
  const [kyNang, datKyNang] = useState<Array<{ ten: string; moTa: string }>>([]);
  const [moc, datMoc] = useState<'truocTool' | 'sauTool' | 'xongLuot'>('sauTool');
  const [tenTool, datTenTool] = useState('edit_file');
  const [dangThu, datDangThu] = useState(false);
  const [ketQua, datKetQua] = useState<{ chan: boolean; ra: string } | null>(null);

  const napLai = useCallback(async () => {
    const b = window.cuongthai?.agent;
    if (!b) return;
    const [n, nk, kn] = await Promise.all([
      b.hookDem().catch(() => 0),
      b.hookNhatKy().catch(() => []),
      b.kyNangDs(cuocId).catch(() => []),
    ]);
    datSoHook(n); datNhatKy(nk); datKyNang(kn);
  }, [cuocId]);

  /* Đọc lại MỖI LẦN MỞ, không chỉ lúc gắn: người ta mở bảng này ngay sau khi
     vừa sửa file cấu hình, và một con số cũ là câu trả lời sai cho đúng câu
     hỏi họ đang hỏi. Cùng lý do như bảng MCP. */
  useEffect(() => { void napLai(); }, [mo, napLai]);

  const chayThu = (): void => {
    datDangThu(true);
    datKetQua(null);
    void window.cuongthai?.agent.hookThu(cuocId, moc, tenTool)
      .then((r) => { datKetQua({ chan: r.chan, ra: r.ra }); return napLai(); })
      .catch((e: unknown) => datKetQua({ chan: false, ra: `Lỗi: ${(e as Error).message}` }))
      .finally(() => datDangThu(false));
  };

  return (
    <div className="ct-mcp-boc" ref={boc}>
      <button
        type="button"
        className="ct-btn ct-btn-ghost"
        onClick={bat}
        disabled={khoa}
        title="Hook và kỹ năng của dự án"
      >
        Hook
        {soHook !== null && soHook > 0 && <span className="ct-mcp-dem">{soHook}</span>}
      </button>

      {mo && (
        <div className="ct-mcp-bang">
          <div className="ct-mcp-dau"><strong>Hook</strong></div>
          <p className="ct-mcp-chan">
            Chạy lệnh của bạn quanh mỗi lời gọi tool. Đầu ra của <code>Sau tool</code> được
            {' '}nối vào kết quả tool, nên agent ĐỌC ĐƯỢC — ví dụ <code>npx tsc --noEmit</code>
            {' '}sau mỗi lần nó sửa file.
            {soHook !== null && <> {' '}Đang có <strong>{soHook}</strong> hook.</>}
          </p>
          {/* Cảnh báo đặt Ở ĐÂY chứ không trong tài liệu: hook thiếu `khop` chạy sau
              MỌI tool, kể cả `read_file`, nên một `npm test` sẽ chạy vài chục lần
              trong một lượt — và người ta chỉ phát hiện khi thấy app "chậm lạ". */}
          <p className="ct-mcp-canh">
            ⚠️ Hook không có <code>khop</code> sẽ chạy sau <strong>mọi</strong> tool, kể cả
            {' '}<code>read_file</code>. Luôn đặt <code>khop</code>.
          </p>

          <div className="ct-hook-nut">
            <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho"
              onClick={() => { void window.cuongthai?.agent.hookMoCauHinh().then(napLai); }}>
              <FileCode2 size={12} aria-hidden /> Mở file cấu hình
            </button>
            <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho" onClick={() => void napLai()}>
              <RotateCw size={12} aria-hidden /> Nạp lại
            </button>
          </div>

          {/* ── Chạy thử ── */}
          <div className="ct-mcp-nhom">
            <strong className="ct-hook-tieu">Chạy thử</strong>
            <p className="ct-mcp-chan">Không tốn lượt agent nào. Chạy thật trong thư mục dự án.</p>
            <div className="ct-hook-thu">
              <select value={moc} onChange={(e) => datMoc(e.target.value as typeof moc)}>
                {MOC.map((m) => <option key={m.ma} value={m.ma}>{m.ten}</option>)}
              </select>
              <input
                value={tenTool}
                onChange={(e) => datTenTool(e.target.value)}
                placeholder="tên tool giả, vd edit_file"
                disabled={moc === 'xongLuot'}
                aria-label="Tên tool để thử khớp"
              />
              <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho"
                onClick={chayThu} disabled={dangThu}>
                <Play size={12} aria-hidden /> {dangThu ? 'Đang chạy…' : 'Chạy thử'}
              </button>
            </div>
            {ketQua && (
              <pre className="ct-hook-ra" data-chan={ketQua.chan}>
                {ketQua.chan ? '⛔ Hook này sẽ CHẶN tool.\n\n' : ''}{ketQua.ra}
              </pre>
            )}
          </div>

          {/* ── Nhật ký ── */}
          <div className="ct-mcp-nhom">
            <strong className="ct-hook-tieu">Lần chạy gần đây</strong>
            {nhatKy.length === 0 ? (
              <p className="ct-mcp-trong">Chưa có hook nào chạy trong phiên này.</p>
            ) : (
              <ul className="ct-hook-nk">
                {nhatKy.map((m, i) => (
                  <li key={`${m.luc}-${i}`} data-dat={m.ma === 0} data-chan={m.chan}>
                    <span className="ct-hook-nk-gio">{gio(m.luc)}</span>
                    <code>{m.lenh}</code>
                    <span className="ct-hook-nk-phu">
                      {m.tenTool ? `${m.tenTool} · ` : ''}
                      {m.ma === 0 ? 'đạt' : m.ma === null ? 'bị giết' : `thoát ${m.ma}`}
                      {' · '}{m.giay.toFixed(1)}s
                      {m.chan ? ' · ĐÃ CHẶN' : ''}
                    </span>
                    {/* Nói RÕ "đạt, không in gì" thay vì để trống: đó chính là trạng
                        thái trông giống "hook không chạy" nhất. */}
                    {m.dong1 === '' && m.ma === 0 && <em className="ct-hook-nk-im">đạt, không in gì</em>}
                    {m.dong1 !== '' && <span className="ct-hook-nk-ra">{m.dong1}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Kỹ năng ── */}
          <div className="ct-mcp-nhom">
            <strong className="ct-hook-tieu">Kỹ năng model đang thấy</strong>
            {kyNang.length === 0 ? (
              <p className="ct-mcp-trong">
                Chưa có kỹ năng nào. Tạo <code>.claude/skills/&lt;tên&gt;/SKILL.md</code>,
                {' '}phần đầu phải khai <code>description</code> — thiếu nó thì kỹ năng bị bỏ qua.
              </p>
            ) : (
              <ul className="ct-hook-kn">
                {kyNang.map((k) => (
                  <li key={k.ten}><code>{k.ten}</code><span>{k.moTa}</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
