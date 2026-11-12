// Scene composition for the Tanish Logistic brand film (1920x1080, 30fps).
import {
  W, H, C, clamp, lerp, inv, ease, rand, mkCanvas, goldGradient, textSpaced, measureSpaced,
  verticalScrim, sideScrim, vignette, glow, dotGrid, hairline, rule, bracketFrame,
  drawLogoMark, icon, drawCover, gradeMedia, wrapLines,
} from './design.js';

export const CUT = {
  open: 0,
  hook: 5.0,
  slogan: 9.5,
  stats: 13.5,
  services: 20.5,
  network: 28.5,
  proof: 35.0,
  cta: 40.0,
  end: 45.0,
};

/* --------------------------------------------------------------- helpers */

function wordRise(ctx, { text, x, y, size, family, color, spacing = 0, t, t0, dur = 0.55, stagger = 0.06, rise = 0.7, align = 'left', alpha = 1 }) {
  ctx.save();
  ctx.font = `${size}px ${family}`;
  ctx.textBaseline = 'alphabetic';
  const words = text.split(' ');
  const spaceW = ctx.measureText(' ').width + spacing;
  const widths = words.map((w) => measureSpaced(ctx, w, spacing));
  const total = widths.reduce((a, b) => a + b, 0) + spaceW * (words.length - 1);
  let cursor = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  words.forEach((word, i) => {
    const p = ease.outQuint(clamp((t - t0 - i * stagger) / dur));
    if (p <= 0) {
      cursor += widths[i] + spaceW;
      return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(cursor - size * 0.12, y - size * 1.28, widths[i] + size * 0.28, size * 1.62);
    ctx.clip();
    ctx.globalAlpha = alpha * clamp(p * 1.8);
    ctx.fillStyle = color;
    ctx.translate(0, (1 - p) * size * rise);
    textSpaced(ctx, word, cursor, y, spacing);
    ctx.restore();
    cursor += widths[i] + spaceW;
  });
  ctx.restore();
  return total;
}

function wordSlide(ctx, { text, x, y, size, family, color, spacing = 0, t, t0, dur = 0.7, stagger = 0.05, dx = -40, align = 'left', alpha = 1 }) {
  ctx.save();
  ctx.font = `${size}px ${family}`;
  const words = text.split(' ');
  const spaceW = ctx.measureText(' ').width + spacing;
  const widths = words.map((w) => measureSpaced(ctx, w, spacing));
  const total = widths.reduce((a, b) => a + b, 0) + spaceW * (words.length - 1);
  let cursor = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  words.forEach((word, i) => {
    const p = ease.outQuart(clamp((t - t0 - i * stagger) / dur));
    if (p > 0) {
      ctx.globalAlpha = alpha * p;
      textSpaced(ctx, word, cursor + (1 - p) * dx, y, spacing);
    }
    cursor += widths[i] + spaceW;
  });
  ctx.restore();
}

function eyebrow(ctx, text, x, y, t, t0, { color = C.gold, size = 15, align = 'left', spacing = 5.5, line = true } = {}) {
  const p = ease.outCubic(clamp((t - t0) / 0.7));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.font = `${size}px XB`;
  ctx.fillStyle = color;
  const w = textSpaced(ctx, text, x, y, spacing, align);
  if (line) {
    const gap = 16;
    const lineW = 54 * p;
    if (align === 'left') rule(ctx, x + w + gap, y - size * 0.32, lineW, 0.55 * p, 1.5);
    if (align === 'center') {
      ctx.save();
      ctx.globalAlpha = p * 0.6;
      rule(ctx, x - w / 2 - gap - lineW, y - size * 0.32, lineW, 0.8, 1.5);
      rule(ctx, x + w / 2 + gap, y - size * 0.32, lineW, 0.8, 1.5);
      ctx.restore();
    }
  }
  ctx.restore();
}

function sweep(ctx, t, t0, dur, { x = 0, y = 0, w = W, h = H, angle = -0.35, alpha = 0.5 } = {}) {
  const p = inv(t0, t0 + dur, t);
  if (p <= 0 || p >= 1) return;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);
  const band = w * 0.34;
  const cx = lerp(-w * 0.9, w * 0.9, ease.inOutCubic(p));
  const g = ctx.createLinearGradient(cx - band, 0, cx + band, 0);
  g.addColorStop(0, 'rgba(255,226,170,0)');
  g.addColorStop(0.45, `rgba(255,226,170,${alpha * 0.75})`);
  g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
  g.addColorStop(0.55, `rgba(255,214,140,${alpha * 0.7})`);
  g.addColorStop(1, 'rgba(255,226,170,0)');
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = g;
  ctx.fillRect(-w, -h, w * 2, h * 2);
  ctx.restore();
}

function counter(ctx, value, { x, y, size, family = 'XB', color, decimals = 0, suffix = '', prefix = '', align = 'left' }) {
  const label = prefix + value.toFixed(decimals) + suffix;
  ctx.save();
  ctx.font = `${size}px ${family}`;
  ctx.fillStyle = color;
  textSpaced(ctx, label, x, y, 0, align);
  ctx.restore();
  return label;
}

