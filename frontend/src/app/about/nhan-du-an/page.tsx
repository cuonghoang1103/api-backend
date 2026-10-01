import { ENGAGEMENTS, STAGES } from '../quy-trinh/data';
import IntakeClient from './IntakeClient';

/** Server: lấy số giai đoạn + mô hình hợp tác từ data.ts rồi chuyển cho phần client. */
export default function IntakePage() {
  return <IntakeClient stageCount={STAGES.length} engagements={ENGAGEMENTS} />;
}
