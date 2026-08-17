/**
 * LiquidImage — WebGL mouse-driven fluid distortion on hover.
 *
 * Renders a normal <img> (SSR-safe, keeps alt text + SEO), then overlays a
 * WebGL canvas once the image has loaded on the client. On hover the shader
 * pushes the pixels around the cursor with a ripple + slight chromatic
 * split, easing back to rest when the pointer leaves.
 *
 * Falls back silently to the plain <img> when WebGL is unavailable or the
 * user prefers reduced motion.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_scale;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_strength;
varying vec2 v_uv;

void main() {
  // Screen UV where (0,0) is top-left, (1,1) is bottom-right
  vec2 screen_uv = vec2(v_uv.x, 1.0 - v_uv.y);

  // Scaled UV for object-cover image texture
  vec2 uv = (screen_uv - 0.5) * u_scale + 0.5;

  // Pixel coordinates where (0,0) is top-left matching DOM mouse coordinates
  vec2 px = screen_uv * u_res;
  float m = max(u_res.x, u_res.y);
  float d = distance(px, u_mouse) / m;
  float falloff = exp(-d * 5.5) * u_strength;
  vec2 dir = normalize(px - u_mouse + vec2(0.0001));

  float ripple = sin(d * 34.0 - u_time * 3.2);
  uv += dir * ripple * 0.045 * falloff;
  uv += vec2(sin(uv.y * 9.0 + u_time * 0.9), cos(uv.x * 9.0 + u_time * 0.7)) * 0.005 * u_strength;

  vec2 ab = dir * 0.010 * falloff;
  float r = texture2D(u_tex, clamp(uv + ab, 0.0, 1.0)).r;
  vec4 c = texture2D(u_tex, clamp(uv, 0.0, 1.0));
  float b = texture2D(u_tex, clamp(uv - ab, 0.0, 1.0)).b;

  gl_FragColor = vec4(r, c.g, b, c.a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function LiquidImage({
  src,
  alt,
  className,
  imgClassName,
  width,
  height,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!wrap || !canvas || !img) return;

    let raf = 0;
    let disposed = false;
    const mouse = { x: -9999, y: -9999 };
    let strength = 0;
    let target = 0;

    const start = () => {
      if (disposed || !img.naturalWidth) return;
      const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true });
      if (!gl) return;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram();
      if (!prog) return;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      } catch {
        return; // cross-origin / tainted texture
      }

      const uRes = gl.getUniformLocation(prog, "u_res");
      const uScale = gl.getUniformLocation(prog, "u_scale");
      const uMouse = gl.getUniformLocation(prog, "u_mouse");
      const uTime = gl.getUniformLocation(prog, "u_time");
      const uStrength = gl.getUniformLocation(prog, "u_strength");

      let w = 0;
      let h = 0;
      const resize = () => {
        const rect = wrap.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = Math.max(1, Math.round(rect.width));
        h = Math.max(1, Math.round(rect.height));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, w, h);
        // object-cover fit
        const boxAspect = w / h;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        if (imgAspect > boxAspect) gl.uniform2f(uScale, boxAspect / imgAspect, 1);
        else gl.uniform2f(uScale, 1, imgAspect / boxAspect);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);

      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      };
      const onEnter = (e: PointerEvent) => {
        onMove(e);
        target = 1;
        setActive(true);
      };
      const onLeave = () => {
        target = 0;
      };
      wrap.addEventListener("pointerenter", onEnter);
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);

      const t0 = performance.now();
      const frame = () => {
        if (disposed) return;
        strength += (target - strength) * 0.08;
        if (strength < 0.002 && target === 0) {
          strength = 0;
          setActive(false);
        }
        gl.uniform1f(uTime, (performance.now() - t0) / 1000);
        gl.uniform1f(uStrength, strength);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        raf = requestAnimationFrame(frame);
      };
      frame();

      return () => {
        ro.disconnect();
        wrap.removeEventListener("pointerenter", onEnter);
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    };

    let cleanupInner: (() => void) | void;
    if (img.complete) cleanupInner = start();
    else img.addEventListener("load", () => (cleanupInner = start()), { once: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanupInner?.();
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        crossOrigin="anonymous"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          active && "opacity-0",
          imgClassName,
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
