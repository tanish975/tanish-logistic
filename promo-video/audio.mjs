// Synthesises the underscore for the brand film: drone, pad, sub-pulses,
// risers and transition whooshes — all deterministic, no external samples.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DURATION, rand } from './src/design.js';
import { CUT } from './src/scenes.js';

const SR = 48000;
const N = Math.ceil(SR * DURATION);
const rnd = rand(20251112);

const L = new Float32Array(N);
const R = new Float32Array(N);

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const env = (t, a, d, s, r, dur) => {
  if (t < 0 || t > dur) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
  if (t < dur - r) return s;
  return s * clamp01((dur - t) / r);
};

function pan(x, p) {
  const a = (p + 1) / 2;
  return [x * Math.cos((a * Math.PI) / 2), x * Math.sin((a * Math.PI) / 2)];
}

function write(i, l, r, gain = 1) {
  if (i < 0 || i >= N) return;
  if (!Number.isFinite(l) || !Number.isFinite(r)) return;
  L[i] += l * gain;
  R[i] += r * gain;
}

/* ------------------------------------------------------------------ voices */

function tone({ start, dur, freq, amp = 0.1, pan: p = 0, attack = 0.02, decay = 0.2, sustain = 0.7, release = 0.3, harmonics = [1], detune = 0 }) {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const e = env(t, attack, decay, sustain, release, dur);
    let v = 0;
    for (let h = 0; h < harmonics.length; h++) {
      const f = freq * (h + 1) * (1 + detune * (h ? 1 : 0));
      const ph = 2 * Math.PI * f * t;
      v += Math.sin(ph) * harmonics[h] / (h + 1) ** 0.35;
    }
    const [l, r] = pan(v * e * amp, p);
    write(s0 + k, l, r);
  }
}

function noiseSweep({ start, dur, from = 200, to = 6000, amp = 0.05, q = 1.2, p = 0, attack = 0.4, shape = 'rise' }) {
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  let low = 0;
  let band = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const u = t / dur;
    const f = Math.min(7200, from * (to / from) ** (shape === 'rise' ? u : 1 - u));
    const g = Math.tan((Math.PI * f) / SR);
    const damp = 1 / q;
    const x = rnd() * 2 - 1;
    // topology-preserving state-variable filter (stable at any cutoff)
    const hp = (x - (2 * damp + g) * band - low) / (1 + 2 * damp * g + g * g);
    band = g * hp + band;
    low = g * band + low;
    const e = Math.sin(Math.PI * clamp01(u)) ** 1.4 * clamp01((attack > 0 ? t / (attack * 0.6) : 1));
    const [l, r] = pan(band * e * amp, p);
    write(s0 + k, l, r);
  }
}

function impact({ start, amp = 0.3, p = 0 }) {
  const dur = 1.5;
  const s0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const e = Math.exp(-t * 3.6);
    const f = 92 * Math.exp(-t * 4) + 42;
    const v = Math.sin(2 * Math.PI * f * t) * e * 0.9 + (rnd() * 2 - 1) * Math.exp(-t * 22) * 0.25;
    const [l, r] = pan(v * amp, p);
    write(s0 + k, l, r);
  }
}

function pluck({ start, freq, amp = 0.05, p = 0.1, dur = 1.2 }) {
  tone({ start, dur, freq, amp, pan: p, attack: 0.004, decay: 0.18, sustain: 0.12, release: 0.55, harmonics: [1, 0.42, 0.18, 0.09] });
}

/* ------------------------------------------------------------------ harmony */

const CHORDS = [
  { at: 0.0, end: 13.5, root: 55.0, notes: [110.0, 130.81, 164.81, 220.0] },      // Am
  { at: 13.5, end: 20.5, root: 43.65, notes: [87.31, 110.0, 130.81, 174.61] },    // F
  { at: 20.5, end: 28.5, root: 65.41, notes: [130.81, 164.81, 196.0, 261.63] },   // C
  { at: 28.5, end: 35.0, root: 49.0, notes: [98.0, 123.47, 146.83, 196.0] },      // G
  { at: 35.0, end: 45.0, root: 55.0, notes: [110.0, 130.81, 164.81, 246.94] },    // Am add9
];

// sustained drone (always on, breathing)
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const breathe = 0.72 + 0.28 * Math.sin((2 * Math.PI * t) / 11 + 0.6);
  const fade = clamp01(t / 3.2) * clamp01((DURATION - t) / 2.4);
  const v = (Math.sin(2 * Math.PI * 55 * t) * 0.5 + Math.sin(2 * Math.PI * 110.3 * t) * 0.16 + Math.sin(2 * Math.PI * 82.4 * t) * 0.1) * 0.055 * breathe * fade;
  const [l, r] = pan(v, 0.05 * Math.sin(t * 0.3));
  write(i, l, r);
}

// pads, one chord per section, with slow swell and detune spread
for (const ch of CHORDS) {
  const dur = ch.end - ch.at + 0.9;
  for (const [idx, f] of ch.notes.entries()) {
    tone({
      start: ch.at + 0.05 * idx, dur, freq: f,
      amp: 0.026, pan: idx % 2 ? 0.35 : -0.35,
      attack: 1.1, decay: 1.2, sustain: 0.68, release: 1.0,
      harmonics: [1, 0.34, 0.16, 0.07], detune: 0.0016,
    });
  }
}

