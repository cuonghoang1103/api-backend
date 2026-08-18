/**
 * ============================================================
 * THU TIẾNG + PHÁT TIẾNG cho cửa sổ robot nổi
 * ============================================================
 *
 * Cửa sổ robot là một cây React RIÊNG, không dùng chung `useOdin` với app
 * chính. Nên phần thu/phát ở đây phải tự đứng — nhưng CỐ Ý mỏng: mọi việc nặng
 * (nhận dạng, hỏi trợ lý, máy đọc) nằm ở tiến trình main, vì cửa sổ này chạy ở
 * origin `app://cuongthai` và không giữ phiên đăng nhập.
 *
 * ⚠️ TẮT MICRO NGAY KHI THU XONG. Không dừng track thì đèn micro của máy vẫn
 * sáng sau khi người dùng thả tay, và họ có mọi lý do để nghĩ app đang nghe
 * lén. Đây là lý do `dungHet()` được gọi ở CẢ hai lối ra.
 */

export interface BoThu {
  dung: () => void;
}

/** Bắt đầu thu. Trả về `null` nếu không mở được micro. */
export async function batDauThu(
  xong: (tiengBase64: string) => void,
): Promise<BoThu | null> {
  let luong: MediaStream;
  try {
    luong = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return null;
  }

  const mau: BlobPart[] = [];
  const may = new MediaRecorder(luong);
  const dungHet = (): void => { for (const t of luong.getTracks()) t.stop(); };

  may.ondataavailable = (e) => { if (e.data.size > 0) mau.push(e.data); };
  may.onstop = () => {
    dungHet();
    const blob = new Blob(mau, { type: 'audio/webm' });
    // Thu quá ngắn (bấm nhầm) thì đừng phiền máy chủ — và cũng đừng để người
    // dùng chờ một vòng nhận dạng cho 0,2 giây tiếng ồn.
    if (blob.size < 2000) return;
    const doc = new FileReader();
    doc.onloadend = () => {
      const s = String(doc.result ?? '');
      const i = s.indexOf(',');
      if (i > 0) xong(s.slice(i + 1));
    };
    doc.readAsDataURL(blob);
  };

  may.start();
  return {
    dung: () => {
      if (may.state === 'recording') may.stop();
      else dungHet();
    },
  };
}

// ─── Phát tiếng ─────────────────────────────────────────────────────

let the: HTMLAudioElement | null = null;
let urlDangPhat: string | null = null;

/** Dừng ngay câu đang đọc. An toàn khi gọi lúc không có gì đang phát. */
export function ngungPhat(): void {
  the?.pause();
  if (urlDangPhat) { URL.revokeObjectURL(urlDangPhat); urlDangPhat = null; }
}

/**
 * Phát tiếng đọc. Trả về khi phát xong (hoặc bị dừng).
 *
 * MỘT thẻ audio dùng chung: mỗi câu một thẻ mới thì hai câu liền nhau chồng
 * tiếng lên nhau, và không có cách nào tắt câu đang đọc dở.
 */
export async function phatBase64(base64: string): Promise<void> {
  ngungPhat();
  const byte = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([byte], { type: 'audio/wav' }));
  urlDangPhat = url;
  the ??= new Audio();
  the.src = url;
  await new Promise<void>((xong) => {
    if (!the) { xong(); return; }
    const het = (): void => {
      the?.removeEventListener('ended', het);
      the?.removeEventListener('pause', het);
      the?.removeEventListener('error', het);
      xong();
    };
    the.addEventListener('ended', het);
    the.addEventListener('pause', het);   // người dùng bấm dừng
    the.addEventListener('error', het);   // tệp hỏng — đừng treo mãi
    void the.play().catch(het);
  });
  if (urlDangPhat === url) { URL.revokeObjectURL(url); urlDangPhat = null; }
}
