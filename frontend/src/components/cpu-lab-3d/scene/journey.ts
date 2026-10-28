/**
 * BỘ ĐIỀU KHIỂN chung của cảnh 3D "Hành trình vào máy tính" — dùng cho:
 *   • trang /cpu-lab/3d (Journey3D.tsx)       — chế độ 'journey', p = 0..7 (8 tầng, ngoài → trong)
 *   • mini-map <WhereInComputer focus=…/>      — chế độ 'focus', bay từ điểm `from` tới `to` theo k = 0..1
 *   • video Remotion (khung/may3d)            — cả hai chế độ, mỗi khung hình gọi setState() + render()
 * setState() là HÀM THUẦN của trạng thái (không tích luỹ theo thời gian) ⇒ khung hình nào cũng dựng lại y hệt.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildMacro, type Pose } from './macro';
import { buildMicro } from './micro';
import { CONCEPTS, FOCUS, LABEL_LAYER, type FocusId } from './data';
import { clamp01, easeInOut, lerp, sstep } from './util';

export type Quality = 'low' | 'high' | 'video';
export const LAYER_COUNT = 8;

export interface JourneyState {
  mode: 'journey' | 'focus';
  /** journey: vị trí liên tục 0..7 (số nguyên = đứng ở tầng đó) */
  p?: number;
  /** focus: bay từ `from` tới `to`, k = 0..1 (from bỏ trống = đứng yên ở `to`) */
  from?: FocusId;
  to?: FocusId;
  k?: number;
  /** đồng hồ hoạt cảnh (giây) — quạt quay, xung bus, electron… */
  t: number;
  /** lệch góc nhìn thêm (radian): kéo chuột / trôi chậm */
  orbit?: number;
  tilt?: number;
  /** vùng sáng thêm (cộng dồn với vùng sáng mặc định của tầng/điểm đến) */
  hl?: Record<string, number>;
  instr?: number;
  adder?: { a: number; b: number; at: number };
  gateV?: number;
  /** ép tham số cảnh (mặc định suy ra từ p / focus) */
  panel?: number;
  ihs?: number;
  rise?: number;
  glass?: number;
  /** tắt mờ chuyển động (ảnh tĩnh, chế độ giảm chuyển động) */
  noBlur?: boolean;
  /** journey: nội suy TUYẾN TÍNH giữa các tầng (bay một mạch qua nhiều tầng không khựng ở từng tầng — dùng khi lùi vụt ra) */
  linear?: boolean;
}

/** focus ⇒ các vùng sáng của nó trong cảnh */
export const FOCUS_HL: Record<FocusId, string[]> = {
  pc: [], board: [], cpu: ['h.socket'], 'cpu.die': [], 'cpu.core': ['d.core1'],
  'cpu.fetch': ['c.fetch'], 'cpu.decode': ['c.decode'], 'cpu.registers': ['c.regs'], 'cpu.alu': ['c.alu'], 'cpu.mmu': ['c.mmu'],
  'cpu.l1': ['c.l1i', 'c.l1d'], 'cpu.l2': ['c.l2', 'd.l2'], 'cpu.l3': ['d.l3'], 'cpu.imc': ['d.imc'],
  'bus.memory': ['b.mem'], ram: ['h.ram', 'b.mem'], 'ram.cells': ['h.ram.cells'],
  'bus.pcie': ['b.pcie'], ssd: ['h.ssd'], 'ssd.controller': ['h.ssd.ctrl'], 'ssd.nand': ['h.ssd.nand'],
  gpu: ['h.gpu', 'b.pcie'], chipset: ['h.chipset', 'b.dmi'], nic: ['h.nic'],
};

/** Nhận id điểm đến HOẶC tên khái niệm (CONCEPTS) ⇒ { focus, also } */
export function resolveFocus(x: string): { focus: FocusId; also: FocusId[] } {
  if (x in FOCUS) return { focus: x as FocusId, also: [] };
  const c = CONCEPTS[x];
  if (c) return { focus: c.focus, also: c.also ?? [] };
  return { focus: 'pc', also: [] };
}