// sub pulse / heartbeat, enters with the stats block and carries the film
for (let beat = CUT.stats; beat < DURATION - 1.2; beat += 0.75) {
  const chord = CHORDS.find((c) => beat >= c.at && beat < c.end) || CHORDS[CHORDS.length - 1];
  const strong = Math.abs((beat % 3) - 0) < 0.01;
  tone({
    start: beat, dur: 0.42, freq: chord.root, amp: strong ? 0.1 : 0.062,
    attack: 0.004, decay: 0.16, sustain: 0.25, release: 0.22, harmonics: [1, 0.18],
  });
}

// sparse metallic plucks for forward motion
const PLUCK_SCALE = [440, 523.25, 659.25, 587.33, 493.88, 392.0];
for (let k = 0, t = CUT.slogan + 1.2; t < CUT.cta; k++, t += 1.5) {
  if (k % 3 === 2) continue;
  pluck({ start: t, freq: PLUCK_SCALE[k % PLUCK_SCALE.length] / (k % 4 === 0 ? 2 : 1), amp: 0.028, p: (k % 2 ? 0.42 : -0.42) });
}

// transition whooshes + impacts on the big cuts
const CUTS = [
  { at: CUT.hook, amp: 0.16 },
  { at: CUT.slogan, amp: 0.12 },
  { at: CUT.stats, amp: 0.24, hit: 0.26 },
  { at: CUT.services, amp: 0.16, hit: 0.2 },
  { at: CUT.network, amp: 0.18, hit: 0.22 },
  { at: CUT.proof, amp: 0.14 },
  { at: CUT.cta, amp: 0.24, hit: 0.3 },
];
for (const c of CUTS) {
  noiseSweep({ start: c.at - 0.55, dur: 0.9, from: 320, to: 7200, amp: c.amp, q: 1.1, p: 0 });
  noiseSweep({ start: c.at - 0.4, dur: 0.7, from: 9000, to: 500, amp: c.amp * 0.45, q: 1.4, p: 0.4 });
  if (c.hit) impact({ start: c.at, amp: c.hit });
}

// long riser into the call to action
noiseSweep({ start: CUT.cta - 3.4, dur: 3.5, from: 180, to: 9600, amp: 0.075, q: 0.9, attack: 2.6 });
tone({ start: CUT.cta - 3.2, dur: 3.3, freq: 55, amp: 0.05, attack: 3.0, decay: 0.2, sustain: 1, release: 0.2, harmonics: [1, 0.5, 0.25] });
tone({ start: CUT.cta - 3.2, dur: 3.3, freq: 110, amp: 0.03, attack: 3.0, decay: 0.2, sustain: 1, release: 0.2, harmonics: [1, 0.4] });

// final resolve: soft wide chord + tail
for (const [i, f] of [220, 261.63, 329.63, 493.88].entries()) {
  tone({ start: CUT.cta + 0.1, dur: 4.6, freq: f, amp: 0.032, pan: i % 2 ? 0.4 : -0.4, attack: 0.5, decay: 1.0, sustain: 0.6, release: 2.0, harmonics: [1, 0.3, 0.12], detune: 0.0012 });
}

/* ------------------------------------------------------------------ reverb */

function reverb(input, seedDelays, wet = 0.32) {
  const out = new Float32Array(N);
  const combs = seedDelays.map((d) => ({ buf: new Float32Array(Math.floor(d * SR)), idx: 0, lp: 0 }));
  for (let i = 0; i < N; i++) {
    let acc = 0;
    for (const c of combs) {
      const y = c.buf[c.idx];
      c.lp = y * 0.72 + c.lp * 0.28;
      c.buf[c.idx] = input[i] * 0.22 + c.lp * 0.78;
      c.idx = (c.idx + 1) % c.buf.length;
      acc += y;
    }
    out[i] = acc / combs.length;
  }
  return { out, wet };
}

const verbL = reverb(L, [0.0297, 0.0371, 0.0411, 0.0437], 0.3);
const verbR = reverb(R, [0.0313, 0.0397, 0.0427, 0.0451], 0.3);

/* ------------------------------------------------------------------ master */

let peak = 1e-9;
const mix = new Float32Array(N * 2);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  // gentle high-shelf tilt so the bed does not fight dialogue
  const l = L[i] * 0.82 + verbL.out[i] * verbL.wet;
  const r = R[i] * 0.82 + verbR.out[i] * verbR.wet;
  const fade = clamp01((DURATION - t) / 1.1);
  mix[i * 2] = l * fade;
  mix[i * 2 + 1] = r * fade;
  if (!Number.isFinite(mix[i * 2]) || !Number.isFinite(mix[i * 2 + 1])) throw new Error('non-finite sample at ' + t);
  peak = Math.max(peak, Math.abs(mix[i * 2]), Math.abs(mix[i * 2 + 1]));
}

const target = 0.62;
const g = target / peak;
const pcm = Buffer.alloc(44 + N * 4);
pcm.write('RIFF', 0);
pcm.writeUInt32LE(36 + N * 4, 4);
pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32);
pcm.writeUInt16LE(16, 34);
pcm.write('data', 36);
pcm.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N * 2; i++) {
  const v = Math.max(-1, Math.min(1, mix[i] * g));
  pcm.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
}

const out = path.join(ROOT, 'out/music.wav');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, pcm);
console.log('wrote', out, `${(pcm.length / 1024 / 1024).toFixed(1)} MB`, `peak-gain ${g.toFixed(2)}`);
