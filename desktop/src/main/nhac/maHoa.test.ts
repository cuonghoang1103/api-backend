/**
 * Kiểm bộ mã hoá MP3 / FLAC.
 *
 * ─── Những phép kiểm ở đây chạy BỘ MÃ HOÁ THẬT ───
 * Giả lập `lamejs` và `libflacjs` thì chỉ kiểm được là ta gọi đúng tên hàm —
 * mà mọi lỗi thật của tệp này lại nằm ở chỗ khác: sai hệ số thang đo, sai
 * kiểu mảng, quên `flush()`, quên `destroy()`. Bài học đã ghi trong CLAUDE.md
 * (08/08/2026): `seed.ts` tự chép lại union rồi tự kiểm với chính nó, qua sạch
 * checklist, vỡ trên production. Một phép kiểm chỉ nói chuyện với bản giả của
 * chính mình thì nó không gác gì cả.
 *
 * Đổi lại, chúng chậm hơn — nên bài kiểm dùng đoạn NGẮN (0,2-1 giây).
 */
import { describe, expect, it } from 'vitest';
import { docWav } from './wav';
import { KBPS_CHO_PHEP, duoiTep, maHoa, mimeCua, moTaDinhDang } from './maHoa';
import type { CaiXuat } from '../../shared/dinhDangXuat';
import { CHON_XUAT, CHON_XUAT_MAC_DINH, timChonXuat } from '../../shared/dinhDangXuat';
import type { AmThanh } from './wav';

const FS = 44_100;

/** Một đoạn nhạc giả: hai kênh khác nhau để bắt lỗi tráo/gộp kênh. */
function doan(giay = 0.3, bien = 0.5): AmThanh {
  const n = Math.round(FS * giay);
  const l = new Float32Array(n);
  const r = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    l[i] = bien * Math.sin((2 * Math.PI * 440 * i) / FS);
    r[i] = bien * Math.sin((2 * Math.PI * 660 * i) / FS);
  }
  return { kenh: [l, r], tanSoMau: FS };
}

describe('tên và mô tả định dạng', () => {
  it('đuôi tệp đi theo định dạng', () => {
    expect(duoiTep({ dinhDang: 'mp3' })).toBe('mp3');
    expect(duoiTep({ dinhDang: 'flac' })).toBe('flac');
    expect(duoiTep({ dinhDang: 'wav' })).toBe('wav');
    expect(duoiTep({ dinhDang: 'wav16' })).toBe('wav');
  });

  it('mô tả nói ra ĐỦ thứ người dùng vừa chọn', () => {
    /* "MP3" trơn là không đủ: 128 và 320 khác nhau một trời một vực, mà tên
       tệp thì không mang con số đó. */
    expect(moTaDinhDang({ dinhDang: 'mp3', kbps: 192 })).toBe('MP3 192 kbps');
    expect(moTaDinhDang({ dinhDang: 'flac', bit: 16 })).toBe('FLAC 16-bit');
    expect(moTaDinhDang({ dinhDang: 'wav' })).toBe('WAV 32-bit float');
  });

  it('kiểu MIME đi theo định dạng', () => {
    expect(mimeCua({ dinhDang: 'mp3' })).toBe('audio/mpeg');
    expect(mimeCua({ dinhDang: 'flac' })).toBe('audio/flac');
    expect(mimeCua({ dinhDang: 'wav16' })).toBe('audio/wav');
  });
});

