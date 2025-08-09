import { addTask, updateTask } from './tasks.js';

export async function generateBreakdown(lines) {
  const settings = getSettings();
  const taskId = addTask('breakdown', 'Generating shot breakdown');
  updateTask(taskId, { status: 'running' });
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
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Breakdown request failed');
    }
    const data = await res.json();
    updateTask(taskId, { status: 'succeeded', progress: 100, result: data });
    return data;
  } catch (err) {
    updateTask(taskId, { status: 'failed', progress: 100, error: err.message });
    throw new Error(err.message || 'Breakdown request failed');
  } finally {
    clearInterval(timer);
  }
}

export async function generateImage(prompt, seed) {
  const settings = getSettings();
  const props = getProps();
  const taskId = addTask('image', prompt);
  updateTask(taskId, { status: 'running' });
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(pct + 10, 90);
    updateTask(taskId, { progress: pct });
  }, 200);
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, seed, imageModel: settings.imageModel, props, apiKey: settings.apiKey })
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Image generation failed');
    }
    const data = await res.json();
    updateTask(taskId, { status: 'succeeded', progress: 100, result: data.image });
    return data;
  } catch (err) {
    updateTask(taskId, { status: 'failed', progress: 100, error: err.message });
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
