function w(n) {
  return n == null;
}
function tt(n) {
  return n !== null && typeof n == "object";
}
function Ye(n) {
  return n !== null && typeof n == "object";
}
function Gn(n, e) {
  if (n.length !== e.length) return false;
  for (let t = 0; t < n.length; t++) if (n[t] !== e[t]) return false;
  return true;
}
function G(n, e) {
  return Array.from(/* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e)])).reduce((s, i) => {
    const r = n[i], o = e[i];
    return Ye(r) && Ye(o) ? Object.assign(Object.assign({}, s), { [i]: G(r, o) }) : Object.assign(Object.assign({}, s), { [i]: i in e ? o : r });
  }, {});
}
function Yn(n) {
  return tt(n) ? "target" in n : false;
}
const Xn = { alreadydisposed: () => "View has been already disposed", invalidparams: (n) => `Invalid parameters for '${n.name}'`, nomatchingcontroller: (n) => `No matching controller for '${n.key}'`, nomatchingview: (n) => `No matching view for '${JSON.stringify(n.params)}'`, notbindable: () => "Value is not bindable", notcompatible: (n) => `Not compatible with  plugin '${n.id}'`, propertynotfound: (n) => `Property '${n.name}' not found`, shouldneverhappen: () => "This error should never happen" };
class y {
  static alreadyDisposed() {
    return new y({ type: "alreadydisposed" });
  }
  static notBindable() {
    return new y({ type: "notbindable" });
  }
  static notCompatible(e, t) {
    return new y({ type: "notcompatible", context: { id: `${e}.${t}` } });
  }
  static propertyNotFound(e) {
    return new y({ type: "propertynotfound", context: { name: e } });
  }
  static shouldNeverHappen() {
    return new y({ type: "shouldneverhappen" });
  }
  constructor(e) {
    var t;
    this.message = (t = Xn[e.type](e.context)) !== null && t !== void 0 ? t : "Unexpected error", this.name = this.constructor.name, this.stack = new Error(this.message).stack, this.type = e.type;
  }
  toString() {
    return this.message;
  }
}
class Ee {
  constructor(e, t) {
    this.obj_ = e, this.key = t;
  }
  static isBindable(e) {
    return !(e === null || typeof e != "object" && typeof e != "function");
  }
  read() {
    return this.obj_[this.key];
  }
  write(e) {
    this.obj_[this.key] = e;
  }
  writeProperty(e, t) {
    const s = this.read();
    if (!Ee.isBindable(s)) throw y.notBindable();
    if (!(e in s)) throw y.propertyNotFound(e);
    s[e] = t;
  }
}
class k {
  constructor() {
    this.observers_ = {};
  }
  on(e, t) {
    let s = this.observers_[e];
    return s || (s = this.observers_[e] = []), s.push({ handler: t }), this;
  }
  off(e, t) {
    const s = this.observers_[e];
    return s && (this.observers_[e] = s.filter((i) => i.handler !== t)), this;
  }
  emit(e, t) {
    const s = this.observers_[e];
    s && s.forEach((i) => {
      i.handler(t);
    });
  }
}
class Wn {
  constructor(e, t) {
    var s;
    this.constraint_ = t == null ? void 0 : t.constraint, this.equals_ = (s = t == null ? void 0 : t.equals) !== null && s !== void 0 ? s : ((i, r) => i === r), this.emitter = new k(), this.rawValue_ = e;
  }
  get constraint() {
    return this.constraint_;
  }
  get rawValue() {
    return this.rawValue_;
  }
  set rawValue(e) {
    this.setRawValue(e, { forceEmit: false, last: true });
  }
  setRawValue(e, t) {
    const s = t ?? { forceEmit: false, last: true }, i = this.constraint_ ? this.constraint_.constrain(e) : e, r = this.rawValue_;
    this.equals_(r, i) && !s.forceEmit || (this.emitter.emit("beforechange", { sender: this }), this.rawValue_ = i, this.emitter.emit("change", { options: s, previousRawValue: r, rawValue: i, sender: this }));
  }
}
class Jn {
  constructor(e) {
    this.emitter = new k(), this.value_ = e;
  }
  get rawValue() {
    return this.value_;
  }
  set rawValue(e) {
    this.setRawValue(e, { forceEmit: false, last: true });
  }
  setRawValue(e, t) {
    const s = t ?? { forceEmit: false, last: true }, i = this.value_;
    i === e && !s.forceEmit || (this.emitter.emit("beforechange", { sender: this }), this.value_ = e, this.emitter.emit("change", { options: s, previousRawValue: i, rawValue: this.value_, sender: this }));
  }
}
class Zn {
  constructor(e) {
    this.emitter = new k(), this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.value_ = e, this.value_.emitter.on("beforechange", this.onValueBeforeChange_), this.value_.emitter.on("change", this.onValueChange_);
  }
  get rawValue() {
    return this.value_.rawValue;
  }
  onValueBeforeChange_(e) {
    this.emitter.emit("beforechange", Object.assign(Object.assign({}, e), { sender: this }));
  }
  onValueChange_(e) {
    this.emitter.emit("change", Object.assign(Object.assign({}, e), { sender: this }));
  }
}
function f(n, e) {
  const t = e == null ? void 0 : e.constraint, s = e == null ? void 0 : e.equals;
  return !t && !s ? new Jn(n) : new Wn(n, e);
}
function Qn(n) {
  return [new Zn(n), (e, t) => {
    n.setRawValue(e, t);
  }];
}
class d {
  constructor(e) {
    this.emitter = new k(), this.valMap_ = e;
    for (const t in this.valMap_) this.valMap_[t].emitter.on("change", () => {
      this.emitter.emit("change", { key: t, sender: this });
    });
  }
  static createCore(e) {
    return Object.keys(e).reduce((s, i) => Object.assign(s, { [i]: f(e[i]) }), {});
  }
  static fromObject(e) {
    const t = this.createCore(e);
    return new d(t);
  }
  get(e) {
    return this.valMap_[e].rawValue;
  }
  set(e, t) {
    this.valMap_[e].rawValue = t;
  }
  value(e) {
    return this.valMap_[e];
  }
}
class Ve {
  constructor(e) {
    this.values = d.fromObject({ max: e.max, min: e.min });
  }
  constrain(e) {
    const t = this.values.get("max"), s = this.values.get("min");
    return Math.min(Math.max(e, s), t);
  }
}
class es {
  constructor(e) {
    this.values = d.fromObject({ max: e.max, min: e.min });
  }
  constrain(e) {
    const t = this.values.get("max"), s = this.values.get("min");
    let i = e;
    return w(s) || (i = Math.max(i, s)), w(t) || (i = Math.min(i, t)), i;
  }
}
class ts {
  constructor(e, t = 0) {
    this.step = e, this.origin = t;
  }
  constrain(e) {
    const t = this.origin % this.step, s = Math.round((e - t) / this.step);
    return t + s * this.step;
  }
}
class ns {
  constructor(e) {
    this.text = e;
  }
  evaluate() {
    return Number(this.text);
  }
  toString() {
    return this.text;
  }
}
const ss = { "**": (n, e) => Math.pow(n, e), "*": (n, e) => n * e, "/": (n, e) => n / e, "%": (n, e) => n % e, "+": (n, e) => n + e, "-": (n, e) => n - e, "<<": (n, e) => n << e, ">>": (n, e) => n >> e, ">>>": (n, e) => n >>> e, "&": (n, e) => n & e, "^": (n, e) => n ^ e, "|": (n, e) => n | e };
class is {
  constructor(e, t, s) {
    this.left = t, this.operator = e, this.right = s;
  }
  evaluate() {
    const e = ss[this.operator];
    if (!e) throw new Error(`unexpected binary operator: '${this.operator}`);
    return e(this.left.evaluate(), this.right.evaluate());
  }
  toString() {
    return ["b(", this.left.toString(), this.operator, this.right.toString(), ")"].join(" ");
  }
}
const rs = { "+": (n) => n, "-": (n) => -n, "~": (n) => ~n };
class os {
  constructor(e, t) {
    this.operator = e, this.expression = t;
  }
  evaluate() {
    const e = rs[this.operator];
    if (!e) throw new Error(`unexpected unary operator: '${this.operator}`);
    return e(this.expression.evaluate());
  }
  toString() {
    return ["u(", this.operator, this.expression.toString(), ")"].join(" ");
  }
}
function nt(n) {
  return (e, t) => {
    for (let s = 0; s < n.length; s++) {
      const i = n[s](e, t);
      if (i !== "") return i;
    }
    return "";
  };
}
function he(n, e) {
  var t;
  const s = n.substr(e).match(/^\s+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function as(n, e) {
  const t = n.substr(e, 1);
  return t.match(/^[1-9]$/) ? t : "";
}
function ce(n, e) {
  var t;
  const s = n.substr(e).match(/^[0-9]+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function ls(n, e) {
  const t = ce(n, e);
  if (t !== "") return t;
  const s = n.substr(e, 1);
  if (e += 1, s !== "-" && s !== "+") return "";
  const i = ce(n, e);
  return i === "" ? "" : s + i;
}
function st(n, e) {
  const t = n.substr(e, 1);
  if (e += 1, t.toLowerCase() !== "e") return "";
  const s = ls(n, e);
  return s === "" ? "" : t + s;
}
function en(n, e) {
  const t = n.substr(e, 1);
  if (t === "0") return t;
  const s = as(n, e);
  return e += s.length, s === "" ? "" : s + ce(n, e);
}
function us(n, e) {
  const t = en(n, e);
  if (e += t.length, t === "") return "";
  const s = n.substr(e, 1);
  if (e += s.length, s !== ".") return "";
  const i = ce(n, e);
  return e += i.length, t + s + i + st(n, e);
}
function hs(n, e) {
  const t = n.substr(e, 1);
  if (e += t.length, t !== ".") return "";
  const s = ce(n, e);
  return e += s.length, s === "" ? "" : t + s + st(n, e);
}
function cs(n, e) {
  const t = en(n, e);
  return e += t.length, t === "" ? "" : t + st(n, e);
}
const ps = nt([us, hs, cs]);
function ds(n, e) {
  var t;
  const s = n.substr(e).match(/^[01]+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function ms(n, e) {
  const t = n.substr(e, 2);
  if (e += t.length, t.toLowerCase() !== "0b") return "";
  const s = ds(n, e);
  return s === "" ? "" : t + s;
}
function vs(n, e) {
  var t;
  const s = n.substr(e).match(/^[0-7]+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function ws(n, e) {
  const t = n.substr(e, 2);
  if (e += t.length, t.toLowerCase() !== "0o") return "";
  const s = vs(n, e);
  return s === "" ? "" : t + s;
}
function _s(n, e) {
  var t;
  const s = n.substr(e).match(/^[0-9a-f]+/i);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function fs(n, e) {
  const t = n.substr(e, 2);
  if (e += t.length, t.toLowerCase() !== "0x") return "";
  const s = _s(n, e);
  return s === "" ? "" : t + s;
}
const bs = nt([ms, ws, fs]), Cs = nt([bs, ps]);
function gs(n, e) {
  const t = Cs(n, e);
  return e += t.length, t === "" ? null : { evaluable: new ns(t), cursor: e };
}
function Ps(n, e) {
  const t = n.substr(e, 1);
  if (e += t.length, t !== "(") return null;
  const s = nn(n, e);
  if (!s) return null;
  e = s.cursor, e += he(n, e).length;
  const i = n.substr(e, 1);
  return e += i.length, i !== ")" ? null : { evaluable: s.evaluable, cursor: e };
}
function Es(n, e) {
  var t;
  return (t = gs(n, e)) !== null && t !== void 0 ? t : Ps(n, e);
}
function tn(n, e) {
  const t = Es(n, e);
  if (t) return t;
  const s = n.substr(e, 1);
  if (e += s.length, s !== "+" && s !== "-" && s !== "~") return null;
  const i = tn(n, e);
  return i ? (e = i.cursor, { cursor: e, evaluable: new os(s, i.evaluable) }) : null;
}
function ys(n, e, t) {
  t += he(e, t).length;
  const s = n.filter((i) => e.startsWith(i, t))[0];
  return s ? (t += s.length, t += he(e, t).length, { cursor: t, operator: s }) : null;
}
function xs(n, e) {
  return (t, s) => {
    const i = n(t, s);
    if (!i) return null;
    s = i.cursor;
    let r = i.evaluable;
    for (; ; ) {
      const o = ys(e, t, s);
      if (!o) break;
      s = o.cursor;
      const a = n(t, s);
      if (!a) return null;
      s = a.cursor, r = new is(o.operator, r, a.evaluable);
    }
    return r ? { cursor: s, evaluable: r } : null;
  };
}
const ks = [["**"], ["*", "/", "%"], ["+", "-"], ["<<", ">>>", ">>"], ["&"], ["^"], ["|"]].reduce((n, e) => xs(n, e), tn);
function nn(n, e) {
  return e += he(n, e).length, ks(n, e);
}
function Vs(n) {
  const e = nn(n, 0);
  return !e || e.cursor + he(n, e.cursor).length !== n.length ? null : e.evaluable;
}
function M(n) {
  var e;
  const t = Vs(n);
  return (e = t == null ? void 0 : t.evaluate()) !== null && e !== void 0 ? e : null;
}
function Se(n) {
  if (typeof n == "number") return n;
  if (typeof n == "string") {
    const e = M(n);
    if (!w(e)) return e;
  }
  return 0;
}
function g(n) {
  return (e) => e.toFixed(Math.max(Math.min(n, 20), 0));
}
function v(n, e, t, s, i) {
  const r = (n - e) / (t - e);
  return s + r * (i - s);
}
function Xe(n) {
  return String(n.toFixed(10)).split(".")[1].replace(/0+$/, "").length;
}
function _(n, e, t) {
  return Math.min(Math.max(n, e), t);
}
function sn(n, e) {
  return (n % e + e) % e;
}
function Ss(n, e) {
  return w(n.step) ? Math.max(Xe(e), 2) : Xe(n.step);
}
function rn(n) {
  var e;
  return (e = n.step) !== null && e !== void 0 ? e : 1;
}
function Ls(n, e) {
  var t;
  const s = Math.abs((t = n.step) !== null && t !== void 0 ? t : e);
  return s === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(s)) - 1);
}
function it(n, e) {
  return w(n.step) ? null : new ts(n.step, e);
}
function rt(n) {
  return !w(n.max) && !w(n.min) ? new Ve({ max: n.max, min: n.min }) : !w(n.max) || !w(n.min) ? new es({ max: n.max, min: n.min }) : null;
}
function Le(n, e) {
  var t, s, i;
  return { formatter: (t = n.format) !== null && t !== void 0 ? t : g(Ss(n, e)), keyScale: (s = n.keyScale) !== null && s !== void 0 ? s : rn(n), pointerScale: (i = n.pointerScale) !== null && i !== void 0 ? i : Ls(n, e) };
}
function Me(n) {
  return { format: n.optional.function, keyScale: n.optional.number, max: n.optional.number, min: n.optional.number, pointerScale: n.optional.number, step: n.optional.number };
}
function ot(n) {
  return { constraint: n.constraint, textProps: d.fromObject(Le(n.params, n.initialValue)) };
}
class at {
  constructor(e) {
    this.controller = e;
  }
  get element() {
    return this.controller.view.element;
  }
  get disabled() {
    return this.controller.viewProps.get("disabled");
  }
  set disabled(e) {
    this.controller.viewProps.set("disabled", e);
  }
  get hidden() {
    return this.controller.viewProps.get("hidden");
  }
  set hidden(e) {
    this.controller.viewProps.set("hidden", e);
  }
  dispose() {
    this.controller.viewProps.set("disposed", true);
  }
  importState(e) {
    return this.controller.importState(e);
  }
  exportState() {
    return this.controller.exportState();
  }
}
class Ae {
  constructor(e) {
    this.target = e;
  }
}
class on extends Ae {
  constructor(e, t, s) {
    super(e), this.value = t, this.last = s ?? true;
  }
}
class Ms extends Ae {
  constructor(e, t) {
    super(e), this.expanded = t;
  }
}
class As extends Ae {
  constructor(e, t) {
    super(e), this.index = t;
  }
}
class lt extends at {
  constructor(e) {
    super(e), this.onValueChange_ = this.onValueChange_.bind(this), this.emitter_ = new k(), this.controller.value.emitter.on("change", this.onValueChange_);
  }
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(e) {
    this.controller.labelController.props.set("label", e);
  }
  get key() {
    return this.controller.value.binding.target.key;
  }
  get tag() {
    return this.controller.tag;
  }
  set tag(e) {
    this.controller.tag = e;
  }
  on(e, t) {
    const s = t.bind(this);
    return this.emitter_.on(e, (i) => {
      s(i);
    }), this;
  }
  refresh() {
    this.controller.value.fetch();
  }
  onValueChange_(e) {
    const t = this.controller.value;
    this.emitter_.emit("change", new on(this, t.binding.target.read(), e.options.last));
  }
}
function Rs(n, e) {
  const s = Object.keys(e).reduce((i, r) => {
    if (i === void 0) return;
    const o = e[r], a = o(n[r]);
    return a.succeeded ? Object.assign(Object.assign({}, i), { [r]: a.value }) : void 0;
  }, {});
  return s;
}
function Os(n, e) {
  return n.reduce((t, s) => {
    if (t === void 0) return;
    const i = e(s);
    if (!(!i.succeeded || i.value === void 0)) return [...t, i.value];
  }, []);
}
function Ds(n) {
  return n === null ? false : typeof n == "object";
}
function T(n) {
  return (e) => (t) => {
    if (!e && t === void 0) return { succeeded: false, value: void 0 };
    if (e && t === void 0) return { succeeded: true, value: void 0 };
    const s = n(t);
    return s !== void 0 ? { succeeded: true, value: s } : { succeeded: false, value: void 0 };
  };
}
function Mt(n) {
  return { custom: (e) => T(e)(n), boolean: T((e) => typeof e == "boolean" ? e : void 0)(n), number: T((e) => typeof e == "number" ? e : void 0)(n), string: T((e) => typeof e == "string" ? e : void 0)(n), function: T((e) => typeof e == "function" ? e : void 0)(n), constant: (e) => T((t) => t === e ? e : void 0)(n), raw: T((e) => e)(n), object: (e) => T((t) => {
    if (Ds(t)) return Rs(t, e);
  })(n), array: (e) => T((t) => {
    if (Array.isArray(t)) return Os(t, e);
  })(n) };
}
const We = { optional: Mt(true), required: Mt(false) };
function b(n, e) {
  const t = e(We), s = We.required.object(t)(n);
  return s.succeeded ? s.value : void 0;
}
function O(n, e, t, s) {
  if (e && !e(n)) return false;
  const i = b(n, t);
  return i ? s(i) : false;
}
function D(n, e) {
  var t;
  return G((t = n == null ? void 0 : n()) !== null && t !== void 0 ? t : {}, e);
}
function Ce(n) {
  return "value" in n;
}
function Ts(n) {
  if (!tt(n) || !("binding" in n)) return false;
  const e = n.binding;
  return Yn(e);
}
const x = "http://www.w3.org/2000/svg";
function ye(n) {
  n.offsetHeight;
}
function js(n, e) {
  const t = n.style.transition;
  n.style.transition = "none", e(), n.style.transition = t;
}
function ut(n) {
  return n.ontouchstart !== void 0;
}
function Ns(n) {
  const e = n.ownerDocument.defaultView;
  return e && "document" in e ? n.getContext("2d", { willReadFrequently: true }) : null;
}
const Is = { check: '<path d="M2 8l4 4l8 -8"/>', dropdown: '<path d="M5 7h6l-3 3 z"/>', p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>' };
function Re(n, e) {
  const t = n.createElementNS(x, "svg");
  return t.innerHTML = Is[e], t;
}
function an(n, e, t) {
  n.insertBefore(e, n.children[t]);
}
function pe(n) {
  n.parentElement && n.parentElement.removeChild(n);
}
function ln(n) {
  for (; n.children.length > 0; ) n.removeChild(n.children[0]);
}
function Fs(n) {
  for (; n.childNodes.length > 0; ) n.removeChild(n.childNodes[0]);
}
function un(n) {
  return n.relatedTarget ? n.relatedTarget : "explicitOriginalTarget" in n ? n.explicitOriginalTarget : null;
}
function N(n, e) {
  n.emitter.on("change", (t) => {
    e(t.rawValue);
  }), e(n.rawValue);
}
function A(n, e, t) {
  N(n.value(e), t);
}
const Bs = "tp";
function p(n) {
  return (t, s) => [Bs, "-", n, "v", t ? `_${t}` : "", s ? `-${s}` : ""].join("");
}
const oe = p("lbl");
function Ks(n, e) {
  const t = n.createDocumentFragment();
  return e.split(`
`).map((i) => n.createTextNode(i)).forEach((i, r) => {
    r > 0 && t.appendChild(n.createElement("br")), t.appendChild(i);
  }), t;
}
class $s {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(oe()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(oe("l")), A(t.props, "label", (r) => {
      w(r) ? this.element.classList.add(oe(void 0, "nol")) : (this.element.classList.remove(oe(void 0, "nol")), Fs(s), s.appendChild(Ks(e, r)));
    }), this.element.appendChild(s), this.labelElement = s;
    const i = e.createElement("div");
    i.classList.add(oe("v")), this.element.appendChild(i), this.valueElement = i;
  }
}
class Us {
  constructor(e, t) {
    this.props = t.props, this.valueController = t.valueController, this.viewProps = t.valueController.viewProps, this.view = new $s(e, { props: t.props, viewProps: this.viewProps }), this.view.valueElement.appendChild(this.valueController.view.element);
  }
  importProps(e) {
    return O(e, null, (t) => ({ label: t.optional.string }), (t) => (this.props.set("label", t.label), true));
  }
  exportProps() {
    return D(null, { label: this.props.get("label") });
  }
}
function Hs() {
  return ["veryfirst", "first", "last", "verylast"];
}
const At = p(""), Rt = { veryfirst: "vfst", first: "fst", last: "lst", verylast: "vlst" };
class hn {
  constructor(e) {
    this.parent_ = null, this.blade = e.blade, this.view = e.view, this.viewProps = e.viewProps;
    const t = this.view.element;
    this.blade.value("positions").emitter.on("change", () => {
      Hs().forEach((s) => {
        t.classList.remove(At(void 0, Rt[s]));
      }), this.blade.get("positions").forEach((s) => {
        t.classList.add(At(void 0, Rt[s]));
      });
    }), this.viewProps.handleDispose(() => {
      pe(t);
    });
  }
  get parent() {
    return this.parent_;
  }
  set parent(e) {
    this.parent_ = e, this.viewProps.set("parent", this.parent_ ? this.parent_.viewProps : null);
  }
  importState(e) {
    return O(e, null, (t) => ({ disabled: t.required.boolean, hidden: t.required.boolean }), (t) => (this.viewProps.importState(t), true));
  }
  exportState() {
    return D(null, Object.assign({}, this.viewProps.exportState()));
  }
}
class qs extends at {
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(e) {
    this.controller.labelController.props.set("label", e);
  }
  get title() {
    var e;
    return (e = this.controller.buttonController.props.get("title")) !== null && e !== void 0 ? e : "";
  }
  set title(e) {
    this.controller.buttonController.props.set("title", e);
  }
  on(e, t) {
    const s = t.bind(this);
    return this.controller.buttonController.emitter.on(e, () => {
      s(new Ae(this));
    }), this;
  }
}
function zs(n, e, t) {
  t ? n.classList.add(e) : n.classList.remove(e);
}
function ne(n, e) {
  return (t) => {
    zs(n, e, t);
  };
}
function ht(n, e) {
  N(n, (t) => {
    e.textContent = t ?? "";
  });
}
const Fe = p("btn");
class Gs {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(Fe()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("button");
    s.classList.add(Fe("b")), t.viewProps.bindDisabled(s), this.element.appendChild(s), this.buttonElement = s;
    const i = e.createElement("div");
    i.classList.add(Fe("t")), ht(t.props.value("title"), i), this.buttonElement.appendChild(i);
  }
}
class Ys {
  constructor(e, t) {
    this.emitter = new k(), this.onClick_ = this.onClick_.bind(this), this.props = t.props, this.viewProps = t.viewProps, this.view = new Gs(e, { props: this.props, viewProps: this.viewProps }), this.view.buttonElement.addEventListener("click", this.onClick_);
  }
  importProps(e) {
    return O(e, null, (t) => ({ title: t.optional.string }), (t) => (this.props.set("title", t.title), true));
  }
  exportProps() {
    return D(null, { title: this.props.get("title") });
  }
  onClick_() {
    this.emitter.emit("click", { sender: this });
  }
}
class Ot extends hn {
  constructor(e, t) {
    const s = new Ys(e, { props: t.buttonProps, viewProps: t.viewProps }), i = new Us(e, { blade: t.blade, props: t.labelProps, valueController: s });
    super({ blade: t.blade, view: i.view, viewProps: t.viewProps }), this.buttonController = s, this.labelController = i;
  }
  importState(e) {
    return O(e, (t) => super.importState(t) && this.buttonController.importProps(t) && this.labelController.importProps(t), () => ({}), () => true);
  }
  exportState() {
    return D(() => super.exportState(), Object.assign(Object.assign({}, this.buttonController.exportProps()), this.labelController.exportProps()));
  }
}
class Xs {
  constructor(e) {
    const [t, s] = e.split("-"), i = t.split(".");
    this.major = parseInt(i[0], 10), this.minor = parseInt(i[1], 10), this.patch = parseInt(i[2], 10), this.prerelease = s ?? null;
  }
  toString() {
    const e = [this.major, this.minor, this.patch].join(".");
    return this.prerelease !== null ? [e, this.prerelease].join("-") : e;
  }
}
const Ws = new Xs("2.0.0-beta.2");
function C(n) {
  return Object.assign({ core: Ws }, n);
}
C({ id: "button", type: "blade", accept(n) {
  const e = b(n, (t) => ({ title: t.required.string, view: t.required.constant("button"), label: t.optional.string }));
  return e ? { params: e } : null;
}, controller(n) {
  return new Ot(n.document, { blade: n.blade, buttonProps: d.fromObject({ title: n.params.title }), labelProps: d.fromObject({ label: n.params.label }), viewProps: n.viewProps });
}, api(n) {
  return n.controller instanceof Ot ? new qs(n.controller) : null;
} });
function Js(n, e) {
  return n.addBlade(Object.assign(Object.assign({}, e), { view: "button" }));
}
function Zs(n, e) {
  return n.addBlade(Object.assign(Object.assign({}, e), { view: "folder" }));
}
function Qs(n, e) {
  return n.addBlade(Object.assign(Object.assign({}, e), { view: "tab" }));
}
function ei(n) {
  return tt(n) ? "refresh" in n && typeof n.refresh == "function" : false;
}
function ti(n, e) {
  if (!Ee.isBindable(n)) throw y.notBindable();
  return new Ee(n, e);
}
class ni {
  constructor(e, t) {
    this.onRackValueChange_ = this.onRackValueChange_.bind(this), this.controller_ = e, this.emitter_ = new k(), this.pool_ = t, this.controller_.rack.emitter.on("valuechange", this.onRackValueChange_);
  }
  get children() {
    return this.controller_.rack.children.map((e) => this.pool_.createApi(e));
  }
  addBinding(e, t, s) {
    const i = s ?? {}, r = this.controller_.element.ownerDocument, o = this.pool_.createBinding(r, ti(e, t), i), a = this.pool_.createBindingApi(o);
    return this.add(a, i.index);
  }
  addFolder(e) {
    return Zs(this, e);
  }
  addButton(e) {
    return Js(this, e);
  }
  addTab(e) {
    return Qs(this, e);
  }
  add(e, t) {
    const s = e.controller;
    return this.controller_.rack.add(s, t), e;
  }
  remove(e) {
    this.controller_.rack.remove(e.controller);
  }
  addBlade(e) {
    const t = this.controller_.element.ownerDocument, s = this.pool_.createBlade(t, e), i = this.pool_.createApi(s);
    return this.add(i, e.index);
  }
  on(e, t) {
    const s = t.bind(this);
    return this.emitter_.on(e, (i) => {
      s(i);
    }), this;
  }
  refresh() {
    this.children.forEach((e) => {
      ei(e) && e.refresh();
    });
  }
  onRackValueChange_(e) {
    const t = e.bladeController, s = this.pool_.createApi(t), i = Ts(t.value) ? t.value.binding : null;
    this.emitter_.emit("change", new on(s, i ? i.target.read() : t.value.rawValue, e.options.last));
  }
}
class ct extends at {
  constructor(e, t) {
    super(e), this.rackApi_ = new ni(e.rackController, t);
  }
}
class pt extends hn {
  constructor(e) {
    super({ blade: e.blade, view: e.view, viewProps: e.rackController.viewProps }), this.rackController = e.rackController;
  }
  importState(e) {
    return O(e, (t) => super.importState(t), (t) => ({ children: t.required.array(t.required.raw) }), (t) => this.rackController.rack.children.every((s, i) => s.importState(t.children[i])));
  }
  exportState() {
    return D(() => super.exportState(), { children: this.rackController.rack.children.map((e) => e.exportState()) });
  }
}
function Je(n) {
  return "rackController" in n;
}
class si {
  constructor(e) {
    this.emitter = new k(), this.items_ = [], this.cache_ = /* @__PURE__ */ new Set(), this.onSubListAdd_ = this.onSubListAdd_.bind(this), this.onSubListRemove_ = this.onSubListRemove_.bind(this), this.extract_ = e;
  }
  get items() {
    return this.items_;
  }
  allItems() {
    return Array.from(this.cache_);
  }
  find(e) {
    for (const t of this.allItems()) if (e(t)) return t;
    return null;
  }
  includes(e) {
    return this.cache_.has(e);
  }
  add(e, t) {
    if (this.includes(e)) throw y.shouldNeverHappen();
    const s = t !== void 0 ? t : this.items_.length;
    this.items_.splice(s, 0, e), this.cache_.add(e);
    const i = this.extract_(e);
    i && (i.emitter.on("add", this.onSubListAdd_), i.emitter.on("remove", this.onSubListRemove_), i.allItems().forEach((r) => {
      this.cache_.add(r);
    })), this.emitter.emit("add", { index: s, item: e, root: this, target: this });
  }
  remove(e) {
    const t = this.items_.indexOf(e);
    if (t < 0) return;
    this.items_.splice(t, 1), this.cache_.delete(e);
    const s = this.extract_(e);
    s && (s.allItems().forEach((i) => {
      this.cache_.delete(i);
    }), s.emitter.off("add", this.onSubListAdd_), s.emitter.off("remove", this.onSubListRemove_)), this.emitter.emit("remove", { index: t, item: e, root: this, target: this });
  }
  onSubListAdd_(e) {
    this.cache_.add(e.item), this.emitter.emit("add", { index: e.index, item: e.item, root: this, target: e.target });
  }
  onSubListRemove_(e) {
    this.cache_.delete(e.item), this.emitter.emit("remove", { index: e.index, item: e.item, root: this, target: e.target });
  }
}
function ii(n, e) {
  for (let t = 0; t < n.length; t++) {
    const s = n[t];
    if (Ce(s) && s.value === e) return s;
  }
  return null;
}
function ri(n) {
  return Je(n) ? n.rackController.rack.bcSet_ : null;
}
class oi {
  constructor(e) {
    var t, s;
    this.emitter = new k(), this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this), this.onSetAdd_ = this.onSetAdd_.bind(this), this.onSetRemove_ = this.onSetRemove_.bind(this), this.onChildDispose_ = this.onChildDispose_.bind(this), this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this), this.onChildValueChange_ = this.onChildValueChange_.bind(this), this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this), this.onRackLayout_ = this.onRackLayout_.bind(this), this.onRackValueChange_ = this.onRackValueChange_.bind(this), this.blade_ = (t = e.blade) !== null && t !== void 0 ? t : null, (s = this.blade_) === null || s === void 0 || s.value("positions").emitter.on("change", this.onBladePositionsChange_), this.viewProps = e.viewProps, this.bcSet_ = new si(ri), this.bcSet_.emitter.on("add", this.onSetAdd_), this.bcSet_.emitter.on("remove", this.onSetRemove_);
  }
  get children() {
    return this.bcSet_.items;
  }
  add(e, t) {
    var s;
    (s = e.parent) === null || s === void 0 || s.remove(e), e.parent = this, this.bcSet_.add(e, t);
  }
  remove(e) {
    e.parent = null, this.bcSet_.remove(e);
  }
  find(e) {
    return this.bcSet_.allItems().filter(e);
  }
  onSetAdd_(e) {
    this.updatePositions_();
    const t = e.target === e.root;
    if (this.emitter.emit("add", { bladeController: e.item, index: e.index, root: t, sender: this }), !t) return;
    const s = e.item;
    if (s.viewProps.emitter.on("change", this.onChildViewPropsChange_), s.blade.value("positions").emitter.on("change", this.onChildPositionsChange_), s.viewProps.handleDispose(this.onChildDispose_), Ce(s)) s.value.emitter.on("change", this.onChildValueChange_);
    else if (Je(s)) {
      const i = s.rackController.rack;
      if (i) {
        const r = i.emitter;
        r.on("layout", this.onRackLayout_), r.on("valuechange", this.onRackValueChange_);
      }
    }
  }
  onSetRemove_(e) {
    this.updatePositions_();
    const t = e.target === e.root;
    if (this.emitter.emit("remove", { bladeController: e.item, root: t, sender: this }), !t) return;
    const s = e.item;
    if (Ce(s)) s.value.emitter.off("change", this.onChildValueChange_);
    else if (Je(s)) {
      const i = s.rackController.rack;
      if (i) {
        const r = i.emitter;
        r.off("layout", this.onRackLayout_), r.off("valuechange", this.onRackValueChange_);
      }
    }
  }
  updatePositions_() {
    const e = this.bcSet_.items.filter((i) => !i.viewProps.get("hidden")), t = e[0], s = e[e.length - 1];
    this.bcSet_.items.forEach((i) => {
      const r = [];
      i === t && (r.push("first"), (!this.blade_ || this.blade_.get("positions").includes("veryfirst")) && r.push("veryfirst")), i === s && (r.push("last"), (!this.blade_ || this.blade_.get("positions").includes("verylast")) && r.push("verylast")), i.blade.set("positions", r);
    });
  }
  onChildPositionsChange_() {
    this.updatePositions_(), this.emitter.emit("layout", { sender: this });
  }
  onChildViewPropsChange_(e) {
    this.updatePositions_(), this.emitter.emit("layout", { sender: this });
  }
  onChildDispose_() {
    this.bcSet_.items.filter((t) => t.viewProps.get("disposed")).forEach((t) => {
      this.bcSet_.remove(t);
    });
  }
  onChildValueChange_(e) {
    const t = ii(this.find(Ce), e.sender);
    if (!t) throw y.alreadyDisposed();
    this.emitter.emit("valuechange", { bladeController: t, options: e.options, sender: this });
  }
  onRackLayout_(e) {
    this.updatePositions_(), this.emitter.emit("layout", { sender: this });
  }
  onRackValueChange_(e) {
    this.emitter.emit("valuechange", { bladeController: e.bladeController, options: e.options, sender: this });
  }
  onBladePositionsChange_() {
    this.updatePositions_();
  }
}
class dt {
  constructor(e) {
    this.onRackAdd_ = this.onRackAdd_.bind(this), this.onRackRemove_ = this.onRackRemove_.bind(this), this.element = e.element, this.viewProps = e.viewProps;
    const t = new oi({ blade: e.root ? void 0 : e.blade, viewProps: e.viewProps });
    t.emitter.on("add", this.onRackAdd_), t.emitter.on("remove", this.onRackRemove_), this.rack = t, this.viewProps.handleDispose(() => {
      for (let s = this.rack.children.length - 1; s >= 0; s--) this.rack.children[s].viewProps.set("disposed", true);
    });
  }
  onRackAdd_(e) {
    e.root && an(this.element, e.bladeController.view.element, e.index);
  }
  onRackRemove_(e) {
    e.root && pe(e.bladeController.view.element);
  }
}
function cn() {
  return new d({ positions: f([], { equals: Gn }) });
}
class ve extends d {
  constructor(e) {
    super(e);
  }
  static create(e) {
    const t = { completed: true, expanded: e, expandedHeight: null, shouldFixHeight: false, temporaryExpanded: null }, s = d.createCore(t);
    return new ve(s);
  }
  get styleExpanded() {
    var e;
    return (e = this.get("temporaryExpanded")) !== null && e !== void 0 ? e : this.get("expanded");
  }
  get styleHeight() {
    if (!this.styleExpanded) return "0";
    const e = this.get("expandedHeight");
    return this.get("shouldFixHeight") && !w(e) ? `${e}px` : "auto";
  }
  bindExpandedClass(e, t) {
    const s = () => {
      this.styleExpanded ? e.classList.add(t) : e.classList.remove(t);
    };
    A(this, "expanded", s), A(this, "temporaryExpanded", s);
  }
  cleanUpTransition() {
    this.set("shouldFixHeight", false), this.set("expandedHeight", null), this.set("completed", true);
  }
}
function ai(n, e) {
  let t = 0;
  return js(e, () => {
    n.set("expandedHeight", null), n.set("temporaryExpanded", true), ye(e), t = e.clientHeight, n.set("temporaryExpanded", null), ye(e);
  }), t;
}
function Dt(n, e) {
  e.style.height = n.styleHeight;
}
function mt(n, e) {
  n.value("expanded").emitter.on("beforechange", () => {
    if (n.set("completed", false), w(n.get("expandedHeight"))) {
      const t = ai(n, e);
      t > 0 && n.set("expandedHeight", t);
    }
    n.set("shouldFixHeight", true), ye(e);
  }), n.emitter.on("change", () => {
    Dt(n, e);
  }), Dt(n, e), e.addEventListener("transitionend", (t) => {
    t.propertyName === "height" && n.cleanUpTransition();
  });
}
class li extends ct {
  constructor(e, t) {
    super(e, t), this.emitter_ = new k(), this.controller.foldable.value("expanded").emitter.on("change", (s) => {
      this.emitter_.emit("fold", new Ms(this, s.sender.rawValue));
    }), this.rackApi_.on("change", (s) => {
      this.emitter_.emit("change", s);
    });
  }
  get expanded() {
    return this.controller.foldable.get("expanded");
  }
  set expanded(e) {
    this.controller.foldable.set("expanded", e);
  }
  get title() {
    return this.controller.props.get("title");
  }
  set title(e) {
    this.controller.props.set("title", e);
  }
  get children() {
    return this.rackApi_.children;
  }
  addBinding(e, t, s) {
    return this.rackApi_.addBinding(e, t, s);
  }
  addFolder(e) {
    return this.rackApi_.addFolder(e);
  }
  addButton(e) {
    return this.rackApi_.addButton(e);
  }
  addTab(e) {
    return this.rackApi_.addTab(e);
  }
  add(e, t) {
    return this.rackApi_.add(e, t);
  }
  remove(e) {
    this.rackApi_.remove(e);
  }
  addBlade(e) {
    return this.rackApi_.addBlade(e);
  }
  on(e, t) {
    const s = t.bind(this);
    return this.emitter_.on(e, (i) => {
      s(i);
    }), this;
  }
  refresh() {
    this.rackApi_.refresh();
  }
}
const pn = p("cnt");
class ui {
  constructor(e, t) {
    var s;
    this.className_ = p((s = t.viewName) !== null && s !== void 0 ? s : "fld"), this.element = e.createElement("div"), this.element.classList.add(this.className_(), pn()), t.viewProps.bindClassModifiers(this.element), this.foldable_ = t.foldable, this.foldable_.bindExpandedClass(this.element, this.className_(void 0, "expanded")), A(this.foldable_, "completed", ne(this.element, this.className_(void 0, "cpl")));
    const i = e.createElement("button");
    i.classList.add(this.className_("b")), A(t.props, "title", (l) => {
      w(l) ? this.element.classList.add(this.className_(void 0, "not")) : this.element.classList.remove(this.className_(void 0, "not"));
    }), t.viewProps.bindDisabled(i), this.element.appendChild(i), this.buttonElement = i;
    const r = e.createElement("div");
    r.classList.add(this.className_("i")), this.element.appendChild(r);
    const o = e.createElement("div");
    o.classList.add(this.className_("t")), ht(t.props.value("title"), o), this.buttonElement.appendChild(o), this.titleElement = o;
    const a = e.createElement("div");
    a.classList.add(this.className_("m")), this.buttonElement.appendChild(a);
    const u = e.createElement("div");
    u.classList.add(this.className_("c")), this.element.appendChild(u), this.containerElement = u;
  }
}
class Tt extends pt {
  constructor(e, t) {
    var s;
    const i = ve.create((s = t.expanded) !== null && s !== void 0 ? s : true), r = new ui(e, { foldable: i, props: t.props, viewName: t.root ? "rot" : void 0, viewProps: t.viewProps });
    super(Object.assign(Object.assign({}, t), { rackController: new dt({ blade: t.blade, element: r.containerElement, root: t.root, viewProps: t.viewProps }), view: r })), this.onTitleClick_ = this.onTitleClick_.bind(this), this.props = t.props, this.foldable = i, mt(this.foldable, this.view.containerElement), this.rackController.rack.emitter.on("add", () => {
      this.foldable.cleanUpTransition();
    }), this.rackController.rack.emitter.on("remove", () => {
      this.foldable.cleanUpTransition();
    }), this.view.buttonElement.addEventListener("click", this.onTitleClick_);
  }
  get document() {
    return this.view.element.ownerDocument;
  }
  importState(e) {
    return O(e, (t) => super.importState(t), (t) => ({ expanded: t.required.boolean, title: t.optional.string }), (t) => (this.foldable.set("expanded", t.expanded), this.props.set("title", t.title), true));
  }
  exportState() {
    return D(() => super.exportState(), { expanded: this.foldable.get("expanded"), title: this.props.get("title") });
  }
  onTitleClick_() {
    this.foldable.set("expanded", !this.foldable.get("expanded"));
  }
}
C({ id: "folder", type: "blade", accept(n) {
  const e = b(n, (t) => ({ title: t.required.string, view: t.required.constant("folder"), expanded: t.optional.boolean }));
  return e ? { params: e } : null;
}, controller(n) {
  return new Tt(n.document, { blade: n.blade, expanded: n.params.expanded, props: d.fromObject({ title: n.params.title }), viewProps: n.viewProps });
}, api(n) {
  return n.controller instanceof Tt ? new li(n.controller, n.pool) : null;
} });
const hi = p("");
function jt(n, e) {
  return ne(n, hi(void 0, e));
}
class we extends d {
  constructor(e) {
    var t;
    super(e), this.onDisabledChange_ = this.onDisabledChange_.bind(this), this.onParentChange_ = this.onParentChange_.bind(this), this.onParentGlobalDisabledChange_ = this.onParentGlobalDisabledChange_.bind(this), [this.globalDisabled_, this.setGlobalDisabled_] = Qn(f(this.getGlobalDisabled_())), this.value("disabled").emitter.on("change", this.onDisabledChange_), this.value("parent").emitter.on("change", this.onParentChange_), (t = this.get("parent")) === null || t === void 0 || t.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_);
  }
  static create(e) {
    var t, s, i;
    const r = e ?? {};
    return new we(d.createCore({ disabled: (t = r.disabled) !== null && t !== void 0 ? t : false, disposed: false, hidden: (s = r.hidden) !== null && s !== void 0 ? s : false, parent: (i = r.parent) !== null && i !== void 0 ? i : null }));
  }
  get globalDisabled() {
    return this.globalDisabled_;
  }
  bindClassModifiers(e) {
    N(this.globalDisabled_, jt(e, "disabled")), A(this, "hidden", jt(e, "hidden"));
  }
  bindDisabled(e) {
    N(this.globalDisabled_, (t) => {
      e.disabled = t;
    });
  }
  bindTabIndex(e) {
    N(this.globalDisabled_, (t) => {
      e.tabIndex = t ? -1 : 0;
    });
  }
  handleDispose(e) {
    this.value("disposed").emitter.on("change", (t) => {
      t && e();
    });
  }
  importState(e) {
    this.set("disabled", e.disabled), this.set("hidden", e.hidden);
  }
  exportState() {
    return { disabled: this.get("disabled"), hidden: this.get("hidden") };
  }
  getGlobalDisabled_() {
    const e = this.get("parent");
    return (e ? e.globalDisabled.rawValue : false) || this.get("disabled");
  }
  updateGlobalDisabled_() {
    this.setGlobalDisabled_(this.getGlobalDisabled_());
  }
  onDisabledChange_() {
    this.updateGlobalDisabled_();
  }
  onParentGlobalDisabledChange_() {
    this.updateGlobalDisabled_();
  }
  onParentChange_(e) {
    var t;
    const s = e.previousRawValue;
    s == null ? void 0 : s.globalDisabled.emitter.off("change", this.onParentGlobalDisabledChange_), (t = this.get("parent")) === null || t === void 0 || t.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_), this.updateGlobalDisabled_();
  }
}
const Nt = p("tbp");
class ci {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(Nt()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(Nt("c")), this.element.appendChild(s), this.containerElement = s;
  }
}
const ae = p("tbi");
class pi {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(ae()), t.viewProps.bindClassModifiers(this.element), A(t.props, "selected", (r) => {
      r ? this.element.classList.add(ae(void 0, "sel")) : this.element.classList.remove(ae(void 0, "sel"));
    });
    const s = e.createElement("button");
    s.classList.add(ae("b")), t.viewProps.bindDisabled(s), this.element.appendChild(s), this.buttonElement = s;
    const i = e.createElement("div");
    i.classList.add(ae("t")), ht(t.props.value("title"), i), this.buttonElement.appendChild(i), this.titleElement = i;
  }
}
class di {
  constructor(e, t) {
    this.emitter = new k(), this.onClick_ = this.onClick_.bind(this), this.props = t.props, this.viewProps = t.viewProps, this.view = new pi(e, { props: t.props, viewProps: t.viewProps }), this.view.buttonElement.addEventListener("click", this.onClick_);
  }
  onClick_() {
    this.emitter.emit("click", { sender: this });
  }
}
class Ze extends pt {
  constructor(e, t) {
    const s = new ci(e, { viewProps: t.viewProps });
    super(Object.assign(Object.assign({}, t), { rackController: new dt({ blade: t.blade, element: s.containerElement, viewProps: t.viewProps }), view: s })), this.onItemClick_ = this.onItemClick_.bind(this), this.ic_ = new di(e, { props: t.itemProps, viewProps: we.create() }), this.ic_.emitter.on("click", this.onItemClick_), this.props = t.props, A(this.props, "selected", (i) => {
      this.itemController.props.set("selected", i), this.viewProps.set("hidden", !i);
    });
  }
  get itemController() {
    return this.ic_;
  }
  importState(e) {
    return O(e, (t) => super.importState(t), (t) => ({ selected: t.required.boolean, title: t.required.string }), (t) => (this.ic_.props.set("selected", t.selected), this.ic_.props.set("title", t.title), true));
  }
  exportState() {
    return D(() => super.exportState(), { selected: this.ic_.props.get("selected"), title: this.ic_.props.get("title") });
  }
  onItemClick_() {
    this.props.set("selected", true);
  }
}
class mi extends ct {
  constructor(e, t) {
    super(e, t), this.emitter_ = new k(), this.onSelect_ = this.onSelect_.bind(this), this.pool_ = t, this.rackApi_.on("change", (s) => {
      this.emitter_.emit("change", s);
    }), this.controller.tab.selectedIndex.emitter.on("change", this.onSelect_);
  }
  get pages() {
    return this.rackApi_.children;
  }
  addPage(e) {
    const t = this.controller.view.element.ownerDocument, s = new Ze(t, { blade: cn(), itemProps: d.fromObject({ selected: false, title: e.title }), props: d.fromObject({ selected: false }), viewProps: we.create() }), i = this.pool_.createApi(s);
    return this.rackApi_.add(i, e.index);
  }
  removePage(e) {
    this.rackApi_.remove(this.rackApi_.children[e]);
  }
  on(e, t) {
    const s = t.bind(this);
    return this.emitter_.on(e, (i) => {
      s(i);
    }), this;
  }
  onSelect_(e) {
    this.emitter_.emit("select", new As(this, e.rawValue));
  }
}
class vi extends ct {
  get title() {
    var e;
    return (e = this.controller.itemController.props.get("title")) !== null && e !== void 0 ? e : "";
  }
  set title(e) {
    this.controller.itemController.props.set("title", e);
  }
  get selected() {
    return this.controller.props.get("selected");
  }
  set selected(e) {
    this.controller.props.set("selected", e);
  }
  get children() {
    return this.rackApi_.children;
  }
  addButton(e) {
    return this.rackApi_.addButton(e);
  }
  addFolder(e) {
    return this.rackApi_.addFolder(e);
  }
  addTab(e) {
    return this.rackApi_.addTab(e);
  }
  add(e, t) {
    this.rackApi_.add(e, t);
  }
  remove(e) {
    this.rackApi_.remove(e);
  }
  addBinding(e, t, s) {
    return this.rackApi_.addBinding(e, t, s);
  }
  addBlade(e) {
    return this.rackApi_.addBlade(e);
  }
  refresh() {
    this.rackApi_.refresh();
  }
}
const It = -1;
class wi {
  constructor() {
    this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this), this.empty = f(true), this.selectedIndex = f(It), this.items_ = [];
  }
  add(e, t) {
    const s = t ?? this.items_.length;
    this.items_.splice(s, 0, e), e.emitter.on("change", this.onItemSelectedChange_), this.keepSelection_();
  }
  remove(e) {
    const t = this.items_.indexOf(e);
    t < 0 || (this.items_.splice(t, 1), e.emitter.off("change", this.onItemSelectedChange_), this.keepSelection_());
  }
  keepSelection_() {
    if (this.items_.length === 0) {
      this.selectedIndex.rawValue = It, this.empty.rawValue = true;
      return;
    }
    const e = this.items_.findIndex((t) => t.rawValue);
    e < 0 ? (this.items_.forEach((t, s) => {
      t.rawValue = s === 0;
    }), this.selectedIndex.rawValue = 0) : (this.items_.forEach((t, s) => {
      t.rawValue = s === e;
    }), this.selectedIndex.rawValue = e), this.empty.rawValue = false;
  }
  onItemSelectedChange_(e) {
    if (e.rawValue) {
      const t = this.items_.findIndex((s) => s === e.sender);
      this.items_.forEach((s, i) => {
        s.rawValue = i === t;
      }), this.selectedIndex.rawValue = t;
    } else this.keepSelection_();
  }
}
const le = p("tab");
class _i {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(le(), pn()), t.viewProps.bindClassModifiers(this.element), N(t.empty, ne(this.element, le(void 0, "nop")));
    const s = e.createElement("div");
    s.classList.add(le("t")), this.element.appendChild(s), this.itemsElement = s;
    const i = e.createElement("div");
    i.classList.add(le("i")), this.element.appendChild(i);
    const r = e.createElement("div");
    r.classList.add(le("c")), this.element.appendChild(r), this.contentsElement = r;
  }
}
class Ft extends pt {
  constructor(e, t) {
    const s = new wi(), i = new _i(e, { empty: s.empty, viewProps: t.viewProps });
    super({ blade: t.blade, rackController: new dt({ blade: t.blade, element: i.contentsElement, viewProps: t.viewProps }), view: i }), this.onRackAdd_ = this.onRackAdd_.bind(this), this.onRackRemove_ = this.onRackRemove_.bind(this);
    const r = this.rackController.rack;
    r.emitter.on("add", this.onRackAdd_), r.emitter.on("remove", this.onRackRemove_), this.tab = s;
  }
  add(e, t) {
    this.rackController.rack.add(e, t);
  }
  remove(e) {
    this.rackController.rack.remove(this.rackController.rack.children[e]);
  }
  onRackAdd_(e) {
    if (!e.root) return;
    const t = e.bladeController;
    an(this.view.itemsElement, t.itemController.view.element, e.index), t.itemController.viewProps.set("parent", this.viewProps), this.tab.add(t.props.value("selected"));
  }
  onRackRemove_(e) {
    if (!e.root) return;
    const t = e.bladeController;
    pe(t.itemController.view.element), t.itemController.viewProps.set("parent", null), this.tab.remove(t.props.value("selected"));
  }
}
C({ id: "tab", type: "blade", accept(n) {
  const e = b(n, (t) => ({ pages: t.required.array(t.required.object({ title: t.required.string })), view: t.required.constant("tab") }));
  return !e || e.pages.length === 0 ? null : { params: e };
}, controller(n) {
  const e = new Ft(n.document, { blade: n.blade, viewProps: n.viewProps });
  return n.params.pages.forEach((t) => {
    const s = new Ze(n.document, { blade: cn(), itemProps: d.fromObject({ selected: false, title: t.title }), props: d.fromObject({ selected: false }), viewProps: we.create() });
    e.add(s);
  }), e;
}, api(n) {
  return n.controller instanceof Ft ? new mi(n.controller, n.pool) : n.controller instanceof Ze ? new vi(n.controller, n.pool) : null;
} });
class vt extends lt {
  get options() {
    return this.controller.valueController.props.get("options");
  }
  set options(e) {
    this.controller.valueController.props.set("options", e);
  }
}
class se {
  constructor(e) {
    this.constraints = e;
  }
  constrain(e) {
    return this.constraints.reduce((t, s) => s.constrain(t), e);
  }
}
function xe(n, e) {
  if (n instanceof e) return n;
  if (n instanceof se) {
    const t = n.constraints.reduce((s, i) => s || (i instanceof e ? i : null), null);
    if (t) return t;
  }
  return null;
}
class Oe {
  constructor(e) {
    this.values = d.fromObject({ options: e });
  }
  constrain(e) {
    const t = this.values.get("options");
    return t.length === 0 || t.filter((i) => i.value === e).length > 0 ? e : t[0].value;
  }
}
function De(n) {
  var e;
  const t = We;
  if (Array.isArray(n)) return (e = b({ items: n }, (s) => ({ items: s.required.array(s.required.object({ text: s.required.string, value: s.required.raw })) }))) === null || e === void 0 ? void 0 : e.items;
  if (typeof n == "object") return t.required.raw(n).value;
}
function dn(n) {
  if (Array.isArray(n)) return n;
  const e = [];
  return Object.keys(n).forEach((t) => {
    e.push({ text: t, value: n[t] });
  }), e;
}
function wt(n) {
  return w(n) ? null : new Oe(dn(n));
}
const Be = p("lst");
class fi {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.props_ = t.props, this.element = e.createElement("div"), this.element.classList.add(Be()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("select");
    s.classList.add(Be("s")), t.viewProps.bindDisabled(s), this.element.appendChild(s), this.selectElement = s;
    const i = e.createElement("div");
    i.classList.add(Be("m")), i.appendChild(Re(e, "dropdown")), this.element.appendChild(i), t.value.emitter.on("change", this.onValueChange_), this.value_ = t.value, A(this.props_, "options", (r) => {
      ln(this.selectElement), r.forEach((o) => {
        const a = e.createElement("option");
        a.textContent = o.text, this.selectElement.appendChild(a);
      }), this.update_();
    });
  }
  update_() {
    const e = this.props_.get("options").map((t) => t.value);
    this.selectElement.selectedIndex = e.indexOf(this.value_.rawValue);
  }
  onValueChange_() {
    this.update_();
  }
}
class ee {
  constructor(e, t) {
    this.onSelectChange_ = this.onSelectChange_.bind(this), this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.view = new fi(e, { props: this.props, value: this.value, viewProps: this.viewProps }), this.view.selectElement.addEventListener("change", this.onSelectChange_);
  }
  onSelectChange_(e) {
    const t = e.currentTarget;
    this.value.rawValue = this.props.get("options")[t.selectedIndex].value;
  }
  importProps(e) {
    return O(e, null, (t) => ({ options: t.required.custom(De) }), (t) => (this.props.set("options", dn(t.options)), true));
  }
  exportProps() {
    return D(null, { options: this.props.get("options") });
  }
}
const Bt = p("pop");
class bi {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(Bt()), t.viewProps.bindClassModifiers(this.element), N(t.shows, ne(this.element, Bt(void 0, "v")));
  }
}
class mn {
  constructor(e, t) {
    this.shows = f(false), this.viewProps = t.viewProps, this.view = new bi(e, { shows: this.shows, viewProps: this.viewProps });
  }
}
const Kt = p("txt");
class Ci {
  constructor(e, t) {
    this.onChange_ = this.onChange_.bind(this), this.element = e.createElement("div"), this.element.classList.add(Kt()), t.viewProps.bindClassModifiers(this.element), this.props_ = t.props, this.props_.emitter.on("change", this.onChange_);
    const s = e.createElement("input");
    s.classList.add(Kt("i")), s.type = "text", t.viewProps.bindDisabled(s), this.element.appendChild(s), this.inputElement = s, t.value.emitter.on("change", this.onChange_), this.value_ = t.value, this.refresh();
  }
  refresh() {
    const e = this.props_.get("formatter");
    this.inputElement.value = e(this.value_.rawValue);
  }
  onChange_() {
    this.refresh();
  }
}
class _t {
  constructor(e, t) {
    this.onInputChange_ = this.onInputChange_.bind(this), this.parser_ = t.parser, this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.view = new Ci(e, { props: t.props, value: this.value, viewProps: this.viewProps }), this.view.inputElement.addEventListener("change", this.onInputChange_);
  }
  onInputChange_(e) {
    const s = e.currentTarget.value, i = this.parser_(s);
    w(i) || (this.value.rawValue = i), this.view.refresh();
  }
}
function gi(n) {
  return String(n);
}
function vn(n) {
  return n === "false" ? false : !!n;
}
function $t(n) {
  return gi(n);
}
function Pi(n) {
  return (e) => n.reduce((t, s) => t !== null ? t : s(e), null);
}
const Ei = g(0);
function ke(n) {
  return Ei(n) + "%";
}
function wn(n) {
  return String(n);
}
function Qe(n) {
  return n;
}
function ie({ primary: n, secondary: e, forward: t, backward: s }) {
  let i = false;
  function r(o) {
    i || (i = true, o(), i = false);
  }
  n.emitter.on("change", (o) => {
    r(() => {
      e.setRawValue(t(n.rawValue, e.rawValue), o.options);
    });
  }), e.emitter.on("change", (o) => {
    r(() => {
      n.setRawValue(s(n.rawValue, e.rawValue), o.options);
    }), r(() => {
      e.setRawValue(t(n.rawValue, e.rawValue), o.options);
    });
  }), r(() => {
    e.setRawValue(t(n.rawValue, e.rawValue), { forceEmit: false, last: true });
  });
}
function E(n, e) {
  const t = n * (e.altKey ? 0.1 : 1) * (e.shiftKey ? 10 : 1);
  return e.upKey ? +t : e.downKey ? -t : 0;
}
function de(n) {
  return { altKey: n.altKey, downKey: n.key === "ArrowDown", shiftKey: n.shiftKey, upKey: n.key === "ArrowUp" };
}
function I(n) {
  return { altKey: n.altKey, downKey: n.key === "ArrowLeft", shiftKey: n.shiftKey, upKey: n.key === "ArrowRight" };
}
function yi(n) {
  return n === "ArrowUp" || n === "ArrowDown";
}
function _n(n) {
  return yi(n) || n === "ArrowLeft" || n === "ArrowRight";
}
function Ke(n, e) {
  var t, s;
  const i = e.ownerDocument.defaultView, r = e.getBoundingClientRect();
  return { x: n.pageX - (((t = i && i.scrollX) !== null && t !== void 0 ? t : 0) + r.left), y: n.pageY - (((s = i && i.scrollY) !== null && s !== void 0 ? s : 0) + r.top) };
}
class q {
  constructor(e) {
    this.lastTouch_ = null, this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this), this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this), this.onMouseDown_ = this.onMouseDown_.bind(this), this.onTouchEnd_ = this.onTouchEnd_.bind(this), this.onTouchMove_ = this.onTouchMove_.bind(this), this.onTouchStart_ = this.onTouchStart_.bind(this), this.elem_ = e, this.emitter = new k(), e.addEventListener("touchstart", this.onTouchStart_, { passive: false }), e.addEventListener("touchmove", this.onTouchMove_, { passive: true }), e.addEventListener("touchend", this.onTouchEnd_), e.addEventListener("mousedown", this.onMouseDown_);
  }
  computePosition_(e) {
    const t = this.elem_.getBoundingClientRect();
    return { bounds: { width: t.width, height: t.height }, point: e ? { x: e.x, y: e.y } : null };
  }
  onMouseDown_(e) {
    var t;
    e.preventDefault(), (t = e.currentTarget) === null || t === void 0 || t.focus();
    const s = this.elem_.ownerDocument;
    s.addEventListener("mousemove", this.onDocumentMouseMove_), s.addEventListener("mouseup", this.onDocumentMouseUp_), this.emitter.emit("down", { altKey: e.altKey, data: this.computePosition_(Ke(e, this.elem_)), sender: this, shiftKey: e.shiftKey });
  }
  onDocumentMouseMove_(e) {
    this.emitter.emit("move", { altKey: e.altKey, data: this.computePosition_(Ke(e, this.elem_)), sender: this, shiftKey: e.shiftKey });
  }
  onDocumentMouseUp_(e) {
    const t = this.elem_.ownerDocument;
    t.removeEventListener("mousemove", this.onDocumentMouseMove_), t.removeEventListener("mouseup", this.onDocumentMouseUp_), this.emitter.emit("up", { altKey: e.altKey, data: this.computePosition_(Ke(e, this.elem_)), sender: this, shiftKey: e.shiftKey });
  }
  onTouchStart_(e) {
    e.preventDefault();
    const t = e.targetTouches.item(0), s = this.elem_.getBoundingClientRect();
    this.emitter.emit("down", { altKey: e.altKey, data: this.computePosition_(t ? { x: t.clientX - s.left, y: t.clientY - s.top } : void 0), sender: this, shiftKey: e.shiftKey }), this.lastTouch_ = t;
  }
  onTouchMove_(e) {
    const t = e.targetTouches.item(0), s = this.elem_.getBoundingClientRect();
    this.emitter.emit("move", { altKey: e.altKey, data: this.computePosition_(t ? { x: t.clientX - s.left, y: t.clientY - s.top } : void 0), sender: this, shiftKey: e.shiftKey }), this.lastTouch_ = t;
  }
  onTouchEnd_(e) {
    var t;
    const s = (t = e.targetTouches.item(0)) !== null && t !== void 0 ? t : this.lastTouch_, i = this.elem_.getBoundingClientRect();
    this.emitter.emit("up", { altKey: e.altKey, data: this.computePosition_(s ? { x: s.clientX - i.left, y: s.clientY - i.top } : void 0), sender: this, shiftKey: e.shiftKey });
  }
}
const V = p("txt");
class xi {
  constructor(e, t) {
    this.onChange_ = this.onChange_.bind(this), this.props_ = t.props, this.props_.emitter.on("change", this.onChange_), this.element = e.createElement("div"), this.element.classList.add(V(), V(void 0, "num")), t.arrayPosition && this.element.classList.add(V(void 0, t.arrayPosition)), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("input");
    s.classList.add(V("i")), s.type = "text", t.viewProps.bindDisabled(s), this.element.appendChild(s), this.inputElement = s, this.onDraggingChange_ = this.onDraggingChange_.bind(this), this.dragging_ = t.dragging, this.dragging_.emitter.on("change", this.onDraggingChange_), this.element.classList.add(V()), this.inputElement.classList.add(V("i"));
    const i = e.createElement("div");
    i.classList.add(V("k")), this.element.appendChild(i), this.knobElement = i;
    const r = e.createElementNS(x, "svg");
    r.classList.add(V("g")), this.knobElement.appendChild(r);
    const o = e.createElementNS(x, "path");
    o.classList.add(V("gb")), r.appendChild(o), this.guideBodyElem_ = o;
    const a = e.createElementNS(x, "path");
    a.classList.add(V("gh")), r.appendChild(a), this.guideHeadElem_ = a;
    const u = e.createElement("div");
    u.classList.add(p("tt")()), this.knobElement.appendChild(u), this.tooltipElem_ = u, t.value.emitter.on("change", this.onChange_), this.value = t.value, this.refresh();
  }
  onDraggingChange_(e) {
    if (e.rawValue === null) {
      this.element.classList.remove(V(void 0, "drg"));
      return;
    }
    this.element.classList.add(V(void 0, "drg"));
    const t = e.rawValue / this.props_.get("pointerScale"), s = t + (t > 0 ? -1 : t < 0 ? 1 : 0), i = _(-s, -4, 4);
    this.guideHeadElem_.setAttributeNS(null, "d", [`M ${s + i},0 L${s},4 L${s + i},8`, `M ${t},-1 L${t},9`].join(" ")), this.guideBodyElem_.setAttributeNS(null, "d", `M 0,4 L${t},4`);
    const r = this.props_.get("formatter");
    this.tooltipElem_.textContent = r(this.value.rawValue), this.tooltipElem_.style.left = `${t}px`;
  }
  refresh() {
    const e = this.props_.get("formatter");
    this.inputElement.value = e(this.value.rawValue);
  }
  onChange_() {
    this.refresh();
  }
}
class re {
  constructor(e, t) {
    var s;
    this.originRawValue_ = 0, this.onInputChange_ = this.onInputChange_.bind(this), this.onInputKeyDown_ = this.onInputKeyDown_.bind(this), this.onInputKeyUp_ = this.onInputKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.parser_ = t.parser, this.props = t.props, this.sliderProps_ = (s = t.sliderProps) !== null && s !== void 0 ? s : null, this.value = t.value, this.viewProps = t.viewProps, this.dragging_ = f(null), this.view = new xi(e, { arrayPosition: t.arrayPosition, dragging: this.dragging_, props: this.props, value: this.value, viewProps: this.viewProps }), this.view.inputElement.addEventListener("change", this.onInputChange_), this.view.inputElement.addEventListener("keydown", this.onInputKeyDown_), this.view.inputElement.addEventListener("keyup", this.onInputKeyUp_);
    const i = new q(this.view.knobElement);
    i.emitter.on("down", this.onPointerDown_), i.emitter.on("move", this.onPointerMove_), i.emitter.on("up", this.onPointerUp_);
  }
  constrainValue_(e) {
    var t, s;
    const i = (t = this.sliderProps_) === null || t === void 0 ? void 0 : t.get("min"), r = (s = this.sliderProps_) === null || s === void 0 ? void 0 : s.get("max");
    let o = e;
    return i !== void 0 && (o = Math.max(o, i)), r !== void 0 && (o = Math.min(o, r)), o;
  }
  onInputChange_(e) {
    const s = e.currentTarget.value, i = this.parser_(s);
    w(i) || (this.value.rawValue = this.constrainValue_(i)), this.view.refresh();
  }
  onInputKeyDown_(e) {
    const t = E(this.props.get("keyScale"), de(e));
    t !== 0 && this.value.setRawValue(this.constrainValue_(this.value.rawValue + t), { forceEmit: false, last: false });
  }
  onInputKeyUp_(e) {
    E(this.props.get("keyScale"), de(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
  onPointerDown_() {
    this.originRawValue_ = this.value.rawValue, this.dragging_.rawValue = 0;
  }
  computeDraggingValue_(e) {
    if (!e.point) return null;
    const t = e.point.x - e.bounds.width / 2;
    return this.constrainValue_(this.originRawValue_ + t * this.props.get("pointerScale"));
  }
  onPointerMove_(e) {
    const t = this.computeDraggingValue_(e.data);
    t !== null && (this.value.setRawValue(t, { forceEmit: false, last: false }), this.dragging_.rawValue = this.value.rawValue - this.originRawValue_);
  }
  onPointerUp_(e) {
    const t = this.computeDraggingValue_(e.data);
    t !== null && (this.value.setRawValue(t, { forceEmit: true, last: true }), this.dragging_.rawValue = null);
  }
}
const $e = p("sld");
class ki {
  constructor(e, t) {
    this.onChange_ = this.onChange_.bind(this), this.props_ = t.props, this.props_.emitter.on("change", this.onChange_), this.element = e.createElement("div"), this.element.classList.add($e()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add($e("t")), t.viewProps.bindTabIndex(s), this.element.appendChild(s), this.trackElement = s;
    const i = e.createElement("div");
    i.classList.add($e("k")), this.trackElement.appendChild(i), this.knobElement = i, t.value.emitter.on("change", this.onChange_), this.value = t.value, this.update_();
  }
  update_() {
    const e = _(v(this.value.rawValue, this.props_.get("min"), this.props_.get("max"), 0, 100), 0, 100);
    this.knobElement.style.width = `${e}%`;
  }
  onChange_() {
    this.update_();
  }
}
class Vi {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.props = t.props, this.view = new ki(e, { props: this.props, value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new q(this.view.trackElement), this.ptHandler_.emitter.on("down", this.onPointerDownOrMove_), this.ptHandler_.emitter.on("move", this.onPointerDownOrMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.trackElement.addEventListener("keydown", this.onKeyDown_), this.view.trackElement.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    e.point && this.value.setRawValue(v(_(e.point.x, 0, e.bounds.width), 0, e.bounds.width, this.props.get("min"), this.props.get("max")), t);
  }
  onPointerDownOrMove_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: true, last: true });
  }
  onKeyDown_(e) {
    const t = E(this.props.get("keyScale"), I(e));
    t !== 0 && this.value.setRawValue(this.value.rawValue + t, { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    E(this.props.get("keyScale"), I(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
const Ue = p("sldtxt");
class Si {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(Ue());
    const s = e.createElement("div");
    s.classList.add(Ue("s")), this.sliderView_ = t.sliderView, s.appendChild(this.sliderView_.element), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(Ue("t")), this.textView_ = t.textView, i.appendChild(this.textView_.element), this.element.appendChild(i);
  }
}
class Ut {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.sliderC_ = new Vi(e, { props: t.sliderProps, value: t.value, viewProps: this.viewProps }), this.textC_ = new re(e, { parser: t.parser, props: t.textProps, sliderProps: t.sliderProps, value: t.value, viewProps: t.viewProps }), this.view = new Si(e, { sliderView: this.sliderC_.view, textView: this.textC_.view });
  }
  get sliderController() {
    return this.sliderC_;
  }
  get textController() {
    return this.textC_;
  }
  importProps(e) {
    return O(e, null, (t) => ({ max: t.required.number, min: t.required.number }), (t) => {
      const s = this.sliderC_.props;
      return s.set("max", t.max), s.set("min", t.min), true;
    });
  }
  exportProps() {
    const e = this.sliderC_.props;
    return D(null, { max: e.get("max"), min: e.get("min") });
  }
}
function Li(n) {
  return { sliderProps: new d({ keyScale: n.keyScale, max: n.max, min: n.min }), textProps: new d({ formatter: f(n.formatter), keyScale: n.keyScale, pointerScale: f(n.pointerScale) }) };
}
const Mi = { containerUnitSize: "cnt-usz" };
function fn(n) {
  return `--${Mi[n]}`;
}
function me(n) {
  return Me(n);
}
function U(n) {
  if (Ye(n)) return b(n, me);
}
function j(n, e) {
  if (!n) return;
  const t = [], s = it(n, e);
  s && t.push(s);
  const i = rt(n);
  return i && t.push(i), new se(t);
}
function bn(n) {
  if (n === "inline" || n === "popup") return n;
}
function X(n, e) {
  n.write(e);
}
const be = p("ckb");
class Ai {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.element = e.createElement("div"), this.element.classList.add(be()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("label");
    s.classList.add(be("l")), this.element.appendChild(s);
    const i = e.createElement("input");
    i.classList.add(be("i")), i.type = "checkbox", s.appendChild(i), this.inputElement = i, t.viewProps.bindDisabled(this.inputElement);
    const r = e.createElement("div");
    r.classList.add(be("w")), s.appendChild(r);
    const o = Re(e, "check");
    r.appendChild(o), t.value.emitter.on("change", this.onValueChange_), this.value = t.value, this.update_();
  }
  update_() {
    this.inputElement.checked = this.value.rawValue;
  }
  onValueChange_() {
    this.update_();
  }
}
class Ri {
  constructor(e, t) {
    this.onInputChange_ = this.onInputChange_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new Ai(e, { value: this.value, viewProps: this.viewProps }), this.view.inputElement.addEventListener("change", this.onInputChange_);
  }
  onInputChange_(e) {
    const t = e.currentTarget;
    this.value.rawValue = t.checked;
  }
}
function Oi(n) {
  const e = [], t = wt(n.options);
  return t && e.push(t), new se(e);
}
C({ id: "input-bool", type: "input", accept: (n, e) => {
  if (typeof n != "boolean") return null;
  const t = b(e, (s) => ({ options: s.optional.custom(De), readonly: s.optional.constant(false) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => vn, constraint: (n) => Oi(n.params), writer: (n) => X }, controller: (n) => {
  const e = n.document, t = n.value, s = n.constraint, i = s && xe(s, Oe);
  return i ? new ee(e, { props: new d({ options: i.values.value("options") }), value: t, viewProps: n.viewProps }) : new Ri(e, { value: t, viewProps: n.viewProps });
}, api(n) {
  return typeof n.controller.value.rawValue != "boolean" ? null : n.controller.valueController instanceof ee ? new vt(n.controller) : null;
} });
const z = p("col");
class Di {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(z()), t.foldable.bindExpandedClass(this.element, z(void 0, "expanded")), A(t.foldable, "completed", ne(this.element, z(void 0, "cpl")));
    const s = e.createElement("div");
    s.classList.add(z("h")), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(z("s")), s.appendChild(i), this.swatchElement = i;
    const r = e.createElement("div");
    if (r.classList.add(z("t")), s.appendChild(r), this.textElement = r, t.pickerLayout === "inline") {
      const o = e.createElement("div");
      o.classList.add(z("p")), this.element.appendChild(o), this.pickerElement = o;
    } else this.pickerElement = null;
  }
}
function Ti(n, e, t) {
  const s = _(n / 255, 0, 1), i = _(e / 255, 0, 1), r = _(t / 255, 0, 1), o = Math.max(s, i, r), a = Math.min(s, i, r), u = o - a;
  let l = 0, c = 0;
  const h = (a + o) / 2;
  return u !== 0 && (c = u / (1 - Math.abs(o + a - 1)), s === o ? l = (i - r) / u : i === o ? l = 2 + (r - s) / u : l = 4 + (s - i) / u, l = l / 6 + (l < 0 ? 1 : 0)), [l * 360, c * 100, h * 100];
}
function ji(n, e, t) {
  const s = (n % 360 + 360) % 360, i = _(e / 100, 0, 1), r = _(t / 100, 0, 1), o = (1 - Math.abs(2 * r - 1)) * i, a = o * (1 - Math.abs(s / 60 % 2 - 1)), u = r - o / 2;
  let l, c, h;
  return s >= 0 && s < 60 ? [l, c, h] = [o, a, 0] : s >= 60 && s < 120 ? [l, c, h] = [a, o, 0] : s >= 120 && s < 180 ? [l, c, h] = [0, o, a] : s >= 180 && s < 240 ? [l, c, h] = [0, a, o] : s >= 240 && s < 300 ? [l, c, h] = [a, 0, o] : [l, c, h] = [o, 0, a], [(l + u) * 255, (c + u) * 255, (h + u) * 255];
}
function Ni(n, e, t) {
  const s = _(n / 255, 0, 1), i = _(e / 255, 0, 1), r = _(t / 255, 0, 1), o = Math.max(s, i, r), a = Math.min(s, i, r), u = o - a;
  let l;
  u === 0 ? l = 0 : o === s ? l = 60 * (((i - r) / u % 6 + 6) % 6) : o === i ? l = 60 * ((r - s) / u + 2) : l = 60 * ((s - i) / u + 4);
  const c = o === 0 ? 0 : u / o, h = o;
  return [l, c * 100, h * 100];
}
function Cn(n, e, t) {
  const s = sn(n, 360), i = _(e / 100, 0, 1), r = _(t / 100, 0, 1), o = r * i, a = o * (1 - Math.abs(s / 60 % 2 - 1)), u = r - o;
  let l, c, h;
  return s >= 0 && s < 60 ? [l, c, h] = [o, a, 0] : s >= 60 && s < 120 ? [l, c, h] = [a, o, 0] : s >= 120 && s < 180 ? [l, c, h] = [0, o, a] : s >= 180 && s < 240 ? [l, c, h] = [0, a, o] : s >= 240 && s < 300 ? [l, c, h] = [a, 0, o] : [l, c, h] = [o, 0, a], [(l + u) * 255, (c + u) * 255, (h + u) * 255];
}
function Ii(n, e, t) {
  const s = t + e * (100 - Math.abs(2 * t - 100)) / 200;
  return [n, s !== 0 ? e * (100 - Math.abs(2 * t - 100)) / s : 0, t + e * (100 - Math.abs(2 * t - 100)) / 200];
}
function Fi(n, e, t) {
  const s = 100 - Math.abs(t * (200 - e) / 100 - 100);
  return [n, s !== 0 ? e * t / s : 0, t * (200 - e) / 200];
}
function R(n) {
  return [n[0], n[1], n[2]];
}
function Te(n, e) {
  return [n[0], n[1], n[2], e];
}
const Bi = { hsl: { hsl: (n, e, t) => [n, e, t], hsv: Ii, rgb: ji }, hsv: { hsl: Fi, hsv: (n, e, t) => [n, e, t], rgb: Cn }, rgb: { hsl: Ti, hsv: Ni, rgb: (n, e, t) => [n, e, t] } };
function te(n, e) {
  return [e === "float" ? 1 : n === "rgb" ? 255 : 360, e === "float" ? 1 : n === "rgb" ? 255 : 100, e === "float" ? 1 : n === "rgb" ? 255 : 100];
}
function Ki(n, e) {
  return n === e ? e : sn(n, e);
}
function gn(n, e, t) {
  var s;
  const i = te(e, t);
  return [e === "rgb" ? _(n[0], 0, i[0]) : Ki(n[0], i[0]), _(n[1], 0, i[1]), _(n[2], 0, i[2]), _((s = n[3]) !== null && s !== void 0 ? s : 1, 0, 1)];
}
function Ht(n, e, t, s) {
  const i = te(e, t), r = te(e, s);
  return n.map((o, a) => o / i[a] * r[a]);
}
function Pn(n, e, t) {
  const s = Ht(n, e.mode, e.type, "int"), i = Bi[e.mode][t.mode](...s);
  return Ht(i, t.mode, "int", t.type);
}
class m {
  static black() {
    return new m([0, 0, 0], "rgb");
  }
  constructor(e, t) {
    this.type = "int", this.mode = t, this.comps_ = gn(e, t, this.type);
  }
  getComponents(e) {
    return Te(Pn(R(this.comps_), { mode: this.mode, type: this.type }, { mode: e ?? this.mode, type: this.type }), this.comps_[3]);
  }
  toRgbaObject() {
    const e = this.getComponents("rgb");
    return { r: e[0], g: e[1], b: e[2], a: e[3] };
  }
}
const B = p("colp");
class $i {
  constructor(e, t) {
    this.alphaViews_ = null, this.element = e.createElement("div"), this.element.classList.add(B()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(B("hsv"));
    const i = e.createElement("div");
    i.classList.add(B("sv")), this.svPaletteView_ = t.svPaletteView, i.appendChild(this.svPaletteView_.element), s.appendChild(i);
    const r = e.createElement("div");
    r.classList.add(B("h")), this.hPaletteView_ = t.hPaletteView, r.appendChild(this.hPaletteView_.element), s.appendChild(r), this.element.appendChild(s);
    const o = e.createElement("div");
    if (o.classList.add(B("rgb")), this.textsView_ = t.textsView, o.appendChild(this.textsView_.element), this.element.appendChild(o), t.alphaViews) {
      this.alphaViews_ = { palette: t.alphaViews.palette, text: t.alphaViews.text };
      const a = e.createElement("div");
      a.classList.add(B("a"));
      const u = e.createElement("div");
      u.classList.add(B("ap")), u.appendChild(this.alphaViews_.palette.element), a.appendChild(u);
      const l = e.createElement("div");
      l.classList.add(B("at")), l.appendChild(this.alphaViews_.text.element), a.appendChild(l), this.element.appendChild(a);
    }
  }
  get allFocusableElements() {
    const e = [this.svPaletteView_.element, this.hPaletteView_.element, this.textsView_.modeSelectElement, ...this.textsView_.inputViews.map((t) => t.inputElement)];
    return this.alphaViews_ && e.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement), e;
  }
}
function Ui(n) {
  return n === "int" ? "int" : n === "float" ? "float" : void 0;
}
function ft(n) {
  return b(n, (e) => ({ color: e.optional.object({ alpha: e.optional.boolean, type: e.optional.custom(Ui) }), expanded: e.optional.boolean, picker: e.optional.custom(bn), readonly: e.optional.constant(false) }));
}
function Y(n) {
  return n ? 0.1 : 1;
}
function En(n) {
  var e;
  return (e = n.color) === null || e === void 0 ? void 0 : e.type;
}
class bt {
  constructor(e, t) {
    this.type = "float", this.mode = t, this.comps_ = gn(e, t, this.type);
  }
  getComponents(e) {
    return Te(Pn(R(this.comps_), { mode: this.mode, type: this.type }, { mode: e ?? this.mode, type: this.type }), this.comps_[3]);
  }
  toRgbaObject() {
    const e = this.getComponents("rgb");
    return { r: e[0], g: e[1], b: e[2], a: e[3] };
  }
}
const Hi = { int: (n, e) => new m(n, e), float: (n, e) => new bt(n, e) };
function Ct(n, e, t) {
  return Hi[t](n, e);
}
function qi(n) {
  return n.type === "float";
}
function zi(n) {
  return n.type === "int";
}
function Gi(n) {
  const e = n.getComponents(), t = te(n.mode, "int");
  return new m([Math.round(v(e[0], 0, 1, 0, t[0])), Math.round(v(e[1], 0, 1, 0, t[1])), Math.round(v(e[2], 0, 1, 0, t[2])), e[3]], n.mode);
}
function Yi(n) {
  const e = n.getComponents(), t = te(n.mode, "int");
  return new bt([v(e[0], 0, t[0], 0, 1), v(e[1], 0, t[1], 0, 1), v(e[2], 0, t[2], 0, 1), e[3]], n.mode);
}
function P(n, e) {
  if (n.type === e) return n;
  if (zi(n) && e === "float") return Yi(n);
  if (qi(n) && e === "int") return Gi(n);
  throw y.shouldNeverHappen();
}
function Xi(n, e) {
  return n.alpha === e.alpha && n.mode === e.mode && n.notation === e.notation && n.type === e.type;
}
function S(n, e) {
  const t = n.match(/^(.+)%$/);
  return Math.min(t ? parseFloat(t[1]) * 0.01 * e : parseFloat(n), e);
}
const Wi = { deg: (n) => n, grad: (n) => n * 360 / 400, rad: (n) => n * 360 / (2 * Math.PI), turn: (n) => n * 360 };
function yn(n) {
  const e = n.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
  if (!e) return parseFloat(n);
  const t = parseFloat(e[1]), s = e[2];
  return Wi[s](t);
}
function xn(n) {
  const e = n.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [S(e[1], 255), S(e[2], 255), S(e[3], 255)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) ? null : t;
}
function Ji(n) {
  const e = xn(n);
  return e ? new m(e, "rgb") : null;
}
function kn(n) {
  const e = n.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [S(e[1], 255), S(e[2], 255), S(e[3], 255), S(e[4], 1)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]) ? null : t;
}
function Zi(n) {
  const e = kn(n);
  return e ? new m(e, "rgb") : null;
}
function Vn(n) {
  const e = n.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [yn(e[1]), S(e[2], 100), S(e[3], 100)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) ? null : t;
}
function Qi(n) {
  const e = Vn(n);
  return e ? new m(e, "hsl") : null;
}
function Sn(n) {
  const e = n.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [yn(e[1]), S(e[2], 100), S(e[3], 100), S(e[4], 1)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]) ? null : t;
}
function er(n) {
  const e = Sn(n);
  return e ? new m(e, "hsl") : null;
}
function Ln(n) {
  const e = n.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
  if (e) return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)];
  const t = n.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
  return t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : null;
}
function tr(n) {
  const e = Ln(n);
  return e ? new m(e, "rgb") : null;
}
function Mn(n) {
  const e = n.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
  if (e) return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16), v(parseInt(e[4] + e[4], 16), 0, 255, 0, 1)];
  const t = n.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
  return t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16), v(parseInt(t[4], 16), 0, 255, 0, 1)] : null;
}
function nr(n) {
  const e = Mn(n);
  return e ? new m(e, "rgb") : null;
}
function An(n) {
  const e = n.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
  if (!e) return null;
  const t = [parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3])];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) ? null : t;
}
function sr(n) {
  return (e) => {
    const t = An(e);
    return t ? Ct(t, "rgb", n) : null;
  };
}
function Rn(n) {
  const e = n.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
  if (!e) return null;
  const t = [parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]), parseFloat(e[4])];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]) ? null : t;
}
function ir(n) {
  return (e) => {
    const t = Rn(e);
    return t ? Ct(t, "rgb", n) : null;
  };
}
const rr = [{ parser: Ln, result: { alpha: false, mode: "rgb", notation: "hex" } }, { parser: Mn, result: { alpha: true, mode: "rgb", notation: "hex" } }, { parser: xn, result: { alpha: false, mode: "rgb", notation: "func" } }, { parser: kn, result: { alpha: true, mode: "rgb", notation: "func" } }, { parser: Vn, result: { alpha: false, mode: "hsl", notation: "func" } }, { parser: Sn, result: { alpha: true, mode: "hsl", notation: "func" } }, { parser: An, result: { alpha: false, mode: "rgb", notation: "object" } }, { parser: Rn, result: { alpha: true, mode: "rgb", notation: "object" } }];
function or(n) {
  return rr.reduce((e, { parser: t, result: s }) => e || (t(n) ? s : null), null);
}
function ar(n, e = "int") {
  const t = or(n);
  return t ? t.notation === "hex" && e !== "float" ? Object.assign(Object.assign({}, t), { type: "int" }) : t.notation === "func" ? Object.assign(Object.assign({}, t), { type: e }) : null : null;
}
function _e(n) {
  const e = [tr, nr, Ji, Zi, Qi, er];
  e.push(sr("int"), ir("int"));
  const t = Pi(e);
  return (s) => {
    const i = t(s);
    return i ? P(i, n) : null;
  };
}
function lr(n) {
  const e = _e("int");
  if (typeof n != "string") return m.black();
  const t = e(n);
  return t ?? m.black();
}
function On(n) {
  const e = _(Math.floor(n), 0, 255).toString(16);
  return e.length === 1 ? `0${e}` : e;
}
function gt(n, e = "#") {
  const t = R(n.getComponents("rgb")).map(On).join("");
  return `${e}${t}`;
}
function Pt(n, e = "#") {
  const t = n.getComponents("rgb"), s = [t[0], t[1], t[2], t[3] * 255].map(On).join("");
  return `${e}${s}`;
}
function Dn(n) {
  const e = g(0), t = P(n, "int");
  return `rgb(${R(t.getComponents("rgb")).map((i) => e(i)).join(", ")})`;
}
function ge(n) {
  const e = g(2), t = g(0);
  return `rgba(${P(n, "int").getComponents("rgb").map((r, o) => (o === 3 ? e : t)(r)).join(", ")})`;
}
function ur(n) {
  const e = [g(0), ke, ke], t = P(n, "int");
  return `hsl(${R(t.getComponents("hsl")).map((i, r) => e[r](i)).join(", ")})`;
}
function hr(n) {
  const e = [g(0), ke, ke, g(2)];
  return `hsla(${P(n, "int").getComponents("hsl").map((i, r) => e[r](i)).join(", ")})`;
}
function Tn(n, e) {
  const t = g(e === "float" ? 2 : 0), s = ["r", "g", "b"], i = P(n, e);
  return `{${R(i.getComponents("rgb")).map((o, a) => `${s[a]}: ${t(o)}`).join(", ")}}`;
}
function cr(n) {
  return (e) => Tn(e, n);
}
function jn(n, e) {
  const t = g(2), s = g(e === "float" ? 2 : 0), i = ["r", "g", "b", "a"];
  return `{${P(n, e).getComponents("rgb").map((a, u) => {
    const l = u === 3 ? t : s;
    return `${i[u]}: ${l(a)}`;
  }).join(", ")}}`;
}
function pr(n) {
  return (e) => jn(e, n);
}
const dr = [{ format: { alpha: false, mode: "rgb", notation: "hex", type: "int" }, stringifier: gt }, { format: { alpha: true, mode: "rgb", notation: "hex", type: "int" }, stringifier: Pt }, { format: { alpha: false, mode: "rgb", notation: "func", type: "int" }, stringifier: Dn }, { format: { alpha: true, mode: "rgb", notation: "func", type: "int" }, stringifier: ge }, { format: { alpha: false, mode: "hsl", notation: "func", type: "int" }, stringifier: ur }, { format: { alpha: true, mode: "hsl", notation: "func", type: "int" }, stringifier: hr }, ...["int", "float"].reduce((n, e) => [...n, { format: { alpha: false, mode: "rgb", notation: "object", type: e }, stringifier: cr(e) }, { format: { alpha: true, mode: "rgb", notation: "object", type: e }, stringifier: pr(e) }], [])];
function Nn(n) {
  return dr.reduce((e, t) => e || (Xi(t.format, n) ? t.stringifier : null), null);
}
const ue = p("apl");
class mr {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.value = t.value, this.value.emitter.on("change", this.onValueChange_), this.element = e.createElement("div"), this.element.classList.add(ue()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("div");
    s.classList.add(ue("b")), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(ue("c")), s.appendChild(i), this.colorElem_ = i;
    const r = e.createElement("div");
    r.classList.add(ue("m")), this.element.appendChild(r), this.markerElem_ = r;
    const o = e.createElement("div");
    o.classList.add(ue("p")), this.markerElem_.appendChild(o), this.previewElem_ = o, this.update_();
  }
  update_() {
    const e = this.value.rawValue, t = e.getComponents("rgb"), s = new m([t[0], t[1], t[2], 0], "rgb"), i = new m([t[0], t[1], t[2], 255], "rgb"), r = ["to right", ge(s), ge(i)];
    this.colorElem_.style.background = `linear-gradient(${r.join(",")})`, this.previewElem_.style.backgroundColor = ge(e);
    const o = v(t[3], 0, 1, 0, 100);
    this.markerElem_.style.left = `${o}%`;
  }
  onValueChange_() {
    this.update_();
  }
}
class vr {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new mr(e, { value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new q(this.view.element), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = e.point.x / e.bounds.width, i = this.value.rawValue, [r, o, a] = i.getComponents("hsv");
    this.value.setRawValue(new m([r, o, a, s], "hsv"), t);
  }
  onPointerDown_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerMove_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: true, last: true });
  }
  onKeyDown_(e) {
    const t = E(Y(true), I(e));
    if (t === 0) return;
    const s = this.value.rawValue, [i, r, o, a] = s.getComponents("hsv");
    this.value.setRawValue(new m([i, r, o, a + t], "hsv"), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    E(Y(true), I(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
const W = p("coltxt");
function wr(n) {
  const e = n.createElement("select"), t = [{ text: "RGB", value: "rgb" }, { text: "HSL", value: "hsl" }, { text: "HSV", value: "hsv" }, { text: "HEX", value: "hex" }];
  return e.appendChild(t.reduce((s, i) => {
    const r = n.createElement("option");
    return r.textContent = i.text, r.value = i.value, s.appendChild(r), s;
  }, n.createDocumentFragment())), e;
}
class _r {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(W()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(W("m")), this.modeElem_ = wr(e), this.modeElem_.classList.add(W("ms")), s.appendChild(this.modeSelectElement), t.viewProps.bindDisabled(this.modeElem_);
    const i = e.createElement("div");
    i.classList.add(W("mm")), i.appendChild(Re(e, "dropdown")), s.appendChild(i), this.element.appendChild(s);
    const r = e.createElement("div");
    r.classList.add(W("w")), this.element.appendChild(r), this.inputsElem_ = r, this.inputViews_ = t.inputViews, this.applyInputViews_(), N(t.mode, (o) => {
      this.modeElem_.value = o;
    });
  }
  get modeSelectElement() {
    return this.modeElem_;
  }
  get inputViews() {
    return this.inputViews_;
  }
  set inputViews(e) {
    this.inputViews_ = e, this.applyInputViews_();
  }
  applyInputViews_() {
    ln(this.inputsElem_);
    const e = this.element.ownerDocument;
    this.inputViews_.forEach((t) => {
      const s = e.createElement("div");
      s.classList.add(W("c")), s.appendChild(t.element), this.inputsElem_.appendChild(s);
    });
  }
}
function fr(n) {
  return g(n === "float" ? 2 : 0);
}
function br(n, e, t) {
  const s = te(n, e)[t];
  return new Ve({ min: 0, max: s });
}
function Cr(n, e, t) {
  return new re(n, { arrayPosition: t === 0 ? "fst" : t === 2 ? "lst" : "mid", parser: e.parser, props: d.fromObject({ formatter: fr(e.colorType), keyScale: Y(false), pointerScale: e.colorType === "float" ? 0.01 : 1 }), value: f(0, { constraint: br(e.colorMode, e.colorType, t) }), viewProps: e.viewProps });
}
function gr(n, e) {
  const t = { colorMode: e.colorMode, colorType: e.colorType, parser: M, viewProps: e.viewProps };
  return [0, 1, 2].map((s) => {
    const i = Cr(n, t, s);
    return ie({ primary: e.value, secondary: i.value, forward(r) {
      return P(r, e.colorType).getComponents(e.colorMode)[s];
    }, backward(r, o) {
      const a = e.colorMode, l = P(r, e.colorType).getComponents(a);
      l[s] = o;
      const c = Ct(Te(R(l), l[3]), a, e.colorType);
      return P(c, "int");
    } }), i;
  });
}
function Pr(n, e) {
  const t = new _t(n, { parser: _e("int"), props: d.fromObject({ formatter: gt }), value: f(m.black()), viewProps: e.viewProps });
  return ie({ primary: e.value, secondary: t.value, forward: (s) => new m(R(s.getComponents()), s.mode), backward: (s, i) => new m(Te(R(i.getComponents(s.mode)), s.getComponents()[3]), s.mode) }), [t];
}
function Er(n) {
  return n !== "hex";
}
class yr {
  constructor(e, t) {
    this.onModeSelectChange_ = this.onModeSelectChange_.bind(this), this.colorType_ = t.colorType, this.value = t.value, this.viewProps = t.viewProps, this.colorMode = f(this.value.rawValue.mode), this.ccs_ = this.createComponentControllers_(e), this.view = new _r(e, { mode: this.colorMode, inputViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view], viewProps: this.viewProps }), this.view.modeSelectElement.addEventListener("change", this.onModeSelectChange_);
  }
  createComponentControllers_(e) {
    const t = this.colorMode.rawValue;
    return Er(t) ? gr(e, { colorMode: t, colorType: this.colorType_, value: this.value, viewProps: this.viewProps }) : Pr(e, { value: this.value, viewProps: this.viewProps });
  }
  onModeSelectChange_(e) {
    const t = e.currentTarget;
    this.colorMode.rawValue = t.value, this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument), this.view.inputViews = this.ccs_.map((s) => s.view);
  }
}
const He = p("hpl");
class xr {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.value = t.value, this.value.emitter.on("change", this.onValueChange_), this.element = e.createElement("div"), this.element.classList.add(He()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("div");
    s.classList.add(He("c")), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(He("m")), this.element.appendChild(i), this.markerElem_ = i, this.update_();
  }
  update_() {
    const e = this.value.rawValue, [t] = e.getComponents("hsv");
    this.markerElem_.style.backgroundColor = Dn(new m([t, 100, 100], "hsv"));
    const s = v(t, 0, 360, 0, 100);
    this.markerElem_.style.left = `${s}%`;
  }
  onValueChange_() {
    this.update_();
  }
}
class kr {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new xr(e, { value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new q(this.view.element), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = v(_(e.point.x, 0, e.bounds.width), 0, e.bounds.width, 0, 360), i = this.value.rawValue, [, r, o, a] = i.getComponents("hsv");
    this.value.setRawValue(new m([s, r, o, a], "hsv"), t);
  }
  onPointerDown_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerMove_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: true, last: true });
  }
  onKeyDown_(e) {
    const t = E(Y(false), I(e));
    if (t === 0) return;
    const s = this.value.rawValue, [i, r, o, a] = s.getComponents("hsv");
    this.value.setRawValue(new m([i + t, r, o, a], "hsv"), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    E(Y(false), I(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
const qe = p("svp"), qt = 64;
class Vr {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.value = t.value, this.value.emitter.on("change", this.onValueChange_), this.element = e.createElement("div"), this.element.classList.add(qe()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("canvas");
    s.height = qt, s.width = qt, s.classList.add(qe("c")), this.element.appendChild(s), this.canvasElement = s;
    const i = e.createElement("div");
    i.classList.add(qe("m")), this.element.appendChild(i), this.markerElem_ = i, this.update_();
  }
  update_() {
    const e = Ns(this.canvasElement);
    if (!e) return;
    const s = this.value.rawValue.getComponents("hsv"), i = this.canvasElement.width, r = this.canvasElement.height, o = e.getImageData(0, 0, i, r), a = o.data;
    for (let c = 0; c < r; c++) for (let h = 0; h < i; h++) {
      const F = v(h, 0, i, 0, 100), Ne = v(c, 0, r, 100, 0), Ie = Cn(s[0], F, Ne), fe = (c * i + h) * 4;
      a[fe] = Ie[0], a[fe + 1] = Ie[1], a[fe + 2] = Ie[2], a[fe + 3] = 255;
    }
    e.putImageData(o, 0, 0);
    const u = v(s[1], 0, 100, 0, 100);
    this.markerElem_.style.left = `${u}%`;
    const l = v(s[2], 0, 100, 100, 0);
    this.markerElem_.style.top = `${l}%`;
  }
  onValueChange_() {
    this.update_();
  }
}
class Sr {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new Vr(e, { value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new q(this.view.element), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = v(e.point.x, 0, e.bounds.width, 0, 100), i = v(e.point.y, 0, e.bounds.height, 100, 0), [r, , , o] = this.value.rawValue.getComponents("hsv");
    this.value.setRawValue(new m([r, s, i, o], "hsv"), t);
  }
  onPointerDown_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerMove_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: true, last: true });
  }
  onKeyDown_(e) {
    _n(e.key) && e.preventDefault();
    const [t, s, i, r] = this.value.rawValue.getComponents("hsv"), o = Y(false), a = E(o, I(e)), u = E(o, de(e));
    a === 0 && u === 0 || this.value.setRawValue(new m([t, s + a, i + u, r], "hsv"), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    const t = Y(false), s = E(t, I(e)), i = E(t, de(e));
    s === 0 && i === 0 || this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
class Lr {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.hPaletteC_ = new kr(e, { value: this.value, viewProps: this.viewProps }), this.svPaletteC_ = new Sr(e, { value: this.value, viewProps: this.viewProps }), this.alphaIcs_ = t.supportsAlpha ? { palette: new vr(e, { value: this.value, viewProps: this.viewProps }), text: new re(e, { parser: M, props: d.fromObject({ pointerScale: 0.01, keyScale: 0.1, formatter: g(2) }), value: f(0, { constraint: new Ve({ min: 0, max: 1 }) }), viewProps: this.viewProps }) } : null, this.alphaIcs_ && ie({ primary: this.value, secondary: this.alphaIcs_.text.value, forward: (s) => s.getComponents()[3], backward: (s, i) => {
      const r = s.getComponents();
      return r[3] = i, new m(r, s.mode);
    } }), this.textsC_ = new yr(e, { colorType: t.colorType, value: this.value, viewProps: this.viewProps }), this.view = new $i(e, { alphaViews: this.alphaIcs_ ? { palette: this.alphaIcs_.palette.view, text: this.alphaIcs_.text.view } : null, hPaletteView: this.hPaletteC_.view, supportsAlpha: t.supportsAlpha, svPaletteView: this.svPaletteC_.view, textsView: this.textsC_.view, viewProps: this.viewProps });
  }
  get textsController() {
    return this.textsC_;
  }
}
const ze = p("colsw");
class Mr {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), t.value.emitter.on("change", this.onValueChange_), this.value = t.value, this.element = e.createElement("div"), this.element.classList.add(ze()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(ze("sw")), this.element.appendChild(s), this.swatchElem_ = s;
    const i = e.createElement("button");
    i.classList.add(ze("b")), t.viewProps.bindDisabled(i), this.element.appendChild(i), this.buttonElement = i, this.update_();
  }
  update_() {
    const e = this.value.rawValue;
    this.swatchElem_.style.backgroundColor = Pt(e);
  }
  onValueChange_() {
    this.update_();
  }
}
class Ar {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new Mr(e, { value: this.value, viewProps: this.viewProps });
  }
}
class Et {
  constructor(e, t) {
    this.onButtonBlur_ = this.onButtonBlur_.bind(this), this.onButtonClick_ = this.onButtonClick_.bind(this), this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this), this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.foldable_ = ve.create(t.expanded), this.swatchC_ = new Ar(e, { value: this.value, viewProps: this.viewProps });
    const s = this.swatchC_.view.buttonElement;
    s.addEventListener("blur", this.onButtonBlur_), s.addEventListener("click", this.onButtonClick_), this.textC_ = new _t(e, { parser: t.parser, props: d.fromObject({ formatter: t.formatter }), value: this.value, viewProps: this.viewProps }), this.view = new Di(e, { foldable: this.foldable_, pickerLayout: t.pickerLayout }), this.view.swatchElement.appendChild(this.swatchC_.view.element), this.view.textElement.appendChild(this.textC_.view.element), this.popC_ = t.pickerLayout === "popup" ? new mn(e, { viewProps: this.viewProps }) : null;
    const i = new Lr(e, { colorType: t.colorType, supportsAlpha: t.supportsAlpha, value: this.value, viewProps: this.viewProps });
    i.view.allFocusableElements.forEach((r) => {
      r.addEventListener("blur", this.onPopupChildBlur_), r.addEventListener("keydown", this.onPopupChildKeydown_);
    }), this.pickerC_ = i, this.popC_ ? (this.view.element.appendChild(this.popC_.view.element), this.popC_.view.element.appendChild(i.view.element), ie({ primary: this.foldable_.value("expanded"), secondary: this.popC_.shows, forward: (r) => r, backward: (r, o) => o })) : this.view.pickerElement && (this.view.pickerElement.appendChild(this.pickerC_.view.element), mt(this.foldable_, this.view.pickerElement));
  }
  get textController() {
    return this.textC_;
  }
  onButtonBlur_(e) {
    if (!this.popC_) return;
    const t = this.view.element, s = e.relatedTarget;
    (!s || !t.contains(s)) && (this.popC_.shows.rawValue = false);
  }
  onButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded")), this.foldable_.get("expanded") && this.pickerC_.view.allFocusableElements[0].focus();
  }
  onPopupChildBlur_(e) {
    if (!this.popC_) return;
    const t = this.popC_.view.element, s = un(e);
    s && t.contains(s) || s && s === this.swatchC_.view.buttonElement && !ut(t.ownerDocument) || (this.popC_.shows.rawValue = false);
  }
  onPopupChildKeydown_(e) {
    this.popC_ ? e.key === "Escape" && (this.popC_.shows.rawValue = false) : this.view.pickerElement && e.key === "Escape" && this.swatchC_.view.buttonElement.focus();
  }
}
function Rr(n) {
  return R(n.getComponents("rgb")).reduce((e, t) => e << 8 | Math.floor(t) & 255, 0);
}
function Or(n) {
  return n.getComponents("rgb").reduce((e, t, s) => {
    const i = Math.floor(s === 3 ? t * 255 : t) & 255;
    return e << 8 | i;
  }, 0) >>> 0;
}
function Dr(n) {
  return new m([n >> 16 & 255, n >> 8 & 255, n & 255], "rgb");
}
function Tr(n) {
  return new m([n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, v(n & 255, 0, 255, 0, 1)], "rgb");
}
function jr(n) {
  return typeof n != "number" ? m.black() : Dr(n);
}
function Nr(n) {
  return typeof n != "number" ? m.black() : Tr(n);
}
function Pe(n, e) {
  return typeof n != "object" || w(n) ? false : e in n && typeof n[e] == "number";
}
function In(n) {
  return Pe(n, "r") && Pe(n, "g") && Pe(n, "b");
}
function Fn(n) {
  return In(n) && Pe(n, "a");
}
function Bn(n) {
  return In(n);
}
function yt(n, e) {
  if (n.mode !== e.mode || n.type !== e.type) return false;
  const t = n.getComponents(), s = e.getComponents();
  for (let i = 0; i < t.length; i++) if (t[i] !== s[i]) return false;
  return true;
}
function zt(n) {
  return "a" in n ? [n.r, n.g, n.b, n.a] : [n.r, n.g, n.b];
}
function Ir(n) {
  const e = Nn(n);
  return e ? (t, s) => {
    X(t, e(s));
  } : null;
}
function Fr(n) {
  const e = n ? Or : Rr;
  return (t, s) => {
    X(t, e(s));
  };
}
function Br(n, e, t) {
  const i = P(e, t).toRgbaObject();
  n.writeProperty("r", i.r), n.writeProperty("g", i.g), n.writeProperty("b", i.b), n.writeProperty("a", i.a);
}
function Kr(n, e, t) {
  const i = P(e, t).toRgbaObject();
  n.writeProperty("r", i.r), n.writeProperty("g", i.g), n.writeProperty("b", i.b);
}
function $r(n, e) {
  return (t, s) => {
    n ? Br(t, s, e) : Kr(t, s, e);
  };
}
function Ur(n) {
  var e;
  return !!(!((e = n == null ? void 0 : n.color) === null || e === void 0) && e.alpha);
}
function Hr(n) {
  return n ? (e) => Pt(e, "0x") : (e) => gt(e, "0x");
}
function qr(n) {
  return "color" in n || n.view === "color";
}
C({ id: "input-color-number", type: "input", accept: (n, e) => {
  if (typeof n != "number" || !qr(e)) return null;
  const t = ft(e);
  return t ? { initialValue: n, params: Object.assign(Object.assign({}, t), { supportsAlpha: Ur(e) }) } : null;
}, binding: { reader: (n) => n.params.supportsAlpha ? Nr : jr, equals: yt, writer: (n) => Fr(n.params.supportsAlpha) }, controller: (n) => {
  var e, t;
  return new Et(n.document, { colorType: "int", expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, formatter: Hr(n.params.supportsAlpha), parser: _e("int"), pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", supportsAlpha: n.params.supportsAlpha, value: n.value, viewProps: n.viewProps });
} });
function zr(n, e) {
  if (!Bn(n)) return P(m.black(), e);
  if (e === "int") {
    const t = zt(n);
    return new m(t, "rgb");
  }
  if (e === "float") {
    const t = zt(n);
    return new bt(t, "rgb");
  }
  return P(m.black(), "int");
}
function Gr(n) {
  return Fn(n);
}
function Yr(n) {
  return (e) => {
    const t = zr(e, n);
    return P(t, "int");
  };
}
function Xr(n, e) {
  return (t) => n ? jn(t, e) : Tn(t, e);
}
C({ id: "input-color-object", type: "input", accept: (n, e) => {
  var t;
  if (!Bn(n)) return null;
  const s = ft(e);
  return s ? { initialValue: n, params: Object.assign(Object.assign({}, s), { colorType: (t = En(e)) !== null && t !== void 0 ? t : "int" }) } : null;
}, binding: { reader: (n) => Yr(n.params.colorType), equals: yt, writer: (n) => $r(Gr(n.initialValue), n.params.colorType) }, controller: (n) => {
  var e, t;
  const s = Fn(n.initialValue);
  return new Et(n.document, { colorType: n.params.colorType, expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, formatter: Xr(s, n.params.colorType), parser: _e("int"), pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", supportsAlpha: s, value: n.value, viewProps: n.viewProps });
} });
C({ id: "input-color-string", type: "input", accept: (n, e) => {
  if (typeof n != "string" || e.view === "text") return null;
  const t = ar(n, En(e));
  if (!t) return null;
  const s = Nn(t);
  if (!s) return null;
  const i = ft(e);
  return i ? { initialValue: n, params: Object.assign(Object.assign({}, i), { format: t, stringifier: s }) } : null;
}, binding: { reader: () => lr, equals: yt, writer: (n) => {
  const e = Ir(n.params.format);
  if (!e) throw y.notBindable();
  return e;
} }, controller: (n) => {
  var e, t;
  return new Et(n.document, { colorType: n.params.format.type, expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, formatter: n.params.stringifier, parser: _e("int"), pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", supportsAlpha: n.params.format.alpha, value: n.value, viewProps: n.viewProps });
} });
class xt {
  constructor(e) {
    this.components = e.components, this.asm_ = e.assembly;
  }
  constrain(e) {
    const t = this.asm_.toComponents(e).map((s, i) => {
      var r, o;
      return (o = (r = this.components[i]) === null || r === void 0 ? void 0 : r.constrain(s)) !== null && o !== void 0 ? o : s;
    });
    return this.asm_.fromComponents(t);
  }
}
const Gt = p("pndtxt");
class Wr {
  constructor(e, t) {
    this.textViews = t.textViews, this.element = e.createElement("div"), this.element.classList.add(Gt()), this.textViews.forEach((s) => {
      const i = e.createElement("div");
      i.classList.add(Gt("a")), i.appendChild(s.element), this.element.appendChild(i);
    });
  }
}
function Jr(n, e, t) {
  return new re(n, { arrayPosition: t === 0 ? "fst" : t === e.axes.length - 1 ? "lst" : "mid", parser: e.parser, props: e.axes[t].textProps, value: f(0, { constraint: e.axes[t].constraint }), viewProps: e.viewProps });
}
class kt {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.acs_ = t.axes.map((s, i) => Jr(e, t, i)), this.acs_.forEach((s, i) => {
      ie({ primary: this.value, secondary: s.value, forward: (r) => t.assembly.toComponents(r)[i], backward: (r, o) => {
        const a = t.assembly.toComponents(r);
        return a[i] = o, t.assembly.fromComponents(a);
      } });
    }), this.view = new Wr(e, { textViews: this.acs_.map((s) => s.view) });
  }
  get textControllers() {
    return this.acs_;
  }
}
class Zr extends lt {
  get max() {
    return this.controller.valueController.sliderController.props.get("max");
  }
  set max(e) {
    this.controller.valueController.sliderController.props.set("max", e);
  }
  get min() {
    return this.controller.valueController.sliderController.props.get("min");
  }
  set min(e) {
    this.controller.valueController.sliderController.props.set("min", e);
  }
}
function Qr(n, e) {
  const t = [], s = it(n, e);
  s && t.push(s);
  const i = rt(n);
  i && t.push(i);
  const r = wt(n.options);
  return r && t.push(r), new se(t);
}
C({ id: "input-number", type: "input", accept: (n, e) => {
  if (typeof n != "number") return null;
  const t = b(e, (s) => Object.assign(Object.assign({}, Me(s)), { options: s.optional.custom(De), readonly: s.optional.constant(false) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => Se, constraint: (n) => Qr(n.params, n.initialValue), writer: (n) => X }, controller: (n) => {
  const e = n.value, t = n.constraint, s = t && xe(t, Oe);
  if (s) return new ee(n.document, { props: new d({ options: s.values.value("options") }), value: e, viewProps: n.viewProps });
  const i = Le(n.params, e.rawValue), r = t && xe(t, Ve);
  return r ? new Ut(n.document, Object.assign(Object.assign({}, Li(Object.assign(Object.assign({}, i), { keyScale: f(i.keyScale), max: r.values.value("max"), min: r.values.value("min") }))), { parser: M, value: e, viewProps: n.viewProps })) : new re(n.document, { parser: M, props: d.fromObject(i), value: e, viewProps: n.viewProps });
}, api(n) {
  return typeof n.controller.value.rawValue != "number" ? null : n.controller.valueController instanceof Ut ? new Zr(n.controller) : n.controller.valueController instanceof ee ? new vt(n.controller) : null;
} });
class H {
  constructor(e = 0, t = 0) {
    this.x = e, this.y = t;
  }
  getComponents() {
    return [this.x, this.y];
  }
  static isObject(e) {
    if (w(e)) return false;
    const t = e.x, s = e.y;
    return !(typeof t != "number" || typeof s != "number");
  }
  static equals(e, t) {
    return e.x === t.x && e.y === t.y;
  }
  toObject() {
    return { x: this.x, y: this.y };
  }
}
const Kn = { toComponents: (n) => n.getComponents(), fromComponents: (n) => new H(...n) }, J = p("p2d");
class eo {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(J()), t.viewProps.bindClassModifiers(this.element), N(t.expanded, ne(this.element, J(void 0, "expanded")));
    const s = e.createElement("div");
    s.classList.add(J("h")), this.element.appendChild(s);
    const i = e.createElement("button");
    i.classList.add(J("b")), i.appendChild(Re(e, "p2dpad")), t.viewProps.bindDisabled(i), s.appendChild(i), this.buttonElement = i;
    const r = e.createElement("div");
    if (r.classList.add(J("t")), s.appendChild(r), this.textElement = r, t.pickerLayout === "inline") {
      const o = e.createElement("div");
      o.classList.add(J("p")), this.element.appendChild(o), this.pickerElement = o;
    } else this.pickerElement = null;
  }
}
const K = p("p2dp");
class to {
  constructor(e, t) {
    this.onFoldableChange_ = this.onFoldableChange_.bind(this), this.onPropsChange_ = this.onPropsChange_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.props_ = t.props, this.props_.emitter.on("change", this.onPropsChange_), this.element = e.createElement("div"), this.element.classList.add(K()), t.layout === "popup" && this.element.classList.add(K(void 0, "p")), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(K("p")), t.viewProps.bindTabIndex(s), this.element.appendChild(s), this.padElement = s;
    const i = e.createElementNS(x, "svg");
    i.classList.add(K("g")), this.padElement.appendChild(i), this.svgElem_ = i;
    const r = e.createElementNS(x, "line");
    r.classList.add(K("ax")), r.setAttributeNS(null, "x1", "0"), r.setAttributeNS(null, "y1", "50%"), r.setAttributeNS(null, "x2", "100%"), r.setAttributeNS(null, "y2", "50%"), this.svgElem_.appendChild(r);
    const o = e.createElementNS(x, "line");
    o.classList.add(K("ax")), o.setAttributeNS(null, "x1", "50%"), o.setAttributeNS(null, "y1", "0"), o.setAttributeNS(null, "x2", "50%"), o.setAttributeNS(null, "y2", "100%"), this.svgElem_.appendChild(o);
    const a = e.createElementNS(x, "line");
    a.classList.add(K("l")), a.setAttributeNS(null, "x1", "50%"), a.setAttributeNS(null, "y1", "50%"), this.svgElem_.appendChild(a), this.lineElem_ = a;
    const u = e.createElement("div");
    u.classList.add(K("m")), this.padElement.appendChild(u), this.markerElem_ = u, t.value.emitter.on("change", this.onValueChange_), this.value = t.value, this.update_();
  }
  get allFocusableElements() {
    return [this.padElement];
  }
  update_() {
    const [e, t] = this.value.rawValue.getComponents(), s = this.props_.get("max"), i = v(e, -s, +s, 0, 100), r = v(t, -s, +s, 0, 100), o = this.props_.get("invertsY") ? 100 - r : r;
    this.lineElem_.setAttributeNS(null, "x2", `${i}%`), this.lineElem_.setAttributeNS(null, "y2", `${o}%`), this.markerElem_.style.left = `${i}%`, this.markerElem_.style.top = `${o}%`;
  }
  onValueChange_() {
    this.update_();
  }
  onPropsChange_() {
    this.update_();
  }
  onFoldableChange_() {
    this.update_();
  }
}
function Yt(n, e, t) {
  return [E(e[0], I(n)), E(e[1], de(n)) * (t ? 1 : -1)];
}
class no {
  constructor(e, t) {
    this.onPadKeyDown_ = this.onPadKeyDown_.bind(this), this.onPadKeyUp_ = this.onPadKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.view = new to(e, { layout: t.layout, props: this.props, value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new q(this.view.padElement), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.padElement.addEventListener("keydown", this.onPadKeyDown_), this.view.padElement.addEventListener("keyup", this.onPadKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = this.props.get("max"), i = v(e.point.x, 0, e.bounds.width, -s, +s), r = v(this.props.get("invertsY") ? e.bounds.height - e.point.y : e.point.y, 0, e.bounds.height, -s, +s);
    this.value.setRawValue(new H(i, r), t);
  }
  onPointerDown_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerMove_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: true, last: true });
  }
  onPadKeyDown_(e) {
    _n(e.key) && e.preventDefault();
    const [t, s] = Yt(e, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
    t === 0 && s === 0 || this.value.setRawValue(new H(this.value.rawValue.x + t, this.value.rawValue.y + s), { forceEmit: false, last: false });
  }
  onPadKeyUp_(e) {
    const [t, s] = Yt(e, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
    t === 0 && s === 0 || this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
class so {
  constructor(e, t) {
    var s, i;
    this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this), this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this), this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this), this.onPadButtonClick_ = this.onPadButtonClick_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.foldable_ = ve.create(t.expanded), this.popC_ = t.pickerLayout === "popup" ? new mn(e, { viewProps: this.viewProps }) : null;
    const r = new no(e, { layout: t.pickerLayout, props: new d({ invertsY: f(t.invertsY), max: f(t.max), xKeyScale: t.axes[0].textProps.value("keyScale"), yKeyScale: t.axes[1].textProps.value("keyScale") }), value: this.value, viewProps: this.viewProps });
    r.view.allFocusableElements.forEach((o) => {
      o.addEventListener("blur", this.onPopupChildBlur_), o.addEventListener("keydown", this.onPopupChildKeydown_);
    }), this.pickerC_ = r, this.textC_ = new kt(e, { assembly: Kn, axes: t.axes, parser: t.parser, value: this.value, viewProps: this.viewProps }), this.view = new eo(e, { expanded: this.foldable_.value("expanded"), pickerLayout: t.pickerLayout, viewProps: this.viewProps }), this.view.textElement.appendChild(this.textC_.view.element), (s = this.view.buttonElement) === null || s === void 0 || s.addEventListener("blur", this.onPadButtonBlur_), (i = this.view.buttonElement) === null || i === void 0 || i.addEventListener("click", this.onPadButtonClick_), this.popC_ ? (this.view.element.appendChild(this.popC_.view.element), this.popC_.view.element.appendChild(this.pickerC_.view.element), ie({ primary: this.foldable_.value("expanded"), secondary: this.popC_.shows, forward: (o) => o, backward: (o, a) => a })) : this.view.pickerElement && (this.view.pickerElement.appendChild(this.pickerC_.view.element), mt(this.foldable_, this.view.pickerElement));
  }
  get textController() {
    return this.textC_;
  }
  onPadButtonBlur_(e) {
    if (!this.popC_) return;
    const t = this.view.element, s = e.relatedTarget;
    (!s || !t.contains(s)) && (this.popC_.shows.rawValue = false);
  }
  onPadButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded")), this.foldable_.get("expanded") && this.pickerC_.view.allFocusableElements[0].focus();
  }
  onPopupChildBlur_(e) {
    if (!this.popC_) return;
    const t = this.popC_.view.element, s = un(e);
    s && t.contains(s) || s && s === this.view.buttonElement && !ut(t.ownerDocument) || (this.popC_.shows.rawValue = false);
  }
  onPopupChildKeydown_(e) {
    this.popC_ ? e.key === "Escape" && (this.popC_.shows.rawValue = false) : this.view.pickerElement && e.key === "Escape" && this.view.buttonElement.focus();
  }
}
function io(n) {
  return H.isObject(n) ? new H(n.x, n.y) : new H();
}
function ro(n, e) {
  n.writeProperty("x", e.x), n.writeProperty("y", e.y);
}
function oo(n, e) {
  return new xt({ assembly: Kn, components: [j(Object.assign(Object.assign({}, n), n.x), e.x), j(Object.assign(Object.assign({}, n), n.y), e.y)] });
}
function Xt(n, e) {
  var t, s;
  if (!w(n.min) || !w(n.max)) return Math.max(Math.abs((t = n.min) !== null && t !== void 0 ? t : 0), Math.abs((s = n.max) !== null && s !== void 0 ? s : 0));
  const i = rn(n);
  return Math.max(Math.abs(i) * 10, Math.abs(e) * 10);
}
function ao(n, e) {
  var t, s;
  const i = Xt(G(n, (t = n.x) !== null && t !== void 0 ? t : {}), e.x), r = Xt(G(n, (s = n.y) !== null && s !== void 0 ? s : {}), e.y);
  return Math.max(i, r);
}
function lo(n) {
  if (!("y" in n)) return false;
  const e = n.y;
  return e && "inverted" in e ? !!e.inverted : false;
}
C({ id: "input-point2d", type: "input", accept: (n, e) => {
  if (!H.isObject(n)) return null;
  const t = b(e, (s) => Object.assign(Object.assign({}, me(s)), { expanded: s.optional.boolean, picker: s.optional.custom(bn), readonly: s.optional.constant(false), x: s.optional.custom(U), y: s.optional.object(Object.assign(Object.assign({}, me(s)), { inverted: s.optional.boolean })) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: () => io, constraint: (n) => oo(n.params, n.initialValue), equals: H.equals, writer: () => ro }, controller: (n) => {
  var e, t;
  const s = n.document, i = n.value, r = n.constraint, o = [n.params.x, n.params.y];
  return new so(s, { axes: i.rawValue.getComponents().map((a, u) => {
    var l;
    return ot({ constraint: r.components[u], initialValue: a, params: G(n.params, (l = o[u]) !== null && l !== void 0 ? l : {}) });
  }), expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, invertsY: lo(n.params), max: ao(n.params, i.rawValue), parser: M, pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", value: i, viewProps: n.viewProps });
} });
class Z {
  constructor(e = 0, t = 0, s = 0) {
    this.x = e, this.y = t, this.z = s;
  }
  getComponents() {
    return [this.x, this.y, this.z];
  }
  static isObject(e) {
    if (w(e)) return false;
    const t = e.x, s = e.y, i = e.z;
    return !(typeof t != "number" || typeof s != "number" || typeof i != "number");
  }
  static equals(e, t) {
    return e.x === t.x && e.y === t.y && e.z === t.z;
  }
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }
}
const $n = { toComponents: (n) => n.getComponents(), fromComponents: (n) => new Z(...n) };
function uo(n) {
  return Z.isObject(n) ? new Z(n.x, n.y, n.z) : new Z();
}
function ho(n, e) {
  n.writeProperty("x", e.x), n.writeProperty("y", e.y), n.writeProperty("z", e.z);
}
function co(n, e) {
  return new xt({ assembly: $n, components: [j(Object.assign(Object.assign({}, n), n.x), e.x), j(Object.assign(Object.assign({}, n), n.y), e.y), j(Object.assign(Object.assign({}, n), n.z), e.z)] });
}
C({ id: "input-point3d", type: "input", accept: (n, e) => {
  if (!Z.isObject(n)) return null;
  const t = b(e, (s) => Object.assign(Object.assign({}, me(s)), { readonly: s.optional.constant(false), x: s.optional.custom(U), y: s.optional.custom(U), z: s.optional.custom(U) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => uo, constraint: (n) => co(n.params, n.initialValue), equals: Z.equals, writer: (n) => ho }, controller: (n) => {
  const e = n.value, t = n.constraint, s = [n.params.x, n.params.y, n.params.z];
  return new kt(n.document, { assembly: $n, axes: e.rawValue.getComponents().map((i, r) => {
    var o;
    return ot({ constraint: t.components[r], initialValue: i, params: G(n.params, (o = s[r]) !== null && o !== void 0 ? o : {}) });
  }), parser: M, value: e, viewProps: n.viewProps });
} });
class Q {
  constructor(e = 0, t = 0, s = 0, i = 0) {
    this.x = e, this.y = t, this.z = s, this.w = i;
  }
  getComponents() {
    return [this.x, this.y, this.z, this.w];
  }
  static isObject(e) {
    if (w(e)) return false;
    const t = e.x, s = e.y, i = e.z, r = e.w;
    return !(typeof t != "number" || typeof s != "number" || typeof i != "number" || typeof r != "number");
  }
  static equals(e, t) {
    return e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
  }
  toObject() {
    return { x: this.x, y: this.y, z: this.z, w: this.w };
  }
}
const Un = { toComponents: (n) => n.getComponents(), fromComponents: (n) => new Q(...n) };
function po(n) {
  return Q.isObject(n) ? new Q(n.x, n.y, n.z, n.w) : new Q();
}
function mo(n, e) {
  n.writeProperty("x", e.x), n.writeProperty("y", e.y), n.writeProperty("z", e.z), n.writeProperty("w", e.w);
}
function vo(n, e) {
  return new xt({ assembly: Un, components: [j(Object.assign(Object.assign({}, n), n.x), e.x), j(Object.assign(Object.assign({}, n), n.y), e.y), j(Object.assign(Object.assign({}, n), n.z), e.z), j(Object.assign(Object.assign({}, n), n.w), e.w)] });
}
C({ id: "input-point4d", type: "input", accept: (n, e) => {
  if (!Q.isObject(n)) return null;
  const t = b(e, (s) => Object.assign(Object.assign({}, me(s)), { readonly: s.optional.constant(false), w: s.optional.custom(U), x: s.optional.custom(U), y: s.optional.custom(U), z: s.optional.custom(U) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => po, constraint: (n) => vo(n.params, n.initialValue), equals: Q.equals, writer: (n) => mo }, controller: (n) => {
  const e = n.value, t = n.constraint, s = [n.params.x, n.params.y, n.params.z, n.params.w];
  return new kt(n.document, { assembly: Un, axes: e.rawValue.getComponents().map((i, r) => {
    var o;
    return ot({ constraint: t.components[r], initialValue: i, params: G(n.params, (o = s[r]) !== null && o !== void 0 ? o : {}) });
  }), parser: M, value: e, viewProps: n.viewProps });
} });
function wo(n) {
  const e = [], t = wt(n.options);
  return t && e.push(t), new se(e);
}
C({ id: "input-string", type: "input", accept: (n, e) => {
  if (typeof n != "string") return null;
  const t = b(e, (s) => ({ readonly: s.optional.constant(false), options: s.optional.custom(De) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => wn, constraint: (n) => wo(n.params), writer: (n) => X }, controller: (n) => {
  const e = n.document, t = n.value, s = n.constraint, i = s && xe(s, Oe);
  return i ? new ee(e, { props: new d({ options: i.values.value("options") }), value: t, viewProps: n.viewProps }) : new _t(e, { parser: (r) => r, props: d.fromObject({ formatter: Qe }), value: t, viewProps: n.viewProps });
}, api(n) {
  return typeof n.controller.value.rawValue != "string" ? null : n.controller.valueController instanceof ee ? new vt(n.controller) : null;
} });
const je = { monitor: { defaultRows: 3 } }, Wt = p("mll");
class _o {
  constructor(e, t) {
    this.onValueUpdate_ = this.onValueUpdate_.bind(this), this.formatter_ = t.formatter, this.element = e.createElement("div"), this.element.classList.add(Wt()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("textarea");
    s.classList.add(Wt("i")), s.style.height = `calc(var(${fn("containerUnitSize")}) * ${t.rows})`, s.readOnly = true, t.viewProps.bindDisabled(s), this.element.appendChild(s), this.textareaElem_ = s, t.value.emitter.on("change", this.onValueUpdate_), this.value = t.value, this.update_();
  }
  update_() {
    const e = this.textareaElem_, t = e.scrollTop === e.scrollHeight - e.clientHeight, s = [];
    this.value.rawValue.forEach((i) => {
      i !== void 0 && s.push(this.formatter_(i));
    }), e.textContent = s.join(`
`), t && (e.scrollTop = e.scrollHeight);
  }
  onValueUpdate_() {
    this.update_();
  }
}
class Vt {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new _o(e, { formatter: t.formatter, rows: t.rows, value: this.value, viewProps: this.viewProps });
  }
}
const Jt = p("sgl");
class fo {
  constructor(e, t) {
    this.onValueUpdate_ = this.onValueUpdate_.bind(this), this.formatter_ = t.formatter, this.element = e.createElement("div"), this.element.classList.add(Jt()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("input");
    s.classList.add(Jt("i")), s.readOnly = true, s.type = "text", t.viewProps.bindDisabled(s), this.element.appendChild(s), this.inputElement = s, t.value.emitter.on("change", this.onValueUpdate_), this.value = t.value, this.update_();
  }
  update_() {
    const e = this.value.rawValue, t = e[e.length - 1];
    this.inputElement.value = t !== void 0 ? this.formatter_(t) : "";
  }
  onValueUpdate_() {
    this.update_();
  }
}
class St {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new fo(e, { formatter: t.formatter, value: this.value, viewProps: this.viewProps });
  }
}
C({ id: "monitor-bool", type: "monitor", accept: (n, e) => {
  if (typeof n != "boolean") return null;
  const t = b(e, (s) => ({ readonly: s.required.constant(true), rows: s.optional.number }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => vn }, controller: (n) => {
  var e;
  return n.value.rawValue.length === 1 ? new St(n.document, { formatter: $t, value: n.value, viewProps: n.viewProps }) : new Vt(n.document, { formatter: $t, rows: (e = n.params.rows) !== null && e !== void 0 ? e : je.monitor.defaultRows, value: n.value, viewProps: n.viewProps });
} });
class bo extends lt {
  get max() {
    return this.controller.valueController.props.get("max");
  }
  set max(e) {
    this.controller.valueController.props.set("max", e);
  }
  get min() {
    return this.controller.valueController.props.get("min");
  }
  set min(e) {
    this.controller.valueController.props.set("min", e);
  }
}
const $ = p("grl");
class Co {
  constructor(e, t) {
    this.onCursorChange_ = this.onCursorChange_.bind(this), this.onValueUpdate_ = this.onValueUpdate_.bind(this), this.element = e.createElement("div"), this.element.classList.add($()), t.viewProps.bindClassModifiers(this.element), this.formatter_ = t.formatter, this.props_ = t.props, this.cursor_ = t.cursor, this.cursor_.emitter.on("change", this.onCursorChange_);
    const s = e.createElementNS(x, "svg");
    s.classList.add($("g")), s.style.height = `calc(var(${fn("containerUnitSize")}) * ${t.rows})`, this.element.appendChild(s), this.svgElem_ = s;
    const i = e.createElementNS(x, "polyline");
    this.svgElem_.appendChild(i), this.lineElem_ = i;
    const r = e.createElement("div");
    r.classList.add($("t"), p("tt")()), this.element.appendChild(r), this.tooltipElem_ = r, t.value.emitter.on("change", this.onValueUpdate_), this.value = t.value, this.update_();
  }
  get graphElement() {
    return this.svgElem_;
  }
  update_() {
    const e = this.svgElem_.getBoundingClientRect(), t = this.value.rawValue.length - 1, s = this.props_.get("min"), i = this.props_.get("max"), r = [];
    this.value.rawValue.forEach((c, h) => {
      if (c === void 0) return;
      const F = v(h, 0, t, 0, e.width), Ne = v(c, s, i, e.height, 0);
      r.push([F, Ne].join(","));
    }), this.lineElem_.setAttributeNS(null, "points", r.join(" "));
    const o = this.tooltipElem_, a = this.value.rawValue[this.cursor_.rawValue];
    if (a === void 0) {
      o.classList.remove($("t", "a"));
      return;
    }
    const u = v(this.cursor_.rawValue, 0, t, 0, e.width), l = v(a, s, i, e.height, 0);
    o.style.left = `${u}px`, o.style.top = `${l}px`, o.textContent = `${this.formatter_(a)}`, o.classList.contains($("t", "a")) || (o.classList.add($("t", "a"), $("t", "in")), ye(o), o.classList.remove($("t", "in")));
  }
  onValueUpdate_() {
    this.update_();
  }
  onCursorChange_() {
    this.update_();
  }
}
class Hn {
  constructor(e, t) {
    if (this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this), this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this), this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this), this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this), this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this), this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.cursor_ = f(-1), this.view = new Co(e, { cursor: this.cursor_, formatter: t.formatter, rows: t.rows, props: this.props, value: this.value, viewProps: this.viewProps }), !ut(e)) this.view.element.addEventListener("mousemove", this.onGraphMouseMove_), this.view.element.addEventListener("mouseleave", this.onGraphMouseLeave_);
    else {
      const s = new q(this.view.element);
      s.emitter.on("down", this.onGraphPointerDown_), s.emitter.on("move", this.onGraphPointerMove_), s.emitter.on("up", this.onGraphPointerUp_);
    }
  }
  importProps(e) {
    return O(e, null, (t) => ({ max: t.required.number, min: t.required.number }), (t) => (this.props.set("max", t.max), this.props.set("min", t.min), true));
  }
  exportProps() {
    return D(null, { max: this.props.get("max"), min: this.props.get("min") });
  }
  onGraphMouseLeave_() {
    this.cursor_.rawValue = -1;
  }
  onGraphMouseMove_(e) {
    const t = this.view.element.getBoundingClientRect();
    this.cursor_.rawValue = Math.floor(v(e.offsetX, 0, t.width, 0, this.value.rawValue.length));
  }
  onGraphPointerDown_(e) {
    this.onGraphPointerMove_(e);
  }
  onGraphPointerMove_(e) {
    if (!e.data.point) {
      this.cursor_.rawValue = -1;
      return;
    }
    this.cursor_.rawValue = Math.floor(v(e.data.point.x, 0, e.data.bounds.width, 0, this.value.rawValue.length));
  }
  onGraphPointerUp_() {
    this.cursor_.rawValue = -1;
  }
}
function et(n) {
  return w(n.format) ? g(2) : n.format;
}
function go(n) {
  var e;
  return n.value.rawValue.length === 1 ? new St(n.document, { formatter: et(n.params), value: n.value, viewProps: n.viewProps }) : new Vt(n.document, { formatter: et(n.params), rows: (e = n.params.rows) !== null && e !== void 0 ? e : je.monitor.defaultRows, value: n.value, viewProps: n.viewProps });
}
function Po(n) {
  var e, t, s;
  return new Hn(n.document, { formatter: et(n.params), rows: (e = n.params.rows) !== null && e !== void 0 ? e : je.monitor.defaultRows, props: d.fromObject({ max: (t = n.params.max) !== null && t !== void 0 ? t : 100, min: (s = n.params.min) !== null && s !== void 0 ? s : 0 }), value: n.value, viewProps: n.viewProps });
}
function Zt(n) {
  return n.view === "graph";
}
C({ id: "monitor-number", type: "monitor", accept: (n, e) => {
  if (typeof n != "number") return null;
  const t = b(e, (s) => ({ format: s.optional.function, max: s.optional.number, min: s.optional.number, readonly: s.required.constant(true), rows: s.optional.number, view: s.optional.string }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { defaultBufferSize: (n) => Zt(n) ? 64 : 1, reader: (n) => Se }, controller: (n) => Zt(n.params) ? Po(n) : go(n), api: (n) => n.controller.valueController instanceof Hn ? new bo(n.controller) : null });
C({ id: "monitor-string", type: "monitor", accept: (n, e) => {
  if (typeof n != "string") return null;
  const t = b(e, (s) => ({ multiline: s.optional.boolean, readonly: s.required.constant(true), rows: s.optional.number }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => wn }, controller: (n) => {
  var e;
  const t = n.value;
  return t.rawValue.length > 1 || n.params.multiline ? new Vt(n.document, { formatter: Qe, rows: (e = n.params.rows) !== null && e !== void 0 ? e : je.monitor.defaultRows, value: t, viewProps: n.viewProps }) : new St(n.document, { formatter: Qe, value: t, viewProps: n.viewProps });
} });
const L = p("ckr");
class Eo {
  constructor(e, t) {
    this.tickElems_ = [], this.labelElems_ = [], this.boundsWidth_ = -1, this.onShowsTooltipChange_ = this.onShowsTooltipChange_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.formatters_ = t.formatters, this.unit_ = t.unit, this.element = e.createElement("div"), this.element.classList.add(L(), L(void 0, `m${t.seriesId}`)), t.viewProps.bindClassModifiers(this.element), this.value_ = t.value, this.value_.emitter.on("change", this.onValueChange_), t.showsTooltip.emitter.on("change", this.onShowsTooltipChange_);
    const s = e.createElement("div");
    s.classList.add(L("w")), this.element.appendChild(s), this.offsetElem_ = e.createElement("div"), this.offsetElem_.classList.add(L("o")), s.appendChild(this.offsetElem_), this.svgElem_ = e.createElementNS(x, "svg"), this.svgElem_.classList.add(L("g")), this.offsetElem_.appendChild(this.svgElem_), this.tooltipElem_ = e.createElement("div"), this.tooltipElem_.classList.add(p("tt")(), L("tt")), this.element.appendChild(this.tooltipElem_), this.waitToBeAdded_();
  }
  waitToBeAdded_() {
    const e = new IntersectionObserver((t) => {
      t.forEach((s) => {
        s.target !== this.element || s.intersectionRatio === 0 || (this.update(), e.disconnect());
      });
    }, { root: null });
    e.observe(this.element);
  }
  rebuildScaleIfNeeded_(e) {
    if (this.boundsWidth_ === e) return;
    this.boundsWidth_ = e, this.tickElems_.forEach((l) => {
      pe(l);
    }), this.tickElems_ = [], this.labelElems_.forEach((l) => {
      pe(l);
    }), this.labelElems_ = [];
    const t = this.element.ownerDocument, s = this.unit_.ticks, i = this.unit_.pixels, a = ((Math.ceil(e / 2 / i) + 1) * 2 + 1) * s, u = i / s;
    for (let l = 0; l < a; l++) {
      const c = l * u;
      if (l % s === 0) {
        const h = t.createElementNS(x, "line");
        h.classList.add(L("mjt")), h.setAttributeNS(null, "x1", String(c)), h.setAttributeNS(null, "y1", "0"), h.setAttributeNS(null, "x2", String(c)), h.setAttributeNS(null, "y2", "2"), this.svgElem_.appendChild(h), this.tickElems_.push(h);
        const F = t.createElement("div");
        F.classList.add(L("l")), F.style.left = `${c}px`, this.offsetElem_.appendChild(F), this.labelElems_.push(F);
      } else {
        const h = t.createElementNS(x, "line");
        h.classList.add(L("mnt")), h.setAttributeNS(null, "x1", String(c)), h.setAttributeNS(null, "y1", "0"), h.setAttributeNS(null, "x2", String(c)), h.setAttributeNS(null, "y2", "2"), this.svgElem_.appendChild(h), this.tickElems_.push(h);
      }
    }
  }
  updateScale_(e) {
    const t = this.unit_.value, s = this.unit_.pixels, i = this.value_.rawValue, r = Math.ceil(e / 2 / s) + 1, o = i - i % t - t * r, a = (l) => 1 - Math.pow(_(Math.abs(i - l) / (e / 2 * (t / s)), 0, 1), 10);
    this.labelElems_.forEach((l, c) => {
      const h = o + c * t;
      l.textContent = this.formatters_.ring(h), l.style.opacity = String(a(h));
    });
    const u = this.unit_.ticks;
    this.tickElems_.forEach((l, c) => {
      const h = o + c / u * t;
      l.style.opacity = String(a(h));
    });
  }
  update() {
    const e = this.element.getBoundingClientRect().width, t = this.unit_.value, s = this.unit_.pixels, i = this.value_.rawValue, r = Math.ceil(e / 2 / s) + 1, o = (i % t + t * r) * (s / t), a = e / 2 - o;
    this.offsetElem_.style.transform = `translateX(${a}px)`, this.tooltipElem_.textContent = this.formatters_.text(i), this.rebuildScaleIfNeeded_(e), this.updateScale_(e);
  }
  onValueChange_() {
    this.update();
  }
  onShowsTooltipChange_(e) {
    e.rawValue ? this.element.classList.add(L(void 0, "tt")) : this.element.classList.remove(L(void 0, "tt"));
  }
}
class Lt {
  constructor(e, t) {
    this.ox_ = 0, this.ov_ = 0, this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.tooltipEnabled_ = t.tooltipEnabled, this.unit_ = t.unit, this.showsTooltip_ = f(false), this.view = new Eo(e, { formatters: t.formatters, seriesId: t.seriesId, showsTooltip: this.showsTooltip_, unit: t.unit, value: this.value, viewProps: this.viewProps });
    const s = new q(this.view.element);
    s.emitter.on("down", this.onPointerDown_), s.emitter.on("move", this.onPointerMove_), s.emitter.on("up", this.onPointerUp_);
  }
  onPointerDown_(e) {
    const t = e.data;
    t.point && (this.ox_ = t.point.x, this.ov_ = this.value.rawValue, this.tooltipEnabled_ && (this.showsTooltip_.rawValue = true));
  }
  onPointerMove_(e) {
    const t = e.data;
    if (!t.point) return;
    const s = t.point.x - this.ox_, i = this.unit_.pixels, r = this.unit_.value;
    this.value.setRawValue(this.ov_ - s / i * r, { forceEmit: false, last: false });
  }
  onPointerUp_() {
    this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true }), this.showsTooltip_.rawValue = false;
  }
}
const Ge = p("ckrtxt");
class yo {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(Ge());
    const s = e.createElement("div");
    s.classList.add(Ge("r")), s.appendChild(t.ringView.element), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(Ge("t")), i.appendChild(t.textView.element), this.element.appendChild(i);
  }
}
class qn {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.rc_ = new Lt(e, { formatters: { ring: t.ringFormatter, text: t.textProps.get("formatter") }, seriesId: t.seriesId, tooltipEnabled: false, unit: t.ringUnit, value: this.value, viewProps: this.viewProps }), this.tc_ = new re(e, { parser: t.parser, props: t.textProps, value: this.value, viewProps: this.viewProps }), this.view = new yo(e, { ringView: this.rc_.view, textView: this.tc_.view });
  }
}
function zn(n) {
  const e = [], t = rt(n);
  t && e.push(t);
  const s = it(n);
  return s && e.push(s), new se(e);
}
function xo(n) {
  return n === 0 || n === 1 || n === 2 ? n : void 0;
}
function Qt(n) {
  return n !== void 0 ? String(n) : "0";
}
function ko(n) {
  const e = g(Xe(n.value));
  return (t) => {
    const s = e(t), i = s.substr(0, 1);
    return s + (i === "-" || i === "+" ? " " : "");
  };
}
const Vo = C({ id: "input-ring", type: "input", accept(n, e) {
  if (typeof n != "number") return null;
  const t = b(e, (s) => Object.assign(Object.assign({}, Me(s)), { series: s.optional.custom(xo), unit: s.optional.object({ pixels: s.required.number, ticks: s.required.number, value: s.required.number }), view: s.required.constant("cameraring"), wide: s.optional.boolean }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => Se, constraint: (n) => zn(n.params), writer: (n) => X }, controller(n) {
  var e, t, s;
  const i = (e = n.params.unit) !== null && e !== void 0 ? e : { ticks: 5, pixels: 40, value: 10 }, r = ko(i), o = Le(n.params, n.initialValue);
  if (n.params.wide) return new Lt(n.document, { formatters: { ring: r, text: o.formatter }, seriesId: (t = Qt(n.params.series)) !== null && t !== void 0 ? t : "0", tooltipEnabled: true, unit: i, value: n.value, viewProps: n.viewProps });
  const a = d.fromObject(o);
  return new qn(n.document, { parser: M, ringFormatter: r, ringUnit: i, seriesId: (s = Qt(n.params.series)) !== null && s !== void 0 ? s : "0", textProps: a, value: n.value, viewProps: n.viewProps });
} }), So = C({ id: "input-wheel", type: "input", accept(n, e) {
  if (typeof n != "number") return null;
  const t = b(e, (s) => Object.assign(Object.assign({}, Me(s)), { amount: s.optional.number, view: s.required.constant("camerawheel"), wide: s.optional.boolean }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => Se, constraint: (n) => zn(n.params), writer: (n) => X }, controller(n) {
  var e, t;
  const s = g(0), i = Le(n.params, n.initialValue);
  return n.params.wide ? new Lt(n.document, { formatters: { ring: s, text: i.formatter }, seriesId: "w", tooltipEnabled: true, unit: { ticks: 10, pixels: 40, value: ((e = n.params.amount) !== null && e !== void 0 ? e : i.pointerScale) * 40 }, value: n.value, viewProps: n.viewProps }) : new qn(n.document, { parser: M, ringFormatter: s, ringUnit: { ticks: 10, pixels: 40, value: ((t = n.params.amount) !== null && t !== void 0 ? t : i.pointerScale) * 40 }, seriesId: "w", textProps: d.fromObject(i), value: n.value, viewProps: n.viewProps });
} }), Lo = "camerakit", Mo = '.tp-ckrv_w{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-ckrv_w{background-color:var(--in-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--cnt-usz);line-height:var(--cnt-usz);min-width:0;width:100%}.tp-ckrv_w:hover{background-color:var(--in-bg-h)}.tp-ckrv_w:focus{background-color:var(--in-bg-f)}.tp-ckrv_w:active{background-color:var(--in-bg-a)}.tp-ckrv_w:disabled{opacity:.5}.tp-ckrv{position:relative}.tp-ckrv.tp-v-disabled{opacity:.5}.tp-ckrv::before{background-color:var(--grv-fg);bottom:0;content:"";height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-ckrv::after{background-color:var(--in-fg);content:"";left:0;margin:auto;position:absolute;right:0}.tp-ckrv_w{cursor:pointer;height:calc(var(--cnt-usz));overflow:hidden}.tp-ckrv_o{height:100%;left:0;position:relative}.tp-ckrv_g{display:block;height:2px;overflow:visible;position:absolute;width:100%}.tp-ckrv_mjt{stroke:var(--in-fg);stroke-width:2;transform-origin:bottom}.tp-ckrv_mnt{stroke:var(--in-fg);stroke-width:1;transform-origin:bottom}.tp-ckrv_l{color:var(--in-fg);font-size:.9em;pointer-events:none;position:absolute;top:0;transform:translateX(-50%);white-space:pre}.tp-ckrv_tt{left:50%;top:-4px;visibility:hidden}.tp-ckrv.tp-ckrv-tt .tp-ckrv_tt{visibility:visible}.tp-ckrv.tp-ckrv-m0::before{display:none}.tp-ckrv.tp-ckrv-m0::after{bottom:0;height:6px;width:2px}.tp-ckrv.tp-ckrv-m0 .tp-ckrv_g{bottom:0;margin:auto;transform:translateY(3px);top:0}.tp-ckrv.tp-ckrv-m0 .tp-ckrv_mjt{transform:scaleY(3)}.tp-ckrv.tp-ckrv-m0 .tp-ckrv_mnt{transform:scaleY(2)}.tp-ckrv.tp-ckrv-m0 .tp-ckrv_l{line-height:8px;transform:translateX(-50%) scale(0.8)}.tp-ckrv.tp-ckrv-m1::before{display:none}.tp-ckrv.tp-ckrv-m1::after{bottom:0;height:8px;width:2px}.tp-ckrv.tp-ckrv-m1 .tp-ckrv_g{bottom:0}.tp-ckrv.tp-ckrv-m1 .tp-ckrv_mjt{stroke-width:1;transform:scaleY(4)}.tp-ckrv.tp-ckrv-m1 .tp-ckrv_mnt{transform:scaleY(2)}.tp-ckrv.tp-ckrv-m1 .tp-ckrv_l{line-height:12px}.tp-ckrv.tp-ckrv-m2::before{transform:translateY(3px)}.tp-ckrv.tp-ckrv-m2::after{border-radius:2px;bottom:1px;height:4px;width:4px}.tp-ckrv.tp-ckrv-m2 .tp-ckrv_g{display:none}.tp-ckrv.tp-ckrv-m2 .tp-ckrv_l{line-height:12px;transform:translateX(-50%)}.tp-ckrv.tp-ckrv-mw::before,.tp-ckrv.tp-ckrv-mw::after{display:none}.tp-ckrv.tp-ckrv-mw .tp-ckrv_g{bottom:0;opacity:.2}.tp-ckrv.tp-ckrv-mw .tp-ckrv_mjt,.tp-ckrv.tp-ckrv-mw .tp-ckrv_mnt{stroke:var(--in-fg);stroke-width:2;transform:scaleY(10)}.tp-ckrv.tp-ckrv-mw .tp-ckrv_l{display:none}.tp-ckrtxtv{display:flex}.tp-ckrtxtv_r{flex:2}.tp-ckrtxtv_t{flex:1;margin-left:4px}', Ao = [Vo, So];
export {
  Mo as css,
  Lo as id,
  Ao as plugins
};