describe('bảng lựa chọn bày cho người dùng', () => {
  it('⭐ MỌI mục trong bảng đều mã hoá được thật', async () => {
    /* Bảng này sống ở `shared/` và giao diện dựng nút từ nó. Thêm một mục mà
       bộ mã hoá không nhận thì nút vẫn hiện ra, vẫn bấm được, và chỉ chết lúc
       người dùng bấm — trên máy họ, không phải ở đây. Chốt lại ngay tại đây. */
    for (const m of CHON_XUAT) {
      const b = await maHoa(doan(0.2), m.cai);
      expect(b.byteLength, m.ma).toBeGreaterThan(400);
    }
  });

  it('mã mục là DUY NHẤT — trùng mã thì React dựng sai danh sách', () => {
    const ma = CHON_XUAT.map((m) => m.ma);
    expect(new Set(ma).size).toBe(ma.length);
  });

  it('mặc định trỏ vào một mục có thật', () => {
    expect(CHON_XUAT.some((m) => m.ma === CHON_XUAT_MAC_DINH)).toBe(true);
    expect(timChonXuat(CHON_XUAT_MAC_DINH).ma).toBe(CHON_XUAT_MAC_DINH);
  });

  it('mã không có thì rơi về mục đầu chứ không trả undefined', () => {
    expect(timChonXuat('khong-co-that').ma).toBe(CHON_XUAT[0]!.ma);
  });

  it('⭐ chỉ MP3 được đánh dấu mất dữ liệu', () => {
    /* Nhãn này là thứ người dùng dựa vào để quyết định. Đánh dấu FLAC là "mất
       dữ liệu" thì họ tránh đúng cái nên chọn; bỏ dấu ở MP3 thì họ lưu trữ
       lâu dài bằng một bản đã mất. */
      for (const m of CHON_XUAT) {
        expect(m.matDuLieu, m.ma).toBe(m.cai.dinhDang === 'mp3');
      }
  });
});

describe('MP3', () => {
  it('⭐ ra tệp MP3 thật — có đồng bộ khung ở đầu', async () => {
    /* Byte đầu `FF Ex` là mẫu đồng bộ của khung MPEG. Đây là phép kiểm rẻ
       nhất phân biệt "một mảng byte" với "một tệp MP3". */
    const b = Buffer.from(await maHoa(doan(), { dinhDang: 'mp3', kbps: 320 }));
    expect(b.length).toBeGreaterThan(1000);
    expect(b[0]).toBe(0xff);
    expect((b[1]! & 0xe0)).toBe(0xe0);
  });

  it('⭐ tốc độ bit cao ra tệp TO hơn — tức tham số có tới được LAME', async () => {
    /* Không có phép kiểm này thì `kbps` có thể bị bỏ quên trên đường đi và
       mọi bản xuất đều ra 128 kbps, im lặng. Tệp vẫn hợp lệ, vẫn phát được,
       chỉ là người dùng chọn 320 mà nhận 128. */
    const a = Buffer.from(await maHoa(doan(1), { dinhDang: 'mp3', kbps: 128 }));
    const z = Buffer.from(await maHoa(doan(1), { dinhDang: 'mp3', kbps: 320 }));
    expect(z.length).toBeGreaterThan(a.length * 2);
  });

  it('mọi tốc độ bit trong bảng đều mã hoá được', async () => {
    for (const k of KBPS_CHO_PHEP) {
      const b = Buffer.from(await maHoa(doan(0.2), { dinhDang: 'mp3', kbps: k }));
      expect(b.length, `kbps ${k}`).toBeGreaterThan(500);
    }
  });

  it('mono cũng mã hoá được', async () => {
    const m = doan(0.2);
    const b = Buffer.from(await maHoa({ kenh: [m.kenh[0]!], tanSoMau: FS },
                                      { dinhDang: 'mp3', kbps: 192 }));
    expect(b[0]).toBe(0xff);
  });

  it('tốc độ bit ngoài bảng thì NÉM, không lặng lẽ đổi', async () => {
    await expect(maHoa(doan(0.1), { dinhDang: 'mp3', kbps: 999 })).rejects.toThrow(/Tốc độ bit/);
  });

  it('⭐ tần số mẫu LAME không nhận thì NÉM', async () => {
    /* LAME nhận một bảng tần số cố định. Đưa tần số lạ vào thì nó không báo
       lỗi — nó ghi ra tệp mang tần số khác, và bài phát ra sai tốc độ. Sai
       kiểu đó không ai phát hiện lúc build, chỉ phát hiện khi bài nghe như
       chạy nhanh. */
    const m = doan(0.1);
    await expect(maHoa({ kenh: m.kenh, tanSoMau: 96_000 }, { dinhDang: 'mp3' }))
      .rejects.toThrow(/96000|không mã hoá được/);
  });

  it('nhiều hơn 2 kênh thì NÉM', async () => {
    const m = doan(0.1);
    await expect(maHoa({ kenh: [m.kenh[0]!, m.kenh[1]!, m.kenh[0]!], tanSoMau: FS },
                       { dinhDang: 'mp3' })).rejects.toThrow(/1 hoặc 2 kênh/);
  });
});

