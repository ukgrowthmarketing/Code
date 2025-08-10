export function addTask(type, description, id) {
  const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
  const taskId = id || Date.now() + '-' + Math.random().toString(36).slice(2);
  let task = tasks.find(t => t.id === taskId);
  if (!task) {
    task = { id: taskId, type, description, status: 'queued', progress: 0 };
    tasks.push(task);
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
  }
  return taskId;
}

export function updateTask(id, updates) {
  const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
  const task = tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updates);
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

export function getTasks() {
  return JSON.parse(sessionStorage.getItem('tasks') || '[]');
}

export function getTask(id) {
  const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
  return tasks.find(t => t.id === id);
}
