export async function generateBreakdown(lines) {
  const settings = getSettings();
  const res = await fetch('/api/shot-breakdown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines, textModel: settings.textModel, apiKey: settings.apiKey })
  });
  if (!res.ok) throw new Error('Breakdown request failed');
  return res.json();
}

export async function generateImage(prompt, seed) {
  const settings = getSettings();
  const props = getProps();
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, seed, imageModel: settings.imageModel, props, apiKey: settings.apiKey })
  });
  if (!res.ok) throw new Error('Image generation failed');
  return res.json();
}

function getSettings() {
  return JSON.parse(localStorage.getItem('settings') || '{}');
}

function getProps() {
  return JSON.parse(localStorage.getItem('props') || '{}');
}
