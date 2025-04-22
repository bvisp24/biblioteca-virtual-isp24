const DATA_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/4";

let data = [];

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(DATA_URL);
  data = await res.json();
  const carreras = getUniqueValues(data, 'Carrera');
  fillSelect(document.getElementById('carrera'), carreras);
});

function getUniqueValues(data, key, filter = {}) {
  return [...new Set(
    data.filter(row => {
      return Object.keys(filter).every(k => row[k] === filter[k]);
    }).map(row => row[key])
  )].filter(Boolean);
}

function fillSelect(selectElement, values) {
  selectElement.innerHTML = '<option value="">Seleccionar uno</option>';
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
  selectElement.classList.remove('hidden');
}

document.getElementById('carrera').addEventListener('change', (e) => {
  const carrera = e.target.value;
  const ciclos = getUniqueValues(data, 'Ciclo Lectivo', { 'Carrera': carrera });
  fillSelect(document.getElementById('ciclo'), ciclos);
});

document.getElementById('ciclo').addEventListener('change', (e) => {
  const carrera = document.getElementById('carrera').value;
  const ciclo = e.target.value;
  const anios = getUniqueValues(data, 'Año de Carrera', { 'Carrera': carrera, 'Ciclo Lectivo': ciclo });
  fillSelect(document.getElementById('anio'), anios);
});

document.getElementById('anio').addEventListener('change', (e) => {
  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclo').value;
  const anio = e.target.value;
  const materias = getUniqueValues(data, 'Materia', { 'Carrera': carrera, 'Ciclo Lectivo': ciclo, 'Año de Carrera': anio });
  fillSelect(document.getElementById('materia'), materias);
});

document.getElementById('materia').addEventListener('change', (e) => {
  const carrera = document.getElementById('carrera').value;
  const ciclo = document.getElementById('ciclo').value;
  const anio = document.getElementById('anio').value;
  const materia = e.target.value;

  const resultados = data.filter(row => 
    row['Carrera'] === carrera &&
    row['Ciclo Lectivo'] === ciclo &&
    row['Año de Carrera'] === anio &&
    row['Materia'] === materia
  );

  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = '';
  resultados.forEach(row => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="pdf-icon.png" alt="PDF" />
      <a href="${row['URL']}" target="_blank">${row['Nombre de Archivo']}</a>
    `;
    contenedor.appendChild(card);
  });
});
