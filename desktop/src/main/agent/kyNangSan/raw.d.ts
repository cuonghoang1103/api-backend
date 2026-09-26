/** Vite nạp file dạng chuỗi qua hậu tố `?raw` (xem `index.ts`). */
declare module '*.md?raw' {
  const noiDung: string;
  export default noiDung;
}
