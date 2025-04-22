const DATA_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/4";

let datos = [];

const selects = {
  carrera: document.getElementById('carrera'),
  ciclo: document.getElementById('ciclo'),
  anio: document.getElementById('anio'),
  materia: document.getElementById('materia'),
};

async function cargarDatos() {
  const res = await fetch(DATA_URL);
  datos = await res.json();
  llenarSelect(selects.carrera, obtenerUnicos('Carrera'));
}

function obtenerUnicos(col) {
  const valores = datos.map(d => d[col]).filter(v => v);
  return [...new Set(valores)];
}

function llenarSelect(select, opciones) {
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  opciones.forEach(op => {
    const opt = document.createElement('option');
    opt.value = op;
    opt.textContent = op;
    select.appendChild(opt);
  });
}

function filtrarDatos() {
  let resultados = [...datos];
  if (selects.carrera.value) {
    resultados = resultados.filter(d => d.Carrera === selects.carrera.value);
    llenarSelect(selects.ciclo, obtenerUnicos('Ciclo Lectivo'));
  }
  if (selects.ciclo.value) {
    resultados = resultados.filter(d => d['Ciclo Lectivo'] === selects.ciclo.value);
    llenarSelect(selects.anio, obtenerUnicos('Año de Carrera'));
  }
  if (selects.anio.value) {
    resultados = resultados.filter(d => d['Año de Carrera'] === selects.anio.value);
    llenarSelect(selects.materia, obtenerUnicos('Materia'));
  }
  if (selects.materia.value) {
    resultados = resultados.filter(d => d.Materia === selects.materia.value);
  }
  mostrarResultados(resultados);
}

function mostrarResultados(arr) {
  const contenedor = document.getElementById('resultados');
  contenedor.innerHTML = '';
  arr.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <a href="${d.URL}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" />
        ${d['Nombre del Archivo']}
      </a>
    `;
    contenedor.appendChild(card);
  });
}

Object.values(selects).forEach(select => {
  select.addEventListener('change', filtrarDatos);
});

window.addEventListener('DOMContentLoaded', cargarDatos);
