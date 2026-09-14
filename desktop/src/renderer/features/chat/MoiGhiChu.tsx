/**
 * ============================================================
 * LỜI MỜI TẠO `AGENTS.md`
 * ============================================================
 *
 * ⚠️ App đọc `AGENTS.md` / `CLAUDE.md` của dự án trước MỖI lượt agent — từ lâu
 * rồi. Nhưng không chỗ nào trong giao diện nhắc tới chúng: đo 14/09/2026,
 * `grep -rn "AGENTS.md" src/renderer` ra RỖNG.
 *
 * Hậu quả đo được: agent chạy 147/160 bước cho một việc Docker/Flyway mà một
 * dòng ghi chú là xong, và người dùng hỏi thẳng *"do tôi chưa cài skill hoặc
 * prompt cho nó?"* — họ đoán đúng, nhưng app chưa bao giờ nói cho họ biết.
 * Một tính năng không ai tìm ra thì bằng không có.
 *
 * Chỉ hiện khi ĐÃ chọn thư mục và dự án CHƯA có ghi chú. Bỏ qua được, và nhớ
 * theo từng dự án — nhắc lại mãi một thứ người ta đã từ chối là phiền.
 */
import { useEffect, useState } from 'react';
import { BookText, X } from 'lucide-react';

import { useDich } from '../../i18n';

const KHOA_BO_QUA = 'ct-moi-ghi-chu-bo-qua';

function daBoQua(goc: string): boolean {
  try { return (localStorage.getItem(KHOA_BO_QUA) ?? '').split('|').includes(goc); }
  catch { return false; }
}

function boQua(goc: string): void {
  try {
    const cu = (localStorage.getItem(KHOA_BO_QUA) ?? '').split('|').filter(Boolean);
    localStorage.setItem(KHOA_BO_QUA, [...new Set([...cu, goc])].slice(-40).join('|'));
  } catch { /* chế độ riêng tư */ }
}

export function MoiGhiChu({ cuocId, coThuMuc }: { cuocId: string; coThuMuc: boolean }) {
  const { dich } = useDich();
  const [hien, datHien] = useState(false);
  const [goc, datGoc] = useState('');

  useEffect(() => {
    let huy = false;
    if (!coThuMuc) { datHien(false); return undefined; }
    void (async () => {
      const w = await window.cuongthai?.agent.getWorkspace(cuocId);
      const duong = w?.path ?? '';
      if (huy || !duong || daBoQua(duong)) return;
      const g = await window.cuongthai?.agent.ghiChuTrangThai(cuocId);
      if (huy) return;
      datGoc(duong);
      datHien(g?.co === false);
    })();
    return () => { huy = true; };
  }, [cuocId, coThuMuc]);

  if (!hien) return null;

  return (
    <div className="ct-moi-ghichu">
      <BookText size={14} aria-hidden />
      <div>
        <strong>{dich('Dự án này chưa có ghi chú cho AI Code.')}</strong>
        <span>
          {dich('Agent đọc `AGENTS.md` trước mỗi lượt. Viết vào đó lệnh chạy, lệnh test và mấy cái bẫy đã gặp — mỗi dòng tiết kiệm hàng chục bước mò mẫm.')}
        </span>
      </div>
      <button
        type="button"
        className="ct-btn ct-btn-chinh ct-mcp-nho"
        onClick={() => {
          void window.cuongthai?.agent.taoGhiChu(cuocId);
          boQua(goc);
          datHien(false);
        }}
      >
        {dich('Tạo AGENTS.md')}
      </button>
      <button
        type="button"
        className="ct-moi-ghichu-x"
        aria-label={dich('Không hiện nữa')}
        onClick={() => { boQua(goc); datHien(false); }}
      >
        <X size={13} aria-hidden />
      </button>
    </div>
  );
}
