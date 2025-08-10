import { createShotCard } from '../components/ShotCard.js';

const breakdown = JSON.parse(sessionStorage.getItem('breakdown') || '[]');
const container = document.getElementById('images-container');
const progress = document.getElementById('images-progress');
const bar = progress.querySelector('.progress-bar');
const manualBtn = document.getElementById('manualGenerate');
const manualPrompt = document.getElementById('manualPrompt');
const manualRatio = document.getElementById('manualRatio');
const manualAlert = document.getElementById('manual-alert');
let manualIndex = breakdown.length;
let completed = 0;
let total = breakdown.length;
if (total === 0) {
  progress.classList.add('d-none');
  const msg = document.createElement('p');
  msg.textContent = 'No shots to display yet.';
  container.appendChild(msg);
}

function updateBar() {
  completed++;
  const pct = Math.round((completed / total) * 100);
  bar.style.width = pct + '%';
  bar.textContent = pct + '%';
}

breakdown.forEach((shot, idx) => {
  const col = document.createElement('div');
  col.className = 'col';
  const card = createShotCard(shot, idx);
  card.addEventListener('image-loaded', updateBar);
  col.appendChild(card);
  container.appendChild(col);
});

manualBtn.addEventListener('click', () => {
  const prompt = manualPrompt.value.trim();
  manualAlert.innerHTML = '';
  if (!prompt) {
    manualAlert.innerHTML = '<div class="alert alert-danger">Please enter a prompt.</div>';
    return;
  }
  const ratio = manualRatio.value;
  const shot = { 'Respective text-to-image Prompt': prompt, 'Shot description': '', Character: '' };
  const col = document.createElement('div');
  col.className = 'col';
  const card = createShotCard(shot, manualIndex++, false, ratio);
  card.addEventListener('image-loaded', updateBar);
  col.appendChild(card);
  container.prepend(col);
  total++;
  progress.classList.remove('d-none');
});
