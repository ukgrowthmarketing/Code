import { parseFile, parseCSV } from '../utils/fileParser.js';
import { generateBreakdown } from './api.js';

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('scriptFile');
  const file = fileInput.files[0];
  const sheetUrl = document.getElementById('sheetUrl').value.trim();
  const alertDiv = document.getElementById('upload-alert');
  const spinner = document.getElementById('upload-spinner');
  const progress = document.getElementById('upload-progress');
  const bar = progress.querySelector('.progress-bar');
  alertDiv.innerHTML = '';
  if (!file && !sheetUrl) {
    alertDiv.innerHTML = '<div class="alert alert-danger">Please choose a file or enter a Google Sheet URL.</div>';
    return;
  }
  let interval;
  try {
    spinner.classList.remove('d-none');
    progress.classList.remove('d-none');
    bar.style.width = '0%';
    bar.textContent = '0%';
    let pct = 0;
    interval = setInterval(() => {
      pct = Math.min(pct + 10, 90);
      bar.style.width = pct + '%';
      bar.textContent = pct + '%';
    }, 200);
      let lines;
      if (sheetUrl) {
        const url = sheetUrl.replace(/\/edit.*$/, '/export?format=csv');
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Failed to fetch Google Sheet');
        const csv = await resp.text();
        lines = parseCSV(csv);
      } else {
        lines = await parseFile(file);
      }
      if (!lines || !lines.length) throw new Error('No lines found in input');
      const breakdown = await generateBreakdown(lines);
    bar.style.width = '100%';
    bar.textContent = '100%';
    localStorage.setItem('breakdown', JSON.stringify(breakdown));
    window.location.href = 'breakdown.html';
  } catch (err) {
    alertDiv.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    bar.style.width = '0%';
    bar.textContent = '0%';
  } finally {
    clearInterval(interval);
    spinner.classList.add('d-none');
    setTimeout(() => progress.classList.add('d-none'), 500);
  }
});
