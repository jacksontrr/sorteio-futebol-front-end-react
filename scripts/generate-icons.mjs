import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = resolve(__dirname, '../public');
const inputSvg = resolve(publicDir, 'trophy.svg');

const sizes = [180, 192, 512];

async function ensureFileExists(path) {
  try {
    await fs.promises.access(path, fs.constants.R_OK);
  } catch {
    throw new Error(`Input SVG not found: ${path}`);
  }
}

async function generate(size) {
  const out = resolve(publicDir, `trophy-${size}.png`);
  // Use higher density to improve rasterization quality from SVG
  await sharp(inputSvg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`Generated: ${out}`);
}

(async () => {
  console.log('[icons] Generating PNGs from trophy.svg ...');
  await ensureFileExists(inputSvg);
  for (const s of sizes) {
    await generate(s);
  }
  console.log('[icons] Done.');
})();