const angLerp = (a: number, b: number, t: number) => {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
};

function interp(A: Pose, Bp: Pose, f: number, nested: boolean, linear = false): Pose {
  const e = linear ? clamp01(f) : easeInOut(clamp01(f));
  const l0 = Math.log(A.d), l1 = Math.log(Bp.d);
  let eT: number, logd: number;
  if (linear) { eT = clamp01(f); logd = lerp(l0, l1, eT); }
  else if (nested) { eT = easeInOut(sstep(0, 0.72, f)); logd = lerp(l0, l1, e); }
  else {
    // bay giữa hai điểm đến: chỗ xa nhau ⇒ lùi ra rồi lao vào; chui vào ⇒ ngắm đích TRƯỚC rồi mới tiến (không xuyên qua linh kiện);
    // lùi ra ⇒ lùi trước rồi mới quay đích
    const dmid = Math.max(A.d, Bp.d, A.T.distanceTo(Bp.T) * 1.4);
    if (dmid > Math.max(A.d, Bp.d) * 1.15) {
      const lm = Math.log(dmid);
      logd = f < 0.5 ? lerp(l0, lm, easeInOut(f * 2)) : lerp(lm, l1, easeInOut(f * 2 - 1));
      eT = easeInOut(sstep(0.25, 0.75, f));
    } else if (Bp.d < A.d) {
      eT = easeInOut(sstep(0, 0.5, f));
      logd = lerp(l0, l1, easeInOut(sstep(0.12, 1, f)));
    } else {
      eT = easeInOut(sstep(0.45, 1, f));
      logd = lerp(l0, l1, easeInOut(sstep(0, 0.85, f)));
    }
  }
  return {
    T: A.T.clone().lerp(Bp.T, eT),
    d: Math.exp(logd),
    az: angLerp(A.az, Bp.az, e),
    el: lerp(A.el, Bp.el, e),
    fov: lerp(A.fov, Bp.fov, e),
    fitW: Math.exp(lerp(Math.log(A.fitW), Math.log(Bp.fitW), e)),
    params: {
      panel: lerp(A.params.panel, Bp.params.panel, sstep(0, 0.45, f)),
      ihs: lerp(A.params.ihs, Bp.params.ihs, sstep(0.1, 0.7, f)),
      rise: lerp(A.params.rise, Bp.params.rise, sstep(0.35, 0.9, f)),
    },
  };
}

