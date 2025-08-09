import { generateImage } from '../js/api.js';

export function createShotCard(shot, index) {
  const card = document.createElement('div');
  card.className = 'card h-100';
  card.innerHTML = `
    <img src="" class="card-img-top" alt="shot image" id="img-${index}">
    <div class="card-body">
      <h5 class="card-title">${shot.Character || ''}</h5>
      <p class="card-text">${shot['Shot description'] || ''}</p>
      <p><small>${shot['Respective text-to-image Prompt'] || ''}</small></p>
      <div class="input-group mb-2">
        <span class="input-group-text">Seed</span>
        <input type="number" class="form-control" id="seed-${index}" value="${Math.floor(Math.random()*1e6)}">
      </div>
      <button class="btn btn-sm btn-secondary me-2" id="repaint-${index}">Repaint</button>
      <button class="btn btn-sm btn-primary" id="regen-${index}">Regenerate</button>
      <a class="btn btn-sm btn-outline-success ms-2" id="download-${index}" download="shot-${index}.png">Download</a>
    </div>`;

  async function paint(useSameSeed) {
    const seedInput = document.getElementById(`seed-${index}`);
    if (!useSameSeed) seedInput.value = Math.floor(Math.random()*1e6);
    const seed = Number(seedInput.value);
    const img = document.getElementById(`img-${index}`);
    img.src = 'https://via.placeholder.com/512?text=Loading';
    try {
      const res = await generateImage(shot['Respective text-to-image Prompt'], seed);
      img.src = res.image || '';
      const dl = document.getElementById(`download-${index}`);
      dl.href = img.src;
    } catch (err) {
      console.error(err);
      img.alt = 'Error';
    }
  }

  card.querySelector(`#repaint-${index}`).addEventListener('click', () => paint(true));
  card.querySelector(`#regen-${index}`).addEventListener('click', () => paint(false));
  // initial generate
  paint(true);

  return card;
}
