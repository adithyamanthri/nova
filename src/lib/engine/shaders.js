/* ------------------------------------------------------------------ */
/*  GLSL for the liquid systems. All effects are cheap: a handful of   */
/*  uniforms, no post-processing passes, no textures.                  */
/* ------------------------------------------------------------------ */

const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  float fbm(vec3 p){
    float f = 0.0;
    float a = 0.5;
    for(int i = 0; i < 4; i++){
      f += a * snoise(p);
      p = p * 2.02 + vec3(11.3, 7.1, 3.7);
      a *= 0.5;
    }
    return f;
  }
`

/* ---------------- flowing liquid plane (shade lab background) ------ */
export const liquidVert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const liquidFrag = /* glsl */ `
  uniform float uTime;
  uniform float uFlow;
  uniform float uQuality;
  uniform vec2 uMouse;      // lerped, 0..1
  uniform vec3 uColorA;     // base shade (lerped toward active shade)
  uniform vec3 uColorB;     // deeper tone
  uniform vec3 uColorC;     // highlight tone
  uniform float uOpacity;
  varying vec2 vUv;

  ${noiseGLSL}

  void main(){
    vec2 uv = vUv;
    // flow: vertical drift scaled by scroll velocity, plus slow idle motion
    float flow = uFlow * 0.12 + 0.06;
    vec3 p = vec3(uv * vec2(2.6, 3.4) + vec2(0.0, uTime * flow), uTime * 0.05);

    float n = fbm(p);
    float n2 = fbm(p * 2.3 + vec3(0.0, 6.0, 0.0));
    float pattern = n * 0.6 + n2 * 0.4;

    // soft edge "liquid pooling" mask near bottom of the plane
    float edge = smoothstep(0.0, 0.35, uv.y) * (1.0 - smoothstep(0.62, 1.0, uv.y));

    // color mix: base -> deep -> highlight bands of the shade
    vec3 col = mix(uColorA, uColorB, smoothstep(0.1, 0.75, pattern));
    col = mix(col, uColorC, smoothstep(0.55, 0.95, n2) * 0.6);

    // cursor ripples — soft concentric waves, fully smoothed via uMouse
    vec2 d = uv - uMouse;
    float dist = length(d) * 3.2;
    float ripple = sin(dist * 18.0 - uTime * 3.4) * exp(-dist * 1.7);
    col += uColorC * ripple * 0.12;

    // coarse noise shimmer
    col += (n - 0.5) * 0.06;

    // vignette to keep the centre calm
    float vig = 1.0 - smoothstep(0.55, 1.15, length(uv - 0.5) * 1.7);
    col *= mix(0.75, 1.0, vig);

    gl_FragColor = vec4(col * edge, edge * uOpacity);
  }
`

/* ---------------- hero liquid blob (displaced sphere) -------------- */
export const blobVert = /* glsl */ `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPos;
  ${noiseGLSL}
  void main(){
    vec3 pos = position;
    float n = fbm(normal * 1.6 + vec3(0.0, uTime * 0.18, uTime * 0.12));
    // mouse shifts the liquid mass organically
    vec3 mousePush = normalize(vec3(uMouseX, uMouseY * 0.7, 0.0)) * (n * 0.5);
    pos += normal * n * uIntensity + mousePush * 0.25;
    vNormal = normalMatrix * normal;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const blobFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColorDeep;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vPos);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.2);
    vec3 col = mix(uColorDeep, uColor, fres * 0.85 + 0.15);
    // soft moving highlight
    float hl = pow(max(dot(N, normalize(vec3(0.6, 0.8, 0.4))), 0.0), 6.0);
    col += vec3(1.0) * hl * (0.5 + 0.5 * sin(uTime * 0.6));
    gl_FragColor = vec4(col, 0.92);
  }
`

/* ---------------- pour stream (vertical falling paint) ------------- */
export const pourVert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const pourFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor;
  varying vec2 vUv;
  ${noiseGLSL}
  void main(){
    // falling streaks: noise scrolling downward
    vec2 uv = vUv;
    float n = snoise(vec3(uv.x * 14.0, uv.y * 22.0 - uTime * uSpeed, 0.0));
    float streak = smoothstep(0.12, 0.85, n * 0.5 + 0.5);
    // solid core
    float core = smoothstep(0.25, 0.0, abs(uv.x - 0.5));
    float alpha = max(core, streak * 0.55);
    alpha *= smoothstep(0.0, 0.2, uv.y) * (1.0 - smoothstep(0.7, 1.0, uv.y));
    vec3 col = mix(uColor * 0.7, uColor, streak);
    gl_FragColor = vec4(col, alpha);
  }
`

/* ---------------- spreading pool with ripples ---------------------- */
export const poolVert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const poolFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSpread;   // 0..1
  uniform vec3 uColor;
  varying vec2 vUv;
  ${noiseGLSL}
  void main(){
    vec2 c = vUv - 0.5;
    float d = length(c);
    // expanding radius as the pool spreads
    float radius = 0.25 + uSpread * 0.55;
    float pool = smoothstep(radius, radius - 0.18, d);
    // surface ripples
    float r = sin(d * 40.0 - uTime * 2.2) * exp(-d * 3.0) * 0.12;
    float n = snoise(vec3(vUv * 5.0, uTime * 0.1)) * 0.05;
    float alpha = pool * (1.0 + r + n);
    // darker rim for depth
    vec3 col = mix(uColor * 0.65, uColor, smoothstep(radius, radius - 0.2, d));
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0) * 0.9);
  }
`
