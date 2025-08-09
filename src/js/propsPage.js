const form = document.getElementById('props-form');
const data = JSON.parse(localStorage.getItem('props') || '{}');
form.props.value = data.props || '';
form.location.value = data.location || '';
form.lora.value = data.lora || '';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newData = {
    props: form.props.value,
    location: form.location.value,
    lora: form.lora.value
  };
  localStorage.setItem('props', JSON.stringify(newData));
  document.getElementById('props-alert').innerHTML = '<div class="alert alert-success">Saved</div>';
});
