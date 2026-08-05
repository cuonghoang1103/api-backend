/**
 * Dựng lệnh cài đặt cho từng component.
 *
 * Hai đường cài khác hẳn nhau, đừng trộn:
 * - Đa số loại cài bằng CLI `npx claude-code-templates@latest --<cờ> <ref>`
 *   — chạy trong TERMINAL, ở thư mục gốc dự án.
 * - Plugin thì cài bằng lệnh gạch chéo NGAY TRONG Claude Code
 *   (`/plugin marketplace add …` rồi `/plugin install …`), không phải shell.
 *
 * `kind` trong `InstallRecipe` là để giao diện gắn đúng nhãn ("Chạy trong
 * terminal" / "Gõ trong Claude Code") — dán nhầm chỗ là lệnh không chạy và
 * người dùng không hiểu tại sao.
 */

import { getTypeMeta, toRef } from './catalog';
import type { ComponentRecord, ComponentType, StackItem } from './types';

export const CLI = 'npx claude-code-templates@latest';

export interface InstallRecipe {
  kind: 'shell' | 'claude';
  /** Các dòng lệnh, theo thứ tự chạy. */
  lines: string[];
  /** Nhãn ngắn hiện trên hộp lệnh. */
  hint: string;
}

/** Lệnh cài cho MỘT component. */
export function installRecipe(item: ComponentRecord): InstallRecipe {
  const meta = getTypeMeta(item.type);

  if (item.type === 'template') {
    return {
      kind: 'shell',
      lines: [item.installCommand || `${CLI} --template=${item.path} --yes`],
      hint: 'Chạy trong terminal, tại thư mục gốc dự án',
    };
  }

  if (item.type === 'plugin') {
    const repoPath = item.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
    return {
      kind: 'claude',
      lines: [`/plugin marketplace add ${repoPath || item.path}`, `/plugin install ${item.path}`],
      hint: 'Gõ trong phiên Claude Code (không phải terminal)',
    };
  }

  return {
    kind: 'shell',
    lines: [`${CLI} ${meta.flag} ${toRef(item.path)}`],
    hint: 'Chạy trong terminal, tại thư mục gốc dự án',
  };
}

/**
 * Gộp cả giỏ "Stack Builder" thành ít lệnh nhất có thể.
 *
 * CLI nhận nhiều giá trị cho cùng một cờ, ngăn bằng dấu phẩy
 * (`--skill a/b,c/d`), nên mỗi loại chỉ tốn đúng MỘT lệnh thay vì N lệnh.
 * Plugin không đi qua CLI nên tách riêng xuống cuối.
 */
export function stackRecipe(items: StackItem[]): { shell: string[]; claude: string[] } {
  const byType = new Map<ComponentType, string[]>();
  for (const it of items) {
    const list = byType.get(it.type);
    if (list) list.push(it.ref);
    else byType.set(it.type, [it.ref]);
  }

  const shell: string[] = [];
  const claude: string[] = [];

  for (const [type, refs] of byType) {
    if (type === 'plugin') {
      for (const ref of refs) claude.push(`/plugin install ${ref}`);
      continue;
    }
    if (type === 'template') {
      for (const ref of refs) shell.push(`${CLI} --template=${ref} --yes`);
      continue;
    }
    const meta = getTypeMeta(type);
    shell.push(`${CLI} ${meta.flag} ${refs.join(',')} --yes`);
  }

  return { shell, claude };
}
