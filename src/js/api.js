import { addTask, updateTask } from './tasks.js';

export async function generateBreakdown(lines, taskId = 'breakdown') {
  const settings = getSettings();
  const id = addTask('breakdown', 'Generating shot breakdown', taskId);
  updateTask(id, { status: 'running' });
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(pct + 10, 90);
    updateTask(taskId, { progress: pct });
  }, 200);
  try {
    const res = await fetch('/api/shot-breakdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines, textModel: settings.textModel, apiKey: settings.apiKey })
    });
    const data = await res.json().catch(() => { throw new Error('Invalid JSON response'); });
    if (!res.ok) {
      throw new Error(data.error || 'Breakdown request failed');
    }
    updateTask(id, { status: 'succeeded', progress: 100, result: data });
    return data;
  } catch (err) {
    updateTask(id, { status: 'failed', progress: 100, error: err.message });
    throw new Error(err.message || 'Breakdown request failed');
  } finally {
    clearInterval(timer);
  }
}

export async function generateImage(prompt, seed, taskId, ratio = '1:1') {
  const settings = getSettings();
  const props = getProps();
  const id = addTask('image', prompt, taskId);
  updateTask(id, { status: 'running' });
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(pct + 10, 90);
    updateTask(taskId, { progress: pct });
  }, 200);
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, seed, imageModel: settings.imageModel, props, apiKey: settings.apiKey, ratio })
    });
    const data = await res.json().catch(() => { throw new Error('Invalid JSON response'); });
    if (!res.ok) {
      throw new Error(data.error || 'Image generation failed');
    }
    updateTask(id, { status: 'succeeded', progress: 100, result: data.image });
    return data;
  } catch (err) {
    updateTask(id, { status: 'failed', progress: 100, error: err.message });
    throw new Error(err.message || 'Image generation failed');
  } finally {
    clearInterval(timer);
  }
}

function getSettings() {
  return JSON.parse(localStorage.getItem('settings') || '{}');
}

function getProps() {
  return JSON.parse(localStorage.getItem('props') || '{}');
}
