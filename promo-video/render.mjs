// Frame renderer: draws every scene into a canvas and streams PNG frames to FFmpeg.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { loadImage } from '@napi-rs/canvas';
import { W, H, FPS, DURATION, ROOT, REPO, C, mkCanvas, ease, clamp, inv, grain, glow } from './src/design.js';
import { CUT, sceneOpen, sceneHook, sceneSlogan, sceneStats, sceneServices, sceneNetwork, sceneProof, sceneCTA } from './src/scenes.js';
import { prepare, FOOTAGE_DIR } from './prepare.mjs';

const FFMPEG = path.join(ROOT, 'node_modules/@ffmpeg-installer/linux-x64/ffmpeg');

/* ---------------------------------------------------------------- footage */
class Footage {
  constructor(dir) {
    this.dir = dir;
    this.counts = {};
    this.cache = new Map();
    this.limit = 14;
  }
  count(clip) {
    if (this.counts[clip] == null) {
      this.counts[clip] = fs.readdirSync(path.join(this.dir, clip)).filter((f) => f.endsWith('.jpg')).length;
    }
    return this.counts[clip];
  }
  async get(clip, seconds) {
    const idx = clamp(Math.round(seconds * FPS) + 1, 1, this.count(clip));
    const key = `${clip}:${idx}`;
    if (this.cache.has(key)) {
      const img = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, img);
      return img;
    }
    const img = await loadImage(path.join(this.dir, clip, String(idx).padStart(4, '0') + '.jpg'));
    this.cache.set(key, img);
    while (this.cache.size > this.limit) this.cache.delete(this.cache.keys().next().value);
    return img;
  }
}

let assets;
export async function getAssets() {
  if (assets) return assets;
  await prepare();
  const footage = new Footage(FOOTAGE_DIR);
  const photos = new Map();
  for (const name of ['Picture10.jpg', 'Picture1.jpg', 'Picture4.png', 'Picture6.jpg', 'Picture3.png', 'Picture8.jpg']) {
    const p = path.join(REPO, 'public/gallery', name);
    if (fs.existsSync(p)) photos.set(name, await loadImage(p));
  }
  assets = {
    footage: (clip, sec) => footage.get(clip, sec),
    photo: (name) => photos.get(name),
  };
  return assets;
}

/* ---------------------------------------------------------------- overlays */
function flash(ctx, t, at, dur = 0.2, color = '255,226,170') {
  const p = inv(at - dur * 0.25, at + dur * 0.75, t);
  if (p <= 0 || p >= 1) return;
  const a = Math.sin(p * Math.PI) ** 2 * 0.16;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, `rgba(${color},${a * 0.5})`);
  g.addColorStop(0.5, `rgba(${color},${a})`);
  g.addColorStop(1, `rgba(${color},${a * 0.35})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function finish(ctx, frame, { grainAmt = 0.3 } = {}) {
  grain(ctx, frame, grainAmt);
}

/* ---------------------------------------------------------------- main */
const SCENES = [
  [CUT.open, CUT.hook, sceneOpen],
  [CUT.hook, CUT.slogan, sceneHook],
  [CUT.slogan, CUT.stats, sceneSlogan],
  [CUT.stats, CUT.services, sceneStats],
  [CUT.services, CUT.network, sceneServices],
  [CUT.network, CUT.proof, sceneNetwork],
  [CUT.proof, CUT.cta, sceneProof],
  [CUT.cta, CUT.end + 0.001, sceneCTA],
];

export async function drawFrame(ctx, t, frame, A) {
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);
  const entry = SCENES.find(([a, b]) => t >= a && t < b) || SCENES[SCENES.length - 1];
  await entry[2](ctx, t, A);
  flash(ctx, t, CUT.stats + 0.02, 0.22);
  flash(ctx, t, CUT.network + 0.02, 0.2, '210,230,255');
  flash(ctx, t, CUT.services + 0.02, 0.18, '255,236,200');
  const graphicScene = (t >= CUT.slogan && t < CUT.stats) || (t >= CUT.services && t < CUT.proof) || t >= CUT.cta;
  finish(ctx, frame, { grainAmt: graphicScene ? 0.22 : 0.3 });
  ctx.restore();
}

function runFfmpeg(outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const args = [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', String(FPS),
    outPath,
  ];
  const proc = spawn(FFMPEG, args, { stdio: ['pipe', 'pipe', 'pipe'] });
  let err = '';
  proc.stderr.on('data', (d) => (err += d));
  const done = new Promise((res, rej) =>
    proc.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg failed ${code}\n${err.slice(-1500)}`)))),
  );
  return { proc, done };
}

async function main() {
  const argv = process.argv.slice(2);
  const get = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const A = await getAssets();
  const { canvas, ctx } = mkCanvas();

  if (argv.includes('--stills')) {
    const times = (get('--stills') || '').split(',').filter(Boolean).map(Number);
    const dir = path.resolve(ROOT, get('--dir') || 'out/stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of times) {
      const frame = Math.round(t * FPS);
      await drawFrame(ctx, t, frame, A);
      const file = path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`);
      await fsp.writeFile(file, canvas.toBuffer('image/png'));
      console.log('wrote', file);
    }
    return;
  }

  const outPath = path.resolve(ROOT, get('--out') || 'out/tanish-logistic-promo-silent.mp4');
  const from = Number(get('--from') || 0);
  const to = Number(get('--to') || DURATION);
  const startFrame = Math.round(from * FPS);
  const endFrame = Math.round(to * FPS);
  const total = endFrame - startFrame;
  const { proc, done } = runFfmpeg(outPath);
  const t0 = Date.now();

  for (let f = startFrame; f < endFrame; f++) {
    const t = f / FPS;
    await drawFrame(ctx, t, f, A);
    const buf = canvas.toBuffer('image/jpeg', 95);
    if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
    if (f % 30 === 0 || f === endFrame - 1) {
      const doneN = f - startFrame + 1;
      const el = (Date.now() - t0) / 1000;
      const eta = (el / doneN) * (total - doneN);
      process.stdout.write(`\rframe ${doneN}/${total}  ${(doneN / el).toFixed(1)} fps  eta ${eta.toFixed(0)}s   `);
    }
  }
  proc.stdin.end();
  await done;
  console.log(`\nrendered ${outPath} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

if (process.argv[1] && process.argv[1].endsWith('render.mjs')) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
