// @java: L3SimplifyPath.java
// LC 71 · Simplify Path — a stack of directory names; ".." pops, "." and "" are ignored.

// #region giai
function simplifyPath(path: string): string {
  const st: string[] = [];
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;   // "//" and "/./" change nothing
    if (part === '..') st.pop();                 // pop on empty is a no-op: you cannot go above "/"
    else st.push(part);                          // "..." is a NORMAL name
  }
  return '/' + st.join('/');
}
// #endregion

for (const p of ['/home/', '/home//foo/', '/a/./b/../../c/', '/../', '/.../a/../b', '/uploads/../../etc/passwd']) {
  console.log(`${p} -> ${simplifyPath(p)}`);
}
