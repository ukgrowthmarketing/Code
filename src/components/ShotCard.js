import { generateImage } from '../js/api.js';
import { addTask, getTask, updateTask } from '../js/tasks.js';

function makeFilename(shot, index) {
  const scene = shot.Scene || index + 1;
  const shotNum = index + 1;
  const type = (shot['Shot angle type'] || 'main').replace(/\s+/g, '_');
  const line = (shot.Subtitle || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .substring(0, 20);
  return `scene_${scene}_shot_${shotNum}_${type}_${line}.png`;
}

export function createShotCard(shot, index, autoGenerate = false, ratio = '1:1') {
  const card = document.createElement('div');
  card.className = 'card h-100';
  card.innerHTML = `
      <div class="d-flex justify-content-center my-2 d-none" id="spinner-${index}">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="progress mx-3 mb-2 d-none" id="progress-${index}">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:0%">0%</div>
      </div>
      <img src="" class="card-img-top d-none" alt="shot image" id="img-${index}">
      <div class="card-body">
        <h5 class="card-title">${shot.Character || ''}</h5>
        <p class="card-text">${shot['Shot description'] || ''}</p>
        <p><small>${shot['Respective text-to-image Prompt'] || ''}</small></p>
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text">File</span>
          <input type="text" class="form-control" id="name-${index}" value="${makeFilename(shot, index)}">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">Seed</span>
          <input type="number" class="form-control" id="seed-${index}" value="${Math.floor(Math.random()*1e6)}">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text">Aspect</span>
          <select class="form-select form-select-sm" id="ratio-${index}">
            <option value="1:1" ${ratio === '1:1' ? 'selected' : ''}>1:1</option>
            <option value="16:9" ${ratio === '16:9' ? 'selected' : ''}>16:9</option>
            <option value="9:16" ${ratio === '9:16' ? 'selected' : ''}>9:16</option>
            <option value="21:9" ${ratio === '21:9' ? 'selected' : ''}>21:9</option>
          </select>
        </div>
        <button class="btn btn-sm btn-primary me-2" id="generate-${index}">Generate</button>
        <button class="btn btn-sm btn-secondary me-2 d-none" id="repaint-${index}">Repaint</button>
        <button class="btn btn-sm btn-primary d-none" id="regen-${index}">Regenerate</button>
        <a class="btn btn-sm btn-outline-success ms-2 d-none" id="download-${index}" download="${makeFilename(shot, index)}">Download</a>
        <div class="alert alert-danger mt-2 d-none" id="error-${index}"></div>
      </div>`;

  const taskId = `image-${index}`;
  const generateBtn = card.querySelector(`#generate-${index}`);
  const repaintBtn = card.querySelector(`#repaint-${index}`);
  const regenBtn = card.querySelector(`#regen-${index}`);
  const dlLink = card.querySelector(`#download-${index}`);
  const nameInput = card.querySelector(`#name-${index}`);

  async function paint(mode = 'generate') {
    const seedInput = document.getElementById(`seed-${index}`);
    if (mode === 'regen') seedInput.value = Math.floor(Math.random()*1e6);
    const seed = Number(seedInput.value);
    const ratioSel = document.getElementById(`ratio-${index}`);
    const ratioVal = ratioSel.value;
    const img = document.getElementById(`img-${index}`);
    const spinner = document.getElementById(`spinner-${index}`);
    const progress = document.getElementById(`progress-${index}`);
    const bar = progress.querySelector('.progress-bar');
    const errDiv = document.getElementById(`error-${index}`);
    errDiv.classList.add('d-none');
    addTask('image', shot['Respective text-to-image Prompt'], taskId);
    updateTask(taskId, { status: 'queued', progress: 0 });
    spinner.classList.remove('d-none');
    progress.classList.remove('d-none');
    bar.style.width = '0%';
    bar.textContent = '0%';
    img.classList.add('d-none');
    dlLink.classList.add('d-none');
    generateBtn.disabled = repaintBtn.disabled = regenBtn.disabled = true;
    let pct = 0;
    const interval = setInterval(() => {
      pct = Math.min(pct + 10, 90);
      bar.style.width = pct + '%';
      bar.textContent = pct + '%';
    }, 200);
    try {
      const res = await generateImage(shot['Respective text-to-image Prompt'], seed, taskId, ratioVal);
      img.src = res.image || '';
      dlLink.href = img.src;
      dlLink.download = nameInput.value.trim() || makeFilename(shot, index);
      img.classList.remove('d-none');
      generateBtn.classList.add('d-none');
      repaintBtn.classList.remove('d-none');
      regenBtn.classList.remove('d-none');
      dlLink.classList.remove('d-none');
      card.dispatchEvent(new Event('image-loaded'));
    } catch (err) {
      errDiv.textContent = err.message;
      errDiv.classList.remove('d-none');
    } finally {
      clearInterval(interval);
      bar.style.width = '100%';
      bar.textContent = '100%';
      setTimeout(() => progress.classList.add('d-none'), 500);
      spinner.classList.add('d-none');
      generateBtn.disabled = repaintBtn.disabled = regenBtn.disabled = false;
    }
  }

  generateBtn.addEventListener('click', () => paint('generate'));
  repaintBtn.addEventListener('click', () => paint('repaint'));
  regenBtn.addEventListener('click', () => paint('regen'));
  nameInput.addEventListener('input', () => {
    dlLink.download = nameInput.value.trim() || makeFilename(shot, index);
  });

  const existing = getTask(taskId);
  if (existing && existing.status === 'succeeded' && existing.result) {
    const img = document.getElementById(`img-${index}`);
    const progress = document.getElementById(`progress-${index}`);
    const bar = progress.querySelector('.progress-bar');
    img.src = existing.result;
    img.classList.remove('d-none');
    bar.style.width = '100%';
    bar.textContent = '100%';
    progress.classList.add('d-none');
    generateBtn.classList.add('d-none');
    repaintBtn.classList.remove('d-none');
    regenBtn.classList.remove('d-none');
    dlLink.href = existing.result;
    dlLink.classList.remove('d-none');
    card.dispatchEvent(new Event('image-loaded'));
  } else if (autoGenerate) {
    paint('generate');
  }

  return card;
}
