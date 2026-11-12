#!/usr/bin/env bash
# Final mux: music bed ducked under the voiceover, loudness normalised, video stream copied.
set -euo pipefail
cd "$(dirname "$0")"

FFMPEG="${FFMPEG:-node_modules/@ffmpeg-installer/linux-x64/ffmpeg}"
SILENT="${1:-out/tanish-logistic-promo-silent.mp4}"
OUT="${2:-out/tanish-logistic-promo.mp4}"

"$FFMPEG" -hide_banner -loglevel error -y \
  -i "$SILENT" -i out/music.wav -i out/vo-body.mp3 -i out/vo-close.mp3 \
  -filter_complex "\
[2:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,adelay=4200|4200[body];\
[3:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,adelay=40150|40150[close];\
[body][close]amix=inputs=2:duration=longest:dropout_transition=0,apad,volume=1.7,highpass=f=80,asplit=2[vo1][vo2];\
[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=0.95[mus];\
[mus][vo1]sidechaincompress=threshold=0.06:ratio=6:attack=25:release=420,aformat=sample_fmts=fltp:channel_layouts=stereo[duck];\
[duck][vo2]amix=inputs=2:duration=longest:dropout_transition=0,volume=2.0,loudnorm=I=-15:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t 45 "$OUT"

echo "wrote $OUT"
