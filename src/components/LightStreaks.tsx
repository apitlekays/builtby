import { useEffect, useRef } from 'react';

const GRID_SIZE = 32; // Matches the bg-grid CSS pattern

// Color schemes for each app
const COLORS = {
  sajda: {
    // Purple/Violet theme
    trailStart: { r: 124, g: 58, b: 237 },   // violet-600
    trailEnd: { r: 167, g: 139, b: 250 },    // violet-400
    head: 'rgba(196, 181, 253, opacity)',     // violet-300
    headGlow: 'rgba(139, 92, 246, opacity)',  // violet-500
    glow: ['rgba(139, 92, 246, 0.06)', 'rgba(167, 139, 250, 0.03)', 'rgba(167, 139, 250, 0)'],
    trailGlow: 'rgba(139, 92, 246, alpha)',   // violet-500
  },
  curtask: {
    // Orange theme (matching curtask-web)
    trailStart: { r: 234, g: 88, b: 12 },    // orange-600
    trailEnd: { r: 251, g: 146, b: 60 },     // orange-400
    head: 'rgba(253, 186, 116, opacity)',     // orange-300
    headGlow: 'rgba(249, 115, 22, opacity)',  // orange-500
    glow: ['rgba(249, 115, 22, 0.06)', 'rgba(251, 146, 60, 0.03)', 'rgba(251, 146, 60, 0)'],
    trailGlow: 'rgba(249, 115, 22, alpha)',   // orange-500
  },
};

type AppType = 'sajda' | 'curtask';

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
  appType: AppType;
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

    // Two targets - positioned behind the app cards
    // Layout: max-w-4xl (896px) centered, with gap-6 (24px), 2-column grid on md+
    const getTargets = () => {
      const containerWidth = Math.min(canvas.width, 896);
      const offsetX = (canvas.width - containerWidth) / 2;
      const cardWidth = (containerWidth - 24) / 2; // gap-6 = 24px
      const isMobile = canvas.width < 768;

      // Hero section is ~200px, cards start around y=350-400
      const cardsY = isMobile ? 450 : 420;

      if (isMobile) {
        // Mobile: cards are stacked, target center of each
        return [
          { x: snapToGrid(canvas.width / 2), y: snapToGrid(cardsY) },           // Sajda (first card)
          { x: snapToGrid(canvas.width / 2), y: snapToGrid(cardsY + 320) },     // CurTask (second card)
        ];
      }

      // Desktop: side by side
      return [
        { x: snapToGrid(offsetX + cardWidth / 2 + 24), y: snapToGrid(cardsY) },           // Sajda (left)
        { x: snapToGrid(offsetX + cardWidth + 24 + cardWidth / 2), y: snapToGrid(cardsY) }, // CurTask (right)
      ];
    };

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

    const createStreak = (id: number, targetIndex: number): GridStreak => {
      const targets = getTargets();
      const target = targets[targetIndex];
      const appType: AppType = targetIndex === 0 ? 'sajda' : 'curtask';

      const edge = Math.floor(Math.random() * 4);
      let startX: number, startY: number;

      switch (edge) {
        case 0: // top
          startX = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.width - GRID_SIZE * 4));
          startY = -GRID_SIZE;
          break;
        case 1: // right
          startX = canvas.width + GRID_SIZE;
          startY = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.height * 0.7));
          break;
        case 2: // bottom
          startX = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.width - GRID_SIZE * 4));
          startY = canvas.height + GRID_SIZE;
          break;
        case 3: // left
        default:
          startX = -GRID_SIZE;
          startY = snapToGrid(GRID_SIZE * 2 + Math.random() * (canvas.height * 0.7));
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
        appType,
        targetIndex,
      };
    };

    // Create streaks - split between two targets
    const numStreaksPerTarget = 5;
    streaksRef.current = [
      ...Array.from({ length: numStreaksPerTarget }, (_, i) => createStreak(i, 0)),
      ...Array.from({ length: numStreaksPerTarget }, (_, i) => createStreak(i + numStreaksPerTarget, 1)),
    ];

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

      const targets = getTargets();

      streaksRef.current.forEach((streak, index) => {
        if (!streak.active && currentTime - startTime > streak.delay) {
          streak.active = true;
        }

        if (!streak.active) return;

        const target = targets[streak.targetIndex];
        const colors = COLORS[streak.appType];

        const totalLength = getTotalPathLength(streak);
        const currentDistance = streak.progress * totalLength;
        const headPos = getPositionAlongPath(streak, currentDistance);

        if (!headPos) {
          streaksRef.current[index] = createStreak(streak.id, streak.targetIndex);
          streaksRef.current[index].active = true;
          streaksRef.current[index].delay = 0;
          return;
        }

        const distToTarget = Math.sqrt(
          Math.pow(headPos.x - target.x, 2) + Math.pow(headPos.y - target.y, 2)
        );

        if (distToTarget > 100) {
          streak.opacity = Math.min(streak.opacity + 0.015, 0.1);
        } else {
          streak.opacity = Math.max((distToTarget / 100) * 0.1, 0);
        }

        const tailDistance = Math.max(0, currentDistance - streak.tailLength);

        // Draw the streak trail
        for (let d = tailDistance; d < currentDistance; d += 2) {
          const pos = getPositionAlongPath(streak, d);
          if (!pos) continue;

          const trailProgress = (d - tailDistance) / streak.tailLength;
          const alpha = trailProgress * streak.opacity;

          // Gradient from start to end color
          const r = Math.round(colors.trailStart.r + (colors.trailEnd.r - colors.trailStart.r) * trailProgress);
          const g = Math.round(colors.trailStart.g + (colors.trailEnd.g - colors.trailStart.g) * trailProgress);
          const b = Math.round(colors.trailStart.b + (colors.trailEnd.b - colors.trailStart.b) * trailProgress);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 1.5 + trailProgress * 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 4 + trailProgress * 2, 0, Math.PI * 2);
          ctx.fillStyle = colors.trailGlow.replace('alpha', String(alpha * 0.15));
          ctx.fill();
        }

        // Draw bright head
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.head.replace('opacity', String(streak.opacity));
        ctx.fill();

        // Head glow
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = colors.headGlow.replace('opacity', String(streak.opacity * 0.1));
        ctx.fill();

        streak.progress += streak.speed;
      });

      // Draw subtle convergence glow at each target
      targets.forEach((target, i) => {
        const colors = i === 0 ? COLORS.sajda : COLORS.curtask;
        const glowGradient = ctx.createRadialGradient(target.x, target.y, 0, target.x, target.y, 60);
        glowGradient.addColorStop(0, colors.glow[0]);
        glowGradient.addColorStop(0.5, colors.glow[1]);
        glowGradient.addColorStop(1, colors.glow[2]);

        ctx.beginPath();
        ctx.arc(target.x, target.y, 60, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
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
