export default function Loading() {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-neon-violet border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm">Đang tải khóa học…</p>
      </div>
    </div>
  );
}
