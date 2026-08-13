'use client';

/**
 * Thanh nhắc "mạch này dài rồi".
 *
 * Vì sao cần: mỗi lượt hỏi đều gửi LẠI toàn bộ lịch sử lên model, nên đoạn
 * chat càng dài thì mỗi câu hỏi càng đắt — kể cả khi câu hỏi mới chẳng liên
 * quan gì bài cũ. Giải xong một bài toán là lúc lịch sử đó hết giá trị nhưng
 * vẫn tiếp tục bị tính tiền ở mọi lượt sau.
 *
 * ⚠️ "Mạch mới" KHÔNG xoá tin nhắn. Nó chỉ đặt một cái mốc: từ đây trở đi
 * ngừng gửi phần cũ lên model. Toàn bộ tiền tiết kiệm nằm ở chỗ NGỪNG GỬI,
 * nên xoá thật không rẻ hơn một đồng nào — mà lại làm mất bài giải người
 * dùng vừa nhận. Muốn xoá hẳn thì đã có nút thùng rác của phiên chat.
 */

import { motion } from 'framer-motion';
import { Scissors, X } from 'lucide-react';

interface Props {
  /** Số tin nhắn ĐANG được gửi lên model (sau mốc mạch mới). */
  soTin: number;
  /** Tổng ký tự đang gửi — thứ quyết định tiền, không phải số tin. */
  soKyTu: number;
  onMachMoi: () => void;
  onBoQua: () => void;
  skin: 'terminal' | 'studio';
}

export default function ContextBar({ soTin, soKyTu, onMachMoi, onBoQua, skin }: Props) {
  const studio = skin === 'studio';
  const nghin = Math.round(soKyTu / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mx-auto mb-3 flex max-w-3xl items-center gap-2 rounded-xl border px-3 py-2 text-[12px] ${
        studio
          ? 'border-[color:var(--studio-border)] bg-[var(--studio-panel-soft)] text-[color:var(--studio-text-soft)]'
          : 'border-[#22d3ee]/20 bg-[#0d1117]/80 font-mono text-[#94a3b8]'
      }`}
    >
      <Scissors className="h-3.5 w-3.5 shrink-0" style={{ color: studio ? 'var(--studio-accent)' : '#22d3ee' }} />
      <span className="flex-1">
        Mạch này đã dài ({soTin} tin nhắn · ~{nghin}k ký tự) và được gửi lại ở <strong>mỗi</strong> câu hỏi.
        Xong bài rồi thì cắt mạch cho đỡ tốn — tin nhắn cũ vẫn còn trên màn hình.
      </span>
      <button
        onClick={onMachMoi}
        className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition-colors ${
          studio
            ? 'bg-[var(--studio-accent)] text-white hover:opacity-90'
            : 'bg-[#22d3ee]/15 text-[#22d3ee] hover:bg-[#22d3ee]/25'
        }`}
      >
        Bắt đầu mạch mới
      </button>
      <button onClick={onBoQua} title="Để sau" className="shrink-0 rounded-lg p-1 transition-opacity hover:opacity-70">
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
