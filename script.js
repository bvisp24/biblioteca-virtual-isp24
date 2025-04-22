const API_URL = "https://script.google.com/macros/library/d/1vu2hz6iY5DM_h2MJHL0V-Mgg_cWCmYjs5elyefBsDWC7WsagcUuODVOT/3";

let datos = [];

const selects = {
  carrera: document.getElementById("carrera"),
  ciclo: document.getElementById("ciclo"),
  anio: document.getElementById("anio"),
  materia: document.getElementById("materia"),
};

const resultados = document.getElementById("resultados");

function limpiarSelect(select) {
  select.innerHTML = '<option value="">Seleccionar uno</option>';
  select.disabled = true;
}

function cargarOpciones(select, opciones) {
  limpiarSelect(select);
  opciones.forEach(op => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    select.appendChild(option);
  });
  select.disabled = false;
}

function filtrarDatos() {
  let filtrados = datos;
  if (selects.carrera.value) filtrados = filtrados.filter(d => d.Carrera === selects.carrera.value);
  if (selects.ciclo.value) filtrados = filtrados.filter(d => d["Ciclo Lectivo"] === selects.ciclo.value);
  if (selects.anio.value) filtrados = filtrados.filter(d => d["Año de Carrera"] === selects.anio.value);
  if (selects.materia.value) filtrados = filtrados.filter(d => d.Materia === selects.materia.value);

  mostrarResultados(filtrados);
}

function mostrarResultados(filas) {
  resultados.innerHTML = "";
  if (filas.length === 0) {
    resultados.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  filas.forEach(fila => {
    const card = document.createElement("div");
    card.className = "card";

    const enlace = document.createElement("a");
    enlace.href = fila.URL;
    enlace.textContent = fila["Nombre de Archivo"];
    enlace.target = "_blank";

    card.appendChild(enlace);
    resultados.appendChild(card);
  });
}

function obtenerUnicos(campo, filtro) {
  return [...new Set(
    datos
      .filter(filtro)
      .map(d => d[campo])
      .filter(v => v && v.trim() !== "")
  )];
}

fetch(API_URL)
  .then(res => res.json())
  .then(json => {
    datos = json;

    const carreras = obtenerUnicos("Carrera", () => true);
    cargarOpciones(selects.carrera, carreras);

    selects.carrera.addEventListener("change", () => {
      const ciclos = obtenerUnicos("Ciclo Lectivo", d => d.Carrera === selects.carrera.value);
      cargarOpciones(selects.ciclo, ciclos);
      limpiarSelect(selects.anio);
      limpiarSelect(selects.materia);
      mostrarResultados([]);
    });

    selects.ciclo.addEventListener("change", () => {
      const anios = obtenerUnicos("Año de Carrera", d =>
        d.Carrera === selects.carrera.value && d["Ciclo Lectivo"] === selects.ciclo.value
      );
      cargarOpciones(selects.anio, anios);
      limpiarSelect(selects.materia);
      mostrarResultados([]);
    });

    selects.anio.addEventListener("change", () => {
      const materias = obtenerUnicos("Materia", d =>
        d.Carrera === selects.carrera.value &&
        d["Ciclo Lectivo"] === selects.ciclo.value &&
        d["Año de Carrera"] === selects.anio.value
      );
      cargarOpciones(selects.materia, materias);
      mostrarResultados([]);
    });

    selects.materia.addEventListener("change", filtrarDatos);
  })
  .catch(error => {
    console.error("Aqui se mostraran los resultados:", error);
    resultados.innerHTML = "<p>Aqui se mostraran los resultados</p>";
  });
