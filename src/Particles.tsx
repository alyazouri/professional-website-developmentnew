import { useEffect, useRef } from "react";

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const gold = ["#ffd166", "#ffb347", "#ff9a3c", "#ffe08a", "#ffcb6b", "#ff7a00", "#ffefc4"];

    type Dot = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      a: number;
      t: number;
      c: string;
    };

    const count = Math.min(60, Math.floor((W * H) / 28000));
    const dots: Dot[] = [];

    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        a: Math.random() * 0.5 + 0.2,
        t: Math.random() * Math.PI * 2,
        c: gold[Math.floor(Math.random() * gold.length)],
      });
    }

    let f = 0;
    let raf: number;

    const loop = () => {
      f++;
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        d.y += d.vy;
        d.x += d.vx + Math.sin(d.t + f * 0.008) * 0.1;
        d.t += 0.014;

        if (d.y > H + 8) {
          d.y = -8;
          d.x = Math.random() * W;
        }
        if (d.x > W + 8) d.x = -8;
        if (d.x < -8) d.x = W + 8;

        ctx.globalAlpha = d.a * (0.5 + Math.abs(Math.sin(d.t)) * 0.5);
        ctx.fillStyle = d.c;
        ctx.shadowBlur = 6;
        ctx.shadowColor = d.c;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };

    loop();

    const rs = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", rs);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rs);
    };
  }, []);

  return (
    <>
      {/* Golden Eagle SVG — majestic backdrop */}
      <svg
        className="fixed inset-0 -z-10 h-full w-full opacity-5"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M0 450 C 200 200, 400 600, 720 450 S 1240 200, 1440 450"
          stroke="url(#eagleGrad)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="eagleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffd166" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Floating gold dust canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 h-full w-full"
        style={{ pointerEvents: "none" }}
      />
    </>
  );
}
