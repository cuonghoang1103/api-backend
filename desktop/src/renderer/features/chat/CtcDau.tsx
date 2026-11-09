/**
 * Dấu CuongMini — ngôi sao bốn cánh màu nhấn, đứng cạnh câu trả lời và lời
 * chào. `dangChay` ⇒ xoay/nhịp nhẹ trong lúc chữ đang chảy về.
 */
export function CtcDau({ co = 22, dangChay = false }: { co?: number; dangChay?: boolean }) {
  return (
    <svg
      className="ctc-dau"
      data-chay={dangChay}
      width={co}
      height={co}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M12 1.5c.6 4.9 2.2 7.9 4.6 9.2 1.6.8 3.6 1.2 5.9 1.3-2.3.1-4.3.5-5.9 1.3-2.4 1.3-4 4.3-4.6 9.2-.6-4.9-2.2-7.9-4.6-9.2C5.8 12.5 3.8 12.1 1.5 12c2.3-.1 4.3-.5 5.9-1.3C9.8 9.4 11.4 6.4 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
