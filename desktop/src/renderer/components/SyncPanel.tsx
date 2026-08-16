/**
 * Bảng chi tiết hàng đợi đồng bộ.
 *
 * Phase 3 dựng máy móc chống mất dữ liệu, nhưng máy móc đó vô dụng nếu người
 * dùng không NHÌN THẤY được việc nào đang kẹt. Một thay đổi ở trạng thái
 * `rejected` (máy chủ từ chối vĩnh viễn) sẽ nằm im mãi mãi — không ai thử lại
 * nó, và người dùng không biết nó tồn tại — trừ khi có màn hình này.
 *
 * Nguyên tắc hiển thị: nói rõ việc nào CẦN NGƯỜI DÙNG RA TAY, tách khỏi việc
 * app tự lo được. Gộp chung thành "3 lỗi" là đẩy cho người dùng một con số họ
 * không làm gì được.
 */
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Check, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { db, type SyncRecord } from '../offline/db';
import { retryFailed } from '../offline/sync-queue';
import { useSession } from '../auth/session';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Đang chờ gửi',
  syncing: 'Đang gửi',
  synced: 'Đã đồng bộ',
  failed: 'Gửi lỗi — sẽ thử lại',
  rejected: 'Máy chủ từ chối — cần bạn xử lý',
  conflict: 'Xung đột — cần bạn chọn bản giữ lại',
};

const ENTITY_LABEL: Record<string, string> = {
  'cv-profile': 'Hồ sơ CV',
  'cv-item': 'Mục CV',
  'cv-skill': 'Kỹ năng',
  'cv-certification': 'Chứng chỉ',
  'cv-language': 'Ngoại ngữ',
};

export function SyncPanel() {
  const { userId } = useSession();
  const [records, setRecords] = useState<SyncRecord[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (userId === null) {
      setRecords([]);
      return;
    }
    const all = await db.queue.where('userId').equals(userId).toArray();
    // Việc cần ra tay lên trước, rồi tới việc đang chờ, cuối cùng là đã xong.
    const weight: Record<string, number> = {
      conflict: 0,
      rejected: 1,
      failed: 2,
      syncing: 3,
      pending: 4,
      synced: 5,
    };
    all.sort((a, b) => (weight[a.status] ?? 9) - (weight[b.status] ?? 9));
    setRecords(all);
  }, [userId]);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 5000);
    return () => clearInterval(timer);
  }, [refresh]);

  const onRetry = async () => {
    if (userId === null) return;
    setBusy(true);
    try {
      await retryFailed(userId);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  /**
   * Bỏ một việc khỏi hàng đợi. Đây là hành động MẤT DỮ LIỆU — thay đổi đó sẽ
   * không bao giờ tới máy chủ. Chỉ dùng cho việc `rejected`/`conflict` mà người
   * dùng đã quyết là bỏ.
   */
  const onDiscard = async (record: SyncRecord) => {
    if (record.id === undefined) return;
    const label = ENTITY_LABEL[record.entityType] ?? record.entityType;
    if (!window.confirm(`Bỏ thay đổi chưa gửi của "${label}"? Không khôi phục được.`)) {
      return;
    }
    await db.queue.delete(record.id);
    await refresh();
  };

  const actionable = records.filter(
    (r) => r.status === 'rejected' || r.status === 'conflict',
  );
  const failed = records.filter((r) => r.status === 'failed');
  const waiting = records.filter((r) => r.status === 'pending' || r.status === 'syncing');

  if (records.length === 0) {
    return (
      <section className="ct-section">
        <h2>Hàng đợi đồng bộ</h2>
        <p className="ct-field-help" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={14} aria-hidden />
          Không có thay đổi nào đang chờ gửi.
        </p>
      </section>
    );
  }

  return (
    <section className="ct-section">
      <h2>Hàng đợi đồng bộ</h2>

      {actionable.length > 0 && (
        <div className="ct-notice" data-tone="err">
          <AlertTriangle size={15} aria-hidden />
          <span>
            <strong>{actionable.length}</strong> thay đổi cần bạn xử lý — app không
            tự gửi lại được.
          </span>
        </div>
      )}

      <dl className="ct-rows">
        <div className="ct-row">
          <dt>Đang chờ gửi</dt>
          <dd>{waiting.length}</dd>
        </div>
        <div className="ct-row">
          <dt>Gửi lỗi (tự thử lại)</dt>
          <dd>{failed.length}</dd>
        </div>
        <div className="ct-row">
          <dt>Cần bạn xử lý</dt>
          <dd>{actionable.length}</dd>
        </div>
      </dl>

      <ul className="ct-queue-list">
        {records
          .filter((r) => r.status !== 'synced')
          .map((record) => (
            <li key={record.id} className="ct-queue-item" data-status={record.status}>
              <div className="ct-queue-main">
                <div className="ct-queue-title">
                  {ENTITY_LABEL[record.entityType] ?? record.entityType}
                  <span className="ct-queue-op">{record.operationType}</span>
                </div>
                <div className="ct-queue-status">
                  {record.status === 'pending' && <Clock size={12} aria-hidden />}
                  {STATUS_LABEL[record.status] ?? record.status}
                  {record.retryCount > 0 && ` · đã thử ${record.retryCount} lần`}
                </div>
                {record.lastError && (
                  <div className="ct-queue-error">{record.lastError}</div>
                )}
              </div>
              {(record.status === 'rejected' || record.status === 'conflict') && (
                <button
                  type="button"
                  className="ct-queue-discard"
                  onClick={() => void onDiscard(record)}
                  aria-label="Bỏ thay đổi này"
                  title="Bỏ thay đổi này"
                >
                  <Trash2 size={13} aria-hidden />
                </button>
              )}
            </li>
          ))}
      </ul>

      {failed.length > 0 && (
        <div className="ct-actions">
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            onClick={() => void onRetry()}
            disabled={busy}
          >
            <RefreshCw size={14} aria-hidden />
            Thử lại {failed.length} việc lỗi
          </button>
        </div>
      )}
    </section>
  );
}
