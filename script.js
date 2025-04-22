const apiUrl = 'https://script.google.com/macros/s/AKfycbwJxUVd3FUGs9vcAkVTgjlagtpGc8YRf0FMZFOICS1kWzHqEZc4bg5F7QFFq8VA_ice/exec';
let allData = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    allData = data;
    populateSelect('carrera', getUniqueValues(data, 'Carrera'));
  } catch (err) {
    console.error('Error al obtener datos:', err);
  }
}

function getUniqueValues(data, key) {
  return [...new Set(data.map(item => item[key]).filter(Boolean))];
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  select.disabled = false;
}

document.getElementById('carrera').addEventListener('change', function () {
  const value = this.value;
  const filtered = allData.filter(item => item.Carrera === value);
  populateSelect('ciclo', getUniqueValues(filtered, 'Ciclo Lectivo'));
  document.getElementById('anio').innerHTML = '<option value="">Seleccionar uno</option>';
  document.getElementById('anio').disabled = true;
  document.getElementById('materia').innerHTML = '<option value="">Seleccionar uno</option>';
  document.getElementById('materia').disabled = true;
  document.getElementById('fileList').innerHTML = '';
});

document.getElementById('ciclo').addEventListener('change', function () {
  const carrera = document.getElementById('carrera').value;
  const ciclo = this.value;
  const filtered = allData.filter(item => item.Carrera === carrera && item['Ciclo Lectivo'] === ciclo);
  populateSelect('anio', getUniqueValues(filtered, 'Año de Carrera'));
  document.getElementById('materia').innerHTML = '<option value="">Seleccionar uno</option>';
  document.getElementById('materia').disabled = true;
  document.getElementById('fileList').innerHTML = '';
});

document.getElementById('anio').addEventListener('change', function () {
  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclo').value;
  const anio = this.value;
  const filtered = allData.filter(item =>
    item.Carrera === carrera &&
    item['Ciclo Lectivo'] === ciclo &&
    item['Año de Carrera'] === anio
  );
  populateSelect('materia', getUniqueValues(filtered, 'Materia'));
  document.getElementById('fileList').innerHTML = '';
});

document.getElementById('materia').addEventListener('change', function () {
  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclo').value;
  const anio = document.getElementById('anio').value;
  const materia = this.value;
  const filtered = allData.filter(item =>
    item.Carrera === carrera &&
    item['Ciclo Lectivo'] === ciclo &&
    item['Año de Carrera'] === anio &&
    item.Materia === materia
  );
  renderCards(filtered);
});

function renderCards(data) {
  const container = document.getElementById('fileList');
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<p>No se encontraron resultados.</p>';
    return;
  }
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<a href="${item.Enlace}" target="_blank">${item.Nombre || 'Ver archivo'}</a>`;
    container.appendChild(card);
  });
}

fetchData();
