/**
 * Sổ model + lời khuyên cho máy người dùng.
 *
 * Hai thứ ở đây hỏng thì hỏng CÂM, và người dùng là người trả giá:
 * một tên file sai ⇒ họ bấm "Tải" rồi chờ ba phút để nhận 404; một ngưỡng sai
 * ⇒ họ tải 2,5 GB về rồi ngồi chờ 71 giây mỗi câu hỏi.
 */
import { describe, expect, it } from 'vitest';
import {
  BAN_LLAMA, MODEL, duongBoChay, duongModel, goiBoChay, loiKhuyen, timModel, tongGb,
} from './kho';

const MAY_TOT = { ramGb: 32, diaGb: 200, coGpu: true };

describe('sổ bộ chạy', () => {
  it('có gói cho cả sáu nền tảng desktop', () => {
    for (const [nen, arch] of [
      ['darwin', 'arm64'], ['darwin', 'x64'],
      ['win32', 'x64'], ['win32', 'arm64'],
      ['linux', 'x64'], ['linux', 'arm64'],
    ] as const) {
      expect(goiBoChay(nen, arch).length, `thiếu gói cho ${nen}-${arch}`).toBeGreaterThan(0);
    }
  });

  it('nền tảng lạ trả về rỗng chứ không ném', () => {
    expect(goiBoChay('freebsd', 'x64')).toEqual([]);
    expect(goiBoChay('darwin', 'ia32')).toEqual([]);
  });

  it('gói nhanh đứng TRƯỚC gói lùi — thứ tự chính là ưu tiên', () => {
    const win = goiBoChay('win32', 'x64');
    expect(win[0]!.tangToc).toBe('vulkan');
    expect(win[win.length - 1]!.tangToc).toBe('cpu');
  });

  it('KHÔNG dùng gói CUDA — 391 MB cho một lưới đỡ là đổi sai chiều', () => {
    for (const nen of ['darwin', 'win32', 'linux']) {
      for (const a of ['x64', 'arm64']) {
        for (const g of goiBoChay(nen, a)) {
          expect(g.ten, `${g.ten} là gói CUDA`).not.toMatch(/cuda|cudart/i);
        }
      }
    }
  });

  it('mọi tên gói đều mang đúng số bản đã ghim', () => {
    for (const nen of ['darwin', 'win32', 'linux']) {
      for (const a of ['x64', 'arm64']) {
        for (const g of goiBoChay(nen, a)) expect(g.ten).toContain(BAN_LLAMA);
      }
    }
  });

  it('địa chỉ tải trỏ vào release đã ghim, không trỏ "latest"', () => {
    const u = duongBoChay(goiBoChay('darwin', 'arm64')[0]!);
    expect(u).toBe(
      `https://github.com/ggml-org/llama.cpp/releases/download/${BAN_LLAMA}/llama-${BAN_LLAMA}-bin-macos-arm64.tar.gz`,
    );
    expect(u, 'trỏ "latest" là để app trôi theo nightly của người khác').not.toContain('/latest/');
  });
});

describe('sổ model', () => {
  it('RAM lúc chạy LỚN HƠN cỡ file — đây là chỗ hay bị lẫn', () => {
    for (const m of MODEL) {
      expect(m.ramGb, `${m.ma}: ramGb phải > gb`).toBeGreaterThan(m.gb);
    }
  });

  it('chỉ bản xem ảnh mới có mmproj', () => {
    expect(timModel('anh')!.mmproj).toBeTruthy();
    expect(timModel('vua')!.mmproj).toBeUndefined();
    expect(timModel('nho')!.mmproj).toBeUndefined();
  });

  it('tổng dung lượng bản ảnh gồm CẢ mmproj', () => {
    const anh = timModel('anh')!;
    expect(tongGb(anh)).toBeCloseTo(3.34, 2);
    expect(tongGb(anh), 'quên cộng mmproj thì thanh tiến độ sẽ nhảy quá 100%')
      .toBeGreaterThan(anh.gb);
  });

  it('địa chỉ model dựng đúng dạng của HuggingFace', () => {
    expect(duongModel(timModel('nho')!)).toBe(
      'https://huggingface.co/unsloth/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_M.gguf',
    );
    const anh = timModel('anh')!;
    expect(duongModel(anh, anh.mmproj!.file)).toContain('mmproj-Qwen3VL-4B-Instruct-F16.gguf');
  });

  it('mã lạ trả undefined chứ không ném', () => {
    expect(timModel('khong-co')).toBeUndefined();
  });
});

