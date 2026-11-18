import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const STAR_COUNT = Math.floor(Math.min(width, 1920) * 0.12);
    let stars = [];

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.4,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.015 + 0.005,
          color:
            Math.random() > 0.85
              ? '#27C5F5' // Cyan star
              : Math.random() > 0.7
              ? '#B78AFF' // Purple star
              : '#F5F7FF', // White star
          twinkleFactor: Math.random() * Math.PI * 2,
        });
      }
    }

    initStars();

    // Shooting stars
    const shootingStars = [];
    let lastShootingStarTime = Date.now();

    function maybeAddShootingStar() {
      const now = Date.now();
      if (now - lastShootingStarTime > 8000 && Math.random() < 0.3) {
        lastShootingStarTime = now;
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 10 + 8,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          alpha: 1,
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw starry sky
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const currentAlpha =
          star.alpha * (0.6 + 0.4 * Math.sin(time * 1.5 + star.twinkleFactor));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow vertical drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      }

      // Draw and update shooting stars
      maybeAddShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.save();
        ctx.strokeStyle = '#27C5F5';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.alpha;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.stroke();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.025;

        if (s.alpha <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Space Background Layer */}
      <div className="absolute inset-0 bg-[#080B18]" />

      {/* Subtle Nebula Cloud Gradients */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, #7667FF 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #27C5F5 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #B78AFF 0%, transparent 70%)',
        }}
      />

      {/* Canvas for Twinkling Stars & Cosmic Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