describe('FLAC', () => {
  it('⭐ ra tệp FLAC thật — có chữ ký `fLaC`', async () => {
    const b = Buffer.from(await maHoa(doan(), { dinhDang: 'flac', bit: 16 }));
    expect(b.subarray(0, 4).toString('latin1')).toBe('fLaC');
  });

  it('⭐ nén ĐƯỢC — nhỏ hơn WAV cùng độ sâu bit', async () => {
    /* Nếu con số này bằng hoặc lớn hơn WAV thì hoặc mức nén không tới được
       libFLAC, hoặc ta đang ghi ra PCM thô đội lốt FLAC. */
    const am = doan(1);
    const f = (await maHoa(am, { dinhDang: 'flac', bit: 16 })).byteLength;
    const w = (await maHoa(am, { dinhDang: 'wav16' })).byteLength;
    expect(f).toBeLessThan(w);
  });

  it('⭐ 24-bit ra tệp TO hơn 16-bit — tức tham số bit có tác dụng', async () => {
    const am = doan(1);
    const a = (await maHoa(am, { dinhDang: 'flac', bit: 16 })).byteLength;
    const z = (await maHoa(am, { dinhDang: 'flac', bit: 24 })).byteLength;
    expect(z).toBeGreaterThan(a);
  });

  it('mono cũng mã hoá được', async () => {
    const m = doan(0.2);
    const b = Buffer.from(await maHoa({ kenh: [m.kenh[0]!], tanSoMau: FS },
                                      { dinhDang: 'flac', bit: 16 }));
    expect(b.subarray(0, 4).toString('latin1')).toBe('fLaC');
  });

  it('⭐ đoạn dài hơn MỘT KHÚC vẫn ra đúng — chốt đường mã hoá theo khúc', async () => {
    /* Khúc là 65536 mẫu. Bài kiểm nào cũng ngắn hơn thế thì nhánh "nhiều
       khúc" — nhánh mà mọi bài nhạc thật đi qua — chưa từng chạy một lần.
       1,6 giây ở 44,1 kHz là ~70k mẫu, tức vừa đủ sang khúc thứ hai. */
    const b = Buffer.from(await maHoa(doan(1.6), { dinhDang: 'flac', bit: 16 }));
    expect(b.subarray(0, 4).toString('latin1')).toBe('fLaC');
    /* Số mẫu nằm trong khối STREAMINFO, 36 bit bắt đầu ở bit 4 của byte 21.
       Đọc nó ra là cách duy nhất chắc chắn không có khúc nào bị rơi. */
    const soMau = ((b[21]! & 0x0f) * 2 ** 32) + b.readUInt32BE(22);
    expect(soMau).toBe(Math.round(FS * 1.6));
  });
});

describe('WAV — vẫn phải đi qua cùng một cửa', () => {
  it('`wav` là 32-bit float, đọc lại ra đúng mẫu', async () => {
    const am = doan(0.2, 0.25);
    const lai = docWav(await maHoa(am, { dinhDang: 'wav' }));
    expect(lai.tanSoMau).toBe(FS);
    expect(lai.kenh).toHaveLength(2);
    expect(lai.kenh[0]![100]).toBeCloseTo(am.kenh[0]![100]!, 6);
  });

  it('`wav16` đọc lại vẫn khớp trong một nấc lượng tử', async () => {
    const am = doan(0.2, 0.25);
    const lai = docWav(await maHoa(am, { dinhDang: 'wav16' }));
    let lech = 0;
    for (let i = 0; i < lai.kenh[0]!.length; i++) {
      lech = Math.max(lech, Math.abs(lai.kenh[0]![i]! - am.kenh[0]![i]!));
    }
    // 1 nấc = 1/32768; nhiễu TPDF trải ra tối đa 2 nấc quanh giá trị đúng.
    expect(lech).toBeLessThan(2.05 / 32768);
  });
});

describe('cửa chung', () => {
  it('không có kênh nào thì NÉM', async () => {
    await expect(maHoa({ kenh: [], tanSoMau: FS }, { dinhDang: 'wav' }))
      .rejects.toThrow(/không có kênh/);
  });

  it('định dạng lạ thì NÉM chứ không lặng lẽ ra WAV', async () => {
    const xau = { dinhDang: 'ogg' } as unknown as CaiXuat;
    await expect(maHoa(doan(0.1), xau)).rejects.toThrow(/Định dạng lạ/);
  });
});
