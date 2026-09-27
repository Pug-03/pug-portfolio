export const vertexShader = /* glsl */ `
  attribute vec2 aPos; varying vec2 vUv;
  void main(){ vUv = aPos * .5 + .5; gl_Position = vec4(aPos, 0., 1.); }`;

/* Glowing wordmark with RGB split, mouse lens, glitch slices and an
   infinite "room" of grid lines behind it. */
export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uRes, uMouse;
  uniform float uTime, uVel, uGlitch, uScroll, uIntro;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float room(vec2 uv){
    vec2 c = uv - .5 - (uMouse - .5) * .06;
    vec2 q = abs(c) * 2.;
    float s = max(q.x, q.y) + 1e-4;
    float z = 1. / s;
    float w = fract(z * .6 - uTime * .12);
    float rings = 1. - smoothstep(0., .006 * z * z, min(w, 1. - w));
    float along = q.x > q.y ? c.y / abs(c.x) : c.x / abs(c.y);
    float a = fract(along * 4. + .5);
    float rails = 1. - smoothstep(0., .012 / s, min(a, 1. - a));
    return (rings * .9 + rails * .5) * smoothstep(.05, .9, s);
  }

  void main(){
    vec2 uv = vUv;
    float asp = uRes.x / uRes.y;

    float tick = floor(uTime * 18.);
    float band = floor(uv.y * 28.);
    float g = step(1. - uGlitch * .45, hash(vec2(band, tick)));
    uv.x += (hash(vec2(band + 3., tick)) - .5) * .14 * g;

    vec2 d = (uv - uMouse) * vec2(asp, 1.);
    float lens = smoothstep(.38, 0., length(d));
    vec2 t = uv - (uv - uMouse) * lens * .16;
    t = (t - .5) / (1. + uScroll * .5) + .5;

    float split = .002 + uVel * .03 + g * .025 + lens * .005;
    float r = texture2D(uTex, t + vec2(split, 0.)).r;
    float gg = texture2D(uTex, t).r;
    float b = texture2D(uTex, t - vec2(split, 0.)).r;

    float glow = 0.;
    for (int i = 0; i < 12; i++) {
      float ang = float(i) * .5236;
      vec2 o = vec2(cos(ang), sin(ang) * asp);
      glow += texture2D(uTex, t + o * .012).r;
      glow += texture2D(uTex, t + o * .035).r * .7;
      glow += texture2D(uTex, t + o * .06).r * .25;
    }
    glow /= 25.;

    float blk = hash(floor(vUv * vec2(48., 24.)));
    float show = smoothstep(blk - .1, blk, uIntro * 1.15);

    vec3 txt = vec3(r, gg, b) * show;
    vec3 halo = mix(vec3(.25, .45, 1.), vec3(.65, .35, 1.), vUv.x) * glow * 1.6 * show;
    halo *= .85 + .15 * sin(uTime * 2.);

    vec3 bg = vec3(.28, .42, 1.) * room(vUv) * .28 * uIntro;
    bg += vec3(.35, .2, .7) * (1. - length((vUv - .5) * vec2(asp, 1.))) * .06;

    vec3 col = bg * (1. - gg) + txt + halo;
    col += g * vec3(.2, .5, 1.) * .15;
    col *= .9 + .1 * sin(vUv.y * uRes.y * 1.4);
    col *= 1. - smoothstep(.5, 1.2, length((vUv - .5) * vec2(asp * .8, 1.)));
    col *= 1. - uScroll * .85;
    col += (hash(vUv * uRes + uTime) - .5) * .04;
    gl_FragColor = vec4(col, 1.);
  }`;