/* ---------------------------------------------------------------- SCENE 1 */
export async function sceneOpen(ctx, t, A) {
  const lt = t - CUT.open;
  // Footage: mountain highway with oncoming trucks.
  const zoom = 1.06 + 0.055 * ease.linear(clamp(lt / 5));
  drawCover(ctx, await A.footage('mountain', 0.6 + lt), { zoom, panY: -10 });
  gradeMedia(ctx, 0, { darkness: 0.34, tint: 'blue' });
  const grad = ctx.createLinearGradient(0, 0, W * 0.85, 0);
  grad.addColorStop(0, 'rgba(3,6,13,0.9)');
  grad.addColorStop(0.45, 'rgba(3,6,13,0.52)');
  grad.addColorStop(1, 'rgba(3,6,13,0.12)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  verticalScrim(ctx, 0.35, 0.8);
  glow(ctx, W * 0.72, H * 0.28, 620, '236,164,74', 0.16);

  // Top bar: mark + wordmark
  const topP = ease.outCubic(clamp((lt - 0.35) / 0.9));
  if (topP > 0) {
    ctx.save();
    ctx.globalAlpha = topP;
    drawLogoMark(ctx, 108, 74, 54, { glowStrength: 16 });
    ctx.font = '19px XB';
    ctx.fillStyle = C.white;
    textSpaced(ctx, 'TANISH LOGISTIC', 178, 112, 4.2);
    ctx.font = '12px SB';
    ctx.fillStyle = 'rgba(159,176,198,0.85)';
    textSpaced(ctx, 'B2B ROAD FREIGHT', 178, 132, 3.4);
    ctx.restore();
  }
  // right side: location lockup
  if (topP > 0) {
    ctx.save();
    ctx.globalAlpha = topP * 0.9;
    ctx.font = '13px SB';
    ctx.fillStyle = 'rgba(226,234,246,0.8)';
    textSpaced(ctx, 'VADODARA  ·  GUJARAT  ·  PAN-INDIA', W - 120, 118, 3.2, 'right');
    ctx.restore();
  }

  // Headline block
  const line1 = 'MOVING INDIA’S';
  const line2 = 'BUSINESS FORWARD';
  eyebrow(ctx, 'FREIGHT THAT KEEPS ITS WORD', 122, 372, t, CUT.open + 0.4, { size: 15, spacing: 6 });

  wordRise(ctx, {
    text: line1, x: 116, y: 500, size: 124, family: 'XB', color: C.white,
    t, t0: CUT.open + 0.5, stagger: 0.09, rise: 0.75, spacing: -1.5,
  });
  const g2 = goldGradient(ctx, 116, 560, 1180, 700);
  wordRise(ctx, {
    text: line2, x: 116, y: 630, size: 124, family: 'XB', color: g2,
    t, t0: CUT.open + 0.78, stagger: 0.075, rise: 0.75, spacing: -1.5,
  });
  sweep(ctx, t, 2.9, 1.5, { y: -60, h: H + 120, alpha: 0.16, angle: -0.22 });

  // Sub copy
  const subP = ease.outCubic(clamp((t - 1.95) / 0.9));
  if (subP > 0) {
    ctx.save();
    ctx.globalAlpha = subP;
    ctx.font = '26px MB';
    ctx.fillStyle = 'rgba(226,234,246,0.9)';
    let x = 122;
    for (const [i, part] of ['Full truckload', 'Industrial cargo', 'Contract fleet'].entries()) {
      if (i) {
        ctx.fillStyle = 'rgba(240,180,76,0.75)';
        ctx.fillText('·', x + 8, 726);
        ctx.fillStyle = 'rgba(226,234,246,0.9)';
        x += 28;
      }
      ctx.fillText(part, x, 726);
      x += ctx.measureText(part).width + 10;
    }
    ctx.restore();
  }

  // bottom progress strip
  const bp = ease.inOutCubic(clamp((t - 1.6) / 2.6));
  ctx.save();
  ctx.globalAlpha = 0.55;
  rule(ctx, 122, 968, 260 * bp, 0.9, 2);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = clamp((t - 1.9) / 0.6) * 0.8;
  ctx.font = '13px SB';
  ctx.fillStyle = 'rgba(226,234,246,0.72)';
  textSpaced(ctx, 'EST. IN GUJARAT  ·  5+ YEARS ON THE ROAD', 122, 1000, 3.1);
  ctx.restore();
}

/* ---------------------------------------------------------------- SCENE 2 */
export async function sceneHook(ctx, t, A) {
  const lt = t - CUT.hook;
  drawCover(ctx, await A.footage('highway', 1.2 + lt), { zoom: 1.1 + 0.05 * ease.linear(clamp(lt / 4.5)), panX: 40 });
  gradeMedia(ctx, 0, { darkness: 0.4, tint: 'warm' });
  sideScrim(ctx, 'left', 0.9);
  verticalScrim(ctx, 0.25, 0.85);

  // oversized watermark mark
  drawLogoMark(ctx, W - 560, 250, 520, { glowStrength: 0, alpha: 0.055 });

  eyebrow(ctx, 'THE OPERATING STANDARD', 122, 330, t, CUT.hook + 0.08, { size: 14 });

  wordRise(ctx, {
    text: 'YOUR CARGO.', x: 116, y: 470, size: 138, family: 'XB', color: C.white,
    t, t0: CUT.hook + 0.12, stagger: 0.09, rise: 0.8, spacing: -2,
  });
  const g = goldGradient(ctx, 116, 520, 1200, 640);
  wordRise(ctx, {
    text: 'OUR DISCIPLINE.', x: 116, y: 610, size: 138, family: 'XB', color: g,
    t, t0: CUT.hook + 0.3, stagger: 0.09, rise: 0.8, spacing: -2,
  });

  const p = ease.outCubic(clamp((lt - 1.0) / 0.8));
  if (p > 0) {
    ctx.save();
    ctx.globalAlpha = p;
    rule(ctx, 124, 690, 128, 0.9, 2);
    wordSlide(ctx, {
      text: 'Verified drivers. Planned routes. Live corridor updates.',
      x: 124, y: 758, size: 30, family: 'MB', color: 'rgba(226,234,246,0.94)',
      t, t0: CUT.hook + 0.85, stagger: 0.035, dx: -26,
    });
    ctx.restore();
  }

  // exit motion
  const out = ease.inOutCubic(clamp((lt - 3.85) / 0.65));
  if (out > 0) {
    ctx.save();
    ctx.globalAlpha = out * 0.85;
    ctx.fillStyle = 'rgba(3,6,13,1)';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

/* ---------------------------------------------------------------- SCENE 3 */
export function sceneSlogan(ctx, t) {
  const lt = t - CUT.slogan;
  // dark plate with perspective road lines
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#04070E');
  bg.addColorStop(0.55, '#081222');
  bg.addColorStop(1, '#04070E');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  glow(ctx, W * 0.5, H * 0.56, 900, '236,164,74', 0.14 + 0.03 * Math.sin(t * 1.2));

  // perspective lines converging at vanishing point
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const vx = W * 0.5;
  const vy = H * 0.34;
  for (let i = -9; i <= 9; i++) {
    const x = vx + i * 210 + ((lt * 26) % 210);
    const off = Math.abs(i) / 9;
    const a = 0.05 + 0.09 * (1 - off);
    ctx.strokeStyle = `rgba(240,180,76,${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(vx + (x - vx) * 0.1, vy + 40);
    ctx.lineTo(vx + (x - vx) * 3.4, H + 260);
    ctx.stroke();
  }
  for (let j = 1; j < 9; j++) {
    const p = ease.linear((j / 9 + (lt * 0.08) % (1 / 9)) % 1);
    const y = vy + 60 + Math.pow(p, 2.2) * (H - vy);
    ctx.strokeStyle = `rgba(240,180,76,${0.05 + p * 0.06})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  // watermark mark rotating glow
  drawLogoMark(ctx, W / 2 - 300, H / 2 - 330, 600, { glowStrength: 0, alpha: 0.05 });

  eyebrow(ctx, 'THE TANISH STANDARD', W / 2, 350, t, CUT.slogan + 0.08, { align: 'center', size: 14, spacing: 7 });

  wordRise(ctx, {
    text: 'Driven by Trust,', x: W / 2, y: 520, size: 104, family: 'XB', color: C.white,
    t, t0: CUT.slogan + 0.18, stagger: 0.08, rise: 0.72, align: 'center', spacing: -1,
  });
  const g = goldGradient(ctx, W * 0.24, 560, W * 0.76, 670);
  wordRise(ctx, {
    text: 'Powered by Roads.', x: W / 2, y: 650, size: 104, family: 'XB', color: g,
    t, t0: CUT.slogan + 0.42, stagger: 0.08, rise: 0.72, align: 'center', spacing: -1,
  });

  const lp = ease.inOutCubic(clamp((lt - 1.35) / 0.9));
  ctx.save();
  ctx.globalAlpha = lp;
  const w = 420 * lp;
  hairline(ctx, W / 2 - w / 2, 720, w, 0.7);
  ctx.restore();

  const p2 = ease.outCubic(clamp((lt - 1.55) / 0.8));
  if (p2 > 0) {
    ctx.save();
    ctx.globalAlpha = p2 * 0.92;
    ctx.font = '17px SB';
    ctx.fillStyle = 'rgba(226,234,246,0.92)';
    textSpaced(ctx, 'TANISH LOGISTIC  ·  VADODARA, GUJARAT', W / 2, 776, 4.6, 'center');
    ctx.restore();
  }
  sweep(ctx, t, CUT.slogan + 2.2, 1.6, { alpha: 0.12, angle: -0.18 });
}

/* ---------------------------------------------------------------- SCENE 4 */
const STATS = [
  { value: 5, suffix: '+', label: 'Years Moving Freight', sub: 'Commercial track record', icon: 'clock' },
  { value: 100, suffix: '+', label: 'Cities & Hubs', sub: 'Across industrial belts', icon: 'pin' },
  { value: 1000, suffix: '+', label: 'Corporate Clients', sub: 'Manufacturing & trade', icon: 'box' },
  { value: 98.2, suffix: '%', label: 'On-Time Delivery', sub: 'Disciplined road transit', icon: 'shield', decimals: 1 },
];

export async function sceneStats(ctx, t, A) {
  const lt = t - CUT.stats;
  drawCover(ctx, await A.footage('desert', 3.4 + lt), { zoom: 1.16 + 0.04 * ease.linear(clamp(lt / 7)), panX: -30 });
  gradeMedia(ctx, 0, { darkness: 0.54, tint: 'blue' });
  verticalScrim(ctx, 0.55, 0.92);

  eyebrow(ctx, 'PROVEN ON THE HIGHWAY', 122, 236, t, CUT.stats + 0.04, { size: 14 });
  wordRise(ctx, {
    text: 'Numbers that keep their promises.', x: 116, y: 320, size: 62, family: 'XB',
    color: C.white, t, t0: CUT.stats + 0.1, stagger: 0.05, rise: 0.8,
  });

  const cols = 4;
  const left = 122;
  const colW = (W - 244) / cols;
  const baseY = 720;
  for (let i = 0; i < STATS.length; i++) {
    const s = STATS[i];
    const t0 = CUT.stats + 0.26 + i * 0.13;
    const p = ease.outQuint(clamp((t - t0) / 0.8));
    if (p <= 0) continue;
    const x = left + colW * i;
    const yOff = (1 - p) * 46;
    ctx.save();
    ctx.globalAlpha = p;
    const cx = x + colW * 0.5 - 20;

    // separator
    if (i > 0) {
      const sg = ctx.createLinearGradient(0, baseY - 210, 0, baseY + 40);
      sg.addColorStop(0, 'rgba(240,180,76,0)');
      sg.addColorStop(0.35, 'rgba(240,180,76,0.32)');
      sg.addColorStop(1, 'rgba(240,180,76,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(x - 34, baseY - 210, 1.2, 250);
    }

    // icon + hairline
    icon(ctx, s.icon, x + 20, baseY - 236 + yOff, 30, 'rgba(240,180,76,0.95)', 2.2);
    rule(ctx, x, baseY - 214 + yOff, 44, 0.65, 1.6);

    // animated number
    const val = s.value * ease.outExpo(clamp((t - t0) / 1.5));
    counter(ctx, val, {
      x: x - 6, y: baseY - 96 + yOff, size: 114, color: C.white,
      decimals: s.decimals || 0, suffix: s.suffix,
    });
    // suffix in gold
    ctx.font = '114px XB';
    const body = (s.decimals ? val.toFixed(1) : Math.round(val).toString());
    const bodyW = ctx.measureText(body).width;
    ctx.fillStyle = C.gold;
    ctx.fillText(s.suffix, x - 6 + bodyW, baseY - 96 + yOff);

    ctx.font = '25px SB';
    ctx.fillStyle = C.white;
    textSpaced(ctx, s.label, x, baseY - 34 + yOff, 0.4);
    ctx.font = '17px MB';
    ctx.fillStyle = 'rgba(159,176,198,0.95)';
    textSpaced(ctx, s.sub, x, baseY - 2 + yOff, 0.2);
    ctx.restore();
  }

  // footer strip
  const fp = ease.outCubic(clamp((lt - 1.9) / 0.9));
  ctx.save();
  ctx.globalAlpha = fp * 0.75;
  ctx.font = '16px SB';
  ctx.fillStyle = 'rgba(226,234,246,0.7)';
  textSpaced(ctx, 'GPS-TRACKED FLEET  ·  24/7 DISPATCH DESK  ·  VERIFIED DRIVERS', 122, 940, 3.2);
  ctx.restore();
  sweep(ctx, t, CUT.stats + 2.6, 1.8, { alpha: 0.1, angle: -0.12 });
}

/* ---------------------------------------------------------------- SCENE 5 */
const SERVICES = [
  { title: 'Full Truck Load', kicker: 'FTL', desc: 'Dedicated vehicles for bulk manufacturing and heavy industrial loads.', icon: 'truck' },
  { title: 'Industrial Cargo', kicker: 'B2B', desc: 'Scheduled freight for factories, raw material suppliers and trade goods.', icon: 'box' },
  { title: 'Interstate Freight', kicker: 'PAN-INDIA', desc: 'Gujarat and Maharashtra corridors linked to NCR and Punjab.', icon: 'route' },
  { title: 'Contract Logistics', kicker: 'SLA', desc: 'Long-term fleet commitments with predictable lane pricing.', icon: 'warehouse' },
];

export function sceneServices(ctx, t) {
  const lt = t - CUT.services;
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#04070E');
  bg.addColorStop(0.5, '#071120');
  bg.addColorStop(1, '#040811');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // drifting blueprint grid
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = 'rgba(120,152,196,1)';
  ctx.lineWidth = 1;
  const off = (lt * 22) % 96;
  for (let x = -96 + off; x < W + 96; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = -96 + off * 0.5; y < H + 96; y += 96) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
  glow(ctx, W * 0.18, H * 0.12, 760, '236,164,74', 0.12);
  glow(ctx, W * 0.86, H * 0.92, 680, '60,110,255', 0.1);

  eyebrow(ctx, 'WHAT WE MOVE', 122, 200, t, CUT.services + 0.04, { size: 14 });
  wordRise(ctx, {
    text: 'Freight solutions built around your load.', x: 116, y: 286, size: 58, family: 'XB',
    color: C.white, t, t0: CUT.services + 0.1, stagger: 0.045, rise: 0.8,
  });
  ctx.save();
  ctx.globalAlpha = clamp((lt - 0.4) / 0.8) * 0.9;
  ctx.font = '16px SB';
  ctx.fillStyle = 'rgba(159,176,198,0.9)';
  textSpaced(ctx, '04 CORE SOLUTIONS', W - 122, 200, 3.4, 'right');
  ctx.restore();

  const cardW = 396;
  const gap = 24;
  const cardH = 456;
  const x0 = (W - (cardW * 4 + gap * 3)) / 2;
  const y0 = 404;

  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const t0 = CUT.services + 0.34 + i * 0.14;
    const p = ease.outQuint(clamp((t - t0) / 0.85));
    if (p <= 0) continue;
    const x = x0 + i * (cardW + gap);
    const y = y0 + (1 - p) * 64 + Math.sin(lt * 0.9 + i) * 3;
    ctx.save();
    ctx.globalAlpha = p;

    // panel
    const g = ctx.createLinearGradient(x, y, x, y + cardH);
    g.addColorStop(0, 'rgba(255,255,255,0.075)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.032)');
    g.addColorStop(1, 'rgba(255,255,255,0.012)');
    roundRect(ctx, x, y, cardW, cardH, 18);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(240,180,76,0.22)';
    ctx.stroke();

    // top gold edge
    const eg = ctx.createLinearGradient(x, 0, x + cardW, 0);
    eg.addColorStop(0, 'rgba(240,180,76,0)');
    eg.addColorStop(0.5, 'rgba(255,215,140,0.9)');
    eg.addColorStop(1, 'rgba(240,180,76,0)');
    ctx.fillStyle = eg;
    ctx.globalAlpha = p * 0.9;
    ctx.fillRect(x + 24, y, cardW - 48, 1.6);
    ctx.globalAlpha = p;

    // index
    ctx.font = '15px SB';
    ctx.fillStyle = 'rgba(159,176,198,0.75)';
    textSpaced(ctx, String(i + 1).padStart(2, '0'), x + 30, y + 50, 3);

    // icon disc
    ctx.beginPath();
    ctx.arc(x + 58, y + 120, 34, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(240,180,76,0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(240,180,76,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    icon(ctx, s.icon, x + 58, y + 120, 32, C.gold, 2.1);

    // kicker
    ctx.font = '12px XB';
    ctx.fillStyle = 'rgba(240,180,76,0.9)';
    textSpaced(ctx, s.kicker, x + 30, y + 194, 4.2);

    // title
    ctx.font = '37px XB';
    ctx.fillStyle = C.white;
    const titleLines = wrapLines(ctx, s.title, cardW - 60);
    titleLines.forEach((line, li) => ctx.fillText(line, x + 30, y + 250 + li * 44));

    // desc
    ctx.font = '18px RG';
    ctx.fillStyle = 'rgba(178,193,212,0.95)';
    const descLines = wrapLines(ctx, s.desc, cardW - 60);
    descLines.slice(0, 4).forEach((line, li) => ctx.fillText(line, x + 30, y + 334 + li * 28));

    // cta line
    ctx.font = '13px SB';
    ctx.fillStyle = 'rgba(240,180,76,0.85)';
    const label = 'EXPLORE';
    textSpaced(ctx, label, x + 30, y + cardH - 38, 3);
    icon(ctx, 'arrow', x + 30 + ctx.measureText(label).width + 34, y + cardH - 43, 16, 'rgba(240,180,76,0.85)', 2);

    ctx.restore();
  }

  // bottom note
  const np = ease.outCubic(clamp((lt - 2.6) / 0.9));
  ctx.save();
  ctx.globalAlpha = np * 0.85;
  ctx.font = '17px MB';
  ctx.fillStyle = 'rgba(206,218,234,0.85)';
  textSpaced(ctx, 'Vehicle sizing  ·  Route planning  ·  Documentation  ·  Monthly billing', 122, 990, 1.2);
  ctx.restore();
  sweep(ctx, t, CUT.services + 2.2, 1.6, { alpha: 0.09, angle: -0.3 });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------------------------------------------------------------- SCENE 6 */
const CITIES = [
  { name: 'Mandi Gobindgarh', x: 726, y: 300, side: 'right' },
  { name: 'Ludhiana', x: 672, y: 344, side: 'left' },
  { name: 'Delhi NCR', x: 792, y: 402, side: 'right' },
  { name: 'Jaipur', x: 696, y: 470, side: 'left' },
  { name: 'Lucknow', x: 952, y: 468, side: 'right' },
  { name: 'Indore', x: 754, y: 626, side: 'right' },
  { name: 'Nagpur', x: 892, y: 672, side: 'right' },
  { name: 'Kolkata', x: 1132, y: 566, side: 'right' },
  { name: 'Ahmedabad', x: 596, y: 606, side: 'left' },
  { name: 'Mumbai', x: 566, y: 796, side: 'left' },
  { name: 'Hyderabad', x: 884, y: 800, side: 'right' },
  { name: 'Bengaluru', x: 846, y: 882, side: 'left' },
  { name: 'Chennai', x: 962, y: 916, side: 'right' },
];
const HUB = { x: 640, y: 706 };

export function sceneNetwork(ctx, t) {
  const lt = t - CUT.network;
  const bg = ctx.createRadialGradient(HUB.x, HUB.y, 40, HUB.x, HUB.y, 1400);
  bg.addColorStop(0, '#0B1A31');
  bg.addColorStop(0.45, '#061021');
  bg.addColorStop(1, '#03060D');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // dot grid masked to a soft ellipse
  ctx.save();
  const mask = ctx.createRadialGradient(W / 2, H * 0.6, 100, W / 2, H * 0.6, 900);
  mask.addColorStop(0, 'rgba(255,255,255,0.55)');
  mask.addColorStop(1, 'rgba(255,255,255,0)');
  const dots = mkCanvas();
  dotGrid(dots.ctx, 46, 0.5, 'rgba(126,158,196,1)');
  dots.ctx.globalCompositeOperation = 'destination-in';
  dots.ctx.fillStyle = mask;
  dots.ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.42;
  ctx.drawImage(dots.canvas, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(96, -34);
  // concentric rings at hub
  ctx.save();
  for (let r = 0; r < 4; r++) {
    const ph = (lt * 0.35 + r * 0.25) % 1;
    ctx.beginPath();
    ctx.arc(HUB.x, HUB.y, 80 + ph * 340, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(240,180,76,${0.16 * (1 - ph)})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.restore();
  glow(ctx, HUB.x, HUB.y, 340, '240,180,76', 0.22);

  // header
  eyebrow(ctx, 'PAN-INDIA NETWORK', W / 2, 190, t, CUT.network + 0.04, { align: 'center', size: 14, spacing: 6.5 });
  wordRise(ctx, {
    text: '100+ cities. 20 key corridors.', x: W / 2, y: 262, size: 62, family: 'XB',
    color: C.white, t, t0: CUT.network + 0.1, stagger: 0.055, rise: 0.8, align: 'center',
  });

  // routes
  const routes = CITIES.map((c, i) => {
    const t0 = CUT.network + 0.42 + i * 0.1;
    const p = ease.outCubic(clamp((t - t0) / 1.1));
    return { c, p, i, t0 };
  });
  const active = routes.filter((r) => r.p > 0);

  // draw route curves
  for (const r of active) {
    const { c, p } = r;
    const mx = (HUB.x + c.x) / 2 + (c.y - HUB.y) * 0.18;
    const my = (HUB.y + c.y) / 2 - (c.x - HUB.x) * 0.18;
    const steps = 26;
    const upto = Math.max(1, Math.round(steps * p));
    ctx.save();
    ctx.beginPath();
    for (let k = 0; k <= upto; k++) {
      const u = k / steps;
      const px = (1 - u) ** 2 * HUB.x + 2 * (1 - u) * u * mx + u * u * c.x;
      const py = (1 - u) ** 2 * HUB.y + 2 * (1 - u) * u * my + u * u * c.y;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = 'rgba(240,180,76,0.55)';
    ctx.lineWidth = 1.7;
    ctx.stroke();
    // travelling highlight at the drawing tip
    if (p < 0.999) {
      const u = upto / steps;
      const hx = (1 - u) ** 2 * HUB.x + 2 * (1 - u) * u * mx + u * u * c.x;
      const hy = (1 - u) ** 2 * HUB.y + 2 * (1 - u) * u * my + u * u * c.y;
      glow(ctx, hx, hy, 26, '255,220,150', 0.85);
    }
    ctx.restore();
  }

  // hub marker
  const hubP = ease.outBack(clamp((lt - 0.22) / 0.8));
  ctx.save();
  ctx.globalAlpha = clamp(hubP);
  ctx.beginPath();
  ctx.arc(HUB.x, HUB.y, 11 + 2 * Math.sin(lt * 3), 0, Math.PI * 2);
  ctx.fillStyle = C.goldLight;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(HUB.x, HUB.y, 22, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,215,140,0.6)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // hub label
  ctx.font = '15px XB';
  ctx.fillStyle = '#050A14';
  const hubText = 'VADODARA HQ';
  const tw = measureSpaced(ctx, hubText, 2.6);
  const bx = HUB.x - tw / 2 - 16;
  const by = HUB.y + 34;
  roundRect(ctx, bx, by, tw + 32, 34, 17);
  const hg = ctx.createLinearGradient(bx, 0, bx + tw + 32, 0);
  hg.addColorStop(0, '#FFD98A');
  hg.addColorStop(1, '#E8A63C');
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.fillStyle = '#0A1220';
  textSpaced(ctx, hubText, HUB.x, by + 23, 2.6, 'center');
  ctx.restore();

  // city nodes
  for (const r of active) {
    const { c, p } = r;
    ctx.save();
    ctx.globalAlpha = clamp((p - 0.55) / 0.45);
    const s = 1 + (1 - p) * 1.4;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4.2 * s, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,208,0.95)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(c.x, c.y, 11 * s, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240,180,76,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '16px SB';
    ctx.fillStyle = 'rgba(226,234,246,0.9)';
    const right = c.side === 'right';
    textSpaced(ctx, c.name, c.x + (right ? 18 : -18), c.y + 6, 0.3, right ? 'left' : 'right');
    ctx.restore();
  }

  ctx.restore();

  // metric chips
  const lp = ease.outCubic(clamp((lt - 2.3) / 0.9));
  if (lp > 0) {
    const chips = [
      { k: '100+', v: 'CITIES SERVED' },
      { k: '20', v: 'KEY CORRIDORS' },
      { k: '24/7', v: 'DISPATCH DESK' },
    ];
    const cw = 300;
    const gapC = 40;
    let x = W / 2 - (cw * 3 + gapC * 2) / 2;
    ctx.save();
    for (const chip of chips) {
      ctx.globalAlpha = lp * 0.95;
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x, 946, cw, 82, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.035)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(240,180,76,0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      ctx.font = '34px XB';
      ctx.fillStyle = C.goldLight;
      ctx.fillText(chip.k, x + 24, 990);
      ctx.font = '13px SB';
      ctx.fillStyle = 'rgba(178,193,212,0.9)';
      textSpaced(ctx, chip.v, x + 24, 1012, 2.6);
      x += cw + gapC;
    }
    ctx.restore();
  }
  sweep(ctx, t, CUT.network + 3.0, 1.5, { alpha: 0.08, angle: -0.2 });
}

/* ---------------------------------------------------------------- SCENE 7 */
export async function sceneProof(ctx, t, A) {
  const lt = t - CUT.proof;
  const shots = [
    { img: A.photo('Picture10.jpg'), tag: 'ON THE CORRIDOR', note: 'Line-haul in motion', meta: ['AHMEDABAD ↔ DELHI NCR', '950 km  ·  daily dispatches'] },
    { img: A.photo('Picture1.jpg'), tag: 'HEAVY LIFT', note: 'Lowboy capacity for industrial loads', meta: ['VADODARA ↔ MANDI GOBINDGARH', '1,280 km  ·  heavy machinery'] },
    { img: A.photo('Picture4.png'), tag: 'ON THE ROAD', note: 'Company fleet, in service every day', meta: ['DAILY DISPATCHES', 'Pan-India  ·  24/7 support'], square: true },
  ];
  const per = 5 / shots.length;
  const idx = Math.min(shots.length - 1, Math.floor(lt / per));
  const localP = (lt - idx * per) / per;

  for (const pass of [0, 1]) {
    const i = pass === 0 ? idx : idx - 1;
    if (i < 0) continue;
    const shot = shots[i];
    if (!shot) continue;
    const p = pass === 0 ? clamp(localP / 0.16) : 1 - clamp(localP / 0.16);
    if (p <= 0) continue;
    ctx.save();
    ctx.globalAlpha = p;
    const prog = pass === 0 ? localP : 1;
    if (shot.square) {
      // soft blurred plate + framed square inset keeps small art sharp
      ctx.save();
      ctx.filter = 'blur(30px)';
      drawCover(ctx, shot.img, { zoom: 1.5 + 0.05 * prog });
      ctx.restore();
      gradeMedia(ctx, 0, { darkness: 0.6, tint: 'warm' });
      sideScrim(ctx, 'left', 0.9);
      const size = 560;
      const bx = 1180;
      const by = 250 + (1 - prog) * 22;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = 24;
      ctx.fillStyle = '#0A1220';
      ctx.fillRect(bx, by, size, size);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.rect(bx, by, size, size);
      ctx.clip();
      drawCover(ctx, shot.img, { x: bx, y: by, w: size, h: size, zoom: 1.04 + 0.04 * prog });
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = 'rgba(240,180,76,0.55)';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(bx + 0.5, by + 0.5, size - 1, size - 1);
      ctx.restore();
      bracketFrame(ctx, bx - 14, by - 14, size + 28, size + 28, 34, 0.8);
    } else {
      const zoom = 1.05 + 0.08 * prog;
      drawCover(ctx, shot.img, { zoom, panX: prog * -30 });
      gradeMedia(ctx, 0, { darkness: 0.32, tint: 'warm' });
      sideScrim(ctx, 'left', 0.86);
      verticalScrim(ctx, 0.28, 0.9);
    }
    ctx.restore();
  }

  const shot = shots[idx];
  eyebrow(ctx, 'REAL OPERATIONS', 122, 430, t, CUT.proof + 0.04, { size: 14, spacing: 6 });
  wordRise(ctx, {
    text: 'Real fleet. Real people.', x: 116, y: 540, size: 82, family: 'XB', color: C.white,
    t, t0: CUT.proof + 0.08, stagger: 0.065, rise: 0.78,
  });
  wordRise(ctx, {
    text: 'Real accountability.', x: 116, y: 636, size: 82, family: 'XB',
    color: goldGradient(ctx, 116, 580, 1000, 660),
    t, t0: CUT.proof + 0.24, stagger: 0.065, rise: 0.78,
  });

  const cp = ease.outCubic(clamp((lt - 0.45) / 0.8)) * clamp(localP / 0.18);
  if (cp > 0) {
    ctx.save();
    ctx.globalAlpha = cp * 0.9;
    ctx.font = '19px MB';
    ctx.fillStyle = 'rgba(206,218,234,0.9)';
    textSpaced(ctx, shot.note, 122, 700, 0.6);
    ctx.restore();
  }

  // corridor meta lockup under the caption
  const bp = ease.outCubic(clamp((lt - 0.3) / 0.8)) * (idx === 0 ? 1 : clamp(localP / 0.22));
  ctx.save();
  ctx.globalAlpha = bp;
  rule(ctx, 122, 736, 64, 0.75, 2);
  ctx.font = '12px XB';
  ctx.fillStyle = 'rgba(240,180,76,0.95)';
  textSpaced(ctx, shot.tag, 122, 772, 4.4);
  ctx.font = '17px SB';
  ctx.fillStyle = 'rgba(240,246,255,0.96)';
  textSpaced(ctx, shot.meta[0], 122, 806, 1.2);
  ctx.font = '15px MB';
  ctx.fillStyle = 'rgba(196,210,228,0.85)';
  textSpaced(ctx, shot.meta[1], 122, 832, 0.8);
  ctx.restore();

  // progress dots
  ctx.save();
  ctx.globalAlpha = 0.9;
  for (let i = 0; i < shots.length; i++) {
    const x = 124 + i * 26;
    ctx.beginPath();
    ctx.arc(x, 936, 4, 0, Math.PI * 2);
    ctx.fillStyle = i === idx ? C.gold : 'rgba(226,234,246,0.28)';
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------------------------------------------------------- SCENE 8 */
export function sceneCTA(ctx, t) {
  const lt = t - CUT.cta;
  const bg = ctx.createRadialGradient(W / 2, H * 0.42, 60, W / 2, H * 0.42, 1200);
  bg.addColorStop(0, '#0C1A2E');
  bg.addColorStop(0.6, '#050B16');
  bg.addColorStop(1, '#03050B');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  glow(ctx, W / 2, H * 0.36, 780, '236,164,74', 0.16);

  // faint route lines
  ctx.save();
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 7; i++) {
    const y = 620 + i * 62;
    ctx.beginPath();
    ctx.moveTo(-40, y);
    ctx.bezierCurveTo(W * 0.35, y - 60, W * 0.62, y + 50, W + 40, y - 20);
    ctx.strokeStyle = 'rgba(126,158,196,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  const logoP = ease.outBack(clamp((lt - 0.02) / 0.9));
  ctx.save();
  ctx.globalAlpha = clamp(logoP);
  const ls = 132 * (0.92 + 0.08 * logoP);
  drawLogoMark(ctx, W / 2 - ls / 2, 168 - (1 - logoP) * 16, ls, { glowStrength: 30 });
  ctx.restore();
  sweep(ctx, t, CUT.cta + 0.5, 1.5, { y: 120, h: 320, alpha: 0.22, angle: -0.1 });

  const nameP = ease.outCubic(clamp((lt - 0.3) / 0.9));
  if (nameP > 0) {
    ctx.save();
    ctx.globalAlpha = nameP;
    ctx.font = '52px XB';
    ctx.fillStyle = C.white;
    textSpaced(ctx, 'TANISH LOGISTIC', W / 2, 392, 12, 'center');
    ctx.font = '15px SB';
    ctx.fillStyle = 'rgba(240,180,76,0.9)';
    textSpaced(ctx, 'DRIVEN BY TRUST, POWERED BY ROADS', W / 2, 428, 5.4, 'center');
    ctx.restore();
  }

  wordRise(ctx, {
    text: 'Let’s move your freight.', x: W / 2, y: 552, size: 68, family: 'XB',
    color: C.goldLight, t, t0: CUT.cta + 0.6, stagger: 0.07, rise: 0.8, align: 'center',
  });

  // contact row
  const cp = ease.outCubic(clamp((lt - 1.35) / 0.9));
  if (cp > 0) {
    ctx.save();
    ctx.globalAlpha = cp;
    const items = [
      { icon: 'phone', text: '+91 99242 04744' },
      { icon: 'mail', text: 'tanishlogistic744@gmail.com' },
      { icon: 'globe', text: 'tanishlogistic.com' },
    ];
    ctx.font = '22px SB';
    const widths = items.map((it) => 34 + ctx.measureText(it.text).width);
    const gap = 56;
    const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = W / 2 - total / 2;
    for (const [i, it] of items.entries()) {
      icon(ctx, it.icon, x + 11, 654, 21, C.gold, 1.9);
      ctx.fillStyle = 'rgba(232,240,250,0.95)';
      ctx.font = '22px SB';
      ctx.fillText(it.text, x + 34, 662);
      x += widths[i] + gap;
    }
    ctx.restore();
  }

  // CTA pill
  const pillP = ease.outQuint(clamp((lt - 1.95) / 0.8));
  if (pillP > 0) {
    ctx.save();
    ctx.globalAlpha = clamp(pillP * 1.4);
    const w = 420;
    const h = 72;
    const x = W / 2 - (w * pillP) / 2;
    const y = 740;
    roundRect(ctx, x, y, w * pillP, h, h / 2);
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, '#FFD98A');
    g.addColorStop(0.55, '#F0B44C');
    g.addColorStop(1, '#DD9A32');
    ctx.fillStyle = g;
    ctx.fill();
    if (pillP > 0.9) {
      ctx.font = '19px XB';
      ctx.fillStyle = '#081020';
      textSpaced(ctx, 'BOOK YOUR LOAD ONLINE', W / 2 - 12, y + 45, 3.2, 'center');
      icon(ctx, 'arrow', W / 2 + 172, y + 36, 20, '#081020', 2.4);
    }
    ctx.restore();
  }

  const ap = ease.outCubic(clamp((lt - 2.7) / 0.9));
  if (ap > 0) {
    ctx.save();
    ctx.globalAlpha = ap * 0.8;
    ctx.font = '16px MB';
    ctx.fillStyle = 'rgba(178,193,212,0.95)';
    textSpaced(ctx, 'Shop 04, Udandeep Complex, Tarsali, Vadodara 390009, Gujarat', W / 2, 862, 0.6, 'center');
    ctx.restore();
  }

  // trust strip
  const tp = ease.outCubic(clamp((lt - 3.05) / 0.9));
  if (tp > 0) {
    ctx.save();
    ctx.globalAlpha = tp;
    hairline(ctx, W / 2 - 460, 928, 920, 0.4);
    const items = ['GST-compliant billing', 'Insured cargo handling', '24/7 dispatch desk'];
    ctx.font = '17px SB';
    const widths = items.map((t2) => measureSpaced(ctx, t2, 1.6));
    const gapT = 74;
    let x = W / 2 - (widths.reduce((a, b) => a + b, 0) + gapT * (items.length - 1)) / 2;
    for (const [i, it] of items.entries()) {
      icon(ctx, 'check', x + 9, 971, 17, 'rgba(240,180,76,0.9)', 2.1);
      ctx.fillStyle = 'rgba(206,218,234,0.92)';
      textSpaced(ctx, it, x + 26, 977, 1.6);
      x += widths[i] + gapT;
    }
    ctx.globalAlpha = tp * 0.55;
    ctx.font = '13px MB';
    ctx.fillStyle = 'rgba(150,168,190,1)';
    textSpaced(ctx, '© 2025 TANISH LOGISTIC  ·  ALL RIGHTS RESERVED', W / 2, 1032, 2.8, 'center');
    ctx.restore();
  }

  // fade to black at the very end
  const out = ease.inOutCubic(clamp((lt - 4.35) / 0.6));
  if (out > 0) {
    ctx.save();
    ctx.globalAlpha = out;
    ctx.fillStyle = '#03050B';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}
