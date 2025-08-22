import { registerModule, getRegistry, toggleFeature, toggleModule, loadScript } from './moduleManager.js';

// Register default modules and features
registerModule('2D Animation', 'Scriptwriting', [
  'Generate Script',
  'Rewrite Script',
  'Character Generation',
  'Dialogue Generation'
]);
registerModule('2D Animation', 'Character Design', [
  'Generate Characters',
  'Customizable Features',
  'Character Expressions'
]);
registerModule('2D Animation', 'Animation', [
  'Auto Animation',
  'Background Generation',
  'Frame Generation'
]);
registerModule('3D Animation', '3D Modelling', [
  'Model Generation',
  'Motion Capture',
  'Rendering'
]);
registerModule('Live Action Filmmaking', 'Pre-Production', [
  'Storyboarding',
  'Location Scouting'
]);
registerModule('Live Action Filmmaking', 'Post-Production', [
  'Color Grading',
  'Special Effects'
]);

const container = document.getElementById('control-panel');
const registry = getRegistry();

for (const [category, modules] of Object.entries(registry)) {
  const catDiv = document.createElement('div');
  const catHeader = document.createElement('h2');
  catHeader.textContent = category;
  catDiv.appendChild(catHeader);

  for (const [module, data] of Object.entries(modules)) {
    const modDiv = document.createElement('div');
    const modHeader = document.createElement('h3');
    modHeader.textContent = module;
    const modToggle = document.createElement('input');
    modToggle.type = 'checkbox';
    modToggle.checked = data.enabled;
    modToggle.addEventListener('change', e => toggleModule(category, module, e.target.checked));
    modHeader.prepend(modToggle);
    modDiv.appendChild(modHeader);

    data.features.forEach(feature => {
      const label = document.createElement('label');
      label.style.display = 'block';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = feature.enabled;
      checkbox.addEventListener('change', e => toggleFeature(category, module, feature.name, e.target.checked));
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + feature.name));
      modDiv.appendChild(label);
    });
    catDiv.appendChild(modDiv);
  }
  container.appendChild(catDiv);
}

// Upload custom modules
const uploadForm = document.getElementById('upload-form');
uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  const files = document.getElementById('module-file').files;
  if (!files.length) return;
  const formData = new FormData();
  [...files].forEach(f => formData.append('files', f));
  const res = await fetch('/api/upload-module', {
    method: 'POST',
    body: formData
  });
  if (res.ok) {
    const { files: uploaded } = await res.json();
    // Dynamically load uploaded scripts
    for (const f of uploaded) {
      if (f.endsWith('.js')) {
        await loadScript(`/develop/${f}`);
      }
    }
    alert('Uploaded');
  } else {
    alert('Upload failed');
  }
  uploadForm.reset();
});
