import sharp from 'sharp';

const MAX_INPUT_PIXELS = 16_000_000;
const FORMATS = new Map([
  ['.png', 'png'], ['.jpg', 'jpeg'], ['.jpeg', 'jpeg'],
  ['.gif', 'gif'], ['.webp', 'webp'],
]);

function signatureFormat(bytes) {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'))) return 'gif';
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

// Never publish the uploaded bytes directly. Verify the signature AND decoded
// format, cap input dimensions, then re-encode a single frame as PNG without
// metadata or embedded active content. SVG, PDF and mismatched files are denied.
export async function normalizeLogo(bytes, extension) {
  const declaredFormat = FORMATS.get(extension.toLowerCase());
  if (!declaredFormat || !Buffer.isBuffer(bytes) || signatureFormat(bytes) !== declaredFormat) return null;
  try {
    const input = sharp(bytes, { failOn: 'error', limitInputPixels: MAX_INPUT_PIXELS, animated: false });
    const metadata = await input.metadata();
    if (metadata.format !== declaredFormat || !metadata.width || !metadata.height ||
        metadata.width * metadata.height > MAX_INPUT_PIXELS) return null;
    const output = await input.rotate().resize({
      width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true,
    }).png().toBuffer();
    return output.length <= 5 * 1024 * 1024 ? output : null;
  } catch {
    return null;
  }
}
