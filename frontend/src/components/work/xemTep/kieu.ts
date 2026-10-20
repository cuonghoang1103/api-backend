/** Hình dạng `GET …/preview` (khớp `XemTruocOffice` ở src/services/work/xemTep.ts). */
export type XemTruocOffice =
  | { kind: 'docx'; html: string; imagesDropped: boolean }
  | { kind: 'xlsx'; sheets: Array<{ name: string; rows: string[][]; cols: string[]; totalRows: number; totalCols: number; truncated: boolean }>; moreSheets: number };
