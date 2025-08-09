import { parseFile } from '../utils/fileParser.js';
import { generateBreakdown } from './api.js';

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('scriptFile');
  const file = fileInput.files[0];
  const alertDiv = document.getElementById('upload-alert');
  alertDiv.innerHTML = '';
  if (!file) return;
  try {
    const lines = await parseFile(file);
    const breakdown = await generateBreakdown(lines);
    localStorage.setItem('breakdown', JSON.stringify(breakdown));
    window.location.href = 'breakdown.html';
  } catch (err) {
    alertDiv.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
});
