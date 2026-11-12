// Design system for the Tanish Logistic brand film.
import { createCanvas, GlobalFonts, Path2D, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const DURATION = 45;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const REPO = path.resolve(ROOT, '..');

export const font = (file, alias) => GlobalFonts.registerFromPath(path.join(ROOT, 'fonts', file), alias);
font('Barlow-ExtraBold.ttf', 'BXB');
font('Barlow-Bold.ttf', 'XB');
font('Barlow-SemiBold.ttf', 'SB');
font('Barlow-Medium.ttf', 'MB');
font('Barlow-Regular.ttf', 'RG');
font('BarlowCondensed-Bold.ttf', 'CB');
font('BarlowCondensed-SemiBold.ttf', 'CSB');

export const C = {
  ink: '#04070E',
  navy: '#08101F',
  navy2: '#0D1A30',
  gold: '#F0B44C',
  goldLight: '#FFD98A',
  goldDeep: '#B87A20',
  white: '#FFFFFF',
  steel: '#9FB0C6',
  steelDim: '#6E8098',
  blue: '#3C74FF',
};

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const inv = (a, b, v) => clamp((v - a) / (b - a));
export const ease = {
  outCubic: (t) => 1 - (1 - t) ** 3,
  outQuart: (t) => 1 - (1 - t) ** 4,
  outQuint: (t) => 1 - (1 - t) ** 5,
  outExpo: (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  inOutCubic: (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
  inOutQuart: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
  outBack: (t) => 1 + 2.2 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2,
  smooth: (t) => t * t * (3 - 2 * t),
  linear: (t) => t,
};

// Deterministic pseudo random so every render is identical.
export function rand(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export function mkCanvas(w = W, h = H) {
  const canvas = createCanvas(w, h);
  return { canvas, ctx: canvas.getContext('2d') };
}

/* ------------------------------------------------------------------ text */

export function measureSpaced(ctx, text, spacing) {
  let width = 0;
  for (const ch of text) width += ctx.measureText(ch).width + spacing;
  return text.length ? width - spacing : 0;
}

export function textSpaced(ctx, text, x, y, spacing = 0, align = 'left') {
  const width = measureSpaced(ctx, text, spacing);
  let cursor = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
  ctx.textAlign = prevAlign;
  return width;
}

export function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/* ------------------------------------------------------------------ paint */

export function goldGradient(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#FFE7B4');
  g.addColorStop(0.35, C.goldLight);
  g.addColorStop(0.62, C.gold);
  g.addColorStop(1, C.goldDeep);
  return g;
}

export function verticalScrim(ctx, topA, bottomA, color = '5,9,18') {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(${color},${topA})`);
  g.addColorStop(0.45, `rgba(${color},${topA * 0.35})`);
  g.addColorStop(1, `rgba(${color},${bottomA})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function sideScrim(ctx, side = 'left', a = 0.85) {
  const g =
    side === 'left'
      ? ctx.createLinearGradient(0, 0, W * 0.78, 0)
      : ctx.createLinearGradient(W, 0, W * 0.22, 0);
  g.addColorStop(0, `rgba(4,7,14,${a})`);
  g.addColorStop(0.55, `rgba(4,7,14,${a * 0.45})`);
  g.addColorStop(1, 'rgba(4,7,14,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function vignette(ctx, strength = 0.55, inner = 0.58, outer = 1.12) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * inner, W / 2, H / 2, H * outer);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.65, `rgba(0,0,0,${strength * 0.35})`);
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

let grainTile = null;
export function getGrain() {
  if (grainTile) return grainTile;
  const size = 256;
  const { canvas, ctx } = mkCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const r = rand(1337);
  for (let i = 0; i < size * size; i++) {
    const v = 120 + Math.floor(r() * 135);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 26 + Math.floor(r() * 30);
  }
  ctx.putImageData(img, 0, 0);
  grainTile = canvas;
  return grainTile;
}

export function grain(ctx, frame, alpha = 0.5) {
  const tile = getGrain();
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'overlay';
  const ox = (frame * 37) % 256;
  const oy = (frame * 61) % 256;
  for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
  ctx.restore();
}

export function glow(ctx, x, y, radius, color = '240,180,76', alpha = 0.5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, `rgba(${color},${alpha})`);
  g.addColorStop(0.45, `rgba(${color},${alpha * 0.32})`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function dotGrid(ctx, step = 48, alpha = 0.16, color = 'rgba(140,170,210,1)') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (let y = step; y < H; y += step) {
    for (let x = step; x < W; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, 1.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ media */

export async function loadImageSync(p) {
  return await loadImage(p);
}

export function drawCover(ctx, img, opts = {}) {
  const { zoom = 1, panX = 0, panY = 0, w = W, h = H, x = 0, y = 0 } = opts;
  const iw = img.width;
  const ih = img.height;
  const scale = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, x + (w - dw) / 2 + panX, y + (h - dh) / 2 + panY, dw, dh);
}

export function gradeMedia(ctx, frame, opts = {}) {
  const { darkness = 0.5, tint = 'blue', bloom = true } = opts;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.3;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, tint === 'blue' ? '#1B3A63' : '#4A2E12');
  g.addColorStop(0.5, '#7C8CA0');
  g.addColorStop(1, tint === 'blue' ? '#3E2A14' : '#1B3A63');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = `rgba(4,7,14,${darkness})`;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  if (bloom) {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    const b = ctx.createRadialGradient(W * 0.7, H * 0.16, 0, W * 0.7, H * 0.16, H * 0.9);
    b.addColorStop(0, 'rgba(255,196,120,0.72)');
    b.addColorStop(1, 'rgba(255,196,120,0)');
    ctx.fillStyle = b;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // gentle exposure lift so the footage reads on screens/phones
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(255,236,214,0.07)';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // lens vignette belongs under the type, never over it
  vignette(ctx, 0.34 + darkness * 0.6);
}

/* ------------------------------------------------------------------ lines */

export function hairline(ctx, x, y, w, alpha = 0.35, color = '240,180,76') {
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, `rgba(${color},0)`);
  g.addColorStop(0.5, `rgba(${color},${alpha})`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, 1.2);
}

export function rule(ctx, x, y, w, alpha = 0.6, thickness = 2) {
  ctx.fillStyle = `rgba(240,180,76,${alpha})`;
  ctx.fillRect(x, y, w, thickness);
}

export function bracketFrame(ctx, x, y, w, h, len = 26, alpha = 0.75, color = '240,180,76') {
  ctx.save();
  ctx.strokeStyle = `rgba(${color},${alpha})`;
  ctx.lineWidth = 2;
  const corners = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * len);
    ctx.stroke();
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ logo */

// Calligraphic "TL" mark — path data mirrored from public/logo.svg
export const LOGO_PATHS = [
  { d: 'M 34.4,199.8 C 27.1,183 29.2,162 40.8,147.3 C 52.3,134.7 76.4,131.6 115.3,125.3 C 167.8,116.9 225.6,102.2 286.4,75.9 C 311.6,65.4 332.6,46.5 334.8,32.9', w: 20 },
  { d: 'M 334.8,32.9 C 343.1,38.1 343.1,48.6 332.6,61.2 C 311.6,86.4 275.9,115.8 241.3,149.4 C 202.4,196.7 162.6,285.9 110,417.2', w: 32 },
  { d: 'M 279.1,156.8 C 270.7,189.3 258.1,235.5 247.6,275.4 C 237.1,315.3 226.6,346.8 219.3,367.8', w: 20 },
  { d: 'M 219.3,367.8 C 208.8,382.5 181.4,407.7 160.4,417.2 C 155.2,420.3 158.3,426.6 170.9,426.6 C 188.8,426.6 206.7,406.7 231.8,378.3 C 262.3,371 309.6,382.5 362.1,389.9 C 409.3,389.9 446.1,369.9 482.8,310.1', w: 30 },
];

export function drawLogoMark(ctx, x, y, size, opts = {}) {
  const { alpha = 1, glowStrength = 26, dashProgress = 1, strokeScale = 1 } = opts;
  const s = size / 512;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (const p of LOGO_PATHS) {
    const path = new Path2D(p.d);
    ctx.save();
    ctx.lineWidth = p.w * strokeScale;
    ctx.shadowColor = 'rgba(250,190,90,0.9)';
    ctx.shadowBlur = glowStrength / s;
    ctx.strokeStyle = goldGradient(ctx, 0, 0, 512, 512);
    if (dashProgress < 1) ctx.globalAlpha = alpha * clamp(dashProgress * 4 - 0.0);
    ctx.stroke(path);
    ctx.restore();
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ icons */

export function icon(ctx, name, cx, cy, size, color = C.gold, lineWidth = 2.6) {
  const u = size / 24;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(u, u);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const P = (d) => new Path2D(d);
  const paths = {
    truck: ['M1 5h11v9H1z', 'M12 8h4l4 4v2h-8z', 'M5 17.5a1.6 1.6 0 1 0 0 .01', 'M16.5 17.5a1.6 1.6 0 1 0 0 .01'],
    warehouse: ['M3 9.5 12 4l9 5.5V20H3z', 'M8 20v-5h8v5', 'M3 9.5h18'],
    route: ['M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M9 16h5a4 4 0 0 0 0-8h-2'],
    shield: ['M12 3l7 3v5.5c0 4.4-3 7.7-7 9.5-4-1.8-7-5.1-7-9.5V6z', 'M9 12l2.2 2.2L15.5 10'],
    clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7.5V12l3.2 2'],
    pin: ['M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
    box: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M4 7.5l8 4.5 8-4.5', 'M12 12v9'],
    phone: ['M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z'],
    mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
    globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3.5 9h17', 'M3.5 15h17', 'M12 3c2.5 2.6 2.5 15.4 0 18', 'M12 3c-2.5 2.6-2.5 15.4 0 18'],
    arrow: ['M4 12h15', 'M13 6l6 6-6 6'],
    check: ['M4 12.5l5 5L20 6.5'],
  };
  for (const d of paths[name] || []) ctx.stroke(P(d));
  ctx.restore();
}
