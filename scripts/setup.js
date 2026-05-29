#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const AAR_URL =
  'https://raw.githubusercontent.com/Nikhil-Cephei/ffmpeg-kit-rn-full-gpl/main/android/ffmpeg-kit-full-gpl.aar';
const AAR_DEST = path.join(__dirname, '..', 'android', 'libs', 'ffmpeg-kit-full-gpl.aar');

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
    console.log('[ffmpeg-kit] Android AAR already present.');
    return;
  }

  fs.mkdirSync(path.dirname(AAR_DEST), {recursive: true});
  console.log('[ffmpeg-kit] Downloading ffmpeg-kit-full-gpl.aar (~57 MB)...');

  try {
    await download(AAR_URL, AAR_DEST);
    console.log('[ffmpeg-kit] AAR ready.');
  } catch (err) {
    console.error('[ffmpeg-kit] Download failed:', err.message);
    process.exit(1);
  }
})();
