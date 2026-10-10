import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number; // 0 (far), 1 (mid), 2 (near)
  baseAlpha: number;
  pulsePhase: number;
}

interface Pulse {
  sourceIndex: number;
  targetIndex: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export const CinematicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check system prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for restrained interactive repulsion/parallax
    let mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Generate responsive particle density
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];

    const initParticles = () => {
      // Moderate count for high 60fps performance on mobile & desktop
      const isMobile = width < 768;
      const count = isMobile ? 38 : 72;

      particles = [];
      for (let i = 0; i < count; i++) {
        const depth = Math.floor(Math.random() * 3); // 0, 1, 2
        const speedMultiplier = depth === 2 ? 0.35 : depth === 1 ? 0.22 : 0.12;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedMultiplier,
          vy: (Math.random() - 0.5) * speedMultiplier,
          radius: depth === 2 ? 2.2 : depth === 1 ? 1.6 : 1.0,
          depth,
          baseAlpha: depth === 2 ? 0.8 : depth === 1 ? 0.5 : 0.25,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    // Pulse trigger timer
    let lastPulseTime = 0;

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Theme color palettes
    const getColors = (dark: boolean) => {
      if (dark) {
        return {
          particleNear: 'rgba(6, 182, 212, ', // cyan-500
          particleMid: 'rgba(56, 189, 248, ', // sky-400
          particleFar: 'rgba(99, 102, 241, ', // indigo-500
          line: 'rgba(56, 189, 248, ',
          pulse: 'rgba(103, 232, 249, 1)', // electric cyan
          radialGlow1: 'rgba(6, 182, 212, 0.08)',
          radialGlow2: 'rgba(59, 130, 246, 0.05)',
        };
      } else {
        // Light Mode: refined blue-grey filaments, soft cyan and teal glowing nodes
        return {
          particleNear: 'rgba(14, 116, 144, ', // cyan-700
          particleMid: 'rgba(2, 132, 199, ', // sky-600
          particleFar: 'rgba(79, 70, 229, ', // indigo-600
          line: 'rgba(14, 116, 144, ',
          pulse: 'rgba(6, 182, 212, 0.9)', // vibrant cyan accent pulse
          radialGlow1: 'rgba(6, 182, 212, 0.05)',
          radialGlow2: 'rgba(37, 99, 235, 0.04)',
        };
      }
    };

    const maxConnectionDistance = width < 768 ? 100 : 140;

    const render = (time: number) => {
      if (!isDocumentVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const colors = getColors(isDark);

      // Draw subtle ambient central glow
      const cx = width * 0.5;
      const cy = height * 0.35;
      const glowRadius = Math.max(width, height) * 0.45;
      const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, glowRadius);
      glowGrad.addColorStop(0, colors.radialGlow1);
      glowGrad.addColorStop(0.5, colors.radialGlow2);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Spawn traveling pulses across existing connections
      if (!prefersReducedMotion && time - lastPulseTime > 1800 && particles.length > 5) {
        lastPulseTime = time;
        const sourceIndex = Math.floor(Math.random() * particles.length);
        // Find nearest particle
        let nearestIdx = -1;
        let minDist = maxConnectionDistance;
        for (let j = 0; j < particles.length; j++) {
          if (sourceIndex === j) continue;
          const dx = particles[sourceIndex].x - particles[j].x;
          const dy = particles[sourceIndex].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < minDist) {
            minDist = d;
            nearestIdx = j;
          }
        }
        if (nearestIdx !== -1) {
          pulses.push({
            sourceIndex,
            targetIndex: nearestIdx,
            progress: 0,
            speed: 0.015,
            color: colors.pulse,
          });
        }
      }

      // Update and draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectionDistance) {
            const alphaFactor = 1 - dist / maxConnectionDistance;
            // Higher depth nodes get brighter lines
            const depthFactor = (p1.depth + p2.depth) / 4;
            const lineAlpha = (isDark ? 0.22 : 0.16) * alphaFactor * (0.4 + depthFactor * 0.6);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${colors.line}${lineAlpha})`;
            ctx.lineWidth = depthFactor > 0.7 ? 1.0 : 0.6;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Pulses
      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
        const pulse = pulses[pIdx];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(pIdx, 1);
          continue;
        }

        const p1 = particles[pulse.sourceIndex];
        const p2 = particles[pulse.targetIndex];
        if (!p1 || !p2) continue;

        const curX = p1.x + (p2.x - p1.x) * pulse.progress;
        const curY = p1.y + (p2.y - p1.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.pulse;
        ctx.shadowColor = colors.pulse;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Subtle gentle bounce at screen edges
          if (p.x < 0) {
            p.x = 0;
            p.vx *= -1;
          } else if (p.x > width) {
            p.x = width;
            p.vx *= -1;
          }

          if (p.y < 0) {
            p.y = 0;
            p.vy *= -1;
          } else if (p.y > height) {
            p.y = height;
            p.vy *= -1;
          }

          // Restrained mouse repulsion
          if (mouse.active) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDist = Math.hypot(mdx, mdy);
            if (mDist < 120 && mDist > 0) {
              const force = (120 - mDist) / 120;
              p.x += (mdx / mDist) * force * 1.2;
              p.y += (mdy / mDist) * force * 1.2;
            }
          }

          p.pulsePhase += 0.02;
        }

        // Particle pulse oscillation
        const pulse = Math.sin(p.pulsePhase) * 0.15;
        const currentAlpha = Math.max(0.1, Math.min(1, p.baseAlpha + pulse));

        const particleColorPrefix =
          p.depth === 2
            ? colors.particleNear
            : p.depth === 1
            ? colors.particleMid
            : colors.particleFar;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColorPrefix}${currentAlpha})`;

        // Glow on nearest high-depth nodes
        if (p.depth === 2) {
          ctx.shadowColor = isDark ? 'rgba(6, 182, 212, 0.6)' : 'rgba(2, 132, 199, 0.4)';
          ctx.shadowBlur = isDark ? 6 : 3;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-700 ease-in-out"
      style={{
        opacity: isDark ? 0.95 : 0.85,
      }}
    />
  );
};
