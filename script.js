const url = 'https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/3';

let data = [];

async function cargarDatos() {
  const res = await fetch(url);
  data = await res.json();
  cargarOpciones('Carrera', 'filtroCarrera');
}

function cargarOpciones(columna, idSelect, filtroPrevio = null) {
  const select = document.getElementById(idSelect);
  select.innerHTML = `<option selected disabled>Seleccionar ${columna}</option>`;

  let valores = data;

  if (filtroPrevio) {
    for (let key in filtroPrevio) {
      valores = valores.filter(d => d[key] === filtroPrevio[key]);
    }
  }

  const opciones = [...new Set(valores.map(d => d[columna]).filter(Boolean))];
  opciones.sort().forEach(op => {
    const option = document.createElement('option');
    option.value = op;
    option.textContent = op;
    select.appendChild(option);
  });
}

document.getElementById('filtroCarrera').addEventListener('change', function() {
  cargarOpciones('Ciclo Lectivo', 'filtroCiclo', { 'Carrera': this.value });
  document.getElementById('filtroAnio').innerHTML = `<option selected disabled>Seleccionar Año de Carrera</option>`;
  document.getElementById('filtroMateria').innerHTML = `<option selected disabled>Seleccionar Materia</option>`;
  mostrarResultados([]);
});

document.getElementById('filtroCiclo').addEventListener('change', function() {
  const carrera = document.getElementById('filtroCarrera').value;
  cargarOpciones('Año de Carrera', 'filtroAnio', {
    'Carrera': carrera,
    'Ciclo Lectivo': this.value
  });
  document.getElementById('filtroMateria').innerHTML = `<option selected disabled>Seleccionar Materia</option>`;
  mostrarResultados([]);
});

document.getElementById('filtroAnio').addEventListener('change', function() {
  const carrera = document.getElementById('filtroCarrera').value;
  const ciclo = document.getElementById('filtroCiclo').value;
  cargarOpciones('Materia', 'filtroMateria', {
    'Carrera': carrera,
    'Ciclo Lectivo': ciclo,
    'Año de Carrera': this.value
  });
  mostrarResultados([]);
});

document.getElementById('filtroMateria').addEventListener('change', function() {
  const carrera = document.getElementById('filtroCarrera').value;
  const ciclo = document.getElementById('filtroCiclo').value;
  const anio = document.getElementById('filtroAnio').value;
  const materia = this.value;

  const filtrado = data.filter(d =>
    d['Carrera'] === carrera &&
    d['Ciclo Lectivo'] === ciclo &&
    d['Año de Carrera'] === anio &&
    d['Materia'] === materia
  );

  mostrarResultados(filtrado);
});

function mostrarResultados(filas) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = '';
  if (!filas.length) return;

  filas.forEach(fila => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<a href="${fila.URL}" target="_blank">${fila['Nombre del Archivo']}</a>`;
    contenedor.appendChild(div);
  });
}

cargarDatos();
