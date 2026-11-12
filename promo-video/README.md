# Tanish Logistic — Brand Film (45s)

A 1920×1080 / 30 fps promotional film for Tanish Logistic, built entirely from assets that
already live in this repository plus code. Everything is reproducible: frames are drawn with
Canvas, the score is synthesised sample-by-sample, and FFmpeg does the encoding.

**Output**

| File | Purpose | Size |
| --- | --- | --- |
| `out/tanish-logistic-promo.mp4` | Full-quality master (H.264 CRF 17, AAC 192 kbps) | ~30 MB |
| `../public/promo/tanish-logistic-promo.mp4` | Web version for the site / WhatsApp / Instagram | ~7 MB |
| `../public/promo/tanish-logistic-promo-poster.jpg` | Poster frame for `<video poster>` | 110 KB |

## Story beats

| Time | Scene | On screen |
| --- | --- | --- |
| 0:00–0:05 | Cold open | Mountain-highway footage, logo lockup, "Moving India's business forward" |
| 0:05–0:09.5 | Operating standard | "Your cargo. Our discipline." + verified drivers / planned routes / live updates |
| 0:09.5–0:13.5 | Brand line | "Driven by Trust, Powered by Roads." |
| 0:13.5–0:20.5 | Proof in numbers | 5+ years · 100+ cities · 1000+ clients · 98.2% on-time |
| 0:20.5–0:28.5 | Services | FTL, industrial cargo, interstate freight, contract logistics |
| 0:28.5–0:35 | Network | Vadodara HQ hub-and-spoke map, 13 city nodes, 100+ cites / 20 corridors |
| 0:35–0:40 | Real operations | Company gallery photography with corridor call-outs |
| 0:40–0:45 | Call to action | Logo, "Let's move your freight.", phone, email, website, booking CTA |

## Why this stack

The planned tool was [HyperFrames](https://github.com/heygen-com/hyperframes) (a starred repo:
"write HTML, render video"), and it installs fine here (`npx hyperframes init`). Local rendering
needs Chrome Headless Shell + FFmpeg. This sandbox has neither and cannot reach the Chrome
download CDN or Debian mirrors, and a Chromium unpacked from npm still needs `libnss3` /
`libnspr4`, which are absent. So the film is rendered with the same model — deterministic,
seekable, code-authored frames piped into FFmpeg — using `@napi-rs/canvas` (Skia) for drawing,
`@ffmpeg-installer/ffmpeg` for encoding and Node for the soundtrack. On a normal machine with
Chrome + FFmpeg you can port the scenes to HyperFrames unchanged.

Nothing is downloaded at build time: fonts (Barlow, Barlow Condensed) are vendored in `fonts/`,
media comes from `../public/hero-videos` and `../public/gallery`.

## Rebuild

```bash
cd promo-video
npm install
node prepare.mjs                       # 1080p/30fps JPEG frames from the hero footage -> /tmp/tl-footage
node render.mjs --stills 2.5,17.5,31.5  # optional: review key frames -> out/stills
node render.mjs --out out/tanish-logistic-promo-silent.mp4
node audio.mjs                         # synthesise out/music.wav
# voiceover: out/vo-body.mp3 + out/vo-close.mp3 (28.1 s and 4.3 s), mixed at 4.2 s and 40.15 s
./mix.sh                               # final mux: ducked music + VO + loudness normalisation
```

Useful flags on `render.mjs`: `--stills 2.5,7.2` (PNG stills), `--dir`, `--from`, `--to`, `--out`.

Rendering takes ~3.5 min on 2 vCPUs at 1080p (≈6.5 fps).

## Project map

```
promo-video/
├── prepare.mjs        # FFmpeg frame extraction + grade from public/hero-videos
├── render.mjs         # timeline, scene dispatch, transitions, FFmpeg pipe
├── audio.mjs          # score synthesis (drone, pads, pulses, risers, whooshes, reverb)
├── mix.sh             # music + voiceover mix and encode
├── fonts/             # Barlow / Barlow Condensed (OFL)
└── src/
    ├── design.js      # palette, type helpers, grading, grain, logo mark, icon set
    └── scenes.js      # the eight scenes
```

## Notes for future edits

- The logo mark is re-drawn from the path data in `public/logo.svg`, so brand changes there
  should be mirrored in `src/design.js` (`LOGO_PATHS`).
- Copy, stats, services and city lists mirror `pages/index.jsx`, `pages/about.jsx` and
  `data/settings.json`; keep them in sync with the site.
- The voiceover is a temp scratch track recorded for this cut — replace `out/vo-*.mp3` with the
  final studio read (same filenames/lengths) and re-run `mix.sh` without re-rendering.
