export async function generateBreakdown(lines) {
  const settings = getSettings();
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
    return res.json();
  } catch (err) {
    throw new Error(err.message || 'Breakdown request failed');
  }
}

export async function generateImage(prompt, seed) {
  const settings = getSettings();
  const props = getProps();
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
    return res.json();
  } catch (err) {
    throw new Error(err.message || 'Image generation failed');
  }
}

function getSettings() {
  return JSON.parse(localStorage.getItem('settings') || '{}');
}

function getProps() {
  return JSON.parse(localStorage.getItem('props') || '{}');
}
