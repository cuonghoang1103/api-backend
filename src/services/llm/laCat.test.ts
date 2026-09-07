/**
 * Nhận diện "model bị CẮT vì chạm trần" — thứ trước 07/09/2026 không chỗ nào
 * đọc, nên một câu trả lời cụt giữa câu trông y hệt câu trả lời hoàn chỉnh.
 *
 * ⚠️ Phép kiểm này canh LUẬT, không canh cổng thật: máy này không có khoá LLM
 * nên không gọi thật được. Chỗ duy nhất chứng minh được tên trường đúng là
 * dòng WARN `[llm] BI CAT ...` trên production. Nếu tên trường sai thì phép
 * nhận diện chỉ im lặng không kêu — không có hồi quy nào.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/** Bản sao luật trong `index.ts` — giữ đồng bộ bằng chính phép kiểm này. */
function laCat(ly: string | undefined | null): boolean {
  return ly === 'length' || ly === 'max_tokens';
}

describe('laCat', () => {
  it('chuẩn OpenAI: finish_reason = "length"', () => {
    assert.equal(laCat('length'), true);
  });

  it('chuẩn Anthropic: stop_reason = "max_tokens"', () => {
    assert.equal(laCat('max_tokens'), true);
  });

  it('nhận CHÉO hai chuẩn — cổng ở giữa dịch qua lại và đã có tiền sử lệch chuẩn', () => {
    // Tuyến OpenAI trả 'max_tokens', hoặc tuyến Anthropic trả 'length'.
    assert.equal(laCat('max_tokens'), true);
    assert.equal(laCat('length'), true);
  });

  it('dừng BÌNH THƯỜNG thì KHÔNG báo cắt', () => {
    for (const ly of ['stop', 'end_turn', 'stop_sequence', 'tool_calls', 'tool_use']) {
      assert.equal(laCat(ly), false, `"${ly}" không phải là bị cắt`);
    }
  });

  it('thiếu trường thì coi như KHÔNG cắt — thà bỏ sót còn hơn báo nhầm', () => {
    assert.equal(laCat(undefined), false);
    assert.equal(laCat(null), false);
    assert.equal(laCat(''), false);
  });
});
