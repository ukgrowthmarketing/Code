const breakdown = JSON.parse(localStorage.getItem('breakdown') || '[]');
const tbody = document.querySelector('#breakdown-table tbody');

breakdown.forEach(shot => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${shot.Timecode || ''}</td>
    <td>${shot.Subtitle || ''}</td>
    <td>${shot.Location || ''}</td>
    <td>${shot.Character || ''}</td>
    <td>${shot['Shot angle type'] || ''}</td>
    <td>${shot['Shot description'] || ''}</td>
    <td>${shot['Respective text-to-image Prompt'] || ''}</td>
  `;
  tbody.appendChild(tr);
});
