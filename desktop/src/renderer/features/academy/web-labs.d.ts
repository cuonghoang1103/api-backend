/**
 * Kiểu cho bộ gắn "phòng lab trực quan" của web (frontend/src/components/labs) — trình đọc bài Học viện dùng lại
 * nguyên mã web, tsconfig của app không đọc cây frontend nên khai kiểu tối thiểu ở đây (cùng cách web-exam.d.ts).
 */
declare module '@/components/labs/selector' {
  export const LAB_SELECTOR: string;
}
declare module '@/components/labs/mount' {
  export function mountLabs(root: HTMLElement, fallbackLang: 'en' | 'vi'): () => void;
}
