let Et, At, jt, Ce, Dr, kr, Ae, Or, dt, pe, P, Yr, bt, De, xt, xe, ke, Br, Vr, Jr, Ih, st, vr, Pr, Ar, Gr, _e, Me, O, Er, Sr, Hr, oe, X, D, Ur, et, se, Q, Mr, Lr, Wr, de, Xr, ht, ut, Fe, xr, Fr, ie, le, qr, xh, Dt, pt, gt, Ir, zr, ae, U, yr, B, Rr, S, Le, It, Ie, He, Pe, fr, ne, je, we, M, ot, at, F, he, jr, Tr, Cr, Kr, Nr, Te, ce, Ee, ve, Re, mr, w, ze, Lt, Eh, jh, Ah;
let __tla = (async () => {
  const Zr = "" + new URL("rapier_wasm3d_bg-0Vyjx73g.wasm", import.meta.url).href, $r = async (s = {}, t) => {
    let e;
    if (t.startsWith("data:")) {
      const r = t.replace(/^data:.*?base64,/, "");
      let a;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") a = Buffer.from(r, "base64");
      else if (typeof atob == "function") {
        const o = atob(r);
        a = new Uint8Array(o.length);
        for (let _ = 0; _ < o.length; _++) a[_] = o.charCodeAt(_);
      } else throw new Error("Cannot decode base64-encoded data URL");
      e = await WebAssembly.instantiate(a, s);
    } else {
      const r = await fetch(t), a = r.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && a.startsWith("application/wasm")) e = await WebAssembly.instantiateStreaming(r, s);
      else {
        const o = await r.arrayBuffer();
        e = await WebAssembly.instantiate(o, s);
      }
    }
    return e.instance.exports;
  };
  let i;
  function Qr(s) {
    i = s;
  }
  const R = new Array(128).fill(void 0);
  R.push(void 0, null, true, false);
  function C(s) {
    return R[s];
  }
  let ct = R.length;
  function T(s) {
    ct === R.length && R.push(R.length + 1);
    const t = ct;
    return ct = R[t], R[t] = s, t;
  }
  function ue(s, t) {
    try {
      return s.apply(this, t);
    } catch (e) {
      i.__wbindgen_export_0(T(e));
    }
  }
  function f(s) {
    return s == null;
  }
  let nt = null;
  function z() {
    return (nt === null || nt.buffer.detached === true || nt.buffer.detached === void 0 && nt.buffer !== i.memory.buffer) && (nt = new DataView(i.memory.buffer)), nt;
  }
  function ti(s) {
    s < 132 || (R[s] = ct, ct = s);
  }
  function lt(s) {
    const t = C(s);
    return ti(s), t;
  }
  const ei = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
  let dr = new ei("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  dr.decode();
  let ft = null;
  function ri() {
    return (ft === null || ft.byteLength === 0) && (ft = new Uint8Array(i.memory.buffer)), ft;
  }
  function hr(s, t) {
    return s = s >>> 0, dr.decode(ri().subarray(s, s + t));
  }
  function ii() {
    let s, t;
    try {
      const a = i.__wbindgen_add_to_stack_pointer(-16);
      i.version(a);
      var e = z().getInt32(a + 0, true), r = z().getInt32(a + 4, true);
      return s = e, t = r, hr(e, r);
    } finally {
      i.__wbindgen_add_to_stack_pointer(16), i.__wbindgen_export_1(s, t, 1);
    }
  }
  function ni(s) {
    i.reserve_memory(s);
  }
  function c(s, t) {
    if (!(s instanceof t)) throw new Error(`expected instance of ${t.name}`);
  }
  let x = 128;
  function A(s) {
    if (x == 1) throw new Error("out of js stack");
    return R[--x] = s, x;
  }
  let yt = null;
  function ai() {
    return (yt === null || yt.byteLength === 0) && (yt = new Int32Array(i.memory.buffer)), yt;
  }
  function si(s, t) {
    return s = s >>> 0, ai().subarray(s / 4, s / 4 + t);
  }
  let St = null;
  function pr() {
    return (St === null || St.byteLength === 0) && (St = new Float32Array(i.memory.buffer)), St;
  }
  function Ge(s, t) {
    return s = s >>> 0, pr().subarray(s / 4, s / 4 + t);
  }
  let vt = null;
  function ur() {
    return (vt === null || vt.byteLength === 0) && (vt = new Uint32Array(i.memory.buffer)), vt;
  }
  function oi(s, t) {
    return s = s >>> 0, ur().subarray(s / 4, s / 4 + t);
  }
  let N = 0;
  function _t(s, t) {
    const e = t(s.length * 4, 4) >>> 0;
    return ur().set(s, e / 4), N = s.length, e;
  }
  function Z(s, t) {
    const e = t(s.length * 4, 4) >>> 0;
    return pr().set(s, e / 4), N = s.length, e;
  }
  const Pt = Object.freeze({
    LinX: 0,
    0: "LinX",
    LinY: 1,
    1: "LinY",
    LinZ: 2,
    2: "LinZ",
    AngX: 3,
    3: "AngX",
    AngY: 4,
    4: "AngY",
    AngZ: 5,
    5: "AngZ"
  }), V = Object.freeze({
    Revolute: 0,
    0: "Revolute",
    Fixed: 1,
    1: "Fixed",
    Prismatic: 2,
    2: "Prismatic",
    Rope: 3,
    3: "Rope",
    Spring: 4,
    4: "Spring",
    Spherical: 5,
    5: "Spherical",
    Generic: 6,
    6: "Generic"
  }), k = Object.freeze({
    Ball: 0,
    0: "Ball",
    Cuboid: 1,
    1: "Cuboid",
    Capsule: 2,
    2: "Capsule",
    Segment: 3,
    3: "Segment",
    Polyline: 4,
    4: "Polyline",
    Triangle: 5,
    5: "Triangle",
    TriMesh: 6,
    6: "TriMesh",
    HeightField: 7,
    7: "HeightField",
    Compound: 8,
    8: "Compound",
    ConvexPolyhedron: 9,
    9: "ConvexPolyhedron",
    Cylinder: 10,
    10: "Cylinder",
    Cone: 11,
    11: "Cone",
    RoundCuboid: 12,
    12: "RoundCuboid",
    RoundTriangle: 13,
    13: "RoundTriangle",
    RoundCylinder: 14,
    14: "RoundCylinder",
    RoundCone: 15,
    15: "RoundCone",
    RoundConvexPolyhedron: 16,
    16: "RoundConvexPolyhedron",
    HalfSpace: 17,
    17: "HalfSpace",
    Voxels: 18,
    18: "Voxels"
  }), Ut = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawbroadphase_free(s >>> 0, 1));
  class rt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(rt.prototype);
      return e.__wbg_ptr = t, Ut.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ut.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawbroadphase_free(t, 0);
    }
    constructor() {
      const t = i.rawbroadphase_new();
      return this.__wbg_ptr = t >>> 0, Ut.register(this, this.__wbg_ptr, this), this;
    }
  }
  const We = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawccdsolver_free(s >>> 0, 1));
  class re {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, We.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawccdsolver_free(t, 0);
    }
    constructor() {
      const t = i.rawccdsolver_new();
      return this.__wbg_ptr = t >>> 0, We.register(this, this.__wbg_ptr, this), this;
    }
  }
  const qe = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawcharactercollision_free(s >>> 0, 1));
  class gr {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, qe.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcharactercollision_free(t, 0);
    }
    constructor() {
      const t = i.rawcharactercollision_new();
      return this.__wbg_ptr = t >>> 0, qe.register(this, this.__wbg_ptr, this), this;
    }
    handle() {
      return i.rawcharactercollision_handle(this.__wbg_ptr);
    }
    translationDeltaApplied() {
      const t = i.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return l.__wrap(t);
    }
    translationDeltaRemaining() {
      const t = i.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
      return l.__wrap(t);
    }
    toi() {
      return i.rawcharactercollision_toi(this.__wbg_ptr);
    }
    worldWitness1() {
      const t = i.rawcharactercollision_worldWitness1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    worldWitness2() {
      const t = i.rawcharactercollision_worldWitness2(this.__wbg_ptr);
      return l.__wrap(t);
    }
    worldNormal1() {
      const t = i.rawcharactercollision_worldNormal1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    worldNormal2() {
      const t = i.rawcharactercollision_worldNormal2(this.__wbg_ptr);
      return l.__wrap(t);
    }
  }
  const Xt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawcolliderset_free(s >>> 0, 1));
  class E {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(E.prototype);
      return e.__wbg_ptr = t, Xt.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Xt.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcolliderset_free(t, 0);
    }
    coTranslation(t) {
      const e = i.rawcolliderset_coTranslation(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    coRotation(t) {
      const e = i.rawcolliderset_coRotation(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    coSetTranslation(t, e, r, a) {
      i.rawcolliderset_coSetTranslation(this.__wbg_ptr, t, e, r, a);
    }
    coSetTranslationWrtParent(t, e, r, a) {
      i.rawcolliderset_coSetTranslationWrtParent(this.__wbg_ptr, t, e, r, a);
    }
    coSetRotation(t, e, r, a, o) {
      i.rawcolliderset_coSetRotation(this.__wbg_ptr, t, e, r, a, o);
    }
    coSetRotationWrtParent(t, e, r, a, o) {
      i.rawcolliderset_coSetRotationWrtParent(this.__wbg_ptr, t, e, r, a, o);
    }
    coIsSensor(t) {
      return i.rawcolliderset_coIsSensor(this.__wbg_ptr, t) !== 0;
    }
    coShapeType(t) {
      return i.rawcolliderset_coShapeType(this.__wbg_ptr, t);
    }
    coHalfspaceNormal(t) {
      const e = i.rawcolliderset_coHalfspaceNormal(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    coHalfExtents(t) {
      const e = i.rawcolliderset_coHalfExtents(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    coSetHalfExtents(t, e) {
      c(e, l), i.rawcolliderset_coSetHalfExtents(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    coRadius(t) {
      const e = i.rawcolliderset_coRadius(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coSetRadius(t, e) {
      i.rawcolliderset_coSetRadius(this.__wbg_ptr, t, e);
    }
    coHalfHeight(t) {
      const e = i.rawcolliderset_coHalfHeight(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coSetHalfHeight(t, e) {
      i.rawcolliderset_coSetHalfHeight(this.__wbg_ptr, t, e);
    }
    coRoundRadius(t) {
      const e = i.rawcolliderset_coRoundRadius(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coSetRoundRadius(t, e) {
      i.rawcolliderset_coSetRoundRadius(this.__wbg_ptr, t, e);
    }
    coVoxelData(t) {
      try {
        const a = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coVoxelData(a, this.__wbg_ptr, t);
        var e = z().getInt32(a + 0, true), r = z().getInt32(a + 4, true);
        let o;
        return e !== 0 && (o = si(e, r).slice(), i.__wbindgen_export_1(e, r * 4, 4)), o;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coVoxelSize(t) {
      const e = i.rawcolliderset_coVoxelSize(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    coSetVoxel(t, e, r, a, o) {
      i.rawcolliderset_coSetVoxel(this.__wbg_ptr, t, e, r, a, o);
    }
    coPropagateVoxelChange(t, e, r, a, o, _, d, h) {
      i.rawcolliderset_coPropagateVoxelChange(this.__wbg_ptr, t, e, r, a, o, _, d, h);
    }
    coCombineVoxelStates(t, e, r, a, o) {
      i.rawcolliderset_coCombineVoxelStates(this.__wbg_ptr, t, e, r, a, o);
    }
    coVertices(t) {
      try {
        const a = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coVertices(a, this.__wbg_ptr, t);
        var e = z().getInt32(a + 0, true), r = z().getInt32(a + 4, true);
        let o;
        return e !== 0 && (o = Ge(e, r).slice(), i.__wbindgen_export_1(e, r * 4, 4)), o;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coIndices(t) {
      try {
        const a = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coIndices(a, this.__wbg_ptr, t);
        var e = z().getInt32(a + 0, true), r = z().getInt32(a + 4, true);
        let o;
        return e !== 0 && (o = oi(e, r).slice(), i.__wbindgen_export_1(e, r * 4, 4)), o;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coTriMeshFlags(t) {
      const e = i.rawcolliderset_coTriMeshFlags(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coHeightFieldFlags(t) {
      const e = i.rawcolliderset_coHeightFieldFlags(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coHeightfieldHeights(t) {
      try {
        const a = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coHeightfieldHeights(a, this.__wbg_ptr, t);
        var e = z().getInt32(a + 0, true), r = z().getInt32(a + 4, true);
        let o;
        return e !== 0 && (o = Ge(e, r).slice(), i.__wbindgen_export_1(e, r * 4, 4)), o;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coHeightfieldScale(t) {
      const e = i.rawcolliderset_coHeightfieldScale(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    coHeightfieldNRows(t) {
      const e = i.rawcolliderset_coHeightfieldNRows(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coHeightfieldNCols(t) {
      const e = i.rawcolliderset_coHeightfieldNCols(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    coParent(t) {
      try {
        const a = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawcolliderset_coParent(a, this.__wbg_ptr, t);
        var e = z().getInt32(a + 0, true), r = z().getFloat64(a + 8, true);
        return e === 0 ? void 0 : r;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coSetEnabled(t, e) {
      i.rawcolliderset_coSetEnabled(this.__wbg_ptr, t, e);
    }
    coIsEnabled(t) {
      return i.rawcolliderset_coIsEnabled(this.__wbg_ptr, t) !== 0;
    }
    coSetContactSkin(t, e) {
      i.rawcolliderset_coSetContactSkin(this.__wbg_ptr, t, e);
    }
    coContactSkin(t) {
      return i.rawcolliderset_coContactSkin(this.__wbg_ptr, t);
    }
    coFriction(t) {
      return i.rawcolliderset_coFriction(this.__wbg_ptr, t);
    }
    coRestitution(t) {
      return i.rawcolliderset_coRestitution(this.__wbg_ptr, t);
    }
    coDensity(t) {
      return i.rawcolliderset_coDensity(this.__wbg_ptr, t);
    }
    coMass(t) {
      return i.rawcolliderset_coMass(this.__wbg_ptr, t);
    }
    coVolume(t) {
      return i.rawcolliderset_coVolume(this.__wbg_ptr, t);
    }
    coCollisionGroups(t) {
      return i.rawcolliderset_coCollisionGroups(this.__wbg_ptr, t) >>> 0;
    }
    coSolverGroups(t) {
      return i.rawcolliderset_coSolverGroups(this.__wbg_ptr, t) >>> 0;
    }
    coActiveHooks(t) {
      return i.rawcolliderset_coActiveHooks(this.__wbg_ptr, t) >>> 0;
    }
    coActiveCollisionTypes(t) {
      return i.rawcolliderset_coActiveCollisionTypes(this.__wbg_ptr, t);
    }
    coActiveEvents(t) {
      return i.rawcolliderset_coActiveEvents(this.__wbg_ptr, t) >>> 0;
    }
    coContactForceEventThreshold(t) {
      return i.rawcolliderset_coContactForceEventThreshold(this.__wbg_ptr, t);
    }
    coContainsPoint(t, e) {
      return c(e, l), i.rawcolliderset_coContainsPoint(this.__wbg_ptr, t, e.__wbg_ptr) !== 0;
    }
    coCastShape(t, e, r, a, o, _, d, h, p) {
      c(e, l), c(r, m), c(a, l), c(o, v), c(_, l);
      const u = i.rawcolliderset_coCastShape(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _.__wbg_ptr, d, h, p);
      return u === 0 ? void 0 : kt.__wrap(u);
    }
    coCastCollider(t, e, r, a, o, _, d) {
      c(e, l), c(a, l);
      const h = i.rawcolliderset_coCastCollider(this.__wbg_ptr, t, e.__wbg_ptr, r, a.__wbg_ptr, o, _, d);
      return h === 0 ? void 0 : Ft.__wrap(h);
    }
    coIntersectsShape(t, e, r, a) {
      return c(e, m), c(r, l), c(a, v), i.rawcolliderset_coIntersectsShape(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr) !== 0;
    }
    coContactShape(t, e, r, a, o) {
      c(e, m), c(r, l), c(a, v);
      const _ = i.rawcolliderset_coContactShape(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o);
      return _ === 0 ? void 0 : wt.__wrap(_);
    }
    coContactCollider(t, e, r) {
      const a = i.rawcolliderset_coContactCollider(this.__wbg_ptr, t, e, r);
      return a === 0 ? void 0 : wt.__wrap(a);
    }
    coProjectPoint(t, e, r) {
      c(e, l);
      const a = i.rawcolliderset_coProjectPoint(this.__wbg_ptr, t, e.__wbg_ptr, r);
      return zt.__wrap(a);
    }
    coIntersectsRay(t, e, r, a) {
      return c(e, l), c(r, l), i.rawcolliderset_coIntersectsRay(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a) !== 0;
    }
    coCastRay(t, e, r, a, o) {
      return c(e, l), c(r, l), i.rawcolliderset_coCastRay(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a, o);
    }
    coCastRayAndGetNormal(t, e, r, a, o) {
      c(e, l), c(r, l);
      const _ = i.rawcolliderset_coCastRayAndGetNormal(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a, o);
      return _ === 0 ? void 0 : Mt.__wrap(_);
    }
    coSetSensor(t, e) {
      i.rawcolliderset_coSetSensor(this.__wbg_ptr, t, e);
    }
    coSetRestitution(t, e) {
      i.rawcolliderset_coSetRestitution(this.__wbg_ptr, t, e);
    }
    coSetFriction(t, e) {
      i.rawcolliderset_coSetFriction(this.__wbg_ptr, t, e);
    }
    coFrictionCombineRule(t) {
      return i.rawcolliderset_coFrictionCombineRule(this.__wbg_ptr, t) >>> 0;
    }
    coSetFrictionCombineRule(t, e) {
      i.rawcolliderset_coSetFrictionCombineRule(this.__wbg_ptr, t, e);
    }
    coRestitutionCombineRule(t) {
      return i.rawcolliderset_coRestitutionCombineRule(this.__wbg_ptr, t) >>> 0;
    }
    coSetRestitutionCombineRule(t, e) {
      i.rawcolliderset_coSetRestitutionCombineRule(this.__wbg_ptr, t, e);
    }
    coSetCollisionGroups(t, e) {
      i.rawcolliderset_coSetCollisionGroups(this.__wbg_ptr, t, e);
    }
    coSetSolverGroups(t, e) {
      i.rawcolliderset_coSetSolverGroups(this.__wbg_ptr, t, e);
    }
    coSetActiveHooks(t, e) {
      i.rawcolliderset_coSetActiveHooks(this.__wbg_ptr, t, e);
    }
    coSetActiveEvents(t, e) {
      i.rawcolliderset_coSetActiveEvents(this.__wbg_ptr, t, e);
    }
    coSetActiveCollisionTypes(t, e) {
      i.rawcolliderset_coSetActiveCollisionTypes(this.__wbg_ptr, t, e);
    }
    coSetShape(t, e) {
      c(e, m), i.rawcolliderset_coSetShape(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    coSetContactForceEventThreshold(t, e) {
      i.rawcolliderset_coSetContactForceEventThreshold(this.__wbg_ptr, t, e);
    }
    coSetDensity(t, e) {
      i.rawcolliderset_coSetDensity(this.__wbg_ptr, t, e);
    }
    coSetMass(t, e) {
      i.rawcolliderset_coSetMass(this.__wbg_ptr, t, e);
    }
    coSetMassProperties(t, e, r, a, o) {
      c(r, l), c(a, l), c(o, v), i.rawcolliderset_coSetMassProperties(this.__wbg_ptr, t, e, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr);
    }
    constructor() {
      const t = i.rawcolliderset_new();
      return this.__wbg_ptr = t >>> 0, Xt.register(this, this.__wbg_ptr, this), this;
    }
    len() {
      return i.rawcolliderset_len(this.__wbg_ptr) >>> 0;
    }
    contains(t) {
      return i.rawcolliderset_contains(this.__wbg_ptr, t) !== 0;
    }
    createCollider(t, e, r, a, o, _, d, h, p, u, g, b, y, I, L, G, W, q, tt, Nt, Gt, Wt, qt, Bt, mt) {
      try {
        const Ot = i.__wbindgen_add_to_stack_pointer(-16);
        c(e, m), c(r, l), c(a, v), c(d, l), c(h, l), c(p, v), c(mt, j), i.rawcolliderset_createCollider(Ot, this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _, d.__wbg_ptr, h.__wbg_ptr, p.__wbg_ptr, u, g, b, y, I, L, G, W, q, tt, Nt, Gt, Wt, qt, Bt, mt.__wbg_ptr);
        var Vt = z().getInt32(Ot + 0, true), Ne = z().getFloat64(Ot + 8, true);
        return Vt === 0 ? void 0 : Ne;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
    remove(t, e, r, a) {
      c(e, K), c(r, j), i.rawcolliderset_remove(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a);
    }
    isHandleValid(t) {
      return i.rawcolliderset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachColliderHandle(t) {
      try {
        i.rawcolliderset_forEachColliderHandle(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
  }
  const Be = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawcollidershapecasthit_free(s >>> 0, 1));
  class Ft {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Ft.prototype);
      return e.__wbg_ptr = t, Be.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Be.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcollidershapecasthit_free(t, 0);
    }
    colliderHandle() {
      return i.rawcharactercollision_handle(this.__wbg_ptr);
    }
    time_of_impact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    witness1() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    witness2() {
      const t = i.rawcollidershapecasthit_witness2(this.__wbg_ptr);
      return l.__wrap(t);
    }
    normal1() {
      const t = i.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return l.__wrap(t);
    }
    normal2() {
      const t = i.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
      return l.__wrap(t);
    }
  }
  const Ve = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawcontactforceevent_free(s >>> 0, 1));
  class ge {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(ge.prototype);
      return e.__wbg_ptr = t, Ve.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ve.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcontactforceevent_free(t, 0);
    }
    collider1() {
      return i.rawcharactercollision_handle(this.__wbg_ptr);
    }
    collider2() {
      return i.rawcontactforceevent_collider2(this.__wbg_ptr);
    }
    total_force() {
      const t = i.rawcontactforceevent_total_force(this.__wbg_ptr);
      return l.__wrap(t);
    }
    total_force_magnitude() {
      return i.rawcontactforceevent_total_force_magnitude(this.__wbg_ptr);
    }
    max_force_direction() {
      const t = i.rawcontactforceevent_max_force_direction(this.__wbg_ptr);
      return l.__wrap(t);
    }
    max_force_magnitude() {
      return i.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
    }
  }
  const Oe = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawcontactmanifold_free(s >>> 0, 1));
  class be {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(be.prototype);
      return e.__wbg_ptr = t, Oe.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Oe.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcontactmanifold_free(t, 0);
    }
    normal() {
      const t = i.rawcontactmanifold_normal(this.__wbg_ptr);
      return l.__wrap(t);
    }
    local_n1() {
      const t = i.rawcontactmanifold_local_n1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    local_n2() {
      const t = i.rawcontactmanifold_local_n2(this.__wbg_ptr);
      return l.__wrap(t);
    }
    subshape1() {
      return i.rawcontactmanifold_subshape1(this.__wbg_ptr) >>> 0;
    }
    subshape2() {
      return i.rawcontactmanifold_subshape2(this.__wbg_ptr) >>> 0;
    }
    num_contacts() {
      return i.rawcontactmanifold_num_contacts(this.__wbg_ptr) >>> 0;
    }
    contact_local_p1(t) {
      const e = i.rawcontactmanifold_contact_local_p1(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    contact_local_p2(t) {
      const e = i.rawcontactmanifold_contact_local_p2(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    contact_dist(t) {
      return i.rawcontactmanifold_contact_dist(this.__wbg_ptr, t);
    }
    contact_fid1(t) {
      return i.rawcontactmanifold_contact_fid1(this.__wbg_ptr, t) >>> 0;
    }
    contact_fid2(t) {
      return i.rawcontactmanifold_contact_fid2(this.__wbg_ptr, t) >>> 0;
    }
    contact_impulse(t) {
      return i.rawcontactmanifold_contact_impulse(this.__wbg_ptr, t);
    }
    contact_tangent_impulse_x(t) {
      return i.rawcontactmanifold_contact_tangent_impulse_x(this.__wbg_ptr, t);
    }
    contact_tangent_impulse_y(t) {
      return i.rawcontactmanifold_contact_tangent_impulse_y(this.__wbg_ptr, t);
    }
    num_solver_contacts() {
      return i.rawcontactmanifold_num_solver_contacts(this.__wbg_ptr) >>> 0;
    }
    solver_contact_point(t) {
      const e = i.rawcontactmanifold_solver_contact_point(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    solver_contact_dist(t) {
      return i.rawcontactmanifold_solver_contact_dist(this.__wbg_ptr, t);
    }
    solver_contact_friction(t) {
      return i.rawcontactmanifold_solver_contact_friction(this.__wbg_ptr, t);
    }
    solver_contact_restitution(t) {
      return i.rawcontactmanifold_solver_contact_restitution(this.__wbg_ptr, t);
    }
    solver_contact_tangent_velocity(t) {
      const e = i.rawcontactmanifold_solver_contact_tangent_velocity(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
  }
  const Ue = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawcontactpair_free(s >>> 0, 1));
  class me {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(me.prototype);
      return e.__wbg_ptr = t, Ue.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ue.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawcontactpair_free(t, 0);
    }
    collider1() {
      return i.rawcontactpair_collider1(this.__wbg_ptr);
    }
    collider2() {
      return i.rawcontactpair_collider2(this.__wbg_ptr);
    }
    numContactManifolds() {
      return i.rawcontactpair_numContactManifolds(this.__wbg_ptr) >>> 0;
    }
    contactManifold(t) {
      const e = i.rawcontactpair_contactManifold(this.__wbg_ptr, t);
      return e === 0 ? void 0 : be.__wrap(e);
    }
  }
  const Xe = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawdebugrenderpipeline_free(s >>> 0, 1));
  class _i {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Xe.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawdebugrenderpipeline_free(t, 0);
    }
    constructor() {
      const t = i.rawdebugrenderpipeline_new();
      return this.__wbg_ptr = t >>> 0, Xe.register(this, this.__wbg_ptr, this), this;
    }
    vertices() {
      const t = i.rawdebugrenderpipeline_vertices(this.__wbg_ptr);
      return lt(t);
    }
    colors() {
      const t = i.rawdebugrenderpipeline_colors(this.__wbg_ptr);
      return lt(t);
    }
    render(t, e, r, a, o, _, d) {
      try {
        c(t, j), c(e, E), c(r, J), c(a, Y), c(o, $), i.rawdebugrenderpipeline_render(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _, A(d));
      } finally {
        R[x++] = void 0;
      }
    }
  }
  const Je = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawdeserializedworld_free(s >>> 0, 1));
  class fe {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(fe.prototype);
      return e.__wbg_ptr = t, Je.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Je.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawdeserializedworld_free(t, 0);
    }
    takeGravity() {
      const t = i.rawdeserializedworld_takeGravity(this.__wbg_ptr);
      return t === 0 ? void 0 : l.__wrap(t);
    }
    takeIntegrationParameters() {
      const t = i.rawdeserializedworld_takeIntegrationParameters(this.__wbg_ptr);
      return t === 0 ? void 0 : it.__wrap(t);
    }
    takeIslandManager() {
      const t = i.rawdeserializedworld_takeIslandManager(this.__wbg_ptr);
      return t === 0 ? void 0 : K.__wrap(t);
    }
    takeBroadPhase() {
      const t = i.rawdeserializedworld_takeBroadPhase(this.__wbg_ptr);
      return t === 0 ? void 0 : rt.__wrap(t);
    }
    takeNarrowPhase() {
      const t = i.rawdeserializedworld_takeNarrowPhase(this.__wbg_ptr);
      return t === 0 ? void 0 : $.__wrap(t);
    }
    takeBodies() {
      const t = i.rawdeserializedworld_takeBodies(this.__wbg_ptr);
      return t === 0 ? void 0 : j.__wrap(t);
    }
    takeColliders() {
      const t = i.rawdeserializedworld_takeColliders(this.__wbg_ptr);
      return t === 0 ? void 0 : E.__wrap(t);
    }
    takeImpulseJoints() {
      const t = i.rawdeserializedworld_takeImpulseJoints(this.__wbg_ptr);
      return t === 0 ? void 0 : J.__wrap(t);
    }
    takeMultibodyJoints() {
      const t = i.rawdeserializedworld_takeMultibodyJoints(this.__wbg_ptr);
      return t === 0 ? void 0 : Y.__wrap(t);
    }
  }
  const Ke = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawdynamicraycastvehiclecontroller_free(s >>> 0, 1));
  class ci {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ke.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawdynamicraycastvehiclecontroller_free(t, 0);
    }
    constructor(t) {
      const e = i.rawdynamicraycastvehiclecontroller_new(t);
      return this.__wbg_ptr = e >>> 0, Ke.register(this, this.__wbg_ptr, this), this;
    }
    current_vehicle_speed() {
      return i.rawdynamicraycastvehiclecontroller_current_vehicle_speed(this.__wbg_ptr);
    }
    chassis() {
      return i.rawdynamicraycastvehiclecontroller_chassis(this.__wbg_ptr);
    }
    index_up_axis() {
      return i.rawdynamicraycastvehiclecontroller_index_up_axis(this.__wbg_ptr) >>> 0;
    }
    set_index_up_axis(t) {
      i.rawdynamicraycastvehiclecontroller_set_index_up_axis(this.__wbg_ptr, t);
    }
    index_forward_axis() {
      return i.rawdynamicraycastvehiclecontroller_index_forward_axis(this.__wbg_ptr) >>> 0;
    }
    set_index_forward_axis(t) {
      i.rawdynamicraycastvehiclecontroller_set_index_forward_axis(this.__wbg_ptr, t);
    }
    add_wheel(t, e, r, a, o) {
      c(t, l), c(e, l), c(r, l), i.rawdynamicraycastvehiclecontroller_add_wheel(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a, o);
    }
    num_wheels() {
      return i.rawdynamicraycastvehiclecontroller_num_wheels(this.__wbg_ptr) >>> 0;
    }
    update_vehicle(t, e, r, a, o, _, d) {
      try {
        c(e, j), c(r, E), c(a, ye), i.rawdynamicraycastvehiclecontroller_update_vehicle(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, f(_) ? 4294967297 : _ >>> 0, A(d));
      } finally {
        R[x++] = void 0;
      }
    }
    wheel_chassis_connection_point_cs(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    set_wheel_chassis_connection_point_cs(t, e) {
      c(e, l), i.rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    wheel_suspension_rest_length(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_suspension_rest_length(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length(this.__wbg_ptr, t, e);
    }
    wheel_max_suspension_travel(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_max_suspension_travel(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel(this.__wbg_ptr, t, e);
    }
    wheel_radius(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_radius(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_radius(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_radius(this.__wbg_ptr, t, e);
    }
    wheel_suspension_stiffness(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_suspension_stiffness(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness(this.__wbg_ptr, t, e);
    }
    wheel_suspension_compression(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_suspension_compression(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_suspension_compression(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression(this.__wbg_ptr, t, e);
    }
    wheel_suspension_relaxation(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_suspension_relaxation(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation(this.__wbg_ptr, t, e);
    }
    wheel_max_suspension_force(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_max_suspension_force(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_max_suspension_force(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force(this.__wbg_ptr, t, e);
    }
    wheel_brake(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_brake(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_brake(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_brake(this.__wbg_ptr, t, e);
    }
    wheel_steering(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_steering(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_steering(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_steering(this.__wbg_ptr, t, e);
    }
    wheel_engine_force(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_engine_force(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_engine_force(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_engine_force(this.__wbg_ptr, t, e);
    }
    wheel_direction_cs(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_direction_cs(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    set_wheel_direction_cs(t, e) {
      c(e, l), i.rawdynamicraycastvehiclecontroller_set_wheel_direction_cs(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    wheel_axle_cs(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_axle_cs(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    set_wheel_axle_cs(t, e) {
      c(e, l), i.rawdynamicraycastvehiclecontroller_set_wheel_axle_cs(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    wheel_friction_slip(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_friction_slip(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_friction_slip(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_friction_slip(this.__wbg_ptr, t, e);
    }
    wheel_side_friction_stiffness(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    set_wheel_side_friction_stiffness(t, e) {
      i.rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness(this.__wbg_ptr, t, e);
    }
    wheel_rotation(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_rotation(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    wheel_forward_impulse(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_forward_impulse(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    wheel_side_impulse(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_side_impulse(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    wheel_suspension_force(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_suspension_force(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    wheel_contact_normal_ws(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    wheel_contact_point_ws(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_contact_point_ws(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    wheel_suspension_length(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_suspension_length(this.__wbg_ptr, t);
      return e === 4294967297 ? void 0 : e;
    }
    wheel_hard_point_ws(t) {
      const e = i.rawdynamicraycastvehiclecontroller_wheel_hard_point_ws(this.__wbg_ptr, t);
      return e === 0 ? void 0 : l.__wrap(e);
    }
    wheel_is_in_contact(t) {
      return i.rawdynamicraycastvehiclecontroller_wheel_is_in_contact(this.__wbg_ptr, t) !== 0;
    }
    wheel_ground_object(t) {
      try {
        const a = i.__wbindgen_add_to_stack_pointer(-16);
        i.rawdynamicraycastvehiclecontroller_wheel_ground_object(a, this.__wbg_ptr, t);
        var e = z().getInt32(a + 0, true), r = z().getFloat64(a + 8, true);
        return e === 0 ? void 0 : r;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  const Ye = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_raweventqueue_free(s >>> 0, 1));
  class br {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ye.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_raweventqueue_free(t, 0);
    }
    constructor(t) {
      const e = i.raweventqueue_new(t);
      return this.__wbg_ptr = e >>> 0, Ye.register(this, this.__wbg_ptr, this), this;
    }
    drainCollisionEvents(t) {
      try {
        i.raweventqueue_drainCollisionEvents(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
    drainContactForceEvents(t) {
      try {
        i.raweventqueue_drainContactForceEvents(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
    clear() {
      i.raweventqueue_clear(this.__wbg_ptr);
    }
  }
  const Ze = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawgenericjoint_free(s >>> 0, 1));
  class H {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(H.prototype);
      return e.__wbg_ptr = t, Ze.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Ze.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawgenericjoint_free(t, 0);
    }
    static generic(t, e, r, a) {
      c(t, l), c(e, l), c(r, l);
      const o = i.rawgenericjoint_generic(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a);
      return o === 0 ? void 0 : H.__wrap(o);
    }
    static spring(t, e, r, a, o) {
      c(a, l), c(o, l);
      const _ = i.rawgenericjoint_spring(t, e, r, a.__wbg_ptr, o.__wbg_ptr);
      return H.__wrap(_);
    }
    static rope(t, e, r) {
      c(e, l), c(r, l);
      const a = i.rawgenericjoint_rope(t, e.__wbg_ptr, r.__wbg_ptr);
      return H.__wrap(a);
    }
    static spherical(t, e) {
      c(t, l), c(e, l);
      const r = i.rawgenericjoint_spherical(t.__wbg_ptr, e.__wbg_ptr);
      return H.__wrap(r);
    }
    static prismatic(t, e, r, a, o, _) {
      c(t, l), c(e, l), c(r, l);
      const d = i.rawgenericjoint_prismatic(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a, o, _);
      return d === 0 ? void 0 : H.__wrap(d);
    }
    static fixed(t, e, r, a) {
      c(t, l), c(e, v), c(r, l), c(a, v);
      const o = i.rawgenericjoint_fixed(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr);
      return H.__wrap(o);
    }
    static revolute(t, e, r) {
      c(t, l), c(e, l), c(r, l);
      const a = i.rawgenericjoint_revolute(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr);
      return a === 0 ? void 0 : H.__wrap(a);
    }
  }
  const Jt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawimpulsejointset_free(s >>> 0, 1));
  class J {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(J.prototype);
      return e.__wbg_ptr = t, Jt.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Jt.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawimpulsejointset_free(t, 0);
    }
    jointType(t) {
      return i.rawimpulsejointset_jointType(this.__wbg_ptr, t);
    }
    jointBodyHandle1(t) {
      return i.rawimpulsejointset_jointBodyHandle1(this.__wbg_ptr, t);
    }
    jointBodyHandle2(t) {
      return i.rawimpulsejointset_jointBodyHandle2(this.__wbg_ptr, t);
    }
    jointFrameX1(t) {
      const e = i.rawimpulsejointset_jointFrameX1(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    jointFrameX2(t) {
      const e = i.rawimpulsejointset_jointFrameX2(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    jointAnchor1(t) {
      const e = i.rawimpulsejointset_jointAnchor1(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    jointAnchor2(t) {
      const e = i.rawimpulsejointset_jointAnchor2(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    jointSetAnchor1(t, e) {
      c(e, l), i.rawimpulsejointset_jointSetAnchor1(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    jointSetAnchor2(t, e) {
      c(e, l), i.rawimpulsejointset_jointSetAnchor2(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    jointContactsEnabled(t) {
      return i.rawimpulsejointset_jointContactsEnabled(this.__wbg_ptr, t) !== 0;
    }
    jointSetContactsEnabled(t, e) {
      i.rawimpulsejointset_jointSetContactsEnabled(this.__wbg_ptr, t, e);
    }
    jointLimitsEnabled(t, e) {
      return i.rawimpulsejointset_jointLimitsEnabled(this.__wbg_ptr, t, e) !== 0;
    }
    jointLimitsMin(t, e) {
      return i.rawimpulsejointset_jointLimitsMin(this.__wbg_ptr, t, e);
    }
    jointLimitsMax(t, e) {
      return i.rawimpulsejointset_jointLimitsMax(this.__wbg_ptr, t, e);
    }
    jointSetLimits(t, e, r, a) {
      i.rawimpulsejointset_jointSetLimits(this.__wbg_ptr, t, e, r, a);
    }
    jointConfigureMotorModel(t, e, r) {
      i.rawimpulsejointset_jointConfigureMotorModel(this.__wbg_ptr, t, e, r);
    }
    jointConfigureMotorVelocity(t, e, r, a) {
      i.rawimpulsejointset_jointConfigureMotorVelocity(this.__wbg_ptr, t, e, r, a);
    }
    jointConfigureMotorPosition(t, e, r, a, o) {
      i.rawimpulsejointset_jointConfigureMotorPosition(this.__wbg_ptr, t, e, r, a, o);
    }
    jointConfigureMotor(t, e, r, a, o, _) {
      i.rawimpulsejointset_jointConfigureMotor(this.__wbg_ptr, t, e, r, a, o, _);
    }
    constructor() {
      const t = i.rawimpulsejointset_new();
      return this.__wbg_ptr = t >>> 0, Jt.register(this, this.__wbg_ptr, this), this;
    }
    createJoint(t, e, r, a) {
      return c(t, H), i.rawimpulsejointset_createJoint(this.__wbg_ptr, t.__wbg_ptr, e, r, a);
    }
    remove(t, e) {
      i.rawimpulsejointset_remove(this.__wbg_ptr, t, e);
    }
    len() {
      return i.rawimpulsejointset_len(this.__wbg_ptr) >>> 0;
    }
    contains(t) {
      return i.rawimpulsejointset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachJointHandle(t) {
      try {
        i.rawimpulsejointset_forEachJointHandle(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
    forEachJointAttachedToRigidBody(t, e) {
      try {
        i.rawimpulsejointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, t, A(e));
      } finally {
        R[x++] = void 0;
      }
    }
  }
  const Kt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawintegrationparameters_free(s >>> 0, 1));
  class it {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(it.prototype);
      return e.__wbg_ptr = t, Kt.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Kt.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawintegrationparameters_free(t, 0);
    }
    constructor() {
      const t = i.rawintegrationparameters_new();
      return this.__wbg_ptr = t >>> 0, Kt.register(this, this.__wbg_ptr, this), this;
    }
    get dt() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    get contact_erp() {
      return i.rawintegrationparameters_contact_erp(this.__wbg_ptr);
    }
    get normalizedAllowedLinearError() {
      return i.rawdynamicraycastvehiclecontroller_current_vehicle_speed(this.__wbg_ptr);
    }
    get normalizedPredictionDistance() {
      return i.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
    }
    get numSolverIterations() {
      return i.rawintegrationparameters_numSolverIterations(this.__wbg_ptr) >>> 0;
    }
    get numAdditionalFrictionIterations() {
      return i.rawdynamicraycastvehiclecontroller_index_up_axis(this.__wbg_ptr) >>> 0;
    }
    get numInternalPgsIterations() {
      return i.rawdynamicraycastvehiclecontroller_index_forward_axis(this.__wbg_ptr) >>> 0;
    }
    get minIslandSize() {
      return i.rawintegrationparameters_minIslandSize(this.__wbg_ptr) >>> 0;
    }
    get maxCcdSubsteps() {
      return i.rawintegrationparameters_maxCcdSubsteps(this.__wbg_ptr) >>> 0;
    }
    get lengthUnit() {
      return i.rawintegrationparameters_lengthUnit(this.__wbg_ptr);
    }
    set dt(t) {
      i.rawintegrationparameters_set_dt(this.__wbg_ptr, t);
    }
    set contact_natural_frequency(t) {
      i.rawintegrationparameters_set_contact_natural_frequency(this.__wbg_ptr, t);
    }
    set normalizedAllowedLinearError(t) {
      i.rawintegrationparameters_set_normalizedAllowedLinearError(this.__wbg_ptr, t);
    }
    set normalizedPredictionDistance(t) {
      i.rawintegrationparameters_set_normalizedPredictionDistance(this.__wbg_ptr, t);
    }
    set numSolverIterations(t) {
      i.rawintegrationparameters_set_numSolverIterations(this.__wbg_ptr, t);
    }
    set numAdditionalFrictionIterations(t) {
      i.rawdynamicraycastvehiclecontroller_set_index_up_axis(this.__wbg_ptr, t);
    }
    set numInternalPgsIterations(t) {
      i.rawdynamicraycastvehiclecontroller_set_index_forward_axis(this.__wbg_ptr, t);
    }
    set minIslandSize(t) {
      i.rawintegrationparameters_set_minIslandSize(this.__wbg_ptr, t);
    }
    set maxCcdSubsteps(t) {
      i.rawintegrationparameters_set_maxCcdSubsteps(this.__wbg_ptr, t);
    }
    set lengthUnit(t) {
      i.rawintegrationparameters_set_lengthUnit(this.__wbg_ptr, t);
    }
    switchToStandardPgsSolver() {
      i.rawintegrationparameters_switchToStandardPgsSolver(this.__wbg_ptr);
    }
    switchToSmallStepsPgsSolver() {
      i.rawintegrationparameters_switchToSmallStepsPgsSolver(this.__wbg_ptr);
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      i.rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart(this.__wbg_ptr);
    }
  }
  const Yt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawislandmanager_free(s >>> 0, 1));
  class K {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(K.prototype);
      return e.__wbg_ptr = t, Yt.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Yt.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawislandmanager_free(t, 0);
    }
    constructor() {
      const t = i.rawislandmanager_new();
      return this.__wbg_ptr = t >>> 0, Yt.register(this, this.__wbg_ptr, this), this;
    }
    forEachActiveRigidBodyHandle(t) {
      try {
        i.rawislandmanager_forEachActiveRigidBodyHandle(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
  }
  const $e = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawkinematiccharactercontroller_free(s >>> 0, 1));
  class li {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, $e.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawkinematiccharactercontroller_free(t, 0);
    }
    constructor(t) {
      const e = i.rawkinematiccharactercontroller_new(t);
      return this.__wbg_ptr = e >>> 0, $e.register(this, this.__wbg_ptr, this), this;
    }
    up() {
      const t = i.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return l.__wrap(t);
    }
    setUp(t) {
      c(t, l), i.rawkinematiccharactercontroller_setUp(this.__wbg_ptr, t.__wbg_ptr);
    }
    normalNudgeFactor() {
      return i.rawkinematiccharactercontroller_normalNudgeFactor(this.__wbg_ptr);
    }
    setNormalNudgeFactor(t) {
      i.rawkinematiccharactercontroller_setNormalNudgeFactor(this.__wbg_ptr, t);
    }
    offset() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    setOffset(t) {
      i.rawkinematiccharactercontroller_setOffset(this.__wbg_ptr, t);
    }
    slideEnabled() {
      return i.rawkinematiccharactercontroller_slideEnabled(this.__wbg_ptr) !== 0;
    }
    setSlideEnabled(t) {
      i.rawkinematiccharactercontroller_setSlideEnabled(this.__wbg_ptr, t);
    }
    autostepMaxHeight() {
      const t = i.rawkinematiccharactercontroller_autostepMaxHeight(this.__wbg_ptr);
      return t === 4294967297 ? void 0 : t;
    }
    autostepMinWidth() {
      const t = i.rawkinematiccharactercontroller_autostepMinWidth(this.__wbg_ptr);
      return t === 4294967297 ? void 0 : t;
    }
    autostepIncludesDynamicBodies() {
      const t = i.rawkinematiccharactercontroller_autostepIncludesDynamicBodies(this.__wbg_ptr);
      return t === 16777215 ? void 0 : t !== 0;
    }
    autostepEnabled() {
      return i.rawkinematiccharactercontroller_autostepEnabled(this.__wbg_ptr) !== 0;
    }
    enableAutostep(t, e, r) {
      i.rawkinematiccharactercontroller_enableAutostep(this.__wbg_ptr, t, e, r);
    }
    disableAutostep() {
      i.rawkinematiccharactercontroller_disableAutostep(this.__wbg_ptr);
    }
    maxSlopeClimbAngle() {
      return i.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
    }
    setMaxSlopeClimbAngle(t) {
      i.rawkinematiccharactercontroller_setMaxSlopeClimbAngle(this.__wbg_ptr, t);
    }
    minSlopeSlideAngle() {
      return i.rawkinematiccharactercontroller_minSlopeSlideAngle(this.__wbg_ptr);
    }
    setMinSlopeSlideAngle(t) {
      i.rawkinematiccharactercontroller_setMinSlopeSlideAngle(this.__wbg_ptr, t);
    }
    snapToGroundDistance() {
      const t = i.rawkinematiccharactercontroller_snapToGroundDistance(this.__wbg_ptr);
      return t === 4294967297 ? void 0 : t;
    }
    enableSnapToGround(t) {
      i.rawkinematiccharactercontroller_enableSnapToGround(this.__wbg_ptr, t);
    }
    disableSnapToGround() {
      i.rawkinematiccharactercontroller_disableSnapToGround(this.__wbg_ptr);
    }
    snapToGroundEnabled() {
      return i.rawkinematiccharactercontroller_snapToGroundEnabled(this.__wbg_ptr) !== 0;
    }
    computeColliderMovement(t, e, r, a, o, _, d, h, p, u, g) {
      try {
        c(e, j), c(r, E), c(a, ye), c(_, l), i.rawkinematiccharactercontroller_computeColliderMovement(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _.__wbg_ptr, d, f(h) ? 4294967297 : Math.fround(h), p, f(u) ? 4294967297 : u >>> 0, A(g));
      } finally {
        R[x++] = void 0;
      }
    }
    computedMovement() {
      const t = i.rawkinematiccharactercontroller_computedMovement(this.__wbg_ptr);
      return l.__wrap(t);
    }
    computedGrounded() {
      return i.rawkinematiccharactercontroller_computedGrounded(this.__wbg_ptr) !== 0;
    }
    numComputedCollisions() {
      return i.rawkinematiccharactercontroller_numComputedCollisions(this.__wbg_ptr) >>> 0;
    }
    computedCollision(t, e) {
      return c(e, gr), i.rawkinematiccharactercontroller_computedCollision(this.__wbg_ptr, t, e.__wbg_ptr) !== 0;
    }
  }
  const Zt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawmultibodyjointset_free(s >>> 0, 1));
  class Y {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Y.prototype);
      return e.__wbg_ptr = t, Zt.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Zt.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawmultibodyjointset_free(t, 0);
    }
    jointType(t) {
      return i.rawmultibodyjointset_jointType(this.__wbg_ptr, t);
    }
    jointFrameX1(t) {
      const e = i.rawmultibodyjointset_jointFrameX1(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    jointFrameX2(t) {
      const e = i.rawmultibodyjointset_jointFrameX2(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    jointAnchor1(t) {
      const e = i.rawmultibodyjointset_jointAnchor1(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    jointAnchor2(t) {
      const e = i.rawmultibodyjointset_jointAnchor2(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    jointContactsEnabled(t) {
      return i.rawmultibodyjointset_jointContactsEnabled(this.__wbg_ptr, t) !== 0;
    }
    jointSetContactsEnabled(t, e) {
      i.rawmultibodyjointset_jointSetContactsEnabled(this.__wbg_ptr, t, e);
    }
    jointLimitsEnabled(t, e) {
      return i.rawmultibodyjointset_jointLimitsEnabled(this.__wbg_ptr, t, e) !== 0;
    }
    jointLimitsMin(t, e) {
      return i.rawmultibodyjointset_jointLimitsMin(this.__wbg_ptr, t, e);
    }
    jointLimitsMax(t, e) {
      return i.rawmultibodyjointset_jointLimitsMax(this.__wbg_ptr, t, e);
    }
    constructor() {
      const t = i.rawmultibodyjointset_new();
      return this.__wbg_ptr = t >>> 0, Zt.register(this, this.__wbg_ptr, this), this;
    }
    createJoint(t, e, r, a) {
      return c(t, H), i.rawmultibodyjointset_createJoint(this.__wbg_ptr, t.__wbg_ptr, e, r, a);
    }
    remove(t, e) {
      i.rawmultibodyjointset_remove(this.__wbg_ptr, t, e);
    }
    contains(t) {
      return i.rawmultibodyjointset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachJointHandle(t) {
      try {
        i.rawmultibodyjointset_forEachJointHandle(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
    forEachJointAttachedToRigidBody(t, e) {
      try {
        i.rawmultibodyjointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, t, A(e));
      } finally {
        R[x++] = void 0;
      }
    }
  }
  const $t = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawnarrowphase_free(s >>> 0, 1));
  class $ {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create($.prototype);
      return e.__wbg_ptr = t, $t.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, $t.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawnarrowphase_free(t, 0);
    }
    constructor() {
      const t = i.rawnarrowphase_new();
      return this.__wbg_ptr = t >>> 0, $t.register(this, this.__wbg_ptr, this), this;
    }
    contact_pairs_with(t, e) {
      i.rawnarrowphase_contact_pairs_with(this.__wbg_ptr, t, T(e));
    }
    contact_pair(t, e) {
      const r = i.rawnarrowphase_contact_pair(this.__wbg_ptr, t, e);
      return r === 0 ? void 0 : me.__wrap(r);
    }
    intersection_pairs_with(t, e) {
      i.rawnarrowphase_intersection_pairs_with(this.__wbg_ptr, t, T(e));
    }
    intersection_pair(t, e) {
      return i.rawnarrowphase_intersection_pair(this.__wbg_ptr, t, e) !== 0;
    }
  }
  const Qe = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawphysicspipeline_free(s >>> 0, 1));
  class wi {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Qe.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawphysicspipeline_free(t, 0);
    }
    constructor() {
      const t = i.rawphysicspipeline_new();
      return this.__wbg_ptr = t >>> 0, Qe.register(this, this.__wbg_ptr, this), this;
    }
    step(t, e, r, a, o, _, d, h, p, u) {
      c(t, l), c(e, it), c(r, K), c(a, rt), c(o, $), c(_, j), c(d, E), c(h, J), c(p, Y), c(u, re), i.rawphysicspipeline_step(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _.__wbg_ptr, d.__wbg_ptr, h.__wbg_ptr, p.__wbg_ptr, u.__wbg_ptr);
    }
    stepWithEvents(t, e, r, a, o, _, d, h, p, u, g, b, y, I) {
      c(t, l), c(e, it), c(r, K), c(a, rt), c(o, $), c(_, j), c(d, E), c(h, J), c(p, Y), c(u, re), c(g, br), i.rawphysicspipeline_stepWithEvents(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _.__wbg_ptr, d.__wbg_ptr, h.__wbg_ptr, p.__wbg_ptr, u.__wbg_ptr, g.__wbg_ptr, T(b), T(y), T(I));
    }
  }
  const tr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawpidcontroller_free(s >>> 0, 1));
  class di {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, tr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawpidcontroller_free(t, 0);
    }
    constructor(t, e, r, a) {
      const o = i.rawpidcontroller_new(t, e, r, a);
      return this.__wbg_ptr = o >>> 0, tr.register(this, this.__wbg_ptr, this), this;
    }
    set_kp(t, e) {
      i.rawpidcontroller_set_kp(this.__wbg_ptr, t, e);
    }
    set_ki(t, e) {
      i.rawpidcontroller_set_ki(this.__wbg_ptr, t, e);
    }
    set_kd(t, e) {
      i.rawpidcontroller_set_kd(this.__wbg_ptr, t, e);
    }
    set_axes_mask(t) {
      i.rawpidcontroller_set_axes_mask(this.__wbg_ptr, t);
    }
    reset_integrals() {
      i.rawpidcontroller_reset_integrals(this.__wbg_ptr);
    }
    apply_linear_correction(t, e, r, a, o) {
      c(e, j), c(a, l), c(o, l), i.rawpidcontroller_apply_linear_correction(this.__wbg_ptr, t, e.__wbg_ptr, r, a.__wbg_ptr, o.__wbg_ptr);
    }
    apply_angular_correction(t, e, r, a, o) {
      c(e, j), c(a, v), c(o, l), i.rawpidcontroller_apply_angular_correction(this.__wbg_ptr, t, e.__wbg_ptr, r, a.__wbg_ptr, o.__wbg_ptr);
    }
    linear_correction(t, e, r, a, o) {
      c(e, j), c(a, l), c(o, l);
      const _ = i.rawpidcontroller_linear_correction(this.__wbg_ptr, t, e.__wbg_ptr, r, a.__wbg_ptr, o.__wbg_ptr);
      return l.__wrap(_);
    }
    angular_correction(t, e, r, a, o) {
      c(e, j), c(a, v), c(o, l);
      const _ = i.rawpidcontroller_angular_correction(this.__wbg_ptr, t, e.__wbg_ptr, r, a.__wbg_ptr, o.__wbg_ptr);
      return l.__wrap(_);
    }
  }
  const er = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawpointcolliderprojection_free(s >>> 0, 1));
  class Rt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Rt.prototype);
      return e.__wbg_ptr = t, er.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, er.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawpointcolliderprojection_free(t, 0);
    }
    colliderHandle() {
      return i.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
    }
    point() {
      const t = i.rawpointcolliderprojection_point(this.__wbg_ptr);
      return l.__wrap(t);
    }
    isInside() {
      return i.rawpointcolliderprojection_isInside(this.__wbg_ptr) !== 0;
    }
    featureType() {
      return i.rawpointcolliderprojection_featureType(this.__wbg_ptr);
    }
    featureId() {
      const t = i.rawpointcolliderprojection_featureId(this.__wbg_ptr);
      return t === 4294967297 ? void 0 : t;
    }
  }
  const rr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawpointprojection_free(s >>> 0, 1));
  class zt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(zt.prototype);
      return e.__wbg_ptr = t, rr.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, rr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawpointprojection_free(t, 0);
    }
    point() {
      const t = i.rawpointprojection_point(this.__wbg_ptr);
      return l.__wrap(t);
    }
    isInside() {
      return i.rawpointprojection_isInside(this.__wbg_ptr) !== 0;
    }
  }
  const ir = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawquerypipeline_free(s >>> 0, 1));
  class ye {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ir.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawquerypipeline_free(t, 0);
    }
    constructor() {
      const t = i.rawquerypipeline_new();
      return this.__wbg_ptr = t >>> 0, ir.register(this, this.__wbg_ptr, this), this;
    }
    update(t) {
      c(t, E), i.rawquerypipeline_update(this.__wbg_ptr, t.__wbg_ptr);
    }
    castRay(t, e, r, a, o, _, d, h, p, u, g) {
      try {
        c(t, j), c(e, E), c(r, l), c(a, l);
        const b = i.rawquerypipeline_castRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _, d, f(h) ? 4294967297 : h >>> 0, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, A(g));
        return b === 0 ? void 0 : Se.__wrap(b);
      } finally {
        R[x++] = void 0;
      }
    }
    castRayAndGetNormal(t, e, r, a, o, _, d, h, p, u, g) {
      try {
        c(t, j), c(e, E), c(r, l), c(a, l);
        const b = i.rawquerypipeline_castRayAndGetNormal(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _, d, f(h) ? 4294967297 : h >>> 0, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, A(g));
        return b === 0 ? void 0 : Tt.__wrap(b);
      } finally {
        R[x++] = void 0;
      }
    }
    intersectionsWithRay(t, e, r, a, o, _, d, h, p, u, g, b) {
      try {
        c(t, j), c(e, E), c(r, l), c(a, l), i.rawquerypipeline_intersectionsWithRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _, A(d), h, f(p) ? 4294967297 : p >>> 0, !f(u), f(u) ? 0 : u, !f(g), f(g) ? 0 : g, A(b));
      } finally {
        R[x++] = void 0, R[x++] = void 0;
      }
    }
    intersectionWithShape(t, e, r, a, o, _, d, h, p, u) {
      try {
        const y = i.__wbindgen_add_to_stack_pointer(-16);
        c(t, j), c(e, E), c(r, l), c(a, v), c(o, m), i.rawquerypipeline_intersectionWithShape(y, this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _, f(d) ? 4294967297 : d >>> 0, !f(h), f(h) ? 0 : h, !f(p), f(p) ? 0 : p, A(u));
        var g = z().getInt32(y + 0, true), b = z().getFloat64(y + 8, true);
        return g === 0 ? void 0 : b;
      } finally {
        i.__wbindgen_add_to_stack_pointer(16), R[x++] = void 0;
      }
    }
    projectPoint(t, e, r, a, o, _, d, h, p) {
      try {
        c(t, j), c(e, E), c(r, l);
        const u = i.rawquerypipeline_projectPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a, o, f(_) ? 4294967297 : _ >>> 0, !f(d), f(d) ? 0 : d, !f(h), f(h) ? 0 : h, A(p));
        return u === 0 ? void 0 : Rt.__wrap(u);
      } finally {
        R[x++] = void 0;
      }
    }
    projectPointAndGetFeature(t, e, r, a, o, _, d, h) {
      try {
        c(t, j), c(e, E), c(r, l);
        const p = i.rawquerypipeline_projectPointAndGetFeature(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a, f(o) ? 4294967297 : o >>> 0, !f(_), f(_) ? 0 : _, !f(d), f(d) ? 0 : d, A(h));
        return p === 0 ? void 0 : Rt.__wrap(p);
      } finally {
        R[x++] = void 0;
      }
    }
    intersectionsWithPoint(t, e, r, a, o, _, d, h, p) {
      try {
        c(t, j), c(e, E), c(r, l), i.rawquerypipeline_intersectionsWithPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, A(a), o, f(_) ? 4294967297 : _ >>> 0, !f(d), f(d) ? 0 : d, !f(h), f(h) ? 0 : h, A(p));
      } finally {
        R[x++] = void 0, R[x++] = void 0;
      }
    }
    castShape(t, e, r, a, o, _, d, h, p, u, g, b, y, I) {
      try {
        c(t, j), c(e, E), c(r, l), c(a, v), c(o, l), c(_, m);
        const L = i.rawquerypipeline_castShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _.__wbg_ptr, d, h, p, u, f(g) ? 4294967297 : g >>> 0, !f(b), f(b) ? 0 : b, !f(y), f(y) ? 0 : y, A(I));
        return L === 0 ? void 0 : Ft.__wrap(L);
      } finally {
        R[x++] = void 0;
      }
    }
    intersectionsWithShape(t, e, r, a, o, _, d, h, p, u, g) {
      try {
        c(t, j), c(e, E), c(r, l), c(a, v), c(o, m), i.rawquerypipeline_intersectionsWithShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, A(_), d, f(h) ? 4294967297 : h >>> 0, !f(p), f(p) ? 0 : p, !f(u), f(u) ? 0 : u, A(g));
      } finally {
        R[x++] = void 0, R[x++] = void 0;
      }
    }
    collidersWithAabbIntersectingAabb(t, e, r) {
      try {
        c(t, l), c(e, l), i.rawquerypipeline_collidersWithAabbIntersectingAabb(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, A(r));
      } finally {
        R[x++] = void 0;
      }
    }
  }
  const nr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawraycolliderhit_free(s >>> 0, 1));
  class Se {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Se.prototype);
      return e.__wbg_ptr = t, nr.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, nr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawraycolliderhit_free(t, 0);
    }
    colliderHandle() {
      return i.rawcharactercollision_handle(this.__wbg_ptr);
    }
    timeOfImpact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
  }
  const ar = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawraycolliderintersection_free(s >>> 0, 1));
  class Tt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Tt.prototype);
      return e.__wbg_ptr = t, ar.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ar.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawraycolliderintersection_free(t, 0);
    }
    colliderHandle() {
      return i.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
    }
    normal() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    time_of_impact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    featureType() {
      return i.rawpointcolliderprojection_featureType(this.__wbg_ptr);
    }
    featureId() {
      const t = i.rawpointcolliderprojection_featureId(this.__wbg_ptr);
      return t === 4294967297 ? void 0 : t;
    }
  }
  const sr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawrayintersection_free(s >>> 0, 1));
  class Mt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Mt.prototype);
      return e.__wbg_ptr = t, sr.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, sr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawrayintersection_free(t, 0);
    }
    normal() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    time_of_impact() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    featureType() {
      return i.rawpointcolliderprojection_featureType(this.__wbg_ptr);
    }
    featureId() {
      const t = i.rawpointcolliderprojection_featureId(this.__wbg_ptr);
      return t === 4294967297 ? void 0 : t;
    }
  }
  const Qt = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawrigidbodyset_free(s >>> 0, 1));
  class j {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(j.prototype);
      return e.__wbg_ptr = t, Qt.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, Qt.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawrigidbodyset_free(t, 0);
    }
    rbTranslation(t) {
      const e = i.rawrigidbodyset_rbTranslation(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbRotation(t) {
      const e = i.rawrigidbodyset_rbRotation(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    rbSleep(t) {
      i.rawrigidbodyset_rbSleep(this.__wbg_ptr, t);
    }
    rbIsSleeping(t) {
      return i.rawrigidbodyset_rbIsSleeping(this.__wbg_ptr, t) !== 0;
    }
    rbIsMoving(t) {
      return i.rawrigidbodyset_rbIsMoving(this.__wbg_ptr, t) !== 0;
    }
    rbNextTranslation(t) {
      const e = i.rawrigidbodyset_rbNextTranslation(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbNextRotation(t) {
      const e = i.rawrigidbodyset_rbNextRotation(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    rbSetTranslation(t, e, r, a, o) {
      i.rawrigidbodyset_rbSetTranslation(this.__wbg_ptr, t, e, r, a, o);
    }
    rbSetRotation(t, e, r, a, o, _) {
      i.rawrigidbodyset_rbSetRotation(this.__wbg_ptr, t, e, r, a, o, _);
    }
    rbSetLinvel(t, e, r) {
      c(e, l), i.rawrigidbodyset_rbSetLinvel(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbSetAngvel(t, e, r) {
      c(e, l), i.rawrigidbodyset_rbSetAngvel(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbSetNextKinematicTranslation(t, e, r, a) {
      i.rawrigidbodyset_rbSetNextKinematicTranslation(this.__wbg_ptr, t, e, r, a);
    }
    rbSetNextKinematicRotation(t, e, r, a, o) {
      i.rawrigidbodyset_rbSetNextKinematicRotation(this.__wbg_ptr, t, e, r, a, o);
    }
    rbRecomputeMassPropertiesFromColliders(t, e) {
      c(e, E), i.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders(this.__wbg_ptr, t, e.__wbg_ptr);
    }
    rbSetAdditionalMass(t, e, r) {
      i.rawrigidbodyset_rbSetAdditionalMass(this.__wbg_ptr, t, e, r);
    }
    rbSetAdditionalMassProperties(t, e, r, a, o, _) {
      c(r, l), c(a, l), c(o, v), i.rawrigidbodyset_rbSetAdditionalMassProperties(this.__wbg_ptr, t, e, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _);
    }
    rbLinvel(t) {
      const e = i.rawrigidbodyset_rbLinvel(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbAngvel(t) {
      const e = i.rawrigidbodyset_rbAngvel(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbVelocityAtPoint(t, e) {
      c(e, l);
      const r = i.rawrigidbodyset_rbVelocityAtPoint(this.__wbg_ptr, t, e.__wbg_ptr);
      return l.__wrap(r);
    }
    rbLockTranslations(t, e, r) {
      i.rawrigidbodyset_rbLockTranslations(this.__wbg_ptr, t, e, r);
    }
    rbSetEnabledTranslations(t, e, r, a, o) {
      i.rawrigidbodyset_rbSetEnabledTranslations(this.__wbg_ptr, t, e, r, a, o);
    }
    rbLockRotations(t, e, r) {
      i.rawrigidbodyset_rbLockRotations(this.__wbg_ptr, t, e, r);
    }
    rbSetEnabledRotations(t, e, r, a, o) {
      i.rawrigidbodyset_rbSetEnabledRotations(this.__wbg_ptr, t, e, r, a, o);
    }
    rbDominanceGroup(t) {
      return i.rawrigidbodyset_rbDominanceGroup(this.__wbg_ptr, t);
    }
    rbSetDominanceGroup(t, e) {
      i.rawrigidbodyset_rbSetDominanceGroup(this.__wbg_ptr, t, e);
    }
    rbEnableCcd(t, e) {
      i.rawrigidbodyset_rbEnableCcd(this.__wbg_ptr, t, e);
    }
    rbSetSoftCcdPrediction(t, e) {
      i.rawrigidbodyset_rbSetSoftCcdPrediction(this.__wbg_ptr, t, e);
    }
    rbMass(t) {
      return i.rawrigidbodyset_rbMass(this.__wbg_ptr, t);
    }
    rbInvMass(t) {
      return i.rawrigidbodyset_rbInvMass(this.__wbg_ptr, t);
    }
    rbEffectiveInvMass(t) {
      const e = i.rawrigidbodyset_rbEffectiveInvMass(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbLocalCom(t) {
      const e = i.rawrigidbodyset_rbLocalCom(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbWorldCom(t) {
      const e = i.rawrigidbodyset_rbWorldCom(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbInvPrincipalInertiaSqrt(t) {
      const e = i.rawrigidbodyset_rbInvPrincipalInertiaSqrt(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbPrincipalInertiaLocalFrame(t) {
      const e = i.rawrigidbodyset_rbPrincipalInertiaLocalFrame(this.__wbg_ptr, t);
      return v.__wrap(e);
    }
    rbPrincipalInertia(t) {
      const e = i.rawrigidbodyset_rbPrincipalInertia(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbEffectiveWorldInvInertiaSqrt(t) {
      const e = i.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt(this.__wbg_ptr, t);
      return Ct.__wrap(e);
    }
    rbEffectiveAngularInertia(t) {
      const e = i.rawrigidbodyset_rbEffectiveAngularInertia(this.__wbg_ptr, t);
      return Ct.__wrap(e);
    }
    rbWakeUp(t) {
      i.rawrigidbodyset_rbWakeUp(this.__wbg_ptr, t);
    }
    rbIsCcdEnabled(t) {
      return i.rawrigidbodyset_rbIsCcdEnabled(this.__wbg_ptr, t) !== 0;
    }
    rbSoftCcdPrediction(t) {
      return i.rawrigidbodyset_rbSoftCcdPrediction(this.__wbg_ptr, t);
    }
    rbNumColliders(t) {
      return i.rawrigidbodyset_rbNumColliders(this.__wbg_ptr, t) >>> 0;
    }
    rbCollider(t, e) {
      return i.rawrigidbodyset_rbCollider(this.__wbg_ptr, t, e);
    }
    rbBodyType(t) {
      return i.rawrigidbodyset_rbBodyType(this.__wbg_ptr, t);
    }
    rbSetBodyType(t, e, r) {
      i.rawrigidbodyset_rbSetBodyType(this.__wbg_ptr, t, e, r);
    }
    rbIsFixed(t) {
      return i.rawrigidbodyset_rbIsFixed(this.__wbg_ptr, t) !== 0;
    }
    rbIsKinematic(t) {
      return i.rawrigidbodyset_rbIsKinematic(this.__wbg_ptr, t) !== 0;
    }
    rbIsDynamic(t) {
      return i.rawrigidbodyset_rbIsDynamic(this.__wbg_ptr, t) !== 0;
    }
    rbLinearDamping(t) {
      return i.rawrigidbodyset_rbLinearDamping(this.__wbg_ptr, t);
    }
    rbAngularDamping(t) {
      return i.rawrigidbodyset_rbAngularDamping(this.__wbg_ptr, t);
    }
    rbSetLinearDamping(t, e) {
      i.rawrigidbodyset_rbSetLinearDamping(this.__wbg_ptr, t, e);
    }
    rbSetAngularDamping(t, e) {
      i.rawrigidbodyset_rbSetAngularDamping(this.__wbg_ptr, t, e);
    }
    rbSetEnabled(t, e) {
      i.rawrigidbodyset_rbSetEnabled(this.__wbg_ptr, t, e);
    }
    rbIsEnabled(t) {
      return i.rawrigidbodyset_rbIsEnabled(this.__wbg_ptr, t) !== 0;
    }
    rbGravityScale(t) {
      return i.rawrigidbodyset_rbGravityScale(this.__wbg_ptr, t);
    }
    rbSetGravityScale(t, e, r) {
      i.rawrigidbodyset_rbSetGravityScale(this.__wbg_ptr, t, e, r);
    }
    rbResetForces(t, e) {
      i.rawrigidbodyset_rbResetForces(this.__wbg_ptr, t, e);
    }
    rbResetTorques(t, e) {
      i.rawrigidbodyset_rbResetTorques(this.__wbg_ptr, t, e);
    }
    rbAddForce(t, e, r) {
      c(e, l), i.rawrigidbodyset_rbAddForce(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbApplyImpulse(t, e, r) {
      c(e, l), i.rawrigidbodyset_rbApplyImpulse(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbAddTorque(t, e, r) {
      c(e, l), i.rawrigidbodyset_rbAddTorque(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbApplyTorqueImpulse(t, e, r) {
      c(e, l), i.rawrigidbodyset_rbApplyTorqueImpulse(this.__wbg_ptr, t, e.__wbg_ptr, r);
    }
    rbAddForceAtPoint(t, e, r, a) {
      c(e, l), c(r, l), i.rawrigidbodyset_rbAddForceAtPoint(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a);
    }
    rbApplyImpulseAtPoint(t, e, r, a) {
      c(e, l), c(r, l), i.rawrigidbodyset_rbApplyImpulseAtPoint(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a);
    }
    rbAdditionalSolverIterations(t) {
      return i.rawrigidbodyset_rbAdditionalSolverIterations(this.__wbg_ptr, t) >>> 0;
    }
    rbSetAdditionalSolverIterations(t, e) {
      i.rawrigidbodyset_rbSetAdditionalSolverIterations(this.__wbg_ptr, t, e);
    }
    rbUserData(t) {
      return i.rawrigidbodyset_rbUserData(this.__wbg_ptr, t) >>> 0;
    }
    rbSetUserData(t, e) {
      i.rawrigidbodyset_rbSetUserData(this.__wbg_ptr, t, e);
    }
    rbUserForce(t) {
      const e = i.rawrigidbodyset_rbUserForce(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    rbUserTorque(t) {
      const e = i.rawrigidbodyset_rbUserTorque(this.__wbg_ptr, t);
      return l.__wrap(e);
    }
    constructor() {
      const t = i.rawrigidbodyset_new();
      return this.__wbg_ptr = t >>> 0, Qt.register(this, this.__wbg_ptr, this), this;
    }
    createRigidBody(t, e, r, a, o, _, d, h, p, u, g, b, y, I, L, G, W, q, tt, Nt, Gt, Wt, qt, Bt, mt, Vt) {
      return c(e, l), c(r, v), c(d, l), c(h, l), c(p, l), c(u, l), c(g, v), i.rawrigidbodyset_createRigidBody(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a, o, _, d.__wbg_ptr, h.__wbg_ptr, p.__wbg_ptr, u.__wbg_ptr, g.__wbg_ptr, b, y, I, L, G, W, q, tt, Nt, Gt, Wt, qt, Bt, mt, Vt);
    }
    remove(t, e, r, a, o) {
      c(e, K), c(r, E), c(a, J), c(o, Y), i.rawrigidbodyset_remove(this.__wbg_ptr, t, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr);
    }
    len() {
      return i.rawcolliderset_len(this.__wbg_ptr) >>> 0;
    }
    contains(t) {
      return i.rawrigidbodyset_contains(this.__wbg_ptr, t) !== 0;
    }
    forEachRigidBodyHandle(t) {
      try {
        i.rawrigidbodyset_forEachRigidBodyHandle(this.__wbg_ptr, A(t));
      } finally {
        R[x++] = void 0;
      }
    }
    propagateModifiedBodyPositionsToColliders(t) {
      c(t, E), i.rawrigidbodyset_propagateModifiedBodyPositionsToColliders(this.__wbg_ptr, t.__wbg_ptr);
    }
  }
  const te = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawrotation_free(s >>> 0, 1));
  class v {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(v.prototype);
      return e.__wbg_ptr = t, te.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, te.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawrotation_free(t, 0);
    }
    constructor(t, e, r, a) {
      const o = i.rawrotation_new(t, e, r, a);
      return this.__wbg_ptr = o >>> 0, te.register(this, this.__wbg_ptr, this), this;
    }
    static identity() {
      const t = i.rawrotation_identity();
      return v.__wrap(t);
    }
    get x() {
      return i.rawrotation_x(this.__wbg_ptr);
    }
    get y() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    get z() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    get w() {
      return i.rawrotation_w(this.__wbg_ptr);
    }
  }
  const or = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawsdpmatrix3_free(s >>> 0, 1));
  class Ct {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(Ct.prototype);
      return e.__wbg_ptr = t, or.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, or.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawsdpmatrix3_free(t, 0);
    }
    elements() {
      const t = i.rawsdpmatrix3_elements(this.__wbg_ptr);
      return lt(t);
    }
  }
  const _r = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawserializationpipeline_free(s >>> 0, 1));
  class hi {
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, _r.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawserializationpipeline_free(t, 0);
    }
    constructor() {
      const t = i.rawserializationpipeline_new();
      return this.__wbg_ptr = t >>> 0, _r.register(this, this.__wbg_ptr, this), this;
    }
    serializeAll(t, e, r, a, o, _, d, h, p) {
      c(t, l), c(e, it), c(r, K), c(a, rt), c(o, $), c(_, j), c(d, E), c(h, J), c(p, Y);
      const u = i.rawserializationpipeline_serializeAll(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _.__wbg_ptr, d.__wbg_ptr, h.__wbg_ptr, p.__wbg_ptr);
      return lt(u);
    }
    deserializeAll(t) {
      const e = i.rawserializationpipeline_deserializeAll(this.__wbg_ptr, T(t));
      return e === 0 ? void 0 : fe.__wrap(e);
    }
  }
  const cr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawshape_free(s >>> 0, 1));
  class m {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(m.prototype);
      return e.__wbg_ptr = t, cr.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, cr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawshape_free(t, 0);
    }
    static cuboid(t, e, r) {
      const a = i.rawshape_cuboid(t, e, r);
      return m.__wrap(a);
    }
    static roundCuboid(t, e, r, a) {
      const o = i.rawshape_roundCuboid(t, e, r, a);
      return m.__wrap(o);
    }
    static ball(t) {
      const e = i.rawshape_ball(t);
      return m.__wrap(e);
    }
    static halfspace(t) {
      c(t, l);
      const e = i.rawshape_halfspace(t.__wbg_ptr);
      return m.__wrap(e);
    }
    static capsule(t, e) {
      const r = i.rawshape_capsule(t, e);
      return m.__wrap(r);
    }
    static cylinder(t, e) {
      const r = i.rawshape_cylinder(t, e);
      return m.__wrap(r);
    }
    static roundCylinder(t, e, r) {
      const a = i.rawshape_roundCylinder(t, e, r);
      return m.__wrap(a);
    }
    static cone(t, e) {
      const r = i.rawshape_cone(t, e);
      return m.__wrap(r);
    }
    static roundCone(t, e, r) {
      const a = i.rawshape_roundCone(t, e, r);
      return m.__wrap(a);
    }
    static voxels(t, e) {
      c(t, l);
      const r = _t(e, i.__wbindgen_export_2), a = N, o = i.rawshape_voxels(t.__wbg_ptr, r, a);
      return m.__wrap(o);
    }
    static voxelsFromPoints(t, e) {
      c(t, l);
      const r = Z(e, i.__wbindgen_export_2), a = N, o = i.rawshape_voxelsFromPoints(t.__wbg_ptr, r, a);
      return m.__wrap(o);
    }
    static polyline(t, e) {
      const r = Z(t, i.__wbindgen_export_2), a = N, o = _t(e, i.__wbindgen_export_2), _ = N, d = i.rawshape_polyline(r, a, o, _);
      return m.__wrap(d);
    }
    static trimesh(t, e, r) {
      const a = Z(t, i.__wbindgen_export_2), o = N, _ = _t(e, i.__wbindgen_export_2), d = N, h = i.rawshape_trimesh(a, o, _, d, r);
      return h === 0 ? void 0 : m.__wrap(h);
    }
    static heightfield(t, e, r, a, o) {
      const _ = Z(r, i.__wbindgen_export_2), d = N;
      c(a, l);
      const h = i.rawshape_heightfield(t, e, _, d, a.__wbg_ptr, o);
      return m.__wrap(h);
    }
    static segment(t, e) {
      c(t, l), c(e, l);
      const r = i.rawshape_segment(t.__wbg_ptr, e.__wbg_ptr);
      return m.__wrap(r);
    }
    static triangle(t, e, r) {
      c(t, l), c(e, l), c(r, l);
      const a = i.rawshape_triangle(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr);
      return m.__wrap(a);
    }
    static roundTriangle(t, e, r, a) {
      c(t, l), c(e, l), c(r, l);
      const o = i.rawshape_roundTriangle(t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a);
      return m.__wrap(o);
    }
    static convexHull(t) {
      const e = Z(t, i.__wbindgen_export_2), r = N, a = i.rawshape_convexHull(e, r);
      return a === 0 ? void 0 : m.__wrap(a);
    }
    static roundConvexHull(t, e) {
      const r = Z(t, i.__wbindgen_export_2), a = N, o = i.rawshape_roundConvexHull(r, a, e);
      return o === 0 ? void 0 : m.__wrap(o);
    }
    static convexMesh(t, e) {
      const r = Z(t, i.__wbindgen_export_2), a = N, o = _t(e, i.__wbindgen_export_2), _ = N, d = i.rawshape_convexMesh(r, a, o, _);
      return d === 0 ? void 0 : m.__wrap(d);
    }
    static roundConvexMesh(t, e, r) {
      const a = Z(t, i.__wbindgen_export_2), o = N, _ = _t(e, i.__wbindgen_export_2), d = N, h = i.rawshape_roundConvexMesh(a, o, _, d, r);
      return h === 0 ? void 0 : m.__wrap(h);
    }
    castShape(t, e, r, a, o, _, d, h, p, u) {
      c(t, l), c(e, v), c(r, l), c(a, m), c(o, l), c(_, v), c(d, l);
      const g = i.rawshape_castShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _.__wbg_ptr, d.__wbg_ptr, h, p, u);
      return g === 0 ? void 0 : kt.__wrap(g);
    }
    intersectsShape(t, e, r, a, o) {
      return c(t, l), c(e, v), c(r, m), c(a, l), c(o, v), i.rawshape_intersectsShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr) !== 0;
    }
    contactShape(t, e, r, a, o, _) {
      c(t, l), c(e, v), c(r, m), c(a, l), c(o, v);
      const d = i.rawshape_contactShape(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o.__wbg_ptr, _);
      return d === 0 ? void 0 : wt.__wrap(d);
    }
    containsPoint(t, e, r) {
      return c(t, l), c(e, v), c(r, l), i.rawshape_containsPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr) !== 0;
    }
    projectPoint(t, e, r, a) {
      c(t, l), c(e, v), c(r, l);
      const o = i.rawshape_projectPoint(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a);
      return zt.__wrap(o);
    }
    intersectsRay(t, e, r, a, o) {
      return c(t, l), c(e, v), c(r, l), c(a, l), i.rawshape_intersectsRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o) !== 0;
    }
    castRay(t, e, r, a, o, _) {
      return c(t, l), c(e, v), c(r, l), c(a, l), i.rawshape_castRay(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _);
    }
    castRayAndGetNormal(t, e, r, a, o, _) {
      c(t, l), c(e, v), c(r, l), c(a, l);
      const d = i.rawshape_castRayAndGetNormal(this.__wbg_ptr, t.__wbg_ptr, e.__wbg_ptr, r.__wbg_ptr, a.__wbg_ptr, o, _);
      return d === 0 ? void 0 : Mt.__wrap(d);
    }
  }
  const lr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawshapecasthit_free(s >>> 0, 1));
  class kt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(kt.prototype);
      return e.__wbg_ptr = t, lr.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, lr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawshapecasthit_free(t, 0);
    }
    time_of_impact() {
      return i.rawrotation_x(this.__wbg_ptr);
    }
    witness1() {
      const t = i.rawshapecasthit_witness1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    witness2() {
      const t = i.rawcontactforceevent_total_force(this.__wbg_ptr);
      return l.__wrap(t);
    }
    normal1() {
      const t = i.rawshapecasthit_normal1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    normal2() {
      const t = i.rawshapecasthit_normal2(this.__wbg_ptr);
      return l.__wrap(t);
    }
  }
  const wr = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawshapecontact_free(s >>> 0, 1));
  class wt {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(wt.prototype);
      return e.__wbg_ptr = t, wr.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, wr.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawshapecontact_free(t, 0);
    }
    distance() {
      return i.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
    }
    point1() {
      const t = i.rawpointprojection_point(this.__wbg_ptr);
      return l.__wrap(t);
    }
    point2() {
      const t = i.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return l.__wrap(t);
    }
    normal1() {
      const t = i.rawcollidershapecasthit_witness2(this.__wbg_ptr);
      return l.__wrap(t);
    }
    normal2() {
      const t = i.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return l.__wrap(t);
    }
  }
  const ee = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((s) => i.__wbg_rawvector_free(s >>> 0, 1));
  class l {
    static __wrap(t) {
      t = t >>> 0;
      const e = Object.create(l.prototype);
      return e.__wbg_ptr = t, ee.register(e, e.__wbg_ptr, e), e;
    }
    __destroy_into_raw() {
      const t = this.__wbg_ptr;
      return this.__wbg_ptr = 0, ee.unregister(this), t;
    }
    free() {
      const t = this.__destroy_into_raw();
      i.__wbg_rawvector_free(t, 0);
    }
    static zero() {
      const t = i.rawvector_zero();
      return l.__wrap(t);
    }
    constructor(t, e, r) {
      const a = i.rawvector_new(t, e, r);
      return this.__wbg_ptr = a >>> 0, ee.register(this, this.__wbg_ptr, this), this;
    }
    get x() {
      return i.rawrotation_x(this.__wbg_ptr);
    }
    set x(t) {
      i.rawvector_set_x(this.__wbg_ptr, t);
    }
    get y() {
      return i.rawintegrationparameters_dt(this.__wbg_ptr);
    }
    set y(t) {
      i.rawintegrationparameters_set_dt(this.__wbg_ptr, t);
    }
    get z() {
      return i.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
    }
    set z(t) {
      i.rawvector_set_z(this.__wbg_ptr, t);
    }
    xyz() {
      const t = i.rawvector_xyz(this.__wbg_ptr);
      return l.__wrap(t);
    }
    yxz() {
      const t = i.rawvector_yxz(this.__wbg_ptr);
      return l.__wrap(t);
    }
    zxy() {
      const t = i.rawvector_zxy(this.__wbg_ptr);
      return l.__wrap(t);
    }
    xzy() {
      const t = i.rawvector_xzy(this.__wbg_ptr);
      return l.__wrap(t);
    }
    yzx() {
      const t = i.rawvector_yzx(this.__wbg_ptr);
      return l.__wrap(t);
    }
    zyx() {
      const t = i.rawvector_zyx(this.__wbg_ptr);
      return l.__wrap(t);
    }
  }
  function pi(s, t, e, r) {
    const a = C(s).bind(C(t), C(e), C(r));
    return T(a);
  }
  function ui(s) {
    const t = C(s).buffer;
    return T(t);
  }
  function gi() {
    return ue(function(s, t, e) {
      const r = C(s).call(C(t), C(e));
      return T(r);
    }, arguments);
  }
  function bi() {
    return ue(function(s, t, e, r) {
      const a = C(s).call(C(t), C(e), C(r));
      return T(a);
    }, arguments);
  }
  function mi() {
    return ue(function(s, t, e, r, a) {
      const o = C(s).call(C(t), C(e), C(r), C(a));
      return T(o);
    }, arguments);
  }
  function fi(s) {
    return C(s).length;
  }
  function yi(s) {
    return C(s).length;
  }
  function Si(s) {
    const t = new Uint8Array(C(s));
    return T(t);
  }
  function vi(s, t, e) {
    const r = new Uint8Array(C(s), t >>> 0, e >>> 0);
    return T(r);
  }
  function Ri(s, t, e) {
    const r = new Float32Array(C(s), t >>> 0, e >>> 0);
    return T(r);
  }
  function Ci(s) {
    const t = new Float32Array(s >>> 0);
    return T(t);
  }
  function xi(s) {
    const t = ge.__wrap(s);
    return T(t);
  }
  function Ii(s) {
    const t = Tt.__wrap(s);
    return T(t);
  }
  function Ai(s, t, e) {
    C(s).set(C(t), e >>> 0);
  }
  function ji(s, t, e) {
    C(s).set(C(t), e >>> 0);
  }
  function Ei(s) {
    const t = C(s);
    return typeof t == "boolean" ? t ? 1 : 0 : 2;
  }
  function Pi(s) {
    return typeof C(s) == "function";
  }
  function Fi() {
    const s = i.memory;
    return T(s);
  }
  function zi(s, t) {
    const e = C(t), r = typeof e == "number" ? e : void 0;
    z().setFloat64(s + 8, f(r) ? 0 : r, true), z().setInt32(s + 0, !f(r), true);
  }
  function Ti(s) {
    return T(s);
  }
  function Mi(s) {
    lt(s);
  }
  function ki(s, t) {
    throw new Error(hr(s, t));
  }
  URL = globalThis.URL;
  const n = await $r({
    "./rapier_wasm3d_bg.js": {
      __wbindgen_number_new: Ti,
      __wbindgen_boolean_get: Ei,
      __wbindgen_object_drop_ref: Mi,
      __wbindgen_number_get: zi,
      __wbindgen_is_function: Pi,
      __wbg_rawraycolliderintersection_new: Ii,
      __wbg_rawcontactforceevent_new: xi,
      __wbg_call_7cccdd69e0791ae2: gi,
      __wbg_call_833bed5770ea2041: bi,
      __wbg_call_b8adc8b1d0a0d8eb: mi,
      __wbg_bind_c8359b1cba058168: pi,
      __wbg_buffer_609cc3eee51ed158: ui,
      __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a: vi,
      __wbg_new_a12002a7f91c75be: Si,
      __wbg_set_65595bdd868b3009: ji,
      __wbg_length_a446193dc22c12f8: yi,
      __wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354: Ri,
      __wbg_set_10bad9bee0e9c58b: Ai,
      __wbg_length_3b4f022188ae8db6: fi,
      __wbg_newwithlength_5a5efe313cfd59f1: Ci,
      __wbindgen_throw: ki,
      __wbindgen_memory: Fi
    }
  }, Zr), Hi = n.memory, Di = n.version, Li = n.__wbg_rawkinematiccharactercontroller_free, Ni = n.rawkinematiccharactercontroller_new, Gi = n.rawkinematiccharactercontroller_setUp, Wi = n.rawkinematiccharactercontroller_normalNudgeFactor, qi = n.rawkinematiccharactercontroller_setNormalNudgeFactor, Bi = n.rawkinematiccharactercontroller_setOffset, Vi = n.rawkinematiccharactercontroller_slideEnabled, Oi = n.rawkinematiccharactercontroller_setSlideEnabled, Ui = n.rawkinematiccharactercontroller_autostepMaxHeight, Xi = n.rawkinematiccharactercontroller_autostepMinWidth, Ji = n.rawkinematiccharactercontroller_autostepIncludesDynamicBodies, Ki = n.rawkinematiccharactercontroller_autostepEnabled, Yi = n.rawkinematiccharactercontroller_enableAutostep, Zi = n.rawkinematiccharactercontroller_disableAutostep, $i = n.rawkinematiccharactercontroller_maxSlopeClimbAngle, Qi = n.rawkinematiccharactercontroller_setMaxSlopeClimbAngle, tn = n.rawkinematiccharactercontroller_minSlopeSlideAngle, en = n.rawkinematiccharactercontroller_setMinSlopeSlideAngle, rn = n.rawkinematiccharactercontroller_snapToGroundDistance, nn = n.rawkinematiccharactercontroller_enableSnapToGround, an = n.rawkinematiccharactercontroller_disableSnapToGround, sn = n.rawkinematiccharactercontroller_snapToGroundEnabled, on = n.rawkinematiccharactercontroller_computeColliderMovement, _n = n.rawkinematiccharactercontroller_computedMovement, cn = n.rawkinematiccharactercontroller_computedGrounded, ln = n.rawkinematiccharactercontroller_numComputedCollisions, wn = n.rawkinematiccharactercontroller_computedCollision, dn = n.__wbg_rawcharactercollision_free, hn = n.rawcharactercollision_new, pn = n.rawcharactercollision_handle, un = n.rawcharactercollision_translationDeltaApplied, gn = n.rawcharactercollision_translationDeltaRemaining, bn = n.rawcharactercollision_toi, mn = n.rawcharactercollision_worldWitness1, fn = n.rawcharactercollision_worldWitness2, yn = n.rawcharactercollision_worldNormal1, Sn = n.rawcharactercollision_worldNormal2, vn = n.__wbg_rawpidcontroller_free, Rn = n.rawpidcontroller_new, Cn = n.rawpidcontroller_set_kp, xn = n.rawpidcontroller_set_ki, In = n.rawpidcontroller_set_kd, An = n.rawpidcontroller_set_axes_mask, jn = n.rawpidcontroller_reset_integrals, En = n.rawpidcontroller_apply_linear_correction, Pn = n.rawpidcontroller_apply_angular_correction, Fn = n.rawpidcontroller_linear_correction, zn = n.rawpidcontroller_angular_correction, Tn = n.__wbg_rawdynamicraycastvehiclecontroller_free, Mn = n.rawdynamicraycastvehiclecontroller_new, kn = n.rawdynamicraycastvehiclecontroller_current_vehicle_speed, Hn = n.rawdynamicraycastvehiclecontroller_chassis, Dn = n.rawdynamicraycastvehiclecontroller_index_up_axis, Ln = n.rawdynamicraycastvehiclecontroller_set_index_up_axis, Nn = n.rawdynamicraycastvehiclecontroller_index_forward_axis, Gn = n.rawdynamicraycastvehiclecontroller_set_index_forward_axis, Wn = n.rawdynamicraycastvehiclecontroller_add_wheel, qn = n.rawdynamicraycastvehiclecontroller_num_wheels, Bn = n.rawdynamicraycastvehiclecontroller_update_vehicle, Vn = n.rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs, On = n.rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs, Un = n.rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length, Xn = n.rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length, Jn = n.rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel, Kn = n.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel, Yn = n.rawdynamicraycastvehiclecontroller_wheel_radius, Zn = n.rawdynamicraycastvehiclecontroller_set_wheel_radius, $n = n.rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness, Qn = n.rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness, ta = n.rawdynamicraycastvehiclecontroller_wheel_suspension_compression, ea = n.rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression, ra = n.rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation, ia = n.rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation, na = n.rawdynamicraycastvehiclecontroller_wheel_max_suspension_force, aa = n.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force, sa = n.rawdynamicraycastvehiclecontroller_wheel_brake, oa = n.rawdynamicraycastvehiclecontroller_set_wheel_brake, _a = n.rawdynamicraycastvehiclecontroller_wheel_steering, ca = n.rawdynamicraycastvehiclecontroller_set_wheel_steering, la = n.rawdynamicraycastvehiclecontroller_wheel_engine_force, wa = n.rawdynamicraycastvehiclecontroller_set_wheel_engine_force, da = n.rawdynamicraycastvehiclecontroller_wheel_direction_cs, ha = n.rawdynamicraycastvehiclecontroller_set_wheel_direction_cs, pa = n.rawdynamicraycastvehiclecontroller_wheel_axle_cs, ua = n.rawdynamicraycastvehiclecontroller_set_wheel_axle_cs, ga = n.rawdynamicraycastvehiclecontroller_wheel_friction_slip, ba = n.rawdynamicraycastvehiclecontroller_set_wheel_friction_slip, ma = n.rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness, fa = n.rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness, ya = n.rawdynamicraycastvehiclecontroller_wheel_rotation, Sa = n.rawdynamicraycastvehiclecontroller_wheel_forward_impulse, va = n.rawdynamicraycastvehiclecontroller_wheel_side_impulse, Ra = n.rawdynamicraycastvehiclecontroller_wheel_suspension_force, Ca = n.rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws, xa = n.rawdynamicraycastvehiclecontroller_wheel_contact_point_ws, Ia = n.rawdynamicraycastvehiclecontroller_wheel_suspension_length, Aa = n.rawdynamicraycastvehiclecontroller_wheel_hard_point_ws, ja = n.rawdynamicraycastvehiclecontroller_wheel_is_in_contact, Ea = n.rawdynamicraycastvehiclecontroller_wheel_ground_object, Pa = n.__wbg_rawccdsolver_free, Fa = n.rawccdsolver_new, za = n.rawimpulsejointset_jointType, Ta = n.rawimpulsejointset_jointBodyHandle1, Ma = n.rawimpulsejointset_jointBodyHandle2, ka = n.rawimpulsejointset_jointFrameX1, Ha = n.rawimpulsejointset_jointFrameX2, Da = n.rawimpulsejointset_jointAnchor1, La = n.rawimpulsejointset_jointAnchor2, Na = n.rawimpulsejointset_jointSetAnchor1, Ga = n.rawimpulsejointset_jointSetAnchor2, Wa = n.rawimpulsejointset_jointContactsEnabled, qa = n.rawimpulsejointset_jointSetContactsEnabled, Ba = n.rawimpulsejointset_jointLimitsEnabled, Va = n.rawimpulsejointset_jointLimitsMin, Oa = n.rawimpulsejointset_jointLimitsMax, Ua = n.rawimpulsejointset_jointSetLimits, Xa = n.rawimpulsejointset_jointConfigureMotorModel, Ja = n.rawimpulsejointset_jointConfigureMotorVelocity, Ka = n.rawimpulsejointset_jointConfigureMotorPosition, Ya = n.rawimpulsejointset_jointConfigureMotor, Za = n.__wbg_rawimpulsejointset_free, $a = n.rawimpulsejointset_new, Qa = n.rawimpulsejointset_createJoint, ts = n.rawimpulsejointset_remove, es = n.rawimpulsejointset_len, rs = n.rawimpulsejointset_contains, is = n.rawimpulsejointset_forEachJointHandle, ns = n.rawimpulsejointset_forEachJointAttachedToRigidBody, as = n.__wbg_rawintegrationparameters_free, ss = n.rawintegrationparameters_new, os = n.rawintegrationparameters_dt, _s = n.rawintegrationparameters_contact_erp, cs = n.rawintegrationparameters_numSolverIterations, ls = n.rawintegrationparameters_minIslandSize, ws = n.rawintegrationparameters_maxCcdSubsteps, ds = n.rawintegrationparameters_lengthUnit, hs = n.rawintegrationparameters_set_dt, ps = n.rawintegrationparameters_set_contact_natural_frequency, us = n.rawintegrationparameters_set_normalizedAllowedLinearError, gs = n.rawintegrationparameters_set_normalizedPredictionDistance, bs = n.rawintegrationparameters_set_numSolverIterations, ms = n.rawintegrationparameters_set_minIslandSize, fs = n.rawintegrationparameters_set_maxCcdSubsteps, ys = n.rawintegrationparameters_set_lengthUnit, Ss = n.rawintegrationparameters_switchToStandardPgsSolver, vs = n.rawintegrationparameters_switchToSmallStepsPgsSolver, Rs = n.rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart, Cs = n.__wbg_rawislandmanager_free, xs = n.rawislandmanager_new, Is = n.rawislandmanager_forEachActiveRigidBodyHandle, As = n.__wbg_rawgenericjoint_free, js = n.rawgenericjoint_generic, Es = n.rawgenericjoint_spring, Ps = n.rawgenericjoint_rope, Fs = n.rawgenericjoint_spherical, zs = n.rawgenericjoint_prismatic, Ts = n.rawgenericjoint_fixed, Ms = n.rawgenericjoint_revolute, ks = n.rawmultibodyjointset_jointType, Hs = n.rawmultibodyjointset_jointFrameX1, Ds = n.rawmultibodyjointset_jointFrameX2, Ls = n.rawmultibodyjointset_jointAnchor1, Ns = n.rawmultibodyjointset_jointAnchor2, Gs = n.rawmultibodyjointset_jointContactsEnabled, Ws = n.rawmultibodyjointset_jointSetContactsEnabled, qs = n.rawmultibodyjointset_jointLimitsEnabled, Bs = n.rawmultibodyjointset_jointLimitsMin, Vs = n.rawmultibodyjointset_jointLimitsMax, Os = n.__wbg_rawmultibodyjointset_free, Us = n.rawmultibodyjointset_new, Xs = n.rawmultibodyjointset_createJoint, Js = n.rawmultibodyjointset_remove, Ks = n.rawmultibodyjointset_contains, Ys = n.rawmultibodyjointset_forEachJointHandle, Zs = n.rawmultibodyjointset_forEachJointAttachedToRigidBody, $s = n.rawrigidbodyset_rbTranslation, Qs = n.rawrigidbodyset_rbRotation, to = n.rawrigidbodyset_rbSleep, eo = n.rawrigidbodyset_rbIsSleeping, ro = n.rawrigidbodyset_rbIsMoving, io = n.rawrigidbodyset_rbNextTranslation, no = n.rawrigidbodyset_rbNextRotation, ao = n.rawrigidbodyset_rbSetTranslation, so = n.rawrigidbodyset_rbSetRotation, oo = n.rawrigidbodyset_rbSetLinvel, _o = n.rawrigidbodyset_rbSetAngvel, co = n.rawrigidbodyset_rbSetNextKinematicTranslation, lo = n.rawrigidbodyset_rbSetNextKinematicRotation, wo = n.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders, ho = n.rawrigidbodyset_rbSetAdditionalMass, po = n.rawrigidbodyset_rbSetAdditionalMassProperties, uo = n.rawrigidbodyset_rbLinvel, go = n.rawrigidbodyset_rbAngvel, bo = n.rawrigidbodyset_rbVelocityAtPoint, mo = n.rawrigidbodyset_rbLockTranslations, fo = n.rawrigidbodyset_rbSetEnabledTranslations, yo = n.rawrigidbodyset_rbLockRotations, So = n.rawrigidbodyset_rbSetEnabledRotations, vo = n.rawrigidbodyset_rbDominanceGroup, Ro = n.rawrigidbodyset_rbSetDominanceGroup, Co = n.rawrigidbodyset_rbEnableCcd, xo = n.rawrigidbodyset_rbSetSoftCcdPrediction, Io = n.rawrigidbodyset_rbMass, Ao = n.rawrigidbodyset_rbInvMass, jo = n.rawrigidbodyset_rbEffectiveInvMass, Eo = n.rawrigidbodyset_rbLocalCom, Po = n.rawrigidbodyset_rbWorldCom, Fo = n.rawrigidbodyset_rbInvPrincipalInertiaSqrt, zo = n.rawrigidbodyset_rbPrincipalInertiaLocalFrame, To = n.rawrigidbodyset_rbPrincipalInertia, Mo = n.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt, ko = n.rawrigidbodyset_rbEffectiveAngularInertia, Ho = n.rawrigidbodyset_rbWakeUp, Do = n.rawrigidbodyset_rbIsCcdEnabled, Lo = n.rawrigidbodyset_rbSoftCcdPrediction, No = n.rawrigidbodyset_rbNumColliders, Go = n.rawrigidbodyset_rbCollider, Wo = n.rawrigidbodyset_rbBodyType, qo = n.rawrigidbodyset_rbSetBodyType, Bo = n.rawrigidbodyset_rbIsFixed, Vo = n.rawrigidbodyset_rbIsKinematic, Oo = n.rawrigidbodyset_rbIsDynamic, Uo = n.rawrigidbodyset_rbLinearDamping, Xo = n.rawrigidbodyset_rbAngularDamping, Jo = n.rawrigidbodyset_rbSetLinearDamping, Ko = n.rawrigidbodyset_rbSetAngularDamping, Yo = n.rawrigidbodyset_rbSetEnabled, Zo = n.rawrigidbodyset_rbIsEnabled, $o = n.rawrigidbodyset_rbGravityScale, Qo = n.rawrigidbodyset_rbSetGravityScale, t_ = n.rawrigidbodyset_rbResetForces, e_ = n.rawrigidbodyset_rbResetTorques, r_ = n.rawrigidbodyset_rbAddForce, i_ = n.rawrigidbodyset_rbApplyImpulse, n_ = n.rawrigidbodyset_rbAddTorque, a_ = n.rawrigidbodyset_rbApplyTorqueImpulse, s_ = n.rawrigidbodyset_rbAddForceAtPoint, o_ = n.rawrigidbodyset_rbApplyImpulseAtPoint, __ = n.rawrigidbodyset_rbAdditionalSolverIterations, c_ = n.rawrigidbodyset_rbSetAdditionalSolverIterations, l_ = n.rawrigidbodyset_rbUserData, w_ = n.rawrigidbodyset_rbSetUserData, d_ = n.rawrigidbodyset_rbUserForce, h_ = n.rawrigidbodyset_rbUserTorque, p_ = n.__wbg_rawrigidbodyset_free, u_ = n.rawrigidbodyset_new, g_ = n.rawrigidbodyset_createRigidBody, b_ = n.rawrigidbodyset_remove, m_ = n.rawrigidbodyset_contains, f_ = n.rawrigidbodyset_forEachRigidBodyHandle, y_ = n.rawrigidbodyset_propagateModifiedBodyPositionsToColliders, S_ = n.__wbg_rawbroadphase_free, v_ = n.rawbroadphase_new, R_ = n.rawcolliderset_coTranslation, C_ = n.rawcolliderset_coRotation, x_ = n.rawcolliderset_coSetTranslation, I_ = n.rawcolliderset_coSetTranslationWrtParent, A_ = n.rawcolliderset_coSetRotation, j_ = n.rawcolliderset_coSetRotationWrtParent, E_ = n.rawcolliderset_coIsSensor, P_ = n.rawcolliderset_coShapeType, F_ = n.rawcolliderset_coHalfspaceNormal, z_ = n.rawcolliderset_coHalfExtents, T_ = n.rawcolliderset_coSetHalfExtents, M_ = n.rawcolliderset_coRadius, k_ = n.rawcolliderset_coSetRadius, H_ = n.rawcolliderset_coHalfHeight, D_ = n.rawcolliderset_coSetHalfHeight, L_ = n.rawcolliderset_coRoundRadius, N_ = n.rawcolliderset_coSetRoundRadius, G_ = n.rawcolliderset_coVoxelData, W_ = n.rawcolliderset_coVoxelSize, q_ = n.rawcolliderset_coSetVoxel, B_ = n.rawcolliderset_coPropagateVoxelChange, V_ = n.rawcolliderset_coCombineVoxelStates, O_ = n.rawcolliderset_coVertices, U_ = n.rawcolliderset_coIndices, X_ = n.rawcolliderset_coTriMeshFlags, J_ = n.rawcolliderset_coHeightFieldFlags, K_ = n.rawcolliderset_coHeightfieldHeights, Y_ = n.rawcolliderset_coHeightfieldScale, Z_ = n.rawcolliderset_coHeightfieldNRows, $_ = n.rawcolliderset_coHeightfieldNCols, Q_ = n.rawcolliderset_coParent, tc = n.rawcolliderset_coSetEnabled, ec = n.rawcolliderset_coIsEnabled, rc = n.rawcolliderset_coSetContactSkin, ic = n.rawcolliderset_coContactSkin, nc = n.rawcolliderset_coFriction, ac = n.rawcolliderset_coRestitution, sc = n.rawcolliderset_coDensity, oc = n.rawcolliderset_coMass, _c = n.rawcolliderset_coVolume, cc = n.rawcolliderset_coCollisionGroups, lc = n.rawcolliderset_coSolverGroups, wc = n.rawcolliderset_coActiveHooks, dc = n.rawcolliderset_coActiveCollisionTypes, hc = n.rawcolliderset_coActiveEvents, pc = n.rawcolliderset_coContactForceEventThreshold, uc = n.rawcolliderset_coContainsPoint, gc = n.rawcolliderset_coCastShape, bc = n.rawcolliderset_coCastCollider, mc = n.rawcolliderset_coIntersectsShape, fc = n.rawcolliderset_coContactShape, yc = n.rawcolliderset_coContactCollider, Sc = n.rawcolliderset_coProjectPoint, vc = n.rawcolliderset_coIntersectsRay, Rc = n.rawcolliderset_coCastRay, Cc = n.rawcolliderset_coCastRayAndGetNormal, xc = n.rawcolliderset_coSetSensor, Ic = n.rawcolliderset_coSetRestitution, Ac = n.rawcolliderset_coSetFriction, jc = n.rawcolliderset_coFrictionCombineRule, Ec = n.rawcolliderset_coSetFrictionCombineRule, Pc = n.rawcolliderset_coRestitutionCombineRule, Fc = n.rawcolliderset_coSetRestitutionCombineRule, zc = n.rawcolliderset_coSetCollisionGroups, Tc = n.rawcolliderset_coSetSolverGroups, Mc = n.rawcolliderset_coSetActiveHooks, kc = n.rawcolliderset_coSetActiveEvents, Hc = n.rawcolliderset_coSetActiveCollisionTypes, Dc = n.rawcolliderset_coSetShape, Lc = n.rawcolliderset_coSetContactForceEventThreshold, Nc = n.rawcolliderset_coSetDensity, Gc = n.rawcolliderset_coSetMass, Wc = n.rawcolliderset_coSetMassProperties, qc = n.__wbg_rawcolliderset_free, Bc = n.rawcolliderset_new, Vc = n.rawcolliderset_len, Oc = n.rawcolliderset_contains, Uc = n.rawcolliderset_createCollider, Xc = n.rawcolliderset_remove, Jc = n.rawcolliderset_forEachColliderHandle, Kc = n.__wbg_rawshapecontact_free, Yc = n.__wbg_rawnarrowphase_free, Zc = n.rawnarrowphase_new, $c = n.rawnarrowphase_contact_pairs_with, Qc = n.rawnarrowphase_contact_pair, tl = n.rawnarrowphase_intersection_pairs_with, el = n.rawnarrowphase_intersection_pair, rl = n.__wbg_rawcontactmanifold_free, il = n.rawcontactpair_collider1, nl = n.rawcontactpair_collider2, al = n.rawcontactpair_numContactManifolds, sl = n.rawcontactpair_contactManifold, ol = n.rawcontactmanifold_normal, _l = n.rawcontactmanifold_local_n1, cl = n.rawcontactmanifold_local_n2, ll = n.rawcontactmanifold_subshape1, wl = n.rawcontactmanifold_subshape2, dl = n.rawcontactmanifold_num_contacts, hl = n.rawcontactmanifold_contact_local_p1, pl = n.rawcontactmanifold_contact_local_p2, ul = n.rawcontactmanifold_contact_dist, gl = n.rawcontactmanifold_contact_fid1, bl = n.rawcontactmanifold_contact_fid2, ml = n.rawcontactmanifold_contact_impulse, fl = n.rawcontactmanifold_contact_tangent_impulse_x, yl = n.rawcontactmanifold_contact_tangent_impulse_y, Sl = n.rawcontactmanifold_num_solver_contacts, vl = n.rawcontactmanifold_solver_contact_point, Rl = n.rawcontactmanifold_solver_contact_dist, Cl = n.rawcontactmanifold_solver_contact_friction, xl = n.rawcontactmanifold_solver_contact_restitution, Il = n.rawcontactmanifold_solver_contact_tangent_velocity, Al = n.__wbg_rawpointprojection_free, jl = n.rawpointprojection_point, El = n.rawpointprojection_isInside, Pl = n.__wbg_rawpointcolliderprojection_free, Fl = n.rawpointcolliderprojection_colliderHandle, zl = n.rawpointcolliderprojection_point, Tl = n.rawpointcolliderprojection_isInside, Ml = n.rawpointcolliderprojection_featureType, kl = n.rawpointcolliderprojection_featureId, Hl = n.__wbg_rawrayintersection_free, Dl = n.__wbg_rawraycolliderhit_free, Ll = n.__wbg_rawshape_free, Nl = n.rawshape_cuboid, Gl = n.rawshape_roundCuboid, Wl = n.rawshape_ball, ql = n.rawshape_halfspace, Bl = n.rawshape_capsule, Vl = n.rawshape_cylinder, Ol = n.rawshape_roundCylinder, Ul = n.rawshape_cone, Xl = n.rawshape_roundCone, Jl = n.rawshape_voxels, Kl = n.rawshape_voxelsFromPoints, Yl = n.rawshape_polyline, Zl = n.rawshape_trimesh, $l = n.rawshape_heightfield, Ql = n.rawshape_segment, tw = n.rawshape_triangle, ew = n.rawshape_roundTriangle, rw = n.rawshape_convexHull, iw = n.rawshape_roundConvexHull, nw = n.rawshape_convexMesh, aw = n.rawshape_roundConvexMesh, sw = n.rawshape_castShape, ow = n.rawshape_intersectsShape, _w = n.rawshape_contactShape, cw = n.rawshape_containsPoint, lw = n.rawshape_projectPoint, ww = n.rawshape_intersectsRay, dw = n.rawshape_castRay, hw = n.rawshape_castRayAndGetNormal, pw = n.__wbg_rawshapecasthit_free, uw = n.rawshapecasthit_witness1, gw = n.rawshapecasthit_normal1, bw = n.rawshapecasthit_normal2, mw = n.__wbg_rawcollidershapecasthit_free, fw = n.rawcollidershapecasthit_time_of_impact, yw = n.rawcollidershapecasthit_witness1, Sw = n.rawcollidershapecasthit_witness2, vw = n.rawrotation_new, Rw = n.rawrotation_identity, Cw = n.rawrotation_x, xw = n.rawrotation_w, Iw = n.rawvector_zero, Aw = n.rawvector_new, jw = n.rawvector_set_x, Ew = n.rawvector_set_z, Pw = n.rawvector_xyz, Fw = n.rawvector_yxz, zw = n.rawvector_zxy, Tw = n.rawvector_xzy, Mw = n.rawvector_yzx, kw = n.rawvector_zyx, Hw = n.rawsdpmatrix3_elements, Dw = n.__wbg_rawdebugrenderpipeline_free, Lw = n.rawdebugrenderpipeline_new, Nw = n.rawdebugrenderpipeline_vertices, Gw = n.rawdebugrenderpipeline_colors, Ww = n.rawdebugrenderpipeline_render, qw = n.__wbg_raweventqueue_free, Bw = n.__wbg_rawcontactforceevent_free, Vw = n.rawcontactforceevent_collider2, Ow = n.rawcontactforceevent_total_force, Uw = n.rawcontactforceevent_total_force_magnitude, Xw = n.rawcontactforceevent_max_force_direction, Jw = n.rawcontactforceevent_max_force_magnitude, Kw = n.raweventqueue_new, Yw = n.raweventqueue_drainCollisionEvents, Zw = n.raweventqueue_drainContactForceEvents, $w = n.raweventqueue_clear, Qw = n.__wbg_rawphysicspipeline_free, td = n.rawphysicspipeline_new, ed = n.rawphysicspipeline_step, rd = n.rawphysicspipeline_stepWithEvents, id = n.rawquerypipeline_new, nd = n.rawquerypipeline_update, ad = n.rawquerypipeline_castRay, sd = n.rawquerypipeline_castRayAndGetNormal, od = n.rawquerypipeline_intersectionsWithRay, _d = n.rawquerypipeline_intersectionWithShape, cd = n.rawquerypipeline_projectPoint, ld = n.rawquerypipeline_projectPointAndGetFeature, wd = n.rawquerypipeline_intersectionsWithPoint, dd = n.rawquerypipeline_castShape, hd = n.rawquerypipeline_intersectionsWithShape, pd = n.rawquerypipeline_collidersWithAabbIntersectingAabb, ud = n.__wbg_rawdeserializedworld_free, gd = n.rawdeserializedworld_takeGravity, bd = n.rawdeserializedworld_takeIntegrationParameters, md = n.rawdeserializedworld_takeIslandManager, fd = n.rawdeserializedworld_takeBroadPhase, yd = n.rawdeserializedworld_takeNarrowPhase, Sd = n.rawdeserializedworld_takeBodies, vd = n.rawdeserializedworld_takeColliders, Rd = n.rawdeserializedworld_takeImpulseJoints, Cd = n.rawdeserializedworld_takeMultibodyJoints, xd = n.__wbg_rawserializationpipeline_free, Id = n.rawserializationpipeline_new, Ad = n.rawserializationpipeline_serializeAll, jd = n.rawserializationpipeline_deserializeAll, Ed = n.rawcolliderset_isHandleValid, Pd = n.rawkinematiccharactercontroller_offset, Fd = n.rawintegrationparameters_normalizedAllowedLinearError, zd = n.rawintegrationparameters_numAdditionalFrictionIterations, Td = n.rawintegrationparameters_numInternalPgsIterations, Md = n.rawrigidbodyset_len, kd = n.rawshapecontact_distance, Hd = n.rawrayintersection_featureType, Dd = n.rawraycolliderintersection_colliderHandle, Ld = n.rawrayintersection_time_of_impact, Nd = n.rawraycolliderintersection_featureType, Gd = n.rawraycolliderhit_colliderHandle, Wd = n.rawraycolliderintersection_time_of_impact, qd = n.rawcollidershapecasthit_colliderHandle, Bd = n.rawraycolliderhit_timeOfImpact, Vd = n.rawshapecasthit_time_of_impact, Od = n.rawrotation_y, Ud = n.rawrotation_z, Xd = n.rawvector_x, Jd = n.rawvector_y, Kd = n.rawvector_z, Yd = n.rawcontactforceevent_collider1, Zd = n.rawintegrationparameters_normalizedPredictionDistance, $d = n.reserve_memory, Qd = n.__wbg_rawquerypipeline_free, th = n.rawrayintersection_featureId, eh = n.rawraycolliderintersection_featureId, rh = n.rawkinematiccharactercontroller_up, ih = n.rawshapecontact_normal2, nh = n.rawshapecontact_point1, ah = n.rawshapecontact_point2, sh = n.rawrayintersection_normal, oh = n.rawraycolliderintersection_normal, _h = n.rawshapecontact_normal1, ch = n.rawcollidershapecasthit_normal1, lh = n.rawcollidershapecasthit_normal2, wh = n.rawshapecasthit_witness2, dh = n.rawintegrationparameters_set_numAdditionalFrictionIterations, hh = n.rawintegrationparameters_set_numInternalPgsIterations, ph = n.rawvector_set_y, uh = n.__wbg_rawraycolliderintersection_free, gh = n.__wbg_rawcontactpair_free, bh = n.__wbg_rawsdpmatrix3_free, mh = n.__wbg_rawvector_free, fh = n.__wbg_rawrotation_free, yh = n.__wbindgen_export_0, Sh = n.__wbindgen_add_to_stack_pointer, vh = n.__wbindgen_export_1, Rh = n.__wbindgen_export_2, Ch = Object.freeze(Object.defineProperty({
    __proto__: null,
    __wbg_rawbroadphase_free: S_,
    __wbg_rawccdsolver_free: Pa,
    __wbg_rawcharactercollision_free: dn,
    __wbg_rawcolliderset_free: qc,
    __wbg_rawcollidershapecasthit_free: mw,
    __wbg_rawcontactforceevent_free: Bw,
    __wbg_rawcontactmanifold_free: rl,
    __wbg_rawcontactpair_free: gh,
    __wbg_rawdebugrenderpipeline_free: Dw,
    __wbg_rawdeserializedworld_free: ud,
    __wbg_rawdynamicraycastvehiclecontroller_free: Tn,
    __wbg_raweventqueue_free: qw,
    __wbg_rawgenericjoint_free: As,
    __wbg_rawimpulsejointset_free: Za,
    __wbg_rawintegrationparameters_free: as,
    __wbg_rawislandmanager_free: Cs,
    __wbg_rawkinematiccharactercontroller_free: Li,
    __wbg_rawmultibodyjointset_free: Os,
    __wbg_rawnarrowphase_free: Yc,
    __wbg_rawphysicspipeline_free: Qw,
    __wbg_rawpidcontroller_free: vn,
    __wbg_rawpointcolliderprojection_free: Pl,
    __wbg_rawpointprojection_free: Al,
    __wbg_rawquerypipeline_free: Qd,
    __wbg_rawraycolliderhit_free: Dl,
    __wbg_rawraycolliderintersection_free: uh,
    __wbg_rawrayintersection_free: Hl,
    __wbg_rawrigidbodyset_free: p_,
    __wbg_rawrotation_free: fh,
    __wbg_rawsdpmatrix3_free: bh,
    __wbg_rawserializationpipeline_free: xd,
    __wbg_rawshape_free: Ll,
    __wbg_rawshapecasthit_free: pw,
    __wbg_rawshapecontact_free: Kc,
    __wbg_rawvector_free: mh,
    __wbindgen_add_to_stack_pointer: Sh,
    __wbindgen_export_0: yh,
    __wbindgen_export_1: vh,
    __wbindgen_export_2: Rh,
    memory: Hi,
    rawbroadphase_new: v_,
    rawccdsolver_new: Fa,
    rawcharactercollision_handle: pn,
    rawcharactercollision_new: hn,
    rawcharactercollision_toi: bn,
    rawcharactercollision_translationDeltaApplied: un,
    rawcharactercollision_translationDeltaRemaining: gn,
    rawcharactercollision_worldNormal1: yn,
    rawcharactercollision_worldNormal2: Sn,
    rawcharactercollision_worldWitness1: mn,
    rawcharactercollision_worldWitness2: fn,
    rawcolliderset_coActiveCollisionTypes: dc,
    rawcolliderset_coActiveEvents: hc,
    rawcolliderset_coActiveHooks: wc,
    rawcolliderset_coCastCollider: bc,
    rawcolliderset_coCastRay: Rc,
    rawcolliderset_coCastRayAndGetNormal: Cc,
    rawcolliderset_coCastShape: gc,
    rawcolliderset_coCollisionGroups: cc,
    rawcolliderset_coCombineVoxelStates: V_,
    rawcolliderset_coContactCollider: yc,
    rawcolliderset_coContactForceEventThreshold: pc,
    rawcolliderset_coContactShape: fc,
    rawcolliderset_coContactSkin: ic,
    rawcolliderset_coContainsPoint: uc,
    rawcolliderset_coDensity: sc,
    rawcolliderset_coFriction: nc,
    rawcolliderset_coFrictionCombineRule: jc,
    rawcolliderset_coHalfExtents: z_,
    rawcolliderset_coHalfHeight: H_,
    rawcolliderset_coHalfspaceNormal: F_,
    rawcolliderset_coHeightFieldFlags: J_,
    rawcolliderset_coHeightfieldHeights: K_,
    rawcolliderset_coHeightfieldNCols: $_,
    rawcolliderset_coHeightfieldNRows: Z_,
    rawcolliderset_coHeightfieldScale: Y_,
    rawcolliderset_coIndices: U_,
    rawcolliderset_coIntersectsRay: vc,
    rawcolliderset_coIntersectsShape: mc,
    rawcolliderset_coIsEnabled: ec,
    rawcolliderset_coIsSensor: E_,
    rawcolliderset_coMass: oc,
    rawcolliderset_coParent: Q_,
    rawcolliderset_coProjectPoint: Sc,
    rawcolliderset_coPropagateVoxelChange: B_,
    rawcolliderset_coRadius: M_,
    rawcolliderset_coRestitution: ac,
    rawcolliderset_coRestitutionCombineRule: Pc,
    rawcolliderset_coRotation: C_,
    rawcolliderset_coRoundRadius: L_,
    rawcolliderset_coSetActiveCollisionTypes: Hc,
    rawcolliderset_coSetActiveEvents: kc,
    rawcolliderset_coSetActiveHooks: Mc,
    rawcolliderset_coSetCollisionGroups: zc,
    rawcolliderset_coSetContactForceEventThreshold: Lc,
    rawcolliderset_coSetContactSkin: rc,
    rawcolliderset_coSetDensity: Nc,
    rawcolliderset_coSetEnabled: tc,
    rawcolliderset_coSetFriction: Ac,
    rawcolliderset_coSetFrictionCombineRule: Ec,
    rawcolliderset_coSetHalfExtents: T_,
    rawcolliderset_coSetHalfHeight: D_,
    rawcolliderset_coSetMass: Gc,
    rawcolliderset_coSetMassProperties: Wc,
    rawcolliderset_coSetRadius: k_,
    rawcolliderset_coSetRestitution: Ic,
    rawcolliderset_coSetRestitutionCombineRule: Fc,
    rawcolliderset_coSetRotation: A_,
    rawcolliderset_coSetRotationWrtParent: j_,
    rawcolliderset_coSetRoundRadius: N_,
    rawcolliderset_coSetSensor: xc,
    rawcolliderset_coSetShape: Dc,
    rawcolliderset_coSetSolverGroups: Tc,
    rawcolliderset_coSetTranslation: x_,
    rawcolliderset_coSetTranslationWrtParent: I_,
    rawcolliderset_coSetVoxel: q_,
    rawcolliderset_coShapeType: P_,
    rawcolliderset_coSolverGroups: lc,
    rawcolliderset_coTranslation: R_,
    rawcolliderset_coTriMeshFlags: X_,
    rawcolliderset_coVertices: O_,
    rawcolliderset_coVolume: _c,
    rawcolliderset_coVoxelData: G_,
    rawcolliderset_coVoxelSize: W_,
    rawcolliderset_contains: Oc,
    rawcolliderset_createCollider: Uc,
    rawcolliderset_forEachColliderHandle: Jc,
    rawcolliderset_isHandleValid: Ed,
    rawcolliderset_len: Vc,
    rawcolliderset_new: Bc,
    rawcolliderset_remove: Xc,
    rawcollidershapecasthit_colliderHandle: qd,
    rawcollidershapecasthit_normal1: ch,
    rawcollidershapecasthit_normal2: lh,
    rawcollidershapecasthit_time_of_impact: fw,
    rawcollidershapecasthit_witness1: yw,
    rawcollidershapecasthit_witness2: Sw,
    rawcontactforceevent_collider1: Yd,
    rawcontactforceevent_collider2: Vw,
    rawcontactforceevent_max_force_direction: Xw,
    rawcontactforceevent_max_force_magnitude: Jw,
    rawcontactforceevent_total_force: Ow,
    rawcontactforceevent_total_force_magnitude: Uw,
    rawcontactmanifold_contact_dist: ul,
    rawcontactmanifold_contact_fid1: gl,
    rawcontactmanifold_contact_fid2: bl,
    rawcontactmanifold_contact_impulse: ml,
    rawcontactmanifold_contact_local_p1: hl,
    rawcontactmanifold_contact_local_p2: pl,
    rawcontactmanifold_contact_tangent_impulse_x: fl,
    rawcontactmanifold_contact_tangent_impulse_y: yl,
    rawcontactmanifold_local_n1: _l,
    rawcontactmanifold_local_n2: cl,
    rawcontactmanifold_normal: ol,
    rawcontactmanifold_num_contacts: dl,
    rawcontactmanifold_num_solver_contacts: Sl,
    rawcontactmanifold_solver_contact_dist: Rl,
    rawcontactmanifold_solver_contact_friction: Cl,
    rawcontactmanifold_solver_contact_point: vl,
    rawcontactmanifold_solver_contact_restitution: xl,
    rawcontactmanifold_solver_contact_tangent_velocity: Il,
    rawcontactmanifold_subshape1: ll,
    rawcontactmanifold_subshape2: wl,
    rawcontactpair_collider1: il,
    rawcontactpair_collider2: nl,
    rawcontactpair_contactManifold: sl,
    rawcontactpair_numContactManifolds: al,
    rawdebugrenderpipeline_colors: Gw,
    rawdebugrenderpipeline_new: Lw,
    rawdebugrenderpipeline_render: Ww,
    rawdebugrenderpipeline_vertices: Nw,
    rawdeserializedworld_takeBodies: Sd,
    rawdeserializedworld_takeBroadPhase: fd,
    rawdeserializedworld_takeColliders: vd,
    rawdeserializedworld_takeGravity: gd,
    rawdeserializedworld_takeImpulseJoints: Rd,
    rawdeserializedworld_takeIntegrationParameters: bd,
    rawdeserializedworld_takeIslandManager: md,
    rawdeserializedworld_takeMultibodyJoints: Cd,
    rawdeserializedworld_takeNarrowPhase: yd,
    rawdynamicraycastvehiclecontroller_add_wheel: Wn,
    rawdynamicraycastvehiclecontroller_chassis: Hn,
    rawdynamicraycastvehiclecontroller_current_vehicle_speed: kn,
    rawdynamicraycastvehiclecontroller_index_forward_axis: Nn,
    rawdynamicraycastvehiclecontroller_index_up_axis: Dn,
    rawdynamicraycastvehiclecontroller_new: Mn,
    rawdynamicraycastvehiclecontroller_num_wheels: qn,
    rawdynamicraycastvehiclecontroller_set_index_forward_axis: Gn,
    rawdynamicraycastvehiclecontroller_set_index_up_axis: Ln,
    rawdynamicraycastvehiclecontroller_set_wheel_axle_cs: ua,
    rawdynamicraycastvehiclecontroller_set_wheel_brake: oa,
    rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs: On,
    rawdynamicraycastvehiclecontroller_set_wheel_direction_cs: ha,
    rawdynamicraycastvehiclecontroller_set_wheel_engine_force: wa,
    rawdynamicraycastvehiclecontroller_set_wheel_friction_slip: ba,
    rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force: aa,
    rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel: Kn,
    rawdynamicraycastvehiclecontroller_set_wheel_radius: Zn,
    rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness: fa,
    rawdynamicraycastvehiclecontroller_set_wheel_steering: ca,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression: ea,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation: ia,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length: Xn,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness: Qn,
    rawdynamicraycastvehiclecontroller_update_vehicle: Bn,
    rawdynamicraycastvehiclecontroller_wheel_axle_cs: pa,
    rawdynamicraycastvehiclecontroller_wheel_brake: sa,
    rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs: Vn,
    rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws: Ca,
    rawdynamicraycastvehiclecontroller_wheel_contact_point_ws: xa,
    rawdynamicraycastvehiclecontroller_wheel_direction_cs: da,
    rawdynamicraycastvehiclecontroller_wheel_engine_force: la,
    rawdynamicraycastvehiclecontroller_wheel_forward_impulse: Sa,
    rawdynamicraycastvehiclecontroller_wheel_friction_slip: ga,
    rawdynamicraycastvehiclecontroller_wheel_ground_object: Ea,
    rawdynamicraycastvehiclecontroller_wheel_hard_point_ws: Aa,
    rawdynamicraycastvehiclecontroller_wheel_is_in_contact: ja,
    rawdynamicraycastvehiclecontroller_wheel_max_suspension_force: na,
    rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel: Jn,
    rawdynamicraycastvehiclecontroller_wheel_radius: Yn,
    rawdynamicraycastvehiclecontroller_wheel_rotation: ya,
    rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness: ma,
    rawdynamicraycastvehiclecontroller_wheel_side_impulse: va,
    rawdynamicraycastvehiclecontroller_wheel_steering: _a,
    rawdynamicraycastvehiclecontroller_wheel_suspension_compression: ta,
    rawdynamicraycastvehiclecontroller_wheel_suspension_force: Ra,
    rawdynamicraycastvehiclecontroller_wheel_suspension_length: Ia,
    rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation: ra,
    rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length: Un,
    rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness: $n,
    raweventqueue_clear: $w,
    raweventqueue_drainCollisionEvents: Yw,
    raweventqueue_drainContactForceEvents: Zw,
    raweventqueue_new: Kw,
    rawgenericjoint_fixed: Ts,
    rawgenericjoint_generic: js,
    rawgenericjoint_prismatic: zs,
    rawgenericjoint_revolute: Ms,
    rawgenericjoint_rope: Ps,
    rawgenericjoint_spherical: Fs,
    rawgenericjoint_spring: Es,
    rawimpulsejointset_contains: rs,
    rawimpulsejointset_createJoint: Qa,
    rawimpulsejointset_forEachJointAttachedToRigidBody: ns,
    rawimpulsejointset_forEachJointHandle: is,
    rawimpulsejointset_jointAnchor1: Da,
    rawimpulsejointset_jointAnchor2: La,
    rawimpulsejointset_jointBodyHandle1: Ta,
    rawimpulsejointset_jointBodyHandle2: Ma,
    rawimpulsejointset_jointConfigureMotor: Ya,
    rawimpulsejointset_jointConfigureMotorModel: Xa,
    rawimpulsejointset_jointConfigureMotorPosition: Ka,
    rawimpulsejointset_jointConfigureMotorVelocity: Ja,
    rawimpulsejointset_jointContactsEnabled: Wa,
    rawimpulsejointset_jointFrameX1: ka,
    rawimpulsejointset_jointFrameX2: Ha,
    rawimpulsejointset_jointLimitsEnabled: Ba,
    rawimpulsejointset_jointLimitsMax: Oa,
    rawimpulsejointset_jointLimitsMin: Va,
    rawimpulsejointset_jointSetAnchor1: Na,
    rawimpulsejointset_jointSetAnchor2: Ga,
    rawimpulsejointset_jointSetContactsEnabled: qa,
    rawimpulsejointset_jointSetLimits: Ua,
    rawimpulsejointset_jointType: za,
    rawimpulsejointset_len: es,
    rawimpulsejointset_new: $a,
    rawimpulsejointset_remove: ts,
    rawintegrationparameters_contact_erp: _s,
    rawintegrationparameters_dt: os,
    rawintegrationparameters_lengthUnit: ds,
    rawintegrationparameters_maxCcdSubsteps: ws,
    rawintegrationparameters_minIslandSize: ls,
    rawintegrationparameters_new: ss,
    rawintegrationparameters_normalizedAllowedLinearError: Fd,
    rawintegrationparameters_normalizedPredictionDistance: Zd,
    rawintegrationparameters_numAdditionalFrictionIterations: zd,
    rawintegrationparameters_numInternalPgsIterations: Td,
    rawintegrationparameters_numSolverIterations: cs,
    rawintegrationparameters_set_contact_natural_frequency: ps,
    rawintegrationparameters_set_dt: hs,
    rawintegrationparameters_set_lengthUnit: ys,
    rawintegrationparameters_set_maxCcdSubsteps: fs,
    rawintegrationparameters_set_minIslandSize: ms,
    rawintegrationparameters_set_normalizedAllowedLinearError: us,
    rawintegrationparameters_set_normalizedPredictionDistance: gs,
    rawintegrationparameters_set_numAdditionalFrictionIterations: dh,
    rawintegrationparameters_set_numInternalPgsIterations: hh,
    rawintegrationparameters_set_numSolverIterations: bs,
    rawintegrationparameters_switchToSmallStepsPgsSolver: vs,
    rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart: Rs,
    rawintegrationparameters_switchToStandardPgsSolver: Ss,
    rawislandmanager_forEachActiveRigidBodyHandle: Is,
    rawislandmanager_new: xs,
    rawkinematiccharactercontroller_autostepEnabled: Ki,
    rawkinematiccharactercontroller_autostepIncludesDynamicBodies: Ji,
    rawkinematiccharactercontroller_autostepMaxHeight: Ui,
    rawkinematiccharactercontroller_autostepMinWidth: Xi,
    rawkinematiccharactercontroller_computeColliderMovement: on,
    rawkinematiccharactercontroller_computedCollision: wn,
    rawkinematiccharactercontroller_computedGrounded: cn,
    rawkinematiccharactercontroller_computedMovement: _n,
    rawkinematiccharactercontroller_disableAutostep: Zi,
    rawkinematiccharactercontroller_disableSnapToGround: an,
    rawkinematiccharactercontroller_enableAutostep: Yi,
    rawkinematiccharactercontroller_enableSnapToGround: nn,
    rawkinematiccharactercontroller_maxSlopeClimbAngle: $i,
    rawkinematiccharactercontroller_minSlopeSlideAngle: tn,
    rawkinematiccharactercontroller_new: Ni,
    rawkinematiccharactercontroller_normalNudgeFactor: Wi,
    rawkinematiccharactercontroller_numComputedCollisions: ln,
    rawkinematiccharactercontroller_offset: Pd,
    rawkinematiccharactercontroller_setMaxSlopeClimbAngle: Qi,
    rawkinematiccharactercontroller_setMinSlopeSlideAngle: en,
    rawkinematiccharactercontroller_setNormalNudgeFactor: qi,
    rawkinematiccharactercontroller_setOffset: Bi,
    rawkinematiccharactercontroller_setSlideEnabled: Oi,
    rawkinematiccharactercontroller_setUp: Gi,
    rawkinematiccharactercontroller_slideEnabled: Vi,
    rawkinematiccharactercontroller_snapToGroundDistance: rn,
    rawkinematiccharactercontroller_snapToGroundEnabled: sn,
    rawkinematiccharactercontroller_up: rh,
    rawmultibodyjointset_contains: Ks,
    rawmultibodyjointset_createJoint: Xs,
    rawmultibodyjointset_forEachJointAttachedToRigidBody: Zs,
    rawmultibodyjointset_forEachJointHandle: Ys,
    rawmultibodyjointset_jointAnchor1: Ls,
    rawmultibodyjointset_jointAnchor2: Ns,
    rawmultibodyjointset_jointContactsEnabled: Gs,
    rawmultibodyjointset_jointFrameX1: Hs,
    rawmultibodyjointset_jointFrameX2: Ds,
    rawmultibodyjointset_jointLimitsEnabled: qs,
    rawmultibodyjointset_jointLimitsMax: Vs,
    rawmultibodyjointset_jointLimitsMin: Bs,
    rawmultibodyjointset_jointSetContactsEnabled: Ws,
    rawmultibodyjointset_jointType: ks,
    rawmultibodyjointset_new: Us,
    rawmultibodyjointset_remove: Js,
    rawnarrowphase_contact_pair: Qc,
    rawnarrowphase_contact_pairs_with: $c,
    rawnarrowphase_intersection_pair: el,
    rawnarrowphase_intersection_pairs_with: tl,
    rawnarrowphase_new: Zc,
    rawphysicspipeline_new: td,
    rawphysicspipeline_step: ed,
    rawphysicspipeline_stepWithEvents: rd,
    rawpidcontroller_angular_correction: zn,
    rawpidcontroller_apply_angular_correction: Pn,
    rawpidcontroller_apply_linear_correction: En,
    rawpidcontroller_linear_correction: Fn,
    rawpidcontroller_new: Rn,
    rawpidcontroller_reset_integrals: jn,
    rawpidcontroller_set_axes_mask: An,
    rawpidcontroller_set_kd: In,
    rawpidcontroller_set_ki: xn,
    rawpidcontroller_set_kp: Cn,
    rawpointcolliderprojection_colliderHandle: Fl,
    rawpointcolliderprojection_featureId: kl,
    rawpointcolliderprojection_featureType: Ml,
    rawpointcolliderprojection_isInside: Tl,
    rawpointcolliderprojection_point: zl,
    rawpointprojection_isInside: El,
    rawpointprojection_point: jl,
    rawquerypipeline_castRay: ad,
    rawquerypipeline_castRayAndGetNormal: sd,
    rawquerypipeline_castShape: dd,
    rawquerypipeline_collidersWithAabbIntersectingAabb: pd,
    rawquerypipeline_intersectionWithShape: _d,
    rawquerypipeline_intersectionsWithPoint: wd,
    rawquerypipeline_intersectionsWithRay: od,
    rawquerypipeline_intersectionsWithShape: hd,
    rawquerypipeline_new: id,
    rawquerypipeline_projectPoint: cd,
    rawquerypipeline_projectPointAndGetFeature: ld,
    rawquerypipeline_update: nd,
    rawraycolliderhit_colliderHandle: Gd,
    rawraycolliderhit_timeOfImpact: Bd,
    rawraycolliderintersection_colliderHandle: Dd,
    rawraycolliderintersection_featureId: eh,
    rawraycolliderintersection_featureType: Nd,
    rawraycolliderintersection_normal: oh,
    rawraycolliderintersection_time_of_impact: Wd,
    rawrayintersection_featureId: th,
    rawrayintersection_featureType: Hd,
    rawrayintersection_normal: sh,
    rawrayintersection_time_of_impact: Ld,
    rawrigidbodyset_contains: m_,
    rawrigidbodyset_createRigidBody: g_,
    rawrigidbodyset_forEachRigidBodyHandle: f_,
    rawrigidbodyset_len: Md,
    rawrigidbodyset_new: u_,
    rawrigidbodyset_propagateModifiedBodyPositionsToColliders: y_,
    rawrigidbodyset_rbAddForce: r_,
    rawrigidbodyset_rbAddForceAtPoint: s_,
    rawrigidbodyset_rbAddTorque: n_,
    rawrigidbodyset_rbAdditionalSolverIterations: __,
    rawrigidbodyset_rbAngularDamping: Xo,
    rawrigidbodyset_rbAngvel: go,
    rawrigidbodyset_rbApplyImpulse: i_,
    rawrigidbodyset_rbApplyImpulseAtPoint: o_,
    rawrigidbodyset_rbApplyTorqueImpulse: a_,
    rawrigidbodyset_rbBodyType: Wo,
    rawrigidbodyset_rbCollider: Go,
    rawrigidbodyset_rbDominanceGroup: vo,
    rawrigidbodyset_rbEffectiveAngularInertia: ko,
    rawrigidbodyset_rbEffectiveInvMass: jo,
    rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt: Mo,
    rawrigidbodyset_rbEnableCcd: Co,
    rawrigidbodyset_rbGravityScale: $o,
    rawrigidbodyset_rbInvMass: Ao,
    rawrigidbodyset_rbInvPrincipalInertiaSqrt: Fo,
    rawrigidbodyset_rbIsCcdEnabled: Do,
    rawrigidbodyset_rbIsDynamic: Oo,
    rawrigidbodyset_rbIsEnabled: Zo,
    rawrigidbodyset_rbIsFixed: Bo,
    rawrigidbodyset_rbIsKinematic: Vo,
    rawrigidbodyset_rbIsMoving: ro,
    rawrigidbodyset_rbIsSleeping: eo,
    rawrigidbodyset_rbLinearDamping: Uo,
    rawrigidbodyset_rbLinvel: uo,
    rawrigidbodyset_rbLocalCom: Eo,
    rawrigidbodyset_rbLockRotations: yo,
    rawrigidbodyset_rbLockTranslations: mo,
    rawrigidbodyset_rbMass: Io,
    rawrigidbodyset_rbNextRotation: no,
    rawrigidbodyset_rbNextTranslation: io,
    rawrigidbodyset_rbNumColliders: No,
    rawrigidbodyset_rbPrincipalInertia: To,
    rawrigidbodyset_rbPrincipalInertiaLocalFrame: zo,
    rawrigidbodyset_rbRecomputeMassPropertiesFromColliders: wo,
    rawrigidbodyset_rbResetForces: t_,
    rawrigidbodyset_rbResetTorques: e_,
    rawrigidbodyset_rbRotation: Qs,
    rawrigidbodyset_rbSetAdditionalMass: ho,
    rawrigidbodyset_rbSetAdditionalMassProperties: po,
    rawrigidbodyset_rbSetAdditionalSolverIterations: c_,
    rawrigidbodyset_rbSetAngularDamping: Ko,
    rawrigidbodyset_rbSetAngvel: _o,
    rawrigidbodyset_rbSetBodyType: qo,
    rawrigidbodyset_rbSetDominanceGroup: Ro,
    rawrigidbodyset_rbSetEnabled: Yo,
    rawrigidbodyset_rbSetEnabledRotations: So,
    rawrigidbodyset_rbSetEnabledTranslations: fo,
    rawrigidbodyset_rbSetGravityScale: Qo,
    rawrigidbodyset_rbSetLinearDamping: Jo,
    rawrigidbodyset_rbSetLinvel: oo,
    rawrigidbodyset_rbSetNextKinematicRotation: lo,
    rawrigidbodyset_rbSetNextKinematicTranslation: co,
    rawrigidbodyset_rbSetRotation: so,
    rawrigidbodyset_rbSetSoftCcdPrediction: xo,
    rawrigidbodyset_rbSetTranslation: ao,
    rawrigidbodyset_rbSetUserData: w_,
    rawrigidbodyset_rbSleep: to,
    rawrigidbodyset_rbSoftCcdPrediction: Lo,
    rawrigidbodyset_rbTranslation: $s,
    rawrigidbodyset_rbUserData: l_,
    rawrigidbodyset_rbUserForce: d_,
    rawrigidbodyset_rbUserTorque: h_,
    rawrigidbodyset_rbVelocityAtPoint: bo,
    rawrigidbodyset_rbWakeUp: Ho,
    rawrigidbodyset_rbWorldCom: Po,
    rawrigidbodyset_remove: b_,
    rawrotation_identity: Rw,
    rawrotation_new: vw,
    rawrotation_w: xw,
    rawrotation_x: Cw,
    rawrotation_y: Od,
    rawrotation_z: Ud,
    rawsdpmatrix3_elements: Hw,
    rawserializationpipeline_deserializeAll: jd,
    rawserializationpipeline_new: Id,
    rawserializationpipeline_serializeAll: Ad,
    rawshape_ball: Wl,
    rawshape_capsule: Bl,
    rawshape_castRay: dw,
    rawshape_castRayAndGetNormal: hw,
    rawshape_castShape: sw,
    rawshape_cone: Ul,
    rawshape_contactShape: _w,
    rawshape_containsPoint: cw,
    rawshape_convexHull: rw,
    rawshape_convexMesh: nw,
    rawshape_cuboid: Nl,
    rawshape_cylinder: Vl,
    rawshape_halfspace: ql,
    rawshape_heightfield: $l,
    rawshape_intersectsRay: ww,
    rawshape_intersectsShape: ow,
    rawshape_polyline: Yl,
    rawshape_projectPoint: lw,
    rawshape_roundCone: Xl,
    rawshape_roundConvexHull: iw,
    rawshape_roundConvexMesh: aw,
    rawshape_roundCuboid: Gl,
    rawshape_roundCylinder: Ol,
    rawshape_roundTriangle: ew,
    rawshape_segment: Ql,
    rawshape_triangle: tw,
    rawshape_trimesh: Zl,
    rawshape_voxels: Jl,
    rawshape_voxelsFromPoints: Kl,
    rawshapecasthit_normal1: gw,
    rawshapecasthit_normal2: bw,
    rawshapecasthit_time_of_impact: Vd,
    rawshapecasthit_witness1: uw,
    rawshapecasthit_witness2: wh,
    rawshapecontact_distance: kd,
    rawshapecontact_normal1: _h,
    rawshapecontact_normal2: ih,
    rawshapecontact_point1: nh,
    rawshapecontact_point2: ah,
    rawvector_new: Aw,
    rawvector_set_x: jw,
    rawvector_set_y: ph,
    rawvector_set_z: Ew,
    rawvector_x: Xd,
    rawvector_xyz: Pw,
    rawvector_xzy: Tw,
    rawvector_y: Jd,
    rawvector_yxz: Fw,
    rawvector_yzx: Mw,
    rawvector_z: Kd,
    rawvector_zero: Iw,
    rawvector_zxy: zw,
    rawvector_zyx: kw,
    reserve_memory: $d,
    version: Di
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Qr(Ch);
  mr = class {
    constructor(t, e, r) {
      this.x = t, this.y = e, this.z = r;
    }
  };
  w = class {
    static new(t, e, r) {
      return new mr(t, e, r);
    }
    static intoRaw(t) {
      return new l(t.x, t.y, t.z);
    }
    static zeros() {
      return w.new(0, 0, 0);
    }
    static fromRaw(t) {
      if (!t) return null;
      let e = w.new(t.x, t.y, t.z);
      return t.free(), e;
    }
    static copy(t, e) {
      t.x = e.x, t.y = e.y, t.z = e.z;
    }
  };
  ie = class {
    constructor(t, e, r, a) {
      this.x = t, this.y = e, this.z = r, this.w = a;
    }
  };
  S = class {
    static identity() {
      return new ie(0, 0, 0, 1);
    }
    static fromRaw(t) {
      if (!t) return null;
      let e = new ie(t.x, t.y, t.z, t.w);
      return t.free(), e;
    }
    static intoRaw(t) {
      return new v(t.x, t.y, t.z, t.w);
    }
    static copy(t, e) {
      t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w;
    }
  };
  fr = class {
    get m11() {
      return this.elements[0];
    }
    get m12() {
      return this.elements[1];
    }
    get m21() {
      return this.m12;
    }
    get m13() {
      return this.elements[2];
    }
    get m31() {
      return this.m13;
    }
    get m22() {
      return this.elements[3];
    }
    get m23() {
      return this.elements[4];
    }
    get m32() {
      return this.m23;
    }
    get m33() {
      return this.elements[5];
    }
    constructor(t) {
      this.elements = t;
    }
  };
  ne = class {
    static fromRaw(t) {
      const e = new fr(t.elements());
      return t.free(), e;
    }
  };
  (function(s) {
    s[s.Dynamic = 0] = "Dynamic", s[s.Fixed = 1] = "Fixed", s[s.KinematicPositionBased = 2] = "KinematicPositionBased", s[s.KinematicVelocityBased = 3] = "KinematicVelocityBased";
  })(B || (B = {}));
  ae = class {
    constructor(t, e, r) {
      this.rawSet = t, this.colliderSet = e, this.handle = r;
    }
    finalizeDeserialization(t) {
      this.colliderSet = t;
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    lockTranslations(t, e) {
      return this.rawSet.rbLockTranslations(this.handle, t, e);
    }
    lockRotations(t, e) {
      return this.rawSet.rbLockRotations(this.handle, t, e);
    }
    setEnabledTranslations(t, e, r, a) {
      return this.rawSet.rbSetEnabledTranslations(this.handle, t, e, r, a);
    }
    restrictTranslations(t, e, r, a) {
      this.setEnabledTranslations(t, e, r, a);
    }
    setEnabledRotations(t, e, r, a) {
      return this.rawSet.rbSetEnabledRotations(this.handle, t, e, r, a);
    }
    restrictRotations(t, e, r, a) {
      this.setEnabledRotations(t, e, r, a);
    }
    dominanceGroup() {
      return this.rawSet.rbDominanceGroup(this.handle);
    }
    setDominanceGroup(t) {
      this.rawSet.rbSetDominanceGroup(this.handle, t);
    }
    additionalSolverIterations() {
      return this.rawSet.rbAdditionalSolverIterations(this.handle);
    }
    setAdditionalSolverIterations(t) {
      this.rawSet.rbSetAdditionalSolverIterations(this.handle, t);
    }
    enableCcd(t) {
      this.rawSet.rbEnableCcd(this.handle, t);
    }
    setSoftCcdPrediction(t) {
      this.rawSet.rbSetSoftCcdPrediction(this.handle, t);
    }
    softCcdPrediction() {
      return this.rawSet.rbSoftCcdPrediction(this.handle);
    }
    translation() {
      let t = this.rawSet.rbTranslation(this.handle);
      return w.fromRaw(t);
    }
    rotation() {
      let t = this.rawSet.rbRotation(this.handle);
      return S.fromRaw(t);
    }
    nextTranslation() {
      let t = this.rawSet.rbNextTranslation(this.handle);
      return w.fromRaw(t);
    }
    nextRotation() {
      let t = this.rawSet.rbNextRotation(this.handle);
      return S.fromRaw(t);
    }
    setTranslation(t, e) {
      this.rawSet.rbSetTranslation(this.handle, t.x, t.y, t.z, e);
    }
    setLinvel(t, e) {
      let r = w.intoRaw(t);
      this.rawSet.rbSetLinvel(this.handle, r, e), r.free();
    }
    gravityScale() {
      return this.rawSet.rbGravityScale(this.handle);
    }
    setGravityScale(t, e) {
      this.rawSet.rbSetGravityScale(this.handle, t, e);
    }
    setRotation(t, e) {
      this.rawSet.rbSetRotation(this.handle, t.x, t.y, t.z, t.w, e);
    }
    setAngvel(t, e) {
      let r = w.intoRaw(t);
      this.rawSet.rbSetAngvel(this.handle, r, e), r.free();
    }
    setNextKinematicTranslation(t) {
      this.rawSet.rbSetNextKinematicTranslation(this.handle, t.x, t.y, t.z);
    }
    setNextKinematicRotation(t) {
      this.rawSet.rbSetNextKinematicRotation(this.handle, t.x, t.y, t.z, t.w);
    }
    linvel() {
      return w.fromRaw(this.rawSet.rbLinvel(this.handle));
    }
    velocityAtPoint(t) {
      const e = w.intoRaw(t);
      let r = w.fromRaw(this.rawSet.rbVelocityAtPoint(this.handle, e));
      return e.free(), r;
    }
    angvel() {
      return w.fromRaw(this.rawSet.rbAngvel(this.handle));
    }
    mass() {
      return this.rawSet.rbMass(this.handle);
    }
    effectiveInvMass() {
      return w.fromRaw(this.rawSet.rbEffectiveInvMass(this.handle));
    }
    invMass() {
      return this.rawSet.rbInvMass(this.handle);
    }
    localCom() {
      return w.fromRaw(this.rawSet.rbLocalCom(this.handle));
    }
    worldCom() {
      return w.fromRaw(this.rawSet.rbWorldCom(this.handle));
    }
    invPrincipalInertiaSqrt() {
      return w.fromRaw(this.rawSet.rbInvPrincipalInertiaSqrt(this.handle));
    }
    principalInertia() {
      return w.fromRaw(this.rawSet.rbPrincipalInertia(this.handle));
    }
    principalInertiaLocalFrame() {
      return S.fromRaw(this.rawSet.rbPrincipalInertiaLocalFrame(this.handle));
    }
    effectiveWorldInvInertiaSqrt() {
      return ne.fromRaw(this.rawSet.rbEffectiveWorldInvInertiaSqrt(this.handle));
    }
    effectiveAngularInertia() {
      return ne.fromRaw(this.rawSet.rbEffectiveAngularInertia(this.handle));
    }
    sleep() {
      this.rawSet.rbSleep(this.handle);
    }
    wakeUp() {
      this.rawSet.rbWakeUp(this.handle);
    }
    isCcdEnabled() {
      return this.rawSet.rbIsCcdEnabled(this.handle);
    }
    numColliders() {
      return this.rawSet.rbNumColliders(this.handle);
    }
    collider(t) {
      return this.colliderSet.get(this.rawSet.rbCollider(this.handle, t));
    }
    setEnabled(t) {
      this.rawSet.rbSetEnabled(this.handle, t);
    }
    isEnabled() {
      return this.rawSet.rbIsEnabled(this.handle);
    }
    bodyType() {
      return this.rawSet.rbBodyType(this.handle);
    }
    setBodyType(t, e) {
      return this.rawSet.rbSetBodyType(this.handle, t, e);
    }
    isSleeping() {
      return this.rawSet.rbIsSleeping(this.handle);
    }
    isMoving() {
      return this.rawSet.rbIsMoving(this.handle);
    }
    isFixed() {
      return this.rawSet.rbIsFixed(this.handle);
    }
    isKinematic() {
      return this.rawSet.rbIsKinematic(this.handle);
    }
    isDynamic() {
      return this.rawSet.rbIsDynamic(this.handle);
    }
    linearDamping() {
      return this.rawSet.rbLinearDamping(this.handle);
    }
    angularDamping() {
      return this.rawSet.rbAngularDamping(this.handle);
    }
    setLinearDamping(t) {
      this.rawSet.rbSetLinearDamping(this.handle, t);
    }
    recomputeMassPropertiesFromColliders() {
      this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
    }
    setAdditionalMass(t, e) {
      this.rawSet.rbSetAdditionalMass(this.handle, t, e);
    }
    setAdditionalMassProperties(t, e, r, a, o) {
      let _ = w.intoRaw(e), d = w.intoRaw(r), h = S.intoRaw(a);
      this.rawSet.rbSetAdditionalMassProperties(this.handle, t, _, d, h, o), _.free(), d.free(), h.free();
    }
    setAngularDamping(t) {
      this.rawSet.rbSetAngularDamping(this.handle, t);
    }
    resetForces(t) {
      this.rawSet.rbResetForces(this.handle, t);
    }
    resetTorques(t) {
      this.rawSet.rbResetTorques(this.handle, t);
    }
    addForce(t, e) {
      const r = w.intoRaw(t);
      this.rawSet.rbAddForce(this.handle, r, e), r.free();
    }
    applyImpulse(t, e) {
      const r = w.intoRaw(t);
      this.rawSet.rbApplyImpulse(this.handle, r, e), r.free();
    }
    addTorque(t, e) {
      const r = w.intoRaw(t);
      this.rawSet.rbAddTorque(this.handle, r, e), r.free();
    }
    applyTorqueImpulse(t, e) {
      const r = w.intoRaw(t);
      this.rawSet.rbApplyTorqueImpulse(this.handle, r, e), r.free();
    }
    addForceAtPoint(t, e, r) {
      const a = w.intoRaw(t), o = w.intoRaw(e);
      this.rawSet.rbAddForceAtPoint(this.handle, a, o, r), a.free(), o.free();
    }
    applyImpulseAtPoint(t, e, r) {
      const a = w.intoRaw(t), o = w.intoRaw(e);
      this.rawSet.rbApplyImpulseAtPoint(this.handle, a, o, r), a.free(), o.free();
    }
    userForce() {
      return w.fromRaw(this.rawSet.rbUserForce(this.handle));
    }
    userTorque() {
      return w.fromRaw(this.rawSet.rbUserTorque(this.handle));
    }
  };
  U = class {
    constructor(t) {
      this.enabled = true, this.status = t, this.translation = w.zeros(), this.rotation = S.identity(), this.gravityScale = 1, this.linvel = w.zeros(), this.mass = 0, this.massOnly = false, this.centerOfMass = w.zeros(), this.translationsEnabledX = true, this.translationsEnabledY = true, this.angvel = w.zeros(), this.principalAngularInertia = w.zeros(), this.angularInertiaLocalFrame = S.identity(), this.translationsEnabledZ = true, this.rotationsEnabledX = true, this.rotationsEnabledY = true, this.rotationsEnabledZ = true, this.linearDamping = 0, this.angularDamping = 0, this.canSleep = true, this.sleeping = false, this.ccdEnabled = false, this.softCcdPrediction = 0, this.dominanceGroup = 0, this.additionalSolverIterations = 0;
    }
    static dynamic() {
      return new U(B.Dynamic);
    }
    static kinematicPositionBased() {
      return new U(B.KinematicPositionBased);
    }
    static kinematicVelocityBased() {
      return new U(B.KinematicVelocityBased);
    }
    static fixed() {
      return new U(B.Fixed);
    }
    static newDynamic() {
      return new U(B.Dynamic);
    }
    static newKinematicPositionBased() {
      return new U(B.KinematicPositionBased);
    }
    static newKinematicVelocityBased() {
      return new U(B.KinematicVelocityBased);
    }
    static newStatic() {
      return new U(B.Fixed);
    }
    setDominanceGroup(t) {
      return this.dominanceGroup = t, this;
    }
    setAdditionalSolverIterations(t) {
      return this.additionalSolverIterations = t, this;
    }
    setEnabled(t) {
      return this.enabled = t, this;
    }
    setTranslation(t, e, r) {
      if (typeof t != "number" || typeof e != "number" || typeof r != "number") throw TypeError("The translation components must be numbers.");
      return this.translation = {
        x: t,
        y: e,
        z: r
      }, this;
    }
    setRotation(t) {
      return S.copy(this.rotation, t), this;
    }
    setGravityScale(t) {
      return this.gravityScale = t, this;
    }
    setAdditionalMass(t) {
      return this.mass = t, this.massOnly = true, this;
    }
    setLinvel(t, e, r) {
      if (typeof t != "number" || typeof e != "number" || typeof r != "number") throw TypeError("The linvel components must be numbers.");
      return this.linvel = {
        x: t,
        y: e,
        z: r
      }, this;
    }
    setAngvel(t) {
      return w.copy(this.angvel, t), this;
    }
    setAdditionalMassProperties(t, e, r, a) {
      return this.mass = t, w.copy(this.centerOfMass, e), w.copy(this.principalAngularInertia, r), S.copy(this.angularInertiaLocalFrame, a), this.massOnly = false, this;
    }
    enabledTranslations(t, e, r) {
      return this.translationsEnabledX = t, this.translationsEnabledY = e, this.translationsEnabledZ = r, this;
    }
    restrictTranslations(t, e, r) {
      return this.enabledTranslations(t, e, r);
    }
    lockTranslations() {
      return this.enabledTranslations(false, false, false);
    }
    enabledRotations(t, e, r) {
      return this.rotationsEnabledX = t, this.rotationsEnabledY = e, this.rotationsEnabledZ = r, this;
    }
    restrictRotations(t, e, r) {
      return this.enabledRotations(t, e, r);
    }
    lockRotations() {
      return this.restrictRotations(false, false, false);
    }
    setLinearDamping(t) {
      return this.linearDamping = t, this;
    }
    setAngularDamping(t) {
      return this.angularDamping = t, this;
    }
    setCanSleep(t) {
      return this.canSleep = t, this;
    }
    setSleeping(t) {
      return this.sleeping = t, this;
    }
    setCcdEnabled(t) {
      return this.ccdEnabled = t, this;
    }
    setSoftCcdPrediction(t) {
      return this.softCcdPrediction = t, this;
    }
    setUserData(t) {
      return this.userData = t, this;
    }
  };
  class Ht {
    constructor() {
      this.fconv = new Float64Array(1), this.uconv = new Uint32Array(this.fconv.buffer), this.data = new Array(), this.size = 0;
    }
    set(t, e) {
      let r = this.index(t);
      for (; this.data.length <= r; ) this.data.push(null);
      this.data[r] == null && (this.size += 1), this.data[r] = e;
    }
    len() {
      return this.size;
    }
    delete(t) {
      let e = this.index(t);
      e < this.data.length && (this.data[e] != null && (this.size -= 1), this.data[e] = null);
    }
    clear() {
      this.data = new Array();
    }
    get(t) {
      let e = this.index(t);
      return e < this.data.length ? this.data[e] : null;
    }
    forEach(t) {
      for (const e of this.data) e != null && t(e);
    }
    getAll() {
      return this.data.filter((t) => t != null);
    }
    index(t) {
      return this.fconv[0] = t, this.uconv[0];
    }
  }
  yr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    constructor(t) {
      this.raw = t || new j(), this.map = new Ht(), t && t.forEachRigidBodyHandle((e) => {
        this.map.set(e, new ae(t, null, e));
      });
    }
    finalizeDeserialization(t) {
      this.map.forEach((e) => e.finalizeDeserialization(t));
    }
    createRigidBody(t, e) {
      let r = w.intoRaw(e.translation), a = S.intoRaw(e.rotation), o = w.intoRaw(e.linvel), _ = w.intoRaw(e.centerOfMass), d = w.intoRaw(e.angvel), h = w.intoRaw(e.principalAngularInertia), p = S.intoRaw(e.angularInertiaLocalFrame), u = this.raw.createRigidBody(e.enabled, r, a, e.gravityScale, e.mass, e.massOnly, _, o, d, h, p, e.translationsEnabledX, e.translationsEnabledY, e.translationsEnabledZ, e.rotationsEnabledX, e.rotationsEnabledY, e.rotationsEnabledZ, e.linearDamping, e.angularDamping, e.status, e.canSleep, e.sleeping, e.softCcdPrediction, e.ccdEnabled, e.dominanceGroup, e.additionalSolverIterations);
      r.free(), a.free(), o.free(), _.free(), d.free(), h.free(), p.free();
      const g = new ae(this.raw, t, u);
      return g.userData = e.userData, this.map.set(u, g), g;
    }
    remove(t, e, r, a, o) {
      for (let _ = 0; _ < this.raw.rbNumColliders(t); _ += 1) r.unmap(this.raw.rbCollider(t, _));
      a.forEachJointHandleAttachedToRigidBody(t, (_) => a.unmap(_)), o.forEachJointHandleAttachedToRigidBody(t, (_) => o.unmap(_)), this.raw.remove(t, e.raw, r.raw, a.raw, o.raw), this.map.delete(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    get(t) {
      return this.map.get(t);
    }
    forEach(t) {
      this.map.forEach(t);
    }
    forEachActiveRigidBody(t, e) {
      t.forEachActiveRigidBodyHandle((r) => {
        e(this.get(r));
      });
    }
    getAll() {
      return this.map.getAll();
    }
  };
  Sr = class {
    constructor(t) {
      this.raw = t || new it();
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    get dt() {
      return this.raw.dt;
    }
    get contact_erp() {
      return this.raw.contact_erp;
    }
    get lengthUnit() {
      return this.raw.lengthUnit;
    }
    get normalizedAllowedLinearError() {
      return this.raw.normalizedAllowedLinearError;
    }
    get normalizedPredictionDistance() {
      return this.raw.normalizedPredictionDistance;
    }
    get numSolverIterations() {
      return this.raw.numSolverIterations;
    }
    get numAdditionalFrictionIterations() {
      return this.raw.numAdditionalFrictionIterations;
    }
    get numInternalPgsIterations() {
      return this.raw.numInternalPgsIterations;
    }
    get minIslandSize() {
      return this.raw.minIslandSize;
    }
    get maxCcdSubsteps() {
      return this.raw.maxCcdSubsteps;
    }
    set dt(t) {
      this.raw.dt = t;
    }
    set contact_natural_frequency(t) {
      this.raw.contact_natural_frequency = t;
    }
    set lengthUnit(t) {
      this.raw.lengthUnit = t;
    }
    set normalizedAllowedLinearError(t) {
      this.raw.normalizedAllowedLinearError = t;
    }
    set normalizedPredictionDistance(t) {
      this.raw.normalizedPredictionDistance = t;
    }
    set numSolverIterations(t) {
      this.raw.numSolverIterations = t;
    }
    set numAdditionalFrictionIterations(t) {
      this.raw.numAdditionalFrictionIterations = t;
    }
    set numInternalPgsIterations(t) {
      this.raw.numInternalPgsIterations = t;
    }
    set minIslandSize(t) {
      this.raw.minIslandSize = t;
    }
    set maxCcdSubsteps(t) {
      this.raw.maxCcdSubsteps = t;
    }
    switchToStandardPgsSolver() {
      this.raw.switchToStandardPgsSolver();
    }
    switchToSmallStepsPgsSolver() {
      this.raw.switchToSmallStepsPgsSolver();
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      this.raw.switchToSmallStepsPgsSolverWithoutWarmstart();
    }
  };
  (function(s) {
    s[s.Revolute = 0] = "Revolute", s[s.Fixed = 1] = "Fixed", s[s.Prismatic = 2] = "Prismatic", s[s.Rope = 3] = "Rope", s[s.Spring = 4] = "Spring", s[s.Spherical = 5] = "Spherical", s[s.Generic = 6] = "Generic";
  })(D || (D = {}));
  (function(s) {
    s[s.AccelerationBased = 0] = "AccelerationBased", s[s.ForceBased = 1] = "ForceBased";
  })(se || (se = {}));
  (function(s) {
    s[s.LinX = 1] = "LinX", s[s.LinY = 2] = "LinY", s[s.LinZ = 4] = "LinZ", s[s.AngX = 8] = "AngX", s[s.AngY = 16] = "AngY", s[s.AngZ = 32] = "AngZ";
  })(oe || (oe = {}));
  O = class {
    constructor(t, e, r) {
      this.rawSet = t, this.bodySet = e, this.handle = r;
    }
    static newTyped(t, e, r) {
      switch (t.jointType(r)) {
        case V.Revolute:
          return new Ir(t, e, r);
        case V.Prismatic:
          return new xr(t, e, r);
        case V.Fixed:
          return new vr(t, e, r);
        case V.Spring:
          return new Cr(t, e, r);
        case V.Rope:
          return new Rr(t, e, r);
        case V.Spherical:
          return new jr(t, e, r);
        case V.Generic:
          return new Ar(t, e, r);
        default:
          return new O(t, e, r);
      }
    }
    finalizeDeserialization(t) {
      this.bodySet = t;
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    body1() {
      return this.bodySet.get(this.rawSet.jointBodyHandle1(this.handle));
    }
    body2() {
      return this.bodySet.get(this.rawSet.jointBodyHandle2(this.handle));
    }
    type() {
      return this.rawSet.jointType(this.handle);
    }
    frameX1() {
      return S.fromRaw(this.rawSet.jointFrameX1(this.handle));
    }
    frameX2() {
      return S.fromRaw(this.rawSet.jointFrameX2(this.handle));
    }
    anchor1() {
      return w.fromRaw(this.rawSet.jointAnchor1(this.handle));
    }
    anchor2() {
      return w.fromRaw(this.rawSet.jointAnchor2(this.handle));
    }
    setAnchor1(t) {
      const e = w.intoRaw(t);
      this.rawSet.jointSetAnchor1(this.handle, e), e.free();
    }
    setAnchor2(t) {
      const e = w.intoRaw(t);
      this.rawSet.jointSetAnchor2(this.handle, e), e.free();
    }
    setContactsEnabled(t) {
      this.rawSet.jointSetContactsEnabled(this.handle, t);
    }
    contactsEnabled() {
      return this.rawSet.jointContactsEnabled(this.handle);
    }
  };
  ve = class extends O {
    limitsEnabled() {
      return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
    }
    limitsMin() {
      return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
    }
    limitsMax() {
      return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
    }
    setLimits(t, e) {
      this.rawSet.jointSetLimits(this.handle, this.rawAxis(), t, e);
    }
    configureMotorModel(t) {
      this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), t);
    }
    configureMotorVelocity(t, e) {
      this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), t, e);
    }
    configureMotorPosition(t, e, r) {
      this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), t, e, r);
    }
    configureMotor(t, e, r, a) {
      this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), t, e, r, a);
    }
  };
  vr = class extends O {
  };
  Rr = class extends O {
  };
  Cr = class extends O {
  };
  xr = class extends ve {
    rawAxis() {
      return Pt.LinX;
    }
  };
  Ir = class extends ve {
    rawAxis() {
      return Pt.AngX;
    }
  };
  Ar = class extends O {
  };
  jr = class extends O {
  };
  X = class {
    constructor() {
    }
    static fixed(t, e, r, a) {
      let o = new X();
      return o.anchor1 = t, o.anchor2 = r, o.frame1 = e, o.frame2 = a, o.jointType = D.Fixed, o;
    }
    static spring(t, e, r, a, o) {
      let _ = new X();
      return _.anchor1 = a, _.anchor2 = o, _.length = t, _.stiffness = e, _.damping = r, _.jointType = D.Spring, _;
    }
    static rope(t, e, r) {
      let a = new X();
      return a.anchor1 = e, a.anchor2 = r, a.length = t, a.jointType = D.Rope, a;
    }
    static generic(t, e, r, a) {
      let o = new X();
      return o.anchor1 = t, o.anchor2 = e, o.axis = r, o.axesMask = a, o.jointType = D.Generic, o;
    }
    static spherical(t, e) {
      let r = new X();
      return r.anchor1 = t, r.anchor2 = e, r.jointType = D.Spherical, r;
    }
    static prismatic(t, e, r) {
      let a = new X();
      return a.anchor1 = t, a.anchor2 = e, a.axis = r, a.jointType = D.Prismatic, a;
    }
    static revolute(t, e, r) {
      let a = new X();
      return a.anchor1 = t, a.anchor2 = e, a.axis = r, a.jointType = D.Revolute, a;
    }
    intoRaw() {
      let t = w.intoRaw(this.anchor1), e = w.intoRaw(this.anchor2), r, a, o = false, _ = 0, d = 0;
      switch (this.jointType) {
        case D.Fixed:
          let h = S.intoRaw(this.frame1), p = S.intoRaw(this.frame2);
          a = H.fixed(t, h, e, p), h.free(), p.free();
          break;
        case D.Spring:
          a = H.spring(this.length, this.stiffness, this.damping, t, e);
          break;
        case D.Rope:
          a = H.rope(this.length, t, e);
          break;
        case D.Prismatic:
          r = w.intoRaw(this.axis), this.limitsEnabled && (o = true, _ = this.limits[0], d = this.limits[1]), a = H.prismatic(t, e, r, o, _, d), r.free();
          break;
        case D.Generic:
          r = w.intoRaw(this.axis);
          let u = this.axesMask;
          a = H.generic(t, e, r, u);
          break;
        case D.Spherical:
          a = H.spherical(t, e);
          break;
        case D.Revolute:
          r = w.intoRaw(this.axis), a = H.revolute(t, e, r), r.free();
          break;
      }
      return t.free(), e.free(), a;
    }
  };
  Er = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    constructor(t) {
      this.raw = t || new J(), this.map = new Ht(), t && t.forEachJointHandle((e) => {
        this.map.set(e, O.newTyped(t, null, e));
      });
    }
    finalizeDeserialization(t) {
      this.map.forEach((e) => e.finalizeDeserialization(t));
    }
    createJoint(t, e, r, a, o) {
      const _ = e.intoRaw(), d = this.raw.createJoint(_, r, a, o);
      _.free();
      let h = O.newTyped(this.raw, t, d);
      return this.map.set(d, h), h;
    }
    remove(t, e) {
      this.raw.remove(t, e), this.unmap(t);
    }
    forEachJointHandleAttachedToRigidBody(t, e) {
      this.raw.forEachJointAttachedToRigidBody(t, e);
    }
    unmap(t) {
      this.map.delete(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    get(t) {
      return this.map.get(t);
    }
    forEach(t) {
      this.map.forEach(t);
    }
    getAll() {
      return this.map.getAll();
    }
  };
  Q = class {
    constructor(t, e) {
      this.rawSet = t, this.handle = e;
    }
    static newTyped(t, e) {
      switch (t.jointType(e)) {
        case V.Revolute:
          return new zr(t, e);
        case V.Prismatic:
          return new Fr(t, e);
        case V.Fixed:
          return new Pr(t, e);
        case V.Spherical:
          return new Tr(t, e);
        default:
          return new Q(t, e);
      }
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    setContactsEnabled(t) {
      this.rawSet.jointSetContactsEnabled(this.handle, t);
    }
    contactsEnabled() {
      return this.rawSet.jointContactsEnabled(this.handle);
    }
  };
  Re = class extends Q {
  };
  Pr = class extends Q {
  };
  Fr = class extends Re {
    rawAxis() {
      return Pt.LinX;
    }
  };
  zr = class extends Re {
    rawAxis() {
      return Pt.AngX;
    }
  };
  Tr = class extends Q {
  };
  Mr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    constructor(t) {
      this.raw = t || new Y(), this.map = new Ht(), t && t.forEachJointHandle((e) => {
        this.map.set(e, Q.newTyped(this.raw, e));
      });
    }
    createJoint(t, e, r, a) {
      const o = t.intoRaw(), _ = this.raw.createJoint(o, e, r, a);
      o.free();
      let d = Q.newTyped(this.raw, _);
      return this.map.set(_, d), d;
    }
    remove(t, e) {
      this.raw.remove(t, e), this.map.delete(t);
    }
    unmap(t) {
      this.map.delete(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    get(t) {
      return this.map.get(t);
    }
    forEach(t) {
      this.map.forEach(t);
    }
    forEachJointHandleAttachedToRigidBody(t, e) {
      this.raw.forEachJointAttachedToRigidBody(t, e);
    }
    getAll() {
      return this.map.getAll();
    }
  };
  (function(s) {
    s[s.Average = 0] = "Average", s[s.Min = 1] = "Min", s[s.Multiply = 2] = "Multiply", s[s.Max = 3] = "Max";
  })(dt || (dt = {}));
  kr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new re();
    }
  };
  Hr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new K();
    }
    forEachActiveRigidBodyHandle(t) {
      this.raw.forEachActiveRigidBodyHandle(t);
    }
  };
  Dr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new rt();
    }
  };
  Lr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new $(), this.tempManifold = new Nr(null);
    }
    contactPairsWith(t, e) {
      this.raw.contact_pairs_with(t, e);
    }
    intersectionPairsWith(t, e) {
      this.raw.intersection_pairs_with(t, e);
    }
    contactPair(t, e, r) {
      const a = this.raw.contact_pair(t, e);
      if (a) {
        const o = a.collider1() != t;
        let _;
        for (_ = 0; _ < a.numContactManifolds(); ++_) this.tempManifold.raw = a.contactManifold(_), this.tempManifold.raw && r(this.tempManifold, o), this.tempManifold.free();
        a.free();
      }
    }
    intersectionPair(t, e) {
      return this.raw.intersection_pair(t, e);
    }
  };
  Nr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t;
    }
    normal() {
      return w.fromRaw(this.raw.normal());
    }
    localNormal1() {
      return w.fromRaw(this.raw.local_n1());
    }
    localNormal2() {
      return w.fromRaw(this.raw.local_n2());
    }
    subshape1() {
      return this.raw.subshape1();
    }
    subshape2() {
      return this.raw.subshape2();
    }
    numContacts() {
      return this.raw.num_contacts();
    }
    localContactPoint1(t) {
      return w.fromRaw(this.raw.contact_local_p1(t));
    }
    localContactPoint2(t) {
      return w.fromRaw(this.raw.contact_local_p2(t));
    }
    contactDist(t) {
      return this.raw.contact_dist(t);
    }
    contactFid1(t) {
      return this.raw.contact_fid1(t);
    }
    contactFid2(t) {
      return this.raw.contact_fid2(t);
    }
    contactImpulse(t) {
      return this.raw.contact_impulse(t);
    }
    contactTangentImpulseX(t) {
      return this.raw.contact_tangent_impulse_x(t);
    }
    contactTangentImpulseY(t) {
      return this.raw.contact_tangent_impulse_y(t);
    }
    numSolverContacts() {
      return this.raw.num_solver_contacts();
    }
    solverContactPoint(t) {
      return w.fromRaw(this.raw.solver_contact_point(t));
    }
    solverContactDist(t) {
      return this.raw.solver_contact_dist(t);
    }
    solverContactFriction(t) {
      return this.raw.solver_contact_friction(t);
    }
    solverContactRestitution(t) {
      return this.raw.solver_contact_restitution(t);
    }
    solverContactTangentVelocity(t) {
      return w.fromRaw(this.raw.solver_contact_tangent_velocity(t));
    }
  };
  at = class {
    constructor(t, e, r, a, o) {
      this.distance = t, this.point1 = e, this.point2 = r, this.normal1 = a, this.normal2 = o;
    }
    static fromRaw(t) {
      if (!t) return null;
      const e = new at(t.distance(), w.fromRaw(t.point1()), w.fromRaw(t.point2()), w.fromRaw(t.normal1()), w.fromRaw(t.normal2()));
      return t.free(), e;
    }
  };
  (function(s) {
    s[s.Vertex = 0] = "Vertex", s[s.Edge = 1] = "Edge", s[s.Face = 2] = "Face", s[s.Unknown = 3] = "Unknown";
  })(st || (st = {}));
  ut = class {
    constructor(t, e) {
      this.point = t, this.isInside = e;
    }
    static fromRaw(t) {
      if (!t) return null;
      const e = new ut(w.fromRaw(t.point()), t.isInside());
      return t.free(), e;
    }
  };
  ht = class {
    constructor(t, e, r, a, o) {
      this.featureType = st.Unknown, this.featureId = void 0, this.collider = t, this.point = e, this.isInside = r, o !== void 0 && (this.featureId = o), a !== void 0 && (this.featureType = a);
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new ht(t.get(e.colliderHandle()), w.fromRaw(e.point()), e.isInside(), e.featureType(), e.featureId());
      return e.free(), r;
    }
  };
  xh = class {
    constructor(t, e) {
      this.origin = t, this.dir = e;
    }
    pointAt(t) {
      return {
        x: this.origin.x + this.dir.x * t,
        y: this.origin.y + this.dir.y * t,
        z: this.origin.z + this.dir.z * t
      };
    }
  };
  gt = class {
    constructor(t, e, r, a) {
      this.featureType = st.Unknown, this.featureId = void 0, this.timeOfImpact = t, this.normal = e, a !== void 0 && (this.featureId = a), r !== void 0 && (this.featureType = r);
    }
    static fromRaw(t) {
      if (!t) return null;
      const e = new gt(t.time_of_impact(), w.fromRaw(t.normal()), t.featureType(), t.featureId());
      return t.free(), e;
    }
  };
  pt = class {
    constructor(t, e, r, a, o) {
      this.featureType = st.Unknown, this.featureId = void 0, this.collider = t, this.timeOfImpact = e, this.normal = r, o !== void 0 && (this.featureId = o), a !== void 0 && (this.featureType = a);
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new pt(t.get(e.colliderHandle()), e.time_of_impact(), w.fromRaw(e.normal()), e.featureType(), e.featureId());
      return e.free(), r;
    }
  };
  Dt = class {
    constructor(t, e) {
      this.collider = t, this.timeOfImpact = e;
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new Dt(t.get(e.colliderHandle()), e.timeOfImpact());
      return e.free(), r;
    }
  };
  ot = class {
    constructor(t, e, r, a, o) {
      this.time_of_impact = t, this.witness1 = e, this.witness2 = r, this.normal1 = a, this.normal2 = o;
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new ot(e.time_of_impact(), w.fromRaw(e.witness1()), w.fromRaw(e.witness2()), w.fromRaw(e.normal1()), w.fromRaw(e.normal2()));
      return e.free(), r;
    }
  };
  bt = class extends ot {
    constructor(t, e, r, a, o, _) {
      super(e, r, a, o, _), this.collider = t;
    }
    static fromRaw(t, e) {
      if (!e) return null;
      const r = new bt(t.get(e.colliderHandle()), e.time_of_impact(), w.fromRaw(e.witness1()), w.fromRaw(e.witness2()), w.fromRaw(e.normal1()), w.fromRaw(e.normal2()));
      return e.free(), r;
    }
  };
  M = class {
    static fromRaw(t, e) {
      const r = t.coShapeType(e);
      let a, o, _, d, h, p, u;
      switch (r) {
        case k.Ball:
          return new Ce(t.coRadius(e));
        case k.Cuboid:
          return a = t.coHalfExtents(e), new xe(a.x, a.y, a.z);
        case k.RoundCuboid:
          return a = t.coHalfExtents(e), o = t.coRoundRadius(e), new Ie(a.x, a.y, a.z, o);
        case k.Capsule:
          return h = t.coHalfHeight(e), p = t.coRadius(e), new Ae(h, p);
        case k.Segment:
          return _ = t.coVertices(e), new je(w.new(_[0], _[1], _[2]), w.new(_[3], _[4], _[5]));
        case k.Polyline:
          return _ = t.coVertices(e), d = t.coIndices(e), new Fe(_, d);
        case k.Triangle:
          return _ = t.coVertices(e), new Ee(w.new(_[0], _[1], _[2]), w.new(_[3], _[4], _[5]), w.new(_[6], _[7], _[8]));
        case k.RoundTriangle:
          return _ = t.coVertices(e), o = t.coRoundRadius(e), new Pe(w.new(_[0], _[1], _[2]), w.new(_[3], _[4], _[5]), w.new(_[6], _[7], _[8]), o);
        case k.HalfSpace:
          return u = w.fromRaw(t.coHalfspaceNormal(e)), new Gr(u);
        case k.Voxels:
          const g = t.coVoxelData(e), b = t.coVoxelSize(e);
          return new ze(g, b);
        case k.TriMesh:
          _ = t.coVertices(e), d = t.coIndices(e);
          const y = t.coTriMeshFlags(e);
          return new Te(_, d, y);
        case k.HeightField:
          const I = t.coHeightfieldScale(e), L = t.coHeightfieldHeights(e), G = t.coHeightfieldNRows(e), W = t.coHeightfieldNCols(e), q = t.coHeightFieldFlags(e);
          return new Me(G, W, L, I, q);
        case k.ConvexPolyhedron:
          return _ = t.coVertices(e), d = t.coIndices(e), new xt(_, d);
        case k.RoundConvexPolyhedron:
          return _ = t.coVertices(e), d = t.coIndices(e), o = t.coRoundRadius(e), new It(_, d, o);
        case k.Cylinder:
          return h = t.coHalfHeight(e), p = t.coRadius(e), new ke(h, p);
        case k.RoundCylinder:
          return h = t.coHalfHeight(e), p = t.coRadius(e), o = t.coRoundRadius(e), new He(h, p, o);
        case k.Cone:
          return h = t.coHalfHeight(e), p = t.coRadius(e), new De(h, p);
        case k.RoundCone:
          return h = t.coHalfHeight(e), p = t.coRadius(e), o = t.coRoundRadius(e), new Le(h, p, o);
        default:
          throw new Error("unknown shape type: " + r);
      }
    }
    castShape(t, e, r, a, o, _, d, h, p, u) {
      let g = w.intoRaw(t), b = S.intoRaw(e), y = w.intoRaw(r), I = w.intoRaw(o), L = S.intoRaw(_), G = w.intoRaw(d), W = this.intoRaw(), q = a.intoRaw(), tt = ot.fromRaw(null, W.castShape(g, b, y, q, I, L, G, h, p, u));
      return g.free(), b.free(), y.free(), I.free(), L.free(), G.free(), W.free(), q.free(), tt;
    }
    intersectsShape(t, e, r, a, o) {
      let _ = w.intoRaw(t), d = S.intoRaw(e), h = w.intoRaw(a), p = S.intoRaw(o), u = this.intoRaw(), g = r.intoRaw(), b = u.intersectsShape(_, d, g, h, p);
      return _.free(), d.free(), h.free(), p.free(), u.free(), g.free(), b;
    }
    contactShape(t, e, r, a, o, _) {
      let d = w.intoRaw(t), h = S.intoRaw(e), p = w.intoRaw(a), u = S.intoRaw(o), g = this.intoRaw(), b = r.intoRaw(), y = at.fromRaw(g.contactShape(d, h, b, p, u, _));
      return d.free(), h.free(), p.free(), u.free(), g.free(), b.free(), y;
    }
    containsPoint(t, e, r) {
      let a = w.intoRaw(t), o = S.intoRaw(e), _ = w.intoRaw(r), d = this.intoRaw(), h = d.containsPoint(a, o, _);
      return a.free(), o.free(), _.free(), d.free(), h;
    }
    projectPoint(t, e, r, a) {
      let o = w.intoRaw(t), _ = S.intoRaw(e), d = w.intoRaw(r), h = this.intoRaw(), p = ut.fromRaw(h.projectPoint(o, _, d, a));
      return o.free(), _.free(), d.free(), h.free(), p;
    }
    intersectsRay(t, e, r, a) {
      let o = w.intoRaw(e), _ = S.intoRaw(r), d = w.intoRaw(t.origin), h = w.intoRaw(t.dir), p = this.intoRaw(), u = p.intersectsRay(o, _, d, h, a);
      return o.free(), _.free(), d.free(), h.free(), p.free(), u;
    }
    castRay(t, e, r, a, o) {
      let _ = w.intoRaw(e), d = S.intoRaw(r), h = w.intoRaw(t.origin), p = w.intoRaw(t.dir), u = this.intoRaw(), g = u.castRay(_, d, h, p, a, o);
      return _.free(), d.free(), h.free(), p.free(), u.free(), g;
    }
    castRayAndGetNormal(t, e, r, a, o) {
      let _ = w.intoRaw(e), d = S.intoRaw(r), h = w.intoRaw(t.origin), p = w.intoRaw(t.dir), u = this.intoRaw(), g = gt.fromRaw(u.castRayAndGetNormal(_, d, h, p, a, o));
      return _.free(), d.free(), h.free(), p.free(), u.free(), g;
    }
  };
  (function(s) {
    s[s.Ball = 0] = "Ball", s[s.Cuboid = 1] = "Cuboid", s[s.Capsule = 2] = "Capsule", s[s.Segment = 3] = "Segment", s[s.Polyline = 4] = "Polyline", s[s.Triangle = 5] = "Triangle", s[s.TriMesh = 6] = "TriMesh", s[s.HeightField = 7] = "HeightField", s[s.ConvexPolyhedron = 9] = "ConvexPolyhedron", s[s.Cylinder = 10] = "Cylinder", s[s.Cone = 11] = "Cone", s[s.RoundCuboid = 12] = "RoundCuboid", s[s.RoundTriangle = 13] = "RoundTriangle", s[s.RoundCylinder = 14] = "RoundCylinder", s[s.RoundCone = 15] = "RoundCone", s[s.RoundConvexPolyhedron = 16] = "RoundConvexPolyhedron", s[s.HalfSpace = 17] = "HalfSpace", s[s.Voxels = 18] = "Voxels";
  })(F || (F = {}));
  (function(s) {
    s[s.FIX_INTERNAL_EDGES = 1] = "FIX_INTERNAL_EDGES";
  })(_e || (_e = {}));
  (function(s) {
    s[s.DELETE_BAD_TOPOLOGY_TRIANGLES = 4] = "DELETE_BAD_TOPOLOGY_TRIANGLES", s[s.ORIENTED = 8] = "ORIENTED", s[s.MERGE_DUPLICATE_VERTICES = 16] = "MERGE_DUPLICATE_VERTICES", s[s.DELETE_DEGENERATE_TRIANGLES = 32] = "DELETE_DEGENERATE_TRIANGLES", s[s.DELETE_DUPLICATE_TRIANGLES = 64] = "DELETE_DUPLICATE_TRIANGLES", s[s.FIX_INTERNAL_EDGES = 144] = "FIX_INTERNAL_EDGES";
  })(ce || (ce = {}));
  Ce = class extends M {
    constructor(t) {
      super(), this.type = F.Ball, this.radius = t;
    }
    intoRaw() {
      return m.ball(this.radius);
    }
  };
  Gr = class extends M {
    constructor(t) {
      super(), this.type = F.HalfSpace, this.normal = t;
    }
    intoRaw() {
      let t = w.intoRaw(this.normal), e = m.halfspace(t);
      return t.free(), e;
    }
  };
  xe = class extends M {
    constructor(t, e, r) {
      super(), this.type = F.Cuboid, this.halfExtents = w.new(t, e, r);
    }
    intoRaw() {
      return m.cuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z);
    }
  };
  Ie = class extends M {
    constructor(t, e, r, a) {
      super(), this.type = F.RoundCuboid, this.halfExtents = w.new(t, e, r), this.borderRadius = a;
    }
    intoRaw() {
      return m.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z, this.borderRadius);
    }
  };
  Ae = class extends M {
    constructor(t, e) {
      super(), this.type = F.Capsule, this.halfHeight = t, this.radius = e;
    }
    intoRaw() {
      return m.capsule(this.halfHeight, this.radius);
    }
  };
  je = class extends M {
    constructor(t, e) {
      super(), this.type = F.Segment, this.a = t, this.b = e;
    }
    intoRaw() {
      let t = w.intoRaw(this.a), e = w.intoRaw(this.b), r = m.segment(t, e);
      return t.free(), e.free(), r;
    }
  };
  Ee = class extends M {
    constructor(t, e, r) {
      super(), this.type = F.Triangle, this.a = t, this.b = e, this.c = r;
    }
    intoRaw() {
      let t = w.intoRaw(this.a), e = w.intoRaw(this.b), r = w.intoRaw(this.c), a = m.triangle(t, e, r);
      return t.free(), e.free(), r.free(), a;
    }
  };
  Pe = class extends M {
    constructor(t, e, r, a) {
      super(), this.type = F.RoundTriangle, this.a = t, this.b = e, this.c = r, this.borderRadius = a;
    }
    intoRaw() {
      let t = w.intoRaw(this.a), e = w.intoRaw(this.b), r = w.intoRaw(this.c), a = m.roundTriangle(t, e, r, this.borderRadius);
      return t.free(), e.free(), r.free(), a;
    }
  };
  Fe = class extends M {
    constructor(t, e) {
      super(), this.type = F.Polyline, this.vertices = t, this.indices = e ?? new Uint32Array(0);
    }
    intoRaw() {
      return m.polyline(this.vertices, this.indices);
    }
  };
  ze = class extends M {
    constructor(t, e) {
      super(), this.type = F.Voxels, this.data = t, this.voxelSize = e;
    }
    intoRaw() {
      let t = w.intoRaw(this.voxelSize), e;
      return this.data instanceof Int32Array ? e = m.voxels(t, this.data) : e = m.voxelsFromPoints(t, this.data), t.free(), e;
    }
  };
  Te = class extends M {
    constructor(t, e, r) {
      super(), this.type = F.TriMesh, this.vertices = t, this.indices = e, this.flags = r;
    }
    intoRaw() {
      return m.trimesh(this.vertices, this.indices, this.flags);
    }
  };
  xt = class extends M {
    constructor(t, e) {
      super(), this.type = F.ConvexPolyhedron, this.vertices = t, this.indices = e;
    }
    intoRaw() {
      return this.indices ? m.convexMesh(this.vertices, this.indices) : m.convexHull(this.vertices);
    }
  };
  It = class extends M {
    constructor(t, e, r) {
      super(), this.type = F.RoundConvexPolyhedron, this.vertices = t, this.indices = e, this.borderRadius = r;
    }
    intoRaw() {
      return this.indices ? m.roundConvexMesh(this.vertices, this.indices, this.borderRadius) : m.roundConvexHull(this.vertices, this.borderRadius);
    }
  };
  Me = class extends M {
    constructor(t, e, r, a, o) {
      super(), this.type = F.HeightField, this.nrows = t, this.ncols = e, this.heights = r, this.scale = a, this.flags = o;
    }
    intoRaw() {
      let t = w.intoRaw(this.scale), e = m.heightfield(this.nrows, this.ncols, this.heights, t, this.flags);
      return t.free(), e;
    }
  };
  ke = class extends M {
    constructor(t, e) {
      super(), this.type = F.Cylinder, this.halfHeight = t, this.radius = e;
    }
    intoRaw() {
      return m.cylinder(this.halfHeight, this.radius);
    }
  };
  He = class extends M {
    constructor(t, e, r) {
      super(), this.type = F.RoundCylinder, this.borderRadius = r, this.halfHeight = t, this.radius = e;
    }
    intoRaw() {
      return m.roundCylinder(this.halfHeight, this.radius, this.borderRadius);
    }
  };
  De = class extends M {
    constructor(t, e) {
      super(), this.type = F.Cone, this.halfHeight = t, this.radius = e;
    }
    intoRaw() {
      return m.cone(this.halfHeight, this.radius);
    }
  };
  Le = class extends M {
    constructor(t, e, r) {
      super(), this.type = F.RoundCone, this.halfHeight = t, this.radius = e, this.borderRadius = r;
    }
    intoRaw() {
      return m.roundCone(this.halfHeight, this.radius, this.borderRadius);
    }
  };
  Wr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new wi();
    }
    step(t, e, r, a, o, _, d, h, p, u, g, b) {
      let y = w.intoRaw(t);
      g ? this.raw.stepWithEvents(y, e.raw, r.raw, a.raw, o.raw, _.raw, d.raw, h.raw, p.raw, u.raw, g.raw, b, b ? b.filterContactPair : null, b ? b.filterIntersectionPair : null) : this.raw.step(y, e.raw, r.raw, a.raw, o.raw, _.raw, d.raw, h.raw, p.raw, u.raw), y.free();
    }
  };
  (function(s) {
    s[s.EXCLUDE_FIXED = 1] = "EXCLUDE_FIXED", s[s.EXCLUDE_KINEMATIC = 2] = "EXCLUDE_KINEMATIC", s[s.EXCLUDE_DYNAMIC = 4] = "EXCLUDE_DYNAMIC", s[s.EXCLUDE_SENSORS = 8] = "EXCLUDE_SENSORS", s[s.EXCLUDE_SOLIDS = 16] = "EXCLUDE_SOLIDS", s[s.ONLY_DYNAMIC = 3] = "ONLY_DYNAMIC", s[s.ONLY_KINEMATIC = 5] = "ONLY_KINEMATIC", s[s.ONLY_FIXED = 6] = "ONLY_FIXED";
  })(le || (le = {}));
  qr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new ye();
    }
    update(t) {
      this.raw.update(t.raw);
    }
    castRay(t, e, r, a, o, _, d, h, p, u) {
      let g = w.intoRaw(r.origin), b = w.intoRaw(r.dir), y = Dt.fromRaw(e, this.raw.castRay(t.raw, e.raw, g, b, a, o, _, d, h, p, u));
      return g.free(), b.free(), y;
    }
    castRayAndGetNormal(t, e, r, a, o, _, d, h, p, u) {
      let g = w.intoRaw(r.origin), b = w.intoRaw(r.dir), y = pt.fromRaw(e, this.raw.castRayAndGetNormal(t.raw, e.raw, g, b, a, o, _, d, h, p, u));
      return g.free(), b.free(), y;
    }
    intersectionsWithRay(t, e, r, a, o, _, d, h, p, u, g) {
      let b = w.intoRaw(r.origin), y = w.intoRaw(r.dir), I = (L) => _(pt.fromRaw(e, L));
      this.raw.intersectionsWithRay(t.raw, e.raw, b, y, a, o, I, d, h, p, u, g), b.free(), y.free();
    }
    intersectionWithShape(t, e, r, a, o, _, d, h, p, u) {
      let g = w.intoRaw(r), b = S.intoRaw(a), y = o.intoRaw(), I = this.raw.intersectionWithShape(t.raw, e.raw, g, b, y, _, d, h, p, u);
      return g.free(), b.free(), y.free(), I;
    }
    projectPoint(t, e, r, a, o, _, d, h, p) {
      let u = w.intoRaw(r), g = ht.fromRaw(e, this.raw.projectPoint(t.raw, e.raw, u, a, o, _, d, h, p));
      return u.free(), g;
    }
    projectPointAndGetFeature(t, e, r, a, o, _, d, h) {
      let p = w.intoRaw(r), u = ht.fromRaw(e, this.raw.projectPointAndGetFeature(t.raw, e.raw, p, a, o, _, d, h));
      return p.free(), u;
    }
    intersectionsWithPoint(t, e, r, a, o, _, d, h, p) {
      let u = w.intoRaw(r);
      this.raw.intersectionsWithPoint(t.raw, e.raw, u, a, o, _, d, h, p), u.free();
    }
    castShape(t, e, r, a, o, _, d, h, p, u, g, b, y, I) {
      let L = w.intoRaw(r), G = S.intoRaw(a), W = w.intoRaw(o), q = _.intoRaw(), tt = bt.fromRaw(e, this.raw.castShape(t.raw, e.raw, L, G, W, q, d, h, p, u, g, b, y, I));
      return L.free(), G.free(), W.free(), q.free(), tt;
    }
    intersectionsWithShape(t, e, r, a, o, _, d, h, p, u, g) {
      let b = w.intoRaw(r), y = S.intoRaw(a), I = o.intoRaw();
      this.raw.intersectionsWithShape(t.raw, e.raw, b, y, I, _, d, h, p, u, g), b.free(), y.free(), I.free();
    }
    collidersWithAabbIntersectingAabb(t, e, r) {
      let a = w.intoRaw(t), o = w.intoRaw(e);
      this.raw.collidersWithAabbIntersectingAabb(a, o, r), a.free(), o.free();
    }
  };
  we = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    constructor(t) {
      this.raw = t || new hi();
    }
    serializeAll(t, e, r, a, o, _, d, h, p) {
      let u = w.intoRaw(t);
      const g = this.raw.serializeAll(u, e.raw, r.raw, a.raw, o.raw, _.raw, d.raw, h.raw, p.raw);
      return u.free(), g;
    }
    deserializeAll(t) {
      return Lt.fromRaw(this.raw.deserializeAll(t));
    }
  };
  Br = class {
    constructor(t, e) {
      this.vertices = t, this.colors = e;
    }
  };
  Vr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.vertices = void 0, this.colors = void 0;
    }
    constructor(t) {
      this.raw = t || new _i();
    }
    render(t, e, r, a, o, _, d) {
      this.raw.render(t.raw, e.raw, r.raw, a.raw, o.raw, _, e.castClosure(d)), this.vertices = this.raw.vertices(), this.colors = this.raw.colors();
    }
  };
  Or = class {
  };
  Ur = class {
    constructor(t, e, r, a, o) {
      this.params = e, this.bodies = r, this.colliders = a, this.queries = o, this.raw = new li(t), this.rawCharacterCollision = new gr(), this._applyImpulsesToDynamicBodies = false, this._characterMass = null;
    }
    free() {
      this.raw && (this.raw.free(), this.rawCharacterCollision.free()), this.raw = void 0, this.rawCharacterCollision = void 0;
    }
    up() {
      return this.raw.up();
    }
    setUp(t) {
      let e = w.intoRaw(t);
      return this.raw.setUp(e);
    }
    applyImpulsesToDynamicBodies() {
      return this._applyImpulsesToDynamicBodies;
    }
    setApplyImpulsesToDynamicBodies(t) {
      this._applyImpulsesToDynamicBodies = t;
    }
    characterMass() {
      return this._characterMass;
    }
    setCharacterMass(t) {
      this._characterMass = t;
    }
    offset() {
      return this.raw.offset();
    }
    setOffset(t) {
      this.raw.setOffset(t);
    }
    normalNudgeFactor() {
      return this.raw.normalNudgeFactor();
    }
    setNormalNudgeFactor(t) {
      this.raw.setNormalNudgeFactor(t);
    }
    slideEnabled() {
      return this.raw.slideEnabled();
    }
    setSlideEnabled(t) {
      this.raw.setSlideEnabled(t);
    }
    autostepMaxHeight() {
      return this.raw.autostepMaxHeight();
    }
    autostepMinWidth() {
      return this.raw.autostepMinWidth();
    }
    autostepIncludesDynamicBodies() {
      return this.raw.autostepIncludesDynamicBodies();
    }
    autostepEnabled() {
      return this.raw.autostepEnabled();
    }
    enableAutostep(t, e, r) {
      this.raw.enableAutostep(t, e, r);
    }
    disableAutostep() {
      return this.raw.disableAutostep();
    }
    maxSlopeClimbAngle() {
      return this.raw.maxSlopeClimbAngle();
    }
    setMaxSlopeClimbAngle(t) {
      this.raw.setMaxSlopeClimbAngle(t);
    }
    minSlopeSlideAngle() {
      return this.raw.minSlopeSlideAngle();
    }
    setMinSlopeSlideAngle(t) {
      this.raw.setMinSlopeSlideAngle(t);
    }
    snapToGroundDistance() {
      return this.raw.snapToGroundDistance();
    }
    enableSnapToGround(t) {
      this.raw.enableSnapToGround(t);
    }
    disableSnapToGround() {
      this.raw.disableSnapToGround();
    }
    snapToGroundEnabled() {
      return this.raw.snapToGroundEnabled();
    }
    computeColliderMovement(t, e, r, a, o) {
      let _ = w.intoRaw(e);
      this.raw.computeColliderMovement(this.params.dt, this.bodies.raw, this.colliders.raw, this.queries.raw, t.handle, _, this._applyImpulsesToDynamicBodies, this._characterMass, r, a, this.colliders.castClosure(o)), _.free();
    }
    computedMovement() {
      return w.fromRaw(this.raw.computedMovement());
    }
    computedGrounded() {
      return this.raw.computedGrounded();
    }
    numComputedCollisions() {
      return this.raw.numComputedCollisions();
    }
    computedCollision(t, e) {
      if (this.raw.computedCollision(t, this.rawCharacterCollision)) {
        let r = this.rawCharacterCollision;
        return e = e ?? new Or(), e.translationDeltaApplied = w.fromRaw(r.translationDeltaApplied()), e.translationDeltaRemaining = w.fromRaw(r.translationDeltaRemaining()), e.toi = r.toi(), e.witness1 = w.fromRaw(r.worldWitness1()), e.witness2 = w.fromRaw(r.worldWitness2()), e.normal1 = w.fromRaw(r.worldNormal1()), e.normal2 = w.fromRaw(r.worldNormal2()), e.collider = this.colliders.get(r.handle()), e;
      } else return null;
    }
  };
  (function(s) {
    s[s.None = 0] = "None", s[s.LinX = 1] = "LinX", s[s.LinY = 2] = "LinY", s[s.LinZ = 4] = "LinZ", s[s.AngX = 8] = "AngX", s[s.AngY = 16] = "AngY", s[s.AngZ = 32] = "AngZ", s[s.AllLin = 7] = "AllLin", s[s.AllAng = 56] = "AllAng", s[s.All = 63] = "All";
  })(de || (de = {}));
  Xr = class {
    constructor(t, e, r, a, o, _) {
      this.params = t, this.bodies = e, this.raw = new di(r, a, o, _);
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    setKp(t, e) {
      this.raw.set_kp(t, e);
    }
    setKi(t, e) {
      this.raw.set_kp(t, e);
    }
    setKd(t, e) {
      this.raw.set_kp(t, e);
    }
    setAxes(t) {
      this.raw.set_axes_mask(t);
    }
    resetIntegrals() {
      this.raw.reset_integrals();
    }
    applyLinearCorrection(t, e, r) {
      let a = w.intoRaw(e), o = w.intoRaw(r);
      this.raw.apply_linear_correction(this.params.dt, this.bodies.raw, t.handle, a, o), a.free(), o.free();
    }
    applyAngularCorrection(t, e, r) {
      let a = S.intoRaw(e), o = w.intoRaw(r);
      this.raw.apply_angular_correction(this.params.dt, this.bodies.raw, t.handle, a, o), a.free(), o.free();
    }
    linearCorrection(t, e, r) {
      let a = w.intoRaw(e), o = w.intoRaw(r), _ = this.raw.linear_correction(this.params.dt, this.bodies.raw, t.handle, a, o);
      return a.free(), o.free(), w.fromRaw(_);
    }
    angularCorrection(t, e, r) {
      let a = S.intoRaw(e), o = w.intoRaw(r), _ = this.raw.angular_correction(this.params.dt, this.bodies.raw, t.handle, a, o);
      return a.free(), o.free(), w.fromRaw(_);
    }
  };
  Jr = class {
    constructor(t, e, r, a) {
      this.raw = new ci(t.handle), this.bodies = e, this.colliders = r, this.queries = a, this._chassis = t;
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    updateVehicle(t, e, r, a) {
      this.raw.update_vehicle(t, this.bodies.raw, this.colliders.raw, this.queries.raw, e, r, this.colliders.castClosure(a));
    }
    currentVehicleSpeed() {
      return this.raw.current_vehicle_speed();
    }
    chassis() {
      return this._chassis;
    }
    get indexUpAxis() {
      return this.raw.index_up_axis();
    }
    set indexUpAxis(t) {
      this.raw.set_index_up_axis(t);
    }
    get indexForwardAxis() {
      return this.raw.index_forward_axis();
    }
    set setIndexForwardAxis(t) {
      this.raw.set_index_forward_axis(t);
    }
    addWheel(t, e, r, a, o) {
      let _ = w.intoRaw(t), d = w.intoRaw(e), h = w.intoRaw(r);
      this.raw.add_wheel(_, d, h, a, o), _.free(), d.free(), h.free();
    }
    numWheels() {
      return this.raw.num_wheels();
    }
    wheelChassisConnectionPointCs(t) {
      return w.fromRaw(this.raw.wheel_chassis_connection_point_cs(t));
    }
    setWheelChassisConnectionPointCs(t, e) {
      let r = w.intoRaw(e);
      this.raw.set_wheel_chassis_connection_point_cs(t, r), r.free();
    }
    wheelSuspensionRestLength(t) {
      return this.raw.wheel_suspension_rest_length(t);
    }
    setWheelSuspensionRestLength(t, e) {
      this.raw.set_wheel_suspension_rest_length(t, e);
    }
    wheelMaxSuspensionTravel(t) {
      return this.raw.wheel_max_suspension_travel(t);
    }
    setWheelMaxSuspensionTravel(t, e) {
      this.raw.set_wheel_max_suspension_travel(t, e);
    }
    wheelRadius(t) {
      return this.raw.wheel_radius(t);
    }
    setWheelRadius(t, e) {
      this.raw.set_wheel_radius(t, e);
    }
    wheelSuspensionStiffness(t) {
      return this.raw.wheel_suspension_stiffness(t);
    }
    setWheelSuspensionStiffness(t, e) {
      this.raw.set_wheel_suspension_stiffness(t, e);
    }
    wheelSuspensionCompression(t) {
      return this.raw.wheel_suspension_compression(t);
    }
    setWheelSuspensionCompression(t, e) {
      this.raw.set_wheel_suspension_compression(t, e);
    }
    wheelSuspensionRelaxation(t) {
      return this.raw.wheel_suspension_relaxation(t);
    }
    setWheelSuspensionRelaxation(t, e) {
      this.raw.set_wheel_suspension_relaxation(t, e);
    }
    wheelMaxSuspensionForce(t) {
      return this.raw.wheel_max_suspension_force(t);
    }
    setWheelMaxSuspensionForce(t, e) {
      this.raw.set_wheel_max_suspension_force(t, e);
    }
    wheelBrake(t) {
      return this.raw.wheel_brake(t);
    }
    setWheelBrake(t, e) {
      this.raw.set_wheel_brake(t, e);
    }
    wheelSteering(t) {
      return this.raw.wheel_steering(t);
    }
    setWheelSteering(t, e) {
      this.raw.set_wheel_steering(t, e);
    }
    wheelEngineForce(t) {
      return this.raw.wheel_engine_force(t);
    }
    setWheelEngineForce(t, e) {
      this.raw.set_wheel_engine_force(t, e);
    }
    wheelDirectionCs(t) {
      return w.fromRaw(this.raw.wheel_direction_cs(t));
    }
    setWheelDirectionCs(t, e) {
      let r = w.intoRaw(e);
      this.raw.set_wheel_direction_cs(t, r), r.free();
    }
    wheelAxleCs(t) {
      return w.fromRaw(this.raw.wheel_axle_cs(t));
    }
    setWheelAxleCs(t, e) {
      let r = w.intoRaw(e);
      this.raw.set_wheel_axle_cs(t, r), r.free();
    }
    wheelFrictionSlip(t) {
      return this.raw.wheel_friction_slip(t);
    }
    setWheelFrictionSlip(t, e) {
      this.raw.set_wheel_friction_slip(t, e);
    }
    wheelSideFrictionStiffness(t) {
      return this.raw.wheel_side_friction_stiffness(t);
    }
    setWheelSideFrictionStiffness(t, e) {
      this.raw.set_wheel_side_friction_stiffness(t, e);
    }
    wheelRotation(t) {
      return this.raw.wheel_rotation(t);
    }
    wheelForwardImpulse(t) {
      return this.raw.wheel_forward_impulse(t);
    }
    wheelSideImpulse(t) {
      return this.raw.wheel_side_impulse(t);
    }
    wheelSuspensionForce(t) {
      return this.raw.wheel_suspension_force(t);
    }
    wheelContactNormal(t) {
      return w.fromRaw(this.raw.wheel_contact_normal_ws(t));
    }
    wheelContactPoint(t) {
      return w.fromRaw(this.raw.wheel_contact_point_ws(t));
    }
    wheelSuspensionLength(t) {
      return this.raw.wheel_suspension_length(t);
    }
    wheelHardPoint(t) {
      return w.fromRaw(this.raw.wheel_hard_point_ws(t));
    }
    wheelIsInContact(t) {
      return this.raw.wheel_is_in_contact(t);
    }
    wheelGroundObject(t) {
      return this.colliders.get(this.raw.wheel_ground_object(t));
    }
  };
  Lt = class {
    free() {
      this.integrationParameters.free(), this.islands.free(), this.broadPhase.free(), this.narrowPhase.free(), this.bodies.free(), this.colliders.free(), this.impulseJoints.free(), this.multibodyJoints.free(), this.ccdSolver.free(), this.queryPipeline.free(), this.physicsPipeline.free(), this.serializationPipeline.free(), this.debugRenderPipeline.free(), this.characterControllers.forEach((t) => t.free()), this.pidControllers.forEach((t) => t.free()), this.vehicleControllers.forEach((t) => t.free()), this.integrationParameters = void 0, this.islands = void 0, this.broadPhase = void 0, this.narrowPhase = void 0, this.bodies = void 0, this.colliders = void 0, this.ccdSolver = void 0, this.impulseJoints = void 0, this.multibodyJoints = void 0, this.queryPipeline = void 0, this.physicsPipeline = void 0, this.serializationPipeline = void 0, this.debugRenderPipeline = void 0, this.characterControllers = void 0, this.pidControllers = void 0, this.vehicleControllers = void 0;
    }
    constructor(t, e, r, a, o, _, d, h, p, u, g, b, y, I) {
      this.gravity = t, this.integrationParameters = new Sr(e), this.islands = new Hr(r), this.broadPhase = new Dr(a), this.narrowPhase = new Lr(o), this.bodies = new yr(_), this.colliders = new Yr(d), this.impulseJoints = new Er(h), this.multibodyJoints = new Mr(p), this.ccdSolver = new kr(u), this.queryPipeline = new qr(g), this.physicsPipeline = new Wr(b), this.serializationPipeline = new we(y), this.debugRenderPipeline = new Vr(I), this.characterControllers = /* @__PURE__ */ new Set(), this.pidControllers = /* @__PURE__ */ new Set(), this.vehicleControllers = /* @__PURE__ */ new Set(), this.impulseJoints.finalizeDeserialization(this.bodies), this.bodies.finalizeDeserialization(this.colliders), this.colliders.finalizeDeserialization(this.bodies);
    }
    static fromRaw(t) {
      return t ? new Lt(w.fromRaw(t.takeGravity()), t.takeIntegrationParameters(), t.takeIslandManager(), t.takeBroadPhase(), t.takeNarrowPhase(), t.takeBodies(), t.takeColliders(), t.takeImpulseJoints(), t.takeMultibodyJoints()) : null;
    }
    takeSnapshot() {
      return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
    }
    static restoreSnapshot(t) {
      return new we().deserializeAll(t);
    }
    debugRender(t, e) {
      return this.debugRenderPipeline.render(this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.narrowPhase, t, e), new Br(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
    }
    step(t, e) {
      this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.ccdSolver, t, e), this.queryPipeline.update(this.colliders);
    }
    propagateModifiedBodyPositionsToColliders() {
      this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
    }
    updateSceneQueries() {
      this.propagateModifiedBodyPositionsToColliders(), this.queryPipeline.update(this.colliders);
    }
    get timestep() {
      return this.integrationParameters.dt;
    }
    set timestep(t) {
      this.integrationParameters.dt = t;
    }
    get lengthUnit() {
      return this.integrationParameters.lengthUnit;
    }
    set lengthUnit(t) {
      this.integrationParameters.lengthUnit = t;
    }
    get numSolverIterations() {
      return this.integrationParameters.numSolverIterations;
    }
    set numSolverIterations(t) {
      this.integrationParameters.numSolverIterations = t;
    }
    get numAdditionalFrictionIterations() {
      return this.integrationParameters.numAdditionalFrictionIterations;
    }
    set numAdditionalFrictionIterations(t) {
      this.integrationParameters.numAdditionalFrictionIterations = t;
    }
    get numInternalPgsIterations() {
      return this.integrationParameters.numInternalPgsIterations;
    }
    set numInternalPgsIterations(t) {
      this.integrationParameters.numInternalPgsIterations = t;
    }
    switchToStandardPgsSolver() {
      this.integrationParameters.switchToStandardPgsSolver();
    }
    switchToSmallStepsPgsSolver() {
      this.integrationParameters.switchToSmallStepsPgsSolver();
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      this.integrationParameters.switchToSmallStepsPgsSolverWithoutWarmstart();
    }
    createRigidBody(t) {
      return this.bodies.createRigidBody(this.colliders, t);
    }
    createCharacterController(t) {
      let e = new Ur(t, this.integrationParameters, this.bodies, this.colliders, this.queryPipeline);
      return this.characterControllers.add(e), e;
    }
    removeCharacterController(t) {
      this.characterControllers.delete(t), t.free();
    }
    createPidController(t, e, r, a) {
      let o = new Xr(this.integrationParameters, this.bodies, t, e, r, a);
      return this.pidControllers.add(o), o;
    }
    removePidController(t) {
      this.pidControllers.delete(t), t.free();
    }
    createVehicleController(t) {
      let e = new Jr(t, this.bodies, this.colliders, this.queryPipeline);
      return this.vehicleControllers.add(e), e;
    }
    removeVehicleController(t) {
      this.vehicleControllers.delete(t), t.free();
    }
    createCollider(t, e) {
      let r = e ? e.handle : void 0;
      return this.colliders.createCollider(this.bodies, t, r);
    }
    createImpulseJoint(t, e, r, a) {
      return this.impulseJoints.createJoint(this.bodies, t, e.handle, r.handle, a);
    }
    createMultibodyJoint(t, e, r, a) {
      return this.multibodyJoints.createJoint(t, e.handle, r.handle, a);
    }
    getRigidBody(t) {
      return this.bodies.get(t);
    }
    getCollider(t) {
      return this.colliders.get(t);
    }
    getImpulseJoint(t) {
      return this.impulseJoints.get(t);
    }
    getMultibodyJoint(t) {
      return this.multibodyJoints.get(t);
    }
    removeRigidBody(t) {
      this.bodies && this.bodies.remove(t.handle, this.islands, this.colliders, this.impulseJoints, this.multibodyJoints);
    }
    removeCollider(t, e) {
      this.colliders && this.colliders.remove(t.handle, this.islands, this.bodies, e);
    }
    removeImpulseJoint(t, e) {
      this.impulseJoints && this.impulseJoints.remove(t.handle, e);
    }
    removeMultibodyJoint(t, e) {
      this.impulseJoints && this.multibodyJoints.remove(t.handle, e);
    }
    forEachCollider(t) {
      this.colliders.forEach(t);
    }
    forEachRigidBody(t) {
      this.bodies.forEach(t);
    }
    forEachActiveRigidBody(t) {
      this.bodies.forEachActiveRigidBody(this.islands, t);
    }
    castRay(t, e, r, a, o, _, d, h) {
      return this.queryPipeline.castRay(this.bodies, this.colliders, t, e, r, a, o, _ ? _.handle : null, d ? d.handle : null, this.colliders.castClosure(h));
    }
    castRayAndGetNormal(t, e, r, a, o, _, d, h) {
      return this.queryPipeline.castRayAndGetNormal(this.bodies, this.colliders, t, e, r, a, o, _ ? _.handle : null, d ? d.handle : null, this.colliders.castClosure(h));
    }
    intersectionsWithRay(t, e, r, a, o, _, d, h, p) {
      this.queryPipeline.intersectionsWithRay(this.bodies, this.colliders, t, e, r, a, o, _, d ? d.handle : null, h ? h.handle : null, this.colliders.castClosure(p));
    }
    intersectionWithShape(t, e, r, a, o, _, d, h) {
      let p = this.queryPipeline.intersectionWithShape(this.bodies, this.colliders, t, e, r, a, o, _ ? _.handle : null, d ? d.handle : null, this.colliders.castClosure(h));
      return p != null ? this.colliders.get(p) : null;
    }
    projectPoint(t, e, r, a, o, _, d) {
      return this.queryPipeline.projectPoint(this.bodies, this.colliders, t, e, r, a, o ? o.handle : null, _ ? _.handle : null, this.colliders.castClosure(d));
    }
    projectPointAndGetFeature(t, e, r, a, o, _) {
      return this.queryPipeline.projectPointAndGetFeature(this.bodies, this.colliders, t, e, r, a ? a.handle : null, o ? o.handle : null, this.colliders.castClosure(_));
    }
    intersectionsWithPoint(t, e, r, a, o, _, d) {
      this.queryPipeline.intersectionsWithPoint(this.bodies, this.colliders, t, this.colliders.castClosure(e), r, a, o ? o.handle : null, _ ? _.handle : null, this.colliders.castClosure(d));
    }
    castShape(t, e, r, a, o, _, d, h, p, u, g, b) {
      return this.queryPipeline.castShape(this.bodies, this.colliders, t, e, r, a, o, _, d, h, p, u ? u.handle : null, g ? g.handle : null, this.colliders.castClosure(b));
    }
    intersectionsWithShape(t, e, r, a, o, _, d, h, p) {
      this.queryPipeline.intersectionsWithShape(this.bodies, this.colliders, t, e, r, this.colliders.castClosure(a), o, _, d ? d.handle : null, h ? h.handle : null, this.colliders.castClosure(p));
    }
    collidersWithAabbIntersectingAabb(t, e, r) {
      this.queryPipeline.collidersWithAabbIntersectingAabb(t, e, this.colliders.castClosure(r));
    }
    contactPairsWith(t, e) {
      this.narrowPhase.contactPairsWith(t.handle, this.colliders.castClosure(e));
    }
    intersectionPairsWith(t, e) {
      this.narrowPhase.intersectionPairsWith(t.handle, this.colliders.castClosure(e));
    }
    contactPair(t, e, r) {
      this.narrowPhase.contactPair(t.handle, e.handle, r);
    }
    intersectionPair(t, e) {
      return this.narrowPhase.intersectionPair(t.handle, e.handle);
    }
  };
  (function(s) {
    s[s.NONE = 0] = "NONE", s[s.COLLISION_EVENTS = 1] = "COLLISION_EVENTS", s[s.CONTACT_FORCE_EVENTS = 2] = "CONTACT_FORCE_EVENTS";
  })(At || (At = {}));
  Kr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    collider1() {
      return this.raw.collider1();
    }
    collider2() {
      return this.raw.collider2();
    }
    totalForce() {
      return w.fromRaw(this.raw.total_force());
    }
    totalForceMagnitude() {
      return this.raw.total_force_magnitude();
    }
    maxForceDirection() {
      return w.fromRaw(this.raw.max_force_direction());
    }
    maxForceMagnitude() {
      return this.raw.max_force_magnitude();
    }
  };
  Ih = class {
    constructor(t, e) {
      this.raw = e || new br(t);
    }
    free() {
      this.raw && this.raw.free(), this.raw = void 0;
    }
    drainCollisionEvents(t) {
      this.raw.drainCollisionEvents(t);
    }
    drainContactForceEvents(t) {
      let e = new Kr();
      this.raw.drainContactForceEvents((r) => {
        e.raw = r, t(e), e.free();
      });
    }
    clear() {
      this.raw.clear();
    }
  };
  (function(s) {
    s[s.NONE = 0] = "NONE", s[s.FILTER_CONTACT_PAIRS = 1] = "FILTER_CONTACT_PAIRS", s[s.FILTER_INTERSECTION_PAIRS = 2] = "FILTER_INTERSECTION_PAIRS";
  })(jt || (jt = {}));
  (function(s) {
    s[s.EMPTY = 0] = "EMPTY", s[s.COMPUTE_IMPULSE = 1] = "COMPUTE_IMPULSE";
  })(he || (he = {}));
  (function(s) {
    s[s.DYNAMIC_DYNAMIC = 1] = "DYNAMIC_DYNAMIC", s[s.DYNAMIC_KINEMATIC = 12] = "DYNAMIC_KINEMATIC", s[s.DYNAMIC_FIXED = 2] = "DYNAMIC_FIXED", s[s.KINEMATIC_KINEMATIC = 52224] = "KINEMATIC_KINEMATIC", s[s.KINEMATIC_FIXED = 8704] = "KINEMATIC_FIXED", s[s.FIXED_FIXED = 32] = "FIXED_FIXED", s[s.DEFAULT = 15] = "DEFAULT", s[s.ALL = 60943] = "ALL";
  })(Et || (Et = {}));
  pe = class {
    constructor(t, e, r, a) {
      this.colliderSet = t, this.handle = e, this._parent = r, this._shape = a;
    }
    finalizeDeserialization(t) {
      this.handle != null && (this._parent = t.get(this.colliderSet.raw.coParent(this.handle)));
    }
    ensureShapeIsCached() {
      this._shape || (this._shape = M.fromRaw(this.colliderSet.raw, this.handle));
    }
    get shape() {
      return this.ensureShapeIsCached(), this._shape;
    }
    clearShapeCache() {
      this._shape = null;
    }
    isValid() {
      return this.colliderSet.raw.contains(this.handle);
    }
    translation() {
      return w.fromRaw(this.colliderSet.raw.coTranslation(this.handle));
    }
    rotation() {
      return S.fromRaw(this.colliderSet.raw.coRotation(this.handle));
    }
    isSensor() {
      return this.colliderSet.raw.coIsSensor(this.handle);
    }
    setSensor(t) {
      this.colliderSet.raw.coSetSensor(this.handle, t);
    }
    setShape(t) {
      let e = t.intoRaw();
      this.colliderSet.raw.coSetShape(this.handle, e), e.free(), this._shape = t;
    }
    setEnabled(t) {
      this.colliderSet.raw.coSetEnabled(this.handle, t);
    }
    isEnabled() {
      return this.colliderSet.raw.coIsEnabled(this.handle);
    }
    setRestitution(t) {
      this.colliderSet.raw.coSetRestitution(this.handle, t);
    }
    setFriction(t) {
      this.colliderSet.raw.coSetFriction(this.handle, t);
    }
    frictionCombineRule() {
      return this.colliderSet.raw.coFrictionCombineRule(this.handle);
    }
    setFrictionCombineRule(t) {
      this.colliderSet.raw.coSetFrictionCombineRule(this.handle, t);
    }
    restitutionCombineRule() {
      return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
    }
    setRestitutionCombineRule(t) {
      this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, t);
    }
    setCollisionGroups(t) {
      this.colliderSet.raw.coSetCollisionGroups(this.handle, t);
    }
    setSolverGroups(t) {
      this.colliderSet.raw.coSetSolverGroups(this.handle, t);
    }
    contactSkin() {
      return this.colliderSet.raw.coContactSkin(this.handle);
    }
    setContactSkin(t) {
      return this.colliderSet.raw.coSetContactSkin(this.handle, t);
    }
    activeHooks() {
      return this.colliderSet.raw.coActiveHooks(this.handle);
    }
    setActiveHooks(t) {
      this.colliderSet.raw.coSetActiveHooks(this.handle, t);
    }
    activeEvents() {
      return this.colliderSet.raw.coActiveEvents(this.handle);
    }
    setActiveEvents(t) {
      this.colliderSet.raw.coSetActiveEvents(this.handle, t);
    }
    activeCollisionTypes() {
      return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
    }
    setContactForceEventThreshold(t) {
      return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, t);
    }
    contactForceEventThreshold() {
      return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
    }
    setActiveCollisionTypes(t) {
      this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, t);
    }
    setDensity(t) {
      this.colliderSet.raw.coSetDensity(this.handle, t);
    }
    setMass(t) {
      this.colliderSet.raw.coSetMass(this.handle, t);
    }
    setMassProperties(t, e, r, a) {
      let o = w.intoRaw(e), _ = w.intoRaw(r), d = S.intoRaw(a);
      this.colliderSet.raw.coSetMassProperties(this.handle, t, o, _, d), o.free(), _.free(), d.free();
    }
    setTranslation(t) {
      this.colliderSet.raw.coSetTranslation(this.handle, t.x, t.y, t.z);
    }
    setTranslationWrtParent(t) {
      this.colliderSet.raw.coSetTranslationWrtParent(this.handle, t.x, t.y, t.z);
    }
    setRotation(t) {
      this.colliderSet.raw.coSetRotation(this.handle, t.x, t.y, t.z, t.w);
    }
    setRotationWrtParent(t) {
      this.colliderSet.raw.coSetRotationWrtParent(this.handle, t.x, t.y, t.z, t.w);
    }
    shapeType() {
      return this.colliderSet.raw.coShapeType(this.handle);
    }
    halfExtents() {
      return w.fromRaw(this.colliderSet.raw.coHalfExtents(this.handle));
    }
    setHalfExtents(t) {
      const e = w.intoRaw(t);
      this.colliderSet.raw.coSetHalfExtents(this.handle, e);
    }
    radius() {
      return this.colliderSet.raw.coRadius(this.handle);
    }
    setRadius(t) {
      this.colliderSet.raw.coSetRadius(this.handle, t);
    }
    roundRadius() {
      return this.colliderSet.raw.coRoundRadius(this.handle);
    }
    setRoundRadius(t) {
      this.colliderSet.raw.coSetRoundRadius(this.handle, t);
    }
    halfHeight() {
      return this.colliderSet.raw.coHalfHeight(this.handle);
    }
    setHalfHeight(t) {
      this.colliderSet.raw.coSetHalfHeight(this.handle, t);
    }
    setVoxel(t, e, r, a) {
      this.colliderSet.raw.coSetVoxel(this.handle, t, e, r, a), this._shape = null;
    }
    propagateVoxelChange(t, e, r, a, o, _, d) {
      this.colliderSet.raw.coPropagateVoxelChange(this.handle, t.handle, e, r, a, o, _, d), this._shape = null;
    }
    combineVoxelStates(t, e, r, a) {
      this.colliderSet.raw.coCombineVoxelStates(this.handle, t.handle, e, r, a), this._shape = null;
    }
    vertices() {
      return this.colliderSet.raw.coVertices(this.handle);
    }
    indices() {
      return this.colliderSet.raw.coIndices(this.handle);
    }
    heightfieldHeights() {
      return this.colliderSet.raw.coHeightfieldHeights(this.handle);
    }
    heightfieldScale() {
      let t = this.colliderSet.raw.coHeightfieldScale(this.handle);
      return w.fromRaw(t);
    }
    heightfieldNRows() {
      return this.colliderSet.raw.coHeightfieldNRows(this.handle);
    }
    heightfieldNCols() {
      return this.colliderSet.raw.coHeightfieldNCols(this.handle);
    }
    parent() {
      return this._parent;
    }
    friction() {
      return this.colliderSet.raw.coFriction(this.handle);
    }
    restitution() {
      return this.colliderSet.raw.coRestitution(this.handle);
    }
    density() {
      return this.colliderSet.raw.coDensity(this.handle);
    }
    mass() {
      return this.colliderSet.raw.coMass(this.handle);
    }
    volume() {
      return this.colliderSet.raw.coVolume(this.handle);
    }
    collisionGroups() {
      return this.colliderSet.raw.coCollisionGroups(this.handle);
    }
    solverGroups() {
      return this.colliderSet.raw.coSolverGroups(this.handle);
    }
    containsPoint(t) {
      let e = w.intoRaw(t), r = this.colliderSet.raw.coContainsPoint(this.handle, e);
      return e.free(), r;
    }
    projectPoint(t, e) {
      let r = w.intoRaw(t), a = ut.fromRaw(this.colliderSet.raw.coProjectPoint(this.handle, r, e));
      return r.free(), a;
    }
    intersectsRay(t, e) {
      let r = w.intoRaw(t.origin), a = w.intoRaw(t.dir), o = this.colliderSet.raw.coIntersectsRay(this.handle, r, a, e);
      return r.free(), a.free(), o;
    }
    castShape(t, e, r, a, o, _, d, h) {
      let p = w.intoRaw(t), u = w.intoRaw(r), g = S.intoRaw(a), b = w.intoRaw(o), y = e.intoRaw(), I = ot.fromRaw(this.colliderSet, this.colliderSet.raw.coCastShape(this.handle, p, y, u, g, b, _, d, h));
      return p.free(), u.free(), g.free(), b.free(), y.free(), I;
    }
    castCollider(t, e, r, a, o, _) {
      let d = w.intoRaw(t), h = w.intoRaw(r), p = bt.fromRaw(this.colliderSet, this.colliderSet.raw.coCastCollider(this.handle, d, e.handle, h, a, o, _));
      return d.free(), h.free(), p;
    }
    intersectsShape(t, e, r) {
      let a = w.intoRaw(e), o = S.intoRaw(r), _ = t.intoRaw(), d = this.colliderSet.raw.coIntersectsShape(this.handle, _, a, o);
      return a.free(), o.free(), _.free(), d;
    }
    contactShape(t, e, r, a) {
      let o = w.intoRaw(e), _ = S.intoRaw(r), d = t.intoRaw(), h = at.fromRaw(this.colliderSet.raw.coContactShape(this.handle, d, o, _, a));
      return o.free(), _.free(), d.free(), h;
    }
    contactCollider(t, e) {
      return at.fromRaw(this.colliderSet.raw.coContactCollider(this.handle, t.handle, e));
    }
    castRay(t, e, r) {
      let a = w.intoRaw(t.origin), o = w.intoRaw(t.dir), _ = this.colliderSet.raw.coCastRay(this.handle, a, o, e, r);
      return a.free(), o.free(), _;
    }
    castRayAndGetNormal(t, e, r) {
      let a = w.intoRaw(t.origin), o = w.intoRaw(t.dir), _ = gt.fromRaw(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, a, o, e, r));
      return a.free(), o.free(), _;
    }
  };
  (function(s) {
    s[s.Density = 0] = "Density", s[s.Mass = 1] = "Mass", s[s.MassProps = 2] = "MassProps";
  })(et || (et = {}));
  P = class {
    constructor(t) {
      this.enabled = true, this.shape = t, this.massPropsMode = et.Density, this.density = 1, this.friction = 0.5, this.restitution = 0, this.rotation = S.identity(), this.translation = w.zeros(), this.isSensor = false, this.collisionGroups = 4294967295, this.solverGroups = 4294967295, this.frictionCombineRule = dt.Average, this.restitutionCombineRule = dt.Average, this.activeCollisionTypes = Et.DEFAULT, this.activeEvents = At.NONE, this.activeHooks = jt.NONE, this.mass = 0, this.centerOfMass = w.zeros(), this.contactForceEventThreshold = 0, this.contactSkin = 0, this.principalAngularInertia = w.zeros(), this.angularInertiaLocalFrame = S.identity();
    }
    static ball(t) {
      const e = new Ce(t);
      return new P(e);
    }
    static capsule(t, e) {
      const r = new Ae(t, e);
      return new P(r);
    }
    static segment(t, e) {
      const r = new je(t, e);
      return new P(r);
    }
    static triangle(t, e, r) {
      const a = new Ee(t, e, r);
      return new P(a);
    }
    static roundTriangle(t, e, r, a) {
      const o = new Pe(t, e, r, a);
      return new P(o);
    }
    static polyline(t, e) {
      const r = new Fe(t, e);
      return new P(r);
    }
    static voxels(t, e) {
      const r = new ze(t, e);
      return new P(r);
    }
    static trimesh(t, e, r) {
      const a = new Te(t, e, r);
      return new P(a);
    }
    static cuboid(t, e, r) {
      const a = new xe(t, e, r);
      return new P(a);
    }
    static roundCuboid(t, e, r, a) {
      const o = new Ie(t, e, r, a);
      return new P(o);
    }
    static heightfield(t, e, r, a, o) {
      const _ = new Me(t, e, r, a, o);
      return new P(_);
    }
    static cylinder(t, e) {
      const r = new ke(t, e);
      return new P(r);
    }
    static roundCylinder(t, e, r) {
      const a = new He(t, e, r);
      return new P(a);
    }
    static cone(t, e) {
      const r = new De(t, e);
      return new P(r);
    }
    static roundCone(t, e, r) {
      const a = new Le(t, e, r);
      return new P(a);
    }
    static convexHull(t) {
      const e = new xt(t, null);
      return new P(e);
    }
    static convexMesh(t, e) {
      const r = new xt(t, e);
      return new P(r);
    }
    static roundConvexHull(t, e) {
      const r = new It(t, null, e);
      return new P(r);
    }
    static roundConvexMesh(t, e, r) {
      const a = new It(t, e, r);
      return new P(a);
    }
    setTranslation(t, e, r) {
      if (typeof t != "number" || typeof e != "number" || typeof r != "number") throw TypeError("The translation components must be numbers.");
      return this.translation = {
        x: t,
        y: e,
        z: r
      }, this;
    }
    setRotation(t) {
      return S.copy(this.rotation, t), this;
    }
    setSensor(t) {
      return this.isSensor = t, this;
    }
    setEnabled(t) {
      return this.enabled = t, this;
    }
    setContactSkin(t) {
      return this.contactSkin = t, this;
    }
    setDensity(t) {
      return this.massPropsMode = et.Density, this.density = t, this;
    }
    setMass(t) {
      return this.massPropsMode = et.Mass, this.mass = t, this;
    }
    setMassProperties(t, e, r, a) {
      return this.massPropsMode = et.MassProps, this.mass = t, w.copy(this.centerOfMass, e), w.copy(this.principalAngularInertia, r), S.copy(this.angularInertiaLocalFrame, a), this;
    }
    setRestitution(t) {
      return this.restitution = t, this;
    }
    setFriction(t) {
      return this.friction = t, this;
    }
    setFrictionCombineRule(t) {
      return this.frictionCombineRule = t, this;
    }
    setRestitutionCombineRule(t) {
      return this.restitutionCombineRule = t, this;
    }
    setCollisionGroups(t) {
      return this.collisionGroups = t, this;
    }
    setSolverGroups(t) {
      return this.solverGroups = t, this;
    }
    setActiveHooks(t) {
      return this.activeHooks = t, this;
    }
    setActiveEvents(t) {
      return this.activeEvents = t, this;
    }
    setActiveCollisionTypes(t) {
      return this.activeCollisionTypes = t, this;
    }
    setContactForceEventThreshold(t) {
      return this.contactForceEventThreshold = t, this;
    }
  };
  Yr = class {
    free() {
      this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
    }
    constructor(t) {
      this.raw = t || new E(), this.map = new Ht(), t && t.forEachColliderHandle((e) => {
        this.map.set(e, new pe(this, e, null));
      });
    }
    castClosure(t) {
      return (e) => {
        if (t) return t(this.get(e));
      };
    }
    finalizeDeserialization(t) {
      this.map.forEach((e) => e.finalizeDeserialization(t));
    }
    createCollider(t, e, r) {
      let a = r != null && r != null;
      if (a && isNaN(r)) throw Error("Cannot create a collider with a parent rigid-body handle that is not a number.");
      let o = e.shape.intoRaw(), _ = w.intoRaw(e.translation), d = S.intoRaw(e.rotation), h = w.intoRaw(e.centerOfMass), p = w.intoRaw(e.principalAngularInertia), u = S.intoRaw(e.angularInertiaLocalFrame), g = this.raw.createCollider(e.enabled, o, _, d, e.massPropsMode, e.mass, h, p, u, e.density, e.friction, e.restitution, e.frictionCombineRule, e.restitutionCombineRule, e.isSensor, e.collisionGroups, e.solverGroups, e.activeCollisionTypes, e.activeHooks, e.activeEvents, e.contactForceEventThreshold, e.contactSkin, a, a ? r : 0, t.raw);
      o.free(), _.free(), d.free(), h.free(), p.free(), u.free();
      let b = a ? t.get(r) : null, y = new pe(this, g, b, e.shape);
      return this.map.set(g, y), y;
    }
    remove(t, e, r, a) {
      this.raw.remove(t, e.raw, r.raw, a), this.unmap(t);
    }
    unmap(t) {
      this.map.delete(t);
    }
    get(t) {
      return this.map.get(t);
    }
    len() {
      return this.map.len();
    }
    contains(t) {
      return this.get(t) != null;
    }
    forEach(t) {
      this.map.forEach(t);
    }
    getAll() {
      return this.map.getAll();
    }
  };
  Ah = function() {
    return ii();
  };
  jh = function(s) {
    ni(s);
  };
  Eh = Object.freeze(Object.defineProperty({
    __proto__: null,
    get ActiveCollisionTypes() {
      return Et;
    },
    get ActiveEvents() {
      return At;
    },
    get ActiveHooks() {
      return jt;
    },
    Ball: Ce,
    BroadPhase: Dr,
    CCDSolver: kr,
    Capsule: Ae,
    CharacterCollision: Or,
    get CoefficientCombineRule() {
      return dt;
    },
    Collider: pe,
    ColliderDesc: P,
    ColliderSet: Yr,
    ColliderShapeCastHit: bt,
    Cone: De,
    ConvexPolyhedron: xt,
    Cuboid: xe,
    Cylinder: ke,
    DebugRenderBuffers: Br,
    DebugRenderPipeline: Vr,
    DynamicRayCastVehicleController: Jr,
    EventQueue: Ih,
    get FeatureType() {
      return st;
    },
    FixedImpulseJoint: vr,
    FixedMultibodyJoint: Pr,
    GenericImpulseJoint: Ar,
    HalfSpace: Gr,
    get HeightFieldFlags() {
      return _e;
    },
    Heightfield: Me,
    ImpulseJoint: O,
    ImpulseJointSet: Er,
    IntegrationParameters: Sr,
    IslandManager: Hr,
    get JointAxesMask() {
      return oe;
    },
    JointData: X,
    get JointType() {
      return D;
    },
    KinematicCharacterController: Ur,
    get MassPropsMode() {
      return et;
    },
    get MotorModel() {
      return se;
    },
    MultibodyJoint: Q,
    MultibodyJointSet: Mr,
    NarrowPhase: Lr,
    PhysicsPipeline: Wr,
    get PidAxesMask() {
      return de;
    },
    PidController: Xr,
    PointColliderProjection: ht,
    PointProjection: ut,
    Polyline: Fe,
    PrismaticImpulseJoint: xr,
    PrismaticMultibodyJoint: Fr,
    Quaternion: ie,
    get QueryFilterFlags() {
      return le;
    },
    QueryPipeline: qr,
    Ray: xh,
    RayColliderHit: Dt,
    RayColliderIntersection: pt,
    RayIntersection: gt,
    RevoluteImpulseJoint: Ir,
    RevoluteMultibodyJoint: zr,
    RigidBody: ae,
    RigidBodyDesc: U,
    RigidBodySet: yr,
    get RigidBodyType() {
      return B;
    },
    RopeImpulseJoint: Rr,
    RotationOps: S,
    RoundCone: Le,
    RoundConvexPolyhedron: It,
    RoundCuboid: Ie,
    RoundCylinder: He,
    RoundTriangle: Pe,
    SdpMatrix3: fr,
    SdpMatrix3Ops: ne,
    Segment: je,
    SerializationPipeline: we,
    Shape: M,
    ShapeCastHit: ot,
    ShapeContact: at,
    get ShapeType() {
      return F;
    },
    get SolverFlags() {
      return he;
    },
    SphericalImpulseJoint: jr,
    SphericalMultibodyJoint: Tr,
    SpringImpulseJoint: Cr,
    TempContactForceEvent: Kr,
    TempContactManifold: Nr,
    TriMesh: Te,
    get TriMeshFlags() {
      return ce;
    },
    Triangle: Ee,
    UnitImpulseJoint: ve,
    UnitMultibodyJoint: Re,
    Vector3: mr,
    VectorOps: w,
    Voxels: ze,
    World: Lt,
    reserveMemory: jh,
    version: Ah
  }, Symbol.toStringTag, {
    value: "Module"
  }));
})();
export {
  Et as ActiveCollisionTypes,
  At as ActiveEvents,
  jt as ActiveHooks,
  Ce as Ball,
  Dr as BroadPhase,
  kr as CCDSolver,
  Ae as Capsule,
  Or as CharacterCollision,
  dt as CoefficientCombineRule,
  pe as Collider,
  P as ColliderDesc,
  Yr as ColliderSet,
  bt as ColliderShapeCastHit,
  De as Cone,
  xt as ConvexPolyhedron,
  xe as Cuboid,
  ke as Cylinder,
  Br as DebugRenderBuffers,
  Vr as DebugRenderPipeline,
  Jr as DynamicRayCastVehicleController,
  Ih as EventQueue,
  st as FeatureType,
  vr as FixedImpulseJoint,
  Pr as FixedMultibodyJoint,
  Ar as GenericImpulseJoint,
  Gr as HalfSpace,
  _e as HeightFieldFlags,
  Me as Heightfield,
  O as ImpulseJoint,
  Er as ImpulseJointSet,
  Sr as IntegrationParameters,
  Hr as IslandManager,
  oe as JointAxesMask,
  X as JointData,
  D as JointType,
  Ur as KinematicCharacterController,
  et as MassPropsMode,
  se as MotorModel,
  Q as MultibodyJoint,
  Mr as MultibodyJointSet,
  Lr as NarrowPhase,
  Wr as PhysicsPipeline,
  de as PidAxesMask,
  Xr as PidController,
  ht as PointColliderProjection,
  ut as PointProjection,
  Fe as Polyline,
  xr as PrismaticImpulseJoint,
  Fr as PrismaticMultibodyJoint,
  ie as Quaternion,
  le as QueryFilterFlags,
  qr as QueryPipeline,
  xh as Ray,
  Dt as RayColliderHit,
  pt as RayColliderIntersection,
  gt as RayIntersection,
  Ir as RevoluteImpulseJoint,
  zr as RevoluteMultibodyJoint,
  ae as RigidBody,
  U as RigidBodyDesc,
  yr as RigidBodySet,
  B as RigidBodyType,
  Rr as RopeImpulseJoint,
  S as RotationOps,
  Le as RoundCone,
  It as RoundConvexPolyhedron,
  Ie as RoundCuboid,
  He as RoundCylinder,
  Pe as RoundTriangle,
  fr as SdpMatrix3,
  ne as SdpMatrix3Ops,
  je as Segment,
  we as SerializationPipeline,
  M as Shape,
  ot as ShapeCastHit,
  at as ShapeContact,
  F as ShapeType,
  he as SolverFlags,
  jr as SphericalImpulseJoint,
  Tr as SphericalMultibodyJoint,
  Cr as SpringImpulseJoint,
  Kr as TempContactForceEvent,
  Nr as TempContactManifold,
  Te as TriMesh,
  ce as TriMeshFlags,
  Ee as Triangle,
  ve as UnitImpulseJoint,
  Re as UnitMultibodyJoint,
  mr as Vector3,
  w as VectorOps,
  ze as Voxels,
  Lt as World,
  __tla,
  Eh as default,
  jh as reserveMemory,
  Ah as version
};
