function w(n) {
  return n == null;
}
function ft(n) {
  return n !== null && typeof n == "object";
}
function ct(n) {
  return n !== null && typeof n == "object";
}
function gs(n, e) {
  if (n.length !== e.length) return false;
  for (let t = 0; t < n.length; t++) if (n[t] !== e[t]) return false;
  return true;
}
function Q(n, e) {
  return Array.from(/* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e)])).reduce((s, i) => {
    const r = n[i], o = e[i];
    return ct(r) && ct(o) ? Object.assign(Object.assign({}, s), { [i]: Q(r, o) }) : Object.assign(Object.assign({}, s), { [i]: i in e ? o : r });
  }, {});
}
function Ps(n) {
  return ft(n) ? "target" in n : false;
}
const Es = { alreadydisposed: () => "View has been already disposed", invalidparams: (n) => `Invalid parameters for '${n.name}'`, nomatchingcontroller: (n) => `No matching controller for '${n.key}'`, nomatchingview: (n) => `No matching view for '${JSON.stringify(n.params)}'`, notbindable: () => "Value is not bindable", notcompatible: (n) => `Not compatible with  plugin '${n.id}'`, propertynotfound: (n) => `Property '${n.name}' not found`, shouldneverhappen: () => "This error should never happen" };
class x {
  static alreadyDisposed() {
    return new x({ type: "alreadydisposed" });
  }
  static notBindable() {
    return new x({ type: "notbindable" });
  }
  static notCompatible(e, t) {
    return new x({ type: "notcompatible", context: { id: `${e}.${t}` } });
  }
  static propertyNotFound(e) {
    return new x({ type: "propertynotfound", context: { name: e } });
  }
  static shouldNeverHappen() {
    return new x({ type: "shouldneverhappen" });
  }
  constructor(e) {
    var t;
    this.message = (t = Es[e.type](e.context)) !== null && t !== void 0 ? t : "Unexpected error", this.name = this.constructor.name, this.stack = new Error(this.message).stack, this.type = e.type;
  }
  toString() {
    return this.message;
  }
}
class Ne {
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
    if (!Ne.isBindable(s)) throw x.notBindable();
    if (!(e in s)) throw x.propertyNotFound(e);
    s[e] = t;
  }
}
class y {
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
class ys {
  constructor(e, t) {
    var s;
    this.constraint_ = t == null ? void 0 : t.constraint, this.equals_ = (s = t == null ? void 0 : t.equals) !== null && s !== void 0 ? s : ((i, r) => i === r), this.emitter = new y(), this.rawValue_ = e;
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
class xs {
  constructor(e) {
    this.emitter = new y(), this.value_ = e;
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
class ks {
  constructor(e) {
    this.emitter = new y(), this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.value_ = e, this.value_.emitter.on("beforechange", this.onValueBeforeChange_), this.value_.emitter.on("change", this.onValueChange_);
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
function _(n, e) {
  const t = e == null ? void 0 : e.constraint, s = e == null ? void 0 : e.equals;
  return !t && !s ? new xs(n) : new ys(n, e);
}
function Vs(n) {
  return [new ks(n), (e, t) => {
    n.setRawValue(e, t);
  }];
}
class c {
  constructor(e) {
    this.emitter = new y(), this.valMap_ = e;
    for (const t in this.valMap_) this.valMap_[t].emitter.on("change", () => {
      this.emitter.emit("change", { key: t, sender: this });
    });
  }
  static createCore(e) {
    return Object.keys(e).reduce((s, i) => Object.assign(s, { [i]: _(e[i]) }), {});
  }
  static fromObject(e) {
    const t = this.createCore(e);
    return new c(t);
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
class ke {
  constructor(e) {
    this.values = c.fromObject({ max: e.max, min: e.min });
  }
  constrain(e) {
    const t = this.values.get("max"), s = this.values.get("min");
    return Math.min(Math.max(e, s), t);
  }
}
class Ct {
  constructor(e) {
    this.values = c.fromObject({ max: e.max, min: e.min });
  }
  constrain(e) {
    const t = this.values.get("max"), s = this.values.get("min");
    let i = e;
    return w(s) || (i = Math.max(i, s)), w(t) || (i = Math.min(i, t)), i;
  }
}
class Ls {
  constructor(e, t = 0) {
    this.step = e, this.origin = t;
  }
  constrain(e) {
    const t = this.origin % this.step, s = Math.round((e - t) / this.step);
    return t + s * this.step;
  }
}
class Ss {
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
const Ms = { "**": (n, e) => Math.pow(n, e), "*": (n, e) => n * e, "/": (n, e) => n / e, "%": (n, e) => n % e, "+": (n, e) => n + e, "-": (n, e) => n - e, "<<": (n, e) => n << e, ">>": (n, e) => n >> e, ">>>": (n, e) => n >>> e, "&": (n, e) => n & e, "^": (n, e) => n ^ e, "|": (n, e) => n | e };
class Ts {
  constructor(e, t, s) {
    this.left = t, this.operator = e, this.right = s;
  }
  evaluate() {
    const e = Ms[this.operator];
    if (!e) throw new Error(`unexpected binary operator: '${this.operator}`);
    return e(this.left.evaluate(), this.right.evaluate());
  }
  toString() {
    return ["b(", this.left.toString(), this.operator, this.right.toString(), ")"].join(" ");
  }
}
const As = { "+": (n) => n, "-": (n) => -n, "~": (n) => ~n };
class Os {
  constructor(e, t) {
    this.operator = e, this.expression = t;
  }
  evaluate() {
    const e = As[this.operator];
    if (!e) throw new Error(`unexpected unary operator: '${this.operator}`);
    return e(this.expression.evaluate());
  }
  toString() {
    return ["u(", this.operator, this.expression.toString(), ")"].join(" ");
  }
}
function gt(n) {
  return (e, t) => {
    for (let s = 0; s < n.length; s++) {
      const i = n[s](e, t);
      if (i !== "") return i;
    }
    return "";
  };
}
function Pe(n, e) {
  var t;
  const s = n.substr(e).match(/^\s+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function Ds(n, e) {
  const t = n.substr(e, 1);
  return t.match(/^[1-9]$/) ? t : "";
}
function Ee(n, e) {
  var t;
  const s = n.substr(e).match(/^[0-9]+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function Rs(n, e) {
  const t = Ee(n, e);
  if (t !== "") return t;
  const s = n.substr(e, 1);
  if (e += 1, s !== "-" && s !== "+") return "";
  const i = Ee(n, e);
  return i === "" ? "" : s + i;
}
function Pt(n, e) {
  const t = n.substr(e, 1);
  if (e += 1, t.toLowerCase() !== "e") return "";
  const s = Rs(n, e);
  return s === "" ? "" : t + s;
}
function Tn(n, e) {
  const t = n.substr(e, 1);
  if (t === "0") return t;
  const s = Ds(n, e);
  return e += s.length, s === "" ? "" : s + Ee(n, e);
}
function Ns(n, e) {
  const t = Tn(n, e);
  if (e += t.length, t === "") return "";
  const s = n.substr(e, 1);
  if (e += s.length, s !== ".") return "";
  const i = Ee(n, e);
  return e += i.length, t + s + i + Pt(n, e);
}
function js(n, e) {
  const t = n.substr(e, 1);
  if (e += t.length, t !== ".") return "";
  const s = Ee(n, e);
  return e += s.length, s === "" ? "" : t + s + Pt(n, e);
}
function Bs(n, e) {
  const t = Tn(n, e);
  return e += t.length, t === "" ? "" : t + Pt(n, e);
}
const Is = gt([Ns, js, Bs]);
function zs(n, e) {
  var t;
  const s = n.substr(e).match(/^[01]+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function Fs(n, e) {
  const t = n.substr(e, 2);
  if (e += t.length, t.toLowerCase() !== "0b") return "";
  const s = zs(n, e);
  return s === "" ? "" : t + s;
}
function $s(n, e) {
  var t;
  const s = n.substr(e).match(/^[0-7]+/);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function Ks(n, e) {
  const t = n.substr(e, 2);
  if (e += t.length, t.toLowerCase() !== "0o") return "";
  const s = $s(n, e);
  return s === "" ? "" : t + s;
}
function Us(n, e) {
  var t;
  const s = n.substr(e).match(/^[0-9a-f]+/i);
  return (t = s && s[0]) !== null && t !== void 0 ? t : "";
}
function Hs(n, e) {
  const t = n.substr(e, 2);
  if (e += t.length, t.toLowerCase() !== "0x") return "";
  const s = Us(n, e);
  return s === "" ? "" : t + s;
}
const qs = gt([Fs, Ks, Hs]), Gs = gt([qs, Is]);
function Ys(n, e) {
  const t = Gs(n, e);
  return e += t.length, t === "" ? null : { evaluable: new Ss(t), cursor: e };
}
function Xs(n, e) {
  const t = n.substr(e, 1);
  if (e += t.length, t !== "(") return null;
  const s = On(n, e);
  if (!s) return null;
  e = s.cursor, e += Pe(n, e).length;
  const i = n.substr(e, 1);
  return e += i.length, i !== ")" ? null : { evaluable: s.evaluable, cursor: e };
}
function Ws(n, e) {
  var t;
  return (t = Ys(n, e)) !== null && t !== void 0 ? t : Xs(n, e);
}
function An(n, e) {
  const t = Ws(n, e);
  if (t) return t;
  const s = n.substr(e, 1);
  if (e += s.length, s !== "+" && s !== "-" && s !== "~") return null;
  const i = An(n, e);
  return i ? (e = i.cursor, { cursor: e, evaluable: new Os(s, i.evaluable) }) : null;
}
function Js(n, e, t) {
  t += Pe(e, t).length;
  const s = n.filter((i) => e.startsWith(i, t))[0];
  return s ? (t += s.length, t += Pe(e, t).length, { cursor: t, operator: s }) : null;
}
function Zs(n, e) {
  return (t, s) => {
    const i = n(t, s);
    if (!i) return null;
    s = i.cursor;
    let r = i.evaluable;
    for (; ; ) {
      const o = Js(e, t, s);
      if (!o) break;
      s = o.cursor;
      const l = n(t, s);
      if (!l) return null;
      s = l.cursor, r = new Ts(o.operator, r, l.evaluable);
    }
    return r ? { cursor: s, evaluable: r } : null;
  };
}
const Qs = [["**"], ["*", "/", "%"], ["+", "-"], ["<<", ">>>", ">>"], ["&"], ["^"], ["|"]].reduce((n, e) => Zs(n, e), An);
function On(n, e) {
  return e += Pe(n, e).length, Qs(n, e);
}
function ei(n) {
  const e = On(n, 0);
  return !e || e.cursor + Pe(n, e.cursor).length !== n.length ? null : e.evaluable;
}
function O(n) {
  var e;
  const t = ei(n);
  return (e = t == null ? void 0 : t.evaluate()) !== null && e !== void 0 ? e : null;
}
function Et(n) {
  if (typeof n == "number") return n;
  if (typeof n == "string") {
    const e = O(n);
    if (!w(e)) return e;
  }
  return 0;
}
function E(n) {
  return (e) => e.toFixed(Math.max(Math.min(n, 20), 0));
}
function u(n, e, t, s, i) {
  const r = (n - e) / (t - e);
  return s + r * (i - s);
}
function Zt(n) {
  return String(n.toFixed(10)).split(".")[1].replace(/0+$/, "").length;
}
function b(n, e, t) {
  return Math.min(Math.max(n, e), t);
}
function Dn(n, e) {
  return (n % e + e) % e;
}
function ti(n, e) {
  return w(n.step) ? Math.max(Zt(e), 2) : Zt(n.step);
}
function Rn(n) {
  var e;
  return (e = n.step) !== null && e !== void 0 ? e : 1;
}
function ni(n, e) {
  var t;
  const s = Math.abs((t = n.step) !== null && t !== void 0 ? t : e);
  return s === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(s)) - 1);
}
function yt(n, e) {
  return w(n.step) ? null : new Ls(n.step, e);
}
function xt(n) {
  return !w(n.max) && !w(n.min) ? new ke({ max: n.max, min: n.min }) : !w(n.max) || !w(n.min) ? new Ct({ max: n.max, min: n.min }) : null;
}
function kt(n, e) {
  var t, s, i;
  return { formatter: (t = n.format) !== null && t !== void 0 ? t : E(ti(n, e)), keyScale: (s = n.keyScale) !== null && s !== void 0 ? s : Rn(n), pointerScale: (i = n.pointerScale) !== null && i !== void 0 ? i : ni(n, e) };
}
function Vt(n) {
  return { format: n.optional.function, keyScale: n.optional.number, max: n.optional.number, min: n.optional.number, pointerScale: n.optional.number, step: n.optional.number };
}
function Lt(n) {
  return { constraint: n.constraint, textProps: c.fromObject(kt(n.params, n.initialValue)) };
}
class se {
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
class ie {
  constructor(e) {
    this.target = e;
  }
}
class Fe extends ie {
  constructor(e, t, s) {
    super(e), this.value = t, this.last = s ?? true;
  }
}
class si extends ie {
  constructor(e, t) {
    super(e), this.expanded = t;
  }
}
class ii extends ie {
  constructor(e, t) {
    super(e), this.index = t;
  }
}
class St extends se {
  constructor(e) {
    super(e), this.onValueChange_ = this.onValueChange_.bind(this), this.emitter_ = new y(), this.controller.value.emitter.on("change", this.onValueChange_);
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
    this.emitter_.emit("change", new Fe(this, t.binding.target.read(), e.options.last));
  }
}
function ri(n, e) {
  const s = Object.keys(e).reduce((i, r) => {
    if (i === void 0) return;
    const o = e[r], l = o(n[r]);
    return l.succeeded ? Object.assign(Object.assign({}, i), { [r]: l.value }) : void 0;
  }, {});
  return s;
}
function oi(n, e) {
  return n.reduce((t, s) => {
    if (t === void 0) return;
    const i = e(s);
    if (!(!i.succeeded || i.value === void 0)) return [...t, i.value];
  }, []);
}
function li(n) {
  return n === null ? false : typeof n == "object";
}
function B(n) {
  return (e) => (t) => {
    if (!e && t === void 0) return { succeeded: false, value: void 0 };
    if (e && t === void 0) return { succeeded: true, value: void 0 };
    const s = n(t);
    return s !== void 0 ? { succeeded: true, value: s } : { succeeded: false, value: void 0 };
  };
}
function Qt(n) {
  return { custom: (e) => B(e)(n), boolean: B((e) => typeof e == "boolean" ? e : void 0)(n), number: B((e) => typeof e == "number" ? e : void 0)(n), string: B((e) => typeof e == "string" ? e : void 0)(n), function: B((e) => typeof e == "function" ? e : void 0)(n), constant: (e) => B((t) => t === e ? e : void 0)(n), raw: B((e) => e)(n), object: (e) => B((t) => {
    if (li(t)) return ri(t, e);
  })(n), array: (e) => B((t) => {
    if (Array.isArray(t)) return oi(t, e);
  })(n) };
}
const pt = { optional: Qt(true), required: Qt(false) };
function f(n, e) {
  const t = e(pt), s = pt.required.object(t)(n);
  return s.succeeded ? s.value : void 0;
}
function R(n, e, t, s) {
  if (e && !e(n)) return false;
  const i = f(n, t);
  return i ? s(i) : false;
}
function N(n, e) {
  var t;
  return Q((t = n == null ? void 0 : n()) !== null && t !== void 0 ? t : {}, e);
}
function Oe(n) {
  return "value" in n;
}
function ai(n) {
  if (!ft(n) || !("binding" in n)) return false;
  const e = n.binding;
  return Ps(e);
}
const g = "http://www.w3.org/2000/svg";
function je(n) {
  n.offsetHeight;
}
function hi(n, e) {
  const t = n.style.transition;
  n.style.transition = "none", e(), n.style.transition = t;
}
function $e(n) {
  return n.ontouchstart !== void 0;
}
function ui(n) {
  const e = n.ownerDocument.defaultView;
  return e && "document" in e ? n.getContext("2d", { willReadFrequently: true }) : null;
}
const ci = { check: '<path d="M2 8l4 4l8 -8"/>', dropdown: '<path d="M5 7h6l-3 3 z"/>', p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>' };
function Ke(n, e) {
  const t = n.createElementNS(g, "svg");
  return t.innerHTML = ci[e], t;
}
function Nn(n, e, t) {
  n.insertBefore(e, n.children[t]);
}
function Mt(n) {
  n.parentElement && n.parentElement.removeChild(n);
}
function jn(n) {
  for (; n.children.length > 0; ) n.removeChild(n.children[0]);
}
function pi(n) {
  for (; n.childNodes.length > 0; ) n.removeChild(n.childNodes[0]);
}
function Tt(n) {
  return n.relatedTarget ? n.relatedTarget : "explicitOriginalTarget" in n ? n.explicitOriginalTarget : null;
}
function M(n, e) {
  n.emitter.on("change", (t) => {
    e(t.rawValue);
  }), e(n.rawValue);
}
function A(n, e, t) {
  M(n.value(e), t);
}
const di = "tp";
function p(n) {
  return (t, s) => [di, "-", n, "v", t ? `_${t}` : "", s ? `-${s}` : ""].join("");
}
const we = p("lbl");
function mi(n, e) {
  const t = n.createDocumentFragment();
  return e.split(`
`).map((i) => n.createTextNode(i)).forEach((i, r) => {
    r > 0 && t.appendChild(n.createElement("br")), t.appendChild(i);
  }), t;
}
class Bn {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(we()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(we("l")), A(t.props, "label", (r) => {
      w(r) ? this.element.classList.add(we(void 0, "nol")) : (this.element.classList.remove(we(void 0, "nol")), pi(s), s.appendChild(mi(e, r)));
    }), this.element.appendChild(s), this.labelElement = s;
    const i = e.createElement("div");
    i.classList.add(we("v")), this.element.appendChild(i), this.valueElement = i;
  }
}
class Ue {
  constructor(e, t) {
    this.props = t.props, this.valueController = t.valueController, this.viewProps = t.valueController.viewProps, this.view = new Bn(e, { props: t.props, viewProps: this.viewProps }), this.view.valueElement.appendChild(this.valueController.view.element);
  }
  importProps(e) {
    return R(e, null, (t) => ({ label: t.optional.string }), (t) => (this.props.set("label", t.label), true));
  }
  exportProps() {
    return N(null, { label: this.props.get("label") });
  }
}
function vi() {
  return ["veryfirst", "first", "last", "verylast"];
}
const en = p(""), tn = { veryfirst: "vfst", first: "fst", last: "lst", verylast: "vlst" };
class Ve {
  constructor(e) {
    this.parent_ = null, this.blade = e.blade, this.view = e.view, this.viewProps = e.viewProps;
    const t = this.view.element;
    this.blade.value("positions").emitter.on("change", () => {
      vi().forEach((s) => {
        t.classList.remove(en(void 0, tn[s]));
      }), this.blade.get("positions").forEach((s) => {
        t.classList.add(en(void 0, tn[s]));
      });
    }), this.viewProps.handleDispose(() => {
      Mt(t);
    });
  }
  get parent() {
    return this.parent_;
  }
  set parent(e) {
    this.parent_ = e, this.viewProps.set("parent", this.parent_ ? this.parent_.viewProps : null);
  }
  importState(e) {
    return R(e, null, (t) => ({ disabled: t.required.boolean, hidden: t.required.boolean }), (t) => (this.viewProps.importState(t), true));
  }
  exportState() {
    return N(null, Object.assign({}, this.viewProps.exportState()));
  }
}
class Be extends Ve {
  constructor(e, t) {
    if (t.value !== t.valueController.value) throw x.shouldNeverHappen();
    const s = t.valueController.viewProps, i = new Ue(e, { blade: t.blade, props: t.props, valueController: t.valueController });
    super(Object.assign(Object.assign({}, t), { view: new Bn(e, { props: t.props, viewProps: s }), viewProps: s })), this.labelController = i, this.value = t.value, this.valueController = t.valueController, this.view.valueElement.appendChild(this.valueController.view.element);
  }
  importState(e) {
    return R(e, (t) => {
      var s, i, r;
      return super.importState(t) && this.labelController.importProps(t) && ((r = (i = (s = this.valueController).importProps) === null || i === void 0 ? void 0 : i.call(s, e)) !== null && r !== void 0 ? r : true);
    }, (t) => ({ value: t.optional.raw }), (t) => (t.value && (this.value.rawValue = t.value), true));
  }
  exportState() {
    var e, t, s;
    return N(() => super.exportState(), Object.assign(Object.assign({ value: this.value.rawValue }, this.labelController.exportProps()), (s = (t = (e = this.valueController).exportProps) === null || t === void 0 ? void 0 : t.call(e)) !== null && s !== void 0 ? s : {}));
  }
}
function In(n, e) {
  for (; n.length < e; ) n.push(void 0);
}
function wi(n) {
  const e = [];
  return In(e, n), e;
}
function bi(n) {
  const e = n.indexOf(void 0);
  return e < 0 ? n : n.slice(0, e);
}
function _i(n, e) {
  const t = [...bi(n), e];
  return t.length > n.length ? t.splice(0, t.length - n.length) : In(t, n.length), t;
}
class fi extends se {
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
      s(new ie(this));
    }), this;
  }
}
function Ci(n, e, t) {
  t ? n.classList.add(e) : n.classList.remove(e);
}
function Y(n, e) {
  return (t) => {
    Ci(n, e, t);
  };
}
function At(n, e) {
  M(n, (t) => {
    e.textContent = t ?? "";
  });
}
const et = p("btn");
class gi {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(et()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("button");
    s.classList.add(et("b")), t.viewProps.bindDisabled(s), this.element.appendChild(s), this.buttonElement = s;
    const i = e.createElement("div");
    i.classList.add(et("t")), At(t.props.value("title"), i), this.buttonElement.appendChild(i);
  }
}
class zn {
  constructor(e, t) {
    this.emitter = new y(), this.onClick_ = this.onClick_.bind(this), this.props = t.props, this.viewProps = t.viewProps, this.view = new gi(e, { props: this.props, viewProps: this.viewProps }), this.view.buttonElement.addEventListener("click", this.onClick_);
  }
  importProps(e) {
    return R(e, null, (t) => ({ title: t.optional.string }), (t) => (this.props.set("title", t.title), true));
  }
  exportProps() {
    return N(null, { title: this.props.get("title") });
  }
  onClick_() {
    this.emitter.emit("click", { sender: this });
  }
}
class nn extends Ve {
  constructor(e, t) {
    const s = new zn(e, { props: t.buttonProps, viewProps: t.viewProps }), i = new Ue(e, { blade: t.blade, props: t.labelProps, valueController: s });
    super({ blade: t.blade, view: i.view, viewProps: t.viewProps }), this.buttonController = s, this.labelController = i;
  }
  importState(e) {
    return R(e, (t) => super.importState(t) && this.buttonController.importProps(t) && this.labelController.importProps(t), () => ({}), () => true);
  }
  exportState() {
    return N(() => super.exportState(), Object.assign(Object.assign({}, this.buttonController.exportProps()), this.labelController.exportProps()));
  }
}
class Pi {
  constructor(e) {
    const [t, s] = e.split("-"), i = t.split(".");
    this.major = parseInt(i[0], 10), this.minor = parseInt(i[1], 10), this.patch = parseInt(i[2], 10), this.prerelease = s ?? null;
  }
  toString() {
    const e = [this.major, this.minor, this.patch].join(".");
    return this.prerelease !== null ? [e, this.prerelease].join("-") : e;
  }
}
const Ei = new Pi("2.0.0-beta.2");
function C(n) {
  return Object.assign({ core: Ei }, n);
}
C({ id: "button", type: "blade", accept(n) {
  const e = f(n, (t) => ({ title: t.required.string, view: t.required.constant("button"), label: t.optional.string }));
  return e ? { params: e } : null;
}, controller(n) {
  return new nn(n.document, { blade: n.blade, buttonProps: c.fromObject({ title: n.params.title }), labelProps: c.fromObject({ label: n.params.label }), viewProps: n.viewProps });
}, api(n) {
  return n.controller instanceof nn ? new fi(n.controller) : null;
} });
function yi(n, e) {
  return n.addBlade(Object.assign(Object.assign({}, e), { view: "button" }));
}
function xi(n, e) {
  return n.addBlade(Object.assign(Object.assign({}, e), { view: "folder" }));
}
function ki(n, e) {
  return n.addBlade(Object.assign(Object.assign({}, e), { view: "tab" }));
}
function Vi(n) {
  return ft(n) ? "refresh" in n && typeof n.refresh == "function" : false;
}
function Li(n, e) {
  if (!Ne.isBindable(n)) throw x.notBindable();
  return new Ne(n, e);
}
class Si {
  constructor(e, t) {
    this.onRackValueChange_ = this.onRackValueChange_.bind(this), this.controller_ = e, this.emitter_ = new y(), this.pool_ = t, this.controller_.rack.emitter.on("valuechange", this.onRackValueChange_);
  }
  get children() {
    return this.controller_.rack.children.map((e) => this.pool_.createApi(e));
  }
  addBinding(e, t, s) {
    const i = s ?? {}, r = this.controller_.element.ownerDocument, o = this.pool_.createBinding(r, Li(e, t), i), l = this.pool_.createBindingApi(o);
    return this.add(l, i.index);
  }
  addFolder(e) {
    return xi(this, e);
  }
  addButton(e) {
    return yi(this, e);
  }
  addTab(e) {
    return ki(this, e);
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
      Vi(e) && e.refresh();
    });
  }
  onRackValueChange_(e) {
    const t = e.bladeController, s = this.pool_.createApi(t), i = ai(t.value) ? t.value.binding : null;
    this.emitter_.emit("change", new Fe(s, i ? i.target.read() : t.value.rawValue, e.options.last));
  }
}
class Ot extends se {
  constructor(e, t) {
    super(e), this.rackApi_ = new Si(e.rackController, t);
  }
}
class Dt extends Ve {
  constructor(e) {
    super({ blade: e.blade, view: e.view, viewProps: e.rackController.viewProps }), this.rackController = e.rackController;
  }
  importState(e) {
    return R(e, (t) => super.importState(t), (t) => ({ children: t.required.array(t.required.raw) }), (t) => this.rackController.rack.children.every((s, i) => s.importState(t.children[i])));
  }
  exportState() {
    return N(() => super.exportState(), { children: this.rackController.rack.children.map((e) => e.exportState()) });
  }
}
function dt(n) {
  return "rackController" in n;
}
class Mi {
  constructor(e) {
    this.emitter = new y(), this.items_ = [], this.cache_ = /* @__PURE__ */ new Set(), this.onSubListAdd_ = this.onSubListAdd_.bind(this), this.onSubListRemove_ = this.onSubListRemove_.bind(this), this.extract_ = e;
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
    if (this.includes(e)) throw x.shouldNeverHappen();
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
function Ti(n, e) {
  for (let t = 0; t < n.length; t++) {
    const s = n[t];
    if (Oe(s) && s.value === e) return s;
  }
  return null;
}
function Ai(n) {
  return dt(n) ? n.rackController.rack.bcSet_ : null;
}
class Oi {
  constructor(e) {
    var t, s;
    this.emitter = new y(), this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this), this.onSetAdd_ = this.onSetAdd_.bind(this), this.onSetRemove_ = this.onSetRemove_.bind(this), this.onChildDispose_ = this.onChildDispose_.bind(this), this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this), this.onChildValueChange_ = this.onChildValueChange_.bind(this), this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this), this.onRackLayout_ = this.onRackLayout_.bind(this), this.onRackValueChange_ = this.onRackValueChange_.bind(this), this.blade_ = (t = e.blade) !== null && t !== void 0 ? t : null, (s = this.blade_) === null || s === void 0 || s.value("positions").emitter.on("change", this.onBladePositionsChange_), this.viewProps = e.viewProps, this.bcSet_ = new Mi(Ai), this.bcSet_.emitter.on("add", this.onSetAdd_), this.bcSet_.emitter.on("remove", this.onSetRemove_);
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
    if (s.viewProps.emitter.on("change", this.onChildViewPropsChange_), s.blade.value("positions").emitter.on("change", this.onChildPositionsChange_), s.viewProps.handleDispose(this.onChildDispose_), Oe(s)) s.value.emitter.on("change", this.onChildValueChange_);
    else if (dt(s)) {
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
    if (Oe(s)) s.value.emitter.off("change", this.onChildValueChange_);
    else if (dt(s)) {
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
    const t = Ti(this.find(Oe), e.sender);
    if (!t) throw x.alreadyDisposed();
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
class Rt {
  constructor(e) {
    this.onRackAdd_ = this.onRackAdd_.bind(this), this.onRackRemove_ = this.onRackRemove_.bind(this), this.element = e.element, this.viewProps = e.viewProps;
    const t = new Oi({ blade: e.root ? void 0 : e.blade, viewProps: e.viewProps });
    t.emitter.on("add", this.onRackAdd_), t.emitter.on("remove", this.onRackRemove_), this.rack = t, this.viewProps.handleDispose(() => {
      for (let s = this.rack.children.length - 1; s >= 0; s--) this.rack.children[s].viewProps.set("disposed", true);
    });
  }
  onRackAdd_(e) {
    e.root && Nn(this.element, e.bladeController.view.element, e.index);
  }
  onRackRemove_(e) {
    e.root && Mt(e.bladeController.view.element);
  }
}
function Fn() {
  return new c({ positions: _([], { equals: gs }) });
}
class de extends c {
  constructor(e) {
    super(e);
  }
  static create(e) {
    const t = { completed: true, expanded: e, expandedHeight: null, shouldFixHeight: false, temporaryExpanded: null }, s = c.createCore(t);
    return new de(s);
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
function Di(n, e) {
  let t = 0;
  return hi(e, () => {
    n.set("expandedHeight", null), n.set("temporaryExpanded", true), je(e), t = e.clientHeight, n.set("temporaryExpanded", null), je(e);
  }), t;
}
function sn(n, e) {
  e.style.height = n.styleHeight;
}
function He(n, e) {
  n.value("expanded").emitter.on("beforechange", () => {
    if (n.set("completed", false), w(n.get("expandedHeight"))) {
      const t = Di(n, e);
      t > 0 && n.set("expandedHeight", t);
    }
    n.set("shouldFixHeight", true), je(e);
  }), n.emitter.on("change", () => {
    sn(n, e);
  }), sn(n, e), e.addEventListener("transitionend", (t) => {
    t.propertyName === "height" && n.cleanUpTransition();
  });
}
class Ri extends Ot {
  constructor(e, t) {
    super(e, t), this.emitter_ = new y(), this.controller.foldable.value("expanded").emitter.on("change", (s) => {
      this.emitter_.emit("fold", new si(this, s.sender.rawValue));
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
const $n = p("cnt");
class Ni {
  constructor(e, t) {
    var s;
    this.className_ = p((s = t.viewName) !== null && s !== void 0 ? s : "fld"), this.element = e.createElement("div"), this.element.classList.add(this.className_(), $n()), t.viewProps.bindClassModifiers(this.element), this.foldable_ = t.foldable, this.foldable_.bindExpandedClass(this.element, this.className_(void 0, "expanded")), A(this.foldable_, "completed", Y(this.element, this.className_(void 0, "cpl")));
    const i = e.createElement("button");
    i.classList.add(this.className_("b")), A(t.props, "title", (h) => {
      w(h) ? this.element.classList.add(this.className_(void 0, "not")) : this.element.classList.remove(this.className_(void 0, "not"));
    }), t.viewProps.bindDisabled(i), this.element.appendChild(i), this.buttonElement = i;
    const r = e.createElement("div");
    r.classList.add(this.className_("i")), this.element.appendChild(r);
    const o = e.createElement("div");
    o.classList.add(this.className_("t")), At(t.props.value("title"), o), this.buttonElement.appendChild(o), this.titleElement = o;
    const l = e.createElement("div");
    l.classList.add(this.className_("m")), this.buttonElement.appendChild(l);
    const a = e.createElement("div");
    a.classList.add(this.className_("c")), this.element.appendChild(a), this.containerElement = a;
  }
}
class rn extends Dt {
  constructor(e, t) {
    var s;
    const i = de.create((s = t.expanded) !== null && s !== void 0 ? s : true), r = new Ni(e, { foldable: i, props: t.props, viewName: t.root ? "rot" : void 0, viewProps: t.viewProps });
    super(Object.assign(Object.assign({}, t), { rackController: new Rt({ blade: t.blade, element: r.containerElement, root: t.root, viewProps: t.viewProps }), view: r })), this.onTitleClick_ = this.onTitleClick_.bind(this), this.props = t.props, this.foldable = i, He(this.foldable, this.view.containerElement), this.rackController.rack.emitter.on("add", () => {
      this.foldable.cleanUpTransition();
    }), this.rackController.rack.emitter.on("remove", () => {
      this.foldable.cleanUpTransition();
    }), this.view.buttonElement.addEventListener("click", this.onTitleClick_);
  }
  get document() {
    return this.view.element.ownerDocument;
  }
  importState(e) {
    return R(e, (t) => super.importState(t), (t) => ({ expanded: t.required.boolean, title: t.optional.string }), (t) => (this.foldable.set("expanded", t.expanded), this.props.set("title", t.title), true));
  }
  exportState() {
    return N(() => super.exportState(), { expanded: this.foldable.get("expanded"), title: this.props.get("title") });
  }
  onTitleClick_() {
    this.foldable.set("expanded", !this.foldable.get("expanded"));
  }
}
C({ id: "folder", type: "blade", accept(n) {
  const e = f(n, (t) => ({ title: t.required.string, view: t.required.constant("folder"), expanded: t.optional.boolean }));
  return e ? { params: e } : null;
}, controller(n) {
  return new rn(n.document, { blade: n.blade, expanded: n.params.expanded, props: c.fromObject({ title: n.params.title }), viewProps: n.viewProps });
}, api(n) {
  return n.controller instanceof rn ? new Ri(n.controller, n.pool) : null;
} });
const ji = p("");
function on(n, e) {
  return Y(n, ji(void 0, e));
}
class z extends c {
  constructor(e) {
    var t;
    super(e), this.onDisabledChange_ = this.onDisabledChange_.bind(this), this.onParentChange_ = this.onParentChange_.bind(this), this.onParentGlobalDisabledChange_ = this.onParentGlobalDisabledChange_.bind(this), [this.globalDisabled_, this.setGlobalDisabled_] = Vs(_(this.getGlobalDisabled_())), this.value("disabled").emitter.on("change", this.onDisabledChange_), this.value("parent").emitter.on("change", this.onParentChange_), (t = this.get("parent")) === null || t === void 0 || t.globalDisabled.emitter.on("change", this.onParentGlobalDisabledChange_);
  }
  static create(e) {
    var t, s, i;
    const r = e ?? {};
    return new z(c.createCore({ disabled: (t = r.disabled) !== null && t !== void 0 ? t : false, disposed: false, hidden: (s = r.hidden) !== null && s !== void 0 ? s : false, parent: (i = r.parent) !== null && i !== void 0 ? i : null }));
  }
  get globalDisabled() {
    return this.globalDisabled_;
  }
  bindClassModifiers(e) {
    M(this.globalDisabled_, on(e, "disabled")), A(this, "hidden", on(e, "hidden"));
  }
  bindDisabled(e) {
    M(this.globalDisabled_, (t) => {
      e.disabled = t;
    });
  }
  bindTabIndex(e) {
    M(this.globalDisabled_, (t) => {
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
const ln = p("tbp");
class Bi {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(ln()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(ln("c")), this.element.appendChild(s), this.containerElement = s;
  }
}
const be = p("tbi");
class Ii {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(be()), t.viewProps.bindClassModifiers(this.element), A(t.props, "selected", (r) => {
      r ? this.element.classList.add(be(void 0, "sel")) : this.element.classList.remove(be(void 0, "sel"));
    });
    const s = e.createElement("button");
    s.classList.add(be("b")), t.viewProps.bindDisabled(s), this.element.appendChild(s), this.buttonElement = s;
    const i = e.createElement("div");
    i.classList.add(be("t")), At(t.props.value("title"), i), this.buttonElement.appendChild(i), this.titleElement = i;
  }
}
class zi {
  constructor(e, t) {
    this.emitter = new y(), this.onClick_ = this.onClick_.bind(this), this.props = t.props, this.viewProps = t.viewProps, this.view = new Ii(e, { props: t.props, viewProps: t.viewProps }), this.view.buttonElement.addEventListener("click", this.onClick_);
  }
  onClick_() {
    this.emitter.emit("click", { sender: this });
  }
}
class mt extends Dt {
  constructor(e, t) {
    const s = new Bi(e, { viewProps: t.viewProps });
    super(Object.assign(Object.assign({}, t), { rackController: new Rt({ blade: t.blade, element: s.containerElement, viewProps: t.viewProps }), view: s })), this.onItemClick_ = this.onItemClick_.bind(this), this.ic_ = new zi(e, { props: t.itemProps, viewProps: z.create() }), this.ic_.emitter.on("click", this.onItemClick_), this.props = t.props, A(this.props, "selected", (i) => {
      this.itemController.props.set("selected", i), this.viewProps.set("hidden", !i);
    });
  }
  get itemController() {
    return this.ic_;
  }
  importState(e) {
    return R(e, (t) => super.importState(t), (t) => ({ selected: t.required.boolean, title: t.required.string }), (t) => (this.ic_.props.set("selected", t.selected), this.ic_.props.set("title", t.title), true));
  }
  exportState() {
    return N(() => super.exportState(), { selected: this.ic_.props.get("selected"), title: this.ic_.props.get("title") });
  }
  onItemClick_() {
    this.props.set("selected", true);
  }
}
class Fi extends Ot {
  constructor(e, t) {
    super(e, t), this.emitter_ = new y(), this.onSelect_ = this.onSelect_.bind(this), this.pool_ = t, this.rackApi_.on("change", (s) => {
      this.emitter_.emit("change", s);
    }), this.controller.tab.selectedIndex.emitter.on("change", this.onSelect_);
  }
  get pages() {
    return this.rackApi_.children;
  }
  addPage(e) {
    const t = this.controller.view.element.ownerDocument, s = new mt(t, { blade: Fn(), itemProps: c.fromObject({ selected: false, title: e.title }), props: c.fromObject({ selected: false }), viewProps: z.create() }), i = this.pool_.createApi(s);
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
    this.emitter_.emit("select", new ii(this, e.rawValue));
  }
}
class $i extends Ot {
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
const an = -1;
class Ki {
  constructor() {
    this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this), this.empty = _(true), this.selectedIndex = _(an), this.items_ = [];
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
      this.selectedIndex.rawValue = an, this.empty.rawValue = true;
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
const _e = p("tab");
class Ui {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(_e(), $n()), t.viewProps.bindClassModifiers(this.element), M(t.empty, Y(this.element, _e(void 0, "nop")));
    const s = e.createElement("div");
    s.classList.add(_e("t")), this.element.appendChild(s), this.itemsElement = s;
    const i = e.createElement("div");
    i.classList.add(_e("i")), this.element.appendChild(i);
    const r = e.createElement("div");
    r.classList.add(_e("c")), this.element.appendChild(r), this.contentsElement = r;
  }
}
class hn extends Dt {
  constructor(e, t) {
    const s = new Ki(), i = new Ui(e, { empty: s.empty, viewProps: t.viewProps });
    super({ blade: t.blade, rackController: new Rt({ blade: t.blade, element: i.contentsElement, viewProps: t.viewProps }), view: i }), this.onRackAdd_ = this.onRackAdd_.bind(this), this.onRackRemove_ = this.onRackRemove_.bind(this);
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
    Nn(this.view.itemsElement, t.itemController.view.element, e.index), t.itemController.viewProps.set("parent", this.viewProps), this.tab.add(t.props.value("selected"));
  }
  onRackRemove_(e) {
    if (!e.root) return;
    const t = e.bladeController;
    Mt(t.itemController.view.element), t.itemController.viewProps.set("parent", null), this.tab.remove(t.props.value("selected"));
  }
}
C({ id: "tab", type: "blade", accept(n) {
  const e = f(n, (t) => ({ pages: t.required.array(t.required.object({ title: t.required.string })), view: t.required.constant("tab") }));
  return !e || e.pages.length === 0 ? null : { params: e };
}, controller(n) {
  const e = new hn(n.document, { blade: n.blade, viewProps: n.viewProps });
  return n.params.pages.forEach((t) => {
    const s = new mt(n.document, { blade: Fn(), itemProps: c.fromObject({ selected: false, title: t.title }), props: c.fromObject({ selected: false }), viewProps: z.create() });
    e.add(s);
  }), e;
}, api(n) {
  return n.controller instanceof hn ? new Fi(n.controller, n.pool) : n.controller instanceof mt ? new $i(n.controller, n.pool) : null;
} });
class Nt extends St {
  get options() {
    return this.controller.valueController.props.get("options");
  }
  set options(e) {
    this.controller.valueController.props.set("options", e);
  }
}
class Hi {
  constructor() {
    this.disabled = false, this.emitter = new y();
  }
  dispose() {
  }
  tick() {
    this.disabled || this.emitter.emit("tick", { sender: this });
  }
}
class qi {
  constructor(e, t) {
    this.disabled_ = false, this.timerId_ = null, this.onTick_ = this.onTick_.bind(this), this.doc_ = e, this.emitter = new y(), this.interval_ = t, this.setTimer_();
  }
  get disabled() {
    return this.disabled_;
  }
  set disabled(e) {
    this.disabled_ = e, this.disabled_ ? this.clearTimer_() : this.setTimer_();
  }
  dispose() {
    this.clearTimer_();
  }
  clearTimer_() {
    if (this.timerId_ === null) return;
    const e = this.doc_.defaultView;
    e && e.clearInterval(this.timerId_), this.timerId_ = null;
  }
  setTimer_() {
    if (this.clearTimer_(), this.interval_ <= 0) return;
    const e = this.doc_.defaultView;
    e && (this.timerId_ = e.setInterval(this.onTick_, this.interval_));
  }
  onTick_() {
    this.disabled_ || this.emitter.emit("tick", { sender: this });
  }
}
class me {
  constructor(e) {
    this.constraints = e;
  }
  constrain(e) {
    return this.constraints.reduce((t, s) => s.constrain(t), e);
  }
}
function ye(n, e) {
  if (n instanceof e) return n;
  if (n instanceof me) {
    const t = n.constraints.reduce((s, i) => s || (i instanceof e ? i : null), null);
    if (t) return t;
  }
  return null;
}
class qe {
  constructor(e) {
    this.values = c.fromObject({ options: e });
  }
  constrain(e) {
    const t = this.values.get("options");
    return t.length === 0 || t.filter((i) => i.value === e).length > 0 ? e : t[0].value;
  }
}
function Ge(n) {
  var e;
  const t = pt;
  if (Array.isArray(n)) return (e = f({ items: n }, (s) => ({ items: s.required.array(s.required.object({ text: s.required.string, value: s.required.raw })) }))) === null || e === void 0 ? void 0 : e.items;
  if (typeof n == "object") return t.required.raw(n).value;
}
function Kn(n) {
  if (Array.isArray(n)) return n;
  const e = [];
  return Object.keys(n).forEach((t) => {
    e.push({ text: t, value: n[t] });
  }), e;
}
function jt(n) {
  return w(n) ? null : new qe(Kn(n));
}
const tt = p("lst");
class Gi {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.props_ = t.props, this.element = e.createElement("div"), this.element.classList.add(tt()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("select");
    s.classList.add(tt("s")), t.viewProps.bindDisabled(s), this.element.appendChild(s), this.selectElement = s;
    const i = e.createElement("div");
    i.classList.add(tt("m")), i.appendChild(Ke(e, "dropdown")), this.element.appendChild(i), t.value.emitter.on("change", this.onValueChange_), this.value_ = t.value, A(this.props_, "options", (r) => {
      jn(this.selectElement), r.forEach((o) => {
        const l = e.createElement("option");
        l.textContent = o.text, this.selectElement.appendChild(l);
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
class ce {
  constructor(e, t) {
    this.onSelectChange_ = this.onSelectChange_.bind(this), this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.view = new Gi(e, { props: this.props, value: this.value, viewProps: this.viewProps }), this.view.selectElement.addEventListener("change", this.onSelectChange_);
  }
  onSelectChange_(e) {
    const t = e.currentTarget;
    this.value.rawValue = this.props.get("options")[t.selectedIndex].value;
  }
  importProps(e) {
    return R(e, null, (t) => ({ options: t.required.custom(Ge) }), (t) => (this.props.set("options", Kn(t.options)), true));
  }
  exportProps() {
    return N(null, { options: this.props.get("options") });
  }
}
const un = p("pop");
class Yi {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(un()), t.viewProps.bindClassModifiers(this.element), M(t.shows, Y(this.element, un(void 0, "v")));
  }
}
class Bt {
  constructor(e, t) {
    this.shows = _(false), this.viewProps = t.viewProps, this.view = new Yi(e, { shows: this.shows, viewProps: this.viewProps });
  }
}
const cn = p("txt");
class Xi {
  constructor(e, t) {
    this.onChange_ = this.onChange_.bind(this), this.element = e.createElement("div"), this.element.classList.add(cn()), t.viewProps.bindClassModifiers(this.element), this.props_ = t.props, this.props_.emitter.on("change", this.onChange_);
    const s = e.createElement("input");
    s.classList.add(cn("i")), s.type = "text", t.viewProps.bindDisabled(s), this.element.appendChild(s), this.inputElement = s, t.value.emitter.on("change", this.onChange_), this.value_ = t.value, this.refresh();
  }
  refresh() {
    const e = this.props_.get("formatter");
    this.inputElement.value = e(this.value_.rawValue);
  }
  onChange_() {
    this.refresh();
  }
}
class Ye {
  constructor(e, t) {
    this.onInputChange_ = this.onInputChange_.bind(this), this.parser_ = t.parser, this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.view = new Xi(e, { props: t.props, value: this.value, viewProps: this.viewProps }), this.view.inputElement.addEventListener("change", this.onInputChange_);
  }
  onInputChange_(e) {
    const s = e.currentTarget.value, i = this.parser_(s);
    w(i) || (this.value.rawValue = i), this.view.refresh();
  }
}
function Wi(n) {
  return String(n);
}
function It(n) {
  return n === "false" ? false : !!n;
}
function pn(n) {
  return Wi(n);
}
function Ji(n) {
  return (e) => n.reduce((t, s) => t !== null ? t : s(e), null);
}
const Zi = E(0);
function Ie(n) {
  return Zi(n) + "%";
}
function zt(n) {
  return String(n);
}
function vt(n) {
  return n;
}
function re({ primary: n, secondary: e, forward: t, backward: s }) {
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
function P(n, e) {
  const t = n * (e.altKey ? 0.1 : 1) * (e.shiftKey ? 10 : 1);
  return e.upKey ? +t : e.downKey ? -t : 0;
}
function ee(n) {
  return { altKey: n.altKey, downKey: n.key === "ArrowDown", shiftKey: n.shiftKey, upKey: n.key === "ArrowUp" };
}
function D(n) {
  return { altKey: n.altKey, downKey: n.key === "ArrowLeft", shiftKey: n.shiftKey, upKey: n.key === "ArrowRight" };
}
function Qi(n) {
  return n === "ArrowUp" || n === "ArrowDown";
}
function ze(n) {
  return Qi(n) || n === "ArrowLeft" || n === "ArrowRight";
}
function nt(n, e) {
  var t, s;
  const i = e.ownerDocument.defaultView, r = e.getBoundingClientRect();
  return { x: n.pageX - (((t = i && i.scrollX) !== null && t !== void 0 ? t : 0) + r.left), y: n.pageY - (((s = i && i.scrollY) !== null && s !== void 0 ? s : 0) + r.top) };
}
class F {
  constructor(e) {
    this.lastTouch_ = null, this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this), this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this), this.onMouseDown_ = this.onMouseDown_.bind(this), this.onTouchEnd_ = this.onTouchEnd_.bind(this), this.onTouchMove_ = this.onTouchMove_.bind(this), this.onTouchStart_ = this.onTouchStart_.bind(this), this.elem_ = e, this.emitter = new y(), e.addEventListener("touchstart", this.onTouchStart_, { passive: false }), e.addEventListener("touchmove", this.onTouchMove_, { passive: true }), e.addEventListener("touchend", this.onTouchEnd_), e.addEventListener("mousedown", this.onMouseDown_);
  }
  computePosition_(e) {
    const t = this.elem_.getBoundingClientRect();
    return { bounds: { width: t.width, height: t.height }, point: e ? { x: e.x, y: e.y } : null };
  }
  onMouseDown_(e) {
    var t;
    e.preventDefault(), (t = e.currentTarget) === null || t === void 0 || t.focus();
    const s = this.elem_.ownerDocument;
    s.addEventListener("mousemove", this.onDocumentMouseMove_), s.addEventListener("mouseup", this.onDocumentMouseUp_), this.emitter.emit("down", { altKey: e.altKey, data: this.computePosition_(nt(e, this.elem_)), sender: this, shiftKey: e.shiftKey });
  }
  onDocumentMouseMove_(e) {
    this.emitter.emit("move", { altKey: e.altKey, data: this.computePosition_(nt(e, this.elem_)), sender: this, shiftKey: e.shiftKey });
  }
  onDocumentMouseUp_(e) {
    const t = this.elem_.ownerDocument;
    t.removeEventListener("mousemove", this.onDocumentMouseMove_), t.removeEventListener("mouseup", this.onDocumentMouseUp_), this.emitter.emit("up", { altKey: e.altKey, data: this.computePosition_(nt(e, this.elem_)), sender: this, shiftKey: e.shiftKey });
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
class er {
  constructor(e, t) {
    this.onChange_ = this.onChange_.bind(this), this.props_ = t.props, this.props_.emitter.on("change", this.onChange_), this.element = e.createElement("div"), this.element.classList.add(V(), V(void 0, "num")), t.arrayPosition && this.element.classList.add(V(void 0, t.arrayPosition)), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("input");
    s.classList.add(V("i")), s.type = "text", t.viewProps.bindDisabled(s), this.element.appendChild(s), this.inputElement = s, this.onDraggingChange_ = this.onDraggingChange_.bind(this), this.dragging_ = t.dragging, this.dragging_.emitter.on("change", this.onDraggingChange_), this.element.classList.add(V()), this.inputElement.classList.add(V("i"));
    const i = e.createElement("div");
    i.classList.add(V("k")), this.element.appendChild(i), this.knobElement = i;
    const r = e.createElementNS(g, "svg");
    r.classList.add(V("g")), this.knobElement.appendChild(r);
    const o = e.createElementNS(g, "path");
    o.classList.add(V("gb")), r.appendChild(o), this.guideBodyElem_ = o;
    const l = e.createElementNS(g, "path");
    l.classList.add(V("gh")), r.appendChild(l), this.guideHeadElem_ = l;
    const a = e.createElement("div");
    a.classList.add(p("tt")()), this.knobElement.appendChild(a), this.tooltipElem_ = a, t.value.emitter.on("change", this.onChange_), this.value = t.value, this.refresh();
  }
  onDraggingChange_(e) {
    if (e.rawValue === null) {
      this.element.classList.remove(V(void 0, "drg"));
      return;
    }
    this.element.classList.add(V(void 0, "drg"));
    const t = e.rawValue / this.props_.get("pointerScale"), s = t + (t > 0 ? -1 : t < 0 ? 1 : 0), i = b(-s, -4, 4);
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
class Le {
  constructor(e, t) {
    var s;
    this.originRawValue_ = 0, this.onInputChange_ = this.onInputChange_.bind(this), this.onInputKeyDown_ = this.onInputKeyDown_.bind(this), this.onInputKeyUp_ = this.onInputKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.parser_ = t.parser, this.props = t.props, this.sliderProps_ = (s = t.sliderProps) !== null && s !== void 0 ? s : null, this.value = t.value, this.viewProps = t.viewProps, this.dragging_ = _(null), this.view = new er(e, { arrayPosition: t.arrayPosition, dragging: this.dragging_, props: this.props, value: this.value, viewProps: this.viewProps }), this.view.inputElement.addEventListener("change", this.onInputChange_), this.view.inputElement.addEventListener("keydown", this.onInputKeyDown_), this.view.inputElement.addEventListener("keyup", this.onInputKeyUp_);
    const i = new F(this.view.knobElement);
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
    const t = P(this.props.get("keyScale"), ee(e));
    t !== 0 && this.value.setRawValue(this.constrainValue_(this.value.rawValue + t), { forceEmit: false, last: false });
  }
  onInputKeyUp_(e) {
    P(this.props.get("keyScale"), ee(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
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
const st = p("sld");
class tr {
  constructor(e, t) {
    this.onChange_ = this.onChange_.bind(this), this.props_ = t.props, this.props_.emitter.on("change", this.onChange_), this.element = e.createElement("div"), this.element.classList.add(st()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(st("t")), t.viewProps.bindTabIndex(s), this.element.appendChild(s), this.trackElement = s;
    const i = e.createElement("div");
    i.classList.add(st("k")), this.trackElement.appendChild(i), this.knobElement = i, t.value.emitter.on("change", this.onChange_), this.value = t.value, this.update_();
  }
  update_() {
    const e = b(u(this.value.rawValue, this.props_.get("min"), this.props_.get("max"), 0, 100), 0, 100);
    this.knobElement.style.width = `${e}%`;
  }
  onChange_() {
    this.update_();
  }
}
class nr {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.props = t.props, this.view = new tr(e, { props: this.props, value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new F(this.view.trackElement), this.ptHandler_.emitter.on("down", this.onPointerDownOrMove_), this.ptHandler_.emitter.on("move", this.onPointerDownOrMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.trackElement.addEventListener("keydown", this.onKeyDown_), this.view.trackElement.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    e.point && this.value.setRawValue(u(b(e.point.x, 0, e.bounds.width), 0, e.bounds.width, this.props.get("min"), this.props.get("max")), t);
  }
  onPointerDownOrMove_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.handlePointerEvent_(e.data, { forceEmit: true, last: true });
  }
  onKeyDown_(e) {
    const t = P(this.props.get("keyScale"), D(e));
    t !== 0 && this.value.setRawValue(this.value.rawValue + t, { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    P(this.props.get("keyScale"), D(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
const it = p("sldtxt");
class sr {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(it());
    const s = e.createElement("div");
    s.classList.add(it("s")), this.sliderView_ = t.sliderView, s.appendChild(this.sliderView_.element), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(it("t")), this.textView_ = t.textView, i.appendChild(this.textView_.element), this.element.appendChild(i);
  }
}
class dn {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.sliderC_ = new nr(e, { props: t.sliderProps, value: t.value, viewProps: this.viewProps }), this.textC_ = new Le(e, { parser: t.parser, props: t.textProps, sliderProps: t.sliderProps, value: t.value, viewProps: t.viewProps }), this.view = new sr(e, { sliderView: this.sliderC_.view, textView: this.textC_.view });
  }
  get sliderController() {
    return this.sliderC_;
  }
  get textController() {
    return this.textC_;
  }
  importProps(e) {
    return R(e, null, (t) => ({ max: t.required.number, min: t.required.number }), (t) => {
      const s = this.sliderC_.props;
      return s.set("max", t.max), s.set("min", t.min), true;
    });
  }
  exportProps() {
    const e = this.sliderC_.props;
    return N(null, { max: e.get("max"), min: e.get("min") });
  }
}
function ir(n) {
  return { sliderProps: new c({ keyScale: n.keyScale, max: n.max, min: n.min }), textProps: new c({ formatter: _(n.formatter), keyScale: n.keyScale, pointerScale: _(n.pointerScale) }) };
}
const rr = { containerUnitSize: "cnt-usz" };
function Un(n) {
  return `--${rr[n]}`;
}
class Hn {
  constructor(e, t) {
    const s = p(t.viewName);
    this.element = e.createElement("div"), this.element.classList.add(s()), t.viewProps.bindClassModifiers(this.element);
  }
}
function xe(n) {
  return Vt(n);
}
function q(n) {
  if (ct(n)) return f(n, xe);
}
function I(n, e) {
  if (!n) return;
  const t = [], s = yt(n, e);
  s && t.push(s);
  const i = xt(n);
  return i && t.push(i), new me(t);
}
function qn(n) {
  if (n === "inline" || n === "popup") return n;
}
function X(n, e) {
  n.write(e);
}
const Ae = p("ckb");
class or {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.element = e.createElement("div"), this.element.classList.add(Ae()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("label");
    s.classList.add(Ae("l")), this.element.appendChild(s);
    const i = e.createElement("input");
    i.classList.add(Ae("i")), i.type = "checkbox", s.appendChild(i), this.inputElement = i, t.viewProps.bindDisabled(this.inputElement);
    const r = e.createElement("div");
    r.classList.add(Ae("w")), s.appendChild(r);
    const o = Ke(e, "check");
    r.appendChild(o), t.value.emitter.on("change", this.onValueChange_), this.value = t.value, this.update_();
  }
  update_() {
    this.inputElement.checked = this.value.rawValue;
  }
  onValueChange_() {
    this.update_();
  }
}
class lr {
  constructor(e, t) {
    this.onInputChange_ = this.onInputChange_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new or(e, { value: this.value, viewProps: this.viewProps }), this.view.inputElement.addEventListener("change", this.onInputChange_);
  }
  onInputChange_(e) {
    const t = e.currentTarget;
    this.value.rawValue = t.checked;
  }
}
function ar(n) {
  const e = [], t = jt(n.options);
  return t && e.push(t), new me(e);
}
C({ id: "input-bool", type: "input", accept: (n, e) => {
  if (typeof n != "boolean") return null;
  const t = f(e, (s) => ({ options: s.optional.custom(Ge), readonly: s.optional.constant(false) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => It, constraint: (n) => ar(n.params), writer: (n) => X }, controller: (n) => {
  const e = n.document, t = n.value, s = n.constraint, i = s && ye(s, qe);
  return i ? new ce(e, { props: new c({ options: i.values.value("options") }), value: t, viewProps: n.viewProps }) : new lr(e, { value: t, viewProps: n.viewProps });
}, api(n) {
  return typeof n.controller.value.rawValue != "boolean" ? null : n.controller.valueController instanceof ce ? new Nt(n.controller) : null;
} });
const W = p("col");
class hr {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(W()), t.foldable.bindExpandedClass(this.element, W(void 0, "expanded")), A(t.foldable, "completed", Y(this.element, W(void 0, "cpl")));
    const s = e.createElement("div");
    s.classList.add(W("h")), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(W("s")), s.appendChild(i), this.swatchElement = i;
    const r = e.createElement("div");
    if (r.classList.add(W("t")), s.appendChild(r), this.textElement = r, t.pickerLayout === "inline") {
      const o = e.createElement("div");
      o.classList.add(W("p")), this.element.appendChild(o), this.pickerElement = o;
    } else this.pickerElement = null;
  }
}
function ur(n, e, t) {
  const s = b(n / 255, 0, 1), i = b(e / 255, 0, 1), r = b(t / 255, 0, 1), o = Math.max(s, i, r), l = Math.min(s, i, r), a = o - l;
  let h = 0, d = 0;
  const v = (l + o) / 2;
  return a !== 0 && (d = a / (1 - Math.abs(o + l - 1)), s === o ? h = (i - r) / a : i === o ? h = 2 + (r - s) / a : h = 4 + (s - i) / a, h = h / 6 + (h < 0 ? 1 : 0)), [h * 360, d * 100, v * 100];
}
function cr(n, e, t) {
  const s = (n % 360 + 360) % 360, i = b(e / 100, 0, 1), r = b(t / 100, 0, 1), o = (1 - Math.abs(2 * r - 1)) * i, l = o * (1 - Math.abs(s / 60 % 2 - 1)), a = r - o / 2;
  let h, d, v;
  return s >= 0 && s < 60 ? [h, d, v] = [o, l, 0] : s >= 60 && s < 120 ? [h, d, v] = [l, o, 0] : s >= 120 && s < 180 ? [h, d, v] = [0, o, l] : s >= 180 && s < 240 ? [h, d, v] = [0, l, o] : s >= 240 && s < 300 ? [h, d, v] = [l, 0, o] : [h, d, v] = [o, 0, l], [(h + a) * 255, (d + a) * 255, (v + a) * 255];
}
function pr(n, e, t) {
  const s = b(n / 255, 0, 1), i = b(e / 255, 0, 1), r = b(t / 255, 0, 1), o = Math.max(s, i, r), l = Math.min(s, i, r), a = o - l;
  let h;
  a === 0 ? h = 0 : o === s ? h = 60 * (((i - r) / a % 6 + 6) % 6) : o === i ? h = 60 * ((r - s) / a + 2) : h = 60 * ((s - i) / a + 4);
  const d = o === 0 ? 0 : a / o, v = o;
  return [h, d * 100, v * 100];
}
function Gn(n, e, t) {
  const s = Dn(n, 360), i = b(e / 100, 0, 1), r = b(t / 100, 0, 1), o = r * i, l = o * (1 - Math.abs(s / 60 % 2 - 1)), a = r - o;
  let h, d, v;
  return s >= 0 && s < 60 ? [h, d, v] = [o, l, 0] : s >= 60 && s < 120 ? [h, d, v] = [l, o, 0] : s >= 120 && s < 180 ? [h, d, v] = [0, o, l] : s >= 180 && s < 240 ? [h, d, v] = [0, l, o] : s >= 240 && s < 300 ? [h, d, v] = [l, 0, o] : [h, d, v] = [o, 0, l], [(h + a) * 255, (d + a) * 255, (v + a) * 255];
}
function dr(n, e, t) {
  const s = t + e * (100 - Math.abs(2 * t - 100)) / 200;
  return [n, s !== 0 ? e * (100 - Math.abs(2 * t - 100)) / s : 0, t + e * (100 - Math.abs(2 * t - 100)) / 200];
}
function mr(n, e, t) {
  const s = 100 - Math.abs(t * (200 - e) / 100 - 100);
  return [n, s !== 0 ? e * t / s : 0, t * (200 - e) / 200];
}
function j(n) {
  return [n[0], n[1], n[2]];
}
function Xe(n, e) {
  return [n[0], n[1], n[2], e];
}
const vr = { hsl: { hsl: (n, e, t) => [n, e, t], hsv: dr, rgb: cr }, hsv: { hsl: mr, hsv: (n, e, t) => [n, e, t], rgb: Gn }, rgb: { hsl: ur, hsv: pr, rgb: (n, e, t) => [n, e, t] } };
function pe(n, e) {
  return [e === "float" ? 1 : n === "rgb" ? 255 : 360, e === "float" ? 1 : n === "rgb" ? 255 : 100, e === "float" ? 1 : n === "rgb" ? 255 : 100];
}
function wr(n, e) {
  return n === e ? e : Dn(n, e);
}
function Yn(n, e, t) {
  var s;
  const i = pe(e, t);
  return [e === "rgb" ? b(n[0], 0, i[0]) : wr(n[0], i[0]), b(n[1], 0, i[1]), b(n[2], 0, i[2]), b((s = n[3]) !== null && s !== void 0 ? s : 1, 0, 1)];
}
function mn(n, e, t, s) {
  const i = pe(e, t), r = pe(e, s);
  return n.map((o, l) => o / i[l] * r[l]);
}
function Xn(n, e, t) {
  const s = mn(n, e.mode, e.type, "int"), i = vr[e.mode][t.mode](...s);
  return mn(i, t.mode, "int", t.type);
}
class m {
  static black() {
    return new m([0, 0, 0], "rgb");
  }
  constructor(e, t) {
    this.type = "int", this.mode = t, this.comps_ = Yn(e, t, this.type);
  }
  getComponents(e) {
    return Xe(Xn(j(this.comps_), { mode: this.mode, type: this.type }, { mode: e ?? this.mode, type: this.type }), this.comps_[3]);
  }
  toRgbaObject() {
    const e = this.getComponents("rgb");
    return { r: e[0], g: e[1], b: e[2], a: e[3] };
  }
}
const $ = p("colp");
class br {
  constructor(e, t) {
    this.alphaViews_ = null, this.element = e.createElement("div"), this.element.classList.add($()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add($("hsv"));
    const i = e.createElement("div");
    i.classList.add($("sv")), this.svPaletteView_ = t.svPaletteView, i.appendChild(this.svPaletteView_.element), s.appendChild(i);
    const r = e.createElement("div");
    r.classList.add($("h")), this.hPaletteView_ = t.hPaletteView, r.appendChild(this.hPaletteView_.element), s.appendChild(r), this.element.appendChild(s);
    const o = e.createElement("div");
    if (o.classList.add($("rgb")), this.textsView_ = t.textsView, o.appendChild(this.textsView_.element), this.element.appendChild(o), t.alphaViews) {
      this.alphaViews_ = { palette: t.alphaViews.palette, text: t.alphaViews.text };
      const l = e.createElement("div");
      l.classList.add($("a"));
      const a = e.createElement("div");
      a.classList.add($("ap")), a.appendChild(this.alphaViews_.palette.element), l.appendChild(a);
      const h = e.createElement("div");
      h.classList.add($("at")), h.appendChild(this.alphaViews_.text.element), l.appendChild(h), this.element.appendChild(l);
    }
  }
  get allFocusableElements() {
    const e = [this.svPaletteView_.element, this.hPaletteView_.element, this.textsView_.modeSelectElement, ...this.textsView_.inputViews.map((t) => t.inputElement)];
    return this.alphaViews_ && e.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement), e;
  }
}
function _r(n) {
  return n === "int" ? "int" : n === "float" ? "float" : void 0;
}
function Ft(n) {
  return f(n, (e) => ({ color: e.optional.object({ alpha: e.optional.boolean, type: e.optional.custom(_r) }), expanded: e.optional.boolean, picker: e.optional.custom(qn), readonly: e.optional.constant(false) }));
}
function te(n) {
  return n ? 0.1 : 1;
}
function Wn(n) {
  var e;
  return (e = n.color) === null || e === void 0 ? void 0 : e.type;
}
class $t {
  constructor(e, t) {
    this.type = "float", this.mode = t, this.comps_ = Yn(e, t, this.type);
  }
  getComponents(e) {
    return Xe(Xn(j(this.comps_), { mode: this.mode, type: this.type }, { mode: e ?? this.mode, type: this.type }), this.comps_[3]);
  }
  toRgbaObject() {
    const e = this.getComponents("rgb");
    return { r: e[0], g: e[1], b: e[2], a: e[3] };
  }
}
const fr = { int: (n, e) => new m(n, e), float: (n, e) => new $t(n, e) };
function Kt(n, e, t) {
  return fr[t](n, e);
}
function Cr(n) {
  return n.type === "float";
}
function gr(n) {
  return n.type === "int";
}
function Pr(n) {
  const e = n.getComponents(), t = pe(n.mode, "int");
  return new m([Math.round(u(e[0], 0, 1, 0, t[0])), Math.round(u(e[1], 0, 1, 0, t[1])), Math.round(u(e[2], 0, 1, 0, t[2])), e[3]], n.mode);
}
function Er(n) {
  const e = n.getComponents(), t = pe(n.mode, "int");
  return new $t([u(e[0], 0, t[0], 0, 1), u(e[1], 0, t[1], 0, 1), u(e[2], 0, t[2], 0, 1), e[3]], n.mode);
}
function k(n, e) {
  if (n.type === e) return n;
  if (gr(n) && e === "float") return Er(n);
  if (Cr(n) && e === "int") return Pr(n);
  throw x.shouldNeverHappen();
}
function yr(n, e) {
  return n.alpha === e.alpha && n.mode === e.mode && n.notation === e.notation && n.type === e.type;
}
function S(n, e) {
  const t = n.match(/^(.+)%$/);
  return Math.min(t ? parseFloat(t[1]) * 0.01 * e : parseFloat(n), e);
}
const xr = { deg: (n) => n, grad: (n) => n * 360 / 400, rad: (n) => n * 360 / (2 * Math.PI), turn: (n) => n * 360 };
function Jn(n) {
  const e = n.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
  if (!e) return parseFloat(n);
  const t = parseFloat(e[1]), s = e[2];
  return xr[s](t);
}
function Zn(n) {
  const e = n.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [S(e[1], 255), S(e[2], 255), S(e[3], 255)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) ? null : t;
}
function kr(n) {
  const e = Zn(n);
  return e ? new m(e, "rgb") : null;
}
function Qn(n) {
  const e = n.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [S(e[1], 255), S(e[2], 255), S(e[3], 255), S(e[4], 1)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]) ? null : t;
}
function Vr(n) {
  const e = Qn(n);
  return e ? new m(e, "rgb") : null;
}
function es(n) {
  const e = n.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [Jn(e[1]), S(e[2], 100), S(e[3], 100)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) ? null : t;
}
function Lr(n) {
  const e = es(n);
  return e ? new m(e, "hsl") : null;
}
function ts(n) {
  const e = n.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
  if (!e) return null;
  const t = [Jn(e[1]), S(e[2], 100), S(e[3], 100), S(e[4], 1)];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]) ? null : t;
}
function Sr(n) {
  const e = ts(n);
  return e ? new m(e, "hsl") : null;
}
function ns(n) {
  const e = n.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
  if (e) return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)];
  const t = n.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
  return t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : null;
}
function Mr(n) {
  const e = ns(n);
  return e ? new m(e, "rgb") : null;
}
function ss(n) {
  const e = n.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
  if (e) return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16), u(parseInt(e[4] + e[4], 16), 0, 255, 0, 1)];
  const t = n.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
  return t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16), u(parseInt(t[4], 16), 0, 255, 0, 1)] : null;
}
function Tr(n) {
  const e = ss(n);
  return e ? new m(e, "rgb") : null;
}
function is(n) {
  const e = n.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
  if (!e) return null;
  const t = [parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3])];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) ? null : t;
}
function Ar(n) {
  return (e) => {
    const t = is(e);
    return t ? Kt(t, "rgb", n) : null;
  };
}
function rs(n) {
  const e = n.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
  if (!e) return null;
  const t = [parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]), parseFloat(e[4])];
  return isNaN(t[0]) || isNaN(t[1]) || isNaN(t[2]) || isNaN(t[3]) ? null : t;
}
function Or(n) {
  return (e) => {
    const t = rs(e);
    return t ? Kt(t, "rgb", n) : null;
  };
}
const Dr = [{ parser: ns, result: { alpha: false, mode: "rgb", notation: "hex" } }, { parser: ss, result: { alpha: true, mode: "rgb", notation: "hex" } }, { parser: Zn, result: { alpha: false, mode: "rgb", notation: "func" } }, { parser: Qn, result: { alpha: true, mode: "rgb", notation: "func" } }, { parser: es, result: { alpha: false, mode: "hsl", notation: "func" } }, { parser: ts, result: { alpha: true, mode: "hsl", notation: "func" } }, { parser: is, result: { alpha: false, mode: "rgb", notation: "object" } }, { parser: rs, result: { alpha: true, mode: "rgb", notation: "object" } }];
function Rr(n) {
  return Dr.reduce((e, { parser: t, result: s }) => e || (t(n) ? s : null), null);
}
function Nr(n, e = "int") {
  const t = Rr(n);
  return t ? t.notation === "hex" && e !== "float" ? Object.assign(Object.assign({}, t), { type: "int" }) : t.notation === "func" ? Object.assign(Object.assign({}, t), { type: e }) : null : null;
}
function Se(n) {
  const e = [Mr, Tr, kr, Vr, Lr, Sr];
  e.push(Ar("int"), Or("int"));
  const t = Ji(e);
  return (s) => {
    const i = t(s);
    return i ? k(i, n) : null;
  };
}
function jr(n) {
  const e = Se("int");
  if (typeof n != "string") return m.black();
  const t = e(n);
  return t ?? m.black();
}
function os(n) {
  const e = b(Math.floor(n), 0, 255).toString(16);
  return e.length === 1 ? `0${e}` : e;
}
function Ut(n, e = "#") {
  const t = j(n.getComponents("rgb")).map(os).join("");
  return `${e}${t}`;
}
function Ht(n, e = "#") {
  const t = n.getComponents("rgb"), s = [t[0], t[1], t[2], t[3] * 255].map(os).join("");
  return `${e}${s}`;
}
function ls(n) {
  const e = E(0), t = k(n, "int");
  return `rgb(${j(t.getComponents("rgb")).map((i) => e(i)).join(", ")})`;
}
function De(n) {
  const e = E(2), t = E(0);
  return `rgba(${k(n, "int").getComponents("rgb").map((r, o) => (o === 3 ? e : t)(r)).join(", ")})`;
}
function Br(n) {
  const e = [E(0), Ie, Ie], t = k(n, "int");
  return `hsl(${j(t.getComponents("hsl")).map((i, r) => e[r](i)).join(", ")})`;
}
function Ir(n) {
  const e = [E(0), Ie, Ie, E(2)];
  return `hsla(${k(n, "int").getComponents("hsl").map((i, r) => e[r](i)).join(", ")})`;
}
function as(n, e) {
  const t = E(e === "float" ? 2 : 0), s = ["r", "g", "b"], i = k(n, e);
  return `{${j(i.getComponents("rgb")).map((o, l) => `${s[l]}: ${t(o)}`).join(", ")}}`;
}
function zr(n) {
  return (e) => as(e, n);
}
function hs(n, e) {
  const t = E(2), s = E(e === "float" ? 2 : 0), i = ["r", "g", "b", "a"];
  return `{${k(n, e).getComponents("rgb").map((l, a) => {
    const h = a === 3 ? t : s;
    return `${i[a]}: ${h(l)}`;
  }).join(", ")}}`;
}
function Fr(n) {
  return (e) => hs(e, n);
}
const $r = [{ format: { alpha: false, mode: "rgb", notation: "hex", type: "int" }, stringifier: Ut }, { format: { alpha: true, mode: "rgb", notation: "hex", type: "int" }, stringifier: Ht }, { format: { alpha: false, mode: "rgb", notation: "func", type: "int" }, stringifier: ls }, { format: { alpha: true, mode: "rgb", notation: "func", type: "int" }, stringifier: De }, { format: { alpha: false, mode: "hsl", notation: "func", type: "int" }, stringifier: Br }, { format: { alpha: true, mode: "hsl", notation: "func", type: "int" }, stringifier: Ir }, ...["int", "float"].reduce((n, e) => [...n, { format: { alpha: false, mode: "rgb", notation: "object", type: e }, stringifier: zr(e) }, { format: { alpha: true, mode: "rgb", notation: "object", type: e }, stringifier: Fr(e) }], [])];
function us(n) {
  return $r.reduce((e, t) => e || (yr(t.format, n) ? t.stringifier : null), null);
}
const fe = p("apl");
class Kr {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.value = t.value, this.value.emitter.on("change", this.onValueChange_), this.element = e.createElement("div"), this.element.classList.add(fe()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("div");
    s.classList.add(fe("b")), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(fe("c")), s.appendChild(i), this.colorElem_ = i;
    const r = e.createElement("div");
    r.classList.add(fe("m")), this.element.appendChild(r), this.markerElem_ = r;
    const o = e.createElement("div");
    o.classList.add(fe("p")), this.markerElem_.appendChild(o), this.previewElem_ = o, this.update_();
  }
  update_() {
    const e = this.value.rawValue, t = e.getComponents("rgb"), s = new m([t[0], t[1], t[2], 0], "rgb"), i = new m([t[0], t[1], t[2], 255], "rgb"), r = ["to right", De(s), De(i)];
    this.colorElem_.style.background = `linear-gradient(${r.join(",")})`, this.previewElem_.style.backgroundColor = De(e);
    const o = u(t[3], 0, 1, 0, 100);
    this.markerElem_.style.left = `${o}%`;
  }
  onValueChange_() {
    this.update_();
  }
}
class Ur {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new Kr(e, { value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new F(this.view.element), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = e.point.x / e.bounds.width, i = this.value.rawValue, [r, o, l] = i.getComponents("hsv");
    this.value.setRawValue(new m([r, o, l, s], "hsv"), t);
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
    const t = P(te(true), D(e));
    if (t === 0) return;
    const s = this.value.rawValue, [i, r, o, l] = s.getComponents("hsv");
    this.value.setRawValue(new m([i, r, o, l + t], "hsv"), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    P(te(true), D(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
const oe = p("coltxt");
function Hr(n) {
  const e = n.createElement("select"), t = [{ text: "RGB", value: "rgb" }, { text: "HSL", value: "hsl" }, { text: "HSV", value: "hsv" }, { text: "HEX", value: "hex" }];
  return e.appendChild(t.reduce((s, i) => {
    const r = n.createElement("option");
    return r.textContent = i.text, r.value = i.value, s.appendChild(r), s;
  }, n.createDocumentFragment())), e;
}
class qr {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(oe()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(oe("m")), this.modeElem_ = Hr(e), this.modeElem_.classList.add(oe("ms")), s.appendChild(this.modeSelectElement), t.viewProps.bindDisabled(this.modeElem_);
    const i = e.createElement("div");
    i.classList.add(oe("mm")), i.appendChild(Ke(e, "dropdown")), s.appendChild(i), this.element.appendChild(s);
    const r = e.createElement("div");
    r.classList.add(oe("w")), this.element.appendChild(r), this.inputsElem_ = r, this.inputViews_ = t.inputViews, this.applyInputViews_(), M(t.mode, (o) => {
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
    jn(this.inputsElem_);
    const e = this.element.ownerDocument;
    this.inputViews_.forEach((t) => {
      const s = e.createElement("div");
      s.classList.add(oe("c")), s.appendChild(t.element), this.inputsElem_.appendChild(s);
    });
  }
}
function Gr(n) {
  return E(n === "float" ? 2 : 0);
}
function Yr(n, e, t) {
  const s = pe(n, e)[t];
  return new ke({ min: 0, max: s });
}
function Xr(n, e, t) {
  return new Le(n, { arrayPosition: t === 0 ? "fst" : t === 2 ? "lst" : "mid", parser: e.parser, props: c.fromObject({ formatter: Gr(e.colorType), keyScale: te(false), pointerScale: e.colorType === "float" ? 0.01 : 1 }), value: _(0, { constraint: Yr(e.colorMode, e.colorType, t) }), viewProps: e.viewProps });
}
function Wr(n, e) {
  const t = { colorMode: e.colorMode, colorType: e.colorType, parser: O, viewProps: e.viewProps };
  return [0, 1, 2].map((s) => {
    const i = Xr(n, t, s);
    return re({ primary: e.value, secondary: i.value, forward(r) {
      return k(r, e.colorType).getComponents(e.colorMode)[s];
    }, backward(r, o) {
      const l = e.colorMode, h = k(r, e.colorType).getComponents(l);
      h[s] = o;
      const d = Kt(Xe(j(h), h[3]), l, e.colorType);
      return k(d, "int");
    } }), i;
  });
}
function Jr(n, e) {
  const t = new Ye(n, { parser: Se("int"), props: c.fromObject({ formatter: Ut }), value: _(m.black()), viewProps: e.viewProps });
  return re({ primary: e.value, secondary: t.value, forward: (s) => new m(j(s.getComponents()), s.mode), backward: (s, i) => new m(Xe(j(i.getComponents(s.mode)), s.getComponents()[3]), s.mode) }), [t];
}
function Zr(n) {
  return n !== "hex";
}
class Qr {
  constructor(e, t) {
    this.onModeSelectChange_ = this.onModeSelectChange_.bind(this), this.colorType_ = t.colorType, this.value = t.value, this.viewProps = t.viewProps, this.colorMode = _(this.value.rawValue.mode), this.ccs_ = this.createComponentControllers_(e), this.view = new qr(e, { mode: this.colorMode, inputViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view], viewProps: this.viewProps }), this.view.modeSelectElement.addEventListener("change", this.onModeSelectChange_);
  }
  createComponentControllers_(e) {
    const t = this.colorMode.rawValue;
    return Zr(t) ? Wr(e, { colorMode: t, colorType: this.colorType_, value: this.value, viewProps: this.viewProps }) : Jr(e, { value: this.value, viewProps: this.viewProps });
  }
  onModeSelectChange_(e) {
    const t = e.currentTarget;
    this.colorMode.rawValue = t.value, this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument), this.view.inputViews = this.ccs_.map((s) => s.view);
  }
}
const rt = p("hpl");
class eo {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.value = t.value, this.value.emitter.on("change", this.onValueChange_), this.element = e.createElement("div"), this.element.classList.add(rt()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("div");
    s.classList.add(rt("c")), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(rt("m")), this.element.appendChild(i), this.markerElem_ = i, this.update_();
  }
  update_() {
    const e = this.value.rawValue, [t] = e.getComponents("hsv");
    this.markerElem_.style.backgroundColor = ls(new m([t, 100, 100], "hsv"));
    const s = u(t, 0, 360, 0, 100);
    this.markerElem_.style.left = `${s}%`;
  }
  onValueChange_() {
    this.update_();
  }
}
class to {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new eo(e, { value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new F(this.view.element), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = u(b(e.point.x, 0, e.bounds.width), 0, e.bounds.width, 0, 360), i = this.value.rawValue, [, r, o, l] = i.getComponents("hsv");
    this.value.setRawValue(new m([s, r, o, l], "hsv"), t);
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
    const t = P(te(false), D(e));
    if (t === 0) return;
    const s = this.value.rawValue, [i, r, o, l] = s.getComponents("hsv");
    this.value.setRawValue(new m([i + t, r, o, l], "hsv"), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    P(te(false), D(e)) !== 0 && this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
const ot = p("svp"), vn = 64;
class no {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), this.value = t.value, this.value.emitter.on("change", this.onValueChange_), this.element = e.createElement("div"), this.element.classList.add(ot()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("canvas");
    s.height = vn, s.width = vn, s.classList.add(ot("c")), this.element.appendChild(s), this.canvasElement = s;
    const i = e.createElement("div");
    i.classList.add(ot("m")), this.element.appendChild(i), this.markerElem_ = i, this.update_();
  }
  update_() {
    const e = ui(this.canvasElement);
    if (!e) return;
    const s = this.value.rawValue.getComponents("hsv"), i = this.canvasElement.width, r = this.canvasElement.height, o = e.getImageData(0, 0, i, r), l = o.data;
    for (let d = 0; d < r; d++) for (let v = 0; v < i; v++) {
      const Je = u(v, 0, i, 0, 100), Ze = u(d, 0, r, 100, 0), Qe = Gn(s[0], Je, Ze), Te = (d * i + v) * 4;
      l[Te] = Qe[0], l[Te + 1] = Qe[1], l[Te + 2] = Qe[2], l[Te + 3] = 255;
    }
    e.putImageData(o, 0, 0);
    const a = u(s[1], 0, 100, 0, 100);
    this.markerElem_.style.left = `${a}%`;
    const h = u(s[2], 0, 100, 100, 0);
    this.markerElem_.style.top = `${h}%`;
  }
  onValueChange_() {
    this.update_();
  }
}
class so {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.view = new no(e, { value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new F(this.view.element), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = u(e.point.x, 0, e.bounds.width, 0, 100), i = u(e.point.y, 0, e.bounds.height, 100, 0), [r, , , o] = this.value.rawValue.getComponents("hsv");
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
    ze(e.key) && e.preventDefault();
    const [t, s, i, r] = this.value.rawValue.getComponents("hsv"), o = te(false), l = P(o, D(e)), a = P(o, ee(e));
    l === 0 && a === 0 || this.value.setRawValue(new m([t, s + l, i + a, r], "hsv"), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    const t = te(false), s = P(t, D(e)), i = P(t, ee(e));
    s === 0 && i === 0 || this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
class io {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.hPaletteC_ = new to(e, { value: this.value, viewProps: this.viewProps }), this.svPaletteC_ = new so(e, { value: this.value, viewProps: this.viewProps }), this.alphaIcs_ = t.supportsAlpha ? { palette: new Ur(e, { value: this.value, viewProps: this.viewProps }), text: new Le(e, { parser: O, props: c.fromObject({ pointerScale: 0.01, keyScale: 0.1, formatter: E(2) }), value: _(0, { constraint: new ke({ min: 0, max: 1 }) }), viewProps: this.viewProps }) } : null, this.alphaIcs_ && re({ primary: this.value, secondary: this.alphaIcs_.text.value, forward: (s) => s.getComponents()[3], backward: (s, i) => {
      const r = s.getComponents();
      return r[3] = i, new m(r, s.mode);
    } }), this.textsC_ = new Qr(e, { colorType: t.colorType, value: this.value, viewProps: this.viewProps }), this.view = new br(e, { alphaViews: this.alphaIcs_ ? { palette: this.alphaIcs_.palette.view, text: this.alphaIcs_.text.view } : null, hPaletteView: this.hPaletteC_.view, supportsAlpha: t.supportsAlpha, svPaletteView: this.svPaletteC_.view, textsView: this.textsC_.view, viewProps: this.viewProps });
  }
  get textsController() {
    return this.textsC_;
  }
}
const lt = p("colsw");
class ro {
  constructor(e, t) {
    this.onValueChange_ = this.onValueChange_.bind(this), t.value.emitter.on("change", this.onValueChange_), this.value = t.value, this.element = e.createElement("div"), this.element.classList.add(lt()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(lt("sw")), this.element.appendChild(s), this.swatchElem_ = s;
    const i = e.createElement("button");
    i.classList.add(lt("b")), t.viewProps.bindDisabled(i), this.element.appendChild(i), this.buttonElement = i, this.update_();
  }
  update_() {
    const e = this.value.rawValue;
    this.swatchElem_.style.backgroundColor = Ht(e);
  }
  onValueChange_() {
    this.update_();
  }
}
class oo {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new ro(e, { value: this.value, viewProps: this.viewProps });
  }
}
class qt {
  constructor(e, t) {
    this.onButtonBlur_ = this.onButtonBlur_.bind(this), this.onButtonClick_ = this.onButtonClick_.bind(this), this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this), this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.foldable_ = de.create(t.expanded), this.swatchC_ = new oo(e, { value: this.value, viewProps: this.viewProps });
    const s = this.swatchC_.view.buttonElement;
    s.addEventListener("blur", this.onButtonBlur_), s.addEventListener("click", this.onButtonClick_), this.textC_ = new Ye(e, { parser: t.parser, props: c.fromObject({ formatter: t.formatter }), value: this.value, viewProps: this.viewProps }), this.view = new hr(e, { foldable: this.foldable_, pickerLayout: t.pickerLayout }), this.view.swatchElement.appendChild(this.swatchC_.view.element), this.view.textElement.appendChild(this.textC_.view.element), this.popC_ = t.pickerLayout === "popup" ? new Bt(e, { viewProps: this.viewProps }) : null;
    const i = new io(e, { colorType: t.colorType, supportsAlpha: t.supportsAlpha, value: this.value, viewProps: this.viewProps });
    i.view.allFocusableElements.forEach((r) => {
      r.addEventListener("blur", this.onPopupChildBlur_), r.addEventListener("keydown", this.onPopupChildKeydown_);
    }), this.pickerC_ = i, this.popC_ ? (this.view.element.appendChild(this.popC_.view.element), this.popC_.view.element.appendChild(i.view.element), re({ primary: this.foldable_.value("expanded"), secondary: this.popC_.shows, forward: (r) => r, backward: (r, o) => o })) : this.view.pickerElement && (this.view.pickerElement.appendChild(this.pickerC_.view.element), He(this.foldable_, this.view.pickerElement));
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
    const t = this.popC_.view.element, s = Tt(e);
    s && t.contains(s) || s && s === this.swatchC_.view.buttonElement && !$e(t.ownerDocument) || (this.popC_.shows.rawValue = false);
  }
  onPopupChildKeydown_(e) {
    this.popC_ ? e.key === "Escape" && (this.popC_.shows.rawValue = false) : this.view.pickerElement && e.key === "Escape" && this.swatchC_.view.buttonElement.focus();
  }
}
function lo(n) {
  return j(n.getComponents("rgb")).reduce((e, t) => e << 8 | Math.floor(t) & 255, 0);
}
function ao(n) {
  return n.getComponents("rgb").reduce((e, t, s) => {
    const i = Math.floor(s === 3 ? t * 255 : t) & 255;
    return e << 8 | i;
  }, 0) >>> 0;
}
function ho(n) {
  return new m([n >> 16 & 255, n >> 8 & 255, n & 255], "rgb");
}
function uo(n) {
  return new m([n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, u(n & 255, 0, 255, 0, 1)], "rgb");
}
function co(n) {
  return typeof n != "number" ? m.black() : ho(n);
}
function po(n) {
  return typeof n != "number" ? m.black() : uo(n);
}
function Re(n, e) {
  return typeof n != "object" || w(n) ? false : e in n && typeof n[e] == "number";
}
function cs(n) {
  return Re(n, "r") && Re(n, "g") && Re(n, "b");
}
function ps(n) {
  return cs(n) && Re(n, "a");
}
function ds(n) {
  return cs(n);
}
function Gt(n, e) {
  if (n.mode !== e.mode || n.type !== e.type) return false;
  const t = n.getComponents(), s = e.getComponents();
  for (let i = 0; i < t.length; i++) if (t[i] !== s[i]) return false;
  return true;
}
function wn(n) {
  return "a" in n ? [n.r, n.g, n.b, n.a] : [n.r, n.g, n.b];
}
function mo(n) {
  const e = us(n);
  return e ? (t, s) => {
    X(t, e(s));
  } : null;
}
function vo(n) {
  const e = n ? ao : lo;
  return (t, s) => {
    X(t, e(s));
  };
}
function wo(n, e, t) {
  const i = k(e, t).toRgbaObject();
  n.writeProperty("r", i.r), n.writeProperty("g", i.g), n.writeProperty("b", i.b), n.writeProperty("a", i.a);
}
function bo(n, e, t) {
  const i = k(e, t).toRgbaObject();
  n.writeProperty("r", i.r), n.writeProperty("g", i.g), n.writeProperty("b", i.b);
}
function _o(n, e) {
  return (t, s) => {
    n ? wo(t, s, e) : bo(t, s, e);
  };
}
function fo(n) {
  var e;
  return !!(!((e = n == null ? void 0 : n.color) === null || e === void 0) && e.alpha);
}
function Co(n) {
  return n ? (e) => Ht(e, "0x") : (e) => Ut(e, "0x");
}
function go(n) {
  return "color" in n || n.view === "color";
}
C({ id: "input-color-number", type: "input", accept: (n, e) => {
  if (typeof n != "number" || !go(e)) return null;
  const t = Ft(e);
  return t ? { initialValue: n, params: Object.assign(Object.assign({}, t), { supportsAlpha: fo(e) }) } : null;
}, binding: { reader: (n) => n.params.supportsAlpha ? po : co, equals: Gt, writer: (n) => vo(n.params.supportsAlpha) }, controller: (n) => {
  var e, t;
  return new qt(n.document, { colorType: "int", expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, formatter: Co(n.params.supportsAlpha), parser: Se("int"), pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", supportsAlpha: n.params.supportsAlpha, value: n.value, viewProps: n.viewProps });
} });
function Po(n, e) {
  if (!ds(n)) return k(m.black(), e);
  if (e === "int") {
    const t = wn(n);
    return new m(t, "rgb");
  }
  if (e === "float") {
    const t = wn(n);
    return new $t(t, "rgb");
  }
  return k(m.black(), "int");
}
function Eo(n) {
  return ps(n);
}
function yo(n) {
  return (e) => {
    const t = Po(e, n);
    return k(t, "int");
  };
}
function xo(n, e) {
  return (t) => n ? hs(t, e) : as(t, e);
}
C({ id: "input-color-object", type: "input", accept: (n, e) => {
  var t;
  if (!ds(n)) return null;
  const s = Ft(e);
  return s ? { initialValue: n, params: Object.assign(Object.assign({}, s), { colorType: (t = Wn(e)) !== null && t !== void 0 ? t : "int" }) } : null;
}, binding: { reader: (n) => yo(n.params.colorType), equals: Gt, writer: (n) => _o(Eo(n.initialValue), n.params.colorType) }, controller: (n) => {
  var e, t;
  const s = ps(n.initialValue);
  return new qt(n.document, { colorType: n.params.colorType, expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, formatter: xo(s, n.params.colorType), parser: Se("int"), pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", supportsAlpha: s, value: n.value, viewProps: n.viewProps });
} });
C({ id: "input-color-string", type: "input", accept: (n, e) => {
  if (typeof n != "string" || e.view === "text") return null;
  const t = Nr(n, Wn(e));
  if (!t) return null;
  const s = us(t);
  if (!s) return null;
  const i = Ft(e);
  return i ? { initialValue: n, params: Object.assign(Object.assign({}, i), { format: t, stringifier: s }) } : null;
}, binding: { reader: () => jr, equals: Gt, writer: (n) => {
  const e = mo(n.params.format);
  if (!e) throw x.notBindable();
  return e;
} }, controller: (n) => {
  var e, t;
  return new qt(n.document, { colorType: n.params.format.type, expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, formatter: n.params.stringifier, parser: Se("int"), pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", supportsAlpha: n.params.format.alpha, value: n.value, viewProps: n.viewProps });
} });
class We {
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
const bn = p("pndtxt");
class ko {
  constructor(e, t) {
    this.textViews = t.textViews, this.element = e.createElement("div"), this.element.classList.add(bn()), this.textViews.forEach((s) => {
      const i = e.createElement("div");
      i.classList.add(bn("a")), i.appendChild(s.element), this.element.appendChild(i);
    });
  }
}
function Vo(n, e, t) {
  return new Le(n, { arrayPosition: t === 0 ? "fst" : t === e.axes.length - 1 ? "lst" : "mid", parser: e.parser, props: e.axes[t].textProps, value: _(0, { constraint: e.axes[t].constraint }), viewProps: e.viewProps });
}
class ve {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.acs_ = t.axes.map((s, i) => Vo(e, t, i)), this.acs_.forEach((s, i) => {
      re({ primary: this.value, secondary: s.value, forward: (r) => t.assembly.toComponents(r)[i], backward: (r, o) => {
        const l = t.assembly.toComponents(r);
        return l[i] = o, t.assembly.fromComponents(l);
      } });
    }), this.view = new ko(e, { textViews: this.acs_.map((s) => s.view) });
  }
  get textControllers() {
    return this.acs_;
  }
}
class Lo extends St {
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
function So(n, e) {
  const t = [], s = yt(n, e);
  s && t.push(s);
  const i = xt(n);
  i && t.push(i);
  const r = jt(n.options);
  return r && t.push(r), new me(t);
}
C({ id: "input-number", type: "input", accept: (n, e) => {
  if (typeof n != "number") return null;
  const t = f(e, (s) => Object.assign(Object.assign({}, Vt(s)), { options: s.optional.custom(Ge), readonly: s.optional.constant(false) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => Et, constraint: (n) => So(n.params, n.initialValue), writer: (n) => X }, controller: (n) => {
  const e = n.value, t = n.constraint, s = t && ye(t, qe);
  if (s) return new ce(n.document, { props: new c({ options: s.values.value("options") }), value: e, viewProps: n.viewProps });
  const i = kt(n.params, e.rawValue), r = t && ye(t, ke);
  return r ? new dn(n.document, Object.assign(Object.assign({}, ir(Object.assign(Object.assign({}, i), { keyScale: _(i.keyScale), max: r.values.value("max"), min: r.values.value("min") }))), { parser: O, value: e, viewProps: n.viewProps })) : new Le(n.document, { parser: O, props: c.fromObject(i), value: e, viewProps: n.viewProps });
}, api(n) {
  return typeof n.controller.value.rawValue != "number" ? null : n.controller.valueController instanceof dn ? new Lo(n.controller) : n.controller.valueController instanceof ce ? new Nt(n.controller) : null;
} });
class G {
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
const ms = { toComponents: (n) => n.getComponents(), fromComponents: (n) => new G(...n) }, le = p("p2d");
class Mo {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(le()), t.viewProps.bindClassModifiers(this.element), M(t.expanded, Y(this.element, le(void 0, "expanded")));
    const s = e.createElement("div");
    s.classList.add(le("h")), this.element.appendChild(s);
    const i = e.createElement("button");
    i.classList.add(le("b")), i.appendChild(Ke(e, "p2dpad")), t.viewProps.bindDisabled(i), s.appendChild(i), this.buttonElement = i;
    const r = e.createElement("div");
    if (r.classList.add(le("t")), s.appendChild(r), this.textElement = r, t.pickerLayout === "inline") {
      const o = e.createElement("div");
      o.classList.add(le("p")), this.element.appendChild(o), this.pickerElement = o;
    } else this.pickerElement = null;
  }
}
const K = p("p2dp");
class To {
  constructor(e, t) {
    this.onFoldableChange_ = this.onFoldableChange_.bind(this), this.onPropsChange_ = this.onPropsChange_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.props_ = t.props, this.props_.emitter.on("change", this.onPropsChange_), this.element = e.createElement("div"), this.element.classList.add(K()), t.layout === "popup" && this.element.classList.add(K(void 0, "p")), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(K("p")), t.viewProps.bindTabIndex(s), this.element.appendChild(s), this.padElement = s;
    const i = e.createElementNS(g, "svg");
    i.classList.add(K("g")), this.padElement.appendChild(i), this.svgElem_ = i;
    const r = e.createElementNS(g, "line");
    r.classList.add(K("ax")), r.setAttributeNS(null, "x1", "0"), r.setAttributeNS(null, "y1", "50%"), r.setAttributeNS(null, "x2", "100%"), r.setAttributeNS(null, "y2", "50%"), this.svgElem_.appendChild(r);
    const o = e.createElementNS(g, "line");
    o.classList.add(K("ax")), o.setAttributeNS(null, "x1", "50%"), o.setAttributeNS(null, "y1", "0"), o.setAttributeNS(null, "x2", "50%"), o.setAttributeNS(null, "y2", "100%"), this.svgElem_.appendChild(o);
    const l = e.createElementNS(g, "line");
    l.classList.add(K("l")), l.setAttributeNS(null, "x1", "50%"), l.setAttributeNS(null, "y1", "50%"), this.svgElem_.appendChild(l), this.lineElem_ = l;
    const a = e.createElement("div");
    a.classList.add(K("m")), this.padElement.appendChild(a), this.markerElem_ = a, t.value.emitter.on("change", this.onValueChange_), this.value = t.value, this.update_();
  }
  get allFocusableElements() {
    return [this.padElement];
  }
  update_() {
    const [e, t] = this.value.rawValue.getComponents(), s = this.props_.get("max"), i = u(e, -s, +s, 0, 100), r = u(t, -s, +s, 0, 100), o = this.props_.get("invertsY") ? 100 - r : r;
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
function _n(n, e, t) {
  return [P(e[0], D(n)), P(e[1], ee(n)) * (t ? 1 : -1)];
}
class Ao {
  constructor(e, t) {
    this.onPadKeyDown_ = this.onPadKeyDown_.bind(this), this.onPadKeyUp_ = this.onPadKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.view = new To(e, { layout: t.layout, props: this.props, value: this.value, viewProps: this.viewProps }), this.ptHandler_ = new F(this.view.padElement), this.ptHandler_.emitter.on("down", this.onPointerDown_), this.ptHandler_.emitter.on("move", this.onPointerMove_), this.ptHandler_.emitter.on("up", this.onPointerUp_), this.view.padElement.addEventListener("keydown", this.onPadKeyDown_), this.view.padElement.addEventListener("keyup", this.onPadKeyUp_);
  }
  handlePointerEvent_(e, t) {
    if (!e.point) return;
    const s = this.props.get("max"), i = u(e.point.x, 0, e.bounds.width, -s, +s), r = u(this.props.get("invertsY") ? e.bounds.height - e.point.y : e.point.y, 0, e.bounds.height, -s, +s);
    this.value.setRawValue(new G(i, r), t);
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
    ze(e.key) && e.preventDefault();
    const [t, s] = _n(e, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
    t === 0 && s === 0 || this.value.setRawValue(new G(this.value.rawValue.x + t, this.value.rawValue.y + s), { forceEmit: false, last: false });
  }
  onPadKeyUp_(e) {
    const [t, s] = _n(e, [this.props.get("xKeyScale"), this.props.get("yKeyScale")], this.props.get("invertsY"));
    t === 0 && s === 0 || this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
class Oo {
  constructor(e, t) {
    var s, i;
    this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this), this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this), this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this), this.onPadButtonClick_ = this.onPadButtonClick_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.foldable_ = de.create(t.expanded), this.popC_ = t.pickerLayout === "popup" ? new Bt(e, { viewProps: this.viewProps }) : null;
    const r = new Ao(e, { layout: t.pickerLayout, props: new c({ invertsY: _(t.invertsY), max: _(t.max), xKeyScale: t.axes[0].textProps.value("keyScale"), yKeyScale: t.axes[1].textProps.value("keyScale") }), value: this.value, viewProps: this.viewProps });
    r.view.allFocusableElements.forEach((o) => {
      o.addEventListener("blur", this.onPopupChildBlur_), o.addEventListener("keydown", this.onPopupChildKeydown_);
    }), this.pickerC_ = r, this.textC_ = new ve(e, { assembly: ms, axes: t.axes, parser: t.parser, value: this.value, viewProps: this.viewProps }), this.view = new Mo(e, { expanded: this.foldable_.value("expanded"), pickerLayout: t.pickerLayout, viewProps: this.viewProps }), this.view.textElement.appendChild(this.textC_.view.element), (s = this.view.buttonElement) === null || s === void 0 || s.addEventListener("blur", this.onPadButtonBlur_), (i = this.view.buttonElement) === null || i === void 0 || i.addEventListener("click", this.onPadButtonClick_), this.popC_ ? (this.view.element.appendChild(this.popC_.view.element), this.popC_.view.element.appendChild(this.pickerC_.view.element), re({ primary: this.foldable_.value("expanded"), secondary: this.popC_.shows, forward: (o) => o, backward: (o, l) => l })) : this.view.pickerElement && (this.view.pickerElement.appendChild(this.pickerC_.view.element), He(this.foldable_, this.view.pickerElement));
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
    const t = this.popC_.view.element, s = Tt(e);
    s && t.contains(s) || s && s === this.view.buttonElement && !$e(t.ownerDocument) || (this.popC_.shows.rawValue = false);
  }
  onPopupChildKeydown_(e) {
    this.popC_ ? e.key === "Escape" && (this.popC_.shows.rawValue = false) : this.view.pickerElement && e.key === "Escape" && this.view.buttonElement.focus();
  }
}
function Do(n) {
  return G.isObject(n) ? new G(n.x, n.y) : new G();
}
function Ro(n, e) {
  n.writeProperty("x", e.x), n.writeProperty("y", e.y);
}
function No(n, e) {
  return new We({ assembly: ms, components: [I(Object.assign(Object.assign({}, n), n.x), e.x), I(Object.assign(Object.assign({}, n), n.y), e.y)] });
}
function fn(n, e) {
  var t, s;
  if (!w(n.min) || !w(n.max)) return Math.max(Math.abs((t = n.min) !== null && t !== void 0 ? t : 0), Math.abs((s = n.max) !== null && s !== void 0 ? s : 0));
  const i = Rn(n);
  return Math.max(Math.abs(i) * 10, Math.abs(e) * 10);
}
function jo(n, e) {
  var t, s;
  const i = fn(Q(n, (t = n.x) !== null && t !== void 0 ? t : {}), e.x), r = fn(Q(n, (s = n.y) !== null && s !== void 0 ? s : {}), e.y);
  return Math.max(i, r);
}
function Bo(n) {
  if (!("y" in n)) return false;
  const e = n.y;
  return e && "inverted" in e ? !!e.inverted : false;
}
C({ id: "input-point2d", type: "input", accept: (n, e) => {
  if (!G.isObject(n)) return null;
  const t = f(e, (s) => Object.assign(Object.assign({}, xe(s)), { expanded: s.optional.boolean, picker: s.optional.custom(qn), readonly: s.optional.constant(false), x: s.optional.custom(q), y: s.optional.object(Object.assign(Object.assign({}, xe(s)), { inverted: s.optional.boolean })) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: () => Do, constraint: (n) => No(n.params, n.initialValue), equals: G.equals, writer: () => Ro }, controller: (n) => {
  var e, t;
  const s = n.document, i = n.value, r = n.constraint, o = [n.params.x, n.params.y];
  return new Oo(s, { axes: i.rawValue.getComponents().map((l, a) => {
    var h;
    return Lt({ constraint: r.components[a], initialValue: l, params: Q(n.params, (h = o[a]) !== null && h !== void 0 ? h : {}) });
  }), expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, invertsY: Bo(n.params), max: jo(n.params, i.rawValue), parser: O, pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", value: i, viewProps: n.viewProps });
} });
class he {
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
const vs = { toComponents: (n) => n.getComponents(), fromComponents: (n) => new he(...n) };
function Io(n) {
  return he.isObject(n) ? new he(n.x, n.y, n.z) : new he();
}
function zo(n, e) {
  n.writeProperty("x", e.x), n.writeProperty("y", e.y), n.writeProperty("z", e.z);
}
function Fo(n, e) {
  return new We({ assembly: vs, components: [I(Object.assign(Object.assign({}, n), n.x), e.x), I(Object.assign(Object.assign({}, n), n.y), e.y), I(Object.assign(Object.assign({}, n), n.z), e.z)] });
}
C({ id: "input-point3d", type: "input", accept: (n, e) => {
  if (!he.isObject(n)) return null;
  const t = f(e, (s) => Object.assign(Object.assign({}, xe(s)), { readonly: s.optional.constant(false), x: s.optional.custom(q), y: s.optional.custom(q), z: s.optional.custom(q) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => Io, constraint: (n) => Fo(n.params, n.initialValue), equals: he.equals, writer: (n) => zo }, controller: (n) => {
  const e = n.value, t = n.constraint, s = [n.params.x, n.params.y, n.params.z];
  return new ve(n.document, { assembly: vs, axes: e.rawValue.getComponents().map((i, r) => {
    var o;
    return Lt({ constraint: t.components[r], initialValue: i, params: Q(n.params, (o = s[r]) !== null && o !== void 0 ? o : {}) });
  }), parser: O, value: e, viewProps: n.viewProps });
} });
class ue {
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
const ws = { toComponents: (n) => n.getComponents(), fromComponents: (n) => new ue(...n) };
function $o(n) {
  return ue.isObject(n) ? new ue(n.x, n.y, n.z, n.w) : new ue();
}
function Ko(n, e) {
  n.writeProperty("x", e.x), n.writeProperty("y", e.y), n.writeProperty("z", e.z), n.writeProperty("w", e.w);
}
function Uo(n, e) {
  return new We({ assembly: ws, components: [I(Object.assign(Object.assign({}, n), n.x), e.x), I(Object.assign(Object.assign({}, n), n.y), e.y), I(Object.assign(Object.assign({}, n), n.z), e.z), I(Object.assign(Object.assign({}, n), n.w), e.w)] });
}
C({ id: "input-point4d", type: "input", accept: (n, e) => {
  if (!ue.isObject(n)) return null;
  const t = f(e, (s) => Object.assign(Object.assign({}, xe(s)), { readonly: s.optional.constant(false), w: s.optional.custom(q), x: s.optional.custom(q), y: s.optional.custom(q), z: s.optional.custom(q) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => $o, constraint: (n) => Uo(n.params, n.initialValue), equals: ue.equals, writer: (n) => Ko }, controller: (n) => {
  const e = n.value, t = n.constraint, s = [n.params.x, n.params.y, n.params.z, n.params.w];
  return new ve(n.document, { assembly: ws, axes: e.rawValue.getComponents().map((i, r) => {
    var o;
    return Lt({ constraint: t.components[r], initialValue: i, params: Q(n.params, (o = s[r]) !== null && o !== void 0 ? o : {}) });
  }), parser: O, value: e, viewProps: n.viewProps });
} });
function Ho(n) {
  const e = [], t = jt(n.options);
  return t && e.push(t), new me(e);
}
C({ id: "input-string", type: "input", accept: (n, e) => {
  if (typeof n != "string") return null;
  const t = f(e, (s) => ({ readonly: s.optional.constant(false), options: s.optional.custom(Ge) }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => zt, constraint: (n) => Ho(n.params), writer: (n) => X }, controller: (n) => {
  const e = n.document, t = n.value, s = n.constraint, i = s && ye(s, qe);
  return i ? new ce(e, { props: new c({ options: i.values.value("options") }), value: t, viewProps: n.viewProps }) : new Ye(e, { parser: (r) => r, props: c.fromObject({ formatter: vt }), value: t, viewProps: n.viewProps });
}, api(n) {
  return typeof n.controller.value.rawValue != "string" ? null : n.controller.valueController instanceof ce ? new Nt(n.controller) : null;
} });
const Me = { monitor: { defaultInterval: 200, defaultRows: 3 } }, Cn = p("mll");
class qo {
  constructor(e, t) {
    this.onValueUpdate_ = this.onValueUpdate_.bind(this), this.formatter_ = t.formatter, this.element = e.createElement("div"), this.element.classList.add(Cn()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("textarea");
    s.classList.add(Cn("i")), s.style.height = `calc(var(${Un("containerUnitSize")}) * ${t.rows})`, s.readOnly = true, t.viewProps.bindDisabled(s), this.element.appendChild(s), this.textareaElem_ = s, t.value.emitter.on("change", this.onValueUpdate_), this.value = t.value, this.update_();
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
class Yt {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new qo(e, { formatter: t.formatter, rows: t.rows, value: this.value, viewProps: this.viewProps });
  }
}
const gn = p("sgl");
class Go {
  constructor(e, t) {
    this.onValueUpdate_ = this.onValueUpdate_.bind(this), this.formatter_ = t.formatter, this.element = e.createElement("div"), this.element.classList.add(gn()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("input");
    s.classList.add(gn("i")), s.readOnly = true, s.type = "text", t.viewProps.bindDisabled(s), this.element.appendChild(s), this.inputElement = s, t.value.emitter.on("change", this.onValueUpdate_), this.value = t.value, this.update_();
  }
  update_() {
    const e = this.value.rawValue, t = e[e.length - 1];
    this.inputElement.value = t !== void 0 ? this.formatter_(t) : "";
  }
  onValueUpdate_() {
    this.update_();
  }
}
class Xt {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new Go(e, { formatter: t.formatter, value: this.value, viewProps: this.viewProps });
  }
}
C({ id: "monitor-bool", type: "monitor", accept: (n, e) => {
  if (typeof n != "boolean") return null;
  const t = f(e, (s) => ({ readonly: s.required.constant(true), rows: s.optional.number }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => It }, controller: (n) => {
  var e;
  return n.value.rawValue.length === 1 ? new Xt(n.document, { formatter: pn, value: n.value, viewProps: n.viewProps }) : new Yt(n.document, { formatter: pn, rows: (e = n.params.rows) !== null && e !== void 0 ? e : Me.monitor.defaultRows, value: n.value, viewProps: n.viewProps });
} });
class Yo extends St {
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
const U = p("grl");
class Xo {
  constructor(e, t) {
    this.onCursorChange_ = this.onCursorChange_.bind(this), this.onValueUpdate_ = this.onValueUpdate_.bind(this), this.element = e.createElement("div"), this.element.classList.add(U()), t.viewProps.bindClassModifiers(this.element), this.formatter_ = t.formatter, this.props_ = t.props, this.cursor_ = t.cursor, this.cursor_.emitter.on("change", this.onCursorChange_);
    const s = e.createElementNS(g, "svg");
    s.classList.add(U("g")), s.style.height = `calc(var(${Un("containerUnitSize")}) * ${t.rows})`, this.element.appendChild(s), this.svgElem_ = s;
    const i = e.createElementNS(g, "polyline");
    this.svgElem_.appendChild(i), this.lineElem_ = i;
    const r = e.createElement("div");
    r.classList.add(U("t"), p("tt")()), this.element.appendChild(r), this.tooltipElem_ = r, t.value.emitter.on("change", this.onValueUpdate_), this.value = t.value, this.update_();
  }
  get graphElement() {
    return this.svgElem_;
  }
  update_() {
    const e = this.svgElem_.getBoundingClientRect(), t = this.value.rawValue.length - 1, s = this.props_.get("min"), i = this.props_.get("max"), r = [];
    this.value.rawValue.forEach((d, v) => {
      if (d === void 0) return;
      const Je = u(v, 0, t, 0, e.width), Ze = u(d, s, i, e.height, 0);
      r.push([Je, Ze].join(","));
    }), this.lineElem_.setAttributeNS(null, "points", r.join(" "));
    const o = this.tooltipElem_, l = this.value.rawValue[this.cursor_.rawValue];
    if (l === void 0) {
      o.classList.remove(U("t", "a"));
      return;
    }
    const a = u(this.cursor_.rawValue, 0, t, 0, e.width), h = u(l, s, i, e.height, 0);
    o.style.left = `${a}px`, o.style.top = `${h}px`, o.textContent = `${this.formatter_(l)}`, o.classList.contains(U("t", "a")) || (o.classList.add(U("t", "a"), U("t", "in")), je(o), o.classList.remove(U("t", "in")));
  }
  onValueUpdate_() {
    this.update_();
  }
  onCursorChange_() {
    this.update_();
  }
}
class Wt {
  constructor(e, t) {
    if (this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this), this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this), this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this), this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this), this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this), this.props = t.props, this.value = t.value, this.viewProps = t.viewProps, this.cursor_ = _(-1), this.view = new Xo(e, { cursor: this.cursor_, formatter: t.formatter, rows: t.rows, props: this.props, value: this.value, viewProps: this.viewProps }), !$e(e)) this.view.element.addEventListener("mousemove", this.onGraphMouseMove_), this.view.element.addEventListener("mouseleave", this.onGraphMouseLeave_);
    else {
      const s = new F(this.view.element);
      s.emitter.on("down", this.onGraphPointerDown_), s.emitter.on("move", this.onGraphPointerMove_), s.emitter.on("up", this.onGraphPointerUp_);
    }
  }
  importProps(e) {
    return R(e, null, (t) => ({ max: t.required.number, min: t.required.number }), (t) => (this.props.set("max", t.max), this.props.set("min", t.min), true));
  }
  exportProps() {
    return N(null, { max: this.props.get("max"), min: this.props.get("min") });
  }
  onGraphMouseLeave_() {
    this.cursor_.rawValue = -1;
  }
  onGraphMouseMove_(e) {
    const t = this.view.element.getBoundingClientRect();
    this.cursor_.rawValue = Math.floor(u(e.offsetX, 0, t.width, 0, this.value.rawValue.length));
  }
  onGraphPointerDown_(e) {
    this.onGraphPointerMove_(e);
  }
  onGraphPointerMove_(e) {
    if (!e.data.point) {
      this.cursor_.rawValue = -1;
      return;
    }
    this.cursor_.rawValue = Math.floor(u(e.data.point.x, 0, e.data.bounds.width, 0, this.value.rawValue.length));
  }
  onGraphPointerUp_() {
    this.cursor_.rawValue = -1;
  }
}
function wt(n) {
  return w(n.format) ? E(2) : n.format;
}
function Wo(n) {
  var e;
  return n.value.rawValue.length === 1 ? new Xt(n.document, { formatter: wt(n.params), value: n.value, viewProps: n.viewProps }) : new Yt(n.document, { formatter: wt(n.params), rows: (e = n.params.rows) !== null && e !== void 0 ? e : Me.monitor.defaultRows, value: n.value, viewProps: n.viewProps });
}
function Jo(n) {
  var e, t, s;
  return new Wt(n.document, { formatter: wt(n.params), rows: (e = n.params.rows) !== null && e !== void 0 ? e : Me.monitor.defaultRows, props: c.fromObject({ max: (t = n.params.max) !== null && t !== void 0 ? t : 100, min: (s = n.params.min) !== null && s !== void 0 ? s : 0 }), value: n.value, viewProps: n.viewProps });
}
function Pn(n) {
  return n.view === "graph";
}
C({ id: "monitor-number", type: "monitor", accept: (n, e) => {
  if (typeof n != "number") return null;
  const t = f(e, (s) => ({ format: s.optional.function, max: s.optional.number, min: s.optional.number, readonly: s.required.constant(true), rows: s.optional.number, view: s.optional.string }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { defaultBufferSize: (n) => Pn(n) ? 64 : 1, reader: (n) => Et }, controller: (n) => Pn(n.params) ? Jo(n) : Wo(n), api: (n) => n.controller.valueController instanceof Wt ? new Yo(n.controller) : null });
C({ id: "monitor-string", type: "monitor", accept: (n, e) => {
  if (typeof n != "string") return null;
  const t = f(e, (s) => ({ multiline: s.optional.boolean, readonly: s.required.constant(true), rows: s.optional.number }));
  return t ? { initialValue: n, params: t } : null;
}, binding: { reader: (n) => zt }, controller: (n) => {
  var e;
  const t = n.value;
  return t.rawValue.length > 1 || n.params.multiline ? new Yt(n.document, { formatter: vt, rows: (e = n.params.rows) !== null && e !== void 0 ? e : Me.monitor.defaultRows, value: t, viewProps: n.viewProps }) : new Xt(n.document, { formatter: vt, value: t, viewProps: n.viewProps });
} });
class Zo {
  constructor(e) {
    this.controller_ = e;
  }
  get disabled() {
    return this.controller_.viewProps.get("disabled");
  }
  set disabled(e) {
    this.controller_.viewProps.set("disabled", e);
  }
  get title() {
    var e;
    return (e = this.controller_.props.get("title")) !== null && e !== void 0 ? e : "";
  }
  set title(e) {
    this.controller_.props.set("title", e);
  }
  on(e, t) {
    const s = t.bind(this);
    return this.controller_.emitter.on(e, () => {
      s(new ie(this));
    }), this;
  }
}
class Qo extends ie {
  constructor(e, t, s) {
    super(e), this.cell = t, this.index = s;
  }
}
class el extends se {
  constructor(e) {
    super(e), this.cellToApiMap_ = /* @__PURE__ */ new Map(), this.emitter_ = new y();
    const t = this.controller.valueController;
    t.cellControllers.forEach((s, i) => {
      const r = new Zo(s);
      this.cellToApiMap_.set(s, r), s.emitter.on("click", () => {
        const o = i % t.size[0], l = Math.floor(i / t.size[0]);
        this.emitter_.emit("click", { event: new Qo(this, r, [o, l]) });
      });
    });
  }
  cell(e, t) {
    const s = this.controller.valueController, i = s.cellControllers[t * s.size[0] + e];
    return this.cellToApiMap_.get(i);
  }
  on(e, t) {
    const s = t.bind(this);
    return this.emitter_.on(e, (i) => {
      s(i.event);
    }), this;
  }
}
class tl {
  constructor(e, t) {
    this.size = t.size;
    const [s, i] = this.size, r = [];
    for (let o = 0; o < i; o++) for (let l = 0; l < s; l++) {
      const a = new zn(e, { props: c.fromObject(Object.assign({}, t.cellConfig(l, o))), viewProps: z.create() });
      r.push(a);
    }
    this.cellCs_ = r, this.viewProps = z.create(), this.viewProps.handleDispose(() => {
      this.cellCs_.forEach((o) => {
        o.viewProps.set("disposed", true);
      });
    }), this.view = new Hn(e, { viewProps: this.viewProps, viewName: "btngrid" }), this.view.element.style.gridTemplateColumns = `repeat(${s}, 1fr)`, this.cellCs_.forEach((o) => {
      this.view.element.appendChild(o.view.element);
    });
  }
  get cellControllers() {
    return this.cellCs_;
  }
}
class En extends Ve {
  constructor(e, t) {
    const s = t.valueController, i = new Ue(e, { blade: t.blade, props: t.labelProps, valueController: s });
    super({ blade: t.blade, view: i.view, viewProps: s.viewProps }), this.valueController = s, this.labelController = i;
  }
}
const nl = C({ id: "buttongrid", type: "blade", accept(n) {
  const e = f(n, (t) => ({ cells: t.required.function, size: t.required.array(t.required.number), view: t.required.constant("buttongrid"), label: t.optional.string }));
  return e ? { params: e } : null;
}, controller(n) {
  return new En(n.document, { blade: n.blade, labelProps: c.fromObject({ label: n.params.label }), valueController: new tl(n.document, { cellConfig: n.params.cells, size: n.params.size }) });
}, api(n) {
  return n.controller instanceof En ? new el(n.controller) : null;
} });
class sl extends se {
  get label() {
    return this.controller.labelController.props.get("label");
  }
  set label(e) {
    this.controller.labelController.props.set("label", e);
  }
  get value() {
    return this.controller.valueController.value.rawValue;
  }
  set value(e) {
    this.controller.valueController.value.rawValue = e;
  }
  on(e, t) {
    const s = t.bind(this);
    return this.controller.valueController.value.emitter.on(e, (i) => {
      s(new Fe(this, i.rawValue, i.options.last));
    }), this;
  }
}
function L(n, e, t) {
  return n * (1 - t) + e * t;
}
const il = 20, rl = 1e-3, at = 100;
function ol(n, e) {
  let t = 0.25, s = 0.5, i = -1;
  for (let r = 0; r < il; r++) {
    const [o, l] = n.curve(s);
    if (s += t * (o < e ? 1 : -1), i = l, t *= 0.5, Math.abs(e - o) < rl) break;
  }
  return i;
}
class ne {
  constructor(e = 0, t = 0, s = 1, i = 1) {
    this.cache_ = [], this.comps_ = [e, t, s, i];
  }
  get x1() {
    return this.comps_[0];
  }
  get y1() {
    return this.comps_[1];
  }
  get x2() {
    return this.comps_[2];
  }
  get y2() {
    return this.comps_[3];
  }
  static isObject(e) {
    return w(e) || !Array.isArray(e) ? false : typeof e[0] == "number" && typeof e[1] == "number" && typeof e[2] == "number" && typeof e[3] == "number";
  }
  static equals(e, t) {
    return e.x1 === t.x1 && e.y1 === t.y1 && e.x2 === t.x2 && e.y2 === t.y2;
  }
  curve(e) {
    const t = L(0, this.x1, e), s = L(0, this.y1, e), i = L(this.x1, this.x2, e), r = L(this.y1, this.y2, e), o = L(this.x2, 1, e), l = L(this.y2, 1, e), a = L(t, i, e), h = L(s, r, e), d = L(i, o, e), v = L(r, l, e);
    return [L(a, d, e), L(h, v, e)];
  }
  y(e) {
    if (this.cache_.length === 0) {
      const t = [];
      for (let s = 0; s < at; s++) t.push(ol(this, u(s, 0, at - 1, 0, 1)));
      this.cache_ = t;
    }
    return this.cache_[Math.round(u(b(e, 0, 1), 0, 1, 0, at - 1))];
  }
  toObject() {
    return [this.comps_[0], this.comps_[1], this.comps_[2], this.comps_[3]];
  }
}
const bs = { toComponents: (n) => n.toObject(), fromComponents: (n) => new ne(...n) };
function ll(n) {
  const e = E(2);
  return `cubic-bezier(${n.toObject().map((s) => e(s)).join(", ")})`;
}
const yn = [0, 0.5, 0.5, 1];
function al(n) {
  const e = n.match(/^cubic-bezier\s*\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/);
  if (!e) return new ne(...yn);
  const t = [e[1], e[2], e[3], e[4]].reduce((s, i) => {
    if (!s) return null;
    const r = Number(i);
    return isNaN(r) ? null : [...s, r];
  }, []);
  return new ne(...t ?? yn);
}
const J = p("cbz");
class hl {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(J()), t.viewProps.bindClassModifiers(this.element), t.foldable.bindExpandedClass(this.element, J(void 0, "expanded")), A(t.foldable, "completed", Y(this.element, J(void 0, "cpl")));
    const s = e.createElement("div");
    s.classList.add(J("h")), this.element.appendChild(s);
    const i = e.createElement("button");
    i.classList.add(J("b")), t.viewProps.bindDisabled(i);
    const r = e.createElementNS(g, "svg");
    r.innerHTML = '<path d="M2 13C8 13 8 3 14 3"/>', i.appendChild(r), s.appendChild(i), this.buttonElement = i;
    const o = e.createElement("div");
    if (o.classList.add(J("t")), s.appendChild(o), this.textElement = o, t.pickerLayout === "inline") {
      const l = e.createElement("div");
      l.classList.add(J("p")), this.element.appendChild(l), this.pickerElement = l;
    } else this.pickerElement = null;
  }
}
const ht = p("cbzp");
class ul {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(ht()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("div");
    s.classList.add(ht("g")), this.element.appendChild(s), this.graphElement = s;
    const i = e.createElement("div");
    i.classList.add(ht("t")), this.element.appendChild(i), this.textElement = i;
  }
}
function _s(n, e) {
  const t = new MutationObserver((i) => {
    for (const r of i) r.type === "childList" && r.addedNodes.forEach((o) => {
      o.contains(o) && (e(), t.disconnect());
    });
  }), s = n.ownerDocument;
  t.observe(s.body, { attributes: true, childList: true, subtree: true });
}
const H = p("cbzg");
function cl(n, e) {
  return (t) => e(n(t));
}
class pl {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(H()), t.viewProps.bindClassModifiers(this.element), t.viewProps.bindTabIndex(this.element);
    const s = e.createElement("div");
    s.classList.add(H("p")), this.element.appendChild(s), this.previewElement = s;
    const i = e.createElementNS(g, "svg");
    i.classList.add(H("g")), this.element.appendChild(i), this.svgElem_ = i;
    const r = e.createElementNS(g, "path");
    r.classList.add(H("u")), this.svgElem_.appendChild(r), this.guideElem_ = r;
    const o = e.createElementNS(g, "polyline");
    o.classList.add(H("l")), this.svgElem_.appendChild(o), this.lineElem_ = o, this.handleElems_ = [e.createElement("div"), e.createElement("div")], this.handleElems_.forEach((l) => {
      l.classList.add(H("h")), this.element.appendChild(l);
    }), this.vectorElems_ = [e.createElementNS(g, "line"), e.createElementNS(g, "line")], this.vectorElems_.forEach((l) => {
      l.classList.add(H("v")), this.svgElem_.appendChild(l);
    }), this.value_ = t.value, this.value_.emitter.on("change", this.onValueChange_.bind(this)), this.sel_ = t.selection, this.handleElems_.forEach((l, a) => {
      M(this.sel_, cl((h) => h === a, Y(l, H("h", "sel"))));
    }), _s(this.element, () => {
      this.refresh();
    });
  }
  getVertMargin_(e) {
    return e * 0.25;
  }
  valueToPosition(e, t) {
    const { clientWidth: s, clientHeight: i } = this.element, r = this.getVertMargin_(i);
    return { x: u(e, 0, 1, 0, s), y: u(t, 0, 1, i - r, r) };
  }
  positionToValue(e, t) {
    const s = this.element.getBoundingClientRect(), i = s.width, r = s.height, o = this.getVertMargin_(r);
    return { x: b(u(e, 0, i, 0, 1), 0, 1), y: u(t, r - o, o, 0, 1) };
  }
  refresh() {
    this.guideElem_.setAttributeNS(null, "d", [0, 1].map((r) => {
      const o = this.valueToPosition(0, r), l = this.valueToPosition(1, r);
      return [`M ${o.x},${o.y}`, `L ${l.x},${l.y}`].join(" ");
    }).join(" "));
    const e = this.value_.rawValue, t = [];
    let s = 0;
    for (; ; ) {
      const r = this.valueToPosition(...e.curve(s));
      if (t.push([r.x, r.y].join(",")), s >= 1) break;
      s = Math.min(s + 0.05, 1);
    }
    this.lineElem_.setAttributeNS(null, "points", t.join(" "));
    const i = e.toObject();
    [0, 1].forEach((r) => {
      const o = this.valueToPosition(r, r), l = this.valueToPosition(i[r * 2], i[r * 2 + 1]), a = this.vectorElems_[r];
      a.setAttributeNS(null, "x1", String(o.x)), a.setAttributeNS(null, "y1", String(o.y)), a.setAttributeNS(null, "x2", String(l.x)), a.setAttributeNS(null, "y2", String(l.y));
      const h = this.handleElems_[r];
      h.style.left = `${l.x}px`, h.style.top = `${l.y}px`;
    });
  }
  onValueChange_() {
    this.refresh();
  }
}
const xn = 24, kn = 400, Vn = 1e3, ae = p("cbzprv");
class dl {
  constructor(e, t) {
    this.stopped_ = true, this.startTime_ = -1, this.onDispose_ = this.onDispose_.bind(this), this.onTimer_ = this.onTimer_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.element = e.createElement("div"), this.element.classList.add(ae()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElementNS(g, "svg");
    s.classList.add(ae("g")), this.element.appendChild(s), this.svgElem_ = s;
    const i = e.createElementNS(g, "path");
    i.classList.add(ae("t")), this.svgElem_.appendChild(i), this.ticksElem_ = i;
    const r = e.createElement("div");
    r.classList.add(ae("m")), this.element.appendChild(r), this.markerElem_ = r, this.value_ = t.value, this.value_.emitter.on("change", this.onValueChange_), t.viewProps.handleDispose(this.onDispose_), _s(this.element, () => {
      this.refresh();
    });
  }
  play() {
    this.stop(), this.updateMarker_(0), this.markerElem_.classList.add(ae("m", "a")), this.startTime_ = (/* @__PURE__ */ new Date()).getTime() + kn, this.stopped_ = false, requestAnimationFrame(this.onTimer_);
  }
  stop() {
    this.stopped_ = true, this.markerElem_.classList.remove(ae("m", "a"));
  }
  onDispose_() {
    this.stop();
  }
  updateMarker_(e) {
    const t = this.value_.rawValue.y(b(e, 0, 1));
    this.markerElem_.style.left = `${t * 100}%`;
  }
  refresh() {
    const { clientWidth: e, clientHeight: t } = this.svgElem_, s = [], i = this.value_.rawValue;
    for (let r = 0; r < xn; r++) {
      const o = u(r, 0, xn - 1, 0, 1), l = u(i.y(o), 0, 1, 0, e);
      s.push(`M ${l},0 v${t}`);
    }
    this.ticksElem_.setAttributeNS(null, "d", s.join(" "));
  }
  onTimer_() {
    if (this.startTime_ === null) return;
    const e = (/* @__PURE__ */ new Date()).getTime() - this.startTime_, t = e / Vn;
    this.updateMarker_(t), e > Vn + kn && this.stop(), this.stopped_ || requestAnimationFrame(this.onTimer_);
  }
  onValueChange_() {
    this.refresh(), this.play();
  }
}
function bt(n, e, t, s) {
  const i = t - n, r = s - e;
  return Math.sqrt(i * i + r * r);
}
function ml(n, e, t, s) {
  const i = bt(n, e, t, s), r = Math.atan2(s - e, t - n), o = Math.round(r / (Math.PI / 4)) * Math.PI / 4;
  return { x: n + Math.cos(o) * i, y: e + Math.sin(o) * i };
}
class vl {
  constructor(e, t) {
    this.onKeyDown_ = this.onKeyDown_.bind(this), this.onKeyUp_ = this.onKeyUp_.bind(this), this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.keyScale_ = t.keyScale, this.value = t.value, this.sel_ = _(0), this.viewProps = t.viewProps, this.view = new pl(e, { selection: this.sel_, value: this.value, viewProps: this.viewProps }), this.view.element.addEventListener("keydown", this.onKeyDown_), this.view.element.addEventListener("keyup", this.onKeyUp_), this.prevView_ = new dl(e, { value: this.value, viewProps: this.viewProps }), this.prevView_.element.addEventListener("mousedown", (i) => {
      i.stopImmediatePropagation(), i.preventDefault(), this.prevView_.play();
    }), this.view.previewElement.appendChild(this.prevView_.element);
    const s = new F(this.view.element);
    s.emitter.on("down", this.onPointerDown_), s.emitter.on("move", this.onPointerMove_), s.emitter.on("up", this.onPointerUp_);
  }
  refresh() {
    this.view.refresh(), this.prevView_.refresh(), this.prevView_.play();
  }
  updateValue_(e, t, s) {
    const i = this.sel_.rawValue, r = this.value.rawValue.toObject(), o = this.view.positionToValue(e.x, e.y), l = t ? ml(i, i, o.x, o.y) : o;
    r[i * 2] = l.x, r[i * 2 + 1] = l.y, this.value.setRawValue(new ne(...r), s);
  }
  onPointerDown_(e) {
    const t = e.data;
    if (!t.point) return;
    const s = this.value.rawValue, i = this.view.valueToPosition(s.x1, s.y1), r = bt(t.point.x, t.point.y, i.x, i.y), o = this.view.valueToPosition(s.x2, s.y2), l = bt(t.point.x, t.point.y, o.x, o.y);
    this.sel_.rawValue = r <= l ? 0 : 1, this.updateValue_(t.point, e.shiftKey, { forceEmit: false, last: false });
  }
  onPointerMove_(e) {
    const t = e.data;
    t.point && this.updateValue_(t.point, e.shiftKey, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    const t = e.data;
    t.point && this.updateValue_(t.point, e.shiftKey, { forceEmit: true, last: true });
  }
  onKeyDown_(e) {
    ze(e.key) && e.preventDefault();
    const t = this.sel_.rawValue, s = this.value.rawValue.toObject(), i = this.keyScale_.rawValue;
    s[t * 2] += P(i, D(e)), s[t * 2 + 1] += P(i, ee(e)), this.value.setRawValue(new ne(...s), { forceEmit: false, last: false });
  }
  onKeyUp_(e) {
    ze(e.key) && e.preventDefault();
    const t = this.keyScale_.rawValue, s = P(t, D(e)), i = P(t, ee(e));
    s === 0 && i === 0 || this.value.setRawValue(this.value.rawValue, { forceEmit: true, last: true });
  }
}
class wl {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.view = new ul(e, { viewProps: this.viewProps }), this.gc_ = new vl(e, { keyScale: t.axis.textProps.value("keyScale"), value: this.value, viewProps: this.viewProps }), this.view.graphElement.appendChild(this.gc_.view.element);
    const s = Object.assign(Object.assign({}, t.axis), { constraint: new Ct({ max: 1, min: 0 }) }), i = Object.assign(Object.assign({}, t.axis), { constraint: void 0 });
    this.tc_ = new ve(e, { assembly: bs, axes: [s, i, s, i], parser: O, value: this.value, viewProps: this.viewProps }), this.view.textElement.appendChild(this.tc_.view.element);
  }
  get allFocusableElements() {
    return [this.gc_.view.element, ...this.tc_.view.textViews.map((e) => e.inputElement)];
  }
  refresh() {
    this.gc_.refresh();
  }
}
class Ln {
  constructor(e, t) {
    this.onButtonBlur_ = this.onButtonBlur_.bind(this), this.onButtonClick_ = this.onButtonClick_.bind(this), this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this), this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this), this.value = t.value, this.viewProps = t.viewProps, this.foldable_ = de.create(t.expanded), this.view = new hl(e, { foldable: this.foldable_, pickerLayout: t.pickerLayout, viewProps: this.viewProps }), this.view.buttonElement.addEventListener("blur", this.onButtonBlur_), this.view.buttonElement.addEventListener("click", this.onButtonClick_), this.tc_ = new Ye(e, { parser: al, props: c.fromObject({ formatter: ll }), value: this.value, viewProps: this.viewProps }), this.view.textElement.appendChild(this.tc_.view.element), this.popC_ = t.pickerLayout === "popup" ? new Bt(e, { viewProps: this.viewProps }) : null;
    const s = new wl(e, { axis: t.axis, value: this.value, viewProps: this.viewProps });
    s.allFocusableElements.forEach((i) => {
      i.addEventListener("blur", this.onPopupChildBlur_), i.addEventListener("keydown", this.onPopupChildKeydown_);
    }), this.pickerC_ = s, this.popC_ ? (this.view.element.appendChild(this.popC_.view.element), this.popC_.view.element.appendChild(this.pickerC_.view.element), M(this.popC_.shows, (i) => {
      i && s.refresh();
    }), re({ primary: this.foldable_.value("expanded"), secondary: this.popC_.shows, forward: (i) => i, backward: (i, r) => r })) : this.view.pickerElement && (this.view.pickerElement.appendChild(this.pickerC_.view.element), He(this.foldable_, this.view.pickerElement));
  }
  onButtonBlur_(e) {
    if (!this.popC_) return;
    const t = e.relatedTarget;
    (!t || !this.popC_.view.element.contains(t)) && (this.popC_.shows.rawValue = false);
  }
  onButtonClick_() {
    this.foldable_.set("expanded", !this.foldable_.get("expanded")), this.foldable_.get("expanded") && this.pickerC_.allFocusableElements[0].focus();
  }
  onPopupChildBlur_(e) {
    if (!this.popC_) return;
    const t = this.popC_.view.element, s = Tt(e);
    s && t.contains(s) || s && s === this.view.buttonElement && !$e(t.ownerDocument) || (this.popC_.shows.rawValue = false);
  }
  onPopupChildKeydown_(e) {
    this.popC_ && e.key === "Escape" && (this.popC_.shows.rawValue = false);
  }
}
function bl() {
  return new We({ assembly: bs, components: [0, 1, 2, 3].map((n) => n % 2 === 0 ? new Ct({ min: 0, max: 1 }) : void 0) });
}
const _l = C({ id: "cubicbezier", type: "blade", accept(n) {
  const e = f(n, (t) => ({ value: t.required.array(t.required.number), view: t.required.constant("cubicbezier"), expanded: t.optional.boolean, label: t.optional.string, picker: t.optional.custom((s) => s === "inline" || s === "popup" ? s : void 0) }));
  return e ? { params: e } : null;
}, controller(n) {
  var e, t;
  const s = new ne(...n.params.value), i = _(s, { constraint: bl(), equals: ne.equals }), r = new Ln(n.document, { axis: { textProps: c.fromObject({ keyScale: 0.1, pointerScale: 0.01, formatter: E(2) }) }, expanded: (e = n.params.expanded) !== null && e !== void 0 ? e : false, pickerLayout: (t = n.params.picker) !== null && t !== void 0 ? t : "popup", value: i, viewProps: n.viewProps });
  return new Be(n.document, { blade: n.blade, props: c.fromObject({ label: n.params.label }), value: i, valueController: r });
}, api(n) {
  return !(n.controller instanceof Be) || !(n.controller.valueController instanceof Ln) ? null : new sl(n.controller);
} });
class fl extends se {
  get fps() {
    return this.controller.valueController.fps;
  }
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
  begin() {
    this.controller.valueController.begin();
  }
  end() {
    this.controller.valueController.end();
  }
  on(e, t) {
    const s = t.bind(this);
    return this.controller.valueController.ticker.emitter.on(e, () => {
      s(new ie(this));
    }), this;
  }
}
const Sn = 20;
class Cl {
  constructor() {
    this.start_ = null, this.duration_ = 0, this.fps_ = null, this.frameCount_ = 0, this.timestamps_ = [];
  }
  get duration() {
    return this.duration_;
  }
  get fps() {
    return this.fps_;
  }
  begin(e) {
    this.start_ = e.getTime();
  }
  calculateFps_(e) {
    if (this.timestamps_.length === 0) return null;
    const t = this.timestamps_[0];
    return 1e3 * (this.frameCount_ - t.frameCount) / (e - t.time);
  }
  compactTimestamps_() {
    if (this.timestamps_.length <= Sn) return;
    const e = this.timestamps_.length - Sn;
    this.timestamps_.splice(0, e);
    const t = this.timestamps_[0].frameCount;
    this.timestamps_.forEach((s) => {
      s.frameCount -= t;
    }), this.frameCount_ -= t;
  }
  end(e) {
    if (this.start_ === null) return;
    const t = e.getTime();
    this.duration_ = t - this.start_, this.start_ = null, this.fps_ = this.calculateFps_(t), this.timestamps_.push({ frameCount: this.frameCount_, time: t }), ++this.frameCount_, this.compactTimestamps_();
  }
}
const Ce = p("fps");
class gl {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(Ce()), t.viewProps.bindClassModifiers(this.element), this.graphElement = e.createElement("div"), this.graphElement.classList.add(Ce("g")), this.element.appendChild(this.graphElement);
    const s = e.createElement("div");
    s.classList.add(Ce("l")), this.element.appendChild(s);
    const i = e.createElement("span");
    i.classList.add(Ce("v")), i.textContent = "--", s.appendChild(i), this.valueElement = i;
    const r = e.createElement("span");
    r.classList.add(Ce("u")), r.textContent = "FPS", s.appendChild(r);
  }
}
class Pl {
  constructor(e, t) {
    this.stopwatch_ = new Cl(), this.onTick_ = this.onTick_.bind(this), this.ticker = t.ticker, this.ticker.emitter.on("tick", this.onTick_), this.props = t.props, this.value_ = t.value, this.viewProps = t.viewProps, this.view = new gl(e, { viewProps: this.viewProps }), this.graphC_ = new Wt(e, { formatter: E(0), props: this.props, rows: t.rows, value: this.value_, viewProps: this.viewProps }), this.view.graphElement.appendChild(this.graphC_.view.element), this.viewProps.handleDispose(() => {
      this.graphC_.viewProps.set("disposed", true), this.ticker.dispose();
    });
  }
  get fps() {
    return this.stopwatch_.fps;
  }
  begin() {
    this.stopwatch_.begin(/* @__PURE__ */ new Date());
  }
  end() {
    this.stopwatch_.end(/* @__PURE__ */ new Date());
  }
  onTick_() {
    const e = this.fps;
    if (e !== null) {
      const t = this.value_.rawValue;
      this.value_.rawValue = _i(t, e), this.view.valueElement.textContent = e.toFixed(0);
    }
  }
}
class Mn extends Ve {
  constructor(e, t) {
    const s = t.valueController, i = new Ue(e, { blade: t.blade, props: t.labelProps, valueController: s });
    super({ blade: t.blade, view: i.view, viewProps: s.viewProps }), this.valueController = s, this.labelController = i;
  }
}
function El(n, e) {
  return e === 0 ? new Hi() : new qi(n, e ?? Me.monitor.defaultInterval);
}
const yl = C({ id: "fpsgraph", type: "blade", accept(n) {
  const e = f(n, (t) => ({ view: t.required.constant("fpsgraph"), interval: t.optional.number, label: t.optional.string, rows: t.optional.number, max: t.optional.number, min: t.optional.number }));
  return e ? { params: e } : null;
}, controller(n) {
  var e, t, s, i;
  const r = (e = n.params.interval) !== null && e !== void 0 ? e : 500;
  return new Mn(n.document, { blade: n.blade, labelProps: c.fromObject({ label: n.params.label }), valueController: new Pl(n.document, { props: c.fromObject({ max: (t = n.params.max) !== null && t !== void 0 ? t : 90, min: (s = n.params.min) !== null && s !== void 0 ? s : 0 }), rows: (i = n.params.rows) !== null && i !== void 0 ? i : 2, ticker: El(n.document, r), value: _(wi(80)), viewProps: n.viewProps }) });
}, api(n) {
  return n.controller instanceof Mn ? new fl(n.controller) : null;
} });
class T {
  constructor(e, t) {
    this.min = e, this.max = t;
  }
  static isObject(e) {
    if (typeof e != "object" || e === null) return false;
    const t = e.min, s = e.max;
    return !(typeof t != "number" || typeof s != "number");
  }
  static equals(e, t) {
    return e.min === t.min && e.max === t.max;
  }
  get length() {
    return this.max - this.min;
  }
  toObject() {
    return { min: this.min, max: this.max };
  }
}
const fs = { fromComponents: (n) => new T(n[0], n[1]), toComponents: (n) => [n.min, n.max] };
class Cs {
  constructor(e) {
    this.edge = e;
  }
  constrain(e) {
    var t, s, i, r, o, l, a, h;
    if (e.min <= e.max) return new T((s = (t = this.edge) === null || t === void 0 ? void 0 : t.constrain(e.min)) !== null && s !== void 0 ? s : e.min, (r = (i = this.edge) === null || i === void 0 ? void 0 : i.constrain(e.max)) !== null && r !== void 0 ? r : e.max);
    const d = (e.min + e.max) / 2;
    return new T((l = (o = this.edge) === null || o === void 0 ? void 0 : o.constrain(d)) !== null && l !== void 0 ? l : d, (h = (a = this.edge) === null || a === void 0 ? void 0 : a.constrain(d)) !== null && h !== void 0 ? h : d);
  }
}
const ut = p("rsltxt");
class xl {
  constructor(e, t) {
    this.sliderView_ = t.sliderView, this.textView_ = t.textView, this.element = e.createElement("div"), this.element.classList.add(ut());
    const s = e.createElement("div");
    s.classList.add(ut("s")), s.appendChild(this.sliderView_.element), this.element.appendChild(s);
    const i = e.createElement("div");
    i.classList.add(ut("t")), i.appendChild(this.textView_.element), this.element.appendChild(i);
  }
}
const Z = p("rsl");
class kl {
  constructor(e, t) {
    this.onSliderPropsChange_ = this.onSliderPropsChange_.bind(this), this.onValueChange_ = this.onValueChange_.bind(this), this.sliderProps_ = t.sliderProps, this.sliderProps_.emitter.on("change", this.onSliderPropsChange_), this.element = e.createElement("div"), this.element.classList.add(Z()), t.viewProps.bindClassModifiers(this.element), this.value_ = t.value, this.value_.emitter.on("change", this.onValueChange_);
    const s = e.createElement("div");
    s.classList.add(Z("t")), this.element.appendChild(s), this.trackElement = s;
    const i = e.createElement("div");
    i.classList.add(Z("b")), s.appendChild(i), this.barElement = i;
    const r = ["min", "max"].map((o) => {
      const l = e.createElement("div");
      return l.classList.add(Z("k"), Z("k", o)), s.appendChild(l), l;
    });
    this.knobElements = [r[0], r[1]], this.update_();
  }
  valueToX_(e) {
    const t = this.sliderProps_.get("min"), s = this.sliderProps_.get("max");
    return b(u(e, t, s, 0, 1), 0, 1) * 100;
  }
  update_() {
    const e = this.value_.rawValue;
    e.length === 0 ? this.element.classList.add(Z(void 0, "zero")) : this.element.classList.remove(Z(void 0, "zero"));
    const t = [this.valueToX_(e.min), this.valueToX_(e.max)];
    this.barElement.style.left = `${t[0]}%`, this.barElement.style.right = `${100 - t[1]}%`, this.knobElements.forEach((s, i) => {
      s.style.left = `${t[i]}%`;
    });
  }
  onSliderPropsChange_() {
    this.update_();
  }
  onValueChange_() {
    this.update_();
  }
}
class Vl {
  constructor(e, t) {
    this.grabbing_ = null, this.grabOffset_ = 0, this.onPointerDown_ = this.onPointerDown_.bind(this), this.onPointerMove_ = this.onPointerMove_.bind(this), this.onPointerUp_ = this.onPointerUp_.bind(this), this.sliderProps = t.sliderProps, this.viewProps = t.viewProps, this.value = t.value, this.view = new kl(e, { sliderProps: this.sliderProps, value: this.value, viewProps: t.viewProps });
    const s = new F(this.view.trackElement);
    s.emitter.on("down", this.onPointerDown_), s.emitter.on("move", this.onPointerMove_), s.emitter.on("up", this.onPointerUp_);
  }
  ofs_() {
    return this.grabbing_ === "min" ? this.view.knobElements[0].getBoundingClientRect().width / 2 : this.grabbing_ === "max" ? -this.view.knobElements[1].getBoundingClientRect().width / 2 : 0;
  }
  valueFromData_(e) {
    if (!e.point) return null;
    const t = (e.point.x + this.ofs_()) / e.bounds.width, s = this.sliderProps.get("min"), i = this.sliderProps.get("max");
    return u(t, 0, 1, s, i);
  }
  onPointerDown_(e) {
    if (!e.data.point) return;
    const t = e.data.point.x / e.data.bounds.width, s = this.value.rawValue, i = this.sliderProps.get("min"), r = this.sliderProps.get("max"), o = u(s.min, i, r, 0, 1), l = u(s.max, i, r, 0, 1);
    Math.abs(l - t) <= 0.025 ? this.grabbing_ = "max" : Math.abs(o - t) <= 0.025 ? this.grabbing_ = "min" : t >= o && t <= l ? (this.grabbing_ = "length", this.grabOffset_ = u(t - o, 0, 1, 0, r - i)) : t < o ? (this.grabbing_ = "min", this.onPointerMove_(e)) : t > l && (this.grabbing_ = "max", this.onPointerMove_(e));
  }
  applyPointToValue_(e, t) {
    const s = this.valueFromData_(e);
    if (s === null) return;
    const i = this.sliderProps.get("min"), r = this.sliderProps.get("max");
    if (this.grabbing_ === "min") this.value.setRawValue(new T(s, this.value.rawValue.max), t);
    else if (this.grabbing_ === "max") this.value.setRawValue(new T(this.value.rawValue.min, s), t);
    else if (this.grabbing_ === "length") {
      const o = this.value.rawValue.length;
      let l = s - this.grabOffset_, a = l + o;
      l < i ? (l = i, a = i + o) : a > r && (l = r - o, a = r), this.value.setRawValue(new T(l, a), t);
    }
  }
  onPointerMove_(e) {
    this.applyPointToValue_(e.data, { forceEmit: false, last: false });
  }
  onPointerUp_(e) {
    this.applyPointToValue_(e.data, { forceEmit: true, last: true }), this.grabbing_ = null;
  }
}
class Ll {
  constructor(e, t) {
    this.value = t.value, this.viewProps = t.viewProps, this.sc_ = new Vl(e, t);
    const s = { constraint: t.constraint, textProps: t.textProps };
    this.tc_ = new ve(e, { assembly: fs, axes: [s, s], parser: t.parser, value: this.value, viewProps: t.viewProps }), this.view = new xl(e, { sliderView: this.sc_.view, textView: this.tc_.view });
  }
  get textController() {
    return this.tc_;
  }
}
function Sl(n) {
  return T.isObject(n) ? new T(n.min, n.max) : new T(0, 0);
}
function Ml(n, e) {
  n.writeProperty("max", e.max), n.writeProperty("min", e.min);
}
function Tl(n) {
  const e = [], t = xt(n);
  t && e.push(t);
  const s = yt(n);
  return s && e.push(s), new Cs(new me(e));
}
const Al = C({ id: "input-interval", type: "input", accept: (n, e) => {
  if (!T.isObject(n)) return null;
  const t = f(e, (s) => Object.assign(Object.assign({}, Vt(s)), { readonly: s.optional.constant(false) }));
  return t ? { initialValue: new T(n.min, n.max), params: t } : null;
}, binding: { reader: (n) => Sl, constraint: (n) => Tl(n.params), equals: T.equals, writer: (n) => Ml }, controller(n) {
  const e = n.value, t = n.constraint;
  if (!(t instanceof Cs)) throw x.shouldNeverHappen();
  const s = (e.rawValue.min + e.rawValue.max) / 2, i = c.fromObject(kt(n.params, s)), r = t.edge && ye(t.edge, ke);
  if (r) return new Ll(n.document, { constraint: t.edge, parser: O, sliderProps: new c({ keyScale: i.value("keyScale"), max: r.values.value("max"), min: r.values.value("min") }), textProps: i, value: e, viewProps: n.viewProps });
  const o = { constraint: t.edge, textProps: i };
  return new ve(n.document, { assembly: fs, axes: [o, o], parser: O, value: e, viewProps: n.viewProps });
} });
class Ol {
  constructor(e) {
    this.controller_ = e;
  }
  get disabled() {
    return this.controller_.viewProps.get("disabled");
  }
  set disabled(e) {
    this.controller_.viewProps.set("disabled", e);
  }
  get title() {
    var e;
    return (e = this.controller_.props.get("title")) !== null && e !== void 0 ? e : "";
  }
  set title(e) {
    this.controller_.props.set("title", e);
  }
}
class Dl extends Fe {
  constructor(e, t, s, i, r) {
    super(e, i, r), this.cell = t, this.index = s;
  }
}
class Rl extends se {
  constructor(e) {
    super(e), this.cellToApiMap_ = /* @__PURE__ */ new Map(), this.controller.valueController.cellControllers.forEach((s) => {
      const i = new Ol(s);
      this.cellToApiMap_.set(s, i);
    });
  }
  get value() {
    return this.controller.value;
  }
  cell(e, t) {
    const s = this.controller.valueController, i = s.cellControllers[t * s.size[0] + e];
    return this.cellToApiMap_.get(i);
  }
  on(e, t) {
    const s = t.bind(this);
    this.controller.value.emitter.on(e, (i) => {
      const r = this.controller.valueController, o = r.findCellByValue(i.rawValue);
      if (!o) return;
      const l = this.cellToApiMap_.get(o);
      if (!l) return;
      const a = r.cellControllers.indexOf(o);
      s(new Dl(this, l, [a % r.size[0], Math.floor(a / r.size[0])], i.rawValue));
    });
  }
}
const ge = p("rad");
class Nl {
  constructor(e, t) {
    this.element = e.createElement("div"), this.element.classList.add(ge()), t.viewProps.bindClassModifiers(this.element);
    const s = e.createElement("label");
    s.classList.add(ge("l")), this.element.appendChild(s);
    const i = e.createElement("input");
    i.classList.add(ge("i")), i.name = t.name, i.type = "radio", t.viewProps.bindDisabled(i), s.appendChild(i), this.inputElement = i;
    const r = e.createElement("div");
    r.classList.add(ge("b")), s.appendChild(r);
    const o = e.createElement("div");
    o.classList.add(ge("t")), r.appendChild(o), A(t.props, "title", (l) => {
      o.textContent = l;
    });
  }
}
class jl {
  constructor(e, t) {
    this.props = t.props, this.viewProps = t.viewProps, this.view = new Nl(e, { name: t.name, props: this.props, viewProps: this.viewProps });
  }
}
class _t {
  constructor(e, t) {
    this.cellCs_ = [], this.cellValues_ = [], this.onCellInputChange_ = this.onCellInputChange_.bind(this), this.size = t.size;
    const [s, i] = this.size;
    for (let r = 0; r < i; r++) for (let o = 0; o < s; o++) {
      const l = new jl(e, { name: t.groupName, props: c.fromObject(Object.assign({}, t.cellConfig(o, r))), viewProps: z.create() });
      this.cellCs_.push(l), this.cellValues_.push(t.cellConfig(o, r).value);
    }
    this.value = t.value, M(this.value, (r) => {
      const o = this.findCellByValue(r);
      o && (o.view.inputElement.checked = true);
    }), this.viewProps = z.create(), this.view = new Hn(e, { viewProps: this.viewProps, viewName: "radgrid" }), this.view.element.style.gridTemplateColumns = `repeat(${s}, 1fr)`, this.cellCs_.forEach((r) => {
      r.view.inputElement.addEventListener("change", this.onCellInputChange_), this.view.element.appendChild(r.view.element);
    });
  }
  get cellControllers() {
    return this.cellCs_;
  }
  findCellByValue(e) {
    const t = this.cellValues_.findIndex((s) => s === e);
    return t < 0 ? null : this.cellCs_[t];
  }
  onCellInputChange_(e) {
    const t = e.currentTarget, s = this.cellCs_.findIndex((i) => i.view.inputElement === t);
    s < 0 || (this.value.rawValue = this.cellValues_[s]);
  }
}
const Bl = (function() {
  return C({ id: "radiogrid", type: "blade", accept(n) {
    const e = f(n, (t) => ({ cells: t.required.function, groupName: t.required.string, size: t.required.array(t.required.number), value: t.required.raw, view: t.required.constant("radiogrid"), label: t.optional.string }));
    return e ? { params: e } : null;
  }, controller(n) {
    const e = _(n.params.value);
    return new Be(n.document, { blade: n.blade, props: c.fromObject({ label: n.params.label }), value: e, valueController: new _t(n.document, { groupName: n.params.groupName, cellConfig: n.params.cells, size: n.params.size, value: e }) });
  }, api(n) {
    return !(n.controller instanceof Be) || !(n.controller.valueController instanceof _t) ? null : new Rl(n.controller);
  } });
})();
function Jt(n) {
  return C({ id: "input-radiogrid", type: "input", accept(e, t) {
    if (!n.isType(e)) return null;
    const s = f(t, (i) => ({ cells: i.required.function, groupName: i.required.string, size: i.required.array(i.required.number), view: i.required.constant("radiogrid") }));
    return s ? { initialValue: e, params: s } : null;
  }, binding: n.binding, controller: (e) => new _t(e.document, { cellConfig: e.params.cells, groupName: e.params.groupName, size: e.params.size, value: e.value }) });
}
const Il = Jt({ isType: (n) => typeof n == "number", binding: { reader: (n) => Et, writer: (n) => X } }), zl = Jt({ isType: (n) => typeof n == "string", binding: { reader: (n) => zt, writer: (n) => X } }), Fl = Jt({ isType: (n) => typeof n == "boolean", binding: { reader: (n) => It, writer: (n) => X } }), $l = "essentials", Kl = '.tp-cbzgv,.tp-radv_b,.tp-rslv_k,.tp-cbzv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-radv_b,.tp-rslv_k,.tp-cbzv_b{background-color:var(--btn-bg);border-radius:var(--bld-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--cnt-usz);line-height:var(--cnt-usz);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-radv_b:hover,.tp-rslv_k:hover,.tp-cbzv_b:hover{background-color:var(--btn-bg-h)}.tp-radv_b:focus,.tp-rslv_k:focus,.tp-cbzv_b:focus{background-color:var(--btn-bg-f)}.tp-radv_b:active,.tp-rslv_k:active,.tp-cbzv_b:active{background-color:var(--btn-bg-a)}.tp-radv_b:disabled,.tp-rslv_k:disabled,.tp-cbzv_b:disabled{opacity:.5}.tp-cbzgv{background-color:var(--in-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--cnt-usz);line-height:var(--cnt-usz);min-width:0;width:100%}.tp-cbzgv:hover{background-color:var(--in-bg-h)}.tp-cbzgv:focus{background-color:var(--in-bg-f)}.tp-cbzgv:active{background-color:var(--in-bg-a)}.tp-cbzgv:disabled{opacity:.5}.tp-btngridv{border-radius:var(--bld-br);display:grid;overflow:hidden;gap:2px}.tp-btngridv.tp-v-disabled{opacity:.5}.tp-btngridv .tp-btnv_b:disabled{opacity:1}.tp-btngridv .tp-btnv_b:disabled .tp-btnv_t{opacity:.5}.tp-btngridv .tp-btnv_b{border-radius:0}.tp-cbzv{position:relative}.tp-cbzv_h{display:flex}.tp-cbzv_b{margin-right:4px;position:relative;width:var(--cnt-usz)}.tp-cbzv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-cbzv_b svg path{stroke:var(--bs-bg);stroke-width:2}.tp-cbzv_t{flex:1}.tp-cbzv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-cbzv.tp-cbzv-expanded .tp-cbzv_p{margin-top:var(--cnt-usp);opacity:1}.tp-cbzv.tp-cbzv-cpl .tp-cbzv_p{overflow:visible}.tp-cbzv .tp-popv{left:calc(-1 * var(--cnt-hp));position:absolute;right:calc(-1 * var(--cnt-hp));top:var(--cnt-usz)}.tp-cbzpv_t{margin-top:var(--cnt-usp)}.tp-cbzgv{height:auto;overflow:hidden;position:relative}.tp-cbzgv.tp-v-disabled{opacity:.5}.tp-cbzgv_p{left:16px;position:absolute;right:16px;top:0}.tp-cbzgv_g{cursor:pointer;display:block;height:calc(var(--cnt-usz) * 5);width:100%}.tp-cbzgv_u{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-cbzgv_l{fill:rgba(0,0,0,0);stroke:var(--in-fg)}.tp-cbzgv_v{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-cbzgv_h{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;pointer-events:none;position:absolute;width:4px}.tp-cbzgv:focus .tp-cbzgv_h-sel{background-color:var(--in-fg);border-width:0}.tp-cbzprvv{cursor:pointer;height:4px;padding:4px 0;position:relative}.tp-cbzprvv_g{display:block;height:100%;overflow:visible;width:100%}.tp-cbzprvv_t{opacity:.5;stroke:var(--mo-fg)}.tp-cbzprvv_m{background-color:var(--mo-fg);border-radius:50%;height:4px;margin-left:-2px;margin-top:-2px;opacity:0;position:absolute;top:50%;transition:opacity .2s ease-out;width:4px}.tp-cbzprvv_m.tp-cbzprvv_m-a{opacity:1}.tp-fpsv{position:relative}.tp-fpsv_l{bottom:4px;color:var(--mo-fg);line-height:1;right:4px;pointer-events:none;position:absolute}.tp-fpsv_u{margin-left:.2em;opacity:.7}.tp-rslv{cursor:pointer;padding-left:8px;padding-right:8px}.tp-rslv.tp-v-disabled{opacity:.5}.tp-rslv_t{height:calc(var(--cnt-usz));position:relative}.tp-rslv_t::before{background-color:var(--in-bg);border-radius:1px;content:"";height:2px;margin-top:-1px;position:absolute;top:50%;left:-4px;right:-4px}.tp-rslv_b{bottom:0;top:0;position:absolute}.tp-rslv_b::before{background-color:var(--in-fg);content:"";height:2px;margin-top:-1px;position:absolute;top:50%;left:0;right:0}.tp-rslv_k{height:calc(var(--cnt-usz) - 8px);margin-top:calc((var(--cnt-usz) - 8px)/-2);position:absolute;top:50%;width:8px}.tp-rslv_k.tp-rslv_k-min{margin-left:-8px}.tp-rslv_k.tp-rslv_k-max{margin-left:0}.tp-rslv.tp-rslv-zero .tp-rslv_k.tp-rslv_k-min{border-bottom-right-radius:0;border-top-right-radius:0}.tp-rslv.tp-rslv-zero .tp-rslv_k.tp-rslv_k-max{border-bottom-left-radius:0;border-top-left-radius:0}.tp-rsltxtv{display:flex}.tp-rsltxtv_s{flex:1}.tp-rsltxtv_t{flex:1;margin-left:4px}.tp-radv_l{display:block;position:relative}.tp-radv_i{left:0;opacity:0;position:absolute;top:0}.tp-radv_b{opacity:.5}.tp-radv_i:hover+.tp-radv_b{background-color:var(--btn-bg-h)}.tp-radv_i:focus+.tp-radv_b{background-color:var(--btn-bg-f)}.tp-radv_i:active+.tp-radv_b{background-color:var(--btn-bg-a)}.tp-radv_i:checked+.tp-radv_b{opacity:1}.tp-radv_t{bottom:0;color:inherit;left:0;overflow:hidden;position:absolute;right:0;text-align:center;text-overflow:ellipsis;top:0}.tp-radv_i:disabled+.tp-radv_b>.tp-radv_t{opacity:.5}.tp-radgridv{border-radius:var(--bld-br);display:grid;overflow:hidden;gap:2px}.tp-radgridv.tp-v-disabled{opacity:.5}.tp-radgridv .tp-radv_b{border-radius:0}', Ul = [nl, _l, yl, Al, Bl, Fl, Il, zl];
export {
  Zo as ButtonCellApi,
  el as ButtonGridApi,
  tl as ButtonGridController,
  ne as CubicBezier,
  sl as CubicBezierApi,
  bs as CubicBezierAssembly,
  Ln as CubicBezierController,
  vl as CubicBezierGraphController,
  pl as CubicBezierGraphView,
  wl as CubicBezierPickerController,
  ul as CubicBezierPickerView,
  dl as CubicBezierPreviewView,
  hl as CubicBezierView,
  fl as FpsGraphBladeApi,
  Pl as FpsGraphController,
  gl as FpsView,
  Cl as Fpswatch,
  T as Interval,
  fs as IntervalAssembly,
  Cs as IntervalConstraint,
  Ol as RadioCellApi,
  jl as RadioController,
  Rl as RadioGridApi,
  _t as RadioGridController,
  Nl as RadioView,
  Vl as RangeSliderController,
  Ll as RangeSliderTextController,
  xl as RangeSliderTextView,
  kl as RangeSliderView,
  Dl as TpRadioGridChangeEvent,
  Kl as css,
  $l as id,
  Ul as plugins
};
