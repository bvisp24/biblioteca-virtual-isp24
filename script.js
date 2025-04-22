const API_URL = 'https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/2';

let allData = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allData = data;
      populateCarreraOptions();
    });
});

function populateCarreraOptions() {
  const carreraSelect = document.getElementById('carrera');
  const carreras = [...new Set(allData.map(row => row['Carrera']).filter(Boolean))];
  carreras.sort().forEach(carrera => {
    const option = document.createElement('option');
    option.value = carrera;
    option.textContent = carrera;
    carreraSelect.appendChild(option);
  });

  carreraSelect.addEventListener('change', () => {
    populateNextSelect('ciclolectivo', ['Carrera']);
  });

  document.getElementById('ciclolectivo').addEventListener('change', () => {
    populateNextSelect('añocarrera', ['Carrera', 'Ciclo lectivo']);
  });

  document.getElementById('añocarrera').addEventListener('change', () => {
    populateNextSelect('materia', ['Carrera', 'Ciclo lectivo', 'Año de carrera']);
  });

  document.getElementById('materia').addEventListener('change', renderResults);
}

function populateNextSelect(id, filters) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  const selected = getSelectedValues(filters);
  const values = allData
    .filter(row => filters.every(f => row[f] === selected[f]))
    .map(row => row[selectIdToColumn(id)])
    .filter(Boolean);

  const unique = [...new Set(values)].sort();
  unique.forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });

  select.disabled = false;
}

function selectIdToColumn(id) {
  return {
    carrera: 'Carrera',
    ciclolectivo: 'Ciclo lectivo',
    añocarrera: 'Año de carrera',
    materia: 'Materia'
  }[id];
}

function getSelectedValues(fields) {
  const result = {};
  fields.forEach(f => {
    const id = Object.entries(selectIdToColumnMap()).find(([, v]) => v === f)[0];
    result[f] = document.getElementById(id).value;
  });
  return result;
}

function selectIdToColumnMap() {
  return {
    carrera: 'Carrera',
    ciclolectivo: 'Ciclo lectivo',
    añocarrera: 'Año de carrera',
    materia: 'Materia'
  };
}

function renderResults() {
  const selected = getSelectedValues(['Carrera', 'Ciclo lectivo', 'Año de carrera', 'Materia']);
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  const filtered = allData.filter(row =>
    Object.entries(selected).every(([key, val]) => row[key] === val)
  );

  if (filtered.length === 0) {
    fileList.innerHTML = '<p>No se encontraron resultados.</p>';
    return;
  }

  filtered.forEach(row => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<a href="${row.URL}" target="_blank">${row['Nombre de archivo']}</a>`;
    fileList.appendChild(card);
  });
}
