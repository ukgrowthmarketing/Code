import { createShotCard } from '../components/ShotCard.js';

const breakdown = JSON.parse(localStorage.getItem('breakdown') || '[]');
const container = document.getElementById('images-container');

breakdown.forEach((shot, idx) => {
  const col = document.createElement('div');
  col.className = 'col';
  col.appendChild(createShotCard(shot, idx));
  container.appendChild(col);
});
