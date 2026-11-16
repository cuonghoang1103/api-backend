/** Khung thẻ giữa màn cho /dang-nhap-app và /dang-nhap-app/xong (mở trong cửa sổ đăng nhập của app iOS). */
export function KhungDangNhapApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-darkborder bg-white/[0.02] p-8 text-center flex flex-col items-center gap-4">
        {children}
      </div>
    </div>
  );
}
