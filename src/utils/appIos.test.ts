import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boLoiMoiMua } from './appIos.js';

test('bỏ lời mời mua, giữ phần nói tính năng thuộc Pro', () => {
  assert.equal(
    boLoiMoiMua('Trợ lý AI dành cho tài khoản Pro. Nâng cấp tại /pro để dùng tóm tắt nội dung.'),
    'Trợ lý AI dành cho tài khoản Pro.',
  );
  assert.equal(
    boLoiMoiMua('Cấp key dùng OpenCode là quyền lợi của tài khoản Pro. Nâng cấp tại /pro.'),
    'Cấp key dùng OpenCode là quyền lợi của tài khoản Pro.',
  );
  assert.equal(
    boLoiMoiMua('Chế độ Lập trình là tính năng của tài khoản Pro. Nâng cấp để agent đọc được dự án trên máy bạn.'),
    'Chế độ Lập trình là tính năng của tài khoản Pro.',
  );
  assert.equal(
    boLoiMoiMua('Tính năng AI của CV Builder dành cho tài khoản Pro. Nâng cấp tại /pro — các tính năng miễn phí (chấm rules-engine, nhập CV) vẫn dùng đầy đủ.'),
    'Tính năng AI của CV Builder dành cho tài khoản Pro. — các tính năng miễn phí (chấm rules-engine, nhập CV) vẫn dùng đầy đủ.',
  );
  assert.equal(
    boLoiMoiMua('Gói Pro của bạn đã hết hạn ngày 01/09/2026. Vui lòng gia hạn hoặc nhắn tin cho admin để được cấp lại.'),
    'Gói Pro của bạn đã hết hạn ngày 01/09/2026.',
  );
  assert.equal(
    boLoiMoiMua('Khoa hoc nay hien tai chua mo miễn phí. Vui long mua hoac nhap ma kich hoat.'),
    'Khoa hoc nay hien tai chua mo miễn phí.',
  );
  assert.equal(boLoiMoiMua('Không tìm thấy bài viết.'), 'Không tìm thấy bài viết.');
});