const FINISH = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uFlash: { value: 0 },
    uFlashC: { value: new THREE.Color(2.2, 2.6, 3.2) },
    uZoom: { value: 0 },
    uVig: { value: 0.55 },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uFlash, uZoom, uVig, uTime; uniform vec3 uFlashC; uniform vec2 uRes; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5;
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      if (uZoom > 0.002) {
        vec3 acc = col;
        for (int i = 1; i < 10; i++) { float s = 1.0 - uZoom * 0.11 * float(i) / 9.0; acc += texture2D(tDiffuse, 0.5 + c * s).rgb; }
        col = acc / 10.0;
      }
      float v = smoothstep(0.95, 0.25, length(c * vec2(1.0, 0.85)));
      col *= mix(1.0, v, uVig);
      col += (h(vUv * uRes + uTime) - 0.5) * 0.01;
      col = mix(col, uFlashC, clamp(uFlash, 0.0, 1.0));
      gl_FragColor = vec4(col, 1.0);
    }`,
};

export interface LabelOut { id: string; x: number; y: number; a: number }

export function createJourney(canvas: HTMLCanvasElement, opts: { quality: Quality; width: number; height: number; dpr?: number; preserveDrawingBuffer?: boolean; macroOnly?: boolean; texQ?: 'low' | 'high' }) {
  let quality = opts.quality;
  const texQ = opts.texQ ?? (quality === 'low' ? 'low' : 'high');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.preserveDrawingBuffer, alpha: false });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const macro = buildMacro(texQ, { anisotropy: aniso });
  // mini-map chỉ cần thế giới vĩ mô ⇒ bỏ hẳn phần vi mô (đỡ bộ nhớ GPU)
  const micro = opts.macroOnly ? null : buildMicro(texQ);
  macro.scene.environment = env;
  macro.scene.environmentIntensity = 0.55;
  if (micro) {
    micro.scene.environment = env;
    micro.scene.environmentIntensity = 0.7;
  }

  const scenesList = () => (micro ? [macro.scene, micro.scene] : [macro.scene]);
  const activeScene = () => (world === 0 || !micro ? macro.scene : micro.scene);
  const camera = new THREE.PerspectiveCamera(34, opts.width / opts.height, 0.1, 1000);
  let W = opts.width, H = opts.height, DPR = opts.dpr ?? 1;

  // hậu kỳ
  let composer: EffectComposer | null = null;
  let renderPass: RenderPass | null = null, bloom: UnrealBloomPass | null = null, bokeh: BokehPass | null = null, finish: ShaderPass | null = null;
  function setupPost() {
    composer?.dispose();
    composer = null; bokeh = null;
    if (quality === 'low') return;
    const rt = new THREE.WebGLRenderTarget(Math.round(W * DPR), Math.round(H * DPR), { type: THREE.HalfFloatType, samples: renderer.capabilities.isWebGL2 ? 4 : 0 });
    composer = new EffectComposer(renderer, rt);
    composer.setPixelRatio(DPR);
    composer.setSize(W, H);
    renderPass = new RenderPass(macro.scene, camera);
    composer.addPass(renderPass);
    bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.55, 0.55, 0.92);
    composer.addPass(bloom);
    if (quality === 'video') {
      bokeh = new BokehPass(macro.scene, camera, { focus: 10, aperture: 0.001, maxblur: 0.006 });
      composer.addPass(bokeh);
    }
    finish = new ShaderPass(FINISH);
    composer.addPass(finish);
    composer.addPass(new OutputPass());
  }
  function applyQuality() {
    const sh = quality !== 'low';
    renderer.shadowMap.enabled = sh;
    for (const k of micro ? [macro.key, micro.key] : [macro.key]) {
      k.castShadow = sh;
      k.shadow.mapSize.setScalar(quality === 'video' ? 2048 : 1024);
      k.shadow.map?.dispose();
      k.shadow.map = null as unknown as THREE.WebGLRenderTarget;
    }
    for (const s of scenesList()) s.traverse((o) => {
      const m = (o as THREE.Mesh).material;
      if (Array.isArray(m)) m.forEach((x) => (x.needsUpdate = true));
      else if (m) (m as THREE.Material).needsUpdate = true;
    });
    renderer.setPixelRatio(DPR);
    renderer.setSize(W, H, false);
    setupPost();
  }
  applyQuality();

  // trạng thái hiện hành
  let world: 0 | 1 = 0;
  let pose: Pose = macro.poses.pc;
  let curLayerP = 0;
  let cur: JourneyState = { mode: 'journey', p: 0, t: 0 };
  let flash = 0, zoom = 0;

  const maxP = micro ? LAYER_COUNT - 1 : 4;
  const layerPose = (i: number): Pose =>
    i <= 4 || !micro ? macro.poses[(['pc', 'board', 'cpu', 'cpu.die', 'cpu.core'] as const)[Math.min(4, i)]!] : [micro.poses.alu, micro.poses.gate, micro.poses.transistor][i - 5]!;

  function journeyPose(p: number, lin = false) {
    const P = Math.max(0, Math.min(maxP, p));
    const i = Math.min(LAYER_COUNT - 2, Math.floor(P)), f = P - i;
    flash = 0;
    zoom = 0;
    if (f < 1e-6) return { w: (P >= 5 ? 1 : 0) as 0 | 1, pose: layerPose(Math.round(P)) };
    zoom = Math.sin(Math.PI * f) * Math.min(1, Math.abs(Math.log(layerPose(i).d / layerPose(i + 1).d)) / 3);
    if (i === 4 && micro) {
      // vĩ mô → vi mô: lao vào ALU, loé sáng, rơi xuống mạch cộng
      if (f < 0.5) {
        flash = sstep(0.36, 0.5, f);
        return { w: 0 as const, pose: interp(layerPose(4), macro.aluDive, f / 0.5, true, lin) };
      }
      flash = 1 - sstep(0.5, 0.66, f);
      return { w: 1 as const, pose: interp(micro.poses.aluPre, micro.poses.alu, (f - 0.5) / 0.5, true, lin) };
    }
    return { w: (i >= 5 ? 1 : 0) as 0 | 1, pose: interp(layerPose(i), layerPose(i + 1), f, true, lin) };
  }

  const tmpV = new THREE.Vector3();
  function placeCamera(P: Pose, orbit: number, tilt: number) {
    const aspect = W / H;
    camera.fov = P.fov;
    const fitD = P.fitW / (2 * Math.tan(THREE.MathUtils.degToRad(P.fov) / 2) * aspect);
    const d = Math.max(P.d, fitD);
    const az = P.az + orbit, el = Math.max(-0.3, Math.min(1.45, P.el + tilt));
    camera.position.set(P.T.x + d * Math.cos(el) * Math.sin(az), P.T.y + d * Math.sin(el), P.T.z + d * Math.cos(el) * Math.cos(az));
    camera.up.set(0, 1, 0);
    camera.lookAt(P.T);
    camera.near = d * 0.02;
    camera.far = d * 60 + 400 * (world === 0 ? 1 : 0.5);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const sc = world === 0 || !micro ? macro.scope : micro.scope;
    sc.position.copy(camera.position);
    sc.intensity = world === 0 ? (d < 8 ? 0.7 * d * d : 0) : 0.5 * d * d;
    sc.distance = 0;
    return d;
  }

  function setState(s: JourneyState) {
    cur = s;
    const hl: Record<string, number> = {};
    const addHl = (k: string, v: number) => (hl[k] = Math.max(hl[k] ?? 0, v));
    let params = { panel: 0, ihs: 0, rise: 0 };
    let glass = 0, deep = 0;
    if (s.mode === 'journey') {
      const p = s.p ?? 0;
      curLayerP = p;
      const r = journeyPose(p, !!s.linear);
      world = micro ? r.w : 0;
      pose = r.pose;
      params = { panel: sstep(0.02, 0.5, p), ihs: sstep(2.08, 2.75, p), rise: sstep(3.3, 3.9, p) };
      glass = sstep(5.25, 5.8, p);
      deep = sstep(6.25, 6.55, p);
      addHl('b.mem', 0.35 * sstep(0.5, 1, p));
    } else {
      const to = s.to ?? 'pc';
      const from = s.from ?? to;
      const k = s.from ? clamp01(s.k ?? 1) : 1;
      world = 0;
      pose = interp(macro.poses[from], macro.poses[to], k, false);
      zoom = s.from && from !== to ? Math.sin(Math.PI * k) * 0.35 : 0;
      flash = 0;
      params = pose.params;
      const inT = sstep(0.55, 0.95, k), outF = 1 - sstep(0, 0.35, k);
      for (const h of FOCUS_HL[to]) addHl(h, inT);
      if (from !== to) for (const h of FOCUS_HL[from]) addHl(h, outF * 0.8);
      curLayerP = -1;
    }
    if (s.panel !== undefined) params.panel = s.panel;
    if (s.ihs !== undefined) params.ihs = s.ihs;
    if (s.rise !== undefined) params.rise = s.rise;
    if (s.glass !== undefined) glass = s.glass;
    for (const [k, v] of Object.entries(s.hl ?? {})) addHl(k, v);
    if (s.noBlur) zoom = 0;

    const d = placeCamera(pose, s.orbit ?? 0, s.tilt ?? 0);
    if (world === 0) macro.update({ t: s.t, ...params, hl, instr: s.instr ?? -1 });
    else micro!.update({ t: s.t, adder: s.adder ?? { a: 5, b: 7, at: -1 }, glass, deep, gateV: s.gateV ?? 0, hl });

    if (renderPass) renderPass.scene = activeScene();
    if (bokeh) {
      (bokeh as unknown as { scene: THREE.Scene }).scene = activeScene();
      const u = (bokeh as unknown as { uniforms: Record<string, THREE.IUniform> }).uniforms;
      u.focus!.value = d;
      u.aperture!.value = (world === 0 ? 0.005 : 0.0018) / d;
      u.maxblur!.value = 0.005;
    }
    if (finish) {
      const u = finish.uniforms;
      u.uFlash!.value = flash;
      u.uZoom!.value = zoom;
      u.uTime!.value = (s.t * 7.31) % 100;
      (u.uRes!.value as THREE.Vector2).set(W, H);
    }
  }

  function render() {
    if (composer) composer.render();
    else {
      // chất lượng thấp: vẽ thẳng; mô phỏng loé sáng bằng màu xoá (đủ dùng)
      renderer.render(activeScene(), camera);
    }
  }

  function project(v: THREE.Vector3) {
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x * 0.5 + 0.5) * W, y: (-tmpV.y * 0.5 + 0.5) * H, inFront: tmpV.z < 1 && tmpV.z > -1 };
  }

  /** Nhãn của tầng đang đứng (chế độ journey) — toạ độ px theo kích thước CSS. */
  function labels(): LabelOut[] {
    if (cur.mode !== 'journey') return [];
    const out: LabelOut[] = [];
    const anchors = world === 0 || !micro ? macro.anchors : micro.anchors;
    for (const [id, L] of Object.entries(LABEL_LAYER)) {
      const v = anchors[id];
      if (!v) continue;
      const a = 1 - sstep(0.1, 0.32, Math.abs(curLayerP - L));
      if (a <= 0.01) continue;
      const pr = project(v);
      if (!pr.inFront) continue;
      out.push({ id, x: pr.x, y: pr.y, a });
    }
    return out;
  }
  /** Toạ độ màn hình của tâm điểm đến hiện tại (chế độ focus) */
  function focusPoint() {
    return project(pose.T);
  }

  function resize(w: number, h: number, dpr = DPR) {
    W = w; H = h; DPR = dpr;
    renderer.setPixelRatio(DPR);
    renderer.setSize(W, H, false);
    if (composer) { composer.setPixelRatio(DPR); composer.setSize(W, H); }
    bloom?.setSize(Math.round((W * DPR) / 2), Math.round((H * DPR) / 2));
  }
  function setQuality(q: Quality, dpr?: number) {
    if (dpr) DPR = dpr;
    if (q === quality) { resize(W, H, DPR); return; }
    quality = q;
    applyQuality();
  }
  /** Biên dịch trước mọi shader (tránh khựng lần đầu chuyển tầng). */
  function warm() {
    renderer.compile(macro.scene, camera);
    if (micro) renderer.compile(micro.scene, camera);
  }
  function dispose() {
    composer?.dispose();
    pmrem.dispose();
    env.dispose();
    for (const s of scenesList()) s.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const x of mats) {
        for (const v of Object.values(x)) if (v instanceof THREE.Texture) v.dispose();
        x.dispose();
      }
    });
    renderer.dispose();
  }

  return {
    setState, render, labels, focusPoint, resize, setQuality, warm, dispose, renderer, camera, scenes: { macro: macro.scene, micro: micro?.scene ?? null },
    get world() { return world; },
    get quality() { return quality; },
  };
}
export type Journey = ReturnType<typeof createJourney>;
