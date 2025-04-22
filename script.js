const DATA_URL = 'https://script.google.com/macros/s/AKfycbwJxUVd3FUGs9vcAkVTgjlagtpGc8YRf0FMZFOICS1kWzHqEZc4bg5F7QFFq8VA_ice/exec';
let data = [];

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch(DATA_URL);
  data = await response.json();

  populateCarrera();
});

function populateCarrera() {
  const carreraSelect = document.getElementById('carrera');
  const carreras = [...new Set(data.map(row => row.Carrera))];
  carreras.sort().forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    carreraSelect.appendChild(option);
  });
}

function handleCarrera() {
  resetSelect('ciclolectivo');
  resetSelect('añocarrera');
  resetSelect('materia');
  disableSelectsFrom('ciclolectivo');

  const carrera = document.getElementById('carrera').value;
  if (!carrera) return;

  const filtered = data.filter(row => row.Carrera === carrera);
  const ciclos = [...new Set(filtered.map(row => row["Ciclo Lectivo"]))];

  const cicloSelect = document.getElementById('ciclolectivo');
  ciclos.sort().forEach(cl => {
    const option = document.createElement('option');
    option.value = cl;
    option.textContent = cl;
    cicloSelect.appendChild(option);
  });

  cicloSelect.disabled = false;
}

function handleCicloLectivo() {
  resetSelect('añocarrera');
  resetSelect('materia');
  disableSelectsFrom('añocarrera');

  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclolectivo').value;
  if (!carrera || !ciclo) return;

  const filtered = data.filter(row => row.Carrera === carrera && row["Ciclo Lectivo"] === ciclo);
  const años = [...new Set(filtered.map(row => row["Año de Carrera"]))];

  const añoSelect = document.getElementById('añocarrera');
  años.sort().forEach(a => {
    const option = document.createElement('option');
    option.value = a;
    option.textContent = a;
    añoSelect.appendChild(option);
  });

  añoSelect.disabled = false;
}

function handleAnioCarrera() {
  resetSelect('materia');
  disableSelectsFrom('materia');

  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclolectivo').value;
  const anio = document.getElementById('añocarrera').value;

  if (!carrera || !ciclo || !anio) return;

  const filtered = data.filter(
    row => row.Carrera === carrera && row["Ciclo Lectivo"] === ciclo && row["Año de Carrera"] === anio
  );
  const materias = [...new Set(filtered.map(row => row.Materia))];

  const materiaSelect = document.getElementById('materia');
  materias.sort().forEach(m => {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = m;
    materiaSelect.appendChild(option);
  });

  materiaSelect.disabled = false;
}

function filterData() {
  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclolectivo').value;
  const anio = document.getElementById('añocarrera').value;
  const materia = document.getElementById('materia').value;

  const filtered = data.filter(row =>
    row.Carrera === carrera &&
    row["Ciclo Lectivo"] === ciclo &&
    row["Año de Carrera"] === anio &&
    row.Materia === materia
  );

  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  filtered.forEach(row => {
    const card = document.createElement('div');
    card.className = 'card';

    const link = document.createElement('a');
    link.href = row.URL;
    link.target = '_blank';
    link.textContent = getFileNameFromUrl(row.URL);

    card.appendChild(link);
    fileList.appendChild(card);
  });
}

function getFileNameFromUrl(url) {
  try {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split('/');
    return parts[parts.length - 1] || 'Archivo';
  } catch {
    return 'Archivo';
  }
}

function resetSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
}

function disableSelectsFrom(startId) {
  const order = ['carrera', 'ciclolectivo', 'añocarrera', 'materia'];
  let disable = false;
  order.forEach(id => {
    if (id === startId) disable = true;
    if (disable) document.getElementById(id).disabled = true;
  });
}
