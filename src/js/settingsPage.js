const form = document.getElementById('settings-form');
const settings = JSON.parse(localStorage.getItem('settings') || '{}');
form.apiKey.value = settings.apiKey || '';
form.textModel.value = settings.textModel || '';
form.imageModel.value = settings.imageModel || '';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newSettings = {
    apiKey: form.apiKey.value,
    textModel: form.textModel.value,
    imageModel: form.imageModel.value
  };
  localStorage.setItem('settings', JSON.stringify(newSettings));
  document.getElementById('settings-alert').innerHTML = '<div class="alert alert-success">Saved</div>';
});
