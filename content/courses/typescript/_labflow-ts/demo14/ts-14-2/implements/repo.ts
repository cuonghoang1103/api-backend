interface Repo {
  find(id: number): string | undefined;
  save(row: string): void;
}
// The class says it implements Repo but is missing save.
class MemoryRepo implements Repo {
  find(id: number): string | undefined { return undefined; }
}
export { MemoryRepo };
