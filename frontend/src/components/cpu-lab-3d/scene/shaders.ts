/**
 * Vật liệu tự viết cho cảnh 3D:
 *  • PulseMaterial  — đường đồng (bus) với các xung sáng chạy dọc (dữ liệu đi trên bus). uv.x = vị trí dọc dây (0..1).
 *  • SignalMaterial — dây trong mạch cộng: bit 1 sáng hổ phách, sáng dần từ đầu dây theo thời điểm tín hiệu tới.
 *  • FrameMaterial  — khung phát sáng (viền + nền mờ) dùng để tô vùng trên bo mạch / die / lõi.
 * Màu > 1 (HDR) để bloom bắt sáng. Mọi chuyển động là hàm của uTime ⇒ tất định theo khung hình.
 */
import * as THREE from 'three';

const TAIL = /* glsl */ `
#include <tonemapping_fragment>
#include <colorspace_fragment>
`;

export function pulseMaterial(base: THREE.ColorRepresentation, glow: THREE.ColorRepresentation, opts: { spacing?: number; speed?: number; sharp?: number } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOn: { value: 1 },
      uBase: { value: new THREE.Color(base) },
      uGlow: { value: new THREE.Color(glow) },
      uSpacing: { value: opts.spacing ?? 3 },
      uSpeed: { value: opts.speed ?? 6 },
      uSharp: { value: opts.sharp ?? 9 },
    },
    vertexShader: /* glsl */ `
      attribute float aSeed; attribute float aLen;
      varying vec2 vUv; varying float vSeed; varying float vLen;
      void main(){ vUv = uv; vSeed = aSeed; vLen = aLen; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uOn, uSpacing, uSpeed, uSharp; uniform vec3 uBase, uGlow;
      varying vec2 vUv; varying float vSeed; varying float vLen;
      void main(){
        float s = vUv.x * vLen / uSpacing;
        float a = fract(s - uTime * uSpeed / uSpacing + vSeed);
        float b = fract(s * 0.83 + uTime * uSpeed * 0.7 / uSpacing + vSeed * 1.7);
        float p = exp(-pow((a - 0.5) * uSharp, 2.0)) + 0.55 * exp(-pow((b - 0.5) * uSharp, 2.0));
        float edge = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        gl_FragColor = vec4(uBase + uGlow * p * uOn * (0.55 + 0.45 * edge), 1.0);
        ${TAIL}
      }`,
  });
}

export function signalMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uT: { value: -1 },
      uOnC: { value: new THREE.Color(3.2, 1.7, 0.35) },
      uOffC: { value: new THREE.Color(0.05, 0.09, 0.16) },
      uFrontC: { value: new THREE.Color(5, 4, 2.2) },
    },
    vertexShader: /* glsl */ `
      attribute float aT0; attribute float aDur; attribute float aVal;
      varying vec2 vUv; varying float vT0; varying float vDur; varying float vVal; varying vec3 vN;
      void main(){ vUv = uv; vT0 = aT0; vDur = aDur; vVal = aVal; vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uT; uniform vec3 uOnC, uOffC, uFrontC;
      varying vec2 vUv; varying float vT0; varying float vDur; varying float vVal; varying vec3 vN;
      void main(){
        float front = clamp((uT - vT0) / max(vDur, 1e-3), 0.0, 1.0);
        float lit = vVal * step(vUv.x, front) * step(0.0, uT);
        float tip = vVal * step(0.0, uT) * exp(-pow((vUv.x - front) * 18.0, 2.0)) * step(front, 0.999);
        float shade = 0.55 + 0.45 * clamp(vN.z, 0.0, 1.0);
        vec3 c = mix(uOffC * (0.6 + 0.6 * shade), uOnC * shade, lit) + uFrontC * tip;
        gl_FragColor = vec4(c, 1.0);
        ${TAIL}
      }`,
  });
}

/** Khung sáng: viền dày `uEdge` (theo uv) + nền mờ. Cộng màu (additive), không ghi depth. */
export function frameMaterial(color: THREE.ColorRepresentation, edge = 0.04) {
  return new THREE.ShaderMaterial({
    uniforms: { uA: { value: 0 }, uC: { value: new THREE.Color(color) }, uEdge: { value: edge }, uAspect: { value: 1 } },
    vertexShader: /* glsl */ 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */ `
      uniform float uA, uEdge, uAspect; uniform vec3 uC; varying vec2 vUv;
      void main(){
        vec2 d = min(vUv, 1.0 - vUv); d.x *= uAspect;
        float m = min(d.x, d.y);
        float e = 1.0 - smoothstep(uEdge * 0.4, uEdge, m);
        float a = uA * (e * 1.0 + 0.07);
        if (a < 0.002) discard;
        gl_FragColor = vec4(uC * a * 1.7, 1.0);
        ${TAIL}
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/** Dải phẳng (ribbon) theo đường gấp khúc 2D trên mặt phẳng z = z0; uv.x = độ dài tích luỹ / tổng. */
export function ribbon(pts: Array<[number, number]>, width: number, z0: number, seed: number) {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const lens = [0];
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1]! + Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]));
  const L = lens[lens.length - 1]!;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!, a = pts[Math.max(0, i - 1)]!, b = pts[Math.min(pts.length - 1, i + 1)]!;
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    dx /= l; dy /= l;
    const nx = -dy * width * 0.5, ny = dx * width * 0.5;
    pos.push(p[0] + nx, p[1] + ny, z0, p[0] - nx, p[1] - ny, z0);
    uv.push(lens[i]! / L, 1, lens[i]! / L, 0);
    if (i) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  const n = pos.length / 3;
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(new Array(n).fill(seed), 1));
  g.setAttribute('aLen', new THREE.Float32BufferAttribute(new Array(n).fill(L), 1));
  g.setIndex(idx);
  return g;
}

/** Ống tròn theo đường gấp khúc 3D (góc bo nhẹ); thêm thuộc tính hằng cho cả ống. */
export function tube(pts: THREE.Vector3[], r: number, attrs: Record<string, number>, radial = 6) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 1; i < pts.length; i++) path.add(new THREE.LineCurve3(pts[i - 1]!, pts[i]!));
  const L = path.getLength();
  const g = new THREE.TubeGeometry(path, Math.max(8, Math.ceil(L * 10)), r, radial, false);
  const n = g.getAttribute('position').count;
  for (const [k, v] of Object.entries(attrs)) g.setAttribute(k, new THREE.Float32BufferAttribute(new Array(n).fill(v), 1));
  return { g, L };
}
