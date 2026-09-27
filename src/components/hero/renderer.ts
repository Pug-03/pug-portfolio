import { fragmentShader, vertexShader } from "./shaders";

export interface HeroRenderer {
  reveal(): void;
  glitch(): void;
  destroy(): void;
}

const UNIFORMS = ["uTex", "uRes", "uMouse", "uTime", "uVel", "uGlitch", "uScroll", "uIntro"] as const;

/** Raw WebGL renderer for the hero wordmark. Returns null when WebGL is unavailable. */
export function createHeroRenderer(canvas: HTMLCanvasElement, host: HTMLElement, word: string): HeroRenderer | null {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
    return s;
  };

  const prog = gl.createProgram()!;
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link error");
  } catch (e) {
    console.warn("[hero] WebGL fallback:", e);
    return null;
  }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = Object.fromEntries(UNIFORMS.map(n => [n, gl.getUniformLocation(prog, n)])) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

  const tex = gl.createTexture();
  const textCanvas = document.createElement("canvas");
  const ctx = textCanvas.getContext("2d")!;
  // next/font exposes the generated family name through this CSS variable
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";

  function drawText() {
    const W = canvas.width, H = canvas.height;
    textCanvas.width = W;
    textCanvas.height = H;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    const size = Math.min(W * (W < H ? 0.24 : 0.2), H * 0.36);
    ctx.font = `900 ${size}px ${family}`;
    const tw = ctx.measureText(word).width;
    const capH = size * 0.74;
    const triW = capH * 1.12;
    const gap = size * 0.12;
    const x0 = (W - (triW + gap + tw)) / 2;
    const base = H / 2 + capH / 2;

    // triangle mark (outlined, like a stylised "A")
    const lw = size * 0.1;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = lw;
    ctx.lineJoin = "miter";
    ctx.beginPath();
    ctx.moveTo(x0 + triW / 2, base - capH + lw * 0.6);
    ctx.lineTo(x0 + triW - lw * 0.5, base - lw * 0.5);
    ctx.lineTo(x0 + lw * 0.5, base - lw * 0.5);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(word, x0 + triW + gap, base);

    gl!.bindTexture(gl!.TEXTURE_2D, tex);
    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, textCanvas);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(host.clientWidth * dpr);
    canvas.height = Math.round(host.clientHeight * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    drawText();
  }

  const s = { mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, vel: 0, glitch: 0, intro: 0, introTarget: 0 };

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1 - (e.clientY - r.top) / r.height;
    s.vel = Math.min(1, s.vel + Math.hypot(nx - s.tx, ny - s.ty) * 3);
    s.tx = nx;
    s.ty = ny;
  };
  const onDown = () => (s.glitch = 1);
  let rt: ReturnType<typeof setTimeout>;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(resize, 150); };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("resize", onResize);
  host.addEventListener("pointerdown", onDown);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);

  let raf = 0;
  let nextBurst = 2;
  const t0 = performance.now();
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const time = (performance.now() - t0) / 1000;
    if (time > nextBurst) {
      s.glitch = 0.6 + Math.random() * 0.4;
      nextBurst = time + 2 + Math.random() * 3;
    }
    s.mx += (s.tx - s.mx) * 0.08;
    s.my += (s.ty - s.my) * 0.08;
    s.vel *= 0.92;
    s.glitch *= 0.88;
    s.intro += (s.introTarget - s.intro) * 0.035;
    const scroll = Math.min(1, Math.max(0, window.scrollY / host.clientHeight));

    gl!.uniform1i(U.uTex, 0);
    gl!.uniform2f(U.uRes, canvas.width, canvas.height);
    gl!.uniform2f(U.uMouse, s.mx, s.my);
    gl!.uniform1f(U.uTime, time);
    gl!.uniform1f(U.uVel, s.vel);
    gl!.uniform1f(U.uGlitch, s.glitch);
    gl!.uniform1f(U.uScroll, scroll);
    gl!.uniform1f(U.uIntro, s.intro);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }

  let destroyed = false;
  document.fonts.load(`900 100px ${family}`).finally(() => {
    if (destroyed) return;
    resize();
    frame();
  });

  return {
    reveal() { s.introTarget = 1; s.glitch = 1; },
    glitch() { s.glitch = 1; },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointerdown", onDown);
      // keep the context alive: React strict mode remounts onto the same canvas
    },
  };
}
