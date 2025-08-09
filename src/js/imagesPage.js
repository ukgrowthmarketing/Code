import { createShotCard } from '../components/ShotCard.js';

const breakdown = JSON.parse(localStorage.getItem('breakdown') || '[]');
const container = document.getElementById('images-container');
<<<<<<< f735rq-codex/build-responsive-multi-page-web-app
const progress = document.getElementById('images-progress');
const bar = progress.querySelector('.progress-bar');
let completed = 0;
const total = breakdown.length;
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
=======
>>>>>>> main

breakdown.forEach((shot, idx) => {
  const col = document.createElement('div');
  col.className = 'col';
<<<<<<< f735rq-codex/build-responsive-multi-page-web-app
  const card = createShotCard(shot, idx);
  card.addEventListener('image-loaded', updateBar);
  col.appendChild(card);
=======
  col.appendChild(createShotCard(shot, idx));
>>>>>>> main
  container.appendChild(col);
});
