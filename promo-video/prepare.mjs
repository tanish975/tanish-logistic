// Extracts 1920x1080 / 30fps JPEG frames from the site's hero footage.
// Frames land in /tmp so nothing heavy is committed to the repo.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT, REPO, FPS, W, H } from './src/design.js';

const FFMPEG = path.join(ROOT, 'node_modules/@ffmpeg-installer/linux-x64/ffmpeg');
export const FOOTAGE_DIR = '/tmp/tl-footage';

export const CLIPS = {
  highway: 'public/hero-videos/mixkit-cars-and-trucks-crossing-on-a-highway-in-nature-44284-full-hd.mp4',
  mountain: 'public/hero-videos/mixkit-52428-video-52428-full-hd.mp4',
  desert: 'public/hero-videos/mixkit-various-vehicles-traverse-the-asphalt-highway-beside-the-breathtaking-desert-52014-full-hd.mp4',
  truck: 'public/hero-videos/mixkit-large-truck-driving-along-a-rural-highway-45488-hd-ready.mp4',
};

export function ffmpeg(args, { input } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve(err) : reject(new Error(`ffmpeg ${code}: ${err.slice(-1200)}`))));
    if (input) {
      input(p.stdin);
    } else p.stdin.end();
  });
}

export async function prepare({ quiet = true } = {}) {
  await fs.mkdir(FOOTAGE_DIR, { recursive: true });
  for (const [id, rel] of Object.entries(CLIPS)) {
    const dir = path.join(FOOTAGE_DIR, id);
    const src = path.join(REPO, rel);
    const probe = await fs.readdir(dir).catch(() => []);
    if (probe.length > 30) continue;
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
    const vf = [
      `scale=${W}:${H}:force_original_aspect_ratio=increase`,
      `crop=${W}:${H}`,
      `fps=${FPS}`,
      'eq=saturation=0.92:contrast=1.06:brightness=-0.015',
      'unsharp=5:5:0.55:5:5:0.0',
    ].join(',');
    await ffmpeg([
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', src,
      '-vf', vf,
      '-q:v', '2',
      path.join(dir, '%04d.jpg'),
    ]);
    if (!quiet) console.log('extracted', id);
  }
  return FOOTAGE_DIR;
}

if (process.argv[1] && process.argv[1].endsWith('prepare.mjs')) {
  await prepare({ quiet: false });
  console.log('footage ready at', FOOTAGE_DIR);
}
