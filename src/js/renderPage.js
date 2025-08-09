// Simple drag-and-drop placeholder timeline
const imagesDiv = document.getElementById('render-images');
const timeline = document.getElementById('timeline');

// Load images from tasks that succeeded
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]').filter(t => t.type === 'image' && t.status === 'succeeded');
tasks.forEach(t => {
  const img = document.createElement('img');
  img.src = t.result;
  img.width = 96;
  img.draggable = true;
  img.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', t.result);
  });
  imagesDiv.appendChild(img);
});

timeline.addEventListener('dragover', e => e.preventDefault());
timeline.addEventListener('drop', e => {
  e.preventDefault();
  const src = e.dataTransfer.getData('text/plain');
  const img = document.createElement('img');
  img.src = src;
  img.width = 128;
  img.className = 'me-2 mb-2';
  timeline.appendChild(img);
});
