import { parseFile } from '../utils/fileParser.js';
import { generateBreakdown } from './api.js';

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('scriptFile');
  const file = fileInput.files[0];
  const alertDiv = document.getElementById('upload-alert');
  const spinner = document.getElementById('upload-spinner');
  const progress = document.getElementById('upload-progress');
  const bar = progress.querySelector('.progress-bar');
  alertDiv.innerHTML = '';
  if (!file) return;
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
    const lines = await parseFile(file);
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
