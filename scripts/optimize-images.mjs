// Generates responsive WebP variants for project screenshots.
//
//   Source:  assets/works/<name>.(png|jpg|jpeg|webp)   (originals, not served)
//   Output:  public/uploads/works/<name>-768.webp and <name>-1536.webp
//
// Usage: npm run images
// In Work.jsx, reference the image by its base name: image: '<name>'.
// Sources should be 3:2 (cards use a 3:2 frame with object-cover).
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'assets/works'
const OUT_DIR = 'public/uploads/works'
const WIDTHS  = [768, 1536]
const QUALITY = 80

await mkdir(OUT_DIR, { recursive: true })
const files = (await readdir(SRC_DIR)).filter(f => /\.(png|jpe?g|webp)$/i.test(f))

for (const file of files) {
  const name = path.parse(file).name
  const src  = path.join(SRC_DIR, file)
  const srcMtime = (await stat(src)).mtimeMs
  for (const w of WIDTHS) {
    const out = path.join(OUT_DIR, `${name}-${w}.webp`)
    const fresh = await stat(out).then(s => s.mtimeMs >= srcMtime, () => false)
    if (fresh) continue
    const info = await sharp(src)
      .resize({ width: w, height: Math.round(w * 2 / 3), fit: 'cover', position: 'top' })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out)
    console.log(`${out}  ${(info.size / 1024).toFixed(0)} KB`)
  }
}
