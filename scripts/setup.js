#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const AAR_URL =
  'https://raw.githubusercontent.com/Nikhil-Cephei/ffmpeg-kit-rn-full-gpl/main/android/ffmpeg-kit-full-gpl.aar';
const AAR_DEST = path.join(__dirname, '..', 'android', 'libs', 'ffmpeg-kit-full-gpl.aar');

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlink(dest, () => {});
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const total = parseInt(res.headers['content-length'] || '0', 10);
        let downloaded = 0;
        let lastPct = -1;

        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (total > 0) {
            const pct = Math.floor((downloaded / total) * 100);
            // Print a new line every 10 % so the log isn't too noisy
            if (pct !== lastPct && pct % 10 === 0) {
              lastPct = pct;
              process.stdout.write(
                `[ffmpeg-kit] Downloading... ${pct}% (${formatBytes(downloaded)} / ${formatBytes(total)})\n`,
              );
            }
          } else {
            // No content-length — just show bytes received every ~5 MB
            if (Math.floor(downloaded / (5 * 1024 * 1024)) > Math.floor((downloaded - chunk.length) / (5 * 1024 * 1024))) {
              process.stdout.write(`[ffmpeg-kit] Downloading... ${formatBytes(downloaded)} received\n`);
            }
          }
        });

        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      })
      .on('error', reject);
  });
}

(async () => {
  if (fs.existsSync(AAR_DEST)) {
    console.log('[ffmpeg-kit] Android AAR already present, skipping download.');
    return;
  }

  fs.mkdirSync(path.dirname(AAR_DEST), {recursive: true});
  console.log('[ffmpeg-kit] Downloading ffmpeg-kit-full-gpl.aar (~57 MB) — this may take a minute...');

  try {
    await download(AAR_URL, AAR_DEST);
    console.log('[ffmpeg-kit] AAR download complete.');
  } catch (err) {
    console.error('[ffmpeg-kit] Download failed:', err.message);
    process.exit(1);
  }
})();
