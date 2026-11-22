/** Trang làm bài của Phòng thi mô phỏng cho app — nạp chậm từ `TUYEN_WEB` (xem MoPhongWebPage.tsx). */
import { useParams } from '../../shims/next-navigation';
import ThiFeClient from '@/app/exam/mo-phong/fe/[attemptId]/ThiFeClient';
import ThiPeClient from '@/app/exam/mo-phong/pe/[attemptId]/ThiPeClient';

export function ThiFeTuyen() {
  const { attemptId } = useParams<{ attemptId: string }>();
  return <ThiFeClient key={attemptId} attemptId={Number(attemptId)} />;
}

export function ThiPeTuyen() {
  const { attemptId } = useParams<{ attemptId: string }>();
  return <ThiPeClient key={attemptId} attemptId={Number(attemptId)} />;
}
