export default function RootLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#03020c' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{
            borderColor: '#8b5cf6',
            borderTopColor: 'transparent',
          }}
        />
        <p className="text-[#6b7280] text-sm">Đang tải…</p>
      </div>
    </div>
  );
}
