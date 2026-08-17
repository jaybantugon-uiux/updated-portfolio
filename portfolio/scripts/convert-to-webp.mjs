/**
 * One-off script: converts all PNG assets in src/assets to WebP at quality 80.
 * Run once with: node scripts/convert-to-webp.mjs
 * The originals are kept — imports in JSX need to be updated to point at .webp files.
 */
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '../src/assets');

const files = await readdir(assetsDir);
const pngs = files.filter(f => extname(f).toLowerCase() === '.png');

for (const file of pngs) {
  const input  = join(assetsDir, file);
  const output = join(assetsDir, basename(file, '.png') + '.webp');
  await sharp(input).webp({ quality: 80 }).toFile(output);
  console.log(`✓ ${file} → ${basename(output)}`);
}

console.log('\nDone. Update imports in JSX from .png to .webp, then delete the original PNGs.');
