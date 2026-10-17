'use client';

/** Database designer — xem trước ERD của một đoạn SQL (hộp "Tạo mới": mẫu SQL). Nạp lười cùng bộ đọc SQL. */

import { useMemo } from 'react';
import { analyzeSql, type Dialect } from '@/lib/sqlDesign';
import PanZoom from '../viewer/PanZoom';
import ErdCanvas, { type ErdVariant } from './ErdCanvas';

export default function SqlPreview({ sql, dialect, variant, label }: { sql: string; dialect: Dialect; variant: ErdVariant; label: string }) {
  const model = useMemo(() => analyzeSql(sql, { dialect }).parse.model, [sql, dialect]);
  return (
    <div className="h-[340px]">
      <PanZoom fitKey={sql.length} label={label} background={variant === 'dark' ? '#141416' : '#fbfaf7'}>
        <ErdCanvas model={model} variant={variant} direction="LR" selected={null} editable={false} getScale={() => 1} onSelect={() => undefined} />
      </PanZoom>
    </div>
  );
}
