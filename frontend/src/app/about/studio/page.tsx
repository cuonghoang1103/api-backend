import { STAGES } from '../quy-trinh/data';
import StudioClient from './StudioClient';

/** Server: chỉ đếm số giai đoạn rồi chuyển cho phần client (xem StudioClient). */
export default function StudioPage() {
  return <StudioClient stageCount={STAGES.length} />;
}
