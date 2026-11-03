// A parameter property (readonly value) is the short way to a constructor — but it EMITS code,
// so it is refused under erasableSyntaxOnly (the course config, so Node can strip types — 0.4).
class Box<T> {
  constructor(readonly value: T) {}
}
export const b = new Box(10);
