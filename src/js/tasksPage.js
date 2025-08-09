import { getTasks } from './tasks.js';

function render() {
  const container = document.getElementById('tasks-container');
  const tasks = getTasks();
  container.innerHTML = '';
  tasks.forEach(task => {
    const col = document.createElement('div');
    col.className = 'col';
    const card = document.createElement('div');
    card.className = 'card h-100';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${task.type}</h5>
        <p class="card-text">${task.description}</p>
        <div class="progress mb-2">
          <div class="progress-bar" role="progressbar" style="width:${task.progress || 0}%">${task.progress || 0}%</div>
        </div>
        <p class="mb-0"><small class="text-${task.status === 'failed' ? 'danger' : task.status === 'succeeded' ? 'success' : 'secondary'}">${task.status}</small></p>
      </div>`;
    if (task.result && task.type === 'image' && task.status === 'succeeded') {
      const img = document.createElement('img');
      img.src = task.result;
      img.className = 'card-img-bottom';
      card.appendChild(img);
    }
    col.appendChild(card);
    container.appendChild(col);
  });
}

render();
setInterval(render, 1000);
