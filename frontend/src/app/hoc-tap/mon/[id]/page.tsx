import TrangMon from '@/components/hoc-tap/TrangMon';

export default function Page({ params }: { params: { id: string } }) {
  return <TrangMon id={Number(params.id)} />;
}
