const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxU6UCDMccEoTeAqi5ESJkA1SoBr1-ExXXXXX/exec"; // reemplaza por tu URL

let data = [];

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch(SCRIPT_URL);
  data = await res.json();
  populateFilters();
  filterData();
});

function populateFilters() {
  const carreraSet = new Set();
  const cicloSet = new Set();
  const añoSet = new Set();
  const materiaSet = new Set();

  data.forEach(item => {
    carreraSet.add(item.Carrera);
    cicloSet.add(item['Ciclo lectivo']);
    añoSet.add(item['Año de carrera']);
    materiaSet.add(item.Materia);
  });

  populateSelect('carrera', carreraSet);
  populateSelect('ciclolectivo', cicloSet);
  populateSelect('añocarrera', añoSet);
  populateSelect('materia', materiaSet);
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">-- Todas --</option>';
  [...values].sort().forEach(val => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = val;
    select.appendChild(opt);
  });
}

function filterData() {
  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclolectivo').value;
  const año = document.getElementById('añocarrera').value;
  const materia = document.getElementById('materia').value;

  const filtered = data.filter(item =>
    (!carrera || item.Carrera === carrera) &&
    (!ciclo || item['Ciclo lectivo'] === ciclo) &&
    (!año || item['Año de carrera'] === año) &&
    (!materia || item.Materia === materia)
  );

  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  if (filtered.length === 0) {
    fileList.innerHTML = '<p>No se encontraron resultados.</p>';
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.Materia}</h3>
      <p><strong>Carrera:</strong> ${item.Carrera}</p>
      <p><strong>Ciclo lectivo:</strong> ${item['Ciclo lectivo']}</p>
      <p><strong>Año:</strong> ${item['Año de carrera']}</p>
      <a href="${item.Enlace}" target="_blank" class="btn">Ver archivo</a>
    `;
    fileList.appendChild(card);
  });
}
