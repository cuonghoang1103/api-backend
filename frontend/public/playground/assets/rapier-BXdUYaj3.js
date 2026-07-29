import { B as Buffer, __tla as __tla_0 } from "./index-IJNNRvgj.js";
let ActiveCollisionTypes, ActiveEvents, ActiveHooks, Ball, BroadPhase, CCDSolver, Capsule, CharacterCollision, CoefficientCombineRule, Collider, ColliderDesc, ColliderSet, ColliderShapeCastHit, Cone, ConvexPolyhedron, Cuboid, Cylinder, DebugRenderBuffers, DebugRenderPipeline, DynamicRayCastVehicleController, EventQueue, FeatureType, FixedImpulseJoint, FixedMultibodyJoint, GenericImpulseJoint, HalfSpace, HeightFieldFlags, Heightfield, ImpulseJoint, ImpulseJointSet, IntegrationParameters, IslandManager, JointAxesMask, JointData, JointType, KinematicCharacterController, MassPropsMode, MotorModel, MultibodyJoint, MultibodyJointSet, NarrowPhase, PhysicsPipeline, PidAxesMask, PidController, PointColliderProjection, PointProjection, Polyline, PrismaticImpulseJoint, PrismaticMultibodyJoint, Quaternion, QueryFilterFlags, QueryPipeline, Ray, RayColliderHit, RayColliderIntersection, RayIntersection, RevoluteImpulseJoint, RevoluteMultibodyJoint, RigidBody, RigidBodyDesc, RigidBodySet, RigidBodyType, RopeImpulseJoint, RotationOps, RoundCone, RoundConvexPolyhedron, RoundCuboid, RoundCylinder, RoundTriangle, SdpMatrix3, SdpMatrix3Ops, Segment, SerializationPipeline, Shape, ShapeCastHit, ShapeContact, ShapeType, SolverFlags, SphericalImpulseJoint, SphericalMultibodyJoint, SpringImpulseJoint, TempContactForceEvent, TempContactManifold, TriMesh, TriMeshFlags, Triangle, UnitImpulseJoint, UnitMultibodyJoint, Vector3, VectorOps, Voxels, World, RAPIER, reserveMemory, version;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const __vite__wasmUrl = "" + new URL("rapier_wasm3d_bg-0Vyjx73g.wasm", import.meta.url).href;
  const __vite__initWasm = async (opts = {}, url) => {
    let result;
    if (url.startsWith("data:")) {
      const urlContent = url.replace(/^data:.*?base64,/, "");
      let bytes;
      if (typeof Buffer === "function" && typeof Buffer.from === "function") {
        bytes = Buffer.from(urlContent, "base64");
      } else if (typeof atob === "function") {
        const binaryString = atob(urlContent);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      } else {
        throw new Error("Cannot decode base64-encoded data URL");
      }
      result = await WebAssembly.instantiate(bytes, opts);
    } else {
      const response = await fetch(url);
      const contentType = response.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) {
        result = await WebAssembly.instantiateStreaming(response, opts);
      } else {
        const buffer = await response.arrayBuffer();
        result = await WebAssembly.instantiate(buffer, opts);
      }
    }
    return result.instance.exports;
  };
  let wasm$1;
  function __wbg_set_wasm(val) {
    wasm$1 = val;
  }
  const heap = new Array(128).fill(void 0);
  heap.push(void 0, null, true, false);
  function getObject(idx) {
    return heap[idx];
  }
  let heap_next = heap.length;
  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  function handleError(f, args) {
    try {
      return f.apply(this, args);
    } catch (e) {
      wasm$1.__wbindgen_export_0(addHeapObject(e));
    }
  }
  function isLikeNone(x) {
    return x === void 0 || x === null;
  }
  let cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm$1.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm$1.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  const lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
  let cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  cachedTextDecoder.decode();
  let cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm$1.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }
  function version$2() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      wasm$1.version(retptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
      wasm$1.__wbindgen_export_1(deferred1_0, deferred1_1, 1);
    }
  }
  function reserve_memory$1(extra_bytes_count) {
    wasm$1.reserve_memory(extra_bytes_count);
  }
  function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
      throw new Error(`expected instance of ${klass.name}`);
    }
  }
  let stack_pointer = 128;
  function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error("out of js stack");
    heap[--stack_pointer] = obj;
    return stack_pointer;
  }
  let cachedInt32ArrayMemory0 = null;
  function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
      cachedInt32ArrayMemory0 = new Int32Array(wasm$1.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
  }
  function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  let cachedFloat32ArrayMemory0 = null;
  function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
      cachedFloat32ArrayMemory0 = new Float32Array(wasm$1.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
  }
  function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  let cachedUint32ArrayMemory0 = null;
  function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
      cachedUint32ArrayMemory0 = new Uint32Array(wasm$1.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
  }
  function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  let WASM_VECTOR_LEN = 0;
  function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  const RawJointAxis = Object.freeze({
    LinX: 0,
    "0": "LinX",
    LinY: 1,
    "1": "LinY",
    LinZ: 2,
    "2": "LinZ",
    AngX: 3,
    "3": "AngX",
    AngY: 4,
    "4": "AngY",
    AngZ: 5,
    "5": "AngZ"
  });
  const RawJointType = Object.freeze({
    Revolute: 0,
    "0": "Revolute",
    Fixed: 1,
    "1": "Fixed",
    Prismatic: 2,
    "2": "Prismatic",
    Rope: 3,
    "3": "Rope",
    Spring: 4,
    "4": "Spring",
    Spherical: 5,
    "5": "Spherical",
    Generic: 6,
    "6": "Generic"
  });
  const RawShapeType = Object.freeze({
    Ball: 0,
    "0": "Ball",
    Cuboid: 1,
    "1": "Cuboid",
    Capsule: 2,
    "2": "Capsule",
    Segment: 3,
    "3": "Segment",
    Polyline: 4,
    "4": "Polyline",
    Triangle: 5,
    "5": "Triangle",
    TriMesh: 6,
    "6": "TriMesh",
    HeightField: 7,
    "7": "HeightField",
    Compound: 8,
    "8": "Compound",
    ConvexPolyhedron: 9,
    "9": "ConvexPolyhedron",
    Cylinder: 10,
    "10": "Cylinder",
    Cone: 11,
    "11": "Cone",
    RoundCuboid: 12,
    "12": "RoundCuboid",
    RoundTriangle: 13,
    "13": "RoundTriangle",
    RoundCylinder: 14,
    "14": "RoundCylinder",
    RoundCone: 15,
    "15": "RoundCone",
    RoundConvexPolyhedron: 16,
    "16": "RoundConvexPolyhedron",
    HalfSpace: 17,
    "17": "HalfSpace",
    Voxels: 18,
    "18": "Voxels"
  });
  const RawBroadPhaseFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawbroadphase_free(ptr >>> 0, 1));
  class RawBroadPhase {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawBroadPhase.prototype);
      obj.__wbg_ptr = ptr;
      RawBroadPhaseFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawBroadPhaseFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawbroadphase_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawbroadphase_new();
      this.__wbg_ptr = ret >>> 0;
      RawBroadPhaseFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
  }
  const RawCCDSolverFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawccdsolver_free(ptr >>> 0, 1));
  class RawCCDSolver {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawCCDSolverFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawccdsolver_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawccdsolver_new();
      this.__wbg_ptr = ret >>> 0;
      RawCCDSolverFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
  }
  const RawCharacterCollisionFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawcharactercollision_free(ptr >>> 0, 1));
  class RawCharacterCollision {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawCharacterCollisionFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawcharactercollision_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawcharactercollision_new();
      this.__wbg_ptr = ret >>> 0;
      RawCharacterCollisionFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    handle() {
      const ret = wasm$1.rawcharactercollision_handle(this.__wbg_ptr);
      return ret;
    }
    translationDeltaApplied() {
      const ret = wasm$1.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    translationDeltaRemaining() {
      const ret = wasm$1.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    toi() {
      const ret = wasm$1.rawcharactercollision_toi(this.__wbg_ptr);
      return ret;
    }
    worldWitness1() {
      const ret = wasm$1.rawcharactercollision_worldWitness1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    worldWitness2() {
      const ret = wasm$1.rawcharactercollision_worldWitness2(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    worldNormal1() {
      const ret = wasm$1.rawcharactercollision_worldNormal1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    worldNormal2() {
      const ret = wasm$1.rawcharactercollision_worldNormal2(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
  }
  const RawColliderSetFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawcolliderset_free(ptr >>> 0, 1));
  class RawColliderSet {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawColliderSet.prototype);
      obj.__wbg_ptr = ptr;
      RawColliderSetFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawColliderSetFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawcolliderset_free(ptr, 0);
    }
    coTranslation(handle) {
      const ret = wasm$1.rawcolliderset_coTranslation(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    coRotation(handle) {
      const ret = wasm$1.rawcolliderset_coRotation(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    coSetTranslation(handle, x, y, z) {
      wasm$1.rawcolliderset_coSetTranslation(this.__wbg_ptr, handle, x, y, z);
    }
    coSetTranslationWrtParent(handle, x, y, z) {
      wasm$1.rawcolliderset_coSetTranslationWrtParent(this.__wbg_ptr, handle, x, y, z);
    }
    coSetRotation(handle, x, y, z, w) {
      wasm$1.rawcolliderset_coSetRotation(this.__wbg_ptr, handle, x, y, z, w);
    }
    coSetRotationWrtParent(handle, x, y, z, w) {
      wasm$1.rawcolliderset_coSetRotationWrtParent(this.__wbg_ptr, handle, x, y, z, w);
    }
    coIsSensor(handle) {
      const ret = wasm$1.rawcolliderset_coIsSensor(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    coShapeType(handle) {
      const ret = wasm$1.rawcolliderset_coShapeType(this.__wbg_ptr, handle);
      return ret;
    }
    coHalfspaceNormal(handle) {
      const ret = wasm$1.rawcolliderset_coHalfspaceNormal(this.__wbg_ptr, handle);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    coHalfExtents(handle) {
      const ret = wasm$1.rawcolliderset_coHalfExtents(this.__wbg_ptr, handle);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    coSetHalfExtents(handle, newHalfExtents) {
      _assertClass(newHalfExtents, RawVector);
      wasm$1.rawcolliderset_coSetHalfExtents(this.__wbg_ptr, handle, newHalfExtents.__wbg_ptr);
    }
    coRadius(handle) {
      const ret = wasm$1.rawcolliderset_coRadius(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coSetRadius(handle, newRadius) {
      wasm$1.rawcolliderset_coSetRadius(this.__wbg_ptr, handle, newRadius);
    }
    coHalfHeight(handle) {
      const ret = wasm$1.rawcolliderset_coHalfHeight(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coSetHalfHeight(handle, newHalfheight) {
      wasm$1.rawcolliderset_coSetHalfHeight(this.__wbg_ptr, handle, newHalfheight);
    }
    coRoundRadius(handle) {
      const ret = wasm$1.rawcolliderset_coRoundRadius(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coSetRoundRadius(handle, newBorderRadius) {
      wasm$1.rawcolliderset_coSetRoundRadius(this.__wbg_ptr, handle, newBorderRadius);
    }
    coVoxelData(handle) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.rawcolliderset_coVoxelData(retptr, this.__wbg_ptr, handle);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        let v1;
        if (r0 !== 0) {
          v1 = getArrayI32FromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_export_1(r0, r1 * 4, 4);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coVoxelSize(handle) {
      const ret = wasm$1.rawcolliderset_coVoxelSize(this.__wbg_ptr, handle);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    coSetVoxel(handle, ix, iy, iz, filled) {
      wasm$1.rawcolliderset_coSetVoxel(this.__wbg_ptr, handle, ix, iy, iz, filled);
    }
    coPropagateVoxelChange(handle1, handle2, ix, iy, iz, shift_x, shift_y, shift_z) {
      wasm$1.rawcolliderset_coPropagateVoxelChange(this.__wbg_ptr, handle1, handle2, ix, iy, iz, shift_x, shift_y, shift_z);
    }
    coCombineVoxelStates(handle1, handle2, shift_x, shift_y, shift_z) {
      wasm$1.rawcolliderset_coCombineVoxelStates(this.__wbg_ptr, handle1, handle2, shift_x, shift_y, shift_z);
    }
    coVertices(handle) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.rawcolliderset_coVertices(retptr, this.__wbg_ptr, handle);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        let v1;
        if (r0 !== 0) {
          v1 = getArrayF32FromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_export_1(r0, r1 * 4, 4);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coIndices(handle) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.rawcolliderset_coIndices(retptr, this.__wbg_ptr, handle);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        let v1;
        if (r0 !== 0) {
          v1 = getArrayU32FromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_export_1(r0, r1 * 4, 4);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coTriMeshFlags(handle) {
      const ret = wasm$1.rawcolliderset_coTriMeshFlags(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coHeightFieldFlags(handle) {
      const ret = wasm$1.rawcolliderset_coHeightFieldFlags(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coHeightfieldHeights(handle) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.rawcolliderset_coHeightfieldHeights(retptr, this.__wbg_ptr, handle);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        let v1;
        if (r0 !== 0) {
          v1 = getArrayF32FromWasm0(r0, r1).slice();
          wasm$1.__wbindgen_export_1(r0, r1 * 4, 4);
        }
        return v1;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coHeightfieldScale(handle) {
      const ret = wasm$1.rawcolliderset_coHeightfieldScale(this.__wbg_ptr, handle);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    coHeightfieldNRows(handle) {
      const ret = wasm$1.rawcolliderset_coHeightfieldNRows(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coHeightfieldNCols(handle) {
      const ret = wasm$1.rawcolliderset_coHeightfieldNCols(this.__wbg_ptr, handle);
      return ret === 4294967297 ? void 0 : ret;
    }
    coParent(handle) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.rawcolliderset_coParent(retptr, this.__wbg_ptr, handle);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
        return r0 === 0 ? void 0 : r2;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    coSetEnabled(handle, enabled) {
      wasm$1.rawcolliderset_coSetEnabled(this.__wbg_ptr, handle, enabled);
    }
    coIsEnabled(handle) {
      const ret = wasm$1.rawcolliderset_coIsEnabled(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    coSetContactSkin(handle, contact_skin) {
      wasm$1.rawcolliderset_coSetContactSkin(this.__wbg_ptr, handle, contact_skin);
    }
    coContactSkin(handle) {
      const ret = wasm$1.rawcolliderset_coContactSkin(this.__wbg_ptr, handle);
      return ret;
    }
    coFriction(handle) {
      const ret = wasm$1.rawcolliderset_coFriction(this.__wbg_ptr, handle);
      return ret;
    }
    coRestitution(handle) {
      const ret = wasm$1.rawcolliderset_coRestitution(this.__wbg_ptr, handle);
      return ret;
    }
    coDensity(handle) {
      const ret = wasm$1.rawcolliderset_coDensity(this.__wbg_ptr, handle);
      return ret;
    }
    coMass(handle) {
      const ret = wasm$1.rawcolliderset_coMass(this.__wbg_ptr, handle);
      return ret;
    }
    coVolume(handle) {
      const ret = wasm$1.rawcolliderset_coVolume(this.__wbg_ptr, handle);
      return ret;
    }
    coCollisionGroups(handle) {
      const ret = wasm$1.rawcolliderset_coCollisionGroups(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    coSolverGroups(handle) {
      const ret = wasm$1.rawcolliderset_coSolverGroups(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    coActiveHooks(handle) {
      const ret = wasm$1.rawcolliderset_coActiveHooks(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    coActiveCollisionTypes(handle) {
      const ret = wasm$1.rawcolliderset_coActiveCollisionTypes(this.__wbg_ptr, handle);
      return ret;
    }
    coActiveEvents(handle) {
      const ret = wasm$1.rawcolliderset_coActiveEvents(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    coContactForceEventThreshold(handle) {
      const ret = wasm$1.rawcolliderset_coContactForceEventThreshold(this.__wbg_ptr, handle);
      return ret;
    }
    coContainsPoint(handle, point) {
      _assertClass(point, RawVector);
      const ret = wasm$1.rawcolliderset_coContainsPoint(this.__wbg_ptr, handle, point.__wbg_ptr);
      return ret !== 0;
    }
    coCastShape(handle, colliderVel, shape2, shape2Pos, shape2Rot, shape2Vel, target_distance, maxToi, stop_at_penetration) {
      _assertClass(colliderVel, RawVector);
      _assertClass(shape2, RawShape);
      _assertClass(shape2Pos, RawVector);
      _assertClass(shape2Rot, RawRotation);
      _assertClass(shape2Vel, RawVector);
      const ret = wasm$1.rawcolliderset_coCastShape(this.__wbg_ptr, handle, colliderVel.__wbg_ptr, shape2.__wbg_ptr, shape2Pos.__wbg_ptr, shape2Rot.__wbg_ptr, shape2Vel.__wbg_ptr, target_distance, maxToi, stop_at_penetration);
      return ret === 0 ? void 0 : RawShapeCastHit.__wrap(ret);
    }
    coCastCollider(handle, collider1Vel, collider2handle, collider2Vel, target_distance, max_toi, stop_at_penetration) {
      _assertClass(collider1Vel, RawVector);
      _assertClass(collider2Vel, RawVector);
      const ret = wasm$1.rawcolliderset_coCastCollider(this.__wbg_ptr, handle, collider1Vel.__wbg_ptr, collider2handle, collider2Vel.__wbg_ptr, target_distance, max_toi, stop_at_penetration);
      return ret === 0 ? void 0 : RawColliderShapeCastHit.__wrap(ret);
    }
    coIntersectsShape(handle, shape2, shapePos2, shapeRot2) {
      _assertClass(shape2, RawShape);
      _assertClass(shapePos2, RawVector);
      _assertClass(shapeRot2, RawRotation);
      const ret = wasm$1.rawcolliderset_coIntersectsShape(this.__wbg_ptr, handle, shape2.__wbg_ptr, shapePos2.__wbg_ptr, shapeRot2.__wbg_ptr);
      return ret !== 0;
    }
    coContactShape(handle, shape2, shapePos2, shapeRot2, prediction) {
      _assertClass(shape2, RawShape);
      _assertClass(shapePos2, RawVector);
      _assertClass(shapeRot2, RawRotation);
      const ret = wasm$1.rawcolliderset_coContactShape(this.__wbg_ptr, handle, shape2.__wbg_ptr, shapePos2.__wbg_ptr, shapeRot2.__wbg_ptr, prediction);
      return ret === 0 ? void 0 : RawShapeContact.__wrap(ret);
    }
    coContactCollider(handle, collider2handle, prediction) {
      const ret = wasm$1.rawcolliderset_coContactCollider(this.__wbg_ptr, handle, collider2handle, prediction);
      return ret === 0 ? void 0 : RawShapeContact.__wrap(ret);
    }
    coProjectPoint(handle, point, solid) {
      _assertClass(point, RawVector);
      const ret = wasm$1.rawcolliderset_coProjectPoint(this.__wbg_ptr, handle, point.__wbg_ptr, solid);
      return RawPointProjection.__wrap(ret);
    }
    coIntersectsRay(handle, rayOrig, rayDir, maxToi) {
      _assertClass(rayOrig, RawVector);
      _assertClass(rayDir, RawVector);
      const ret = wasm$1.rawcolliderset_coIntersectsRay(this.__wbg_ptr, handle, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi);
      return ret !== 0;
    }
    coCastRay(handle, rayOrig, rayDir, maxToi, solid) {
      _assertClass(rayOrig, RawVector);
      _assertClass(rayDir, RawVector);
      const ret = wasm$1.rawcolliderset_coCastRay(this.__wbg_ptr, handle, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid);
      return ret;
    }
    coCastRayAndGetNormal(handle, rayOrig, rayDir, maxToi, solid) {
      _assertClass(rayOrig, RawVector);
      _assertClass(rayDir, RawVector);
      const ret = wasm$1.rawcolliderset_coCastRayAndGetNormal(this.__wbg_ptr, handle, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid);
      return ret === 0 ? void 0 : RawRayIntersection.__wrap(ret);
    }
    coSetSensor(handle, is_sensor) {
      wasm$1.rawcolliderset_coSetSensor(this.__wbg_ptr, handle, is_sensor);
    }
    coSetRestitution(handle, restitution) {
      wasm$1.rawcolliderset_coSetRestitution(this.__wbg_ptr, handle, restitution);
    }
    coSetFriction(handle, friction) {
      wasm$1.rawcolliderset_coSetFriction(this.__wbg_ptr, handle, friction);
    }
    coFrictionCombineRule(handle) {
      const ret = wasm$1.rawcolliderset_coFrictionCombineRule(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    coSetFrictionCombineRule(handle, rule) {
      wasm$1.rawcolliderset_coSetFrictionCombineRule(this.__wbg_ptr, handle, rule);
    }
    coRestitutionCombineRule(handle) {
      const ret = wasm$1.rawcolliderset_coRestitutionCombineRule(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    coSetRestitutionCombineRule(handle, rule) {
      wasm$1.rawcolliderset_coSetRestitutionCombineRule(this.__wbg_ptr, handle, rule);
    }
    coSetCollisionGroups(handle, groups) {
      wasm$1.rawcolliderset_coSetCollisionGroups(this.__wbg_ptr, handle, groups);
    }
    coSetSolverGroups(handle, groups) {
      wasm$1.rawcolliderset_coSetSolverGroups(this.__wbg_ptr, handle, groups);
    }
    coSetActiveHooks(handle, hooks) {
      wasm$1.rawcolliderset_coSetActiveHooks(this.__wbg_ptr, handle, hooks);
    }
    coSetActiveEvents(handle, events) {
      wasm$1.rawcolliderset_coSetActiveEvents(this.__wbg_ptr, handle, events);
    }
    coSetActiveCollisionTypes(handle, types) {
      wasm$1.rawcolliderset_coSetActiveCollisionTypes(this.__wbg_ptr, handle, types);
    }
    coSetShape(handle, shape) {
      _assertClass(shape, RawShape);
      wasm$1.rawcolliderset_coSetShape(this.__wbg_ptr, handle, shape.__wbg_ptr);
    }
    coSetContactForceEventThreshold(handle, threshold) {
      wasm$1.rawcolliderset_coSetContactForceEventThreshold(this.__wbg_ptr, handle, threshold);
    }
    coSetDensity(handle, density) {
      wasm$1.rawcolliderset_coSetDensity(this.__wbg_ptr, handle, density);
    }
    coSetMass(handle, mass) {
      wasm$1.rawcolliderset_coSetMass(this.__wbg_ptr, handle, mass);
    }
    coSetMassProperties(handle, mass, centerOfMass, principalAngularInertia, angularInertiaFrame) {
      _assertClass(centerOfMass, RawVector);
      _assertClass(principalAngularInertia, RawVector);
      _assertClass(angularInertiaFrame, RawRotation);
      wasm$1.rawcolliderset_coSetMassProperties(this.__wbg_ptr, handle, mass, centerOfMass.__wbg_ptr, principalAngularInertia.__wbg_ptr, angularInertiaFrame.__wbg_ptr);
    }
    constructor() {
      const ret = wasm$1.rawcolliderset_new();
      this.__wbg_ptr = ret >>> 0;
      RawColliderSetFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    len() {
      const ret = wasm$1.rawcolliderset_len(this.__wbg_ptr);
      return ret >>> 0;
    }
    contains(handle) {
      const ret = wasm$1.rawcolliderset_contains(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    createCollider(enabled, shape, translation, rotation, massPropsMode, mass, centerOfMass, principalAngularInertia, angularInertiaFrame, density, friction, restitution, frictionCombineRule, restitutionCombineRule, isSensor, collisionGroups, solverGroups, activeCollisionTypes, activeHooks, activeEvents, contactForceEventThreshold, contactSkin, hasParent, parent, bodies) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(shape, RawShape);
        _assertClass(translation, RawVector);
        _assertClass(rotation, RawRotation);
        _assertClass(centerOfMass, RawVector);
        _assertClass(principalAngularInertia, RawVector);
        _assertClass(angularInertiaFrame, RawRotation);
        _assertClass(bodies, RawRigidBodySet);
        wasm$1.rawcolliderset_createCollider(retptr, this.__wbg_ptr, enabled, shape.__wbg_ptr, translation.__wbg_ptr, rotation.__wbg_ptr, massPropsMode, mass, centerOfMass.__wbg_ptr, principalAngularInertia.__wbg_ptr, angularInertiaFrame.__wbg_ptr, density, friction, restitution, frictionCombineRule, restitutionCombineRule, isSensor, collisionGroups, solverGroups, activeCollisionTypes, activeHooks, activeEvents, contactForceEventThreshold, contactSkin, hasParent, parent, bodies.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
        return r0 === 0 ? void 0 : r2;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
    remove(handle, islands, bodies, wakeUp) {
      _assertClass(islands, RawIslandManager);
      _assertClass(bodies, RawRigidBodySet);
      wasm$1.rawcolliderset_remove(this.__wbg_ptr, handle, islands.__wbg_ptr, bodies.__wbg_ptr, wakeUp);
    }
    isHandleValid(handle) {
      const ret = wasm$1.rawcolliderset_contains(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    forEachColliderHandle(f) {
      try {
        wasm$1.rawcolliderset_forEachColliderHandle(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
  }
  const RawColliderShapeCastHitFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawcollidershapecasthit_free(ptr >>> 0, 1));
  class RawColliderShapeCastHit {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawColliderShapeCastHit.prototype);
      obj.__wbg_ptr = ptr;
      RawColliderShapeCastHitFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawColliderShapeCastHitFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawcollidershapecasthit_free(ptr, 0);
    }
    colliderHandle() {
      const ret = wasm$1.rawcharactercollision_handle(this.__wbg_ptr);
      return ret;
    }
    time_of_impact() {
      const ret = wasm$1.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
      return ret;
    }
    witness1() {
      const ret = wasm$1.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    witness2() {
      const ret = wasm$1.rawcollidershapecasthit_witness2(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    normal1() {
      const ret = wasm$1.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    normal2() {
      const ret = wasm$1.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
  }
  const RawContactForceEventFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawcontactforceevent_free(ptr >>> 0, 1));
  class RawContactForceEvent {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawContactForceEvent.prototype);
      obj.__wbg_ptr = ptr;
      RawContactForceEventFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawContactForceEventFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawcontactforceevent_free(ptr, 0);
    }
    collider1() {
      const ret = wasm$1.rawcharactercollision_handle(this.__wbg_ptr);
      return ret;
    }
    collider2() {
      const ret = wasm$1.rawcontactforceevent_collider2(this.__wbg_ptr);
      return ret;
    }
    total_force() {
      const ret = wasm$1.rawcontactforceevent_total_force(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    total_force_magnitude() {
      const ret = wasm$1.rawcontactforceevent_total_force_magnitude(this.__wbg_ptr);
      return ret;
    }
    max_force_direction() {
      const ret = wasm$1.rawcontactforceevent_max_force_direction(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    max_force_magnitude() {
      const ret = wasm$1.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
      return ret;
    }
  }
  const RawContactManifoldFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawcontactmanifold_free(ptr >>> 0, 1));
  class RawContactManifold {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawContactManifold.prototype);
      obj.__wbg_ptr = ptr;
      RawContactManifoldFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawContactManifoldFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawcontactmanifold_free(ptr, 0);
    }
    normal() {
      const ret = wasm$1.rawcontactmanifold_normal(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    local_n1() {
      const ret = wasm$1.rawcontactmanifold_local_n1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    local_n2() {
      const ret = wasm$1.rawcontactmanifold_local_n2(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    subshape1() {
      const ret = wasm$1.rawcontactmanifold_subshape1(this.__wbg_ptr);
      return ret >>> 0;
    }
    subshape2() {
      const ret = wasm$1.rawcontactmanifold_subshape2(this.__wbg_ptr);
      return ret >>> 0;
    }
    num_contacts() {
      const ret = wasm$1.rawcontactmanifold_num_contacts(this.__wbg_ptr);
      return ret >>> 0;
    }
    contact_local_p1(i) {
      const ret = wasm$1.rawcontactmanifold_contact_local_p1(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    contact_local_p2(i) {
      const ret = wasm$1.rawcontactmanifold_contact_local_p2(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    contact_dist(i) {
      const ret = wasm$1.rawcontactmanifold_contact_dist(this.__wbg_ptr, i);
      return ret;
    }
    contact_fid1(i) {
      const ret = wasm$1.rawcontactmanifold_contact_fid1(this.__wbg_ptr, i);
      return ret >>> 0;
    }
    contact_fid2(i) {
      const ret = wasm$1.rawcontactmanifold_contact_fid2(this.__wbg_ptr, i);
      return ret >>> 0;
    }
    contact_impulse(i) {
      const ret = wasm$1.rawcontactmanifold_contact_impulse(this.__wbg_ptr, i);
      return ret;
    }
    contact_tangent_impulse_x(i) {
      const ret = wasm$1.rawcontactmanifold_contact_tangent_impulse_x(this.__wbg_ptr, i);
      return ret;
    }
    contact_tangent_impulse_y(i) {
      const ret = wasm$1.rawcontactmanifold_contact_tangent_impulse_y(this.__wbg_ptr, i);
      return ret;
    }
    num_solver_contacts() {
      const ret = wasm$1.rawcontactmanifold_num_solver_contacts(this.__wbg_ptr);
      return ret >>> 0;
    }
    solver_contact_point(i) {
      const ret = wasm$1.rawcontactmanifold_solver_contact_point(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    solver_contact_dist(i) {
      const ret = wasm$1.rawcontactmanifold_solver_contact_dist(this.__wbg_ptr, i);
      return ret;
    }
    solver_contact_friction(i) {
      const ret = wasm$1.rawcontactmanifold_solver_contact_friction(this.__wbg_ptr, i);
      return ret;
    }
    solver_contact_restitution(i) {
      const ret = wasm$1.rawcontactmanifold_solver_contact_restitution(this.__wbg_ptr, i);
      return ret;
    }
    solver_contact_tangent_velocity(i) {
      const ret = wasm$1.rawcontactmanifold_solver_contact_tangent_velocity(this.__wbg_ptr, i);
      return RawVector.__wrap(ret);
    }
  }
  const RawContactPairFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawcontactpair_free(ptr >>> 0, 1));
  class RawContactPair {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawContactPair.prototype);
      obj.__wbg_ptr = ptr;
      RawContactPairFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawContactPairFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawcontactpair_free(ptr, 0);
    }
    collider1() {
      const ret = wasm$1.rawcontactpair_collider1(this.__wbg_ptr);
      return ret;
    }
    collider2() {
      const ret = wasm$1.rawcontactpair_collider2(this.__wbg_ptr);
      return ret;
    }
    numContactManifolds() {
      const ret = wasm$1.rawcontactpair_numContactManifolds(this.__wbg_ptr);
      return ret >>> 0;
    }
    contactManifold(i) {
      const ret = wasm$1.rawcontactpair_contactManifold(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawContactManifold.__wrap(ret);
    }
  }
  const RawDebugRenderPipelineFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawdebugrenderpipeline_free(ptr >>> 0, 1));
  class RawDebugRenderPipeline {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawDebugRenderPipelineFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawdebugrenderpipeline_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawdebugrenderpipeline_new();
      this.__wbg_ptr = ret >>> 0;
      RawDebugRenderPipelineFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    vertices() {
      const ret = wasm$1.rawdebugrenderpipeline_vertices(this.__wbg_ptr);
      return takeObject(ret);
    }
    colors() {
      const ret = wasm$1.rawdebugrenderpipeline_colors(this.__wbg_ptr);
      return takeObject(ret);
    }
    render(bodies, colliders, impulse_joints, multibody_joints, narrow_phase, filter_flags, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(impulse_joints, RawImpulseJointSet);
        _assertClass(multibody_joints, RawMultibodyJointSet);
        _assertClass(narrow_phase, RawNarrowPhase);
        wasm$1.rawdebugrenderpipeline_render(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, impulse_joints.__wbg_ptr, multibody_joints.__wbg_ptr, narrow_phase.__wbg_ptr, filter_flags, addBorrowedObject(filter_predicate));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
  }
  const RawDeserializedWorldFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawdeserializedworld_free(ptr >>> 0, 1));
  class RawDeserializedWorld {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawDeserializedWorld.prototype);
      obj.__wbg_ptr = ptr;
      RawDeserializedWorldFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawDeserializedWorldFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawdeserializedworld_free(ptr, 0);
    }
    takeGravity() {
      const ret = wasm$1.rawdeserializedworld_takeGravity(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    takeIntegrationParameters() {
      const ret = wasm$1.rawdeserializedworld_takeIntegrationParameters(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawIntegrationParameters.__wrap(ret);
    }
    takeIslandManager() {
      const ret = wasm$1.rawdeserializedworld_takeIslandManager(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawIslandManager.__wrap(ret);
    }
    takeBroadPhase() {
      const ret = wasm$1.rawdeserializedworld_takeBroadPhase(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawBroadPhase.__wrap(ret);
    }
    takeNarrowPhase() {
      const ret = wasm$1.rawdeserializedworld_takeNarrowPhase(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawNarrowPhase.__wrap(ret);
    }
    takeBodies() {
      const ret = wasm$1.rawdeserializedworld_takeBodies(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawRigidBodySet.__wrap(ret);
    }
    takeColliders() {
      const ret = wasm$1.rawdeserializedworld_takeColliders(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawColliderSet.__wrap(ret);
    }
    takeImpulseJoints() {
      const ret = wasm$1.rawdeserializedworld_takeImpulseJoints(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawImpulseJointSet.__wrap(ret);
    }
    takeMultibodyJoints() {
      const ret = wasm$1.rawdeserializedworld_takeMultibodyJoints(this.__wbg_ptr);
      return ret === 0 ? void 0 : RawMultibodyJointSet.__wrap(ret);
    }
  }
  const RawDynamicRayCastVehicleControllerFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawdynamicraycastvehiclecontroller_free(ptr >>> 0, 1));
  class RawDynamicRayCastVehicleController {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawDynamicRayCastVehicleControllerFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawdynamicraycastvehiclecontroller_free(ptr, 0);
    }
    constructor(chassis) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_new(chassis);
      this.__wbg_ptr = ret >>> 0;
      RawDynamicRayCastVehicleControllerFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    current_vehicle_speed() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_current_vehicle_speed(this.__wbg_ptr);
      return ret;
    }
    chassis() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_chassis(this.__wbg_ptr);
      return ret;
    }
    index_up_axis() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_index_up_axis(this.__wbg_ptr);
      return ret >>> 0;
    }
    set_index_up_axis(axis) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_index_up_axis(this.__wbg_ptr, axis);
    }
    index_forward_axis() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_index_forward_axis(this.__wbg_ptr);
      return ret >>> 0;
    }
    set_index_forward_axis(axis) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_index_forward_axis(this.__wbg_ptr, axis);
    }
    add_wheel(chassis_connection_cs, direction_cs, axle_cs, suspension_rest_length, radius) {
      _assertClass(chassis_connection_cs, RawVector);
      _assertClass(direction_cs, RawVector);
      _assertClass(axle_cs, RawVector);
      wasm$1.rawdynamicraycastvehiclecontroller_add_wheel(this.__wbg_ptr, chassis_connection_cs.__wbg_ptr, direction_cs.__wbg_ptr, axle_cs.__wbg_ptr, suspension_rest_length, radius);
    }
    num_wheels() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_num_wheels(this.__wbg_ptr);
      return ret >>> 0;
    }
    update_vehicle(dt, bodies, colliders, queries, filter_flags, filter_groups, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(queries, RawQueryPipeline);
        wasm$1.rawdynamicraycastvehiclecontroller_update_vehicle(this.__wbg_ptr, dt, bodies.__wbg_ptr, colliders.__wbg_ptr, queries.__wbg_ptr, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, addBorrowedObject(filter_predicate));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    wheel_chassis_connection_point_cs(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    set_wheel_chassis_connection_point_cs(i, value) {
      _assertClass(value, RawVector);
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs(this.__wbg_ptr, i, value.__wbg_ptr);
    }
    wheel_suspension_rest_length(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_suspension_rest_length(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length(this.__wbg_ptr, i, value);
    }
    wheel_max_suspension_travel(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_max_suspension_travel(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel(this.__wbg_ptr, i, value);
    }
    wheel_radius(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_radius(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_radius(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_radius(this.__wbg_ptr, i, value);
    }
    wheel_suspension_stiffness(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_suspension_stiffness(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness(this.__wbg_ptr, i, value);
    }
    wheel_suspension_compression(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_suspension_compression(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_suspension_compression(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression(this.__wbg_ptr, i, value);
    }
    wheel_suspension_relaxation(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_suspension_relaxation(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation(this.__wbg_ptr, i, value);
    }
    wheel_max_suspension_force(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_max_suspension_force(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_max_suspension_force(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force(this.__wbg_ptr, i, value);
    }
    wheel_brake(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_brake(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_brake(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_brake(this.__wbg_ptr, i, value);
    }
    wheel_steering(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_steering(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_steering(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_steering(this.__wbg_ptr, i, value);
    }
    wheel_engine_force(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_engine_force(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_engine_force(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_engine_force(this.__wbg_ptr, i, value);
    }
    wheel_direction_cs(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_direction_cs(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    set_wheel_direction_cs(i, value) {
      _assertClass(value, RawVector);
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_direction_cs(this.__wbg_ptr, i, value.__wbg_ptr);
    }
    wheel_axle_cs(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_axle_cs(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    set_wheel_axle_cs(i, value) {
      _assertClass(value, RawVector);
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_axle_cs(this.__wbg_ptr, i, value.__wbg_ptr);
    }
    wheel_friction_slip(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_friction_slip(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_friction_slip(i, value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_friction_slip(this.__wbg_ptr, i, value);
    }
    wheel_side_friction_stiffness(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    set_wheel_side_friction_stiffness(i, stiffness) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness(this.__wbg_ptr, i, stiffness);
    }
    wheel_rotation(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_rotation(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    wheel_forward_impulse(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_forward_impulse(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    wheel_side_impulse(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_side_impulse(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    wheel_suspension_force(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_suspension_force(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    wheel_contact_normal_ws(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    wheel_contact_point_ws(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_contact_point_ws(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    wheel_suspension_length(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_suspension_length(this.__wbg_ptr, i);
      return ret === 4294967297 ? void 0 : ret;
    }
    wheel_hard_point_ws(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_hard_point_ws(this.__wbg_ptr, i);
      return ret === 0 ? void 0 : RawVector.__wrap(ret);
    }
    wheel_is_in_contact(i) {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_wheel_is_in_contact(this.__wbg_ptr, i);
      return ret !== 0;
    }
    wheel_ground_object(i) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        wasm$1.rawdynamicraycastvehiclecontroller_wheel_ground_object(retptr, this.__wbg_ptr, i);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
        return r0 === 0 ? void 0 : r2;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  const RawEventQueueFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_raweventqueue_free(ptr >>> 0, 1));
  class RawEventQueue {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawEventQueueFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_raweventqueue_free(ptr, 0);
    }
    constructor(autoDrain) {
      const ret = wasm$1.raweventqueue_new(autoDrain);
      this.__wbg_ptr = ret >>> 0;
      RawEventQueueFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    drainCollisionEvents(f) {
      try {
        wasm$1.raweventqueue_drainCollisionEvents(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    drainContactForceEvents(f) {
      try {
        wasm$1.raweventqueue_drainContactForceEvents(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    clear() {
      wasm$1.raweventqueue_clear(this.__wbg_ptr);
    }
  }
  const RawGenericJointFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawgenericjoint_free(ptr >>> 0, 1));
  class RawGenericJoint {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawGenericJoint.prototype);
      obj.__wbg_ptr = ptr;
      RawGenericJointFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawGenericJointFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawgenericjoint_free(ptr, 0);
    }
    static generic(anchor1, anchor2, axis, lockedAxes) {
      _assertClass(anchor1, RawVector);
      _assertClass(anchor2, RawVector);
      _assertClass(axis, RawVector);
      const ret = wasm$1.rawgenericjoint_generic(anchor1.__wbg_ptr, anchor2.__wbg_ptr, axis.__wbg_ptr, lockedAxes);
      return ret === 0 ? void 0 : RawGenericJoint.__wrap(ret);
    }
    static spring(rest_length, stiffness, damping, anchor1, anchor2) {
      _assertClass(anchor1, RawVector);
      _assertClass(anchor2, RawVector);
      const ret = wasm$1.rawgenericjoint_spring(rest_length, stiffness, damping, anchor1.__wbg_ptr, anchor2.__wbg_ptr);
      return RawGenericJoint.__wrap(ret);
    }
    static rope(length, anchor1, anchor2) {
      _assertClass(anchor1, RawVector);
      _assertClass(anchor2, RawVector);
      const ret = wasm$1.rawgenericjoint_rope(length, anchor1.__wbg_ptr, anchor2.__wbg_ptr);
      return RawGenericJoint.__wrap(ret);
    }
    static spherical(anchor1, anchor2) {
      _assertClass(anchor1, RawVector);
      _assertClass(anchor2, RawVector);
      const ret = wasm$1.rawgenericjoint_spherical(anchor1.__wbg_ptr, anchor2.__wbg_ptr);
      return RawGenericJoint.__wrap(ret);
    }
    static prismatic(anchor1, anchor2, axis, limitsEnabled, limitsMin, limitsMax) {
      _assertClass(anchor1, RawVector);
      _assertClass(anchor2, RawVector);
      _assertClass(axis, RawVector);
      const ret = wasm$1.rawgenericjoint_prismatic(anchor1.__wbg_ptr, anchor2.__wbg_ptr, axis.__wbg_ptr, limitsEnabled, limitsMin, limitsMax);
      return ret === 0 ? void 0 : RawGenericJoint.__wrap(ret);
    }
    static fixed(anchor1, axes1, anchor2, axes2) {
      _assertClass(anchor1, RawVector);
      _assertClass(axes1, RawRotation);
      _assertClass(anchor2, RawVector);
      _assertClass(axes2, RawRotation);
      const ret = wasm$1.rawgenericjoint_fixed(anchor1.__wbg_ptr, axes1.__wbg_ptr, anchor2.__wbg_ptr, axes2.__wbg_ptr);
      return RawGenericJoint.__wrap(ret);
    }
    static revolute(anchor1, anchor2, axis) {
      _assertClass(anchor1, RawVector);
      _assertClass(anchor2, RawVector);
      _assertClass(axis, RawVector);
      const ret = wasm$1.rawgenericjoint_revolute(anchor1.__wbg_ptr, anchor2.__wbg_ptr, axis.__wbg_ptr);
      return ret === 0 ? void 0 : RawGenericJoint.__wrap(ret);
    }
  }
  const RawImpulseJointSetFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawimpulsejointset_free(ptr >>> 0, 1));
  class RawImpulseJointSet {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawImpulseJointSet.prototype);
      obj.__wbg_ptr = ptr;
      RawImpulseJointSetFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawImpulseJointSetFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawimpulsejointset_free(ptr, 0);
    }
    jointType(handle) {
      const ret = wasm$1.rawimpulsejointset_jointType(this.__wbg_ptr, handle);
      return ret;
    }
    jointBodyHandle1(handle) {
      const ret = wasm$1.rawimpulsejointset_jointBodyHandle1(this.__wbg_ptr, handle);
      return ret;
    }
    jointBodyHandle2(handle) {
      const ret = wasm$1.rawimpulsejointset_jointBodyHandle2(this.__wbg_ptr, handle);
      return ret;
    }
    jointFrameX1(handle) {
      const ret = wasm$1.rawimpulsejointset_jointFrameX1(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    jointFrameX2(handle) {
      const ret = wasm$1.rawimpulsejointset_jointFrameX2(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    jointAnchor1(handle) {
      const ret = wasm$1.rawimpulsejointset_jointAnchor1(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    jointAnchor2(handle) {
      const ret = wasm$1.rawimpulsejointset_jointAnchor2(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    jointSetAnchor1(handle, newPos) {
      _assertClass(newPos, RawVector);
      wasm$1.rawimpulsejointset_jointSetAnchor1(this.__wbg_ptr, handle, newPos.__wbg_ptr);
    }
    jointSetAnchor2(handle, newPos) {
      _assertClass(newPos, RawVector);
      wasm$1.rawimpulsejointset_jointSetAnchor2(this.__wbg_ptr, handle, newPos.__wbg_ptr);
    }
    jointContactsEnabled(handle) {
      const ret = wasm$1.rawimpulsejointset_jointContactsEnabled(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    jointSetContactsEnabled(handle, enabled) {
      wasm$1.rawimpulsejointset_jointSetContactsEnabled(this.__wbg_ptr, handle, enabled);
    }
    jointLimitsEnabled(handle, axis) {
      const ret = wasm$1.rawimpulsejointset_jointLimitsEnabled(this.__wbg_ptr, handle, axis);
      return ret !== 0;
    }
    jointLimitsMin(handle, axis) {
      const ret = wasm$1.rawimpulsejointset_jointLimitsMin(this.__wbg_ptr, handle, axis);
      return ret;
    }
    jointLimitsMax(handle, axis) {
      const ret = wasm$1.rawimpulsejointset_jointLimitsMax(this.__wbg_ptr, handle, axis);
      return ret;
    }
    jointSetLimits(handle, axis, min, max) {
      wasm$1.rawimpulsejointset_jointSetLimits(this.__wbg_ptr, handle, axis, min, max);
    }
    jointConfigureMotorModel(handle, axis, model) {
      wasm$1.rawimpulsejointset_jointConfigureMotorModel(this.__wbg_ptr, handle, axis, model);
    }
    jointConfigureMotorVelocity(handle, axis, targetVel, factor) {
      wasm$1.rawimpulsejointset_jointConfigureMotorVelocity(this.__wbg_ptr, handle, axis, targetVel, factor);
    }
    jointConfigureMotorPosition(handle, axis, targetPos, stiffness, damping) {
      wasm$1.rawimpulsejointset_jointConfigureMotorPosition(this.__wbg_ptr, handle, axis, targetPos, stiffness, damping);
    }
    jointConfigureMotor(handle, axis, targetPos, targetVel, stiffness, damping) {
      wasm$1.rawimpulsejointset_jointConfigureMotor(this.__wbg_ptr, handle, axis, targetPos, targetVel, stiffness, damping);
    }
    constructor() {
      const ret = wasm$1.rawimpulsejointset_new();
      this.__wbg_ptr = ret >>> 0;
      RawImpulseJointSetFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    createJoint(params, parent1, parent2, wake_up) {
      _assertClass(params, RawGenericJoint);
      const ret = wasm$1.rawimpulsejointset_createJoint(this.__wbg_ptr, params.__wbg_ptr, parent1, parent2, wake_up);
      return ret;
    }
    remove(handle, wakeUp) {
      wasm$1.rawimpulsejointset_remove(this.__wbg_ptr, handle, wakeUp);
    }
    len() {
      const ret = wasm$1.rawimpulsejointset_len(this.__wbg_ptr);
      return ret >>> 0;
    }
    contains(handle) {
      const ret = wasm$1.rawimpulsejointset_contains(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    forEachJointHandle(f) {
      try {
        wasm$1.rawimpulsejointset_forEachJointHandle(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    forEachJointAttachedToRigidBody(body, f) {
      try {
        wasm$1.rawimpulsejointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, body, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
  }
  const RawIntegrationParametersFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawintegrationparameters_free(ptr >>> 0, 1));
  class RawIntegrationParameters {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawIntegrationParameters.prototype);
      obj.__wbg_ptr = ptr;
      RawIntegrationParametersFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawIntegrationParametersFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawintegrationparameters_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawintegrationparameters_new();
      this.__wbg_ptr = ret >>> 0;
      RawIntegrationParametersFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    get dt() {
      const ret = wasm$1.rawintegrationparameters_dt(this.__wbg_ptr);
      return ret;
    }
    get contact_erp() {
      const ret = wasm$1.rawintegrationparameters_contact_erp(this.__wbg_ptr);
      return ret;
    }
    get normalizedAllowedLinearError() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_current_vehicle_speed(this.__wbg_ptr);
      return ret;
    }
    get normalizedPredictionDistance() {
      const ret = wasm$1.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
      return ret;
    }
    get numSolverIterations() {
      const ret = wasm$1.rawintegrationparameters_numSolverIterations(this.__wbg_ptr);
      return ret >>> 0;
    }
    get numAdditionalFrictionIterations() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_index_up_axis(this.__wbg_ptr);
      return ret >>> 0;
    }
    get numInternalPgsIterations() {
      const ret = wasm$1.rawdynamicraycastvehiclecontroller_index_forward_axis(this.__wbg_ptr);
      return ret >>> 0;
    }
    get minIslandSize() {
      const ret = wasm$1.rawintegrationparameters_minIslandSize(this.__wbg_ptr);
      return ret >>> 0;
    }
    get maxCcdSubsteps() {
      const ret = wasm$1.rawintegrationparameters_maxCcdSubsteps(this.__wbg_ptr);
      return ret >>> 0;
    }
    get lengthUnit() {
      const ret = wasm$1.rawintegrationparameters_lengthUnit(this.__wbg_ptr);
      return ret;
    }
    set dt(value) {
      wasm$1.rawintegrationparameters_set_dt(this.__wbg_ptr, value);
    }
    set contact_natural_frequency(value) {
      wasm$1.rawintegrationparameters_set_contact_natural_frequency(this.__wbg_ptr, value);
    }
    set normalizedAllowedLinearError(value) {
      wasm$1.rawintegrationparameters_set_normalizedAllowedLinearError(this.__wbg_ptr, value);
    }
    set normalizedPredictionDistance(value) {
      wasm$1.rawintegrationparameters_set_normalizedPredictionDistance(this.__wbg_ptr, value);
    }
    set numSolverIterations(value) {
      wasm$1.rawintegrationparameters_set_numSolverIterations(this.__wbg_ptr, value);
    }
    set numAdditionalFrictionIterations(value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_index_up_axis(this.__wbg_ptr, value);
    }
    set numInternalPgsIterations(value) {
      wasm$1.rawdynamicraycastvehiclecontroller_set_index_forward_axis(this.__wbg_ptr, value);
    }
    set minIslandSize(value) {
      wasm$1.rawintegrationparameters_set_minIslandSize(this.__wbg_ptr, value);
    }
    set maxCcdSubsteps(value) {
      wasm$1.rawintegrationparameters_set_maxCcdSubsteps(this.__wbg_ptr, value);
    }
    set lengthUnit(value) {
      wasm$1.rawintegrationparameters_set_lengthUnit(this.__wbg_ptr, value);
    }
    switchToStandardPgsSolver() {
      wasm$1.rawintegrationparameters_switchToStandardPgsSolver(this.__wbg_ptr);
    }
    switchToSmallStepsPgsSolver() {
      wasm$1.rawintegrationparameters_switchToSmallStepsPgsSolver(this.__wbg_ptr);
    }
    switchToSmallStepsPgsSolverWithoutWarmstart() {
      wasm$1.rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart(this.__wbg_ptr);
    }
  }
  const RawIslandManagerFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawislandmanager_free(ptr >>> 0, 1));
  class RawIslandManager {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawIslandManager.prototype);
      obj.__wbg_ptr = ptr;
      RawIslandManagerFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawIslandManagerFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawislandmanager_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawislandmanager_new();
      this.__wbg_ptr = ret >>> 0;
      RawIslandManagerFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    forEachActiveRigidBodyHandle(f) {
      try {
        wasm$1.rawislandmanager_forEachActiveRigidBodyHandle(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
  }
  const RawKinematicCharacterControllerFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawkinematiccharactercontroller_free(ptr >>> 0, 1));
  class RawKinematicCharacterController {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawKinematicCharacterControllerFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawkinematiccharactercontroller_free(ptr, 0);
    }
    constructor(offset) {
      const ret = wasm$1.rawkinematiccharactercontroller_new(offset);
      this.__wbg_ptr = ret >>> 0;
      RawKinematicCharacterControllerFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    up() {
      const ret = wasm$1.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    setUp(vector) {
      _assertClass(vector, RawVector);
      wasm$1.rawkinematiccharactercontroller_setUp(this.__wbg_ptr, vector.__wbg_ptr);
    }
    normalNudgeFactor() {
      const ret = wasm$1.rawkinematiccharactercontroller_normalNudgeFactor(this.__wbg_ptr);
      return ret;
    }
    setNormalNudgeFactor(value) {
      wasm$1.rawkinematiccharactercontroller_setNormalNudgeFactor(this.__wbg_ptr, value);
    }
    offset() {
      const ret = wasm$1.rawintegrationparameters_dt(this.__wbg_ptr);
      return ret;
    }
    setOffset(value) {
      wasm$1.rawkinematiccharactercontroller_setOffset(this.__wbg_ptr, value);
    }
    slideEnabled() {
      const ret = wasm$1.rawkinematiccharactercontroller_slideEnabled(this.__wbg_ptr);
      return ret !== 0;
    }
    setSlideEnabled(enabled) {
      wasm$1.rawkinematiccharactercontroller_setSlideEnabled(this.__wbg_ptr, enabled);
    }
    autostepMaxHeight() {
      const ret = wasm$1.rawkinematiccharactercontroller_autostepMaxHeight(this.__wbg_ptr);
      return ret === 4294967297 ? void 0 : ret;
    }
    autostepMinWidth() {
      const ret = wasm$1.rawkinematiccharactercontroller_autostepMinWidth(this.__wbg_ptr);
      return ret === 4294967297 ? void 0 : ret;
    }
    autostepIncludesDynamicBodies() {
      const ret = wasm$1.rawkinematiccharactercontroller_autostepIncludesDynamicBodies(this.__wbg_ptr);
      return ret === 16777215 ? void 0 : ret !== 0;
    }
    autostepEnabled() {
      const ret = wasm$1.rawkinematiccharactercontroller_autostepEnabled(this.__wbg_ptr);
      return ret !== 0;
    }
    enableAutostep(maxHeight, minWidth, includeDynamicBodies) {
      wasm$1.rawkinematiccharactercontroller_enableAutostep(this.__wbg_ptr, maxHeight, minWidth, includeDynamicBodies);
    }
    disableAutostep() {
      wasm$1.rawkinematiccharactercontroller_disableAutostep(this.__wbg_ptr);
    }
    maxSlopeClimbAngle() {
      const ret = wasm$1.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
      return ret;
    }
    setMaxSlopeClimbAngle(angle) {
      wasm$1.rawkinematiccharactercontroller_setMaxSlopeClimbAngle(this.__wbg_ptr, angle);
    }
    minSlopeSlideAngle() {
      const ret = wasm$1.rawkinematiccharactercontroller_minSlopeSlideAngle(this.__wbg_ptr);
      return ret;
    }
    setMinSlopeSlideAngle(angle) {
      wasm$1.rawkinematiccharactercontroller_setMinSlopeSlideAngle(this.__wbg_ptr, angle);
    }
    snapToGroundDistance() {
      const ret = wasm$1.rawkinematiccharactercontroller_snapToGroundDistance(this.__wbg_ptr);
      return ret === 4294967297 ? void 0 : ret;
    }
    enableSnapToGround(distance) {
      wasm$1.rawkinematiccharactercontroller_enableSnapToGround(this.__wbg_ptr, distance);
    }
    disableSnapToGround() {
      wasm$1.rawkinematiccharactercontroller_disableSnapToGround(this.__wbg_ptr);
    }
    snapToGroundEnabled() {
      const ret = wasm$1.rawkinematiccharactercontroller_snapToGroundEnabled(this.__wbg_ptr);
      return ret !== 0;
    }
    computeColliderMovement(dt, bodies, colliders, queries, collider_handle, desired_translation_delta, apply_impulses_to_dynamic_bodies, character_mass, filter_flags, filter_groups, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(queries, RawQueryPipeline);
        _assertClass(desired_translation_delta, RawVector);
        wasm$1.rawkinematiccharactercontroller_computeColliderMovement(this.__wbg_ptr, dt, bodies.__wbg_ptr, colliders.__wbg_ptr, queries.__wbg_ptr, collider_handle, desired_translation_delta.__wbg_ptr, apply_impulses_to_dynamic_bodies, isLikeNone(character_mass) ? 4294967297 : Math.fround(character_mass), filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, addBorrowedObject(filter_predicate));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    computedMovement() {
      const ret = wasm$1.rawkinematiccharactercontroller_computedMovement(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    computedGrounded() {
      const ret = wasm$1.rawkinematiccharactercontroller_computedGrounded(this.__wbg_ptr);
      return ret !== 0;
    }
    numComputedCollisions() {
      const ret = wasm$1.rawkinematiccharactercontroller_numComputedCollisions(this.__wbg_ptr);
      return ret >>> 0;
    }
    computedCollision(i, collision) {
      _assertClass(collision, RawCharacterCollision);
      const ret = wasm$1.rawkinematiccharactercontroller_computedCollision(this.__wbg_ptr, i, collision.__wbg_ptr);
      return ret !== 0;
    }
  }
  const RawMultibodyJointSetFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawmultibodyjointset_free(ptr >>> 0, 1));
  class RawMultibodyJointSet {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawMultibodyJointSet.prototype);
      obj.__wbg_ptr = ptr;
      RawMultibodyJointSetFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawMultibodyJointSetFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawmultibodyjointset_free(ptr, 0);
    }
    jointType(handle) {
      const ret = wasm$1.rawmultibodyjointset_jointType(this.__wbg_ptr, handle);
      return ret;
    }
    jointFrameX1(handle) {
      const ret = wasm$1.rawmultibodyjointset_jointFrameX1(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    jointFrameX2(handle) {
      const ret = wasm$1.rawmultibodyjointset_jointFrameX2(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    jointAnchor1(handle) {
      const ret = wasm$1.rawmultibodyjointset_jointAnchor1(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    jointAnchor2(handle) {
      const ret = wasm$1.rawmultibodyjointset_jointAnchor2(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    jointContactsEnabled(handle) {
      const ret = wasm$1.rawmultibodyjointset_jointContactsEnabled(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    jointSetContactsEnabled(handle, enabled) {
      wasm$1.rawmultibodyjointset_jointSetContactsEnabled(this.__wbg_ptr, handle, enabled);
    }
    jointLimitsEnabled(handle, axis) {
      const ret = wasm$1.rawmultibodyjointset_jointLimitsEnabled(this.__wbg_ptr, handle, axis);
      return ret !== 0;
    }
    jointLimitsMin(handle, axis) {
      const ret = wasm$1.rawmultibodyjointset_jointLimitsMin(this.__wbg_ptr, handle, axis);
      return ret;
    }
    jointLimitsMax(handle, axis) {
      const ret = wasm$1.rawmultibodyjointset_jointLimitsMax(this.__wbg_ptr, handle, axis);
      return ret;
    }
    constructor() {
      const ret = wasm$1.rawmultibodyjointset_new();
      this.__wbg_ptr = ret >>> 0;
      RawMultibodyJointSetFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    createJoint(params, parent1, parent2, wakeUp) {
      _assertClass(params, RawGenericJoint);
      const ret = wasm$1.rawmultibodyjointset_createJoint(this.__wbg_ptr, params.__wbg_ptr, parent1, parent2, wakeUp);
      return ret;
    }
    remove(handle, wakeUp) {
      wasm$1.rawmultibodyjointset_remove(this.__wbg_ptr, handle, wakeUp);
    }
    contains(handle) {
      const ret = wasm$1.rawmultibodyjointset_contains(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    forEachJointHandle(f) {
      try {
        wasm$1.rawmultibodyjointset_forEachJointHandle(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    forEachJointAttachedToRigidBody(body, f) {
      try {
        wasm$1.rawmultibodyjointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, body, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
  }
  const RawNarrowPhaseFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawnarrowphase_free(ptr >>> 0, 1));
  class RawNarrowPhase {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawNarrowPhase.prototype);
      obj.__wbg_ptr = ptr;
      RawNarrowPhaseFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawNarrowPhaseFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawnarrowphase_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawnarrowphase_new();
      this.__wbg_ptr = ret >>> 0;
      RawNarrowPhaseFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    contact_pairs_with(handle1, f) {
      wasm$1.rawnarrowphase_contact_pairs_with(this.__wbg_ptr, handle1, addHeapObject(f));
    }
    contact_pair(handle1, handle2) {
      const ret = wasm$1.rawnarrowphase_contact_pair(this.__wbg_ptr, handle1, handle2);
      return ret === 0 ? void 0 : RawContactPair.__wrap(ret);
    }
    intersection_pairs_with(handle1, f) {
      wasm$1.rawnarrowphase_intersection_pairs_with(this.__wbg_ptr, handle1, addHeapObject(f));
    }
    intersection_pair(handle1, handle2) {
      const ret = wasm$1.rawnarrowphase_intersection_pair(this.__wbg_ptr, handle1, handle2);
      return ret !== 0;
    }
  }
  const RawPhysicsPipelineFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawphysicspipeline_free(ptr >>> 0, 1));
  class RawPhysicsPipeline {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawPhysicsPipelineFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawphysicspipeline_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawphysicspipeline_new();
      this.__wbg_ptr = ret >>> 0;
      RawPhysicsPipelineFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    step(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, joints, articulations, ccd_solver) {
      _assertClass(gravity, RawVector);
      _assertClass(integrationParameters, RawIntegrationParameters);
      _assertClass(islands, RawIslandManager);
      _assertClass(broadPhase, RawBroadPhase);
      _assertClass(narrowPhase, RawNarrowPhase);
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(colliders, RawColliderSet);
      _assertClass(joints, RawImpulseJointSet);
      _assertClass(articulations, RawMultibodyJointSet);
      _assertClass(ccd_solver, RawCCDSolver);
      wasm$1.rawphysicspipeline_step(this.__wbg_ptr, gravity.__wbg_ptr, integrationParameters.__wbg_ptr, islands.__wbg_ptr, broadPhase.__wbg_ptr, narrowPhase.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, joints.__wbg_ptr, articulations.__wbg_ptr, ccd_solver.__wbg_ptr);
    }
    stepWithEvents(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, joints, articulations, ccd_solver, eventQueue, hookObject, hookFilterContactPair, hookFilterIntersectionPair) {
      _assertClass(gravity, RawVector);
      _assertClass(integrationParameters, RawIntegrationParameters);
      _assertClass(islands, RawIslandManager);
      _assertClass(broadPhase, RawBroadPhase);
      _assertClass(narrowPhase, RawNarrowPhase);
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(colliders, RawColliderSet);
      _assertClass(joints, RawImpulseJointSet);
      _assertClass(articulations, RawMultibodyJointSet);
      _assertClass(ccd_solver, RawCCDSolver);
      _assertClass(eventQueue, RawEventQueue);
      wasm$1.rawphysicspipeline_stepWithEvents(this.__wbg_ptr, gravity.__wbg_ptr, integrationParameters.__wbg_ptr, islands.__wbg_ptr, broadPhase.__wbg_ptr, narrowPhase.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, joints.__wbg_ptr, articulations.__wbg_ptr, ccd_solver.__wbg_ptr, eventQueue.__wbg_ptr, addHeapObject(hookObject), addHeapObject(hookFilterContactPair), addHeapObject(hookFilterIntersectionPair));
    }
  }
  const RawPidControllerFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawpidcontroller_free(ptr >>> 0, 1));
  class RawPidController {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawPidControllerFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawpidcontroller_free(ptr, 0);
    }
    constructor(kp, ki, kd, axes_mask) {
      const ret = wasm$1.rawpidcontroller_new(kp, ki, kd, axes_mask);
      this.__wbg_ptr = ret >>> 0;
      RawPidControllerFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    set_kp(kp, axes) {
      wasm$1.rawpidcontroller_set_kp(this.__wbg_ptr, kp, axes);
    }
    set_ki(ki, axes) {
      wasm$1.rawpidcontroller_set_ki(this.__wbg_ptr, ki, axes);
    }
    set_kd(kd, axes) {
      wasm$1.rawpidcontroller_set_kd(this.__wbg_ptr, kd, axes);
    }
    set_axes_mask(axes_mask) {
      wasm$1.rawpidcontroller_set_axes_mask(this.__wbg_ptr, axes_mask);
    }
    reset_integrals() {
      wasm$1.rawpidcontroller_reset_integrals(this.__wbg_ptr);
    }
    apply_linear_correction(dt, bodies, rb_handle, target_translation, target_linvel) {
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(target_translation, RawVector);
      _assertClass(target_linvel, RawVector);
      wasm$1.rawpidcontroller_apply_linear_correction(this.__wbg_ptr, dt, bodies.__wbg_ptr, rb_handle, target_translation.__wbg_ptr, target_linvel.__wbg_ptr);
    }
    apply_angular_correction(dt, bodies, rb_handle, target_rotation, target_angvel) {
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(target_rotation, RawRotation);
      _assertClass(target_angvel, RawVector);
      wasm$1.rawpidcontroller_apply_angular_correction(this.__wbg_ptr, dt, bodies.__wbg_ptr, rb_handle, target_rotation.__wbg_ptr, target_angvel.__wbg_ptr);
    }
    linear_correction(dt, bodies, rb_handle, target_translation, target_linvel) {
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(target_translation, RawVector);
      _assertClass(target_linvel, RawVector);
      const ret = wasm$1.rawpidcontroller_linear_correction(this.__wbg_ptr, dt, bodies.__wbg_ptr, rb_handle, target_translation.__wbg_ptr, target_linvel.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    angular_correction(dt, bodies, rb_handle, target_rotation, target_angvel) {
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(target_rotation, RawRotation);
      _assertClass(target_angvel, RawVector);
      const ret = wasm$1.rawpidcontroller_angular_correction(this.__wbg_ptr, dt, bodies.__wbg_ptr, rb_handle, target_rotation.__wbg_ptr, target_angvel.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
  }
  const RawPointColliderProjectionFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawpointcolliderprojection_free(ptr >>> 0, 1));
  class RawPointColliderProjection {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawPointColliderProjection.prototype);
      obj.__wbg_ptr = ptr;
      RawPointColliderProjectionFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawPointColliderProjectionFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawpointcolliderprojection_free(ptr, 0);
    }
    colliderHandle() {
      const ret = wasm$1.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
      return ret;
    }
    point() {
      const ret = wasm$1.rawpointcolliderprojection_point(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    isInside() {
      const ret = wasm$1.rawpointcolliderprojection_isInside(this.__wbg_ptr);
      return ret !== 0;
    }
    featureType() {
      const ret = wasm$1.rawpointcolliderprojection_featureType(this.__wbg_ptr);
      return ret;
    }
    featureId() {
      const ret = wasm$1.rawpointcolliderprojection_featureId(this.__wbg_ptr);
      return ret === 4294967297 ? void 0 : ret;
    }
  }
  const RawPointProjectionFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawpointprojection_free(ptr >>> 0, 1));
  class RawPointProjection {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawPointProjection.prototype);
      obj.__wbg_ptr = ptr;
      RawPointProjectionFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawPointProjectionFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawpointprojection_free(ptr, 0);
    }
    point() {
      const ret = wasm$1.rawpointprojection_point(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    isInside() {
      const ret = wasm$1.rawpointprojection_isInside(this.__wbg_ptr);
      return ret !== 0;
    }
  }
  const RawQueryPipelineFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawquerypipeline_free(ptr >>> 0, 1));
  class RawQueryPipeline {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawQueryPipelineFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawquerypipeline_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawquerypipeline_new();
      this.__wbg_ptr = ret >>> 0;
      RawQueryPipelineFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    update(colliders) {
      _assertClass(colliders, RawColliderSet);
      wasm$1.rawquerypipeline_update(this.__wbg_ptr, colliders.__wbg_ptr);
    }
    castRay(bodies, colliders, rayOrig, rayDir, maxToi, solid, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = wasm$1.rawquerypipeline_castRay(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        return ret === 0 ? void 0 : RawRayColliderHit.__wrap(ret);
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    castRayAndGetNormal(bodies, colliders, rayOrig, rayDir, maxToi, solid, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        const ret = wasm$1.rawquerypipeline_castRayAndGetNormal(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        return ret === 0 ? void 0 : RawRayColliderIntersection.__wrap(ret);
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    intersectionsWithRay(bodies, colliders, rayOrig, rayDir, maxToi, solid, callback, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(rayOrig, RawVector);
        _assertClass(rayDir, RawVector);
        wasm$1.rawquerypipeline_intersectionsWithRay(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid, addBorrowedObject(callback), filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
      } finally {
        heap[stack_pointer++] = void 0;
        heap[stack_pointer++] = void 0;
      }
    }
    intersectionWithShape(bodies, colliders, shapePos, shapeRot, shape, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(shape, RawShape);
        wasm$1.rawquerypipeline_intersectionWithShape(retptr, this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, shape.__wbg_ptr, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
        return r0 === 0 ? void 0 : r2;
      } finally {
        wasm$1.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = void 0;
      }
    }
    projectPoint(bodies, colliders, point, solid, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(point, RawVector);
        const ret = wasm$1.rawquerypipeline_projectPoint(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, point.__wbg_ptr, solid, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        return ret === 0 ? void 0 : RawPointColliderProjection.__wrap(ret);
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    projectPointAndGetFeature(bodies, colliders, point, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(point, RawVector);
        const ret = wasm$1.rawquerypipeline_projectPointAndGetFeature(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, point.__wbg_ptr, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        return ret === 0 ? void 0 : RawPointColliderProjection.__wrap(ret);
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    intersectionsWithPoint(bodies, colliders, point, callback, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(point, RawVector);
        wasm$1.rawquerypipeline_intersectionsWithPoint(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, point.__wbg_ptr, addBorrowedObject(callback), filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
      } finally {
        heap[stack_pointer++] = void 0;
        heap[stack_pointer++] = void 0;
      }
    }
    castShape(bodies, colliders, shapePos, shapeRot, shapeVel, shape, target_distance, maxToi, stop_at_penetration, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(shapeVel, RawVector);
        _assertClass(shape, RawShape);
        const ret = wasm$1.rawquerypipeline_castShape(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, shapeVel.__wbg_ptr, shape.__wbg_ptr, target_distance, maxToi, stop_at_penetration, filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
        return ret === 0 ? void 0 : RawColliderShapeCastHit.__wrap(ret);
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    intersectionsWithShape(bodies, colliders, shapePos, shapeRot, shape, callback, filter_flags, filter_groups, filter_exclude_collider, filter_exclude_rigid_body, filter_predicate) {
      try {
        _assertClass(bodies, RawRigidBodySet);
        _assertClass(colliders, RawColliderSet);
        _assertClass(shapePos, RawVector);
        _assertClass(shapeRot, RawRotation);
        _assertClass(shape, RawShape);
        wasm$1.rawquerypipeline_intersectionsWithShape(this.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, shape.__wbg_ptr, addBorrowedObject(callback), filter_flags, isLikeNone(filter_groups) ? 4294967297 : filter_groups >>> 0, !isLikeNone(filter_exclude_collider), isLikeNone(filter_exclude_collider) ? 0 : filter_exclude_collider, !isLikeNone(filter_exclude_rigid_body), isLikeNone(filter_exclude_rigid_body) ? 0 : filter_exclude_rigid_body, addBorrowedObject(filter_predicate));
      } finally {
        heap[stack_pointer++] = void 0;
        heap[stack_pointer++] = void 0;
      }
    }
    collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, callback) {
      try {
        _assertClass(aabbCenter, RawVector);
        _assertClass(aabbHalfExtents, RawVector);
        wasm$1.rawquerypipeline_collidersWithAabbIntersectingAabb(this.__wbg_ptr, aabbCenter.__wbg_ptr, aabbHalfExtents.__wbg_ptr, addBorrowedObject(callback));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
  }
  const RawRayColliderHitFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawraycolliderhit_free(ptr >>> 0, 1));
  class RawRayColliderHit {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawRayColliderHit.prototype);
      obj.__wbg_ptr = ptr;
      RawRayColliderHitFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawRayColliderHitFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawraycolliderhit_free(ptr, 0);
    }
    colliderHandle() {
      const ret = wasm$1.rawcharactercollision_handle(this.__wbg_ptr);
      return ret;
    }
    timeOfImpact() {
      const ret = wasm$1.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
      return ret;
    }
  }
  const RawRayColliderIntersectionFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawraycolliderintersection_free(ptr >>> 0, 1));
  class RawRayColliderIntersection {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawRayColliderIntersection.prototype);
      obj.__wbg_ptr = ptr;
      RawRayColliderIntersectionFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawRayColliderIntersectionFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawraycolliderintersection_free(ptr, 0);
    }
    colliderHandle() {
      const ret = wasm$1.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
      return ret;
    }
    normal() {
      const ret = wasm$1.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    time_of_impact() {
      const ret = wasm$1.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
      return ret;
    }
    featureType() {
      const ret = wasm$1.rawpointcolliderprojection_featureType(this.__wbg_ptr);
      return ret;
    }
    featureId() {
      const ret = wasm$1.rawpointcolliderprojection_featureId(this.__wbg_ptr);
      return ret === 4294967297 ? void 0 : ret;
    }
  }
  const RawRayIntersectionFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawrayintersection_free(ptr >>> 0, 1));
  class RawRayIntersection {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawRayIntersection.prototype);
      obj.__wbg_ptr = ptr;
      RawRayIntersectionFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawRayIntersectionFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawrayintersection_free(ptr, 0);
    }
    normal() {
      const ret = wasm$1.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    time_of_impact() {
      const ret = wasm$1.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
      return ret;
    }
    featureType() {
      const ret = wasm$1.rawpointcolliderprojection_featureType(this.__wbg_ptr);
      return ret;
    }
    featureId() {
      const ret = wasm$1.rawpointcolliderprojection_featureId(this.__wbg_ptr);
      return ret === 4294967297 ? void 0 : ret;
    }
  }
  const RawRigidBodySetFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawrigidbodyset_free(ptr >>> 0, 1));
  class RawRigidBodySet {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawRigidBodySet.prototype);
      obj.__wbg_ptr = ptr;
      RawRigidBodySetFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawRigidBodySetFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawrigidbodyset_free(ptr, 0);
    }
    rbTranslation(handle) {
      const ret = wasm$1.rawrigidbodyset_rbTranslation(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbRotation(handle) {
      const ret = wasm$1.rawrigidbodyset_rbRotation(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    rbSleep(handle) {
      wasm$1.rawrigidbodyset_rbSleep(this.__wbg_ptr, handle);
    }
    rbIsSleeping(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsSleeping(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbIsMoving(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsMoving(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbNextTranslation(handle) {
      const ret = wasm$1.rawrigidbodyset_rbNextTranslation(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbNextRotation(handle) {
      const ret = wasm$1.rawrigidbodyset_rbNextRotation(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    rbSetTranslation(handle, x, y, z, wakeUp) {
      wasm$1.rawrigidbodyset_rbSetTranslation(this.__wbg_ptr, handle, x, y, z, wakeUp);
    }
    rbSetRotation(handle, x, y, z, w, wakeUp) {
      wasm$1.rawrigidbodyset_rbSetRotation(this.__wbg_ptr, handle, x, y, z, w, wakeUp);
    }
    rbSetLinvel(handle, linvel, wakeUp) {
      _assertClass(linvel, RawVector);
      wasm$1.rawrigidbodyset_rbSetLinvel(this.__wbg_ptr, handle, linvel.__wbg_ptr, wakeUp);
    }
    rbSetAngvel(handle, angvel, wakeUp) {
      _assertClass(angvel, RawVector);
      wasm$1.rawrigidbodyset_rbSetAngvel(this.__wbg_ptr, handle, angvel.__wbg_ptr, wakeUp);
    }
    rbSetNextKinematicTranslation(handle, x, y, z) {
      wasm$1.rawrigidbodyset_rbSetNextKinematicTranslation(this.__wbg_ptr, handle, x, y, z);
    }
    rbSetNextKinematicRotation(handle, x, y, z, w) {
      wasm$1.rawrigidbodyset_rbSetNextKinematicRotation(this.__wbg_ptr, handle, x, y, z, w);
    }
    rbRecomputeMassPropertiesFromColliders(handle, colliders) {
      _assertClass(colliders, RawColliderSet);
      wasm$1.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders(this.__wbg_ptr, handle, colliders.__wbg_ptr);
    }
    rbSetAdditionalMass(handle, mass, wake_up) {
      wasm$1.rawrigidbodyset_rbSetAdditionalMass(this.__wbg_ptr, handle, mass, wake_up);
    }
    rbSetAdditionalMassProperties(handle, mass, centerOfMass, principalAngularInertia, angularInertiaFrame, wake_up) {
      _assertClass(centerOfMass, RawVector);
      _assertClass(principalAngularInertia, RawVector);
      _assertClass(angularInertiaFrame, RawRotation);
      wasm$1.rawrigidbodyset_rbSetAdditionalMassProperties(this.__wbg_ptr, handle, mass, centerOfMass.__wbg_ptr, principalAngularInertia.__wbg_ptr, angularInertiaFrame.__wbg_ptr, wake_up);
    }
    rbLinvel(handle) {
      const ret = wasm$1.rawrigidbodyset_rbLinvel(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbAngvel(handle) {
      const ret = wasm$1.rawrigidbodyset_rbAngvel(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbVelocityAtPoint(handle, point) {
      _assertClass(point, RawVector);
      const ret = wasm$1.rawrigidbodyset_rbVelocityAtPoint(this.__wbg_ptr, handle, point.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    rbLockTranslations(handle, locked, wake_up) {
      wasm$1.rawrigidbodyset_rbLockTranslations(this.__wbg_ptr, handle, locked, wake_up);
    }
    rbSetEnabledTranslations(handle, allow_x, allow_y, allow_z, wake_up) {
      wasm$1.rawrigidbodyset_rbSetEnabledTranslations(this.__wbg_ptr, handle, allow_x, allow_y, allow_z, wake_up);
    }
    rbLockRotations(handle, locked, wake_up) {
      wasm$1.rawrigidbodyset_rbLockRotations(this.__wbg_ptr, handle, locked, wake_up);
    }
    rbSetEnabledRotations(handle, allow_x, allow_y, allow_z, wake_up) {
      wasm$1.rawrigidbodyset_rbSetEnabledRotations(this.__wbg_ptr, handle, allow_x, allow_y, allow_z, wake_up);
    }
    rbDominanceGroup(handle) {
      const ret = wasm$1.rawrigidbodyset_rbDominanceGroup(this.__wbg_ptr, handle);
      return ret;
    }
    rbSetDominanceGroup(handle, group) {
      wasm$1.rawrigidbodyset_rbSetDominanceGroup(this.__wbg_ptr, handle, group);
    }
    rbEnableCcd(handle, enabled) {
      wasm$1.rawrigidbodyset_rbEnableCcd(this.__wbg_ptr, handle, enabled);
    }
    rbSetSoftCcdPrediction(handle, prediction) {
      wasm$1.rawrigidbodyset_rbSetSoftCcdPrediction(this.__wbg_ptr, handle, prediction);
    }
    rbMass(handle) {
      const ret = wasm$1.rawrigidbodyset_rbMass(this.__wbg_ptr, handle);
      return ret;
    }
    rbInvMass(handle) {
      const ret = wasm$1.rawrigidbodyset_rbInvMass(this.__wbg_ptr, handle);
      return ret;
    }
    rbEffectiveInvMass(handle) {
      const ret = wasm$1.rawrigidbodyset_rbEffectiveInvMass(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbLocalCom(handle) {
      const ret = wasm$1.rawrigidbodyset_rbLocalCom(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbWorldCom(handle) {
      const ret = wasm$1.rawrigidbodyset_rbWorldCom(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbInvPrincipalInertiaSqrt(handle) {
      const ret = wasm$1.rawrigidbodyset_rbInvPrincipalInertiaSqrt(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbPrincipalInertiaLocalFrame(handle) {
      const ret = wasm$1.rawrigidbodyset_rbPrincipalInertiaLocalFrame(this.__wbg_ptr, handle);
      return RawRotation.__wrap(ret);
    }
    rbPrincipalInertia(handle) {
      const ret = wasm$1.rawrigidbodyset_rbPrincipalInertia(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbEffectiveWorldInvInertiaSqrt(handle) {
      const ret = wasm$1.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt(this.__wbg_ptr, handle);
      return RawSdpMatrix3.__wrap(ret);
    }
    rbEffectiveAngularInertia(handle) {
      const ret = wasm$1.rawrigidbodyset_rbEffectiveAngularInertia(this.__wbg_ptr, handle);
      return RawSdpMatrix3.__wrap(ret);
    }
    rbWakeUp(handle) {
      wasm$1.rawrigidbodyset_rbWakeUp(this.__wbg_ptr, handle);
    }
    rbIsCcdEnabled(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsCcdEnabled(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbSoftCcdPrediction(handle) {
      const ret = wasm$1.rawrigidbodyset_rbSoftCcdPrediction(this.__wbg_ptr, handle);
      return ret;
    }
    rbNumColliders(handle) {
      const ret = wasm$1.rawrigidbodyset_rbNumColliders(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    rbCollider(handle, at) {
      const ret = wasm$1.rawrigidbodyset_rbCollider(this.__wbg_ptr, handle, at);
      return ret;
    }
    rbBodyType(handle) {
      const ret = wasm$1.rawrigidbodyset_rbBodyType(this.__wbg_ptr, handle);
      return ret;
    }
    rbSetBodyType(handle, status, wake_up) {
      wasm$1.rawrigidbodyset_rbSetBodyType(this.__wbg_ptr, handle, status, wake_up);
    }
    rbIsFixed(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsFixed(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbIsKinematic(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsKinematic(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbIsDynamic(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsDynamic(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbLinearDamping(handle) {
      const ret = wasm$1.rawrigidbodyset_rbLinearDamping(this.__wbg_ptr, handle);
      return ret;
    }
    rbAngularDamping(handle) {
      const ret = wasm$1.rawrigidbodyset_rbAngularDamping(this.__wbg_ptr, handle);
      return ret;
    }
    rbSetLinearDamping(handle, factor) {
      wasm$1.rawrigidbodyset_rbSetLinearDamping(this.__wbg_ptr, handle, factor);
    }
    rbSetAngularDamping(handle, factor) {
      wasm$1.rawrigidbodyset_rbSetAngularDamping(this.__wbg_ptr, handle, factor);
    }
    rbSetEnabled(handle, enabled) {
      wasm$1.rawrigidbodyset_rbSetEnabled(this.__wbg_ptr, handle, enabled);
    }
    rbIsEnabled(handle) {
      const ret = wasm$1.rawrigidbodyset_rbIsEnabled(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    rbGravityScale(handle) {
      const ret = wasm$1.rawrigidbodyset_rbGravityScale(this.__wbg_ptr, handle);
      return ret;
    }
    rbSetGravityScale(handle, factor, wakeUp) {
      wasm$1.rawrigidbodyset_rbSetGravityScale(this.__wbg_ptr, handle, factor, wakeUp);
    }
    rbResetForces(handle, wakeUp) {
      wasm$1.rawrigidbodyset_rbResetForces(this.__wbg_ptr, handle, wakeUp);
    }
    rbResetTorques(handle, wakeUp) {
      wasm$1.rawrigidbodyset_rbResetTorques(this.__wbg_ptr, handle, wakeUp);
    }
    rbAddForce(handle, force, wakeUp) {
      _assertClass(force, RawVector);
      wasm$1.rawrigidbodyset_rbAddForce(this.__wbg_ptr, handle, force.__wbg_ptr, wakeUp);
    }
    rbApplyImpulse(handle, impulse, wakeUp) {
      _assertClass(impulse, RawVector);
      wasm$1.rawrigidbodyset_rbApplyImpulse(this.__wbg_ptr, handle, impulse.__wbg_ptr, wakeUp);
    }
    rbAddTorque(handle, torque, wakeUp) {
      _assertClass(torque, RawVector);
      wasm$1.rawrigidbodyset_rbAddTorque(this.__wbg_ptr, handle, torque.__wbg_ptr, wakeUp);
    }
    rbApplyTorqueImpulse(handle, torque_impulse, wakeUp) {
      _assertClass(torque_impulse, RawVector);
      wasm$1.rawrigidbodyset_rbApplyTorqueImpulse(this.__wbg_ptr, handle, torque_impulse.__wbg_ptr, wakeUp);
    }
    rbAddForceAtPoint(handle, force, point, wakeUp) {
      _assertClass(force, RawVector);
      _assertClass(point, RawVector);
      wasm$1.rawrigidbodyset_rbAddForceAtPoint(this.__wbg_ptr, handle, force.__wbg_ptr, point.__wbg_ptr, wakeUp);
    }
    rbApplyImpulseAtPoint(handle, impulse, point, wakeUp) {
      _assertClass(impulse, RawVector);
      _assertClass(point, RawVector);
      wasm$1.rawrigidbodyset_rbApplyImpulseAtPoint(this.__wbg_ptr, handle, impulse.__wbg_ptr, point.__wbg_ptr, wakeUp);
    }
    rbAdditionalSolverIterations(handle) {
      const ret = wasm$1.rawrigidbodyset_rbAdditionalSolverIterations(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    rbSetAdditionalSolverIterations(handle, iters) {
      wasm$1.rawrigidbodyset_rbSetAdditionalSolverIterations(this.__wbg_ptr, handle, iters);
    }
    rbUserData(handle) {
      const ret = wasm$1.rawrigidbodyset_rbUserData(this.__wbg_ptr, handle);
      return ret >>> 0;
    }
    rbSetUserData(handle, data) {
      wasm$1.rawrigidbodyset_rbSetUserData(this.__wbg_ptr, handle, data);
    }
    rbUserForce(handle) {
      const ret = wasm$1.rawrigidbodyset_rbUserForce(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    rbUserTorque(handle) {
      const ret = wasm$1.rawrigidbodyset_rbUserTorque(this.__wbg_ptr, handle);
      return RawVector.__wrap(ret);
    }
    constructor() {
      const ret = wasm$1.rawrigidbodyset_new();
      this.__wbg_ptr = ret >>> 0;
      RawRigidBodySetFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    createRigidBody(enabled, translation, rotation, gravityScale, mass, massOnly, centerOfMass, linvel, angvel, principalAngularInertia, angularInertiaFrame, translationEnabledX, translationEnabledY, translationEnabledZ, rotationEnabledX, rotationEnabledY, rotationEnabledZ, linearDamping, angularDamping, rb_type, canSleep, sleeping, softCcdPrediction, ccdEnabled, dominanceGroup, additional_solver_iterations) {
      _assertClass(translation, RawVector);
      _assertClass(rotation, RawRotation);
      _assertClass(centerOfMass, RawVector);
      _assertClass(linvel, RawVector);
      _assertClass(angvel, RawVector);
      _assertClass(principalAngularInertia, RawVector);
      _assertClass(angularInertiaFrame, RawRotation);
      const ret = wasm$1.rawrigidbodyset_createRigidBody(this.__wbg_ptr, enabled, translation.__wbg_ptr, rotation.__wbg_ptr, gravityScale, mass, massOnly, centerOfMass.__wbg_ptr, linvel.__wbg_ptr, angvel.__wbg_ptr, principalAngularInertia.__wbg_ptr, angularInertiaFrame.__wbg_ptr, translationEnabledX, translationEnabledY, translationEnabledZ, rotationEnabledX, rotationEnabledY, rotationEnabledZ, linearDamping, angularDamping, rb_type, canSleep, sleeping, softCcdPrediction, ccdEnabled, dominanceGroup, additional_solver_iterations);
      return ret;
    }
    remove(handle, islands, colliders, joints, articulations) {
      _assertClass(islands, RawIslandManager);
      _assertClass(colliders, RawColliderSet);
      _assertClass(joints, RawImpulseJointSet);
      _assertClass(articulations, RawMultibodyJointSet);
      wasm$1.rawrigidbodyset_remove(this.__wbg_ptr, handle, islands.__wbg_ptr, colliders.__wbg_ptr, joints.__wbg_ptr, articulations.__wbg_ptr);
    }
    len() {
      const ret = wasm$1.rawcolliderset_len(this.__wbg_ptr);
      return ret >>> 0;
    }
    contains(handle) {
      const ret = wasm$1.rawrigidbodyset_contains(this.__wbg_ptr, handle);
      return ret !== 0;
    }
    forEachRigidBodyHandle(f) {
      try {
        wasm$1.rawrigidbodyset_forEachRigidBodyHandle(this.__wbg_ptr, addBorrowedObject(f));
      } finally {
        heap[stack_pointer++] = void 0;
      }
    }
    propagateModifiedBodyPositionsToColliders(colliders) {
      _assertClass(colliders, RawColliderSet);
      wasm$1.rawrigidbodyset_propagateModifiedBodyPositionsToColliders(this.__wbg_ptr, colliders.__wbg_ptr);
    }
  }
  const RawRotationFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawrotation_free(ptr >>> 0, 1));
  class RawRotation {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawRotation.prototype);
      obj.__wbg_ptr = ptr;
      RawRotationFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawRotationFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawrotation_free(ptr, 0);
    }
    constructor(x, y, z, w) {
      const ret = wasm$1.rawrotation_new(x, y, z, w);
      this.__wbg_ptr = ret >>> 0;
      RawRotationFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    static identity() {
      const ret = wasm$1.rawrotation_identity();
      return RawRotation.__wrap(ret);
    }
    get x() {
      const ret = wasm$1.rawrotation_x(this.__wbg_ptr);
      return ret;
    }
    get y() {
      const ret = wasm$1.rawintegrationparameters_dt(this.__wbg_ptr);
      return ret;
    }
    get z() {
      const ret = wasm$1.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
      return ret;
    }
    get w() {
      const ret = wasm$1.rawrotation_w(this.__wbg_ptr);
      return ret;
    }
  }
  const RawSdpMatrix3Finalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawsdpmatrix3_free(ptr >>> 0, 1));
  class RawSdpMatrix3 {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawSdpMatrix3.prototype);
      obj.__wbg_ptr = ptr;
      RawSdpMatrix3Finalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawSdpMatrix3Finalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawsdpmatrix3_free(ptr, 0);
    }
    elements() {
      const ret = wasm$1.rawsdpmatrix3_elements(this.__wbg_ptr);
      return takeObject(ret);
    }
  }
  const RawSerializationPipelineFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawserializationpipeline_free(ptr >>> 0, 1));
  class RawSerializationPipeline {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawSerializationPipelineFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawserializationpipeline_free(ptr, 0);
    }
    constructor() {
      const ret = wasm$1.rawserializationpipeline_new();
      this.__wbg_ptr = ret >>> 0;
      RawSerializationPipelineFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    serializeAll(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, impulse_joints, multibody_joints) {
      _assertClass(gravity, RawVector);
      _assertClass(integrationParameters, RawIntegrationParameters);
      _assertClass(islands, RawIslandManager);
      _assertClass(broadPhase, RawBroadPhase);
      _assertClass(narrowPhase, RawNarrowPhase);
      _assertClass(bodies, RawRigidBodySet);
      _assertClass(colliders, RawColliderSet);
      _assertClass(impulse_joints, RawImpulseJointSet);
      _assertClass(multibody_joints, RawMultibodyJointSet);
      const ret = wasm$1.rawserializationpipeline_serializeAll(this.__wbg_ptr, gravity.__wbg_ptr, integrationParameters.__wbg_ptr, islands.__wbg_ptr, broadPhase.__wbg_ptr, narrowPhase.__wbg_ptr, bodies.__wbg_ptr, colliders.__wbg_ptr, impulse_joints.__wbg_ptr, multibody_joints.__wbg_ptr);
      return takeObject(ret);
    }
    deserializeAll(data) {
      const ret = wasm$1.rawserializationpipeline_deserializeAll(this.__wbg_ptr, addHeapObject(data));
      return ret === 0 ? void 0 : RawDeserializedWorld.__wrap(ret);
    }
  }
  const RawShapeFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawshape_free(ptr >>> 0, 1));
  class RawShape {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawShape.prototype);
      obj.__wbg_ptr = ptr;
      RawShapeFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawShapeFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawshape_free(ptr, 0);
    }
    static cuboid(hx, hy, hz) {
      const ret = wasm$1.rawshape_cuboid(hx, hy, hz);
      return RawShape.__wrap(ret);
    }
    static roundCuboid(hx, hy, hz, borderRadius) {
      const ret = wasm$1.rawshape_roundCuboid(hx, hy, hz, borderRadius);
      return RawShape.__wrap(ret);
    }
    static ball(radius) {
      const ret = wasm$1.rawshape_ball(radius);
      return RawShape.__wrap(ret);
    }
    static halfspace(normal) {
      _assertClass(normal, RawVector);
      const ret = wasm$1.rawshape_halfspace(normal.__wbg_ptr);
      return RawShape.__wrap(ret);
    }
    static capsule(halfHeight, radius) {
      const ret = wasm$1.rawshape_capsule(halfHeight, radius);
      return RawShape.__wrap(ret);
    }
    static cylinder(halfHeight, radius) {
      const ret = wasm$1.rawshape_cylinder(halfHeight, radius);
      return RawShape.__wrap(ret);
    }
    static roundCylinder(halfHeight, radius, borderRadius) {
      const ret = wasm$1.rawshape_roundCylinder(halfHeight, radius, borderRadius);
      return RawShape.__wrap(ret);
    }
    static cone(halfHeight, radius) {
      const ret = wasm$1.rawshape_cone(halfHeight, radius);
      return RawShape.__wrap(ret);
    }
    static roundCone(halfHeight, radius, borderRadius) {
      const ret = wasm$1.rawshape_roundCone(halfHeight, radius, borderRadius);
      return RawShape.__wrap(ret);
    }
    static voxels(voxel_size, grid_coords) {
      _assertClass(voxel_size, RawVector);
      const ptr0 = passArray32ToWasm0(grid_coords, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_voxels(voxel_size.__wbg_ptr, ptr0, len0);
      return RawShape.__wrap(ret);
    }
    static voxelsFromPoints(voxel_size, points) {
      _assertClass(voxel_size, RawVector);
      const ptr0 = passArrayF32ToWasm0(points, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_voxelsFromPoints(voxel_size.__wbg_ptr, ptr0, len0);
      return RawShape.__wrap(ret);
    }
    static polyline(vertices, indices) {
      const ptr0 = passArrayF32ToWasm0(vertices, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray32ToWasm0(indices, wasm$1.__wbindgen_export_2);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_polyline(ptr0, len0, ptr1, len1);
      return RawShape.__wrap(ret);
    }
    static trimesh(vertices, indices, flags) {
      const ptr0 = passArrayF32ToWasm0(vertices, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray32ToWasm0(indices, wasm$1.__wbindgen_export_2);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_trimesh(ptr0, len0, ptr1, len1, flags);
      return ret === 0 ? void 0 : RawShape.__wrap(ret);
    }
    static heightfield(nrows, ncols, heights, scale, flags) {
      const ptr0 = passArrayF32ToWasm0(heights, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      _assertClass(scale, RawVector);
      const ret = wasm$1.rawshape_heightfield(nrows, ncols, ptr0, len0, scale.__wbg_ptr, flags);
      return RawShape.__wrap(ret);
    }
    static segment(p1, p2) {
      _assertClass(p1, RawVector);
      _assertClass(p2, RawVector);
      const ret = wasm$1.rawshape_segment(p1.__wbg_ptr, p2.__wbg_ptr);
      return RawShape.__wrap(ret);
    }
    static triangle(p1, p2, p3) {
      _assertClass(p1, RawVector);
      _assertClass(p2, RawVector);
      _assertClass(p3, RawVector);
      const ret = wasm$1.rawshape_triangle(p1.__wbg_ptr, p2.__wbg_ptr, p3.__wbg_ptr);
      return RawShape.__wrap(ret);
    }
    static roundTriangle(p1, p2, p3, borderRadius) {
      _assertClass(p1, RawVector);
      _assertClass(p2, RawVector);
      _assertClass(p3, RawVector);
      const ret = wasm$1.rawshape_roundTriangle(p1.__wbg_ptr, p2.__wbg_ptr, p3.__wbg_ptr, borderRadius);
      return RawShape.__wrap(ret);
    }
    static convexHull(points) {
      const ptr0 = passArrayF32ToWasm0(points, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_convexHull(ptr0, len0);
      return ret === 0 ? void 0 : RawShape.__wrap(ret);
    }
    static roundConvexHull(points, borderRadius) {
      const ptr0 = passArrayF32ToWasm0(points, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_roundConvexHull(ptr0, len0, borderRadius);
      return ret === 0 ? void 0 : RawShape.__wrap(ret);
    }
    static convexMesh(vertices, indices) {
      const ptr0 = passArrayF32ToWasm0(vertices, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray32ToWasm0(indices, wasm$1.__wbindgen_export_2);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_convexMesh(ptr0, len0, ptr1, len1);
      return ret === 0 ? void 0 : RawShape.__wrap(ret);
    }
    static roundConvexMesh(vertices, indices, borderRadius) {
      const ptr0 = passArrayF32ToWasm0(vertices, wasm$1.__wbindgen_export_2);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray32ToWasm0(indices, wasm$1.__wbindgen_export_2);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm$1.rawshape_roundConvexMesh(ptr0, len0, ptr1, len1, borderRadius);
      return ret === 0 ? void 0 : RawShape.__wrap(ret);
    }
    castShape(shapePos1, shapeRot1, shapeVel1, shape2, shapePos2, shapeRot2, shapeVel2, target_distance, maxToi, stop_at_penetration) {
      _assertClass(shapePos1, RawVector);
      _assertClass(shapeRot1, RawRotation);
      _assertClass(shapeVel1, RawVector);
      _assertClass(shape2, RawShape);
      _assertClass(shapePos2, RawVector);
      _assertClass(shapeRot2, RawRotation);
      _assertClass(shapeVel2, RawVector);
      const ret = wasm$1.rawshape_castShape(this.__wbg_ptr, shapePos1.__wbg_ptr, shapeRot1.__wbg_ptr, shapeVel1.__wbg_ptr, shape2.__wbg_ptr, shapePos2.__wbg_ptr, shapeRot2.__wbg_ptr, shapeVel2.__wbg_ptr, target_distance, maxToi, stop_at_penetration);
      return ret === 0 ? void 0 : RawShapeCastHit.__wrap(ret);
    }
    intersectsShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2) {
      _assertClass(shapePos1, RawVector);
      _assertClass(shapeRot1, RawRotation);
      _assertClass(shape2, RawShape);
      _assertClass(shapePos2, RawVector);
      _assertClass(shapeRot2, RawRotation);
      const ret = wasm$1.rawshape_intersectsShape(this.__wbg_ptr, shapePos1.__wbg_ptr, shapeRot1.__wbg_ptr, shape2.__wbg_ptr, shapePos2.__wbg_ptr, shapeRot2.__wbg_ptr);
      return ret !== 0;
    }
    contactShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2, prediction) {
      _assertClass(shapePos1, RawVector);
      _assertClass(shapeRot1, RawRotation);
      _assertClass(shape2, RawShape);
      _assertClass(shapePos2, RawVector);
      _assertClass(shapeRot2, RawRotation);
      const ret = wasm$1.rawshape_contactShape(this.__wbg_ptr, shapePos1.__wbg_ptr, shapeRot1.__wbg_ptr, shape2.__wbg_ptr, shapePos2.__wbg_ptr, shapeRot2.__wbg_ptr, prediction);
      return ret === 0 ? void 0 : RawShapeContact.__wrap(ret);
    }
    containsPoint(shapePos, shapeRot, point) {
      _assertClass(shapePos, RawVector);
      _assertClass(shapeRot, RawRotation);
      _assertClass(point, RawVector);
      const ret = wasm$1.rawshape_containsPoint(this.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, point.__wbg_ptr);
      return ret !== 0;
    }
    projectPoint(shapePos, shapeRot, point, solid) {
      _assertClass(shapePos, RawVector);
      _assertClass(shapeRot, RawRotation);
      _assertClass(point, RawVector);
      const ret = wasm$1.rawshape_projectPoint(this.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, point.__wbg_ptr, solid);
      return RawPointProjection.__wrap(ret);
    }
    intersectsRay(shapePos, shapeRot, rayOrig, rayDir, maxToi) {
      _assertClass(shapePos, RawVector);
      _assertClass(shapeRot, RawRotation);
      _assertClass(rayOrig, RawVector);
      _assertClass(rayDir, RawVector);
      const ret = wasm$1.rawshape_intersectsRay(this.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi);
      return ret !== 0;
    }
    castRay(shapePos, shapeRot, rayOrig, rayDir, maxToi, solid) {
      _assertClass(shapePos, RawVector);
      _assertClass(shapeRot, RawRotation);
      _assertClass(rayOrig, RawVector);
      _assertClass(rayDir, RawVector);
      const ret = wasm$1.rawshape_castRay(this.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid);
      return ret;
    }
    castRayAndGetNormal(shapePos, shapeRot, rayOrig, rayDir, maxToi, solid) {
      _assertClass(shapePos, RawVector);
      _assertClass(shapeRot, RawRotation);
      _assertClass(rayOrig, RawVector);
      _assertClass(rayDir, RawVector);
      const ret = wasm$1.rawshape_castRayAndGetNormal(this.__wbg_ptr, shapePos.__wbg_ptr, shapeRot.__wbg_ptr, rayOrig.__wbg_ptr, rayDir.__wbg_ptr, maxToi, solid);
      return ret === 0 ? void 0 : RawRayIntersection.__wrap(ret);
    }
  }
  const RawShapeCastHitFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawshapecasthit_free(ptr >>> 0, 1));
  class RawShapeCastHit {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawShapeCastHit.prototype);
      obj.__wbg_ptr = ptr;
      RawShapeCastHitFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawShapeCastHitFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawshapecasthit_free(ptr, 0);
    }
    time_of_impact() {
      const ret = wasm$1.rawrotation_x(this.__wbg_ptr);
      return ret;
    }
    witness1() {
      const ret = wasm$1.rawshapecasthit_witness1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    witness2() {
      const ret = wasm$1.rawcontactforceevent_total_force(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    normal1() {
      const ret = wasm$1.rawshapecasthit_normal1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    normal2() {
      const ret = wasm$1.rawshapecasthit_normal2(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
  }
  const RawShapeContactFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawshapecontact_free(ptr >>> 0, 1));
  class RawShapeContact {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawShapeContact.prototype);
      obj.__wbg_ptr = ptr;
      RawShapeContactFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawShapeContactFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawshapecontact_free(ptr, 0);
    }
    distance() {
      const ret = wasm$1.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
      return ret;
    }
    point1() {
      const ret = wasm$1.rawpointprojection_point(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    point2() {
      const ret = wasm$1.rawcollidershapecasthit_witness1(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    normal1() {
      const ret = wasm$1.rawcollidershapecasthit_witness2(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    normal2() {
      const ret = wasm$1.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
  }
  const RawVectorFinalization = typeof FinalizationRegistry === "undefined" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((ptr) => wasm$1.__wbg_rawvector_free(ptr >>> 0, 1));
  class RawVector {
    static __wrap(ptr) {
      ptr = ptr >>> 0;
      const obj = Object.create(RawVector.prototype);
      obj.__wbg_ptr = ptr;
      RawVectorFinalization.register(obj, obj.__wbg_ptr, obj);
      return obj;
    }
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      RawVectorFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm$1.__wbg_rawvector_free(ptr, 0);
    }
    static zero() {
      const ret = wasm$1.rawvector_zero();
      return RawVector.__wrap(ret);
    }
    constructor(x, y, z) {
      const ret = wasm$1.rawvector_new(x, y, z);
      this.__wbg_ptr = ret >>> 0;
      RawVectorFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    get x() {
      const ret = wasm$1.rawrotation_x(this.__wbg_ptr);
      return ret;
    }
    set x(x) {
      wasm$1.rawvector_set_x(this.__wbg_ptr, x);
    }
    get y() {
      const ret = wasm$1.rawintegrationparameters_dt(this.__wbg_ptr);
      return ret;
    }
    set y(y) {
      wasm$1.rawintegrationparameters_set_dt(this.__wbg_ptr, y);
    }
    get z() {
      const ret = wasm$1.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
      return ret;
    }
    set z(z) {
      wasm$1.rawvector_set_z(this.__wbg_ptr, z);
    }
    xyz() {
      const ret = wasm$1.rawvector_xyz(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    yxz() {
      const ret = wasm$1.rawvector_yxz(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    zxy() {
      const ret = wasm$1.rawvector_zxy(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    xzy() {
      const ret = wasm$1.rawvector_xzy(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    yzx() {
      const ret = wasm$1.rawvector_yzx(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
    zyx() {
      const ret = wasm$1.rawvector_zyx(this.__wbg_ptr);
      return RawVector.__wrap(ret);
    }
  }
  function __wbg_bind_c8359b1cba058168(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).bind(getObject(arg1), getObject(arg2), getObject(arg3));
    return addHeapObject(ret);
  }
  function __wbg_buffer_609cc3eee51ed158(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  }
  function __wbg_call_7cccdd69e0791ae2() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
      return addHeapObject(ret);
    }, arguments);
  }
  function __wbg_call_833bed5770ea2041() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
      return addHeapObject(ret);
    }, arguments);
  }
  function __wbg_call_b8adc8b1d0a0d8eb() {
    return handleError(function(arg0, arg1, arg2, arg3, arg4) {
      const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3), getObject(arg4));
      return addHeapObject(ret);
    }, arguments);
  }
  function __wbg_length_3b4f022188ae8db6(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  }
  function __wbg_length_a446193dc22c12f8(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  }
  function __wbg_new_a12002a7f91c75be(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  }
  function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  }
  function __wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354(arg0, arg1, arg2) {
    const ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  }
  function __wbg_newwithlength_5a5efe313cfd59f1(arg0) {
    const ret = new Float32Array(arg0 >>> 0);
    return addHeapObject(ret);
  }
  function __wbg_rawcontactforceevent_new(arg0) {
    const ret = RawContactForceEvent.__wrap(arg0);
    return addHeapObject(ret);
  }
  function __wbg_rawraycolliderintersection_new(arg0) {
    const ret = RawRayColliderIntersection.__wrap(arg0);
    return addHeapObject(ret);
  }
  function __wbg_set_10bad9bee0e9c58b(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  }
  function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  }
  function __wbindgen_boolean_get(arg0) {
    const v = getObject(arg0);
    const ret = typeof v === "boolean" ? v ? 1 : 0 : 2;
    return ret;
  }
  function __wbindgen_is_function(arg0) {
    const ret = typeof getObject(arg0) === "function";
    return ret;
  }
  function __wbindgen_memory() {
    const ret = wasm$1.memory;
    return addHeapObject(ret);
  }
  function __wbindgen_number_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof obj === "number" ? obj : void 0;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
  }
  function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
  }
  function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
  }
  function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  }
  URL = globalThis.URL;
  const __vite__wasmModule = await __vite__initWasm({
    "./rapier_wasm3d_bg.js": {
      "__wbindgen_number_new": __wbindgen_number_new,
      "__wbindgen_boolean_get": __wbindgen_boolean_get,
      "__wbindgen_object_drop_ref": __wbindgen_object_drop_ref,
      "__wbindgen_number_get": __wbindgen_number_get,
      "__wbindgen_is_function": __wbindgen_is_function,
      "__wbg_rawraycolliderintersection_new": __wbg_rawraycolliderintersection_new,
      "__wbg_rawcontactforceevent_new": __wbg_rawcontactforceevent_new,
      "__wbg_call_7cccdd69e0791ae2": __wbg_call_7cccdd69e0791ae2,
      "__wbg_call_833bed5770ea2041": __wbg_call_833bed5770ea2041,
      "__wbg_call_b8adc8b1d0a0d8eb": __wbg_call_b8adc8b1d0a0d8eb,
      "__wbg_bind_c8359b1cba058168": __wbg_bind_c8359b1cba058168,
      "__wbg_buffer_609cc3eee51ed158": __wbg_buffer_609cc3eee51ed158,
      "__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a": __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a,
      "__wbg_new_a12002a7f91c75be": __wbg_new_a12002a7f91c75be,
      "__wbg_set_65595bdd868b3009": __wbg_set_65595bdd868b3009,
      "__wbg_length_a446193dc22c12f8": __wbg_length_a446193dc22c12f8,
      "__wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354": __wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354,
      "__wbg_set_10bad9bee0e9c58b": __wbg_set_10bad9bee0e9c58b,
      "__wbg_length_3b4f022188ae8db6": __wbg_length_3b4f022188ae8db6,
      "__wbg_newwithlength_5a5efe313cfd59f1": __wbg_newwithlength_5a5efe313cfd59f1,
      "__wbindgen_throw": __wbindgen_throw,
      "__wbindgen_memory": __wbindgen_memory
    }
  }, __vite__wasmUrl);
  const memory = __vite__wasmModule.memory;
  const version$1 = __vite__wasmModule.version;
  const __wbg_rawkinematiccharactercontroller_free = __vite__wasmModule.__wbg_rawkinematiccharactercontroller_free;
  const rawkinematiccharactercontroller_new = __vite__wasmModule.rawkinematiccharactercontroller_new;
  const rawkinematiccharactercontroller_setUp = __vite__wasmModule.rawkinematiccharactercontroller_setUp;
  const rawkinematiccharactercontroller_normalNudgeFactor = __vite__wasmModule.rawkinematiccharactercontroller_normalNudgeFactor;
  const rawkinematiccharactercontroller_setNormalNudgeFactor = __vite__wasmModule.rawkinematiccharactercontroller_setNormalNudgeFactor;
  const rawkinematiccharactercontroller_setOffset = __vite__wasmModule.rawkinematiccharactercontroller_setOffset;
  const rawkinematiccharactercontroller_slideEnabled = __vite__wasmModule.rawkinematiccharactercontroller_slideEnabled;
  const rawkinematiccharactercontroller_setSlideEnabled = __vite__wasmModule.rawkinematiccharactercontroller_setSlideEnabled;
  const rawkinematiccharactercontroller_autostepMaxHeight = __vite__wasmModule.rawkinematiccharactercontroller_autostepMaxHeight;
  const rawkinematiccharactercontroller_autostepMinWidth = __vite__wasmModule.rawkinematiccharactercontroller_autostepMinWidth;
  const rawkinematiccharactercontroller_autostepIncludesDynamicBodies = __vite__wasmModule.rawkinematiccharactercontroller_autostepIncludesDynamicBodies;
  const rawkinematiccharactercontroller_autostepEnabled = __vite__wasmModule.rawkinematiccharactercontroller_autostepEnabled;
  const rawkinematiccharactercontroller_enableAutostep = __vite__wasmModule.rawkinematiccharactercontroller_enableAutostep;
  const rawkinematiccharactercontroller_disableAutostep = __vite__wasmModule.rawkinematiccharactercontroller_disableAutostep;
  const rawkinematiccharactercontroller_maxSlopeClimbAngle = __vite__wasmModule.rawkinematiccharactercontroller_maxSlopeClimbAngle;
  const rawkinematiccharactercontroller_setMaxSlopeClimbAngle = __vite__wasmModule.rawkinematiccharactercontroller_setMaxSlopeClimbAngle;
  const rawkinematiccharactercontroller_minSlopeSlideAngle = __vite__wasmModule.rawkinematiccharactercontroller_minSlopeSlideAngle;
  const rawkinematiccharactercontroller_setMinSlopeSlideAngle = __vite__wasmModule.rawkinematiccharactercontroller_setMinSlopeSlideAngle;
  const rawkinematiccharactercontroller_snapToGroundDistance = __vite__wasmModule.rawkinematiccharactercontroller_snapToGroundDistance;
  const rawkinematiccharactercontroller_enableSnapToGround = __vite__wasmModule.rawkinematiccharactercontroller_enableSnapToGround;
  const rawkinematiccharactercontroller_disableSnapToGround = __vite__wasmModule.rawkinematiccharactercontroller_disableSnapToGround;
  const rawkinematiccharactercontroller_snapToGroundEnabled = __vite__wasmModule.rawkinematiccharactercontroller_snapToGroundEnabled;
  const rawkinematiccharactercontroller_computeColliderMovement = __vite__wasmModule.rawkinematiccharactercontroller_computeColliderMovement;
  const rawkinematiccharactercontroller_computedMovement = __vite__wasmModule.rawkinematiccharactercontroller_computedMovement;
  const rawkinematiccharactercontroller_computedGrounded = __vite__wasmModule.rawkinematiccharactercontroller_computedGrounded;
  const rawkinematiccharactercontroller_numComputedCollisions = __vite__wasmModule.rawkinematiccharactercontroller_numComputedCollisions;
  const rawkinematiccharactercontroller_computedCollision = __vite__wasmModule.rawkinematiccharactercontroller_computedCollision;
  const __wbg_rawcharactercollision_free = __vite__wasmModule.__wbg_rawcharactercollision_free;
  const rawcharactercollision_new = __vite__wasmModule.rawcharactercollision_new;
  const rawcharactercollision_handle = __vite__wasmModule.rawcharactercollision_handle;
  const rawcharactercollision_translationDeltaApplied = __vite__wasmModule.rawcharactercollision_translationDeltaApplied;
  const rawcharactercollision_translationDeltaRemaining = __vite__wasmModule.rawcharactercollision_translationDeltaRemaining;
  const rawcharactercollision_toi = __vite__wasmModule.rawcharactercollision_toi;
  const rawcharactercollision_worldWitness1 = __vite__wasmModule.rawcharactercollision_worldWitness1;
  const rawcharactercollision_worldWitness2 = __vite__wasmModule.rawcharactercollision_worldWitness2;
  const rawcharactercollision_worldNormal1 = __vite__wasmModule.rawcharactercollision_worldNormal1;
  const rawcharactercollision_worldNormal2 = __vite__wasmModule.rawcharactercollision_worldNormal2;
  const __wbg_rawpidcontroller_free = __vite__wasmModule.__wbg_rawpidcontroller_free;
  const rawpidcontroller_new = __vite__wasmModule.rawpidcontroller_new;
  const rawpidcontroller_set_kp = __vite__wasmModule.rawpidcontroller_set_kp;
  const rawpidcontroller_set_ki = __vite__wasmModule.rawpidcontroller_set_ki;
  const rawpidcontroller_set_kd = __vite__wasmModule.rawpidcontroller_set_kd;
  const rawpidcontroller_set_axes_mask = __vite__wasmModule.rawpidcontroller_set_axes_mask;
  const rawpidcontroller_reset_integrals = __vite__wasmModule.rawpidcontroller_reset_integrals;
  const rawpidcontroller_apply_linear_correction = __vite__wasmModule.rawpidcontroller_apply_linear_correction;
  const rawpidcontroller_apply_angular_correction = __vite__wasmModule.rawpidcontroller_apply_angular_correction;
  const rawpidcontroller_linear_correction = __vite__wasmModule.rawpidcontroller_linear_correction;
  const rawpidcontroller_angular_correction = __vite__wasmModule.rawpidcontroller_angular_correction;
  const __wbg_rawdynamicraycastvehiclecontroller_free = __vite__wasmModule.__wbg_rawdynamicraycastvehiclecontroller_free;
  const rawdynamicraycastvehiclecontroller_new = __vite__wasmModule.rawdynamicraycastvehiclecontroller_new;
  const rawdynamicraycastvehiclecontroller_current_vehicle_speed = __vite__wasmModule.rawdynamicraycastvehiclecontroller_current_vehicle_speed;
  const rawdynamicraycastvehiclecontroller_chassis = __vite__wasmModule.rawdynamicraycastvehiclecontroller_chassis;
  const rawdynamicraycastvehiclecontroller_index_up_axis = __vite__wasmModule.rawdynamicraycastvehiclecontroller_index_up_axis;
  const rawdynamicraycastvehiclecontroller_set_index_up_axis = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_index_up_axis;
  const rawdynamicraycastvehiclecontroller_index_forward_axis = __vite__wasmModule.rawdynamicraycastvehiclecontroller_index_forward_axis;
  const rawdynamicraycastvehiclecontroller_set_index_forward_axis = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_index_forward_axis;
  const rawdynamicraycastvehiclecontroller_add_wheel = __vite__wasmModule.rawdynamicraycastvehiclecontroller_add_wheel;
  const rawdynamicraycastvehiclecontroller_num_wheels = __vite__wasmModule.rawdynamicraycastvehiclecontroller_num_wheels;
  const rawdynamicraycastvehiclecontroller_update_vehicle = __vite__wasmModule.rawdynamicraycastvehiclecontroller_update_vehicle;
  const rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs;
  const rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs;
  const rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length;
  const rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length;
  const rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel;
  const rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel;
  const rawdynamicraycastvehiclecontroller_wheel_radius = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_radius;
  const rawdynamicraycastvehiclecontroller_set_wheel_radius = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_radius;
  const rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness;
  const rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness;
  const rawdynamicraycastvehiclecontroller_wheel_suspension_compression = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_suspension_compression;
  const rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression;
  const rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation;
  const rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation;
  const rawdynamicraycastvehiclecontroller_wheel_max_suspension_force = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_max_suspension_force;
  const rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force;
  const rawdynamicraycastvehiclecontroller_wheel_brake = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_brake;
  const rawdynamicraycastvehiclecontroller_set_wheel_brake = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_brake;
  const rawdynamicraycastvehiclecontroller_wheel_steering = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_steering;
  const rawdynamicraycastvehiclecontroller_set_wheel_steering = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_steering;
  const rawdynamicraycastvehiclecontroller_wheel_engine_force = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_engine_force;
  const rawdynamicraycastvehiclecontroller_set_wheel_engine_force = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_engine_force;
  const rawdynamicraycastvehiclecontroller_wheel_direction_cs = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_direction_cs;
  const rawdynamicraycastvehiclecontroller_set_wheel_direction_cs = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_direction_cs;
  const rawdynamicraycastvehiclecontroller_wheel_axle_cs = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_axle_cs;
  const rawdynamicraycastvehiclecontroller_set_wheel_axle_cs = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_axle_cs;
  const rawdynamicraycastvehiclecontroller_wheel_friction_slip = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_friction_slip;
  const rawdynamicraycastvehiclecontroller_set_wheel_friction_slip = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_friction_slip;
  const rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness;
  const rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness = __vite__wasmModule.rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness;
  const rawdynamicraycastvehiclecontroller_wheel_rotation = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_rotation;
  const rawdynamicraycastvehiclecontroller_wheel_forward_impulse = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_forward_impulse;
  const rawdynamicraycastvehiclecontroller_wheel_side_impulse = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_side_impulse;
  const rawdynamicraycastvehiclecontroller_wheel_suspension_force = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_suspension_force;
  const rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws;
  const rawdynamicraycastvehiclecontroller_wheel_contact_point_ws = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_contact_point_ws;
  const rawdynamicraycastvehiclecontroller_wheel_suspension_length = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_suspension_length;
  const rawdynamicraycastvehiclecontroller_wheel_hard_point_ws = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_hard_point_ws;
  const rawdynamicraycastvehiclecontroller_wheel_is_in_contact = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_is_in_contact;
  const rawdynamicraycastvehiclecontroller_wheel_ground_object = __vite__wasmModule.rawdynamicraycastvehiclecontroller_wheel_ground_object;
  const __wbg_rawccdsolver_free = __vite__wasmModule.__wbg_rawccdsolver_free;
  const rawccdsolver_new = __vite__wasmModule.rawccdsolver_new;
  const rawimpulsejointset_jointType = __vite__wasmModule.rawimpulsejointset_jointType;
  const rawimpulsejointset_jointBodyHandle1 = __vite__wasmModule.rawimpulsejointset_jointBodyHandle1;
  const rawimpulsejointset_jointBodyHandle2 = __vite__wasmModule.rawimpulsejointset_jointBodyHandle2;
  const rawimpulsejointset_jointFrameX1 = __vite__wasmModule.rawimpulsejointset_jointFrameX1;
  const rawimpulsejointset_jointFrameX2 = __vite__wasmModule.rawimpulsejointset_jointFrameX2;
  const rawimpulsejointset_jointAnchor1 = __vite__wasmModule.rawimpulsejointset_jointAnchor1;
  const rawimpulsejointset_jointAnchor2 = __vite__wasmModule.rawimpulsejointset_jointAnchor2;
  const rawimpulsejointset_jointSetAnchor1 = __vite__wasmModule.rawimpulsejointset_jointSetAnchor1;
  const rawimpulsejointset_jointSetAnchor2 = __vite__wasmModule.rawimpulsejointset_jointSetAnchor2;
  const rawimpulsejointset_jointContactsEnabled = __vite__wasmModule.rawimpulsejointset_jointContactsEnabled;
  const rawimpulsejointset_jointSetContactsEnabled = __vite__wasmModule.rawimpulsejointset_jointSetContactsEnabled;
  const rawimpulsejointset_jointLimitsEnabled = __vite__wasmModule.rawimpulsejointset_jointLimitsEnabled;
  const rawimpulsejointset_jointLimitsMin = __vite__wasmModule.rawimpulsejointset_jointLimitsMin;
  const rawimpulsejointset_jointLimitsMax = __vite__wasmModule.rawimpulsejointset_jointLimitsMax;
  const rawimpulsejointset_jointSetLimits = __vite__wasmModule.rawimpulsejointset_jointSetLimits;
  const rawimpulsejointset_jointConfigureMotorModel = __vite__wasmModule.rawimpulsejointset_jointConfigureMotorModel;
  const rawimpulsejointset_jointConfigureMotorVelocity = __vite__wasmModule.rawimpulsejointset_jointConfigureMotorVelocity;
  const rawimpulsejointset_jointConfigureMotorPosition = __vite__wasmModule.rawimpulsejointset_jointConfigureMotorPosition;
  const rawimpulsejointset_jointConfigureMotor = __vite__wasmModule.rawimpulsejointset_jointConfigureMotor;
  const __wbg_rawimpulsejointset_free = __vite__wasmModule.__wbg_rawimpulsejointset_free;
  const rawimpulsejointset_new = __vite__wasmModule.rawimpulsejointset_new;
  const rawimpulsejointset_createJoint = __vite__wasmModule.rawimpulsejointset_createJoint;
  const rawimpulsejointset_remove = __vite__wasmModule.rawimpulsejointset_remove;
  const rawimpulsejointset_len = __vite__wasmModule.rawimpulsejointset_len;
  const rawimpulsejointset_contains = __vite__wasmModule.rawimpulsejointset_contains;
  const rawimpulsejointset_forEachJointHandle = __vite__wasmModule.rawimpulsejointset_forEachJointHandle;
  const rawimpulsejointset_forEachJointAttachedToRigidBody = __vite__wasmModule.rawimpulsejointset_forEachJointAttachedToRigidBody;
  const __wbg_rawintegrationparameters_free = __vite__wasmModule.__wbg_rawintegrationparameters_free;
  const rawintegrationparameters_new = __vite__wasmModule.rawintegrationparameters_new;
  const rawintegrationparameters_dt = __vite__wasmModule.rawintegrationparameters_dt;
  const rawintegrationparameters_contact_erp = __vite__wasmModule.rawintegrationparameters_contact_erp;
  const rawintegrationparameters_numSolverIterations = __vite__wasmModule.rawintegrationparameters_numSolverIterations;
  const rawintegrationparameters_minIslandSize = __vite__wasmModule.rawintegrationparameters_minIslandSize;
  const rawintegrationparameters_maxCcdSubsteps = __vite__wasmModule.rawintegrationparameters_maxCcdSubsteps;
  const rawintegrationparameters_lengthUnit = __vite__wasmModule.rawintegrationparameters_lengthUnit;
  const rawintegrationparameters_set_dt = __vite__wasmModule.rawintegrationparameters_set_dt;
  const rawintegrationparameters_set_contact_natural_frequency = __vite__wasmModule.rawintegrationparameters_set_contact_natural_frequency;
  const rawintegrationparameters_set_normalizedAllowedLinearError = __vite__wasmModule.rawintegrationparameters_set_normalizedAllowedLinearError;
  const rawintegrationparameters_set_normalizedPredictionDistance = __vite__wasmModule.rawintegrationparameters_set_normalizedPredictionDistance;
  const rawintegrationparameters_set_numSolverIterations = __vite__wasmModule.rawintegrationparameters_set_numSolverIterations;
  const rawintegrationparameters_set_minIslandSize = __vite__wasmModule.rawintegrationparameters_set_minIslandSize;
  const rawintegrationparameters_set_maxCcdSubsteps = __vite__wasmModule.rawintegrationparameters_set_maxCcdSubsteps;
  const rawintegrationparameters_set_lengthUnit = __vite__wasmModule.rawintegrationparameters_set_lengthUnit;
  const rawintegrationparameters_switchToStandardPgsSolver = __vite__wasmModule.rawintegrationparameters_switchToStandardPgsSolver;
  const rawintegrationparameters_switchToSmallStepsPgsSolver = __vite__wasmModule.rawintegrationparameters_switchToSmallStepsPgsSolver;
  const rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart = __vite__wasmModule.rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart;
  const __wbg_rawislandmanager_free = __vite__wasmModule.__wbg_rawislandmanager_free;
  const rawislandmanager_new = __vite__wasmModule.rawislandmanager_new;
  const rawislandmanager_forEachActiveRigidBodyHandle = __vite__wasmModule.rawislandmanager_forEachActiveRigidBodyHandle;
  const __wbg_rawgenericjoint_free = __vite__wasmModule.__wbg_rawgenericjoint_free;
  const rawgenericjoint_generic = __vite__wasmModule.rawgenericjoint_generic;
  const rawgenericjoint_spring = __vite__wasmModule.rawgenericjoint_spring;
  const rawgenericjoint_rope = __vite__wasmModule.rawgenericjoint_rope;
  const rawgenericjoint_spherical = __vite__wasmModule.rawgenericjoint_spherical;
  const rawgenericjoint_prismatic = __vite__wasmModule.rawgenericjoint_prismatic;
  const rawgenericjoint_fixed = __vite__wasmModule.rawgenericjoint_fixed;
  const rawgenericjoint_revolute = __vite__wasmModule.rawgenericjoint_revolute;
  const rawmultibodyjointset_jointType = __vite__wasmModule.rawmultibodyjointset_jointType;
  const rawmultibodyjointset_jointFrameX1 = __vite__wasmModule.rawmultibodyjointset_jointFrameX1;
  const rawmultibodyjointset_jointFrameX2 = __vite__wasmModule.rawmultibodyjointset_jointFrameX2;
  const rawmultibodyjointset_jointAnchor1 = __vite__wasmModule.rawmultibodyjointset_jointAnchor1;
  const rawmultibodyjointset_jointAnchor2 = __vite__wasmModule.rawmultibodyjointset_jointAnchor2;
  const rawmultibodyjointset_jointContactsEnabled = __vite__wasmModule.rawmultibodyjointset_jointContactsEnabled;
  const rawmultibodyjointset_jointSetContactsEnabled = __vite__wasmModule.rawmultibodyjointset_jointSetContactsEnabled;
  const rawmultibodyjointset_jointLimitsEnabled = __vite__wasmModule.rawmultibodyjointset_jointLimitsEnabled;
  const rawmultibodyjointset_jointLimitsMin = __vite__wasmModule.rawmultibodyjointset_jointLimitsMin;
  const rawmultibodyjointset_jointLimitsMax = __vite__wasmModule.rawmultibodyjointset_jointLimitsMax;
  const __wbg_rawmultibodyjointset_free = __vite__wasmModule.__wbg_rawmultibodyjointset_free;
  const rawmultibodyjointset_new = __vite__wasmModule.rawmultibodyjointset_new;
  const rawmultibodyjointset_createJoint = __vite__wasmModule.rawmultibodyjointset_createJoint;
  const rawmultibodyjointset_remove = __vite__wasmModule.rawmultibodyjointset_remove;
  const rawmultibodyjointset_contains = __vite__wasmModule.rawmultibodyjointset_contains;
  const rawmultibodyjointset_forEachJointHandle = __vite__wasmModule.rawmultibodyjointset_forEachJointHandle;
  const rawmultibodyjointset_forEachJointAttachedToRigidBody = __vite__wasmModule.rawmultibodyjointset_forEachJointAttachedToRigidBody;
  const rawrigidbodyset_rbTranslation = __vite__wasmModule.rawrigidbodyset_rbTranslation;
  const rawrigidbodyset_rbRotation = __vite__wasmModule.rawrigidbodyset_rbRotation;
  const rawrigidbodyset_rbSleep = __vite__wasmModule.rawrigidbodyset_rbSleep;
  const rawrigidbodyset_rbIsSleeping = __vite__wasmModule.rawrigidbodyset_rbIsSleeping;
  const rawrigidbodyset_rbIsMoving = __vite__wasmModule.rawrigidbodyset_rbIsMoving;
  const rawrigidbodyset_rbNextTranslation = __vite__wasmModule.rawrigidbodyset_rbNextTranslation;
  const rawrigidbodyset_rbNextRotation = __vite__wasmModule.rawrigidbodyset_rbNextRotation;
  const rawrigidbodyset_rbSetTranslation = __vite__wasmModule.rawrigidbodyset_rbSetTranslation;
  const rawrigidbodyset_rbSetRotation = __vite__wasmModule.rawrigidbodyset_rbSetRotation;
  const rawrigidbodyset_rbSetLinvel = __vite__wasmModule.rawrigidbodyset_rbSetLinvel;
  const rawrigidbodyset_rbSetAngvel = __vite__wasmModule.rawrigidbodyset_rbSetAngvel;
  const rawrigidbodyset_rbSetNextKinematicTranslation = __vite__wasmModule.rawrigidbodyset_rbSetNextKinematicTranslation;
  const rawrigidbodyset_rbSetNextKinematicRotation = __vite__wasmModule.rawrigidbodyset_rbSetNextKinematicRotation;
  const rawrigidbodyset_rbRecomputeMassPropertiesFromColliders = __vite__wasmModule.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders;
  const rawrigidbodyset_rbSetAdditionalMass = __vite__wasmModule.rawrigidbodyset_rbSetAdditionalMass;
  const rawrigidbodyset_rbSetAdditionalMassProperties = __vite__wasmModule.rawrigidbodyset_rbSetAdditionalMassProperties;
  const rawrigidbodyset_rbLinvel = __vite__wasmModule.rawrigidbodyset_rbLinvel;
  const rawrigidbodyset_rbAngvel = __vite__wasmModule.rawrigidbodyset_rbAngvel;
  const rawrigidbodyset_rbVelocityAtPoint = __vite__wasmModule.rawrigidbodyset_rbVelocityAtPoint;
  const rawrigidbodyset_rbLockTranslations = __vite__wasmModule.rawrigidbodyset_rbLockTranslations;
  const rawrigidbodyset_rbSetEnabledTranslations = __vite__wasmModule.rawrigidbodyset_rbSetEnabledTranslations;
  const rawrigidbodyset_rbLockRotations = __vite__wasmModule.rawrigidbodyset_rbLockRotations;
  const rawrigidbodyset_rbSetEnabledRotations = __vite__wasmModule.rawrigidbodyset_rbSetEnabledRotations;
  const rawrigidbodyset_rbDominanceGroup = __vite__wasmModule.rawrigidbodyset_rbDominanceGroup;
  const rawrigidbodyset_rbSetDominanceGroup = __vite__wasmModule.rawrigidbodyset_rbSetDominanceGroup;
  const rawrigidbodyset_rbEnableCcd = __vite__wasmModule.rawrigidbodyset_rbEnableCcd;
  const rawrigidbodyset_rbSetSoftCcdPrediction = __vite__wasmModule.rawrigidbodyset_rbSetSoftCcdPrediction;
  const rawrigidbodyset_rbMass = __vite__wasmModule.rawrigidbodyset_rbMass;
  const rawrigidbodyset_rbInvMass = __vite__wasmModule.rawrigidbodyset_rbInvMass;
  const rawrigidbodyset_rbEffectiveInvMass = __vite__wasmModule.rawrigidbodyset_rbEffectiveInvMass;
  const rawrigidbodyset_rbLocalCom = __vite__wasmModule.rawrigidbodyset_rbLocalCom;
  const rawrigidbodyset_rbWorldCom = __vite__wasmModule.rawrigidbodyset_rbWorldCom;
  const rawrigidbodyset_rbInvPrincipalInertiaSqrt = __vite__wasmModule.rawrigidbodyset_rbInvPrincipalInertiaSqrt;
  const rawrigidbodyset_rbPrincipalInertiaLocalFrame = __vite__wasmModule.rawrigidbodyset_rbPrincipalInertiaLocalFrame;
  const rawrigidbodyset_rbPrincipalInertia = __vite__wasmModule.rawrigidbodyset_rbPrincipalInertia;
  const rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt = __vite__wasmModule.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt;
  const rawrigidbodyset_rbEffectiveAngularInertia = __vite__wasmModule.rawrigidbodyset_rbEffectiveAngularInertia;
  const rawrigidbodyset_rbWakeUp = __vite__wasmModule.rawrigidbodyset_rbWakeUp;
  const rawrigidbodyset_rbIsCcdEnabled = __vite__wasmModule.rawrigidbodyset_rbIsCcdEnabled;
  const rawrigidbodyset_rbSoftCcdPrediction = __vite__wasmModule.rawrigidbodyset_rbSoftCcdPrediction;
  const rawrigidbodyset_rbNumColliders = __vite__wasmModule.rawrigidbodyset_rbNumColliders;
  const rawrigidbodyset_rbCollider = __vite__wasmModule.rawrigidbodyset_rbCollider;
  const rawrigidbodyset_rbBodyType = __vite__wasmModule.rawrigidbodyset_rbBodyType;
  const rawrigidbodyset_rbSetBodyType = __vite__wasmModule.rawrigidbodyset_rbSetBodyType;
  const rawrigidbodyset_rbIsFixed = __vite__wasmModule.rawrigidbodyset_rbIsFixed;
  const rawrigidbodyset_rbIsKinematic = __vite__wasmModule.rawrigidbodyset_rbIsKinematic;
  const rawrigidbodyset_rbIsDynamic = __vite__wasmModule.rawrigidbodyset_rbIsDynamic;
  const rawrigidbodyset_rbLinearDamping = __vite__wasmModule.rawrigidbodyset_rbLinearDamping;
  const rawrigidbodyset_rbAngularDamping = __vite__wasmModule.rawrigidbodyset_rbAngularDamping;
  const rawrigidbodyset_rbSetLinearDamping = __vite__wasmModule.rawrigidbodyset_rbSetLinearDamping;
  const rawrigidbodyset_rbSetAngularDamping = __vite__wasmModule.rawrigidbodyset_rbSetAngularDamping;
  const rawrigidbodyset_rbSetEnabled = __vite__wasmModule.rawrigidbodyset_rbSetEnabled;
  const rawrigidbodyset_rbIsEnabled = __vite__wasmModule.rawrigidbodyset_rbIsEnabled;
  const rawrigidbodyset_rbGravityScale = __vite__wasmModule.rawrigidbodyset_rbGravityScale;
  const rawrigidbodyset_rbSetGravityScale = __vite__wasmModule.rawrigidbodyset_rbSetGravityScale;
  const rawrigidbodyset_rbResetForces = __vite__wasmModule.rawrigidbodyset_rbResetForces;
  const rawrigidbodyset_rbResetTorques = __vite__wasmModule.rawrigidbodyset_rbResetTorques;
  const rawrigidbodyset_rbAddForce = __vite__wasmModule.rawrigidbodyset_rbAddForce;
  const rawrigidbodyset_rbApplyImpulse = __vite__wasmModule.rawrigidbodyset_rbApplyImpulse;
  const rawrigidbodyset_rbAddTorque = __vite__wasmModule.rawrigidbodyset_rbAddTorque;
  const rawrigidbodyset_rbApplyTorqueImpulse = __vite__wasmModule.rawrigidbodyset_rbApplyTorqueImpulse;
  const rawrigidbodyset_rbAddForceAtPoint = __vite__wasmModule.rawrigidbodyset_rbAddForceAtPoint;
  const rawrigidbodyset_rbApplyImpulseAtPoint = __vite__wasmModule.rawrigidbodyset_rbApplyImpulseAtPoint;
  const rawrigidbodyset_rbAdditionalSolverIterations = __vite__wasmModule.rawrigidbodyset_rbAdditionalSolverIterations;
  const rawrigidbodyset_rbSetAdditionalSolverIterations = __vite__wasmModule.rawrigidbodyset_rbSetAdditionalSolverIterations;
  const rawrigidbodyset_rbUserData = __vite__wasmModule.rawrigidbodyset_rbUserData;
  const rawrigidbodyset_rbSetUserData = __vite__wasmModule.rawrigidbodyset_rbSetUserData;
  const rawrigidbodyset_rbUserForce = __vite__wasmModule.rawrigidbodyset_rbUserForce;
  const rawrigidbodyset_rbUserTorque = __vite__wasmModule.rawrigidbodyset_rbUserTorque;
  const __wbg_rawrigidbodyset_free = __vite__wasmModule.__wbg_rawrigidbodyset_free;
  const rawrigidbodyset_new = __vite__wasmModule.rawrigidbodyset_new;
  const rawrigidbodyset_createRigidBody = __vite__wasmModule.rawrigidbodyset_createRigidBody;
  const rawrigidbodyset_remove = __vite__wasmModule.rawrigidbodyset_remove;
  const rawrigidbodyset_contains = __vite__wasmModule.rawrigidbodyset_contains;
  const rawrigidbodyset_forEachRigidBodyHandle = __vite__wasmModule.rawrigidbodyset_forEachRigidBodyHandle;
  const rawrigidbodyset_propagateModifiedBodyPositionsToColliders = __vite__wasmModule.rawrigidbodyset_propagateModifiedBodyPositionsToColliders;
  const __wbg_rawbroadphase_free = __vite__wasmModule.__wbg_rawbroadphase_free;
  const rawbroadphase_new = __vite__wasmModule.rawbroadphase_new;
  const rawcolliderset_coTranslation = __vite__wasmModule.rawcolliderset_coTranslation;
  const rawcolliderset_coRotation = __vite__wasmModule.rawcolliderset_coRotation;
  const rawcolliderset_coSetTranslation = __vite__wasmModule.rawcolliderset_coSetTranslation;
  const rawcolliderset_coSetTranslationWrtParent = __vite__wasmModule.rawcolliderset_coSetTranslationWrtParent;
  const rawcolliderset_coSetRotation = __vite__wasmModule.rawcolliderset_coSetRotation;
  const rawcolliderset_coSetRotationWrtParent = __vite__wasmModule.rawcolliderset_coSetRotationWrtParent;
  const rawcolliderset_coIsSensor = __vite__wasmModule.rawcolliderset_coIsSensor;
  const rawcolliderset_coShapeType = __vite__wasmModule.rawcolliderset_coShapeType;
  const rawcolliderset_coHalfspaceNormal = __vite__wasmModule.rawcolliderset_coHalfspaceNormal;
  const rawcolliderset_coHalfExtents = __vite__wasmModule.rawcolliderset_coHalfExtents;
  const rawcolliderset_coSetHalfExtents = __vite__wasmModule.rawcolliderset_coSetHalfExtents;
  const rawcolliderset_coRadius = __vite__wasmModule.rawcolliderset_coRadius;
  const rawcolliderset_coSetRadius = __vite__wasmModule.rawcolliderset_coSetRadius;
  const rawcolliderset_coHalfHeight = __vite__wasmModule.rawcolliderset_coHalfHeight;
  const rawcolliderset_coSetHalfHeight = __vite__wasmModule.rawcolliderset_coSetHalfHeight;
  const rawcolliderset_coRoundRadius = __vite__wasmModule.rawcolliderset_coRoundRadius;
  const rawcolliderset_coSetRoundRadius = __vite__wasmModule.rawcolliderset_coSetRoundRadius;
  const rawcolliderset_coVoxelData = __vite__wasmModule.rawcolliderset_coVoxelData;
  const rawcolliderset_coVoxelSize = __vite__wasmModule.rawcolliderset_coVoxelSize;
  const rawcolliderset_coSetVoxel = __vite__wasmModule.rawcolliderset_coSetVoxel;
  const rawcolliderset_coPropagateVoxelChange = __vite__wasmModule.rawcolliderset_coPropagateVoxelChange;
  const rawcolliderset_coCombineVoxelStates = __vite__wasmModule.rawcolliderset_coCombineVoxelStates;
  const rawcolliderset_coVertices = __vite__wasmModule.rawcolliderset_coVertices;
  const rawcolliderset_coIndices = __vite__wasmModule.rawcolliderset_coIndices;
  const rawcolliderset_coTriMeshFlags = __vite__wasmModule.rawcolliderset_coTriMeshFlags;
  const rawcolliderset_coHeightFieldFlags = __vite__wasmModule.rawcolliderset_coHeightFieldFlags;
  const rawcolliderset_coHeightfieldHeights = __vite__wasmModule.rawcolliderset_coHeightfieldHeights;
  const rawcolliderset_coHeightfieldScale = __vite__wasmModule.rawcolliderset_coHeightfieldScale;
  const rawcolliderset_coHeightfieldNRows = __vite__wasmModule.rawcolliderset_coHeightfieldNRows;
  const rawcolliderset_coHeightfieldNCols = __vite__wasmModule.rawcolliderset_coHeightfieldNCols;
  const rawcolliderset_coParent = __vite__wasmModule.rawcolliderset_coParent;
  const rawcolliderset_coSetEnabled = __vite__wasmModule.rawcolliderset_coSetEnabled;
  const rawcolliderset_coIsEnabled = __vite__wasmModule.rawcolliderset_coIsEnabled;
  const rawcolliderset_coSetContactSkin = __vite__wasmModule.rawcolliderset_coSetContactSkin;
  const rawcolliderset_coContactSkin = __vite__wasmModule.rawcolliderset_coContactSkin;
  const rawcolliderset_coFriction = __vite__wasmModule.rawcolliderset_coFriction;
  const rawcolliderset_coRestitution = __vite__wasmModule.rawcolliderset_coRestitution;
  const rawcolliderset_coDensity = __vite__wasmModule.rawcolliderset_coDensity;
  const rawcolliderset_coMass = __vite__wasmModule.rawcolliderset_coMass;
  const rawcolliderset_coVolume = __vite__wasmModule.rawcolliderset_coVolume;
  const rawcolliderset_coCollisionGroups = __vite__wasmModule.rawcolliderset_coCollisionGroups;
  const rawcolliderset_coSolverGroups = __vite__wasmModule.rawcolliderset_coSolverGroups;
  const rawcolliderset_coActiveHooks = __vite__wasmModule.rawcolliderset_coActiveHooks;
  const rawcolliderset_coActiveCollisionTypes = __vite__wasmModule.rawcolliderset_coActiveCollisionTypes;
  const rawcolliderset_coActiveEvents = __vite__wasmModule.rawcolliderset_coActiveEvents;
  const rawcolliderset_coContactForceEventThreshold = __vite__wasmModule.rawcolliderset_coContactForceEventThreshold;
  const rawcolliderset_coContainsPoint = __vite__wasmModule.rawcolliderset_coContainsPoint;
  const rawcolliderset_coCastShape = __vite__wasmModule.rawcolliderset_coCastShape;
  const rawcolliderset_coCastCollider = __vite__wasmModule.rawcolliderset_coCastCollider;
  const rawcolliderset_coIntersectsShape = __vite__wasmModule.rawcolliderset_coIntersectsShape;
  const rawcolliderset_coContactShape = __vite__wasmModule.rawcolliderset_coContactShape;
  const rawcolliderset_coContactCollider = __vite__wasmModule.rawcolliderset_coContactCollider;
  const rawcolliderset_coProjectPoint = __vite__wasmModule.rawcolliderset_coProjectPoint;
  const rawcolliderset_coIntersectsRay = __vite__wasmModule.rawcolliderset_coIntersectsRay;
  const rawcolliderset_coCastRay = __vite__wasmModule.rawcolliderset_coCastRay;
  const rawcolliderset_coCastRayAndGetNormal = __vite__wasmModule.rawcolliderset_coCastRayAndGetNormal;
  const rawcolliderset_coSetSensor = __vite__wasmModule.rawcolliderset_coSetSensor;
  const rawcolliderset_coSetRestitution = __vite__wasmModule.rawcolliderset_coSetRestitution;
  const rawcolliderset_coSetFriction = __vite__wasmModule.rawcolliderset_coSetFriction;
  const rawcolliderset_coFrictionCombineRule = __vite__wasmModule.rawcolliderset_coFrictionCombineRule;
  const rawcolliderset_coSetFrictionCombineRule = __vite__wasmModule.rawcolliderset_coSetFrictionCombineRule;
  const rawcolliderset_coRestitutionCombineRule = __vite__wasmModule.rawcolliderset_coRestitutionCombineRule;
  const rawcolliderset_coSetRestitutionCombineRule = __vite__wasmModule.rawcolliderset_coSetRestitutionCombineRule;
  const rawcolliderset_coSetCollisionGroups = __vite__wasmModule.rawcolliderset_coSetCollisionGroups;
  const rawcolliderset_coSetSolverGroups = __vite__wasmModule.rawcolliderset_coSetSolverGroups;
  const rawcolliderset_coSetActiveHooks = __vite__wasmModule.rawcolliderset_coSetActiveHooks;
  const rawcolliderset_coSetActiveEvents = __vite__wasmModule.rawcolliderset_coSetActiveEvents;
  const rawcolliderset_coSetActiveCollisionTypes = __vite__wasmModule.rawcolliderset_coSetActiveCollisionTypes;
  const rawcolliderset_coSetShape = __vite__wasmModule.rawcolliderset_coSetShape;
  const rawcolliderset_coSetContactForceEventThreshold = __vite__wasmModule.rawcolliderset_coSetContactForceEventThreshold;
  const rawcolliderset_coSetDensity = __vite__wasmModule.rawcolliderset_coSetDensity;
  const rawcolliderset_coSetMass = __vite__wasmModule.rawcolliderset_coSetMass;
  const rawcolliderset_coSetMassProperties = __vite__wasmModule.rawcolliderset_coSetMassProperties;
  const __wbg_rawcolliderset_free = __vite__wasmModule.__wbg_rawcolliderset_free;
  const rawcolliderset_new = __vite__wasmModule.rawcolliderset_new;
  const rawcolliderset_len = __vite__wasmModule.rawcolliderset_len;
  const rawcolliderset_contains = __vite__wasmModule.rawcolliderset_contains;
  const rawcolliderset_createCollider = __vite__wasmModule.rawcolliderset_createCollider;
  const rawcolliderset_remove = __vite__wasmModule.rawcolliderset_remove;
  const rawcolliderset_forEachColliderHandle = __vite__wasmModule.rawcolliderset_forEachColliderHandle;
  const __wbg_rawshapecontact_free = __vite__wasmModule.__wbg_rawshapecontact_free;
  const __wbg_rawnarrowphase_free = __vite__wasmModule.__wbg_rawnarrowphase_free;
  const rawnarrowphase_new = __vite__wasmModule.rawnarrowphase_new;
  const rawnarrowphase_contact_pairs_with = __vite__wasmModule.rawnarrowphase_contact_pairs_with;
  const rawnarrowphase_contact_pair = __vite__wasmModule.rawnarrowphase_contact_pair;
  const rawnarrowphase_intersection_pairs_with = __vite__wasmModule.rawnarrowphase_intersection_pairs_with;
  const rawnarrowphase_intersection_pair = __vite__wasmModule.rawnarrowphase_intersection_pair;
  const __wbg_rawcontactmanifold_free = __vite__wasmModule.__wbg_rawcontactmanifold_free;
  const rawcontactpair_collider1 = __vite__wasmModule.rawcontactpair_collider1;
  const rawcontactpair_collider2 = __vite__wasmModule.rawcontactpair_collider2;
  const rawcontactpair_numContactManifolds = __vite__wasmModule.rawcontactpair_numContactManifolds;
  const rawcontactpair_contactManifold = __vite__wasmModule.rawcontactpair_contactManifold;
  const rawcontactmanifold_normal = __vite__wasmModule.rawcontactmanifold_normal;
  const rawcontactmanifold_local_n1 = __vite__wasmModule.rawcontactmanifold_local_n1;
  const rawcontactmanifold_local_n2 = __vite__wasmModule.rawcontactmanifold_local_n2;
  const rawcontactmanifold_subshape1 = __vite__wasmModule.rawcontactmanifold_subshape1;
  const rawcontactmanifold_subshape2 = __vite__wasmModule.rawcontactmanifold_subshape2;
  const rawcontactmanifold_num_contacts = __vite__wasmModule.rawcontactmanifold_num_contacts;
  const rawcontactmanifold_contact_local_p1 = __vite__wasmModule.rawcontactmanifold_contact_local_p1;
  const rawcontactmanifold_contact_local_p2 = __vite__wasmModule.rawcontactmanifold_contact_local_p2;
  const rawcontactmanifold_contact_dist = __vite__wasmModule.rawcontactmanifold_contact_dist;
  const rawcontactmanifold_contact_fid1 = __vite__wasmModule.rawcontactmanifold_contact_fid1;
  const rawcontactmanifold_contact_fid2 = __vite__wasmModule.rawcontactmanifold_contact_fid2;
  const rawcontactmanifold_contact_impulse = __vite__wasmModule.rawcontactmanifold_contact_impulse;
  const rawcontactmanifold_contact_tangent_impulse_x = __vite__wasmModule.rawcontactmanifold_contact_tangent_impulse_x;
  const rawcontactmanifold_contact_tangent_impulse_y = __vite__wasmModule.rawcontactmanifold_contact_tangent_impulse_y;
  const rawcontactmanifold_num_solver_contacts = __vite__wasmModule.rawcontactmanifold_num_solver_contacts;
  const rawcontactmanifold_solver_contact_point = __vite__wasmModule.rawcontactmanifold_solver_contact_point;
  const rawcontactmanifold_solver_contact_dist = __vite__wasmModule.rawcontactmanifold_solver_contact_dist;
  const rawcontactmanifold_solver_contact_friction = __vite__wasmModule.rawcontactmanifold_solver_contact_friction;
  const rawcontactmanifold_solver_contact_restitution = __vite__wasmModule.rawcontactmanifold_solver_contact_restitution;
  const rawcontactmanifold_solver_contact_tangent_velocity = __vite__wasmModule.rawcontactmanifold_solver_contact_tangent_velocity;
  const __wbg_rawpointprojection_free = __vite__wasmModule.__wbg_rawpointprojection_free;
  const rawpointprojection_point = __vite__wasmModule.rawpointprojection_point;
  const rawpointprojection_isInside = __vite__wasmModule.rawpointprojection_isInside;
  const __wbg_rawpointcolliderprojection_free = __vite__wasmModule.__wbg_rawpointcolliderprojection_free;
  const rawpointcolliderprojection_colliderHandle = __vite__wasmModule.rawpointcolliderprojection_colliderHandle;
  const rawpointcolliderprojection_point = __vite__wasmModule.rawpointcolliderprojection_point;
  const rawpointcolliderprojection_isInside = __vite__wasmModule.rawpointcolliderprojection_isInside;
  const rawpointcolliderprojection_featureType = __vite__wasmModule.rawpointcolliderprojection_featureType;
  const rawpointcolliderprojection_featureId = __vite__wasmModule.rawpointcolliderprojection_featureId;
  const __wbg_rawrayintersection_free = __vite__wasmModule.__wbg_rawrayintersection_free;
  const __wbg_rawraycolliderhit_free = __vite__wasmModule.__wbg_rawraycolliderhit_free;
  const __wbg_rawshape_free = __vite__wasmModule.__wbg_rawshape_free;
  const rawshape_cuboid = __vite__wasmModule.rawshape_cuboid;
  const rawshape_roundCuboid = __vite__wasmModule.rawshape_roundCuboid;
  const rawshape_ball = __vite__wasmModule.rawshape_ball;
  const rawshape_halfspace = __vite__wasmModule.rawshape_halfspace;
  const rawshape_capsule = __vite__wasmModule.rawshape_capsule;
  const rawshape_cylinder = __vite__wasmModule.rawshape_cylinder;
  const rawshape_roundCylinder = __vite__wasmModule.rawshape_roundCylinder;
  const rawshape_cone = __vite__wasmModule.rawshape_cone;
  const rawshape_roundCone = __vite__wasmModule.rawshape_roundCone;
  const rawshape_voxels = __vite__wasmModule.rawshape_voxels;
  const rawshape_voxelsFromPoints = __vite__wasmModule.rawshape_voxelsFromPoints;
  const rawshape_polyline = __vite__wasmModule.rawshape_polyline;
  const rawshape_trimesh = __vite__wasmModule.rawshape_trimesh;
  const rawshape_heightfield = __vite__wasmModule.rawshape_heightfield;
  const rawshape_segment = __vite__wasmModule.rawshape_segment;
  const rawshape_triangle = __vite__wasmModule.rawshape_triangle;
  const rawshape_roundTriangle = __vite__wasmModule.rawshape_roundTriangle;
  const rawshape_convexHull = __vite__wasmModule.rawshape_convexHull;
  const rawshape_roundConvexHull = __vite__wasmModule.rawshape_roundConvexHull;
  const rawshape_convexMesh = __vite__wasmModule.rawshape_convexMesh;
  const rawshape_roundConvexMesh = __vite__wasmModule.rawshape_roundConvexMesh;
  const rawshape_castShape = __vite__wasmModule.rawshape_castShape;
  const rawshape_intersectsShape = __vite__wasmModule.rawshape_intersectsShape;
  const rawshape_contactShape = __vite__wasmModule.rawshape_contactShape;
  const rawshape_containsPoint = __vite__wasmModule.rawshape_containsPoint;
  const rawshape_projectPoint = __vite__wasmModule.rawshape_projectPoint;
  const rawshape_intersectsRay = __vite__wasmModule.rawshape_intersectsRay;
  const rawshape_castRay = __vite__wasmModule.rawshape_castRay;
  const rawshape_castRayAndGetNormal = __vite__wasmModule.rawshape_castRayAndGetNormal;
  const __wbg_rawshapecasthit_free = __vite__wasmModule.__wbg_rawshapecasthit_free;
  const rawshapecasthit_witness1 = __vite__wasmModule.rawshapecasthit_witness1;
  const rawshapecasthit_normal1 = __vite__wasmModule.rawshapecasthit_normal1;
  const rawshapecasthit_normal2 = __vite__wasmModule.rawshapecasthit_normal2;
  const __wbg_rawcollidershapecasthit_free = __vite__wasmModule.__wbg_rawcollidershapecasthit_free;
  const rawcollidershapecasthit_time_of_impact = __vite__wasmModule.rawcollidershapecasthit_time_of_impact;
  const rawcollidershapecasthit_witness1 = __vite__wasmModule.rawcollidershapecasthit_witness1;
  const rawcollidershapecasthit_witness2 = __vite__wasmModule.rawcollidershapecasthit_witness2;
  const rawrotation_new = __vite__wasmModule.rawrotation_new;
  const rawrotation_identity = __vite__wasmModule.rawrotation_identity;
  const rawrotation_x = __vite__wasmModule.rawrotation_x;
  const rawrotation_w = __vite__wasmModule.rawrotation_w;
  const rawvector_zero = __vite__wasmModule.rawvector_zero;
  const rawvector_new = __vite__wasmModule.rawvector_new;
  const rawvector_set_x = __vite__wasmModule.rawvector_set_x;
  const rawvector_set_z = __vite__wasmModule.rawvector_set_z;
  const rawvector_xyz = __vite__wasmModule.rawvector_xyz;
  const rawvector_yxz = __vite__wasmModule.rawvector_yxz;
  const rawvector_zxy = __vite__wasmModule.rawvector_zxy;
  const rawvector_xzy = __vite__wasmModule.rawvector_xzy;
  const rawvector_yzx = __vite__wasmModule.rawvector_yzx;
  const rawvector_zyx = __vite__wasmModule.rawvector_zyx;
  const rawsdpmatrix3_elements = __vite__wasmModule.rawsdpmatrix3_elements;
  const __wbg_rawdebugrenderpipeline_free = __vite__wasmModule.__wbg_rawdebugrenderpipeline_free;
  const rawdebugrenderpipeline_new = __vite__wasmModule.rawdebugrenderpipeline_new;
  const rawdebugrenderpipeline_vertices = __vite__wasmModule.rawdebugrenderpipeline_vertices;
  const rawdebugrenderpipeline_colors = __vite__wasmModule.rawdebugrenderpipeline_colors;
  const rawdebugrenderpipeline_render = __vite__wasmModule.rawdebugrenderpipeline_render;
  const __wbg_raweventqueue_free = __vite__wasmModule.__wbg_raweventqueue_free;
  const __wbg_rawcontactforceevent_free = __vite__wasmModule.__wbg_rawcontactforceevent_free;
  const rawcontactforceevent_collider2 = __vite__wasmModule.rawcontactforceevent_collider2;
  const rawcontactforceevent_total_force = __vite__wasmModule.rawcontactforceevent_total_force;
  const rawcontactforceevent_total_force_magnitude = __vite__wasmModule.rawcontactforceevent_total_force_magnitude;
  const rawcontactforceevent_max_force_direction = __vite__wasmModule.rawcontactforceevent_max_force_direction;
  const rawcontactforceevent_max_force_magnitude = __vite__wasmModule.rawcontactforceevent_max_force_magnitude;
  const raweventqueue_new = __vite__wasmModule.raweventqueue_new;
  const raweventqueue_drainCollisionEvents = __vite__wasmModule.raweventqueue_drainCollisionEvents;
  const raweventqueue_drainContactForceEvents = __vite__wasmModule.raweventqueue_drainContactForceEvents;
  const raweventqueue_clear = __vite__wasmModule.raweventqueue_clear;
  const __wbg_rawphysicspipeline_free = __vite__wasmModule.__wbg_rawphysicspipeline_free;
  const rawphysicspipeline_new = __vite__wasmModule.rawphysicspipeline_new;
  const rawphysicspipeline_step = __vite__wasmModule.rawphysicspipeline_step;
  const rawphysicspipeline_stepWithEvents = __vite__wasmModule.rawphysicspipeline_stepWithEvents;
  const rawquerypipeline_new = __vite__wasmModule.rawquerypipeline_new;
  const rawquerypipeline_update = __vite__wasmModule.rawquerypipeline_update;
  const rawquerypipeline_castRay = __vite__wasmModule.rawquerypipeline_castRay;
  const rawquerypipeline_castRayAndGetNormal = __vite__wasmModule.rawquerypipeline_castRayAndGetNormal;
  const rawquerypipeline_intersectionsWithRay = __vite__wasmModule.rawquerypipeline_intersectionsWithRay;
  const rawquerypipeline_intersectionWithShape = __vite__wasmModule.rawquerypipeline_intersectionWithShape;
  const rawquerypipeline_projectPoint = __vite__wasmModule.rawquerypipeline_projectPoint;
  const rawquerypipeline_projectPointAndGetFeature = __vite__wasmModule.rawquerypipeline_projectPointAndGetFeature;
  const rawquerypipeline_intersectionsWithPoint = __vite__wasmModule.rawquerypipeline_intersectionsWithPoint;
  const rawquerypipeline_castShape = __vite__wasmModule.rawquerypipeline_castShape;
  const rawquerypipeline_intersectionsWithShape = __vite__wasmModule.rawquerypipeline_intersectionsWithShape;
  const rawquerypipeline_collidersWithAabbIntersectingAabb = __vite__wasmModule.rawquerypipeline_collidersWithAabbIntersectingAabb;
  const __wbg_rawdeserializedworld_free = __vite__wasmModule.__wbg_rawdeserializedworld_free;
  const rawdeserializedworld_takeGravity = __vite__wasmModule.rawdeserializedworld_takeGravity;
  const rawdeserializedworld_takeIntegrationParameters = __vite__wasmModule.rawdeserializedworld_takeIntegrationParameters;
  const rawdeserializedworld_takeIslandManager = __vite__wasmModule.rawdeserializedworld_takeIslandManager;
  const rawdeserializedworld_takeBroadPhase = __vite__wasmModule.rawdeserializedworld_takeBroadPhase;
  const rawdeserializedworld_takeNarrowPhase = __vite__wasmModule.rawdeserializedworld_takeNarrowPhase;
  const rawdeserializedworld_takeBodies = __vite__wasmModule.rawdeserializedworld_takeBodies;
  const rawdeserializedworld_takeColliders = __vite__wasmModule.rawdeserializedworld_takeColliders;
  const rawdeserializedworld_takeImpulseJoints = __vite__wasmModule.rawdeserializedworld_takeImpulseJoints;
  const rawdeserializedworld_takeMultibodyJoints = __vite__wasmModule.rawdeserializedworld_takeMultibodyJoints;
  const __wbg_rawserializationpipeline_free = __vite__wasmModule.__wbg_rawserializationpipeline_free;
  const rawserializationpipeline_new = __vite__wasmModule.rawserializationpipeline_new;
  const rawserializationpipeline_serializeAll = __vite__wasmModule.rawserializationpipeline_serializeAll;
  const rawserializationpipeline_deserializeAll = __vite__wasmModule.rawserializationpipeline_deserializeAll;
  const rawcolliderset_isHandleValid = __vite__wasmModule.rawcolliderset_isHandleValid;
  const rawkinematiccharactercontroller_offset = __vite__wasmModule.rawkinematiccharactercontroller_offset;
  const rawintegrationparameters_normalizedAllowedLinearError = __vite__wasmModule.rawintegrationparameters_normalizedAllowedLinearError;
  const rawintegrationparameters_numAdditionalFrictionIterations = __vite__wasmModule.rawintegrationparameters_numAdditionalFrictionIterations;
  const rawintegrationparameters_numInternalPgsIterations = __vite__wasmModule.rawintegrationparameters_numInternalPgsIterations;
  const rawrigidbodyset_len = __vite__wasmModule.rawrigidbodyset_len;
  const rawshapecontact_distance = __vite__wasmModule.rawshapecontact_distance;
  const rawrayintersection_featureType = __vite__wasmModule.rawrayintersection_featureType;
  const rawraycolliderintersection_colliderHandle = __vite__wasmModule.rawraycolliderintersection_colliderHandle;
  const rawrayintersection_time_of_impact = __vite__wasmModule.rawrayintersection_time_of_impact;
  const rawraycolliderintersection_featureType = __vite__wasmModule.rawraycolliderintersection_featureType;
  const rawraycolliderhit_colliderHandle = __vite__wasmModule.rawraycolliderhit_colliderHandle;
  const rawraycolliderintersection_time_of_impact = __vite__wasmModule.rawraycolliderintersection_time_of_impact;
  const rawcollidershapecasthit_colliderHandle = __vite__wasmModule.rawcollidershapecasthit_colliderHandle;
  const rawraycolliderhit_timeOfImpact = __vite__wasmModule.rawraycolliderhit_timeOfImpact;
  const rawshapecasthit_time_of_impact = __vite__wasmModule.rawshapecasthit_time_of_impact;
  const rawrotation_y = __vite__wasmModule.rawrotation_y;
  const rawrotation_z = __vite__wasmModule.rawrotation_z;
  const rawvector_x = __vite__wasmModule.rawvector_x;
  const rawvector_y = __vite__wasmModule.rawvector_y;
  const rawvector_z = __vite__wasmModule.rawvector_z;
  const rawcontactforceevent_collider1 = __vite__wasmModule.rawcontactforceevent_collider1;
  const rawintegrationparameters_normalizedPredictionDistance = __vite__wasmModule.rawintegrationparameters_normalizedPredictionDistance;
  const reserve_memory = __vite__wasmModule.reserve_memory;
  const __wbg_rawquerypipeline_free = __vite__wasmModule.__wbg_rawquerypipeline_free;
  const rawrayintersection_featureId = __vite__wasmModule.rawrayintersection_featureId;
  const rawraycolliderintersection_featureId = __vite__wasmModule.rawraycolliderintersection_featureId;
  const rawkinematiccharactercontroller_up = __vite__wasmModule.rawkinematiccharactercontroller_up;
  const rawshapecontact_normal2 = __vite__wasmModule.rawshapecontact_normal2;
  const rawshapecontact_point1 = __vite__wasmModule.rawshapecontact_point1;
  const rawshapecontact_point2 = __vite__wasmModule.rawshapecontact_point2;
  const rawrayintersection_normal = __vite__wasmModule.rawrayintersection_normal;
  const rawraycolliderintersection_normal = __vite__wasmModule.rawraycolliderintersection_normal;
  const rawshapecontact_normal1 = __vite__wasmModule.rawshapecontact_normal1;
  const rawcollidershapecasthit_normal1 = __vite__wasmModule.rawcollidershapecasthit_normal1;
  const rawcollidershapecasthit_normal2 = __vite__wasmModule.rawcollidershapecasthit_normal2;
  const rawshapecasthit_witness2 = __vite__wasmModule.rawshapecasthit_witness2;
  const rawintegrationparameters_set_numAdditionalFrictionIterations = __vite__wasmModule.rawintegrationparameters_set_numAdditionalFrictionIterations;
  const rawintegrationparameters_set_numInternalPgsIterations = __vite__wasmModule.rawintegrationparameters_set_numInternalPgsIterations;
  const rawvector_set_y = __vite__wasmModule.rawvector_set_y;
  const __wbg_rawraycolliderintersection_free = __vite__wasmModule.__wbg_rawraycolliderintersection_free;
  const __wbg_rawcontactpair_free = __vite__wasmModule.__wbg_rawcontactpair_free;
  const __wbg_rawsdpmatrix3_free = __vite__wasmModule.__wbg_rawsdpmatrix3_free;
  const __wbg_rawvector_free = __vite__wasmModule.__wbg_rawvector_free;
  const __wbg_rawrotation_free = __vite__wasmModule.__wbg_rawrotation_free;
  const __wbindgen_export_0 = __vite__wasmModule.__wbindgen_export_0;
  const __wbindgen_add_to_stack_pointer = __vite__wasmModule.__wbindgen_add_to_stack_pointer;
  const __wbindgen_export_1 = __vite__wasmModule.__wbindgen_export_1;
  const __wbindgen_export_2 = __vite__wasmModule.__wbindgen_export_2;
  const wasm = Object.freeze(Object.defineProperty({
    __proto__: null,
    __wbg_rawbroadphase_free,
    __wbg_rawccdsolver_free,
    __wbg_rawcharactercollision_free,
    __wbg_rawcolliderset_free,
    __wbg_rawcollidershapecasthit_free,
    __wbg_rawcontactforceevent_free,
    __wbg_rawcontactmanifold_free,
    __wbg_rawcontactpair_free,
    __wbg_rawdebugrenderpipeline_free,
    __wbg_rawdeserializedworld_free,
    __wbg_rawdynamicraycastvehiclecontroller_free,
    __wbg_raweventqueue_free,
    __wbg_rawgenericjoint_free,
    __wbg_rawimpulsejointset_free,
    __wbg_rawintegrationparameters_free,
    __wbg_rawislandmanager_free,
    __wbg_rawkinematiccharactercontroller_free,
    __wbg_rawmultibodyjointset_free,
    __wbg_rawnarrowphase_free,
    __wbg_rawphysicspipeline_free,
    __wbg_rawpidcontroller_free,
    __wbg_rawpointcolliderprojection_free,
    __wbg_rawpointprojection_free,
    __wbg_rawquerypipeline_free,
    __wbg_rawraycolliderhit_free,
    __wbg_rawraycolliderintersection_free,
    __wbg_rawrayintersection_free,
    __wbg_rawrigidbodyset_free,
    __wbg_rawrotation_free,
    __wbg_rawsdpmatrix3_free,
    __wbg_rawserializationpipeline_free,
    __wbg_rawshape_free,
    __wbg_rawshapecasthit_free,
    __wbg_rawshapecontact_free,
    __wbg_rawvector_free,
    __wbindgen_add_to_stack_pointer,
    __wbindgen_export_0,
    __wbindgen_export_1,
    __wbindgen_export_2,
    memory,
    rawbroadphase_new,
    rawccdsolver_new,
    rawcharactercollision_handle,
    rawcharactercollision_new,
    rawcharactercollision_toi,
    rawcharactercollision_translationDeltaApplied,
    rawcharactercollision_translationDeltaRemaining,
    rawcharactercollision_worldNormal1,
    rawcharactercollision_worldNormal2,
    rawcharactercollision_worldWitness1,
    rawcharactercollision_worldWitness2,
    rawcolliderset_coActiveCollisionTypes,
    rawcolliderset_coActiveEvents,
    rawcolliderset_coActiveHooks,
    rawcolliderset_coCastCollider,
    rawcolliderset_coCastRay,
    rawcolliderset_coCastRayAndGetNormal,
    rawcolliderset_coCastShape,
    rawcolliderset_coCollisionGroups,
    rawcolliderset_coCombineVoxelStates,
    rawcolliderset_coContactCollider,
    rawcolliderset_coContactForceEventThreshold,
    rawcolliderset_coContactShape,
    rawcolliderset_coContactSkin,
    rawcolliderset_coContainsPoint,
    rawcolliderset_coDensity,
    rawcolliderset_coFriction,
    rawcolliderset_coFrictionCombineRule,
    rawcolliderset_coHalfExtents,
    rawcolliderset_coHalfHeight,
    rawcolliderset_coHalfspaceNormal,
    rawcolliderset_coHeightFieldFlags,
    rawcolliderset_coHeightfieldHeights,
    rawcolliderset_coHeightfieldNCols,
    rawcolliderset_coHeightfieldNRows,
    rawcolliderset_coHeightfieldScale,
    rawcolliderset_coIndices,
    rawcolliderset_coIntersectsRay,
    rawcolliderset_coIntersectsShape,
    rawcolliderset_coIsEnabled,
    rawcolliderset_coIsSensor,
    rawcolliderset_coMass,
    rawcolliderset_coParent,
    rawcolliderset_coProjectPoint,
    rawcolliderset_coPropagateVoxelChange,
    rawcolliderset_coRadius,
    rawcolliderset_coRestitution,
    rawcolliderset_coRestitutionCombineRule,
    rawcolliderset_coRotation,
    rawcolliderset_coRoundRadius,
    rawcolliderset_coSetActiveCollisionTypes,
    rawcolliderset_coSetActiveEvents,
    rawcolliderset_coSetActiveHooks,
    rawcolliderset_coSetCollisionGroups,
    rawcolliderset_coSetContactForceEventThreshold,
    rawcolliderset_coSetContactSkin,
    rawcolliderset_coSetDensity,
    rawcolliderset_coSetEnabled,
    rawcolliderset_coSetFriction,
    rawcolliderset_coSetFrictionCombineRule,
    rawcolliderset_coSetHalfExtents,
    rawcolliderset_coSetHalfHeight,
    rawcolliderset_coSetMass,
    rawcolliderset_coSetMassProperties,
    rawcolliderset_coSetRadius,
    rawcolliderset_coSetRestitution,
    rawcolliderset_coSetRestitutionCombineRule,
    rawcolliderset_coSetRotation,
    rawcolliderset_coSetRotationWrtParent,
    rawcolliderset_coSetRoundRadius,
    rawcolliderset_coSetSensor,
    rawcolliderset_coSetShape,
    rawcolliderset_coSetSolverGroups,
    rawcolliderset_coSetTranslation,
    rawcolliderset_coSetTranslationWrtParent,
    rawcolliderset_coSetVoxel,
    rawcolliderset_coShapeType,
    rawcolliderset_coSolverGroups,
    rawcolliderset_coTranslation,
    rawcolliderset_coTriMeshFlags,
    rawcolliderset_coVertices,
    rawcolliderset_coVolume,
    rawcolliderset_coVoxelData,
    rawcolliderset_coVoxelSize,
    rawcolliderset_contains,
    rawcolliderset_createCollider,
    rawcolliderset_forEachColliderHandle,
    rawcolliderset_isHandleValid,
    rawcolliderset_len,
    rawcolliderset_new,
    rawcolliderset_remove,
    rawcollidershapecasthit_colliderHandle,
    rawcollidershapecasthit_normal1,
    rawcollidershapecasthit_normal2,
    rawcollidershapecasthit_time_of_impact,
    rawcollidershapecasthit_witness1,
    rawcollidershapecasthit_witness2,
    rawcontactforceevent_collider1,
    rawcontactforceevent_collider2,
    rawcontactforceevent_max_force_direction,
    rawcontactforceevent_max_force_magnitude,
    rawcontactforceevent_total_force,
    rawcontactforceevent_total_force_magnitude,
    rawcontactmanifold_contact_dist,
    rawcontactmanifold_contact_fid1,
    rawcontactmanifold_contact_fid2,
    rawcontactmanifold_contact_impulse,
    rawcontactmanifold_contact_local_p1,
    rawcontactmanifold_contact_local_p2,
    rawcontactmanifold_contact_tangent_impulse_x,
    rawcontactmanifold_contact_tangent_impulse_y,
    rawcontactmanifold_local_n1,
    rawcontactmanifold_local_n2,
    rawcontactmanifold_normal,
    rawcontactmanifold_num_contacts,
    rawcontactmanifold_num_solver_contacts,
    rawcontactmanifold_solver_contact_dist,
    rawcontactmanifold_solver_contact_friction,
    rawcontactmanifold_solver_contact_point,
    rawcontactmanifold_solver_contact_restitution,
    rawcontactmanifold_solver_contact_tangent_velocity,
    rawcontactmanifold_subshape1,
    rawcontactmanifold_subshape2,
    rawcontactpair_collider1,
    rawcontactpair_collider2,
    rawcontactpair_contactManifold,
    rawcontactpair_numContactManifolds,
    rawdebugrenderpipeline_colors,
    rawdebugrenderpipeline_new,
    rawdebugrenderpipeline_render,
    rawdebugrenderpipeline_vertices,
    rawdeserializedworld_takeBodies,
    rawdeserializedworld_takeBroadPhase,
    rawdeserializedworld_takeColliders,
    rawdeserializedworld_takeGravity,
    rawdeserializedworld_takeImpulseJoints,
    rawdeserializedworld_takeIntegrationParameters,
    rawdeserializedworld_takeIslandManager,
    rawdeserializedworld_takeMultibodyJoints,
    rawdeserializedworld_takeNarrowPhase,
    rawdynamicraycastvehiclecontroller_add_wheel,
    rawdynamicraycastvehiclecontroller_chassis,
    rawdynamicraycastvehiclecontroller_current_vehicle_speed,
    rawdynamicraycastvehiclecontroller_index_forward_axis,
    rawdynamicraycastvehiclecontroller_index_up_axis,
    rawdynamicraycastvehiclecontroller_new,
    rawdynamicraycastvehiclecontroller_num_wheels,
    rawdynamicraycastvehiclecontroller_set_index_forward_axis,
    rawdynamicraycastvehiclecontroller_set_index_up_axis,
    rawdynamicraycastvehiclecontroller_set_wheel_axle_cs,
    rawdynamicraycastvehiclecontroller_set_wheel_brake,
    rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs,
    rawdynamicraycastvehiclecontroller_set_wheel_direction_cs,
    rawdynamicraycastvehiclecontroller_set_wheel_engine_force,
    rawdynamicraycastvehiclecontroller_set_wheel_friction_slip,
    rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force,
    rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel,
    rawdynamicraycastvehiclecontroller_set_wheel_radius,
    rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness,
    rawdynamicraycastvehiclecontroller_set_wheel_steering,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length,
    rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness,
    rawdynamicraycastvehiclecontroller_update_vehicle,
    rawdynamicraycastvehiclecontroller_wheel_axle_cs,
    rawdynamicraycastvehiclecontroller_wheel_brake,
    rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs,
    rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws,
    rawdynamicraycastvehiclecontroller_wheel_contact_point_ws,
    rawdynamicraycastvehiclecontroller_wheel_direction_cs,
    rawdynamicraycastvehiclecontroller_wheel_engine_force,
    rawdynamicraycastvehiclecontroller_wheel_forward_impulse,
    rawdynamicraycastvehiclecontroller_wheel_friction_slip,
    rawdynamicraycastvehiclecontroller_wheel_ground_object,
    rawdynamicraycastvehiclecontroller_wheel_hard_point_ws,
    rawdynamicraycastvehiclecontroller_wheel_is_in_contact,
    rawdynamicraycastvehiclecontroller_wheel_max_suspension_force,
    rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel,
    rawdynamicraycastvehiclecontroller_wheel_radius,
    rawdynamicraycastvehiclecontroller_wheel_rotation,
    rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness,
    rawdynamicraycastvehiclecontroller_wheel_side_impulse,
    rawdynamicraycastvehiclecontroller_wheel_steering,
    rawdynamicraycastvehiclecontroller_wheel_suspension_compression,
    rawdynamicraycastvehiclecontroller_wheel_suspension_force,
    rawdynamicraycastvehiclecontroller_wheel_suspension_length,
    rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation,
    rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length,
    rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness,
    raweventqueue_clear,
    raweventqueue_drainCollisionEvents,
    raweventqueue_drainContactForceEvents,
    raweventqueue_new,
    rawgenericjoint_fixed,
    rawgenericjoint_generic,
    rawgenericjoint_prismatic,
    rawgenericjoint_revolute,
    rawgenericjoint_rope,
    rawgenericjoint_spherical,
    rawgenericjoint_spring,
    rawimpulsejointset_contains,
    rawimpulsejointset_createJoint,
    rawimpulsejointset_forEachJointAttachedToRigidBody,
    rawimpulsejointset_forEachJointHandle,
    rawimpulsejointset_jointAnchor1,
    rawimpulsejointset_jointAnchor2,
    rawimpulsejointset_jointBodyHandle1,
    rawimpulsejointset_jointBodyHandle2,
    rawimpulsejointset_jointConfigureMotor,
    rawimpulsejointset_jointConfigureMotorModel,
    rawimpulsejointset_jointConfigureMotorPosition,
    rawimpulsejointset_jointConfigureMotorVelocity,
    rawimpulsejointset_jointContactsEnabled,
    rawimpulsejointset_jointFrameX1,
    rawimpulsejointset_jointFrameX2,
    rawimpulsejointset_jointLimitsEnabled,
    rawimpulsejointset_jointLimitsMax,
    rawimpulsejointset_jointLimitsMin,
    rawimpulsejointset_jointSetAnchor1,
    rawimpulsejointset_jointSetAnchor2,
    rawimpulsejointset_jointSetContactsEnabled,
    rawimpulsejointset_jointSetLimits,
    rawimpulsejointset_jointType,
    rawimpulsejointset_len,
    rawimpulsejointset_new,
    rawimpulsejointset_remove,
    rawintegrationparameters_contact_erp,
    rawintegrationparameters_dt,
    rawintegrationparameters_lengthUnit,
    rawintegrationparameters_maxCcdSubsteps,
    rawintegrationparameters_minIslandSize,
    rawintegrationparameters_new,
    rawintegrationparameters_normalizedAllowedLinearError,
    rawintegrationparameters_normalizedPredictionDistance,
    rawintegrationparameters_numAdditionalFrictionIterations,
    rawintegrationparameters_numInternalPgsIterations,
    rawintegrationparameters_numSolverIterations,
    rawintegrationparameters_set_contact_natural_frequency,
    rawintegrationparameters_set_dt,
    rawintegrationparameters_set_lengthUnit,
    rawintegrationparameters_set_maxCcdSubsteps,
    rawintegrationparameters_set_minIslandSize,
    rawintegrationparameters_set_normalizedAllowedLinearError,
    rawintegrationparameters_set_normalizedPredictionDistance,
    rawintegrationparameters_set_numAdditionalFrictionIterations,
    rawintegrationparameters_set_numInternalPgsIterations,
    rawintegrationparameters_set_numSolverIterations,
    rawintegrationparameters_switchToSmallStepsPgsSolver,
    rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart,
    rawintegrationparameters_switchToStandardPgsSolver,
    rawislandmanager_forEachActiveRigidBodyHandle,
    rawislandmanager_new,
    rawkinematiccharactercontroller_autostepEnabled,
    rawkinematiccharactercontroller_autostepIncludesDynamicBodies,
    rawkinematiccharactercontroller_autostepMaxHeight,
    rawkinematiccharactercontroller_autostepMinWidth,
    rawkinematiccharactercontroller_computeColliderMovement,
    rawkinematiccharactercontroller_computedCollision,
    rawkinematiccharactercontroller_computedGrounded,
    rawkinematiccharactercontroller_computedMovement,
    rawkinematiccharactercontroller_disableAutostep,
    rawkinematiccharactercontroller_disableSnapToGround,
    rawkinematiccharactercontroller_enableAutostep,
    rawkinematiccharactercontroller_enableSnapToGround,
    rawkinematiccharactercontroller_maxSlopeClimbAngle,
    rawkinematiccharactercontroller_minSlopeSlideAngle,
    rawkinematiccharactercontroller_new,
    rawkinematiccharactercontroller_normalNudgeFactor,
    rawkinematiccharactercontroller_numComputedCollisions,
    rawkinematiccharactercontroller_offset,
    rawkinematiccharactercontroller_setMaxSlopeClimbAngle,
    rawkinematiccharactercontroller_setMinSlopeSlideAngle,
    rawkinematiccharactercontroller_setNormalNudgeFactor,
    rawkinematiccharactercontroller_setOffset,
    rawkinematiccharactercontroller_setSlideEnabled,
    rawkinematiccharactercontroller_setUp,
    rawkinematiccharactercontroller_slideEnabled,
    rawkinematiccharactercontroller_snapToGroundDistance,
    rawkinematiccharactercontroller_snapToGroundEnabled,
    rawkinematiccharactercontroller_up,
    rawmultibodyjointset_contains,
    rawmultibodyjointset_createJoint,
    rawmultibodyjointset_forEachJointAttachedToRigidBody,
    rawmultibodyjointset_forEachJointHandle,
    rawmultibodyjointset_jointAnchor1,
    rawmultibodyjointset_jointAnchor2,
    rawmultibodyjointset_jointContactsEnabled,
    rawmultibodyjointset_jointFrameX1,
    rawmultibodyjointset_jointFrameX2,
    rawmultibodyjointset_jointLimitsEnabled,
    rawmultibodyjointset_jointLimitsMax,
    rawmultibodyjointset_jointLimitsMin,
    rawmultibodyjointset_jointSetContactsEnabled,
    rawmultibodyjointset_jointType,
    rawmultibodyjointset_new,
    rawmultibodyjointset_remove,
    rawnarrowphase_contact_pair,
    rawnarrowphase_contact_pairs_with,
    rawnarrowphase_intersection_pair,
    rawnarrowphase_intersection_pairs_with,
    rawnarrowphase_new,
    rawphysicspipeline_new,
    rawphysicspipeline_step,
    rawphysicspipeline_stepWithEvents,
    rawpidcontroller_angular_correction,
    rawpidcontroller_apply_angular_correction,
    rawpidcontroller_apply_linear_correction,
    rawpidcontroller_linear_correction,
    rawpidcontroller_new,
    rawpidcontroller_reset_integrals,
    rawpidcontroller_set_axes_mask,
    rawpidcontroller_set_kd,
    rawpidcontroller_set_ki,
    rawpidcontroller_set_kp,
    rawpointcolliderprojection_colliderHandle,
    rawpointcolliderprojection_featureId,
    rawpointcolliderprojection_featureType,
    rawpointcolliderprojection_isInside,
    rawpointcolliderprojection_point,
    rawpointprojection_isInside,
    rawpointprojection_point,
    rawquerypipeline_castRay,
    rawquerypipeline_castRayAndGetNormal,
    rawquerypipeline_castShape,
    rawquerypipeline_collidersWithAabbIntersectingAabb,
    rawquerypipeline_intersectionWithShape,
    rawquerypipeline_intersectionsWithPoint,
    rawquerypipeline_intersectionsWithRay,
    rawquerypipeline_intersectionsWithShape,
    rawquerypipeline_new,
    rawquerypipeline_projectPoint,
    rawquerypipeline_projectPointAndGetFeature,
    rawquerypipeline_update,
    rawraycolliderhit_colliderHandle,
    rawraycolliderhit_timeOfImpact,
    rawraycolliderintersection_colliderHandle,
    rawraycolliderintersection_featureId,
    rawraycolliderintersection_featureType,
    rawraycolliderintersection_normal,
    rawraycolliderintersection_time_of_impact,
    rawrayintersection_featureId,
    rawrayintersection_featureType,
    rawrayintersection_normal,
    rawrayintersection_time_of_impact,
    rawrigidbodyset_contains,
    rawrigidbodyset_createRigidBody,
    rawrigidbodyset_forEachRigidBodyHandle,
    rawrigidbodyset_len,
    rawrigidbodyset_new,
    rawrigidbodyset_propagateModifiedBodyPositionsToColliders,
    rawrigidbodyset_rbAddForce,
    rawrigidbodyset_rbAddForceAtPoint,
    rawrigidbodyset_rbAddTorque,
    rawrigidbodyset_rbAdditionalSolverIterations,
    rawrigidbodyset_rbAngularDamping,
    rawrigidbodyset_rbAngvel,
    rawrigidbodyset_rbApplyImpulse,
    rawrigidbodyset_rbApplyImpulseAtPoint,
    rawrigidbodyset_rbApplyTorqueImpulse,
    rawrigidbodyset_rbBodyType,
    rawrigidbodyset_rbCollider,
    rawrigidbodyset_rbDominanceGroup,
    rawrigidbodyset_rbEffectiveAngularInertia,
    rawrigidbodyset_rbEffectiveInvMass,
    rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt,
    rawrigidbodyset_rbEnableCcd,
    rawrigidbodyset_rbGravityScale,
    rawrigidbodyset_rbInvMass,
    rawrigidbodyset_rbInvPrincipalInertiaSqrt,
    rawrigidbodyset_rbIsCcdEnabled,
    rawrigidbodyset_rbIsDynamic,
    rawrigidbodyset_rbIsEnabled,
    rawrigidbodyset_rbIsFixed,
    rawrigidbodyset_rbIsKinematic,
    rawrigidbodyset_rbIsMoving,
    rawrigidbodyset_rbIsSleeping,
    rawrigidbodyset_rbLinearDamping,
    rawrigidbodyset_rbLinvel,
    rawrigidbodyset_rbLocalCom,
    rawrigidbodyset_rbLockRotations,
    rawrigidbodyset_rbLockTranslations,
    rawrigidbodyset_rbMass,
    rawrigidbodyset_rbNextRotation,
    rawrigidbodyset_rbNextTranslation,
    rawrigidbodyset_rbNumColliders,
    rawrigidbodyset_rbPrincipalInertia,
    rawrigidbodyset_rbPrincipalInertiaLocalFrame,
    rawrigidbodyset_rbRecomputeMassPropertiesFromColliders,
    rawrigidbodyset_rbResetForces,
    rawrigidbodyset_rbResetTorques,
    rawrigidbodyset_rbRotation,
    rawrigidbodyset_rbSetAdditionalMass,
    rawrigidbodyset_rbSetAdditionalMassProperties,
    rawrigidbodyset_rbSetAdditionalSolverIterations,
    rawrigidbodyset_rbSetAngularDamping,
    rawrigidbodyset_rbSetAngvel,
    rawrigidbodyset_rbSetBodyType,
    rawrigidbodyset_rbSetDominanceGroup,
    rawrigidbodyset_rbSetEnabled,
    rawrigidbodyset_rbSetEnabledRotations,
    rawrigidbodyset_rbSetEnabledTranslations,
    rawrigidbodyset_rbSetGravityScale,
    rawrigidbodyset_rbSetLinearDamping,
    rawrigidbodyset_rbSetLinvel,
    rawrigidbodyset_rbSetNextKinematicRotation,
    rawrigidbodyset_rbSetNextKinematicTranslation,
    rawrigidbodyset_rbSetRotation,
    rawrigidbodyset_rbSetSoftCcdPrediction,
    rawrigidbodyset_rbSetTranslation,
    rawrigidbodyset_rbSetUserData,
    rawrigidbodyset_rbSleep,
    rawrigidbodyset_rbSoftCcdPrediction,
    rawrigidbodyset_rbTranslation,
    rawrigidbodyset_rbUserData,
    rawrigidbodyset_rbUserForce,
    rawrigidbodyset_rbUserTorque,
    rawrigidbodyset_rbVelocityAtPoint,
    rawrigidbodyset_rbWakeUp,
    rawrigidbodyset_rbWorldCom,
    rawrigidbodyset_remove,
    rawrotation_identity,
    rawrotation_new,
    rawrotation_w,
    rawrotation_x,
    rawrotation_y,
    rawrotation_z,
    rawsdpmatrix3_elements,
    rawserializationpipeline_deserializeAll,
    rawserializationpipeline_new,
    rawserializationpipeline_serializeAll,
    rawshape_ball,
    rawshape_capsule,
    rawshape_castRay,
    rawshape_castRayAndGetNormal,
    rawshape_castShape,
    rawshape_cone,
    rawshape_contactShape,
    rawshape_containsPoint,
    rawshape_convexHull,
    rawshape_convexMesh,
    rawshape_cuboid,
    rawshape_cylinder,
    rawshape_halfspace,
    rawshape_heightfield,
    rawshape_intersectsRay,
    rawshape_intersectsShape,
    rawshape_polyline,
    rawshape_projectPoint,
    rawshape_roundCone,
    rawshape_roundConvexHull,
    rawshape_roundConvexMesh,
    rawshape_roundCuboid,
    rawshape_roundCylinder,
    rawshape_roundTriangle,
    rawshape_segment,
    rawshape_triangle,
    rawshape_trimesh,
    rawshape_voxels,
    rawshape_voxelsFromPoints,
    rawshapecasthit_normal1,
    rawshapecasthit_normal2,
    rawshapecasthit_time_of_impact,
    rawshapecasthit_witness1,
    rawshapecasthit_witness2,
    rawshapecontact_distance,
    rawshapecontact_normal1,
    rawshapecontact_normal2,
    rawshapecontact_point1,
    rawshapecontact_point2,
    rawvector_new,
    rawvector_set_x,
    rawvector_set_y,
    rawvector_set_z,
    rawvector_x,
    rawvector_xyz,
    rawvector_xzy,
    rawvector_y,
    rawvector_yxz,
    rawvector_yzx,
    rawvector_z,
    rawvector_zero,
    rawvector_zxy,
    rawvector_zyx,
    reserve_memory,
    version: version$1
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  __wbg_set_wasm(wasm);
  Vector3 = class {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  };
  VectorOps = class {
    static new(x, y, z) {
      return new Vector3(x, y, z);
    }
    static intoRaw(v) {
      return new RawVector(v.x, v.y, v.z);
    }
    static zeros() {
      return VectorOps.new(0, 0, 0);
    }
    static fromRaw(raw) {
      if (!raw) return null;
      let res = VectorOps.new(raw.x, raw.y, raw.z);
      raw.free();
      return res;
    }
    static copy(out, input) {
      out.x = input.x;
      out.y = input.y;
      out.z = input.z;
    }
  };
  Quaternion = class {
    constructor(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  };
  RotationOps = class {
    static identity() {
      return new Quaternion(0, 0, 0, 1);
    }
    static fromRaw(raw) {
      if (!raw) return null;
      let res = new Quaternion(raw.x, raw.y, raw.z, raw.w);
      raw.free();
      return res;
    }
    static intoRaw(rot) {
      return new RawRotation(rot.x, rot.y, rot.z, rot.w);
    }
    static copy(out, input) {
      out.x = input.x;
      out.y = input.y;
      out.z = input.z;
      out.w = input.w;
    }
  };
  SdpMatrix3 = class {
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
    constructor(elements) {
      this.elements = elements;
    }
  };
  SdpMatrix3Ops = class {
    static fromRaw(raw) {
      const sdpMatrix3 = new SdpMatrix3(raw.elements());
      raw.free();
      return sdpMatrix3;
    }
  };
  (function(RigidBodyType2) {
    RigidBodyType2[RigidBodyType2["Dynamic"] = 0] = "Dynamic";
    RigidBodyType2[RigidBodyType2["Fixed"] = 1] = "Fixed";
    RigidBodyType2[RigidBodyType2["KinematicPositionBased"] = 2] = "KinematicPositionBased";
    RigidBodyType2[RigidBodyType2["KinematicVelocityBased"] = 3] = "KinematicVelocityBased";
  })(RigidBodyType || (RigidBodyType = {}));
  RigidBody = class {
    constructor(rawSet, colliderSet, handle) {
      this.rawSet = rawSet;
      this.colliderSet = colliderSet;
      this.handle = handle;
    }
    finalizeDeserialization(colliderSet) {
      this.colliderSet = colliderSet;
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    lockTranslations(locked, wakeUp) {
      return this.rawSet.rbLockTranslations(this.handle, locked, wakeUp);
    }
    lockRotations(locked, wakeUp) {
      return this.rawSet.rbLockRotations(this.handle, locked, wakeUp);
    }
    setEnabledTranslations(enableX, enableY, enableZ, wakeUp) {
      return this.rawSet.rbSetEnabledTranslations(this.handle, enableX, enableY, enableZ, wakeUp);
    }
    restrictTranslations(enableX, enableY, enableZ, wakeUp) {
      this.setEnabledTranslations(enableX, enableY, enableZ, wakeUp);
    }
    setEnabledRotations(enableX, enableY, enableZ, wakeUp) {
      return this.rawSet.rbSetEnabledRotations(this.handle, enableX, enableY, enableZ, wakeUp);
    }
    restrictRotations(enableX, enableY, enableZ, wakeUp) {
      this.setEnabledRotations(enableX, enableY, enableZ, wakeUp);
    }
    dominanceGroup() {
      return this.rawSet.rbDominanceGroup(this.handle);
    }
    setDominanceGroup(group) {
      this.rawSet.rbSetDominanceGroup(this.handle, group);
    }
    additionalSolverIterations() {
      return this.rawSet.rbAdditionalSolverIterations(this.handle);
    }
    setAdditionalSolverIterations(iters) {
      this.rawSet.rbSetAdditionalSolverIterations(this.handle, iters);
    }
    enableCcd(enabled) {
      this.rawSet.rbEnableCcd(this.handle, enabled);
    }
    setSoftCcdPrediction(distance) {
      this.rawSet.rbSetSoftCcdPrediction(this.handle, distance);
    }
    softCcdPrediction() {
      return this.rawSet.rbSoftCcdPrediction(this.handle);
    }
    translation() {
      let res = this.rawSet.rbTranslation(this.handle);
      return VectorOps.fromRaw(res);
    }
    rotation() {
      let res = this.rawSet.rbRotation(this.handle);
      return RotationOps.fromRaw(res);
    }
    nextTranslation() {
      let res = this.rawSet.rbNextTranslation(this.handle);
      return VectorOps.fromRaw(res);
    }
    nextRotation() {
      let res = this.rawSet.rbNextRotation(this.handle);
      return RotationOps.fromRaw(res);
    }
    setTranslation(tra, wakeUp) {
      this.rawSet.rbSetTranslation(this.handle, tra.x, tra.y, tra.z, wakeUp);
    }
    setLinvel(vel, wakeUp) {
      let rawVel = VectorOps.intoRaw(vel);
      this.rawSet.rbSetLinvel(this.handle, rawVel, wakeUp);
      rawVel.free();
    }
    gravityScale() {
      return this.rawSet.rbGravityScale(this.handle);
    }
    setGravityScale(factor, wakeUp) {
      this.rawSet.rbSetGravityScale(this.handle, factor, wakeUp);
    }
    setRotation(rot, wakeUp) {
      this.rawSet.rbSetRotation(this.handle, rot.x, rot.y, rot.z, rot.w, wakeUp);
    }
    setAngvel(vel, wakeUp) {
      let rawVel = VectorOps.intoRaw(vel);
      this.rawSet.rbSetAngvel(this.handle, rawVel, wakeUp);
      rawVel.free();
    }
    setNextKinematicTranslation(t) {
      this.rawSet.rbSetNextKinematicTranslation(this.handle, t.x, t.y, t.z);
    }
    setNextKinematicRotation(rot) {
      this.rawSet.rbSetNextKinematicRotation(this.handle, rot.x, rot.y, rot.z, rot.w);
    }
    linvel() {
      return VectorOps.fromRaw(this.rawSet.rbLinvel(this.handle));
    }
    velocityAtPoint(point) {
      const rawPoint = VectorOps.intoRaw(point);
      let result = VectorOps.fromRaw(this.rawSet.rbVelocityAtPoint(this.handle, rawPoint));
      rawPoint.free();
      return result;
    }
    angvel() {
      return VectorOps.fromRaw(this.rawSet.rbAngvel(this.handle));
    }
    mass() {
      return this.rawSet.rbMass(this.handle);
    }
    effectiveInvMass() {
      return VectorOps.fromRaw(this.rawSet.rbEffectiveInvMass(this.handle));
    }
    invMass() {
      return this.rawSet.rbInvMass(this.handle);
    }
    localCom() {
      return VectorOps.fromRaw(this.rawSet.rbLocalCom(this.handle));
    }
    worldCom() {
      return VectorOps.fromRaw(this.rawSet.rbWorldCom(this.handle));
    }
    invPrincipalInertiaSqrt() {
      return VectorOps.fromRaw(this.rawSet.rbInvPrincipalInertiaSqrt(this.handle));
    }
    principalInertia() {
      return VectorOps.fromRaw(this.rawSet.rbPrincipalInertia(this.handle));
    }
    principalInertiaLocalFrame() {
      return RotationOps.fromRaw(this.rawSet.rbPrincipalInertiaLocalFrame(this.handle));
    }
    effectiveWorldInvInertiaSqrt() {
      return SdpMatrix3Ops.fromRaw(this.rawSet.rbEffectiveWorldInvInertiaSqrt(this.handle));
    }
    effectiveAngularInertia() {
      return SdpMatrix3Ops.fromRaw(this.rawSet.rbEffectiveAngularInertia(this.handle));
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
    collider(i) {
      return this.colliderSet.get(this.rawSet.rbCollider(this.handle, i));
    }
    setEnabled(enabled) {
      this.rawSet.rbSetEnabled(this.handle, enabled);
    }
    isEnabled() {
      return this.rawSet.rbIsEnabled(this.handle);
    }
    bodyType() {
      return this.rawSet.rbBodyType(this.handle);
    }
    setBodyType(type, wakeUp) {
      return this.rawSet.rbSetBodyType(this.handle, type, wakeUp);
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
    setLinearDamping(factor) {
      this.rawSet.rbSetLinearDamping(this.handle, factor);
    }
    recomputeMassPropertiesFromColliders() {
      this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
    }
    setAdditionalMass(mass, wakeUp) {
      this.rawSet.rbSetAdditionalMass(this.handle, mass, wakeUp);
    }
    setAdditionalMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame, wakeUp) {
      let rawCom = VectorOps.intoRaw(centerOfMass);
      let rawPrincipalInertia = VectorOps.intoRaw(principalAngularInertia);
      let rawInertiaFrame = RotationOps.intoRaw(angularInertiaLocalFrame);
      this.rawSet.rbSetAdditionalMassProperties(this.handle, mass, rawCom, rawPrincipalInertia, rawInertiaFrame, wakeUp);
      rawCom.free();
      rawPrincipalInertia.free();
      rawInertiaFrame.free();
    }
    setAngularDamping(factor) {
      this.rawSet.rbSetAngularDamping(this.handle, factor);
    }
    resetForces(wakeUp) {
      this.rawSet.rbResetForces(this.handle, wakeUp);
    }
    resetTorques(wakeUp) {
      this.rawSet.rbResetTorques(this.handle, wakeUp);
    }
    addForce(force, wakeUp) {
      const rawForce = VectorOps.intoRaw(force);
      this.rawSet.rbAddForce(this.handle, rawForce, wakeUp);
      rawForce.free();
    }
    applyImpulse(impulse, wakeUp) {
      const rawImpulse = VectorOps.intoRaw(impulse);
      this.rawSet.rbApplyImpulse(this.handle, rawImpulse, wakeUp);
      rawImpulse.free();
    }
    addTorque(torque, wakeUp) {
      const rawTorque = VectorOps.intoRaw(torque);
      this.rawSet.rbAddTorque(this.handle, rawTorque, wakeUp);
      rawTorque.free();
    }
    applyTorqueImpulse(torqueImpulse, wakeUp) {
      const rawTorqueImpulse = VectorOps.intoRaw(torqueImpulse);
      this.rawSet.rbApplyTorqueImpulse(this.handle, rawTorqueImpulse, wakeUp);
      rawTorqueImpulse.free();
    }
    addForceAtPoint(force, point, wakeUp) {
      const rawForce = VectorOps.intoRaw(force);
      const rawPoint = VectorOps.intoRaw(point);
      this.rawSet.rbAddForceAtPoint(this.handle, rawForce, rawPoint, wakeUp);
      rawForce.free();
      rawPoint.free();
    }
    applyImpulseAtPoint(impulse, point, wakeUp) {
      const rawImpulse = VectorOps.intoRaw(impulse);
      const rawPoint = VectorOps.intoRaw(point);
      this.rawSet.rbApplyImpulseAtPoint(this.handle, rawImpulse, rawPoint, wakeUp);
      rawImpulse.free();
      rawPoint.free();
    }
    userForce() {
      return VectorOps.fromRaw(this.rawSet.rbUserForce(this.handle));
    }
    userTorque() {
      return VectorOps.fromRaw(this.rawSet.rbUserTorque(this.handle));
    }
  };
  RigidBodyDesc = class {
    constructor(status) {
      this.enabled = true;
      this.status = status;
      this.translation = VectorOps.zeros();
      this.rotation = RotationOps.identity();
      this.gravityScale = 1;
      this.linvel = VectorOps.zeros();
      this.mass = 0;
      this.massOnly = false;
      this.centerOfMass = VectorOps.zeros();
      this.translationsEnabledX = true;
      this.translationsEnabledY = true;
      this.angvel = VectorOps.zeros();
      this.principalAngularInertia = VectorOps.zeros();
      this.angularInertiaLocalFrame = RotationOps.identity();
      this.translationsEnabledZ = true;
      this.rotationsEnabledX = true;
      this.rotationsEnabledY = true;
      this.rotationsEnabledZ = true;
      this.linearDamping = 0;
      this.angularDamping = 0;
      this.canSleep = true;
      this.sleeping = false;
      this.ccdEnabled = false;
      this.softCcdPrediction = 0;
      this.dominanceGroup = 0;
      this.additionalSolverIterations = 0;
    }
    static dynamic() {
      return new RigidBodyDesc(RigidBodyType.Dynamic);
    }
    static kinematicPositionBased() {
      return new RigidBodyDesc(RigidBodyType.KinematicPositionBased);
    }
    static kinematicVelocityBased() {
      return new RigidBodyDesc(RigidBodyType.KinematicVelocityBased);
    }
    static fixed() {
      return new RigidBodyDesc(RigidBodyType.Fixed);
    }
    static newDynamic() {
      return new RigidBodyDesc(RigidBodyType.Dynamic);
    }
    static newKinematicPositionBased() {
      return new RigidBodyDesc(RigidBodyType.KinematicPositionBased);
    }
    static newKinematicVelocityBased() {
      return new RigidBodyDesc(RigidBodyType.KinematicVelocityBased);
    }
    static newStatic() {
      return new RigidBodyDesc(RigidBodyType.Fixed);
    }
    setDominanceGroup(group) {
      this.dominanceGroup = group;
      return this;
    }
    setAdditionalSolverIterations(iters) {
      this.additionalSolverIterations = iters;
      return this;
    }
    setEnabled(enabled) {
      this.enabled = enabled;
      return this;
    }
    setTranslation(x, y, z) {
      if (typeof x != "number" || typeof y != "number" || typeof z != "number") throw TypeError("The translation components must be numbers.");
      this.translation = {
        x,
        y,
        z
      };
      return this;
    }
    setRotation(rot) {
      RotationOps.copy(this.rotation, rot);
      return this;
    }
    setGravityScale(scale) {
      this.gravityScale = scale;
      return this;
    }
    setAdditionalMass(mass) {
      this.mass = mass;
      this.massOnly = true;
      return this;
    }
    setLinvel(x, y, z) {
      if (typeof x != "number" || typeof y != "number" || typeof z != "number") throw TypeError("The linvel components must be numbers.");
      this.linvel = {
        x,
        y,
        z
      };
      return this;
    }
    setAngvel(vel) {
      VectorOps.copy(this.angvel, vel);
      return this;
    }
    setAdditionalMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame) {
      this.mass = mass;
      VectorOps.copy(this.centerOfMass, centerOfMass);
      VectorOps.copy(this.principalAngularInertia, principalAngularInertia);
      RotationOps.copy(this.angularInertiaLocalFrame, angularInertiaLocalFrame);
      this.massOnly = false;
      return this;
    }
    enabledTranslations(translationsEnabledX, translationsEnabledY, translationsEnabledZ) {
      this.translationsEnabledX = translationsEnabledX;
      this.translationsEnabledY = translationsEnabledY;
      this.translationsEnabledZ = translationsEnabledZ;
      return this;
    }
    restrictTranslations(translationsEnabledX, translationsEnabledY, translationsEnabledZ) {
      return this.enabledTranslations(translationsEnabledX, translationsEnabledY, translationsEnabledZ);
    }
    lockTranslations() {
      return this.enabledTranslations(false, false, false);
    }
    enabledRotations(rotationsEnabledX, rotationsEnabledY, rotationsEnabledZ) {
      this.rotationsEnabledX = rotationsEnabledX;
      this.rotationsEnabledY = rotationsEnabledY;
      this.rotationsEnabledZ = rotationsEnabledZ;
      return this;
    }
    restrictRotations(rotationsEnabledX, rotationsEnabledY, rotationsEnabledZ) {
      return this.enabledRotations(rotationsEnabledX, rotationsEnabledY, rotationsEnabledZ);
    }
    lockRotations() {
      return this.restrictRotations(false, false, false);
    }
    setLinearDamping(damping) {
      this.linearDamping = damping;
      return this;
    }
    setAngularDamping(damping) {
      this.angularDamping = damping;
      return this;
    }
    setCanSleep(can) {
      this.canSleep = can;
      return this;
    }
    setSleeping(sleeping) {
      this.sleeping = sleeping;
      return this;
    }
    setCcdEnabled(enabled) {
      this.ccdEnabled = enabled;
      return this;
    }
    setSoftCcdPrediction(distance) {
      this.softCcdPrediction = distance;
      return this;
    }
    setUserData(data) {
      this.userData = data;
      return this;
    }
  };
  class Coarena {
    constructor() {
      this.fconv = new Float64Array(1);
      this.uconv = new Uint32Array(this.fconv.buffer);
      this.data = new Array();
      this.size = 0;
    }
    set(handle, data) {
      let i = this.index(handle);
      while (this.data.length <= i) {
        this.data.push(null);
      }
      if (this.data[i] == null) this.size += 1;
      this.data[i] = data;
    }
    len() {
      return this.size;
    }
    delete(handle) {
      let i = this.index(handle);
      if (i < this.data.length) {
        if (this.data[i] != null) this.size -= 1;
        this.data[i] = null;
      }
    }
    clear() {
      this.data = new Array();
    }
    get(handle) {
      let i = this.index(handle);
      if (i < this.data.length) {
        return this.data[i];
      } else {
        return null;
      }
    }
    forEach(f) {
      for (const elt of this.data) {
        if (elt != null) f(elt);
      }
    }
    getAll() {
      return this.data.filter((elt) => elt != null);
    }
    index(handle) {
      this.fconv[0] = handle;
      return this.uconv[0];
    }
  }
  RigidBodySet = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
      if (!!this.map) {
        this.map.clear();
      }
      this.map = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawRigidBodySet();
      this.map = new Coarena();
      if (raw) {
        raw.forEachRigidBodyHandle((handle) => {
          this.map.set(handle, new RigidBody(raw, null, handle));
        });
      }
    }
    finalizeDeserialization(colliderSet) {
      this.map.forEach((rb) => rb.finalizeDeserialization(colliderSet));
    }
    createRigidBody(colliderSet, desc) {
      let rawTra = VectorOps.intoRaw(desc.translation);
      let rawRot = RotationOps.intoRaw(desc.rotation);
      let rawLv = VectorOps.intoRaw(desc.linvel);
      let rawCom = VectorOps.intoRaw(desc.centerOfMass);
      let rawAv = VectorOps.intoRaw(desc.angvel);
      let rawPrincipalInertia = VectorOps.intoRaw(desc.principalAngularInertia);
      let rawInertiaFrame = RotationOps.intoRaw(desc.angularInertiaLocalFrame);
      let handle = this.raw.createRigidBody(desc.enabled, rawTra, rawRot, desc.gravityScale, desc.mass, desc.massOnly, rawCom, rawLv, rawAv, rawPrincipalInertia, rawInertiaFrame, desc.translationsEnabledX, desc.translationsEnabledY, desc.translationsEnabledZ, desc.rotationsEnabledX, desc.rotationsEnabledY, desc.rotationsEnabledZ, desc.linearDamping, desc.angularDamping, desc.status, desc.canSleep, desc.sleeping, desc.softCcdPrediction, desc.ccdEnabled, desc.dominanceGroup, desc.additionalSolverIterations);
      rawTra.free();
      rawRot.free();
      rawLv.free();
      rawCom.free();
      rawAv.free();
      rawPrincipalInertia.free();
      rawInertiaFrame.free();
      const body = new RigidBody(this.raw, colliderSet, handle);
      body.userData = desc.userData;
      this.map.set(handle, body);
      return body;
    }
    remove(handle, islands, colliders, impulseJoints, multibodyJoints) {
      for (let i = 0; i < this.raw.rbNumColliders(handle); i += 1) {
        colliders.unmap(this.raw.rbCollider(handle, i));
      }
      impulseJoints.forEachJointHandleAttachedToRigidBody(handle, (handle2) => impulseJoints.unmap(handle2));
      multibodyJoints.forEachJointHandleAttachedToRigidBody(handle, (handle2) => multibodyJoints.unmap(handle2));
      this.raw.remove(handle, islands.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw);
      this.map.delete(handle);
    }
    len() {
      return this.map.len();
    }
    contains(handle) {
      return this.get(handle) != null;
    }
    get(handle) {
      return this.map.get(handle);
    }
    forEach(f) {
      this.map.forEach(f);
    }
    forEachActiveRigidBody(islands, f) {
      islands.forEachActiveRigidBodyHandle((handle) => {
        f(this.get(handle));
      });
    }
    getAll() {
      return this.map.getAll();
    }
  };
  IntegrationParameters = class {
    constructor(raw) {
      this.raw = raw || new RawIntegrationParameters();
    }
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
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
    set dt(value) {
      this.raw.dt = value;
    }
    set contact_natural_frequency(value) {
      this.raw.contact_natural_frequency = value;
    }
    set lengthUnit(value) {
      this.raw.lengthUnit = value;
    }
    set normalizedAllowedLinearError(value) {
      this.raw.normalizedAllowedLinearError = value;
    }
    set normalizedPredictionDistance(value) {
      this.raw.normalizedPredictionDistance = value;
    }
    set numSolverIterations(value) {
      this.raw.numSolverIterations = value;
    }
    set numAdditionalFrictionIterations(value) {
      this.raw.numAdditionalFrictionIterations = value;
    }
    set numInternalPgsIterations(value) {
      this.raw.numInternalPgsIterations = value;
    }
    set minIslandSize(value) {
      this.raw.minIslandSize = value;
    }
    set maxCcdSubsteps(value) {
      this.raw.maxCcdSubsteps = value;
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
  (function(JointType2) {
    JointType2[JointType2["Revolute"] = 0] = "Revolute";
    JointType2[JointType2["Fixed"] = 1] = "Fixed";
    JointType2[JointType2["Prismatic"] = 2] = "Prismatic";
    JointType2[JointType2["Rope"] = 3] = "Rope";
    JointType2[JointType2["Spring"] = 4] = "Spring";
    JointType2[JointType2["Spherical"] = 5] = "Spherical";
    JointType2[JointType2["Generic"] = 6] = "Generic";
  })(JointType || (JointType = {}));
  (function(MotorModel2) {
    MotorModel2[MotorModel2["AccelerationBased"] = 0] = "AccelerationBased";
    MotorModel2[MotorModel2["ForceBased"] = 1] = "ForceBased";
  })(MotorModel || (MotorModel = {}));
  (function(JointAxesMask2) {
    JointAxesMask2[JointAxesMask2["LinX"] = 1] = "LinX";
    JointAxesMask2[JointAxesMask2["LinY"] = 2] = "LinY";
    JointAxesMask2[JointAxesMask2["LinZ"] = 4] = "LinZ";
    JointAxesMask2[JointAxesMask2["AngX"] = 8] = "AngX";
    JointAxesMask2[JointAxesMask2["AngY"] = 16] = "AngY";
    JointAxesMask2[JointAxesMask2["AngZ"] = 32] = "AngZ";
  })(JointAxesMask || (JointAxesMask = {}));
  ImpulseJoint = class {
    constructor(rawSet, bodySet, handle) {
      this.rawSet = rawSet;
      this.bodySet = bodySet;
      this.handle = handle;
    }
    static newTyped(rawSet, bodySet, handle) {
      switch (rawSet.jointType(handle)) {
        case RawJointType.Revolute:
          return new RevoluteImpulseJoint(rawSet, bodySet, handle);
        case RawJointType.Prismatic:
          return new PrismaticImpulseJoint(rawSet, bodySet, handle);
        case RawJointType.Fixed:
          return new FixedImpulseJoint(rawSet, bodySet, handle);
        case RawJointType.Spring:
          return new SpringImpulseJoint(rawSet, bodySet, handle);
        case RawJointType.Rope:
          return new RopeImpulseJoint(rawSet, bodySet, handle);
        case RawJointType.Spherical:
          return new SphericalImpulseJoint(rawSet, bodySet, handle);
        case RawJointType.Generic:
          return new GenericImpulseJoint(rawSet, bodySet, handle);
        default:
          return new ImpulseJoint(rawSet, bodySet, handle);
      }
    }
    finalizeDeserialization(bodySet) {
      this.bodySet = bodySet;
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
      return RotationOps.fromRaw(this.rawSet.jointFrameX1(this.handle));
    }
    frameX2() {
      return RotationOps.fromRaw(this.rawSet.jointFrameX2(this.handle));
    }
    anchor1() {
      return VectorOps.fromRaw(this.rawSet.jointAnchor1(this.handle));
    }
    anchor2() {
      return VectorOps.fromRaw(this.rawSet.jointAnchor2(this.handle));
    }
    setAnchor1(newPos) {
      const rawPoint = VectorOps.intoRaw(newPos);
      this.rawSet.jointSetAnchor1(this.handle, rawPoint);
      rawPoint.free();
    }
    setAnchor2(newPos) {
      const rawPoint = VectorOps.intoRaw(newPos);
      this.rawSet.jointSetAnchor2(this.handle, rawPoint);
      rawPoint.free();
    }
    setContactsEnabled(enabled) {
      this.rawSet.jointSetContactsEnabled(this.handle, enabled);
    }
    contactsEnabled() {
      return this.rawSet.jointContactsEnabled(this.handle);
    }
  };
  UnitImpulseJoint = class extends ImpulseJoint {
    limitsEnabled() {
      return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
    }
    limitsMin() {
      return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
    }
    limitsMax() {
      return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
    }
    setLimits(min, max) {
      this.rawSet.jointSetLimits(this.handle, this.rawAxis(), min, max);
    }
    configureMotorModel(model) {
      this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), model);
    }
    configureMotorVelocity(targetVel, factor) {
      this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), targetVel, factor);
    }
    configureMotorPosition(targetPos, stiffness, damping) {
      this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), targetPos, stiffness, damping);
    }
    configureMotor(targetPos, targetVel, stiffness, damping) {
      this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), targetPos, targetVel, stiffness, damping);
    }
  };
  FixedImpulseJoint = class extends ImpulseJoint {
  };
  RopeImpulseJoint = class extends ImpulseJoint {
  };
  SpringImpulseJoint = class extends ImpulseJoint {
  };
  PrismaticImpulseJoint = class extends UnitImpulseJoint {
    rawAxis() {
      return RawJointAxis.LinX;
    }
  };
  RevoluteImpulseJoint = class extends UnitImpulseJoint {
    rawAxis() {
      return RawJointAxis.AngX;
    }
  };
  GenericImpulseJoint = class extends ImpulseJoint {
  };
  SphericalImpulseJoint = class extends ImpulseJoint {
  };
  JointData = class {
    constructor() {
    }
    static fixed(anchor1, frame1, anchor2, frame2) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.frame1 = frame1;
      res.frame2 = frame2;
      res.jointType = JointType.Fixed;
      return res;
    }
    static spring(rest_length, stiffness, damping, anchor1, anchor2) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.length = rest_length;
      res.stiffness = stiffness;
      res.damping = damping;
      res.jointType = JointType.Spring;
      return res;
    }
    static rope(length, anchor1, anchor2) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.length = length;
      res.jointType = JointType.Rope;
      return res;
    }
    static generic(anchor1, anchor2, axis, axesMask) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.axis = axis;
      res.axesMask = axesMask;
      res.jointType = JointType.Generic;
      return res;
    }
    static spherical(anchor1, anchor2) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.jointType = JointType.Spherical;
      return res;
    }
    static prismatic(anchor1, anchor2, axis) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.axis = axis;
      res.jointType = JointType.Prismatic;
      return res;
    }
    static revolute(anchor1, anchor2, axis) {
      let res = new JointData();
      res.anchor1 = anchor1;
      res.anchor2 = anchor2;
      res.axis = axis;
      res.jointType = JointType.Revolute;
      return res;
    }
    intoRaw() {
      let rawA1 = VectorOps.intoRaw(this.anchor1);
      let rawA2 = VectorOps.intoRaw(this.anchor2);
      let rawAx;
      let result;
      let limitsEnabled = false;
      let limitsMin = 0;
      let limitsMax = 0;
      switch (this.jointType) {
        case JointType.Fixed:
          let rawFra1 = RotationOps.intoRaw(this.frame1);
          let rawFra2 = RotationOps.intoRaw(this.frame2);
          result = RawGenericJoint.fixed(rawA1, rawFra1, rawA2, rawFra2);
          rawFra1.free();
          rawFra2.free();
          break;
        case JointType.Spring:
          result = RawGenericJoint.spring(this.length, this.stiffness, this.damping, rawA1, rawA2);
          break;
        case JointType.Rope:
          result = RawGenericJoint.rope(this.length, rawA1, rawA2);
          break;
        case JointType.Prismatic:
          rawAx = VectorOps.intoRaw(this.axis);
          if (!!this.limitsEnabled) {
            limitsEnabled = true;
            limitsMin = this.limits[0];
            limitsMax = this.limits[1];
          }
          result = RawGenericJoint.prismatic(rawA1, rawA2, rawAx, limitsEnabled, limitsMin, limitsMax);
          rawAx.free();
          break;
        case JointType.Generic:
          rawAx = VectorOps.intoRaw(this.axis);
          let rawAxesMask = this.axesMask;
          result = RawGenericJoint.generic(rawA1, rawA2, rawAx, rawAxesMask);
          break;
        case JointType.Spherical:
          result = RawGenericJoint.spherical(rawA1, rawA2);
          break;
        case JointType.Revolute:
          rawAx = VectorOps.intoRaw(this.axis);
          result = RawGenericJoint.revolute(rawA1, rawA2, rawAx);
          rawAx.free();
          break;
      }
      rawA1.free();
      rawA2.free();
      return result;
    }
  };
  ImpulseJointSet = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
      if (!!this.map) {
        this.map.clear();
      }
      this.map = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawImpulseJointSet();
      this.map = new Coarena();
      if (raw) {
        raw.forEachJointHandle((handle) => {
          this.map.set(handle, ImpulseJoint.newTyped(raw, null, handle));
        });
      }
    }
    finalizeDeserialization(bodies) {
      this.map.forEach((joint) => joint.finalizeDeserialization(bodies));
    }
    createJoint(bodies, desc, parent1, parent2, wakeUp) {
      const rawParams = desc.intoRaw();
      const handle = this.raw.createJoint(rawParams, parent1, parent2, wakeUp);
      rawParams.free();
      let joint = ImpulseJoint.newTyped(this.raw, bodies, handle);
      this.map.set(handle, joint);
      return joint;
    }
    remove(handle, wakeUp) {
      this.raw.remove(handle, wakeUp);
      this.unmap(handle);
    }
    forEachJointHandleAttachedToRigidBody(handle, f) {
      this.raw.forEachJointAttachedToRigidBody(handle, f);
    }
    unmap(handle) {
      this.map.delete(handle);
    }
    len() {
      return this.map.len();
    }
    contains(handle) {
      return this.get(handle) != null;
    }
    get(handle) {
      return this.map.get(handle);
    }
    forEach(f) {
      this.map.forEach(f);
    }
    getAll() {
      return this.map.getAll();
    }
  };
  MultibodyJoint = class {
    constructor(rawSet, handle) {
      this.rawSet = rawSet;
      this.handle = handle;
    }
    static newTyped(rawSet, handle) {
      switch (rawSet.jointType(handle)) {
        case RawJointType.Revolute:
          return new RevoluteMultibodyJoint(rawSet, handle);
        case RawJointType.Prismatic:
          return new PrismaticMultibodyJoint(rawSet, handle);
        case RawJointType.Fixed:
          return new FixedMultibodyJoint(rawSet, handle);
        case RawJointType.Spherical:
          return new SphericalMultibodyJoint(rawSet, handle);
        default:
          return new MultibodyJoint(rawSet, handle);
      }
    }
    isValid() {
      return this.rawSet.contains(this.handle);
    }
    setContactsEnabled(enabled) {
      this.rawSet.jointSetContactsEnabled(this.handle, enabled);
    }
    contactsEnabled() {
      return this.rawSet.jointContactsEnabled(this.handle);
    }
  };
  UnitMultibodyJoint = class extends MultibodyJoint {
  };
  FixedMultibodyJoint = class extends MultibodyJoint {
  };
  PrismaticMultibodyJoint = class extends UnitMultibodyJoint {
    rawAxis() {
      return RawJointAxis.LinX;
    }
  };
  RevoluteMultibodyJoint = class extends UnitMultibodyJoint {
    rawAxis() {
      return RawJointAxis.AngX;
    }
  };
  SphericalMultibodyJoint = class extends MultibodyJoint {
  };
  MultibodyJointSet = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
      if (!!this.map) {
        this.map.clear();
      }
      this.map = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawMultibodyJointSet();
      this.map = new Coarena();
      if (raw) {
        raw.forEachJointHandle((handle) => {
          this.map.set(handle, MultibodyJoint.newTyped(this.raw, handle));
        });
      }
    }
    createJoint(desc, parent1, parent2, wakeUp) {
      const rawParams = desc.intoRaw();
      const handle = this.raw.createJoint(rawParams, parent1, parent2, wakeUp);
      rawParams.free();
      let joint = MultibodyJoint.newTyped(this.raw, handle);
      this.map.set(handle, joint);
      return joint;
    }
    remove(handle, wake_up) {
      this.raw.remove(handle, wake_up);
      this.map.delete(handle);
    }
    unmap(handle) {
      this.map.delete(handle);
    }
    len() {
      return this.map.len();
    }
    contains(handle) {
      return this.get(handle) != null;
    }
    get(handle) {
      return this.map.get(handle);
    }
    forEach(f) {
      this.map.forEach(f);
    }
    forEachJointHandleAttachedToRigidBody(handle, f) {
      this.raw.forEachJointAttachedToRigidBody(handle, f);
    }
    getAll() {
      return this.map.getAll();
    }
  };
  (function(CoefficientCombineRule2) {
    CoefficientCombineRule2[CoefficientCombineRule2["Average"] = 0] = "Average";
    CoefficientCombineRule2[CoefficientCombineRule2["Min"] = 1] = "Min";
    CoefficientCombineRule2[CoefficientCombineRule2["Multiply"] = 2] = "Multiply";
    CoefficientCombineRule2[CoefficientCombineRule2["Max"] = 3] = "Max";
  })(CoefficientCombineRule || (CoefficientCombineRule = {}));
  CCDSolver = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawCCDSolver();
    }
  };
  IslandManager = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawIslandManager();
    }
    forEachActiveRigidBodyHandle(f) {
      this.raw.forEachActiveRigidBodyHandle(f);
    }
  };
  BroadPhase = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawBroadPhase();
    }
  };
  NarrowPhase = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawNarrowPhase();
      this.tempManifold = new TempContactManifold(null);
    }
    contactPairsWith(collider1, f) {
      this.raw.contact_pairs_with(collider1, f);
    }
    intersectionPairsWith(collider1, f) {
      this.raw.intersection_pairs_with(collider1, f);
    }
    contactPair(collider1, collider2, f) {
      const rawPair = this.raw.contact_pair(collider1, collider2);
      if (!!rawPair) {
        const flipped = rawPair.collider1() != collider1;
        let i;
        for (i = 0; i < rawPair.numContactManifolds(); ++i) {
          this.tempManifold.raw = rawPair.contactManifold(i);
          if (!!this.tempManifold.raw) {
            f(this.tempManifold, flipped);
          }
          this.tempManifold.free();
        }
        rawPair.free();
      }
    }
    intersectionPair(collider1, collider2) {
      return this.raw.intersection_pair(collider1, collider2);
    }
  };
  TempContactManifold = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw;
    }
    normal() {
      return VectorOps.fromRaw(this.raw.normal());
    }
    localNormal1() {
      return VectorOps.fromRaw(this.raw.local_n1());
    }
    localNormal2() {
      return VectorOps.fromRaw(this.raw.local_n2());
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
    localContactPoint1(i) {
      return VectorOps.fromRaw(this.raw.contact_local_p1(i));
    }
    localContactPoint2(i) {
      return VectorOps.fromRaw(this.raw.contact_local_p2(i));
    }
    contactDist(i) {
      return this.raw.contact_dist(i);
    }
    contactFid1(i) {
      return this.raw.contact_fid1(i);
    }
    contactFid2(i) {
      return this.raw.contact_fid2(i);
    }
    contactImpulse(i) {
      return this.raw.contact_impulse(i);
    }
    contactTangentImpulseX(i) {
      return this.raw.contact_tangent_impulse_x(i);
    }
    contactTangentImpulseY(i) {
      return this.raw.contact_tangent_impulse_y(i);
    }
    numSolverContacts() {
      return this.raw.num_solver_contacts();
    }
    solverContactPoint(i) {
      return VectorOps.fromRaw(this.raw.solver_contact_point(i));
    }
    solverContactDist(i) {
      return this.raw.solver_contact_dist(i);
    }
    solverContactFriction(i) {
      return this.raw.solver_contact_friction(i);
    }
    solverContactRestitution(i) {
      return this.raw.solver_contact_restitution(i);
    }
    solverContactTangentVelocity(i) {
      return VectorOps.fromRaw(this.raw.solver_contact_tangent_velocity(i));
    }
  };
  ShapeContact = class {
    constructor(dist, point1, point2, normal1, normal2) {
      this.distance = dist;
      this.point1 = point1;
      this.point2 = point2;
      this.normal1 = normal1;
      this.normal2 = normal2;
    }
    static fromRaw(raw) {
      if (!raw) return null;
      const result = new ShapeContact(raw.distance(), VectorOps.fromRaw(raw.point1()), VectorOps.fromRaw(raw.point2()), VectorOps.fromRaw(raw.normal1()), VectorOps.fromRaw(raw.normal2()));
      raw.free();
      return result;
    }
  };
  (function(FeatureType2) {
    FeatureType2[FeatureType2["Vertex"] = 0] = "Vertex";
    FeatureType2[FeatureType2["Edge"] = 1] = "Edge";
    FeatureType2[FeatureType2["Face"] = 2] = "Face";
    FeatureType2[FeatureType2["Unknown"] = 3] = "Unknown";
  })(FeatureType || (FeatureType = {}));
  PointProjection = class {
    constructor(point, isInside) {
      this.point = point;
      this.isInside = isInside;
    }
    static fromRaw(raw) {
      if (!raw) return null;
      const result = new PointProjection(VectorOps.fromRaw(raw.point()), raw.isInside());
      raw.free();
      return result;
    }
  };
  PointColliderProjection = class {
    constructor(collider, point, isInside, featureType, featureId) {
      this.featureType = FeatureType.Unknown;
      this.featureId = void 0;
      this.collider = collider;
      this.point = point;
      this.isInside = isInside;
      if (featureId !== void 0) this.featureId = featureId;
      if (featureType !== void 0) this.featureType = featureType;
    }
    static fromRaw(colliderSet, raw) {
      if (!raw) return null;
      const result = new PointColliderProjection(colliderSet.get(raw.colliderHandle()), VectorOps.fromRaw(raw.point()), raw.isInside(), raw.featureType(), raw.featureId());
      raw.free();
      return result;
    }
  };
  Ray = class {
    constructor(origin, dir) {
      this.origin = origin;
      this.dir = dir;
    }
    pointAt(t) {
      return {
        x: this.origin.x + this.dir.x * t,
        y: this.origin.y + this.dir.y * t,
        z: this.origin.z + this.dir.z * t
      };
    }
  };
  RayIntersection = class {
    constructor(timeOfImpact, normal, featureType, featureId) {
      this.featureType = FeatureType.Unknown;
      this.featureId = void 0;
      this.timeOfImpact = timeOfImpact;
      this.normal = normal;
      if (featureId !== void 0) this.featureId = featureId;
      if (featureType !== void 0) this.featureType = featureType;
    }
    static fromRaw(raw) {
      if (!raw) return null;
      const result = new RayIntersection(raw.time_of_impact(), VectorOps.fromRaw(raw.normal()), raw.featureType(), raw.featureId());
      raw.free();
      return result;
    }
  };
  RayColliderIntersection = class {
    constructor(collider, timeOfImpact, normal, featureType, featureId) {
      this.featureType = FeatureType.Unknown;
      this.featureId = void 0;
      this.collider = collider;
      this.timeOfImpact = timeOfImpact;
      this.normal = normal;
      if (featureId !== void 0) this.featureId = featureId;
      if (featureType !== void 0) this.featureType = featureType;
    }
    static fromRaw(colliderSet, raw) {
      if (!raw) return null;
      const result = new RayColliderIntersection(colliderSet.get(raw.colliderHandle()), raw.time_of_impact(), VectorOps.fromRaw(raw.normal()), raw.featureType(), raw.featureId());
      raw.free();
      return result;
    }
  };
  RayColliderHit = class {
    constructor(collider, timeOfImpact) {
      this.collider = collider;
      this.timeOfImpact = timeOfImpact;
    }
    static fromRaw(colliderSet, raw) {
      if (!raw) return null;
      const result = new RayColliderHit(colliderSet.get(raw.colliderHandle()), raw.timeOfImpact());
      raw.free();
      return result;
    }
  };
  ShapeCastHit = class {
    constructor(time_of_impact, witness1, witness2, normal1, normal2) {
      this.time_of_impact = time_of_impact;
      this.witness1 = witness1;
      this.witness2 = witness2;
      this.normal1 = normal1;
      this.normal2 = normal2;
    }
    static fromRaw(colliderSet, raw) {
      if (!raw) return null;
      const result = new ShapeCastHit(raw.time_of_impact(), VectorOps.fromRaw(raw.witness1()), VectorOps.fromRaw(raw.witness2()), VectorOps.fromRaw(raw.normal1()), VectorOps.fromRaw(raw.normal2()));
      raw.free();
      return result;
    }
  };
  ColliderShapeCastHit = class extends ShapeCastHit {
    constructor(collider, time_of_impact, witness1, witness2, normal1, normal2) {
      super(time_of_impact, witness1, witness2, normal1, normal2);
      this.collider = collider;
    }
    static fromRaw(colliderSet, raw) {
      if (!raw) return null;
      const result = new ColliderShapeCastHit(colliderSet.get(raw.colliderHandle()), raw.time_of_impact(), VectorOps.fromRaw(raw.witness1()), VectorOps.fromRaw(raw.witness2()), VectorOps.fromRaw(raw.normal1()), VectorOps.fromRaw(raw.normal2()));
      raw.free();
      return result;
    }
  };
  Shape = class {
    static fromRaw(rawSet, handle) {
      const rawType = rawSet.coShapeType(handle);
      let extents;
      let borderRadius;
      let vs;
      let indices;
      let halfHeight;
      let radius;
      let normal;
      switch (rawType) {
        case RawShapeType.Ball:
          return new Ball(rawSet.coRadius(handle));
        case RawShapeType.Cuboid:
          extents = rawSet.coHalfExtents(handle);
          return new Cuboid(extents.x, extents.y, extents.z);
        case RawShapeType.RoundCuboid:
          extents = rawSet.coHalfExtents(handle);
          borderRadius = rawSet.coRoundRadius(handle);
          return new RoundCuboid(extents.x, extents.y, extents.z, borderRadius);
        case RawShapeType.Capsule:
          halfHeight = rawSet.coHalfHeight(handle);
          radius = rawSet.coRadius(handle);
          return new Capsule(halfHeight, radius);
        case RawShapeType.Segment:
          vs = rawSet.coVertices(handle);
          return new Segment(VectorOps.new(vs[0], vs[1], vs[2]), VectorOps.new(vs[3], vs[4], vs[5]));
        case RawShapeType.Polyline:
          vs = rawSet.coVertices(handle);
          indices = rawSet.coIndices(handle);
          return new Polyline(vs, indices);
        case RawShapeType.Triangle:
          vs = rawSet.coVertices(handle);
          return new Triangle(VectorOps.new(vs[0], vs[1], vs[2]), VectorOps.new(vs[3], vs[4], vs[5]), VectorOps.new(vs[6], vs[7], vs[8]));
        case RawShapeType.RoundTriangle:
          vs = rawSet.coVertices(handle);
          borderRadius = rawSet.coRoundRadius(handle);
          return new RoundTriangle(VectorOps.new(vs[0], vs[1], vs[2]), VectorOps.new(vs[3], vs[4], vs[5]), VectorOps.new(vs[6], vs[7], vs[8]), borderRadius);
        case RawShapeType.HalfSpace:
          normal = VectorOps.fromRaw(rawSet.coHalfspaceNormal(handle));
          return new HalfSpace(normal);
        case RawShapeType.Voxels:
          const vox_data = rawSet.coVoxelData(handle);
          const vox_size = rawSet.coVoxelSize(handle);
          return new Voxels(vox_data, vox_size);
        case RawShapeType.TriMesh:
          vs = rawSet.coVertices(handle);
          indices = rawSet.coIndices(handle);
          const tri_flags = rawSet.coTriMeshFlags(handle);
          return new TriMesh(vs, indices, tri_flags);
        case RawShapeType.HeightField:
          const scale = rawSet.coHeightfieldScale(handle);
          const heights = rawSet.coHeightfieldHeights(handle);
          const nrows = rawSet.coHeightfieldNRows(handle);
          const ncols = rawSet.coHeightfieldNCols(handle);
          const hf_flags = rawSet.coHeightFieldFlags(handle);
          return new Heightfield(nrows, ncols, heights, scale, hf_flags);
        case RawShapeType.ConvexPolyhedron:
          vs = rawSet.coVertices(handle);
          indices = rawSet.coIndices(handle);
          return new ConvexPolyhedron(vs, indices);
        case RawShapeType.RoundConvexPolyhedron:
          vs = rawSet.coVertices(handle);
          indices = rawSet.coIndices(handle);
          borderRadius = rawSet.coRoundRadius(handle);
          return new RoundConvexPolyhedron(vs, indices, borderRadius);
        case RawShapeType.Cylinder:
          halfHeight = rawSet.coHalfHeight(handle);
          radius = rawSet.coRadius(handle);
          return new Cylinder(halfHeight, radius);
        case RawShapeType.RoundCylinder:
          halfHeight = rawSet.coHalfHeight(handle);
          radius = rawSet.coRadius(handle);
          borderRadius = rawSet.coRoundRadius(handle);
          return new RoundCylinder(halfHeight, radius, borderRadius);
        case RawShapeType.Cone:
          halfHeight = rawSet.coHalfHeight(handle);
          radius = rawSet.coRadius(handle);
          return new Cone(halfHeight, radius);
        case RawShapeType.RoundCone:
          halfHeight = rawSet.coHalfHeight(handle);
          radius = rawSet.coRadius(handle);
          borderRadius = rawSet.coRoundRadius(handle);
          return new RoundCone(halfHeight, radius, borderRadius);
        default:
          throw new Error("unknown shape type: " + rawType);
      }
    }
    castShape(shapePos1, shapeRot1, shapeVel1, shape2, shapePos2, shapeRot2, shapeVel2, targetDistance, maxToi, stopAtPenetration) {
      let rawPos1 = VectorOps.intoRaw(shapePos1);
      let rawRot1 = RotationOps.intoRaw(shapeRot1);
      let rawVel1 = VectorOps.intoRaw(shapeVel1);
      let rawPos2 = VectorOps.intoRaw(shapePos2);
      let rawRot2 = RotationOps.intoRaw(shapeRot2);
      let rawVel2 = VectorOps.intoRaw(shapeVel2);
      let rawShape1 = this.intoRaw();
      let rawShape2 = shape2.intoRaw();
      let result = ShapeCastHit.fromRaw(null, rawShape1.castShape(rawPos1, rawRot1, rawVel1, rawShape2, rawPos2, rawRot2, rawVel2, targetDistance, maxToi, stopAtPenetration));
      rawPos1.free();
      rawRot1.free();
      rawVel1.free();
      rawPos2.free();
      rawRot2.free();
      rawVel2.free();
      rawShape1.free();
      rawShape2.free();
      return result;
    }
    intersectsShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2) {
      let rawPos1 = VectorOps.intoRaw(shapePos1);
      let rawRot1 = RotationOps.intoRaw(shapeRot1);
      let rawPos2 = VectorOps.intoRaw(shapePos2);
      let rawRot2 = RotationOps.intoRaw(shapeRot2);
      let rawShape1 = this.intoRaw();
      let rawShape2 = shape2.intoRaw();
      let result = rawShape1.intersectsShape(rawPos1, rawRot1, rawShape2, rawPos2, rawRot2);
      rawPos1.free();
      rawRot1.free();
      rawPos2.free();
      rawRot2.free();
      rawShape1.free();
      rawShape2.free();
      return result;
    }
    contactShape(shapePos1, shapeRot1, shape2, shapePos2, shapeRot2, prediction) {
      let rawPos1 = VectorOps.intoRaw(shapePos1);
      let rawRot1 = RotationOps.intoRaw(shapeRot1);
      let rawPos2 = VectorOps.intoRaw(shapePos2);
      let rawRot2 = RotationOps.intoRaw(shapeRot2);
      let rawShape1 = this.intoRaw();
      let rawShape2 = shape2.intoRaw();
      let result = ShapeContact.fromRaw(rawShape1.contactShape(rawPos1, rawRot1, rawShape2, rawPos2, rawRot2, prediction));
      rawPos1.free();
      rawRot1.free();
      rawPos2.free();
      rawRot2.free();
      rawShape1.free();
      rawShape2.free();
      return result;
    }
    containsPoint(shapePos, shapeRot, point) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawPoint = VectorOps.intoRaw(point);
      let rawShape = this.intoRaw();
      let result = rawShape.containsPoint(rawPos, rawRot, rawPoint);
      rawPos.free();
      rawRot.free();
      rawPoint.free();
      rawShape.free();
      return result;
    }
    projectPoint(shapePos, shapeRot, point, solid) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawPoint = VectorOps.intoRaw(point);
      let rawShape = this.intoRaw();
      let result = PointProjection.fromRaw(rawShape.projectPoint(rawPos, rawRot, rawPoint, solid));
      rawPos.free();
      rawRot.free();
      rawPoint.free();
      rawShape.free();
      return result;
    }
    intersectsRay(ray, shapePos, shapeRot, maxToi) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawRayOrig = VectorOps.intoRaw(ray.origin);
      let rawRayDir = VectorOps.intoRaw(ray.dir);
      let rawShape = this.intoRaw();
      let result = rawShape.intersectsRay(rawPos, rawRot, rawRayOrig, rawRayDir, maxToi);
      rawPos.free();
      rawRot.free();
      rawRayOrig.free();
      rawRayDir.free();
      rawShape.free();
      return result;
    }
    castRay(ray, shapePos, shapeRot, maxToi, solid) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawRayOrig = VectorOps.intoRaw(ray.origin);
      let rawRayDir = VectorOps.intoRaw(ray.dir);
      let rawShape = this.intoRaw();
      let result = rawShape.castRay(rawPos, rawRot, rawRayOrig, rawRayDir, maxToi, solid);
      rawPos.free();
      rawRot.free();
      rawRayOrig.free();
      rawRayDir.free();
      rawShape.free();
      return result;
    }
    castRayAndGetNormal(ray, shapePos, shapeRot, maxToi, solid) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawRayOrig = VectorOps.intoRaw(ray.origin);
      let rawRayDir = VectorOps.intoRaw(ray.dir);
      let rawShape = this.intoRaw();
      let result = RayIntersection.fromRaw(rawShape.castRayAndGetNormal(rawPos, rawRot, rawRayOrig, rawRayDir, maxToi, solid));
      rawPos.free();
      rawRot.free();
      rawRayOrig.free();
      rawRayDir.free();
      rawShape.free();
      return result;
    }
  };
  (function(ShapeType2) {
    ShapeType2[ShapeType2["Ball"] = 0] = "Ball";
    ShapeType2[ShapeType2["Cuboid"] = 1] = "Cuboid";
    ShapeType2[ShapeType2["Capsule"] = 2] = "Capsule";
    ShapeType2[ShapeType2["Segment"] = 3] = "Segment";
    ShapeType2[ShapeType2["Polyline"] = 4] = "Polyline";
    ShapeType2[ShapeType2["Triangle"] = 5] = "Triangle";
    ShapeType2[ShapeType2["TriMesh"] = 6] = "TriMesh";
    ShapeType2[ShapeType2["HeightField"] = 7] = "HeightField";
    ShapeType2[ShapeType2["ConvexPolyhedron"] = 9] = "ConvexPolyhedron";
    ShapeType2[ShapeType2["Cylinder"] = 10] = "Cylinder";
    ShapeType2[ShapeType2["Cone"] = 11] = "Cone";
    ShapeType2[ShapeType2["RoundCuboid"] = 12] = "RoundCuboid";
    ShapeType2[ShapeType2["RoundTriangle"] = 13] = "RoundTriangle";
    ShapeType2[ShapeType2["RoundCylinder"] = 14] = "RoundCylinder";
    ShapeType2[ShapeType2["RoundCone"] = 15] = "RoundCone";
    ShapeType2[ShapeType2["RoundConvexPolyhedron"] = 16] = "RoundConvexPolyhedron";
    ShapeType2[ShapeType2["HalfSpace"] = 17] = "HalfSpace";
    ShapeType2[ShapeType2["Voxels"] = 18] = "Voxels";
  })(ShapeType || (ShapeType = {}));
  (function(HeightFieldFlags2) {
    HeightFieldFlags2[HeightFieldFlags2["FIX_INTERNAL_EDGES"] = 1] = "FIX_INTERNAL_EDGES";
  })(HeightFieldFlags || (HeightFieldFlags = {}));
  (function(TriMeshFlags2) {
    TriMeshFlags2[TriMeshFlags2["DELETE_BAD_TOPOLOGY_TRIANGLES"] = 4] = "DELETE_BAD_TOPOLOGY_TRIANGLES";
    TriMeshFlags2[TriMeshFlags2["ORIENTED"] = 8] = "ORIENTED";
    TriMeshFlags2[TriMeshFlags2["MERGE_DUPLICATE_VERTICES"] = 16] = "MERGE_DUPLICATE_VERTICES";
    TriMeshFlags2[TriMeshFlags2["DELETE_DEGENERATE_TRIANGLES"] = 32] = "DELETE_DEGENERATE_TRIANGLES";
    TriMeshFlags2[TriMeshFlags2["DELETE_DUPLICATE_TRIANGLES"] = 64] = "DELETE_DUPLICATE_TRIANGLES";
    TriMeshFlags2[TriMeshFlags2["FIX_INTERNAL_EDGES"] = 144] = "FIX_INTERNAL_EDGES";
  })(TriMeshFlags || (TriMeshFlags = {}));
  Ball = class extends Shape {
    constructor(radius) {
      super();
      this.type = ShapeType.Ball;
      this.radius = radius;
    }
    intoRaw() {
      return RawShape.ball(this.radius);
    }
  };
  HalfSpace = class extends Shape {
    constructor(normal) {
      super();
      this.type = ShapeType.HalfSpace;
      this.normal = normal;
    }
    intoRaw() {
      let n = VectorOps.intoRaw(this.normal);
      let result = RawShape.halfspace(n);
      n.free();
      return result;
    }
  };
  Cuboid = class extends Shape {
    constructor(hx, hy, hz) {
      super();
      this.type = ShapeType.Cuboid;
      this.halfExtents = VectorOps.new(hx, hy, hz);
    }
    intoRaw() {
      return RawShape.cuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z);
    }
  };
  RoundCuboid = class extends Shape {
    constructor(hx, hy, hz, borderRadius) {
      super();
      this.type = ShapeType.RoundCuboid;
      this.halfExtents = VectorOps.new(hx, hy, hz);
      this.borderRadius = borderRadius;
    }
    intoRaw() {
      return RawShape.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z, this.borderRadius);
    }
  };
  Capsule = class extends Shape {
    constructor(halfHeight, radius) {
      super();
      this.type = ShapeType.Capsule;
      this.halfHeight = halfHeight;
      this.radius = radius;
    }
    intoRaw() {
      return RawShape.capsule(this.halfHeight, this.radius);
    }
  };
  Segment = class extends Shape {
    constructor(a, b) {
      super();
      this.type = ShapeType.Segment;
      this.a = a;
      this.b = b;
    }
    intoRaw() {
      let ra = VectorOps.intoRaw(this.a);
      let rb = VectorOps.intoRaw(this.b);
      let result = RawShape.segment(ra, rb);
      ra.free();
      rb.free();
      return result;
    }
  };
  Triangle = class extends Shape {
    constructor(a, b, c) {
      super();
      this.type = ShapeType.Triangle;
      this.a = a;
      this.b = b;
      this.c = c;
    }
    intoRaw() {
      let ra = VectorOps.intoRaw(this.a);
      let rb = VectorOps.intoRaw(this.b);
      let rc = VectorOps.intoRaw(this.c);
      let result = RawShape.triangle(ra, rb, rc);
      ra.free();
      rb.free();
      rc.free();
      return result;
    }
  };
  RoundTriangle = class extends Shape {
    constructor(a, b, c, borderRadius) {
      super();
      this.type = ShapeType.RoundTriangle;
      this.a = a;
      this.b = b;
      this.c = c;
      this.borderRadius = borderRadius;
    }
    intoRaw() {
      let ra = VectorOps.intoRaw(this.a);
      let rb = VectorOps.intoRaw(this.b);
      let rc = VectorOps.intoRaw(this.c);
      let result = RawShape.roundTriangle(ra, rb, rc, this.borderRadius);
      ra.free();
      rb.free();
      rc.free();
      return result;
    }
  };
  Polyline = class extends Shape {
    constructor(vertices, indices) {
      super();
      this.type = ShapeType.Polyline;
      this.vertices = vertices;
      this.indices = indices !== null && indices !== void 0 ? indices : new Uint32Array(0);
    }
    intoRaw() {
      return RawShape.polyline(this.vertices, this.indices);
    }
  };
  Voxels = class extends Shape {
    constructor(data, voxelSize) {
      super();
      this.type = ShapeType.Voxels;
      this.data = data;
      this.voxelSize = voxelSize;
    }
    intoRaw() {
      let voxelSize = VectorOps.intoRaw(this.voxelSize);
      let result;
      if (this.data instanceof Int32Array) {
        result = RawShape.voxels(voxelSize, this.data);
      } else {
        result = RawShape.voxelsFromPoints(voxelSize, this.data);
      }
      voxelSize.free();
      return result;
    }
  };
  TriMesh = class extends Shape {
    constructor(vertices, indices, flags) {
      super();
      this.type = ShapeType.TriMesh;
      this.vertices = vertices;
      this.indices = indices;
      this.flags = flags;
    }
    intoRaw() {
      return RawShape.trimesh(this.vertices, this.indices, this.flags);
    }
  };
  ConvexPolyhedron = class extends Shape {
    constructor(vertices, indices) {
      super();
      this.type = ShapeType.ConvexPolyhedron;
      this.vertices = vertices;
      this.indices = indices;
    }
    intoRaw() {
      if (!!this.indices) {
        return RawShape.convexMesh(this.vertices, this.indices);
      } else {
        return RawShape.convexHull(this.vertices);
      }
    }
  };
  RoundConvexPolyhedron = class extends Shape {
    constructor(vertices, indices, borderRadius) {
      super();
      this.type = ShapeType.RoundConvexPolyhedron;
      this.vertices = vertices;
      this.indices = indices;
      this.borderRadius = borderRadius;
    }
    intoRaw() {
      if (!!this.indices) {
        return RawShape.roundConvexMesh(this.vertices, this.indices, this.borderRadius);
      } else {
        return RawShape.roundConvexHull(this.vertices, this.borderRadius);
      }
    }
  };
  Heightfield = class extends Shape {
    constructor(nrows, ncols, heights, scale, flags) {
      super();
      this.type = ShapeType.HeightField;
      this.nrows = nrows;
      this.ncols = ncols;
      this.heights = heights;
      this.scale = scale;
      this.flags = flags;
    }
    intoRaw() {
      let rawScale = VectorOps.intoRaw(this.scale);
      let rawShape = RawShape.heightfield(this.nrows, this.ncols, this.heights, rawScale, this.flags);
      rawScale.free();
      return rawShape;
    }
  };
  Cylinder = class extends Shape {
    constructor(halfHeight, radius) {
      super();
      this.type = ShapeType.Cylinder;
      this.halfHeight = halfHeight;
      this.radius = radius;
    }
    intoRaw() {
      return RawShape.cylinder(this.halfHeight, this.radius);
    }
  };
  RoundCylinder = class extends Shape {
    constructor(halfHeight, radius, borderRadius) {
      super();
      this.type = ShapeType.RoundCylinder;
      this.borderRadius = borderRadius;
      this.halfHeight = halfHeight;
      this.radius = radius;
    }
    intoRaw() {
      return RawShape.roundCylinder(this.halfHeight, this.radius, this.borderRadius);
    }
  };
  Cone = class extends Shape {
    constructor(halfHeight, radius) {
      super();
      this.type = ShapeType.Cone;
      this.halfHeight = halfHeight;
      this.radius = radius;
    }
    intoRaw() {
      return RawShape.cone(this.halfHeight, this.radius);
    }
  };
  RoundCone = class extends Shape {
    constructor(halfHeight, radius, borderRadius) {
      super();
      this.type = ShapeType.RoundCone;
      this.halfHeight = halfHeight;
      this.radius = radius;
      this.borderRadius = borderRadius;
    }
    intoRaw() {
      return RawShape.roundCone(this.halfHeight, this.radius, this.borderRadius);
    }
  };
  PhysicsPipeline = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawPhysicsPipeline();
    }
    step(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, impulseJoints, multibodyJoints, ccdSolver, eventQueue, hooks) {
      let rawG = VectorOps.intoRaw(gravity);
      if (!!eventQueue) {
        this.raw.stepWithEvents(rawG, integrationParameters.raw, islands.raw, broadPhase.raw, narrowPhase.raw, bodies.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw, ccdSolver.raw, eventQueue.raw, hooks, !!hooks ? hooks.filterContactPair : null, !!hooks ? hooks.filterIntersectionPair : null);
      } else {
        this.raw.step(rawG, integrationParameters.raw, islands.raw, broadPhase.raw, narrowPhase.raw, bodies.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw, ccdSolver.raw);
      }
      rawG.free();
    }
  };
  (function(QueryFilterFlags2) {
    QueryFilterFlags2[QueryFilterFlags2["EXCLUDE_FIXED"] = 1] = "EXCLUDE_FIXED";
    QueryFilterFlags2[QueryFilterFlags2["EXCLUDE_KINEMATIC"] = 2] = "EXCLUDE_KINEMATIC";
    QueryFilterFlags2[QueryFilterFlags2["EXCLUDE_DYNAMIC"] = 4] = "EXCLUDE_DYNAMIC";
    QueryFilterFlags2[QueryFilterFlags2["EXCLUDE_SENSORS"] = 8] = "EXCLUDE_SENSORS";
    QueryFilterFlags2[QueryFilterFlags2["EXCLUDE_SOLIDS"] = 16] = "EXCLUDE_SOLIDS";
    QueryFilterFlags2[QueryFilterFlags2["ONLY_DYNAMIC"] = 3] = "ONLY_DYNAMIC";
    QueryFilterFlags2[QueryFilterFlags2["ONLY_KINEMATIC"] = 5] = "ONLY_KINEMATIC";
    QueryFilterFlags2[QueryFilterFlags2["ONLY_FIXED"] = 6] = "ONLY_FIXED";
  })(QueryFilterFlags || (QueryFilterFlags = {}));
  QueryPipeline = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawQueryPipeline();
    }
    update(colliders) {
      this.raw.update(colliders.raw);
    }
    castRay(bodies, colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawOrig = VectorOps.intoRaw(ray.origin);
      let rawDir = VectorOps.intoRaw(ray.dir);
      let result = RayColliderHit.fromRaw(colliders, this.raw.castRay(bodies.raw, colliders.raw, rawOrig, rawDir, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
      rawOrig.free();
      rawDir.free();
      return result;
    }
    castRayAndGetNormal(bodies, colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawOrig = VectorOps.intoRaw(ray.origin);
      let rawDir = VectorOps.intoRaw(ray.dir);
      let result = RayColliderIntersection.fromRaw(colliders, this.raw.castRayAndGetNormal(bodies.raw, colliders.raw, rawOrig, rawDir, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
      rawOrig.free();
      rawDir.free();
      return result;
    }
    intersectionsWithRay(bodies, colliders, ray, maxToi, solid, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawOrig = VectorOps.intoRaw(ray.origin);
      let rawDir = VectorOps.intoRaw(ray.dir);
      let rawCallback = (rawInter) => {
        return callback(RayColliderIntersection.fromRaw(colliders, rawInter));
      };
      this.raw.intersectionsWithRay(bodies.raw, colliders.raw, rawOrig, rawDir, maxToi, solid, rawCallback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
      rawOrig.free();
      rawDir.free();
    }
    intersectionWithShape(bodies, colliders, shapePos, shapeRot, shape, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawShape = shape.intoRaw();
      let result = this.raw.intersectionWithShape(bodies.raw, colliders.raw, rawPos, rawRot, rawShape, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
      rawPos.free();
      rawRot.free();
      rawShape.free();
      return result;
    }
    projectPoint(bodies, colliders, point, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawPoint = VectorOps.intoRaw(point);
      let result = PointColliderProjection.fromRaw(colliders, this.raw.projectPoint(bodies.raw, colliders.raw, rawPoint, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
      rawPoint.free();
      return result;
    }
    projectPointAndGetFeature(bodies, colliders, point, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawPoint = VectorOps.intoRaw(point);
      let result = PointColliderProjection.fromRaw(colliders, this.raw.projectPointAndGetFeature(bodies.raw, colliders.raw, rawPoint, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
      rawPoint.free();
      return result;
    }
    intersectionsWithPoint(bodies, colliders, point, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawPoint = VectorOps.intoRaw(point);
      this.raw.intersectionsWithPoint(bodies.raw, colliders.raw, rawPoint, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
      rawPoint.free();
    }
    castShape(bodies, colliders, shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawVel = VectorOps.intoRaw(shapeVel);
      let rawShape = shape.intoRaw();
      let result = ColliderShapeCastHit.fromRaw(colliders, this.raw.castShape(bodies.raw, colliders.raw, rawPos, rawRot, rawVel, rawShape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate));
      rawPos.free();
      rawRot.free();
      rawVel.free();
      rawShape.free();
      return result;
    }
    intersectionsWithShape(bodies, colliders, shapePos, shapeRot, shape, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let rawPos = VectorOps.intoRaw(shapePos);
      let rawRot = RotationOps.intoRaw(shapeRot);
      let rawShape = shape.intoRaw();
      this.raw.intersectionsWithShape(bodies.raw, colliders.raw, rawPos, rawRot, rawShape, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate);
      rawPos.free();
      rawRot.free();
      rawShape.free();
    }
    collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, callback) {
      let rawCenter = VectorOps.intoRaw(aabbCenter);
      let rawHalfExtents = VectorOps.intoRaw(aabbHalfExtents);
      this.raw.collidersWithAabbIntersectingAabb(rawCenter, rawHalfExtents, callback);
      rawCenter.free();
      rawHalfExtents.free();
    }
  };
  SerializationPipeline = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawSerializationPipeline();
    }
    serializeAll(gravity, integrationParameters, islands, broadPhase, narrowPhase, bodies, colliders, impulseJoints, multibodyJoints) {
      let rawGra = VectorOps.intoRaw(gravity);
      const res = this.raw.serializeAll(rawGra, integrationParameters.raw, islands.raw, broadPhase.raw, narrowPhase.raw, bodies.raw, colliders.raw, impulseJoints.raw, multibodyJoints.raw);
      rawGra.free();
      return res;
    }
    deserializeAll(data) {
      return World.fromRaw(this.raw.deserializeAll(data));
    }
  };
  DebugRenderBuffers = class {
    constructor(vertices, colors) {
      this.vertices = vertices;
      this.colors = colors;
    }
  };
  DebugRenderPipeline = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
      this.vertices = void 0;
      this.colors = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawDebugRenderPipeline();
    }
    render(bodies, colliders, impulse_joints, multibody_joints, narrow_phase, filterFlags, filterPredicate) {
      this.raw.render(bodies.raw, colliders.raw, impulse_joints.raw, multibody_joints.raw, narrow_phase.raw, filterFlags, colliders.castClosure(filterPredicate));
      this.vertices = this.raw.vertices();
      this.colors = this.raw.colors();
    }
  };
  CharacterCollision = class {
  };
  KinematicCharacterController = class {
    constructor(offset, params, bodies, colliders, queries) {
      this.params = params;
      this.bodies = bodies;
      this.colliders = colliders;
      this.queries = queries;
      this.raw = new RawKinematicCharacterController(offset);
      this.rawCharacterCollision = new RawCharacterCollision();
      this._applyImpulsesToDynamicBodies = false;
      this._characterMass = null;
    }
    free() {
      if (!!this.raw) {
        this.raw.free();
        this.rawCharacterCollision.free();
      }
      this.raw = void 0;
      this.rawCharacterCollision = void 0;
    }
    up() {
      return this.raw.up();
    }
    setUp(vector) {
      let rawVect = VectorOps.intoRaw(vector);
      return this.raw.setUp(rawVect);
    }
    applyImpulsesToDynamicBodies() {
      return this._applyImpulsesToDynamicBodies;
    }
    setApplyImpulsesToDynamicBodies(enabled) {
      this._applyImpulsesToDynamicBodies = enabled;
    }
    characterMass() {
      return this._characterMass;
    }
    setCharacterMass(mass) {
      this._characterMass = mass;
    }
    offset() {
      return this.raw.offset();
    }
    setOffset(value) {
      this.raw.setOffset(value);
    }
    normalNudgeFactor() {
      return this.raw.normalNudgeFactor();
    }
    setNormalNudgeFactor(value) {
      this.raw.setNormalNudgeFactor(value);
    }
    slideEnabled() {
      return this.raw.slideEnabled();
    }
    setSlideEnabled(enabled) {
      this.raw.setSlideEnabled(enabled);
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
    enableAutostep(maxHeight, minWidth, includeDynamicBodies) {
      this.raw.enableAutostep(maxHeight, minWidth, includeDynamicBodies);
    }
    disableAutostep() {
      return this.raw.disableAutostep();
    }
    maxSlopeClimbAngle() {
      return this.raw.maxSlopeClimbAngle();
    }
    setMaxSlopeClimbAngle(angle) {
      this.raw.setMaxSlopeClimbAngle(angle);
    }
    minSlopeSlideAngle() {
      return this.raw.minSlopeSlideAngle();
    }
    setMinSlopeSlideAngle(angle) {
      this.raw.setMinSlopeSlideAngle(angle);
    }
    snapToGroundDistance() {
      return this.raw.snapToGroundDistance();
    }
    enableSnapToGround(distance) {
      this.raw.enableSnapToGround(distance);
    }
    disableSnapToGround() {
      this.raw.disableSnapToGround();
    }
    snapToGroundEnabled() {
      return this.raw.snapToGroundEnabled();
    }
    computeColliderMovement(collider, desiredTranslationDelta, filterFlags, filterGroups, filterPredicate) {
      let rawTranslationDelta = VectorOps.intoRaw(desiredTranslationDelta);
      this.raw.computeColliderMovement(this.params.dt, this.bodies.raw, this.colliders.raw, this.queries.raw, collider.handle, rawTranslationDelta, this._applyImpulsesToDynamicBodies, this._characterMass, filterFlags, filterGroups, this.colliders.castClosure(filterPredicate));
      rawTranslationDelta.free();
    }
    computedMovement() {
      return VectorOps.fromRaw(this.raw.computedMovement());
    }
    computedGrounded() {
      return this.raw.computedGrounded();
    }
    numComputedCollisions() {
      return this.raw.numComputedCollisions();
    }
    computedCollision(i, out) {
      if (!this.raw.computedCollision(i, this.rawCharacterCollision)) {
        return null;
      } else {
        let c = this.rawCharacterCollision;
        out = out !== null && out !== void 0 ? out : new CharacterCollision();
        out.translationDeltaApplied = VectorOps.fromRaw(c.translationDeltaApplied());
        out.translationDeltaRemaining = VectorOps.fromRaw(c.translationDeltaRemaining());
        out.toi = c.toi();
        out.witness1 = VectorOps.fromRaw(c.worldWitness1());
        out.witness2 = VectorOps.fromRaw(c.worldWitness2());
        out.normal1 = VectorOps.fromRaw(c.worldNormal1());
        out.normal2 = VectorOps.fromRaw(c.worldNormal2());
        out.collider = this.colliders.get(c.handle());
        return out;
      }
    }
  };
  (function(PidAxesMask2) {
    PidAxesMask2[PidAxesMask2["None"] = 0] = "None";
    PidAxesMask2[PidAxesMask2["LinX"] = 1] = "LinX";
    PidAxesMask2[PidAxesMask2["LinY"] = 2] = "LinY";
    PidAxesMask2[PidAxesMask2["LinZ"] = 4] = "LinZ";
    PidAxesMask2[PidAxesMask2["AngX"] = 8] = "AngX";
    PidAxesMask2[PidAxesMask2["AngY"] = 16] = "AngY";
    PidAxesMask2[PidAxesMask2["AngZ"] = 32] = "AngZ";
    PidAxesMask2[PidAxesMask2["AllLin"] = 7] = "AllLin";
    PidAxesMask2[PidAxesMask2["AllAng"] = 56] = "AllAng";
    PidAxesMask2[PidAxesMask2["All"] = 63] = "All";
  })(PidAxesMask || (PidAxesMask = {}));
  PidController = class {
    constructor(params, bodies, kp, ki, kd, axes) {
      this.params = params;
      this.bodies = bodies;
      this.raw = new RawPidController(kp, ki, kd, axes);
    }
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    setKp(kp, axes) {
      this.raw.set_kp(kp, axes);
    }
    setKi(ki, axes) {
      this.raw.set_kp(ki, axes);
    }
    setKd(kd, axes) {
      this.raw.set_kp(kd, axes);
    }
    setAxes(axes) {
      this.raw.set_axes_mask(axes);
    }
    resetIntegrals() {
      this.raw.reset_integrals();
    }
    applyLinearCorrection(body, targetPosition, targetLinvel) {
      let rawPos = VectorOps.intoRaw(targetPosition);
      let rawVel = VectorOps.intoRaw(targetLinvel);
      this.raw.apply_linear_correction(this.params.dt, this.bodies.raw, body.handle, rawPos, rawVel);
      rawPos.free();
      rawVel.free();
    }
    applyAngularCorrection(body, targetRotation, targetAngVel) {
      let rawPos = RotationOps.intoRaw(targetRotation);
      let rawVel = VectorOps.intoRaw(targetAngVel);
      this.raw.apply_angular_correction(this.params.dt, this.bodies.raw, body.handle, rawPos, rawVel);
      rawPos.free();
      rawVel.free();
    }
    linearCorrection(body, targetPosition, targetLinvel) {
      let rawPos = VectorOps.intoRaw(targetPosition);
      let rawVel = VectorOps.intoRaw(targetLinvel);
      let correction = this.raw.linear_correction(this.params.dt, this.bodies.raw, body.handle, rawPos, rawVel);
      rawPos.free();
      rawVel.free();
      return VectorOps.fromRaw(correction);
    }
    angularCorrection(body, targetRotation, targetAngVel) {
      let rawPos = RotationOps.intoRaw(targetRotation);
      let rawVel = VectorOps.intoRaw(targetAngVel);
      let correction = this.raw.angular_correction(this.params.dt, this.bodies.raw, body.handle, rawPos, rawVel);
      rawPos.free();
      rawVel.free();
      return VectorOps.fromRaw(correction);
    }
  };
  DynamicRayCastVehicleController = class {
    constructor(chassis, bodies, colliders, queries) {
      this.raw = new RawDynamicRayCastVehicleController(chassis.handle);
      this.bodies = bodies;
      this.colliders = colliders;
      this.queries = queries;
      this._chassis = chassis;
    }
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    updateVehicle(dt, filterFlags, filterGroups, filterPredicate) {
      this.raw.update_vehicle(dt, this.bodies.raw, this.colliders.raw, this.queries.raw, filterFlags, filterGroups, this.colliders.castClosure(filterPredicate));
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
    set indexUpAxis(axis) {
      this.raw.set_index_up_axis(axis);
    }
    get indexForwardAxis() {
      return this.raw.index_forward_axis();
    }
    set setIndexForwardAxis(axis) {
      this.raw.set_index_forward_axis(axis);
    }
    addWheel(chassisConnectionCs, directionCs, axleCs, suspensionRestLength, radius) {
      let rawChassisConnectionCs = VectorOps.intoRaw(chassisConnectionCs);
      let rawDirectionCs = VectorOps.intoRaw(directionCs);
      let rawAxleCs = VectorOps.intoRaw(axleCs);
      this.raw.add_wheel(rawChassisConnectionCs, rawDirectionCs, rawAxleCs, suspensionRestLength, radius);
      rawChassisConnectionCs.free();
      rawDirectionCs.free();
      rawAxleCs.free();
    }
    numWheels() {
      return this.raw.num_wheels();
    }
    wheelChassisConnectionPointCs(i) {
      return VectorOps.fromRaw(this.raw.wheel_chassis_connection_point_cs(i));
    }
    setWheelChassisConnectionPointCs(i, value) {
      let rawValue = VectorOps.intoRaw(value);
      this.raw.set_wheel_chassis_connection_point_cs(i, rawValue);
      rawValue.free();
    }
    wheelSuspensionRestLength(i) {
      return this.raw.wheel_suspension_rest_length(i);
    }
    setWheelSuspensionRestLength(i, value) {
      this.raw.set_wheel_suspension_rest_length(i, value);
    }
    wheelMaxSuspensionTravel(i) {
      return this.raw.wheel_max_suspension_travel(i);
    }
    setWheelMaxSuspensionTravel(i, value) {
      this.raw.set_wheel_max_suspension_travel(i, value);
    }
    wheelRadius(i) {
      return this.raw.wheel_radius(i);
    }
    setWheelRadius(i, value) {
      this.raw.set_wheel_radius(i, value);
    }
    wheelSuspensionStiffness(i) {
      return this.raw.wheel_suspension_stiffness(i);
    }
    setWheelSuspensionStiffness(i, value) {
      this.raw.set_wheel_suspension_stiffness(i, value);
    }
    wheelSuspensionCompression(i) {
      return this.raw.wheel_suspension_compression(i);
    }
    setWheelSuspensionCompression(i, value) {
      this.raw.set_wheel_suspension_compression(i, value);
    }
    wheelSuspensionRelaxation(i) {
      return this.raw.wheel_suspension_relaxation(i);
    }
    setWheelSuspensionRelaxation(i, value) {
      this.raw.set_wheel_suspension_relaxation(i, value);
    }
    wheelMaxSuspensionForce(i) {
      return this.raw.wheel_max_suspension_force(i);
    }
    setWheelMaxSuspensionForce(i, value) {
      this.raw.set_wheel_max_suspension_force(i, value);
    }
    wheelBrake(i) {
      return this.raw.wheel_brake(i);
    }
    setWheelBrake(i, value) {
      this.raw.set_wheel_brake(i, value);
    }
    wheelSteering(i) {
      return this.raw.wheel_steering(i);
    }
    setWheelSteering(i, value) {
      this.raw.set_wheel_steering(i, value);
    }
    wheelEngineForce(i) {
      return this.raw.wheel_engine_force(i);
    }
    setWheelEngineForce(i, value) {
      this.raw.set_wheel_engine_force(i, value);
    }
    wheelDirectionCs(i) {
      return VectorOps.fromRaw(this.raw.wheel_direction_cs(i));
    }
    setWheelDirectionCs(i, value) {
      let rawValue = VectorOps.intoRaw(value);
      this.raw.set_wheel_direction_cs(i, rawValue);
      rawValue.free();
    }
    wheelAxleCs(i) {
      return VectorOps.fromRaw(this.raw.wheel_axle_cs(i));
    }
    setWheelAxleCs(i, value) {
      let rawValue = VectorOps.intoRaw(value);
      this.raw.set_wheel_axle_cs(i, rawValue);
      rawValue.free();
    }
    wheelFrictionSlip(i) {
      return this.raw.wheel_friction_slip(i);
    }
    setWheelFrictionSlip(i, value) {
      this.raw.set_wheel_friction_slip(i, value);
    }
    wheelSideFrictionStiffness(i) {
      return this.raw.wheel_side_friction_stiffness(i);
    }
    setWheelSideFrictionStiffness(i, value) {
      this.raw.set_wheel_side_friction_stiffness(i, value);
    }
    wheelRotation(i) {
      return this.raw.wheel_rotation(i);
    }
    wheelForwardImpulse(i) {
      return this.raw.wheel_forward_impulse(i);
    }
    wheelSideImpulse(i) {
      return this.raw.wheel_side_impulse(i);
    }
    wheelSuspensionForce(i) {
      return this.raw.wheel_suspension_force(i);
    }
    wheelContactNormal(i) {
      return VectorOps.fromRaw(this.raw.wheel_contact_normal_ws(i));
    }
    wheelContactPoint(i) {
      return VectorOps.fromRaw(this.raw.wheel_contact_point_ws(i));
    }
    wheelSuspensionLength(i) {
      return this.raw.wheel_suspension_length(i);
    }
    wheelHardPoint(i) {
      return VectorOps.fromRaw(this.raw.wheel_hard_point_ws(i));
    }
    wheelIsInContact(i) {
      return this.raw.wheel_is_in_contact(i);
    }
    wheelGroundObject(i) {
      return this.colliders.get(this.raw.wheel_ground_object(i));
    }
  };
  World = class {
    free() {
      this.integrationParameters.free();
      this.islands.free();
      this.broadPhase.free();
      this.narrowPhase.free();
      this.bodies.free();
      this.colliders.free();
      this.impulseJoints.free();
      this.multibodyJoints.free();
      this.ccdSolver.free();
      this.queryPipeline.free();
      this.physicsPipeline.free();
      this.serializationPipeline.free();
      this.debugRenderPipeline.free();
      this.characterControllers.forEach((controller) => controller.free());
      this.pidControllers.forEach((controller) => controller.free());
      this.vehicleControllers.forEach((controller) => controller.free());
      this.integrationParameters = void 0;
      this.islands = void 0;
      this.broadPhase = void 0;
      this.narrowPhase = void 0;
      this.bodies = void 0;
      this.colliders = void 0;
      this.ccdSolver = void 0;
      this.impulseJoints = void 0;
      this.multibodyJoints = void 0;
      this.queryPipeline = void 0;
      this.physicsPipeline = void 0;
      this.serializationPipeline = void 0;
      this.debugRenderPipeline = void 0;
      this.characterControllers = void 0;
      this.pidControllers = void 0;
      this.vehicleControllers = void 0;
    }
    constructor(gravity, rawIntegrationParameters, rawIslands, rawBroadPhase, rawNarrowPhase, rawBodies, rawColliders, rawImpulseJoints, rawMultibodyJoints, rawCCDSolver, rawQueryPipeline, rawPhysicsPipeline, rawSerializationPipeline, rawDebugRenderPipeline) {
      this.gravity = gravity;
      this.integrationParameters = new IntegrationParameters(rawIntegrationParameters);
      this.islands = new IslandManager(rawIslands);
      this.broadPhase = new BroadPhase(rawBroadPhase);
      this.narrowPhase = new NarrowPhase(rawNarrowPhase);
      this.bodies = new RigidBodySet(rawBodies);
      this.colliders = new ColliderSet(rawColliders);
      this.impulseJoints = new ImpulseJointSet(rawImpulseJoints);
      this.multibodyJoints = new MultibodyJointSet(rawMultibodyJoints);
      this.ccdSolver = new CCDSolver(rawCCDSolver);
      this.queryPipeline = new QueryPipeline(rawQueryPipeline);
      this.physicsPipeline = new PhysicsPipeline(rawPhysicsPipeline);
      this.serializationPipeline = new SerializationPipeline(rawSerializationPipeline);
      this.debugRenderPipeline = new DebugRenderPipeline(rawDebugRenderPipeline);
      this.characterControllers = /* @__PURE__ */ new Set();
      this.pidControllers = /* @__PURE__ */ new Set();
      this.vehicleControllers = /* @__PURE__ */ new Set();
      this.impulseJoints.finalizeDeserialization(this.bodies);
      this.bodies.finalizeDeserialization(this.colliders);
      this.colliders.finalizeDeserialization(this.bodies);
    }
    static fromRaw(raw) {
      if (!raw) return null;
      return new World(VectorOps.fromRaw(raw.takeGravity()), raw.takeIntegrationParameters(), raw.takeIslandManager(), raw.takeBroadPhase(), raw.takeNarrowPhase(), raw.takeBodies(), raw.takeColliders(), raw.takeImpulseJoints(), raw.takeMultibodyJoints());
    }
    takeSnapshot() {
      return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
    }
    static restoreSnapshot(data) {
      let deser = new SerializationPipeline();
      return deser.deserializeAll(data);
    }
    debugRender(filterFlags, filterPredicate) {
      this.debugRenderPipeline.render(this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.narrowPhase, filterFlags, filterPredicate);
      return new DebugRenderBuffers(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
    }
    step(eventQueue, hooks) {
      this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.ccdSolver, eventQueue, hooks);
      this.queryPipeline.update(this.colliders);
    }
    propagateModifiedBodyPositionsToColliders() {
      this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
    }
    updateSceneQueries() {
      this.propagateModifiedBodyPositionsToColliders();
      this.queryPipeline.update(this.colliders);
    }
    get timestep() {
      return this.integrationParameters.dt;
    }
    set timestep(dt) {
      this.integrationParameters.dt = dt;
    }
    get lengthUnit() {
      return this.integrationParameters.lengthUnit;
    }
    set lengthUnit(unitsPerMeter) {
      this.integrationParameters.lengthUnit = unitsPerMeter;
    }
    get numSolverIterations() {
      return this.integrationParameters.numSolverIterations;
    }
    set numSolverIterations(niter) {
      this.integrationParameters.numSolverIterations = niter;
    }
    get numAdditionalFrictionIterations() {
      return this.integrationParameters.numAdditionalFrictionIterations;
    }
    set numAdditionalFrictionIterations(niter) {
      this.integrationParameters.numAdditionalFrictionIterations = niter;
    }
    get numInternalPgsIterations() {
      return this.integrationParameters.numInternalPgsIterations;
    }
    set numInternalPgsIterations(niter) {
      this.integrationParameters.numInternalPgsIterations = niter;
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
    createRigidBody(body) {
      return this.bodies.createRigidBody(this.colliders, body);
    }
    createCharacterController(offset) {
      let controller = new KinematicCharacterController(offset, this.integrationParameters, this.bodies, this.colliders, this.queryPipeline);
      this.characterControllers.add(controller);
      return controller;
    }
    removeCharacterController(controller) {
      this.characterControllers.delete(controller);
      controller.free();
    }
    createPidController(kp, ki, kd, axes) {
      let controller = new PidController(this.integrationParameters, this.bodies, kp, ki, kd, axes);
      this.pidControllers.add(controller);
      return controller;
    }
    removePidController(controller) {
      this.pidControllers.delete(controller);
      controller.free();
    }
    createVehicleController(chassis) {
      let controller = new DynamicRayCastVehicleController(chassis, this.bodies, this.colliders, this.queryPipeline);
      this.vehicleControllers.add(controller);
      return controller;
    }
    removeVehicleController(controller) {
      this.vehicleControllers.delete(controller);
      controller.free();
    }
    createCollider(desc, parent) {
      let parentHandle = parent ? parent.handle : void 0;
      return this.colliders.createCollider(this.bodies, desc, parentHandle);
    }
    createImpulseJoint(params, parent1, parent2, wakeUp) {
      return this.impulseJoints.createJoint(this.bodies, params, parent1.handle, parent2.handle, wakeUp);
    }
    createMultibodyJoint(params, parent1, parent2, wakeUp) {
      return this.multibodyJoints.createJoint(params, parent1.handle, parent2.handle, wakeUp);
    }
    getRigidBody(handle) {
      return this.bodies.get(handle);
    }
    getCollider(handle) {
      return this.colliders.get(handle);
    }
    getImpulseJoint(handle) {
      return this.impulseJoints.get(handle);
    }
    getMultibodyJoint(handle) {
      return this.multibodyJoints.get(handle);
    }
    removeRigidBody(body) {
      if (this.bodies) {
        this.bodies.remove(body.handle, this.islands, this.colliders, this.impulseJoints, this.multibodyJoints);
      }
    }
    removeCollider(collider, wakeUp) {
      if (this.colliders) {
        this.colliders.remove(collider.handle, this.islands, this.bodies, wakeUp);
      }
    }
    removeImpulseJoint(joint, wakeUp) {
      if (this.impulseJoints) {
        this.impulseJoints.remove(joint.handle, wakeUp);
      }
    }
    removeMultibodyJoint(joint, wakeUp) {
      if (this.impulseJoints) {
        this.multibodyJoints.remove(joint.handle, wakeUp);
      }
    }
    forEachCollider(f) {
      this.colliders.forEach(f);
    }
    forEachRigidBody(f) {
      this.bodies.forEach(f);
    }
    forEachActiveRigidBody(f) {
      this.bodies.forEachActiveRigidBody(this.islands, f);
    }
    castRay(ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      return this.queryPipeline.castRay(this.bodies, this.colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    castRayAndGetNormal(ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      return this.queryPipeline.castRayAndGetNormal(this.bodies, this.colliders, ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    intersectionsWithRay(ray, maxToi, solid, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      this.queryPipeline.intersectionsWithRay(this.bodies, this.colliders, ray, maxToi, solid, callback, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    intersectionWithShape(shapePos, shapeRot, shape, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      let handle = this.queryPipeline.intersectionWithShape(this.bodies, this.colliders, shapePos, shapeRot, shape, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
      return handle != null ? this.colliders.get(handle) : null;
    }
    projectPoint(point, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      return this.queryPipeline.projectPoint(this.bodies, this.colliders, point, solid, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    projectPointAndGetFeature(point, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      return this.queryPipeline.projectPointAndGetFeature(this.bodies, this.colliders, point, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    intersectionsWithPoint(point, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      this.queryPipeline.intersectionsWithPoint(this.bodies, this.colliders, point, this.colliders.castClosure(callback), filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    castShape(shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      return this.queryPipeline.castShape(this.bodies, this.colliders, shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    intersectionsWithShape(shapePos, shapeRot, shape, callback, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody, filterPredicate) {
      this.queryPipeline.intersectionsWithShape(this.bodies, this.colliders, shapePos, shapeRot, shape, this.colliders.castClosure(callback), filterFlags, filterGroups, filterExcludeCollider ? filterExcludeCollider.handle : null, filterExcludeRigidBody ? filterExcludeRigidBody.handle : null, this.colliders.castClosure(filterPredicate));
    }
    collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, callback) {
      this.queryPipeline.collidersWithAabbIntersectingAabb(aabbCenter, aabbHalfExtents, this.colliders.castClosure(callback));
    }
    contactPairsWith(collider1, f) {
      this.narrowPhase.contactPairsWith(collider1.handle, this.colliders.castClosure(f));
    }
    intersectionPairsWith(collider1, f) {
      this.narrowPhase.intersectionPairsWith(collider1.handle, this.colliders.castClosure(f));
    }
    contactPair(collider1, collider2, f) {
      this.narrowPhase.contactPair(collider1.handle, collider2.handle, f);
    }
    intersectionPair(collider1, collider2) {
      return this.narrowPhase.intersectionPair(collider1.handle, collider2.handle);
    }
  };
  (function(ActiveEvents2) {
    ActiveEvents2[ActiveEvents2["NONE"] = 0] = "NONE";
    ActiveEvents2[ActiveEvents2["COLLISION_EVENTS"] = 1] = "COLLISION_EVENTS";
    ActiveEvents2[ActiveEvents2["CONTACT_FORCE_EVENTS"] = 2] = "CONTACT_FORCE_EVENTS";
  })(ActiveEvents || (ActiveEvents = {}));
  TempContactForceEvent = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    collider1() {
      return this.raw.collider1();
    }
    collider2() {
      return this.raw.collider2();
    }
    totalForce() {
      return VectorOps.fromRaw(this.raw.total_force());
    }
    totalForceMagnitude() {
      return this.raw.total_force_magnitude();
    }
    maxForceDirection() {
      return VectorOps.fromRaw(this.raw.max_force_direction());
    }
    maxForceMagnitude() {
      return this.raw.max_force_magnitude();
    }
  };
  EventQueue = class {
    constructor(autoDrain, raw) {
      this.raw = raw || new RawEventQueue(autoDrain);
    }
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
    }
    drainCollisionEvents(f) {
      this.raw.drainCollisionEvents(f);
    }
    drainContactForceEvents(f) {
      let event = new TempContactForceEvent();
      this.raw.drainContactForceEvents((raw) => {
        event.raw = raw;
        f(event);
        event.free();
      });
    }
    clear() {
      this.raw.clear();
    }
  };
  (function(ActiveHooks2) {
    ActiveHooks2[ActiveHooks2["NONE"] = 0] = "NONE";
    ActiveHooks2[ActiveHooks2["FILTER_CONTACT_PAIRS"] = 1] = "FILTER_CONTACT_PAIRS";
    ActiveHooks2[ActiveHooks2["FILTER_INTERSECTION_PAIRS"] = 2] = "FILTER_INTERSECTION_PAIRS";
  })(ActiveHooks || (ActiveHooks = {}));
  (function(SolverFlags2) {
    SolverFlags2[SolverFlags2["EMPTY"] = 0] = "EMPTY";
    SolverFlags2[SolverFlags2["COMPUTE_IMPULSE"] = 1] = "COMPUTE_IMPULSE";
  })(SolverFlags || (SolverFlags = {}));
  (function(ActiveCollisionTypes2) {
    ActiveCollisionTypes2[ActiveCollisionTypes2["DYNAMIC_DYNAMIC"] = 1] = "DYNAMIC_DYNAMIC";
    ActiveCollisionTypes2[ActiveCollisionTypes2["DYNAMIC_KINEMATIC"] = 12] = "DYNAMIC_KINEMATIC";
    ActiveCollisionTypes2[ActiveCollisionTypes2["DYNAMIC_FIXED"] = 2] = "DYNAMIC_FIXED";
    ActiveCollisionTypes2[ActiveCollisionTypes2["KINEMATIC_KINEMATIC"] = 52224] = "KINEMATIC_KINEMATIC";
    ActiveCollisionTypes2[ActiveCollisionTypes2["KINEMATIC_FIXED"] = 8704] = "KINEMATIC_FIXED";
    ActiveCollisionTypes2[ActiveCollisionTypes2["FIXED_FIXED"] = 32] = "FIXED_FIXED";
    ActiveCollisionTypes2[ActiveCollisionTypes2["DEFAULT"] = 15] = "DEFAULT";
    ActiveCollisionTypes2[ActiveCollisionTypes2["ALL"] = 60943] = "ALL";
  })(ActiveCollisionTypes || (ActiveCollisionTypes = {}));
  Collider = class {
    constructor(colliderSet, handle, parent, shape) {
      this.colliderSet = colliderSet;
      this.handle = handle;
      this._parent = parent;
      this._shape = shape;
    }
    finalizeDeserialization(bodies) {
      if (this.handle != null) {
        this._parent = bodies.get(this.colliderSet.raw.coParent(this.handle));
      }
    }
    ensureShapeIsCached() {
      if (!this._shape) this._shape = Shape.fromRaw(this.colliderSet.raw, this.handle);
    }
    get shape() {
      this.ensureShapeIsCached();
      return this._shape;
    }
    clearShapeCache() {
      this._shape = null;
    }
    isValid() {
      return this.colliderSet.raw.contains(this.handle);
    }
    translation() {
      return VectorOps.fromRaw(this.colliderSet.raw.coTranslation(this.handle));
    }
    rotation() {
      return RotationOps.fromRaw(this.colliderSet.raw.coRotation(this.handle));
    }
    isSensor() {
      return this.colliderSet.raw.coIsSensor(this.handle);
    }
    setSensor(isSensor) {
      this.colliderSet.raw.coSetSensor(this.handle, isSensor);
    }
    setShape(shape) {
      let rawShape = shape.intoRaw();
      this.colliderSet.raw.coSetShape(this.handle, rawShape);
      rawShape.free();
      this._shape = shape;
    }
    setEnabled(enabled) {
      this.colliderSet.raw.coSetEnabled(this.handle, enabled);
    }
    isEnabled() {
      return this.colliderSet.raw.coIsEnabled(this.handle);
    }
    setRestitution(restitution) {
      this.colliderSet.raw.coSetRestitution(this.handle, restitution);
    }
    setFriction(friction) {
      this.colliderSet.raw.coSetFriction(this.handle, friction);
    }
    frictionCombineRule() {
      return this.colliderSet.raw.coFrictionCombineRule(this.handle);
    }
    setFrictionCombineRule(rule) {
      this.colliderSet.raw.coSetFrictionCombineRule(this.handle, rule);
    }
    restitutionCombineRule() {
      return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
    }
    setRestitutionCombineRule(rule) {
      this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, rule);
    }
    setCollisionGroups(groups) {
      this.colliderSet.raw.coSetCollisionGroups(this.handle, groups);
    }
    setSolverGroups(groups) {
      this.colliderSet.raw.coSetSolverGroups(this.handle, groups);
    }
    contactSkin() {
      return this.colliderSet.raw.coContactSkin(this.handle);
    }
    setContactSkin(thickness) {
      return this.colliderSet.raw.coSetContactSkin(this.handle, thickness);
    }
    activeHooks() {
      return this.colliderSet.raw.coActiveHooks(this.handle);
    }
    setActiveHooks(activeHooks) {
      this.colliderSet.raw.coSetActiveHooks(this.handle, activeHooks);
    }
    activeEvents() {
      return this.colliderSet.raw.coActiveEvents(this.handle);
    }
    setActiveEvents(activeEvents) {
      this.colliderSet.raw.coSetActiveEvents(this.handle, activeEvents);
    }
    activeCollisionTypes() {
      return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
    }
    setContactForceEventThreshold(threshold) {
      return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, threshold);
    }
    contactForceEventThreshold() {
      return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
    }
    setActiveCollisionTypes(activeCollisionTypes) {
      this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, activeCollisionTypes);
    }
    setDensity(density) {
      this.colliderSet.raw.coSetDensity(this.handle, density);
    }
    setMass(mass) {
      this.colliderSet.raw.coSetMass(this.handle, mass);
    }
    setMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame) {
      let rawCom = VectorOps.intoRaw(centerOfMass);
      let rawPrincipalInertia = VectorOps.intoRaw(principalAngularInertia);
      let rawInertiaFrame = RotationOps.intoRaw(angularInertiaLocalFrame);
      this.colliderSet.raw.coSetMassProperties(this.handle, mass, rawCom, rawPrincipalInertia, rawInertiaFrame);
      rawCom.free();
      rawPrincipalInertia.free();
      rawInertiaFrame.free();
    }
    setTranslation(tra) {
      this.colliderSet.raw.coSetTranslation(this.handle, tra.x, tra.y, tra.z);
    }
    setTranslationWrtParent(tra) {
      this.colliderSet.raw.coSetTranslationWrtParent(this.handle, tra.x, tra.y, tra.z);
    }
    setRotation(rot) {
      this.colliderSet.raw.coSetRotation(this.handle, rot.x, rot.y, rot.z, rot.w);
    }
    setRotationWrtParent(rot) {
      this.colliderSet.raw.coSetRotationWrtParent(this.handle, rot.x, rot.y, rot.z, rot.w);
    }
    shapeType() {
      return this.colliderSet.raw.coShapeType(this.handle);
    }
    halfExtents() {
      return VectorOps.fromRaw(this.colliderSet.raw.coHalfExtents(this.handle));
    }
    setHalfExtents(newHalfExtents) {
      const rawPoint = VectorOps.intoRaw(newHalfExtents);
      this.colliderSet.raw.coSetHalfExtents(this.handle, rawPoint);
    }
    radius() {
      return this.colliderSet.raw.coRadius(this.handle);
    }
    setRadius(newRadius) {
      this.colliderSet.raw.coSetRadius(this.handle, newRadius);
    }
    roundRadius() {
      return this.colliderSet.raw.coRoundRadius(this.handle);
    }
    setRoundRadius(newBorderRadius) {
      this.colliderSet.raw.coSetRoundRadius(this.handle, newBorderRadius);
    }
    halfHeight() {
      return this.colliderSet.raw.coHalfHeight(this.handle);
    }
    setHalfHeight(newHalfheight) {
      this.colliderSet.raw.coSetHalfHeight(this.handle, newHalfheight);
    }
    setVoxel(ix, iy, iz, filled) {
      this.colliderSet.raw.coSetVoxel(this.handle, ix, iy, iz, filled);
      this._shape = null;
    }
    propagateVoxelChange(voxels2, ix, iy, iz, shift_x, shift_y, shift_z) {
      this.colliderSet.raw.coPropagateVoxelChange(this.handle, voxels2.handle, ix, iy, iz, shift_x, shift_y, shift_z);
      this._shape = null;
    }
    combineVoxelStates(voxels2, shift_x, shift_y, shift_z) {
      this.colliderSet.raw.coCombineVoxelStates(this.handle, voxels2.handle, shift_x, shift_y, shift_z);
      this._shape = null;
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
      let scale = this.colliderSet.raw.coHeightfieldScale(this.handle);
      return VectorOps.fromRaw(scale);
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
    containsPoint(point) {
      let rawPoint = VectorOps.intoRaw(point);
      let result = this.colliderSet.raw.coContainsPoint(this.handle, rawPoint);
      rawPoint.free();
      return result;
    }
    projectPoint(point, solid) {
      let rawPoint = VectorOps.intoRaw(point);
      let result = PointProjection.fromRaw(this.colliderSet.raw.coProjectPoint(this.handle, rawPoint, solid));
      rawPoint.free();
      return result;
    }
    intersectsRay(ray, maxToi) {
      let rawOrig = VectorOps.intoRaw(ray.origin);
      let rawDir = VectorOps.intoRaw(ray.dir);
      let result = this.colliderSet.raw.coIntersectsRay(this.handle, rawOrig, rawDir, maxToi);
      rawOrig.free();
      rawDir.free();
      return result;
    }
    castShape(collider1Vel, shape2, shape2Pos, shape2Rot, shape2Vel, targetDistance, maxToi, stopAtPenetration) {
      let rawCollider1Vel = VectorOps.intoRaw(collider1Vel);
      let rawShape2Pos = VectorOps.intoRaw(shape2Pos);
      let rawShape2Rot = RotationOps.intoRaw(shape2Rot);
      let rawShape2Vel = VectorOps.intoRaw(shape2Vel);
      let rawShape2 = shape2.intoRaw();
      let result = ShapeCastHit.fromRaw(this.colliderSet, this.colliderSet.raw.coCastShape(this.handle, rawCollider1Vel, rawShape2, rawShape2Pos, rawShape2Rot, rawShape2Vel, targetDistance, maxToi, stopAtPenetration));
      rawCollider1Vel.free();
      rawShape2Pos.free();
      rawShape2Rot.free();
      rawShape2Vel.free();
      rawShape2.free();
      return result;
    }
    castCollider(collider1Vel, collider2, collider2Vel, targetDistance, maxToi, stopAtPenetration) {
      let rawCollider1Vel = VectorOps.intoRaw(collider1Vel);
      let rawCollider2Vel = VectorOps.intoRaw(collider2Vel);
      let result = ColliderShapeCastHit.fromRaw(this.colliderSet, this.colliderSet.raw.coCastCollider(this.handle, rawCollider1Vel, collider2.handle, rawCollider2Vel, targetDistance, maxToi, stopAtPenetration));
      rawCollider1Vel.free();
      rawCollider2Vel.free();
      return result;
    }
    intersectsShape(shape2, shapePos2, shapeRot2) {
      let rawPos2 = VectorOps.intoRaw(shapePos2);
      let rawRot2 = RotationOps.intoRaw(shapeRot2);
      let rawShape2 = shape2.intoRaw();
      let result = this.colliderSet.raw.coIntersectsShape(this.handle, rawShape2, rawPos2, rawRot2);
      rawPos2.free();
      rawRot2.free();
      rawShape2.free();
      return result;
    }
    contactShape(shape2, shape2Pos, shape2Rot, prediction) {
      let rawPos2 = VectorOps.intoRaw(shape2Pos);
      let rawRot2 = RotationOps.intoRaw(shape2Rot);
      let rawShape2 = shape2.intoRaw();
      let result = ShapeContact.fromRaw(this.colliderSet.raw.coContactShape(this.handle, rawShape2, rawPos2, rawRot2, prediction));
      rawPos2.free();
      rawRot2.free();
      rawShape2.free();
      return result;
    }
    contactCollider(collider2, prediction) {
      let result = ShapeContact.fromRaw(this.colliderSet.raw.coContactCollider(this.handle, collider2.handle, prediction));
      return result;
    }
    castRay(ray, maxToi, solid) {
      let rawOrig = VectorOps.intoRaw(ray.origin);
      let rawDir = VectorOps.intoRaw(ray.dir);
      let result = this.colliderSet.raw.coCastRay(this.handle, rawOrig, rawDir, maxToi, solid);
      rawOrig.free();
      rawDir.free();
      return result;
    }
    castRayAndGetNormal(ray, maxToi, solid) {
      let rawOrig = VectorOps.intoRaw(ray.origin);
      let rawDir = VectorOps.intoRaw(ray.dir);
      let result = RayIntersection.fromRaw(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, rawOrig, rawDir, maxToi, solid));
      rawOrig.free();
      rawDir.free();
      return result;
    }
  };
  (function(MassPropsMode2) {
    MassPropsMode2[MassPropsMode2["Density"] = 0] = "Density";
    MassPropsMode2[MassPropsMode2["Mass"] = 1] = "Mass";
    MassPropsMode2[MassPropsMode2["MassProps"] = 2] = "MassProps";
  })(MassPropsMode || (MassPropsMode = {}));
  ColliderDesc = class {
    constructor(shape) {
      this.enabled = true;
      this.shape = shape;
      this.massPropsMode = MassPropsMode.Density;
      this.density = 1;
      this.friction = 0.5;
      this.restitution = 0;
      this.rotation = RotationOps.identity();
      this.translation = VectorOps.zeros();
      this.isSensor = false;
      this.collisionGroups = 4294967295;
      this.solverGroups = 4294967295;
      this.frictionCombineRule = CoefficientCombineRule.Average;
      this.restitutionCombineRule = CoefficientCombineRule.Average;
      this.activeCollisionTypes = ActiveCollisionTypes.DEFAULT;
      this.activeEvents = ActiveEvents.NONE;
      this.activeHooks = ActiveHooks.NONE;
      this.mass = 0;
      this.centerOfMass = VectorOps.zeros();
      this.contactForceEventThreshold = 0;
      this.contactSkin = 0;
      this.principalAngularInertia = VectorOps.zeros();
      this.angularInertiaLocalFrame = RotationOps.identity();
    }
    static ball(radius) {
      const shape = new Ball(radius);
      return new ColliderDesc(shape);
    }
    static capsule(halfHeight, radius) {
      const shape = new Capsule(halfHeight, radius);
      return new ColliderDesc(shape);
    }
    static segment(a, b) {
      const shape = new Segment(a, b);
      return new ColliderDesc(shape);
    }
    static triangle(a, b, c) {
      const shape = new Triangle(a, b, c);
      return new ColliderDesc(shape);
    }
    static roundTriangle(a, b, c, borderRadius) {
      const shape = new RoundTriangle(a, b, c, borderRadius);
      return new ColliderDesc(shape);
    }
    static polyline(vertices, indices) {
      const shape = new Polyline(vertices, indices);
      return new ColliderDesc(shape);
    }
    static voxels(voxels, voxelSize) {
      const shape = new Voxels(voxels, voxelSize);
      return new ColliderDesc(shape);
    }
    static trimesh(vertices, indices, flags) {
      const shape = new TriMesh(vertices, indices, flags);
      return new ColliderDesc(shape);
    }
    static cuboid(hx, hy, hz) {
      const shape = new Cuboid(hx, hy, hz);
      return new ColliderDesc(shape);
    }
    static roundCuboid(hx, hy, hz, borderRadius) {
      const shape = new RoundCuboid(hx, hy, hz, borderRadius);
      return new ColliderDesc(shape);
    }
    static heightfield(nrows, ncols, heights, scale, flags) {
      const shape = new Heightfield(nrows, ncols, heights, scale, flags);
      return new ColliderDesc(shape);
    }
    static cylinder(halfHeight, radius) {
      const shape = new Cylinder(halfHeight, radius);
      return new ColliderDesc(shape);
    }
    static roundCylinder(halfHeight, radius, borderRadius) {
      const shape = new RoundCylinder(halfHeight, radius, borderRadius);
      return new ColliderDesc(shape);
    }
    static cone(halfHeight, radius) {
      const shape = new Cone(halfHeight, radius);
      return new ColliderDesc(shape);
    }
    static roundCone(halfHeight, radius, borderRadius) {
      const shape = new RoundCone(halfHeight, radius, borderRadius);
      return new ColliderDesc(shape);
    }
    static convexHull(points) {
      const shape = new ConvexPolyhedron(points, null);
      return new ColliderDesc(shape);
    }
    static convexMesh(vertices, indices) {
      const shape = new ConvexPolyhedron(vertices, indices);
      return new ColliderDesc(shape);
    }
    static roundConvexHull(points, borderRadius) {
      const shape = new RoundConvexPolyhedron(points, null, borderRadius);
      return new ColliderDesc(shape);
    }
    static roundConvexMesh(vertices, indices, borderRadius) {
      const shape = new RoundConvexPolyhedron(vertices, indices, borderRadius);
      return new ColliderDesc(shape);
    }
    setTranslation(x, y, z) {
      if (typeof x != "number" || typeof y != "number" || typeof z != "number") throw TypeError("The translation components must be numbers.");
      this.translation = {
        x,
        y,
        z
      };
      return this;
    }
    setRotation(rot) {
      RotationOps.copy(this.rotation, rot);
      return this;
    }
    setSensor(sensor) {
      this.isSensor = sensor;
      return this;
    }
    setEnabled(enabled) {
      this.enabled = enabled;
      return this;
    }
    setContactSkin(thickness) {
      this.contactSkin = thickness;
      return this;
    }
    setDensity(density) {
      this.massPropsMode = MassPropsMode.Density;
      this.density = density;
      return this;
    }
    setMass(mass) {
      this.massPropsMode = MassPropsMode.Mass;
      this.mass = mass;
      return this;
    }
    setMassProperties(mass, centerOfMass, principalAngularInertia, angularInertiaLocalFrame) {
      this.massPropsMode = MassPropsMode.MassProps;
      this.mass = mass;
      VectorOps.copy(this.centerOfMass, centerOfMass);
      VectorOps.copy(this.principalAngularInertia, principalAngularInertia);
      RotationOps.copy(this.angularInertiaLocalFrame, angularInertiaLocalFrame);
      return this;
    }
    setRestitution(restitution) {
      this.restitution = restitution;
      return this;
    }
    setFriction(friction) {
      this.friction = friction;
      return this;
    }
    setFrictionCombineRule(rule) {
      this.frictionCombineRule = rule;
      return this;
    }
    setRestitutionCombineRule(rule) {
      this.restitutionCombineRule = rule;
      return this;
    }
    setCollisionGroups(groups) {
      this.collisionGroups = groups;
      return this;
    }
    setSolverGroups(groups) {
      this.solverGroups = groups;
      return this;
    }
    setActiveHooks(activeHooks) {
      this.activeHooks = activeHooks;
      return this;
    }
    setActiveEvents(activeEvents) {
      this.activeEvents = activeEvents;
      return this;
    }
    setActiveCollisionTypes(activeCollisionTypes) {
      this.activeCollisionTypes = activeCollisionTypes;
      return this;
    }
    setContactForceEventThreshold(threshold) {
      this.contactForceEventThreshold = threshold;
      return this;
    }
  };
  ColliderSet = class {
    free() {
      if (!!this.raw) {
        this.raw.free();
      }
      this.raw = void 0;
      if (!!this.map) {
        this.map.clear();
      }
      this.map = void 0;
    }
    constructor(raw) {
      this.raw = raw || new RawColliderSet();
      this.map = new Coarena();
      if (raw) {
        raw.forEachColliderHandle((handle) => {
          this.map.set(handle, new Collider(this, handle, null));
        });
      }
    }
    castClosure(f) {
      return (handle) => {
        if (!!f) {
          return f(this.get(handle));
        } else {
          return void 0;
        }
      };
    }
    finalizeDeserialization(bodies) {
      this.map.forEach((collider) => collider.finalizeDeserialization(bodies));
    }
    createCollider(bodies, desc, parentHandle) {
      let hasParent = parentHandle != void 0 && parentHandle != null;
      if (hasParent && isNaN(parentHandle)) throw Error("Cannot create a collider with a parent rigid-body handle that is not a number.");
      let rawShape = desc.shape.intoRaw();
      let rawTra = VectorOps.intoRaw(desc.translation);
      let rawRot = RotationOps.intoRaw(desc.rotation);
      let rawCom = VectorOps.intoRaw(desc.centerOfMass);
      let rawPrincipalInertia = VectorOps.intoRaw(desc.principalAngularInertia);
      let rawInertiaFrame = RotationOps.intoRaw(desc.angularInertiaLocalFrame);
      let handle = this.raw.createCollider(desc.enabled, rawShape, rawTra, rawRot, desc.massPropsMode, desc.mass, rawCom, rawPrincipalInertia, rawInertiaFrame, desc.density, desc.friction, desc.restitution, desc.frictionCombineRule, desc.restitutionCombineRule, desc.isSensor, desc.collisionGroups, desc.solverGroups, desc.activeCollisionTypes, desc.activeHooks, desc.activeEvents, desc.contactForceEventThreshold, desc.contactSkin, hasParent, hasParent ? parentHandle : 0, bodies.raw);
      rawShape.free();
      rawTra.free();
      rawRot.free();
      rawCom.free();
      rawPrincipalInertia.free();
      rawInertiaFrame.free();
      let parent = hasParent ? bodies.get(parentHandle) : null;
      let collider = new Collider(this, handle, parent, desc.shape);
      this.map.set(handle, collider);
      return collider;
    }
    remove(handle, islands, bodies, wakeUp) {
      this.raw.remove(handle, islands.raw, bodies.raw, wakeUp);
      this.unmap(handle);
    }
    unmap(handle) {
      this.map.delete(handle);
    }
    get(handle) {
      return this.map.get(handle);
    }
    len() {
      return this.map.len();
    }
    contains(handle) {
      return this.get(handle) != null;
    }
    forEach(f) {
      this.map.forEach(f);
    }
    getAll() {
      return this.map.getAll();
    }
  };
  version = function() {
    return version$2();
  };
  reserveMemory = function(extraBytesCount) {
    reserve_memory$1(extraBytesCount);
  };
  RAPIER = Object.freeze(Object.defineProperty({
    __proto__: null,
    get ActiveCollisionTypes() {
      return ActiveCollisionTypes;
    },
    get ActiveEvents() {
      return ActiveEvents;
    },
    get ActiveHooks() {
      return ActiveHooks;
    },
    Ball,
    BroadPhase,
    CCDSolver,
    Capsule,
    CharacterCollision,
    get CoefficientCombineRule() {
      return CoefficientCombineRule;
    },
    Collider,
    ColliderDesc,
    ColliderSet,
    ColliderShapeCastHit,
    Cone,
    ConvexPolyhedron,
    Cuboid,
    Cylinder,
    DebugRenderBuffers,
    DebugRenderPipeline,
    DynamicRayCastVehicleController,
    EventQueue,
    get FeatureType() {
      return FeatureType;
    },
    FixedImpulseJoint,
    FixedMultibodyJoint,
    GenericImpulseJoint,
    HalfSpace,
    get HeightFieldFlags() {
      return HeightFieldFlags;
    },
    Heightfield,
    ImpulseJoint,
    ImpulseJointSet,
    IntegrationParameters,
    IslandManager,
    get JointAxesMask() {
      return JointAxesMask;
    },
    JointData,
    get JointType() {
      return JointType;
    },
    KinematicCharacterController,
    get MassPropsMode() {
      return MassPropsMode;
    },
    get MotorModel() {
      return MotorModel;
    },
    MultibodyJoint,
    MultibodyJointSet,
    NarrowPhase,
    PhysicsPipeline,
    get PidAxesMask() {
      return PidAxesMask;
    },
    PidController,
    PointColliderProjection,
    PointProjection,
    Polyline,
    PrismaticImpulseJoint,
    PrismaticMultibodyJoint,
    Quaternion,
    get QueryFilterFlags() {
      return QueryFilterFlags;
    },
    QueryPipeline,
    Ray,
    RayColliderHit,
    RayColliderIntersection,
    RayIntersection,
    RevoluteImpulseJoint,
    RevoluteMultibodyJoint,
    RigidBody,
    RigidBodyDesc,
    RigidBodySet,
    get RigidBodyType() {
      return RigidBodyType;
    },
    RopeImpulseJoint,
    RotationOps,
    RoundCone,
    RoundConvexPolyhedron,
    RoundCuboid,
    RoundCylinder,
    RoundTriangle,
    SdpMatrix3,
    SdpMatrix3Ops,
    Segment,
    SerializationPipeline,
    Shape,
    ShapeCastHit,
    ShapeContact,
    get ShapeType() {
      return ShapeType;
    },
    get SolverFlags() {
      return SolverFlags;
    },
    SphericalImpulseJoint,
    SphericalMultibodyJoint,
    SpringImpulseJoint,
    TempContactForceEvent,
    TempContactManifold,
    TriMesh,
    get TriMeshFlags() {
      return TriMeshFlags;
    },
    Triangle,
    UnitImpulseJoint,
    UnitMultibodyJoint,
    Vector3,
    VectorOps,
    Voxels,
    World,
    reserveMemory,
    version
  }, Symbol.toStringTag, {
    value: "Module"
  }));
});
export {
  ActiveCollisionTypes,
  ActiveEvents,
  ActiveHooks,
  Ball,
  BroadPhase,
  CCDSolver,
  Capsule,
  CharacterCollision,
  CoefficientCombineRule,
  Collider,
  ColliderDesc,
  ColliderSet,
  ColliderShapeCastHit,
  Cone,
  ConvexPolyhedron,
  Cuboid,
  Cylinder,
  DebugRenderBuffers,
  DebugRenderPipeline,
  DynamicRayCastVehicleController,
  EventQueue,
  FeatureType,
  FixedImpulseJoint,
  FixedMultibodyJoint,
  GenericImpulseJoint,
  HalfSpace,
  HeightFieldFlags,
  Heightfield,
  ImpulseJoint,
  ImpulseJointSet,
  IntegrationParameters,
  IslandManager,
  JointAxesMask,
  JointData,
  JointType,
  KinematicCharacterController,
  MassPropsMode,
  MotorModel,
  MultibodyJoint,
  MultibodyJointSet,
  NarrowPhase,
  PhysicsPipeline,
  PidAxesMask,
  PidController,
  PointColliderProjection,
  PointProjection,
  Polyline,
  PrismaticImpulseJoint,
  PrismaticMultibodyJoint,
  Quaternion,
  QueryFilterFlags,
  QueryPipeline,
  Ray,
  RayColliderHit,
  RayColliderIntersection,
  RayIntersection,
  RevoluteImpulseJoint,
  RevoluteMultibodyJoint,
  RigidBody,
  RigidBodyDesc,
  RigidBodySet,
  RigidBodyType,
  RopeImpulseJoint,
  RotationOps,
  RoundCone,
  RoundConvexPolyhedron,
  RoundCuboid,
  RoundCylinder,
  RoundTriangle,
  SdpMatrix3,
  SdpMatrix3Ops,
  Segment,
  SerializationPipeline,
  Shape,
  ShapeCastHit,
  ShapeContact,
  ShapeType,
  SolverFlags,
  SphericalImpulseJoint,
  SphericalMultibodyJoint,
  SpringImpulseJoint,
  TempContactForceEvent,
  TempContactManifold,
  TriMesh,
  TriMeshFlags,
  Triangle,
  UnitImpulseJoint,
  UnitMultibodyJoint,
  Vector3,
  VectorOps,
  Voxels,
  World,
  __tla,
  RAPIER as default,
  reserveMemory,
  version
};
