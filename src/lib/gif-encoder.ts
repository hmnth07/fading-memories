export type ParticleType = "sakura" | "dust" | "rain" | "snow" | "firefly";

const GIF_SIZE = 512;
const TOTAL_FRAMES = 48;
const FRAME_DELAY = 83; // ~12fps in ms

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
  rotationSpeed: number;
}

function createParticles(type: ParticleType, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * GIF_SIZE,
      y: Math.random() * GIF_SIZE,
      size: getParticleSize(type),
      speed: getParticleSpeed(type),
      opacity: 0.3 + Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    });
  }
  return particles;
}

function getParticleSize(type: ParticleType): number {
  switch (type) {
    case "sakura": return 3 + Math.random() * 4;
    case "dust": return 1 + Math.random() * 2;
    case "rain": return 1 + Math.random() * 1;
    case "snow": return 2 + Math.random() * 3;
    case "firefly": return 2 + Math.random() * 2;
  }
}

function getParticleSpeed(type: ParticleType): number {
  switch (type) {
    case "sakura": return 0.5 + Math.random() * 1;
    case "dust": return 0.2 + Math.random() * 0.5;
    case "rain": return 3 + Math.random() * 4;
    case "snow": return 0.3 + Math.random() * 0.8;
    case "firefly": return 0.2 + Math.random() * 0.3;
  }
}

function getParticleCount(type: ParticleType): number {
  switch (type) {
    case "sakura": return 20;
    case "dust": return 30;
    case "rain": return 40;
    case "snow": return 25;
    case "firefly": return 15;
  }
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  type: ParticleType,
  frame: number
) {
  ctx.save();
  ctx.globalAlpha = p.opacity;

  switch (type) {
    case "sakura":
      ctx.fillStyle = `rgba(255, ${160 + Math.random() * 40}, ${180 + Math.random() * 40}, 1)`;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + frame * p.rotationSpeed);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "dust":
      ctx.fillStyle = `rgba(255, 240, 200, 1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "rain":
      ctx.strokeStyle = `rgba(180, 210, 255, 1)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 1, p.y + p.size * 4);
      ctx.stroke();
      break;

    case "snow":
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "firefly": {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15 + p.angle);
      glow.addColorStop(0, `rgba(255, 255, 150, ${pulse})`);
      glow.addColorStop(1, `rgba(255, 255, 150, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

function updateParticle(p: Particle, type: ParticleType, frame: number) {
  switch (type) {
    case "sakura":
      p.y += p.speed;
      p.x += Math.sin(frame * 0.05 + p.angle) * 0.8;
      break;
    case "dust":
      p.y -= p.speed * 0.3;
      p.x += Math.sin(frame * 0.03 + p.angle) * 0.5;
      p.opacity = 0.2 + 0.3 * Math.sin(frame * 0.05 + p.angle);
      break;
    case "rain":
      p.y += p.speed;
      p.x -= 0.5;
      break;
    case "snow":
      p.y += p.speed;
      p.x += Math.sin(frame * 0.04 + p.angle) * 0.6;
      break;
    case "firefly":
      p.x += Math.sin(frame * 0.08 + p.angle) * 0.8;
      p.y += Math.cos(frame * 0.06 + p.angle * 1.3) * 0.5;
      break;
  }

  // Wrap around
  if (p.y > GIF_SIZE + 10) p.y = -10;
  if (p.y < -10) p.y = GIF_SIZE + 10;
  if (p.x > GIF_SIZE + 10) p.x = -10;
  if (p.x < -10) p.x = GIF_SIZE + 10;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function encodeGif(
  imageUrl: string,
  particleType: ParticleType
): Promise<Blob> {
  const { Encoder } = await import("modern-gif");

  const img = await loadImage(imageUrl);

  const canvas = document.createElement("canvas");
  canvas.width = GIF_SIZE;
  canvas.height = GIF_SIZE;
  const ctx = canvas.getContext("2d")!;

  const particles = createParticles(particleType, getParticleCount(particleType));

  // Ken Burns: zoom from 1.0 to 1.15, slow pan
  const encoder = new Encoder({
    width: GIF_SIZE,
    height: GIF_SIZE,
    maxColors: 128,
  });

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const t = f / TOTAL_FRAMES;
    const zoom = 1.0 + t * 0.15;
    const panX = t * 15;
    const panY = t * 10;

    ctx.clearRect(0, 0, GIF_SIZE, GIF_SIZE);

    // Draw image with Ken Burns
    ctx.save();
    const scaledW = GIF_SIZE * zoom;
    const scaledH = GIF_SIZE * zoom;
    const offsetX = -(scaledW - GIF_SIZE) / 2 - panX;
    const offsetY = -(scaledH - GIF_SIZE) / 2 - panY;
    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
    ctx.restore();

    // Draw particles
    for (const p of particles) {
      drawParticle(ctx, p, particleType, f);
      updateParticle(p, particleType, f);
    }

    await encoder.encode({
      data: ctx.getImageData(0, 0, GIF_SIZE, GIF_SIZE).data.buffer,
      delay: FRAME_DELAY,
    });
  }

  return encoder.flush("blob");
}
