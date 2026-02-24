import { useEffect, useRef } from 'react';

const GRID_SIZE = 32;
const TOTAL_STREAKS = 20;

type ColorKey = 'violet' | 'orange' | 'cyan';

const COLORS: Record<ColorKey, {
  trailStart: { r: number; g: number; b: number };
  trailEnd: { r: number; g: number; b: number };
  head: string;
  headGlow: string;
  glow: string[];
  trailGlow: string;
}> = {
  violet: {
    trailStart: { r: 124, g: 58, b: 237 },
    trailEnd: { r: 167, g: 139, b: 250 },
    head: 'rgba(196, 181, 253, opacity)',
    headGlow: 'rgba(139, 92, 246, opacity)',
    glow: ['rgba(139, 92, 246, 0.06)', 'rgba(167, 139, 250, 0.03)', 'rgba(167, 139, 250, 0)'],
    trailGlow: 'rgba(139, 92, 246, alpha)',
  },
  orange: {
    trailStart: { r: 234, g: 88, b: 12 },
    trailEnd: { r: 251, g: 146, b: 60 },
    head: 'rgba(253, 186, 116, opacity)',
    headGlow: 'rgba(249, 115, 22, opacity)',
    glow: ['rgba(249, 115, 22, 0.06)', 'rgba(251, 146, 60, 0.03)', 'rgba(251, 146, 60, 0)'],
    trailGlow: 'rgba(249, 115, 22, alpha)',
  },
  cyan: {
    trailStart: { r: 6, g: 182, b: 212 },
    trailEnd: { r: 103, g: 232, b: 249 },
    head: 'rgba(165, 243, 252, opacity)',
    headGlow: 'rgba(6, 182, 212, opacity)',
    glow: ['rgba(6, 182, 212, 0.06)', 'rgba(103, 232, 249, 0.03)', 'rgba(103, 232, 249, 0)'],
    trailGlow: 'rgba(6, 182, 212, alpha)',
  },
};

interface Target {
  x: number;
  y: number;
  colorKey: ColorKey;
}

interface GridStreak {
  id: number;
  path: { x: number; y: number }[];
  progress: number;
  speed: number;
  delay: number;
  opacity: number;
  active: boolean;
  tailLength: number;
  colorKey: ColorKey;
  targetIndex: number;
}

