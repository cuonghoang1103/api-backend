/**
 * Builder + validator cho nội dung 1 chương sách "Kỹ năng toàn diện".
 *
 * File này viết MỘT LẦN — mọi agent viết nội dung chỉ IMPORT, không bao giờ
 * sửa (tránh xung đột khi nhiều agent chạy song song, mỗi agent ghi ra 1 file
 * riêng trong scripts/skill-books-staging/<vol>.mjs).
 *
 * Validate ngay tại thời điểm gọi guide() (fail-fast) — bắt lỗi thiếu/sai
 * field tại lúc viết, không phải sau khi generator chạy xong cả quyển.
 *
 * KHÔNG dùng template cố định để lấp nội dung: mọi field ở đây phải là văn
 * bản THẬT do agent tự viết riêng cho chương đó — generate-skill-books.mjs
 * chỉ còn lo trình bày (HTML/CSS/sơ đồ), không còn tự soạn câu văn nào.
 */

export function guide(spec) {
  const need = (cond, msg) => {
    if (!cond) throw new Error(`guide(): ${msg}\n${JSON.stringify(spec).slice(0, 200)}`);
  };

  need(typeof spec.thesis === 'string' && spec.thesis.length > 40, 'thiếu thesis (>40 ký tự)');

  need(
    spec.why &&
      typeof spec.why.work === 'string' &&
      typeof spec.why.interview === 'string' &&
      typeof spec.why.study === 'string' &&
      typeof spec.why.life === 'string' &&
      spec.why.work.length > 20 &&
      spec.why.interview.length > 20 &&
      spec.why.study.length > 20 &&
      spec.why.life.length > 20,
    'why cần đủ 4 mục {work, interview, study, life}, mỗi mục >20 ký tự, riêng theo chương',
  );

  need(
    Array.isArray(spec.framework) &&
      spec.framework.length >= 3 &&
      spec.framework.length <= 6 &&
      spec.framework.every((s) => s && typeof s.name === 'string' && typeof s.detail === 'string' && s.name.length > 0 && s.detail.length > 10),
    'framework cần mảng {name, detail} × 3-6 bước',
  );

  need(typeof spec.scenario === 'string' && spec.scenario.length > 60, 'thiếu scenario (>60 ký tự, có bối cảnh-hành động-kết quả)');

  need(
    Array.isArray(spec.comparison) &&
      spec.comparison.length >= 2 &&
      spec.comparison.length <= 4 &&
      spec.comparison.every((c) => c && typeof c.weak === 'string' && typeof c.mature === 'string' && c.weak.length > 10 && c.mature.length > 10),
    'comparison cần mảng {weak, mature} × 2-4 cặp, riêng theo chương (KHÔNG dùng lại cặp generic)',
  );

  need(
    Array.isArray(spec.mistakes) && spec.mistakes.length === 3 && spec.mistakes.every((m) => typeof m === 'string' && m.length > 20),
    'mistakes cần đúng 3 chuỗi, mỗi chuỗi >20 ký tự, riêng theo chương',
  );

  need(
    Array.isArray(spec.worksheet) && spec.worksheet.length === 5 && spec.worksheet.every((q) => typeof q === 'string' && q.length > 10),
    'worksheet cần đúng 5 câu hỏi riêng theo chương (đây là lỗi lặp nghiêm trọng nhất bị phát hiện ở 44 chương cũ — 5 câu generic giống 100%)',
  );

  need(
    Array.isArray(spec.exercises) &&
      spec.exercises.length === 8 &&
      spec.exercises.every(
        (e) => e && typeof e.label === 'string' && typeof e.text === 'string' && ['e', 'm', 'h'].includes(e.level) && e.text.length > 30,
      ),
    'exercises cần đúng 8 mục {label, text, level: e|m|h}, text >30 ký tự, riêng theo kỹ năng (không phải khung câu chèn tên chương)',
  );

  need(
    Array.isArray(spec.checkpoints) &&
      spec.checkpoints.length === 3 &&
      spec.checkpoints.every((c) => c && typeof c.q === 'string' && typeof c.a === 'string' && c.q.length > 10 && c.a.length > 20),
    'checkpoints cần đúng 3 mục {q, a}, riêng theo chương',
  );

  need(typeof spec.plan7 === 'string' && spec.plan7.length > 40, 'thiếu plan7 (kế hoạch 7 ngày, riêng theo chương, >40 ký tự)');

  need(
    typeof spec.evidence === 'string' && spec.evidence.length > 30,
    'thiếu evidence (mục #11 bắt buộc: cách biến kỹ năng thành bằng chứng CV/phỏng vấn/portfolio — hoàn toàn chưa tồn tại trong 44 chương cũ)',
  );

  need(
    Array.isArray(spec.references) &&
      spec.references.length >= 1 &&
      spec.references.length <= 2 &&
      spec.references.every(
        (r) => r && typeof r.label === 'string' && typeof r.url === 'string' && /^https:\/\//.test(r.url) && ['article', 'video'].includes(r.type),
      ),
    'references cần 1-2 mục {label, url (https://...), type: article|video} — url sẽ được xác minh sống trước khi vào bản cuối, KHÔNG được bịa',
  );

  if (spec.diagram) {
    need(['flow', 'cycle'].includes(spec.diagram), 'diagram nếu có phải là flow|cycle (dùng cho sơ đồ quy trình — sơ đồ so sánh yếu/trưởng thành LUÔN hiện riêng, không cần chọn)');
  }

  return { diagram: 'flow', ...spec };
}
