import { useEffect, useRef } from 'react';

const GRID_SIZE = 32; // Matches the bg-grid CSS pattern

interface GridStreak {
  id: number;
  path: { x: number; y: number }[];
  currentSegment: number;
  progress: number;
  speed: number;
  delay: number;
  opacity: number;
  active: boolean;
  tailLength: number;
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

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const snapToGrid = (value: number): number => {
      return Math.round(value / GRID_SIZE) * GRID_SIZE;
    };

    const getTarget = () => ({
      x: snapToGrid(canvas.width / 2),
      y: snapToGrid(200),
    });

    const generateGridPath = (
      startX: number,
      startY: number,
      targetX: number,
      targetY: number
    ): { x: number; y: number }[] => {
      const path: { x: number; y: number }[] = [];

      let currentX = snapToGrid(startX);
      let currentY = snapToGrid(startY);

      path.push({ x: currentX, y: currentY });

      const horizontalFirst = Math.random() > 0.5;
      const numWaypoints = 1 + Math.floor(Math.random() * 2);

      for (let i = 0; i < numWaypoints; i++) {
        const progressX = (i + 1) / (numWaypoints + 1);
        const progressY = (i + 1) / (numWaypoints + 1);

        const waypointX = snapToGrid(
          currentX + (targetX - currentX) * progressX + (Math.random() - 0.5) * GRID_SIZE * 4
        );
        const waypointY = snapToGrid(
          currentY + (targetY - currentY) * progressY + (Math.random() - 0.5) * GRID_SIZE * 3
        );

        if (horizontalFirst) {
          if (waypointX !== currentX) {
            path.push({ x: waypointX, y: currentY });
            currentX = waypointX;
          }
          if (waypointY !== currentY) {
            path.push({ x: currentX, y: waypointY });
            currentY = waypointY;
          }
        } else {
          if (waypointY !== currentY) {
            path.push({ x: currentX, y: waypointY });
            currentY = waypointY;
          }
          if (waypointX !== currentX) {
            path.push({ x: waypointX, y: currentY });
            currentX = waypointX;
          }
        }
      }

      if (targetX !== currentX) {
        path.push({ x: targetX, y: currentY });
        currentX = targetX;
      }
      if (targetY !== currentY) {
        path.push({ x: currentX, y: targetY });
      }

      return path;
    };

    const createStreak = (id: number): GridStreak => {
      const target = getTarget();
      const edge = Math.floor(Math.random() * 4);
      let startX: number, startY: number;

      switch (edge) {
        case 0: // top
          startX = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.width - GRID_SIZE * 4));
          startY = -GRID_SIZE;
          break;
        case 1: // right
          startX = canvas.width + GRID_SIZE;
          startY = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.height * 0.6));
          break;
        case 2: // bottom
          startX = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.width - GRID_SIZE * 4));
          startY = canvas.height + GRID_SIZE;
          break;
        case 3: // left
        default:
          startX = -GRID_SIZE;
          startY = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.height * 0.6));
          break;
      }

      const path = generateGridPath(startX, startY, target.x, target.y);

      return {
        id,
        path,
        currentSegment: 0,
        progress: 0,
        speed: 0.003 + Math.random() * 0.002,
        delay: Math.random() * 5000,
        opacity: 0,
        active: false,
        tailLength: 60 + Math.random() * 40,
      };
    };

    const numStreaks = 10;
    streaksRef.current = Array.from({ length: numStreaks }, (_, i) => createStreak(i));

    let startTime = Date.now();

    const getPositionAlongPath = (
      streak: GridStreak,
      totalDistance: number
    ): { x: number; y: number } | null => {
      let remainingDistance = totalDistance;

      for (let i = 0; i < streak.path.length - 1; i++) {
        const start = streak.path[i];
        const end = streak.path[i + 1];
        const segmentLength = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);

        if (remainingDistance <= segmentLength) {
          const t = segmentLength > 0 ? remainingDistance / segmentLength : 0;
          return {
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t,
          };
        }
        remainingDistance -= segmentLength;
      }

      return null;
    };

    const getTotalPathLength = (streak: GridStreak): number => {
      let total = 0;
      for (let i = 0; i < streak.path.length - 1; i++) {
        const start = streak.path[i];
        const end = streak.path[i + 1];
        total += Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
      }
      return total;
    };

    const animate = () => {
      const currentTime = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const target = getTarget();

      streaksRef.current.forEach((streak, index) => {
        if (!streak.active && currentTime - startTime > streak.delay) {
          streak.active = true;
        }

        if (!streak.active) return;

        const totalLength = getTotalPathLength(streak);
        const currentDistance = streak.progress * totalLength;
        const headPos = getPositionAlongPath(streak, currentDistance);

        if (!headPos) {
          streaksRef.current[index] = createStreak(streak.id);
          streaksRef.current[index].active = true;
          streaksRef.current[index].delay = 0;
          return;
        }

        const distToTarget = Math.sqrt(
          Math.pow(headPos.x - target.x, 2) + Math.pow(headPos.y - target.y, 2)
        );

        if (distToTarget > 100) {
          streak.opacity = Math.min(streak.opacity + 0.015, 0.08);
        } else {
          streak.opacity = Math.max((distToTarget / 100) * 0.08, 0);
        }

        const tailDistance = Math.max(0, currentDistance - streak.tailLength);

        // Draw the streak trail
        for (let d = tailDistance; d < currentDistance; d += 2) {
          const pos = getPositionAlongPath(streak, d);
          if (!pos) continue;

          const trailProgress = (d - tailDistance) / streak.tailLength;
          const alpha = trailProgress * streak.opacity;

          // Indigo gradient: from indigo-600 to indigo-400
          const r = Math.round(79 + (129 - 79) * trailProgress);
          const g = Math.round(70 + (140 - 70) * trailProgress);
          const b = Math.round(229 + (248 - 229) * trailProgress);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 1.5 + trailProgress * 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4 + trailProgress * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.15})`;
          ctx.fill();
        }

        // Draw bright head
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${streak.opacity})`; // indigo-300
        ctx.fill();

        // Head glow
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${streak.opacity * 0.08})`; // indigo-400
        ctx.fill();

        streak.progress += streak.speed;
      });

      // Draw subtle convergence glow at target
      const glowGradient = ctx.createRadialGradient(target.x, target.y, 0, target.x, target.y, 60);
      glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
      glowGradient.addColorStop(0.5, 'rgba(129, 140, 248, 0.03)');
      glowGradient.addColorStop(1, 'rgba(129, 140, 248, 0)');

      ctx.beginPath();
      ctx.arc(target.x, target.y, 60, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

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