describe('lời khuyên cho máy người dùng', () => {
  it('máy mạnh, có GPU ⇒ mời bản đầy đủ, cho phép cả ba', () => {
    const k = loiKhuyen(MAY_TOT);
    expect(k.nen).toBe('vua');
    expect(k.choPhep).toEqual(['nho', 'vua', 'anh']);
  });

  it('⛔ KHÔNG GPU thì KHÔNG mời bản đầy đủ, dù RAM có dư 32 GB', () => {
    /* Đo thật: không GPU ⇒ nạp đề 33,8 t/s ⇒ bài 2.400 chữ chờ 71 GIÂY.
       RAM dư không cứu được con số đó. */
    const k = loiKhuyen({ ...MAY_TOT, coGpu: false });
    expect(k.nen).toBe('nho');
    expect(k.choPhep).not.toContain('vua');
  });

  it('máy 8 GB ⇒ chỉ bản gọn (app đã ăn 3 GB)', () => {
    const k = loiKhuyen({ ramGb: 8, diaGb: 100, coGpu: true });
    expect(k.nen).toBe('nho');
    expect(k.choPhep).toEqual(['nho']);
  });

  it('16 GB + GPU ⇒ đủ bản đầy đủ VÀ bản ảnh', () => {
    const k = loiKhuyen({ ramGb: 16, diaGb: 100, coGpu: true });
    expect(k.nen).toBe('vua');
    expect(k.choPhep).toContain('anh');
  });

  it('máy 4 GB ⇒ không mời gì cả, và nói rõ bản trên mạng vẫn dùng được', () => {
    const k = loiKhuyen({ ramGb: 4, diaGb: 100, coGpu: true });
    expect(k.nen).toBeNull();
    expect(k.choPhep).toEqual([]);
    expect(k.vi).toMatch(/trên mạng/);
  });

  it('đĩa gần đầy ⇒ chặn trước, chứ không để tải tới 90% rồi mới chết', () => {
    const k = loiKhuyen({ ramGb: 32, diaGb: 2, coGpu: true });
    expect(k.nen).toBeNull();
    expect(k.vi).toMatch(/[Đđ]ĩa/);
  });

  it('mọi lý do đều viết cho NGƯỜI DÙNG đọc, không có từ kỹ thuật thô', () => {
    for (const may of [
      MAY_TOT,
      { ...MAY_TOT, coGpu: false },
      { ramGb: 8, diaGb: 100, coGpu: true },
      { ramGb: 4, diaGb: 100, coGpu: true },
      { ramGb: 32, diaGb: 2, coGpu: true },
      { ramGb: 16, diaGb: 100, coGpu: true },
    ]) {
      const { vi } = loiKhuyen(may);
      expect(vi.length, 'lý do rỗng — người dùng không biết vì sao').toBeGreaterThan(20);
      expect(vi, `lộ từ kỹ thuật: ${vi}`).not.toMatch(/gguf|quantiz|Q4_K_M|llama\.cpp|mmproj|t\/s/i);
    }
  });

  it('model được mời LUÔN nằm trong danh sách cho phép', () => {
    for (const ram of [4, 6, 8, 12, 16, 24, 32, 64]) {
      for (const coGpu of [true, false]) {
        const k = loiKhuyen({ ramGb: ram, diaGb: 100, coGpu });
        if (k.nen) {
          expect(k.choPhep, `ram=${ram} gpu=${coGpu}: mời ${k.nen} mà không cho phép`)
            .toContain(k.nen);
        }
      }
    }
  });

  it('RAM càng nhiều thì càng KHÔNG được mời bản nhỏ hơn', () => {
    const bac = { nho: 1, vua: 2, anh: 3 } as const;
    let truoc = 0;
    for (const ram of [4, 6, 8, 12, 16, 24, 32, 64]) {
      const k = loiKhuyen({ ramGb: ram, diaGb: 100, coGpu: true });
      const nay = k.nen ? bac[k.nen] : 0;
      expect(nay, `ram=${ram} lại tụt xuống bản thấp hơn máy yếu hơn`).toBeGreaterThanOrEqual(truoc);
      truoc = nay;
    }
  });
});

/**
 * ⚠️⚠️ "KHÔNG ĐO ĐƯỢC ĐĨA" KHÁC HẲN "HẾT ĐĨA".
 *
 * Người dùng gửi ảnh 16/09/2026: máy còn 370 GB, màn hình ghi *"Đĩa chỉ còn
 * 0.0 GB. Cần ít nhất 4.3 GB"*, và CẢ BA nút tải đều xám. Không ai từng tải
 * được model, và lỗi trông y như một quyết định có chủ ý.
 *
 * Gốc rễ: lần đầu chạy thì `…/ai-ngoai-tuyen/model` chưa tồn tại, `statfs` ném
 * ENOENT, hàm đo trả 0 — và 0 GB đọc thành "đĩa gần đầy". Hỏng 100% người dùng
 * ở đúng lần mở đầu tiên.
 */
describe('⭐ đĩa không đo được thì ĐỪNG khoá hết', () => {
  it('diaGb = -1 (chưa đo được) ⇒ VẪN mời tải', () => {
    const k = loiKhuyen({ ramGb: 32, diaGb: -1, coGpu: true });
    expect(k.nen, 'không đo được đĩa mà khoá sạch nút là lỗi đã hỏng 100% người dùng')
      .not.toBeNull();
    expect(k.choPhep.length).toBeGreaterThan(0);
  });

  it('đĩa THẬT SỰ gần đầy ⇒ vẫn chặn, và nói con số thật', () => {
    const k = loiKhuyen({ ramGb: 32, diaGb: 0.5, coGpu: true });
    expect(k.nen).toBeNull();
    expect(k.vi).toMatch(/0[.,]5 GB/);
  });

  it('đủ cho bản gọn nhưng không đủ bản lớn ⇒ mời bản gọn, đừng chặn hết', () => {
    const k = loiKhuyen({ ramGb: 32, diaGb: 2.5, coGpu: true });
    expect(k.nen).toBe('nho');
    expect(k.choPhep).toEqual(['nho']);
  });
});
