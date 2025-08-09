export function addTask(type, description) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const id = Date.now() + '-' + Math.random().toString(36).slice(2);
  tasks.push({ id, type, description, status: 'queued', progress: 0 });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return id;
}

export function updateTask(id, updates) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const task = tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updates);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

export function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}