export function LightStreaks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<GridStreak[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetsCache: Target[] = [];
    let startTime = Date.now();

    const snap = (v: number) => Math.round(v / GRID_SIZE) * GRID_SIZE;

    // Read actual DOM positions — works regardless of scroll position because
    // both element rect and container rect are viewport-relative, so scroll cancels out.
    const measureTargets = (): Target[] => {
      const cr = container.getBoundingClientRect();
      const targets: Target[] = [];
      document.querySelectorAll<HTMLElement>('[data-streak-target]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const x = snap(r.left + r.width / 2 - cr.left);
        const y = snap(r.top + r.height / 2 - cr.top);
        const id = el.dataset.streakTarget ?? '';
        const colorKey: ColorKey =
          id === 'app-curtask' ? 'orange' :
          id.startsWith('project-') ? 'cyan' :
          'violet';
        targets.push({ x, y, colorKey });
      });
      return targets;
    };

    const generatePath = (sx: number, sy: number, tx: number, ty: number) => {
      const path: { x: number; y: number }[] = [];
      let cx = snap(sx), cy = snap(sy);
      path.push({ x: cx, y: cy });
      const hFirst = Math.random() > 0.5;
      const nWp = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < nWp; i++) {
        const p = (i + 1) / (nWp + 1);
        const wx = snap(cx + (tx - cx) * p + (Math.random() - 0.5) * GRID_SIZE * 4);
        const wy = snap(cy + (ty - cy) * p + (Math.random() - 0.5) * GRID_SIZE * 3);
        if (hFirst) {
          if (wx !== cx) { path.push({ x: wx, y: cy }); cx = wx; }
          if (wy !== cy) { path.push({ x: cx, y: wy }); cy = wy; }
        } else {
          if (wy !== cy) { path.push({ x: cx, y: wy }); cy = wy; }
          if (wx !== cx) { path.push({ x: wx, y: cy }); cx = wx; }
        }
      }
      if (tx !== cx) { path.push({ x: tx, y: cy }); cx = tx; }
      if (ty !== cy) { path.push({ x: cx, y: ty }); }
      return path;
    };

    const createStreak = (id: number, targets: Target[]): GridStreak | null => {
      if (!targets.length) return null;
      const ti = Math.floor(Math.random() * targets.length);
      const target = targets[ti];
      const edge = Math.floor(Math.random() * 4);
      let sx: number, sy: number;
      switch (edge) {
        case 0: sx = snap(GRID_SIZE * 2 + Math.random() * (canvas.width - GRID_SIZE * 4)); sy = -GRID_SIZE; break;
        case 1: sx = canvas.width + GRID_SIZE; sy = snap(GRID_SIZE * 2 + Math.random() * (canvas.height * 0.7)); break;
        case 2: sx = snap(GRID_SIZE * 2 + Math.random() * (canvas.width - GRID_SIZE * 4)); sy = canvas.height + GRID_SIZE; break;
        default: sx = -GRID_SIZE; sy = snap(GRID_SIZE * 2 + Math.random() * (canvas.height * 0.7));
      }
      return {
        id,
        path: generatePath(sx, sy, target.x, target.y),
        progress: 0,
        speed: 0.003 + Math.random() * 0.002,
        delay: Math.random() * 5000,
        opacity: 0,
        active: false,
        tailLength: 60 + Math.random() * 40,
        colorKey: target.colorKey,
        targetIndex: ti,
      };
    };

    const buildStreaks = (targets: Target[]) =>
      Array.from({ length: TOTAL_STREAKS }, (_, i) => createStreak(i, targets))
        .filter((s): s is GridStreak => s !== null);

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      targetsCache = measureTargets();
      streaksRef.current = buildStreaks(targetsCache);
      startTime = Date.now();
    };

    // Set initial canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    window.addEventListener('resize', resizeCanvas);

    // Measure targets after DOM layout settles
    setTimeout(() => {
      targetsCache = measureTargets();
      streaksRef.current = buildStreaks(targetsCache);
    }, 100);

    const pathLength = (streak: GridStreak) => {
      let total = 0;
      for (let i = 0; i < streak.path.length - 1; i++) {
        total += Math.abs(streak.path[i + 1].x - streak.path[i].x) + Math.abs(streak.path[i + 1].y - streak.path[i].y);
      }
      return total;
    };

    const posAtDist = (streak: GridStreak, dist: number) => {
      let rem = dist;
      for (let i = 0; i < streak.path.length - 1; i++) {
        const s = streak.path[i], e = streak.path[i + 1];
        const len = Math.abs(e.x - s.x) + Math.abs(e.y - s.y);
        if (rem <= len) {
          const t = len > 0 ? rem / len : 0;
          return { x: s.x + (e.x - s.x) * t, y: s.y + (e.y - s.y) * t };
        }
        rem -= len;
      }
      return null;
    };

    const animate = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw convergence glow at each target
      targetsCache.forEach((t) => {
        const colors = COLORS[t.colorKey];
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 60);
        grad.addColorStop(0, colors.glow[0]);
        grad.addColorStop(0.5, colors.glow[1]);
        grad.addColorStop(1, colors.glow[2]);
        ctx.beginPath();
        ctx.arc(t.x, t.y, 60, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      streaksRef.current.forEach((streak, idx) => {
        if (!streak.active && now - startTime > streak.delay) streak.active = true;
        if (!streak.active) return;

        const target = targetsCache[streak.targetIndex];
        if (!target) return;

        const colors = COLORS[streak.colorKey];
        const total = pathLength(streak);
        const curDist = streak.progress * total;
        const head = posAtDist(streak, curDist);

        if (!head) {
          const next = createStreak(streak.id, targetsCache);
          if (next) { next.active = true; next.delay = 0; streaksRef.current[idx] = next; }
          return;
        }

        const distToTarget = Math.hypot(head.x - target.x, head.y - target.y);
        streak.opacity = distToTarget > 100
          ? Math.min(streak.opacity + 0.015, 0.1)
          : Math.max((distToTarget / 100) * 0.1, 0);

        const tailStart = Math.max(0, curDist - streak.tailLength);
        for (let d = tailStart; d < curDist; d += 2) {
          const pos = posAtDist(streak, d);
          if (!pos) continue;
          const tp = (d - tailStart) / streak.tailLength;
          const alpha = tp * streak.opacity;
          const r = Math.round(colors.trailStart.r + (colors.trailEnd.r - colors.trailStart.r) * tp);
          const g = Math.round(colors.trailStart.g + (colors.trailEnd.g - colors.trailStart.g) * tp);
          const b = Math.round(colors.trailStart.b + (colors.trailEnd.b - colors.trailStart.b) * tp);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 1.5 + tp, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4 + tp * 2, 0, Math.PI * 2);
          ctx.fillStyle = colors.trailGlow.replace('alpha', String(alpha * 0.15));
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.head.replace('opacity', String(streak.opacity));
        ctx.fill();

        ctx.beginPath();
        ctx.arc(head.x, head.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = colors.headGlow.replace('opacity', String(streak.opacity * 0.1));
        ctx.fill();

        streak.progress += streak.speed;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
