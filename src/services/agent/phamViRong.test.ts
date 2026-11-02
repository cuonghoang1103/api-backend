import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { gopDuAnPhamViRong } from './phamViRong.js';

describe('gopDuAnPhamViRong', () => {
  it('không có dự án nào ⇒ rỗng', () => {
    assert.deepEqual(gopDuAnPhamViRong([], []), []);
  });

  it('bỏ trùng giữa hai nguồn và xếp theo mã dự án', () => {
    const ra = gopDuAnPhamViRong(
      [{ projectId: 24, key: 'NT' }, { projectId: 3, key: 'FP' }],
      [{ projectId: 24, key: 'NT' }, { projectId: 9, key: 'TP1' }],
    );
    assert.deepEqual(ra.map((d) => d.projectId), [3, 9, 24]);
  });
});
