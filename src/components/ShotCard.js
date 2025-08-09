import { generateImage } from '../js/api.js';

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

export function createShotCard(shot, index) {
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
        <button class="btn btn-sm btn-secondary me-2" id="repaint-${index}">Repaint</button>
        <button class="btn btn-sm btn-primary" id="regen-${index}">Regenerate</button>
        <a class="btn btn-sm btn-outline-success ms-2" id="download-${index}" download="${makeFilename(shot, index)}">Download</a>
        <div class="alert alert-danger mt-2 d-none" id="error-${index}"></div>
      </div>`;

  async function paint(useSameSeed) {
    const seedInput = document.getElementById(`seed-${index}`);
    if (!useSameSeed) seedInput.value = Math.floor(Math.random()*1e6);
    const seed = Number(seedInput.value);
    const img = document.getElementById(`img-${index}`);
    const spinner = document.getElementById(`spinner-${index}`);
    const progress = document.getElementById(`progress-${index}`);
    const bar = progress.querySelector('.progress-bar');
    const errDiv = document.getElementById(`error-${index}`);
    errDiv.classList.add('d-none');
    spinner.classList.remove('d-none');
    progress.classList.remove('d-none');
    bar.style.width = '0%';
    bar.textContent = '0%';
    img.classList.add('d-none');
    let pct = 0;
    const interval = setInterval(() => {
      pct = Math.min(pct + 10, 90);
      bar.style.width = pct + '%';
      bar.textContent = pct + '%';
    }, 200);
    try {
      const res = await generateImage(shot['Respective text-to-image Prompt'], seed);
      img.src = res.image || '';
      const dl = document.getElementById(`download-${index}`);
      dl.href = img.src;
      const nameInput = document.getElementById(`name-${index}`);
      dl.download = nameInput.value || makeFilename(shot, index);
      img.classList.remove('d-none');
    } catch (err) {
      errDiv.textContent = err.message;
      errDiv.classList.remove('d-none');
    } finally {
      clearInterval(interval);
      bar.style.width = '100%';
      bar.textContent = '100%';
      setTimeout(() => progress.classList.add('d-none'), 500);
      spinner.classList.add('d-none');
    }
  }

  card.querySelector(`#repaint-${index}`).addEventListener('click', () => paint(true));
  card.querySelector(`#regen-${index}`).addEventListener('click', () => paint(false));
  const nameInput = card.querySelector(`#name-${index}`);
  const dlLink = card.querySelector(`#download-${index}`);
  nameInput.addEventListener('input', () => {
    dlLink.download = nameInput.value.trim() || makeFilename(shot, index);
  });
  // initial generate
  paint(true).finally(() => card.dispatchEvent(new Event('image-loaded')));

  return card;
}
