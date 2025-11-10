import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.PDF_BASE_URL || 'http://localhost:4173';

const targets = [
  {
    url: '/pdf/en-cv',
    output: 'cv-en.pdf'
  },
  {
    url: '/pdf/ja-rirekisho',
    output: 'ja-rirekisho.pdf'
  },
  {
    url: '/pdf/ja-shokumukeirekisho',
    output: 'ja-shokumukeirekisho.pdf'
  }
];

async function main() {
  const distDownloads = path.join(__dirname, '..', 'dist', 'downloads');
  if (!fs.existsSync(distDownloads)) {
    fs.mkdirSync(distDownloads, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const t of targets) {
    const fullUrl = BASE_URL + t.url;
    console.log(`Generating PDF from ${fullUrl} -> ${t.output}`);
    await page.goto(fullUrl, { waitUntil: 'networkidle' });
    await page.pdf({
      path: path.join(distDownloads, t.output),
      format: 'A4',
      printBackground: true
    });
  }

  await browser.close();
  console.log('PDF generation completed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
